/**
 * Conversation-first DOM composition for Work Center.
 *
 * FIND:workcenter-chat-ui
 * WHY: The primary reading order is the transcript, not a stack of output and
 * input cards; secondary pipeline controls stay available without dominating it.
 */
import type { WorkCenterDependencies, WorkCenterState } from "./WorkCenterState";
import type { WorkCenterAttachments } from "./WorkCenterAttachments";
import type { WorkCenterPrompts } from "./WorkCenterPrompts";
import type { WorkCenterResults } from "./WorkCenterResults";
import type { WorkCenterHistory } from "./WorkCenterHistory";
import type { WorkCenterAttachmentRef, WorkCenterDraft, WorkCenterMessage } from "./WorkCenterSession";
import { renderSafeMarkdown } from "../../../../projects/fl.ui/src/ui/markdown/render";

export type WorkCenterAttachmentPresentation = {
    fileFor(ref: WorkCenterAttachmentRef): File | null;
    getPreviewUrl(file: File): string | null;
};

export type WorkCenterChatShellOptions = {
    title: string;
    draft: WorkCenterDraft;
    messages: WorkCenterMessage[];
    attachments?: WorkCenterAttachmentPresentation;
    settings?: WorkCenterState;
};

const icon = (name: string, size = "18"): HTMLElement => {
    const element = document.createElement("ui-icon");
    element.setAttribute("icon", name);
    element.setAttribute("icon-style", "duotone");
    element.setAttribute("size", size);
    element.setAttribute("aria-hidden", "true");
    return element;
};

const button = (
    action: string,
    label: string,
    iconName: string,
    className = "wc-icon-button"
): HTMLButtonElement => {
    const element = document.createElement("button");
    element.type = "button";
    element.className = className;
    element.dataset.action = action;
    element.setAttribute("aria-label", label);
    element.title = label;
    element.append(icon(iconName));
    return element;
};

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const appendAttachmentCard = (
    target: HTMLElement,
    attachment: WorkCenterAttachmentRef,
    presentation?: WorkCenterAttachmentPresentation,
    removable = false
): void => {
    const card = document.createElement("div");
    card.className = "wc-attachment-chip";
    card.dataset.attachmentHash = attachment.hash;

    const file = presentation?.fileFor(attachment) ?? null;
    const preview = file ? presentation?.getPreviewUrl(file) : null;
    if (preview) {
        const image = document.createElement("img");
        image.className = "wc-attachment-chip__preview";
        image.src = preview;
        image.alt = "";
        image.decoding = "async";
        image.loading = "lazy";
        card.append(image);
    } else {
        card.append(icon(attachment.url ? "link" : "paperclip", "16"));
    }

    const label = document.createElement(attachment.url ? "a" : "span");
    label.className = "wc-attachment-chip__label";
    label.textContent = attachment.url || attachment.name;
    if (attachment.url) {
        const link = label as HTMLAnchorElement;
        link.href = attachment.url;
        link.target = "_blank";
        link.rel = "noreferrer";
    }
    card.append(label);

    const meta = document.createElement("span");
    meta.className = "wc-attachment-chip__meta";
    meta.textContent = attachment.error || formatFileSize(attachment.size);
    card.append(meta);

    if (removable) {
        const remove = button("remove-draft-attachment", `Remove ${attachment.name}`, "x", "wc-chip-remove");
        remove.dataset.attachmentHash = attachment.hash;
        card.append(remove);
    }
    target.append(card);
};

const appendMessage = (
    transcript: HTMLElement,
    message: WorkCenterMessage,
    presentation?: WorkCenterAttachmentPresentation
): void => {
    const item = document.createElement("article");
    item.className = `workcenter-message workcenter-message--${message.role} is-${message.status}`;
    item.dataset.workcenterMessage = "";
    item.dataset.messageId = message.id;

    const header = document.createElement("div");
    header.className = "workcenter-message__header";
    const author = document.createElement("span");
    author.className = "workcenter-message__author";
    author.textContent = message.role === "user" ? "You" : "Work Center";
    header.append(author);
    item.append(header);

    const body = document.createElement("div");
    body.className = "workcenter-message__body";
    if (message.role === "assistant" && message.status === "complete") {
        body.innerHTML = renderSafeMarkdown(message.content);
    } else if (message.status === "pending") {
        body.textContent = "Thinking…";
        body.setAttribute("aria-busy", "true");
    } else if (message.status === "failed") {
        body.textContent = message.error || "The response could not be completed.";
    } else if (message.status === "cancelled") {
        body.textContent = "Cancelled";
    } else {
        body.textContent = message.content;
    }
    item.append(body);

    if (message.attachments.length) {
        const attachments = document.createElement("div");
        attachments.className = "workcenter-message__attachments";
        for (const attachment of message.attachments) {
            appendAttachmentCard(attachments, attachment, presentation);
        }
        item.append(attachments);
    }

    if (message.role === "assistant" && message.status === "pending") {
        const actions = document.createElement("div");
        actions.className = "workcenter-message__actions";
        const cancel = button("cancel-turn", "Cancel response", "stop-circle", "wc-quiet-button");
        cancel.dataset.turnId = message.id;
        actions.append(cancel);
        item.append(actions);
    }
    if (message.role === "assistant" && message.status === "failed") {
        const actions = document.createElement("div");
        actions.className = "workcenter-message__actions";
        const retry = button("retry-turn", "Retry response", "arrow-clockwise", "wc-quiet-button");
        retry.dataset.turnId = message.id;
        actions.append(retry);
        item.append(actions);
    }
    if (message.role === "assistant" && message.status === "complete") {
        const actions = document.createElement("div");
        actions.className = "workcenter-message__actions";
        const copy = button("copy-turn", "Copy response", "copy", "wc-quiet-button");
        copy.dataset.turnId = message.id;
        actions.append(copy);
        item.append(actions);
    }
    transcript.append(item);
};

const createRequestOptions = (state: WorkCenterState): HTMLElement => {
    const panel = document.createElement("section");
    panel.className = "workcenter-request-options";
    panel.dataset.workcenterRequestOptions = "";
    panel.hidden = true;
    panel.setAttribute("aria-label", "Response options");

    const templateLabel = document.createElement("label");
    templateLabel.textContent = "Template";
    const templateSelect = document.createElement("select");
    templateSelect.className = "template-select";
    const emptyTemplate = document.createElement("option");
    emptyTemplate.value = "";
    emptyTemplate.textContent = "No template";
    templateSelect.append(emptyTemplate);
    for (const template of state.promptTemplates) {
        const option = document.createElement("option");
        option.value = template.prompt;
        option.textContent = template.name;
        option.selected = template.prompt === state.selectedTemplate;
        templateSelect.append(option);
    }
    templateLabel.append(templateSelect);
    panel.append(templateLabel);
    panel.append(button("edit-templates", "Edit templates", "gear", "wc-quiet-button"));

    const fields: Array<[string, string, string, Array<[string, string]>]> = [
        ["Output", "format-select", state.outputFormat, [
            ["auto", "Auto"], ["markdown", "Markdown"], ["json", "JSON"],
            ["code", "Code"], ["raw", "Raw text"], ["text", "Plain text"], ["html", "HTML"]
        ]],
        ["Language", "language-select", state.selectedLanguage, [
            ["auto", "Auto"], ["en", "English"], ["ru", "Русский"]
        ]],
        ["Recognition", "recognition-select", state.recognitionFormat, [
            ["auto", "Auto"], ["most-suitable", "Most suitable"],
            ["most-optimized", "Most optimized"], ["most-legibility", "Most legible"],
            ["markdown", "Markdown"], ["html", "HTML"], ["text", "Plain text"], ["json", "JSON"]
        ]],
        ["Processing", "processing-select", state.processingFormat, [
            ["markdown", "Markdown"], ["html", "HTML"], ["json", "JSON"], ["text", "Plain text"],
            ["typescript", "TypeScript"], ["javascript", "JavaScript"], ["python", "Python"],
            ["java", "Java"], ["cpp", "C++"], ["csharp", "C#"], ["php", "PHP"],
            ["ruby", "Ruby"], ["go", "Go"], ["rust", "Rust"], ["xml", "XML"],
            ["yaml", "YAML"], ["css", "CSS"], ["scss", "SCSS"]
        ]]
    ];

    for (const [labelText, className, value, options] of fields) {
        const label = document.createElement("label");
        label.textContent = labelText;
        const select = document.createElement("select");
        select.className = className;
        for (const [optionValue, optionText] of options) {
            const option = document.createElement("option");
            option.value = optionValue;
            option.textContent = optionText;
            option.selected = optionValue === value;
            select.append(option);
        }
        label.append(select);
        panel.append(label);
    }
    return panel;
};

/** Build a stateless, accessible Work Center chat shell for rendering or tests. */
export const createWorkCenterChatShell = (options: WorkCenterChatShellOptions): HTMLElement => {
    const root = document.createElement("div");
    root.className = "workcenter-view workcenter-chat";
    root.dataset.view = "workcenter";
    root.setAttribute("role", "main");
    root.setAttribute("aria-labelledby", "workcenter-title");

    const header = document.createElement("header");
    header.className = "workcenter-header";
    const title = document.createElement("h2");
    title.id = "workcenter-title";
    title.textContent = options.title;
    header.append(title);
    const headerActions = document.createElement("div");
    headerActions.className = "workcenter-header__actions";
    headerActions.append(
        button("new-chat", "New chat", "plus"),
        button("open-secondary", "Open activity", "clock-counter-clockwise"),
        button("open-request-options", "Response options", "sliders-horizontal")
    );
    header.append(headerActions);
    root.append(header);
    if (options.settings) root.append(createRequestOptions(options.settings));

    const transcript = document.createElement("section");
    transcript.className = "workcenter-transcript";
    transcript.dataset.workcenterTranscript = "";
    transcript.setAttribute("role", "log");
    transcript.setAttribute("aria-live", "polite");
    transcript.setAttribute("aria-relevant", "additions text");
    if (!options.messages.length) {
        const empty = document.createElement("p");
        empty.className = "workcenter-transcript__empty";
        empty.textContent = "Start with a question or attach something to review.";
        transcript.append(empty);
    } else {
        for (const message of options.messages) appendMessage(transcript, message, options.attachments);
    }
    root.append(transcript);

    const composer = document.createElement("form");
    composer.className = "workcenter-composer";
    composer.dataset.workcenterComposer = "";
    composer.setAttribute("aria-label", "Message composer");
    const chips = document.createElement("div");
    chips.className = "workcenter-composer__attachments";
    chips.dataset.draftAttachments = "";
    for (const attachment of options.draft.attachments) {
        appendAttachmentCard(chips, attachment, options.attachments, true);
    }
    composer.append(chips);

    const inputRow = document.createElement("div");
    inputRow.className = "workcenter-composer__input-row";
    const prompt = document.createElement("textarea");
    prompt.className = "prompt-input";
    prompt.name = "prompt";
    prompt.rows = 1;
    prompt.placeholder = "Message Work Center…";
    prompt.value = options.draft.content;
    prompt.setAttribute("aria-label", "Message Work Center");
    inputRow.append(prompt);
    inputRow.append(button("select-files", "Attach files", "paperclip"));
    inputRow.append(button("voice-input", "Voice input", "microphone"));
    const send = button("execute", "Send message", "arrow-up", "wc-send-button");
    send.type = "submit";
    inputRow.append(send);
    composer.append(inputRow);
    root.append(composer);

    const secondary = document.createElement("aside");
    secondary.className = "workcenter-secondary-panel";
    secondary.dataset.workcenterSecondary = "";
    secondary.hidden = true;
    secondary.setAttribute("aria-label", "Work Center activity");
    secondary.append(button("view-action-history", "View technical activity", "clock-counter-clockwise", "wc-quiet-button"));
    root.append(secondary);
    return root;
};

/** Presentation facade that keeps legacy callers working while the view uses chat state. */
export class WorkCenterUI {
    private container: HTMLElement | null = null;

    constructor(
        private readonly deps: WorkCenterDependencies,
        private readonly attachments: WorkCenterAttachments,
        private readonly prompts: WorkCenterPrompts,
        private readonly results: WorkCenterResults,
        private readonly history: WorkCenterHistory,
        private readonly presentation?: WorkCenterAttachmentPresentation
    ) {}

    setContainer(container: HTMLElement | null): void {
        this.container = container;
        this.attachments.setContainer(container);
        this.prompts.setContainer(container);
        this.results.setContainer(container);
        this.history.setContainer(container);
    }

    getContainer(): HTMLElement | null {
        return this.container;
    }

    renderWorkCenterView(state: WorkCenterState): HTMLElement {
        const container = createWorkCenterChatShell({
            title: "AI Work Center",
            draft: state.draft,
            messages: state.messages,
            attachments: this.presentation,
            settings: state
        });
        this.setContainer(container);
        return container;
    }

    updateFileCounter(state: WorkCenterState): void {
        const attachments = this.container?.querySelector("[data-draft-attachments]") as HTMLElement | null;
        if (!attachments) return;
        attachments.replaceChildren();
        for (const attachment of state.draft.attachments) {
            appendAttachmentCard(attachments, attachment, this.presentation, true);
        }
    }

    updateFileList(state: WorkCenterState): void {
        this.updateFileCounter(state);
    }

    updatePromptInput(state: WorkCenterState): void {
        const input = this.container?.querySelector(".prompt-input") as HTMLTextAreaElement | null;
        if (input) input.value = state.draft.content;
    }

    updateTemplateSelect(_state: WorkCenterState): void {}
    updateVoiceButton(_state: WorkCenterState): void {}
    updateDataPipeline(_state: WorkCenterState): void {}
    updateDataCounters(_state: WorkCenterState): void {}
    showProcessingMessage(_message: string): void {}
    showResult(_state: WorkCenterState): void {}
    showError(_error: string): void {}
    clearResults(): void {}

    revokeAllPreviewUrls(_state: WorkCenterState): void {
        this.attachments.revokeAllPreviewUrls(_state);
    }
}
