import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { cppBuildInstructions } from "@/modules/cppBuildInstructions";
import {
	pythonIdeModeForCourseId,
	pythonIdeModeForCourseResource
} from "@/modules/pythonIde";
import { usacoRestoredResources } from "@/modules/usacoProjectResources";
import { marathonSavedItemId } from "@/stores/courses/usacoRestoredProjectBriefs";
import { usacoExistingProjectIds } from "../../test/fixtures/usaco-restored-packs.mjs";

beforeEach(() => setActivePinia(createPinia()));

describe("restored USACO project workflows", () => {
	it("preserves every preexisting repaired project identity", async () => {
		for (const previous of usacoExistingProjectIds) {
			const course = (await useCoursesStore().loadCourseById(
				previous.course
			))!;
			const item = course.modules
				.flatMap((module) => [
					...module.curriculum,
					...module.supplementalProjects
				])
				.find((item) => item.id === previous.id);
			expect(item?.projectLink, previous.id).toBe(previous.url);
		}
	});
	it("selects the actual role language without treating README-only packs as code", () => {
		for (const pack of usacoRestoredResources) {
			expect(pythonIdeModeForCourseId(pack.course)).toBeNull();
			for (const role of ["starter", "solution"]) {
				const url = `https://github.com/instruction-material/${pack.repository}/tree/main/${pack.folder}/${role}`;
				expect(pythonIdeModeForCourseResource(pack.course, url)).toBe(
					pack.mode
				);
				expect(
					pythonIdeModeForCourseResource(
						pack.course,
						url + "/README.md"
					)
				).toBeNull();
				expect(
					pythonIdeModeForCourseResource(
						pack.course,
						url.replace("instruction-material", "someone-else")
					)
				).toBeNull();
			}
		}
		for (const [id, repo, folder] of [
			["usaco-bronze", "USACO-Bronze", "UB1-Square-Pasture-Java"],
			["usaco-silver", "USACO-Silver", "US9-Number-Triangles"],
			["usaco-gold", "USACO-Gold", "UG7-Treasure-Chest"]
		]) {
			expect(
				pythonIdeModeForCourseResource(
					id!,
					`https://github.com/instruction-material/${repo}/tree/main/${folder}/starter`
				)
			).toBeNull();
		}
		expect(
			pythonIdeModeForCourseResource(
				"usaco-bronze-on-demand",
				"https://github.com/instruction-material/USACO-Bronze/tree/main/UB1-Square-Pasture/starter"
			)
		).toBe("python");
	});

	it("loads full contracts and consent-enabled packs without learner reference leaks", async () => {
		for (const pack of usacoRestoredResources) {
			const course = (await useCoursesStore().loadCourseById(
				pack.course
			))!;
			const matches = course.modules
				.flatMap((module) => [
					...module.curriculum,
					...module.supplementalProjects
				])
				.filter((item) =>
					item.projectLink?.endsWith(`/${pack.folder}/starter`)
				);
			expect(matches.length, pack.folder).toBeGreaterThan(0);
			for (const item of matches) {
				expect(item.ideImport).toBe(true);
				expect(item.solutionLink).toBeUndefined();
				expect(item.content).not.toContain("/solution");
				for (const contract of [
					"Contract and reasoning",
					"Guided implementation",
					"Check and explain",
					"Open, save and run",
					"confirm the import",
					"Existing saved attempts",
					"Protected mocks"
				])
					expect(item.content, pack.folder).toContain(contract);
				expect(item.content.length).toBeGreaterThan(2200);
				const stdio =
					pack.folder === "UB62-Cow-College" ||
					pack.folder === "UB63-Feeding-the-Cows";
				expect(item.content).toContain(
					stdio ? "prints no answer" : "no answer file"
				);
				if (stdio) {
					expect(item.content).toContain("Input panel");
					expect(item.content).toContain(
						"python3 main.py < sample.in"
					);
					expect(item.content).not.toContain("rm -f");
					expect(item.content).not.toContain("cat sample.out");
					expect(item.learningPath).not.toBe("core");
				}
				expect(item.content).toContain(
					pack.mode === "cpp" ? "-std=c++20" : "python3 main.py"
				);
			}
		}
	});

	it("keeps Marathon optional in the range unit and preserves its old identity", async () => {
		const course = (await useCoursesStore().loadCourseById("usaco-gold"))!;
		const range = course.modules.find((module) =>
			module.title.includes("Unit 4:")
		)!;
		const marathon = range.supplementalProjects.find((item) =>
			item.projectLink?.includes("UG5-Marathon")
		)!;
		expect(marathon.id).toBe(marathonSavedItemId);
		expect(marathon.learningPath).toBe("choice");
		expect(marathon.aliases).toContain(`${range.id}-supplemental-marathon`);
		expect(
			course.modules
				.flatMap((module) => [
					...module.curriculum,
					...module.supplementalProjects
				])
				.filter((item) => item.projectLink?.includes("UG5-Marathon"))
		).toHaveLength(1);
		expect(marathon.content).toContain("endpoints cannot be skipped");
	});

	it("provides C++20 native instructions only for the relevant projects", () => {
		for (const id of ["usaco-silver", "usaco-gold"])
			expect(
				cppBuildInstructions(
					[{ name: "main.cpp", content: "" }],
					`${id}:item:starter`
				).join("\n")
			).toContain("-std=c++20");
		expect(
			cppBuildInstructions(
				[{ name: "main.cpp", content: "" }],
				"design-patterns-in-cpp:item:starter"
			).join("\n")
		).toContain("-std=c++17");
	});

	it("keeps the completed packs separate and visible to authorized staff", async () => {
		useAppStore().setCurrentTutor({
			_id: "tutor",
			name: "Tutor",
			email: "tutor@example.invalid",
			age: 30,
			state: "GA",
			usersOfTutorLength: 0,
			coursePermissions: ["usaco-gold"],
			editTutors: false,
			saveEdit: "Save"
		});
		const course = (await useCoursesStore().loadCourseById("usaco-gold"))!;
		const item = course.modules
			.flatMap((module) => [
				...module.curriculum,
				...module.supplementalProjects
			])
			.find(item => item.projectLink?.includes("UG5-Marathon"))!;
		expect(item.solutionLink).toBe(
			"https://github.com/instruction-material/USACO-Gold/tree/main/UG5-Marathon/solution"
		);
	});
});
