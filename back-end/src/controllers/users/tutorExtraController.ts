// src/controllers/users/tutorExtraController.ts
import type { RequestHandler } from "express";
import { Tutor } from "../../models/schemas/Tutor.js";
import { User } from "../../models/schemas/User.js";

export const promoteUserToTutor: RequestHandler = async (req, res) => {
	const { userID } = req.params;
	const user = await User.findById(userID);
	if (!user) {
		return res.sendStatus(404);
	}

	const conflict = await Tutor.findOne({ email: user.email });
	if (conflict) {
		return res.status(409).json({ message: "A tutor with this email already exists." });
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

	await User.findByIdAndDelete(userID);

	const tutor = await Tutor.findById(insertResult.insertedId);
	if (!tutor) {
		return res.sendStatus(500);
	}
	res.status(201).json({ tutor });
};
