import type { RawCourse } from "./types";

export function applyScratchConceptReadings(
	course: RawCourse,
	courseId: string,
	source: RawCourse
) {
	if (!["scratch-level-1", "scratch-level-2"].includes(courseId)) return;
	for (const module of course.modules) {
		const sourceModule = source.modules.find(
			candidate =>
				candidate.id === module.id || candidate.title === module.title
		);
		if (!sourceModule) continue;
		const readings = sourceModule.curriculum.filter(
			item =>
				item.contentKind === "reading" &&
				!item.projectLink &&
				!item.ideImport
		);
		for (const item of module.curriculum) {
			const identities = new Set([item.id, ...(item.aliases ?? [])]);
			const matched = readings.filter(
				reading =>
					(reading.id && identities.has(reading.id)) ||
					reading.title === item.title
			);
			if (!matched.length) continue;
			item.contentKind = "reading";
			item.content =
				matched.length === 1
					? matched[0].content
					: matched
							.map(
								reading =>
									`### ${reading.title}\n\n${reading.content}`
							)
							.join("\n\n");
		}
	}
}
