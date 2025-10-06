<script lang="ts" setup>
defineOptions({ name: "SiteFooter" });
</script>

<template>
        <footer class="site-footer">
                <div class="container">
                        <div class="footer-brand">
                                <h2>Ready to learn with Jacob?</h2>
                                <p>
                                        Personalized 1:1 instruction in coding, STEM, and language topics with flexible scheduling
                                        for students around the world.
                                </p>
                        </div>
                        <div class="footer-links">
                                <h3>Stay connected</h3>
                                <ul>
                                        <li>
                                                <a href="mailto:classes@jacobdanderson.net">classes@jacobdanderson.net</a>
                                        </li>
                                        <li>
                                                <a href="https://calendly.com/jacoba1100254352" target="_blank" rel="noreferrer">Schedule on Calendly</a>
                                        </li>
                                        <li>
                                                <a href="https://www.venmo.com/u/jacoba1100254352-classes" target="_blank" rel="noreferrer">Venmo @jacoba1100254352-classes</a>
                                        </li>
                                        <li>
                                                <a href="https://www.linkedin.com/in/jacoba1100254352/" target="_blank" rel="noreferrer">LinkedIn</a>
                                        </li>
                                        <li>
                                                <a href="https://www.jacobdanderson.net" target="_blank" rel="noreferrer">jacobdanderson.net</a>
                                        </li>
                                </ul>
                        </div>
                </div>
                <p class="footnote">© {{ new Date().getFullYear() }} Jacob D. Anderson. All rights reserved.</p>
        </footer>
</template>

<style scoped>
.site-footer {
        background: #0f172a;
        color: #e2e8f0;
        padding: 3rem 1.5rem 2rem;
        margin-top: 4rem;
}

.container {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
        max-width: 1100px;
        margin: 0 auto 2rem;
        align-items: flex-start;
        justify-content: space-between;
}

.footer-brand {
        flex: 1 1 320px;
}

.footer-brand h2 {
        font-size: 1.5rem;
        margin-bottom: 0.75rem;
}

.footer-links {
        flex: 1 1 220px;
}

.footer-links h3 {
        font-size: 1.125rem;
        margin-bottom: 0.75rem;
}

.footer-links ul {
        display: grid;
        gap: 0.5rem;
        padding: 0;
        margin: 0;
        list-style: none;
}

.footer-links a {
        color: inherit;
        text-decoration: none;
        font-weight: 500;
}

.footer-links a:focus-visible,
.footer-links a:hover {
        color: #93c5fd;
}

.footnote {
        text-align: center;
        margin: 0;
        font-size: 0.875rem;
        color: #94a3b8;
}

@media (max-width: 768px) {
        .site-footer {
                padding: 2.5rem 1.25rem 2rem;
        }
}
</style>
