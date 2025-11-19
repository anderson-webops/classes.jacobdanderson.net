<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { api } from "@/api";
import ProfileFields from "@/components/ProfileFields.vue";
import { useAppStore } from "@/stores/app";

const app = useAppStore();
const { currentAdmin, tutors, users } = storeToRefs(app);
const success = ref("");
const error = ref("");
const activeCard = ref<string | null>(null);

const fields = [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" }
];

const tutorsHeader = computed(() =>
        currentAdmin.value && tutors.value.length === 0 ? "No Tutors" : "Tutors"
);

const usersHeader = computed(() =>
        currentAdmin.value && users.value.length === 0 ? "No Users" : "Users"
);

const endpoint: Record<"admin" | "tutor" | "user", string> = {
        admin: "/admins/remove",
        tutor: "/tutors/remove",
        user: "/users/user"
};

function toggleCard(id: string) {
        activeCard.value = activeCard.value === id ? null : id;
}

function isActive(id: string) {
        return activeCard.value === id;
}

async function loadAll() {
        await Promise.all([app.fetchTutors(), app.fetchUsers(), app.refreshCurrentAdmin()]);
}

onMounted(loadAll);

async function confirmAction(label: string, action: () => Promise<void>) {
        if (!window.confirm(`Are you sure you want to ${label}?`)) return;
        try {
                success.value = "";
                error.value = "";
                await action();
        } catch (e: any) {
                error.value = e.response?.data?.message ?? e.message ?? `Unable to ${label.toLowerCase()}`;
        }
}

async function demoteTutor(tutorID: string) {
        await api.post(`/tutors/${tutorID}/demote`);
        await loadAll();
        success.value = "Tutor demoted to user.";
}

async function promoteUser(userID: string) {
        await api.post(`/users/${userID}/promote`);
        await loadAll();
        success.value = "User promoted to tutor.";
}

async function deleteAccount(kind: "admin" | "tutor" | "user", id: string, logout = false) {
        await api.delete(`${endpoint[kind]}/${id}`);
        if (logout) await app.logout();
        else await loadAll();
        success.value = "Account deleted.";
}
</script>

<template>
        <section class="Signup text-center">
                <h2>Manage profiles</h2>

                <div
                        v-if="currentAdmin"
                        class="tutorList mt-2"
                        :class="[{ active: isActive('admin') }]"
                        @click="toggleCard('admin')"
                >
                        <br />
                        <p v-if="!isActive('admin')" class="card-hint">
                                Click to show admin delete controls.
                        </p>
                        <ul>
                                <li><h4>Admin</h4></li>
                                <ProfileFields :editing="false" :entity="currentAdmin" :fields="fields" />
                        </ul>
                        <div v-if="isActive('admin')" class="card-actions">
                                <button
                                        class="btn btn-danger"
                                        type="button"
                                        @click.stop="
                                                confirmAction('Delete', () => deleteAccount('admin', currentAdmin!._id, true))
                                        "
                                >
                                        Delete admin account
                                </button>
                        </div>
                </div>

                <hr />
                <h2>{{ tutorsHeader }}</h2>
                <div
                        v-for="t in tutors"
                        :key="t._id"
                        class="tutorList mt-2"
                        :class="[{ active: isActive(`tutor-${t._id}`) }]"
                        @click="toggleCard(`tutor-${t._id}`)"
                >
                        <br />
                        <ul>
                                <ProfileFields :editing="false" :entity="t" :fields="fields" />
                        </ul>
                        <div v-if="isActive(`tutor-${t._id}`)" class="card-actions">
                                <button
                                        class="btn btn-secondary"
                                        type="button"
                                        @click.stop="confirmAction('Demote', () => demoteTutor(t._id))"
                                >
                                        Demote to user
                                </button>
                                <button
                                        class="btn btn-danger"
                                        type="button"
                                        @click.stop="confirmAction('Delete', () => deleteAccount('tutor', t._id))"
                                >
                                        Delete tutor
                                </button>
                        </div>
                </div>

                <hr />
                <h2>{{ usersHeader }}</h2>
                <div
                        v-for="u in users"
                        :key="u._id"
                        class="tutorList mt-2"
                        :class="[{ active: isActive(`user-${u._id}`) }]"
                        @click="toggleCard(`user-${u._id}`)"
                >
                        <br />
                        <ul>
                                <ProfileFields :editing="false" :entity="u" :fields="fields" />
                        </ul>
                        <div v-if="isActive(`user-${u._id}`)" class="card-actions">
                                <button
                                        class="btn btn-secondary"
                                        type="button"
                                        @click.stop="confirmAction('Promote', () => promoteUser(u._id))"
                                >
                                        Promote to tutor
                                </button>
                                <button
                                        class="btn btn-danger"
                                        type="button"
                                        @click.stop="confirmAction('Delete', () => deleteAccount('user', u._id))"
                                >
                                        Delete user
                                </button>
                        </div>
                </div>

                <p v-if="success" class="status">{{ success }}</p>
                <p v-if="error" class="error">{{ error }}</p>
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

.divider {
        margin: 1.25rem 0;
}

div.tutorList {
        outline: black solid 1px;
        padding-bottom: 1%;
        width: 35%;
        margin: auto;
        cursor: pointer;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
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

.card-actions {
        display: flex;
        gap: 0.75rem;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 0.75rem;
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
