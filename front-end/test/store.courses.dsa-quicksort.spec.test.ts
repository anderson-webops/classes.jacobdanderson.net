import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { pythonIdeModeForCourseResource } from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const courseId = "data-structures-and-algorithms-in-cpp";
const moduleId = `${courseId}-dscpp5-quicksort-and-partitioning`;
const primaryId = `${moduleId}-curriculum-core-project-quicksort-and-partitioning`;
const base =
	"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/";
const folder = "DSCPP5-Quicksort-Toolkit";

describe("quicksort lessons, saved work and reference boundaries", () => {
	beforeEach(() => setActivePinia(createPinia()));
	for (const role of ["learner", "instructor"] as const) {
		it(`preserves the ${role} project and exposes four authored lessons`, async () => {
			if (role === "instructor")
				useAppStore().setCurrentTutor({
					_id: "quicksort-tutor",
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
					expect(lesson.content).toContain(`\n\n## ${stage}\n\n`);
			}
			expect(module.curriculum.map(item => item.id)).toEqual(
				expect.arrayContaining([
					`${moduleId}-curriculum-quicksort-and-partitioning-core-concepts`,
					`${moduleId}-curriculum-verification-review-quicksort-and-partitioning`,
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
				`${courseId}:dscpp5-quicksort-contract:current-pack-v1`
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
	it("preserves the earlier concept progress and teaches real quicksort tasks", async () => {
		const course = (await useCoursesStore().loadCourseById(courseId))!;
		const module = course.modules.find(item => item.id === moduleId)!;
		expect(module.curriculum[0].id).toBe(
			`${moduleId}-curriculum-quicksort-and-partitioning-core-concepts`
		);
		const lessons = module.curriculum.map(item => item.content).join("\n");
		for (const detail of [
			"provided vector",
			"three marked tasks",
			"does not call std::sort",
			"[7, 2, 4, 1, 8, 9]",
			"[newPivot + 1, right]",
			"O(n²)",
			"3,816",
			"native C++20"
		])
			expect(lessons).toContain(detail);
		expect(module.supplementalProjects.map(item => item.id)).toEqual([
			`${moduleId}-supplemental-project-quicksort-toolkit`,
			`${moduleId}-supplemental-quicksort-partition-transfer-practice`,
			`${moduleId}-supplemental-quicksort-partition-extension-practice`
		]);
		const optional = module.supplementalProjects
			.map(item => item.content)
			.join("\n");
		expect(optional).toContain("unrelated to quicksort");
		expect(optional).toContain("Earlier practice starter");
	});
});
