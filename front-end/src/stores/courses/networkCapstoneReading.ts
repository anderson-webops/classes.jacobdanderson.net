import type { RawCourse } from "./types";
import guide from "../../assets/course-guides/network-operations-capstone.md?raw";

const title = "Network Systems Lab 17: Operations Capstone Studio";

const pacing = [
	"## Independent work and paced walkthrough",
	"",
	"Use the same saved investigation for independent work and a guided walkthrough. Plan eight to twelve sessions of forty-five to sixty minutes. Retain a prediction before each observation and an explanation afterward.",
	"",
	"1. Confirm the owned Linux boundary, prerequisites, tool versions and cleanup plan.",
	"2. Draw both address families, the client and server links, next hops and return paths.",
	"3. Trace the explicit resolver transport, A/AAAA answers, listeners and policy matrix.",
	"4. Preserve the unfinished starter run and identify the earliest failure in each family.",
	"5. Correct only the IPv4 route, predict the remaining application-boundary failure and retest.",
	"6. Correct the upstream port and reconcile both family HTTP responses, tokens and denied controls.",
	"7. Interpret the bounded capture and repeat the changed client, name and proxy-port case.",
	"8. Reconcile worker, namespace and parent-state cleanup, finish the runbook and review its limits.",
	"",
	"Use extra sessions to revisit an unsupported boundary or improve evidence. Completing the optional transfer and extension projects is not a prerequisite. A successful program exit does not replace the explanation, first-failure history or cleanup evidence."
].join("\n");

const walkthrough = [
	"## Continue the routed operations investigation",
	"",
	"This Guided Example reopens the matching core project and preserves the same saved attempt. Read the full Core Concepts or Core Project guide before running the fixture. Keep all six imported files together, including case.json, network-notes.md, edge-cases.md and the shared README.md. The reference remains a separate role.",
	"",
	"### Work from the first failed boundary",
	"",
	"Before running the unfinished starter, draw the client-router-server topology and predict the two families independently. Use sudo python3 main.py --output ./first-observation in the owned disposable Linux VM. Record the actual output directory and retain receipt.json, inside.json, commands.json, parent-commands.json, logs, response bodies and capture.pcap.",
	"",
	"Compare the IPv4 destination with the client's configured route. A missing route precedes a connection attempt. Separately follow the IPv6 resolver answer and proxy response. A proxy-generated 502 establishes a different boundary from an absent route: the request reached the proxy, whose configured loopback upstream did not provide the response.",
	"",
	"Change only the route in case.json and predict the remaining result before using a fresh ./route-corrected output folder. Then correct the upstream port and use ./both-corrected. Keep the intermediate failure beside both corrections, rather than replacing the original observation. The reference configuration is available separately after the independent diagnosis.",
	"",
	"### Explain success, denial and cleanup separately",
	"",
	"Reconcile the A and AAAA answers with actual destination addresses, explicit resolver transport, route lookups, listeners, policy and per-run HTTP token. Retain /health success and the application /missing 404. Compare the live TCP 8088 denial control in both families with the loopback-only backend denial. A listener alone does not establish reachability.",
	"",
	"Interpret DNS exchanges and HTTP requests in the bounded capture. Repeat --alternate with a fresh output folder after predicting the changed client prefix, fictional name and proxy port. Confirm allWorkersReaped, the empty remaining namespace list and the actual parent's before/after comparison for every attempt.",
	"",
	"Complete both notebooks with versions, scope, predictions, raw observations, first failures, corrections, retests, packet interpretation, cleanup and one limitation. Python programming is optional. The supplied apparatus stays unchanged; case configuration and the evidence-based explanation are required. A paced walkthrough pauses at the same route, resolver, proxy and cleanup boundaries."
].join("\n");

export function withNetworkCapstoneReading(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	if (module.title !== title) return module;
	const boundaryCard = module.curriculum[0].content
		.split("\n\n")
		.slice(0, 5)
		.join("\n\n");
	const core = module.curriculum.find(
		item => item.title === "Operations Capstone Studio: Core Project"
	)!;
	return {
		...module,
		curriculum: module.curriculum.map(item => {
			if (item.title === "Operations Capstone Studio: Core Concepts") {
				return {
					...item,
					content: `${boundaryCard}\n\n${guide}\n\n${pacing}`,
					preserveInstructions: true
				};
			}
			if (item.title === "Operations Capstone Studio: Guided Example") {
				return {
					...item,
					content: walkthrough,
					projectLink: core.projectLink,
					solutionLink: core.solutionLink,
					datasetLink: core.datasetLink,
					mediaLink: core.mediaLink,
					ideImport: true,
					preserveInstructions: true,
					learningPath: "core" as const
				};
			}
			if (item.title === "Operations Capstone Studio: Review") {
				return {
					...item,
					content:
						"## Review the completed operations packet\n\nExplain both address families, the explicit resolver and each returned destination, the next hops and return paths, the loopback backend and separate proxy, and every allowed or denied tuple. Retain the two first-failing-layer diagnoses, route-only correction, completed configuration and changed-case retests. Match the bounded PCAP to actual DNS and HTTP evidence with each run's own token. Confirm worker reaping, empty namespaces and the unchanged parent configuration separately from application success.\n\nA complete packet contains topology, boundary, versions, predictions, exact commands and raw results, both configuration changes, intermediate and final retests, policy matrix, packet interpretation, cleanup runbook and known limitations. Compare an independent explanation before opening the reference, or use the same saved evidence for a paced walkthrough. Program success alone is insufficient."
				};
			}
			return item;
		}),
		supplementalProjects: module.supplementalProjects.map(item =>
			item.title === "Operations Capstone Studio: Extension Challenge"
				? {
						...item,
						content:
							"## Optional capstone evidence challenge\n\nAfter completing the required capstone, use a separate saved attempt to predict how the --alternate case changes client prefixes, the fictional DNS name and the proxy port. Explain which server-side prefix and loopback backend assumptions remain unchanged. Compare both families' actual DNS, route, policy, HTTP and packet evidence, then identify an unsupported claim that the bounded capture cannot establish.\n\nKeep case.json, both notebooks and the full fixture together. Follow the imported README.md in an owned disposable Linux VM, use a fresh output folder and verify cleanup. The optional challenge and its reference remain separate from the required core attempt. Extra Python programming is optional; the deliverable is a supported comparison with one remaining limitation."
					}
				: item
		)
	};
}
