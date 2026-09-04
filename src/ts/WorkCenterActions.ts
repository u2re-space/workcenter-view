import type { WorkCenterState, WorkCenterDependencies } from "./WorkCenterState";
import type { WorkCenterUI } from "./WorkCenterUI";
import type { WorkCenterFileOps } from "./WorkCenterFileOps";
import type { WorkCenterResults } from "./WorkCenterResults";
import type { WorkCenterDataProcessing } from "./WorkCenterDataProcessing";
import type { WorkCenterHistory } from "./WorkCenterHistory";
import type { WorkCenterTemplates } from "./WorkCenterTemplates";
import { extractJSONFromAIResponse } from "core/document/AIResponseParser";
import { shouldHandoffViewToSibling, stashSkuHandoff } from "com/config/ecosystem-skus";
import { runWorkCenterTurn } from "com/service/service/RecognizeData";
import { readProcessApiResultText } from "com/routing/api/process-api";
import {
    type WorkCenterMessage,
    type WorkCenterRequestOptions,
    type WorkCenterSession
} from "./WorkCenterSession";
import type { WorkCenterAttachmentIngress } from "./WorkCenterAttachmentIngress";
import type { WorkCenterDocumentPreparer } from "./WorkCenterDocumentPreparation";
import { highlightCodeTree } from "../../../../projects/fl.ui/src/ui/markdown/highlight";

export type WorkCenterConversationServices = {
    session: WorkCenterSession;
    attachments: WorkCenterAttachmentIngress;
    documentPreparer: WorkCenterDocumentPreparer;
    syncFromSession: () => void;
};

export class WorkCenterActions {
    private deps: WorkCenterDependencies;
    private ui: WorkCenterUI;
    private fileOps: WorkCenterFileOps;
    private dataProcessing: WorkCenterDataProcessing;
    private results: WorkCenterResults;
    private history: WorkCenterHistory;
    private templates: WorkCenterTemplates;
    private conversation?: WorkCenterConversationServices;
    private activeTurns = new Map<string, AbortController>();

    constructor(
        dependencies: WorkCenterDependencies,
        ui: WorkCenterUI,
        fileOps: WorkCenterFileOps,
        dataProcessing: WorkCenterDataProcessing,
        results: WorkCenterResults,
        history: WorkCenterHistory,
        templates?: WorkCenterTemplates,
        conversation?: WorkCenterConversationServices
    ) {
        this.deps = dependencies;
        this.ui = ui;
        this.fileOps = fileOps;
        this.dataProcessing = dataProcessing;
        this.results = results;
        this.history = history;
        this.templates = templates!;
        this.conversation = conversation;
    }

    async executeUnifiedAction(state: WorkCenterState): Promise<void> {
        if (this.conversation) {
            await this.executeConversationTurn(state);
            return;
        }
        if (this.fileOps.getFilesForProcessing(state).length === 0 && !state.currentPrompt.trim() && !state.recognizedData) {
            this.deps.showMessage('Please select files or enter a prompt first');
            return;
        }

        let processingMessage = 'Processing...';

        // Show what's being processed
        if (state.recognizedData) {
            processingMessage = `Processing ${state.recognizedData.source} content...`;
        } else if (this.fileOps.hasFiles(state)) {
            processingMessage = `Processing ${state.files.length} file${state.files.length > 1 ? 's' : ''}...`;
        }

        this.results.showProcessingMessage(processingMessage);

        try {
            // Prepare input for execution core
            let basePrompt = state.currentPrompt.trim() ||
                (state.autoAction ? this.getLastSuccessfulPrompt() : "Analyze and process the provided content intelligently");

            // Apply selected or active custom instruction from settings (if any)
            if (this.templates) {
                let instruction = this.templates.resolveInstruction(state.selectedInstruction);
                if (!instruction && !state.selectedInstruction) {
                    instruction = await this.templates.getActiveInstruction();
                }
                if (instruction?.instruction) {
                    if (!state.selectedInstruction) {
                        state.selectedInstruction = instruction.id;
                    }
                    basePrompt = this.templates.buildPromptWithInstruction(basePrompt, instruction);
                }
            }

            const actionInput: ActionInput = {
                type: state.recognizedData ? 'text' : (this.fileOps.hasFiles(state) ? 'files' : 'text'),
                files: this.fileOps.hasFiles(state) ? [...state.files] : undefined,
                text: basePrompt,
                recognizedData: state.recognizedData || undefined,
                // Keep legacy field for backward compatibility
                recognizedContent: state.recognizedData?.content || undefined
            };

            // Handle special templates that need dynamic language processing
            const isTranslateTemplate = state.selectedTemplate &&
                state.selectedTemplate.includes("Translate the following content to the selected language");

            if (isTranslateTemplate && state.selectedLanguage !== 'auto') {
                // For "Translate to Language" template, replace the generic instruction with specific language
                const targetLanguage = state.selectedLanguage === 'ru' ? 'Russian' : 'English';
                actionInput.text = `Translate the following content to ${targetLanguage}. Maintain the original formatting and structure where possible. If the content is already in ${targetLanguage}, provide a natural rephrasing or improvement instead.`;
            } else {
                // Add language instruction if specific language selected (for other operations)
                if (state.selectedLanguage !== 'auto') {
                    const languageInstruction = state.selectedLanguage === 'ru'
                        ? "Please respond in Russian language."
                        : "Please respond in English language.";
                    actionInput.text = `${languageInstruction} ${actionInput.text}`;
                }
            }

            // Execute through execution core
            const context: ActionContext = {
                source: 'workcenter',
                sessionId: this.generateSessionId()
            };

            // Determine action based on content type and state
            let forceAction: string | undefined;

            // If user has provided a specific prompt/template instruction, use it directly
            // Don't force a generic action that would override the user's instruction
            const hasUserInstruction = state.currentPrompt.trim() && state.currentPrompt.trim() !== "Analyze and process the provided content intelligently";

            if (hasUserInstruction) {
                // User has provided their own instruction - let the system determine the best action type
                // based on available data, but use the user's instruction
                forceAction = undefined; // Let the system auto-determine based on input type
            } else if (state.recognizedData) {
                // We have recognized data but no specific user instruction - do additional processing
                forceAction = 'analyze';
            } else if (this.fileOps.hasFiles(state)) {
                // We have files but no recognized data - do initial recognition
                const hasTextFiles = this.fileOps.hasTextFiles(state);

                if (hasTextFiles) {
                    // Text files can be processed as source data
                    forceAction = 'source';
                } else {
                    // Binary files need recognition
                    forceAction = 'recognize';
                }
            } else {
                // No files, no recognized data, no user instruction - general analysis
                forceAction = 'analyze';
            }

            const result = await executionCore.execute(actionInput, context, {
                forceAction,
                recognitionFormat: state.recognitionFormat,
                processingFormat: state.processingFormat
            });

            // Save state
            const { WorkCenterStateManager } = await import('./WorkCenterState');
            WorkCenterStateManager.saveState(state);

            // Store raw result for copying
            state.lastRawResult = result.rawData;

            // Format and display result
            const formattedResult = this.dataProcessing.formatResult(result.rawData || result, state.outputFormat);
            const outputContent = this.ui.getContainer()?.querySelector('[data-output]') as HTMLElement | null;
            if (outputContent) {
                outputContent.innerHTML = `<div class="result-content">${formattedResult}</div>`;
                highlightCodeTree(outputContent);
            }

            // Update recognized data if files were processed (initial recognition or source data)
            if (this.fileOps.hasFiles(state) && result.rawData?.ok && !state.recognizedData) {
                const isTextFile = this.fileOps.hasTextFiles(state);

                state.recognizedData = {
                    content: result.content,
                    timestamp: Date.now(),
                    source: isTextFile ? 'text' : 'files',
                    recognizedAs: this.fileOps.determineRecognizedFormat(state),
                    metadata: {
                        fileCount: state.files.length
                    },
                    responseId: result.responseId || "unknown"
                };
                this.results.updateDataPipeline(state);
                this.ui.updateDataCounters(state);

                // Auto-process with selected template if available
                if (state.selectedTemplate && state.selectedTemplate.trim()) {
                    console.log('[WorkCenter] Auto-processing with template:', state.selectedTemplate);
                    // Small delay to allow UI to update
                    setTimeout(async () => {
                        await this.executeUnifiedAction(state);
                    }, 100);
                }
            }
            // Add to processing chain if we have recognized data (additional processing)
            else if (state.recognizedData && result.rawData?.ok) {
                const processedEntry = {
                    content: result.content,
                    timestamp: Date.now(),
                    action: state.currentPrompt.trim() || 'additional processing',
                    sourceData: state.recognizedData,
                    metadata: { step: state.currentProcessingStep + 1 }
                };

                const { WorkCenterStateManager: StateManager } = await import('./WorkCenterState');
                StateManager.addProcessedStep(state, processedEntry);
            }

        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            this.results.showError(errorMsg);
        }

        this.history.updateRecentHistory(state);
        this.ui.updateDataPipeline(state);
        this.ui.updateDataCounters(state);
    }

    async persistDraft(state: WorkCenterState): Promise<void> {
        const conversation = this.conversation;
        if (!conversation) return;
        state.currentPrompt = state.draft.content;
        conversation.session.setDraft(state.draft);
        await conversation.session.persistDraft();
    }

    private requestOptions(state: WorkCenterState): WorkCenterRequestOptions {
        return {
            outputFormat: state.outputFormat,
            language: state.selectedLanguage,
            recognitionFormat: state.recognitionFormat,
            processingFormat: state.processingFormat
        };
    }

    private async conversationInstruction(state: WorkCenterState): Promise<string> {
        const base = state.selectedTemplate.trim() ||
            "Answer the newest user message using its attached content as context.";
        let instruction = this.templates.resolveInstruction(state.selectedInstruction);
        if (!instruction && !state.selectedInstruction) {
            instruction = await this.templates.getActiveInstruction();
        }
        return this.templates.buildPromptWithInstruction(base, instruction);
    }

    private syncConversationState(state: WorkCenterState): void {
        const conversation = this.conversation;
        if (!conversation) return;
        const snapshot = conversation.session.snapshot();
        state.messages = snapshot.messages;
        state.draft = snapshot.draft;
        state.currentPrompt = snapshot.draft.content;
        state.sessionEpoch = snapshot.epoch;
        conversation.syncFromSession();
    }

    private async executeConversationTurn(state: WorkCenterState): Promise<void> {
        const conversation = this.conversation;
        if (!conversation) return;
        try {
            if (this.activeTurns.size > 0) {
                this.deps.showMessage("Wait for the current response before sending another message");
                return;
            }
            if (!state.draft.content.trim() && state.draft.attachments.length === 0) {
                this.deps.showMessage("Enter a prompt or attach a file first");
                return;
            }

            conversation.session.setDraft(state.draft);
            const submitted = conversation.session.commitDraft(this.requestOptions(state));
            state.files = [];
            this.syncConversationState(state);
            void conversation.session.persistDraft().catch(() => {
                this.deps.showMessage("Unable to save this chat locally");
            });

            const controller = new AbortController();
            this.activeTurns.set(submitted.assistant.id, controller);
            await this.runConversationTurn(state, submitted.user, submitted.assistant, controller);
        } catch (error) {
            this.deps.showMessage(
                error instanceof Error ? error.message : "Unable to send the message"
            );
        }
    }

    async retryConversationTurn(state: WorkCenterState, assistantId: string): Promise<void> {
        const conversation = this.conversation;
        if (!conversation || this.activeTurns.size > 0) return;

        try {
            const retry = await conversation.session.retry(assistantId);
            this.syncConversationState(state);
            const controller = new AbortController();
            this.activeTurns.set(retry.assistant.id, controller);
            await this.runConversationTurn(state, retry.user, retry.assistant, controller);
        } catch (error) {
            this.deps.showMessage(
                error instanceof Error ? error.message : "Unable to retry this message"
            );
        }
    }

    async cancelConversationTurn(state: WorkCenterState, assistantId: string): Promise<void> {
        const conversation = this.conversation;
        if (!conversation) return;
        this.activeTurns.get(assistantId)?.abort();
        this.activeTurns.delete(assistantId);
        await conversation.session.cancel(assistantId);
        this.syncConversationState(state);
    }

    async startNewConversation(state: WorkCenterState): Promise<void> {
        const conversation = this.conversation;
        if (!conversation) return;
        for (const controller of this.activeTurns.values()) controller.abort();
        this.activeTurns.clear();
        conversation.attachments.revokeAllPreviews();
        await conversation.session.newChat();
        state.files = [];
        this.syncConversationState(state);
    }

    private async runConversationTurn(
        state: WorkCenterState,
        user: WorkCenterMessage,
        assistant: WorkCenterMessage,
        controller: AbortController
    ): Promise<void> {
        const conversation = this.conversation;
        if (!conversation) return;
        const epoch = conversation.session.epoch();

        try {
            const prepared = [];
            for (const ref of user.attachments) {
                const file = await conversation.attachments.resolve(ref);
                if (!file) {
                    await conversation.session.markAttachmentError(
                        user.id,
                        ref.hash,
                        "Attachment data is unavailable"
                    );
                    prepared.push({
                        attachmentId: ref.hash,
                        original: new File([], ref.name, { type: ref.type }),
                        kind: "unknown" as const,
                        images: [],
                        error: "Attachment data is unavailable"
                    });
                    continue;
                }
                const preparedAttachment = await conversation.documentPreparer.prepare(file);
                if (preparedAttachment.error) {
                    await conversation.session.markAttachmentError(
                        user.id,
                        ref.hash,
                        preparedAttachment.error
                    );
                }
                prepared.push({
                    attachmentId: ref.hash,
                    ...preparedAttachment
                });
            }

            const messages = conversation.session.snapshot().messages
                .filter((message) => message.status === "complete")
                .map((message) => ({ role: message.role, content: message.content }));
            const result = await runWorkCenterTurn({
                messages,
                attachments: prepared,
                instruction: await this.conversationInstruction(state),
                options: {
                    outputFormat: state.processingFormat,
                    outputLanguage: state.selectedLanguage,
                    processingEffort: "medium",
                    processingVerbosity: "medium"
                },
                signal: controller.signal
            });

            if (epoch !== conversation.session.epoch()) return;
            if (controller.signal.aborted || result.error === "Cancelled") {
                conversation.session.applyAssistantCompletion(assistant.id, {
                    status: "cancelled",
                    content: "",
                    error: "Cancelled"
                });
            } else if (result.ok) {
                const content = this.extractTurnText(result);
                conversation.session.applyAssistantCompletion(assistant.id, {
                    status: "complete",
                    content,
                    rawResult: result
                });
                state.lastRawResult = result;
                state.recognizedData = {
                    content,
                    timestamp: Date.now(),
                    source: user.attachments.length ? "files" : "text",
                    recognizedAs: "markdown",
                    responseId: result.responseId || undefined
                };
            } else {
                conversation.session.applyAssistantCompletion(assistant.id, {
                    status: "failed",
                    content: "",
                    error: result.error || "The request did not return a response"
                });
            }
            this.syncConversationState(state);
            void conversation.session.persistDraft().catch(() => undefined);
        } catch (error) {
            if (epoch === conversation.session.epoch()) {
                conversation.session.applyAssistantCompletion(assistant.id, {
                    status: controller.signal.aborted ? "cancelled" : "failed",
                    content: "",
                    error: controller.signal.aborted
                        ? "Cancelled"
                        : (error instanceof Error ? error.message : "Failed to process message")
                });
                this.syncConversationState(state);
                void conversation.session.persistDraft().catch(() => undefined);
            }
        } finally {
            if (this.activeTurns.get(assistant.id) === controller) {
                this.activeTurns.delete(assistant.id);
            }
            this.syncConversationState(state);
            this.history.updateRecentHistory(state);
            this.ui.updateDataPipeline(state);
        }
    }

    private extractTurnText(result: unknown): string {
        if (result == null) return "";
        if (typeof result === "string") return readProcessApiResultText(result);
        const row = result as { data?: unknown; raw?: unknown };
        if (typeof row.data === "string" && row.data.trim()) return row.data.trim();
        return (
            readProcessApiResultText(result) ||
            readProcessApiResultText(row.raw) ||
            ""
        );
    }

    private getLastSuccessfulPrompt(): string {
        return this.history.getLastSuccessfulPrompt();
    }

    private generateSessionId(): string {
        return `wc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    async copyResults(state: WorkCenterState): Promise<void> {
        if (!state.lastRawResult) return;

        try {
            await this.dataProcessing.copyResultsToClipboard(state.lastRawResult, state.outputFormat);
            this.deps.showMessage('Results copied to clipboard');
        } catch (error) {
            console.error('Failed to copy results:', error);
            this.deps.showMessage('Failed to copy results');
        }
    }

    async copyConversationTurn(state: WorkCenterState, turnId: string): Promise<void> {
        const message = state.messages.find(
            (candidate) => candidate.id === turnId && candidate.role === "assistant"
        );
        if (!message) return;
        try {
            await this.dataProcessing.copyResultsToClipboard(
                message.rawResult ?? { content: message.content },
                state.outputFormat
            );
            this.deps.showMessage("Response copied to clipboard");
        } catch {
            this.deps.showMessage("Failed to copy response");
        }
    }

    async viewResultsInViewer(state: WorkCenterState): Promise<void> {
        if (!state.lastRawResult) {
            this.deps.showMessage('No results to view');
            return;
        }

        try {
            const { unifiedMessaging } = await import('com/core/UnifiedMessaging');

            let resultContent = typeof state.lastRawResult === 'string'
                ? state.lastRawResult
                : JSON.stringify(state.lastRawResult, null, 2);

            try {
                resultContent = JSON.parse(resultContent)?.data || resultContent;
            } catch (error) {
            }

            const filename = `workcenter-output-${Date.now()}.${state.outputFormat === 'markdown' ? 'md' : (state.outputFormat === 'json' ? 'json' : (state.outputFormat === 'html' ? 'html' : (state.outputFormat === 'code' ? 'ts' : 'txt')))}`;
            if (shouldHandoffViewToSibling("viewer")) {
                stashSkuHandoff({ dest: "viewer", content: String(resultContent || ""), filename });
                await this.navigateToViewer();
                return;
            }

            await unifiedMessaging.sendMessage({
                id: crypto.randomUUID(),
                type: 'content-view',
                source: 'workcenter',
                destination: 'viewer',
                contentType: state.outputFormat === 'markdown' ? 'markdown' : 'text',
                data: {
                    text: resultContent,
                    filename
                },
                metadata: {
                    title: 'Work Center Output',
                    timestamp: Date.now(),
                    source: 'workcenter',
                    format: state.outputFormat
                }
            } as any);

            await this.navigateToViewer();
        } catch (error) {
            console.error('Failed to open output in viewer:', error);
            this.deps.showMessage('Failed to open output in viewer');
        }
    }

    private async navigateToViewer(): Promise<void> {
        if (this.deps.navigate) {
            await this.deps.navigate('viewer');
            return;
        }

        // Backward compatibility for legacy state-based navigation.
        if (this.deps?.state) {
            this.deps.state.view = 'markdown-viewer';
            this.deps.render?.();
        }
    }

    clearResults(state: WorkCenterState): void {
        state.lastRawResult = null;
        this.results.clearResults();
    }

    async saveResultsToExplorer(state: WorkCenterState): Promise<void> {
        if (!state.lastRawResult) {
            this.deps.showMessage('No results to save');
            return;
        }

        try {
            // Import the unified messaging system
            const { unifiedMessaging } = await import('com/core/UnifiedMessaging');

            // Create the content to save
            const resultContent = typeof state.lastRawResult === 'string'
                ? state.lastRawResult
                : JSON.stringify(state.lastRawResult, null, 2);

            // Send to explorer for saving
            await unifiedMessaging.sendMessage({
                id: crypto.randomUUID(),
                type: 'content-save',
                source: 'workcenter',
                destination: 'explorer',
                data: {
                    action: 'save',
                    text: resultContent,
                    filename: `workcenter-result-${Date.now()}.${state.outputFormat === 'json' ? 'json' : (state.outputFormat === 'html' ? 'html' : (state.outputFormat === 'code' ? 'ts' : 'txt'))}`,
                    path: '/workcenter-results/'
                },
                metadata: {
                    title: 'Work Center Result',
                    timestamp: Date.now(),
                    source: 'workcenter',
                    format: state.outputFormat
                }
            });

            this.deps.showMessage('Results saved to Explorer');
        } catch (error) {
            console.error('Failed to save results to explorer:', error);
            this.deps.showMessage('Failed to save results to Explorer');
        }
    }
}