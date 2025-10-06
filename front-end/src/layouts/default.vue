<script lang="ts" setup>
import TheFooter from "~/components/TheFooter.vue";
import TheHeader from "~/components/TheHeader.vue";

defineOptions({ name: "DefaultLayout" });
</script>

<template>
        <div class="layout">
                <TheHeader />
                <main class="layout__main">
                        <RouterView />
                </main>
                <TheFooter />
        </div>
</template>

<style scoped>
.layout {
        display: flex;
        min-height: 100vh;
        flex-direction: column;
        background-color: #f6f8fb;
        color: #1e293b;
}

.layout__main {
        flex: 1;
}
</style>
