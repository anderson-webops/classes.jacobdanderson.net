import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { loadRawCourse } from "@/stores/courses/index";
import { pythonLevel2Course } from "@/stores/courses/python-level-2";

const EXPECTED_TEACHING_MODULES = [
	"PS1 Variables, Strings, and Input",
	"PS2 For Loops and While Loops",
	"PS3 ASCII and Ciphers",
	"PS4 Conditionals",
	"Check-In #1",
	"PS5 Functions",
	"PS6 Lists and Music",
	"PS7 Dictionaries",
	"PS8 Ciphers and Music",
	"PS9 Sets",
	"Check-In #2",
	"PS10 To-Do List",
	"PS11 Bank Account",
	"PS12 Type Racer",
	"PS13 Wordsmith",
	"PS14 Blackjack",
	"PS15 Master Project"
];

function requireSourceModule(title: string) {
	const module = pythonLevel2Course.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Python Level 2 module ${title}.`);
	return module;
}

describe("Python Level 2 learner flow", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("binds all ten loop projects to the verified source in both formats", async () => {
		const revision = "40e195905b59faa845ca0b4418e9fa7537c7e51d";
		const folders = [
			"Crazy-Nametags",
			"Change-Machine",
			"Interest-Aggregator",
			"Password-Guesser",
			"For-Loop-Fun",
			"Calendar-Machine",
			"Double-or-Nothing",
			"Debugging-Loops",
			"Multiplication-Tables",
			"Juni-Archery"
		];
		const moduleId = "python-level-2-ps2-for-loops-and-while-loops";

		for (const courseId of ["python-level-2", "python-level-2-classroom"]) {
			const course = (await useCoursesStore().loadCourseById(courseId))!;
			const module = course.modules.find(({ id }) => id === moduleId)!;
			const items = [
				...module.curriculum,
				...module.supplementalProjects
			].filter(item => item.projectLink);
			expect(items).toHaveLength(folders.length);
			expect(items.map(item => item.solutionLink)).toEqual(
				folders.map(() => undefined)
			);
			expect(items[3]?.id).toBe(
				`${moduleId}-supplemental-ps2-supplemental-project-2-password-guesser`
			);
			for (const [index, item] of items.entries()) {
				const source = `Python-Level-2/tree/${revision}/PS2-${folders[index]}`;
				if (courseId === "python-level-2") {
					expect(item.projectLink).toBe(
						`https://github.com/instruction-material/${source}/starter`
					);
				} else {
					const launch = new URL(
						item.projectLink!,
						"https://classes.example"
					);
					expect(launch.pathname).toBe("/ide");
					expect(launch.searchParams.get("classroomSource")).toBe(
						`${source}/solution`
					);
				}
			}
		}
	});

	it("keeps the concept-to-application sequence without asset bookkeeping", () => {
		expect(pythonLevel2Course.modules.map(module => module.title)).toEqual(
			EXPECTED_TEACHING_MODULES
		);
		expect(
			pythonLevel2Course.modules.some(
				module => module.title === "Pending Static Assets"
			)
		).toBe(false);
	});

	it("gives every module pacing, syntax targets, and explicit paths", () => {
		for (const module of pythonLevel2Course.modules) {
			expect(module.estimatedTime, module.title).toMatch(/session/);
			expect(
				module.keyBlocks?.length,
				module.title
			).toBeGreaterThanOrEqual(5);
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

	it("keeps authored projects core and only supplemental work optional", () => {
		const requiredCount = pythonLevel2Course.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const optionCount = pythonLevel2Course.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);

		expect(requiredCount).toBe(54);
		expect(optionCount).toBe(53);

		// Juni places these check-in projects in curriculum, despite their titles.
		for (const title of ["Check-In #1", "Check-In #2"]) {
			expect(
				requireSourceModule(title).curriculum.find(item =>
					item.title.includes("Additional Practice Project")
				)?.learningPath
			).toBe("core");
		}

		expect(
			requireSourceModule("PS4 Conditionals").curriculum.find(
				item => item.title === "PS4 Project 3: Credit Card Validator"
			)?.learningPath
		).toBe("core");
		expect(
			requireSourceModule("PS5 Functions").curriculum.find(
				item => item.title === "PS5 Project 3: Dice Roller"
			)?.learningPath
		).toBe("core");
		expect(
			requireSourceModule("PS14 Blackjack").curriculum.find(
				item => item.title === "PS14 Project 2: Advanced Blackjack"
			)?.learningPath
		).toBe("core");
	});

	it("uses PS8 as a collections-and-cipher integration studio", () => {
		const ps8 = requireSourceModule("PS8 Ciphers and Music");
		expect(ps8.curriculum).toHaveLength(1);
		expect(ps8.curriculum[0]?.title).toBe("PS8 Project 1: Morse Code");
		expect(ps8.curriculum[0]?.content).toContain("integration studio");
		expect(ps8.keyBlocks).toContain("round-trip check");
	});

	it("preserves project progress IDs in the core listing", async () => {
		const course = await useCoursesStore().loadCourseById("python-level-2");
		expect(course).not.toBeNull();

		const conditionals = course!.modules.find(
			module => module.title === "PS4 Conditionals"
		);
		const validator = conditionals?.curriculum.find(
			item => item.title === "PS4 Project 3: Credit Card Validator"
		);

		expect(validator?.id).toBe(
			"python-level-2-ps4-conditionals-curriculum-ps4-project-3-credit-card-validator"
		);
		expect(validator?.aliases).toBeUndefined();
	});

	it("keeps method references and unavailable media out of learner actions", async () => {
		const course = await loadRawCourse("python-level-2");
		expect(course).not.toBeNull();

		const text = JSON.stringify(course);
		for (const referenceUrl of [
			"https://www.w3schools.com/python/python_ref_string.asp",
			"https://www.w3schools.com/python/python_ref_list.asp",
			"https://www.w3schools.com/python/python_ref_dictionary.asp",
			"https://www.w3schools.com/python/python_ref_tuple.asp",
			"https://www.w3schools.com/python/python_ref_set.asp"
		]) {
			expect(text).toContain(referenceUrl);
		}
		expect(
			course!.modules
				.flatMap(module => [
					...module.curriculum,
					...module.supplementalProjects
				])
				.some(item => item.mediaLink)
		).toBe(false);
		expect(text).not.toContain("Pending Python Level 2 Assets");
	});
});
