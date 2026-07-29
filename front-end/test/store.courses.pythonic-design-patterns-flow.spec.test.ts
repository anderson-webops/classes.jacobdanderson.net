import { describe, expect, it } from "vitest";
import { pythonicDesignPatternsCourse } from "@/stores/courses/pythonic-design-patterns";

const EXPECTED_SEQUENCE = [
	"PDP0 Setup and Tooling",
	"PDP1 Why Python Changes the Design-Patterns Conversation",
	"PDP2 Design Foundations in Python",
	"PDP3 Strategy Without Ceremony",
	"PDP4 Factory and Builder in Python",
	"PDP5 Observer, Events, and Callbacks",
	"PDP6 Decorator, Proxy, and Facade",
	"PDP7 State and Command",
	"PDP8 Adapter and Integration Boundaries",
	"PDP9 Template Method versus Higher-Order Functions",
	"PDP10 Singleton, Global State, and Module Patterns",
	"PDP11 Refactoring Python Code Smells",
	"PDP12 Capstone Pythonic Refactor Studio"
];

function requireModule(title: string) {
	const module = pythonicDesignPatternsCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) {
		throw new Error(`Expected Pythonic Design Patterns module ${title}.`);
	}
	return module;
}

function moduleText(title: string) {
	const module = requireModule(title);
	return [...module.curriculum, ...module.supplementalProjects]
		.map(item => `${item.title}\n${item.content}`)
		.join("\n");
}

function courseText() {
	return pythonicDesignPatternsCourse.modules
		.map(module => `${module.title}\n${moduleText(module.title)}`)
		.join("\n");
}

function resourceText() {
	return pythonicDesignPatternsCourse.modules
		.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		])
		.flatMap(item => [
			item.projectLink,
			item.solutionLink,
			item.datasetLink,
			item.mediaLink
		])
		.filter(Boolean)
		.join("\n");
}

describe("Pythonic Design Patterns learner flow", () => {
	it("uses a thirteen-stage Python-first design and refactoring sequence", () => {
		expect(
			pythonicDesignPatternsCourse.modules.map(module => module.title)
		).toEqual(EXPECTED_SEQUENCE);
	});

	it("gives every stage pacing, milestones, and explicit learning paths", () => {
		for (const module of pythonicDesignPatternsCourse.modules) {
			expect(module.estimatedTime, module.title).toMatch(/session/);
			expect(
				module.keyBlocks?.length,
				module.title
			).toBeGreaterThanOrEqual(6);
			expect(
				module.curriculum.every(item => item.learningPath === "core"),
				module.title
			).toBe(true);
			expect(
				module.supplementalProjects.every(item =>
					["choice", "challenge"].includes(item.learningPath ?? "")
				),
				module.title
			).toBe(true);
			expect(module.curriculum[0]?.content, module.title).toContain(
				"**Course flow:**"
			);
		}
	});

	it("preserves every original project and option", () => {
		const curriculumTitles = pythonicDesignPatternsCourse.modules.flatMap(
			module => module.curriculum.map(item => item.title)
		);
		const optionTitles = pythonicDesignPatternsCourse.modules.flatMap(
			module => module.supplementalProjects.map(item => item.title)
		);

		expect(curriculumTitles).toHaveLength(84);
		expect(optionTitles).toHaveLength(38);
		for (const title of [
			"PDP0 Setup and Tooling: Core Project",
			"PDP3 Strategy Without Ceremony: Core Project",
			"PDP8 Adapter and Integration Boundaries: Core Project",
			"PDP12 Capstone Pythonic Refactor Studio: Core Project",
			"Pattern Journal: Setup and Tooling",
			"Project: Strategy Rulebook",
			"Project: Adapter and Import Pipeline",
			"Capstone Pythonic Refactor Studio Extension Practice"
		]) {
			const collection = title.startsWith("PDP")
				? curriculumTitles
				: optionTitles;
			expect(collection, title).toContain(title);
		}
	});

	it("establishes a reproducible Python 3.14 engineering baseline", () => {
		const setup = moduleText("PDP0 Setup and Tooling");

		expect(setup).toContain("Python 3.14");
		expect(setup).toContain("python -m unittest discover -s tests");
		expect(setup).toContain("python -m compileall");
		expect(setup).toContain("static type checker");
		expect(setup).toContain("green unedited baseline");
		expect(resourceText()).toContain(
			"docs.python.org/3.14/library/unittest.html"
		);
	});

	it("uses Python features before class-heavy pattern machinery", () => {
		const foundations = moduleText("PDP2 Design Foundations in Python");
		const creation = moduleText("PDP4 Factory and Builder in Python");
		const wrappers = moduleText("PDP6 Decorator, Proxy, and Facade");
		const text = courseText();

		for (const feature of [
			"a pure function",
			"a closure",
			"a callable object",
			"a dictionary registry",
			"a `Protocol`",
			"a context manager",
			"a module boundary"
		]) {
			expect(text, feature).toContain(feature);
		}
		expect(foundations).toContain(
			"`runtime_checkable` protocol verifies only attribute presence"
		);
		expect(foundations).toContain("`default_factory`");
		expect(foundations).toContain("avoid `unsafe_hash`");
		expect(creation).toContain("importlib.metadata.entry_points()");
		expect(creation).toContain(
			"zero, one, multiple, duplicate, and broken"
		);
		expect(wrappers).toContain("`functools.wraps`");
		expect(wrappers).toContain("`ExitStack`");
	});

	it("makes callback, state, integration, and module lifecycles explicit", () => {
		const observer = moduleText("PDP5 Observer, Events, and Callbacks");
		const command = moduleText("PDP7 State and Command");
		const adapter = moduleText("PDP8 Adapter and Integration Boundaries");
		const globalState = moduleText(
			"PDP10 Singleton, Global State, and Module Patterns"
		);

		expect(observer).toContain("`weakref.WeakMethod`");
		expect(observer).toContain("removal during publication");
		expect(observer).toContain("owns every created task");
		expect(observer).toContain("ordering, cancellation, backpressure");
		expect(command).toContain("do not close over mutable state");
		expect(command).toContain("bounded history policy");
		expect(adapter).toContain("unknown-version");
		expect(adapter).toContain(
			"Translate vendor exceptions into domain errors"
		);
		expect(globalState).toContain("cached module state");
		expect(globalState).toContain("`ContextVar`");
		expect(globalState).toContain("token reset");
	});

	it("makes refactoring test-backed, measurable, and reversible", () => {
		const refactor = moduleText("PDP11 Refactoring Python Code Smells");
		const capstone = moduleText("PDP12 Capstone Pythonic Refactor Studio");
		const resources = resourceText();

		expect(refactor).toContain(
			"one named behavior-preserving transformation per commit"
		);
		expect(refactor).toContain("cannot be rolled back independently");
		expect(refactor).toContain(
			"A bug fix or feature follows a separately named test and commit"
		);
		expect(capstone).toContain("two realistic change scenarios");
		expect(capstone).toContain("before-and-after measurements");
		expect(capstone).toContain("pattern deliberately not used");
		expect(capstone).toContain("clear rollback point");
		expect(resources).toContain("docs.python.org/3.14/library/typing.html");
		expect(resources).toContain(
			"docs.python.org/3.14/library/contextlib.html"
		);
		expect(resources).toContain(
			"docs.python.org/3.14/library/importlib.metadata.html"
		);
		expect(resources).toContain(
			"docs.python.org/3.14/library/contextvars.html"
		);
	});
});
