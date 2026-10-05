import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it, vi } from "vitest";
import { useCoursesStore } from "@/stores/courses";

const fixture = vi.hoisted(() => ({ content: "" }));
vi.mock("@/stores/courses/index", () => ({
	courseCatalog: [],
	loadRawCourse: async () => ({
		name: "Code formatting fixture",
		modules: [
			{
				title: "Supplied example",
				curriculum: [
					{ title: "Complete program", content: fixture.content }
				],
				supplementalProjects: []
			}
		]
	})
}));

let fixtureIndex = 0;
async function display(content: string) {
	fixture.content = content;
	setActivePinia(createPinia());
	const course = await useCoursesStore().loadCourseById(
		`code-formatting-fixture-${fixtureIndex++}`
	);
	return course!.modules[0].curriculum[0].content;
}

describe("course code-block formatting", () => {
	it("preserves Python indentation and blank lines through student display", async () => {
		const program =
			"```python\ndef greet():\n    first = 'hello'\n\n    second = 'world'\n    return first + second\n```";
		expect(
			await display(
				`Trace this complete program.\n\n${program}\n\nCompare the result.`
			)
		).toContain(program);
	});

	it("keeps note-like code strings while removing instructor prose notes", async () => {
		const program =
			"```python\ndef label():\n    return 'Instructor note is sample data'\n\n    # This later line remains in the supplied program.\n```";
		const content = await display(
			`Instructor note: hidden facilitator guidance.\n\n${program}\n\nRead the example.`
		);
		expect(content).toContain(program);
		expect(content).not.toContain("hidden facilitator guidance");
	});

	it("supports matching tilde fences and longer fences around literal backticks", async () => {
		for (const program of [
			"~~~python\ndef value():\n\n    return 2\n~~~~",
			"````text\n```python\n\n    literal indented example\n```\n````"
		])
			expect(await display(program)).toBe(program);
	});
});
