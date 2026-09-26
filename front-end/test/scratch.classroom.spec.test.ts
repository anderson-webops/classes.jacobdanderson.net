import { describe, expect, it } from "vitest";
import {
	scratchFrameDocument,
	scratchDownloadName
} from "../src/modules/scratch/frame";
import { scratchLevel1ClassroomCourse } from "../src/stores/courses/scratch-level-1-classroom";

describe("Scratch classroom", () => {
	it("keeps a small, ordered core sequence and separate practice", () => {
		const projects = scratchLevel1ClassroomCourse.modules.flatMap(module =>
			module.curriculum.filter(item => item.projectLink)
		);
		expect(projects).toHaveLength(12);
		expect(projects[0].title).toBe("Two Arrows");
		expect(projects.at(-1)?.title).toBe("Build Your Collection Game");
		for (const project of projects) {
			expect(project.learningPath).toBe("core");
			expect(project.content).toContain("**Normal:**");
			expect(project.content).toContain("**Hard:**");
			expect(project.content).toContain("**Check:**");
			expect(project.projectLink).toMatch(
				/^\/ide\?mode=scratch&starter=[a-z-]+$/
			);
		}
	});
	it("limits frame resources to the editor and public Scratch assets", () => {
		const frame = scratchFrameDocument("https://example.test", "channel");
		expect(frame).toContain(
			"connect-src https://example.test/scratch-runtime/ https://assets.scratch.mit.edu;"
		);
		expect(frame).toContain("worker-src 'none'");
		expect(frame).toContain("form-action 'none'");
		expect(frame).not.toContain("/api/");
		expect(frame).toContain('data-channel="channel"');
	});
	it("creates reusable safe project filenames", () => {
		expect(scratchDownloadName("Robot dress-up")).toBe(
			"Robot dress-up.sb3"
		);
		expect(scratchDownloadName("a/b\\c\n")).toBe("a-b-c-.sb3");
		expect(scratchDownloadName("")).toBe("Scratch project.sb3");
	});
});
