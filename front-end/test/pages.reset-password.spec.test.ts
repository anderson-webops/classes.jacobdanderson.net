import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api";
import ResetPasswordPage from "@/pages/reset-password.vue";

vi.mock("@/api", () => ({
	api: {
		post: vi.fn()
	}
}));

describe("reset password page", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	it("submits the emailed token and clears it from the address after success", async () => {
		const rawToken = "c".repeat(64);
		const router = createRouter({
			history: createMemoryHistory(),
			routes: [
				{ path: "/", component: { template: "<div>Home</div>" } },
				{ path: "/reset-password", component: ResetPasswordPage }
			]
		});
		await router.push(`/reset-password?token=${rawToken}`);
		await router.isReady();
		vi.mocked(api.post).mockResolvedValueOnce({
			data: { message: "Password updated. You can now log in with your new password." }
		} as any);

		const wrapper = mount(ResetPasswordPage, {
			global: { plugins: [router] }
		});
		await wrapper.get("#new-password").setValue("new-password-123");
		await wrapper.get("#repeat-new-password").setValue("new-password-123");
		await wrapper.get("form").trigger("submit.prevent");

		expect(api.post).toHaveBeenCalledWith(
			"/accounts/password-reset/confirm",
			{ token: rawToken, newPassword: "new-password-123" },
			{ withCredentials: true }
		);
		await vi.waitFor(() => {
			expect(wrapper.text()).toContain(
				"Password updated. You can now log in with your new password."
			);
		});
		await vi.waitFor(() => {
			expect(router.currentRoute.value.query).toEqual({});
		});
	});
});
