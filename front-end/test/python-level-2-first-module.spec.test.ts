import { createHash } from "node:crypto";
import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { addPythonIdeClassroomSectionsToSource } from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import asciiFixture from "../../test/fixtures/python-level-2-ascii-module-sources.json";
import capstonesFixture from "../../test/fixtures/python-level-2-capstones-module-sources.json";
import collectionsFixture from "../../test/fixtures/python-level-2-collections-module-sources.json";
import consoleFixture from "../../test/fixtures/python-level-2-console-module-sources.json";
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
		suffix: "-ps3-ascii-and-ciphers",
		source: "96f7196ea540fce55644e2a2d1d0ce97f16de9e8",
		assignments: [
			[
				"supplemental-ps3-supplemental-project-4-password-cracker",
				"PS3-Password-Cracker",
				"challenge"
			]
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
		suffix: "-ps6-lists-and-music",
		source: "ead6e1c2106bea775bada2f56d0e22f1cf168de9",
		assignments: [
			["Lists Practice", "PS6-Lists-Practice-1", "core"],
			["Build a Song", "PS6-Build-a-Song", "core"],
			["Tower of Terror", "PS6-Tower-of-Terror", "choice"],
			["Basketball Stars", "PS6-Basketball-Stars", "choice"],
			["Dog Breeds", "PS6-Dog-Breeds", "choice"],
			["Card Shuffler", "PS6-Card-Shuffler", "choice"]
		]
	},
	{
		suffix: "-ps7-dictionaries",
		source: "2dec846ce80283885dfe01579a181906e6748985",
		assignments: [
			["Dictionaries Practice", "PS7-Dictionaries-Practice", "core"],
			["Test Scores", "PS7-Test-Scores", "choice"]
		]
	},
	{
		suffix: "-ps9-sets",
		source: "2dec846ce80283885dfe01579a181906e6748985",
		assignments: [
			["Sets Practice", "PS9-Sets-Practice", "core"],
			[
				"curriculum-ps9-project-2-wheel-of-fortune",
				"PS9-Wheel-of-Fortune",
				"core"
			],
			["Class Registration II", "PS9-Class-Registration-II", "challenge"],
			["Favorite Foods", "PS9-Favorite-Foods", "choice"]
		]
	},
	{
		suffix: "-ps10-to-do-list",
		source: "2dec846ce80283885dfe01579a181906e6748985",
		assignments: [
			["To-Do List", "PS10-Todo-List", "core"],
			["Field Day", "PS10-Field-Day", "choice"],
			["Field Day II", "PS10-Field-Day-II", "challenge"]
		]
	},
	{
		suffix: "-ps11-bank-account",
		source: "96f7196ea540fce55644e2a2d1d0ce97f16de9e8",
		assignments: [
			["Bank Account", "PS11-Bank-Account", "core"],
			["Calculator", "PS11-Calculator", "choice"]
		]
	},
	{
		suffix: "-ps12-type-racer",
		source: "96f7196ea540fce55644e2a2d1d0ce97f16de9e8",
		assignments: [
			["curriculum-ps12-project-1-type-racer", "PS12-Type-Racer", "core"]
		]
	},
	{
		suffix: "-ps13-wordsmith",
		source: "96f7196ea540fce55644e2a2d1d0ce97f16de9e8",
		assignments: [
			[
				"Advanced Typewriter Monkeys",
				"PS13-Advanced-Typewriter-Monkeys",
				"challenge"
			]
		]
	},
	{
		suffix: "-ps14-blackjack",
		source: "4451de4a1f7dccd55a0175bbf9fe3f2fbe183f70",
		assignments: [
			["Simple Blackjack", "PS14-Simple-Blackjack", "core"],
			["Advanced Blackjack", "PS14-Advanced-Blackjack", "core"],
			[
				"supplemental-ps14-supplemental-project-1-game-of-war",
				"PS14-Game-of-War",
				"choice"
			],
			[
				"supplemental-ps14-supplemental-project-2-mastermind",
				"PS14-Mastermind",
				"challenge"
			]
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
						suffix === "-ps3-ascii-and-ciphers" ||
						suffix === "-ps4-conditionals" ||
						suffix === "-ps5-functions" ||
						suffix === "-ps6-lists-and-music" ||
						suffix === "-ps7-dictionaries" ||
						suffix === "-ps9-sets" ||
						suffix === "-ps10-to-do-list" ||
						suffix === "-ps11-bank-account" ||
						suffix === "-ps12-type-racer" ||
						suffix === "-ps13-wordsmith" ||
						suffix === "-ps14-blackjack" ||
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
	["functions", functionsFixture],
	["collections", collectionsFixture],
	["console", consoleFixture],
	["capstones", capstonesFixture]
] as const)(
	"binds the %s browser fixture to real course items and classroom sources",
	async (_scope, data) => {
		const fixture: {
			moduleId?: string;
			revision: string;
			files: Record<string, { content: string }>;
			exercises: {
				moduleId?: string;
				pack: string;
				itemId: string;
				classroomMainSha256: string;
			}[];
		} = data;
		setActivePinia(createPinia());
		const course = (await useCoursesStore().loadCourseById(
			"python-level-2-classroom"
		))!;
		const files: Record<string, { content: string }> = fixture.files;
		for (const exercise of fixture.exercises) {
			const module = course.modules.find(
				({ id }) => id === (exercise.moduleId ?? fixture.moduleId)
			)!;
			const assignments = [
				...module.curriculum,
				...module.supplementalProjects
			];
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
