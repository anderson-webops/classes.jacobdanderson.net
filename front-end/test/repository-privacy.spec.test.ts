import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repositoryRoot = resolve(process.cwd(), "..");

describe("repository privacy", () => {
	it("does not ship personal-data-bearing design screenshots", () => {
		for (const filename of [
			"dark-mode-admin-infill-comparison.png",
			"dark-mode-admin-infill-fixed.png"
		]) {
			expect(
				existsSync(resolve(repositoryRoot, "docs/design-qa", filename))
			).toBe(false);
		}
	});
});
