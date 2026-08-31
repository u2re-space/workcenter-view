import { r as e } from "./rolldown-runtime-CEFd7nDs.js";
import { a as t, o as n } from "./src-CsRMoM8y.js";
//#region ../../projects/core.ts/src/utils/UserPath.ts
var r = (e) => {
	let t = String(e ?? "").trim();
	return t ? (t.startsWith("/") ? t : `/${t}`).replace(/\/+/g, "/") : "/";
}, i = (e) => {
	let t = r(e);
	return t === "/user" || t.startsWith("/user/");
}, a = (e) => {
	let t = r(e);
	return t === "/user" ? "/" : t.startsWith("/user/") ? t.slice(5) || "/" : t;
}, o = (e) => {
	let t = r(e), n = a(t);
	return i(t) ? Array.from(/* @__PURE__ */ new Set([n, t])) : [n];
};
//#endregion
//#region ../../projects/lur.e/src/utils/opfs/OPFS.uniform.worker.ts?worker
function s(e) {
	return new Worker("/assets/OPFS.uniform.worker-CbY5h2V6.js", { name: e?.name });
}
//#endregion
//#region ../../projects/lur.e/src/utils/opfs/OPFS.ts
var c = /* @__PURE__ */ e({
	copyFromOneHandlerToAnother: () => F,
	currentHandleMap: () => x,
	defaultLogger: () => O,
	directHandlers: () => v,
	ensureWorker: () => _,
	getDirectoryHandle: () => A,
	ghostImage: () => P,
	handleError: () => D,
	hasFileExtension: () => k,
	mappedRoots: () => b,
	normalizePath: () => T,
	post: () => y,
	readFile: () => j,
	registerDirectoryRoot: () => S,
	removeFile: () => N,
	resolvePath: () => E,
	resolveRootHandle: () => w,
	unregisterDirectoryRoot: () => C,
	writeFile: () => M
}), l = null, u = typeof ServiceWorkerGlobalScope < "u" && self instanceof ServiceWorkerGlobalScope, d = "opfs-sw-bridge-v1", f = null, p = null, m = 0, h = () => {
	if (!u) return null;
	if (p) return p;
	try {
		return typeof BroadcastChannel > "u" ? null : (p = new BroadcastChannel(d), p);
	} catch {
		return null;
	}
}, g = (e, t = {}, n = 2500) => {
	let r = h();
	if (!r) return Promise.reject(/* @__PURE__ */ Error("SW OPFS bridge is unavailable"));
	let i = `sw-opfs-${Date.now()}-${++m}`;
	return new Promise((a, o) => {
		let s = null, c = (e) => {
			let t = e?.data || {};
			!t || typeof t != "object" || t?.type === "opfs-sw-response" && String(t?.requestId || "") === i && (r.removeEventListener("message", c), s && clearTimeout(s), t?.ok ? a(t?.result) : o(Error(String(t?.error || "Unknown bridge error"))));
		};
		r.addEventListener("message", c), s = setTimeout(() => {
			r.removeEventListener("message", c), o(/* @__PURE__ */ Error("SW OPFS bridge timeout"));
		}, n), r.postMessage({
			type: "opfs-sw-request",
			requestId: i,
			action: e,
			payload: t
		});
	});
}, _ = () => f || (f = new Promise(async (e) => {
	if (typeof Worker < "u" && !u) try {
		let r = await t({
			name: "opfs-worker",
			script: s
		});
		l = new n("opfs-worker", async () => r, {
			timeout: 3e4,
			retries: 3,
			batching: !0,
			compression: !1
		}), e(l);
	} catch (t) {
		console.warn("OPFSUniformWorker instantiation failed, falling back to main thread...", t), l = null, e(null);
	}
	else l = null, e(null);
}), f), v = {
	readDirectory: async ({ rootId: e, path: t, create: n }) => {
		try {
			let e = await navigator.storage.getDirectory(), r = (t || "").trim().replace(/\/+/g, "/").split("/").filter((e) => e), i = e;
			for (let e of r) i = await i.getDirectoryHandle(e, { create: n });
			let a = [];
			for await (let [e, t] of i.entries()) a.push([e, t]);
			return a;
		} catch (e) {
			return console.warn("Direct readDirectory error:", e), [];
		}
	},
	readFile: async ({ rootId: e, path: t, type: n }) => {
		try {
			let e = await navigator.storage.getDirectory(), r = (t || "").trim().replace(/\/+/g, "/").split("/").filter((e) => e), i = r.pop(), a = e;
			for (let e of r) a = await a.getDirectoryHandle(e, { create: !1 });
			let o = await (await a.getFileHandle(i, { create: !1 })).getFile();
			return n === "text" ? await o.text() : n === "arrayBuffer" ? await o.arrayBuffer() : o;
		} catch (e) {
			return console.warn("Direct readFile error:", e), null;
		}
	},
	writeFile: async ({ rootId: e, path: t, data: n }) => {
		try {
			let e = await navigator.storage.getDirectory(), r = (t || "").trim().replace(/\/+/g, "/").split("/").filter((e) => e), i = r.pop(), a = e;
			for (let e of r) a = await a.getDirectoryHandle(e, { create: !0 });
			let o = await (await a.getFileHandle(i, { create: !0 })).createWritable();
			return await o.write(n), await o.close(), !0;
		} catch (e) {
			return console.warn("Direct writeFile error:", e), !1;
		}
	},
	remove: async ({ rootId: e, path: t, recursive: n }) => {
		try {
			let e = await navigator.storage.getDirectory(), r = (t || "").trim().replace(/\/+/g, "/").split("/").filter((e) => e), i = r.pop(), a = e;
			for (let e of r) a = await a.getDirectoryHandle(e, { create: !1 });
			return await a.removeEntry(i, { recursive: n }), !0;
		} catch {
			return !1;
		}
	},
	copy: async ({ from: e, to: t }) => {
		try {
			let n = async (e, t) => {
				if (e.kind === "directory") for await (let [r, i] of e.entries()) if (i.kind === "directory") {
					let e = await t.getDirectoryHandle(r, { create: !0 });
					await n(i, e);
				} else {
					let e = await i.getFile(), n = await (await t.getFileHandle(r, { create: !0 })).createWritable();
					await n.write(e), await n.close();
				}
				else {
					let n = await e.getFile(), r = await t.createWritable();
					await r.write(n), await r.close();
				}
			};
			return await n(e, t), !0;
		} catch (e) {
			return console.warn("Direct copy error:", e), !1;
		}
	},
	observe: async () => !1,
	unobserve: async () => !0,
	mount: async () => !0,
	unmount: async () => !0
}, y = (e, t = {}, n = []) => u && v[e] ? g(e, t).catch(() => v[e](t)) : new Promise(async (n, r) => {
	try {
		let i = await _();
		if (!i) return v[e] ? n(v[e](t)) : r(/* @__PURE__ */ Error("No worker channel available"));
		let a;
		try {
			a = await i.request(e, t);
		} catch (r) {
			if (v[e]) return n(v[e](t));
			throw r;
		}
		if (a === !1 && (e === "writeFile" || e === "remove" || e === "copy") && v[e]) return n(v[e](t));
		n(a);
	} catch (i) {
		if (v[e]) try {
			return n(v[e](t));
		} catch (e) {
			return r(e);
		}
		r(i);
	}
}), b = /* @__PURE__ */ new Map([
	["/", async () => await navigator?.storage?.getDirectory?.()],
	["/user/", async () => await navigator?.storage?.getDirectory?.()],
	["/assets/", async () => (console.warn("Backend related API not implemented!"), null)]
]), x = /* @__PURE__ */ new Map(), S = (e, t) => {
	if (!t) return;
	let n = String(e || "").endsWith("/") ? String(e) : `${e}/`;
	if (!n.startsWith("/")) return;
	b.set(n, async () => t);
	let r = n.split("/").filter(Boolean);
	r[0] === "mounts" && r[1] && x.set(r[1], t), x.set(n, t);
}, C = (e) => {
	let t = String(e || "").endsWith("/") ? String(e) : `${e}/`;
	b.delete(t), x.delete(t);
	let n = t.split("/").filter(Boolean);
	n[0] === "mounts" && n[1] && x.delete(n[1]);
};
async function w(e, t = "") {
	(e == null || e == null || e?.trim?.()?.length == 0) && (e = "/user/");
	let n = typeof e == "string" ? e?.trim?.()?.replace?.(/^\//, "")?.trim?.()?.split?.("/")?.filter?.((e) => !!e?.trim?.())?.at?.(0) : null;
	if (n && (typeof localStorage < "u" && JSON.parse(localStorage?.getItem?.("opfs.mounted") || "[]").includes(n) && (e = x?.get(n)), e ||= await b?.get?.(`/${n}/`)?.() ?? await navigator.storage.getDirectory()), e instanceof FileSystemDirectoryHandle) return e;
	let r = t?.trim?.() || "/", i = r.startsWith("/") ? r : "/" + r, a = null, o = 0;
	for (let [e, t] of b.entries()) i.startsWith(e) && e.length > o && (a = t, o = e.length);
	try {
		return (a ? await a() : null) || await navigator?.storage?.getDirectory?.();
	} catch (e) {
		return console.warn("Failed to resolve root handle, falling back to OPFS root:", e), await navigator?.storage?.getDirectory?.();
	}
}
function T(e = "", t) {
	if (!t?.trim()) return e;
	let n = t.trim();
	if (n.startsWith("/")) return n;
	let r = e.split("/").filter((e) => e?.trim()), i = n.split("/").filter((e) => e?.trim());
	for (let e of i) if (e === ".") continue;
	else e === ".." ? r.length > 0 && r.pop() : r.push(e);
	return "/" + r.join("/");
}
async function E(e, t, n = "") {
	let r = T(n, t);
	return {
		rootHandle: await w(e, r),
		resolvedPath: r
	};
}
function D(e, t, n) {
	return e?.(t, n), null;
}
function O(e, t) {
	console.trace(`[${e}] ${t}`);
}
var k = (e) => e?.trim?.()?.split?.(".")?.[1]?.trim?.()?.length > 0;
async function A(e, t, { create: n = !1, basePath: r = "" } = {}, i = O) {
	try {
		let { rootHandle: i, resolvedPath: o } = await E(e, t, r), s = a(o).split("/").filter((e) => !!e?.trim?.());
		s.length > 0 && k(s[s.length - 1]?.trim?.()) && s?.pop?.();
		let c = i;
		if (s?.length > 0) {
			for (let e of s) if (c = await c?.getDirectoryHandle?.(e, { create: n }), !c) break;
		}
		return c;
	} catch (e) {
		return D(i, "error", `getDirectoryHandle: ${e.message}`);
	}
}
async function j(e, t, n = {}, r = O) {
	try {
		let { rootHandle: r, resolvedPath: i } = await E(e, t, n?.basePath || "");
		return await y("readFile", {
			rootId: "",
			path: a(i),
			type: "blob"
		}, r ? [r] : []);
	} catch (e) {
		return D(r, "error", `readFile: ${e.message}`);
	}
}
async function M(e, t, n, r = O) {
	if (n instanceof FileSystemFileHandle && (n = await n.getFile()), n instanceof FileSystemDirectoryHandle) {
		let r = await A(await w(e), t + (t?.trim?.()?.endsWith?.("/") ? "" : "/") + (n?.name || "")?.trim?.()?.replace?.(/\s+/g, "-"), { create: !0 });
		return await F(n, r, {})?.catch?.(console.warn.bind(console));
	}
	try {
		let { rootHandle: r, resolvedPath: i } = await E(e, t, "");
		return await y("writeFile", {
			rootId: "",
			path: a(i),
			data: n
		}, r ? [r] : []) !== !1;
	} catch (e) {
		return D(r, "error", `writeFile: ${e.message}`);
	}
}
async function N(e, t, n = { recursive: !0 }, r = O) {
	try {
		let { rootHandle: r, resolvedPath: i } = await E(e, t, n?.basePath || ""), a = o(i), s = !1;
		for (let e of a) if (s = await y("remove", {
			rootId: "",
			path: e,
			recursive: n.recursive
		}, r ? [r] : []), s !== !1) return !0;
		return s !== !1;
	} catch (e) {
		return D(r, "error", `removeFile: ${e.message}`);
	}
}
var P = typeof Image < "u" ? new Image() : null;
if (P) {
	P.decoding = "async", P.width = 24, P.height = 24;
	try {
		P.src = URL.createObjectURL(new Blob(["<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 384 512\"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d=\"M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z\"/></svg>"], { type: "image/svg+xml" }));
	} catch {}
}
var F = async (e, t, n = {}, r = O) => y("copy", {
	from: e,
	to: t
}, [e, t]);
//#endregion
export { E as _, v as a, M as b, P as c, b as d, T as f, N as g, S as h, O as i, D as l, j as m, F as n, _ as o, y as p, x as r, A as s, c as t, k as u, w as v, C as y };
