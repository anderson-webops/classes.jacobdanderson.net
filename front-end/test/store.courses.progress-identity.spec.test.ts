import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { courseCatalog } from "@/stores/courses/index";

describe("saved course progress identities", () => {
	it("recognizes section IDs from the generic-title era", async () => {
		setActivePinia(createPinia());
		const store = useCoursesStore();
		const scratchModules = [
			["scratch-level-1", "scratch-level-1-gs14-mini-game-polish-studio"],
			[
				"scratch-level-1",
				"scratch-level-1-gs15-interactive-story-studio"
			],
			[
				"scratch-level-1",
				"scratch-level-1-gs16-debugging-and-remix-studio"
			],
			[
				"scratch-level-1",
				"scratch-level-1-gs17-text-based-programming-bridge"
			],
			["scratch-level-2", "scratch-level-2-gm12-arcade-systems-studio"],
			[
				"scratch-level-2",
				"scratch-level-2-gm13-simulation-and-data-studio"
			],
			[
				"scratch-level-2",
				"scratch-level-2-gm14-code-organization-and-debugging-studio"
			],
			[
				"scratch-level-2",
				"scratch-level-2-gm15-text-based-programming-bridge"
			]
		] as const;

		for (const [courseId, oldModuleId] of scratchModules) {
			const course = await store.loadCourseById(courseId);
			const module = course?.modules.find(
				entry => entry.id === oldModuleId
			);
			expect(module, oldModuleId).toBeDefined();
			const itemAliases = [
				...(module?.curriculum ?? []),
				...(module?.supplementalProjects ?? [])
			].flatMap(item => item.aliases ?? []);
			for (const oldId of [
				`${oldModuleId}-curriculum-core-concepts`,
				`${oldModuleId}-curriculum-build-requirements`,
				`${oldModuleId}-supplemental-common-bug-patterns`
			]) {
				expect(itemAliases, oldId).toContain(oldId);
			}
		}

		const dataScienceModules = [
			"data-science-in-python-dsp10-applied-studio-csv-summaries-and-sanity-checks",
			"data-science-in-python-dsp11-applied-studio-cleaning-missing-and-invalid-rows",
			"data-science-in-python-dsp12-applied-studio-grouped-summaries-by-category",
			"data-science-in-python-dsp13-applied-studio-visualization-choice-and-chart-integrity",
			"data-science-in-python-dsp14-applied-studio-reproducible-mini-reports",
			"data-science-in-python-dsp15-applied-studio-lightweight-dashboards-and-filters",
			"data-science-in-python-dsp16-applied-studio-capstone-data-story-readiness"
		];
		const dataScienceCourse = await store.loadCourseById(
			"data-science-in-python"
		);
		for (const oldModuleId of dataScienceModules) {
			const module = dataScienceCourse?.modules.find(
				entry => entry.id === oldModuleId
			);
			expect(module, oldModuleId).toBeDefined();
			expect(module?.curriculum[0].aliases).toContain(
				`${oldModuleId}-curriculum-concept-path`
			);
			expect(module?.curriculum[1].aliases).toContain(
				`${oldModuleId}-curriculum-worked-example`
			);
		}
	});

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
