import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { lowLevelSecurityCourse } from "@/stores/courses/low-level-security";

const CORE_SEQUENCE = [
	"LLS0 Safe Lab Setup and Evidence Contract",
	"LLS1 Memory Layout and Security Tooling",
	"LLS2 Bounds, Arrays, and Safer Copy Patterns",
	"LLS3 Defensive Parsers and Binary Input",
	"LLS4 Integer Safety, State, and Defensive Data Structures",
	"LLS5 Bug Hunting with Sanitizers and Fuzzing",
	"LLS6 Patching, Review, and Responsible Research"
];

const APPENDICES = [
	"Low-Level Security Lab 7: Sanitizer Triage Studio",
	"Low-Level Security Lab 8: Bounds Regression Studio",
	"Low-Level Security Lab 9: Binary Parser Hardening Studio",
	"Low-Level Security Lab 10: Integer State Safety Studio",
	"Low-Level Security Lab 11: Fuzzing Regression Studio",
	"Low-Level Security Lab 12: Patch Review Handoff Studio"
];

const PRACTICE_SECTIONS = [
	"safe-lab-preflight-case",
	"memory-layout-evidence-case",
	"bounded-copy-contract-case",
	"defensive-parser-case",
	"integer-state-invariants-case",
	"bounded-fuzzing-triage-case",
	"patch-and-capstone-audit-case"
];

const ANSWER_SECTIONS = PRACTICE_SECTIONS.map(section =>
	section.replace(/-case$/u, "-key")
);

function assetText(filename: string) {
	return fs.readFileSync(
		path.resolve(
			__dirname,
			`../public/course-assets/low-level-security/${filename}`
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
	const module = lowLevelSecurityCourse.modules.find(
		candidate => candidate.title === title
	);
	expect(module, title).toBeDefined();
	return JSON.stringify(module);
}

describe("Low Level Security learner flow", () => {
	it("uses LLS0–LLS6 as the required path and keeps repeated studios optional", async () => {
		expect(
			lowLevelSecurityCourse.modules
				.filter(module => module.kind !== "appendix")
				.map(module => module.title)
		).toEqual(CORE_SEQUENCE);
		expect(
			lowLevelSecurityCourse.modules
				.filter(module => module.kind === "appendix")
				.map(module => module.title)
		).toEqual(APPENDICES);

		const loaded = await loadRawCourse("low-level-security");
		expect(
			loaded?.modules
				.filter(module => module.kind !== "appendix")
				.slice(0, CORE_SEQUENCE.length)
				.map(module => module.title)
		).toEqual(CORE_SEQUENCE);
	});

	it("adds timing, six-part structure, local continuity, and current references", () => {
		for (const module of lowLevelSecurityCourse.modules.filter(
			candidate => candidate.kind !== "appendix"
		)) {
			expect(module.estimatedTime, module.title).toMatch(/session/u);
			expect(module.keyBlocks, module.title).toHaveLength(6);
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

	it("records the actual C++17 source baseline and platform-aware sanitizer limits", () => {
		const setup = moduleText("LLS0 Safe Lab Setup and Evidence Contract");
		expect(setup).toContain("CMake 3.20");
		expect(setup).toContain("C++17");
		expect(setup).toContain("macOS and Linux");
		expect(setup).toContain("one worker by default");
		expect(setup).toContain("not proof that no defects remain");
		expect(setup).not.toContain("C++20");
	});

	it("keeps fuzzing finite and tied to patch and regression evidence", () => {
		const fuzzing = moduleText(
			"LLS5 Bug Hunting with Sanitizers and Fuzzing"
		);
		expect(fuzzing).toContain(
			"cap runs, time, input length, memory, and workers"
		);
		expect(fuzzing).toContain("one preserved interesting case");
		expect(fuzzing).toContain("corpus rerun");
		expect(fuzzing).toContain("no finding does not prove absence of bugs");
	});

	it("keeps the capstone defensive, reproducible, and maintainer-facing", () => {
		const capstone = moduleText(
			"LLS6 Patching, Review, and Responsible Research"
		);
		expect(capstone).toContain("maintainer-facing remediation packet");
		expect(capstone).toContain("no exploit artifact");
		expect(capstone).toContain("regression results");
		expect(capstone).toContain("cleanup");
	});

	it("publishes all local cases and verification keys", () => {
		const practice = assetText("low-level-security-practice-pack.md");
		const verification = assetText(
			"low-level-security-verification-guide.md"
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
		expect(verification).toContain("CRLF");
	});

	it("marks supplemental work and repeated studios as choice or challenge", () => {
		for (const module of lowLevelSecurityCourse.modules) {
			for (const item of module.supplementalProjects) {
				expect(
					["choice", "challenge"],
					`${module.title}: ${item.title}`
				).toContain(item.learningPath);
			}
		}
		for (const appendix of lowLevelSecurityCourse.modules.filter(
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

	it("documents source depth, verification-script status, standards, and capstone gates", async () => {
		const loaded = await loadRawCourse("low-level-security");
		const metadata = loaded?.developmentMetadata;
		expect(metadata?.sourcePolicy).toContain(
			"LLS1–LLS6 contain substantive C++17"
		);
		expect(metadata?.sourcePolicy).toContain("CRLF line endings");
		expect(metadata?.toolchain).toContainEqual(
			expect.stringContaining("one worker by default")
		);
		expect(metadata?.standards).toContainEqual(
			expect.stringContaining("SEI CERT C++")
		);
		expect(metadata?.courseBoundaries).toContainEqual(
			expect.stringContaining("LLS0–LLS6")
		);
		expect(metadata?.capstoneExpectations).toHaveLength(6);
		expect(metadata?.safetyPolicy).toContainEqual(
			expect.stringContaining("bounded input")
		);
	});
});
