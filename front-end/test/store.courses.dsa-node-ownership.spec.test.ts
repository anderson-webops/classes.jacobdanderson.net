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
		});
	}
});
