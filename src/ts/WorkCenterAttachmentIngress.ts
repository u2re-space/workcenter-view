/**
 * Work Center's single attachment mutation path.
 *
 * FIND:workcenter-attachment-ingress
 * INVARIANT: The live draft receives a file before OPFS persistence, so a hung
 * worker cannot hide an attachment the user just picked or dropped.
 */
import { validateReadableFileForIngress } from "com/core/view-ingress-validation";
import type { StoredBlobRef } from "@fest-lib/lure";
import type { WorkCenterAttachmentRef, WorkCenterDraft } from "./WorkCenterSession";

export type WorkCenterAttachmentStore = Pick<{
    put(file: File): Promise<StoredBlobRef>;
    get(ref: StoredBlobRef): Promise<File | null>;
}, "put" | "get">;

export type WorkCenterIngressState = {
    files: File[];
    draft: WorkCenterDraft;
};

export type WorkCenterAttachmentIngressOptions = {
    state: WorkCenterIngressState;
    store: WorkCenterAttachmentStore;
    onChanged?: () => void;
    onRejected?: (reason: string) => void;
};

const toRef = (ref: StoredBlobRef): WorkCenterAttachmentRef => ({ ...ref });

const asFile = (value: File): File => {
    if (typeof File !== "undefined" && value instanceof File) return value;
    const blob = value as Blob;
    return new File([blob], String((value as File)?.name || "attachment"), {
        type: String((value as File)?.type || blob.type || "application/octet-stream"),
        lastModified: Number((value as File)?.lastModified) || Date.now()
    });
};

const toHex = (bytes: ArrayBuffer): string =>
    [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");

const localHash = async (file: File): Promise<string> => {
    const bytes = await file.arrayBuffer();
    try {
        if (globalThis.crypto?.subtle) {
            return toHex(await globalThis.crypto.subtle.digest("SHA-256", bytes));
        }
    } catch {
        /* fall through to a local fingerprint */
    }
    let hash = 2166136261;
    for (const byte of new Uint8Array(bytes)) hash = Math.imul(hash ^ byte, 16777619);
    return `fnv-${(hash >>> 0).toString(16)}-${file.size}`;
};

const nameForUrl = (url: string): string => {
    try {
        const parsed = new URL(url);
        return parsed.hostname || "link";
    } catch {
        return "link";
    }
};

/** Owns draft attachment state, file identity, and preview URL lifecycle. */
export class WorkCenterAttachmentIngress {
    private previewUrls = new WeakMap<File, string>();
    private filesByHash = new Map<string, File>();

    constructor(private readonly options: WorkCenterAttachmentIngressOptions) {}

    async addFiles(files: Iterable<File>): Promise<WorkCenterAttachmentRef[]> {
        const added: WorkCenterAttachmentRef[] = [];
        for (const incoming of files) {
            const file = asFile(incoming);
            const validation = validateReadableFileForIngress(file);
            if (!validation.ok) {
                this.options.onRejected?.(validation.reason || "Unsupported file");
                continue;
            }
            const hash = await localHash(file);
            if (
                this.filesByHash.has(hash) ||
                this.options.state.draft.attachments.some((item) => item.hash === hash)
            ) {
                continue;
            }

            const ref: WorkCenterAttachmentRef = {
                hash,
                path: "",
                name: file.name || "attachment",
                type: file.type || "application/octet-stream",
                size: file.size,
                lastModified: file.lastModified || Date.now()
            };
            this.options.state.draft.attachments.push(ref);
            this.options.state.files.push(file);
            this.filesByHash.set(ref.hash, file);
            added.push(ref);
            void this.persistInBackground(file, ref);
        }
        if (added.length) this.options.onChanged?.();
        return added;
    }

    private async persistInBackground(file: File, ref: WorkCenterAttachmentRef): Promise<void> {
        try {
            const stored = toRef(await this.options.store.put(file));
            const draftRef = this.options.state.draft.attachments.find((item) => item.hash === ref.hash);
            if (!draftRef) return;
            const duplicate = this.options.state.draft.attachments.find((item) =>
                item !== draftRef && item.hash === stored.hash
            );
            if (duplicate) {
                this.remove(ref.hash);
                return;
            }
            this.filesByHash.set(stored.hash, file);
            Object.assign(draftRef, stored);
            this.options.onChanged?.();
        } catch {
            try {
                const hash = await localHash(file);
                const draftRef = this.options.state.draft.attachments.find((item) => item.hash === ref.hash);
                if (draftRef && !this.filesByHash.has(hash)) draftRef.hash = hash;
                this.filesByHash.set(hash, file);
            } catch {
                /* keep the live memory ref */
            }
        }
    }

    /** Store a URL as a local text file while retaining link-card metadata. */
    async addUrl(url: string): Promise<WorkCenterAttachmentRef | null> {
        try {
            const parsed = new URL(url);
            if (!["http:", "https:"].includes(parsed.protocol)) return null;
            const file = new File([parsed.toString()], `${nameForUrl(parsed.toString())}.url`, {
                type: "text/uri-list"
            });
            const [ref] = await this.addFiles([file]);
            if (!ref) return null;
            ref.url = parsed.toString();
            const draftRef = this.options.state.draft.attachments.find((item) => item.hash === ref.hash);
            if (draftRef) draftRef.url = ref.url;
            this.options.onChanged?.();
            return ref;
        } catch {
            this.options.onRejected?.("Invalid URL attachment");
            return null;
        }
    }

    async hydrate(refs: WorkCenterAttachmentRef[]): Promise<File[]> {
        const files: File[] = [];
        for (const ref of refs) {
            const file = await this.resolve(ref);
            if (!file) continue;
            files.push(file);
        }
        return files;
    }

    async resolve(ref: WorkCenterAttachmentRef): Promise<File | null> {
        const cached = this.filesByHash.get(ref.hash);
        if (cached) return cached;
        const file = await this.options.store.get(ref);
        if (file) this.filesByHash.set(ref.hash, file);
        return file;
    }

    remove(hash: string): void {
        if (!hash) return;
        const file = this.filesByHash.get(hash);
        if (file) this.revokePreview(file);
        this.filesByHash.delete(hash);
        this.options.state.draft.attachments = this.options.state.draft.attachments
            .filter((attachment) => attachment.hash !== hash);
        /* WHY: rebuild from the draft map so a missing Weak/identity match cannot leave a stale File. */
        this.options.state.files = this.options.state.draft.attachments
            .map((attachment) => this.filesByHash.get(attachment.hash))
            .filter((candidate): candidate is File => Boolean(candidate));
        this.options.onChanged?.();
    }

    /** Blob URL for any stored file so the viewer can open PDFs and downloads, not only image thumbs. */
    objectUrlFor(file: File): string | null {
        const existing = this.previewUrls.get(file);
        if (existing) return existing;
        try {
            const url = URL.createObjectURL(file);
            this.previewUrls.set(file, url);
            return url;
        } catch {
            return null;
        }
    }

    getPreviewUrl(file: File): string | null {
        if (!file.type.startsWith("image/")) return null;
        return this.objectUrlFor(file);
    }

    revokePreview(file: File): void {
        const url = this.previewUrls.get(file);
        if (url) URL.revokeObjectURL(url);
        this.previewUrls.delete(file);
    }

    revokeAllPreviews(): void {
        for (const file of this.filesByHash.values()) this.revokePreview(file);
    }

    fileFor(ref: WorkCenterAttachmentRef): File | null {
        return this.filesByHash.get(ref.hash) || null;
    }
}
