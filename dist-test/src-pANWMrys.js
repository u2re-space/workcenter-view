import { r as e } from "./rolldown-runtime-CEFd7nDs.js";
import { A as t, B as n, C as r, D as i, E as a, F as o, H as s, I as c, L as l, M as u, N as d, O as f, P as p, R as m, S as h, T as g, V as _, b as v, c as y, d as b, f as x, g as S, h as C, j as w, k as T, l as ee, m as E, p as te, s as ne, u as re, v as D, w as O, x as ie, y as ae, z as oe } from "./src-CsRMoM8y.js";
import { _ as se, a as ce, b as le, c as ue, d as de, f as fe, g as pe, h as me, i as he, l as k, m as ge, n as _e, o as ve, p as ye, r as A, s as be, u as xe, v as Se, y as Ce } from "./OPFS-CC8HO8jG.js";
import { a as we, i as Te, n as Ee, o as De, r as Oe, s as ke, t as Ae } from "./workcenter-view.js";
WeakMap.prototype.getOrInsert ??= function(e, t) {
	return this.has(e) || this.set(e, t), this.get(e);
}, WeakMap.prototype.getOrInsertComputed ??= function(e, t) {
	return this.has(e) || this.set(e, t(e)), this.get(e);
}, Map.prototype.getOrInsert ??= function(e, t) {
	return this.has(e) || this.set(e, t), this.get(e);
}, Map.prototype.getOrInsertComputed ??= function(e, t) {
	return this.has(e) || this.set(e, t(e)), this.get(e);
};
var je = (e, t, n = () => null) => (e?.has?.(t) || e?.set?.(t, n?.(t)), e?.get?.(t)), Me = (e) => {
	if (typeof e != "object" || !e) return !1;
	try {
		let t = globalThis.CSSStyleValue;
		if (typeof t == "function" && e instanceof t) return !0;
		for (let t = e; t; t = Object.getPrototypeOf(t)) if (t?.constructor?.name === "CSSStyleValue") return !0;
	} catch {}
	return !1;
}, Ne = (e) => {
	if (typeof e != "object" || !e || Me(e)) return !1;
	try {
		return "value" in e;
	} catch {
		return !1;
	}
}, Pe = (e, t) => e?.[t] ?? globalThis?.[t], Fe = (e) => {
	switch (e.toLowerCase()) {
		case "%": return "percent";
		case "q": return "Q";
		case "hz": return "Hz";
		case "khz": return "kHz";
		case "fr": return "flex";
		default: return e.toLowerCase();
	}
}, Ie = (e) => e.toLowerCase() === "%" ? "percent" : e.toLowerCase(), Le = (e, t, n) => {
	let r = e?.CSS, i = Fe(t), a = r?.[i];
	if (typeof a == "function") return a.call(r, n);
	let o = Pe(e, "CSSUnitValue");
	if (typeof o != "function") throw TypeError(`Typed OM does not support CSS unit "${t}"`);
	return new o(n, Ie(t));
}, Re = (e) => {
	let t = [], n = 0;
	for (; n < e.length;) {
		let r = e.slice(n), i = /^\s+/.exec(r);
		if (i) {
			n += i[0].length;
			continue;
		}
		let a = /^(?:\d*\.\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?/.exec(r);
		if (a) {
			n += a[0].length;
			let r = /^(%|[a-zA-Z]+)/.exec(e.slice(n)), i = r?.[0] ?? null;
			r && (n += r[0].length), t.push({
				kind: "number",
				value: Number(a[0]),
				unit: i == null ? null : i.toLowerCase()
			});
			continue;
		}
		let o = /^[a-zA-Z_][a-zA-Z0-9_-]*/.exec(r);
		if (o) {
			t.push({
				kind: "identifier",
				value: o[0].toLowerCase()
			}), n += o[0].length;
			continue;
		}
		let s = r[0];
		if ([
			"+",
			"-",
			"*",
			"/",
			"(",
			")",
			","
		].includes(s)) {
			t.push({
				kind: "symbol",
				value: s
			}), n++;
			continue;
		}
		throw SyntaxError(`Unsupported token near "${r}"`);
	}
	return t;
}, ze = class {
	tokens;
	win;
	index = 0;
	constructor(e, t) {
		this.tokens = e, this.win = t;
	}
	parse() {
		let e = this.parseSum();
		if (this.index !== this.tokens.length) throw SyntaxError("Unexpected trailing expression");
		return e;
	}
	current() {
		return this.tokens[this.index];
	}
	consume() {
		let e = this.tokens[this.index];
		if (!e) throw SyntaxError("Unexpected end of expression");
		return this.index++, e;
	}
	consumeSymbol(e) {
		let t = this.consume();
		if (t.kind !== "symbol" || t.value !== e) throw SyntaxError(`Expected "${e}"`);
	}
	matchesSymbol(e) {
		let t = this.current();
		return t?.kind === "symbol" && t.value === e;
	}
	createMath(e, ...t) {
		let n = Pe(this.win, e);
		if (typeof n != "function") throw TypeError(`${e} is not supported`);
		return new n(...t);
	}
	parseSum() {
		let e = this.parseProduct();
		for (; this.matchesSymbol("+") || this.matchesSymbol("-");) {
			let t = this.consume(), n = this.parseProduct();
			if (t.kind !== "symbol") throw SyntaxError("Expected sum operator");
			e = t.value === "+" ? this.createMath("CSSMathSum", e, n) : this.createMath("CSSMathSum", e, this.createMath("CSSMathNegate", n));
		}
		return e;
	}
	parseProduct() {
		let e = this.parseUnary();
		for (; this.matchesSymbol("*") || this.matchesSymbol("/");) {
			let t = this.consume(), n = this.parseUnary();
			if (t.kind !== "symbol") throw SyntaxError("Expected product operator");
			e = t.value === "*" ? this.createMath("CSSMathProduct", e, n) : this.createMath("CSSMathProduct", e, this.createMath("CSSMathInvert", n));
		}
		return e;
	}
	parseUnary() {
		return this.matchesSymbol("+") ? (this.consume(), this.parseUnary()) : this.matchesSymbol("-") ? (this.consume(), this.createMath("CSSMathNegate", this.parseUnary())) : this.parsePrimary();
	}
	parsePrimary() {
		let e = this.consume();
		if (e.kind === "number") return Le(this.win, e.unit ?? "number", e.value);
		if (e.kind === "symbol" && e.value === "(") {
			let e = this.parseSum();
			return this.consumeSymbol(")"), e;
		}
		if (e.kind === "identifier") return this.parseFunction(e.value);
		throw SyntaxError("Expected a numeric value");
	}
	parseFunction(e) {
		if (this.consumeSymbol("("), e === "calc") {
			let e = this.parseSum();
			return this.consumeSymbol(")"), e;
		}
		let t = [];
		if (!this.matchesSymbol(")")) for (t.push(this.parseSum()); this.matchesSymbol(",");) this.consume(), t.push(this.parseSum());
		if (this.consumeSymbol(")"), e === "min") {
			if (t.length === 0) throw SyntaxError("min() requires a value");
			return this.createMath("CSSMathMin", ...t);
		}
		if (e === "max") {
			if (t.length === 0) throw SyntaxError("max() requires a value");
			return this.createMath("CSSMathMax", ...t);
		}
		if (e === "clamp") {
			if (t.length !== 3) throw SyntaxError("clamp() requires three values");
			return this.createMath("CSSMathClamp", t[0], t[1], t[2]);
		}
		throw SyntaxError(`Unsupported function "${e}"`);
	}
}, Be = (e, t) => {
	try {
		return new ze(Re(e), t).parse();
	} catch {
		return null;
	}
}, Ve = typeof CSSStyleValue < "u" && typeof CSSUnitValue < "u", He = (e) => Ve && e instanceof CSSUnitValue, Ue = (e, t, n, r = "") => {
	if (!(!e || !t)) {
		if (n == null) {
			e.getPropertyValue(t) !== "" && e.removeProperty(t);
			return;
		}
		e.getPropertyValue(t) !== n && e.setProperty(t, n, r);
	}
}, We = (e, t, n, r = "") => {
	if (!e || !t) return e;
	let i = h(t), a = e.style, o = e.attributeStyleMap ?? e.styleMap;
	if (!Ve || !o) return Ge(e, t, n, r);
	let c = e.ownerDocument?.defaultView ?? globalThis, l = f(n) && Ne(n) ? n.value : n;
	if (l == null) return o.delete?.(i), a && Ue(a, i, null, r), e;
	if (Me(l)) {
		let t = o.get(i);
		if (He(l) && He(t)) {
			if (t.value === l.value && t.unit === l.unit) return e;
		} else if (t === l) return e;
		return o.set(i, l), e;
	}
	if (typeof l == "number") {
		if (CSS?.number && !i.startsWith("--")) {
			let t = CSS.number(l), n = o.get(i);
			return He(n) && n.value === t.value && n.unit === t.unit || o.set(i, t), e;
		}
		return Ue(a, i, String(l), r), e;
	}
	if (typeof l == "string") {
		if (/\b(calc|min|max|clamp)\s*\(/.test(l)) {
			let t = Be(l, c);
			if (t) try {
				return o.set(i, t), e;
			} catch {}
		}
		let t = s(l);
		if (typeof t == "number" && CSS?.number && !i.startsWith("--")) {
			let n = CSS.number(t), r = o.get(i);
			return He(r) && r.value === n.value && r.unit === n.unit || o.set(i, n), e;
		}
		return Ue(a, i, l, r), e;
	}
	return Ue(a, i, String(l), r), e;
}, Ge = (e, t, n, r = "") => {
	if (!e || !t) return e;
	let i = h(t), a = e.style;
	if (!a) return e;
	let o = f(n) && Ne(n) ? n.value : n;
	return typeof o == "string" && !Me(o) && (o = s(o) ?? o), o == null ? (Ue(a, i, null, r), e) : (Me(o), Ue(a, i, String(o), r), e);
}, Ke = (e, t, n, r = "") => Ve ? We(e, t, n, r) : Ge(e, t, n, r), qe = (e, t, n = "", r) => {
	let i = Bt(e), a = typeof e == "string" && URL.canParse(e) ? e : i;
	return t?.[0] && (t[0].fetchPriority = "high"), t && a && typeof a == "string" && Pt(t, a, n), t?.[0] && (!URL.canParse(e) || r) && t?.[0] instanceof HTMLLinkElement, Ft(i, (e) => {
		t?.[0] && e && (Pt(t, e, n), t?.[0].setAttribute("loaded", ""));
	})?.catch?.((e) => {
		console.warn("Failed to load style sheet:", e);
	});
}, Je = (e) => {
	let t = typeof document < "u" ? document.createElement("link") : null;
	return t && (t.fetchPriority = "high"), t ? (Object.assign(t, {
		rel: "stylesheet",
		type: "text/css",
		crossOrigin: "same-origin"
	}), t.dataset.owner = "DOM", qe(e, [t, "href"]), typeof document < "u" && document.head.append(t), t) : null;
}, Ye = (e, t = typeof document < "u" ? document?.head : null, n = "") => {
	let r = t?.querySelector?.("head") ?? t;
	if (typeof HTMLHeadElement < "u" && r instanceof HTMLHeadElement) return Je(e);
	let i = typeof document < "u" ? document.createElement("style") : null;
	return i ? (i.dataset.owner = "DOM", qe(e, [i, "innerHTML"], n), r?.prepend?.(i), i) : null;
}, Xe = (e) => mt(e, ""), Ze = Symbol.for("dom.ts@adoptedMap"), Qe = globalThis[Ze] ??= /* @__PURE__ */ new Map(), $e = Symbol.for("dom.ts@adoptedBlobMap"), et = globalThis[$e] ??= /* @__PURE__ */ new WeakMap(), tt = Symbol.for("dom.ts@adoptedAppliedText"), nt = globalThis[tt] ??= /* @__PURE__ */ new WeakMap(), rt = Symbol.for("dom.ts@adoptedFilled"), it = globalThis[rt] ??= /* @__PURE__ */ new WeakSet(), at = (e, t) => t ? `@layer ${t} { ${e} }` : e, ot = (e) => {
	try {
		return e.cssRules.length;
	} catch {
		return null;
	}
}, st = (e, t) => {
	nt.set(e, t), it.add(e);
}, ct = (e) => {
	if (!e) return null;
	let t = nt.get(e);
	if (t) return t;
	for (let [t, n] of Qe) if (n === e && typeof t == "string") return t;
	return null;
}, lt = (e, t) => {
	if (!e) return !1;
	let n = t || ct(e), r = ot(e);
	return r === null ? !1 : r > 0 ? (it.add(e), n && !nt.has(e) && nt.set(e, n), !0) : n && dt(e, n) ? (st(e, n), !0) : !1;
}, ut = Symbol.for("dom.ts@layerCounter");
globalThis[ut] ??= 0;
var dt = (e, t) => {
	if (!e || !t) return !1;
	try {
		return e.replaceSync(t), !0;
	} catch (e) {
		let t = String(e?.message || "").toLowerCase();
		return t.includes("@import rules are not allowed") || t.includes("@import") && t.includes("not allowed") || console.warn("[DOM] Failed to apply adopted stylesheet:", e), !1;
	}
}, ft = (e) => {
	try {
		return typeof URL < "u" && typeof URL.canParse == "function" && URL.canParse(e);
	} catch {
		return !1;
	}
}, pt = (e) => {
	let t = et.get(e);
	return t || (t = new CSSStyleSheet(), et.set(e, t)), t;
}, mt = (e, t = null) => {
	try {
		return ht(e, t);
	} catch (n) {
		return console.warn("[DOM] loadAsAdopted failed", n), typeof e == "string" && Ye(e, void 0, t || ""), null;
	}
}, ht = (e, t = null) => {
	if (!At()) return typeof e == "string" && Ye(e, void 0, t || ""), null;
	if (typeof e == "string" && jt(e)) return Ye(e, void 0, t || ""), null;
	if (typeof e == "string" && Qe?.has?.(e)) {
		let n = Qe.get(e);
		return lt(n, nt.get(n) || at(e, t)), typeof document < "u" && document.adoptedStyleSheets && !document.adoptedStyleSheets.includes(n) && document.adoptedStyleSheets.push(n), n;
	}
	if ((e instanceof Blob || e instanceof File) && et?.has?.(e)) {
		let t = et.get(e);
		return lt(t), typeof document < "u" && document.adoptedStyleSheets && !document.adoptedStyleSheets.includes(t) && document.adoptedStyleSheets.push(t), t;
	}
	if (!e) return null;
	let n = typeof e == "string" ? je(Qe, e, () => new CSSStyleSheet()) : pt(e);
	if (typeof document < "u" && document.adoptedStyleSheets && !document.adoptedStyleSheets.includes(n) && document.adoptedStyleSheets.push(n), typeof e == "string" && !ft(e)) {
		let r = at(e, t);
		return Qe.set(e, n), dt(n, r) ? st(n, r) : (Et(n), Qe.delete(e), Ye(e)), n;
	}
	return Ft(Ut(e), (r) => {
		if (Qe.set(r, n), r) {
			if (jt(r)) return Et(n), Qe.delete(r), et.delete(e), Ye(r, void 0, t || ""), n;
			let i = at(r, t);
			return dt(n, i) ? st(n, i) : (Et(n), Qe.delete(r), et.delete(e), Ye(r, void 0, t || "")), n;
		}
	}), n;
}, gt = Symbol.for("dom.ts@styleTreeHooks"), _t = globalThis[gt] ??= /* @__PURE__ */ new Set(), vt = /* @__PURE__ */ new WeakSet(), yt = /* @__PURE__ */ new Set(), bt = [
	"data-theme",
	"data-explorer-color-scheme",
	"data-color-scheme",
	"theme",
	"color-scheme"
], xt = (e) => !e || e.nodeType !== 1 ? !1 : !!(String(e.localName || "").includes("-") || e.shadowRoot || e.styles != null), St = (e, t) => {
	if (!(!e || e.nodeType === 3)) {
		if (e.nodeType === 11) {
			for (let n of e.childNodes || []) St(n, t);
			return;
		}
		if (xt(e) && t.add(e), typeof e.querySelectorAll == "function") try {
			for (let n of e.querySelectorAll("*")) xt(n) && t.add(n);
		} catch {}
	}
}, Ct = (e, t = "tree") => {
	for (let n of e) if (xt(n)) for (let e of _t) e(n, t);
}, wt = (e) => {
	typeof e == "function" && _t.add(e);
}, Tt = (e) => {
	if (!e || typeof MutationObserver > "u" || vt.has(e)) return e;
	vt.add(e), yt.add(e);
	let t = new MutationObserver((e) => {
		let t = /* @__PURE__ */ new Set();
		for (let n of e) if (n.type === "childList") {
			for (let e of n.addedNodes) St(e, t);
			let e = n.target?.getRootNode?.();
			if (e instanceof ShadowRoot && xt(e.host)) {
				let n = e.adoptedStyleSheets;
				(!n || n.length === 0) && t.add(e.host);
			}
		} else n.type === "attributes" && n.target && xt(n.target) && t.add(n.target);
		Ct(t, "mutation");
	});
	try {
		t.observe(e, {
			childList: !0,
			subtree: !0,
			attributes: !0,
			attributeFilter: [...bt]
		});
	} catch {
		return vt.delete(e), e;
	}
	return e;
}, Et = (e) => {
	if (!e) return !1;
	let t = typeof e == "string" ? Qe.get(e) : e;
	if (!t || typeof document > "u") return !1;
	let n = document.adoptedStyleSheets, r = n.indexOf(t);
	return r !== -1 && (n.splice(r, 1), !0);
}, Dt = (e, t) => {
	if ("computedStyleMap" in e) {
		let n = e?.computedStyleMap?.()?.get(t);
		return n instanceof CSSUnitValue ? n?.value || 0 : n?.toString?.();
	}
	if (e instanceof HTMLElement) {
		let n = getComputedStyle?.(e, "");
		return parseFloat(n?.getPropertyValue?.(t)?.replace?.("px", "")) || 0;
	}
	return parseFloat((e?.style ?? e).getPropertyValue?.(t)?.replace?.("px", "")) || 0;
}, Ot = (e, t) => t == "inline" ? Dt(e, "padding-inline-start") + Dt(e, "padding-inline-end") : Dt(e, "padding-block-start") + Dt(e, "padding-block-end"), kt = typeof document < "u" ? document.createElement("style") : null;
kt && (document.querySelector("head")?.appendChild?.(kt), kt.dataset.owner = "DOM");
var At = () => typeof globalThis < "u" && typeof globalThis.CSSStyleSheet == "function", jt = (e) => typeof e == "string" && /@import\b/i.test(e), Mt = (e) => typeof CSSLayerBlockRule < "u" && e instanceof CSSLayerBlockRule, Nt = (e, t) => {
	if (!e || !t) return;
	let n = Array.from(e.cssRules || []), r = n.find((e) => Mt(e) && e.name === t);
	if (r) return r;
	try {
		let r = e.insertRule(`@layer ${t} {}`, n.length), i = e.cssRules?.[r];
		return Mt(i) ? i : void 0;
	} catch {
		return;
	}
}, Pt = (e, t, n = "") => {
	e[0][e[1]] = e[1] == "innerHTML" ? `@import url("${t}") ${n && typeof n == "string" ? `layer(${n})` : ""};` : t;
}, Ft = (e, t) => typeof e?.then == "function" ? e?.then?.(t) : t(e), It = Symbol.for("dom.ts@blobURLMap"), Lt = globalThis[It] ??= /* @__PURE__ */ new WeakMap(), Rt = Symbol.for("dom.ts@cacheMap"), zt = globalThis[Rt] ??= /* @__PURE__ */ new Map(), Bt = (e) => {
	if (!e) return null;
	if (zt.has(e)) return zt.get(e);
	if (e instanceof Blob || e instanceof File) {
		if (Lt.has(e)) return Lt.get(e);
		let t = URL.createObjectURL(e);
		return Lt.set(e, t), zt.set(t, t), t;
	}
	if (URL.canParse(e) || e?.trim?.()?.startsWith?.("./")) {
		let t = fetch(e?.replace?.("?url", "?raw"), {
			cache: "force-cache",
			mode: "same-origin",
			priority: "high"
		})?.then?.(async (t) => {
			let n = await t.blob(), r = URL.createObjectURL(n);
			return Lt.set(n, r), zt.set(e, r), zt.set(r, r), r;
		});
		return zt.set(e, t), t;
	}
	if (typeof e == "string") {
		let t = new Blob([e], { type: "text/css" }), n = URL.createObjectURL(t);
		return Lt.set(t, n), zt.set(n, n), n;
	}
	return e;
}, Vt = /* @__PURE__ */ new Map(), Ht = /* @__PURE__ */ new WeakMap(), Ut = (e) => {
	if (!e) return "";
	if (Vt.has(e)) return Vt.get(e) ?? "";
	if (e instanceof Blob || e instanceof File) {
		if (Ht.has(e)) return Ht.get(e) ?? "";
		let t = e?.text?.()?.then?.((t) => (Ht.set(e, t), t));
		return Ht.set(e, t), t;
	}
	if (URL.canParse(e) || e?.trim?.()?.startsWith?.("./")) {
		let t = fetch(e?.replace?.("?url", "?raw"), {
			cache: "force-cache",
			mode: "same-origin",
			priority: "high"
		})?.then?.(async (t) => {
			let n = await t.text();
			return Vt.set(e, n), n;
		});
		return Vt.set(e, t), t;
	}
	return typeof e == "string" && Vt.set(e, e), e;
}, Wt = Symbol.for("dom.ts@adoptedSelectorMap"), Gt = globalThis[Wt] ??= /* @__PURE__ */ new Map(), Kt = Symbol.for("dom.ts@adoptedShadowSelectorMap"), qt = globalThis[Kt] ??= /* @__PURE__ */ new WeakMap(), Jt = Symbol.for("dom.ts@adoptedLayerMap"), Yt = globalThis[Jt] ??= /* @__PURE__ */ new Map(), Xt = Symbol.for("dom.ts@adoptedShadowLayerMap"), Zt = globalThis[Xt] ??= /* @__PURE__ */ new WeakMap(), Qt = (e, t = "ux-query", n = null) => {
	if (!e || !At()) return null;
	let r = n instanceof ShadowRoot ? n : n?.getRootNode ? n.getRootNode({ composed: !0 }) : null, i = r instanceof ShadowRoot, a = i ? r.adoptedStyleSheets : typeof document < "u" ? document.adoptedStyleSheets : null;
	if (!a) return null;
	let o = `${t || ""}:${e}`, s;
	if (i) {
		let e = qt.get(r);
		e || (e = /* @__PURE__ */ new Map(), qt.set(r, e)), s = e.get(o), s || (s = new CSSStyleSheet(), e.set(o, s), a.includes(s) || a.push(s));
	} else s = Gt.get(o), s || (s = new CSSStyleSheet(), Gt.set(o, s), a.includes(s) || a.push(s));
	if (t) {
		let n;
		if (i) {
			let e = Zt.get(r);
			e || (e = /* @__PURE__ */ new Map(), Zt.set(r, e)), n = e.get(t);
		} else n = Yt.get(t);
		if (!n && (n = Nt(s, t), n)) {
			if (i) {
				let e = Zt.get(r);
				e || (e = /* @__PURE__ */ new Map(), Zt.set(r, e)), e.set(t, n);
			} else Yt.set(t, n);
		}
		if (n) {
			let t = Array.from(n.cssRules || []).findIndex((t) => t instanceof CSSStyleRule && t.selectorText?.trim?.() === e?.trim?.());
			if (t === -1) try {
				t = n.insertRule(`${e} {}`, n.cssRules.length);
			} catch {
				return null;
			}
			return n.cssRules[t];
		}
	}
	let c = Array.from(s.cssRules || []).findIndex((t) => t instanceof CSSStyleRule && t.selectorText?.trim?.() === e?.trim?.());
	if (c === -1) try {
		c = s.insertRule(`${e} {}`, s.cssRules.length);
	} catch {
		return null;
	}
	let l = s.cssRules[c];
	return l instanceof CSSStyleRule ? l : null;
}, $t = Symbol.for("lur.e@adoptedStyleSheetsCache");
globalThis[$t] ??= /* @__PURE__ */ new WeakMap();
var en = globalThis[$t], tn = Symbol.for("lur.e@styleCache");
globalThis[tn] ??= /* @__PURE__ */ new Map();
var nn = globalThis[tn], rn = Symbol.for("lur.e@styleElementCache");
globalThis[rn] ??= /* @__PURE__ */ new WeakMap();
var an = globalThis[rn], on = "data-glit-host-css", sn = (e) => {
	let t = e?.shadowRoot;
	if (!t) return;
	let n = en.get(e) || [];
	for (let e of n) lt(e);
	try {
		let e = t.adoptedStyleSheets || [];
		t.adoptedStyleSheets = [...n.filter((t) => !e.includes(t)), .../* @__PURE__ */ new Set([...e])];
	} catch {}
}, cn = (e, t) => {
	let n = en.get(e);
	n || en.set(e, n = []), t && n.indexOf(t) < 0 && n.push(t), lt(t), sn(e);
}, ln = (e, t) => {
	let n = e?.shadowRoot;
	if (!n || !t) return null;
	let r = n.querySelector?.(`style[${on}]`);
	return r ? r.textContent !== t && (r.textContent = t) : (r = Ye(t, n, ""), r && r.setAttribute(on, "")), r;
}, un = (e) => {
	let t = e?.styles;
	if (typeof t == "string") return t;
	if (typeof t == "function") try {
		let n = t.call(e);
		return typeof n == "string" ? n : ct(n);
	} catch {
		return null;
	}
	return ct(t);
}, dn = (e) => {
	e && (e.styles != null && gn(e, e.styles), sn(e), ln(e, un(e)));
}, fn = /* @__PURE__ */ new WeakSet(), pn = [], mn = !1, hn = (e) => {
	!e || !(e instanceof Element) || fn.has(e) || (fn.add(e), pn.push(e), !mn && (mn = !0, queueMicrotask(() => {
		mn = !1;
		let e = pn;
		pn = [];
		for (let t of e) fn.delete(t), t.isConnected && dn(t);
	})));
};
wt((e) => hn(e));
var gn = (e, t) => {
	if (!t) return null;
	let n = t;
	if (typeof t == "function") try {
		let r = new WeakRef(e);
		n = t.call(e, r);
	} catch (e) {
		return console.warn("Error calling styles function:", e), null;
	}
	if (n && typeof CSSStyleSheet < "u" && n instanceof CSSStyleSheet) return cn(e, n), ln(e, ct(n));
	if (n instanceof Promise) return n.then((t) => {
		t instanceof CSSStyleSheet ? cn(e, t) : t != null && gn(e, t);
	}).catch((e) => {
		console.warn("Error loading adopted stylesheet:", e);
	}), null;
	if (typeof n == "string" || n instanceof Blob || n instanceof File) {
		let t = mt(n, "");
		if (t) {
			let r = (t) => {
				cn(e, t);
			};
			return t instanceof Promise ? (t.then((t) => {
				r(t), ln(e, typeof n == "string" ? n : ct(t));
			}).catch((e) => {
				console.warn("Error loading adopted stylesheet:", e);
			}), null) : (r(t), ln(e, typeof n == "string" ? n : ct(t)));
		}
	}
	let r = typeof t == "function" || typeof t == "object" ? an : nn, i = r.get(t), a = i?.styleElement, o = i?.vars;
	if (!i) {
		let i = "", s = [];
		typeof n == "string" ? i = n || "" : typeof n == "object" && n && (n instanceof HTMLStyleElement ? a = n : (i = typeof n.css == "string" ? n.css : typeof n == "string" ? n : String(n), s = n?.props ?? s, o = n?.vars ?? o)), !a && i && (a = Ye(i, e, "ux-layer")), r.set(t, {
			css: i,
			props: s,
			vars: o,
			styleElement: a
		});
	}
	return a;
};
Symbol.observable ||= Symbol.for("observable"), Symbol.subscribe ||= Symbol.for("subscribe"), Symbol.unsubscribe ||= Symbol.for("unsubscribe");
var j = Symbol.for("@value"), M = Symbol.for("@extract"), _n = Symbol.for("@origin"), vn = Symbol.for("@registry"), yn = Symbol.for("@behavior"), bn = Symbol.for("@promise"), xn = Symbol.for("@trigger-less"), N = Symbol.for("@trigger-lock"), Sn = Symbol.for("@trigger-control"), Cn = Symbol.for("@trigger"), wn = Symbol.for("@subscribe"), Tn = Symbol.for("@isNotEqual"), En = Symbol.for("@realProp"), Dn = /* @__PURE__ */ new WeakMap(), On = (e) => {
	let t = typeof e == "object" || typeof e == "function" ? e?.[M] ?? e : e, n = (e) => On(e);
	return Array.isArray(t) ? t?.map?.(n) || Array.from(t || [])?.map?.(n) || [] : t instanceof Map || t instanceof WeakMap ? new Map(Array.from(t?.entries?.() || [])?.map?.(([e, t]) => [e, On(t)])) : t instanceof Set || t instanceof WeakSet ? new Set(Array.from(t?.values?.() || [])?.map?.(n)) : t != null && typeof t == "function" || typeof t == "object" ? Object.fromEntries(Array.from(Object.entries(t || {}) || [])?.filter?.(([e]) => e != M && e != _n && e != vn)?.map?.(([e, t]) => [e, On(t)])) : t;
}, kn = (e) => e?.[M] ?? e?.["@target"] ?? e, An = (e, t = !1) => {
	let n = e;
	if (w(e) || typeof e == "symbol") return e;
	if (e != null && (e instanceof WeakRef || "deref" in e && typeof e?.deref == "function") && (e = e?.deref?.()), e != null && (typeof e == "object" || typeof e == "function")) {
		e = kn(e);
		let r = t && f(e) && e?.value;
		if (r != null && (typeof r == "object" || typeof r == "function") && (e = r), n != e) return An(e, t);
	}
	return e;
}, jn = (e) => e != null && typeof e.then == "function", Mn = (e, t) => w(e) || typeof e == "function" ? t?.(e) : jn(e) ? e.then(t) : e?.promise && jn(e.promise) ? e.promise.then(t) : t?.(e), Nn = /* @__PURE__ */ new WeakMap(), Pn = new FinalizationRegistry((e) => {
	e?.forEach?.((e) => e?.());
});
function Fn(e, t, n) {
	if (!(!n || typeof n != "function" || typeof e != "object" && typeof e != "function")) {
		if (t == Symbol.dispose) {
			let t = e?.[M] ?? e;
			Nn?.getOrInsertComputed?.(t, () => {
				let e = /* @__PURE__ */ new Set();
				return (typeof t == "object" || typeof t == "function") && (Pn.register(t, e), Nn.set(t, e), t[Symbol.dispose] ??= () => e.forEach((e) => {
					e?.();
				})), e;
			})?.add?.(n);
		} else e[t] = function(...r) {
			let i = e?.[t];
			typeof i == "function" && i.apply(this, r), n.apply(this, r);
		};
	}
}
//#endregion
//#region ../../projects/object.ts/src/core/Subscript.ts
var In = Symbol.for("object.ts@withUnsub");
globalThis[In] ??= /* @__PURE__ */ new WeakMap();
var Ln = globalThis[In], Rn = (e, t, n) => Ln.getOrInsert(e, () => {
	let r = t?.deref?.();
	r?.affected?.(n);
	let i = e?.complete?.bind?.(e), a = () => {
		let e = i?.();
		return r?.unaffected?.(n), e;
	};
	return e.complete = a, {
		unaffected: a,
		[Symbol.dispose]: a,
		[Symbol.asyncDispose]: a
	};
}), zn = Symbol.for("object.ts@subscriptRegistry");
globalThis[zn] ??= /* @__PURE__ */ new WeakMap();
var P = globalThis[zn] ??= /* @__PURE__ */ new WeakMap(), Bn = Symbol.for("object.ts@globalEffectListeners");
globalThis[Bn] ??= /* @__PURE__ */ new Map();
var Vn = globalThis[Bn], Hn = Symbol.for("object.ts@wrapped");
globalThis[Hn] ??= /* @__PURE__ */ new WeakMap();
var Un = globalThis[Hn], Wn = (e, t) => {
	let n = e?.[M] ?? e, r = P.get(n);
	return r ? r.bindSource(n) : (r = new ar(n), P.set(n, r)), t;
}, Gn = (e, t) => (e = An(e?.[M] ?? e), typeof e == "symbol" || typeof e != "object" && typeof e != "function" || e == null ? e : Un.getOrInsertComputed(e, () => new Proxy(e, Wn(e, t)))), Kn = Symbol.for("@allProps"), qn = /* @__PURE__ */ new Set(["*", "all"]), Jn = /* @__PURE__ */ new Map([
	["set", ["setter", "@set"]],
	["add", ["@add"]],
	["delete", ["@delete"]],
	["invalidate", ["@invalidate"]],
	["manual", ["@manual"]],
	["custom", ["@custom"]],
	["setAll", ["@setAll"]],
	["addAll", ["@addAll"]],
	["deleteAll", ["@deleteAll", "@clear"]]
]), Yn = Symbol.for("object.ts@triggerCanonicalNames");
globalThis[Yn] ??= new Map(Array.from(Jn.entries()).flatMap(([e, t]) => t.map((t) => [t, e])));
var Xn = globalThis[Yn], Zn = (e = "set") => {
	if (e == null) return e;
	let t = String(e || "set");
	return Xn.get(t) ?? t;
}, Qn = (e) => {
	let t = e == null ? "all" : String(Zn(e) ?? "all");
	return [t, ...Jn.get(t) ?? []];
}, $n = (e = ["*"]) => new Set([...er(e)].flatMap((e) => [e, ...Jn.get(e) ?? []])), er = (e = ["*"]) => {
	let t = typeof e == "string" ? [e] : Array.from(e ?? ["*"]), n = new Set(t.map((e) => {
		let t = String(e || "*");
		return qn.has(t) ? t : String(Zn(t) ?? t);
	}));
	return n.size ? n : /* @__PURE__ */ new Set(["*"]);
}, tr = (e, t) => {
	let n = e instanceof Set ? e : er(e);
	return [...qn].some((e) => n.has(e)) || Qn(t).some((e) => n.has(e));
}, nr = (e) => !!e && typeof e == "object" && !Array.isArray(e) && ("affectTypes" in e || "triggers" in e || "triggerImmediately" in e), rr = (e = ["*"]) => {
	if (nr(e)) return {
		affectTypes: er(e.affectTypes ?? e.triggers ?? ["*"]),
		triggerImmediately: e.triggerImmediately !== !1
	};
	let t = er(e);
	return {
		affectTypes: t,
		triggerImmediately: tr(t, "initial")
	};
}, ir = Symbol.for("object.ts@Subscript");
globalThis[ir] ??= class {
	compatible;
	#e;
	#t;
	#n = /* @__PURE__ */ new WeakSet();
	#r;
	#i;
	#a = /* @__PURE__ */ new Set();
	#o = /* @__PURE__ */ new Set();
	#s;
	#c = /* @__PURE__ */ new Map();
	#l = !1;
	constructor(e) {
		this.#e = e, this.#t = /* @__PURE__ */ new Map(), this.#n = /* @__PURE__ */ new WeakSet(), this.#s = {
			enable: (e = ["*"], t) => t ? this.withTriggers(e, !0, t) : this.setTriggersEnabled(e, !0),
			disable: (e = ["*"], t) => t ? this.withTriggers(e, !1, t) : this.setTriggersEnabled(e, !1),
			set: (e, t) => this.setTriggersEnabled(e, t),
			with: (e, t) => this.withTriggers(e, !0, t),
			without: (e, t) => this.withTriggers(e, !1, t),
			isEnabled: (e) => this.isTriggerEnabled(e)
		}, this.#i = { next: (e) => {
			e && (Array.isArray(e) ? this.#u(...e) : this.#u(e));
		} };
		let t = new WeakRef(this), n = function(e) {
			let n = e?.next?.bind?.(e);
			return Rn(e, t, n);
		};
		this.#r = typeof Observable < "u" ? new Observable(n) : null, this.compatible = () => this.#r;
	}
	bindSource(e) {
		return this.#e ??= e, this;
	}
	$safeExec(e, ...t) {
		if (!(!e || this.#n.has(e))) {
			this.#n.add(e);
			try {
				let n = e(...t);
				if (n && typeof n.then == "function") {
					n.catch(console.warn);
					return;
				}
				return n;
			} catch (e) {
				console.warn(e);
			} finally {
				this.#n.delete(e);
			}
		}
	}
	#u(e, t = null, n, r = "all", ...i) {
		r = Zn(r) ?? r;
		let a = this.#t;
		if (a?.size) for (let [o, s] of a.entries()) (s.prop === e || s.prop === Kn || s.prop === null) && tr(s.triggers, r) && this.$safeExec(o, t, e, n, r, ...i);
		if (Vn.size) {
			let a = {
				source: this.#e,
				target: this.#e,
				value: t,
				prop: e,
				name: e,
				oldValue: n,
				trigger: r,
				args: i
			};
			for (let [e, t] of Vn.entries()) tr(t, r) && this.$safeExec(e, a);
		}
	}
	wrap(e) {
		return Array.isArray(e) ? Gn(e, this) : e;
	}
	get triggerControl() {
		return this.#s;
	}
	isTriggerEnabled(e) {
		return !tr(this.#o, "all") && !Qn(e).some((e) => this.#o.has(e));
	}
	setTriggersEnabled(e = ["*"], t = !0) {
		let n = $n(e);
		for (let e of n) t ? this.#o.delete(e) : this.#o.add(e);
	}
	withTriggers(e, t, n) {
		let r = [...$n(e)], i = new Map(r.map((e) => [e, this.#o.has(e)])), a = () => {
			i.forEach((e, t) => {
				e ? this.#o.add(t) : this.#o.delete(t);
			});
		};
		this.setTriggersEnabled(r, t);
		try {
			let e = n?.();
			return e && typeof e.finally == "function" ? e.finally(a) : (a(), e);
		} catch (e) {
			throw a(), e;
		}
	}
	affected(e, t, n = ["*"]) {
		if (e == null || typeof e != "function") return;
		let r = rr(n);
		return this.#t.set(e, {
			prop: t || Kn,
			triggers: r.affectTypes
		}), () => this.unaffected(e, t || Kn);
	}
	unaffected(e, t) {
		if (e != null && typeof e == "function") {
			let n = this.#t, r = n?.get(e);
			if (r && (r.prop == t || t == null || t == Kn)) return n.delete(e), () => this.affected(e, t || Kn, r.triggers);
		}
		return this.#t.clear();
	}
	trigger(e, t, n, r = "set", ...i) {
		if (typeof e == "symbol" || (r === void 0 && (r = "set"), r = Zn(r) ?? r, !this.isTriggerEnabled(r))) return;
		let a = `${r ?? "all"}`, o = this.#c.get(e);
		o || (o = /* @__PURE__ */ new Map(), this.#c.set(e, o)), o.set(a, [
			e,
			t,
			n,
			r,
			i
		]), !this.#l && (this.#l = !0, queueMicrotask(() => {
			this.#l = !1;
			let e = this.#c;
			this.#c = /* @__PURE__ */ new Map();
			for (let [t, n] of e) if (!(t != null && this.#a.has(t))) {
				t != null && this.#a.add(t);
				try {
					for (let [, e] of n) {
						let [t, n, r, i, a] = e;
						try {
							this.#u(t, n, r, i, ...a ?? []);
						} catch (e) {
							console.warn(e);
						}
					}
				} finally {
					t != null && this.#a.delete(t);
				}
			}
		}));
	}
	get iterator() {
		return this.#i;
	}
};
var ar = globalThis[ir], or = Symbol.for("object.ts@__safeGetGuard"), sr = /* @__PURE__ */ new Set([
	Symbol.toStringTag,
	Symbol.iterator,
	Symbol.asyncIterator,
	Symbol.toPrimitive,
	"toString",
	"valueOf",
	"inspect",
	"constructor",
	"__proto__",
	"prototype",
	"then",
	"catch",
	"finally",
	"next"
]), cr = (e, t) => {
	if (!sr.has(t)) return null;
	let n = F(e, t);
	return typeof n == "function" ? y(e, n) : n;
}, lr = globalThis[or] ??= /* @__PURE__ */ new WeakMap();
function ur(e, t) {
	let n = !0;
	try {
		lr?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), lr?.get?.(e)?.has?.(t) && (n = !0), n = typeof Reflect.getOwnPropertyDescriptor(e, t)?.get == "function";
	} catch {
		n = !0;
	} finally {
		lr?.get?.(e)?.delete?.(t);
	}
	return n;
}
var dr = (e, t) => {
	if (w(e)) return e;
	let n = F(e, t);
	if (n == null && t != "value") {
		let r = F(e, "value");
		return r != null && !w(r) ? dr(r, t) : n;
	}
	return t == "value" && n != null && !w(n) && typeof n != "function" ? dr(n, t) ?? n ?? e : n ?? e;
}, fr = (e, t, n) => {
	if (e == null) return !1;
	let r = __safeSetGuard?.getOrInsert?.(e, /* @__PURE__ */ new Set());
	return !r?.has?.(t) && (r?.add?.(t), Reflect.set(e, t, n));
}, F = (e, t, n) => {
	let r;
	if (e == null) return e;
	let i = lr?.getOrInsert?.(e, /* @__PURE__ */ new Set());
	if (i?.has?.(t)) return null;
	if (!ur(e, t)) r ??= Reflect.get(e, t, n ?? e);
	else {
		i?.add?.(t);
		try {
			r = Reflect.get(e, t, n ?? e);
		} catch {
			r = void 0;
		} finally {
			i.delete(t), i?.size === 0 && lr?.delete?.(e);
		}
	}
	return typeof r == "function" ? y(e, r) : r;
}, pr = (e, t) => Object.prototype.hasOwnProperty.call(e, t), mr = (e, t = !1) => !!e && typeof e == "object" && !Array.isArray(e) && (pr(e, "key") || pr(e, "name") || pr(e, "oldValue") || pr(e, "old") || pr(e, "op") || pr(e, "trigger") || t && pr(e, "value")), hr = (e, t, n) => pr(e, t) ? e[t] : t == "oldValue" && pr(e, "old") ? e.old : n(), gr = (e, t = "manual") => Zn(e.trigger ?? e.op ?? t), _r = (e) => typeof e == "string" || typeof e == "number" || typeof e == "symbol", vr = (e) => {
	let t = F(e, En) ?? F(e, "realProp");
	return _r(t) ? t : null;
}, yr = (e, t) => t == "value" ? vr(e) ?? t : t, br = (e, t) => {
	let n = vr(e);
	return n != null && t == n ? F(e, "value") ?? F(e, j) ?? F(e, t) : t == null ? void 0 : F(e, t);
}, xr = (e, t) => {
	let n = (e, n, r) => (mr(n) || (r ??= n), t(mr(e) ? e : mr(n, !0) ? {
		key: e,
		trigger: r,
		...n
	} : {
		key: e,
		trigger: r ?? n
	})), r = e?.triggerControl;
	return r && Object.assign(n, r), n.custom = (e, t, r, i) => n({
		key: t,
		trigger: e,
		value: r,
		oldValue: i
	}), n;
}, Sr = (e, t, n) => {
	if (e == null || w(e)) return e;
	if (([
		"deref",
		"bind",
		"@target",
		_n,
		M,
		vn
	].indexOf(t) < 0 ? F(e, t)?.bind?.(e) : null) != null) return null;
	if ([M, _n].indexOf(t) >= 0) return F(e, t) ?? e;
	if (t == j) return F(e, t) ?? F(e, "value");
	if (t == vn) return n;
	if (t == Sn) return n?.triggerControl;
	if (t == Symbol.observable) return n?.compatible;
	if (t == Symbol.subscribe) return (t, n, r) => I(n == null ? e : [e, n], t, r);
	if (t == Symbol.iterator || t == Symbol.asyncIterator) return F(e, t);
	if (t == Symbol.dispose) return (t) => {
		F(e, Symbol.dispose)?.(t), ci(t == null ? e : [e, t]);
	};
	if (t == Symbol.asyncDispose) return (t) => {
		F(e, Symbol.asyncDispose)?.(t), ci(t == null ? e : [e, t]);
	};
	if (t == Symbol.unsubscribe) return (t) => ci(t == null ? e : [e, t]);
	if (typeof t == "symbol" && (t in e || F(e, t) != null)) return F(e, t);
}, Cr = (e, t, n) => {
	if (t == "subscribe") return n?.compatible?.[t] ?? ((t) => {
		if (typeof t == "function") return I(e, t);
		if ("next" in t && t?.next != null) {
			let n = I(e, t?.next), r = t?.complete;
			return t.complete = (...e) => (n?.(), r?.(...e)), t.complete;
		}
	});
}, wr = class {
	#e;
	#t;
	#n;
	constructor(e, t, n) {
		this.#e = e, this.#t = t, this.#n = n;
	}
	get(e, t, n) {
		return cr(e, t) ?? Reflect.get(e, t, n);
	}
	apply(e, t, n) {
		let r = [], i = [], a = [], o = [...this.#t], s = -1, c = Reflect.apply(e, t || this.#t, n);
		if (this.#n?.[N]) return Array.isArray(c) ? jr(c) : c;
		switch (this.#e) {
			case "push":
				s = o?.length, r = n;
				break;
			case "unshift":
				s = 0, r = n;
				break;
			case "pop":
				s = o?.length - 1, o.length > 0 && (i = [o[s]]);
				break;
			case "shift":
				s = 0, o.length > 0 && (i = [o[s]]);
				break;
			case "splice":
				s = n[0];
				for (let e = 0; e < Math.max(o.length, this.#t.length); e++) {
					let t = o[e], n = this.#t[e];
					n === void 0 && e >= this.#t.length ? i.push(t) : t === void 0 && e >= o.length ? a.push([
						e,
						n,
						void 0,
						!1
					]) : S(t, n) && a.push([
						e,
						n,
						t,
						!0
					]);
				}
				break;
			case "sort":
			case "fill":
			case "reverse":
			case "copyWithin":
				s = 0;
				for (let e = 0; e < o.length; e++) S(o[e], this.#t[e]) && a.push([
					s + e,
					this.#t[e],
					o[e],
					!0
				]);
				break;
			case "set": s = n[1], a.push([
				s,
				n[0],
				o?.[s],
				s in o
			]);
		}
		let l = P.get(this.#t);
		return r?.length == 1 ? l?.trigger?.(s, r[0], null, "add") : r?.length > 1 && (l?.trigger?.(s, r, null, "addAll"), r.forEach((e, t) => l?.trigger?.(s + t, e, null, "add"))), a?.length == 1 ? l?.trigger?.(a[0]?.[0] ?? s, a[0]?.[1], a[0]?.[2], a[0]?.[3] === !1 ? "add" : "set") : a?.length > 1 && (l?.trigger?.(s, a, o, "setAll"), a.forEach((e, t) => l?.trigger?.(e?.[0] ?? s + t, e?.[1], e?.[2], e?.[3] === !1 ? "add" : "set"))), i?.length == 1 ? l?.trigger?.(s, null, i[0], "delete") : i?.length > 1 && (l?.trigger?.(s, null, i, "deleteAll"), i.forEach((e, t) => l?.trigger?.(s + t, null, e, "delete"))), c == e ? new Proxy(c, this.#n) : Array.isArray(c) ? jr(c) : c;
	}
}, Tr = (e, t, n, r) => {
	let i = Number.isInteger(n) && Number.isInteger(r) && r < n ? t.slice(r, n) : [];
	if (!e[N] && n !== r) {
		let e = P.get(t);
		i.length === 1 ? e?.trigger?.(r, null, i[0], "delete") : i.length > 1 && (e?.trigger?.(r, null, i, "deleteAll"), i.forEach((t, n) => e?.trigger?.(r + n, null, t, "delete")));
		let a = Number.isInteger(n) && Number.isInteger(r) && r > n ? r - n : 0;
		if (a === 1) e?.trigger?.(n, void 0, null, "add");
		else if (a > 1) {
			let t = Array(a).fill(void 0);
			e?.trigger?.(n, t, null, "addAll"), t.forEach((t, r) => e?.trigger?.(n + r, void 0, null, "add"));
		}
	}
}, Er = class {
	[N];
	constructor() {}
	has(e, t) {
		return Reflect.has(e, t);
	}
	get(e, t, n) {
		let r = cr(e, t);
		if (r != null) return r;
		if ([
			M,
			_n,
			"@target",
			"deref"
		].indexOf(t) >= 0 && F(e, t) != null && F(e, t) != e) return typeof F(e, t) == "function" ? F(e, t)?.bind?.(e) : F(e, t);
		let i = P?.get?.(e), a = Sr(e, t, i);
		if (a != null) return a;
		let o = Cr(e, t, i);
		if (o != null) return o;
		if (t == xn) return c.call(this, this);
		if (t == Cn) return xr(i, (t) => {
			let n = t.key ?? t.name ?? 0, r = hr(t, "value", () => F(e, n)), a = hr(t, "oldValue", () => void 0);
			return i?.trigger?.(n, r, a, gr(t, "manual"));
		});
		if (t == "@target" || t == M) return e;
		if (t == "x") return () => e?.x ?? e?.[0];
		if (t == "y") return () => e?.y ?? e?.[1];
		if (t == "z") return () => e?.z ?? e?.[2];
		if (t == "w") return () => e?.w ?? e?.[3];
		if (t == "r") return () => e?.r ?? e?.[0];
		if (t == "g") return () => e?.g ?? e?.[1];
		if (t == "b") return () => e?.b ?? e?.[2];
		if (t == "a") return () => e?.a ?? e?.[3];
		let s = F(e, t) ?? (t == "value" ? F(e, j) : null);
		return typeof s == "function" ? new Proxy(typeof s == "function" ? s?.bind?.(e) : s, new wr(t, e, this)) : s;
	}
	set(e, t, n) {
		if (typeof t != "symbol" && Number.isInteger(parseInt(t)) && (t = parseInt(t) ?? t), t == N && n) return this[N] = !!n, !0;
		if (t == N && !n) return delete this[N], !0;
		let r = F(e, t), i = [
			"x",
			"y",
			"z",
			"w"
		], a = [
			"r",
			"g",
			"b",
			"a"
		], o = i.indexOf(t), s = a.indexOf(t), c = !1;
		return c = o >= 0 ? Reflect.set(e, o, n) : s >= 0 ? Reflect.set(e, s, n) : Reflect.set(e, t, n), t == "length" && S(r, n) && Tr(this, e, r, n), !this[N] && typeof t != "symbol" && S(r, n) && P?.get?.(e)?.trigger?.(t, n, r, "set"), c;
	}
	deleteProperty(e, t) {
		if (typeof t != "symbol" && Number.isInteger(parseInt(t)) && (t = parseInt(t) ?? t), t == N) return delete this[N], !0;
		let n = F(e, t), r = Reflect.deleteProperty(e, t);
		return !this[N] && t != "length" && t != N && typeof t != "symbol" && n != null && P.get(e)?.trigger?.(t, t, n, "delete"), r;
	}
}, Dr = class {
	[N];
	constructor() {}
	get(e, t, n) {
		if ([
			M,
			_n,
			"@target",
			"deref",
			"then",
			"catch",
			"finally"
		].indexOf(t) >= 0 && F(e, t) != null && F(e, t) != e) return typeof F(e, t) == "function" ? y(e, F(e, t)) : F(e, t);
		let r = P.get(e) ?? P.get(F(e, "value") ?? e);
		return Sr(e, t, r) ?? (F(e, t) == null && t != "value" && f(e) && F(e, "value") != null && (typeof F(e, "value") == "object" || typeof F(e, "value") == "function") && F(F(e, "value"), t) != null && (e = F(e, "value") ?? e), Cr(e, t, r) ?? (t == xn ? c.call(this, this) : t == Cn ? xr(r, (t) => {
			let n = yr(e, t.key ?? t.name ?? vr(e) ?? "value"), i = hr(t, "oldValue", () => n == "value" || n == vr(e) ? F(e, j) : void 0), a = hr(t, "value", () => br(e, n));
			return r?.trigger?.(n, a, i, gr(t, "manual"));
		}) : t == Symbol.toPrimitive ? (n) => {
			let r = dr(e, t);
			return F(r, t) ? F(r, t)?.(n) : w(r) ? _(r, n) : w(F(r, "value")) ? _(F(r, "value"), n) : _(F(r, "value") ?? r, n);
		} : t == Symbol.toStringTag ? () => {
			let n = dr(e, t);
			return F(n, t) ? F(n, t)?.() : w(n) ? String(n ?? "") || "" : w(F(n, "value")) ? String(F(n, "value") ?? "") || "" : String(F(n, "value") ?? n ?? "") || "";
		} : t == "toString" ? () => {
			let n = dr(e, t);
			return F(n, t) ? F(n, t)?.() : F(n, Symbol.toStringTag) ? F(n, Symbol.toStringTag)?.() : w(n) ? String(n ?? "") || "" : w(F(n, "value")) ? String(F(n, "value") ?? "") || "" : String(F(n, "value") ?? n ?? "") || "";
		} : t == "valueOf" ? () => {
			let n = dr(e, t);
			return F(n, t) ? F(n, t)?.() : F(n, Symbol.toPrimitive) ? F(n, Symbol.toPrimitive)?.() : w(n) ? n : w(F(n, "value")) ? F(n, "value") : F(n, "value") ?? n;
		} : typeof t == "symbol" && (t in e || F(e, t) != null) ? F(e, t) : dr(e, t)));
	}
	apply(e, t, n) {
		return Reflect.apply(e, t, n);
	}
	ownKeys(e) {
		return Reflect.ownKeys(e);
	}
	construct(e, t, n) {
		return Reflect.construct(e, t, n);
	}
	isExtensible(e) {
		return Reflect.isExtensible(e);
	}
	getOwnPropertyDescriptor(e, t) {
		let n;
		try {
			lr?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), lr?.get?.(e)?.has?.(t) && (n = void 0), n = Reflect.getOwnPropertyDescriptor(e, t);
		} catch {
			n = void 0;
		} finally {
			lr?.get?.(e)?.delete?.(t);
		}
		return n;
	}
	has(e, t) {
		return t in e;
	}
	set(e, t, n) {
		return cr(e, t) ?? m(n, (r) => {
			let i = cr(r, t);
			if (i != null) return i;
			if (t == N && n) return this[N] = !!n, !0;
			if (t == N && !n) return delete this[N], !0;
			let a = e;
			if (F(e, t) == null && t != "value" && f(e) && F(e, "value") != null && (typeof F(e, "value") == "object" || typeof F(e, "value") == "function") && F(F(e, "value"), t) != null && (e = F(e, "value") ?? e), typeof t == "symbol" && !(F(e, t) != null && t in e)) return;
			let o = yr(e, t), s = t == "value" ? F(e, j) ?? F(e, t) : F(e, t);
			e[t] = r;
			let c = F(e, t) ?? r;
			return !this[N] && typeof t != "symbol" && (F(e, Tn) ?? S)?.(s, c) && (P.get(e) ?? P.get(a))?.trigger?.(o, r, s), !0;
		});
	}
	defineProperty(e, t, n) {
		let r = cr(e, t);
		if (r != null) return r;
		if (t == N && n.value) return this[N] = !!n.value, !0;
		if (t == N && !n.value) return delete this[N], !0;
		if (F(e, t) == null && t != "value" && f(e) && F(e, "value") != null && (typeof F(e, "value") == "object" || typeof F(e, "value") == "function") && F(F(e, "value"), t) != null && (e = F(e, "value") ?? e), n.get == null && n.set == null) return Reflect.defineProperty(e, t, n);
		let i = F(e, t), a = Reflect.defineProperty(e, t, {
			get: n.get,
			set: n.set,
			enumerable: n.enumerable ?? !0,
			configurable: n.configurable ?? !0
		});
		return fr(e, t, i), a;
	}
	deleteProperty(e, t) {
		if (t == N) return delete this[N], !0;
		F(e, t) == null && t != "value" && f(e) && F(e, "value") != null && (typeof F(e, "value") == "object" || typeof F(e, "value") == "function") && F(F(e, "value"), t) != null && (e = F(e, "value") ?? e);
		let n = F(e, t), r = Reflect.deleteProperty(e, t);
		return !this[N] && t != N && typeof t != "symbol" && P.get(e)?.trigger?.(t, null, n, "delete"), r;
	}
}, Or = class {
	[N];
	constructor() {}
	get(e, t, n) {
		if ([
			M,
			_n,
			"@target",
			"deref"
		].indexOf(t) >= 0 && F(e, t) != null && F(e, t) != e) return typeof F(e, t) == "function" ? y(e, F(e, t)) : F(e, t);
		let r = P.get(e), i = Sr(e, t, r);
		if (i != null) return i;
		let a = Cr(e, t, r);
		if (a != null) return a;
		e = F(e, M) ?? F(e, _n) ?? e;
		let o = y(e, F(e, t));
		return typeof t == "symbol" && (t in e || F(e, t) != null) ? o : t == xn ? c.call(this, this) : t == Cn ? xr(r, (t) => {
			let n = t.key ?? t.name;
			if (n == null) return;
			let i = hr(t, "value", () => e.get(n));
			if (i == null && !pr(t, "value")) return;
			let a = hr(t, "oldValue", () => void 0);
			return r?.trigger?.(n, i, a, gr(t, "manual"));
		}) : t == "clear" ? () => {
			let t = Array.from(e?.entries?.() || []), n = o();
			return t.forEach(([t, n]) => {
				this[N] || P.get(e)?.trigger?.(t, null, n, "delete");
			}), n;
		} : t == "delete" ? (t, n = null) => {
			let r = e.has(t), i = e.get(t), a = o(t);
			return !this[N] && r && P.get(e)?.trigger?.(t, null, i, "delete"), a;
		} : t == "set" ? (t, n) => oe(n, (n) => {
			let r = e.has(t), i = e.get(t), a = o(t, n);
			return (!r || S(i, n)) && (this[N] || P.get(e)?.trigger?.(t, n, r ? i : null, r ? "set" : "add")), a;
		}) : o;
	}
	set(e, t, n) {
		return t == N ? (this[N] = !!n, !0) : t == N && !n ? (delete this[N], !0) : Reflect.set(e, t, n);
	}
	has(e, t) {
		return Reflect.has(e, t);
	}
	apply(e, t, n) {
		return Reflect.apply(e, t, n);
	}
	construct(e, t, n) {
		return Reflect.construct(e, t, n);
	}
	ownKeys(e) {
		return Reflect.ownKeys(e);
	}
	isExtensible(e) {
		return Reflect.isExtensible(e);
	}
	getOwnPropertyDescriptor(e, t) {
		let n;
		try {
			lr?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), lr?.get?.(e)?.has?.(t) && (n = void 0), n = Reflect.getOwnPropertyDescriptor(e, t);
		} catch {
			n = void 0;
		} finally {
			lr?.get?.(e)?.delete?.(t);
		}
		return n;
	}
	deleteProperty(e, t) {
		return t == N ? (delete this[N], !0) : Reflect.deleteProperty(e, t);
	}
}, kr = class {
	[N] = !1;
	constructor() {}
	get(e, t, n) {
		if ([
			M,
			_n,
			"@target",
			"deref"
		].indexOf(t) >= 0 && F(e, t) != null && F(e, t) != e) return typeof F(e, t) == "function" ? y(e, F(e, t)) : F(e, t);
		let r = P.get(e), i = Sr(e, t, r);
		if (i != null) return i;
		let a = Cr(e, t, r);
		if (a != null) return a;
		e = F(e, M) ?? F(e, _n) ?? e;
		let o = y(e, F(e, t));
		return typeof t == "symbol" && (t in e || F(e, t) != null) ? o : t == xn ? c.call(this, this) : t == Cn ? xr(r, (t) => {
			let n = t.key ?? t.name;
			if (n == null) return;
			let i = hr(t, "value", () => e.has(n)), a = hr(t, "oldValue", () => void 0);
			return r?.trigger?.(n, i, a, gr(t, "manual"));
		}) : t == "clear" ? () => {
			let t = Array.from(e?.values?.() || []), n = o();
			return t.forEach((t) => {
				this[N] || P.get(e)?.trigger?.(null, null, t, "delete");
			}), n;
		} : t == "delete" ? (t) => {
			let n = e.has(t), r = n ? t : null, i = o(t);
			return !this[N] && n && P.get(e)?.trigger?.(t, null, r, "delete"), i;
		} : t == "add" ? (t) => {
			let n = e.has(t), r = n ? t : null, i = o(t);
			return n || this[N] || P.get(e)?.trigger?.(t, t, r, "add"), i;
		} : o;
	}
	set(e, t, n) {
		return t == N && n ? (this[N] = !!n, !0) : t == N && !n ? (delete this[N], !0) : Reflect.set(e, t, n);
	}
	has(e, t) {
		return Reflect.has(e, t);
	}
	apply(e, t, n) {
		return Reflect.apply(e, t, n);
	}
	construct(e, t, n) {
		return Reflect.construct(e, t, n);
	}
	ownKeys(e) {
		return Reflect.ownKeys(e);
	}
	isExtensible(e) {
		return Reflect.isExtensible(e);
	}
	getOwnPropertyDescriptor(e, t) {
		let n;
		try {
			lr?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), lr?.get?.(e)?.has?.(t) && (n = void 0), n = Reflect.getOwnPropertyDescriptor(e, t);
		} catch {
			n = void 0;
		} finally {
			lr?.get?.(e)?.delete?.(t);
		}
		return n;
	}
	deleteProperty(e, t) {
		return t == N ? (delete this[N], !0) : Reflect.deleteProperty(e, t);
	}
}, Ar = (e) => !!((typeof e == "object" || typeof e == "function") && e != null && (e?.[M] || e?.[wn])), jr = (e) => Ar(e) ? e : Gn(e, new Er()), Mr = (e) => Ar(e) ? e : Gn(e, new Dr()), Nr = (e) => Ar(e) ? e : Gn(e, new Or()), Pr = (e) => Ar(e) ? e : Gn(e, new kr()), Fr = (e, t) => {
	let n = e instanceof Promise || typeof e?.then == "function", r = Ur({
		[bn]: n ? e : null,
		[j]: n ? 0 : Number(An(e) || 0) || 0,
		[yn]: t,
		[Symbol?.toStringTag]() {
			return String(this?.[j] ?? "") || "";
		},
		[Symbol?.toPrimitive](e) {
			return _((typeof this?.[j] == "object" ? this?.[j]?.value || 0 : this?.[j]) ?? 0, e);
		},
		set value(e) {
			this[j] = (e != null && !Number.isNaN(e) ? Number(e) : this[j]) || 0;
		},
		get value() {
			return Number(this[j] || 0) || 0;
		}
	});
	return e?.then?.((e) => r.value = e), r;
}, Ir = (e, t) => {
	let n = e instanceof Promise || typeof e?.then == "function", r = Ur({
		[bn]: n ? e : null,
		[j]: (n ? "" : String(An(typeof e == "number" ? String(e) : e || ""))) ?? "",
		[yn]: t,
		[Symbol?.toStringTag]() {
			return String(this?.[j] ?? "") ?? "";
		},
		[Symbol?.toPrimitive](e) {
			return _(this?.[j] ?? "", e);
		},
		set value(e) {
			this[j] = String(typeof e == "number" ? String(e) : e || "") ?? "";
		},
		get value() {
			return String(this[j] ?? "") ?? "";
		}
	});
	return e?.then?.((e) => r.value = e), r;
}, Lr = (e, t) => {
	let n = e instanceof Promise || typeof e?.then == "function", r = Ur({
		[bn]: n ? e : null,
		[j]: (n ? !1 : (An(e) == null ? !1 : typeof An(e) == "string" || !!An(e)) || !1) || !1,
		[yn]: t,
		[Symbol?.toStringTag]() {
			return String(this?.[j] ?? "") || "";
		},
		[Symbol?.toPrimitive](e) {
			return _(!!this?.[j] || !1, e);
		},
		set value(e) {
			this[j] = (e == null ? this[j] : typeof e == "string" || !!e) || !1;
		},
		get value() {
			return this[j] || !1;
		}
	});
	return e?.then?.((e) => r.value = e), r;
}, Rr = (e, t) => {
	let n = e instanceof Promise || typeof e?.then == "function", r = Ur({
		[bn]: n ? e : null,
		[yn]: t,
		[Symbol?.toStringTag]() {
			return String(this.value ?? "") || "";
		},
		[Symbol?.toPrimitive](e) {
			return _(this.value, e);
		},
		value: n ? null : An(e)
	});
	return e?.then?.((e) => r.value = e), I(e, (e) => {
		r?.[Cn]?.();
	}), r;
}, zr = (e, t) => {
	if (e == null || typeof e != "object" && typeof e != "function") return e;
	try {
		Object.defineProperty(e, En, {
			value: t,
			writable: !0,
			configurable: !0
		});
	} catch {
		try {
			e[En] = t;
		} catch {}
	}
	try {
		Object.defineProperty(e, "realProp", {
			value: t,
			writable: !0,
			configurable: !0
		});
	} catch {
		try {
			e.realProp = t;
		} catch {}
	}
	return e;
}, Br = (e, t = "value", n, r) => {
	if (w(e) || !e) return e;
	Array.isArray(e) && e.length == 2 && e[0] != null && (e[0] instanceof Map || e[0] instanceof WeakMap || e[0] instanceof Set || e[0] instanceof WeakSet) ? ((t == null || t === "value") && (t = e[1]), e = e[0]) : Array.isArray(e) && !E(e?.[1], e) && (Array.isArray(e?.[0]) || typeof e?.[0] == "object" || typeof e?.[0] == "function") && (e = e?.[0]);
	let i = e instanceof Map || e instanceof WeakMap, a = e instanceof Set || e instanceof WeakSet;
	if (i || a) {
		if (t == null) return;
	} else if ((t ??= Array.isArray(e) ? null : "value") == null || E(t, e)) return;
	let o = () => i ? e.get(t) : a ? e.has(t) : e?.[t], s = (n) => i ? (e.set(t, n), n) : a ? (n ? e.add(t) : e.delete(t), e.has(t)) : e[t] = n;
	i && n !== void 0 && !e.has(t) ? e.set(t, n) : a && n && !e.has(t) && e.add(t);
	let c = o();
	if (!a && t != null && f(c) && Wr(c)) return zr(Gr(c), t);
	if (!i && !a && t && typeof e?.getProperty == "function" && Wr(e?.getProperty?.(t))) return zr(e?.getProperty?.(t), t);
	!i && !a && (e[t] ??= n ?? e[t]);
	let l = Ur({
		[j]: a ? !!o() : o() ?? n,
		[yn]: r,
		[Symbol?.toStringTag]() {
			return String(o() ?? this[j] ?? "") || "";
		},
		[Symbol?.toPrimitive](e) {
			return _(o(), e);
		},
		set value(e) {
			if (l[ie] = !0, a) this[j] = s(e);
			else {
				let t = e ?? O(o());
				this[j] = s(t);
			}
			l[ie] = !1;
		},
		get value() {
			let e = o();
			return this[j] = a ? !!e : e ?? this[j];
		}
	});
	zr(l, t);
	let u = I(e, (e, n, r, i) => {
		if (n === t) {
			let n = a ? e != null : e, o = a ? r != null : r;
			l?.[Cn]?.({
				key: t,
				value: n,
				oldValue: o,
				trigger: i
			});
		}
	});
	return Fn(l, Symbol.dispose, u), l;
}, Vr = (e, t) => {
	switch (typeof e) {
		case "boolean": return Lr(e, t);
		case "number": return Fr(e, t);
		case "string": return Ir(e, t);
		case "object": if (e != null) return Rr(Ur(e), t);
		default: return Rr(e, t);
	}
}, Hr = (e, t = "value", n) => {
	let r = Wr(e) ? e : Vr(e, n);
	return t == null ? r : Br(r, t, n);
};
function Ur(e, t) {
	if (e == null || typeof e == "symbol" || typeof e != "object" && typeof e != "function" || Ar(e) || (e = An?.(e)) == null || e instanceof Promise || e instanceof WeakRef || Ar(e)) return e;
	let n = e;
	if (n == null || typeof n == "symbol" || typeof n != "object" && typeof n != "function" || n instanceof Promise || n instanceof WeakRef) return n;
	let r = n;
	return Array.isArray(n) ? (r = jr(n), r) : n instanceof Map ? (r = Nr(n), r) : n instanceof Set ? (r = Pr(n), r) : ((typeof n == "function" || typeof n == "object") && (r = Mr(n)), r);
}
var Wr = (e) => typeof HTMLInputElement < "u" && e instanceof HTMLInputElement || !!((typeof e == "object" || typeof e == "function") && e != null && (e?.[M] || e?.[wn] || P?.has?.(e))), Gr = (e) => Wr(e) ? Ur(e) : null, Kr = /* @__PURE__ */ new WeakMap(), qr = (e) => {
	if (!(typeof e == "symbol" || e == null || typeof e != "object" && typeof e != "function")) return e;
}, Jr = "initial", Yr = (e) => {
	let t = e?.[En] ?? e?.realProp;
	return C(t) ? t : null;
}, Xr = (e, t) => {
	let n = Yr(e);
	return n != null && (t == null || t == "value") ? n : t;
}, Zr = (e, t) => t != null && t == Yr(e) ? e?.value : e?.[t], Qr = (e, t, n, r) => {
	if (t != null && t == Yr(e)) {
		let r = Zr(e, t);
		if (r != null) return n?.(r, t, null, "set");
	}
	return b(e, t, n, r);
}, $r = (e, t, n) => {
	let r = rr(t);
	if (n == Jr) {
		if (!r.triggerImmediately) return;
	} else if (!tr(r.affectTypes, n)) return;
	return (t, r, i, ...a) => e?.(t, r, i, n, ...a);
}, ei = (e, t, n, r = ["*"]) => {
	if (!e || !qr(e)) return;
	let i = t == Symbol.iterator ? null : Xr(e, t), a = e?.[vn] ?? P.get(e);
	e = e?.[M] ?? e, queueMicrotask(() => {
		let t = $r(n, r, Jr);
		t && (i != null && i != Symbol.iterator ? Qr(e, i, t, null) : re(e, t, null));
	});
	let o = a?.affected?.(n, i, r);
	return e?.[Symbol.dispose] ? o : (Fn(o, Symbol.dispose, o), Fn(o, Symbol.asyncDispose, o), Fn(e, Symbol.dispose, o), Fn(e, Symbol.asyncDispose, o), o);
}, ti = (e, t, n, r = ["*"]) => {
	let i = rr(r).affectTypes, a = {}, o = e?.value, s = (e) => {
		let t = e?.target?.value;
		tr(i, "set") && n?.(t, "value", o, "set", e), o = t;
	};
	return e?.addEventListener?.("change", s, a), () => e?.removeEventListener?.("change", s, a);
}, ni = (e) => Array.isArray(e) && e?.length == 2 && qr(e?.[0]) && (C(e?.[1]) || e?.[1] == Symbol.iterator), ri = (e, t, n, r = ["*"]) => {
	let i = C(e?.[1]) ? e?.[1] : null;
	return I(e?.[0], i, n, r);
}, ii = (e, t, n, r = ["*"]) => e?.then?.((e) => I?.(e, t, n, r))?.catch?.((e) => (console.warn(e), null)), I = (e, t, n = () => {}, r) => {
	if (typeof t == "function" ? (r = n, n = t, t = null) : t = Xr(e, t), (typeof n == "object" || Array.isArray(n)) && (r = n, n = () => {}), (w(e) || typeof e == "symbol") && rr(r).triggerImmediately) return ne(globalThis?.Promise?.try?.(() => n?.(e, null, null, null, Jr)));
	if (typeof e?.[wn] == "function") return e?.[wn]?.(n, t, r);
	if (qr(e)) {
		let i = e;
		if (Kr?.has?.(e = e?.[M] ?? e)) return Kr?.get?.(e)?.(i, t, n, r);
		if (Wr(i) || ni(e) && Wr(e?.[0])) return jn(e) ? Kr?.getOrInsert?.(e, ii)?.(e, t, n, r) : ni(e) ? Kr?.getOrInsert?.(e, ri)?.(e, t, n, r) : typeof HTMLInputElement < "u" && e instanceof HTMLInputElement ? Kr?.getOrInsert?.(e, ti)?.(e, t, n, r) : Kr?.getOrInsert?.(e, ei)?.(i, t, n, r);
		{
			let i = $r(n, r, Jr);
			return i ? ne(globalThis?.Promise?.try?.(() => ni(e) ? Qr?.(e?.[0], e?.[1], i, null) : t != null && t != Symbol.iterator ? Qr?.(e, t, i, null) : re?.(e, i, null))) : void 0;
		}
	}
}, ai = class {
	#e = /* @__PURE__ */ new WeakMap();
	#t(e) {
		if (e == null || typeof e != "object" && typeof e != "function") return null;
		let t = this.#e.get(e);
		return t || (t = /* @__PURE__ */ new WeakMap(), this.#e.set(e, t)), t;
	}
	#n(e) {
		return !Array.isArray(e) || e.length !== 2 ? [null, null] : e;
	}
	hasL1(e) {
		return this.#e.has(e);
	}
	set(e, t) {
		let [n, r] = this.#n(e), i = this.#t(n);
		return !i || r == null || typeof r != "object" && typeof r != "function" || i.set(r, t), this;
	}
	get(e) {
		let [t, n] = this.#n(e);
		if (!(t == null || typeof t != "object" && typeof t != "function")) return this.#e.get(t)?.get(n);
	}
	has(e) {
		let [t, n] = this.#n(e);
		return t == null || typeof t != "object" && typeof t != "function" ? !1 : this.#e.get(t)?.has(n) ?? !1;
	}
	delete(e) {
		let [t, n] = this.#n(e);
		if (t == null || typeof t != "object" && typeof t != "function") return !1;
		let r = this.#e.get(t);
		return r ? r.delete(n) : !1;
	}
	deleteTop(e) {
		return e == null || typeof e != "object" && typeof e != "function" ? !1 : this.#e.delete(e);
	}
	getOrCreate(e, t) {
		let [n, r] = this.#n(e), i = this.#t(n);
		if (!i || r == null || typeof r != "object" && typeof r != "function") return t?.();
		if (i.has(r)) return i.get(r);
		let a = t();
		return i.set(r, a), a;
	}
	getOrInsert(e, t) {
		let [n, r] = this.#n(e), i = this.#t(n);
		return !i || r == null || typeof r != "object" && typeof r != "function" ? t : i.has(r) ? i.get(r) : (i.set(r, t), t);
	}
	getOrInsertComputed(e, t) {
		let [n, r] = this.#n(e), i = this.#t(n);
		if (!i || r == null || typeof r != "object" && typeof r != "function") return t?.([n, r]);
		if (i.has(r)) return i.get(r);
		let a = t([n, r]);
		return i.set(r, a), a;
	}
}, oi = new ai();
function si(e, t, n = ["*"]) {
	if (!e || typeof e != "object" && typeof e != "function") return;
	if (oi.has([e, t])) return oi.get([e, t]);
	let r = (r, i, a, o) => {
		if (i == "value") {
			let i = (a?.value ?? a)?.entries?.(), o = e?.value ?? r?.value ?? r;
			if (i) for (let [e, n] of i) {
				let r = n ?? (a?.value ?? a)?.[e] ?? null, i = o?.[e];
				r == null && i != null ? t(i, e, null, "add") : r != null && i == null ? t(null, e, r, "delete") : S(r, i) && t(i, e, r, "set");
			}
			return si(r ?? e?.value, t, n);
		}
		return i == null ? void 0 : e[i];
	};
	return oi.getOrInsertComputed([e, t], () => e instanceof Set ? I([li(e), Symbol.iterator], t, n) : e instanceof Map ? I(e, t, n) : f(e) ? I(e, r, n) : Array.isArray(e) && !(e?.length == 2 && C(e?.[1]) && Wr(e?.[0])) ? I([e, Symbol.iterator], t, n) : I(e, t, n));
}
function ci(e, t) {
	return Mn(e, (e) => {
		let n = Array.isArray(e) && e?.length == 2 && ["object", "function"].indexOf(typeof e?.[0]) >= 0 && C(e?.[1]), r = n ? e?.[1] : null;
		e = n && r != null ? e?.[0] ?? e : e;
		let i = typeof e == "object" || typeof e == "function" ? e?.[M] ?? e : e;
		(e?.[vn] ?? P.get(i))?.unaffected?.(t, r);
	});
}
//#endregion
//#region ../../projects/object.ts/src/core/Assigned.ts
var li = (e) => {
	let t = Ur([]);
	return t.push(...Array.from(e?.values?.() || [])), Fn(t, Symbol.dispose, I(e, (e, n, r) => {
		if (S(e, r)) {
			if (r == null && e != null) t.push(e);
			else if (r != null && e == null) {
				let e = t.indexOf(r);
				e >= 0 && t.splice(e, 1);
			} else {
				let n = t.indexOf(r);
				n >= 0 && S(t[n], e) && (t[n] = e);
			}
		}
	})), t;
}, ui = Symbol.for("dom.ts@__registeredCssProperties"), di = globalThis[ui] ??= /* @__PURE__ */ new Set();
[
	{
		name: "--screen-width",
		syntax: "<length-percentage>",
		inherits: !0,
		initialValue: "0px"
	},
	{
		name: "--screen-height",
		syntax: "<length-percentage>",
		inherits: !0,
		initialValue: "0px"
	},
	{
		name: "--visual-width",
		syntax: "<length-percentage>",
		inherits: !0,
		initialValue: "0px"
	},
	{
		name: "--visual-height",
		syntax: "<length-percentage>",
		inherits: !0,
		initialValue: "0px"
	},
	{
		name: "--clip-ampl",
		syntax: "<number>",
		inherits: !0,
		initialValue: "0"
	},
	{
		name: "--clip-freq",
		syntax: "<number>",
		inherits: !0,
		initialValue: "0"
	},
	{
		name: "--avail-width",
		syntax: "<length-percentage>",
		inherits: !0,
		initialValue: "0px"
	},
	{
		name: "--avail-height",
		syntax: "<length-percentage>",
		inherits: !0,
		initialValue: "0px"
	},
	{
		name: "--pixel-ratio",
		syntax: "<number>",
		inherits: !0,
		initialValue: "1"
	},
	{
		name: "--percent",
		syntax: "<number>",
		inherits: !0,
		initialValue: "0"
	},
	{
		name: "--percent-x",
		syntax: "<number>",
		inherits: !0,
		initialValue: "0"
	},
	{
		name: "--percent-y",
		syntax: "<number>",
		inherits: !0,
		initialValue: "0"
	},
	{
		name: "--scroll-left",
		syntax: "<number>",
		inherits: !0,
		initialValue: "0"
	},
	{
		name: "--scroll-top",
		syntax: "<number>",
		inherits: !0,
		initialValue: "0"
	},
	{
		name: "--drag-x",
		syntax: "<length>",
		inherits: !1,
		initialValue: "0px"
	},
	{
		name: "--drag-y",
		syntax: "<length>",
		inherits: !1,
		initialValue: "0px"
	},
	{
		name: "--grid-r",
		syntax: "<number>",
		inherits: !1,
		initialValue: "0"
	},
	{
		name: "--grid-c",
		syntax: "<number>",
		inherits: !1,
		initialValue: "0"
	},
	{
		name: "--resize-x",
		syntax: "<length>",
		inherits: !1,
		initialValue: "0px"
	},
	{
		name: "--resize-y",
		syntax: "<length>",
		inherits: !1,
		initialValue: "0px"
	},
	{
		name: "--shift-x",
		syntax: "<length>",
		inherits: !1,
		initialValue: "0px"
	},
	{
		name: "--shift-y",
		syntax: "<length>",
		inherits: !1,
		initialValue: "0px"
	},
	{
		name: "--cs-grid-r",
		syntax: "<number>",
		inherits: !1,
		initialValue: "0"
	},
	{
		name: "--cs-grid-c",
		syntax: "<number>",
		inherits: !1,
		initialValue: "0"
	},
	{
		name: "--cs-p-grid-r",
		syntax: "<number>",
		inherits: !1,
		initialValue: "0"
	},
	{
		name: "--cs-p-grid-c",
		syntax: "<number>",
		inherits: !1,
		initialValue: "0"
	},
	{
		name: "--os-grid-r",
		syntax: "<number>",
		inherits: !1,
		initialValue: "0"
	},
	{
		name: "--os-grid-c",
		syntax: "<number>",
		inherits: !1,
		initialValue: "0"
	},
	{
		name: "--rv-grid-r",
		syntax: "<number>",
		inherits: !1,
		initialValue: "0"
	},
	{
		name: "--rv-grid-c",
		syntax: "<number>",
		inherits: !1,
		initialValue: "0"
	},
	{
		name: "--cell-x",
		syntax: "<integer>",
		inherits: !1,
		initialValue: "0"
	},
	{
		name: "--cell-y",
		syntax: "<integer>",
		inherits: !1,
		initialValue: "0"
	}
].forEach((e) => {
	if (typeof CSS > "u" || typeof CSS?.registerProperty != "function") return;
	let t = String(e?.name || "").trim();
	if (!(!t || di.has(t))) try {
		CSS.registerProperty(e);
	} catch (e) {
		String(e?.name || "").toLowerCase() !== "invalidmodificationerror" && console.warn(e);
	} finally {
		di.add(t);
	}
});
//#endregion
//#region ../../projects/dom.ts/src/agate/Utils.ts
var fi = () => ({
	didTimeout: !1,
	timeRemaining: () => 0
}), pi = (e, t = 1e3) => typeof globalThis.requestIdleCallback == "function" ? globalThis.requestIdleCallback(e, { timeout: t }) : setTimeout(() => e(fi()), 0), mi = () => {
	let e = {
		canceled: !1,
		rAFs: /* @__PURE__ */ new Set(),
		last: null,
		cancel() {
			return this.canceled = !0, cancelAnimationFrame(this.last), this;
		},
		shedule(e) {
			return this.rAFs.add(e), this;
		}
	};
	return (async () => {
		for (; !e?.canceled;) await Promise.all((e?.rAFs?.values?.() ?? [])?.map?.((e) => Promise.try(e)?.catch?.(console.warn.bind(console)))), e.rAFs?.clear?.(), typeof requestAnimationFrame < "u" ? await new Promise((t) => {
			e.last = requestAnimationFrame(t);
		}) : await new Promise((e) => {
			setTimeout(e, 16);
		});
	})(), e;
};
typeof document < "u" && document?.documentElement;
var hi = (e, t = {}) => {
	if (!(!t || typeof t != "object" || !e)) return Array.from(Object.entries(t)).map(([t, n]) => {
		let r = e.getAttribute(t);
		n == null ? e.removeAttribute(t) : n != r && e.setAttribute(t, r == "" ? n ?? r : r ?? n);
	});
}, gi = /* @__PURE__ */ new Map(), _i = (e, t = 1e3, ...n) => {
	let r = {
		running: !0,
		cancel: () => {
			r.running = !1;
		}
	};
	return pi(async () => {
		if (!(!e || typeof e != "function")) {
			for (; r.running;) await Promise.all([Promise.try(e, ...n), new Promise((e) => setTimeout(e, t))]).catch?.(console.warn.bind(console)), await Promise.any([new Promise((e) => pi(e, t)), new Promise((e) => setTimeout(e, t))]);
			r.cancel = () => {};
		}
	}, t), r?.cancel;
};
typeof requestAnimationFrame < "u" && requestAnimationFrame(async () => {
	for (;;) gi.forEach((e) => e?.()), await new Promise((e) => requestAnimationFrame(e));
});
var vi = (e, t, n) => {
	t != null && e.checked != t && (e?.type == "checkbox" || e?.type == "radio" && !e?.checked ? (e?.click?.(), n?.preventDefault?.()) : (e.checked = !!t, e?.dispatchEvent?.(new Event("change", {
		bubbles: !0,
		cancelable: !0
	}))));
}, L = (e) => e != null && e instanceof HTMLElement && !(e instanceof DocumentFragment || e instanceof HTMLBodyElement) ? e : null, yi = (e, t) => e == null || t == null ? -1 : Array.from(e?.childNodes ?? [])?.indexOf?.(t) ?? -1, bi = (e) => {
	if (e == ":fragment:") return document.createDocumentFragment();
	let t = document.createElement.bind(document);
	for (var n = t("div"), r, i = ""; e && (r = e.match("^(?:(-?[_a-zA-Z]+[_a-zA-Z0-9-]*))|^#(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)|^\\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)|^\\[(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)(?:([*$|~^]?=)([\"'])((?:(?=(\\\\?))\\8.)*?)\\6)?\\]"));) r[1] && (n = t(r[1])), r[2] && (n.id = r[2]), r[3] && (i += " " + r[3]), r[4] && n.setAttribute(r[4], r[7] || ""), e = e.slice(r[0].length);
	return i && (n.className = i.slice(1)), n;
}, R = (e) => e != null && (e instanceof Node || e instanceof Text || e instanceof Element || e instanceof Comment || e instanceof HTMLElement || e instanceof DocumentFragment) ? e : null, xi = {};
function z(e, t, n, r = xi) {
	e?.addEventListener?.(t, n, r);
	let i = typeof e == "object" || typeof e == "function" && !e?.deref ? new WeakRef(e) : e;
	return () => i?.deref?.()?.removeEventListener?.(t, n, r);
}
var Si = (e, t, n) => {
	if (t == null || !(t instanceof Node) && t?.element == null) return !1;
	if (e == t || (e?.element ?? e) == (t?.element ?? t)) return !0;
	if (n?.composedPath && typeof n.composedPath == "function") {
		let r = n.composedPath(), i = e?.element ?? e, a = t?.element ?? t;
		if (r.includes(i) && r.includes(a)) {
			let e = r.indexOf(i), t = r.indexOf(a);
			if (t >= 0 && e >= 0 && t < e) return !0;
		}
	}
	return !!(e?.contains?.(t?.element ?? t) || e?.getRootNode({ composed: !0 })?.host == (t?.element ?? t));
}, Ci = (e, t, n) => {
	let r = typeof t == "string" ? t.trim() : "";
	if (!r) return e ?? null;
	if (n?.composedPath && typeof n.composedPath == "function") {
		let e = n.composedPath();
		for (let t of e) if (t instanceof HTMLElement || t instanceof Element) try {
			if (t.matches?.(r)) return t;
		} catch {}
	}
	let i = null, a = null, o = null;
	try {
		i = e?.matches?.(r) ? e : null;
		let t = (e?.getRootNode({ composed: !0 }) ?? e?.parentElement?.getRootNode({ composed: !0 }))?.host;
		a = t?.matches?.(r) ? t : null, o = e?.closest?.(r) ?? i?.closest?.(r) ?? a?.closest?.(r) ?? null;
	} catch {}
	return i ?? o ?? a;
}, wi = Symbol.for("dom.ts@zoomValues"), Ti = globalThis[wi] ??= /* @__PURE__ */ new WeakMap(), Ei = (e = document.documentElement) => Ti.getOrInsertComputed(e, () => {
	let t = (e?.matches?.(".ui-orientbox") ? e : null) || e?.closest?.(".ui-orientbox") || document.body;
	if (t?.zoom) return t?.zoom || 1;
	if (e?.currentCSSZoom) return e?.currentCSSZoom || 1;
}), Di = (e = document.documentElement) => (e?.currentCSSZoom == null ? Ei(e) : 1) || 1, Oi = 80, ki = () => {
	try {
		return globalThis.navigator?.virtualKeyboard ?? null;
	} catch {
		return null;
	}
}, Ai = () => {
	let e = ki();
	if (e) try {
		e.overlaysContent !== !0 && (e.overlaysContent = !0);
	} catch {}
}, ji = (e) => {
	if (!e || !(e instanceof HTMLElement)) return !1;
	if (e.isContentEditable) return !0;
	let t = e.tagName;
	if (t === "TEXTAREA" || t === "SELECT") return !0;
	if (t !== "INPUT") return !1;
	let n = String(e.type || "text").toLowerCase();
	return ![
		"button",
		"checkbox",
		"radio",
		"file",
		"submit",
		"reset",
		"image",
		"range",
		"color",
		"hidden"
	].includes(n);
}, Mi = "", Ni = 0, Pi = 0, Fi = () => {
	if (typeof window > "u") return {
		width: 0,
		height: 0,
		keyboard: 0
	};
	let e = window.visualViewport, t = Number(window.innerWidth) || 0, n = Number(window.innerHeight) || 0, r = Number(e?.width) || 0, i = Number(e?.height) || 0, a = Number(e?.offsetTop) || 0, o = Number(ki()?.boundingBox?.height) || 0, s = n > 0 && i > 0 ? n - i - a : 0, c = o >= Oi ? o : s >= Oi ? s : 0, l = Math.max(t, r), u = Math.max(n, i + a, c > 0 ? i + c : 0), d = typeof matchMedia < "u" && matchMedia("(orientation: landscape)")?.matches ? "l" : "p";
	d !== Mi && (Mi = d, Ni = 0, Pi = 0);
	let f = Pi > 0 && Pi - u >= Oi;
	return c > 0 || ji(document.activeElement) || f ? (Ni = Math.max(l, Ni), Pi = Math.max(u, Pi)) : (Ni = l, Pi = u), {
		width: Ni || l,
		height: Pi || u,
		keyboard: c
	};
};
(() => {
	Ai();
	let e = typeof matchMedia < "u" && matchMedia("(orientation: landscape)")?.matches, t = typeof window < "u" ? window.visualViewport : null, n = Fi(), r = {
		"--vv-width": `${t?.width ?? (typeof window < "u" ? window.innerWidth : 0)}px`,
		"--vv-height": `${t?.height ?? (typeof window < "u" ? window.innerHeight : 0)}px`,
		"--vv-offset-left": `${t?.offsetLeft ?? 0}px`,
		"--vv-offset-top": `${t?.offsetTop ?? 0}px`,
		"--vv-scale": String(t?.scale ?? 1),
		"--lv-width": `${n.width}px`,
		"--lv-height": `${n.height}px`,
		"--keyboard-overlay-height": `${n.keyboard}px`
	};
	if (typeof document < "u" && document.documentElement.toggleAttribute("data-vk-open", n.keyboard > 0), typeof screen < "u") {
		let t = screen?.availWidth + "px", i = screen?.availHeight + "px";
		return {
			"--screen-width": Math.min(screen?.width, screen?.availWidth) + "px",
			"--screen-height": Math.min(screen?.height, screen?.availHeight) + "px",
			"--avail-width": e ? i : t,
			"--avail-height": e ? t : i,
			"--view-height": `${n.height || Math.min(screen?.availHeight, window?.innerHeight) || 0}px`,
			"--pixel-ratio": String(devicePixelRatio || 1),
			...r
		};
	}
	return {
		"--screen-width": "0px",
		"--screen-height": "0px",
		"--avail-width": "0px",
		"--avail-height": "0px",
		"--view-height": `${n.height}px`,
		"--pixel-ratio": "1",
		...r
	};
})(), new OffscreenCanvas(1, 1).getContext("2d");
//#endregion
//#region ../../projects/dom.ts/src/mixin/Observer.ts
var Ii = Symbol.for("dom.ts@onBorderObserve");
globalThis[Ii] ??= /* @__PURE__ */ new WeakMap();
var Li = Symbol.for("dom.ts@onContentObserve");
globalThis[Li] ??= /* @__PURE__ */ new WeakMap();
var Ri = (e) => (typeof e?.current == "object" && (e = e?.element ?? e?.current ?? (typeof e?.self == "object" ? e?.self : null) ?? e), e), zi = (e, t = "*") => typeof e == "string" && e.trim() || t, Bi = (e, t) => {
	if (!e || typeof e.querySelectorAll != "function") return [];
	let n = zi(t, "");
	if (!n) return [];
	try {
		return Array.from(e.querySelectorAll(n) || []);
	} catch {
		return [];
	}
}, Vi = (e, t) => {
	if (!e || typeof e.matches != "function") return !1;
	let n = zi(t, "");
	if (!n) return !1;
	try {
		return !!e.matches(n);
	} catch {
		return !1;
	}
}, Hi = (e, t, n) => {
	if (typeof e?.selector == "string") return Ui(e, e?.selector, t, n);
	let r = new Set((t.split(",") || [t]).map((e) => e.trim())), i = new MutationObserver((e, t) => {
		for (let i of e) i.attributeName && r.has(i.attributeName) && n(i, t);
	});
	return (e?.element ?? e) instanceof Node && i.observe(e = Ri(e), {
		attributes: !0,
		attributeOldValue: !0,
		attributeFilter: [...r]
	}), r.forEach((t) => n({
		target: e,
		type: "attributes",
		attributeName: t,
		oldValue: e?.getAttribute?.(t)
	}, i)), i;
}, Ui = (e, t, n, r) => {
	let i = zi(t), a = new Set([...n.split(",") || [n]].map((e) => e.trim())), o = new MutationObserver((e, t) => {
		for (let n of e) if (n.type == "childList") {
			let e = Array.from(n.addedNodes) || [], o = Array.from(n.removedNodes) || [];
			e.push(...Array.from(n.addedNodes || []).flatMap((e) => Bi(e, i))), o.push(...Array.from(n.removedNodes || []).flatMap((e) => Bi(e, i))), [...new Set(e)].filter((e) => Vi(e, i))?.map?.((e) => {
				a.forEach((n) => {
					r({
						target: e,
						type: "attributes",
						attributeName: n,
						oldValue: e?.getAttribute?.(n)
					}, t);
				});
			});
		} else Vi(n.target, i) && n.attributeName && a.has(n.attributeName) && r(n, t);
	});
	return o.observe(e = Ri(e), {
		attributeOldValue: !0,
		attributes: !0,
		attributeFilter: [...a],
		childList: !0,
		subtree: !0,
		characterData: !0
	}), Bi(e, i).map((e) => a.forEach((t) => r({
		target: e,
		type: "attributes",
		attributeName: t,
		oldValue: e?.getAttribute?.(t)
	}, o))), o;
}, Wi = (e, t = "*", n = (e, t) => {}) => {
	let r = zi(t), i = (e) => {
		let t = Array.from(e || []) || [];
		return t.push(...Array.from(e || []).flatMap((e) => Bi(e, r))), [...Array.from(new Set(t).values())].filter((e) => Vi(e, r));
	}, a = null, o = (e) => {
		let t = a?.deref?.(), r = i(e.addedNodes), o = i(e.removedNodes);
		(r.length > 0 || o.length > 0) && n?.({
			type: e.type,
			target: e.target,
			attributeName: e.attributeName,
			attributeNamespace: e.attributeNamespace,
			nextSibling: e.nextSibling,
			oldValue: e.oldValue,
			previousSibling: e.previousSibling,
			addedNodes: r,
			removedNodes: o
		}, t);
	}, s = (e) => {
		o({
			addedNodes: [e?.target].filter((e) => !!e),
			removedNodes: [e?.relatedTarget].filter((e) => !!e),
			type: "childList",
			target: e?.currentTarget
		});
	}, c = (e) => {
		o({
			addedNodes: [e?.relatedTarget].filter((e) => !!e),
			removedNodes: [e?.target].filter((e) => !!e),
			type: "childList",
			target: e?.currentTarget
		});
	}, l = (e) => {
		o({
			addedNodes: [e?.target].filter((e) => !!e),
			removedNodes: [e?.relatedTarget || document?.activeElement].filter((e) => !!e),
			type: "childList",
			target: e?.currentTarget
		});
	}, u = {
		passive: !0,
		capture: !1
	};
	if (r?.includes?.(":hover") && r?.includes?.(":active")) return e.addEventListener("pointerover", s, u), e.addEventListener("pointerout", c, u), e.addEventListener("pointerdown", s, u), e.addEventListener("pointerup", c, u), e.addEventListener("pointercancel", c, u), { disconnect: () => {
		e.removeEventListener("pointerover", s, u), e.removeEventListener("pointerout", c, u), e.removeEventListener("pointerdown", s, u), e.removeEventListener("pointerup", c, u), e.removeEventListener("pointercancel", c, u);
	} };
	if (r?.includes?.(":hover")) return e.addEventListener("pointerover", s, u), e.addEventListener("pointerout", c, u), { disconnect: () => {
		e.removeEventListener("pointerover", s, u), e.removeEventListener("pointerout", c, u);
	} };
	if (r?.includes?.(":active")) return e.addEventListener("pointerdown", s, u), e.addEventListener("pointerup", c, u), e.addEventListener("pointercancel", c, u), { disconnect: () => {
		e.removeEventListener("pointerdown", s, u), e.removeEventListener("pointerup", c, u), e.removeEventListener("pointercancel", c, u);
	} };
	if (r?.includes?.(":focus") && r?.includes?.(":focus-within") && r?.includes?.(":focus-visible")) return e.addEventListener("focusin", s, u), e.addEventListener("focusout", c, u), e.addEventListener("click", l, u), { disconnect: () => {
		e.removeEventListener("focusin", s, u), e.removeEventListener("focusout", c, u), e.removeEventListener("click", l, u);
	} };
	let d = new MutationObserver((e, t) => {
		for (let t of e) t.type == "childList" && o(t);
	});
	a = new WeakRef(d), (e?.element ?? e) instanceof Node && d.observe(e = Ri(e), {
		childList: !0,
		subtree: !0
	});
	let f = Bi(e, r);
	return f.length > 0 && n?.({
		addedNodes: f,
		removedNodes: []
	}, d), d;
}, Gi = /* @__PURE__ */ new WeakMap(), Ki = (e, t, n) => (new WeakRef(e), t.has(n) || t.add(n), e), qi = (e, t) => {
	if (e) {
		if (t) {
			let n = Gi.getOrInsert(e, /* @__PURE__ */ new Set());
			[...t?.values?.() || []].map((t) => Ki(e, n, t));
		}
		return e;
	}
}, Ji = Symbol.for("dom.ts@namedStoreMaps"), Yi = globalThis[Ji] ??= /* @__PURE__ */ new Map(), Xi = (e, t) => {
	let n = [...e.entries() || []];
	return new Map(n?.map?.(([e, n]) => [e, n?.get?.(t)])?.filter?.(([e, t]) => !!t) || []);
}, Zi = (e) => (typeof e == "object" || typeof e == "function") && e != null, Qi = (e, t, n) => {
	if (!Zi(e) && e != null) return e;
	let r = Yi.get(t);
	return r || (r = /* @__PURE__ */ new WeakMap(), Yi.set(t, r)), !r.has(e) && e != null && r.set(e, n), e;
}, $i = (e, t) => {
	if (!(!e || !t)) {
		for (let [n, r] of t.entries()) Qi(e, n, r);
		return e;
	}
}, ea = (e, t) => {
	if (e) {
		if (t) {
			let n = ia?.get?.(e) ?? /* @__PURE__ */ new WeakSet();
			ia?.has?.(e) || ia?.set?.(e, n), [...t?.values?.() || []].map((t) => na(e, t, n));
		}
		return e;
	}
}, ta = (e) => ({
	storeSet: Xi(Yi, e),
	mixinSet: ia?.get?.(e),
	behaviorSet: Gi?.get?.(e)
}), na = (e, t, n) => {
	let r = new WeakRef(e);
	return n ||= ia?.get?.(e), n?.has?.(t) || (n?.add?.(t), oa?.get?.(t)?.add?.(e), t.name && e?.setAttribute?.("data-mixin", [...e?.getAttribute?.("data-mixin")?.split?.(" ") || [], t.name].filter((e) => !!e).join(" ")), t?.connect?.(r, t, ta(e))), e;
}, ra = Symbol.for("dom.ts@boundMixinSet"), ia = globalThis[ra] ??= /* @__PURE__ */ new WeakMap(), aa = Symbol.for("dom.ts@mixinElements"), oa = globalThis[aa] ??= /* @__PURE__ */ new WeakMap(), sa = Symbol.for("dom.ts@mixinRegistry"), ca = globalThis[sa] ??= /* @__PURE__ */ new Map(), la = Symbol.for("dom.ts@mixinNamespace"), ua = globalThis[la] ??= /* @__PURE__ */ new WeakMap(), da = (e, t) => {
	typeof t == "string" && (t = ca?.get?.(t));
	let n = /* @__PURE__ */ new Set([...e?.getAttribute?.("data-mixin")?.split?.(" ") || []]), r = new Set([...n].map((e) => ca?.get?.(e)).filter((e) => !!e)), i = ia?.get?.(e) ?? /* @__PURE__ */ new WeakSet();
	oa?.has?.(t) || oa?.set?.(t, /* @__PURE__ */ new WeakSet()), ia?.has?.(e) || ia?.set?.(e, i);
	let a = new WeakRef(e);
	i?.has?.(t) || (r.has(t) || t?.disconnect?.(a, t, ta(e)), (r.has(t) || !oa?.get?.(t)?.has?.(e)) && (t?.connect?.(a, t, ta(e)), n.add(ua?.get?.(t)), i?.add?.(t), e?.setAttribute?.("data-mixin", [...n].filter((e) => !!e).join(" "))), oa?.get?.(t)?.add?.(e)), i?.has?.(t) && (r.has(t) || (i?.delete?.(t), t?.disconnect?.(a, t, ta(e))));
}, fa = /* @__PURE__ */ new Set(), pa = (e = typeof document < "u" ? document : null) => {
	if (e) return fa?.has?.(e) || (fa?.add?.(e), Ui(e, "*", "data-mixin", (e) => ma(e.target)), Wi(e, "[data-mixin]", (e) => {
		for (let t of e.addedNodes) t instanceof HTMLElement && ma(t);
	}), Tt(e)), e;
}, ma = (e) => {
	let t = /* @__PURE__ */ new Set([...e?.getAttribute?.("data-mixin")?.split?.(" ") || []]);
	[...new Set([...t].map((e) => ca?.get?.(e)).filter((e) => !!e))].map?.((t) => da(e, t));
}, ha = (e, t) => {
	e.forEach((e) => t ? da(e, t) : ma(e));
}, ga = (e) => {
	for (let t of fa) ha(t?.querySelectorAll?.("[data-mixin]"), e);
}, _a = new FinalizationRegistry((e) => {
	ca?.delete?.(e);
}), va = (e, t) => {
	if (!ua?.has?.(t)) {
		let n = e?.trim?.();
		n && (ua?.set?.(t, n), ca?.set?.(n, t), _a?.register?.(t, n), ga(t));
	}
};
pa(typeof document < "u" ? document : null);
var ya = class {
	constructor(e = null) {
		e && va(e, this);
	}
	connect(e, t, n) {
		return this;
	}
	disconnect(e, t, n) {
		return this;
	}
	storeForElement(e) {
		return Yi.get(this.name || "")?.get?.(e);
	}
	relatedForElement(e) {
		return ta(e);
	}
	get elements() {
		return oa?.get?.(this);
	}
	get storage() {
		return Yi?.get?.(this.name || "");
	}
	get name() {
		return ua?.get?.(this);
	}
}, ba = (e, t, n) => {
	let r = n;
	f(n) && (n = n.value);
	let i = (n = l(n)) != null && n !== !1;
	return D(r, () => {
		e instanceof HTMLInputElement ? e.hidden = !i : i ? e?.removeAttribute?.("data-hidden") : e?.setAttribute?.("data-hidden", "");
	}), e;
}, xa = (e, t, n) => {
	if (!(t = typeof t == "string" ? o(t) : t) || !e || [
		"style",
		"dataset",
		"attributeStyleMap",
		"styleMap",
		"computedStyleMap"
	].indexOf(t || "") != -1) return e;
	let r = n;
	return f(n) && (n = n.value), e?.[t] === n || e?.[t] !== n && D(r, () => {
		n == null ? delete e[t] : e[t] = n;
	}), e;
}, Sa = (e, t, n) => {
	let r = e?.dataset;
	if (!t || !e || !r) return e;
	let i = n;
	return f(n) && (n = n?.value), t = o(t), r?.[t] === (n = l(n)) || (n == null || n === !1 ? delete r[t] : D(i, () => {
		typeof n != "object" && typeof n != "function" ? r[t] = String(n) : delete r[t];
	})), e;
}, Ca = (e, t) => e.style.removeProperty(h(t)), wa = (e, t, n) => {
	let r = e?.style;
	return !t || typeof t != "string" || !e || !r || D(n, () => {
		u(n) || f(n) || p(n) ? Ke(e, t, n) : n ?? Ca(e, t);
	}), e;
}, B = (e, t, n) => {
	if (!t || !e) return e;
	let r = n;
	return f(n) && (n = n.value), t = h(t), e?.getAttribute?.(t) === (n = l(n)) || D(r, () => {
		typeof n != "object" && typeof n != "function" && n != null && (typeof n != "boolean" || n == 1) ? e?.setAttribute?.(t, String(n)) : e?.removeAttribute?.(t);
	}), e;
};
//#endregion
//#region ../../projects/dom.ts/src/mixin/junction/types.ts
function Ta(e, t) {
	let n = Math.min(e.x, t.x), r = Math.min(e.y, t.y), i = Math.max(e.x, t.x), a = Math.max(e.y, t.y);
	return {
		left: n,
		top: r,
		right: i,
		bottom: a,
		width: i - n,
		height: a - r
	};
}
var Ea = {
	start: "junction-select:start",
	move: "junction-select:move",
	end: "junction-select:end",
	cancel: "junction-select:cancel"
}, Da = {
	start: "junction-drag:start",
	move: "junction-drag:move",
	end: "junction-drag:end"
}, Oa = {
	start: "junction-resize:start",
	move: "junction-resize:move",
	end: "junction-resize:end"
}, ka = Symbol.for("dom.ts@mixinDisposers"), Aa = globalThis[ka] ??= /* @__PURE__ */ new WeakMap(), ja = (e, t, n) => {
	let r = Aa.get(e) ?? /* @__PURE__ */ new Map(), i = r.get(t) ?? [];
	i.push(n), r.set(t, i), Aa.set(e, r);
}, Ma = (e, t) => {
	let n = Aa.get(e), r = n?.get(t);
	if (r) {
		for (let e of r) try {
			e();
		} catch {}
		n.delete(t), n.size === 0 && Aa.delete(e);
	}
}, Na = (e, t) => {
	let n = globalThis.getComputedStyle?.(e)?.getPropertyValue?.(t)?.trim?.() ?? "", r = parseFloat(n);
	return Number.isFinite(r) ? r : 0;
}, Pa = (e, t, n) => {
	let r = e.getAttribute(t)?.trim();
	if (!r) return n;
	let i = e.querySelector(r);
	return i instanceof HTMLElement ? i : n;
}, Fa = class extends ya {
	constructor() {
		super("ui-junction-select");
	}
	connect(e) {
		let t = e?.deref?.();
		if (!t) return this;
		let n = document.createElement("div");
		n.className = "ui-junction-select-overlay", n.setAttribute("data-junction-overlay", ""), n.style.cssText = "position:absolute;pointer-events:none;z-index:var(--z-max, 9999);box-sizing:border-box;border:1px dashed color-mix(in oklab, var(--color-primary, #5a7fff) 70%, transparent);background:color-mix(in oklab, var(--color-primary, #5a7fff) 14%, transparent);display:none;inset:auto;min-width:0;min-height:0;", globalThis.getComputedStyle?.(t)?.position === "static" && (t.style.position = "relative"), t.appendChild(n);
		let r = !1, i = {
			x: 0,
			y: 0
		}, a = {
			x: 0,
			y: 0
		}, o = (e) => {
			let n = t.getBoundingClientRect();
			return {
				x: e.clientX - n.left,
				y: e.clientY - n.top
			};
		}, s = () => {
			let e = Ta(i, a);
			if (e.width < 1 && e.height < 1) {
				n.style.display = "none";
				return;
			}
			n.style.display = "block", n.style.left = `${e.left}px`, n.style.top = `${e.top}px`, n.style.width = `${e.width}px`, n.style.height = `${e.height}px`;
		}, c = (e) => {
			e.button === 0 && (e.target?.closest?.("[data-junction-ignore-select], [data-junction-drag-handle], [data-junction-resize-handle], button, a, input, textarea, select") || (e.target === t || t.contains(e.target)) && (r = !0, i = o(e), a = { ...i }, t.setPointerCapture(e.pointerId), t.dispatchEvent(new CustomEvent(Ea.start, {
				bubbles: !0,
				detail: {
					a: { ...i },
					b: { ...a },
					host: t
				}
			})), s()));
		}, l = (e) => {
			if (!r) return;
			a = o(e), s();
			let n = Ta(i, a);
			t.dispatchEvent(new CustomEvent(Ea.move, {
				bubbles: !0,
				detail: {
					a: { ...i },
					b: { ...a },
					box: n,
					host: t
				}
			}));
		}, u = (e) => {
			if (!r) return;
			r = !1;
			try {
				t.releasePointerCapture(e.pointerId);
			} catch {}
			let n = Ta(i, a);
			t.dispatchEvent(new CustomEvent(Ea.end, {
				bubbles: !0,
				detail: {
					a: { ...i },
					b: { ...a },
					box: n,
					host: t
				}
			}));
		};
		return ja(t, "ui-junction-select", () => {
			n.remove();
		}), ja(t, "ui-junction-select", z(t, "pointerdown", c)), ja(t, "ui-junction-select", z(t, "pointermove", l)), ja(t, "ui-junction-select", z(t, "pointerup", (e) => {
			r && u(e);
		})), ja(t, "ui-junction-select", z(t, "pointercancel", (e) => {
			if (r) {
				r = !1, n.style.display = "none";
				try {
					t.releasePointerCapture(e.pointerId);
				} catch {}
				t.dispatchEvent(new CustomEvent(Ea.cancel, {
					bubbles: !0,
					detail: { host: t }
				}));
			}
		})), this;
	}
	disconnect(e) {
		let t = e?.deref?.();
		return t && Ma(t, "ui-junction-select"), this;
	}
}, Ia = class extends ya {
	constructor() {
		super("ui-junction-drag");
	}
	connect(e) {
		let t = e?.deref?.();
		if (!t) return this;
		Ke(t, "--jx-drag-x", Na(t, "--jx-drag-x")), Ke(t, "--jx-drag-y", Na(t, "--jx-drag-y"));
		let n = t.style.transform;
		(!t.style.transform || t.style.transform === "none") && (t.style.transform = "translate3d(calc(var(--jx-drag-x, 0) * 1px), calc(var(--jx-drag-y, 0) * 1px), 0)");
		let r = Pa(t, "data-junction-drag-handle", t), i = !1, a = 0, o = 0, s = 0, c = 0, l = (e) => {
			e.button === 0 && (e.target !== r && !r.contains(e.target) || (i = !0, a = e.clientX, o = e.clientY, s = Na(t, "--jx-drag-x"), c = Na(t, "--jx-drag-y"), r.setPointerCapture(e.pointerId), t.dispatchEvent(new CustomEvent(Da.start, {
				bubbles: !0,
				detail: {
					host: t,
					clientX: e.clientX,
					clientY: e.clientY,
					baseX: s,
					baseY: c
				}
			}))));
		}, u = (e) => {
			if (!i) return;
			let n = e.clientX - a, r = e.clientY - o, l = s + n, u = c + r;
			Ke(t, "--jx-drag-x", l), Ke(t, "--jx-drag-y", u), t.dispatchEvent(new CustomEvent(Da.move, {
				bubbles: !0,
				detail: {
					host: t,
					dx: n,
					dy: r,
					x: l,
					y: u
				}
			}));
		}, d = (e) => {
			if (i) {
				i = !1;
				try {
					r.releasePointerCapture(e.pointerId);
				} catch {}
				t.dispatchEvent(new CustomEvent(Da.end, {
					bubbles: !0,
					detail: {
						host: t,
						x: Na(t, "--jx-drag-x"),
						y: Na(t, "--jx-drag-y")
					}
				}));
			}
		};
		return ja(t, "ui-junction-drag", () => {
			t.style.transform = n;
		}), ja(t, "ui-junction-drag", z(r, "pointerdown", l)), ja(t, "ui-junction-drag", z(r, "pointermove", u)), ja(t, "ui-junction-drag", z(r, "pointerup", d)), ja(t, "ui-junction-drag", z(r, "pointercancel", d)), this;
	}
	disconnect(e) {
		let t = e?.deref?.();
		return t && Ma(t, "ui-junction-drag"), this;
	}
}, La = class extends ya {
	constructor() {
		super("ui-junction-resize");
	}
	connect(e) {
		let t = e?.deref?.();
		if (!t) return this;
		let n = Pa(t, "data-junction-resize-handle", t), r = !1, i = 0, a = 0, o = 0, s = 0, c = Math.max(120, parseFloat(t.getAttribute("data-junction-resize-min-w") || "") || 120), l = Math.max(80, parseFloat(t.getAttribute("data-junction-resize-min-h") || "") || 80), u = (e) => {
			e.button === 0 && (e.target !== n && !n.contains(e.target) || (r = !0, i = e.clientX, a = e.clientY, o = t.offsetWidth, s = t.offsetHeight, n.setPointerCapture(e.pointerId), t.dispatchEvent(new CustomEvent(Oa.start, {
				bubbles: !0,
				detail: {
					host: t,
					width: o,
					height: s
				}
			}))));
		}, d = (e) => {
			if (!r) return;
			let n = Math.max(c, o + (e.clientX - i)), u = Math.max(l, s + (e.clientY - a));
			t.style.width = `${n}px`, t.style.height = `${u}px`, t.dispatchEvent(new CustomEvent(Oa.move, {
				bubbles: !0,
				detail: {
					host: t,
					width: n,
					height: u
				}
			}));
		}, f = (e) => {
			if (r) {
				r = !1;
				try {
					n.releasePointerCapture(e.pointerId);
				} catch {}
				t.dispatchEvent(new CustomEvent(Oa.end, {
					bubbles: !0,
					detail: {
						host: t,
						width: t.offsetWidth,
						height: t.offsetHeight
					}
				}));
			}
		};
		return ja(t, "ui-junction-resize", z(n, "pointerdown", u)), ja(t, "ui-junction-resize", z(n, "pointermove", d)), ja(t, "ui-junction-resize", z(n, "pointerup", f)), ja(t, "ui-junction-resize", z(n, "pointercancel", f)), this;
	}
	disconnect(e) {
		let t = e?.deref?.();
		return t && Ma(t, "ui-junction-resize"), this;
	}
};
new Fa(), new Ia(), new La();
//#endregion
//#region ../../projects/lur.e/src/lure/core/Binding.ts
var Ra = Symbol.for("lur.e@bank");
globalThis[Ra] ??= new ai();
var za = Symbol.for("lur.e@elMap"), Ba = globalThis[za] ??= new ai(), Va = Symbol.for("lur.e@alives"), Ha = globalThis[Va] ??= new FinalizationRegistry((e) => e?.()), Ua = Symbol.for("@mapped"), Wa = Symbol.for("@virtual"), Ga = Symbol.for("@behavior"), Ka = (e) => !!e && typeof e == "object" && "ref" in e && typeof e?.unbind == "function", qa = (e, t) => {
	if (Ka(t)) {
		t.bind?.();
		let n = () => t.unbind?.();
		return Fn(e, Symbol.dispose, n), n;
	}
	let n = {
		click: t,
		input: t,
		change: t
	};
	t?.({ target: e });
	let r = i?.(e, "addEventListener", n);
	return Fn(e, Symbol.dispose, r), r;
}, Ja = (e, t) => {
	if (t) for (let n of t) qa(e, n);
	return e;
}, Ya = (e, t, r = "value") => {
	let a = n(e), o = n(t), s = (e) => {
		v(o, "value", g(a)?.[r ?? "value"] ?? ae(g(o)));
	}, c = {
		click: s,
		input: s,
		change: s
	};
	return s?.({ target: e }), i?.(e, "addEventListener", c), v(o, "value", e?.[r ?? "value"] ?? ae(g(t))), () => i?.(e, "removeEventListener", c);
}, Xa = (e, t, r = "") => {
	n(e);
	let i = n(t), a = h(r);
	return Hi(e, a, (e) => {
		if (e.type == "attributes" && e.attributeName == a) {
			let t = e?.target?.getAttribute?.(e.attributeName), n = g(i), r = ae(n);
			S(e.oldValue, t) && n != null && (typeof n == "object" || typeof n == "function") && (S(r, t) || r == null) && v(n, "value", t);
		}
	});
}, Za = (e, t, n) => {
	let r = Ba.get([e, t]);
	if (r) {
		let e = r[n]?.[1];
		delete r[n], e?.();
	}
}, Qa = (e, t, n, r) => {
	let i = Ba.getOrInsertComputed([e, t], () => ({}));
	return i?.[n]?.[1]?.(), i[n] = r, !0;
}, $a = (e, t, r, i, a, o) => {
	let s = Ka(t) ? t : null;
	s && (s.bind?.(), t = s.ref);
	let c = n(e);
	if (e = g(c), !e || !(e instanceof Node || e?.element instanceof Node)) return;
	let l;
	l && l?.abort?.(), l = new AbortController();
	let u = n(t);
	i?.(e, r, t);
	let d = I?.([t, "value"], (e, t, n) => {
		let o = g(u), s = g(a), d = g(c), f = ae(o) ?? ae(e);
		(!s || s?.[r] == o) && (typeof o?.[Ga] == "function" ? o?.[Ga]?.((t = e) => i(d, r, f), [
			e,
			r,
			n
		], [
			l?.signal,
			r,
			c
		]) : i(d, r, f));
	}), f = null;
	typeof o == "boolean" && o && (i == B && (f = Xa(e, t, r)), i == xa && (f = Ya(e, t, r))), typeof o == "function" && (f = o(e, r, t));
	let p = () => {
		f?.disconnect?.(), f != null && typeof f == "function" && f?.(), s?.unbind?.(), d?.(), l?.abort?.(), Za?.(e, i, r);
	};
	if (Fn(t, Symbol.dispose, p), Ha.register(e, p), !Qa(e, i, r, [t, p])) return p;
}, eo = (e, t, n, r, i, a) => (r(e, t, Ka(n) ? n.ref : n), $a(e, n, t, r, i, a)), to = Symbol.for("fest.animatable"), no = (e) => typeof e == "object" && !!e && e[to] === !0, ro = (e) => Array.isArray(e) && typeof e[0] == "function", io = 0, ao = /* @__PURE__ */ new Set(/* @__PURE__ */ "%.px.cm.mm.q.in.pc.pt.em.ex.ch.cap.ic.lh.rem.rex.rch.rcap.ric.rlh.vw.vh.vi.vb.vmin.vmax.svw.svh.svi.svb.svmin.svmax.lvw.lvh.lvi.lvb.lvmin.lvmax.dvw.dvh.dvi.dvb.dvmin.dvmax.cqw.cqh.cqi.cqb.cqmin.cqmax.deg.grad.rad.turn.s.ms.hz.khz.dpi.dpcm.dppx.x.fr".split(".")), oo = (e) => {
	let t = typeof e == "string" ? e.trim() : "";
	if (!t) return !0;
	for (let e of t.split(";")) {
		let t = e.trim();
		if (!t) continue;
		let n = t.indexOf(":");
		if (n < 0 || t.slice(n + 1).trim().length > 0) return !1;
	}
	return !0;
}, so = (e) => {
	if (e == null) return;
	let t = e.getAttribute("style");
	t != null && oo(t) && (e.style.cssText = "", e.removeAttribute("style"));
}, co = (e, t) => {
	if (oo(t)) {
		e.style.cssText = "", e.removeAttribute("style");
		return;
	}
	e.style.cssText = t;
}, lo = (e) => {
	if (typeof e != "object" || !e) return !1;
	try {
		let t = globalThis.CSSStyleValue;
		if (typeof t == "function" && e instanceof t) return !0;
		for (let t = e; t; t = Object.getPrototypeOf(t)) if (t?.constructor?.name === "CSSStyleValue") return !0;
	} catch {}
	return !1;
}, uo = (e) => {
	if (typeof e != "object" || !e || lo(e)) return !1;
	try {
		return "value" in e;
	} catch {
		return !1;
	}
}, fo = (e) => e == null || typeof e != "object" && typeof e != "function", po = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), mo = (e, t) => RegExp(`var\\(\\s*${po(t)}\\s*\\)`).test(e), ho = (e) => {
	let t = /^(%|[a-zA-Z]+)/.exec(e);
	if (!t) return null;
	let n = t[0], r = n.toLowerCase();
	return ao.has(r) ? {
		authored: n,
		normalized: r,
		length: n.length
	} : null;
}, go = (e) => {
	switch (e.toLowerCase()) {
		case "%": return "percent";
		case "q": return "Q";
		case "hz": return "Hz";
		case "khz": return "kHz";
		case "fr": return "flex";
		default: return e.toLowerCase();
	}
}, _o = (e) => {
	switch (e.toLowerCase()) {
		case "%": return "percent";
		default: return e.toLowerCase();
	}
}, vo = (e, t) => e?.[t] ?? globalThis?.[t], yo = (e, t, n) => {
	let r = e?.CSS, i = go(t), a = r?.[i];
	if (typeof a == "function") return a.call(r, n);
	let o = vo(e, "CSSUnitValue");
	if (typeof o != "function") throw TypeError(`Typed OM does not support CSS unit "${t}"`);
	return new o(n, _o(t));
}, bo = (e) => {
	let t = e.value?.value, n = typeof t == "number" ? t : Number(t);
	if (!Number.isFinite(n)) throw TypeError(`Reactive CSS value "${String(t)}" is not finite`);
	return n;
}, xo = (e) => {
	let t = Number(e?.value);
	return Number.isFinite(t) ? t : 0;
}, So = (e, t) => {
	let n = e;
	for (let e of t) n = n.replace(RegExp(`var\\(\\s*${po(e.marker)}\\s*\\)`, "g"), String(e.value));
	return n;
}, Co = (e, t) => {
	let n = po(t);
	return RegExp(`^var\\(\\s*${n}\\s*\\)$`).test(e.trim());
}, wo = (e, t) => {
	let n = e;
	return typeof n == "object" && n && "value" in n && !(n instanceof Element) && (n = n.value), n == null || n === "" ? t ? `0${t}` : "0" : t != null && typeof n == "number" ? `${n}${t}` : String(n);
}, To = (e, t, n) => {
	if (!n) return !1;
	let r = po(t), i = po(n);
	return RegExp(`^calc\\(\\s*var\\(\\s*${r}\\s*\\)\\s*\\*\\s*1${i}\\s*\\)$`, "i").test(e.trim());
}, Eo = (e, t, n, r) => {
	if (typeof t?.parseAll == "function") {
		let i = t.parseAll(n, r);
		e.set(n, ...i);
		return;
	}
	if (typeof t?.parse == "function") {
		e.set(n, t.parse(n, r));
		return;
	}
	e.set(n, r);
}, Do = (e) => {
	let t = [], n = 0;
	for (; n < e.length;) {
		let r = e.slice(n), i = /^\s+/.exec(r);
		if (i) {
			n += i[0].length;
			continue;
		}
		let a = /^var\(\s*(--[a-zA-Z0-9_-]+)\s*\)/.exec(r);
		if (a) {
			t.push({
				kind: "variable",
				marker: a[1]
			}), n += a[0].length;
			continue;
		}
		let o = /^(?:\d*\.\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?/.exec(r);
		if (o) {
			n += o[0].length;
			let r = /^(%|[a-zA-Z]+)/.exec(e.slice(n)), i = r?.[0] ?? null;
			r && (n += r[0].length), t.push({
				kind: "number",
				value: Number(o[0]),
				unit: i == null ? null : i.toLowerCase()
			});
			continue;
		}
		let s = /^[a-zA-Z_][a-zA-Z0-9_-]*/.exec(r);
		if (s) {
			t.push({
				kind: "identifier",
				value: s[0].toLowerCase()
			}), n += s[0].length;
			continue;
		}
		let c = r[0];
		if (c === "+" || c === "-" || c === "*" || c === "/" || c === "(" || c === ")" || c === ",") {
			t.push({
				kind: "symbol",
				value: c
			}), n++;
			continue;
		}
		throw SyntaxError(`Unsupported Typed OM numeric token near "${r}"`);
	}
	return t;
}, Oo = class {
	tokens;
	win;
	reactiveByMarker;
	typedByMarker;
	index = 0;
	leaves = [];
	constructor(e, t, n, r) {
		this.tokens = e, this.win = t, this.reactiveByMarker = n, this.typedByMarker = r;
	}
	parse() {
		let e = this.parseSum();
		if (this.index !== this.tokens.length) throw SyntaxError("Unexpected trailing Typed OM expression");
		return {
			root: e,
			leaves: this.leaves
		};
	}
	current() {
		return this.tokens[this.index];
	}
	consume() {
		let e = this.tokens[this.index];
		if (!e) throw SyntaxError("Unexpected end of Typed OM expression");
		return this.index++, e;
	}
	consumeSymbol(e) {
		let t = this.consume();
		if (t.kind !== "symbol" || t.value !== e) throw SyntaxError(`Expected "${e}"`);
	}
	matchesSymbol(e) {
		let t = this.current();
		return t?.kind === "symbol" && t.value === e;
	}
	createMath(e, ...t) {
		let n = vo(this.win, e);
		if (typeof n != "function") throw TypeError(`${e} is not supported`);
		return new n(...t);
	}
	parseSum() {
		let e = this.parseProduct();
		for (; this.matchesSymbol("+") || this.matchesSymbol("-");) {
			let t = this.consume(), n = this.parseProduct();
			if (t.kind !== "symbol") throw SyntaxError("Expected a sum operator");
			e = t.value === "+" ? this.createMath("CSSMathSum", e, n) : this.createMath("CSSMathSum", e, this.createMath("CSSMathNegate", n));
		}
		return e;
	}
	parseProduct() {
		let e = this.parseUnary();
		for (; this.matchesSymbol("*") || this.matchesSymbol("/");) {
			let t = this.consume(), n = this.parseUnary();
			if (t.kind !== "symbol") throw SyntaxError("Expected a product operator");
			e = t.value === "*" ? this.createMath("CSSMathProduct", e, n) : this.createMath("CSSMathProduct", e, this.createMath("CSSMathInvert", n));
		}
		return e;
	}
	parseUnary() {
		return this.matchesSymbol("+") ? (this.consume(), this.parseUnary()) : this.matchesSymbol("-") ? (this.consume(), this.createMath("CSSMathNegate", this.parseUnary())) : this.parsePrimary();
	}
	parsePrimary() {
		let e = this.consume();
		if (e.kind === "number") return yo(this.win, e.unit ?? "number", e.value);
		if (e.kind === "variable") {
			let t = this.reactiveByMarker.get(e.marker);
			if (t) {
				if (this.matchesSymbol("*")) {
					let e = this.index;
					this.consume();
					let n = this.current();
					if (n?.kind === "number" && n.value === 1 && typeof n.unit == "string" && (!t.multipliedByUnit || t.multipliedByUnit === n.unit.toLowerCase())) {
						this.consume();
						let e = yo(this.win, n.unit.toLowerCase(), bo(t));
						return this.leaves.push({
							slot: t,
							value: e
						}), e;
					}
					this.index = e;
				}
				let e = yo(this.win, "number", bo(t));
				return this.leaves.push({
					slot: t,
					value: e
				}), e;
			}
			let n = this.typedByMarker.get(e.marker);
			if (n) return n.value;
			throw SyntaxError(`Unknown style slot "${e.marker}"`);
		}
		if (e.kind === "symbol" && e.value === "(") {
			let e = this.parseSum();
			return this.consumeSymbol(")"), e;
		}
		if (e.kind === "identifier") return this.parseFunction(e.value);
		throw SyntaxError("Expected a Typed OM numeric value");
	}
	parseFunction(e) {
		if (this.consumeSymbol("("), e === "calc") {
			let e = this.parseSum();
			return this.consumeSymbol(")"), e;
		}
		let t = [];
		if (!this.matchesSymbol(")")) for (t.push(this.parseSum()); this.matchesSymbol(",");) this.consume(), t.push(this.parseSum());
		if (this.consumeSymbol(")"), e === "min") {
			if (t.length === 0) throw SyntaxError("min() requires a value");
			return this.createMath("CSSMathMin", ...t);
		}
		if (e === "max") {
			if (t.length === 0) throw SyntaxError("max() requires a value");
			return this.createMath("CSSMathMax", ...t);
		}
		if (e === "clamp") {
			if (t.length !== 3) throw SyntaxError("clamp() requires three values");
			return this.createMath("CSSMathClamp", t[0], t[1], t[2]);
		}
		throw SyntaxError(`Unsupported Typed OM function "${e}"`);
	}
}, ko = (e, t, n, r) => {
	let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
	for (let e of n) i.set(e.marker, e);
	for (let e of r) a.set(e.marker, e);
	return new Oo(Do(e), t, i, a).parse();
}, Ao = (e) => e.trim().toLowerCase() === "transform", jo = (e, t, n, r) => {
	let i = Do(e), a = [], o = [], s = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
	for (let e of n) s.set(e.marker, e);
	for (let e of r) c.set(e.marker, e);
	let l = () => yo(t, "px", 0), u = () => yo(t, "number", 1), d = 0, f = () => i[d], p = () => {
		let e = i[d];
		if (!e) throw SyntaxError("Unexpected end of transform expression");
		return d++, e;
	}, m = (e) => {
		let t = p();
		if (t.kind !== "symbol" || t.value !== e) throw SyntaxError(`Expected "${e}"`);
	}, h = () => {
		let e = d, n = 0;
		for (; d < i.length;) {
			let e = i[d];
			if (e.kind === "symbol" && e.value === "(") {
				n++, d++;
				continue;
			}
			if (e.kind === "symbol" && e.value === ")") {
				if (n === 0) break;
				n--, d++;
				continue;
			}
			if (e.kind === "symbol" && e.value === "," && n === 0) break;
			d++;
		}
		let r = i.slice(e, d);
		if (r.length === 0) throw SyntaxError("Empty transform function argument");
		let o = new Oo(r, t, s, c).parse();
		return a.push(...o.leaves), o.root;
	}, g = () => {
		let e = [];
		if (m("("), f()?.kind !== "symbol" || f()?.value !== ")") for (e.push(h()); f()?.kind === "symbol" && f()?.value === ",";) p(), e.push(h());
		return m(")"), e;
	}, _ = (e, n) => {
		let r = (e) => {
			let n = vo(t, e);
			if (typeof n != "function") throw TypeError(`${e} is not supported`);
			return n;
		};
		switch (e) {
			case "translate": {
				let e = r("CSSTranslate");
				if (n.length === 1) return new e(n[0], l());
				if (n.length === 2) return new e(n[0], n[1]);
				if (n.length === 3) return new e(n[0], n[1], n[2]);
				throw SyntaxError("translate() expects 1..3 args");
			}
			case "translatex": return new (r("CSSTranslate"))(n[0], l());
			case "translatey": return new (r("CSSTranslate"))(l(), n[0]);
			case "translatez": return new (r("CSSTranslate"))(l(), l(), n[0]);
			case "translate3d":
				if (n.length !== 3) throw SyntaxError("translate3d() expects 3 args");
				return new (r("CSSTranslate"))(n[0], n[1], n[2]);
			case "scale": {
				let e = r("CSSScale");
				if (n.length === 1) return new e(n[0], n[0]);
				if (n.length === 2) return new e(n[0], n[1]);
				if (n.length === 3) return new e(n[0], n[1], n[2]);
				throw SyntaxError("scale() expects 1..3 args");
			}
			case "scalex": return new (r("CSSScale"))(n[0], u());
			case "scaley": return new (r("CSSScale"))(u(), n[0]);
			case "scalez": return new (r("CSSScale"))(u(), u(), n[0]);
			case "scale3d":
				if (n.length !== 3) throw SyntaxError("scale3d() expects 3 args");
				return new (r("CSSScale"))(n[0], n[1], n[2]);
			case "rotate": {
				let e = r("CSSRotate");
				if (n.length === 1) return new e(n[0]);
				if (n.length === 4) return new e(n[0], n[1], n[2], n[3]);
				throw SyntaxError("rotate() expects 1 or 4 args");
			}
			case "rotatex": return new (r("CSSRotate"))(u(), yo(t, "number", 0), yo(t, "number", 0), n[0]);
			case "rotatey": return new (r("CSSRotate"))(yo(t, "number", 0), u(), yo(t, "number", 0), n[0]);
			case "rotatez": return new (r("CSSRotate"))(yo(t, "number", 0), yo(t, "number", 0), u(), n[0]);
			case "rotate3d":
				if (n.length !== 4) throw SyntaxError("rotate3d() expects 4 args");
				return new (r("CSSRotate"))(n[0], n[1], n[2], n[3]);
			case "skew": {
				let e = r("CSSSkew");
				if (n.length === 1) return new e(n[0], yo(t, "deg", 0));
				if (n.length === 2) return new e(n[0], n[1]);
				throw SyntaxError("skew() expects 1..2 args");
			}
			case "skewx": return new (r("CSSSkewX"))(n[0]);
			case "skewy": return new (r("CSSSkewY"))(n[0]);
			case "perspective": return new (r("CSSPerspective"))(n[0]);
			default: throw SyntaxError(`Unsupported transform function "${e}"`);
		}
	};
	for (; d < i.length;) {
		let e = p();
		if (e.kind !== "identifier") throw SyntaxError("Expected a transform function name");
		let t = g();
		o.push(_(e.value, t));
	}
	if (o.length === 0) throw SyntaxError("Empty transform list");
	let v = vo(t, "CSSTransformValue");
	if (typeof v != "function") throw TypeError("CSSTransformValue is not supported");
	return {
		root: new v(o),
		leaves: a
	};
}, Mo = (e, t, n, r, i) => Ao(e) ? jo(t, n, r, i) : ko(t, n, r, i), No = (e, t) => {
	for (let n of t) {
		let t = e.get(n.slot.marker);
		t ? t.push(n) : e.set(n.slot.marker, [n]);
	}
}, Po = (e, t, n) => e.map((e) => ({
	slot: e.slot,
	value: e.value,
	property: t,
	root: n
})), Fo = (e, t, n, r, i, a) => {
	let o = e.ownerDocument.createElement("span");
	o.style.cssText = t, co(e, "");
	let s = e, c = s.attributeStyleMap ?? s.styleMap, l = e.ownerDocument.defaultView ?? globalThis, u = l?.CSSStyleValue ?? globalThis.CSSStyleValue, d = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Set(), p = [], m = /* @__PURE__ */ new Set();
	for (let t of a) {
		let n = null;
		for (let r = 0; r < o.style.length; r++) {
			let i = o.style.item(r), a = o.style.getPropertyValue(i);
			if (Co(a, t.marker)) {
				n = {
					mode: "property",
					target: i
				}, e.style.setProperty(i, wo(t.value.value)), m.add(i);
				break;
			}
			if (To(a, t.marker, t.multipliedByUnit)) {
				n = {
					mode: "property",
					target: i,
					unit: t.multipliedByUnit
				}, e.style.setProperty(i, wo(t.value.value, t.multipliedByUnit)), m.add(i);
				break;
			}
		}
		if (!n) {
			let r = Number(t.value.value) || 0;
			Uo(l, t.marker, r), e.style.setProperty(t.marker, String(r)), n = {
				mode: "custom-property",
				target: t.marker
			};
		}
		p.push(t.value.attach(e, n));
	}
	for (let t = 0; t < o.style.length; t++) {
		let i = o.style.item(t);
		if (m.has(i)) continue;
		let a = o.style.getPropertyValue(i), s = o.style.getPropertyPriority(i), p = n.filter((e) => mo(a, e.marker)), h = r.filter((e) => mo(a, e.marker));
		if (p.length === 0 && h.length === 0) {
			e.style.setProperty(i, a, s);
			continue;
		}
		let g = c?.set && !s && !i.startsWith("--"), _ = !1;
		if (g && h.length > 0) try {
			let e = h.length === 1 && p.length === 0 ? h[0] : null;
			if (e && To(a, e.marker, e.multipliedByUnit)) {
				let t = yo(l, e.multipliedByUnit, bo(e));
				c.set(i, t), No(d, Po([{
					slot: e,
					value: t
				}], i, t)), _ = !0;
			} else if (e && Co(a, e.marker)) {
				let t = yo(l, "number", bo(e));
				c.set(i, t), No(d, Po([{
					slot: e,
					value: t
				}], i, t)), _ = !0;
			} else {
				let e = Mo(i, a, l, h, p);
				c.set(i, e.root), No(d, Po(e.leaves, i, e.root)), _ = !0;
			}
		} catch {}
		if (_) continue;
		if (g && h.length === 0 && p.length > 0) try {
			let e = p.length === 1 ? p[0] : null;
			if (e && Co(a, e.marker)) c.set(i, e.value), _ = !0;
			else if (e && To(a, e.marker, e.multipliedByUnit)) {
				let t = vo(l, "CSSMathProduct");
				if (typeof t != "function") throw TypeError("CSSMathProduct is not supported");
				let n = new t(e.value, yo(l, e.multipliedByUnit, 1));
				c.set(i, n), _ = !0;
			} else {
				try {
					let e = Mo(i, a, l, [], p);
					c.set(i, e.root);
				} catch {
					Eo(c, u, i, So(a, p));
				}
				_ = !0;
			}
		} catch {}
		if (_) continue;
		let v = So(a, p);
		e.style.setProperty(i, v, s);
		for (let e of h) f.add(e.marker);
	}
	for (let t of r) {
		let n = d.get(t.marker) ?? [], r = f.has(t.marker);
		if (n.length === 0 && !r) continue;
		let i = eo(e, t.marker, t.value, function(...e) {
			if (n.length > 0) try {
				let e = bo(t), r = /* @__PURE__ */ new Map();
				for (let t of n) t.value.value = e, r.set(t.property, t.root);
				if (c?.set) for (let [e, t] of r) c.set(e, t);
			} catch {}
			r && wa.apply(this, e);
		});
		p.push(i);
	}
	for (let t of f) {
		if (r.some((e) => e.marker === t)) continue;
		let n = i.get(t);
		n != null && p.push(eo(e, t, n, wa));
	}
	return so(e), () => {
		for (let e of p) e?.();
	};
}, Io = (e) => {
	let [t, n, r] = e, i = document.createElement("div");
	return t(i), i.style.cssText;
}, Lo = (e, ...t) => {
	let n = io++, r = [], i = /* @__PURE__ */ new Map(), a = [], o = [], s = [], c = [], l = Array(e.length).fill(0);
	for (let u = 0; u < e.length; u++) {
		if (s.push(e[u].slice(l[u])), u >= t.length) continue;
		let d = t[u], f = ho(e[u + 1] ?? "");
		if (lo(d)) {
			let e = `--fest-typed-${n}-${a.length}`;
			a.push({
				marker: e,
				value: d,
				multipliedByUnit: f?.normalized
			}), f ? (s.push(`calc(var(${e}) * 1${f.authored})`), l[u + 1] += f.length) : s.push(`var(${e})`);
			continue;
		}
		if (no(d)) {
			let e = `--fest-anim-${n}-${c.length}`;
			f ? (s.push(`calc(var(${e}) * 1${f.authored})`), l[u + 1] += f.length) : s.push(`var(${e})`), r.push(`@property ${e} { syntax: "<number>"; initial-value: ${Number(d.value) || 0}; inherits: false; };`), c.push({
				marker: e,
				value: d,
				multipliedByUnit: f?.normalized
			});
			continue;
		}
		if (uo(d)) {
			let e = `--fest-ref-${n}-${o.length}`;
			o.push({
				marker: e,
				value: d,
				multipliedByUnit: f?.normalized
			}), f ? (s.push(`calc(var(${e}) * 1${f.authored})`), l[u + 1] += f.length) : s.push(`var(${e})`);
			let t = xo(d);
			r.push(`@property ${e} { syntax: "<number>"; initial-value: ${t}; inherits: true; };`), i.set(e, d);
			continue;
		}
		typeof d != "object" && typeof d != "function" && d != null && String(d).trim() !== "" && s.push(String(d));
	}
	let u = [
		(e) => Fo(e, s.join(""), a, o, i, c),
		r,
		i
	];
	return u[Symbol.toStringTag] = () => Io(u), u[Symbol.toPrimitive] = (e) => e === "string" ? Io(u) : u[0], u.toString = () => Io(u), u.valueOf = () => Io(u), Object.defineProperty(u, "cssText", {
		get: () => Io(u),
		set: (e) => {
			console.log("set cssText", e);
			let [t, n, r] = u, i = document.createElement("div");
			t(i), i.style.cssText = e;
		},
		configurable: !0,
		enumerable: !0
	}), u;
}, Ro = (e, t) => {
	let n = [], r = [], i = /#\{(\d+)\}/g, a = 0, o;
	for (; (o = i.exec(e)) != null;) {
		let i = Number.parseInt(o[1], 10);
		!Number.isSafeInteger(i) || i < 0 || (n.push(e.slice(a, o.index)), r.push(t[i]), a = o.index + o[0].length);
	}
	return r.length === 0 ? null : (n.push(e.slice(a)), {
		strings: n,
		values: r
	});
}, zo = (e, t) => {
	let n = e[0] ?? "";
	for (let r = 0; r < t.length; r++) {
		let i = t[r];
		i != null && (n += String(i)), n += e[r + 1] ?? "";
	}
	return n;
}, Bo = (e, t) => {
	let n = Ro(e, t);
	if (!n) return null;
	let { strings: r, values: i } = n;
	return i.length === 1 && (r[0] ?? "").trim() === "" && (r[1] ?? "").trim() === "" && !fo(i[0]) && !lo(i[0]) ? ro(i[0]) ? {
		kind: "template",
		binding: i[0]
	} : {
		kind: "direct",
		value: i[0]
	} : i.some((e) => uo(e) || lo(e)) ? {
		kind: "template",
		binding: Lo(r, ...i)
	} : i.every(fo) ? {
		kind: "static",
		cssText: zo(r, i)
	} : {
		kind: "template",
		binding: Lo(r, ...i)
	};
}, Vo = (e, t) => {
	let n = Array.isArray(t) ? t[0] : t;
	if (typeof n != "function") return () => {};
	let r = n(e);
	return () => {
		if (typeof r == "function") {
			r();
			return;
		}
		r?.unbind?.();
	};
}, Ho = /* @__PURE__ */ new Set(), Uo = (e, t, n) => {
	if (!Ho.has(t)) {
		Ho.add(t);
		try {
			(e?.CSS ?? CSS)?.registerProperty?.({
				name: t,
				syntax: "<number>",
				initialValue: String(n),
				inherits: !1
			});
		} catch {}
	}
}, Wo = (e = null, t, n = !0) => {
	let r = [], i = () => {
		r?.forEach?.(([e, t]) => e?.(...t)), r?.splice?.(0, r?.length);
	};
	return (a, o, s, c, l = null) => {
		let u = L(l) ?? L(e), d = V(a, t, o, u), f = V(s, t, o, u), p = L(d?.parentElement ?? f?.parentElement) ?? u;
		if (!p) return;
		e != p && (e = p);
		let m = yi(p, f);
		([
			"add",
			"set",
			"delete"
		].indexOf(c || "") >= 0 || !c) && (d == null && f != null || c == "delete" ? r?.push?.([xs, [
			p,
			f,
			null,
			m >= 0 ? m : o
		]]) : d != null && f == null || c == "add" ? r?.push?.([_s, [
			p,
			d,
			null,
			o
		]]) : (d != null && f != null || c == "set") && r?.push?.([bs, [
			p,
			d,
			null,
			m >= 0 ? m : o,
			f
		]])), (c && c != "get" && [
			"add",
			"set",
			"delete"
		].indexOf(c) >= 0 || !c && !n) && i?.();
	};
}, Go = (e) => ((e instanceof Map || e instanceof Set) && (e = Array.from(e?.values?.())), e), Ko = (e, t = [], n) => {
	if (!t || !e) return e;
	n = (t?.[Ua] ? t?.mapper : n) ?? n, t = (t?.[Ua] ? t?.children : t) ?? t;
	let r = Array.from(t?.keys?.() || []), i = Go(t)?.map?.((t, i) => V(t, n, r?.[i] ?? i, e));
	return Ss(e, i), i?.forEach?.((t) => _s(e, t)), e;
}, qo = class {
	#e = document.createComment("");
	#t;
	#n;
	#r = null;
	#i = null;
	#a = {};
	#o;
	#s = null;
	#c = null;
	#l = null;
	makeUpdater(e = null) {
		e && (this.#i?.(), this.#i = null, this.#r = null, this.#r ??= Wo(e, null, !1), this.#i ??= I?.([this.#t, "value"], this._onUpdate.bind(this)));
	}
	get boundParent() {
		return this.#l;
	}
	set boundParent(e) {
		e instanceof HTMLElement && L(e) && e != this.#l && (this.#l = e, this.makeUpdater(e), this.#o &&= (this.#o?.parentNode != null && this.#o?.remove?.(), null), this.element);
	}
	constructor(e, t = (e) => e, n = null) {
		this.#e = document.createComment(""), f(t) && (typeof e == "function" || typeof e == "object") && !f(e) && ([e, t] = [t, e]), !n && typeof t == "object" && t && !f(t) && (n = t), this.#s = (t == null ? null : typeof t == "function" ? t : typeof t == "object" ? t?.mapper : null) ?? ((e) => e), this.#o = null, this.#t = (f(e) ? e : t?.(e, -1)) ?? e, this.#n = document.createDocumentFragment();
		let r = {
			removeNotExistsWhenHasPrimitives: !0,
			uniquePrimitives: !0,
			preMap: !0
		}, i = (L(n) ? null : n) || {};
		this.#a = Object.assign(r, i), this.boundParent = L(this.#a?.boundParent) ?? L(n) ?? null;
	}
	$getNodeBy(e, t) {
		let n = w(f(t) ? t?.value : t) ? this.#c ??= Cs(t) : V(t, t == e ? null : this.#s, -1, e);
		return this.#c != null && (w(t) || f(t)) && (this.#c.textContent = "" + (t?.value ?? (w(t) ? t : ""))), n;
	}
	$getNode(e, t = !0) {
		let n = w(this.#t?.value) ? this.#c ??= Cs(this.#t) : V(this.#t?.value, e == this.#t?.value ? null : this.#s, -1, e);
		return this.#c != null && (w(this.#t) || f(this.#t)) && (this.#c.textContent = "" + (w(this.#t) ? this.#t : this.#t?.value ?? "")), n != null && t && (this.#o = n), n;
	}
	get [Ua]() {
		return !0;
	}
	elementForPotentialParent(e) {
		return Promise.try(() => {
			let t = this.$getNode(e);
			if (!(!t || !e || t?.contains?.(e) || e == t) && e instanceof HTMLElement && L(e)) {
				if (Array.from(e?.children).find((e) => e === t)) this.boundParent = e;
				else {
					let n = new MutationObserver((r) => {
						for (let i of r) i.type === "childList" && i.addedNodes.length > 0 && Array.from(i.addedNodes || []).find((e) => e === t) && (this.boundParent = e, n.disconnect());
					});
					n.observe(e, { childList: !0 });
				}
			}
		})?.catch?.(console.warn.bind(console)), this.element;
	}
	get self() {
		let e = this.$getNode(this.boundParent) ?? this.#e, t = L(e?.parentElement) ? e?.parentElement : this.boundParent;
		return this.boundParent ??= L(t) ?? this.boundParent, queueMicrotask(() => {
			let t = L(e?.parentElement) ? e?.parentElement : this.boundParent;
			this.boundParent ??= L(t) ?? this.boundParent;
		}), t ?? this.boundParent ?? e;
	}
	get element() {
		let e = this.$getNode(this.boundParent) ?? this.#e, t = L(e?.parentElement) ? e?.parentElement : this.boundParent;
		return this.boundParent ??= L(t) ?? this.boundParent, queueMicrotask(() => {
			let t = L(e?.parentElement) ? e?.parentElement : this.boundParent;
			this.boundParent ??= L(t) ?? this.boundParent;
		}), e;
	}
	_onUpdate(e, t, n, r) {
		if (w(n) && w(e)) return;
		let i = w(n) ? this.#o : this.$getNodeBy(this.boundParent, n), a = this.$getNode(this.boundParent, !1) ?? this.#e;
		(i && !i?.parentNode || this.#o?.parentNode) && (i = this.#o ?? i);
		let o = this.#r?.(a, yi(this.boundParent, i), i, r, this.boundParent);
		return a != null && a != this.#o ? this.#o = a : a == null && i != this.#o && (this.#o = i), o;
	}
}, Jo = (e) => (typeof e == "object" || typeof e == "function" || typeof e == "symbol") && e != null, Yo = (e, t, n = null) => {
	let r = null;
	if (e instanceof HTMLElement) return Bs(e);
	if (e == null) return document.createComment(":NULL:");
	let i = (typeof t == "function" ? t(e, -1) : e) ?? e;
	if (w(i)) return r ??= Cs(f(e) ? e : i);
	if (r != null && w(i) && (r.textContent = "" + i), i != null && f(i) && !t) {
		if (w(i?.value)) return i?.value == null ? document.createComment(":NULL:") : r ??= Cs(i);
		if (typeof i == "object" || typeof i == "function") return ts.getOrInsertComputed(Jo(e) ? e : i, () => new qo(e, t, n));
	}
	return V(i, null, -1, n);
}, Xo = (e, t) => (t && t != e && !e?.contains?.(t) && L(t) ? e?.elementForPotentialParent?.(t) : null) ?? e?.element, Zo = (e, t) => Xo(e, t) ?? (f(e) && R(e?.value) ? e?.value : e), Qo = Symbol.for("lur.e@__nodeGuard"), $o = globalThis[Qo] ??= /* @__PURE__ */ new WeakSet(), es = Symbol.for("lur.e@nodeElMap"), ts = globalThis[es] ??= /* @__PURE__ */ new WeakMap(), ns = Symbol.for("lur.e@tmMap"), rs = globalThis[ns] ??= /* @__PURE__ */ new WeakMap(), is = (e) => w(e) ? e : f(e) && w(e?.value) && e != null ? rs?.get(e) : (typeof e == "object" || typeof e == "function") && e != null ? ts?.get?.(e) : e, as = Symbol.for("lur.e@$promiseResolvedMap");
globalThis[as] ??= /* @__PURE__ */ new WeakMap();
var os = globalThis[as], ss = (e, t) => {
	if (os?.has?.(e)) return os?.get?.(e);
	let n = document.createComment(":PROMISE:");
	return e?.then?.((r) => {
		let i = typeof t == "function" ? t(r) : r;
		os?.set?.(e, i), queueMicrotask(() => {
			try {
				if (typeof n?.replaceWith == "function") {
					if (!n?.isConnected) return;
					R(i) && n?.replaceWith?.(i);
				} else n?.isConnected && R(i) && n?.parentNode?.replaceChild?.(n, i);
			} catch {
				if (!n?.isConnected) return;
				n?.remove?.();
			}
		});
	}), n;
}, cs = (e, t, n = -1, r) => t == null ? ((e instanceof WeakRef || typeof e?.deref == "function") && (e = e.deref()), e instanceof Promise || typeof e?.then == "function" ? ss(e, (e) => cs(e, t, n, r)) : R(e) && !e?.element || R(e?.element) ? e : f(e) ? (e instanceof HTMLElement ? Bs : Yo)(e) : typeof e == "object" && e ? is(e) : typeof e == "function" ? cs(e?.(), t, n, r) : w(e) && e != null ? Cs(e) : document.createComment(":NULL:")) : e = cs(t?.(e, n), null, -1, r), ls = (e, t) => Zo(e, t) ?? R(e), us = (e, t, n = -1, r) => t == null ? ((e instanceof WeakRef || typeof e?.deref == "function") && (e = e.deref()), e instanceof Promise || typeof e?.then == "function" ? ss(e, (e) => V(e, t, n, r)) : R(e) && !e?.element ? e : R(e?.element) ? Zo(e, r) : f(e) ? (e instanceof HTMLElement ? Bs : Yo)(e)?.element : typeof e == "object" && e ? is(e) : typeof e == "function" ? V(e?.(), t, n, r) : w(e) && e != null ? Cs(e) : document.createComment(":NULL:")) : e = V(t?.(e, n), null, -1, r), ds = (e) => (typeof e == "object" || typeof e == "function" || typeof e == "symbol") && e != null, fs = (e, t, n = -1, r) => {
	if ((e instanceof WeakRef || typeof e?.deref == "function") && (e = e.deref()), e instanceof Promise || typeof e?.then == "function") return ss(e, (e) => fs(e, t, n, r));
	if (ds(e) && !R(e)) {
		if (ts.has(e)) {
			let i = is(e) ?? cs(e, t, n, r);
			return ls(i instanceof WeakRef ? i?.deref?.() : i, r);
		}
		let i = cs(e, t, n, r);
		return !t && i != null && i != e && ds(e) && !R(e) && e != null && ts.set(e, i), ls(i, r);
	}
	return us(e, t, n, r);
}, V = (e, t, n = -1, r) => {
	if (ds(e) && $o.has(e)) return is(e) ?? R(e);
	ds(e) && $o.add(e);
	let i = fs(e, t, n, r);
	return ds(e) && $o.delete(e), i;
}, ps = (e, t, n = -1) => {
	R(t) && t != null && t?.parentNode != e && (Number.isInteger(n) && n >= 0 && n < e?.childNodes?.length ? e?.insertBefore?.(t, e?.childNodes?.[n]) : e?.append?.(t));
}, ms = (e, t, n = -1) => {
	if (!(!R(t) || e == t || t?.parentNode == e)) {
		if (t = t?._onUpdate ? Xo(t, e) : t, !t?.parentNode && R(t)) {
			ps(e, t, n);
			return;
		}
		e?.parentNode != t?.parentNode && R(t) && ps(e, t, n);
	}
}, hs = (e) => ((e instanceof Map || e instanceof Set) && (e = Array.from(e?.values?.())), e), gs = (e, t, n, r = -1) => {
	let i = t?.length ?? 0;
	if (Array.isArray(kn(t)) || t instanceof Map || t instanceof Set) {
		let i = hs(t)?.map?.((t, r) => V(t, n, r, e))?.filter?.((e) => e != null), a = document.createDocumentFragment();
		i?.forEach?.((e) => ms(a, e)), ms(e, a, r);
	} else {
		let a = V(t, n, i, e);
		a != null && ms(e, a, r);
	}
}, _s = (e, t, n, r = -1) => {
	n != null && (t = n?.(t, r)), t?.children && Array.isArray(kn(t?.children)) && (t?.[Wa] || t?.[Ua]) ? gs(e, t?.children, null, r) : gs(e, t, null, r);
}, vs = (e, t, n = -1) => !e || t?.parentNode == e && t?.parentNode != null ? t : t?.parentNode != e && !L(t?.parentNode) && Number.isInteger(n) && n >= 0 && Array.from(e?.childNodes || [])?.length > n ? e.childNodes?.[n] : t, ys = (e, t, n) => {
	if (t?.parentNode) {
		if (t?.parentNode == n?.parentNode) {
			if (e = t?.parentNode ?? e, t.nextSibling === n) e.insertBefore(n, t);
			else if (n.nextSibling === t) e.insertBefore(t, n);
			else {
				let r = t.nextSibling;
				e.replaceChild(n, t), e.insertBefore(t, r);
			}
		} else t?.replaceWith?.(n);
	}
}, bs = (e, t, n, r = -1, i) => {
	n != null && (t = n?.(t, r)), e ||= i?.parentNode;
	let a = vs(e, V(i, n, r), r);
	if (a instanceof Text && typeof t == "string") a.textContent = t;
	else if (t != null) {
		let n = V(t);
		a?.parentNode == e && a != n && a instanceof Text && n instanceof Text ? a?.textContent != n?.textContent && (a.textContent = n?.textContent?.trim?.() ?? "") : a?.parentNode == e && a != n && a != null && a?.parentNode != null ? ys(e, a, n) : (a?.parentNode != e || a?.parentNode == null) && _s(e, n, null, r);
	}
}, xs = (e, t, n, r = -1) => {
	let i = V(t, n);
	if (e ||= i?.parentNode, Array.from(e?.childNodes ?? [])?.length < 1) return;
	let a = vs(e, i, r);
	return a?.parentNode == e && a?.remove?.(), e;
}, Ss = (e, t, n) => {
	let r = Array.from(kn(t) || [])?.map?.((e, t) => V(e, n, t));
	return Array.from(e.childNodes).forEach((e) => {
		r?.find?.((t) => !S?.(t, e)) || e?.remove?.();
	}), e;
}, Cs = (e) => {
	if (w(e) && e != null) return document.createTextNode(e);
	if (e == null) return document.createComment(":NULL:");
	if (ds(e)) return rs.getOrInsertComputed(e, () => {
		let t = document.createTextNode(((f(e) ? e?.value : e) ?? "")?.trim?.() ?? "");
		return I([e, "value"], (e) => {
			let n = "" + (e?.innerText ?? e?.textContent ?? e?.value ?? e ?? "");
			t.textContent = n?.trim?.() ?? "";
		}), t;
	});
}, ws = Symbol.for("lure.existsQueries"), Ts = globalThis[ws] = /* @__PURE__ */ new WeakMap(), Es = Symbol.for("lure.alreadyUsed"), Ds = globalThis[Es] = /* @__PURE__ */ new WeakMap(), Os = (e) => typeof e == "string" && e.trim().length > 0, ks = (e, t) => {
	if (!Os(t) || typeof e?.matches != "function") return !Os(t) && !!e;
	try {
		return !!e?.matches?.(t.trim());
	} catch {
		return !1;
	}
}, As = {
	logAll(e) {
		return () => console.log("attributes:", [...e?.attributes].map((e) => ({
			name: e.name,
			value: e.value
		})));
	},
	append(e) {
		return (...t) => t?.forEach?.((t) => _s(e, t, null, -1));
	},
	appendChildren(e) {
		return (...t) => t?.forEach?.((t) => _s(e, t, null, -1));
	},
	removeChildren(e) {
		return (...t) => t?.forEach?.((t) => xs(e, t, null, -1));
	},
	removeChild(e) {
		return (t) => xs(e, t, null, -1);
	},
	replaceChild(e) {
		return (t, n) => ys(e, t, n);
	},
	remove(e) {
		return () => xs(e?.parentNode, e, null, -1);
	},
	replace(e) {
		return (t) => ys(e?.parentNode, e, t);
	},
	current(e) {
		return e;
	}
}, js = 0;
function Ms(e) {
	if (typeof e != "string") throw TypeError("Pseudo-element type must be a string");
	let t = e.trim();
	if ((t === ":before" || t === ":after") && (t = `:${t}`), !/^::[-_a-zA-Z][-\w]*(?:\((?:[^()"']|"(?:\\.|[^"])*"|'(?:\\.|[^'])*')*\))?$/u.test(t)) throw TypeError(`Invalid pseudo-element selector: ${t}`);
	return t;
}
function Ns(e) {
	let t = e.getRootNode?.();
	return typeof ShadowRoot < "u" && t instanceof ShadowRoot ? t : e.ownerDocument?.documentElement ?? document.documentElement;
}
function Ps(e, t, n = null) {
	let r = new Is(e, t, n), i = new Proxy(Object.create(null), r);
	return r.self = i, i;
}
var Fs = (e) => (typeof e == "object" || typeof e == "function") && e != null, Is = class {
	resolveOrigin;
	types;
	pseudoParent;
	self;
	token = `ux-pseudo-${(++js).toString(36)}`;
	children = /* @__PURE__ */ new Map();
	attachedElement = null;
	styleActivated = !1;
	constructor(e, t, n) {
		this.resolveOrigin = e, this.types = t, this.pseudoParent = n;
	}
	get suffix() {
		return this.types.join("");
	}
	get localType() {
		return this.types[this.types.length - 1];
	}
	resolveElement() {
		let e = this.resolveOrigin();
		return this.styleActivated && e !== this.attachedElement ? (this.attachedElement?.classList?.remove?.(this.token), e?.classList?.add?.(this.token), this.attachedElement = e) : this.styleActivated && e && !e.classList.contains(this.token) && e.classList.add(this.token), e;
	}
	activateStyleTarget() {
		return this.styleActivated = !0, this.resolveElement();
	}
	getSelector() {
		return this.activateStyleTarget() ? `.${this.token}${this.suffix}` : null;
	}
	getRule() {
		let e = this.activateStyleTarget();
		return e ? Qt(`.${this.token}${this.suffix}`, "ux-query-pseudo", Ns(e)) : void 0;
	}
	getStyle() {
		return this.getRule()?.style;
	}
	getComputedStyle() {
		let e = this.resolveElement();
		if (e) return (e.ownerDocument?.defaultView ?? window).getComputedStyle(e, this.suffix);
	}
	getNativePseudo() {
		let e = this.resolveElement();
		if (!e) return null;
		for (let t of this.types) if (typeof e?.pseudo != "function" || (e = e.pseudo(t), !e)) return null;
		return e;
	}
	getChild(e) {
		let t = Ms(e), n = this.children.get(t);
		if (n) return n;
		let r = Ps(this.resolveOrigin, [...this.types, t], this.self);
		return Fs(t) && this.children.set(t, r), r;
	}
	get(e, t) {
		switch (t) {
			case "type": return this.localType;
			case "element": return this.resolveElement();
			case "parent": return this.pseudoParent ?? this.resolveElement();
			case "native": return this.getNativePseudo();
			case "selector": return this.getSelector();
			case "style": return this.getStyle();
			case "attributeStyleMap": {
				let e = this.getRule();
				return e?.styleMap ?? e?.attributeStyleMap;
			}
			case "computedStyle": return this.getComputedStyle();
			case "getComputedStyle": return () => this.getComputedStyle();
			case "pseudo": return (e) => this.getChild(e);
			case "addEventListener": return (...e) => {
				let t = this.getNativePseudo();
				if (typeof t?.addEventListener != "function") throw new DOMException("CSSPseudoElement events are not supported by this browser", "NotSupportedError");
				return t.addEventListener(...e);
			};
			case "removeEventListener": return (...e) => {
				let t = this.getNativePseudo();
				if (typeof t?.removeEventListener == "function") return t.removeEventListener(...e);
			};
			case "dispose": return () => {
				this.attachedElement?.classList?.remove?.(this.token), this.attachedElement = null, this.styleActivated = !1;
			};
			case Symbol.toStringTag: return "CSSPseudoElement";
			case Symbol.toPrimitive: return () => this.getSelector() ?? this.suffix;
		}
		let n = this.getNativePseudo();
		if (n && t in n) {
			let e = n[t];
			return typeof e == "function" ? e.bind(n) : e;
		}
		if (typeof t == "string") {
			let e = this.getStyle();
			if (e && (t.startsWith("--") || t in e)) return e[t];
		}
	}
	set(e, t, n) {
		if (typeof t != "string") return !1;
		let r = this.getStyle();
		return r ? t === "cssText" ? (r.cssText = String(n ?? ""), !0) : t.startsWith("--") ? (r.setProperty(t, String(n ?? "")), !0) : t in r && (r[t] = n == null ? "" : String(n), !0) : !1;
	}
	has(e, t) {
		if (t === "type" || t === "element" || t === "parent" || t === "native" || t === "selector" || t === "style" || t === "computedStyle" || t === "attributeStyleMap" || t === "getComputedStyle" || t === "pseudo") return !0;
		let n = this.getNativePseudo();
		if (n && t in n) return !0;
		if (typeof t == "string") {
			let e = this.getStyle();
			return !!e && (t.startsWith("--") || t in e);
		}
		return !1;
	}
	deleteProperty(e, t) {
		if (typeof t != "string") return !1;
		let n = this.getStyle();
		return n ? t.startsWith("--") ? (n.removeProperty(t), !0) : t in n && (n[t] = "", !0) : !1;
	}
}, Ls = class {
	target;
	currentTarget;
	selector;
	eventName;
	callback;
	constructor(e, t, n, r, i) {
		this.target = e, this.currentTarget = t, this.selector = n, this.eventName = r, this.callback = i;
	}
	get(e, t, n) {
		return t === "currentTarget" ? Os(this.selector) ? Ci(this.target, this.selector.trim()) ?? this.currentTarget ?? this.target : this.selector != null && typeof this.selector != "string" ? this.currentTarget ?? this.selector : this.currentTarget ?? this.target : typeof e?.[t] == "function" ? e?.[t]?.bind?.(e) : Reflect.get(e, t, n);
	}
	set(e, t, n) {
		return Reflect.set(e, t, n);
	}
	has(e, t) {
		return Reflect.has(e, t);
	}
	deleteProperty(e, t) {
		return Reflect.deleteProperty(e, t);
	}
	ownKeys(e) {
		return Reflect.ownKeys(e);
	}
	defineProperty(e, t, n) {
		return Reflect.defineProperty(e, t, n);
	}
	apply(e, t, n) {
		return Reflect.apply(e, t, n);
	}
	construct(e, t) {
		return Reflect.construct(e, t);
	}
	getPrototypeOf(e) {
		return Reflect.getPrototypeOf(e);
	}
	setPrototypeOf(e, t) {
		return Reflect.setPrototypeOf(e, t);
	}
	isExtensible(e) {
		return Reflect.isExtensible(e);
	}
	preventExtensions(e) {
		return Reflect.preventExtensions(e);
	}
	getOwnPropertyDescriptor(e, t) {
		return Reflect.getOwnPropertyDescriptor(e, t);
	}
}, Rs = (e) => typeof e == "string" ? /(^|[\s>+~(,])(input|select|textarea)\b|:checked|\[type=/.test(e) : !!e?.matches?.("input, select, textarea"), zs = class {
	direction = "children";
	selector;
	index = 0;
	_pseudoMap = /* @__PURE__ */ new Map();
	_observeMap = /* @__PURE__ */ new WeakMap();
	_callbackMap = /* @__PURE__ */ new WeakMap();
	_eventMap = /* @__PURE__ */ new WeakMap();
	_freshSelected(e) {
		let t = this._getSelected(e);
		if (t) return t?.element ?? t;
		let n = this._getArray(e)[this.index];
		return n?.element ?? n;
	}
	_readInputState(e) {
		let t = this._freshSelected(e);
		return {
			node: t,
			value: t?.value,
			checked: t?.checked,
			valueAsNumber: t?.valueAsNumber
		};
	}
	_subscribeInput(e, t) {
		let n = e?.self ?? e, r = this._readInputState(e), i = () => {
			let n = this._readInputState(e);
			Object.is(n.value, r.value) || t?.(n.value, "value", r.value), Object.is(n.checked, r.checked) || t?.(n.checked, "checked", r.checked), Object.is(n.valueAsNumber, r.valueAsNumber) || t?.(n.valueAsNumber, "valueAsNumber", r.valueAsNumber), r = n;
		}, a = {
			passive: !0,
			capture: !0
		};
		return n?.addEventListener?.("input", i, a), n?.addEventListener?.("change", i, a), () => {
			n?.removeEventListener?.("input", i, a), n?.removeEventListener?.("change", i, a);
		};
	}
	constructor(e = null, t = 0, n = "children") {
		if (this.index = t, typeof e == "string") {
			let t = e.trim();
			this.selector = t.length > 0 ? t : null;
		} else this.selector = e ?? null;
		this.direction = n;
	}
	get selectorElement() {
		return typeof this.selector == "string" ? null : this.selector;
	}
	_resolveSelectedElement(e) {
		let t = this._getArray(e), n = t.length > 0 ? t[this.index] : this._getSelected(e), r = n?.element ?? n;
		return r instanceof Element ? r : null;
	}
	_getPseudo(e, t) {
		let n = Ms(t), r = this._pseudoMap.get(n);
		if (r) return r;
		let i = Ps(() => this._resolveSelectedElement(e), [n], null);
		return this._pseudoMap.set(n, i), i;
	}
	_observeDOMChange(e, t, n) {
		return typeof t == "string" ? Wi(e, t, n) : null;
	}
	_observeAttributes(e, t, n) {
		return typeof this.selector == "string" ? Ui(e, this.selector, t, n) : Hi(e ?? this.selector, t, n);
	}
	_getArrayPrimary(e) {
		if (typeof e == "function" && (e = this.selector || e?.(this.selector)), !this.selector) return [e];
		if (typeof this.selector == "string") {
			let t = typeof e?.matches == "function" && e?.element != null && ks(e, this.selector) ? [e] : [];
			if (this.direction == "children") {
				let n = typeof e?.querySelectorAll == "function" && e?.element != null && Os(this.selector) ? [...e?.querySelectorAll?.(this.selector.trim())] : [];
				return n?.length >= 1 ? [...n] : t;
			}
			if (this.direction == "parent") {
				let n = Os(this.selector) ? e?.closest?.(this.selector.trim()) : null;
				return n ? [n] : t;
			}
			return t;
		}
		return Array.isArray(this.selector) ? this.selector : [this.selector];
	}
	_getArray(e) {
		let t = e?.self ?? e;
		return this._observeMap.getOrInsertComputed(t, () => {
			let e = this._getArrayPrimary(t), n = Ur(Array.isArray(e) ? e : [this._getSelected(t)]);
			return this.direction == "children" && Wi(t, typeof this.selector == "string" ? this.selector : void 0, (e, t) => {
				(e?.addedNodes?.length > 0 || e?.removedNodes?.length > 0) && (e?.addedNodes?.forEach((e) => {
					(e?.element ?? e) && !n?.includes?.(e?.element ?? e) && n?.push?.(e?.element ?? e);
				}), e?.removedNodes?.forEach((e) => {
					let t = n.indexOf(e?.element ?? e);
					t > -1 && n.splice(t, 1);
				}));
			}), n;
		});
	}
	_getSelected(e) {
		let t = e?.self ?? e, n = this._selector(e);
		if (Os(n)) {
			if (this.direction == "children") return ks(t, n) ? t : t?.querySelector?.(n.trim());
			if (this.direction == "parent") return ks(t, n) ? t : t?.closest?.(n.trim());
		}
		return t == (n?.element ?? n) ? n?.element ?? n : null;
	}
	_redirectToBubble(e) {
		return typeof this._selector() == "string" && {
			pointerenter: "pointerover",
			pointerleave: "pointerout",
			mouseenter: "mouseover",
			mouseleave: "mouseout",
			focus: "focusin",
			blur: "focusout"
		}[e] || e;
	}
	_addEventListener(e, t, n, r) {
		let i = this._selector(e);
		if (i == null || typeof i != "string") return (e?.self ?? e)?.addEventListener?.(t, n, r), this._callbackMap.set(n, {
			wrap: n,
			option: r
		}), n;
		let a = Os(i) ? i.trim() : null, o = (r) => {
			let i = new Proxy(r, new Ls(r?.target ?? e, r?.currentTarget ?? e, a, t, n));
			return n?.call?.(r?.target ?? e, i), i;
		};
		this._callbackMap.set(n, {
			wrap: o,
			option: r
		});
		let s = this._redirectToBubble(t), c = e?.self ?? e, l = (r) => {
			let i = this._selector(e), a = Os(i) ? i.trim() : typeof i == "string" ? null : i, o = r?.currentTarget ?? c, s = null;
			if (r?.composedPath && typeof r.composedPath == "function") {
				let e = r.composedPath() ?? [r?.target ?? r?.currentTarget];
				e?.length < 1 && (e = [r?.target ?? r?.currentTarget]);
				for (let n of e) if (n instanceof HTMLElement || n instanceof Element) {
					let e = n?.element ?? n, i = t || r?.type;
					if (i == "pointerenter" || i == "pointerleave" || i == "mouseenter" || i == "mouseleave" || i == "focus" || i == "blur") {
						if (Os(a) && ks(e, a)) {
							s = e;
							break;
						}
						if (a != null && typeof a != "string" && Si(a, e, r)) {
							s = e;
							break;
						}
						if (a == null || typeof a == "string" && !Os(a)) {
							s = e;
							break;
						}
					} else if (Os(a)) {
						if (Ci(e, a, r)) {
							s = e;
							break;
						}
					} else if (a != null && typeof a != "string") {
						if (Si(a, e, r)) {
							s = e;
							break;
						}
					} else {
						s = e;
						break;
					}
				}
			}
			s ||= (s = r?.target ?? this._getSelected(e) ?? o, s?.element ?? s), Os(a) ? Si(o, Ci(s, a, r), r) && this._callbackMap.get(n)?.wrap?.call?.(s, r) : (a == null || typeof a == "string" || Si(o, a, r) && Si(a, s, r)) && this._callbackMap.get(n)?.wrap?.call?.(s, r);
		};
		c?.addEventListener?.(s, l, r);
		let u = this._eventMap.getOrInsert(c, /* @__PURE__ */ new Map()).getOrInsert(s, /* @__PURE__ */ new WeakMap());
		return u.set(n, {
			wrap: l,
			option: r
		}), u.set(o, {
			wrap: l,
			option: r
		}), l;
	}
	_removeEventListener(e, t, n, r) {
		n = this._callbackMap.get(n)?.wrap ?? n, r = this._callbackMap.get(n)?.option ?? r;
		let i = this._selector(e);
		if (typeof i != "string") return i?.removeEventListener?.(t, n, r), n;
		let a = e?.self ?? e, o = this._redirectToBubble(t), s = this._eventMap.get(a);
		if (!s) return;
		let c = s.get(o)?.get?.(n);
		a?.removeEventListener?.(o, c?.wrap ?? n, r ?? c?.option ?? {}), c?.size != null && c?.size == 0 && s?.delete?.(o), s?.size == 0 && this._eventMap.delete(a);
	}
	_selector(e) {
		return typeof this.selector == "string" && typeof e?.selector == "string" ? ((e?.selector || "") + " " + this.selector).trim?.() : this.selector;
	}
	get(e, t, n) {
		let r = this._getArray(e), i = r.length > 0 ? r[this.index] : this._getSelected(e);
		if (t === "pseudo") return (t) => this._getPseudo(e, t);
		if (t in As) return As?.[t]?.(i);
		if (t == "length" && r?.length != null) return r?.length;
		if (t == "_updateSelector") return (e) => this.selector = e || this.selector;
		if (["style", "attributeStyleMap"].indexOf(t) >= 0) {
			let n = e?.self ?? e, r = this._selector(e), a = typeof r == "string" ? Qt(r, "ux-query", n) : i;
			return t == "attributeStyleMap" ? a?.styleMap ?? a?.attributeStyleMap : a?.[t];
		}
		if (t == "querySelectorAll") return (t) => {
			let n = this._selector(e), r = [typeof n == "string" ? n : "", typeof t == "string" ? t : ""].map((e) => e.trim()).filter(Boolean).join(" ").trim(), i = Ur([]);
			if (typeof n == "string") i = Ur([...e?.querySelectorAll?.(r) ?? []].map((e) => e?.element ?? e));
			else {
				let r = (typeof t == "string" ? t : "").trim();
				i = Ur([...(n ?? e)?.querySelectorAll?.(r) ?? []].map((e) => e?.element ?? e));
			}
			return r && Wi(e, r, (e, t) => {
				(e?.addedNodes?.length > 0 || e?.removedNodes?.length > 0) && (e?.addedNodes?.forEach((e) => {
					(e?.element ?? e) && !i?.includes?.(e?.element ?? e) && i?.push?.(e?.element ?? e);
				}), e?.removedNodes?.forEach((e) => {
					let t = i?.findIndex?.((t) => (t?.element ?? t) == (e?.element ?? e));
					t > -1 && i?.splice?.(t, 1);
				}));
			}), i;
		};
		if (t == "querySelector") return (t) => {
			let n = this._selector(e);
			return Bs(typeof n == "string" ? ((n ?? "") + " " + (t ?? "")).trim?.() : (t ?? "")?.trim?.(), e, 0, this.direction == "children" ? "children" : "parent");
		};
		if (t == "self") return e?.self ?? e;
		if (t == "selector") return this._selector(e);
		if (t == "observeAttr") return (t, n) => this._observeAttributes(e, t, n);
		if (t == "DOMChange") return (t) => this._observeDOMChange(e, this.selector, t);
		if (t == "addEventListener") return (t, n, r) => this._addEventListener(e, t, n, r);
		if (t == "removeEventListener") return (t, n, r) => this._removeEventListener(e, t, n, r);
		if (t == "getAttribute") return (t) => {
			let n = this._getArray(e), r = n.length > 0 ? n[this.index] : this._getSelected(e), i = Ts?.get?.(e)?.get?.(this.selector) ?? r, a = Ba?.get?.([i, B]);
			return a?.[t] ? a[t]?.[0] : r?.getAttribute?.(t);
		};
		if (t == "setAttribute") return (t, n) => {
			let r = this._getArray(e), i = r.length > 0 ? r[this.index] : this._getSelected(e);
			return typeof n == "object" && (n?.value != null || "value" in n) ? eo(i, t, n, B, null, !0) : i?.setAttribute?.(t, n);
		};
		if (t == "removeAttribute") return (t) => {
			let n = this._getArray(e), r = n.length > 0 ? n[this.index] : this._getSelected(e), i = Ts?.get?.(e)?.get?.(this.selector) ?? r, a = Ba?.get?.([i, B]);
			return a?.[t] ? a[t]?.[1]?.() : r?.removeAttribute?.(t);
		};
		if (t == "hasAttribute") return (t) => {
			let n = this._getArray(e), r = n.length > 0 ? n[this.index] : this._getSelected(e), i = Ts?.get?.(e)?.get?.(this.selector) ?? r;
			return Ba?.get?.([i, B])?.[t] ? !0 : r?.hasAttribute?.(t);
		};
		if (t == "element") {
			if (r?.length <= 1) return i?.element ?? i;
			let e = document.createDocumentFragment();
			return e.append(...r), e;
		}
		if (t == Symbol.toPrimitive && (this.selector?.includes?.("input") || this.selector?.matches?.("input"))) return (e) => e == "number" ? (i?.element ?? i)?.valueAsNumber ?? parseFloat((i?.element ?? i)?.value) : e == "string" ? String((i?.element ?? i)?.value ?? i?.element ?? i) : e == "boolean" ? (i?.element ?? i)?.checked : (i?.element ?? i)?.checked ?? (i?.element ?? i)?.value ?? i?.element ?? i;
		if (t == "value" && Rs(this.selector)) {
			let t = this._freshSelected(e), n = t?.valueAsNumber;
			return n != null && !Number.isNaN(n) ? n : t?.value ?? t?.checked;
		}
		if (t == "checked" && Rs(this.selector)) return this._freshSelected(e)?.checked;
		if (t == "valueAsNumber" && Rs(this.selector)) return this._freshSelected(e)?.valueAsNumber;
		if (t == wn && Rs(this.selector)) return (t) => this._subscribeInput(e, t);
		if ((t == "valueRef" || t == "checkedRef") && Rs(this.selector)) return () => {
			let n = t == "checkedRef" ? "checked" : "value", r = Ur({ value: this._readInputState(e)[n] }), i = this._subscribeInput(e, (e, t) => {
				t == n && (r.value = e);
			});
			return r[Symbol.dispose] = i, r;
		};
		if (t == "deref" && (typeof i == "object" || typeof i == "function") && i != null) {
			let e = new WeakRef(i);
			return () => e?.deref?.()?.element ?? e?.deref?.();
		}
		if (typeof t == "string" && /^\d+$/.test(t)) return r[parseInt(t)];
		let a = i;
		return a?.[t] == null ? r?.[t] == null ? typeof e?.[t] == "function" ? e?.[t].bind(a) : e?.[t] : typeof r[t] == "function" ? r[t].bind(r) : r[t] : typeof a[t] == "function" ? a[t].bind(a) : a[t];
	}
	set(e, t, n) {
		let r = this._getArray(e), i = r.length > 0 ? r[this.index] : this._getSelected(e);
		return typeof t == "string" && /^\d+$/.test(t) || r[t] != null ? !1 : (i && (i[t] = n), !0);
	}
	has(e, t) {
		let n = this._getArray(e), r = n.length > 0 ? n[this.index] : this._getSelected(e);
		return typeof t == "string" && /^\d+$/.test(t) && n[parseInt(t)] != null || n[t] != null || r && t in r;
	}
	deleteProperty(e, t) {
		let n = this._getArray(e), r = n.length > 0 ? n[this.index] : this._getSelected(e);
		return r && t in r ? (delete r[t], !0) : !1;
	}
	ownKeys(e) {
		let t = this._getArray(e), n = t.length > 0 ? t[this.index] : this._getSelected(e), r = /* @__PURE__ */ new Set();
		return t.forEach((e, t) => r.add(t.toString())), Object.getOwnPropertyNames(t).forEach((e) => r.add(e)), n && Object.getOwnPropertyNames(n).forEach((e) => r.add(e)), Array.from(r);
	}
	defineProperty(e, t, n) {
		return Reflect.defineProperty(e, t, n);
	}
}, Bs = (e, t = document.documentElement, n = 0, r = "children") => {
	if ((e?.element ?? e) instanceof HTMLElement) {
		let t = e?.element ?? e;
		return Ds.getOrInsert(t, new Proxy(t, new zs(null, n, r)));
	}
	if (typeof e == "function") {
		let t = e;
		return Ds.getOrInsert(t, new Proxy(t, new zs(null, n, r)));
	}
	return t == null || typeof t == "string" || typeof t == "number" || typeof t == "boolean" || typeof t == "symbol" || t === void 0 ? null : Ts?.get?.(t)?.has?.(e) ? Ts?.get?.(t)?.get?.(e) : Ts?.getOrInsert?.(t, /* @__PURE__ */ new Map())?.getOrInsertComputed?.(e, () => new Proxy(t, new zs(e, n, r)));
}, Vs = (e, t) => {
	if (t == null) return () => {};
	let n = e.flatMap((e) => Array.isArray(t) ? t?.map?.((t) => {
		if (t != null) return Fn(e, Symbol.dispose, t), t;
	}) : t == null ? [] : (Fn(e, Symbol.dispose, t), [t]))?.filter?.((e) => e != null);
	return () => n?.map?.((e) => e?.())?.filter?.((e) => e != null && typeof e == "function")?.forEach?.((e) => e?.());
}, Hs = (e) => w(e) ? [] : Array.isArray(e) ? e.map((e, t) => [t, e]) : e instanceof Map ? Array.from(e.entries()) : e instanceof Set ? Array.from(e.values()) : Array.from(Object.entries(e)), Us = (e, t, n) => {
	if (!e || t == null) return e;
	let r = t?.toString?.() || t;
	return (r === "style" || r === "cssText") && (ro(n) || typeof n == "function") ? (qs(e, n), e) : (B(e, t, n), e);
}, Ws = (e, t) => {
	if (!t) return e;
	let n = new WeakRef(t), r = new WeakRef(e);
	return typeof t == "object" || typeof t == "function" ? (Hs(t).forEach(([e, t]) => {
		Us(r?.deref?.(), e, t);
	}), Vs([t, e], I(t, (e, t) => {
		if (Us(r?.deref?.(), t, e), !((t === "style" || t === "cssText") && (ro(e) || typeof e == "function"))) return $a(r?.deref?.(), e, t, B, n, !0);
	}))) : console.warn("Invalid attributes object:", t), e;
}, Gs = (e, t) => {
	if (!t) return e;
	let n = new WeakRef(t), r = new WeakRef(e);
	return typeof t == "object" || typeof t == "function" ? (Hs(t).forEach(([e, t]) => {
		B(r?.deref?.(), "aria-" + (e?.toString?.() || e || ""), t);
	}), Vs([t, e], I(t, (e, t) => (B(r?.deref?.(), "aria-" + (t?.toString?.() || t || ""), e, !0), $a(r, e, t, B, n, !0))))) : console.warn("Invalid ARIA object:", t), e;
}, Ks = (e, t) => {
	if (!t) return e;
	let n = new WeakRef(t), r = new WeakRef(e);
	return typeof t == "object" || typeof t == "function" ? (Hs(t).forEach(([e, t]) => {
		Sa(r?.deref?.(), e, t);
	}), Vs([t, e], I(t, (e, t) => (Sa(r?.deref?.(), t, e), $a(r?.deref?.(), e, t, Sa, n))))) : console.warn("Invalid dataset object:", t), e;
}, qs = (e, t) => {
	if (!t) return e;
	if (t?.style != null && !ro(t) && (ro(t.style) || typeof t.style == "function")) return qs(e, t.style);
	let n = Array.isArray(t?.style) ? t?.style?.[0] : t?.style;
	if (typeof t == "string") return Vs([t, e], co(e, t)), e;
	if (ro(t) || typeof t == "function") return Vs([t, e], Vo(e, t)), e;
	if (typeof t?.value == "string") return Vs([t, e], I([t, "value"], (n) => Vs([t, e], co(e, n ?? "")))), e;
	if (typeof t == "object" && t && "value" in t && (ro(t.value) || typeof t.value == "function")) {
		let n = Vo(e, t.value), r = I([t, "value"], (n) => {
			(ro(n) || typeof n == "function") && Vs([t, e], Vo(e, n));
		});
		return Vs([t, e], [r, n]), e;
	}
	if (n != null && typeof n == "function") return Vs([t, e], Vo(e, t.style)), e;
	if (typeof t == "object") {
		let n = new WeakRef(t), r = new WeakRef(e);
		return Hs(t).forEach(([e, t]) => {
			wa(r?.deref?.(), e, t);
		}), Vs([t, e], I(t, (e, t) => (wa(r?.deref?.(), t, e), $a(r?.deref?.(), e, t, wa, n?.deref?.())))), e;
	}
	return console.warn("Invalid styles object:", t), e;
}, Js = async (e, t) => qs(e, await t?.(e)), Ys = (e, t) => {
	if (!t) return e;
	let n = new WeakRef(t), r = new WeakRef(e);
	return Hs(t).forEach(([e, t]) => {
		xa(r?.deref?.(), e, t);
	}), Vs([t, e], I(t, (e, t) => {
		let i = r.deref();
		if (i) {
			if (t == "checked") vi(i, e);
			else return eo(i, t, e, xa, n?.deref?.(), !0);
		}
		return null;
	})), e.addEventListener("change", (e) => {
		let n = Bs("input", e?.target);
		n?.value != null && S(n?.value, t?.value) && (t.value = n?.value), n?.valueAsNumber != null && S(n?.valueAsNumber, t?.valueAsNumber) && (t.valueAsNumber = n?.valueAsNumber), n?.checked != null && S(n?.checked, t?.checked) && (t.checked = n?.checked);
	}), e;
}, Xs = (e, t) => {
	if (!t) return e;
	let n = new WeakRef(e);
	return Hs(t).forEach(([t, n]) => {
		let r = e;
		n === void 0 || n == null ? r.classList.contains(n) && r.classList.remove(n) : r.classList.contains(n) || r.classList.add(n);
	}), Vs([t, e], si(t, (e) => {
		let t = n?.deref?.();
		t && (e === void 0 || e == null ? t.classList.contains(e) && t.classList.remove(e) : t.classList.contains(e) || t.classList.add(e));
	})), e;
}, Zs = (e) => ((e instanceof Map || e instanceof Set) && (e = Array.from(e?.values?.())), e), Qs = (e) => e != null && e.nodeType === 1 && e.nodeName !== "BODY" && typeof e.insertBefore == "function", $s = Symbol("mapped.fragKids"), ec = (e) => {
	if (e instanceof DocumentFragment) {
		let t = e[$s];
		if (!Array.isArray(t) || t.length === 0) {
			let t = Array.from(e.childNodes);
			t.length && (e[$s] = t);
		}
	}
	return e;
}, tc = (e) => {
	if (e instanceof DocumentFragment) {
		ec(e);
		let t = e[$s];
		return Array.isArray(t) && t.length ? t : Array.from(e.childNodes);
	}
	return e instanceof Node ? [e] : [];
}, nc = class {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o = null;
	#s = null;
	#c = {};
	#l = document.createComment("");
	#u = /* @__PURE__ */ new Set();
	#d = !1;
	#f = null;
	#p = null;
	#m() {
		let e = this.#e, t = e?.value ?? e;
		return t instanceof Map || t instanceof Set ? Array.from(t.values()) : Array.isArray(t) ? t : [];
	}
	#h(e) {
		let t = this.#e?.value ?? this.#e;
		return !(t instanceof Map) || typeof e != "number" ? e : Array.from(t.keys())[e];
	}
	#g() {
		let e = this.#e?.value ?? this.#e;
		if (!(e instanceof Map)) {
			this.#a.clear();
			return;
		}
		let t = new Set(e.keys());
		for (let e of this.#a.keys()) t.has(e) || this.#a.delete(e);
	}
	#_() {
		this.#f?.disconnect(), this.#f = null;
	}
	#v() {
		let e = this.#p;
		if (!e) return;
		this.#g();
		let t = [];
		this.#m().forEach((n, r) => {
			let i = V(n, this.mapper.bind(this), r, e);
			t.push(...tc(i));
		});
		let n = new Set(t);
		if (this.#l.parentNode !== e) {
			let n = t.find((t) => t.parentNode === e);
			n ? e.insertBefore(this.#l, n) : e.appendChild(this.#l);
		}
		for (let t of this.#u) !n.has(t) && t.parentNode === e && t.parentNode.removeChild(t);
		let r = this.#l.nextSibling;
		for (let n of t) (n.parentNode !== e || n !== r) && e.insertBefore(n, r), r = n.nextSibling;
		this.#u = n;
	}
	#y() {
		this.#d || (this.#d = !0, queueMicrotask(() => {
			this.#d = !1, this.#v();
		}));
	}
	makeUpdater(e = null) {
		e && (this.#s?.(), this.#s = null, this.#o = null, this.#o ??= Wo(e, this.mapper.bind(this), !0), this.#s ??= si?.(this.#e, this._onUpdate.bind(this)));
	}
	get boundParent() {
		return this.#p;
	}
	set boundParent(e) {
		if (Qs(e) && e != this.#p) {
			this.#_();
			let t = this.#p;
			for (let n of this.#u) n.parentNode === t && t !== e && t?.removeChild(n);
			this.#p = e, this.makeUpdater(e), this.#v();
		}
	}
	constructor(e, n = (e) => e, r = null) {
		t(n) && (typeof e == "function" || typeof e == "object") && !t(e) && ([e, n] = [n, e]), !r && typeof n == "object" && n && !t(n) && (r = n), this.#l = document.createComment(""), this.#r = /* @__PURE__ */ new WeakMap(), this.#i = /* @__PURE__ */ new Map(), this.#a = /* @__PURE__ */ new Map(), this.#n = (n == null ? null : typeof n == "function" ? n : typeof n == "object" ? n?.mapper : null) ?? ((e) => e);
		let i = (t(e) ? e : e?.iterator ?? n?.iterator ?? e) ?? [];
		(w(i) || typeof i == "string") && (i = [i]), this.#e = i, this.#t = document.createDocumentFragment();
		let a = {
			removeNotExistsWhenHasPrimitives: !0,
			uniquePrimitives: !0,
			preMap: !0
		}, o = (L(r) ? null : r) || {};
		this.#c = Object.assign(a, o), this.boundParent = L(this.#c?.boundParent) ?? L(r) ?? null, this.boundParent || this.#c.preMap && (Ko(this.#t, this.#m(), this.mapper.bind(this)), this.#t.childNodes.length === 0 && this.#t.appendChild(this.#l));
	}
	get [Ua]() {
		return !0;
	}
	elementForPotentialParent(e) {
		try {
			if (this.#m().length === 0 && Qs(e)) return this.#_(), this.#p = e, this.makeUpdater(e), this.#v(), this.element;
			let t = V(this.#m()?.[0], this.mapper.bind(this), 0);
			if (!e || t?.contains?.(e) || e == t) return;
			if (Qs(e)) {
				if (!t) this.boundParent = e;
				else if (Array.from(e?.children).find((e) => e === t)) this.boundParent = e;
				else {
					this.#_();
					let n = new MutationObserver((r) => {
						for (let i of r) i.type === "childList" && i.addedNodes.length > 0 && Array.from(i.addedNodes || []).find((e) => e === t) && (this.boundParent = e, n.disconnect());
					});
					this.#f = n, n.observe(e, { childList: !0 });
				}
			}
		} catch (e) {
			console.warn(e);
		}
		return this.element;
	}
	get children() {
		return Zs(this.#m());
	}
	get self() {
		let e = V(this.#m()?.[0], this.mapper.bind(this), 0), t = L(e?.parentElement) ? e?.parentElement : this.boundParent;
		return this.boundParent ??= L(t) ?? this.boundParent, queueMicrotask(() => {
			let t = L(e?.parentElement) ? e?.parentElement : this.boundParent;
			this.boundParent ??= L(t) ?? this.boundParent;
		}), t ?? this.boundParent ?? Ko(this.#t, this.#m(), this.mapper.bind(this));
	}
	get element() {
		let e = this.#t?.childNodes?.length > 0 ? this.#t : V(this.#m()?.[0], this.mapper.bind(this), 0), t = L(e?.parentElement) ? e?.parentElement : this.boundParent;
		return this.boundParent ??= L(t) ?? this.boundParent, queueMicrotask(() => {
			let t = L(e?.parentElement) ? e?.parentElement : this.boundParent;
			this.boundParent ??= L(t) ?? this.boundParent;
		}), e;
	}
	get mapper() {
		return (...e) => {
			let t = this.#e?.value ?? this.#e;
			if (e?.[0] == null) return null;
			if (e?.[0] instanceof Node) return e?.[0];
			if (e?.[0] instanceof Promise || typeof e?.[0]?.then == "function") return null;
			if (t instanceof Map) {
				let t = this.#h(e?.[1]), n = [
					e?.[0],
					t,
					...e.slice(2)
				], r = this.#a.get(t);
				if (r && Object.is(r.value, e?.[0])) return r.node;
				let i = ec(this.#n(...n));
				return this.#a.set(t, {
					value: e?.[0],
					node: i
				}), i;
			}
			if (!((e?.[1] == null || e?.[1] < 0 || typeof e?.[1] != "number" || !r(e?.[1])) && (Array.isArray(t) || t instanceof Set))) {
				if (e?.[0] != null && (typeof e?.[0] == "object" || typeof e?.[0] == "function" || typeof e?.[0] == "symbol")) return this.#r.getOrInsertComputed(e?.[0], () => ec(this.#n(...e)));
				if (e?.[0] != null && t instanceof Set) return this.#i.getOrInsertComputed(e?.[0], () => ec(this.#n(...e)));
				if (e?.[0] != null) return this.#c?.uniquePrimitives && w(e?.[0]) ? this.#i.getOrInsertComputed(e?.[0], () => ec(this.#n(...e))) : ec(this.#n(...e));
			}
		};
	}
	_onUpdate(e, t, n, r = "") {
		this.#y();
	}
	[Symbol.dispose]() {
		this.#s?.(), this.#s = null, this.#_(), this.#d = !1;
		for (let e of this.#u) e.parentNode && e.parentNode.removeChild(e);
		this.#u.clear(), this.#l.parentNode?.removeChild(this.#l), this.#a.clear(), this.#i.clear(), this.#r = /* @__PURE__ */ new WeakMap(), this.#p = null;
	}
	*[Symbol.iterator]() {
		let e = 0;
		if (this.#m()) for (let t of this.#m()) yield this.mapper(t, e++);
	}
}, rc = (e, t, n = null) => new nc(e, t, n), ic = (e) => {
	if (typeof e == "function") return e;
	if (typeof e?.disconnect == "function") return () => e.disconnect?.();
	if (typeof e?.unsubscribe == "function") return () => e.unsubscribe?.();
}, ac = (e = {}) => ({
	capture: !!e.capture,
	passive: !e.prevent && !!e.passive
}), oc = (e, t) => {
	e && (t.prevent && e.preventDefault?.(), t.stop && e.stopPropagation?.());
}, sc = (e) => typeof e == "function" || typeof e?.handleEvent == "function", cc = (e, t) => typeof e == "function" ? e(t) : e.handleEvent(t), lc = (e) => Array.isArray(e) && e.length === 2 && sc(e[0]) && !!e[1] && typeof e[1] == "object" && !Array.isArray(e[1]), uc = (e, t = {}) => (n) => {
	let r = !1, i = null, a, o = () => {
		r || (r = !0, i && clearTimeout(i), i = null, a?.(), a = void 0);
	}, s = (e, a) => {
		if (r) return;
		oc(e, t);
		let s = () => {
			r || (n.commit(e, a), t.once && o());
		}, c = Math.max(0, Number(t.debounce) || 0);
		c > 0 ? (i && clearTimeout(i), i = setTimeout(s, c)) : s();
	};
	return a = ic(e({
		...n,
		commit: s
	})), o;
}, dc = (e, t) => {
	if (!e || !t) return () => {};
	let n = [];
	for (let [r, i] of Object.entries(t)) {
		let t = lc(i) ? [i] : Array.isArray(i) ? i : [i];
		for (let i of t) {
			let [t, a] = lc(i) ? i : [i, {}];
			if (!sc(t)) continue;
			let o = !1, s = null, c = null, l = () => {
				o || (o = !0, s && clearTimeout(s), s = null, c?.(), c = null);
			}, u = (e) => {
				if (o) return;
				oc(e, a);
				let n = () => {
					o || (cc(t, e), a.once && l());
				}, r = Math.max(0, Number(a.debounce) || 0);
				r > 0 ? (s && clearTimeout(s), s = setTimeout(n, r)) : n();
			}, d = ac(a);
			e.addEventListener(r, u, d), c = () => e.removeEventListener(r, u, d), n.push(l);
		}
	}
	return () => n.forEach((e) => e());
}, fc = (e, t = document.documentElement) => {
	if (e?.value == null) return Bs(e, t);
	let n = Bs(e?.value, t);
	return I(e, (e, t) => n?._updateSelector(e)), n;
}, pc = (e) => {
	if (typeof e == "string") {
		let t = fc(bi(e));
		return t?.element ?? t;
	}
	return e instanceof HTMLElement || e instanceof Element || e instanceof DocumentFragment || e instanceof Document || e instanceof Node ? e : null;
}, mc = (e) => e == null || e === !1 ? null : t(e) ? e : e instanceof Node ? [e] : typeof e == "object" || typeof e == "function" ? e : [e], hc = (e, t = {}, n) => {
	let r = V(typeof e == "string" ? pc(e) : e, null, -1), i = mc(n);
	return r && i != null && rc(i, (e) => e, r), r && t && (t.ctrls != null && Ja(r, t.ctrls), t.attributes != null && Ws(r, t.attributes), t.properties != null && Ys(r, t.properties), t.classList != null && Xs(r, t.classList), t.behaviors != null && qi(r, t.behaviors), t.dataset != null && Ks(r, t.dataset), t.stores != null && $i(r, t.stores), t.mixins != null && ea(r, t.mixins), t.style != null && qs(r, t.style), t.aria != null && Gs(r, t.aria), "checked" in t && eo(r, "checked", t.checked, xa, t, !0), "value" in t && eo(r, "value", t.value, xa, t, !0), "valueAsNumber" in t && eo(r, "valueAsNumber", t.valueAsNumber, xa, t, !0), "placeholder" in t && eo(r, "placeholder", t.placeholder, xa, t, !0), t.is != null && eo(r, "is", t.is, B, t, !0), t.role != null && eo(r, "role", t.role, xa, t), t.slot != null && eo(r, "slot", t.slot, xa, t), t.part != null && eo(r, "part", t.part, B, t, !0), t.name != null && eo(r, "name", t.name, B, t, !0), t.type != null && eo(r, "type", t.type, B, t, !0), t.icon != null && eo(r, "icon", t.icon, B, t, !0), t.inert != null && eo(r, "inert", t.inert, B, t, !0), t.hidden != null && eo(r, "hidden", t.visible ?? t.hidden, ba, t), t.on != null && Fn(r, Symbol.dispose, dc(r, t.on)), t.rules != null && t.rules.forEach?.((e) => Js(r, e))), Bs(r);
}, gc = (e, t) => typeof t == "number" && t < 0 || typeof t == "string" && !t || t == null ? { element: "" } : e instanceof Map || typeof e?.get == "function" ? e.get(t) : e instanceof Set || typeof e?.has == "function" ? e.has(t) ? t : null : e?.[t] ?? { element: "" }, _c = (e, t, n = null) => V(gc(e, t), null, -1, n), vc = class {
	#e = document.createComment("");
	current;
	mapped;
	boundParent = null;
	constructor(e, t) {
		this.#e = document.createComment(""), this.current = e?.current ?? { value: -1 }, this.mapped = e?.mapped ?? t ?? [];
		let n = I([e?.current, "value"], (e, t, n) => this._onUpdate(e, t, n));
		n && Fn(this, Symbol.dispose, n);
	}
	get element() {
		let e = _c(this.mapped, this.current?.value ?? -1, this.boundParent) ?? this.#e, t = L(e?.parentElement) ? e?.parentElement : this.boundParent;
		return this.boundParent ??= L(t) ?? this.boundParent, e != null && (e?.parentNode != this.boundParent || !e?.parentNode) && this.boundParent && ms(this.boundParent, e), queueMicrotask(() => {
			let t = L(e?.parentElement) ? e?.parentElement : this.boundParent;
			this.boundParent ??= L(t) ?? this.boundParent;
		}), e;
	}
	elementForPotentialParent(e) {
		return L(e) && (this.boundParent = e), this.current?.[Cn]?.(), this.element;
	}
	_onUpdate(e, t, n) {
		let r = e ?? this.current?.value;
		if (!n || S(r, n)) {
			let e = n ?? this.current?.value;
			this.current && (this.current.value = r ?? -1);
			let t = _c(this.mapped, e ?? r ?? -1)?.parentNode ?? this.boundParent;
			this.boundParent = t ?? this.boundParent;
			let i = _c(this.mapped, r ?? -1, t) ?? this.#e, a = _c(this.mapped, e ?? -1, t);
			if (R(t)) {
				if (R(i)) {
					if (R(a)) try {
						ys(t, a, i);
					} catch (e) {
						console.warn(e);
					}
					else ms(t, i);
				} else a && !i && xs(t, a);
			}
		}
	}
}, yc = class {
	constructor() {}
	set(e, t, n) {
		return Reflect.set(_c(e?.mapped, e?.current?.value ?? -1) ?? e, t, n);
	}
	has(e, t) {
		return Reflect.has(_c(e?.mapped, e?.current?.value ?? -1) ?? e, t);
	}
	get(e, t, n) {
		return t == "elementForPotentialParent" && (t in e || e?.[t] != null) ? e?.elementForPotentialParent?.bind(e) : t == "element" && (t in e || e?.[t] != null) ? e?.element : t == "_onUpdate" && (t in e || e?.[t] != null) ? e?._onUpdate?.bind(e) : x(_c(e?.mapped, e?.current?.value ?? -1) ?? e, t);
	}
	ownKeys(e) {
		return Reflect.ownKeys(_c(e?.mapped, e?.current?.value ?? -1) ?? e);
	}
	apply(e, t, n) {
		return Reflect.apply(_c(e?.mapped, e?.current?.value ?? -1) ?? e, t, n);
	}
	deleteProperty(e, t) {
		return Reflect.deleteProperty(_c(e?.mapped, e?.current?.value ?? -1) ?? e, t);
	}
	setPrototypeOf(e, t) {
		return Reflect.setPrototypeOf(_c(e?.mapped, e?.current?.value ?? -1) ?? e, t);
	}
	getPrototypeOf(e) {
		return Reflect.getPrototypeOf(_c(e?.mapped, e?.current?.value ?? -1) ?? e);
	}
	defineProperty(e, t, n) {
		return Reflect.defineProperty(_c(e?.mapped, e?.current?.value ?? -1) ?? e, t, n);
	}
	getOwnPropertyDescriptor(e, t) {
		return Reflect.getOwnPropertyDescriptor(_c(e?.mapped, e?.current?.value ?? -1) ?? e, t);
	}
	preventExtensions(e) {
		return Reflect.preventExtensions(_c(e?.mapped, e?.current?.value ?? -1) ?? e);
	}
	isExtensible(e) {
		return Reflect.isExtensible(_c(e?.mapped, e?.current?.value ?? -1) ?? e);
	}
}, bc = (e, t) => te?.getOrInsertComputed?.(e, () => new Proxy(e instanceof vc ? e : new vc(e, t), new yc())), xc = Symbol.for("fest.jsx.Fragment"), Sc = (e, t = {}, n, ...r) => {
	let i = {}, a, o = {}, s = {}, c = {}, l = {}, u = {}, d = {};
	for (let n in t) if (n == "ref") typeof e != "function" && (a = typeof t[n] == "function" ? Bs(t[n]) : t[n]);
	else if (n == "classList") c = t[n];
	else if (n == "style") l = t[n];
	else if (n?.startsWith?.("@")) {
		let e = n.replace("@", "").trim();
		e ? ee(d, e, t[n]) : d = t[n];
	} else if (n?.startsWith?.("on:")) {
		let e = n.replace("on:", "").trim();
		e ? ee(d, e, t[n]) : d = t[n];
	} else if (n?.startsWith?.("prop:")) {
		let e = n.replace("prop:", "").trim();
		e ? s[e] = t[n] : s = t[n];
	} else if (n?.startsWith?.("attr:")) {
		let e = n.replace("attr:", "").trim();
		e ? o[e] = t[n] : o = t[n];
	} else if (n?.startsWith?.("ctrl:")) {
		let e = n.replace("ctrl:", "").trim();
		e ? u.set(e, t[n]) : u = t[n];
	} else n !== "children" && n !== "key" && (o[n.trim()] = t[n]);
	Object.assign(i, {
		attributes: o,
		properties: s,
		classList: c,
		style: l,
		on: d
	});
	let f = t?.children, p = Array.isArray(n) ? n : r?.length > 0 ? [n, ...r] : n == null ? f ?? null : (typeof n == "object" || typeof n == "function") && !(n instanceof Node) || n instanceof DocumentFragment ? n : [n];
	if (e == xc) return hc(document.createDocumentFragment(), i, p);
	if (typeof e == "function") return e(t, p);
	if (e == "For") return rc(t, p);
	if (e == "Switch") return bc(t, p);
	let m = hc(e, i, p);
	return m && (Promise.try(() => {
		a && (typeof a == "function" ? a?.(m) : a.value = m);
	})?.catch?.(console.warn.bind(console)), m);
};
globalThis.createElement = Sc, globalThis.Fragment = xc, globalThis.render = Sc;
//#endregion
//#region ../../projects/lur.e/src/interactive/tasking/History.ts
var Cc = Ur({
	index: 0,
	length: 0,
	action: "MANUAL",
	view: "",
	canBack: !1,
	canForward: !1,
	entries: []
});
typeof history < "u" && history.pushState.bind(history), typeof history < "u" && history.replaceState.bind(history), typeof history < "u" && history.go.bind(history), typeof history < "u" && history.forward.bind(history), typeof history < "u" && history.back.bind(history);
var wc = (e, t = !1) => {
	let n = e.startsWith("#") ? e : `#${e}`;
	if (t && Cc?.index > 0) {
		let e = Cc?.entries?.[Cc?.index - 1];
		if (e && e.view === n) {
			history.back();
			return;
		}
	}
	t ? (Cc?.entries?.[Cc.index]?.view !== n || Cc?.entries?.[Cc.index]?.view) && history?.replaceState?.(null, "", n) : history?.pushState?.(null, "", n);
}, Tc = /* @__PURE__ */ function(e) {
	return e[e.CONTEXT_MENU = 100] = "CONTEXT_MENU", e[e.DROPDOWN = 90] = "DROPDOWN", e[e.MODAL = 80] = "MODAL", e[e.DIALOG = 70] = "DIALOG", e[e.SIDEBAR = 60] = "SIDEBAR", e[e.OVERLAY = 50] = "OVERLAY", e[e.PANEL = 40] = "PANEL", e[e.TOAST = 30] = "TOAST", e[e.TASK = 20] = "TASK", e[e.VIEW = 10] = "VIEW", e[e.DEFAULT = 0] = "DEFAULT", e;
}({}), Ec = Symbol.for("lure@localStorageLinkMap");
globalThis[Ec] ??= /* @__PURE__ */ new Map();
var Dc = globalThis[Ec], Oc = (e) => {
	if (!e) return;
	if (typeof e == "function") return e;
	let t = e;
	if (typeof t?.disconnect == "function") return () => t.disconnect?.();
	if (typeof t?.unsubscribe == "function") return () => t.unsubscribe?.();
}, kc = (e, t) => {
	let n = e?.[Sn];
	return typeof n?.without == "function" ? n.without(["setter", "set"], t) : D(e, t);
}, Ac = (e, t, n = "value") => !e || typeof e != "object" && typeof e != "function" ? t : S(e[n], t) ? kc(e, () => {
	e[n] = t;
}) : t, jc = (e, t, n = "input") => {
	let r = t?.target ?? e;
	return r?.matches?.(n) ? r : r?.querySelector?.(n) ?? e;
}, Mc = (e, t = {}) => {
	let n = Array.isArray(e) ? e : [e], r = ac(t);
	return uc(({ source: e, commit: t }) => {
		let i = e?.element ?? e?.self ?? e;
		if (!i?.addEventListener) return;
		let a = (e) => t(e);
		return n.forEach((e) => i.addEventListener(e, a, r)), () => n.forEach((e) => i.removeEventListener?.(e, a, r));
	}, t);
}, Nc = (e) => ({ source: t, commit: n }) => {
	let r = t?.element ?? t?.self ?? t;
	if (!r || typeof MutationObserver > "u") return;
	let i = new MutationObserver((t) => {
		(!e || t.some((t) => t.type == "attributes" && t.attributeName == e)) && n(t);
	});
	return i.observe(r, {
		attributes: !0,
		attributeFilter: e ? [e] : void 0
	}), () => i.disconnect();
}, Pc = (e) => {
	let t = typeof e.source == "function" ? e.source() : e.source, n = e.forProp ?? "value", r = {
		source: t,
		ref: e.ref,
		forProp: n,
		get(i, a = n) {
			return e.getter?.({
				source: t,
				ref: r.ref,
				linker: r,
				forProp: a,
				event: i,
				reason: i ? "source" : "manual"
			});
		},
		set(i, a, o = n) {
			return e.setter?.(i, {
				source: t,
				ref: r.ref,
				linker: r,
				forProp: o,
				event: a,
				reason: "ref"
			});
		},
		store(i, a, o = n) {
			let s = {
				source: t,
				ref: r.ref,
				linker: r,
				forProp: o,
				event: a,
				reason: "source"
			};
			return e.store ? e.store(i, s) : Ac(r.ref, i, o);
		},
		trigger(e, t = n) {
			let i = r.get(e, t);
			return r.store(i, e, t);
		},
		bind() {
			r.unbind(), e.bindImmediately && r.trigger();
			let i = Oc(e.trigger?.({
				source: t,
				ref: r.ref,
				linker: r,
				forProp: n,
				reason: "initial",
				commit: (e, t = n) => r.trigger(e, t)
			})), a = r.ref && e.setter ? I([r.ref, n], (e) => {
				r.set(e, void 0, n);
			}, {
				affectTypes: e.affectTypes ?? ["setter", "manual"],
				triggerImmediately: e.triggerImmediately ?? !0
			}) : null;
			return r.__cleanup = () => {
				i?.(), a?.();
			}, r;
		},
		unbind() {
			r.__cleanup?.(), r.__cleanup = null;
		},
		[Symbol.dispose]() {
			r.unbind();
		},
		__cleanup: null
	};
	return r;
}, Fc = (e, t, n, r) => {
	if (n != null) return Dc.has(n) && (Dc.get(n)?.[0]?.(), Dc.delete(n)), Dc.getOrInsertComputed?.(n, () => {
		let i = (e ?? localStorage).getItem(n) ?? r?.value ?? r, a = d(t) ? t : Ir(i);
		a.value ??= i;
		let o = new WeakRef(a), s = I([a, "value"], (t) => {
			D(o?.deref?.(), () => {
				(e ?? localStorage).setItem(n, t);
			});
		}), c = (t) => {
			t.storageArea == (e ?? localStorage) && t.key == n && S(a.value, t.newValue) && (a.value = t.newValue);
		};
		return addEventListener("storage", c), [() => {
			s?.(), removeEventListener("storage", c);
		}, a];
	});
}, Ic = (e, t, n) => {
	if (n == null) return;
	let r = e ?? matchMedia(n), i = r?.matches || !1, a = d(t) ? t : Lr(i);
	a.value ??= i;
	let o = (e) => a.value = e.matches;
	return r?.addEventListener?.("change", o), () => {
		r?.removeEventListener?.("change", o);
	};
}, Lc = (e, t, n, r) => {
	let i = e?.getAttribute?.(n) ?? (typeof r == "boolean" ? r ? "" : null : a(r));
	if (!e) return;
	let o = d(t) ? t : Ir(i);
	T(o) && !l(o.value) && (o.value = l(i) ?? o.value ?? "");
	let s = Pc({
		source: e,
		ref: o,
		getter: ({ source: e }) => e?.getAttribute?.(n),
		setter: (e, { source: t }) => B(t, n, l(e)),
		trigger: Nc(n)
	}).bind();
	return () => s.unbind();
}, Rc = (e, t, n, r) => {
	let i = r == "border-box" ? e?.[n == "inline" ? "offsetWidth" : "offsetHeight"] : e?.[n == "inline" ? "clientWidth" : "clientHeight"] - Ot(e, n), a = d(t) ? t : Fr(i);
	T(a) && (a.value ||= (i ?? a.value) || 1);
	let o = new ResizeObserver((e) => {
		T(a) && (r == "border-box" && (a.value = n == "inline" ? e[0].borderBoxSize[0].inlineSize : e[0].borderBoxSize[0].blockSize), r == "content-box" && (a.value = n == "inline" ? e[0].contentBoxSize[0].inlineSize : e[0].contentBoxSize[0].blockSize), r == "device-pixel-content-box" && (a.value = n == "inline" ? e[0].devicePixelContentBoxSize[0].inlineSize : e[0].devicePixelContentBoxSize[0].blockSize));
	});
	return (e?.element ?? e?.self ?? e) instanceof HTMLElement && o?.observe?.(e?.element ?? e?.self ?? e, { box: r }), () => o?.disconnect?.();
}, zc = (e, t, n, r) => {
	r != null && typeof (r?.value ?? r) == "number" && e?.scrollTo?.({ [n == "block" ? "top" : "left"]: r?.value ?? r });
	let i = e?.[n == "block" ? "scrollTop" : "scrollLeft"], a = d(t) ? t : Fr(i || 0);
	T(a) && (a.value ||= (i ?? a.value) || 1), a.value ||= (i ?? a.value) || 0;
	let o = n == "block" ? "scrollTop" : "scrollLeft", s = n == "block" ? "top" : "left", c = Pc({
		source: e,
		ref: a,
		getter: ({ source: e }) => e?.[o] || 0,
		setter: (e, { source: t }) => {
			Math.abs((t?.[o] || 0) - Number(e || 0)) > .001 && t?.scrollTo?.({ [s]: Number(e || 0) });
		},
		trigger: Mc("scroll", { passive: !0 })
	}).bind();
	return () => c.unbind();
}, Bc = (e, t) => {
	let n = !!e?.checked || !1, r = d(t) ? t : Lr(n);
	T(r) && r.value !== n && (r.value = n);
	let i = Pc({
		source: (e?.type == "radio" ? e?.closest?.("input[type='radio']") : e) ?? e,
		ref: r,
		getter: ({ source: t, event: n }) => jc(t, n, "input[type=\"checkbox\"], input:checked")?.checked ?? e?.checked ?? r?.value,
		setter: (t) => {
			e && e?.checked != t && vi(e, t);
		},
		trigger: Mc([
			"click",
			"input",
			"change"
		])
	}).bind();
	return () => i.unbind();
}, Vc = (e, t) => {
	if (w(e) || !e || !(e instanceof Node || e?.element instanceof Node)) return;
	let n = e?.value ?? "", r = d(t) ? t : Ir(n);
	T(r) && !l(r.value) && (r.value = l(n) ?? r.value ?? "");
	let i = Pc({
		source: e,
		ref: r,
		getter: ({ source: e, event: t }) => jc(e, t)?.value ?? e?.value ?? r?.value ?? "",
		setter: (e, { source: t }) => {
			let n = ae(e);
			t && S(t?.value, n) && (t.value = n ?? "", t?.dispatchEvent?.(new Event("change", { bubbles: !0 })));
		},
		trigger: Mc([
			"click",
			"input",
			"change"
		])
	}).bind();
	return () => i.unbind();
}, Hc = (e, t) => {
	if (w(e) || !e || !(e instanceof Node || e?.element instanceof Node)) return;
	let n = Number(e?.valueAsNumber) || 0, r = d(t) ? t : Fr(n);
	T(r) && !r.value && n && (r.value = n);
	let i = Pc({
		source: e,
		ref: r,
		getter: ({ source: e, event: t }) => Number(jc(e, t)?.valueAsNumber || e?.valueAsNumber || 0) || 0,
		setter: (e, { source: t }) => {
			t && (t.type == "range" || t.type == "number") && typeof t?.valueAsNumber == "number" && S(t?.valueAsNumber, e) && (t.valueAsNumber = Number(e), t?.dispatchEvent?.(new Event("change", { bubbles: !0 })));
		},
		trigger: Mc([
			"click",
			"input",
			"change"
		])
	}).bind();
	return () => i.unbind();
}, Uc = (e) => {
	let t = [], n = (e) => {
		e && typeof e == "object" && "value" in e ? t.push(e) : Array.isArray(e) ? e.forEach(n) : e && typeof e == "object" && Object.values(e).forEach(n);
	};
	return n(e), t;
}, Wc = (e, t) => {
	let n = () => e.map((e) => e && typeof e == "object" && "value" in e ? e.value : e), r = t(...n());
	if (typeof r == "number") {
		let i = Fr(r), a = () => {
			i.value = t(...n());
		};
		return Uc(e).forEach((e) => I(e, a)), i;
	}
	let i = r, a = () => {
		i = t(...n());
	};
	return Uc(e).forEach((e) => I(e, a)), i;
}, Gc = (e, t, n, ...r) => {
	if (n == Lc || n == B) {
		let t = Ba?.get?.(e)?.get?.(B)?.get?.(r[0])?.[0];
		if (t) return t;
	}
	let i = (t ?? Hr)?.(null), a = n?.(e, i, ...r), o = a && typeof a == "object" && typeof a?.unbind == "function" ? a : null, s = o?.ref ?? i, c = o ? () => o.unbind() : a;
	return c && s && Fn(s, Symbol.dispose, c), s;
}, Kc = (e, ...t) => Gc(e, Ir, Lc, ...t), qc = (e, ...t) => Gc(e, Ir, Vc, ...t), Jc = (e, ...t) => Gc(e, Fr, Hc, ...t), Yc = (...e) => {
	if (Dc.has(e[0])) return Dc.get(e[0])?.[1];
	let t = Fc, n = (Ir ?? Hr)?.(null), [r, i] = t?.(null, n, ...e);
	return r && n && Fn(n, Symbol.dispose, r), n;
}, Xc = (e, ...t) => Gc(e, Fr, Rc, ...t), Zc = (e, ...t) => Gc(e, Lr, Bc, ...t), Qc = (e, ...t) => Gc(e, Fr, zc, ...t), $c = (...e) => Gc(null, Lr, Ic, ...e);
//#endregion
//#region ../../projects/lur.e/src/lure/misc/Normalizer.ts
function el(e, t = 4) {
	let n = 0;
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		if (i === " ") n += 1;
		else if (i === "	") n += t - n % t;
		else break;
	}
	return n;
}
function tl(e, t, n = 4) {
	let r = 0, i = 0;
	for (; i < e.length && r < t;) {
		let t = e[i];
		if (t === " ") r += 1, i++;
		else if (t === "	") r += n - r % n, i++;
		else break;
	}
	return e.slice(i);
}
function nl(e) {
	return e.includes("\r\n") ? "\r\n" : e.includes("\r") ? "\r" : "\n";
}
function rl(e, t) {
	for (e = Math.abs(e), t = Math.abs(t); t;) [e, t] = [t, e % t];
	return e;
}
function il(e, { ignoreFirstLine: t = !0, tabWidth: n = 4 } = {}) {
	let r = e.split(/\r\n|\n|\r/), i = +!!t, a = [];
	for (let e = i; e < r.length; e++) {
		let t = r[e];
		t.trim() !== "" && a.push(el(t, n));
	}
	if (a.length === 0) return {
		min: 0,
		step: 0,
		allEven: !0,
		allDiv4: !0
	};
	let o = Math.min(...a), s = a.map((e) => e - o).filter((e) => e > 0), c = 0;
	for (let e of s) c = c ? rl(c, e) : e;
	let l = a.every((e) => e % 2 == 0), u = a.every((e) => e % 4 == 0);
	return c = c === 0 ? u ? 4 : l ? 2 : 1 : c % 4 == 0 ? 4 : c % 2 == 0 ? 2 : 1, {
		min: o,
		step: c,
		allEven: l,
		allDiv4: u
	};
}
function al(e, t, n = "floor", r = 4) {
	if (!t || t <= 1) return e;
	let i = el(e, r);
	if (i === 0) return e;
	let a;
	a = n === "nearest" ? Math.round(i / t) * t : n === "ceil" ? Math.ceil(i / t) * t : Math.floor(i / t) * t;
	let o = i - a;
	return o > 0 ? tl(e, o, r) : o < 0 ? " ".repeat(-o) + e : e;
}
function ol(e, { scope: t = "void-only" } = {}) {
	if (!e || typeof e != "string") return e;
	let n = /* @__PURE__ */ new Set([
		"area",
		"base",
		"br",
		"col",
		"embed",
		"hr",
		"img",
		"input",
		"link",
		"meta",
		"param",
		"source",
		"track",
		"wbr"
	]), r = "", i = 0, a = e.length;
	for (; i < a;) {
		let o = e[i];
		if (o !== "<") {
			r += o, i++;
			continue;
		}
		if (e.startsWith("<!--", i)) {
			let t = e.indexOf("-->", i + 4);
			if (t === -1) {
				r += e.slice(i);
				break;
			}
			r += e.slice(i, t + 3), i = t + 3;
			continue;
		}
		if (e[i + 1] === "!" || e[i + 1] === "?") {
			let t = e.indexOf(">", i + 2);
			if (t === -1) {
				r += e.slice(i);
				break;
			}
			r += e.slice(i, t + 1), i = t + 1;
			continue;
		}
		if (e[i + 1] === "/") {
			let t = e.indexOf(">", i + 2);
			if (t === -1) {
				r += e.slice(i);
				break;
			}
			r += e.slice(i, t + 1), i = t + 1;
			continue;
		}
		let s = i + 1;
		for (; s < a && /\s/.test(e[s]);) s++;
		let c = s;
		for (; s < a && /[A-Za-z0-9:-]/.test(e[s]);) s++;
		let l = e.slice(c, s).toLowerCase(), u = s, d = null;
		for (; u < a;) {
			let t = e[u];
			if (d) t === d && (d = null), u++;
			else if (t === "\"" || t === "'") d = t, u++;
			else if (t === ">") break;
			else u++;
		}
		if (u >= a) {
			r += e.slice(i);
			break;
		}
		let f = e.slice(i, u + 1);
		if (!(t === "all" || t === "input-only" && l === "input" || t === "void-only" && n.has(l))) {
			r += f, i = u + 1;
			continue;
		}
		let p = "", m = null, h = !1;
		for (let e = 0; e < f.length; e++) {
			let t = f[e];
			if (m) {
				p += t, t === m && (m = null);
				continue;
			}
			if (t === "\"" || t === "'") {
				m = t, p += t, h = !1;
				continue;
			}
			if (t === "\n" || t === "\r" || t === "	" || t === " ") {
				h ||= (p += " ", !0);
				continue;
			}
			p += t, h = !1;
		}
		p = p.replace(/\s*(\/?)\s*>$/, "$1>"), r += p, i = u + 1;
	}
	return r;
}
function sl(e, { preserveCommentGaps: t = !0 } = {}) {
	if (!e || typeof e != "string") return e;
	if (!t) return e.replace(/>\s+</g, "><");
	let n = e;
	return n = n.replace(/-->([^\S\r\n]+)<!--/g, "--><!--").replace(/-->([^\S\r\n]+)</g, "--><").replace(/>([^\S\r\n]+)<!--/g, "><!--"), n = n.replace(/>\s+</g, "><"), n = n.replace(/* @__PURE__ */ RegExp("", "g"), " "), n;
}
function cl(e, { normalizeIndent: t = !0, ignoreFirstLine: n = !0, tabWidth: r = 4, alignStep: i = "auto", quantize: a = "none" } = {}) {
	if (!e || typeof e != "string" || e.indexOf("<") === -1) return e;
	e = e?.trim?.();
	let o = [], s = e.replace(/<(pre|textarea|script|style)\b[\s\S]*?<\/\1>/gi, (e) => `\u0000${o.push(e) - 1}\u0000`), c = nl(s), l = s.split(/\r\n|\n|\r/), u = +!!n, { min: d, step: f } = il(s, {
		ignoreFirstLine: n,
		tabWidth: r
	});
	if (t && d > 0) for (let e = u; e < l.length; e++) {
		let t = l[e];
		t.trim() !== "" && (l[e] = tl(t, d, r));
	}
	let p = i === "auto" ? f : i;
	if (a !== "none" && p > 1) for (let e = u; e < l.length; e++) {
		let t = l[e];
		t.trim() !== "" && (l[e] = al(t, p, a, r));
	}
	let m = l.join(c);
	return m = ol(m, { scope: "void-only" }), m = sl(m), m.replace(/\u0000(\d+)\u0000/g, (e, t) => o[+t])?.trim?.();
}
function ll(e, ...t) {
	let n = t?.[0] ?? "", r = e.indexOf(n);
	if (r < 0) {
		let e = t?.join?.("") ?? "";
		return /<([A-Za-z\/!?])[\w\W]*$/.test(e) && !/>[\w\W]*$/.test(e);
	}
	let i = e.slice(0, r + 1).join(""), a = !1, o = !1, s = !1;
	for (let e = 0; e < i.length; e++) {
		let t = i[e], n = i[e + 1] ?? "";
		if (!a) {
			t === "<" && /[A-Za-z\/!?]/.test(n) && (a = !0, o = !1, s = !1);
			continue;
		}
		if (!o && !s) {
			if (t === "\"") {
				s = !0;
				continue;
			}
			if (t === "'") {
				o = !0;
				continue;
			}
			if (t === ">") {
				a = !1;
				continue;
			}
		} else if (s) {
			if (t === "\"") {
				s = !1;
				continue;
			}
		} else if (o && t === "'") {
			o = !1;
			continue;
		}
	}
	return a;
}
//#endregion
//#region ../../projects/lur.e/src/lure/misc/Syntax.ts
var ul = Symbol.for("lure@EMap");
globalThis[ul] ??= /* @__PURE__ */ new WeakMap();
var dl = globalThis[ul], fl = (e) => {
	let t = e.match(/^([a-zA-Z0-9\-]+)?(?:#([a-zA-Z0-9\-_]+))?((?:\.[a-zA-Z0-9\-_]+)*)$/);
	if (!t) return {
		tag: e,
		id: null,
		className: null
	};
	let [, n = "div", r, i] = t;
	return {
		tag: n,
		id: r,
		className: i ? i.replace(/\./g, " ").trim() : null
	};
}, pl = (e) => {
	if (typeof e != "string" || !e?.trim?.()) return -1;
	let t = e.match(/^#\{(\d+)\}$/);
	if (t) return parseInt(t[1] ?? "-1", 10);
	let n = e.match(/#\{(\d+)\}/);
	return n ? parseInt(n[1] ?? "-1", 10) : -1;
}, ml = (e, t, n, r) => {
	if (!e) return e;
	let i = e.getAttribute("style"), a = i == null ? null : Bo(i, t);
	if (e != null) {
		let n = [], r = (t) => {
			let r = Array.from(e?.attributes || []).find((e) => e.name == t && e.value?.includes?.("#{"));
			if (r) {
				let e = [t, pl(r?.value) ?? -1];
				return n.push(e), e;
			}
			return [t, -1];
		};
		[
			"dataset",
			"style",
			"classList",
			"visible",
			"aria",
			"value",
			"checked",
			"valueAsNumber",
			"placeholder",
			"ref"
		].forEach((e) => {
			(e !== "style" || a == null) && r(e);
		});
		let i = (t, n) => {
			let r = [];
			for (let i of Array.from(e?.attributes || [])) {
				let e = Array.isArray(t) ? t?.some?.((e) => e == "") : t == "", a = (Array.isArray(t) ? t.find((e) => i.name?.startsWith?.(e)) : t = i.name?.startsWith?.(t) ? t : "") ?? "", o = i.name.trim()?.replace?.(a, ""), s = i.value?.includes?.("#{") && i.value?.includes?.("}"), c = pl(i?.value), l = Array.isArray(n) ? n?.some?.((e) => o?.startsWith?.(e)) : n == o;
				s && (a == "" && e || a != "") && c >= 0 && !l && r.push([o, c]);
			}
			return r;
		}, o = (t, n, r = "") => {
			let i = /* @__PURE__ */ new Map();
			for (let a of Array.from(e?.attributes || [])) {
				let e = Array.isArray(t) ? t?.some?.((e) => e == "") : t == "", o = (Array.isArray(t) ? t.find((e) => a.name?.startsWith?.(e)) : t = a.name?.startsWith?.(t) ? t : "") ?? "", s = a.name.trim()?.replace?.(o, ""), c = a.value?.includes?.("#{") && a.value?.includes?.("}"), l = pl(a?.value) ?? -1, u = Array.isArray(n) ? n?.some?.((e) => s?.startsWith?.(e)) : n == s, d = (Array.isArray(r) ? r?.some?.((e) => a.name === e) : a.name === r) && r !== "";
				if (c && (o == "" && e || o != "" || d) && l >= 0 && !u) {
					let e = d ? a.name : s;
					i.has(e) || i.set(e, []), i.get(e)?.push(l);
				}
			}
			return Array.from(i.entries());
		}, s = i(["prop:"], []), c = o(["on:", "@"], [], ""), l = o(["ref:"], [], ["ref"]), u = i(["attr:", ""], [
			"ref",
			"value",
			"placeholder",
			"checked",
			"valueAsNumber"
		]);
		a != null && (u = u.filter(([e]) => e !== "style"));
		let d = Object.fromEntries(n?.filter?.((e) => e[1] >= 0)?.map?.((e) => [e[0], t?.[e[1]] ?? null]) ?? []);
		d.attributes = Object.fromEntries(u?.filter?.((e) => e[1] >= 0)?.map?.((e) => [e[0], t?.[e[1]] ?? null]) ?? []), d.properties = Object.fromEntries(s?.filter?.((e) => e[1] >= 0)?.map?.((e) => [e[0], t?.[e[1]] ?? null]) ?? []), d.on = Object.fromEntries(c?.filter?.((e) => e[1]?.some?.((e) => e >= 0))?.map?.((e) => [e[0], e[1]?.map?.((e) => t?.[e]).filter((e) => e != null)]) ?? []), a?.kind === "direct" ? d.style = a.value : a?.kind === "template" && (d.style = a.binding), d.style == null && ro(d.attributes?.style) && (d.style = d.attributes.style, delete d.attributes.style);
		let f = (e) => typeof e == "object" && !!e && "value" in e;
		if (e?.matches?.("input, select, textarea")) {
			let t = () => {
				let t = e;
				if (f(d.value) && (t.type !== "radio" || t.checked)) {
					let e = t.valueAsNumber, n = e != null && !Number.isNaN(e) ? e : t.value;
					Object.is(d.value.value, n) || (d.value.value = n);
				}
				f(d.checked) && !Object.is(d.checked.value, t.checked) && (d.checked.value = t.checked), f(d.valueAsNumber) && !Object.is(d.valueAsNumber.value, t.valueAsNumber) && (d.valueAsNumber.value = t.valueAsNumber);
			};
			e.addEventListener("input", t, { passive: !0 }), e.addEventListener("change", t, { passive: !0 });
		}
		let p = n?.find?.((e) => e[0] == "ref" && e[1] >= 0)?.[1];
		if (p != null && p >= 0) {
			let n = t?.[p];
			typeof n == "function" ? n?.(e) : typeof n == "object" && n && (n.value = e);
		}
		l?.forEach?.((n) => {
			(n?.[1]?.filter?.((e) => e != null && e >= 0)?.map?.((e) => t?.[e])?.filter?.((e) => e != null))?.forEach?.((t) => {
				typeof t == "function" ? t?.(e) : typeof t == "object" && t && (t.value = e);
			});
		}), a?.kind === "static" && co(e, a.cssText), ((e) => {
			if (e == null) return;
			let t = (e) => u?.some?.((t) => t[0] == e) || n?.some?.((t) => t[0] == e) || e?.startsWith?.("ref:") || e == "ref";
			for (let n of Array.from(e?.attributes || [])) (n.value?.includes?.("#{") && n.value?.includes?.("}") && t(n.name) || n.value?.startsWith?.("#{") && n.value?.endsWith?.("}") || n.name?.includes?.(":") || n.name?.includes?.("ref:") || n.name == "ref") && e?.removeAttribute?.(n.name);
			for (let t of Array.from(e?.attributes || [])) typeof t.value == "string" && /#\{\d+\}/.test(t.value) && e?.removeAttribute?.(t.name);
		})(e), so(e), dl?.has?.(e) || dl?.set?.(e, hc(e, d));
	}
	return dl?.get?.(e) ?? e;
}, hl = (e, ...t) => {
	let n = [];
	for (let r = 0; r < e?.length; r++) {
		let i = e?.[r], a = t?.[r];
		n.push(bl(i)), n.push(a);
	}
	if (n?.length <= 1) return V(n?.[0], null, 0);
	let r = document.createDocumentFragment();
	return r.append(...n?.filter?.((e) => e != null)?.map?.((e, t) => V(e, null, t))?.filter?.((e) => e != null)), r;
};
function gl(e, ...t) {
	return e?.at?.(0)?.trim?.()?.startsWith?.("<") && e?.at?.(-1)?.trim?.()?.endsWith?.(">") ? yl({ createElement: null })(e, ...t) : hl(e, ...t);
}
var _l = (e) => e != null && e instanceof HTMLElement && !(e instanceof DocumentFragment || e instanceof HTMLBodyElement && e != document.body), vl = (e, t, n) => {
	n != null && (n.boundParent = e);
	let r = V(n, null, -1, e);
	R(r) ? r?.parentNode != e && !r?.contains?.(e) && r != null && t?.replaceWith?.(f(r) && (typeof r?.value == "object" || typeof r?.value == "function") && R(r?.value) ? r?.value : r) : t?.remove?.();
};
function yl({ createElement: e = null } = {}) {
	return function(e, ...t) {
		let n = [], r = [], i = [];
		for (let a = 0; a < e.length; a++) if (n.push(e?.[a] || ""), a < t.length) {
			if (e[a]?.trim()?.endsWith?.("<")) {
				let e = fl(t?.[a]);
				n.push(e.tag || "div"), e.id && n.push(` id="${e.id}"`), e.className && n.push(` class="${e.className}"`);
			} else {
				let o = ll(e, e?.[a] || "", e?.[a + 1] || ""), s = /[\w:\-\.\]]\s*=\s*$/.test(e[a]?.trim?.() ?? "") || e[a]?.trim?.()?.endsWith?.("="), c = e[a]?.trim?.()?.match?.(/['"]$/), l = e[a + 1]?.trim?.()?.match?.(/^['"]/) ?? c, u = c && l, d = s;
				if ((d || u) && o) {
					let e = d && !u, r = i.length;
					n.push((typeof t?.[a] == "string" ? t?.[a]?.trim?.() != "" : t?.[a] != null) ? e ? `"#{${r}}"` : `#{${r}}` : ""), i.push(t?.[a]);
				} else if (!o) {
					let e = r.length;
					n.push((typeof t?.[a] == "string" ? t?.[a]?.trim?.() != "" : t?.[a] != null) ? w(t?.[a]) ? String(t?.[a])?.trim?.() : `<!--o:${e}-->` : ""), r.push(t?.[a]);
				}
			}
		}
		let a = cl(n.join("").trim()), o = /* @__PURE__ */ new WeakMap(), s = new DOMParser().parseFromString(a, "text/html"), c = (s instanceof HTMLTemplateElement || s?.matches?.("template") ? s : s.querySelector("template"))?.content ?? s.body ?? s, l = document.createDocumentFragment(), u = Array.from(c.childNodes)?.filter((e) => e instanceof Node).map((e) => (!_l(e?.parentNode) && e?.parentNode != l && (e?.remove?.(), e != null && l?.append?.(e)), e)), d = [];
		return u.forEach((e) => {
			let t = e ? document.createTreeWalker(e, NodeFilter.SHOW_ALL, null) : null;
			do {
				let e = t?.currentNode;
				d.push(e);
			} while (t?.nextNode?.());
		}), d?.filter?.((e) => e?.nodeType == Node.COMMENT_NODE)?.forEach?.((e) => {
			if (e?.nodeValue?.trim?.()?.includes?.("o:") && Number.isInteger(parseInt(e?.nodeValue?.trim?.()?.slice?.(2) ?? "-1"))) {
				let t = r?.[parseInt(e?.nodeValue?.trim?.()?.slice?.(2) ?? "-1") ?? -1];
				if (t == null || t === void 0 || (typeof t == "string" ? t : null)?.trim?.() == "") e?.remove?.();
				else {
					let n = e?.parentNode;
					Array.isArray(t) || t instanceof Map || t instanceof Set ? vl?.(n, e, t = rc(t, null, n)) : t != null && vl?.(n, e, t);
				}
			}
			e?.isConnected && e?.remove?.();
		}), d?.filter((e) => e.nodeType == Node.ELEMENT_NODE)?.map?.((e) => {
			ml(e, i, r, o);
		}), Array.from(l?.childNodes)?.length > 1 ? l : l?.childNodes?.[0];
	};
}
var bl = (e, ...t) => {
	if (typeof e == "string") {
		if (e?.trim?.()?.startsWith?.("<") && e?.trim?.()?.endsWith?.(">")) {
			let t = new DOMParser().parseFromString(cl(e?.trim?.()), "text/html"), n = t.querySelector("template")?.content ?? t.body;
			if (n instanceof HTMLBodyElement) {
				let e = document.createDocumentFragment();
				return e.append(...Array.from(n.childNodes ?? [])), Array.from(e.childNodes)?.length > 1 ? e : e?.childNodes?.[0];
			}
			if (n instanceof DocumentFragment) return n;
			if (n?.childNodes?.length > 1) {
				let e = document.createDocumentFragment();
				return e.append(...Array.from(n?.childNodes ?? [])), e;
			}
			return n?.childNodes?.[0] ?? new Text(e);
		}
		return new Text(e);
	}
	return typeof e == "function" ? bl(e?.()) : Array.isArray(e) && t ? gl(e, ...t) : e instanceof Node ? e : V(e);
}, xl = Symbol.for("lur.e@propStore");
globalThis[xl] ??= /* @__PURE__ */ new WeakMap();
var Sl = globalThis[xl], Cl = Symbol.for("lur.e@CSM");
globalThis[Cl] ??= /* @__PURE__ */ new WeakMap();
var wl = globalThis[Cl], Tl = (e) => e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), El = (e) => {
	let t = Tl(e);
	return [
		"border-box",
		"content-box",
		"device-pixel-content-box"
	].indexOf(t) >= 0 ? t : null;
}, Dl = (e) => {
	let t = Tl(e);
	return t?.startsWith?.("inline") ? "inline" : t?.startsWith?.("block") ? "block" : null;
}, Ol = Symbol.for("@render@"), kl = Symbol.for("@defKeys@"), Al = typeof document < "u" ? document?.createElement?.("style") : null, jl = (e, t, n) => e == "attr" ? Kc.bind(null, t, n || "") : e == "media" ? $c : e == "query" ? (e) => Bs?.(n || e || "", t) : e == "query-shadow" ? (e) => Bs?.(n || e || "", t?.shadowRoot ?? t) : e == "localStorage" ? Yc : e == "inline-size" ? Xc.bind(null, t, "inline", El(n) || "border-box") : e == "content-box" ? Xc.bind(null, t, Dl(n) || "inline", "content-box") : e == "block-size" ? Xc.bind(null, t, "block", El(n) || "border-box") : e == "border-box" ? Xc.bind(null, t, Dl(n) || "inline", "border-box") : e == "scroll" ? Qc.bind(null, t, Dl(n) || "inline") : e == "device-pixel-content-box" ? Xc.bind(null, t, Dl(n) || "inline", "device-pixel-content-box") : e == "checked" ? Zc.bind(null, t) : e == "value" ? qc.bind(null, t) : e == "value-as-number" ? Jc.bind(null, t) : Hr;
Al && typeof document < "u" && document.querySelector?.("head")?.appendChild?.(Al);
var Ml = (e) => e == "query" || e == "query-shadow" ? "input" : e == "media" ? !1 : e == "localStorage" || e == "attr" ? null : e == "inline-size" || e == "block-size" || e == "border-box" || e == "content-box" || e == "scroll" || e == "device-pixel-content-box" ? 0 : e == "checked" ? !1 : e == "value" ? "" : e == "value-as-number" ? 0 : null;
Al && (Al.innerHTML = "@layer ux-preload {\n        :host { box-sizing: border-box; }\n    }");
function Nl(e) {
	let t = e.prototype ?? Object.getPrototypeOf(e) ?? e, n = t?.$init ?? e?.$init;
	return t.$init = function(...e) {
		n?.call?.(this, ...e);
		let t = {}, r = Object.getPrototypeOf(this) ?? this;
		for (; r;) {
			if (Object.hasOwn(r, kl)) {
				let e = Object.assign({}, Object.getOwnPropertyDescriptors(r), r[kl] ?? {});
				for (let n of Object.keys(e)) n in t || (t[n] = e[n]);
			}
			r = Object.getPrototypeOf(r);
		}
		for (let [e, n] of Object.entries(t)) {
			let t = typeof e == "string" && typeof this.getAttribute == "function" ? this.getAttribute(e) : null, r = this[e];
			n != null && Object.defineProperty(this, e, n);
			try {
				let n = t != null && String(t).length > 0 ? t : r;
				n != null && n !== "" && (this[e] = n);
			} catch {}
		}
		return this;
	}, e;
}
function Pl(e, t) {
	return function(n, r) {
		let i = globalThis?.customElements;
		try {
			if (!i || !e || typeof i.get != "function" || typeof i.define != "function") return n;
			let r = i.get(e);
			if (r) return r;
			i?.define?.(e, n, t);
		} catch (t) {
			if (t?.name === "NotSupportedError" || /has already been used|already been defined/i.test(t?.message || "")) return i?.get?.(e) ?? n;
			throw t;
		}
		return n;
	};
}
function Fl(e = {}) {
	let { attribute: t, source: n, name: r, from: i } = e;
	return function(e, a) {
		let o = typeof t == "string" ? t : r ?? a;
		if (t !== !1 && o != null) {
			let t = e.constructor;
			t.observedAttributes ||= [], t.observedAttributes.indexOf(o) < 0 && t.observedAttributes.push(o);
		}
		Object.hasOwn(e, kl) || (e[kl] = {}), e[kl][a] = {
			get() {
				let e = this, t = e[Ol], o = i ? i instanceof HTMLElement ? i : typeof i == "string" ? Bs?.(i, e) : e : e, s = Sl.get(e), c = s?.get?.(a);
				return c == null && n != null && (s || Sl.set(e, s = /* @__PURE__ */ new Map()), s?.has?.(a) || s?.set?.(a, c = jl(n, o, r || a)?.(Ml(n)))), t ? c : c?.element instanceof HTMLElement ? c?.element : n == "query" || n == "query-shadow" ? null : (typeof c == "object" || typeof c == "function") && (c?.value != null || "value" in c) ? c?.value : c;
			},
			set(e) {
				let t = this, o = i ? i instanceof HTMLElement ? i : typeof i == "string" ? Bs?.(i, t) : t : t, s = Sl.get(t), c = s?.get?.(a);
				if (c == null && n != null) {
					if (s || Sl.set(t, s = /* @__PURE__ */ new Map()), !s?.has?.(a)) {
						let t = (typeof e == "object" || typeof e == "function" ? e?.value : null) ?? e ?? Ml(n);
						s?.set?.(a, c = jl(n, o, r || a)?.(t));
					}
				} else if (typeof c == "object" || typeof c == "function") try {
					typeof e == "object" && e && (e?.value == null && !("value" in e) || typeof e?.value == "object" || typeof e?.value == "function") ? Object.assign(c, e?.value ?? e) : c.value = (typeof e == "object" || typeof e == "function" ? e?.value : null) ?? e;
				} catch (e) {
					console.warn("Error setting property value:", e);
				}
			},
			enumerable: !0,
			configurable: !0
		};
	};
}
var Il = (e) => !(e instanceof HTMLDivElement || e instanceof HTMLImageElement || e instanceof HTMLVideoElement || e instanceof HTMLCanvasElement) && !(e?.hasAttribute?.("is") || e?.getAttribute?.("is") != null);
function Ll(e) {
	let t = globalThis.HTMLElement ?? class {}, n = e ?? t, r = wl.get(n);
	if (r) return r;
	class i extends n {
		#e;
		#t;
		#n = !1;
		styleLibs = [];
		adoptedStyleSheets = [];
		get styles() {}
		get initialAttributes() {}
		styleLayers() {
			return [];
		}
		render(e) {
			return document.createElement("slot");
		}
		constructor(...e) {
			if (super(...e), Il(this)) {
				let e = pa(this.shadowRoot ?? this.createShadowRoot?.() ?? this.attachShadow({ mode: "open" })), t = this.#t ??= Al?.cloneNode?.(!0), n = e.querySelector("style[data-type=\"ux-layer\"]");
				n ? n.after(t) : e.prepend(t);
			}
			this.styleLibs ??= [];
		}
		$makeLayers() {
			return `@layer ${[
				"ux-preload",
				"ux-layer",
				...this.styleLayers?.() ?? []
			].join?.(",") ?? ""};`;
		}
		onInitialize(e) {
			return this;
		}
		onRender(e) {
			return this;
		}
		getProperty(e) {
			let t = this[Ol];
			this[Ol] = !0;
			let n = this[e];
			return this[Ol] = t, t || delete this[Ol], n;
		}
		loadStyleLibrary(e) {
			let t = this.shadowRoot, n = typeof e == "function" ? e?.(t) : e;
			if (n instanceof HTMLStyleElement) this.styleLibs?.push?.(n), this.#e?.isConnected ? this.#e?.before?.(n) : this.shadowRoot?.prepend?.(n);
			else if (n instanceof CSSStyleSheet) cn(this, n);
			else {
				let e = mt(n, "ux-layer");
				e instanceof Promise ? e.then((e) => cn(this, e)).catch(() => {}) : e && cn(this, e);
			}
			return this;
		}
		createShadowRoot() {
			return this.shadowRoot ?? this.attachShadow({ mode: "open" });
		}
		connectedCallback() {
			super.connectedCallback && super.connectedCallback();
			let e = new WeakRef(this);
			if (!this.#n) {
				this.#n = !0;
				let t = Il(this) ? this.createShadowRoot?.() ?? this.shadowRoot ?? this.attachShadow({ mode: "open" }) : this.shadowRoot, n = this.constructor, r = this.$init ?? n.prototype?.$init;
				typeof r == "function" && r.call(this);
				let i = typeof this.initialAttributes == "function" ? this.initialAttributes() : this.initialAttributes;
				if (hi(this, i), this.onInitialize?.call(this, e), this[Ol] = !0, Il(this) && t) {
					let n = this.render?.call?.(this, e) ?? document.createElement("slot"), r = null;
					try {
						r = gn(this, this.styles);
					} catch (e) {
						console.warn("Error applying host styles:", e);
					}
					r instanceof HTMLStyleElement && (this.#e = r);
					let i = [
						bl`<style data-type="ux-layer" prop:innerHTML=${this.$makeLayers()}></style>`,
						this.#t,
						...this.styleLibs.map((e) => e.cloneNode?.(!0)) || [],
						r,
						n
					].filter((e) => e != null && R(e));
					t.append(...i);
					let a = en.get(this) || [];
					a.length > 0 && (t.adoptedStyleSheets = [...a.filter((e) => !t.adoptedStyleSheets?.includes(e)), .../* @__PURE__ */ new Set([...t.adoptedStyleSheets || []])]);
				}
				this.onRender?.call?.(this, e), delete this[Ol], t && pa(t);
			}
			hn(this);
		}
		disconnectedCallback() {
			super.disconnectedCallback && super.disconnectedCallback();
		}
		adoptedCallback() {
			super.adoptedCallback && super.adoptedCallback(), hn(this);
		}
		attributeChangedCallback(e, t, n) {
			super.attributeChangedCallback && super.attributeChangedCallback(e, t, n), (e === "theme" || e === "data-theme" || e === "color-scheme" || e.endsWith("color-scheme")) && hn(this);
		}
	}
	let a = Nl(i);
	return wl.set(n, a), a;
}
//#endregion
//#region ../../projects/lur.e/src/interactive/controllers/LazyEvents.ts
var Rl = /* @__PURE__ */ new WeakMap(), zl = (e, t) => `${e}|c:${t?.capture ? "1" : "0"}|p:${t?.passive ? "1" : "0"}`, Bl = (e, t, n, r = {}) => {
	if (!e || typeof e.addEventListener != "function") return () => {};
	let i = {
		capture: !!r.capture,
		passive: !!r.passive
	}, a = zl(t, i), o = Rl.get(e);
	o || (o = /* @__PURE__ */ new Map(), Rl.set(e, o));
	let s = o.get(a);
	if (!s) {
		let n = /* @__PURE__ */ new Map(), r = (e) => {
			for (let t of Array.from(n.keys())) try {
				t(e);
			} catch (e) {
				console.warn(e);
			}
		};
		o.set(a, s = {
			handlers: n,
			listener: r,
			options: i
		}), e.addEventListener(t, r, i);
	}
	let c = n;
	s.handlers.set(c, (s.handlers.get(c) ?? 0) + 1);
	let l = !1;
	return () => {
		if (l) return;
		l = !0;
		let n = Rl.get(e), r = n?.get(a);
		if (!r) return;
		let i = r.handlers.get(c) ?? 0;
		if (i > 1) {
			r.handlers.set(c, i - 1);
			return;
		}
		r.handlers.delete(c), !(r.handlers.size > 0) && (e.removeEventListener(t, r.listener, r.options), n?.delete(a), n && n.size === 0 && Rl.delete(e));
	};
}, Vl = /* @__PURE__ */ new WeakMap(), Hl = (e) => {
	let t = e?.element ?? e;
	return t instanceof HTMLElement ? t : null;
}, Ul = (e, t, n) => e ? e === "handled" ? n : t : !1, Wl = (e, t, n = {
	capture: !0,
	passive: !1
}, r = {}) => {
	let i = e;
	if (!i || typeof i.addEventListener != "function") return (e, t) => () => {};
	let a = {
		capture: !!n.capture,
		passive: !!n.passive
	}, o = r.strategy ?? "closest", s = `${t}|c:${a.capture ? "1" : "0"}|p:${a.passive ? "1" : "0"}|s:${o}|pd:${String(r.preventDefault ?? "")}|sp:${String(r.stopPropagation ?? "")}|sip:${String(r.stopImmediatePropagation ?? "")}`, c = Vl.get(i);
	c || (c = /* @__PURE__ */ new Map(), Vl.set(i, c));
	let l = c.get(s);
	if (!l) {
		let e = /* @__PURE__ */ new Map();
		l = {
			targets: e,
			unbindGlobal: null,
			options: a,
			strategy: o,
			config: r,
			dispatch: (t) => {
				let n = !1, i = !1, a = (e) => {
					if (!(!e || e.size === 0)) {
						n = !0;
						for (let n of Array.from(e)) n(t) && (i = !0);
					}
				}, s = t?.composedPath?.();
				if (Array.isArray(s)) {
					if (o === "closest") for (let t of s) {
						let n = Hl(t);
						if (!n) continue;
						let r = e.get(n);
						if (r) {
							a(r);
							break;
						}
					}
					else for (let t of s) {
						let n = Hl(t);
						n && a(e.get(n));
					}
				} else {
					let n = Hl(t?.target);
					for (; n;) {
						let t = e.get(n);
						if (t && (a(t), o === "closest")) break;
						let r = n.getRootNode?.();
						n = n.parentElement || (r instanceof ShadowRoot ? r.host : null);
					}
				}
				Ul(r.preventDefault, n, i) && t?.preventDefault?.(), Ul(r.stopImmediatePropagation, n, i) && t?.stopImmediatePropagation?.(), Ul(r.stopPropagation, n, i) && t?.stopPropagation?.();
			}
		}, c.set(s, l);
	}
	return (e, n) => {
		let r = Hl(e);
		if (!r) return () => {};
		l.targets.size === 0 && !l.unbindGlobal && (l.unbindGlobal = Bl(i, t, l.dispatch, l.options));
		let a = l.targets.get(r);
		return a || (a = /* @__PURE__ */ new Set(), l.targets.set(r, a)), a.add(n), () => {
			let t = Vl.get(i), r = t?.get(s);
			if (!r) return;
			let a = Hl(e);
			if (!a) return;
			let o = r.targets.get(a);
			o && (o.delete(n), o.size === 0 && r.targets.delete(a), r.targets.size === 0 && (r.unbindGlobal?.(), r.unbindGlobal = null, t?.delete(s), t && t.size === 0 && Vl.delete(i)));
		};
	};
};
typeof document < "u" && document?.documentElement;
//#endregion
//#region ../../projects/lur.e/src/interactive/controllers/PointerAPI.ts
var Gl = class {
	static add(e, t, n = "px") {
		return Wc([e, t], () => `calc(${e.value}${n} + ${t.value}${n})`);
	}
	static subtract(e, t, n = "px") {
		return Wc([e, t], () => `calc(${e.value}${n} - ${t.value}${n})`);
	}
	static multiply(e, t) {
		return Wc([e, t], () => `calc(${e.value} * ${t.value})`);
	}
	static divide(e, t) {
		return Wc([e, t], () => `calc(${e.value} / ${t.value})`);
	}
	static clamp(e, t, n, r = "px") {
		return Wc([
			e,
			t,
			n
		], () => `clamp(${t.value}${r}, ${e.value}${r}, ${n.value}${r})`);
	}
	static min(e, t, n = "px") {
		return Wc([e, t], () => `min(${e.value}${n}, ${t.value}${n})`);
	}
	static max(e, t, n = "px") {
		return Wc([e, t], () => `max(${e.value}${n}, ${t.value}${n})`);
	}
}, Kl = class {
	static width = Fr(typeof window < "u" ? window?.innerWidth : 0);
	static height = Fr(typeof window < "u" ? window?.innerHeight : 0);
	static init() {
		typeof window < "u" && window?.addEventListener?.("resize", () => {
			this.width.value = window?.innerWidth, this.height.value = window?.innerHeight;
		});
	}
	static center() {
		return {
			x: Gl.divide(this.width, Fr(2)),
			y: Gl.divide(this.height, Fr(2))
		};
	}
};
Kl.init(), Tc.CONTEXT_MENU, Tc.DROPDOWN, Tc.MODAL, Tc.DIALOG, Tc.SIDEBAR, Tc.OVERLAY, Tc.PANEL, Tc.TOAST, typeof document < "u" && document?.documentElement && Wl(document.documentElement, "contextmenu", {
	capture: !0,
	passive: !1
}, {
	strategy: "closest",
	preventDefault: "handled",
	stopImmediatePropagation: "handled"
}), Promise.resolve();
//#endregion
//#region ../../projects/lur.e/src/interactive/modules/DesktopStateStorage.ts
var ql = "cw-oriented-desktop-layout-v1", Jl = `${ql}.draft`, Yl = (e) => {
	try {
		return localStorage.getItem(e);
	} catch {
		return null;
	}
};
function Xl(e) {
	try {
		let t = JSON.parse(e);
		if (!t || typeof t != "object") return null;
		let n = t.items;
		if (!Array.isArray(n)) return null;
		let r = Math.max(0, Number(t.columns)), i = Math.max(0, Number(t.rows));
		return t.v === 2 && Number.isFinite(r) && Number.isFinite(i) ? {
			v: 2,
			updatedAt: String(t.updatedAt || (/* @__PURE__ */ new Date()).toISOString()),
			columns: r || 6,
			rows: i || 8,
			items: n
		} : {
			v: 2,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
			columns: Number.isFinite(r) && r > 0 ? r : 6,
			rows: Number.isFinite(i) && i > 0 ? i : 8,
			items: n
		};
	} catch {
		return null;
	}
}
function Zl() {
	let e = Yl(ql), t = Yl(Jl);
	if (!e) return t;
	if (!t) return e;
	let n = Xl(e), r = Xl(t);
	if (!n) return t;
	if (!r) return e;
	let i = Date.parse(n.updatedAt || ""), a = Date.parse(r.updatedAt || "");
	return Number.isFinite(a) && Number.isFinite(i) && a > i ? t : e;
}
//#endregion
//#region ../../../node_modules/jsox/lib/jsox.mjs
var Ql = JSON, H = {};
H.JSOX = H, H.version = "1.2.125";
var $l = typeof BigInt == "function", eu = -1, U = 0, tu = 1, nu = 2, ru = 3, iu = 4, au = 5, ou = 6, su = 7, cu = 8, lu = 9, uu = 10, du = 12, fu = 13, pu = [
	"ab",
	"u8",
	"cu8",
	"s8",
	"u16",
	"s16",
	"u32",
	"s32",
	"u64",
	"s64",
	"f32",
	"f64"
], mu = null, hu = null, gu = [
	ArrayBuffer,
	Uint8Array,
	Uint8ClampedArray,
	Int8Array,
	Uint16Array,
	Int16Array,
	Uint32Array,
	Int32Array,
	null,
	null,
	Float32Array,
	Float64Array
], W = 0, _u = 1, vu = 2, yu = 3, bu = 5, xu = 6, Su = 7, Cu = 8, wu = 9, Tu = 10, Eu = 11, Du = 12, Ou = 13, ku = 14, Au = 15, ju = 16, Mu = 17, Nu = 18, Pu = 19, Fu = 20, Iu = 21, Lu = 22, Ru = 23, zu = 24, Bu = 25, Vu = 26, Hu = 27, Uu = 28, Wu = 29, Gu = 30, G = 31, Ku = 32, K = 0, qu = 1, Ju = 2, Yu = 3, Xu = 4, Zu = 5, Qu = 6, $u = {
	true: !0,
	false: !1,
	null: null,
	NaN: NaN,
	Infinity: Infinity,
	undefined: void 0
}, ed = class extends Date {
	constructor(e, t) {
		super(e), this.ns = t || 0;
	}
};
H.DateNS = ed;
var td = [];
function nd() {
	let e = td.pop();
	return e ||= {
		context: K,
		current_proto: null,
		current_class: null,
		current_class_field: 0,
		arrayType: -1,
		valueType: U,
		elements: null
	}, e;
}
function rd(e) {
	td.push(e);
}
H.updateContext = function() {};
var id = [];
function ad() {
	let e = id.pop();
	return e ? e.n = 0 : e = {
		buf: null,
		n: 0
	}, e;
}
function od(e) {
	id.push(e);
}
H.escape = function(e) {
	let t, n = "";
	if (!e) return e;
	for (t = 0; t < e.length; t++) (e[t] == "\"" || e[t] == "\\" || e[t] == "`" || e[t] == "'") && (n += "\\"), n += e[t];
	return n;
};
var q = /* @__PURE__ */ new WeakMap(), sd = /* @__PURE__ */ new Map(), cd = /* @__PURE__ */ new Map(), ld = [];
H.reset = function() {
	q = /* @__PURE__ */ new WeakMap(), sd = /* @__PURE__ */ new Map(), cd = /* @__PURE__ */ new Map(), ld = [];
}, H.begin = function(e, t) {
	let n = {
		name: null,
		value_type: U,
		string: "",
		contains: null,
		className: null
	}, r = {
		line: 1,
		col: 1
	}, i = 0, a, o = /* @__PURE__ */ new Map(), s = W, c = !0, l = !1, u = !1, d = null, f = null, p, m = {
		first: null,
		last: null,
		saved: null,
		push(e) {
			let t = this.saved;
			t ? (this.saved = t.next, t.node = e, t.next = null, t.prior = this.last) : t = {
				node: e,
				next: null,
				prior: this.last
			}, this.last ? this.last.next = t : this.first = t, this.last = t, this.length++;
		},
		pop() {
			let e = this.last;
			return (this.last = e.prior) || (this.first = null), e.next = this.saved, this.last && (this.last.next = null), e.next || (e.first = null), this.saved = e, this.length--, e.node;
		},
		length: 0
	}, h = [], g = {}, _ = null, v = null, y = 0, b = -1, x = K, S = 0, C = !1, w = !1, T = !1, ee = !1, E = !1, te = {
		first: null,
		last: null,
		saved: null,
		push(e) {
			let t = this.saved;
			t ? (this.saved = t.next, t.node = e, t.next = null, t.prior = this.last) : t = {
				node: e,
				next: null,
				prior: this.last
			}, this.last ? this.last.next = t : this.first = t, this.last = t;
		},
		shift() {
			let e = this.first;
			return e ? ((this.first = e.next) || (this.last = null), e.next = this.saved, this.saved = e, e.node) : null;
		},
		unshift(e) {
			let t = this.saved;
			this.saved = t.next, t.node = e, t.next = this.first, t.prior = null, this.first || (this.last = t), this.first = t;
		}
	}, ne = null, re = !1, D = !1, O = !1, ie = !1, ae = !1, oe = !1, se = !1, ce = 0, le = 0, ue = !1, de = !1, fe = !1;
	function pe(e) {
		throw Error(`${e} at ${i} [${r.line}:${r.col}]`);
	}
	return {
		fromJSOX(e, t, n) {
			if (o.get(e)) throw Error("Existing fromJSOX has been registered for prototype");
			function r() {}
			if (t ||= r, t && !("constructor" in t)) throw Error("Please pass a prototype like thing...");
			o.set(e, {
				protoCon: t.prototype.constructor,
				cb: n
			});
		},
		registerFromJSOX(e, t) {
			throw Error("registerFromJSOX is deprecated, please update to use fromJSOX instead:" + e + t.toString());
		},
		finalError() {
			S !== 0 && (S === 1 && pe("Comment began at end of document"), S === 3 && pe("Open comment '/*' is missing close at end of document"), S === 4 && pe("Incomplete '/* *' close at end of document")), re && pe("Incomplete string");
		},
		value() {
			this.finalError();
			let e = d;
			return d = void 0, e;
		},
		reset() {
			s = W, c = !0, te.last && (te.last.next = te.save), te.save = te.first, te.first = te.last = null, m.last && (m.last.next = m.save), m.length = 0, m.save = te.first, m.first = m.last = null, p = void 0, x = K, h = [], g = {}, _ = null, v = null, y = 0, n.value_type = U, n.name = null, n.string = "", n.className = null, r.line = 1, r.col = 1, u = !1, S = 0, ue = !1, re = !1, O = !1, ie = !1, de = !1;
		},
		usePrototype(e, t) {
			g[e] = t;
		},
		write(n) {
			let r;
			if (typeof n != "string" && n !== void 0 && (n = String(n)), !c) throw Error("Parser is still in an error state, please reset before resuming");
			for (r = this._write(n, !1); r > 0 && (typeof t == "function" && (function e(n, r) {
				let i, a, o = n[r];
				if (o && typeof o == "object") for (i in o) Object.prototype.hasOwnProperty.call(o, i) && (a = e(o, i), a === void 0 ? delete o[i] : o[i] = a);
				return t.call(n, r, o);
			})({ "": d }, ""), d = e(d), !(r < 2)); r = this._write());
		},
		parse(e, t) {
			typeof e != "string" && (e = String(e)), this.reset();
			let n = this._write(e, !0);
			if (n > 0) {
				let e = this.value();
				if (e === void 0 && n > 1) throw Error("Pending value could not complete");
				return e = typeof t == "function" ? function e(n, r) {
					let i, a, o = n[r];
					if (o && typeof o == "object") for (i in o) Object.prototype.hasOwnProperty.call(o, i) && (a = e(o, i), a === void 0 ? delete o[i] : o[i] = a);
					return t.call(n, r, o);
				}({ "": e }, "") : e, e;
			}
			this.finalError();
		},
		_write(e, t) {
			let g, pe, me, he = 0;
			function k(e, t) {
				throw Error(`${e} '${String.fromCodePoint(t)}' unexpected at ${i} (near '${me.substr(i > 4 ? i - 4 : 0, i > 4 ? 3 : i - 1)}[${String.fromCodePoint(t)}]${me.substr(i, 10)}') [${r.line}:${r.col}]`);
			}
			function ge() {
				n.value_type = U, n.string = "", n.contains = null;
			}
			function _e() {
				let e = null;
				switch (n.value_type) {
					case au:
						if ((n.string.length > 13 || n.string.length == 13 && n[0] > "2") && !de && !E && !ee && !w && (fe = !0), fe) {
							if ($l) return BigInt(n.string);
							throw Error("no builtin BigInt()", 0);
						}
						if (de) {
							let e = n.string.match(/\.(\d\d\d\d*)/), t = e ? e[1] : null;
							if (!t || t.length < 4) {
								let e = new Date(n.string);
								return isNaN(e.getTime()) && k("Bad Date format", g), e;
							}
							{
								let e = t.substr(3);
								for (; e.length < 6;) e += "0";
								let r = new ed(n.string, Number(e));
								return isNaN(r.getTime()) && k("Bad DateNS format" + r + r.getTime(), g), r;
							}
						}
						return (u ? -1 : 1) * Number(n.string);
					case iu:
						if (n.className) {
							if (e = o.get(n.className), e ||= cd.get(n.className), e && e.cb) return n.className = null, e.cb.call(n.string);
							throw Error("Double string error, no constructor for: new " + n.className + "(" + n.string + ")");
						}
						return n.string;
					case nu: return !0;
					case ru: return !1;
					case su: return NaN;
					case cu: return NaN;
					case lu: return -Infinity;
					case uu: return Infinity;
					case tu: return null;
					case eu: return;
					case du: return;
					case ou: return n.className && (e = o.get(n.className), e ||= cd.get(n.className), n.className = null, e && e.cb) ? n.contains = e.cb.call(n.contains) : n.contains;
					case fu:
						if (b >= 0) {
							let e;
							if (e = n.contains.length ? gd(n.contains[0]) : gd(n.string), b === 0) return b = -1, e;
							{
								let t = new gu[b](e);
								return b = -1, t;
							}
						}
						if (b === -2) {
							let e = f, t, r = n.contains.length;
							for (t = 0; t < r; t++) {
								let i = n.contains[t], a = e[i];
								if (!a) {
									let i = m.first, o = 0;
									for (; i && o < r && o < m.length;) {
										let r = n.contains[o];
										if (!i.next || r !== i.next.node.name) break;
										if (i.next) {
											if (typeof r == "number") {
												let t = i.next.node.elements;
												if (t && r >= t.length) {
													if (o === m.length - 1) {
														console.log("This is actually at the current object so use that", o, n.contains, p), a = p, o++, i = i.next;
														break;
													}
													if (i.next.next && r === t.length) {
														a = i.next.next.node.elements, i = i.next, o++, e = a;
														continue;
													}
													a = p, o++;
													break;
												}
											} else if (r !== i.next.node.name) {
												a = i.next.node.elements[r], t = o;
												break;
											} else a = i.next.next ? i.next.next.node.elements : p;
										} else a = a[r];
										i = i.next, o++;
									}
									t = o < r ? o - 1 : o;
								}
								if (typeof a == "object" && !a) throw Error("Path did not resolve properly:" + n.contains + " at " + i + "(" + t + ")");
								e = a;
							}
							return b = -3, e;
						}
						return n.className && (e = o.get(n.className), e ||= cd.get(n.className), n.className = null, e && e.cb) ? e.cb.call(n.contains) : n.contains;
					default: console.log("Unhandled value conversion.", n);
				}
			}
			function ve() {
				if (b == -3) {
					n.value_type === ou && p.push(n.contains), b = -1;
					return;
				}
				switch (n.value_type) {
					case du:
						p.push(void 0), delete p[p.length - 1];
						break;
					default: p.push(_e());
				}
				ge();
			}
			function ye() {
				if (b === -3 && n.value_type === fu) {
					ge(), b = -1;
					return;
				}
				if (n.value_type === du) return;
				!n.name && v && (n.name = v.fields[y++]);
				let e = _e();
				_ && _.protoDef && _.protoDef.cb ? (e = _.protoDef.cb.call(p, n.name, e), e && (p[n.name] = e)) : p[n.name] = e, ge();
			}
			function A(e) {
				if (s !== W) {
					switch (u && k("Negative outside of quotes, being converted to a string (would lose count of leading '-' characters)", e), s) {
						case G:
							switch (n.value_type) {
								case nu:
									n.string += "true";
									break;
								case ru:
									n.string += "false";
									break;
								case tu:
									n.string += "null";
									break;
								case uu:
									n.string += "Infinity";
									break;
								case lu:
									n.string += "-Infinity", k("Negative outside of quotes, being converted to a string", e);
									break;
								case cu:
									n.string += "NaN";
									break;
								case su:
									n.string += "-NaN", k("Negative outside of quotes, being converted to a string", e);
									break;
								case eu:
									n.string += "undefined";
									break;
								case iu: break;
								case U: break;
								default: console.log("Value of type " + n.value_type + " is not restored...");
							}
							break;
						case _u:
							n.string += "t";
							break;
						case vu:
							n.string += "tr";
							break;
						case yu:
							n.string += "tru";
							break;
						case bu:
							n.string += "f";
							break;
						case xu:
							n.string += "fa";
							break;
						case Su:
							n.string += "fal";
							break;
						case Cu:
							n.string += "fals";
							break;
						case wu:
							n.string += "n";
							break;
						case Tu:
							n.string += "nu";
							break;
						case Eu:
							n.string += "nul";
							break;
						case Du:
							n.string += "u";
							break;
						case Ou:
							n.string += "un";
							break;
						case ku:
							n.string += "und";
							break;
						case Au:
							n.string += "unde";
							break;
						case ju:
							n.string += "undef";
							break;
						case Mu:
							n.string += "undefi";
							break;
						case Nu:
							n.string += "undefin";
							break;
						case Pu:
							n.string += "undefine";
							break;
						case Fu:
							n.string += "N";
							break;
						case Iu:
							n.string += "Na";
							break;
						case Lu:
							n.string += "I";
							break;
						case Ru:
							n.string += "In";
							break;
						case zu:
							n.string += "Inf";
							break;
						case Bu:
							n.string += "Infi";
							break;
						case Vu:
							n.string += "Infin";
							break;
						case Hu:
							n.string += "Infini";
							break;
						case Uu:
							n.string += "Infinit";
							break;
						case W: break;
						case Wu: break;
						case Gu: break;
						case Ku: k("String-keyword recovery fail (after whitespace)", e);
					}
					n.value_type = iu, s < Wu && (s = G);
				} else s = G, n.value_type = iu;
				if (e == 123) Se();
				else if (e == 91) Ce();
				else if (e != 44) {
					if (e == 32 || e == 13 || e == 10 || e == 9 || e == 65279 || e == 8232 || e == 8233) return;
					e == 44 || e == 125 || e == 93 || e == 58 || (n.string += a);
				}
			}
			function be(e) {
				let t = 0;
				for (; t == 0 && i < me.length;) {
					a = me.charAt(i);
					let o = me.codePointAt(i++);
					if (o >= 65536 && (a += me.charAt(i), i++), r.col++, o == e) O ? (se ? k("Incomplete hexidecimal sequence", o) : oe ? k("Incomplete long unicode sequence", o) : ae && k("Incomplete unicode sequence", o), ie ? (ie = !1, t = 1) : n.string += a, O = !1) : t = 1;
					else if (O) {
						if (ae) {
							if (o == 125) {
								n.string += String.fromCodePoint(ce), ae = !1, oe = !1, O = !1;
								continue;
							}
							if (ce *= 16, o >= 48 && o <= 57) ce += o - 48;
							else if (o >= 65 && o <= 70) ce += o - 65 + 10;
							else if (o >= 97 && o <= 102) ce += o - 97 + 10;
							else {
								k("(escaped character, parsing hex of \\u)", o), t = -1, ae = !1, O = !1;
								continue;
							}
							continue;
						}
						if (se || oe) {
							if (le === 0 && o === 123) {
								ae = !0;
								continue;
							}
							if (le < 2 || oe && le < 4) {
								if (ce *= 16, o >= 48 && o <= 57) ce += o - 48;
								else if (o >= 65 && o <= 70) ce += o - 65 + 10;
								else if (o >= 97 && o <= 102) ce += o - 97 + 10;
								else {
									k(oe ? "(escaped character, parsing hex of \\u)" : "(escaped character, parsing hex of \\x)", o), t = -1, se = !1, O = !1;
									continue;
								}
								le++, oe ? le == 4 && (n.string += String.fromCodePoint(ce), oe = !1, O = !1) : le == 2 && (n.string += String.fromCodePoint(ce), se = !1, O = !1);
								continue;
							}
						}
						switch (o) {
							case 13:
								ie = !0, r.col = 1;
								continue;
							case 8232:
							case 8233: r.col = 1;
							case 10:
								ie ? ie = !1 : r.col = 1, r.line++;
								break;
							case 116:
								n.string += "	";
								break;
							case 98:
								n.string += "\b";
								break;
							case 110:
								n.string += "\n";
								break;
							case 114:
								n.string += "\r";
								break;
							case 102:
								n.string += "\f";
								break;
							case 118:
								n.string += "\v";
								break;
							case 48:
								n.string += "\0";
								break;
							case 120:
								se = !0, le = 0, ce = 0;
								continue;
							case 117:
								oe = !0, le = 0, ce = 0;
								continue;
							default: n.string += a;
						}
						O = !1;
					} else o === 92 ? O ? (n.string += "\\", O = !1) : (O = !0, ce = 0, le = 0) : (ie && (ie = !1, r.line++, r.col = 2), n.string += a);
				}
				return t;
			}
			function xe() {
				let e;
				for (; (e = i) < me.length;) {
					a = me.charAt(e);
					let o = me.codePointAt(i++);
					if (o >= 256) {
						r.col -= i - e, i = e;
						break;
					}
					if (o != 95) {
						if (r.col++, o >= 48 && o <= 57) T && (E = !0), n.string += a;
						else if (o == 45 || o == 43) n.string.length == 0 || T && !ee && !E ? (o == 45 && !T && (u = !u), n.string += a, ee = !0) : (u &&= (n.string = "-" + n.string, !1), n.string += a, de = !0);
						else if (o == 78) {
							if (s == W) {
								D = !1, s = Fu;
								return;
							}
							k("fault while parsing number;", o);
							break;
						} else if (o == 73) {
							if (s == W) {
								D = !1, s = Lu;
								return;
							}
							k("fault while parsing number;", o);
							break;
						} else if (o == 58 && de) u &&= (n.string = "-" + n.string, !1), n.string += a, de = !0;
						else if (o == 84 && de) u &&= (n.string = "-" + n.string, !1), n.string += a, de = !0;
						else if (o == 90 && de) u &&= (n.string = "-" + n.string, !1), n.string += a, de = !0;
						else if (o == 46) {
							if (!w && !C && !T) n.string += a, w = !0;
							else {
								c = !1, k("fault while parsing number;", o);
								break;
							}
						} else if (o == 110) {
							fe = !0;
							break;
						} else if (C && (o >= 95 && o <= 102 || o >= 65 && o <= 70)) n.string += a;
						else if (o == 120 || o == 98 || o == 111 || o == 88 || o == 66 || o == 79) {
							if (!C && n.string == "0") C = !0, n.string += a;
							else {
								c = !1, k("fault while parsing number;", o);
								break;
							}
						} else if (o == 101 || o == 69) {
							if (!T) n.string += a, T = !0;
							else {
								c = !1, k("fault while parsing number;", o);
								break;
							}
						} else if (o == 32 || o == 13 || o == 10 || o == 9 || o == 47 || o == 35 || o == 44 || o == 125 || o == 93 || o == 123 || o == 91 || o == 34 || o == 39 || o == 96 || o == 58) {
							r.col -= i - e, i = e;
							break;
						} else {
							t && (c = !1, k("fault while parsing number;", o));
							break;
						}
					}
				}
				!t && i == me.length ? D = !0 : (D = !1, n.value_type = au, x == K && (ue = !0));
			}
			function Se() {
				let e = Ju, t = null, r = {};
				s > W && s < Wu && A(123);
				let i;
				if (i = we(), x == K) {
					if (s == Wu || s == G && (i || n.string.length)) {
						if (i && i.protoDef && i.protoDef.protoCon && (r = new i.protoDef.protoCon()), !i || !i.protoDef && n.string) {
							if (t = h.find((e) => e.name === n.string), t) l ? (t.fields.length = 0, e = Xu) : (r = new t.protoCon(), e = Zu);
							else {
								function r() {}
								h.push(t = {
									name: n.string,
									protoCon: i && i.protoDef && i.protoDef.protoCon || r.constructor,
									fields: []
								}), e = Xu;
							}
							l = !1;
						}
						v = t, s = W;
					} else s = Wu;
				} else if (s == Wu || x === qu || x === Yu || x == Zu) {
					if (s != W || n.value_type == iu) {
						if (i && i.protoDef) r = new i.protoDef.protoCon();
						else if (t = h.find((e) => e.name === n.string), t) e = Zu, r = {};
						else {
							function e() {}
							o.set(n.string, {
								protoCon: e.prototype.constructor,
								cb: null
							}), r = new e();
						}
						s = W;
					} else s = W;
				} else if (x == Ju && s == W) return k("fault while parsing; getting field name unexpected ", g), c = !1, !1;
				let a = nd();
				return n.value_type = ou, x === K ? p = r : x == qu ? n.name = p.length : (x == Yu || x == Zu) && (!n.name && v && (n.name = v.fields[y++]), p[n.name] = r), a.context = x, a.elements = p, a.name = n.name, a.current_proto = _, a.current_class = v, a.current_class_field = y, a.valueType = n.value_type, a.arrayType = b, a.className = n.className, n.className = null, n.name = null, _ = i, v = t, y = 0, p = r, f ||= p, m.push(a), ge(), x = e, !0;
			}
			function Ce() {
				if (s > W && s < Wu && A(91), s == G && n.string.length) {
					let e = pu.findIndex((e) => e === n.string);
					s = W, e >= 0 ? (b = e, n.className = n.string, n.string = null) : n.string === "ref" ? (n.className = null, b = -2) : o.get(n.string) || cd.get(n.string) ? n.className = n.string : k(`Unknown type '${n.string}' specified for array`, g);
				} else if (x == Ju || s == Wu || s == Gu) return k("Fault while parsing; while getting field name unexpected", g), c = !1, !1;
				{
					let e = nd();
					n.value_type = fu;
					let t = [];
					if (x == K) p = t;
					else if (x == qu) b == -1 && p.push(t), n.name = p.length;
					else if (x == Yu) {
						if (n.name || (console.log("This says it's resolved......."), b = -3), _ && _.protoDef) {
							if (_.protoDef.cb) {
								let e = _.protoDef.cb.call(p, n.name, t);
								e !== void 0 && (t = p[n.name] = e);
							} else p[n.name] = t;
						} else p[n.name] = t;
					}
					e.context = x, e.elements = p, e.name = n.name, e.current_proto = _, e.current_class = v, e.current_class_field = y, e.valueType = n.value_type, e.arrayType = b == -1 ? -3 : b, e.className = n.className, b = -1, n.className = null, n.name = null, _ = null, v = null, y = 0, p = t, f ||= t, m.push(e), ge(), x = qu;
				}
				return !0;
			}
			function we() {
				let e = {
					protoDef: null,
					cls: null
				};
				return ((e.protoDef = o.get(n.string)) || (e.protoDef = cd.get(n.string))) && (n.className || (n.className = n.string, n.string = null)), n.string && (e.cls = h.find((e) => e.name === n.string), !e.protoDef && e.cls), e.protoDef || e.cls ? e : null;
			}
			if (!c) return -1;
			for (e && e.length ? (pe = ad(), pe.buf = e, te.push(pe)) : (D && (D = !1, n.value_type = au, x == K && (ue = !0), he = 1), x !== K && k("Unclosed object at end of stream.", g)); c && (pe = te.shift());) {
				if (i = pe.n, me = pe.buf, re) {
					let e = be(ne);
					e < 0 ? c = !1 : e > 0 && (re = !1, c && (n.value_type = iu));
				}
				for (D && xe(); !ue && c && i < me.length;) {
					if (a = me.charAt(i), g = me.codePointAt(i++), g >= 65536 && (a += me.charAt(i), i++), r.col++, S) {
						if (S == 1) {
							if (g == 42) S = 3;
							else if (g != 47) return k("fault while parsing;", g);
							else S = 2;
						} else S == 2 ? (g == 10 || g == 13) && (S = 0) : S == 3 ? g == 42 && (S = 4) : S = g == 47 ? 0 : 3;
						continue;
					}
					switch (g) {
						case 35:
							S = 2;
							break;
						case 47:
							S = 1;
							break;
						case 123:
							Se();
							break;
						case 91:
							Ce();
							break;
						case 58:
							if (x == Zu) s = W, n.name = n.string, n.string = "", n.value_type = U;
							else if (x == Ju || x == Xu) {
								if (x == Xu) {
									if (!Object.keys(p).length) {
										console.log("This is a full object, not a class def...", n.className);
										let e = () => {};
										o.set(m.last.node.current_class.name, {
											protoCon: e.prototype.constructor,
											cb: null
										}), p = new e(), x = Yu, n.name = n.string, s = W, n.string = "", n.value_type = U, console.log("don't do default;s do a revive...");
									}
								} else s != W && s != G && s != Wu && s != Gu && A(32), s = W, n.name = n.string, n.string = "", x = x === Ju ? Yu : Qu, n.value_type = U;
							} else if (x == K) {
								console.log("Override colon found, allow class redefinition", x), l = !0;
								break;
							} else k(x == qu ? "(in array, got colon out of string):parsing fault;" : x == Yu ? "String unexpected" : "(outside any object, got colon out of string):parsing fault;", g), c = !1;
							break;
						case 125:
							if (s == G && (s = W), x == Xu) {
								if (v) {
									n.string && v.fields.push(n.string), ge();
									let e = m.pop();
									x = K, s = W, n.name = e.name, p = e.elements, v = e.current_class, y = e.current_class_field, b = e.arrayType, n.value_type = e.valueType, n.className = e.className, f = null, rd(e);
								} else k("State error; gathering class fields, and lost the class", g);
							} else if (x == Ju || x == Zu) {
								n.value_type != U && (v && (n.name = v.fields[y++]), ye()), n.value_type = ou, _ && _.protoDef && (console.log("SOMETHING SHOULD AHVE BEEN REPLACED HERE??", _), console.log("The other version only revives on init"), p = new _.protoDef.cb(p, void 0, void 0)), n.contains = p, n.string = "";
								let e = m.pop();
								x = e.context, n.name = e.name, p = e.elements, v = e.current_class, _ = e.current_proto, y = e.current_class_field, b = e.arrayType, n.value_type = e.valueType, n.className = e.className, rd(e), x == K && (ue = !0);
							} else if (x == Yu) {
								n.value_type === U && (s == W ? k("Fault while parsing; unexpected", g) : A(g)), ye(), n.value_type = ou, n.contains = p, s = W;
								let e = m.pop();
								x = e.context, n.name = e.name, p = e.elements, _ = e.current_proto, v = e.current_class, y = e.current_class_field, b = e.arrayType, n.value_type = e.valueType, n.className = e.className, rd(e), x == K && (ue = !0);
							} else k("Fault while parsing; unexpected", g), c = !1;
							u = !1;
							break;
						case 93:
							if (s >= Gu && (s = W), x == qu) {
								n.value_type == U ? s !== W && (A(g), ve()) : ve(), n.contains = p;
								{
									let e = m.pop();
									n.name = e.name, n.className = e.className, x = e.context, p = e.elements, _ = e.current_proto, v = e.current_class, y = e.current_class_field, b = e.arrayType, n.value_type = e.valueType, rd(e);
								}
								n.value_type = fu, x == K && (ue = !0);
							} else k(`bad context ${x}; fault while parsing`, g), c = !1;
							u = !1;
							break;
						case 44:
							s < Gu && s != W && A(g), (s == G || s == Wu) && (s = W), x == Xu ? v ? (v.fields.push(n.string), n.string = "", s = Wu) : k("State error; gathering class fields, and lost the class", g) : x == Ju ? v ? (n.name = v.fields[y++], n.value_type != U && (ye(), ge())) : (n.string || n.value_type) && k("State error; comma in field name and/or lost the class", g) : x == Zu ? (v ? (b != -3 && !n.name && (n.name = v.fields[y++]), n.value_type != U && (b != -3 && ye(), ge())) : n.value_type != U && (ye(), ge()), n.name = null) : x == qu ? (n.value_type == U && (n.value_type = du), ve(), ge(), s = W) : x == Yu && n.value_type != U ? (x = Ju, n.value_type != U && (ye(), ge()), s = W) : (c = !1, k("bad context; excessive commas while parsing;", g)), u = !1;
							break;
						default: switch (g) {
							default:
								if (x == K || x == Yu && s == Wu || x == Ju || s == Wu || x == Xu) switch (g) {
									case 96:
									case 34:
									case 39:
										s == W || s == Wu ? (n.string.length && (console.log("IN ARRAY AND FIXING?"), n.className = n.string, n.string = ""), be(g) ? n.value_type = iu : (ne = g, re = !0)) : k("fault while parsing; quote not at start of field name", g);
										break;
									case 10: r.line++, r.col = 1;
									case 13:
									case 32:
									case 8232:
									case 8233:
									case 9:
									case 65279:
										if (x === K && s === G) {
											s = W, x === K && (ue = !0);
											break;
										}
										if (s === W || s === Gu) {
											x == K && n.value_type && (ue = !0);
											break;
										}
										if (s === Wu) {
											if (x === K) {
												s = W, ue = !0;
												break;
											}
											n.string.length && console.log("STEP TO NEXT TOKEN."), s = Gu;
										} else c = !1, k("fault while parsing; whitepsace unexpected", g);
										break;
									default:
										if (s == W && (g >= 48 && g <= 57 || g == 43 || g == 46 || g == 45)) {
											C = !1, T = !1, de = !1, fe = !1, ee = !1, E = !1, w = !1, n.string = a, pe.n = i, xe();
											break;
										}
										if (s === Gu && (c = !1, k("fault while parsing; character unexpected", g)), s === W) {
											s = Wu, n.value_type = iu, n.string += a;
											break;
										}
										if (n.value_type == U) s !== W && s !== G && A(g);
										else {
											if (s === G || s === Wu) {
												n.string += a;
												break;
											}
											if (x == Ju) {
												if (s == Wu) {
													n.string += a;
													break;
												}
												k("Multiple values found in field name", g);
											}
											x == Yu && k("String unexpected", g);
										}
								}
								else {
									if (s == W && (g >= 48 && g <= 57 || g == 43 || g == 46 || g == 45)) C = !1, T = !1, de = !1, fe = !1, ee = !1, E = !1, w = !1, n.string = a, pe.n = i, xe();
									else if (n.value_type == U) s == W ? (s = G, n.string += a, n.value_type = iu) : A(g);
									else if (x == Ju) k("Multiple values found in field name", g);
									else if (x == Yu) n.value_type != iu && ((n.value_type == ou || n.value_type == fu) && k("String unexpected", g), A(g)), s == Gu ? we() ? n.string = a : k("String unexpected", g) : s == G ? n.string += a : k("String unexpected", g);
									else if (x == qu) {
										if (s == Gu) {
											n.className || (n.className = n.string, n.string = ""), n.string += a;
											break;
										}
										s == G && (n.string += a);
									}
									break;
								}
								break;
							case 96:
							case 34:
							case 39:
								n.string && (n.className = n.string), n.string = "", be(g) ? (n.value_type = iu, s = G) : (ne = g, re = !0);
								break;
							case 10: r.line++, r.col = 1;
							case 32:
							case 9:
							case 13:
							case 8232:
							case 8233:
							case 65279:
								if (s == G) {
									if (x == K) {
										s = W, ue = !0;
										break;
									}
									if (x == Yu) {
										s = Ku;
										break;
									}
									if (x == Ju) {
										s = Gu;
										break;
									}
									if (x == qu) {
										s = Gu;
										break;
									}
								}
								if (s == W || s == Gu) break;
								s == Wu ? n.string.length && (s = Gu) : s < G && A(g);
								break;
							case 116:
								s == W ? s = _u : s == Hu ? s = Uu : A(g);
								break;
							case 114:
								s == _u ? s = vu : A(g);
								break;
							case 117:
								s == vu ? s = yu : s == wu ? s = Tu : s == W ? s = Du : A(g);
								break;
							case 101:
								s == yu ? (n.value_type = nu, s = G) : s == Cu ? (n.value_type = ru, s = G) : s == ku ? s = Au : s == Nu ? s = Pu : A(g);
								break;
							case 110:
								s == W ? s = wu : s == Du ? s = Ou : s == Mu ? s = Nu : s == Lu ? s = Ru : s == Bu ? s = Vu : A(g);
								break;
							case 100:
								s == Ou ? s = ku : s == Pu ? (n.value_type = eu, s = G) : A(g);
								break;
							case 105:
								s == ju ? s = Mu : s == zu ? s = Bu : s == Vu ? s = Hu : A(g);
								break;
							case 108:
								s == Tu ? s = Eu : s == Eu ? (n.value_type = tu, s = G) : s == xu ? s = Su : A(g);
								break;
							case 102:
								s == W ? s = bu : s == Au ? s = ju : s == Ru ? s = zu : A(g);
								break;
							case 97:
								s == bu ? s = xu : s == Fu ? s = Iu : A(g);
								break;
							case 115:
								s == Su ? s = Cu : A(g);
								break;
							case 73:
								s == W ? s = Lu : A(g);
								break;
							case 78:
								s == W ? s = Fu : s == Iu ? (n.value_type = u ? su : cu, u = !1, s = G) : A(g);
								break;
							case 121:
								s == Uu ? (n.value_type = u ? lu : uu, u = !1, s = G) : A(g);
								break;
							case 45:
								s == W ? u = !u : A(g);
								break;
							case 43: s !== W && A(g);
						}
					}
					if (ue) {
						s == G && (s = W);
						break;
					}
				}
				if (i == me.length ? (od(pe), n.value_type == U && t && s != W && A(32), re || D || x == Ju ? he = 0 : x == K && (n.value_type != U || d) && (ue = !0, he = 1)) : (pe.n = i, te.unshift(pe), he = 2), ue) {
					f = null;
					break;
				}
			}
			return c ? (ue && n.value_type != U && (s = W, d = _e(), u = !1, n.string = "", n.value_type = U), ue = !1, he) : -1;
		}
	};
};
var ud = [Object.freeze(H.begin())], dd = 0;
H.parse = function(e, t) {
	let n = dd++, r;
	ud.length <= n && ud.push(Object.freeze(H.begin())), r = ud[n], typeof e != "string" && (e = String(e)), r.reset();
	let i = r._write(e, !0);
	if (i > 0) {
		let e = r.value();
		if (e === void 0 && i > 1) throw Error("Pending value could not complete");
		return e = typeof t == "function" ? function e(n, r) {
			let i, a, o = n[r];
			if (o && typeof o == "object") for (i in o) Object.prototype.hasOwnProperty.call(o, i) && (a = e(o, i), a === void 0 ? delete o[i] : o[i] = a);
			return t.call(n, r, o);
		}({ "": e }, "") : e, dd--, e;
	}
	r.finalError();
};
function fd() {
	return this && this.valueOf();
}
H.defineClass = function(e, t) {
	let n, r = Object.keys(t);
	for (let e = 1; e < r.length; e++) {
		let t, n;
		(t = r[e - 1]) > (n = r[e]) && (r[e - 1] = n, r[e] = t, e ? e -= 2 : e--);
	}
	ld.push(n = {
		name: e,
		tag: r.toString(),
		proto: Object.getPrototypeOf(t),
		fields: Object.keys(t)
	});
	for (let e = 1; e < n.fields.length; e++) if (n.fields[e] < n.fields[e - 1]) {
		let t = n.fields[e - 1];
		n.fields[e - 1] = n.fields[e], n.fields[e] = t, e > 1 && (e -= 2);
	}
	n.proto === Object.getPrototypeOf({}) && (n.proto = null);
}, H.registerToJSOX = function(e, t, n) {
	throw Error("registerToJSOX deprecated; please use toJSOX:" + prototypeName + prototype.toString());
}, H.toJSOX = function(e, t, n) {
	if (!t.prototype || t.prototype !== Object.prototype) {
		if (q.get(t.prototype)) throw Error("Existing toJSOX has been registered for prototype");
		q.set(t.prototype, {
			external: !0,
			name: e || n.constructor.name,
			cb: n
		});
	} else {
		let r = Object.keys(t).toString();
		if (sd.get(r)) throw Error("Existing toJSOX has been registered for object type");
		sd.set(r, {
			external: !0,
			name: e,
			cb: n
		});
	}
}, H.fromJSOX = function(e, t, n) {
	function r() {}
	if (t ||= r.prototype, cd.get(e)) throw Error("Existing fromJSOX has been registered for prototype");
	if (t && !("constructor" in t)) throw Error("Please pass a prototype like thing...");
	cd.set(e, {
		protoCon: t.prototype.constructor,
		cb: n
	});
}, H.registerFromJSOX = function(e, t) {
	throw Error("deprecated; please adjust code to use fromJSOX:" + e + t.toString());
}, H.addType = function(e, t, n, r) {
	H.toJSOX(e, t, n), H.fromJSOX(e, t, r);
}, H.registerToFrom = function(e, t) {
	throw Error("registerToFrom deprecated; please use addType:" + e + t.toString());
}, H.stringifier = function() {
	let e = [], t = "\"", n = /* @__PURE__ */ new WeakMap(), r = [], i = [], a = /* @__PURE__ */ new WeakMap(), o = /* @__PURE__ */ new Map(), s = null, c = [], l = !1;
	function u(e) {
		return typeof e == "string" && e === "" ? "\"\"" : typeof e == "number" && !isNaN(e) ? [
			"'",
			e.toString(),
			"'"
		].join("") : e.includes("﻿") || e in $u || /[0-9\-]/.test(e[0]) || /[\n\r\t #\[\]{}()<>\~!+*/.:,\-"'`]/.test(e) ? t + H.escape(e) + t : e;
	}
	q.get(Object.prototype) || (q.set(Object.prototype, {
		external: !1,
		name: Object.prototype.constructor.name,
		cb: null
	}), q.set(Date.prototype, {
		external: !1,
		name: "Date",
		cb: function() {
			if (this.getTime() === -621672192e5) return "0000-01-01T00:00:00.000Z";
			let e = -this.getTimezoneOffset(), t = e >= 0 ? "+" : "-", n = function(e) {
				let t = Math.floor(Math.abs(e));
				return (t < 10 ? "0" : "") + t;
			};
			return [
				this.getFullYear(),
				"-",
				n(this.getMonth() + 1),
				"-",
				n(this.getDate()),
				"T",
				n(this.getHours()),
				":",
				n(this.getMinutes()),
				":",
				n(this.getSeconds()),
				"." + function(e) {
					let t = Math.floor(Math.abs(e));
					return (t < 100 ? "0" : "") + (t < 10 ? "0" : "") + t;
				}(this.getMilliseconds()) + t,
				n(e / 60),
				":",
				n(e % 60)
			].join("");
		}
	}), q.set(ed.prototype, {
		external: !1,
		name: "DateNS",
		cb: function() {
			let e = -this.getTimezoneOffset(), t = e >= 0 ? "+" : "-", n = function(e) {
				let t = Math.floor(Math.abs(e));
				return (t < 10 ? "0" : "") + t;
			};
			return [
				this.getFullYear(),
				"-",
				n(this.getMonth() + 1),
				"-",
				n(this.getDate()),
				"T",
				n(this.getHours()),
				":",
				n(this.getMinutes()),
				":",
				n(this.getSeconds()),
				"." + function(e) {
					let t = Math.floor(Math.abs(e));
					return (t < 100 ? "0" : "") + (t < 10 ? "0" : "") + t;
				}(this.getMilliseconds()) + function(e) {
					let t = Math.floor(Math.abs(e));
					return (t < 1e5 ? "0" : "") + (t < 1e4 ? "0" : "") + (t < 1e3 ? "0" : "") + (t < 100 ? "0" : "") + (t < 10 ? "0" : "") + t;
				}(this.ns) + t,
				n(e / 60),
				":",
				n(e % 60)
			].join("");
		}
	}), q.set(Boolean.prototype, {
		external: !1,
		name: "Boolean",
		cb: fd
	}), q.set(Number.prototype, {
		external: !1,
		name: "Number",
		cb: function() {
			return isNaN(this) ? "NaN" : isFinite(this) ? String(this) : this < 0 ? "-Infinity" : "Infinity";
		}
	}), q.set(String.prototype, {
		external: !1,
		name: "String",
		cb: function() {
			return "\"" + H.escape(fd.apply(this)) + "\"";
		}
	}), typeof BigInt == "function" && q.set(BigInt.prototype, {
		external: !1,
		name: "BigInt",
		cb: function() {
			return this + "n";
		}
	}), q.set(ArrayBuffer.prototype, {
		external: !0,
		name: "ab",
		cb: function() {
			return "[" + u(hd(this)) + "]";
		}
	}), q.set(Uint8Array.prototype, {
		external: !0,
		name: "u8",
		cb: function() {
			return "[" + u(hd(this.buffer)) + "]";
		}
	}), q.set(Uint8ClampedArray.prototype, {
		external: !0,
		name: "uc8",
		cb: function() {
			return "[" + u(hd(this.buffer)) + "]";
		}
	}), q.set(Int8Array.prototype, {
		external: !0,
		name: "s8",
		cb: function() {
			return "[" + u(hd(this.buffer)) + "]";
		}
	}), q.set(Uint16Array.prototype, {
		external: !0,
		name: "u16",
		cb: function() {
			return "[" + u(hd(this.buffer)) + "]";
		}
	}), q.set(Int16Array.prototype, {
		external: !0,
		name: "s16",
		cb: function() {
			return "[" + u(hd(this.buffer)) + "]";
		}
	}), q.set(Uint32Array.prototype, {
		external: !0,
		name: "u32",
		cb: function() {
			return "[" + u(hd(this.buffer)) + "]";
		}
	}), q.set(Int32Array.prototype, {
		external: !0,
		name: "s32",
		cb: function() {
			return "[" + u(hd(this.buffer)) + "]";
		}
	}), q.set(Float32Array.prototype, {
		external: !0,
		name: "f32",
		cb: function() {
			return "[" + u(hd(this.buffer)) + "]";
		}
	}), q.set(Float64Array.prototype, {
		external: !0,
		name: "f64",
		cb: function() {
			return "[" + u(hd(this.buffer)) + "]";
		}
	}), q.set(Float64Array.prototype, {
		external: !0,
		name: "f64",
		cb: function() {
			return "[" + u(hd(this.buffer)) + "]";
		}
	}), q.set(RegExp.prototype, hu = {
		external: !0,
		name: "regex",
		cb: function(e, t) {
			return "'" + escape(this.source) + "'";
		}
	}), cd.set("regex", {
		protoCon: RegExp,
		cb: function(e, t) {
			return new RegExp(this);
		}
	}), q.set(Map.prototype, hu = {
		external: !0,
		name: "map",
		cb: null
	}), cd.set("map", {
		protoCon: Map,
		cb: function(e, t) {
			if (e) {
				this.set(e, t);
				return;
			}
			return this;
		}
	}), q.set(Array.prototype, mu = {
		external: !1,
		name: Array.prototype.constructor.name,
		cb: null
	}));
	let d = {
		defineClass(t, n) {
			let r, i = Object.keys(n);
			for (let e = 1; e < i.length; e++) {
				let t, n;
				(t = i[e - 1]) > (n = i[e]) && (i[e - 1] = n, i[e] = t, e ? e -= 2 : e--);
			}
			e.push(r = {
				name: t,
				tag: i.toString(),
				proto: Object.getPrototypeOf(n),
				fields: Object.keys(n)
			});
			for (let e = 1; e < r.fields.length; e++) if (r.fields[e] < r.fields[e - 1]) {
				let t = r.fields[e - 1];
				r.fields[e - 1] = r.fields[e], r.fields[e] = t, e > 1 && (e -= 2);
			}
			r.proto === Object.getPrototypeOf({}) && (r.proto = null);
		},
		setDefaultObjectToJSOX(e) {
			s = e;
		},
		isEncoding(e) {
			return !!i.find((t, n) => t === e && n < i.length - 1);
		},
		encodeObject(e) {
			return s ? s.apply(e, [this]) : e;
		},
		stringify(e, t, n) {
			return m(e, t, n);
		},
		setQuote(e) {
			t = e;
		},
		registerToJSOX(e, t, n) {
			return this.toJSOX(e, t, n);
		},
		toJSOX(e, t, n) {
			if (t.prototype && t.prototype !== Object.prototype) {
				if (a.get(t.prototype)) throw Error("Existing toJSOX has been registered for prototype");
				a.set(t.prototype, {
					external: !0,
					name: e || n.constructor.name,
					cb: n
				});
			} else {
				let r = Object.keys(t).toString();
				if (o.get(r)) throw Error("Existing toJSOX has been registered for object type");
				o.set(r, {
					external: !0,
					name: e,
					cb: n
				});
			}
		},
		get ignoreNonEnumerable() {
			return l;
		},
		set ignoreNonEnumerable(e) {
			l = e;
		}
	};
	return d;
	function f(e) {
		if (e === null) return;
		let t = n.get(e);
		if (!t) {
			n.set(e, Ql.stringify(r));
			return;
		}
		return "ref" + t;
	}
	function p(t, n) {
		let r, i, a = Object.getPrototypeOf(t);
		if (i = e.find((e) => {
			if (e.proto && e.proto === a) return !0;
		}), i) return i;
		if (e.length || ld.length) {
			if (n) n = n.map((e) => {
				if (typeof e == "string") return e;
			}), r = n.toString();
			else {
				let e = Object.keys(t);
				for (let t = 1; t < e.length; t++) {
					let n, r;
					(n = e[t - 1]) > (r = e[t]) && (e[t - 1] = r, e[t] = n, t ? t -= 2 : t--);
				}
				r = e.toString();
			}
			i = e.find((e) => {
				if (e.tag === r) return !0;
			}), i ||= ld.find((e) => {
				if (e.tag === r) return !0;
			});
		}
		return i;
	}
	function m(t, m, h) {
		if (t === void 0) return "undefined";
		if (t === null) return;
		let g, _, v, y, b = typeof h, x = typeof m;
		if (g = "", _ = "", b === "number") for (y = 0; y < h; y += 1) _ += " ";
		else b === "string" && (_ = h);
		if (v = m, m && x !== "function" && (x !== "object" || typeof m.length != "number")) throw Error("JSOX.stringify");
		r.length = 0, n = /* @__PURE__ */ new WeakMap();
		let S = C("", { "": t });
		return ld.length = 0, S;
		function C(t, n) {
			var m = g;
			let h = mu.cb, y = hu.cb;
			mu.cb = x, hu.cb = S;
			let b = w(t, n);
			return mu.cb = h, hu.cb = y, b;
			function x() {
				let e, t = [], n = r.length;
				for (let e = 0; e < this.length; e += 1) r[n] = e, t[e] = C(e, this) || "null";
				return r.length = n, i.length = n, e = t.length === 0 ? "[]" : g ? [
					"[\n",
					g,
					t.join(",\n" + g),
					"\n",
					m,
					"]"
				].join("") : "[" + t.join(",") + "]", e;
			}
			function S() {
				let e = { tmp: null }, t = "{", n = !0;
				for (let [i, a] of this) {
					e.tmp = a;
					let o = r.length;
					r[o] = i, t += (n ? "" : ",") + u(i) + ":" + C("tmp", e), r.length = o, n = !1;
				}
				return t += "}", t;
			}
			function w(t, n) {
				let h, y, b, x, S, w, T = r.length, ee = !0, E = n[t], te = typeof E == "object", ne;
				te && E !== null && s && (c.find((e) => e === E) || (c.push(E), i[T] = E, ee = !1, E = s.apply(E, [d]), te = typeof E == "object", c.pop(), i.length = T, te = typeof E == "object"));
				let re = E != null && Object.getPrototypeOf(E), D = re && (a.get(re) || q.get(re) || null), O = !D && E != null && (o.get(Object.keys(E).toString()) || sd.get(Object.keys(E).toString()) || null);
				typeof v == "function" && (ee = !1, E = v.call(n, t, E));
				let ie = D && D.cb || O && O.cb;
				if (typeof E == "object" && E && typeof ie == "function") {
					if (c.find((e) => e === E)) b = f(E);
					else {
						if (typeof E == "object" && (b = f(E), b)) return b;
						c.push(E), i[T] = E, E = ie.call(E, d), ee = !1, c.pop(), D && D.name && typeof E == "string" && E[0] !== "-" && (E[0] < "0" || E[0] > "9") && E[0] !== "\"" && E[0] !== "'" && E[0] !== "`" && E[0] !== "[" && E[0] !== "{" && (E = " " + E), i.length = T;
					}
				} else if (typeof E == "object" && (b = f(E), b)) return b;
				switch (typeof E) {
					case "bigint": return E + "n";
					case "string": {
						E = ee ? u(E) : E;
						let n = "";
						return t === "" && (n = e.map((e) => e.name + "{" + e.fields.join(",") + "}").join(g ? "\n" : "") + ld.map((e) => e.name + "{" + e.fields.join(",") + "}").join(g ? "\n" : "") + (g ? "\n" : "")), D && D.external ? n + D.name + E : O && O.external ? n + O.name + E : n + E;
					}
					case "number":
					case "boolean":
					case "null": return String(E);
					case "object":
						if (b) return b;
						if (!E) return "null";
						if (g += _, S = null, w = [], v && typeof v == "object") {
							for (x = v.length, S = p(E, v), h = 0; h < x; h += 1) typeof v[h] == "string" && (y = v[h], r[T] = y, b = C(y, E), b !== void 0 && (S ? w.push(b) : w.push(u(y) + (g ? ": " : ":") + b)));
							r.splice(T, 1);
						} else {
							S = p(E);
							let e = [];
							for (y in E) if (!(l && !Object.prototype.propertyIsEnumerable.call(E, y)) && Object.prototype.hasOwnProperty.call(E, y)) {
								let t;
								for (t = 0; t < e.length; t++) if (e[t] > y) {
									e.splice(t, 0, y);
									break;
								}
								t == e.length && e.push(y);
							}
							for (let t = 0; t < e.length; t++) y = e[t], Object.prototype.hasOwnProperty.call(E, y) && (r[T] = y, b = C(y, E), b !== void 0 && (S ? w.push(b) : w.push(u(y) + (g ? ": " : ":") + b)));
							r.splice(T, 1);
						}
						ne = t === "" ? (e.map((e) => e.name + "{" + e.fields.join(",") + "}").join(g ? "\n" : "") || ld.map((e) => e.name + "{" + e.fields.join(",") + "}").join(g ? "\n" : "")) + (g ? "\n" : "") : "", D && D.external && (ne += u(D.name));
						let n = null;
						return S && (n = u(S.name)), b = ne + (w.length === 0 ? "{}" : g ? (S ? n : "") + "{\n" + g + w.join(",\n" + g) + "\n" + m + "}" : (S ? n : "") + "{" + w.join(",") + "}"), g = m, b;
				}
			}
		}
	}
};
var pd = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$_", md = {
	"~": -1,
	"=": -1,
	$: 62,
	_: 63,
	"+": 62,
	"-": 62,
	".": 62,
	"/": 63,
	",": 63
};
for (let e = 0; e < 64; e++) md[pd[e]] = e;
Object.freeze(md);
function hd(e) {
	let t = "", n = new Uint8Array(e), r = n.byteLength, i = r % 3, a = r - i, o, s, c, l, u;
	for (let e = 0; e < a; e += 3) u = n[e] << 16 | n[e + 1] << 8 | n[e + 2], o = (u & 16515072) >> 18, s = (u & 258048) >> 12, c = (u & 4032) >> 6, l = u & 63, t += pd[o] + pd[s] + pd[c] + pd[l];
	return i == 1 ? (u = n[a], o = (u & 252) >> 2, s = (u & 3) << 4, t += pd[o] + pd[s] + "==") : i == 2 && (u = n[a] << 8 | n[a + 1], o = (u & 64512) >> 10, s = (u & 1008) >> 4, c = (u & 15) << 2, t += pd[o] + pd[s] + pd[c] + "="), t;
}
function gd(e) {
	let t;
	t = e.length % 4 == 1 ? ((e.length + 3) / 4 | 0) * 3 - 3 : e.length % 4 == 2 ? ((e.length + 3) / 4 | 0) * 3 - 2 : e.length % 4 == 3 ? ((e.length + 3) / 4 | 0) * 3 - 1 : md[e[e.length - 3]] == -1 ? ((e.length + 3) / 4 | 0) * 3 - 3 : md[e[e.length - 2]] == -1 ? ((e.length + 3) / 4 | 0) * 3 - 2 : md[e[e.length - 1]] == -1 ? ((e.length + 3) / 4 | 0) * 3 - 1 : ((e.length + 3) / 4 | 0) * 3;
	let n = new ArrayBuffer(t), r = new Uint8Array(n), i, a = e.length + 3 >> 2;
	for (i = 0; i < a; i++) {
		let t = md[e[i * 4]], n = i * 4 + 1 < e.length ? md[e[i * 4 + 1]] : -1, a = n >= 0 && i * 4 + 2 < e.length ? md[e[i * 4 + 2]] : -1, o = a >= 0 && i * 4 + 3 < e.length ? md[e[i * 4 + 3]] : -1;
		n >= 0 && (r[i * 3 + 0] = t << 2 | n >> 4), a >= 0 && (r[i * 3 + 1] = n << 4 | a >> 2 & 15), o >= 0 && (r[i * 3 + 2] = a << 6 | o & 63);
	}
	return n;
}
H.stringify = function(e, t, n) {
	return H.stringifier().stringify(e, t, n);
}, [[
	0,
	256,
	[
		16767487,
		16739071,
		130048,
		3670016,
		0,
		16777208,
		16777215,
		8388607
	]
]].map((e) => ({
	firstChar: e[0],
	lastChar: e[1],
	bits: e[2]
}));
//#endregion
//#region ../../projects/lur.e/src/interactive/modules/UIState.ts
var _d = (e) => e ? e instanceof Map ? Array.from(e.entries()) : Array.isArray(e) ? e.map((e, t) => Array.isArray(e) && e.length === 2 ? e : [t, e]) : e instanceof Set ? Array.from(e.values()).map((e, t) => [t, e]) : typeof e == "object" ? Object.entries(e) : [] : [], vd = Object.prototype.hasOwnProperty, yd = (e) => !e || typeof e != "object" || Array.isArray(e) ? !1 : !(e instanceof Map) && !(e instanceof Set), bd = (e, t) => {
	if (e && typeof e == "object") {
		if ("id" in e && e.id != null) return e.id;
		if ("key" in e && e.key != null) return e.key;
	}
	return t;
}, xd = (e, t, n) => e ?? bd(t) ?? n, Sd = (e, t) => {
	for (let n of Object.keys(t)) {
		let r = t[n], i = e[n];
		if (yd(i) && yd(r)) {
			Sd(i, r);
			continue;
		}
		let a = Cd(i, r);
		e[n] !== a && (e[n] = a);
	}
	return e;
}, Cd = (e, t) => {
	if (e === t) return e;
	let n = t && typeof t == "object";
	return e instanceof Map && n || e instanceof Set && n || Array.isArray(e) && n ? (wd(e, t), e) : yd(e) && yd(t) ? (Sd(e, t), e) : t;
}, wd = (e, t) => {
	if (!e || !t) return e;
	let n = _d(t);
	if (!n.length) return e;
	if (e instanceof Set) {
		let t = /* @__PURE__ */ new Map();
		for (let n of e.values()) {
			let e = bd(n);
			e != null && t.set(e, n);
		}
		let r = /* @__PURE__ */ new Set();
		for (let [i, a] of n) {
			let n = xd(i, a);
			if (n == null) {
				e.has(a) || e.add(a);
				continue;
			}
			let o = t.has(n), s = o ? t.get(n) : void 0;
			if (o) {
				let r = Cd(s, a);
				r !== s && (e.delete(s), e.add(r), t.set(n, r));
			} else e.add(a), t.set(n, a);
			r.add(n);
		}
		if (r.size) for (let t of Array.from(e.values())) {
			let n = bd(t);
			n != null && !r.has(n) && e.delete(t);
		}
		return e;
	}
	if (e instanceof Map) {
		let t = new Map(n);
		for (let n of Array.from(e.keys())) t.has(n) || e.delete(n);
		for (let [n, r] of t.entries()) if (e.has(n)) {
			let t = e.get(n), i = Cd(t, r);
			i !== t && e.set(n, i);
		} else e.set(n, r);
		return e;
	}
	if (Array.isArray(e)) {
		let t = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new WeakMap();
		e.forEach((e, n) => {
			t.add(n);
			let a = bd(e, n);
			a != null && !r.has(a) && r.set(a, n), e && typeof e == "object" && i.set(e, n);
		});
		let a = (e) => {
			if (e != null && t.has(e)) return t.delete(e), e;
		}, o = () => {
			let e = t.values().next();
			if (e.done) return;
			let n = e.value;
			return t.delete(n), n;
		}, s = 0, c = 0;
		for (let [t, l] of n) {
			let n = xd(t, l, c++), u = a(n == null ? void 0 : r.get(n));
			u == null && l && typeof l == "object" && (u = a(i.get(l))), u ??= o();
			let d = u == null ? void 0 : e[u], f = d === void 0 ? l : Cd(d, l);
			s < e.length ? e[s] !== f && (e[s] = f) : e.push(f), s++;
		}
		for (; e.length > s;) e.pop();
		return e;
	}
	if (typeof e == "object") {
		let t = new Set(n.map(([e]) => String(e)));
		for (let n of Object.keys(e)) t.has(n) || delete e[n];
		for (let [t, r] of n) {
			let n = String(t);
			if (vd.call(e, n)) {
				let t = e[n], i = Cd(t, r);
				i !== t && (e[n] = i);
			} else e[n] = r;
		}
		return e;
	}
	return e;
}, Td = (e, t = "id") => {
	if (e && (e instanceof Set || Array.isArray(e))) {
		let n = Array.from(e?.values?.() || []).map((e) => [e?.[t], e]).filter((e) => e?.[0] != null);
		return wd(e, new Map(n));
	}
	return e;
}, Ed = () => typeof chrome < "u" && chrome?.storage?.local, Dd = "__CWSP_UI_STATE_SAVE_BY_KEY_V1__", Od = () => {
	let e = globalThis;
	return e[Dd] instanceof Map || (e[Dd] = /* @__PURE__ */ new Map()), e[Dd];
}, kd = (e, t) => {
	let n = Od().get(e);
	typeof n == "function" && n(t);
}, Ad = (e, t, n, r = (e) => On(e), i = "id", a = 6e3) => {
	let o = null;
	o = Td(t?.() || {}, i);
	let s = !Ed();
	if (Ed()) chrome.storage.local.get([e], (t) => {
		try {
			if (t[e]) {
				let r = n(H.parse(t?.[e] || "{}"));
				wd(o, r), Td(o, i);
			}
		} finally {
			s = !0;
		}
	});
	else if (typeof localStorage < "u") {
		if (localStorage.getItem(e)) {
			let t = n(H.parse(localStorage.getItem(e) || "{}"));
			wd(o, t), Td(o, i);
		} else localStorage.setItem(e, H.stringify(r(o)));
		s = !0;
	}
	let c = "", l = (t) => {
		if (!s) return;
		let n = H.stringify(r(Td(o, i)));
		c = n, Ed() ? chrome.storage.local.set({ [e]: n }) : typeof localStorage < "u" && localStorage.setItem(e, n);
	};
	if (Od().set(e, l), _i(l, a), typeof window < "u" && typeof document < "u") {
		let t = [
			z(document, "visibilitychange", (e) => {
				document.visibilityState === "hidden" && l(e);
			}),
			z(window, "beforeunload", (e) => l(e)),
			z(window, "pagehide", (e) => l(e)),
			z(window, "storage", (t) => {
				t.storageArea == localStorage && t.key == e && wd(o, n(H.parse(t?.newValue || H.stringify(r(Td(o, i))))));
			})
		];
		Fn(o, Symbol.dispose, () => t.forEach((e) => e?.()));
	}
	if (Ed() && chrome.storage.onChanged.addListener((t, r) => {
		if (r === "local" && t[e]) {
			let r = t[e].newValue;
			if (!r || r === c) return;
			c = typeof r == "string" ? r : H.stringify(r), wd(o, n(typeof r == "string" ? H.parse(r) : r));
		}
	}), o && typeof o == "object") try {
		Object.defineProperty(o, "$save", {
			value: l,
			configurable: !0,
			enumerable: !1,
			writable: !0
		});
	} catch {
		o.$save = l;
	}
	return o;
};
//#endregion
//#region ../../projects/lur.e/src/interactive/modules/ScrollBar.ts
mi();
try {
	CSS.registerProperty({
		name: "--percent-x",
		syntax: "<number>",
		inherits: !0,
		initialValue: "0"
	});
} catch {}
try {
	CSS.registerProperty({
		name: "--percent-y",
		syntax: "<number>",
		inherits: !0,
		initialValue: "0"
	});
} catch {}
try {
	CSS.registerProperty({
		name: "--scroll-coef",
		syntax: "<number>",
		inherits: !0,
		initialValue: "1"
	});
} catch {}
try {
	CSS.registerProperty({
		name: "--determinant",
		syntax: "<number>",
		inherits: !0,
		initialValue: "0"
	});
} catch {}
try {
	CSS.registerProperty({
		name: "--scroll-size",
		syntax: "<length-percentage>",
		inherits: !0,
		initialValue: "0px"
	});
} catch {}
try {
	CSS.registerProperty({
		name: "--content-size",
		syntax: "<length-percentage>",
		inherits: !0,
		initialValue: "0px"
	});
} catch {}
try {
	CSS.registerProperty({
		name: "--clamped-size",
		syntax: "<length-percentage>",
		inherits: !0,
		initialValue: "0px"
	});
} catch {}
try {
	CSS.registerProperty({
		name: "--thumb-size",
		syntax: "<length-percentage>",
		inherits: !0,
		initialValue: "0px"
	});
} catch {}
try {
	CSS.registerProperty({
		name: "--max-offset",
		syntax: "<length-percentage>",
		inherits: !0,
		initialValue: "0px"
	});
} catch {}
try {
	CSS.registerProperty({
		name: "--max-size",
		syntax: "<length-percentage>",
		inherits: !0,
		initialValue: "0px"
	});
} catch {}
//#endregion
//#region ../../projects/lur.e/src/design/color/DynamicEngine.ts
var jd = (e, t = 100) => typeof globalThis.requestIdleCallback == "function" ? globalThis.requestIdleCallback(e, { timeout: t }) : setTimeout(() => e({
	didTimeout: !1,
	timeRemaining: () => 0
}), 0), Md = "electronBridge";
function Nd(e) {
	if (typeof e != "string") return null;
	let t = e.trim().toLowerCase();
	if (t === "transparent") return 0;
	if (t.startsWith("#")) {
		let e = t;
		if (e.length === 4 || e.length === 7) return 1;
		if (e.length === 5) {
			let t = e[4], n = t + t;
			return Fd(parseInt(n, 16) / 255, 0, 1);
		}
		if (e.length === 9) {
			let t = e.slice(7, 9);
			return Fd(parseInt(t, 16) / 255, 0, 1);
		}
		return null;
	}
	let n = t.match(/^([a-z-]+)\((.*)\)$/i);
	if (!n) return null;
	n[1];
	let r = n[2].trim();
	{
		let e = r.lastIndexOf("/");
		if (e !== -1) {
			let t = Pd(r.slice(e + 1).trim());
			return t == null ? null : Fd(t, 0, 1);
		}
	}
	if (r.includes(",")) {
		let e = r.split(",").map((e) => e.trim());
		if (e.length >= 4) {
			let t = Pd(e[3]);
			return t == null ? null : Fd(t, 0, 1);
		}
		return 1;
	}
	return 1;
}
function Pd(e) {
	if (!e) return null;
	if (e.endsWith("%")) {
		let t = parseFloat(e);
		return Number.isNaN(t) ? null : t / 100;
	}
	let t = parseFloat(e);
	return Number.isNaN(t) ? null : t;
}
function Fd(e, t, n) {
	return Math.min(n, Math.max(t, e));
}
var Id = (e) => !e || e == null ? 0 : (Nd?.(e) || 0) > .1, Ld = (e, t = 1e3, ...n) => {
	jd(async () => {
		if (!(!e || typeof e != "function")) for (;;) await Promise.try(e, ...n), await new Promise((e) => setTimeout(e, t)), await new Promise((e) => jd(e, 100)), await new Promise((e) => requestAnimationFrame(e));
	}, 1e3);
}, Rd = () => {
	if (typeof document > "u") return null;
	try {
		let e = document.querySelectorAll("[data-shell]");
		for (let t of e) {
			let e = t.shadowRoot;
			if (!e) continue;
			let n = e.querySelector(".app-shell__nav, .app-shell__toolbar");
			if (!n) continue;
			let r = getComputedStyle(n).backgroundColor;
			if (Id(r)) return r;
		}
	} catch {}
	return null;
}, zd = () => {
	if (typeof document > "u" || !globalThis.matchMedia?.("(display-mode: window-controls-overlay)")?.matches) return null;
	let e = document.createElement("div");
	e.setAttribute("data-wco-theme-probe", "true"), e.style.cssText = [
		"position:fixed",
		"visibility:hidden",
		"pointer-events:none",
		"z-index:-2147483648",
		"left:env(titlebar-area-x,0px)",
		"top:env(titlebar-area-y,0px)",
		"width:env(titlebar-area-width,0px)",
		"height:env(titlebar-area-height,0px)"
	].join(";"), document.documentElement.appendChild(e);
	try {
		let t = e.getBoundingClientRect();
		if (t.width < 1 || t.height < 1) return null;
		let n = Bd(Math.floor(t.left + Math.min(40, t.width * .2)), Math.floor(t.top + t.height * .5));
		return Id(n) ? n : null;
	} finally {
		e.remove();
	}
}, Bd = (e, t, n = null) => {
	let r = Array.from(document.elementsFromPoint(e, t))?.filter?.((e) => e instanceof HTMLElement && e != n && (e?.dataset?.alpha == null || parseFloat(e?.dataset?.alpha) > .01) && e?.checkVisibility?.({
		contentVisibilityAuto: !0,
		opacityProperty: !0,
		visibilityProperty: !0
	}) && e?.matches?.(":not([data-hidden])") && e?.style?.getPropertyValue("display") != "none").map((e) => {
		let t = getComputedStyle?.(e);
		return {
			element: e,
			zIndex: parseInt(t?.zIndex || "0", 10) || 0,
			color: t?.backgroundColor || "transparent"
		};
	}).sort((e, t) => Math.sign(t.zIndex - e.zIndex)).filter(({ color: e }) => Id(e));
	return r?.[0]?.element instanceof HTMLElement && r?.[0]?.color || "transparent";
}, Vd = (e) => {
	let t = e?.getBoundingClientRect();
	if (t) {
		let n = .5 * (Di?.() || 1);
		return Bd((t.left + t.right) * n, (t.top + t.bottom) * n, e);
	}
}, Hd = (e = document.documentElement) => {
	let t = e?.querySelector?.("meta[data-theme-color]") ?? e?.querySelector?.("meta[name=\"theme-color\"]");
	!t && e == document.documentElement && (t = document.createElement("meta"), t.setAttribute("name", "theme-color"), t.setAttribute("data-theme-color", ""), t.setAttribute("content", "transparent"), document.head.appendChild(t));
	try {
		let n = !!globalThis?.__CWSP_NATIVE_THEME_COLOR_OWNED__, r = document.querySelector("ui-window[native-mode]:not([minimized])") || document.querySelector("ui-window[data-desk-max]:not([minimized]), ui-window[maximized]:not([minimized]), ui-window[data-mobile-max]:not([minimized])");
		if (n || r) {
			if (n) return;
			if (r?.shadowRoot && e == document.documentElement) {
				let e = r.shadowRoot.querySelector(".title-handler"), n = e && getComputedStyle(e).getPropertyValue("--ui-win-titlebar-bg").trim() || getComputedStyle(r).getPropertyValue("--ui-win-titlebar-bg").trim() || getComputedStyle(document.documentElement).getPropertyValue("--color-surface-container").trim(), i = e ? getComputedStyle(e).backgroundColor : "", a = (i && Id(i) ? i : null) || (n && Id(n) ? n : null);
				if (a) {
					let e = String(a).toLowerCase();
					!/#007acc\b/.test(e) && !/rgba?\(\s*0\s*,\s*122\s*,\s*204/.test(e) && t?.setAttribute?.("content", a);
					return;
				}
			}
			return;
		}
	} catch {}
	let n = Rd(), r = n ? null : zd(), i = !n && !r ? (() => {
		try {
			let e = getComputedStyle(document.documentElement).getPropertyValue("--color-surface-container").trim();
			return e && Id(e) ? e : null;
		} catch {
			return null;
		}
	})() : null, a = n || r || i;
	a && a !== "transparent" && (t || window?.electronBridge) && e == document.documentElement && t?.setAttribute?.("content", a);
}, Ud = (e = document.documentElement) => {
	e.querySelectorAll("body, body > *, body > * > *").forEach((e) => {
		e && Vd(e);
	});
}, Wd = (e = document.documentElement) => {
	let t = "__LURE_DYNAMIC_THEME_STARTED__";
	if (globalThis?.[t]) return;
	globalThis[t] = !0, matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ({}) => Ud(e));
	let n = () => {
		Hd(e), Ud(e);
	};
	z(e, "u2-appear", () => jd(n, 100)), z(e, "u2-hidden", () => jd(n, 100)), z(e, "u2-theme-change", () => jd(n, 100)), z(window, "load", () => jd(n, 100)), z(document, "visibilitychange", () => jd(n, 100)), Ld(n, 500);
}, Gd = async () => {
	Hd(), Ud();
}, Kd = () => {
	typeof document > "u" || globalThis?.__LURE_AUTO_THEME_ENGINE__ === !0 && (requestAnimationFrame(() => Gd?.()), Wd?.());
};
Kd();
//#endregion
//#region ../../../node_modules/culori/src/rgb/parseNumber.js
var qd = (e, t) => {
	if (typeof e == "number") {
		if (t === 3) return {
			mode: "rgb",
			r: (e >> 8 & 15 | e >> 4 & 240) / 255,
			g: (e >> 4 & 15 | e & 240) / 255,
			b: (e & 15 | e << 4 & 240) / 255
		};
		if (t === 4) return {
			mode: "rgb",
			r: (e >> 12 & 15 | e >> 8 & 240) / 255,
			g: (e >> 8 & 15 | e >> 4 & 240) / 255,
			b: (e >> 4 & 15 | e & 240) / 255,
			alpha: (e & 15 | e << 4 & 240) / 255
		};
		if (t === 6) return {
			mode: "rgb",
			r: (e >> 16 & 255) / 255,
			g: (e >> 8 & 255) / 255,
			b: (e & 255) / 255
		};
		if (t === 8) return {
			mode: "rgb",
			r: (e >> 24 & 255) / 255,
			g: (e >> 16 & 255) / 255,
			b: (e >> 8 & 255) / 255,
			alpha: (e & 255) / 255
		};
	}
}, Jd = {
	aliceblue: 15792383,
	antiquewhite: 16444375,
	aqua: 65535,
	aquamarine: 8388564,
	azure: 15794175,
	beige: 16119260,
	bisque: 16770244,
	black: 0,
	blanchedalmond: 16772045,
	blue: 255,
	blueviolet: 9055202,
	brown: 10824234,
	burlywood: 14596231,
	cadetblue: 6266528,
	chartreuse: 8388352,
	chocolate: 13789470,
	coral: 16744272,
	cornflowerblue: 6591981,
	cornsilk: 16775388,
	crimson: 14423100,
	cyan: 65535,
	darkblue: 139,
	darkcyan: 35723,
	darkgoldenrod: 12092939,
	darkgray: 11119017,
	darkgreen: 25600,
	darkgrey: 11119017,
	darkkhaki: 12433259,
	darkmagenta: 9109643,
	darkolivegreen: 5597999,
	darkorange: 16747520,
	darkorchid: 10040012,
	darkred: 9109504,
	darksalmon: 15308410,
	darkseagreen: 9419919,
	darkslateblue: 4734347,
	darkslategray: 3100495,
	darkslategrey: 3100495,
	darkturquoise: 52945,
	darkviolet: 9699539,
	deeppink: 16716947,
	deepskyblue: 49151,
	dimgray: 6908265,
	dimgrey: 6908265,
	dodgerblue: 2003199,
	firebrick: 11674146,
	floralwhite: 16775920,
	forestgreen: 2263842,
	fuchsia: 16711935,
	gainsboro: 14474460,
	ghostwhite: 16316671,
	gold: 16766720,
	goldenrod: 14329120,
	gray: 8421504,
	green: 32768,
	greenyellow: 11403055,
	grey: 8421504,
	honeydew: 15794160,
	hotpink: 16738740,
	indianred: 13458524,
	indigo: 4915330,
	ivory: 16777200,
	khaki: 15787660,
	lavender: 15132410,
	lavenderblush: 16773365,
	lawngreen: 8190976,
	lemonchiffon: 16775885,
	lightblue: 11393254,
	lightcoral: 15761536,
	lightcyan: 14745599,
	lightgoldenrodyellow: 16448210,
	lightgray: 13882323,
	lightgreen: 9498256,
	lightgrey: 13882323,
	lightpink: 16758465,
	lightsalmon: 16752762,
	lightseagreen: 2142890,
	lightskyblue: 8900346,
	lightslategray: 7833753,
	lightslategrey: 7833753,
	lightsteelblue: 11584734,
	lightyellow: 16777184,
	lime: 65280,
	limegreen: 3329330,
	linen: 16445670,
	magenta: 16711935,
	maroon: 8388608,
	mediumaquamarine: 6737322,
	mediumblue: 205,
	mediumorchid: 12211667,
	mediumpurple: 9662683,
	mediumseagreen: 3978097,
	mediumslateblue: 8087790,
	mediumspringgreen: 64154,
	mediumturquoise: 4772300,
	mediumvioletred: 13047173,
	midnightblue: 1644912,
	mintcream: 16121850,
	mistyrose: 16770273,
	moccasin: 16770229,
	navajowhite: 16768685,
	navy: 128,
	oldlace: 16643558,
	olive: 8421376,
	olivedrab: 7048739,
	orange: 16753920,
	orangered: 16729344,
	orchid: 14315734,
	palegoldenrod: 15657130,
	palegreen: 10025880,
	paleturquoise: 11529966,
	palevioletred: 14381203,
	papayawhip: 16773077,
	peachpuff: 16767673,
	peru: 13468991,
	pink: 16761035,
	plum: 14524637,
	powderblue: 11591910,
	purple: 8388736,
	rebeccapurple: 6697881,
	red: 16711680,
	rosybrown: 12357519,
	royalblue: 4286945,
	saddlebrown: 9127187,
	salmon: 16416882,
	sandybrown: 16032864,
	seagreen: 3050327,
	seashell: 16774638,
	sienna: 10506797,
	silver: 12632256,
	skyblue: 8900331,
	slateblue: 6970061,
	slategray: 7372944,
	slategrey: 7372944,
	snow: 16775930,
	springgreen: 65407,
	steelblue: 4620980,
	tan: 13808780,
	teal: 32896,
	thistle: 14204888,
	tomato: 16737095,
	turquoise: 4251856,
	violet: 15631086,
	wheat: 16113331,
	white: 16777215,
	whitesmoke: 16119285,
	yellow: 16776960,
	yellowgreen: 10145074
}, Yd = (e) => qd(Jd[e.toLowerCase()], 6), Xd = /^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i, Zd = (e) => {
	let t;
	return (t = e.match(Xd)) ? qd(parseInt(t[1], 16), t[1].length) : void 0;
}, Qd = "([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)";
`${Qd}`;
var $d = `${Qd}%`;
`${Qd}`;
var ef = `(?:${Qd}%|${Qd})`, tf = `(?:${Qd}%|${Qd}|none)`, nf = `(?:${Qd}(deg|grad|rad|turn)|${Qd})`;
`${Qd}${Qd}`;
var rf = "\\s*,\\s*";
RegExp("^" + tf + "$");
//#endregion
//#region ../../../node_modules/culori/src/rgb/parseRgbLegacy.js
var af = RegExp(`^rgba?\\(\\s*${Qd}${rf}${Qd}${rf}${Qd}\\s*(?:,\\s*${ef}\\s*)?\\)$`), of = RegExp(`^rgba?\\(\\s*${$d}${rf}${$d}${rf}${$d}\\s*(?:,\\s*${ef}\\s*)?\\)$`), sf = (e) => {
	let t = { mode: "rgb" }, n;
	if (n = e.match(af)) n[1] !== void 0 && (t.r = n[1] / 255), n[2] !== void 0 && (t.g = n[2] / 255), n[3] !== void 0 && (t.b = n[3] / 255);
	else if (n = e.match(of)) n[1] !== void 0 && (t.r = n[1] / 100), n[2] !== void 0 && (t.g = n[2] / 100), n[3] !== void 0 && (t.b = n[3] / 100);
	else return;
	return n[4] === void 0 ? n[5] !== void 0 && (t.alpha = Math.max(0, Math.min(1, +n[5]))) : t.alpha = Math.max(0, Math.min(1, n[4] / 100)), t;
}, cf = (e, t) => e === void 0 ? void 0 : typeof e == "object" ? e.mode === void 0 ? t ? {
	...e,
	mode: t
} : void 0 : e : Af(e), lf = (e = "rgb") => (t) => (t = cf(t, e)) === void 0 ? void 0 : t.mode === e ? t : uf[t.mode][e] ? uf[t.mode][e](t) : e === "rgb" ? uf[t.mode].rgb(t) : uf.rgb[e](uf[t.mode].rgb(t)), uf = {}, df = {}, ff = [], pf = {}, mf = (e) => e, J = (e) => (uf[e.mode] = {
	...uf[e.mode],
	...e.toMode
}, Object.keys(e.fromMode || {}).forEach((t) => {
	uf[t] || (uf[t] = {}), uf[t][e.mode] = e.fromMode[t];
}), e.ranges ||= {}, e.difference ||= {}, e.channels.forEach((t) => {
	if (e.ranges[t] === void 0 && (e.ranges[t] = [0, 1]), !e.interpolate[t]) throw Error(`Missing interpolator for: ${t}`);
	typeof e.interpolate[t] == "function" && (e.interpolate[t] = { use: e.interpolate[t] }), e.interpolate[t].fixup || (e.interpolate[t].fixup = mf);
}), df[e.mode] = e, (e.parse || []).forEach((t) => {
	gf(t, e.mode);
}), lf(e.mode)), hf = (e) => df[e], gf = (e, t) => {
	if (typeof e == "string") {
		if (!t) throw Error("'mode' required when 'parser' is a string");
		pf[e] = t;
	} else typeof e == "function" && ff.indexOf(e) < 0 && ff.push(e);
}, _f = /[^\x00-\x7F]|[a-zA-Z_]/, vf = /[^\x00-\x7F]|[-\w]/, Y = {
	Function: "function",
	Ident: "ident",
	Number: "number",
	Percentage: "percentage",
	ParenClose: ")",
	None: "none",
	Hue: "hue",
	Alpha: "alpha"
}, X = 0;
function yf(e) {
	let t = e[X], n = e[X + 1];
	return t === "-" || t === "+" ? /\d/.test(n) || n === "." && /\d/.test(e[X + 2]) : t === "." ? /\d/.test(n) : /\d/.test(t);
}
function bf(e) {
	if (X >= e.length) return !1;
	let t = e[X];
	if (_f.test(t)) return !0;
	if (t === "-") {
		if (e.length - X < 2) return !1;
		let t = e[X + 1];
		return !!(t === "-" || _f.test(t));
	}
	return !1;
}
var xf = {
	deg: 1,
	rad: 180 / Math.PI,
	grad: 9 / 10,
	turn: 360
};
function Sf(e) {
	let t = "";
	if ((e[X] === "-" || e[X] === "+") && (t += e[X++]), t += Cf(e), e[X] === "." && /\d/.test(e[X + 1]) && (t += e[X++] + Cf(e)), (e[X] === "e" || e[X] === "E") && ((e[X + 1] === "-" || e[X + 1] === "+") && /\d/.test(e[X + 2]) ? t += e[X++] + e[X++] + Cf(e) : /\d/.test(e[X + 1]) && (t += e[X++] + Cf(e))), bf(e)) {
		let n = wf(e);
		return n === "deg" || n === "rad" || n === "turn" || n === "grad" ? {
			type: Y.Hue,
			value: t * xf[n]
		} : void 0;
	}
	return e[X] === "%" ? (X++, {
		type: Y.Percentage,
		value: +t
	}) : {
		type: Y.Number,
		value: +t
	};
}
function Cf(e) {
	let t = "";
	for (; /\d/.test(e[X]);) t += e[X++];
	return t;
}
function wf(e) {
	let t = "";
	for (; X < e.length && vf.test(e[X]);) t += e[X++];
	return t;
}
function Tf(e) {
	let t = wf(e);
	return e[X] === "(" ? (X++, {
		type: Y.Function,
		value: t
	}) : t === "none" ? {
		type: Y.None,
		value: void 0
	} : {
		type: Y.Ident,
		value: t
	};
}
function Ef(e = "") {
	let t = e.trim(), n = [], r;
	for (X = 0; X < t.length;) {
		if (r = t[X++], r === "\n" || r === "	" || r === " ") {
			for (; X < t.length && (t[X] === "\n" || t[X] === "	" || t[X] === " ");) X++;
			continue;
		}
		if (r === ",") return;
		if (r === ")") {
			n.push({ type: Y.ParenClose });
			continue;
		}
		if (r === "+") {
			if (X--, yf(t)) {
				n.push(Sf(t));
				continue;
			}
			return;
		}
		if (r === "-") {
			if (X--, yf(t)) {
				n.push(Sf(t));
				continue;
			}
			if (bf(t)) {
				n.push({
					type: Y.Ident,
					value: wf(t)
				});
				continue;
			}
			return;
		}
		if (r === ".") {
			if (X--, yf(t)) {
				n.push(Sf(t));
				continue;
			}
			return;
		}
		if (r === "/") {
			for (; X < t.length && (t[X] === "\n" || t[X] === "	" || t[X] === " ");) X++;
			let e;
			if (yf(t) && (e = Sf(t), e.type !== Y.Hue)) {
				n.push({
					type: Y.Alpha,
					value: e
				});
				continue;
			}
			if (bf(t) && wf(t) === "none") {
				n.push({
					type: Y.Alpha,
					value: {
						type: Y.None,
						value: void 0
					}
				});
				continue;
			}
			return;
		}
		if (/\d/.test(r)) {
			X--, n.push(Sf(t));
			continue;
		}
		if (_f.test(r)) {
			X--, n.push(Tf(t));
			continue;
		}
		return;
	}
	return n;
}
function Df(e) {
	e._i = 0;
	let t = e[e._i++];
	if (!t || t.type !== Y.Function || t.value !== "color" || (t = e[e._i++], t.type !== Y.Ident)) return;
	let n = pf[t.value];
	if (!n) return;
	let r = { mode: n }, i = Of(e, !1);
	if (!i) return;
	let a = hf(n).channels;
	for (let e = 0, t, n; e < a.length; e++) t = i[e], n = a[e], t.type !== Y.None && (r[n] = t.type === Y.Number ? t.value : t.value / 100, n === "alpha" && (r[n] = Math.max(0, Math.min(1, r[n]))));
	return r;
}
function Of(e, t) {
	let n = [], r;
	for (; e._i < e.length;) {
		if (r = e[e._i++], r.type === Y.None || r.type === Y.Number || r.type === Y.Alpha || r.type === Y.Percentage || t && r.type === Y.Hue) {
			n.push(r);
			continue;
		}
		if (r.type === Y.ParenClose) {
			if (e._i < e.length) return;
			continue;
		}
		return;
	}
	if (!(n.length < 3 || n.length > 4)) {
		if (n.length === 4) {
			if (n[3].type !== Y.Alpha) return;
			n[3] = n[3].value;
		}
		return n.length === 3 && n.push({
			type: Y.None,
			value: void 0
		}), n.every((e) => e.type !== Y.Alpha) ? n : void 0;
	}
}
function kf(e, t) {
	e._i = 0;
	let n = e[e._i++];
	if (!n || n.type !== Y.Function) return;
	let r = Of(e, t);
	if (r) return r.unshift(n.value), r;
}
var Af = (e) => {
	if (typeof e != "string") return;
	let t = Ef(e), n = t ? kf(t, !0) : void 0, r, i = 0, a = ff.length;
	for (; i < a;) if ((r = ff[i++](e, n)) !== void 0) return r;
	return t ? Df(t) : void 0;
};
//#endregion
//#region ../../../node_modules/culori/src/rgb/parseRgb.js
function jf(e, t) {
	if (!t || t[0] !== "rgb" && t[0] !== "rgba") return;
	let n = { mode: "rgb" }, [, r, i, a, o] = t;
	if (r.type !== Y.Hue && i.type !== Y.Hue && a.type !== Y.Hue) return r.type !== Y.None && (n.r = r.type === Y.Number ? r.value / 255 : r.value / 100), i.type !== Y.None && (n.g = i.type === Y.Number ? i.value / 255 : i.value / 100), a.type !== Y.None && (n.b = a.type === Y.Number ? a.value / 255 : a.value / 100), o.type !== Y.None && (n.alpha = Math.min(1, Math.max(0, o.type === Y.Number ? o.value : o.value / 100))), n;
}
//#endregion
//#region ../../../node_modules/culori/src/rgb/parseTransparent.js
var Mf = (e) => e === "transparent" ? {
	mode: "rgb",
	r: 0,
	g: 0,
	b: 0,
	alpha: 0
} : void 0, Nf = (e, t, n) => e + n * (t - e), Pf = (e) => {
	let t = [];
	for (let n = 0; n < e.length - 1; n++) {
		let r = e[n], i = e[n + 1];
		r === void 0 && i === void 0 ? t.push(void 0) : r !== void 0 && i !== void 0 ? t.push([r, i]) : t.push(r === void 0 ? [i, i] : [r, r]);
	}
	return t;
}, Z = ((e) => (t) => {
	let n = Pf(t);
	return (t) => {
		let r = t * n.length, i = t >= 1 ? n.length - 1 : Math.max(Math.floor(r), 0), a = n[i];
		return a === void 0 ? void 0 : e(a[0], a[1], r - i);
	};
})(Nf), Q = (e) => {
	let t = !1, n = e.map((e) => e === void 0 ? 1 : (t = !0, e));
	return t ? n : e;
}, Ff = {
	mode: "rgb",
	channels: [
		"r",
		"g",
		"b",
		"alpha"
	],
	parse: [
		jf,
		Zd,
		sf,
		Yd,
		Mf,
		"srgb"
	],
	serialize: "srgb",
	interpolate: {
		r: Z,
		g: Z,
		b: Z,
		alpha: {
			use: Z,
			fixup: Q
		}
	},
	gamut: !0,
	white: {
		r: 1,
		g: 1,
		b: 1
	},
	black: {
		r: 0,
		g: 0,
		b: 0
	}
}, If = (e = 0) => Math.abs(e) ** (563 / 256) * Math.sign(e), Lf = (e) => {
	let t = If(e.r), n = If(e.g), r = If(e.b), i = {
		mode: "xyz65",
		x: .5766690429101305 * t + .1855582379065463 * n + .1882286462349947 * r,
		y: .297344975250536 * t + .6273635662554661 * n + .0752914584939979 * r,
		z: .0270313613864123 * t + .0706888525358272 * n + .9913375368376386 * r
	};
	return e.alpha !== void 0 && (i.alpha = e.alpha), i;
}, Rf = (e) => Math.abs(e) ** (256 / 563) * Math.sign(e), zf = ({ x: e, y: t, z: n, alpha: r }) => {
	e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = {
		mode: "a98",
		r: Rf(e * 2.0415879038107465 - t * .5650069742788597 - .3447313507783297 * n),
		g: Rf(e * -.9692436362808798 + t * 1.8759675015077206 + .0415550574071756 * n),
		b: Rf(e * .0134442806320312 - t * .1183623922310184 + 1.0151749943912058 * n)
	};
	return r !== void 0 && (i.alpha = r), i;
}, Bf = (e = 0) => {
	let t = Math.abs(e);
	return t <= .04045 ? e / 12.92 : (Math.sign(e) || 1) * ((t + .055) / 1.055) ** 2.4;
}, Vf = ({ r: e, g: t, b: n, alpha: r }) => {
	let i = {
		mode: "lrgb",
		r: Bf(e),
		g: Bf(t),
		b: Bf(n)
	};
	return r !== void 0 && (i.alpha = r), i;
}, Hf = (e) => {
	let { r: t, g: n, b: r, alpha: i } = Vf(e), a = {
		mode: "xyz65",
		x: .4123907992659593 * t + .357584339383878 * n + .1804807884018343 * r,
		y: .2126390058715102 * t + .715168678767756 * n + .0721923153607337 * r,
		z: .0193308187155918 * t + .119194779794626 * n + .9505321522496607 * r
	};
	return i !== void 0 && (a.alpha = i), a;
}, Uf = (e = 0) => {
	let t = Math.abs(e);
	return t > .0031308 ? (Math.sign(e) || 1) * (1.055 * t ** (1 / 2.4) - .055) : e * 12.92;
}, Wf = ({ r: e, g: t, b: n, alpha: r }, i = "rgb") => {
	let a = {
		mode: i,
		r: Uf(e),
		g: Uf(t),
		b: Uf(n)
	};
	return r !== void 0 && (a.alpha = r), a;
}, Gf = ({ x: e, y: t, z: n, alpha: r }) => {
	e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = Wf({
		r: e * 3.2409699419045226 - t * 1.537383177570094 - .4986107602930034 * n,
		g: e * -.9692436362808796 + t * 1.8759675015077204 + .0415550574071756 * n,
		b: e * .0556300796969936 - t * .2039769588889765 + 1.0569715142428784 * n
	});
	return r !== void 0 && (i.alpha = r), i;
}, Kf = {
	...Ff,
	mode: "a98",
	parse: ["a98-rgb"],
	serialize: "a98-rgb",
	fromMode: {
		rgb: (e) => zf(Hf(e)),
		xyz65: zf
	},
	toMode: {
		rgb: (e) => Gf(Lf(e)),
		xyz65: Lf
	}
}, qf = (e) => (e %= 360) < 0 ? e + 360 : e, Jf = (e, t) => e.map((n, r, i) => {
	if (n === void 0) return n;
	let a = qf(n);
	return r === 0 || e[r - 1] === void 0 ? a : t(a - qf(i[r - 1]));
}).reduce((e, t) => !e.length || t === void 0 || e[e.length - 1] === void 0 ? (e.push(t), e) : (e.push(t + e[e.length - 1]), e), []), Yf = (e) => Jf(e, (e) => Math.abs(e) <= 180 ? e : e - 360 * Math.sign(e)), Xf = [
	-.14861,
	1.78277,
	-.29227,
	-.90649,
	1.97294,
	0
], Zf = Math.PI / 180, Qf = 180 / Math.PI, $f = Xf[3] * Xf[4], ep = Xf[1] * Xf[4], tp = Xf[1] * Xf[2] - Xf[0] * Xf[3], np = ({ r: e, g: t, b: n, alpha: r }) => {
	e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = (tp * n + e * $f - t * ep) / (tp + $f - ep), a = n - i, o = (Xf[4] * (t - i) - Xf[2] * a) / Xf[3], s = {
		mode: "cubehelix",
		l: i,
		s: i === 0 || i === 1 ? void 0 : Math.sqrt(a * a + o * o) / (Xf[4] * i * (1 - i))
	};
	return s.s && (s.h = Math.atan2(o, a) * Qf - 120), r !== void 0 && (s.alpha = r), s;
}, rp = ({ h: e, s: t, l: n, alpha: r }) => {
	let i = { mode: "rgb" };
	e = (e === void 0 ? 0 : e + 120) * Zf, n === void 0 && (n = 0);
	let a = t === void 0 ? 0 : t * n * (1 - n), o = Math.cos(e), s = Math.sin(e);
	return i.r = n + a * (Xf[0] * o + Xf[1] * s), i.g = n + a * (Xf[2] * o + Xf[3] * s), i.b = n + a * (Xf[4] * o + Xf[5] * s), r !== void 0 && (i.alpha = r), i;
}, ip = (e, t) => {
	if (e.h === void 0 || t.h === void 0 || !e.s || !t.s) return 0;
	let n = qf(e.h), r = qf(t.h), i = Math.sin((r - n + 360) / 2 * Math.PI / 180);
	return 2 * Math.sqrt(e.s * t.s) * i;
}, ap = (e, t) => {
	if (e.h === void 0 || t.h === void 0) return 0;
	let n = qf(e.h), r = qf(t.h);
	return Math.abs(r - n) > 180 ? n - (r - 360 * Math.sign(r - n)) : r - n;
}, op = (e, t) => {
	if (e.h === void 0 || t.h === void 0 || !e.c || !t.c) return 0;
	let n = qf(e.h), r = qf(t.h), i = Math.sin((r - n + 360) / 2 * Math.PI / 180);
	return 2 * Math.sqrt(e.c * t.c) * i;
}, sp = (e) => {
	let t = e.reduce((e, t) => {
		if (t !== void 0) {
			let n = t * Math.PI / 180;
			e.sin += Math.sin(n), e.cos += Math.cos(n);
		}
		return e;
	}, {
		sin: 0,
		cos: 0
	}), n = Math.atan2(t.sin, t.cos) * 180 / Math.PI;
	return n < 0 ? 360 + n : n;
}, cp = {
	mode: "cubehelix",
	channels: [
		"h",
		"s",
		"l",
		"alpha"
	],
	parse: ["--cubehelix"],
	serialize: "--cubehelix",
	ranges: {
		h: [0, 360],
		s: [0, 4.614],
		l: [0, 1]
	},
	fromMode: { rgb: np },
	toMode: { rgb: rp },
	interpolate: {
		h: {
			use: Z,
			fixup: Yf
		},
		s: Z,
		l: Z,
		alpha: {
			use: Z,
			fixup: Q
		}
	},
	difference: { h: ip },
	average: { h: sp }
}, lp = ({ l: e, a: t, b: n, alpha: r }, i = "lch") => {
	t === void 0 && (t = 0), n === void 0 && (n = 0);
	let a = Math.sqrt(t * t + n * n), o = {
		mode: i,
		l: e,
		c: a
	};
	return a && (o.h = qf(Math.atan2(n, t) * 180 / Math.PI)), r !== void 0 && (o.alpha = r), o;
}, up = ({ l: e, c: t, h: n, alpha: r }, i = "lab") => {
	n === void 0 && (n = 0);
	let a = {
		mode: i,
		l: e,
		a: t ? t * Math.cos(n / 180 * Math.PI) : 0,
		b: t ? t * Math.sin(n / 180 * Math.PI) : 0
	};
	return r !== void 0 && (a.alpha = r), a;
}, dp = 29 ** 3 / 27, fp = 216 / 29 ** 3, $ = {
	X: .3457 / .3585,
	Y: 1,
	Z: .2958 / .3585
}, pp = {
	X: .3127 / .329,
	Y: 1,
	Z: .3583 / .329
}, mp = (e) => e ** 3 > fp ? e ** 3 : (116 * e - 16) / dp, hp = ({ l: e, a: t, b: n, alpha: r }) => {
	e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = (e + 16) / 116, a = t / 500 + i, o = i - n / 200, s = {
		mode: "xyz65",
		x: mp(a) * pp.X,
		y: mp(i) * pp.Y,
		z: mp(o) * pp.Z
	};
	return r !== void 0 && (s.alpha = r), s;
}, gp = (e) => Gf(hp(e)), _p = (e) => e > fp ? Math.cbrt(e) : (dp * e + 16) / 116, vp = ({ x: e, y: t, z: n, alpha: r }) => {
	e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = _p(e / pp.X), a = _p(t / pp.Y), o = _p(n / pp.Z), s = {
		mode: "lab65",
		l: 116 * a - 16,
		a: 500 * (i - a),
		b: 200 * (a - o)
	};
	return r !== void 0 && (s.alpha = r), s;
}, yp = (e) => {
	let t = vp(Hf(e));
	return e.r === e.b && e.b === e.g && (t.a = t.b = 0), t;
}, bp = 26 / 180 * Math.PI, xp = Math.cos(bp), Sp = Math.sin(bp), Cp = 100 / Math.log(139 / 100), wp = ({ l: e, c: t, h: n, alpha: r }) => {
	e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = {
		mode: "lab65",
		l: (Math.exp(e * 1 / Cp) - 1) / .0039
	}, a = (Math.exp(.0435 * t * 1 * 1) - 1) / .075, o = a * Math.cos(n / 180 * Math.PI - bp), s = a * Math.sin(n / 180 * Math.PI - bp);
	return i.a = o * xp - s / .83 * Sp, i.b = o * Sp + s / .83 * xp, r !== void 0 && (i.alpha = r), i;
}, Tp = ({ l: e, a: t, b: n, alpha: r }) => {
	e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = t * xp + n * Sp, a = .83 * (n * xp - t * Sp), o = Math.sqrt(i * i + a * a), s = {
		mode: "dlch",
		l: Cp / 1 * Math.log(1 + .0039 * e),
		c: Math.log(1 + .075 * o) / .0435
	};
	return s.c && (s.h = qf((Math.atan2(a, i) + bp) / Math.PI * 180)), r !== void 0 && (s.alpha = r), s;
}, Ep = (e) => wp(lp(e, "dlch")), Dp = (e) => up(Tp(e), "dlab"), Op = {
	mode: "dlab",
	parse: ["--din99o-lab"],
	serialize: "--din99o-lab",
	toMode: {
		lab65: Ep,
		rgb: (e) => gp(Ep(e))
	},
	fromMode: {
		lab65: Dp,
		rgb: (e) => Dp(yp(e))
	},
	channels: [
		"l",
		"a",
		"b",
		"alpha"
	],
	ranges: {
		l: [0, 100],
		a: [-40.09, 45.501],
		b: [-40.469, 44.344]
	},
	interpolate: {
		l: Z,
		a: Z,
		b: Z,
		alpha: {
			use: Z,
			fixup: Q
		}
	}
}, kp = {
	mode: "dlch",
	parse: ["--din99o-lch"],
	serialize: "--din99o-lch",
	toMode: {
		lab65: wp,
		dlab: (e) => up(e, "dlab"),
		rgb: (e) => gp(wp(e))
	},
	fromMode: {
		lab65: Tp,
		dlab: (e) => lp(e, "dlch"),
		rgb: (e) => Tp(yp(e))
	},
	channels: [
		"l",
		"c",
		"h",
		"alpha"
	],
	ranges: {
		l: [0, 100],
		c: [0, 51.484],
		h: [0, 360]
	},
	interpolate: {
		l: Z,
		c: Z,
		h: {
			use: Z,
			fixup: Yf
		},
		alpha: {
			use: Z,
			fixup: Q
		}
	},
	difference: { h: op },
	average: { h: sp }
};
//#endregion
//#region ../../../node_modules/culori/src/hsi/convertHsiToRgb.js
function Ap({ h: e, s: t, i: n, alpha: r }) {
	e = qf(e === void 0 ? 0 : e), t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = Math.abs(e / 60 % 2 - 1), a;
	switch (Math.floor(e / 60)) {
		case 0:
			a = {
				r: n * (1 + t * (3 / (2 - i) - 1)),
				g: n * (1 + t * (3 * (1 - i) / (2 - i) - 1)),
				b: n * (1 - t)
			};
			break;
		case 1:
			a = {
				r: n * (1 + t * (3 * (1 - i) / (2 - i) - 1)),
				g: n * (1 + t * (3 / (2 - i) - 1)),
				b: n * (1 - t)
			};
			break;
		case 2:
			a = {
				r: n * (1 - t),
				g: n * (1 + t * (3 / (2 - i) - 1)),
				b: n * (1 + t * (3 * (1 - i) / (2 - i) - 1))
			};
			break;
		case 3:
			a = {
				r: n * (1 - t),
				g: n * (1 + t * (3 * (1 - i) / (2 - i) - 1)),
				b: n * (1 + t * (3 / (2 - i) - 1))
			};
			break;
		case 4:
			a = {
				r: n * (1 + t * (3 * (1 - i) / (2 - i) - 1)),
				g: n * (1 - t),
				b: n * (1 + t * (3 / (2 - i) - 1))
			};
			break;
		case 5:
			a = {
				r: n * (1 + t * (3 / (2 - i) - 1)),
				g: n * (1 - t),
				b: n * (1 + t * (3 * (1 - i) / (2 - i) - 1))
			};
			break;
		default: a = {
			r: n * (1 - t),
			g: n * (1 - t),
			b: n * (1 - t)
		};
	}
	return a.mode = "rgb", r !== void 0 && (a.alpha = r), a;
}
//#endregion
//#region ../../../node_modules/culori/src/hsi/convertRgbToHsi.js
function jp({ r: e, g: t, b: n, alpha: r }) {
	e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = Math.max(e, t, n), a = Math.min(e, t, n), o = {
		mode: "hsi",
		s: e + t + n === 0 ? 0 : 1 - 3 * a / (e + t + n),
		i: (e + t + n) / 3
	};
	return i - a !== 0 && (o.h = (i === e ? (t - n) / (i - a) + (t < n) * 6 : i === t ? (n - e) / (i - a) + 2 : (e - t) / (i - a) + 4) * 60), r !== void 0 && (o.alpha = r), o;
}
//#endregion
//#region ../../../node_modules/culori/src/hsi/definition.js
var Mp = {
	mode: "hsi",
	toMode: { rgb: Ap },
	parse: ["--hsi"],
	serialize: "--hsi",
	fromMode: { rgb: jp },
	channels: [
		"h",
		"s",
		"i",
		"alpha"
	],
	ranges: { h: [0, 360] },
	gamut: "rgb",
	interpolate: {
		h: {
			use: Z,
			fixup: Yf
		},
		s: Z,
		i: Z,
		alpha: {
			use: Z,
			fixup: Q
		}
	},
	difference: { h: ip },
	average: { h: sp }
};
//#endregion
//#region ../../../node_modules/culori/src/hsl/convertHslToRgb.js
function Np({ h: e, s: t, l: n, alpha: r }) {
	e = qf(e === void 0 ? 0 : e), t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = n + t * (n < .5 ? n : 1 - n), a = i - (i - n) * 2 * Math.abs(e / 60 % 2 - 1), o;
	switch (Math.floor(e / 60)) {
		case 0:
			o = {
				r: i,
				g: a,
				b: 2 * n - i
			};
			break;
		case 1:
			o = {
				r: a,
				g: i,
				b: 2 * n - i
			};
			break;
		case 2:
			o = {
				r: 2 * n - i,
				g: i,
				b: a
			};
			break;
		case 3:
			o = {
				r: 2 * n - i,
				g: a,
				b: i
			};
			break;
		case 4:
			o = {
				r: a,
				g: 2 * n - i,
				b: i
			};
			break;
		case 5:
			o = {
				r: i,
				g: 2 * n - i,
				b: a
			};
			break;
		default: o = {
			r: 2 * n - i,
			g: 2 * n - i,
			b: 2 * n - i
		};
	}
	return o.mode = "rgb", r !== void 0 && (o.alpha = r), o;
}
//#endregion
//#region ../../../node_modules/culori/src/hsl/convertRgbToHsl.js
function Pp({ r: e, g: t, b: n, alpha: r }) {
	e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = Math.max(e, t, n), a = Math.min(e, t, n), o = {
		mode: "hsl",
		s: i === a ? 0 : (i - a) / (1 - Math.abs(i + a - 1)),
		l: .5 * (i + a)
	};
	return i - a !== 0 && (o.h = (i === e ? (t - n) / (i - a) + (t < n) * 6 : i === t ? (n - e) / (i - a) + 2 : (e - t) / (i - a) + 4) * 60), r !== void 0 && (o.alpha = r), o;
}
//#endregion
//#region ../../../node_modules/culori/src/util/hue.js
var Fp = (e, t) => {
	switch (t) {
		case "deg": return +e;
		case "rad": return e / Math.PI * 180;
		case "grad": return e / 10 * 9;
		case "turn": return e * 360;
	}
}, Ip = RegExp(`^hsla?\\(\\s*${nf}${rf}${$d}${rf}${$d}\\s*(?:,\\s*${ef}\\s*)?\\)$`), Lp = (e) => {
	let t = e.match(Ip);
	if (!t) return;
	let n = { mode: "hsl" };
	return t[3] === void 0 ? t[1] !== void 0 && t[2] !== void 0 && (n.h = Fp(t[1], t[2])) : n.h = +t[3], t[4] !== void 0 && (n.s = Math.min(Math.max(0, t[4] / 100), 1)), t[5] !== void 0 && (n.l = Math.min(Math.max(0, t[5] / 100), 1)), t[6] === void 0 ? t[7] !== void 0 && (n.alpha = Math.max(0, Math.min(1, +t[7]))) : n.alpha = Math.max(0, Math.min(1, t[6] / 100)), n;
};
//#endregion
//#region ../../../node_modules/culori/src/hsl/parseHsl.js
function Rp(e, t) {
	if (!t || t[0] !== "hsl" && t[0] !== "hsla") return;
	let n = { mode: "hsl" }, [, r, i, a, o] = t;
	if (r.type !== Y.None) {
		if (r.type === Y.Percentage) return;
		n.h = r.value;
	}
	if (i.type !== Y.None) {
		if (i.type === Y.Hue) return;
		n.s = i.value / 100;
	}
	if (a.type !== Y.None) {
		if (a.type === Y.Hue) return;
		n.l = a.value / 100;
	}
	return o.type !== Y.None && (n.alpha = Math.min(1, Math.max(0, o.type === Y.Number ? o.value : o.value / 100))), n;
}
//#endregion
//#region ../../../node_modules/culori/src/hsl/definition.js
var zp = {
	mode: "hsl",
	toMode: { rgb: Np },
	fromMode: { rgb: Pp },
	channels: [
		"h",
		"s",
		"l",
		"alpha"
	],
	ranges: { h: [0, 360] },
	gamut: "rgb",
	parse: [Rp, Lp],
	serialize: (e) => `hsl(${e.h === void 0 ? "none" : e.h} ${e.s === void 0 ? "none" : e.s * 100 + "%"} ${e.l === void 0 ? "none" : e.l * 100 + "%"}${e.alpha < 1 ? ` / ${e.alpha}` : ""})`,
	interpolate: {
		h: {
			use: Z,
			fixup: Yf
		},
		s: Z,
		l: Z,
		alpha: {
			use: Z,
			fixup: Q
		}
	},
	difference: { h: ip },
	average: { h: sp }
};
//#endregion
//#region ../../../node_modules/culori/src/hsv/convertHsvToRgb.js
function Bp({ h: e, s: t, v: n, alpha: r }) {
	e = qf(e === void 0 ? 0 : e), t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = Math.abs(e / 60 % 2 - 1), a;
	switch (Math.floor(e / 60)) {
		case 0:
			a = {
				r: n,
				g: n * (1 - t * i),
				b: n * (1 - t)
			};
			break;
		case 1:
			a = {
				r: n * (1 - t * i),
				g: n,
				b: n * (1 - t)
			};
			break;
		case 2:
			a = {
				r: n * (1 - t),
				g: n,
				b: n * (1 - t * i)
			};
			break;
		case 3:
			a = {
				r: n * (1 - t),
				g: n * (1 - t * i),
				b: n
			};
			break;
		case 4:
			a = {
				r: n * (1 - t * i),
				g: n * (1 - t),
				b: n
			};
			break;
		case 5:
			a = {
				r: n,
				g: n * (1 - t),
				b: n * (1 - t * i)
			};
			break;
		default: a = {
			r: n * (1 - t),
			g: n * (1 - t),
			b: n * (1 - t)
		};
	}
	return a.mode = "rgb", r !== void 0 && (a.alpha = r), a;
}
//#endregion
//#region ../../../node_modules/culori/src/hsv/convertRgbToHsv.js
function Vp({ r: e, g: t, b: n, alpha: r }) {
	e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = Math.max(e, t, n), a = Math.min(e, t, n), o = {
		mode: "hsv",
		s: i === 0 ? 0 : 1 - a / i,
		v: i
	};
	return i - a !== 0 && (o.h = (i === e ? (t - n) / (i - a) + (t < n) * 6 : i === t ? (n - e) / (i - a) + 2 : (e - t) / (i - a) + 4) * 60), r !== void 0 && (o.alpha = r), o;
}
//#endregion
//#region ../../../node_modules/culori/src/hsv/definition.js
var Hp = {
	mode: "hsv",
	toMode: { rgb: Bp },
	parse: ["--hsv"],
	serialize: "--hsv",
	fromMode: { rgb: Vp },
	channels: [
		"h",
		"s",
		"v",
		"alpha"
	],
	ranges: { h: [0, 360] },
	gamut: "rgb",
	interpolate: {
		h: {
			use: Z,
			fixup: Yf
		},
		s: Z,
		v: Z,
		alpha: {
			use: Z,
			fixup: Q
		}
	},
	difference: { h: ip },
	average: { h: sp }
};
//#endregion
//#region ../../../node_modules/culori/src/hwb/convertHwbToRgb.js
function Up({ h: e, w: t, b: n, alpha: r }) {
	if (t === void 0 && (t = 0), n === void 0 && (n = 0), t + n > 1) {
		let e = t + n;
		t /= e, n /= e;
	}
	return Bp({
		h: e,
		s: n === 1 ? 1 : 1 - t / (1 - n),
		v: 1 - n,
		alpha: r
	});
}
//#endregion
//#region ../../../node_modules/culori/src/hwb/convertRgbToHwb.js
function Wp(e) {
	let t = Vp(e);
	if (t === void 0) return;
	let n = t.s === void 0 ? 0 : t.s, r = t.v === void 0 ? 0 : t.v, i = {
		mode: "hwb",
		w: (1 - n) * r,
		b: 1 - r
	};
	return t.h !== void 0 && (i.h = t.h), t.alpha !== void 0 && (i.alpha = t.alpha), i;
}
//#endregion
//#region ../../../node_modules/culori/src/hwb/parseHwb.js
function Gp(e, t) {
	if (!t || t[0] !== "hwb") return;
	let n = { mode: "hwb" }, [, r, i, a, o] = t;
	if (r.type !== Y.None) {
		if (r.type === Y.Percentage) return;
		n.h = r.value;
	}
	if (i.type !== Y.None) {
		if (i.type === Y.Hue) return;
		n.w = i.value / 100;
	}
	if (a.type !== Y.None) {
		if (a.type === Y.Hue) return;
		n.b = a.value / 100;
	}
	return o.type !== Y.None && (n.alpha = Math.min(1, Math.max(0, o.type === Y.Number ? o.value : o.value / 100))), n;
}
//#endregion
//#region ../../../node_modules/culori/src/hwb/definition.js
var Kp = {
	mode: "hwb",
	toMode: { rgb: Up },
	fromMode: { rgb: Wp },
	channels: [
		"h",
		"w",
		"b",
		"alpha"
	],
	ranges: { h: [0, 360] },
	gamut: "rgb",
	parse: [Gp],
	serialize: (e) => `hwb(${e.h === void 0 ? "none" : e.h} ${e.w === void 0 ? "none" : e.w * 100 + "%"} ${e.b === void 0 ? "none" : e.b * 100 + "%"}${e.alpha < 1 ? ` / ${e.alpha}` : ""})`,
	interpolate: {
		h: {
			use: Z,
			fixup: Yf
		},
		w: Z,
		b: Z,
		alpha: {
			use: Z,
			fixup: Q
		}
	},
	difference: { h: ap },
	average: { h: sp }
}, qp = .1593017578125, Jp = 78.84375, Yp = .8359375, Xp = 18.8515625, Zp = 18.6875;
function Qp(e) {
	if (e < 0) return 0;
	let t = e ** (1 / Jp);
	return 1e4 * (Math.max(0, t - Yp) / (Xp - Zp * t)) ** (1 / qp);
}
function $p(e) {
	if (e < 0) return 0;
	let t = (e / 1e4) ** qp;
	return ((Yp + Xp * t) / (1 + Zp * t)) ** +Jp;
}
//#endregion
//#region ../../../node_modules/culori/src/itp/convertItpToXyz65.js
var em = (e) => Math.max(e / 203, 0), tm = ({ i: e, t, p: n, alpha: r }) => {
	e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = Qp(e + .008609037037932761 * t + .11102962500302593 * n), a = Qp(e - .00860903703793275 * t - .11102962500302599 * n), o = Qp(e + .5600313357106791 * t - .32062717498731885 * n), s = {
		mode: "xyz65",
		x: em(2.070152218389422 * i - 1.3263473389671556 * a + .2066510476294051 * o),
		y: em(.3647385209748074 * i + .680566024947227 * a - .0453045459220346 * o),
		z: em(-.049747207535812 * i - .0492609666966138 * a + 1.1880659249923042 * o)
	};
	return r !== void 0 && (s.alpha = r), s;
}, nm = (e = 0) => Math.max(e * 203, 0), rm = ({ x: e, y: t, z: n, alpha: r }) => {
	let i = nm(e), a = nm(t), o = nm(n), s = $p(.3592832590121217 * i + .6976051147779502 * a - .0358915932320289 * o), c = $p(-.1920808463704995 * i + 1.1004767970374323 * a + .0753748658519118 * o), l = $p(.0070797844607477 * i + .0748396662186366 * a + .8433265453898765 * o), u = {
		mode: "itp",
		i: .5 * s + .5 * c,
		t: 1.61376953125 * s - 3.323486328125 * c + 1.709716796875 * l,
		p: 4.378173828125 * s - 4.24560546875 * c - .132568359375 * l
	};
	return r !== void 0 && (u.alpha = r), u;
}, im = {
	mode: "itp",
	channels: [
		"i",
		"t",
		"p",
		"alpha"
	],
	parse: ["--ictcp"],
	serialize: "--ictcp",
	toMode: {
		xyz65: tm,
		rgb: (e) => Gf(tm(e))
	},
	fromMode: {
		xyz65: rm,
		rgb: (e) => rm(Hf(e))
	},
	ranges: {
		i: [0, .581],
		t: [-.369, .272],
		p: [-.164, .331]
	},
	interpolate: {
		i: Z,
		t: Z,
		p: Z,
		alpha: {
			use: Z,
			fixup: Q
		}
	}
}, am = 134.03437499999998, om = 16295499532821565e-27, sm = (e) => {
	if (e < 0) return 0;
	let t = (e / 1e4) ** qp;
	return ((Yp + Xp * t) / (1 + Zp * t)) ** +am;
}, cm = (e = 0) => Math.max(e * 203, 0), lm = ({ x: e, y: t, z: n, alpha: r }) => {
	e = cm(e), t = cm(t), n = cm(n);
	let i = 1.15 * e - .15 * n, a = .66 * t + .34 * e, o = sm(.41478972 * i + .579999 * a + .014648 * n), s = sm(-.20151 * i + 1.120649 * a + .0531008 * n), c = sm(-.0166008 * i + .2648 * a + .6684799 * n), l = (o + s) / 2, u = {
		mode: "jab",
		j: .44 * l / (1 - .56 * l) - om,
		a: 3.524 * o - 4.066708 * s + .542708 * c,
		b: .199076 * o + 1.096799 * s - 1.295875 * c
	};
	return r !== void 0 && (u.alpha = r), u;
}, um = 134.03437499999998, dm = 16295499532821565e-27, fm = (e) => {
	if (e < 0) return 0;
	let t = e ** (1 / um);
	return 1e4 * ((Yp - t) / (Zp * t - Xp)) ** (1 / qp);
}, pm = (e) => e / 203, mm = ({ j: e, a: t, b: n, alpha: r }) => {
	e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = (e + dm) / (.44 + .56 * (e + dm)), a = fm(i + .13860504 * t + .058047316 * n), o = fm(i - .13860504 * t - .058047316 * n), s = fm(i - .096019242 * t - .8118919 * n), c = {
		mode: "xyz65",
		x: pm(1.661373024652174 * a - .914523081304348 * o + .23136208173913045 * s),
		y: pm(-.3250758611844533 * a + 1.571847026732543 * o - .21825383453227928 * s),
		z: pm(-.090982811 * a - .31272829 * o + 1.5227666 * s)
	};
	return r !== void 0 && (c.alpha = r), c;
}, hm = (e) => {
	let t = lm(Hf(e));
	return e.r === e.b && e.b === e.g && (t.a = t.b = 0), t;
}, gm = (e) => Gf(mm(e)), _m = {
	mode: "jab",
	channels: [
		"j",
		"a",
		"b",
		"alpha"
	],
	parse: ["--jzazbz"],
	serialize: "--jzazbz",
	fromMode: {
		rgb: hm,
		xyz65: lm
	},
	toMode: {
		rgb: gm,
		xyz65: mm
	},
	ranges: {
		j: [0, .222],
		a: [-.109, .129],
		b: [-.185, .134]
	},
	interpolate: {
		j: Z,
		a: Z,
		b: Z,
		alpha: {
			use: Z,
			fixup: Q
		}
	}
}, vm = ({ j: e, a: t, b: n, alpha: r }) => {
	t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = Math.sqrt(t * t + n * n), a = {
		mode: "jch",
		j: e,
		c: i
	};
	return i && (a.h = qf(Math.atan2(n, t) * 180 / Math.PI)), r !== void 0 && (a.alpha = r), a;
}, ym = ({ j: e, c: t, h: n, alpha: r }) => {
	n === void 0 && (n = 0);
	let i = {
		mode: "jab",
		j: e,
		a: t ? t * Math.cos(n / 180 * Math.PI) : 0,
		b: t ? t * Math.sin(n / 180 * Math.PI) : 0
	};
	return r !== void 0 && (i.alpha = r), i;
}, bm = {
	mode: "jch",
	parse: ["--jzczhz"],
	serialize: "--jzczhz",
	toMode: {
		jab: ym,
		rgb: (e) => gm(ym(e))
	},
	fromMode: {
		rgb: (e) => vm(hm(e)),
		jab: vm
	},
	channels: [
		"j",
		"c",
		"h",
		"alpha"
	],
	ranges: {
		j: [0, .221],
		c: [0, .19],
		h: [0, 360]
	},
	interpolate: {
		h: {
			use: Z,
			fixup: Yf
		},
		c: Z,
		j: Z,
		alpha: {
			use: Z,
			fixup: Q
		}
	},
	difference: { h: op },
	average: { h: sp }
}, xm = 29 ** 3 / 27, Sm = 216 / 29 ** 3, Cm = (e) => e ** 3 > Sm ? e ** 3 : (116 * e - 16) / xm, wm = ({ l: e, a: t, b: n, alpha: r }) => {
	e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = (e + 16) / 116, a = t / 500 + i, o = i - n / 200, s = {
		mode: "xyz50",
		x: Cm(a) * $.X,
		y: Cm(i) * $.Y,
		z: Cm(o) * $.Z
	};
	return r !== void 0 && (s.alpha = r), s;
}, Tm = ({ x: e, y: t, z: n, alpha: r }) => {
	e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = Wf({
		r: e * 3.1341359569958707 - t * 1.6173863321612538 - .4906619460083532 * n,
		g: e * -.978795502912089 + t * 1.916254567259524 + .03344273116131949 * n,
		b: e * .07195537988411677 - t * .2289768264158322 + 1.405386058324125 * n
	});
	return r !== void 0 && (i.alpha = r), i;
}, Em = (e) => Tm(wm(e)), Dm = (e) => {
	let { r: t, g: n, b: r, alpha: i } = Vf(e), a = {
		mode: "xyz50",
		x: .436065742824811 * t + .3851514688337912 * n + .14307845442264197 * r,
		y: .22249319175623702 * t + .7168870538238823 * n + .06061979053616537 * r,
		z: .013923904500943465 * t + .09708128566574634 * n + .7140993584005155 * r
	};
	return i !== void 0 && (a.alpha = i), a;
}, Om = (e) => e > Sm ? Math.cbrt(e) : (xm * e + 16) / 116, km = ({ x: e, y: t, z: n, alpha: r }) => {
	e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = Om(e / $.X), a = Om(t / $.Y), o = Om(n / $.Z), s = {
		mode: "lab",
		l: 116 * a - 16,
		a: 500 * (i - a),
		b: 200 * (a - o)
	};
	return r !== void 0 && (s.alpha = r), s;
}, Am = (e) => {
	let t = km(Dm(e));
	return e.r === e.b && e.b === e.g && (t.a = t.b = 0), t;
};
//#endregion
//#region ../../../node_modules/culori/src/lab/parseLab.js
function jm(e, t) {
	if (!t || t[0] !== "lab") return;
	let n = { mode: "lab" }, [, r, i, a, o] = t;
	if (r.type !== Y.Hue && i.type !== Y.Hue && a.type !== Y.Hue) return r.type !== Y.None && (n.l = Math.min(Math.max(0, r.value), 100)), i.type !== Y.None && (n.a = i.type === Y.Number ? i.value : i.value * 125 / 100), a.type !== Y.None && (n.b = a.type === Y.Number ? a.value : a.value * 125 / 100), o.type !== Y.None && (n.alpha = Math.min(1, Math.max(0, o.type === Y.Number ? o.value : o.value / 100))), n;
}
//#endregion
//#region ../../../node_modules/culori/src/lab/definition.js
var Mm = {
	mode: "lab",
	toMode: {
		xyz50: wm,
		rgb: Em
	},
	fromMode: {
		xyz50: km,
		rgb: Am
	},
	channels: [
		"l",
		"a",
		"b",
		"alpha"
	],
	ranges: {
		l: [0, 100],
		a: [-125, 125],
		b: [-125, 125]
	},
	parse: [jm],
	serialize: (e) => `lab(${e.l === void 0 ? "none" : e.l} ${e.a === void 0 ? "none" : e.a} ${e.b === void 0 ? "none" : e.b}${e.alpha < 1 ? ` / ${e.alpha}` : ""})`,
	interpolate: {
		l: Z,
		a: Z,
		b: Z,
		alpha: {
			use: Z,
			fixup: Q
		}
	}
}, Nm = {
	...Mm,
	mode: "lab65",
	parse: ["--lab-d65"],
	serialize: "--lab-d65",
	toMode: {
		xyz65: hp,
		rgb: gp
	},
	fromMode: {
		xyz65: vp,
		rgb: yp
	},
	ranges: {
		l: [0, 100],
		a: [-125, 125],
		b: [-125, 125]
	}
};
//#endregion
//#region ../../../node_modules/culori/src/lch/parseLch.js
function Pm(e, t) {
	if (!t || t[0] !== "lch") return;
	let n = { mode: "lch" }, [, r, i, a, o] = t;
	if (r.type !== Y.None) {
		if (r.type === Y.Hue) return;
		n.l = Math.min(Math.max(0, r.value), 100);
	}
	if (i.type !== Y.None && (n.c = Math.max(0, i.type === Y.Number ? i.value : i.value * 150 / 100)), a.type !== Y.None) {
		if (a.type === Y.Percentage) return;
		n.h = a.value;
	}
	return o.type !== Y.None && (n.alpha = Math.min(1, Math.max(0, o.type === Y.Number ? o.value : o.value / 100))), n;
}
//#endregion
//#region ../../../node_modules/culori/src/lch/definition.js
var Fm = {
	mode: "lch",
	toMode: {
		lab: up,
		rgb: (e) => Em(up(e))
	},
	fromMode: {
		rgb: (e) => lp(Am(e)),
		lab: lp
	},
	channels: [
		"l",
		"c",
		"h",
		"alpha"
	],
	ranges: {
		l: [0, 100],
		c: [0, 150],
		h: [0, 360]
	},
	parse: [Pm],
	serialize: (e) => `lch(${e.l === void 0 ? "none" : e.l} ${e.c === void 0 ? "none" : e.c} ${e.h === void 0 ? "none" : e.h}${e.alpha < 1 ? ` / ${e.alpha}` : ""})`,
	interpolate: {
		h: {
			use: Z,
			fixup: Yf
		},
		c: Z,
		l: Z,
		alpha: {
			use: Z,
			fixup: Q
		}
	},
	difference: { h: op },
	average: { h: sp }
}, Im = {
	...Fm,
	mode: "lch65",
	parse: ["--lch-d65"],
	serialize: "--lch-d65",
	toMode: {
		lab65: (e) => up(e, "lab65"),
		rgb: (e) => gp(up(e, "lab65"))
	},
	fromMode: {
		rgb: (e) => lp(yp(e), "lch65"),
		lab65: (e) => lp(e, "lch65")
	},
	ranges: {
		l: [0, 100],
		c: [0, 150],
		h: [0, 360]
	}
}, Lm = ({ l: e, u: t, v: n, alpha: r }) => {
	t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = Math.sqrt(t * t + n * n), a = {
		mode: "lchuv",
		l: e,
		c: i
	};
	return i && (a.h = qf(Math.atan2(n, t) * 180 / Math.PI)), r !== void 0 && (a.alpha = r), a;
}, Rm = ({ l: e, c: t, h: n, alpha: r }) => {
	n === void 0 && (n = 0);
	let i = {
		mode: "luv",
		l: e,
		u: t ? t * Math.cos(n / 180 * Math.PI) : 0,
		v: t ? t * Math.sin(n / 180 * Math.PI) : 0
	};
	return r !== void 0 && (i.alpha = r), i;
}, zm = (e, t, n) => 4 * e / (e + 15 * t + 3 * n), Bm = (e, t, n) => 9 * t / (e + 15 * t + 3 * n), Vm = zm($.X, $.Y, $.Z), Hm = Bm($.X, $.Y, $.Z), Um = (e) => e <= Sm ? xm * e : 116 * Math.cbrt(e) - 16, Wm = ({ x: e, y: t, z: n, alpha: r }) => {
	e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = Um(t / $.Y), a = zm(e, t, n), o = Bm(e, t, n);
	!isFinite(a) || !isFinite(o) ? i = a = o = 0 : (a = 13 * i * (a - Vm), o = 13 * i * (o - Hm));
	let s = {
		mode: "luv",
		l: i,
		u: a,
		v: o
	};
	return r !== void 0 && (s.alpha = r), s;
}, Gm = (e, t, n) => 4 * e / (e + 15 * t + 3 * n), Km = (e, t, n) => 9 * t / (e + 15 * t + 3 * n), qm = Gm($.X, $.Y, $.Z), Jm = Km($.X, $.Y, $.Z), Ym = ({ l: e, u: t, v: n, alpha: r }) => {
	if (e === void 0 && (e = 0), e === 0) return {
		mode: "xyz50",
		x: 0,
		y: 0,
		z: 0
	};
	t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = t / (13 * e) + qm, a = n / (13 * e) + Jm, o = $.Y * (e <= 8 ? e / xm : ((e + 16) / 116) ** 3), s = {
		mode: "xyz50",
		x: 9 * i * o / (4 * a),
		y: o,
		z: o * (12 - 3 * i - 20 * a) / (4 * a)
	};
	return r !== void 0 && (s.alpha = r), s;
}, Xm = {
	mode: "lchuv",
	toMode: {
		luv: Rm,
		rgb: (e) => Tm(Ym(Rm(e)))
	},
	fromMode: {
		rgb: (e) => Lm(Wm(Dm(e))),
		luv: Lm
	},
	channels: [
		"l",
		"c",
		"h",
		"alpha"
	],
	parse: ["--lchuv"],
	serialize: "--lchuv",
	ranges: {
		l: [0, 100],
		c: [0, 176.956],
		h: [0, 360]
	},
	interpolate: {
		h: {
			use: Z,
			fixup: Yf
		},
		c: Z,
		l: Z,
		alpha: {
			use: Z,
			fixup: Q
		}
	},
	difference: { h: op },
	average: { h: sp }
}, Zm = {
	...Ff,
	mode: "lrgb",
	toMode: { rgb: Wf },
	fromMode: { rgb: Vf },
	parse: ["srgb-linear"],
	serialize: "srgb-linear"
}, Qm = {
	mode: "luv",
	toMode: {
		xyz50: Ym,
		rgb: (e) => Tm(Ym(e))
	},
	fromMode: {
		xyz50: Wm,
		rgb: (e) => Wm(Dm(e))
	},
	channels: [
		"l",
		"u",
		"v",
		"alpha"
	],
	parse: ["--luv"],
	serialize: "--luv",
	ranges: {
		l: [0, 100],
		u: [-84.936, 175.042],
		v: [-125.882, 87.243]
	},
	interpolate: {
		l: Z,
		u: Z,
		v: Z,
		alpha: {
			use: Z,
			fixup: Q
		}
	}
}, $m = ({ r: e, g: t, b: n, alpha: r }) => {
	e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = Math.cbrt(.412221469470763 * e + .5363325372617348 * t + .0514459932675022 * n), a = Math.cbrt(.2119034958178252 * e + .6806995506452344 * t + .1073969535369406 * n), o = Math.cbrt(.0883024591900564 * e + .2817188391361215 * t + .6299787016738222 * n), s = {
		mode: "oklab",
		l: .210454268309314 * i + .7936177747023054 * a - .0040720430116193 * o,
		a: 1.9779985324311684 * i - 2.42859224204858 * a + .450593709617411 * o,
		b: .0259040424655478 * i + .7827717124575296 * a - .8086757549230774 * o
	};
	return r !== void 0 && (s.alpha = r), s;
}, eh = (e) => {
	let t = $m(Vf(e));
	return e.r === e.b && e.b === e.g && (t.a = t.b = 0), t;
}, th = ({ l: e, a: t, b: n, alpha: r }) => {
	e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = (e + .3963377773761749 * t + .2158037573099136 * n) ** 3, a = (e - .1055613458156586 * t - .0638541728258133 * n) ** 3, o = (e - .0894841775298119 * t - 1.2914855480194092 * n) ** 3, s = {
		mode: "lrgb",
		r: 4.076741636075957 * i - 3.3077115392580616 * a + .2309699031821044 * o,
		g: -1.2684379732850317 * i + 2.6097573492876887 * a - .3413193760026573 * o,
		b: -.0041960761386756 * i - .7034186179359362 * a + 1.7076146940746117 * o
	};
	return r !== void 0 && (s.alpha = r), s;
}, nh = (e) => Wf(th(e));
//#endregion
//#region ../../../node_modules/culori/src/okhsl/helpers.js
function rh(e) {
	let t = .206, n = 1.206 / 1.03;
	return .5 * (n * e - t + Math.sqrt((n * e - t) * (n * e - t) + .12 * n * e));
}
function ih(e) {
	return (e * e + .206 * e) / (1.206 / 1.03 * (e + .03));
}
function ah(e, t) {
	let n, r, i, a, o, s, c, l;
	-1.88170328 * e - .80936493 * t > 1 ? (n = 1.19086277, r = 1.76576728, i = .59662641, a = .75515197, o = .56771245, s = 4.0767416621, c = -3.3077115913, l = .2309699292) : 1.81444104 * e - 1.19445276 * t > 1 ? (n = .73956515, r = -.45954404, i = .08285427, a = .1254107, o = .14503204, s = -1.2684380046, c = 2.6097574011, l = -.3413193965) : (n = 1.35733652, r = -.00915799, i = -1.1513021, a = -.50559606, o = .00692167, s = -.0041960863, c = -.7034186147, l = 1.707614701);
	let u = n + r * e + i * t + a * e * e + o * e * t, d = .3963377774 * e + .2158037573 * t, f = -.1055613458 * e - .0638541728 * t, p = -.0894841775 * e - 1.291485548 * t;
	{
		let e = 1 + u * d, t = 1 + u * f, n = 1 + u * p, r = e * e * e, i = t * t * t, a = n * n * n, o = 3 * d * e * e, m = 3 * f * t * t, h = 3 * p * n * n, g = 6 * d * d * e, _ = 6 * f * f * t, v = 6 * p * p * n, y = s * r + c * i + l * a, b = s * o + c * m + l * h, x = s * g + c * _ + l * v;
		u -= y * b / (b * b - .5 * y * x);
	}
	return u;
}
function oh(e, t) {
	let n = ah(e, t), r = th({
		l: 1,
		a: n * e,
		b: n * t
	}), i = Math.cbrt(1 / Math.max(r.r, r.g, r.b));
	return [i, i * n];
}
function sh(e, t, n, r, i, a = null) {
	a ||= oh(e, t);
	let o;
	if ((n - i) * a[1] - (a[0] - i) * r <= 0) o = a[1] * i / (r * a[0] + a[1] * (i - n));
	else {
		o = a[1] * (i - 1) / (r * (a[0] - 1) + a[1] * (i - n));
		{
			let a = n - i, s = r, c = .3963377774 * e + .2158037573 * t, l = -.1055613458 * e - .0638541728 * t, u = -.0894841775 * e - 1.291485548 * t, d = a + s * c, f = a + s * l, p = a + s * u;
			{
				let e = i * (1 - o) + o * n, t = o * r, a = e + t * c, s = e + t * l, m = e + t * u, h = a * a * a, g = s * s * s, _ = m * m * m, v = 3 * d * a * a, y = 3 * f * s * s, b = 3 * p * m * m, x = 6 * d * d * a, S = 6 * f * f * s, C = 6 * p * p * m, w = 4.0767416621 * h - 3.3077115913 * g + .2309699292 * _ - 1, T = 4.0767416621 * v - 3.3077115913 * y + .2309699292 * b, ee = 4.0767416621 * x - 3.3077115913 * S + .2309699292 * C, E = T / (T * T - .5 * w * ee), te = -w * E, ne = -1.2684380046 * h + 2.6097574011 * g - .3413193965 * _ - 1, re = -1.2684380046 * v + 2.6097574011 * y - .3413193965 * b, D = -1.2684380046 * x + 2.6097574011 * S - .3413193965 * C, O = re / (re * re - .5 * ne * D), ie = -ne * O, ae = -.0041960863 * h - .7034186147 * g + 1.707614701 * _ - 1, oe = -.0041960863 * v - .7034186147 * y + 1.707614701 * b, se = -.0041960863 * x - .7034186147 * S + 1.707614701 * C, ce = oe / (oe * oe - .5 * ae * se), le = -ae * ce;
				te = E >= 0 ? te : 1e6, ie = O >= 0 ? ie : 1e6, le = ce >= 0 ? le : 1e6, o += Math.min(te, Math.min(ie, le));
			}
		}
	}
	return o;
}
function ch(e, t, n = null) {
	n ||= oh(e, t);
	let r = n[0], i = n[1];
	return [i / r, i / (1 - r)];
}
function lh(e, t, n) {
	let r = oh(t, n), i = sh(t, n, e, 1, e, r), a = ch(t, n, r), o = .11516993 + 1 / (7.4477897 + 4.1590124 * n + t * (-2.19557347 + 1.75198401 * n + t * (-2.13704948 - 10.02301043 * n + t * (-4.24894561 + 5.38770819 * n + 4.69891013 * t)))), s = .11239642 + 1 / (1.6132032 - .68124379 * n + t * (.40370612 + .90148123 * n + t * (-.27087943 + .6122399 * n + t * (.00299215 - .45399568 * n - .14661872 * t)))), c = i / Math.min(e * a[0], (1 - e) * a[1]), l = e * o, u = (1 - e) * s, d = .9 * c * Math.sqrt(Math.sqrt(1 / (1 / (l * l * l * l) + 1 / (u * u * u * u))));
	return l = e * .4, u = (1 - e) * .8, [
		Math.sqrt(1 / (1 / (l * l) + 1 / (u * u))),
		d,
		i
	];
}
//#endregion
//#region ../../../node_modules/culori/src/okhsl/convertOklabToOkhsl.js
function uh(e) {
	let t = e.l === void 0 ? 0 : e.l, n = e.a === void 0 ? 0 : e.a, r = e.b === void 0 ? 0 : e.b, i = {
		mode: "okhsl",
		l: rh(t)
	};
	e.alpha !== void 0 && (i.alpha = e.alpha);
	let a = Math.sqrt(n * n + r * r);
	if (!a) return i.s = 0, i;
	let [o, s, c] = lh(t, n / a, r / a), l;
	if (a < s) {
		let e = .8 * o, t = 1 - e / s;
		l = (a - 0) / (e + t * (a - 0)) * .8;
	} else {
		let e = s, t = .2 * s * s * 1.25 * 1.25 / o, n = 1 - t / (c - s);
		l = .8 + .2 * ((a - e) / (t + n * (a - e)));
	}
	return l && (i.s = l, i.h = qf(Math.atan2(r, n) * 180 / Math.PI)), i;
}
//#endregion
//#region ../../../node_modules/culori/src/okhsl/convertOkhslToOklab.js
function dh(e) {
	let t = e.h === void 0 ? 0 : e.h, n = e.s === void 0 ? 0 : e.s, r = e.l === void 0 ? 0 : e.l, i = {
		mode: "oklab",
		l: ih(r)
	};
	if (e.alpha !== void 0 && (i.alpha = e.alpha), !n || r === 1) return i.a = i.b = 0, i;
	let a = Math.cos(t / 180 * Math.PI), o = Math.sin(t / 180 * Math.PI), [s, c, l] = lh(i.l, a, o), u, d, f, p;
	n < .8 ? (u = 1.25 * n, d = 0, f = .8 * s, p = 1 - f / c) : (u = 5 * (n - .8), d = c, f = .2 * c * c * 1.25 * 1.25 / s, p = 1 - f / (l - c));
	let m = d + u * f / (1 - p * u);
	return i.a = m * a, i.b = m * o, i;
}
//#endregion
//#region ../../../node_modules/culori/src/okhsl/modeOkhsl.js
var fh = {
	...zp,
	mode: "okhsl",
	channels: [
		"h",
		"s",
		"l",
		"alpha"
	],
	parse: ["--okhsl"],
	serialize: "--okhsl",
	fromMode: {
		oklab: uh,
		rgb: (e) => uh(eh(e))
	},
	toMode: {
		oklab: dh,
		rgb: (e) => nh(dh(e))
	}
};
//#endregion
//#region ../../../node_modules/culori/src/okhsv/convertOklabToOkhsv.js
function ph(e) {
	let t = e.l === void 0 ? 0 : e.l, n = e.a === void 0 ? 0 : e.a, r = e.b === void 0 ? 0 : e.b, i = Math.sqrt(n * n + r * r), a = i ? n / i : 1, o = i ? r / i : 1, [s, c] = ch(a, o), l = .5, u = 1 - l / s, d = c / (i + t * c), f = d * t, p = d * i, m = ih(f), h = p * m / f, g = th({
		l: m,
		a: a * h,
		b: o * h
	}), _ = Math.cbrt(1 / Math.max(g.r, g.g, g.b, 0));
	t /= _, i = i / _ * rh(t) / t, t = rh(t);
	let v = {
		mode: "okhsv",
		s: i ? (l + c) * p / (c * l + c * u * p) : 0,
		v: t ? t / f : 0
	};
	return v.s && (v.h = qf(Math.atan2(r, n) * 180 / Math.PI)), e.alpha !== void 0 && (v.alpha = e.alpha), v;
}
//#endregion
//#region ../../../node_modules/culori/src/okhsv/convertOkhsvToOklab.js
function mh(e) {
	let t = { mode: "oklab" };
	e.alpha !== void 0 && (t.alpha = e.alpha);
	let n = e.h === void 0 ? 0 : e.h, r = e.s === void 0 ? 0 : e.s, i = e.v === void 0 ? 0 : e.v, a = Math.cos(n / 180 * Math.PI), o = Math.sin(n / 180 * Math.PI), [s, c] = ch(a, o), l = .5, u = 1 - l / s, d = 1 - r * l / (l + c - c * u * r), f = r * c * l / (l + c - c * u * r), p = ih(d), m = f * p / d, h = th({
		l: p,
		a: a * m,
		b: o * m
	}), g = Math.cbrt(1 / Math.max(h.r, h.g, h.b, 0)), _ = ih(i * d), v = f * _ / d;
	return t.l = _ * g, t.a = v * a * g, t.b = v * o * g, t;
}
//#endregion
//#region ../../../node_modules/culori/src/okhsv/modeOkhsv.js
var hh = {
	...Hp,
	mode: "okhsv",
	channels: [
		"h",
		"s",
		"v",
		"alpha"
	],
	parse: ["--okhsv"],
	serialize: "--okhsv",
	fromMode: {
		oklab: ph,
		rgb: (e) => ph(eh(e))
	},
	toMode: {
		oklab: mh,
		rgb: (e) => nh(mh(e))
	}
};
//#endregion
//#region ../../../node_modules/culori/src/oklab/parseOklab.js
function gh(e, t) {
	if (!t || t[0] !== "oklab") return;
	let n = { mode: "oklab" }, [, r, i, a, o] = t;
	if (r.type !== Y.Hue && i.type !== Y.Hue && a.type !== Y.Hue) return r.type !== Y.None && (n.l = Math.min(Math.max(0, r.type === Y.Number ? r.value : r.value / 100), 1)), i.type !== Y.None && (n.a = i.type === Y.Number ? i.value : i.value * .4 / 100), a.type !== Y.None && (n.b = a.type === Y.Number ? a.value : a.value * .4 / 100), o.type !== Y.None && (n.alpha = Math.min(1, Math.max(0, o.type === Y.Number ? o.value : o.value / 100))), n;
}
//#endregion
//#region ../../../node_modules/culori/src/oklab/definition.js
var _h = {
	...Mm,
	mode: "oklab",
	toMode: {
		lrgb: th,
		rgb: nh
	},
	fromMode: {
		lrgb: $m,
		rgb: eh
	},
	ranges: {
		l: [0, 1],
		a: [-.4, .4],
		b: [-.4, .4]
	},
	parse: [gh],
	serialize: (e) => `oklab(${e.l === void 0 ? "none" : e.l} ${e.a === void 0 ? "none" : e.a} ${e.b === void 0 ? "none" : e.b}${e.alpha < 1 ? ` / ${e.alpha}` : ""})`
};
//#endregion
//#region ../../../node_modules/culori/src/oklch/parseOklch.js
function vh(e, t) {
	if (!t || t[0] !== "oklch") return;
	let n = { mode: "oklch" }, [, r, i, a, o] = t;
	if (r.type !== Y.None) {
		if (r.type === Y.Hue) return;
		n.l = Math.min(Math.max(0, r.type === Y.Number ? r.value : r.value / 100), 1);
	}
	if (i.type !== Y.None && (n.c = Math.max(0, i.type === Y.Number ? i.value : i.value * .4 / 100)), a.type !== Y.None) {
		if (a.type === Y.Percentage) return;
		n.h = a.value;
	}
	return o.type !== Y.None && (n.alpha = Math.min(1, Math.max(0, o.type === Y.Number ? o.value : o.value / 100))), n;
}
//#endregion
//#region ../../../node_modules/culori/src/oklch/definition.js
var yh = {
	...Fm,
	mode: "oklch",
	toMode: {
		oklab: (e) => up(e, "oklab"),
		rgb: (e) => nh(up(e, "oklab"))
	},
	fromMode: {
		rgb: (e) => lp(eh(e), "oklch"),
		oklab: (e) => lp(e, "oklch")
	},
	parse: [vh],
	serialize: (e) => `oklch(${e.l === void 0 ? "none" : e.l} ${e.c === void 0 ? "none" : e.c} ${e.h === void 0 ? "none" : e.h}${e.alpha < 1 ? ` / ${e.alpha}` : ""})`,
	ranges: {
		l: [0, 1],
		c: [0, .4],
		h: [0, 360]
	}
}, bh = (e) => {
	let { r: t, g: n, b: r, alpha: i } = Vf(e), a = {
		mode: "xyz65",
		x: .486570948648216 * t + .265667693169093 * n + .1982172852343625 * r,
		y: .2289745640697487 * t + .6917385218365062 * n + .079286914093745 * r,
		z: 0 * t + .0451133818589026 * n + 1.043944368900976 * r
	};
	return i !== void 0 && (a.alpha = i), a;
}, xh = ({ x: e, y: t, z: n, alpha: r }) => {
	e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = Wf({
		r: e * 2.4934969119414263 - t * .9313836179191242 - .402710784450717 * n,
		g: e * -.8294889695615749 + t * 1.7626640603183465 + .0236246858419436 * n,
		b: e * .0358458302437845 - t * .0761723892680418 + .9568845240076871 * n
	}, "p3");
	return r !== void 0 && (i.alpha = r), i;
}, Sh = {
	...Ff,
	mode: "p3",
	parse: ["display-p3"],
	serialize: "display-p3",
	fromMode: {
		rgb: (e) => xh(Hf(e)),
		xyz65: xh
	},
	toMode: {
		rgb: (e) => Gf(bh(e)),
		xyz65: bh
	}
}, Ch = (e) => {
	let t = Math.abs(e);
	return t >= 1 / 512 ? Math.sign(e) * t ** (1 / 1.8) : 16 * e;
}, wh = ({ x: e, y: t, z: n, alpha: r }) => {
	e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = {
		mode: "prophoto",
		r: Ch(e * 1.3457868816471585 - t * .2555720873797946 - .0511018649755453 * n),
		g: Ch(e * -.5446307051249019 + t * 1.5082477428451466 + .0205274474364214 * n),
		b: Ch(e * 0 + t * 0 + 1.2119675456389452 * n)
	};
	return r !== void 0 && (i.alpha = r), i;
}, Th = (e = 0) => {
	let t = Math.abs(e);
	return t >= 16 / 512 ? Math.sign(e) * t ** 1.8 : e / 16;
}, Eh = (e) => {
	let t = Th(e.r), n = Th(e.g), r = Th(e.b), i = {
		mode: "xyz50",
		x: .7977666449006423 * t + .1351812974005331 * n + .0313477341283922 * r,
		y: .2880748288194013 * t + .7118352342418731 * n + 899369387256e-16 * r,
		z: 0 * t + 0 * n + .8251046025104602 * r
	};
	return e.alpha !== void 0 && (i.alpha = e.alpha), i;
}, Dh = {
	...Ff,
	mode: "prophoto",
	parse: ["prophoto-rgb"],
	serialize: "prophoto-rgb",
	fromMode: {
		xyz50: wh,
		rgb: (e) => wh(Dm(e))
	},
	toMode: {
		xyz50: Eh,
		rgb: (e) => Tm(Eh(e))
	}
}, Oh = 1.09929682680944, kh = .018053968510807, Ah = (e) => {
	let t = Math.abs(e);
	return t > kh ? (Math.sign(e) || 1) * (Oh * t ** .45 - .09929682680944008) : 4.5 * e;
}, jh = ({ x: e, y: t, z: n, alpha: r }) => {
	e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = 0);
	let i = {
		mode: "rec2020",
		r: Ah(e * 1.7166511879712683 - t * .3556707837763925 - .2533662813736599 * n),
		g: Ah(e * -.6666843518324893 + t * 1.6164812366349395 + .0157685458139111 * n),
		b: Ah(e * .0176398574453108 - t * .0427706132578085 + .9421031212354739 * n)
	};
	return r !== void 0 && (i.alpha = r), i;
}, Mh = 1.09929682680944, Nh = .018053968510807, Ph = (e = 0) => {
	let t = Math.abs(e);
	return t < Nh * 4.5 ? e / 4.5 : (Math.sign(e) || 1) * ((t + Mh - 1) / Mh) ** (1 / .45);
}, Fh = (e) => {
	let t = Ph(e.r), n = Ph(e.g), r = Ph(e.b), i = {
		mode: "xyz65",
		x: .6369580483012911 * t + .1446169035862083 * n + .1688809751641721 * r,
		y: .262700212011267 * t + .6779980715188708 * n + .059301716469862 * r,
		z: 0 * t + .0280726930490874 * n + 1.0609850577107909 * r
	};
	return e.alpha !== void 0 && (i.alpha = e.alpha), i;
}, Ih = {
	...Ff,
	mode: "rec2020",
	fromMode: {
		xyz65: jh,
		rgb: (e) => jh(Hf(e))
	},
	toMode: {
		xyz65: Fh,
		rgb: (e) => Gf(Fh(e))
	},
	parse: ["rec2020"],
	serialize: "rec2020"
}, Lh = .0037930732552754493, Rh = Math.cbrt(Lh), zh = (e) => Math.cbrt(e) - Rh, Bh = (e) => {
	let { r: t, g: n, b: r, alpha: i } = Vf(e), a = zh(.3 * t + .622 * n + .078 * r + Lh), o = zh(.23 * t + .692 * n + .078 * r + Lh), s = zh(.2434226892454782 * t + .2047674442449682 * n + .5518098665095535 * r + Lh), c = {
		mode: "xyb",
		x: (a - o) / 2,
		y: (a + o) / 2,
		b: s - (a + o) / 2
	};
	return i !== void 0 && (c.alpha = i), c;
}, Vh = (e) => (e + Rh) ** 3, Hh = {
	mode: "xyb",
	channels: [
		"x",
		"y",
		"b",
		"alpha"
	],
	parse: ["--xyb"],
	serialize: "--xyb",
	toMode: { rgb: ({ x: e, y: t, b: n, alpha: r }) => {
		e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = 0);
		let i = Vh(e + t) - Lh, a = Vh(t - e) - Lh, o = Vh(n + t) - Lh, s = Wf({
			r: 11.031566904639861 * i - 9.866943908131562 * a - .16462299650829934 * o,
			g: -3.2541473810744237 * i + 4.418770377582723 * a - .16462299650829934 * o,
			b: -3.6588512867136815 * i + 2.7129230459360922 * a + 1.9459282407775895 * o
		});
		return r !== void 0 && (s.alpha = r), s;
	} },
	fromMode: { rgb: Bh },
	ranges: {
		x: [-.0154, .0281],
		y: [0, .8453],
		b: [-.2778, .388]
	},
	interpolate: {
		x: Z,
		y: Z,
		b: Z,
		alpha: {
			use: Z,
			fixup: Q
		}
	}
}, Uh = {
	mode: "xyz50",
	parse: ["xyz-d50"],
	serialize: "xyz-d50",
	toMode: {
		rgb: Tm,
		lab: km
	},
	fromMode: {
		rgb: Dm,
		lab: wm
	},
	channels: [
		"x",
		"y",
		"z",
		"alpha"
	],
	ranges: {
		x: [0, .964],
		y: [0, .999],
		z: [0, .825]
	},
	interpolate: {
		x: Z,
		y: Z,
		z: Z,
		alpha: {
			use: Z,
			fixup: Q
		}
	}
}, Wh = {
	mode: "xyz65",
	toMode: {
		rgb: Gf,
		xyz50: (e) => {
			let { x: t, y: n, z: r, alpha: i } = e;
			t === void 0 && (t = 0), n === void 0 && (n = 0), r === void 0 && (r = 0);
			let a = {
				mode: "xyz50",
				x: 1.0479298208405488 * t + .0229467933410191 * n - .0501922295431356 * r,
				y: .0296278156881593 * t + .990434484573249 * n - .0170738250293851 * r,
				z: -.0092430581525912 * t + .0150551448965779 * n + .7518742899580008 * r
			};
			return i !== void 0 && (a.alpha = i), a;
		}
	},
	fromMode: {
		rgb: Hf,
		xyz50: (e) => {
			let { x: t, y: n, z: r, alpha: i } = e;
			t === void 0 && (t = 0), n === void 0 && (n = 0), r === void 0 && (r = 0);
			let a = {
				mode: "xyz65",
				x: .9554734527042182 * t - .0230985368742614 * n + .0632593086610217 * r,
				y: -.0283697069632081 * t + 1.0099954580058226 * n + .021041398966943 * r,
				z: .0123140016883199 * t - .0205076964334779 * n + 1.3303659366080753 * r
			};
			return i !== void 0 && (a.alpha = i), a;
		}
	},
	ranges: {
		x: [0, .95],
		y: [0, 1],
		z: [0, 1.088]
	},
	channels: [
		"x",
		"y",
		"z",
		"alpha"
	],
	parse: ["xyz", "xyz-d65"],
	serialize: "xyz-d65",
	interpolate: {
		x: Z,
		y: Z,
		z: Z,
		alpha: {
			use: Z,
			fixup: Q
		}
	}
}, Gh = {
	mode: "yiq",
	toMode: { rgb: ({ y: e, i: t, q: n, alpha: r }) => {
		e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = 0);
		let i = {
			mode: "rgb",
			r: e + .95608445 * t + .6208885 * n,
			g: e - .27137664 * t - .6486059 * n,
			b: e - 1.10561724 * t + 1.70250126 * n
		};
		return r !== void 0 && (i.alpha = r), i;
	} },
	fromMode: { rgb: ({ r: e, g: t, b: n, alpha: r }) => {
		e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = 0);
		let i = {
			mode: "yiq",
			y: .29889531 * e + .58662247 * t + .11448223 * n,
			i: .59597799 * e - .2741761 * t - .32180189 * n,
			q: .21147017 * e - .52261711 * t + .31114694 * n
		};
		return r !== void 0 && (i.alpha = r), i;
	} },
	channels: [
		"y",
		"i",
		"q",
		"alpha"
	],
	parse: ["--yiq"],
	serialize: "--yiq",
	ranges: {
		i: [-.595, .595],
		q: [-.522, .522]
	},
	interpolate: {
		y: Z,
		i: Z,
		q: Z,
		alpha: {
			use: Z,
			fixup: Q
		}
	}
};
J(Kf), J(cp), J(Op), J(kp), J(Mp), J(zp), J(Hp), J(Kp), J(im), J(_m), J(bm), J(Mm), J(Nm), J(Fm), J(Im), J(Xm), J(Zm), J(Qm), J(fh), J(hh), J(_h), J(yh), J(Sh), J(Dh), J(Ih), J(Ff), J(Hh), J(Uh), J(Wh), J(Gh);
//#endregion
//#region ../../projects/lur.e/src/utils/opfs/content-addressed-store.ts
var Kh = (e) => {
	let t = String(e || "").split("/").filter(Boolean);
	if (!t.length || t.some((e) => e === "." || e === "..")) throw Error("A non-empty safe storage namespace is required");
	return `/${t.join("/")}`;
}, qh = (e, t = "") => {
	let n = String(t || "").trim(), r = (n.startsWith("/") ? n : `${e}/${n}`).split("/").filter(Boolean);
	if (!r.length || r.some((e) => e === "." || e === "..")) throw Error("Unsafe OPFS storage path");
	let i = `/${r.join("/")}`;
	if (i !== e && !i.startsWith(`${e}/`)) throw Error("Storage path escapes its namespace");
	return i;
}, Jh = (e) => [...new Uint8Array(e)].map((e) => e.toString(16).padStart(2, "0")).join(""), Yh = async (e) => {
	if (!globalThis.crypto?.subtle) throw Error("Web Crypto is required for content-addressed storage");
	return Jh(await globalThis.crypto.subtle.digest("SHA-256", await e.arrayBuffer()));
}, Xh = null, Zh = () => (Xh ??= import("./OPFS-CC8HO8jG.js").then((e) => e.t).then(({ readFile: e, removeFile: t, writeFile: n }) => ({
	async read(t) {
		return await e(null, t).catch(() => null);
	},
	async write(e, t) {
		if (!await n(null, e, typeof t == "string" ? new Blob([t], { type: "application/json" }) : t).catch(() => !1)) throw Error(`Could not write ${e}`);
	},
	async removeTree(e) {
		if (!await t(null, e, { recursive: !0 }).catch(() => !1)) throw Error(`Could not clear ${e}`);
	}
})), Xh), Qh = (e, t) => {
	let n = Kh(e), r = () => t ? Promise.resolve(t) : Zh();
	return {
		async put(e) {
			if (!(e instanceof File)) throw TypeError("Content store accepts File instances only");
			let t = await Yh(e), i = qh(n, `blobs/${t}`), a = await r();
			return await a.read(i) || await a.write(i, e), {
				hash: t,
				path: i,
				name: e.name || "attachment",
				type: e.type || "application/octet-stream",
				size: e.size,
				lastModified: e.lastModified || Date.now()
			};
		},
		async get(e) {
			try {
				if (!e?.path || !e?.hash) return null;
				let t = qh(n, e.path), i = await (await r()).read(t);
				return i ? new File([i], e.name || "attachment", {
					type: e.type || i.type || "application/octet-stream",
					lastModified: e.lastModified || Date.now()
				}) : null;
			} catch {
				return null;
			}
		},
		async readJson(e) {
			try {
				let t = await (await r()).read(qh(n, e));
				return t ? JSON.parse(await t.text()) : null;
			} catch {
				return null;
			}
		},
		async writeJson(e, t) {
			await (await r()).write(qh(n, e), new Blob([JSON.stringify(t)], { type: "application/json" }));
		},
		async clear(e = "") {
			await (await r()).removeTree(qh(n, e));
		}
	};
}, $h = class {
	dbName;
	storeName;
	db = null;
	constructor(e, t) {
		this.dbName = e, this.storeName = t;
	}
	async open() {
		return this.db ? this.db : new Promise((e, t) => {
			let n = indexedDB.open(this.dbName, 1);
			n.onerror = () => t(n.error), n.onsuccess = () => {
				this.db = n.result, e(this.db);
			}, n.onupgradeneeded = (e) => {
				let t = e.target.result;
				t.objectStoreNames.contains(this.storeName) || t.createObjectStore(this.storeName, { keyPath: "id" });
			};
		});
	}
	async get(e) {
		let t = await this.open();
		return new Promise((n, r) => {
			let i = t.transaction([this.storeName], "readonly").objectStore(this.storeName).get(e);
			i.onerror = () => r(i.error), i.onsuccess = () => n(i.result || null);
		});
	}
	async set(e, t) {
		let n = await this.open();
		return new Promise((r, i) => {
			let a = n.transaction([this.storeName], "readwrite").objectStore(this.storeName).put({
				id: e,
				...t
			});
			a.onerror = () => i(a.error), a.onsuccess = () => r();
		});
	}
	async delete(e) {
		let t = await this.open();
		return new Promise((n, r) => {
			let i = t.transaction([this.storeName], "readwrite").objectStore(this.storeName).delete(e);
			i.onerror = () => r(i.error), i.onsuccess = () => n();
		});
	}
	async getAll() {
		let e = await this.open();
		return new Promise((t, n) => {
			let r = e.transaction([this.storeName], "readonly").objectStore(this.storeName).getAll();
			r.onerror = () => n(r.error), r.onsuccess = () => t(r.result || []);
		});
	}
	async clear() {
		let e = await this.open();
		return new Promise((t, n) => {
			let r = e.transaction([this.storeName], "readwrite").objectStore(this.storeName).clear();
			r.onerror = () => n(r.error), r.onsuccess = () => t();
		});
	}
	close() {
		this.db?.close(), this.db = null;
	}
};
new $h("rs-workcenter", "data"), new $h("rs-history", "entries"), new $h("rs-settings", "config");
//#endregion
//#region ../../projects/lur.e/src/utils/opfs/WriteFileSmart-v2.ts
var eg = null, tg = () => (eg ||= Promise.resolve().then(() => yg).then((e) => ({
	readFile: e.readFile,
	writeFile: e.writeFile
})), eg), ng = (e, t = !0) => {
	let n = String(e || "").trim();
	return t && (n = n.toLowerCase()), n = n.replace(/\s+/g, "-"), n = n.replace(/[^a-z0-9_.\-+#&]/g, "-"), n = n.replace(/-+/g, "-"), n;
}, rg = (e = "") => e ? e.includes("json") ? "json" : e.includes("markdown") ? "md" : e.includes("plain") ? "txt" : e === "image/jpeg" || e === "image/jpg" ? "jpg" : e === "image/png" ? "png" : e.startsWith("image/") ? e.split("/").pop() || "" : e.includes("html") ? "html" : "" : "", ig = (e) => String(e || "").split("/").filter(Boolean), ag = (e) => e.endsWith("/") ? e : e + "/", og = (e, t = !0) => (t ? "/" : "") + e.filter(Boolean).join("/"), sg = (e) => og(ig(e).map((e) => ng(e))), cg = [
	"id",
	"_id",
	"key",
	"slug",
	"name"
], lg = (e) => Object.prototype.toString.call(e) === "[object Object]";
function ug(e, t) {
	let n = Array.isArray(t.arrayKey) ? t.arrayKey : t.arrayKey ? [t.arrayKey] : cg, r = [], i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
	for (let t of e) if (t != null) {
		if (lg(t)) {
			let e;
			for (let r of n) if (r in t && t[r] != null) {
				e = String(t[r]);
				break;
			}
			if (e != null) a.has(e) || (a.set(e, t), r.push(t));
			else {
				let e = fg(t);
				o.has(e) || (o.add(e), r.push(t));
			}
		} else if (Array.isArray(t)) {
			let e = fg(t);
			o.has(e) || (o.add(e), r.push(t));
		} else i.has(t) || (i.add(t), r.push(t));
	}
	return r;
}
function dg(e, t, n) {
	if (Array.isArray(e) && Array.isArray(t)) switch (n.arrayStrategy) {
		case "replace": return t.slice();
		case "concat": return e.concat(t);
		default: return ug(e.concat(t), { arrayKey: n.arrayKey });
	}
	if (lg(e) && lg(t)) {
		let r = { ...e };
		for (let i of Object.keys(t)) r[i] = i in e ? dg(e[i], t[i], n) : t[i];
		return r;
	}
	return t;
}
function fg(e) {
	if (!lg(e)) return JSON.stringify(e);
	let t = Object.keys(e).sort(), n = {};
	for (let r of t) n[r] = e[r];
	return JSON.stringify(n);
}
async function pg(e) {
	return await e.text();
}
async function mg(e, t) {
	try {
		let { readFile: n } = await tg(), r = await n(e, t)?.catch?.(console.warn.bind(console));
		if (!r) return null;
		let i = await pg(r);
		return i?.trim() ? H.parse(i) : null;
	} catch {
		return null;
	}
}
var hg = async (e, t, n, r = {}) => {
	let { writeFile: i } = await tg(), { forceExt: a, ensureJson: o, toLower: s = !0, sanitize: c = !0, mergeJson: l, arrayStrategy: u = "union", arrayKey: d, jsonSpace: f = 2 } = r, p = String(t || "").trim(), m = p.endsWith("/"), h = !m && ig(p).length > 0 && p.includes("."), g = m ? p : h ? p.split("/").slice(0, -1).join("/") : p, _ = h ? p.split("/").pop() || "" : n?.name || "";
	g ||= "/", _ ||= Date.now() + "";
	let v = _.lastIndexOf("."), y = v > 0 ? _.slice(0, v) : _, b = a || (o ? "json" : v > 0 ? _.slice(v + 1) : rg(n?.type || "")) || "";
	c && (g = sg(g), y = ng(y, s));
	let x = b ? `${y}.${b}` : y, S = ag(g) + x;
	if (l !== !1 && (o || b.toLowerCase() === "json" || n?.type === "application/json")) try {
		let t;
		if (n instanceof File || n instanceof Blob) {
			let e = await pg(n);
			t = e?.trim() ? H.parse(e) : {};
		} else t = n;
		let r = await mg(e, S)?.catch?.(console.warn.bind(console)), a = r == null ? t : dg(r, t, {
			arrayStrategy: u,
			arrayKey: d
		}), o = JSON.stringify(a, void 0, f), s = await i(e, S, new File([o], x, { type: "application/json" }))?.catch?.(console.warn.bind(console));
		return typeof document < "u" && document?.dispatchEvent?.(new CustomEvent("rs-fs-changed", {
			detail: s,
			bubbles: !0,
			composed: !0,
			cancelable: !0
		})), s;
	} catch (e) {
		console.warn("writeFileSmart JSON merge failed, falling back to raw write:", e);
	}
	let C;
	if (n instanceof File) {
		if (n.name === x) C = n;
		else {
			let e = n.type || (b ? `application/${b}` : "application/octet-stream"), t = await n.arrayBuffer();
			C = new File([t], x, { type: e });
		}
	} else {
		let e = n.type || (b ? `application/${b}` : "application/octet-stream");
		C = new File([await n.arrayBuffer()], x, { type: e });
	}
	let w = await i(e, S, C)?.catch?.(console.warn.bind(console));
	return typeof document < "u" && document?.dispatchEvent?.(new CustomEvent("rs-fs-changed", {
		detail: w,
		bubbles: !0,
		composed: !0,
		cancelable: !0
	})), w;
}, gg = (e = "", t = "") => {
	let n = t.endsWith("/") ? t : `${t}/`;
	return e.startsWith(n);
}, _g = new BroadcastChannel("rs-fs"), vg = /* @__PURE__ */ new Map();
_g.addEventListener("close", () => vg.clear()), _g.addEventListener("message", (e) => {
	let t = e?.data;
	if (!t || t.type !== "commit-result" && t.type !== "commit-to-clipboard") return;
	let n = t?.results ?? [];
	if (!(!Array.isArray(n) || !n.length)) {
		for (let [e, t] of vg.entries()) if (t.size && n.some((t) => gg(t?.path, e))) for (let e of t) try {
			e();
		} catch (e) {
			console.warn(e);
		}
	}
});
//#endregion
//#region ../../projects/lur.e/src/index.ts
var yg = /* @__PURE__ */ e({
	$behavior: () => Ga,
	$createElement: () => pc,
	$mapped: () => Ua,
	$observeAttribute: () => Xa,
	$observeInput: () => Ya,
	$virtual: () => Wa,
	ANIMATABLE_BRAND: () => to,
	C: () => Yo,
	CSM: () => wl,
	CSSCalc: () => Gl,
	ClosePriority: () => Tc,
	DESKTOP_DRAFT_KEY: () => Jl,
	DESKTOP_MAIN_KEY: () => ql,
	E: () => hc,
	EventHandler: () => Ls,
	Fragment: () => xc,
	GLitElement: () => Ll,
	H: () => bl,
	I: () => bc,
	IDBStorage: () => $h,
	ITEM_COMPACT_KIND: () => ITEM_COMPACT_KIND,
	JUNCTION_DRAG_EVENTS: () => Da,
	JUNCTION_RESIZE_EVENTS: () => Oa,
	JUNCTION_SELECT_EVENTS: () => Ea,
	JunctionDragMixin: () => Ia,
	JunctionResizeMixin: () => La,
	JunctionSelectMixin: () => Fa,
	M: () => rc,
	OWNER: () => "DOM",
	Q: () => Bs,
	Qp: () => fc,
	ReactiveViewport: () => Kl,
	S: () => Lo,
	SwM: () => vc,
	addAdoptedSheetToElement: () => cn,
	addProxiedEvent: () => Wl,
	addToBank: () => Qa,
	adoptedBlobMap: () => et,
	adoptedLayerMap: () => Yt,
	adoptedMap: () => Qe,
	adoptedSelectorMap: () => Gt,
	adoptedShadowLayerMap: () => Zt,
	adoptedShadowSelectorMap: () => qt,
	adoptedStyleSheetsCache: () => en,
	alives: () => Ha,
	applyNormalizedInlineStyle: () => co,
	attrLink: () => Lc,
	attrRef: () => Kc,
	bindCtrl: () => qa,
	bindHandler: () => $a,
	bindStyle: () => Vo,
	bindTriggerHandlers: () => dc,
	bindWith: () => eo,
	blobToBytes: () => Ae,
	blobURLMap: () => Lt,
	cacheMap: () => zt,
	checkedLink: () => Bc,
	checkedRef: () => Zc,
	colorScheme: () => Gd,
	compileInlineStyleAttribute: () => Bo,
	copyFromOneHandlerToAnother: () => _e,
	createContentAddressedStore: () => Qh,
	createElement: () => Sc,
	cssTextForAdoptedSheet: () => ct,
	cssTextRequiresInlineStyleElement: () => jt,
	currentHandleMap: () => A,
	decodeBase64ToBytes: () => Ee,
	decodeDesktopState: () => Xl,
	defaultLogger: () => he,
	defineElement: () => Pl,
	directHandlers: () => ce,
	dynamicBgColors: () => Ud,
	dynamicNativeFrame: () => Hd,
	dynamicTheme: () => Wd,
	elMap: () => Ba,
	electronAPI: () => Md,
	ensureAdoptedSheetContent: () => lt,
	ensureHostStyles: () => dn,
	ensureWorker: () => ve,
	eventTrigger: () => Mc,
	fetchAndCache: () => Bt,
	fetchAsInline: () => Ut,
	getAdoptedStyleRule: () => Qt,
	getDirectoryHandle: () => be,
	getPadding: () => Ot,
	getPropertyValue: () => Dt,
	ghostImage: () => ue,
	handleError: () => k,
	hasFileExtension: () => xe,
	hashBlob: () => Yh,
	historyState: () => Cc,
	html: () => gl,
	htmlBuilder: () => yl,
	isAnimatableValue: () => no,
	isBase64Like: () => Oe,
	isEffectivelyEmptyStyleText: () => oo,
	isNativeCSSStyleValue: () => lo,
	isNotExtended: () => Il,
	isReactiveStyleValue: () => uo,
	isStyleBinding: () => ro,
	isStyleHost: () => xt,
	junctionToBox: () => Ta,
	lazyAddEventListener: () => Bl,
	listenerOptionsFor: () => ac,
	loadAsAdopted: () => mt,
	loadBlobStyle: () => Je,
	loadCachedStyles: () => gn,
	loadDesktopRaw: () => Zl,
	loadInlineStyle: () => Ye,
	loadStyleSheet: () => qe,
	localStorageLink: () => Fc,
	localStorageLinkMap: () => Dc,
	localStorageRef: () => Yc,
	makeLinker: () => Pc,
	makeRef: () => Gc,
	makeUIState: () => Ad,
	mappedRoots: () => de,
	matchMediaLink: () => Ic,
	matchMediaRef: () => $c,
	maybeStartThemeEngine: () => Kd,
	mergeByKey: () => Td,
	mixinDisposers: () => Aa,
	mutationTrigger: () => Nc,
	navigate: () => wc,
	normalizeDataAsset: () => Te,
	normalizePath: () => fe,
	notifyStyleTreeHosts: () => Ct,
	observeStyleTree: () => Tt,
	parseDataUrl: () => we,
	pickBgColor: () => Bd,
	pickFromCenter: () => Vd,
	post: () => ye,
	preloadStyle: () => Xe,
	promiseOrDirect: () => Ft,
	propStore: () => Sl,
	property: () => Fl,
	pruneEmptyStyleAttribute: () => so,
	readFile: () => ge,
	reflectControllers: () => Ja,
	registerDirectoryRoot: () => me,
	registerStyleTreeHook: () => wt,
	reloadInto: () => wd,
	removeAdopted: () => Et,
	removeFile: () => pe,
	removeFromBank: () => Za,
	resolvePath: () => se,
	resolveRootHandle: () => Se,
	saveUIState: () => kd,
	scheduleEnsureHostStyles: () => hn,
	scrollLink: () => zc,
	scrollRef: () => Qc,
	setStyleURL: () => Pt,
	sizeLink: () => Rc,
	sizeRef: () => Xc,
	stringToBlob: () => De,
	stringToBlobOrFile: () => ke,
	styleCache: () => nn,
	styleElementCache: () => an,
	supportsConstructableStylesheet: () => At,
	unregisterDirectoryRoot: () => Ce,
	valueAsNumberLink: () => Hc,
	valueAsNumberRef: () => Jc,
	valueLink: () => Vc,
	valueRef: () => qc,
	withProperties: () => Nl,
	withTriggerModifiers: () => uc,
	writeFile: () => le,
	writeFileSmart: () => hg
});
//#endregion
export { Et as A, On as C, mt as D, At as E, Ye as O, Dn as S, hn as T, z as _, kd as a, Ur as b, Zl as c, Fl as d, bl as f, Ci as g, Vo as h, Ad as i, Xe as k, Ll as l, Lo as m, hg as n, H as o, wc as p, Qh as r, Xl as s, yg as t, Pl as u, mi as v, _n as w, Ir as x, Fr as y };
