/*
 * Filename: WorkCenterCommandBus.ts
 * FullPath: modules/views/workcenter-view/src/ts/WorkCenterCommandBus.ts
 * FIND:workcenter-commands
 *
 * INVARIANT: page listens on rs-workcenter + rs-view-workcenter. CRX SW uses chrome.runtime.
 */

import { BROADCAST_CHANNELS, viewBroadcastChannelName } from "com/other/config/Names";
import { unwrapSwInteropMessage } from "com/routing/channel/UniformInterop";
import {
    isWorkCenterCommand,
    isWorkCenterCommandEnvelope,
    type WorkCenterCommand
} from "./WorkCenterCommands";

export type WorkCenterCommandHandler = (command: WorkCenterCommand) => void | Promise<void>;

const channelNames = (): string[] => [BROADCAST_CHANNELS.WORK_CENTER, viewBroadcastChannelName("workcenter")];

export const bindWorkCenterCommandBus = (handler: WorkCenterCommandHandler): (() => void) => {
    if (typeof BroadcastChannel === "undefined") return () => {};
    const channels: BroadcastChannel[] = [];
    const onMessage = (event: MessageEvent): void => {
        const unwrapped = unwrapSwInteropMessage(event.data);
        const data = unwrapped
            ? (unwrapped.type === "workcenter-command" && unwrapped.command
                ? { type: "workcenter-command", command: unwrapped.command }
                : unwrapped.command && isWorkCenterCommand(unwrapped.command)
                    ? { type: "workcenter-command", command: unwrapped.command }
                    : unwrapped.raw)
            : event.data;
        const command = isWorkCenterCommandEnvelope(data)
            ? data.command
            : isWorkCenterCommand(data)
                ? data
                : null;
        if (!command) return;
        void handler(command);
    };
    for (const name of channelNames()) {
        try {
            const channel = new BroadcastChannel(name);
            channel.addEventListener("message", onMessage);
            channels.push(channel);
        } catch {
            /* ignore */
        }
    }
    return () => {
        for (const channel of channels) {
            try {
                channel.removeEventListener("message", onMessage);
                channel.close();
            } catch {
                /* ignore */
            }
        }
    };
};
