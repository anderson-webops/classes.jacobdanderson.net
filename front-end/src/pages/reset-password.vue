<script setup lang="ts">
import type { AxiosError } from "axios";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "@/api";
import { useAppStore } from "@/stores/app";

defineOptions({ name: "ResetPasswordPage" });

const route = useRoute();
const router = useRouter();
const app = useAppStore();
const newPassword = ref("");
const repeatedPassword = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const submitting = ref(false);
const token = computed(() => {
	const value = route.query.token;
	return typeof value === "string" ? value.trim() : "";
});
const passwordsMatch = computed(
	() => newPassword.value === repeatedPassword.value
);

async function submitPasswordReset() {
	errorMessage.value = "";
	successMessage.value = "";

	if (!token.value) {
		errorMessage.value = "This password reset link is missing or invalid.";
		return;
	}
	if (newPassword.value.length < 8) {
		errorMessage.value = "Use at least 8 characters for your new password.";
		return;
	}
	if (!passwordsMatch.value) {
		errorMessage.value = "Passwords do not match.";
		return;
	}

	submitting.value = true;
	try {
		const { data } = await api.post(
			"/accounts/password-reset/confirm",
			{ token: token.value, newPassword: newPassword.value },
			{ withCredentials: true }
		);
		successMessage.value =
			data.message ??
			"Password updated. You can now log in with your new password.";
		newPassword.value = "";
		repeatedPassword.value = "";
		await router.replace({ path: "/reset-password" });
	} catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>;
		errorMessage.value =
			error.response?.data?.message ??
			error.message ??
			"Unable to update your password.";
	} finally {
		submitting.value = false;
	}
}

async function openLogin() {
	await router.push("/");
	app.setLoginBlock(true);
}
</script>

<template>
	<section class="page-shell page-shell--narrow reset-password-page">
		<header class="hero">
			<p class="page-eyebrow">Account recovery</p>
			<h1 class="page-title">Choose a new password</h1>
			<p class="page-copy">
				Reset links expire after 30 minutes and stop working after one
				use.
			</p>
		</header>

		<div class="reset-card site-surface">
			<form
				v-if="!successMessage"
				class="reset-form"
				@submit.prevent="submitPasswordReset"
			>
				<p v-if="!token" class="notice" role="alert">
					This link is missing its reset token. Request a new link
					from the login window.
				</p>

				<label for="new-password">New password</label>
				<input
					id="new-password"
					v-model="newPassword"
					autocomplete="new-password"
					minlength="8"
					required
					type="password"
				/>

				<label for="repeat-new-password">Repeat new password</label>
				<input
					id="repeat-new-password"
					v-model="repeatedPassword"
					autocomplete="new-password"
					minlength="8"
					required
					type="password"
				/>

				<p v-if="errorMessage" class="notice" role="alert">
					{{ errorMessage }}
				</p>

				<button
					class="site-button"
					:disabled="submitting || !token"
					type="submit"
				>
					{{ submitting ? "Updating…" : "Update password" }}
				</button>
			</form>

			<div v-else class="success-state" role="status">
				<p>{{ successMessage }}</p>
				<button class="site-button" type="button" @click="openLogin">
					Open login
				</button>
			</div>
		</div>
	</section>
</template>

<style scoped>
.reset-password-page,
.hero,
.reset-form,
.success-state {
	display: grid;
	gap: 1.25rem;
}

.reset-card {
	padding: clamp(1.5rem, 4vw, 2.5rem);
}

.reset-form label {
	display: grid;
	gap: 0.4rem;
	color: var(--color-ink);
	font-weight: 800;
}

.reset-form input {
	width: 100%;
	box-sizing: border-box;
	padding: 0.9rem 1rem;
	border: 1px solid var(--color-border);
	border-radius: 14px;
	background: var(--color-surface-strong, #fff);
	color: var(--color-ink);
	font: inherit;
}

.notice {
	margin: 0;
	color: #b91c1c;
	font-weight: 800;
}

.success-state {
	justify-items: start;
}

.success-state p {
	margin: 0;
	color: #047857;
	font-weight: 800;
}

.site-button:disabled {
	cursor: not-allowed;
	opacity: 0.65;
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
