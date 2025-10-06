<script lang="ts" setup>
import { ref } from "vue";

const menuOpen = ref(false);

const navItems = [
        { label: "Services", href: "#services" },
        { label: "Approach", href: "#approach" },
        { label: "Schedule", href: "#schedule" },
        { label: "Pricing", href: "#pricing" },
        { label: "Contact", href: "#contact" },
];

function toggleMenu() {
        menuOpen.value = !menuOpen.value;
}

function closeMenu() {
        menuOpen.value = false;
}
</script>

<template>
        <header class="site-header">
                <div class="container">
                        <RouterLink class="logo" to="/" @click="closeMenu">
                                Jacob D. Anderson Classes
                        </RouterLink>
                        <button
                                class="menu-button"
                                type="button"
                                @click="toggleMenu"
                        >
                                <span class="sr-only">Toggle navigation</span>
                                <span :class="['menu-icon', { 'menu-icon--open': menuOpen }]" />
                        </button>
                        <nav :class="['nav-links', { 'nav-links--open': menuOpen }]">
                                <a
                                        v-for="item in navItems"
                                        :key="item.href"
                                        :href="item.href"
                                        class="nav-link"
                                        @click="closeMenu"
                                >
                                        {{ item.label }}
                                </a>
                        </nav>
                </div>
        </header>
</template>

<style scoped>
.site-header {
        position: sticky;
        top: 0;
        z-index: 10;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(16px);
        border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1.5rem;
        max-width: 1100px;
        margin: 0 auto;
        padding: 1rem 1.5rem;
}

.logo {
        font-size: 1.125rem;
        font-weight: 700;
        color: #0f172a;
        text-decoration: none;
}

.menu-button {
        display: none;
        align-items: center;
        justify-content: center;
        width: 2.75rem;
        height: 2.75rem;
        border-radius: 9999px;
        border: none;
        background: #e2e8f0;
        cursor: pointer;
        transition: background 0.2s ease-in-out;
}

.menu-button:focus-visible,
.menu-button:hover {
        background: #cbd5f5;
}

.sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
}

.menu-icon,
.menu-icon::before,
.menu-icon::after {
        display: block;
        width: 1.5rem;
        height: 2px;
        border-radius: 9999px;
        background: #1e293b;
        transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
        content: "";
}

.menu-icon {
        position: relative;
}

.menu-icon::before {
        position: absolute;
        top: -0.4rem;
        left: 0;
}

.menu-icon::after {
        position: absolute;
        bottom: -0.4rem;
        left: 0;
}

.menu-icon--open {
        background: transparent;
}

.menu-icon--open::before {
        transform: translateY(0.4rem) rotate(45deg);
}

.menu-icon--open::after {
        transform: translateY(-0.4rem) rotate(-45deg);
}

.nav-links {
        display: flex;
        align-items: center;
        gap: 1.5rem;
}

.nav-link {
        font-weight: 600;
        color: #475569;
        text-decoration: none;
        transition: color 0.2s ease-in-out;
}

.nav-link:focus-visible,
.nav-link:hover {
        color: #1d4ed8;
}

@media (max-width: 768px) {
        .menu-button {
                display: inline-flex;
        }

        .nav-links {
                position: absolute;
                top: 100%;
                right: 1.5rem;
                display: none;
                flex-direction: column;
                align-items: flex-start;
                gap: 0.75rem;
                margin-top: 0.75rem;
                padding: 1rem 1.25rem;
                background: #ffffff;
                border-radius: 0.75rem;
                box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
        }

        .nav-links--open {
                display: flex;
        }
}
</style>
