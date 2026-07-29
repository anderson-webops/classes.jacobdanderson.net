import { describe, expect, it } from "vitest";
import { grammarMechanicsCourse } from "@/stores/courses/source-library-courses";

const EXPECTED_MODULE_SEQUENCE = [
	"MSC1 Nouns, Pronouns & Adjectives",
	"MSC2 Verbs, Adverbs & Verbals",
	"MSC3 Prepositions & Interjections",
	"MSC4 Coordinating & Subordinating Conjunctions",
	"MSC Check-In #1",
	"MSC5 Capitalization",
	"MSC6 Periods, Question Marks, Exclamation Points & Quotation Marks",
	"MSC7 Phrases & Clauses I",
	"MSC8 Commas",
	"MSC9 Semicolons",
	"MSC10 Colons",
	"MSC11 Common Punctuation Errors",
	"MSC12 Pauses & Breaks",
	"MSC Check-In #2",
	"MSC13 Subjects & Predicates",
	"MSC14 Direct & Indirect Objects",
	"MSC15 Phrases & Clauses II",
	"MSC16 Sentence Types",
	"MSC Check-In #3",
	"MSC17 Master Project"
];

function requireModule(title: string) {
	const module = grammarMechanicsCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Grammar module ${title}.`);
	return module;
}

describe("Middle School C Grammar and Mechanics learner flow", () => {
	it("keeps parts of speech, mechanics, and syntax in cumulative phases", () => {
		expect(
			grammarMechanicsCourse.modules.map(module => module.title)
		).toEqual(EXPECTED_MODULE_SEQUENCE);
		expect(EXPECTED_MODULE_SEQUENCE.indexOf("MSC Check-In #1")).toBe(
			EXPECTED_MODULE_SEQUENCE.indexOf("MSC5 Capitalization") - 1
		);
		expect(EXPECTED_MODULE_SEQUENCE.indexOf("MSC Check-In #2")).toBe(
			EXPECTED_MODULE_SEQUENCE.indexOf("MSC13 Subjects & Predicates") - 1
		);
	});

	it("gives every module pacing, grammar targets, and explicit paths", () => {
		for (const module of grammarMechanicsCourse.modules) {
			expect(module.estimatedTime, module.title).toMatch(/session/);
			expect(
				module.keyBlocks?.length,
				module.title
			).toBeGreaterThanOrEqual(5);
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

	it("moves explicitly extra practice out of the required path", () => {
		expect(
			requireModule("MSC8 Commas").supplementalProjects.find(
				item => item.title === "More Practice with Commas"
			)?.learningPath
		).toBe("choice");
		expect(
			requireModule("MSC16 Sentence Types").supplementalProjects.find(
				item => item.title === "More Practice with Sentence Types"
			)?.learningPath
		).toBe("choice");
		expect(
			requireModule("MSC8 Commas").curriculum.some(
				item => item.title === "More Practice with Commas"
			)
		).toBe(false);
	});

	it("preserves source work and makes the master project a choice", () => {
		const requiredCount = grammarMechanicsCourse.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const optionCount = grammarMechanicsCourse.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);
		const masterProject = requireModule("MSC17 Master Project");

		expect(requiredCount).toBe(50);
		expect(optionCount).toBe(44);
		expect(masterProject.curriculum.map(item => item.title)).toEqual([
			"Concepts: Master Project",
			"Grammar Master Project Path and Evidence Plan"
		]);
		expect(
			masterProject.supplementalProjects
				.filter(item =>
					[
						"Grammar and Mechanics Presentation",
						"Personal Narrative Mechanics Portfolio"
					].includes(item.title)
				)
				.every(item => item.learningPath === "choice")
		).toBe(true);
	});

	it("supports cumulative revision without requiring personal disclosure", () => {
		expect(
			requireModule("MSC1 Nouns, Pronouns & Adjectives").curriculum[0]
				?.content
		).toContain("cumulative edit log");
		expect(
			requireModule("MSC17 Master Project").supplementalProjects.find(
				item => item.title === "Personal Narrative Mechanics Portfolio"
			)?.content
		).toContain("personal, adapted, or fictional narrative");
		expect(
			requireModule("MSC17 Master Project").curriculum[0]?.content
		).toContain("public posting are not required");
	});
});
