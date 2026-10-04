const signals = new Map<string, number>();
const eventCodes = new Set(["archive_tracking_requires_attention", "dispatch_identity_changed", "smtp_tracking_reconciliation_required", "note_projection_pending", "smtp_outcome_ambiguous", "smtp_nonacceptance", "send_requires_review", "orphaned_smtp_attempt", "archive_outcome_ambiguous", "queued_send_stale", "recovery_unavailable", "archive_complete", "archive_failed", "mail_request_failed", "writer_release_requires_review"]);
export function noteOperationalEvent(operationId: string, code: string) {
	if (!/^[a-f0-9-]{36}$/.test(operationId) && !["request", "worker", "internal-mail"].includes(operationId)) operationId = "request";
	if (!eventCodes.has(code)) code = "send_requires_review";
	const key = `${operationId}:${code}`;
	const now = Date.now();
	if ((signals.get(key) ?? 0) > now - 3_600_000) return;
	if (signals.size >= 1000) signals.delete(signals.keys().next().value!);
	signals.set(key, now);
	// Callers provide only locally generated identifiers and bounded internal codes.
	console.warn(JSON.stringify({ event: "session_note_workflow", operationId, code }));
}
