//#region ../../projects/subsystem/src/other/config/settings/crx-control-session.ts
var e = "cwsp-control-session-v1", t = () => {
	try {
		return typeof chrome < "u" && chrome?.storage?.local ? chrome : null;
	} catch {
		return null;
	}
}, n = async () => {
	let n = t();
	if (!n) return null;
	try {
		let t = (await n.storage.local.get(e))?.[e];
		if (!t || typeof t != "object") return null;
		let r = String(t.token || "").trim(), i = String(t.origin || "").trim(), a = String(t.controlHost || "").trim(), o = Number(t.expiresAt) || 0;
		return !r || !i || o <= Date.now() ? null : {
			token: r,
			origin: i,
			controlHost: a,
			expiresAt: o,
			persistent: !0,
			pairedAt: Number(t.pairedAt) || 0
		};
	} catch {
		return null;
	}
}, r = async () => {
	let n = t();
	if (n) try {
		await n.storage.local.remove(e);
	} catch {}
}, i = async () => (await n())?.token || "";
//#endregion
export { r as clearCrxControlSession, i as getCrxControlSessionToken };
