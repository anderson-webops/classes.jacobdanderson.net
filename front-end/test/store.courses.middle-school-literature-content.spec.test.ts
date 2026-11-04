import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { expect, it, vi } from "vitest";
import published from "../../test/fixtures/catalog-published-identities.json";
import restored from "../../test/fixtures/middle-school-literature-restored-identities.json";
import LazyMarkdownContent from "@/components/LazyMarkdownContent.vue";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { middleSchoolLiteratureCourse } from "@/stores/courses/source-library-courses";

it.each(["learner", "instructor"])(
	"supplies literature texts and distinct analysis assignments for %s",
	async role => {
		const id = "middle-school-a-literature";
		setActivePinia(createPinia());
		if (role === "instructor")
			useAppStore().setCurrentTutor({
				_id: "literature-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 0,
				coursePermissions: [id],
				editTutors: false,
				saveEdit: "Save"
			});
		const course = (await useCoursesStore().loadCourseById(id))!;
		const all = course.modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		const identities = course.modules.flatMap(module =>
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
		const projects = middleSchoolLiteratureCourse.modules
			.flatMap(module => module.curriculum)
			.filter(item => item.content.startsWith("**Project goal:**"));
		const missingProjects = projects.filter(
			project => !all.some(item => item.title === project.title)
		);
		if (process.env.COURSE_LITERATURE_PROOF_DIR) {
			mkdirSync(process.env.COURSE_LITERATURE_PROOF_DIR, {
				recursive: true
			});
			writeFileSync(
				join(
					process.env.COURSE_LITERATURE_PROOF_DIR,
					`${id}-${role}.json`
				),
				JSON.stringify(
					{
						id,
						role,
						identities,
						missingProjects: missingProjects.map(
							item => item.title
						),
						modules: course.modules
					},
					null,
					2
				) + "\n"
			);
		}
		expect(missingProjects.map(item => item.title)).toEqual([]);
		expect(all.filter(item => item.contentKind === "reading")).toHaveLength(
			13
		);
		expect(identities).toHaveLength(published[id].items + restored.length);
		for (const added of restored)
			expect(identities.filter(item => item.id === added.id)).toEqual([
				added
			]);
		const originalIdentities = identities.filter(
			item => !restored.some(added => added.id === item.id)
		);
		expect(
			createHash("sha256")
				.update(JSON.stringify(originalIdentities))
				.digest("hex")
		).toBe(published[id].sha256);
		for (const project of projects) {
			const current = all.find(item => item.title === project.title)!;
			expect(current.learningPath, current.title).toBe("core");
			expect(isLessonLearningItem(current), current.title).toBe(false);
		}
		const text = all.map(item => item.content).join("\n");
		expect(text).toContain("Original practice passage: Kyra's Fear");
		expect(text).toContain("Original practice passage: Soccer Summer");
		expect(text).toContain("Original practice passage: Car Ride");
		expect(text).not.toContain("lawful copy of");
		const sound = course.modules
			.find(
				module => module.title === "MSA9 Analyzing Rhyme & Alliteration"
			)!
			.curriculum.find(item => item.contentKind === "reading")!;
		const wrapper = mount(LazyMarkdownContent, {
			props: { content: sound.content }
		});
		try {
			await vi.waitFor(() =>
				expect(wrapper.findAll("ol li")).toHaveLength(4)
			);
			expect(wrapper.findAll("ol li")[0].text()).toContain(
				"Silver seeds"
			);
			expect(wrapper.findAll("ol li")[3].text()).toContain("glow");
		} finally {
			wrapper.unmount();
		}
		const showcase = course.modules
			.find(module => module.title === "MSA11 Master Project")!
			.curriculum.find(item => item.contentKind === "reading")!;
		const image = mount(LazyMarkdownContent, {
			props: { content: showcase.content }
		});
		try {
			await vi.waitFor(() =>
				expect(image.find("img").attributes("src")).toBe(
					"/illustrations/literature-station.svg"
				)
			);
			expect(image.find("img").attributes("alt")).toContain(
				"clock at 6:10"
			);
			expect(image.text()).toContain(
				"The image description can serve as the prompt"
			);
		} finally {
			image.unmount();
		}
	}
);
