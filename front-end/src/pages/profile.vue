<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, defineAsyncComponent, onMounted, ref } from "vue";
import { hasCourseCodeEntry } from "@/modules/authEntryPolicy";
import { useAppStore } from "@/stores/app";

defineOptions({ name: "ProfilePage" });

const AdminProfile = defineAsyncComponent(
	() => import("@/components/AdminProfile.vue")
);
const TutorProfile = defineAsyncComponent(
	() => import("@/components/TutorProfile.vue")
);
const UserProfile = defineAsyncComponent(
	() => import("@/components/UserProfile.vue")
);

const app = useAppStore();
const courseCodeEntry = ref(false);
onMounted(() => {
	courseCodeEntry.value = hasCourseCodeEntry(window.location.origin);
});
const { currentAdmin, currentCourseLearner, currentTutor, currentUser } =
	storeToRefs(app);

const activeProfileComponent = computed(() => {
	if (currentAdmin.value) return AdminProfile;
	if (currentTutor.value) return TutorProfile;
	if (currentUser.value) return UserProfile;
	return null;
});

const profileRole = computed(() => {
	if (currentAdmin.value) return "Administrator";
	if (currentTutor.value) return "Tutor";
	if (currentUser.value) return "Student";
	if (currentCourseLearner.value) return "Classroom";
	return null;
});

const hasProfile = computed(() => activeProfileComponent.value !== null);
const isWorkspaceLayout = computed(() => hasProfile.value);

const heroTitle = computed(() =>
	currentCourseLearner.value ? "Classroom workspace" : "Account Settings"
);

const profileComponentProps = computed(() => {
	if (currentAdmin.value) {
		return { mode: "account" };
	}
	if (currentTutor.value) {
		return { mode: "account" };
	}
	return {};
});

function openAuthModal() {
	app.setLoginBlock(true);
}

function leaveClassroom() {
	void app.logout();
}
</script>

<template>
	<section
		class="profile-page"
		:class="{ 'is-workspace-layout': isWorkspaceLayout }"
	>
		<div
			class="profile-content"
			:class="{ 'is-workspace-layout': isWorkspaceLayout }"
		>
			<header
				class="profile-header"
				:class="{ 'is-workspace-layout': isWorkspaceLayout }"
			>
				<span v-if="profileRole" class="profile-badge">{{
					profileRole
				}}</span>
				<h1>{{ heroTitle }}</h1>
			</header>

			<div
				v-if="hasProfile"
				class="profile-card"
				:class="{ 'is-workspace-layout': isWorkspaceLayout }"
			>
				<component
					:is="activeProfileComponent"
					v-bind="profileComponentProps"
				/>
			</div>

			<div v-else class="profile-empty">
				<div v-if="currentCourseLearner" class="empty-card">
					<h2>Email-free classroom access</h2>
					<p>
						Your course and saved IDE projects are connected to
						<strong>{{ currentCourseLearner.username }}</strong>
						under this classroom code.
					</p>
					<div class="profile-actions">
						<RouterLink class="action primary" to="/courses">
							Open course
						</RouterLink>
						<RouterLink class="action secondary" to="/ide">
							Open IDE
						</RouterLink>
						<button
							class="action secondary"
							type="button"
							@click="leaveClassroom"
						>
							Leave classroom
						</button>
					</div>
				</div>
				<div v-else class="empty-card">
					<h2>Log in to your account</h2>
					<p>Manage your profile and view your class notes.</p>
					<div class="profile-actions">
						<button
							class="action primary"
							type="button"
							@click="openAuthModal"
						>
							Log in
						</button>
						<button
							class="action secondary"
							type="button"
							@click="app.setSignupBlock(true)"
						>
							Create an account
						</button>
						<RouterLink
							v-if="courseCodeEntry"
							class="action secondary"
							to="/courses#classroom-access"
							>Use a classroom code</RouterLink
						>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped>
.profile-page {
	padding: 1rem 1rem 2rem;
	color: var(--color-ink);
}
.profile-content {
	width: min(1180px, 100%);
	margin: 0 auto;
	display: grid;
	gap: 1rem;
	min-width: 0;
}
.profile-header {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.5rem 0.75rem;
}
.profile-header h1 {
	margin: 0;
	font-size: 1.5rem;
	order: -1;
}
.profile-badge {
	margin-left: auto;
	color: var(--color-ink-soft);
	font-size: 0.8rem;
}
.profile-card,
.profile-empty {
	min-width: 0;
}
.empty-card {
	max-width: 38rem;
	padding: 1rem;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-sm);
	background: var(--color-surface);
}
.empty-card h2 {
	margin: 0 0 0.75rem;
	font-size: 1.15rem;
}
.empty-card p {
	margin: 0 0 1rem;
	color: var(--color-ink-soft);
	line-height: 1.6;
}
.profile-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}
.action {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.5rem 0.8rem;
	border-radius: var(--radius-sm);
	border: 1px solid var(--color-border);
	background: var(--color-surface);
	color: var(--color-ink);
	font: inherit;
	text-decoration: none;
	cursor: pointer;
}
.action.primary {
	background: var(--color-button-primary-bg);
	color: var(--color-button-primary-text);
}
.action:focus-visible {
	outline: 2px solid var(--color-accent);
	outline-offset: 2px;
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
