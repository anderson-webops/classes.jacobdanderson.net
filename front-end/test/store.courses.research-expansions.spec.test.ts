import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import {
	researchBackedExpansionCourseIds,
	researchBackedExpansionProfiles
} from "@/stores/courses/research-expansions";

const COURSE_SWEEP_TIMEOUT = 180000;

function allText(
	course: NonNullable<Awaited<ReturnType<typeof loadRawCourse>>>
) {
	return course.modules
		.flatMap(module => [
			module.title,
			...module.curriculum.flatMap(item => [item.title, item.content]),
			...module.supplementalProjects.flatMap(item => [
				item.title,
				item.content
			])
		])
		.join("\n");
}

function moduleText(
	module: NonNullable<
		Awaited<ReturnType<typeof loadRawCourse>>
	>["modules"][number]
) {
	return [
		module.title,
		...module.curriculum.flatMap(item => [item.title, item.content]),
		...module.supplementalProjects.flatMap(item => [
			item.title,
			item.content
		])
	].join("\n");
}

describe("research-backed course family expansions", () => {
	it("keeps research expansion profile lists deduplicated", () => {
		const listFields = [
			"gaps",
			"topics",
			"moduleAdditions",
			"projectTypes",
			"assessments",
			"materials"
		] as const;
		const failures: string[] = [];

		for (const [courseId, profile] of Object.entries(
			researchBackedExpansionProfiles
		)) {
			for (const field of listFields) {
				const normalized = profile[field].map(item =>
					item.trim().toLowerCase()
				);
				if (new Set(normalized).size === normalized.length) continue;

				failures.push(`${courseId}: ${field}`);
			}
		}

		expect(failures).toEqual([]);
	});

	it(
		"adds standards, sequencing, and project practice appendices to every audited course",
		async () => {
			expect(researchBackedExpansionCourseIds.length).toBeGreaterThan(35);

			for (const courseId of researchBackedExpansionCourseIds) {
				const course = await loadRawCourse(courseId);
				const profile = researchBackedExpansionProfiles[courseId];

				expect(course, courseId).not.toBeNull();
				expect(profile, courseId).toBeDefined();

				const referenceExpansionTitles = [
					"Standards Map",
					"Course Roadmap",
					"Project Practice Guide"
				];
				const titles = course!.modules.map(module => module.title);
				for (const title of referenceExpansionTitles) {
					expect(titles, courseId).toContain(title);
				}

				const expansionModules = course!.modules.filter(module =>
					referenceExpansionTitles.includes(module.title)
				);

				expect(expansionModules, courseId).toHaveLength(3);
				expect(
					expansionModules.every(
						module => module.kind === "appendix"
					),
					courseId
				).toBe(true);
				expect(
					expansionModules.every(
						module => module.curriculum.length >= 4
					),
					courseId
				).toBe(true);
				expect(
					expansionModules.every(
						module => module.supplementalProjects.length >= 2
					),
					courseId
				).toBe(true);

				const expansionText = expansionModules
					.map(moduleText)
					.join("\n");
				const courseLabel = course!.name.trim() || profile.family;
				expect(expansionText, courseId).toContain(
					`${courseLabel} Module Alignment Guide`
				);
				expect(expansionText, courseId).toContain(
					`${courseLabel} Reference Guide`
				);
				expect(expansionText, courseId).toContain(
					`${courseLabel} Prerequisite Map`
				);
				expect(expansionText, courseId).toContain(
					`${courseLabel} Resource Inventory`
				);
				const roadmapModule = expansionModules.find(
					module => module.title === "Course Roadmap"
				);
				expect(roadmapModule, courseId).toBeDefined();
				const roadmapText = moduleText(roadmapModule!);
				expect(roadmapText, courseId).toContain("**Map purpose:**");
				expect(roadmapText, courseId).toContain("**Map reading:**");
				expect(roadmapText, courseId).toContain(
					"**What the map clarifies:**"
				);
				expect(roadmapText, courseId).toContain(
					"**Inventory purpose:**"
				);
				expect(roadmapText, courseId).toContain(
					"**Inventory reading:**"
				);
				expect(roadmapText, courseId).not.toMatch(
					/\*\*Goal:\*\*\s+(?:Draw or write a prerequisite map|Build a resource inventory)/i
				);
				expect(roadmapText, courseId).not.toMatch(
					/\*\*(?:Map guidance|Inventory guidance|Checkpoints):\*\*/i
				);
				expect(roadmapText, courseId).not.toMatch(
					/\bmark each item as\b/i
				);
				expect(expansionText, courseId).not.toMatch(
					/\b(?:Readiness Checklist|Resource Updates|Dependency Graph|Resource Checklist)\b/
				);
				expect(expansionText, courseId).not.toMatch(
					/\*\*(?:Project goal|Required outcome|Completion checks|Readiness evidence):\*\*/
				);
				expect(expansionText, courseId).not.toMatch(
					/\*\*(?:Reference guide|Course connection|Sequence guidance|Project ladder|Course boundaries):\*\*/i
				);
				expect(expansionText, courseId).not.toMatch(
					/\b(?:source-backed|version-aware|hidden materials|learner-created|expected readiness level)\b/i
				);
				expect(expansionText, courseId).not.toMatch(
					/\*\*(?:Ready to practice|Ready when):\*\*/i
				);
			}
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("carries the researched standards, tooling, safety, and assessment anchors into course text", async () => {
		const courseIds = [
			"ai-level-1",
			"intro-to-chemistry",
			"c-level-1",
			"network-security",
			"machine-learning",
			"unity-game-development",
			"elementary-science"
		];
		const courses = await Promise.all(
			courseIds.map(courseId => loadRawCourse(courseId))
		);
		const corpus = courses
			.filter((course): course is NonNullable<typeof course> =>
				Boolean(course)
			)
			.map(allText)
			.join("\n");

		expect(corpus).toContain("NIST AI RMF");
		expect(corpus).toContain("ACS Chemistry Guidelines");
		expect(corpus).toContain("ISO C++ Core Guidelines");
		expect(corpus).toContain("OWASP Web Security Testing Guide");
		expect(corpus).toContain("scikit-learn Model Evaluation");
		expect(corpus).toContain("Unity Learn");
		expect(corpus).toContain("No physical supplies beyond paper");
		expect(corpus).toContain("Practice Project:");
		expect(corpus).toContain("AI Level 1 Checkpoints");
	});
});
