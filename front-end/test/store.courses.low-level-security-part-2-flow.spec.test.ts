import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { lowLevelSecurityPart2Course } from "@/stores/courses/low-level-security-part-2";

const CORE_SEQUENCE = [
	"Part 2 Preflight and Defensive Evidence",
	"LLS13 Exploitability Triage",
	"LLS14 Stack Corruption Hardening",
	"LLS15 Heap Lifetime and Ownership",
	"Part 2 Bridge: Disclosure Boundaries",
	"LLS16 Mitigation-Aware Build Analysis",
	"Part 2 Bridge: Control-Flow Integrity",
	"LLS17 Disclosure, Triage, and Patch Handoff",
	"LLS18 Defensive Hardening Capstone"
];

const APPENDICES = [
	"Low-Level Security Lab 13: Exploitability Triage Studio",
	"Low-Level Security Lab 14: Stack Corruption Hardening Studio",
	"Low-Level Security Lab 15: Heap Lifetime Audit Studio",
	"Low-Level Security Lab 16: Disclosure Boundary Hardening Studio",
	"Low-Level Security Lab 17: Defensive Audit Capstone Studio"
];

const PRACTICE_SECTIONS = [
	"part-2-preflight-case",
	"exploitability-triage-case",
	"stack-frame-hardening-case",
	"heap-lifetime-case",
	"disclosure-boundary-case",
	"mitigation-build-matrix-case",
	"control-flow-integrity-case",
	"patch-and-advisory-case",
	"hardening-capstone-case"
];

const ANSWER_SECTIONS = PRACTICE_SECTIONS.map(section =>
	section.replace(/-case$/u, "-key")
);

function assetText(filename: string) {
	return fs.readFileSync(
		path.resolve(
			__dirname,
			`../public/course-assets/low-level-security-part-2/${filename}`
		),
		"utf8"
	);
}

function markdownHeadingSlugs(markdown: string) {
	return new Set(
		[...markdown.matchAll(/^#{1,6}\s+(.+)$/gmu)].map(([, heading]) =>
			heading
				.toLowerCase()
				.replace(/[`*_]/gu, "")
				.replace(/[^\p{L}\p{N}\s-]/gu, "")
				.trim()
				.replace(/\s+/gu, "-")
				.replace(/-+/gu, "-")
		)
	);
}

function moduleText(title: string) {
	const module = lowLevelSecurityPart2Course.modules.find(
		candidate => candidate.title === title
	);
	expect(module, title).toBeDefined();
	return JSON.stringify(module);
}

describe("Low Level Security Part 2 learner flow", () => {
	it("aligns the required path to LLS13–LLS18 and keeps repeated studios optional", async () => {
		expect(
			lowLevelSecurityPart2Course.modules
				.filter(module => module.kind !== "appendix")
				.map(module => module.title)
		).toEqual(CORE_SEQUENCE);
		expect(
			lowLevelSecurityPart2Course.modules
				.filter(module => module.kind === "appendix")
				.map(module => module.title)
		).toEqual(APPENDICES);

		const loaded = await loadRawCourse("low-level-security-part-2");
		expect(
			loaded?.modules
				.filter(module => module.kind !== "appendix")
				.slice(0, CORE_SEQUENCE.length)
				.map(module => module.title)
		).toEqual(CORE_SEQUENCE);
	});

	it("adds timing, six-part structure, bounded analysis, and current references", () => {
		for (const module of lowLevelSecurityPart2Course.modules.filter(
			candidate => candidate.kind !== "appendix"
		)) {
			expect(module.estimatedTime, module.title).toMatch(/session/u);
			expect(module.keyBlocks, module.title).toHaveLength(6);
			expect(module.curriculum[0]?.content, module.title).toContain(
				"**Defensive analysis contract:**"
			);
			expect(module.curriculum[0]?.content, module.title).toContain(
				"**Scope and resource contract:**"
			);
			expect(module.curriculum[0]?.content, module.title).toContain(
				"**Evidence gate:**"
			);
			expect(module.curriculum[0]?.content, module.title).toContain(
				"**Local continuity:**"
			);
			expect(module.curriculum[0]?.content, module.title).toContain(
				"**Current references:**"
			);
		}
	});

	it("requires Part 1 evidence and records the actual shared source baseline", () => {
		const setup = moduleText("Part 2 Preflight and Defensive Evidence");
		expect(setup).toContain("Rebuild and rerun the Part 1 capstone");
		expect(setup).toContain("CMake 3.20");
		expect(setup).toContain("C++17");
		expect(setup).toContain("finite solution run");
		expect(setup).toContain("reset command");
	});

	it("removes unrelated Rust checkpoint links from the C++ setup and bridge cases", () => {
		const corpus = JSON.stringify(lowLevelSecurityPart2Course);
		expect(corpus).not.toContain("RUST-04-rust-systems-lab-15");
		expect(corpus).not.toContain("RUST-05-rust-systems-lab-16");
		expect(corpus).not.toContain("RUST-06-rust-systems-lab-17");
		expect(moduleText("Part 2 Bridge: Disclosure Boundaries")).toContain(
			"course-specific C++ evidence"
		);
	});

	it("keeps mitigation and control-flow analysis platform-qualified and defensive", () => {
		const mitigation = moduleText("LLS16 Mitigation-Aware Build Analysis");
		const controlFlow = moduleText("Part 2 Bridge: Control-Flow Integrity");
		expect(mitigation).toContain(
			"distinguish compile-time instrumentation from deployment hardening"
		);
		expect(mitigation).toContain("unknown or unsupported checks");
		expect(mitigation).toContain("unchanged need for a patch");
		expect(controlFlow).toContain(
			"no gadget chain, payload, address calculation, or executable construction"
		);
		expect(controlFlow).toContain("underlying memory bug");
	});

	it("publishes every supplied case and answer key", () => {
		const practice = assetText(
			"low-level-security-part-2-practice-pack.md"
		);
		const verification = assetText(
			"low-level-security-part-2-verification-guide.md"
		);
		const practiceHeadings = markdownHeadingSlugs(practice);
		const answerHeadings = markdownHeadingSlugs(verification);

		for (const section of PRACTICE_SECTIONS) {
			expect(practiceHeadings, section).toContain(section);
		}
		for (const section of ANSWER_SECTIONS) {
			expect(answerHeadings, section).toContain(section);
		}
		expect(practice).toContain("bash\\r");
		expect(verification).toContain("LLS16 matrix shell scripts");
	});

	it("marks notebooks, transfer work, and repeated studios as choice or challenge", () => {
		for (const module of lowLevelSecurityPart2Course.modules) {
			for (const item of module.supplementalProjects) {
				expect(
					["choice", "challenge"],
					`${module.title}: ${item.title}`
				).toContain(item.learningPath);
			}
		}
		for (const appendix of lowLevelSecurityPart2Course.modules.filter(
			module => module.kind === "appendix"
		)) {
			expect(
				appendix.curriculum.every(
					item => item.learningPath === "choice"
				),
				appendix.title
			).toBe(true);
		}
	});

	it("documents source depth, script limitations, boundaries, and capstone gates", async () => {
		const loaded = await loadRawCourse("low-level-security-part-2");
		const metadata = loaded?.developmentMetadata;
		expect(metadata?.sourcePolicy).toContain(
			"LLS13–LLS18 contain substantive C++17"
		);
		expect(metadata?.sourcePolicy).toContain(
			"previously mismatched Rust checkpoint links"
		);
		expect(metadata?.sourcePolicy).toContain("CRLF line endings");
		expect(metadata?.toolchain).toContainEqual(
			expect.stringContaining("time, input, output, memory")
		);
		expect(metadata?.standards).toContainEqual(
			expect.stringContaining(
				"NIST Secure Software Development Framework"
			)
		);
		expect(metadata?.courseBoundaries).toContainEqual(
			expect.stringContaining("complete required progression")
		);
		expect(metadata?.capstoneExpectations).toHaveLength(6);
		expect(metadata?.safetyPolicy).toContainEqual(
			expect.stringContaining("one worker is the default")
		);
	});
});
