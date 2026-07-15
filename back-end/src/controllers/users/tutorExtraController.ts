// src/controllers/users/tutorExtraController.ts
import type { RequestHandler } from "express";
import { Types } from "mongoose";
import { Tutor } from "../../models/schemas/Tutor.js";
import {
	AccountRoleTransferError,
	demoteTutorAccount
} from "../../utils/accountRoleTransfer.js";

const MAX_COURSE_ID_LENGTH = 160;
const MAX_COURSE_IDS = 1000;
const RESERVED_COURSE_CONTEXT_IDS = new Set(["__all__"]);

function normalizeCourseAccessIDs(value: unknown): string[] | null {
	if (!Array.isArray(value)) return null;
	if (value.length > MAX_COURSE_IDS) return null;

	const ids: string[] = [];
	const seen = new Set<string>();
	for (const item of value) {
		if (typeof item !== "string") return null;
		const id = item.trim();
		if (
			!id
			|| id.length > MAX_COURSE_ID_LENGTH
			|| RESERVED_COURSE_CONTEXT_IDS.has(id)
		) {
			return null;
		}
		if (seen.has(id)) continue;
		seen.add(id);
		ids.push(id);
	}
	return ids;
}

export const updateTutorCoursePermissions: RequestHandler = async (req, res) => {
	const paramTutorID = req.params.tutorID;
	const tutorID = Array.isArray(paramTutorID) ? paramTutorID[0] : paramTutorID;
	if (typeof tutorID !== "string") {
		return res.status(400).json({ message: "Invalid tutor ID" });
	}
	const { courseIDs } = req.body as { courseIDs?: string[] };
	if (!Types.ObjectId.isValid(tutorID)) return res.status(400).json({ message: "Invalid tutor ID" });
	if (!Array.isArray(courseIDs)) return res.status(400).json({ message: "courseIDs must be an array" });

	const uniqueCourses = normalizeCourseAccessIDs(courseIDs);
	if (!uniqueCourses) {
		return res.status(400).json({
			message: `courseIDs must contain at most ${MAX_COURSE_IDS} non-empty string IDs of ${MAX_COURSE_ID_LENGTH} characters or fewer`
		});
	}

	const tutor = await Tutor.findById(tutorID);
	if (!tutor) return res.sendStatus(404);

	tutor.coursePermissions = uniqueCourses;
	await tutor.save();

	res.json({ coursePermissions: tutor.coursePermissions });
};

export const demoteTutorToUser: RequestHandler = async (req, res) => {
	const paramTutorID = req.params.tutorID;
	const tutorID = Array.isArray(paramTutorID) ? paramTutorID[0] : paramTutorID;
	if (typeof tutorID !== "string") {
		return res.status(400).json({ message: "Invalid tutor ID" });
	}
	if (!Types.ObjectId.isValid(tutorID)) return res.status(400).json({ message: "Invalid tutor ID" });

	try {
		const user = await demoteTutorAccount(tutorID);
		return res.status(201).json({ user });
	}
	catch (error) {
		if (error instanceof AccountRoleTransferError) {
			if (error.statusCode === 404) return res.sendStatus(404);
			return res.status(error.statusCode).json({ message: error.message });
		}
		throw error;
	}
};
