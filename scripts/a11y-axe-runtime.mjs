export const axeRuntimeMissingError = "Axe runtime is unavailable after a development-server reload.";

const transientA11yError = new RegExp(
	[
		"Execution context was destroyed",
		"Cannot find context with specified id",
		"Navigating frame was detached",
		"Node with given id does not belong to the document",
		"axe is not defined",
		axeRuntimeMissingError
	].join("|"),
	"i"
);

export function isTransientA11yError(error) {
	const visitedErrors = new Set();
	let currentError = error;

	while (
		currentError instanceof Error
		&& !visitedErrors.has(currentError)
	) {
		if (transientA11yError.test(currentError.message)) return true;

		visitedErrors.add(currentError);
		currentError = currentError.cause;
	}

	return false;
}

export async function runAxeInPage(page) {
	return await page.evaluate(async missingRuntimeMessage => {
		const axeRuntime = globalThis.axe;
		if (!axeRuntime || typeof axeRuntime.run !== "function") {
			throw new Error(missingRuntimeMessage);
		}

		return await axeRuntime.run(document, {
			resultTypes: ["violations"],
			runOnly: {
				type: "tag",
				values: ["wcag2a", "wcag2aa"]
			}
		});
	}, axeRuntimeMissingError);
}
