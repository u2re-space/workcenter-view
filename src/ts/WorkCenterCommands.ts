/*
 * Filename: WorkCenterCommands.ts
 * FullPath: modules/views/workcenter-view/src/ts/WorkCenterCommands.ts
 * FIND:workcenter-commands
 * TAG:workcenter-chat,workcenter
 *
 * INVARIANT: WorkCenterSession is the only durable store. Commands do not clone draft.
 */

import type { WorkCenterAttachmentRef, WorkCenterDraft, WorkCenterRequestOptions } from "./WorkCenterSession";

export const WORKCENTER_COMMAND_TYPE = "workcenter-command";

export type WorkCenterCommand =
    | { type: "hydrate" }
    | { type: "snapshot" }
    | { type: "draft.set"; draft: WorkCenterDraft }
    | { type: "draft.commit"; request?: WorkCenterRequestOptions }
    | { type: "attach.add"; files?: File[] }
    | { type: "attach.remove"; hash: string }
    | { type: "turn.execute"; request?: WorkCenterRequestOptions }
    | { type: "turn.cancel"; assistantId: string }
    | { type: "turn.retry"; assistantId: string }
    | { type: "ingress.apply"; payload: unknown };

export type WorkCenterCommandEnvelope = {
    type: typeof WORKCENTER_COMMAND_TYPE;
    command: WorkCenterCommand;
};

export const isWorkCenterCommand = (value: unknown): value is WorkCenterCommand => {
    if (!value || typeof value !== "object") return false;
    const type = String((value as { type?: unknown }).type || "");
    return (
        type === "hydrate" ||
        type === "snapshot" ||
        type === "draft.set" ||
        type === "draft.commit" ||
        type === "attach.add" ||
        type === "attach.remove" ||
        type === "turn.execute" ||
        type === "turn.cancel" ||
        type === "turn.retry" ||
        type === "ingress.apply"
    );
};

export const isWorkCenterCommandEnvelope = (value: unknown): value is WorkCenterCommandEnvelope => {
    if (!value || typeof value !== "object") return false;
    const row = value as { type?: unknown; command?: unknown };
    return row.type === WORKCENTER_COMMAND_TYPE && isWorkCenterCommand(row.command);
};

export const wrapWorkCenterCommand = (command: WorkCenterCommand): WorkCenterCommandEnvelope => ({
    type: WORKCENTER_COMMAND_TYPE,
    command
});
