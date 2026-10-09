import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { loadRawCourse } from "@/stores/courses/index";
import { describe, expect, it } from "vitest";
import { createPythonIdeProject } from "@/modules/pythonIde";
import { courseReferenceExamples } from "@/modules/courseReferenceExamples";
import { classroomReferenceItem } from "@/stores/courses/classroomReferenceGuides";

describe("independent course references", () => {
	for (const kind of ["events", "melody", "records"] as const) {
		it(`creates a separate ${kind} project from its linked template`, () => {
			const item = classroomReferenceItem(kind);
			const url = new URL(item.projectLink!, "https://classes.local");
			const template = url.searchParams.get(
				"template"
			) as keyof typeof courseReferenceExamples;
			const mode =
				kind === "events"
					? "pgzero"
					: kind === "melody"
						? "python"
						: "java";
			const first = createPythonIdeProject(mode, { template });
			const second = createPythonIdeProject(mode, { template });
			expect(first.files).toEqual(courseReferenceExamples[template]);
			expect(first._id).not.toBe(second._id);
			first.files[0].content = "saved learner experiment";
			expect(second.files[0].content).toBe(
				courseReferenceExamples[template][0].content
			);
			expect(item.learningPath).toBe("choice");
		});
	}

	for (const [courseId, kind] of [
		["pygames", "events"],
		["pygames-classroom", "events"],
		["python-level-2", "melody"],
		["python-level-2-classroom", "melody"],
		["java-level-3", "records"]
	] as const) {
		it(`keeps the separate ${kind} reference import in ${courseId}`, async () => {
			const course = await loadRawCourse(courseId);
			const reference = classroomReferenceItem(kind);
			const item = course!.modules
				.flatMap(module => [
					...module.curriculum,
					...module.supplementalProjects
				])
				.find(item => item.id === reference.id);
			expect(item).toBeDefined();
			expect(item!.learningPath).toBe("choice");
			expect(item!.projectLink).toBe(reference.projectLink);
			expect(item!.datasetLink).toBe(reference.datasetLink);
			expect(item!.content).toContain("**Verification:**");
		});
	}

	it("verifies the actual examples against independent outcomes", () => {
		const script = resolve("test/verify-course-reference-examples.py");
		const result = spawnSync("python3", [script], {
			encoding: "utf8",
			timeout: 90_000
		});
		expect(result.error).toBeUndefined();
		expect(result.status, result.stdout + result.stderr).toBe(0);
	}, 100_000);
});
