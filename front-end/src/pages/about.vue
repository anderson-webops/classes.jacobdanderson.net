<script lang="ts" setup>
/* DevTools / warning-friendly name */
defineOptions({ name: "AboutPage" });
</script>

<template>
        <section class="About py-5">
                <div class="container text-start">
                        <h1 class="display-6 fw-bold text-center">Meet Jacob</h1>
                        <p class="lead mt-4">
                                I'm an educator and engineer who loves helping students uncover the "why" behind every concept. At Juni
                                Learning I guided learners around the world through coding, math, science, and language programs. As the
                                company sunsets its services, I'm excited to continue supporting families directly with a flexible,
                                personalized approach.
                        </p>

                        <div class="row g-4 align-items-start mt-4">
                                <div class="col-lg-6">
                                        <h2 class="h4">Teaching philosophy</h2>
                                        <ul class="ps-3">
                                                <li>Start with a conversation to understand each student's goals, strengths, and interests.</li>
                                                <li>Build lessons that balance theory, hands-on practice, and real-world examples.</li>
                                                <li>Celebrate progress and use mistakes as opportunities to deepen understanding.</li>
                                                <li>Provide actionable feedback and resources after every session.</li>
                                        </ul>
                                </div>
                                <div class="col-lg-6">
                                        <h2 class="h4">Experience</h2>
                                        <ul class="ps-3">
                                                <li>Hundreds of hours tutoring Python, Java, C++, C, and full-stack web development.</li>
                                                <li>Specialized workshops covering introductory AI and machine learning.</li>
                                                <li>STEM mentoring in math and physics for middle school, high school, and college courses.</li>
                                                <li>Spanish language instruction for conversational, academic, and AP-level needs.</li>
                                        </ul>
                                </div>
                        </div>

                        <div class="mt-4">
                                <h2 class="h4">Beyond the classroom</h2>
                                <p>
                                        When I'm not teaching, you'll find me building software, exploring new educational tools, and investing in
                                        community projects. I'm always eager to collaborate with families to design learning experiences that match
                                        curiosity and pace.
                                </p>
                        </div>
                </div>
        </section>
</template>

<style scoped>
.About {
        background-color: #ffffff;
}

ul li::marker {
        color: #0d6efd;
}
</style>

<route lang="json">
{
        "meta": {
                "layout": "default"
        }
}
</route>
