// src/controllers/users/tutorExtraController.ts
import type { RequestHandler } from "express";
import { Types } from "mongoose";
import { Tutor } from "../../models/schemas/Tutor.js";
import { User } from "../../models/schemas/User.js";

export const setTutorCourses: RequestHandler = async (req, res) => {
	const { tutorID } = req.params;
	const { courseIDs } = req.body as { courseIDs?: string[] };

	if (!Types.ObjectId.isValid(tutorID)) {
		return res.status(400).json({ message: "Invalid tutor ID" });
	}

	const tutor = await Tutor.findById(tutorID);
	if (!tutor) return res.sendStatus(404);

	const normalizedCourses = Array.from(
		new Set((courseIDs ?? []).map(course => course.trim()).filter(Boolean))
	);

	tutor.courses = normalizedCourses;
	await tutor.save();

	return res.json({ courses: tutor.courses });
};

export const demoteTutorToUser: RequestHandler = async (req, res) => {
	const { tutorID } = req.params;

	if (!Types.ObjectId.isValid(tutorID)) {
		return res.status(400).json({ message: "Invalid tutor ID" });
	}

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
		courses: [],
		role: "user"
	} as any);
	(user as any).skipPasswordHash = true;

	await user.save();
	await Tutor.deleteOne({ _id: tutor._id });
	await User.updateMany({ tutors: tutor._id }, { $pull: { tutors: tutor._id } });

	return res.status(201).json({ user });
};
