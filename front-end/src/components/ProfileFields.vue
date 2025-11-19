<script lang="ts" setup>
import { ref, watch } from "vue";
import { api } from "@/api";
import { useAppStore } from "@/stores/app";

interface Field {
        key: string;
        label: string;
}

type Role = "admin" | "tutor" | "user";

const props = defineProps<{
        fields: Field[];
        entity: Record<string, Displayable>;
        editing: boolean;
        expanded?: boolean;
        showSecurity?: boolean;
        role?: Role;
        entityId?: string;
}>();

const emit = defineEmits<{
        (e: "update", key: string, value: Displayable): void;
}>();

const app = useAppStore();

const email = ref(String(props.entity.email ?? ""));
const emailStatus = ref("");
const emailError = ref("");

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const passwordStatus = ref("");
const passwordError = ref("");

watch(
        () => props.entity.email,
        value => {
                email.value = String(value ?? "");
        }
);

function onInput(key: string, value: Displayable) {
        emit("update", key, value);
}

function refreshRole() {
        if (props.role === "admin") app.refreshCurrentAdmin();
        else if (props.role === "tutor") app.refreshCurrentTutor();
        else if (props.role === "user") app.refreshCurrentUser();
}

async function updateEmail() {
        emailStatus.value = "";
        emailError.value = "";
        if (!props.entityId || !props.role) return;

        if (!email.value) {
                emailError.value = "Email is required.";
                return;
        }

        try {
                await api.post(`/accounts/changeEmail/${props.entityId}`, {
                        email: email.value
                });
                emailStatus.value = "Email updated successfully.";
                refreshRole();
        } catch (err: any) {
                emailError.value =
                        err.response?.data?.message ??
                        err.message ??
                        "Unable to update email.";
        }
}

async function updatePassword() {
        passwordStatus.value = "";
        passwordError.value = "";
        if (!props.entityId || !props.role) return;

        if (!newPassword.value) {
                passwordError.value = "New password is required.";
                return;
        }
        if (newPassword.value !== confirmPassword.value) {
                passwordError.value = "New passwords do not match.";
                return;
        }

        try {
                await api.post(`/accounts/changePassword/${props.entityId}`, {
                        currentPassword: currentPassword.value,
                        newPassword: newPassword.value
                });
                passwordStatus.value = "Password updated successfully.";
                currentPassword.value = newPassword.value = confirmPassword.value = "";
        } catch (err: any) {
                passwordError.value =
                        err.response?.data?.message ??
                        err.message ??
                        "Unable to update password.";
        }
}

/* use a more precise value type instead of any */
type Displayable = string | number | boolean | null | undefined;
</script>

<template>
        <template v-for="f in fields" :key="f.key">
                <li v-if="editing">
                        <label>
                                {{ f.label }}:&ensp;
                                <input
                                        :value="entity[f.key]"
                                        class="editTutor"
                                        type="text"
                                        @input="
                                                onInput(
                                                        f.key,
                                                        ($event.target as HTMLInputElement).value
                                                )
                                        "
                                />
                        </label>
                </li>

                <li v-else>
                        <strong v-if="false">{{ f.label }}</strong>
                        <!-- hidden label → keeps spacing -->
                        &ensp;
                        <p class="d-inline">
                                {{ entity[f.key] }}
                        </p>
                </li>
        </template>

        <section
                v-if="showSecurity && expanded"
                class="security-card"
        >
                <h4>Account security</h4>
                <p class="hint">Update your email or password whenever you need to.</p>

                <div class="security-section">
                        <h5>Change email</h5>
                        <div class="field">
                                <label for="account-email">Email</label>
                                <input
                                        id="account-email"
                                        v-model="email"
                                        name="account-email"
                                        type="email"
                                />
                        </div>
                        <button
                                class="btn btn-secondary"
                                type="button"
                                @click="updateEmail"
                        >
                                Update email
                        </button>
                        <p v-if="emailStatus" class="status">{{ emailStatus }}</p>
                        <p v-if="emailError" class="error">{{ emailError }}</p>
                </div>

                <div class="security-section">
                        <h5>Change password</h5>
                        <div class="field">
                                <label for="current-password">Current password</label>
                                <input
                                        id="current-password"
                                        v-model="currentPassword"
                                        autocomplete="current-password"
                                        name="current-password"
                                        type="password"
                                />
                        </div>
                        <div class="field">
                                <label for="new-password">New password</label>
                                <input
                                        id="new-password"
                                        v-model="newPassword"
                                        autocomplete="new-password"
                                        name="new-password"
                                        type="password"
                                />
                        </div>
                        <div class="field">
                                <label for="confirm-password">Confirm password</label>
                                <input
                                        id="confirm-password"
                                        v-model="confirmPassword"
                                        autocomplete="new-password"
                                        name="confirm-password"
                                        type="password"
                                />
                        </div>
                        <button
                                class="btn btn-primary"
                                type="button"
                                @click="updatePassword"
                        >
                                Update password
                        </button>
                        <p v-if="passwordStatus" class="status">{{ passwordStatus }}</p>
                        <p v-if="passwordError" class="error">{{ passwordError }}</p>
                </div>
        </section>
</template>

<style scoped>
.security-card {
        margin-top: 1.5rem;
        padding: 1.25rem;
        border: 1px solid rgba(15, 23, 42, 0.15);
        border-radius: 16px;
        background: rgba(15, 23, 42, 0.02);
        text-align: left;
}

.security-section + .security-section {
        margin-top: 1.5rem;
        border-top: 1px solid rgba(15, 23, 42, 0.08);
        padding-top: 1.25rem;
}

.field {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        margin-bottom: 0.75rem;
}

.field input {
        border: 1px solid rgba(15, 23, 42, 0.18);
        border-radius: 8px;
        padding: 0.5rem 0.75rem;
}

.hint {
        margin-top: 0.25rem;
        color: rgba(15, 23, 42, 0.65);
        font-size: 0.9rem;
}

.status {
        color: #15803d;
        margin-top: 0.35rem;
}

.error {
        color: #b91c1c;
        margin-top: 0.35rem;
}
</style>
