import type { RequestHandler } from "express";
import { Admin } from "../../models/schemas/Admin.js";
import {
	adminCreationPayloadSchema,
	isDuplicateKeyError
} from "../../utils/accountPayloads.js";
import {
	accountEmailExists,
	serializeAccountEntity
} from "../../utils/accountSessions.js";
import { recordSecurityAuditEvent } from "../../utils/securityAudit.js";
// src/controllers/users/adminController.ts
import { makeEntityController } from "../common/entityController.js";

export const {
	getAll: getAllAdmins,
	update: updateAdmin,
	remove: deleteAdmin,
	getLoggedIn: getLoggedInAdmin
} = makeEntityController({
	model: Admin,
	idParam: "adminID",
	sessionKey: "adminID",
	responseKey: "currentAdmin",
	targetRole: "admin",
	updateFields: ["name"]
});

export const createAdmin: RequestHandler = async (req, res) => {
	const parsed = adminCreationPayloadSchema.safeParse(req.body ?? {});
	if (!parsed.success) {
		return res.status(400).json({
			message: "Invalid admin account payload",
			issues: parsed.error.issues
		});
	}

	try {
		if (await accountEmailExists(parsed.data.email)) {
			return res.status(409).json({
				message: "An account with that email already exists"
			});
		}
		const admin = await Admin.create({
			...parsed.data,
			editAdmins: false,
			role: "admin",
			saveEdit: "Edit"
		});
		await recordSecurityAuditEvent(req, {
			action: "admin.create",
			targetID: admin._id,
			targetRole: "admin"
		});
		return res.status(201).json({ admin: serializeAccountEntity(admin) });
	}
	catch (error) {
		if (isDuplicateKeyError(error)) {
			return res.status(409).json({ message: "An account with that email already exists" });
		}
		throw error;
	}
};
