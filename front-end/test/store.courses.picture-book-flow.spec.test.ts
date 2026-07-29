import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { earlyElementaryPictureBookCourse } from "@/stores/courses/source-library-courses";

const EXPECTED_MODULE_SEQUENCE = [
	"WYB1 Book Brainstorm I",
	"WYB2 Parts of Speech",
	"WYB3 Capitalization",
	"WYB4 Commas & Quotation Marks",
	"WYB5 Opinion Writing",
	"WYB Check-In #1",
	"WYB6 Book Brainstorm II",
	"WYB7 Subject-Verb Agreement",
	"WYB8 Word Choice",
	"WYB9 Narrative Writing",
	"WYB Check-In #2",
	"WYB10 Presentation Skills",
	"WYB11 Master Project"
];

function requireModule(title: string) {
	const module = earlyElementaryPictureBookCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Picture Book module ${title}.`);
	return module;
}

describe("Early Elementary B Picture Book learner flow", () => {
	it("keeps the opinion-to-narrative portfolio sequence", () => {
		expect(
			earlyElementaryPictureBookCourse.modules.map(module => module.title)
		).toEqual(EXPECTED_MODULE_SEQUENCE);
		expect(
			earlyElementaryPictureBookCourse.modules.some(
				module => module.title === "Pending Static Assets"
			)
		).toBe(false);
	});

	it("gives every module pacing, book-building targets, and explicit paths", () => {
		for (const module of earlyElementaryPictureBookCourse.modules) {
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

	it("turns both formerly empty check-ins into portfolio milestones", () => {
		expect(
			requireModule("WYB Check-In #1").curriculum.map(item => item.title)
		).toEqual(["Concepts: Check-In 1", "Opinion Mini-Book Checkpoint"]);
		expect(
			requireModule("WYB Check-In #2").curriculum.map(item => item.title)
		).toEqual([
			"Concepts: Check-In 2",
			"Narrative Picture-Book Spread Checkpoint"
		]);
		expect(
			requireModule("WYB Check-In #2").curriculum[1]?.content
		).toContain("**Completion evidence:**");
	});

	it("preserves authored work while keeping enrichment optional", () => {
		const requiredCount = earlyElementaryPictureBookCourse.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const optionCount = earlyElementaryPictureBookCourse.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);

		expect(requiredCount).toBe(35);
		expect(optionCount).toBe(26);
		expect(
			requireModule("WYB11 Master Project").curriculum.map(
				item => item.title
			)
		).toEqual([
			"Concepts: Master Project",
			"Picture Book Assembly Portfolio"
		]);
	});

	it("supports accessible responses and available narrative models", () => {
		expect(
			requireModule("WYB Check-In #1").curriculum[0]?.content
		).toContain("drawing plus dictation");
		expect(
			requireModule("WYB9 Narrative Writing").curriculum[0]?.content
		).toContain("lawful classroom copy of Gabby Tries or an equivalent");
		expect(
			requireModule("WYB9 Narrative Writing").curriculum[0]?.content
		).toContain("hand-drawn or text-only plot outline");
	});

	it("keeps unavailable plot-template bookkeeping out of the course", async () => {
		const course = await loadRawCourse("early-elementary-b-picture-book");
		expect(course).not.toBeNull();

		const text = JSON.stringify(course);
		expect(text).not.toContain("wyb1_proj1_plotempty.png");
		expect(
			course!.modules.find(
				module => module.title === "Pending Static Assets"
			)
		).toBeUndefined();
	});
});
