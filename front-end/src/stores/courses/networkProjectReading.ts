import type { RawCourse } from "./types";
import namingReading2 from "../../assets/course-guides/network-addresses-families.md?raw";
import namingReading1 from "../../assets/course-guides/network-addresses-transfer.md?raw";
import namingReading0 from "../../assets/course-guides/network-addresses.md?raw";

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
	"NS6-Router-NAT-Topology-Lab": topologyReading
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
		const exposure = topology && module.title.startsWith("Unit 12:");
		const reading = readings[selected.pack]
			.replace(
				/This replaces the unrelated port-list exercise previously (?:present )?in this folder\./,
				""
			)
			.replace("should retain", "retains")
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
		const topologyContinuation =
			"Continue the existing Unit7 router project. Opening this notebook reopens the matching core project and keeps the same saved Unit7 attempt. Unit7 requires the three routing/SNAT/DNAT shell cases. Unit12 adds the fourth filter case and --exposure-policy, using actual policy/rule counters, fresh mapped/direct requests and restoration as evidence. Keep both reports, predictions and cleanup in network-notes.md. Python programming is optional; the prewritten apparatus stays unchanged. Follow the complete guide on the core card and in README.md. This is an isolated IPv4 lab, with no claim of public Internet reachability.";
		return {
			...item,
			projectLink,

			solutionLink: networkPinnedCourseUrl(item.solutionLink ?? ""),
			ideImport: true,
			preserveInstructions: true,

			content:
				notebook && topology
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
