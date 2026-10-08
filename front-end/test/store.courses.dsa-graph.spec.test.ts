import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { pythonIdeModeForCourseResource } from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { dataStructuresAndAlgorithmsInCppCourse } from "@/stores/courses/data-structures-and-algorithms-in-cpp";
import { dsaGraphLessons } from "@/stores/courses/dsaGraphLessons";

const courseId = "data-structures-and-algorithms-in-cpp";
const base =
	"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/";
const primaryId = `${courseId}-dscpp2-graphs-and-shortest-paths-curriculum-core-project-graphs-and-shortest-paths`;

describe("graph source, teaching and workspace boundaries", () => {
	beforeEach(() => setActivePinia(createPinia()));
	for (const role of ["learner", "instructor"] as const) {
		it(`gives ${role} one core import and reading-only optional practice`, async () => {
			if (role === "instructor")
				useAppStore().setCurrentTutor({
					_id: "graph-tutor",
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
			const module = course.modules.find(
				item => item.title === "DSCPP2 Graphs and Shortest Paths"
			)!;
			const lessons = module.curriculum.slice(0, 3);
			expect(lessons.map(item => item.title)).toEqual([
				"Adjacency Matrices and Weighted Connectivity",
				"Shortest Path Thinking",
				"Path Reconstruction"
			]);
			expect(lessons[0].id).toBe(
				`${courseId}-dscpp2-graphs-and-shortest-paths-curriculum-graphs-and-shortest-paths-core-concepts`
			);
			expect(
				[
					...lessons[1].content.matchAll(/```cpp\n([\s\S]*?)\n```/g)
				].map(match => match[1])
			).toEqual(
				[
					...dsaGraphLessons.selection.matchAll(
						/```cpp\n([\s\S]*?)\n```/g
					)
				].map(match => match[1])
			);
			expect(lessons[2].content).toContain("4,294,967,294");
			expect(lessons[2].content).toContain("costOfPath");
			const project = module.curriculum.find(
				item =>
					item.projectLink ===
					`${base}tree/main/DSCPP2-Graph-Navigation/starter`
			)!;
			expect(project).toBeDefined();
			expect(project.ideImport).toBe(true);
			expect(project.id).toBe(primaryId);
			expect(project.projectLink).toBe(
				`${base}tree/main/DSCPP2-Graph-Navigation/starter`
			);
			expect(project.solutionLink).toBe(
				role === "instructor"
					? `${base}tree/main/DSCPP2-Graph-Navigation/solution`
					: undefined
			);
			const all = [...module.curriculum, ...module.supplementalProjects];
			expect(all.filter(item => item.ideImport === true)).toHaveLength(1);
			for (const item of module.supplementalProjects) {
				expect(item.ideImport).toBe(false);
				expect(item.solutionLink).toBeUndefined();
				expect(item.projectLink).toBe(
					`${base}blob/main/DSCPP2-Graph-Navigation/README.md`
				);
				expect(item.content).toContain("imports no code");
			}
			const walkthrough = module.supplementalProjects.find(item =>
				item.content.includes("Continue saved graph project")
			)!;
			expect(
				new URL(
					[
						...walkthrough.content.matchAll(/\]\((\/ide\?[^)]+)\)/g)
					][0][1],
					"https://classes.local"
				).searchParams.get("projectKey")
			).toBe(`${courseId}:${project.id}:starter`);
			const action = new URL(
				[...project.content.matchAll(/\]\((\/ide\?[^)]+)\)/g)][0][1],
				"https://classes.local"
			).searchParams;
			expect(action.get("projectKey")).toBe(
				`${courseId}:dscpp2-graph:current-pack-v1`
			);
			expect(action.get("projectKey")).not.toContain(project.id);
			expect(action.get("starterUrl")).toBe(project.projectLink);
			expect(project.content).toContain("preserves the earlier project");
		});
	}
	it("keeps the course sequence and existing progress entries", () => {
		expect(dataStructuresAndAlgorithmsInCppCourse.modules).toHaveLength(11);
		expect(
			dataStructuresAndAlgorithmsInCppCourse.modules.reduce(
				(n, item) => n + item.curriculum.length,
				0
			)
		).toBe(53);
		expect(
			dataStructuresAndAlgorithmsInCppCourse.modules.reduce(
				(n, item) => n + item.supplementalProjects.length,
				0
			)
		).toBe(79);
		expect(dsaGraphLessons.project).toContain("working O(V^2) baseline");
		expect(dsaGraphLessons.project).toContain("4,294,967,294");
		expect(dsaGraphLessons.representation).toContain(
			"preserves the last accepted graph"
		);
		expect(dsaGraphLessons.selection).toContain(
			"ignore stale queue entries"
		);
	});
	it("keeps read-only graph resources out of code import detection", () => {
		expect(
			pythonIdeModeForCourseResource(
				courseId,
				`${base}blob/main/DSCPP2-Graph-Navigation/README.md`
			)
		).toBeNull();
		for (const role of ["starter", "solution"])
			expect(
				pythonIdeModeForCourseResource(
					courseId,
					`${base}tree/main/DSCPP2-Graph-Navigation/${role}`
				)
			).toBe("cpp");
	});
});
