import type { Model } from "mongoose";
import mongoose, { Schema } from "mongoose";

export interface IRateLimitCounter {
	_id: string;
	resetTime: Date;
	totalHits: number;
}

const rateLimitCounterSchema = new Schema<IRateLimitCounter>(
	{
		_id: { type: String, required: true },
		resetTime: { type: Date, required: true },
		totalHits: { type: Number, required: true, min: 0 }
	},
	{
		collection: "rate_limit_counters",
		versionKey: false
	}
);

rateLimitCounterSchema.index({ resetTime: 1 }, { expireAfterSeconds: 0 });

export const RateLimitCounter: Model<IRateLimitCounter>
	= mongoose.models.RateLimitCounter
		|| mongoose.model<IRateLimitCounter>(
			"RateLimitCounter",
			rateLimitCounterSchema
		);
