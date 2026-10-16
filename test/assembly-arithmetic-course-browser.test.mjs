// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

test(
	"arithmetic course consent, exact roles and shared saved code/trace continuation",
	{ timeout: 180000 },
	async (t) => {
		await runAssemblyCoreCourseWorkflow(t, {
			kind: "arithmetic",
			fixturePath: "./fixtures/assembly-arithmetic-contracts.json",
			moduleID: "assembly-unit-3-arithmetic-and-logic",
			coreID: "assembly-unit-3-arithmetic-and-logic-curriculum-core-project-arithmetic-and-logic",
			traceID:
				"assembly-unit-3-arithmetic-and-logic-supplemental-register-trace-worksheet-arithmetic-and-logic",
			fileCount: 11,
			readyToken: "./build-O0/assembly_arithmetic",
			starterToken: "ARITH_MUL",
			referenceToken: "591,123",
			instructionTokens: [
				"Linux x86-64",
				"-O0 -g",
				"-O2 -g",
				"compile_commands.json",
				"trace.md",
				"ARITH_DIV",
				"RDX:RAX",
				"SIGFPE",
				"arithmetic_c_mix"
			],
			outputEnv: "ASSEMBLY_ARITHMETIC_BROWSER_EXPORT_PROOF_DIR",
			defaultOutput: "output/assembly-arithmetic-course"
		});
	}
);
