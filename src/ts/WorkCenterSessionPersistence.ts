/**
 * Durable adapter for the single persisted Work Center conversation.
 *
 * FIND:workcenter-session-persistence
 * WHY: OPFS via the worker bridge times out on process.u2re.space; the
 * transcript must still survive reload. File bytes stay content-addressed;
 * this adapter never serializes File objects into JSON.
 */
import { createContentAddressedStore, type ContentAddressedStore } from "@fest-lib/lure";
import {
    resolveLoadedSessionSnapshot,
    sessionSnapshotHasContent,
    type WorkCenterSessionPersistence,
    type WorkCenterSessionSnapshot
} from "./WorkCenterSession";

export const WORKCENTER_OPFS_NAMESPACE = "/user/workcenter";
const MANIFEST_PATH = "session.json";
export const WORKCENTER_SESSION_IDB_NAME = "cwsp-workcenter";
const IDB_STORE = "kv";
const IDB_KEY = "session";
export const WORKCENTER_SESSION_LS_KEY = "cwsp-workcenter-session-v1";

const isSnapshot = (value: unknown): value is WorkCenterSessionSnapshot => {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Partial<WorkCenterSessionSnapshot>;
    return candidate.version === 1 &&
        Array.isArray(candidate.messages) &&
        !!candidate.draft &&
        typeof candidate.draft.content === "string" &&
        Array.isArray(candidate.draft.attachments);
};

const readLocalSnapshot = (): WorkCenterSessionSnapshot | null => {
    try {
        if (typeof localStorage === "undefined") return null;
        const raw = localStorage.getItem(WORKCENTER_SESSION_LS_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return isSnapshot(parsed) ? parsed : null;
    } catch {
        return null;
    }
};

const writeLocalSnapshot = (snapshot: WorkCenterSessionSnapshot | null): void => {
    try {
        if (typeof localStorage === "undefined") return;
        if (!snapshot) {
            localStorage.removeItem(WORKCENTER_SESSION_LS_KEY);
            return;
        }
        localStorage.setItem(WORKCENTER_SESSION_LS_KEY, JSON.stringify(snapshot));
    } catch {
        /* quota / private mode — IDB or OPFS may still hold the chat */
    }
};

const openSessionIdb = (): Promise<IDBDatabase> => new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
        reject(new Error("IndexedDB unavailable"));
        return;
    }
    const req = indexedDB.open(WORKCENTER_SESSION_IDB_NAME, 1);
    req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("IndexedDB open failed"));
});

const readIdbSnapshot = async (): Promise<WorkCenterSessionSnapshot | null> => {
    try {
        const db = await openSessionIdb();
        return await new Promise((resolve, reject) => {
            const tx = db.transaction(IDB_STORE, "readonly");
            const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
            req.onsuccess = () => {
                const value = req.result;
                resolve(isSnapshot(value) ? value : null);
            };
            req.onerror = () => reject(req.error);
            tx.oncomplete = () => db.close();
        });
    } catch {
        return null;
    }
};

const writeIdbSnapshot = async (snapshot: WorkCenterSessionSnapshot | null): Promise<void> => {
    const db = await openSessionIdb();
    await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(IDB_STORE, "readwrite");
        const store = tx.objectStore(IDB_STORE);
        const req = snapshot ? store.put(snapshot, IDB_KEY) : store.delete(IDB_KEY);
        req.onerror = () => reject(req.error);
        tx.oncomplete = () => {
            db.close();
            resolve();
        };
        tx.onerror = () => reject(tx.error);
    });
};

const withTimeout = <T>(task: Promise<T>, ms: number, fallback: T): Promise<T> =>
    Promise.race([
        task,
        new Promise<T>((resolve) => {
            setTimeout(() => resolve(fallback), ms);
        })
    ]);

export const createWorkCenterSessionPersistence = (
    store: ContentAddressedStore = createContentAddressedStore(WORKCENTER_OPFS_NAMESPACE)
): WorkCenterSessionPersistence => ({
    load: async () => {
        const local = readLocalSnapshot();
        const idb = await withTimeout(readIdbSnapshot(), 200, null);
        const quick = resolveLoadedSessionSnapshot(local, idb, null);
        /* INVARIANT: LS/IDB are SoT. Skip OPFS when they already have the chat. */
        if (sessionSnapshotHasContent(quick)) return quick;
        /* WHY: OPFS worker on process.u2re.space often times out; do not block chips/chat on it. */
        const opfs = await withTimeout(
            store.readJson<WorkCenterSessionSnapshot>(MANIFEST_PATH).catch(() => null),
            400,
            null
        );
        return resolveLoadedSessionSnapshot(local, idb, opfs);
    },
    save: async (snapshot) => {
        /* Sync LS first — process PWA can die before OPFS worker finishes. */
        writeLocalSnapshot(snapshot);
        await withTimeout(writeIdbSnapshot(snapshot).catch(() => undefined), 250, undefined);
        /* WHY: OPFS writeJson hangs on process.u2re.space; awaiting it blocked persistTail and hydrate. */
        void store.writeJson(MANIFEST_PATH, snapshot).catch(() => undefined);
    },
    clear: async () => {
        writeLocalSnapshot(null);
        await withTimeout(writeIdbSnapshot(null).catch(() => undefined), 250, undefined);
        void store.clear().catch(() => undefined);
    }
});

export const createWorkCenterAttachmentStore = (): ContentAddressedStore =>
    createContentAddressedStore(WORKCENTER_OPFS_NAMESPACE);
