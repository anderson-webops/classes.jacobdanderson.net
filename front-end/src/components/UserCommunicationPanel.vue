<script lang="ts" setup>
import DOMPurify from "dompurify";
import { marked } from "marked";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { api } from "@/api";
import WorkspaceViewToggle from "@/components/WorkspaceViewToggle.vue";
import { useAppStore } from "@/stores/app";

marked.setOptions({ breaks: true, gfm: true });

interface SessionNoteRecord {
	_id: string;
	studentName: string;
	primaryEmail: string;
	ccEmails: string[];
	subject: string;
	sessionDate: string;
	markdown: string;
	createdAt: string;
}

interface InternalEmailRecord {
	_id: string;
	matchedRecipientEmail: string;
	primaryEmail: string;
	ccEmails: string[];
	fromAddress: string;
	subject: string;
	markdown: string;
	transportUsed: "primary-local" | "fallback-gmail";
	sentAt: string;
}

interface ScheduledSessionRecord {
	_id: string;
	title: string;
	startAt: string;
	endAt: string;
	timezone: string;
	status: "scheduled" | "cancelled" | "completed" | "rescheduled";
	notes: string | null;
}

interface UserCommunicationsResponse {
	sessionNotes: SessionNoteRecord[];
	internalEmails: InternalEmailRecord[];
	scheduledSessions: ScheduledSessionRecord[];
}

const app = useAppStore();
const { currentUser } = storeToRefs(app);

const loading = ref(false);
const error = ref("");
const sessionNotes = ref<SessionNoteRecord[]>([]);
const internalEmails = ref<InternalEmailRecord[]>([]);
const scheduledSessions = ref<ScheduledSessionRecord[]>([]);

const view = ref("notes");
const viewOptions = [
	{ value: "notes", label: "Notes" },
	{ value: "schedule", label: "Schedule" },
	{ value: "messages", label: "Messages" }
];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric",
	timeZone: "UTC"
});

const timestampFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric",
	hour: "numeric",
	minute: "2-digit"
});

function formatDate(value: string) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return value;
	}
	return dateFormatter.format(date);
}

function formatTimestamp(value: string) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return value;
	}
	return timestampFormatter.format(date);
}

function formatDateTimeRange(session: ScheduledSessionRecord) {
	const start = new Date(session.startAt);
	const end = new Date(session.endAt);
	if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
		return `${session.startAt} - ${session.endAt}`;
	}

	return `${timestampFormatter.format(start)} - ${end.toLocaleTimeString(
		"en-US",
		{
			hour: "numeric",
			minute: "2-digit"
		}
	)}`;
}

function renderMarkdown(markdown: string) {
	const rendered = marked.parse(markdown);
	if (typeof rendered !== "string") {
		return "";
	}
	return DOMPurify.sanitize(rendered);
}

function describeEmailDelivery(email: InternalEmailRecord) {
	if (email.matchedRecipientEmail === email.primaryEmail) {
		return `Sent to ${email.primaryEmail}`;
	}

	return `Sent to ${email.matchedRecipientEmail} via CC on ${email.primaryEmail}`;
}

let loadRun = 0;
async function loadCommunications() {
	const run = ++loadRun;
	const userId = currentUser.value?._id;
	sessionNotes.value = [];
	internalEmails.value = [];
	scheduledSessions.value = [];
	if (!currentUser.value?._id) {
		sessionNotes.value = [];
		internalEmails.value = [];
		scheduledSessions.value = [];
		return;
	}

	loading.value = true;
	error.value = "";

	try {
		const { data } = await api.get<UserCommunicationsResponse>(
			"/users/loggedin/communications"
		);
		if (run !== loadRun || currentUser.value?._id !== userId) return;
		sessionNotes.value = data.sessionNotes ?? [];
		internalEmails.value = data.internalEmails ?? [];
		scheduledSessions.value = data.scheduledSessions ?? [];
	} catch (err: any) {
		if (run !== loadRun || currentUser.value?._id !== userId) return;
		error.value =
			err.response?.data?.message ??
			err.message ??
			"Unable to load communication history.";
		sessionNotes.value = [];
		internalEmails.value = [];
		scheduledSessions.value = [];
	} finally {
		if (run === loadRun) loading.value = false;
	}
}

watch(
	() => currentUser.value?._id ?? "",
	async userID => {
		if (!userID) {
			++loadRun;
			sessionNotes.value = [];
			internalEmails.value = [];
			scheduledSessions.value = [];
			error.value = "";
			return;
		}

		await loadCommunications();
	},
	{ immediate: true }
);
</script>

<template>
	<section class="history-section">
		<WorkspaceViewToggle
			v-model="view"
			label="Class history"
			:options="viewOptions"
		/>
		<div class="history-grid">
			<section v-show="view === 'schedule'" class="history-panel">
				<div class="panel-heading">
					<div>
						<p class="panel-eyebrow">Schedule</p>
						<h4>Upcoming sessions</h4>
					</div>
					<span class="count-pill">{{
						scheduledSessions.length
					}}</span>
				</div>

				<p v-if="loading" class="empty-copy">
					Loading upcoming sessions…
				</p>
				<p v-else-if="error" class="error-copy">{{ error }}</p>
				<p
					v-else-if="scheduledSessions.length === 0"
					class="empty-copy"
				>
					No upcoming classes recorded.
				</p>
				<div v-else class="record-list">
					<article
						v-for="session in scheduledSessions"
						:key="session._id"
						class="record-card is-static"
					>
						<div class="record-summary">
							<div>
								<p class="record-kicker">
									{{ formatDateTimeRange(session) }}
								</p>
								<h5>{{ session.title }}</h5>
								<p class="record-subcopy">
									{{ session.status }} -
									{{ session.timezone }}
								</p>
							</div>
						</div>
						<div v-if="session.notes" class="record-meta">
							{{ session.notes }}
						</div>
					</article>
				</div>
			</section>

			<section v-show="view === 'notes'" class="history-panel">
				<div class="panel-heading">
					<div>
						<p class="panel-eyebrow">Session notes</p>
						<h4>Recent notes</h4>
					</div>
					<span class="count-pill">{{ sessionNotes.length }}</span>
				</div>

				<p v-if="loading" class="empty-copy">Loading recent notes…</p>
				<p v-else-if="error" class="error-copy">{{ error }}</p>
				<p v-else-if="sessionNotes.length === 0" class="empty-copy">
					No saved notes.
				</p>
				<div v-else class="record-list">
					<details
						v-for="note in sessionNotes"
						:key="note._id"
						class="record-card"
					>
						<summary class="record-summary">
							<div>
								<p class="record-kicker">
									{{ formatDate(note.sessionDate) }}
								</p>
								<h5>{{ note.subject }}</h5>
							</div>
							<span class="record-action">Open</span>
						</summary>
						<div class="record-meta">
							Saved {{ formatTimestamp(note.createdAt) }}
						</div>
						<div
							class="record-body"
							v-html="renderMarkdown(note.markdown)"
						/>
					</details>
				</div>
			</section>

			<section v-show="view === 'messages'" class="history-panel">
				<div class="panel-heading">
					<div>
						<p class="panel-eyebrow">Internal emails</p>
						<h4>Saved messages</h4>
					</div>
					<span class="count-pill">{{ internalEmails.length }}</span>
				</div>

				<p v-if="loading" class="empty-copy">
					Loading saved internal emails…
				</p>
				<p v-else-if="error" class="error-copy">{{ error }}</p>
				<p v-else-if="internalEmails.length === 0" class="empty-copy">
					No saved messages.
				</p>
				<div v-else class="record-list">
					<details
						v-for="email in internalEmails"
						:key="email._id"
						class="record-card"
					>
						<summary class="record-summary">
							<div>
								<p class="record-kicker">
									Sent {{ formatTimestamp(email.sentAt) }}
								</p>
								<h5>{{ email.subject }}</h5>
								<p class="record-subcopy">
									{{ describeEmailDelivery(email) }}
								</p>
							</div>
							<span class="record-action">Open</span>
						</summary>
						<div class="record-meta">
							From {{ email.fromAddress }}
						</div>
						<div
							class="record-body"
							v-html="renderMarkdown(email.markdown)"
						/>
					</details>
				</div>
			</section>
		</div>
	</section>
</template>

<style scoped>
.history-section {
	display: grid;
	gap: 1rem;
	width: 100%;
	min-width: 0;
	margin: 0;
	color: var(--color-ink);
}
.history-grid {
	min-width: 0;
}
.history-panel {
	min-width: 0;
	margin: 0;
}
.panel-heading {
	margin-bottom: 0.75rem;
}
.panel-heading h4 {
	font: 600 1.1rem var(--font-sans);
	margin: 0;
	color: var(--color-ink);
}
.panel-eyebrow,
.count-pill {
	display: none;
}
.record-list {
	display: grid;
	gap: 0.5rem;
}
.record-card {
	border: 1px solid var(--color-border);
	border-radius: var(--radius-sm);
	background: var(--color-surface);
}
.record-summary {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
	padding: 0.75rem 1rem;
	cursor: pointer;
}
.record-summary > div {
	min-width: 0;
}
.record-summary h5 {
	font: 600 1rem var(--font-sans);
	color: var(--color-ink);
	margin: 0.25rem 0;
	overflow-wrap: anywhere;
}
.record-kicker,
.record-subcopy,
.record-meta {
	font-size: 0.9rem;
	color: var(--color-ink-soft);
	margin: 0;
}
.record-action {
	color: var(--color-accent);
	font-size: 0.9rem;
}
.record-meta {
	padding: 0 1rem 0.75rem;
}
.record-body {
	padding: 0 1rem 1rem;
	overflow-wrap: anywhere;
}
.record-body :deep(ul),
.record-body :deep(ol) {
	margin: 0.75em 0 0.75em 0.25rem;
	padding-inline-start: 1.65rem;
	list-style-position: outside;
}
.record-body :deep(li) {
	padding-inline-start: 0.25rem;
}
.record-body :deep(pre) {
	max-width: 100%;
	overflow: auto;
}
.empty-copy {
	color: var(--color-ink-soft);
	margin: 0.75rem 0;
}
.error-copy {
	color: var(--color-danger, #b91c1c);
}
</style>
