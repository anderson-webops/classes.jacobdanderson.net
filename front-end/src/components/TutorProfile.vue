<script lang="ts" setup>
import type { User } from "@/stores/app";
import { storeToRefs } from "pinia";
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { api } from "@/api";
import CourseAccessCodeManager from "@/components/CourseAccessCodeManager.vue";
import LearnerCourseAccess from "@/components/LearnerCourseAccess.vue";
import LearnerWorkspace from "@/components/LearnerWorkspace.vue";
import SelfAccountSettings from "@/components/SelfAccountSettings.vue";
import { useCourseAccessDrafts } from "@/composables/useCourseAccessDrafts";
import { cleanCourseStatusMap } from "@/modules/courseAccess";
import { fetchManagedLearners } from "@/modules/managedLearners";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const props = defineProps<{ mode?: "account" | "teaching" }>();
const app = useAppStore();
const { currentTutor } = storeToRefs(app);
const users = ref<User[]>([]);
const loading = ref(false);
const saving = ref(false);
const error = ref("");
const success = ref("");
const selectedLearnerId = ref("");
const editingId = ref("");
const isTeachingMode = computed(() => props.mode === "teaching");
const coursesStore = useCoursesStore();
const permittedCourses = computed(() => {
	const allowed = new Set(currentTutor.value?.coursePermissions ?? []);
	return coursesStore.courses.filter(course => allowed.has(course.id));
});
const { selections, statuses, reset, toggle, setStatus } =
	useCourseAccessDrafts(users);
let loadRun = 0;
let loadController: AbortController | null = null;
async function loadUsers() {
	const tutorId = currentTutor.value?._id;
	const run = ++loadRun;
	loadController?.abort();
	users.value = [];
	loading.value = false;
	if (!isTeachingMode.value || !tutorId) return;
	const controller = new AbortController();
	loadController = controller;
	loading.value = true;
	error.value = "";
	try {
		const data = await fetchManagedLearners(
			{ role: "tutor", tutorId },
			controller.signal
		);
		if (run === loadRun && currentTutor.value?._id === tutorId)
			users.value = data;
	} catch {
		if (run === loadRun && !controller.signal.aborted)
			error.value = "Unable to load your students. Try again.";
	} finally {
		if (run === loadRun) loading.value = false;
	}
}
watch(
	() => [props.mode, currentTutor.value?._id],
	() => {
		editingId.value = "";
		success.value = "";
		void loadUsers();
	},
	{ immediate: true }
);
onBeforeUnmount(() => {
	++loadRun;
	loadController?.abort();
});
function cancelEdit(userId: string) {
	reset(userId);
	editingId.value = "";
	success.value = error.value = "";
}
async function saveCourses(userId: string) {
	if (saving.value || !users.value.some(user => user._id === userId)) return;
	const tutorId = currentTutor.value?._id;
	saving.value = true;
	error.value = success.value = "";
	try {
		const selection = selections.value[userId] ?? [];
		await api.put(`/users/${userId}/courses`, {
			courseIDs: selection,
			courseStatus: cleanCourseStatusMap(
				selection,
				statuses.value[userId]
			)
		});
		if (currentTutor.value?._id !== tutorId) return;
		editingId.value = "";
		await loadUsers();
		selectedLearnerId.value = userId;
		success.value = "Saved course access.";
	} catch {
		if (currentTutor.value?._id === tutorId) {
			error.value =
				"Unable to save course access. Your changes are still here.";
		}
	} finally {
		saving.value = false;
	}
}
</script>

<template>
	<section class="tutor-workspace">
		<SelfAccountSettings
			v-if="currentTutor && !isTeachingMode"
			:entity="currentTutor"
			role="tutor"
		/>
		<template v-if="currentTutor && isTeachingMode">
			<p v-if="loading" role="status">Loading students…</p>
			<LearnerWorkspace
				v-model="selectedLearnerId"
				:learners="users"
				:busy="loading || saving"
				:dirty="!!editingId"
				@discard="cancelEdit"
			>
				<template #default="{ learner }">
					<div class="course-toolbar">
						<button
							class="btn-secondary btn"
							type="button"
							:disabled="saving"
							@click="
								editingId === learner._id
									? cancelEdit(learner._id)
									: (editingId = learner._id)
							"
						>
							{{
								editingId === learner._id
									? "Cancel edits"
									: "Edit course access"
							}}
						</button>
					</div>
					<LearnerCourseAccess
						:courses="permittedCourses"
						:student-id="learner._id"
						:student-name="learner.name"
						:selected="selections[learner._id] ?? []"
						:statuses="statuses[learner._id] ?? {}"
						:editable="editingId === learner._id"
						@toggle="
							(courseId, checked) =>
								toggle(learner._id, courseId, checked)
						"
						@status="
							(courseId, value) =>
								setStatus(learner._id, courseId, value)
						"
					/>
					<button
						v-if="editingId === learner._id"
						class="btn-primary btn"
						type="button"
						:disabled="saving"
						@click="saveCourses(learner._id)"
					>
						{{ saving ? "Saving…" : "Save courses" }}
					</button>
				</template>
			</LearnerWorkspace>
			<details class="classroom-tools">
				<summary>Classroom codes</summary>
				<CourseAccessCodeManager :courses="permittedCourses" />
			</details>
		</template>
		<p v-if="success" role="status">{{ success }}</p>
		<p v-if="error" role="alert">
			{{ error }}
			<button
				v-if="isTeachingMode && !users.length"
				type="button"
				@click="loadUsers"
			>
				Retry
			</button>
		</p>
	</section>
</template>

<style scoped>
.tutor-workspace {
	display: grid;
	gap: 1rem;
	min-width: 0;
	color: var(--color-ink);
}
.course-toolbar {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: end;
	gap: 0.5rem;
	margin-bottom: 1rem;
}
.course-toolbar .btn {
	padding: 0.4rem 0.7rem;
	font: inherit;
	background: var(--color-surface);
	border: 1px solid var(--color-border);
	color: var(--color-ink);
}
.classroom-tools {
	border-top: 1px solid var(--color-border);
	padding-top: 0.75rem;
}
.classroom-tools summary {
	font-size: 0.95rem;
	cursor: pointer;
}
</style>
