import assert from "node:assert/strict";
import test from "node:test";

import "./dom-shim";
import { collectAttachmentCandidates } from "../../../projects/fl.ui/src/ui/inputs/attachments/AttachmentSources";
import { renderSafeMarkdown } from "../../../projects/fl.ui/src/ui/markdown/render";
import { createWorkCenterDocumentPreparer } from "../src/ts/WorkCenterDocumentPreparation";
import { WorkCenterAttachmentIngress } from "../src/ts/WorkCenterAttachmentIngress";

const transfer = (options: {
    files?: File[];
    items?: Array<{ kind: string; type?: string; getAsFile?: () => File | null }>;
    text?: string;
    urls?: string;
}): DataTransfer => ({
    files: options.files ?? [],
    items: options.items ?? [],
    types: [
        ...(options.files?.length ? ["Files"] : []),
        ...(options.text ? ["text/plain"] : []),
        ...(options.urls ? ["text/uri-list"] : [])
    ],
    getData(type: string): string {
        if (type === "text/plain") return options.text ?? "";
        if (type === "text/uri-list") return options.urls ?? "";
        return "";
    }
} as unknown as DataTransfer);

test("text-only paste produces no attachment candidate", () => {
    const candidates = collectAttachmentCandidates(
        transfer({ text: "Keep this in the composer" }),
        "paste"
    );

    assert.deepEqual(candidates, []);
});

test("clipboard image becomes one file attachment candidate", () => {
    const image = new File(["pixel"], "clipboard.png", { type: "image/png" });
    const candidates = collectAttachmentCandidates(
        transfer({
            files: [image],
            items: [{ kind: "file", type: "image/png", getAsFile: () => image }]
        }),
        "paste"
    );

    assert.equal(candidates.length, 1);
    assert.equal(candidates[0]?.kind, "file");
    assert.equal(candidates[0]?.source, "paste");
    assert.equal(candidates[0]?.kind === "file" && candidates[0].file, image);
});

test("drop retains each valid URL instead of only the first line", () => {
    const candidates = collectAttachmentCandidates(
        transfer({
            urls: "# ignored comment\nhttps://example.test/one\nhttps://example.test/two"
        }),
        "drop"
    );

    assert.deepEqual(
        candidates.map((candidate) => candidate.kind === "url" ? candidate.url : ""),
        ["https://example.test/one", "https://example.test/two"]
    );
});

test("safe Markdown renderer removes executable markup", () => {
    const html = renderSafeMarkdown("**safe**<script>window.bad = true</script>");

    assert.match(html, /<strong>safe<\/strong>/);
    assert.doesNotMatch(html, /script|window\.bad/i);
});

test("fenced code language is stamped on data-language", () => {
    const html = renderSafeMarkdown("```ts\nconst x = 1;\n```");

    assert.match(html, /data-language="ts"/);
    assert.match(html, /class="language-ts"/);
    assert.doesNotMatch(html, /<script/i);
});

test("document preparer preserves text, PDF, DOCX, and XLSX content locally", async () => {
    const embeddedImage = new File(["image"], "embedded.png", { type: "image/png" });
    const preparer = createWorkCenterDocumentPreparer({
        pdf: async () => ({ text: "PDF text" }),
        docx: async () => ({ text: "DOCX text", images: [embeddedImage] }),
        xlsx: async () => ({ text: "Sheet: Budget\nitem,value\ncoffee,3" })
    });

    const text = await preparer.prepare(new File(["plain text"], "note.txt", { type: "text/plain" }));
    const pdf = await preparer.prepare(new File(["pdf"], "report.pdf", { type: "application/pdf" }));
    const docx = await preparer.prepare(new File(["docx"], "report.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }));
    const xlsx = await preparer.prepare(new File(["xlsx"], "budget.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }));

    assert.equal(text.kind, "text");
    assert.equal(text.fallbackText, "plain text");
    assert.equal(pdf.fallbackText, "PDF text");
    assert.equal(docx.images[0], embeddedImage);
    assert.match(xlsx.fallbackText || "", /Budget/);
});

test("document preparation surfaces an error without losing its original file", async () => {
    const original = new File(["bad PDF"], "bad.pdf", { type: "application/pdf" });
    const preparer = createWorkCenterDocumentPreparer({
        pdf: async () => {
            throw new Error("Unreadable PDF");
        }
    });

    const prepared = await preparer.prepare(original);
    assert.equal(prepared.original, original);
    assert.equal(prepared.kind, "pdf");
    assert.match(prepared.error || "", /Unreadable PDF/);
});

test("attachment ingress persists a draft once for equal content", async () => {
    const file = new File(["same"], "one.txt", { type: "text/plain", lastModified: 1 });
    const state = {
        files: [] as File[],
        draft: { content: "", attachments: [] as Array<any> }
    };
    const store = {
        async put(input: File) {
            return {
                hash: "same-content",
                path: "/user/workcenter/blobs/same-content",
                name: input.name,
                type: input.type,
                size: input.size,
                lastModified: input.lastModified
            };
        },
        async get() {
            return file;
        }
    };
    const ingress = new WorkCenterAttachmentIngress({ state, store });

    await ingress.addFiles([file, new File(["same"], "two.txt", { type: "text/plain" })]);
    await Promise.resolve();
    await new Promise((resolve) => setTimeout(resolve, 0));

    assert.equal(state.draft.attachments.length, 1);
    assert.equal(state.files.length, 1);
    assert.equal(state.draft.attachments[0]?.hash, "same-content");
});

test("attachment ingress removes a draft file and keeps remaining files", async () => {
    const first = new File(["one"], "one.txt", { type: "text/plain", lastModified: 1 });
    const second = new File(["two"], "two.txt", { type: "text/plain", lastModified: 2 });
    const state = {
        files: [] as File[],
        draft: { content: "", attachments: [] as Array<any> }
    };
    let nextHash = 0;
    const ingress = new WorkCenterAttachmentIngress({
        state,
        store: {
            async put(input: File) {
                nextHash += 1;
                return {
                    hash: `hash-${nextHash}`,
                    path: `/user/workcenter/blobs/hash-${nextHash}`,
                    name: input.name,
                    type: input.type,
                    size: input.size,
                    lastModified: input.lastModified
                };
            },
            async get() {
                return null;
            }
        }
    });

    await ingress.addFiles([first, second]);
    ingress.remove("hash-1");

    assert.equal(state.draft.attachments.length, 1);
    assert.equal(state.draft.attachments[0]?.hash, "hash-2");
    assert.equal(state.files.length, 1);
    assert.equal(state.files[0], second);
});

test("attachment ingress adds a draft file before durable put resolves", async () => {
    const file = new File(["queued"], "queued.txt", { type: "text/plain", lastModified: 4 });
    const state = {
        files: [] as File[],
        draft: { content: "", attachments: [] as Array<any> }
    };
    let changed = 0;
    const ingress = new WorkCenterAttachmentIngress({
        state,
        store: {
            put: () => new Promise(() => undefined),
            async get() {
                return null;
            }
        },
        onChanged: () => {
            changed += 1;
        }
    });

    const added = await ingress.addFiles([file]);

    assert.equal(added.length, 1);
    assert.equal(state.draft.attachments.length, 1);
    assert.equal(state.files[0], file);
    assert.ok(changed >= 1);
});

test("attachment ingress keeps a draft file when durable storage fails", async () => {
    const file = new File(["keep"], "keep.txt", { type: "text/plain", lastModified: 3 });
    const state = {
        files: [] as File[],
        draft: { content: "", attachments: [] as Array<any> }
    };
    const ingress = new WorkCenterAttachmentIngress({
        state,
        store: {
            async put() {
                throw new Error("OPFS unavailable");
            },
            async get() {
                return null;
            }
        }
    });

    const added = await ingress.addFiles([file]);

    assert.equal(added.length, 1);
    assert.equal(state.draft.attachments.length, 1);
    assert.equal(state.files[0], file);
    assert.equal(state.draft.attachments[0]?.name, "keep.txt");
});
