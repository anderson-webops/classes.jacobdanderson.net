import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { cppBuildInstructions } from "@/modules/cppBuildInstructions";
import { pythonIdeModeForCourseResource } from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { dataStructuresAndAlgorithmsInCppCourse } from "@/stores/courses/data-structures-and-algorithms-in-cpp";

const courseId = "data-structures-and-algorithms-in-cpp";
const base = "https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/";
const folder = "DSA-08-dscpp0-setup-and-positioning";
const primaryId = `${courseId}-dscpp0-setup-and-positioning-curriculum-core-project-setup-and-positioning`;

describe("setup project, saved work and optional worksheet boundaries", () => {
	beforeEach(() => setActivePinia(createPinia()));
	for (const role of ["learner", "instructor"] as const) {
		it(`gives ${role} one required import and reading-only optional work`, async () => {
			if (role === "instructor") useAppStore().setCurrentTutor({ _id: "setup-tutor", name: "Tutor", email: "tutor@example.invalid", age: 30, state: "GA", usersOfTutorLength: 0, coursePermissions: [courseId], editTutors: false, saveEdit: "Save" });
			const course = (await useCoursesStore().loadCourseById(courseId))!;
			const module = course.modules.find(item => item.title === "DSCPP0 Setup and Positioning")!;
			for (const lesson of module.curriculum.slice(0, 4)) expect(isLessonLearningItem(lesson), `${lesson.title}: ${lesson.content.slice(0, 180)}`).toBe(true);
			for (const stable of ["setup-and-positioning-core-concepts", "why-this-course-uses-small-labs-instead-of-giant-apps", "core-project-setup-and-positioning", "dscpp0-project-0-complexity-and-toolchain-readiness"]) expect(module.curriculum.map(item => item.id)).toContain(`${courseId}-dscpp0-setup-and-positioning-curriculum-${stable}`);
			const project = module.curriculum.find(item => item.projectLink === `${base}tree/main/${folder}/starter`)!;
			expect(project.id).toBe(primaryId);
			expect(project.ideImport).toBe(true);
			expect(project.solutionLink).toBe(role === "instructor" ? `${base}tree/main/${folder}/solution` : undefined);
			expect([...module.curriculum, ...module.supplementalProjects].filter(item => item.ideImport === true)).toHaveLength(1);
			const current = new URL([...project.content.matchAll(/\]\((\/ide\?[^)]+)\)/g)][0][1], "https://classes.local").searchParams;
			expect(current.get("projectKey")).toBe(`${courseId}:dscpp0-setup:current-pack-v1`);
			expect(current.get("starterUrl")).toBe(project.projectLink);
			expect(current.get("projectKey")).not.toContain(project.id);
			for (const worksheet of module.supplementalProjects) {
				expect(worksheet.ideImport).toBe(false);
				expect(worksheet.solutionLink).toBeUndefined();
				expect(worksheet.projectLink, `${worksheet.title}: ${worksheet.projectLink}`).toMatch(/\/blob\/main\/.+\/README\.md$/);
				expect(pythonIdeModeForCourseResource(courseId, worksheet.projectLink!)).toBeNull();
				expect(worksheet.content, `${worksheet.title}: ${worksheet.content.slice(-600)}`).toContain("Continue saved setup project");
				const continuation = new URL([...worksheet.content.matchAll(/\]\((\/ide\?[^)]+)\)/g)][0][1], "https://classes.local").searchParams;
				expect(continuation.get("projectKey")).toBe(`${courseId}:${primaryId}:starter`);
			}
		});
	}
	it("uses C++20 for both stable roles and the separate current pack", () => {
		for (const key of [`${courseId}:${primaryId}:starter`, `${courseId}:${primaryId}:solution`, `${courseId}:dscpp0-setup:current-pack-v1`]) {
			const text = cppBuildInstructions([{ name: "main.cpp", content: "" }, { name: "search.hpp", content: "" }, { name: "CMakeLists.txt", content: "" }], key).join("\n");
			expect(text).toContain("-std=c++20");
			expect(text).toContain("'main.cpp' -o project");
			expect(text).not.toContain("'search.hpp'");
		}
	});
	it("preserves course and progress structure while teaching the search contract", () => {
		expect(dataStructuresAndAlgorithmsInCppCourse.modules).toHaveLength(11);
		expect(dataStructuresAndAlgorithmsInCppCourse.modules.reduce((n, m) => n + m.curriculum.length, 0)).toBe(53);
		expect(dataStructuresAndAlgorithmsInCppCourse.modules.reduce((n, m) => n + m.supplementalProjects.length, 0)).toBe(79);
		const core = dataStructuresAndAlgorithmsInCppCourse.modules[0];
		expect(core.curriculum[2].content).toContain("[first,last)");
		expect(core.curriculum[2].content).toContain("entire command is not logarithmic");
		expect(core.curriculum[5].content).toContain("same required search project");
	});
});
