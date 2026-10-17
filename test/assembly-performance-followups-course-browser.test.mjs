// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

test(
	"performance-followups consent, exact roles and both saved continuations",
	{ timeout: 180000 },
	async t => {
		await runAssemblyCoreCourseWorkflow(t, {
			fixturePath: "./fixtures/assembly-performance-contracts.json",
			moduleID: "assembly-unit-11-performance-and-code-shape",
			coreID: "assembly-unit-11-performance-and-code-shape-curriculum-core-project-performance-and-code-shape",
			continuationIDs: [
				"assembly-unit-11-performance-and-code-shape-supplemental-code-shape-transfer-practice",
				"assembly-unit-11-performance-and-code-shape-supplemental-code-shape-extension-practice"
			],
			primaryFile: "loops.S",
			taskFile: "analysis.md",
			fileCount: 9,
			readyToken: "--benchmark",
			starterToken: "Both roles provide a working baseline",
			referenceToken: "Both roles provide a working baseline",
			instructionTokens: [
				"Linux x86-64",
				"ctest --test-dir",
				"analysis.md"
			],
			outputEnv: "ASSEMBLY_PERFORMANCE_FOLLOWUP_PROOF_DIR",
			defaultOutput: "output/assembly-performance-followups-course",
			kind: "performance-followups"
		});
	}
);
