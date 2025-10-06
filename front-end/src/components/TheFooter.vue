<script lang="ts" setup>
const currentYear = new Date().getFullYear();
</script>

<template>
        <footer class="footer">
                <div class="footer__inner">
                        <div class="footer__column">
                                <h2 class="footer__title">Let's learn together</h2>
                                <p class="footer__description">
                                        Personalized one-on-one tutoring for students ready to dive deeper into programming, STEM,
                                        and language learning.
                                </p>
                        </div>
                        <div class="footer__column">
                                <h3 class="footer__heading">Book a session</h3>
                                <a
                                        class="footer__link"
                                        href="https://calendly.com/jacoba1100254352"
                                        rel="noopener noreferrer"
                                        target="_blank"
                                >
                                        Schedule on Calendly
                                </a>
                                <a
                                        class="footer__link"
                                        href="https://www.venmo.com/u/jacoba1100254352-classes"
                                        rel="noopener noreferrer"
                                        target="_blank"
                                >
                                        Pay via Venmo
                                </a>
                        </div>
                        <div class="footer__column">
                                <h3 class="footer__heading">Connect</h3>
                                <a
                                        class="footer__link"
                                        href="https://www.linkedin.com/in/jacoba1100254352/"
                                        rel="noopener noreferrer"
                                        target="_blank"
                                >
                                        LinkedIn
                                </a>
                                <a
                                        class="footer__link"
                                        href="https://www.jacobdanderson.net"
                                        rel="noopener noreferrer"
                                        target="_blank"
                                >
                                        Portfolio Site
                                </a>
                        </div>
                </div>
                <p class="footer__note">© {{ currentYear }} Jacob Anderson. All rights reserved.</p>
        </footer>
</template>

<style scoped>
.footer {
        margin-top: auto;
        padding: 3rem 1.5rem 2rem;
        background: #0f172a;
        color: #e2e8f0;
}

.footer__inner {
        display: grid;
        gap: 2.5rem;
        margin: 0 auto;
        max-width: 1100px;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.footer__title {
        font-size: clamp(1.4rem, 3vw, 1.8rem);
        margin-bottom: 1rem;
}

.footer__description {
        line-height: 1.6;
        color: #cbd5f5;
        max-width: 30ch;
}

.footer__heading {
        font-size: 1rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        margin-bottom: 0.75rem;
        text-transform: uppercase;
        color: #94a3b8;
}

.footer__link {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        margin-bottom: 0.35rem;
        font-weight: 500;
        color: inherit;
        transition: color 0.2s ease;
}

.footer__link:hover,
.footer__link:focus-visible {
        color: #38bdf8;
}

.footer__note {
        margin: 2.5rem auto 0;
        max-width: 1100px;
        color: #94a3b8;
        font-size: 0.875rem;
        text-align: center;
}
</style>
