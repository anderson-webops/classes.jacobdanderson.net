import { beforeEach, describe, expect, it, vi } from "vitest";

const modelMocks = vi.hoisted(() => ({
	deleteOne: vi.fn(),
	findOneAndUpdate: vi.fn(),
	init: vi.fn(),
	updateOne: vi.fn()
}));

vi.mock("../src/models/schemas/RateLimitCounter.js", () => ({
	RateLimitCounter: modelMocks
}));

const { MongoRateLimitStore } = await import(
	"../src/middleware/mongoRateLimitStore.js"
);

describe("MongoRateLimitStore", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("enables Mongoose update pipelines when incrementing", async () => {
		const resetTime = new Date("2026-07-30T00:00:00.000Z");
		const exec = vi.fn().mockResolvedValue({ resetTime, totalHits: 1 });
		const lean = vi.fn().mockReturnValue({ exec });
		modelMocks.findOneAndUpdate.mockReturnValue({ lean });

		const store = new MongoRateLimitStore("login");
		await expect(store.increment("client-key")).resolves.toEqual({
			resetTime,
			totalHits: 1
		});

		expect(modelMocks.findOneAndUpdate).toHaveBeenCalledWith(
			expect.objectContaining({ _id: expect.any(String) }),
			expect.any(Array),
			{
				new: true,
				updatePipeline: true,
				upsert: true
			}
		);
	});

	it("enables Mongoose update pipelines when decrementing", async () => {
		const exec = vi.fn().mockResolvedValue({ modifiedCount: 1 });
		modelMocks.updateOne.mockReturnValue({ exec });

		const store = new MongoRateLimitStore("login");
		await store.decrement("client-key");

		expect(modelMocks.updateOne).toHaveBeenCalledWith(
			expect.objectContaining({ _id: expect.any(String) }),
			expect.any(Array),
			{ updatePipeline: true }
		);
	});
});
