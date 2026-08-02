import assert from "node:assert/strict";
import test from "node:test";
import {
	fetchStaticMediaWithRetry,
	isRetryableStaticMediaStatus
} from "../scripts/static-media-fetch.mjs";

function response(status) {
	return { ok: status >= 200 && status < 300, status };
}

test("retries network errors, 429, and every 5xx response within the bound", async () => {
	const results = [
		new TypeError("fetch failed"),
		response(429),
		response(599)
	];
	const delays = [];
	const result = await fetchStaticMediaWithRetry("https://static.example/item.gif", {
		fetchImplementation: async () => {
			const next = results.shift();
			if (next instanceof Error) throw next;
			return next;
		},
		maxAttempts: 3,
		retryDelayMs: 10,
		waitImplementation: async milliseconds => delays.push(milliseconds)
	});

	assert.deepEqual(result, {
		attempts: 3,
		error: "",
		ok: false,
		status: 599
	});
	assert.deepEqual(delays, [10, 20]);
	assert.equal(isRetryableStaticMediaStatus(429), true);
	assert.equal(isRetryableStaticMediaStatus(500), true);
	assert.equal(isRetryableStaticMediaStatus(599), true);
});

test("stops immediately for non-429 4xx responses", async () => {
	let requests = 0;
	const delays = [];
	const result = await fetchStaticMediaWithRetry("https://static.example/missing.gif", {
		fetchImplementation: async () => {
			requests += 1;
			return response(404);
		},
		waitImplementation: async milliseconds => delays.push(milliseconds)
	});

	assert.equal(result.status, 404);
	assert.equal(result.attempts, 1);
	assert.equal(requests, 1);
	assert.deepEqual(delays, []);
	assert.equal(isRetryableStaticMediaStatus(408), false);
	assert.equal(isRetryableStaticMediaStatus(425), false);
	assert.equal(isRetryableStaticMediaStatus(404), false);
});

test("limits repeated network failures to three attempts by default", async () => {
	let requests = 0;
	const result = await fetchStaticMediaWithRetry("https://static.example/unreachable.gif", {
		fetchImplementation: async () => {
			requests += 1;
			throw new TypeError("fetch failed");
		},
		retryDelayMs: 0,
		waitImplementation: async () => undefined
	});

	assert.equal(result.status, 0);
	assert.equal(result.error, "fetch failed");
	assert.equal(result.attempts, 3);
	assert.equal(requests, 3);
});

test("uses one ranged GET fallback for HEAD-forbidden hosts without retrying its 4xx", async () => {
	const methods = [];
	const result = await fetchStaticMediaWithRetry("https://static.example/protected.gif", {
		fetchImplementation: async (_url, options) => {
			methods.push(options.method);
			return response(options.method === "HEAD" ? 403 : 404);
		}
	});

	assert.equal(result.status, 404);
	assert.equal(result.attempts, 1);
	assert.deepEqual(methods, ["HEAD", "GET"]);
});

test("returns success when a bounded transient retry recovers", async () => {
	const results = [response(503), response(200)];
	const result = await fetchStaticMediaWithRetry("https://static.example/recovered.gif", {
		fetchImplementation: async () => results.shift(),
		waitImplementation: async () => undefined
	});

	assert.deepEqual(result, {
		attempts: 2,
		error: "",
		ok: true,
		status: 200
	});
});
