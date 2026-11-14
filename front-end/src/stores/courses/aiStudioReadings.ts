import type { RawCourse } from "./types";
import { formatAuthoredReading } from "./authoredReading";

export function applyAiStudioReadings(course: RawCourse, source: RawCourse) {
	const authored = source.modules
		.flatMap(module => module.curriculum)
		.filter(
			item =>
				item.contentKind === "reading" &&
				item.title.endsWith(": Guided Example")
		);
	for (const original of authored) {
		const item = course.modules
			.flatMap(module => module.curriculum)
			.find(
				candidate =>
					candidate.title === original.title ||
					candidate.aliases?.includes(original.title)
			);
		if (!item)
			throw new Error(`Missing AI studio reading: ${original.title}`);
		item.content = formatAuthoredReading(original.content);
		item.contentKind = "reading";
		item.preserveInstructions = true;
	}
}
