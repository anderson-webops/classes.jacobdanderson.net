<script lang="ts" setup>
import { classMeetingUrl } from "@/modules/siteNavigation";

defineOptions({ name: "ZoomClassroomPage" });

const zoomMeetingUrl = classMeetingUrl;
</script>

<template>
	<section class="page-shell page-shell--narrow zoom-page">
		<h1 class="page-title">Join Class</h1>
		<a
			class="site-button site-button--primary"
			:href="zoomMeetingUrl"
			rel="noopener noreferrer"
			target="_blank"
			>Join on Zoom<span class="sr-only"> (opens in a new tab)</span></a
		>
		<details>
			<summary>Direct link</summary>
			<a :href="zoomMeetingUrl" rel="noopener noreferrer" target="_blank"
				>{{ zoomMeetingUrl
				}}<span class="sr-only"> (opens in a new tab)</span></a
			>
		</details>
	</section>
</template>

<style scoped>
.zoom-page {
	display: grid;
	justify-items: start;
	gap: 0.75rem;
}
.zoom-page details {
	font-size: 0.9rem;
	color: var(--color-ink-soft);
}
.zoom-page summary {
	min-height: 2.75rem;
	align-content: center;
	cursor: pointer;
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
