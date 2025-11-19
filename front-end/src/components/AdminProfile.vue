<script lang="ts" setup>
import type { Admin } from "@/stores/app";
import { storeToRefs } from "pinia";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { api } from "@/api";
import ProfileFields from "@/components/ProfileFields.vue";
import { useDeleteAccount } from "@/composables/useDeleteAccount";
import { useEditable } from "@/composables/useEditable";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

type Displayable = string | number | boolean | null | undefined;

/* -------------------------------------------------- */
const app = useAppStore();
const { currentAdmin, tutors, users } = storeToRefs(app);
const error = ref("");
const deleteMe = useDeleteAccount("admin");
const userAssignments = ref<Record<string, string[]>>({});
const tutorCourseAssignments = ref<Record<string, string[]>>({});
const adminDraft = ref<Admin | null>(null);
const passwordForm = reactive({ newPassword: "", confirmPassword: "" });
const passwordError = ref("");

const coursesStore = useCoursesStore();
const { courses: courseDefinitions } = storeToRefs(coursesStore);
const courseOptions = computed(() =>
	courseDefinitions.value.map(course => ({
		id: course.id,
		name: course.name
	}))
);
const courseLookup = computed(() => {
	const lookup: Record<string, string> = {};
	for (const course of courseOptions.value) lookup[course.id] = course.name;
	return lookup;
});

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
	[adminEdit, currentAdmin],
	([editing, admin]) => {
		if (editing && admin) {
			adminDraft.value = JSON.parse(JSON.stringify(admin)) as Admin;
		}
		if (!editing) {
			adminDraft.value = null;
			passwordForm.newPassword = "";
			passwordForm.confirmPassword = "";
			passwordError.value = "";
		}
	},
	{ immediate: true }
);

watch(
	tutors,
	value => {
		const assignments: Record<string, string[]> = {};
		for (const tutor of value)
			assignments[tutor._id] = [...(tutor.courses ?? [])];
		tutorCourseAssignments.value = assignments;
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

function formatCourseList(courseIDs?: string[]) {
	if (!courseIDs || courseIDs.length === 0) return "No courses assigned";
	return courseIDs.map(id => courseLookup.value[id] ?? id).join(", ");
}

function updateAdminField(key: string, value: Displayable) {
	if (!adminDraft.value) return;
	adminDraft.value = { ...adminDraft.value, [key]: value } as Admin;
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

async function saveTutorCourses(tutorID: string) {
	try {
		await api.put(`/tutors/${tutorID}/courses`, {
			courseIDs: tutorCourseAssignments.value[tutorID] ?? []
		});
		await app.fetchTutors();
		error.value = "";
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
		await Promise.all([app.fetchTutors(), app.fetchUsers()]);
		error.value = "";
	} catch (e: any) {
		error.value =
			e.response?.data?.message ?? e.message ?? "Unable to demote tutor";
	}
}

async function saveAdminProfile() {
	if (!adminDraft.value) return;
	const payload: any = { ...adminDraft.value };
	if (passwordForm.newPassword || passwordForm.confirmPassword) {
		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			passwordError.value = "Passwords do not match.";
			return;
		}
		passwordError.value = "";
		payload.password = passwordForm.newPassword;
	}

	try {
		const updated = await saveAdmin(payload);
		if (updated) adminDraft.value = updated as Admin;
		error.value = "";
	} catch (e: any) {
		error.value =
			e.response?.data?.message ??
			e.message ??
			"Unable to save admin profile";
	} finally {
		passwordForm.newPassword = "";
		passwordForm.confirmPassword = "";
	}
}
</script>

<template>
	<section class="Signup text-center">
		<h2>Profile</h2>

		<!-- ───── Admin card ───── -->
		<div v-if="currentAdmin" class="tutorList mt-2">
			<br />
			<ul>
				<li><h4>Admin</h4></li>

				<ProfileFields
					:editing="adminEdit"
					:entity="
						adminEdit && adminDraft ? adminDraft : currentAdmin
					"
					:fields="fields"
					@update="updateAdminField"
				/>
			</ul>
			<div v-if="adminEdit" class="passwordFields">
				<label>
					New password
					<input
						v-model="passwordForm.newPassword"
						placeholder="Leave blank to keep current password"
						type="password"
					/>
				</label>
				<label>
					Confirm password
					<input
						v-model="passwordForm.confirmPassword"
						type="password"
					/>
				</label>
				<p v-if="passwordError" class="error">{{ passwordError }}</p>
			</div>
			<button class="btn-danger btn" @click="deleteMe(currentAdmin!._id)">
				Delete
			</button>
			<button
				class="btn-primary btn"
				@click="adminEdit ? saveAdminProfile() : toggleAdmin()"
			>
				{{ adminEdit ? "Save" : "Edit" }}
			</button>
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
				<strong>Courses enabled:</strong>
				{{ formatCourseList(t.courses) }}
			</p>
			<div v-if="adminEdit" class="courseAccess">
				<p class="helperText">
					Select which courses this tutor can access.
				</p>
				<div class="courseGrid">
					<label v-for="course in courseOptions" :key="course.id">
						<input
							v-model="tutorCourseAssignments[t._id]"
							:value="course.id"
							type="checkbox"
						/>
						{{ course.name }}
					</label>
				</div>
				<div class="courseActions">
					<button
						class="btn btn-primary"
						type="button"
						@click="saveTutorCourses(t._id)"
					>
						Save Course Access
					</button>
					<button
						class="btn btn-danger"
						type="button"
						@click="demoteTutor(t._id)"
					>
						Demote to User
					</button>
				</div>
			</div>
			<p v-else class="helperText">Press Edit to manage tutor access.</p>
		</div>

		<!-- ───── Users list (read-only) ───── -->
		<hr />
		<h2>{{ usersHeader }}</h2>
		<div v-for="u in users" :key="u._id" class="tutorList mt-2">
			<br />
			<ul>
				<ProfileFields :editing="false" :entity="u" :fields="fields" />
			</ul>
			<p class="currentAssignments">
				<strong>Current tutors:</strong>
				{{ formatAssignedTutors(u._id) }}
			</p>
			<div v-if="adminEdit" class="assignmentControls">
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
			<p v-else class="helperText">
				Press Edit to manage tutor assignments.
			</p>
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

.currentAssignments {
	margin: 0;
}

.error {
	color: red;
	margin-top: 10px;
}

.passwordFields {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	margin: 0 auto 1rem;
	width: 90%;
}

.passwordFields label {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	text-align: left;
}

.passwordFields input {
	padding: 0.35rem;
}

.helperText {
	margin: 0.5rem auto 0;
	color: #4b5563;
	font-size: 0.9rem;
	text-align: center;
}

.courseAccess {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	margin: 0.5rem auto 1rem;
	width: 90%;
}

.courseGrid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	gap: 0.5rem;
}

.courseGrid label {
	display: flex;
	align-items: center;
	gap: 0.35rem;
	font-size: 0.9rem;
}

.courseActions {
	display: flex;
	gap: 0.5rem;
	flex-wrap: wrap;
	justify-content: center;
}
</style>
