import { Buffer } from "node:buffer";
import { Router } from "express";
import { Types } from "mongoose";
import { z } from "zod";
import { createSessionNoteVerificationLimiter } from "../middleware/rateLimiters.js";
import { sessionNoteVerificationAuth } from "../middleware/sessionNoteVerificationAuth.js";
import { SessionNote } from "../models/schemas/SessionNote.js";

const DAY_MS = 86_400_000;
const objectID = z.string().regex(/^[a-f0-9]{24}$/i);
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
	const date = new Date(`${value}T00:00:00.000Z`);
	return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
});
const cursorSchema = z.object({ id: objectID, date: z.iso.datetime() }).strict();
const querySchema = z.object({
	studentId: objectID.optional(),
	studentName: z.string().trim().min(1).max(120).optional(),
	from: day,
	to: day,
	limit: z.string().regex(/^\d{1,3}$/).transform(Number).pipe(z.number().int().min(1).max(100)).optional(),
	cursor: z.string().min(1).max(256).regex(/^[\w-]+$/).optional()
}).strict().refine(query => Boolean(query.studentId) !== Boolean(query.studentName), {
	message: "Provide exactly one of studentId or studentName"
}).refine((query) => {
	const days = (Date.parse(query.to) - Date.parse(query.from)) / DAY_MS;
	return days >= 0 && days < 366;
}, { message: "Use a date range of at most 366 days" });

// Positive projection and explicit serialization keep note contents, emails,
// subjects, message IDs and unrelated account/payment data out of this API.
const projection = { _id: 1, user: 1, sessionDate: 1, delivery: 1 };
const nameCollation = { locale: "en", strength: 2 } as const;

export function createSessionNoteVerificationRoutes(rateOptions: { limit?: number } = {}) {
	const router = Router();
	router.use((_req, res, next) => {
		res.set("Cache-Control", "no-store");
		res.set("Vary", "Authorization, Cookie");
		next();
	});
	router.use(createSessionNoteVerificationLimiter(rateOptions));
	router.use(sessionNoteVerificationAuth);
	router.use((req, res, next) => {
		if (req.method === "GET" || req.method === "HEAD") return next();
		res.set("Allow", "GET, HEAD").status(405).json({ message: "Read-only endpoint" });
	});
	router.get("/", async (req, res) => {
		const parsed = querySchema.safeParse(req.query);
		if (!parsed.success) {
			return res.status(400).json({ message: "Invalid student, date range or pagination parameters" });
		}
		const query = parsed.data;
		let cursor: z.infer<typeof cursorSchema> | undefined;
		if (query.cursor) {
			try {
				cursor = cursorSchema.parse(JSON.parse(Buffer.from(query.cursor, "base64url").toString("utf8")));
			}
			catch {
				return res.status(400).json({ message: "Invalid cursor" });
			}
		}
		const filter = {
			...(query.studentId
				? { user: new Types.ObjectId(query.studentId) }
				: { studentName: query.studentName }),
			sessionDate: {
				$gte: new Date(`${query.from}T00:00:00.000Z`),
				$lt: new Date(Date.parse(query.to) + DAY_MS)
			}
		};
		try {
			if (query.studentName) {
				const identities = await SessionNote.aggregate([
					{ $match: filter },
					{ $group: { _id: { $ifNull: ["$user", "$primaryEmail"] } } },
					{ $limit: 2 }
				]).collation(nameCollation).option({ maxTimeMS: 2000 });
				if (identities.length > 1) {
					return res.status(409).json({
						message: "This name matches multiple student identities. Use studentId or associate the records in the admin workspace."
					});
				}
			}
			const limit = query.limit ?? 50;
			const records = await SessionNote.find({
				...filter,
				...(cursor
					? { $or: [
							{ sessionDate: { $lt: new Date(cursor.date) } },
							{ sessionDate: new Date(cursor.date), _id: { $lt: new Types.ObjectId(cursor.id) } }
						] }
					: {})
			}).select(projection).collation(query.studentName ? nameCollation : { locale: "simple" }).sort({ sessionDate: -1, _id: -1 }).limit(limit + 1).maxTimeMS(2000).lean();
			const page = records.slice(0, limit);
			const last = page.at(-1);
			return res.json({
				records: page.map((note) => {
					const delivery = note.delivery;
					const verified = delivery?.source === "site_smtp"
						&& delivery.status === "smtp_accepted"
						&& delivery.sentAt instanceof Date
						&& Number.isFinite(delivery.sentAt.getTime());
					return {
						recordId: String(note._id),
						studentId: note.user ? String(note.user) : null,
						classDate: note.sessionDate.toISOString().slice(0, 10),
						sentAt: verified ? delivery.sentAt!.toISOString() : null,
						deliveryStatus: verified
							? "smtp_accepted"
							: delivery?.source === "site_smtp" && delivery.status === "smtp_rejected"
								? "smtp_rejected"
								: "unknown"
					};
				}),
				nextCursor: records.length > limit && last
					? Buffer.from(JSON.stringify({ id: String(last._id), date: last.sessionDate.toISOString() })).toString("base64url")
					: null,
				coverage: "site_records_only",
				statusMeaning: "smtp_accepted means the mail server accepted the primary recipient; inbox delivery is not confirmed. Unknown or absent records are not evidence that notes are overdue."
			});
		}
		catch {
			// Do not log queries, credentials, raw database errors or note contents.
			return res.status(503).json({ message: "Session-note verification is temporarily unavailable" });
		}
	});
	return router;
}

export const sessionNoteVerificationRoutes = createSessionNoteVerificationRoutes();
