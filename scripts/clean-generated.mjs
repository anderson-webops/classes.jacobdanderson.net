import { rm } from "node:fs/promises";
import { resolve } from "node:path";

const workspaceRoot = resolve(import.meta.dirname, "..");
const generatedPaths = [
	"back-end/coverage",
	"back-end/dist",
	"coverage",
	"dist",
	"front-end/coverage",
	"front-end/dist",
	"front-end/playwright-report",
	"front-end/test-results"
];

for (const generatedPath of generatedPaths) {
	const target = resolve(workspaceRoot, generatedPath);
	if (!target.startsWith(`${workspaceRoot}/`)) {
		throw new Error(`Refusing to clean a path outside the workspace: ${target}`);
	}
	await rm(target, { force: true, recursive: true });
	console.log(`Cleaned ${generatedPath}`);
}
