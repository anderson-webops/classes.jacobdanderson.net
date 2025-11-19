<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { api } from "@/api";
import { useAppStore } from "@/stores/app";

interface Field {
        key: string;
        label: string;
}

type Displayable = string | number | boolean | null | undefined;
type Role = "admin" | "tutor" | "user";

const props = defineProps<{
        fields: Field[];
        entity: Record<string, Displayable> & { _id?: string };
        editing: boolean;
        role: Role;
        showSecurity?: boolean;
}>();

const emit = defineEmits<{
        (e: "update:field", key: string, value: Displayable): void;
}>();

const app = useAppStore();

const draft = ref<Record<string, Displayable>>({ ...props.entity });

watch(
        () => props.entity,
        value => {
                draft.value = { ...value };
                if (typeof value.email === "string") email.value = value.email;
        },
        { deep: true }
);

watch(
        () => props.editing,
        editing => {
                if (editing) draft.value = { ...props.entity };
        }
);

function onInput(key: string, value: Displayable) {
        draft.value = { ...draft.value, [key]: value };
        emit("update:field", key, value);
}

const email = ref(typeof props.entity.email === "string" ? props.entity.email : "");
const emailStatus = ref("");
const emailError = ref("");

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const passwordStatus = ref("");
const passwordError = ref("");

const entityId = computed(() => String(props.entity._id ?? ""));

watch(
        () => props.entity.email,
        value => {
                email.value = typeof value === "string" ? value : "";
        }
);

function refreshRole() {
        if (props.role === "admin") app.refreshCurrentAdmin();
        else if (props.role === "tutor") app.refreshCurrentTutor();
        else app.refreshCurrentUser();
}

async function updateEmail() {
        emailStatus.value = "";
        emailError.value = "";
        if (!email.value) {
                emailError.value = "Email is required.";
                return;
        }
        if (!entityId.value) {
                emailError.value = "Missing account identifier.";
                return;
        }

        try {
                await api.post(`/accounts/changeEmail/${entityId.value}`, {
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
        if (!newPassword.value) {
                passwordError.value = "New password is required.";
                return;
        }
        if (newPassword.value !== confirmPassword.value) {
                passwordError.value = "New passwords do not match.";
                return;
        }
        if (!entityId.value) {
                passwordError.value = "Missing account identifier.";
                return;
        }

        try {
                await api.post(`/accounts/changePassword/${entityId.value}`, {
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
</script>

<template>
        <section class="profile-details">
                <ul class="field-list">
                        <li v-for="f in fields" :key="f.key" class="field-row">
                                <template v-if="editing">
                                        <label>
                                                {{ f.label }}
                                                <input
                                                        :value="draft[f.key] ?? ''"
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
                                </template>
                                <template v-else>
                                        <span class="field-label">{{ f.label }}</span>
                                        <span class="field-value">{{ props.entity[f.key] ?? "—" }}</span>
                                </template>
                        </li>
                </ul>

                <div v-if="showSecurity" class="security-card">
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
                </div>
        </section>
</template>

<style scoped>
.profile-details {
        display: flex;
        flex-direction: column;
        gap: 1rem;
}

.field-list {
        list-style-type: none;
        display: flex;
        flex-flow: column;
        gap: 0.35rem;
        padding: 0;
        margin: 0;
}

.field-row {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
}

.field-row input {
        border: 1px solid rgba(15, 23, 42, 0.18);
        border-radius: 8px;
        padding: 0.5rem 0.75rem;
}

.field-label {
        color: rgba(15, 23, 42, 0.7);
        font-size: 0.9rem;
}

.field-value {
        font-weight: 600;
}

.security-card {
        margin-top: 0.5rem;
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
