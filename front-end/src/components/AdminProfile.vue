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
const { currentAdmin, tutors, users } = storeToRefs(app);
const error = ref("");
const deleteMe = useDeleteAccount("admin");
const userAssignments = ref<Record<string, string[]>>({});
const tutorCourseSelections = ref<Record<string, string[]>>({});
const editingTutors = ref<Record<string, boolean>>({});
const editingUsers = ref<Record<string, boolean>>({});
const adminActionsVisible = ref(false);

const coursesStore = useCoursesStore();
const { courses } = storeToRefs(coursesStore);

/* editable helper for the admin card */
const {
	editing: adminEdit,
	toggle: toggleAdmin,
	save: saveAdmin
} = useEditable("admin");

/* field list (admin / tutor / user share the same set) */
const fields = [
	{ key: "name", label: "Name" },
	{ key: "email", label: "Email" }
	// { key: "age", label: "Age" },
	// { key: "state", label: "State" }
];

/* fetch everything once */
async function loadAll() {
	await Promise.all([
		app.fetchTutors(),
		app.fetchUsers(),
		app.refreshCurrentAdmin()
	]);
}

onMounted(loadAll);

watch(
	users,
	value => {
		const assignments: Record<string, string[]> = {};
		for (const user of value) {
			assignments[user._id] = [...(user.tutors ?? []).map(String)];
		}
		userAssignments.value = assignments;
	},
	{ immediate: true }
);

watch(
	tutors,
	value => {
		const selections: Record<string, string[]> = {};
		for (const tutor of value)
			selections[tutor._id] = [...(tutor.coursePermissions ?? [])];
		tutorCourseSelections.value = selections;
	},
	{ immediate: true }
);

const tutorsHeader = computed(() =>
	currentAdmin.value && tutors.value.length === 0 ? "No Tutors" : "Tutors"
);

const usersHeader = computed(() =>
	currentAdmin.value && users.value.length === 0 ? "No Users" : "Users"
);

const tutorLookup = computed(() => {
	const lookup: Record<string, string> = {};
	for (const t of tutors.value) lookup[t._id] = t.name;
	return lookup;
});

function formatAssignedTutors(userID: string) {
	const assigned = userAssignments.value[userID] ?? [];
	if (assigned.length === 0) return "No tutors assigned";
	return assigned.map(id => tutorLookup.value[id] ?? "Unknown").join(", ");
}

function toggleTutorEdit(tutorID: string) {
	editingTutors.value = {
		...editingTutors.value,
		[tutorID]: !editingTutors.value[tutorID]
	};
}

function toggleUserEdit(userID: string) {
	editingUsers.value = {
		...editingUsers.value,
		[userID]: !editingUsers.value[userID]
	};
}

function onTutorCourseToggle(
	tutorID: string,
	courseID: string,
	checked: boolean
) {
	const current = new Set(tutorCourseSelections.value[tutorID] ?? []);
	if (checked) current.add(courseID);
	else current.delete(courseID);
	tutorCourseSelections.value = {
		...tutorCourseSelections.value,
		[tutorID]: [...current]
	};
}

async function saveTutorCourses(tutorID: string) {
	try {
		await api.put(`/tutors/${tutorID}/courses`, {
			courseIDs: tutorCourseSelections.value[tutorID] ?? []
		});
		error.value = "";
		await app.fetchTutors();
	} catch (e: any) {
		error.value =
			e.response?.data?.message ??
			e.message ??
			"Unable to update tutor courses";
	}
}

async function demoteTutor(tutorID: string) {
	try {
		await api.post(`/tutors/${tutorID}/demote`);
		error.value = "";
		await loadAll();
	} catch (e: any) {
		error.value =
			e.response?.data?.message ?? e.message ?? "Unable to demote tutor";
	}
}

function formatTutorCourses(tutorID: string) {
	const ids = tutorCourseSelections.value[tutorID] ?? [];
	if (!ids.length) return "No course access";
	const lookup: Record<string, string> = {};
	for (const course of courses.value ?? []) lookup[course.id] = course.name;
	return ids.map(id => lookup[id] ?? id).join(", ");
}

function onTutorSelectionChange(userID: string, event: Event) {
	const target = event.target as HTMLSelectElement;
	const selected = Array.from(target.selectedOptions).map(
		option => option.value
	);
	userAssignments.value = {
		...userAssignments.value,
		[userID]: selected
	};
}

async function saveAssignments(userID: string) {
	try {
		await api.put(`/users/${userID}/tutors`, {
			tutorIDs: userAssignments.value[userID] ?? []
		});
		await Promise.all([app.fetchUsers(), app.fetchTutors()]);
		error.value = "";
	} catch (e: any) {
		error.value =
			e.response?.data?.message ?? e.message ?? "Unable to update tutors";
	}
}

async function promoteToTutor(userID: string) {
	try {
		await api.post(`/users/${userID}/promote`);
		await Promise.all([app.fetchUsers(), app.fetchTutors()]);
		error.value = "";
	} catch (e: any) {
		error.value =
			e.response?.data?.message ?? e.message ?? "Unable to promote user";
	}
}
</script>

<template>
	<section class="Signup text-center">
		<h2>Profile</h2>

		<!-- ───── Admin card ───── -->
		<div
			v-if="currentAdmin"
			class="tutorList mt-2"
			@click="adminActionsVisible = true"
		>
			<br />
			<ul>
				<li><h4>Admin</h4></li>

				<ProfileFields
					:editing="adminEdit"
					:entity="currentAdmin"
					:fields="fields"
				/>
			</ul>
			<div v-if="adminActionsVisible" class="actionButtons">
				<button
					class="btn-danger btn"
					@click.stop="deleteMe(currentAdmin!._id)"
				>
					Delete
				</button>
				<button
					class="btn-primary btn"
					@click.stop="
						adminEdit ? saveAdmin(currentAdmin) : toggleAdmin()
					"
				>
					{{ adminEdit ? "Save" : "Edit" }}
				</button>
			</div>
			<p v-else class="actionHint">
				Click the card to manage this profile.
			</p>

			<AccountSecurity
				:current-email="currentAdmin.email"
				:entity-id="currentAdmin._id"
				role="admin"
			/>
		</div>

		<!-- ───── Tutors list (read-only) ───── -->
		<hr />
		<h2>{{ tutorsHeader }}</h2>
		<div v-for="t in tutors" :key="t._id" class="tutorList mt-2">
			<br />
			<ul>
				<ProfileFields :editing="false" :entity="t" :fields="fields" />
			</ul>
			<p class="currentAssignments">
				<strong>Course access:</strong>
				{{ formatTutorCourses(t._id) }}
			</p>
			<div class="assignmentActions">
				<button
					class="btn btn-secondary"
					type="button"
					@click="toggleTutorEdit(t._id)"
				>
					{{ editingTutors[t._id] ? "Close" : "Edit" }}
				</button>
			</div>
			<div v-if="editingTutors[t._id]" class="coursePermissions">
				<label v-for="course in courses" :key="course.id">
					<input
						:checked="
							(tutorCourseSelections[t._id] ?? []).includes(
								course.id
							)
						"
						type="checkbox"
						@change="
							onTutorCourseToggle(
								t._id,
								course.id,
								($event.target as HTMLInputElement).checked
							)
						"
					/>
					{{ course.name }}
				</label>
				<div class="assignmentActions">
					<button
						class="btn btn-primary"
						type="button"
						@click="saveTutorCourses(t._id)"
					>
						Save courses
					</button>
					<button
						class="btn btn-danger"
						type="button"
						@click="demoteTutor(t._id)"
					>
						Demote to user
					</button>
				</div>
			</div>
		</div>

		<!-- ───── Users list (read-only) ───── -->
		<hr />
		<h2>{{ usersHeader }}</h2>
		<div v-for="u in users" :key="u._id" class="tutorList mt-2">
			<br />
			<ul>
				<ProfileFields :editing="false" :entity="u" :fields="fields" />
			</ul>
			<div class="assignmentSummary">
				<p>
					<strong>Assigned tutors:</strong>
					{{ formatAssignedTutors(u._id) }}
				</p>
				<button
					class="btn btn-secondary"
					type="button"
					@click="toggleUserEdit(u._id)"
				>
					{{ editingUsers[u._id] ? "Close" : "Edit" }}
				</button>
			</div>
			<div v-if="editingUsers[u._id]" class="assignmentControls">
				<label class="assignmentLabel" :for="`tutor-select-${u._id}`">
					Assign Tutors
				</label>
				<select
					:id="`tutor-select-${u._id}`"
					:disabled="tutors.length === 0"
					multiple
					:value="userAssignments[u._id] ?? []"
					@change="onTutorSelectionChange(u._id, $event)"
				>
					<option v-for="t in tutors" :key="t._id" :value="t._id">
						{{ t.name }}
					</option>
				</select>
				<div class="assignmentActions">
					<button
						class="btn btn-primary"
						type="button"
						@click="saveAssignments(u._id)"
					>
						Save Assignments
					</button>
					<button
						class="btn btn-secondary"
						type="button"
						@click="promoteToTutor(u._id)"
					>
						Promote to Tutor
					</button>
				</div>
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
	flex-flow: column;
}

ul p {
	display: inline;
}

div.tutorList,
li {
	align-self: center;
}

.assignmentSummary {
	margin: 0.5rem auto;
	max-width: 360px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 0.5rem;
}

.assignmentSummary p {
	margin: 0;
	text-align: left;
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

@media only screen and (max-width: 960px) {
	div.tutorList {
		width: 50%;
	}
}

.assignmentControls {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	margin: 1rem auto 0;
	width: 90%;
}

.coursePermissions {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
	gap: 0.35rem;
	margin: 0.5rem auto;
	width: 90%;
	text-align: left;
}

.coursePermissions label {
	display: flex;
	align-items: center;
	gap: 0.35rem;
}

.assignmentControls select {
	min-height: 6rem;
	padding: 0.25rem;
}

.assignmentActions {
	display: flex;
	gap: 0.5rem;
	flex-wrap: wrap;
	justify-content: center;
}

.actionButtons {
	display: flex;
	gap: 0.5rem;
	justify-content: center;
	margin-top: 0.5rem;
}

.actionHint {
	margin: 0.5rem 0;
	font-size: 0.9rem;
	color: #4b5563;
}

.currentAssignments {
	margin: 0;
}

.error {
	color: red;
	margin-top: 10px;
}
</style>
