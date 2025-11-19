// src/controllers/users/userExtraController.ts
import type { RequestHandler } from "express";
import type { CustomSession } from "../../types/session/CustomSession.js";
import { Types } from "mongoose";
import { Tutor } from "../../models/schemas/Tutor.js";
import { User } from "../../models/schemas/User.js";

function normalizeCourseIDs(courseIDs: unknown): string[] {
	if (!Array.isArray(courseIDs)) return [];
	const seen = new Set<string>();
	for (const id of courseIDs) {
		if (typeof id === "string" && id.trim()) {
			seen.add(id.trim());
		}
	}
	return [...seen];
}

export const getUsersOfTutor: RequestHandler = async (req, res) => {
	const { tutorID } = req.params;
	if (!Types.ObjectId.isValid(tutorID)) return res.status(400).json({ message: "Invalid tutor ID" });
	const users = await User.find({ tutors: new Types.ObjectId(tutorID) });
	res.json(users);
};

export const setUserTutors: RequestHandler = async (req, res) => {
	const { userID } = req.params;
	const { tutorIDs } = req.body as { tutorIDs?: string[] };
	if (!Types.ObjectId.isValid(userID)) return res.status(400).json({ message: "Invalid user ID" });
	if (!Array.isArray(tutorIDs)) return res.status(400).json({ message: "tutorIDs must be an array" });

	const cleanTutorIDs = [...new Set(tutorIDs)]
		.filter(id => Types.ObjectId.isValid(id))
		.map(id => new Types.ObjectId(id));

	const validTutors = await Tutor.find({ _id: { $in: cleanTutorIDs } }, { _id: 1 });
	const validTutorIds = validTutors.map(t => t._id);
	const user = await User.findById(userID);
	if (!user) return res.sendStatus(404);
	user.tutors = validTutorIds;
	await user.save();
	res.json({ tutors: user.tutors });
};

export const setUserAllowedCourses: RequestHandler = async (req, res) => {
	const { userID } = req.params;
	const requestedCourseIDs = normalizeCourseIDs(req.body?.courseIDs);
	if (!Types.ObjectId.isValid(userID)) return res.status(400).json({ message: "Invalid user ID" });

	const user = await User.findById(userID).populate("tutors");
	if (!user) return res.sendStatus(404);

	const session = req.session as CustomSession;
	const isAdmin = !!session.adminID;
	const tutorID = session.tutorID;

	if (!isAdmin && !tutorID) {
		return res.status(403).json({ message: "Not authorized to update courses" });
	}

	let allowed: string[] = requestedCourseIDs;

	if (!isAdmin) {
		const tutor = await Tutor.findById(tutorID);
		if (!tutor) return res.status(403).json({ message: "Tutor account not found" });
		const assignedToTutor = user.tutors.some(t => t.equals(tutor._id));
		if (!assignedToTutor) {
			return res.status(403).json({ message: "Tutor is not assigned to this user" });
		}
		const allowedSet = new Set(tutor.courseAccess ?? []);
		allowed = requestedCourseIDs.filter(id => allowedSet.has(id));
	}

	user.allowedCourses = allowed;
	await user.save();
	res.json({ allowedCourses: user.allowedCourses });
};

export const promoteUserToTutor: RequestHandler = async (req, res) => {
	const { userID } = req.params;
	if (!Types.ObjectId.isValid(userID)) return res.status(400).json({ message: "Invalid user ID" });
	const user = await User.findById(userID);
	if (!user) return res.sendStatus(404);

	if (await Tutor.exists({ email: user.email })) {
		return res.status(409).json({ message: "Tutor with this email already exists" });
	}

	const tutor = new Tutor({
		name: user.name,
		email: user.email,
		age: user.age,
		state: user.state,
		password: user.password,
		role: "tutor"
	} as any);
	(tutor as any).skipPasswordHash = true;

	await tutor.save();
	await user.deleteOne();

	res.status(201).json({ tutor });
};
