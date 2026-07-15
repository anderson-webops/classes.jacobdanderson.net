import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";

describe("Python Level 1 first-days onboarding", () => {
	it("starts with the agreed show-play-explain sequence and guided IDE projects", async () => {
		const course = await loadRawCourse("python-level-1");
		expect(course).not.toBeNull();

		const firstModule = course!.modules[0];
		expect(firstModule.title).toBe("First 10 Days: Show, Play, Then Explain");
		expect(firstModule.curriculum.map(item => item.title)).toEqual([
			"Quick Start Project 1: Color Circle Art",
			"Quick Start Project 2: Picasso Keyboard Painter",
			"Debugging Habit: Read the First Red Squiggle",
			"Reflection: Name the Ideas After Play"
		]);
		expect(firstModule.curriculum[0]?.projectLink).toBe(
			"/ide?mode=turtle&template=circle-art"
		);
		expect(firstModule.curriculum[1]?.projectLink).toBe(
			"/ide?mode=turtle&template=picasso"
		);
		expect(firstModule.curriculum[0]?.content).toContain("Begin by pressing Run");
		expect(firstModule.curriculum[1]?.content).toContain("complete only the missing loop inside `draw_square()`");
		expect(firstModule.curriculum[2]?.content).toContain("first red squiggle or first error line");
		expect(firstModule.curriculum[3]?.content).toContain("continue into GrS1");
		expect(course!.modules[1]?.title).toBe("GrS1 Coordinates and Movement");
	});
});
