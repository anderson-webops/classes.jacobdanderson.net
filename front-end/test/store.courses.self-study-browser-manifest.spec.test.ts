import type { CourseModuleItem } from "@/stores/courses/types";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createPinia, setActivePinia } from "pinia";
import MarkdownIt from "markdown-it";
import { expect, it } from "vitest";
import published from "../../test/fixtures/catalog-published-identities.json";
import elementaryAdditions from "../../test/fixtures/early-elementary-a-restored-identities.json";
import elementaryBAdditions from "../../test/fixtures/early-elementary-b-restored-identities.json";
import lateElementaryAAdditions from "../../test/fixtures/late-elementary-a-restored-identities.json";
import ventureAdditions from "../../test/fixtures/entrepreneurship-restored-core-identities.json";
import grammarAdditions from "../../test/fixtures/grammar-mechanics-restored-identities.json";
import literatureAdditions from "../../test/fixtures/middle-school-literature-restored-identities.json";
import writingAdditions from "../../test/fixtures/middle-school-writing-restored-identities.json";
import speakingAdditions from "../../test/fixtures/public-speaking-restored-identities.json";
import {
	isLessonLearningItem,
	lessonContentSections
} from "@/modules/courseLessonPresentation";
import { normalizeInlineCourseMarkdown } from "@/modules/courseMarkdown";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { algebra1ACourse } from "@/stores/courses/algebra-1a";
import { algebra1BCourse } from "@/stores/courses/algebra-1b";
import { algebraErrorAnalysisCases } from "@/stores/courses/algebraErrorAnalysisCases";
import { algebra2ACourse } from "@/stores/courses/algebra-2a";
import { algebra2BCourse } from "@/stores/courses/algebra-2b";
import { introToPhysicsCourse } from "@/stores/courses/intro-to-physics";
import { physicsLevel2Course } from "@/stores/courses/physics-level-2";
import { geometryACourse } from "@/stores/courses/geometry-a";
import { geometryBCourse } from "@/stores/courses/geometry-b";
import { preAlgebraACourse } from "@/stores/courses/pre-algebra-a";
import {
	earlyElementaryMathACourse,
	earlyElementaryMathBCourse,
	lateElementaryMathACourse,
	entrepreneurship101Course,
	grammarMechanicsCourse,
	introductionToPublicSpeakingCourse,
	middleSchoolLiteratureCourse,
	middleSchoolWritingCourse,
	middleSchoolWritingRetakeCourse,
	novelWritingCourse,
	scratchLevel1BootcampCourse
} from "@/stores/courses/source-library-courses";

const cases = [
	{
		id: "late-elementary-a-math",
		source: lateElementaryMathACourse,
		readings: 19,
		additions: lateElementaryAAdditions
	},
	{
		id: "early-elementary-b-math",
		source: earlyElementaryMathBCourse,
		readings: 19,
		additions: elementaryBAdditions
	},
	{
		id: "early-elementary-a-math",
		source: earlyElementaryMathACourse,
		readings: 22,
		additions: elementaryAdditions
	},
	{
		id: "algebra-1a",
		source: algebra1ACourse,
		readings: 15,
		additions: []
	},
	{
		id: "algebra-1b",
		source: algebra1BCourse,
		readings: 31,
		additions: []
	},
	{
		id: "geometry-b",
		source: geometryBCourse,
		readings: 11,
		additions: []
	},
	{
		id: "geometry-a",
		source: geometryACourse,
		readings: 6,
		additions: []
	},
	{
		id: "entrepreneurship-101",
		source: entrepreneurship101Course,
		readings: 10,
		additions: ventureAdditions
	},
	{
		id: "middle-school-a-literature",
		source: middleSchoolLiteratureCourse,
		readings: 13,
		additions: literatureAdditions
	},
	{
		id: "middle-school-b-writing",
		source: middleSchoolWritingCourse,
		readings: 14,
		additions: writingAdditions["middle-school-b-writing"]
	},
	{
		id: "middle-school-b-writing-retake",
		source: middleSchoolWritingRetakeCourse,
		readings: 16,
		additions: writingAdditions["middle-school-b-writing-retake"]
	},
	{
		id: "middle-school-c-grammar",
		source: grammarMechanicsCourse,
		readings: 20,
		additions: grammarAdditions
	},
	{
		id: "novel-writing",
		source: novelWritingCourse,
		readings: 14,
		additions: []
	},
	{
		id: "introduction-to-public-speaking",
		source: introductionToPublicSpeakingCourse,
		readings: 9,
		additions: speakingAdditions
	},
	{
		id: "scratch-level-1-bootcamp",
		source: scratchLevel1BootcampCourse,
		readings: 4,
		additions: []
	},
	{
		id: "algebra-2a",
		source: algebra2ACourse,
		readings: 27,
		additions: []
	},
	{
		id: "algebra-2b",
		source: algebra2BCourse,
		readings: 22,
		additions: []
	},
	{
		id: "intro-to-physics",
		source: introToPhysicsCourse,
		readings: 37,
		additions: []
	},
	{
		id: "physics-level-2",
		source: physicsLevel2Course,
		readings: 38,
		additions: []
	},
	{
		id: "pre-algebra-a",
		source: preAlgebraACourse,
		readings: 11,
		additions: []
	}
] as const;
const markdown = new MarkdownIt({ breaks: true, html: false, linkify: true });
const digest = (value: string) =>
	createHash("sha256").update(value).digest("hex");
const intentionalMathLineBreaks: Record<string, Record<string, number>> = {
	"algebra-2a": {
		"Applications and Parabola Geometry": 1,
		"Graphing and Roots of Rational Functions": 3,
		"Multiplying, Dividing, and Simplifying Rational Expressions": 2,
		"Adding, Subtracting, and Solving Rational Equations": 2,
		"Piecewise Models and Continuity": 2
	},
	"algebra-2b": {
		"Logarithm Properties and Change of Base": 2,
		"Arithmetic Sequences and nth Terms": 1,
		"Arithmetic Series and Application Problems": 1,
		"Geometric Sequences and Exponential Patterns": 1,
		"Geometric Sums and Infinite Series": 2,
		"Inverses and Matrix Division": 3,
		"Sine, Cosine, and Tangent Graph Features": 1
	}
};

function reading(item: CourseModuleItem) {
	const container = document.createElement("div");
	container.innerHTML = markdown.render(
		normalizeInlineCourseMarkdown(item.content)
	);
	return {
		id: item.id,
		title: item.title,
		learningPath: item.learningPath,
		contentSHA256: digest(item.content),
		expectedText: container.textContent!.replace(/\s+/g, " ").trim(),
		tableRows: container.querySelectorAll("tbody tr").length,
		paragraphBreaks: container.querySelectorAll(":scope > p > br").length,
		images: [
			...[...container.querySelectorAll("img")].map(image => ({
				src: image.getAttribute("src"),
				alt: image.alt
			})),
			...(item.mediaLink &&
			/(?:course-assets|static\.classes\.jacobdanderson\.net)\/algebra-2[ab]\/.+\.svg$/.test(
				item.mediaLink
			)
				? [
						{
							src: item.mediaLink,
							alt: `Project demo media for ${item.title}`
						}
					]
				: [])
		]
	};
}

it.each(
	cases.flatMap(course =>
		["learner", "instructor"].map(role => ({ ...course, role }))
	)
)(
	"binds complete browser expectations for $id $role",
	async ({ id, role, source, readings: count, additions }) => {
		setActivePinia(createPinia());
		if (role === "instructor")
			useAppStore().setCurrentTutor({
				_id: "self-study-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 0,
				coursePermissions: [id],
				editTutors: false,
				saveEdit: "Save"
			});
		const course = (await useCoursesStore().loadCourseById(id))!;
		for (const entry of algebraErrorAnalysisCases.filter(
			entry => entry.course === id
		)) {
			const module = course.modules.find(
				module => module.title === entry.module
			)!;
			const task = module.supplementalProjects.find(item =>
				item.title.includes("Modeling or Error Analysis")
			)!;
			expect(task.contentKind, entry.heading).toBe("assignment");
			expect(task.content, entry.heading).toContain(entry.given);
			expect(task.content, entry.heading).toContain(entry.flawed);
			for (const question of entry.questions)
				expect(task.content, entry.heading).toContain(question);
		}
		const identities = course.modules.flatMap(module =>
			(
				[
					["core", module.curriculum],
					["optional", module.supplementalProjects]
				] as const
			).flatMap(([section, items]) =>
				items.map(item => ({
					moduleId: module.id,
					id: item.id,
					section
				}))
			)
		);
		const originals = identities.filter(
			item => !additions.some(added => added.id === item.id)
		);
		expect(identities).toHaveLength(published[id].items + additions.length);
		expect(digest(JSON.stringify(originals))).toBe(published[id].sha256);
		for (const added of additions)
			expect(identities.filter(item => item.id === added.id)).toEqual([
				added
			]);
		const sourceProjects = source.modules
			.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			])
			.filter(item => item.content.startsWith("**Project goal:**"));
		const all = course.modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		for (const project of sourceProjects) {
			const item = all.find(item => item.title === project.title)!;
			expect(item, project.title).toBeDefined();
			expect(isLessonLearningItem(item), item.title).toBe(false);
			expect(item.learningPath, item.title).toBe(project.learningPath);
			const originalPrompt = project.content
				.replace(/^\*\*Project goal:\*\*\s*/, "")
				.split("**Completion evidence:**")[0]
				.trim();
			const displayedPrompt = item.content
				.replace(/^\*\*Project goal:\*\*\s*/, "")
				.split("**Completion evidence:**")[0]
				.trim();
			if (
				[
					"scratch-level-1-bootcamp",
					"introduction-to-public-speaking",
					"middle-school-a-literature"
				].includes(id)
			)
				expect(displayedPrompt, project.title).toBe(originalPrompt);
		}
		const card = (item: CourseModuleItem) => {
			const fullBlocks = [
				"early-elementary-a-math",
				"early-elementary-b-math",
				"late-elementary-a-math",
				"algebra-1a",
				"algebra-1b",
				"pre-algebra-a",
				"geometry-a",
				"geometry-b",
				"algebra-2a",
				"algebra-2b"
			].includes(id);
			const selfChecks = fullBlocks
				? [
						...item.content.matchAll(
							/\[(Check answers and reasoning|Project self-check)\]\(([^)]+)\)/g
						)
					].map(([, label, href]) => {
						const url = new URL(href, "https://example.invalid");
						const asset = url.searchParams.get("asset")!;
						const [path, anchor] = asset.split("#");
						const source = readFileSync(
							join(process.cwd(), "public", path),
							"utf8"
						);
						const section = source
							.split(/^## /m)
							.slice(1)
							.find(
								section =>
									section
										.split("\n", 1)[0]
										.toLowerCase()
										.replace(/[^a-z0-9\s-]/g, "")
										.trim()
										.replace(/\s+/g, "-") === anchor
							);
						expect(section, asset).toBeDefined();
						const container = document.createElement("div");
						container.innerHTML = markdown.render(
							section!.slice(section!.indexOf("\n") + 1).trim()
						);
						return {
							label,
							href,
							asset,
							heading: section!.split("\n", 1)[0].trim(),
							expectedText: container
								.textContent!.replace(/\s+/g, " ")
								.trim()
						};
					})
				: [];
			// These authored labels become separate headings in assignment cards.
			// Keep every body word while matching the displayed heading punctuation.
			let fullAssignment = fullBlocks
				? item.content
						.replace(/^\*\*(Goal|Steps):\*\*/gm, "**$1**")
						.replace(
							/^\*\*Extension:\*\*/gm,
							"**Optional · Extension**"
						)
				: item.content;
			if (
				[
					"algebra-1a",
					"algebra-1b",
					"early-elementary-a-math"
				].includes(id)
			) {
				const sections = lessonContentSections(
					item.content,
					item.contentKind ?? "assignment"
				);
				expect(
					sections.some(section => section.kind === "learn"),
					item.title
				).toBe(false);
				fullAssignment = sections
					.map(section => {
						const label =
							section.kind === "optional" &&
							section.label !== "Optional"
								? `Optional · ${section.label}`
								: section.label;
						return `### ${label}\n\n${section.content}`;
					})
					.join("\n\n");
			}
			const directive = item.content.match(
				/^(?:\*\*(?:Project )?goal:\*\*\s*)?([\s\S]+?)\s*\*\*Completion evidence:\*\*/i
			)?.[1];
			const container = document.createElement("div");
			container.innerHTML = markdown.render(
				normalizeInlineCourseMarkdown(
					directive ??
						([
							"early-elementary-a-math",
							"early-elementary-b-math",
							"late-elementary-a-math",
							"algebra-1a",
							"algebra-1b",
							"introduction-to-public-speaking",
							"intro-to-physics",
							"physics-level-2",
							"pre-algebra-a",
							"geometry-a",
							"geometry-b",
							"algebra-2a",
							"algebra-2b"
						].includes(id)
							? fullAssignment
							: "")
				)
			);
			return {
				id: item.id,
				title: item.title,
				learningPath: item.learningPath,
				selfChecks,
				directiveTextMode: fullBlocks ? "innerText" : "textContent",
				requiredDirective: container
					.textContent!.replace(/\s+/g, " ")
					.trim()
			};
		};
		const algebra = id === "algebra-2a" || id === "algebra-2b";
		const algebra1 = id === "algebra-1a" || id === "algebra-1b";
		const modules = course.modules
			.filter(
				module =>
					!module.internal &&
					(!(
						algebra ||
						algebra1 ||
						[
							"early-elementary-a-math",
							"early-elementary-b-math",
							"late-elementary-a-math"
						].includes(id)
					) ||
						module.kind !== "appendix")
			)
			.map(module => ({
				id: module.id,
				title: module.title,
				kind: module.kind ?? "module",
				readings: [...module.curriculum, ...module.supplementalProjects]
					.filter(isLessonLearningItem)
					.map(reading),
				projects: module.curriculum
					.filter(item => !isLessonLearningItem(item))
					.map(card),
				optional: module.supplementalProjects
					.filter(item => !isLessonLearningItem(item))
					.map(card)
			}));
		expect(modules.flatMap(module => module.readings)).toHaveLength(count);
		if (algebra1)
			expect(modules).toHaveLength(id === "algebra-1a" ? 21 : 25);
		else if (algebra)
			expect(modules).toHaveLength(id === "algebra-2a" ? 15 : 12);
		else
			expect(
				modules.filter(module => module.kind === "module")
			).toHaveLength(
				["geometry-a", "geometry-b"].includes(id)
					? 7
					: id === "pre-algebra-a"
						? 8
						: ["intro-to-physics", "physics-level-2"].includes(id)
							? 17
							: count
			);
		for (const module of modules) {
			if (id === "geometry-a")
				expect(module.readings, module.title).toHaveLength(
					module.title.startsWith("Check-In")
						? 0
						: module.title.startsWith("GEOA4")
							? 2
							: 1
				);
			else if (id === "geometry-b")
				expect(module.readings, module.title).toHaveLength(
					module.title.startsWith("Check-In #1")
						? 0
						: /^(?:GEOB3|GEOB5|GEOB7|GEOB9)/.test(module.title)
							? 2
							: 1
				);
			else if (id === "pre-algebra-a")
				expect(module.readings, module.title).toHaveLength(
					module.title === "Pre-Algebra A Kick-Off" ||
						module.title === "Check-In #1"
						? 0
						: /^(?:PAA3|PAA8|PAA13|PAA18)/.test(module.title)
							? 2
							: 1
				);
			else if (
				["intro-to-physics", "physics-level-2"].includes(id) &&
				module.kind === "appendix"
			)
				expect(module.readings.length, module.title).toBeGreaterThan(0);
			else if (id === "physics-level-2")
				expect(module.readings, module.title).toHaveLength(
					module.title.startsWith("PHY8 ") ? 2 : 1
				);
			else if (!algebra && !algebra1)
				expect(module.readings, module.title).toHaveLength(1);
			else if (algebra && module.readings.length === 0)
				expect(module.title).toMatch(/capstone/i);
			for (const reading of module.readings) {
				expect(
					reading.expectedText.length,
					module.title
				).toBeGreaterThan(150);
				expect(reading.paragraphBreaks, reading.title).toBe(
					intentionalMathLineBreaks[id]?.[reading.title] ?? 0
				);
			}
		}
		if (process.env.SELF_STUDY_BROWSER_PROOF_DIR) {
			const output = process.env.SELF_STUDY_BROWSER_PROOF_DIR;
			mkdirSync(output, { recursive: true });
			writeFileSync(
				join(output, `${id}-${role}.json`),
				JSON.stringify(
					{
						schemaVersion: 1,
						sourceCommit:
							process.env.GITHUB_SHA ??
							execFileSync("git", ["rev-parse", "HEAD"], {
								encoding: "utf8"
							}).trim(),
						id,
						role,
						publishedIdentities: published[id].items,
						restoredIdentities: additions.length,
						sourceProjects: sourceProjects.length,
						modules,
						reviewScope:
							"complete course reading and assignment view",
						internalModules: course.modules
							.filter(module => module.internal)
							.map(module => ({
								id: module.id,
								title: module.title
							})),
						referenceModules: course.modules
							.filter(
								module =>
									!module.internal &&
									module.kind === "appendix"
							)
							.map(module => ({
								id: module.id,
								title: module.title
							}))
					},
					null,
					2
				) + "\n"
			);
		}
	}
);
