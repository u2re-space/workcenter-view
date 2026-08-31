import { r as e } from "./rolldown-runtime-CEFd7nDs.js";
import { t } from "./src-CsRMoM8y.js";
import { i as n, n as r, o as i, r as a, s as o } from "./UniformInterop-BbBJGEwJ.js";
import "./core-CTYSu78L.js";
//#region ../../projects/subsystem/src/routing/api/process-api.ts
var s = "https://process.u2re.space", c = "/api/process", l = {
	processing: "processing",
	recognize: "ai/recognize",
	analyze: "ai/analyze",
	health: "health"
}, u = /* @__PURE__ */ new Set([
	"process.u2re.space",
	"workcenter.u2re.space",
	"u2re.space",
	"www.u2re.space"
]), d = (e) => e === "chrome-extension:" || e === "moz-extension:" || e === "safari-web-extension:", f = () => {
	try {
		let e = globalThis;
		return typeof e.Capacitor?.isNativePlatform == "function" && e.Capacitor.isNativePlatform();
	} catch {
		return !1;
	}
}, p = () => {
	try {
		let e = String(globalThis.location?.protocol || "").toLowerCase();
		if (d(e) || f()) return !0;
		let t = String(globalThis.location?.hostname || "").toLowerCase();
		return t ? u.has(t) ? !1 : t === "localhost" || t === "127.0.0.1" || e !== "http:" && e !== "https:" : !0;
	} catch {
		return !0;
	}
}, m = (e = "processing") => `${c}/${l[e]}`, h = (e = "processing") => {
	let t = m(e);
	return p() ? `${s}${t}` : t;
}, g = () => h("processing"), _ = {
	"share-target": {
		processingUrl: g(),
		contentAction: {
			onResult: "write-clipboard",
			onAccept: "attach-to-associated",
			doProcess: "instantly",
			openApp: !0
		},
		supportedContentTypes: [
			"text",
			"markdown",
			"image",
			"url"
		],
		defaultOverrideFactors: []
	},
	"launch-queue": {
		processingUrl: g(),
		contentAction: {
			onResult: "none",
			onAccept: "attach-to-associated",
			doProcess: "manually",
			openApp: !0
		},
		supportedContentTypes: [
			"file",
			"blob",
			"text",
			"markdown",
			"image"
		],
		defaultOverrideFactors: []
	},
	"crx-snip": {
		processingUrl: g(),
		contentAction: {
			onResult: "write-clipboard",
			onAccept: "attach-to-associated",
			doProcess: "instantly",
			openApp: !1
		},
		supportedContentTypes: ["text", "image"],
		defaultOverrideFactors: ["force-processing"]
	},
	paste: {
		processingUrl: g(),
		contentAction: {
			onResult: "none",
			onAccept: "attach-to-associated",
			doProcess: "manually",
			openApp: !1
		},
		supportedContentTypes: [
			"text",
			"markdown",
			"image"
		],
		defaultOverrideFactors: [],
		associationOverrides: {
			text: ["user-action"],
			markdown: ["user-action"]
		}
	},
	drop: {
		processingUrl: g(),
		contentAction: {
			onResult: "none",
			onAccept: "attach-to-associated",
			doProcess: "manually",
			openApp: !1
		},
		supportedContentTypes: [
			"file",
			"blob",
			"text",
			"markdown",
			"image"
		],
		defaultOverrideFactors: [],
		associationOverrides: {
			file: ["user-action"],
			blob: ["user-action"]
		}
	},
	"button-attach-workcenter": {
		processingUrl: g(),
		contentAction: {
			onResult: "none",
			onAccept: "attach-to-workcenter",
			doProcess: "manually",
			openApp: !1
		},
		supportedContentTypes: [
			"text",
			"markdown",
			"image",
			"file"
		],
		defaultOverrideFactors: ["explicit-workcenter"],
		associationOverrides: {
			markdown: ["explicit-workcenter"],
			text: ["explicit-workcenter"],
			image: ["explicit-workcenter"],
			file: ["explicit-workcenter"]
		}
	}
};
Object.fromEntries(Object.entries(_).map(([e, t]) => [e, {
	processingUrl: t.processingUrl,
	contentAction: t.contentAction,
	...t.supportedContentTypes && { supportedContentTypes: t.supportedContentTypes }
}]));
//#endregion
//#region ../../projects/subsystem/src/routing/channel/UnifiedMessaging.ts
var v = {
	...i(),
	[n.WORKCENTER]: a.WORK_CENTER,
	[n.CLIPBOARD]: a.CLIPBOARD
}, y = null;
function b() {
	return y ||= t({
		channelMappings: v,
		queueOptions: {
			dbName: "CWSP-shellMessageQueue",
			storeName: "messages",
			maxRetries: 3,
			defaultExpirationMs: 864e5
		},
		pendingStoreOptions: {
			storageKey: "rs-unified-messaging-pending",
			maxMessages: 200,
			defaultTTLMs: 864e5
		}
	}), y;
}
var x = b();
function S(e) {
	return x.sendMessage(r({
		...e,
		source: e.source ?? "unified-messaging"
	}));
}
function C(e) {
	return x.initializeComponent(e);
}
function w(e, t) {
	x.registerComponent(e, o(t) || t);
}
//#endregion
//#region ../../projects/subsystem/runtime/messaging.ts
var T = /* @__PURE__ */ e({
	getUnifiedMessaging: () => b,
	initializeComponent: () => C,
	registerComponent: () => w,
	sendMessage: () => S,
	unifiedMessaging: () => x
});
//#endregion
export { S as i, C as n, w as r, T as t };
