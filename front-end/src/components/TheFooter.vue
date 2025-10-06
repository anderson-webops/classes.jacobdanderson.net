<script lang="ts" setup></script>

<template>
        <footer class="Footer text-center text-md-start py-4">
                <div class="container">
                        <div class="row gy-4">
                                <div class="col-md-4">
                                        <h2 class="h5">Jacob Anderson Tutoring</h2>
                                        <p class="mb-0">
                                                One-on-one instruction in programming, STEM, and Spanish for learners seeking confidence and clarity.
                                        </p>
                                </div>
                                <div class="col-md-4">
                                        <h3 class="h6">Stay connected</h3>
                                        <ul class="list-unstyled mb-0">
                                                <li>
                                                        <a
                                                                href="https://calendly.com/jacoba1100254352"
                                                                rel="noreferrer"
                                                                target="_blank"
                                                        >
                                                                Schedule a class
                                                        </a>
                                                </li>
                                                <li>
                                                        <a
                                                                href="https://www.venmo.com/u/jacoba1100254352-classes"
                                                                rel="noreferrer"
                                                                target="_blank"
                                                        >
                                                                Venmo payments
                                                        </a>
                                                </li>
                                        </ul>
                                </div>
                                <div class="col-md-4">
                                        <h3 class="h6">More from Jacob</h3>
                                        <ul class="list-unstyled mb-0">
                                                <li>
                                                        <a
                                                                href="https://www.linkedin.com/in/jacoba1100254352/"
                                                                rel="noreferrer"
                                                                target="_blank"
                                                        >
                                                                LinkedIn
                                                        </a>
                                                </li>
                                                <li>
                                                        <a
                                                                href="https://www.jacobdanderson.net"
                                                                rel="noreferrer"
                                                                target="_blank"
                                                        >
                                                                Portfolio site
                                                        </a>
                                                </li>
                                                <li>
                                                        <a
                                                                href="https://github.com/Jacoba1100254352/classes.jacobdanderson.net"
                                                                rel="noreferrer"
                                                                target="_blank"
                                                        >
                                                                Project repository
                                                        </a>
                                                </li>
                                        </ul>
                                </div>
                        </div>
                        <div class="mt-4 text-center small text-muted">
                                ©{{ new Date().getFullYear() }} Jacob Anderson. All rights reserved.
                        </div>
                </div>
        </footer>
</template>

<style scoped>
.Footer {
        background-color: #0d3b66;
        color: #f8f9fa;
}

.Footer a {
        color: #f8f9fa;
        text-decoration: none;
}

.Footer a:hover {
        text-decoration: underline;
}
</style>
