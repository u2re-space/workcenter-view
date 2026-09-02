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
    pickRichestSessionSnapshot,
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

export const createWorkCenterSessionPersistence = (
    store: ContentAddressedStore = createContentAddressedStore(WORKCENTER_OPFS_NAMESPACE)
): WorkCenterSessionPersistence => ({
    load: async () => {
        const [opfs, idb] = await Promise.all([
            store.readJson<WorkCenterSessionSnapshot>(MANIFEST_PATH).catch(() => null),
            readIdbSnapshot()
        ]);
        return pickRichestSessionSnapshot(opfs, idb, readLocalSnapshot());
    },
    save: async (snapshot) => {
        /* Sync LS first — process PWA can die before OPFS worker finishes. */
        writeLocalSnapshot(snapshot);
        await Promise.allSettled([
            writeIdbSnapshot(snapshot).catch(() => undefined),
            store.writeJson(MANIFEST_PATH, snapshot)
        ]);
    },
    clear: async () => {
        writeLocalSnapshot(null);
        await Promise.allSettled([
            writeIdbSnapshot(null).catch(() => undefined),
            store.clear()
        ]);
    }
});

export const createWorkCenterAttachmentStore = (): ContentAddressedStore =>
    createContentAddressedStore(WORKCENTER_OPFS_NAMESPACE);
