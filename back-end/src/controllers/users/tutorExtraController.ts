// src/controllers/users/tutorExtraController.ts
import type { RequestHandler } from "express";
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

export const setTutorCourseAccess: RequestHandler = async (req, res) => {
	const { tutorID } = req.params;
	const courseIDs = normalizeCourseIDs(req.body?.courseIDs);
	const tutor = await Tutor.findById(tutorID);
	if (!tutor) return res.sendStatus(404);
	tutor.courseAccess = courseIDs;
	await tutor.save();
	res.json({ courseAccess: tutor.courseAccess });
};

export const demoteTutorToUser: RequestHandler = async (req, res) => {
	const { tutorID } = req.params;
	const tutor = await Tutor.findById(tutorID);
	if (!tutor) return res.sendStatus(404);

	if (await User.exists({ email: tutor.email })) {
		return res.status(409).json({ message: "A user with this email already exists" });
	}

	const user = new User({
		name: tutor.name,
		email: tutor.email,
		age: tutor.age,
		state: tutor.state,
		password: tutor.password,
		role: "user",
		editUsers: false,
		saveEdit: "Edit",
		tutors: [],
		allowedCourses: []
	} as any);
	(user as any).skipPasswordHash = true;

	await user.save();
	await tutor.deleteOne();

	res.json({ user });
};
