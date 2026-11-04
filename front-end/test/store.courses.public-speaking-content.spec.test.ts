import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { expect, it, vi } from "vitest";
import LazyMarkdownContent from "@/components/LazyMarkdownContent.vue";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { introductionToPublicSpeakingCourse } from "@/stores/courses/source-library-courses";

it.each(["learner", "instructor"])(
	"supplies Public Speaking inputs and retains all performance tasks for %s",
	async role => {
		const id = "introduction-to-public-speaking";
		setActivePinia(createPinia());
		if (role === "instructor")
			useAppStore().setCurrentTutor({
				_id: "speaking-tutor",
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
		const modules = course.modules.filter(module => !module.internal);
		expect(modules).toHaveLength(9);
		for (const original of introductionToPublicSpeakingCourse.modules) {
			const module = modules.find(item => item.title === original.title)!;
			const readings = module.curriculum.filter(isLessonLearningItem);
			expect(readings, module.title).toHaveLength(1);
			expect(readings[0].content, module.title).not.toContain(
				"Define the important terms in plain language"
			);
			for (const project of original.curriculum.slice(1)) {
				const current = module.curriculum.find(
					item => item.title === project.title
				)!;
				expect(current.content, project.title).toBe(project.content);
				expect(isLessonLearningItem(current), project.title).toBe(
					false
				);
			}
			expect(
				module.supplementalProjects.filter(isLessonLearningItem)
			).toEqual([]);
		}
		const argument = modules
			.find(module => module.title === "MYP7 Defense Attorney")!
			.curriculum.find(isLessonLearningItem)!;
		const cases = mount(LazyMarkdownContent, {
			props: { content: argument.content }
		});
		try {
			await vi.waitFor(() =>
				expect(cases.findAll("ol li")).toHaveLength(3)
			);
			expect(cases.text()).toContain("These invented cases");
			expect(cases.text()).toContain("not research");
			expect(cases.text()).toContain(
				"money can remove some practical obstacles"
			);
		} finally {
			cases.unmount();
		}
		const capstone = modules.at(-1)!.curriculum.find(isLessonLearningItem)!;
		const talks = mount(LazyMarkdownContent, {
			props: { content: capstone.content }
		});
		try {
			await vi.waitFor(() =>
				expect(talks.findAll("blockquote")).toHaveLength(3)
			);
			expect(talks.findAll("blockquote p")).toHaveLength(3);
			expect(talks.text()).toContain("not TED or TED-Ed talks");
			expect(talks.text()).toContain(
				"mark framing, lighting and visual-edit checks as not applicable"
			);
			expect(
				talks.findAll(".item-content-markdown > p > br")
			).toHaveLength(0);
		} finally {
			talks.unmount();
		}
	}
);
