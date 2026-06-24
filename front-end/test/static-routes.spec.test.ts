import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

const tempDirs: string[] = [];

describe("static route normalization", () => {
	afterEach(async () => {
		await Promise.all(
			tempDirs.splice(0).map(tempDir =>
				rm(tempDir, { recursive: true, force: true })
			)
		);
	});

	it("creates nested index files for clean static URLs", async () => {
		const tempDir = await mkdtemp(join(tmpdir(), "classes-routes-"));
		tempDirs.push(tempDir);
		const { normalizeStaticRoutes } = await import("../scripts/normalize-static-routes.mjs") as {
			normalizeStaticRoutes: (targetDistDir: string) => Promise<void>;
		};

		await writeFile(join(tempDir, "index.html"), "<main>Home</main>");
		await writeFile(
			join(tempDir, "course-resource.html"),
			"<main>Course Resource</main>"
		);
		await writeFile(join(tempDir, "about.html"), "<main>About</main>");

		await normalizeStaticRoutes(tempDir);

		await expect(readFile(join(tempDir, "course-resource", "index.html"), "utf8"))
			.resolves.toBe("<main>Course Resource</main>");
		await expect(readFile(join(tempDir, "about", "index.html"), "utf8"))
			.resolves.toBe("<main>About</main>");
		await expect(stat(join(tempDir, "index", "index.html"))).rejects.toThrow();
	});
});
