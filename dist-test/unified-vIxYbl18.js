import { r as e } from "./rolldown-runtime-CEFd7nDs.js";
import { i as t, n } from "./Settings-Cu3erOWB.js";
import "./core-CTYSu78L.js";
import { a as r, i, n as a, r as o } from "./entities-OKmyH9zb.js";
//#region ../../../apps/CWSP-process/src/service/instructions/utils.ts
var s = (e, t) => t?.trim() ? `${e}

---

USER CUSTOM INSTRUCTIONS:
${t.trim()}

---

Apply the user's custom instructions above when processing the data. Prioritize user instructions when they conflict with default behavior.
` : e, c = "\n---\n\nGRAPHICS GENERATION (when applicable):\nWhen the problem involves functions, graphs, geometric shapes, diagrams, or data that can be visualized:\n\nGenerate inline SVG as Markdown image with data URI:\n![<title>](data:image/svg+xml,<encodeURIComponent_encoded_svg>)\n\nSVG Requirements:\n- Use encodeURIComponent() encoding for the entire SVG string\n- viewBox=\"0 0 400 300\" (or appropriate dimensions)\n- Colors: #3b82f6 (blue), #10b981 (green), #f59e0b (orange), #ef4444 (red)\n- Include axis labels, tick marks, and legends\n- Use <text> elements for annotations\n- Keep SVG minimal but informative\n\nApply to:\n• Function graphs: f(x), parametric, polar\n• Geometric constructions and proofs\n• Data visualizations and charts\n• Diagrams and flowcharts\n• Coordinate systems and number lines\n\nAlways include both the mathematical solution AND the visualization.\n", l = {
	auto: "",
	follow: "\n\nIMPORTANT: Follow the language of the source/context data. Preserve the original language unless explicitly asked to translate or change language.",
	en: "\n\nIMPORTANT: Respond in English. All explanations, answers, and comments must be in English.",
	ru: "\n\nВАЖНО: Отвечай на русском языке. Все объяснения, ответы и комментарии должны быть на русском языке."
}, u = "\n\nAdditionally, translate the recognized content to the response language if it differs from the source.";
function d(e) {
	return e === "auto" || e === void 0 ? "" : {
		auto: "",
		markdown: "\n\nOutput the result in GitHub-compatible Markdown.\n\nMarkdown structure:\n- Use headings for structure:\n  - Main sections: start from ### (H3) minimum\n  - Subsections: #### / ##### when needed\n- Avoid long paragraphs: prefer lists and sub-lists.\n\nKaTeX / math:\n- Prefer inline formulas: $...$\n- Avoid $$...$$ blocks; only use block math if strictly necessary.\n  - Prefer block math as \\[ ... \\] instead of $$...$$.\n- Inside KaTeX, write a vertical bar as \\| (example: $A \\| B$).\n\nTables:\n- Use strict GitHub Markdown table syntax.\n- Inside table cells:\n  - Use <br> for line breaks (no real newlines inside cells).\n  - If source data uses ';' as a separator, replace ';' with <br>.\n\nColon formatting:\n- For \"key: value\" style lines, make the part before ':' bold:\n  - **Key**: value",
		html: "\n\nOutput the result in HTML format.",
		json: "\n\nOutput the result as valid JSON.",
		text: "\n\nOutput the result as plain text.",
		typescript: "\n\nOutput the result as TypeScript code.",
		javascript: "\n\nOutput the result as JavaScript code.",
		python: "\n\nOutput the result as Python code.",
		java: "\n\nOutput the result as Java code.",
		cpp: "\n\nOutput the result as C++ code.",
		csharp: "\n\nOutput the result as C# code.",
		php: "\n\nOutput the result as PHP code.",
		ruby: "\n\nOutput the result as Ruby code.",
		go: "\n\nOutput the result as Go code.",
		rust: "\n\nOutput the result as Rust code.",
		xml: "\n\nOutput the result as XML.",
		yaml: "\n\nOutput the result as YAML.",
		css: "\n\nOutput the result as CSS.",
		scss: "\n\nOutput the result as SCSS.",
		"most-suitable": "\n\nChoose the most suitable output format for the content and task.",
		"most-optimized": "\n\nChoose the most optimized output format for clarity and usability.",
		"most-legibility": "\n\nChoose the most legible output format for human readability."
	}[e] || "";
}
function f(e) {
	return e === "markdown" ? "Extract all readable text, equations, and data from this image. Focus on accuracy and completeness. Format the extracted content as clean Markdown." : e === "html" ? "Extract all readable text, equations, and data from this image. Focus on accuracy and completeness. Format the extracted content as semantic HTML." : e === "text" ? "Extract all readable text, equations, and data from this image. Focus on accuracy and completeness. Extract as plain text only." : e === "most-suitable" ? "Analyze this image and extract all readable content in the most appropriate format for further processing." : e === "most-optimized" ? "Extract content from this image in the most efficient format for token usage and processing." : e === "most-legibility" ? "Extract content from this image with maximum legibility and human readability." : "Extract all readable text, equations, and data from this image. Focus on accuracy and completeness. Format appropriately for the content type.";
}
//#endregion
//#region ../../../apps/CWSP-process/src/service/processing/adapters.ts
var p = () => {
	try {
		return typeof chrome < "u" && chrome?.runtime?.id ? "crx" : typeof self < "u" && "ServiceWorkerGlobalScope" in self || typeof navigator < "u" && "standalone" in navigator ? "pwa" : "core";
	} catch {
		return "unknown";
	}
}, m, h = null;
async function g() {
	if (h) return h;
	let { loadSettings: e } = await import("./Settings-Cu3erOWB.js").then((e) => e.t);
	return h = e, h;
}
var _ = async () => {
	try {
		return await (m ?? await g())() || t;
	} catch {
		return t;
	}
}, v = async () => {
	let e = p();
	try {
		return e === "crx" ? await n() : await _();
	} catch (t) {
		return console.error(`[AI-Service] Failed to load settings for platform ${e}:`, t), null;
	}
}, y = async () => {
	try {
		let { getActiveInstructionText: e } = await import("./CustomInstructions-YkmLdoZA.js").then((e) => e.t);
		return await e();
	} catch {
		return "";
	}
}, b = async () => {
	try {
		let e = await v(), t = e?.ai?.responseLanguage || "auto", n = e?.ai?.translateResults || !1, r = l[t] || "";
		return n && t !== "auto" && t !== "follow" && (r += u), r;
	} catch {
		return "";
	}
}, x = async () => {
	try {
		return (await v())?.ai?.generateSvgGraphics ? c : "";
	} catch {
		return "";
	}
}, S = class {
	cache = /* @__PURE__ */ new Map();
	maxEntries = 100;
	ttl = 864e5;
	generateDataHash(e) {
		return e instanceof File ? `${e.name}-${e.size}-${e.lastModified}` : typeof e == "string" ? btoa(e).substring(0, 32) : JSON.stringify(e).substring(0, 32);
	}
	get(e, t) {
		let n = this.generateDataHash(e), r = this.cache.get(n);
		return r ? Date.now() - r.timestamp > this.ttl ? (this.cache.delete(n), null) : t && r.recognizedAs !== t ? null : r : null;
	}
	set(e, t, n, r, i) {
		let a = this.generateDataHash(e);
		if (this.cache.size >= this.maxEntries) {
			let e = Array.from(this.cache.entries()).sort(([, e], [, t]) => e.timestamp - t.timestamp)[0][0];
			this.cache.delete(e);
		}
		this.cache.set(a, {
			dataHash: a,
			recognizedData: t,
			recognizedAs: n,
			timestamp: Date.now(),
			responseId: r,
			metadata: i
		});
	}
	clear() {
		this.cache.clear();
	}
	getStats() {
		return {
			entries: this.cache.size,
			maxEntries: this.maxEntries,
			ttl: this.ttl
		};
	}
}, C = /* @__PURE__ */ e({
	processDataWithInstruction: () => T,
	recognizeByInstructions: () => E
}), w = new S(), T = async (e, t = {}, c) => {
	let l = (await n())?.ai, { instruction: u = "", outputFormat: p = "auto", outputLanguage: m = "auto", enableSVGImageGeneration: h = "auto", intermediateRecognition: g, processingEffort: _ = "low", processingVerbosity: v = "low", customInstruction: S, useActiveInstruction: C = !1, includeImageRecognition: T, dataType: D, signal: O } = t, k = l?.apiKey;
	if (!k) {
		let e = {
			ok: !1,
			error: "No API key available"
		};
		return c?.(e), e;
	}
	if (!e) {
		let e = {
			ok: !1,
			error: "No input provided"
		};
		return c?.(e), e;
	}
	if (O?.aborted) {
		let e = {
			ok: !1,
			error: "Cancelled"
		};
		return c?.(e), e;
	}
	let A = u;
	if (S) A = s(A, S);
	else if (C) {
		let e = await y();
		e && (A = s(A, e));
	}
	let j = await b();
	if (j && (A += j), h === !0 || h === "auto" && p === "html") {
		let e = await x();
		e && (A += e);
	}
	if (p !== "auto") {
		let e = d(p);
		e && (A += e);
	}
	let M = await a({
		apiKey: k,
		baseUrl: l?.baseUrl,
		model: l?.model,
		mcp: l?.mcp
	});
	if (!M) {
		let e = {
			ok: !1,
			error: "AI initialization failed"
		};
		return c?.(e), e;
	}
	M.clearPending();
	let N = 1, P = !1, F = [];
	if (Array.isArray(e) && (e?.[0]?.type === "message" || e?.[0]?.role)) await M.getPending()?.push(...e);
	else {
		let t = Array.isArray(e) ? e : [e];
		for (let e of t) {
			let t = e;
			if (typeof e == "string" && D === "svg" || typeof e == "string" && e.trim().startsWith("<svg")) t = e;
			else if (i(e) && (P = !0, g?.enabled !== !1 && (g?.enabled || T))) {
				N = 2;
				let n = g?.forceRefresh ? null : w.get(e, g?.outputFormat), r, i;
				if (n) r = n.recognizedData, i = n.responseId;
				else {
					let t = await E(e, g?.dataPriorityInstruction || f(g?.outputFormat || "markdown"), void 0, {
						apiKey: k,
						baseUrl: l?.baseUrl,
						model: l?.model,
						mcp: l?.mcp
					}, {
						customInstruction: void 0,
						useActiveInstruction: !1
					});
					if (!t.ok || !t.data) r = "", i = "";
					else if (r = t.data, i = t.responseId || "", g?.cacheResults !== !1) {
						let t = g?.outputFormat || "markdown";
						w.set(e, r, t, i);
					}
				}
				F.push({
					originalData: e,
					recognizedData: r,
					recognizedAs: g?.outputFormat || "markdown",
					responseId: i
				}), r && (t = r);
			}
			t != null && await M?.attachToRequest?.(t);
		}
	}
	await M.askToDoAction(A);
	let I, L;
	try {
		I = await M?.sendRequest?.(_, v, null, {
			responseFormat: o(p),
			temperature: .3,
			signal: O
		});
	} catch (e) {
		L = String(e);
	}
	let R = I;
	if (typeof I == "string") try {
		R = JSON.parse(I);
	} catch {
		R = null;
	}
	let z = R?.choices?.[0]?.message?.content, B = z ? r(z.trim()) : null, V = B;
	if (B && u?.includes("Recognize data from image")) try {
		let e = JSON.parse(B);
		V = e?.recognized_data ? Array.isArray(e.recognized_data) ? e.recognized_data.join("\n") : typeof e.recognized_data == "string" ? e.recognized_data : JSON.stringify(e.recognized_data) : e?.ok === !1 ? null : B;
	} catch {
		V = B;
	}
	let H = {
		ok: !!V && !L,
		data: V || void 0,
		error: L || (V ? void 0 : "No data recognized"),
		responseId: R?.id || M?.getResponseId?.(),
		processingStages: N,
		recognizedImages: P,
		intermediateRecognizedData: F.length > 0 ? F : void 0
	};
	return c?.(H), H;
}, E = async (e, t, n, r, i) => {
	let a = await T(e, {
		instruction: t,
		customInstruction: i?.customInstruction,
		useActiveInstruction: i?.useActiveInstruction,
		processingEffort: i?.recognitionEffort || "low",
		processingVerbosity: i?.recognitionVerbosity || "low",
		outputFormat: "auto",
		outputLanguage: "auto",
		enableSVGImageGeneration: "auto"
	}), o = {
		ok: a.ok,
		data: a.data,
		error: a.error,
		responseId: a.responseId
	};
	return n?.(o), o;
};
//#endregion
export { C as n, T as t };
