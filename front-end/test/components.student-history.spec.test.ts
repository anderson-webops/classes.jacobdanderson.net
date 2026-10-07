import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api";
import UserCommunicationPanel from "@/components/UserCommunicationPanel.vue";
import { useAppStore } from "@/stores/app";

vi.mock("@/api", () => ({ api: { get: vi.fn() } }));
const student = {
	_id: "student-1",
	name: "Alex",
	email: "alex@example.invalid",
	age: 12,
	state: "GA",
	editUsers: false,
	saveEdit: "Save"
};
beforeEach(() => {
	setActivePinia(createPinia());
	vi.clearAllMocks();
	useAppStore().setCurrentUser(student);
});
describe("student class history", () => {
	it("preserves the class-date label rather than shifting midnight UTC to the previous day", async () => {
		vi.mocked(api.get).mockResolvedValue({
			data: {
				sessionNotes: [
					{
						_id: "note-1",
						studentName: "Alex",
						subject: "Session Notes",
						sessionDate: "2026-10-01T00:00:00.000Z",
						markdown: "A saved note.",
						createdAt: "2026-10-02T12:00:00Z"
					}
				],
				scheduledSessions: [],
				internalEmails: []
			}
		});
		const wrapper = mount(UserCommunicationPanel);
		await flushPromises();
		expect(wrapper.text()).toContain("Oct 1, 2026");
		wrapper.unmount();
	});
	it("shows one history category at a time and does not claim inbox delivery", async () => {
		vi.mocked(api.get).mockResolvedValue({
			data: {
				sessionNotes: [],
				scheduledSessions: [],
				internalEmails: [
					{
						_id: "message-1",
						primaryEmail: student.email,
						matchedRecipientEmail: student.email,
						subject: "Example message",
						markdown: "A saved message.",
						sentAt: "2026-10-07T12:00:00Z"
					}
				]
			}
		});
		const wrapper = mount(UserCommunicationPanel);
		await flushPromises();
		expect(
			wrapper.findAll(".history-panel").filter(panel => panel.isVisible())
		).toHaveLength(1);
		await wrapper.get('input[value="messages"]').setValue();
		expect(wrapper.text()).toContain("Sent to");
		expect(wrapper.text()).not.toContain("Delivered");
		wrapper.unmount();
	});
	it("ignores a late private history response after the signed-in student changes", async () => {
		let resolve!: (value: any) => void;
		vi.mocked(api.get).mockImplementationOnce(
			() =>
				new Promise(done => {
					resolve = done;
				})
		);
		const wrapper = mount(UserCommunicationPanel);
		vi.mocked(api.get).mockResolvedValue({
			data: {
				sessionNotes: [],
				scheduledSessions: [],
				internalEmails: []
			}
		});
		useAppStore().setCurrentUser({
			...student,
			_id: "student-2",
			name: "Sam"
		});
		await flushPromises();
		resolve({
			data: {
				sessionNotes: [
					{
						_id: "private-note",
						subject: "Previous student private note"
					}
				]
			}
		});
		await flushPromises();
		expect(wrapper.text()).not.toContain("Previous student private note");
		wrapper.unmount();
	});
});
