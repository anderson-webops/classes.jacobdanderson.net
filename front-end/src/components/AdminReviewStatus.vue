<script setup lang="ts">
import { onMounted, ref } from "vue";
import { api } from "@/api";
import { useAppStore } from "@/stores/app";

const app = useAppStore();
const message = ref("Checking session-note review…");
onMounted(async () => {
	if (!app.currentAdmin) {
		message.value = "";
		return;
	}
	try {
		const { data } = await api.get("/admin-mail/session-notes/review");
		const categories = [
			data.operations,
			data.unlinkedNotes,
			data.externalEvidence,
			data.writerMarkers
		];
		if (!categories.every(Array.isArray))
			throw new Error("Invalid review response");
		const count = categories.reduce((sum, list) => sum + list.length, 0);
		message.value = count
			? `${count} review entries need attention. Entries can refer to the same note; each list is bounded.`
			: "No session-note review entries returned.";
	} catch {
		message.value =
			"Session-note review status unavailable. Open review before sending.";
	}
});
</script>

<template>
	<p v-if="message" class="review-status" role="status">
		<RouterLink to="/admin/mdmail">{{ message }}</RouterLink>
	</p>
</template>

<style scoped>
.review-status {
	margin: 0;
	padding: 0.5rem 0.75rem;
	border: 1px solid var(--color-border);
	border-radius: 0.5rem;
	font-size: 0.9rem;
}
</style>
