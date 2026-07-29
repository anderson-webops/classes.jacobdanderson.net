# Network Security Verification Guide

Compare this guide only after recording an independent decision or diagnosis. Equivalent local implementations are valid when they prove the same control and recovery behavior. No entry grants authorization to test a public, shared, school, employer, production, or third-party system.

## Secure Lab Readiness Key

- Node.js 24 is the current LTS baseline in the supplied case; the project-pinned compiler and lock define the remaining toolchain.
- Typecheck and 18 local tests pass before security changes.
- The toy service binds to loopback, so the case does not establish remote exposure.
- The rules of engagement define target, data, request and size limits, prohibited work, stop conditions, and cleanup.
- Missing scope or rollback evidence blocks the live lab; the supplied case remains a complete alternative.

## Threat Model and Trust Boundary Key

- Project records, authorization decisions, availability, and audit integrity are the named assets.
- The browser-to-API and API-to-record or event-sink crossings are trust boundaries.
- An authenticated learner is not automatically authorized for another learner's object or a staff action.
- Each priority abuse case needs an actor capability, affected asset, impact, control, verification, and remaining assumption.
- The model stays tied to the fictional service and avoids claims about unobserved systems.

## Listener Exposure and Ownership Key

- Loopback 8080 is local-only; wildcard 9229 exposes the debugger on every IPv4 interface and is the priority correction.
- The proxy listener is private-lab scoped, but route and host-policy evidence remain necessary before a reachability claim.
- The resolver stub is not a public authoritative DNS service.
- A port number cannot prove application identity or control quality.
- Correct the debugger to loopback or disable it, then confirm the listener and process state without probing any other host.

## Request Authentication and Authorization Key

- Case 1 fails authentication; case 2 passes subject and object authority.
- Case 3 proves that a valid learner identity does not grant access to `project-b`.
- Case 4 passes only when the body also satisfies the allowed-field and semantic contract.
- Case 5 depends on explicit action policy; a staff label alone is not authorization.
- Safe evidence uses opaque stand-ins, minimal errors and responses, duplicate-state behavior, and redacted audit events.

## TLS Certificate and Proxy Key

- The expected name appears in the supplied certificate names and verification succeeds against the local CA.
- TLS 1.3 protects application content in transit between the client and edge.
- The proxy-to-upstream hop is plain local HTTP, so the boundary and host isolation must be explicit.
- Redirect and trusted-header handling are separate controls from certificate validation.
- Private keys, session values, and encrypted content never appear in the evidence packet.

## Schema Validation and Resource Limit Key

- Method, content type, body size, syntax, structure, types, allowed values, semantic rules, and authorization are distinct gates.
- The exact boundary passes and the one-character-over case fails.
- Unknown properties follow the declared reject policy.
- Oversized input is rejected before expensive parsing or downstream work.
- Stable error codes and minimal fields prevent stack, token, and private-data reflection.

## Security Logging and Incident Timeline Key

- Three related failures from `synthetic-a` cross the threshold and produce a rate-limit event; the later `synthetic-b` success is independent.
- Observations are the event fields; the intent of the actor remains an inference.
- Correlation identifiers connect requests without storing tokens or bodies.
- A valid event schema excludes passwords, cookies, session IDs, token values, message bodies, and personal data.
- The lab retention and deletion check apply to generated evidence as well as the raw fictional fixture.

## Proxy Exposure and Forwarded Header Key

- Only the declared proxy source may supply trusted forwarding metadata.
- The direct request from `192.0.2.30` cannot become `192.0.2.20` by writing a header.
- Direct upstream refusal proves the application is not exposed on the lab interface.
- Allowed and denied client tests, listener state, host policy, and application logs complete the evidence.
- Rollback removes only course proxy and policy changes, then compares state with the baseline.

## Secure TypeScript Service Key

- The body-size limit must run before unbounded parsing.
- Authentication identifies a subject; object and action authorization remain separate gates.
- The error boundary returns a stable public error and logs only a redacted internal event.
- Credentialed CORS needs an explicit origin allowlist rather than reflection.
- Bounded shutdown stops new work, closes tracked local connections, finishes or cancels bounded work, and lets the test process exit.

## Rate Limit and Abuse Decision Key

- `synthetic-a` forms a short failure burst; `synthetic-b` represents spaced successful use.
- Sorting is required before time-window comparison.
- An exact threshold has one documented inclusive or exclusive rule.
- Malformed rows fail validation rather than silently changing a decision.
- The output is a recommendation with supporting events, false-positive and evasion limits, and human review for ambiguous cases.

## Realtime Connection and Message Key

- Origin and session checks occur at the handshake, but action authorization still occurs for every message.
- Subscription to `room-1` can pass; notification to `room-2` fails room authority.
- Unknown type and oversized payload fail their independent contracts.
- Repeated invalid events, rate pressure, backpressure, heartbeat failure, session expiry, and logout each have explicit close behavior.
- Logs retain event type, decision, reason, and synthetic connection identity without full payload or session data.

## Secure Release and Recovery Key

- The failed authorization negative test blocks release 1.4.0 even though health succeeds.
- Secret ownership and injection points are recorded without values.
- The prior 1.3.2 artifact remains trusted and available for rollback.
- Recovery repeats listener, health, authorization negative tests, and redaction checks after rollback.
- The release packet records provenance, dependency lock, checks, failure, decision, rollback, and remaining limitation.

## Authorized Test AI and Disclosure Key

- Boundary-value ideas are reviewable only inside the fixed field, count, and size limits.
- The unlisted administration route is outside scope and is not tested.
- Copying a real token into any prompt is prohibited.
- Remediation wording can be reviewed when it introduces no unsupported claim or sensitive detail.
- The final report maps each retained test to a requirement, records AI assistance and human verification, separates evidence from speculation, retests the fix, and addresses the fixture owner.

## Secure Service Capstone Key

- The proxy-trust regression is the root control failure; the rate-limit bypass is a consequence of trusting spoofable identity.
- The first evidence compares socket source, trusted proxy boundary, forwarded value, derived actor key, threshold events, and control decision.
- The smallest fix restricts trusted forwarding to the known proxy path and derives the rate key from verified identity or a nonspoofable source.
- Regression tests include trusted proxy, direct spoof attempt, ordinary actor, threshold boundary, and redacted log output.
- Final evidence includes threat model, scope, Node and dependency versions, tests, incident timeline, fix, retest, rollback, disclosure note, limitations, and no public testing.
