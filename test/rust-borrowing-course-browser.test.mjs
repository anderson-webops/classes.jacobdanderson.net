// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";
const moduleID = "rust-systems-security-rss2-borrowing-aliasing-and-lifetimes";
test(
	"Rust borrowing consent, exact roles and three saved continuations",
	{ timeout: 180000 },
	async t => {
		await runAssemblyCoreCourseWorkflow(t, {
			fixturePath: "./fixtures/rust-borrowing-contracts.json",
			courseID: "rust-systems-security",
			mode: "rust",
			sourceRepository: "Low-Level-Security",
			moduleID,
			coreID: `${moduleID}-curriculum-core-project-borrowing-aliasing-and-lifetimes`,
			continuationIDs: [
				`${moduleID}-supplemental-project-borrowing-and-aliasing-lab`,
				`${moduleID}-supplemental-borrowing-aliasing-and-lifetimes-transfer-practice`,
				`${moduleID}-supplemental-borrowing-aliasing-and-lifetimes-extension-practice`
			],
			primaryFile: "src/main.rs",
			taskFile: "observations.md",
			initialFile: "observations.md",
			fileCount: 13,
			readyToken: "cargo test --locked --offline",
			starterToken: "cd starter",
			referenceToken: "cd solution",
			instructionTokens: [
				"1.97.1",
				"edition 2024",
				"RecordView",
				"E0502",
				"E0106"
			],
			outputEnv: "RUST_BORROWING_BROWSER_PROOF_DIR",
			defaultOutput: "output/rust-borrowing-browser",
			kind: "borrowing"
		});
	}
);
