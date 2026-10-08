<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { api } from "@/api";
import { useSessionNoteDraftSettings } from "@/modules/useSessionNoteDraftSettings";

const { settings, loading, loadError, loadSettings } =
	useSessionNoteDraftSettings();
const available = computed(() => settings.value?.siteAvailable === true);
const tutorsEnabled = ref(false);
const chosenAccess = ref(false);
const saving = ref(false);
const message = ref("");
const error = ref("");
watch(settings, data => {
	if (!data) return;
	tutorsEnabled.value = data.tutorsEnabled;
	chosenAccess.value = tutorsEnabled.value;
});
async function setAccess(value: boolean) {
	if (
		!available.value ||
		loading.value ||
		saving.value ||
		value === tutorsEnabled.value
	) {
		return;
	}
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
	<section v-if="available || loadError" class="draft-settings">
		<h3>Session-note AI</h3>
		<div v-if="loadError" role="alert">
			<p>{{ loadError }}</p>
			<button type="button" :disabled="loading" @click="loadSettings">
				Retry drafting settings
			</button>
		</div>
		<fieldset v-if="available" :disabled="saving || loading">
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
	</section>
</template>

<style scoped>
.draft-settings {
	border-top: 1px solid var(--color-border);
	padding-top: 0.75rem;
}
.draft-settings h3 {
	font-size: 1rem;
	margin: 0 0 0.5rem;
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
