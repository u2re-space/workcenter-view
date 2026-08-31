import assert from "node:assert/strict";
import test from "node:test";

import "./dom-shim";
import { createWorkCenterChatShell } from "../src/ts/WorkCenterUI";

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
