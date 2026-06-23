import { describe, expect, it } from "vitest";
import {
	cleanCourseStatusMap,
	groupCoursesByLearnerStatus,
	orderedCoursesByLearnerStatus
} from "@/modules/courseAccess";

const courses = [
	{ id: "python-level-1", name: "Python Level 1" },
	{ id: "ap-computer-science-a", name: "AP Computer Science A" },
	{ id: "intro-to-chemistry", name: "Intro to Chemistry" },
	{ id: "python-level-3", name: "Python Level 3" }
];

describe("course access grouping", () => {
	it("groups viewable courses as current first, then past, then other available courses", () => {
		const groups = groupCoursesByLearnerStatus(
			courses,
			{
				courseAccess: [
					"intro-to-chemistry",
					"python-level-1",
					"ap-computer-science-a"
				],
				courseStatus: {
					"python-level-1": "past",
					"intro-to-chemistry": "current",
					"ap-computer-science-a": "available"
				}
			},
			{ includeOther: true }
		);

		expect(groups.map(group => group.label)).toEqual([
			"Current courses",
			"Past courses",
			"Other available courses"
		]);
		expect(
			groups.map(group => group.courses.map(course => course.id))
		).toEqual([
			["intro-to-chemistry"],
			["python-level-1"],
			["ap-computer-science-a", "python-level-3"]
		]);
	});

	it("defaults legacy assigned courses without status metadata to current", () => {
		expect(
			orderedCoursesByLearnerStatus(courses, {
				courseAccess: ["ap-computer-science-a"],
				courseStatus: undefined
			}).map(course => course.id)
		).toEqual(["ap-computer-science-a"]);
	});

	it("keeps assigned courses current when a legacy status map is partial", () => {
		const groups = groupCoursesByLearnerStatus(courses, {
			courseAccess: [
				"python-level-1",
				"ap-computer-science-a",
				"intro-to-chemistry"
			],
			courseStatus: {
				"python-level-1": "past"
			}
		});

		expect(groups.map(group => group.label)).toEqual([
			"Current courses",
			"Past courses"
		]);
		expect(
			groups.map(group => group.courses.map(course => course.id))
		).toEqual([
			["ap-computer-science-a", "intro-to-chemistry"],
			["python-level-1"]
		]);
	});

	it("treats invalid saved course status values as current access", () => {
		const groups = groupCoursesByLearnerStatus(courses, {
			courseAccess: ["ap-computer-science-a", "python-level-3"],
			courseStatus: {
				"ap-computer-science-a": "unexpected" as any,
				"python-level-3": "available"
			}
		});

		expect(groups.map(group => group.label)).toEqual([
			"Current courses",
			"Other available courses"
		]);
		expect(
			groups.map(group => group.courses.map(course => course.id))
		).toEqual([["ap-computer-science-a"], ["python-level-3"]]);
	});

	it("keeps saved status maps scoped to currently viewable courses", () => {
		expect(
			cleanCourseStatusMap(["python-level-1"], {
				"python-level-1": "past",
				"ap-computer-science-a": "past",
				"intro-to-chemistry": "unexpected"
			})
		).toEqual({
			"python-level-1": "past"
		});
	});

	it("preserves explicitly available status for assigned view-only courses", () => {
		expect(
			cleanCourseStatusMap(
				["ap-computer-science-a", "intro-to-chemistry"],
				{
					"ap-computer-science-a": "available",
					"intro-to-chemistry": "current"
				}
			)
		).toEqual({
			"ap-computer-science-a": "available",
			"intro-to-chemistry": "current"
		});
	});
});
