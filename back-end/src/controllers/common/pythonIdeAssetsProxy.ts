import type { ReadableStream as NodeReadableStream } from "node:stream/web";
import { env } from "node:process";
import { Readable } from "node:stream";
import { Router } from "express";

const DEFAULT_ASSETS_ZIP_URL = "https://static.classes.jacobdanderson.net/assets.zip";
const DEFAULT_ASSETS_FETCH_TIMEOUT_MS = 10_000;
const MAX_ASSETS_FETCH_TIMEOUT_MS = 60_000;
const CODE_IDE_ASSETS_ZIP_URL
	= env.CODE_IDE_ASSETS_ZIP_URL || env.PYTHON_IDE_ASSETS_ZIP_URL || DEFAULT_ASSETS_ZIP_URL;

function normalizedAssetFetchTimeoutMs() {
	const configuredTimeoutSource = env.CODE_IDE_ASSETS_FETCH_TIMEOUT_MS || env.PYTHON_IDE_ASSETS_FETCH_TIMEOUT_MS;
	const configuredTimeout = Number(configuredTimeoutSource);
	if (!Number.isFinite(configuredTimeout) || configuredTimeout <= 0) {
		return DEFAULT_ASSETS_FETCH_TIMEOUT_MS;
	}

	return Math.min(configuredTimeout, MAX_ASSETS_FETCH_TIMEOUT_MS);
}

export const codeIdeAssetsProxy = Router().get("/assets.zip", async (_req, res) => {
	const abortController = new AbortController();
	const timeout = setTimeout(
		() => abortController.abort(),
		normalizedAssetFetchTimeoutMs()
	);

	try {
		const upstream = await fetch(CODE_IDE_ASSETS_ZIP_URL, {
			signal: abortController.signal
		});
		if (!upstream.ok || !upstream.body) {
			const body = await upstream.text().catch(() => "");
			return res.status(upstream.status || 502).send(body || "Unable to load Code IDE asset pack.");
		}

		const contentType = upstream.headers.get("content-type") || "application/zip";
		const contentLength = upstream.headers.get("content-length");
		const etag = upstream.headers.get("etag");
		const lastModified = upstream.headers.get("last-modified");

		res.setHeader("Content-Type", contentType);
		res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
		if (contentLength) res.setHeader("Content-Length", contentLength);
		if (etag) res.setHeader("ETag", etag);
		if (lastModified) res.setHeader("Last-Modified", lastModified);

		Readable.fromWeb(upstream.body as unknown as NodeReadableStream<Uint8Array>).pipe(res);
	}
	catch (err) {
		if (abortController.signal.aborted) {
			return res.status(504).json({ error: "Code IDE asset pack request timed out" });
		}

		console.error("Code IDE assets proxy failed:", err);
		res.status(502).json({ error: "Unable to reach Code IDE asset pack" });
	}
	finally {
		clearTimeout(timeout);
	}
});

export const pythonIdeAssetsProxy = codeIdeAssetsProxy;
