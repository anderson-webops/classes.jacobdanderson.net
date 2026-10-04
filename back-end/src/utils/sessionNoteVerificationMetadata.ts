import type { SessionNoteSendRecord } from "../types/entities/ISessionNoteSend.js";

export const verificationMeaning = "smtp_accepted means the mail server accepted the primary recipient; inbox delivery is not confirmed. Unknown, absent, saved-only, and ambiguous records are incomplete evidence, not evidence that notes are overdue. External evidence is separately sourced and never site SMTP acceptance.";
export function verificationCoverage() {
	return {
		schemaVersion: 2,
		coverage: "site_records_only",
		coverageSince: null,
		coverageDetails: {
			sources: ["site_saved_notes", "site_smtp_attempts", "registered_external_metadata"],
			completeHistoricalCoverage: false,
			mailboxHistoryQueried: false,
			expectedSessionsIncluded: false
		},
		statusMeaning: verificationMeaning
	};
}
export function noteVerificationMetadata(note: any, operation?: Partial<SessionNoteSendRecord>) {
	const delivery = note.delivery;
	const legacyAccepted = delivery?.source === "site_smtp" && delivery.status === "smtp_accepted"
		&& delivery.sentAt instanceof Date && Number.isFinite(delivery.sentAt.getTime());
	const accepted = operation?.state === "smtp_accepted" && operation.sentAt instanceof Date;
	const rejected = operation?.state === "smtp_rejected" || delivery?.status === "smtp_rejected";
	const correction = note.associationCorrections?.at(-1);
	const originalSnapshot = operation?.note?.sessionSnapshot ?? note.sessionSnapshot;
	const snapshot = correction?.nextSnapshot ?? operation?.note?.sessionSnapshot ?? note.sessionSnapshot;
	const scheduledSessionId = correction?.nextSessionId ?? operation?.note?.scheduledSessionId ?? note.scheduledSessionId;
	const evidenceStatus = accepted || legacyAccepted
		? "smtp_accepted"
		: operation?.state ?? (rejected ? "smtp_rejected" : note.workflowVersion === 2 ? "saved_not_sent" : "legacy_missing_metadata");
	return {
		recordId: String(note._id),
		noteId: String(note._id),
		recordType: "site_note",
		studentId: note.user ? String(note.user) : null,
		classDate: note.sessionDate.toISOString().slice(0, 10),
		sentAt: accepted ? operation!.sentAt!.toISOString() : legacyAccepted ? delivery.sentAt.toISOString() : null,
		deliveryStatus: accepted || legacyAccepted ? "smtp_accepted" : rejected ? "smtp_rejected" : "unknown",
		deliverySource: accepted || legacyAccepted || operation ? "site_smtp" : null,
		evidenceStatus,
		statusReason: operation?.errorCode ?? evidenceStatus,
		evidenceRecordedAt: operation?.evidenceRecordedAt?.toISOString() ?? note.savedAt?.toISOString() ?? null,
		externalSentAt: null,
		scheduledSessionId: scheduledSessionId ? String(scheduledSessionId) : null,
		actualSessionStartAt: snapshot?.startAt?.toISOString() ?? null,
		sessionTimezone: snapshot?.timezone ?? null,
		associationStatus: correction ? "verified_session" : scheduledSessionId ? operation?.note?.associationStatus ?? note.associationStatus ?? "unlinked_review_required" : "unlinked_review_required",
		originalSessionStartAt: originalSnapshot?.startAt?.toISOString() ?? null,
		associationCorrectedAt: correction?.at?.toISOString() ?? null,
		operationId: operation?._id ?? null,
		noteVersion: operation?.noteVersion ?? note.noteVersion ?? null
	};
}
export function externalEvidenceStatus(record: { correctionReason?: string | null; evidenceType: string }) {
	return record.correctionReason === "withdrawn" ? "external_withdrawn" : record.evidenceType === "observed_sent_item" ? "external_observed" : "external_attested";
}
export function externalVerificationMetadata(record: any) {
	return {
		recordId: String(record._id),
		noteId: record.noteId ?? null,
		recordType: "external_evidence",
		studentId: record.studentId,
		classDate: record.classDate.toISOString().slice(0, 10),
		sentAt: null,
		deliveryStatus: "unknown",
		deliverySource: record.source,
		evidenceStatus: externalEvidenceStatus(record),
		statusReason: record.correctionReason ?? record.evidenceType,
		evidenceRecordedAt: record.createdAt.toISOString(),
		externalSentAt: record.observedSendAt.toISOString(),
		scheduledSessionId: record.scheduledSessionId ?? null,
		actualSessionStartAt: record.sessionSnapshot?.startAt?.toISOString() ?? null,
		sessionTimezone: record.sessionSnapshot?.timezone ?? null,
		associationStatus: record.associationStatus,
		replacesRecordId: record.replaces ?? null
	};
}
