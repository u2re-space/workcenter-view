import { r as e } from "./rolldown-runtime-CEFd7nDs.js";
import { n as t, r as n } from "./Settings-Cu3erOWB.js";
//#region ../../../apps/CWSP-process/src/service/instructions/CustomInstructions.ts
var r = /* @__PURE__ */ e({
	getActiveInstruction: () => l,
	getActiveInstructionText: () => u,
	getCustomInstructions: () => c,
	getInstructionRegistry: () => s,
	setActiveInstruction: () => d
}), i = (e, t) => {
	let n = Number.isFinite(e.order) ? e.order : 2 ** 53 - 1, r = Number.isFinite(t.order) ? t.order : 2 ** 53 - 1;
	return n === r ? (e.label || "").localeCompare(t.label || "") : n - r;
}, a = (e) => [...e || []].sort(i), o = (e, t) => t && e.find((e) => e.id === t) || null, s = async () => {
	let e = await t(), n = a(e?.ai?.customInstructions), r = o(n, e?.ai?.activeInstructionId);
	return {
		instructions: n,
		activeId: r?.id || "",
		activeInstruction: r
	};
}, c = async () => (await s()).instructions, l = async () => {
	try {
		let e = await s();
		return e.activeId ? (e.activeInstruction || console.warn("[CustomInstructions] activeInstructionId not found:", e.activeId), e.activeInstruction) : null;
	} catch (e) {
		return console.error("[CustomInstructions] Error in getActiveInstruction:", e), null;
	}
}, u = async () => (await l())?.instruction || "", d = async (e) => {
	let r = await t(), i = {
		...r,
		ai: {
			...r.ai,
			activeInstructionId: e || ""
		}
	};
	await n(i);
};
//#endregion
export { d as i, c as n, s as r, r as t };
