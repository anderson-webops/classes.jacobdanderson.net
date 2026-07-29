import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { elementaryScienceCourse } from "@/stores/courses/elementary-science";
import { loadRawCourse } from "@/stores/courses/index";

const EXPECTED_SEQUENCE = [
	"ES1 Scientists, Questions, and Evidence",
	"ES2 Living Things and Life Needs",
	"ES3 Habitats, Food Chains, and Ecosystems",
	"ES4 Weather, Water, and Earth Changes",
	"ES5 Matter, Materials, and Changes",
	"ES6 Forces, Motion, and Simple Machines",
	"ES7 Light, Sound, and Signals",
	"ES8 Space, Patterns, and Science Design"
];

function requireModule(title: string) {
	const module = elementaryScienceCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module)
		throw new Error(`Expected Elementary Science module ${title}.`);
	return module;
}

function moduleText(title: string) {
	const module = requireModule(title);
	return [...module.curriculum, ...module.supplementalProjects]
		.map(item => `${item.title}\n${item.content}`)
		.join("\n");
}

function allItems() {
	return elementaryScienceCourse.modules.flatMap(module => [
		...module.curriculum,
		...module.supplementalProjects
	]);
}

function courseText() {
	return elementaryScienceCourse.modules
		.map(module => `${module.title}\n${moduleText(module.title)}`)
		.join("\n");
}

function resourceText() {
	return allItems()
		.flatMap(item => [
			item.projectLink,
			item.solutionLink,
			item.datasetLink,
			item.mediaLink
		])
		.filter(Boolean)
		.join("\n");
}

function markdownHeadingSlugs(markdown: string) {
	return new Set(
		[...markdown.matchAll(/^#{1,6}\s+(.+)$/gm)].map(([, heading]) =>
			heading
				.toLowerCase()
				.replace(/[`*_]/g, "")
				.replace(/[^\p{L}\p{N}\s-]/gu, "")
				.trim()
				.replace(/\s+/g, "-")
				.replace(/-+/g, "-")
		)
	);
}

describe("Elementary Science two-band learner flow", () => {
	it("preserves the eight-module spiral and sixteen distinctive projects", () => {
		expect(
			elementaryScienceCourse.modules.map(module => module.title)
		).toEqual(EXPECTED_SEQUENCE);

		const projectTitles = elementaryScienceCourse.modules.flatMap(module =>
			module.supplementalProjects.map(item => item.title)
		);
		expect(projectTitles).toHaveLength(16);
		for (const title of [
			"Project: Observation Field Guide Page",
			"Project: Creature Survival Profile",
			"Project: Digital Food Web Poster",
			"Project: Weather Report Script",
			"Project: Material Choice Pitch",
			"Project: Force Diagram Story",
			"Project: Signal Design Challenge",
			"Project: Elementary Science Capstone"
		]) {
			expect(projectTitles, title).toContain(title);
		}
	});

	it("makes K–2 and grades 3–5 routes actionable on every task", () => {
		for (const module of elementaryScienceCourse.modules) {
			expect(module.estimatedTime, module.title).toMatch(/session/);
			expect(
				module.keyBlocks?.length,
				module.title
			).toBeGreaterThanOrEqual(6);
			expect(
				module.curriculum.length,
				module.title
			).toBeGreaterThanOrEqual(7);
			expect(
				module.curriculum.every(
					item =>
						item.learningPath === "core" &&
						item.content.includes("**K–2 route:**") &&
						item.content.includes("**Grades 3–5 route:**")
				),
				module.title
			).toBe(true);
			expect(
				module.supplementalProjects.every(
					item =>
						["choice", "challenge"].includes(
							item.learningPath ?? ""
						) &&
						item.content.includes("K–2:") &&
						item.content.includes("Grades 3–5:")
				),
				module.title
			).toBe(true);
			expect(module.curriculum[0]?.content, module.title).toContain(
				"**Course flow:**"
			);
		}
	});

	it("ships substantive linked cards that survive catalog normalization", async () => {
		for (const item of allItems()) {
			expect(item.content.length, item.title).toBeGreaterThanOrEqual(650);
			expect(
				Boolean(
					item.datasetLink ??
					item.solutionLink ??
					item.mediaLink ??
					item.projectLink
				),
				item.title
			).toBe(true);
		}

		const loaded = await loadRawCourse("elementary-science");
		expect(loaded).not.toBeNull();
		const coreModules = loaded!.modules.filter(
			module => module.kind !== "appendix"
		);
		expect(coreModules.map(module => module.title)).toEqual(
			EXPECTED_SEQUENCE
		);
		for (const module of coreModules) {
			expect(
				module.curriculum.length,
				module.title
			).toBeGreaterThanOrEqual(7);
			expect(module.supplementalProjects, module.title).toHaveLength(2);
			for (const item of [
				...module.curriculum,
				...module.supplementalProjects
			]) {
				expect(item.content.length, item.title).toBeGreaterThanOrEqual(
					650
				);
				expect(
					Boolean(
						item.datasetLink ??
						item.solutionLink ??
						item.mediaLink ??
						item.projectLink
					),
					item.title
				).toBe(true);
			}
		}
	});

	it("builds observation, inference, fair comparison, and accessible notebook habits", () => {
		const practices = moduleText("ES1 Scientists, Questions, and Evidence");

		expect(practices).toContain(
			"Start with the phenomenon before vocabulary"
		);
		expect(practices).toContain(
			"observation and inference remain separately labeled"
		);
		expect(practices).toContain(
			"Speaking, pointing, dictation, drawing, or selecting"
		);
		expect(practices).toContain(
			"Personal certainty, a guess, a vocabulary definition"
		);
		expect(practices).toContain("video evidence has a still or transcript");
	});

	it("handles living-things evidence and ecosystems without checklist shortcuts", () => {
		const living = moduleText("ES2 Living Things and Life Needs");
		const ecosystems = moduleText(
			"ES3 Habitats, Food Chains, and Ecosystems"
		);

		expect(living).toContain("No single everyday clue decides every case");
		expect(living).toContain("Seeds are living but may be dormant");
		expect(living).toContain(
			"A structure is a part or arrangement; function is a job"
		);
		expect(ecosystems).toContain(
			"food-web arrow points from the food or energy source"
		);
		expect(ecosystems).toContain(
			"Decomposers process dead material and waste"
		);
		expect(ecosystems).toContain(
			"A line that rises shows the supplied measure rising, not the cause"
		);
	});

	it("connects weather, water, Earth change, matter, and design evidence", () => {
		const earth = moduleText("ES4 Weather, Water, and Earth Changes");
		const matter = moduleText("ES5 Matter, Materials, and Changes");

		expect(earth).toContain("One day is weather evidence");
		expect(earth).toContain(
			"Pools store water in oceans, lakes, rivers, soil"
		);
		expect(earth).toContain(
			"Weathering breaks material down, erosion moves it"
		);
		expect(matter).toContain(
			"Particle spacing and motion are explanatory models"
		);
		expect(matter).toContain("dissolved material has disappeared");
		expect(matter).toContain(
			"Define the job, criteria, and constraints before selecting a material"
		);
	});

	it("corrects force, machine, light, sound, and signal misconceptions", () => {
		const forces = moduleText("ES6 Forces, Motion, and Simple Machines");
		const signals = moduleText("ES7 Light, Sound, and Signals");

		expect(forces).toContain(
			"balanced forces can accompany constant motion"
		);
		expect(forces).toContain("does not create energy or erase all work");
		expect(forces).toContain(
			"Draw each arrow on or from the object receiving"
		);
		expect(signals).toContain("Eyes do not send sight rays");
		expect(signals).toContain("A vibrating source changes nearby matter");
		expect(signals).toContain("the disturbance travels through a medium");
		expect(signals).toContain(
			"Audio always has a transcript, waveform, or event table"
		);
	});

	it("uses sky evidence, model limits, and engineering revision in the capstone", () => {
		const capstone = moduleText("ES8 Space, Patterns, and Science Design");

		expect(capstone).toContain(
			"repeated comparable observations are needed to establish a pattern"
		);
		expect(capstone).toContain(
			"Earth rotates, bringing locations into and out of sunlight"
		);
		expect(capstone).toContain(
			"classroom page rarely preserves all properties at once"
		);
		expect(capstone).toContain(
			"Compare at least two ideas, name criteria and constraints"
		);
		expect(capstone).toContain("preserve the before-and-after decision");
		expect(resourceText()).toContain(
			"nextgenscience.org/topic-arrangement/3-5engineering-design"
		);
		expect(resourceText()).toContain(
			"spaceplace.nasa.gov/menu/solar-system"
		);
	});

	it("ships complete local resources with valid section links", () => {
		const materials = fs.readFileSync(
			"public/course-assets/elementary-science/elementary-science-materials-pack.md",
			"utf8"
		);
		const answers = fs.readFileSync(
			"public/course-assets/elementary-science/elementary-science-rubrics-answer-key.md",
			"utf8"
		);

		expect(materials).toContain(
			"## Observation Inference and Fair Comparison Cards"
		);
		expect(materials).toContain("## Food Web and Population Cases");
		expect(materials).toContain("## Matter and Materials Data");
		expect(materials).toContain("## Light Sound and Signal Cases");
		expect(materials).toContain("## Elementary Science Capstone Packet");
		expect(answers).toContain("## Common Two Band Evidence Rubric");
		expect(answers).toContain("## Capstone Defense Rubric");

		for (const link of resourceText()
			.split("\n")
			.filter(link =>
				link.startsWith("/course-assets/elementary-science/")
			)) {
			const [pathname, fragment] = link.split("#");
			expect(fragment, link).toBeTruthy();
			const source = fs.readFileSync(`public${pathname}`, "utf8");
			expect(markdownHeadingSlugs(source), link).toContain(fragment);
		}
	});

	it("keeps every assessment equipment-free, private, and multimodal", () => {
		const text = [
			courseText(),
			elementaryScienceCourse.developmentMetadata?.safetyPolicy.join("\n")
		].join("\n");

		expect(text).toContain(
			"No required beakers, chemicals, heat, food, kits"
		);
		expect(text).toContain(
			"No required home, schedule, health, sensory ability"
		);
		expect(text).toContain(
			"Supplied images, descriptions, datasets, and model cards remain sufficient"
		);
		expect(text).toContain(
			"Speaking, pointing, dictation, drawing, or selecting"
		);
		expect(text).not.toContain("required household experiment");
	});
});
