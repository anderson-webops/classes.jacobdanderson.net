import { createHash } from "node:crypto";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it, vi } from "vitest";
import published from "../../test/fixtures/catalog-published-identities.json";
import restored from "../../test/fixtures/entrepreneurship-restored-core-identities.json";
import LazyMarkdownContent from "@/components/LazyMarkdownContent.vue";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { entrepreneurship101Course } from "@/stores/courses/source-library-courses";

const EXPECTED_MODULE_SEQUENCE = [
	"ENT1 Design Thinking Methodology",
	"ENT2 Learning What It Takes To Be An Entrepreneur",
	"ENT3 Solving Problems Through Entrepreneurship",
	"ENT4 Identifying the Ideal Customer",
	"ENT5 Iterating On Your Idea",
	"ENT6 Conducting Competitor Analysis",
	"ENT7 Testing Financial Feasibility",
	"ENT8 Building and Testing Marketing Strategies",
	"ENT9 Focusing on Social Impact",
	"ENT10 Be Your Own Boss Master Project"
];

function requireModule(title: string) {
	const module = entrepreneurship101Course.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Entrepreneurship module ${title}.`);
	return module;
}

describe("Entrepreneurship 101 learner flow", () => {
	it.each(["learner", "instructor"])(
		"preserves published projects and complete Learn readings for %s",
		async role => {
			setActivePinia(createPinia());
			if (role === "instructor")
				useAppStore().setCurrentTutor({
					_id: "venture-tutor",
					name: "Tutor",
					email: "tutor@example.invalid",
					age: 30,
					state: "GA",
					usersOfTutorLength: 0,
					coursePermissions: ["entrepreneurship-101"],
					editTutors: false,
					saveEdit: "Save"
				});
			const course = (await useCoursesStore().loadCourseById(
				"entrepreneurship-101"
			))!;
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
			const originalIdentities = identities.filter(
				item => !restored.some(added => added.id === item.id)
			);
			expect(restored).toHaveLength(13);
			expect(identities).toHaveLength(
				published["entrepreneurship-101"].items + 13
			);
			for (const added of restored)
				expect(identities.filter(item => item.id === added.id)).toEqual([
					added
				]);
			expect(
				createHash("sha256")
					.update(JSON.stringify(originalIdentities))
					.digest("hex")
			).toBe(published["entrepreneurship-101"].sha256);
			const readings = course.modules.flatMap(module =>
				module.curriculum.filter(item => item.contentKind === "reading")
			);
			expect(readings).toHaveLength(10);
			const projects = course.modules.flatMap(module =>
				module.curriculum.filter(item =>
					item.content.startsWith("**Project goal:**")
				)
			);
			expect(projects).toHaveLength(19);
			expect(projects.every(item => !isLessonLearningItem(item))).toBe(true);
			for (const reading of readings) {
				expect(isLessonLearningItem(reading), reading.title).toBe(true);
				expect(reading.content).not.toContain("Define the important terms");
				expect(reading.content).toContain("## Worked");
				expect(reading.content).toContain("**Course flow:**");
			}
			const financial = readings.find(item =>
				item.title.includes("Financial Feasibility")
			)!;
			const wrapper = mount(LazyMarkdownContent, {
				props: { content: financial.content }
			});
			try {
				await vi.waitFor(() =>
					expect(wrapper.findAll("tbody tr")).toHaveLength(3)
				);
				expect(wrapper.text()).toContain("-$800");
				expect(wrapper.text()).toContain("$5,600");
				expect(wrapper.text()).toContain("$9,600");
				expect(wrapper.text()).toContain("margin is undefined");
			} finally {
				wrapper.unmount();
			}
		}
	);

	it("carries one venture from assumptions through an evidence-based pitch", () => {
		expect(
			entrepreneurship101Course.modules.map(module => module.title)
		).toEqual(EXPECTED_MODULE_SEQUENCE);
		expect(
			requireModule("ENT1 Design Thinking Methodology").curriculum[0]
				?.content
		).toContain("one venture portfolio");
		expect(
			requireModule("ENT10 Be Your Own Boss Master Project").curriculum[0]
				?.content
		).toContain("Reconcile the venture canvas");
	});

	it("gives every module pacing, venture targets, and explicit paths", () => {
		for (const module of entrepreneurship101Course.modules) {
			expect(module.estimatedTime, module.title).toMatch(/session/);
			expect(
				module.keyBlocks?.length,
				module.title
			).toBeGreaterThanOrEqual(5);
			expect(
				module.curriculum.every(item => item.learningPath === "core"),
				module.title
			).toBe(true);
			expect(
				module.supplementalProjects.every(item =>
					["choice", "challenge"].includes(item.learningPath ?? "")
				),
				module.title
			).toBe(true);
			expect(module.curriculum[0]?.content, module.title).toContain(
				"**Course flow:**"
			);
		}
	});

	it("keeps side experiences optional while preserving every source project", () => {
		const requiredCount = entrepreneurship101Course.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const optionCount = entrepreneurship101Course.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);
		const choiceTitles = entrepreneurship101Course.modules.flatMap(module =>
			module.supplementalProjects
				.filter(item => item.learningPath === "choice")
				.map(item => item.title)
		);

		expect(requiredCount).toBe(29);
		expect(optionCount).toBe(24);
		for (const optionalProject of [
			"Ideal Wallet Design Sprint",
			"Brand Foundation Website Page",
			"Coffee Shop Customer Needs Simulation",
			"Cause-Aligned Website Page and Campaign"
		]) {
			expect(choiceTitles).toContain(optionalProject);
		}
	});

	it("supports privacy-respecting research and a private completion path", () => {
		expect(
			requireModule("ENT2 Learning What It Takes To Be An Entrepreneur")
				.curriculum[0]?.content
		).toContain("consented, non-identifying observation evidence");
		expect(
			requireModule("ENT4 Identifying the Ideal Customer").curriculum[0]
				?.content
		).toContain(
			"anonymous, opt-in, instructor-supplied, or simulated responses"
		);
		expect(
			requireModule("ENT8 Building and Testing Marketing Strategies")
				.curriculum[0]?.content
		).toContain(
			"Public posts, ad spending, data collection, and real sales are not required"
		);
		expect(
			requireModule("ENT10 Be Your Own Boss Master Project").curriculum[0]
				?.content
		).toContain(
			"launch, public posting, incorporation, and real sales are not required"
		);
	});

	it("uses sensitivity cases, tool fallbacks, and no missing image appendix", () => {
		const text = entrepreneurship101Course.modules
			.flatMap(module => [
				module.title,
				...module.curriculum.map(item => item.content),
				...module.supplementalProjects.map(item => item.content)
			])
			.join("\n");

		expect(
			requireModule("ENT7 Testing Financial Feasibility").curriculum[0]
				?.content
		).toContain("low, base, and high customer cases");
		expect(
			requireModule("ENT4 Identifying the Ideal Customer").curriculum[0]
				?.content
		).toContain("text-table fallback");
		expect(
			entrepreneurship101Course.modules.some(
				module => module.title === "Pending Static Assets"
			)
		).toBe(false);
		for (const filename of [
			"ent3_project2_0.png",
			"ent3_project2_1.png",
			"ent4_project2_0.png",
			"ent5_project1_0.png"
		]) {
			expect(text).not.toContain(filename);
		}
	});
});
