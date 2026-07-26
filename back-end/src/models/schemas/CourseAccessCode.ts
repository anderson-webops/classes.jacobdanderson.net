import type { Model } from "mongoose";
import type { ICourseAccessCode } from "../../types/entities/ICourseAccessCode.js";
import mongoose, { Schema } from "mongoose";

const courseAccessCodeSchema: Schema<ICourseAccessCode> = new Schema(
	{
		codeHash: {
			type: String,
			required: true,
			unique: true,
			select: false
		},
		codeHint: {
			type: String,
			required: true,
			trim: true,
			maxlength: 4
		},
		courseID: {
			type: String,
			required: true,
			trim: true,
			maxlength: 120,
			index: true
		},
		label: {
			type: String,
			required: true,
			trim: true,
			maxlength: 80
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			index: true
		},
		createdByRole: {
			type: String,
			enum: ["admin", "tutor"],
			required: true,
			index: true
		},
		createdByName: {
			type: String,
			required: true,
			trim: true,
			maxlength: 120
		},
		active: {
			type: Boolean,
			default: true,
			required: true,
			index: true
		}
	},
	{ timestamps: true }
);

courseAccessCodeSchema.index({ createdByRole: 1, createdBy: 1, updatedAt: -1 });
courseAccessCodeSchema.index({ courseID: 1, active: 1 });

export const CourseAccessCode: Model<ICourseAccessCode>
	= mongoose.model<ICourseAccessCode>("CourseAccessCode", courseAccessCodeSchema);
