import { r as e } from "./rolldown-runtime-CEFd7nDs.js";
//#region src/ts/WorkCenterState.ts
var t = /* @__PURE__ */ e({ WorkCenterStateManager: () => n }), n = class {
	static STORAGE_KEY = "rs-workcenter-state";
	static TEMPLATES_STORAGE_KEY = "rs-workcenter-templates";
	static createDefaultState() {
		let e = this.loadWorkCenterState(), t = String(e.currentPrompt || "");
		return {
			files: [],
			selectedFiles: [],
			currentPrompt: t,
			draft: {
				content: t,
				attachments: []
			},
			messages: [],
			sessionEpoch: 0,
			sessionHydrated: !1,
			autoAction: !1,
			selectedInstruction: "",
			outputFormat: "auto",
			activeInputTab: "prompt",
			activeResultsTab: "output",
			selectedLanguage: "auto",
			selectedTemplate: "",
			recognitionFormat: "auto",
			processingFormat: "markdown",
			voiceRecording: !1,
			promptTemplates: this.loadPromptTemplates(),
			lastRawResult: null,
			recognizedData: null,
			processedData: null,
			currentProcessingStep: 0,
			...e
		};
	}
	static saveState(e) {
		try {
			let t = {
				autoAction: e.autoAction,
				selectedInstruction: e.selectedInstruction,
				outputFormat: e.outputFormat,
				activeInputTab: e.activeInputTab,
				activeResultsTab: e.activeResultsTab,
				selectedLanguage: e.selectedLanguage,
				selectedTemplate: e.selectedTemplate,
				recognitionFormat: e.recognitionFormat,
				processingFormat: e.processingFormat,
				currentProcessingStep: e.currentProcessingStep,
				recognizedData: e.recognizedData ? {
					timestamp: e.recognizedData.timestamp,
					source: e.recognizedData.source,
					contentLength: e.recognizedData.content.length,
					metadata: e.recognizedData.metadata
				} : null,
				processedData: e.processedData ? e.processedData.map((e) => ({
					timestamp: e.timestamp,
					action: e.action,
					contentLength: e.content.length,
					metadata: e.metadata
				})) : null
			};
			localStorage.setItem(this.STORAGE_KEY, JSON.stringify(t));
		} catch (e) {
			console.warn("Failed to save workcenter state:", e);
		}
	}
	static loadWorkCenterState() {
		try {
			let e = localStorage.getItem(this.STORAGE_KEY);
			if (e) {
				let t = JSON.parse(e);
				return {
					currentPrompt: t.currentPrompt || "",
					autoAction: t.autoAction || !1,
					selectedInstruction: t.selectedInstruction || "",
					outputFormat: t.outputFormat || "auto",
					activeInputTab: (() => {
						let e = String(t.activeInputTab || "prompt");
						return e === "attachments" || e === "prompt" ? e : "prompt";
					})(),
					activeResultsTab: (() => {
						let e = String(t.activeResultsTab || "output");
						return e === "pipeline" || e === "history" || e === "output" ? e : "output";
					})(),
					selectedLanguage: t.selectedLanguage || "auto",
					selectedTemplate: t.selectedTemplate || "",
					recognitionFormat: t.recognitionFormat || "auto",
					processingFormat: t.processingFormat || "markdown",
					currentProcessingStep: t.currentProcessingStep || 0
				};
			}
		} catch (e) {
			console.warn("Failed to load workcenter state:", e);
		}
		return {};
	}
	static loadPromptTemplates() {
		return ((e, t) => {
			if (!e) return t;
			try {
				return JSON.parse(e) ?? t;
			} catch {
				return t;
			}
		})(localStorage.getItem(this.TEMPLATES_STORAGE_KEY), [
			{
				name: "Analyze & Extract",
				prompt: "Analyze the provided content and extract key information, formulas, data, and insights. Identify the main topics, recognize any mathematical expressions or equations, and provide a structured summary."
			},
			{
				name: "Solve Equations",
				prompt: "Find and solve any mathematical equations, problems, or calculations in the content. Show your work step-by-step and provide the final answers."
			},
			{
				name: "Generate Code",
				prompt: "Based on the description or requirements in the content, generate appropriate code. Include comments and explain the implementation."
			},
			{
				name: "Extract Styles",
				prompt: "Analyze the visual content or design description and extract/generate CSS styles, color schemes, and layout information."
			},
			{
				name: "Document Analysis",
				prompt: "Perform a comprehensive analysis of the document, including structure, key points, relationships, and actionable insights."
			},
			{
				name: "Data Processing",
				prompt: "Process and transform the provided data. Extract structured information, identify patterns, and present results in a clear format."
			}
		]);
	}
	static savePromptTemplates(e) {
		try {
			localStorage.setItem(this.TEMPLATES_STORAGE_KEY, JSON.stringify(e));
		} catch (e) {
			console.warn("Failed to save prompt templates:", e);
		}
	}
	static clearRecognizedData(e) {
		e.recognizedData = null, e.processedData = null, e.currentProcessingStep = 0;
	}
	static addProcessedStep(e, t) {
		e.processedData ||= [], e.processedData.push(t), e.currentProcessingStep++;
	}
};
//#endregion
export { t as n, n as t };
