<script setup lang="ts">
defineProps<{ studentId: string; canSend?: boolean }>();
function openTools(studentId: string, kind: string) {
	const tools = document.getElementById(
		`learner-${studentId}-${kind}`
	) as HTMLDetailsElement | null;
	if (!tools) return;
	tools.open = true;
	tools.scrollIntoView({ block: "start" });
	tools.querySelector("summary")?.focus({ preventScroll: true });
}
</script>

<template>
	<nav class="learner-context-actions" aria-label="Learner work">
		<RouterLink :to="{ path: '/courses', query: { learner: studentId } }"
			>Courses</RouterLink
		>
		<button type="button" @click="openTools(studentId, 'projects')">
			Projects
		</button>
		<RouterLink
			v-if="canSend"
			:to="{ path: '/admin/mdmail', query: { student: studentId } }"
			>Write session note</RouterLink
		>
		<button type="button" @click="openTools(studentId, 'sessions')">
			Sessions and saved notes
		</button>
	</nav>
</template>

<style scoped>
.learner-context-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem 1rem;
	margin: 0.5rem 0;
}
.learner-context-actions :is(a, button) {
	font: inherit;
	color: var(--color-accent);
	background: transparent;
	border: 0;
	padding: 0.25rem 0;
	text-decoration: underline;
}
</style>
