import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { introToBiologyCourse } from "@/stores/courses/intro-to-biology";

const EXPECTED_SEQUENCE = [
	"BIO1 Human Body Systems",
	"BIO2 Nutrients and Macromolecules",
	"BIO3 Digestive Process",
	"BIO4 Digestion and Absorption",
	"BIO5 Energy Use and Storage",
	"BIO6 Regulation of Digestion",
	"BIO7 Elimination and Excretion",
	"BIO8 Digestive Odyssey Capstone"
];

function requireModule(title: string) {
	const module = introToBiologyCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Intro to Biology module ${title}.`);
	return module;
}

function moduleText(title: string) {
	const module = requireModule(title);
	return [...module.curriculum, ...module.supplementalProjects]
		.map(item => `${item.title}\n${item.content}`)
		.join("\n");
}

function allItems() {
	return introToBiologyCourse.modules.flatMap(module => [
		...module.curriculum,
		...module.supplementalProjects
	]);
}

function courseText() {
	return introToBiologyCourse.modules
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

describe("Intro to Biology learner flow", () => {
	it("preserves the eight-stage Digestive Odyssey sequence", () => {
		expect(
			introToBiologyCourse.modules.map(module => module.title)
		).toEqual(EXPECTED_SEQUENCE);
	});

	it("gives every stage pacing, milestones, and explicit learning paths", () => {
		for (const module of introToBiologyCourse.modules) {
			expect(module.estimatedTime, module.title).toMatch(/session/);
			expect(
				module.keyBlocks?.length,
				module.title
			).toBeGreaterThanOrEqual(6);
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

	it("preserves the distinctive source projects while making every card usable", () => {
		const projectTitles = introToBiologyCourse.modules.flatMap(module =>
			module.supplementalProjects.map(item => item.title)
		);

		expect(projectTitles).toHaveLength(24);
		for (const title of [
			"Project: Human Body Systems Map",
			"Project: Dinner Mystery",
			"Project: Salad Clue Report",
			"Project: Cell Factory Diagram",
			"Project: Alien Venn Diagram",
			"Project: Digestive Odyssey Exhibit"
		]) {
			expect(projectTitles, title).toContain(title);
		}
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
	});

	it("makes its human-biology case-study boundary and accessible evidence explicit", () => {
		const setup = moduleText("BIO1 Human Body Systems");

		expect(setup).toContain("introductory human-biology case study");
		expect(setup).toContain(
			"does not pretend that digestion alone is a complete survey"
		);
		expect(setup).toContain("Color is never the only label");
		expect(setup).toContain(
			"do not ask learners to compare private body data"
		);
		expect(courseText()).toContain("**Accessible media alternative:**");
		expect(courseText()).toContain(
			"exclude personal diet, symptoms, diagnoses, body measurements"
		);
	});

	it("connects digestion to cells, enzymes, and membrane transport", () => {
		const digestion = moduleText("BIO3 Digestive Process");
		const absorption = moduleText("BIO4 Digestion and Absorption");

		expect(digestion).toContain(
			"Food moves through an organ system, but digestion depends on tissue movement"
		);
		expect(digestion).toContain(
			"Mechanical digestion changes size and mixing"
		);
		expect(digestion).toContain(
			"bile supports lipid processing but is not"
		);
		expect(absorption).toContain(
			"Simple diffusion and facilitated diffusion"
		);
		expect(absorption).toContain(
			"many absorbed lipid products enter lymphatic pathways"
		);
		expect(absorption).toContain(
			"equilibrium does not mean particles stop"
		);
		expect(resourceText()).toContain(
			"biointeractive.org/classroom-resources/simulating-membrane-transport"
		);
	});

	it("separates matter, energy, ATP, storage, and personal estimates", () => {
		const energy = moduleText("BIO5 Energy Use and Storage");

		expect(energy).toContain(
			"Atoms are rearranged rather than converted into energy"
		);
		expect(energy).toContain(
			"Energy is not created, stored as a substance inside ATP"
		);
		expect(energy).toContain(
			"short-term transfer mechanism rather than a permanent battery"
		);
		expect(energy).toContain(
			"no three-hour classroom model has enough information to predict an individual's exact"
		);
		expect(resourceText()).toContain(
			"openstax.org/books/biology-2e/pages/6-1-energy-and-metabolism"
		);
	});

	it("bounds feedback, abstract, microbiome, and medical claims", () => {
		const regulation = moduleText("BIO6 Regulation of Digestion");

		expect(regulation).toContain(
			"Homeostasis is not a perfectly fixed state"
		);
		expect(regulation).toContain(
			"Association, correlation, temporal order, and mechanism are different claims"
		);
		expect(regulation).toContain(
			"does not prove that one organism caused the outcome"
		);
		expect(regulation).toContain(
			"do not authorize diagnosis, treatment, supplement advice"
		);
	});

	it("distinguishes elimination, excretion, filtration, and energy transfer", () => {
		const waste = moduleText("BIO7 Elimination and Excretion");

		expect(waste).toContain(
			"Elimination removes material that remains in or is added to the digestive tract"
		);
		expect(waste).toContain("Excretion removes products of metabolism");
		expect(waste).toContain(
			"Heat leaving the body is energy transfer rather than matter excretion"
		);
		expect(waste).toContain(
			"small materials and fluid can enter a nephron filtrate model"
		);
		expect(resourceText()).toContain(
			"niddk.nih.gov/health-information/kidney-disease/kidneys-how-they-work"
		);
	});

	it("ships supplied evidence, answer keys, and a defensible capstone", () => {
		const capstone = moduleText("BIO8 Digestive Odyssey Capstone");
		const materials = fs.readFileSync(
			"public/course-assets/biology/intro-biology-materials-pack.md",
			"utf8"
		);
		const answers = fs.readFileSync(
			"public/course-assets/biology/intro-biology-rubrics-answer-key.md",
			"utf8"
		);

		expect(materials).toContain("## Body Systems Scenario Cards");
		expect(materials).toContain(
			"## Absorption and Membrane Transport Cases"
		);
		expect(materials).toContain("## Digestive Odyssey Capstone Packet");
		expect(answers).toContain("## Common Evidence and Model Rubric");
		expect(answers).toContain("## Capstone Defense Rubric");
		for (const link of resourceText()
			.split("\n")
			.filter(link => link.startsWith("/course-assets/biology/"))) {
			const [pathname, fragment] = link.split("#");
			expect(fragment, link).toBeTruthy();
			const source = fs.readFileSync(`public${pathname}`, "utf8");
			expect(markdownHeadingSlugs(source), link).toContain(fragment);
		}
		expect(capstone).toContain(
			"Every pathway arrow connects to a cited source"
		);
		expect(capstone).toContain("Preserve one before-and-after section");
		expect(capstone).toContain(
			"genetics, evolution, ecology, microbiology"
		);
		expect(
			introToBiologyCourse.developmentMetadata?.courseBoundaries.join(
				"\n"
			)
		).toContain("rather than a complete biology survey");
	});
});
