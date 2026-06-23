import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const sourceRoot = join(process.cwd(), "src");
const ignoredDirectories = new Set([".git", "dist", "node_modules"]);

function sourceFiles(directory: string): string[] {
	const files: string[] = [];

	for (const entry of readdirSync(directory)) {
		if (ignoredDirectories.has(entry)) continue;

		const path = join(directory, entry);
		const stats = statSync(path);

		if (stats.isDirectory()) {
			files.push(...sourceFiles(path));
		} else if (/\.(?:vue|ts|tsx|js)$/.test(entry)) {
			files.push(path);
		}
	}

	return files;
}

describe("external links", () => {
	it("uses explicit noopener noreferrer on links that open new tabs", () => {
		const failures: string[] = [];

		for (const file of sourceFiles(sourceRoot)) {
			const text = readFileSync(file, "utf8");
			const linkPattern = /<a\b[^>]*target=["']_blank["'][^>]*>/g;

			for (const match of text.matchAll(linkPattern)) {
				const tag = match[0];
				const rel = tag.match(/\brel=["']([^"']*)["']/)?.[1] ?? "";
				const relValues = new Set(rel.split(/\s+/).filter(Boolean));

				if (!relValues.has("noopener") || !relValues.has("noreferrer")) {
					const line = text.slice(0, match.index).split("\n").length;
					failures.push(`${file}:${line} ${tag}`);
				}
			}
		}

		expect(failures).toEqual([]);
	});
});
