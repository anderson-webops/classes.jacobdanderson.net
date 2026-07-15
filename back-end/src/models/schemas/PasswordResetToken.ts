import type { Model, Types } from "mongoose";
import mongoose, { Schema } from "mongoose";

export const passwordResetRoles = ["admin", "tutor", "user"] as const;
export type PasswordResetRole = (typeof passwordResetRoles)[number];

export interface IPasswordResetToken {
	accountID: Types.ObjectId;
	email: string;
	expiresAt: Date;
	role: PasswordResetRole;
	tokenHash: string;
}

const passwordResetTokenSchema = new Schema<IPasswordResetToken>(
	{
		accountID: {
			type: Schema.Types.ObjectId,
			required: true
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
			trim: true
		},
		expiresAt: {
			type: Date,
			required: true
		},
		role: {
			type: String,
			enum: passwordResetRoles,
			required: true
		},
		tokenHash: {
			type: String,
			required: true,
			unique: true
		}
	},
	{ timestamps: true }
);

passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
passwordResetTokenSchema.index({ role: 1, accountID: 1 }, { unique: true });

export const PasswordResetToken: Model<IPasswordResetToken>
	= mongoose.models.PasswordResetToken
		|| mongoose.model<IPasswordResetToken>("PasswordResetToken", passwordResetTokenSchema);
