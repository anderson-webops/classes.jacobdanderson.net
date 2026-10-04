import { createHash } from "node:crypto";
import sourceFixture from "./fixtures/juni-scratch-project-fidelity.json";
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

	it("limits corrections to six uniquely identified published starters", () => {
		expect(juniScratchInstructionCorrections).toHaveLength(6);
		expect(
			new Set(
				juniScratchInstructionCorrections.map(item => item.projectId)
			).size
		).toBe(6);
		for (const correction of juniScratchInstructionCorrections) {
			expect(correction.publishedInstructionsSha256).toMatch(
				/^[a-f0-9]{64}$/
			);
		}
	});

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
		});
	}
});
