import { describe, expect, it, vi } from "vitest";
import { selectMongoConnection } from "../src/security/mongoConnection.js";
import {
	DEFAULT_MONGODB_SECRET_PATH,
	mongodbSecretPath,
	readBoundedVaultJson,
	readMongoSecret,
	vaultAddress
} from "../src/vaultClient.js";

describe("MongoDB credential selection", () => {
	it("uses the environment URI only when Vault is not requested", async () => {
		const readMongoSecret = vi.fn();

		await expect(
			selectMongoConnection(
				{ MONGODB_URI: " mongodb://localhost:27017/classes " },
				readMongoSecret
			)
		).resolves.toEqual({
			source: "environment",
			uri: "mongodb://localhost:27017/classes"
		});
		expect(readMongoSecret).not.toHaveBeenCalled();
	});

	it("uses Vault when complete AppRole credentials are configured", async () => {
		const readMongoSecret = vi.fn().mockResolvedValue({
			uri: " mongodb://vault/classes "
		});

		await expect(
			selectMongoConnection(
				{
					MONGODB_URI: "mongodb://environment/classes",
					VAULT_ROLE_ID: "role-id",
					VAULT_SECRET_ID: "secret-id"
				},
				readMongoSecret
			)
		).resolves.toEqual({
			source: "vault",
			uri: "mongodb://vault/classes"
		});
		expect(readMongoSecret).toHaveBeenCalledOnce();
	});

	it("refuses redirects for AppRole login and authenticated secret reads", async () => {
		vi.stubEnv("VAULT_ADDR", "https://vault.example.test");
		vi.stubEnv("VAULT_ROLE_ID", "role-id");
		vi.stubEnv("VAULT_SECRET_ID", "secret-id");
		const fetchMock = vi.spyOn(globalThis, "fetch")
			.mockResolvedValueOnce(new Response(
				JSON.stringify({
					auth: { client_token: " vault-token " }
				}),
				{
					headers: { "content-type": "application/json" },
					status: 200
				}
			))
			.mockResolvedValueOnce(new Response(
				JSON.stringify({
					data: { data: { uri: "mongodb://vault/classes" } }
				}),
				{
					headers: { "content-type": "application/json" },
					status: 200
				}
			));

		try {
			await expect(readMongoSecret()).resolves.toEqual({
				uri: "mongodb://vault/classes"
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({
				method: "POST",
				redirect: "error"
			});
			expect(fetchMock.mock.calls[1]?.[1]).toMatchObject({
				redirect: "error"
			});
			expect(fetchMock.mock.calls[1]?.[1]?.headers).toEqual({
				"X-Vault-Token": "vault-token"
			});
		}
		finally {
			fetchMock.mockRestore();
			vi.unstubAllEnvs();
		}
	});

	it("does not silently fall back when configured Vault access fails", async () => {
		const vaultFailure = new Error("Vault is unavailable");
		const readMongoSecret = vi.fn().mockRejectedValue(vaultFailure);

		await expect(
			selectMongoConnection(
				{
					MONGODB_URI: "mongodb://environment/classes",
					VAULT_ROLE_ID: "role-id",
					VAULT_SECRET_ID: "secret-id"
				},
				readMongoSecret
			)
		).rejects.toBe(vaultFailure);
	});

	it.each([
		{ VAULT_ADDR: "https://vault.example.test" },
		{ VAULT_ROLE_ID: "role-id" },
		{ VAULT_SECRET_ID: "secret-id" }
	])("rejects incomplete Vault configuration %#", async environment => {
		const readMongoSecret = vi.fn();

		await expect(
			selectMongoConnection(
				{
					MONGODB_URI: "mongodb://environment/classes",
					...environment
				},
				readMongoSecret
			)
		).rejects.toThrow(
			"Vault was requested but its AppRole credentials are incomplete."
		);
		expect(readMongoSecret).not.toHaveBeenCalled();
	});

	it("requires an environment URI when Vault is not configured", async () => {
		await expect(
			selectMongoConnection({}, vi.fn())
		).rejects.toThrow(
			"MONGODB_URI is required when Vault is not configured."
		);
	});

	it("rejects a Vault response without a usable URI", async () => {
		await expect(
			selectMongoConnection(
				{
					VAULT_ROLE_ID: "role-id",
					VAULT_SECRET_ID: "secret-id"
				},
				vi.fn().mockResolvedValue({ uri: " " })
			)
		).rejects.toThrow("Vault MongoDB secret did not include a URI.");
	});
});

describe("Vault endpoint configuration", () => {
	it("allows HTTPS origins and loopback HTTP in production", () => {
		expect(
			vaultAddress("https://vault.example.test:8200", "production")
		).toBe("https://vault.example.test:8200");
		expect(vaultAddress("http://127.0.0.1:8200", "production"))
			.toBe("http://127.0.0.1:8200");
		expect(vaultAddress("http://localhost:8200", "production"))
			.toBe("http://localhost:8200");
		expect(vaultAddress("http://[::1]:8200", "production"))
			.toBe("http://[::1]:8200");
	});

	it("requires HTTPS for non-loopback production Vault endpoints", () => {
		expect(() =>
			vaultAddress("http://vault.example.test:8200", "production")
		).toThrow(
			"Production VAULT_ADDR must use HTTPS unless it is loopback."
		);
	});

	it.each([
		"ftp://vault.example.test",
		"https://user:password@vault.example.test",
		"https://vault.example.test/a/path",
		"https://vault.example.test?query=value",
		"https://vault.example.test#fragment",
		"not a URL"
	])("rejects invalid Vault address %s", value => {
		expect(() => vaultAddress(value, "development")).toThrow();
	});

	it("normalizes and validates the MongoDB secret path", () => {
		expect(mongodbSecretPath(undefined)).toBe(
			DEFAULT_MONGODB_SECRET_PATH
		);
		expect(
			mongodbSecretPath("/v1/secret/data/custom/mongodb/")
		).toBe("secret/data/custom/mongodb");
		expect(() => mongodbSecretPath("../secret/data/mongodb")).toThrow(
			"VAULT_MONGODB_SECRET_PATH is invalid."
		);
		expect(() => mongodbSecretPath("secret//data/mongodb")).toThrow(
			"VAULT_MONGODB_SECRET_PATH is invalid."
		);
		expect(() => mongodbSecretPath("secret/data/mongo?db")).toThrow(
			"VAULT_MONGODB_SECRET_PATH is invalid."
		);
	});

	it("bounds and redacts malformed Vault response bodies", async () => {
		await expect(
			readBoundedVaultJson(
				new Response("<secret-bearing-invalid-json>"),
				"Vault login"
			)
		).rejects.toThrow("Vault login response was not valid JSON.");
		await expect(
			readBoundedVaultJson(
				new Response("x".repeat(1024 * 1024 + 1)),
				"Vault secret"
			)
		).rejects.toThrow(
			"Vault secret response exceeded the safe size limit."
		);
	});
});
