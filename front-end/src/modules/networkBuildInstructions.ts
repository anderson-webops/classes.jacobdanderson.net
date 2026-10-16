import type { PythonIdeFile } from "@/modules/pythonIde";
import { networkCourseResource } from "./networkProjectResources";

export function networkBuildInstructions(files: PythonIdeFile[], url: string) {
	const selected = networkCourseResource(url);
	if (!selected) return null;
	const { role, definition } = selected;
	const topology = definition.pack === "NS6-Router-NAT-Topology-Lab";
	const namingCases: Record<string, string> = {
		"NS-06-unit-2-addresses-and-naming":
			"Repeat with python3 main.py --lookup 127.0.0.1, then with --network 192.0.2.65/26. Compare system name lookup, the actual IPv4 endpoint and the separate prefix calculation.",
		"NS-05-unit-2-addresses-and-naming-supplemental-2":
			"Compare the supplied /31 with python3 main.py --network 192.0.2.1/32 --candidates 192.0.2.0,192.0.2.1,192.0.2.2. Explain membership and the point-to-point /31 exception without claiming that an interface was reconfigured.",
		"NS-06-unit-2-addresses-and-naming-supplemental-3":
			"Repeat with python3 main.py --lookup 127.0.0.1. Compare resolver families, actual listener ownership and the IPv6 probe. The IPv6 documentation-prefix table is a separate calculation, not proof of DNS or internet reachability."
	};
	const lines = topology
		? [
				"Save and download the ZIP. Extract it in an owned disposable Linux VM with root access and the tools listed in README.md. This kernel lab requires network and mount namespaces.",
				"The browser edits and saves the source and notebook. Run the real routing and firewall experiments in that external VM; the browser cannot perform these Linux kernel operations."
			]
		: [
				"Save and download the ZIP. Extract it in an owned Linux lab or WSL environment with an ordinary account, Python3.10+ and the tools listed in README.md.",
				"The browser edits and saves the source and notebook. Run the real socket experiments in that external Linux terminal; browser Python does not provide these Linux observations."
			];
	if (
		!files.some(file => file.name === "README.md") ||
		definition.roleFiles.some(
			name => !files.some(file => file.name === `${role}/${name}`)
		)
	) {
		return [
			...lines,
			"The selected lab is incomplete. Restore all required role files and README.md before following the guide."
		];
	}
	if (topology) {
		return [
			...lines,
			`Read README.md, then cd ${role}. For Unit7, complete the first three cases in lab-rules.sh and run sudo bash create_nat_lab.sh --output routing-observations.json.`,
			"Unit12 continues the same saved Unit7 attempt. Complete the fourth filter case and run sudo bash create_nat_lab.sh --exposure-policy --output exposure-observations.json. The policy pass requires actual rule counters, mapped success, fresh direct refusal, and direct restoration after removing only the filter.",
			"Keep predictions, the actual reports, original and translated endpoints, rule counters and cleanup evidence in network-notes.md. Both units' notebook cards reopen this same attempt; the reference remains separate.",
			"Python programming is optional. Keep the prewritten lab_runtime.py apparatus unchanged; the shell cases and actual command observations are required for their respective units."
		];
	}
	return [
		...lines,
		`Read README.md, then cd ${role}. Confirm uname -s, id and python3 --version in that terminal. Run python3 main.py with the supplied instrumentation unchanged.`,
		"Complete network-notes.md with predictions, actual commands, endpoint/process identities, changed cases and cleanup. Its operations-notebook card continues this same saved attempt.",

		namingCases[definition.pack] ??
			(definition.pack === "NS-04-ns0-setup-and-tooling"
				? "Repeat with python3 main.py --message 'Second local observation'. Compare the kernel route, actual listener PID and local HTTP response. Loopback success does not establish remote connectivity or DNS correctness."
				: "Compare the normal transport run with python3 main.py --udp-buffer 2 and python3 main.py --without-newline. Distinguish TCP EOF, application framing, empty UDP datagrams and truncation using the actual recorded bytes."),
		"Python programming is optional supplemental practice: complete only analyze(evidence) in main.py if choosing that extension. The notebook and command observations remain the required work."
	];
}
