import type { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { requireCodeIdeAccountMatch } from "../src/middleware/codeIdeAccount.js";

describe("Code IDE owner precondition", () => {
	it.each([
		["currentUser", "learner"],
		["currentTutor", "tutor:learner"],
		["currentAdmin", "admin:learner"],
		["currentCourseCodeLearner", "courseCodeLearner:learner"]
	])("checks the exact role and identity for %s", (property, expected) => {
		for (const supplied of [expected, undefined, "", "other", `${expected},other`]) {
			const next = vi.fn();
			const json = vi.fn();
			const status = vi.fn().mockReturnValue({ json });
			const request = {
				[property]: { _id: "learner" },
				get: () => supplied
			} as unknown as Request;
			requireCodeIdeAccountMatch(request, { status } as unknown as Response, next);
			if (supplied === expected || supplied === undefined) {
				expect(next).toHaveBeenCalledOnce();
				expect(status).not.toHaveBeenCalled();
			} else {
				expect(next).not.toHaveBeenCalled();
				expect(status).toHaveBeenCalledWith(409);
			}
		}
	});
	it("does not authenticate an owner supplied only in the header", () => {
		const next = vi.fn();
		const status = vi.fn().mockReturnValue({ json: vi.fn() });
		requireCodeIdeAccountMatch({ get: () => "learner" } as unknown as Request, { status } as unknown as Response, next);
		expect(next).not.toHaveBeenCalled();
		expect(status).toHaveBeenCalledWith(409);
	});
});
