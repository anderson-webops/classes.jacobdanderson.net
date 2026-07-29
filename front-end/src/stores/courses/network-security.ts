import type { RawCourse } from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { buildProjectGuidance } from "./projectGuidance";

const networkSecuritySourceCourse: RawCourse = {
	name: "Network Security",
	modules: [
		{
			title: "NSEC0 Setup and Tooling",
			curriculum: [
				{
					title: "Editor, Runtime, and TypeScript Baseline",
					content:
						"Standardize on `TypeScript` with either `VS Code` or `WebStorm`, verify `node`, `npm`, and `npx tsc --version`, and make the course workspace explicit from day one. Expect the implementation language to be TS even when some early examples stay small and script-like."
				},
				{
					title: "Linux-Friendly Lab Environment",
					content:
						"A Linux shell is expected for the networking and service labs, whether through WSL2, a VM, Docker, or a remote host. Firewall, proxy, socket, and service exposure behavior is easier to reason about when the operating environment is consistent."
				},
				{
					title: "Workspace Layout for Security Labs",
					content:
						"Set up separate folders for `tcp-labs`, `http-security`, `logging`, and `capstone`, then verify that local services can bind to ports, write logs, and be inspected. This turns the environment check into part of the course rather than a hidden prerequisite."
				},
				{
					title: "Positioning, Prerequisites, and Safe Scope",
					content:
						"This is a defensive network security course for a JavaScript-comfortable background, preferably after `Linux Systems` and `Network Systems`. The focus is secure services, observability, trust boundaries, and controlled local labs rather than offensive abuse."
				},
				{
					title: "NSEC0 Setup and Tooling: Core Project",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "NSEC0 Setup and Tooling",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-03-nsec0-setup-and-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-03-nsec0-setup-and-tooling/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: Setup and Tooling",
					content:
						"Keep a running security notebook for setup and tooling that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about which services are running locally, how they are being inspected, and where the lab boundary starts. The habit is evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-03-nsec0-setup-and-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-03-nsec0-setup-and-tooling/solution"
				},
				{
					title: "Setup and Tooling Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "NSEC0 Setup and Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-01-nsec0-setup-and-tooling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-01-nsec0-setup-and-tooling-supplemental-2/solution"
				},
				{
					title: "Setup and Tooling Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "NSEC0 Setup and Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-02-nsec0-setup-and-tooling-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-02-nsec0-setup-and-tooling-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 1: Security Model of Networked Systems",
			curriculum: [
				{
					title: "Attack Surface in Real Services",
					content:
						"Attack surface means every externally reachable input, management path, credential boundary, and background integration a service exposes. Start by naming the surface area of a simple app before choosing mitigations, because a defense cannot be evaluated until the exposed paths are visible."
				},
				{
					title: "Trust Boundaries and Data Ownership",
					content:
						"Use the path from browser to proxy to app to database to show where trust changes hands. Keep identifying which layer is making a trust decision and what evidence that layer actually has."
				},
				{
					title: "CIA Triad in Practical Service Terms",
					content:
						"Confidentiality, integrity, and availability become concrete through web-service examples: leaked tokens, tampered requests, poisoned logs, service outages, and rate-limit exhaustion. The triad reads like an operational checklist for a real service, not a vocabulary box."
				},
				{
					title: "Threat Modeling Small TS Services",
					content:
						"A lightweight threat-modeling process for a toy Node or TypeScript service identifies assets, actors, entry points, trust boundaries, likely failures, and the first monitoring signals needed before deployment."
				},
				{
					title: "Unit 1: Security Model of Networked Systems: Core Project",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Unit 1: Security Model of Networked Systems",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-04-unit-1-security-model-of-networked-systems/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-04-unit-1-security-model-of-networked-systems/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: Security Model of Networked Systems",
					content:
						"Keep a running security notebook for the security model of networked systems that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about what the service is protecting, who is trusted, and which assets matter most. The habit is evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-04-unit-1-security-model-of-networked-systems/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-04-unit-1-security-model-of-networked-systems/solution"
				},
				{
					title: "Security Model Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Unit 1: Security Model of Networked Systems",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-03-unit-1-security-model-of-networked-systems-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-03-unit-1-security-model-of-networked-systems-supplemental-2/solution"
				},
				{
					title: "Security Model Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Unit 1: Security Model of Networked Systems",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-04-unit-1-security-model-of-networked-systems-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-04-unit-1-security-model-of-networked-systems-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 2: Sockets, Ports, and Services",
			curriculum: [
				{
					title: "What a Listening Service Exposes",
					content:
						"Treat a listening socket as a concrete exposure point rather than a vague idea of 'the server'. A useful explanation identifies the process, protocol, address, port, and client scope so the actual reachable surface is clear."
				},
				{
					title: "Localhost versus LAN versus Public Internet",
					content:
						"Use binding addresses and firewall context to explain why `127.0.0.1`, a private LAN address, and a public interface imply different risk levels. The security lesson is that reachability scope is part of the design, not just a deployment afterthought."
				},
				{
					title: "TCP and UDP from a Security Perspective",
					content:
						"Compare TCP and UDP by what they expose to monitoring, how abuse or spoofing risk differs, and what validation assumptions each protocol tends to encourage. Stop thinking only in terms of connection style and start thinking about observability and control surfaces."
				},
				{
					title: "Map Ports Back to Real Processes",
					content:
						"Use `ss`, `lsof`, and service managers to tie listeners back to specific processes and configs. The main habit is to verify the real service surface before trying to secure it."
				},
				{
					title: "Project: Local-Only Port Inventory Tool",
					content:
						"Build a defensive inventory tool that classifies listeners by protocol, bind address, owner, and likely exposure level. Treat the output as the first draft of a host attack-surface report rather than as a raw command dump.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC1-Local-Port-Inventory-Tool/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC1-Local-Port-Inventory-Tool/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: Sockets, Ports, and Services",
					content:
						"Keep a running security notebook for sockets, ports, and services that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about which listeners are local-only, which are LAN-visible, and which would be dangerous if exposed publicly. The habit is evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC1-Local-Port-Inventory-Tool/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC1-Local-Port-Inventory-Tool/solution"
				},
				{
					title: "Port Exposure Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "Unit 2: Sockets, Ports, and Services",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-05-unit-2-sockets-ports-and-services-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-05-unit-2-sockets-ports-and-services-supplemental-2/solution"
				},
				{
					title: "Port Exposure Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "Unit 2: Sockets, Ports, and Services",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-06-unit-2-sockets-ports-and-services-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-06-unit-2-sockets-ports-and-services-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 3: HTTP and API Security Basics",
			curriculum: [
				{
					title: "Requests, Headers, Cookies, and Tokens",
					content:
						"Make the HTTP request concrete: method, path, headers, body, cookie state, and bearer tokens all represent different trust claims. Each part ties back to what it proves, what it does not prove, and how it could be forged or misused."
				},
				{
					title: "Authentication versus Authorization",
					content:
						"Small API examples separate identity from permission. A request can be authenticated correctly and still be unauthorized for the resource or action it is attempting."
				},
				{
					title: "Common Mistakes in Toy APIs",
					content:
						"Insecure toy APIs often trust client role flags, leak internal errors, reflect unsanitized values, skip ownership checks, or expose privileged endpoints without guardrails. Recognizing the weak assumption matters before adding more code on top of it."
				},
				{
					title: "State Changes, Idempotence, and Error Surfaces",
					content:
						"Method choice, status codes, retry behavior, and response details all shape the security behavior of an API. Sloppy API behavior makes abuse harder to detect and legitimate failures harder to investigate, especially when state-changing routes do not communicate clearly."
				},
				{
					title: "Unit 3: HTTP and API Security Basics: Core Project",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "Unit 3: HTTP and API Security Basics",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-05-unit-3-http-and-api-security-basics/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-05-unit-3-http-and-api-security-basics/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: HTTP and API Security Basics",
					content:
						"Keep a running security notebook for HTTP and API security basics that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about what claims the request makes, which claims are verified, and where an attacker could lie. The habit is evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-05-unit-3-http-and-api-security-basics/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-05-unit-3-http-and-api-security-basics/solution"
				},
				{
					title: "HTTP API Boundary Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "Unit 3: HTTP and API Security Basics",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-07-unit-3-http-and-api-security-basics-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-07-unit-3-http-and-api-security-basics-supplemental-2/solution"
				},
				{
					title: "HTTP API Boundary Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "Unit 3: HTTP and API Security Basics",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-08-unit-3-http-and-api-security-basics-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-08-unit-3-http-and-api-security-basics-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 4: TLS and Secure Transport",
			curriculum: [
				{
					title: "What TLS Protects and What It Does Not",
					content:
						"TLS protects data in transit against interception and tampering, but it is not a blanket application-security solution. Authorization, input validation, session handling, and safe server behavior still have to be correct after the encrypted connection is established."
				},
				{
					title: "Certificates and Trust at a High Level",
					content:
						"Explain certificates, CAs, hostname matching, expiration, and chain trust without turning the unit into a crypto deep dive. The point is to make certificate failures interpretable when they surface in deployment or incident work."
				},
				{
					title: "Reverse-Proxy Termination",
					content:
						"Show where TLS often terminates in real deployments and how that changes what the upstream app sees. Once TLS ends at the edge, trusted proxy headers, secure forwarding rules, and internal-only app listeners become part of the security model."
				},
				{
					title: "Why Plain HTTP Is Still Risky",
					content:
						"Use redirects, downgrade mistakes, mixed-content issues, and exposed login or cookie flows to show why plain HTTP still creates avoidable risk. This unit ties transport security back to service design rather than treating it as a separate ops task."
				},
				{
					title: "Unit 4: TLS and Secure Transport: Core Project",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "Unit 4: TLS and Secure Transport",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-06-unit-4-tls-and-secure-transport/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-06-unit-4-tls-and-secure-transport/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: TLS and Secure Transport",
					content:
						"Keep a running security notebook for TLS and secure transport that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about where TLS starts, where it ends, and which component still has to make authorization and validation decisions. The habit is evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-06-unit-4-tls-and-secure-transport/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-06-unit-4-tls-and-secure-transport/solution"
				},
				{
					title: "TLS Transport Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "Unit 4: TLS and Secure Transport",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-09-unit-4-tls-and-secure-transport-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-09-unit-4-tls-and-secure-transport-supplemental-2/solution"
				},
				{
					title: "TLS Transport Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "Unit 4: TLS and Secure Transport",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-10-unit-4-tls-and-secure-transport-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-10-unit-4-tls-and-secure-transport-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 5: Input Validation on the Network Boundary",
			curriculum: [
				{
					title: "Malformed Requests and Parser Edges",
					content:
						"Malformed requests are boundary problems, not just coding inconveniences. Look for parser ambiguity, missing fields, unexpected nesting, unsupported content types, and type confusion before values ever touch business logic."
				},
				{
					title: "Size Limits and Resource Exhaustion",
					content:
						"Body size, field count, array size, and connection cost are explicit security concerns. Validation connects to availability when oversized requests and repeated parse work become abuse vectors. A safe boundary defines maximum request body size, maximum nesting depth, maximum list length, timeout behavior, and logging that records rejection without storing sensitive payloads. The defensive test includes one valid request near the limit and one oversized request that fails predictably. The result preserves service availability: the server rejects abusive input early, returns a controlled error, and remains responsive for the next normal request."
				},
				{
					title: "Schema Validation and Safe Rejection",
					content:
						"Use typed request schemas and clear rejection paths to normalize defensive boundary handling. Return consistent errors, avoid leaking internals, and keep enough detail in logs to debug without echoing unsafe input back to the client."
				},
				{
					title: "Normalize Before Deeper Logic",
					content:
						"Normalize casing, enums, identifiers, and optional fields early so downstream code can rely on a smaller set of safe assumptions. The security value is fewer ambiguous states and fewer ways to bypass checks."
				},
				{
					title: "Project: Request Schema Validation Gateway",
					content:
						"Build a gateway layer that checks request shape, body size, allowed methods, and required authentication context before forwarding work to the rest of the service. The project functions as a reusable network boundary rather than a one-off form checker.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC2-Request-Schema-Validation-Gateway/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC2-Request-Schema-Validation-Gateway/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: Input Validation on the Network Boundary",
					content:
						"Keep a running security notebook for input validation on the network boundary that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about which requests are rejected early, how limits are enforced, and what evidence is kept for incident review. The habit is evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC2-Request-Schema-Validation-Gateway/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC2-Request-Schema-Validation-Gateway/solution"
				},
				{
					title: "Request Validation Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Unit 5: Input Validation on the Network Boundary",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-11-unit-5-input-validation-on-the-network-boundary-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-11-unit-5-input-validation-on-the-network-boundary-supplemental-2/solution"
				},
				{
					title: "Request Validation Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Unit 5: Input Validation on the Network Boundary",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-12-unit-5-input-validation-on-the-network-boundary-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-12-unit-5-input-validation-on-the-network-boundary-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 6: Logging, Monitoring, and Forensics",
			curriculum: [
				{
					title: "Access Logs and Structured Logs",
					content:
						"Generic access logs and structured application logs answer different security questions. Access logs show request patterns and edge behavior; structured logs can explain application decisions during routine monitoring and incident reconstruction."
				},
				{
					title: "Suspicious Activity Indicators",
					content:
						"Use repeated 401 or 403 responses, path scanning, bursty clients, oversized bodies, odd user agents, and authentication churn as concrete indicators of suspicious activity. Define signals before an incident happens."
				},
				{
					title: "Rate-Limit and Abuse Telemetry",
					content:
						"Rate limiting is both a control and a source of evidence. Log throttle decisions, track source identity carefully, and distinguish a strict limit, a challenge, and a hard block so later review can explain why the service reacted."
				},
				{
					title: "Reading Logs After Simulated Bad Requests",
					content:
						"Include a lab that sends malformed or suspicious requests to a safe local service and then reconstructs what happened from the logs. This turns monitoring into an investigative skill instead of a passive dashboard habit."
				},
				{
					title: "Project: Suspicious Request Log Parser",
					content:
						"Build a parser that turns raw request logs into a short anomaly report with top sources, failure clusters, and suspicious request patterns. The output helps a human operator decide what to inspect next.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC3-Suspicious-Request-Log-Parser/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC3-Suspicious-Request-Log-Parser/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: Logging, Monitoring, and Forensics",
					content:
						"Keep a running security notebook for logging, monitoring, and forensics that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about which events matter, which fields are safe to log, and how one incident timeline can be reconstructed from evidence. The habit is evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC3-Suspicious-Request-Log-Parser/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC3-Suspicious-Request-Log-Parser/solution"
				},
				{
					title: "Log Forensics Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Unit 6: Logging, Monitoring, and Forensics",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-13-unit-6-logging-monitoring-and-forensics-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-13-unit-6-logging-monitoring-and-forensics-supplemental-2/solution"
				},
				{
					title: "Log Forensics Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Unit 6: Logging, Monitoring, and Forensics",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-14-unit-6-logging-monitoring-and-forensics-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-14-unit-6-logging-monitoring-and-forensics-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 7: Firewalls, Proxies, and Exposure",
			curriculum: [
				{
					title: "UFW Review and Least-Open Policy",
					content:
						"Review host firewall behavior with a deny-by-default mindset, then explicitly map which ports are reachable from which networks. Exposure policy is a design decision that is documented, not guessed from whatever happens to work."
				},
				{
					title: "Reverse Proxies as Security Boundaries",
					content:
						"Reverse proxies are both routing tools and security boundaries. They can terminate TLS, enforce method or size policy, centralize logs, and keep internal services off the public edge when configured carefully."
				},
				{
					title: "Internal versus External Services",
					content:
						"Concrete examples such as control panels, metrics endpoints, worker callbacks, and app APIs show which services stay internal. 'Works from the outside' is not the same thing as 'belongs on the public edge'."
				},
				{
					title: "Trusted Proxy Headers and Real Client Identity",
					content:
						"Explain when forwarded headers are trustworthy, when they are attacker-controlled, and how misconfigured proxy trust corrupts logs, rate limits, or auth logic. Client identity is a boundary decision, not a free value from the request."
				},
				{
					title: "Project: TLS and Proxy Configuration Companion App",
					content:
						"Build a configuration-audit companion that reviews reverse-proxy and TLS settings for exposed services, flags weak forwarding assumptions, and recommends least-exposed service layouts. The emphasis is configuration reasoning rather than offensive scanning.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC6-TLS-and-Proxy-Companion-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC6-TLS-and-Proxy-Companion-App/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: Firewalls, Proxies, and Exposure",
					content:
						"Keep a running security notebook for firewalls, proxies, and exposure that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about which component owns the public edge, which ports remain internal, and which headers can be trusted. The habit is evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC6-TLS-and-Proxy-Companion-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC6-TLS-and-Proxy-Companion-App/solution"
				},
				{
					title: "Proxy Exposure Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "Unit 7: Firewalls, Proxies, and Exposure",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-15-unit-7-firewalls-proxies-and-exposure-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-15-unit-7-firewalls-proxies-and-exposure-supplemental-2/solution"
				},
				{
					title: "Proxy Exposure Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "Unit 7: Firewalls, Proxies, and Exposure",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-16-unit-7-firewalls-proxies-and-exposure-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-16-unit-7-firewalls-proxies-and-exposure-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 8: Secure Node/TypeScript Services",
			curriculum: [
				{
					title: "Express or Fastify Hardening Basics",
					content:
						"Use one small service to show safe defaults around routing, parser configuration, central error handling, and defensive middleware ordering. Framework defaults and app-specific decisions combine into the real boundary a request encounters."
				},
				{
					title: "Security Headers and Browser-Side Policy",
					content:
						"Common header protections include content type discipline, frame policy, and transport hints. Each header connects to what it does, what it does not solve, and how browser-facing service security depends on concrete HTTP behavior instead of vague best-practice lists."
				},
				{
					title: "CORS, Body Limits, and Parsing Rules",
					content:
						"CORS is a browser policy surface, not an authentication mechanism. Pair it with strict body parsing and request-size limits, and be explicit about which clients a CORS rule affects and which clients it does not."
				},
				{
					title: "Route-Level Authentication and Authorization",
					content:
						"Explicit route guards, ownership checks, and privilege boundaries belong on top of authentication. Each sensitive route needs a defensible authorization story."
				},
				{
					title: "Unit 8: Secure Node/TypeScript Services: Core Project",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "Unit 8: Secure Node/TypeScript Services",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-07-unit-8-secure-node-typescript-services/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-07-unit-8-secure-node-typescript-services/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: Secure Node/TypeScript Services",
					content:
						"Keep a running security notebook for secure Node/TypeScript services that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about which guards happen at middleware, which happen per route, and which headers or limits are part of the public contract. The habit is evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-07-unit-8-secure-node-typescript-services/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-07-unit-8-secure-node-typescript-services/solution"
				},
				{
					title: "Secure Service Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "Unit 8: Secure Node/TypeScript Services",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-17-unit-8-secure-node-typescript-services-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-17-unit-8-secure-node-typescript-services-supplemental-2/solution"
				},
				{
					title: "Secure Service Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "Unit 8: Secure Node/TypeScript Services",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-18-unit-8-secure-node-typescript-services-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-18-unit-8-secure-node-typescript-services-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 9: Defensive Network Tooling in TS",
			curriculum: [
				{
					title: "Local-Only Scanners and Safe Lab Constraints",
					content:
						"Make the ethics and boundary conditions explicit before any network tool is built. Tools stay local or lab-scoped, record their assumptions, and avoid normalizing broad unsolicited scanning as acceptable practice."
				},
				{
					title: "Reusable Request Validation Helpers",
					content:
						"The same validation logic can be turned into reusable helpers or middleware. The learning goal is to treat boundary checks as a first-class subsystem rather than scattered `if` statements."
				},
				{
					title: "Anomaly Summaries from Logs and Metadata",
					content:
						"Transform noisy network evidence into a short ranked summary that a human operator can act on. This is where defensive tooling becomes useful rather than merely interesting."
				},
				{
					title: "Packet Metadata Without Full Packet Abuse",
					content:
						"Use captured request metadata or safe local logs to reason about flow, size, timing, and protocol behavior without turning the course into an offensive packet-crafting exercise. The emphasis stays on interpretation and defense."
				},
				{
					title: "Project: Rate-Limit and Abuse Detector",
					content:
						"Build a small TS analyzer that groups events by actor, tracks burst behavior, and recommends throttle or block responses based on repeated suspicious patterns. The project produces an operator-friendly summary instead of a raw score dump.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC4-Rate-Limit-and-Abuse-Detector/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC4-Rate-Limit-and-Abuse-Detector/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: Defensive Network Tooling in TS",
					content:
						"Keep a running security notebook for defensive network tooling in TypeScript that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about how a tool stays within lab scope, what evidence it consumes, and what kind of decision it is allowed to make. The habit is evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC4-Rate-Limit-and-Abuse-Detector/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC4-Rate-Limit-and-Abuse-Detector/solution"
				},
				{
					title: "Defensive Tooling Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "Unit 9: Defensive Network Tooling in TS",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-19-unit-9-defensive-network-tooling-in-ts-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-19-unit-9-defensive-network-tooling-in-ts-supplemental-2/solution"
				},
				{
					title: "Defensive Tooling Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "Unit 9: Defensive Network Tooling in TS",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-20-unit-9-defensive-network-tooling-in-ts-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-20-unit-9-defensive-network-tooling-in-ts-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 10: WebSockets and Real-Time Security",
			curriculum: [
				{
					title: "Connection Lifecycle and Session State",
					content:
						"Connect, authenticate, subscribe, send, receive, and disconnect are distinct WebSocket phases with different failure risks. Treat a WebSocket as a stateful security boundary rather than a magical persistent tunnel."
				},
				{
					title: "Event Validation and Message Contracts",
					content:
						"Strict event schemas, allowed event names, payload limits, and per-event authorization checks keep real-time protocols from skipping the structure that HTTP handlers usually make more obvious."
				},
				{
					title: "Abuse Handling, Backpressure, and Disconnect Policy",
					content:
						"Message floods, invalid event spam, reconnect storms, and idle-session cleanup all belong in the real-time security model. Availability protection is part of real-time security, not a separate operational afterthought."
				},
				{
					title: "Broadcast Boundaries and Data Leakage",
					content:
						"Use rooms, channels, and fan-out logic to show how easy it is to leak data to the wrong audience in a real-time app. The key habit is to treat every broadcast path as an authorization surface."
				},
				{
					title: "Project: Secure Mini Chat or Notification Service",
					content:
						"Build a small real-time service with authenticated connections, validated events, bounded room membership, and basic abuse controls. Prioritize correct boundaries and observability over flashy features.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC5-Secure-Real-Time-Notifier/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC5-Secure-Real-Time-Notifier/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: WebSockets and Real-Time Security",
					content:
						"Keep a running security notebook for WebSockets and real-time security that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about how the connection is authenticated, which events are allowed, and when the service throttles or disconnects. The habit is evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC5-Secure-Real-Time-Notifier/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC5-Secure-Real-Time-Notifier/solution"
				},
				{
					title: "Real-Time Security Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Unit 10: WebSockets and Real-Time Security",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-21-unit-10-websockets-and-real-time-security-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-21-unit-10-websockets-and-real-time-security-supplemental-2/solution"
				},
				{
					title: "Real-Time Security Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Unit 10: WebSockets and Real-Time Security",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-22-unit-10-websockets-and-real-time-security-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-22-unit-10-websockets-and-real-time-security-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 11: Deployment Security Basics",
			curriculum: [
				{
					title: "Environment Variables and Secret Handling",
					content:
						"Secrets are runtime configuration injected deliberately, rotated when needed, and kept out of source control and logs. Distinguish public config, internal config, and true secrets before deciding where a value belongs."
				},
				{
					title: "TLS Certificate Placement and Renewal Ownership",
					content:
						"Explain where certificates live, which process terminates TLS, and who is responsible for renewal and failure monitoring. This gives the deployment model enough structure to reason about edge failures."
				},
				{
					title: "Service Exposure, Logs, and Recovery Signals",
					content:
						"Deployment review combines public exposure, logging quality, health checks, and rollback clarity. Before a service is declared secure enough to expose, the evidence shows what is public, what is logged, how health is checked, and how rollback would work."
				},
				{
					title: "Secure Release Checklist",
					content:
						"End the unit with a practical release checklist: only intended ports exposed, reverse-proxy headers understood, auth paths tested, limits in place, logs readable, and recovery steps documented. The emphasis is repeatable discipline rather than one-time heroics."
				},
				{
					title: "Unit 11: Deployment Security Basics: Core Project",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "Unit 11: Deployment Security Basics",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-08-unit-11-deployment-security-basics/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-08-unit-11-deployment-security-basics/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: Deployment Security Basics",
					content:
						"Keep a running security notebook for deployment security basics that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about what secrets exist, where TLS terminates, what is publicly exposed, and what evidence confirms the deployment state. The habit is evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-08-unit-11-deployment-security-basics/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-08-unit-11-deployment-security-basics/solution"
				},
				{
					title: "Deployment Review Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "Unit 11: Deployment Security Basics",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-23-unit-11-deployment-security-basics-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-23-unit-11-deployment-security-basics-supplemental-2/solution"
				},
				{
					title: "Deployment Review Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "Unit 11: Deployment Security Basics",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-24-unit-11-deployment-security-basics-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-24-unit-11-deployment-security-basics-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 12: Authorized Penetration Testing, AI-Assisted Workflow, and Disclosure",
			curriculum: [
				{
					title: "Rules of Engagement and Safe Penetration-Test Scope",
					content:
						"Penetration testing is an authorized defensive activity with explicit scope, approval, timing, and stop conditions. Only test local labs, staging systems, owned environments, or systems with written permission to assess. In-bounds targets must be defined before any probing begins."
				},
				{
					title: "Build a Repeatable Defensive Test Plan",
					content:
						"Convert the threat model into a concrete local test plan: authentication checks, authorization bypass attempts, malformed requests, request tampering, body-size limits, rate-limit behavior, proxy exposure, and log visibility. The emphasis is repeatable evidence gathering and safe rollback, not flashy one-off tricks."
				},
				{
					title: "Use AI to Draft Checks, Payload Variants, and Review Notes",
					content:
						"AI can be a constrained assistant for defensive work: drafting test matrices, generating benign local payload variations, summarizing logs, suggesting follow-up checks, and helping write clearer triage or disclosure notes. The hard boundaries remain explicit: never use AI as the final authority, never ask it to target unauthorized systems, never trust its security claims without local verification, and never let it replace a written scope or evidence trail."
				},
				{
					title: "Ethics and Responsible Disclosure for Network Findings",
					content:
						"Responsible disclosure is part of the engineering workflow: reproduce privately, minimize impact, document the vulnerable path, include evidence and reproduction notes, propose practical mitigations, and communicate within the agreed reporting channel. The expected handoff is calm, precise, and useful to maintainers instead of vague or harmful."
				},
				{
					title: "Unit 12: Authorized Penetration Testing, AI-Assisted Workflow, and Disclosure: Core Project",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Unit 12: Authorized Penetration Testing, AI-Assisted Workflow, and Disclosure",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-09-unit-12-authorized-penetration-testing-ai-assisted-workflow-and-disclosure/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-09-unit-12-authorized-penetration-testing-ai-assisted-workflow-and-disclosure/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: Authorized Penetration Testing, AI-Assisted Workflow, and Disclosure",
					content:
						"Keep a running security notebook for authorized penetration testing, AI-assisted workflow, and disclosure that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about written scope, permitted checks, how AI was used, and what evidence supports the final report. The habit is evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-09-unit-12-authorized-penetration-testing-ai-assisted-workflow-and-disclosure/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-09-unit-12-authorized-penetration-testing-ai-assisted-workflow-and-disclosure/solution"
				},
				{
					title: "Authorized Testing Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Unit 12: Authorized Penetration Testing, AI-Assisted Workflow, and Disclosure",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-25-unit-12-authorized-penetration-testing-ai-assisted-workflow-and-disclosure-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-25-unit-12-authorized-penetration-testing-ai-assisted-workflow-and-disclosure-supplemental-2/solution"
				},
				{
					title: "Authorized Testing Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Unit 12: Authorized Penetration Testing, AI-Assisted Workflow, and Disclosure",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-26-unit-12-authorized-penetration-testing-ai-assisted-workflow-and-disclosure-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-26-unit-12-authorized-penetration-testing-ai-assisted-workflow-and-disclosure-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 13: Capstone",
			curriculum: [
				{
					title: "Design a Small Secure Network Service",
					content:
						"Design a small TS service with a clear purpose, explicit actors, mapped trust boundaries, and a narrow exposed surface. The capstone starts with threat modeling and architecture before implementation begins."
				},
				{
					title: "Implement Controls and Observability Together",
					content:
						"Include validation, auth, authorization, rate limits, structured logs, and deployment notes as part of the same deliverable. Do not treat security and monitoring as separate post-build tasks."
				},
				{
					title: "Audit the Service with an Authorized Test Playbook",
					content:
						"Run a post-build audit that checks binding scope, proxy behavior, TLS placement, failure handling, abuse visibility, and the local penetration-test cases defined in the course playbook. AI may help organize the checklist or summarize results, but every claim in the final audit must still be backed by direct local evidence."
				},
				{
					title: "Write the Incident, Disclosure, and Recovery Notes",
					content:
						"Finish with a brief incident-response and disclosure packet that explains how suspicious requests would be investigated, which findings remain private until fixed, which logs are consulted first, and what immediate containment or recovery steps the operator would take."
				},
				{
					title: "Unit 13: Capstone: Core Project",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "Unit 13: Capstone",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-10-unit-13-capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-10-unit-13-capstone/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: Capstone",
					content:
						"Keep a running security notebook for the capstone that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about the full threat model, the defensive controls implemented, and the remaining risks after audit. The habit is evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-10-unit-13-capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-10-unit-13-capstone/solution"
				},
				{
					title: "Capstone Audit Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "Unit 13: Capstone",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-27-unit-13-capstone-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-27-unit-13-capstone-supplemental-2/solution"
				},
				{
					title: "Capstone Audit Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "Unit 13: Capstone",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-28-unit-13-capstone-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-28-unit-13-capstone-supplemental-3/solution"
				}
			]
		},
		{
			title: "NSEC14 Expansion Ideas and Next Steps",
			curriculum: [
				{
					title: "DNS and Email Security Follow-Up",
					content:
						"Extend the course with DNS security, resolver trust, email authentication, and delivery-surface protection once the core service boundary is already familiar."
				},
				{
					title: "OAuth and Session Security",
					content:
						"Add a deeper identity module on session lifecycle, delegated auth, token scopes, and callback-boundary handling after the HTTP and authz foundations are stable."
				},
				{
					title: "WAF, CDN, and Edge Controls",
					content:
						"WAF concepts, CDN caching risks, rate-limit policy at the edge, and request filtering extend the reverse-proxy and logging units."
				},
				{
					title: "Cloud Network Security Path",
					content:
						"Build a follow-up course around VPCs, security groups, subnets, private services, and public edge design to move from host-level hardening into cloud network architecture."
				},
				{
					title: "NSEC14 Expansion Ideas and Next Steps: Core Project",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "NSEC14 Expansion Ideas and Next Steps",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-11-nsec14-expansion-ideas-and-next-steps/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-11-nsec14-expansion-ideas-and-next-steps/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: Expansion Ideas and Next Steps",
					content:
						"Keep a running security notebook for expansion ideas and next steps that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about which next layer of security work builds most naturally from this course. The habit is evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-11-nsec14-expansion-ideas-and-next-steps/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-11-nsec14-expansion-ideas-and-next-steps/solution"
				},
				{
					title: "Next Steps Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "NSEC14 Expansion Ideas and Next Steps",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-29-nsec14-expansion-ideas-and-next-steps-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-29-nsec14-expansion-ideas-and-next-steps-supplemental-2/solution"
				},
				{
					title: "Next Steps Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle: "NSEC14 Expansion Ideas and Next Steps",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-30-nsec14-expansion-ideas-and-next-steps-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-30-nsec14-expansion-ideas-and-next-steps-supplemental-3/solution"
				}
			]
		},
		{
			title: "Network Security Lab 16: Service Boundary Hardening Studio",
			curriculum: [
				{
					title: "Service Boundary Hardening Studio: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Network Security Lab 16: Service Boundary Hardening Studio",
						section: "concepts"
					})
				},
				{
					title: "Service Boundary Hardening Studio: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Network Security Lab 16: Service Boundary Hardening Studio",
						section: "example"
					})
				},
				{
					title: "Service Boundary Hardening Studio: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Network Security Lab 16: Service Boundary Hardening Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-01-network-security-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-01-network-security-lab-16/solution"
				},
				{
					title: "Service Boundary Hardening Studio: Review",
					content: buildImplementationLabGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Network Security Lab 16: Service Boundary Hardening Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Service Boundary Hardening Studio: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Network Security Lab 16: Service Boundary Hardening Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-01-network-security-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-01-network-security-lab-16/solution"
				},
				{
					title: "Service Boundary Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Network Security Lab 16: Service Boundary Hardening Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-31-applied-studio-16-network-security-lab-16-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-31-applied-studio-16-network-security-lab-16-supplemental-2/solution"
				},
				{
					title: "Service Boundary Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Network Security Lab 16: Service Boundary Hardening Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-32-applied-studio-16-network-security-lab-16-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-32-applied-studio-16-network-security-lab-16-supplemental-3/solution"
				}
			]
		},
		{
			title: "Network Security Lab 17: Audit and Disclosure Studio",
			curriculum: [
				{
					title: "Audit and Disclosure Studio: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Network Security Lab 17: Audit and Disclosure Studio",
						section: "concepts"
					})
				},
				{
					title: "Audit and Disclosure Studio: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Network Security Lab 17: Audit and Disclosure Studio",
						section: "example"
					})
				},
				{
					title: "Audit and Disclosure Studio: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Network Security Lab 17: Audit and Disclosure Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-02-network-security-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-02-network-security-lab-17/solution"
				},
				{
					title: "Audit and Disclosure Studio: Review",
					content: buildImplementationLabGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Network Security Lab 17: Audit and Disclosure Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Audit and Disclosure Studio: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Network Security Lab 17: Audit and Disclosure Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-02-network-security-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-02-network-security-lab-17/solution"
				},
				{
					title: "Audit Report Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Network Security Lab 17: Audit and Disclosure Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-33-applied-studio-17-network-security-lab-17-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-33-applied-studio-17-network-security-lab-17-supplemental-2/solution"
				},
				{
					title: "Audit Report Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network security",
						moduleTitle:
							"Network Security Lab 17: Audit and Disclosure Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-34-applied-studio-17-network-security-lab-17-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-34-applied-studio-17-network-security-lab-17-supplemental-3/solution"
				}
			]
		}
	]
};

interface NetworkSecurityModuleFlow {
	stage: string;
	estimatedTime: string;
	keyBlocks: string[];
	practiceSection: string;
	answerSection: string;
	route: string;
	safeRoute: string;
	evidence: string;
	reference: string;
}

const NETWORK_SECURITY_PRACTICE_PACK =
	"/course-assets/network-security/network-security-practice-pack.md";
const NETWORK_SECURITY_VERIFICATION_GUIDE =
	"/course-assets/network-security/network-security-verification-guide.md";
const NETWORK_SECURITY_PRIMARY_MODULE_COUNT = 14;

const NETWORK_SECURITY_MODULE_FLOW: Record<string, NetworkSecurityModuleFlow> =
	{
		"NSEC0 Setup and Tooling": {
			stage: "Secure lab readiness",
			estimatedTime: "2–3 sessions · 45–60 minutes each",
			keyBlocks: [
				"Node LTS",
				"strict TypeScript",
				"local target",
				"synthetic data",
				"rules of engagement",
				"cleanup"
			],
			practiceSection: "secure-lab-readiness-case",
			answerSection: "secure-lab-readiness-key",
			route: "Use Node.js 24 LTS with the project-pinned TypeScript compiler, strict typechecking, locked dependencies, local tests, and a loopback-only toy service. Record runtime, package manager, dependency state, bind address, data classification, and clean run/test commands before security work begins.",
			safeRoute:
				"Write the rules of engagement first: owned local target, synthetic identities and data, allowed requests, rate and size limits, stop conditions, no outbound dependency unless declared, and exact cleanup. The supplied readiness case completes the same reasoning without starting a server.",
			evidence:
				"A clean-checkout record proves install assumptions without exposing credentials, compiles and tests the smallest fixture, confirms loopback scope, identifies every permitted input, and names the stop and reset route.",
			reference: "https://nodejs.org/en/about/previous-releases"
		},
		"Unit 1: Security Model of Networked Systems": {
			stage: "Model before testing",
			estimatedTime: "4 sessions · 45–60 minutes each",
			keyBlocks: [
				"asset",
				"actor",
				"trust boundary",
				"entry point",
				"abuse case",
				"control"
			],
			practiceSection: "threat-model-and-trust-boundary-case",
			answerSection: "threat-model-and-trust-boundary-key",
			route: "Map the toy service's assets, actors, data flows, trust boundaries, entry points, privileged actions, abuse cases, controls, and assumptions before selecting tests. Separate confidentiality, integrity, and availability impacts and keep each control tied to one stated risk.",
			safeRoute:
				"Model only the supplied fictional service or an owned local fixture. Avoid real organizations, identities, architecture diagrams, credentials, vulnerabilities, or claims about systems that were not observed and authorized.",
			evidence:
				"The model names the protected asset, untrusted input, boundary crossing, actor capability, likely misuse, consequence, preventive or detective control, validation evidence, and remaining assumption for each priority path.",
			reference:
				"https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html"
		},
		"Unit 2: Sockets, Ports, and Services": {
			stage: "Inventory the service boundary",
			estimatedTime: "3–4 sessions · 45–60 minutes each",
			keyBlocks: [
				"process",
				"listener",
				"bind scope",
				"protocol",
				"identity",
				"exposure decision"
			],
			practiceSection: "listener-exposure-and-ownership-case",
			answerSection: "listener-exposure-and-ownership-key",
			route: "Map every course-owned listener to process, user, protocol, bind address, port, intended client, authentication expectation, authorization boundary, and local application check. Treat the port as routing metadata rather than proof of protocol or trust.",
			safeRoute:
				"Use supplied listener records or the owned toy host only. Never inventory a shared machine, sweep ports, probe neighboring addresses, publish a wildcard listener, or label an unfamiliar process malicious without evidence.",
			evidence:
				"The inventory distinguishes loopback, private-lab, wildcard, and unknown scope; identifies ownership and expected clients; records the least-exposure correction; and states the bounded evidence still needed for any reachability claim.",
			reference:
				"https://owasp.org/www-project-application-security-verification-standard/"
		},
		"Unit 3: HTTP and API Security Basics": {
			stage: "Enforce request identity and authority",
			estimatedTime: "5–6 sessions · 45–60 minutes each",
			keyBlocks: [
				"request contract",
				"authentication",
				"authorization",
				"object access",
				"state change",
				"error surface"
			],
			practiceSection: "request-authentication-and-authorization-case",
			answerSection: "request-authentication-and-authorization-key",
			route: "Trace one request through method, path, headers, cookie or token boundary, authenticated subject, requested object, action-level and object-level authorization, state change, response, and audit event. Test identity and authority separately.",
			safeRoute:
				"Use synthetic users, opaque stand-in tokens, fictional objects, and an in-memory local handler. Never place real tokens in a URL, log, fixture, screenshot, AI prompt, or course submission; no request leaves loopback.",
			evidence:
				"The request matrix proves unauthenticated rejection, cross-user object denial, role-action denial, authorized success, replay or duplicate-state behavior, safe error shape, and absence of secret or private data in logs and responses.",
			reference:
				"https://owasp.org/API-Security/editions/2023/en/0x03-introduction/"
		},
		"Unit 4: TLS and Secure Transport": {
			stage: "Verify transport identity",
			estimatedTime: "4–5 sessions · 45–60 minutes each",
			keyBlocks: [
				"transport boundary",
				"certificate name",
				"trust chain",
				"TLS version",
				"proxy termination",
				"visibility limit"
			],
			practiceSection: "tls-certificate-and-proxy-case",
			answerSection: "tls-certificate-and-proxy-key",
			route: "Verify where TLS begins and ends, which name the client expects, what chain and validity evidence establishes trust, what the reverse proxy forwards, and which metadata remains visible after application content is encrypted.",
			safeRoute:
				"Use supplied certificate output or a local certificate created only for fictional `.test` names. Do not disable verification, submit private keys, copy browser stores, request a real certificate, or expose the toy service publicly.",
			evidence:
				"The transport record identifies TLS version, peer name, trust result, validity, termination point, upstream scheme and listener, redirect behavior, forwarded-header decision, observable metadata, and one limitation of the evidence.",
			reference:
				"https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html"
		},
		"Unit 5: Input Validation on the Network Boundary": {
			stage: "Reject unsafe input early",
			estimatedTime: "5 sessions · 45–60 minutes each",
			keyBlocks: [
				"content type",
				"schema",
				"semantic rule",
				"size limit",
				"safe rejection",
				"downstream isolation"
			],
			practiceSection: "schema-validation-and-resource-limit-case",
			answerSection: "schema-validation-and-resource-limit-key",
			route: "Validate method and content type, body and field size, structure, required fields, types, allowed values, semantic relationships, normalization, unknown-property policy, and downstream authorization before business logic or storage.",
			safeRoute:
				"Use bounded JSON fixtures with harmless malformed values. Do not generate denial-of-service volumes, exploit payloads, file uploads, command strings, or inputs aimed at a real parser; every negative test has a fixed size and count.",
			evidence:
				"The test table proves valid acceptance, missing and extra field handling, wrong type, boundary length, semantic conflict, oversized body rejection before parsing or deeper work, stable error shape, and no secret reflection.",
			reference:
				"https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html"
		},
		"Unit 6: Logging, Monitoring, and Forensics": {
			stage: "Create privacy-safe evidence",
			estimatedTime: "4–5 sessions · 45–60 minutes each",
			keyBlocks: [
				"event schema",
				"correlation",
				"redaction",
				"threshold",
				"timeline",
				"retention"
			],
			practiceSection: "security-logging-and-incident-timeline-case",
			answerSection: "security-logging-and-incident-timeline-key",
			route: "Define security-relevant events before collecting them: timestamp, event type, synthetic actor, route or channel, decision, reason code, correlation identifier, severity, and safe operational context. Build alerts from patterns rather than one ambiguous line.",
			safeRoute:
				"Use supplied fictional logs. Never log complete tokens, cookies, passwords, message bodies, personal data, private payloads, or AI conversation context; redact before sharing and cap retained excerpts.",
			evidence:
				"The timeline links one symptom to a bounded event sequence, distinguishes observation from inference, identifies the trigger and control response, records rejected explanations, preserves only necessary fields, and states retention plus deletion rules.",
			reference:
				"https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"
		},
		"Unit 7: Firewalls, Proxies, and Exposure": {
			stage: "Layer exposure controls",
			estimatedTime: "4–5 sessions · 45–60 minutes each",
			keyBlocks: [
				"upstream listener",
				"proxy listener",
				"host policy",
				"trusted proxy",
				"client identity",
				"rollback"
			],
			practiceSection: "proxy-exposure-and-forwarded-header-case",
			answerSection: "proxy-exposure-and-forwarded-header-key",
			route: "Keep the application on loopback, expose one private-lab proxy listener, define the intended client and port, set an explicit trusted-proxy boundary, and derive scheme or client address only from headers inserted by that trusted hop.",
			safeRoute:
				"Use supplied configuration and request records or an owned isolated VM with console recovery. No public listener, router forwarding, public certificate, cloud policy, or broad firewall change is required; preview and rollback precede any live policy edit.",
			evidence:
				"The evidence separates upstream and proxy listeners, proves direct upstream closure, tests allowed and denied clients, rejects spoofed forwarded headers from an untrusted path, preserves management access, and restores the baseline.",
			reference:
				"https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html"
		},
		"Unit 8: Secure Node/TypeScript Services": {
			stage: "Build the hardened local service",
			estimatedTime: "6–8 sessions · 45–60 minutes each",
			keyBlocks: [
				"strict types",
				"dependency lock",
				"middleware order",
				"authorization",
				"error boundary",
				"negative tests"
			],
			practiceSection: "secure-typescript-service-case",
			answerSection: "secure-typescript-service-key",
			route: "Assemble the local service in a deliberate order: request identifier, transport and proxy assumptions, size limit, parser, schema, authentication, authorization, route handler, safe error boundary, security headers, structured event, and bounded shutdown.",
			safeRoute:
				"Use in-memory fictional records, loopback binding, locked dependencies, and local tests. No database credential, third-party API, analytics, outbound webhook, user email, or production configuration belongs in the core build.",
			evidence:
				"Typecheck and tests prove middleware order, invalid-body rejection, identity and object authorization, CORS or origin policy, safe headers, nonleaking errors, bounded shutdown, redacted logs, and one dependency or configuration review.",
			reference:
				"https://nodejs.org/en/learn/getting-started/security-best-practices"
		},
		"Unit 9: Defensive Network Tooling in TS": {
			stage: "Turn evidence into bounded decisions",
			estimatedTime: "5 sessions · 45–60 minutes each",
			keyBlocks: [
				"approved fixture",
				"feature",
				"threshold",
				"decision",
				"false positive",
				"human review"
			],
			practiceSection: "rate-limit-and-abuse-decision-case",
			answerSection: "rate-limit-and-abuse-decision-key",
			route: "Build deterministic helpers over supplied request metadata: normalize safe fields, group by synthetic actor, apply window and resource limits, explain threshold decisions, retain uncertainty, and route consequential actions to review rather than claiming certainty from one signal.",
			safeRoute:
				"The tool reads only local fixtures and cannot open sockets, scan, block a real address, call an external service, or ingest raw personal data. Actor labels and addresses are fictional, and each dataset has a fixed maximum size.",
			evidence:
				"The detector passes normal, burst, repeated-failure, boundary-time, malformed-row, and ambiguous cases; reports the supporting events; records false-positive and evasion limits; and distinguishes recommendation from enforcement.",
			reference:
				"https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/"
		},
		"Unit 10: WebSockets and Real-Time Security": {
			stage: "Secure connection and message state",
			estimatedTime: "5–6 sessions · 45–60 minutes each",
			keyBlocks: [
				"origin",
				"session",
				"message schema",
				"room authorization",
				"backpressure",
				"disconnect"
			],
			practiceSection: "realtime-connection-and-message-case",
			answerSection: "realtime-connection-and-message-key",
			route: "Treat handshake, authenticated connection, per-message authorization, schema and size validation, room or channel membership, rate and backpressure limits, heartbeat, session expiration, logout, and disconnect as separate state transitions.",
			safeRoute:
				"Use a local notification fixture with synthetic connections and no free-form chat, file transfer, external broker, real cookie, or user identity. Message counts and sizes remain bounded, and every connection closes during cleanup.",
			evidence:
				"The transition table proves origin and authentication rejection, allowed subscription, cross-room denial, unknown and oversized message handling, rate or backpressure response, session expiry, logout closure, redacted event logging, and clean disconnect.",
			reference:
				"https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html"
		},
		"Unit 11: Deployment Security Basics": {
			stage: "Prepare a recoverable release",
			estimatedTime: "5 sessions · 45–60 minutes each",
			keyBlocks: [
				"configuration",
				"secret boundary",
				"dependency review",
				"release evidence",
				"health signal",
				"rollback"
			],
			practiceSection: "secure-release-and-recovery-case",
			answerSection: "secure-release-and-recovery-key",
			route: "Separate committed configuration from injected secrets, record runtime and dependency versions, verify build and tests, review listener and proxy assumptions, define health and security-event signals, stage one release, and prove rollback to the last trusted artifact.",
			safeRoute:
				"Use placeholders and a supplied secret inventory without values. No real deployment account, token, certificate key, production log, cloud console, public DNS, remote registry credential, or third-party service is needed.",
			evidence:
				"The release packet includes provenance, lock state, typecheck and test results, configuration schema, secret owners without values, local smoke test, listener scope, log redaction check, backup or prior artifact, rollback, and post-rollback verification.",
			reference: "https://csrc.nist.gov/pubs/sp/800/218/final"
		},
		"Unit 12: Authorized Penetration Testing, AI-Assisted Workflow, and Disclosure":
			{
				stage: "Verify and communicate within scope",
				estimatedTime: "5–6 sessions · 45–60 minutes each",
				keyBlocks: [
					"authorization",
					"test case",
					"request limit",
					"AI boundary",
					"remediation",
					"disclosure"
				],
				practiceSection: "authorized-test-ai-and-disclosure-case",
				answerSection: "authorized-test-ai-and-disclosure-key",
				route: "Translate selected ASVS, API Top 10, and versioned WSTG requirements into local test cases with preconditions, bounded input, expected secure result, observed result, evidence, severity rationale, remediation, and retest.",
				safeRoute:
					"Authorization comes from the written local fixture scope, never from an AI tool. AI may draft variations or review wording only after the target and limits are fixed; it receives no secrets or real data, runs no commands, and every suggestion is reviewed before use.",
				evidence:
					"The report proves the target and permission, maps each check to a requirement, stays under request and size limits, separates finding from speculation, records AI assistance and human verification, retests the correction, and addresses the intended disclosure audience.",
				reference:
					"https://owasp.org/www-project-web-security-testing-guide/v42/2-Introduction/README"
			},
		"Unit 13: Capstone": {
			stage: "Secure-service capstone",
			estimatedTime: "10–14 sessions · 45–60 minutes each",
			keyBlocks: [
				"threat model",
				"secure service",
				"observability",
				"authorized audit",
				"incident response",
				"recovery packet"
			],
			practiceSection: "secure-service-capstone-case",
			answerSection: "secure-service-capstone-key",
			route: "Build one local TypeScript service through vertical slices: threat model, request and identity boundary, schema and resource limits, object and action authorization, local TLS or supplied certificate evidence, proxy scope, structured security events, real-time state when used, authorized tests, one injected incident, remediation, retest, and rollback.",
			safeRoute:
				"Keep the service on loopback or an owned isolated lab host with synthetic users and data. No public endpoint, real credential, external identity provider, payment, email, cloud account, production database, third-party target, or autonomous AI test belongs in the capstone.",
			evidence:
				"The final packet contains versions, scope, threat model, architecture, selected standard checks, typecheck and tests, negative cases, transport and exposure evidence, redacted timeline, two findings or one incident, fixes, retests, release and rollback steps, limitations, and disclosure notes.",
			reference: "https://csrc.nist.gov/pubs/sp/800/61/r3/final"
		}
	};

function networkSecurityPracticeLink(section: string) {
	return `${NETWORK_SECURITY_PRACTICE_PACK}#${section}`;
}

function networkSecurityVerificationLink(section: string) {
	return `${NETWORK_SECURITY_VERIFICATION_GUIDE}#${section}`;
}

function networkSecuritySupplementalPath(title: string) {
	if (/extension|challenge/i.test(title)) return "challenge" as const;
	if (/security notebook/i.test(title)) return "core" as const;
	return "choice" as const;
}

function networkSecurityArchivePath(title: string) {
	const learningPath = networkSecuritySupplementalPath(title);
	return learningPath === "core" ? ("choice" as const) : learningPath;
}

function decorateNetworkSecurityModule(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const flow = NETWORK_SECURITY_MODULE_FLOW[module.title];
	if (!flow)
		throw new Error(`Missing Network Security flow: ${module.title}`);

	const practiceLink = networkSecurityPracticeLink(flow.practiceSection);
	const verificationLink = networkSecurityVerificationLink(
		flow.answerSection
	);
	const curriculum = module.curriculum.map((item, index) => ({
		...item,
		content:
			index === 0
				? `**Course flow:** ${flow.stage}. ${flow.route}

**Safe practice route:** ${flow.safeRoute}

**Evidence gate:** ${flow.evidence}

**Local continuity:** Use the [supplied practice case](${practiceLink}) when a local Node service, isolated lab host, approved security test, or privacy-safe evidence route is unavailable. Record an independent decision before comparing it with the [verification guide](${verificationLink}).

**Primary reference:** [Open the current reference](${flow.reference}). Record the standard or guide version, Node release, package versions, local target, and rules of engagement when the result depends on them.

${item.content}`
				: item.content,
		learningPath: "core" as const,
		...(item.projectLink
			? {
					datasetLink: item.datasetLink ?? practiceLink,
					mediaLink: item.mediaLink ?? flow.reference
				}
			: {})
	}));

	return {
		...module,
		kind: "module",
		estimatedTime: flow.estimatedTime,
		keyBlocks: [...flow.keyBlocks],
		curriculum,
		supplementalProjects: module.supplementalProjects.map(item => ({
			...item,
			learningPath: networkSecuritySupplementalPath(item.title),
			datasetLink: item.datasetLink ?? practiceLink,
			mediaLink: item.mediaLink ?? flow.reference
		}))
	};
}

function buildOptionalNetworkSecurityArchive(
	modules: RawCourse["modules"]
): RawCourse["modules"][number] {
	const practiceLink = networkSecurityPracticeLink(
		"secure-service-capstone-case"
	);
	const verificationLink = networkSecurityVerificationLink(
		"secure-service-capstone-key"
	);
	const reference =
		"https://owasp.org/www-project-application-security-verification-standard/";

	return {
		kind: "appendix",
		title: "Optional Network Security Expansion and Studio Archive",
		estimatedTime:
			"Choose one 3–5-session topic or studio when extra transfer is useful",
		keyBlocks: [
			"session security",
			"edge controls",
			"service hardening",
			"audit report",
			"remediation",
			"transfer"
		],
		curriculum: [
			{
				title: "Network Security Expansion and Studio Archive Guide",
				content: `**Course flow:** NSEC14 Expansion Ideas and Next Steps, Network Security Lab 16: Service Boundary Hardening Studio, and Network Security Lab 17: Audit and Disclosure Studio are optional enrichment after Unit 13: Capstone. Select one topic or studio to revisit a weak control, evidence, or reporting target; completing all three is not required for the secure-service capstone.

**Safe practice route:** Keep the selected work on the supplied local fixture or use the [supplied capstone case](${practiceLink}). OAuth, WAF/CDN, email security, DNS security, cloud controls, and public disclosure remain conceptual or case-based unless a later course creates a separately authorized environment.

**Evidence gate:** The selected option produces one bounded requirement, one local or supplied case, one finding or comparison, one remediation or design decision, one retest or review result, and one explicit scope limit.`,
				learningPath: "choice",
				datasetLink: practiceLink,
				solutionLink: verificationLink,
				mediaLink: reference
			}
		],
		supplementalProjects: modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects].map(
				item => ({
					...item,
					learningPath: networkSecurityArchivePath(item.title),
					datasetLink: item.datasetLink ?? practiceLink,
					mediaLink: item.mediaLink ?? reference
				})
			)
		)
	};
}

const networkSecurityPrimaryModules = networkSecuritySourceCourse.modules
	.slice(0, NETWORK_SECURITY_PRIMARY_MODULE_COUNT)
	.map(decorateNetworkSecurityModule);
const networkSecurityOptionalModules =
	networkSecuritySourceCourse.modules.slice(
		NETWORK_SECURITY_PRIMARY_MODULE_COUNT
	);

export const networkSecurityCourse: RawCourse = {
	...networkSecuritySourceCourse,
	modules: [
		...networkSecurityPrimaryModules,
		buildOptionalNetworkSecurityArchive(networkSecurityOptionalModules)
	]
};
