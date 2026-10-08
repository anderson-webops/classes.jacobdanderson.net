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
			<div class="home-section__heading">
				<div class="section-heading">
					<h2 id="subjects-title" class="section-title">
						What I Teach
					</h2>
					<p class="section-intro">
						Start something new or get help with the work already in
						front of you.
					</p>
				</div>
				<RouterLink
					class="site-button site-button--secondary pathway-action"
					to="/pathways"
				>
					Course Pathways
				</RouterLink>
			</div>
			<div class="home-subjects">
				<article
					v-for="group in subjectGroups"
					:key="group.title"
					class="home-subject"
				>
					<h3>{{ group.title }}</h3>
					<p>{{ group.description }}</p>
					<ul :aria-label="`${group.title} subjects`">
						<li v-for="subject in group.subjects" :key="subject">
							{{ subject }}
						</li>
					</ul>
				</article>
			</div>
		</section>

		<section
			aria-labelledby="session-title"
			class="home-section home-session"
		>
			<div class="section-heading">
				<h2 id="session-title" class="section-title">
					What a session looks like
				</h2>
				<p class="section-intro">
					We work through the problem together, with time to try
					ideas, ask questions and understand the reasoning.
				</p>
			</div>
			<ol class="home-session__steps">
				<li>
					<h3>Bring a starting point</h3>
					<p>
						Share the assignment, code, problem or goal. Not sure
						where to start? We can choose a course path together.
					</p>
				</li>
				<li>
					<h3>Work it through</h3>
					<p>
						Break the task into manageable steps, test your ideas
						and explain why the solution works.
					</p>
				</li>
				<li>
					<h3>Know what comes next</h3>
					<p>
						Review what you learned and what still needs work, with
						clear next steps to guide your practice.
					</p>
				</li>
			</ol>
		</section>
	</section>
</template>

<style scoped>
.home-page {
	--home-section-space: clamp(4rem, 8vw, 7rem);
	gap: var(--home-section-space);
	padding-bottom: 2rem;
	margin-bottom: clamp(3rem, 6vw, 6rem);
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
	gap: clamp(2rem, 3vw, 3rem);
}

.section-heading {
	display: grid;
	gap: 0.8rem;
	max-width: 44rem;
}

.home-section__heading {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem 2rem;
	flex-wrap: wrap;
}

.pathway-action {
	flex-shrink: 0;
}

.home-subjects {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: clamp(2.5rem, 4vw, 4rem) 1.75rem;
}

.home-subject {
	display: grid;
	align-content: start;
	gap: 0.65rem;
	padding-top: 1.25rem;
	border-top: 2px solid var(--color-border-strong);
}

.home-subject h3,
.home-session h3 {
	font: 700 1.05rem / 1.4 var(--font-sans);
}

.home-subject p,
.home-session__steps p {
	margin: 0;
	color: var(--color-ink-soft);
	line-height: 1.65;
}

.home-subject ul {
	display: flex;
	flex-wrap: wrap;
	gap: 0.35rem 0.85rem;
	margin: 0.35rem 0 0;
	padding: 0;
	list-style: none;
	font-size: 0.9rem;
	color: var(--color-ink-soft);
}

.home-session {
	padding-top: var(--home-section-space);
	border-top: 1px solid var(--color-border);
}

.home-session__steps {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: clamp(2.5rem, 4vw, 4rem) 2rem;
	margin: 0;
	padding-left: 1.5rem;
}

.home-session__steps li {
	padding-left: 0.35rem;
}

.home-session__steps li::marker {
	color: var(--color-accent);
	font-weight: 700;
}

.home-session__steps h3 {
	margin-bottom: 0.5rem;
}

@media (max-width: 900px) {
	.home-hero {
		grid-template-columns: 1fr;
	}

	.hero-text {
		max-width: none;
	}

	.home-subjects {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (max-width: 640px) {
	.home-hero__media {
		aspect-ratio: 4 / 3;
	}

	.home-subjects,
	.home-session__steps {
		grid-template-columns: 1fr;
	}
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
