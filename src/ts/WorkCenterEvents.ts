/**
 * Event delegation for the conversation-first Work Center surface.
 *
 * FIND:workcenter-chat-events
 * INVARIANT: Plain clipboard text inside the textarea keeps native paste
 * semantics; only actual file/image clipboard items become attachments.
 */
import type { WorkCenterDependencies, WorkCenterState } from "./WorkCenterState";
import { WorkCenterStateManager } from "./WorkCenterState";
import type { WorkCenterActions } from "./WorkCenterActions";
import type { WorkCenterTemplates } from "./WorkCenterTemplates";
import type { WorkCenterVoice } from "./WorkCenterVoice";
import type { WorkCenterHistory } from "./WorkCenterHistory";
import type { WorkCenterAttachmentIngress } from "./WorkCenterAttachmentIngress";
import type { WorkCenterAttachmentRef } from "./WorkCenterSession";
import { collectAttachmentCandidates } from "../../../../projects/fl.ui/src/ui/inputs/attachments/AttachmentSources";
import { syncWorkCenterComposerHeight } from "./WorkCenterUI";
import {
    downloadWorkCenterAttachment,
    openWorkCenterAttachment
} from "./WorkCenterAttachmentViewer";


const isHttpUrl = (value: string): boolean => {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
};

/** Binds the chat composer once per rendered Work Center root. */
export class WorkCenterEvents {
    private container: HTMLElement | null = null;
    private draftPersistTimer: ReturnType<typeof setTimeout> | null = null;

    constructor(
        private readonly deps: WorkCenterDependencies,
        private readonly actions: WorkCenterActions,
        private readonly templates: WorkCenterTemplates,
        private readonly voice: WorkCenterVoice,
        private readonly history: WorkCenterHistory,
        private readonly ingress: WorkCenterAttachmentIngress,
        private readonly state: WorkCenterState
    ) {}

    setContainer(container: HTMLElement): void {
        this.container = container;
    }

    setupWorkCenterEvents(): void {
        this.bindLiveChats();
    }

    /** Bind Send/Enter/drop on every mounted chat, including a visible clone GLit left behind. */
    bindLiveChats(): void {
        for (const root of this.liveRoots()) this.bindRoot(root);
    }

    private liveRoots(): HTMLElement[] {
        const roots = new Set<HTMLElement>();
        if (this.container) roots.add(this.container);
        if (typeof document !== "undefined") {
            document.querySelectorAll<HTMLElement>(".workcenter-chat").forEach((node) => {
                if (node.isConnected || node === this.container) roots.add(node);
            });
        }
        return [...roots];
    }

    private bindRoot(root: HTMLElement): void {
        if (root.dataset.wcEventsBound === "1") return;
        root.dataset.wcEventsBound = "1";
        this.setupFilePicker(root);
        this.setupComposerInput(root);
        this.setupComposerResize(root);
        this.setupClipboardIngress(root);
        this.setupDropIngress(root);
        this.setupRequestOptions(root);
        this.setupVoiceInput(root);
        this.setupActions(root);
        syncWorkCenterComposerHeight(root);
    }

    private sendComposer(root?: HTMLElement): void {
        this.syncDraftFromComposer(root);
        void this.actions.executeUnifiedAction(this.state);
    }

    private syncDraftFromComposer(preferred?: HTMLElement): void {
        const roots = preferred ? [preferred, ...this.liveRoots()] : this.liveRoots();
        for (const root of roots) {
            const input = root.querySelector(".prompt-input") as HTMLTextAreaElement | null;
            if (!input) continue;
            if (!root.isConnected && root !== preferred && root !== this.container) continue;
            this.state.draft.content = input.value;
            this.state.currentPrompt = input.value;
            if (root.isConnected) break;
        }
    }

    private setupFilePicker(root: HTMLElement = this.container!): void {
        if (!root) return;
        let input = root.querySelector("[data-workcenter-file-picker]") as HTMLInputElement | null;
        if (!input) {
            input = document.createElement("input");
            input.type = "file";
            input.multiple = true;
            input.className = "wc-file-picker";
            input.dataset.workcenterFilePicker = "";
            root.append(input);
        }
        /* WHY: native <label> + file input keeps the user gesture; programmatic click after an
         * async picker often never opens a dialog, so nothing appears in the composer. */
        input.addEventListener("change", () => {
            const files = Array.from(input.files || []);
            input.value = "";
            if (!files.length) return;
            void this.attachFiles(files);
        });
    }

    private setupComposerInput(root: HTMLElement): void {
        const input = root.querySelector(".prompt-input") as HTMLTextAreaElement | null;
        const composer = root.querySelector("[data-workcenter-composer]") as HTMLFormElement | null;
        if (!input || !composer) return;

        input.addEventListener("input", () => {
            this.state.draft.content = input.value;
            this.state.currentPrompt = input.value;
            syncWorkCenterComposerHeight(root);
            this.scheduleDraftPersistence();
        });
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
                event.preventDefault();
                this.sendComposer(root);
            }
        });
        composer.addEventListener("submit", (event) => {
            event.preventDefault();
            this.sendComposer(root);
        });
    }

    private setupClipboardIngress(root: HTMLElement): void {
        root.addEventListener("paste", (event) => {
            const data = event.clipboardData;
            if (!data) return;
            const target = event.target as HTMLElement | null;
            const editable = this.isEditableTarget(target);
            const candidates = collectAttachmentCandidates(data, "paste");
            const files = candidates
                .filter((candidate): candidate is Extract<typeof candidate, { kind: "file" }> =>
                    candidate.kind === "file"
                )
                .map((candidate) => candidate.file);
            const urls = candidates
                .filter((candidate): candidate is Extract<typeof candidate, { kind: "url" }> =>
                    candidate.kind === "url"
                )
                .map((candidate) => candidate.url);

            if (files.length) {
                event.preventDefault();
                void this.attachFiles(files);
                return;
            }
            if (!editable && urls.length) {
                event.preventDefault();
                void Promise.all(urls.map((url) => this.attachUrl(url)));
                return;
            }
            if (editable) return;

            const text = data.getData("text/plain").trim();
            if (text) {
                event.preventDefault();
                this.appendDraftText(text);
            }
        });
    }

    private setupDropIngress(root: HTMLElement): void {
        const composer = root.querySelector("[data-workcenter-composer]") as HTMLElement | null;

        const accept = (event: DragEvent) => {
            event.preventDefault();
            if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
            composer?.classList.add("is-dragging");
        };
        root.addEventListener("dragover", accept);
        root.addEventListener("dragenter", accept);
        root.addEventListener("dragleave", (event) => {
            if (event.relatedTarget instanceof Node && root.contains(event.relatedTarget)) return;
            composer?.classList.remove("is-dragging");
        });
        root.addEventListener("drop", (event) => {
            event.preventDefault();
            event.stopPropagation();
            composer?.classList.remove("is-dragging");
            const data = event.dataTransfer;
            if (!data) return;
            const candidates = collectAttachmentCandidates(data, "drop");
            const files = candidates
                .filter((candidate): candidate is Extract<typeof candidate, { kind: "file" }> =>
                    candidate.kind === "file"
                )
                .map((candidate) => candidate.file);
            const urls = candidates
                .filter((candidate): candidate is Extract<typeof candidate, { kind: "url" }> =>
                    candidate.kind === "url"
                )
                .map((candidate) => candidate.url);
            if (files.length) void this.attachFiles(files);
            if (urls.length) void Promise.all(urls.map((url) => this.attachUrl(url)));
            if (files.length || urls.length) return;

            const text = data.getData("text/plain").trim();
            if (!text) return;
            if (isHttpUrl(text)) {
                void this.attachUrl(text);
                return;
            }
            this.appendDraftText(text);
        });
    }

    private setupRequestOptions(root: HTMLElement): void {
        const selectBindings: Array<[string, keyof WorkCenterState]> = [
            [".format-select", "outputFormat"],
            [".language-select", "selectedLanguage"],
            [".recognition-select", "recognitionFormat"],
            [".processing-select", "processingFormat"]
        ];
        for (const [selector, property] of selectBindings) {
            const select = root.querySelector(selector) as HTMLSelectElement | null;
            select?.addEventListener("change", () => {
                (this.state[property] as string) = select.value;
                WorkCenterStateManager.saveState(this.state);
            });
        }

        const template = root.querySelector(".template-select") as HTMLSelectElement | null;
        template?.addEventListener("change", () => {
            this.state.selectedTemplate = template.value;
            if (template.value) {
                this.state.draft.content = template.value;
                this.state.currentPrompt = template.value;
            }
            WorkCenterStateManager.saveState(this.state);
            void this.actions.persistDraft(this.state);
            this.deps.render?.();
        });

        const instruction = root.querySelector(".instruction-select") as HTMLSelectElement | null;
        instruction?.addEventListener("change", () => {
            void this.templates.applyInstruction(this.state, instruction.value);
            WorkCenterStateManager.saveState(this.state);
        });
    }

    private setupVoiceInput(root: HTMLElement): void {
        const voice = root.querySelector('[data-action="voice-input"]') as HTMLButtonElement | null;
        if (!voice) return;
        voice.addEventListener("mousedown", () => this.voice.startVoiceRecording(this.state));
        const stop = () => this.voice.stopVoiceRecording(this.state);
        voice.addEventListener("mouseup", stop);
        voice.addEventListener("mouseleave", stop);
    }

    private setupActions(root: HTMLElement): void {
        root.addEventListener("click", (event) => {
            const target = event.target as HTMLElement;
            const actionElement = target.closest("[data-action]") as HTMLElement | null;
            const action = actionElement?.dataset.action;
            if (!action || !actionElement) return;

            switch (action) {
                case "execute":
                    event.preventDefault();
                    this.sendComposer(root);
                    break;
                case "select-files":
                    break;
                case "new-chat":
                    void this.actions.startNewConversation(this.state);
                    break;
                case "cancel-turn":
                    void this.actions.cancelConversationTurn(this.state, actionElement.dataset.turnId || "");
                    break;
                case "retry-turn":
                    void this.actions.retryConversationTurn(this.state, actionElement.dataset.turnId || "");
                    break;
                case "copy-turn":
                    void this.actions.copyConversationTurn(this.state, actionElement.dataset.turnId || "");
                    break;
                case "view-attachment":
                    event.preventDefault();
                    void this.viewAttachment(actionElement.dataset.attachmentHash || "");
                    break;
                case "download-attachment":
                    event.preventDefault();
                    event.stopPropagation();
                    void this.downloadAttachment(actionElement.dataset.attachmentHash || "");
                    break;
                case "remove-draft-attachment":
                    event.preventDefault();
                    event.stopPropagation();
                    this.ingress.remove(actionElement.dataset.attachmentHash || "");
                    break;
                case "close-attachment-viewer": {
                    const viewer = root.querySelector("[data-workcenter-attachment-viewer]");
                    if (typeof HTMLDialogElement !== "undefined" && viewer instanceof HTMLDialogElement && typeof viewer.close === "function") {
                        viewer.close();
                    } else {
                        viewer?.remove();
                    }
                    break;
                }
                case "open-request-options":
                    this.togglePanel("[data-workcenter-request-options]", actionElement);
                    void this.templates.fillInstructionSelects(root, this.state);
                    break;
                case "refresh-instructions":
                    void this.templates.fillInstructionSelects(root, this.state);
                    break;
                case "open-secondary":
                    this.togglePanel("[data-workcenter-secondary]", actionElement);
                    break;
                case "view-action-history":
                    this.history.showActionHistory();
                    break;
                case "edit-templates":
                    this.templates.showTemplateEditor(this.state, root);
                    break;
            }
        });
    }

    private async attachFiles(files: File[]): Promise<void> {
        const added = await this.ingress.addFiles(files);
        if (!added.length) {
            this.deps.showMessage?.("Could not attach that file");
        }
    }

    private async attachUrl(url: string): Promise<void> {
        await this.ingress.addUrl(url);
    }

    private setupComposerResize(root: HTMLElement): void {
        const handle = root.querySelector("[data-composer-resize]") as HTMLElement | null;
        const composer = root.querySelector("[data-workcenter-composer]") as HTMLElement | null;
        if (!handle || !composer) return;

        handle.addEventListener("pointerdown", (event) => {
            if (event.button !== 0) return;
            event.preventDefault();
            handle.setPointerCapture?.(event.pointerId);
            const startY = event.clientY;
            const startHeight = composer.getBoundingClientRect().height;
            const hostHeight = root.getBoundingClientRect().height || startHeight;
            const limit = Math.max(96, hostHeight * 0.75);
            const onMove = (move: PointerEvent) => {
                const next = Math.min(limit, Math.max(72, startHeight + (startY - move.clientY)));
                composer.style.setProperty("--wc-composer-min", `${next}px`);
                syncWorkCenterComposerHeight(root);
            };
            const onUp = () => {
                handle.removeEventListener("pointermove", onMove);
                handle.removeEventListener("pointerup", onUp);
                handle.removeEventListener("pointercancel", onUp);
            };
            handle.addEventListener("pointermove", onMove);
            handle.addEventListener("pointerup", onUp);
            handle.addEventListener("pointercancel", onUp);
        });
    }

    private findAttachment(hash: string): WorkCenterAttachmentRef | null {
        if (!hash) return null;
        const draft = this.state.draft.attachments.find((attachment) => attachment.hash === hash);
        if (draft) return draft;
        for (const message of this.state.messages) {
            const found = message.attachments.find((attachment) => attachment.hash === hash);
            if (found) return found;
        }
        return null;
    }

    private async viewAttachment(hash: string): Promise<void> {
        const attachment = this.findAttachment(hash);
        const host = this.liveRoots().find((node) => node.isConnected) ?? this.container;
        if (!attachment || !host) return;
        const file = attachment.url ? this.ingress.fileFor(attachment) : await this.ingress.resolve(attachment);
        if (!file && !attachment.url) {
            this.deps.showMessage?.("Attachment is no longer available");
            return;
        }
        await openWorkCenterAttachment({
            host,
            attachment,
            file,
            objectUrl: file ? this.ingress.objectUrlFor(file) : null
        });
    }

    private async downloadAttachment(hash: string): Promise<void> {
        const attachment = this.findAttachment(hash);
        if (!attachment) return;
        if (attachment.url && !this.ingress.fileFor(attachment)) {
            downloadWorkCenterAttachment({
                name: attachment.name,
                remoteUrl: attachment.url,
                objectUrl: null
            });
            return;
        }
        const file = await this.ingress.resolve(attachment);
        if (!file) {
            this.deps.showMessage?.("Attachment is no longer available");
            return;
        }
        downloadWorkCenterAttachment({
            name: attachment.name,
            remoteUrl: attachment.url,
            objectUrl: this.ingress.objectUrlFor(file)
        });
    }

    private appendDraftText(text: string): void {
        const next = [this.state.draft.content, text]
            .filter(Boolean)
            .join(this.state.draft.content ? "\n" : "");
        this.state.draft.content = next;
        this.state.currentPrompt = next;
        void this.actions.persistDraft(this.state);
        for (const root of this.liveRoots()) {
            const input = root.querySelector(".prompt-input") as HTMLTextAreaElement | null;
            if (input) input.value = next;
        }
    }

    private scheduleDraftPersistence(): void {
        if (this.draftPersistTimer) clearTimeout(this.draftPersistTimer);
        this.draftPersistTimer = setTimeout(() => {
            this.draftPersistTimer = null;
            void this.actions.persistDraft(this.state);
        }, 180);
    }

    private togglePanel(selector: string, trigger: HTMLElement): void {
        const host = (trigger.closest(".workcenter-chat") as HTMLElement | null) ?? this.container;
        const panel = host?.querySelector(selector) as HTMLElement | null;
        if (!panel) return;
        panel.hidden = !panel.hidden;
        trigger.setAttribute("aria-expanded", String(!panel.hidden));
    }

    private isEditableTarget(target: HTMLElement | null): boolean {
        if (!target) return false;
        return target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement ||
            target.isContentEditable ||
            !!target.closest("[contenteditable='true']");
    }
}
