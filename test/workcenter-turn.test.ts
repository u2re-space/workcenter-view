import assert from "node:assert/strict";
import test from "node:test";

import "./dom-shim";
import {
    buildWorkCenterTurnInput,
    type WorkCenterTurnRequest
} from "../../../../apps/CWSP-process/src/service/service/WorkCenterTurnInput";
import {
    WorkCenterTurnService
} from "../../../../apps/CWSP-process/src/service/service/WorkCenterTurnPolicy";

const requestWithPdf = (file: File): WorkCenterTurnRequest => ({
    messages: [{ role: "user", content: "Summarize the report" }],
    attachments: [{
        attachmentId: "report",
        original: file,
        kind: "pdf",
        fallbackText: "Locally extracted report",
        images: []
    }],
    instruction: "Answer briefly",
    options: { outputFormat: "markdown" }
});

test("eligible PDF becomes an input_file response part", async () => {
    const request = requestWithPdf(new File(["PDF"], "report.pdf", {
        type: "application/pdf"
    }));
    const built = await buildWorkCenterTurnInput(request, { directFileByteLimit: 1_024 });
    const content = built.input.at(-1)?.content as Array<Record<string, string>>;
    const filePart = content.find((part) => part.type === "input_file");

    assert.equal(built.usedDirectFile, true);
    assert.equal(filePart?.filename, "report.pdf");
    assert.match(filePart?.file_data || "", /^data:application\/pdf;base64,/);
});

test("oversized direct files fall back to local document text", async () => {
    const request = requestWithPdf(new File(["PDF"], "report.pdf", {
        type: "application/pdf"
    }));
    const built = await buildWorkCenterTurnInput(request, { directFileByteLimit: 1 });
    const content = built.input.at(-1)?.content as Array<Record<string, string>>;

    assert.equal(built.usedDirectFile, false);
    assert.ok(content.some((part) => part.type === "input_text" && /Locally extracted report/.test(part.text)));
});

test("an input_file capability rejection retries once with local text", async () => {
    const service = new WorkCenterTurnService();
    const calls: Array<{ usedDirectFile: boolean }> = [];
    const result = await service.run(
        requestWithPdf(new File(["PDF"], "report.pdf", { type: "application/pdf" })),
        async (_input, _options, metadata) => {
            calls.push(metadata);
            return calls.length === 1
                ? { ok: false, error: "input_file is not supported by this provider" }
                : { ok: true, data: "Prepared fallback" };
        }
    );

    assert.equal(result.ok, true);
    assert.deepEqual(calls, [{ usedDirectFile: true }, { usedDirectFile: false }]);
});

test("a cancelled turn never invokes or retries the request executor", async () => {
    const controller = new AbortController();
    controller.abort();
    let calls = 0;

    const result = await new WorkCenterTurnService().run(
        {
            ...requestWithPdf(new File(["PDF"], "report.pdf", { type: "application/pdf" })),
            signal: controller.signal
        },
        async () => {
            calls += 1;
            return { ok: true, data: "Unexpected" };
        }
    );

    assert.equal(calls, 0);
    assert.equal(result.error, "Cancelled");
});
