<script lang="ts" setup>
import { onMounted } from "vue";
import {
	openSchedulerPage,
	SCHEDULER_ORIGIN,
	schedulerDnsPrefetchHref,
	schedulerPortalUrl,
	schedulerUrl
} from "@/modules/scheduler";

defineOptions({ name: "SignupPage" });

useHead({
	link: [
		{ rel: "dns-prefetch", href: schedulerDnsPrefetchHref },
		{ rel: "preconnect", href: SCHEDULER_ORIGIN }
	]
});

onMounted(() => {
	try {
		openSchedulerPage();
	} catch {
		// Keep the direct links available if automatic navigation is blocked.
	}
});
</script>

<template>
	<section class="signup-page">
		<h1>Schedule a class</h1>
		<p role="status">
			Opening the full-page scheduler. If it does not open automatically,
			use the link below.
		</p>
		<nav aria-label="Booking tools">
			<a class="site-button" :href="schedulerUrl">Open scheduler</a>
			<a class="text-link" :href="schedulerPortalUrl">Manage bookings</a>
		</nav>
		<noscript><p>Use Open scheduler to continue booking.</p></noscript>
	</section>
</template>

<style scoped>
.signup-page {
	width: calc(100% - 2rem);
	max-width: 48rem;
	margin: 2rem auto;
}
.signup-page nav {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 1rem;
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
