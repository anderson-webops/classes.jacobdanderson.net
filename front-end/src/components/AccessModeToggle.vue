<script setup lang="ts">
import { useId } from "vue";

defineProps<{ label: string }>();
const mode = defineModel<"account" | "course-code">({ required: true });
const groupName = useId();
</script>

<template>
	<fieldset class="access-mode-toggle">
		<legend class="sr-only">{{ label }}</legend>
		<label v-for="option in ['account', 'course-code']" :key="option">
			<input
				v-model="mode"
				:name="groupName"
				type="radio"
				:value="option"
			/>
			<span>{{ option === "account" ? "Account" : "Course code" }}</span>
		</label>
	</fieldset>
</template>

<style scoped>
.access-mode-toggle {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.25rem;
	min-width: 0;
	margin: 0 0 1rem;
	padding: 0.25rem;
	border: 1px solid var(--color-border);
	border-radius: 12px;
	background: var(--color-surface);
}

.access-mode-toggle label {
	position: relative;
	min-width: 0;
	margin: 0;
	cursor: pointer;
}

.access-mode-toggle input {
	position: absolute;
	width: 1px;
	height: 1px;
	opacity: 0;
}

.access-mode-toggle span {
	display: grid;
	place-items: center;
	min-height: 2.75rem;
	padding: 0.4rem 0.65rem;
	border-radius: 8px;
	color: var(--color-ink-soft);
	font-size: 0.95rem;
	font-weight: 600;
	text-align: center;
}

.access-mode-toggle input:checked + span {
	background: var(--color-surface-strong);
	color: var(--color-ink);
	box-shadow: 0 1px 4px rgba(8, 15, 28, 0.12);
}

.access-mode-toggle input:focus-visible + span {
	outline: 2px solid var(--color-accent);
	outline-offset: -2px;
}
</style>
