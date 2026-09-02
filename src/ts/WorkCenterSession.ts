/**
 * Durable conversation state independent from the Work Center DOM.
 *
 * FIND:workcenter-session
 * INVARIANT: A submitted draft is copied into a user turn before the draft is
 * cleared, so later paste/drop activity cannot alter an in-flight request.
 */
export type WorkCenterAttachmentRef = {
    hash: string;
    path: string;
    name: string;
    type: string;
    size: number;
    lastModified: number;
    url?: string;
    error?: string;
};

export type WorkCenterRequestOptions = {
    outputFormat?: string;
    language?: string;
    recognitionFormat?: string;
    processingFormat?: string;
};

export type WorkCenterMessage = {
    id: string;
    role: "user" | "assistant";
    createdAt: number;
    content: string;
    attachments: WorkCenterAttachmentRef[];
    status: "complete" | "pending" | "failed" | "cancelled";
    rawResult?: unknown;
    error?: string;
    request?: WorkCenterRequestOptions;
    parentId?: string;
};

export type WorkCenterDraft = {
    content: string;
    attachments: WorkCenterAttachmentRef[];
};

export type WorkCenterSessionSnapshot = {
    version: 1;
    draft: WorkCenterDraft;
    messages: WorkCenterMessage[];
    epoch: number;
};

export interface WorkCenterSessionPersistence {
    load(): Promise<WorkCenterSessionSnapshot | null>;
    save(snapshot: WorkCenterSessionSnapshot): Promise<void>;
    clear(): Promise<void>;
}

const emptySnapshot = (): WorkCenterSessionSnapshot => ({
    version: 1,
    draft: { content: "", attachments: [] },
    messages: [],
    epoch: 0
});

const createId = (prefix: string): string =>
    `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;

const cloneRef = (attachment: WorkCenterAttachmentRef): WorkCenterAttachmentRef => ({ ...attachment });

const cloneMessage = (message: WorkCenterMessage): WorkCenterMessage => ({
    ...message,
    attachments: message.attachments.map(cloneRef),
    request: message.request ? { ...message.request } : undefined
});

const cloneSnapshot = (snapshot: WorkCenterSessionSnapshot): WorkCenterSessionSnapshot => ({
    version: 1,
    epoch: snapshot.epoch,
    draft: {
        content: snapshot.draft.content,
        attachments: snapshot.draft.attachments.map(cloneRef)
    },
    messages: snapshot.messages.map(cloneMessage)
});

/** Persist only display fields — GPT envelopes can be huge or cyclic and stall OPFS. */
const slimRawResult = (value: unknown): unknown => {
    if (value == null || typeof value !== "object") return value;
    const row = value as Record<string, unknown>;
    return {
        ok: row.ok,
        data: typeof row.data === "string" ? row.data : undefined,
        error: typeof row.error === "string" ? row.error : undefined,
        responseId: typeof row.responseId === "string" ? row.responseId : undefined
    };
};

const isSnapshot = (value: unknown): value is WorkCenterSessionSnapshot => {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Partial<WorkCenterSessionSnapshot>;
    return candidate.version === 1 &&
        Array.isArray(candidate.messages) &&
        !!candidate.draft &&
        typeof candidate.draft.content === "string" &&
        Array.isArray(candidate.draft.attachments);
};

export type AssistantCompletion = Pick<WorkCenterMessage, "status"> &
    Partial<Pick<WorkCenterMessage, "content" | "rawResult" | "error">>;

/** Conversation mutation facade that persists every durable transition. */
export class WorkCenterSession {
    private state = emptySnapshot();
    private persistGeneration = 0;
    private persistTail: Promise<void> = Promise.resolve();

    constructor(private readonly persistence: WorkCenterSessionPersistence) {}

    async hydrate(): Promise<WorkCenterSessionSnapshot> {
        const restored = await this.persistence.load();
        // WHY: OPFS load can resolve after Send already committed a live turn.
        // Replacing that transcript paints Thinking… after GPT already finished.
        if (this.state.messages.length > 0) {
            return this.snapshot();
        }
        this.state = isSnapshot(restored) ? cloneSnapshot(restored) : emptySnapshot();
        return this.snapshot();
    }

    snapshot(): WorkCenterSessionSnapshot {
        return cloneSnapshot(this.state);
    }

    epoch(): number {
        return this.state.epoch;
    }

    latestPendingAssistant(): WorkCenterMessage | null {
        for (let index = this.state.messages.length - 1; index >= 0; index -= 1) {
            const message = this.state.messages[index];
            if (message?.role === "assistant" && message.status === "pending") return cloneMessage(message);
        }
        return null;
    }

    latestCompleteAssistant(): WorkCenterMessage | null {
        for (let index = this.state.messages.length - 1; index >= 0; index -= 1) {
            const message = this.state.messages[index];
            if (message?.role === "assistant" && message.status === "complete") return cloneMessage(message);
        }
        return null;
    }

    setDraft(draft: WorkCenterDraft): void {
        this.state.draft = {
            content: String(draft.content || ""),
            attachments: (draft.attachments || []).map(cloneRef)
        };
    }

    async persistDraft(): Promise<void> {
        await this.persist();
    }

    /**
     * Move the live draft into a user/assistant pair without waiting on OPFS.
     * WHY: A hung attachment `put` must not block the transcript from accepting Send/Enter.
     */
    commitDraft(request: WorkCenterRequestOptions): {
        user: WorkCenterMessage;
        assistant: WorkCenterMessage;
    } {
        const now = Date.now();
        const user: WorkCenterMessage = {
            id: createId("user"),
            role: "user",
            createdAt: now,
            content: this.state.draft.content,
            attachments: this.state.draft.attachments.map(cloneRef),
            status: "complete",
            request: { ...request }
        };
        const assistant: WorkCenterMessage = {
            id: createId("assistant"),
            role: "assistant",
            createdAt: now,
            content: "",
            attachments: [],
            status: "pending",
            request: { ...request },
            parentId: user.id
        };

        this.state.messages.push(user, assistant);
        this.state.draft = { content: "", attachments: [] };
        return { user: cloneMessage(user), assistant: cloneMessage(assistant) };
    }

    async submitDraft(request: WorkCenterRequestOptions): Promise<{
        user: WorkCenterMessage;
        assistant: WorkCenterMessage;
    }> {
        const submitted = this.commitDraft(request);
        await this.persist();
        return submitted;
    }

    /** In-memory completion so the transcript can paint before OPFS save. */
    applyAssistantCompletion(id: string, completion: AssistantCompletion): WorkCenterMessage | null {
        let message = this.state.messages.find((entry) => entry.id === id && entry.role === "assistant");
        if (!message) {
            for (let index = this.state.messages.length - 1; index >= 0; index -= 1) {
                const entry = this.state.messages[index];
                if (entry?.role === "assistant" && entry.status === "pending") {
                    message = entry;
                    break;
                }
            }
        }
        if (!message) return null;

        message.status = completion.status;
        if (completion.content !== undefined) message.content = completion.content;
        if (completion.rawResult !== undefined) message.rawResult = slimRawResult(completion.rawResult);
        if (completion.error !== undefined) message.error = completion.error;
        return cloneMessage(message);
    }

    async completeAssistant(id: string, completion: AssistantCompletion): Promise<WorkCenterMessage | null> {
        const message = this.applyAssistantCompletion(id, completion);
        if (!message) return null;
        await this.persist();
        return message;
    }

    async markAttachmentError(
        messageId: string,
        attachmentHash: string,
        error: string
    ): Promise<boolean> {
        const message = this.state.messages.find((entry) => entry.id === messageId);
        const attachment = message?.attachments.find((entry) => entry.hash === attachmentHash);
        if (!attachment) return false;
        attachment.error = error;
        await this.persist();
        return true;
    }

    async retry(assistantId: string): Promise<{
        user: WorkCenterMessage;
        assistant: WorkCenterMessage;
    }> {
        const original = this.state.messages.find(
            (entry) => entry.id === assistantId && entry.role === "assistant"
        );
        const user = original?.parentId
            ? this.state.messages.find((entry) => entry.id === original.parentId)
            : undefined;
        if (!original || !user) throw new Error("The original Work Center turn is unavailable");

        const assistant: WorkCenterMessage = {
            id: createId("assistant"),
            role: "assistant",
            createdAt: Date.now(),
            content: "",
            attachments: [],
            status: "pending",
            request: original.request ? { ...original.request } : undefined,
            parentId: user.id
        };
        this.state.messages.push(assistant);
        await this.persist();
        return { user: cloneMessage(user), assistant: cloneMessage(assistant) };
    }

    async cancel(assistantId: string): Promise<WorkCenterMessage | null> {
        return this.completeAssistant(assistantId, {
            status: "cancelled",
            content: "",
            error: "Cancelled"
        });
    }

    /** Visible note for share-target / AI results (legacy pipeline is not in the chat shell). */
    async appendAssistantNote(content: string): Promise<WorkCenterMessage> {
        const message: WorkCenterMessage = {
            id: createId("assistant"),
            role: "assistant",
            createdAt: Date.now(),
            content: String(content || "").trim(),
            attachments: [],
            status: "complete"
        };
        this.state.messages.push(message);
        await this.persist();
        return cloneMessage(message);
    }

    async newChat(): Promise<void> {
        this.state = {
            ...emptySnapshot(),
            epoch: this.state.epoch + 1
        };
        await this.persistence.clear();
    }

    private persist(): Promise<void> {
        const generation = ++this.persistGeneration;
        const snapshot = this.snapshot();
        this.persistTail = this.persistTail
            .catch(() => undefined)
            .then(async () => {
                if (generation !== this.persistGeneration) return;
                await this.persistence.save(snapshot);
            });
        return this.persistTail;
    }
}
