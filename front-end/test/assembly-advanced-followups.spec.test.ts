import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { assemblyCourseProjectKey } from "@/modules/assemblyProjectResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { assemblyDebugProjectReading } from "@/stores/courses/assemblyDebugProjectReading";
import { assemblyPerformanceProjectReading } from "@/stores/courses/assemblyPerformanceProjectReading";

const activities = [
	{
		id: "assembly-unit-10-debugging-at-instruction-level-supplemental-instruction-debugging-transfer-practice",
		title: "Conditional Breakpoints and Reachable Decisions",
		path: "choice",
		guide: "conditional",
		core: "assembly-unit-10-debugging-at-instruction-level-curriculum-core-project-debugging-at-instruction-level",
		root: "337648e72f375e30b235936f8deb5cd9ac64cfde/ASM-09-unit-10-debugging-at-instruction-level",
		baseline: assemblyDebugProjectReading
	},
	{
		id: "assembly-unit-10-debugging-at-instruction-level-supplemental-instruction-debugging-extension-practice",
		title: "Caller State Across Two Return Paths",
		path: "challenge",
		guide: "returns",
		core: "assembly-unit-10-debugging-at-instruction-level-curriculum-core-project-debugging-at-instruction-level",
		root: "337648e72f375e30b235936f8deb5cd9ac64cfde/ASM-09-unit-10-debugging-at-instruction-level",
		baseline: assemblyDebugProjectReading
	},
	{
		id: "assembly-unit-11-performance-and-code-shape-supplemental-code-shape-transfer-practice",
		title: "Counted Branch Outcomes and Equal Results",
		path: "choice",
		guide: "branch-counts",
		core: "assembly-unit-11-performance-and-code-shape-curriculum-core-project-performance-and-code-shape",
		root: "dfe6d181f0e6e793aebf78270f7c391e3a0225aa/ASM-10-unit-11-performance-and-code-shape",
		baseline: assemblyPerformanceProjectReading
	},
	{
		id: "assembly-unit-11-performance-and-code-shape-supplemental-code-shape-extension-practice",
		title: "Repeat Scaling and Benchmark Harness Cost",
		path: "challenge",
		guide: "repeat-scaling",
		core: "assembly-unit-11-performance-and-code-shape-curriculum-core-project-performance-and-code-shape",
		root: "dfe6d181f0e6e793aebf78270f7c391e3a0225aa/ASM-10-unit-11-performance-and-code-shape",
		baseline: assemblyPerformanceProjectReading
	}
];

it.each(["staff", "learner"] as const)(
	"keeps complete distinct follow-ups and the existing saved attempts for %s",
	async role => {
		setActivePinia(createPinia());
		useAppStore().setCurrentTutor(
			role === "staff"
				? {
						_id: "followup-tutor",
						name: "Tutor",
						email: "tutor@example.invalid",
						age: 30,
						state: "GA",
						usersOfTutorLength: 0,
						coursePermissions: ["assembly"],
						editTutors: false,
						saveEdit: "Save"
					}
				: null
		);
		const course = (await useCoursesStore().loadCourseById("assembly"))!;
		const identity = course.modules.flatMap(module =>
			(
				[
					["core", module.curriculum],
					["optional", module.supplementalProjects]
				] as const
			).flatMap(([section, items]) =>
				items.map(item => ({
					moduleId: module.id,
					id: item.id,
					section
				}))
			)
		);
		expect(
			createHash("sha256").update(JSON.stringify(identity)).digest("hex")
		).toBe(
			"96c875e17d62a6c7f527e2ee93557817fc261db4b683db1007c8741b0505b72c"
		);
		for (const expected of activities) {
			const item = course.modules
				.flatMap(module => module.supplementalProjects)
				.find(item => item.id === expected.id)!;
			expect(item.title).toBe(expected.title);
			expect(item.learningPath).toBe(expected.path);
			expect(item.ideImport).toBe(true);
			const root =
				"https://github.com/instruction-material/Assembly/tree/" +
				expected.root;
			expect(item.projectLink).toBe(root + "/starter");
			expect(item.solutionLink).toBe(
				role === "staff" ? root + "/solution" : undefined
			);
			expect(item.content).toContain(
				readFileSync(
					resolve(
						process.cwd(),
						"src/assets/course-guides/assembly-followup-" +
							expected.guide +
							".md"
					),
					"utf8"
				).trim()
			);
			expect(item.content).toContain(expected.baseline.trim());
			for (const sourceRole of ["starter", "reference"] as const) {
				const url =
					root +
					(sourceRole === "starter" ? "/starter" : "/solution");
				const key = `assembly:${expected.core}:${sourceRole}:native-assembly`;
				expect(
					assemblyCourseProjectKey(
						"assembly",
						item.id,
						sourceRole,
						url
					)
				).toBe(key);
				expect(
					assemblyCourseProjectKey(
						"assembly",
						expected.core,
						sourceRole,
						url
					)
				).toBe(key);
				expect(
					assemblyCourseProjectKey(
						"assembly",
						"another-activity",
						sourceRole,
						url
					)
				).toBe(
					`assembly:another-activity:${sourceRole}:native-assembly`
				);
			}
		}
	}
);
