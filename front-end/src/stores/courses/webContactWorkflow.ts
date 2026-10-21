import type {
	CourseItemLearningPath,
	RawCourse,
	RawCourseModuleItem
} from "./types";
import contract from "../../assets/course-guides/web-contact-contract.md?raw";
import identity from "../../assets/course-guides/web-contact-identity.md?raw";
import routes from "../../assets/course-guides/web-contact-routes.md?raw";
import runtime from "../../assets/course-guides/web-contact-runtime.md?raw";
import { webContactRoot } from "../../modules/webProjectResources";

export function applyWebContactWorkflow(course: RawCourse, courseId: string) {
	if (courseId !== "web-development-foundations") return;
	const module = course.modules.find(
		row => row.title === "WDF5 Stage 4: Back-End Basics"
	);
	if (!module) return;
	if (
		module.curriculum.length !== 2 ||
		module.supplementalProjects.length !== 3
	) {
		throw new Error("Unexpected contact module activities");
	}
	const id = "web-development-foundations-wdf5-stage-4-back-end-basics";
	module.id = id;
	module.curriculum[0].id = `${id}-curriculum-back-end-basics-core-concepts`;
	module.curriculum[0].content = [runtime, routes, contract, identity]
		.map(reading => reading.trim())
		.join("\n\n---\n\n");
	module.curriculum[0].preserveInstructions = true;
	module.curriculum[1].id = `${id}-curriculum-core-project-back-end-basics`;
	const optionalIds = [
		"project-booking-or-contact-app-with-email-integration",
		"back-end-basics-transfer-practice",
		"back-end-basics-extension-practice"
	];
	for (const [index, suffix] of optionalIds.entries())
		module.supplementalProjects[index].id = `${id}-supplemental-${suffix}`;
	const update = (
		item: RawCourseModuleItem,
		title: string,
		content: string,
		path: CourseItemLearningPath
	) => {
		item.title = title;
		item.content = content;
		item.learningPath = path;
		item.preserveInstructions = true;
		item.projectLink = `${webContactRoot}/starter`;
		item.ideImport = true;
		if (path === "core") item.solutionLink = `${webContactRoot}/solution`;
		else delete item.solutionLink;
	};
	update(
		module.curriculum[1],
		"Core Project: Validate a Contact Request",
		"Implement parseContact in src/validation.js using the four-field contract in the reading and imported README. Keep validation pure and use JavaScript without adding a dependency to the starter. Predict the unfinished 501 response before editing. Check exact limits, whitespace, wrong types, unknown fields and input immutability, then trace a valid browser request through the real local HTTP service. Verify safe errors, literal text, repeated-request limits, cancellation and recovery. Save and reopen the edited source, export every nested file, and run it in the matching maintained checkout. Compare the core reference after an independent attempt.\n\n**Checkpoints:** Retain the source diff, predicted and observed request table, native command and port, browser results at both widths and 200% zoom, and the successful restart with saved edits.",
		"core"
	);
	update(
		module.supplementalProjects[0],
		"Choice: Trace HTTP Failure and Recovery",
		"Continue the saved contact project after completing its core validator. Use the reading's local request cases to distinguish malformed JSON, wrong media type, excessive body size and the seventh quick POST. For each, predict status, safe body and whether delivery runs before sending the request. Restart with fail and timeout scenarios, compare health with delivery, then restore ok and demonstrate recovery. Inspect logs for event/status/outcome only. The core reference demonstrates the supplied HTTP behavior; this investigation adds an evidence table, not real email delivery.\n\n**Checkpoints:** Preserve each prediction, observed response, recovery result and the distinction between service availability and simulated delivery.",
		"choice"
	);
	update(
		module.supplementalProjects[1],
		"Choice: Extend One Contact Topic",
		"Continue the same saved project. Add one fictional topic to the documented contract, browser select and validator together. Create independent valid and invalid request cases, including the new topic sent directly without the form. Retain the original project and lesson values, field limits, unknown-key rejection and stable error shape. Verify that changing only the select does not change the server contract. Save, reopen and export the added work, then run that export in the maintained checkout. The supplied core reference does not implement this extra topic.\n\n**Checkpoints:** Keep the revised contract, source diff, original-case results and new direct-request evidence.",
		"choice"
	);
	update(
		module.supplementalProjects[2],
		"Challenge: Reset During a Pending Request",
		"Continue the saved contact project with fictional input. Start the local timeout scenario, submit once, then use Reset while the request is pending. Record the fresh form and status before the older response could arrive. Explain the separate jobs of AbortController, the generation counter and the pending-submission guard in public/app.js. Compare this result with a submission to a stopped service, then restore ok and confirm a fresh request succeeds. Preserve the bounded deadlines and safe error text. The core reference supplies the reset behavior; it does not supply this investigation's recorded trace.\n\n**Checkpoints:** Retain the action order, status timeline, observed network outcome and recovery result without contact text in logs.",
		"challenge"
	);
}
