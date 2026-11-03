import { describe, expect, it } from "vitest";
import { noteDraftDiagnostic } from "@/modules/sessionNoteDraftDiagnostics";

describe("content-free drafting diagnostics", () => {
	it("retains only allowlisted stages and codes, never request or provider content", () => {
		const diagnostic = noteDraftDiagnostic(
			{
				response: {
					data: {
						code: "DRAFT_INCOMPLETE",
						stage: "validation",
						message: "private student text",
						transcript: "private transcript",
						selectionToken: "private token"
					}
				},
				config: { headers: { Authorization: "private secret" } }
			},
			"generation"
		);
		expect(diagnostic).toEqual({
			schemaVersion: 1,
			workflow: "session-note-drafting",
			stage: "validation",
			code: "DRAFT_INCOMPLETE"
		});
		expect(JSON.stringify(diagnostic)).not.toContain("private");
	});
	it.each([
		undefined,
		null,
		new Error("private message"),
		{
			response: {
				data: { code: "PRIVATE_STUDENT_NAME", stage: "private address" }
			}
		}
	])("uses bounded fallbacks for unknown failures", cause => {
		expect(noteDraftDiagnostic(cause, "zoom_lookup")).toEqual({
			schemaVersion: 1,
			workflow: "session-note-drafting",
			stage: "zoom_lookup",
			code: "DRAFT_UNAVAILABLE"
		});
	});
	it("copies only an opaque request ID, not arbitrary server text", () => {
		const requestId = "12345678-1234-1234-1234-123456789abc";
		expect(
			noteDraftDiagnostic(
				{ response: { data: { requestId } } },
				"generation"
			)
		).toHaveProperty("requestId", requestId);
		expect(
			noteDraftDiagnostic(
				{ response: { data: { requestId: "private address" } } },
				"generation"
			)
		).not.toHaveProperty("requestId");
	});
});
