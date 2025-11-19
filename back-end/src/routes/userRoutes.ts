// src/routes/userRoutes.ts
import express from "express";
import { logout as logoutUser } from "../controllers/auth/authController.js";
import {
	createUser,
	deleteUser,
	getAllUsers,
	getLoggedInUser,
	updateUser
} from "../controllers/users/userController.js";
import {
	assignTutorToUser,
	deleteUsersUnderTutor,
	getUsersOfTutor,
	promoteUserToTutor,
	removeTutorFromUser,
	setTutorsForUser
} from "../controllers/users/userExtraController.js";
import { validAdmin, validTutor, validTutorOrAdmin, validUser } from "../middleware/auth.js";

const router = express.Router();

// Create a user
router.post("/", createUser);

// Get users belonging to a given tutor
router.get("/oftutor/:tutorID", validTutorOrAdmin, getUsersOfTutor);

// Get all users
router.get("/all", getAllUsers);

// Update user info by the user themselves
router.put("/user/:userID", validUser, updateUser);

// Update user info by the tutor
router.put("/tutor/:userID", validTutor, updateUser);

// Admin: assign tutors to a user
router.put("/admin/:userID/tutors", validAdmin, setTutorsForUser);
router.put("/admin/:userID/tutors/:tutorID", validAdmin, assignTutorToUser);
router.delete("/admin/:userID/tutors/:tutorID", validAdmin, removeTutorFromUser);

// Admin: promote a user into a tutor account
router.post("/admin/:userID/promote", validAdmin, promoteUserToTutor);

// Delete the user by the user themselves
router.delete("/user/:userID", validUser, deleteUser);

// Delete the user by the tutor
router.delete("/tutor/:userID", validTutor, deleteUser);

// Remove all references to a tutor from assigned users (admin only)
router.delete("/under/:tutorID", validAdmin, deleteUsersUnderTutor);

// Get logged in user
router.get("/loggedin", validUser, getLoggedInUser);

// Logout
router.delete("/logout", validUser, logoutUser);

export const userRoutes = router;
