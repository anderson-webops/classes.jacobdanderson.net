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
	schedulerPortalUrl,
	schedulerUrl
} from "@/modules/scheduler";

defineOptions({ name: "SignupPage" });

const MIN_FRAME_HEIGHT = 860;
const MAX_FRAME_HEIGHT = 5000;
const expanded = ref(false);

const schedulerLoaded = ref(false);
const schedulerTimedOut = ref(false);
const schedulerHeight = ref(MIN_FRAME_HEIGHT);
const schedulerFrame = ref<HTMLIFrameElement | null>(null);
const schedulerTheme = computed(() => (isDark.value ? "dark" : "light"));
const schedulerEmbedSrc = ref(buildSchedulerEmbedUrl(schedulerTheme.value));
const customerPortalUrl = ref(schedulerPortalUrl);
let schedulerLoadTimeout: number | undefined;

useHead({
	link: [
		{
			rel: "dns-prefetch",
			href: schedulerDnsPrefetchHref
		},
		{
			rel: "preconnect",
			href: SCHEDULER_ORIGIN
		}
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
		!Number.isFinite(payload.height)
	) {
		return;
	}

	schedulerHeight.value = Math.max(
		MIN_FRAME_HEIGHT,
		Math.min(MAX_FRAME_HEIGHT, Math.ceil(payload.height))
	);

	if (typeof payload.customerPortalUrl === "string") {
		try {
			const portalUrl = new URL(payload.customerPortalUrl);
			if (portalUrl.origin === SCHEDULER_ORIGIN) {
				customerPortalUrl.value = portalUrl.toString();
			}
		} catch {
			// Ignore malformed iframe messages and keep the safe default link.
		}
	}
}

function markSchedulerLoaded() {
	schedulerLoaded.value = true;
	schedulerTimedOut.value = false;
	postSchedulerTheme();
	if (schedulerLoadTimeout) {
		window.clearTimeout(schedulerLoadTimeout);
		schedulerLoadTimeout = undefined;
	}
}

watch(schedulerTheme, () => postSchedulerTheme());

onMounted(() => {
	window.addEventListener("message", handleSchedulerMessage);
	schedulerLoadTimeout = window.setTimeout(() => {
		if (!schedulerLoaded.value) schedulerTimedOut.value = true;
	}, 8000);
});

onBeforeUnmount(() => {
	window.removeEventListener("message", handleSchedulerMessage);
	if (schedulerLoadTimeout) window.clearTimeout(schedulerLoadTimeout);
});
</script>

<template>
	<section class="signup-page" :class="{ 'is-expanded': expanded }">
		<header class="scheduler-toolbar">
			<h1>Schedule a class</h1>
			<nav aria-label="Booking tools">
				<a
					class="text-link"
					:href="customerPortalUrl"
					target="_blank"
					rel="noopener noreferrer"
					>Manage bookings<span class="sr-only">
						(opens in a new tab)</span
					></a
				>
				<a
					class="text-link"
					:href="schedulerUrl"
					target="_blank"
					rel="noopener noreferrer"
					>Open scheduler<span class="sr-only">
						(opens in a new tab)</span
					></a
				>
				<button
					class="site-button site-button--secondary"
					:aria-pressed="expanded"
					@click="expanded = !expanded"
				>
					{{ expanded ? "Exit expanded view" : "Expand calendar" }}
				</button>
			</nav>
		</header>
		<div class="scheduler-container">
			<p v-if="!schedulerLoaded" class="scheduler-status" role="status">
				Opening scheduler…
			</p>
			<p v-if="schedulerTimedOut" class="scheduler-status" role="alert">
				The scheduler is taking longer than expected. Use Open scheduler
				above if it does not load.
			</p>
			<iframe
				ref="schedulerFrame"
				class="scheduler-frame"
				:src="schedulerEmbedSrc"
				title="Class scheduler"
				:style="{ height: `${schedulerHeight}px` }"
				loading="eager"
				referrerpolicy="strict-origin-when-cross-origin"
				sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
				@load="markSchedulerLoaded"
			/>
			<noscript
				><p>
					JavaScript is required for the calendar. Use Open scheduler
					above.
				</p></noscript
			>
		</div>
	</section>
</template>

<style scoped>
.signup-page {
	width: calc(100% - 2rem);
	max-width: 1600px;
	margin: 0.5rem auto 1rem;
	display: grid;
	gap: 0.5rem;
}
.scheduler-toolbar {
	display: flex;
	flex-wrap: wrap;
	gap: 0.6rem 1.5rem;
	align-items: center;
	justify-content: space-between;
}
.scheduler-toolbar h1 {
	margin: 0;
	font-size: 1.4rem;
}
.scheduler-toolbar nav {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 1rem;
	font-size: 0.9rem;
}
.scheduler-toolbar button {
	padding: 0.4rem 0.7rem;
	min-height: 2.25rem;
}
.scheduler-container {
	min-width: 0;
}
.scheduler-frame {
	width: 100%;
	display: block;
	border: 0;
	min-height: 860px;
}
.scheduler-status {
	margin: 0.5rem 0;
	color: var(--color-ink);
}
.is-expanded {
	position: fixed;
	z-index: 1100;
	inset: 0;
	margin: 0;
	width: 100%;
	max-width: none;
	padding: 0.6rem;
	overflow: auto;
	display: block;
	background: var(--color-paper, #fff);
}
.is-expanded .scheduler-toolbar {
	position: sticky;
	top: 0;
	padding: 0.4rem;
	background: var(--color-paper, #fff);
}
@media (max-width: 640px) {
	.signup-page {
		width: calc(100% - 0.5rem);
	}
	.is-expanded {
		width: 100%;
	}
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
