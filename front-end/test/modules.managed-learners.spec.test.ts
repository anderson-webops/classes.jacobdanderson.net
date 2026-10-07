import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api";
import { fetchManagedLearners } from "@/modules/managedLearners";

vi.mock("@/api", () => ({ api: { get: vi.fn() } }));
beforeEach(() => vi.clearAllMocks());
describe("managed student list", () => {
	it("follows bounded pages without assuming the first 100 students are the whole roster", async () => {
		const first = Array.from({ length: 250 }, (_, index) => ({
			_id: `student-${index}`
		}));
		vi.mocked(api.get)
			.mockResolvedValueOnce({ data: first })
			.mockResolvedValueOnce({ data: [{ _id: "last" }] });
		const result = await fetchManagedLearners({ role: "admin" });
		expect(result.length).toBe(251);
		expect(api.get).toHaveBeenNthCalledWith(2, "/users/all", {
			params: { limit: 250, offset: 250 },
			signal: undefined
		});
	});
	it("uses only the requested tutor scope and forwards cancellation", async () => {
		vi.mocked(api.get).mockResolvedValue({ data: [] });
		const signal = new AbortController().signal;
		await fetchManagedLearners(
			{ role: "tutor", tutorId: "assigned-tutor" },
			signal
		);
		expect(api.get).toHaveBeenCalledWith("/users/oftutor/assigned-tutor", {
			params: { limit: 250, offset: 0 },
			signal
		});
	});
	it("fails visibly rather than treating malformed results as an empty roster", async () => {
		vi.mocked(api.get).mockResolvedValue({
			data: { message: "not a list" }
		});
		await expect(fetchManagedLearners({ role: "admin" })).rejects.toThrow(
			"Invalid student list"
		);
	});
});
