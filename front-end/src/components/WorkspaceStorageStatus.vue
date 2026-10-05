<script setup lang="ts">
defineProps<{ label: string }>();
</script>

<template>
	<details class="workspace-storage">
		<summary>
			<span role="status">{{ label }}</span>
		</summary>
		<p v-if="$slots.default"><slot /></p>
	</details>
</template>

<style scoped>
.workspace-storage {
	margin: 0;
	color: var(--color-ink-soft);
	font-size: 0.85rem;
	line-height: 1.5;
}
.workspace-storage strong {
	font-weight: 600;
	color: var(--color-ink);
	margin-right: 0.35rem;
}

.workspace-storage summary {
	cursor: pointer;
}
.workspace-storage p {
	margin-top: 0.35rem;
	max-width: 65ch;
}
</style>
