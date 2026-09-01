/**
 * Open and download Work Center attachments from the stored file, not the chip label.
 *
 * FIND:workcenter-attachment-view
 * WHY: Transcript and draft chips must reach the OPFS blob (or remote URL) so
 * the user can inspect the file itself, not only its name.
 */
import type { WorkCenterAttachmentRef } from "./WorkCenterSession";

export type WorkCenterAttachmentOpenOptions = {
    host: HTMLElement;
    attachment: WorkCenterAttachmentRef;
    file: File | null;
    objectUrl: string | null;
};

const TEXT_TYPES = new Set([
    "application/json",
    "application/xml",
    "application/javascript",
    "application/typescript",
    "application/x-javascript",
    "text/uri-list",
    "text/markdown"
]);

const isTextAttachment = (file: File, type: string): boolean => {
    if (type.startsWith("text/")) return true;
    if (TEXT_TYPES.has(type)) return true;
    return /\.(txt|md|json|csv|xml|svg|ts|js|mjs|css|scss|html|yml|yaml)$/i.test(file.name);
};

const closeExistingViewer = (host: HTMLElement): void => {
    host.querySelector("[data-workcenter-attachment-viewer]")?.remove();
};

/** Download the stored blob, or open a remote URL when there is no local file. */
export const downloadWorkCenterAttachment = (options: {
    name: string;
    remoteUrl?: string;
    objectUrl: string | null;
}): void => {
    const href = options.objectUrl || options.remoteUrl;
    if (!href) return;
    const link = document.createElement("a");
    link.href = href;
    if (options.objectUrl) link.download = options.name;
    else link.target = "_blank";
    link.rel = "noreferrer";
    link.click();
};

/** Show the attachment in a modal, a new tab, or as readable text. */
export const openWorkCenterAttachment = async (
    options: WorkCenterAttachmentOpenOptions
): Promise<void> => {
    const { host, attachment, file, objectUrl } = options;
    if (attachment.url) {
        window.open(attachment.url, "_blank", "noopener,noreferrer");
        return;
    }
    if (!file && !objectUrl) return;

    closeExistingViewer(host);
    const type = (file?.type || attachment.type || "").toLowerCase();
    const dialog = document.createElement("dialog");
    dialog.className = "wc-attachment-viewer";
    dialog.dataset.workcenterAttachmentViewer = "";
    dialog.setAttribute("aria-label", attachment.name);

    const header = document.createElement("header");
    header.className = "wc-attachment-viewer__header";
    const title = document.createElement("h3");
    title.textContent = attachment.name;
    const close = document.createElement("button");
    close.type = "button";
    close.className = "wc-icon-button";
    close.setAttribute("aria-label", "Close attachment");
    close.dataset.action = "close-attachment-viewer";
    close.textContent = "×";
    header.append(title, close);
    dialog.append(header);

    const body = document.createElement("div");
    body.className = "wc-attachment-viewer__body";

    if (type.startsWith("image/") && objectUrl) {
        const image = document.createElement("img");
        image.className = "wc-attachment-viewer__frame";
        image.src = objectUrl;
        image.alt = attachment.name;
        body.append(image);
    } else if (file && isTextAttachment(file, type)) {
        const pre = document.createElement("pre");
        pre.className = "wc-attachment-viewer__text";
        pre.textContent = await file.text();
        body.append(pre);
    } else if (objectUrl) {
        const frame = document.createElement("iframe");
        frame.className = "wc-attachment-viewer__frame";
        frame.src = objectUrl;
        frame.title = attachment.name;
        body.append(frame);
    }

    dialog.append(body);
    dialog.addEventListener("close", () => dialog.remove());
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
    });
    close.addEventListener("click", () => dialog.close());
    host.append(dialog);
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
};
