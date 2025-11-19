<script lang="ts" setup>
import type { Tutor } from "@/stores/app";
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
const { currentTutor, users } = storeToRefs(app);
const error = ref("");
const deleteMe = useDeleteAccount("tutor");
const coursesStore = useCoursesStore();
const { courses } = storeToRefs(coursesStore);
const courseLookup = computed(() => {
	const lookup: Record<string, string> = {};
	for (const course of courses.value) lookup[course.id] = course.name;
	return lookup;
});
const allowedCourseOptions = computed(() => {
	const allowed = new Set(currentTutor.value?.courses ?? []);
	return courses.value.filter(course => allowed.has(course.id));
});
const userCourseAssignments = ref<Record<string, string[]>>({});
const tutorDraft = ref<Tutor | null>(null);
const passwordForm = reactive({ newPassword: "", confirmPassword: "" });
const passwordError = ref("");
const controlsVisible = ref(false);

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

watch(
	[tutorEdit, currentTutor],
	([isEditing, tutor]) => {
		if (isEditing && tutor) {
			tutorDraft.value = JSON.parse(JSON.stringify(tutor)) as Tutor;
		}
		if (!isEditing) {
			tutorDraft.value = null;
			passwordForm.newPassword = "";
			passwordForm.confirmPassword = "";
			passwordError.value = "";
		}
	},
	{ immediate: true }
);

watch(
	users,
	value => {
		const assignments: Record<string, string[]> = {};
		for (const user of value)
			assignments[user._id] = [...(user.courses ?? [])];
		userCourseAssignments.value = assignments;
	},
	{ immediate: true }
);

const usersHeader = computed(() =>
	currentTutor.value && users.value.length === 0 ? "No Users" : "Users"
);

function updateTutorField(key: string, value: Displayable) {
	if (!tutorDraft.value) return;
	tutorDraft.value = { ...tutorDraft.value, [key]: value } as Tutor;
}

function formatCourseList(ids?: string[]) {
	if (!ids || ids.length === 0) return "No courses assigned";
	return ids.map(id => courseLookup.value[id] ?? id).join(", ");
}

async function saveTutorProfile() {
	if (!tutorDraft.value) return;
	const payload: any = { ...tutorDraft.value };
	if (passwordForm.newPassword || passwordForm.confirmPassword) {
		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			passwordError.value = "Passwords do not match.";
			return;
		}
		passwordError.value = "";
		payload.password = passwordForm.newPassword;
	}

	try {
		await saveTutor(payload);
		error.value = "";
	} catch (e: any) {
		error.value =
			e.response?.data?.message ?? e.message ?? "Unable to save tutor";
	} finally {
		passwordForm.newPassword = "";
		passwordForm.confirmPassword = "";
	}
}

async function saveUserCourses(userID: string) {
	try {
		await api.put(`/users/${userID}/courses`, {
			courseIDs: userCourseAssignments.value[userID] ?? []
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

function revealControls() {
	controlsVisible.value = true;
}
</script>

<template>
	<section class="Signup text-center">
		<h2>Profile</h2>

		<!-- ───── Tutor card ───── -->
		<div v-if="currentTutor" class="tutorList mt-2" @click="revealControls">
			<br />
			<ul>
				<li><h4>Tutor</h4></li>

				<ProfileFields
					:editing="tutorEdit"
					:entity="
						tutorEdit && tutorDraft ? tutorDraft : currentTutor
					"
					:fields="tutorFields"
					@update="updateTutorField"
				/>
			</ul>
			<p class="currentAssignments">
				<strong>Courses enabled:</strong>
				{{ formatCourseList(currentTutor.courses) }}
			</p>
			<div v-if="tutorEdit" class="passwordFields">
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
			<div v-if="controlsVisible" class="cardActions">
				<button
					class="btn-danger btn"
					@click.stop="deleteMe(currentTutor!._id)"
				>
					Delete
				</button>
				<button
					class="btn-primary btn"
					@click.stop="tutorEdit ? saveTutorProfile() : toggleTutor()"
				>
					{{ tutorEdit ? "Save" : "Edit" }}
				</button>
			</div>
			<p v-else class="helperText">
				Click the card to manage your profile.
			</p>
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
			<div class="courseControls">
				<p>
					<strong>Courses assigned:</strong>
					{{ formatCourseList(u.courses) }}
				</p>
				<template v-if="allowedCourseOptions.length">
					<p class="helperText">
						Select from the courses your admin has enabled.
					</p>
					<div class="courseGrid">
						<label
							v-for="course in allowedCourseOptions"
							:key="course.id"
						>
							<input
								v-model="userCourseAssignments[u._id]"
								:value="course.id"
								type="checkbox"
							/>
							{{ course.name }}
						</label>
					</div>
					<button
						class="btn btn-primary"
						type="button"
						@click="saveUserCourses(u._id)"
					>
						Save Course Access
					</button>
				</template>
				<p v-else class="helperText">
					The admin has not enabled any courses for you yet.
				</p>
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

.passwordFields {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	margin: 0.5rem auto 1rem;
	width: 85%;
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

.cardActions {
	display: flex;
	gap: 0.5rem;
	justify-content: center;
	flex-wrap: wrap;
}

.helperText {
	margin-top: 0.5rem;
	color: #4b5563;
}

.courseControls {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	margin: 0.5rem auto 1rem;
	width: 85%;
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
</style>
