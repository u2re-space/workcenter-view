import assert from "node:assert/strict";
import test from "node:test";

import "./dom-shim";
import {
    pickRichestSessionSnapshot,
    resolveLoadedSessionSnapshot,
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
    assert.equal(persistence.saved?.messages.length, 0);
    assert.equal(persistence.saved?.epoch, 1);
});

test("new-chat epoch beats a stale longer transcript", () => {
    const stale: WorkCenterSessionSnapshot = {
        version: 1,
        epoch: 0,
        draft: { content: "", attachments: [] },
        messages: [{
            id: "user-1",
            role: "user",
            createdAt: 1,
            content: "old",
            attachments: [],
            status: "complete"
        }]
    };
    const cleared: WorkCenterSessionSnapshot = {
        version: 1,
        epoch: 1,
        draft: { content: "", attachments: [] },
        messages: []
    };
    const picked = pickRichestSessionSnapshot(stale, cleared);
    assert.equal(picked?.epoch, 1);
    assert.deepEqual(picked?.messages, []);
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

test("persistDraft before hydrate does not wipe a saved transcript", async () => {
    const persistence = createMemoryPersistence();
    persistence.saved = {
        version: 1,
        epoch: 0,
        draft: { content: "", attachments: [] },
        messages: [
            {
                id: "user-1",
                role: "user",
                createdAt: 1,
                content: "keep me",
                attachments: [],
                status: "complete"
            },
            {
                id: "asst-1",
                role: "assistant",
                createdAt: 2,
                content: "### Answer",
                attachments: [],
                status: "complete"
            }
        ]
    };
    const session = new WorkCenterSession(persistence);
    await session.persistDraft();
    assert.equal(persistence.saved?.messages[0]?.content, "keep me");
    await session.hydrate();
    assert.equal(session.snapshot().messages[1]?.content, "### Answer");
    assert.equal(persistence.saved?.messages[1]?.content, "### Answer");
});

test("empty persist cannot race past a pending hydrate", async () => {
    let releaseLoad!: () => void;
    const hangLoad = new Promise<void>((resolve) => {
        releaseLoad = resolve;
    });
    const saved: WorkCenterSessionSnapshot = {
        version: 1,
        epoch: 0,
        draft: { content: "", attachments: [] },
        messages: [{
            id: "user-1",
            role: "user",
            createdAt: 1,
            content: "keep me",
            attachments: [],
            status: "complete"
        }]
    };
    const persistence = {
        saved,
        async load() {
            await hangLoad;
            return structuredClone(this.saved);
        },
        async save(snapshot: WorkCenterSessionSnapshot) {
            this.saved = structuredClone(snapshot);
        },
        async clear() {
            this.saved = saved;
        }
    };
    const session = new WorkCenterSession(persistence);
    const hydrateP = session.hydrate();
    await session.persistDraft();
    releaseLoad();
    await hydrateP;
    assert.equal(persistence.saved.messages[0]?.content, "keep me");
});

test("hydrate returns even when save hangs", async () => {
    const persistence: WorkCenterSessionPersistence = {
        async load() {
            return {
                version: 1,
                epoch: 0,
                draft: { content: "", attachments: [] },
                messages: [{
                    id: "user-1",
                    role: "user",
                    createdAt: 1,
                    content: "keep me",
                    attachments: [],
                    status: "complete"
                }]
            };
        },
        async save() {
            await new Promise(() => {});
        },
        async clear() {}
    };
    const session = new WorkCenterSession(persistence);
    const snapshot = await Promise.race([
        session.hydrate(),
        new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error("hydrate hung on save")), 200);
        })
    ]);
    assert.equal(snapshot.messages[0]?.content, "keep me");
});

test("LS transcript wins over empty higher-epoch OPFS", () => {
    const local: WorkCenterSessionSnapshot = {
        version: 1,
        epoch: 0,
        draft: { content: "", attachments: [] },
        messages: [{
            id: "user-1",
            role: "user",
            createdAt: 1,
            content: "keep me",
            attachments: [],
            status: "complete"
        }]
    };
    const opfs: WorkCenterSessionSnapshot = {
        version: 1,
        epoch: 1,
        draft: { content: "", attachments: [] },
        messages: []
    };
    const loaded = resolveLoadedSessionSnapshot(local, null, opfs);
    assert.equal(loaded?.messages[0]?.content, "keep me");
    assert.equal(loaded?.epoch, 0);
});

test("hydrate does not replace a live pending turn with a stale snapshot", async () => {
    const persistence = createMemoryPersistence();
    persistence.saved = {
        version: 1,
        epoch: 0,
        draft: { content: "", attachments: [] },
        messages: []
    };
    const session = new WorkCenterSession(persistence);
    session.setDraft({ content: "Analyze the integral", attachments: [] });
    const submitted = session.commitDraft({ outputFormat: "markdown" });
    session.applyAssistantCompletion(submitted.assistant.id, {
        status: "complete",
        content: "### Main Topic"
    });

    await session.hydrate();

    const assistant = session.snapshot().messages.find((entry) => entry.role === "assistant");
    assert.equal(assistant?.id, submitted.assistant.id);
    assert.equal(assistant?.status, "complete");
    assert.equal(assistant?.content, "### Main Topic");
});
