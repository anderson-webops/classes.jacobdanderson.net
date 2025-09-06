<script lang="ts" setup>
/* DevTools / warning-friendly name */
defineOptions({ name: "AboutPage" });
</script>

<template>
	<!-------------
  -   Section   -
  -------------->

	<section class="About text-center">
		<h1>About Us</h1>
		<h2>Mission:</h2>
		<img
			alt="Smiling creepy college student"
			class="m-5"
			src="https://tenneyschool.com/wp-content/uploads/2016/11/Confident-Student.jpg"
			width="40%"
		/>
		<p class="mt-3">
			I started tutoring because I love helping people learn and succeed.
			My mission is to provide high-quality, affordable tutoring services
			to students of all ages and backgrounds. I believe that everyone
			deserves access to quality education, and I'm committed to helping
			my students achieve their academic goals. Learn more about me at
			jacobdanderson.net!
		</p>
	</section>
</template>

<style scoped>
p {
	font-size: 15px;
	margin: 0 10%;
}
</style>
