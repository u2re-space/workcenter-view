//#region ../../projects/core.ts/src/utils/Primitive.ts
var e = Symbol.for("@fix"), t = (e) => Array.isArray(e) || e instanceof Set || e instanceof Map, n = (e) => typeof e == "string" || typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" || e === void 0 || e == null, r = (e, t) => n(e) ? t == "number" ? Number(e) || 0 : t == "string" ? String(e) || "" : t == "boolean" ? !!e : e : null, i = (e, t = "value") => (typeof e == "object" || typeof e == "function") && e != null && (t in e || e?.[t] != null), a = (e) => i(e, "value"), o = (e) => n(e) ? e : a(e) ? e?.value : e, s = (t, n) => t?.[e] ?? t ?? n ?? n, c = (e) => e != null && (typeof e == "object" || typeof e == "function") && (e instanceof WeakRef || typeof e?.deref == "function") ? c(e?.deref?.()) : e, l = (t) => {
	if (typeof t == "function" || t == null) return t;
	let n = function() {};
	return n[e] = t, n;
}, u = (e, t, n) => (e = c(e), e != null && (typeof e == "object" || typeof e == "function") ? e[t] = o(n = c(n)) : e), d = (e) => crypto?.getRandomValues ? crypto?.getRandomValues?.(e) : (() => {
	let t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = Math.floor(Math.random() * 256);
	return t;
})(), f = () => crypto?.randomUUID ? crypto?.randomUUID?.() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (e) => (e ^ d?.(/* @__PURE__ */ new Uint8Array(1))?.[0] & 15 >> e / 4).toString(16)), p = (e) => e && e?.replace?.(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), m = (e) => e && e?.replace?.(/-([a-z])/g, (e, t) => t.toUpperCase()), ee = (e) => typeof CSSStyleValue < "u" && e instanceof CSSStyleValue, te = (e) => e != null && (typeof e != "boolean" || e !== !1) && typeof e != "object" && typeof e != "function", ne = (e) => typeof e == "boolean" ? e ? "" : null : typeof e == "number" ? String(e) : e, h = Symbol.for("@trigger-lock"), re = (e, t, n = "value") => {
	i(e, n) && (e[h] = !0);
	let r;
	try {
		r = t?.();
	} finally {
		i(e, n) && delete e[h];
	}
	return r;
}, ie = (e) => {
	if (typeof e != "string") return null;
	let t = [...e?.matchAll?.(/^\d+(\.\d+)?$/g)];
	if (t?.length != 1) return null;
	let n = parseFloat(t[0][0]);
	return !Number.isNaN(n) && Number.isFinite(n) ? n : null;
}, ae = /^\d+$/g, oe = (e) => {
	if (typeof e != "string" || (e = e?.trim?.(), e == "" || e == null)) return null;
	let t = [...e?.matchAll?.(ae)];
	if (t?.length != 1) return null;
	let n = parseInt(t[0][0]);
	return !Number.isNaN(n) && Number.isInteger(n) ? n : null;
}, se = (e) => typeof e == "string" ? oe(e) != null : typeof e == "number" && Number.isInteger(e) && e >= 0, ce = (e, t, n) => {
	e = e instanceof WeakRef ? e.deref() : e;
	let r = [...Object.entries(n)].map?.(([n, r]) => e?.[t]?.call?.(e, n, r));
	return () => {
		r?.forEach?.((e) => e?.());
	};
}, le = (e) => e instanceof WeakRef || typeof e?.deref == "function", ue = (e) => e == null || le(e) ? e : typeof e == "function" || typeof e == "object" ? new WeakRef(e) : e, de = (e) => (typeof e == "object" || typeof e == "function") && (e?.value != null || e != null && "value" in e), fe = (e) => e != null && (typeof e == "object" || typeof e == "function"), pe = (e) => a(e) ? e?.value : e, me = (e, t) => e instanceof Promise || typeof e?.then == "function" ? e?.then?.(t) : t?.(e), he = (e, t) => e instanceof Promise || typeof e?.then == "function" ? e?.then?.(t) : t?.(e), ge = function(e) {
	return (t) => {
		e[h] = !0;
		let n;
		try {
			n = t?.();
		} finally {
			e[h] = !1;
		}
		return n;
	};
}, _e = (e) => Array.isArray(e) ? e?.flatMap?.((e) => Array.isArray(e) ? _e(e) : e) : e, g = (e) => _e(e)?.every?.(_), _ = (e) => n(e) || typeof SharedArrayBuffer == "function" && e instanceof SharedArrayBuffer || ve(e) || Array.isArray(e) && g(e), ve = (e) => ArrayBuffer.isView(e) && !(e instanceof DataView), v = (e) => n(e) || typeof ArrayBuffer == "function" && e instanceof ArrayBuffer || typeof MessagePort == "function" && e instanceof MessagePort || typeof ReadableStream == "function" && e instanceof ReadableStream || typeof WritableStream == "function" && e instanceof WritableStream || typeof TransformStream == "function" && e instanceof TransformStream || typeof ImageBitmap == "function" && e instanceof ImageBitmap || typeof VideoFrame == "function" && e instanceof VideoFrame || typeof OffscreenCanvas == "function" && e instanceof OffscreenCanvas || typeof RTCDataChannel == "function" && e instanceof RTCDataChannel || typeof AudioData == "function" && e instanceof AudioData || typeof WebTransportReceiveStream == "function" && e instanceof WebTransportReceiveStream || typeof WebTransportSendStream == "function" && e instanceof WebTransportSendStream || typeof WebTransportReceiveStream == "function" && e instanceof WebTransportReceiveStream, ye = (e) => {
	switch (typeof e) {
		case "number": return 0;
		case "string": return "";
		case "boolean": return !1;
		case "object": return null;
		case "function": return null;
		case "symbol": return null;
		case "bigint": return 0n;
	}
}, y = (e) => typeof e?.[Symbol.iterator] == "function", be = (e) => [
	"symbol",
	"string",
	"number"
].indexOf(typeof e) >= 0, xe = (e, t, n = null) => {
	let r = n != null && (typeof e == "object" || typeof e == "function") ? e?.[n] ?? e : e, i = [];
	t instanceof Set || t instanceof Map || Array.isArray(t) || y(t) ? i = (r instanceof Set || r instanceof WeakSet ? t?.values?.() : t?.entries?.()) || (Array.isArray(t) || y(t) ? t : []) : (typeof t == "object" || typeof t == "function") && (i = r instanceof Set || r instanceof WeakSet ? Object.values(t) : Object.entries(t));
	let a = [];
	Array.isArray(r) ? a = r.entries() : r instanceof Map || r instanceof WeakMap ? a = r?.entries?.() : r instanceof Set || r instanceof WeakSet ? a = r?.values?.() : (typeof r == "object" || typeof r == "function") && (a = Object.entries(r));
	let o = new Set(Array.from(i).map((e) => e?.[0])), s = new Set(Array.from(a).map((e) => e?.[0])), c = o?.difference?.(s);
	if (Array.isArray(r)) {
		let e = r.filter((e, t) => !c.has(t));
		r.splice(0, r.length), r.push(...e);
	} else if (r instanceof Map || r instanceof Set || r instanceof WeakMap || r instanceof WeakSet) for (let e of c) r.delete(e);
	else if (typeof r == "function" || typeof r == "object") for (let e of c) delete r[e];
	return r;
}, Se = (e, t, n = null, r = !0, i = "id") => {
	let a = n != null && (typeof e == "object" || typeof e == "function") ? e?.[n] ?? e : e, o = null;
	if (r && xe(a, t), t instanceof Set || t instanceof Map || Array.isArray(t) || y(t) ? o = (a instanceof Set || a instanceof WeakSet ? t?.values?.() : t?.entries?.()) || (Array.isArray(t) || y(t) ? t : []) : (typeof t == "object" || typeof t == "function") && (o = a instanceof Set || a instanceof WeakSet ? Object.values(t) : Object.entries(t)), a && o && (typeof o == "object" || typeof o == "function")) {
		if (a instanceof Map || a instanceof WeakMap) {
			for (let e of o) a.set(...e);
			return a;
		}
		if (a instanceof Set || a instanceof WeakSet) {
			for (let e of o) {
				let t = e?.[i] ? Array.from(a?.values?.() || []).find((t) => !Ee?.(t?.[i], e?.[i])) : null;
				t == null ? a.add(e) : Se(t, e, null, r, i);
			}
			return a;
		}
		if (typeof a == "object" || typeof a == "function") {
			if (Array.isArray(a) || y(a)) {
				let e = 0;
				for (let t of o) e < a.length ? a[e++] = t?.[1] : a?.push?.(t?.[1]);
				return a;
			}
			return Object.assign(a, Object.fromEntries([...o || []].filter((e) => typeof e != "symbol")));
		}
	}
	return n == null ? typeof t == "object" || typeof t == "function" ? Object.assign(e, t) : t : (Reflect.set(e, n, t), e);
}, Ce = (e, t) => Oe.getOrInsert(e, /* @__PURE__ */ new WeakMap()).getOrInsert(t, t?.bind?.(e)), we = (e, t) => (typeof t == "function" ? Ce(e, t) : t) ?? t, b = (e, t, n, r) => {
	if (t == Symbol.iterator) return Te(e, n, r);
	if (t == null || typeof t == "symbol" || typeof t == "object" || typeof t == "function") return;
	let i = (e, ...t) => {
		if (e != null) return n?.(e, ...t);
	};
	if (e instanceof Map || e instanceof WeakMap) {
		if (e.has(t)) return i?.(e.get(t), t, null, "@set");
	} else if (e instanceof Set || e instanceof WeakSet) {
		if (e.has(t)) return i?.(t, t, null, "@add");
	} else if (Array.isArray(e) && typeof t == "string" && [...t?.matchAll?.(/^\d+$/g)].length == 1 && Number.isInteger(typeof t == "string" ? parseInt(t) : t)) {
		let n = typeof t == "string" ? parseInt(t) : t;
		return i?.(e?.[n], n, null, "@add");
	} else if (typeof e == "function" || typeof e == "object") return i?.(e?.[t], t, null, "@set");
}, Te = (e, t, n) => {
	if (e == null) return;
	let r = [];
	if (e instanceof Set || e instanceof Map || typeof e?.keys == "function") return [...e?.keys?.() || r].forEach?.((r) => b(e, r, t, n));
	if (Array.isArray(e) || y(e)) return [...e].forEach?.((r, i) => b(e, i, t, n));
	if (typeof e == "object" || typeof e == "function") return [...Object.keys(e) || r].forEach?.((r) => b(e, r, t, n));
}, Ee = (e, t) => e == null && t == null ? !1 : e == null || t == null ? !0 : typeof e == "boolean" && typeof t == "boolean" ? e != t : typeof e == "number" && typeof t == "number" ? !(e == t || Math.abs(e - t) < 1e-9) : typeof e == "string" && typeof t == "string" ? e != "" && t != "" && e != t || e !== t : typeof e == typeof t && e && t && e != t || e !== t, De = Symbol.for("object.boundCtx");
globalThis[De] ??= /* @__PURE__ */ new WeakMap();
var Oe = globalThis[De], ke = (e, t) => {
	let n = e == null || e < 0 || typeof e != "number" || e == Symbol.iterator || t != null && e >= (t?.length || 0);
	return t != null && Array.isArray(t) && n;
}, Ae = /* @__PURE__ */ new WeakMap(), je = (e, t) => typeof e?.[t] == "function" ? e?.[t]?.bind?.(e) : e?.[t], x = (e, t, n) => {
	if (Array.isArray(e)) return e.every(_) ? e.map(t) : e.map((n, r) => x(n, t, [e, r]));
	if (e instanceof Map) {
		let n = Array.from(e.entries());
		return n.map(([e, t]) => t).every(_) ? new Map(n.map(([n, r]) => [n, t(r, n, e)])) : new Map(n.map(([n, r]) => [n, x(r, t, [e, n])]));
	}
	if (e instanceof Set) {
		let n = Array.from(e.entries()), r = n.map(([e, t]) => t);
		return n.every(_) ? new Set(r.map(t)) : new Set(r.map((n) => x(n, t, [e, n])));
	}
	if (typeof e == "object" && e?.constructor == Object && Object.prototype.toString.call(e) == "[object Object]") {
		let n = Array.from(Object.entries(e));
		return n.map(([e, t]) => t).every(_) ? Object.fromEntries(n.map(([n, r]) => [n, t(r, n, e)])) : Object.fromEntries(n.map(([n, r]) => [n, x(r, t, [e, n])]));
	}
	return t(e, n?.[1] ?? "", n?.[0] ?? null);
}, Me = (e, t, n) => {
	if (e?.[t] != null) {
		let r = e[t];
		return Array.isArray(n) ? r.add(...n) : typeof n == "function" && r.add(n), e;
	}
	return e[t] ??= Array.isArray(n) ? new Set(n) : typeof n == "function" ? /* @__PURE__ */ new Set([n]) : n, e;
}, S = /* @__PURE__ */ new WeakMap(), C = /* @__PURE__ */ new WeakMap(), w = (e, t) => e instanceof Promise || typeof e?.then == "function" ? S?.has?.(e) ? t(S?.get?.(e)) : Promise.try?.(async () => {
	let t = await e;
	return S?.set?.(e, t), t;
})?.then?.(t) : t(e), Ne = class {
	#e;
	#t;
	constructor(e, t) {
		this.#e = e, this.#t = t;
	}
	defineProperty(e, t, n) {
		return s(e) instanceof Promise ? Reflect.defineProperty(e, t, n) : w(s(e), (e) => Reflect.defineProperty(e, t, n));
	}
	deleteProperty(e, t) {
		return s(e) instanceof Promise ? Reflect.deleteProperty(e, t) : w(s(e), (e) => Reflect.deleteProperty(e, t));
	}
	getPrototypeOf(e) {
		return s(e) instanceof Promise ? Reflect.getPrototypeOf(e) : w(s(e), (e) => Reflect.getPrototypeOf(e));
	}
	setPrototypeOf(e, t) {
		return s(e) instanceof Promise ? Reflect.setPrototypeOf(e, t) : w(s(e), (e) => Reflect.setPrototypeOf(e, t));
	}
	isExtensible(e) {
		return s(e) instanceof Promise ? Reflect.isExtensible(e) : w(s(e), (e) => Reflect.isExtensible(e));
	}
	preventExtensions(e) {
		return s(e) instanceof Promise ? Reflect.ownKeys(e) : w(s(e), (e) => Reflect.preventExtensions(e));
	}
	ownKeys(e) {
		let t = s(e);
		return t instanceof Promise ? Object.keys(t) : w(t, (e) => (typeof e == "object" || typeof e == "function") && e != null ? Object.keys(e) : []) ?? [];
	}
	getOwnPropertyDescriptor(e, t) {
		return s(e) instanceof Promise ? Reflect.getOwnPropertyDescriptor(e, t) : w(s(e), (e) => Reflect.getOwnPropertyDescriptor(e, t));
	}
	construct(e, t, n) {
		return w(s(e), (e) => Reflect.construct(e, t, n));
	}
	has(e, t) {
		return s(e) instanceof Promise ? Reflect.has(e, t) : w(s(e), (e) => Reflect.has(e, t));
	}
	get(e, t, i) {
		if (e = s(e), t == "promise") return e;
		if (t == "resolve" && this.#e) return (...e) => {
			let t = this.#e?.(...e);
			return this.#e = null, t;
		};
		if (t == "reject" && this.#t) return (...e) => {
			let t = this.#t?.(...e);
			return this.#t = null, t;
		};
		if (t == "then" || t == "catch" || t == "finally") {
			if (e instanceof Promise) return e?.[t]?.bind?.(e);
			{
				let n = Promise.try(() => e);
				return n?.[t]?.bind?.(n);
			}
		}
		let a;
		return a = S?.has?.(e) && (a = S?.get?.(e))?.[t] != null ? S?.get?.(e)?.[t] : T(w(e, async (r) => {
			if (s(r) instanceof Promise) return Reflect.get(r, t, i);
			if (n(r)) return t == Symbol.toPrimitive || t == Symbol.toStringTag ? r : void 0;
			let a;
			try {
				a = Reflect.get(r, t, i);
			} catch {
				a = e?.[t];
			}
			return typeof a == "function" ? a?.bind?.(r) : a;
		})), t == Symbol.toStringTag ? n(a) ? String(a ?? "") || "" : a?.[Symbol.toStringTag]?.() || String(a ?? "") || "" : t == Symbol.toPrimitive ? (e) => {
			if (n(a)) return r(a, e);
		} : a;
	}
	set(e, t, n) {
		return w(s(e), (e) => Reflect.set(e, t, n));
	}
	apply(e, t, n) {
		if (this.#e) {
			let e = this.#e?.(...n);
			return this.#e = null, e;
		}
		return w(s(e, this.#e), (e) => {
			if (typeof e == "function") return s(e) instanceof Promise, Reflect.apply(e, t, n);
		});
	}
};
function T(e, t, n) {
	return e instanceof Promise || typeof e?.then == "function" ? S?.has?.(e) ? S?.get?.(e) : (C?.has?.(e) || e?.then?.((t) => S?.set?.(e, t)), C?.getOrInsertComputed?.(e, () => new Proxy(l(e), new Ne(t, n)))) : e;
}
//#endregion
//#region ../../projects/uniform.ts/src/newer/next/types/Interface.ts
var E = /* @__PURE__ */ function(e) {
	return e.GET = "get", e.SET = "set", e.CALL = "call", e.APPLY = "apply", e.CONSTRUCT = "construct", e.DELETE = "delete", e.DELETE_PROPERTY = "deleteProperty", e.HAS = "has", e.OWN_KEYS = "ownKeys", e.GET_OWN_PROPERTY_DESCRIPTOR = "getOwnPropertyDescriptor", e.GET_PROPERTY_DESCRIPTOR = "getPropertyDescriptor", e.GET_PROTOTYPE_OF = "getPrototypeOf", e.SET_PROTOTYPE_OF = "setPrototypeOf", e.IS_EXTENSIBLE = "isExtensible", e.PREVENT_EXTENSIONS = "preventExtensions", e.TRANSFER = "transfer", e.IMPORT = "import", e.DISPOSE = "dispose", e;
}({}), Pe = {
	ws: "websocket",
	socket: "websocket",
	socketio: "socket-io",
	service: "service-worker",
	sw: "service-worker",
	"service-worker-client": "service-worker",
	"service-worker-host": "service-worker",
	"ring-buffer": "atomics"
};
function Fe(e) {
	let t = String(e ?? "").trim().toLowerCase();
	return t ? Pe[t] ?? t : "internal";
}
function Ie(e) {
	return typeof e == "string" ? Fe(e) : typeof Worker < "u" && e instanceof Worker ? "worker" : typeof SharedWorker < "u" && e instanceof SharedWorker ? "shared-worker" : typeof MessagePort < "u" && e instanceof MessagePort ? "message-port" : typeof BroadcastChannel < "u" && e instanceof BroadcastChannel ? "broadcast" : typeof WebSocket < "u" && e instanceof WebSocket ? "websocket" : typeof RTCDataChannel < "u" && e instanceof RTCDataChannel ? "rtc-data" : typeof chrome < "u" && e && typeof e == "object" && typeof e.postMessage == "function" && e.onMessage?.addListener ? "chrome-port" : "internal";
}
//#endregion
//#region ../../projects/uniform.ts/src/newer/next/observable/Observable.ts
var D = class {
	_unsubscribe;
	_closed = !1;
	constructor(e) {
		this._unsubscribe = e;
	}
	get closed() {
		return this._closed;
	}
	unsubscribe() {
		this._closed || (this._closed = !0, this._unsubscribe());
	}
}, Le = class {
	_producer;
	constructor(e) {
		this._producer = e;
	}
	subscribe(e, t) {
		let n = typeof e == "function" ? { next: e } : e ?? {}, r = new AbortController();
		t?.signal?.addEventListener("abort", () => r.abort());
		let i = !0, a, o = () => {
			i = !1, r.abort(), a?.();
		}, s = {
			next: (e) => i && n.next?.(e),
			error: (e) => {
				i && (n.error?.(e), o());
			},
			complete: () => {
				i && (n.complete?.(), o());
			},
			signal: r.signal,
			get active() {
				return i && !r.signal.aborted;
			}
		};
		try {
			a = this._producer(s);
		} catch (e) {
			s.error(e);
		}
		return new D(o);
	}
	pipe(...e) {
		return e.reduce((e, t) => t(e), this);
	}
}, O = class {
	_subs = /* @__PURE__ */ new Set();
	_buffer = [];
	_maxBuffer;
	_replay;
	constructor(e = {}) {
		this._maxBuffer = e.bufferSize ?? 0, this._replay = e.replayOnSubscribe ?? !1;
	}
	next(e) {
		this._maxBuffer > 0 && (this._buffer.push(e), this._buffer.length > this._maxBuffer && this._buffer.shift());
		for (let t of this._subs) try {
			t.next?.(e);
		} catch (e) {
			t.error?.(e);
		}
	}
	error(e) {
		for (let t of this._subs) t.error?.(e);
	}
	complete() {
		for (let e of this._subs) e.complete?.();
		this._subs.clear();
	}
	subscribe(e) {
		let t = typeof e == "function" ? { next: e } : e;
		if (this._subs.add(t), this._replay) for (let e of this._buffer) try {
			t.next?.(e);
		} catch (e) {
			t.error?.(e);
		}
		return new D(() => {
			this._subs.delete(t);
		});
	}
	getValue() {
		return this._buffer.at(-1);
	}
	getBuffer() {
		return [...this._buffer];
	}
	get subscriberCount() {
		return this._subs.size;
	}
}, Re = (e) => (t) => new Le((n) => {
	let r = t.subscribe({
		next: (t) => e(t) && n.next(t),
		error: (e) => n.error(e),
		complete: () => n.complete()
	});
	return () => r.unsubscribe();
});
//#endregion
//#region ../../projects/uniform.ts/src/newer/next/proxy/Invoker.ts
function k() {
	if (globalThis.Deno !== void 0) return "deno";
	if (globalThis.process !== void 0 && globalThis.process?.versions?.node) return "node";
	let e = globalThis.ServiceWorkerGlobalScope, t = globalThis.SharedWorkerGlobalScope, n = globalThis.DedicatedWorkerGlobalScope;
	if (e && self instanceof e) return "service-worker";
	if (t && self instanceof t) return "shared-worker";
	if (n && self instanceof n) return "worker";
	if (typeof chrome < "u" && chrome.runtime?.id) {
		if (typeof chrome.runtime.getBackgroundPage == "function" || chrome.runtime.getManifest?.()?.background?.service_worker) return "chrome-background";
		if (chrome.devtools !== void 0) return "chrome-devtools";
		if (typeof document < "u" && globalThis?.location?.protocol === "chrome-extension:" && (chrome.extension?.getViews?.({ type: "popup" }) ?? []).includes(globalThis)) return "chrome-popup";
		if (typeof document < "u" && globalThis?.location?.protocol !== "chrome-extension:") return "chrome-content";
	}
	return typeof globalThis < "u" && typeof document < "u" ? "window" : "unknown";
}
function A(e) {
	if (typeof RTCDataChannel < "u" && e instanceof RTCDataChannel) return "rtc-data";
	let t = Ie(e);
	return t && t !== "internal" ? t : e === self || e === globalThis || e === "self" ? "self" : "internal";
}
function ze(e) {
	if (!e) return "unknown";
	if (e.contextType) return e.contextType;
	let t = e.sender ?? "";
	return t.includes("worker") ? "worker" : t.includes("sw") || t.includes("service") ? "service-worker" : t.includes("chrome") || t.includes("crx") ? "chrome-content" : t.includes("background") ? "chrome-background" : "unknown";
}
var Be = {
	get: (e, t) => Reflect.get(e, t),
	set: (e, t, n) => Reflect.set(e, t, n),
	has: (e, t) => Reflect.has(e, t),
	apply: (e, t, n) => Reflect.apply(e, t, n),
	construct: (e, t) => Reflect.construct(e, t),
	deleteProperty: (e, t) => Reflect.deleteProperty(e, t),
	ownKeys: (e) => Reflect.ownKeys(e),
	getOwnPropertyDescriptor: (e, t) => Reflect.getOwnPropertyDescriptor(e, t),
	getPrototypeOf: (e) => Reflect.getPrototypeOf(e),
	setPrototypeOf: (e, t) => Reflect.setPrototypeOf(e, t),
	isExtensible: (e) => Reflect.isExtensible(e),
	preventExtensions: (e) => Reflect.preventExtensions(e)
}, Ve = Symbol.for("uniform.proxy"), He = Symbol.for("uniform.proxy.internals"), Ue = class {
	_invoker;
	_config;
	_childCache = /* @__PURE__ */ new Map();
	constructor(e, t) {
		this._invoker = e, this._config = {
			channel: t.channel,
			basePath: t.basePath ?? [],
			invoker: e,
			cache: t.cache ?? !0,
			timeout: t.timeout ?? 3e4
		};
	}
	get(e, t, n) {
		let r = String(t);
		if (t === Ve) return !0;
		if (t === He) return this._config;
		if (t === dt) return !0;
		if (t === z) return this._getDescriptor();
		if (t === "then" || t === "catch" || t === "finally" || typeof t == "symbol") return;
		if (t === "$path") return this._config.basePath;
		if (t === "$channel") return this._config.channel;
		if (t === "$descriptor") return this._getDescriptor();
		if (t === "$invoke") return this._invoker;
		let i = [...this._config.basePath, r];
		if (this._config.cache && this._childCache.has(r)) return this._childCache.get(r);
		let a = j(this._invoker, {
			...this._config,
			basePath: i
		});
		return this._config.cache && this._childCache.set(r, a), a;
	}
	set(e, t, n, r) {
		return typeof t == "symbol" || this._invoker(E.SET, [...this._config.basePath, String(t)], [n]), !0;
	}
	apply(e, t, n) {
		return this._invoker(E.APPLY, this._config.basePath, [n]);
	}
	construct(e, t, n) {
		return this._invoker(E.CONSTRUCT, this._config.basePath, [t]);
	}
	has(e, t) {
		return typeof t != "symbol" && this._invoker(E.HAS, this._config.basePath, [t]);
	}
	deleteProperty(e, t) {
		return typeof t == "symbol" || this._invoker(E.DELETE_PROPERTY, [...this._config.basePath, String(t)], []);
	}
	ownKeys(e) {
		return [];
	}
	getOwnPropertyDescriptor(e, t) {
		return {
			configurable: !0,
			enumerable: !0,
			writable: !0
		};
	}
	getPrototypeOf(e) {
		return Function.prototype;
	}
	setPrototypeOf(e, t) {
		return this._invoker(E.SET_PROTOTYPE_OF, this._config.basePath, [t]);
	}
	isExtensible(e) {
		return !0;
	}
	preventExtensions(e) {
		return this._invoker(E.PREVENT_EXTENSIONS, this._config.basePath, []);
	}
	_getDescriptor() {
		return {
			path: this._config.basePath,
			channel: this._config.channel,
			primitive: !1
		};
	}
};
function j(e, t) {
	let n = function() {}, r = new Ue(e, t);
	return new Proxy(n, r);
}
function We(e, t, n) {
	if (!e || typeof e != "object" || e.primitive) return e;
	let r = lt.get(e);
	if (r) return r;
	let i = j(t, {
		channel: n ?? e.channel ?? "unknown",
		basePath: e.path ?? []
	});
	return lt.set(e, i), R.set(i, e), i;
}
var Ge = We;
//#endregion
//#region ../../projects/uniform.ts/src/newer/next/channel/internal/ConnectionModel.ts
function Ke(e) {
	return [
		e.localChannel,
		e.remoteChannel,
		e.sender,
		e.transportType,
		e.direction
	].join("::");
}
function qe(e, t = {}) {
	let n = t.includeClosed ?? !1, r = t.status ?? (n ? void 0 : "active");
	return [...e].filter((e) => !(r && e.status !== r || t.channel && e.localChannel !== t.channel && e.remoteChannel !== t.channel || t.localChannel && e.localChannel !== t.localChannel || t.remoteChannel && e.remoteChannel !== t.remoteChannel || t.sender && e.sender !== t.sender || t.transportType && e.transportType !== t.transportType || t.direction && e.direction !== t.direction)).sort((e, t) => t.updatedAt - e.updatedAt);
}
var Je = class {
	_createId;
	_emitEvent;
	_connections = /* @__PURE__ */ new Map();
	constructor(e, t) {
		this._createId = e, this._emitEvent = t;
	}
	register(e) {
		let t = Ke(e), n = Date.now(), r = this._connections.get(t);
		if (r) return r.updatedAt = n, r.status = "active", r.metadata = {
			...r.metadata,
			...e.metadata
		}, r;
		let i = {
			id: this._createId(),
			localChannel: e.localChannel,
			remoteChannel: e.remoteChannel,
			sender: e.sender,
			transportType: e.transportType,
			direction: e.direction,
			status: "active",
			createdAt: n,
			updatedAt: n,
			metadata: e.metadata
		};
		return this._connections.set(t, i), this._emitEvent?.({
			type: "connected",
			connection: i,
			timestamp: n
		}), i;
	}
	markNotified(e, t) {
		let n = Date.now();
		e.lastNotifyAt = n, e.updatedAt = n, this._emitEvent?.({
			type: "notified",
			connection: e,
			timestamp: n,
			payload: t
		});
	}
	closeByChannel(e) {
		let t = Date.now();
		for (let n of this._connections.values()) (n.localChannel === e || n.remoteChannel === e) && n.status !== "closed" && (n.status = "closed", n.updatedAt = t, this._emitEvent?.({
			type: "disconnected",
			connection: n,
			timestamp: t
		}));
	}
	closeAll() {
		let e = Date.now();
		for (let t of this._connections.values()) t.status !== "closed" && (t.status = "closed", t.updatedAt = e, this._emitEvent?.({
			type: "disconnected",
			connection: t,
			timestamp: e
		}));
	}
	query(e = {}) {
		return qe(this._connections.values(), e);
	}
	values() {
		return [...this._connections.values()];
	}
	clear() {
		this._connections.clear();
	}
}, Ye = class {
	_name;
	_contextType;
	_config;
	_transports = /* @__PURE__ */ new Map();
	_defaultTransport = null;
	_connectionEvents = new O({ bufferSize: 200 });
	_connectionRegistry = new Je(() => f(), (e) => this._connectionEvents.next(e));
	_pending = /* @__PURE__ */ new Map();
	_subscriptions = [];
	_inbound = new O({ bufferSize: 100 });
	_outbound = new O({ bufferSize: 100 });
	_invocations = new O({ bufferSize: 100 });
	_responses = new O({ bufferSize: 100 });
	_exposed = /* @__PURE__ */ new Map();
	_proxyCache = /* @__PURE__ */ new WeakMap();
	__getPrivate(e) {
		return this[e];
	}
	__setPrivate(e, t) {
		this[e] = t;
	}
	constructor(e) {
		let t = typeof e == "string" ? { name: e } : e;
		this._name = t.name, this._contextType = t.autoDetect === !1 ? "unknown" : k(), this._config = {
			name: t.name,
			autoDetect: t.autoDetect ?? !0,
			timeout: t.timeout ?? 3e4,
			reflect: t.reflect ?? Be,
			bufferSize: t.bufferSize ?? 100,
			autoListen: t.autoListen ?? !0
		}, this._config.autoListen && this._isWorkerContext() && this.listen(self);
	}
	connect(e, t = {}) {
		let n = A(e), r = t.targetChannel ?? this._inferTargetChannel(e, n), i = this._createTransportBinding(e, n, r, t);
		this._transports.set(r, i), this._defaultTransport ||= i;
		let a = this._registerConnection({
			localChannel: this._name,
			remoteChannel: r,
			sender: this._name,
			transportType: n,
			direction: "outgoing",
			metadata: { phase: "connect" }
		});
		return this._emitConnectionSignal(i, "connect", {
			connectionId: a.id,
			from: this._name,
			to: r
		}), this;
	}
	listen(e, t = {}) {
		let n = A(e), r = t.targetChannel ?? this._inferTargetChannel(e, n), i = (e) => this._handleIncoming(e), a = this._registerConnection({
			localChannel: this._name,
			remoteChannel: r,
			sender: r,
			transportType: n,
			direction: "incoming",
			metadata: { phase: "listen" }
		});
		switch (n) {
			case "worker":
			case "message-port":
			case "broadcast":
				t.autoStart !== !1 && e.start && e.start(), e.addEventListener?.("message", ((e) => i(e.data)));
				break;
			case "websocket":
				e.addEventListener?.("message", ((e) => {
					try {
						i(JSON.parse(e.data));
					} catch {}
				}));
				break;
			case "chrome-runtime":
				chrome.runtime.onMessage?.addListener?.((e, t, n) => (i(e), !0));
				break;
			case "chrome-tabs":
				chrome.runtime.onMessage?.addListener?.((e, n) => t.tabId != null && n?.tab?.id !== t.tabId ? !1 : (i(e), !0));
				break;
			case "chrome-port":
				e?.onMessage?.addListener?.((e) => {
					i(e);
				});
				break;
			case "chrome-external":
				chrome.runtime.onMessageExternal?.addListener?.((e) => (i(e), !0));
				break;
			case "self":
				addEventListener?.("message", ((e) => i(e.data)));
				break;
			default: t.onMessage && t.onMessage(i);
		}
		return this._sendSignalToTarget(e, n, {
			connectionId: a.id,
			from: this._name,
			to: r,
			tabId: t.tabId,
			externalId: t.externalId
		}, "notify"), this;
	}
	attach(e, t = {}) {
		return this.connect(e, t);
	}
	expose(e, t) {
		let n = [e];
		return W(n, t), this._exposed.set(e, {
			name: e,
			obj: t,
			path: n
		}), this;
	}
	exposeAll(e) {
		for (let [t, n] of Object.entries(e)) this.expose(t, n);
		return this;
	}
	async import(e, t) {
		return this.invoke(t ?? this._getDefaultTarget(), E.IMPORT, [], [e]);
	}
	invoke(e, t, n, r = []) {
		let i = f(), a = Promise.withResolvers();
		this._pending.set(i, a);
		let o = setTimeout(() => {
			this._pending.has(i) && (this._pending.delete(i), a.reject(/* @__PURE__ */ Error(`Request timeout: ${t} on ${n.join(".")}`)));
		}, this._config.timeout), s = {
			id: i,
			channel: e,
			sender: this._name,
			type: "request",
			payload: {
				channel: e,
				sender: this._name,
				action: t,
				path: n,
				args: r
			},
			timestamp: Date.now()
		};
		return this._send(e, s), this._outbound.next(s), a.promise.finally(() => clearTimeout(o));
	}
	get(e, t, n) {
		return this.invoke(e, E.GET, t, [n]);
	}
	set(e, t, n, r) {
		return this.invoke(e, E.SET, t, [n, r]);
	}
	call(e, t, n = []) {
		return this.invoke(e, E.APPLY, t, [n]);
	}
	construct(e, t, n = []) {
		return this.invoke(e, E.CONSTRUCT, t, [n]);
	}
	proxy(e, t = []) {
		let n = e ?? this._getDefaultTarget();
		return this._createProxy(n, t);
	}
	remote(e, t) {
		return this.proxy(t, [e]);
	}
	wrapDescriptor(e, t) {
		return We(e, (n, r, i) => {
			let a = t ?? e?.channel ?? this._getDefaultTarget();
			return this.invoke(a, n, r, i);
		}, t ?? e?.channel ?? this._getDefaultTarget());
	}
	subscribe(e) {
		return this._inbound.subscribe(e);
	}
	next(e) {
		this._send(e.channel, e), this._outbound.next(e);
	}
	emit(e, t, n) {
		let r = {
			id: f(),
			channel: e,
			sender: this._name,
			type: "event",
			payload: {
				type: t,
				data: n
			},
			timestamp: Date.now()
		};
		this.next(r);
	}
	notify(e, t = {}, n = "notify") {
		let r = this._transports.get(e);
		return r ? (this._emitConnectionSignal(r, n, {
			from: this._name,
			to: e,
			...t
		}), !0) : !1;
	}
	get onMessage() {
		return this._inbound;
	}
	get onOutbound() {
		return this._outbound;
	}
	get onInvocation() {
		return this._invocations;
	}
	get onResponse() {
		return this._responses;
	}
	get onConnection() {
		return this._connectionEvents;
	}
	subscribeConnections(e) {
		return this._connectionEvents.subscribe(e);
	}
	queryConnections(e = {}) {
		return this._connectionRegistry.query(e);
	}
	notifyConnections(e = {}, t = {}) {
		let n = 0, r = this.queryConnections({
			...t,
			status: "active",
			includeClosed: !1
		});
		for (let t of r) {
			let r = this._transports.get(t.remoteChannel);
			r && (this._emitConnectionSignal(r, "notify", {
				connectionId: t.id,
				from: this._name,
				to: t.remoteChannel,
				...e
			}), n++);
		}
		return n;
	}
	get name() {
		return this._name;
	}
	get contextType() {
		return this._contextType;
	}
	get config() {
		return this._config;
	}
	get connectedChannels() {
		return [...this._transports.keys()];
	}
	get exposedModules() {
		return [...this._exposed.keys()];
	}
	close() {
		this._subscriptions.forEach((e) => e.unsubscribe()), this._subscriptions = [], this._pending.clear(), this._markAllConnectionsClosed();
		for (let e of this._transports.values()) {
			try {
				e.cleanup?.();
			} catch {}
			if (e.transportType === "message-port" || e.transportType === "broadcast") try {
				e.target?.close?.();
			} catch {}
		}
		this._transports.clear(), this._defaultTransport = null, this._connectionRegistry.clear(), this._inbound.complete(), this._outbound.complete(), this._invocations.complete(), this._responses.complete(), this._connectionEvents.complete();
	}
	_handleIncoming(e) {
		if (!(!e || typeof e != "object")) switch (this._inbound.next(e), e.type) {
			case "request":
				e.channel === this._name && this._handleRequest(e);
				break;
			case "response":
				this._handleResponse(e);
				break;
			case "event": break;
			case "signal": this._handleSignal(e);
		}
	}
	_handleResponse(e) {
		let t = e.reqId ?? e.id, n = this._pending.get(t);
		if (n) {
			if (this._pending.delete(t), e.payload?.error) n.reject(Error(e.payload.error));
			else {
				let t = e.payload?.result, r = e.payload?.descriptor;
				t == null ? r ? n.resolve(this.wrapDescriptor(r, e.sender)) : n.resolve(void 0) : n.resolve(t);
			}
			this._responses.next({
				id: t,
				channel: e.channel,
				sender: e.sender,
				result: e.payload?.result,
				descriptor: e.payload?.descriptor,
				timestamp: Date.now()
			});
		}
	}
	async _handleRequest(e) {
		let t = e.payload;
		if (!t) return;
		let { action: n, path: r, args: i, sender: a } = t, o = e.reqId ?? e.id;
		this._invocations.next({
			id: o,
			channel: this._name,
			sender: a,
			action: n,
			path: r,
			args: i ?? [],
			timestamp: Date.now(),
			contextType: ze(e)
		});
		let { result: s, toTransfer: c, newPath: l } = await this._executeAction(n, r, i ?? [], a);
		await this._sendResponse(o, n, a, l, s, c);
	}
	async _executeAction(e, t, n, r) {
		let { result: i, toTransfer: a, path: o } = _t(e, t, n, {
			channel: this._name,
			sender: r,
			reflect: this._config.reflect
		});
		return {
			result: await i,
			toTransfer: a,
			newPath: o
		};
	}
	async _sendResponse(e, t, n, r, i, a) {
		let { response: o, transfer: s } = await vt(e, t, this._name, n, r, i, a), c = {
			id: e,
			...o,
			timestamp: Date.now(),
			transferable: s
		};
		this._send(n, c, s);
	}
	_handleSignal(e) {
		let t = e?.payload ?? {}, n = t.from ?? e.sender ?? "unknown", r = e.transportType ?? this._transports.get(e.channel)?.transportType ?? "internal", i = this._registerConnection({
			localChannel: this._name,
			remoteChannel: n,
			sender: e.sender ?? n,
			transportType: r,
			direction: "incoming"
		});
		this._markConnectionNotified(i, t);
	}
	_registerConnection(e) {
		return this._connectionRegistry.register(e);
	}
	_markConnectionNotified(e, t) {
		this._connectionRegistry.markNotified(e, t);
	}
	_emitConnectionSignal(e, t, n = {}) {
		let r = {
			id: f(),
			type: "signal",
			channel: e.targetChannel,
			sender: this._name,
			transportType: e.transportType,
			payload: {
				type: t,
				from: this._name,
				to: e.targetChannel,
				...n
			},
			timestamp: Date.now()
		};
		(e?.sender ?? e?.postMessage)?.call(e, r);
		let i = this._registerConnection({
			localChannel: this._name,
			remoteChannel: e.targetChannel,
			sender: this._name,
			transportType: e.transportType,
			direction: "outgoing"
		});
		this._markConnectionNotified(i, r.payload);
	}
	_sendSignalToTarget(e, t, n, r) {
		let i = {
			id: f(),
			type: "signal",
			channel: n.to ?? this._name,
			sender: this._name,
			transportType: t,
			payload: {
				type: r,
				...n
			},
			timestamp: Date.now()
		};
		try {
			if (t === "websocket") {
				e?.send?.(JSON.stringify(i));
				return;
			}
			if (t === "chrome-runtime") {
				chrome.runtime?.sendMessage?.(i);
				return;
			}
			if (t === "chrome-tabs") {
				let e = n.tabId;
				e != null && chrome.tabs?.sendMessage?.(e, i);
				return;
			}
			if (t === "chrome-port") {
				e?.postMessage?.(i);
				return;
			}
			if (t === "chrome-external") {
				n.externalId && chrome.runtime?.sendMessage?.(n.externalId, i);
				return;
			}
			e?.postMessage?.(i, { transfer: [] });
		} catch {}
	}
	_markAllConnectionsClosed() {
		this._connectionRegistry.closeAll();
	}
	_createTransportBinding(e, t, n, r) {
		let i, a;
		switch (t) {
			case "worker":
			case "message-port":
			case "broadcast":
				r.autoStart !== !1 && e.start && e.start(), i = (t, n) => e.postMessage(t, { transfer: n });
				{
					let t = ((e) => this._handleIncoming(e.data));
					e.addEventListener?.("message", t), a = () => e.removeEventListener?.("message", t);
				}
				break;
			case "websocket":
				i = (t) => e.send(JSON.stringify(t));
				{
					let t = ((e) => {
						try {
							this._handleIncoming(JSON.parse(e.data));
						} catch {}
					});
					e.addEventListener?.("message", t), a = () => e.removeEventListener?.("message", t);
				}
				break;
			case "chrome-runtime":
				i = (e) => chrome.runtime.sendMessage(e);
				{
					let e = (e) => this._handleIncoming(e);
					chrome.runtime.onMessage?.addListener?.(e), a = () => chrome.runtime.onMessage?.removeListener?.(e);
				}
				break;
			case "chrome-tabs":
				i = (e) => {
					r.tabId != null && chrome.tabs?.sendMessage?.(r.tabId, e);
				};
				{
					let e = (e, t) => r.tabId != null && t?.tab?.id !== r.tabId ? !1 : (this._handleIncoming(e), !0);
					chrome.runtime.onMessage?.addListener?.(e), a = () => chrome.runtime.onMessage?.removeListener?.(e);
				}
				break;
			case "chrome-port":
				if (e?.postMessage && e?.onMessage?.addListener) {
					i = (t) => e.postMessage(t);
					let t = (e) => this._handleIncoming(e);
					e.onMessage.addListener(t), a = () => {
						try {
							e.onMessage.removeListener(t);
						} catch {}
						try {
							e.disconnect?.();
						} catch {}
					};
				} else {
					let e = r.portName ?? n, t = r.tabId != null && chrome.tabs?.connect ? chrome.tabs.connect(r.tabId, { name: e }) : chrome.runtime.connect({ name: e });
					i = (e) => t.postMessage(e);
					let o = (e) => this._handleIncoming(e);
					t.onMessage.addListener(o), a = () => {
						try {
							t.onMessage.removeListener(o);
						} catch {}
						try {
							t.disconnect();
						} catch {}
					};
				}
				break;
			case "chrome-external":
				i = (e) => {
					r.externalId && chrome.runtime.sendMessage(r.externalId, e);
				};
				{
					let e = (e) => (this._handleIncoming(e), !0);
					chrome.runtime.onMessageExternal?.addListener?.(e), a = () => chrome.runtime.onMessageExternal?.removeListener?.(e);
				}
				break;
			case "self":
				i = (e, t) => globalThis.postMessage?.(e, { transfer: t ?? [] });
				{
					let e = ((e) => this._handleIncoming(e.data));
					globalThis.addEventListener?.("message", e), a = () => globalThis.removeEventListener?.("message", e);
				}
				break;
			default: r.onMessage && (a = r.onMessage((e) => this._handleIncoming(e))), i = (t) => e?.postMessage?.(t);
		}
		return {
			target: e,
			targetChannel: n,
			transportType: t,
			sender: i,
			cleanup: a,
			postMessage: (e, t) => i?.(e, t),
			start: () => e?.start?.(),
			close: () => e?.close?.()
		};
	}
	_send(e, t, n) {
		let r = this._transports.get(e) ?? this._defaultTransport;
		(r?.sender ?? r?.postMessage)?.call(r, t, n);
	}
	_getDefaultTarget() {
		return this._defaultTransport ? this._defaultTransport.targetChannel : "worker";
	}
	_inferTargetChannel(e, t) {
		return t === "worker" ? "worker" : t === "broadcast" && e.name ? e.name : t === "self" ? "self" : `${t}-${f().slice(0, 8)}`;
	}
	_createProxy(e, t) {
		return j((t, n, r) => this.invoke(e, t, n, r), {
			channel: e,
			basePath: t,
			cache: !0,
			timeout: this._config.timeout
		});
	}
	_isWorkerContext() {
		return [
			"worker",
			"shared-worker",
			"service-worker"
		].includes(this._contextType);
	}
};
function M(e) {
	return new Ye(e);
}
var N = null;
function Xe() {
	if (!N) {
		let e = k();
		N = [
			"worker",
			"shared-worker",
			"service-worker"
		].includes(e) ? M({
			name: "worker",
			autoListen: !0
		}) : M({
			name: "host",
			autoListen: !1
		});
	}
	return N;
}
//#endregion
//#region ../../projects/uniform.ts/src/newer/core/Alias.ts
var P = {
	rjb: "rejectBy",
	rvb: "resolveBy",
	rj: "reject",
	rv: "resolve",
	cr: "create",
	cs: "createSync",
	a: "array",
	ta: "typedarray",
	udf: "undefined"
};
[
	typeof ArrayBuffer == P.udf ? null : ArrayBuffer,
	typeof MessagePort == P.udf ? null : MessagePort,
	typeof ReadableStream == P.udf ? null : ReadableStream,
	typeof WritableStream == P.udf ? null : WritableStream,
	typeof TransformStream == P.udf ? null : TransformStream,
	typeof WebTransportReceiveStream == P.udf ? null : WebTransportReceiveStream,
	typeof WebTransportSendStream == P.udf ? null : WebTransportSendStream,
	typeof AudioData == P.udf ? null : AudioData,
	typeof ImageBitmap == P.udf ? null : ImageBitmap,
	typeof VideoFrame == P.udf ? null : VideoFrame,
	typeof OffscreenCanvas == P.udf ? null : OffscreenCanvas,
	typeof RTCDataChannel == P.udf ? null : RTCDataChannel
].filter((e) => e != null);
//#endregion
//#region ../../projects/uniform.ts/src/newer/next/utils/Env.ts
var Ze = () => {
	try {
		let e = globalThis?.ServiceWorkerGlobalScope;
		return e !== void 0 && globalThis instanceof e;
	} catch {
		return !1;
	}
}, Qe = () => {
	try {
		return typeof chrome < "u" && !!chrome?.runtime?.id;
	} catch {
		return !1;
	}
}, $e = () => {
	if (Qe()) return "chrome-extension";
	if (Ze()) return "service-worker";
	try {
		if (typeof document < "u") return "main";
	} catch {}
	return "unknown";
}, et = () => {
	if (Ze()) return !1;
	try {
		return typeof Worker < "u";
	} catch {
		return !1;
	}
};
function tt() {
	try {
		let e = globalThis.location?.href;
		if (typeof e == "string" && e.length > 0) return e;
	} catch {}
	try {
		if (typeof document < "u" && typeof document.baseURI == "string" && document.baseURI.length > 0) return document.baseURI;
	} catch {}
	return "";
}
function F(e) {
	let t = tt();
	if (!t.length) throw TypeError("[uniform] No base URL for worker resolution (missing location / document.baseURI)");
	let n = e.startsWith("/") ? e.replace(/^\//, "./") : e;
	return new URL(n, t).href;
}
//#endregion
//#region ../../projects/uniform.ts/src/newer/next/channel/Channels.ts
var I = {
	name: "unknown",
	instance: null
}, L = /* @__PURE__ */ new Map(), nt = (e) => [...Object.values(E)].includes(e), rt = class {
	channelName;
	options;
	_channel;
	constructor(e, t = {}) {
		this.channelName = e, this.options = t, this._channel = Xe();
	}
	request(e, t, n, r = {}) {
		return typeof e == "string" && (e = [e]), Array.isArray(t) && nt(e) && (r = n, n = t, t = e, e = []), this._channel.invoke(this.channelName, t, e, n);
	}
	doImportModule(e, t) {
		return this._channel.import(e, this.channelName);
	}
}, it = class {
	channel;
	options;
	_unified;
	broadcasts = {};
	constructor(e, t = {}) {
		this.channel = e, this.options = t, this._unified = M({
			name: e,
			autoListen: !1
		}), I.name = e, I.instance = this;
	}
	createRemoteChannel(e, t = {}, n) {
		return n && (this._unified.attach(n, { targetChannel: e }), this.broadcasts[e] = n), Promise.resolve(new rt(e, t));
	}
	getChannel() {
		return this.channel;
	}
	request(e, t, n, r = {}, i = "worker") {
		return typeof e == "string" && (e = [e]), Array.isArray(t) && nt(e) && (i = r, r = n, n = t, t = e, e = []), this._unified.invoke(i, t, e, n);
	}
	resolveResponse(e, t) {
		return Promise.resolve(t);
	}
	async handleAndResponse(e, t, n) {
		let r = await yt(e, t, this.channel);
		r && n?.(r.response, r.transfer);
	}
	close() {
		this._unified.close();
	}
}, at = (e = "$host$") => {
	if (I?.instance && e === "$host$") return I.instance;
	if (L.has(e)) return L.get(e) ?? null;
	let t = new it(e);
	return e === "$host$" && (I.name = e, I.instance = t), L.set(e, t), t;
}, ot = (e = "$host$") => at(e), st = (e, t = {}, n = typeof self < "u" ? self : null) => {
	let r = ot(e ?? "$host$");
	return r?.createRemoteChannel?.(e, t, n) ?? r;
}, ct = /* @__PURE__ */ new WeakMap(), R = /* @__PURE__ */ new WeakMap(), lt = /* @__PURE__ */ new WeakMap(), ut = (e, t = I?.name, r) => typeof e == "object" && e || typeof e == "function" && e != null ? R.has(e) ? R.get(e) : ct.has(e) ? ct.get(e) : g(e) || r?.includes?.(e) || t == I?.name ? e : {
	$isDescriptor: !0,
	path: H.get(e) ?? (() => {
		let t = [f()];
		return W(t, e), t;
	})(),
	owner: I?.name,
	channel: t,
	primitive: n(e),
	writable: !0,
	enumerable: !0,
	configurable: !0,
	argumentCount: e instanceof Function ? e.length : -1
} : _(e) ? e : null, dt = Symbol.for("@requestHandler"), z = Symbol.for("@descriptor"), B = (e) => _(e) || e?.[z] ? e : e?.$isDescriptor ? Ge(e, async () => void 0) : g(e) ? e : null, V = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new WeakMap(), ft = (e, t) => {
	if (t != null && !Array.isArray(t) && (t = [t]), t == null || t?.length < 1) return e;
	let r = e?.[z] ?? (e?.$isDescriptor ? e : null);
	if (r && r?.owner == I?.name && (e = U(r?.path) ?? e), n(e)) return e;
	for (let n of t) if (e = e?.[n], e == null) return e;
	return e;
}, U = (e) => {
	if (e != null && !Array.isArray(e) && (e = [e]), e == null || e?.length < 1) return null;
	let t = V?.get?.(e?.[0]) ?? null;
	return t == null ? null : ft(t, e?.slice?.(1));
}, W = (e, t) => {
	let n = t?.[z] ?? (t?.$isDescriptor ? t : null);
	if (n && n?.owner == I?.name && (t = U(n?.path) ?? t), e != null && !Array.isArray(e) && (e = [e]), e == null || e?.length < 1) return null;
	let r = V?.get?.(e?.[0]) ?? null;
	return e?.length > 1 ? ft(r, e?.slice?.(1, -1))[e?.[e?.length - 1]] = t : V?.set?.(e?.[0], t), (typeof t == "object" || typeof t == "function") && H?.set?.(t, e), t;
}, pt = (e) => (e != null && !Array.isArray(e) && (e = [e]), e == null || e?.length < 1 ? !1 : !(V?.get?.(e?.[0]) ?? null) && e?.length <= 1 && (V?.delete?.(e?.[0]), !0)), mt = (e) => {
	let t = e?.[z] ?? (e?.$isDescriptor ? e : null);
	t && t?.owner == I?.name && (e = U(t?.path) ?? e);
	let n = H?.get?.(e) ?? t?.path;
	return n == null || n?.length < 1 ? !1 : (pt(n), (typeof e == "object" || typeof e == "function") && H?.delete?.(e), !0);
}, ht = (e) => {
	let t = e?.[z] ?? (e?.$isDescriptor ? e : null);
	return (H?.get?.(e) ?? t?.path) == null;
}, G = (e) => (typeof e == "object" || typeof e == "function") && e != null, gt = {
	get: (e, t) => e?.[t],
	set: (e, t, n) => (e[t] = n, !0),
	has: (e, t) => t in e,
	apply: (e, t, n) => e.apply(t, n),
	construct: (e, t) => new e(...t),
	deleteProperty: (e, t) => delete e[t],
	ownKeys: (e) => Object.keys(e),
	getOwnPropertyDescriptor: (e, t) => Object.getOwnPropertyDescriptor(e, t),
	getPrototypeOf: (e) => Object.getPrototypeOf(e),
	setPrototypeOf: (e, t) => Object.setPrototypeOf(e, t),
	isExtensible: (e) => Object.isExtensible(e),
	preventExtensions: (e) => Object.preventExtensions(e)
};
function _t(e, t, n, r = {}) {
	let { channel: i = "", sender: a = "", reflect: o = gt } = r, s = r.target ?? U(t), c = [], l = null, u = t;
	switch (String(e).toLowerCase()) {
		case "import":
		case E.IMPORT:
			l = import(
				/* @vite-ignore */
				n?.[0]
);
			break;
		case "transfer":
		case E.TRANSFER:
			v(s) && i !== a && c.push(s), l = s;
			break;
		case "get":
		case E.GET: {
			let e = n?.[0], r = o.get?.(s, e) ?? s?.[e];
			l = typeof r == "function" && s != null ? r.bind(s) : r, u = [...t, String(e)];
			break;
		}
		case "set":
		case E.SET: {
			let [e, i] = n, a = x(i, B);
			l = r.target ? o.set?.(s, e, a) ?? (s[e] = a, !0) : o.set?.(s, e, a) ?? W([...t, String(e)], a);
			break;
		}
		case "apply":
		case "call":
		case E.APPLY:
		case E.CALL:
			if (typeof s == "function") {
				let e = r.context ?? (r.target ? void 0 : U(t.slice(0, -1))), u = x(n?.[0] ?? n ?? [], B);
				l = o.apply?.(s, e, u) ?? s.apply(e, u), v(l) && t?.at(-1) === "transfer" && i !== a && c.push(l);
			}
			break;
		case "construct":
		case E.CONSTRUCT:
			if (typeof s == "function") {
				let e = x(n?.[0] ?? n ?? [], B);
				l = o.construct?.(s, e) ?? new s(...e);
			}
			break;
		case "delete":
		case "deleteproperty":
		case "dispose":
		case E.DELETE:
		case E.DELETE_PROPERTY:
		case E.DISPOSE:
			if (r.target) {
				let e = t[t.length - 1];
				l = o.deleteProperty?.(s, e) ?? delete s[e];
			} else l = t?.length > 0 ? pt(t) : mt(s), l && (u = H.get(s) ?? []);
			break;
		case "has":
		case E.HAS:
			l = o.has?.(s, n?.[0]) ?? (G(s) ? n?.[0] in s : !1);
			break;
		case "ownkeys":
		case E.OWN_KEYS:
			l = o.ownKeys?.(s) ?? (G(s) ? Object.keys(s) : []);
			break;
		case "getownpropertydescriptor":
		case "getpropertydescriptor":
		case E.GET_OWN_PROPERTY_DESCRIPTOR:
		case E.GET_PROPERTY_DESCRIPTOR:
			l = o.getOwnPropertyDescriptor?.(s, n?.[0] ?? t?.at(-1) ?? "") ?? (G(s) ? Object.getOwnPropertyDescriptor(s, n?.[0] ?? t?.at(-1) ?? "") : void 0);
			break;
		case "getprototypeof":
		case E.GET_PROTOTYPE_OF:
			l = o.getPrototypeOf?.(s) ?? (G(s) ? Object.getPrototypeOf(s) : null);
			break;
		case "setprototypeof":
		case E.SET_PROTOTYPE_OF:
			l = o.setPrototypeOf?.(s, n?.[0]) ?? (G(s) ? Object.setPrototypeOf(s, n?.[0]) : !1);
			break;
		case "isextensible":
		case E.IS_EXTENSIBLE:
			l = o.isExtensible?.(s) ?? (!G(s) || Object.isExtensible(s));
			break;
		case "preventextensions":
		case E.PREVENT_EXTENSIONS: l = o.preventExtensions?.(s) ?? (G(s) ? Object.preventExtensions(s) : !1);
	}
	return {
		result: l,
		toTransfer: c,
		path: u
	};
}
async function vt(e, t, r, i, a, o, s) {
	let c = await o, l = v(c) && s.includes(c) || _(c), u = a;
	!l && t !== "get" && t !== E.GET && (typeof c == "object" || typeof c == "function") && (ht(c) ? (u = [f()], W(u, c)) : u = H.get(c) ?? []);
	let d = U(u), p = t === "get" || t === E.GET ? u?.at(-1) : void 0, m = U(a), ee = x(c, (e) => ut(e, r, s)) ?? c;
	return {
		response: {
			channel: i,
			sender: r,
			reqId: e,
			action: t,
			type: "response",
			payload: {
				result: l ? ee : null,
				type: typeof c,
				channel: i,
				sender: r,
				descriptor: {
					$isDescriptor: !0,
					path: u,
					owner: r,
					channel: r,
					primitive: n(c),
					writable: !0,
					enumerable: !0,
					configurable: !0,
					argumentCount: m instanceof Function ? m.length : -1,
					...G(d) && p != null ? Object.getOwnPropertyDescriptor(d, p) : {}
				}
			}
		},
		transfer: s
	};
}
async function yt(e, t, n, r) {
	let { channel: i, sender: a, path: o, action: s, args: c } = e;
	if (i !== n) return null;
	let { result: l, toTransfer: u, path: d } = _t(s, o, c, {
		channel: i,
		sender: a,
		...r
	});
	return vt(t, s, n, a, d, l, u);
}
//#endregion
//#region ../../projects/uniform.ts/src/newer/next/channel/Connection.ts
var bt = class {
	_name;
	_transportType;
	_id = f();
	_state = "disconnected";
	_inbound = new O({ bufferSize: 1e3 });
	_outbound = new O({ bufferSize: 1e3 });
	_stateChanges = new O();
	_connectedPeers = /* @__PURE__ */ new Map();
	_subs = [];
	_stats = {
		messagesSent: 0,
		messagesReceived: 0,
		bytesTransferred: 0,
		latencyMs: 0,
		uptime: 0,
		reconnectCount: 0
	};
	_startTime = 0;
	_pending = /* @__PURE__ */ new Map();
	_buffer = [];
	_opts;
	constructor(e, t = "internal", n = {}) {
		this._name = e, this._transportType = t, this._opts = {
			timeout: 3e4,
			autoReconnect: !0,
			reconnectInterval: 1e3,
			maxReconnectAttempts: 5,
			bufferMessages: !0,
			bufferSize: 1e3,
			metadata: {},
			...n
		}, this._setupSubscriptions();
	}
	subscribe(e, t) {
		return (t ? Re((e) => e.sender === t)(this._inbound) : this._inbound).subscribe(typeof e == "function" ? { next: e } : e);
	}
	next(e) {
		if (this._state !== "connected") {
			this._opts.bufferMessages && this._buffer.length < this._opts.bufferSize && this._buffer.push(e);
			return;
		}
		this._outbound.next(e), this._stats.messagesSent++;
	}
	async request(e, t, n = {}) {
		let r = f(), i = Promise.withResolvers();
		this._pending.set(r, i);
		let a = setTimeout(() => {
			this._pending.has(r) && (this._pending.delete(r), i.reject(/* @__PURE__ */ Error("Request timeout")));
		}, n.timeout ?? this._opts.timeout);
		return this.next({
			id: f(),
			channel: e,
			sender: this._name,
			type: "request",
			reqId: r,
			payload: {
				...t,
				action: n.action,
				path: n.path
			},
			timestamp: Date.now()
		}), i.promise.finally(() => clearTimeout(a));
	}
	respond(e, t) {
		this.next({
			id: f(),
			channel: e.sender,
			sender: this._name,
			type: "response",
			reqId: e.reqId,
			payload: t,
			timestamp: Date.now()
		});
	}
	emit(e, t, n) {
		this.next({
			id: f(),
			channel: e,
			sender: this._name,
			type: "event",
			payload: {
				type: t,
				data: n
			},
			timestamp: Date.now()
		});
	}
	subscribeOutbound(e) {
		return this._outbound.subscribe(typeof e == "function" ? { next: e } : e);
	}
	pushInbound(e) {
		if (this._stats.messagesReceived++, e.type === "response" && e.reqId) {
			let t = this._pending.get(e.reqId);
			if (t) {
				this._pending.delete(e.reqId), t.resolve(e.payload);
				return;
			}
		}
		this._inbound.next(e);
	}
	async connect() {
		this._state !== "connected" && (this._setState("connecting"), this._startTime = Date.now(), this._setState("connected"), this._flushBuffer());
	}
	disconnect() {
		this._state !== "disconnected" && this._state !== "closed" && (this._setState("disconnected"), this._subs.forEach((e) => e.unsubscribe()), this._subs = []);
	}
	close() {
		this.disconnect(), this._setState("closed"), this._inbound.complete(), this._outbound.complete(), this._stateChanges.complete();
	}
	markConnected() {
		this._setState("connected"), this._flushBuffer();
	}
	markDisconnected() {
		this._setState("disconnected");
	}
	_setState(e) {
		this._state !== e && (this._state = e, this._stateChanges.next(e));
	}
	_flushBuffer() {
		for (let e of this._buffer) this._outbound.next(e);
		this._buffer = [];
	}
	_setupSubscriptions() {
		this._subs.push(this._inbound.subscribe({ next: (e) => {
			e.type === "signal" && e.payload?.type === "connect" && this._connectedPeers.set(e.sender, {
				name: e.sender,
				state: "connected",
				isHost: !1
			});
		} }));
	}
	get id() {
		return this._id;
	}
	get name() {
		return this._name;
	}
	get state() {
		return this._state;
	}
	get transportType() {
		return this._transportType;
	}
	get stats() {
		return {
			...this._stats,
			uptime: this._startTime ? Date.now() - this._startTime : 0
		};
	}
	get stateChanges() {
		return this._stateChanges;
	}
	get connectedPeers() {
		return [...this._connectedPeers.keys()];
	}
	get meta() {
		return {
			id: this._id,
			name: this._name,
			state: this._state,
			isHost: !1,
			connectedChannels: new Set(this._connectedPeers.keys())
		};
	}
}, xt = class e {
	_connections = /* @__PURE__ */ new Map();
	static _instance = null;
	static getInstance() {
		return e._instance ||= new e(), e._instance;
	}
	getOrCreate(e, t = "internal", n = {}) {
		return this._connections.has(e) || this._connections.set(e, new bt(e, t, n)), this._connections.get(e);
	}
	get(e) {
		return this._connections.get(e);
	}
	has(e) {
		return this._connections.has(e);
	}
	delete(e) {
		return this._connections.get(e)?.close(), this._connections.delete(e);
	}
	clear() {
		this._connections.forEach((e) => e.close()), this._connections.clear();
	}
	get size() {
		return this._connections.size;
	}
	get names() {
		return [...this._connections.keys()];
	}
}, St = () => xt.getInstance(), Ct = (e, t, n) => St().getOrCreate(e, t, n), wt = "uniform_channels", Tt = 1, K = {
	MESSAGES: "messages",
	MAILBOX: "mailbox",
	PENDING: "pending",
	EXCHANGE: "exchange",
	TRANSACTIONS: "transactions"
}, Et = class {
	_db = null;
	_isOpen = !1;
	_openPromise = null;
	_channelName;
	_messageUpdates = new O();
	_exchangeUpdates = new O();
	constructor(e) {
		this._channelName = e;
	}
	async open() {
		return this._db && this._isOpen ? this._db : (this._openPromise ||= new Promise((e, t) => {
			let n = indexedDB.open(wt, Tt);
			n.onerror = () => {
				this._openPromise = null, t(/* @__PURE__ */ Error("Failed to open IndexedDB"));
			}, n.onsuccess = () => {
				this._db = n.result, this._isOpen = !0, this._openPromise = null, e(this._db);
			}, n.onupgradeneeded = (e) => {
				let t = e.target.result;
				this._createStores(t);
			};
		}), this._openPromise);
	}
	close() {
		this._db && (this._db.close(), this._db = null, this._isOpen = !1);
	}
	_createStores(e) {
		if (!e.objectStoreNames.contains(K.MESSAGES)) {
			let t = e.createObjectStore(K.MESSAGES, { keyPath: "id" });
			t.createIndex("channel", "channel", { unique: !1 }), t.createIndex("status", "status", { unique: !1 }), t.createIndex("recipient", "recipient", { unique: !1 }), t.createIndex("createdAt", "createdAt", { unique: !1 }), t.createIndex("channel_status", ["channel", "status"], { unique: !1 });
		}
		if (!e.objectStoreNames.contains(K.MAILBOX)) {
			let t = e.createObjectStore(K.MAILBOX, { keyPath: "id" });
			t.createIndex("channel", "channel", { unique: !1 }), t.createIndex("priority", "priority", { unique: !1 }), t.createIndex("expiresAt", "expiresAt", { unique: !1 });
		}
		if (!e.objectStoreNames.contains(K.PENDING)) {
			let t = e.createObjectStore(K.PENDING, { keyPath: "id" });
			t.createIndex("channel", "channel", { unique: !1 }), t.createIndex("createdAt", "createdAt", { unique: !1 });
		}
		if (!e.objectStoreNames.contains(K.EXCHANGE)) {
			let t = e.createObjectStore(K.EXCHANGE, { keyPath: "id" });
			t.createIndex("key", "key", { unique: !0 }), t.createIndex("owner", "owner", { unique: !1 });
		}
		e.objectStoreNames.contains(K.TRANSACTIONS) || e.createObjectStore(K.TRANSACTIONS, { keyPath: "id" }).createIndex("createdAt", "createdAt", { unique: !1 });
	}
	async defer(e, t = {}) {
		let n = await this.open(), r = {
			id: f(),
			channel: e.channel,
			sender: e.sender ?? this._channelName,
			recipient: e.channel,
			type: e.type,
			payload: e.payload,
			status: "pending",
			priority: t.priority ?? 0,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			expiresAt: t.expiresIn ? Date.now() + t.expiresIn : null,
			retryCount: 0,
			maxRetries: t.maxRetries ?? 3,
			metadata: t.metadata
		};
		return new Promise((e, t) => {
			let i = n.transaction([K.MESSAGES, K.MAILBOX], "readwrite"), a = i.objectStore(K.MESSAGES), o = i.objectStore(K.MAILBOX);
			a.add(r), o.add(r), i.oncomplete = () => {
				this._messageUpdates.next(r), e(r.id);
			}, i.onerror = () => t(/* @__PURE__ */ Error("Failed to defer message"));
		});
	}
	async getDeferredMessages(e, t = {}) {
		let n = await this.open();
		return new Promise((r, i) => {
			let a = n.transaction(K.MESSAGES, "readonly").objectStore(K.MESSAGES), o = t.status ? a.index("channel_status") : a.index("channel"), s = t.status ? IDBKeyRange.only([e, t.status]) : IDBKeyRange.only(e), c = o.getAll(s, t.limit);
			c.onsuccess = () => {
				let e = c.result;
				t.offset && (e = e.slice(t.offset)), r(e);
			}, c.onerror = () => i(/* @__PURE__ */ Error("Failed to get deferred messages"));
		});
	}
	async processNextPending(e) {
		let t = await this.open();
		return new Promise((n, r) => {
			let i = t.transaction(K.MESSAGES, "readwrite").objectStore(K.MESSAGES).index("channel_status").openCursor(IDBKeyRange.only([e, "pending"]));
			i.onsuccess = () => {
				let e = i.result;
				if (e) {
					let t = e.value;
					t.status = "processing", t.updatedAt = Date.now(), e.update(t), this._messageUpdates.next(t), n(t);
				} else n(null);
			}, i.onerror = () => r(/* @__PURE__ */ Error("Failed to process pending message"));
		});
	}
	async markDelivered(e) {
		await this._updateMessageStatus(e, "delivered");
	}
	async markFailed(e) {
		let t = await this.open();
		return new Promise((n, r) => {
			let i = t.transaction(K.MESSAGES, "readwrite").objectStore(K.MESSAGES), a = i.get(e);
			a.onsuccess = () => {
				let e = a.result;
				if (!e) {
					n(!1);
					return;
				}
				e.retryCount++, e.updatedAt = Date.now(), e.status = e.retryCount < e.maxRetries ? "pending" : "failed", i.put(e), this._messageUpdates.next(e), n(e.status === "pending");
			}, a.onerror = () => r(/* @__PURE__ */ Error("Failed to mark message as failed"));
		});
	}
	async _updateMessageStatus(e, t) {
		let n = await this.open();
		return new Promise((r, i) => {
			let a = n.transaction(K.MESSAGES, "readwrite").objectStore(K.MESSAGES), o = a.get(e);
			o.onsuccess = () => {
				let e = o.result;
				e && (e.status = t, e.updatedAt = Date.now(), a.put(e), this._messageUpdates.next(e)), r();
			}, o.onerror = () => i(/* @__PURE__ */ Error("Failed to update message status"));
		});
	}
	async getMailbox(e, t = {}) {
		let n = await this.open();
		return new Promise((r, i) => {
			let a = n.transaction(K.MAILBOX, "readonly").objectStore(K.MAILBOX).index("channel").getAll(IDBKeyRange.only(e), t.limit);
			a.onsuccess = () => {
				let e = a.result;
				t.sortBy === "priority" ? e.sort((e, t) => t.priority - e.priority) : e.sort((e, t) => t.createdAt - e.createdAt), r(e);
			}, a.onerror = () => i(/* @__PURE__ */ Error("Failed to get mailbox"));
		});
	}
	async getMailboxStats(e) {
		let t = await this.getDeferredMessages(e), n = {
			total: t.length,
			pending: 0,
			processing: 0,
			delivered: 0,
			failed: 0,
			expired: 0
		}, r = Date.now();
		for (let e of t) e.expiresAt && e.expiresAt < r ? n.expired++ : n[e.status]++;
		return n;
	}
	async clearMailbox(e) {
		let t = await this.open();
		return new Promise((n, r) => {
			let i = t.transaction(K.MAILBOX, "readwrite"), a = i.objectStore(K.MAILBOX).index("channel"), o = 0, s = a.openCursor(IDBKeyRange.only(e));
			s.onsuccess = () => {
				let e = s.result;
				e && (e.delete(), o++, e.continue());
			}, i.oncomplete = () => n(o), i.onerror = () => r(/* @__PURE__ */ Error("Failed to clear mailbox"));
		});
	}
	async registerPending(e) {
		let t = await this.open(), n = {
			id: f(),
			channel: this._channelName,
			type: e.type,
			data: e.data,
			metadata: e.metadata,
			createdAt: Date.now(),
			status: "pending"
		};
		return new Promise((e, r) => {
			let i = t.transaction(K.PENDING, "readwrite");
			i.objectStore(K.PENDING).add(n), i.oncomplete = () => e(n.id), i.onerror = () => r(/* @__PURE__ */ Error("Failed to register pending operation"));
		});
	}
	async getPendingOperations() {
		let e = await this.open();
		return new Promise((t, n) => {
			let r = e.transaction(K.PENDING, "readonly").objectStore(K.PENDING).index("channel").getAll(IDBKeyRange.only(this._channelName));
			r.onsuccess = () => t(r.result), r.onerror = () => n(/* @__PURE__ */ Error("Failed to get pending operations"));
		});
	}
	async completePending(e) {
		let t = await this.open();
		return new Promise((n, r) => {
			let i = t.transaction(K.PENDING, "readwrite");
			i.objectStore(K.PENDING).delete(e), i.oncomplete = () => n(), i.onerror = () => r(/* @__PURE__ */ Error("Failed to complete pending operation"));
		});
	}
	async awaitPending(e, t = {}) {
		let n = t.timeout ?? 3e4, r = t.pollInterval ?? 100, i = Date.now();
		for (; Date.now() - i < n;) {
			let t = await this._getPendingById(e);
			if (!t) return null;
			if (t.status === "completed") return await this.completePending(e), t.result;
			await new Promise((e) => setTimeout(e, r));
		}
		throw Error(`Pending operation ${e} timed out`);
	}
	async _getPendingById(e) {
		let t = await this.open();
		return new Promise((n, r) => {
			let i = t.transaction(K.PENDING, "readonly").objectStore(K.PENDING).get(e);
			i.onsuccess = () => n(i.result ?? null), i.onerror = () => r(/* @__PURE__ */ Error("Failed to get pending operation"));
		});
	}
	async exchangePut(e, t, n = {}) {
		let r = await this.open(), i = {
			id: f(),
			key: e,
			value: t,
			owner: this._channelName,
			sharedWith: n.sharedWith ?? ["*"],
			version: 1,
			createdAt: Date.now(),
			updatedAt: Date.now()
		};
		return new Promise((t, n) => {
			let a = r.transaction(K.EXCHANGE, "readwrite"), o = a.objectStore(K.EXCHANGE), s = o.index("key").get(e);
			s.onsuccess = () => {
				let e = s.result;
				e && (i.id = e.id, i.version = e.version + 1, i.createdAt = e.createdAt), o.put(i);
			}, a.oncomplete = () => {
				this._exchangeUpdates.next(i), t(i.id);
			}, a.onerror = () => n(/* @__PURE__ */ Error("Failed to put exchange data"));
		});
	}
	async exchangeGet(e) {
		let t = await this.open();
		return new Promise((n, r) => {
			let i = t.transaction(K.EXCHANGE, "readonly").objectStore(K.EXCHANGE).index("key").get(e);
			i.onsuccess = () => {
				let e = i.result;
				if (!e) {
					n(null);
					return;
				}
				if (!this._canAccessExchange(e)) {
					n(null);
					return;
				}
				n(e.value);
			}, i.onerror = () => r(/* @__PURE__ */ Error("Failed to get exchange data"));
		});
	}
	async exchangeDelete(e) {
		let t = await this.open();
		return new Promise((n, r) => {
			let i = t.transaction(K.EXCHANGE, "readwrite"), a = i.objectStore(K.EXCHANGE), o = a.index("key").get(e);
			o.onsuccess = () => {
				let e = o.result;
				if (!e) {
					n(!1);
					return;
				}
				if (e.owner !== this._channelName) {
					n(!1);
					return;
				}
				a.delete(e.id);
			}, i.oncomplete = () => n(!0), i.onerror = () => r(/* @__PURE__ */ Error("Failed to delete exchange data"));
		});
	}
	async exchangeLock(e, t = {}) {
		let n = await this.open(), r = t.timeout ?? 3e4;
		return new Promise((t, i) => {
			let a = n.transaction(K.EXCHANGE, "readwrite"), o = a.objectStore(K.EXCHANGE), s = o.index("key").get(e);
			s.onsuccess = () => {
				let e = s.result;
				if (!e) {
					t(!1);
					return;
				}
				if (e.lock && e.lock.holder !== this._channelName && e.lock.expiresAt > Date.now()) {
					t(!1);
					return;
				}
				e.lock = {
					holder: this._channelName,
					acquiredAt: Date.now(),
					expiresAt: Date.now() + r
				}, e.updatedAt = Date.now(), o.put(e);
			}, a.oncomplete = () => t(!0), a.onerror = () => i(/* @__PURE__ */ Error("Failed to acquire lock"));
		});
	}
	async exchangeUnlock(e) {
		let t = await this.open();
		return new Promise((n, r) => {
			let i = t.transaction(K.EXCHANGE, "readwrite"), a = i.objectStore(K.EXCHANGE), o = a.index("key").get(e);
			o.onsuccess = () => {
				let e = o.result;
				e && e.lock?.holder === this._channelName && (delete e.lock, e.updatedAt = Date.now(), a.put(e));
			}, i.oncomplete = () => n(), i.onerror = () => r(/* @__PURE__ */ Error("Failed to release lock"));
		});
	}
	_canAccessExchange(e) {
		return e.owner === this._channelName || e.sharedWith.includes("*") ? !0 : e.sharedWith.includes(this._channelName);
	}
	async beginTransaction() {
		return new Dt(this);
	}
	async executeTransaction(e) {
		let t = await this.open(), n = new Set(e.map((e) => e.store));
		return new Promise((r, i) => {
			let a = t.transaction(Array.from(n), "readwrite");
			for (let t of e) {
				let e = a.objectStore(t.store);
				switch (t.type) {
					case "put":
						t.value !== void 0 && e.put(t.value);
						break;
					case "delete":
						t.key !== void 0 && e.delete(t.key);
						break;
					case "update": if (t.key !== void 0) {
						let n = e.get(t.key);
						n.onsuccess = () => {
							n.result && t.value && e.put({
								...n.result,
								...t.value
							});
						};
					}
				}
			}
			a.oncomplete = () => r(), a.onerror = () => i(/* @__PURE__ */ Error("Transaction failed"));
		});
	}
	onMessageUpdate(e) {
		return this._messageUpdates.subscribe({ next: e });
	}
	onExchangeUpdate(e) {
		return this._exchangeUpdates.subscribe({ next: e });
	}
	async cleanupExpired() {
		let e = await this.open(), t = Date.now();
		return new Promise((n, r) => {
			let i = e.transaction([K.MESSAGES, K.MAILBOX], "readwrite"), a = i.objectStore(K.MESSAGES), o = i.objectStore(K.MAILBOX), s = 0, c = a.openCursor();
			c.onsuccess = () => {
				let e = c.result;
				if (e) {
					let n = e.value;
					n.expiresAt && n.expiresAt < t && (e.delete(), s++), e.continue();
				}
			};
			let l = o.openCursor();
			l.onsuccess = () => {
				let e = l.result;
				if (e) {
					let n = e.value;
					n.expiresAt && n.expiresAt < t && (e.delete(), s++), e.continue();
				}
			}, i.oncomplete = () => n(s), i.onerror = () => r(/* @__PURE__ */ Error("Failed to cleanup expired"));
		});
	}
}, Dt = class {
	_storage;
	_operations = [];
	_isCommitted = !1;
	_isRolledBack = !1;
	constructor(e) {
		this._storage = e;
	}
	put(e, t) {
		return this._checkState(), this._operations.push({
			id: f(),
			type: "put",
			store: e,
			value: t,
			timestamp: Date.now()
		}), this;
	}
	delete(e, t) {
		return this._checkState(), this._operations.push({
			id: f(),
			type: "delete",
			store: e,
			key: t,
			timestamp: Date.now()
		}), this;
	}
	update(e, t, n) {
		return this._checkState(), this._operations.push({
			id: f(),
			type: "update",
			store: e,
			key: t,
			value: n,
			timestamp: Date.now()
		}), this;
	}
	async commit() {
		if (this._checkState(), this._operations.length === 0) {
			this._isCommitted = !0;
			return;
		}
		await this._storage.executeTransaction(this._operations), this._isCommitted = !0;
	}
	rollback() {
		this._operations = [], this._isRolledBack = !0;
	}
	get operationCount() {
		return this._operations.length;
	}
	_checkState() {
		if (this._isCommitted) throw Error("Transaction already committed");
		if (this._isRolledBack) throw Error("Transaction already rolled back");
	}
}, q = /* @__PURE__ */ new Map();
function Ot(e) {
	return q.has(e) || q.set(e, new Et(e)), q.get(e);
}
//#endregion
//#region ../../projects/uniform.ts/src/newer/next/channel/ChannelContext.ts
var kt = tt(), At = kt.length > 0 ? new URL("../transport/Worker.ts", kt) : "", jt = class {
	_channel;
	_context;
	_options;
	_connection;
	_storage;
	constructor(e, t, n = {}) {
		this._channel = e, this._context = t, this._options = n, this._connection = Ct(e), this._storage = Ot(e);
	}
	async request(e, t, n, r = {}) {
		let i = typeof e == "string" ? [e] : e, a = t, o = n;
		return Array.isArray(t) && Nt(e) && (r = n, o = t, a = e, i = []), this._context.getHost()?.request(i, a, o, r, this._channel);
	}
	async doImportModule(e, t = {}) {
		return this.request([], E.IMPORT, [e], t);
	}
	async deferMessage(e, t = {}) {
		return this._storage.defer({
			channel: this._channel,
			sender: this._context.hostName,
			type: "request",
			payload: e
		}, t);
	}
	async getPendingMessages() {
		return this._storage.getDeferredMessages(this._channel, { status: "pending" });
	}
	get connection() {
		return this._connection;
	}
	get channelName() {
		return this._channel;
	}
	get context() {
		return this._context;
	}
}, J = class {
	_channel;
	_context;
	_options;
	_connection;
	_unified;
	get _forResolves() {
		return this._unified.__getPrivate("_pending");
	}
	get _subscriptions() {
		return this._unified.__getPrivate("_subscriptions");
	}
	get _broadcasts() {
		return this._unified.__getPrivate("_transports");
	}
	constructor(e, t, n = {}) {
		this._channel = e, this._context = t, this._options = n, this._connection = St().getOrCreate(e, "internal", n), this._unified = new Ye({
			name: e,
			autoListen: !1,
			timeout: n?.timeout
		});
	}
	createRemoteChannel(e, t = {}, n) {
		let r = Pt(n ?? this._context.$createOrUseExistingRemote(e, t, n ?? null)?.messageChannel?.port1), i = It(r?.target ?? r);
		return this._unified.listen(r?.target, { targetChannel: e }), r && (this._broadcasts?.set?.(e, r), i === "self" && typeof postMessage > "u" || this._unified.connect(r, { targetChannel: e }), this._context.$registerConnection({
			localChannel: this._channel,
			remoteChannel: e,
			sender: this._channel,
			direction: "outgoing",
			transportType: i
		}), this.notifyChannel(e, {
			contextId: this._context.id,
			contextName: this._context.hostName
		}, "connect")), new jt(e, this._context, t);
	}
	getChannel() {
		return this._channel;
	}
	get connection() {
		return this._connection;
	}
	request(e, t, n, r = {}, i = "worker") {
		let a = typeof e == "string" ? [e] : e, o = n;
		return Array.isArray(t) && Nt(e) && (i = r, r = n, o = t, t = e, a = []), this._unified.invoke(i, t, a ?? [], Array.isArray(o) ? o : [o]);
	}
	resolveResponse(e, t) {
		this._forResolves.get(e)?.resolve?.(t);
		let n = this._forResolves.get(e)?.promise;
		return this._forResolves.delete(e), n;
	}
	async handleAndResponse(e, t, n) {}
	notifyChannel(e, t = {}, n = "notify") {
		return this._unified.notify(e, {
			...t,
			from: this._channel,
			to: e
		}, n);
	}
	getConnectedChannels() {
		return this._unified.connectedChannels;
	}
	close() {
		this._subscriptions.forEach((e) => e.unsubscribe()), this._forResolves.clear(), this._broadcasts?.values?.()?.forEach((e) => e.close?.()), this._broadcasts?.clear?.(), this._unified.close();
	}
	get unified() {
		return this._unified;
	}
}, Mt = class {
	_options;
	_id = f();
	_hostName;
	_host = null;
	_endpoints = /* @__PURE__ */ new Map();
	_unifiedByChannel = /* @__PURE__ */ new Map();
	_unifiedConnectionSubs = /* @__PURE__ */ new Map();
	_remoteChannels = /* @__PURE__ */ new Map();
	_deferredChannels = /* @__PURE__ */ new Map();
	_connectionEvents = new O({ bufferSize: 200 });
	_connectionRegistry = new Je(() => f(), (e) => this._emitConnectionEvent(e));
	_closed = !1;
	_globalSelf = null;
	constructor(e = {}) {
		this._options = e, this._hostName = e.name ?? `ctx-${this._id.slice(0, 8)}`, e.useGlobalSelf !== !1 && (this._globalSelf = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : null);
	}
	initHost(e) {
		if (this._host && !e) return this._host;
		let t = e ?? this._hostName;
		if (this._hostName = t, this._endpoints.has(t)) return this._host = this._endpoints.get(t).handler, this._host;
		this._host = new J(t, this, this._options.defaultOptions);
		let n = {
			name: t,
			handler: this._host,
			connection: this._host.connection,
			subscriptions: [],
			ready: Promise.resolve(null),
			unified: this._host.unified
		};
		return this._endpoints.set(t, n), this._registerUnifiedChannel(t, this._host.unified), this._host;
	}
	getHost() {
		return this._host ?? this.initHost();
	}
	get hostName() {
		return this._hostName;
	}
	get id() {
		return this._id;
	}
	get onConnection() {
		return this._connectionEvents;
	}
	subscribeConnections(e) {
		return this._connectionEvents.subscribe(e);
	}
	notifyConnections(e = {}, t = {}) {
		let n = 0;
		for (let r of this._endpoints.values()) {
			let i = r.handler.getConnectedChannels();
			for (let a of i) {
				if (t.localChannel && t.localChannel !== r.name || t.remoteChannel && t.remoteChannel !== a) continue;
				let i = this.queryConnections({
					localChannel: r.name,
					remoteChannel: a,
					status: "active"
				})[0];
				t.sender && i?.sender !== t.sender || t.transportType && i?.transportType !== t.transportType || t.channel && t.channel !== r.name && t.channel !== a || r.handler.notifyChannel(a, e, "notify") && n++;
			}
		}
		return n;
	}
	queryConnections(e = {}) {
		return this._connectionRegistry.query(e).map((e) => ({
			...e,
			contextId: this._id
		}));
	}
	createChannel(e, t = {}) {
		if (this._endpoints.has(e)) return this._endpoints.get(e);
		let n = new J(e, this, {
			...this._options.defaultOptions,
			...t
		}), r = {
			name: e,
			handler: n,
			connection: n.connection,
			subscriptions: [],
			ready: Promise.resolve(null),
			unified: n.unified
		};
		return this._endpoints.set(e, r), this._registerUnifiedChannel(e, n.unified), r;
	}
	createChannels(e, t = {}) {
		let n = /* @__PURE__ */ new Map();
		for (let r of e) n.set(r, this.createChannel(r, t));
		return n;
	}
	getChannel(e) {
		return this._endpoints.get(e);
	}
	getOrCreateChannel(e, t = {}) {
		return this._endpoints.get(e) ?? this.createChannel(e, t);
	}
	hasChannel(e) {
		return this._endpoints.has(e);
	}
	getChannelNames() {
		return [...this._endpoints.keys()];
	}
	get size() {
		return this._endpoints.size;
	}
	defer(e, t) {
		this._deferredChannels.set(e, t);
	}
	async initDeferred(e) {
		let t = this._deferredChannels.get(e);
		if (!t) return null;
		let n = await t();
		return this._endpoints.set(e, n), this._deferredChannels.delete(e), n;
	}
	isDeferred(e) {
		return this._deferredChannels.has(e);
	}
	async getChannelAsync(e) {
		return this._endpoints.has(e) ? this._endpoints.get(e) : this._deferredChannels.has(e) ? this.initDeferred(e) : null;
	}
	async addWorker(e, t, n = {}) {
		let r = Lt(t);
		if (!r) throw Error(`Failed to create worker for channel: ${e}`);
		let i = new J(e, this, {
			...this._options.defaultOptions,
			...n
		}), a = i.createRemoteChannel(e, n, r), o = {
			name: e,
			handler: i,
			connection: i.connection,
			subscriptions: [],
			transportType: "worker",
			ready: Promise.resolve(a),
			unified: i.unified
		};
		return this._endpoints.set(e, o), this._registerUnifiedChannel(e, i.unified), this._remoteChannels.set(e, {
			channel: e,
			context: this,
			remote: Promise.resolve(a),
			transport: r,
			transportType: "worker"
		}), o;
	}
	async addPort(e, t, n = {}) {
		let r = new J(e, this, {
			...this._options.defaultOptions,
			...n
		});
		t.start?.();
		let i = r.createRemoteChannel(e, n, t), a = {
			name: e,
			handler: r,
			connection: r.connection,
			subscriptions: [],
			transportType: "message-port",
			ready: Promise.resolve(i),
			unified: r.unified
		};
		return this._endpoints.set(e, a), this._registerUnifiedChannel(e, r.unified), this._remoteChannels.set(e, {
			channel: e,
			context: this,
			remote: Promise.resolve(i),
			transport: t,
			transportType: "message-port"
		}), a;
	}
	async addBroadcast(e, t, n = {}) {
		let r = new BroadcastChannel(t ?? e), i = new J(e, this, {
			...this._options.defaultOptions,
			...n
		}), a = i.createRemoteChannel(e, n, r), o = {
			name: e,
			handler: i,
			connection: i.connection,
			subscriptions: [],
			transportType: "broadcast",
			ready: Promise.resolve(a),
			unified: i.unified
		};
		return this._endpoints.set(e, o), this._registerUnifiedChannel(e, i.unified), this._remoteChannels.set(e, {
			channel: e,
			context: this,
			remote: Promise.resolve(a),
			transport: r,
			transportType: "broadcast"
		}), o;
	}
	addSelfChannel(e, t = {}) {
		let n = new J(e, this, {
			...this._options.defaultOptions,
			...t
		}), r = this._globalSelf ?? (typeof self < "u" ? self : null), i = {
			name: e,
			handler: n,
			connection: n.connection,
			subscriptions: [],
			transportType: "self",
			ready: Promise.resolve(r ? n.createRemoteChannel(e, t, r) : null),
			unified: n.unified
		};
		return this._endpoints.set(e, i), this._registerUnifiedChannel(e, n.unified), i;
	}
	async addTransport(e, t) {
		let n = t.options ?? {};
		switch (t.type) {
			case "worker":
				if (!t.worker) throw Error("Worker required for worker transport");
				return this.addWorker(e, t.worker, n);
			case "message-port":
				if (!t.port) throw Error("Port required for message-port transport");
				return this.addPort(e, t.port, n);
			case "broadcast":
				let r = typeof t.broadcast == "string" ? t.broadcast : void 0;
				return this.addBroadcast(e, r, n);
			case "self": return this.addSelfChannel(e, n);
			default: return this.createChannel(e, n);
		}
	}
	createChannelPair(e, t, n = {}) {
		let r = new MessageChannel(), i = new J(e, this, {
			...this._options.defaultOptions,
			...n
		}), a = new J(t, this, {
			...this._options.defaultOptions,
			...n
		});
		r.port1.start(), r.port2.start();
		let o = Promise.resolve(i.createRemoteChannel(t, n, r.port1)), s = Promise.resolve(a.createRemoteChannel(e, n, r.port2)), c = {
			name: e,
			handler: i,
			connection: i.connection,
			subscriptions: [],
			transportType: "message-port",
			ready: o,
			unified: i.unified
		}, l = {
			name: t,
			handler: a,
			connection: a.connection,
			subscriptions: [],
			transportType: "message-port",
			ready: s,
			unified: a.unified
		};
		return this._endpoints.set(e, c), this._endpoints.set(t, l), this._registerUnifiedChannel(e, i.unified), this._registerUnifiedChannel(t, a.unified), {
			channel1: c,
			channel2: l,
			messageChannel: r
		};
	}
	get globalSelf() {
		return this._globalSelf;
	}
	async connectRemote(e, t = {}, n) {
		return this.initHost(), this._host.createRemoteChannel(e, t, n);
	}
	async importModuleInChannel(e, t, n = {}, r) {
		return (await this.connectRemote(e, n.channelOptions, r))?.doImportModule?.(t, n.importOptions);
	}
	$createOrUseExistingRemote(e, t = {}, n) {
		if (e == null || n) return null;
		if (this._remoteChannels.has(e)) return this._remoteChannels.get(e);
		let r = new MessageChannel(), i = T(new Promise((n) => {
			let i = Lt(At);
			i?.addEventListener?.("message", (e) => {
				e.data.type === "channelCreated" && (r.port1?.start?.(), n(new jt(e.data.channel, this, t)));
			}), i?.postMessage?.({
				type: "createChannel",
				channel: e,
				sender: this._hostName,
				options: t,
				messagePort: r.port2
			}, { transfer: [r.port2] });
		})), a = {
			channel: e,
			context: this,
			messageChannel: r,
			remote: i
		};
		return this._remoteChannels.set(e, a), a;
	}
	$registerConnection(e) {
		return {
			...this._connectionRegistry.register(e),
			contextId: this._id
		};
	}
	$markNotified(e) {
		let t = this._connectionRegistry.register({
			localChannel: e.localChannel,
			remoteChannel: e.remoteChannel,
			sender: e.sender,
			direction: e.direction,
			transportType: e.transportType
		});
		this._connectionRegistry.markNotified(t, e.payload);
	}
	$observeSignal(e) {
		e.payload?.type, this.$markNotified({
			localChannel: e.localChannel,
			remoteChannel: e.remoteChannel,
			sender: e.sender,
			direction: "incoming",
			transportType: e.transportType,
			payload: e.payload
		});
	}
	$forwardUnifiedConnectionEvent(e, t) {
		let n = t.connection.transportType ?? "internal", r = this._connectionRegistry.register({
			localChannel: t.connection.localChannel || e,
			remoteChannel: t.connection.remoteChannel,
			sender: t.connection.sender,
			direction: t.connection.direction,
			transportType: n,
			metadata: t.connection.metadata
		});
		t.type === "notified" ? this._connectionRegistry.markNotified(r, t.payload) : t.type === "disconnected" && this._connectionRegistry.closeByChannel(t.connection.localChannel);
	}
	closeChannel(e) {
		let t = this._endpoints.get(e);
		return t ? (t.subscriptions.forEach((e) => e.unsubscribe()), t.handler.close(), t.transport?.detach(), this._unifiedConnectionSubs.get(e)?.unsubscribe(), this._unifiedConnectionSubs.delete(e), this._unifiedByChannel.delete(e), this._endpoints.delete(e), e === this._hostName && (this._host = null), this._connectionRegistry.closeByChannel(e), !0) : !1;
	}
	close() {
		if (!this._closed) {
			this._closed = !0;
			for (let [e] of this._endpoints) this.closeChannel(e);
			this._remoteChannels.clear(), this._host = null, this._unifiedConnectionSubs.forEach((e) => e.unsubscribe()), this._unifiedConnectionSubs.clear(), this._unifiedByChannel.clear(), this._connectionRegistry.clear(), this._connectionEvents.complete();
		}
	}
	get closed() {
		return this._closed;
	}
	_registerUnifiedChannel(e, t) {
		this._unifiedByChannel.set(e, t), this._unifiedConnectionSubs.get(e)?.unsubscribe();
		let n = t.subscribeConnections((t) => {
			this.$forwardUnifiedConnectionEvent(e, t);
		});
		this._unifiedConnectionSubs.set(e, n);
	}
	_emitConnectionEvent(e) {
		this._connectionEvents.next({
			...e,
			connection: {
				...e.connection,
				contextId: this._id
			}
		});
	}
};
function Nt(e) {
	return [...Object.values(E)].includes(e);
}
function Pt(e) {
	if (!e) return null;
	if (Ft(e)) return e;
	let t = e, n = It(t);
	return {
		target: t,
		targetChannel: "unknown",
		transportType: n === "internal" ? "self" : n,
		sender: (e, n) => {
			if (typeof WebSocket < "u" && t instanceof WebSocket) {
				t.send(JSON.stringify(e));
				return;
			}
			t.postMessage?.(e, n?.length ? { transfer: n } : void 0);
		},
		postMessage: (e, n) => {
			t.postMessage?.(e, n);
		},
		addEventListener: t.addEventListener?.bind(t),
		removeEventListener: t.removeEventListener?.bind(t),
		start: t.start?.bind(t),
		close: t.close?.bind(t)
	};
}
function Ft(e) {
	return !!e && typeof e == "object" && "target" in e && typeof e.postMessage == "function";
}
function It(e) {
	let t = Ft(e) ? e.target : e;
	return t ? t === "chrome-runtime" ? "chrome-runtime" : t === "chrome-tabs" ? "chrome-tabs" : t === "chrome-port" ? "chrome-port" : t === "chrome-external" ? "chrome-external" : typeof MessagePort < "u" && t instanceof MessagePort ? "message-port" : typeof BroadcastChannel < "u" && t instanceof BroadcastChannel ? "broadcast" : typeof Worker < "u" && t instanceof Worker ? "worker" : typeof WebSocket < "u" && t instanceof WebSocket ? "websocket" : typeof chrome < "u" && typeof t == "object" && t && typeof t.postMessage == "function" && t.onMessage?.addListener ? "chrome-port" : typeof self < "u" && t === self ? "self" : "internal" : "internal";
}
function Lt(e) {
	if (e instanceof Worker) return e;
	if (e instanceof URL) return new Worker(e.href, { type: "module" });
	if (typeof e == "function") try {
		return new e({ type: "module" });
	} catch {
		return e({ type: "module" });
	}
	return typeof e == "string" ? e.startsWith("/") ? new Worker(F(e.replace(/^\//, "./")), { type: "module" }) : URL.canParse(e) || e.startsWith("./") ? new Worker(F(e), { type: "module" }) : new Worker(URL.createObjectURL(new Blob([e], { type: "application/javascript" })), { type: "module" }) : e instanceof Blob || e instanceof File ? new Worker(URL.createObjectURL(e), { type: "module" }) : e ?? (typeof self < "u" ? self : null);
}
var Rt = /* @__PURE__ */ new Map();
function zt(e = {}) {
	let t = new Mt(e);
	return e.name && Rt.set(e.name, t), t;
}
//#endregion
//#region ../../projects/uniform.ts/src/newer/next/transport/Worker.ts
var Bt = class {
	_context;
	_config;
	_subscriptions = [];
	_incomingConnections = new O({ bufferSize: 100 });
	_channelCreated = new O({ bufferSize: 100 });
	_channelClosed = new O();
	constructor(e = {}) {
		this._config = {
			name: e.name ?? "worker",
			workerName: e.workerName ?? `worker-${f().slice(0, 8)}`,
			autoAcceptChannels: e.autoAcceptChannels ?? !0,
			allowedChannels: e.allowedChannels ?? [],
			maxChannels: e.maxChannels ?? 100,
			autoConnect: e.autoConnect ?? !0,
			useGlobalSelf: !0,
			defaultOptions: e.defaultOptions ?? {},
			isolatedStorage: e.isolatedStorage ?? !1,
			...e
		}, this._context = zt({
			name: this._config.name,
			useGlobalSelf: !0,
			defaultOptions: e.defaultOptions
		}), this._setupMessageListener();
	}
	get onConnection() {
		return this._incomingConnections;
	}
	get onChannelCreated() {
		return this._channelCreated;
	}
	get onChannelClosed() {
		return this._channelClosed;
	}
	subscribeConnections(e) {
		return this._incomingConnections.subscribe(e);
	}
	subscribeChannelCreated(e) {
		return this._channelCreated.subscribe(e);
	}
	acceptConnection(e) {
		if (!this._canAcceptChannel(e.channel)) return null;
		let t = this._context.createChannel(e.channel, e.options);
		return e.port && (e.port.start?.(), t.handler.createRemoteChannel(e.sender, e.options, e.port)), this._channelCreated.next({
			channel: e.channel,
			endpoint: t,
			sender: e.sender,
			timestamp: Date.now()
		}), this._postChannelCreated(e.channel, e.sender, e.id), t;
	}
	createChannel(e, t) {
		return this._context.createChannel(e, t);
	}
	getChannel(e) {
		return this._context.getChannel(e);
	}
	hasChannel(e) {
		return this._context.hasChannel(e);
	}
	getChannelNames() {
		return this._context.getChannelNames();
	}
	queryConnections(e = {}) {
		return this._context.queryConnections(e);
	}
	notifyConnections(e = {}, t = {}) {
		return this._context.notifyConnections(e, t);
	}
	closeChannel(e) {
		let t = this._context.closeChannel(e);
		return t && this._channelClosed.next({
			channel: e,
			timestamp: Date.now()
		}), t;
	}
	get context() {
		return this._context;
	}
	get config() {
		return this._config;
	}
	_setupMessageListener() {
		addEventListener("message", ((e) => {
			this._handleIncomingMessage(e);
		}));
	}
	_handleIncomingMessage(e) {
		let t = e.data;
		if (!(!t || typeof t != "object")) switch (t.type) {
			case "createChannel":
				this._handleCreateChannel(t);
				break;
			case "connectChannel":
				this._handleConnectChannel(t);
				break;
			case "addPort":
				this._handleAddPort(t);
				break;
			case "listChannels":
				this._handleListChannels(t);
				break;
			case "closeChannel":
				this._handleCloseChannel(t);
				break;
			case "ping":
				postMessage({
					type: "pong",
					id: t.id,
					timestamp: Date.now()
				});
				break;
			default: t.channel && this._context.hasChannel(t.channel) && (this._context.getChannel(t.channel)?.handler)?.handleAndResponse?.(t.payload, t.reqId);
		}
	}
	_handleCreateChannel(e) {
		let t = {
			id: e.reqId ?? f(),
			channel: e.channel,
			sender: e.sender ?? "unknown",
			type: "channel",
			port: e.messagePort,
			timestamp: Date.now(),
			options: e.options
		};
		this._incomingConnections.next(t), this._config.autoAcceptChannels && this.acceptConnection(t);
	}
	_handleConnectChannel(e) {
		let t = {
			id: e.reqId ?? f(),
			channel: e.channel,
			sender: e.sender ?? "unknown",
			type: e.portType ?? "channel",
			port: e.port,
			timestamp: Date.now(),
			options: e.options
		};
		if (this._incomingConnections.next(t), this._config.autoAcceptChannels && this._canAcceptChannel(e.channel)) {
			let t = this._context.getOrCreateChannel(e.channel, e.options);
			e.port && (e.port.start?.(), t.handler.createRemoteChannel(e.sender, e.options, e.port)), postMessage({
				type: "channelConnected",
				channel: e.channel,
				reqId: e.reqId
			});
		}
	}
	_handleAddPort(e) {
		if (!e.port || !e.channel) return;
		let t = {
			id: e.reqId ?? f(),
			channel: e.channel,
			sender: e.sender ?? "unknown",
			type: "port",
			port: e.port,
			timestamp: Date.now(),
			options: e.options
		};
		this._incomingConnections.next(t), this._config.autoAcceptChannels && this.acceptConnection(t);
	}
	_handleListChannels(e) {
		postMessage({
			type: "channelList",
			channels: this.getChannelNames(),
			reqId: e.reqId
		});
	}
	_handleCloseChannel(e) {
		e.channel && (this.closeChannel(e.channel), postMessage({
			type: "channelClosed",
			channel: e.channel,
			reqId: e.reqId
		}));
	}
	_canAcceptChannel(e) {
		return this._context.size >= this._config.maxChannels ? !1 : this._config.allowedChannels.length > 0 ? this._config.allowedChannels.includes(e) : !0;
	}
	_postChannelCreated(e, t, n) {
		postMessage({
			type: "channelCreated",
			channel: e,
			sender: t,
			reqId: n,
			timestamp: Date.now()
		});
	}
	close() {
		this._subscriptions.forEach((e) => e.unsubscribe()), this._subscriptions = [], this._incomingConnections.complete(), this._channelCreated.complete(), this._channelClosed.complete(), this._context.close();
	}
}, Vt = null;
function Ht(e) {
	return Vt ||= new Bt(e), Vt;
}
Ht({ name: "worker" });
//#endregion
//#region ../../projects/uniform.ts/src/newer/next/transport/PortTransport.ts
var Ut = class {
	_channelName;
	_config;
	_port;
	_subs = /* @__PURE__ */ new Set();
	_pending = /* @__PURE__ */ new Map();
	_listening = !1;
	_cleanup = null;
	_portId = f();
	_state = new O();
	_keepAliveTimer = null;
	constructor(e, t, n = {}) {
		this._channelName = t, this._config = n, this._port = e, this._setupPort(), n.autoStart !== !1 && this.start();
	}
	_setupPort() {
		let e = (e) => {
			let t = e.data;
			if (t.type === "response" && t.reqId) {
				let e = this._pending.get(t.reqId);
				if (e) {
					this._pending.delete(t.reqId), t.payload?.error ? e.reject(Error(t.payload.error)) : e.resolve(t.payload?.result ?? t.payload);
					return;
				}
			}
			if (t.type === "signal" && t.payload?.action === "ping") {
				this.send({
					id: f(),
					channel: this._channelName,
					sender: this._portId,
					type: "signal",
					payload: { action: "pong" }
				});
				return;
			}
			t.portId = t.portId ?? this._portId;
			for (let e of this._subs) try {
				e.next?.(t);
			} catch (t) {
				e.error?.(t);
			}
		}, t = () => {
			this._state.next("error");
			let e = /* @__PURE__ */ Error("Port error");
			for (let t of this._subs) t.error?.(e);
		};
		this._port.addEventListener("message", e), this._port.addEventListener("messageerror", t), this._cleanup = () => {
			this._port.removeEventListener("message", e), this._port.removeEventListener("messageerror", t);
		};
	}
	start() {
		this._listening || (this._port.start(), this._listening = !0, this._state.next("ready"), this._config.keepAlive && this._startKeepAlive());
	}
	send(e, t) {
		let { transferable: n, ...r } = e;
		this._port.postMessage({
			...r,
			portId: this._portId
		}, t ?? []);
	}
	request(e) {
		let t = e.reqId ?? f();
		return new Promise((n, r) => {
			let i = setTimeout(() => {
				this._pending.delete(t), r(/* @__PURE__ */ Error("Request timeout"));
			}, this._config.timeout ?? 3e4);
			this._pending.set(t, {
				resolve: (e) => {
					clearTimeout(i), n(e);
				},
				reject: (e) => {
					clearTimeout(i), r(e);
				},
				timestamp: Date.now()
			}), this.send({
				...e,
				reqId: t,
				type: "request"
			});
		});
	}
	subscribe(e) {
		let t = typeof e == "function" ? { next: e } : e;
		return this._subs.add(t), {
			closed: !1,
			unsubscribe: () => {
				this._subs.delete(t);
			}
		};
	}
	_startKeepAlive() {
		this._keepAliveTimer = setInterval(() => {
			this.send({
				id: f(),
				channel: this._channelName,
				sender: this._portId,
				type: "signal",
				payload: { action: "ping" }
			});
		}, this._config.keepAliveInterval ?? 3e4);
	}
	close() {
		this._keepAliveTimer &&= (clearInterval(this._keepAliveTimer), null), this._cleanup?.(), this._subs.forEach((e) => e.complete?.()), this._subs.clear(), this._port.close(), this._state.next("closed");
	}
	get port() {
		return this._port;
	}
	get portId() {
		return this._portId;
	}
	get isListening() {
		return this._listening;
	}
	get state() {
		return this._state;
	}
	get channelName() {
		return this._channelName;
	}
};
function Wt(e, t) {
	let n = new MessageChannel();
	return {
		local: new Ut(n.port1, e, t),
		remote: n.port2,
		transfer: () => n.port2
	};
}
(class {
	_target;
	_channelName;
	_config;
	_transport = null;
	_state = new O();
	_handshakeComplete = !1;
	constructor(e, t, n = {}) {
		this._target = e, this._channelName = t, this._config = n;
	}
	async connect() {
		if (this._transport && this._handshakeComplete) return this._transport;
		this._state.next("connecting");
		let { local: e, remote: t } = Wt(this._channelName, this._config);
		return this._target.postMessage({
			type: "port-connect",
			channelName: this._channelName,
			portId: e.portId
		}, this._config.targetOrigin ?? "*", [t]), new Promise((t, n) => {
			let r = setTimeout(() => {
				n(/* @__PURE__ */ Error("Handshake timeout")), this._state.next("error");
			}, this._config.handshakeTimeout ?? 1e4), i = e.subscribe({ next: (n) => {
				n.type === "signal" && n.payload?.action === "handshake-ack" && (clearTimeout(r), this._handshakeComplete = !0, this._transport = e, this._state.next("connected"), i.unsubscribe(), t(e));
			} });
		});
	}
	static listen(e, t, n) {
		let r = (r) => {
			if (r.data?.type !== "port-connect" || r.data?.channelName !== e || !r.ports[0]) return;
			let i = new Ut(r.ports[0], e, n);
			i.send({
				id: f(),
				channel: e,
				sender: i.portId,
				type: "signal",
				payload: { action: "handshake-ack" }
			}), t(i);
		};
		return globalThis.addEventListener("message", r), () => globalThis.removeEventListener("message", r);
	}
	disconnect() {
		this._transport?.close(), this._transport = null, this._handshakeComplete = !1, this._state.next("disconnected");
	}
	get isConnected() {
		return this._handshakeComplete;
	}
	get state() {
		return this._state;
	}
	get transport() {
		return this._transport;
	}
}).listen;
//#endregion
//#region ../../projects/uniform.ts/src/newer/next/storage/Queued.ts
var Gt = class {
	config;
	onChannelReady;
	underlyingChannel = null;
	isConnected = !1;
	requestQueue = [];
	connectionPromise = null;
	connectionResolver = null;
	context;
	constructor(e, t) {
		this.config = e, this.onChannelReady = t, this.context = e.context ?? "unknown";
	}
	async connect(e = null) {
		this.underlyingChannel = e;
	}
	async request(e, t = []) {
		return this.isConnected && this.underlyingChannel ? this.underlyingChannel.request(e, t) : new Promise((n, r) => {
			let i = {
				id: f(),
				method: e,
				args: t,
				resolve: n,
				reject: r,
				timestamp: Date.now()
			};
			this.requestQueue.push(i), this.connectionPromise || this.connect().catch((e) => {
				this.rejectAllQueued(e);
			});
		});
	}
	async flushQueue() {
		if (!this.underlyingChannel) return;
		let e = [...this.requestQueue];
		this.requestQueue = [];
		for (let t of e) try {
			let e = await this.underlyingChannel.request(t.method, t.args);
			t.resolve(e);
		} catch (e) {
			t.reject(e);
		}
	}
	rejectAllQueued(e) {
		let t = [...this.requestQueue];
		this.requestQueue = [];
		for (let n of t) n.reject(e);
	}
	getQueueStatus() {
		return {
			isConnected: this.isConnected,
			queuedRequests: this.requestQueue.length,
			isConnecting: !!this.connectionPromise && !this.isConnected
		};
	}
	close() {
		this.rejectAllQueued(/* @__PURE__ */ Error("Channel closed")), this.underlyingChannel?.close(), this.underlyingChannel = null, this.isConnected = !1, this.connectionPromise = null;
	}
}, Kt = class {
	channel = null;
	isChannelReady = !1;
	pendingRequests = /* @__PURE__ */ new Map();
	messageQueue = [];
	queuedRequests = [];
	batchTimer;
	options;
	onChannelReady;
	constructor(e = null, t = {}, n) {
		this.channel = e, this.isChannelReady = !!e, this.onChannelReady = n, this.options = {
			timeout: 3e4,
			retries: 3,
			compression: !1,
			batching: !0,
			...t
		};
	}
	setChannel(e) {
		this.channel = e, this.isChannelReady = !0, this.onChannelReady?.(e), this.flushQueuedRequests();
	}
	async request(e, t, n) {
		if (!this.isChannelReady || !this.channel) return new Promise((n, r) => {
			let i = {
				id: f(),
				method: e,
				args: [t],
				resolve: n,
				reject: r,
				timestamp: Date.now()
			};
			this.queuedRequests.push(i);
		});
		let r = {
			...this.options,
			...n
		}, i = f();
		return new Promise((n, a) => {
			let o = setTimeout(() => {
				this.pendingRequests.delete(i), a(/* @__PURE__ */ Error(`Request timeout: ${e}`));
			}, r.timeout);
			this.pendingRequests.set(i, {
				resolve: n,
				reject: a,
				timeout: o
			});
			let s = {
				id: i,
				type: e,
				payload: t,
				timestamp: Date.now()
			};
			r.batching ? this.queueMessage(s) : this.sendMessage(s);
		});
	}
	async flushQueuedRequests() {
		if (!this.channel || this.queuedRequests.length === 0) return;
		let e = [...this.queuedRequests];
		this.queuedRequests = [];
		for (let t of e) try {
			let e = await this.request(t.method, ...t?.args ?? []);
			t.resolve(e);
		} catch (e) {
			t.reject(e);
		}
	}
	notify(e, t) {
		let n = {
			id: f(),
			type: e,
			payload: t,
			timestamp: Date.now()
		};
		this.options.batching ? this.queueMessage(n) : this.sendMessage(n);
	}
	async *stream(e, t) {
		for (let n of t) yield await this.request(`${e}:chunk`, n);
	}
	queueMessage(e) {
		this.messageQueue.push(e), this.batchTimer ||= setTimeout(() => {
			this.flushBatch();
		}, 16);
	}
	flushBatch() {
		if (this.messageQueue.length === 0) return;
		let e = {
			id: f(),
			type: "batch",
			payload: this.messageQueue,
			timestamp: Date.now()
		};
		this.sendMessage(e), this.messageQueue = [], this.batchTimer = void 0;
	}
	async sendMessage(e) {
		try {
			let t = await this.channel?.request?.("processMessage", [e]);
			if (e.replyTo && this.pendingRequests.has(e.replyTo)) {
				let { resolve: n, timeout: r } = this.pendingRequests.get(e.replyTo);
				clearTimeout(r), this.pendingRequests.delete(e.replyTo), n(t);
			}
		} catch (t) {
			if (this.pendingRequests.has(e.id)) {
				let { reject: n, timeout: r } = this.pendingRequests.get(e.id);
				clearTimeout(r), this.pendingRequests.delete(e.id), n(t);
			}
		}
	}
	close() {
		this.batchTimer && clearTimeout(this.batchTimer);
		for (let [e, { reject: t, timeout: n }] of this.pendingRequests) clearTimeout(n), t(/* @__PURE__ */ Error("Channel closed"));
		this.pendingRequests.clear(), this.channel?.close?.();
	}
}, qt = class e {
	db = null;
	dbPromise = null;
	options;
	constructor(e = {}) {
		this.options = {
			dbName: e.dbName ?? "UniformMessageQueue",
			storeName: e.storeName ?? "messages",
			maxRetries: e.maxRetries ?? 3,
			defaultExpirationMs: e.defaultExpirationMs ?? 864e5,
			fallbackStorageKey: e.fallbackStorageKey ?? "uniform_message_queue"
		};
	}
	async initDB() {
		if (this.db) return this.db;
		if (this.dbPromise) return this.dbPromise;
		if (!e.isIndexedDBAvailable()) return console.warn("[MessageQueue] IndexedDB not available, using sessionStorage fallback"), null;
		this.dbPromise = new Promise((e, t) => {
			let n = indexedDB.open(this.options.dbName, 1);
			n.onerror = () => {
				console.warn("[MessageQueue] IndexedDB open failed, falling back to sessionStorage"), t(/* @__PURE__ */ Error("IndexedDB not available"));
			}, n.onsuccess = () => {
				this.db = n.result, e(this.db);
			}, n.onupgradeneeded = (e) => {
				let t = e.target.result;
				if (!t.objectStoreNames.contains(this.options.storeName)) {
					let e = t.createObjectStore(this.options.storeName, { keyPath: "id" });
					e.createIndex("timestamp", "timestamp", { unique: !1 }), e.createIndex("type", "type", { unique: !1 }), e.createIndex("priority", "priority", { unique: !1 }), e.createIndex("destination", "destination", { unique: !1 });
				}
			};
		});
		try {
			return this.db = await this.dbPromise, this.db;
		} catch {
			return null;
		}
	}
	generateId() {
		return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
	}
	async queueMessage(e, t, n = {}) {
		let r = {
			id: this.generateId(),
			type: e,
			data: t,
			timestamp: Date.now(),
			priority: n.priority ?? "normal",
			retryCount: 0,
			maxRetries: n.maxRetries ?? this.options.maxRetries,
			expiresAt: n.expiresAt ?? Date.now() + this.options.defaultExpirationMs,
			destination: n.destination,
			metadata: n.metadata
		};
		try {
			let t = await this.initDB();
			return t ? await this.addToIndexedDB(t, r) : this.addToSessionStorage(r), console.log(`[MessageQueue] Queued message: ${e}`, r.id), r.id;
		} catch (e) {
			throw console.error("[MessageQueue] Failed to queue message:", e), e;
		}
	}
	async getQueuedMessages(e) {
		try {
			let t = await this.initDB(), n;
			n = t ? await this.getAllFromIndexedDB(t) : this.getAllFromSessionStorage(), e && (n = n.filter((t) => t.destination === e));
			let r = Date.now();
			return n.filter((e) => !e.expiresAt || e.expiresAt > r);
		} catch (e) {
			return console.error("[MessageQueue] Failed to get queued messages:", e), this.getAllFromSessionStorage();
		}
	}
	async removeMessage(e) {
		try {
			let t = await this.initDB();
			t ? await this.deleteFromIndexedDB(t, e) : this.deleteFromSessionStorage(e);
		} catch (e) {
			console.error("[MessageQueue] Failed to remove message:", e);
		}
	}
	async updateMessageRetry(e, t) {
		try {
			let n = await this.initDB();
			n ? await this.updateInIndexedDB(n, e, { retryCount: t }) : this.updateInSessionStorage(e, { retryCount: t });
		} catch (e) {
			console.error("[MessageQueue] Failed to update message retry:", e);
		}
	}
	async clearExpiredMessages() {
		try {
			let e = await this.getQueuedMessages(), t = Date.now(), n = e.filter((e) => e.expiresAt && e.expiresAt <= t).map((e) => e.id);
			for (let e of n) await this.removeMessage(e);
			return n.length > 0 && console.log(`[MessageQueue] Cleared ${n.length} expired messages`), n.length;
		} catch (e) {
			return console.error("[MessageQueue] Failed to clear expired messages:", e), 0;
		}
	}
	async clearAll() {
		try {
			let e = await this.initDB();
			e ? await this.clearIndexedDB(e) : sessionStorage.removeItem(this.options.fallbackStorageKey), console.log("[MessageQueue] Cleared all messages");
		} catch (e) {
			console.error("[MessageQueue] Failed to clear all messages:", e);
		}
	}
	async getStats() {
		let e = await this.getQueuedMessages(), t = Date.now(), n = {
			low: 0,
			normal: 0,
			high: 0
		}, r = {}, i = 0;
		for (let a of e) n[a.priority]++, a.destination && (r[a.destination] = (r[a.destination] || 0) + 1), a.expiresAt && a.expiresAt <= t && i++;
		return {
			total: e.length,
			byPriority: n,
			byDestination: r,
			expired: i
		};
	}
	async addToIndexedDB(e, t) {
		return new Promise((n, r) => {
			let i = e.transaction([this.options.storeName], "readwrite").objectStore(this.options.storeName).add(t);
			i.onsuccess = () => n(), i.onerror = () => r(i.error);
		});
	}
	async getAllFromIndexedDB(e) {
		return new Promise((t, n) => {
			let r = e.transaction([this.options.storeName], "readonly").objectStore(this.options.storeName).getAll();
			r.onsuccess = () => t(r.result), r.onerror = () => n(r.error);
		});
	}
	async deleteFromIndexedDB(e, t) {
		return new Promise((n, r) => {
			let i = e.transaction([this.options.storeName], "readwrite").objectStore(this.options.storeName).delete(t);
			i.onsuccess = () => n(), i.onerror = () => r(i.error);
		});
	}
	async updateInIndexedDB(e, t, n) {
		let r = e.transaction([this.options.storeName], "readwrite").objectStore(this.options.storeName), i = await new Promise((e, n) => {
			let i = r.get(t);
			i.onsuccess = () => e(i.result), i.onerror = () => n(i.error);
		});
		i && (Object.assign(i, n), await new Promise((e, t) => {
			let n = r.put(i);
			n.onsuccess = () => e(), n.onerror = () => t(n.error);
		}));
	}
	async clearIndexedDB(e) {
		return new Promise((t, n) => {
			let r = e.transaction([this.options.storeName], "readwrite").objectStore(this.options.storeName).clear();
			r.onsuccess = () => t(), r.onerror = () => n(r.error);
		});
	}
	getAllFromSessionStorage() {
		try {
			let e = sessionStorage.getItem(this.options.fallbackStorageKey);
			return e ? JSON.parse(e) : [];
		} catch {
			return [];
		}
	}
	addToSessionStorage(e) {
		let t = this.getAllFromSessionStorage();
		t.push(e), sessionStorage.setItem(this.options.fallbackStorageKey, JSON.stringify(t));
	}
	deleteFromSessionStorage(e) {
		let t = this.getAllFromSessionStorage().filter((t) => t.id !== e);
		sessionStorage.setItem(this.options.fallbackStorageKey, JSON.stringify(t));
	}
	updateInSessionStorage(e, t) {
		let n = this.getAllFromSessionStorage(), r = n.find((t) => t.id === e);
		r && (Object.assign(r, t), sessionStorage.setItem(this.options.fallbackStorageKey, JSON.stringify(n)));
	}
	static isIndexedDBAvailable() {
		try {
			return typeof indexedDB < "u" && typeof IDBTransaction < "u" && typeof IDBKeyRange < "u";
		} catch {
			return !1;
		}
	}
}, Y = /* @__PURE__ */ new Map();
function Jt(e) {
	let t = e?.dbName ?? "default";
	return Y.has(t) || Y.set(t, new qt(e)), Y.get(t);
}
//#endregion
//#region ../../projects/uniform.ts/src/newer/next/utils/Utils.ts
var Yt = async (e) => ({
	async request(t, n = []) {
		return new Promise((r, i) => {
			let a = new BroadcastChannel(`${e.name}-sw-channel`), o = f(), s = setTimeout(() => {
				a.close(), i(/* @__PURE__ */ Error(`Service worker request timeout: ${t}`));
			}, 1e4);
			a.onmessage = (e) => {
				let { id: t, result: n, error: c } = e.data;
				t === o && (clearTimeout(s), a.close(), c ? i(Error(c)) : r(n));
			}, a.postMessage({
				id: o,
				type: "request",
				method: t,
				args: n
			});
		});
	},
	close() {}
}), X = async (e) => {
	let t = e.context;
	if (t === "service-worker") return Yt(e);
	let n;
	if (typeof e.script == "function") n = e.script();
	else if (e.script instanceof Worker) n = e.script;
	else if (t === "chrome-extension") try {
		n = new Worker(chrome.runtime.getURL(e.script), e.options);
	} catch {
		n = new Worker(F(e.script), e.options);
	}
	else n = new Worker(F(e.script), e.options);
	return await st(e.name, {}, n);
}, Xt = (e, t, n) => {
	let r = new Kt(null, t, n);
	return X(e).then((e) => {
		r.setChannel(e);
	}).catch((e) => {
		console.error("[createQueuedOptimizedWorkerChannel] Failed to create base channel:", e), r.close();
	}), r;
}, Zt = /* @__PURE__ */ new Set([
	"invoke",
	"mail",
	"attach",
	"deliver",
	"defer"
]), Qt = /* @__PURE__ */ new Set([
	"request",
	"response",
	"invoke",
	"ack",
	"act",
	"ask"
]), $t = "mail", Z = (e) => String(e ?? "").trim(), en = (e) => {
	if (!e) return;
	let t = (Array.isArray(e) ? e : [e]).map(Z).filter(Boolean);
	return t.length > 0 ? t : void 0;
}, tn = (e) => {
	if (e != null) return Array.isArray(e) ? e : [e];
}, nn = (e) => {
	if (e != null) return Array.isArray(e) ? e : [e];
}, rn = (e) => {
	let t = Array.isArray(e) ? e : e ? [e] : [$t], n = [];
	for (let e of t) Zt.has(e) && !n.includes(e) && n.push(e);
	return n.length > 0 ? n : [$t];
}, an = (e) => {
	let t = Z(e.type);
	if (Qt.has(t)) return t;
	let n = Z(e.op);
	return n === "get" || n === "set" || n === "apply" || n === "import" ? "invoke" : e.error ? "response" : "request";
}, on = (e, t) => e.op ? e.op : t === "invoke" ? "invoke" : t === "act" ? "deliver" : "mail", sn = (e) => Z(e).toLowerCase() || "unknown", cn = () => typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `uniform_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`, Q = (e) => {
	let t = Number.isFinite(e.timestamp) ? Number(e.timestamp) : Date.now(), n = Z(e.srcChannel ?? e.source) || "uniform", r = Z(e.destination), i = e.dstChannel ?? (r || void 0), a = Z(e.uuid ?? e.id) || cn(), o = an(e), s = e.payload ?? e.data, c = { ...e.metadata ?? {} };
	return {
		purpose: rn(e.purpose),
		protocol: sn(e.protocol),
		redirect: !!e.redirect,
		flags: { ...e.flags ?? {} },
		type: o,
		path: en(e.path),
		result: e.result,
		args: tn(e.args),
		op: on(e, o),
		error: e.error ? String(e.error) : void 0,
		timestamp: t,
		where: Z(e.where) || void 0,
		uuid: a,
		bridges: Array.isArray(e.bridges) ? e.bridges.map(Z).filter(Boolean) : [],
		payload: s,
		transfer: nn(e.transfer),
		extension: e.extension,
		defer: e.defer,
		srcChannel: n,
		dstChannel: i,
		id: a,
		source: n,
		destination: r || void 0,
		data: s,
		contentType: Z(e.contentType) || void 0,
		metadata: c
	};
}, ln = (e) => {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return typeof t.uuid == "string" && typeof t.srcChannel == "string" && Array.isArray(t.purpose) && typeof t.type == "string";
}, $ = (e) => (ln(e), Q(e)), un = class {
	seen = /* @__PURE__ */ new Map();
	windowMs;
	constructor(e = 300) {
		this.windowMs = Math.max(10, e);
	}
	accept(e) {
		let t = Date.now(), n = e.uuid, r = this.seen.get(n);
		return this.prune(t), r && t - r <= this.windowMs ? !1 : (this.seen.set(n, t), !0);
	}
	prune(e) {
		for (let [t, n] of this.seen.entries()) e - n > this.windowMs && this.seen.delete(t);
	}
}, dn = class {
	storageKey;
	maxMessages;
	defaultTTLMs;
	constructor(e) {
		this.storageKey = e?.storageKey ?? "uniform-messaging-pending", this.maxMessages = e?.maxMessages ?? 200, this.defaultTTLMs = e?.defaultTTLMs ?? 864e5;
	}
	read() {
		if (typeof window > "u" || typeof localStorage > "u") return [];
		try {
			let e = localStorage.getItem(this.storageKey);
			if (!e) return [];
			let t = JSON.parse(e);
			return Array.isArray(t) ? t : [];
		} catch {
			return [];
		}
	}
	write(e) {
		if (!(typeof window > "u" || typeof localStorage > "u")) try {
			localStorage.setItem(this.storageKey, JSON.stringify(e));
		} catch {}
	}
	enqueue(e, t) {
		if (!e) return;
		let n = Date.now();
		if ((Number(t?.metadata?.expiresAt) ? Math.max(0, Number(t.metadata.expiresAt) - n) : this.defaultTTLMs) <= 0) return;
		let r = this.read().filter((e) => e && typeof e == "object").filter((e) => (Number(e?.message?.metadata?.expiresAt) || Number(e?.storedAt) + this.defaultTTLMs) > n);
		r.push({
			destination: e,
			message: t,
			storedAt: n
		}), r.length > this.maxMessages && r.splice(0, r.length - this.maxMessages), this.write(r);
	}
	drain(e) {
		if (!e) return [];
		let t = Date.now(), n = this.read(), r = [], i = [];
		for (let a of n) (Number(a?.message?.metadata?.expiresAt) || Number(a?.storedAt) + this.defaultTTLMs) <= t || (a?.destination === e && a?.message ? i.push(a.message) : r.push(a));
		return this.write(r), i;
	}
	has(e) {
		if (!e) return !1;
		let t = Date.now();
		return this.read().some((n) => !n || typeof n != "object" ? !1 : (Number(n?.message?.metadata?.expiresAt) || Number(n?.storedAt) + this.defaultTTLMs) > t && n?.destination === e);
	}
	clear() {
		this.write([]);
	}
}, fn = class {
	handlers = /* @__PURE__ */ new Map();
	channels = /* @__PURE__ */ new Map();
	workerChannels = /* @__PURE__ */ new Map();
	viewChannels = /* @__PURE__ */ new Map();
	pipelines = /* @__PURE__ */ new Map();
	messageQueue;
	pendingStore;
	initializedViews = /* @__PURE__ */ new Set();
	viewReadyPromises = /* @__PURE__ */ new Map();
	executionContext;
	channelMappings;
	componentRegistry = /* @__PURE__ */ new Map();
	replayGuard = new un(300);
	localChannelId = "";
	constructor(e = {}) {
		this.executionContext = $e(), this.localChannelId = `${this.executionContext}:${Math.random().toString(36).slice(2, 10)}`, this.channelMappings = e.channelMappings ?? {}, this.messageQueue = Jt(e.queueOptions), this.pendingStore = new dn(e.pendingStoreOptions), this.setupGlobalListeners();
	}
	registerHandler(e, t) {
		this.handlers.has(e) || this.handlers.set(e, []), this.handlers.get(e).push(t);
	}
	unregisterHandler(e, t) {
		let n = this.handlers.get(e);
		if (n) {
			let e = n.indexOf(t);
			e > -1 && n.splice(e, 1);
		}
	}
	async sendMessage(e) {
		let t = this.toProtocolMessage(e);
		return await this.tryDeliverMessage(t) ? !0 : (t.destination && (this.pendingStore.enqueue(t.destination, t), await this.messageQueue.queueMessage(t.type, t, {
			priority: t.metadata?.priority ?? "normal",
			maxRetries: Number(t.metadata?.maxRetries ?? 3),
			destination: t.destination
		})), !1);
	}
	async processMessage(e) {
		let t = $(e);
		if (!this.replayGuard.accept(t)) return;
		let n = t.destination ?? "general", r = this.handlers.get(n) ?? [];
		for (let e of r) if (e.canHandle(t)) try {
			await e.handle(t);
		} catch (e) {
			console.error(`[UnifiedMessaging] Handler error for ${n}:`, e);
		}
	}
	async tryDeliverMessage(e) {
		let t = $(e);
		if (t.destination && this.handlers.has(t.destination)) return await this.processMessage(t), !0;
		let n = this.getChannelForDestination(t.destination);
		if (n && this.channels.has(n)) {
			let e = this.channels.get(n);
			if (e instanceof BroadcastChannel) try {
				return e.postMessage(t), !0;
			} catch (e) {
				console.warn(`[UnifiedMessaging] Failed to post to broadcast channel ${n}:`, e);
			}
			else if (e && "request" in e) try {
				return await e.request(t.type, [t]), !0;
			} catch (e) {
				console.warn(`[UnifiedMessaging] Failed to post to worker channel ${n}:`, e);
			}
		}
		return !1;
	}
	registerViewChannels(e, t) {
		let n = /* @__PURE__ */ new Set();
		for (let r of t) {
			if (!this.isWorkerSupported(r)) {
				console.log(`[UnifiedMessaging] Skipping worker '${r.name}' in ${this.executionContext} context`);
				continue;
			}
			let t = Xt({
				name: r.name,
				script: r.script,
				options: r.options,
				context: this.resolveWorkerContext()
			}, r.protocolOptions, () => {
				console.log(`[UnifiedMessaging] Channel '${r.name}' ready for view '${e}'`);
			}), i = `${e}:${r.name}`;
			this.workerChannels.set(i, t), this.channels.set(i, t), n.add(r.name);
		}
		this.viewChannels.set(e, n);
	}
	async initializeViewChannels(e) {
		if (this.initializedViews.has(e)) return;
		let t = this.createDeferred();
		this.viewReadyPromises.set(e, t), console.log(`[UnifiedMessaging] Initializing channels for view: ${e}`);
		let n = this.viewChannels.get(e);
		if (!n) {
			t.resolve();
			return;
		}
		let r = [];
		for (let t of n) {
			let n = `${e}:${t}`, i = this.workerChannels.get(n);
			i && r.push(i.request("ping", {}).catch(() => {
				console.log(`[UnifiedMessaging] Channel '${t}' queued for view '${e}'`);
			}));
		}
		await Promise.allSettled(r), this.initializedViews.add(e), t.resolve();
	}
	getWorkerChannel(e, t) {
		return this.workerChannels.get(`${e}:${t}`) ?? null;
	}
	getBroadcastChannel(e) {
		if (!this.channels.has(e)) try {
			let t = new BroadcastChannel(e);
			t.addEventListener("message", (t) => {
				this.handleBroadcastMessage(t.data, e);
			}), this.channels.set(e, t);
		} catch (t) {
			console.warn(`[UnifiedMessaging] BroadcastChannel not available: ${e}`, t), this.channels.set(e, {
				postMessage: () => {},
				close: () => {},
				addEventListener: () => {},
				removeEventListener: () => {}
			});
		}
		return this.channels.get(e);
	}
	async handleBroadcastMessage(e, t) {
		try {
			let n = this.toProtocolMessage(e ?? {}, t);
			if (n.srcChannel === this.localChannelId) return;
			await this.processMessage(n);
		} catch (e) {
			console.error(`[UnifiedMessaging] Error handling broadcast message on ${t}:`, e);
		}
	}
	registerPipeline(e) {
		this.pipelines.set(e.name, e);
	}
	async processThroughPipeline(e, t) {
		let n = this.pipelines.get(e);
		if (!n) throw Error(`Pipeline '${e}' not found`);
		let r = { ...t }, i = n.timeout ?? 3e4;
		for (let t of n.stages) {
			let a = t.timeout ?? i, o = t.retries ?? 0;
			for (let i = 0; i <= o; i++) try {
				r = await Promise.race([t.handler(r), new Promise((e, n) => setTimeout(() => n(/* @__PURE__ */ Error(`Stage '${t.name}' timeout`)), a))]);
				break;
			} catch (a) {
				if (i === o) throw n.errorHandler && n.errorHandler(a, t, r), a;
				console.warn(`[UnifiedMessaging] Pipeline '${e}' stage '${t.name}' attempt ${i + 1} failed:`, a);
			}
		}
		return r;
	}
	async processQueuedMessages(e) {
		let t = await this.messageQueue.getQueuedMessages(e);
		for (let e of t) {
			let t = e.data, n = t && typeof t == "object" && typeof t.type == "string" && typeof t.id == "string" ? this.toProtocolMessage(t) : {
				...this.toProtocolMessage({
					id: e.id,
					type: e.type,
					source: "queue",
					destination: e.destination,
					data: e.data,
					metadata: {
						timestamp: e.timestamp,
						retryCount: e.retryCount,
						maxRetries: e.maxRetries,
						...e.metadata
					}
				}),
				type: e.type
			};
			await this.tryDeliverMessage(n) && await this.messageQueue.removeMessage(e.id);
		}
	}
	registerComponent(e, t) {
		this.componentRegistry.set(e, t), this.processQueuedMessages(t).catch((e) => {
			console.warn(`[UnifiedMessaging] Failed to process queued messages for ${t}:`, e);
		});
	}
	initializeComponent(e) {
		let t = this.componentRegistry.get(e);
		return t ? (this.processQueuedMessages(t).catch((e) => {
			console.warn(`[UnifiedMessaging] Failed to replay queued messages for ${t}:`, e);
		}), this.pendingStore.drain(t)) : [];
	}
	hasPendingMessages(e) {
		return this.pendingStore.has(e);
	}
	enqueuePendingMessage(e, t) {
		let n = String(e ?? "").trim();
		!n || !t || this.pendingStore.enqueue(n, t);
	}
	setChannelMappings(e) {
		this.channelMappings = {
			...this.channelMappings,
			...e
		};
	}
	getChannelForDestination(e) {
		return e ? this.channelMappings[e] ?? null : null;
	}
	detectProtocolName() {
		return this.executionContext === "chrome-extension" ? "chrome" : this.executionContext === "service-worker" ? "service" : this.executionContext === "main" ? "window" : "unknown";
	}
	resolveWorkerContext() {
		if (this.executionContext === "main") return "main";
		if (this.executionContext === "service-worker") return "service-worker";
		if (this.executionContext === "chrome-extension") return "chrome-extension";
	}
	toProtocolMessage(e, t) {
		return Q({
			...e,
			id: e.id,
			type: e.type ?? "unknown",
			source: e.source ?? t ?? this.localChannelId,
			destination: e.destination,
			data: e.data,
			metadata: {
				timestamp: Date.now(),
				...e.metadata ?? {}
			},
			protocol: this.detectProtocolName(),
			purpose: "mail",
			srcChannel: e.source ?? this.localChannelId,
			dstChannel: e.destination
		});
	}
	isWorkerSupported(e) {
		return this.executionContext === "service-worker" || this.executionContext !== "chrome-extension" || et();
	}
	setupGlobalListeners() {
		typeof window < "u" && globalThis.addEventListener("message", (e) => {
			e.data && typeof e.data == "object" && e.data.type && this.handleBroadcastMessage(e.data, "window-message");
		});
	}
	createDeferred() {
		let e, t, n = new Promise((n, r) => {
			e = n, t = r;
		});
		return {
			resolve: e,
			reject: t,
			promise: n
		};
	}
	getExecutionContext() {
		return this.executionContext;
	}
	destroy() {
		for (let e of this.channels.values()) (e instanceof BroadcastChannel || e && "close" in e) && e.close();
		this.channels.clear(), this.workerChannels.clear(), this.handlers.clear(), this.pipelines.clear();
	}
}, pn = null;
function mn(e) {
	return pn ||= new fn(e), pn;
}
//#endregion
export { t as A, ue as B, se as C, ce as D, pe as E, m as F, ie as H, ge as I, ne as L, te as M, de as N, a as O, ee as P, me as R, p as S, c as T, r as V, Se as _, X as a, u as b, we as c, b as d, je as f, Ee as g, be as h, $ as i, n as j, fe as k, Me as l, ke as m, Q as n, Gt as o, Ae as p, ln as r, T as s, mn as t, Te as u, re as v, ye as w, h as x, o as y, he as z };
