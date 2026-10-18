import type { PythonIdeFile } from "@/modules/pythonIde";
import { rustCourseResource } from "./rustProjectResources";

export function rustBuildInstructions(
	files: PythonIdeFile[],
	starterUrl?: string
) {
	const selected = rustCourseResource(starterUrl ?? "");
	if (selected) {
		if (
			!selected.definition.roleFiles.every(name =>
				files.some(
					file =>
						file.name === `${selected.role}/${name}` &&
						file.encoding !== "base64"
				)
			)
		) {
			return [
				"The Rust lesson is incomplete. Reopen its complete selected-role source before building."
			];
		}
		if (selected.definition.kind === "label-slices") {
			return [
				"Download and extract the ZIP. Use Rust 1.97.1 with Cargo, rustfmt and Clippy; the package declares edition 2024.",
				`cd ${selected.role}`,
				"rustc -Vv",
				"cargo -V",
				"cargo fmt --all --check",
				"rustfmt --edition 2024 --check diagnostics/*.rs",
				"cargo clippy --locked --offline --all-targets -- -D warnings",
				"cargo test --locked --offline",
				"cargo run --locked --offline",
				"cargo run --locked --offline -- --sanitize 'packet-42!'",
				"cargo run --locked --offline -- --window 'a\uD83E\uDD80bc' 1 5",
				"cargo run --locked --offline -- --bytes 'a\uD83E\uDD80bc' 2 3",
				"cargo run --locked --offline -- --chars 'a\uD83E\uDD80bc' 1 2",
				"The unfinished starter retains the identity filter; the target keeps ASCII letters, digits and dashes. Refactor str_window and byte_window into checked borrowed views while preserving Reversed, OutOfBounds and NotCharBoundary.",
				"Read ../README.md and complete CORE, LABEL CASES, PREDICT, CHECKS and LIMITS in observations.md. Continue WINDOWS, CHOICE or CHALLENGE in the same saved project.",
				"The separate diagnostics distinguish E0277 from a deliberate panic with status 101. Follow the guide's rustc commands and compare checked alternatives; Cargo tests do not run those standalone programs.",
				"Record stdout, stderr and exit status separately. String byte ranges require UTF-8 character boundaries; scalar positions are not grapheme counts. Only the CLI selects an exit status."
			];
		}
		if (selected.definition.kind === "typed-errors") {
			return [
				"Download and extract the ZIP. Use Rust 1.97.1 with Cargo, rustfmt and Clippy; the package declares edition 2024.",
				`cd ${selected.role}`,
				"rustc -Vv",
				"cargo -V",
				"cargo fmt --all --check",
				"rustfmt --edition 2024 --check diagnostics/*.rs",
				"cargo clippy --locked --offline --all-targets -- -D warnings",
				"cargo test --locked --offline",
				"cargo run --locked --offline",
				"cargo run --locked --offline -- --record 'A:65536'",
				"cargo run --locked --offline -- --scan '' 'A:0'",
				"Refactor the numeric baseline into Record, ParseError and Result. MissingSeparator and ValueOutOfRange have different caller actions. Result<Option<Record>, RowError> separates absence, valid zero and an indexed failure.",
				"Read ../README.md and complete CORE, ERROR TABLE, PREDICT, CHECKS and LIMITS in observations.md. Continue ABSENCE, CHOICE or CHALLENGE in the same saved project.",
				"The standalone diagnostics intentionally refuse with E0004, E0277 and E0308. Follow the guide's separate rustc commands and compare each working fix.",
				"Only the CLI chooses an exit status. Record stdout, stderr and status separately; the library returns values without terminating a process."
			];
		}
		if (selected.definition.kind === "borrowing") {
			return [
				"Download and extract the ZIP. Use Rust 1.97.1 with Cargo, rustfmt and Clippy; the package declares edition 2024.",
				`cd ${selected.role}`,
				"rustc -Vv",
				"cargo -V",
				"cargo fmt --all --check",
				"rustfmt --edition 2024 --check diagnostics/*.rs",
				"cargo clippy --locked --offline --all-targets -- -D warnings",
				"cargo test --locked --offline",
				"cargo run --locked --offline",
				"cargo run --locked --offline -- 'name=ÉA;role=ß' empty",
				"Refactor the owned baseline into RecordView with borrowed fields. Preserve the schema, ASCII-only normalization, byte-length selection, disjoint slices and deliberate owned result.",
				"Read ../README.md and complete CORE, BORROW MAP, PREDICT, CHECKS and LIMITS in observations.md. Continue MUTATION, CHOICE or CHALLENGE in the same saved project.",
				"The separate diagnostics intentionally refuse with E0502, E0499, E0515 and E0106. Follow the guide's rustc commands and compare all four paired fixes.",
				"Lifetime annotations relate valid references; they do not extend an owner. Run native checks after source edits."
			];
		}
		if (selected.definition.kind === "ownership") {
			return [
				"Download and extract the ZIP. Use Rust 1.97.1 with Cargo, rustfmt and Clippy; the package declares edition 2024.",
				`cd ${selected.role}`,
				"rustc -Vv",
				"cargo -V",
				"cargo fmt --all --check",
				"rustfmt --edition 2024 --check diagnostics/*.rs",
				"cargo clippy --locked --offline --all-targets -- -D warnings",
				"cargo test --locked --offline",
				"cargo run --locked --offline",
				"cargo run --locked --offline -- alpha empty",
				"Trace the String, Vec and Packet moves, cloned snapshot and borrowed label in src/main.rs. The updated vector gains 9; the snapshot stays unchanged.",
				"Record the ScopeTag sequence: inner-second, inner-first, explicit, after-explicit-drop, outer. These markers do not measure allocator activity or timing.",
				"Read ../README.md and complete OWNER LEDGER, PREDICT, CHECKS and LIMITS in observations.md. Continue with SCOPE, CHOICE or CHALLENGE in the same saved project.",
				"The two use-after examples intentionally refuse compilation with E0382; copy-owned refuses with E0204. Follow the guide's separate rustc commands and compare each paired working example.",
				"The browser edits and saves source. Build and diagnostic checks run in the native Rust environment."
			];
		}
		return [
			"Download and extract the ZIP. Use Rust 1.97.1 with Cargo, rustfmt and Clippy; the package declares edition 2024.",
			`cd ${selected.role}`,
			"rustc -Vv",
			"cargo -V",
			"cargo fmt --all --check",
			"cargo clippy --locked --offline --all-targets -- -D warnings",
			"cargo test --locked --offline",
			"cargo run --locked --offline",
			"cargo run --locked --offline -- 'A B_c/9'",
			"The default stdout is packet-42 and a newline; the changed input gives ABc9. Record actual stderr and exit statuses separately.",
			"Read ../README.md and complete observations.md for the selected activity. Keep Cargo.lock and both diagnostic examples with the source.",
			"The moved-value diagnostic is expected to fail compilation with E0382; the corrected example prints packet-42 twice. Follow the guide's separate rustc commands.",
			"The browser edits and saves source. Build and diagnostic checks run in the native Rust environment."
		];
	}
	const manifests = files.filter(file =>
		/(?:^|\/)Cargo\.toml$/.test(file.name)
	);
	if (manifests.length !== 1 || manifests[0]?.encoding === "base64") {
		return [
			"Extract the ZIP and follow the project's build guide. A Cargo project needs one selected Cargo.toml; a standalone Rust source needs its own rustc command."
		];
	}
	const folder = manifests[0].name.split("/").slice(0, -1).join("/");
	return [
		"Download and extract the ZIP. Use a native Rust toolchain with edition 2024 support.",
		...(folder ? [`cd '${folder.replaceAll("'", "'\"'\"'")}'`] : []),
		"rustc -Vv",
		"cargo -V",
		"cargo fmt --all --check",
		"cargo clippy --locked --offline --all-targets -- -D warnings",
		"cargo test --locked --offline",
		"cargo run --locked --offline",
		"Follow README.md for the program's inputs and expected output."
	];
}
