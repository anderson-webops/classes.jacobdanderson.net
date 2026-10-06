import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
// This workflow is run by node --test in CI, outside Vitest.
// eslint-disable-next-line test/no-import-node-test -- Uses the native CI test runner.
import { test as nodeTest } from "node:test";
import { fileURLToPath } from "node:url";
import { strFromU8, unzipSync } from "fflate";
import puppeteer from "puppeteer";
import { preview } from "vite";
import { cppClassesLessonBriefs } from "../front-end/src/stores/courses/cppClassesProjectBriefs.ts";
import { cppCollectionsLessonBrief } from "../front-end/src/stores/courses/cppCollectionsProjectBriefs.ts";
import { cppFoundationLessonBriefs } from "../front-end/src/stores/courses/cppFoundationProjectBriefs.ts";
import { cppFunctionsLessonBriefs } from "../front-end/src/stores/courses/cppFunctionsProjectBriefs.ts";
import { cppGridLessonBrief } from "../front-end/src/stores/courses/cppGridProjectBriefs.ts";
import { cppLifetimeProjectBriefs } from "../front-end/src/stores/courses/cppLifetimeProjectBriefs.ts";
import { cppParameterLessonBriefs } from "../front-end/src/stores/courses/cppParameterProjectBriefs.ts";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const bridgeRepository = "instruction-material/Python-to-Java-and-CPP-Bridge";
const bridgeRevision = "003c7cc321dd758360c27575b8a9f2a4c7b710b7";
const packs = {
	"PTJ1-Syntax-Translation-Warmup/starter/cpp": {
		"README.md": "8db88854ab5e1398be2afdf0468ef3644dfcf4d75c358bc13d3cb42bd9140646",
		"main.cpp": "db173a70ee15dabd066f55ec84b616660d2ab31eed5b4c1f3853edec48a87236"
	},
	"PTJ2-Function-Port-Pack/starter/cpp": {
		"README.md": "1d62cc9a4794e982a9afea7d62764712b2350e80c929267062dc6664752a0ddd",
		"main.cpp": "4958789b9ecdfdbb938ba69c722b888f6148e31997ff129e56c30addec79d1be"
	},
	"PTJ3-Text-and-Collection-Port-Lab/starter/cpp": {
		"README.md": "aeae7419a5380244a8559bd193915fab9e3eb5791066989500ce45ca1f02a527",
		"main.cpp": "aa82a9622a96cf4f385cf87156dd2a6603f5932b604122dd0d562540b805b5e2"
	},
	"PTJ4-Shared-Class-Port/starter/cpp": {
		"BankAccount.cpp": "4fdde771189e242459fba39cb31573c7c1b6c8a1dba00ec844242d6a65c53961",
		"BankAccount.h": "44ac4c908f21270c772aa5a1e493804641a92ce09defcda0eb8bce6d264e5f24",
		"README.md": "e5fd5ca606d8ea4c1c2531a5bc95acd87f21c84affd7542d8ddfdbc7a49af283",
		"main.cpp": "7f895dd8334278cef6c9e2f180988489b1d53654bc62d8531d30cdb1f451dec9"
	},
	"PTJ6-Python-to-CPP-Console-Port/starter": {
		"README.md": "682bd108401494aef8d95aa039a636ce2ca2b6575ded547a09ea08a403e8c0e4",
		"main.cpp": "75f01a58894d2ce1d2c0aa506ac7ac6e54b827fb9da7fcc267ab6eacfc41954e"
	},
	"PTJ7-Task-Tracker-Capstone/starter/cpp": {
		"README.md": "0fa5f851dc2cfe196b2cb70d3a1699bdb879dfecf2087c96a9ba240c69a1903a",
		"TaskTracker.cpp": "0bb89908e62373f7683b29d2f131fac24289ed9430d55472b4cf8b7ff53b463a",
		"TaskTracker.h": "403e0ed70b326bfa53cd64a330098d5c9846e36ada40809317b7e80a9775d948",
		"main.cpp": "e8df394338847cd39b501c2e4649e0317510fd644114a97afc62a14cb14b4908"
	},
	"PTJ7-Task-Tracker-Capstone/starter/java": {
		"Main.java": "221782daae0726b25370e84d9742c812b3e68c08229bd60bd28bffbe1c72d234",
		"README.md": "0fa5f851dc2cfe196b2cb70d3a1699bdb879dfecf2087c96a9ba240c69a1903a",
		"TaskTracker.java": "dcd5c4b443934b1706ff474a92e2343f1cb2ee1a9bc5b626c6259ea46740186c"
	}
};
const moduleAnchors = {
	PTJ1: "ptj0-positioning-and-workflow-translation",
	PTJ2: "ptj1-functions-parameters-and-return-types",
	PTJ3: "ptj2-collections-strings-and-indexing",
	PTJ4: "ptj3-classes-and-objects-across-languages",
	PTJ6: "ptj5-c-specific-adaptation",
	PTJ7: "language-bridge-lab-17-bridge-capstone-port-studio"
};
const foundationRepository = "instruction-material/CPP-Level-1";
const foundationRevision = "770aa14c51891d73e4f5c960fa839f8bdf15b964";
const foundationPacks = {
	"CPPF1-Mad-Libs/starter": {
		"README.md": "3900507cdc02ee6c11d9f0a28c05773fcefac50840013bd5e8487dfa72e55cdc",
		"main.cpp": "7250ce9927a2e0104053e3fb07c9ad55b874ca6245710ffda1de3a2a9b11ac3d"
	},
	"CPPF1-Chat-Bot/starter": {
		"README.md": "6c0e55ca0be21cadddd0dcc3507679b8bd374c24ed5499b734e159526e2760f1",
		"main.cpp": "dc3ce8d94ca43162c16ec701fffcf7765f540c5614caef68ada83d2e1cf00b26"
	},
	"CPPF2-Number-Games/starter": {
		"README.md": "883c62cea1be2869687cb3dc434762bebc776fb730e6b4c31e9f40aeca9f7bb6",
		"main.cpp": "954aeafe69ae219e17e754f9b9d159a65c5089610bc0a8ff7277b4304f54ff8a"
	},
	"CPPF2-Rock-Paper-Scissors/starter": {
		"README.md": "e4c3836f0f5bfcd65e9ecd473c5fed1c18452cdfb158971b1a914009b34f8eb1",
		"main.cpp": "a1297dae1bade9fc05b267a06882d542547c576cc5466401a903fddc9c426660"
	},
	"CPPF2-Fizz-Buzz/starter": {
		"README.md": "5f6f8adac36bba4b54bb5a46c576e2fed6153a1923e3061ccaa44e80637bd889",
		"main.cpp": "d60a0b38e00abb97d67ccb5abad025a721adb755d784463f81001b0b95a0ac15"
	},
	"CPPF3-Function-Practice/starter": {
		"README.md": "fe366dd7d9f25c3b0a25db91a984630250182430dc535600f9d2eae0e037196a",
		"main.cpp": "4ab7b45999b398a104bcd7e1b8f253333199a1b09fb1e35821bb909b2f713a83"
	},
	"CPPF3-Probability-Functions/starter": {
		"README.md": "fed5d96d649a3b114fd5f2dba4617145a7738762d28d8e4c1db384d878d433fa",
		"main.cpp": "83dd68efcf0876ae27cb78e92c552c71217e4245870d3fcb65e1b0152c760895"
	},
	"CPPF3-Number-Guesser/starter": {
		"README.md": "f8388163560122cb9d5b49ef3be9736277ced261d6139c388fd5c14c5383a989",
		"main.cpp": "bf6ebeaf8a9710ea947cca43e47dd9338bc28d8cc2263498b5d0e3a0650840df"
	},
	"CPPF4-Person-Class/starter": {
		"README.md": "4c2cb8f0e01b53333fe6e09b605fbcab0c0e841efe2559696834db49ea891683",
		"person.cpp": "199040c957425e93357dbc9d5e07b7fd788e0cd80efd4dc48c7a91938b7d2c8c",
		"person.h": "13e3d0df58a5ba1e4efdb4bd2fcb306aec53c4e86d706bea50ae50ec8a30f828",
		"main.cpp": "20f07495555bbe3383b4cc89dbb57d8b557b1b2c8842a979d24547bb993f1eaf"
	},
	"CPPF4-Cat-Class/starter": {
		"README.md": "bfefc3c00563b98047a539935b1fedd6ef9b45b2f4676b3de06dad7db4702122",
		"cat.cpp": "4b8df11d98069633ae1a865702f36c432f2ba8d8bf6af92801febbbfc24b1488",
		"cat.h": "86dfa633c5271c361505b62ae1427bf606c468d10e73c49c286e37b799ecca30",
		"main.cpp": "725baaecae0c9596c1fa990da46e67f5607438f49075b7183fee8a2ef37e242c"
	},
	"CPPF5-Vector-Practice/starter": {
		"README.md": "cbcc15f4f4c78dc1e3c5069e6c5bbc29356cb15ec22bdd798e5176ce0644701c",
		"main.cpp": "1ae8e5cd4ecc4455fb6910e7c30e65310e2e206d9fd7a06744e907e039b9064e"
	},
	"CPPF5-Bank-Accounts/starter": {
		"README.md": "15384b8e55d92b59a53ac205fd8e8e28075bbe3ee44d5beaf61a96b52157e3da",
		"main.cpp": "0617bd4e087864a5b16f62e0cce45ad93e79ca44a083405442c7f3ef69c7b54f"
	},
	"CPPF6-Parameter-Passing/starter": {
		"README.md": "0fcfff88dc9c65375169619d382498161afac8c2907956acda948b69a8f83349",
		"main.cpp": "485f37489f54aacc4f5e448a933128235a8b0414cb112041aa0c41e025fb87b1"
	},
	"CPPF6-Defanging-a-Website-URL/starter": {
		"README.md": "9f6b8b6148a1d80a61d6eeeb2e30ccb1ad54a35657b8aa46152956615609599b",
		"main.cpp": "a48599ff2da597e0beb19637ccaa8dcf575b2020c3ec9451d8b91f1c9c10262b"
	},
	"CPPF6-Chaos-Monkeys/starter": {
		"README.md": "1fa069f0f3b115c248888ac629c49b49ccb7a32f065b62d79f29a43a2e0f2209",
		"main.cpp": "963a91ebc9bff4c48eae15d8d25d270fb2b9326be7c61f7a1663ee53cb44e644"
	},
	"CPPF7-Matrix-Addition/starter": {
		"README.md": "3abb3917457f108580a68f41a67f016058ab6c049e29add2a24d1d1ea01a4219",
		"main.cpp": "7e1e9a17723f0ba92aeb5c94f03700b3af0c76fad9cdd3573bbf28b8db0125ae"
	},
	"CPPF7-Grid-Statistics/starter": {
		"README.md": "503bec05a2fd03d2ea84263f710a2cc8f12ab4ed9eceb835fbb95325692eada0",
		"main.cpp": "80a756801d16a1af40219370c6c58079da504f4871f5924a4a6224eee7f9b432"
	},
	"CPPF8-Profile-Posts/starter": {
		"README.md": "5a31883270ae2198c9ffe697356bbfc20c6ada5f94fc95ce7ad7efec3d8bd9dc",
		"main.cpp": "4e3b263f54579d013f16cac9189ebfc27450ddc6dd621c6831ecd5fe4c2f4924",
		"profile.cpp": "5a2082cdf535f2c112da6b81c196ae9b62554e390ed800506de0dfde56e68d73",
		"profile.h": "5f1522f06e888c294004683421ccf65e5f26cd0a40814c39eb51d2804ed09289"
	},
	"CPPF8-State-Machine-Profile-Posts/starter": {
		"README.md": "d05edf973f1303f72280e6a84283bea860930b6919a31e0108b3f6c27ed337a6",
		"main.cpp": "d57f868c54ad45656e8fb994db9f10b6f593be6cc55ad039a0478c1fc51fa016"
	}
};

const memoryRepository = "instruction-material/CPP-Level-2";
const memoryRevision = "ddbc9448351ca99de292c935c3d0024e616e5a5c";
const memoryPacks = {
	"CPPM0-Lifetime-Tracing-Warm-Up/starter": {
		"Makefile": "cb0a3b63d29a9eea2932f6d493e8449345c346b525bf6e8d52ec9431139cd47b",
		"README.md": "65181bbfbf7dbc196ad6b46a78c001775252715d83487a0c89f15dc43a8a9b61",
		"main.cpp": "08ba2dd0f7fca5c235c1426865ef4ccdcbbceb685d4e37d3fc62436d8f7c155e"
	},
	"CPPM0-Ownership-Boundary-Debugging/starter": {
		"Makefile": "cb0a3b63d29a9eea2932f6d493e8449345c346b525bf6e8d52ec9431139cd47b",
		"README.md": "36bce2e1918a9340b5aa70c872a18c4882265267265ab1c5bcfae3c84f479932",
		"main.cpp": "a197fdf56daf2ae3f0785b17892c091b23642663ad031fb5344abd8a24581913"
	},
	"CPPM1-Pointers-Starter": {
		"Makefile": "fc3647af6f34f21cf12305818388b2cef6903ee056f29c1558082420fd109c77",
		"main.cpp": "2e2cc7370dda4254f04972e0de1bdd649a57cce96bf5ca6988ef85a037f0902b"
	}
};

const pointerRevision = "52584eea3fca4bad6631df78536be06a22738ca7";
const pointerPacks = {
	"CPPM1-Pointer-Error-Examples-Starter": {
		"Makefile": "17ae8add523b31bee84be65585b722f5ed7fd51643336b3cbe6dbe9b8a7f7542",
		"README.md": "17dccff7bc8f705e70fae3f473fa5f43c50c3496e25f593d1403d9d30d99bddf",
		"main.cpp": "f684bd05e3d6e8a626dfbc7a50100457407d68557df052a0740772a61a3a1650"
	},
	"CPPM1-Pointer-Practice-Starter": {
		"Makefile": "17ae8add523b31bee84be65585b722f5ed7fd51643336b3cbe6dbe9b8a7f7542",
		"README.md": "f47e146f47d8cee7df6b67b6a4a3f528d650bba34b5d4745876b529603171c47",
		"main.cpp": "b2fb21efea4cad7dee358ca98dcebcff3d25c78cd0e12c7908a3f60d55f90bde"
	}
};
const pointerReferences = {
	"CPPM1-Pointer-Error-Examples": {
		"main.cpp": "dd40faccd63b278d69acb80b02fe72ffa12f949ac5a885f083338d5ab009dc26"
	},
	"CPPM1-Pointer-Practice": {
		"main.cpp": "5a40f81d66d08eef5393ff8bc737ff332cf56e186df842a975fe0cc0635cea57"
	}
};
const pointerReferenceCode = {};

const fixtures = [
	...Object.entries(pointerPacks).map(([folder, hashes]) => ({
		repository: memoryRepository,
		revision: pointerRevision,
		courseId: "cpp-level-2",
		standard: 20,
		folder,
		hashes,
		anchor: "cppm1-pointers-and-addresses"
	})),
	...Object.entries(memoryPacks).map(([folder, hashes]) => ({
		repository: memoryRepository,
		revision: memoryRevision,
		courseId: "cpp-level-2",
		standard: 20,
		folder,
		hashes,
		anchor: folder.startsWith("CPPM0")
			? "cppm0-lifetime-references-and-ownership-framing"
			: "cppm1-pointers-and-addresses"
	})),
	...Object.entries(packs).map(([folder, hashes]) => ({
		repository: bridgeRepository,
		revision: bridgeRevision,
		courseId: "python-to-java-and-cpp-bridge",
		standard: 17,
		folder,
		hashes,
		anchor: moduleAnchors[folder.slice(0, 4)]
	})),
	...Object.entries(foundationPacks).map(([folder, hashes]) => ({
		repository: foundationRepository,
		revision: foundationRevision,
		courseId: "c-level-1",
		standard: 20,
		folder,
		hashes,
		anchor: folder.startsWith("CPPF1")
			? "cppf1-variables-types-strings-and-input-output"
			: folder.startsWith("CPPF2")
				? "cppf2-loops-and-conditionals"
				: folder.startsWith("CPPF3")
					? "cppf3-functions"
					: folder.startsWith("CPPF4")
						? "cppf4-classes-and-objects"
						: folder.startsWith("CPPF5")
							? "cppf5-vectors-and-collection-patterns"
							: folder.startsWith("CPPF6")
								? "cppf6-structs-and-parameter-passing"
								: folder.startsWith("CPPF7")
									? "cppf7-grids-and-2d-vectors"
									: "cppf8-master-project-profile-posts"
	}))
];
const taskId = process.env.CLASSES_FAMILY_TASK_ID ?? "cpp-course-import-browser-ci";
function record(event, fields = {}) {
	return console.log(JSON.stringify({
		event,
		parentTaskId: taskId,
		cwd: root,
		parentPid: process.pid,
		time: new Date().toISOString(),
		...fields
	}));
}

async function readStarter(repository, revision, folder, hashes) {
	const files = {};
	for (const [name, digest] of Object.entries(hashes)) {
		const response = await fetch(`https://raw.githubusercontent.com/${repository}/${revision}/${folder}/${name}`, { signal: AbortSignal.timeout(30000) });
		assert.equal(response.status, 200);
		const bytes = new Uint8Array(await response.arrayBuffer());
		assert.equal(createHash("sha256").update(bytes).digest("hex"), digest);
		files[name] = new TextDecoder().decode(bytes);
	}
	return files;
}

async function runNative(command, args, directory, input = "") {
	return new Promise((resolve, reject) => {
		const child = spawn(command, args, { cwd: directory, detached: true, stdio: ["pipe", "pipe", "pipe"] });
		record("start", { command: [command, ...args], cwd: directory, pid: child.pid, timeoutMs: 30000 });
		let stdout = "";
		let stderr = "";
		child.stdout.on("data", (data) => {
			stdout += data;
		});
		child.stderr.on("data", (data) => {
			stderr += data;
		});
		// A failed spawn can close stdin before its buffer drains.
		child.stdin.on("error", () => {});
		child.stdin.end(input);
		const timer = setTimeout(() => {
			try {
				process.kill(-child.pid, "SIGKILL");
			}
			catch {}
			record("child-process-group-cleanup", { pid: child.pid, reason: "timeout" });
		}, 30000);
		child.once("error", (error) => {
			clearTimeout(timer);
			record("end", { pid: child.pid, exitCode: 1 });
			reject(error);
		});
		child.once("close", (code) => {
			clearTimeout(timer);
			record("end", { pid: child.pid, exitCode: code });
			resolve({ code, stdout, stderr });
		});
	});
}

async function compileExport(directory, names, mode, standard = 17, warningsAsErrors = false) {
	const command = mode === "java" ? process.env.JAVAC ?? "javac" : "c++";
	// Unfinished learner stubs may have unused parameters. Use the displayed
	// native build flags for exports; complete lesson examples stay warning-clean.
	const args = mode === "java" ? ["-Xlint:all", ...names.filter(name => name.endsWith(".java"))] : [`-std=c++${standard}`, "-Wall", "-Wextra", "-Wpedantic", ...(warningsAsErrors ? ["-Werror"] : []), "-I.", ...names.filter(name => /\.(?:cc|cpp|cxx)$/.test(name)), "-o", "project"];
	const result = await runNative(command, args, directory);
	assert.equal(result.code, 0, `Native compilation failed: ${result.stderr}`);
}

function completeMemoryAttempt(folder, source) {
	if (Object.hasOwn(pointerPacks, folder)) {
		const reference = pointerReferenceCode[folder];
		const names = folder.includes("Error") ? ["repairedExamples"] : ["question1", "question2", "question3"];
		for (const name of names) {
			const pattern = new RegExp(`void ${name}\\([^\\n]*\\) \\{[\\s\\S]*?\\n}`, "g");
			const implementation = reference.match(pattern)?.[0];
			assert.ok(implementation, `Reference ${name} is available`);
			assert.ok(source.match(pattern), `Learner ${name} is available`);
			source = source.replace(pattern, () => implementation);
		}
		return source;
	}

	if (folder.startsWith("CPPM0-Lifetime")) {
		const notes = [
			"The copy changes to 80 while the caller remains 70.",
			"The reference changes the caller to 80; the const observer reads 80.",
			"The returned bonus is 100; named elision permits shared identity.",
			"Disabling optional named elision keeps the returned value valid."
		];
		return source.replace(/\/\/ TODO ([1-4]):[^\n]*/g, (_, number) => `// Prediction ${number}: ${notes[Number(number) - 1]}`);
	}
	if (folder.startsWith("CPPM0-Ownership")) {
		const placeholder = "// TODO: Find the earliest maximum and return that vector element.\n  throw std::logic_error(\"Implement highestSeverity before running selection\");";
		assert.ok(source.includes(placeholder));
		return source.replace(placeholder, "std::size_t selected = 0;\n  for (std::size_t index = 1; index < entries.size(); ++index) {\n    if (entries[index].severity > entries[selected].severity) selected = index;\n  }\n  return entries[selected];")
			.replace(/\/\/ TODO 1:[^\n]*/, "// Prediction 1: The copy changes to 7 while the vector element stays 2.")
			.replace(/\/\/ TODO 2:[^\n]*/, "// Prediction 2: Reference mutation changes the first element to 7.")
			.replace(/\/\/ TODO 3:[^\n]*/, "// Prediction 3: The vector owns the borrow; reallocation and destruction invalidate it.");
	}
	if (folder === "CPPM1-Pointers-Starter") {
		return source.replace("int main() {", `int main() {
    int val1 = 5;
    int* p1 = &val1;
    std::cout << *p1 << '\\n' << p1 << '\\n';
    *p1 = 10;
    std::cout << *p1 << '\\n' << val1 << '\\n';
    int* p2 = p1;
    std::cout << (p1 == p2) << '\\n';
    *p2 = 20;
    std::cout << *p1 << '\\n' << val1 << '\\n';
    int* absent = nullptr;
    if (absent == nullptr) std::cout << "absent, no dereference\\n";
    // Reading an uninitialized pointer is undefined behavior in C++20.
    // Null has no object to dereference; a crash is not guaranteed.
    // *p1 = &val1 mismatches int and int*; keep it disabled.
    // *p1 = val1 assigns an int to an int target and is valid here.
    // p1 = val1 mismatches int* and int; keep it disabled.
`);
	}
	return source;
}

async function verifyMemoryExport(directory, folder) {
	const result = await runNative(join(directory, "project"), [], directory);
	assert.equal(result.code, 0);
	assert.equal(result.stderr, "");
	if (Object.hasOwn(pointerPacks, folder)) {
		await verifyPointerExport(directory, folder, result);
	}
	else if (folder.startsWith("CPPM0-Lifetime")) {
		const traces = [...result.stdout.matchAll(/^(.+?) -> (.+?): (\d+) at (.+)$/gm)];
		assert.deepEqual(traces.map(match => [match[1], match[2], Number(match[3])]), [
			["Original card", "Taylor", 70],
			["Inside updateCopy", "Taylor", 80],
			["After updateCopy", "Taylor", 70],
			["Inside updateReference", "Taylor", 80],
			["After updateReference", "Taylor", 80],
			["Inside observeConstReference", "Taylor", 80],
			["Inside makeBonusCard", "Morgan", 100],
			["Returned bonus card", "Morgan", 100]
		]);
		assert.notEqual(traces[0][4], traces[1][4]);
		for (const index of [2, 3, 4, 5]) assert.equal(traces[index][4], traces[0][4]);
	}
	else if (folder.startsWith("CPPM0-Ownership")) {
		assert.match(result.stdout, /Highest severity entry -> failed validation \(severity 8\)/);
		assert.doesNotMatch(result.stdout, /Learner task:/);
		// Test the implementation actually edited and exported by the browser.
		await writeFile(join(directory, "selection-check.cpp"), `#define main exportedDriver
#include "main.cpp"
#undef main
#include <cassert>
#include <climits>
int main() {
    std::vector<LogEntry> entries{{"a", -9}, {"b", -2}, {"c", -2}};
    assert(&highestSeverity(entries) == &entries[1]);
    assert(entries[0].severity == -9 && entries[1].severity == -2 && entries[2].severity == -2);
    std::vector<LogEntry> single{{"only", INT_MIN}};
    assert(&highestSeverity(single) == &single[0]);
    entries[0].severity = INT_MAX;
    assert(&highestSeverity(entries) == &entries[0]);
    try { highestSeverity({}); return 1; }
    catch (const std::invalid_argument&) {}
}
`);
		await compileExport(directory, ["selection-check.cpp"], "cpp", 20, true);
		assert.deepEqual(await runNative(join(directory, "project"), [], directory), { code: 0, stdout: "", stderr: "" });
	}
	else {
		assert.match(result.stdout, /^5\n[^\n]+\n10\n10\n1\n20\n20\nabsent, no dereference\n$/);
	}
}

async function verifyPointerExport(directory, folder, result) {
	assert.doesNotMatch(result.stdout, /Learner task:/);
	const build = await runNative("make", ["main", "main-debug"], directory);
	assert.equal(build.code, 0, build.stderr);
	const sanitized = await runNative(join(directory, "main-debug"), [], directory);
	assert.equal(sanitized.code, 0, sanitized.stderr);
	assert.equal(sanitized.stderr, "");
	assert.equal(sanitized.stdout, result.stdout);
	if (folder.includes("Error")) {
		assert.equal(result.stdout, "Live observer value: 20\nAbsent observer: no dereference\nTwo pointer aliases: 1\nInitialized pointer value: 10\nAssigned target value: 5\nInitialized target value: 7\nMatched target type: potatoes\n");
		for (const mode of ["--null", "--dangling"]) {
			const ordinary = await runNative(join(directory, "main"), [mode], directory);
			assert.equal(ordinary.code, 2);
			assert.match(ordinary.stderr, /require an AddressSanitizer build/);
			const diagnostic = await runNative(join(directory, "main-debug"), [mode], directory);
			assert.notEqual(diagnostic.code, 0);
			assert.match(diagnostic.stderr, mode === "--null" ? /runtime error: store to null pointer/ : /heap-use-after-free/);
		}
	}
	else {
		const rows = [...result.stdout.matchAll(/^p([12]) is: (\d+)$/gm)];
		assert.deepEqual(rows.filter(row => row[1] === "1").map(row => Number(row[2])), Array.from({ length: 10 }, (_, index) => index));
		assert.deepEqual(rows.filter(row => row[1] === "2").map(row => Number(row[2])), Array.from({ length: 10 }, (_, index) => index * 2));
		await writeFile(join(directory, "practice-check.cpp"), `#define main exportedDriver
#include "main.cpp"
#undef main
#include <cassert>
#include <functional>
#include <sstream>
#include <utility>
std::string capture(const std::function<void()>& call) {
    std::ostringstream output;
    auto* previous = std::cout.rdbuf(output.rdbuf());
    call();
    std::cout.rdbuf(previous);
    return output.str();
}
int main() {
    for (const auto& text : std::vector<std::string>{"", "x", "ab", "abc", "abcd", "JuniLearning"}) {
        const auto output = capture([&] { question2(text); });
        if (text.empty()) assert(output == "Question 2 needs a non-empty string.\\n");
        else {
            assert(output.find("Number of times p1 pointer increased: " + std::to_string(text.size()/2)) != std::string::npos);
            assert(output.find("Number of times p2 pointer decreased: " + std::to_string((text.size()-1)/2)) != std::string::npos);
        }
    }
    std::vector<std::pair<std::string, std::size_t>> cases{
        {"1hello", 1}, {"3hello", 3}, {"12e4woah", 7}, {"1a2bc", 3},
        {"0a1b", 1}, {"4abc1", 4}, {"4abc", 0}, {"9a1bc", 0},
        {"abc", 0}, {"0", 0}, {"9", 0}, {"000", 0}, {"2abc1", 3}, {"2a3b", 2}
    };
    cases.push_back({std::string("1") + static_cast<char>(0x80) + "2bc", 3});
    assert(capture([] { question3(""); }) == "Question 3 needs a non-empty string.\\n");
    for (const auto& [text, offset] : cases) {
        const auto before = text;
        const auto output = capture([&] { question3(text); });
        assert(text == before);
        const auto summary = "The final location of the end pointer was pointing to: " + std::string(1, text[offset]) + ", after advancing " + std::to_string(offset) + " characters.";
        const auto first = output.find(summary);
        assert(first != std::string::npos);
        assert(output.find(summary, first + summary.size()) != std::string::npos);
    }
}
`);
		const compile = await runNative("c++", ["-std=c++20", "-Wall", "-Wextra", "-Wpedantic", "-Werror", "-g", "-O0", "-fsanitize=address,undefined", "-fno-sanitize-recover=all", "practice-check.cpp", "-o", "practice-check"], directory);
		assert.equal(compile.code, 0, compile.stderr);
		const checks = await runNative(join(directory, "practice-check"), [], directory);
		assert.deepEqual(checks, { code: 0, stdout: "", stderr: "" });
	}
	const clean = await runNative("make", ["clean"], directory);
	assert.equal(clean.code, 0, clean.stderr);
}

nodeTest("the lifetime, pointer and diagnostics lessons compile with independent output and diagnosed failure", { timeout: 120000 }, async () => {
	const temporary = await mkdtemp(join(tmpdir(), "cpp-memory-lesson-contracts-"));
	try {
		for (const [name, expected] of [
			["references", "Copy: 11\nAfter copy: 7\nObserved: 11\nReturned: 12\n"],
			["pointers", "Value: 14\nRead through first: 14\nSame address: 1\nNo object to read\n"],
			["diagnostics", "42\n"]
		]) {
			const programs = [...cppLifetimeProjectBriefs[name].matchAll(/```cpp\n([\s\S]*?)\n```/g)];
			assert.equal(programs.length, 1);
			const code = `${programs[0][1]}\n`;
			await writeFile(join(temporary, "main.cpp"), code);
			await compileExport(temporary, ["main.cpp"], "cpp", 20, true);
			assert.deepEqual(await runNative(join(temporary, "project"), [], temporary), { code: 0, stdout: expected, stderr: "" });
			if (name !== "diagnostics") continue;
			const flags = ["-std=c++20", "-Wall", "-Wextra", "-Wpedantic", "-Werror", "-g", "-fsanitize=address,undefined", "-fno-omit-frame-pointer", "main.cpp", "-o", "diagnostic"];
			assert.equal((await runNative("c++", flags, temporary)).code, 0);
			assert.deepEqual(await runNative(join(temporary, "diagnostic"), [], temporary), { code: 0, stdout: "42\n", stderr: "" });
			const invalid = await runNative(join(temporary, "diagnostic"), ["--invalid"], temporary);
			assert.notEqual(invalid.code, 0);
			assert.match(invalid.stderr, /AddressSanitizer: heap-use-after-free/);
			const corrected = code.replace(
				"owner.reset();\n        std::cout << *observer << '\\n'; // Isolated diagnostic failure.",
				"std::cout << *observer << '\\n';\n        owner.reset();\n        observer = nullptr;"
			);
			assert.notEqual(corrected, code);
			await writeFile(join(temporary, "main.cpp"), corrected);
			await compileExport(temporary, ["main.cpp"], "cpp", 20, true);
			assert.deepEqual(await runNative(join(temporary, "project"), ["--invalid"], temporary), { code: 0, stdout: "42\n", stderr: "" });
			assert.equal((await runNative("c++", flags, temporary)).code, 0);
			assert.deepEqual(await runNative(join(temporary, "diagnostic"), ["--invalid"], temporary), { code: 0, stdout: "42\n", stderr: "" });
		}
	}
	finally {
		await rm(temporary, { recursive: true, force: true });
		record("cleanup", { command: "cpp-memory-lesson-contracts", pid: process.pid });
	}
});

nodeTest("the four foundation lesson programs compile and match independent console fixtures", { timeout: 120000 }, async () => {
	const temporary = await mkdtemp(join(tmpdir(), "cpp-lesson-contracts-"));
	const examples = {
		setup: [{ input: "", code: 0, stdout: "Hello, C++!\n", stderr: "" }],
		values: [{ input: "", code: 0, stdout: "14\n9.6\n0\nA\nc\n3\ncat naps\n3\n1\n3.33333\n", stderr: "" }],
		input: [
			{ input: "3\ncats like naps\n", code: 0, stdout: "Count: Sentence: \n3: cats like naps\n", stderr: "" },
			{ input: "3x\ncats like naps\n", code: 0, stdout: "Count: Sentence: \n3: cats like naps\n", stderr: "" },
			{ input: "", code: 1, stdout: "Count: ", stderr: "Invalid count.\n" },
			{ input: "three\ncats\n", code: 1, stdout: "Count: ", stderr: "Invalid count.\n" },
			{ input: "3\n", code: 1, stdout: "Count: Sentence: ", stderr: "Missing sentence.\n" },
			{ input: "3\n\n", code: 1, stdout: "Count: Sentence: ", stderr: "Missing sentence.\n" }
		],
		branches: [{ input: "", code: 0, stdout: "high\n1\n2\n3\n1\n2\n3\n", stderr: "" }]
	};
	try {
		for (const [name, fixtures] of Object.entries(examples)) {
			const directory = join(temporary, name);
			await mkdir(directory);
			const matches = [...cppFoundationLessonBriefs[name].matchAll(/```cpp\n([\s\S]*?)\n```/g)];
			assert.equal(matches.length, 1, `Expected one standalone ${name} example`);
			await writeFile(join(directory, "main.cpp"), `${matches[0][1]}\n`);
			await compileExport(directory, ["main.cpp"], "cpp", 20, true);
			for (const { input, ...expected } of fixtures) {
				const result = await runNative(join(directory, "project"), [], directory, input);
				assert.deepEqual(result, expected, `${name} fixture ${JSON.stringify(input)}`);
			}
		}
	}
	finally {
		await rm(temporary, { recursive: true, force: true });
		record("cleanup", { command: "cpp-lesson-contracts", pid: process.pid });
	}
});

nodeTest("the function lesson programs compile and satisfy return-value and random-domain fixtures", { timeout: 120000 }, async () => {
	const temporary = await mkdtemp(join(tmpdir(), "cpp-function-lesson-contracts-"));
	try {
		for (const [name, brief] of Object.entries(cppFunctionsLessonBriefs)) {
			const directory = join(temporary, name);
			await mkdir(directory);
			const matches = [...brief.matchAll(/```cpp\n([\s\S]*?)\n```/g)];
			assert.equal(matches.length, 1);
			await writeFile(join(directory, "main.cpp"), `${matches[0][1]}\n`);
			await compileExport(directory, ["main.cpp"], "cpp", 20, true);
			const result = await runNative(join(directory, "project"), [], directory);
			assert.equal(result.code, 0);
			assert.equal(result.stderr, "");
			if (name === "functions") {
				assert.equal(result.stdout, "Sum: 5\nAverage: 2.5\n");
			}
			else {
				const lines = result.stdout.trimEnd().split("\n");
				assert.equal(lines.length, 13);
				assert.match(lines[0], /^Same seed, same engine value: \d+ \d+$/);
				const values = lines[0].replace("Same seed, same engine value: ", "").split(" ");
				assert.equal(values.length, 2);
				assert.equal(values[0], values[1]);
				assert.equal(lines[1], "Five values in the inclusive range 0 through 50:");
				assert.ok(lines.slice(2, 7).every(value => /^\d+$/.test(value) && Number(value) <= 50));
				assert.equal(lines[7], "Five values in the inclusive range 100 through 200:");
				assert.ok(lines.slice(8).every(value => /^\d+$/.test(value) && Number(value) >= 100 && Number(value) <= 200));
				const repeated = await runNative(join(directory, "project"), [], directory);
				assert.deepEqual(repeated, result);
			}
		}
	}
	finally {
		await rm(temporary, { recursive: true, force: true });
		record("cleanup", { command: "cpp-function-lesson-contracts", pid: process.pid });
	}
});

nodeTest("the supplied multi-file class lessons compile and preserve checked state/output", { timeout: 120000 }, async () => {
	const temporary = await mkdtemp(join(tmpdir(), "cpp-class-lesson-contracts-"));
	const expected = {
		point: "This is a point with coordinates x: 0 and y: 0\nThis is a point with coordinates x: -1 and y: 1\nThis is a point with coordinates x: -1 and y: 0\n0\n",
		initializers: "Name: Unknown, Age: 0, Birthday: January 1, 1970, Birth Location: Somewhere over the rainbow, Height: 0' 0\"\nName: Jenny, Age: 21, Birthday: January 1, Birth Location: USA, Height: 5' 0\"\nAlex, 22, 66, January 1, USA\nName: Alex, Age: 22, Birthday: January 1, Birth Location: USA, Height: 5' 6\"\n"
	};
	try {
		for (const name of ["point", "initializers"]) {
			const directory = join(temporary, name);
			await mkdir(directory);
			const files = [...cppClassesLessonBriefs[name].matchAll(/### `([^`]+)`\n\n```cpp\n([\s\S]*?)\n```/g)];
			assert.equal(files.length, 3);
			const stem = name === "point" ? "point" : "person";
			assert.deepEqual(files.map(match => match[1]), [`${stem}.h`, `${stem}.cpp`, "main.cpp"]);
			for (const match of files) await writeFile(join(directory, match[1]), `${match[2]}\n`);
			await compileExport(directory, files.map(match => match[1]), "cpp", 20, true);
			assert.deepEqual(await runNative(join(directory, "project"), [], directory), { code: 0, stdout: expected[name], stderr: "" });
		}
	}
	finally {
		await rm(temporary, { recursive: true, force: true });
		record("cleanup", { command: "cpp-class-lesson-contracts", pid: process.pid });
	}
});

nodeTest("the supplied vector lesson compiles with exact collection output", { timeout: 60000 }, async () => {
	const temporary = await mkdtemp(join(tmpdir(), "cpp-vector-lesson-contracts-"));
	try {
		const programs = [...cppCollectionsLessonBrief.matchAll(/```cpp\n([\s\S]*?)\n```/g)];
		assert.equal(programs.length, 1);
		await writeFile(join(temporary, "main.cpp"), `${programs[0][1]}\n`);
		await compileExport(temporary, ["main.cpp"], "cpp", 20, true);
		assert.deepEqual(await runNative(join(temporary, "project"), [], temporary), {
			code: 0,
			stdout: "Scores stored in a vector:\nIndex 0: 88\nIndex 1: 91\nIndex 2: 76\nIndex 3: 95\n\nThe first score is 88\nThe last score is 95\nThere are 4 total scores.\n\nAfter improving the second score:\n88 95 76 95 \n\nLesson labels:\n- warmup\n- practice\n- challenge\n",
			stderr: ""
		});
	}
	finally {
		await rm(temporary, { recursive: true, force: true });
		record("cleanup", { command: "cpp-vector-lesson-contracts", pid: process.pid });
	}
});

nodeTest("the supplied parameter and struct lessons compile with exact caller and record output", { timeout: 120000 }, async () => {
	const temporary = await mkdtemp(join(tmpdir(), "cpp-parameter-lesson-contracts-"));
	const expected = {
		introduction: "Hello World!\nDemonstrating passing by value:\nval1 is: 10\nval2 is: 20\nDemonstrating passing by reference:\nval1 is: 10\nval2 is now changed to: 40\nval1 is: 10\nval1 is now changed to: 30\nThere should have been no change to val1, and we could not have modified val2 either.\n",
		structs: "First Student:\nRoll Number: 1\nName: Brown\nPhone Number: 123443\n\nSecond Student:\nRoll Number: 2\nName: Sam\nPhone Number: 1234567822\n\nThird Student:\nRoll Number: 3\nName: Addy\nPhone Number: 1234567844\n"
	};
	try {
		for (const [name, brief] of Object.entries(cppParameterLessonBriefs)) {
			const directory = join(temporary, name);
			await mkdir(directory);
			const programs = [...brief.matchAll(/```cpp\n([\s\S]*?)\n```/g)];
			assert.equal(programs.length, 1);
			await writeFile(join(directory, "main.cpp"), `${programs[0][1]}\n`);
			await compileExport(directory, ["main.cpp"], "cpp", 20, true);
			assert.deepEqual(await runNative(join(directory, "project"), [], directory), { code: 0, stdout: expected[name], stderr: "" });
		}
	}
	finally {
		await rm(temporary, { recursive: true, force: true });
		record("cleanup", { command: "cpp-parameter-lesson-contracts", pid: process.pid });
	}
});

nodeTest("the complete grid lesson compiles with exact indexed updates and row totals", { timeout: 60000 }, async () => {
	const temporary = await mkdtemp(join(tmpdir(), "cpp-grid-lesson-contracts-"));
	try {
		const programs = [...cppGridLessonBrief.matchAll(/```cpp\n([\s\S]*?)\n```/g)];
		assert.equal(programs.length, 1);
		await writeFile(join(temporary, "main.cpp"), `${programs[0][1]}\n`);
		await compileExport(temporary, ["main.cpp"], "cpp", 20, true);
		assert.deepEqual(await runNative(join(temporary, "project"), [], temporary), { code: 0, stdout: "Original grid:\n1 2 3 \n4 5 6 \n7 8 9 \n\nUpdated grid:\n1 2 3 \n4 99 6 \n7 8 9 \n10 11 12 \n\nRow totals:\nRow 0: 6\nRow 1: 109\nRow 2: 24\nRow 3: 33\n", stderr: "" });
	}
	finally {
		await rm(temporary, { recursive: true, force: true });
		record("cleanup", { command: "cpp-grid-lesson-contracts", pid: process.pid });
	}
});

nodeTest("published bridge and C++ starters confirm, edit, save, export, reopen and compile natively", { timeout: 360000 }, async () => {
	let browser;
	let server;
	let page;
	let temporary;
	let exitCode = 0;
	const previousDirectory = process.cwd();
	record("start", { command: "cpp-course-import-browser", pid: process.pid, timeoutMs: 360000 });
	try {
		process.chdir(root);
		temporary = await mkdtemp(join(tmpdir(), "cpp-course-workflow-"));
		// CI builds this exact checkout first. Exercise deployable assets without
		// development dependency discovery reloading the page mid-interaction.
		assert.ok(existsSync(join(root, "dist/index.html")), "Build the front end before the browser check");
		server = await preview({ root, preview: { host: "127.0.0.1", port: 0, strictPort: true } });
		const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
		const executablePath = [process.env.PUPPETEER_EXECUTABLE_PATH, await puppeteer.executablePath(), "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find(value => typeof value === "string" && value && existsSync(value));
		assert.ok(executablePath, "Chrome is required");
		browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox"] });
		page = await browser.newPage();
		await page.setViewport({ width: 1280, height: 900 });
		let repository;
		let courseId;
		let folder;
		let files;
		let sourceRequests = 0;
		let remoteWrites = 0;
		let runtimeRequests = 0;
		let courseFixture = true;
		await page.setRequestInterception(true);
		page.on("request", (request) => {
			const url = new URL(request.url());
			const respond = (body, contentType = "application/json") => request.respond({ status: 200, contentType, headers: { "access-control-allow-origin": "*" }, body });
			if (/pyodide|python-runtime-frame|javaIde\.worker/.test(url.href)) runtimeRequests++;
			if (url.hostname === "api.github.com") {
				sourceRequests++;
				assert.equal(url.pathname, `/repos/${repository}/contents/${folder}`);
				assert.equal(url.searchParams.get("ref"), "main");
				void respond(JSON.stringify(Object.keys(files).map(name => ({ type: "file", name, path: `${folder}/${name}`, size: Buffer.byteLength(files[name]), html_url: `https://github.com/${repository}/blob/main/${folder}/${name}`, download_url: `https://raw.githubusercontent.com/${repository}/main/${folder}/${name}` }))));
			}
			else if (url.hostname === "raw.githubusercontent.com") {
				sourceRequests++;
				const name = url.pathname.split("/").at(-1);
				assert.equal(url.pathname, `/${repository}/main/${folder}/${name}`);
				assert.ok(Object.hasOwn(files, name));
				void respond(files[name], "text/plain");
			}
			else if (url.origin !== origin || url.pathname.startsWith("/api/")) {
				if (!["GET", "OPTIONS"].includes(request.method())) remoteWrites++;
				let body = {};
				if (courseFixture && url.pathname === "/api/accounts/me") body = { userID: "bridge-fixture" };
				if (courseFixture && url.pathname === "/api/users/loggedin") body = { currentUser: { _id: "bridge-fixture", name: "Course fixture", email: "course@example.invalid", courseAccess: [courseId], courseProgress: [] } };
				void respond(JSON.stringify(body));
			}
			else {
				void request.continue();
			}
		});
		// Each source choice is reached through the real catalog action, including
		// the two capstone targets. Pin published starter bytes independently.
		for (const fixture of fixtures) {
			({ repository, courseId, folder } = fixture);
			const { revision, standard, hashes, anchor } = fixture;
			const mode = folder.endsWith("/java") ? "java" : "cpp";
			const entryFile = mode === "java" ? "Main.java" : "main.cpp";
			await page.setViewport({ width: folder.startsWith("CPPM0-Lifetime") || folder.startsWith("PTJ1") || folder.startsWith("CPPF1") || folder.startsWith("CPPF3-Number-Guesser") || folder.startsWith("CPPF4-Person-Class/") || folder.startsWith("CPPF5-Bank-Accounts/") || folder.startsWith("CPPF6-Defanging-a-Website-URL/") || folder.startsWith("CPPF7-Matrix-Addition/") || folder.startsWith("CPPF8-Profile-Posts/") || mode === "java" ? 390 : 1280, height: 900 });
			files = await readStarter(repository, revision, folder, hashes);
			if (Object.hasOwn(pointerPacks, folder)) {
				const referenceFolder = folder.replace(/-Starter$/, "");
				pointerReferenceCode[folder] = (await readStarter(repository, revision, referenceFolder, pointerReferences[referenceFolder]))["main.cpp"];
			}
			const expectedFiles = { ...files };
			const before = sourceRequests;
			const beforeRuntime = runtimeRequests;
			courseFixture = true;
			assert.ok(anchor);
			await page.goto(`${origin}/courses#${courseId}-${anchor}`, { waitUntil: "domcontentloaded" });
			const selector = `a[href='https://github.com/${repository}/tree/main/${folder}']:not(.is-ide-starter)`;
			await page.waitForSelector(selector);
			const href = await page.$eval(selector, link => link.closest(".lesson-item").querySelector(".is-ide-starter").getAttribute("href"));
			const params = new URL(href, origin).searchParams;
			assert.equal(params.get("mode"), mode);
			assert.equal(params.get("starterUrl"), `https://github.com/${repository}/tree/main/${folder}`);
			assert.equal(sourceRequests, before, "Catalog choices never fetch source without consent");
			const key = params.get("projectKey");
			assert.ok(key);
			courseFixture = false;
			await page.goto(new URL(href, origin).href, { waitUntil: "domcontentloaded" });
			await page.waitForSelector("[data-testid='ide-route-import-confirm']");
			assert.equal(sourceRequests, before);
			await page.click("[data-testid='ide-route-import-confirm']");
			if (mode === "cpp") await page.waitForSelector("[aria-label='C++ build workflow']");
			await page.waitForFunction(mode => document.querySelector(".cm-content")?.textContent.includes(mode === "java" ? "public class Main" : "#include"), {}, mode);
			assert.equal(sourceRequests, before + 1 + Object.keys(files).length);
			if (folder.startsWith("PTJ4")) {
				const input = "input[aria-label='New project file name']";
				if (!await page.$(input)) await page.click("button[aria-controls='code-ide-file-tools-panel']");
				await page.type(input, "src/workflow.cpp");
				await page.keyboard.press("Enter");
				await page.waitForFunction(() => [...document.querySelectorAll(".file-button")].some(button => button.textContent.includes("src/workflow.cpp")));
				expectedFiles["src/workflow.cpp"] = "// Add C++ function or class definitions here.\n";
			}
			await page.evaluate(name => [...document.querySelectorAll(".file-button")].find(button => button.textContent.includes(name)).click(), entryFile);
			// Supplied helpers can put main below the visible CodeMirror viewport.
			const firstLine = files[entryFile].split("\n").find(line => line.trim());
			await page.waitForFunction(line => document.querySelector(".cm-content")?.textContent.includes(line), {}, firstLine);
			const modifier = await page.evaluate(() => /Mac/.test(navigator.platform) ? "Meta" : "Control");
			const edited = `${completeMemoryAttempt(folder, files[entryFile])}\n// Browser workflow edit\n`;
			expectedFiles[entryFile] = edited;
			await page.click(".cm-content");
			await page.keyboard.down(modifier);
			await page.keyboard.press("a");
			await page.keyboard.up(modifier);
			await page.keyboard.sendCharacter(edited);
			await page.keyboard.down(modifier);
			await page.keyboard.press("s");
			await page.keyboard.up(modifier);
			await page.waitForFunction((key, source, name) => JSON.parse(localStorage.getItem("classes-python-ide-projects:anonymous") ?? "[]").some(project => project.courseProjectKey === key && project.files.some(file => file.name === name && file.content === source)), {}, key, edited, entryFile);
			// The new class packs must preserve and save both their interface and
			// implementation, not only the driver's text.
			const multiFilePack = folder.startsWith("CPPF4") || folder.startsWith("CPPF8-Profile-Posts/");
			const classFiles = multiFilePack ? Object.keys(files).filter(name => name !== entryFile && /\.(?:h|cpp)$/.test(name)) : [];
			assert.equal(classFiles.length, multiFilePack ? 2 : 0);
			for (const name of classFiles) {
				await page.evaluate(name => [...document.querySelectorAll(".file-button")].find(button => button.textContent.includes(name)).click(), name);
				const first = files[name].split("\n").find(line => line.trim());
				await page.waitForFunction(line => document.querySelector(".cm-content")?.textContent.includes(line), {}, first);
				const source = `${files[name]}\n// Browser workflow edit\n`;
				expectedFiles[name] = source;
				await page.click(".cm-content");
				await page.keyboard.down(modifier);
				await page.keyboard.press("a");
				await page.keyboard.up(modifier);
				await page.keyboard.sendCharacter(source);
				await page.keyboard.down(modifier);
				await page.keyboard.press("s");
				await page.keyboard.up(modifier);
				await page.waitForFunction((key, source, name) => JSON.parse(localStorage.getItem("classes-python-ide-projects:anonymous") ?? "[]").some(project => project.courseProjectKey === key && project.files.some(file => file.name === name && file.content === source)), {}, key, source, name);
			}
			if (mode === "cpp") {
				await page.waitForSelector("button.run-control:not(:disabled)");
				await page.click("button.run-control");
				await page.waitForFunction(standard => document.querySelector(".output-panel")?.textContent.includes(`-std=c++${standard}`), {}, standard);
				assert.equal(await page.$(".stdin-panel"), null);
				const instructions = await page.$eval(".output-panel", element => element.textContent);
				assert.match(instructions, /does not compile or execute/);
				for (const name of Object.keys(expectedFiles).filter(name => name.endsWith(".cpp"))) assert.ok(instructions.includes(`'${name}'`));
				assert.equal(runtimeRequests, beforeRuntime, "C++ instructions never start a Python or Java runtime");
			}
			// The Java object capstone is edited/exported here and compiled natively
			// below; the limited browser interpreter is not its execution gate.
			await page.evaluate(() => {
				window.__cppZip = null;
				const original = HTMLAnchorElement.prototype.click;
				HTMLAnchorElement.prototype.click = function () {
					if (this.download.endsWith(".zip") && this.href.startsWith("blob:")) {
						void fetch(this.href).then(response => response.arrayBuffer()).then((bytes) => {
							window.__cppZip = Array.from(new Uint8Array(bytes));
						});
						return;
					}
					return original.call(this);
				};
			});
			await page.click("button[aria-label='Download project ZIP']");
			await page.waitForFunction(() => Array.isArray(window.__cppZip));
			const zip = unzipSync(Uint8Array.from(await page.evaluate(() => window.__cppZip)));
			const exported = Object.fromEntries(Object.entries(zip).map(([path, bytes]) => [path.slice(path.indexOf("/") + 1), strFromU8(bytes)]));
			assert.deepEqual(exported, expectedFiles);
			const directory = join(temporary, `${folder.split("/")[0]}-${mode}`);
			await mkdir(directory);
			for (const [name, content] of Object.entries(exported)) {
				const path = join(directory, name);
				await mkdir(dirname(path), { recursive: true });
				await writeFile(path, content);
			}
			await compileExport(directory, Object.keys(exported), mode, standard);
			if (folder.startsWith("CPPM")) await verifyMemoryExport(directory, folder);
			await page.reload({ waitUntil: "domcontentloaded" });
			await page.waitForFunction(name => [...document.querySelectorAll(".file-button")].some(button => button.textContent.includes(name)), {}, entryFile);
			await page.evaluate(name => [...document.querySelectorAll(".file-button")].find(button => button.textContent.includes(name)).click(), entryFile);
			await page.waitForSelector(".cm-content");
			await page.click(".cm-content");
			// CodeMirror renders the visible lines. Navigate to the saved edit at
			// the end of the document before checking the reopened editor.
			await page.keyboard.down(modifier);
			await page.keyboard.press(modifier === "Meta" ? "ArrowDown" : "End");
			await page.keyboard.up(modifier);
			await page.waitForFunction(() => document.querySelector(".cm-content")?.textContent.includes("Browser workflow edit"));
			for (const name of classFiles) {
				await page.evaluate(name => [...document.querySelectorAll(".file-button")].find(button => button.textContent.includes(name)).click(), name);
				await page.click(".cm-content");
				await page.keyboard.down(modifier);
				await page.keyboard.press(modifier === "Meta" ? "ArrowDown" : "End");
				await page.keyboard.up(modifier);
				await page.waitForFunction(() => document.querySelector(".cm-content")?.textContent.includes("Browser workflow edit"));
				assert.equal(await page.evaluate((key, name) => JSON.parse(localStorage.getItem("classes-python-ide-projects:anonymous") ?? "[]").find(project => project.courseProjectKey === key)?.files.find(file => file.name === name)?.content, key, name), expectedFiles[name]);
			}
			if (classFiles.length) await page.evaluate(name => [...document.querySelectorAll(".file-button")].find(button => button.textContent.includes(name)).click(), entryFile);
			assert.equal(await page.$("[data-testid='ide-route-import-confirm']"), null);
			assert.equal(sourceRequests, before + 1 + Object.keys(files).length, "Reopening preserves learner edits without redownloading");
			if (Object.hasOwn(files, "Makefile")) {
				assert.equal(await page.evaluate(() => [...document.querySelectorAll(".file-button")].find(button => button.querySelector("span")?.textContent === "Makefile")?.querySelector("small")?.textContent.trim()), "Build file");
			}
			if ((folder.startsWith("PTJ4") || folder.startsWith("PTJ7") || folder.startsWith("CPPF") || folder.startsWith("CPPM")) && process.env.COURSE_IMPORT_SCREENSHOT_DIR) {
				const directory = join(previousDirectory, process.env.COURSE_IMPORT_SCREENSHOT_DIR);
				await mkdir(directory, { recursive: true });
				// Show the imported source rather than the last edited blank line.
				await page.click(".cm-content");
				await page.keyboard.down(modifier);
				await page.keyboard.press(modifier === "Meta" ? "ArrowUp" : "Home");
				await page.keyboard.up(modifier);
				await page.waitForFunction(line => document.querySelector(".cm-content")?.textContent.includes(line), {}, firstLine);
				await page.screenshot({ path: join(directory, `course-import-${mode}-${folder.split("/")[0]}-workspace.png`), fullPage: true });
				if (folder.startsWith("PTJ7") && mode === "cpp") {
					await page.setViewport({ width: 390, height: 900 });
					await page.screenshot({ path: join(directory, "course-import-cpp-PTJ7-mobile.png"), fullPage: true });
				}
			}
			if (Object.hasOwn(pointerPacks, folder)) {
				const legacySource = "// Earlier saved learner attempt\nint main() { return 0; }\n";
				await page.click(".cm-content");
				await page.keyboard.down(modifier);
				await page.keyboard.press("a");
				await page.keyboard.up(modifier);
				await page.keyboard.sendCharacter(legacySource);
				await page.keyboard.down(modifier);
				await page.keyboard.press("s");
				await page.keyboard.up(modifier);
				await page.waitForFunction((key, source) => JSON.parse(localStorage.getItem("classes-python-ide-projects:anonymous") ?? "[]").some(project => project.courseProjectKey === key && project.files.some(file => file.name === "main.cpp" && file.content === source)), {}, key, legacySource);
				const requestsBeforeLegacy = sourceRequests;
				await page.goto(new URL(href, origin).href, { waitUntil: "domcontentloaded" });
				await page.waitForFunction(() => document.querySelector(".cm-content")?.textContent.includes("Earlier saved learner attempt"));
				assert.equal(await page.$("[data-testid='ide-route-import-confirm']"), null);
				assert.equal(sourceRequests, requestsBeforeLegacy);
				courseFixture = true;
				await page.goto(`${origin}/courses#${courseId}-${anchor}`, { waitUntil: "domcontentloaded" });
				await page.waitForSelector(selector);
				const freshHref = await page.$eval(selector, link => [...link.closest(".lesson-item").querySelectorAll("a")].find(item => /Open current starter\s+separately/.test(item.textContent))?.getAttribute("href"));
				assert.ok(freshHref, "Full project brief offers the separate current learner import");
				const freshKey = new URL(freshHref, origin).searchParams.get("projectKey");
				assert.notEqual(freshKey, key);
				courseFixture = false;
				await page.goto(new URL(freshHref, origin).href, { waitUntil: "domcontentloaded" });
				await page.waitForSelector("[data-testid='ide-route-import-confirm']");
				assert.equal(sourceRequests, requestsBeforeLegacy);
				await page.click("[data-testid='ide-route-import-confirm']");
				await page.waitForFunction(() => document.querySelector(".cm-content")?.textContent.includes("#include"));
				assert.equal(sourceRequests, requestsBeforeLegacy + 1 + Object.keys(files).length);
				await page.waitForFunction(key => JSON.parse(localStorage.getItem("classes-python-ide-projects:anonymous") ?? "[]").some(project => project.courseProjectKey === key), {}, freshKey);
				const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("classes-python-ide-projects:anonymous")));
				assert.equal(saved.find(project => project.courseProjectKey === key).files.find(file => file.name === "main.cpp").content, legacySource);
				const fresh = saved.find(project => project.courseProjectKey === freshKey);
				assert.ok(fresh);
				assert.deepEqual(Object.fromEntries(fresh.files.map(file => [file.name, file.content])), files);
				record("verified-saved-attempt", { folder, previousKey: key, currentKey: freshKey });
			}
			record("verified", { repository, folder, revision, mode, standard, fileCount: Object.keys(exported).length });
		}
		assert.equal(remoteWrites, 0, "Imports never write to production services");
	}
	catch (error) {
		exitCode = 1;
		if (page) {
			const state = await page.evaluate(() => ({
				path: location.pathname,
				activeFile: document.querySelector(".file-button.is-active")?.textContent,
				editorCount: document.querySelectorAll(".cm-content").length,
				pendingImport: !!document.querySelector("[data-testid='ide-route-import-confirm']"),
				projects: JSON.parse(localStorage.getItem("classes-python-ide-projects:anonymous") ?? "[]").map(project => ({
					key: project.courseProjectKey,
					mode: project.mode,
					activeFile: project.activeFileName,
					files: project.files.map(file => ({ name: file.name, hasEdit: file.content.includes("Browser workflow edit") }))
				}))
			})).catch(() => ({ unavailable: true }));
			record("failure-state", state);
		}
		throw error;
	}
	finally {
		if (page) await page.close();
		if (browser) await browser.close();
		if (server) await server.close();
		if (temporary) await rm(temporary, { recursive: true, force: true });
		process.chdir(previousDirectory);
		record("cleanup", { pid: process.pid, exitCode });
	}
});
