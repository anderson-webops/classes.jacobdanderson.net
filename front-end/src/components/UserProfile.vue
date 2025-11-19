<script lang="ts" setup>
import type { User } from "@/stores/app";
import { storeToRefs } from "pinia";
import { computed, onMounted, reactive, ref, watch } from "vue";
import ProfileFields from "@/components/ProfileFields.vue";
import { useDeleteAccount } from "@/composables/useDeleteAccount";
import { useEditable } from "@/composables/useEditable";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

type Displayable = string | number | boolean | null | undefined;

/* -------------------------------------------------- */
/*  Pinia state                                       */
/* -------------------------------------------------- */
const app = useAppStore();
const { currentUser, tutors } = storeToRefs(app);
const deleteMe = useDeleteAccount("user");
const coursesStore = useCoursesStore();
const { courses } = storeToRefs(coursesStore);
const courseLookup = computed(() => {
	const lookup: Record<string, string> = {};
	for (const course of courses.value) lookup[course.id] = course.name;
	return lookup;
});
const assignedTutorNames = computed(() => {
	const assigned = currentUser.value?.tutors ?? [];
	if (assigned.length === 0) return [] as string[];
	const map: Record<string, string> = {};
	for (const tutor of tutors.value) map[tutor._id] = tutor.name;
	return assigned.map(id => map[id] ?? "Unknown");
});
const controlsVisible = ref(false);
const userDraft = ref<User | null>(null);
const passwordForm = reactive({ newPassword: "", confirmPassword: "" });
const passwordError = ref("");
const error = ref("");

/* -------------------------------------------------- */
/*  editable helper                                   */
/* -------------------------------------------------- */
const { editing, toggle, save } = useEditable("user");

watch(
	[editing, currentUser],
	([isEditing, user]) => {
		if (isEditing && user) {
			userDraft.value = JSON.parse(JSON.stringify(user)) as User;
		}
		if (!isEditing) {
			userDraft.value = null;
			passwordForm.newPassword = "";
			passwordForm.confirmPassword = "";
			passwordError.value = "";
		}
	},
	{ immediate: true }
);

onMounted(() => {
	if (app.tutors.length === 0) app.fetchTutors();
});

function updateUserField(key: string, value: Displayable) {
	if (!userDraft.value) return;
	userDraft.value = { ...userDraft.value, [key]: value } as User;
}

function formatCourseList(ids?: string[]) {
	if (!ids || ids.length === 0) return "No courses assigned";
	return ids.map(id => courseLookup.value[id] ?? id).join(", ");
}

async function saveUserProfile() {
	if (!userDraft.value) return;
	const payload: any = { ...userDraft.value };
	if (passwordForm.newPassword || passwordForm.confirmPassword) {
		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			passwordError.value = "Passwords do not match.";
			return;
		}
		passwordError.value = "";
		payload.password = passwordForm.newPassword;
	}

	try {
		await save(payload);
		error.value = "";
	} catch (e: any) {
		error.value =
			e.response?.data?.message ?? e.message ?? "Unable to save profile";
	} finally {
		passwordForm.newPassword = "";
		passwordForm.confirmPassword = "";
	}
}

function revealControls() {
	controlsVisible.value = true;
}

/* -------------------------------------------------- */
/*  field list (only once)                            */
/* -------------------------------------------------- */
const fields = [
	{ key: "name", label: "Name" },
	{ key: "email", label: "Email" },
	{ key: "age", label: "Age" },
	{ key: "state", label: "State" }
];
</script>

<template>
	<section class="Signup text-center">
		<h2>Profile</h2>

		<div v-if="currentUser" class="tutorList mt-2" @click="revealControls">
			<br />
			<ul>
				<li><h4>User</h4></li>

				<ProfileFields
					:editing="editing"
					:entity="editing && userDraft ? userDraft : currentUser"
					:fields="fields"
					@update="updateUserField"
				/>
				<li>
					<strong>Assigned tutors:&ensp;</strong>
					<p class="d-inline">
						{{
							assignedTutorNames.length
								? assignedTutorNames.join(", ")
								: "No tutors assigned yet."
						}}
					</p>
				</li>
				<li>
					<strong>Allowed courses:&ensp;</strong>
					<p class="d-inline">
						{{ formatCourseList(currentUser.courses) }}
					</p>
				</li>
			</ul>
			<div v-if="editing" class="passwordFields">
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
					@click.stop="deleteMe(currentUser!._id)"
				>
					Delete
				</button>
				<button
					class="btn-primary btn"
					@click.stop="editing ? saveUserProfile() : toggle()"
				>
					{{ editing ? "Save" : "Edit" }}
				</button>
			</div>
			<p v-else class="helperText">
				Click anywhere on the card to manage your account.
			</p>
			<p v-if="error" class="error">{{ error }}</p>
		</div>
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
</style>
