import { z } from "zod";

const nameSchema = z.string().trim().min(1).max(160);
const emailSchema = z.string().trim().toLowerCase().email().max(320);
const passwordSchema = z.string().min(8).max(256);
const optionalProfileValueSchema = z.string().trim().max(160).optional();

const baseAccountCreationShape = {
	name: nameSchema,
	email: emailSchema,
	password: passwordSchema,
	age: optionalProfileValueSchema,
	state: optionalProfileValueSchema
};

export const userSignupPayloadSchema = z
	.object(baseAccountCreationShape)
	.strict();

export const tutorCreationPayloadSchema = z
	.object(baseAccountCreationShape)
	.strict();

export const adminCreationPayloadSchema = z
	.object({
		name: nameSchema,
		email: emailSchema,
		password: passwordSchema
	})
	.strict();

const sharedProfileUpdateShape = {
	name: nameSchema.optional(),
	age: optionalProfileValueSchema,
	state: optionalProfileValueSchema
};

export const userProfileUpdatePayloadSchema = z
	.object(sharedProfileUpdateShape)
	.refine(value => Object.values(value).some(item => item !== undefined), {
		message: "Provide at least one profile field"
	});

export const tutorProfileUpdatePayloadSchema = userProfileUpdatePayloadSchema;

export const adminProfileUpdatePayloadSchema = z
	.object({
		name: nameSchema.optional()
	})
	.refine(value => value.name !== undefined, {
		message: "Provide a name"
	});

export function isDuplicateKeyError(error: unknown): error is { code: number } {
	return typeof error === "object"
		&& error !== null
		&& "code" in error
		&& error.code === 11000;
}
