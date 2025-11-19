<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { api } from "@/api";
import ProfileFields from "@/components/ProfileFields.vue";
import SecuritySettings from "@/components/SecuritySettings.vue";
import { useDeleteAccount } from "@/composables/useDeleteAccount";
import { useEditable } from "@/composables/useEditable";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const app = useAppStore();
const coursesStore = useCoursesStore();
const { currentAdmin, tutors, users } = storeToRefs(app);
const { courses } = storeToRefs(coursesStore);

const error = ref("");
const deleteMe = useDeleteAccount("admin");
const userAssignments = ref<Record<string, string[]>>({});
const tutorCourseSelections = ref<Record<string, string[]>>({});
const adminCardActive = ref(false);
const tutorCardActive = ref<Record<string, boolean>>({});
const tutorEditActive = ref<Record<string, boolean>>({});
const userCardActive = ref<Record<string, boolean>>({});
const userEditActive = ref<Record<string, boolean>>({});

const {
	editing: adminEdit,
	toggle: toggleAdmin,
	save: saveAdmin
} = useEditable("admin");

const fields = [
	{ key: "name", label: "Name" },
	{ key: "email", label: "Email" }
];

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
			const ids = (user.tutors ?? []).map(t =>
				typeof t === "string" ? t : t._id
			);
			assignments[user._id] = ids;
		}
		userAssignments.value = assignments;
	},
	{ immediate: true }
);

watch(
	tutors,
	value => {
		const selections: Record<string, string[]> = {};
		for (const tutor of value) {
			selections[tutor._id] = [...(tutor.courseAccess ?? [])];
		}
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
const courseOptions = computed(() =>
	courses.value.map(course => ({ id: course.id, name: course.name }))
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

function formatCourseAccess(tutorID: string) {
	const selected = tutorCourseSelections.value[tutorID] ?? [];
	if (selected.length === 0) return "No course access yet";
	return selected
		.map(
			id =>
				courseOptions.value.find(course => course.id === id)?.name ?? id
		)
		.join(", ");
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

function toggleTutorCourse(
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
			courseIDs: tutorCourseSelections.value[tutorID] ?? []
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

function activateAdminCard() {
	adminCardActive.value = true;
}

function activateTutorCard(id: string) {
	tutorCardActive.value = { ...tutorCardActive.value, [id]: true };
}

function activateUserCard(id: string) {
	userCardActive.value = { ...userCardActive.value, [id]: true };
}

function toggleTutorEditor(id: string) {
	tutorEditActive.value = {
		...tutorEditActive.value,
		[id]: !tutorEditActive.value[id]
	};
}

function toggleUserEditor(id: string) {
	userEditActive.value = {
		...userEditActive.value,
		[id]: !userEditActive.value[id]
	};
}
</script>

<template>
	<section class="Signup text-center">
		<h2>Profile</h2>

		<div
			v-if="currentAdmin"
			class="tutorList mt-2 clickable-card"
			@click="activateAdminCard"
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
			<br />

			<div v-if="adminCardActive" class="card-actions">
				<button
					class="btn-danger btn"
					type="button"
					@click.stop="deleteMe(currentAdmin!._id)"
				>
					Delete
				</button>
				<button
					class="btn-primary btn"
					type="button"
					@click.stop="
						adminEdit ? saveAdmin(currentAdmin) : toggleAdmin()
					"
				>
					{{ adminEdit ? "Save" : "Edit" }}
				</button>
			</div>

			<SecuritySettings
				v-if="adminCardActive"
				:email="currentAdmin.email"
				:entity-id="currentAdmin._id"
				role="admin"
			/>
		</div>

		<hr />
		<h2>{{ tutorsHeader }}</h2>
		<div
			v-for="t in tutors"
			:key="t._id"
			class="tutorList mt-2 clickable-card"
			@click="activateTutorCard(t._id)"
		>
			<br />
			<ul>
				<ProfileFields :editing="false" :entity="t" :fields="fields" />
			</ul>
			<p class="course-summary">
				<strong>Course access:</strong>
				{{ formatCourseAccess(t._id) }}
			</p>

			<div v-if="tutorCardActive[t._id]" class="card-actions">
				<button
					class="btn btn-secondary"
					type="button"
					@click.stop="toggleTutorEditor(t._id)"
				>
					{{ tutorEditActive[t._id] ? "Done" : "Edit Access" }}
				</button>
			</div>

			<div
				v-if="tutorEditActive[t._id]"
				class="course-controls"
				@click.stop
			>
				<p class="assignmentLabel">
					Choose the courses this tutor may view:
				</p>
				<div class="course-checkboxes">
					<label
						v-for="course in courseOptions"
						:key="course.id"
						class="checkbox-row"
					>
						<input
							:checked="
								(tutorCourseSelections[t._id] ?? []).includes(
									course.id
								)
							"
							type="checkbox"
							@change="
								toggleTutorCourse(
									t._id,
									course.id,
									($event.target as HTMLInputElement).checked
								)
							"
						/>
						<span>{{ course.name }}</span>
					</label>
				</div>
				<div class="assignmentActions">
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
		</div>

		<hr />
		<h2>{{ usersHeader }}</h2>
		<div
			v-for="u in users"
			:key="u._id"
			class="tutorList mt-2 clickable-card"
			@click="activateUserCard(u._id)"
		>
			<br />
			<ul>
				<ProfileFields :editing="false" :entity="u" :fields="fields" />
			</ul>
			<p class="currentAssignments">
				<strong>Current:</strong>
				{{ formatAssignedTutors(u._id) }}
			</p>

			<div v-if="userCardActive[u._id]" class="card-actions">
				<button
					class="btn btn-secondary"
					type="button"
					@click.stop="toggleUserEditor(u._id)"
				>
					{{ userEditActive[u._id] ? "Done" : "Edit Assignments" }}
				</button>
			</div>

			<div
				v-if="userEditActive[u._id]"
				class="assignmentControls"
				@click.stop
			>
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

.clickable-card {
	cursor: pointer;
}

.card-actions {
	display: flex;
	gap: 0.5rem;
	justify-content: center;
	flex-wrap: wrap;
	margin-bottom: 0.5rem;
}

.course-summary,
.currentAssignments {
	margin: 0.5rem auto;
	width: 90%;
	text-align: left;
}

.assignmentControls,
.course-controls {
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

.assignmentLabel {
	font-weight: 600;
	text-align: left;
}

.assignmentActions {
	display: flex;
	gap: 0.5rem;
	flex-wrap: wrap;
	justify-content: center;
}

.course-checkboxes {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 0.5rem;
}

.checkbox-row {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	text-align: left;
}

.error {
	color: red;
	margin-top: 10px;
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
</style>
