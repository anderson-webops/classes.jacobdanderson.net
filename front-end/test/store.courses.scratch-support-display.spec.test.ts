import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

describe("Scratch supplemental instructions in the displayed course", () => {
	for (const role of ["learner", "instructor"] as const) {
		for (const id of ["scratch-level-1", "scratch-level-2"]) {
			it(`preserves practice, verification and independent starts for ${role} in ${id}`, async () => {
				setActivePinia(createPinia());
				if (role === "instructor")
					useAppStore().setCurrentTutor({
						_id: "scratch-support-tutor",
						name: "Tutor",
						email: "tutor@example.invalid",
						age: 30,
						state: "GA",
						usersOfTutorLength: 0,
						coursePermissions: [id],
						editTutors: false,
						saveEdit: "Save"
					});
				const course = await useCoursesStore().loadCourseById(id);
				expect(course).not.toBeNull();
				const items = course!.modules.flatMap(
					module => module.supplementalProjects
				);
				const drills = items.filter(item =>
					item.title.startsWith("Fluency Drill:")
				);
				const variants = items.filter(item =>
					item.title.startsWith("Open-Ended Variant:")
				);
				expect(drills.length).toBeGreaterThanOrEqual(5);
				expect(variants.length).toBeGreaterThanOrEqual(10);
				for (const item of drills) {
					expect(item.content, item.title).toContain(
						"**Practice path:**"
					);
					expect(item.content, item.title).toContain(
						"**Checkpoint:**"
					);
				}
				for (const item of variants) {
					expect(item.content, item.title).toContain(
						"**Design path:**"
					);
					expect(item.content, item.title).toContain(
						"**Verification:**"
					);
					expect(item.content, item.title).toContain(
						"[open an empty Scratch project](/ide?mode=scratch&starter=blank)"
					);
					expect(item.content, item.title).toContain(
						"Download the working .sb3 file before starting a new scene."
					);
					expect(item.content, item.title).toContain("**Open .sb3**");
				}
			});
		}
	}
});
