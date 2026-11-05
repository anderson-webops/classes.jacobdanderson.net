import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { expect, it, vi } from "vitest";
import published from "../../test/fixtures/catalog-published-identities.json";
import restored from "../../test/fixtures/middle-school-writing-restored-identities.json";
import LazyMarkdownContent from "@/components/LazyMarkdownContent.vue";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import {
	middleSchoolWritingCourse,
	middleSchoolWritingRetakeCourse
} from "@/stores/courses/source-library-courses";

const cases = [
	{
		id: "middle-school-b-writing",
		source: middleSchoolWritingCourse,
		readings: 14
	},
	{
		id: "middle-school-b-writing-retake",
		source: middleSchoolWritingRetakeCourse,
		readings: 16
	}
] as const;

it.each(
	cases.flatMap(course =>
		["learner", "instructor"].map(role => ({ ...course, role }))
	)
)(
	"provides complete writing inputs and distinct assignments for $id $role",
	async ({ id, source, readings: readingCount, role }) => {
		setActivePinia(createPinia());
		if (role === "instructor")
			useAppStore().setCurrentTutor({
				_id: "writing-tutor",
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
		const projects = source.modules
			.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			])
			.filter(item => item.content.startsWith("**Project goal:**"));
		const missingProjects = projects.filter(
			project => !all.some(item => item.title === project.title)
		);
		if (process.env.COURSE_WRITING_PROOF_DIR) {
			mkdirSync(process.env.COURSE_WRITING_PROOF_DIR, {
				recursive: true
			});
			writeFileSync(
				join(
					process.env.COURSE_WRITING_PROOF_DIR,
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
						readings: all.filter(
							item => item.contentKind === "reading"
						),
						modules: course.modules.map(module => ({
							title: module.title,
							curriculum: module.curriculum.map(item => ({
								title: item.title,
								id: item.id,
								learningPath: item.learningPath
							}))
						}))
					},
					null,
					2
				) + "\n"
			);
		}
		const additions = restored[id];
		expect(identities).toHaveLength(published[id].items + additions.length);
		for (const added of additions)
			expect(identities.filter(item => item.id === added.id)).toEqual([
				added
			]);
		const originalIdentities = identities.filter(
			item => !additions.some(added => added.id === item.id)
		);
		expect(
			createHash("sha256")
				.update(JSON.stringify(originalIdentities))
				.digest("hex")
		).toBe(published[id].sha256);
		expect(all.filter(item => item.contentKind === "reading")).toHaveLength(
			readingCount
		);
		expect(missingProjects.map(item => item.title)).toEqual([]);
		for (const project of projects) {
			const current = all.find(item => item.title === project.title)!;
			expect(current.learningPath, current.title).toBe(
				project.learningPath
			);
		}
		for (const original of source.modules) {
			const module = course.modules.find(
				module => module.title === original.title
			)!;
			const reading = module.curriculum.find(
				item => item.contentKind === "reading"
			)!;
			expect(reading.learningPath, original.title).toBe(
				original.curriculum[0].learningPath
			);
		}
		expect(
			projects.every(
				project =>
					!isLessonLearningItem(
						all.find(item => item.title === project.title)!
					)
			)
		).toBe(true);
		const text = all.map(item => item.content).join("\n");
		expect(text).toContain("Original practice passage: Car Ride");
		expect(text).toContain("Kazim pressed his folded invitation");
		expect(text).toContain("Third-person objective");
		expect(text).toContain("Third-person omniscient");
		const analysis = course.modules
			.find(module => module.title === "MSB4 Analyzing Evidence")!
			.curriculum.find(item => item.contentKind === "reading")!;
		const wrapper = mount(LazyMarkdownContent, {
			props: { content: analysis.content }
		});
		try {
			await vi.waitFor(() =>
				expect(wrapper.findAll("ol li")).toHaveLength(8)
			);
			expect(wrapper.findAll("ol li")[0].text()).toContain(
				"Kazim pressed his folded invitation"
			);
			expect(wrapper.findAll("ol li")[7].text()).toContain(
				"lifting the model with both hands"
			);
		} finally {
			wrapper.unmount();
		}
	}
);
