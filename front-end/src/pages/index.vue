<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { serializeJsonLd } from "@/modules/serializeJsonLd";
import { useContentStore } from "@/stores/content";

defineOptions({ name: "HomePage" });

const content = useContentStore();
const siteUrl = "https://classes.jacobdanderson.net";
const { subjectGroups } = storeToRefs(content);
const courseStructuredData = computed(() =>
	subjectGroups.value.map(group => ({
		"@context": "https://schema.org",
		"@type": "Course",
		description: `Private instruction covering ${group.subjects.join(", ")}.`,
		name: `${group.title} tutoring with Jacob Anderson`,
		provider: {
			"@type": "Person",
			name: "Jacob Anderson",
			url: siteUrl
		}
	}))
);

useHead(
	() =>
		({
			link: [
				{
					href: `${siteUrl}/`,
					rel: "canonical"
				}
			],
			script: [
				...courseStructuredData.value.map((entry, index) => ({
					innerHTML: serializeJsonLd(entry),
					key: `classes-home-course-${index}`,
					type: "application/ld+json"
				}))
			]
		}) as any
);
</script>

<template>
	<section class="page-shell page-shell--wide home-page">
		<section aria-labelledby="hero-title" class="page-hero home-hero">
			<div class="hero-text">
				<h1 id="hero-title" class="page-title">Private Tutoring</h1>
				<p class="page-copy">
					Learn with Jacob Anderson, one-on-one. Bring your coursework
					or project, or find a course to explore.
				</p>
			</div>
			<figure class="media-frame home-hero__media">
				<img
					alt="Graduates celebrating with graduation caps"
					class="hero-image"
					fetchpriority="high"
					height="900"
					loading="eager"
					src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80"
					width="1200"
				/>
			</figure>
		</section>

		<section aria-labelledby="subjects-title" class="home-section">
			<div class="section-heading">
				<h2 id="subjects-title" class="section-title">What I Teach</h2>
				<p class="section-intro">
					Coding, math, science and Spanish, from first steps to
					advanced coursework.
				</p>
			</div>
			<RouterLink
				class="site-button site-button--secondary pathway-action"
				to="/pathways"
			>
				Course Pathways
			</RouterLink>
		</section>
	</section>
</template>

<style scoped>
.home-page {
	gap: clamp(2.5rem, 6vw, 4.75rem);
}

.home-hero {
	grid-template-columns: minmax(0, 1.02fr) minmax(18rem, 0.95fr);
	align-items: center;
}

.hero-text {
	display: grid;
	gap: 1.25rem;
	max-width: 38rem;
}

.home-hero__media {
	aspect-ratio: 5 / 4;
}

.hero-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.home-section {
	display: grid;
	gap: 1.35rem;
}

.section-heading {
	display: grid;
	gap: 0.8rem;
	max-width: 44rem;
}

.pathway-action {
	justify-self: start;
}

@media (max-width: 900px) {
	.home-hero {
		grid-template-columns: 1fr;
	}

	.hero-text {
		max-width: none;
	}
}

@media (max-width: 640px) {
	.home-hero__media {
		aspect-ratio: 4 / 3;
	}
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
