import { describe, expect, it } from "vitest";
import { pythonToJavaAndCppBridgeCourse } from "@/stores/courses/python-to-java-and-cpp-bridge";

const EXPECTED_MODULE_SEQUENCE = [
	"PTJ0 Positioning and Workflow Translation",
	"PTJ1 Functions, Parameters, and Return Types",
	"PTJ2 Collections, Strings, and Indexing",
	"PTJ3 Classes and Objects across Languages",
	"PTJ4 Java-Specific Adaptation",
	"PTJ5 C++-Specific Adaptation",
	"Language Bridge Lab 17: Bridge Capstone Port Studio",
	"Optional Transfer Studio Archive"
];

function requireModule(title: string) {
	const module = pythonToJavaAndCppBridgeCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected bridge module ${title}.`);
	return module;
}

describe("Python to Java and C++ Bridge learner flow", () => {
	it("shows one shared path, two exit choices, one capstone, and one archive", () => {
		expect(
			pythonToJavaAndCppBridgeCourse.modules.map(module => module.title)
		).toEqual(EXPECTED_MODULE_SEQUENCE);
		expect(requireModule("PTJ4 Java-Specific Adaptation").kind).toBe(
			"transition"
		);
		expect(requireModule("PTJ5 C++-Specific Adaptation").kind).toBe(
			"transition"
		);
		expect(requireModule("Optional Transfer Studio Archive").kind).toBe(
			"appendix"
		);
	});

	it("gives every teaching stage pacing and explicit core or choice paths", () => {
		for (const module of pythonToJavaAndCppBridgeCourse.modules.slice(
			0,
			7
		)) {
			expect(module.estimatedTime, module.title).toMatch(
				/session|Choose-one branch/
			);
			expect(
				module.keyBlocks?.length,
				module.title
			).toBeGreaterThanOrEqual(5);
			expect(module.curriculum[0]?.content, module.title).toContain(
				"**Course flow:**"
			);
			expect(
				module.supplementalProjects.every(item =>
					["choice", "challenge"].includes(item.learningPath ?? "")
				),
				module.title
			).toBe(true);
		}

		for (const title of EXPECTED_MODULE_SEQUENCE.slice(0, 4)) {
			expect(
				requireModule(title).curriculum.every(
					item => item.learningPath === "core"
				)
			).toBe(true);
		}
		for (const title of [
			"PTJ4 Java-Specific Adaptation",
			"PTJ5 C++-Specific Adaptation"
		]) {
			expect(
				requireModule(title).curriculum.every(
					item => item.learningPath === "choice"
				)
			).toBe(true);
		}
	});

	it("requires only one target-language branch", () => {
		const classModule = requireModule(
			"PTJ3 Classes and Objects across Languages"
		);
		const branchDecision = classModule.curriculum.find(
			item => item.title === "Choose a Java or C++ Exit Branch"
		);

		expect(branchDecision?.content).toContain(
			"unselected branch is labeled optional"
		);
		expect(
			requireModule("PTJ4 Java-Specific Adaptation").curriculum[0]
				?.content
		).toContain("leave the C++ branch optional");
		expect(
			requireModule("PTJ5 C++-Specific Adaptation").curriculum[0]?.content
		).toContain("Java branch remains optional");
	});

	it("uses authored projects once and verifies equivalent behavior", () => {
		const teachingModules = pythonToJavaAndCppBridgeCourse.modules.slice(
			0,
			7
		);
		const requiredCount = teachingModules.reduce(
			(total, module) =>
				total +
				module.curriculum.filter(item => item.learningPath === "core")
					.length,
			0
		);

		expect(requiredCount).toBe(27);
		for (const module of teachingModules.slice(0, 6)) {
			expect(
				module.curriculum.some(item =>
					item.title.endsWith(": Core Project")
				),
				module.title
			).toBe(false);
			expect(
				module.supplementalProjects.length,
				module.title
			).toBeGreaterThanOrEqual(2);
		}
		expect(
			requireModule(
				"Language Bridge Lab 17: Bridge Capstone Port Studio"
			).curriculum.find(
				item => item.title === "Chosen-Language Capstone Contract"
			)?.content
		).toContain("Shared fixtures");
	});

	it("preserves duplicate and cross-course studios outside the required flow", () => {
		const archive = requireModule("Optional Transfer Studio Archive");
		const archiveText = [
			...archive.curriculum,
			...archive.supplementalProjects
		]
			.flatMap(item => [item.title, item.content])
			.join("\n");

		expect(archive.supplementalProjects).toHaveLength(70);
		for (const archivedStudio of [
			"Language Bridge Lab 11: Compile-Run Comparison Studio",
			"Language Bridge Lab 16: C++ Console Adaptation Studio",
			"Graphics Translation Studio",
			"Java Foundations Transfer Studio",
			"C Foundations Transfer Studio"
		]) {
			expect(archiveText).toContain(archivedStudio);
		}
		expect(
			archive.curriculum.every(item => item.learningPath === "choice")
		).toBe(true);
	});
});
