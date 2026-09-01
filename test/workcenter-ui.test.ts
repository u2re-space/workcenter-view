import assert from "node:assert/strict";
import test from "node:test";

import "./dom-shim";
import { createWorkCenterChatShell, syncWorkCenterChatForAttachments } from "../src/ts/WorkCenterUI";

const render = () => createWorkCenterChatShell({
    title: "AI Work Center",
    draft: { content: "", attachments: [] },
    messages: [
        {
            id: "user-1",
            role: "user",
            content: "Read this document",
            attachments: [],
            status: "complete",
            createdAt: 1
        },
        {
            id: "assistant-pending",
            role: "assistant",
            content: "",
            attachments: [],
            status: "pending",
            createdAt: 2
        },
        {
            id: "assistant-failed",
            role: "assistant",
            content: "",
            attachments: [],
            status: "failed",
            error: "Offline",
            createdAt: 3
        }
    ]
});

test("chat shell exposes a labelled main landmark and live transcript", () => {
    const root = render();
    assert.equal(root.getAttribute("role"), "main");

    const transcript = root.querySelector("[data-workcenter-transcript]");
    assert.ok(transcript);
    assert.equal(transcript.getAttribute("role"), "log");
    assert.equal(transcript.getAttribute("aria-live"), "polite");
    assert.equal(
        transcript.querySelectorAll("[data-workcenter-message]").length,
        3
    );
});

test("chat shell keeps named composer and session controls", () => {
    const root = render();
    for (const action of ["new-chat", "open-request-options", "select-files", "execute"]) {
        const control = root.querySelector(`[data-action="${action}"]`);
        assert.ok(control, `missing ${action}`);
        assert.ok(
            control.getAttribute("aria-label") || control.textContent?.trim(),
            `unlabelled ${action}`
        );
    }
});

test("pending and failed assistant messages expose cancel and retry actions", () => {
    const root = render();
    assert.ok(root.querySelector('[data-action="cancel-turn"][data-turn-id="assistant-pending"]'));
    assert.ok(root.querySelector('[data-action="retry-turn"][data-turn-id="assistant-failed"]'));
});

const sampleAttachment = {
    hash: "note-hash",
    path: "/user/workcenter/blobs/note-hash",
    name: "note.txt",
    type: "text/plain",
    size: 12,
    lastModified: 1
};

test("composer textarea can grow with long drafts", () => {
    const root = render();
    const prompt = root.querySelector(".prompt-input");
    assert.ok(prompt);
    assert.ok(prompt.hasAttribute("data-composer-autogrow"));
    assert.ok(root.querySelector("[data-composer-resize]"));
});

test("composer shows an attachment count when files are in the draft", () => {
    const empty = render();
    assert.equal((empty.querySelector("[data-draft-files]") as HTMLElement).hidden, true);
    assert.ok(empty.querySelector("[data-workcenter-file-picker]"));

    const root = createWorkCenterChatShell({
        title: "AI Work Center",
        draft: { content: "", attachments: [sampleAttachment] },
        messages: []
    });
    assert.equal(root.querySelector("[data-attach-count]")?.textContent, "1");
    assert.equal(root.querySelector("[data-attach-label]")?.textContent, "1 file");
    assert.equal((root.querySelector("[data-draft-files]") as HTMLElement).hidden, false);
    syncWorkCenterChatForAttachments(root);
    const composer = root.querySelector("[data-workcenter-composer]") as HTMLElement;
    assert.ok(composer.classList.contains("has-attachments"));
    assert.ok(composer.style.getPropertyValue("--wc-composer-min"));
});

test("draft attachments expose view, download, and remove actions", () => {
    const root = createWorkCenterChatShell({
        title: "AI Work Center",
        draft: { content: "", attachments: [sampleAttachment] },
        messages: []
    });

    assert.ok(root.querySelector('[data-action="view-attachment"][data-attachment-hash="note-hash"]'));
    assert.ok(root.querySelector('[data-action="download-attachment"][data-attachment-hash="note-hash"]'));
    assert.ok(root.querySelector('[data-action="remove-draft-attachment"][data-attachment-hash="note-hash"]'));
});

test("sent attachments stay viewable without a remove control", () => {
    const root = createWorkCenterChatShell({
        title: "AI Work Center",
        draft: { content: "", attachments: [] },
        messages: [{
            id: "user-attach",
            role: "user",
            content: "See file",
            attachments: [sampleAttachment],
            status: "complete",
            createdAt: 1
        }]
    });

    assert.ok(root.querySelector('[data-action="view-attachment"][data-attachment-hash="note-hash"]'));
    assert.equal(root.querySelector('[data-action="remove-draft-attachment"]'), null);
});

test("completed assistant messages retain a copy action", () => {
    const root = createWorkCenterChatShell({
        title: "AI Work Center",
        draft: { content: "", attachments: [] },
        messages: [{
            id: "assistant-complete",
            role: "assistant",
            content: "Saved answer",
            attachments: [],
            status: "complete",
            createdAt: 4
        }]
    });

    assert.ok(root.querySelector('[data-action="copy-turn"][data-turn-id="assistant-complete"]'));
});
