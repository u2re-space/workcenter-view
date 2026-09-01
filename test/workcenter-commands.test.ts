import assert from "node:assert/strict";
import test from "node:test";

import {
    WorkCenterSession,
    type WorkCenterSessionPersistence,
    type WorkCenterSessionSnapshot
} from "../src/ts/WorkCenterSession";
import {
    isWorkCenterCommand,
    isWorkCenterCommandEnvelope,
    wrapWorkCenterCommand
} from "../src/ts/WorkCenterCommands";

const createMemoryPersistence = (): WorkCenterSessionPersistence & {
    saved: WorkCenterSessionSnapshot | null;
} => ({
    saved: null,
    async load() {
        return this.saved;
    },
    async save(snapshot) {
        this.saved = structuredClone(snapshot);
    },
    async clear() {
        this.saved = null;
    }
});

test("command envelope wraps hydrate and draft.set", () => {
    const hydrate = wrapWorkCenterCommand({ type: "hydrate" });
    assert.equal(isWorkCenterCommandEnvelope(hydrate), true);
    assert.equal(isWorkCenterCommand(hydrate.command), true);
    const draft = wrapWorkCenterCommand({
        type: "draft.set",
        draft: { content: "hi", attachments: [] }
    });
    assert.equal(draft.command.type, "draft.set");
    assert.equal(isWorkCenterCommand({ type: "nope" }), false);
});

test("session reducer stays the durable store for commit", async () => {
    const persistence = createMemoryPersistence();
    const session = new WorkCenterSession(persistence);
    await session.hydrate();
    session.setDraft({ content: "ping", attachments: [] });
    const submitted = session.commitDraft({ outputFormat: "text" });
    assert.equal(submitted.user.content, "ping");
    assert.equal(session.snapshot().draft.content, "");
    assert.equal(session.snapshot().messages.length, 2);
});
