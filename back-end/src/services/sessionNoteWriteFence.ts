import type { ClientSession } from "mongoose";
import { randomUUID } from "node:crypto";
import { User } from "../models/schemas/User.js";
import { NoteWorkflowError } from "../utils/sessionNoteIdentity.js";
import { noteOperationalEvent } from "../utils/sessionNoteOperational.js";

const active = new Set<string>();
export function noteWriterIsActive(id: string) {
	return active.has(id);
}
// Persistent, non-expiring markers fence all note/evidence writes and SMTP against account removal.
// A crashed marker requires explicit operator disposition; time alone cannot prove a process stopped.
export async function withSessionNoteWriter<T>(studentId: string, action: () => Promise<T>): Promise<T> {
	const id = randomUUID();
	const result = await User.updateOne({ "_id": studentId, "noteWorkflowDeleting": { $ne: true }, "noteWorkflowWriters.31": { $exists: false } }, { $push: { noteWorkflowWriters: { id, at: new Date() } } }, { writeConcern: { w: "majority", j: true }, maxTimeMS: 5000 });
	if (!result.modifiedCount) throw new NoteWorkflowError(409, "student_missing_removing_or_writer_limit");
	active.add(id);
	try {
		return await action();
	}
	finally {
		active.delete(id);
		try {
			await User.updateOne({ _id: studentId }, { $pull: { noteWorkflowWriters: { id } } }, { writeConcern: { w: "majority", j: true }, maxTimeMS: 5000 });
		}
		catch { noteOperationalEvent("worker", "writer_release_requires_review"); }
	}
}
export async function fenceSessionNoteAccountRemoval(studentId: string, session: ClientSession) {
	const result = await User.updateOne({ "_id": studentId, "noteWorkflowWriters.0": { $exists: false } }, { $set: { noteWorkflowDeleting: true } }, { session }).exec();
	if (!result.modifiedCount) throw new NoteWorkflowError(409, "session_note_writers_require_review_before_removal");
}
