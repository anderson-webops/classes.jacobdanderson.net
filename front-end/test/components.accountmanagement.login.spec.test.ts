// components/accountmanagement.login.spec.test.ts
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import AccountManagement from "../src/components/AccountManagement.vue";
import { useAppStore } from "../src/stores/app";
import * as apiMod from "../src/api";

// Mock the axios client we export from "@/api"
vi.mock("@/api", () => {
	const mock = {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		delete: vi.fn(),
		defaults: { baseURL: "/api", withCredentials: true }
	};
	return { api: mock };
});

describe("AccountManagement.vue login (happy path)", () => {
	beforeEach(() => {
		document.body.innerHTML = "";
		window.history.replaceState({}, "", "/");
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	it("offers only configured Google and Apple login choices and preserves Remember me", async () => {
		const app = useAppStore();
		app.setLoginBlock(true);
		window.history.replaceState({}, "", "/courses?view=current#python");
		(apiMod.api.get as any).mockResolvedValueOnce({
			data: { apple: true, google: true }
		});

		const wrapper = mount(AccountManagement, {
			attachTo: document.body,
			global: { stubs: { teleport: true } }
		});

		await vi.waitFor(() => {
			expect(wrapper.find(".oauth-button.google").exists()).toBe(true);
			expect(wrapper.find(".oauth-button.apple").exists()).toBe(true);
		});
		const google = wrapper.get<HTMLAnchorElement>(".oauth-button.google");
		const googleUrl = new URL(google.attributes("href"), window.location.origin);
		expect(google.text()).toContain("Continue with Google");
		expect(googleUrl.pathname).toBe("/api/accounts/oauth/google/start");
		expect(googleUrl.searchParams.get("returnTo"))
			.toBe("/courses?view=current#python");
		expect(googleUrl.searchParams.get("remember")).toBe("false");

		await wrapper.get('input[name="remember"]').setValue(true);
		const rememberedUrl = new URL(
			wrapper.get(".oauth-button.apple").attributes("href"),
			window.location.origin
		);
		expect(rememberedUrl.searchParams.get("remember")).toBe("true");
		wrapper.unmount();
	});

	it("hides social login choices when providers are not fully configured", async () => {
		const app = useAppStore();
		app.setLoginBlock(true);
		(apiMod.api.get as any).mockResolvedValueOnce({
			data: { apple: false, google: false }
		});

		const wrapper = mount(AccountManagement, {
			attachTo: document.body,
			global: { stubs: { teleport: true } }
		});

		await vi.waitFor(() => {
			expect(apiMod.api.get).toHaveBeenCalledWith(
				"/accounts/oauth/providers"
			);
		});
		expect(wrapper.find(".oauth-actions").exists()).toBe(false);
		expect(wrapper.text()).not.toContain("Continue with Google");
		expect(wrapper.text()).not.toContain("Continue with Apple");
		wrapper.unmount();
	});

	it("shows a safe OAuth callback error and removes it from the address bar", async () => {
		window.history.replaceState(
			{},
			"",
			"/courses?oauthError=account_not_found"
		);
		(apiMod.api.get as any).mockResolvedValueOnce({
			data: { apple: false, google: false }
		});

		const wrapper = mount(AccountManagement, {
			attachTo: document.body,
			global: { stubs: { teleport: true } }
		});
		const app = useAppStore();

		await vi.waitFor(() => {
			expect(app.loginBlock).toBe(true);
			expect(wrapper.text()).toContain(
				"No Classes account uses that provider email yet."
			);
		});
		expect(window.location.pathname).toBe("/courses");
		expect(window.location.search).toBe("");
		wrapper.unmount();
	});

	it("logs in a user, updates the store, and closes the login modal", async () => {
		const app = useAppStore();
		const loginFormPassphrase = "login-test-pass";
		// Open the login modal (component checks app.loginBlock)
		app.setLoginBlock(true);

		// Mock /accounts/login result with a user
		(apiMod.api.post as any).mockResolvedValueOnce({
			data: {
				currentUser: {
					_id: "u123",
					name: "User",
					email: "user@example.com",
					age: 20,
					state: "GA"
				}
			}
		});

		const wrapper = mount(AccountManagement, {
			attachTo: document.body,
			global: { stubs: { teleport: true } }
		});

		// Fill form and submit
		await wrapper.get("#uname").setValue("user@example.com");
		await wrapper.get("#psw1").setValue(loginFormPassphrase);
		await wrapper.get("form").trigger("submit.prevent");

		// Assert API call
		expect(apiMod.api.post).toHaveBeenCalledWith(
			"/accounts/login",
			{
				email: "user@example.com",
				password: loginFormPassphrase,
				remember: false
			},
			{ withCredentials: true }
		);

		// Store updated with currentUser and modal closed
		expect(app.currentUser?.email).toBe("user@example.com");
		expect(app.loginBlock).toBe(false);

		expect(document.querySelector("#login-dialog")).toBeNull();
		wrapper.unmount();
	});

	it("renders login as an accessible dialog and switches to signup without dead links", async () => {
		const app = useAppStore();
		app.setLoginBlock(true);

		const wrapper = mount(AccountManagement, {
			attachTo: document.body,
			global: { stubs: { teleport: true } }
		});

		const dialog = document.querySelector("#login-dialog");
		expect(dialog?.getAttribute("role")).toBe("dialog");
		expect(dialog?.getAttribute("aria-modal")).toBe("true");
		expect(dialog?.getAttribute("aria-labelledby")).toBe(
			"login-dialog-title"
		);
		expect(document.querySelector('a[href="#"]')).toBeNull();

		const signUpButton = wrapper
			.findAll("button")
			.find(button => button.text() === "Sign up");
		if (!signUpButton) throw new Error("Sign up button was not rendered.");
		await signUpButton.trigger("click");

		expect(app.loginBlock).toBe(false);
		expect(app.signupBlock).toBe(true);
		expect(document.querySelector("#signup-dialog")).not.toBeNull();
		wrapper.unmount();
	});

	it("requests a self-service password reset without revealing account existence", async () => {
		const app = useAppStore();
		app.setLoginBlock(true);
		(apiMod.api.post as any).mockResolvedValueOnce({
			data: {
				message: "If an account uses that email, a password reset link is on its way."
			}
		});

		const wrapper = mount(AccountManagement, {
			attachTo: document.body,
			global: { stubs: { teleport: true } }
		});

		await wrapper.get("#uname").setValue("julio@example.com");
		const resetButton = wrapper
			.findAll("button")
			.find(button => button.text() === "Reset it securely");
		if (!resetButton) throw new Error("Password reset button was not rendered.");
		await resetButton.trigger("click");

		expect(wrapper.get("#reset-email").element).toHaveProperty("value", "julio@example.com");
		await wrapper.get(".password-reset-form").trigger("submit.prevent");

		expect(apiMod.api.post).toHaveBeenCalledWith(
			"/accounts/password-reset/request",
			{ email: "julio@example.com" },
			{ withCredentials: true }
		);
		await vi.waitFor(() => {
			expect(wrapper.text()).toContain(
				"If an account uses that email, a password reset link is on its way."
			);
		});
		expect(wrapper.find('a[href^="mailto:"]').exists()).toBe(false);
		wrapper.unmount();
	});
});
