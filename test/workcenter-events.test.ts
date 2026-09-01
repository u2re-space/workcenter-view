import assert from "node:assert/strict";
import test from "node:test";

import "./dom-shim";
import { WorkCenterEvents } from "../src/ts/WorkCenterEvents";
import { createWorkCenterChatShell } from "../src/ts/WorkCenterUI";

const transfer = (files: File[] = [], text = ""): DataTransfer => ({
    files,
    items: files.map((file) => ({
        kind: "file",
        type: file.type,
        getAsFile: () => file
    })),
    getData: (type: string) => type === "text/plain" ? text : ""
} as unknown as DataTransfer);

const tick = async (): Promise<void> => {
    await Promise.resolve();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
};

test("composer leaves a text-only paste native but ingests a pasted image", async () => {
    const root = createWorkCenterChatShell({
        title: "AI Work Center",
        draft: { content: "", attachments: [] },
        messages: []
    });
    const state = {
        draft: { content: "", attachments: [] },
        files: [],
        currentPrompt: "",
        outputFormat: "auto",
        selectedLanguage: "auto",
        recognitionFormat: "auto",
        processingFormat: "markdown"
    } as any;
    const accepted: File[][] = [];
    const ingress = {
        addFiles: async (files: File[]) => {
            accepted.push(files);
            return [];
        },
        addUrl: async () => null,
        remove: () => undefined
    } as any;
    const events = new WorkCenterEvents(
        { showMessage: () => undefined, render: () => undefined } as any,
        { persistDraft: async () => undefined, executeUnifiedAction: async () => undefined } as any,
        {} as any,
        {} as any,
        {} as any,
        ingress,
        state
    );
    events.setContainer(root);
    events.setupWorkCenterEvents();

    const textarea = root.querySelector(".prompt-input") as HTMLTextAreaElement;
    const textPaste = new Event("paste", { bubbles: true, cancelable: true });
    Object.defineProperty(textPaste, "clipboardData", { value: transfer() });
    textarea.dispatchEvent(textPaste);
    assert.equal(textPaste.defaultPrevented, false);

    const image = new File(["image"], "clipboard.png", { type: "image/png" });
    const imagePaste = new Event("paste", { bubbles: true, cancelable: true });
    Object.defineProperty(imagePaste, "clipboardData", { value: transfer([image]) });
    textarea.dispatchEvent(imagePaste);
    await tick();

    assert.equal(imagePaste.defaultPrevented, true);
    assert.deepEqual(accepted, [[image]]);
});

test("composer drop routes files through the shared attachment ingress", async () => {
    const root = createWorkCenterChatShell({
        title: "AI Work Center",
        draft: { content: "", attachments: [] },
        messages: []
    });
    const state = {
        draft: { content: "", attachments: [] },
        files: [],
        currentPrompt: "",
        outputFormat: "auto",
        selectedLanguage: "auto",
        recognitionFormat: "auto",
        processingFormat: "markdown"
    } as any;
    const accepted: File[][] = [];
    const events = new WorkCenterEvents(
        { showMessage: () => undefined, render: () => undefined } as any,
        { persistDraft: async () => undefined, executeUnifiedAction: async () => undefined } as any,
        {} as any,
        {} as any,
        {} as any,
        {
            addFiles: async (files: File[]) => {
                accepted.push(files);
                return [];
            },
            addUrl: async () => null,
            remove: () => undefined
        } as any,
        state
    );
    events.setContainer(root);
    events.setupWorkCenterEvents();

    const file = new File(["text"], "drop.txt", { type: "text/plain" });
    const drop = new Event("drop", { bubbles: true, cancelable: true });
    Object.defineProperty(drop, "dataTransfer", { value: transfer([file]) });
    root.querySelector("[data-workcenter-composer]")?.dispatchEvent(drop);
    await tick();

    assert.deepEqual(accepted, [[file]]);
});

test("plain-text drop persists the appended composer draft immediately", async () => {
    const root = createWorkCenterChatShell({
        title: "AI Work Center",
        draft: { content: "First line", attachments: [] },
        messages: []
    });
    const state = {
        draft: { content: "First line", attachments: [] },
        files: [],
        currentPrompt: "First line",
        outputFormat: "auto",
        selectedLanguage: "auto",
        recognitionFormat: "auto",
        processingFormat: "markdown"
    } as any;
    let persisted = 0;
    const events = new WorkCenterEvents(
        { showMessage: () => undefined, render: () => undefined } as any,
        {
            persistDraft: async () => {
                persisted += 1;
            },
            executeUnifiedAction: async () => undefined
        } as any,
        {} as any,
        {} as any,
        {} as any,
        { addFiles: async () => [], addUrl: async () => null, remove: () => undefined } as any,
        state
    );
    events.setContainer(root);
    events.setupWorkCenterEvents();

    const drop = new Event("drop", { bubbles: true, cancelable: true });
    Object.defineProperty(drop, "dataTransfer", { value: transfer([], "Dropped line") });
    root.querySelector("[data-workcenter-composer]")?.dispatchEvent(drop);
    await tick();

    assert.equal(state.draft.content, "First line\nDropped line");
    assert.equal(persisted, 1);
});

test("draft attachment remove action deletes that file from ingress", () => {
    const attachment = {
        hash: "note-hash",
        path: "/user/workcenter/blobs/note-hash",
        name: "note.txt",
        type: "text/plain",
        size: 12,
        lastModified: 1
    };
    const root = createWorkCenterChatShell({
        title: "AI Work Center",
        draft: { content: "", attachments: [attachment] },
        messages: []
    });
    const removed: string[] = [];
    const events = new WorkCenterEvents(
        { showMessage: () => undefined, render: () => undefined } as any,
        { persistDraft: async () => undefined, executeUnifiedAction: async () => undefined } as any,
        {} as any,
        {} as any,
        {} as any,
        {
            addFiles: async () => [],
            addUrl: async () => null,
            remove: (hash: string) => {
                removed.push(hash);
            }
        } as any,
        {
            draft: { content: "", attachments: [attachment] },
            files: [],
            messages: [],
            currentPrompt: ""
        } as any
    );
    events.setContainer(root);
    events.setupWorkCenterEvents();

    const remove = root.querySelector('[data-action="remove-draft-attachment"]') as HTMLButtonElement;
    remove.dispatchEvent(new Event("click", { bubbles: true }));

    assert.deepEqual(removed, ["note-hash"]);
});
