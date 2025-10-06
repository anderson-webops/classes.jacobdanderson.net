<script lang="ts" setup>
const subjectGroups = [
        {
                title: "Programming & Computer Science",
                description: "Structured pathways for brand-new coders through advanced builders ready for AI and ML.",
                items: [
                        "Python (Intro to AI & Intro to Machine Learning)",
                        "Java",
                        "C++",
                        "C",
                        "HTML, CSS, and modern JavaScript/TypeScript",
                        "Scratch"
                ]
        },
        {
                title: "STEM Enrichment",
                description: "Deepen understanding with guided practice, problem-solving strategies, and real-world examples.",
                items: [
                        "Mathematics",
                        "Physics"
                ]
        },
        {
                title: "Language Learning",
                description: "Build conversational and academic Spanish skills with immersive tutoring.",
                items: [
                        "Spanish"
                ]
        }
];

const approachHighlights = [
        {
                title: "Experienced instructor",
                description:
                        "Former Juni Learning tutor providing continuity for families as the platform winds down—now offering flexible, direct scheduling."
        },
        {
                title: "Personalized pacing",
                description:
                        "Every session is built around student goals, from mastering fundamentals to preparing for AP exams or coding competitions."
        },
        {
                title: "Project-centered learning",
                description:
                        "Students tackle meaningful projects that reinforce concepts and build confidence with real tools and technologies."
        }
];
</script>

<template>
        <div class="page">
                <section id="about" class="hero">
                        <div class="hero__content">
                                <p class="hero__eyebrow">Jacob Anderson · Private Tutoring</p>
                                <h1 class="hero__title">Keep your learning momentum going.</h1>
                                <p class="hero__subtitle">
                                        I'm Jacob, a former Juni Learning instructor now working independently with students who want
                                        one-on-one support in programming, STEM, and Spanish.
                                </p>
                                <ul class="hero__details">
                                        <li>50-minute lessons with optional 10-minute extension to wrap up questions.</li>
                                        <li>$40 per class, billed after each session.</li>
                                        <li>Flexible scheduling to match your weekly cadence.</li>
                                </ul>
                                <div class="hero__actions">
                                        <a
                                                class="button button--primary"
                                                href="https://calendly.com/jacoba1100254352"
                                                rel="noopener noreferrer"
                                                target="_blank"
                                        >
                                                Schedule a class
                                        </a>
                                        <a
                                                class="button button--ghost"
                                                href="https://www.venmo.com/u/jacoba1100254352-classes"
                                                rel="noopener noreferrer"
                                                target="_blank"
                                        >
                                                Pay via Venmo
                                        </a>
                                </div>
                        </div>
                        <div class="hero__card">
                                <h2>What students gain</h2>
                                <p>Clear explanations, hands-on practice, and tailored feedback every time we meet.</p>
                                <ul>
                                        <li>Curriculum matched to personal goals</li>
                                        <li>Session recaps and next steps</li>
                                        <li>Encouraging, growth-focused environment</li>
                                </ul>
                        </div>
                </section>

                <section id="subjects" class="subjects">
                        <h2>Subjects offered</h2>
                        <p class="subjects__intro">
                                Choose a focused pathway or mix and match topics across programming, STEM, and language studies.
                        </p>
                        <div class="subjects__grid">
                                <article v-for="group in subjectGroups" :key="group.title" class="subjects__card">
                                        <h3>{{ group.title }}</h3>
                                        <p>{{ group.description }}</p>
                                        <ul>
                                                <li v-for="item in group.items" :key="item">{{ item }}</li>
                                        </ul>
                                </article>
                        </div>
                </section>

                <section id="approach" class="approach">
                        <h2>How we’ll work together</h2>
                        <div class="approach__grid">
                                <article v-for="highlight in approachHighlights" :key="highlight.title" class="approach__card">
                                        <h3>{{ highlight.title }}</h3>
                                        <p>{{ highlight.description }}</p>
                                </article>
                        </div>
                </section>

                <section id="schedule" class="schedule">
                        <div class="schedule__content">
                                <h2>Schedule your next class</h2>
                                <p>
                                        Pick a time that works best for you using Calendly. You'll receive a confirmation email with the
                                        meeting link right away.
                                </p>
                                <div class="schedule__embed">
                                        <iframe
                                                title="Calendly scheduling"
                                                src="https://calendly.com/jacoba1100254352?hide_gdpr_banner=1"
                                                width="100%"
                                                height="630"
                                                frameborder="0"
                                        ></iframe>
                                </div>
                        </div>
                </section>

                <section id="payment" class="payment">
                        <div class="payment__content">
                                <h2>Simple payment with Venmo</h2>
                                <p>
                                        Sessions are $40 each. After class, submit payment directly through Venmo using the button below or
                                        by searching for <strong>@jacoba1100254352-classes</strong>.
                                </p>
                                <a
                                        class="button button--primary"
                                        href="https://www.venmo.com/u/jacoba1100254352-classes"
                                        rel="noopener noreferrer"
                                        target="_blank"
                                >
                                        Open Venmo profile
                                </a>
                        </div>
                        <div class="payment__card">
                                <h3>Need a receipt?</h3>
                                <p>
                                        I'm happy to provide session summaries or invoices upon request—just add a note in Calendly or send
                                        me a message after booking.
                                </p>
                        </div>
                </section>

                <section class="cta">
                        <div class="cta__inner">
                                <h2>Ready to get started?</h2>
                                <p>
                                        Whether you’re continuing from Juni Learning or beginning something new, we’ll tailor each lesson to
                                        your goals.
                                </p>
                                <div class="cta__actions">
                                        <a
                                                class="button button--primary"
                                                href="https://calendly.com/jacoba1100254352"
                                                rel="noopener noreferrer"
                                                target="_blank"
                                        >
                                                Book your first session
                                        </a>
                                        <a
                                                class="button button--ghost"
                                                href="https://www.linkedin.com/in/jacoba1100254352/"
                                                rel="noopener noreferrer"
                                                target="_blank"
                                        >
                                                Connect on LinkedIn
                                        </a>
                                </div>
                        </div>
                </section>
        </div>
</template>

<style scoped>
.page {
        display: flex;
        flex-direction: column;
        gap: 6rem;
        padding-bottom: 6rem;
}

section {
        padding-inline: clamp(1rem, 5vw, 3rem);
}

.hero {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 3rem;
        align-items: stretch;
        padding-top: clamp(2rem, 8vw, 6rem);
}

.hero__content {
        display: flex;
        flex-direction: column;
        gap: 1.75rem;
}

.hero__eyebrow {
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #0ea5e9;
        font-weight: 600;
        font-size: 0.85rem;
}

.hero__title {
        font-size: clamp(2.25rem, 4vw, 3.5rem);
        line-height: 1.05;
        color: #0f172a;
        letter-spacing: -0.02em;
}

.hero__subtitle {
        font-size: clamp(1.05rem, 2.2vw, 1.35rem);
        line-height: 1.7;
        color: #334155;
}

.hero__details {
        display: grid;
        gap: 0.65rem;
        padding-left: 1.1rem;
        color: #475569;
}

.hero__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
}

.hero__card {
        background: linear-gradient(160deg, rgba(14, 165, 233, 0.1), rgba(14, 165, 233, 0.25));
        border-radius: 24px;
        padding: 2.25rem;
        box-shadow: 0 30px 60px -40px rgba(15, 23, 42, 0.5);
        display: flex;
        flex-direction: column;
        gap: 1rem;
}

.hero__card h2 {
        font-size: 1.4rem;
        color: #0f172a;
}

.hero__card p {
        color: #1e293b;
        line-height: 1.6;
}

.hero__card ul {
        display: grid;
        gap: 0.5rem;
        padding-left: 1.1rem;
        color: #0f172a;
}

.subjects {
        text-align: center;
}

.subjects h2,
.approach h2,
.schedule h2,
.payment h2,
.cta h2 {
        font-size: clamp(1.8rem, 3vw, 2.4rem);
        margin-bottom: 1rem;
        color: #0f172a;
}

.subjects__intro {
        max-width: 60ch;
        margin: 0 auto 2.5rem;
        color: #475569;
        line-height: 1.7;
}

.subjects__grid {
        display: grid;
        gap: 2rem;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.subjects__card {
        background: #ffffff;
        border-radius: 22px;
        padding: 2rem;
        box-shadow: 0 24px 45px -35px rgba(15, 23, 42, 0.25);
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
}

.subjects__card h3 {
        font-size: 1.25rem;
        color: #0f172a;
}

.subjects__card p {
        color: #475569;
}

.subjects__card ul {
        padding-left: 1.1rem;
        display: grid;
        gap: 0.5rem;
        color: #0f172a;
}

.approach {
        padding-block: 2rem;
}

.approach__grid {
        display: grid;
        gap: 2rem;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.approach__card {
        background: rgba(14, 165, 233, 0.08);
        border-radius: 20px;
        padding: 1.75rem;
        color: #0f172a;
        box-shadow: inset 0 0 0 1px rgba(14, 165, 233, 0.3);
        display: grid;
        gap: 0.75rem;
}

.approach__card h3 {
        font-size: 1.2rem;
        font-weight: 600;
}

.approach__card p {
        color: #1e293b;
        line-height: 1.6;
}

.schedule {
        display: grid;
        gap: 2rem;
}

.schedule__content {
        background: #ffffff;
        border-radius: 28px;
        padding: clamp(2rem, 4vw, 3rem);
        box-shadow: 0 40px 80px -60px rgba(15, 23, 42, 0.35);
}

.schedule__content p {
        color: #475569;
        margin-bottom: 1.5rem;
        line-height: 1.7;
}

.schedule__embed {
        border-radius: 18px;
        overflow: hidden;
        border: 1px solid rgba(226, 232, 240, 0.8);
        background: #f8fafc;
}

.schedule__embed iframe {
        display: block;
        width: 100%;
        min-height: 630px;
}

.payment {
        display: grid;
        gap: 2rem;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        align-items: start;
}

.payment__content,
.payment__card {
        background: #ffffff;
        border-radius: 24px;
        padding: clamp(2rem, 4vw, 2.75rem);
        box-shadow: 0 30px 60px -50px rgba(15, 23, 42, 0.3);
        display: grid;
        gap: 1rem;
}

.payment__content p,
.payment__card p {
        color: #475569;
        line-height: 1.7;
}

.payment__card h3 {
        font-size: 1.3rem;
        color: #0f172a;
}

.cta {
        padding-block: 0 4rem;
}

.cta__inner {
        margin: 0 auto;
        max-width: 780px;
        text-align: center;
        background: linear-gradient(140deg, rgba(14, 165, 233, 0.2), rgba(14, 165, 233, 0.35));
        padding: clamp(2.5rem, 5vw, 3.5rem);
        border-radius: 28px;
        box-shadow: 0 40px 80px -70px rgba(14, 165, 233, 0.7);
        display: grid;
        gap: 1.25rem;
}

.cta__inner p {
        color: #1e293b;
        line-height: 1.6;
}

.cta__actions {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 1rem;
}

.button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        border-radius: 999px;
        padding: 0.85rem 1.75rem;
        font-weight: 600;
        transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.button--primary {
        background: #0ea5e9;
        color: #f8fafc;
        box-shadow: 0 20px 40px -20px rgba(14, 165, 233, 0.6);
}

.button--primary:hover,
.button--primary:focus-visible {
        background: #0284c7;
        transform: translateY(-1px);
}

.button--ghost {
        background: transparent;
        color: #0f172a;
        border: 1px solid rgba(15, 23, 42, 0.15);
}

.button--ghost:hover,
.button--ghost:focus-visible {
        border-color: #0ea5e9;
        color: #0ea5e9;
        transform: translateY(-1px);
}

@media (max-width: 768px) {
        .hero__card {
                order: -1;
        }

        .hero__actions {
                flex-direction: column;
                align-items: stretch;
        }

        .schedule__embed iframe {
                min-height: 540px;
        }
}

@media (max-width: 600px) {
        .hero {
                gap: 2.5rem;
        }

        .page {
                gap: 4rem;
        }
}
</style>
