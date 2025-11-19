<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { api } from "@/api";
import ProfileFields from "@/components/ProfileFields.vue";
import { useEditable } from "@/composables/useEditable";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

/* -------------------------------------------------- */
const app = useAppStore();
const { currentAdmin, tutors, users } = storeToRefs(app);
const error = ref("");
const success = ref("");
const userAssignments = ref<Record<string, string[]>>({});
const userEditing = ref<Record<string, boolean>>({});
const tutorEditing = ref<Record<string, boolean>>({});
const userCourseSelections = ref<Record<string, string[]>>({});
const tutorCourseSelections = ref<Record<string, string[]>>({});
const activeCard = ref<string | null>(null);

const coursesStore = useCoursesStore();
const { courses } = storeToRefs(coursesStore);
const courseOptions = computed(() => courses.value ?? []);
const courseNameMap = computed(() => {
	const map: Record<string, string> = {};
	for (const course of courseOptions.value) map[course.id] = course.name;
	return map;
});

/* editable helper for the admin card */
const {
        editing: adminEdit,
        toggle: toggleAdmin,
        save: saveAdmin
} = useEditable("admin");

function cancelAdminEdit() {
        adminEdit.value = false;
        app.refreshCurrentAdmin();
}

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
                const editing: Record<string, boolean> = {};
                const courseSelections: Record<string, string[]> = {};
                for (const user of value) {
                        assignments[user._id] = (user.tutors ?? []).map(t =>
                                typeof t === "string" ? t : t._id
                        );
                        courseSelections[user._id] = [...(user.courseAccess ?? [])];
                        editing[user._id] = false;
                }
                userAssignments.value = assignments;
                userEditing.value = editing;
                userCourseSelections.value = courseSelections;
        },
        { immediate: true }
);

watch(
	tutors,
	value => {
		const selections: Record<string, string[]> = {};
		const editing: Record<string, boolean> = {};
		for (const tutor of value) {
			selections[tutor._id] = [...(tutor.coursePermissions ?? [])];
			editing[tutor._id] = false;
		}
		tutorCourseSelections.value = selections;
		tutorEditing.value = editing;
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

const tutorCourseLookup = computed(() => {
        const map: Record<string, Set<string>> = {};
        for (const tutor of tutors.value) {
                map[tutor._id] = new Set(tutor.coursePermissions ?? []);
        }
        return map;
});

function formatAssignedTutors(userID: string) {
	const assigned = userAssignments.value[userID] ?? [];
	if (assigned.length === 0) return "No tutors assigned";
	return assigned.map(id => tutorLookup.value[id] ?? "Unknown").join(", ");
}

function formatTutorCourses(tutorID: string) {
        const list = tutorCourseSelections.value[tutorID] ?? [];
        if (list.length === 0) return "No courses enabled";
        return list.map(id => courseNameMap.value[id] ?? id).join(", ");
}

function formatUserCourses(userID: string, fallback: string[]) {
        const list = userCourseSelections.value[userID] ?? fallback;
        if (list.length === 0) return "No courses enabled";
        return list.map(id => courseNameMap.value[id] ?? id).join(", ");
}

function allowedCoursesForUser(userID: string) {
        const tutorsForUser = userAssignments.value[userID] ?? [];
        const allowed = new Set<string>();
        for (const tutorID of tutorsForUser) {
                for (const id of tutorCourseLookup.value[tutorID] ?? []) allowed.add(id);
        }
        return allowed;
}

function updateEntityField(
        entity: Record<string, any>,
        key: string,
        value: string | number | boolean | null | undefined
) {
        entity[key] = value;
}

function activateCard(id: string) {
	activeCard.value = activeCard.value === id ? null : id;
}

function isCardActive(id: string) {
	return activeCard.value === id;
}

function toggleUserEdit(userID: string) {
        userEditing.value = {
                ...userEditing.value,
                [userID]: !userEditing.value[userID]
        };
        reconcileUserCourses(userID);
        success.value = "";
        error.value = "";
}

function toggleTutorEdit(tutorID: string) {
	tutorEditing.value = {
		...tutorEditing.value,
		[tutorID]: !tutorEditing.value[tutorID]
	};
	success.value = "";
	error.value = "";
}

function onTutorCourseToggle(
	tutorID: string,
	courseID: string,
	checked: boolean
) {
	const existing = new Set(tutorCourseSelections.value[tutorID] ?? []);
	if (checked) existing.add(courseID);
	else existing.delete(courseID);
	tutorCourseSelections.value = {
		...tutorCourseSelections.value,
		[tutorID]: [...existing]
	};
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
        reconcileUserCourses(userID);
}

function reconcileUserCourses(userID: string) {
        const allowed = allowedCoursesForUser(userID);
        const current = userCourseSelections.value[userID] ?? [];
        userCourseSelections.value = {
                ...userCourseSelections.value,
                [userID]: current.filter(id => allowed.has(id))
        };
}

async function saveAssignments(userID: string) {
        try {
                await api.put(`/users/${userID}/tutors`, {
                        tutorIDs: userAssignments.value[userID] ?? []
                });
                await Promise.all([app.fetchUsers(), app.fetchTutors()]);
                success.value = "Saved tutor assignments.";
                error.value = "";
        } catch (e: any) {
                error.value =
                        e.response?.data?.message ?? e.message ?? "Unable to update tutors";
        }
}

function isCourseAllowed(userID: string, courseID: string) {
        return allowedCoursesForUser(userID).has(courseID);
}

function onUserCourseToggle(userID: string, courseID: string, checked: boolean) {
        if (!isCourseAllowed(userID, courseID)) return;
        const existing = new Set(userCourseSelections.value[userID] ?? []);
        if (checked) existing.add(courseID);
        else existing.delete(courseID);
        userCourseSelections.value = {
                ...userCourseSelections.value,
                [userID]: [...existing]
        };
}

async function saveUserCourses(userID: string) {
        try {
                success.value = "";
                error.value = "";
                await api.put(`/users/${userID}/courses`, {
                        courseIDs: userCourseSelections.value[userID] ?? []
                });
                success.value = "Saved course access.";
                await app.fetchUsers();
                userEditing.value = { ...userEditing.value, [userID]: false };
        } catch (e: any) {
                error.value =
                        e.response?.data?.message ?? e.message ?? "Unable to save courses";
        }
}

async function saveTutorCourses(tutorID: string) {
	try {
		success.value = "";
		error.value = "";
		await api.put(`/tutors/${tutorID}/courses`, {
			courseIDs: tutorCourseSelections.value[tutorID] ?? []
		});
		success.value = "Updated tutor course access.";
		await app.fetchTutors();
		tutorEditing.value = { ...tutorEditing.value, [tutorID]: false };
	} catch (e: any) {
		error.value =
			e.response?.data?.message ??
			e.message ??
			"Unable to update tutor courses";
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
			:class="[{ active: isCardActive('admin') }]"
			@click="activateCard('admin')"
		>
			<br />
			<p v-if="!isCardActive('admin')" class="card-hint">
				Click to edit admin details or security settings.
			</p>
			<ul>
                                <li><h4>Admin</h4></li>

                                <ProfileFields
                                        :editing="adminEdit"
                                        :entity="currentAdmin"
                                        :fields="fields"
                                        :expanded="isCardActive('admin')"
                                        :show-security="true"
                                        :entity-id="currentAdmin._id"
                                        role="admin"
                                        @update="
                                                (key, value) =>
                                                        updateEntityField(
                                                                currentAdmin as Record<string, any>,
                                                                key,
                                                                value
                                                        )
                                        "
                                />
                        </ul>
                        <br />

                        <div v-if="isCardActive('admin')" class="card-actions">
                                <button
                                        v-if="adminEdit"
                                        class="btn btn-secondary"
                                        type="button"
                                        @click.stop="cancelAdminEdit"
                                >
                                        Cancel
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
                </div>

		<!-- ───── Tutors list (read-only) ───── -->
		<hr />
		<h2>{{ tutorsHeader }}</h2>
		<div
			v-for="t in tutors"
			:key="t._id"
			class="tutorList mt-2"
			:class="[{ active: isCardActive(`tutor-${t._id}`) }]"
			@click="activateCard(`tutor-${t._id}`)"
		>
			<br />
			<ul>
				<ProfileFields :editing="false" :entity="t" :fields="fields" />
			</ul>
			<p class="assignment">
				<strong>Course access:</strong>
				{{ formatTutorCourses(t._id) }}
			</p>
			<div v-if="isCardActive(`tutor-${t._id}`)" class="card-actions">
				<button
					class="btn-secondary btn"
					type="button"
					@click.stop="toggleTutorEdit(t._id)"
				>
					{{ tutorEditing[t._id] ? "Close" : "Edit courses" }}
				</button>
			</div>
			<div v-if="tutorEditing[t._id]" class="course-editor">
				<p class="helperText">
					Select which courses this tutor can access.
				</p>
				<div class="checkbox-grid">
					<label v-for="course in courseOptions" :key="course.id">
						<input
							:checked="
								tutorCourseSelections[t._id]?.includes(
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
				</div>
                                <div class="card-actions">
                                        <button
                                                class="btn btn-primary"
                                                type="button"
                                                @click.stop="saveTutorCourses(t._id)"
                                        >
                                                Save courses
                                        </button>
                                </div>
                        </div>
                </div>

		<!-- ───── Users list (read-only) ───── -->
		<hr />
		<h2>{{ usersHeader }}</h2>
		<div
			v-for="u in users"
			:key="u._id"
			class="tutorList mt-2"
			:class="[{ active: isCardActive(`user-${u._id}`) }]"
			@click="activateCard(`user-${u._id}`)"
		>
			<br />
			<ul>
				<ProfileFields :editing="false" :entity="u" :fields="fields" />
			</ul>
                        <p class="assignment">
                                <strong>Assigned tutors:</strong>
                                {{ formatAssignedTutors(u._id) }}
                        </p>
                        <p class="assignment">
                                <strong>Course access:</strong>
                                {{ formatUserCourses(u._id, u.courseAccess ?? []) }}
                        </p>
                        <div v-if="isCardActive(`user-${u._id}`)" class="card-actions">
                                <button
                                        class="btn-secondary btn"
                                        type="button"
                                        @click.stop="toggleUserEdit(u._id)"
				>
					{{ userEditing[u._id] ? "Close" : "Edit assignments" }}
				</button>
			</div>
			<div v-if="userEditing[u._id]" class="assignmentControls">
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
                                                @click.stop="saveAssignments(u._id)"
                                        >
                                                Save Assignments
                                        </button>
                                </div>
                                <div class="course-editor">
                                        <p class="helperText">
                                                Select which courses this user can access. Courses are disabled unless a
                                                qualified tutor is assigned.
                                        </p>
                                        <div class="checkbox-grid">
                                                <label v-for="course in courseOptions" :key="course.id">
                                                        <input
                                                                :checked="userCourseSelections[u._id]?.includes(course.id)"
                                                                :disabled="!isCourseAllowed(u._id, course.id)"
                                                                type="checkbox"
                                                                @change="
                                                                        onUserCourseToggle(
                                                                                u._id,
                                                                                course.id,
                                                                                ($event.target as HTMLInputElement).checked
                                                                        )
                                                                "
                                                        />
                                                        {{ course.name }}
                                                        <span
                                                                v-if="!isCourseAllowed(u._id, course.id)"
                                                                class="disabled-note"
                                                        >
                                                                Assign a tutor with this course
                                                        </span>
                                                </label>
                                        </div>
                                        <div class="assignmentActions">
                                                <button
                                                        class="btn btn-primary"
                                                        type="button"
                                                        @click.stop="saveUserCourses(u._id)"
                                                >
                                                        Save course access
                                                </button>
                                        </div>
                                </div>
                        </div>
                </div>

		<p v-if="success" class="status">{{ success }}</p>
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
	cursor: pointer;
	transition:
		border-color 0.2s ease,
		box-shadow 0.2s ease;
}

.tutorList.active {
	border-color: #2563eb;
	box-shadow: 0 12px 28px rgba(37, 99, 235, 0.2);
}

@media only screen and (max-width: 960px) {
	div.tutorList {
		width: 50%;
	}
}

.card-hint {
	color: rgba(15, 23, 42, 0.7);
	margin-bottom: 0.5rem;
}

.assignment {
	margin: 0.5rem 0 1rem;
}

.card-actions {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	margin: 0.5rem auto 1rem;
	width: 90%;
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

.course-editor {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	margin: 0.5rem auto 1rem;
	width: 90%;
}

.checkbox-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	gap: 0.5rem;
}

.checkbox-grid label {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.9rem;
}

.disabled-note {
        color: rgba(15, 23, 42, 0.65);
        font-size: 0.8rem;
}

.status {
	color: #15803d;
	margin-top: 0.75rem;
}

.error {
	color: red;
	margin-top: 10px;
}
</style>
