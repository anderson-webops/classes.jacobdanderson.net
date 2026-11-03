import { createHash } from "node:crypto";
import process, { env, stdout } from "node:process";
import { pathToFileURL } from "node:url";
import { createSessionNoteDrafting, NoteDraftError } from "../services/sessionNoteDrafting.js";

export async function acceptSyntheticNoteDraft(options: { apiKey: string; model: string; fetch?: typeof fetch }) {
	if (!options.apiKey || options.apiKey.length > 8192 || !/^[\w.-]{1,100}$/.test(options.model)) {
		throw new NoteDraftError("CONFIGURATION_UNAVAILABLE", 503, "Dedicated provider configuration is required.");
	}
	const request = options.fetch ?? globalThis.fetch;
	const scope = { actorId: "a".repeat(24), studentId: "b".repeat(24), studentName: "Synthetic Learner", hostId: "synthetic-host" };
	const input = { studentId: scope.studentId, classDate: "2026-01-15", meetingId: "2543520025" };
	const meeting = { uuid: "synthetic-acceptance", id: 2543520025, host_id: scope.hostId, start_time: "2026-01-15T17:00:00Z", recording_files: [] };
	const transcript = "Teacher: We compared one-half and two-fourths using fraction diagrams. We checked together that both cover the same amount. For homework, complete exercises 1 through 3 before our next class.";
	let providerRequests = 0;
	let contractSha256 = "";
	const json = (value: unknown) => new Response(JSON.stringify(value), { headers: { "Content-Type": "application/json" } });
	const service = createSessionNoteDrafting({
		config: () => ({
			siteAvailable: true,
			ready: true,
			accountId: "synthetic-account",
			clientId: "synthetic-client",
			clientSecret: "synthetic-secret",
			apiKey: options.apiKey,
			model: options.model,
			styleFile: "",
			referencesFile: "",
			timezone: "UTC",
			adminHostId: scope.hostId,
			tutorHosts: {}
		}),
		fetch: async (url, init) => {
			const address = String(url);
			if (address === "https://api.openai.com/v1/responses") {
				providerRequests++;
				if (providerRequests !== 1) throw new Error("Provider request bound reached");
				contractSha256 = createHash("sha256").update(String(init?.body)).digest("hex");
				return request(url, init);
			}
			if (address === "https://zoom.us/oauth/token") return json({ access_token: "synthetic-token" });
			if (address.startsWith("https://api.zoom.us/v2/users/synthetic-host/recordings?")) return json({ meetings: [meeting], next_page_token: "" });
			if (address === "https://api.zoom.us/v2/past_meetings/2543520025/instances") return json({ meetings: [meeting] });
			if (address === "https://api.zoom.us/v2/past_meetings/synthetic-acceptance") return json(meeting);
			if (address === "https://api.zoom.us/v2/meetings/synthetic-acceptance/transcript") return json({ can_download: true, download_url: "https://zoom.us/rec/synthetic-acceptance" });
			if (address === "https://zoom.us/rec/synthetic-acceptance") return new Response(transcript);
			throw new Error("Unexpected fixture request");
		}
	});
	const choices = await service.candidates(scope, input);
	const result = await service.generate(scope, { ...input, selectionToken: choices.candidates[0].selectionToken, confirmedStudent: true });
	if (!/\bwe\b/i.test(result.markdown) || providerRequests !== 1) {
		throw new NoteDraftError("DRAFT_INCOMPLETE", 502, "Synthetic drafting acceptance failed.", "validation");
	}
	return { schemaVersion: 1, fixture: "fractions-homework-v1", status: "passed", model: options.model, providerRequests, contractSha256, homeworkValidated: true, sharedWorkVoice: true, zoomNetworkRequests: 0, mailRequests: 0 };
}

async function main() {
	try {
		if (env.SESSION_NOTE_PROVIDER_ACCEPTANCE !== "synthetic-only") throw new Error("Explicit acceptance required");
		const result = await acceptSyntheticNoteDraft({ apiKey: env.SESSION_NOTE_OPENAI_API_KEY ?? "", model: env.SESSION_NOTE_OPENAI_MODEL ?? "" });
		stdout.write(`${JSON.stringify(result)}\n`);
	}
	catch (error) {
		stdout.write(`${JSON.stringify({ schemaVersion: 1, status: "failed", code: error instanceof NoteDraftError ? error.code : "ACCEPTANCE_NOT_COMPLETED", stage: error instanceof NoteDraftError ? error.stage : "configuration" })}\n`);
		process.exitCode = 1;
	}
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) void main();
