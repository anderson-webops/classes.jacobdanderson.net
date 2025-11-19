<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { api } from "@/api";
import AccountSecurity from "@/components/AccountSecurity.vue";
import ProfileFields from "@/components/ProfileFields.vue";
import { useDeleteAccount } from "@/composables/useDeleteAccount";
import { useEditable } from "@/composables/useEditable";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

/* -------------------------------------------------- */
const app = useAppStore();
const { currentTutor, users } = storeToRefs(app);
const error = ref("");
const deleteMe = useDeleteAccount("tutor");
const tutorActionsVisible = ref(false);
const editingUsers = ref<Record<string, boolean>>({});
const userCourseSelections = ref<Record<string, string[]>>({});
const savingUser = ref<string | null>(null);

const coursesStore = useCoursesStore();
const { courses } = storeToRefs(coursesStore);

/* editable (the tutor card itself) */
const {
	editing: tutorEdit,
	toggle: toggleTutor,
	save: saveTutor
} = useEditable("tutor");

/* field list */
const tutorFields = [
	{ key: "name", label: "Name" },
	{ key: "email", label: "Email" },
	{ key: "age", label: "Age" },
	{ key: "state", label: "State" }
];

/* load this tutor’s users once */
async function loadUsers() {
	if (!currentTutor.value) return;
	try {
		const { data } = await api.get(
			`/users/oftutor/${currentTutor.value._id}`
		);
		app.setUsers(data);
	} catch (e: any) {
		error.value = e.message;
	}
}

onMounted(loadUsers);

const usersHeader = computed(() =>
	currentTutor.value && users.value.length === 0 ? "No Users" : "Users"
);

watch(
	users,
	value => {
		const selections: Record<string, string[]> = {};
		for (const user of value)
			selections[user._id] = [...(user.allowedCourses ?? [])];
		userCourseSelections.value = selections;
	},
	{ immediate: true }
);

const tutorCourseOptions = computed(() => {
	const allowed = new Set(currentTutor.value?.coursePermissions ?? []);
	return (courses.value ?? []).filter(course => allowed.has(course.id));
});

const tutorCourseSummary = computed(() => {
	if (!currentTutor.value || !currentTutor.value.coursePermissions?.length)
		return "No course access granted";
	return tutorCourseOptions.value.length
		? tutorCourseOptions.value.map(course => course.name).join(", ")
		: "No course access granted";
});

function toggleUserEdit(userID: string) {
	editingUsers.value = {
		...editingUsers.value,
		[userID]: !editingUsers.value[userID]
	};
}

function onCourseToggle(userID: string, courseID: string, checked: boolean) {
	const current = new Set(userCourseSelections.value[userID] ?? []);
	if (checked) current.add(courseID);
	else current.delete(courseID);
	userCourseSelections.value = {
		...userCourseSelections.value,
		[userID]: [...current]
	};
}

async function saveUserCourses(userID: string) {
	try {
		savingUser.value = userID;
		await api.put(`/users/${userID}/courses`, {
			courseIDs: userCourseSelections.value[userID] ?? []
		});
		error.value = "";
		await loadUsers();
	} catch (e: any) {
		error.value =
			e.response?.data?.message ??
			e.message ??
			"Unable to update courses";
	} finally {
		savingUser.value = null;
	}
}

const hasCoursePermissions = computed(
	() => tutorCourseOptions.value.length > 0
);

function formatUserCourses(userId: string) {
	const ids = userCourseSelections.value[userId] ?? [];
	if (!ids.length) return "No courses assigned";
	return ids
		.map(
			id =>
				tutorCourseOptions.value.find(course => course.id === id)
					?.name ?? id
		)
		.join(", ");
}
</script>

<template>
	<section class="Signup text-center">
		<h2>Profile</h2>

		<!-- ───── Tutor card ───── -->
		<div
			v-if="currentTutor"
			class="tutorList mt-2"
			@click="tutorActionsVisible = true"
		>
			<br />
			<ul>
				<li><h4>Tutor</h4></li>

				<ProfileFields
					:editing="tutorEdit"
					:entity="currentTutor"
					:fields="tutorFields"
				/>
			</ul>
			<div class="assignmentSummary">
				<p>
					<strong>Course access:</strong>
					{{ tutorCourseSummary }}
				</p>
			</div>

			<div v-if="tutorActionsVisible" class="actionButtons">
				<button
					class="btn-danger btn"
					@click.stop="deleteMe(currentTutor!._id)"
				>
					Delete
				</button>
				<button
					class="btn-primary btn"
					@click.stop="
						tutorEdit ? saveTutor(currentTutor) : toggleTutor()
					"
				>
					{{ tutorEdit ? "Save" : "Edit" }}
				</button>
			</div>
			<p v-else class="actionHint">
				Click the card to manage your profile.
			</p>

			<AccountSecurity
				:current-email="currentTutor.email"
				:entity-id="currentTutor._id"
				role="tutor"
			/>
		</div>

		<!-- ───── Users under this tutor (read-only) ───── -->
		<hr />
		<h2>{{ usersHeader }}</h2>

		<div v-for="u in users" :key="u._id" class="tutorList mt-2">
			<br />
			<ul>
				<!-- Fields: name / email / age / state -->
				<!-- Editing = false: read-only list -->
				<ProfileFields
					:editing="false"
					:entity="u"
					:fields="tutorFields"
				/>
			</ul>
			<div class="user-course-summary">
				<p>
					<strong>Course access:</strong>
					{{ formatUserCourses(u._id) }}
				</p>
				<button
					class="btn btn-secondary"
					type="button"
					@click="toggleUserEdit(u._id)"
				>
					{{ editingUsers[u._id] ? "Close" : "Edit" }}
				</button>
			</div>
			<div v-if="editingUsers[u._id]" class="course-editor">
				<p v-if="!hasCoursePermissions" class="actionHint">
					The admin has not shared any courses with you yet.
				</p>
				<div v-else class="course-checkboxes">
					<label
						v-for="course in tutorCourseOptions"
						:key="course.id"
					>
						<input
							:checked="
								(userCourseSelections[u._id] ?? []).includes(
									course.id
								)
							"
							type="checkbox"
							@change="
								onCourseToggle(
									u._id,
									course.id,
									($event.target as HTMLInputElement).checked
								)
							"
						/>
						{{ course.name }}
					</label>
				</div>
				<button
					class="btn btn-primary"
					:disabled="savingUser === u._id"
					type="button"
					@click="saveUserCourses(u._id)"
				>
					{{ savingUser === u._id ? "Saving..." : "Save courses" }}
				</button>
			</div>
		</div>

		<p v-if="error" class="error">
			{{ error }}
		</p>
	</section>
</template>

<style scoped>
ul {
	list-style-type: none;
	display: flex;
	flex-direction: column;
}

ul p {
	display: inline;
}

div.tutorList,
li {
	align-self: center;
}

.assignmentSummary {
	margin: 1rem auto;
	max-width: 360px;
	text-align: left;
}

.assignmentSummary p {
	margin: 0;
}

.actionButtons {
	display: flex;
	gap: 0.5rem;
	justify-content: center;
	margin-top: 0.5rem;
}

.actionHint {
	margin: 0.5rem 0;
	color: #4b5563;
	font-size: 0.9rem;
}

.hidden {
	display: none;
}

div.tutorList {
	outline: black solid 1px;
	padding-bottom: 1%;
	width: 35%;
	margin: auto;
}

@media (max-width: 960px) {
	div.tutorList {
		width: 50%;
	}
}

.error {
	color: red;
	margin-top: 10px;
}

.user-course-summary {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 0.5rem;
	margin: 0.5rem auto;
	max-width: 360px;
}

.user-course-summary p {
	margin: 0;
	text-align: left;
}

.course-editor {
	margin: 0.5rem auto;
	max-width: 360px;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.course-checkboxes {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
	gap: 0.35rem;
	text-align: left;
}

.course-checkboxes label {
	display: flex;
	align-items: center;
	gap: 0.35rem;
}
</style>
