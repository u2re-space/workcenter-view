//#region ../../projects/subsystem/src/other/config/Names.ts
var e = {
	SHARE_TARGET: "rs-share-target",
	TOAST: "rs-toast",
	CLIPBOARD: "rs-clipboard",
	WORK_CENTER: "rs-workcenter",
	MARKDOWN_VIEWER: "rs-markdown-viewer",
	SETTINGS: "rs-settings",
	GENERAL: "rs-app-general",
	MINIMAL_APP: "minimal-app",
	MAIN_APP: "main-app",
	FILE_EXPLORER: "file-explorer",
	PRINT_VIEWER: "print-viewer",
	SETTINGS_VIEWER: "settings-viewer",
	HISTORY_VIEWER: "history-viewer",
	MARKDOWN_VIEWER_CHANNEL: "markdown-viewer",
	FILE_EXPLORER_CHANNEL: "file-explorer",
	SETTINGS_CHANNEL: "settings",
	HISTORY_CHANNEL: "history",
	PRINT_CHANNEL: "print",
	SERVICE_WORKCENTER: "rs-service-workcenter",
	SERVICE_SETTINGS: "rs-service-settings",
	SERVICE_VIEWER: "rs-service-viewer",
	SERVICE_EXPLORER: "rs-service-explorer",
	SERVICE_AIRPAD: "rs-service-airpad",
	SERVICE_NETWORK: "rs-service-network",
	SERVICE_PRINT: "rs-service-print",
	SERVICE_HISTORY: "rs-service-history",
	SERVICE_EDITOR: "rs-service-editor",
	SERVICE_HOME: "rs-service-home"
}, t = {
	WORK_CENTER: "workcenter",
	MARKDOWN_VIEWER: "markdown-viewer",
	MARKDOWN_EDITOR: "markdown-editor",
	RICH_EDITOR: "rich-editor",
	SETTINGS: "settings",
	HISTORY: "history",
	FILE_PICKER: "file-picker",
	FILE_EXPLORER: "file-explorer",
	WORKCENTER_CORE: "workcenter-core",
	BASIC_WORKCENTER: "basic-workcenter",
	BASIC_VIEWER: "basic-viewer",
	BASIC_EXPLORER: "basic-explorer",
	BASIC_SETTINGS: "basic-settings",
	BASIC_HISTORY: "basic-history",
	BASIC_PRINT: "basic-print",
	AIRPAD: "airpad",
	NETWORK: "network",
	HOME: "home",
	EDITOR: "editor",
	VIEWER: "viewer",
	EXPLORER: "explorer",
	PRINT: "print"
}, n = {
	MARKDOWN_VIEWER: "#markdown-viewer",
	MARKDOWN_EDITOR: "#markdown-editor",
	RICH_EDITOR: "#rich-editor",
	SETTINGS: "#settings",
	HISTORY: "#history",
	WORKCENTER: "#workcenter",
	FILE_PICKER: "#file-picker",
	FILE_EXPLORER: "#file-explorer",
	PRINT: "#print",
	AIRPAD: "#airpad",
	NETWORK: "#network",
	WORKCENTER_FILES: "#workcenter-files",
	WORKCENTER_TEXT: "#workcenter-text",
	WORKCENTER_IMAGES: "#workcenter-images",
	WORKCENTER_PROCESSING: "#workcenter-processing",
	SHARE_TARGET_TEXT: "#share-target-text",
	SHARE_TARGET_FILES: "#share-target-files",
	SHARE_TARGET_URL: "#share-target-url",
	SHARE_TARGET_IMAGE: "#share-target-image"
}, r = {
	WORKCENTER: "workcenter",
	CLIPBOARD: "clipboard",
	VIEWER: "viewer",
	MARKDOWN_VIEWER: "markdown-viewer",
	SETTINGS: "settings",
	HISTORY: "history",
	EXPLORER: "explorer",
	FILE_EXPLORER: "file-explorer",
	PRINT: "print",
	PRINT_VIEWER: "print-viewer",
	EDITOR: "editor",
	AIRPAD: "airpad",
	HOME: "home",
	BASIC_APP: "basic-app",
	MAIN_APP: "main-app"
}, i = {
	viewer: [
		r.VIEWER,
		r.MARKDOWN_VIEWER,
		t.BASIC_VIEWER
	],
	workcenter: [
		r.WORKCENTER,
		t.BASIC_WORKCENTER,
		t.WORKCENTER_CORE
	],
	explorer: [
		r.EXPLORER,
		r.FILE_EXPLORER,
		t.BASIC_EXPLORER
	],
	editor: [
		r.EDITOR,
		t.MARKDOWN_EDITOR,
		t.RICH_EDITOR
	],
	settings: [
		r.SETTINGS,
		e.SETTINGS_CHANNEL,
		t.BASIC_SETTINGS
	],
	history: [
		r.HISTORY,
		e.HISTORY_CHANNEL,
		t.BASIC_HISTORY
	],
	print: [
		r.PRINT,
		r.PRINT_VIEWER,
		t.BASIC_PRINT
	],
	airpad: [r.AIRPAD],
	home: [r.HOME],
	clipboard: [r.CLIPBOARD],
	"basic-app": [r.BASIC_APP],
	"main-app": [r.MAIN_APP]
}, a = Object.entries(i).reduce((e, [t, n]) => {
	e[t] = t;
	for (let r of n) e[String(r).toLowerCase()] = t;
	return e;
}, {}), o = (e) => {
	let t = String(e || "").trim().toLowerCase();
	return t ? a[t] || t : "";
}, s = (e) => {
	let t = o(e);
	return t ? [.../* @__PURE__ */ new Set([t, ...i[t] || []])] : [];
}, c = (t) => {
	switch (o(t)) {
		case "viewer": return e.MARKDOWN_VIEWER;
		case "workcenter": return e.WORK_CENTER;
		case "explorer": return e.FILE_EXPLORER;
		case "settings": return e.SETTINGS;
		case "history": return e.HISTORY_VIEWER;
		case "print": return e.PRINT_VIEWER;
		case "clipboard": return e.CLIPBOARD;
		case "main-app": return e.MAIN_APP;
		case "basic-app": return e.MINIMAL_APP;
		default: return null;
	}
}, l = () => {
	let e = {};
	for (let t of Object.keys(i)) {
		let n = c(t);
		if (n) for (let r of s(t)) e[r] = n;
	}
	return e;
};
e.SERVICE_WORKCENTER, e.SERVICE_SETTINGS, e.SERVICE_VIEWER, e.SERVICE_EXPLORER, e.SERVICE_AIRPAD, e.SERVICE_NETWORK, e.SERVICE_PRINT, e.SERVICE_HISTORY, e.SERVICE_EDITOR, e.SERVICE_HOME, n.WORKCENTER, n.SETTINGS, n.MARKDOWN_VIEWER, n.FILE_EXPLORER, n.NETWORK, n.PRINT, n.HISTORY, n.MARKDOWN_EDITOR;
//#endregion
//#region ../../projects/subsystem/src/routing/channel/UniformInterop.ts
var u = {
	"chrome-runtime": "chrome",
	"chrome-tabs": "chrome",
	"chrome-port": "chrome",
	"chrome-external": "chrome",
	"service-worker": "worker",
	"service-worker:http": "worker",
	service: "worker",
	sw: "worker",
	"broadcast-channel": "broadcast",
	broadcastchannel: "broadcast",
	websocket: "socket",
	ws: "socket",
	"socket-io": "socket",
	socketio: "socket"
}, d = {
	service: "service-worker",
	"service-worker:http": "service-worker",
	sw: "service-worker",
	ws: "websocket",
	socket: "websocket",
	socketio: "socket-io",
	chrome: "chrome-runtime"
}, f = /* @__PURE__ */ new Set([
	"invoke",
	"mail",
	"attach",
	"deliver",
	"defer"
]), p = () => typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `interop_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`, m = (e) => {
	let t = Array.isArray(e) ? e : e ? [e] : ["mail"], n = [];
	for (let e of t) f.has(e) && !n.includes(e) && n.push(e);
	return n.length > 0 ? n : ["mail"];
}, h = (e) => {
	let t = String(e || "").trim().toLowerCase();
	return t ? u[t] || t : "unknown";
}, g = (e) => {
	let t = String(e || "").trim().toLowerCase();
	if (t) return d[t] || t;
}, _ = (e) => {
	let t = String(e.id || e.uuid || "").trim() || p(), n = String(e.source || e.sender || e.srcChannel || "interop").trim() || "interop", r = o(e.destination || e.target), i = Array.isArray(e.destinations) && e.destinations.length > 0 ? [...new Set(e.destinations.map((e) => o(e)).filter(Boolean))] : r ? s(r) : [], a = e.payload ?? e.data, c = Number(e.timestamp ?? Date.now()) || Date.now();
	return {
		id: t,
		uuid: t,
		type: String(e.type || "request"),
		source: n,
		sender: String(e.sender || n),
		destination: r || void 0,
		target: r || void 0,
		contentType: e.contentType ? String(e.contentType) : void 0,
		data: a,
		payload: a,
		metadata: {
			timestamp: c,
			...e.metadata || {}
		},
		purpose: m(e.purpose),
		protocol: h(e.protocol),
		transport: g(e.transport),
		redirect: !!e.redirect,
		flags: { ...e.flags || {} },
		op: String(e.op || (String(e.type || "").startsWith("response:") ? "response" : "deliver")),
		timestamp: c,
		srcChannel: String(e.srcChannel || n),
		dstChannel: e.dstChannel ?? (r || void 0),
		destinations: i,
		ids: {
			byId: n,
			from: n,
			sender: n,
			destinations: i,
			...e.ids || {}
		},
		urls: Array.isArray(e.urls) ? [...e.urls] : [],
		tokens: Array.isArray(e.tokens) ? [...e.tokens] : [],
		toRoles: Array.isArray(e.toRoles) ? [...e.toRoles] : [],
		tabId: e.tabId,
		frameId: e.frameId,
		status: typeof e.status == "number" ? e.status : void 0,
		result: e.result,
		results: e.results,
		error: e.error
	};
}, v = (e) => {
	let t = _(e);
	return {
		id: t.id,
		type: t.type,
		source: t.source,
		destination: t.destination,
		contentType: t.contentType,
		data: t.data,
		metadata: {
			...t.metadata,
			protocol: t.protocol,
			transport: t.transport,
			sender: t.sender,
			srcChannel: t.srcChannel,
			dstChannel: t.dstChannel,
			destinations: t.destinations,
			ids: t.ids,
			flags: t.flags,
			status: t.status,
			error: t.error
		}
	};
};
//#endregion
export { n as a, r as i, v as n, l as o, e as r, o as s, _ as t };
