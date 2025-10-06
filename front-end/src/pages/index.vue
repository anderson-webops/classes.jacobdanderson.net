<script lang="ts" setup>
const subjects = [
        {
                title: "Programming & Computer Science",
                description:
                        "Python (including Intro to AI and Machine Learning), Java, C++, and C for students preparing for coursework, competitions, or college prep.",
        },
        {
                title: "Web Design & Development",
                description: "HTML, CSS, JavaScript, and TypeScript to build responsive, accessible websites and interactive projects.",
        },
        {
                title: "Creative Coding for New Learners",
                description: "Scratch and visual programming that make foundational concepts fun and approachable for younger students.",
        },
        {
                title: "Academic Tutoring",
                description: "Math, Physics, and Spanish support with clear explanations, structured practice, and confidence-building feedback.",
        },
];

const approach = [
        "Personalized pacing with lesson plans shaped around each learner's goals, whether that's mastering a topic or staying ahead of classwork.",
        "Project-based sessions that encourage curiosity and help students apply concepts to real-world challenges.",
        "Consistent communication with families about progress, next steps, and optional enrichment between classes.",
];
</script>

<template>
        <div class="home">
                <section id="hero" class="hero">
                        <div class="hero__content">
                                <p class="eyebrow">Jacob D. Anderson · Private Instruction</p>
                                <h1>One-on-one tutoring for curious coders, makers, and scholars</h1>
                                <p class="lead">
                                        Transitioning from Juni Learning to independent instruction, I offer flexible, high-impact tutoring for
                                        students ready to dive deeper into programming, STEM, and language studies.
                                </p>
                                <div class="hero__cta">
                                        <a class="button button--primary" href="#schedule">Schedule a class</a>
                                        <a class="button" href="#contact">Ask a question</a>
                                </div>
                        </div>
                        <div class="hero__card">
                                <h2>Sessions at a glance</h2>
                                <ul>
                                        <li>50 minute live session (with a 10 minute buffer if we need to wrap up a project)</li>
                                        <li>$40 per class · pay via Venmo</li>
                                        <li>Online lessons for students worldwide</li>
                                        <li>Curriculum tailored to your goals—no canned scripts</li>
                                </ul>
                        </div>
                </section>

                <section id="services" class="section">
                        <div class="section__header">
                                <h2>What I teach</h2>
                                <p>
                                        From first lines of code to advanced coursework, we'll focus on practical skills, clear explanations, and projects
                                        your learner is excited to build.
                                </p>
                        </div>
                        <div class="card-grid">
                                <article v-for="subject in subjects" :key="subject.title" class="card">
                                        <h3>{{ subject.title }}</h3>
                                        <p>{{ subject.description }}</p>
                                </article>
                        </div>
                </section>

                <section id="approach" class="section section--muted">
                        <div class="section__header">
                                <h2>How sessions work</h2>
                                <p>
                                        Lessons are personal, collaborative, and rooted in real-world practice so every minute supports lasting growth.
                                </p>
                        </div>
                        <ul class="approach-list">
                                <li v-for="point in approach" :key="point">{{ point }}</li>
                        </ul>
                </section>

                <section id="schedule" class="section schedule">
                        <div class="section__header">
                                <h2>Book a session</h2>
                                <p>Choose a time on Calendly that fits your schedule. Need something different? Email me and we'll find a spot.</p>
                        </div>
                        <div class="schedule__grid">
                                <div class="schedule__details">
                                        <h3>Flexible scheduling</h3>
                                        <p>
                                                Sessions typically run on weekday afternoons and evenings (Mountain Time), with additional availability by request for
                                                international learners.
                                        </p>
                                        <p>
                                                Prefer to plan together? Reach out at
                                                <a href="mailto:classes@jacobdanderson.net">classes@jacobdanderson.net</a>
                                                and I will personally confirm within one business day.
                                        </p>
                                        <div class="button-group">
                                                <a
                                                        class="button button--primary"
                                                        href="https://calendly.com/jacoba1100254352"
                                                        rel="noreferrer"
                                                        target="_blank"
                                                >
                                                        Open Calendly
                                                </a>
                                                <a
                                                        class="button"
                                                        href="https://www.venmo.com/u/jacoba1100254352-classes"
                                                        rel="noreferrer"
                                                        target="_blank"
                                                >
                                                        Pay on Venmo
                                                </a>
                                        </div>
                                </div>
                                <div class="schedule__embed">
                                        <iframe
                                                allowtransparency="true"
                                                frameborder="0"
                                                height="630"
                                                src="https://calendly.com/jacoba1100254352?hide_event_type_details=1&hide_gdpr_banner=1"
                                                title="Schedule a class with Jacob"
                                        />
                                </div>
                        </div>
                </section>

                <section id="pricing" class="section">
                        <div class="pricing">
                                <h2>Simple pricing</h2>
                                <p class="pricing__rate">$40 per 50-minute class</p>
                                <ul>
                                        <li>Includes prep time, curated resources, and follow-up notes.</li>
                                        <li>Extra 10-minute buffer at no additional cost when we need to finish a concept or problem.</li>
                                        <li>Payments accepted via Venmo at <strong>@jacoba1100254352-classes</strong>.</li>
                                </ul>
                                <a
                                        class="button button--primary"
                                        href="https://www.venmo.com/u/jacoba1100254352-classes"
                                        rel="noreferrer"
                                        target="_blank"
                                >
                                        Visit Venmo profile
                                </a>
                        </div>
                </section>

                <section id="contact" class="section section--muted">
                        <div class="contact">
                                <h2>Let's connect</h2>
                                <p>
                                        Not sure where to start? Share your learner's goals, current curriculum, or upcoming deadlines. I'll recommend a plan or
                                        set up a quick call to talk through options.
                                </p>
                                <div class="contact__grid">
                                        <div>
                                                <h3>Email</h3>
                                                <a href="mailto:classes@jacobdanderson.net">classes@jacobdanderson.net</a>
                                        </div>
                                        <div>
                                                <h3>LinkedIn</h3>
                                                <a href="https://www.linkedin.com/in/jacoba1100254352/" rel="noreferrer" target="_blank">
                                                        linkedin.com/in/jacoba1100254352
                                                </a>
                                        </div>
                                        <div>
                                                <h3>Website</h3>
                                                <a href="https://www.jacobdanderson.net" rel="noreferrer" target="_blank">jacobdanderson.net</a>
                                        </div>
                                </div>
                        </div>
                </section>
        </div>
</template>

<style scoped>
.home {
        display: flex;
        flex-direction: column;
        gap: 4rem;
        padding: 4rem 1.5rem 5rem;
}

.eyebrow {
        font-size: 0.9rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #1d4ed8;
        margin-bottom: 1rem;
}

.hero {
        display: grid;
        gap: 2.5rem;
        max-width: 1100px;
        margin: 0 auto;
        align-items: start;
}

.hero__content {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
}

.hero__content h1 {
        font-size: clamp(2.25rem, 5vw, 3rem);
        line-height: 1.15;
        color: #0f172a;
}

.lead {
        font-size: 1.125rem;
        color: #475569;
        line-height: 1.6;
}

.hero__cta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
}

.hero__card {
        background: linear-gradient(145deg, #2563eb, #1d4ed8);
        color: #f8fafc;
        padding: 2rem;
        border-radius: 1.25rem;
        box-shadow: 0 24px 60px rgba(37, 99, 235, 0.22);
        max-width: 420px;
}

.hero__card h2 {
        font-size: 1.35rem;
        margin-bottom: 1rem;
}

.hero__card ul {
        display: grid;
        gap: 0.75rem;
        padding-left: 1.25rem;
}

.section {
        max-width: 1100px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
}

.section--muted {
        background: #ffffff;
        padding: 3.5rem 3rem;
        border-radius: 1.5rem;
        box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}

.section__header {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        text-align: left;
}

.section__header h2 {
        font-size: clamp(1.75rem, 4vw, 2.25rem);
        color: #0f172a;
}

.section__header p {
        font-size: 1.05rem;
        color: #475569;
        max-width: 720px;
}

.card-grid {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.card {
        background: #ffffff;
        border-radius: 1rem;
        padding: 1.75rem;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
}

.card h3 {
        font-size: 1.25rem;
        color: #0f172a;
}

.card p {
        color: #475569;
        line-height: 1.55;
}

.approach-list {
        display: grid;
        gap: 1rem;
        margin: 0;
        padding-left: 1.25rem;
        color: #334155;
        line-height: 1.55;
}

.schedule {
        width: 100%;
}

.schedule__grid {
        display: grid;
        gap: 2rem;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        align-items: start;
}

.schedule__details {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        color: #334155;
}

.schedule__details h3 {
        font-size: 1.3rem;
        color: #0f172a;
}

.schedule__embed {
        border-radius: 1.25rem;
        overflow: hidden;
        box-shadow: 0 18px 45px rgba(37, 99, 235, 0.16);
        min-height: 400px;
}

.schedule__embed iframe {
        width: 100%;
        border: none;
        min-height: 600px;
        background: #ffffff;
}

.button-group {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
}

.button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.85rem 1.35rem;
        border-radius: 9999px;
        font-weight: 600;
        text-decoration: none;
        color: #1d4ed8;
        background: #e0e7ff;
        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.button--primary {
        background: #1d4ed8;
        color: #ffffff;
        box-shadow: 0 12px 30px rgba(29, 78, 216, 0.25);
}

.button:focus-visible,
.button:hover {
        transform: translateY(-2px);
        box-shadow: 0 14px 32px rgba(15, 23, 42, 0.15);
}

.pricing {
        background: linear-gradient(155deg, #f1f5f9, #e0f2fe);
        border-radius: 1.5rem;
        padding: 3rem 3.5rem;
        text-align: center;
        box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
        display: grid;
        gap: 1.5rem;
        justify-items: center;
}

.pricing h2 {
        font-size: 2rem;
        color: #0f172a;
}

.pricing__rate {
        font-size: clamp(2rem, 6vw, 2.75rem);
        font-weight: 700;
        color: #1d4ed8;
}

.pricing ul {
        margin: 0;
        padding-left: 1.25rem;
        text-align: left;
        display: grid;
        gap: 0.75rem;
        color: #334155;
}

.contact {
        display: grid;
        gap: 1.75rem;
}

.contact__grid {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.contact__grid h3 {
        margin-bottom: 0.4rem;
        color: #0f172a;
}

.contact__grid a {
        color: #1d4ed8;
        font-weight: 600;
        text-decoration: none;
        word-break: break-word;
}

.contact__grid a:focus-visible,
.contact__grid a:hover {
        text-decoration: underline;
}

@media (max-width: 960px) {
        .section--muted {
                padding: 2.5rem 1.75rem;
        }

        .pricing {
                padding: 2.5rem;
        }
}

@media (max-width: 768px) {
        .home {
                padding: 3rem 1.25rem 4rem;
                gap: 3rem;
        }

        .hero {
                grid-template-columns: 1fr;
        }

        .hero__card {
                max-width: 100%;
        }
}
</style>
