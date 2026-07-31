import type cookieSession from "cookie-session";
import { Buffer } from "node:buffer";

type CookieSessionOptions = Parameters<typeof cookieSession>[0];

const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;
export const MIN_PRODUCTION_SESSION_SECRET_BYTES = 32;

export function readSessionSecret(
	value: string | undefined,
	isProduction: boolean
) {
	if (!value || !value.trim()) {
		throw new Error("Missing SESSION_SECRET");
	}
	if (
		isProduction
		&& Buffer.byteLength(value, "utf8")
		< MIN_PRODUCTION_SESSION_SECRET_BYTES
	) {
		throw new Error(
			`SESSION_SECRET must be at least ${MIN_PRODUCTION_SESSION_SECRET_BYTES} UTF-8 bytes in production`
		);
	}
	return value;
}

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
		name: isProduction ? "__Host-session" : "session",
		overwrite: true,
		path: "/"
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

export function readTrustProxySetting(
	value: string | undefined,
	isProduction: boolean
) {
	if (!isProduction) return false;
	const normalized = value?.trim();
	if (!normalized || normalized === "loopback") return "loopback";
	if (/^[1-3]$/.test(normalized)) return Number(normalized);
	throw new TypeError(
		"TRUST_PROXY must be loopback or a hop count from 1 through 3"
	);
}

export function serverListenHost(isProduction: boolean, configuredHost: string | undefined) {
	if (!isProduction) return "127.0.0.1";
	return configuredHost?.trim() || "127.0.0.1";
}
