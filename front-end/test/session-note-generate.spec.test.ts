import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api";
import SessionNoteGenerate from "@/components/SessionNoteGenerate.vue";
import SessionNoteDraftSettings from "@/components/SessionNoteDraftSettings.vue";

vi.mock("@/api", () => ({ api: { get: vi.fn(), post: vi.fn(), put: vi.fn() } }));
const props = { studentId: "a".repeat(24), studentName: "Synthetic Student", classDate: "2026-10-07", markdown: "", editorId: "synthetic-editor" };
const candidate = { selectionToken: "b".repeat(64), startAt: "2026-10-07T17:00:00Z", timezone: "America/New_York" };
let wrappers: ReturnType<typeof mount>[];
beforeEach(() => {
	vi.clearAllMocks();
	wrappers = [];
	vi.mocked(api.get).mockResolvedValue({ data: { siteAvailable: true, allowed: true, ready: true, tutorsEnabled: false } });
	vi.mocked(api.post).mockImplementation(async path => ({ data: path.endsWith("/candidates") ? { status: "selection_required", candidates: [candidate] } : { markdown: "**In class:** Fractions.", draftOnly: true } }));
	vi.mocked(api.put).mockResolvedValue({ data: { tutorsEnabled: true } });
});
afterEach(() => wrappers.forEach(wrapper => wrapper.unmount()));
async function create(overrides = {}) {
	const wrapper = mount(SessionNoteGenerate, { props: { ...props, ...overrides } });
	wrappers.push(wrapper);
	await flushPromises();
	return wrapper;
}
async function choose(wrapper: ReturnType<typeof mount>) {
	await wrapper.get("button").trigger("click");
	await flushPromises();
	await wrapper.get('input[type="checkbox"]').setValue(true);
}

describe("Generate session-note draft", () => {
	it("places Generate beside Markdown and disables it until both student and date are selected", async () => {
		const wrapper = await create({ studentId: "", classDate: "" });
		expect(wrapper.get("label").text()).toBe("Markdown");
		expect(wrapper.get("button").text()).toBe("Generate");
		expect(wrapper.get("button").attributes("disabled")).toBeDefined();
		await wrapper.setProps({ studentId: props.studentId });
		expect(wrapper.get("button").attributes("disabled")).toBeDefined();
		await wrapper.setProps({ classDate: props.classDate });
		expect(wrapper.get("button").attributes("disabled")).toBeUndefined();
	});
	it("uses the default meeting and requires a class confirmation before generating editable Markdown", async () => {
		const wrapper = await create();
		await choose(wrapper);
		expect(api.post).toHaveBeenNthCalledWith(1, "/session-notes/drafting/candidates", { studentId: props.studentId, classDate: props.classDate, meetingId: "2543520025" }, expect.any(Object));
		await wrapper.get("button").trigger("click");
		await flushPromises();
		expect(api.post).toHaveBeenNthCalledWith(2, "/session-notes/drafting/generate", expect.objectContaining({ selectionToken: candidate.selectionToken, confirmedStudent: true }), expect.any(Object));
		expect(wrapper.emitted("generated")?.[0]).toEqual(["**In class:** Fractions."]);
		expect(wrapper.text()).toContain("Review and edit");
		expect(api.post).not.toHaveBeenCalledWith("/admin-mail/send", expect.anything());
	});
	it("asks for another meeting ID when the selected day's transcript is absent", async () => {
		vi.mocked(api.post).mockResolvedValue({ data: { status: "no_transcript", candidates: [] } });
		const wrapper = await create();
		await wrapper.get("button").trigger("click");
		await flushPromises();
		expect(wrapper.text()).toContain("another Zoom meeting ID");
		await wrapper.get('input[inputmode="numeric"]').setValue("1234567890");
		await wrapper.get("button").trigger("click");
		await flushPromises();
		expect(api.post).toHaveBeenLastCalledWith("/session-notes/drafting/candidates", expect.objectContaining({ meetingId: "1234567890" }), expect.any(Object));
	});
	it("confirms replacement before touching an existing draft and preserves it on provider failure", async () => {
		const wrapper = await create({ markdown: "Keep my existing notes" });
		await wrapper.get("button").trigger("click");
		expect(api.post).not.toHaveBeenCalled();
		expect(wrapper.text()).toContain("Replace the existing draft");
		await wrapper.findAll("button").find(button => button.text() === "Continue")!.trigger("click");
		await flushPromises();
		await wrapper.get('input[type="checkbox"]').setValue(true);
		vi.mocked(api.post).mockRejectedValue(new Error("private raw failure"));
		await wrapper.get("button").trigger("click");
		await flushPromises();
		expect(wrapper.emitted("generated")).toBeUndefined();
		expect(wrapper.text()).toContain("existing notes are unchanged");
		expect(wrapper.text()).not.toContain("private raw failure");
	});
	it.each(["student", "date", "text", "unmount"])("does not overwrite after a pending request loses its %s context", async change => {
		const wrapper = await create();
		await choose(wrapper);
		let resolve!: (value: any) => void;
		vi.mocked(api.post).mockImplementation(() => new Promise(done => { resolve = done; }));
		await wrapper.get("button").trigger("click");
		if (change === "student") await wrapper.setProps({ studentId: "c".repeat(24) });
		if (change === "date") await wrapper.setProps({ classDate: "2026-10-08" });
		if (change === "text") await wrapper.setProps({ markdown: "Typing while AI runs" });
		if (change === "unmount") { wrapper.unmount(); wrappers = []; }
		resolve({ data: { markdown: "Stale draft", draftOnly: true } });
		await flushPromises();
		expect(wrapper.emitted("generated")).toBeUndefined();
	});
	it("hides the control for downstream sites and unauthorized tutors", async () => {
		vi.mocked(api.get).mockResolvedValue({ data: { siteAvailable: false, allowed: false } });
		expect((await create()).find("button").exists()).toBe(false);
		vi.mocked(api.get).mockResolvedValue({ data: { siteAvailable: true, allowed: false } });
		expect((await create()).find("button").exists()).toBe(false);
	});
	it("shows a clear setup error without querying transcripts when integration is not ready", async () => {
		vi.mocked(api.get).mockResolvedValue({ data: { siteAvailable: true, allowed: true, ready: false } });
		const wrapper = await create();
		await wrapper.get("button").trigger("click");
		expect(wrapper.text()).toContain("configuration");
		expect(api.post).not.toHaveBeenCalled();
	});
});

describe("administrator tutor drafting setting", () => {
	it("defaults to Disabled and saves an explicit Enabled selection", async () => {
		const wrapper = mount(SessionNoteDraftSettings);
		wrappers.push(wrapper);
		await flushPromises();
		expect((wrapper.findAll('input[type="radio"]')[0].element as HTMLInputElement).checked).toBe(true);
		await wrapper.findAll('input[type="radio"]')[1].setValue();
		await flushPromises();
		expect(api.put).toHaveBeenCalledWith("/session-notes/drafting/settings", { tutorsEnabled: true });
		expect(wrapper.text()).toContain("updated");
	});
	it("preserves the stored setting if the update fails", async () => {
		vi.mocked(api.put).mockRejectedValue(new Error("private error"));
		const wrapper = mount(SessionNoteDraftSettings);
		wrappers.push(wrapper);
		await flushPromises();
		await wrapper.findAll('input[type="radio"]')[1].setValue();
		await flushPromises();
		expect(wrapper.text()).toContain("has not changed");
		expect((wrapper.findAll('input[type="radio"]')[0].element as HTMLInputElement).checked).toBe(true);
	});
});
