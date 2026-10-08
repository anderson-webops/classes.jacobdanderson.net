import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SelfAccountSettings from "@/components/SelfAccountSettings.vue";
import { useAppStore } from "@/stores/app";

const mocks = vi.hoisted(() => ({ put: vi.fn(), post: vi.fn() }));
vi.mock("@/api", () => ({ api: mocks }));
const entity = {
	_id: "synthetic",
	name: "Test Learner",
	email: "old@example.invalid"
};
function mountSettings(role: "admin" | "tutor" | "user" = "user") {
	return mount(SelfAccountSettings, {
		props: { entity, role },
		global: { stubs: { SessionNoteDraftSettings: true } }
	});
}

describe("SelfAccountSettings", () => {
	beforeEach(() => {
		vi.resetAllMocks();
		setActivePinia(createPinia());
	});
	it.each(["admin", "tutor", "user"] as const)(
		"keeps %s information read-only until Edit and discards canceled changes",
		async role => {
			const wrapper = mountSettings(role);
			expect(wrapper.find("input").exists()).toBe(false);
			expect(wrapper.text()).toContain(entity.name);
			expect(wrapper.text()).toContain(entity.email);
			expect(
				wrapper
					.get(".advanced-settings > button")
					.attributes("aria-expanded")
			).toBe("false");
			await wrapper.get(".profile-heading button").trigger("click");
			await wrapper.get('[name="profile-name"]').setValue("Not saved");
			await wrapper.get('[name="new-password"]').setValue("private-test");
			await wrapper.get(".profile-heading button").trigger("click");
			expect(wrapper.find("input").exists()).toBe(false);
			expect(wrapper.text()).toContain(entity.name);
			expect(mocks.put).not.toHaveBeenCalled();
			expect(mocks.post).not.toHaveBeenCalled();
			await wrapper.get(".profile-heading button").trigger("click");
			expect(
				wrapper.get<HTMLInputElement>('[name="profile-name"]').element
					.value
			).toBe(entity.name);
			expect(
				wrapper.get<HTMLInputElement>('[name="new-password"]').element
					.value
			).toBe("");
			wrapper.unmount();
		}
	);
	it.each([
		["user", "/users/user/", "refreshCurrentUser"],
		["tutor", "/tutors/", "refreshCurrentTutor"],
		["admin", "/admins/", "refreshCurrentAdmin"]
	] as const)(
		"updates a %s name through its existing authorized endpoint",
		async (role, path, refresh) => {
			mocks.put.mockResolvedValue({});
			const refreshAccount = vi
				.spyOn(useAppStore(), refresh)
				.mockResolvedValue();
			const wrapper = mountSettings(role);
			await wrapper.get(".profile-heading button").trigger("click");
			await wrapper
				.get('[name="profile-name"]')
				.setValue(" Updated Name ");
			await wrapper.get(".profile-name-form").trigger("submit");
			await flushPromises();
			expect(mocks.put).toHaveBeenCalledWith(
				path + entity._id,
				{ name: "Updated Name" },
				{ signal: expect.any(AbortSignal), timeout: 30_000 }
			);
			expect(refreshAccount).toHaveBeenCalledOnce();
			expect(wrapper.find("input").exists()).toBe(false);
			expect(wrapper.text()).toContain("Name updated.");
			wrapper.unmount();
		}
	);
	it("keeps failed changes editable and ignores obsolete name responses", async () => {
		mocks.put.mockRejectedValueOnce(new Error("offline"));
		const wrapper = mountSettings();
		await wrapper.get(".profile-heading button").trigger("click");
		await wrapper.get('[name="profile-name"]').setValue("Draft Name");
		await wrapper.get("form").trigger("submit");
		await flushPromises();
		expect(wrapper.text()).toContain("Unable to update your name.");
		expect(
			wrapper.get<HTMLInputElement>('[name="profile-name"]').element.value
		).toBe("Draft Name");
		let finish!: () => void;
		mocks.put.mockImplementationOnce(
			() =>
				new Promise<void>(resolve => {
					finish = resolve;
				})
		);
		await wrapper.get(".profile-name-form").trigger("submit");
		const signal = mocks.put.mock.calls[1][2].signal as AbortSignal;
		await wrapper.setProps({
			entity: { ...entity, _id: "another", name: "Another Learner" }
		});
		expect(signal.aborted).toBe(true);
		finish();
		await flushPromises();
		expect(wrapper.find("input").exists()).toBe(false);
		expect(wrapper.text()).toContain("Another Learner");
		expect(wrapper.text()).not.toContain("Name updated.");
		wrapper.unmount();
	});
	it("returns to the original email pending verification, not an optimistic new address", async () => {
		mocks.post.mockResolvedValue({
			data: { message: "Check your new email to verify the change." }
		});
		const wrapper = mountSettings();
		await wrapper.get(".profile-heading button").trigger("click");
		await wrapper
			.get('[name="account-email"]')
			.setValue("new@example.invalid");
		await wrapper
			.get('[name="email-current-password"]')
			.setValue("synthetic-only");
		await wrapper.get(".email-form").trigger("submit");
		await flushPromises();
		expect(wrapper.find("input").exists()).toBe(false);
		expect(wrapper.text()).toContain(entity.email);
		expect(wrapper.text()).not.toContain("new@example.invalid");
		expect(wrapper.text()).toContain(
			"Check your new email to verify the change."
		);
		wrapper.unmount();
	});
});
