<script setup lang="ts">
defineOptions({ name: "ZellePaymentPage" });
</script>

<template>
	<section class="page-shell page-shell--narrow zelle-page">
		<header class="hero">
			<p class="page-eyebrow">Pay with Zelle</p>
			<h1 class="page-title">Zelle</h1>
			<p class="page-copy">
				Use the email below in your bank’s Zelle flow.
			</p>
		</header>

		<div class="zelle-card site-surface">
			<div class="zelle-copy">
				<p class="eyebrow">Zelle Email</p>
				<p class="zelle-email">classes@jacobdanderson.net</p>
			</div>

			<div class="actions">
				<RouterLink
					class="site-button site-button--secondary"
					to="/payment"
				>
					Back to Tuition
				</RouterLink>
			</div>
		</div>
	</section>
</template>

<style scoped>
.zelle-page {
	display: flex;
	flex-direction: column;
	gap: 2.5rem;
}

.hero {
	display: grid;
	gap: 1rem;
}

.zelle-card {
	display: grid;
	gap: 1.5rem;
	justify-items: center;
	padding: 2rem;
	text-align: center;
}

.zelle-copy {
	display: grid;
	gap: 0.75rem;
}

.eyebrow {
	margin: 0;
	text-transform: uppercase;
	letter-spacing: 0.18em;
	font-size: 0.8rem;
	font-weight: 700;
	color: var(--color-accent);
}

.zelle-email {
	margin: 0;
	font-size: clamp(1.25rem, 3vw, 1.7rem);
	font-weight: 700;
	color: var(--color-ink);
	word-break: break-word;
}

.actions {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 1rem;
}

@media (max-width: 640px) {
	.zelle-card {
		padding: 1.5rem;
	}

	.actions {
		flex-direction: column;
		width: 100%;
	}

	.actions > * {
		width: 100%;
	}
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
