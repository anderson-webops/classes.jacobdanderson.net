import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { elementaryScienceCourse } from "@/stores/courses/elementary-science";
import { loadRawCourse } from "@/stores/courses/index";
import { completeElementaryScienceActivity } from "./middleSchoolScienceReview";

const expectedSequence = [
	"ES1 Scientists, Questions, and Evidence",
	"ES2 Living Things and Life Needs",
	"ES3 Habitats, Food Chains, and Ecosystems",
	"ES4 Weather, Water, and Earth Changes",
	"ES5 Matter, Materials, and Changes",
	"ES6 Forces, Motion, and Simple Machines",
	"ES7 Light, Sound, and Signals",
	"ES8 Space, Patterns, and Science Design"
];
const pack = fs.readFileSync(
	"public/course-assets/elementary-science/elementary-science-materials-pack.md",
	"utf8"
);
const answers = fs.readFileSync(
	"public/course-assets/elementary-science/elementary-science-rubrics-answer-key.md",
	"utf8"
);
function tableAfter(heading: string) {
	return pack
		.split(heading)[1]!
		.split(/^###? /m)[0]
		.split("\n")
		.filter(line => line.startsWith("|"))
		.slice(2)
		.map(line =>
			line
				.split("|")
				.slice(1, -1)
				.map(cell => cell.trim())
		);
}
function slugs(source: string) {
	return new Set(
		[...source.matchAll(/^#{1,6}\s+(.+)$/gm)].map(([, heading]) =>
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
describe("Elementary Science supplied teaching and two-band activities", () => {
	it("turns all six appendices into learner references and supplied optional practice", async () => {
		const course = (await loadRawCourse("elementary-science"))!;
		const references = course.modules.filter(
			module => module.kind === "appendix"
		);
		expect(references).toHaveLength(6);
		const items = references.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		expect(items).toHaveLength(39);
		expect(
			items.filter(item => item.contentKind === "reading")
		).toHaveLength(28);
		expect(
			items.filter(item => item.contentKind === "assignment")
		).toHaveLength(11);
		expect(items.every(item => item.learningPath === "choice")).toBe(true);
		const route = items.find(
			item =>
				item.id ===
				"elementary-science-elementary-science-grade-band-paths-curriculum-decision-keep-one-course-with-k-2-and-3-5-paths"
		);
		expect(route?.title).toBe("Choosing a Grade-Band Route");
		for (const task of items.filter(
			item => item.contentKind === "assignment"
		)) {
			expect(task.content).toContain("**Checkpoints:**");
			expect(task.content).toContain("[Case inputs](/course-resource?");
			expect(task.content).toContain(
				"[Project self-check](/course-resource?"
			);
		}
	});
	it("rejects truncated tasks, missing case links and missing teaching", () => {
		const module = elementaryScienceCourse.modules[0];
		const task = module.curriculum[1];
		expect(
			completeElementaryScienceActivity(
				"elementary-science",
				module,
				task
			)
		).toBe(true);
		expect(
			completeElementaryScienceActivity("another-course", module, task)
		).toBe(false);
		expect(
			completeElementaryScienceActivity("elementary-science", module, {
				...task,
				content: task.content.slice(0, 60)
			})
		).toBe(false);
		expect(
			completeElementaryScienceActivity(
				"elementary-science",
				{ ...module, curriculum: module.curriculum.slice(1) },
				task
			)
		).toBe(false);
		expect(
			completeElementaryScienceActivity("elementary-science", module, {
				...task,
				content: task.content.replace("[Case inputs]", "[Other page]")
			})
		).toBe(false);
	});
	it("retains all eight units, six core activities and two optional projects per unit", async () => {
		const modules = (await loadRawCourse(
			"elementary-science"
		))!.modules.filter(module => module.kind !== "appendix");
		expect(modules.map(module => module.title)).toEqual(expectedSequence);
		for (const module of modules) {
			expect(module.curriculum).toHaveLength(7);
			expect(module.supplementalProjects).toHaveLength(2);
			expect(
				module.curriculum.filter(item => item.contentKind === "reading")
			).toHaveLength(1);
			expect(
				module.curriculum.filter(
					item => item.contentKind === "assignment"
				)
			).toHaveLength(6);
			expect(
				module.curriculum.every(item => item.learningPath === "core")
			).toBe(true);
			expect(
				module.supplementalProjects.every(item =>
					["choice", "challenge"].includes(item.learningPath!)
				)
			).toBe(true);
			for (const item of [
				...module.curriculum,
				...module.supplementalProjects
			]) {
				expect(item.preserveInstructions, item.title).toBe(true);
				expect(item.preserveAssignment, item.title).toBe(true);
			}
		}
	});
	it("provides actual teaching before specific activities with both grade-band routes", () => {
		for (const module of elementaryScienceCourse.modules) {
			const reading = module.curriculum[0];
			expect(reading.content, module.title).toContain("\n## ");
			expect(reading.content, module.title).toContain("K–2:");
			expect(reading.content, module.title).toContain("Grades 3–5:");
			expect(reading.content, module.title).not.toContain(
				"**Course flow:**"
			);
			for (const item of module.curriculum.slice(1)) {
				expect(item.content, item.title).toContain("K–2:");
				expect(item.content, item.title).toContain("Grades 3–5:");
				expect(item.content, item.title).toContain(
					"[Case inputs](/course-resource?"
				);
				expect(item.content, item.title).toContain(
					"[Project self-check](/course-resource?"
				);
			}
		}
	});
	it("keeps every local input and answer section present and supplies six core checks per unit", () => {
		for (const item of elementaryScienceCourse.modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		])) {
			for (const link of [item.datasetLink, item.solutionLink].filter(
				Boolean
			) as string[]) {
				const [path, fragment] = link.split("#");
				expect(fragment, link).toBeTruthy();
				expect(
					slugs(fs.readFileSync("public" + path, "utf8")),
					link
				).toContain(fragment);
			}
		}
		for (let index = 1; index <= 8; index++) {
			const section = answers
				.split("### ES" + index + " core checks")[1]!
				.split(/^## /m)[0];
			expect(
				[...section.matchAll(/^([1-6])\. /gm)].map(match =>
					Number(match[1])
				)
			).toEqual([1, 2, 3, 4, 5, 6]);
		}
	});
	it("distinguishes heron observation rates from raw counts using the supplied table", () => {
		const rows = tableAfter("### Population table"),
			rates = rows.map(row => Number(row[4]) / Number(row[5]));
		expect(rates).toEqual([0.5, 0.625, 0.75, 0.375]);
		expect(Number(rows[2][4])).toBeLessThan(Number(rows[0][4]));
		expect(rates[2]).toBeGreaterThan(rates[0]);
		expect(
			elementaryScienceCourse.modules[2].curriculum[0].content
		).toContain("observation rates, not a count of every heron");
	});
	it("supplies a separate forecast rather than inferring probability from rainfall observations", () => {
		expect(
			tableAfter("### Fictional seven-day weather table")
		).toHaveLength(7);
		expect(tableAfter("### Fictional Day 8 forecast")).toEqual([
			["18 °C", "60%", "18 km/h", "mostly cloudy"]
		]);
		expect(answers).toContain("Day 4, 24 °C");
		expect(answers).toContain("Day 7, 17 °C");
	});
	it("applies every material criterion and retains a changed case with no passing option", () => {
		const rows = tableAfter("### Material property table");
		const cover = rows.filter(
			row =>
				Number(row[2]) >= 4 &&
				Number(row[3]) >= 4 &&
				Number(row[6]) <= 2
		);
		expect(cover.map(row => row[0])).toEqual(["clear plastic sheet"]);
		expect(cover.filter(row => Number(row[1]) >= 4)).toEqual([]);
		expect(pack).toContain("no material satisfying all four requirements");
		expect(answers).toContain("does not invent data");
		const task = elementaryScienceCourse.modules[4].curriculum[4];
		expect(task.content).toContain("changed-flexibility condition");
		expect(task.content).not.toContain("changed-transparency condition");
	});
	it("keeps sampled motion and a readable model scale within their evidence limits", () => {
		const positions = tableAfter("### Cart story").map(row =>
			Number(row[1].split(" ")[0])
		);
		expect(
			positions
				.slice(1)
				.map((position, index) => position - positions[index])
		).toEqual([1, 2, 2, 2]);
		const motion = elementaryScienceCourse.modules[5].curriculum[0].content;
		expect(motion).toContain("average speed");
		expect(motion).toContain(
			"do not show every speed change between readings"
		);
		expect(pack).toContain("cart moves only forward");
		expect(answers).toContain(
			"samples alone do not establish steady speed"
		);
		expect(pack).toContain("single accurate scale is possible");
		expect(answers).toContain("One accurate scale is possible");
	});
	it("supplies six machines and a failed pivot that changes the design answer", () => {
		const machines = tableAfter("### Six machine object cards");
		expect(machines).toHaveLength(6);
		expect(new Set(machines.map(row => row[1])).size).toBe(6);
		const methods = tableAfter("### Simple-machine comparison");
		expect(
			methods
				.filter(
					row =>
						Number(row[1]) <= 3 && Number(row[2].split(" ")[0]) <= 3
				)
				.map(row => row[0])
		).toEqual(["short ramp", "lever"]);
		expect(pack).toContain("pivot shifts");
		expect(answers).toContain("short ramp remains a supported alternative");
	});
	it("separates frequency and amplitude and retains the signal's failed condition", () => {
		expect(
			tableAfter("### Comparable vibration data").map(row => [
				Number(row[1]),
				Number(row[2])
			])
		).toEqual([
			[200, 1],
			[400, 1],
			[200, 2]
		]);
		const signals = tableAfter("### Signal test record");
		expect(signals).toHaveLength(3);
		expect(signals[1].slice(1)).toEqual([
			"missed",
			"received through text"
		]);
		expect(signals[2].slice(1)).toEqual(["missed", "missed"]);
		expect(pack).toContain(
			"A new route remains a proposal until evidence tests it"
		);
	});
	it("names the Moon's central body and keeps the optional capstone a continuation", () => {
		const planets = tableAfter(
			"### Comparison table using rounded instructional values"
		);
		expect(planets.find(row => row[0] === "Moon")?.[3]).toBe("Earth");
		expect(planets.find(row => row[0] === "Mars")?.[3]).toBe("Sun");
		const optional =
			elementaryScienceCourse.modules[7].supplementalProjects.find(
				item => item.title === "Project: Elementary Science Capstone"
			)!;
		expect(optional.content).toContain(
			"Continue the saved required capstone"
		);
		expect(optional.content).toContain("Retain the original artifact");
		expect(optional.learningPath).toBe("challenge");
	});
	it("retains the equipment-free and equivalent-response boundaries", () => {
		const safety =
			elementaryScienceCourse.developmentMetadata!.safetyPolicy.join(
				"\n"
			);
		expect(safety).toContain(
			"No required beakers, chemicals, heat, food, kits"
		);
		expect(safety).toContain(
			"No required home, schedule, health, sensory ability"
		);
		expect(pack).toContain(
			"Speaking, pointing, selecting, dictating, drawing, typing, and handwriting"
		);
	});
});
