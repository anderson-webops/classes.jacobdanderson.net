<script setup lang="ts">
defineProps<{ label: string }>();
</script>

<template>
	<p class="workspace-storage" role="status">
		<strong>{{ label }}</strong
		><span v-if="$slots.default"><slot /></span>
	</p>
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
</style>
