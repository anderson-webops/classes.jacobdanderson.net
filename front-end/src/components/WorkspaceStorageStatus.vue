<script setup lang="ts">
import WorkspaceDisclosure from "@/components/WorkspaceDisclosure.vue";

defineProps<{ label: string }>();
</script>

<template>
	<WorkspaceDisclosure class="workspace-storage">
		<template #label>
			<span role="status">{{ label }}</span>
		</template>
		<p v-if="$slots.default"><slot /></p>
	</WorkspaceDisclosure>
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

.workspace-storage :deep(.workspace-disclosure__trigger) {
	cursor: pointer;
}
.workspace-storage p {
	margin-top: 0.35rem;
	max-width: 65ch;
}
</style>
