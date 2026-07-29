import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { introToPhysicsCourse } from "@/stores/courses/intro-to-physics";

const EXPECTED_SEQUENCE = [
	"PHY1 Measurement, Uncertainty, and Scientific Modeling",
	"PHY2 Motion Graphs and Kinematics",
	"PHY3 Forces, Free-Body Diagrams, and Newton's Laws",
	"PHY4 Gravity, Work, and Energy",
	"PHY5 Electricity and Basic Circuits",
	"PHY6 Waves, Sound, and Light",
	"PHY7 Capstone Lab and Scientific Communication",
	"PHY8 Momentum, Impulse, and Collisions",
	"PHY9 Rotational Motion and Torque Basics",
	"PHY10 Fluids, Pressure, and Buoyancy",
	"PHY11 Heat, Temperature, and Thermal Energy",
	"PHY12 Optics, Mirrors, Lenses, and Images",
	"PHY13 Magnetism and Electromagnetic Induction",
	"PHY14 Simple Harmonic Motion and Resonance",
	"PHY15 Astronomy, Gravity, and Orbits",
	"PHY16 Modern Physics and Model Limits",
	"PHY17 Engineering Design and Physics Portfolio"
];

const MATERIAL_SECTIONS = [
	"measurement-and-uncertainty-cases",
	"motion-graphs-and-kinematics-cases",
	"forces-and-newton-laws-cases",
	"gravity-work-and-energy-cases",
	"circuits-cases",
	"waves-sound-and-light-cases",
	"core-capstone-cases",
	"momentum-cases",
	"torque-cases",
	"fluids-cases",
	"thermal-cases",
	"optics-cases",
	"electromagnetism-cases",
	"oscillation-and-resonance-cases",
	"astronomy-and-orbits-cases",
	"modern-physics-cases",
	"final-portfolio-cases"
];

const ANSWER_SECTIONS = MATERIAL_SECTIONS.map(section =>
	section.replace(/-cases$/u, "-key")
);

function requireModule(title: string) {
	const module = introToPhysicsCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Intro to Physics module ${title}.`);
	return module;
}

function moduleText(title: string) {
	const module = requireModule(title);
	return [...module.curriculum, ...module.supplementalProjects]
		.map(item => `${item.title}\n${item.content}`)
		.join("\n");
}

function allItems() {
	return introToPhysicsCourse.modules.flatMap(module => [
		...module.curriculum,
		...module.supplementalProjects
	]);
}

function courseText() {
	return introToPhysicsCourse.modules
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

describe("Intro to Physics learner flow", () => {
	it("preserves all seventeen modules and fifty-one established projects", () => {
		expect(
			introToPhysicsCourse.modules.map(module => module.title)
		).toEqual(EXPECTED_SEQUENCE);

		const projectTitles = introToPhysicsCourse.modules.flatMap(module =>
			module.supplementalProjects.map(item => item.title)
		);
		expect(projectTitles).toHaveLength(51);
		expect(
			projectTitles.filter(title => /Readiness Check$/i.test(title))
		).toHaveLength(17);
		expect(
			projectTitles.filter(title => /Failure Modes$/i.test(title))
		).toHaveLength(17);
		for (const title of [
			"Extension Project: Measurement Scavenger Hunt",
			"Extension Project: Track Star vs. Marathon Runner",
			"Extension Project: Test of Strength",
			"Extension Project: Pendulum Design",
			"Extension Project: Home Device Power Survey",
			"Extension Project: Sound Wave or Resonance Demo",
			"Capstone Option: A Grand Experiment",
			"Extension Project: Impact Safety Brief",
			"Extension Project: Rotation and Torque Audit",
			"Extension Project: Boat Shape and Buoyancy Design",
			"Extension Project: Thermal Design Memo",
			"Extension Project: Optical Device Explainer",
			"Extension Project: Electromagnetic Device Brief",
			"Extension Project: Resonance Case Study",
			"Extension Project: Mission Planning Sketch",
			"Extension Project: Modern Physics Explainer",
			"Extension Project: Final Physics Portfolio"
		]) {
			expect(projectTitles, title).toContain(title);
		}
	});

	it("makes the seven-module foundation, guided extensions, and final synthesis explicit", () => {
		for (const [index, module] of introToPhysicsCourse.modules.entries()) {
			expect(module.estimatedTime, module.title).toMatch(/session/);
			expect(module.keyBlocks, module.title).toHaveLength(6);
			expect(
				module.curriculum.length,
				module.title
			).toBeGreaterThanOrEqual(6);
			expect(module.supplementalProjects, module.title).toHaveLength(3);
			expect(module.curriculum[0]?.content, module.title).toContain(
				"**Teaching flow:**"
			);

			const expectedPath = index >= 7 && index <= 15 ? "choice" : "core";
			expect(
				module.curriculum.every(
					item =>
						item.learningPath === expectedPath &&
						item.content.includes("**Guiding phenomenon:**") &&
						item.content.includes("**Core route:**") &&
						item.content.includes("**Stretch route:**") &&
						item.content.includes("**Evidence gate:**") &&
						item.content.includes(
							"**Calculation and model boundary:**"
						)
				),
				module.title
			).toBe(true);
		}

		expect(
			requireModule(EXPECTED_SEQUENCE[6]).curriculum[0]?.content
		).toContain("Core foundation");
		expect(
			requireModule(EXPECTED_SEQUENCE[7]).curriculum[0]?.content
		).toContain("Guided extension");
		expect(
			requireModule(EXPECTED_SEQUENCE[16]).curriculum[0]?.content
		).toContain("Final synthesis");
	});

	it("turns every lesson and project into a linked runnable evidence task", () => {
		for (const item of allItems()) {
			expect(item.content.length, item.title).toBeGreaterThanOrEqual(700);
			expect(item.datasetLink, item.title).toMatch(
				/^\/course-assets\/physics\/intro-physics-materials-pack\.md#/
			);
			expect(item.solutionLink, item.title).toMatch(
				/^\/course-assets\/physics\/intro-physics-rubrics-answer-key\.md#/
			);
			expect(item.projectLink, item.title).toMatch(/^https:\/\//);
		}

		for (const project of introToPhysicsCourse.modules.flatMap(
			module => module.supplementalProjects
		)) {
			expect(project.content, project.title).toContain(
				"**Completion route:**"
			);
			expect(project.content, project.title).toContain("Core:");
			expect(project.content, project.title).toContain("Stretch:");
		}
	});

	it("replaces repeated late-course placeholder titles with topic-specific labels", () => {
		const titles = introToPhysicsCourse.modules.flatMap(module =>
			module.curriculum.map(item => item.title)
		);

		for (const genericTitle of [
			"Concept Path",
			"Model and Reasoning Toolkit",
			"Worked Example Set",
			"Investigation, Simulation, or Case Study"
		]) {
			expect(titles).not.toContain(genericTitle);
		}

		expect(titles).toContain(
			"Momentum, Impulse, and Collisions: Concept Map"
		);
		expect(titles).toContain(
			"Modern Physics and Model Limits: Evidence Investigation"
		);
		expect(new Set(titles).size).toBe(titles.length);
	});

	it("teaches measurement and mechanics with units, signs, systems, and honest uncertainty", () => {
		const measurement = moduleText(EXPECTED_SEQUENCE[0]);
		const motion = moduleText(EXPECTED_SEQUENCE[1]);
		const forces = moduleText(EXPECTED_SEQUENCE[2]);
		const energy = moduleText(EXPECTED_SEQUENCE[3]);

		expect(measurement).toContain(
			"Significant figures communicate measurement limits"
		);
		expect(measurement).toContain("instrument or source resolution");
		expect(motion).toContain(
			"Negative velocity indicates direction under a chosen convention"
		);
		expect(motion).toContain(
			"A graph is a relationship between quantities"
		);
		expect(forces).toContain(
			"Newton's third-law forces act on different objects"
		);
		expect(energy).toContain("mechanical energy alone can decrease");
	});

	it("keeps circuits, waves, thermal, optics, and electromagnetism representation-correct", () => {
		const circuits = moduleText(EXPECTED_SEQUENCE[4]);
		const waves = moduleText(EXPECTED_SEQUENCE[5]);
		const thermal = moduleText(EXPECTED_SEQUENCE[10]);
		const optics = moduleText(EXPECTED_SEQUENCE[11]);
		const electromagnetism = moduleText(EXPECTED_SEQUENCE[12]);

		expect(circuits).toContain("Current is not consumed");
		expect(circuits).toContain("battery does not force one fixed current");
		expect(waves).toContain(
			"distinction between a snapshot in space and variation through time"
		);
		expect(thermal).toContain(
			"Heat names energy transfer caused by a temperature difference"
		);
		expect(optics).toContain(
			"virtual images are observable even when they cannot be projected"
		);
		expect(electromagnetism).toContain(
			"induction depends on changing magnetic flux"
		);
	});

	it("keeps extension topics mathematically bounded and misconception-aware", () => {
		const momentum = moduleText(EXPECTED_SEQUENCE[7]);
		const torque = moduleText(EXPECTED_SEQUENCE[8]);
		const fluids = moduleText(EXPECTED_SEQUENCE[9]);
		const oscillation = moduleText(EXPECTED_SEQUENCE[13]);
		const orbit = moduleText(EXPECTED_SEQUENCE[14]);
		const modern = moduleText(EXPECTED_SEQUENCE[15]);

		expect(momentum).toContain(
			"Momentum is a vector and kinetic energy is a scalar"
		);
		expect(torque).toContain(
			"zero net torque does not by itself guarantee zero net force"
		);
		expect(fluids).toContain("Heavy objects do not automatically sink");
		expect(oscillation).toContain(
			"Not every repeated motion is simple harmonic"
		);
		expect(orbit).toContain("Orbit does not mean gravity disappears");
		expect(modern).toContain(
			"model refinement does not erase the usefulness of classical approximations"
		);
	});

	it("provides complete local evidence and answer sections for every module", () => {
		const materialsPath = path.resolve(
			"public/course-assets/physics/intro-physics-materials-pack.md"
		);
		const answersPath = path.resolve(
			"public/course-assets/physics/intro-physics-rubrics-answer-key.md"
		);
		const materials = fs.readFileSync(materialsPath, "utf8");
		const answers = fs.readFileSync(answersPath, "utf8");
		const materialHeadings = markdownHeadingSlugs(materials);
		const answerHeadings = markdownHeadingSlugs(answers);

		for (const section of MATERIAL_SECTIONS) {
			expect(materialHeadings, section).toContain(section);
		}
		for (const section of ANSWER_SECTIONS) {
			expect(answerHeadings, section).toContain(section);
		}

		for (const item of allItems()) {
			const materialAnchor = item.datasetLink?.split("#")[1];
			const answerAnchor = item.solutionLink?.split("#")[1];
			expect(materialHeadings, item.title).toContain(materialAnchor);
			expect(answerHeadings, item.title).toContain(answerAnchor);
		}

		expect(materials).toContain("±0.10 m");
		expect(materials).toContain("Peak induced voltage");
		expect(materials).toContain("Stopping potential");
		expect(answers).toContain("Twenty-four-point rubric");
		expect(answers).toContain("What new evidence");
	});

	it("uses verified public references without making them continuity requirements", () => {
		const resources = resourceText();

		for (const expected of [
			"https://www.nist.gov/pml/owm/metric-si/si-units",
			"https://openstax.org/details/books/physics",
			"https://phet.colorado.edu/en/simulations/moving-man",
			"https://phet.colorado.edu/en/simulations/forces-and-motion-basics",
			"https://phet.colorado.edu/en/simulations/energy-skate-park",
			"https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc",
			"https://phet.colorado.edu/en/simulations/wave-on-a-string",
			"https://phet.colorado.edu/en/simulations/collision-lab",
			"https://phet.colorado.edu/en/simulations/geometric-optics",
			"https://science.nasa.gov/solar-system/orbits-and-keplers-laws/"
		]) {
			expect(resources).toContain(expected);
		}

		expect(
			JSON.stringify(introToPhysicsCourse.developmentMetadata)
		).toContain(
			"Optional interactive simulations with a supplied noninteractive"
		);
	});

	it("requires no apparatus or personal data and provides equivalent access routes", () => {
		const text = `${courseText()}\n${JSON.stringify(
			introToPhysicsCourse.developmentMetadata
		)}`;
		const materials = fs.readFileSync(
			path.resolve(
				"public/course-assets/physics/intro-physics-materials-pack.md"
			),
			"utf8"
		);

		expect(text).toContain(
			"No physical apparatus, personal device, home electricity"
		);
		expect(text).toContain(
			"No required learner health, reaction-time, home-energy, location"
		);
		expect(text).toContain("audio has waveform or transcript alternatives");
		expect(materials).toContain(
			"No task requires physical apparatus, home electrical work"
		);
		expect(materials).toContain(
			"color is always paired with labels, symbols, or patterns"
		);
	});

	it("ships development metadata that matches the rebuilt course contract", () => {
		const metadata = introToPhysicsCourse.developmentMetadata;

		expect(metadata).toBeDefined();
		expect(metadata?.sourcePolicy).toContain(
			"seven core-foundation modules, nine guided extensions, and one final synthesis"
		);
		expect(metadata?.assessmentCadence).toContain(
			"Prediction before calculation or simulation in every module"
		);
		expect(metadata?.courseBoundaries).toContain(
			"PHY1–PHY7 form the complete introductory foundation; PHY8–PHY16 are guided extensions rather than hidden prerequisites for the first capstone"
		);
		expect(metadata?.capstoneExpectations).toHaveLength(6);
	});

	it("survives catalog loading with the complete authored flow", async () => {
		const loaded = await loadRawCourse("intro-to-physics");
		expect(loaded).not.toBeNull();

		for (const title of EXPECTED_SEQUENCE) {
			const module = loaded!.modules.find(
				candidate => candidate.title === title
			);
			expect(module, title).toBeDefined();
			expect(module!.curriculum.length, title).toBeGreaterThanOrEqual(6);
			expect(module!.supplementalProjects, title).toHaveLength(3);
			expect(module!.curriculum[0]?.content, title).toContain(
				"**Concept path:**"
			);
		}

		expect(JSON.stringify(loaded)).toContain(
			"/course-assets/physics/intro-physics-materials-pack.md#"
		);
		expect(JSON.stringify(loaded)).toContain(
			"/course-assets/physics/intro-physics-rubrics-answer-key.md#"
		);
	});

	it("avoids the old generic and unsafe implementation language", () => {
		const source = fs.readFileSync(
			path.resolve("src/stores/courses/intro-to-physics.ts"),
			"utf8"
		);
		const text = courseText();

		expect(source).not.toMatch(/\bshould\b/i);
		expect(source).not.toMatch(/\bMini Lab\b/i);
		expect(source).not.toMatch(/\bWatch for\b/i);
		expect(text).not.toContain("Investigation, Simulation, or Case Study");
		expect(text).not.toContain("Concept Path");
		expect(text).not.toContain("Model and Reasoning Toolkit");
		expect(text).not.toContain("household materials");
	});
});
