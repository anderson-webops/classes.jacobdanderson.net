<script lang="ts" setup>
import { storeToRefs } from "pinia";
import TutorProfile from "@/components/TutorProfile.vue";
import WorkspaceHeader from "@/components/WorkspaceHeader.vue";
import { useAppStore } from "@/stores/app";

const app = useAppStore();
const { currentTutor } = storeToRefs(app);
</script>

<template>
	<section class="teaching-page">
		<div class="teaching-frame">
			<WorkspaceHeader title="Teaching" />

			<TutorProfile v-if="currentTutor" mode="teaching" />

			<div v-else class="teaching-empty">
				<h2>Sign in as a tutor</h2>
				<p>
					The teaching workspace is available after a tutor account is
					signed in.
				</p>
			</div>
		</div>
	</section>
</template>

<style scoped>
.teaching-page {
	margin: 0;
	padding: 0.75rem 1rem 2rem;
}
.teaching-frame {
	width: min(1180px, 100%);
	margin: 0 auto;
	display: grid;
	gap: 0.5rem;
}
.teaching-empty {
	display: grid;
	gap: 0.7rem;
	padding: 1.25rem;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-md);
	background: var(--color-surface);
	color: var(--color-ink);
}
.teaching-empty h2,
.teaching-empty p {
	margin: 0;
}
.teaching-empty p {
	color: var(--color-ink-soft);
	line-height: 1.65;
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
