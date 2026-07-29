import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { earlyElementaryJoyOfReadingCourse } from "@/stores/courses/source-library-courses";

const EXPECTED_MODULE_SEQUENCE = [
	"JoR1 Characters",
	"JoR2 Plot",
	"JoR Check-In #1",
	"JoR3 Reading Literature",
	"JoR4 Reading Informational Texts",
	"JoR5 Figurative Language",
	"JoR Check-In #2",
	"JoR6 Master Project"
];

function requireModule(title: string) {
	const module = earlyElementaryJoyOfReadingCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Joy of Reading module ${title}.`);
	return module;
}

describe("Early Elementary A Joy of Reading learner flow", () => {
	it("keeps the character-to-synthesis sequence without asset bookkeeping", () => {
		expect(
			earlyElementaryJoyOfReadingCourse.modules.map(
				module => module.title
			)
		).toEqual(EXPECTED_MODULE_SEQUENCE);
		expect(
			earlyElementaryJoyOfReadingCourse.modules.some(
				module => module.title === "Pending Static Assets"
			)
		).toBe(false);
	});

	it("gives every module pacing, reading targets, and explicit paths", () => {
		for (const module of earlyElementaryJoyOfReadingCourse.modules) {
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

	it("preserves every source activity while making the final project a choice", () => {
		const requiredCount = earlyElementaryJoyOfReadingCourse.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const optionCount = earlyElementaryJoyOfReadingCourse.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);
		const masterProject = requireModule("JoR6 Master Project");

		expect(requiredCount).toBe(18);
		expect(optionCount).toBe(18);
		expect(masterProject.curriculum.map(item => item.title)).toEqual([
			"Concepts: Master Project",
			"Master Project Choice and Evidence Plan"
		]);
		expect(
			masterProject.supplementalProjects
				.filter(item =>
					[
						"Bacon and Mittens Review or Figurative Art",
						"Dinosaur Footprint Interview or News Report"
					].includes(item.title)
				)
				.every(item => item.learningPath === "choice")
		).toBe(true);
	});

	it("makes passage access and response flexibility explicit", () => {
		expect(
			requireModule("JoR1 Characters").curriculum[0]?.content
		).toContain("lawful classroom copy");
		expect(
			requireModule("JoR Check-In #1").curriculum[0]?.content
		).toContain("oral explanation");
		expect(requireModule("JoR2 Plot").curriculum[0]?.content).toContain(
			"hand-drawn, text-only, or supplied plot diagram"
		);
	});

	it("keeps unavailable plot-image bookkeeping out of the course", async () => {
		const course = await loadRawCourse("early-elementary-a-reading");
		expect(course).not.toBeNull();

		const text = JSON.stringify(course);
		expect(text).not.toContain("jor2_disact_plotempty.png");
		expect(text).not.toContain("jor2_disact_plotexample.png");
		expect(
			course!.modules.find(
				module => module.title === "Pending Static Assets"
			)
		).toBeUndefined();
	});
});
