import { describe, expect, it } from "vitest";
import { designPatternsInJavaPart2Course } from "@/stores/courses/design-patterns-in-java-part-2";

const EXPECTED_PRIMARY_SEQUENCE = [
	"DPR1 Code Smells and Safe Refactoring Workflow",
	"DPR2 Composing Methods",
	"DPR3 Moving Features Between Objects",
	"DPR4 Organizing Data",
	"DPR5 Simplifying Conditional Expressions",
	"DPR6 Simplifying Method Calls",
	"DPR7 Dealing with Generalization",
	"DPR8 Refactoring Toward Patterns",
	"DPR9 Testability, DI, and Refactoring with Confidence",
	"DPR10 Capstone Refactoring Studio"
];

function requireModule(title: string) {
	const module = designPatternsInJavaPart2Course.modules.find(
		candidate => candidate.title === title
	);
	if (!module) {
		throw new Error(
			`Expected Design Patterns in Java Part 2 module ${title}.`
		);
	}
	return module;
}

function moduleText(title: string) {
	const module = requireModule(title);
	return [...module.curriculum, ...module.supplementalProjects]
		.map(item => `${item.title}\n${item.content}`)
		.join("\n");
}

function courseText() {
	return designPatternsInJavaPart2Course.modules
		.map(module => `${module.title}\n${moduleText(module.title)}`)
		.join("\n");
}

function resourceText() {
	return designPatternsInJavaPart2Course.modules
		.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		])
		.flatMap(item => [
			item.projectLink,
			item.solutionLink,
			item.datasetLink,
			item.mediaLink
		])
		.filter(Boolean)
		.join("\n");
}

describe("Design Patterns in Java Part 2 learner flow", () => {
	it("uses a ten-stage refactoring spine and one optional clinic appendix", () => {
		expect(
			designPatternsInJavaPart2Course.modules
				.slice(0, 10)
				.map(module => module.title)
		).toEqual(EXPECTED_PRIMARY_SEQUENCE);
		expect(designPatternsInJavaPart2Course.modules).toHaveLength(11);
		expect(designPatternsInJavaPart2Course.modules.at(-1)).toMatchObject({
			kind: "appendix",
			title: "Optional Refactoring Clinics 11–17"
		});
	});

	it("gives every required stage pacing, milestones, and explicit paths", () => {
		for (const module of designPatternsInJavaPart2Course.modules.slice(
			0,
			10
		)) {
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

	it("preserves every original project and all seven distinct clinics", () => {
		const curriculumTitles =
			designPatternsInJavaPart2Course.modules.flatMap(module =>
				module.curriculum.map(item => item.title)
			);
		const optionTitles = designPatternsInJavaPart2Course.modules.flatMap(
			module => module.supplementalProjects.map(item => item.title)
		);

		expect(curriculumTitles).toHaveLength(86);
		expect(optionTitles).toHaveLength(79);
		for (const title of [
			"DPR1 Code Smells and Safe Refactoring Workflow: Core Project",
			"DPR5 Simplifying Conditional Expressions: Core Project",
			"DPR10 Capstone Refactoring Studio: Core Project",
			"Refactoring Clinic 11: Core Project",
			"Refactoring Clinic 12: Core Project",
			"Refactoring Clinic 13: Core Project",
			"Refactoring Clinic 14: Core Project",
			"Refactoring Clinic 15: Core Project",
			"Refactoring Clinic 16: Core Project",
			"Refactoring Clinic 17: Core Project",
			"Refactoring Clinic 17 Extension Practice"
		]) {
			const collection = title.startsWith("DPR")
				? curriculumTitles
				: optionTitles;
			expect(collection, title).toContain(title);
		}
		expect(moduleText("Optional Refactoring Clinics 11–17")).toContain(
			"complete guided practice collection"
		);
	});

	it("classifies changes and preserves behavior through reversible steps", () => {
		const setup = moduleText(
			"DPR1 Code Smells and Safe Refactoring Workflow"
		);

		expect(setup).toContain(
			"A refactor preserves externally observable behavior"
		);
		expect(setup).toContain("bug fix intentionally changes");
		expect(setup).toContain("feature adds behavior");
		expect(setup).toContain("performance change preserves results");
		expect(setup).toContain("return values, output text, exceptions");
		expect(setup).toContain("Commit the green baseline");
		expect(setup).toContain("one named transformation per commit");
		expect(setup).toContain("cannot be rolled back independently");
		expect(resourceText()).toContain("docs.junit.org/current/user-guide");
	});

	it("protects method, object, data, conditional, API, and hierarchy contracts", () => {
		const text = courseText();

		for (const contract of [
			"evaluation order",
			"numeric conversion",
			"temporary delegating bridge",
			"equals` and `hashCode",
			"collection-ownership policy",
			"round-trip data",
			"decision table",
			"source compatibility",
			"documented deprecation path",
			"exception type",
			"substitutability",
			"contract tests"
		]) {
			expect(text, contract).toContain(contract);
		}
		expect(text).toContain("record for a shallowly immutable");
		expect(text).toContain("`Optional` return");
		expect(text).toContain("sealed hierarchy");
		expect(resourceText()).toContain("java/util/Optional.html");
		expect(resourceText()).toContain("jls-13.html");
	});

	it("ends with real legacy seams, meaningful tests, and capstone evidence", () => {
		const confidence = moduleText(
			"DPR9 Testability, DI, and Refactoring with Confidence"
		);
		const capstone = moduleText("DPR10 Capstone Refactoring Studio");

		for (const effect of [
			"clocks",
			"randomness",
			"static globals",
			"file systems",
			"network clients",
			"databases",
			"threads"
		]) {
			expect(confidence, effect).toContain(effect);
		}
		expect(confidence).toContain("fails when that behavior changes");
		expect(confidence).toContain("temporary local mutation");
		expect(capstone).toContain("green baseline");
		expect(capstone).toContain("unexplained test failure");
		expect(capstone).toContain("diff too large to review");
		expect(capstone).toContain("before-and-after dependency view");
		expect(capstone).toContain("one abandoned refactor with evidence");
		expect(capstone).toContain("rollback point for every major change");
	});
});
