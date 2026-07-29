import type { RequestHandler } from "express";
import type { QueryFilter } from "mongoose";
import type { ICourseAccessCode } from "../../types/entities/ICourseAccessCode.js";
import type { ICourseCodeLearner } from "../../types/entities/ICourseCodeLearner.js";
import type { CustomSession } from "../../types/session/CustomSession.js";
import { Types } from "mongoose";
import { z } from "zod";
import { CourseAccessCode } from "../../models/schemas/CourseAccessCode.js";
import { CourseCodeLearner } from "../../models/schemas/CourseCodeLearner.js";
import { clearSessionRoles } from "../../utils/accountSessions.js";
import {
	courseAccessCodeHint,
	createCourseAccessCodeValue,
	findUsableCourseAccessCodeByHash,
	findUsableCourseAccessCodeByID,
	hashCourseAccessCode,
	normalizeCourseAccessCode,
	normalizeCourseCodeUsername,
	normalizeCourseID
} from "../../utils/courseAccessCodes.js";
import { recordSecurityAuditEvent } from "../../utils/securityAudit.js";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_CODE_CREATION_ATTEMPTS = 5;
const createCodePayloadSchema = z.object({
	courseID: z.string(),
	label: z.string().trim().max(80).optional()
});
const updateCodePayloadSchema = z.object({
	active: z.boolean().optional(),
	label: z.string().trim().min(1).max(80).optional()
}).refine(value => value.active !== undefined || value.label !== undefined, {
	message: "Provide an active state or label"
});
const redeemCodePayloadSchema = z.object({
	code: z.string(),
	username: z.string()
});

function serializeCourseAccessCode(code: ICourseAccessCode) {
	return {
		_id: code._id.toString(),
		codeHint: code.codeHint,
		courseID: code.courseID,
		label: code.label,
		createdByRole: code.createdByRole,
		createdByName: code.createdByName,
		active: code.active,
		createdAt: code.createdAt,
		updatedAt: code.updatedAt
	};
}

export function serializeCourseCodeLearner(
	learner: ICourseCodeLearner,
	codeLabel?: string
) {
	return {
		_id: learner._id.toString(),
		username: learner.username,
		courseID: learner.courseID,
		courseAccess: [learner.courseID],
		courseStatus: { [learner.courseID]: "current" as const },
		role: "course-code" as const,
		codeLabel,
		createdAt: learner.createdAt,
		lastSeenAt: learner.lastSeenAt
	};
}

function getCodeIDParam(
	req: Parameters<RequestHandler>[0],
	res: Parameters<RequestHandler>[1]
) {
	const value = req.params.codeID;
	const codeID = Array.isArray(value) ? value[0] : value;
	if (typeof codeID !== "string" || !Types.ObjectId.isValid(codeID)) {
		res.status(400).json({ message: "Invalid course access code ID" });
		return null;
	}
	return codeID;
}

function staffCodeQuery(
	req: Parameters<RequestHandler>[0],
	codeID?: string
): QueryFilter<ICourseAccessCode> | null {
	const query: QueryFilter<ICourseAccessCode> = {};
	if (codeID) query._id = new Types.ObjectId(codeID);
	if (req.currentAdmin) return query;
	if (!req.currentTutor) return null;
	return {
		...query,
		createdBy: req.currentTutor._id,
		createdByRole: "tutor"
	};
}

function isDuplicateKeyError(error: unknown) {
	return !!error
		&& typeof error === "object"
		&& "code" in error
		&& error.code === 11000;
}

export const listCourseAccessCodes: RequestHandler = async (req, res) => {
	const query = staffCodeQuery(req);
	if (!query) return res.status(403).json({ message: "Tutor or admin session required" });

	const codes = await CourseAccessCode.find(query)
		.sort({ updatedAt: -1 })
		.limit(250);
	res.json({ codes: codes.map(serializeCourseAccessCode) });
};

export const createCourseAccessCode: RequestHandler = async (req, res) => {
	const parsed = createCodePayloadSchema.safeParse(req.body ?? {});
	if (!parsed.success) {
		return res.status(400).json({
			message: "Invalid course access code payload",
			issues: parsed.error.issues
		});
	}

	const courseID = normalizeCourseID(parsed.data.courseID);
	if (!courseID) {
		return res.status(400).json({ message: "Choose a valid course" });
	}

	const staff = req.currentAdmin
		? {
				id: req.currentAdmin._id,
				name: req.currentAdmin.name,
				role: "admin" as const
			}
		: req.currentTutor
			? {
					id: req.currentTutor._id,
					name: req.currentTutor.name,
					role: "tutor" as const
				}
			: null;
	if (!staff) {
		return res.status(403).json({ message: "Tutor or admin session required" });
	}

	if (
		staff.role === "tutor"
		&& !(req.currentTutor?.coursePermissions ?? []).includes(courseID)
	) {
		return res.status(403).json({
			message: "This course is not enabled for your tutor account"
		});
	}

	for (let attempt = 0; attempt < MAX_CODE_CREATION_ATTEMPTS; attempt += 1) {
		const code = createCourseAccessCodeValue();
		const compactCode = normalizeCourseAccessCode(code);
		if (!compactCode) continue;

		try {
			const record = await CourseAccessCode.create({
				codeHash: hashCourseAccessCode(compactCode),
				codeHint: courseAccessCodeHint(compactCode),
				courseID,
				label: parsed.data.label || courseID,
				createdBy: staff.id,
				createdByRole: staff.role,
				createdByName: staff.name,
				active: true
			});
			await recordSecurityAuditEvent(req, {
				action: "course-access-code.create",
				metadata: {
					courseID,
					label: record.label
				}
			});
			return res.status(201).json({
				code,
				accessCode: serializeCourseAccessCode(record)
			});
		}
		catch (error) {
			if (!isDuplicateKeyError(error)) throw error;
		}
	}

	return res.status(503).json({
		message: "Unable to create a unique course code. Please try again."
	});
};

export const updateCourseAccessCode: RequestHandler = async (req, res) => {
	const codeID = getCodeIDParam(req, res);
	if (!codeID) return;
	const query = staffCodeQuery(req, codeID);
	if (!query) return res.status(403).json({ message: "Tutor or admin session required" });

	const parsed = updateCodePayloadSchema.safeParse(req.body ?? {});
	if (!parsed.success) {
		return res.status(400).json({
			message: "Invalid course access code update",
			issues: parsed.error.issues
		});
	}

	const code = await CourseAccessCode.findOne(query);
	if (!code) return res.sendStatus(404);
	if (parsed.data.active !== undefined) code.active = parsed.data.active;
	if (parsed.data.label !== undefined) code.label = parsed.data.label;
	await code.save();
	await recordSecurityAuditEvent(req, {
		action: "course-access-code.update",
		metadata: {
			active: code.active,
			courseID: code.courseID
		}
	});

	res.json({ accessCode: serializeCourseAccessCode(code) });
};

export const redeemCourseAccessCode: RequestHandler = async (req, res) => {
	const parsed = redeemCodePayloadSchema.safeParse(req.body ?? {});
	if (!parsed.success) {
		return res.status(400).json({ message: "Enter a course code and username" });
	}

	const compactCode = normalizeCourseAccessCode(parsed.data.code);
	const normalizedUsername = normalizeCourseCodeUsername(parsed.data.username);
	if (!normalizedUsername) {
		return res.status(400).json({
			message: "Use 2–40 letters, numbers, spaces, periods, underscores, or hyphens for the username"
		});
	}
	if (!compactCode) {
		return res.status(403).json({ message: "That course code is not active" });
	}

	const accessCode = await findUsableCourseAccessCodeByHash(
		hashCourseAccessCode(compactCode)
	);
	if (!accessCode) {
		return res.status(403).json({ message: "That course code is not active" });
	}

	let learner = await CourseCodeLearner.findOne({
		accessCode: accessCode._id,
		usernameKey: normalizedUsername.usernameKey
	});
	const now = new Date();
	if (learner) {
		learner.lastSeenAt = now;
		await learner.save();
	}
	else {
		try {
			learner = await CourseCodeLearner.create({
				accessCode: accessCode._id,
				username: normalizedUsername.username,
				usernameKey: normalizedUsername.usernameKey,
				courseID: accessCode.courseID,
				lastSeenAt: now
			});
		}
		catch (error) {
			if (!isDuplicateKeyError(error)) throw error;
			learner = await CourseCodeLearner.findOne({
				accessCode: accessCode._id,
				usernameKey: normalizedUsername.usernameKey
			});
		}
	}

	if (!learner) {
		return res.status(503).json({ message: "Unable to open the course workspace" });
	}

	const session = req.session as CustomSession;
	clearSessionRoles(session);
	session.courseCodeLearnerID = learner._id.toString();
	const options = ((req as any).sessionOptions ??= {});
	options.maxAge = THIRTY_DAYS_MS;

	res.json({
		currentCourseLearner: serializeCourseCodeLearner(learner, accessCode.label)
	});
};

export const getCurrentCourseCodeLearner: RequestHandler = async (req, res) => {
	const session = req.session as CustomSession | undefined;
	const learnerID = session?.courseCodeLearnerID;
	if (!session || !learnerID || !Types.ObjectId.isValid(learnerID)) {
		if (session) delete session.courseCodeLearnerID;
		return res.json({ currentCourseLearner: null });
	}

	const learner = await CourseCodeLearner.findById(learnerID);
	if (!learner) {
		delete session.courseCodeLearnerID;
		return res.json({ currentCourseLearner: null });
	}

	const accessCode = await findUsableCourseAccessCodeByID(
		learner.accessCode.toString()
	);
	if (!accessCode || accessCode.courseID !== learner.courseID) {
		delete session.courseCodeLearnerID;
		return res.json({ currentCourseLearner: null });
	}

	res.json({
		currentCourseLearner: serializeCourseCodeLearner(learner, accessCode.label)
	});
};
