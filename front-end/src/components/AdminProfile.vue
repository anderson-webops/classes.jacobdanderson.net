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
const deleteMe = useDeleteAccount("admin");
const tutorSelections = ref<Record<string, string[]>>({});
const savingAssignments = ref<Record<string, boolean>>({});
const promoting = ref<Record<string, boolean>>({});

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
	() => users.value,
	newUsers => {
		const next: Record<string, string[]> = {};
		for (const user of newUsers) {
			next[user._id] = [...(user.tutors ?? []).map(String)];
		}
		tutorSelections.value = next;
	},
	{ immediate: true }
);

function selectionFor(userId: string) {
	return tutorSelections.value[userId] ?? [];
}

function summaryFor(userId: string) {
	const ids = selectionFor(userId);
	if (!ids.length) return "No tutors assigned";
	const names = ids
		.map(id => tutors.value.find(t => t._id === id)?.name)
		.filter((name): name is string => !!name);
	return names.length ? names.join(", ") : "No tutors assigned";
}

async function saveUserTutors(userId: string) {
	error.value = "";
	savingAssignments.value = { ...savingAssignments.value, [userId]: true };
	try {
		await api.put(`/users/admin/${userId}/tutors`, {
			tutorIDs: selectionFor(userId)
		});
		await loadAll();
	} catch (e: any) {
		error.value =
			e.response?.data?.message ??
			e.message ??
			"Unable to update assignments.";
	} finally {
		savingAssignments.value = {
			...savingAssignments.value,
			[userId]: false
		};
	}
}

async function promoteUser(userId: string) {
	error.value = "";
	promoting.value = { ...promoting.value, [userId]: true };
	try {
		await api.post(`/users/admin/${userId}/promote`);
		await loadAll();
	} catch (e: any) {
		error.value =
			e.response?.data?.message ?? e.message ?? "Unable to promote user.";
	} finally {
		promoting.value = { ...promoting.value, [userId]: false };
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
				<label class="assignment-label" :for="`assign-${u._id}`"
					>Assigned tutors</label
				>
				<select
					:id="`assign-${u._id}`"
					v-model="tutorSelections[u._id]"
					class="assignment-select"
					:disabled="!tutors.length"
					multiple
				>
					<option v-for="t in tutors" :key="t._id" :value="t._id">
						{{ t.name }}
					</option>
				</select>
				<p class="assignment-summary">
					{{ summaryFor(u._id) }}
				</p>
				<div class="assignment-actions">
					<button
						class="btn btn-primary"
						type="button"
						:disabled="savingAssignments[u._id]"
						@click="saveUserTutors(u._id)"
					>
						{{
							savingAssignments[u._id]
								? "Saving..."
								: "Save assignments"
						}}
					</button>
					<button
						class="btn btn-secondary"
						type="button"
						:disabled="promoting[u._id]"
						@click="promoteUser(u._id)"
					>
						{{
							promoting[u._id]
								? "Promoting..."
								: "Promote to tutor"
						}}
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

@media only screen and (max-width: 960px) {
	div.tutorList {
		width: 50%;
	}
}

.error {
	color: red;
	margin-top: 10px;
}

.assignment-panel {
	margin: 0 2rem 1rem;
	padding: 1rem 0 0;
	border-top: 1px solid #ddd;
	text-align: left;
}

.assignment-label {
	font-weight: 600;
	display: block;
	margin-bottom: 0.5rem;
}

.assignment-select {
	width: 100%;
	min-height: 5rem;
	padding: 0.5rem;
	border: 1px solid #ccc;
	border-radius: 6px;
}

.assignment-summary {
	margin: 0.5rem 0 0;
	font-size: 0.9rem;
	color: #333;
}

.assignment-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin-top: 0.75rem;
}

.btn-secondary {
	background: #6b7280;
	color: #fff;
	border: none;
	padding: 0.5rem 1rem;
	border-radius: 4px;
	cursor: pointer;
}

.btn-secondary:disabled,
.btn.btn-primary:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}
</style>
