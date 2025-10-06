<script lang="ts" setup>
defineOptions({ name: "SupportUsPage" });
</script>

<template>
        <section class="Supportus py-5">
                <div class="container text-start">
                        <h1 class="display-6 fw-bold text-center">Book a class</h1>
                        <p class="lead mt-3 text-center">
                                Choose a time that works for you, then secure your spot with a quick Venmo payment. Sessions are $40 for
                                50 minutes, with flexibility to continue for an additional 10 minutes when we need to wrap up a project or
                                problem set.
                        </p>

                        <div class="row g-5 mt-4">
                                <div class="col-lg-7">
                                        <h2 class="h4">Schedule with Calendly</h2>
                                        <p>
                                                Pick an available slot below. Calendly will automatically send the meeting link and calendar invite. If
                                                you don't see a time that works, reach out and we'll coordinate something custom.
                                        </p>
                                        <div class="calendly-container mt-3">
                                                <iframe
                                                        allowtransparency="true"
                                                        frameborder="0"
                                                        height="680"
                                                        scrolling="no"
                                                        src="https://calendly.com/jacoba1100254352?hide_event_type_details=1&hide_gdpr_banner=1"
                                                        title="Schedule a tutoring session"
                                                        width="100%"
                                                />
                                        </div>
                                        <p class="mt-3">
                                                Prefer a separate window? <a href="https://calendly.com/jacoba1100254352" target="_blank" rel="noreferrer">Open Calendly in a new tab</a>.
                                        </p>
                                </div>
                                <div class="col-lg-5">
                                        <h2 class="h4">Secure payment</h2>
                                        <p>
                                                Pay after scheduling using Venmo. Please include the student's name and session date in the note so I can
                                                confirm your booking quickly.
                                        </p>
                                        <div class="card shadow-sm">
                                                <div class="card-body">
                                                        <h3 class="card-title h5">Venmo</h3>
                                                        <p class="card-text">Send payments to <strong>@jacoba1100254352-classes</strong>.</p>
                                                        <a
                                                                class="btn btn-outline-secondary"
                                                                href="https://www.venmo.com/u/jacoba1100254352-classes"
                                                                rel="noreferrer"
                                                                target="_blank"
                                                        >
                                                                Open Venmo profile
                                                        </a>
                                                </div>
                                        </div>

                                        <div class="mt-4">
                                                <h2 class="h5">Need help?</h2>
                                                <p>
                                                        Email me through LinkedIn or my website if you have questions about courses, scheduling, or group
                                                        sessions. I'm happy to tailor a plan for families or small teams.
                                                </p>
                                                <div class="d-flex flex-wrap gap-3">
                                                        <a
                                                                class="btn btn-outline-primary"
                                                                href="https://www.linkedin.com/in/jacoba1100254352/"
                                                                rel="noreferrer"
                                                                target="_blank"
                                                        >
                                                                Message on LinkedIn
                                                        </a>
                                                        <a
                                                                class="btn btn-outline-primary"
                                                                href="https://www.jacobdanderson.net"
                                                                rel="noreferrer"
                                                                target="_blank"
                                                        >
                                                                Visit my website
                                                        </a>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>
        </section>
</template>

<style scoped>
.Supportus {
        background-color: #f8f9fa;
}

.calendly-container {
        border-radius: 0.75rem;
        overflow: hidden;
        box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
        background: #ffffff;
}
</style>

<route lang="json">
{
        "meta": {
                "layout": "default"
        }
}
</route>
