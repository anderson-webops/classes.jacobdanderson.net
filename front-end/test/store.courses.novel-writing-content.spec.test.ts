import { createPinia, setActivePinia } from "pinia";
import { mount } from "@vue/test-utils";
import { expect, it, vi } from "vitest";
import LazyMarkdownContent from "@/components/LazyMarkdownContent.vue";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { novelWritingCourse } from "@/stores/courses/source-library-courses";

it.each(["learner", "instructor"])(
	"supplies Novel Writing models and preserves every manuscript task for %s",
	async role => {
		setActivePinia(createPinia());
		if (role === "instructor")
			useAppStore().setCurrentTutor({
				_id: "novel-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 0,
				coursePermissions: ["novel-writing"],
				editTutors: false,
				saveEdit: "Save"
			});
		const course =
			(await useCoursesStore().loadCourseById("novel-writing"))!;
		const modules = course.modules.filter(module => !module.internal);
		expect(modules).toHaveLength(14);
		for (const original of novelWritingCourse.modules) {
			const module = modules.find(item => item.title === original.title)!;
			const readings = module.curriculum.filter(isLessonLearningItem);
			expect(readings, module.title).toHaveLength(1);
			expect(
				module.supplementalProjects.filter(isLessonLearningItem),
				module.title
			).toEqual([]);
			expect(readings[0].content, module.title).not.toContain(
				"Define the important terms in plain language"
			);
			expect(readings[0].content, module.title).not.toContain(
				"Break a typical problem, passage, speech outline"
			);
			for (const source of original.curriculum.slice(1)) {
				const project = module.curriculum.find(
					item => item.title === source.title
				)!;
				expect(project.content, source.title).toBe(
					source.content.replace(/^\*\*Project goal:\*\*\s*/, "")
				);
				expect(isLessonLearningItem(project), source.title).toBe(false);
			}
		}
		const scope = modules[0].curriculum.find(isLessonLearningItem)!;
		expect(scope.content).toContain("6,000 / 8 = 750");
		expect(scope.content).toContain("3,600 remain");
		expect(scope.content).toContain("900 words each");
		const narration = modules
			.find(module => module.title === "NW8 Narration")!
			.curriculum.find(isLessonLearningItem)!;
		expect(narration.content).toContain(
			"unspoken thought Mina cannot know"
		);
		const dialogue = modules
			.find(module => module.title === "NW10 Writing Dialogue")!
			.curriculum.find(isLessonLearningItem)!;
		const wrapper = mount(LazyMarkdownContent, {
			props: { content: dialogue.content }
		});
		try {
			await vi.waitFor(() =>
				expect(wrapper.findAll("blockquote p")).toHaveLength(4)
			);
			expect(wrapper.find("blockquote p").text()).toBe(
				'"Did you touch the rope?" Bo asked.'
			);
			expect(
				wrapper.findAll(".item-content-markdown > p > br")
			).toHaveLength(0);
		} finally {
			wrapper.unmount();
		}
	}
);
