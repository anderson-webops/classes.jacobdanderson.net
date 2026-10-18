// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";
const moduleID =
	"rust-systems-security-rss3-option-result-and-typed-error-paths";
test(
	"Rust typed-errors consent, exact roles and three saved continuations",
	{ timeout: 180000 },
	async t => {
		await runAssemblyCoreCourseWorkflow(t, {
			fixturePath: "./fixtures/rust-typed-errors-contracts.json",
			courseID: "rust-systems-security",
			mode: "rust",
			sourceRepository: "Low-Level-Security",
			moduleID,
			coreID: `${moduleID}-curriculum-core-project-option-result-and-typed-error-paths`,
			continuationIDs: [
				`${moduleID}-supplemental-project-option-and-result-audit-tool`,
				`${moduleID}-supplemental-option-result-and-typed-error-paths-transfer-practice`,
				`${moduleID}-supplemental-option-result-and-typed-error-paths-extension-practice`
			],
			primaryFile: "src/lib.rs",
			taskFile: "observations.md",
			initialFile: "observations.md",
			fileCount: 12,
			readyToken: "cargo test --locked --offline",
			starterToken: "cd starter",
			referenceToken: "cd solution",
			instructionTokens: [
				"1.97.1",
				"edition 2024",
				"ParseError",
				"E0004",
				"E0308"
			],
			outputEnv: "RUST_TYPED_ERRORS_BROWSER_PROOF_DIR",
			defaultOutput: "output/rust-typed-errors-browser",
			kind: "typed-errors"
		});
	}
);
