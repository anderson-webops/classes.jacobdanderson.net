// src/controllers/users/userExtraController.ts
import type { RequestHandler } from "express";
import { Types } from "mongoose";
import { Tutor } from "../../models/schemas/Tutor.js";
import { User } from "../../models/schemas/User.js";

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

export const setUserCourses: RequestHandler = async (req, res) => {
	const { userID } = req.params;
	const { courseIDs } = req.body as { courseIDs?: string[] };

	if (!Types.ObjectId.isValid(userID)) {
		return res.status(400).json({ message: "Invalid user ID" });
	}

	if (!Array.isArray(courseIDs)) {
		return res.status(400).json({ message: "courseIDs must be an array" });
	}

	const user = await User.findById(userID);
	if (!user) return res.sendStatus(404);

	if (req.currentTutor) {
		const tutorId = req.currentTutor._id;
		const isAssigned = user.tutors.some(tutor => tutor.equals(tutorId));
		if (!isAssigned) {
			return res.status(403).json({ message: "You can only update your assigned students." });
		}

		const allowedCourses = new Set(req.currentTutor.courses ?? []);
		const invalidCourse = courseIDs.find(course => !allowedCourses.has(course));
		if (invalidCourse) {
			return res.status(400).json({ message: `Tutor is not allowed to assign ${invalidCourse}.` });
		}
	}

	user.courses = Array.from(new Set(courseIDs.map(course => course.trim()).filter(Boolean)));
	await user.save();
	res.json({ courses: user.courses });
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
