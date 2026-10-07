<script setup lang="ts">
import type { User } from "@/stores/app";
import { computed, ref, watch } from "vue";
import AccessibleDialog from "@/components/AccessibleDialog.vue";
import LearnerCodeReviewTools from "@/components/LearnerCodeReviewTools.vue";
import LearnerSessionTools from "@/components/LearnerSessionTools.vue";
import WorkspaceViewToggle from "@/components/WorkspaceViewToggle.vue";

const props = defineProps<{
	learners: User[];
	busy?: boolean;
	dirty?: boolean;
	canSend?: boolean;
}>();
const emit = defineEmits<{ discard: [studentId: string] }>();
const selectedId = defineModel<string>({ required: true });
const selected = computed(() =>
	props.learners.find(user => user._id === selectedId.value)
);
const mode = ref("courses");
const visited = ref(["courses"]);
const pendingId = ref<string | null>(null);
const sessions = ref<InstanceType<typeof LearnerSessionTools>>();
const projects = ref<InstanceType<typeof LearnerCodeReviewTools>>();
const busy = computed(
	() => props.busy || sessions.value?.saving || projects.value?.saving
);
const options = [
	{ value: "courses", label: "Courses" },
	{ value: "projects", label: "Projects" },
	{ value: "sessions", label: "Sessions & notes" }
];
watch(
	() => props.learners,
	learners => {
		if (!learners.some(user => user._id === selectedId.value))
			selectedId.value = learners[0]?._id ?? "";
	},
	{ immediate: true }
);
watch(selectedId, () => {
	mode.value = "courses";
	visited.value = ["courses"];
	pendingId.value = null;
});
watch(mode, value => {
	if (!visited.value.includes(value)) visited.value.push(value);
});
function labelFor(user: User) {
	return props.learners.filter(other => other.name === user.name).length > 1
		? `${user.name} · ${user._id.slice(-6)}`
		: user.name;
}
function selectLearner(event: Event) {
	const input = event.target as HTMLSelectElement;
	const nextId = input.value;
	input.value = selectedId.value;
	if (
		nextId === selectedId.value ||
		!props.learners.some(user => user._id === nextId) ||
		busy.value
	) {
		return;
	}
	if (
		props.dirty ||
		sessions.value?.hasUnsavedChanges ||
		projects.value?.hasUnsavedChanges
	) {
		pendingId.value = nextId;
		return;
	}
	selectedId.value = nextId;
}
function discardAndSwitch() {
	if (!pendingId.value || busy.value) return;
	emit("discard", selectedId.value);
	selectedId.value = pendingId.value;
}
</script>

<template>
	<section class="learner-workspace" :aria-busy="busy">
		<label class="learner-selector">
			<span class="sr-only">Select student</span>
			<select
				:value="selectedId"
				:disabled="busy || !learners.length"
				@change="selectLearner"
			>
				<option v-if="!learners.length" value="">
					No students assigned
				</option>
				<option
					v-for="learner in learners"
					:key="learner._id"
					:value="learner._id"
				>
					{{ labelFor(learner) }}
				</option>
			</select>
		</label>
		<template v-if="selected">
			<div class="learner-toolbar">
				<WorkspaceViewToggle
					v-model="mode"
					label="Student work"
					:options="options"
				/>
				<RouterLink
					v-if="canSend"
					:to="{
						path: '/admin/mdmail',
						query: { student: selected._id }
					}"
					>Write session note</RouterLink
				>
			</div>
			<div :key="selected._id" class="learner-content">
				<div v-show="mode === 'courses'">
					<slot :learner="selected" />
				</div>
				<LearnerCodeReviewTools
					v-if="visited.includes('projects')"
					v-show="mode === 'projects'"
					ref="projects"
					embedded
					:user-id="selected._id"
					:user-name="selected.name"
					:user-email="selected.email"
				/>
				<LearnerSessionTools
					v-if="visited.includes('sessions')"
					v-show="mode === 'sessions'"
					ref="sessions"
					embedded
					:user-id="selected._id"
					:user-name="selected.name"
					:user-email="selected.email"
				/>
			</div>
		</template>
		<AccessibleDialog
			dialog-id="learner-switch-confirmation"
			:open="pendingId !== null"
			title="Discard unsaved changes?"
			description="Save your changes before switching students, or discard them to continue."
			close-label="Keep editing"
			@close="pendingId = null"
		>
			<p>
				Save your changes before switching students, or discard them to
				continue.
			</p>
			<template #footer>
				<button
					class="btn-secondary btn"
					type="button"
					@click="pendingId = null"
				>
					Keep editing
				</button>
				<button
					class="btn-danger btn"
					type="button"
					:disabled="busy"
					@click="discardAndSwitch"
				>
					Discard and switch
				</button>
			</template>
		</AccessibleDialog>
	</section>
</template>

<style scoped>
.learner-workspace {
	display: grid;
	gap: 0.75rem;
	min-width: 0;
	color: var(--color-ink);
}
.learner-selector {
	max-width: 26rem;
	margin: 0;
}
.learner-selector select {
	width: 100%;
	max-width: 100%;
	padding: 0.6rem 0.8rem;
	font: inherit;
	background: var(--color-surface);
	color: var(--color-ink);
	border: 1px solid var(--color-border);
	border-radius: var(--radius-sm);
}
.learner-toolbar {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 0.5rem;
	padding-bottom: 0.5rem;
	border-bottom: 1px solid var(--color-border);
}
.learner-toolbar a {
	font-size: 0.95rem;
}
.learner-content {
	min-width: 0;
}
</style>
