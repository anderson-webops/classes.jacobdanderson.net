<script setup lang="ts">
import { defineAsyncComponent, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";

const CodeIdeWorkspace = defineAsyncComponent(
	() => import("@/components/CodeIdeWorkspace.vue")
);
const route = useRoute();
const router = useRouter();

onBeforeMount(() => {
	router.replace({
		hash: route.hash,
		path: "/ide",
		query: route.query
	});
});
</script>

<template>
	<CodeIdeWorkspace />
</template>
