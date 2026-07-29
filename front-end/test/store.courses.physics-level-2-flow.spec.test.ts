import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { physicsLevel2Course } from "@/stores/courses/physics-level-2";

const EXPECTED_SEQUENCE = [
	"PHY8 Quantitative Kinematics and Vector Modeling",
	"PHY9 Multi-Force Systems and Equilibrium",
	"PHY10 Friction, Inclines, and Connected Systems",
	"PHY11 Momentum, Impulse, and Collisions",
	"PHY12 Rotational Motion and Torque",
	"PHY13 Gravitation, Circular Motion, and Orbits",
	"PHY14 Electricity, Circuits, and Fields",
	"PHY15 Thermal Physics, Optics, and Modern Bridges",
	"PHY16 Engineering Physics Capstone",
	"PHY17 Numerical Modeling and Simulation Checks",
	"PHY18 Experimental Uncertainty and Curve Fitting",
	"PHY19 Coupled Systems and Constraints",
	"PHY20 Fluids and Continuum Models",
	"PHY21 Thermodynamics and Engines",
	"PHY22 Electromagnetic Applications and Signals",
	"PHY23 Relativity and Reference Frames Preview",
	"PHY24 Independent Physics Research Portfolio"
];

const MATERIAL_SECTIONS = [
	"quantitative-kinematics-and-vectors-cases",
	"multi-force-and-equilibrium-cases",
	"friction-inclines-and-connected-systems-cases",
	"quantitative-momentum-and-collisions-cases",
	"rotational-motion-and-torque-cases",
	"gravitation-circular-motion-and-orbits-cases",
	"electricity-circuits-and-fields-cases",
	"thermal-optics-and-modern-bridges-cases",
	"engineering-physics-capstone-cases",
	"numerical-modeling-and-simulation-cases",
	"uncertainty-and-curve-fitting-cases",
	"coupled-systems-and-constraints-cases",
	"fluids-and-continuum-models-cases",
	"thermodynamics-and-engines-cases",
	"electromagnetic-signals-and-sensors-cases",
	"relativity-and-reference-frames-cases",
	"independent-physics-portfolio-cases"
];

const ANSWER_SECTIONS = MATERIAL_SECTIONS.map(section =>
	section.replace(/-cases$/u, "-key")
);

function requireModule(title: string) {
	const module = physicsLevel2Course.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Physics Level 2 module ${title}.`);
	return module;
}

function moduleText(title: string) {
	const module = requireModule(title);
	return [...module.curriculum, ...module.supplementalProjects]
		.map(item => `${item.title}\n${item.content}`)
		.join("\n");
}

function allItems() {
	return physicsLevel2Course.modules.flatMap(module => [
		...module.curriculum,
		...module.supplementalProjects
	]);
}

function courseText() {
	return physicsLevel2Course.modules
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

describe("Physics Level 2 learner flow", () => {
	it("preserves all seventeen modules and fifty-one established projects", () => {
		expect(physicsLevel2Course.modules.map(module => module.title)).toEqual(
			EXPECTED_SEQUENCE
		);

		const projectTitles = physicsLevel2Course.modules.flatMap(module =>
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
			"Extension Project: Rescue Drone Navigation",
			"Extension Project: Tug-of-War System Audit",
			"Extension Project: Ramp Design Challenge",
			"Extension Project: Safety System Design Review",
			"Extension Project: Torque Design Challenge",
			"Extension Project: Orbit Planner",
			"Extension Project: Circuit Design Audit",
			"Extension Project: Thermal Design Challenge",
			"Capstone Option: Physics Modeling Challenge",
			"Extension Project: Motion Model Comparison",
			"Extension Project: Measurement Audit",
			"Extension Project: Connected System Constraint Map",
			"Extension Project: Fluid System Case Study",
			"Extension Project: Engine or Refrigerator Audit",
			"Extension Project: Sensor System Proposal",
			"Extension Project: Relativity Explainer",
			"Extension Project: Independent Physics Portfolio"
		]) {
			expect(projectTitles, title).toContain(title);
		}
	});

	it("defines a quantitative core, advanced extensions, and independent synthesis", () => {
		for (const [index, module] of physicsLevel2Course.modules.entries()) {
			expect(module.estimatedTime, module.title).toMatch(/session/);
			expect(module.keyBlocks, module.title).toHaveLength(6);
			expect(
				module.curriculum.length,
				module.title
			).toBeGreaterThanOrEqual(5);
			expect(module.supplementalProjects, module.title).toHaveLength(3);
			expect(module.curriculum[0]?.content, module.title).toContain(
				"**Teaching flow:**"
			);

			const expectedPath = index >= 9 && index <= 15 ? "choice" : "core";
			expect(
				module.curriculum.every(
					item =>
						item.learningPath === expectedPath &&
						item.content.includes("**Guiding phenomenon:**") &&
						item.content.includes("**Core route:**") &&
						item.content.includes("**Stretch route:**") &&
						item.content.includes(
							"**Quantitative evidence gate:**"
						) &&
						item.content.includes("**Model domain and limit:**")
				),
				module.title
			).toBe(true);
		}

		expect(
			requireModule(EXPECTED_SEQUENCE[0]).curriculum[0]?.content
		).toContain("Quantitative core");
		expect(
			requireModule(EXPECTED_SEQUENCE[9]).curriculum[0]?.content
		).toContain("Advanced modeling extension");
		expect(
			requireModule(EXPECTED_SEQUENCE[16]).curriculum[0]?.content
		).toContain("Independent synthesis");
	});

	it("explains the similarly numbered Intro modules without duplicating prerequisites", () => {
		const opening = requireModule(EXPECTED_SEQUENCE[0]).curriculum[0]
			?.content;
		const metadata = physicsLevel2Course.developmentMetadata;

		expect(opening).toContain(
			"Intro modules with similar PHY numbers are optional survey previews"
		);
		expect(opening).toContain(
			"rebuilds those ideas with algebra, trigonometry, multiple representations, validation, and uncertainty"
		);
		expect(metadata?.courseBoundaries).toContain(
			"Intro to Physics supplies conceptual and algebra readiness; similarly numbered Intro extension modules are optional surveys, not duplicate prerequisites"
		);
		expect(metadata?.courseBoundaries).toContain(
			"PHY8–PHY16 form a complete Level 2 quantitative core ending in the Engineering Physics Capstone"
		);
	});

	it("turns every lesson and project into a linked quantitative task", () => {
		for (const item of allItems()) {
			expect(item.content.length, item.title).toBeGreaterThanOrEqual(700);
			expect(item.datasetLink, item.title).toMatch(
				/^\/course-assets\/physics\/physics-level-2-materials-pack\.md#/
			);
			expect(item.solutionLink, item.title).toMatch(
				/^\/course-assets\/physics\/physics-level-2-rubrics-answer-key\.md#/
			);
			expect(item.projectLink, item.title).toMatch(/^https:\/\//);
		}

		for (const project of physicsLevel2Course.modules.flatMap(
			module => module.supplementalProjects
		)) {
			expect(project.content, project.title).toContain(
				"**Completion route:**"
			);
			expect(project.content, project.title).toContain("Core:");
			expect(project.content, project.title).toContain("Stretch:");
		}
	});

	it("replaces repeated placeholder titles with course-specific labels", () => {
		const titles = physicsLevel2Course.modules.flatMap(module =>
			module.curriculum.map(item => item.title)
		);

		expect(titles).not.toContain("Worked Example Set");
		expect(titles).toContain(
			"Numerical Modeling and Simulation Checks: Worked Cases"
		);
		expect(titles).toContain(
			"Independent Physics Research Portfolio: Worked Cases"
		);
		expect(new Set(titles).size).toBe(titles.length);
	});

	it("makes mechanics quantitative, validated, and system-aware", () => {
		const kinematics = moduleText(EXPECTED_SEQUENCE[0]);
		const forces = moduleText(EXPECTED_SEQUENCE[1]);
		const friction = moduleText(EXPECTED_SEQUENCE[2]);
		const momentum = moduleText(EXPECTED_SEQUENCE[3]);
		const rotation = moduleText(EXPECTED_SEQUENCE[4]);
		const orbit = moduleText(EXPECTED_SEQUENCE[5]);

		expect(kinematics).toContain(
			"Horizontal and vertical components share time"
		);
		expect(forces).toContain(
			"Apparent weight is a contact-force measurement"
		);
		expect(friction).toContain("Static friction is not automatically");
		expect(momentum).toContain(
			"Impact duration, average force, peak force, and momentum change"
		);
		expect(rotation).toContain(
			"Moment of inertia depends on mass distribution"
		);
		expect(orbit).toContain(
			"Centripetal force names the inward net-force role"
		);
	});

	it("teaches validation, uncertainty, coupled constraints, and continuum limits explicitly", () => {
		const numerical = moduleText(EXPECTED_SEQUENCE[9]);
		const uncertainty = moduleText(EXPECTED_SEQUENCE[10]);
		const coupled = moduleText(EXPECTED_SEQUENCE[11]);
		const fluids = moduleText(EXPECTED_SEQUENCE[12]);

		expect(numerical).toContain(
			"Simulation output is not automatically physical truth"
		);
		expect(numerical).toContain("step-halving convergence study");
		expect(uncertainty).toContain("Uncertainty is not the same as mistake");
		expect(uncertainty).toContain("residual structure");
		expect(coupled).toContain(
			"Connected does not automatically mean equal tension"
		);
		expect(fluids).toContain(
			"Bernoulli reasoning is not a universal pressure shortcut"
		);
	});

	it("bounds thermodynamics, sensors, and relativity to their actual model domains", () => {
		const thermodynamics = moduleText(EXPECTED_SEQUENCE[13]);
		const signals = moduleText(EXPECTED_SEQUENCE[14]);
		const relativity = moduleText(EXPECTED_SEQUENCE[15]);

		expect(thermodynamics).toContain(
			"The first law constrains energy accounting; the second law constrains direction"
		);
		expect(signals).toContain(
			"Filtering cannot recover information never sampled"
		);
		expect(signals).toContain(
			"sensor reading is an estimate produced by a measurement chain"
		);
		expect(relativity).toContain("Relativity is not mere perception");
		expect(relativity).toContain(
			"Ordinary-speed classical approximations remain accurate"
		);
	});

	it("provides complete local evidence and answer sections for every module", () => {
		const materialsPath = path.resolve(
			"public/course-assets/physics/physics-level-2-materials-pack.md"
		);
		const answersPath = path.resolve(
			"public/course-assets/physics/physics-level-2-rubrics-answer-key.md"
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
			expect(materialHeadings, item.title).toContain(
				item.datasetLink?.split("#")[1]
			);
			expect(answerHeadings, item.title).toContain(
				item.solutionLink?.split("#")[1]
			);
		}

		expect(materials).toContain("Explicit Euler free-fall check");
		expect(materials).toContain("Residual");
		expect(materials).toContain("Lorentz-factor table");
		expect(answers).toContain("Twenty-seven-point rubric");
	});

	it("uses verified references while keeping local noninteractive continuity", () => {
		const resources = resourceText();

		for (const expected of [
			"https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion",
			"https://phet.colorado.edu/en/simulations/forces-and-motion-basics",
			"https://phet.colorado.edu/en/simulations/collision-lab",
			"https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc",
			"https://www.nist.gov/pml/nist-technical-note-1297",
			"https://phet.colorado.edu/en/simulations/gas-properties",
			"https://openstax.org/books/university-physics-volume-2/pages/4-2-heat-engines",
			"https://openstax.org/books/university-physics-volume-3/pages/5-introduction"
		]) {
			expect(resources).toContain(expected);
		}

		expect(
			JSON.stringify(physicsLevel2Course.developmentMetadata)
		).toContain(
			"supplied noninteractive table and analytic comparison route"
		);
	});

	it("requires no apparatus or personal data and keeps equivalent access routes", () => {
		const text = `${courseText()}\n${JSON.stringify(
			physicsLevel2Course.developmentMetadata
		)}`;
		const materials = fs.readFileSync(
			path.resolve(
				"public/course-assets/physics/physics-level-2-materials-pack.md"
			),
			"utf8"
		);

		expect(text).toContain(
			"No physical apparatus, personal-device data, home electrical work"
		);
		expect(text).toContain(
			"No required learner reaction-time, location, household-energy"
		);
		expect(text).toContain(
			"audio and color always have non-audio and non-color encodings"
		);
		expect(materials).toContain(
			"No task requires projectiles, collision apparatus"
		);
		expect(materials).toContain(
			"color is paired with labels, symbols, or patterns"
		);
	});

	it("ships development metadata matching the rebuilt contract", () => {
		const metadata = physicsLevel2Course.developmentMetadata;

		expect(metadata).toBeDefined();
		expect(metadata?.sourcePolicy).toContain(
			"PHY8–PHY16 as the quantitative core, PHY17–PHY23 as advanced modeling extensions, and PHY24 as independent synthesis"
		);
		expect(metadata?.assessmentCadence).toContain(
			"Calculation trail with dimensional, limiting-case, analytic, or residual check"
		);
		expect(metadata?.capstoneExpectations).toHaveLength(6);
		expect(metadata?.recommendedNextWork).toHaveLength(3);
	});

	it("survives catalog loading with the complete authored flow", async () => {
		const loaded = await loadRawCourse("physics-level-2");
		expect(loaded).not.toBeNull();

		for (const title of EXPECTED_SEQUENCE) {
			const module = loaded!.modules.find(
				candidate => candidate.title === title
			);
			expect(module, title).toBeDefined();
			expect(module!.curriculum.length, title).toBeGreaterThanOrEqual(5);
			expect(module!.supplementalProjects, title).toHaveLength(3);
			expect(module!.curriculum[0]?.content, title).toContain(
				"**Concept path:**"
			);
		}

		expect(JSON.stringify(loaded)).toContain(
			"/course-assets/physics/physics-level-2-materials-pack.md#"
		);
		expect(JSON.stringify(loaded)).toContain(
			"/course-assets/physics/physics-level-2-rubrics-answer-key.md#"
		);
	});

	it("avoids old generic and unsafe implementation language", () => {
		const source = fs.readFileSync(
			path.resolve("src/stores/courses/physics-level-2.ts"),
			"utf8"
		);
		const text = courseText();

		expect(source).not.toMatch(/\bshould\b/i);
		expect(source).not.toMatch(/\bMini Lab\b/i);
		expect(source).not.toMatch(/\bWatch for\b/i);
		expect(text).not.toContain("\nWorked Example Set\n");
		expect(text).not.toContain("household materials");
	});
});
