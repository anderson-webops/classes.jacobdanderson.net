import { createHash } from "node:crypto";
import sourceFixture from "./fixtures/juni-scratch-project-fidelity.json";
import conceptReadings from "./fixtures/scratch-concept-readings.json";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import type {
	CourseDefinition,
	CourseModule,
	CourseModuleItem,
	RawCourse,
	RawCourseModule,
	RawCourseModuleItem
} from "@/stores/courses/types";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import {
	findJuniScratchInstructionCorrection,
	juniScratchInstructionCorrections
} from "@/stores/courses/juniScratchInstructionCorrections";
import { isJuniScratchProjectTitle } from "@/stores/courses/juniScratchProjects";
import { normalizeRawCourse } from "@/stores/courses/normalization";
import { scratchLevel1Course } from "@/stores/courses/scratch-level-1";
import { scratchLevel2Course } from "@/stores/courses/scratch-level-2";

function matchingModule(
	course: CourseDefinition,
	rawModule: RawCourseModule
): CourseModule {
	const module = course.modules.find(
		candidate =>
			(rawModule.id && candidate.id === rawModule.id) ||
			(rawModule.id && candidate.aliases?.includes(rawModule.id)) ||
			candidate.title.replace(/[^a-z0-9]/gi, "").toLowerCase() ===
				rawModule.title.replace(/[^a-z0-9]/gi, "").toLowerCase()
	);

	if (!module) {
		throw new Error(
			`Missing normalized Scratch module ${rawModule.title}.`
		);
	}

	return module;
}

function matchingItem(
	items: CourseModuleItem[],
	rawItem: RawCourseModuleItem
): CourseModuleItem | undefined {
	return items.find(
		candidate =>
			(rawItem.id && candidate.id === rawItem.id) ||
			(rawItem.id && candidate.aliases?.includes(rawItem.id)) ||
			candidate.title === rawItem.title
	);
}

function expectProjectInstructionsPreserved(
	courseId: string,
	rawCourse: RawCourse,
	displayCourse: CourseDefinition
) {
	let projectCount = 0;

	for (const rawModule of rawCourse.modules) {
		const displayModule = matchingModule(displayCourse, rawModule);

		for (const section of ["curriculum", "supplementalProjects"] as const) {
			const otherSection =
				section === "curriculum"
					? "supplementalProjects"
					: "curriculum";

			for (const rawItem of rawModule[section].filter(item =>
				isJuniScratchProjectTitle(courseId, item.title)
			)) {
				projectCount += 1;
				const displayItem = matchingItem(
					displayModule[section],
					rawItem
				);

				expect(displayItem, rawItem.title).toBeDefined();
				expect(
					isJuniScratchProjectTitle(
						courseId,
						displayItem?.title ?? ""
					),
					`${rawItem.title} -> ${displayItem?.title}`
				).toBe(true);
				expect(displayItem?.content.trim(), rawItem.title).toBe(
					rawItem.content.trim()
				);
				expect(
					matchingItem(displayModule[otherSection], rawItem),
					rawItem.title
				).toBeUndefined();
			}
		}
	}

	expect(projectCount).toBe(44);
}

describe("original Juni Scratch project instructions", () => {
	it("preserves distinct project instructions when IDs are omitted", () => {
		const first = "1. First project.\n2. Keep this exact wording.";
		const second = "1. Second project.\n2. Keep this other wording.";
		const course = normalizeRawCourse("scratch-level-1", {
			name: "Scratch Level 1",
			modules: [
				{
					title: "GS1 Starting in Scratch",
					curriculum: [
						{ title: "Project 1 – Hungry Hippo", content: first }
					],
					supplementalProjects: []
				},
				{
					title: "GS2 Drawing",
					curriculum: [
						{ title: "Project 1 – Drawing", content: second }
					],
					supplementalProjects: []
				}
			]
		});
		const items = course.modules.flatMap(module => module.curriculum);
		expect(
			items.find(item => item.title.endsWith("Hungry Hippo"))?.content
		).toBe(first);
		expect(
			items.find(item => item.title.endsWith("Drawing"))?.content
		).toBe(second);
	});

	beforeEach(() => {
		setActivePinia(createPinia());
	});

	for (const [courseId, rawCourse] of [
		["scratch-level-1", scratchLevel1Course],
		["scratch-level-2", scratchLevel2Course]
	] as const) {
		it(`preserves the archived source or a verified correction for every ${courseId} project`, () => {
			const slugify = (text: string) =>
				text
					.toLowerCase()
					.normalize("NFKD")
					.replace(/[\u0300-\u036f]/g, "")
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/^-+|-+$/g, "");
			const originals = sourceFixture.projects.filter(
				item => item.courseId === courseId
			);
			expect(originals).toHaveLength(44);
			for (const original of originals) {
				const sourceId = slugify(
					`${courseId}-${original.moduleTitle}-${original.section === "curriculum" ? "curriculum" : "supplemental"}-${original.title}`
				);
				const matches = rawCourse.modules.flatMap(module =>
					(["curriculum", "supplementalProjects"] as const).flatMap(
						section =>
							module[section]
								.filter(
									item =>
										item.title.toLowerCase() ===
											original.title.toLowerCase() ||
										item.id === sourceId ||
										item.aliases?.includes(sourceId)
								)
								.map(item => ({ section, item }))
					)
				);
				expect(matches, original.title).toHaveLength(1);
				expect(matches[0]?.section, original.title).toBe(
					original.section
				);
				const correction = findJuniScratchInstructionCorrection(
					courseId,
					original.title
				);
				if (correction) {
					expect(
						correction.baselineContentSha256,
						original.title
					).toBe(original.sha256);
					expect(
						matches[0]!.item.content.trim(),
						original.title
					).toBe(correction.content);
					expect(matches[0]!.item.projectLink).toBe(
						`https://scratch.mit.edu/projects/${correction.projectId}/`
					);
					expect(matches[0]!.item.solutionLink).toBe(
						`https://scratch.mit.edu/projects/${correction.solutionId}/`
					);
				} else {
					expect(
						createHash("sha256")
							.update(matches[0]!.item.content.trim())
							.digest("hex"),
						original.title
					).toBe(original.sha256);
				}
			}
		});

		it(`preserves every ${courseId} project through learner display`, async () => {
			const displayCourse =
				await useCoursesStore().loadCourseById(courseId);

			expect(displayCourse).not.toBeNull();
			expectProjectInstructionsPreserved(
				courseId,
				rawCourse,
				displayCourse!
			);
		});
	}

	it.each(["learner", "instructor"])(
		"retains the six-petal source task and reference for %s",
		async role => {
			if (role === "instructor")
				useAppStore().setCurrentTutor({
					_id: "nested-review-tutor",
					name: "Tutor",
					email: "tutor@example.invalid",
					age: 30,
					state: "GA",
					usersOfTutorLength: 0,
					coursePermissions: ["scratch-level-2"],
					editTutors: false,
					saveEdit: "Save"
				});
			const course =
				(await useCoursesStore().loadCourseById("scratch-level-2"))!;
			const module = course.modules.find(
				module => module.title === "GM2 Nested Loops"
			)!;
			const item = module.supplementalProjects.find(
				item =>
					item.projectLink ===
					"https://scratch.mit.edu/projects/335808333/"
			)!;
			expect(item).toBeDefined();
			expect(item.learningPath).toBe("choice");
			expect(item.playableSolutionEmbedUrl).toBe(
				"https://scratch.mit.edu/projects/335807180/embed"
			);
			expect(item.content).toContain("other five (six petals total)");
			expect(item.content).not.toContain("other six");
			expect(item.content).toContain("repeat 40 times");
		}
	);

	for (const courseId of ["scratch-level-1", "scratch-level-2"]) {
		it.each(["learner", "instructor"])(
			courseId + " explanations stay in Learn for %s",
			async role => {
				if (role === "instructor")
					useAppStore().setCurrentTutor({
						_id: "reading-placement-tutor",
						name: "Tutor",
						email: "tutor@example.invalid",
						age: 30,
						state: "GA",
						usersOfTutorLength: 0,
						coursePermissions: [courseId],
						editTutors: false,
						saveEdit: "Save"
					});
				const course =
					(await useCoursesStore().loadCourseById(courseId))!;
				for (const expected of conceptReadings.filter(
					row => row.courseId === courseId
				)) {
					const module = course.modules.find(
						module => module.id === expected.moduleId
					)!;
					const item = module.curriculum.find(
						item => item.id === expected.itemId
					)!;
					expect(item, expected.itemId).toBeDefined();
					expect(item.title).toBe(expected.title);
					expect(item.contentKind).toBe("reading");
					expect(isLessonLearningItem(item)).toBe(true);
					for (const originalId of expected.sourceItemIds)
						expect([item.id, ...(item.aliases ?? [])]).toContain(
							originalId
						);
					for (const text of expected.requiredText)
						expect(item.content).toContain(text);
					expect(item.content).not.toMatch(
						/(?:Core Concepts|Application Check) project/
					);
				}
			}
		);
	}

	it("limits corrections to sixteen uniquely identified published starters", () => {
		expect(juniScratchInstructionCorrections).toHaveLength(16);
		expect(
			new Set(
				juniScratchInstructionCorrections.map(item => item.projectId)
			).size
		).toBe(16);
		for (const correction of juniScratchInstructionCorrections) {
			expect(correction.publishedInstructionsSha256).toMatch(
				/^[a-f0-9]{64}$/
			);
		}
	});

	it.each(["learner", "instructor"])(
		"retains published input and coordinate tasks and links for %s",
		async role => {
			if (role === "instructor")
				useAppStore().setCurrentTutor({
					_id: "task-review-tutor",
					name: "Tutor",
					email: "tutor@example.invalid",
					age: 30,
					state: "GA",
					usersOfTutorLength: 0,
					coursePermissions: ["scratch-level-1"],
					editTutors: false,
					saveEdit: "Save"
				});
			const course =
				(await useCoursesStore().loadCourseById("scratch-level-1"))!;
			const items = course.modules.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			]);
			for (const [id, solution, path, required, excluded] of [
				[
					"297744913",
					"297735619",
					"core",
					[
						"hat is clicked",
						"between 1 and 5",
						"Magic Spell",
						"twice",
						"each number"
					],
					["Love, Money, or Friendship"]
				],
				[
					"295334181",
					"294561252",
					"core",
					[
						"1 and 100",
						"51",
						"Too low!",
						"Too high!",
						"unchanged",
						"Optional:"
					],
					["between 1 and 20"]
				],
				[
					"328309551",
					"328310531",
					"choice",
					[
						"backdrops named",
						"dinosaur",
						"jellyfish",
						"giraffe",
						"two seconds"
					],
					["build a shop", "plant a tree", "items collected"]
				],
				[
					"329289426",
					"329283944",
					"choice",
					[
						"mouse pointer",
						"forever",
						"greater than 0",
						"less than 0",
						"top left",
						"bottom right",
						"bottom left",
						"Optional:"
					],
					["Use the arrow keys to move", "Quadrant I"]
				],
				[
					"329294838",
					"329290359",
					"choice",
					[
						"supplied grid backdrops",
						"Pen extension",
						"Lift the pen",
						"go to x/y",
						"change x/y",
						"Optional: ask for coordinates"
					],
					["2. Allow the user to enter coordinates"]
				],
				[
					"328310783",
					"328308418",
					"choice",
					[
						"Spot",
						"Dot",
						"(0, 0)",
						"Earth",
						"Saturn",
						"Star",
						"pick random",
						"Hi Dot!"
					],
					["Captain", "Mars", "Jupiter", "discoveries"]
				]
			] as const) {
				const item = items.find(
					item =>
						item.projectLink ===
						`https://scratch.mit.edu/projects/${id}/`
				)!;
				expect(item).toBeDefined();
				expect(item.learningPath).toBe(path);
				expect(item.playableSolutionEmbedUrl).toBe(
					`https://scratch.mit.edu/projects/${solution}/embed`
				);
				for (const text of required)
					expect(item.content).toContain(text);
				for (const text of excluded)
					expect(item.content).not.toContain(text);
			}
		}
	);

	it.each([
		{
			projectId: "327635693",
			required: ["Zebra Steps", "set it to 0", "next costume", "by 1"],
			excluded: []
		},
		{
			projectId: "327610777",
			required: [
				"random x",
				"pick random",
				"decreasing y",
				"Puffs Eaten",
				"Chomp"
			],
			excluded: ["3. Add a timer"]
		},
		{
			projectId: "327607937",
			required: [
				"donut $2",
				"pizza $4",
				"taco $3",
				"apple $1",
				"store the answer",
				"done",
				"unchanged",
				"money remains"
			],
			excluded: ["set to 10", "sandwich", "salad"]
		}
	])(
		"retains the supplied input and behavior contract for $projectId",
		async ({ projectId, required, excluded }) => {
			const course =
				(await useCoursesStore().loadCourseById("scratch-level-1"))!;
			const item = course.modules
				.flatMap(module => module.supplementalProjects)
				.find(
					item =>
						item.projectLink ===
						`https://scratch.mit.edu/projects/${projectId}/`
				)!;
			expect(item).toBeDefined();
			for (const text of required) expect(item.content).toContain(text);
			for (const text of excluded)
				expect(item.content).not.toContain(text);
			if (projectId === "327610777")
				expect(item.content).toContain("Optional: add a timed round");
		}
	);

	for (const [title, required, excluded] of [
		[
			"Project 1 – Bug Eater",
			[
				"frog",
				"X coordinate",
				"Y coordinate",
				"answer",
				"collectible",
				"chomp"
			],
			["mantis", "mouse pointer", "timer"]
		],
		[
			"Project 2 – Cake Chaser",
			[
				"cake",
				"changing x by 10",
				"changing y by 10",
				"center",
				"corner",
				"point toward",
				"catches"
			],
			["person", "score", "timer"]
		],
		[
			"Project 3 – Talent Show",
			[
				"cat",
				'"speak"',
				'"song"',
				'"spin"',
				'"draw"',
				'"corners"',
				"all four corners",
				'"stop"',
				"unrecognized"
			],
			["three performers", "broadcast", "bow"]
		],
		[
			"Project 3 – Beetle Artist",
			[
				"10 steps",
				"clear",
				"center facing right",
				"pen size and color",
				'"1"',
				"square",
				'"2"',
				"triangle",
				'"3"',
				"arrow shape"
			],
			[]
		],
		[
			"Project 1 – Speed Click",
			[
				"10 seconds",
				"pressed costume",
				"Ready...",
				"Set...",
				"Go!",
				"Hide",
				"Show",
				"reset the click count"
			],
			["20", "random positions"]
		],
		[
			"Project 2 – Spider Smash",
			[
				"one minute",
				"mouse pointer",
				"smash costume",
				"every two seconds",
				"both conditions",
				"mouse button is pressed",
				"touching the hammer",
				"crunch"
			],
			["move downward", "spider is clicked"]
		]
	] as const) {
		it(`displays the published starter requirements for ${title}`, async () => {
			const course =
				await useCoursesStore().loadCourseById("scratch-level-1");
			const content = course!.modules
				.flatMap(module => [
					...module.curriculum,
					...module.supplementalProjects
				])
				.find(item => item.title === title)!.content;
			for (const requirement of required)
				expect(content).toContain(requirement);
			for (const staleRequirement of excluded)
				expect(content).not.toContain(staleRequirement);
			if (title === "Project 2 – Spider Smash") {
				const hint = course!.modules
					.flatMap(module => module.curriculum)
					.find(
						item => item.id === "scratch-spider-costume-debugging"
					);
				expect(hint?.projectLink).toBeUndefined();
				for (const required of [
					"Debugging hint: restore the hammer",
					"else\n      switch costume to [resting costume]",
					"wait until not mouse down?",
					"true and false branches",
					"For all sprites",
					"set Time Left to 60\n  broadcast [round ready]",
					"wait 1 seconds\n    change Time Left by -1",
					"Time Left > 0",
					"must not sit in the pointer loop",
					"Score must not increase after the timer ends"
				])
					expect(hint?.content).toContain(required);
			}
		});
	}
});
