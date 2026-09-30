<script setup lang="ts">
import { computed, onBeforeUnmount, ref, shallowRef, watch } from "vue";
import CodeIdeWorkspace from "@/components/CodeIdeWorkspace.vue";
import { useAppStore } from "@/stores/app";

const app = useAppStore();
const workspace = ref<{ stop: () => void }>();
defineExpose({ stop: () => workspace.value?.stop() });
const ownerKey = computed(() => {
	if (app.currentAdmin?._id) return `admin:${app.currentAdmin._id}`;
	if (app.currentTutor?._id) return `tutor:${app.currentTutor._id}`;
	if (app.currentUser?._id) return app.currentUser._id;
	if (app.currentCourseLearner?._id)
		return `courseCodeLearner:${app.currentCourseLearner._id}`;
	return null;
});
let controller = new AbortController();
let generation = 0;
const session = shallowRef({
	generation,
	scope: { ownerKey: ownerKey.value, signal: controller.signal }
});

watch(
	ownerKey,
	owner => {
		controller.abort();
		controller = new AbortController();
		session.value = {
			generation: ++generation,
			scope: { ownerKey: owner, signal: controller.signal }
		};
	},
	{ flush: "sync" }
);
onBeforeUnmount(() => controller.abort());
</script>

<template>
	<CodeIdeWorkspace
		:key="session.generation"
		ref="workspace"
		:account-scope="session.scope"
	/>
</template>
