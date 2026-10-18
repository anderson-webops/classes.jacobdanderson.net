import type { RawCourse } from "./types";
import reading from "../../assets/course-guides/rust-ownership.md?raw";
import {
	rustOwnershipItemIds,
	rustOwnershipModuleId,
	rustOwnershipPack,
	rustOwnershipRevision
} from "../../modules/rustProjectResources";

// The imported README stays exact; course prose uses the same neutral voice
// as the rest of the catalog.
const courseReading = reading.replace(
	"Step through\neach helper with an instructor or annotate it independently.",
	"Step through\neach helper and annotate the ownership transfers."
);

const activities = [
	{
		kind: "core",
		section: "curriculum",
		match: /Core Project:/,
		title: "Ownership Through String, Vec and Packet",
		path: "core",
		task: "Complete OWNER LEDGER, PREDICT, CHECKS and LIMITS in observations.md. Trace every by-value helper, the independent cloned snapshot and the borrowed label; compare the predicted default and empty-vector output with the actual selected-role run."
	},
	{
		kind: "workflow",
		section: "supplementalProjects",
		match: /Ownership and Move Tracer/,
		title: "Project: Scope and Cleanup Trace",
		path: "core",
		task: "Continue the same saved ownership project. Complete SCOPE: predict the inner block, explicit drop and function-return markers, capture the actual sequence, and distinguish those custom destructor observations from allocator or machine-movement claims."
	},
	{
		kind: "choice",
		section: "supplementalProjects",
		match: /Transfer Practice/,
		title: "Independent Owned Data",
		path: "choice",
		task: "Continue the saved baseline and complete CHOICE. Add a named test with a new label and vector, change both cloned fields, assert the complete original and clone values, and explain when separately editable data requires cloning rather than a borrowed observation."
	},
	{
		kind: "challenge",
		section: "supplementalProjects",
		match: /Extension Practice/,
		title: "Moves, Drop and Copy Diagnostics",
		path: "challenge",
		task: "Continue the saved baseline and complete CHALLENGE. Predict and capture the two E0382 refusals and the E0204 refusal, identify the consumed or non-Copy value, and compare each supplied fix with its required behavior. A rejected source file has no runtime trace."
	}
] as const;

export function applyRustOwnershipCourseWorkflows(
	course: RawCourse,
	courseId: string
) {
	if (courseId !== "rust-systems-security") return;
	const module = course.modules.find(item => item.title.startsWith("RSS1 "));
	if (!module) return;
	module.id = rustOwnershipModuleId;
	for (const activity of activities) {
		const item = module[activity.section].find(candidate =>
			activity.match.test(candidate.title)
		);
		if (!item) continue;
		item.id = rustOwnershipItemIds[activity.kind];
		item.title = activity.title;
		item.learningPath = activity.path;
		item.content = `${activity.task}\n\n${courseReading.trim()}`;
		item.preserveInstructions = true;
		const root = `https://github.com/instruction-material/Low-Level-Security/tree/${rustOwnershipRevision}/${rustOwnershipPack}`;
		item.projectLink = `${root}/starter`;
		item.solutionLink = `${root}/solution`;
		item.ideImport = true;
	}
}
