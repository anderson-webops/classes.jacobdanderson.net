// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

test("required syscall course consent and shared saved write worksheet", { timeout: 180000 }, async (t) => {
	await runAssemblyCoreCourseWorkflow(t, {
		kind: "syscall",
		fixturePath: "./fixtures/assembly-syscall-write-contracts.json",
		moduleID: "assembly-unit-8-system-calls-and-runtime-interaction",
		coreID: "assembly-unit-8-system-calls-and-runtime-interaction-curriculum-system-calls-and-runtime-interaction-core-concepts",
		traceID: "assembly-unit-8-system-calls-and-runtime-interaction-supplemental-system-call-transfer-practice",
		fileCount: 8,
		readyToken: "./build-Debug/app",
		starterToken: "SYSCALL_WRITE",
		referenceToken: "separate reference passes",
		instructionTokens: ["Linux x86-64", "build-Release", "trace.md", "strace", "EAGAIN", "RCX/R11", "errno"],
		outputEnv: "ASSEMBLY_SYSCALL_BROWSER_EXPORT_PROOF_DIR",
		defaultOutput: "output/assembly-syscall-course"
	});
});
