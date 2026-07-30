import type cookieSession from "cookie-session";

type CookieSessionOptions = Parameters<typeof cookieSession>[0];

const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export function crossSiteSessionCookiesEnabled(value: string | undefined) {
	const normalized = value?.trim().toLowerCase();
	if (!normalized || normalized === "false") return false;
	if (normalized === "true") return true;
	throw new TypeError("CROSS_SITE must be true or false");
}

export function createSessionCookieOptions({
	crossSite,
	isProduction,
	sessionSecret
}: {
	crossSite: boolean;
	isProduction: boolean;
	sessionSecret: string;
}): CookieSessionOptions {
	const sharedOptions = {
		httpOnly: true,
		keys: [sessionSecret],
		maxAge: SESSION_MAX_AGE_MS,
		name: "session"
	};

	if (isProduction) {
		return {
			...sharedOptions,
			sameSite: crossSite ? "none" : "lax",
			secure: true
		};
	}

	return {
		...sharedOptions,
		sameSite: "lax"
	};
}

export function serverListenHost(isProduction: boolean, configuredHost: string | undefined) {
	if (!isProduction) return "127.0.0.1";
	return configuredHost?.trim() || undefined;
}
