import { describe, expect, it } from "vitest";
import { novelWritingCourse } from "@/stores/courses/source-library-courses";

const EXPECTED_MODULE_SEQUENCE = [
	"NW1 Course Overview & Goal Setting",
	"NW2 Developing a Protagonist and an Antagonist",
	"NW3 Novel Drafting: Introducing Your Characters",
	"NW4 Generating Conflict",
	"NW5 Novel Drafting: Setting the Scene",
	"NW6 Structuring Plot",
	"NW7 Character Development",
	"NW8 Narration",
	"Check-In #1",
	"NW9 Describing Setting",
	"NW10 Writing Dialogue",
	"NW11 Novel Drafting: Conflict",
	"NW12 Novel Drafting: Falling Action & Resolution",
	"NW13 Final Revision Portfolio"
];

function requireModule(title: string) {
	const module = novelWritingCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Novel Writing module ${title}.`);
	return module;
}

describe("Novel Writing learner flow", () => {
	it("moves from sustainable scope through a revised final portfolio", () => {
		expect(novelWritingCourse.modules.map(module => module.title)).toEqual(
			EXPECTED_MODULE_SEQUENCE
		);
		expect(EXPECTED_MODULE_SEQUENCE.indexOf("Check-In #1")).toBeGreaterThan(
			EXPECTED_MODULE_SEQUENCE.indexOf("NW8 Narration")
		);
		expect(EXPECTED_MODULE_SEQUENCE.at(-1)).toBe(
			"NW13 Final Revision Portfolio"
		);
	});

	it("gives every module pacing, manuscript targets, and explicit paths", () => {
		for (const module of novelWritingCourse.modules) {
			expect(module.estimatedTime, module.title).toMatch(/session/);
			expect(
				module.keyBlocks?.length,
				module.title
			).toBeGreaterThanOrEqual(5);
			expect(
				module.curriculum.every(item => item.learningPath === "core"),
				module.title
			).toBe(true);
			expect(
				module.supplementalProjects.every(item =>
					["choice", "challenge"].includes(item.learningPath ?? "")
				),
				module.title
			).toBe(true);
			expect(module.curriculum[0]?.content, module.title).toContain(
				"**Course flow:**"
			);
		}
	});

	it("preserves all authored projects as separate required work", () => {
		const requiredCount = novelWritingCourse.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const optionCount = novelWritingCourse.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);

		expect(requiredCount).toBe(30);
		expect(optionCount).toBe(28);
		expect(
			requireModule("NW13 Final Revision Portfolio").curriculum.map(
				item => item.title
			)
		).toEqual([
			"Concepts: Final Revision Portfolio",
			"Final Revision Portfolio",
			"Publication Readiness Reflection"
		]);
	});

	it("supports text-only plotting and a private completion path", () => {
		expect(
			requireModule("NW6 Structuring Plot").curriculum[0]?.content
		).toContain("hand-drawn, text-only, or instructor-supplied arc");
		expect(
			requireModule("NW13 Final Revision Portfolio").curriculum[0]
				?.content
		).toContain(
			"public posting or publication is optional and not required"
		);
		expect(
			requireModule("NW1 Course Overview & Goal Setting").curriculum[0]
				?.content
		).toContain("smallest sustainable story scope");
	});

	it("does not expose unavailable narrative-arc files as course modules", () => {
		const text = novelWritingCourse.modules
			.flatMap(module => [
				module.title,
				...module.curriculum.map(item => item.content),
				...module.supplementalProjects.map(item => item.content)
			])
			.join("\n");

		expect(
			novelWritingCourse.modules.some(
				module => module.title === "Pending Static Assets"
			)
		).toBe(false);
		expect(text).not.toContain("nw6_blank_narrative_arc.jpg");
		expect(text).not.toContain("nw6_narrative_arc_definitions.jpg");
	});
});
