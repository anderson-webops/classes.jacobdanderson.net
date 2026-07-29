// src/controllers/common/entityController.ts
import type { RequestHandler } from "express";
import type { Model, PopulateOptions, Types } from "mongoose";
import { recordSecurityAuditEvent } from "../../utils/securityAudit.js";

interface EntityDoc {
	_id: Types.ObjectId;
}

export interface EntityOpts<T extends EntityDoc> {
	model: Model<T>;
	idParam: string; // e.g. "adminID", "tutorID", "userID"
	sessionKey: "adminID" | "tutorID" | "userID";
	responseKey: "currentAdmin" | "currentTutor" | "currentUser";
	targetRole: "admin" | "tutor" | "user";
	updateFields: readonly string[];
	populate?: string | PopulateOptions | Array<string | PopulateOptions>;
}

export function makeEntityController<T extends EntityDoc>({
	model,
	idParam,
	sessionKey,
	responseKey,
	targetRole,
	updateFields,
	populate
}: EntityOpts<T>) {
	// Read all
	const getAll: RequestHandler = async (req, res) => {
		try {
			const requestedLimit = Number(req.query.limit);
			const requestedOffset = Number(req.query.offset);
			const limit = Number.isInteger(requestedLimit)
				? Math.min(Math.max(requestedLimit, 1), 250)
				: 100;
			const offset = Number.isInteger(requestedOffset)
				? Math.min(Math.max(requestedOffset, 0), 10_000)
				: 0;
			let query = model
				.find()
				.select("-password -recipientNameKey -sessionVersion")
				.skip(offset)
				.limit(limit);
			if (populate) {
				if (typeof populate === "string") query = query.populate(populate);
				else query = query.populate(populate);
			}
			const list = await query.exec();
			res.setHeader("X-Result-Limit", String(limit));
			res.setHeader("X-Result-Offset", String(offset));
			res.json(list);
		}
		catch (err) {
			console.error(err);
			res.sendStatus(500);
		}
	};

	// Update
	const update: RequestHandler = async (req, res) => {
		const rawID = req.params[idParam];
		const id = Array.isArray(rawID) ? rawID[0] : rawID;
		if (typeof id !== "string") {
			return res.status(400).json({ message: "Invalid account ID" });
		}
		try {
			const updates = Object.fromEntries(
				updateFields
					.filter(field => req.body?.[field] !== undefined)
					.map(field => [field, req.body[field]])
			);
			if (Object.keys(updates).length === 0) {
				return res.status(400).json({ message: "No supported profile fields were provided" });
			}
			for (const [field, value] of Object.entries(updates)) {
				if (
					typeof value !== "string"
					|| value.length > 160
					|| (field === "name" && value.trim().length === 0)
				) {
					return res.status(400).json({ message: `Invalid ${field} value` });
				}
				updates[field] = value.trim();
			}

			let query = model.findById(id);
			if (populate) {
				if (typeof populate === "string") query = query.populate(populate);
				else query = query.populate(populate);
			}
			const doc = await query.exec();
			if (!doc) return res.sendStatus(404);
			Object.assign(doc, updates);
			await doc.save();
			await recordSecurityAuditEvent(req, {
				action: `${targetRole}.profile.update`,
				metadata: { fields: Object.keys(updates) },
				targetID: doc._id,
				targetRole
			});
			res.sendStatus(200);
		}
		catch (err) {
			console.error(err);
			res.sendStatus(500);
		}
	};

	// Delete
	const remove: RequestHandler = async (req, res) => {
		const rawID = req.params[idParam];
		const id = Array.isArray(rawID) ? rawID[0] : rawID;
		if (typeof id !== "string") {
			return res.status(400).json({ message: "Invalid account ID" });
		}
		try {
			const result = await model.deleteOne({ _id: id });
			if (result.deletedCount === 0) return res.sendStatus(404);
			await recordSecurityAuditEvent(req, {
				action: `${targetRole}.delete`,
				targetID: id,
				targetRole
			});
			res.sendStatus(200);
		}
		catch (err) {
			console.error(err);
			res.sendStatus(500);
		}
	};

	// Get the one in session
	const getLoggedIn: RequestHandler = async (req, res) => {
		const id = (req.session as any)[sessionKey];
		if (!id) return res.sendStatus(404);
		try {
			const doc = await model
				.findById(id)
				.select("-password -recipientNameKey -sessionVersion");
			if (!doc) return res.sendStatus(404);
			res.json({ [responseKey]: doc });
		}
		catch (err) {
			console.error(err);
			res.sendStatus(500);
		}
	};

	return { getAll, update, remove, getLoggedIn };
}
