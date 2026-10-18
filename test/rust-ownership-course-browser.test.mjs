// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";
const moduleID =
	"rust-systems-security-rss1-ownership-moves-and-memory-responsibility";
test(
	"Rust ownership consent, exact roles and three saved continuations",
	{ timeout: 180000 },
	async t => {
		await runAssemblyCoreCourseWorkflow(t, {
			fixturePath: "./fixtures/rust-ownership-contracts.json",
			courseID: "rust-systems-security",
			mode: "rust",
			sourceRepository: "Low-Level-Security",
			moduleID,
			coreID: `${moduleID}-curriculum-core-project-ownership-moves-and-memory-responsibility`,
			continuationIDs: [
				`${moduleID}-supplemental-project-ownership-and-move-tracer`,
				`${moduleID}-supplemental-ownership-moves-and-memory-responsibility-transfer-practice`,
				`${moduleID}-supplemental-ownership-moves-and-memory-responsibility-extension-practice`
			],
			primaryFile: "src/main.rs",
			taskFile: "observations.md",
			initialFile: "observations.md",
			fileCount: 11,
			readyToken: "cargo test --locked --offline",
			starterToken: "cd starter",
			referenceToken: "cd solution",
			instructionTokens: [
				"1.97.1",
				"edition 2024",
				"ScopeTag",
				"E0382",
				"E0204"
			],
			outputEnv: "RUST_OWNERSHIP_BROWSER_PROOF_DIR",
			defaultOutput: "output/rust-ownership-browser",
			kind: "ownership"
		});
	}
);
