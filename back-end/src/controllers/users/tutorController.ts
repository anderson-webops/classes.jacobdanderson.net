import type { RequestHandler } from "express";
import { Tutor } from "../../models/schemas/Tutor.js";
import {
	isDuplicateKeyError,
	tutorCreationPayloadSchema
} from "../../utils/accountPayloads.js";
import {
	accountEmailExists,
	serializeAccountEntity
} from "../../utils/accountSessions.js";
import { recordSecurityAuditEvent } from "../../utils/securityAudit.js";
// src/controllers/users/tutorController.ts
import { makeEntityController } from "../common/entityController.js";

export const {
	getAll: getAllTutors,
	update: updateTutor,
	remove: deleteTutor,
	getLoggedIn: getLoggedInTutor
} = makeEntityController({
	model: Tutor,
	idParam: "tutorID",
	sessionKey: "tutorID",
	responseKey: "currentTutor",
	targetRole: "tutor",
	updateFields: ["name", "age", "state"]
});

export const getTutorDirectory: RequestHandler = async (req, res) => {
	const requestedLimit = Number(req.query.limit);
	const limit = Number.isInteger(requestedLimit)
		? Math.min(Math.max(requestedLimit, 1), 100)
		: 100;
	const tutors = await Tutor.find()
		.select("_id name state usersOfTutorLength")
		.sort({ name: 1 })
		.limit(limit)
		.lean();
	res.setHeader("Cache-Control", "public, max-age=300");
	res.json(tutors);
};

export const createTutor: RequestHandler = async (req, res) => {
	const parsed = tutorCreationPayloadSchema.safeParse(req.body ?? {});
	if (!parsed.success) {
		return res.status(400).json({
			message: "Invalid tutor account payload",
			issues: parsed.error.issues
		});
	}

	try {
		if (await accountEmailExists(parsed.data.email)) {
			return res.status(409).json({
				message: "An account with that email already exists"
			});
		}
		const tutor = await Tutor.create({
			...parsed.data,
			coursePermissions: [],
			role: "tutor"
		});
		await recordSecurityAuditEvent(req, {
			action: "tutor.create",
			targetID: tutor._id,
			targetRole: "tutor"
		});
		return res.status(201).json({ tutor: serializeAccountEntity(tutor) });
	}
	catch (error) {
		if (isDuplicateKeyError(error)) {
			return res.status(409).json({ message: "An account with that email already exists" });
		}
		throw error;
	}
};
