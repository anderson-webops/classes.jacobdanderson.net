import type { RequestHandler } from "express";

export const requireCodeIdeAccountMatch: RequestHandler = (req, res, next) => {
	const expected = req.get("X-Code-IDE-Owner");
	if (expected === undefined) {
		next();
		return;
	}
	const actual = req.currentAdmin
		? `admin:${req.currentAdmin._id}`
		: req.currentTutor
			? `tutor:${req.currentTutor._id}`
			: req.currentUser
				? req.currentUser._id.toString()
				: req.currentCourseCodeLearner
					? `courseCodeLearner:${req.currentCourseCodeLearner._id}`
					: null;
	if (!actual || expected !== actual) {
		res.status(409).json({ message: "Workspace account changed. Reopen the workspace before syncing." });
		return;
	}
	next();
};
