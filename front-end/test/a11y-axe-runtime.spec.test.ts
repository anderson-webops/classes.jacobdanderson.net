import { afterEach, describe, expect, it, vi } from "vitest";
import {
	axeRuntimeMissingError,
	isTransientA11yError,
	runAxeInPage
} from "../../scripts/a11y-axe-runtime.mjs";

const originalAxe = Object.getOwnPropertyDescriptor(globalThis, "axe");

afterEach(() => {
	if (originalAxe) Object.defineProperty(globalThis, "axe", originalAxe);
	else Reflect.deleteProperty(globalThis, "axe");
});

function fakePage() {
	return {
		evaluate: async (
			callback: (...arguments_: unknown[]) => unknown,
			...arguments_: unknown[]
		) => await callback(...arguments_)
	};
}

describe("accessibility Axe runtime", () => {
	it("marks a missing runtime after a development-server reload as transient", async () => {
		Reflect.deleteProperty(globalThis, "axe");

		await expect(runAxeInPage(fakePage())).rejects.toThrow(
			axeRuntimeMissingError
		);
		expect(isTransientA11yError(new Error(axeRuntimeMissingError))).toBe(
			true
		);
	});

	it("recognizes navigation reloads but not real Axe failures", () => {
		expect(
			isTransientA11yError(new Error("Execution context was destroyed"))
		).toBe(true);
		expect(
			isTransientA11yError(
				new Error(
					"Protocol error (DOM.resolveNode): Node with given id does not belong to the document"
				)
			)
		).toBe(true);
		expect(
			isTransientA11yError(
				new Error("Axe reported a color contrast violation")
			)
		).toBe(false);
	});

	it("recognizes transient navigation failures wrapped as an error cause", () => {
		const navigationFailure = new Error(
			"Waiting for selector `body` failed",
			{
				cause: new Error("Cannot find context with specified id")
			}
		);

		expect(isTransientA11yError(navigationFailure)).toBe(true);
	});

	it("stops safely when an error cause chain contains a cycle", () => {
		const firstError = new Error("Accessibility check failed");
		const secondError = new Error("Axe reported a real violation", {
			cause: firstError
		});
		Object.defineProperty(firstError, "cause", {
			configurable: true,
			value: secondError
		});

		expect(isTransientA11yError(firstError)).toBe(false);
	});

	it("runs Axe with the WCAG A and AA tag set when the runtime is present", async () => {
		const run = vi.fn().mockResolvedValue({ violations: [] });
		Reflect.set(globalThis, "axe", { run });

		await expect(runAxeInPage(fakePage())).resolves.toEqual({
			violations: []
		});
		expect(run).toHaveBeenCalledWith(document, {
			resultTypes: ["violations"],
			runOnly: {
				type: "tag",
				values: ["wcag2a", "wcag2aa"]
			}
		});
	});
});
