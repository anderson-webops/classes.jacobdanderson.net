const stages = [
	"configuration",
	"selection",
	"style",
	"zoom_auth",
	"zoom_lookup",
	"transcript_lookup",
	"transcript_download",
	"generation",
	"validation"
] as const;
export type NoteDraftStage = (typeof stages)[number];
const codes = new Set([
	"CONFIGURATION_UNAVAILABLE",
	"DRAFT_BUSY",
	"DRAFT_DISABLED",
	"DRAFT_FORBIDDEN",
	"DRAFT_INCOMPLETE",
	"DRAFT_RATE_LIMIT",
	"DRAFT_TIMEOUT",
	"DRAFT_UNAVAILABLE",
	"HOST_UNAVAILABLE",
	"INVALID_DRAFT_REQUEST",
	"LOOKUP_INCOMPLETE",
	"PROVIDER_RESPONSE_INVALID",
	"PROVIDER_UNAVAILABLE",
	"RESPONSE_TOO_LARGE",
	"SELECTION_EXPIRED",
	"STUDENT_UNAVAILABLE",
	"STYLE_UNAVAILABLE",
	"TRANSCRIPT_AMBIGUOUS",
	"TRANSCRIPT_EMPTY",
	"TRANSCRIPT_UNAVAILABLE",
	"ZOOM_RESPONSE_INVALID"
]);

export function noteDraftDiagnostic(cause: unknown, stage: NoteDraftStage) {
	const response = (
		cause as {
			response?: {
				data?: { code?: unknown; stage?: unknown; requestId?: unknown };
			};
		} | null
	)?.response?.data;
	return {
		schemaVersion: 1,
		workflow: "session-note-drafting",
		stage:
			typeof response?.stage === "string" &&
			stages.includes(response.stage as NoteDraftStage)
				? (response.stage as NoteDraftStage)
				: stage,
		code:
			typeof response?.code === "string" && codes.has(response.code)
				? response.code
				: "DRAFT_UNAVAILABLE",
		...(typeof response?.requestId === "string" &&
		/^[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}$/i.test(response.requestId)
			? { requestId: response.requestId }
			: {})
	};
}
