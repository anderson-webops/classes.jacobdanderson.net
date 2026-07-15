// src/routes/accountRoutes.ts

import type { RequestHandler } from "express";
import type { CustomSession } from "../types/session/CustomSession.js";
import { Router } from "express";
import { changeEmail, changePassword, checkEmail, login, logout } from "../controllers/auth/authController.js";
import { Admin } from "../models/schemas/Admin.js";
import { Tutor } from "../models/schemas/Tutor.js";
import { User } from "../models/schemas/User.js";

const router = Router();
const objectIdPattern = /^[a-f\d]{24}$/i;

async function validExistingSessionId(Model: { exists: (query: { _id: string }) => PromiseLike<unknown> | unknown }, id: unknown): Promise<string | null> {
	if (typeof id !== "string" || !objectIdPattern.test(id)) {
		return null;
	}

	return (await Model.exists({ _id: id })) ? id : null;
}

// Route to check if email is available (useful for account creation)
router.post("/checkEmail", checkEmail);

// Route to change email (could be used by users, tutors, or admins)
router.post("/changeEmail/:ID", changeEmail);

// Route to change password
router.post("/changePassword/:ID", changePassword);

// Route to handle login
router.post("/login", login);

router.delete("/logout", logout);

const currentAccount: RequestHandler = async (req, res) => {
	const session = req.session as CustomSession | undefined;
	if (!session) {
		return res.json({ adminID: null, tutorID: null, userID: null });
	}

	try {
		const [adminID, tutorID, userID] = await Promise.all([
			validExistingSessionId(Admin, session.adminID),
			validExistingSessionId(Tutor, session.tutorID),
			validExistingSessionId(User, session.userID)
		]);

		if (!adminID) delete session.adminID;
		if (!tutorID) delete session.tutorID;
		if (!userID) delete session.userID;

		return res.json({ adminID, tutorID, userID });
	}
	catch (error) {
		console.error("Error resolving current account session:", error);
		return res.status(500).json({ message: "Server error while resolving account session" });
	}
};

router.get("/me", currentAccount);

// Export the router
export const accountRoutes = router;
