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
const { currentTutor, users } = storeToRefs(app);
const { courses } = storeToRefs(coursesStore);
const error = ref("");
const deleteMe = useDeleteAccount("tutor");
const userCourseSelections = ref<Record<string, string[]>>({});
const tutorCardActive = ref(false);
const userCardActive = ref<Record<string, boolean>>({});
const userEditActive = ref<Record<string, boolean>>({});

const {
	editing: tutorEdit,
	toggle: toggleTutor,
	save: saveTutor
} = useEditable("tutor");

const tutorFields = [
	{ key: "name", label: "Name" },
	{ key: "email", label: "Email" },
	{ key: "age", label: "Age" },
	{ key: "state", label: "State" }
];

const accessibleCourses = computed(() => {
	const ids = new Set(currentTutor.value?.courseAccess ?? []);
	return courses.value.filter(course => ids.has(course.id));
});

const hasCourseAccess = computed(() => accessibleCourses.value.length > 0);

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

watch(
	users,
	value => {
		const selections: Record<string, string[]> = {};
		for (const user of value) {
			selections[user._id] = [...(user.allowedCourses ?? [])];
		}
		userCourseSelections.value = selections;
	},
	{ immediate: true }
);

const usersHeader = computed(() =>
	currentTutor.value && users.value.length === 0 ? "No Users" : "Users"
);

function activateTutorCard() {
	tutorCardActive.value = true;
}

function activateUserCard(id: string) {
	userCardActive.value = { ...userCardActive.value, [id]: true };
}

function toggleUserEditor(id: string) {
	userEditActive.value = {
		...userEditActive.value,
		[id]: !userEditActive.value[id]
	};
}

function toggleUserCourse(userID: string, courseID: string, checked: boolean) {
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
		await api.put(`/users/${userID}/courses`, {
			courseIDs: userCourseSelections.value[userID] ?? []
		});
		await loadUsers();
		error.value = "";
	} catch (e: any) {
		error.value =
			e.response?.data?.message ??
			e.message ??
			"Unable to update courses";
	}
}
</script>

<template>
	<section class="Signup text-center">
		<h2>Profile</h2>

		<div
			v-if="currentTutor"
			class="tutorList mt-2 clickable-card"
			@click="activateTutorCard"
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
			<br />

			<div v-if="tutorCardActive" class="card-actions">
				<button
					class="btn-danger btn"
					type="button"
					@click.stop="deleteMe(currentTutor!._id)"
				>
					Delete
				</button>
				<button
					class="btn-primary btn"
					type="button"
					@click.stop="
						tutorEdit ? saveTutor(currentTutor) : toggleTutor()
					"
				>
					{{ tutorEdit ? "Save" : "Edit" }}
				</button>
			</div>

			<SecuritySettings
				v-if="tutorCardActive"
				:email="currentTutor.email"
				:entity-id="currentTutor._id"
				role="tutor"
			/>
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
				<ProfileFields
					:editing="false"
					:entity="u"
					:fields="tutorFields"
				/>
			</ul>

			<div v-if="userCardActive[u._id]" class="card-actions">
				<button
					class="btn btn-secondary"
					type="button"
					@click.stop="toggleUserEditor(u._id)"
				>
					{{ userEditActive[u._id] ? "Done" : "Manage Courses" }}
				</button>
			</div>

			<div
				v-if="userEditActive[u._id]"
				class="assignmentControls"
				@click.stop
			>
				<p class="assignmentLabel">Courses this student may view:</p>
				<p v-if="!hasCourseAccess" class="no-access">
					The admin has not granted you access to any courses yet.
				</p>
				<div v-else class="course-checkboxes">
					<label
						v-for="course in accessibleCourses"
						:key="course.id"
						class="checkbox-row"
					>
						<input
							:checked="
								(userCourseSelections[u._id] ?? []).includes(
									course.id
								)
							"
							type="checkbox"
							@change="
								toggleUserCourse(
									u._id,
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
						:disabled="!hasCourseAccess"
						@click="saveUserCourses(u._id)"
					>
						Save Allowed Courses
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
	flex-direction: column;
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

.assignmentControls {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	margin: 1rem auto 0;
	width: 90%;
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

.no-access {
	margin: 0;
	font-style: italic;
}

.error {
	color: red;
	margin-top: 10px;
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
</style>
