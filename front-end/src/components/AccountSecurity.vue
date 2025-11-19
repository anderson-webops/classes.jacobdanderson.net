<script lang="ts" setup>
import { ref, watch } from "vue";
import { api } from "@/api";
import { useAppStore } from "@/stores/app";

const props = defineProps<{
	entityId: string;
	role: "admin" | "tutor" | "user";
	currentEmail: string;
}>();

const app = useAppStore();
const emailValue = ref(props.currentEmail);
watch(
	() => props.currentEmail,
	value => {
		emailValue.value = value;
	}
);

const emailMessage = ref<string | null>(null);
const passwordMessage = ref<string | null>(null);
const passwordForm = ref({ current: "", next: "", confirm: "" });
const submitting = ref(false);

const refreshMap = {
	admin: () => app.refreshCurrentAdmin(),
	tutor: () => app.refreshCurrentTutor(),
	user: () => app.refreshCurrentUser()
};

async function updateEmail() {
	if (!emailValue.value || submitting.value) return;
	submitting.value = true;
	emailMessage.value = null;
	try {
		await api.post(`/accounts/changeEmail/${props.entityId}`, {
			email: emailValue.value
		});
		await refreshMap[props.role]();
		emailMessage.value = "Email updated successfully.";
	} catch (error: any) {
		emailMessage.value =
			error.response?.data?.message ?? "Unable to update email.";
	} finally {
		submitting.value = false;
	}
}

async function changePassword() {
	if (submitting.value) return;
	passwordMessage.value = null;
	const { current, next, confirm } = passwordForm.value;
	if (!current || !next || !confirm) {
		passwordMessage.value = "All password fields are required.";
		return;
	}
	if (next !== confirm) {
		passwordMessage.value = "New passwords do not match.";
		return;
	}
	submitting.value = true;
	try {
		await api.post(`/accounts/changePassword/${props.entityId}`, {
			currentPassword: current,
			newPassword: next
		});
		passwordMessage.value = "Password updated successfully.";
		passwordForm.value = { current: "", next: "", confirm: "" };
	} catch (error: any) {
		passwordMessage.value =
			error.response?.data?.message ?? "Unable to update password.";
	} finally {
		submitting.value = false;
	}
}
</script>

<template>
	<section class="account-security">
		<h3>Account security</h3>
		<div class="form-row">
			<label for="security-email">Email</label>
			<div class="input-group">
				<input
					id="security-email"
					v-model="emailValue"
					:disabled="submitting"
					type="email"
				/>
				<button
					class="btn btn-secondary"
					type="button"
					@click="updateEmail"
				>
					Update email
				</button>
			</div>
			<p v-if="emailMessage" class="status">{{ emailMessage }}</p>
		</div>

		<div class="form-row">
			<label>Password</label>
			<div class="password-grid">
				<input
					v-model="passwordForm.current"
					:disabled="submitting"
					placeholder="Current password"
					type="password"
				/>
				<input
					v-model="passwordForm.next"
					:disabled="submitting"
					placeholder="New password"
					type="password"
				/>
				<input
					v-model="passwordForm.confirm"
					:disabled="submitting"
					placeholder="Confirm new password"
					type="password"
				/>
			</div>
			<button
				class="btn btn-secondary"
				type="button"
				@click="changePassword"
			>
				Update password
			</button>
			<p v-if="passwordMessage" class="status">{{ passwordMessage }}</p>
		</div>
	</section>
</template>

<style scoped>
.account-security {
	margin-top: 1.5rem;
	text-align: left;
}

.account-security h3 {
	font-size: 1.1rem;
	margin-bottom: 0.5rem;
}

.form-row {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	margin-bottom: 1rem;
}

.input-group {
	display: flex;
	gap: 0.5rem;
	flex-wrap: wrap;
}

.input-group input {
	flex: 1 1 220px;
	padding: 0.5rem;
	border-radius: 6px;
	border: 1px solid #d1d5db;
}

.password-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	gap: 0.5rem;
}

.password-grid input {
	padding: 0.5rem;
	border-radius: 6px;
	border: 1px solid #d1d5db;
}

.btn {
	padding: 0.4rem 0.9rem;
	border-radius: 6px;
	border: none;
	cursor: pointer;
}

.btn.btn-secondary {
	background: #0f172a;
	color: #fff;
}

.status {
	margin: 0;
	font-size: 0.9rem;
	color: #0f172a;
}
</style>
