/**
 * Test-only browser globals for Work Center contracts.
 *
 * The production view targets Chromium. These tests use jsdom only to exercise
 * DOM semantics and do not replace browser integration coverage.
 */
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    pretendToBeVisual: true,
    url: "https://workcenter.test/"
});

const globals = [
    "window",
    "document",
    "navigator",
    "HTMLElement",
    "HTMLButtonElement",
    "HTMLInputElement",
    "HTMLTextAreaElement",
    "Element",
    "Node",
    "CustomEvent",
    "Event",
    "EventTarget",
    "MutationObserver",
    "File",
    "Blob",
    "DOMException",
    "URL"
] as const;

for (const name of globals) {
    try {
        (globalThis as Record<string, unknown>)[name] = (dom.window as unknown as Record<string, unknown>)[name];
    } catch {
        Object.defineProperty(globalThis, name, {
            configurable: true,
            writable: true,
            value: (dom.window as unknown as Record<string, unknown>)[name]
        });
    }
}

(globalThis as typeof globalThis & { requestAnimationFrame: typeof requestAnimationFrame }).requestAnimationFrame =
    (callback: FrameRequestCallback) => setTimeout(() => callback(Date.now()), 0) as unknown as number;

export {};
