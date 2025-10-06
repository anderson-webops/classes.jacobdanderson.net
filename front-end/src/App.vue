<script lang="ts" setup>
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
        title: "Jacob Anderson Tutoring",
        meta: [
                {
                        name: "description",
                        content:
                                "Personalized 1:1 tutoring in programming, STEM, and Spanish with instructor Jacob Anderson."
                },
                {
                        name: "theme-color",
                        content: () => (isDark.value ? "#0b7285" : "#f8fafc")
                }
        ],
	link: [
		{
			rel: "icon",
			type: "image/svg+xml",
			// This is identical for both dark and light mode for now
			href: () =>
				preferredDark.value
					? "/Favicons/favicon.ico"
					: "/Favicons/favicon.ico"
		}
	]
});
</script>

<template>
	<RouterView />
</template>

<style></style>
