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

const formatAttachCount = (count: number): string =>
    count === 1 ? "1 file" : `${count} files`;

const attachmentGlyph = (attachment: WorkCenterAttachmentRef): string => {
    if (attachment.url) return "link";
    const type = attachment.type.toLowerCase();
    const name = attachment.name.toLowerCase();
    if (type.startsWith("image/")) return "image";
    if (type === "application/pdf" || name.endsWith(".pdf")) return "file-pdf";
    if (type.includes("wordprocessingml") || name.endsWith(".docx") || name.endsWith(".doc")) return "file-doc";
    if (type.includes("spreadsheetml") || name.endsWith(".xlsx") || name.endsWith(".xls")) return "file-xls";
    if (type.startsWith("text/") || name.endsWith(".md") || name.endsWith(".txt") || name.endsWith(".csv")) {
        return "file-text";
    }
    return "paperclip";
};

/** Grow the composer textarea with its text; a dragged min-height can still expand further. */
export const syncWorkCenterComposerHeight = (root: ParentNode | null): void => {
    const input = root?.querySelector<HTMLTextAreaElement>(".prompt-input");
    if (!input) return;
    //input.style.blockSize = "auto";
    //input.style.blockSize = `${Math.max(input.scrollHeight, 1)}px`;
};

/** After attachments land, grow the composer (and a floating window) so the rail is not clipped. */
export const syncWorkCenterChatForAttachments = (root: ParentNode | null): void => {
    syncWorkCenterComposerHeight(root);
    const composer = root?.querySelector<HTMLElement>("[data-workcenter-composer]");
    if (!composer) return;
    const rail = composer.querySelector<HTMLElement>("[data-draft-files]");
    const hasFiles = Boolean(rail && !rail.hidden);
    composer.classList.toggle("has-attachments", hasFiles);
    if (!hasFiles) {
        composer.style.removeProperty("--wc-composer-min");
        return;
    }
    const chat = (root instanceof HTMLElement ? root : composer.closest(".workcenter-chat")) as HTMLElement | null;
    const needed = Math.max(composer.scrollHeight, composer.offsetHeight, 200);
    const cap = chat ? Math.max(200, chat.clientHeight * 0.75 || 540) : 540;
    composer.style.setProperty("--wc-composer-min", `${Math.min(needed, cap)}px`);

    const extra = rail?.getBoundingClientRect().height || 0;
    const frame = chat?.closest("ui-window");
    if (!(frame instanceof HTMLElement) || extra <= 0) return;
    const rect = frame.getBoundingClientRect();
    const next = Math.min((globalThis.innerHeight || rect.height) * 0.92, rect.height + extra);
    if (next > rect.height + 4) {
        frame.style.blockSize = `${Math.round(next)}px`;
    }
};

const appendAttachmentCard = (
    target: HTMLElement,
    attachment: WorkCenterAttachmentRef,
    presentation?: WorkCenterAttachmentPresentation,
    removable = false
): void => {
    const card = document.createElement("article");
    const isImage = attachment.type.startsWith("image/");
    card.className = `wc-attachment-chip${isImage ? " is-image" : ""}`;
    card.dataset.attachmentHash = attachment.hash;

    const file = presentation?.fileFor(attachment) ?? null;
    const preview = file ? presentation?.getPreviewUrl(file) : null;

    const open = document.createElement("button");
    open.type = "button";
    open.className = "wc-attachment-chip__open";
    open.dataset.action = "view-attachment";
    open.dataset.attachmentHash = attachment.hash;
    open.setAttribute("aria-label", `View ${attachment.name}`);
    open.title = `View ${attachment.name}`;

    if (preview) {
        const image = document.createElement("img");
        image.className = "wc-attachment-chip__preview";
        image.src = preview;
        image.alt = "";
        image.decoding = "async";
        image.loading = "lazy";
        open.append(image);
    } else {
        const glyph = icon(attachmentGlyph(attachment), "20");
        glyph.classList.add("wc-attachment-chip__glyph");
        open.append(glyph);
    }

    const copy = document.createElement("span");
    copy.className = "wc-attachment-chip__copy";
    const label = document.createElement("span");
    label.className = "wc-attachment-chip__label";
    label.textContent = attachment.url || attachment.name;
    const meta = document.createElement("span");
    meta.className = "wc-attachment-chip__meta";
    meta.textContent = attachment.error || formatFileSize(attachment.size);
    copy.append(label, meta);
    open.append(copy);
    card.append(open);

    const actions = document.createElement("div");
    actions.className = "wc-attachment-chip__actions";
    const download = button("download-attachment", `Download ${attachment.name}`, "download", "wc-chip-remove");
    download.dataset.attachmentHash = attachment.hash;
    actions.append(download);
    if (removable) {
        const remove = button("remove-draft-attachment", `Remove ${attachment.name}`, "trash", "wc-chip-remove");
        remove.dataset.attachmentHash = attachment.hash;
        actions.append(remove);
    }
    card.append(actions);
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

    const instructionLabel = document.createElement("label");
    instructionLabel.textContent = "Instruction";
    const instructionSelect = document.createElement("select");
    instructionSelect.className = "instruction-select";
    instructionSelect.setAttribute("data-action", "select-instruction");
    const emptyInstruction = document.createElement("option");
    emptyInstruction.value = "";
    emptyInstruction.textContent = "None (default)";
    instructionSelect.append(emptyInstruction);
    instructionLabel.append(instructionSelect);
    panel.append(instructionLabel);

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
    const resize = document.createElement("div");
    resize.className = "workcenter-composer__resize";
    resize.dataset.composerResize = "";
    resize.setAttribute("role", "separator");
    resize.setAttribute("aria-orientation", "horizontal");
    resize.setAttribute("aria-label", "Resize composer");
    resize.title = "Drag to stretch the composer";
    composer.append(resize);
    const fileRail = document.createElement("div");
    fileRail.className = "workcenter-composer__files";
    fileRail.dataset.draftFiles = "";
    fileRail.hidden = options.draft.attachments.length === 0;
    const fileHead = document.createElement("div");
    fileHead.className = "workcenter-composer__files-head";
    const fileLabel = document.createElement("span");
    fileLabel.dataset.attachLabel = "";
    fileLabel.textContent = formatAttachCount(options.draft.attachments.length);
    fileHead.append(fileLabel);
    const chips = document.createElement("div");
    chips.className = "workcenter-composer__attachments";
    chips.dataset.draftAttachments = "";
    for (const attachment of options.draft.attachments) {
        appendAttachmentCard(chips, attachment, options.attachments, true);
    }
    fileRail.append(fileHead, chips);
    composer.append(fileRail);

    const inputRow = document.createElement("div");
    inputRow.className = "workcenter-composer__input-row";
    const prompt = document.createElement("textarea");
    prompt.className = "prompt-input";
    prompt.name = "prompt";
    prompt.rows = 1;
    prompt.dataset.composerAutogrow = "";
    prompt.placeholder = "Message Work Center…";
    prompt.value = options.draft.content;
    prompt.setAttribute("aria-label", "Message Work Center");
    inputRow.append(prompt);
    const attach = document.createElement("label");
    attach.className = "wc-icon-button wc-attach-button";
    attach.dataset.action = "select-files";
    attach.setAttribute("aria-label", options.draft.attachments.length
        ? `Attach files, ${formatAttachCount(options.draft.attachments.length)} attached`
        : "Attach files");
    attach.title = "Attach files";
    const picker = document.createElement("input");
    picker.type = "file";
    picker.multiple = true;
    picker.className = "wc-file-picker";
    picker.dataset.workcenterFilePicker = "";
    const badge = document.createElement("span");
    badge.className = "wc-attach-count";
    badge.dataset.attachCount = "";
    badge.textContent = String(options.draft.attachments.length);
    badge.hidden = options.draft.attachments.length === 0;
    attach.append(picker, icon("paperclip"), badge);
    inputRow.append(attach);
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

    updateFileCounter(state: WorkCenterState, root: ParentNode | null = this.container): void {
        const count = state.draft.attachments.length;
        const rail = root?.querySelector("[data-draft-files]") as HTMLElement | null;
        if (rail) rail.hidden = count === 0;
        const label = root?.querySelector("[data-attach-label]");
        if (label) label.textContent = formatAttachCount(count);
        const badge = root?.querySelector("[data-attach-count]") as HTMLElement | null;
        if (badge) {
            badge.textContent = String(count);
            badge.hidden = count === 0;
        }
        const attach = root?.querySelector("[data-action='select-files']");
        attach?.setAttribute(
            "aria-label",
            count ? `Attach files, ${formatAttachCount(count)} attached` : "Attach files"
        );
        const attachments = root?.querySelector("[data-draft-attachments]") as HTMLElement | null;
        if (!attachments) return;
        attachments.replaceChildren();
        for (const attachment of state.draft.attachments) {
            appendAttachmentCard(attachments, attachment, this.presentation, true);
        }
        syncWorkCenterChatForAttachments(root);
    }

    updateFileList(state: WorkCenterState): void {
        this.updateFileCounter(state);
    }

    updatePromptInput(state: WorkCenterState): void {
        const input = this.container?.querySelector(".prompt-input") as HTMLTextAreaElement | null;
        if (input) input.value = state.draft.content;
        syncWorkCenterComposerHeight(this.container);
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
