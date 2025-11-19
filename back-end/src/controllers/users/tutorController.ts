// src/controllers/users/tutorController.ts
import type { RequestHandler } from "express";
import { Types } from "mongoose";
import { Tutor } from "../../models/schemas/Tutor.js";
import { User } from "../../models/schemas/User.js";
import { makeEntityController } from "../common/entityController.js";

const controller = makeEntityController({
	model: Tutor,
	idParam: "tutorID",
	sessionKey: "tutorID",
	responseKey: "currentTutor"
});

export const createTutor = controller.create;
export const getAllTutors = controller.getAll;
export const updateTutor = controller.update;
export const getLoggedInTutor = controller.getLoggedIn;

const baseDeleteTutor = controller.remove;

export const deleteTutor: RequestHandler = async (req, res, next) => {
	const { tutorID } = req.params;
	if (tutorID && Types.ObjectId.isValid(tutorID)) {
		try {
			await User.updateMany(
				{ tutors: new Types.ObjectId(tutorID) },
				{ $pull: { tutors: new Types.ObjectId(tutorID) } }
			);
		}
		catch (err) {
			console.error("Failed to remove tutor assignments", err);
		}
	}

	return baseDeleteTutor(req, res, next);
};
