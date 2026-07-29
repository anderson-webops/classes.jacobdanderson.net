import type { Request } from "express";
import type { RateLimitRequestHandler } from "express-rate-limit";
import { createHash } from "node:crypto";
import { env } from "node:process";
import rateLimit from "express-rate-limit";
import { productionRateLimitStore } from "./mongoRateLimitStore.js";

interface TunableRateLimitOptions {
	limit?: number;
	windowMs?: number;
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
	const email = typeof req.body?.email === "string"
		? req.body.email.trim().toLowerCase()
		: "missing-email";
	return createHash("sha256").update(email).digest("hex");
}

export function createLoginIpLimiter(
	options: TunableRateLimitOptions = {}
): RateLimitRequestHandler {
	return rateLimit({
		windowMs: Number(env.LOGIN_RATE_WINDOW_MS || 15 * 60 * 1000),
		limit: Number(env.LOGIN_RATE_MAX || 30),
		...standardRateLimitHeaders,
		...storeOptions("login-ip"),
		skipSuccessfulRequests: true,
		message: {
			message: "Too many login attempts. Please wait and try again."
		},
		...options
	});
}

export function createLoginAccountLimiter(
	options: TunableRateLimitOptions = {}
): RateLimitRequestHandler {
	return rateLimit({
		windowMs: Number(env.LOGIN_ACCOUNT_RATE_WINDOW_MS || 15 * 60 * 1000),
		limit: Number(env.LOGIN_ACCOUNT_RATE_MAX || 10),
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

export function createSignupLimiter(
	options: TunableRateLimitOptions = {}
): RateLimitRequestHandler {
	return rateLimit({
		windowMs: Number(env.SIGNUP_RATE_WINDOW_MS || 60 * 60 * 1000),
		limit: Number(env.SIGNUP_RATE_MAX || 5),
		...standardRateLimitHeaders,
		...storeOptions("signup"),
		message: {
			message: "Too many account creation attempts. Please wait and try again."
		},
		...options
	});
}

export function createEmailCheckLimiter(
	options: TunableRateLimitOptions = {}
): RateLimitRequestHandler {
	return rateLimit({
		windowMs: Number(env.EMAIL_CHECK_RATE_WINDOW_MS || 15 * 60 * 1000),
		limit: Number(env.EMAIL_CHECK_RATE_MAX || 30),
		...standardRateLimitHeaders,
		...storeOptions("email-check"),
		message: {
			message: "Too many email checks. Please wait and try again."
		},
		...options
	});
}

export function createUserCourseAccessLimiter(
	options: TunableRateLimitOptions = {}
): RateLimitRequestHandler {
	return rateLimit({
		windowMs: 15 * 60 * 1000,
		limit: 100,
		...standardRateLimitHeaders,
		...storeOptions("course-management"),
		...options
	});
}

export function createAdminMailLimiter(
	options: TunableRateLimitOptions = {}
): RateLimitRequestHandler {
	return rateLimit({
		windowMs: Number(env.RATE_WINDOW_MS || 60000),
		limit: Number(env.RATE_MAX || 20),
		...standardRateLimitHeaders,
		...storeOptions("admin-mail"),
		message: { message: "Too many requests, slow down." },
		...options
	});
}

export function createPasswordResetLimiter(
	options: TunableRateLimitOptions = {}
): RateLimitRequestHandler {
	return rateLimit({
		windowMs: Number(env.PASSWORD_RESET_RATE_WINDOW_MS || 15 * 60 * 1000),
		limit: Number(env.PASSWORD_RESET_RATE_MAX || 5),
		...standardRateLimitHeaders,
		...storeOptions("password-reset"),
		message: {
			message: "Too many password reset attempts. Please wait and try again."
		},
		...options
	});
}

export function createPasswordResetAccountLimiter(
	options: TunableRateLimitOptions = {}
): RateLimitRequestHandler {
	return rateLimit({
		windowMs: Number(
			env.PASSWORD_RESET_ACCOUNT_RATE_WINDOW_MS || 60 * 60 * 1000
		),
		limit: Number(env.PASSWORD_RESET_ACCOUNT_RATE_MAX || 3),
		...standardRateLimitHeaders,
		...storeOptions("password-reset-account"),
		keyGenerator: normalizedEmailKey,
		message: {
			message: "Too many password reset attempts. Please wait and try again."
		},
		...options
	});
}

export function createOAuthLoginLimiter(
	options: TunableRateLimitOptions = {}
): RateLimitRequestHandler {
	return rateLimit({
		windowMs: Number(env.OAUTH_RATE_WINDOW_MS || 15 * 60 * 1000),
		limit: Number(env.OAUTH_RATE_MAX || 30),
		...standardRateLimitHeaders,
		...storeOptions("oauth"),
		message: {
			message: "Too many login attempts. Please wait and try again."
		},
		...options
	});
}

export function createCourseCodeRedemptionLimiter(
	options: TunableRateLimitOptions = {}
): RateLimitRequestHandler {
	return rateLimit({
		windowMs: Number(env.COURSE_CODE_RATE_WINDOW_MS || 15 * 60 * 1000),
		limit: Number(env.COURSE_CODE_RATE_MAX || 60),
		...standardRateLimitHeaders,
		...storeOptions("course-code-redemption"),
		message: {
			message: "Too many course code attempts. Please wait and try again."
		},
		...options
	});
}
