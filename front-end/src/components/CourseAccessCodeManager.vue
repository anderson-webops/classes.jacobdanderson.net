<script setup lang="ts">
import type { CourseAccessCodeSummary } from "@/modules/courseAccessCodes";
import { computed, onMounted, ref, watch } from "vue";
import {
	createCourseAccessCode,
	fetchCourseAccessCodes,
	updateCourseAccessCode
} from "@/modules/courseAccessCodes";

interface CourseOption {
	id: string;
	name: string;
}

const props = defineProps<{
	courses: CourseOption[];
}>();

const codes = ref<CourseAccessCodeSummary[]>([]);
const selectedCourseID = ref("");
const label = ref("");
const newCode = ref("");
const error = ref("");
const success = ref("");
const loading = ref(true);
const submitting = ref(false);
const updatingCodeID = ref("");

const courseNameMap = computed(
	() =>
		new Map(props.courses.map(course => [course.id, course.name] as const))
);
const canCreate = computed(() => !!selectedCourseID.value && !submitting.value);

watch(
	() => props.courses,
	courseOptions => {
		if (
			!selectedCourseID.value ||
			!courseOptions.some(course => course.id === selectedCourseID.value)
		) {
			selectedCourseID.value = courseOptions[0]?.id ?? "";
		}
	},
	{ immediate: true }
);

async function loadCodes() {
	loading.value = true;
	error.value = "";
	try {
		codes.value = await fetchCourseAccessCodes();
	} catch (reason: any) {
		error.value =
			reason.response?.data?.message ??
			reason.message ??
			"Unable to load course codes.";
	} finally {
		loading.value = false;
	}
}

async function issueCode() {
	if (!canCreate.value) return;
	submitting.value = true;
	error.value = "";
	success.value = "";
	newCode.value = "";
	try {
		const created = await createCourseAccessCode({
			courseID: selectedCourseID.value,
			...(label.value.trim() ? { label: label.value.trim() } : {})
		});
		codes.value = [
			created.accessCode,
			...codes.value.filter(code => code._id !== created.accessCode._id)
		];
		newCode.value = created.code;
		label.value = "";
		success.value =
			"Code created. Copy it now; the full code cannot be recovered later, and only its final four characters will be shown for identification.";
	} catch (reason: any) {
		error.value =
			reason.response?.data?.message ??
			reason.message ??
			"Unable to create a course code.";
	} finally {
		submitting.value = false;
	}
}

async function copyNewCode() {
	if (!newCode.value) return;
	try {
		await navigator.clipboard.writeText(newCode.value);
		success.value = "Course code copied.";
	} catch {
		success.value = "Select and copy the displayed course code.";
	}
}

async function setCodeActive(
	accessCode: CourseAccessCodeSummary,
	active: boolean
) {
	updatingCodeID.value = accessCode._id;
	error.value = "";
	success.value = "";
	try {
		const updated = await updateCourseAccessCode(accessCode._id, {
			active
		});
		codes.value = codes.value.map(code =>
			code._id === updated._id ? updated : code
		);
		success.value = active
			? "Course code enabled."
			: "Course code disabled. Existing code sessions can no longer sync or reopen projects.";
	} catch (reason: any) {
		error.value =
			reason.response?.data?.message ??
			reason.message ??
			"Unable to update the course code.";
	} finally {
		updatingCodeID.value = "";
	}
}

onMounted(loadCodes);
</script>

<template>
	<section class="course-code-manager">
		<div class="manager-heading">
			<div>
				<p class="manager-eyebrow">Email-free classroom access</p>
				<h3>Course access codes</h3>
			</div>
			<p>
				Issue a code for one course. Learners use that code with a
				classroom username to reopen the course and their saved IDE
				projects without creating an email account.
			</p>
		</div>

		<form class="code-creation-form" @submit.prevent="issueCode">
			<label>
				<span>Course</span>
				<select v-model="selectedCourseID" :disabled="!courses.length">
					<option disabled value="">Choose a course</option>
					<option
						v-for="course in courses"
						:key="course.id"
						:value="course.id"
					>
						{{ course.name }}
					</option>
				</select>
			</label>
			<label>
				<span>Label <small>(optional)</small></span>
				<input
					v-model="label"
					maxlength="80"
					placeholder="Period 2 or July workshop"
				/>
			</label>
			<button
				class="manager-button is-primary"
				:disabled="!canCreate"
				type="submit"
			>
				{{ submitting ? "Creating…" : "Create code" }}
			</button>
		</form>

		<div v-if="newCode" class="new-code-panel" role="status">
			<div>
				<span>New course code</span>
				<strong>{{ newCode }}</strong>
			</div>
			<button class="manager-button" type="button" @click="copyNewCode">
				Copy code
			</button>
		</div>

		<p v-if="success" class="manager-status is-success" role="status">
			{{ success }}
		</p>
		<p v-if="error" class="manager-status is-error" role="alert">
			{{ error }}
		</p>

		<p v-if="loading" class="empty-copy" role="status">
			Loading course codes…
		</p>
		<p v-else-if="!courses.length" class="empty-copy">
			Enable at least one course before issuing a code.
		</p>
		<p v-else-if="!codes.length" class="empty-copy">
			No course codes have been created yet.
		</p>
		<div v-else class="code-list">
			<article
				v-for="accessCode in codes"
				:key="accessCode._id"
				class="code-card"
			>
				<div class="code-card-copy">
					<div class="code-card-title">
						<h4>{{ accessCode.label }}</h4>
						<span
							class="status-chip"
							:class="{ 'is-inactive': !accessCode.active }"
						>
							{{ accessCode.active ? "Active" : "Disabled" }}
						</span>
					</div>
					<p>
						{{
							courseNameMap.get(accessCode.courseID) ||
							accessCode.courseID
						}}
					</p>
					<p class="code-hint">
						Code ending in
						<strong>{{ accessCode.codeHint }}</strong> · Created by
						{{ accessCode.createdByName }}
					</p>
				</div>
				<button
					class="manager-button"
					:class="{ 'is-danger': accessCode.active }"
					:disabled="updatingCodeID === accessCode._id"
					type="button"
					@click="setCodeActive(accessCode, !accessCode.active)"
				>
					{{
						updatingCodeID === accessCode._id
							? "Updating…"
							: accessCode.active
								? "Disable"
								: "Enable"
					}}
				</button>
			</article>
		</div>

		<p class="privacy-note">
			Anyone who knows both the code and a username can reopen that
			username’s workspace. Use separate codes when stronger separation is
			needed, and disable a code when the class ends.
		</p>
	</section>
</template>

<style scoped>
.course-code-manager {
	--manager-accent: #0f766e;
	--manager-border: rgba(148, 163, 184, 0.3);
	--manager-border-strong: #cbd5e1;
	--manager-card-border: #d8e3ed;
	--manager-danger-border: #fecaca;
	--manager-danger-text: #b42318;
	--manager-error-surface: #fef2f2;
	--manager-error-text: #b42318;
	--manager-ink: #10263a;
	--manager-ink-muted: #64748b;
	--manager-ink-soft: #526779;
	--manager-new-code-border: #5eead4;
	--manager-new-code-surface: #f0fdfa;
	--manager-primary-border: #0f766e;
	--manager-primary-surface: #0f766e;
	--manager-primary-text: #fff;
	--manager-shadow: 0 24px 55px -44px rgba(15, 23, 42, 0.45);
	--manager-status-active-surface: #d1fae5;
	--manager-status-inactive-surface: #e2e8f0;
	--manager-status-inactive-text: #475569;
	--manager-success-surface: #ecfdf5;
	--manager-success-text: #166534;
	--manager-surface: rgba(255, 255, 255, 0.88);
	--manager-surface-muted: #f8fafc;
	--manager-surface-strong: #fff;
	display: grid;
	gap: 1.2rem;
	padding: clamp(1.35rem, 2.1vw, 1.8rem);
	border: 1px solid var(--manager-border);
	border-radius: 26px;
	background: var(--manager-surface);
	box-shadow: var(--manager-shadow);
	color: var(--manager-ink);
}

:global(html.dark .course-code-manager) {
	--manager-accent: var(--color-accent);
	--manager-border: var(--color-border);
	--manager-border-strong: var(--color-border-strong);
	--manager-card-border: var(--color-border);
	--manager-danger-border: var(--color-error-border);
	--manager-danger-text: var(--color-error-text);
	--manager-error-surface: var(--color-error-surface);
	--manager-error-text: var(--color-error-text);
	--manager-ink: var(--color-ink);
	--manager-ink-muted: var(--color-ink-muted);
	--manager-ink-soft: var(--color-ink-soft);
	--manager-new-code-border: rgba(94, 234, 212, 0.34);
	--manager-new-code-surface: var(--color-surface-muted);
	--manager-primary-border: rgba(125, 199, 255, 0.42);
	--manager-primary-surface: #1f6fa6;
	--manager-primary-text: var(--color-button-primary-text);
	--manager-shadow: 0 28px 58px -40px rgba(0, 0, 0, 0.74);
	--manager-status-active-surface: var(--color-success-surface);
	--manager-status-inactive-surface: var(--color-surface-inset);
	--manager-status-inactive-text: var(--color-ink-soft);
	--manager-success-surface: var(--color-success-surface);
	--manager-success-text: var(--color-success-text);
	--manager-surface: var(--color-surface);
	--manager-surface-muted: var(--color-surface-muted);
	--manager-surface-strong: var(--color-surface-strong);
}

.manager-heading {
	display: grid;
	grid-template-columns: minmax(0, 0.8fr) minmax(18rem, 1.2fr);
	gap: 1rem 2rem;
}

.manager-heading > div,
.code-card-copy {
	display: grid;
	gap: 0.4rem;
}

.manager-eyebrow {
	margin: 0;
	font-size: 0.78rem;
	font-weight: 700;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: var(--manager-accent);
}

.manager-heading h3,
.manager-heading p,
.code-card h4,
.code-card p,
.privacy-note,
.empty-copy {
	margin: 0;
}

.manager-heading h3 {
	font-size: clamp(1.65rem, 2.8vw, 2.2rem);
}

.manager-heading > p,
.privacy-note,
.empty-copy,
.code-card p {
	color: var(--manager-ink-soft);
	line-height: 1.6;
}

.code-creation-form {
	display: grid;
	grid-template-columns: minmax(14rem, 1fr) minmax(14rem, 1fr) auto;
	align-items: end;
	gap: 1rem;
}

.code-creation-form label {
	display: grid;
	gap: 0.45rem;
	font-weight: 650;
}

.code-creation-form small {
	font-weight: 500;
	color: var(--manager-ink-muted);
}

.code-creation-form input,
.code-creation-form select {
	width: 100%;
	min-height: 2.8rem;
	padding: 0.7rem 0.85rem;
	border: 1px solid var(--manager-border-strong);
	border-radius: 12px;
	background: var(--manager-surface-strong);
	color: var(--manager-ink);
}

.manager-button {
	min-height: 2.75rem;
	padding: 0.65rem 1rem;
	border: 1px solid var(--manager-border-strong);
	border-radius: 12px;
	background: var(--manager-surface-strong);
	color: var(--manager-ink);
	font-weight: 700;
}

.manager-button.is-primary {
	border-color: var(--manager-primary-border);
	background: var(--manager-primary-surface);
	color: var(--manager-primary-text);
}

.manager-button.is-danger {
	border-color: var(--manager-danger-border);
	color: var(--manager-danger-text);
}

.manager-button:disabled {
	cursor: not-allowed;
	opacity: 0.55;
}

.new-code-panel,
.code-card,
.code-card-title {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
}

.new-code-panel {
	flex-wrap: wrap;
	padding: 1rem;
	border: 1px solid var(--manager-new-code-border);
	border-radius: 16px;
	background: var(--manager-new-code-surface);
}

.new-code-panel > div {
	display: grid;
	gap: 0.3rem;
}

.new-code-panel span {
	color: var(--manager-ink-soft);
	font-size: 0.84rem;
}

.new-code-panel strong {
	font-family:
		ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	font-size: clamp(1.2rem, 3vw, 1.65rem);
	letter-spacing: 0.08em;
}

.manager-status {
	margin: 0;
	padding: 0.75rem 0.9rem;
	border-radius: 12px;
}

.manager-status.is-success {
	background: var(--manager-success-surface);
	color: var(--manager-success-text);
}

.manager-status.is-error {
	background: var(--manager-error-surface);
	color: var(--manager-error-text);
}

.code-list {
	display: grid;
	gap: 0.75rem;
}

.code-card {
	padding: 1rem;
	border: 1px solid var(--manager-card-border);
	border-radius: 16px;
	background: var(--manager-surface-muted);
}

.code-card-title {
	justify-content: flex-start;
	flex-wrap: wrap;
}

.code-card h4 {
	font-size: 1.05rem;
}

.code-hint {
	font-size: 0.88rem;
}

.status-chip {
	padding: 0.25rem 0.55rem;
	border-radius: 999px;
	background: var(--manager-status-active-surface);
	color: var(--manager-success-text);
	font-size: 0.75rem;
	font-weight: 700;
}

.status-chip.is-inactive {
	background: var(--manager-status-inactive-surface);
	color: var(--manager-status-inactive-text);
}

.privacy-note {
	padding-top: 0.2rem;
	font-size: 0.9rem;
}

@media (max-width: 900px) {
	.manager-heading,
	.code-creation-form {
		grid-template-columns: 1fr;
	}

	.code-creation-form .manager-button {
		width: 100%;
	}
}

@media (max-width: 620px) {
	.code-card {
		align-items: stretch;
		flex-direction: column;
	}
}
</style>
