<script setup lang="ts">
import { onMounted, ref } from "vue";
import { api } from "@/api";

const available = ref(false);
const tutorsEnabled = ref(false);
const chosenAccess = ref(false);
const saving = ref(false);
const message = ref("");
const error = ref("");
onMounted(async () => {
	try {
		const { data } = await api.get("/session-notes/drafting/settings");
		available.value = data.siteAvailable === true;
		tutorsEnabled.value = data.tutorsEnabled === true;
		chosenAccess.value = tutorsEnabled.value;
	} catch {
		available.value = false;
	}
});
async function setAccess(value: boolean) {
	if (saving.value || value === tutorsEnabled.value) return;
	saving.value = true;
	error.value = message.value = "";
	try {
		await api.put("/session-notes/drafting/settings", {
			tutorsEnabled: value
		});
		tutorsEnabled.value = value;
		message.value = "Tutor drafting access updated.";
	} catch {
		error.value =
			"Unable to update tutor access. The setting has not changed.";
	} finally {
		chosenAccess.value = tutorsEnabled.value;
		saving.value = false;
	}
}
</script>

<template>
	<details v-if="available" class="draft-settings">
		<summary>Session-note AI</summary>
		<fieldset :disabled="saving">
			<legend>Allow tutors to generate drafts</legend>
			<label
				><input
					v-model="chosenAccess"
					type="radio"
					name="tutor-ai-access"
					:value="false"
					@change="setAccess(chosenAccess)"
				/>Disabled</label
			>
			<label
				><input
					v-model="chosenAccess"
					type="radio"
					name="tutor-ai-access"
					:value="true"
					@change="setAccess(chosenAccess)"
				/>Enabled</label
			>
		</fieldset>
		<p v-if="message" role="status">{{ message }}</p>
		<p v-if="error" role="alert">{{ error }}</p>
	</details>
</template>

<style scoped>
.draft-settings {
	border-top: 1px solid var(--color-border);
	padding-top: 0.75rem;
}
.draft-settings summary {
	cursor: pointer;
}
.draft-settings fieldset {
	display: flex;
	gap: 1rem;
	margin: 0.75rem 0;
	padding: 0;
	border: 0;
}
.draft-settings legend {
	margin-bottom: 0.5rem;
	font-size: 0.95rem;
}
.draft-settings label {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	font-size: 0.95rem;
}
.draft-settings p {
	font-size: 0.9rem;
}
</style>
