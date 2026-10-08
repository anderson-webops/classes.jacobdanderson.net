<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { api } from "@/api";
import WorkspaceDisclosure from "@/components/WorkspaceDisclosure.vue";
import { useAppStore } from "@/stores/app";

type Role = "admin" | "tutor" | "user";

const props = defineProps<{ entityId: string; role: Role; email: string }>();
const emit = defineEmits<{ busy: [busy: boolean] }>();
const editing = defineModel<boolean>("editing", { default: false });
const app = useAppStore();
const email = ref(props.email);
const emailStatus = ref("");
const emailError = ref("");
const emailPassword = ref("");
const emailSubmitting = ref(false);
let emailRequest: AbortController | null = null;

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const currentPasswordInput = ref<HTMLInputElement | null>(null);
const newPasswordInput = ref<HTMLInputElement | null>(null);
const confirmPasswordInput = ref<HTMLInputElement | null>(null);
const passwordStatus = ref("");
const passwordError = ref("");
const isPasswordSubmitting = ref(false);
let passwordRequest: AbortController | null = null;
const sessionStatus = ref("");
const sessionError = ref("");
watch(
	() => emailSubmitting.value || isPasswordSubmitting.value,
	value => emit("busy", value)
);
watch(editing, () => {
	email.value = props.email;
	emailPassword.value = "";
	clearPasswordInputs();
	emailError.value = passwordError.value = "";
});
const idPrefix = computed(
	() =>
		`account-security-${props.role}-${props.entityId.replace(
			/[^\w-]/g,
			"-"
		)}`
);

watch(
	() => props.email,
	value => {
		email.value = value;
	}
);

async function updateEmail() {
	emailStatus.value = "";
	emailError.value = "";
	if (emailSubmitting.value) return;
	if (!email.value || !emailPassword.value) {
		emailError.value = "Enter the new email and your current password.";
		return;
	}

	emailSubmitting.value = true;
	const password = emailPassword.value;
	emailPassword.value = "";
	const request = new AbortController();
	emailRequest = request;
	try {
		const { data } = await api.post(
			`/accounts/changeEmail/${props.entityId}`,
			{
				email: email.value,
				currentPassword: password
			},
			{ signal: request.signal, timeout: 30_000 }
		);
		if (emailRequest !== request) return;
		emailStatus.value =
			data.message ?? "Check your new email to verify the change.";
		editing.value = false;
	} catch (err: any) {
		if (emailRequest !== request) return;
		emailError.value =
			err.response?.data?.message ??
			err.message ??
			"Unable to update email.";
	} finally {
		if (emailRequest === request) {
			emailRequest = null;
			emailSubmitting.value = false;
			emailPassword.value = "";
		}
	}
}

function clearPasswordInputs() {
	currentPassword.value = newPassword.value = confirmPassword.value = "";
	for (const input of [
		currentPasswordInput,
		newPasswordInput,
		confirmPasswordInput
	]) {
		if (input.value) input.value.value = "";
	}
}

function resetPasswordForm() {
	passwordRequest?.abort();
	passwordRequest = null;
	isPasswordSubmitting.value = false;
	passwordStatus.value = "";
	passwordError.value = "";
	clearPasswordInputs();
}

function resetAccountForms() {
	resetPasswordForm();
	emailRequest?.abort();
	emailRequest = null;
	emailSubmitting.value = false;
	email.value = props.email;
	emailPassword.value = emailStatus.value = emailError.value = "";
	sessionStatus.value = sessionError.value = "";
	editing.value = false;
}
watch(() => [props.entityId, props.role], resetAccountForms, { flush: "sync" });
onBeforeUnmount(resetAccountForms);

async function updatePassword() {
	if (isPasswordSubmitting.value) return;
	passwordStatus.value = "";
	passwordError.value = "";
	if (!newPassword.value) {
		passwordError.value = "New password is required.";
		return;
	}
	if (newPassword.value !== confirmPassword.value) {
		passwordError.value = "New passwords do not match.";
		return;
	}

	const payload = {
		currentPassword: currentPassword.value,
		newPassword: newPassword.value
	};
	const request = new AbortController();
	passwordRequest = request;
	isPasswordSubmitting.value = true;
	clearPasswordInputs();
	try {
		await api.post(`/accounts/changePassword/${props.entityId}`, payload, {
			signal: request.signal,
			timeout: 30_000
		});
		if (passwordRequest !== request) return;
		passwordStatus.value = "Password updated successfully.";
		editing.value = false;
	} catch (err: any) {
		if (passwordRequest !== request) return;
		passwordError.value =
			err.response?.data?.message ??
			err.message ??
			"Unable to update password.";
	} finally {
		if (passwordRequest === request) {
			passwordRequest = null;
			isPasswordSubmitting.value = false;
			clearPasswordInputs();
		}
	}
}

async function signOutAllSessions() {
	sessionStatus.value = "";
	sessionError.value = "";
	try {
		const { data } = await api.post("/accounts/signout-all");
		sessionStatus.value =
			data.message ?? "All sessions have been signed out.";
		await app.logout();
	} catch (err: any) {
		sessionError.value =
			err.response?.data?.message ??
			err.message ??
			"Unable to sign out all sessions.";
	}
}
</script>

<template>
	<section class="security-card">
		<dl v-if="!editing" class="security-values">
			<div>
				<dt>Email</dt>
				<dd>{{ props.email }}</dd>
			</div>
			<div>
				<dt>Password</dt>
				<dd aria-label="Password is set">••••••••</dd>
			</div>
		</dl>
		<form
			v-if="editing"
			class="security-section email-form"
			@submit.prevent="updateEmail"
		>
			<h3>Change email</h3>
			<div class="field">
				<label :for="`${idPrefix}-email`">Email</label>
				<input
					:id="`${idPrefix}-email`"
					v-model="email"
					name="account-email"
					type="email"
				/>
			</div>
			<div class="field">
				<label :for="`${idPrefix}-email-password`"
					>Current password</label
				>
				<input
					:id="`${idPrefix}-email-password`"
					v-model="emailPassword"
					name="email-current-password"
					autocomplete="current-password"
					type="password"
					:disabled="emailSubmitting"
				/>
			</div>
			<button
				class="btn-secondary btn"
				type="submit"
				:disabled="emailSubmitting"
			>
				Send verification
			</button>
			<p v-if="emailError" class="error" role="alert">
				{{ emailError }}
			</p>
		</form>
		<p v-if="emailStatus" class="status" role="status" aria-live="polite">
			{{ emailStatus }}
		</p>

		<section v-if="editing" class="security-section">
			<h3>Change password</h3>
			<form
				:aria-busy="isPasswordSubmitting ? 'true' : 'false'"
				:aria-labelledby="`${idPrefix}-password-title`"
				class="password-form"
				@submit.prevent="updatePassword"
			>
				<h5 :id="`${idPrefix}-password-title`" class="sr-only">
					Change password
				</h5>
				<div class="field">
					<label :for="`${idPrefix}-current-password`"
						>Current password</label
					>
					<input
						:id="`${idPrefix}-current-password`"
						ref="currentPasswordInput"
						v-model="currentPassword"
						autocomplete="current-password"
						:disabled="isPasswordSubmitting"
						name="current-password"
						type="password"
					/>
				</div>
				<div class="field">
					<label :for="`${idPrefix}-new-password`"
						>New password</label
					>
					<input
						:id="`${idPrefix}-new-password`"
						ref="newPasswordInput"
						v-model="newPassword"
						autocomplete="new-password"
						:disabled="isPasswordSubmitting"
						name="new-password"
						type="password"
					/>
				</div>
				<div class="field">
					<label :for="`${idPrefix}-confirm-password`"
						>Confirm password</label
					>
					<input
						:id="`${idPrefix}-confirm-password`"
						ref="confirmPasswordInput"
						v-model="confirmPassword"
						autocomplete="new-password"
						:disabled="isPasswordSubmitting"
						name="confirm-password"
						type="password"
					/>
				</div>
				<button
					class="btn-primary btn"
					:disabled="isPasswordSubmitting"
					type="submit"
				>
					{{ isPasswordSubmitting ? "Updating…" : "Update password" }}
				</button>
				<p v-if="passwordError" class="error" role="alert">
					{{ passwordError }}
				</p>
			</form>
		</section>
		<p
			v-if="passwordStatus"
			class="status"
			role="status"
			aria-live="polite"
		>
			{{ passwordStatus }}
		</p>

		<WorkspaceDisclosure
			class="security-section advanced-settings"
			label="Advanced Settings"
		>
			<button
				class="btn-danger btn"
				type="button"
				@click="signOutAllSessions"
			>
				Sign out of all sessions
			</button>
			<p v-if="sessionStatus" class="status success" role="status">
				{{ sessionStatus }}
			</p>
			<p v-if="sessionError" class="status error" role="alert">
				{{ sessionError }}
			</p>
			<slot name="advanced" />
		</WorkspaceDisclosure>
	</section>
</template>

<style scoped>
.security-card {
	display: grid;
	gap: 0.75rem;
	text-align: left;
}
.security-section {
	border-top: 1px solid var(--color-border);
	padding-top: 0.65rem;
}
.security-section > h3 {
	font-size: 1rem;
	margin: 0 0 0.85rem;
}
.security-values {
	margin: 0;
}
.security-values > div {
	display: grid;
	grid-template-columns: 6rem minmax(0, 1fr);
	gap: 0.75rem;
	padding-block: 0.35rem;
}
.security-values dt {
	font-weight: 500;
	color: var(--color-ink-soft);
}
.security-values dd {
	margin: 0;
	overflow-wrap: anywhere;
}
.security-section > .field:first-of-type {
	margin-bottom: 0.85rem;
}
.security-section form {
	margin: 0;
	padding: 0;
	border: 0;
}
.field {
	display: grid;
	gap: 0.35rem;
	margin-bottom: 0.75rem;
	font-size: 0.9rem;
}
.field input {
	width: 100%;
	border: 1px solid var(--color-border);
	border-radius: 6px;
	padding: 0.5rem 0.65rem;
	color: var(--color-ink);
	background: var(--color-surface);
}
.status {
	color: var(--color-accent);
	margin: 0.5rem 0 0;
}
.error {
	color: var(--color-danger, #b91c1c);
	margin: 0.5rem 0 0;
}
</style>
