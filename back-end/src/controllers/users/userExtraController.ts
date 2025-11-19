// src/controllers/users/userExtraController.ts
import type { RequestHandler } from "express";
import { Types } from "mongoose";
import { Tutor } from "../../models/schemas/Tutor.js";
import { User } from "../../models/schemas/User.js";

const isValidObjectId = (value: string) => Types.ObjectId.isValid(value);
const toObjectId = (value: string) => new Types.ObjectId(value);

async function refreshTutorUserCounts(ids: Types.ObjectId[]) {
	const unique = Array.from(new Set(ids.map(id => id.toString()))).map(id => new Types.ObjectId(id));
	for (const id of unique) {
		const count = await User.countDocuments({ tutors: id });
		await Tutor.findByIdAndUpdate(id, { usersOfTutorLength: count }).exec();
	}
}

export const getUsersOfTutor: RequestHandler = async (req, res) => {
	const { tutorID } = req.params;
	if (!isValidObjectId(tutorID)) {
		return res.status(400).json({ message: "Invalid tutor ID" });
	}
	const users = await User.find({ tutors: toObjectId(tutorID) });
	res.json(users);
};

export const assignTutorToUser: RequestHandler = async (req, res) => {
	const { userID, tutorID } = req.params;
	if (!isValidObjectId(userID) || !isValidObjectId(tutorID)) {
		return res.status(400).json({ message: "Invalid tutor or user ID" });
	}
	const user = await User.findById(userID);
	if (!user) return res.sendStatus(404);
	const tutorObjectId = toObjectId(tutorID);
	const alreadyAssigned = user.tutors.some(id => id.equals(tutorObjectId));
	if (!alreadyAssigned) {
		user.tutors.push(tutorObjectId);
		await user.save();
		await refreshTutorUserCounts([tutorObjectId]);
	}
	res.json({ user });
};

export const removeTutorFromUser: RequestHandler = async (req, res) => {
	const { userID, tutorID } = req.params;
	if (!isValidObjectId(userID) || !isValidObjectId(tutorID)) {
		return res.status(400).json({ message: "Invalid tutor or user ID" });
	}
	const tutorObjectId = toObjectId(tutorID);
	const user = await User.findById(userID);
	if (!user) return res.sendStatus(404);
	const before = user.tutors.length;
	user.tutors = user.tutors.filter(id => !id.equals(tutorObjectId));
	if (before !== user.tutors.length) {
		await user.save();
		await refreshTutorUserCounts([tutorObjectId]);
	}
	res.json({ user });
};

export const setTutorsForUser: RequestHandler = async (req, res) => {
	const { userID } = req.params;
	const { tutorIDs } = req.body as { tutorIDs?: string[] };
	if (!isValidObjectId(userID)) {
		return res.status(400).json({ message: "Invalid user ID" });
	}
	if (!Array.isArray(tutorIDs)) {
		return res.status(400).json({ message: "tutorIDs must be an array" });
	}
	const user = await User.findById(userID);
	if (!user) return res.sendStatus(404);
	const normalized = tutorIDs
		.filter((id): id is string => typeof id === "string" && isValidObjectId(id))
		.map(id => toObjectId(id));
	const unique = normalized.filter((id, index, array) => array.findIndex(other => other.equals(id)) === index);
	const previous = [...user.tutors];
	user.tutors = unique;
	await user.save();
	await refreshTutorUserCounts([...previous, ...unique]);
	res.json({ user });
};

export const deleteUsersUnderTutor: RequestHandler = async (req, res) => {
	const { tutorID } = req.params;
	if (!isValidObjectId(tutorID)) {
		return res.status(400).json({ message: "Invalid tutor ID" });
	}
	const tutorObjectId = toObjectId(tutorID);
	await User.updateMany({ tutors: tutorObjectId }, { $pull: { tutors: tutorObjectId } });
	await refreshTutorUserCounts([tutorObjectId]);
	res.sendStatus(200);
};

export const promoteUserToTutor: RequestHandler = async (req, res) => {
	const { userID } = req.params;
	if (!isValidObjectId(userID)) {
		return res.status(400).json({ message: "Invalid user ID" });
	}
	const user = await User.findById(userID);
	if (!user) return res.sendStatus(404);
	const existingTutor = await Tutor.findOne({ email: user.email });
	if (existingTutor) {
		return res.status(400).json({ message: "A tutor with this email already exists." });
	}
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
	if (user.tutors?.length) {
		await refreshTutorUserCounts(user.tutors);
	}
	await user.deleteOne();
	const tutor = await Tutor.findById(insertResult.insertedId);
	return res.status(201).json({ tutor });
};
