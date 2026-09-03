/**
 * Work Center View
 *
 * Shell adapter for the module-based WorkCenter implementation.
 */

import { takeSkuHandoff } from "com/config/ecosystem-skus";
import { flushHeldIngressToWorkCenter, peekHeldIngressFiles, registerWorkCenterFlushHost } from "com/routing/channel/sku-ingress";
import { loadAsAdopted, removeAdopted } from "@fest-lib/style-lib";
import { type BaseViewOptions } from "views/types";
import { queryLiveWorkCenterChats, WorkCenterManager } from "./ts/WorkCenter";
import type { WorkCenterDependencies } from "./ts/WorkCenterState";

// @ts-ignore - SCSS import
import workcenterStyles from "./scss/_index.scss?inline";
import { defineElement } from "@fest-lib/lure";
import { UIElement } from "@fest-lib/fl-ui";

/**
 * WHY: `document.adoptedStyleSheets` entries are global; closing one floating window must not unmount styles for another.
 * WHY: `mountViewModule` runs `render()` before `connectedCallback`/`onMount`, so consumers may attach DOM before CE lifecycle runs.
 */
const workcenterDocumentStyles = (() => {
    let consumers = 0;
    let sheet: CSSStyleSheet | null = null;
    return {
        acquire(): CSSStyleSheet | null {
            const next = loadAsAdopted(workcenterStyles) as CSSStyleSheet | null;
            if (next) sheet = next;
            if (sheet) consumers += 1;
            return sheet;
        },
        release(): void {
            if (consumers <= 0 || !sheet) return;
            consumers -= 1;
            if (consumers === 0) {
                removeAdopted(sheet);
                sheet = null;
            }
        }
    };
})();

export interface WorkCenterOptions extends BaseViewOptions {
    initialFiles?: File[];
    initialPrompt?: string;
    onProcessComplete?: (result: string) => void;
    onFilesChange?: (files: File[]) => void;
}

type WorkCenterMessageData = {
    file?: File;
    files?: File[];
    text?: string;
    content?: string;
    url?: string;
    filename?: string;
    source?: string;
};

type WorkCenterInboundMessage = {
    id?: string;
    type?: string;
    contentType?: string;
    data?: WorkCenterMessageData;
};

// @ts-ignore
@defineElement("cw-workcenter-view")
export class WorkCenterView extends UIElement implements View {
    id = "workcenter" as const;
    name = "Work Center";
    icon = "lightning";

    private options: WorkCenterOptions;
    private shellContext?: ShellContext;
    private element: HTMLElement | null = null;
    private manager: WorkCenterManager | null = null;
    private deps: WorkCenterDependencies;
    private initializedFromOptions = false;
    private lastOutputText = "";
    private pendingRenderAfterMount = false;
    private resultObserver: MutationObserver | null = null;
    private _sheet: CSSStyleSheet | null = null;
    private processedInboundMessageIds = new Set<string>();
    private pendingMessages: WorkCenterInboundMessage[] = [];
    /** True after this instance acquired a refcount on the shared workcenter document stylesheet. */
    private leasedDocumentStyles = false;
    private unbindFlushHost: (() => void) | null = null;

    lifecycle: ViewLifecycle = {
        onMount: () => this.onMount(),
        onUnmount: () => this.onUnmount(),
        onShow: () => this.onShow(),
        onHide: () => this.onHide()
    };

    constructor(options: WorkCenterOptions = {}) {
        super();
        this.options = options;
        this.shellContext = options.shellContext;

        this.deps = {
            state: {},
            history: [],
            getSpeechPrompt: async () => null,
            showMessage: (message: string) => this.showMessage(message),
            render: () => this.requestRender(),
            navigate: (viewId: string) => this.shellContext?.navigate(viewId as Parameters<ShellContext["navigate"]>[0]),
            onFilesChanged: () => this.emitFilesChanged()
        };
    }
    /**
     * GLitElement calls `render(weakRef)` when the host is connected; the shell calls `render(options?)`.
     * Only merge real view options — never a WeakRef from GLit.
     */
    private isGlitterWeakRef(arg: unknown): arg is WeakRef<HTMLElement> {
        return Boolean(arg && typeof (arg as WeakRef<HTMLElement>).deref === "function");
    }

    /** Ensure constructable sheet is on `document` and optional CE shadow (standalone embedded host). */
    private leaseWorkCenterDocumentStyles(): CSSStyleSheet | null {
        if (this.leasedDocumentStyles) return this._sheet;
        const sheet = workcenterDocumentStyles.acquire();
        if (sheet) {
            this._sheet = sheet;
            this.leasedDocumentStyles = true;
        }
        return sheet;
    }

    private ensureWorkCenterStylesOnShadow(): void {
        const sheet = this.leaseWorkCenterDocumentStyles();
        const root = this.shadowRoot;
        if (!sheet || !root?.adoptedStyleSheets) return;
        if (!root.adoptedStyleSheets.includes(sheet)) {
            root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
        }
    }

    override onInitialize(): this {
        const self = super.onInitialize();
        this.ensureWorkCenterStylesOnShadow();
        return (self ?? this) as this;
    }

    /** Shell passes `ViewOptions`; GLitElement passes a `WeakRef` — ignore the latter for option merging. */
    render = (weakOrOptions?: unknown): HTMLElement => {
        const fromGlit = this.isGlitterWeakRef(weakOrOptions);
        const options = fromGlit ? undefined : (weakOrOptions as ViewOptions | undefined);
        if (options) {
            this.options = { ...this.options, ...options };
            this.shellContext = options.shellContext || this.shellContext;
        }

        this.manager ??= new WorkCenterManager(this.deps);
        if (!this.initializedFromOptions) {
            this.applyInitialOptions();
            this.initializedFromOptions = true;
        }
        this.unbindFlushHost ??= registerWorkCenterFlushHost(this);

        /* WHY: Window-frame path never connects `cw-workcenter-view`, so `onInitialize`/`onMount` run only after this subtree exists unless we load early. */
        this.leaseWorkCenterDocumentStyles();

        const live = this.connectedChat() ?? this.element;
        if (live?.querySelector("[data-workcenter-composer]")) {
            this.element = live;
            this.manager.adoptLiveRoot(live);
            if (live.isConnected) this.manager.paintLiveConversation();
            this.syncPromptInputFromState();
            this.setupProcessResultObserver();
            this.emitFilesChanged();
            return this.hostForShell(fromGlit);
        }

        this.element = this.manager.renderWorkCenterView();
        this.syncPromptInputFromState();
        this.setupProcessResultObserver();
        this.emitFilesChanged();
        /**
         * Return the CE to the shell. GLit gets a `<slot>` so the chat stays in light DOM.
         * WHY: share/flush/`querySelector("cw-workcenter-view")` missed the disconnected host
         * while the visible tree was only `.workcenter-chat`.
         */
        return this.hostForShell(fromGlit);
    }

    /** Shell mounts this host; GLit projects light-DOM chat through a shadow slot. */
    private hostForShell(fromGlit: boolean): HTMLElement {
        this.style.display = "flex";
        this.style.flexDirection = "column";
        this.style.flex = "1";
        this.style.minHeight = "0";
        this.style.height = "100%";
        if (this.element && this.element.parentNode !== this) {
            this.replaceChildren(this.element);
        }
        if (fromGlit) {
            const slot = document.createElement("slot");
            return slot;
        }
        return this;
    }

    getToolbar(): HTMLElement | null {
        return null;
    }

    private normalizeInitialDataMessage(initialData: unknown): WorkCenterInboundMessage | null {
        if (!initialData) return null;

        if (typeof initialData === "string") {
            return {
                type: "content-share",
                contentType: "text",
                data: {
                    text: initialData,
                    content: initialData
                }
            };
        }

        if (initialData instanceof File) {
            return {
                type: "content-share",
                contentType: initialData.type || "application/octet-stream",
                data: {
                    file: initialData,
                    filename: initialData.name
                }
            };
        }

        if (Array.isArray(initialData)) {
            const files = initialData.filter((entry): entry is File => entry instanceof File);
            if (files.length > 0) {
                return {
                    type: "content-share",
                    contentType: files[0]?.type || "application/octet-stream",
                    data: {
                        file: files[0],
                        files,
                        filename: files[0]?.name
                    }
                };
            }
            return null;
        }

        if (typeof initialData !== "object") return null;

        const record = initialData as Record<string, unknown>;
        const nestedData = (record.data && typeof record.data === "object")
            ? (record.data as Record<string, unknown>)
            : record;
        const files = Array.isArray(nestedData.files)
            ? nestedData.files.filter((entry): entry is File => entry instanceof File)
            : undefined;
        const file = nestedData.file instanceof File ? nestedData.file : files?.[0];
        const text = typeof nestedData.text === "string" ? nestedData.text : undefined;
        const content = typeof nestedData.content === "string" ? nestedData.content : undefined;
        const url = typeof nestedData.url === "string" ? nestedData.url : undefined;
        const filename = typeof nestedData.filename === "string" ? nestedData.filename : file?.name;
        const source = typeof nestedData.source === "string" ? nestedData.source : undefined;

        if (!file && !(files?.length) && !text && !content && !url) return null;

        return {
            type: typeof record.type === "string" ? record.type : "content-share",
            contentType: typeof record.contentType === "string"
                ? record.contentType
                : (file?.type || "text"),
            data: {
                file,
                files,
                text,
                content,
                url,
                filename,
                source
            }
        };
    }

    async addFiles(files: File[]): Promise<void> {
        if (!this.manager || files.length === 0) return;
        await this.manager.addFiles(files);
    }

    async setPrompt(prompt: string): Promise<void> {
        await this.manager?.setPrompt(prompt);
        this.syncPromptInputFromState();
    }

    getFiles(): File[] {
        return [...(this.manager?.getState().files || [])];
    }

    canHandleMessage(messageType: string): boolean {
        return [
            "content-attach",
            "content-process",
            "file-attach",
            "share-target-input",
            "share-received",
            "share-target-result",
            "ai-result",
            "process-api-result",
            "content-share"
        ].includes(messageType);
    }

    async handleMessage(message: unknown): Promise<void> {
        const msg = message as WorkCenterInboundMessage;

        if (!this.manager) {
            if (this.pendingMessages.length >= 64) this.pendingMessages.shift();
            this.pendingMessages.push(msg);
            return;
        }
        await this.handleMessageWithManager(msg);
    }

    /** Stable imperative entry for channels — mirrors {@link handleMessage} shapes. */
    async invokeChannelApi(action: string, payload?: unknown): Promise<boolean> {
        let data: WorkCenterMessageData | undefined;
        if (payload != null && typeof payload === "object" && !Array.isArray(payload)) {
            data = payload as WorkCenterMessageData;
        } else if (Array.isArray(payload) && payload.length > 0 && payload.every((f): f is File => f instanceof File)) {
            data = { files: payload };
        } else if (payload instanceof File) {
            data = { file: payload };
        } else if (typeof payload === "string") {
            data = { text: payload };
        }
        await this.handleMessage({ type: action, data });
        return true;
    }

    private async handleMessageWithManager(msg: WorkCenterInboundMessage): Promise<void> {
        if (!this.manager) return;

        const mid = typeof msg.id === "string" ? msg.id.trim() : "";
        if (mid) {
            if (this.processedInboundMessageIds.has(mid)) return;
            this.processedInboundMessageIds.add(mid);
            if (this.processedInboundMessageIds.size > 256) {
                const iter = this.processedInboundMessageIds.values().next();
                if (!iter.done) this.processedInboundMessageIds.delete(iter.value);
            }
        }

        if (msg.type === "share-target-input" || msg.type === "share-received" || msg.type === "share-target-result" || msg.type === "ai-result" || msg.type === "process-api-result") {
            await this.manager.handleExternalMessage(msg as any);
            this.emitFilesChanged();
            return;
        }

        // Unified ingress (view channel + transfers) — single path through manager for dedupe + fingerprints.
        if (msg.type === "content-share" || msg.type === "content-attach" || msg.type === "file-attach") {
            await this.manager.handleExternalMessage(msg as any);
            this.emitFilesChanged();
            return;
        }

        if (msg.data?.file) {
            await this.addFiles([msg.data.file]);
        }
        if (msg.data?.files?.length) {
            await this.addFiles(msg.data.files);
        }

        const prompt = msg.data?.text || msg.data?.content || msg.data?.url || "";
        if (prompt.trim()) {
            await this.setPrompt(prompt);
        }

        if (msg.type === "content-process") {
            const executeBtn = this.element?.querySelector('[data-action="execute"]') as HTMLButtonElement | null;
            executeBtn?.click();
        }
    }

    private async flushPendingMessages(): Promise<void> {
        if (!this.manager || this.pendingMessages.length === 0) return;
        const queue = this.pendingMessages.splice(0, this.pendingMessages.length);
        for (const message of queue) {
            const msg = message as WorkCenterInboundMessage;
            await this.handleMessageWithManager(msg);
        }
    }

    private applyInitialOptions(): void {
        if (!this.manager) return;

        if (Array.isArray(this.options.initialFiles) && this.options.initialFiles.length > 0) {
            this.pendingMessages.unshift({
                type: "content-attach",
                data: { files: this.options.initialFiles }
            });
        }
        if (typeof this.options.initialPrompt === "string" && this.options.initialPrompt.trim()) {
            this.pendingMessages.unshift({
                type: "content-share",
                data: { text: this.options.initialPrompt }
            });
        }

        const initialMessage = this.normalizeInitialDataMessage(this.options.initialData);
        if (initialMessage) {
            this.pendingMessages.unshift(initialMessage);
        }
        const handoff = takeSkuHandoff("workcenter", "process");
        if (handoff && (handoff.content || handoff.filename)) {
            this.pendingMessages.unshift({
                type: "content-attach",
                contentType: "file",
                data: {
                    text: handoff.content,
                    filename: handoff.filename,
                    source: "sku-handoff",
                    hint: { action: "attach", filename: handoff.filename }
                }
            });
        }
    }

    private syncPromptInputFromState(): void {
        const state = this.manager?.getState();
        if (!state || !this.element) return;
        const promptInput = this.element.querySelector(".prompt-input") as HTMLTextAreaElement | null;
        if (promptInput) {
            promptInput.value = state.currentPrompt || "";
            //promptInput.style.minBlockSize = "stretch";
            //promptInput.style.minBlockSize = `${Math.max(promptInput.scrollHeight, 1)}px`;
        }
    }

    private setupProcessResultObserver(): void {
        this.resultObserver?.disconnect();
        if (!this.element || !this.options.onProcessComplete) return;

        const transcript = this.element.querySelector("[data-workcenter-transcript]") as HTMLElement | null;
        if (!transcript) return;
        const emitLatestResult = () => {
            const resultNode = Array.from(transcript.querySelectorAll(
                '.workcenter-message--assistant.is-complete .workcenter-message__body'
            )).at(-1) as HTMLElement | undefined;
            const text = resultNode?.textContent?.trim() || "";
            if (!text || text === this.lastOutputText) return;
            this.lastOutputText = text;
            this.options.onProcessComplete?.(text);
        };
        emitLatestResult();

        this.resultObserver = new MutationObserver(emitLatestResult);
        this.resultObserver.observe(transcript, { childList: true, subtree: true, characterData: true });
    }

    private emitFilesChanged(): void {
        const files = this.manager?.getState().files || [];
        this.options.onFilesChange?.([...files]);
    }

    private connectedChat(): HTMLElement | null {
        if (this.element?.isConnected) return this.element;
        const live = queryLiveWorkCenterChats()[0];
        if (live) return live;
        if (typeof document === "undefined") return null;
        return document.querySelector<HTMLElement>(".workcenter-chat[data-view='workcenter']");
    }

    private requestRender(): void {
        if (!this.manager) return;
        const live = this.connectedChat();
        if (live?.querySelector("[data-workcenter-composer]")) {
            this.pendingRenderAfterMount = false;
            this.element = live;
            this.manager.adoptLiveRoot(live);
            this.manager.paintLiveConversation();
            this.syncPromptInputFromState();
            this.setupProcessResultObserver();
            return;
        }
        let currentElement = this.element;
        if (!currentElement?.parentElement) {
            const connected = live;
            if (connected?.parentElement) {
                currentElement = connected;
                this.element = connected;
            }
        }
        const parent = currentElement?.parentElement;
        if (!currentElement || !parent) {
            // During cold-start share/launch bootstrap, messages can arrive before the
            // rendered node is actually attached by the shell. Re-rendering now would
            // rebind manager containers to a detached tree and make visible UI inert.
            this.pendingRenderAfterMount = true;
            return;
        }
        this.pendingRenderAfterMount = false;
        const next = this.manager.renderWorkCenterView();

        // Preserve shell visibility markers on root replacement.
        const activeViewMarker = currentElement.getAttribute("data-view");
        if (activeViewMarker) {
            next.setAttribute("data-view", activeViewMarker);
        }
        next.hidden = currentElement.hidden;
        // INVARIANT: Minimal/immersive shells use the default (unnamed) slot inside shadow `<main>`; roots must
        // stay children of `cw-shell-*` in light DOM. If `slot` is missing, the node does not project and vanishes after re-render.
        if (currentElement.hasAttribute("slot")) {
            next.slot = currentElement.slot;
        }

        parent.replaceChild(next, currentElement);
        this.element = next;
        this.syncPromptInputFromState();
        this.setupProcessResultObserver();
    }

    private showMessage(message: string): void {
        this.shellContext?.showMessage(message);
    }

    private onProcessOpen = (ev: Event): void => {
        const detail = (ev as CustomEvent<{ content?: string; filename?: string }>).detail;
        const content = String(detail?.content || "").trim();
        if (!content) return;
        this.pendingMessages.push({
            type: "content-share",
            contentType: "markdown",
            data: {
                text: content,
                content,
                filename: detail?.filename,
                source: "process-share"
            }
        });
        void this.flushPendingMessages();
    };

    private onMount(): void {
        this.leaseWorkCenterDocumentStyles();
        window.addEventListener("cwsp:process-open", this.onProcessOpen);
    }

    private onUnmount(): void {
        window.removeEventListener("cwsp:process-open", this.onProcessOpen);
        this.unbindFlushHost?.();
        this.unbindFlushHost = null;
        this.resultObserver?.disconnect();
        this.resultObserver = null;
        this.manager?.destroy();
        this.manager = null;
        if (this.leasedDocumentStyles) {
            try {
                const sr = this.shadowRoot;
                const sh = this._sheet;
                if (sr?.adoptedStyleSheets?.length && sh && sr.adoptedStyleSheets.includes(sh)) {
                    sr.adoptedStyleSheets = [...sr.adoptedStyleSheets].filter((s) => s !== sh);
                }
            } catch {
                /* ignore */
            }
            workcenterDocumentStyles.release();
            this.leasedDocumentStyles = false;
        }
        this._sheet = null;
    }

    private onShow(): void {
        this.leaseWorkCenterDocumentStyles();
        this.ensureWorkCenterStylesOnShadow();
        if (this.pendingRenderAfterMount) {
            this.pendingRenderAfterMount = false;
            this.requestRender();
        }
        requestAnimationFrame(() => {
            void this.flushVisibleAttachments();
        });
    }

    /** Share/launch Files sit in hold; unified delivery can skip handleMessage. Paint the live composer. */
    private async flushVisibleAttachments(): Promise<void> {
        const live = this.connectedChat();
        if (live && this.manager) {
            this.element = live;
            this.manager.adoptLiveRoot(live);
        }
        await flushHeldIngressToWorkCenter();
        const held = peekHeldIngressFiles();
        if (held.length && this.manager) await this.manager.addFiles(held);
        this.manager?.paintLiveConversation();
        this.emitFilesChanged();
        await this.flushPendingMessages();
    }

    private onHide(): void {
        /* WHY: Do not remove document adopted sheet here — `onUnmount` refcount handles teardown; other windows may still need it. */
    }

}

export function createView(options?: WorkCenterOptions): WorkCenterView {
    return new WorkCenterView(options);
}

export const createWorkCenterView = createView;
export default createView;