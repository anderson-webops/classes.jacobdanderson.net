<script lang="ts" setup>
import { ref } from "vue";

const isMenuOpen = ref(false);

const navigationLinks = [
        { label: "About", hash: "#about" },
        { label: "Subjects", hash: "#subjects" },
        { label: "Approach", hash: "#approach" },
        { label: "Schedule", hash: "#schedule" },
        { label: "Payment", hash: "#payment" }
];

function toggleMenu() {
        isMenuOpen.value = !isMenuOpen.value;
}

function closeMenu() {
        isMenuOpen.value = false;
}
</script>

<template>
        <header class="site-header">
                <div class="container">
                        <RouterLink class="brand" to="/" @click="closeMenu">
                                Jacob Anderson Tutoring
                        </RouterLink>

                        <button
                                class="menu-toggle"
                                type="button"
                                :aria-expanded="isMenuOpen"
                                aria-controls="primary-navigation"
                                @click="toggleMenu"
                        >
                                <span class="sr-only">Toggle navigation</span>
                                <span class="menu-toggle__bar" />
                                <span class="menu-toggle__bar" />
                                <span class="menu-toggle__bar" />
                        </button>

                        <nav
                                id="primary-navigation"
                                class="navigation"
                                :class="{ 'navigation--open': isMenuOpen }"
                        >
                                <RouterLink
                                        v-for="link in navigationLinks"
                                        :key="link.label"
                                        class="navigation__link"
                                        :to="{ path: '/', hash: link.hash }"
                                        @click="closeMenu"
                                >
                                        {{ link.label }}
                                </RouterLink>
                                <a
                                        class="navigation__cta"
                                        href="https://calendly.com/jacoba1100254352"
                                        rel="noopener noreferrer"
                                        target="_blank"
                                        @click="closeMenu"
                                >
                                        Schedule a Class
                                </a>
                        </nav>
                </div>
        </header>
</template>

<style scoped>
.site-header {
        position: sticky;
        top: 0;
        z-index: 20;
        width: 100%;
        backdrop-filter: blur(12px);
        background-color: rgba(248, 250, 252, 0.9);
        border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 auto;
        max-width: 1100px;
        padding: 0.75rem 1.5rem;
        gap: 1rem;
        position: relative;
}

.brand {
        font-size: clamp(1.1rem, 2.5vw, 1.5rem);
        font-weight: 700;
        letter-spacing: -0.01em;
}

.menu-toggle {
        display: none;
        flex-direction: column;
        gap: 0.3rem;
        border: none;
        background: none;
        padding: 0.5rem;
        cursor: pointer;
}

.menu-toggle:focus-visible {
        outline: 2px solid #0ea5e9;
        outline-offset: 3px;
}

.menu-toggle__bar {
        width: 22px;
        height: 2px;
        background-color: #0f172a;
        border-radius: 9999px;
        transition: transform 0.2s ease, opacity 0.2s ease;
}

.navigation {
        display: flex;
        align-items: center;
        gap: 1.5rem;
}

.navigation__link,
.navigation__cta {
        font-weight: 500;
        transition: color 0.2s ease;
}

.navigation__link:hover,
.navigation__link:focus-visible,
.navigation__cta:hover,
.navigation__cta:focus-visible {
        color: #0ea5e9;
}

.navigation__cta {
        padding: 0.5rem 1.25rem;
        border-radius: 999px;
        background: #0ea5e9;
        color: #f8fafc;
        font-weight: 600;
        box-shadow: 0 10px 30px -15px rgba(14, 165, 233, 0.7);
}

.navigation__cta:hover,
.navigation__cta:focus-visible {
        background: #0284c7;
        color: #f8fafc;
}

.sr-only {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
}

@media (max-width: 900px) {
        .menu-toggle {
                display: flex;
        }

        .navigation {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                display: grid;
                gap: 0.75rem;
                padding: 1rem 1.5rem 1.75rem;
                background: rgba(248, 250, 252, 0.98);
                border-bottom: 1px solid rgba(15, 23, 42, 0.08);
                transform: translateY(-10px);
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .navigation--open {
                transform: translateY(0);
                opacity: 1;
                pointer-events: auto;
        }
}

@media (max-width: 600px) {
        .container {
                padding-inline: 1rem;
        }
}
</style>
