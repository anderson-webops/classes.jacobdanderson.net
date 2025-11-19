<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { api } from "@/api";
import ProfileFields from "@/components/ProfileFields.vue";
import { useDeleteAccount } from "@/composables/useDeleteAccount";
import { useEditable } from "@/composables/useEditable";
import { useAppStore } from "@/stores/app";

/* -------------------------------------------------- */
const app = useAppStore();
const { currentAdmin, tutors, users } = storeToRefs(app);
const error = ref("");
const successMessage = ref("");
const deleteMe = useDeleteAccount("admin");
const tutorSelections = ref<Record<string, string[]>>({});
const savingAssignments = ref<string | null>(null);
const promotingUser = ref<string | null>(null);

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
		const next: Record<string, string[]> = {};
		value.forEach(user => {
			next[user._id] = (user.tutors ?? []).map(String);
		});
		tutorSelections.value = next;
	},
	{ immediate: true }
);

function toggleTutorSelection(
	userID: string,
	tutorID: string,
	checked: boolean
) {
	const current = tutorSelections.value[userID]
		? [...tutorSelections.value[userID]]
		: [];
	const next = checked
		? Array.from(new Set([...current, tutorID]))
		: current.filter(id => id !== tutorID);
	tutorSelections.value = {
		...tutorSelections.value,
		[userID]: next
	};
}

async function saveTutorAssignments(userID: string) {
	savingAssignments.value = userID;
	error.value = "";
	successMessage.value = "";
	try {
		await api.put(`/users/${userID}/tutors`, {
			tutorIds: tutorSelections.value[userID] ?? []
		});
		await Promise.all([app.fetchUsers(), app.fetchTutors()]);
		successMessage.value = "Tutor assignments updated.";
	} catch (err: any) {
		error.value =
			err.response?.data?.message ??
			err.message ??
			"Failed to update assignments.";
	} finally {
		savingAssignments.value = null;
	}
}

async function promoteUser(userID: string) {
	promotingUser.value = userID;
	error.value = "";
	successMessage.value = "";
	try {
		await api.post(`/tutors/promote/${userID}`);
		successMessage.value = "User promoted to tutor.";
		await Promise.all([app.fetchTutors(), app.fetchUsers()]);
	} catch (err: any) {
		error.value =
			err.response?.data?.message ??
			err.message ??
			"Failed to promote user.";
	} finally {
		promotingUser.value = null;
	}
}

const tutorsHeader = computed(() =>
	currentAdmin.value && tutors.value.length === 0 ? "No Tutors" : "Tutors"
);

const usersHeader = computed(() =>
	currentAdmin.value && users.value.length === 0 ? "No Users" : "Users"
);
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
					:entity="currentAdmin"
					:fields="fields"
				/>
			</ul>
			<br />

			<button class="btn-danger btn" @click="deleteMe(currentAdmin!._id)">
				Delete
			</button>
			<button
				class="btn-primary btn"
				@click="adminEdit ? saveAdmin(currentAdmin) : toggleAdmin()"
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
		</div>

		<!-- ───── Users list (read-only) ───── -->
		<hr />
		<h2>{{ usersHeader }}</h2>
		<div v-for="u in users" :key="u._id" class="tutorList mt-2">
			<br />
			<ul>
				<ProfileFields :editing="false" :entity="u" :fields="fields" />
			</ul>

			<div class="assignment-panel">
				<p class="assignment-label">Tutor assignments</p>
				<p v-if="!tutors.length" class="assignment-empty">
					No tutors are currently available.
				</p>
				<div v-else class="assignment-options">
					<label
						v-for="t in tutors"
						:key="`${u._id}-${t._id}`"
						class="assignment-option"
					>
						<input
							type="checkbox"
							:checked="tutorSelections[u._id]?.includes(t._id)"
							@change="
								toggleTutorSelection(
									u._id,
									t._id,
									($event.target as HTMLInputElement).checked
								)
							"
						/>
						<span>{{ t.name }}</span>
					</label>
				</div>

				<div class="assignment-actions">
					<button
						class="btn btn-primary"
						type="button"
						:disabled="savingAssignments === u._id"
						@click="saveTutorAssignments(u._id)"
					>
						{{
							savingAssignments === u._id
								? "Saving..."
								: "Save assignments"
						}}
					</button>
					<button
						class="btn btn-secondary"
						type="button"
						:disabled="promotingUser === u._id"
						@click="promoteUser(u._id)"
					>
						{{
							promotingUser === u._id
								? "Promoting..."
								: "Promote to tutor"
						}}
					</button>
				</div>
			</div>
		</div>

		<p v-if="successMessage" class="success">{{ successMessage }}</p>
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

.assignment-panel {
	background: #f9fafb;
	border-radius: 12px;
	padding: 1rem;
	margin: 1rem auto 0;
	width: 90%;
}

.assignment-label {
	font-weight: 600;
	margin-bottom: 0.5rem;
}

.assignment-empty {
	margin: 0;
	color: #6b7280;
	font-size: 0.9rem;
}

.assignment-options {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem 0.75rem;
}

.assignment-option {
	display: flex;
	align-items: center;
	gap: 0.35rem;
	font-size: 0.9rem;
}

.assignment-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	justify-content: flex-end;
	margin-top: 0.75rem;
}

.btn-secondary {
	background-color: #6b7280;
	color: #fff;
}

.btn:disabled,
.btn-secondary:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.error {
	color: red;
	margin-top: 10px;
}

.success {
	color: #16a34a;
	margin-top: 10px;
}
</style>
