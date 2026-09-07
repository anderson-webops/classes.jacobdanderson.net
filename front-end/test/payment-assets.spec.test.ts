import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const frontEndRoot = process.cwd();
const legacyPaymentScreenshots = [
	resolve(frontEndRoot, "src/assets/Images/Zelle_Email.jpeg"),
	resolve(frontEndRoot, "src/assets/Images/Zelle_Number.jpeg")
];

describe("payment asset privacy", () => {
	it("does not retain the legacy Zelle screenshots or source references", async () => {
		for (const screenshot of legacyPaymentScreenshots) {
			await expect(access(screenshot)).rejects.toThrow();
		}

		const zellePage = await readFile(
			resolve(frontEndRoot, "src/pages/zelle.vue"),
			"utf8"
		);
		expect(zellePage).not.toMatch(/Zelle_(?:Email|Number)\.jpeg/u);
	});
});
