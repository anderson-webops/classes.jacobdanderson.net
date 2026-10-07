<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import SelfAccountSettings from "@/components/SelfAccountSettings.vue";
import UserCommunicationPanel from "@/components/UserCommunicationPanel.vue";
import WorkspaceViewToggle from "@/components/WorkspaceViewToggle.vue";
import { useAppStore } from "@/stores/app";

const { currentUser, tutors } = storeToRefs(useAppStore());
const mode = ref("profile");
const historyOpened = ref(false);
const options = [
	{ value: "profile", label: "Profile" },
	{ value: "history", label: "Classes & notes" }
];
const assignedTutorNames = computed(() =>
	(currentUser.value?.tutors ?? [])
		.map(tutor =>
			typeof tutor === "string"
				? tutors.value.find(candidate => candidate._id === tutor)?.name
				: tutor.name
		)
		.filter(Boolean)
		.join(", ")
);
function onModeChange(value: string) {
	mode.value = value;
	if (value === "history") historyOpened.value = true;
}
</script>

<template>
	<section
		v-if="currentUser"
		:key="currentUser._id"
		class="student-workspace"
	>
		<WorkspaceViewToggle
			:model-value="mode"
			label="Account view"
			:options="options"
			@update:model-value="onModeChange"
		/>
		<SelfAccountSettings
			v-show="mode === 'profile'"
			:entity="currentUser"
			role="user"
		/>
		<div v-if="historyOpened" v-show="mode === 'history'">
			<p v-if="assignedTutorNames" class="tutor-contact">
				Instructor: {{ assignedTutorNames }}
			</p>
			<UserCommunicationPanel />
		</div>
	</section>
</template>

<style scoped>
.student-workspace {
	display: grid;
	gap: 1rem;
	min-width: 0;
	color: var(--color-ink);
}
.tutor-contact {
	margin: 0 0 0.75rem;
	font-size: 0.95rem;
	color: var(--color-ink-soft);
}
</style>
