import type { RawCourse } from "./types";

export function applyEarlyElementaryAProjects(
	course: RawCourse,
	raw: RawCourse
) {
	const title = "EEA4 Module Project: Escape the Game";
	const original = raw.modules.find(module => module.title === title);
	const displayed = course.modules.find(module => module.title === title);
	const reading = displayed?.curriculum.find(item =>
		item.title.endsWith("Core Concepts")
	);
	if (!original || !displayed || !reading)
		throw new Error("Missing Early Elementary A escape project");
	const projects = original.curriculum.filter(
		item => item.preserveAssignment
	);
	if (projects.length !== 2)
		throw new Error("Expected both Early Elementary A escape activities");
	const projectIds = new Set(projects.map(item => item.id));
	reading.aliases = reading.aliases?.filter(alias => !projectIds.has(alias));
	reading.contentKind = "reading";
	reading.preserveInstructions = true;
	reading.content = `**Budget and route methods**

A budget is the largest amount available to spend. Add the prices of the selected items. Subtract that total from the budget to find the amount left. Check by adding the amount spent and the amount left: the sum equals the original budget.

For a 100-point budget, two items costing 20 and 30 points use 20 + 30 = 50 points. There are 100 - 50 = 50 points left, and 50 + 50 = 100 checks the result.

On a grid, count horizontal and vertical movement separately. One right jump and one left jump cancel their changes in position, although both jumps still count toward the total. For example, three right jumps followed by one left jump use four jumps and end two squares to the right of the start. The same rule works for up and down jumps. Check every part of the route against the grid boundary before checking the final corner.`;
	displayed.curriculum = [reading, ...projects.map(item => ({ ...item }))];
}
