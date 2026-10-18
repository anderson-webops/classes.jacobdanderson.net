import type { RawCourse } from "./types";
import reading from "../../assets/course-guides/rust-borrowing.md?raw";
import {
	rustBorrowingItemIds,
	rustBorrowingModuleId,
	rustBorrowingPack,
	rustBorrowingRevision
} from "../../modules/rustProjectResources";

// Preserve the imported source; state the target directly in course prose.
const courseReading = reading.replace("should contain", "contains");

const activities = [
	{
		kind: "core",
		section: "curriculum",
		match: /Core Project:/,
		title: "Borrowed Records and Lifetimes",
		path: "core",
		task: "Refactor OwnedRecord into RecordView with input-backed string slices while preserving the two-field schema and deliberate owned result. Complete CORE, BORROW MAP, PREDICT, CHECKS and LIMITS; replace the owned-field contract test with a borrowed-view test and retain the other six tests."
	},
	{
		kind: "workflow",
		section: "supplementalProjects",
		match: /Borrowing and Aliasing Lab/,
		title: "Project: Last Use and Exclusive Mutation",
		path: "core",
		task: "Continue the same saved borrowed record project. Complete MUTATION: preserve the field-use-after-normalization refusal, identify the last shared use and repair the ordering without copied fields. Verify the standard and empty-field cases."
	},
	{
		kind: "choice",
		section: "supplementalProjects",
		match: /Transfer Practice/,
		title: "Independent Selector Input",
		path: "choice",
		task: "Continue the saved refactor and complete CHOICE. Add the borrowed field selector for name, role and unknown keys. Add named tests with a short-lived key and a longer-lived record, and explain why the output lifetime follows the record data."
	},
	{
		kind: "challenge",
		section: "supplementalProjects",
		match: /Extension Practice/,
		title: "Four Borrowing Compiler Boundaries",
		path: "challenge",
		task: "Continue the saved refactor and complete CHALLENGE. Predict and capture E0502, E0499, E0515 and E0106 and compare each paired fix. Add named tests with a different odd slice length and new wrapping values; explain the disjoint ranges and the limits of the observed evidence."
	}
] as const;

export function applyRustBorrowingCourseWorkflows(
	course: RawCourse,
	courseId: string
) {
	if (courseId !== "rust-systems-security") return;
	const module = course.modules.find(item => item.title.startsWith("RSS2 "));
	if (!module) return;
	module.id = rustBorrowingModuleId;
	for (const activity of activities) {
		const item = module[activity.section].find(candidate =>
			activity.match.test(candidate.title)
		);
		if (!item) continue;
		item.id = rustBorrowingItemIds[activity.kind];
		item.title = activity.title;
		item.learningPath = activity.path;
		item.content = `${activity.task}\n\n${courseReading.trim()}`;
		item.preserveInstructions = true;
		const root = `https://github.com/instruction-material/Low-Level-Security/tree/${rustBorrowingRevision}/${rustBorrowingPack}`;
		item.projectLink = `${root}/starter`;
		item.solutionLink = `${root}/solution`;
		item.ideImport = true;
	}
}
