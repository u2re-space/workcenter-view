/**
 * Work Center's single attachment mutation path.
 *
 * FIND:workcenter-attachment-ingress
 * INVARIANT: Validation and persistence finish before a draft receives a new
 * reference, preventing partial attachments after a failed paste or drop.
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
        for (const file of files) {
            const validation = validateReadableFileForIngress(file);
            if (!validation.ok) {
                this.options.onRejected?.(validation.reason || "Unsupported file");
                continue;
            }

            try {
                const ref = toRef(await this.options.store.put(file));
                if (this.options.state.draft.attachments.some((item) => item.hash === ref.hash)) {
                    continue;
                }
                this.options.state.draft.attachments.push(ref);
                this.options.state.files.push(file);
                this.filesByHash.set(ref.hash, file);
                added.push(ref);
            } catch (error) {
                this.options.onRejected?.(
                    error instanceof Error ? error.message : "Unable to store attachment"
                );
            }
        }
        if (added.length) this.options.onChanged?.();
        return added;
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
        const file = this.filesByHash.get(hash);
        if (file) this.revokePreview(file);
        this.filesByHash.delete(hash);
        this.options.state.draft.attachments = this.options.state.draft.attachments
            .filter((attachment) => attachment.hash !== hash);
        this.options.state.files = this.options.state.files.filter((candidate) => candidate !== file);
        this.options.onChanged?.();
    }

    getPreviewUrl(file: File): string | null {
        if (!file.type.startsWith("image/")) return null;
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
