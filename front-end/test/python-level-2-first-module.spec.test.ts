import { createHash } from "node:crypto";
import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { addPythonIdeClassroomSectionsToSource } from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import asciiFixture from "../../test/fixtures/python-level-2-ascii-module-sources.json";
import conditionalsFixture from "../../test/fixtures/python-level-2-conditionals-module-sources.json";
import functionsFixture from "../../test/fixtures/python-level-2-functions-module-sources.json";

const modules = [
	{
		suffix: "-ps1-variables-strings-and-input",
		source: "b58d958347f0c3ca6f9d96963a674cc3d00813bf",
		assignments: [
			["Mad Libs", "PS1-Mad-Libs", "core"],
			["Index Picker", "PS1-Index-Picker", "core"],
			["Space Mountain", "PS1-Space-Mountain", "choice"],
			["Tip Calculator", "PS1-Tip-Calculator", "choice"],
			["Relay Race", "PS1-Relay-Race", "choice"]
		]
	},
	{
		suffix: "-ps4-conditionals",
		source: "5d787e78f9d0e72096046c49ee25e9fab53fe045",
		assignments: [
			["Rock, Paper, Scissors", "PS4-Rock-Paper-Scissors", "core"],
			["FizzBuzz", "PS4-FizzBuzz", "core"],
			["Credit Card Validator", "PS4-Credit-Card-Validator", "core"],
			[
				"Carnival Strength Tester",
				"PS4-Carnival-Strength-Tester",
				"choice"
			],
			["Test Statistics", "PS4-Test-Statistics", "choice"],
			["Relay Race Statistics", "PS4-Relay-Race-Statistics", "choice"],
			[
				"Joe's Donuts Opening Day",
				"PS4-Joes-Donuts-Opening-Day",
				"choice"
			],
			["Number Guesser", "PS4-Number-Guesser", "choice"],
			[
				"Debugging Conditionals",
				"PS4-Debugging-Conditionals",
				"challenge"
			]
		]
	},
	{
		suffix: "-check-in-1",
		source: "8bc76e6927ae40683bfb79170c378dac2b266cf2",
		assignments: [
			["curriculum-check-in-1-overview", "PS-Check-in-1", "core"],
			[
				"curriculum-check-in-1-additional-practice-project",
				"PS-Check-in-1/practice",
				"core"
			]
		]
	},
	{
		suffix: "-ps5-functions",
		source: "6c8442dd68067e1f8cee1f14a5e08bf8e4b06c17",
		assignments: [
			["Functions Practice", "PS5-Functions-Practice", "core"],
			["Parameter Tracing", "PS5-Parameter-Tracing", "core"],
			["Coin Flipper", "PS5-Coin-Flipper", "core"],
			["Dice Roller", "PS5-Dice-Roller", "core"],
			["Squawka Zilly Floog", "PS5-Squawka-Zilly-Floog", "choice"],
			["Word Translator", "PS5-Juni-Latin", "choice"],
			["Number Games", "PS5-Number-Games", "choice"],
			["Debugging Functions", "PS5-Debugging-Functions", "challenge"]
		]
	},
	{
		suffix: "-check-in-2",
		source: "8bc76e6927ae40683bfb79170c378dac2b266cf2",
		assignments: [
			["curriculum-check-in-2-overview", "PS-Check-in-2", "core"],
			[
				"curriculum-check-in-2-additional-practice-project",
				"PS-Check-in-2/practice",
				"core"
			]
		]
	}
] as const;

it.each([
	["python-level-2", "learner"],
	["python-level-2", "instructor"],
	["python-level-2-classroom", "learner"],
	["python-level-2-classroom", "instructor"]
] as const)(
	"links role-appropriate Python Level 2 projects in %s for %s",
	async (courseId, role) => {
		setActivePinia(createPinia());
		if (role === "instructor") {
			useAppStore().setCurrentTutor({
				_id: "python-course-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 0,
				coursePermissions: [courseId],
				editTutors: false,
				saveEdit: "Save"
			});
		}

		const course = (await useCoursesStore().loadCourseById(courseId))!;
		for (const { suffix, source, assignments } of modules) {
			const module = course.modules.find(({ id }) =>
				id.endsWith(suffix)
			)!;
			const items = [
				...module.curriculum,
				...module.supplementalProjects
			];
			for (const [title, folder, path] of assignments) {
				const item = items.find(
					candidate =>
						candidate.title.endsWith(title) ||
						candidate.id.endsWith(title)
				)!;
				const projectSource = `Python-Level-2/tree/${source}/${folder}`;
				const base = `https://github.com/instruction-material/${projectSource}`;
				expect(item.learningPath, title).toBe(path);
				expect(item.solutionLink).toBe(
					role === "instructor" ? `${base}/solution` : undefined
				);
				if (courseId === "python-level-2") {
					expect(item.projectLink).toBe(`${base}/starter`);
				} else {
					const launch = new URL(
						item.projectLink!,
						"https://classes.example"
					);
					expect(launch.pathname).toBe("/ide");
					expect(launch.searchParams.get("classroomSource")).toBe(
						`${projectSource}/solution`
					);
					expect(launch.searchParams.get("projectKey")).toBe(
						`${courseId}:${item.id}:starter`
					);
					if (
						suffix === "-ps4-conditionals" ||
						suffix === "-ps5-functions" ||
						suffix.startsWith("-check-in-")
					) {
						expect(item.contentKind).toBe("assignment");
						expect(item.content).toMatch(
							/\*\*Normal:\*\*[\s\S]*\*\*Hard:\*\*[\s\S]*\*\*Success criteria:\*\*/
						);
					}
				}
			}
		}
	}
);

it.each([
	["ascii", asciiFixture],
	["conditionals", conditionalsFixture],
	["functions", functionsFixture]
] as const)(
	"binds the %s browser fixture to real course items and classroom sources",
	async (_scope, fixture) => {
		setActivePinia(createPinia());
		const course = (await useCoursesStore().loadCourseById(
			"python-level-2-classroom"
		))!;
		const files: Record<string, { content: string }> = fixture.files;
		const module = course.modules.find(
			({ id }) => id === fixture.moduleId
		)!;
		const assignments = [
			...module.curriculum,
			...module.supplementalProjects
		];
		for (const exercise of fixture.exercises) {
			const item = assignments.find(({ id }) => id === exercise.itemId);
			expect(item?.projectLink, exercise.itemId).toBeDefined();
			const launch = new URL(
				item!.projectLink!,
				"https://classes.example"
			);
			expect(launch.searchParams.get("classroomSource")).toBe(
				`Python-Level-2/tree/${fixture.revision}/${exercise.pack}/solution`
			);
			const solution = files[`${exercise.pack}/solution/main.py`];
			const wrapped = addPythonIdeClassroomSectionsToSource(
				solution!.content
			);
			expect(createHash("sha256").update(wrapped).digest("hex")).toBe(
				exercise.classroomMainSha256
			);
		}
	}
);
