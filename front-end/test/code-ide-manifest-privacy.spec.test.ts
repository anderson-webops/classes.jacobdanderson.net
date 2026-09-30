import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { strToU8, zipSync } from "fflate";
import { afterEach, describe, expect, it, vi } from "vitest";

const archive = vi.hoisted(() => ({ read: vi.fn() }));
vi.mock("../scripts/reviewed-asset-archive.mjs", () => ({
	readReviewedAssetArchiveFile: archive.read
}));
const directories: string[] = [];
afterEach(async () => {
	vi.unstubAllEnvs();
	vi.unstubAllGlobals();
	await Promise.all(
		directories
			.splice(0)
			.map(directory => rm(directory, { recursive: true, force: true }))
	);
});

describe("public Code IDE manifest privacy", () => {
	it.each([
		["CODE", false],
		["PYTHON", false],
		["CODE", true],
		["PYTHON", true]
	])(
		"omits private provenance for %s aliases with fallback=%s",
		async (alias, fallback) => {
			vi.resetModules();
			const directory = await mkdtemp(
				join(tmpdir(), "classes-manifest-privacy-")
			);
			directories.push(directory);
			await mkdir(join(directory, ".cache"));
			const privateSource =
				"https://synthetic-user:synthetic-password@assets.example.invalid/private-pack?token=synthetic-token";
			await writeFile(
				join(directory, ".cache/code-ide-assets.json"),
				JSON.stringify({
					sourceUrl: privateSource,
					sha256: "6ab65a710032ca71cf957bfd56f8b60579d66c94395bbc34fc433be4bb0f92a1"
				})
			);
			for (const prefix of ["CODE", "PYTHON"]) {
				for (const suffix of [
					"DOWNLOAD",
					"FRONT_END_DIR",
					"ZIP_URL",
					"REFRESH"
				]) {
					vi.stubEnv(`${prefix}_IDE_ASSETS_${suffix}`, "");
				}
			}
			vi.stubEnv(`${alias}_IDE_ASSETS_FRONT_END_DIR`, directory);
			vi.stubEnv(`${alias}_IDE_ASSETS_ZIP_URL`, privateSource);
			if (fallback) vi.stubEnv(`${alias}_IDE_ASSETS_REFRESH`, "always");
			archive.read.mockResolvedValue(
				zipSync({
					"images/example.svg": strToU8(
						'<svg width="12" height="16"/>'
					)
				})
			);
			const fetcher = vi.fn(
				async () => new Response("", { status: 404 })
			);
			vi.stubGlobal("fetch", fetcher);
			await import("../scripts/download-code-ide-assets.mjs");
			const contents = await Promise.all(
				[
					"public/ide/assets/manifest.json",
					"public/python-ide/assets/manifest.json"
				].map(path => readFile(join(directory, path), "utf8"))
			);
			expect(contents[0]).toBe(contents[1]);
			for (const content of contents) {
				expect(content).not.toMatch(
					/sourceUrl|synthetic-(?:user|password|token)|private-pack/
				);
				const manifest = JSON.parse(content);
				expect(Object.keys(manifest).sort()).toEqual([
					"assets",
					"generatedAt",
					"version"
				]);
				expect(manifest.assets).toEqual([
					expect.objectContaining({
						name: "images/example.svg",
						url: "/python-ide/assets/images/example.svg",
						width: 12,
						height: 16
					})
				]);
			}
			expect(
				JSON.parse(
					await readFile(
						join(directory, ".cache/code-ide-assets.json"),
						"utf8"
					)
				).sourceUrl
			).toBe(privateSource);
			expect(fetcher).toHaveBeenCalledTimes(fallback ? 1 : 0);
		}
	);
});
