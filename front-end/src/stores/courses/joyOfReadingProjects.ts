import type { RawCourse, RawCourseModuleItem } from "./types";
import { joyOfReadingGuidance } from "./joyOfReadingGuidance";

function itemId(module: string, title: string, section = "curriculum") {
	return `early-elementary-a-reading-${module}-${section}-${title}`
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}
function sampleResponse(anchor: string) {
	const asset = `/course-assets/early-elementary-a-reading/practice-checks-v1.md#${anchor}`;
	return `[Project self-check](/course-resource?asset=${encodeURIComponent(asset)}&label=${encodeURIComponent("Sample response")})`;
}
export function applyJoyOfReadingGuidance(course: RawCourse, raw: RawCourse) {
	for (const original of raw.modules) {
		const material = joyOfReadingGuidance.find(
			unit => unit.module === original.title
		);
		const displayed = course.modules.find(
			module =>
				module.title.toLowerCase() === original.title.toLowerCase()
		);
		const reading = displayed?.curriculum[0];
		if (!material || !displayed || !reading) {
			throw new Error(
				`Missing Joy of Reading guidance: ${original.title}`
			);
		}
		const assignment = (
			item: RawCourseModuleItem,
			section = "curriculum"
		): RawCourseModuleItem => {
			const previous = [
				...displayed.curriculum,
				...displayed.supplementalProjects
			].find(row => row.title === item.title);
			return {
				...item,
				...previous,
				id:
					previous?.id ??
					item.id ??
					itemId(original.title, item.title, section),
				content:
					item.content.replace(/^\*\*Project goal:\*\*\s*/i, "") +
					(item.title === "Figurative Language Drawing Set"
						? `\n\n${sampleResponse(
								"figurative-language-drawing-set"
							)}`
						: ""),
				contentKind: "assignment",
				preserveInstructions: true,
				preserveAssignment: true
			};
		};
		const projects = original.curriculum.slice(1).map(item => ({
			...assignment(item),
			learningPath: "core" as const
		}));
		const projectIds = new Set(projects.map(item => item.id));
		reading.aliases = reading.aliases?.filter(
			alias => !projectIds.has(alias)
		);
		reading.content = `**Method**\n\n${material.method}\n\n**Worked example**\n\n${material.worked}`;
		reading.contentKind = "reading";
		reading.learningPath = "core";
		reading.preserveInstructions = true;
		displayed.curriculum = [reading, ...projects];
		displayed.supplementalProjects = original.supplementalProjects.map(
			item => {
				const practice = item.title.startsWith("Practice Map:");
				const challenge = item.title.startsWith("Extension Review:");
				if (!practice && !challenge)
					return assignment(item, "supplemental");
				const supplied = practice
					? material.practice
					: material.challenge;
				const previous = displayed.supplementalProjects.find(
					row => row.title === item.title
				);
				return {
					...item,
					...previous,
					content: `**Practice passage and task**\n\n${supplied.prompt}\n\n${sampleResponse(supplied.anchor)}`,
					contentKind: "assignment" as const,
					preserveInstructions: true,
					preserveAssignment: true
				};
			}
		);
	}
}
