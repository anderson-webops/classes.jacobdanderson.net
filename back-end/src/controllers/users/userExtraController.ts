// src/controllers/users/userExtraController.ts
import type { RequestHandler } from "express";
import { Types } from "mongoose";
import { User } from "../../models/schemas/User.js";

const isValidObjectId = (value: string) => Types.ObjectId.isValid(value);

export const getUsersOfTutor: RequestHandler = async (req, res) => {
	const { tutorID } = req.params;
	if (!isValidObjectId(tutorID)) {
		return res.status(400).json({ message: "Invalid tutor ID" });
	}

	const users = await User.find({ tutors: new Types.ObjectId(tutorID) });
	res.json(users);
};

export const updateUserTutors: RequestHandler = async (req, res) => {
	const { userID } = req.params;
	const { tutorIds } = req.body as { tutorIds?: string[] };
	if (!isValidObjectId(userID)) {
		return res.status(400).json({ message: "Invalid user ID" });
	}

	const user = await User.findById(userID);
	if (!user) return res.sendStatus(404);

	const sanitizedIds = Array.isArray(tutorIds)
		? [...new Set(tutorIds.filter(id => typeof id === "string" && isValidObjectId(id)))]
		: [];

	user.tutors = sanitizedIds.map(id => new Types.ObjectId(id));
	await user.save();

	res.json(user);
};

export const deleteUsersUnderTutor: RequestHandler = async (req, res) => {
	const { tutorID } = req.params;
	if (!isValidObjectId(tutorID)) {
		return res.status(400).json({ message: "Invalid tutor ID" });
	}

	await User.updateMany(
		{ tutors: new Types.ObjectId(tutorID) },
		{ $pull: { tutors: new Types.ObjectId(tutorID) } }
	);
	res.sendStatus(200);
};
