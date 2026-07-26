import type { Model } from "mongoose";
import type { ICourseCodeLearner } from "../../types/entities/ICourseCodeLearner.js";
import mongoose, { Schema } from "mongoose";

const courseCodeLearnerSchema: Schema<ICourseCodeLearner> = new Schema(
	{
		accessCode: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "CourseAccessCode",
			required: true,
			index: true
		},
		username: {
			type: String,
			required: true,
			trim: true,
			maxlength: 40
		},
		usernameKey: {
			type: String,
			required: true,
			trim: true,
			maxlength: 40
		},
		courseID: {
			type: String,
			required: true,
			trim: true,
			maxlength: 120,
			index: true
		},
		lastSeenAt: {
			type: Date,
			required: true,
			default: Date.now
		}
	},
	{ timestamps: true }
);

courseCodeLearnerSchema.index(
	{ accessCode: 1, usernameKey: 1 },
	{ unique: true }
);

export const CourseCodeLearner: Model<ICourseCodeLearner>
	= mongoose.model<ICourseCodeLearner>(
		"CourseCodeLearner",
		courseCodeLearnerSchema
	);
