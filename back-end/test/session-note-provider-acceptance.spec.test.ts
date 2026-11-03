import { describe, expect, it, vi } from "vitest";
import { acceptSyntheticNoteDraft } from "../src/maintenance/sessionNoteDraftAcceptance.js";

describe("opt-in synthetic provider acceptance", () => {
	it("uses the real drafting contract while isolating Zoom and all mail", async () => {
		const request = vi.fn<typeof fetch>(async (url, init) => {
			expect(String(url)).toBe("https://api.openai.com/v1/responses");
			const payload = JSON.parse(String(init?.body));
			expect(payload.text.format.schema.properties.markdown).not.toHaveProperty("pattern");
			expect(payload.instructions).toContain("Always include a nonempty **Homework**:");
			expect(payload.store).toBe(false);
			return new Response(JSON.stringify({ status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify({ markdown: "**In Class**: We compared equivalent fractions.\n\n**Homework**: Complete exercises 1 through 3.", reviewWarnings: [] }) }] }] }));
		});
		const report = await acceptSyntheticNoteDraft({ apiKey: "synthetic-key", model: "configured-test-model", fetch: request });
		expect(request).toHaveBeenCalledTimes(1);
		expect(report).toMatchObject({ status: "passed", homeworkValidated: true, sharedWorkVoice: true, zoomNetworkRequests: 0, mailRequests: 0 });
		expect(JSON.stringify(report)).not.toContain("synthetic-key");
		expect(JSON.stringify(report)).not.toContain("equivalent fractions");
	});
	it("retains local Homework rejection even without a provider-side pattern", async () => {
		await expect(acceptSyntheticNoteDraft({ apiKey: "synthetic-key", model: "configured-test-model", fetch: async () => new Response(JSON.stringify({ status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify({ markdown: "**In Class**: We compared fractions.", reviewWarnings: [] }) }] }] })) })).rejects.toMatchObject({ code: "DRAFT_INCOMPLETE", stage: "validation" });
	});
});
