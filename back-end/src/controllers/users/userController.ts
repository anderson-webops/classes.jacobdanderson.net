// src/controllers/users/userController.ts
import type { RequestHandler } from "express";
import { User } from "../../models/schemas/User.js";
import {
	isDuplicateKeyError,
	userProfileUpdatePayloadSchema,
	userSignupPayloadSchema
} from "../../utils/accountPayloads.js";
import {
	accountEmailExists,
	establishAccountSession,
	serializeAccountEntity
} from "../../utils/accountSessions.js";
import { documentReferenceID } from "../../utils/scheduledSessions.js";
import { recordSecurityAuditEvent } from "../../utils/securityAudit.js";
import { makeEntityController } from "../common/entityController.js";

export const {
	getAll: getAllUsers,
	update: updateUser,
	remove: deleteUser,
	getLoggedIn: getLoggedInUser
} = makeEntityController({
	model: User,
	idParam: "userID",
	sessionKey: "userID",
	responseKey: "currentUser",
	targetRole: "user",
	updateFields: ["name", "age", "state"],
	populate: { path: "tutors", select: "name email state" }
});

export const createUser: RequestHandler = async (req, res) => {
	const parsed = userSignupPayloadSchema.safeParse(req.body ?? {});
	if (!parsed.success) {
		return res.status(400).json({
			message: "Invalid user account payload",
			issues: parsed.error.issues
		});
	}

	try {
		if (await accountEmailExists(parsed.data.email)) {
			return res.status(409).json({
				message: "An account with that email already exists"
			});
		}
		const user = await User.create({
			...parsed.data,
			courseAccess: [],
			courseProgress: [],
			courseStatus: {},
			editUsers: false,
			role: "user",
			saveEdit: "Edit",
			tutors: []
		});
		establishAccountSession(req.session as any, {
			entity: user,
			sessionKey: "userID"
		});
		await recordSecurityAuditEvent(req, {
			action: "user.signup",
			targetID: user._id,
			targetRole: "user"
		});
		return res.status(201).json({ currentUser: serializeAccountEntity(user) });
	}
	catch (error) {
		if (isDuplicateKeyError(error)) {
			return res.status(409).json({ message: "An account with that email already exists" });
		}
		throw error;
	}
};

export const updateUserAsTutor: RequestHandler = async (req, res) => {
	const userID = Array.isArray(req.params.userID) ? req.params.userID[0] : req.params.userID;
	const tutor = req.currentTutor;
	if (!tutor) return res.status(403).json({ message: "Tutor session required" });

	const user = await User.findById(userID).populate("tutors", "_id");
	if (!user) return res.sendStatus(404);
	const managesUser = user.tutors.some(
		assignedTutor =>
			documentReferenceID(assignedTutor) === tutor._id.toString()
	);
	if (!managesUser) {
		return res.status(403).json({ message: "You can only update your own students" });
	}

	const parsed = userProfileUpdatePayloadSchema.safeParse(req.body ?? {});
	if (!parsed.success) {
		return res.status(400).json({
			message: "Invalid user profile update",
			issues: parsed.error.issues
		});
	}

	Object.assign(user, parsed.data);
	await user.save();
	await recordSecurityAuditEvent(req, {
		action: "user.profile.update-by-tutor",
		metadata: { fields: Object.keys(parsed.data) },
		targetID: user._id,
		targetRole: "user"
	});
	return res.sendStatus(200);
};
