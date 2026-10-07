<script lang="ts" setup>
defineOptions({ name: "PaymentPage" });
useHead({
	title: "Payment",
	meta: [
		{
			name: "description",
			content: "Payment methods for private classes with Jacob Anderson."
		}
	],
	link: [
		{
			rel: "canonical",
			href: "https://classes.jacobdanderson.net/payment"
		}
	]
});
</script>

<template>
	<section class="page-shell payment-page">
		<div class="payment-hero">
			<h1 class="page-title">Payment</h1>
			<!-- Keep this rate description commented out for now.
			<p class="page-copy">
				Private one-on-one sessions are $40 for 50 minutes.
			</p>
			-->
			<div class="tuition-card">
				<div class="rate">
					<span class="amount">$40</span>
					<span class="details">Per Session • 50 Minutes</span>
				</div>
				<p class="payment-policy">Pay only for classes taught</p>
			</div>
		</div>

		<section
			aria-labelledby="payment-title"
			class="payment-section site-surface site-surface--soft"
		>
			<h2 id="payment-title" class="section-title">How to Pay</h2>
			<div class="site-action-row">
				<a
					class="site-button site-button--primary"
					href="https://www.venmo.com/u/jacoba1100254352-classes"
					rel="noopener noreferrer"
					target="_blank"
				>
					Open Venmo<span class="sr-only"> (opens in a new tab)</span>
				</a>
				<RouterLink
					class="site-button site-button--secondary"
					to="/zelle"
				>
					Pay with Zelle
				</RouterLink>
			</div>
			<p class="payment-alternative">
				Need another option?
				<a class="text-link" href="mailto:classes@jacobdanderson.net">
					Email Jacob</a
				>.
			</p>
		</section>
	</section>
</template>

<style scoped>
.payment-page {
	gap: 1.5rem;
}
.payment-hero {
	display: grid;
	gap: 1rem;
}
.tuition-card {
	padding: 1.5rem;
	border-radius: 16px;
	background: linear-gradient(135deg, #1f3d5a, #3a6ea5);
	color: white;
	display: grid;
	gap: 1rem;
	max-width: 32rem;
}
.rate {
	display: flex;
	flex-direction: column;
	gap: 0.35rem;
	align-items: center;
}
.amount {
	font-size: clamp(2.5rem, 5vw, 3.5rem);
	font-weight: 700;
}
.details {
	font-size: 0.95rem;
}
.payment-policy {
	margin: 0;
	text-align: center;
	color: #bbf7d0;
	font-weight: 600;
}
.payment-section {
	display: grid;
	gap: 1rem;
	padding: clamp(1rem, 3vw, 1.5rem);
}
.payment-alternative {
	color: var(--color-ink-soft);
	margin: 0;
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
