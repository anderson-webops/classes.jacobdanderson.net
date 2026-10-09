import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { cppBuildInstructions } from "@/modules/cppBuildInstructions";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const courseId = "data-structures-and-algorithms-in-cpp";
const folders = [
	"DSCPP1-Task-Manager-CLI",
	"DSCPP6-Template-Linked-List",
	"DSCPP7-Binary-Search-Tree",
	"DSCPP8-AVL-Tree",
	"DSCPP9-Performance-Benchmarks"
];
const ownershipPacks = [
	[
		"DSCPP6-Template-Linked-List",
		"dscpp6",
		"dscpp6-templates-and-linked-structures"
	],
	["DSCPP7-Binary-Search-Tree", "dscpp7", "dscpp7-binary-search-trees"],
	["DSCPP8-AVL-Tree", "dscpp8", "dscpp8-avl-trees-and-rebalancing"]
];

describe("node-owning course native build directions", () => {
	beforeEach(() => setActivePinia(createPinia()));
	for (const role of ["learner", "instructor"] as const) {
		it(`uses C++20 for the actual ${role} catalog project identities`, async () => {
			if (role === "instructor")
				useAppStore().setCurrentTutor({
					_id: "ownership-tutor",
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
			for (const folder of folders) {
				const item = course.modules
					.flatMap(module => module.curriculum)
					.find(item =>
						item.projectLink?.endsWith(`/${folder}/starter`)
					)!;
				expect(item).toBeDefined();
				for (const sourceRole of role === "learner"
					? ["starter"]
					: ["starter", "solution"]) {
					const directions = cppBuildInstructions(
						[{ name: "main.cpp", content: "" }],
						`${courseId}:${item.id}:${sourceRole}`
					).join("\n");
					expect(directions, folder).toContain("-std=c++20");
					expect(directions).toContain("'main.cpp'");
				}
			}
			for (const [folder, unit, anchor] of ownershipPacks) {
				const item = course.modules
					.flatMap(module => module.curriculum)
					.find(item =>
						item.projectLink?.endsWith(`/${folder}/starter`)
					)!;
				const links = [
					...item.content.matchAll(
						/\[Open current starter separately\]\((\/ide\?[^)]+)\)/g
					)
				];
				expect(links).toHaveLength(1);
				const params = new URL(links[0][1], "https://classes.local")
					.searchParams;
				expect(params.get("projectKey")).toBe(
					`${courseId}:${unit}-node-ownership:current-pack-v1`
				);
				expect(params.get("projectKey")).not.toBe(
					`${courseId}:${item.id}:starter`
				);
				expect(params.get("course")).toBe(courseId);
				expect(params.get("mode")).toBe("cpp");
				expect(params.get("starterUrl")).toBe(item.projectLink);
				expect(params.get("starterTitle")).toBe(item.title);
				expect(params.get("starterLabel")).toBe("Learner starter");
				expect(params.get("lesson")).toBe(`${courseId}-${anchor}`);
				expect(item.ideImport).toBe(true);
				expect(item.content).toContain("preserves the earlier project");
				if (role === "learner") {
					expect(item.solutionLink).toBeUndefined();
					expect(item.content).not.toContain("/solution");
				}
			}
		});
	}
});
