// src/routes/adminRoutes.ts

import express from "express";
import {
	createAdmin,
	deleteAdmin,
	getAllAdmins,
	getLoggedInAdmin,
	updateAdmin
} from "../controllers/users/adminController.js";
import { validAdmin, validAdminTarget } from "../middleware/auth.js";

const router = express.Router();

// Existing admins create additional admin accounts. Initial bootstrap uses
// the create-admin operator script and is never exposed as a public API.
router.post("/", validAdmin, createAdmin);

// Route to get all admins (protected)
router.get("/", validAdmin, getAllAdmins);

// Route to update an admin's information (protected)
router.put("/:adminID", validAdmin, validAdminTarget, updateAdmin);

// Route to delete an admin (protected)
router.delete("/remove/:adminID", validAdmin, validAdminTarget, deleteAdmin);

// Route to get the currently logged-in admin (protected)
router.get("/loggedin", validAdmin, getLoggedInAdmin);

// Export the router
export const adminRoutes = router;
