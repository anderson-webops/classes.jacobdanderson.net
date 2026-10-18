import type { RawCourse } from "./types";
import reading from "../../assets/course-guides/rust-typed-errors.md?raw";
import {
	rustTypedErrorsItemIds,
	rustTypedErrorsModuleId,
	rustTypedErrorsPack,
	rustTypedErrorsRevision
} from "../../modules/rustProjectResources";

const activities = [
	{
		kind: "core",
		section: "curriculum",
		match: /Core Project:/,
		title: "Typed Record Parser",
		path: "core",
		task: "Replace the numeric-status parser with RecordKind, Record and five ParseError variants while preserving the A:17 grammar, error priority and public CLI behavior. Complete CORE, ERROR TABLE, PREDICT, CHECKS and LIMITS; retain the meaning of the eight tests when adapting their return-type assertions."
	},
	{
		kind: "workflow",
		section: "supplementalProjects",
		match: /Option and Result Audit Tool/,
		title: "Project: Absence and Indexed Errors",
		path: "core",
		task: "Continue the same saved typed parser and complete ABSENCE. Replace the first-record tuple marker with Result<Option<Record>, RowError>. Preserve valid zero, absence, the first rejected candidate and its index; explain ok_or, map_err and error propagation."
	},
	{
		kind: "choice",
		section: "supplementalProjects",
		match: /Transfer Practice/,
		title: "Collect Every Candidate",
		path: "choice",
		task: "Continue the saved refactor and complete CHOICE. Refactor all_records into ordered typed successes and indexed failures. Add a named mixed-row test with a new order and prove that one error does not stop later rows."
	},
	{
		kind: "challenge",
		section: "supplementalProjects",
		match: /Extension Practice/,
		title: "Typed Error and Display Boundaries",
		path: "challenge",
		task: "Continue the saved refactor and complete CHALLENGE. Predict E0004, E0277 and E0308 and compare their paired fixes. Add new grammar-priority and fake-marker display tests; explain what the types enforce and what the parser must still validate."
	}
] as const;

export function applyRustTypedErrorsCourseWorkflows(
	course: RawCourse,
	courseId: string
) {
	if (courseId !== "rust-systems-security") return;
	const module = course.modules.find(item => item.title.startsWith("RSS3 "));
	if (!module) return;
	module.id = rustTypedErrorsModuleId;
	const concepts = module.curriculum.find(item =>
		item.title.endsWith("Core Concepts")
	);
	if (concepts) {
		concepts.content = [
			reading.split("## Build and run")[0].trim(),
			"## Public contracts",
			"| Function | Input | Result |\n| --- | --- | --- |\n| `parse_record` | `&str` | `Result<Record, ParseError>` |\n| `first_record` | `&[&str]` | `Result<Option<Record>, RowError>` |\n| `all_records` | `&[&str]` | `Vec<Result<Record, RowError>>` |"
		].join("\n\n");
		concepts.preserveInstructions = true;
	}
	const review = module.curriculum.find(item =>
		item.title.startsWith("Verification Review:")
	);
	if (review) {
		review.content =
			"Check the A:17 grammar against valid zero, the exact u16 maximum, one over the maximum, all five error classes, leading zeros and trailing data. Distinguish no candidate from a rejected candidate; preserve the selected row index and compare first-candidate versus all-row behavior. Record the actual public error code and caller action without repeating submitted text. After cargo clean, repeat the tests and compare stdout, stderr and exit status. Explain why matching CLI output alone does not prove the library uses typed return values.";
		review.preserveInstructions = true;
	}

	for (const activity of activities) {
		const item = module[activity.section].find(candidate =>
			activity.match.test(candidate.title)
		);
		if (!item) continue;
		item.id = rustTypedErrorsItemIds[activity.kind];
		item.title = activity.title;
		item.learningPath = activity.path;
		item.content = `${activity.task}\n\n${reading.trim()}`;
		item.preserveInstructions = true;
		const root = `https://github.com/instruction-material/Low-Level-Security/tree/${rustTypedErrorsRevision}/${rustTypedErrorsPack}`;
		item.projectLink = `${root}/starter`;
		item.solutionLink = `${root}/solution`;
		item.ideImport = true;
	}
}
