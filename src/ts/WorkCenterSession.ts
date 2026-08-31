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

    constructor(private readonly persistence: WorkCenterSessionPersistence) {}

    async hydrate(): Promise<WorkCenterSessionSnapshot> {
        const restored = await this.persistence.load();
        this.state = isSnapshot(restored) ? cloneSnapshot(restored) : emptySnapshot();
        return this.snapshot();
    }

    snapshot(): WorkCenterSessionSnapshot {
        return cloneSnapshot(this.state);
    }

    epoch(): number {
        return this.state.epoch;
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

    async submitDraft(request: WorkCenterRequestOptions): Promise<{
        user: WorkCenterMessage;
        assistant: WorkCenterMessage;
    }> {
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
        await this.persist();
        return { user: cloneMessage(user), assistant: cloneMessage(assistant) };
    }

    async completeAssistant(id: string, completion: AssistantCompletion): Promise<WorkCenterMessage | null> {
        const message = this.state.messages.find((entry) => entry.id === id && entry.role === "assistant");
        if (!message) return null;

        message.status = completion.status;
        if (completion.content !== undefined) message.content = completion.content;
        if (completion.rawResult !== undefined) message.rawResult = completion.rawResult;
        if (completion.error !== undefined) message.error = completion.error;
        await this.persist();
        return cloneMessage(message);
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

    async newChat(): Promise<void> {
        this.state = {
            ...emptySnapshot(),
            epoch: this.state.epoch + 1
        };
        await this.persistence.clear();
    }

    private async persist(): Promise<void> {
        await this.persistence.save(this.snapshot());
    }
}
