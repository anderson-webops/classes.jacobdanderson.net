import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SESSION_NOTE_DRAFT_STYLE } from "../src/services/sessionNoteDraftStyle.js";
import {
	classDateInTimezone,
	createSessionNoteDrafting,
	generateNoteDraftRequest,
	noteDraftRequest,
	privateTranscriptText,
	readNoteDraftConfig,
	trustedTranscriptUrl,
	zoomOccurrencePath
} from "../src/services/sessionNoteDrafting.js";

const config = {
	siteAvailable: true, ready: true, accountId: "synthetic-account",
	clientId: "synthetic-client", clientSecret: "synthetic-secret", apiKey: "synthetic-api-key",
	model: "configured-test-model", styleFile: "/synthetic/style.txt", timezone: "America/New_York",
	adminHostId: "synthetic-host", tutorHosts: {}
};
const scope = { actorId: "a".repeat(24), studentId: "b".repeat(24), studentName: "Synthetic Student", hostId: "synthetic-host" };
const input = { studentId: scope.studentId, classDate: "2026-10-07", meetingId: "2543520025" };
const meeting = { uuid: "/synthetic//uuid", id: 2543520025, host_id: scope.hostId, start_time: "2026-10-07T17:00:00Z", recording_files: [] };
const transcript = "WEBVTT\n\n1\n00:00:00.000 --> 00:00:12.000\nSynthetic Student practiced fractions and explained the common denominator.\n\nEmail: private@example.invalid\nhttps://zoom.us/j/private\nPasscode: private-code";
const markdown = "**In Class**: We practiced fractions.\n\n**Homework**: To be confirmed.";
let request: ReturnType<typeof vi.fn>;
let custom: (url: string) => Response | undefined;
let now: number;
let service: ReturnType<typeof createSessionNoteDrafting>;

function json(value: unknown, status = 200) { return new Response(JSON.stringify(value), { status }); }
beforeEach(() => {
	now = 1000;
	custom = () => undefined;
	request = vi.fn(async (url: string | URL) => {
		const path = String(url);
		const override = custom(path);
		if (override) return override;
		if (path === "https://zoom.us/oauth/token") return json({ access_token: "synthetic-zoom-token" });
		if (path.includes("/users/")) return json({ meetings: [meeting], next_page_token: "" });
		if (path.endsWith("/instances")) return json({ meetings: [meeting] });
		if (path.includes("/past_meetings/")) return json(meeting);
		if (path.endsWith("/transcript")) return json({ can_download: true, download_url: "https://us06web.zoom.us/rec/meeting/transcript/download/synthetic" });
		if (path.includes("/rec/meeting/transcript/download/")) return new Response(transcript);
		if (path === "https://api.openai.com/v1/responses") return draftResponse({ markdown, reviewWarnings: ["homework_uncertain"] });
		throw new Error("Unexpected synthetic request");
	});
	service = createSessionNoteDrafting({ fetch: request as typeof fetch, config: () => config, style: async () => "Use a short In class section and an optional Next section.", now: () => now });
});
afterEach(() => vi.unstubAllEnvs());

async function selected() {
	const result = await service.candidates(scope, input);
	return { ...input, selectionToken: result.candidates[0].selectionToken, confirmedStudent: true as const };
}

function draftResponse(value: unknown) {
	return json({ status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify(value) }] }] });
}

function providerBody() {
	const [, init] = request.mock.calls.find(([url]) => String(url).includes("api.openai"))! as unknown as [string, RequestInit];
	return JSON.parse(String(init.body));
}

describe("session-note AI drafting", () => {
	it("looks up the recurring occurrence and creates only a draft after confirmation", async () => {
		const choice = await selected();
		expect(request.mock.calls.some(([url]) => String(url).includes("api.openai"))).toBe(false);
		const result = await service.generate(scope, choice);
		expect(result).toMatchObject({ draftOnly: true, source: { startAt: meeting.start_time, timezone: config.timezone } });
		expect(result.markdown).toBe(markdown);
		expect(result.reviewWarnings).toEqual(["homework_uncertain"]);
		const [, init] = request.mock.calls.find(([url]) => String(url).includes("api.openai"))! as unknown as [string, RequestInit];
		const body = JSON.parse(String(init.body));
		expect(body).toMatchObject({ model: config.model, store: false, max_output_tokens: 3000 });
		expect(body.tools).toBeUndefined();
		expect(body.instructions).toContain("untrusted quoted data");
		expect(body.text.format).toMatchObject({ type: "json_schema", strict: true, name: "session_note_draft", schema: { additionalProperties: false, required: ["markdown", "reviewWarnings"] } });
		expect(body.text.format.schema.properties.markdown.pattern).toBe("(?:^|\\n)\\*\\*Homework\\*\\*:");
		expect(JSON.stringify(body.input)).not.toContain("private@example.invalid");
		expect(JSON.stringify(body.input)).not.toContain("private-code");
		expect(JSON.stringify(body.input)).not.toContain("https://zoom.us");
	});
	it("uses the supplied GPT conventions without requiring a private style override", async () => {
		const builtIn = createSessionNoteDrafting({ fetch: request as typeof fetch, config: () => ({ ...config, styleFile: "" }) });
		const choices = await builtIn.candidates(scope, input);
		await builtIn.generate(scope, { ...input, selectionToken: choices.candidates[0].selectionToken, confirmedStudent: true });
		const [, init] = request.mock.calls.find(([url]) => String(url).includes("api.openai"))! as unknown as [string, RequestInit];
		const body = JSON.parse(String(init.body));
		expect(body.instructions).toContain(SESSION_NOTE_DRAFT_STYLE);
		expect(body.instructions).toContain("**Homework Check**:");
		expect(body.instructions).toContain("colon outside");
		expect(body.instructions).toContain("an enclosing code block");
	});
	it("uses only the selected stable ID's approved preferences and separates examples from current facts", async () => {
		const preferences = vi.fn(async () => ({ approved: true as const, audience: "student" as const, format: "session" as const, homeworkCheck: "omit" as const, examples: ["**In Class**: You practiced loops in an earlier example. example@example.invalid", "**Homework**: Complete the old example only. https://private.invalid"] }));
		const personalized = createSessionNoteDrafting({ fetch: request as typeof fetch, config: () => ({ ...config, styleFile: "", referencesFile: "/synthetic/references.json" }), preferences });
		const choices = await personalized.candidates(scope, input);
		await personalized.generate(scope, { ...input, selectionToken: choices.candidates[0].selectionToken, confirmedStudent: true });
		expect(preferences).toHaveBeenCalledWith("/synthetic/references.json", scope.studentId);
		const body = providerBody();
		expect(body.instructions).toContain("primarily as we/our");
		expect(body.instructions).toContain("address the student as you/your when needed");
		expect(body.instructions).toContain("omit Homework Check entirely");
		expect(body.instructions).toContain("never transfer their assignments");
		const data = JSON.parse(body.input[0].content[0].text);
		expect(data.styleReferences.examples).toHaveLength(2);
		expect(data.currentSession.transcript).toContain("common denominator");
		expect(data.currentSession.transcript).not.toContain("old example");
		expect(JSON.stringify(body)).not.toContain("example@example.invalid");
		expect(JSON.stringify(body)).not.toContain("https://private.invalid");
	});
	it("keeps mandatory homework and review-output rules after a custom style override", async () => {
		await service.generate(scope, await selected());
		const instructions = providerBody().instructions;
		expect(instructions.indexOf("Mandatory factual and output rules")).toBeGreaterThan(instructions.indexOf("Approved style"));
		for (const rule of ["unfinished classwork", "explicit evidence", "omit unsupported optional sections", "homework_uncertain", "transcript_incomplete", "follow_up_uncertain"]) {
			expect(`${SESSION_NOTE_DRAFT_STYLE}\n${instructions}`).toContain(rule);
		}
		const mandatory = instructions.slice(instructions.indexOf("Mandatory factual and output rules"));
		expect(mandatory).toContain("Always include a nonempty **Homework**: section");
		expect(mandatory).toContain("**Homework**: To be confirmed.");
		expect(mandatory).toContain("primarily in first-person plural (we/our)");
		expect(mandatory).toContain("even when a style override or reference example");
	});
	it.each([
		{ evidence: "Teacher: For homework, complete exercises one through three before our next class.", homework: "Complete exercises 1 through 3 before our next class." },
		{ evidence: "Teacher: There is no homework assigned for this class; we will continue together next time.", homework: "No homework assigned." }
	])("preserves a required Homework section for explicit assignments or explicit nonassignment: $homework", async ({ evidence, homework }) => {
		const choice = await selected();
		const draft = `**In Class**: We practiced fractions.\n\n**Homework**: ${homework}`;
		custom = url => url.includes("/rec/meeting/transcript/download/")
			? new Response(evidence)
			: url.includes("api.openai") ? draftResponse({ markdown: draft, reviewWarnings: [] }) : undefined;
		expect(await service.generate(scope, choice)).toMatchObject({ markdown: draft, reviewWarnings: [], draftOnly: true });
		expect(JSON.parse(providerBody().input[0].content[0].text).currentSession.transcript).toBe(evidence);
	});
	it.each([
		"Teacher: We could try the bonus game. This is optional, not assigned homework.",
		"Teacher: We did not finish the game. We will continue it together next class.",
		"Teacher: Correction: the April note invented a worksheet assignment. Do not do that worksheet; it was never assigned.",
		"Teacher: Your function worked in our tests. We have not tested all edge cases."
	])("supplies the actual evidence and mandatory safeguards without substituting example facts: %s", async evidence => {
		const choice = await selected();
		custom = url => url.includes("/rec/meeting/transcript/download/") ? new Response(evidence) : undefined;
		await service.generate(scope, choice);
		const body = providerBody();
		expect(JSON.parse(body.input[0].content[0].text).currentSession.transcript).toBe(evidence);
		expect(body.instructions).toContain("contradicted or retracted");
		expect(body.instructions).toContain("Keep optional challenges optional");
	});
	it("fails closed on invalid configured preferences before calling providers", async () => {
		const personalized = createSessionNoteDrafting({ fetch: request as typeof fetch, config: () => ({ ...config, styleFile: "" }), preferences: async () => { throw new Error("private malformed references"); } });
		const choices = await personalized.candidates(scope, input);
		request.mockClear();
		await expect(personalized.generate(scope, { ...input, selectionToken: choices.candidates[0].selectionToken, confirmedStudent: true })).rejects.toMatchObject({ code: "STYLE_UNAVAILABLE", message: expect.not.stringContaining("private") });
		expect(request).not.toHaveBeenCalled();
	});
	it.each([
		{ markdown: "**In Class**: We tested fractions.", reviewWarnings: [] },
		{ markdown, reviewWarnings: ["private free-text warning"] },
		{ markdown },
		{ markdown: "", reviewWarnings: [] },
		{ markdown: "x".repeat(12_001), reviewWarnings: [] },
		{ markdown, reviewWarnings: [], extra: "private" }
	])("rejects invalid structured drafts without inserting partial text", async value => {
		const choice = await selected();
		custom = url => url.includes("api.openai") ? draftResponse(value) : undefined;
		await expect(service.generate(scope, choice)).rejects.toMatchObject({ code: "DRAFT_INCOMPLETE" });
	});
	it("requires valid date, identity, meeting ID and explicit confirmation", () => {
		expect(noteDraftRequest.parse({ studentId: scope.studentId, classDate: input.classDate }).meetingId).toBe("2543520025");
		for (const classDate of ["2026-02-30", "2026-13-01", "2026-1-1"]) expect(noteDraftRequest.safeParse({ ...input, classDate }).success).toBe(false);
		expect(noteDraftRequest.safeParse({ ...input, meetingId: "https://private.invalid" }).success).toBe(false);
		expect(noteDraftRequest.safeParse({ ...input, transcript: "client-supplied" }).success).toBe(false);
		expect(generateNoteDraftRequest.safeParse({ ...input, selectionToken: "a".repeat(64), confirmedStudent: false }).success).toBe(false);
	});
	it("keeps the feature unavailable outside the canonical site and without configuration", () => {
		vi.stubEnv("SESSION_NOTE_AI_SITE_ORIGIN", "https://classes.jacobdanderson.net");
		vi.stubEnv("AUTH_ORIGIN", "https://cs.avasan.org");
		expect(readNoteDraftConfig().siteAvailable).toBe(false);
		vi.stubEnv("AUTH_ORIGIN", "https://classes.jacobdanderson.net");
		expect(readNoteDraftConfig().ready).toBe(false);
		vi.stubEnv("SESSION_NOTE_ZOOM_TUTOR_HOSTS", '{"invalid":"host"}');
		expect(() => readNoteDraftConfig()).toThrow("configuration");
	});
	it("matches the actual local day across midnight and DST, not the UTC or subject date", () => {
		expect(classDateInTimezone("2026-10-08T02:00:00Z", config.timezone)).toBe("2026-10-07");
		expect(classDateInTimezone("2026-11-01T05:30:00Z", config.timezone)).toBe("2026-11-01");
		expect(classDateInTimezone("2026-11-01T06:30:00Z", config.timezone)).toBe("2026-11-01");
		expect(classDateInTimezone("invalid", config.timezone)).toBeNull();
	});
	it("does not guess a student association or pick the first of multiple same-day classes", async () => {
		custom = url => url.includes("/users/") ? json({ meetings: [meeting, { ...meeting, uuid: "second", start_time: "2026-10-07T19:00:00Z" }] }) : undefined;
		const result = await service.candidates(scope, input);
		expect(result.status).toBe("selection_required");
		expect(result.candidates).toHaveLength(2);
		expect(JSON.stringify(result)).not.toContain("synthetic//uuid");
		expect(JSON.stringify(result)).not.toContain("download");
		expect(request.mock.calls.some(([url]) => String(url).includes("api.openai"))).toBe(false);
	});
	it("requests another meeting when no transcript exists and does not call AI", async () => {
		custom = url => url.endsWith("/transcript") ? json({}, 404) : url.endsWith("/recordings") ? json(meeting) : undefined;
		expect(await service.candidates(scope, input)).toEqual({ status: "no_transcript", candidates: [] });
		expect(request.mock.calls.some(([url]) => String(url).includes("api.openai"))).toBe(false);
	});
	it("finds non-recording transcripts through verified past instances", async () => {
		custom = url => url.includes("/users/") ? json({ meetings: [] }) : undefined;
		expect((await service.candidates(scope, input)).candidates).toHaveLength(1);
	});
	it("rejects foreign Zoom hosts even when the meeting number and date match", async () => {
		custom = url => url.includes("/past_meetings/") && !url.endsWith("/instances") ? json({ ...meeting, host_id: "foreign-host" }) : undefined;
		expect((await service.candidates(scope, input)).candidates).toHaveLength(0);
	});
	it("binds choices to actor, student, date, host, meeting and short expiry", async () => {
		const choice = await selected();
		for (const changed of [{ ...scope, actorId: "c".repeat(24) }, { ...scope, studentId: "c".repeat(24) }, { ...scope, hostId: "foreign-host" }]) {
			await expect(service.generate(changed, choice)).rejects.toMatchObject({ code: "SELECTION_EXPIRED" });
		}
		await expect(service.generate(scope, { ...choice, classDate: "2026-10-08" })).rejects.toMatchObject({ code: "SELECTION_EXPIRED" });
		await expect(service.generate(scope, { ...choice, meetingId: "1234567890" })).rejects.toMatchObject({ code: "SELECTION_EXPIRED" });
		now += 5 * 60_000;
		await expect(service.generate(scope, choice)).rejects.toMatchObject({ code: "SELECTION_EXPIRED" });
	});
	it("rejects incomplete pagination rather than guessing from the first page", async () => {
		custom = url => url.includes("/users/") ? json({ meetings: [meeting], next_page_token: "more" }) : undefined;
		await expect(service.candidates(scope, input)).rejects.toMatchObject({ code: "LOOKUP_INCOMPLETE" });
	});
	it("blocks credential forwarding to foreign or malformed transcript URLs", () => {
		for (const url of ["http://zoom.us/rec/test", "https://zoom.us.evil.invalid/rec/test", "https://127.0.0.1/rec/test", "https://zoom.us:8443/rec/test", "https://secret@zoom.us/rec/test", "https://zoom.us/oauth/token"]) expect(() => trustedTranscriptUrl(url)).toThrow();
		expect(zoomOccurrencePath("ordinary+id=")).toBe("ordinary%2Bid%3D");
		expect(zoomOccurrencePath("/starts/slash")).toContain("%252F");
	});
	it("does not follow a download redirect carrying authorization to an untrusted host", async () => {
		const choice = await selected();
		custom = url => url.includes("/rec/meeting/transcript/download/") ? new Response(null, { status: 302, headers: { location: "https://foreign.invalid/rec/test" } }) : undefined;
		await expect(service.generate(scope, choice)).rejects.toMatchObject({ code: "ZOOM_RESPONSE_INVALID" });
		expect(request.mock.calls.some(([url]) => String(url).includes("foreign.invalid"))).toBe(false);
	});
	it("does not turn provider secrets or raw errors into client messages", async () => {
		const choice = await selected();
		custom = url => url.includes("api.openai") ? json({ error: { message: "private raw error" } }, 500) : undefined;
		await expect(service.generate(scope, choice)).rejects.toMatchObject({ code: "PROVIDER_UNAVAILABLE", message: expect.not.stringContaining("private") });
	});
	it("rejects incomplete or refused drafts rather than inserting partial text", async () => {
		const choice = await selected();
		custom = url => url.includes("api.openai") ? json({ status: "incomplete", output: [] }) : undefined;
		await expect(service.generate(scope, choice)).rejects.toMatchObject({ code: "DRAFT_INCOMPLETE" });
		custom = url => url.includes("api.openai") ? json({ status: "completed", output: [{ type: "message", content: [{ type: "refusal" }] }] }) : undefined;
		await expect(service.generate(scope, choice)).rejects.toMatchObject({ code: "DRAFT_UNAVAILABLE" });
	});
	it("preserves content facts while removing caption timing and private links", () => {
		const text = privateTranscriptText(transcript);
		expect(text).toContain("practiced fractions");
		expect(text).not.toContain("WEBVTT");
		expect(text).not.toContain("-->");
	});
	it("bounds oversized transcripts and missing style without calling AI", async () => {
		const choice = await selected();
		custom = url => url.includes("/rec/meeting/transcript/download/") ? new Response("x".repeat(256_001)) : undefined;
		await expect(service.generate(scope, choice)).rejects.toMatchObject({ code: "RESPONSE_TOO_LARGE" });
		expect(request.mock.calls.some(([url]) => String(url).includes("api.openai"))).toBe(false);
		const withoutStyle = createSessionNoteDrafting({ fetch: request as typeof fetch, config: () => config, style: async () => "" });
		custom = () => undefined;
		const choices = await withoutStyle.candidates(scope, input);
		await expect(withoutStyle.generate(scope, { ...input, selectionToken: choices.candidates[0].selectionToken, confirmedStudent: true })).rejects.toMatchObject({ code: "STYLE_UNAVAILABLE" });
	});
	it("rechecks occurrence ownership at generation and rejects HTML downloads", async () => {
		const choice = await selected();
		custom = url => url.includes("/past_meetings/") && !url.endsWith("/instances") ? json({ ...meeting, host_id: "foreign-host" }) : undefined;
		await expect(service.generate(scope, choice)).rejects.toMatchObject({ code: "SELECTION_EXPIRED" });
		custom = url => url.includes("/rec/meeting/transcript/download/") ? new Response("<html>Private login page</html>", { headers: { "content-type": "text/html" } }) : undefined;
		await expect(service.generate(scope, choice)).rejects.toMatchObject({ code: "TRANSCRIPT_UNAVAILABLE" });
	});
	it("enforces per-actor and overall concurrency caps and releases claims", async () => {
		let firstResolve!: (value: Response) => void;
		let secondResolve!: (value: Response) => void;
		request.mockImplementationOnce(() => new Promise(resolve => { firstResolve = resolve; }));
		const first = service.candidates(scope, input);
		await expect(service.candidates(scope, input)).rejects.toMatchObject({ code: "DRAFT_BUSY" });
		request.mockImplementationOnce(() => new Promise(resolve => { secondResolve = resolve; }));
		const second = service.candidates({ ...scope, actorId: "c".repeat(24) }, input);
		await expect(service.candidates({ ...scope, actorId: "d".repeat(24) }, input)).rejects.toMatchObject({ code: "DRAFT_BUSY" });
		firstResolve(json({ access_token: "synthetic-token" }));
		secondResolve(json({ access_token: "synthetic-token" }));
		await Promise.all([first, second]);
		expect((await service.candidates(scope, input)).candidates).toHaveLength(1);
	});
});
