import type { CourseProgress } from "@/stores/app";
import type { CourseDefinition } from "@/stores/courses";

export type HistoricalProgressKind = "module" | "item";

export interface HistoricalProgressEntry {
	id: string;
	kind: HistoricalProgressKind;
}

export function unmatchedCourseProgress(
	course: CourseDefinition | null,
	progress: CourseProgress | null
): HistoricalProgressEntry[] {
	if (!course || !progress || course.id !== progress.courseId) return [];

	const knownModules = new Set(
		course.modules.flatMap(module => [
			module.id,
			...(module.aliases ?? []).filter(alias =>
				alias.startsWith(`${course.id}-`)
			)
		])
	);
	const knownItems = new Set(
		course.modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects].flatMap(
				item => [
					item.id,
					...(item.aliases ?? []).filter(alias =>
						alias.startsWith(`${course.id}-`)
					)
				]
			)
		)
	);

	return [
		...[...new Set(progress.completedModuleIds ?? [])]
			.filter(id => !knownModules.has(id))
			.map(id => ({ id, kind: "module" as const })),
		...[...new Set(progress.completedItemIds ?? [])]
			.filter(id => !knownItems.has(id))
			.map(id => ({ id, kind: "item" as const }))
	];
}
