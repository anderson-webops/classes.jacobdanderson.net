import { execFileSync } from "node:child_process";
import {
	existsSync,
	mkdtempSync,
	mkdirSync,
	rmSync,
	writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

const scriptPath = resolve(
	__dirname,
	"../scripts/download-code-ide-assets.mjs"
);
const tempDirs: string[] = [];

function makeTempFrontEndDir() {
	const dir = mkdtempSync(join(tmpdir(), "classes-code-ide-assets-"));
	tempDirs.push(dir);
	return dir;
}

function writeFixtureFile(root: string, filePath: string, content: string) {
	const target = join(root, filePath);
	mkdirSync(dirname(target), { recursive: true });
	writeFileSync(target, content);
}

function runAssetScript(frontEndDir: string, useLegacyAliases = false) {
	const assetEnvironment = useLegacyAliases
		? {
				PYTHON_IDE_ASSETS_DOWNLOAD: "skip",
				PYTHON_IDE_ASSETS_FRONT_END_DIR: frontEndDir
			}
		: {
				CODE_IDE_ASSETS_DOWNLOAD: "skip",
				CODE_IDE_ASSETS_FRONT_END_DIR: frontEndDir
			};
	return execFileSync(process.execPath, [scriptPath], {
		cwd: resolve(__dirname, ".."),
		env: {
			...process.env,
			...assetEnvironment
		},
		encoding: "utf8"
	});
}

describe("Code IDE asset staging script", () => {
	afterEach(() => {
		for (const dir of tempDirs.splice(0)) {
			rmSync(dir, { force: true, recursive: true });
		}
	});

	it("supports legacy Python IDE aliases while omitting generated output", () => {
		const frontEndDir = makeTempFrontEndDir();
		const codeManifestPath = join(
			frontEndDir,
			"public/ide/assets/manifest.json"
		);
		const legacyManifestPath = join(
			frontEndDir,
			"public/python-ide/assets/manifest.json"
		);
		writeFixtureFile(
			frontEndDir,
			"public/ide/assets/manifest.json",
			'{"assets":[{"name":"images/stale.png"}]}\n'
		);
		writeFixtureFile(
			frontEndDir,
			"public/python-ide/assets/manifest.json",
			'{"assets":[{"name":"images/stale.png"}]}\n'
		);

		runAssetScript(frontEndDir, true);

		expect(existsSync(codeManifestPath)).toBe(false);
		expect(existsSync(legacyManifestPath)).toBe(false);
	});

	it("removes stale generated outputs and zips in Code IDE skip mode", () => {
		const frontEndDir = makeTempFrontEndDir();
		const codeManifestPath = join(
			frontEndDir,
			"public/ide/assets/manifest.json"
		);
		const legacyManifestPath = join(
			frontEndDir,
			"public/python-ide/assets/manifest.json"
		);
		const staleZipPath = join(frontEndDir, "public/python-ide/assets.zip");
		writeFixtureFile(
			frontEndDir,
			"public/python-ide/assets/manifest.json",
			'{"assets":[{"name":"images/stale.png"}]}\n'
		);
		writeFixtureFile(
			frontEndDir,
			"public/ide/assets/manifest.json",
			'{"assets":[]}\n'
		);
		writeFixtureFile(frontEndDir, "public/python-ide/assets.zip", "stale");

		runAssetScript(frontEndDir);

		expect(existsSync(codeManifestPath)).toBe(false);
		expect(existsSync(legacyManifestPath)).toBe(false);
		expect(existsSync(staleZipPath)).toBe(false);
	});
});
