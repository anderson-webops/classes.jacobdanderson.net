// src/server.ts
import process, { env, exit } from "node:process";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import mongoose from "mongoose";

import { codeIdeAssetsProxy, pythonIdeAssetsProxy } from "./controllers/common/pythonIdeAssetsProxy.js";
import { quoteProxy } from "./controllers/common/quoteProxy.js";
import {
	codeIdeProjectApiMountPath,
	createAdminMailLimiter,
	createApiIngressLimiter,
	createCodeIdeProjectAccountWriteLimiter,
	createCodeIdeProjectIngressLimiter
} from "./middleware/rateLimiters.js";
import { createRequestOriginGuard } from "./middleware/requestOriginGuard.js";
import { createApiSecurityHeaders, createCrossOriginAssetHeaders } from "./middleware/securityHeaders.js";
import { accountRoutes } from "./routes/accountRoutes.js";
import { adminMailRoutes } from "./routes/adminMailRoutes.js";
import { adminRoutes } from "./routes/adminRoutes.js";
import { courseAccessCodeRoutes } from "./routes/courseAccessCodeRoutes.js";
import { tutorRoutes } from "./routes/tutorRoutes.js";

import { userRoutes } from "./routes/userRoutes.js";
import { internalDiagnosticsAuthorized } from "./utils/internalDiagnostics.js";
import { getRoleTransferReadiness } from "./utils/roleTransferReadiness.js";
import {
	createSessionCookieOptions,
	crossSiteSessionCookiesEnabled,
	serverListenHost
} from "./utils/serverSecurity.js";

import { readMongoSecret } from "./vaultClient.js";

async function main() {
	const app = express();
	const internalDiagnosticsKey = env.INTERNAL_DIAGNOSTICS_KEY;
	const isProd = env.NODE_ENV === "production";
	const codeIdeProjectJsonBodyLimit = env.CODE_IDE_PROJECT_BODY_LIMIT || env.PYTHON_IDE_PROJECT_BODY_LIMIT || "15mb";
	const SESSION_SECRET = env.SESSION_SECRET;
	if (!SESSION_SECRET) throw new Error("Missing SESSION_SECRET");

	app.set("trust proxy", isProd ? env.TRUST_PROXY || "loopback" : false);
	app.use(createApiSecurityHeaders());

	// Health checks bypass rate limiting but receive the same security headers.
	app.get("/healthz", (_req, res) => {
		res.set("Cache-Control", "no-store");
		res.json({ ok: true });
	});

	// Bound database-backed traffic before parsing request bodies. Sensitive
	// endpoints retain their stricter route-specific limits below.
	app.use(createApiIngressLimiter());
	app.use(codeIdeProjectApiMountPath, createCodeIdeProjectIngressLimiter());

	// Reject unsafe cross-origin requests before parsing their bodies or making
	// cookie-backed identity available. Apple's exact form-post callback is
	// exempt here and remains constrained by its dedicated parser below.
	app.use(createRequestOriginGuard());

	// Signed sessions are available to the per-account project limiter before
	// any project auth middleware performs a database lookup.
	app.use(
		cookieSession(
			createSessionCookieOptions({
				crossSite: crossSiteSessionCookiesEnabled(env.CROSS_SITE),
				isProduction: isProd,
				sessionSecret: SESSION_SECRET
			})
		)
	);
	app.use(codeIdeProjectApiMountPath, createCodeIdeProjectAccountWriteLimiter());

	// Parse only after coarse network, request-origin, and per-account checks.
	app.use(
		"/accounts/oauth/apple/callback",
		(req, res, next) => {
			if (req.method === "POST" && !req.is("application/x-www-form-urlencoded")) {
				res.sendStatus(415);
				return;
			}
			next();
		},
		bodyParser.urlencoded({
			extended: false,
			limit: "16kb",
			parameterLimit: 10
		})
	);
	app.use(codeIdeProjectApiMountPath, bodyParser.json({ limit: codeIdeProjectJsonBodyLimit }));
	app.use(bodyParser.urlencoded({ extended: false, limit: "1mb" }));
	app.use(bodyParser.json({ limit: "1mb" }));

	// Cache-control for auth endpoints.
	app.use((req, res, next) => {
		if (
			req.path.startsWith("/accounts")
			|| req.path.startsWith("/course-access")
			|| req.path.endsWith("/loggedin")
		) {
			res.setHeader("Cache-Control", "no-store");
		}
		next();
	});

	// Sensitive routes retain their narrower purpose-specific limits.
	app.use("/admin-mail", createAdminMailLimiter(), adminMailRoutes);

	//
	app.use("/quotes", quoteProxy);
	app.use("/code-ide-assets", createCrossOriginAssetHeaders(), codeIdeAssetsProxy);
	app.use("/python-assets", createCrossOriginAssetHeaders(), pythonIdeAssetsProxy);

	// ready
	app.get("/readyz", async (_req, res) => {
		const connection = mongoose.connection;
		const state = connection.readyState;
		if (state !== 1 || !connection.db) {
			return res
				.status(503)
				.set("Cache-Control", "no-store")
				.json({
					ready: false,
					components: {
						db: { ok: false, state }
					}
				});
		}

		try {
			await connection.db.admin().ping();
			const roleTransfers = await getRoleTransferReadiness();
			const requireRoleTransfers = env.REQUIRE_ROLE_TRANSFER_TRANSACTIONS === "true";
			const ready = !requireRoleTransfers || roleTransfers.ok;
			return res
				.status(ready ? 200 : 503)
				.set("Cache-Control", "no-store")
				.json({
					ready,
					components: {
						db: { ok: true, state },
						roleTransfers
					}
				});
		}
		catch (error) {
			return res
				.status(503)
				.set("Cache-Control", "no-store")
				.json({
					ready: false,
					components: {
						db: {
							ok: false,
							state,
							error: error instanceof Error ? error.message : "db-ping-failed"
						}
					}
				});
		}
	});

	// --- Get Mongo URI from Vault (preferred), else env fallback ---
	let mongoUri: string | undefined;
	try {
		const { uri } = await readMongoSecret(); // your Vault client should read from KV v2
		mongoUri = uri;
	}
	catch (e) {
		// Fail silently if Vault is not available, then probably local test (Had to do this to avoid weird requirements
		// console.log("Vault unavailable, falling back to MONGODB_URI:", e);
		const m: string = e?.toString() || "";
		if (!m.includes("Failed to fetch") && !m.includes("connect ECONNREFUSED")) {
			console.log("");
		}

		mongoUri = env.MONGODB_URI;
	}

	if (!mongoUri) {
		throw new Error("No MongoDB URI available (Vault and MONGODB_URI missing)");
	}

	await mongoose.connect(mongoUri);
	console.log("Connected to MongoDB");
	const c = mongoose.connection;
	console.log(`Mongo connected: db=${c.db?.databaseName} host=${c.host} name=${c.name}`);
	app.get("/_dbinfo", (req, res) => {
		if (
			!internalDiagnosticsAuthorized(req, {
				diagnosticsKey: internalDiagnosticsKey,
				isProduction: isProd
			})
		) {
			return res.status(403).set("Cache-Control", "no-store").json({ ok: false, error: "forbidden" });
		}

		res.set("Cache-Control", "no-store").json({
			databaseName: c.db?.databaseName ?? null,
			host: c.host || null,
			name: c.name || null,
			readyState: c.readyState,
			usingVault: !!env.VAULT_ROLE_ID && !!env.VAULT_SECRET_ID
		});
	});

	// Your routes (note: you’ve commented an axios baseURL elsewhere; these are mounted as-is)
	app.use("/tutors", tutorRoutes);
	app.use("/users", userRoutes);
	app.use("/admins", adminRoutes);
	app.use("/accounts", accountRoutes);
	app.use("/course-access", courseAccessCodeRoutes);

	const PORT = Number(env.PORT || 3008);
	const listenHost = serverListenHost(isProd, env.HOST);
	const onListening = () => {
		const hostDescription = listenHost ?? "all configured interfaces";
		console.log(`Server listening on ${hostDescription}:${PORT}!`);
	};
	const server = listenHost ? app.listen(PORT, listenHost, onListening) : app.listen(PORT, onListening);
	let isShuttingDown = false;
	const shutdownTimeoutMs = Number(env.SHUTDOWN_TIMEOUT_MS || 10_000);

	const shutdown = async (signal: NodeJS.Signals) => {
		if (isShuttingDown) {
			return;
		}

		isShuttingDown = true;
		console.log(`${signal} received, shutting down gracefully...`);
		const forceShutdownTimer = setTimeout(() => {
			console.error("Graceful shutdown timed out; closing active connections.");
			server.closeAllConnections();
			exit(1);
		}, shutdownTimeoutMs);
		forceShutdownTimer.unref();

		try {
			if (server.listening) {
				await new Promise<void>((resolve, reject) => {
					server.close((error) => {
						if (error) {
							reject(error);
							return;
						}

						resolve();
					});
				});
			}

			if (mongoose.connection.readyState !== 0) {
				await mongoose.disconnect();
			}

			console.log("Graceful shutdown complete.");
			clearTimeout(forceShutdownTimer);
			exit(0);
		}
		catch (error) {
			clearTimeout(forceShutdownTimer);
			console.error("Graceful shutdown failed:", error);
			exit(1);
		}
	};

	process.once("SIGINT", () => {
		void shutdown("SIGINT");
	});
	process.once("SIGTERM", () => {
		void shutdown("SIGTERM");
	});
}

main().catch((err) => {
	console.error(err);
	exit(1);
});
