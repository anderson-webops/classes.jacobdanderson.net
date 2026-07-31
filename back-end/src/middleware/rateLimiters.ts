import type { Request } from "express";
import type { RateLimitRequestHandler } from "express-rate-limit";
import { createHash } from "node:crypto";
import { env } from "node:process";
import rateLimit from "express-rate-limit";
import { productionRateLimitStore } from "./mongoRateLimitStore.js";
import {
	codeIdeProjectPayloadIdentity,
	HEAVY_CODE_IDE_PROJECT_PAYLOAD_THRESHOLD_BYTES,
	isHeavyCodeIdeProjectPayload
} from "./projectPayload.js";

interface TunableRateLimitOptions {
	limit?: number;
	windowMs?: number;
}

interface HeavyProjectRateLimitOptions extends TunableRateLimitOptions {
	heavyThresholdBytes?: number;
}

const DATABASE_BACKED_API_PATH = /^\/(?:accounts|admins|course-access|tutors|users|_dbinfo)(?:\/|$)/i;
const PROJECT_WRITE_METHODS = new Set(["DELETE", "PATCH", "POST", "PUT"]);
export const codeIdeProjectApiMountPath
	= /^\/users\/(?:python-projects\/shared|loggedin\/python-projects|loggedin\/python-project-reviews|[^/]+\/python-projects)(?=\/|$)/i;

function configuredPositiveInteger(name: string, fallback: number) {
	const value = env[name]?.trim();
	if (!value) return fallback;

	const parsed = Number(value);
	if (!Number.isSafeInteger(parsed) || parsed <= 0) {
		throw new TypeError(`${name} must be a positive integer`);
	}
	return parsed;
}

const standardRateLimitHeaders = {
	standardHeaders: true,
	legacyHeaders: false
} as const;

function storeOptions(prefix: string) {
	const store = productionRateLimitStore(prefix);
	return store ? { store } : {};
}

function normalizedEmailKey(req: Request) {
	const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "missing-email";
	return createHash("sha256").update(email).digest("hex");
}

function codeIdeProjectAccountKey(req: Request) {
	return codeIdeProjectPayloadIdentity(req);
}

export function createApiIngressLimiter(options: TunableRateLimitOptions = {}): RateLimitRequestHandler {
	return rateLimit({
		windowMs: configuredPositiveInteger("API_INGRESS_RATE_WINDOW_MS", 15 * 60 * 1000),
		// Forty students making one request every two seconds generate 18,000
		// requests per 15 minutes. Keep this coarse pre-parser ceiling above that
		// classroom load while still bounding gross database-backed API floods.
		limit: configuredPositiveInteger("API_INGRESS_RATE_MAX", 30_000),
		...standardRateLimitHeaders,
		...storeOptions("api-ingress"),
		skip: req => !DATABASE_BACKED_API_PATH.test(req.path),
		message: {
			message: "Too many requests from this network. Please wait and try again."
		},
		...options
	});
}

export function createCodeIdeProjectIngressLimiter(options: TunableRateLimitOptions = {}): RateLimitRequestHandler {
	return rateLimit({
		windowMs: configuredPositiveInteger("CODE_IDE_PROJECT_INGRESS_RATE_WINDOW_MS", 15 * 60 * 1000),
		// This shared-network ceiling covers forty simultaneous editors saving
		// every two seconds. The per-account limiter below supplies the tighter
		// abuse boundary without penalizing a school NAT.
		limit: configuredPositiveInteger("CODE_IDE_PROJECT_INGRESS_RATE_MAX", 18_000),
		...standardRateLimitHeaders,
		...storeOptions("code-ide-project-ingress"),
		skip: req => !PROJECT_WRITE_METHODS.has(req.method),
		message: {
			message: "Too many project changes from this network. Please wait and try again."
		},
		...options
	});
}

export function createCodeIdeProjectAccountWriteLimiter(
	options: TunableRateLimitOptions = {}
): RateLimitRequestHandler {
	return rateLimit({
		windowMs: configuredPositiveInteger("CODE_IDE_PROJECT_ACCOUNT_RATE_WINDOW_MS", 15 * 60 * 1000),
		// Two writes per second for one account leaves ample room for the
		// editor's pause-based autosave while bounding a single abusive session.
		limit: configuredPositiveInteger("CODE_IDE_PROJECT_ACCOUNT_RATE_MAX", 1_800),
		...standardRateLimitHeaders,
		...storeOptions("code-ide-project-account-write"),
		keyGenerator: codeIdeProjectAccountKey,
		skip: req => !PROJECT_WRITE_METHODS.has(req.method),
		message: {
			message: "Too many project changes. Please wait and try again."
		},
		...options
	});
}

export function createCodeIdeProjectDataAccessLimiter(
	options: TunableRateLimitOptions = {}
): RateLimitRequestHandler {
	return rateLimit({
		windowMs: configuredPositiveInteger(
			"CODE_IDE_PROJECT_DATA_RATE_WINDOW_MS",
			15 * 60 * 1000
		),
		limit: configuredPositiveInteger("CODE_IDE_PROJECT_DATA_RATE_MAX", 600),
		...standardRateLimitHeaders,
		...storeOptions("code-ide-project-data"),
		keyGenerator: codeIdeProjectPayloadIdentity,
		message: {
			message: "Too many project requests. Please wait and try again."
		},
		...options
	});
}

export function createCodeIdeHeavyProjectPayloadLimiter(
	options: HeavyProjectRateLimitOptions = {}
): RateLimitRequestHandler {
	const {
		heavyThresholdBytes =
			HEAVY_CODE_IDE_PROJECT_PAYLOAD_THRESHOLD_BYTES,
		...rateOptions
	} = options;
	return rateLimit({
		windowMs: configuredPositiveInteger(
			"CODE_IDE_HEAVY_PROJECT_RATE_WINDOW_MS",
			15 * 60 * 1000
		),
		limit: configuredPositiveInteger(
			"CODE_IDE_HEAVY_PROJECT_RATE_MAX",
			20
		),
		...standardRateLimitHeaders,
		...storeOptions("code-ide-heavy-project"),
		keyGenerator: codeIdeProjectPayloadIdentity,
		skip: req =>
			!isHeavyCodeIdeProjectPayload(req, heavyThresholdBytes),
		message: {
			message: "Too many large project saves. Please wait and try again."
		},
		...rateOptions
	});
}

export function createLoginIpLimiter(options: TunableRateLimitOptions = {}): RateLimitRequestHandler {
	return rateLimit({
		windowMs: configuredPositiveInteger("LOGIN_RATE_WINDOW_MS", 15 * 60 * 1000),
		limit: configuredPositiveInteger("LOGIN_RATE_MAX", 30),
		...standardRateLimitHeaders,
		...storeOptions("login-ip"),
		skipSuccessfulRequests: true,
		message: {
			message: "Too many login attempts. Please wait and try again."
		},
		...options
	});
}

export function createLoginAccountLimiter(options: TunableRateLimitOptions = {}): RateLimitRequestHandler {
	return rateLimit({
		windowMs: configuredPositiveInteger("LOGIN_ACCOUNT_RATE_WINDOW_MS", 15 * 60 * 1000),
		limit: configuredPositiveInteger("LOGIN_ACCOUNT_RATE_MAX", 10),
		...standardRateLimitHeaders,
		...storeOptions("login-account"),
		keyGenerator: normalizedEmailKey,
		skipSuccessfulRequests: true,
		message: {
			message: "Too many login attempts. Please wait and try again."
		},
		...options
	});
}

export function createSignupLimiter(options: TunableRateLimitOptions = {}): RateLimitRequestHandler {
	return rateLimit({
		windowMs: configuredPositiveInteger("SIGNUP_RATE_WINDOW_MS", 60 * 60 * 1000),
		limit: configuredPositiveInteger("SIGNUP_RATE_MAX", 5),
		...standardRateLimitHeaders,
		...storeOptions("signup"),
		message: {
			message: "Too many account creation attempts. Please wait and try again."
		},
		...options
	});
}

export function createEmailCheckLimiter(options: TunableRateLimitOptions = {}): RateLimitRequestHandler {
	return rateLimit({
		windowMs: configuredPositiveInteger("EMAIL_CHECK_RATE_WINDOW_MS", 15 * 60 * 1000),
		limit: configuredPositiveInteger("EMAIL_CHECK_RATE_MAX", 30),
		...standardRateLimitHeaders,
		...storeOptions("email-check"),
		message: {
			message: "Too many email checks. Please wait and try again."
		},
		...options
	});
}

export function createUserCourseAccessLimiter(options: TunableRateLimitOptions = {}): RateLimitRequestHandler {
	return rateLimit({
		windowMs: 15 * 60 * 1000,
		limit: 100,
		...standardRateLimitHeaders,
		...storeOptions("course-management"),
		...options
	});
}

export function createAdminMailLimiter(options: TunableRateLimitOptions = {}): RateLimitRequestHandler {
	return rateLimit({
		windowMs: configuredPositiveInteger("RATE_WINDOW_MS", 60000),
		limit: configuredPositiveInteger("RATE_MAX", 20),
		...standardRateLimitHeaders,
		...storeOptions("admin-mail"),
		message: { message: "Too many requests, slow down." },
		...options
	});
}

export function createPasswordResetLimiter(options: TunableRateLimitOptions = {}): RateLimitRequestHandler {
	return rateLimit({
		windowMs: configuredPositiveInteger("PASSWORD_RESET_RATE_WINDOW_MS", 15 * 60 * 1000),
		limit: configuredPositiveInteger("PASSWORD_RESET_RATE_MAX", 5),
		...standardRateLimitHeaders,
		...storeOptions("password-reset"),
		message: {
			message: "Too many password reset attempts. Please wait and try again."
		},
		...options
	});
}

export function createPasswordResetAccountLimiter(options: TunableRateLimitOptions = {}): RateLimitRequestHandler {
	return rateLimit({
		windowMs: configuredPositiveInteger("PASSWORD_RESET_ACCOUNT_RATE_WINDOW_MS", 60 * 60 * 1000),
		limit: configuredPositiveInteger("PASSWORD_RESET_ACCOUNT_RATE_MAX", 3),
		...standardRateLimitHeaders,
		...storeOptions("password-reset-account"),
		keyGenerator: normalizedEmailKey,
		message: {
			message: "Too many password reset attempts. Please wait and try again."
		},
		...options
	});
}

export function createOAuthLoginLimiter(options: TunableRateLimitOptions = {}): RateLimitRequestHandler {
	return rateLimit({
		windowMs: configuredPositiveInteger("OAUTH_RATE_WINDOW_MS", 15 * 60 * 1000),
		limit: configuredPositiveInteger("OAUTH_RATE_MAX", 30),
		...standardRateLimitHeaders,
		...storeOptions("oauth"),
		message: {
			message: "Too many login attempts. Please wait and try again."
		},
		...options
	});
}

export function createCourseCodeRedemptionLimiter(options: TunableRateLimitOptions = {}): RateLimitRequestHandler {
	return rateLimit({
		windowMs: configuredPositiveInteger("COURSE_CODE_RATE_WINDOW_MS", 15 * 60 * 1000),
		limit: configuredPositiveInteger("COURSE_CODE_RATE_MAX", 60),
		...standardRateLimitHeaders,
		...storeOptions("course-code-redemption"),
		message: {
			message: "Too many course code attempts. Please wait and try again."
		},
		...options
	});
}
