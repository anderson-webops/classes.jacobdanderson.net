import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { introductionToPublicSpeakingCourse } from "@/stores/courses/source-library-courses";

const EXPECTED_MODULE_SEQUENCE = [
	"MYP1 Personal Introductions",
	"MYP2 Toastmaker",
	"MYP3 Speechwriter",
	"MYP4 Keynote Speaker",
	"MYP5 Storyteller",
	"MYP6 Radio Pitch",
	"MYP7 Defense Attorney",
	"MYP8 Stand-up Comedian",
	"MYP9 Master Project: Your TED-Ed Talk"
];

function requireModule(title: string) {
	const module = introductionToPublicSpeakingCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Public Speaking module ${title}.`);
	return module;
}

describe("Introduction to Public Speaking learner flow", () => {
	it("keeps the short-speech-to-capstone genre progression", () => {
		expect(
			introductionToPublicSpeakingCourse.modules.map(
				module => module.title
			)
		).toEqual(EXPECTED_MODULE_SEQUENCE);
		expect(
			introductionToPublicSpeakingCourse.modules.some(
				module => module.title === "Pending Static Assets"
			)
		).toBe(false);
	});

	it("gives every module pacing, delivery targets, and explicit paths", () => {
		for (const module of introductionToPublicSpeakingCourse.modules) {
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

	it("turns Speechwriter into a substantive bridge module", () => {
		expect(
			requireModule("MYP3 Speechwriter").curriculum.map(
				item => item.title
			)
		).toEqual([
			"Concepts: Speechwriter",
			"Audience-Centered Three-Part Speech"
		]);
		expect(
			requireModule("MYP3 Speechwriter").curriculum[1]?.content
		).toContain("**Completion evidence:**");
	});

	it("preserves authored work while keeping enrichment optional", () => {
		const requiredCount = introductionToPublicSpeakingCourse.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const optionCount = introductionToPublicSpeakingCourse.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);

		expect(requiredCount).toBe(20);
		expect(optionCount).toBe(18);
	});

	it("supports private delivery, privacy, and classroom-safe performance", () => {
		expect(
			requireModule("MYP1 Personal Introductions").curriculum[0]?.content
		).toContain("never need to disclose sensitive personal information");
		expect(
			requireModule("MYP5 Storyteller").curriculum[1]?.content
		).toContain("true, adapted, or fictionalized story");
		expect(
			requireModule("MYP8 Stand-up Comedian").curriculum[0]?.content
		).toContain("no targeting classmates, protected traits");
		expect(
			requireModule("MYP9 Master Project: Your TED-Ed Talk").curriculum[0]
				?.content
		).toContain("no claim of TED or TED-Ed affiliation");
	});

	it("keeps the unavailable release-form bookkeeping out of the learner flow", async () => {
		const course = await loadRawCourse("introduction-to-public-speaking");
		expect(course).not.toBeNull();

		const text = JSON.stringify(
			course!.modules.filter(module => module.kind !== "appendix")
		);
		expect(text).not.toContain("ted_ed_release.pdf");
		expect(
			course!.modules.find(
				module => module.title === "Pending Static Assets"
			)
		).toBeUndefined();
		expect(
			course!.modules.find(
				module => module.title === "Pending Source Media Inventory"
			)?.kind
		).toBe("appendix");
	});
});
