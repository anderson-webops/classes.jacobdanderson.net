<script lang="ts" setup>
import type {
	ManagedPythonIdeProject,
	PythonIdeFile,
	PythonIdeProject,
	PythonIdeProjectReview
} from "@/modules/pythonIde";
import { computed, ref, watch } from "vue";
import {
	createPythonIdeProjectReview,
	fetchManagedPythonIdeProjects,
	isPythonIdeBinaryAssetFile,
	updatePythonIdeProjectReview
} from "@/modules/pythonIde";

const props = defineProps<{
	userId: string;
	userName: string;
	userEmail: string;
}>();

const opened = ref(false);
const loaded = ref(false);
const loading = ref(false);
const saving = ref(false);
const error = ref("");
const success = ref("");
const records = ref<ManagedPythonIdeProject[]>([]);
const selectedProjectID = ref("");
const selectedFileName = ref("");
const editFileContent = ref("");
const noteDraft = ref("");
const visibleDraft = ref(false);

const selectedRecord = computed(
	() =>
		records.value.find(
			record => record.project._id === selectedProjectID.value
		) ??
		records.value[0] ??
		null
);
const selectedProject = computed(() => selectedRecord.value?.project ?? null);
const selectedReview = computed(() => selectedRecord.value?.review ?? null);
const selectedStudentFile = computed(() =>
	selectedProject.value?.files.find(
		file => file.name === selectedFileName.value
	)
);
const selectedReviewFile = computed(() =>
	selectedReview.value?.files.find(
		file => file.name === selectedFileName.value
	)
);
const projectCountLabel = computed(
	() =>
		`${records.value.length} project${records.value.length === 1 ? "" : "s"}`
);
const fileNames = computed(() => {
	const names = new Set<string>();
	for (const file of selectedProject.value?.files ?? []) names.add(file.name);
	for (const file of selectedReview.value?.files ?? []) names.add(file.name);
	return [...names];
});
const canEditSelectedFile = computed(() => {
	if (!selectedReview.value || !selectedFileName.value) return false;
	const file = selectedReviewFile.value ?? selectedStudentFile.value;
	return !!file && !isPythonIdeBinaryAssetFile(file);
});
const sourceIsNewer = computed(() => {
	const reviewSourceUpdated = selectedReview.value?.sourceUpdatedAt;
	const projectUpdated = selectedProject.value?.updatedAt;
	if (!reviewSourceUpdated || !projectUpdated) return false;
	return (
		new Date(projectUpdated).getTime() >
		new Date(reviewSourceUpdated).getTime()
	);
});

function formatDate(value: string | undefined) {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;

	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit"
	}).format(date);
}

function projectLabel(project: PythonIdeProject) {
	return project.courseProjectTitle || project.title;
}

function filePreview(file: PythonIdeFile | undefined) {
	if (!file) return "";
	if (isPythonIdeBinaryAssetFile(file)) return `[Binary asset: ${file.name}]`;
	return file.content;
}

function replaceRecord(
	project: PythonIdeProject,
	review: PythonIdeProjectReview
) {
	records.value = records.value.map(record =>
		record.project._id === project._id ? { project, review } : record
	);
}

function selectDefaultFile(record: ManagedPythonIdeProject | null) {
	const activeFileName =
		record?.review?.activeFileName ||
		record?.project.activeFileName ||
		record?.project.files[0]?.name ||
		"";
	selectedFileName.value = activeFileName;
}

function syncDrafts() {
	const review = selectedReview.value;
	noteDraft.value = review?.note ?? "";
	visibleDraft.value = !!review?.visibleToStudent;
	editFileContent.value = filePreview(
		selectedReviewFile.value ?? selectedStudentFile.value
	);
}

async function loadProjectReviews() {
	if (!props.userId) return;

	loading.value = true;
	error.value = "";

	try {
		records.value = await fetchManagedPythonIdeProjects(props.userId);
		if (
			!selectedProjectID.value ||
			!records.value.some(
				record => record.project._id === selectedProjectID.value
			)
		) {
			selectedProjectID.value = records.value[0]?.project._id ?? "";
			selectDefaultFile(selectedRecord.value);
		}
		loaded.value = true;
	} catch (err: any) {
		error.value =
			err.response?.data?.message ??
			err.message ??
			"Unable to load saved Python projects.";
		records.value = [];
	} finally {
		loading.value = false;
	}
}

async function onToggle(event: Event) {
	opened.value = (event.target as HTMLDetailsElement).open;
	if (opened.value && !loaded.value && !loading.value)
		await loadProjectReviews();
}

async function createReviewCopy() {
	const project = selectedProject.value;
	if (!project) return;

	saving.value = true;
	error.value = "";
	success.value = "";

	try {
		const { project: savedProject, review } =
			await createPythonIdeProjectReview(props.userId, project._id);
		replaceRecord(savedProject, review);
		selectedProjectID.value = savedProject._id;
		selectedFileName.value = review.activeFileName;
		success.value = "Staff review copy created.";
	} catch (err: any) {
		error.value =
			err.response?.data?.message ??
			err.message ??
			"Unable to create the staff review copy.";
	} finally {
		saving.value = false;
	}
}

function reviewFilesForSave() {
	const review = selectedReview.value;
	if (!review) return [];

	const files = review.files.map(file => ({ ...file }));
	if (!canEditSelectedFile.value || !selectedFileName.value) return files;

	const existingIndex = files.findIndex(
		file => file.name === selectedFileName.value
	);
	const baseFile = selectedReviewFile.value ?? selectedStudentFile.value;
	if (!baseFile) return files;

	const nextFile = {
		...baseFile,
		content: editFileContent.value,
		encoding: baseFile.encoding ?? "text",
		name: selectedFileName.value
	} satisfies PythonIdeFile;

	if (existingIndex >= 0) files.splice(existingIndex, 1, nextFile);
	else files.push(nextFile);

	return files;
}

async function saveReviewCopy() {
	const project = selectedProject.value;
	const review = selectedReview.value;
	if (!project || !review) return;

	saving.value = true;
	error.value = "";
	success.value = "";

	try {
		const { project: savedProject, review: savedReview } =
			await updatePythonIdeProjectReview(
				props.userId,
				project._id,
				review._id,
				{
					activeFileName:
						selectedFileName.value || review.activeFileName,
					files: reviewFilesForSave(),
					note: noteDraft.value,
					visibleToStudent: visibleDraft.value
				}
			);
		replaceRecord(savedProject, savedReview);
		success.value = savedReview.visibleToStudent
			? "Review copy saved and visible to the learner."
			: "Review copy saved.";
	} catch (err: any) {
		error.value =
			err.response?.data?.message ??
			err.message ??
			"Unable to save the review copy.";
	} finally {
		saving.value = false;
	}
}

function resetFileFromStudent() {
	editFileContent.value = filePreview(selectedStudentFile.value);
}

watch(selectedProjectID, () => {
	selectDefaultFile(selectedRecord.value);
});

watch([selectedReview, selectedFileName], syncDrafts, { immediate: true });
</script>

<template>
	<details class="code-review-tools" @toggle="onToggle">
		<summary class="tools-summary">
			<span>
				<strong>Code review</strong>
				<small>{{ userName }} - {{ userEmail }}</small>
			</span>
			<span v-if="loaded" class="summary-count">
				{{ projectCountLabel }}
			</span>
		</summary>

		<div class="tools-body">
			<p v-if="loading" class="muted-copy">
				Loading saved Python projects...
			</p>
			<p v-if="error" class="error-copy" role="alert">{{ error }}</p>
			<p
				v-if="success"
				class="success-copy"
				role="status"
				aria-live="polite"
			>
				{{ success }}
			</p>

			<p v-if="loaded && records.length === 0" class="muted-copy">
				No synced Python IDE projects are available for this learner
				yet.
			</p>

			<div v-else-if="selectedProject" class="review-workspace">
				<div class="review-controls">
					<label>
						Project
						<select v-model="selectedProjectID">
							<option
								v-for="record in records"
								:key="record.project._id"
								:value="record.project._id"
							>
								{{ projectLabel(record.project) }}
							</option>
						</select>
					</label>
					<button
						v-if="!selectedReview"
						class="btn-primary btn"
						:disabled="saving"
						type="button"
						@click="createReviewCopy"
					>
						Create staff copy
					</button>
				</div>

				<div class="project-meta">
					<span>{{ selectedProject.mode }}</span>
					<span v-if="selectedProject.courseID">
						{{ selectedProject.courseID }}
					</span>
					<span
						>Student saved
						{{ formatDate(selectedProject.updatedAt) }}</span
					>
					<span v-if="selectedReview">
						Review saved {{ formatDate(selectedReview.updatedAt) }}
					</span>
					<span v-if="sourceIsNewer" class="is-warning">
						Student code changed after the review copy was created
					</span>
				</div>

				<div v-if="selectedReview" class="review-options">
					<label class="visibility-toggle">
						<input v-model="visibleDraft" type="checkbox" />
						Visible to learner
					</label>
					<label>
						Review note
						<textarea
							v-model="noteDraft"
							rows="3"
							placeholder="Optional summary for the learner"
						/>
					</label>
				</div>

				<label class="file-select">
					File
					<select v-model="selectedFileName">
						<option
							v-for="fileName in fileNames"
							:key="fileName"
							:value="fileName"
						>
							{{ fileName }}
						</option>
					</select>
				</label>

				<div class="code-review-grid">
					<section class="code-pane">
						<header>
							<p>Student current</p>
							<small>{{
								selectedStudentFile?.name || "No file"
							}}</small>
						</header>
						<pre
							v-if="selectedStudentFile"
						><code>{{ filePreview(selectedStudentFile) }}</code></pre>
						<p v-else class="muted-copy">
							This file is not in the student's current project.
						</p>
					</section>

					<section class="code-pane">
						<header>
							<p>Staff review copy</p>
							<small>
								{{
									selectedReview
										? selectedReviewFile?.name ||
											selectedFileName
										: "No staff copy yet"
								}}
							</small>
						</header>
						<textarea
							v-if="canEditSelectedFile"
							v-model="editFileContent"
							aria-label="Edit staff review copy"
							spellcheck="false"
						/>
						<pre
							v-else-if="selectedReviewFile"
						><code>{{ filePreview(selectedReviewFile) }}</code></pre>
						<p v-else class="muted-copy">
							Create a staff copy before adding code comments or
							changes.
						</p>
					</section>
				</div>

				<div v-if="selectedReview" class="action-row">
					<button
						class="btn-secondary btn"
						:disabled="
							saving ||
							!selectedStudentFile ||
							!canEditSelectedFile
						"
						type="button"
						@click="resetFileFromStudent"
					>
						Reset file from student
					</button>
					<button
						class="btn-primary btn"
						:disabled="saving"
						type="button"
						@click="saveReviewCopy"
					>
						{{ saving ? "Saving..." : "Save review copy" }}
					</button>
				</div>
			</div>
		</div>
	</details>
</template>

<style scoped>
.code-review-tools {
	margin-top: 1rem;
	border-radius: 18px;
	background: rgba(248, 250, 252, 0.8);
	box-shadow: inset 0 0 0 1px rgba(203, 213, 225, 0.7);
}

.tools-summary {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding: 1rem 1.1rem;
	cursor: pointer;
	list-style: none;
	min-width: 0;
	max-width: 100%;
}

.tools-summary::-webkit-details-marker {
	display: none;
}

.tools-summary span:first-child {
	display: grid;
	gap: 0.2rem;
	min-width: 0;
}

.tools-summary strong {
	color: #10263a;
}

.tools-summary small,
.summary-count,
.muted-copy,
.project-meta,
.code-pane small {
	color: #526779;
	overflow-wrap: anywhere;
}

.summary-count {
	font-size: 0.8rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.08em;
}

.tools-body {
	display: grid;
	gap: 1rem;
	padding: 0 1.1rem 1.1rem;
}

.review-workspace,
.review-options {
	display: grid;
	gap: 1rem;
}

.review-controls,
.action-row {
	display: flex;
	flex-wrap: wrap;
	align-items: end;
	justify-content: space-between;
	gap: 0.8rem;
}

.review-controls label,
.review-options label,
.file-select {
	display: grid;
	gap: 0.35rem;
	font-size: 0.82rem;
	font-weight: 700;
	color: #10263a;
}

.review-controls label {
	min-width: min(100%, 18rem);
	flex: 1;
}

.review-controls select,
.review-options textarea,
.file-select select,
.code-pane textarea {
	width: 100%;
	box-sizing: border-box;
	border: 1px solid #cbd5e1;
	border-radius: 12px;
	background: #fff;
	color: #10263a;
	font: inherit;
}

.review-controls select,
.file-select select {
	padding: 0.65rem 0.75rem;
}

.review-options textarea {
	min-height: 5rem;
	padding: 0.75rem;
	line-height: 1.5;
	resize: vertical;
}

.visibility-toggle {
	display: flex !important;
	grid-template-columns: auto 1fr;
	align-items: center;
	width: fit-content;
}

.project-meta {
	display: flex;
	flex-wrap: wrap;
	gap: 0.45rem;
	font-size: 0.82rem;
}

.project-meta span {
	padding: 0.25rem 0.5rem;
	border-radius: 999px;
	background: rgba(226, 232, 240, 0.85);
}

.project-meta .is-warning {
	background: #fef3c7;
	color: #92400e;
}

.code-review-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 1rem;
}

.code-pane {
	min-width: 0;
	display: grid;
	gap: 0.6rem;
	align-content: start;
}

.code-pane header {
	display: flex;
	justify-content: space-between;
	gap: 0.75rem;
}

.code-pane header p {
	margin: 0;
	font-weight: 800;
	color: #10263a;
}

.code-pane pre,
.code-pane textarea {
	min-height: 18rem;
	max-height: 32rem;
	margin: 0;
	padding: 0.9rem;
	overflow: auto;
	border-radius: 14px;
	background: #0f172a;
	color: #e2e8f0;
	font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
	font-size: 0.82rem;
	line-height: 1.55;
	white-space: pre;
	tab-size: 4;
}

.code-pane textarea {
	border: 1px solid #334155;
	resize: vertical;
}

.error-copy,
.success-copy,
.muted-copy {
	margin: 0;
	line-height: 1.55;
}

.error-copy {
	color: #b42318;
}

.success-copy {
	color: #0f766e;
}

@media (max-width: 860px) {
	.code-review-grid {
		grid-template-columns: 1fr;
	}
}
</style>
