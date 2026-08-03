// src/routes/userRoutes.ts
import type { Router } from "express";
import express from "express";
import { logout as logoutUser } from "../controllers/auth/authController.js";
import {
	createPythonProject,
	createPythonProjectReview,
	deletePythonProject,
	getManagedPythonProject,
	getPythonProject,
	getSharedPythonProject,
	getVisiblePythonProjectReview,
	listManagedPythonProjects,
	listPythonProjects,
	listVisiblePythonProjectReviews,
	updatePythonProject,
	updatePythonProjectReview,
	updatePythonProjectShare
} from "../controllers/users/pythonProjectController.js";
import {
	createUser,
	getAllUsers,
	getLoggedInUser,
	updateUser,
	updateUserAsTutor
} from "../controllers/users/userController.js";
import {
	createUserScheduledSession,
	createUserSessionNote,
	deleteOwnUser,
	deleteUserAsAdmin,
	deleteUserAsTutor,
	getLoggedInUserCommunications,
	getUserRecentSessionNotes,
	getUserSchedule,
	getUsersOfTutor,
	promoteUserToTutor,
	setUserCourseAccess,
	setUserCourseProgress,
	setUserRecipientAssociation,
	setUserTutors,
	updateUserScheduledSession
} from "../controllers/users/userExtraController.js";
import {
	validAccountSession,
	validAdmin,
	validCurrentUserTarget,
	validTutor,
	validTutorOrAdminSession,
	validUser
} from "../middleware/auth.js";
import { withCodeIdeProjectPayloadReservation } from "../middleware/projectPayload.js";
import {
	createSignupLimiter,
	createUserCourseAccessLimiter
} from "../middleware/rateLimiters.js";

const router: Router = express.Router();

const validProjectAccountSession: express.RequestHandler = (req, res, next) => {
	if (
		req.currentAdmin
		|| req.currentTutor
		|| req.currentUser
		|| req.currentCourseCodeLearner
	) {
		next();
		return;
	}
	return validAccountSession(req, res, next);
};

const validManagedProjectSession: express.RequestHandler = (req, res, next) => {
	if (req.currentAdmin || req.currentTutor) {
		next();
		return;
	}
	return validTutorOrAdminSession(req, res, next);
};

// Rate limiter for sensitive endpoints (e.g. 100 requests per 15 minutes)
const userCourseAccessLimiter = createUserCourseAccessLimiter();
const signupLimiter = createSignupLimiter();

// Create a user
router.post("/", signupLimiter, createUser);

// Get logged in user communications
router.get("/loggedin/communications", validUser, getLoggedInUserCommunications);

// Read-only public Code IDE project links created by signed-in students.
router.get("/python-projects/shared/:shareID", getSharedPythonProject);

// Persist logged-in account Code IDE projects. Keep these before the
// managed /:userID/python-projects routes so "loggedin" is not parsed as an ID.
router.get("/loggedin/python-projects", validAccountSession, listPythonProjects);
router.post(
	"/loggedin/python-projects",
	validProjectAccountSession,
	withCodeIdeProjectPayloadReservation(createPythonProject)
);
router.get("/loggedin/python-projects/:projectID", validAccountSession, getPythonProject);
router.put(
	"/loggedin/python-projects/:projectID",
	validProjectAccountSession,
	withCodeIdeProjectPayloadReservation(updatePythonProject)
);
router.put(
	"/loggedin/python-projects/:projectID/share",
	validProjectAccountSession,
	withCodeIdeProjectPayloadReservation(updatePythonProjectShare)
);
router.delete(
	"/loggedin/python-projects/:projectID",
	validProjectAccountSession,
	withCodeIdeProjectPayloadReservation(deletePythonProject)
);
router.get("/loggedin/python-project-reviews", validAccountSession, listVisiblePythonProjectReviews);
router.get(
	"/loggedin/python-project-reviews/:reviewID",
	validAccountSession,
	getVisiblePythonProjectReview
);

// Get users belonging to a given tutor
router.get("/oftutor/:tutorID", validTutorOrAdminSession, getUsersOfTutor);

// Full account lists contain private learner information.
router.get("/all", validAdmin, getAllUsers);

// Update user info by the user themselves
router.put("/user/:userID", validUser, validCurrentUserTarget, updateUser);

// Update non-security profile fields for one of the tutor's own students.
router.put("/tutor/:userID", validTutor, updateUserAsTutor);

// Update tutor assignments for a user (admin only)
router.put("/:userID/tutors", validAdmin, setUserTutors);

// Update recipient association for a user (admin only)
router.put("/:userID/recipient", validAdmin, setUserRecipientAssociation);

// Promote a user to tutor (admin only)
router.post("/:userID/promote", validAdmin, promoteUserToTutor);

// Allow tutors and admins to manage course visibility for their students
router.put("/:userID/courses", userCourseAccessLimiter, validTutorOrAdminSession, setUserCourseAccess);
router.put("/:userID/course-progress", userCourseAccessLimiter, validTutorOrAdminSession, setUserCourseProgress);

// Allow tutors and admins to manage student schedules and private note-only logs
router.get("/:userID/schedule", validTutorOrAdminSession, getUserSchedule);
router.post("/:userID/schedule", validTutorOrAdminSession, createUserScheduledSession);
router.put("/:userID/schedule/:sessionID", validTutorOrAdminSession, updateUserScheduledSession);
router.get("/:userID/session-notes/recent", validTutorOrAdminSession, getUserRecentSessionNotes);
router.post("/:userID/session-notes", validTutorOrAdminSession, createUserSessionNote);

// Allow tutors and admins to review saved student Code IDE projects without editing student-owned files
router.get("/:userID/python-projects", validTutorOrAdminSession, listManagedPythonProjects);
router.get(
	"/:userID/python-projects/:projectID",
	validTutorOrAdminSession,
	getManagedPythonProject
);
router.post(
	"/:userID/python-projects/:projectID/review",
	validManagedProjectSession,
	withCodeIdeProjectPayloadReservation(createPythonProjectReview)
);
router.put(
	"/:userID/python-projects/:projectID/review/:reviewID",
	validManagedProjectSession,
	withCodeIdeProjectPayloadReservation(updatePythonProjectReview)
);

// Delete the user by the user themselves
router.delete("/user/:userID", validUser, deleteOwnUser);

// Delete the user by the tutor
router.delete("/tutor/:userID", validTutor, deleteUserAsTutor);

// Delete the user by the admin
router.delete("/admin/:userID", validAdmin, deleteUserAsAdmin);

// Get logged in user
router.get("/loggedin", validUser, getLoggedInUser);

// Logout
router.delete("/logout", validUser, logoutUser);

export const userRoutes = router;
