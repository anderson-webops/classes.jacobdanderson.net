<script lang="ts" setup>
import { ref, watch } from "vue";
import { api } from "@/api";
import { useAppStore } from "@/stores/app";

const props = defineProps<{
	entityId: string;
	role: "admin" | "tutor" | "user";
	email: string;
}>();

const app = useAppStore();
const newEmail = ref(props.email);
const currentPassword = ref("");
const newPassword = ref("");
const error = ref("");
const success = ref("");

watch(
	() => props.email,
	value => {
		newEmail.value = value;
	}
);

function clearStatus() {
	error.value = "";
	success.value = "";
}

async function refreshRole() {
	if (props.role === "admin") await app.refreshCurrentAdmin();
	else if (props.role === "tutor") await app.refreshCurrentTutor();
	else await app.refreshCurrentUser();
}

async function changeEmail() {
	clearStatus();
	if (!newEmail.value.trim()) {
		error.value = "Please provide a valid email.";
		return;
	}
	try {
		await api.post(`/accounts/changeEmail/${props.entityId}`, {
			email: newEmail.value.trim()
		});
		await refreshRole();
		success.value = "Email updated successfully.";
	} catch (e: any) {
		error.value =
			e.response?.data?.message ?? e.message ?? "Unable to change email";
	}
}

async function changePassword() {
	clearStatus();
	if (!currentPassword.value || !newPassword.value) {
		error.value = "Both current and new passwords are required.";
		return;
	}
	try {
		await api.post("/accounts/changePassword", {
			currentPassword: currentPassword.value,
			newPassword: newPassword.value
		});
		success.value = "Password updated successfully.";
		currentPassword.value = "";
		newPassword.value = "";
	} catch (e: any) {
		error.value =
			e.response?.data?.message ??
			e.message ??
			"Unable to change password";
	}
}
</script>

<template>
	<section class="security-settings" @click.stop>
		<h4>Security</h4>
		<div class="form-group">
			<label for="email-input">Update email</label>
			<div class="field-row">
				<input
					id="email-input"
					v-model="newEmail"
					type="email"
					placeholder="Enter new email"
				/>
				<button type="button" @click="changeEmail">Save Email</button>
			</div>
		</div>
		<div class="form-group">
			<label>Update password</label>
			<div class="password-grid">
				<input
					v-model="currentPassword"
					type="password"
					placeholder="Current password"
				/>
				<input
					v-model="newPassword"
					type="password"
					placeholder="New password"
				/>
				<button type="button" @click="changePassword">
					Save Password
				</button>
			</div>
		</div>
		<p v-if="error" class="status error">{{ error }}</p>
		<p v-if="success" class="status success">{{ success }}</p>
	</section>
</template>

<style scoped>
.security-settings {
	margin-top: 1rem;
	border-top: 1px solid rgba(0, 0, 0, 0.1);
	padding-top: 1rem;
	text-align: left;
}

.form-group {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	margin-bottom: 1rem;
}

.field-row {
	display: flex;
	gap: 0.5rem;
	flex-wrap: wrap;
}

.password-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

input {
	flex: 1;
	min-width: 12rem;
	padding: 0.4rem 0.6rem;
	border: 1px solid #d4d4d8;
	border-radius: 0.35rem;
}

button {
	padding: 0.4rem 0.8rem;
	border: none;
	border-radius: 0.35rem;
	background: #1e3a8a;
	color: #fff;
	cursor: pointer;
}

.status {
	margin: 0.5rem 0 0;
	font-size: 0.9rem;
}

.status.error {
	color: #dc2626;
}

.status.success {
	color: #15803d;
}
</style>
