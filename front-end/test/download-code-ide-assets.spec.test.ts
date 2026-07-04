import { execFileSync } from "node:child_process";
import {
	existsSync,
	mkdtempSync,
	mkdirSync,
	readFileSync,
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

function runAssetScript(frontEndDir: string) {
	return execFileSync(process.execPath, [scriptPath], {
		cwd: resolve(__dirname, ".."),
		env: {
			...process.env,
			CODE_IDE_ASSETS_DOWNLOAD: "skip",
			CODE_IDE_ASSETS_FRONT_END_DIR: frontEndDir
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

	it("removes a stale Code IDE manifest when skipped extraction has no source manifest", () => {
		const frontEndDir = makeTempFrontEndDir();
		const codeManifestPath = join(
			frontEndDir,
			"public/ide/assets/manifest.json"
		);
		writeFixtureFile(
			frontEndDir,
			"public/ide/assets/manifest.json",
			'{"assets":[{"name":"images/stale.png"}]}\n'
		);

		runAssetScript(frontEndDir);

		expect(existsSync(codeManifestPath)).toBe(false);
	});

	it("mirrors the extracted legacy manifest and removes stale public zips when downloads are skipped", () => {
		const frontEndDir = makeTempFrontEndDir();
		const legacyManifest = `${JSON.stringify(
			{
				assets: [
					{
						mimeType: "image/png",
						name: "images/alien.png",
						url: "/python-ide/assets/images/alien.png"
					}
				],
				version: 1
			},
			null,
			"\t"
		)}\n`;
		const codeManifestPath = join(
			frontEndDir,
			"public/ide/assets/manifest.json"
		);
		const staleZipPath = join(frontEndDir, "public/python-ide/assets.zip");
		writeFixtureFile(
			frontEndDir,
			"public/python-ide/assets/manifest.json",
			legacyManifest
		);
		writeFixtureFile(
			frontEndDir,
			"public/ide/assets/manifest.json",
			'{"assets":[]}\n'
		);
		writeFixtureFile(frontEndDir, "public/python-ide/assets.zip", "stale");

		runAssetScript(frontEndDir);

		expect(readFileSync(codeManifestPath, "utf8")).toBe(legacyManifest);
		expect(existsSync(staleZipPath)).toBe(false);
	});
});
