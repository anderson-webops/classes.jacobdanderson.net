// src/controllers/users/userController.ts
import type { RequestHandler } from "express";
import { User } from "../../models/schemas/User.js";
import { makeEntityController } from "../common/entityController.js";

const controller = makeEntityController({
	model: User,
	idParam: "userID",
	sessionKey: "userID",
	responseKey: "currentUser"
});

export const createUser = controller.create;
export const getAllUsers = controller.getAll;
export const updateUser = controller.update;
export const deleteUser = controller.remove;

export const getLoggedInUser: RequestHandler = async (req, res) => {
	const id = req.session?.userID;
	if (!id) return res.sendStatus(404);
	try {
		const doc = await User.findById(id).populate("tutors", "name email");
		if (!doc) return res.sendStatus(404);
		const assignedTutors = Array.isArray(doc.tutors)
			? (doc.tutors as any[]).map(tutor => ({
					_id: tutor._id.toString(),
					name: tutor.name,
					email: tutor.email
				}))
			: [];
		const payload = doc.toJSON();
		payload.tutors = assignedTutors.map(t => t._id);
		return res.json({ currentUser: payload, assignedTutors });
	}
	catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
};
