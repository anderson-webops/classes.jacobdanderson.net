<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { api } from "@/api";

const props = defineProps<{
	studentId: string;
	studentName: string;
	classDate: string;
	markdown: string;
	editorId: string;
	disabled?: boolean;
}>();
const emit = defineEmits<{
	generated: [markdown: string];
	busy: [value: boolean];
}>();
interface Candidate {
	selectionToken: string;
	startAt: string;
	timezone: string;
}
const available = ref(false);
const ready = ref(false);
const busy = ref(false);
const message = ref("");
const error = ref("");
const meetingId = ref("2543520025");
const requestMeeting = ref(false);
const candidates = ref<Candidate[]>([]);
const selectionToken = ref("");
const confirmedStudent = ref(false);
const confirmReplace = ref(false);
let replacementApproved = false;
let requestVersion = 0;
let controller: AbortController | undefined;
let disposed = false;

const canGenerate = computed(
	() =>
		!!props.studentId &&
		/^\d{4}-\d{2}-\d{2}$/.test(props.classDate) &&
		!props.disabled &&
		!busy.value &&
		(!candidates.value.length ||
			(!!selectionToken.value && confirmedStudent.value))
);

function setBusy(value: boolean) {
	busy.value = value;
	emit("busy", value);
}

function cancel() {
	requestVersion++;
	controller?.abort();
	setBusy(false);
}

function reset() {
	cancel();
	candidates.value = [];
	selectionToken.value = "";
	confirmedStudent.value = false;
	confirmReplace.value = false;
	replacementApproved = false;
	message.value = error.value = "";
}

watch(
	() => [props.studentId, props.classDate],
	() => {
		reset();
		meetingId.value = "2543520025";
		requestMeeting.value = false;
	}
);
watch(meetingId, reset);
watch(selectionToken, () => {
	confirmedStudent.value = false;
});
watch(
	() => props.markdown,
	() => {
		if (busy.value) cancel();
		replacementApproved = false;
	}
);
watch(
	() => props.disabled,
	value => {
		if (value) cancel();
	}
);
onBeforeUnmount(() => {
	disposed = true;
	cancel();
});

onMounted(async () => {
	try {
		const { data } = await api.get("/session-notes/drafting/settings");
		if (disposed) return;
		available.value = data.siteAvailable === true && data.allowed === true;
		ready.value = data.ready === true;
	} catch {
		available.value = false;
	}
});

function classLabel(candidate: Candidate) {
	return `${new Intl.DateTimeFormat("en-US", {
		dateStyle: "medium",
		timeStyle: "short",
		timeZone: candidate.timezone
	}).format(new Date(candidate.startAt))} · ${candidate.timezone}`;
}

async function generate() {
	if (!canGenerate.value) return;
	error.value = message.value = "";
	if (!ready.value) {
		error.value =
			"AI drafting needs Zoom and AI configuration from the administrator.";
		return;
	}
	if (props.markdown.trim() && !replacementApproved) {
		confirmReplace.value = true;
		return;
	}
	if (!/^\d{9,11}$/.test(meetingId.value)) {
		error.value = "Enter a 9–11 digit Zoom meeting ID.";
		return;
	}
	const version = ++requestVersion;
	const original = {
		studentId: props.studentId,
		classDate: props.classDate,
		markdown: props.markdown
	};
	controller = new AbortController();
	setBusy(true);
	try {
		const input = {
			studentId: original.studentId,
			classDate: original.classDate,
			meetingId: meetingId.value
		};
		const selected = candidates.value.length > 0;
		const { data } = await api.post(
			`/session-notes/drafting/${selected ? "generate" : "candidates"}`,
			selected
				? {
						...input,
						selectionToken: selectionToken.value,
						confirmedStudent: true
					}
				: input,
			{ signal: controller.signal, timeout: 95_000 }
		);
		if (
			version !== requestVersion ||
			disposed ||
			props.disabled ||
			props.studentId !== original.studentId ||
			props.classDate !== original.classDate ||
			props.markdown !== original.markdown
		) {
			return;
		}
		if (!selected) {
			candidates.value = data.candidates ?? [];
			if (!candidates.value.length) {
				requestMeeting.value = true;
				error.value =
					"No transcript found for this meeting on the selected date. Enter another Zoom meeting ID.";
			} else {
				selectionToken.value =
					candidates.value.length === 1
						? candidates.value[0].selectionToken
						: "";
			}
		} else if (
			typeof data.markdown === "string" &&
			data.draftOnly === true
		) {
			setBusy(false);
			emit("generated", data.markdown);
			candidates.value = [];
			selectionToken.value = "";
			replacementApproved = false;
			message.value =
				"Draft generated. Review and edit it before sending.";
		}
	} catch (cause: any) {
		if (version !== requestVersion || disposed) return;
		error.value =
			cause.response?.data?.message ??
			"Generation did not complete. Your existing notes are unchanged.";
		if (cause.response?.data?.code === "SELECTION_EXPIRED") {
			candidates.value = [];
			selectionToken.value = "";
		}
	} finally {
		if (version === requestVersion && !disposed) setBusy(false);
	}
}

function replaceDraft() {
	replacementApproved = true;
	confirmReplace.value = false;
	void generate();
}
</script>

<template>
	<div class="note-generation">
		<div class="note-generation__header">
			<label :for="editorId">Markdown</label>
			<button
				v-if="available"
				type="button"
				:disabled="!canGenerate"
				title="Create an editable draft using the Zoom transcript and AI"
				@click="generate"
			>
				{{ busy ? "Generating…" : "Generate" }}
			</button>
		</div>
		<div v-if="confirmReplace" class="note-generation__choice" role="alert">
			<span>Replace the existing draft after generation?</span>
			<button type="button" @click="replaceDraft">Continue</button>
			<button type="button" @click="confirmReplace = false">
				Keep draft
			</button>
		</div>
		<div
			v-if="available && candidates.length"
			class="note-generation__choice"
		>
			<label>
				<span>Zoom class</span>
				<select v-model="selectionToken" :disabled="busy">
					<option value="">Select the class</option>
					<option
						v-for="candidate in candidates"
						:key="candidate.selectionToken"
						:value="candidate.selectionToken"
					>
						{{ classLabel(candidate) }}
					</option>
				</select>
			</label>
			<label class="note-generation__confirmation">
				<input
					v-model="confirmedStudent"
					type="checkbox"
					:disabled="busy || !selectionToken"
				/>
				This is {{ studentName }}’s class
			</label>
		</div>
		<label
			v-if="available && requestMeeting"
			class="note-generation__choice"
		>
			<span>Zoom meeting ID</span>
			<input
				v-model="meetingId"
				inputmode="numeric"
				maxlength="11"
				:disabled="busy"
			/>
		</label>
		<p v-if="available && error" role="alert">{{ error }}</p>
		<p v-if="available && message" role="status">{{ message }}</p>
	</div>
</template>

<style scoped>
.note-generation {
	display: grid;
	gap: 0.5rem;
	min-width: 0;
}
.note-generation__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.75rem;
}
.note-generation__header label {
	margin: 0;
	font: inherit;
}
.note-generation button {
	padding: 0.35rem 0.75rem;
	font: inherit;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-sm);
	background: var(--color-surface);
	color: var(--color-ink);
}
.note-generation button:disabled {
	opacity: 0.45;
	cursor: not-allowed;
}
.note-generation__choice {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 0.6rem;
	font-size: 0.9rem;
}
.note-generation__choice label {
	display: flex;
	gap: 0.5rem;
	align-items: center;
}
.note-generation__choice :is(select, input:not([type="checkbox"])) {
	padding: 0.35rem 0.5rem;
	max-width: 100%;
	color: var(--color-ink);
	background: var(--color-surface);
	border: 1px solid var(--color-border);
	border-radius: var(--radius-sm);
	font: inherit;
}
.note-generation__confirmation input {
	width: auto;
}
.note-generation p {
	margin: 0;
	font-size: 0.9rem;
}
</style>
