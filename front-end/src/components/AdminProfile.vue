<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { api } from "@/api";
import ProfileFields from "@/components/ProfileFields.vue";
import { useDeleteAccount } from "@/composables/useDeleteAccount";
import { useEditable } from "@/composables/useEditable";
import { useAppStore } from "@/stores/app";

/* -------------------------------------------------- */
const app = useAppStore();
const { currentAdmin, tutors, users } = storeToRefs(app);
const error = ref("");
const deleteMe = useDeleteAccount("admin");
const selectedTutorsByUser = reactive<Record<string, string[]>>({});

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
	list => {
		const seen = new Set<string>();
		for (const user of list) {
			selectedTutorsByUser[user._id] = [...(user.tutors ?? [])];
			seen.add(user._id);
		}
		Object.keys(selectedTutorsByUser).forEach(key => {
			if (!seen.has(key)) delete selectedTutorsByUser[key];
		});
	},
	{ immediate: true, deep: true }
);

function assignedTutorNames(userID: string) {
	const map = new Map(tutors.value.map(t => [t._id, t.name]));
	return (selectedTutorsByUser[userID] ?? []).map(
		id => map.get(id) ?? "Unknown"
	);
}

async function saveUserTutors(userID: string) {
	error.value = "";
	try {
		await api.put(`/users/${userID}/tutors`, {
			tutorIDs: selectedTutorsByUser[userID] ?? []
		});
		await loadAll();
	} catch (e: any) {
		error.value =
			e.response?.data?.message ??
			e.message ??
			"Unable to save user assignments.";
	}
}

async function promoteUser(userID: string) {
	error.value = "";
	try {
		await api.post(`/users/${userID}/promote`);
		await loadAll();
	} catch (e: any) {
		error.value =
			e.response?.data?.message ?? e.message ?? "Unable to promote user.";
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

			<div class="user-assignment">
				<label :for="`user-tutor-select-${u._id}`"
					>Assigned tutors</label
				>
				<select
					:id="`user-tutor-select-${u._id}`"
					v-model="selectedTutorsByUser[u._id]"
					:disabled="tutors.length === 0"
					multiple
				>
					<option v-for="t in tutors" :key="t._id" :value="t._id">
						{{ t.name }}
					</option>
				</select>

				<p
					class="assigned"
					:class="[{ muted: !selectedTutorsByUser[u._id]?.length }]"
				>
					{{
						selectedTutorsByUser[u._id]?.length
							? assignedTutorNames(u._id).join(", ")
							: "No tutors assigned"
					}}
				</p>

				<div class="user-actions">
					<button
						class="btn btn-primary"
						type="button"
						@click="saveUserTutors(u._id)"
					>
						Save assignments
					</button>
					<button
						class="btn btn-secondary"
						type="button"
						@click="promoteUser(u._id)"
					>
						Make tutor
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

.hidden {
	display: none;
}

div.tutorList {
	outline: black solid 1px;
	padding-bottom: 1%;
	width: 35%;
	margin: auto;
}

.user-assignment {
	margin: 0 2rem 1.5rem;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.user-assignment select {
	min-height: 5rem;
	padding: 0.25rem;
}

.user-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
}

.btn-secondary {
	background-color: transparent;
	border: 1px solid #0d6efd;
	color: #0d6efd;
}

.btn-secondary:hover {
	background-color: #0d6efd;
	color: #fff;
}

.assigned {
	margin: 0;
}

.assigned.muted {
	color: #6b7280;
	font-style: italic;
}

@media only screen and (max-width: 960px) {
	div.tutorList {
		width: 50%;
	}
}

.error {
	color: red;
	margin-top: 10px;
}
</style>
