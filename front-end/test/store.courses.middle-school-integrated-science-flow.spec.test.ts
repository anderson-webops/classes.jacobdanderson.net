import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createPinia, setActivePinia } from "pinia";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { middleSchoolScienceGuidance } from "@/stores/courses/middleSchoolScienceGuidance";
import { middleSchoolScienceReferences } from "@/stores/courses/middleSchoolScienceReferences";
import { completeMiddleSchoolScienceActivity } from "./middleSchoolScienceReview";
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
	it("reconciles fictional climate anomalies with their stated baseline", () => {
		const source = fs.readFileSync(
			path.resolve(
				process.cwd(),
				"public/course-assets/middle-school-science/middle-school-science-materials-pack.md"
			),
			"utf8"
		);
		const section = source
			.split("### Fictional regional climate series\n")[1]
			.split("### Climate claim ladder cards")[0];
		const [, start, end] = section.match(/(\d{4})–(\d{4}) baseline/);
		const rows = [
			...section.matchAll(
				/^\| (\d{4})–(\d{4})\s*\|\s*(-?\d+\.\d+) °C\s*\|\s*\d+ mm\s*\|\s*(\d+) of (\d+) \|/gm
			)
		].map(([, first, last, anomaly, count, total]) => ({
			first: +first,
			last: +last,
			anomaly: +anomaly,
			count: +count,
			total: +total
		}));
		assert.equal(rows.length, 5);
		const baseline = rows.filter(
			row => row.first >= +start && row.last <= +end
		);
		assert.equal(baseline.length, 3);
		assert.equal(
			baseline.reduce((years, row) => years + row.total, 0),
			+end - +start + 1
		);
		assert.ok(baseline.every(row => row.count === row.total));
		const mean =
			baseline.reduce((sum, row) => sum + row.anomaly * row.count, 0) /
			baseline.reduce((sum, row) => sum + row.count, 0);
		assert.ok(
			Math.abs(mean) < 1e-12,
			`The stated reference period must average to zero; got ${mean} °C.`
		);
	});

	it("supplies per-species abundances and a two-error parity counterexample", () => {
		const materials = fs.readFileSync(
			"public/course-assets/middle-school-science/middle-school-science-materials-pack.md",
			"utf8"
		);
		const community = materials
			.split("### Equal-effort community comparison")[1]
			.split("### Runoff pathway case")[0];
		const rows = [
			...community.matchAll(
				/^\| (?:reed|sedge|rush|grass)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|/gm
			)
		].map(([, x, y]) => [+x, +y]);
		expect(rows).toHaveLength(4);
		expect(rows.map(row => row[0]).reduce((a, b) => a + b)).toBe(40);
		expect(rows.map(row => row[1]).reduce((a, b) => a + b)).toBe(40);
		expect(rows.map(row => row[0] / 40)).toEqual([0.25, 0.25, 0.25, 0.25]);
		expect(rows.map(row => row[1] / 40)).toEqual([0.85, 0.05, 0.05, 0.05]);
		const packets = Object.fromEntries(
			[
				...materials.matchAll(
					/^\| ([ABCD])\s*\|\s*([01] [01] [01] [01] [01])\s*\|/gm
				)
			].map(([, name, bits]) => [name, bits.split(" ").map(Number)])
		);
		expect(Object.keys(packets)).toHaveLength(4);
		const parity = (bits: number[]) => bits.reduce((a, b) => a + b) % 2;
		const changed = (left: number[], right: number[]) =>
			left.filter((bit, i) => bit !== right[i]).length;
		expect(parity(packets.A)).toBe(0);
		expect(parity(packets.C)).toBe(1);
		expect(parity(packets.D)).toBe(0);
		expect(changed(packets.A, packets.C)).toBe(1);
		expect(changed(packets.A, packets.D)).toBe(2);
		expect(materials).toContain("Draft system model to repair");
		expect(materials).toContain("Food passes through the windpipe");
	});

	it("provides two explicit Moon models with correct geometry and scale", () => {
		const materials = fs.readFileSync(
			"public/course-assets/middle-school-science/middle-school-science-materials-pack.md",
			"utf8"
		);
		const model = materials
			.split("### Phase Model A: viewing geometry")[1]
			.split("### Scale Model B")[0];
		const rows = [
			...model.matchAll(
				/^\|\s*([\d.]+)\s*\|\s*\((-?\d+),\s*(-?\d+)\)\s*\|\s*([^|]+)\|\s*([\d.]+)\s*\|/gm
			)
		];
		expect(rows).toHaveLength(5);
		expect(rows.map(([, day]) => +day)).toEqual([0, 7.4, 14.8, 22.1, 29.5]);
		for (const [, , x, y, , fraction] of rows)
			expect(+fraction).toBeCloseTo(
				(1 - +x / Math.hypot(+x, +y)) / 2,
				10
			);
		expect(model).toContain("approximate model days");
		expect(model).toContain("cannot predict eclipses");
		const scale = materials
			.split("### Scale Model B: Earth and Moon")[1]
			.split("### Planet comparison data")[0];
		const [, earth, moon, distance] = scale.match(
			/Earth diameter ([\d,]+) km, Moon diameter ([\d,]+) km, and mean Earth-Moon center separation ([\d,]+) km/
		)!;
		const number = (text: string) => Number(text.replaceAll(",", ""));
		expect(number(moon) / number(earth)).toBeCloseTo(0.2731, 4);
		expect(number(distance) / number(earth)).toBeCloseTo(30.17, 2);
		expect(scale).toContain("30.2 cm");
		expect(scale).toContain("2.73 mm");
		expect(scale).toContain(
			"Keep model-derived values separate from measured observations"
		);
	});

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

	it("separates taught readings, required investigations and optional extensions", () => {
		let readings = 0;
		let required = 0;
		for (const module of middleSchoolIntegratedScienceCourse.modules) {
			expect(module.estimatedTime, module.title).toMatch(/session/);
			const guidance = middleSchoolScienceGuidance.find(
				unit => unit.module === module.title
			)!;
			const first = module.curriculum[0];
			expect(first.content).toContain(guidance.method);
			expect(first.content).toContain(guidance.worked);
			expect(first.contentKind).toBe("reading");
			for (const item of [
				...module.curriculum,
				...module.supplementalProjects
			]) {
				expect(item.preserveInstructions, item.title).toBe(true);
				expect(item.preserveAssignment, item.title).toBe(true);
				if (item.contentKind === "assignment")
					expect(
						completeMiddleSchoolScienceActivity(
							"middle-school-integrated-science",
							module,
							item
						),
						item.title
					).toBe(true);
			}
			readings += module.curriculum.filter(
				item => item.contentKind === "reading"
			).length;
			required += module.curriculum.filter(
				item => item.contentKind === "assignment"
			).length;
			expect(module.supplementalProjects).toHaveLength(2);
			expect(
				module.supplementalProjects.every(
					item =>
						item.contentKind === "assignment" &&
						["choice", "challenge"].includes(
							item.learningPath ?? ""
						)
				)
			).toBe(true);
		}
		expect(readings).toBe(41);
		expect(required).toBe(29);
		const capstone = requireModule(EXPECTED_SEQUENCE[9]);
		expect(
			capstone.curriculum.find(item =>
				item.title.startsWith("Capstone Studio:")
			)!.content
		).toContain("completed artifact");
		expect(capstone.supplementalProjects[1].content).toContain(
			"Extend the completed core science capstone"
		);
	});

	it.each(["learner", "instructor"])(
		"preserves every complete teaching and task body in the final %s store",
		async role => {
			setActivePinia(createPinia());
			if (role === "instructor")
				useAppStore().setCurrentTutor({
					_id: "science-review",
					name: "Tutor",
					email: "tutor@example.invalid",
					age: 30,
					state: "GA",
					usersOfTutorLength: 0,
					coursePermissions: ["middle-school-integrated-science"],
					editTutors: false,
					saveEdit: "Save"
				});
			const raw = (await loadRawCourse(
				"middle-school-integrated-science"
			))!;
			const final = (await useCoursesStore().loadCourseById(
				"middle-school-integrated-science"
			))!;
			let compared = 0;
			for (const sourceModule of middleSchoolIntegratedScienceCourse.modules) {
				for (const stage of [raw, final]) {
					const module = stage.modules.find(
						candidate => candidate.title === sourceModule.title
					)!;
					for (const section of [
						"curriculum",
						"supplementalProjects"
					] as const) {
						expect(module[section].map(item => item.title)).toEqual(
							sourceModule[section].map(item => item.title)
						);
						for (const original of sourceModule[section]) {
							const item = module[section].find(
								candidate => candidate.title === original.title
							)!;
							expect(item.content, original.title).toBe(
								original.content
							);
							expect(item.contentKind, original.title).toBe(
								original.contentKind
							);
							expect(item.learningPath, original.title).toBe(
								original.learningPath ?? "core"
							);
							compared++;
						}
					}
				}
			}
			for (const stage of [raw, final]) {
				for (const [title, entries] of Object.entries(
					middleSchoolScienceReferences
				)) {
					const module = stage.modules.find(
						candidate => candidate.title === title
					)!;
					expect(module.kind).toBe("appendix");
					const items = [
						...module.curriculum,
						...module.supplementalProjects
					];
					expect(items).toHaveLength(Object.keys(entries).length);
					for (const item of items) {
						const practice =
							/^(?:Practice Project|Resource Project|Integrated Science Project):/.test(
								item.title
							);
						expect(
							item.content.startsWith(entries[item.title]),
							item.title
						).toBe(true);
						expect(item.contentKind, item.title).toBe(
							practice ? "assignment" : "reading"
						);
						expect(item.preserveInstructions, item.title).toBe(
							true
						);
						expect(item.preserveAssignment, item.title).toBe(true);
						expect(item.content, item.title).not.toMatch(
							/each module cites|modules need|course is ready|needs a clearer project target/i
						);
						if (practice) {
							expect(item.content, item.title).toContain(
								"[Case inputs]("
							);
							expect(item.content, item.title).toContain(
								"[Project self-check]("
							);
						} else
							expect(item.content, item.title).toBe(
								entries[item.title]
							);
						compared++;
					}
				}
			}
			expect(compared).toBe(246);
		}
	);

	it("rejects incomplete prompts, missing teaching and wrong input or response sections", () => {
		const module = requireModule(EXPECTED_SEQUENCE[0]);
		const item = module.curriculum.find(
			item => item.contentKind === "assignment"
		)!;
		const check = (candidate = item, unit = module) =>
			completeMiddleSchoolScienceActivity(
				"middle-school-integrated-science",
				unit,
				candidate
			);
		expect(check()).toBe(true);
		expect(check({ ...item, content: item.content.split("\n")[0] })).toBe(
			false
		);
		expect(check({ ...item, preserveInstructions: false })).toBe(false);
		expect(
			check({
				...item,
				content: item.content.replace(
					"Case inputs",
					"Unrelated resource"
				)
			})
		).toBe(false);
		expect(
			check({
				...item,
				content: item.content.replace(
					"Project self-check",
					"Unrelated response"
				)
			})
		).toBe(false);
		expect(
			check(item, { ...module, curriculum: module.curriculum.slice(1) })
		).toBe(false);
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

		expect(
			fs.readFileSync(
				"public/course-assets/middle-school-science/middle-school-science-materials-pack.md",
				"utf8"
			)
		).toContain("No task requires chemicals");
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
