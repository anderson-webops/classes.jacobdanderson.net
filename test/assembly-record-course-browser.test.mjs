// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

test(
	"record course consent, exact roles and shared saved code/trace continuation",
	{ timeout: 180000 },
	async (t) => {
		await runAssemblyCoreCourseWorkflow(t, {
			kind: "record",
			fixturePath: "./fixtures/assembly-records-contracts.json",
			moduleID: "assembly-unit-1-machine-model-and-toolchain",
			coreID: "assembly-unit-1-machine-model-and-toolchain-curriculum-core-project-machine-model-and-toolchain",
			traceID:
				"assembly-unit-1-machine-model-and-toolchain-supplemental-register-trace-worksheet-machine-model-and-toolchain",
			fileCount: 8,
			readyToken: "readelf -Wr",
			starterToken: "RECORD_DECODE",
			referenceToken: "196,609",
			instructionTokens: [
				"Linux x86-64",
				"-O0 -g",
				"-O2 -g",
				"compile_commands.json",
				"trace.md"
			],
			outputEnv: "ASSEMBLY_RECORD_BROWSER_EXPORT_PROOF_DIR",
			defaultOutput: "output/assembly-record-course"
		});
	}
);
