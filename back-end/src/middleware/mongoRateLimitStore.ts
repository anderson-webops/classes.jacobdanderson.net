import type {
	IncrementResponse,
	Options,
	Store
} from "express-rate-limit";
import { createHash } from "node:crypto";
import { env } from "node:process";
import { RateLimitCounter } from "../models/schemas/RateLimitCounter.js";

export class MongoRateLimitStore implements Store {
	readonly localKeys = false;
	private windowMs = 60_000;

	constructor(private readonly counterNamespace: string) {}

	init(options: Options) {
		this.windowMs = options.windowMs;
		void RateLimitCounter.init().catch((error: unknown) => {
			console.error("Unable to initialize the distributed rate-limit index:", error);
		});
	}

	private counterID(key: string) {
		return createHash("sha256")
			.update(`${this.counterNamespace}:${key}`)
			.digest("hex");
	}

	async increment(key: string): Promise<IncrementResponse> {
		const now = new Date();
		const nextResetTime = new Date(now.getTime() + this.windowMs);
		const counter = await RateLimitCounter.findOneAndUpdate(
			{ _id: this.counterID(key) },
			[
				{
					$set: {
						resetTime: {
							$cond: [
								{ $gt: [{ $ifNull: ["$resetTime", new Date(0)] }, now] },
								"$resetTime",
								nextResetTime
							]
						},
						totalHits: {
							$cond: [
								{ $gt: [{ $ifNull: ["$resetTime", new Date(0)] }, now] },
								{ $add: [{ $ifNull: ["$totalHits", 0] }, 1] },
								1
							]
						}
					}
				}
			],
			{ new: true, upsert: true }
		)
			.lean()
			.exec();

		if (!counter) {
			throw new Error("Rate-limit counter was not returned after increment");
		}
		return {
			resetTime: counter.resetTime,
			totalHits: counter.totalHits
		};
	}

	async decrement(key: string) {
		await RateLimitCounter.updateOne(
			{ _id: this.counterID(key) },
			[
				{
					$set: {
						totalHits: {
							$max: [
								0,
								{ $subtract: [{ $ifNull: ["$totalHits", 0] }, 1] }
							]
						}
					}
				}
			]
		).exec();
	}

	async resetKey(key: string) {
		await RateLimitCounter.deleteOne({ _id: this.counterID(key) }).exec();
	}
}

export function productionRateLimitStore(prefix: string): Store | undefined {
	const configuredStore = env.RATE_LIMIT_STORE?.trim().toLowerCase();
	const shouldUseMongo = configuredStore === "mongo"
		|| (env.NODE_ENV === "production" && configuredStore !== "memory");
	return shouldUseMongo ? new MongoRateLimitStore(prefix) : undefined;
}
