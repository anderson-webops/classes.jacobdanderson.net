<script setup lang="ts">
import type { ScratchOriginalProject } from "@/modules/scratch/originals";
import {
	computed,
	nextTick,
	onBeforeUnmount,
	onMounted,
	ref,
	watch
} from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import IdeEnvironmentSelect from "@/components/IdeEnvironmentSelect.vue";
import WorkspaceDisclosure from "@/components/WorkspaceDisclosure.vue";
import WorkspaceHeader from "@/components/WorkspaceHeader.vue";
import WorkspaceStorageStatus from "@/components/WorkspaceStorageStatus.vue";
import {
	scratchDownloadName,
	scratchFrameDocument,
	scratchProjectLimit
} from "@/modules/scratch/frame";
import {
	fetchScratchOriginalArchive,
	scratchOriginalLicense,
	scratchOriginalProject
} from "@/modules/scratch/originals";
import catalog from "../../scripts/scratch/projects.json";

const route = useRoute();
const frame = ref<HTMLIFrameElement>();
const source = ref("");
const ready = ref(false);
const busy = ref(false);
const dirty = ref(false);
const title = ref("My Scratch project");
const starter = ref("");
const pendingOriginal = ref<ScratchOriginalProject>();
const activeOriginal = ref<ScratchOriginalProject>();
let loadingOriginal: ScratchOriginalProject | undefined;
let originalRequest: AbortController | undefined;
const status = ref("Opening Scratch…");
const expanded = ref(false);
const frameViewport = ref<HTMLDivElement>();
const scratchView = ref<"blocks" | "stage">("stage");
function showScratchView(view: "blocks" | "stage") {
	scratchView.value = view;
	const viewport = frameViewport.value;
	viewport?.scrollTo({
		left: view === "stage" ? viewport.scrollWidth : 0,
		behavior: "instant"
	});
}
let channel = "";
let timer: ReturnType<typeof setTimeout> | undefined;
const selected = computed(() =>
	starter.value === "blank"
		? {
				id: "blank",
				publishReference: false,
				name: "Independent Mini-Game",
				normal: "",
				hard: "",
				check: ""
			}
		: catalog.find(item => item.id === starter.value)
);
const reference = computed(
	() =>
		route.query.role === "reference" &&
		!route.query.originalProject &&
		selected.value?.publishReference === true
);
watch(
	() => [route.query.originalProject, route.query.course, route.query.role],
	() => {
		originalRequest?.abort();
		pendingOriginal.value = scratchOriginalProject(
			route.query.originalProject,
			route.query.course,
			route.query.role
		);
	},
	{ immediate: true }
);
async function openOriginal() {
	const project = pendingOriginal.value;
	if (!project || !ready.value || busy.value || !confirmReplace()) return;
	const request = new AbortController();
	originalRequest = request;
	busy.value = true;
	status.value = "Opening original project…";
	let timedOut = false;
	const timeout = setTimeout(() => {
		timedOut = true;
		request.abort();
	}, 45000);
	try {
		const bytes = await fetchScratchOriginalArchive(
			project,
			request.signal
		);
		if (request.signal.aborted) return;
		loadingOriginal = project;
		title.value = `${project.name}${route.query.role === "reference" ? " Reference" : ""}`;
		starter.value = "";
		send("load", { bytes });
	} catch {
		if (!request.signal.aborted || timedOut) {
			status.value =
				"The original project could not be opened. Retry or use its Scratch source link.";
		}
		busy.value = false;
	} finally {
		clearTimeout(timeout);
		if (originalRequest === request) originalRequest = undefined;
	}
}
function dismissOriginal() {
	pendingOriginal.value = undefined;
	status.value = "Import cancelled.";
}
function send(type: string, extra = {}) {
	frame.value?.contentWindow?.postMessage(
		{ source: "classes-scratch-host", channel, type, ...extra },
		"*"
	);
}
function confirmReplace() {
	return (
		!dirty.value ||
		// eslint-disable-next-line no-alert -- Do not silently replace unsaved student work.
		window.confirm(
			"Download your current Scratch project before replacing it. Continue without downloading?"
		)
	);
}
onBeforeRouteLeave(() => confirmReplace());
async function openStarter() {
	if (!ready.value || !selected.value || !confirmReplace()) return;
	await loadSelectedStarter();
}
async function loadSelectedStarter() {
	if (!selected.value) return;
	loadingOriginal = undefined;
	busy.value = true;
	status.value = "Opening project…";
	try {
		const response = await fetch(
			`/scratch-projects/${selected.value.id}${reference.value ? "-solution" : ""}.sb3`,
			{ credentials: "omit" }
		);
		if (!response.ok) throw new Error("Missing starter");
		const bytes = await response.arrayBuffer();
		title.value = `${selected.value.name}${reference.value ? " Reference" : ""}`;
		send("load", { bytes });
	} catch {
		status.value =
			"The project could not be opened. Download it from the course and use Open .sb3.";
		busy.value = false;
	}
}
async function newProject() {
	if (!ready.value || busy.value || !confirmReplace()) return;
	starter.value = "blank";
	await loadSelectedStarter();
}
async function openFile(event: Event) {
	const input = event.target as HTMLInputElement;
	const file = input.files?.[0];
	input.value = "";
	if (!file || !ready.value || busy.value || !confirmReplace()) return;
	if (!/\.sb3$/i.test(file.name) || file.size > scratchProjectLimit) {
		status.value = "Choose a Scratch .sb3 project smaller than 20 MB.";
		return;
	}
	busy.value = true;
	loadingOriginal = undefined;
	status.value = "Opening project…";
	title.value = file.name.replace(/\.sb3$/i, "");
	try {
		send("load", { bytes: await file.arrayBuffer() });
	} catch {
		busy.value = false;
		status.value = "The file could not be read. Choose it again to retry.";
	}
}
function receive(event: MessageEvent) {
	if (
		event.source !== frame.value?.contentWindow ||
		event.origin !== "null" ||
		event.data?.source !== "classes-scratch" ||
		event.data?.channel !== channel
	) {
		return;
	}
	const data = event.data;
	if (data.type === "ready" && !ready.value) {
		ready.value = true;
		clearTimeout(timer);
		status.value = "Ready. Download your project to keep a copy.";
		if (
			route.query.originalProject &&
			!scratchOriginalProject(
				route.query.originalProject,
				route.query.course,
				route.query.role
			)
		) {
			status.value =
				"This original Scratch link is unavailable. Choose a classroom project or open a local .sb3 file.";
		}
		if (starter.value && !route.query.originalProject) void openStarter();
		if (window.matchMedia?.("(max-width: 1120px)").matches)
			void nextTick(() => showScratchView("stage"));
	} else if (data.type === "loaded") {
		busy.value = false;
		dirty.value = false;
		activeOriginal.value = loadingOriginal;
		if (loadingOriginal?.id === pendingOriginal.value?.id)
			pendingOriginal.value = undefined;
		loadingOriginal = undefined;
		status.value = "Project open. Click the green flag to run.";
	} else if (data.type === "changed") {
		dirty.value = true;
	} else if (data.type === "error") {
		busy.value = false;
		loadingOriginal = undefined;
		status.value =
			"Scratch could not open the project. Try a smaller .sb3 file or reload this page.";
	} else if (
		data.type === "download" &&
		data.bytes instanceof ArrayBuffer &&
		data.bytes.byteLength <= scratchProjectLimit
	) {
		const url = URL.createObjectURL(
			new Blob([data.bytes], { type: "application/x.scratch.sb3" })
		);
		const link = document.createElement("a");
		link.href = url;
		link.download = scratchDownloadName(title.value);
		link.click();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
		dirty.value = false;
		status.value = "Downloaded. Keep this file to continue next time.";
	}
}
function beforeUnload(event: BeforeUnloadEvent) {
	if (dirty.value) {
		event.preventDefault();
		event.returnValue = "";
	}
}
watch(
	() => [route.query.starter, route.query.role],
	([value]) => {
		if (route.query.originalProject) return;
		if (
			typeof value === "string" &&
			(value === "blank" || catalog.some(item => item.id === value))
		) {
			starter.value = value;
			if (ready.value) void openStarter();
		}
	}
);
onMounted(() => {
	channel = crypto.randomUUID();
	const query = route.query.starter;
	if (
		!route.query.originalProject &&
		typeof query === "string" &&
		(query === "blank" || catalog.some(item => item.id === query))
	) {
		starter.value = query;
	}
	window.addEventListener("message", receive);
	window.addEventListener("beforeunload", beforeUnload);
	source.value = scratchFrameDocument(window.location.origin, channel);
	timer = setTimeout(() => {
		if (!ready.value) {
			status.value =
				"Scratch is taking longer to load. Check your connection and reload this page.";
		}
	}, 60000);
});
onBeforeUnmount(() => {
	originalRequest?.abort();
	send("stop");
	clearTimeout(timer);
	window.removeEventListener("message", receive);
	window.removeEventListener("beforeunload", beforeUnload);
});
defineExpose({ stop: () => send("stop") });
</script>

<template>
	<section
		class="scratch-workspace"
		:class="{ expanded }"
		aria-label="Scratch workspace"
	>
		<WorkspaceHeader title="Scratch blocks"
			><template #title><IdeEnvironmentSelect /></template
			><RouterLink
				v-if="typeof route.query.course === 'string'"
				:to="{
					path: '/courses',
					hash:
						typeof route.query.lesson === 'string' &&
						/^[\w-]{1,250}$/.test(route.query.lesson)
							? `#${route.query.lesson}`
							: `#${route.query.course}`
				}"
				>Return to lesson</RouterLink
			></WorkspaceHeader
		>
		<section
			v-if="pendingOriginal"
			class="scratch-original-import"
			aria-label="Original Scratch import"
		>
			<h2>Open {{ pendingOriginal.name }} in Scratch?</h2>
			<p>
				<a
					:href="pendingOriginal.url"
					target="_blank"
					rel="noopener noreferrer"
					>Original project</a
				>
				by {{ pendingOriginal.author }} ·
				<a
					:href="scratchOriginalLicense.url"
					target="_blank"
					rel="noopener noreferrer"
					>{{ scratchOriginalLicense.name }}</a
				>
			</p>
			<p v-if="pendingOriginal.extensions.includes('text2speech')">
				Text to Speech sends spoken text to Scratch’s online speech
				service.
			</p>
			<button :disabled="!ready || busy" @click="openOriginal">
				Open project
			</button>
			<button :disabled="busy" @click="dismissOriginal">Cancel</button>
		</section>
		<p v-if="activeOriginal" class="scratch-original-credit">
			<a
				:href="activeOriginal.url"
				target="_blank"
				rel="noopener noreferrer"
				>{{ activeOriginal.name }}</a
			>
			by {{ activeOriginal.author }} ·
			<a
				:href="scratchOriginalLicense.url"
				target="_blank"
				rel="noopener noreferrer"
				>{{ scratchOriginalLicense.name }}</a
			>
		</p>
		<WorkspaceStorageStatus
			:label="
				dirty
					? 'Download required: unsaved changes.'
					: 'Scratch saves to a file.'
			"
			>Download .sb3 to keep your work; it does not sync to your
			account.</WorkspaceStorageStatus
		>
		<p class="scratch-small-screen">
			The full block editor needs a wider screen. Swipe horizontally to
			reach the stage, or use Expand editor and rotate your device.
			Download your project before leaving.
		</p>
		<div class="scratch-toolbar">
			<label
				>Project name <input v-model="title" maxlength="120"
			/></label>
			<button :disabled="!ready || busy" @click="send('download')">
				Download project
			</button>
			<button :aria-pressed="expanded" @click="expanded = !expanded">
				{{ expanded ? "Exit expanded view" : "Expand editor" }}
			</button>
			<WorkspaceDisclosure class="scratch-project-menu" popover>
				<template #label>New / open</template>
				<div class="scratch-project-options">
					<label class="file-control"
						>Open .sb3
						<input
							type="file"
							accept=".sb3"
							:disabled="!ready || busy"
							@change="openFile"
					/></label>
					<button :disabled="!ready || busy" @click="newProject">
						New project
					</button>
					<div class="scratch-starters">
						<label
							>Classroom project
							<select v-model="starter">
								<option value="">Choose a project</option>
								<option value="blank">
									Blank independent project
								</option>
								<option
									v-for="item in catalog"
									:key="item.id"
									:value="item.id"
								>
									{{ item.name }}
								</option>
							</select></label
						>
						<button
							:disabled="!selected || !ready || busy"
							@click="openStarter"
						>
							{{ reference ? "Open reference" : "Open starter" }}
						</button>
					</div>
				</div>
			</WorkspaceDisclosure>
		</div>
		<span class="scratch-status" role="status"
			>{{ status }}{{ dirty ? " Unsaved changes." : "" }}</span
		>
		<div
			class="scratch-view-switch"
			aria-label="Scratch small-screen views"
		>
			<button
				type="button"
				:aria-pressed="scratchView === 'blocks'"
				@click="showScratchView('blocks')"
			>
				Blocks
			</button>
			<button
				type="button"
				:aria-pressed="scratchView === 'stage'"
				@click="showScratchView('stage')"
			>
				Stage
			</button>
		</div>
		<div
			ref="frameViewport"
			class="scratch-frame-viewport"
			tabindex="0"
			aria-label="Scrollable Scratch blocks and stage"
		>
			<iframe
				v-if="source"
				ref="frame"
				:srcdoc="source"
				sandbox="allow-scripts allow-downloads"
				allow="camera 'none'; microphone 'none'; geolocation 'none'"
				title="Scratch block editor and stage"
			/>
		</div>
		<WorkspaceDisclosure class="scratch-help">
			<template #label>Classroom tasks and credits</template>
			<p v-if="selected && starter !== 'blank'">
				<strong>Normal:</strong> {{ selected.normal }}
				<strong>Hard:</strong> {{ selected.hard }}
				<strong>Check:</strong> {{ selected.check }}
			</p>
			<p>
				Text to Speech sends spoken text to Scratch’s online speech
				service.
			</p>
			<p>
				Camera, microphone, cloud variables and external extensions are
				unavailable in this classroom editor.
			</p>
			<p>
				Powered by
				<a
					href="https://github.com/scratchfoundation/scratch-editor"
					target="_blank"
					rel="noopener noreferrer"
					>Scratch open source</a
				>.
				<a
					href="/scratch-runtime/NOTICE.txt"
					target="_blank"
					rel="noopener noreferrer"
					>License and corresponding source</a
				>. Scratch is a project of the Scratch Foundation, which does
				not sponsor or endorse this site.
			</p>
		</WorkspaceDisclosure>
	</section>
</template>

<style scoped>
.scratch-small-screen {
	display: none;
}
.scratch-original-import {
	padding: 1rem;
	border: 1px solid var(--color-border, #b7ceca);
	border-radius: 0.75rem;
	background: var(--color-panel, #f5fbf9);
}
.scratch-original-import h2 {
	margin: 0 0 0.5rem;
	font-size: 1.2rem;
}
.scratch-original-import p,
.scratch-original-credit {
	margin: 0.5rem 0;
	overflow-wrap: anywhere;
}
.scratch-original-import button {
	min-height: 44px;
	margin-right: 0.5rem;
	padding: 0.5rem 0.9rem;
	border: 1px solid var(--color-border, #b7ceca);
	border-radius: 0.5rem;
}
.scratch-save-reminder {
	margin: 0;
	color: var(--color-ink-soft);
	font-size: 0.9rem;
}
@media (max-width: 700px) {
	.scratch-small-screen {
		display: block;
		margin: 0;
		font-size: 0.9rem;
	}
}
.scratch-workspace {
	display: flex;
	flex-direction: column;
	gap: 0.65rem;
	padding: 0.75rem;
	min-width: 0;
	color: var(--color-ink);
	background: var(--color-paper);
}
.scratch-toolbar,
.scratch-starters {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.65rem;
}
.scratch-workspace label {
	display: flex;
	gap: 0.4rem;
	align-items: center;
	font: inherit;
	text-transform: none;
	letter-spacing: normal;
}
.scratch-workspace :is(input, select, button) {
	font: inherit;
	border: 1px solid var(--color-border, #8a9db1);
	border-radius: 0.45rem;
	padding: 0.5rem 0.65rem;
	color: var(--color-ink);
	background: var(--color-surface, #fff);
	max-width: 100%;
}
.scratch-workspace button {
	cursor: pointer;
}
.scratch-workspace button:disabled {
	opacity: 0.6;
	cursor: default;
}
.file-control input {
	max-width: 13rem;
}
.scratch-starters [role="status"] {
	font-size: 0.85rem;
}
.scratch-workspace iframe {
	width: 100%;
	/* Keep Scratch's complete desktop layout inside the scrollable frame. */
	min-width: 1120px;
	height: max(650px, calc(100dvh - 230px));
	border: 1px solid #a6adba;
	border-radius: 0.5rem;
	background: white;
}
.scratch-help {
	font-size: 0.9rem;
}
.scratch-help p {
	margin: 0.6rem 0;
}
.expanded {
	position: fixed;
	z-index: 1100;
	inset: 0;
	overflow: auto;
}
.expanded iframe {
	flex: 1;
	min-height: 560px;
}
.scratch-frame-viewport {
	min-width: 0;
	overflow-x: auto;
	overscroll-behavior: contain;
	touch-action: pan-x pan-y;
}
.scratch-view-switch {
	display: none;
}
@media (max-width: 1120px) {
	.scratch-view-switch {
		display: flex;
		gap: 0.5rem;
	}
	.scratch-view-switch button {
		min-height: 2.75rem;
	}
	.scratch-workspace {
		overflow-x: clip;
	}
	.scratch-frame-viewport {
		max-width: 100%;
	}
}

.scratch-workspace {
	gap: 0.5rem;
	padding-block: 0.5rem 1rem;
}
.scratch-toolbar {
	align-items: end;
	gap: 0.5rem;
}
.scratch-toolbar label {
	gap: 0.25rem;
}
.scratch-project-menu {
	position: relative;
}
.scratch-project-menu > :deep(.workspace-disclosure__trigger) {
	cursor: pointer;
	min-height: 2.75rem;
	padding: 0.5rem 0.75rem;
	border: 1px solid var(--color-border);
	border-radius: 8px;
}
.scratch-project-options {
	display: grid;
	gap: 0.75rem;
	width: min(25rem, 85vw);
}
.scratch-project-options .scratch-starters {
	display: grid;
}
.scratch-status {
	font-size: 0.85rem;
	color: var(--color-ink-soft);
}
</style>
