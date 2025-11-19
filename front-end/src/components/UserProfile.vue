<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import AccountSecurity from "@/components/AccountSecurity.vue";
import ProfileFields from "@/components/ProfileFields.vue";
import { useDeleteAccount } from "@/composables/useDeleteAccount";
import { useEditable } from "@/composables/useEditable";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

/* -------------------------------------------------- */
/*  Pinia state                                       */
/* -------------------------------------------------- */
const app = useAppStore();
const { currentUser, currentUserTutors } = storeToRefs(app);
const deleteMe = useDeleteAccount("user");

const coursesStore = useCoursesStore();
const { courses } = storeToRefs(coursesStore);

/* -------------------------------------------------- */
/*  editable helper                                   */
/* -------------------------------------------------- */
const { editing, toggle, save } = useEditable("user");

/* -------------------------------------------------- */
/*  field list (only once)                            */
/* -------------------------------------------------- */
const fields = [
	{ key: "name", label: "Name" },
	{ key: "email", label: "Email" },
	{ key: "age", label: "Age" },
	{ key: "state", label: "State" }
];

const actionsVisible = ref(false);
function revealActions() {
	if (!actionsVisible.value) actionsVisible.value = true;
}

const tutorSummary = computed(() => {
	if (!currentUserTutors.value.length) return "Not assigned";
	return currentUserTutors.value.map(t => t.name).join(", ");
});

const courseLookup = computed(() => {
	const map: Record<string, string> = {};
	for (const course of courses.value ?? []) map[course.id] = course.name;
	return map;
});

const allowedCourseSummary = computed(() => {
	const ids = currentUser.value?.allowedCourses ?? [];
	if (!ids.length) return "No courses assigned";
	return ids.map(id => courseLookup.value[id] ?? id).join(", ");
});
</script>

<template>
	<section class="Signup text-center">
		<h2>Profile</h2>

		<div v-if="currentUser" class="tutorList mt-2" @click="revealActions">
			<br />
			<ul>
				<li><h4>User</h4></li>

				<ProfileFields
					:editing="editing"
					:entity="currentUser"
					:fields="fields"
				/>
			</ul>
			<div class="assignmentSummary">
				<p>
					<strong>Assigned tutor(s):</strong>
					{{ tutorSummary }}
				</p>
				<p>
					<strong>Allowed courses:</strong>
					{{ allowedCourseSummary }}
				</p>
			</div>

			<div v-if="actionsVisible" class="actionButtons">
				<button
					class="btn-danger btn"
					@click.stop="deleteMe(currentUser!._id)"
				>
					Delete
				</button>
				<button
					class="btn-primary btn"
					@click.stop="editing ? save(currentUser) : toggle()"
				>
					{{ editing ? "Save" : "Edit" }}
				</button>
			</div>
			<p v-else class="actionHint">
				Click the card to manage your profile.
			</p>

			<AccountSecurity
				:current-email="currentUser.email"
				:entity-id="currentUser._id"
				role="user"
			/>
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

.assignmentSummary {
	margin: 1rem auto;
	text-align: left;
	max-width: 340px;
}

.assignmentSummary p {
	margin: 0.25rem 0;
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
</style>
