<script lang="ts" setup>
defineOptions({ name: "AboutPage" });
</script>

<template>
	<section class="page-shell about-page">
		<section aria-labelledby="intro-title" class="page-hero about-intro">
			<div class="copy">
				<h1 id="intro-title" class="page-title">About Jacob</h1>
				<p class="page-copy">
					I taught hundreds of students through Juni Learning before
					moving into direct private instruction. Most students come
					to me with an assignment, bug, lab, or project that needs
					focused one-on-one help.
				</p>
				<p class="page-copy">
					That means sessions are built around the work in front of
					the learner: debugging code, finishing coursework, reviewing
					reasoning, or moving through a structured course path when
					there is no active class assignment.
				</p>
			</div>
			<figure class="image-wrapper">
				<img
					alt="Jacob Anderson"
					height="1200"
					loading="lazy"
					src="https://jacobdanderson.s3.us-east-1.amazonaws.com/images/Jacob_Anderson.jpg"
					width="960"
				/>
			</figure>
		</section>

		<section aria-labelledby="fit-title" class="about-section">
			<div class="section-heading">
				<h2 id="fit-title" class="section-title">Best Fit</h2>
			</div>
			<div class="fit-grid">
				<article>
					<h3>Active Coursework</h3>
					<p>
						A strong fit for students who need help finishing an
						assignment, understanding a module, or preparing for the
						next check-in.
					</p>
				</article>
				<article>
					<h3>Projects</h3>
					<p>
						Useful for students building apps, games, labs, or other
						project work and needing direct feedback while the work
						is still in progress.
					</p>
				</article>
				<article>
					<h3>Course Paths</h3>
					<p>
						A good fit when a student needs a defined path with
						linked projects and supplemental practice instead of
						improvised enrichment.
					</p>
				</article>
			</div>
		</section>

		<section aria-labelledby="approach-title" class="about-section">
			<div class="section-heading">
				<h2 id="approach-title" class="section-title">
					How Sessions Run
				</h2>
			</div>
			<ul>
				<li>
					<p>
						<strong>Start with the exact problem:</strong>
						We work from the assignment, bug, or project in front of
						the student instead of drifting into generic lecture.
					</p>
				</li>
				<li>
					<p>
						<strong>Make the reasoning visible:</strong>
						Students explain choices, test cases, and edge cases out
						loud so understanding is easy to check.
					</p>
				</li>
				<li>
					<p>
						<strong>Leave with a next step:</strong>
						Each session ends with what was solved, what still needs
						work, and what to do next.
					</p>
				</li>
			</ul>
		</section>

		<section aria-label="About page actions" class="site-action-row">
			<RouterLink class="site-button site-button--primary" to="/signup">
				Book a Class
			</RouterLink>
			<a
				class="site-button site-button--secondary"
				href="https://www.linkedin.com/in/jacoba1100254352/"
				target="_blank"
				rel="noopener noreferrer"
			>
				View LinkedIn<span class="sr-only"> (opens in a new tab)</span>
			</a>
			<RouterLink
				class="site-button site-button--secondary"
				to="/pathways"
			>
				View Course Pathways
			</RouterLink>
		</section>
	</section>
</template>

<style scoped>
.about-page {
	max-width: 64rem;
}
.about-intro {
	display: grid;
	grid-template-columns: minmax(0, 1fr) 10rem;
	align-items: start;
	gap: 2rem;
}
.image-wrapper {
	margin: 0;
	overflow: hidden;
	border-radius: 8px;
}
.image-wrapper img {
	width: 100%;
	height: auto;
}
.copy,
.about-section {
	display: grid;
	gap: 0.75rem;
}
.fit-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 1.5rem;
}
.fit-grid article {
	display: grid;
	align-content: start;
	gap: 0.5rem;
}
.fit-grid h3 {
	font: 600 1rem var(--font-sans);
}
.fit-grid p,
.about-section p {
	color: var(--color-ink-soft);
	line-height: 1.65;
}
.about-section ul {
	list-style: none;
	display: grid;
	gap: 0.75rem;
}
@media (max-width: 700px) {
	.about-intro {
		grid-template-columns: 1fr;
	}
	.image-wrapper {
		display: none;
	}
	.fit-grid {
		grid-template-columns: 1fr;
		gap: 0.75rem;
	}
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
