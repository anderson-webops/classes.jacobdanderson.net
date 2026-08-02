import express from "express";
import { afterEach, describe, expect, it } from "vitest";
import { apiNotFound } from "../src/middleware/notFound.js";
import { createApiSecurityHeaders } from "../src/middleware/securityHeaders.js";

const servers: Array<ReturnType<ReturnType<typeof express>["listen"]>> = [];

afterEach(async () => {
	await Promise.all(
		servers.splice(0).map(
			server => new Promise<void>((resolve, reject) => {
				server.close(error => error ? reject(error) : resolve());
			})
		)
	);
});

describe("API not-found boundary", () => {
	it("returns strict, non-cacheable JSON instead of Express HTML", async () => {
		const app = express();
		app.use(createApiSecurityHeaders());
		app.use(apiNotFound);
		const server = app.listen(0, "127.0.0.1");
		servers.push(server);
		await new Promise<void>(resolve => server.once("listening", resolve));
		const address = server.address();
		if (!address || typeof address === "string") throw new Error("Missing test listener.");

		const response = await fetch(`http://127.0.0.1:${address.port}/missing`);

		expect(response.status).toBe(404);
		expect(response.headers.get("cache-control")).toBe("no-store");
		expect(response.headers.get("content-type")).toContain("application/json");
		expect(response.headers.get("content-security-policy")).toContain("default-src 'none'");
		expect(response.headers.get("x-frame-options")).toBe("DENY");
		expect(response.headers.get("set-cookie")).toBeNull();
		expect(await response.json()).toEqual({ message: "Not found" });
	});
});
