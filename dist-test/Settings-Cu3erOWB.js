import { r as e } from "./rolldown-runtime-CEFd7nDs.js";
import { n as t, o as n } from "./src-pANWMrys.js";
import { i as r, n as i, r as a } from "./src-CsRMoM8y.js";
import { t as o } from "./UniformInterop-BbBJGEwJ.js";
import { getAirpadMotionRateController as s, motionIntervalMsForHz as c } from "cwsp-shared/airpad-motion-adaptive";
import "cwsp-shared/transport-credential-bridge";
//#region ../../projects/subsystem/src/other/config/ecosystem-skus.ts
var l = {
	launcher: {
		sku: "launcher",
		androidPackage: "space.u2re.cw",
		scheme: "space.u2re.cw",
		phosphorIcon: "cross",
		defaultView: "home",
		shell: "environment",
		apkManifest: "latest-launcher.json",
		apkName: "cwsp-launcher.apk"
	},
	transfer: {
		sku: "transfer",
		androidPackage: "space.u2re.cwsp",
		scheme: "space.u2re.cwsp",
		phosphorIcon: "drone",
		defaultView: "network",
		shell: "minimal",
		apkManifest: "latest.json",
		apkName: "cwsp.apk"
	},
	explorer: {
		sku: "explorer",
		androidPackage: "space.u2re.explorer",
		scheme: "space.u2re.explorer",
		phosphorIcon: "folder",
		defaultView: "explorer",
		shell: "minimal",
		apkManifest: "latest-explorer.json",
		apkName: "cwsp-explorer.apk"
	},
	document: {
		sku: "document",
		androidPackage: "space.u2re.document",
		scheme: "space.u2re.document",
		phosphorIcon: "books",
		defaultView: "viewer",
		shell: "minimal",
		apkManifest: "latest-document.json",
		apkName: "cwsp-document.apk"
	},
	process: {
		sku: "process",
		androidPackage: "space.u2re.process",
		scheme: "space.u2re.process",
		phosphorIcon: "magic-wand",
		defaultView: "workcenter",
		shell: "minimal",
		apkManifest: "latest-process.json",
		apkName: "cwsp-process.apk"
	},
	crx: {
		sku: "crx",
		androidPackage: null,
		scheme: "chrome-extension",
		phosphorIcon: "cross",
		defaultView: "home",
		shell: "environment",
		apkManifest: "",
		apkName: ""
	}
}, u = new Set(Object.keys(l)), d = {
	explorer: "explorer",
	viewer: "document",
	editor: "document",
	markdown: "document",
	print: "document",
	workcenter: "process",
	network: "transfer"
}, f = (e) => typeof e == "string" && u.has(e), p = () => {
	try {
		let e = String(document.documentElement?.dataset?.cwspSku || "").trim().toLowerCase();
		return f(e) ? e : "";
	} catch {
		return "";
	}
}, m = (e) => {
	try {
		document.documentElement.dataset.cwspSku = e;
		let t = l[e];
		t.defaultView && !document.documentElement.dataset.cwspDefaultView && (document.documentElement.dataset.cwspDefaultView = t.defaultView);
	} catch {}
}, h = (e) => d[String(e || "").trim().toLowerCase()] || null, g = ["u2re.space", "www.u2re.space"], _ = {
	document: ["md.u2re.space", "www.md.u2re.space"],
	explorer: ["explorer.u2re.space", "www.explorer.u2re.space"],
	process: ["process.u2re.space", "workcenter.u2re.space"],
	transfer: [
		"cwsp.u2re.space",
		"www.cwsp.u2re.space",
		"transfer.u2re.space"
	]
}, v = {
	document: [
		"markdown",
		"document",
		"viewer"
	],
	explorer: [
		"explorer",
		"files",
		"fm"
	],
	process: ["workcenter", "process"],
	transfer: ["cwsp", "transfer"]
}, ee = {
	launcher: [],
	crx: [],
	document: [
		"viewer",
		"editor",
		"print",
		"settings",
		"history"
	],
	explorer: [
		"explorer",
		"settings",
		"history"
	],
	process: [
		"workcenter",
		"settings",
		"history"
	],
	transfer: [
		"network",
		"settings",
		"history"
	]
}, te = () => {
	try {
		return String(globalThis.location?.hostname || "").toLowerCase();
	} catch {
		return "";
	}
}, ne = () => {
	try {
		return (String(globalThis.location?.pathname || "/").split("?")[0] || "/").split("/").filter(Boolean)[0]?.toLowerCase() || "";
	} catch {
		return "";
	}
}, re = (e) => e === "localhost" || e === "127.0.0.1" || e === "::1" || /^\d{1,3}(\.\d{1,3}){3}$/.test(e), ie = (e) => {
	let t = String(e || te()).toLowerCase();
	return g.includes(t);
}, ae = (e) => {
	let t = String(e || "").trim().toLowerCase();
	if (!t) return "";
	for (let e of Object.keys(v)) if (v[e].includes(t)) return e;
	return "";
}, oe = () => {
	let e = p();
	if (e) return e;
	let t = te();
	for (let e of Object.keys(_)) if (_[e].includes(t)) return e;
	return ae(ne()) || (ie(t) || re(t) ? "launcher" : "");
}, se = () => {
	let e = oe();
	return e && m(e), e;
}, ce = (e) => {
	let t = String(e || "").trim().toLowerCase();
	return t === "markdown" || t === "document" || t === "md" ? "viewer" : t === "process" ? "workcenter" : t === "files" || t === "fm" ? "explorer" : t === "transfer" ? "network" : t;
}, le = (e, t = oe()) => {
	let n = ce(e);
	if (!n) return !1;
	if (!t || t === "launcher" || t === "crx") return !0;
	let r = ee[t];
	return !r.length || r.includes(n);
}, ue = () => {
	try {
		let e = globalThis, t = e.Capacitor?.getPlatform?.();
		return !!(e.Capacitor?.isNativePlatform?.() || t === "android" || t === "ios" || e.__CWS_NATIVE__ === !0);
	} catch {
		return !1;
	}
}, de = (e) => {
	let t = ce(e), n = h(t);
	if (!n) return !1;
	let r = oe();
	return !(r === "crx" || (!r || r === "launcher") && !ue() || r === n || r && r !== "launcher" && r !== "crx" && le(t, r));
}, fe = "cwsp-sku-handoff", pe = (e) => {
	let t = JSON.stringify({
		...e,
		ts: Date.now()
	});
	try {
		globalThis.sessionStorage?.setItem?.(fe, t);
	} catch {}
	try {
		globalThis.localStorage?.setItem?.(fe, t);
	} catch {}
}, me = (...e) => {
	try {
		let t = globalThis.sessionStorage?.getItem?.("cwsp-sku-handoff") || globalThis.localStorage?.getItem?.("cwsp-sku-handoff");
		if (!t) return null;
		let n = JSON.parse(t), r = ce(String(n.dest || ""));
		return e.length && r && !e.some((e) => ce(e) === r) ? null : (globalThis.sessionStorage?.removeItem?.(fe), globalThis.localStorage?.removeItem?.(fe), n);
	} catch {
		return null;
	}
};
try {
	se();
} catch {}
//#endregion
//#region ../../projects/core.ts/src/utils/PromiseUtils.ts
function he(e, t, n = "Operation timed out") {
	let r = new Promise((e, r) => {
		setTimeout(() => r(Error(n)), t);
	});
	return Promise.race([e, r]);
}
//#endregion
//#region ../../projects/subsystem/src/other/config/settings-host.ts
var ge = [
	"capacitor",
	"crx",
	"pwa",
	"web"
], _e = () => {
	try {
		let e = String(globalThis.location?.protocol || "").toLowerCase();
		return e === "chrome-extension:" || e === "moz-extension:" || !!globalThis.chrome?.runtime?.id;
	} catch {
		return !1;
	}
}, ve = () => {
	try {
		return String(document.documentElement?.dataset?.cwspSurface || "").toLowerCase().includes("pwa") ? !0 : !!(globalThis.matchMedia?.("(display-mode: standalone)").matches || globalThis.navigator.standalone === !0);
	} catch {
		return !1;
	}
}, ye = () => ue() ? "capacitor" : _e() ? "crx" : ve() ? "pwa" : "web", be = [
	"markdown",
	"text",
	"document",
	"image",
	"url",
	"other"
], xe = [
	"ask",
	"display",
	"viewer",
	"document",
	"explorer",
	"workcenter",
	"transfer",
	"wallpaper",
	"external",
	"system"
], Se = [
	"open",
	"dblclick",
	"share-target",
	"launch-queue",
	"snip",
	"capacitor"
], Ce = [
	"viewer",
	"explorer",
	"shell",
	"crx",
	"process",
	"transfer"
], we = [
	"inline",
	"native-window",
	"new-tab"
];
new Set(be);
var Te = new Set(xe);
new Set(Se), new Set(Ce);
var Ee = {
	viewer: {
		channels: {
			open: "display",
			"share-target": "display",
			"launch-queue": "display",
			capacitor: "display"
		},
		kinds: {
			markdown: "display",
			text: "display",
			document: "display",
			image: "display",
			url: "display",
			other: "display"
		}
	},
	explorer: {
		channels: {
			open: "viewer",
			dblclick: "viewer",
			"share-target": "viewer",
			"launch-queue": "viewer",
			capacitor: "document"
		},
		placement: "inline",
		kinds: {
			markdown: "ask",
			text: "ask",
			document: "ask",
			image: "ask",
			url: "ask",
			other: "ask"
		},
		nativeOpen: "document",
		nativeKinds: {
			markdown: "ask",
			text: "ask",
			document: "ask",
			image: "ask",
			url: "ask",
			other: "ask"
		}
	},
	shell: {
		channels: {
			open: "ask",
			"share-target": "ask",
			"launch-queue": "ask",
			capacitor: "ask"
		},
		kinds: {
			markdown: "ask",
			text: "ask",
			document: "ask",
			image: "wallpaper",
			url: "ask",
			other: "ask"
		}
	},
	crx: {
		channels: {
			open: "ask",
			snip: "workcenter",
			"share-target": "ask"
		},
		kinds: {
			markdown: "viewer",
			text: "viewer",
			document: "viewer",
			image: "workcenter",
			url: "workcenter",
			other: "workcenter"
		}
	},
	process: {
		channels: {
			open: "workcenter",
			"share-target": "workcenter",
			"launch-queue": "workcenter",
			capacitor: "workcenter"
		},
		kinds: {
			markdown: "workcenter",
			text: "workcenter",
			document: "workcenter",
			image: "workcenter",
			url: "workcenter",
			other: "workcenter"
		}
	},
	transfer: {
		channels: {
			open: "ask",
			"share-target": "ask",
			"launch-queue": "ask",
			capacitor: "ask"
		},
		kinds: {
			markdown: "ask",
			text: "ask",
			document: "ask",
			image: "ask",
			url: "ask",
			other: "ask"
		}
	}
}, De = Ee, Oe = (e, t = "ask") => {
	let n = String(e || "").trim().toLowerCase();
	return n ? n === "markdown" || n === "in-shell" || n === "in-app" ? "viewer" : n === "document" || n === "cwsp-document" || n === "md" ? "document" : n === "process" || n === "cwsp-process" ? "workcenter" : n === "transfer" || n === "cwsp" || n === "cwsp-transfer" || n === "network" ? "transfer" : n === "wallpaper" || n === "обои" || n === "backdrop" || n === "desktop" ? "wallpaper" : n === "android" || n === "chooser" || n === "open-with" ? "system" : n === "browser" || n === "new-tab" || n === "tab" ? "external" : Te.has(n) ? n : t : t;
}, ke = (e, t = "inline") => {
	let n = String(e || "").trim().toLowerCase();
	return n ? n === "in-shell" || n === "env" || n === "shell" || n === "iframe" ? "inline" : n === "native" || n === "popup" || n === "app-window" || n === "detached" || n === "separate" ? "native-window" : n === "tab" || n === "browser" || n === "as-is" || n === "browser-tab" ? "new-tab" : we.includes(n) ? n : t : t;
}, Ae = (e) => {
	let t = {};
	if (!e || typeof e != "object") return t;
	for (let n of be) {
		let r = e[n];
		r != null && r !== "" && (t[n] = Oe(r));
	}
	return t;
}, je = (e) => {
	let t = {};
	if (!e || typeof e != "object") return t;
	for (let n of Se) {
		let r = e[n];
		r != null && r !== "" && (t[n] = Oe(r));
	}
	return t;
}, y = (...e) => {
	let t = {};
	for (let n of Ce) {
		let r = Ee[n] || {}, i = { ...r.channels || {} }, a = { ...r.kinds || {} }, o = ke(r.placement, "inline"), s = Oe(r.nativeOpen, n === "explorer" ? "document" : "ask"), c = { ...r.nativeKinds || {} }, l = !1;
		for (let t of e) {
			let e = t?.[n];
			e && (i = {
				...i,
				...je(e.channels)
			}, a = {
				...a,
				...Ae(e.kinds)
			}, e.placement != null && e.placement !== "" && (o = ke(e.placement, o)), e.nativeOpen != null && e.nativeOpen !== "" && (l = !0, s = Oe(e.nativeOpen, s)), e.nativeKinds && (c = {
				...c,
				...Ae(e.nativeKinds)
			}));
		}
		if (!l && n === "explorer") {
			let e = i.open;
			(e === "system" || e === "transfer" || e === "workcenter") && (s = e);
		}
		t[n] = n === "explorer" ? {
			channels: i,
			kinds: a,
			placement: o,
			nativeOpen: s,
			nativeKinds: c
		} : {
			channels: i,
			kinds: a,
			placement: o
		};
	}
	return t;
}, b = (...e) => {
	let t = {};
	for (let n of ge) {
		let r = e.map((e) => e?.[n]).filter((e) => !!e);
		r.length && (t[n] = y(...r));
	}
	return t;
}, Me = (e) => {
	let t = ye();
	return y(e?.openPolicy, e?.openPolicyByHost?.[t]);
}, Ne = (e) => (De = Me(e), De), x = {
	core: {
		mode: "native",
		endpointUrl: "https://localhost:8434",
		userId: "",
		ecosystemToken: "",
		userKey: "",
		encrypt: !1,
		preferBackendSync: !0,
		ntpEnabled: !0,
		appClientId: "",
		useCoreIdentityForAirPad: !0,
		allowInsecureTls: !1,
		network: {
			listenPortHttps: 8434,
			listenPortHttp: 8080,
			bridgeEnabled: !0,
			reconnectMs: 3e3,
			destinations: []
		},
		socket: {
			protocol: "auto",
			routeTarget: "",
			selfId: "",
			accessToken: "",
			clientAccessToken: "",
			allowAccessTokenWithoutUserKey: !1,
			transportMode: "plaintext",
			transportSecret: "",
			signingSecret: "",
			connectionType: "",
			archetype: "",
			protocolLanesJson: ""
		},
		interop: {
			ipcProtocol: "uniform",
			platformInterop: !0,
			preferNativeIpc: !0,
			preferNativeWebsocket: !0
		},
		admin: {
			httpsOrigin: "https://localhost:8434",
			httpOrigin: "https://localhost:8080",
			path: "/"
		},
		ops: {
			allowUnencrypted: !1,
			directUrl: "",
			httpTargets: [],
			wsTargets: [],
			syncTargets: []
		}
	},
	shell: {
		localHubUrl: "",
		preferNativeWebsocket: !0,
		maintainHubSocketConnection: !1,
		enableRemoteClipboardBridge: !0,
		applyRemoteClipboardToDevice: !0,
		pushLocalClipboardToLan: !1,
		clipboardPushIntervalMs: 2e3,
		clipboardBroadcastTargets: "",
		enableNativeSms: !1,
		enableNativeContacts: !0,
		acceptInboundClipboardData: !0,
		clipboardInboundAllowIds: "",
		clipboardShareDestinationIds: "",
		accessTokenBypassesClipboardAllowlist: !1,
		acceptContactsBridgeData: !1,
		acceptSmsBridgeData: !1,
		autoStartOnBoot: !0,
		bridgeDaemonEnabled: !0,
		allowControlApi: !1,
		clipboardOutboundMode: "ask",
		clipboardInboundMode: "ask",
		clipboardOutboundShowErase: !0,
		clipboardInboundShowUndo: !0,
		clipboardPromptDismissMs: 1e4,
		filesShareDestinationIds: "",
		filesAllowShareToAll: !1,
		filesOpenForShareMode: "auto",
		filesInboundMode: "ask",
		filesByteTransport: "auto",
		filesLandingMode: "app",
		filesIncomingDir: "",
		filesAskDirEveryTime: !0,
		filesStagingRoot: "app",
		acceptInboundFilesData: !0
	},
	ai: {
		apiKey: "",
		baseUrl: "",
		model: "gpt-5.2",
		customModel: "",
		defaultReasoningEffort: "medium",
		defaultVerbosity: "medium",
		maxOutputTokens: 4e5,
		contextTruncation: "disabled",
		promptCacheRetention: "in-memory",
		maxToolCalls: 8,
		parallelToolCalls: !0,
		mcp: [],
		shareTargetMode: "recognize",
		autoProcessShared: !0,
		customInstructions: [],
		activeInstructionId: "",
		responseLanguage: "auto",
		translateResults: !1,
		generateSvgGraphics: !1,
		requestTimeout: {
			low: 60,
			medium: 300,
			high: 900
		},
		maxRetries: 2
	},
	webdav: {
		url: "https://localhost:8434",
		username: "",
		password: "",
		token: ""
	},
	timeline: { source: "" },
	appearance: {
		theme: "auto",
		fontSize: "medium",
		color: "",
		colorSource: "auto",
		markdown: {
			customCss: "",
			printCss: "",
			extensions: [],
			preset: "default",
			fontFamily: "system",
			fontSizePx: 16,
			lineHeight: 1.7,
			contentMaxWidthPx: 860,
			printScale: 1,
			page: {
				size: "auto",
				orientation: "portrait",
				marginMm: 12
			},
			modules: {
				typography: !0,
				lists: !0,
				tables: !0,
				codeBlocks: !0,
				blockquotes: !0,
				media: !0,
				printBreaks: !0
			},
			plugins: {
				smartTypography: !1,
				softBreaksAsBr: !1,
				externalLinksNewTab: !0
			}
		}
	},
	speech: { language: (() => {
		let e = "en-US";
		if (typeof navigator > "u") return e;
		let t = (navigator.language || "").trim();
		return t === "ru" || t.startsWith("ru-") ? "ru" : t === "en-GB" ? "en-GB" : t === "en-US" ? "en-US" : t === "en" || t.startsWith("en-") ? "en" : e;
	})() },
	grid: {
		columns: 4,
		rows: 8,
		shape: "squircle",
		defaultAction: "open-link",
		defaultOpenLinkTarget: "inline",
		iconScale: "fill"
	},
	openPolicy: Ee,
	openPolicyByHost: {},
	appMenu: {
		sortBy: "name",
		sortDir: "asc"
	},
	explorer: {
		sortBy: "name",
		sortDir: "asc",
		foldersFirst: !0
	}
}, Pe = (e) => {
	let t = e?.core;
	return t ? String(t.ecosystemToken || "").trim() || String(t.userKey || "").trim() || String(t.socket?.accessToken || t.socket?.airpadAuthToken || "").trim() : "";
}, Fe = (e) => {
	e.core ||= {};
	let t = Pe(e);
	return e.core.ecosystemToken = t, e.core.userKey = t, e.core.socket = {
		...e.core.socket || {},
		accessToken: t
	}, t;
}, Ie = /[,;\s]+/, Le = (e) => {
	if (e == null) return [];
	if (Array.isArray(e)) return e.flatMap((e) => Le(e));
	let t = String(e).trim();
	return t ? t.split(Ie).map((e) => e.trim()).filter(Boolean) : [];
}, Re = [
	8434,
	9443,
	7443,
	8444,
	8445,
	18443
], ze = [
	8080,
	8081,
	8082,
	18080,
	80,
	8888
], S = (e) => typeof e == "string" ? e.trim() : "", Be = (e) => /^\d{1,5}$/.test(e), Ve = (e) => S(e).replace(/^[a-z][a-z0-9+.-]*:\/\//i, "").split("/")[0], C = (e) => {
	let t = S(e).replace(/\/+$/, "");
	return !!(!t || /^https?:$/i.test(t) || /^https?$/i.test(t) || /^https?:\/\/https?:?:?\d*$/i.test(t));
}, He = (e) => {
	let t = S(e);
	return !t || C(t) ? !1 : !!(/^[a-z][a-z0-9+.-]*:\/\//i.test(t) || t.startsWith("localhost") || t.includes("/") || /^\[[0-9a-f:]+\](?::\d{1,5})?$/i.test(t) || /^\d{1,3}(?:\.\d{1,3}){3}(?::\d{1,5})?$/.test(t) || /^[^.\s:]+:\d{1,5}$/.test(t) || /^[a-z0-9-]+(?:\.[a-z0-9-]+)+(?::\d{1,5})?$/i.test(t));
}, w = (e) => {
	let t = S(e);
	if (!t) return null;
	if (/[,;\s]/.test(t) && /:\/\//.test(t)) {
		let e = Le(t)[0];
		if (!(!e || e === t)) return w(e);
	}
	if (C(t)) return null;
	let n, r = t, i = t.match(/^([a-z][a-z0-9+.-]*):\/\//i);
	if (i) {
		let e = i[1].toLowerCase();
		(e === "http" || e === "https") && (n = e), r = Ve(t);
	}
	if (r = r.split("/")[0]?.trim() || "", !r || C(r) || /;https?:?$/i.test(r) || /https?:$/i.test(r)) return null;
	let a = r.lastIndexOf(":");
	if (a > 0) {
		let e = r.slice(0, a).trim(), i = r.slice(a + 1).trim();
		if (e && Be(i) && !/^https?:?$/i.test(e)) return {
			raw: t,
			host: e,
			port: i,
			protocol: n
		};
	}
	return /^https?:?$/i.test(r) ? null : {
		raw: t,
		host: r,
		protocol: n
	};
}, Ue = (e) => {
	let t = w(e);
	if (!t) return "";
	let { host: n, port: r, protocol: i } = t;
	return n ? r ? `${i || (Re.some((e) => String(e) === r) ? "https" : ze.some((e) => String(e) === r) ? "http" : "https")}://${n}:${r}/` : i ? `${i}://${n}/` : n : "";
}, T = (e, t, n) => `${e}://${t}:${n}/`, We = "45.147.121.152", Ge = "https://192.168.0.200:8434", Ke = `https://${We}:8434`;
`${Ge}`, `${Ke}`;
var qe = (...e) => {
	try {
		let t = globalThis.process?.env;
		if (!t) return "";
		for (let n of e) {
			let e = String(t[n] || "").trim();
			if (e) return e;
		}
	} catch {}
	return "";
}, Je = (e) => {
	let t = et(E(String(e ?? ""))[0] || String(e ?? ""));
	if (!t) return "";
	try {
		let e = /:\/\//.test(t) ? t : `https://${t}`;
		return new URL(e).hostname.toLowerCase();
	} catch {
		return "";
	}
}, Ye = (e) => {
	let t = String(e ?? "").trim().toLowerCase();
	return t === "192.168.0.200" || t === "l-192.168.0.200" || t === "l-200";
}, Xe = (e = {}) => {
	let t = qe("CWS_FILES_PUBLIC_WAN_BASE_URL", "CWS_GATEWAY_WAN_BASE_URL", "CWSP_GATEWAY_WAN_URL", "CWS_RELAY_HTTPS_URL", "CWSP_RELAY_HTTPS_URL"), n = [
		e.wanBaseUrl,
		t,
		e.relay,
		e.hubUrl,
		e.endpointUrl,
		e.remoteHost,
		...e.extras ?? []
	];
	for (let e of n) {
		let t = et(String(e ?? ""));
		if (!t) continue;
		let n = Je(t);
		if (!(!n || Ye(n))) return t.replace(/\/+$/, "");
	}
	return Ke;
}, Ze = (e = {}) => Je(Xe(e)) || "45.147.121.152", Qe = (e, t = {}) => {
	let n = String(e ?? "").trim().toLowerCase();
	if (!n) return !1;
	if (n === "45.147.121.152") return !0;
	let r = Ze(t).toLowerCase();
	return !!r && n === r;
}, $e = (e, t = {}) => {
	let n = String(e ?? "").toLowerCase();
	if (n.includes("gateway")) return !0;
	let r = Je(e);
	return r ? Ye(r) || Qe(r, t) : n.includes("192.168.0.200") || n.includes("45.147.121.152");
}, E = (e) => Le(S(e)), et = (e) => {
	let t = S(e).replace(/\/lna-probe\/?$/i, "").replace(/\/+$/, "");
	if (!t) return "";
	let n = E(t);
	return n.length > 1 ? n.map((e) => D(e)).filter(Boolean).join(";") : D(t);
}, D = (e) => {
	let t = S(e).replace(/\/lna-probe\/?$/i, "").replace(/\/+$/, "");
	if (!t || C(t)) return "";
	let n = w(t);
	if (!n?.host || /^https?:?$/i.test(n.host)) return "";
	let r = n.protocol ?? "https";
	return n.port ? `${r}://${n.host}:${n.port}` : `${r}://${n.host}:8434`;
}, O = (e) => {
	let t = S(e);
	if (!t) return t;
	let n = t.replace(/(?<![0-9]):8443(?![0-9])/g, ":8434").replace(/(?<![0-9]):8343(?![0-9])/g, ":8434"), r = E(n);
	return r.length <= 1 ? D(n) || "" : r.map((e) => D(e) || "").filter(Boolean).join(";");
}, tt = (e, t = {}) => {
	let n = w(e);
	if (!n?.host) return [];
	let r = t.preferHttps !== !1, i = t.includeHttp !== !1, a = t.httpsPorts ?? Re, o = t.httpPorts ?? ze, s = [], c = (e) => {
		e && !s.includes(e) && s.push(e);
	}, { host: l, port: u, protocol: d } = n;
	if (u) return d === "https" ? (c(T("https", l, u)), s) : d === "http" ? (c(T("http", l, u)), s) : (c(T("https", l, u)), i && c(T("http", l, u)), s);
	if (d === "https") {
		for (let e of a) c(T("https", l, e));
		return s;
	}
	if (d === "http") {
		for (let e of o) c(T("http", l, e));
		return s;
	}
	let f = r ? i ? ["https", "http"] : ["https"] : i ? ["http", "https"] : ["https"];
	for (let e of f) {
		let t = e === "https" ? a : o;
		for (let n of t) c(T(e, l, n));
	}
	return s;
}, nt = () => {
	try {
		return typeof globalThis.fetch == "function" ? globalThis.fetch.bind(globalThis) : void 0;
	} catch {
		return;
	}
}, rt = 2500, it = async (e, t = {}) => {
	let n = t.fetchFn ?? nt();
	if (!n) return !1;
	let r = S(e).replace(/\/+$/, "");
	if (!r) return !1;
	let i = t.timeoutMs ?? rt, a = typeof AbortController < "u" ? new AbortController() : void 0, o = a && i > 0 ? globalThis.setTimeout(() => a.abort(), i) : void 0;
	try {
		return (await n(`${r}/lna-probe`, {
			method: "GET",
			mode: "cors",
			cache: "no-store",
			credentials: "omit",
			signal: a?.signal
		})).status === 204;
	} catch {
		return !1;
	} finally {
		o && clearTimeout(o);
	}
}, at = (e) => {
	try {
		let t = new URL(e);
		return {
			origin: e,
			protocol: t.protocol === "http:" ? "http" : "https",
			port: t.port || (t.protocol === "http:" ? "80" : "443"),
			host: t.hostname
		};
	} catch {
		return null;
	}
}, ot = async (e, t = {}) => {
	let n = w(e);
	if (!n?.host) return null;
	if (n.port) {
		let e = async (e) => {
			let r = T(e, n.host, n.port);
			return await it(r, t) ? at(r) : null;
		};
		if (n.protocol === "https") {
			let t = await e("https");
			if (t) return t;
		} else if (n.protocol === "http") {
			let t = await e("http");
			if (t) return t;
		} else {
			let n = await e("https");
			if (n) return n;
			if (t.includeHttp !== !1) {
				let t = await e("http");
				if (t) return t;
			}
		}
	}
	let r = tt(n.host, t), i = t.maxProbeCandidates;
	i != null && i > 0 && r.length > i && (r = r.slice(0, i));
	for (let e of r) {
		if (!await it(e, t)) continue;
		let n = at(e);
		if (n) return n;
	}
	return null;
}, st = (e) => {
	let t = S(e);
	if (!t) return !1;
	let n = E(t);
	return n.length > 1 ? n.every((e) => st(e)) : /^[a-z][a-z0-9+.-]*:\/\//i.test(t) ? !0 : !!w(t)?.port;
}, ct = async (e, t = {}) => {
	let n = S(e);
	if (!n || C(n)) return "";
	if (t.discover !== !1 && !st(n)) {
		let e = await ot(n, t);
		if (e?.origin) return e.origin.replace(/\/+$/, "");
	}
	return D(n) || Ue(n).replace(/\/+$/, "");
}, lt = async (e, t = {}) => {
	let n = S(e);
	if (!n) return "";
	let r = E(n);
	if (r.length <= 1) return ct(n, t);
	let i = [];
	for (let e of r) {
		let n = await ct(e, t);
		n && !i.includes(n) && i.push(n);
	}
	return i.join(";");
}, ut = "airpad.remote.connection.v1", dt = "192.168.0.", ft = (e) => {
	let t = String(e ?? "").trim();
	if (!/^L-/i.test(t)) return "";
	let n = t.replace(/^L-/i, "").trim();
	return He(n) ? n : /^\d{1,3}$/.test(n) ? `${dt}${n}` : "";
}, k = (e) => {
	let t = String(e ?? "").trim();
	if (!t) return "";
	if (/^L-/i.test(t)) {
		let e = t.slice(2).trim();
		return e ? `L-${e}` : "";
	}
	return /^\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?$/.test(t) ? `L-${t.split(":")[0]}` : /^\d{1,3}$/.test(t) ? `L-${t}` : t;
}, pt = (e) => {
	let t = k(e);
	if (!t) return "";
	let n = /^L-192\.168\.0\.(\d{1,3})$/i.exec(t);
	return n ? `L-${n[1]}` : /^L-\d{1,3}$/i.test(t) ? `L-${t.slice(2)}` : t;
}, mt = (e, t) => {
	let n = pt(e).toLowerCase(), r = pt(t).toLowerCase();
	return !!n && n === r;
}, A = "L-110", j = "L-200", M = (e) => mt(e, j), ht = ["L-110", "L-111"], gt = (e) => {
	let t = pt(e).toLowerCase();
	return t ? ht.some((e) => e.toLowerCase() === t) : !1;
}, _t = (e, t) => !F(e) || M(t) ? !1 : gt(t), vt = (e, t, n) => {
	let r = k(e);
	if (M(r)) return !1;
	if (gt(r) || F(t)) return !0;
	let i = N(A);
	if (!i) return !1;
	for (let e of [String(t ?? ""), String(n ?? "")]) if (e.includes(i)) return !0;
	return !1;
}, yt = (e, t, n) => {
	let r = k(e);
	return M(r) ? j : gt(r) ? r : vt(r, t, n) ? A : r;
}, bt = (e, t) => {
	let n = `${Ge}/`, r = `${Xe({
		relay: t?.relay,
		endpointUrl: t?.endpointUrl,
		hubUrl: t?.hubUrl
	})}/`;
	return Dt(e) ? [n, r] : [r, n];
}, xt = (e, t = 8434) => {
	let n = N(e);
	return n ? `https://${n}:${t}/` : "";
}, N = (e) => {
	let t = k(e);
	if (!t.toLowerCase().startsWith("l-")) return "";
	let n = t.slice(2).trim();
	return /^\d{1,3}$/.test(n) ? `${dt}${n}` : /^\d{1,3}(?:\.\d{1,3}){3}$/.test(n) ? n : "";
}, St = (e) => String(e ?? "").trim().startsWith(dt), Ct = (e) => /^L-\d{1,3}-crx$/i.test(String(e ?? "").trim()), wt = (e) => {
	let t = /^L-(\d{1,3})-crx$/i.exec(String(e ?? "").trim());
	return t ? `L-${t[1]}-crx` : "";
}, P = (e) => {
	if (Ct(e)) return !0;
	let t = k(e);
	if (/^L-\d{1,3}$/i.test(t)) return !0;
	let n = N(t);
	return n ? St(n) : !1;
}, F = (e) => String(e ?? "").trim().toLowerCase() ? $e(e) : !1, Tt = (e) => M(k(e)) || F(e), I = (e) => {
	let t = wt(e);
	if (t) return t;
	let n = k(e);
	return P(n) ? pt(n) : "";
}, L = (e, t) => {
	let n = String(e ?? "").trim();
	return I(e) || (n && Tt(n) ? j : F(t) ? A : "");
}, Et = (e) => {
	let t = String(e ?? "").trim().toLowerCase();
	return !t || t === "localhost" || t === "127.0.0.1" || t === "[::1]";
}, Dt = (e) => St(String(e ?? "").trim()), Ot = (e) => {
	let t = String(e ?? (typeof globalThis < "u" && globalThis.location ? globalThis.location.hostname : "")).trim();
	return Et(t) ? !0 : !Dt(t);
}, kt = (e, t) => F(String(e ?? "").trim()) ? Ot(t) : !1, At = (e, t = 8434) => {
	let n = String(e ?? "").trim();
	if (!n) return "";
	if (He(n)) {
		if (/^https?:\/\//i.test(n)) return n.endsWith("/") ? n : `${n}/`;
		let e = n.split("/")[0]?.trim() ?? "";
		return e ? e.includes(":") ? `https://${e}/` : `https://${e}:${t}/` : "";
	}
	let r = ft(n);
	return r ? r.includes(":") ? `https://${r}/` : `https://${r}:${t}/` : "";
}, jt = "cwsp.remote.connection.v1";
function Mt(e) {
	return JSON.stringify({
		...e,
		v: e.v ?? 1
	});
}
function Nt(e) {
	return String(e || "").trim() || void 0;
}
function R(e, t) {
	let n = e;
	for (let e of t) {
		if (!n || typeof n != "object" || Array.isArray(n)) return;
		n = n[e];
	}
	return Nt(String(n ?? ""));
}
function Pt(e) {
	let t = e.core && typeof e.core == "object" && !Array.isArray(e.core) ? e.core : {}, n = t.socket && typeof t.socket == "object" && !Array.isArray(t.socket) ? t.socket : {}, r = R(e, ["core", "endpointUrl"]) || R(e, [
		"core",
		"admin",
		"httpsOrigin"
	]), i = R(e, ["core", "ecosystemToken"]) || Nt(String(n.accessToken ?? n.airpadAuthToken ?? "")) || R(e, ["core", "userKey"]) || void 0, a = R(e, ["core", "ecosystemToken"]) || R(e, ["core", "userKey"]) || R(e, [
		"core",
		"socket",
		"clientAccessToken"
	]) || R(e, [
		"core",
		"socket",
		"accessToken"
	]);
	return {
		v: 1,
		endpointUrl: r,
		directUrl: R(e, [
			"core",
			"ops",
			"directUrl"
		]),
		quickConnectValue: R(e, [
			"core",
			"network",
			"quickConnect"
		]),
		destinationId: R(e, [
			"core",
			"socket",
			"routeTarget"
		]),
		routeTarget: R(e, [
			"core",
			"socket",
			"routeTarget"
		]),
		accessToken: i,
		authToken: i,
		clientId: R(e, [
			"core",
			"socket",
			"selfId"
		]) || R(e, ["core", "userId"]) || R(e, ["core", "appClientId"]),
		peerInstanceId: R(e, ["core", "appClientId"]),
		identificationToken: a,
		clientAccessToken: R(e, [
			"core",
			"socket",
			"clientAccessToken"
		]),
		wireTransport: "ws"
	};
}
function Ft(e) {
	let t = e.shell && typeof e.shell == "object" && !Array.isArray(e.shell) ? e.shell : {}, n = {}, r = Nt(String(t.clipboardShareDestinationIds ?? ""));
	r !== void 0 && (n.shareIntentDestinationIds = r);
	let i = Nt(String(t.clipboardInboundAllowIds ?? ""));
	return i !== void 0 && (n.allowClipboardReadFromIds = i), t.acceptInboundClipboardData !== void 0 && (n.acceptInboundClipboard = (t.acceptInboundClipboardData ?? !0) !== !1), t.applyRemoteClipboardToDevice !== void 0 && (n.applyRemoteClipboardToDevice = (t.applyRemoteClipboardToDevice ?? !0) !== !1), t.accessTokenBypassesClipboardAllowlist !== void 0 && (n.accessTokenBypassesIdPolicy = t.accessTokenBypassesClipboardAllowlist === !0), t.acceptContactsBridgeData !== void 0 && (n.acceptContactsData = t.acceptContactsBridgeData === !0), t.acceptSmsBridgeData !== void 0 && (n.acceptSmsData = t.acceptSmsBridgeData === !0), t.autoStartOnBoot !== void 0 && (n.autoStartOnBoot = t.autoStartOnBoot !== !1), t.bridgeDaemonEnabled !== void 0 && (n.bridgeDaemonEnabled = t.bridgeDaemonEnabled !== !1), n;
}
//#endregion
//#region ../../../node_modules/@capacitor/core/dist/index.js
var z;
(function(e) {
	e.Unimplemented = "UNIMPLEMENTED", e.Unavailable = "UNAVAILABLE";
})(z ||= {});
var It = class extends Error {
	constructor(e, t, n) {
		super(e), this.message = e, this.code = t, this.data = n;
	}
}, Lt = (e) => e?.androidBridge ? "android" : e?.webkit?.messageHandlers?.bridge ? "ios" : "web", Rt = (e) => {
	let t = e.CapacitorCustomPlatform || null, n = e.Capacitor || {}, r = n.Plugins = n.Plugins || {}, i = () => t === null ? Lt(e) : t.name, a = () => i() !== "web", o = (e) => !!(l.get(e)?.platforms.has(i()) || s(e)), s = (e) => n.PluginHeaders?.find((t) => t.name === e), c = (t) => e.console.error(t), l = /* @__PURE__ */ new Map();
	return n.convertFileSrc ||= (e) => e, n.getPlatform = i, n.handleError = c, n.isNativePlatform = a, n.isPluginAvailable = o, n.registerPlugin = (e, a = {}) => {
		let o = l.get(e);
		if (o) return console.warn(`Capacitor plugin "${e}" already registered. Cannot register plugins twice.`), o.proxy;
		let c = i(), u = s(e), d, f = async () => (!d && c in a ? d = d = typeof a[c] == "function" ? await a[c]() : a[c] : t !== null && !d && "web" in a && (d = d = typeof a.web == "function" ? await a.web() : a.web), d), p = (t, r) => {
			if (u) {
				let i = u?.methods.find((e) => r === e.name);
				if (i) return i.rtype === "promise" ? (t) => n.nativePromise(e, r.toString(), t) : (t, i) => n.nativeCallback(e, r.toString(), t, i);
				if (t) return t[r]?.bind(t);
			} else if (t) return t[r]?.bind(t);
			else throw new It(`"${e}" plugin is not implemented on ${c}`, z.Unimplemented);
		}, m = (t) => {
			let n, r = (...r) => {
				let i = f().then((i) => {
					let a = p(i, t);
					if (a) {
						let e = a(...r);
						return n = e?.remove, e;
					}
					throw new It(`"${e}.${t}()" is not implemented on ${c}`, z.Unimplemented);
				});
				return t === "addListener" && (i.remove = async () => n()), i;
			};
			return r.toString = () => `${t.toString()}() { [capacitor code] }`, Object.defineProperty(r, "name", {
				value: t,
				writable: !1,
				configurable: !1
			}), r;
		}, h = m("addListener"), g = m("removeListener"), _ = (e, t) => {
			let n = h({ eventName: e }, t), r = async () => {
				let r = await n;
				g({
					eventName: e,
					callbackId: r
				}, t);
			}, i = new Promise((e) => n.then(() => e({ remove: r })));
			return i.remove = async () => {
				console.warn("Using addListener() without 'await' is deprecated."), await r();
			}, i;
		}, v = new Proxy({}, { get(e, t) {
			switch (t) {
				case "$$typeof": return;
				case "toJSON": return () => ({});
				case "addListener": return u ? _ : h;
				case "removeListener": return g;
				default: return m(t);
			}
		} });
		return r[e] = v, l.set(e, {
			name: e,
			proxy: v,
			platforms: /* @__PURE__ */ new Set([...Object.keys(a), ...u ? [c] : []])
		}), v;
	}, n.Exception = It, n.DEBUG = !!n.DEBUG, n.isLoggingEnabled = !!n.isLoggingEnabled, n;
}, zt = /*#__PURE__*/ ((e) => e.Capacitor = Rt(e))(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {}), Bt = zt.registerPlugin, Vt = class {
	constructor() {
		this.listeners = {}, this.retainedEventArguments = {}, this.windowListeners = {};
	}
	addListener(e, t) {
		let n = !1;
		this.listeners[e] || (this.listeners[e] = [], n = !0), this.listeners[e].push(t);
		let r = this.windowListeners[e];
		return r && !r.registered && this.addWindowListener(r), n && this.sendRetainedArgumentsForEvent(e), Promise.resolve({ remove: async () => this.removeListener(e, t) });
	}
	async removeAllListeners() {
		this.listeners = {};
		for (let e in this.windowListeners) this.removeWindowListener(this.windowListeners[e]);
		this.windowListeners = {};
	}
	notifyListeners(e, t, n) {
		let r = this.listeners[e];
		if (!r) {
			if (n) {
				let n = this.retainedEventArguments[e];
				n ||= [], n.push(t), this.retainedEventArguments[e] = n;
			}
			return;
		}
		r.forEach((e) => e(t));
	}
	hasListeners(e) {
		return !!this.listeners[e]?.length;
	}
	registerWindowListener(e, t) {
		this.windowListeners[t] = {
			registered: !1,
			windowEventName: e,
			pluginEventName: t,
			handler: (e) => {
				this.notifyListeners(t, e);
			}
		};
	}
	unimplemented(e = "not implemented") {
		return new zt.Exception(e, z.Unimplemented);
	}
	unavailable(e = "not available") {
		return new zt.Exception(e, z.Unavailable);
	}
	async removeListener(e, t) {
		let n = this.listeners[e];
		if (!n) return;
		let r = n.indexOf(t);
		this.listeners[e].splice(r, 1), this.listeners[e].length || this.removeWindowListener(this.windowListeners[e]);
	}
	addWindowListener(e) {
		window.addEventListener(e.windowEventName, e.handler), e.registered = !0;
	}
	removeWindowListener(e) {
		e && (window.removeEventListener(e.windowEventName, e.handler), e.registered = !1);
	}
	sendRetainedArgumentsForEvent(e) {
		let t = this.retainedEventArguments[e];
		t && (delete this.retainedEventArguments[e], t.forEach((t) => {
			this.notifyListeners(e, t);
		}));
	}
}, Ht = (e) => encodeURIComponent(e).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape), Ut = (e) => e.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent), Wt = class extends Vt {
	async getCookies() {
		let e = document.cookie, t = {};
		return e.split(";").forEach((e) => {
			if (e.length <= 0) return;
			let [n, r] = e.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
			n = Ut(n).trim(), r = Ut(r).trim(), t[n] = r;
		}), t;
	}
	async setCookie(e) {
		try {
			let t = Ht(e.key), n = Ht(e.value), r = e.expires ? `; expires=${e.expires.replace("expires=", "")}` : "", i = (e.path || "/").replace("path=", ""), a = e.url != null && e.url.length > 0 ? `domain=${e.url}` : "";
			document.cookie = `${t}=${n || ""}${r}; path=${i}; ${a};`;
		} catch (e) {
			return Promise.reject(e);
		}
	}
	async deleteCookie(e) {
		try {
			document.cookie = `${e.key}=; Max-Age=0`;
		} catch (e) {
			return Promise.reject(e);
		}
	}
	async clearCookies() {
		try {
			let e = document.cookie.split(";") || [];
			for (let t of e) document.cookie = t.replace(/^ +/, "").replace(/=.*/, `=;expires=${(/* @__PURE__ */ new Date()).toUTCString()};path=/`);
		} catch (e) {
			return Promise.reject(e);
		}
	}
	async clearAllCookies() {
		try {
			await this.clearCookies();
		} catch (e) {
			return Promise.reject(e);
		}
	}
};
Bt("CapacitorCookies", { web: () => new Wt() });
var Gt = async (e) => new Promise((t, n) => {
	let r = new FileReader();
	r.onload = () => {
		let e = r.result;
		t(e.indexOf(",") >= 0 ? e.split(",")[1] : e);
	}, r.onerror = (e) => n(e), r.readAsDataURL(e);
}), Kt = (e = {}) => {
	let t = Object.keys(e);
	return Object.keys(e).map((e) => e.toLocaleLowerCase()).reduce((n, r, i) => (n[r] = e[t[i]], n), {});
}, qt = (e, t = !0) => e ? Object.entries(e).reduce((e, n) => {
	let [r, i] = n, a, o;
	return Array.isArray(i) ? (o = "", i.forEach((e) => {
		a = t ? encodeURIComponent(e) : e, o += `${r}=${a}&`;
	}), o.slice(0, -1)) : (a = t ? encodeURIComponent(i) : i, o = `${r}=${a}`), `${e}&${o}`;
}, "").substr(1) : null, Jt = (e, t = {}) => {
	let n = Object.assign({
		method: e.method || "GET",
		headers: e.headers
	}, t), r = Kt(e.headers)["content-type"] || "";
	if (typeof e.data == "string") n.body = e.data;
	else if (r.includes("application/x-www-form-urlencoded")) {
		let t = new URLSearchParams();
		for (let [n, r] of Object.entries(e.data || {})) t.set(n, r);
		n.body = t.toString();
	} else if (r.includes("multipart/form-data") || e.data instanceof FormData) {
		let t = new FormData();
		if (e.data instanceof FormData) e.data.forEach((e, n) => {
			t.append(n, e);
		});
		else for (let n of Object.keys(e.data)) t.append(n, e.data[n]);
		n.body = t;
		let r = new Headers(n.headers);
		r.delete("content-type"), n.headers = r;
	} else (r.includes("application/json") || typeof e.data == "object") && (n.body = JSON.stringify(e.data));
	return n;
}, Yt = class extends Vt {
	async request(e) {
		let t = Jt(e, e.webFetchExtra), n = qt(e.params, e.shouldEncodeUrlParams), r = n ? `${e.url}?${n}` : e.url, i = await fetch(r, t), a = i.headers.get("content-type") || "", { responseType: o = "text" } = i.ok ? e : {};
		a.includes("application/json") && (o = "json");
		let s, c;
		switch (o) {
			case "arraybuffer":
			case "blob":
				c = await i.blob(), s = await Gt(c);
				break;
			case "json":
				s = await i.json();
				break;
			default: s = await i.text();
		}
		let l = {};
		return i.headers.forEach((e, t) => {
			l[t] = e;
		}), {
			data: s,
			headers: l,
			status: i.status,
			url: i.url
		};
	}
	async get(e) {
		return this.request(Object.assign(Object.assign({}, e), { method: "GET" }));
	}
	async post(e) {
		return this.request(Object.assign(Object.assign({}, e), { method: "POST" }));
	}
	async put(e) {
		return this.request(Object.assign(Object.assign({}, e), { method: "PUT" }));
	}
	async patch(e) {
		return this.request(Object.assign(Object.assign({}, e), { method: "PATCH" }));
	}
	async delete(e) {
		return this.request(Object.assign(Object.assign({}, e), { method: "DELETE" }));
	}
};
Bt("CapacitorHttp", { web: () => new Yt() });
var Xt;
(function(e) {
	e.Dark = "DARK", e.Light = "LIGHT", e.Default = "DEFAULT";
})(Xt ||= {});
var Zt;
(function(e) {
	e.StatusBar = "StatusBar", e.NavigationBar = "NavigationBar";
})(Zt ||= {});
var Qt = class extends Vt {
	async setStyle() {
		this.unavailable("not available for web");
	}
	async setAnimation() {
		this.unavailable("not available for web");
	}
	async show() {
		this.unavailable("not available for web");
	}
	async hide() {
		this.unavailable("not available for web");
	}
};
Bt("SystemBars", { web: () => new Qt() });
//#endregion
//#region ../../projects/subsystem/src/routing/native/cws-bridge.ts
var $t = class extends Vt {
	async getShellInfo() {
		return {
			shell: "browser",
			bridge: "cws-bridge",
			native: !1,
			platform: globalThis.navigator === void 0 ? "unknown" : "web"
		};
	}
	async invoke(e) {
		let t = tn(e.channel, e.payload, e.envelope);
		return {
			ok: !0,
			channel: e.channel,
			echo: { ...e.payload ?? {} },
			envelope: t
		};
	}
}, B = (() => {
	let e = globalThis;
	if (e.__CWS_BRIDGE_PLUGIN__) return e.__CWS_BRIDGE_PLUGIN__;
	let t = e.Capacitor?.Plugins?.CwsBridge;
	if (t) return e.__CWS_BRIDGE_PLUGIN__ = t, t;
	let n = Bt("CwsBridge", { web: () => new $t() });
	return e.__CWS_BRIDGE_PLUGIN__ = n, n;
})(), en = !1, tn = (e, t, n) => {
	if (n && a(n)) return r(n);
	let s = o({
		purpose: "invoke",
		protocol: "service",
		transport: "service-worker",
		type: "invoke",
		op: "invoke",
		source: "webview",
		destination: "native",
		srcChannel: "webview",
		dstChannel: "native",
		payload: t ?? {},
		data: t ?? {}
	});
	return i({
		...s,
		path: ["cws-bridge", e]
	});
}, V = (e, t, n) => {
	if (n?.envelope && a(n.envelope)) return r(n.envelope);
	let s = o({
		purpose: "invoke",
		protocol: "service",
		transport: "service-worker",
		type: n.ok ? "response" : "ack",
		op: "invoke",
		source: "native",
		destination: "webview",
		srcChannel: "native",
		dstChannel: "webview",
		payload: t,
		data: t
	});
	return i({
		...s,
		path: ["cws-bridge", e]
	});
};
async function nn(e) {
	let t = globalThis.window === void 0 ? null : globalThis.window.__CWS_SHELL_INFO__ ?? null;
	if (!e?.force && t?.accentColor) return t;
	try {
		let e = await B.getShellInfo();
		return e && globalThis.window !== void 0 && (globalThis.window.__CWS_SHELL_INFO__ = {
			...t || {},
			...e
		}), e ?? t;
	} catch {
		return t;
	}
}
async function rn() {
	if (en) {
		let e = globalThis.window === void 0 ? null : globalThis.window.__CWS_SHELL_INFO__ ?? null;
		return e?.accentColor || e?.native ? e : nn({ force: !0 });
	}
	en = !0;
	let e = globalThis.window?.electronBridge?.getShellInfo;
	if (typeof e == "function") try {
		let t = await e();
		return globalThis.window !== void 0 && (globalThis.window.__CWS_SHELL_INFO__ = t), t;
	} catch {}
	try {
		let e = await B.getShellInfo();
		globalThis.window !== void 0 && (globalThis.window.__CWS_SHELL_INFO__ = e);
		try {
			await B.addListener("nativeMessage", (e) => {
				let t = e && typeof e.payload == "object" && e.payload != null ? e.payload : {}, n = t?.envelope, s = n && typeof n == "object" && a(n) ? r(n) : i(o({
					purpose: "mail",
					protocol: "service",
					transport: "service-worker",
					type: "act",
					op: "deliver",
					source: "native",
					destination: "webview",
					srcChannel: "native",
					dstChannel: "webview",
					payload: t,
					data: t
				}));
				globalThis.dispatchEvent(new CustomEvent("cws-native-message", { detail: {
					event: e,
					envelope: s,
					payload: t
				} }));
			});
		} catch {}
		return e;
	} catch {
		return null;
	}
}
var an = () => {
	try {
		let e = globalThis.Capacitor;
		return typeof e?.isNativePlatform == "function" && !!e.isNativePlatform();
	} catch {
		return !1;
	}
}, on = () => {
	try {
		return !!globalThis.window?.electronBridge?.invoke;
	} catch {
		return !1;
	}
}, sn = () => {
	if (on() || an()) return !0;
	try {
		return !!globalThis.window?.__CWS_SHELL_INFO__?.native;
	} catch {
		return !1;
	}
};
async function cn(e) {
	let t = (e.channel || "").trim() || (Array.isArray(e.envelope?.path) && e.envelope?.path.length ? String(e.envelope.path[e.envelope.path.length - 1] || "").trim() : "") || "default", n = e.payload && typeof e.payload == "object" ? e.payload : {}, r = tn(t, n, e.envelope), i = globalThis.window?.electronBridge?.invoke;
	if (typeof i == "function") {
		let e = await i({
			channel: t,
			payload: n,
			envelope: r
		});
		return {
			...e,
			envelope: V(t, n, e)
		};
	}
	if (!sn()) {
		let e = await B.invoke({
			channel: t,
			payload: n,
			envelope: r
		});
		return {
			...e,
			envelope: V(t, n, e)
		};
	}
	try {
		let e = await B.invoke({
			channel: t,
			payload: n,
			envelope: r
		});
		return {
			...e,
			envelope: V(t, n, e)
		};
	} catch (e) {
		if (console.warn("[cws-bridge] native invoke failed:", e), an()) return {
			ok: !1,
			channel: t,
			echo: {
				...n ?? {},
				error: String(e instanceof Error ? e.message : e)
			},
			envelope: V(t, n, {
				ok: !1,
				channel: t,
				echo: n ?? {}
			})
		};
		let i = await new $t().invoke({
			channel: t,
			payload: n,
			envelope: r
		});
		return {
			...i,
			envelope: V(t, n, i)
		};
	}
}
async function ln() {
	try {
		let e = await cn({ channel: "settings:get" });
		return e?.ok && e.appSettings && typeof e.appSettings == "object" ? e.appSettings : null;
	} catch {
		return null;
	}
}
async function un(e) {
	try {
		let t = Mt(Pt(e)), n = Ft(e);
		try {
			globalThis.localStorage?.setItem?.(ut, t);
		} catch {}
		try {
			let e = new BroadcastChannel(jt);
			e.postMessage({
				airpadJson: t,
				shellPatch: n
			}), e.close();
		} catch {}
		let r = await he(cn({
			channel: "settings:patch",
			payload: {
				appSettings: e,
				airpadJson: t,
				shellPatch: n
			}
		}), 6e3, "settings:patch timed out").catch((e) => ({
			ok: !1,
			channel: "settings:patch",
			echo: { error: String(e instanceof Error ? e.message : e) }
		})), i = r?.echo;
		return r?.ok === !0 || r?.ok !== !1 && !i?.error && r?.channel === "settings:patch" ? { ok: !0 } : {
			ok: !1,
			error: String(i?.error ?? "settings:patch rejected")
		};
	} catch (e) {
		return {
			ok: !1,
			error: String(e instanceof Error ? e.message : e)
		};
	}
}
//#endregion
//#region ../../../apps/CWSP-transfer/src/shared/src/remote-connection-runtime.ts
var H = (e) => typeof e == "number" ? Number.isFinite(e) ? String(e) : "" : typeof e == "string" ? e.trim() : "", dn = (e) => {
	let t = e.trim();
	if (!t) return !1;
	let n = t.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "").split("/")[0], r = n.lastIndexOf(":");
	if (r <= 0) return !1;
	let i = n.slice(r + 1);
	return /^\d{1,5}$/.test(i);
}, fn = (e, t) => {
	let n = e.trim();
	if (!n) return "";
	let r = t.trim();
	return !r || dn(n) ? n : `${n}:${r}`;
}, U = (e) => Ue(H(e)), pn = (e) => {
	let t = H(e).toLowerCase();
	if (t && (t === "ws" || t === "wss" || t === "socket" || t === "socket.io" || t === "socketio")) return "ws";
}, W = k, mn = (...e) => Array.from(new Set(e.map((e) => U(e)).filter(Boolean))).join(", "), hn = /* @__PURE__ */ new Set([
	"cwsp.u2re.space",
	"www.cwsp.u2re.space",
	"md.u2re.space",
	"www.md.u2re.space"
]), gn = (e) => hn.has(String(e || "").trim().toLowerCase()), _n = () => {
	try {
		if (String(document.documentElement?.dataset?.cwspSurface || "").toLowerCase().trim() === "cwsp-control") return !0;
	} catch {}
	try {
		return gn(String(globalThis.location?.hostname || ""));
	} catch {
		return !1;
	}
}, vn = (e) => {
	let t = H(e);
	if (!t) return !1;
	try {
		let e = /^[a-z][a-z0-9+.-]*:\/\//i.test(t) ? t : `https://${t}`;
		return gn(new URL(e).hostname);
	} catch {
		return /cwsp\.u2re\.space|md\.u2re\.space/i.test(t);
	}
}, yn = (e) => {
	let t = H(e);
	if (!t || globalThis.location === void 0 || !globalThis.location.hostname || vn(t) || _n()) return t;
	try {
		let e = /^[a-z][a-z0-9+.-]*:\/\//i.test(t) ? t : `https://${t}`, n = new URL(e.endsWith("/") ? e : `${e.replace(/\/+$/, "")}/`), r = globalThis.location;
		if (gn(n.hostname) || gn(r.hostname)) return t;
		if (n.hostname === r.hostname && n.protocol === "https:" && n.port === "8434" && r.protocol === "https:" && (r.port === "" || r.port === "443")) return U(r.origin);
	} catch {}
	return t;
};
function bn() {
	try {
		let e = globalThis?.localStorage?.getItem?.(ut);
		if (!e) return {};
		let t = JSON.parse(e);
		if (!t || typeof t != "object") return {};
		let n = t, r = O(H(n.host)), i = O(H(n.tunnelHost)), a = H(n.port);
		if ((a === "8443" || a === "8343") && (n.port = "8434"), t.host = r, t.tunnelHost &&= i, t.endpointUrl = O(H(t.endpointUrl)), t.directUrl = O(H(t.directUrl)), t.quickConnectValue = O(H(t.quickConnectValue)), a === "" && i === "") return t;
		let o = [], s = /* @__PURE__ */ new Set(), c = (e) => {
			let t = (a ? fn(e, a) : e).trim();
			!t || s.has(t) || (s.add(t), o.push(t));
		};
		return r && c(r), i && c(i), !r && !i && a && location?.hostname && c(`${location.hostname}:${a}`), {
			...t,
			host: o.join(", "),
			_legacyMigrated: !0
		};
	} catch {
		return {};
	}
}
var xn = () => {
	G.clientId = I(G.clientId);
	let e = L(G.destinationId, G.endpointUrl);
	e ? G.destinationId = e : G.destinationId && !P(G.destinationId) && (G.destinationId = "");
};
function Sn() {
	xn();
	try {
		let e = {
			v: 1,
			quickConnectValue: G.quickConnectValue,
			endpointUrl: G.endpointUrl,
			directUrl: G.directUrl,
			destinationId: G.destinationId,
			accessToken: G.accessToken,
			clientId: G.clientId,
			peerInstanceId: G.peerInstanceId,
			identificationToken: G.identificationToken.trim() || void 0,
			clientAccessToken: G.clientAccessToken.trim() || void 0
		}, t = pn(G.wireTransport);
		t && (e.wireTransport = t), globalThis?.localStorage?.setItem?.(ut, JSON.stringify(e));
	} catch {}
}
var Cn = () => globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `ap-${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`, G = {
	quickConnectValue: "",
	endpointUrl: "",
	directUrl: "",
	accessToken: "",
	destinationId: "",
	clientId: "",
	peerInstanceId: "",
	identificationToken: "",
	clientAccessToken: ""
}, wn = "", Tn = !0, En = !0, Dn = !1, On = !1, kn = !0, An = !1, jn = !0, Mn = "", Nn = "", Pn = () => {
	let e = G.endpointUrl.trim(), t = G.directUrl.trim(), n = G.destinationId.trim(), r = L(n, e) || (P(n) ? W(n) : ""), i = M(r), a = N(r), o = i && (F(t) || !!(a && t.includes(a))), s = [];
	t && (!i || o) && s.push(t);
	let c = !i && (vt(r, e, t) || _t(e, r));
	if (i) {
		for (let e of bt(globalThis.location?.hostname)) s.some((t) => t.includes(new URL(e).hostname)) || s.push(e);
		e && !s.includes(e) && s.push(e);
	} else if (c) {
		let n = yt(r, e, t), i = xt(n);
		i && !s.some((e) => e.includes(N(n))) && s.push(i);
		for (let e of bt(globalThis.location?.hostname)) s.some((t) => t.includes(new URL(e).hostname)) || s.push(e);
		e && !s.includes(e) && s.push(e);
	} else e && s.push(e);
	mn(...s);
};
function Fn(e) {
	let t = H(e.host), n = H(e.routeTarget), r = U(e.endpointUrl) || (n ? U(t) : ""), i = U(e.directUrl) || (n ? "" : U(t)), a = H(e.quickConnectValue);
	G.endpointUrl = yn(r), G.directUrl = yn(i), G.accessToken = H(e.accessToken) || H(e.authToken) || "", G.quickConnectValue = a || H(e.destinationId) || n || G.directUrl, G.clientId = I(e.clientId);
	let o = H(e.destinationId) || n;
	G.destinationId = L(o, G.endpointUrl) || (P(o) ? W(o) : "");
	let s = H(e.peerInstanceId);
	s ? G.peerInstanceId = s : G.peerInstanceId ||= Cn(), G.identificationToken = H(e.identificationToken), G.clientAccessToken = H(e.clientAccessToken), G.wireTransport = pn(e.wireTransport), Pn();
}
var K = bn();
Fn(K), xn(), (G.clientId || G.destinationId) && Sn(), (async () => {
	if (kt(G.endpointUrl)) return;
	let e = {}, t = {
		timeoutMs: 1500,
		maxProbeCandidates: 2
	};
	if (G.directUrl.trim() && st(G.directUrl.trim())) {
		let n = await lt(G.directUrl.trim(), t);
		n && n !== G.directUrl.trim() && (e.directUrl = n);
	}
	if (G.endpointUrl.trim() && st(G.endpointUrl.trim())) {
		let n = await lt(G.endpointUrl.trim(), t);
		n && n !== G.endpointUrl.trim() && (e.endpointUrl = n);
	}
	Object.keys(e).length && zn(e, { persist: !0 });
})(), (async () => {
	if (G.directUrl.trim() || kt(G.endpointUrl)) return;
	let e = ft(G.destinationId), t = ft(G.quickConnectValue), n = e || t;
	if (!n) return;
	let r = At(n) || await lt(n, {
		timeoutMs: 1500,
		maxProbeCandidates: 2
	});
	!r || r === G.directUrl || (G.directUrl = r, e ? G.destinationId = W(G.destinationId) : t && (G.destinationId = W(G.quickConnectValue)), Pn(), Sn());
})(), H(K.peerInstanceId) || (G.peerInstanceId = G.peerInstanceId || Cn());
var In = H(K.accessToken), Ln = H(K.authToken), Rn = globalThis?.localStorage?.getItem?.("airpad.remote.connection.v1") ?? "";
(/(?<![0-9]):8443(?![0-9])|:8343(?![0-9])/.test(Rn) || K._legacyMigrated === !0 || !K.peerInstanceId || Ln && !In || K.v !== 1) && Sn();
function zn(e, t) {
	if (e.endpointUrl !== void 0) {
		let t = U(e.endpointUrl);
		G.endpointUrl = vn(t) ? "" : t;
	} else if (e.host !== void 0) {
		let t = U(e.host);
		G.endpointUrl = vn(t) ? "" : t;
	}
	e.directUrl !== void 0 && (G.directUrl = U(e.directUrl)), e.accessToken === void 0 ? e.authToken !== void 0 && (G.accessToken = e.authToken || "") : G.accessToken = e.accessToken || "", e.destinationId === void 0 ? e.routeTarget !== void 0 && (G.destinationId = L(e.routeTarget, G.endpointUrl) || (P(e.routeTarget) ? W(e.routeTarget) : "")) : G.destinationId = L(e.destinationId, G.endpointUrl) || (P(e.destinationId) ? W(e.destinationId) : ""), e.clientId !== void 0 && (G.clientId = I(e.clientId)), e.identificationToken !== void 0 && (G.identificationToken = (e.identificationToken || "").trim()), e.clientAccessToken !== void 0 && (G.clientAccessToken = (e.clientAccessToken || "").trim());
	let n = pn(e.wireTransport);
	n && (G.wireTransport = n), Pn(), t?.persist !== !1 && Sn();
}
function Bn(e, t) {
	let n = Pt(e), r = {};
	if ((() => {
		try {
			let e = globalThis.chrome?.runtime?.id;
			return typeof e == "string" && e.length > 0;
		} catch {
			return !1;
		}
	})() ? r.endpointUrl = String(e.shell?.localHubUrl || "").trim() || "https://127.0.0.1:8434/" : n.endpointUrl && !vn(n.endpointUrl) && (r.endpointUrl = n.endpointUrl), n.directUrl && (r.directUrl = n.directUrl), n.quickConnectValue && (r.quickConnectValue = n.quickConnectValue), n.destinationId || n.routeTarget) {
		let e = n.destinationId || n.routeTarget, t = L(e, n.endpointUrl);
		t ? r.destinationId = t : P(e) && (r.destinationId = W(e));
	}
	(n.accessToken || n.authToken) && (r.accessToken = n.accessToken || n.authToken), n.clientId && (r.clientId = I(n.clientId) || void 0), n.peerInstanceId && (r.peerInstanceId = n.peerInstanceId), n.identificationToken && (r.identificationToken = n.identificationToken), n.clientAccessToken && (r.clientAccessToken = n.clientAccessToken), n.wireTransport && (r.wireTransport = n.wireTransport), (r.endpointUrl || r.directUrl || r.quickConnectValue || r.destinationId || r.accessToken || r.clientId || r.peerInstanceId || r.identificationToken || r.clientAccessToken) && zn(r, { persist: t?.persist ?? !0 });
}
var Vn = (e) => {
	try {
		let t = new URL(e);
		return `${t.protocol}//${t.host}`;
	} catch {
		return "";
	}
};
function Hn(e) {
	let t = e.core, n = e.shell, r = t?.socket, i = t?.interop;
	wn = I(t?.userId) || "", String(t?.ecosystemToken || t?.userKey || t?.socket?.accessToken || "").trim(), t?.useCoreIdentityForAirPad, Tn = (n?.enableRemoteClipboardBridge ?? !0) !== !1, En = (n?.applyRemoteClipboardToDevice ?? !0) !== !1, Dn = !!n?.pushLocalClipboardToLan, Number(n?.clipboardPushIntervalMs), (n?.clipboardBroadcastTargets || "").trim(), On = n?.maintainHubSocketConnection === !0, kn = (n?.preferNativeWebsocket ?? i?.preferNativeWebsocket ?? !0) !== !1, An = (n?.enableNativeSms ?? !1) === !0, jn = (n?.enableNativeContacts ?? !0) !== !1, n?.acceptInboundClipboardData, (n?.clipboardInboundAllowIds || "").trim(), (n?.clipboardShareDestinationIds || "").trim(), n?.accessTokenBypassesClipboardAllowlist, n?.acceptContactsBridgeData, n?.acceptSmsBridgeData, (r?.protocol === "http" || r?.protocol === "https") && r.protocol;
	let a = (r?.routeTarget || "").trim();
	Mn = L(a, t?.endpointUrl) || (P(a) ? W(a) : ""), Nn = I(r?.selfId) || "", wn && Nn && Nn !== wn && (Nn = ""), (r?.accessToken || r?.airpadAuthToken || "").trim(), (r?.clientAccessToken || "").trim(), r?.transportMode, (r?.transportSecret || "").trim(), (r?.signingSecret || "").trim(), (r?.connectionType || "").trim(), (r?.archetype || "").trim(), (r?.protocolLanesJson || "").trim();
	let o = {}, s = (() => {
		try {
			let e = globalThis.chrome?.runtime?.id;
			return typeof e == "string" && e.length > 0;
		} catch {
			return !1;
		}
	})() ? String(n?.localHubUrl || "").trim() || "https://127.0.0.1:8434/" : String(t?.endpointUrl || "").trim();
	if (s) {
		let e = Vn(yn(s));
		e && (o.endpointUrl = e);
	}
	Object.keys(o).length && zn(o, { persist: !1 }), Bn(e, { persist: !1 });
	try {
		globalThis.__CWS_SHELL_FEATURES__ = {
			clipboardBridge: Tn,
			applyRemoteClipboard: En,
			pushLocalClipboard: Dn,
			maintainHubSocket: On,
			preferNativeWebsocket: kn,
			sms: An,
			contacts: jn
		};
	} catch {}
}
var Un = (e) => {
	let t = U(e);
	if (!t) return "";
	let n = "";
	try {
		let e = /^[a-z][a-z0-9+.-]*:\/\//i.test(t) ? t : `https://${t}`, r = new URL(e).hostname.trim();
		r && (n = /^L-/i.test(r) ? r : `L-${r}`);
	} catch {
		let e = t.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "").split("/")[0]?.split(":")[0]?.trim() || "";
		e && (n = /^L-/i.test(e) ? e : `L-${e}`);
	}
	return M(n) ? j : P(n) ? W(n) : F(e) ? j : "";
}, Wn = (e) => {
	let t = W(e).toLowerCase();
	return t === "l-192.168.0.200" || t === "l-45.147.121.152" || t.includes("gateway");
};
function Gn() {
	if (G.destinationId.trim()) {
		let e = L(G.destinationId, G.endpointUrl);
		if (e) return e;
		if (P(G.destinationId)) return G.destinationId.trim();
	}
	let e = G.endpointUrl.trim(), t = G.quickConnectValue.trim();
	if (t) {
		let n = L(t, e);
		if (n) return n;
		if (F(t)) return j;
		if (P(t)) return W(t);
	}
	let n = G.directUrl.trim();
	if (n) return F(n) ? j : Un(n) || (e && F(e) ? A : "");
	let r = Mn.trim();
	if (r) {
		if (M(r)) return W(r);
		if (!Wn(r)) return r;
	}
	return e && F(e) ? gt(r) ? W(r) : M(r) ? j : A : r || "";
}
c(30), s(() => ({
	endpointUrl: G.endpointUrl,
	directUrl: G.directUrl,
	pageHost: typeof globalThis < "u" && globalThis.location ? globalThis.location.hostname : "",
	routedDesk: !!Gn().trim()
}));
//#endregion
//#region ../../projects/subsystem/src/other/config/Settings.ts
var Kn = /* @__PURE__ */ e({
	DB_NAME: () => _r,
	SETTINGS_KEY: () => qn,
	SETTINGS_LS_MIRROR_KEY: () => Jn,
	STORE: () => Z,
	WebDavSync: () => Ir,
	currentWebDav: () => $,
	default: () => Ir,
	idbGetSettings: () => Cr,
	idbPutSettings: () => wr,
	loadSettings: () => Q,
	saveSettings: () => Er,
	updateWebDavSettings: () => Lr
}), qn = "rs-settings", Jn = "rs-settings.v1", q = { nativeSynced: null }, J = (e) => typeof e == "string" ? e.trim() : "", Yn = /* @__PURE__ */ new Set([
	"L-196",
	"L-208",
	"L-210"
]), Xn = (e) => {
	if (!e) return !0;
	let t = I(e) || e;
	return Yn.has(t);
}, Zn = (e) => !!e && P(k(e)), Qn = (e) => I(e) || String(e ?? "").trim(), Y = () => {
	try {
		let e = globalThis.Capacitor;
		return typeof e?.isNativePlatform == "function" && !!e.isNativePlatform();
	} catch {
		return !1;
	}
}, $n = () => {
	try {
		let e = globalThis, t = e.__WEBNATIVE_AUTH__ || e.__NEUTRALINO_AUTH__;
		return !!(e.__CWS_WEBNATIVE_BOOT__ || e.__CWS_NEUTRALINO_BOOT__ || e.__CWSP_CONTROL_BRIDGE_LIVE__ || t && typeof t.port == "number");
	} catch {
		return !1;
	}
}, er = () => {
	try {
		let e = globalThis, t = e.__CWSP_CONTROL_SOURCE__, n = String(e.__CWSP_CONTROL_VIA__ || "");
		if (n === "android" && t && typeof t.port == "number" && t.host) return {
			port: t.port,
			key: String(t.apiKey || t.userKey || ""),
			host: String(t.host).trim(),
			scheme: t.scheme === "https" ? "https" : "http"
		};
		if (n === "neutralino" || e.__NEUTRALINO_AUTH__) {
			let t = e.__NEUTRALINO_AUTH__ || e.__WEBNATIVE_AUTH__;
			if (t && typeof t.port == "number") return {
				port: t.port || 29110,
				key: String(t.key || "cwsp-neutralino-local"),
				host: String(t.host || "127.0.0.1"),
				scheme: t.scheme === "https" ? "https" : "http"
			};
		}
		let r = e.__WEBNATIVE_AUTH__ || e.__NEUTRALINO_AUTH__;
		return r && typeof r.port == "number" ? {
			port: r.port,
			key: String(r.key || t?.apiKey || t?.userKey || ""),
			host: String(r.host || t?.host || "127.0.0.1").trim() || "127.0.0.1",
			scheme: r.scheme === "https" || t?.scheme === "https" ? "https" : "http"
		} : t && typeof t.port == "number" && t.host ? {
			port: t.port,
			key: String(t.apiKey || t.userKey || ""),
			host: String(t.host).trim() || "127.0.0.1",
			scheme: t.scheme === "https" ? "https" : "http"
		} : null;
	} catch {
		return null;
	}
}, tr = () => {
	try {
		return String(globalThis.__CWSP_CONTROL_VIA__ || "");
	} catch {
		return "";
	}
}, nr = () => {
	try {
		return String(globalThis.document?.documentElement?.dataset?.cwspSurface || "").toLowerCase() === "cwsp-control" || /^(www\.)?cwsp\.u2re\.space$/i.test(String(location?.hostname || ""));
	} catch {
		return !1;
	}
}, rr = () => {
	try {
		return String(location?.protocol || "").toLowerCase() === "chrome-extension:";
	} catch {
		return !1;
	}
}, ir = () => {
	try {
		let e = String(globalThis.__CWSP_CONTROL_SESSION__ || "").trim();
		if (e) return e;
	} catch {}
	try {
		let e = sessionStorage.getItem("cwsp-control-session-v1");
		if (!e) return "";
		let t = JSON.parse(e);
		if (!t?.token || Number(t.expiresAt) && Date.now() >= Number(t.expiresAt)) return "";
		try {
			if (t.origin && t.origin !== String(location.origin || "")) return "";
		} catch {}
		return String(t.token).trim();
	} catch {
		return "";
	}
}, ar = async () => {
	if (!rr()) return "";
	try {
		return await (await import("./crx-control-session-CXlv4JVw.js")).getCrxControlSessionToken() || "";
	} catch {
		return "";
	}
}, or = async (e, t) => {
	try {
		let n = er();
		if (!n || typeof n.port != "number") return null;
		let r = String(n.host || "127.0.0.1").trim() || "127.0.0.1", i = n.scheme === "https" ? "https" : "http", a = String(location.hostname || "").toLowerCase(), o = location.protocol === "https:" && a !== "127.0.0.1" && a !== "localhost" && a !== "::1", s = tr() === "android";
		if (o && !s && (r === "127.0.0.1" || r === "localhost" || r === "::1") && n.port === 8434) return null;
		let c = new Headers(t?.headers);
		c.set("Content-Type", "application/json");
		let l = rr(), u = ir();
		if (!u && l && (u = await ar(), u)) try {
			globalThis.__CWSP_CONTROL_SESSION__ = u;
		} catch {}
		if (o || l) {
			if (!u) {
				let n = String(t?.method || "GET").toUpperCase();
				if (l && n !== "GET" && n !== "HEAD") try {
					globalThis.dispatchEvent(new CustomEvent("cwsp-control-unauthorized", { detail: {
						status: 401,
						path: e,
						reason: "missing-session"
					} }));
				} catch {}
				return null;
			}
			if (c.set("X-Control-Session", u), c.delete("X-API-Key"), c.delete("X-Skip-Legacy-Key"), l) try {
				let e = String(globalThis.chrome?.runtime?.id || "").trim();
				e && c.set("X-Control-Origin", `chrome-extension://${e}`);
			} catch {}
		} else u && c.set("X-Control-Session", u), n.key && c.set("X-API-Key", n.key);
		let d = t?.signal ?? (typeof AbortSignal < "u" && typeof AbortSignal.timeout == "function" ? AbortSignal.timeout(2500) : void 0), f = `${i}://${r.includes(":") && !r.startsWith("[") ? `[${r}]` : r}:${n.port}${e.startsWith("/") ? e : `/${e}`}`, p = r === "127.0.0.1" || r === "localhost" || r === "::1", m = /^10\./.test(r) || /^192\.168\./.test(r) || /^172\.(1[6-9]|2\d|3[0-1])\./.test(r), h = {
			...t,
			headers: c,
			cache: "no-store",
			signal: d,
			mode: "cors",
			credentials: "omit"
		};
		p ? h.targetAddressSpace = "loopback" : m && (h.targetAddressSpace = "local");
		let g = await fetch(f, h);
		if ((g.status === 401 || g.status === 403) && (o || l)) try {
			sessionStorage.removeItem("cwsp-control-session-v1"), delete globalThis.__CWSP_CONTROL_SESSION__;
			let t = globalThis;
			t.__CWSP_CONTROL_BRIDGE_LIVE__ = !1, t.__CWS_NODE_CLIPBOARD_HUB__ = !1, l && import("./crx-control-session-CXlv4JVw.js").then((e) => e.clearCrxControlSession()).catch(() => void 0), globalThis.dispatchEvent(new CustomEvent("cwsp-control-unauthorized", { detail: {
				status: g.status,
				path: e
			} }));
		} catch {}
		return g.ok ? await g.json() : null;
	} catch {
		return null;
	}
}, sr = (e) => {
	if (!e || typeof e != "object") return null;
	let t = e.bridge || {}, n = e.shell || {}, r = e.core && typeof e.core == "object" ? e.core : {}, i = Number(e.listenPort) || Number(e.publicHttpPort) || 8434, a = String(r.endpointUrl || t.endpointUrl || n.remoteHost || "").trim(), o = Array.isArray(t.endpoints) ? t.endpoints.map((e) => String(e || "").trim()).filter(Boolean) : [], s = a || o[0] || "", c = String(r.userId || t.userId || t.deviceId || "").trim(), l = String(r.ecosystemToken || r.userKey || t.userKey || n.accessToken || n.clientToken || "").trim(), u = t.allowInsecureTls === void 0 ? r.allowInsecureTls === void 0 ? void 0 : !!r.allowInsecureTls : !!t.allowInsecureTls;
	if (!s && !c && !l) return null;
	let d = {};
	return s ? d.endpointUrl = s : !s && !c && (d.endpointUrl = `https://127.0.0.1:${i}`), c && (d.userId = c), l && (d.userKey = l, d.ecosystemToken = l, d.socket = { accessToken: l }), u !== void 0 && (d.allowInsecureTls = u), d.preferBackendSync = (r.preferBackendSync ?? !0) !== !1, d;
}, cr = (e) => {
	let t = e?.settings?.shell || e?.portable?.shell || e?.snapshot?.shell;
	return !t || typeof t != "object" ? null : { ...t };
}, X = null, lr = 0, ur = async () => {
	if (Date.now() - lr < 2e3 && X) return X;
	let e = await or("/service/config");
	return X = e || null, e?.snapshot || e?.settings || e?.portable, lr = Date.now(), X;
}, dr = async (e) => {
	if (!$n()) return !1;
	try {
		let e = String(location.hostname || "").toLowerCase();
		if (location.protocol === "https:" && e !== "127.0.0.1" && e !== "localhost" && e !== "::1" && !ir()) return console.warn("[Settings] Control session missing — pair before saving to device"), !1;
	} catch {}
	let t = e.core;
	if (!t) return !1;
	let n = String(t.ecosystemToken || t.userKey || t.socket?.accessToken || "").trim(), r = String(t.endpointUrl || "").trim(), i = String(t.userId || "").trim(), a = e.shell || {}, o = {
		bridge: {
			endpointUrl: r,
			userId: i,
			userKey: n,
			allowInsecureTls: !!t.allowInsecureTls
		},
		shell: {
			remoteHost: r,
			accessToken: n,
			clientToken: n,
			clipboardBroadcastTargets: String(a.clipboardBroadcastTargets || t.socket?.routeTarget || "L-196;L-210").trim(),
			clipboardOutboundMode: String(a.clipboardOutboundMode || "ask").trim().toLowerCase() === "ask" ? "ask" : "auto",
			clipboardInboundMode: String(a.clipboardInboundMode || "ask").trim().toLowerCase() === "ask" ? "ask" : "auto",
			clipboardOutboundShowErase: a.clipboardOutboundShowErase !== !1,
			clipboardInboundShowUndo: a.clipboardInboundShowUndo !== !1,
			clipboardPromptDismissMs: (() => {
				let e = Number(a.clipboardPromptDismissMs);
				return Number.isFinite(e) && e >= 1e3 ? Math.floor(e) : 1e4;
			})(),
			filesShareDestinationIds: String(a.filesShareDestinationIds || "").trim(),
			filesAllowShareToAll: !!a.filesAllowShareToAll,
			filesOpenForShareMode: String(a.filesOpenForShareMode || "auto").trim().toLowerCase() === "manual" ? "manual" : "auto",
			filesInboundMode: String(a.filesInboundMode || "ask").trim().toLowerCase() === "auto" ? "auto" : "ask",
			filesCopyOnReceive: a.filesCopyOnReceive !== !1,
			filesByteTransport: (() => {
				let e = String(a.filesByteTransport || "auto").trim().toLowerCase();
				return e === "http" || e === "ws" ? e : "auto";
			})(),
			filesLandingMode: (() => {
				let e = String(a.filesLandingMode || "app").trim().toLowerCase();
				return e === "downloads" || e === "saf" ? e : "app";
			})(),
			filesIncomingDir: String(a.filesIncomingDir || "").trim(),
			filesAskDirEveryTime: a.filesAskDirEveryTime !== !1,
			filesStagingRoot: (() => {
				let e = String(a.filesStagingRoot || "app").trim().toLowerCase();
				return e === "cache" || e === "external" ? e : "app";
			})(),
			acceptInboundFilesData: a.acceptInboundFilesData !== !1
		},
		launcherEnv: {
			CWS_ASSOCIATED_ID: i,
			CWS_ASSOCIATED_TOKEN: n
		}
	};
	t.ops?.directUrl && (o.bridge.endpoints = [String(t.ops.directUrl).trim()]);
	let s = er(), c = tr() === "android" || Number(s?.port) === 8434, l = o;
	if (c) {
		let t = { ...e.core || {} };
		if (delete t.userKey, delete t.ecosystemToken, t.socket && typeof t.socket == "object") {
			let e = { ...t.socket };
			delete e.accessToken, delete e.airpadAuthToken, delete e.clientAccessToken, t.socket = e;
		}
		let n = {
			...o.shell,
			...e.shell || {}
		};
		delete n.accessToken, delete n.clientToken;
		let r = { ...o.bridge };
		delete r.userKey, l = {
			...o,
			bridge: r,
			core: t,
			shell: n,
			cwsp: e.cwsp
		};
	}
	let u = await or("/service/config", {
		method: "POST",
		body: JSON.stringify(l)
	});
	try {
		let e = er(), t = Number(e?.port) || 0, a = String(e?.host || "127.0.0.1");
		if (t === 29110 && (a === "127.0.0.1" || a === "localhost" || a === "::1")) {
			let e = {};
			r && (e.remoteHost = r), n && (e.accessToken = n, e.clientToken = n), i && (e.clientId = i), Object.keys(e).length && await or("/service/clipboard-hub", {
				method: "POST",
				body: JSON.stringify(e)
			});
		}
	} catch {}
	return lr = 0, X = null, !!(u?.ok === !0 || c && u && (u.settings || u.portable));
}, fr = () => {
	try {
		let e = globalThis.localStorage?.getItem?.(Jn);
		return e ? JSON.parse(e) : null;
	} catch {
		return null;
	}
}, pr = (e) => {
	try {
		return globalThis.localStorage?.setItem?.(Jn, JSON.stringify(e)), !0;
	} catch {
		return !1;
	}
}, mr = (e) => {
	let t = String(e || "").trim().toLowerCase();
	if (!t) return !1;
	try {
		let e = /^https?:\/\//i.test(t) ? t : `https://${t}`, n = new URL(e).hostname.toLowerCase();
		return n === "cwsp.u2re.space" || n === "www.cwsp.u2re.space" || n === "transfer.u2re.space" || n === "www.transfer.u2re.space" || n === "md.u2re.space" || n === "www.md.u2re.space";
	} catch {
		return /cwsp\.u2re\.space|transfer\.u2re\.space|md\.u2re\.space/i.test(t);
	}
}, hr = (e, t) => {
	if (!t || typeof t != "object") return e;
	let n = J(t.core?.endpointUrl);
	if (!n || mr(n)) return e;
	let r = J(e.core?.endpointUrl), i = !r || mr(r) || /^(https?:\/\/)?(127\.0\.0\.1|localhost)(:\d+)?\/?$/i.test(r);
	return !i && r === n || !i ? e : {
		...e,
		core: {
			...e.core,
			endpointUrl: n
		}
	};
}, gr = (e, t) => {
	if (!t || typeof t != "object") return e;
	let n = {}, r = {}, i = !1, a = J(t.core?.endpointUrl);
	a && (r.endpointUrl = a, i = !0);
	let o = J(t.core?.userId);
	if (o && Zn(o)) {
		let t = J(e.core?.userId);
		(Xn(t) || !Zn(t)) && (r.userId = o, i = !0);
	}
	let s = J(t.core?.userKey);
	s && (r.userKey = s, i = !0);
	let c = J(t.core?.appClientId);
	c && (r.appClientId = c, i = !0);
	let l = {}, u = !1, d = J(t.core?.socket?.routeTarget);
	d && (l.routeTarget = d, u = !0);
	let f = J(t.core?.socket?.accessToken);
	f && (l.accessToken = f, u = !0);
	let p = J(t.core?.socket?.clientAccessToken);
	p && (l.clientAccessToken = p, u = !0);
	let m = J(t.core?.socket?.selfId);
	if (m && Zn(m)) {
		let t = J(e.core?.socket?.selfId) || J(e.core?.userId);
		(Xn(t) || !Zn(t)) && (l.selfId = m, u = !0);
	}
	u && (r.socket = l, i = !0);
	let h = {}, g = !1, _ = J(t.shell?.clipboardShareDestinationIds);
	_ && (h.clipboardShareDestinationIds = _, g = !0);
	let v = J(t.shell?.clipboardInboundAllowIds);
	return v && (h.clipboardInboundAllowIds = v, g = !0), g && (n.shell = h, i = !0), i ? (n.core = r, vr(e, n)) : e;
}, _r = "req-store", Z = "settings", vr = (e, t) => !t || typeof t != "object" ? e : {
	...e,
	...t,
	core: {
		...e.core || {},
		...t.core || {},
		network: {
			...e.core?.network || {},
			...t.core?.network || {}
		},
		socket: {
			...e.core?.socket || {},
			...t.core?.socket || {}
		},
		interop: {
			...e.core?.interop || {},
			...t.core?.interop || {}
		},
		ops: {
			...e.core?.ops || {},
			...t.core?.ops || {}
		},
		admin: {
			...e.core?.admin || {},
			...t.core?.admin || {}
		}
	},
	ai: {
		...e.ai || {},
		...t.ai || {},
		mcp: t.ai?.mcp ?? e.ai?.mcp ?? [],
		customInstructions: t.ai?.customInstructions ?? e.ai?.customInstructions ?? [],
		activeInstructionId: t.ai?.activeInstructionId ?? e.ai?.activeInstructionId ?? ""
	},
	webdav: {
		...e.webdav || {},
		...t.webdav || {}
	},
	timeline: {
		...e.timeline || {},
		...t.timeline || {}
	},
	appearance: {
		...e.appearance || {},
		...t.appearance || {},
		markdown: {
			...e.appearance?.markdown || {},
			...t.appearance?.markdown || {},
			page: {
				...e.appearance?.markdown?.page || {},
				...t.appearance?.markdown?.page || {}
			},
			modules: {
				...e.appearance?.markdown?.modules || {},
				...t.appearance?.markdown?.modules || {}
			},
			plugins: {
				...e.appearance?.markdown?.plugins || {},
				...t.appearance?.markdown?.plugins || {}
			}
		}
	},
	speech: {
		...e.speech || {},
		...t.speech || {}
	},
	grid: {
		...e.grid || {},
		...t.grid || {}
	},
	shell: {
		...e.shell || {},
		...t.shell || {}
	},
	openPolicyByHost: b(e.openPolicyByHost, t.openPolicyByHost),
	openPolicy: Me({
		openPolicy: y(e.openPolicy, t.openPolicy),
		openPolicyByHost: b(e.openPolicyByHost, t.openPolicyByHost)
	})
}, yr = async () => null, br = () => {
	try {
		return typeof chrome > "u" || !chrome?.runtime ? !1 : !!(typeof window < "u" && globalThis?.location?.protocol?.startsWith("http"));
	} catch {
		return !1;
	}
}, xr = () => typeof chrome < "u" && chrome?.storage?.local;
async function Sr() {
	if (typeof indexedDB > "u") throw Error("IndexedDB not available");
	if (br()) throw Error("IndexedDB not accessible in content script context");
	return new Promise((e, t) => {
		try {
			let n = indexedDB.open(_r, 1);
			n.onupgradeneeded = () => n.result.createObjectStore(Z, { keyPath: "key" }), n.onsuccess = () => e(n.result), n.onerror = () => t(n.error);
		} catch (e) {
			t(e);
		}
	});
}
var Cr = async (e = qn) => {
	try {
		if (Y() && typeof indexedDB < "u") {
			try {
				let t = await Sr(), n = await new Promise((n, r) => {
					let i = t.transaction(Z, "readonly").objectStore(Z).get(e);
					i.onsuccess = () => {
						n(i.result?.value), t.close();
					}, i.onerror = () => {
						r(i.error), t.close();
					};
				});
				if (n != null) return n;
			} catch (e) {
				console.warn("[Settings] Capacitor IndexedDB read failed, trying mirror:", e);
			}
			let t = fr();
			if (t != null) return t;
		}
		if (xr()) {
			console.log("[Settings] Using chrome.storage.local for get");
			let t = await new Promise((t) => {
				try {
					chrome.storage.local.get([e], (n) => {
						chrome.runtime.lastError ? (console.warn("[Settings] chrome.storage.local.get error:", chrome.runtime.lastError), t(null)) : (console.log("[Settings] chrome.storage.local.get success, has data:", !!n[e]), t(n[e]));
					});
				} catch (e) {
					console.warn("[Settings] chrome.storage access failed:", e), t(null);
				}
			});
			if (t != null) return t;
		}
		if (typeof indexedDB < "u") {
			console.log("[Settings] Using IndexedDB for get");
			let t = await Sr(), n = await new Promise((n, r) => {
				let i = t.transaction(Z, "readonly").objectStore(Z).get(e);
				i.onsuccess = () => {
					console.log("[Settings] IndexedDB get success, has data:", !!i.result?.value), n(i.result?.value), t.close();
				}, i.onerror = () => {
					console.warn("[Settings] IndexedDB get error:", i.error), r(i.error), t.close();
				};
			});
			if (n != null) return n;
		} else console.warn("[Settings] IndexedDB not available");
	} catch (e) {
		console.warn("[Settings] Settings storage access failed:", e);
	}
	let t = fr();
	return t == null ? null : (console.log("[Settings] Using localStorage mirror fallback for get"), t);
}, wr = async (e, t = qn) => {
	let n = !1, r = !1;
	if (xr()) {
		await new Promise((n, r) => {
			try {
				chrome.storage.local.set({ [t]: e }, () => {
					chrome.runtime.lastError ? r(chrome.runtime.lastError) : n();
				});
			} catch (e) {
				r(e);
			}
		});
		return;
	}
	r = pr(e);
	try {
		if (typeof indexedDB > "u") {
			if (!r && Y()) throw Error("Settings storage unavailable (no IndexedDB or localStorage)");
			return;
		}
		let i = await Sr();
		await new Promise((r, a) => {
			let o = i.transaction(Z, "readwrite");
			o.objectStore(Z).put({
				key: t,
				value: e
			}), o.oncomplete = () => {
				n = !0, r(), i.close();
			}, o.onerror = () => {
				a(o.error), i.close();
			};
		});
	} catch (e) {
		if (console.warn("[Settings] IndexedDB write failed:", e), !r && Y()) throw Error("Settings could not be saved (IndexedDB and localStorage failed)");
	}
	!n && r && console.log("[Settings] persisted to localStorage mirror (IndexedDB skipped or failed)");
}, Tr = (e) => {
	let t = e.core;
	if (!t) return e;
	let n = (e) => e?.map((e) => O(e)), r = (e) => e?.map((e) => ({
		...e,
		url: O(e.url ?? "")
	})), i = t.network?.listenPortHttps === 8443 || t.network?.listenPortHttps === 8343 ? 8434 : t.network?.listenPortHttps;
	return {
		...e,
		core: {
			...t,
			endpointUrl: O(t.endpointUrl ?? ""),
			ops: t.ops ? {
				...t.ops,
				directUrl: O(t.ops.directUrl ?? ""),
				httpTargets: r(t.ops.httpTargets),
				wsTargets: r(t.ops.wsTargets),
				syncTargets: r(t.ops.syncTargets)
			} : t.ops,
			admin: t.admin ? {
				...t.admin,
				httpsOrigin: O(t.admin.httpsOrigin ?? "")
			} : t.admin,
			network: t.network ? {
				...t.network,
				listenPortHttps: i,
				destinations: n(t.network.destinations)
			} : t.network
		}
	};
}, Q = async (e) => {
	try {
		let t = await Cr();
		t ??= fr();
		let r = typeof t == "string" ? n.parse(t) : t;
		if (console.log("[Settings] loadSettings - raw type:", typeof t, "stored type:", typeof r), r && typeof r == "object") {
			let t = {
				core: {
					...x.core,
					...r?.core,
					network: {
						...x.core?.network || {},
						...r?.core?.network || {}
					},
					socket: {
						...x.core?.socket || {},
						...r?.core?.socket || {}
					},
					interop: {
						...x.core?.interop || {},
						...r?.core?.interop || {}
					},
					ops: {
						...x.core?.ops || {},
						...r?.core?.ops || {}
					},
					admin: {
						...x.core?.admin || {},
						...r?.core?.admin || {}
					}
				},
				ai: {
					...x.ai,
					...r?.ai,
					mcp: r?.ai?.mcp || [],
					customInstructions: r?.ai?.customInstructions || [],
					activeInstructionId: r?.ai?.activeInstructionId || ""
				},
				webdav: {
					...x.webdav,
					...r?.webdav
				},
				timeline: {
					...x.timeline,
					...r?.timeline
				},
				appearance: {
					...x.appearance,
					...r?.appearance,
					markdown: {
						...x.appearance?.markdown || {},
						...r?.appearance?.markdown || {},
						page: {
							...x.appearance?.markdown?.page || {},
							...r?.appearance?.markdown?.page || {}
						},
						modules: {
							...x.appearance?.markdown?.modules || {},
							...r?.appearance?.markdown?.modules || {}
						},
						plugins: {
							...x.appearance?.markdown?.plugins || {},
							...r?.appearance?.markdown?.plugins || {}
						}
					}
				},
				speech: {
					...x.speech,
					...r?.speech
				},
				grid: {
					...x.grid,
					...r?.grid
				},
				shell: {
					...x.shell || {},
					...r?.shell || {}
				},
				appMenu: {
					...x.appMenu,
					...r?.appMenu
				},
				explorer: {
					...x.explorer,
					...r?.explorer
				},
				openPolicyByHost: b(r?.openPolicyByHost),
				openPolicy: Me({
					openPolicy: r?.openPolicy,
					openPolicyByHost: r?.openPolicyByHost
				})
			};
			try {
				if (e?.nativeOverlay !== !1 && sn()) {
					let e = await ln();
					e && typeof e == "object" && (t = Y() ? hr(t, e) : gr(t, e));
				}
			} catch {}
			try {
				if ($n() && (t.core?.preferBackendSync ?? !0) !== !1) {
					let e = await ur(), n = sr({
						...e?.snapshot || e?.settings || e?.portable || {},
						...e?.settings || {},
						...e?.portable || {}
					}), r = cr(e);
					(n || r) && (t = {
						...t || { core: {} },
						core: n ? {
							...t.core || {},
							...n,
							socket: {
								...t.core?.socket || {},
								...n.socket || {}
							},
							ops: { ...t.core?.ops || {} },
							admin: { ...t.core?.admin || {} },
							network: { ...t.core?.network || {} },
							interop: { ...t.core?.interop || {} }
						} : t.core,
						shell: r ? {
							...t.shell || {},
							...r
						} : t.shell
					});
				}
			} catch {}
			console.log("[Settings] loadSettings result:", {
				hasApiKey: !!t.ai?.apiKey,
				instructionCount: t.ai?.customInstructions?.length || 0,
				activeInstructionId: t.ai?.activeInstructionId || "(none)"
			});
			let n = Tr(t);
			return Ne(n), n;
		}
		console.log("[Settings] loadSettings - no stored data, returning defaults");
	} catch (e) {
		console.warn("[Settings] loadSettings error:", e);
	}
	let t = n.parse(n.stringify(x));
	return Ne(t), t;
}, Er = async (e) => {
	let t = await Q({ nativeOverlay: !1 }), n = () => e.ai?.mcp === void 0 ? t.ai?.mcp === void 0 ? [] : t.ai.mcp : e.ai.mcp, r = () => e.ai?.customInstructions === void 0 ? t.ai?.customInstructions === void 0 ? [] : t.ai.customInstructions : e.ai.customInstructions, i = () => Object.prototype.hasOwnProperty.call(e.ai || {}, "activeInstructionId") ? e.ai?.activeInstructionId ?? "" : t.ai?.activeInstructionId === void 0 ? "" : t.ai.activeInstructionId, a = {
		core: {
			...x.core || {},
			...t.core || {},
			...e.core || {},
			network: {
				...x.core?.network || {},
				...t.core?.network || {},
				...e.core?.network || {}
			},
			socket: {
				...x.core?.socket || {},
				...t.core?.socket || {},
				...e.core?.socket || {}
			},
			interop: {
				...x.core?.interop || {},
				...t.core?.interop || {},
				...e.core?.interop || {}
			},
			ops: {
				...x.core?.ops || {},
				...t.core?.ops || {},
				...e.core?.ops || {}
			},
			admin: {
				...x.core?.admin || {},
				...t.core?.admin || {},
				...e.core?.admin || {}
			}
		},
		ai: {
			...x.ai || {},
			...t.ai || {},
			...e.ai || {},
			mcp: n(),
			customInstructions: r(),
			activeInstructionId: i()
		},
		webdav: {
			...x.webdav || {},
			...t.webdav || {},
			...e.webdav || {}
		},
		timeline: {
			...x.timeline || {},
			...t.timeline || {},
			...e.timeline || {}
		},
		appearance: {
			...x.appearance || {},
			...t.appearance || {},
			...e.appearance || {},
			markdown: {
				...x.appearance?.markdown || {},
				...t.appearance?.markdown || {},
				...e.appearance?.markdown || {},
				page: {
					...x.appearance?.markdown?.page || {},
					...t.appearance?.markdown?.page || {},
					...e.appearance?.markdown?.page || {}
				},
				modules: {
					...x.appearance?.markdown?.modules || {},
					...t.appearance?.markdown?.modules || {},
					...e.appearance?.markdown?.modules || {}
				},
				plugins: {
					...x.appearance?.markdown?.plugins || {},
					...t.appearance?.markdown?.plugins || {},
					...e.appearance?.markdown?.plugins || {}
				}
			}
		},
		speech: {
			...x.speech || {},
			...t.speech || {},
			...e.speech || {}
		},
		grid: {
			...x.grid || {},
			...t.grid || {},
			...e.grid || {}
		},
		shell: {
			...x.shell || {},
			...t.shell || {},
			...e.shell || {}
		},
		appMenu: {
			...x.appMenu || {},
			...t.appMenu || {},
			...e.appMenu || {}
		},
		explorer: {
			...x.explorer || {},
			...t.explorer || {},
			...e.explorer || {}
		},
		openPolicyByHost: (() => {
			let n = ye(), r = y(x.openPolicy, t.openPolicy, e.openPolicy);
			return b(t.openPolicyByHost, e.openPolicyByHost, { [n]: r });
		})(),
		openPolicy: Me({
			openPolicy: y(x.openPolicy, t.openPolicy, e.openPolicy),
			openPolicyByHost: b(t.openPolicyByHost, e.openPolicyByHost, { [ye()]: y(x.openPolicy, t.openPolicy, e.openPolicy) })
		})
	};
	if (a.core) {
		let e = Qn(a.core.userId);
		if (e && (a.core.userId = e), Fe(a), a.core.socket) {
			let e = String(a.core.socket.selfId || "").trim();
			if (e) {
				let t = Qn(e);
				a.core.socket.selfId = t && t === (a.core.userId || "") ? t : "";
			} else a.core.socket.selfId = "";
		}
	}
	Ne(a), await wr(a), q = { nativeSynced: null };
	try {
		if (sn()) {
			await rn().catch(() => null);
			let e = await un(a);
			q = {
				nativeSynced: e.ok,
				nativeError: e.error
			}, e.ok || console.warn("[Settings] native settings patch did not confirm ok:", e.error);
		}
	} catch (e) {
		q = {
			nativeSynced: !1,
			nativeError: String(e instanceof Error ? e.message : e)
		}, console.warn("[Settings] native settings patch failed:", e);
	}
	if ($n() && !Y() && !nr()) try {
		let e = await dr(a), t = tr();
		q = {
			...q,
			webnativeSynced: e,
			webnativeError: e ? void 0 : t === "android" ? "phone Control unreachable (Allow Control API + Pair + Accept)" : "desk Control RPC unavailable"
		}, e || console.warn("[Settings] Control config patch not confirmed");
	} catch (e) {
		q = {
			...q,
			webnativeSynced: !1,
			webnativeError: String(e instanceof Error ? e.message : e)
		}, console.warn("[Settings] Control config patch failed:", e);
	}
	try {
		Hn(a), Bn(a, { persist: !0 });
	} catch (e) {
		console.warn("[Settings] AirPad runtime sync failed:", e);
	}
	return Lr(a)?.catch?.(console.warn.bind(console)), a;
}, Dr = (e, t, n = !1) => {
	let r = (e || "/").replace(/\/+$/g, "") || "/", i = (t || "").replace(/^\/+/g, ""), a = r === "/" ? `/${i}` : `${r}/${i}`;
	return n && (a = a.replace(/\/?$/g, "/")), a.replace(/\/{2,}/g, "/");
}, Or = (e) => e?.kind === "directory", kr = (e) => {
	let t = new Date(e).getTime();
	return Number.isFinite(t) ? t : 0;
}, Ar = null, jr = () => {
	try {
		return globalThis.ServiceWorkerGlobalScope !== void 0 && globalThis.clients !== void 0 && globalThis.document === void 0;
	} catch {
		return !1;
	}
}, Mr = () => jr() ? Promise.reject(/* @__PURE__ */ Error("@fest-lib/lure FS unavailable in ServiceWorkerGlobalScope")) : (Ar ||= import("./src-pANWMrys.js").then((e) => e.t).then((e) => ({
	getDirectoryHandle: e.getDirectoryHandle,
	readFile: e.readFile
})), Ar), Nr = async (e, n = "/", r = {}, i = null) => {
	let { getDirectoryHandle: a, readFile: o } = await Mr(), s = await e?.getDirectoryContents?.(n || "/")?.catch?.((e) => (console.warn(e), []));
	if (r.pruneLocal && s?.length > 0) try {
		let e = await a(i, n)?.catch?.(() => null);
		if (e?.entries) {
			let t = await Array.fromAsync(e.entries()), n = new Set(s?.map?.((e) => e?.basename).filter(Boolean));
			await Promise.all(t.filter(([e]) => !n.has(e)).map(([t]) => e.removeEntry(t, { recursive: !0 })?.catch?.(console.warn.bind(console))));
		}
	} catch (e) {
		console.warn(e);
	}
	return Promise.all(s.map(async (n) => {
		let a = n?.type === "directory", s = a ? Dr(n.filename, "", !0) : n.filename;
		if (a) return Nr(e, s, r, i);
		if (n?.type === "file") {
			let r = kr((await o(i, s).catch(() => null))?.lastModified);
			if (kr(n?.lastmod) > r) {
				let r = await e.getFileContents(s).catch((e) => (console.warn(e), null));
				if (!r || r.byteLength === 0) return;
				let a = n?.mime || "application/octet-stream";
				return t(i, s, new File([r], n.basename, { type: a }));
			}
		}
	}));
}, Pr = async (e, t = null, n = "/", r = {}) => {
	let { getDirectoryHandle: i } = await Mr(), a = t ?? await i(null, n, { create: !0 })?.catch?.(console.warn.bind(console)), o = await Array.fromAsync(a?.entries?.() ?? []);
	if (n != "/" && r.pruneRemote && o?.length >= 0) {
		let t = await e.getDirectoryContents(n || "/").catch((e) => (console.warn(e), [])), r = new Set(o.map(([e]) => e.toLowerCase())), i = [...t.filter((e) => {
			let t = (e?.basename || "").toLowerCase();
			return t && !r.has(t);
		}).filter((e) => e.type !== "directory")];
		for (let t of i) {
			let r = t.filename || Dr(n, t.basename, t.type === "directory");
			try {
				await e.deleteFile(r);
			} catch (e) {
				console.warn("delete failed:", r, e);
			}
		}
	}
	await Promise.all(o.map(async ([t, i]) => {
		let a = Or(i), o = Dr(n, t, a);
		if (a) {
			let a = Dr(n, t, !1);
			return await e.exists(a).catch((e) => !1) || await e.createDirectory(a, { recursive: !0 }).catch(console.warn), Pr(e, i, o, r);
		}
		let s = await i.getFile();
		if (!s || s.size === 0) return;
		let c = Dr(n, t, !1), l = await e.stat(c).catch(() => null), u = kr(l?.lastmod), d = kr(s.lastModified);
		(!l || d > u) && await e.putFileContents(c, await s.arrayBuffer(), { overwrite: !0 }).catch((e) => null);
	}));
}, Fr = (e) => {
	let t = new URL(e);
	return t.protocol + t.hostname + ":" + t.port;
}, Ir = async (e, t = {}) => {
	if (console.log("[Settings] WebDavSync", e, t), !e) return null;
	let n = await yr();
	if (!n) return null;
	let r = n(Fr(e), t);
	return {
		status: $?.sync?.getDAVCompliance?.()?.catch?.(console.warn.bind(console)) ?? null,
		client: r,
		upload(e = !1) {
			if (this.status != null) return Pr(r, null, "/", { pruneRemote: e })?.catch?.((e) => (console.warn(e), []));
		},
		download(e = !1) {
			if (this.status != null) return Nr(r, "/", { pruneLocal: e })?.catch?.((e) => (console.warn(e), []));
		}
	};
}, $ = { sync: null };
br() || (async () => {
	try {
		let e = await Q();
		if (e?.core?.mode === "endpoint" && e?.core?.preferBackendSync || !e?.webdav?.url) return;
		$.sync = await Ir(e.webdav.url, {
			withCredentials: !0,
			username: e.webdav.username,
			password: e.webdav.password,
			token: e.webdav.token
		}) ?? $.sync, await $?.sync?.upload?.(!0), await $?.sync?.download?.(!0);
	} catch {}
})();
var Lr = async (e) => {
	if (e ||= await Q(), e?.core?.mode === "endpoint" && e?.core?.preferBackendSync) {
		$.sync = null;
		return;
	}
	e?.webdav?.url && ($.sync = await Ir(e.webdav.url, {
		withCredentials: !0,
		username: e.webdav.username,
		password: e.webdav.password,
		token: e.webdav.token
	}) ?? $.sync, await $?.sync?.upload?.(), await $?.sync?.download?.(!0));
};
if (!br()) {
	try {
		typeof window < "u" && typeof addEventListener == "function" && (addEventListener("pagehide", () => {
			$?.sync?.upload?.()?.catch?.(() => {});
		}), addEventListener("beforeunload", () => {
			$?.sync?.upload?.()?.catch?.(() => {});
		}));
	} catch {}
	(async () => {
		try {
			for (;;) await $?.sync?.upload?.()?.catch?.(() => {}), await new Promise((e) => setTimeout(e, 3e3));
		} catch {}
	})();
}
//#endregion
export { de as a, x as i, Q as n, pe as o, Er as r, me as s, Kn as t };
