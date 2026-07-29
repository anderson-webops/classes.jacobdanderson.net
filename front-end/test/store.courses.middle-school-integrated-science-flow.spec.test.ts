import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { middleSchoolIntegratedScienceCourse } from "@/stores/courses/middle-school-integrated-science";

const EXPECTED_SEQUENCE = [
	"MS1 Scientific Reasoning, Models, and Data",
	"MS2 Cells, Microscopes, and Body Systems",
	"MS3 Genetics, Traits, and Adaptation",
	"MS4 Ecosystems, Energy Flow, and Human Impact",
	"MS5 Earth Systems, Weather, and Climate Data",
	"MS6 Matter, Atoms, and Chemical Change",
	"MS7 Energy, Heat, and Engineering Tradeoffs",
	"MS8 Forces, Motion, and Graphs",
	"MS9 Waves, Light, Sound, Electricity, and Magnetism",
	"MS10 Space Systems and Integrated Science Capstone"
];

function requireModule(title: string) {
	const module = middleSchoolIntegratedScienceCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module)
		throw new Error(
			`Expected Middle School Integrated Science module ${title}.`
		);
	return module;
}

function moduleText(title: string) {
	const module = requireModule(title);
	return [...module.curriculum, ...module.supplementalProjects]
		.map(item => `${item.title}\n${item.content}`)
		.join("\n");
}

function allItems() {
	return middleSchoolIntegratedScienceCourse.modules.flatMap(module => [
		...module.curriculum,
		...module.supplementalProjects
	]);
}

function courseText() {
	return middleSchoolIntegratedScienceCourse.modules
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

describe("Middle School Integrated Science learner flow", () => {
	it("preserves the ten-module sequence and twenty distinctive projects", () => {
		expect(
			middleSchoolIntegratedScienceCourse.modules.map(
				module => module.title
			)
		).toEqual(EXPECTED_SEQUENCE);

		const projectTitles =
			middleSchoolIntegratedScienceCourse.modules.flatMap(module =>
				module.supplementalProjects.map(item => item.title)
			);
		expect(projectTitles).toHaveLength(20);
		for (const title of [
			"Project: Experimental Design Critique",
			"Project: Cell Analogy With Limits",
			"Project: Adaptation Evidence Brief",
			"Project: Ecosystem Impact Memo",
			"Project: Climate Data Explainer",
			"Project: Chemical Change Evidence Case File",
			"Project: Energy Audit From a Diagram",
			"Project: Motion Graph Comic",
			"Project: Wave Communication Design",
			"Project: Middle School Science Capstone"
		]) {
			expect(projectTitles, title).toContain(title);
		}
	});

	it("makes core and stretch routes actionable on every source task", () => {
		for (const module of middleSchoolIntegratedScienceCourse.modules) {
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
						item.content.includes("**Core route:**") &&
						item.content.includes("**Stretch route:**") &&
						item.content.includes("**Science explanation:**") &&
						item.content.includes("**Model and claim boundary:**")
				),
				module.title
			).toBe(true);
			expect(
				module.supplementalProjects.every(
					item =>
						["choice", "challenge"].includes(
							item.learningPath ?? ""
						) &&
						item.content.includes("**Completion route:**") &&
						item.content.includes("Core:") &&
						item.content.includes("Stretch:")
				),
				module.title
			).toBe(true);
			expect(module.curriculum[0]?.content, module.title).toContain(
				"**Teaching flow:**"
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

		const loaded = await loadRawCourse("middle-school-integrated-science");
		expect(loaded).not.toBeNull();
		for (const title of EXPECTED_SEQUENCE) {
			const module = loaded!.modules.find(
				candidate => candidate.title === title
			);
			expect(module, title).toBeDefined();
			expect(module!.curriculum.length, title).toBeGreaterThanOrEqual(7);
			expect(module!.supplementalProjects, title).toHaveLength(2);
			for (const item of [
				...module!.curriculum,
				...module!.supplementalProjects
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

	it("starts with data integrity, model honesty, and bounded claims", () => {
		const text = moduleText("MS1 Scientific Reasoning, Models, and Data");

		expect(text).toContain("Keep raw values, units, missing entries");
		expect(text).toContain(
			"Pattern, mechanism, correlation, and causation remain separately labeled"
		);
		expect(text).toContain("a model is not the system itself");
		expect(text).toContain("unequal observation time matters");
	});

	it("teaches cells and body systems with scale, function, access, and privacy boundaries", () => {
		const text = moduleText("MS2 Cells, Microscopes, and Body Systems");

		expect(text).toContain("false color");
		expect(text).toContain("Organelles are interacting structures");
		expect(text).toContain(
			"No pulse, diet, diagnosis, disability, medical history, fitness, or body measurement is collected"
		);
		expect(text).toContain("the model is not diagnosis");
	});

	it("keeps genetics probabilistic, population-based, and free of personal trait collection", () => {
		const text = moduleText("MS3 Genetics, Traits, and Adaptation");

		expect(text).toContain(
			"genotype, environment, development, and chance"
		);
		expect(text).toContain("A probability predicts a distribution");
		expect(text).toContain(
			"No task collects learner or family traits, ancestry, health, or genetic information"
		);
		expect(text).toContain(
			"Human social categories are not treated as simple biological divisions"
		);
		expect(text).toContain("selection with drift or sampling effects");
	});

	it("separates ecosystem energy, matter, sampling, biodiversity, release, exposure, and risk", () => {
		const text = moduleText(
			"MS4 Ecosystems, Energy Flow, and Human Impact"
		);

		expect(text).toContain("Energy flows while matter cycles");
		expect(text).toContain(
			"Report counts together with area, time, method, and effort"
		);
		expect(text).toContain(
			"Species richness, relative abundance, and evenness answer different questions"
		);
		expect(text).toContain(
			"Separate source or action, environmental release, transport, exposure pathway"
		);
		expect(text).toContain("monitoring indicator, threshold");
	});

	it("adds climate claim discipline and the missing Earth-history and plate-tectonics evidence", () => {
		const text = moduleText("MS5 Earth Systems, Weather, and Climate Data");

		expect(text).toContain(
			"First detect a pattern, then compare possible drivers"
		);
		expect(text).toContain("One storm does not establish a climate trend");
		expect(text).toContain("seafloor age and magnetic patterns");
		expect(text).toContain("A plate is not identical to a continent");
		expect(text).toContain("distinguish hazard from risk");
	});

	it("treats chemical-change observations as evidence bundles rather than automatic proof", () => {
		const text = moduleText("MS6 Matter, Atoms, and Chemical Change");

		expect(text).toContain(
			"Subscripts count atoms within one represented particle"
		);
		expect(text).toContain("new substances");
		expect(text).toContain(
			"each observation can have physical or measurement alternatives"
		);
		expect(text).toContain(
			"No tasting, smelling, mixing, heating, household chemical"
		);
	});

	it("builds correct energy, force, graph, wave, circuit, and field models", () => {
		const energy = moduleText(
			"MS7 Energy, Heat, and Engineering Tradeoffs"
		);
		const motion = moduleText("MS8 Forces, Motion, and Graphs");
		const waves = moduleText(
			"MS9 Waves, Light, Sound, Electricity, and Magnetism"
		);

		expect(energy).toContain("Temperature relates to average particle");
		expect(energy).toContain("cold does not flow as a substance");
		expect(motion).toContain("balanced forces do not require rest");
		expect(motion).toContain(
			"action-reaction forces act on different objects"
		);
		expect(motion).toContain(
			"flat position-time segment differs from a flat velocity-time segment"
		);
		expect(waves).toContain("Amplitude and frequency vary independently");
		expect(waves).toContain("current is not used up");
		expect(waves).toContain(
			"field lines are a representation rather than physical threads"
		);
	});

	it("ends with honest space models and a traceable revised capstone", () => {
		const text = moduleText(
			"MS10 Space Systems and Integrated Science Capstone"
		);

		expect(text).toContain("Moon phases are not Earth's shadow");
		expect(text).toContain(
			"seasons are not caused mainly by Earth-Sun distance"
		);
		expect(text).toContain(
			"orbit is continuous falling rather than no gravity"
		);
		expect(text).toContain("preserve the first version");
		expect(text).toContain("what evidence would change the conclusion");
		expect(text).toContain(
			"equivalent text route for every visual or audio element"
		);
	});

	it("links authoritative references and valid local material and answer anchors", () => {
		const resources = resourceText();
		expect(resources).toContain("nextgenscience.org");
		expect(resources).toContain("nigms.nih.gov");
		expect(resources).toContain("genome.gov");
		expect(resources).toContain("science.nasa.gov");
		expect(resources).toContain("earthquake.usgs.gov");
		expect(resources).toContain("phet.colorado.edu");

		const materials = fs.readFileSync(
			path.join(
				process.cwd(),
				"public/course-assets/middle-school-science/middle-school-science-materials-pack.md"
			),
			"utf8"
		);
		const answers = fs.readFileSync(
			path.join(
				process.cwd(),
				"public/course-assets/middle-school-science/middle-school-science-rubrics-answer-key.md"
			),
			"utf8"
		);
		const materialHeadings = markdownHeadingSlugs(materials);
		const answerHeadings = markdownHeadingSlugs(answers);

		for (const item of allItems()) {
			for (const link of [item.datasetLink, item.solutionLink]) {
				if (!link?.startsWith("/course-assets/middle-school-science/"))
					continue;
				const [file, anchor] = link.split("#");
				expect(anchor, link).toBeTruthy();
				const headings = file.includes("materials-pack")
					? materialHeadings
					: answerHeadings;
				expect(headings.has(anchor!), link).toBe(true);
			}
		}
	});

	it("keeps every investigation equipment-free and avoids sensitive disclosure", () => {
		const text = courseText();

		expect(text).toContain(
			"No specialized science equipment or required household experiments are needed"
		);
		expect(JSON.stringify(middleSchoolIntegratedScienceCourse)).toContain(
			"supplied noninteractive data, image, transcript, or event-table route"
		);
		expect(text).not.toMatch(
			/\b(?:measure|record|share|collect)\s+(?:your|a learner's)\s+(?:pulse|trait|health|diet|ancestry|location)\b/i
		);
		expect(text).not.toContain("biointeractive.org/classroom-resources");
		expect(text).not.toContain(
			"noaa.gov/education/resource-collections/weather-atmosphere"
		);
	});
});
