// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

const moduleID = "rust-systems-security-rss0-tooling-cargo-and-why-rust-exists";
test(
	"Rust Cargo consent, exact roles and three saved continuations",
	{ timeout: 180000 },
	async t => {
		await runAssemblyCoreCourseWorkflow(t, {
			fixturePath: "./fixtures/rust-cargo-contracts.json",
			courseID: "rust-systems-security",
			mode: "rust",
			sourceRepository: "Low-Level-Security",
			moduleID,
			coreID: `${moduleID}-curriculum-core-project-tooling-cargo-and-why-rust-exists`,
			continuationIDs: [
				`${moduleID}-supplemental-project-first-cargo-audit-cli`,
				`${moduleID}-supplemental-tooling-cargo-and-why-rust-exists-transfer-practice`,
				`${moduleID}-supplemental-tooling-cargo-and-why-rust-exists-extension-practice`
			],
			primaryFile: "src/main.rs",
			taskFile: "observations.md",
			initialFile: "observations.md",
			fileCount: 7,
			readyToken: "BASELINE",
			starterToken: "cd starter",
			referenceToken: "cd solution",
			instructionTokens: [
				"1.97.1",
				"edition 2024",
				"cargo test --locked --offline",
				"E0382"
			],
			outputEnv: "RUST_CARGO_BROWSER_PROOF_DIR",
			defaultOutput: "output/rust-cargo-browser",
			kind: "cargo"
		});
	}
);
