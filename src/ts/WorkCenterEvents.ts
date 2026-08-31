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
import { collectAttachmentCandidates } from "../../../../projects/fl.ui/src/ui/inputs/attachments/AttachmentSources";

/** Any file — size/type checks happen in attachment ingress, not the picker. */
const FILE_ACCEPT = "*/*";

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
        if (!this.container) return;
        this.setupFilePicker();
        this.setupComposerInput();
        this.setupClipboardIngress();
        this.setupDropIngress();
        this.setupRequestOptions();
        this.setupVoiceInput();
        this.setupActions();
    }

    private setupFilePicker(): void {
        if (!this.container) return;
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = true;
        input.accept = FILE_ACCEPT;
        input.hidden = true;
        input.dataset.workcenterFilePicker = "";
        input.addEventListener("change", async () => {
            const files = Array.from(input.files || []);
            input.value = "";
            if (!files.length) return;
            const added = await this.ingress.addFiles(files);
            if (!added.length) {
                this.deps.showMessage?.("Could not attach that file");
            }
        });
        this.container.append(input);
    }

    private setupComposerInput(): void {
        const input = this.container?.querySelector(".prompt-input") as HTMLTextAreaElement | null;
        const composer = this.container?.querySelector("[data-workcenter-composer]") as HTMLFormElement | null;
        if (!input || !composer) return;

        input.addEventListener("input", () => {
            this.state.draft.content = input.value;
            this.state.currentPrompt = input.value;
            this.scheduleDraftPersistence();
        });
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
                event.preventDefault();
                void this.actions.executeUnifiedAction(this.state);
            }
        });
        composer.addEventListener("submit", (event) => {
            event.preventDefault();
            void this.actions.executeUnifiedAction(this.state);
        });
    }

    private setupClipboardIngress(): void {
        this.container?.addEventListener("paste", (event) => {
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
                void this.ingress.addFiles(files);
                return;
            }
            if (!editable && urls.length) {
                event.preventDefault();
                void Promise.all(urls.map((url) => this.ingress.addUrl(url)));
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

    private setupDropIngress(): void {
        const composer = this.container?.querySelector("[data-workcenter-composer]") as HTMLElement | null;
        if (!composer) return;

        composer.addEventListener("dragover", (event) => {
            event.preventDefault();
            composer.classList.add("is-dragging");
        });
        composer.addEventListener("dragleave", (event) => {
            if (event.relatedTarget instanceof Node && composer.contains(event.relatedTarget)) return;
            composer.classList.remove("is-dragging");
        });
        composer.addEventListener("drop", (event) => {
            event.preventDefault();
            composer.classList.remove("is-dragging");
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
            if (files.length) void this.ingress.addFiles(files);
            if (urls.length) void Promise.all(urls.map((url) => this.ingress.addUrl(url)));
            if (files.length || urls.length) return;

            const text = data.getData("text/plain").trim();
            if (!text) return;
            if (isHttpUrl(text)) {
                void this.ingress.addUrl(text);
                return;
            }
            this.appendDraftText(text);
        });
    }

    private setupRequestOptions(): void {
        const selectBindings: Array<[string, keyof WorkCenterState]> = [
            [".format-select", "outputFormat"],
            [".language-select", "selectedLanguage"],
            [".recognition-select", "recognitionFormat"],
            [".processing-select", "processingFormat"]
        ];
        for (const [selector, property] of selectBindings) {
            const select = this.container?.querySelector(selector) as HTMLSelectElement | null;
            select?.addEventListener("change", () => {
                (this.state[property] as string) = select.value;
                WorkCenterStateManager.saveState(this.state);
            });
        }

        const template = this.container?.querySelector(".template-select") as HTMLSelectElement | null;
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

        const instruction = this.container?.querySelector(".instruction-select") as HTMLSelectElement | null;
        instruction?.addEventListener("change", () => {
            void this.templates.applyInstruction(this.state, instruction.value);
            WorkCenterStateManager.saveState(this.state);
        });
    }

    private setupVoiceInput(): void {
        const voice = this.container?.querySelector('[data-action="voice-input"]') as HTMLButtonElement | null;
        if (!voice) return;
        voice.addEventListener("mousedown", () => this.voice.startVoiceRecording(this.state));
        const stop = () => this.voice.stopVoiceRecording(this.state);
        voice.addEventListener("mouseup", stop);
        voice.addEventListener("mouseleave", stop);
    }

    private setupActions(): void {
        this.container?.addEventListener("click", (event) => {
            const target = event.target as HTMLElement;
            const actionElement = target.closest("[data-action]") as HTMLElement | null;
            const action = actionElement?.dataset.action;
            if (!action || !actionElement) return;

            switch (action) {
                case "select-files":
                    (this.container?.querySelector("[data-workcenter-file-picker]") as HTMLInputElement | null)?.click();
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
                case "remove-draft-attachment":
                    this.ingress.remove(actionElement.dataset.attachmentHash || "");
                    break;
                case "open-request-options":
                    this.togglePanel("[data-workcenter-request-options]", actionElement);
                    void this.templates.fillInstructionSelects(this.container, this.state);
                    break;
                case "refresh-instructions":
                    void this.templates.fillInstructionSelects(this.container, this.state);
                    break;
                case "open-secondary":
                    this.togglePanel("[data-workcenter-secondary]", actionElement);
                    break;
                case "view-action-history":
                    this.history.showActionHistory();
                    break;
                case "edit-templates":
                    this.templates.showTemplateEditor(this.state, this.container as HTMLElement);
                    break;
            }
        });
    }

    private appendDraftText(text: string): void {
        const next = [this.state.draft.content, text]
            .filter(Boolean)
            .join(this.state.draft.content ? "\n" : "");
        this.state.draft.content = next;
        this.state.currentPrompt = next;
        void this.actions.persistDraft(this.state);
        this.deps.render?.();
    }

    private scheduleDraftPersistence(): void {
        if (this.draftPersistTimer) clearTimeout(this.draftPersistTimer);
        this.draftPersistTimer = setTimeout(() => {
            this.draftPersistTimer = null;
            void this.actions.persistDraft(this.state);
        }, 180);
    }

    private togglePanel(selector: string, trigger: HTMLElement): void {
        const panel = this.container?.querySelector(selector) as HTMLElement | null;
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
