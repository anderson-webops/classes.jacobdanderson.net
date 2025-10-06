<script lang="ts" setup>
defineOptions({ name: "HomePage" });

const subjectGroups = [
        {
                title: "Programming & Computer Science",
                description:
                        "Project-driven lessons tailored to each student's goals across introductory and advanced coursework.",
                items: [
                        "Python fundamentals through advanced topics like data structures and algorithms",
                        "Intro to Artificial Intelligence and Machine Learning",
                        "Java and C++ for AP CSA, AP CS A, and university-level classes",
                        "Modern web development with HTML, CSS, JavaScript, and TypeScript",
                        "C for embedded systems, memory management, and low-level problem solving",
                        "Creative coding in Scratch for younger learners"
                ]
        },
        {
                title: "STEM Foundations",
                description: "Confidence-building support for challenging schoolwork and enrichment projects.",
                items: [
                        "Middle school through college-level mathematics",
                        "Physics concepts, labs, and exam preparation"
                ]
        },
        {
                title: "Languages",
                description: "Immersive conversational and academic Spanish tutoring for learners of all levels.",
                items: ["Spanish language practice, grammar review, and cultural connections"]
        }
];

const classDetails = [
        "50-minute live sessions with an optional 10-minute buffer to wrap up questions",
        "$40 per class with transparent pricing and no long-term commitment",
        "Flexible scheduling to accommodate busy student calendars",
        "Personalized assignments and resources to reinforce each meeting"
];
</script>

<template>
        <section class="Home py-5">
                <div class="container">
                        <div class="row align-items-center g-5">
                                <div class="col-lg-7 text-start">
                                        <p class="eyebrow">Now offering one-on-one tutoring as Juni Learning transitions its programs.</p>
                                        <h1 class="display-5 fw-bold">Build skills. Gain confidence. Enjoy learning.</h1>
                                        <p class="lead mt-3">
                                                I'm Jacob Anderson, a longtime Juni Learning instructor now teaching independently. I partner with
                                                students to break down complex ideas, celebrate progress, and connect every lesson to real-world
                                                interests.
                                        </p>
                                        <div class="cta-buttons d-flex flex-wrap gap-3 mt-4">
                                                <a
                                                        class="btn btn-primary btn-lg"
                                                        href="https://calendly.com/jacoba1100254352"
                                                        rel="noreferrer"
                                                        target="_blank"
                                                >
                                                        Schedule a class
                                                </a>
                                                <a
                                                        class="btn btn-outline-secondary btn-lg"
                                                        href="https://www.venmo.com/u/jacoba1100254352-classes"
                                                        rel="noreferrer"
                                                        target="_blank"
                                                >
                                                        Venmo profile
                                                </a>
                                        </div>
                                        <div class="mt-4">
                                                <h2 class="h4">Class format</h2>
                                                <ul class="list-unstyled mt-2">
                                                        <li v-for="detail in classDetails" :key="detail" class="mb-2">
                                                                <span aria-hidden="true" class="check-icon me-2">✓</span>{{ detail }}
                                                        </li>
                                                </ul>
                                        </div>
                                </div>
                                <div class="col-lg-5 text-center">
                                        <img
                                                alt="Tutor working through code with a student"
                                                class="img-fluid rounded shadow"
                                                src="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=900&q=80"
                                        />
                                </div>
                        </div>

                        <div class="subjects mt-5 text-start">
                                <h2 class="h3">Subjects I teach</h2>
                                <div class="row row-cols-1 row-cols-md-2 g-4 mt-1">
                                        <div v-for="group in subjectGroups" :key="group.title" class="col">
                                                <div class="card h-100 shadow-sm">
                                                        <div class="card-body">
                                                                <h3 class="card-title h5">{{ group.title }}</h3>
                                                                <p class="card-text">{{ group.description }}</p>
                                                                <ul class="ps-3">
                                                                        <li v-for="item in group.items" :key="item">{{ item }}</li>
                                                                </ul>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>

                        <div class="mt-5 text-start">
                                <h2 class="h4">Ready to get started?</h2>
                                <p class="mb-3">
                                        Book a session through Calendly, connect with me on LinkedIn, or explore my portfolio to learn more
                                        about past projects and teaching philosophy.
                                </p>
                                <div class="d-flex flex-wrap gap-3">
                                        <a
                                                class="btn btn-outline-primary"
                                                href="https://www.linkedin.com/in/jacoba1100254352/"
                                                rel="noreferrer"
                                                target="_blank"
                                        >
                                                Connect on LinkedIn
                                        </a>
                                        <a
                                                class="btn btn-outline-primary"
                                                href="https://www.jacobdanderson.net"
                                                rel="noreferrer"
                                                target="_blank"
                                        >
                                                Visit my portfolio
                                        </a>
                                </div>
                        </div>
                </div>
        </section>
</template>

<style scoped>
.Home {
        background: linear-gradient(180deg, #f7fbff 0%, #ffffff 100%);
}

.eyebrow {
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #0d6efd;
        font-weight: 600;
}

.card-title {
        color: #0d3b66;
}

.card-text {
        color: #495057;
}

ul li::marker {
        color: #0d6efd;
}

.check-icon {
        color: #0d6efd;
        font-weight: 700;
}
</style>

<route lang="json">
{
        "meta": {
                "layout": "default"
        }
}
</route>
