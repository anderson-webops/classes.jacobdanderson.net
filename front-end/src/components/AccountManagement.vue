<!-- src/components/AccountManagement.vue -->
<script lang="ts" setup>
import type { AxiosError } from "axios";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { api } from "@/api";
import AccessibleDialog from "@/components/AccessibleDialog.vue";
import { useAppStore } from "@/stores/app";

const app = useAppStore();

// ─── LOGIN STATE & METHODS ──────────────────────────────────────────
const { loginBlock, signupBlock } = storeToRefs(app);

const loginEmail = ref("");
const loginPassword = ref("");
const rememberMe = ref(false);
const errorLogin = ref("");
const loginView = ref<"login" | "password-reset">("login");
const resetEmail = ref("");
const resetMessage = ref("");
const resetError = ref("");
const resetSubmitting = ref(false);
const loginDialogTitle = computed(() =>
	loginView.value === "login" ? "Log in" : "Reset your password"
);
const loginDialogDescription = computed(() =>
	loginView.value === "login"
		? "Log in with the email and password connected to your classes account."
		: "Request a one-time password reset link for your classes account."
);

function changeLoginView(show: boolean) {
	if (!show) {
		loginView.value = "login";
		resetMessage.value = "";
		resetError.value = "";
	}
	app.setLoginBlock(show);
}

function openSignupFromLogin() {
	changeLoginView(false);
	changeSignupView(true);
}

function openPasswordReset() {
	resetEmail.value = loginEmail.value;
	resetMessage.value = "";
	resetError.value = "";
	loginView.value = "password-reset";
}

function returnToLogin() {
	resetMessage.value = "";
	resetError.value = "";
	loginView.value = "login";
}

async function requestPasswordReset() {
	resetMessage.value = "";
	resetError.value = "";
	resetSubmitting.value = true;

	try {
		const { data } = await api.post(
			"/accounts/password-reset/request",
			{ email: resetEmail.value },
			{ withCredentials: true }
		);
		resetMessage.value =
			data.message ??
			"If an account uses that email, a password reset link is on its way.";
	} catch (err: unknown) {
		const e = err as AxiosError<{ message?: string }>;
		resetError.value =
			e.response?.data?.message ??
			e.message ??
			"Unable to request a password reset.";
	} finally {
		resetSubmitting.value = false;
	}
}

async function loginTutor() {
	errorLogin.value = "";
	if (!loginEmail.value || !loginPassword.value) return;
	try {
		const { data } = await api.post(
			"/accounts/login",
			{
				email: loginEmail.value,
				password: loginPassword.value,
				remember: rememberMe.value
			},
			{ withCredentials: true }
		);
		if (data.currentTutor) app.setCurrentTutor(data.currentTutor);
		if (data.currentUser) app.setCurrentUser(data.currentUser);
		if (data.currentAdmin) app.setCurrentAdmin(data.currentAdmin);
		changeLoginView(false);
		rememberMe.value = false;
	} catch (err: unknown) {
		const e = err as AxiosError<{ message?: string }>;
		errorLogin.value = `Login failed: ${e.response?.data?.message ?? e.message ?? "Unknown error"}`;
	}
}

// form state (new signups default to users)
const name = ref("");
const age = ref("");
const state = ref("");
const email = ref("");
const password = ref("");
const passwordRepeat = ref("");
const error = ref("");

// simple password‐match guard
const passwordMatch = computed(() => password.value === passwordRepeat.value);

// close / open (comes from your store)
function changeSignupView(show: boolean) {
	app.setSignupBlock(show);
}

// reset inputs after submission
function resetData() {
	name.value =
		age.value =
		state.value =
		email.value =
		password.value =
		passwordRepeat.value =
			"";
	error.value = "";
}

// on submit, dispatch to the right endpoint
async function addSignup() {
	error.value = "";
	if (!passwordMatch.value) return;

	try {
		// every self-serve signup creates a user account
		const res = await api.post(
			"/users",
			{
				name: name.value,
				age: age.value,
				state: state.value,
				email: email.value,
				password: password.value
			},
			{ withCredentials: true }
		);

		// immediately stash the newly-created user/tutor into Pinia
		if (res.data.currentTutor) {
			app.setCurrentTutor(res.data.currentTutor);
		} else if (res.data.currentUser) {
			app.setCurrentUser(res.data.currentUser);
		}

		resetData();
		changeSignupView(false);
	} catch (err: unknown) {
		const e = err as AxiosError<{ message?: string }>;
		error.value = `Error: ${e.response?.data?.message ?? e.message ?? "Unknown error"}`;
	}
}
</script>

<template>
	<div>
		<AccessibleDialog
			close-label="Close login dialog"
			:description="loginDialogDescription"
			dialog-id="login-dialog"
			:open="loginBlock"
			:title="loginDialogTitle"
			@close="changeLoginView(false)"
		>
			<form
				v-if="loginView === 'login'"
				class="auth-form loginForm"
				@submit.prevent="loginTutor"
			>
				<label for="uname">Email</label>
				<input
					id="uname"
					v-model="loginEmail"
					autocomplete="email"
					placeholder="Enter Email"
					required
					type="email"
				/>

				<label for="psw1">Password</label>
				<input
					id="psw1"
					v-model="loginPassword"
					autocomplete="current-password"
					placeholder="Enter Password"
					required
					type="password"
				/>

				<label class="remember">
					<input
						v-model="rememberMe"
						name="remember"
						type="checkbox"
					/>
					Remember me
				</label>

				<p
					v-if="errorLogin"
					id="login-error"
					class="error"
					role="alert"
				>
					{{ errorLogin }}
				</p>

				<div class="auth-actions">
					<button class="button" type="submit">Login</button>
					<button
						class="button secondary"
						type="button"
						@click="changeLoginView(false)"
					>
						Cancel
					</button>
				</div>

				<p class="auth-switch">
					Don't have an account?
					<button
						class="text-button"
						type="button"
						@click="openSignupFromLogin"
					>
						Sign up
					</button>
				</p>
				<p class="auth-help">
					Forgot your password?
					<button
						class="text-button"
						type="button"
						@click="openPasswordReset"
					>
						Reset it securely</button
					>.
				</p>
			</form>

			<form
				v-else
				class="auth-form password-reset-form"
				@submit.prevent="requestPasswordReset"
			>
				<p class="auth-help">
					Enter your account email. If it matches an account, you will
					receive a one-time link that expires in 30 minutes.
				</p>

				<label for="reset-email">Email</label>
				<input
					id="reset-email"
					v-model="resetEmail"
					autocomplete="email"
					placeholder="Enter Email"
					required
					type="email"
				/>

				<p v-if="resetMessage" class="success" role="status">
					{{ resetMessage }}
				</p>
				<p v-if="resetError" class="error" role="alert">
					{{ resetError }}
				</p>

				<div class="auth-actions">
					<button
						class="button"
						:disabled="resetSubmitting"
						type="submit"
					>
						{{ resetSubmitting ? "Sending…" : "Send reset link" }}
					</button>
					<button
						class="button secondary"
						type="button"
						@click="returnToLogin"
					>
						Back to login
					</button>
				</div>
			</form>
		</AccessibleDialog>

		<AccessibleDialog
			close-label="Close sign up dialog"
			description="Create a learner account to access assigned courses and class information."
			dialog-id="signup-dialog"
			:open="signupBlock"
			title="Sign up"
			@close="changeSignupView(false)"
		>
			<form class="auth-form signupForm" @submit.prevent="addSignup">
				<label for="name">Name</label>
				<input
					id="name"
					v-model="name"
					autocomplete="name"
					placeholder="Enter Name"
					required
					type="text"
				/>

				<label for="age">Age</label>
				<input
					id="age"
					v-model="age"
					inputmode="numeric"
					placeholder="Enter Age"
					required
					type="text"
				/>

				<label for="state">State</label>
				<input
					id="state"
					v-model="state"
					autocomplete="address-level1"
					placeholder="Enter State"
					required
					type="text"
				/>

				<label for="email">Email</label>
				<input
					id="email"
					v-model="email"
					autocomplete="email"
					placeholder="Enter Email"
					required
					type="email"
				/>

				<label for="psw2">Password</label>
				<input
					id="psw2"
					v-model="password"
					autocomplete="new-password"
					placeholder="Enter Password"
					required
					type="password"
				/>

				<label for="psw-repeat">Repeat Password</label>
				<input
					id="psw-repeat"
					v-model="passwordRepeat"
					autocomplete="new-password"
					placeholder="Repeat Password"
					required
					type="password"
				/>

				<p
					v-if="!passwordMatch"
					class="passwordMatchError"
					role="alert"
				>
					Passwords do not match.
				</p>
				<p v-if="error" class="error" role="alert">
					{{ error }}
				</p>

				<div class="auth-actions">
					<button class="button" type="submit">Create Account</button>
					<button
						class="button secondary"
						type="button"
						@click="changeSignupView(false)"
					>
						Cancel
					</button>
				</div>
			</form>
		</AccessibleDialog>
	</div>
</template>

<style scoped>
.auth-form {
	display: grid;
	gap: 0.8rem;
}

.auth-form label {
	display: grid;
	gap: 0.35rem;
	margin: 0;
	color: var(--color-ink, #10263a);
	font-weight: 800;
}

.auth-form input[type="email"],
.auth-form input[type="password"],
.auth-form input[type="text"] {
	width: 100%;
	box-sizing: border-box;
	padding: 0.85rem 0.95rem;
	border: 1px solid var(--color-border, rgba(148, 163, 184, 0.45));
	border-radius: 14px;
	background: var(--color-surface-strong, #fff);
	color: var(--color-ink, #10263a);
	font: inherit;
}

.remember {
	display: flex !important;
	grid-template-columns: none !important;
	flex-direction: row;
	align-items: center;
	gap: 0.55rem !important;
	font-weight: 600 !important;
}

.remember input {
	width: auto;
}

.auth-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	margin-top: 0.35rem;
}

.button {
	flex: 1 1 12rem;
	border: 1px solid #2563eb;
	border-radius: 999px;
	background: linear-gradient(135deg, #2563eb, #1d4ed8);
	color: #fff;
	padding: 0.85rem 1.1rem;
	cursor: pointer;
	font-weight: 800;
}

.button.secondary {
	border-color: var(--color-border, rgba(148, 163, 184, 0.45));
	background: var(--color-surface-soft, #f8fafc);
	color: var(--color-ink, #10263a);
}

.text-button {
	border: none;
	background: transparent;
	color: #1d4ed8;
	padding: 0;
	font: inherit;
	font-weight: 800;
	text-decoration: underline;
	cursor: pointer;
}

.auth-switch,
.auth-help,
.error,
.success,
.passwordMatchError {
	margin: 0;
	line-height: 1.55;
}

.auth-switch,
.auth-help {
	color: var(--color-ink-soft, #526779);
}

.auth-help a {
	color: #1d4ed8;
	font-weight: bold;
}

.error,
.passwordMatchError {
	color: #b91c1c;
	font-weight: 800;
}

.success {
	color: #047857;
	font-weight: 800;
}

.button:disabled {
	cursor: wait;
	opacity: 0.7;
}

.button:hover,
.text-button:hover {
	filter: brightness(0.96);
}

:global(html.dark) .text-button {
	color: #bfdbfe;
}

:global(html.dark) .text-button:hover {
	color: #dbeafe;
	filter: none;
}

@media (max-width: 520px) {
	.auth-actions {
		flex-direction: column;
	}

	.button {
		width: 100%;
	}
}
</style>
