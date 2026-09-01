import assert from "node:assert/strict";
import test from "node:test";

import "./dom-shim";
import {
    WorkCenterSession,
    type WorkCenterSessionPersistence,
    type WorkCenterSessionSnapshot
} from "../src/ts/WorkCenterSession";

const createMemoryPersistence = (): WorkCenterSessionPersistence & {
    saved: WorkCenterSessionSnapshot | null;
    clears: number;
} => ({
    saved: null,
    clears: 0,
    async load() {
        return this.saved;
    },
    async save(snapshot) {
        this.saved = structuredClone(snapshot);
    },
    async clear() {
        this.saved = null;
        this.clears += 1;
    }
});

test("submit captures an immutable user draft before it is cleared", async () => {
    const persistence = createMemoryPersistence();
    const session = new WorkCenterSession(persistence);
    await session.hydrate();

    session.setDraft({
        content: "Summarize this image",
        attachments: [{
            hash: "image-hash",
            path: "/user/workcenter/blobs/image-hash",
            name: "screen.png",
            type: "image/png",
            size: 5,
            lastModified: 1
        }]
    });
    const submitted = await session.submitDraft({ outputFormat: "markdown" });
    session.setDraft({ content: "A later draft", attachments: [] });

    assert.equal(submitted.user.content, "Summarize this image");
    assert.equal(submitted.user.attachments[0]?.name, "screen.png");
    assert.equal(submitted.assistant.status, "pending");
    assert.equal(session.snapshot().draft.content, "A later draft");
    assert.equal(persistence.saved?.messages[0]?.content, "Summarize this image");
});

test("commitDraft accepts a turn without waiting for persistence", async () => {
    let release!: () => void;
    const hang = new Promise<void>((resolve) => {
        release = resolve;
    });
    const persistence = {
        saved: null as WorkCenterSessionSnapshot | null,
        async load() {
            return this.saved;
        },
        async save(snapshot: WorkCenterSessionSnapshot) {
            await hang;
            this.saved = structuredClone(snapshot);
        },
        async clear() {
            this.saved = null;
        }
    };
    const session = new WorkCenterSession(persistence);
    await session.hydrate();
    session.setDraft({ content: "Describe this image", attachments: [] });
    const submitted = session.commitDraft({ outputFormat: "markdown" });
    assert.equal(submitted.user.content, "Describe this image");
    assert.equal(session.snapshot().messages.length, 2);
    assert.equal(persistence.saved, null);
    release();
});

test("hydrate restores a persisted transcript and new chat clears it", async () => {
    const persistence = createMemoryPersistence();
    const original = new WorkCenterSession(persistence);
    await original.hydrate();
    original.setDraft({ content: "Persist me", attachments: [] });
    await original.submitDraft({ outputFormat: "markdown" });

    const reopened = new WorkCenterSession(persistence);
    await reopened.hydrate();
    assert.equal(reopened.snapshot().messages.length, 2);
    assert.equal(reopened.snapshot().messages[0]?.content, "Persist me");

    await reopened.newChat();
    assert.deepEqual(reopened.snapshot().messages, []);
    assert.equal(persistence.clears, 1);
});

test("retry keeps the original submitted turn after a failed assistant result", async () => {
    const persistence = createMemoryPersistence();
    const session = new WorkCenterSession(persistence);
    await session.hydrate();
    session.setDraft({ content: "Analyze the document", attachments: [] });
    const submitted = await session.submitDraft({ outputFormat: "markdown" });
    await session.completeAssistant(submitted.assistant.id, {
        status: "failed",
        error: "Network unavailable"
    });

    const retry = await session.retry(submitted.assistant.id);
    assert.equal(retry.user.content, "Analyze the document");
    assert.equal(retry.assistant.status, "pending");
    assert.equal(session.snapshot().draft.content, "");
});

test("attachment preparation errors stay attached to the submitted user turn", async () => {
    const persistence = createMemoryPersistence();
    const session = new WorkCenterSession(persistence);
    await session.hydrate();
    session.setDraft({
        content: "Read this",
        attachments: [{
            hash: "broken-pdf",
            path: "/user/workcenter/blobs/broken-pdf",
            name: "broken.pdf",
            type: "application/pdf",
            size: 1,
            lastModified: 1
        }]
    });
    const submitted = await session.submitDraft({ outputFormat: "markdown" });

    await session.markAttachmentError(submitted.user.id, "broken-pdf", "Unreadable PDF");

    assert.equal(
        session.snapshot().messages[0]?.attachments[0]?.error,
        "Unreadable PDF"
    );
});
