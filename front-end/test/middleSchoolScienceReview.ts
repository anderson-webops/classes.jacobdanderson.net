import fs from "node:fs";
import type {
	RawCourseModule,
	RawCourseModuleItem
} from "@/stores/courses/types";
import { middleSchoolIntegratedScienceCourse } from "@/stores/courses/middle-school-integrated-science";
import { middleSchoolScienceGuidance } from "@/stores/courses/middleSchoolScienceGuidance";
import { slugMarkdownHeading } from "@/modules/courseAssetPreview";

// A short investigation depends on its exact prompt, taught method and real
// case/response sections. Truncated prompts or unrelated links do not qualify.
export function completeMiddleSchoolScienceActivity(
	courseId: string,
	module: RawCourseModule,
	item: RawCourseModuleItem
) {
	if (
		courseId !== "middle-school-integrated-science" ||
		item.contentKind !== "assignment" ||
		!item.preserveInstructions ||
		!item.preserveAssignment
	)
		return false;
	const originalModule = middleSchoolIntegratedScienceCourse.modules.find(
		candidate => candidate.title === module.title
	);
	const original =
		originalModule &&
		[
			...originalModule.curriculum,
			...originalModule.supplementalProjects
		].find(candidate => candidate.title === item.title);
	const guidance = middleSchoolScienceGuidance.find(
		unit => unit.module === module.title
	);
	if (
		!original ||
		original.content !== item.content ||
		!guidance ||
		!module.curriculum.some(
			reading =>
				reading.contentKind === "reading" &&
				reading.content.includes(guidance.method) &&
				reading.content.includes(guidance.worked)
		)
	)
		return false;
	for (const [label, asset] of [
		["Case inputs", originalModule!.curriculum[0].datasetLink],
		["Project self-check", originalModule!.curriculum[0].solutionLink]
	]) {
		if (!asset) return false;
		const expected = `[${label}](/course-resource?asset=${encodeURIComponent(asset)})`;
		if (!item.content.includes(expected)) return false;
		const [file, anchor] = asset.split("#");
		if (
			!file.startsWith("/course-assets/middle-school-science/") ||
			!anchor
		)
			return false;
		const section = fs
			.readFileSync("public" + file, "utf8")
			.split(/^## /m)
			.slice(1)
			.find(
				section =>
					slugMarkdownHeading(section.split("\n")[0]) === anchor
			);
		if (
			!section ||
			section.slice(section.indexOf("\n") + 1).trim().length < 100
		)
			return false;
	}
	return true;
}
