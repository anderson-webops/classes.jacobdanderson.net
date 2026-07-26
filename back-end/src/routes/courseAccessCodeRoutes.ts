import express from "express";
import {
	createCourseAccessCode,
	getCurrentCourseCodeLearner,
	listCourseAccessCodes,
	redeemCourseAccessCode,
	updateCourseAccessCode
} from "../controllers/users/courseAccessCodeController.js";
import { validTutorOrAdminSession } from "../middleware/auth.js";
import {
	createCourseCodeRedemptionLimiter,
	createUserCourseAccessLimiter
} from "../middleware/rateLimiters.js";

const router = express.Router();
const managementLimiter = createUserCourseAccessLimiter();
const redemptionLimiter = createCourseCodeRedemptionLimiter();

router.get("/me", getCurrentCourseCodeLearner);
router.post("/redeem", redemptionLimiter, redeemCourseAccessCode);
router.get("/codes", validTutorOrAdminSession, listCourseAccessCodes);
router.post(
	"/codes",
	managementLimiter,
	validTutorOrAdminSession,
	createCourseAccessCode
);
router.patch(
	"/codes/:codeID",
	managementLimiter,
	validTutorOrAdminSession,
	updateCourseAccessCode
);

export const courseAccessCodeRoutes = router;
