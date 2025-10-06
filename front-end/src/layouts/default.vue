<script lang="ts" setup>
import TheFooter from "~/components/TheFooter.vue";
import TheHeader from "~/components/TheHeader.vue";
</script>

<template>
        <main class="layout">
                <TheHeader />
                <RouterView />
                <TheFooter />
        </main>
</template>

<style scoped>
.layout {
        display: flex;
        min-height: 100vh;
        flex-direction: column;
        background: linear-gradient(180deg, rgba(248, 250, 252, 1) 0%, rgba(241, 245, 249, 1) 50%, #ffffff 100%);
        color: #0f172a;
}

.layout :deep(main),
.layout :deep(section) {
        font-family: "Inter", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.layout :deep(a) {
        color: inherit;
        text-decoration: none;
}

.layout :deep(a:hover) {
        text-decoration: underline;
}
</style>
