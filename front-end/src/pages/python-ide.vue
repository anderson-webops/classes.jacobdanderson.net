<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

onMounted(() => {
	router.replace({
		hash: route.hash,
		path: "/ide",
		query: route.query
	});
});
</script>

<template>
	<p class="sr-only">Opening the Code IDE.</p>
</template>
