import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { scratchLevel1BootcampCourse } from "@/stores/courses/source-library-courses";

const EXPECTED_MODULE_SEQUENCE = [
	"GS1 Event Listeners and Movement",
	"GS2 Loops",
	"GS3 Conditionals and Variables",
	"GS4 Master Project"
];

function requireModule(title: string) {
	const module = scratchLevel1BootcampCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Scratch Bootcamp module ${title}.`);
	return module;
}

describe("Scratch Level 1 Bootcamp learner flow", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("keeps a focused four-sprint intensive sequence", () => {
		expect(
			scratchLevel1BootcampCourse.modules.map(module => module.title)
		).toEqual(EXPECTED_MODULE_SEQUENCE);
		expect(
			scratchLevel1BootcampCourse.modules.some(
				module => module.kind === "appendix"
			)
		).toBe(false);
	});

	it("gives every sprint pacing, block targets, and explicit paths", () => {
		for (const module of scratchLevel1BootcampCourse.modules) {
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

	it("requires one focused build per skills sprint", () => {
		const events = requireModule("GS1 Event Listeners and Movement");
		expect(events.curriculum.map(item => item.title)).toEqual([
			"Concepts: Event Listeners and Movement",
			"Scratch Account and First Project Tour",
			"Dragonfly Event Listener Remix"
		]);
		expect(
			events.supplementalProjects.find(
				item => item.title === "Ball Looks and Motion Event Set"
			)?.learningPath
		).toBe("challenge");

		const loops = requireModule("GS2 Loops");
		expect(loops.curriculum.map(item => item.title)).toEqual([
			"Concepts: Loops",
			"Mouse Shape Loops"
		]);
		expect(loops.supplementalProjects.map(item => item.title)).toEqual(
			expect.arrayContaining([
				"Elephant Repeat and Forever Effects",
				"Hot Cross Buns Music Loop"
			])
		);

		const state = requireModule("GS3 Conditionals and Variables");
		expect(state.curriculum.map(item => item.title)).toEqual([
			"Concepts: Conditionals and Variables",
			"Button Click Timer Game"
		]);
		expect(
			state.supplementalProjects.find(
				item => item.title === "Crab Catching Game"
			)?.learningPath
		).toBe("challenge");
	});

	it("keeps selection and a minimum playable build in the capstone sprint", () => {
		const capstone = requireModule("GS4 Master Project");
		expect(capstone.curriculum.map(item => item.title)).toEqual([
			"Concepts: Master Project",
			"Bootcamp Game Selection",
			"Playable Scratch Game Build"
		]);
		expect(capstone.estimatedTime).toContain("3–4 sessions");
		expect(capstone.curriculum[0]?.content).toContain(
			"minimum playable loop"
		);
	});

	it("preserves the legacy grouped-anchor IDs on the new core checkpoints", async () => {
		const course = await useCoursesStore().loadCourseById(
			"scratch-level-1-bootcamp"
		);
		expect(course).not.toBeNull();

		const tour = course!.modules[0]?.curriculum.find(
			item => item.title === "Scratch Account and First Project Tour"
		);
		expect(tour?.id).toBe(
			"scratch-level-1-bootcamp-gs1-event-listeners-and-movement-curriculum-source-activity-anchors-event-listeners-and-movement"
		);
		expect(tour?.aliases).toContain(
			"scratch-level-1-bootcamp-gs1-event-listeners-and-movement-curriculum-scratch-account-and-first-project-tour"
		);

		const loops = course!.modules[1]?.curriculum.find(
			item => item.title === "Mouse Shape Loops"
		);
		expect(loops?.id).toBe(
			"scratch-level-1-bootcamp-gs2-loops-curriculum-source-activity-anchors-loops"
		);
		expect(loops?.projectLink).toBe(
			"https://scratch.mit.edu/projects/601699148/"
		);
	});
});
