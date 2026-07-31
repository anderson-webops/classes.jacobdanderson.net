import { describe, expect, it } from "vitest";
import { OAuthLoginAttempt } from "../src/models/schemas/OAuthLoginAttempt.js";

const validAttempt = {
	browserBindingHash: "a".repeat(64),
	codeVerifier: "c".repeat(43),
	expiresAt: new Date(Date.now() + 60_000),
	nonce: "n".repeat(32),
	provider: "google" as const,
	remember: false,
	returnTo: "/courses/",
	stateHash: "b".repeat(64)
};

describe("OAuth login attempt model", () => {
	it("keeps transient OAuth secrets excluded from normal queries", () => {
		expect(
			OAuthLoginAttempt.schema.path("browserBindingHash").options.select
		).toBe(false);
		expect(
			OAuthLoginAttempt.schema.path("codeVerifier").options.select
		).toBe(false);
		expect(
			OAuthLoginAttempt.schema.path("nonce").options.select
		).toBe(false);
		expect(
			OAuthLoginAttempt.schema.path("stateHash").options.select
		).toBe(false);
	});

	it("accepts bounded hashes, verifier, and nonce values", async () => {
		const attempt = new OAuthLoginAttempt(validAttempt);
		await expect(attempt.validate()).resolves.toBeUndefined();
	});

	it.each([
		["browserBindingHash", "a".repeat(63)],
		["browserBindingHash", "g".repeat(64)],
		["stateHash", "b".repeat(65)],
		["stateHash", "B".repeat(64)],
		["codeVerifier", "c".repeat(31)],
		["codeVerifier", "c".repeat(257)],
		["nonce", "n".repeat(31)],
		["nonce", "n".repeat(257)]
	] as const)("rejects an invalid %s", async (field, value) => {
		const attempt = new OAuthLoginAttempt({
			...validAttempt,
			[field]: value
		});
		await expect(attempt.validate()).rejects.toMatchObject({
			errors: {
				[field]: expect.anything()
			}
		});
	});
});
