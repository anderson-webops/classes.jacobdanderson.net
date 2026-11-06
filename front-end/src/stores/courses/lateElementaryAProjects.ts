import type { RawCourse } from "./types";
import { lateElementaryAMaterials } from "./lateElementaryAMaterials";

function itemId(module: string, title: string) {
	return `late-elementary-a-math-${module}-curriculum-${title}`
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

function selfCheck(anchor: string) {
	const asset = `/course-assets/late-elementary-a/practice-checks-v1.md#${anchor}`;
	return `[Project self-check](/course-resource?asset=${encodeURIComponent(asset)}&label=${encodeURIComponent("Practice self-check")})`;
}

export function applyLateElementaryAProjects(
	course: RawCourse,
	raw: RawCourse
) {
	for (const original of raw.modules) {
		const code = original.title.startsWith("Check-in #")
			? `check-${original.title.slice(-1)}`
			: original.title.split(" ")[0];
		const material = lateElementaryAMaterials.find(
			unit => unit.code === code
		);
		const displayed = course.modules.find(
			module =>
				module.title.toLowerCase() === original.title.toLowerCase()
		);
		const reading = displayed?.curriculum[0];
		if (!material || !displayed || !reading)
			throw new Error(`Missing Late Elementary A material ${code}`);
		const projects = original.curriculum.slice(1).map(item => {
			const supplied = material.tasks.find(
				task => task.title === item.title
			);
			if (!supplied) {
				throw new Error(
					`Missing elementary project inputs: ${item.title}`
				);
			}
			const previous = displayed.curriculum.find(
				row => row.title === item.title
			);
			return {
				...item,
				...previous,
				id:
					previous?.id ??
					item.id ??
					itemId(original.title, item.title),
				content: supplied
					? `**Problems**\n\n${supplied.prompt}\n\n${selfCheck(supplied.anchor)}`
					: item.content,
				contentKind: "assignment" as const,
				learningPath: "core" as const,
				preserveAssignment: true,
				preserveInstructions: true
			};
		});
		const projectIds = new Set(projects.map(item => item.id));
		reading.aliases = reading.aliases?.filter(
			alias => !projectIds.has(alias)
		);
		reading.contentKind = "reading";
		reading.learningPath = "core";
		reading.preserveInstructions = true;
		reading.content = `**Method**\n\n${material.method}\n\n**Worked example**\n\n${material.worked}`;
		displayed.curriculum = [reading, ...projects];
		if (displayed.supplementalProjects.length !== 2) {
			throw new Error(
				`Unexpected elementary optional activities: ${code}`
			);
		}
		displayed.supplementalProjects.forEach((item, index) => {
			const task = index === 0 ? material.practice : material.challenge;
			item.content = `**Problems**\n\n${task.prompt}\n\n${selfCheck(task.anchor)}`;
			item.contentKind = "assignment";
			item.preserveAssignment = true;
			item.preserveInstructions = true;
		});
	}
}
