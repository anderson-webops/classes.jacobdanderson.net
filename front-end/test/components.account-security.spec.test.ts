import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AccountSecurity from "@/components/AccountSecurity.vue";

const apiMocks = vi.hoisted(() => ({
	post: vi.fn()
}));

vi.mock("@/api", () => ({
	api: {
		post: apiMocks.post
	}
}));

describe("AccountSecurity", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		setActivePinia(createPinia());
	});

	it("uses entity-specific form control ids", () => {
		const first = mount(AccountSecurity, {
			props: {
				email: "first@example.com",
				entityId: "first-user",
				role: "user"
			}
		});
		const second = mount(AccountSecurity, {
			props: {
				email: "second@example.com",
				entityId: "second-user",
				role: "user"
			}
		});

		expect(first.find("label").attributes("for")).toBe(
			"account-security-user-first-user-email"
		);
		expect(second.find("label").attributes("for")).toBe(
			"account-security-user-second-user-email"
		);
		expect(first.find("#account-security-user-first-user-email").exists()).toBe(
			true
		);
		expect(
			second.find("#account-security-user-second-user-email").exists()
		).toBe(true);
	});

	it("lets the current account revoke other signed-in sessions", async () => {
		apiMocks.post.mockResolvedValue({
			data: { message: "Other signed-in sessions have been revoked." }
		});
		const wrapper = mount(AccountSecurity, {
			props: {
				email: "student@example.com",
				entityId: "student-user",
				role: "user"
			}
		});
		const button = wrapper
			.findAll("button")
			.find(candidate => candidate.text() === "Sign out other sessions");

		expect(button).toBeDefined();
		await button!.trigger("click");
		await flushPromises();

		expect(apiMocks.post).toHaveBeenCalledWith("/accounts/revoke-sessions");
		expect(wrapper.text()).toContain(
			"Other signed-in sessions have been revoked."
		);
	});
});
