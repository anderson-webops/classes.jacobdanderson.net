import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { pythonIdeModeForCourseResource } from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const courseId = "data-structures-and-algorithms-in-cpp";
const source =
	"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/";
const units = [
	{
		anchor: "dscpp3-stl-containers-and-state-based-text-generation",
		folder: "DSCPP3-Markov-Text-Generator",
		current: "dscpp3-markov-contract",
		continuation: "Continue saved text-generator project",
		worksheets: [
			"project-markov-text-generator",
			"container-text-generation-transfer-practice",
			"container-text-generation-extension-practice"
		]
	},
	{
		anchor: "dscpp4-recursion-and-backtracking-in-3d-mazes",
		folder: "DSCPP4-Recursive-Maze-Pathfinder",
		current: "dscpp4-maze-contract",
		continuation: "Continue saved maze project",
		worksheets: [
			"project-recursive-maze-pathfinder",
			"recursive-maze-transfer-practice",
			"recursive-maze-extension-practice"
		]
	},
	{
		anchor: "dscpp5-quicksort-and-partitioning",
		folder: "DSCPP5-Quicksort-Toolkit",
		current: "dscpp5-quicksort-contract",
		continuation: "Continue saved quicksort project",
		worksheets: [
			"project-quicksort-toolkit",
			"quicksort-partition-transfer-practice",
			"quicksort-partition-extension-practice"
		]
	}
];

describe("dSA state projects retain existing coursework and independent reference roles", () => {
	beforeEach(() => setActivePinia(createPinia()));
	for (const role of ["learner", "instructor"] as const) {
		for (const unit of units) {
			it(`${role}: ${unit.folder} retains project and worksheet identities`, async () => {
				if (role === "instructor")
					useAppStore().setCurrentTutor({
						_id: "state-tutor",
						name: "Tutor",
						email: "tutor@example.invalid",
						age: 30,
						state: "GA",
						usersOfTutorLength: 0,
						coursePermissions: [courseId],
						editTutors: false,
						saveEdit: "Save"
					});
				const course =
					(await useCoursesStore().loadCourseById(courseId))!;
				const moduleId = `${courseId}-${unit.anchor}`;
				const module = course.modules.find(
					item => item.id === moduleId
				)!;
				const primaryId = `${moduleId}-curriculum-core-project-${unit.anchor.replace(/^dscpp\d+-/, "")}`;
				const primary = module.curriculum.find(
					item => item.id === primaryId
				)!;
				expect(primary.projectLink).toBe(
					`${source}tree/main/${unit.folder}/starter`
				);
				expect(primary.solutionLink).toBe(
					role === "instructor"
						? `${source}tree/main/${unit.folder}/solution`
						: undefined
				);
				expect(primary.ideImport).toBe(true);
				expect(module.curriculum).toHaveLength(5);
				for (const lesson of module.curriculum.slice(0, 4))
					expect(isLessonLearningItem(lesson)).toBe(true);
				expect(
					[
						...module.curriculum,
						...module.supplementalProjects
					].filter(item => item.ideImport === true)
				).toHaveLength(1);
				const currentHref = [
					...primary.content.matchAll(/\]\((\/ide\?[^)]+)\)/g)
				][0][1];
				const current = new URL(currentHref, "https://classes.local")
					.searchParams;
				expect(current.get("projectKey")).toBe(
					`${courseId}:${unit.current}:current-pack-v1`
				);
				expect(current.get("starterUrl")).toBe(primary.projectLink);
				expect(
					module.supplementalProjects.map(item => item.id)
				).toEqual(
					unit.worksheets.map(
						key => `${moduleId}-supplemental-${key}`
					)
				);
				for (const worksheet of module.supplementalProjects) {
					expect(worksheet.ideImport).toBe(false);
					expect(worksheet.solutionLink).toBeUndefined();
					expect(worksheet.projectLink).toBe(
						`${source}blob/main/${unit.folder}/README.md`
					);
					expect(
						pythonIdeModeForCourseResource(
							courseId,
							worksheet.projectLink!
						)
					).toBeNull();
					const continuationHref = [
						...worksheet.content.matchAll(/\]\((\/ide\?[^)]+)\)/g)
					][0][1];
					expect(worksheet.content).toContain(unit.continuation);
					expect(
						new URL(
							continuationHref,
							"https://classes.local"
						).searchParams.get("projectKey")
					).toBe(`${courseId}:${primaryId}:starter`);
				}
			});
		}
	}
});
