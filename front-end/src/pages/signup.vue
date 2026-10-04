<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { isDark } from "@/composables/dark";
import {
	buildSchedulerEmbedUrl,
	SCHEDULER_ORIGIN,
	schedulerDnsPrefetchHref,
	schedulerEmbedMessageSource,
	schedulerEmbedResizeType,
	schedulerEmbedThemeMessageSource,
	schedulerEmbedThemeType,
	schedulerUrl
} from "@/modules/scheduler";

defineOptions({ name: "SignupPage" });

const MIN_FRAME_HEIGHT = 760;
const MAX_FRAME_HEIGHT = 5000;
const schedulerFrame = ref<HTMLIFrameElement | null>(null);
const schedulerHeight = ref(MIN_FRAME_HEIGHT);
const schedulerLoaded = ref(false);
const schedulerTimedOut = ref(false);
const showingPortal = ref(false);
const schedulerTheme = computed(() => (isDark.value ? "dark" : "light"));
// Theme changes use messages so an in-progress booking is never reloaded.
const schedulerEmbedSrc = ref(buildSchedulerEmbedUrl(schedulerTheme.value));
let schedulerLoadTimeout: number | undefined;

useHead({
	link: [
		{ rel: "dns-prefetch", href: schedulerDnsPrefetchHref },
		{ rel: "preconnect", href: SCHEDULER_ORIGIN }
	]
});

function postSchedulerTheme() {
	schedulerFrame.value?.contentWindow?.postMessage(
		{
			source: schedulerEmbedThemeMessageSource,
			type: schedulerEmbedThemeType,
			theme: schedulerTheme.value
		},
		SCHEDULER_ORIGIN
	);
}

function handleSchedulerMessage(event: MessageEvent) {
	if (
		event.origin !== SCHEDULER_ORIGIN ||
		event.source !== schedulerFrame.value?.contentWindow
	) {
		return;
	}

	const payload = event.data;
	if (
		typeof payload !== "object" ||
		payload === null ||
		payload.source !== schedulerEmbedMessageSource ||
		payload.type !== schedulerEmbedResizeType ||
		typeof payload.height !== "number" ||
		!Number.isFinite(payload.height) ||
		payload.height <= 0
	) {
		return;
	}

	schedulerHeight.value = Math.max(
		MIN_FRAME_HEIGHT,
		Math.min(MAX_FRAME_HEIGHT, Math.ceil(payload.height))
	);
	if (!schedulerLoaded.value) markSchedulerLoaded();
}

function startLoadTimeout() {
	if (schedulerLoadTimeout !== undefined) {
		window.clearTimeout(schedulerLoadTimeout);
	}
	schedulerLoadTimeout = window.setTimeout(() => {
		if (!schedulerLoaded.value) schedulerTimedOut.value = true;
	}, 8000);
}

function markSchedulerLoaded() {
	schedulerLoaded.value = true;
	schedulerTimedOut.value = false;
	if (schedulerLoadTimeout !== undefined) {
		window.clearTimeout(schedulerLoadTimeout);
		schedulerLoadTimeout = undefined;
	}
	postSchedulerTheme();
}

function toggleBookingView() {
	showingPortal.value = !showingPortal.value;
	schedulerLoaded.value = false;
	schedulerTimedOut.value = false;
	schedulerHeight.value = MIN_FRAME_HEIGHT;
	schedulerEmbedSrc.value = buildSchedulerEmbedUrl(
		schedulerTheme.value,
		showingPortal.value ? "/portal" : "/"
	);
	startLoadTimeout();
}

watch(schedulerTheme, postSchedulerTheme);

onMounted(() => {
	window.addEventListener("message", handleSchedulerMessage);
	startLoadTimeout();
	// A prerendered iframe may already have loaded before Vue hydrates.
	postSchedulerTheme();
});

onBeforeUnmount(() => {
	window.removeEventListener("message", handleSchedulerMessage);
	if (schedulerLoadTimeout !== undefined) {
		window.clearTimeout(schedulerLoadTimeout);
	}
});
</script>

<template>
	<section class="signup-page">
		<header class="scheduler-toolbar">
			<h1>
				{{ showingPortal ? "Manage bookings" : "Schedule a class" }}
			</h1>
			<button class="text-link" type="button" @click="toggleBookingView">
				{{ showingPortal ? "Back to calendar" : "Manage bookings" }}
			</button>
		</header>
		<p v-if="schedulerTimedOut" class="scheduler-status" role="alert">
			The scheduler is taking longer than expected.
			<a :href="schedulerUrl" target="_blank" rel="noopener noreferrer">
				Open scheduler in a new tab </a
			>.
		</p>
		<p v-else-if="!schedulerLoaded" class="scheduler-status" role="status">
			Loading scheduler…
		</p>
		<iframe
			ref="schedulerFrame"
			class="scheduler-frame"
			:src="schedulerEmbedSrc"
			title="Class scheduler"
			:style="{ height: `${schedulerHeight}px` }"
			loading="eager"
			referrerpolicy="strict-origin-when-cross-origin"
			sandbox="allow-forms allow-popups allow-same-origin allow-scripts"
			@load="markSchedulerLoaded"
		/>
		<noscript>
			<p>
				JavaScript is required for the calendar.
				<a
					:href="schedulerUrl"
					target="_blank"
					rel="noopener noreferrer"
				>
					Open scheduler in a new tab </a
				>.
			</p>
		</noscript>
	</section>
</template>

<style scoped>
.signup-page {
	width: 100%;
	min-width: 0;
	margin: 0.5rem auto 1rem;
	padding-inline: clamp(0.25rem, 1vw, 1rem);
}
.scheduler-toolbar {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 0.5rem 1rem;
	padding: 0.25rem 0.35rem 0.75rem;
}
.scheduler-toolbar h1 {
	font-size: 1.4rem;
}
.scheduler-toolbar button {
	min-height: 44px;
	padding: 0.5rem;
	font-weight: 600;
}
.scheduler-frame {
	display: block;
	width: 100%;
	min-height: calc(100dvh - 9rem);
	border: 0;
}
.scheduler-status {
	padding: 0.5rem;
	color: var(--color-ink);
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
