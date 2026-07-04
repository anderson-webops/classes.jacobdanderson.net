// src/controllers/users/tutorExtraController.ts
import type { RequestHandler } from "express";
import { Types } from "mongoose";
import { Tutor } from "../../models/schemas/Tutor.js";
import { User } from "../../models/schemas/User.js";

const MAX_COURSE_ID_LENGTH = 160;

function normalizeCourseAccessIDs(value: unknown): string[] | null {
	if (!Array.isArray(value)) return null;

	const ids: string[] = [];
	const seen = new Set<string>();
	for (const item of value) {
		if (typeof item !== "string") return null;
		const id = item.trim();
		if (!id || id.length > MAX_COURSE_ID_LENGTH) return null;
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
			message: `courseIDs must contain non-empty string IDs of ${MAX_COURSE_ID_LENGTH} characters or fewer`
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

	const tutor = await Tutor.findById(tutorID);
	if (!tutor) return res.sendStatus(404);

	if (await User.exists({ email: tutor.email })) {
		return res.status(409).json({ message: "User with this email already exists" });
	}

	const user = new User({
		name: tutor.name,
		email: tutor.email,
		age: tutor.age,
		state: tutor.state,
		password: tutor.password,
		role: "user"
	} as any);
	(user as any).skipPasswordHash = true;

	await user.save();
	await tutor.deleteOne();

	res.status(201).json({ user });
};
