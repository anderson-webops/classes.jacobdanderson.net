import type { CourseModuleItem } from "@/stores/courses/types";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createPinia, setActivePinia } from "pinia";
import MarkdownIt from "markdown-it";
import { expect, it } from "vitest";
import published from "../../test/fixtures/catalog-published-identities.json";
import ventureAdditions from "../../test/fixtures/entrepreneurship-restored-core-identities.json";
import grammarAdditions from "../../test/fixtures/grammar-mechanics-restored-identities.json";
import literatureAdditions from "../../test/fixtures/middle-school-literature-restored-identities.json";
import writingAdditions from "../../test/fixtures/middle-school-writing-restored-identities.json";
import speakingAdditions from "../../test/fixtures/public-speaking-restored-identities.json";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { normalizeInlineCourseMarkdown } from "@/modules/courseMarkdown";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { algebra2ACourse } from "@/stores/courses/algebra-2a";
import { algebra2BCourse } from "@/stores/courses/algebra-2b";
import {
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
			const directive = item.content.match(
				/^(?:\*\*(?:Project )?goal:\*\*\s*)?([\s\S]+?)\s*\*\*Completion evidence:\*\*/i
			)?.[1];
			const container = document.createElement("div");
			container.innerHTML = markdown.render(
				normalizeInlineCourseMarkdown(directive ?? "")
			);
			return {
				id: item.id,
				title: item.title,
				learningPath: item.learningPath,
				requiredDirective: container
					.textContent!.replace(/\s+/g, " ")
					.trim()
			};
		};
		const algebra = id === "algebra-2a" || id === "algebra-2b";
		const modules = course.modules
			.filter(
				module =>
					!module.internal && (!algebra || module.kind !== "appendix")
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
		if (algebra)
			expect(modules).toHaveLength(id === "algebra-2a" ? 15 : 12);
		else
			expect(
				modules.filter(module => module.kind === "module")
			).toHaveLength(count);
		for (const module of modules) {
			if (!algebra) expect(module.readings, module.title).toHaveLength(1);
			else if (module.readings.length === 0)
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
