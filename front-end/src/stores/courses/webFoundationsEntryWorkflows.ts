import type { RawCourse, RawCourseModuleItem } from "./types";
import debuggingReading from "../../assets/course-guides/web-files-git-debugging.md?raw";
import setupReading from "../../assets/course-guides/web-project-setup.md?raw";
import boundaryReading from "../../assets/course-guides/web-request-boundaries.md?raw";
import {
	webCourseResource,
	webPortfolioRoot
} from "../../modules/webProjectResources";

const sourceRoot = webPortfolioRoot;

const entries = [
	{
		originalTitle: "WDF0 Setup and Tooling",
		title: "WDF0 Setup and Tooling",
		id: "web-development-foundations-wdf0-setup-and-tooling",
		reading: setupReading.trim(),
		conceptSuffix: "web-development-foundations-core-concepts",
		checkSuffix:
			"early-module-on-browser-devtools-git-npm-and-project-structure",
		projectSuffix: "core-project-web-development-foundations",
		notebookSuffix: "workflow-notebook-setup-and-tooling",
		choiceSuffix: "web-development-foundations-setup-transfer-practice",
		challengeSuffix: "web-development-foundations-setup-extension-practice",
		conceptTitle: "Project Files and a Local Server",
		checkTitle: "Application Check: Source and Running Page",
		check: "In the portfolio starter, locate the stylesheet link, module script tag, deployment-list element and year element. Predict the page after changing one saved checklist string and after making an unsaved Elements-panel edit. Reload and distinguish the two results. Record the actual request and console evidence; a page retained in a tab does not prove the server is still running.",
		projectTitle: "Core Project: Start and Reproduce the Portfolio",
		project:
			"Use the existing portfolio starter. Complete the reading's five-step core project: identify the four files, use the maintained repository lockfile, start the selected workspace on loopback, make one card and one checklist edit, inspect both viewport widths, then stop/restart and verify the saved work. Preserve this project for WDF1 and WDF2. A supplied-case analysis can support setup reasoning but cannot substitute for an observed startup.",
		notebookTitle: "Setup Record",
		notebook:
			"Continue the same portfolio. Record the repository revision, terminal directory, Node/npm versions, selected workspace command, URL, actual result and one diagnosed failure. Separate predicted output from an executed run, and source changes from browser-only edits. Use this record to repeat the startup after closing the original terminal.",
		choiceTitle: "Choice: A Project Path with Spaces",
		choice: "Continue the portfolio in a copy of the maintained repository whose directory name contains spaces. Follow the reading's choice exercise: quote the directory, preserve relative resource paths and compare the new startup with the original. Explain why a URL-relative stylesheet link does not need the terminal's absolute path.",
		challengeTitle: "Challenge: A Strict Port Collision",
		challenge:
			"Use the reading's deliberate startup-failure exercise on this project's own local server. Record the second strict-port command's refusal without stopping the original service. End with the original server only, then stop it when finished. Explain why editing page code cannot resolve an occupied port."
	},
	{
		originalTitle: "WDF1 Positioning, Goals, and Suggested Course Family",
		title: "WDF1 Browser, Server, and Data Boundaries",
		id: "web-development-foundations-wdf1-positioning-goals-and-suggested-course-family",
		reading: boundaryReading.trim(),
		conceptSuffix:
			"positioning-goals-and-suggested-course-family-core-concepts",
		checkSuffix:
			"positioning-goals-and-suggested-course-family-application-check",
		projectSuffix:
			"core-project-positioning-goals-and-suggested-course-family",
		notebookSuffix: "workflow-notebook-positioning-and-goals",
		choiceSuffix: "course-path-transfer-practice",
		challengeSuffix: "course-path-extension-practice",
		conceptTitle: "Browser, Server and Data Boundaries",
		checkTitle: "Application Check: A Request Does Not Create an API",
		check: "Explain what fetch('/api/notes') requests from the portfolio's origin and why the call does not install a server handler. Identify the status, content type and body needed to distinguish JSON from a development-server HTML fallback. Separate an observed resource response from the proposed notes API and its validation/persistence contract.",
		projectTitle: "Core Project: Map the Portfolio Request Path",
		project:
			"Continue the saved WDF0 portfolio. Complete the five-step request-and-ownership map in the reading: capture actual document/CSS/script requests, trace selectors and DOM writes, compare a temporary DOM edit with a saved source edit, draw the observed static path, then design a separately labelled future notes API. Identify data ownership and lifetimes; no database or application API is implemented by this starter.",
		notebookTitle: "Request and Ownership Record",
		notebook:
			"Continue the portfolio record. For each observed request, keep its URL, status, content type, initiator and purpose. For each value, record whether it comes from source, the local clock or a temporary DOM edit. Put a proposed API/database path in a separate design column so planned behavior is never presented as observed behavior.",
		choiceTitle: "Choice: Compare Local Origins",
		choice: "Use the reading's three local URLs to compare scheme, host and port. Trace a relative stylesheet request for each origin and distinguish same-computer access from same-origin access. Explain the separate-origin API agreement that would be needed later, without adding a nonexistent service to the portfolio.",
		challengeTitle: "Challenge: Failures Across a Proposed Notes Request",
		challenge:
			"Classify the reading's five proposed notes-feature failures by detecting layer and user feedback. Include a response lost after a possible write and explain why an unqualified retry can duplicate a record. Keep the result as a design analysis; the portfolio has no note-creation handler."
	},
	{
		originalTitle:
			"WDF2 Stage 1: Strengthen the Existing JavaScript Courses",
		title: "WDF2 Files, Git, and Browser Debugging",
		id: "web-development-foundations-wdf2-stage-1-strengthen-the-existing-javascript-courses",
		reading: debuggingReading.trim(),
		conceptSuffix:
			"strengthen-the-existing-javascript-courses-core-concepts",
		checkSuffix: "use-more-file-based-local-projects-not-only-codepen",
		projectSuffix:
			"core-project-strengthen-the-existing-javascript-courses",
		notebookSuffix:
			"workflow-notebook-strengthen-the-existing-javascript-courses",
		choiceSuffix: "javascript-bridge-transfer-practice",
		challengeSuffix: "javascript-bridge-extension-practice",
		conceptTitle: "Files, Git and Browser Debugging",
		checkTitle: "Application Check: A Quiet Selector Failure",
		check: "Read deploymentList?.appendChild(li) in the actual portfolio starter. Explain why a changed HTML ID can leave an empty list without throwing, while createElementX('li') stops the script before its year update. Use the Console, DOM and Network panel to distinguish these failures, then restore the original identifiers and repeat a fresh-load check.",
		projectTitle: "Core Project: Diagnose, Commit, and Rebuild",
		project:
			"Continue the saved portfolio. Follow the reading's four controlled fault cases one at a time, restoring each before the next. Save one useful source improvement with a reviewed Git diff in an exercise branch or separate copy. Build only the starter workspace, inspect its local preview and compare source, build and browser results. Keep setup evidence, diagnoses and build results separately; do not record a supplied-case analysis as an executed build.",
		notebookTitle: "Debugging and Recovery Record",
		notebook:
			"For each controlled fault, record the initial hypothesis, actual request/console/layout evidence, smallest correction and fresh-load retest. Add the reviewed commit, selected workspace build command and preview result when executed. Confirm that deliberate faults are removed and preserve unrelated work.",
		choiceTitle: "Choice: Review One Commit",
		choice: "In a disposable exercise branch, compare one portfolio commit with its parent as described in the reading. Relate each changed source line to a visible result and a relevant check. Preserve the current working copy; do not use a destructive reset to imitate recovery.",
		challengeTitle: "Challenge: Diagnose a Stale Build",
		challenge:
			"Use the reading's source-versus-build experiment: change a heading after building, compare the development server with the unchanged preview, then rebuild and verify the preview. Explain the input used by each server and end with intended source, a matching build and no deliberate faults."
	}
] as const;

function rewriteItem(
	item: RawCourseModuleItem,
	id: string,
	title: string,
	content: string,
	learningPath?: "core" | "choice" | "challenge"
) {
	item.id = id;
	item.title = title;
	item.content = content;
	item.preserveInstructions = true;
	item.learningPath = learningPath;
	if (item.projectLink) {
		item.projectLink = `${sourceRoot}/starter`;
		item.solutionLink = `${sourceRoot}/solution`;
		item.ideImport = true;
	}
}

export function applyWebFoundationsEntryWorkflows(
	course: RawCourse,
	courseId: string
) {
	if (courseId !== "web-development-foundations") return;
	for (const entry of entries) {
		const module = course.modules.find(
			candidate => candidate.title === entry.originalTitle
		);
		if (!module) continue;
		if (
			module.curriculum.length !== 3 ||
			module.supplementalProjects.length !== 3
		) {
			throw new Error(`Unexpected web entry activities: ${entry.id}`);
		}
		module.id = entry.id;
		module.title = entry.title;
		const [concepts, check, project] = module.curriculum;
		const [notebook, choice, challenge] = module.supplementalProjects;
		rewriteItem(
			concepts,
			`${entry.id}-curriculum-${entry.conceptSuffix}`,
			entry.conceptTitle,
			entry.reading
		);
		rewriteItem(
			check,
			`${entry.id}-curriculum-${entry.checkSuffix}`,
			entry.checkTitle,
			entry.check,
			"core"
		);
		rewriteItem(
			project,
			`${entry.id}-curriculum-${entry.projectSuffix}`,
			entry.projectTitle,
			entry.project,
			"core"
		);
		rewriteItem(
			notebook,
			`${entry.id}-supplemental-${entry.notebookSuffix}`,
			entry.notebookTitle,
			entry.notebook,
			"choice"
		);
		rewriteItem(
			choice,
			`${entry.id}-supplemental-${entry.choiceSuffix}`,
			entry.choiceTitle,
			entry.choice,
			"choice"
		);
		rewriteItem(
			challenge,
			`${entry.id}-supplemental-${entry.challengeSuffix}`,
			entry.challengeTitle,
			entry.challenge,
			"challenge"
		);
	}
	for (const module of course.modules) {
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			const selected = webCourseResource(item.projectLink ?? "");
			if (!selected) continue;
			item.projectLink = `${webPortfolioRoot}/${selected.role}`;
			if (webCourseResource(item.solutionLink ?? ""))
				item.solutionLink = `${webPortfolioRoot}/solution`;
			item.ideImport = true;
		}
	}
}
