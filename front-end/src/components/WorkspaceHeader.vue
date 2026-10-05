<script setup lang="ts">
defineProps<{ title: string; description?: string }>();
</script>

<template>
	<header class="workspace-heading">
		<div>
			<h1>{{ title }}</h1>
			<p v-if="description">{{ description }}</p>
		</div>
		<div v-if="$slots.default" class="workspace-heading__actions">
			<slot />
		</div>
	</header>
</template>

<style scoped>
.workspace-heading {
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 0.75rem;
	padding: 0.75rem 0;
	color: var(--color-ink);
}
.workspace-heading h1 {
	margin: 0;
	font-size: clamp(1.35rem, 3vw, 1.8rem);
}
.workspace-heading p {
	margin: 0.35rem 0 0;
	color: var(--color-ink-soft);
	max-width: 65ch;
	font-size: 0.95rem;
}
.workspace-heading__actions {
	display: flex;
	gap: 0.5rem;
	flex-wrap: wrap;
	align-items: center;
}
</style>
