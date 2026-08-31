/**
 * OPFS adapter for the single persisted Work Center conversation.
 *
 * FIND:workcenter-session-persistence
 * WHY: The state machine remains testable against memory while this adapter
 * owns the physical OPFS namespace and never serializes File bytes to JSON.
 */
import { createContentAddressedStore, type ContentAddressedStore } from "@fest-lib/lure";
import type { WorkCenterSessionPersistence, WorkCenterSessionSnapshot } from "./WorkCenterSession";

export const WORKCENTER_OPFS_NAMESPACE = "/user/workcenter";
const MANIFEST_PATH = "session.json";

export const createWorkCenterSessionPersistence = (
    store: ContentAddressedStore = createContentAddressedStore(WORKCENTER_OPFS_NAMESPACE)
): WorkCenterSessionPersistence => ({
    load: () => store.readJson<WorkCenterSessionSnapshot>(MANIFEST_PATH),
    save: (snapshot) => store.writeJson(MANIFEST_PATH, snapshot),
    clear: () => store.clear()
});

export const createWorkCenterAttachmentStore = (): ContentAddressedStore =>
    createContentAddressedStore(WORKCENTER_OPFS_NAMESPACE);
