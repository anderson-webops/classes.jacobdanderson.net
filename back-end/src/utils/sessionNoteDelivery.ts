import type { SessionNoteDelivery } from "../types/entities/ISessionNote.js";

function includesAddress(values: unknown, address: string): boolean {
	return Array.isArray(values) && values.some((value) => {
		const candidate = typeof value === "string" ? value : value?.address;
		return typeof candidate === "string"
			&& candidate.trim().toLowerCase() === address.trim().toLowerCase();
	});
}

// SMTP acceptance is not proof of inbox delivery. In particular, acceptance
// of a CC address alone must not mark the student's primary recipient sent.
export function sessionNoteDeliveryFromSend(
	info: { accepted?: unknown; rejected?: unknown },
	primaryEmail: string,
	completedAt: Date
): SessionNoteDelivery {
	if (includesAddress(info.rejected, primaryEmail)) {
		return { source: "site_smtp", status: "smtp_rejected" };
	}
	if (includesAddress(info.accepted, primaryEmail)) {
		return { source: "site_smtp", status: "smtp_accepted", sentAt: completedAt };
	}
	return { source: "site_smtp", status: "unknown" };
}
