import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Code IDE asset runtime boundary", () => {
	it("does not expose a backend archive-streaming proxy", () => {
		const serverSource = readFileSync(
			resolve(__dirname, "../src/server.ts"),
			"utf8"
		);
		const developmentEnvironment = readFileSync(
			resolve(__dirname, "../.env.EXAMPLE"),
			"utf8"
		);
		const productionEnvironment = readFileSync(
			resolve(__dirname, "../../deploy/native/api.env.example"),
			"utf8"
		);
		const proxySourcePath = resolve(
			__dirname,
			"../src/controllers/common/pythonIdeAssetsProxy.ts"
		);

		expect(serverSource).not.toMatch(
			/codeIdeAssetsProxy|pythonIdeAssetsProxy|\/code-ide-assets|\/python-assets/
		);
		expect(developmentEnvironment).not.toContain("IDE_ASSETS_ZIP_URL");
		expect(productionEnvironment).not.toContain("IDE_ASSETS_ZIP_URL");
		expect(existsSync(proxySourcePath)).toBe(false);
	});
});
