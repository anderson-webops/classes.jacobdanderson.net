import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import process, { env } from "node:process";
import mongoose from "mongoose";
import { SessionNote } from "../models/schemas/SessionNote.js";
import { SessionNoteEvidence } from "../models/schemas/SessionNoteEvidence.js";
import { SessionNoteSend } from "../models/schemas/SessionNoteSend.js";

async function evidenceFingerprint() {
	const hash = createHash("sha256");
	let count = 0;
	const deadline = Date.now() + 600_000;
	for (const name of ["sessionnotes", "sessionnotesends", "sessionnoteevidences", "scheduledsessions"]) {
		hash.update(name);
		const cursor = mongoose.connection.db!.collection(name).find({}).sort({ _id: 1 }).batchSize(100).maxTimeMS(600_000);
		try {
			for await (const record of cursor) {
				if (++count > 2_000_000 || Date.now() > deadline) throw new Error("fingerprint_limit");
				hash.update(JSON.stringify(record));
			}
		}
		finally { await cursor.close(); }
	}
	return { records: count, sha256: hash.digest("hex") };
}
async function main() {
	if (env.SESSION_NOTES_SEND_ENABLED === "true") throw new Error("mail_must_be_disabled");
	const args = process.argv.slice(2);
	const apply = args.includes("--apply");
	const rehearsal = args.includes("--rehearsal");
	if (args.some(arg => !["--check", "--apply", "--rehearsal"].includes(arg))) throw new Error("invalid_arguments");
	if (apply) {
		const file = env.SESSION_NOTE_BACKUP_MANIFEST;
		if (!file) throw new Error("verified_backup_required");
		const backup = JSON.parse(await readFile(file, "utf8"));
		if (backup.backupVerified !== true || !/^[a-f0-9]{64}$/.test(backup.sha256) || !backup.archivePath) throw new Error("verified_backup_required");
		const info = await stat(backup.archivePath);
		if (!info.isFile() || info.size <= 0) throw new Error("backup_missing");
		const { createReadStream } = await import("node:fs");
		const digest = createHash("sha256");
		for await (const chunk of createReadStream(backup.archivePath)) digest.update(chunk);
		if (digest.digest("hex") !== backup.sha256) throw new Error("backup_digest_mismatch");
	}
	if (!env.SESSION_NOTE_MIGRATION_URI) throw new Error("explicit_migration_uri_required");
	await mongoose.connect(env.SESSION_NOTE_MIGRATION_URI, { autoIndex: false, autoCreate: false, serverSelectionTimeoutMS: 5000 });
	if (rehearsal && !/protected_copy|rehearsal|restore/i.test(mongoose.connection.name)) throw new Error("protected_copy_required");
	const before = await evidenceFingerprint();
	if (apply) {
		// Index-only migration. Never populate old delivery fields or modify note contents.
		await SessionNote.createIndexes();
		await SessionNoteSend.createIndexes();
		await SessionNoteEvidence.createIndexes();
	}
	const after = await evidenceFingerprint();
	if (before.sha256 !== after.sha256 || before.records !== after.records) throw new Error("historical_evidence_changed");
	const indexes = {};
	for (const model of [SessionNoteSend, SessionNoteEvidence]) {
		const declared = model.schema.indexes();
		const actual = await model.collection.listIndexes().toArray().catch((error) => {
			if (error.code === 26) return [];
			throw error;
		});
		const complete = declared.every(([key, options]) => actual.some(index =>
			JSON.stringify(index.key) === JSON.stringify(key)
			&& Boolean(index.unique) === Boolean(options.unique)));
		(indexes as Record<string, boolean>)[model.modelName] = complete;
	}
	if (!Object.values(indexes).every(Boolean)) throw new Error("indexes_missing");
	console.info(JSON.stringify({ event: "session_note_index_gate", applied: apply, rehearsal, preservedRecords: after.records, historicalEvidenceSha256: after.sha256, indexes, mailDisabled: true }));
}
async function run() {
	try {
		await main();
	}
	catch {
		console.error("session_note_index_gate_failed: verify mail-disabled configuration, explicit copy URI, protected backup and declared indexes; no email was sent");
		process.exitCode = 1;
	}
	finally { await mongoose.disconnect(); }
}
void run();
