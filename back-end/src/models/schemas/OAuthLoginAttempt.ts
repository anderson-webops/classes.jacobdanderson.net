import type { Model } from "mongoose";
import type { IOAuthLoginAttempt } from "../../types/entities/IOAuthLoginAttempt.js";
import mongoose, { Schema } from "mongoose";
import { externalIdentityProviders } from "../../types/entities/IExternalIdentity.js";

const SHA256_HEX_PATTERN = /^[a-f\d]{64}$/u;

const oauthLoginAttemptSchema = new Schema<IOAuthLoginAttempt>(
	{
		browserBindingHash: {
			type: String,
			required: true,
			match: SHA256_HEX_PATTERN,
			select: false
		},
		codeVerifier: {
			type: String,
			required: true,
			minlength: 32,
			maxlength: 256,
			select: false
		},
		expiresAt: {
			type: Date,
			required: true
		},
		nonce: {
			type: String,
			required: true,
			minlength: 32,
			maxlength: 256,
			select: false
		},
		provider: {
			type: String,
			enum: externalIdentityProviders,
			required: true,
			index: true
		},
		remember: {
			type: Boolean,
			required: true,
			default: false
		},
		returnTo: {
			type: String,
			required: true,
			maxlength: 500
		},
		stateHash: {
			type: String,
			required: true,
			match: SHA256_HEX_PATTERN,
			unique: true,
			select: false
		}
	},
	{ timestamps: true }
);

oauthLoginAttemptSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OAuthLoginAttempt: Model<IOAuthLoginAttempt>
	= mongoose.models.OAuthLoginAttempt
		|| mongoose.model<IOAuthLoginAttempt>(
			"OAuthLoginAttempt",
			oauthLoginAttemptSchema
		);
