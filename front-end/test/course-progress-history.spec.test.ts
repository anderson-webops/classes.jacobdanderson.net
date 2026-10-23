import { describe, expect, it } from "vitest";
import { unmatchedCourseProgress } from "@/modules/courseProgressHistory";

const course = {
	id: "pre-algebra-b",
	name: "Pre-Algebra B",
	modules: [
		{
			id: "pre-algebra-b-reference-archive",
			aliases: ["pre-algebra-b-source-activity-archive"],
			title: "Reference Archive",
			curriculum: [
				{
					id: "pre-algebra-b-reference-map",
					aliases: ["pre-algebra-b-old-reference-map"],
					title: "Reference Map",
					content: ""
				}
			],
			supplementalProjects: []
		}
	]
};

describe("unmatched course progress", () => {
	it("keeps retired completions distinct from mapped archive progress", () => {
		const progress = {
			courseId: "pre-algebra-b",
			completedModuleIds: [
				"pre-algebra-b-source-activity-archive",
				"pre-algebra-b-retired-module"
			],
			completedItemIds: [
				"pre-algebra-b-old-reference-map",
				"pre-algebra-b-source-activity-archive-supplemental-checkpoint-source-activity-archive",
				"pre-algebra-b-source-activity-archive-supplemental-transfer-practice-source-activity-archive"
			]
		};

		expect(unmatchedCourseProgress(course, progress)).toEqual([
			{ id: "pre-algebra-b-retired-module", kind: "module" },
			{
				id: "pre-algebra-b-source-activity-archive-supplemental-checkpoint-source-activity-archive",
				kind: "item"
			},
			{
				id: "pre-algebra-b-source-activity-archive-supplemental-transfer-practice-source-activity-archive",
				kind: "item"
			}
		]);
		const wrongCourse = { ...progress, courseId: "pre-algebra-a" };
		expect(unmatchedCourseProgress(course, wrongCourse)).toEqual([]);
	});
});
