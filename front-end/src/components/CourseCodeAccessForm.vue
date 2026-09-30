<script setup lang="ts">
import { computed, ref } from "vue";
import { useAppStore } from "@/stores/app";

const app = useAppStore();
const code = ref("");
const username = ref("");
const password = ref("");
const error = ref("");
const success = ref("");
const submitting = ref(false);

const canSubmit = computed(
	() =>
		code.value.trim().length > 0 &&
		username.value.trim().length >= 2 &&
		password.value.length >= 12 &&
		password.value.length <= 128
);

async function redeemCode() {
	if (!canSubmit.value || submitting.value) return;
	error.value = "";
	success.value = "";
	submitting.value = true;

	try {
		const learner = await app.redeemCourseAccessCode(
			code.value,
			username.value,
			password.value
		);
		success.value = `Opened ${learner.codeLabel || learner.courseID} as ${learner.username}.`;
		code.value = "";
		username.value = "";
		password.value = "";
	} catch (reason: any) {
		error.value =
			reason.response?.data?.message ??
			reason.message ??
			"Unable to open that course.";
	} finally {
		submitting.value = false;
	}
}
</script>

<template>
	<section class="course-code-access site-surface site-surface--soft">
		<div class="course-code-copy">
			<p class="page-eyebrow">Classroom access</p>
			<h2>Use a course code</h2>
			<p>
				Enter the code from your tutor, your username, and your private
				password. You can open the assigned course and sync IDE projects
				without providing an email address.
			</p>
		</div>

		<form class="course-code-form" @submit.prevent="redeemCode">
			<label>
				<span>Course code</span>
				<input
					v-model="code"
					autocomplete="one-time-code"
					inputmode="text"
					maxlength="20"
					placeholder="ABCD-EFGH-JKLM"
					spellcheck="false"
				/>
			</label>
			<label>
				<span>Username</span>
				<input
					v-model="username"
					autocomplete="username"
					maxlength="40"
					placeholder="Your classroom username"
					spellcheck="false"
				/>
			</label>
			<label>
				<span>Private password</span>
				<input
					v-model="password"
					type="password"
					autocomplete="current-password"
					minlength="12"
					maxlength="128"
					required
					placeholder="At least 12 characters"
				/>
			</label>
			<button
				class="site-button site-button--primary"
				:disabled="!canSubmit || submitting"
				type="submit"
			>
				{{ submitting ? "Opening…" : "Open course" }}
			</button>
		</form>

		<p v-if="success" class="course-code-status is-success" role="status">
			{{ success }}
		</p>
		<p v-if="error" class="course-code-status is-error" role="alert">
			{{ error }}
		</p>
		<p class="course-code-note">
			For a new username, choose and save a private password of 12–128
			characters. Use the same password to reopen your saved projects.
			Never share it with classmates. If you previously used only a code
			and username, or forgot your password, ask your tutor to recover
			your existing workspace. Your projects are preserved.
		</p>
	</section>
</template>

<style scoped>
.course-code-access {
	display: grid;
	gap: 1.25rem;
	padding: clamp(1.4rem, 2.8vw, 2rem);
}

.course-code-copy {
	display: grid;
	gap: 0.65rem;
}

.course-code-copy h2,
.course-code-copy p {
	margin: 0;
}

.course-code-copy p:last-child,
.course-code-note {
	color: var(--color-ink-soft);
	line-height: 1.65;
}

.course-code-form {
	display: grid;
	grid-template-columns: repeat(3, minmax(10rem, 1fr)) auto;
	gap: 1rem;
	align-items: end;
}

.course-code-form label {
	display: grid;
	gap: 0.45rem;
	font-weight: 650;
	color: var(--color-ink);
}

.course-code-form input {
	width: 100%;
	min-height: 3rem;
	padding: 0.75rem 0.9rem;
	border: 1px solid var(--color-border);
	border-radius: 14px;
	background: var(--color-surface);
	color: var(--color-ink);
}

.course-code-status,
.course-code-note {
	margin: 0;
}

.course-code-status {
	padding: 0.75rem 0.9rem;
	border-radius: 12px;
}

.course-code-status.is-success {
	background: color-mix(in srgb, #10b981 14%, transparent);
	color: var(--color-ink);
}

.course-code-status.is-error {
	background: color-mix(in srgb, #ef4444 14%, transparent);
	color: var(--color-danger, #b42318);
}

.course-code-note {
	font-size: 0.92rem;
}

@media (max-width: 850px) {
	.course-code-form {
		grid-template-columns: 1fr;
	}

	.course-code-form .site-button {
		width: 100%;
	}
}
</style>
