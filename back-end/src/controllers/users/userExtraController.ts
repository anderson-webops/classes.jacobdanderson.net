// src/controllers/users/userExtraController.ts
import type { RequestHandler } from "express";
import { Types } from "mongoose";
import { Tutor } from "../../models/schemas/Tutor.js";
import { User } from "../../models/schemas/User.js";

function toObjectId(id: string) {
	return Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null;
}

export const getUsersOfTutor: RequestHandler = async (req, res) => {
	const tutorObjectId = toObjectId(req.params.tutorID);
	if (!tutorObjectId) return res.status(400).json({ message: "Invalid tutor ID" });
	const users = await User.find({ tutors: tutorObjectId });
	res.json(users);
};

export const assignTutorToUser: RequestHandler = async (req, res) => {
	const { userID, tutorID } = req.params;
	const tutorObjectId = toObjectId(tutorID);
	if (!tutorObjectId) return res.status(400).json({ message: "Invalid tutor ID" });
	const [user, tutorExists] = await Promise.all([
		User.findById(userID),
		Tutor.exists({ _id: tutorObjectId })
	]);
	if (!user) return res.sendStatus(404);
	if (!tutorExists) return res.status(404).json({ message: "Tutor not found" });
	if (!user.tutors.some(id => id.equals(tutorObjectId))) {
		user.tutors.push(tutorObjectId);
		await user.save();
	}
	res.json(user);
};

export const setUserTutors: RequestHandler = async (req, res) => {
	const { userID } = req.params;
	const tutorIDs = Array.isArray(req.body?.tutorIDs) ? req.body.tutorIDs : [];
	const parsedIds = tutorIDs
		.map((id: unknown) => (typeof id === "string" ? toObjectId(id) : null))
		.filter((id): id is Types.ObjectId => id !== null);
	const uniqueStrings = Array.from(new Set(parsedIds.map(id => id.toString())));
	const lookupIds = uniqueStrings.map(id => new Types.ObjectId(id));
	const validTutorDocs = await Tutor.find({ _id: { $in: lookupIds } })
		.select("_id")
		.lean();
	const validSet = new Set(validTutorDocs.map(t => t._id.toString()));
	const sanitizedIds = uniqueStrings
		.filter(id => validSet.has(id))
		.map(id => new Types.ObjectId(id));
	const user = await User.findById(userID);
	if (!user) return res.sendStatus(404);
	user.tutors = sanitizedIds;
	await user.save();
	res.json(user);
};

export const deleteUsersUnderTutor: RequestHandler = async (req, res) => {
	const tutorObjectId = toObjectId(req.params.tutorID);
	if (!tutorObjectId) return res.status(400).json({ message: "Invalid tutor ID" });
	await User.updateMany(
		{ tutors: tutorObjectId },
		{ $pull: { tutors: tutorObjectId } }
	);
	res.sendStatus(200);
};

export const promoteUserToTutor: RequestHandler = async (req, res) => {
	const { userID } = req.params;
	const user = await User.findById(userID);
	if (!user) return res.sendStatus(404);
	const existingTutor = await Tutor.findOne({ email: user.email });
	if (existingTutor)
		return res.status(409).json({ message: "A tutor already exists with this email." });
	const now = new Date();
	const insertResult = await Tutor.collection.insertOne({
		name: user.name,
		email: user.email,
		age: user.age,
		state: user.state,
		password: user.password,
		usersOfTutorLength: 0,
		editTutors: false,
		saveEdit: "Edit",
		role: "tutor",
		createdAt: now,
		updatedAt: now
	});
	await user.deleteOne();
	const createdTutor = await Tutor.findById(insertResult.insertedId);
	return res.status(201).json({ tutor: createdTutor });
};
