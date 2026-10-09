import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { pythonIdeModeForCourseResource } from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const courseId = "data-structures-and-algorithms-in-cpp";
const moduleId = `${courseId}-dscpp1-interfaces-records-and-a-task-manager-cli`;
const primaryId = `${moduleId}-curriculum-core-project-interfaces-records-and-a-task-manager-cli`;
const base =
	"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/";
const folder = "DSCPP1-Task-Manager-CLI";

describe("task-record lessons, saved work and reference boundaries", () => {
	beforeEach(() => setActivePinia(createPinia()));
	for (const role of ["learner", "instructor"] as const) {
		it(`preserves the ${role} project and exposes four authored lessons`, async () => {
			if (role === "instructor")
				useAppStore().setCurrentTutor({
					_id: "record-tutor",
					name: "Tutor",
					email: "tutor@example.invalid",
					age: 30,
					state: "GA",
					usersOfTutorLength: 0,
					coursePermissions: [courseId],
					editTutors: false,
					saveEdit: "Save"
				});
			const course = (await useCoursesStore().loadCourseById(courseId))!;
			const module = course.modules.find(item => item.id === moduleId)!;
			expect(module.curriculum).toHaveLength(5);
			for (const lesson of module.curriculum.slice(0, 4)) {
				expect(isLessonLearningItem(lesson), lesson.title).toBe(true);
				for (const stage of [
					"Learn",
					"Predict and practice",
					"Verify and debug",
					"Extend and review"
				])
					expect(lesson.content).toContain(stage);
			}
			expect(module.curriculum.map(item => item.id)).toEqual(
				expect.arrayContaining([
					`${moduleId}-curriculum-interfaces-records-and-a-task-manager-cli-core-concepts`,
					`${moduleId}-curriculum-verification-review-interfaces-records-and-a-task-manager-cli`,
					primaryId
				])
			);
			const project = module.curriculum.find(
				item => item.id === primaryId
			)!;
			expect(project.projectLink).toBe(
				`${base}tree/main/${folder}/starter`
			);
			expect(project.solutionLink).toBe(
				role === "instructor"
					? `${base}tree/main/${folder}/solution`
					: undefined
			);
			expect(project.ideImport).toBe(true);
			expect(
				[...module.curriculum, ...module.supplementalProjects].filter(
					item => item.ideImport === true
				)
			).toHaveLength(1);
			const current = new URL(
				[...project.content.matchAll(/\]\((\/ide\?[^)]+)\)/g)][0][1],
				"https://classes.local"
			).searchParams;
			expect(current.get("projectKey")).toBe(
				`${courseId}:dscpp1-task-record:current-pack-v1`
			);
			expect(current.get("starterUrl")).toBe(project.projectLink);
			for (const worksheet of module.supplementalProjects) {
				expect(worksheet.ideImport).toBe(false);
				expect(worksheet.solutionLink).toBeUndefined();
				expect(
					worksheet.projectLink,
					`${worksheet.title}: ${worksheet.projectLink}`
				).toBe(`${base}blob/main/${folder}/README.md`);
				expect(
					pythonIdeModeForCourseResource(
						courseId,
						worksheet.projectLink!
					)
				).toBeNull();
				const continuation = new URL(
					[
						...worksheet.content.matchAll(/\]\((\/ide\?[^)]+)\)/g)
					][0][1],
					"https://classes.local"
				).searchParams;
				expect(continuation.get("projectKey")).toBe(
					`${courseId}:${primaryId}:starter`
				);
			}
		});
	}
	it("teaches the description-keyed record contract and leaves parsing optional", async () => {
		const course = (await useCoursesStore().loadCourseById(courseId))!;
		const module = course.modules.find(item => item.id === moduleId)!;
		const lessons = module.curriculum.map(item => item.content).join("\n");
		expect(lessons).toContain("two sorting tasks");
		expect(lessons).toContain("first matching description");
		expect(lessons).toContain("must not reorder stored records");
		expect(lessons).toContain("512");
		expect(lessons).not.toMatch(/missing-ID|malformed-command/);
		expect(module.keyBlocks).toContain("missing description");
		expect(module.supplementalProjects.map(item => item.id)).toEqual([
			`${moduleId}-supplemental-project-task-manager-cli`,
			`${moduleId}-supplemental-task-manager-cli-transfer-practice`,
			`${moduleId}-supplemental-task-manager-cli-extension-practice`
		]);
	});
});
