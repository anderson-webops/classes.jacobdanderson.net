import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { courseCatalog } from "@/stores/courses/index";

describe("saved course progress identities", () => {
	it("recognizes IDs from legacy-branded project titles", async () => {
		setActivePinia(createPinia());
		const store = useCoursesStore();
		const cases = [
			{
				courseId: "python-level-2",
				currentTitle: "PS2 Supplemental Project 8: Archery Simulator",
				oldId: "python-level-2-ps2-for-loops-and-while-loops-supplemental-ps2-supplemental-project-8-juni-archery"
			},
			{
				courseId: "python-level-2",
				currentTitle: "PS5 Supplemental Project 2: Word Translator",
				oldId: "python-level-2-ps5-functions-supplemental-ps5-supplemental-project-2-juni-latin"
			},
			{
				courseId: "python-level-2",
				currentTitle: "PS11 Supplemental Project 2: Theme Park Planner",
				oldId: "python-level-2-ps11-bank-account-supplemental-ps11-supplemental-project-2-juni-world"
			},
			{
				courseId: "python-level-3",
				currentTitle: "AM1 Project 2: Fictional Language Verifier",
				oldId: "python-level-3-am1-review-variables-strings-input-loops-conditionals-curriculum-am1-project-2-junian-language-verifier"
			},
			{
				courseId: "python-level-3",
				currentTitle: "AM1 Project 3: Command Assistant",
				oldId: "python-level-3-am1-review-variables-strings-input-loops-conditionals-curriculum-am1-project-3-juni-assistant"
			},
			{
				courseId: "python-level-3",
				currentTitle: "AM12 Project 3: Word Translator with File I/O",
				oldId: "python-level-3-am12-file-input-output-curriculum-am12-project-3-juni-latin-with-file-io"
			},
			{
				courseId: "ai-level-1",
				currentTitle: "Project: Book Rule System",
				oldId: "ai-level-1-unit-5-rule-based-systems-and-puzzle-framing-supplemental-project-juni-book-rule-system"
			},
			{
				courseId: "java-level-3",
				currentTitle: "AJ10 Project 1: Bakery Model",
				oldId: "java-level-3-aj10-sustainable-programming-curriculum-aj10-project-1-juni-bakery"
			},
			{
				courseId: "java-level-3",
				currentTitle: "AJ15 Project 2: Mini Search Engine",
				oldId: "java-level-3-aj15-hash-tables-curriculum-aj15-project-2-juni-search-engine"
			},
			{
				courseId: "javascript-level-1-javascript-superstar",
				currentTitle: "JSS8 Supplemental Project 1: Archery Simulator",
				oldId: "javascript-level-1-javascript-superstar-jss8-nested-loops-supplemental-jss8-supplemental-project-1-juni-archery"
			},
			{
				courseId: "javascript-level-1-javascript-superstar",
				currentTitle:
					"JSS15 Supplemental Project 1: Restaurant Splash Page",
				oldId: "javascript-level-1-javascript-superstar-jss15-master-project-supplemental-jss15-supplemental-project-1-juni-eatz"
			},
			{
				courseId: "javascript-level-1-javascript-superstar",
				currentTitle: "JSS15 Supplemental Project 2: News Homepage",
				oldId: "javascript-level-1-javascript-superstar-jss15-master-project-supplemental-jss15-supplemental-project-2-juni-news"
			},
			{
				courseId: "javascript-level-2-javascript-master",
				currentTitle: "JSM3 Project 2: Department Store Discounts",
				oldId: "javascript-level-2-javascript-master-jsm3-complex-conditionals-curriculum-jsm3-project-2-juni-department-store"
			}
		];

		for (const { courseId, currentTitle, oldId } of cases) {
			const course = await store.loadCourseById(courseId);
			const item = course?.modules
				.flatMap(module => [
					...module.curriculum,
					...module.supplementalProjects
				])
				.find(item => item.title === currentTitle);
			expect(item, currentTitle).toBeDefined();
			expect(item?.aliases, oldId).toContain(oldId);
		}
	});

	it("does not claim the same scoped ID for different modules or items", async () => {
		setActivePinia(createPinia());
		const store = useCoursesStore();
		for (const { id: courseId } of courseCatalog) {
			const course = await store.loadCourseById(courseId);
			expect(course).not.toBeNull();
			const moduleOwners = new Map<string, string>();
			const itemOwners = new Map<string, string>();
			for (const module of course!.modules) {
				for (const id of [module.id, ...(module.aliases ?? [])]) {
					if (!id.startsWith(`${courseId}-`)) continue;
					const previousOwner = moduleOwners.get(id);
					expect(
						previousOwner === undefined ||
							previousOwner === module.id,
						`${courseId}: ${id}`
					).toBe(true);
					moduleOwners.set(id, module.id);
				}
				for (const item of [
					...module.curriculum,
					...module.supplementalProjects
				]) {
					for (const id of [item.id, ...(item.aliases ?? [])]) {
						if (!id.startsWith(`${courseId}-`)) continue;
						const previousOwner = itemOwners.get(id);
						expect(
							previousOwner === undefined ||
								previousOwner === item.id,
							`${courseId}: ${id}`
						).toBe(true);
						itemOwners.set(id, item.id);
					}
				}
			}
		}
	});
});
