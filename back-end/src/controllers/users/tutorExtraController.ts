// src/controllers/users/tutorExtraController.ts
import type { RequestHandler } from "express";
import { Types } from "mongoose";
import { Tutor } from "../../models/schemas/Tutor.js";
import { User } from "../../models/schemas/User.js";

async function pruneUsersCourseAccess(userIDs: Array<Types.ObjectId | string>) {
	const uniqueIds = [...new Set(userIDs.map(id => id.toString()))];
	if (uniqueIds.length === 0) return;
	const objectIds = uniqueIds.map(id => new Types.ObjectId(id));
	const users = await User.find({ _id: { $in: objectIds } }, { tutors: 1, allowedCourses: 1 });
	if (users.length === 0) return;

	const tutorIds = new Set<string>();
	for (const user of users) {
		for (const tutorId of user.tutors ?? []) tutorIds.add(tutorId.toString());
	}

	const tutorDocs = tutorIds.size
		? await Tutor.find({ _id: { $in: [...tutorIds].map(id => new Types.ObjectId(id)) } }, { coursePermissions: 1 })
		: [];
	const tutorMap = new Map<string, string[]>(
		tutorDocs.map(doc => [doc._id.toString(), doc.coursePermissions ?? []])
	);

	await Promise.all(
		users.map(async (user) => {
			const allowed = new Set<string>();
			for (const tutorId of user.tutors ?? []) {
				const permissions = tutorMap.get(tutorId.toString());
				if (permissions) permissions.forEach(course => allowed.add(course));
			}

			let updated = false;
			if (allowed.size === 0) {
				if (user.allowedCourses.length) {
					user.allowedCourses = [];
					updated = true;
				}
			}
			else {
				const filtered = user.allowedCourses.filter(course => allowed.has(course));
				if (filtered.length !== user.allowedCourses.length) {
					user.allowedCourses = filtered;
					updated = true;
				}
			}

			if (updated) await user.save();
		})
	);
}

export const setTutorCourses: RequestHandler = async (req, res) => {
	const { tutorID } = req.params;
	const { courseIDs } = req.body as { courseIDs?: string[] };
	if (!Types.ObjectId.isValid(tutorID)) return res.status(400).json({ message: "Invalid tutor ID" });
	if (!Array.isArray(courseIDs)) return res.status(400).json({ message: "courseIDs must be an array" });

	const tutor = await Tutor.findById(tutorID);
	if (!tutor) return res.sendStatus(404);

	tutor.coursePermissions = [...new Set(courseIDs.map(id => id?.trim()).filter((id): id is string => !!id))];
	await tutor.save();

	const impactedUsers = await User.find({ tutors: tutor._id }, { _id: 1 });
	if (impactedUsers.length) {
		await pruneUsersCourseAccess(impactedUsers.map(u => u._id));
	}

	res.json({ coursePermissions: tutor.coursePermissions });
};

export const demoteTutorToUser: RequestHandler = async (req, res) => {
	const { tutorID } = req.params;
	if (!Types.ObjectId.isValid(tutorID)) return res.status(400).json({ message: "Invalid tutor ID" });
	const tutor = await Tutor.findById(tutorID);
	if (!tutor) return res.sendStatus(404);

	if (await User.exists({ email: tutor.email })) {
		return res.status(409).json({ message: "User with this email already exists" });
	}

	const impactedUsers = await User.find({ tutors: tutor._id }, { _id: 1 });
	await User.updateMany({ tutors: tutor._id }, { $pull: { tutors: tutor._id } });

	const user = new User({
		name: tutor.name,
		email: tutor.email,
		age: tutor.age,
		state: tutor.state,
		password: tutor.password,
		role: "user",
		tutors: [],
		allowedCourses: []
	} as any);
	(user as any).skipPasswordHash = true;

	await user.save();
	await tutor.deleteOne();

	if (impactedUsers.length) await pruneUsersCourseAccess(impactedUsers.map(u => u._id));

	res.status(201).json({ user });
};
