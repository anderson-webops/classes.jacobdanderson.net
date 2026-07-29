# Network Security Practice Pack

These supplied cases provide deterministic, privacy-safe evidence when a local Node service, isolated lab host, or authorized test route is unavailable. All services, users, addresses, tokens, logs, and findings are fictional or reserved for documentation. No case authorizes testing outside the supplied local scenario.

## Secure Lab Readiness Case

```text
$ node --version
v24.18.0

$ npm --version
11.16.0

$ npm run typecheck
0 errors

$ npm test
18 passed

$ ss -ltnp '( sport = :8080 )'
LISTEN 0 128 127.0.0.1:8080 0.0.0.0:* users:(("node",pid=4100,fd=22))
```

Rules of engagement:

- target: fictional `blue-lantern-api` fixture on loopback;
- data: synthetic users `learner-a` and `learner-b`;
- allowed inputs: supplied JSON requests, maximum 30 requests and 16 KiB each;
- prohibited: outbound calls, real tokens, public binding, scanning, persistence, or third-party data;
- stop: unexpected listener, data source, outbound request, or unbounded resource use;
- cleanup: stop the fixture, delete generated logs, and restore the clean test state.

Identify missing runtime, dependency, target, data, request-limit, stop, and cleanup evidence before marking the lab ready.

## Threat Model and Trust Boundary Case

System:

```text
browser fixture
    |
    | JSON request + opaque stand-in session
    v
local API boundary ----> in-memory project records
    |
    +----> redacted security-event sink
```

Assets: project records, authorization decisions, service availability, and audit integrity.

Actors: unauthenticated visitor, authenticated learner, staff reviewer, and local operator.

Map data flows, trust boundaries, entry points, privileged actions, assumptions, and abuse cases. For each priority risk, name one preventive control, one observable signal, one verification step, and one remaining limitation.

## Listener Exposure and Ownership Case

```text
tcp 127.0.0.1:8080 node learner blue-lantern-api auth=yes
tcp 0.0.0.0:9229 node learner inspector auth=no
tcp 192.0.2.10:8443 nginx root proxy-edge auth=upstream
udp 127.0.0.53:53 systemd-resolved system resolver auth=n/a
```

Classify process, user, protocol, bind scope, intended client, authentication expectation, authorization boundary, and evidence still required for each listener. Identify the least-exposure correction for the debugger without probing any other host.

## Request Authentication and Authorization Case

Records:

```json
[
	{ "id": "project-a", "ownerId": "learner-a", "visibility": "private" },
	{ "id": "project-b", "ownerId": "learner-b", "visibility": "shared" }
]
```

Request matrix:

| Case | Identity  | Method and object  | Expected result                           |
| ---- | --------- | ------------------ | ----------------------------------------- |
| 1    | none      | `GET project-a`    | reject authentication                     |
| 2    | learner-a | `GET project-a`    | allow                                     |
| 3    | learner-a | `PATCH project-b`  | reject object authority                   |
| 4    | learner-b | `PATCH project-b`  | allow valid fields                        |
| 5    | staff     | `DELETE project-b` | reject unless the action policy grants it |

Design checks for token placement, authentication, object-level and action-level authorization, state change, duplicate request behavior, error shape, audit event, and response-field minimization. Tokens remain opaque stand-ins and never appear in logs.

## TLS Certificate and Proxy Case

```text
client name: app.blue-lantern.test
TLS version: TLSv1.3
certificate subject: CN=app.blue-lantern.test
certificate names: DNS:app.blue-lantern.test
validity: 2026-07-01 through 2026-08-01
verification: success against the supplied local CA
edge listener: 127.0.0.1:8443
upstream: http://127.0.0.1:8080
HTTP entry: 127.0.0.1:8088 -> redirect to HTTPS
```

Explain peer-name verification, trust result, validity, termination point, upstream protection, redirect behavior, forwarded-header boundary, and what remains visible in a packet summary after application data is encrypted. No private key is included.

## Schema Validation and Resource Limit Case

Boundary contract:

```json
{
	"channelId": "string, 1 to 40 characters",
	"message": "string, 1 to 280 characters",
	"priority": "one of low, normal, high"
}
```

Limits: JSON only, `POST` only, 8 KiB body, no unknown properties, authenticated actor required, and actor must belong to the channel.

Create bounded cases for valid input, missing field, extra field, wrong type, empty normalized value, exact length boundary, one-character-over boundary, invalid enum, semantic authorization failure, malformed JSON, and body-too-large rejection before deeper logic.

## Security Logging and Incident Timeline Case

```json
{"time":"2026-07-28T14:00:01Z","event":"auth.failure","actor":"synthetic-a","route":"/session","reason":"invalid_standin","correlation":"req-101"}
{"time":"2026-07-28T14:00:03Z","event":"auth.failure","actor":"synthetic-a","route":"/session","reason":"invalid_standin","correlation":"req-102"}
{"time":"2026-07-28T14:00:04Z","event":"rate.limit","actor":"synthetic-a","route":"/session","reason":"window_threshold","correlation":"req-103"}
{"time":"2026-07-28T14:00:10Z","event":"auth.success","actor":"synthetic-b","route":"/session","reason":"accepted","correlation":"req-104"}
```

Build a minimal incident timeline. Identify observation, inference, trigger, control response, rejected explanations, severity, and follow-up. Define fields that must never be logged, a retention period for this lab, and the deletion check.

## Proxy Exposure and Forwarded Header Case

Configuration:

```text
application: 127.0.0.1:8080
proxy: 192.0.2.10:8443
trusted proxy source: 192.0.2.1 only
allowed client: 192.0.2.20
blocked client: 192.0.2.30
```

Requests:

```text
source 192.0.2.1, X-Forwarded-For 192.0.2.20 -> trusted proxy path
source 192.0.2.30, X-Forwarded-For 192.0.2.20 -> untrusted spoof attempt
source 192.0.2.20, direct port 8080 -> refused
```

Explain which client identity the application may use, why the spoofed header is rejected, how direct-upstream closure is proved, and how proxy and host policy return to baseline.

## Secure TypeScript Service Case

Proposed middleware order:

```text
request id
proxy and transport assumptions
body size limit
JSON parser
schema validation
authentication
object and action authorization
route handler
safe error boundary
structured security event
bounded shutdown
```

Review these failures:

1. body parsing occurs before the configured size gate;
2. authentication succeeds but object ownership is never checked;
3. an exception response includes a stack and request token;
4. CORS reflects every Origin while credentials are enabled;
5. shutdown stops accepting connections but never closes existing test connections.

Produce the smallest correction and negative test for each failure. The fixture uses in-memory records and loopback only.

## Rate Limit and Abuse Decision Case

```json
[
	{
		"actorId": "synthetic-a",
		"timestampMs": 0,
		"status": 401,
		"path": "/session"
	},
	{
		"actorId": "synthetic-a",
		"timestampMs": 200,
		"status": 401,
		"path": "/session"
	},
	{
		"actorId": "synthetic-a",
		"timestampMs": 400,
		"status": 429,
		"path": "/session"
	},
	{
		"actorId": "synthetic-b",
		"timestampMs": 0,
		"status": 200,
		"path": "/health"
	},
	{
		"actorId": "synthetic-b",
		"timestampMs": 5000,
		"status": 200,
		"path": "/projects"
	}
]
```

Define a fixed window, count and resource threshold, allow/throttle/review decision, reason codes, and maximum dataset size. Test ordinary use, exact boundary, burst, repeated failure, unsorted input, malformed row, and an ambiguous case that requires human review. The tool cannot open sockets or block a real address.

## Realtime Connection and Message Case

Connection:

```json
{
	"connectionId": "conn-a",
	"userId": "learner-a",
	"authorizedRooms": ["room-1"],
	"origin": "https://classroom.blue-lantern.test",
	"sessionState": "active",
	"invalidEventCount": 0
}
```

Messages:

```json
{"type":"subscribe","roomId":"room-1","payloadBytes":42}
{"type":"notify","roomId":"room-2","payloadBytes":88}
{"type":"unknown","roomId":"room-1","payloadBytes":20}
{"type":"notify","roomId":"room-1","payloadBytes":4096}
```

Create a state-transition table for origin, handshake authentication, subscription, per-message room authorization, type and size checks, rate and backpressure action, heartbeat, session expiry, logout, redacted event logging, and clean disconnect.

## Secure Release and Recovery Case

Release record:

```text
artifact: blue-lantern-api-1.4.0
runtime: Node.js 24 LTS
lock state: clean
typecheck: pass
tests: 42 pass
listener: 127.0.0.1:8080
health: GET /health -> 200
security-event redaction: pass
prior trusted artifact: blue-lantern-api-1.3.2
```

Secret inventory:

| Name             | Owner          | Injected at   | Value recorded? |
| ---------------- | -------------- | ------------- | --------------- |
| `SESSION_SECRET` | local operator | process start | no              |
| `LOCAL_CA_PATH`  | local operator | process start | no              |

The new release fails its authorization negative test after startup. Decide the release status, preserve evidence without recording values, roll back to the trusted artifact, repeat health and security tests, and record the recovery result.

## Authorized Test AI and Disclosure Case

Rules of engagement:

```text
target: local fixture blue-lantern-api
allowed routes: /session, /projects/:id, /notify
synthetic identities: learner-a, learner-b, staff
maximum: 40 requests, 16 KiB each, no concurrency test
allowed methods: supplied authentication, authorization, validation, and rate-limit checks
stop: unexpected target, outbound request, sensitive value, unstable service, or scope ambiguity
```

An AI assistant proposes:

1. three extra boundary values for the `message` field;
2. a test against an unlisted administration route;
3. copying a real session token into the prompt;
4. a clearer remediation paragraph.

Classify each proposal as reviewable, out of scope, or prohibited. Map retained checks to selected ASVS, API Security Top 10, or WSTG references, then write observation, impact, preconditions, remediation, retest, uncertainty, and a disclosure note for the fixture owner.

## Secure Service Capstone Case

Target state:

- local TypeScript service on loopback;
- synthetic users and in-memory project records;
- authentication plus object- and action-level authorization;
- schema, size, rate, and real-time message limits;
- supplied TLS and proxy evidence;
- structured redacted security events;
- selected ASVS, API Security Top 10, and WSTG checks;
- release, rollback, incident, and disclosure records.

Injected incident:

1. a proxy-trust change allows an untrusted forwarded client value;
2. the rate-limit key uses that value;
3. one synthetic actor evades the intended threshold;
4. logs contain the spoofed value but no token or personal data;
5. the prior trusted configuration remains available.

Produce the threat-model update, first observable failure, bounded authorized test, impact and preconditions, smallest fix, negative regression test, redacted timeline, recovery, retest, disclosure note, and remaining limitation.
