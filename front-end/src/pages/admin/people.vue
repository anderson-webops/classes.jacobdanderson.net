<script setup lang="ts">
import AdminProfile from "@/components/AdminProfile.vue";
import AdminWorkspaceShell from "@/components/AdminWorkspaceShell.vue";
</script>

<template>
	<AdminWorkspaceShell title="People and Access">
		<AdminProfile mode="people" />
	</AdminWorkspaceShell>
</template>

<route lang="yaml">
meta:
    layout: default
    requiresAdmin: true
</route>
