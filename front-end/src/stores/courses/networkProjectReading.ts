import type { RawCourse } from "./types";
import namingReading2 from "../../assets/course-guides/network-addresses-families.md?raw";
import namingReading1 from "../../assets/course-guides/network-addresses-transfer.md?raw";
import namingReading0 from "../../assets/course-guides/network-addresses.md?raw";

import firewallReading from "../../assets/course-guides/network-firewall-policy.md?raw";
import captureReading from "../../assets/course-guides/network-http-capture.md?raw";
import topologyReading from "../../assets/course-guides/network-routing-exposure.md?raw";
import setupReading from "../../assets/course-guides/network-setup.md?raw";
import transportReading from "../../assets/course-guides/network-transport.md?raw";
import {
	networkCourseResource,
	networkPinnedCourseUrl
} from "../../modules/networkProjectResources";

const readings: Record<string, string> = {
	"NS-04-ns0-setup-and-tooling": setupReading,
	"NS-05-unit-1-the-network-stack-in-plain-english": transportReading,
	"NS-06-unit-2-addresses-and-naming": namingReading0,
	"NS-05-unit-2-addresses-and-naming-supplemental-2": namingReading1,
	"NS-06-unit-2-addresses-and-naming-supplemental-3": namingReading2,
	"NS6-Router-NAT-Topology-Lab": topologyReading,
	"NS5-Tcpdump-HTTP-Capture": captureReading,
	"NS3-UFW-Web-Server-Policy": firewallReading
};

export function withNetworkProjectReadings(
	module: RawCourse["modules"][number]
) {
	const decorate = (
		item: RawCourse["modules"][number]["curriculum"][number]
	) => {
		const projectLink = networkPinnedCourseUrl(item.projectLink ?? "");
		const selected = networkCourseResource(projectLink);
		if (!selected) return item;
		const notebook = item.title.startsWith("Operations Notebook:");
		const topology = selected.pack === "NS6-Router-NAT-Topology-Lab";
		const capture = selected.pack === "NS5-Tcpdump-HTTP-Capture";
		const firewall = selected.pack === "NS3-UFW-Web-Server-Policy";
		const exposure = topology && module.title.startsWith("Unit 12:");
		const reading = readings[selected.pack]
			.replace(
				/This replaces the unrelated port-list exercise previously (?:present )?in this folder\./,
				""
			)
			.replace("should retain", "retains")
			.replace(
				"Flow membership should follow",
				"Check whether flow membership follows"
			)
			.replace(
				/agreed\s+instructor checkpoint/g,
				"agreed review checkpoint"
			)
			.replace(
				"Independent and instructor use",
				"Independent and guided use"
			)
			.replace(
				"before comparing the evidence with an instructor.",
				"before comparing the evidence during a guided review."
			)
			.replace("Keep your edited rules", "Keep the edited rules")
			.replace(
				"For an instructor walkthrough",
				"For a guided walkthrough"
			)
			.trim();
		const firewallNotebook = `## Preserve a policy and rollback evidence notebook

Opening this notebook reopens the matching core project and keeps its saved policy attempt. Complete only the management and web cases in policy-rules.sh. The supplied apparatus performs the real UFW experiment in private network and mount namespaces inside an owned disposable Linux VM with root and console access. Keep the selected profile and exact rule choices beside each report.

### Predict the policy boundary

Sketch the client and service endpoints. Predict the fresh management-marker, web and unrequested-service outcomes before activation, while the policy is active and after restoration. Explain why a nondefault management port differs from an assumed OpenSSH profile. The marker is not an SSH daemon. Record the prior inactive state and the retained rule; the project preserves both as evidence for rollback.

### Observe, restore and review

Reconcile actual response tokens, peer and destination tuples, service PID, numbered UFW output and kernel counters. Confirm that the blocked listener remains running. Compare the changed management port and reverse-order runs. Distinguish a logging-rule counter from a retained journal message, and a successful old connection from a fresh allowed connection. Verify the exact private configuration and kernel restoration, all three restored responses, worker reaping, namespace removal and the measured outer host comparison. Python programming is optional; firewall_runtime.py stays unchanged. Review each prediction independently or pause a guided walkthrough at topology, rules, fresh requests and recovery. Follow the full core-card guide and imported README.md for commands and interpretation.`;
		const captureNotebook = `## Preserve an HTTP packet evidence notebook

Opening this notebook reopens the matching core project and preserves its saved capture attempt. Complete the two count/filter choices in capture-options.sh in that project. Use a disposable Linux VM with root access and the tools named in the imported README.md; the site IDE edits and saves the files while the VM performs the real packet capture.

### Predict and identify

Record why the owned loopback interface matches the local HTTP request. Predict the selected service port, the role of the client's ephemeral port, and the effect of including or excluding the independent noise service. Explain why a packet count also needs a wall-clock bound. The supplied numeric display option does not alter the captured headers.

### Compare and review

Keep the original report and the report from --reverse beside their exact settings. Use actual captured bytes and numeric readback to identify SYN, reverse-direction SYN/ACK, the HTTP request line, response status and per-run response token. Compare packet selection with traffic order. A TCP acknowledgement alone does not establish HTTP success, and this plaintext local experiment does not establish what TLS would reveal. Record both process cleanup and unchanged host network configuration. Python programming is optional; the supplied apparatus stays unchanged. Review the explanation independently or pace a walkthrough through endpoints, transport, HTTP, filter contrast and cleanup. Follow the full core-card guide and imported README.md for execution and evidence details.`;
		const topologyContinuation = exposure
			? `## Secure exposure: continue the existing router attempt

Opening this notebook reopens the matching core project and keeps the same saved Unit7 attempt. The routing, forwarding and translation cases remain prerequisites. The additional Unit12 task is the fourth shell case: a stateful forwarding policy, selected with --exposure-policy in the disposable Linux VM.

### Predict the policy boundary

Predict success for an allowed request through 10.10.0.1:18080 and denial for a fresh direct request to 10.20.0.2:8080. Separate the original destination, translated destination and return traffic. Explain why established replies need their own allowance and why a listening socket alone proves neither policy outcome.

### Observe, compare and review

Keep the earlier routing report, the edited filter case, both fresh request outcomes and actual forwarding-rule counters in network-notes.md. Compare the blocked direct request with a successful direct request after the owned policy is restored. Check that routes, translation rules and the server remain available during that comparison. Record interruption cleanup as a separate outcome. The prewritten Python apparatus stays unchanged; programming it is optional. Review the predictions against the retained evidence independently or in a guided walkthrough before completing this capstone pass. Follow the full core-card guide and imported README.md for commands and expected stages.`
			: `## Routing and translation: keep an operations notebook

Opening this notebook reopens the matching core project and keeps the same saved Unit7 attempt. Use the three routing/SNAT/DNAT shell cases in the owned disposable IPv4 topology. The notebook records observations from that project; it is not another implementation assignment.

### Predict and trace

Before running each stage, draw the client, router and service interfaces. Record the client's next hop, the forwarding decision and the service's return route. Predict the source address seen by the server before and after source translation. For destination translation, distinguish the address requested by the client from the actual listening endpoint.

### Observe, explain and review

Keep each prediction beside actual command output, the measured HTTP result and the supporting route or rule in network-notes.md. Compare forwarding-off with routed traffic, then compare the routed, translated and mapping-removed stages. A successful request is evidence for that particular path; it does not establish public Internet reachability. Record cleanup and explain any mismatch before revising the prediction. Review the completed trace independently or use it to pace a guided walkthrough. Python programming is optional; the prewritten apparatus stays unchanged. Follow the full core-card guide and imported README.md for execution. Unit12 later continues this saved attempt with the fourth filter case and --exposure-policy.`;
		return {
			...item,
			projectLink,

			solutionLink: networkPinnedCourseUrl(item.solutionLink ?? ""),
			ideImport: true,
			preserveInstructions: true,

			content:
				notebook && firewall
					? firewallNotebook
					: notebook && capture
						? captureNotebook
						: notebook && topology
							? topologyContinuation
							: notebook
								? `${item.content}\n\nContinue the existing core project. Opening this notebook reopens the matching core project rather than creating a second assignment. Keep predictions, actual command output, endpoint and process identities, changed-case comparisons and cleanup in network-notes.md. Follow the complete guide on the core project card and in README.md. Python programming is optional supplemental practice; command observations and the notebook are the core deliverable.`
								: `${exposure ? "Continue the saved Unit7 attempt for the Unit12 Secure Exposure pass. Complete the fourth shell case and run --exposure-policy; the three earlier routing/NAT cases remain prerequisites.\n\n" : ""}${reading}\n\nSource guide: [Network Systems project](${projectLink}). Edit, save, review and export the selected role in the site IDE, then follow README.md in an external Linux terminal. The reference is separate from the learner attempt.`
		};
	};
	return {
		...module,
		curriculum: module.curriculum.map(decorate),
		supplementalProjects: module.supplementalProjects.map(decorate)
	};
}
