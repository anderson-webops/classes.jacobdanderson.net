export type SendState = "preparing" | "queued" | "sending" | "smtp_accepted" | "smtp_rejected" | "send_failed" | "delivery_unconfirmed";
export interface SessionSnapshot {
	startAt: Date;
	endAt: Date;
	timezone: string;
	scheduleRevision: number;
}
export interface NoteSnapshot {
	user: string;
	studentName: string;
	primaryEmail: string;
	ccEmails: string[];
	subject: string;
	sessionDate: Date;
	markdown: string;
	html: string;
	scheduledSessionId?: string;
	sessionSnapshot?: SessionSnapshot;
	associationStatus: "verified_session" | "unlinked_review_required";
}
export interface SessionNoteSendRecord {
	_id: string;
	actorId: string;
	keyHash: string;
	payloadHash: string;
	noteId: string;
	noteVersion: string;
	note: NoteSnapshot;
	state: SendState;
	messageId: string;
	createdAt: Date;
	updatedAt: Date;
	claimedAt?: Date;
	claimId?: string;
	sentAt?: Date;
	evidenceRecordedAt?: Date;
	errorCode?: string;
	attempts: { claimId: string; startedAt: Date; outcome?: SendState }[];
	archiveState: "pending" | "archiving" | "archived" | "retry" | "review_required" | "not_applicable";
	archiveAttempts: number;
	archiveClaimedAt?: Date;
	nextArchiveAt?: Date;
	signalAt?: Date;
	dispositions: { actorId: string; at: Date; decision: string; evidenceRef: string; keyHash: string; payloadHash: string }[];
}
