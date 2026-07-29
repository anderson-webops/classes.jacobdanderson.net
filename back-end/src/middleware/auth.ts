// src/middleware/auth.ts
import type { RequestHandler } from "express";
import { Admin } from "../models/schemas/Admin.js";
import { CourseCodeLearner } from "../models/schemas/CourseCodeLearner.js";
import { Tutor } from "../models/schemas/Tutor.js";
import { User } from "../models/schemas/User.js";
import {
	accountSessionVersionMatches,
	clearSessionRoles
} from "../utils/accountSessions.js";
import { findUsableCourseAccessCodeByID } from "../utils/courseAccessCodes.js";

function rejectInvalidAccountSession(
	req: Parameters<RequestHandler>[0],
	res: Parameters<RequestHandler>[1],
	message: string
) {
	if (req.session) clearSessionRoles(req.session as any);
	res.status(403).json({ message });
}

async function loadValidCourseCodeLearner(learnerID: string) {
	const learner = await CourseCodeLearner.findById(learnerID);
	if (!learner) return null;

	const accessCode = await findUsableCourseAccessCodeByID(
		learner.accessCode.toString()
	);
	if (!accessCode || accessCode.courseID !== learner.courseID) return null;
	return learner;
}

// Middleware to validate User
export const validUser: RequestHandler = async (req, res, next) => {
	if (!req.session?.userID) {
		res.status(403).json({ message: "Not logged in or session expired" });
		return;
	}
	try {
		const user = await User.findById(req.session.userID);
		if (!user) {
			rejectInvalidAccountSession(req, res, "User account not found");
			return;
		}
		if (!accountSessionVersionMatches(req.session as any, user)) {
			rejectInvalidAccountSession(req, res, "User session has been revoked");
			return;
		}
		req.currentUser = user;
		next();
	}
	catch (error) {
		console.error("Error in validUser middleware:", error);
		res.status(500).json({ message: "Server error while validating user" });
	}
};

// Middleware to validate Tutor
export const validTutor: RequestHandler = async (req, res, next) => {
	if (!req.session?.tutorID) {
		res.status(403).json({ message: "Not logged in or session expired" });
		return;
	}
	try {
		const tutor = await Tutor.findById(req.session.tutorID);
		if (!tutor) {
			rejectInvalidAccountSession(req, res, "Tutor account not found");
			return;
		}
		if (!accountSessionVersionMatches(req.session as any, tutor)) {
			rejectInvalidAccountSession(req, res, "Tutor session has been revoked");
			return;
		}
		req.currentTutor = tutor;
		next();
	}
	catch (error) {
		console.error("Error in validTutor middleware:", error);
		res.status(500).json({ message: "Server error while validating tutor" });
	}
};

// Middleware to allow either tutor or admin sessions
export const validTutorOrAdminSession: RequestHandler = async (req, res, next) => {
	if (req.session?.adminID) {
		try {
			const admin = await Admin.findById(req.session.adminID);
			if (!admin) {
				rejectInvalidAccountSession(req, res, "Admin account not found");
				return;
			}
			if (!accountSessionVersionMatches(req.session as any, admin)) {
				rejectInvalidAccountSession(req, res, "Admin session has been revoked");
				return;
			}
			req.currentAdmin = admin;
			next();
		}
		catch (error) {
			console.error("Error in validTutorOrAdminSession middleware (admin):", error);
			res.status(500).json({ message: "Server error while validating admin" });
		}
		return;
	}

	if (req.session?.tutorID) {
		try {
			const tutor = await Tutor.findById(req.session.tutorID);
			if (!tutor) {
				rejectInvalidAccountSession(req, res, "Tutor account not found");
				return;
			}
			if (!accountSessionVersionMatches(req.session as any, tutor)) {
				rejectInvalidAccountSession(req, res, "Tutor session has been revoked");
				return;
			}
			req.currentTutor = tutor;
			next();
		}
		catch (error) {
			console.error("Error in validTutorOrAdminSession middleware (tutor):", error);
			res.status(500).json({ message: "Server error while validating tutor" });
		}
		return;
	}

	res.status(403).json({ message: "Not logged in or session expired" });
};

// Middleware to allow any signed-in account role.
export const validAccountSession: RequestHandler = async (req, res, next) => {
	if (req.session?.adminID) {
		try {
			const admin = await Admin.findById(req.session.adminID);
			if (!admin) {
				rejectInvalidAccountSession(req, res, "Admin account not found");
				return;
			}
			if (!accountSessionVersionMatches(req.session as any, admin)) {
				rejectInvalidAccountSession(req, res, "Admin session has been revoked");
				return;
			}
			req.currentAdmin = admin;
			next();
		}
		catch (error) {
			console.error("Error in validAccountSession middleware (admin):", error);
			res.status(500).json({ message: "Server error while validating admin" });
		}
		return;
	}

	if (req.session?.tutorID) {
		try {
			const tutor = await Tutor.findById(req.session.tutorID);
			if (!tutor) {
				rejectInvalidAccountSession(req, res, "Tutor account not found");
				return;
			}
			if (!accountSessionVersionMatches(req.session as any, tutor)) {
				rejectInvalidAccountSession(req, res, "Tutor session has been revoked");
				return;
			}
			req.currentTutor = tutor;
			next();
		}
		catch (error) {
			console.error("Error in validAccountSession middleware (tutor):", error);
			res.status(500).json({ message: "Server error while validating tutor" });
		}
		return;
	}

	if (req.session?.userID) {
		try {
			const user = await User.findById(req.session.userID);
			if (!user) {
				rejectInvalidAccountSession(req, res, "User account not found");
				return;
			}
			if (!accountSessionVersionMatches(req.session as any, user)) {
				rejectInvalidAccountSession(req, res, "User session has been revoked");
				return;
			}
			req.currentUser = user;
			next();
		}
		catch (error) {
			console.error("Error in validAccountSession middleware (user):", error);
			res.status(500).json({ message: "Server error while validating user" });
		}
		return;
	}

	if (req.session?.courseCodeLearnerID) {
		try {
			const learner = await loadValidCourseCodeLearner(
				req.session.courseCodeLearnerID
			);
			if (!learner) {
				delete req.session.courseCodeLearnerID;
				res.status(403).json({
					message: "Course code session not found or no longer active"
				});
				return;
			}
			req.currentCourseCodeLearner = learner;
			next();
		}
		catch (error) {
			console.error(
				"Error in validAccountSession middleware (course code learner):",
				error
			);
			res.status(500).json({
				message: "Server error while validating course code session"
			});
		}
		return;
	}

	res.status(403).json({ message: "Not logged in or session expired" });
};

// Middleware to validate Admin
export const validAdmin: RequestHandler = async (req, res, next) => {
	if (!req.session?.adminID) {
		res.status(403).json({ message: "Not logged in or session expired" });
		return;
	}
	try {
		const admin = await Admin.findById(req.session.adminID);
		if (!admin) {
			rejectInvalidAccountSession(req, res, "Admin account not found");
			return;
		}
		if (!accountSessionVersionMatches(req.session as any, admin)) {
			rejectInvalidAccountSession(req, res, "Admin session has been revoked");
			return;
		}
		req.currentAdmin = admin;
		next();
	}
	catch (error) {
		console.error("Error in validAdmin middleware:", error);
		res.status(500).json({ message: "Server error while validating admin" });
	}
};

/**
 * Allow update/delete if:
 *  • a live admin account is in session, OR
 *  • a live tutor account in session matches the :tutorID param
 */
export const validTutorOrAdmin: RequestHandler = async (req, res, next) => {
	const { tutorID } = req.params;

	if (req.session?.adminID) {
		try {
			const admin = await Admin.findById(req.session.adminID);
			if (!admin) {
				rejectInvalidAccountSession(req, res, "Admin account not found");
				return;
			}
			if (!accountSessionVersionMatches(req.session as any, admin)) {
				rejectInvalidAccountSession(req, res, "Admin session has been revoked");
				return;
			}
			req.currentAdmin = admin;
			return next();
		}
		catch (error) {
			console.error("Error validating admin account:", error);
			return res.status(500).json({ message: "Server error while validating admin" });
		}
	}

	if (req.session?.tutorID === tutorID) {
		try {
			const tutor = await Tutor.findById(req.session.tutorID);
			if (!tutor) {
				rejectInvalidAccountSession(req, res, "Tutor account not found");
				return;
			}
			if (!accountSessionVersionMatches(req.session as any, tutor)) {
				rejectInvalidAccountSession(req, res, "Tutor session has been revoked");
				return;
			}
			req.currentTutor = tutor;
			return next();
		}
		catch (error) {
			console.error("Error validating tutor account:", error);
			return res.status(500).json({ message: "Server error while validating tutor" });
		}
	}

	res.status(403).json({ message: "Not authorized to perform this action." });
};

export const validCurrentUserTarget: RequestHandler = (req, res, next) => {
	const userID = Array.isArray(req.params.userID)
		? req.params.userID[0]
		: req.params.userID;
	if (!req.currentUser || req.currentUser._id.toString() !== userID) {
		return res.status(403).json({ message: "You can only update your own account" });
	}
	next();
};

export const validAdminTarget: RequestHandler = (req, res, next) => {
	const adminID = Array.isArray(req.params.adminID)
		? req.params.adminID[0]
		: req.params.adminID;
	const admin = req.currentAdmin;
	if (
		!admin
		|| (
			admin._id.toString() !== adminID
			&& admin.editAdmins !== true
		)
	) {
		return res.status(403).json({
			message: "You can only manage your own admin account"
		});
	}
	next();
};
