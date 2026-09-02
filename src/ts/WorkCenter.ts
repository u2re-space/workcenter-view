// Configure marked with KaTeX extension for HTML output with proper delimiters
import { marked, type MarkedExtension } from "marked";
import markedKatex from "marked-katex-extension";
import renderMathInElement from "katex/dist/contrib/auto-render.mjs";

const MATH_DELIMITER_PATTERN = /\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|(?<!\$)\$[^$\n]+\$|\\\([\s\S]*?\\\)/;
const FENCED_CODE_PATTERN = /(^|\n)(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\2(?=\n|$)/g;
const INLINE_CODE_PATTERN = /`[^`\n]+`/g;
const SANITIZE_OPTIONS = {
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "applet", "link", "meta", "base", "form", "noscript", "template"],
    FORBID_CONTENTS: ["script", "style", "iframe", "object", "embed", "applet", "noscript", "template"]
};

function maskCodeSegments(markdown: string): { masked: string; restore: (value: string) => string } {
    const maskedValues: string[] = [];
    const tokenPrefix = "__MD_MASK_";
    const tokenSuffix = "__";

    const mask = (value: string): string => value.replace(FENCED_CODE_PATTERN, (segment) => {
        const token = `${tokenPrefix}${maskedValues.length}${tokenSuffix}`;
        maskedValues.push(segment);
        return token;
    });

    const maskInline = (value: string): string => value.replace(INLINE_CODE_PATTERN, (segment) => {
        const token = `${tokenPrefix}${maskedValues.length}${tokenSuffix}`;
        maskedValues.push(segment);
        return token;
    });

    const masked = maskInline(mask(markdown));

    return {
        masked,
        restore: (value: string): string => value.replace(/__MD_MASK_(\d+)__/g, (_, index) => maskedValues[Number(index)] ?? "")
    };
}

// Configure marked with KaTeX extension for HTML output with proper delimiters
marked?.use?.(markedKatex({
    throwOnError: false,
    nonStandard: true,
    output: "mathml",
    strict: false,
}) as unknown as MarkedExtension,
{
    hooks: {
        preprocess: (markdown: string): string => {
            if (!MATH_DELIMITER_PATTERN.test(markdown)) {
                return markdown;
            }

            const { masked, restore } = maskCodeSegments(markdown);
            const katexNode = document.createElement("div");
            katexNode.textContent = masked;
            renderMathInElement(katexNode, {
                throwOnError: false,
                nonStandard: true,
                output: "mathml",
                strict: false,
                delimiters: [
                    { left: "$$", right: "$$", display: true },
                    { left: "\\[", right: "\\]", display: true },
                    { left: "$", right: "$", display: false },
                    { left: "\\(", right: "\\)", display: false }
                ]
            });

            return restore(katexNode.innerHTML);
        },
    },
});

// Re-export state and dependencies interfaces for backward compatibility
export type { WorkCenterState, WorkCenterDependencies } from "./WorkCenterState";

import type { WorkCenterState, WorkCenterDependencies } from "./WorkCenterState";
import { WorkCenterStateManager } from "./WorkCenterState";
import { WorkCenterUI } from "./WorkCenterUI";
import { WorkCenterFileOps } from "./WorkCenterFileOps";
import { WorkCenterShareTarget } from "./WorkCenterShareTarget";
import { WorkCenterTemplates } from "./WorkCenterTemplates";
import { WorkCenterVoice } from "./WorkCenterVoice";
import { WorkCenterActions } from "./WorkCenterActions";
import { WorkCenterDataProcessing } from "./WorkCenterDataProcessing";
import { WorkCenterEvents } from "./WorkCenterEvents";

// Import component registration system
import { registerComponent, initializeComponent, replayQueuedMessagesForDestination } from "com/routing/channel/UnifiedMessaging";
import { WorkCenterResults } from "./WorkCenterResults";
import { WorkCenterAttachments } from "./WorkCenterAttachments";
import { WorkCenterPrompts } from "./WorkCenterPrompts";
import { WorkCenterHistory } from "./WorkCenterHistory";
import { WorkCenterSession } from "./WorkCenterSession";
import { WorkCenterAttachmentIngress } from "./WorkCenterAttachmentIngress";
import {
    createWorkCenterAttachmentStore,
    createWorkCenterSessionPersistence
} from "./WorkCenterSessionPersistence";
import { WorkCenterDocumentPreparer } from "./WorkCenterDocumentPreparation";
import { dropHeldIngressFiles, onHeldIngressFiles, takeHeldIngressFiles } from "com/routing/channel/sku-ingress";
import { unwrapSwInteropMessage } from "com/routing/channel/UniformInterop";
import { readProcessApiResultText } from "com/routing/api/process-api";
import { bindWorkCenterCommandBus } from "./WorkCenterCommandBus";
import {
    isWorkCenterCommand,
    isWorkCenterCommandEnvelope,
    type WorkCenterCommand
} from "./WorkCenterCommands";

/** Composer lives under `cw-shell-*` shadow — `document.querySelector` misses it. */
export const queryLiveWorkCenterChats = (): HTMLElement[] => {
    const out: HTMLElement[] = [];
    const add = (node: Element | null | undefined): void => {
        if (!(node instanceof HTMLElement) || !node.isConnected) return;
        const chat = node.classList.contains("workcenter-chat")
            ? node
            : node.querySelector<HTMLElement>(".workcenter-chat");
        const host = chat || (node.querySelector("[data-workcenter-composer]") ? node : null);
        if (!host || out.includes(host)) return;
        if (!host.querySelector("[data-workcenter-transcript], [data-workcenter-composer]")) return;
        out.push(host);
    };
    if (typeof document === "undefined") return out;
    add(document.querySelector(".workcenter-chat"));
    document.querySelectorAll("cw-workcenter-view").forEach((ce) => {
        add(ce);
        add(ce.shadowRoot?.querySelector(".workcenter-chat") ?? null);
    });
    document
        .querySelectorAll("[data-shell], cw-shell-minimal, cw-shell-immersive, cw-shell-content, cw-shell-environment")
        .forEach((shell) => {
            const sr = (shell as HTMLElement).shadowRoot;
            if (!sr) return;
            sr.querySelectorAll(".workcenter-chat, [data-workcenter-composer]").forEach((node) => {
                const chat =
                    (node as HTMLElement).closest?.(".workcenter-chat") ||
                    (node as HTMLElement);
                add(chat);
            });
        });
    return out;
};

export class WorkCenterManager {
    private state: WorkCenterState;
    private deps: WorkCenterDependencies;

    // Sub-modules
    private ui: WorkCenterUI;
    private fileOps: WorkCenterFileOps;
    private shareTarget: WorkCenterShareTarget;
    private templates: WorkCenterTemplates;
    private voice: WorkCenterVoice;
    private actions: WorkCenterActions;
    private dataProcessing: WorkCenterDataProcessing;
    private attachments: WorkCenterAttachments;
    private prompts: WorkCenterPrompts;
    private results: WorkCenterResults;
    private history: WorkCenterHistory;
    private events: WorkCenterEvents;
    private session: WorkCenterSession;
    private attachmentIngress: WorkCenterAttachmentIngress;
    private documentPreparer: WorkCenterDocumentPreparer;
    private sessionReady: Promise<void>;
    private processedMessageIds = new Set<string>();
    private deliveredResultKeys = new Set<string>();
    private unbindCommandBus: () => void = () => {};
    private unbindHeldIngress: () => void = () => {};
    private unbindPagePersist: () => void = () => {};

    constructor(dependencies: WorkCenterDependencies) {
        this.deps = dependencies;
        this.state = WorkCenterStateManager.createDefaultState();
        this.session = new WorkCenterSession(createWorkCenterSessionPersistence());
        this.attachmentIngress = new WorkCenterAttachmentIngress({
            state: this.state,
            store: createWorkCenterAttachmentStore(),
            onChanged: () => {
                this.session.setDraft(this.state.draft);
                void this.session.persistDraft().catch(() => {
                    this.deps.showMessage("Unable to save the attachment draft");
                });
                this.deps.onFilesChanged?.();
                this.paintLiveConversation("if-idle");
            },
            onRejected: (reason) => this.deps.showMessage(reason)
        });
        this.documentPreparer = new WorkCenterDocumentPreparer();
        this.sessionReady = this.hydrateSession();

        // Initialize sub-modules
        this.dataProcessing = new WorkCenterDataProcessing();
        this.templates = new WorkCenterTemplates(dependencies);
        this.voice = new WorkCenterVoice(dependencies);
        this.fileOps = new WorkCenterFileOps(dependencies);
        this.history = new WorkCenterHistory(dependencies);
        this.attachments = new WorkCenterAttachments(dependencies, this.fileOps);
        this.prompts = new WorkCenterPrompts(dependencies, this.templates, this.voice);
        this.results = new WorkCenterResults(dependencies, this.dataProcessing);
        this.ui = new WorkCenterUI(
            dependencies,
            this.attachments,
            this.prompts,
            this.results,
            this.history,
            {
                fileFor: (ref) => this.attachmentIngress.fileFor(ref),
                getPreviewUrl: (file) => this.attachmentIngress.getPreviewUrl(file)
            }
        );
        this.shareTarget = new WorkCenterShareTarget(
            dependencies,
            this.fileOps,
            async (input) => this.handleIncomingContent(input, "text")
        );
        this.actions = new WorkCenterActions(
            dependencies,
            this.ui,
            this.fileOps,
            this.dataProcessing,
            this.results,
            this.history,
            this.templates,
            {
                session: this.session,
                attachments: this.attachmentIngress,
                documentPreparer: this.documentPreparer,
                syncFromSession: () => this.syncStateFromSession()
            }
        );
        this.events = new WorkCenterEvents(
            dependencies,
            this.actions,
            this.templates,
            this.voice,
            this.history,
            this.attachmentIngress,
            this.state
        );

        this.unbindCommandBus = bindWorkCenterCommandBus((command) => this.dispatchCommand(command));
        this.unbindHeldIngress = onHeldIngressFiles((files) => {
            void this.handleIncomingContent({ files, fileCount: files.length }, "file");
        });
        this.unbindPagePersist = this.bindPagePersist();

        // Initialize share target result listener
        this.shareTarget.initShareTargetListener(this.state);

        // Register component for catch-up messaging
        registerComponent('workcenter-core', 'workcenter');

        // Process any queued messages that were sent before work center was available
        void this.sessionReady.then(() => this.shareTarget.processQueuedMessages(this.state));

        // Process pending messages from component registry
        const pendingMessages = initializeComponent('workcenter-core');
        for (const message of pendingMessages) {
            console.log(`[WorkCenter] Processing pending message:`, message);
            this.handleExternalMessage(message);
        }
        void this.sessionReady.then(async () => {
            await replayQueuedMessagesForDestination("workcenter").catch(() => undefined);
            /* WHY: share/launch-queue often holds File blobs before this view exists. */
            const held = takeHeldIngressFiles();
            if (held.length) {
                await this.handleIncomingContent({ files: held, fileCount: held.length }, "file");
            }
        });

        // Listen for hash changes to update UI elements like drop hints
        if (typeof globalThis !== 'undefined') {
            globalThis?.addEventListener?.('hashchange', () => {
                // Update drop hints when hash changes
                this.attachments.updateDropHint?.();
            });
        }
    }

    private async hydrateSession(): Promise<void> {
        try {
            const snapshot = await this.session.hydrate();
            const hasPersistedContent = snapshot.messages.length > 0 ||
                Boolean(snapshot.draft.content) ||
                snapshot.draft.attachments.length > 0;

            if (hasPersistedContent) {
                const refs = [
                    ...snapshot.draft.attachments,
                    ...snapshot.messages.flatMap((message) => message.attachments)
                ];
                await this.attachmentIngress.hydrate(refs);
                this.state.files = snapshot.draft.attachments
                    .map((ref) => this.attachmentIngress.fileFor(ref))
                    .filter((file): file is File => file !== null);
            } else if (this.state.draft.content) {
                // COMPAT: Preserve a legacy unsent localStorage prompt the first
                // time this version starts, then keep future drafts in OPFS.
                this.session.setDraft(this.state.draft);
                await this.session.persistDraft();
            }
            this.syncStateFromSession(false);
            this.session.setDraft(this.state.draft);
        } catch (error) {
            console.warn("[WorkCenter] Failed to hydrate local session:", error);
            this.state.sessionHydrated = true;
        } finally {
            this.paintLiveConversation();
            if (typeof requestAnimationFrame === "function") {
                requestAnimationFrame(() => this.paintLiveConversation());
            }
        }
    }

    /** Prefer a connected chat root so GLit remounts do not steal the live composer. */
    adoptLiveRoot(root: HTMLElement): void {
        this.ui.setContainer(root);
        this.events.setContainer(root);
        this.events.bindLiveChats();
    }

    /** Paint transcript + draft on every live chat root and bind Send/Enter there. */
    paintLiveConversation(syncPrompt: "replace" | "if-idle" = "replace"): void {
        const hosts = this.liveChatHosts();
        let painted = false;
        for (const host of hosts) {
            if (!host.querySelector("[data-workcenter-transcript]")) continue;
            this.ui.paintConversation(this.state, host, syncPrompt);
            painted = true;
        }
        this.events.bindLiveChats();
        if (!painted) this.deps.render?.();
    }

    private liveChatHosts(): Set<ParentNode> {
        const hosts = new Set<ParentNode>();
        const current = this.ui?.getContainer();
        if (current) hosts.add(current);
        for (const chat of queryLiveWorkCenterChats()) hosts.add(chat);
        return hosts;
    }

    /** Paint chips on every live chat root — GLit/shell remounts can leave a detached SoT node. */
    private paintDraftAttachments(): void {
        this.paintLiveConversation();
    }

    private syncStateFromSession(render = true): void {
        const snapshot = this.session.snapshot();
        const liveAttachments = this.state.draft?.attachments || [];
        this.state.messages = snapshot.messages;
        this.state.draft = snapshot.draft;
        for (const ref of liveAttachments) {
            if (!this.state.draft.attachments.some((item) => item.hash === ref.hash)) {
                this.state.draft.attachments.push(ref);
            }
        }
        this.state.currentPrompt = snapshot.draft.content;
        this.state.sessionEpoch = snapshot.epoch;
        this.state.sessionHydrated = true;
        this.deps.onFilesChanged?.();
        if (render) this.paintLiveConversation();
    }

    async addFiles(files: File[]): Promise<void> {
        await this.sessionReady;
        await this.attachmentIngress.addFiles(files);
    }

    async setPrompt(prompt: string): Promise<void> {
        await this.sessionReady;
        this.state.draft.content = String(prompt || "");
        this.state.currentPrompt = this.state.draft.content;
        this.session.setDraft(this.state.draft);
        await this.session.persistDraft();
        this.deps.render?.();
    }

    async handleDroppedContent(content: string, sourceType: string): Promise<void> {
        await this.sessionReady;
        if (sourceType === "url") {
            await this.attachmentIngress.addUrl(content);
            return;
        }
        await this.appendDraftText(content);
    }

    async handlePastedContent(content: string, sourceType: string): Promise<void> {
        return this.handleDroppedContent(content, sourceType);
    }

    private async appendDraftText(content: string): Promise<void> {
        const text = String(content || "").trim();
        if (!text) return;
        this.state.draft.content = [this.state.draft.content, text]
            .filter(Boolean)
            .join(this.state.draft.content ? "\n" : "");
        this.state.currentPrompt = this.state.draft.content;
        this.session.setDraft(this.state.draft);
        await this.session.persistDraft();
        this.deps.render?.();
    }

    async dispatchCommand(command: WorkCenterCommand): Promise<void> {
        await this.sessionReady;
        switch (command.type) {
            case "hydrate":
                await this.hydrateSession();
                return;
            case "snapshot":
                return;
            case "draft.set":
                this.session.setDraft(command.draft);
                this.state.draft = command.draft;
                this.state.currentPrompt = command.draft.content;
                this.paintLiveConversation("if-idle");
                return;
            case "draft.commit":
            case "turn.execute":
                await this.actions.executeUnifiedAction(this.state);
                return;
            case "attach.add":
                if (command.files?.length) await this.addFiles(command.files);
                return;
            case "attach.remove": {
                const next = (this.state.draft.attachments || []).filter((item) => item.hash !== command.hash);
                this.state.draft.attachments = next;
                this.session.setDraft(this.state.draft);
                this.paintLiveConversation("if-idle");
                return;
            }
            case "turn.cancel":
                await this.actions.cancelConversationTurn(this.state, command.assistantId);
                return;
            case "turn.retry":
                await this.actions.retryConversationTurn(this.state, command.assistantId);
                return;
            case "ingress.apply":
                await this.handleExternalMessage(command.payload);
                return;
            default:
                return;
        }
    }

    private resultText(data: unknown): string {
        if (data == null) return "";
        if (typeof data === "string") return data.trim();
        const row = data as Record<string, unknown>;
        return String(
            readProcessApiResultText(data) ||
            row.content ||
            row.text ||
            (typeof row.data === "string" ? row.data : "") ||
            ""
        ).trim();
    }

    private rememberResult(text: string): boolean {
        const key = text.replace(/\s+/g, " ").slice(0, 400);
        if (!key) return false;
        if (this.deliveredResultKeys.has(key)) return false;
        this.deliveredResultKeys.add(key);
        if (this.deliveredResultKeys.size > 32) {
            const first = this.deliveredResultKeys.values().next().value;
            if (first) this.deliveredResultKeys.delete(first);
        }
        return true;
    }

    /** Complete a waiting turn, or append a late SW / share result that missed the fetch. */
    private async applyArrivedResult(note: string, raw: unknown, completePendingTurn: boolean): Promise<void> {
        if (!note) return;
        const pending = completePendingTurn ? this.session.latestPendingAssistant() : null;
        if (pending) {
            this.session.applyAssistantCompletion(pending.id, {
                status: "complete",
                content: note,
                rawResult: raw
            });
            this.rememberResult(note);
            void this.session.persistDraft().catch(() => undefined);
            this.syncStateFromSession(true);
            return;
        }
        const last = this.session.latestCompleteAssistant();
        if (last && last.content.replace(/\s+/g, " ").trim() === note.replace(/\s+/g, " ").trim()) {
            return;
        }
        if (!this.rememberResult(note)) return;
        await this.session.appendAssistantNote(note);
        this.syncStateFromSession(true);
    }

    /** Normalize all channel/share payloads into the active conversation draft. */
    private async handleIncomingContent(data: any, contentType: string): Promise<void> {
        await this.sessionReady;
        try {
            const files: File[] = [];
            if (Array.isArray(data?.files)) {
                for (const entry of data.files) {
                    if (entry instanceof File) files.push(entry);
                    else if (typeof Blob !== "undefined" && entry instanceof Blob) {
                        files.push(new File(
                            [entry],
                            String(data?.filename || data?.title || `attachment-${Date.now()}`),
                            { type: entry.type || "application/octet-stream" }
                        ));
                    }
                }
            }
            if (data?.file instanceof File) files.push(data.file);
            if (typeof Blob !== "undefined" && data?.blob instanceof Blob) {
                files.push(new File(
                    [data.blob],
                    String(data.filename || `attachment-${Date.now()}.${contentType === "markdown" ? "md" : "txt"}`),
                    { type: data.blob.type || "application/octet-stream" }
                ));
            }
            if (Array.isArray(data?.attachments)) {
                for (const attachment of data.attachments) {
                    const candidate = attachment?.data;
                    if (candidate instanceof File) files.push(candidate);
                    else if (typeof Blob !== "undefined" && candidate instanceof Blob) {
                        files.push(new File([candidate], String(attachment?.name || `attachment-${Date.now()}`), {
                            type: candidate.type || "application/octet-stream"
                        }));
                    }
                }
            }
            /* WHY: do not wipe a merged share+launch hold when this envelope already has Files. */
            if (!files.length) files.push(...takeHeldIngressFiles());

            const rawText = data?.text ?? data?.content;
            const text = rawText === undefined || rawText === null
                ? ""
                : typeof rawText === "string"
                    ? rawText
                    : JSON.stringify(rawText, null, 2);
            if (!files.length && (String(data?.filename || "").trim() || text.trim())) {
                files.push(new File(
                    [text],
                    String(data?.filename || data?.title || `shared-${Date.now()}.txt`),
                    { type: contentType === "markdown" ? "text/markdown" : "text/plain" }
                ));
            }

            const attached = await this.attachmentIngress.addFiles(files);
            if (attached.length) dropHeldIngressFiles(files);
            if (typeof data?.url === "string") await this.attachmentIngress.addUrl(data.url);

            if (text.trim() && attached.length === 0) {
                await this.appendDraftText(text);
            }
            if (attached.length) {
                const live = queryLiveWorkCenterChats()[0];
                if (live) this.adoptLiveRoot(live);
                this.paintLiveConversation();
                this.deps.showMessage(
                    attached.length === 1
                        ? `Attached ${attached[0]?.name || "file"}`
                        : `Attached ${attached.length} files`
                );
            }
        } catch (error) {
            console.warn("[WorkCenter] Failed to attach incoming content:", error);
            this.deps.showMessage("Failed to attach content");
        }
    }

    /**
     * Public entry for Basic/Main unified-messaging handler and pending inbox replay.
     * Handles share-target inputs/results and general content-share attachment.
     */
    async handleExternalMessage(message: any): Promise<void> {
        if (!message) return;
        if (isWorkCenterCommandEnvelope(message)) {
            await this.dispatchCommand(message.command);
            return;
        }
        const unwrapped = unwrapSwInteropMessage(message);
        if (unwrapped?.command && isWorkCenterCommand(unwrapped.command)) {
            await this.dispatchCommand(unwrapped.command);
            return;
        }
        if (unwrapped?.type) {
            message = {
                ...((message && typeof message === "object") ? message : {}),
                type: unwrapped.type,
                data: unwrapped.data ?? message.data
            };
        }
        await this.sessionReady;
        const messageId = typeof message?.id === "string" ? message.id : "";
        if (messageId) {
            if (this.processedMessageIds.has(messageId)) {
                return;
            }
            this.processedMessageIds.add(messageId);
            if (this.processedMessageIds.size > 256) {
                const iter = this.processedMessageIds.values().next();
                if (!iter.done) this.processedMessageIds.delete(iter.value);
            }
        }

        // Share-target messages should update both attachments and results pipeline.
        if ((message.type === 'share-target-input' || message.type === 'share-received') && message.data) {
            await this.handleIncomingContent(message.data, message.contentType || "text");
            return;
        }

        if (message.type === 'share-target-result' && message.data) {
            const note = this.resultText(message.data);
            await this.applyArrivedResult(note, message.data, false);
            await this.shareTarget.addShareTargetResult(this.state, {
                ...message.data,
                content: note || message.data.content
            });
            this.ui.updateDataPipeline(this.state);
            this.paintLiveConversation();
            return;
        }

        if ((message.type === 'ai-result' || message.type === 'process-api-result') && message.data) {
            const note = this.resultText(message.data);
            if (message.data.success !== false) {
                await this.applyArrivedResult(note, message.data, true);
            }
            await this.shareTarget.handleAIResult(this.state, {
                success: message.data.success !== false,
                data: note || message.data.data || message.data,
                error: message.data.error
            });
            this.ui.updateDataPipeline(this.state);
            this.paintLiveConversation();
            return;
        }

        // Generic content attachment (+ view-routed file transfers)
        const isAttachmentEnvelope =
            message.type === 'content-share' ||
            message.type === 'content-attach' ||
            message.type === 'file-attach';

        if (isAttachmentEnvelope && message.data) {
            await this.handleIncomingContent(message.data, message.contentType || 'text');
            return;
        }
    }


    getState(): WorkCenterState {
        return this.state;
    }

    /** Flush transcript + draft when the Process PWA is backgrounded or reloaded. */
    private bindPagePersist(): () => void {
        if (typeof window === "undefined") return () => {};
        const flush = (): void => {
            try {
                this.session.setDraft(this.state.draft);
                void this.session.persistDraft();
            } catch {
                /* ignore */
            }
        };
        const onVisibility = (): void => {
            if (document.visibilityState === "hidden") flush();
        };
        window.addEventListener("pagehide", flush);
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
            window.removeEventListener("pagehide", flush);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }

    destroy(): void {
        this.unbindCommandBus();
        this.unbindHeldIngress();
        this.unbindPagePersist();
        // Clear container references
        this.ui.setContainer(null);
        this.attachments.setContainer(null);
        this.prompts.setContainer(null);
        this.results.setContainer(null);
        this.history.setContainer(null);
        this.attachmentIngress.revokeAllPreviews();

        // The WorkCenterCommunicator handles its own cleanup
        // No need to manually close channels here
        console.log('[WorkCenter] WorkCenterManager destroyed');
    }

    renderWorkCenterView(): HTMLElement {
        const container = this.ui.renderWorkCenterView(this.state);

        // Set up event listeners
        this.events.setContainer(container);
        this.events.setupWorkCenterEvents();

        // Update file list, file counter, and recent history
        this.ui.updateFileList(this.state);
        this.ui.updateFileCounter(this.state);
        this.history.updateRecentHistory(this.state);
        void this.templates.fillInstructionSelects(container, this.state);
        if (this.state.sessionHydrated) this.paintLiveConversation();

        return container;
    }

}
