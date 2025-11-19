<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { api } from "@/api";
import ProfileFields from "@/components/ProfileFields.vue";
import { useDeleteAccount } from "@/composables/useDeleteAccount";
import { useAppStore } from "@/stores/app";

const app = useAppStore();
const { currentAdmin, tutors, users } = storeToRefs(app);
const deleteAdmin = useDeleteAccount("admin");
const success = ref("");
const error = ref("");
const activeCard = ref<string | null>(null);

const fields = [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" }
];

async function loadAll() {
        await Promise.all([app.fetchTutors(), app.fetchUsers(), app.refreshCurrentAdmin()]);
}

onMounted(loadAll);

function activateCard(id: string) {
        activeCard.value = activeCard.value === id ? null : id;
}

function isCardActive(id: string) {
        return activeCard.value === id;
}

async function confirmAction(label: string, action: () => Promise<void>) {
        if (!confirm(`Are you sure you want to ${label}?`)) return;
        success.value = "";
        error.value = "";
        try {
                await action();
                success.value = `${label} succeeded.`;
        } catch (e: any) {
                error.value = e.response?.data?.message ?? e.message ?? `${label} failed.`;
        }
}

async function demoteTutor(tutorID: string) {
        await confirmAction("demote", async () => {
                await api.post(`/tutors/${tutorID}/demote`);
                await Promise.all([app.fetchUsers(), app.fetchTutors()]);
        });
}

async function promoteToTutor(userID: string) {
        await confirmAction("promote", async () => {
                await api.post(`/users/${userID}/promote`);
                await Promise.all([app.fetchUsers(), app.fetchTutors()]);
        });
}

async function removeTutor(tutorID: string) {
        await confirmAction("delete", async () => {
                await api.delete(`/tutors/remove/${tutorID}`);
                await Promise.all([app.fetchUsers(), app.fetchTutors()]);
        });
}

async function removeUser(userID: string) {
        await confirmAction("delete", async () => {
                await api.delete(`/users/user/${userID}`);
                await app.fetchUsers();
        });
}

async function removeAdminAccount(adminID: string) {
        await confirmAction("delete", async () => {
                await deleteAdmin(adminID);
        });
}
</script>

<template>
        <section class="Signup text-center">
                <h2>Manage Profiles</h2>

                <div
                        v-if="currentAdmin"
                        class="tutorList mt-2"
                        :class="[{ active: isCardActive('admin') }]"
                        @click="activateCard('admin')"
                >
                        <br />
                        <p v-if="!isCardActive('admin')" class="card-hint">
                                Click to reveal admin deletion controls.
                        </p>
                        <ul>
                                <li><h4>Admin</h4></li>
                                <ProfileFields :editing="false" :entity="currentAdmin" :fields="fields" />
                        </ul>
                        <div v-if="isCardActive('admin')" class="card-actions">
                                <button
                                        class="btn btn-danger"
                                        type="button"
                                        @click.stop="removeAdminAccount(currentAdmin!._id)"
                                >
                                        Delete admin account
                                </button>
                        </div>
                </div>

                <hr />
                <h2>Tutors</h2>
                <div
                        v-for="t in tutors"
                        :key="t._id"
                        class="tutorList mt-2"
                        :class="[{ active: isCardActive(`tutor-${t._id}`) }]"
                        @click="activateCard(`tutor-${t._id}`)"
                >
                        <br />
                        <p v-if="!isCardActive(`tutor-${t._id}`)" class="card-hint">
                                Click to show demote or delete options.
                        </p>
                        <ul>
                                <ProfileFields :editing="false" :entity="t" :fields="fields" />
                        </ul>
                        <div v-if="isCardActive(`tutor-${t._id}`)" class="card-actions">
                                <button
                                        class="btn btn-secondary"
                                        type="button"
                                        @click.stop="demoteTutor(t._id)"
                                >
                                        Demote to user
                                </button>
                                <button
                                        class="btn btn-danger"
                                        type="button"
                                        @click.stop="removeTutor(t._id)"
                                >
                                        Delete tutor
                                </button>
                        </div>
                </div>

                <hr />
                <h2>Users</h2>
                <div
                        v-for="u in users"
                        :key="u._id"
                        class="tutorList mt-2"
                        :class="[{ active: isCardActive(`user-${u._id}`) }]"
                        @click="activateCard(`user-${u._id}`)"
                >
                        <br />
                        <p v-if="!isCardActive(`user-${u._id}`)" class="card-hint">
                                Click to show promotion or deletion options.
                        </p>
                        <ul>
                                <ProfileFields :editing="false" :entity="u" :fields="fields" />
                        </ul>
                        <div v-if="isCardActive(`user-${u._id}`)" class="card-actions">
                                <button
                                        class="btn btn-primary"
                                        type="button"
                                        @click.stop="promoteToTutor(u._id)"
                                >
                                        Promote to tutor
                                </button>
                                <button
                                        class="btn btn-danger"
                                        type="button"
                                        @click.stop="removeUser(u._id)"
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

div.tutorList.active {
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
        flex-direction: column;
        gap: 0.75rem;
        margin: 0.5rem auto 1rem;
        width: 90%;
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
