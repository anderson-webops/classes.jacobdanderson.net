// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

test(
	"debug-followups consent, exact roles and both saved continuations",
	{ timeout: 180000 },
	async t => {
		await runAssemblyCoreCourseWorkflow(t, {
			fixturePath: "./fixtures/assembly-debug-contracts.json",
			moduleID: "assembly-unit-10-debugging-at-instruction-level",
			coreID: "assembly-unit-10-debugging-at-instruction-level-curriculum-core-project-debugging-at-instruction-level",
			continuationIDs: [
				"assembly-unit-10-debugging-at-instruction-level-supplemental-instruction-debugging-transfer-practice",
				"assembly-unit-10-debugging-at-instruction-level-supplemental-instruction-debugging-extension-practice"
			],
			primaryFile: "routine.S",
			taskFile: "analysis.md",
			fileCount: 8,
			readyToken: "debug_branch_decision",
			starterToken: "DEBUG_SIGNED_BRANCH",
			referenceToken: "10,019",
			instructionTokens: [
				"Linux x86-64",
				"ctest --test-dir",
				"analysis.md"
			],
			outputEnv: "ASSEMBLY_DEBUG_FOLLOWUP_PROOF_DIR",
			defaultOutput: "output/assembly-debug-followups-course",
			kind: "debug-followups"
		});
	}
);
