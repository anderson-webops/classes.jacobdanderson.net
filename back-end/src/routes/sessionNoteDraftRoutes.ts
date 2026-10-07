import type { ErrorRequestHandler, Request, Response } from "express";
import type { DraftScope } from "../services/sessionNoteDrafting.js";
import express, { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { validAdmin, validTutorOrAdminSession } from "../middleware/auth.js";
import { productionRateLimitStore } from "../middleware/mongoRateLimitStore.js";
import { createRequestOriginGuard } from "../middleware/requestOriginGuard.js";
import { SessionNoteDraftSettings } from "../models/schemas/SessionNoteDraftSettings.js";
import { User } from "../models/schemas/User.js";
import {
	createSessionNoteDrafting,
	generateNoteDraftRequest,
	NoteDraftError,
	noteDraftRequest,
	readNoteDraftConfig
} from "../services/sessionNoteDrafting.js";

const drafting = createSessionNoteDrafting();
const router = Router();
router.use((_req, res, next) => {
	res.set("Cache-Control", "no-store");
	next();
});
router.use(createRequestOriginGuard(), validTutorOrAdminSession);
const store = productionRateLimitStore("session-note-drafting");
router.use(rateLimit({
	windowMs: 60 * 60_000,
	limit: 30,
	standardHeaders: true,
	legacyHeaders: false,
	...(store ? { store } : {}),
	keyGenerator: req => req.currentAdmin?._id.toString() ?? req.currentTutor!._id.toString(),
	skip: req => req.method === "GET",
	message: { code: "DRAFT_RATE_LIMIT", message: "Too many draft requests. Please try again later." }
}));
router.use(express.json({ limit: "4kb" }));

function failure(res: Response, error: unknown) {
	if (error instanceof NoteDraftError) {
		return res.status(error.status).json({ code: error.code, message: error.message });
	}
	return res.status(503).json({ code: "DRAFT_UNAVAILABLE", message: "AI drafting is unavailable. Your notes are unchanged." });
}

async function settings() {
	const record = await SessionNoteDraftSettings.findById("session-note-drafting").maxTimeMS(5000).lean();
	return { tutorsEnabled: record?.tutorsEnabled === true };
}

router.get("/settings", async (req, res) => {
	try {
		const config = readNoteDraftConfig();
		if (!config.siteAvailable) return res.json({ siteAvailable: false, allowed: false, ready: false, tutorsEnabled: false });
		const current = await settings();
		const hostId = req.currentAdmin ? config.adminHostId : config.tutorHosts[req.currentTutor!._id.toString()];
		return res.json({
			...current,
			siteAvailable: true,
			allowed: !!req.currentAdmin || (current.tutorsEnabled && !!hostId),
			ready: config.ready && !!hostId,
			timezone: config.timezone
		});
	}
	catch (error) { return failure(res, error); }
});

router.put("/settings", validAdmin, async (req, res) => {
	try {
		if (!readNoteDraftConfig().siteAvailable) return res.sendStatus(404);
		const parsed = z.object({ tutorsEnabled: z.boolean() }).strict().safeParse(req.body);
		if (!parsed.success) return res.status(400).json({ message: "Choose enabled or disabled for tutor drafting." });
		await SessionNoteDraftSettings.findOneAndUpdate({ _id: "session-note-drafting" }, {
			$set: parsed.data,
			$push: { changes: { $each: [{ ...parsed.data, actorId: req.currentAdmin!._id.toString(), at: new Date() }], $slice: -50 } }
		}, { upsert: true, runValidators: true, writeConcern: { w: "majority", j: true }, maxTimeMS: 5000 });
		return res.json(parsed.data);
	}
	catch (error) { return failure(res, error); }
});

async function scopeFor(req: Request, studentId: string): Promise<DraftScope> {
	const config = readNoteDraftConfig();
	if (!config.siteAvailable) throw new NoteDraftError("DRAFT_DISABLED", 404, "AI drafting is unavailable on this site.");
	const admin = req.currentAdmin;
	const actorId = (admin ?? req.currentTutor)!._id.toString();
	if (!admin && !(await settings()).tutorsEnabled) throw new NoteDraftError("DRAFT_FORBIDDEN", 403, "AI drafting is disabled for tutors.");
	const hostId = admin ? config.adminHostId : config.tutorHosts[actorId];
	if (!hostId || !/^[\w-]{1,128}$/.test(hostId)) throw new NoteDraftError("HOST_UNAVAILABLE", 503, "The administrator must configure your Zoom host before generating notes.");
	const student = await User.findOne({ _id: studentId, ...(admin ? {} : { tutors: req.currentTutor!._id }) })
		.select("name")
		.maxTimeMS(5000)
		.lean();
	if (!student) throw new NoteDraftError("STUDENT_UNAVAILABLE", 404, "This student is unavailable.");
	return { actorId, studentId, studentName: student.name, hostId };
}

router.post("/candidates", async (req, res) => {
	const parsed = noteDraftRequest.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ code: "INVALID_DRAFT_REQUEST", message: "Select a student, a valid class date and a numeric Zoom meeting ID." });
	try {
		return res.json(await drafting.candidates(await scopeFor(req, parsed.data.studentId), parsed.data));
	}
	catch (error) { return failure(res, error); }
});

router.post("/generate", async (req, res) => {
	const parsed = generateNoteDraftRequest.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ code: "INVALID_DRAFT_REQUEST", message: "Confirm the selected Zoom class belongs to this student." });
	try {
		return res.json(await drafting.generate(await scopeFor(req, parsed.data.studentId), parsed.data));
	}
	catch (error) { return failure(res, error); }
});

const parseError: ErrorRequestHandler = (_error, _req, res, _next) => {
	res.status(400).json({ code: "INVALID_DRAFT_REQUEST", message: "Invalid or oversized draft request." });
};
router.use(parseError);
export const sessionNoteDraftRoutes = router;
