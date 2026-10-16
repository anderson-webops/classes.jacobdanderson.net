import type { PythonIdeFile } from "@/modules/pythonIde";
import {
	assemblyArithmeticPack,
	assemblyArrayPack,
	assemblyCalculatorPack,
	assemblyCompilerPack,
	assemblyCourseResource,
	assemblyDebugPack,
	assemblyHardeningPack,
	assemblyHardeningTracePack,
	assemblyHelperPack,
	assemblyParserPack,
	assemblyPerformancePack,
	assemblyRecordPack,
	assemblyReversePack,
	assemblySetupPacks,
	assemblyStackPack,
	assemblyStringPack
} from "@/modules/assemblyProjectResources";

export function assemblyBuildInstructions(
	files: PythonIdeFile[],
	starterUrl?: string
) {
	const selected = assemblyCourseResource(starterUrl ?? "");
	const lines = [
		"Save and download the ZIP, then extract it before building.",
		"Assembly compilation, tests and debugging require Linux x86-64, the System V AMD64 ABI, GNU/Clang assembly with the syntax specified in README.md, and a native Clang or GCC toolchain.",
		"The workspace edits and saves source. Use an x86-64 Linux VM or lab on macOS, or an x86-64 WSL distribution on Windows."
	];
	if (
		selected &&
		assemblySetupPacks.some(pack => pack.pack === selected.pack)
	) {
		if (
			!selected.definition.roleFiles.every(name =>
				files.some(file => file.name === `${selected.role}/${name}`)
			) ||
			!files.some(file => file.name === "README.md")
		) {
			return [
				...lines,
				"This setup project is incomplete. Restore the complete selected role and README.md before building; preserve the saved attempt first."
			];
		}
		const symbols = selected.pack === assemblySetupPacks[0].pack;
		return [
			...lines,
			"These two optional setup investigations use GNU AT&T source syntax: movl $LAB_VALUE, %eax writes the immediate value into EAX. The objdump -Mintel display changes the notation, not the instruction. Required course projects keep their documented Intel source syntax.",
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build-first -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build-first --verbose --parallel 1",
			"Read README.md and retain the first diagnostic. A link failure is expected for the untouched learner; assembly and linking are separate stages.",
			symbols
				? "Inspect lab_answer with nm -P and readelf -Ws. The learner task is the single .globl lab_answer export in routine.S; the separate caller already requests a global symbol."
				: "Inspect the explicit -x assembler selection in compile_commands.json, the unresolved LAB_VALUE symbol and relocation. The learner task is LAB_ASM_LANGUAGE=assembler-with-cpp in CMakeLists.txt; an independent -E command does not prove the selected build preprocesses.",
			"After the documented change, configure a fresh build directory:",
			"cmake -S . -B build-completed -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build-completed --verbose --parallel 1",
			"ctest --test-dir build-completed --output-on-failure",
			"./build-completed/app",
			"cmake -S . -B build-value73 -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DLAB_VALUE=73",
			"cmake --build build-value73 --parallel 1",
			"ctest --test-dir build-value73 --output-on-failure",
			"./build-value73/app",
			"The changed build prints answer=73. Repeat the staged object/link commands from README.md with GCC, using separate directories. Record observed symbol binding, relocation, instruction bytes and the controlled regression in trace.md; passing tests does not complete that explanation.",
			selected.role === "starter"
				? "The untouched learner reaches a real link failure. Keep main.c, lab.h and tests.c unchanged; complete only the named directive/build-language choice and the separate trace."
				: `The reference prints answer=${symbols ? 42 : 41} and passes the contract. Predict the regression before changing the source; retain the separate learner attempt.`
		];
	}
	if (selected?.pack === assemblyArithmeticPack) {
		const required = [
			"routine.S",
			"main.c",
			"arithmetic.h",
			"model.c",
			"tests.c",
			"abi_checks.S",
			"fault.c",
			"fault.S",
			"CMakeLists.txt",
			"trace.md"
		];
		if (
			!required.every(name =>
				files.some(file => file.name === `${selected.role}/${name}`)
			) ||
			!files.some(file => file.name === "README.md")
		) {
			return [
				...lines,
				"The arithmetic project is incomplete. Save the current work, then import its selected role with all ten role files and the shared README before using its native commands."
			];
		}
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			'cmake -S . -B build-O0 -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DCMAKE_C_FLAGS_DEBUG="-O0 -g" -DCMAKE_ASM_FLAGS_DEBUG="-O0 -g" -DCMAKE_EXPORT_COMPILE_COMMANDS=ON',
			"cmake --build build-O0 --verbose --parallel 1",
			"./build-O0/assembly_arithmetic",
			"ctest --test-dir build-O0 --output-on-failure",
			"./build-O0/assembly_arithmetic --changed",
			"objdump -d -M intel --disassemble=arithmetic_eval build-O0/assembly_arithmetic",
			"gdb ./build-O0/assembly_arithmetic",
			'cmake -S . -B build-O2 -DCMAKE_BUILD_TYPE=Release -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DCMAKE_C_FLAGS_RELEASE="-O2 -g -DNDEBUG" -DCMAKE_ASM_FLAGS_RELEASE="-O2 -g -DNDEBUG" -DCMAKE_EXPORT_COMPILE_COMMANDS=ON',
			"cmake --build build-O2 --verbose --parallel 1",
			"ctest --test-dir build-O2 --output-on-failure",
			"./build-O2/assembly_arithmetic --changed",
			"mkdir -p observed",
			"clang -std=c17 -O0 -g -S -masm=intel model.c -o observed/model-O0.s",
			"clang -std=c17 -O2 -g -S -masm=intel model.c -o observed/model-O2.s",
			"Locate ARITH_MUL and ARITH_DIV in routine.S and connect each region to its implicit registers and stored result fields.",
			"Trace ADD/SUB, AND/OR/XOR/TEST/CMP and the implicit RDX:RAX multiplication/division registers. Capture only defined CF/ZF/SF/OF; IDIV flags are undefined for this contract.",
			"The public function rejects zero/overflow division without output writes. After recording predictions, the separate owned arithmetic_fault_probe demonstrates the actual kernel SIGFPE for zero and overflow. Its link omits a sanitizer handler; ordinary C contracts remain sanitized.",
			"For the separate fault experiment, follow ../README.md: ulimit -c 0 in the current lab shell, then gdb --args ./build-O0/arithmetic_fault_probe zero; repeat with overflow. Keep these processes separate from passing contract runs.",
			"Complete trace.md with actual instruction addresses, before/after values, defined flags, changed cases, separate fault evidence and the arithmetic_c_mix O0/O2 comparison. Use compile_commands.json and current listings; this comparison makes no timing claim.",
			"Read ../README.md for the exact nine-operation value/auxiliary/flags/defined contract, GCC comparison and GDB checkpoints. Passing code does not complete the required trace explanation.",
			selected.role === "starter"
				? "Complete ARITH_MUL and ARITH_DIV only in routine.S, plus trace.md in this same saved attempt. The untouched demo builds but exits 78 without successful rows; keep the driver, model, ABI checker and tests unchanged."
				: "The reference prints nine operation rows and one C-helper row and passes 591,123 contract cases per completed profile. Record current compiler versions, actual register states and fault evidence beside the portable reference reasoning."
		];
	}
	if (
		selected?.pack === assemblyRecordPack &&
		[
			"routine.S",
			"main.c",
			"record.h",
			"abi_checks.S",
			"tests.c",
			"CMakeLists.txt",
			"trace.md"
		].every(name =>
			files.some(file => file.name === `${selected.role}/${name}`)
		) &&
		files.some(file => file.name === "README.md")
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			'cmake -S . -B build-O0 -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DCMAKE_C_FLAGS_DEBUG="-O0 -g" -DCMAKE_ASM_FLAGS_DEBUG="-O0 -g" -DCMAKE_EXPORT_COMPILE_COMMANDS=ON',
			"cmake --build build-O0 --verbose --parallel 1",
			"ctest --test-dir build-O0 --output-on-failure",
			"./build-O0/assembly_demo",
			"./build-O0/assembly_demo --changed",
			"readelf -hW -sW build-O0/CMakeFiles/record_decode.dir/routine.S.o",
			"readelf -Wr -sW build-O0/CMakeFiles/assembly_demo.dir/main.c.o",
			"objdump -dr -M intel build-O0/CMakeFiles/assembly_demo.dir/main.c.o",
			"readelf -hW -lW build-O0/assembly_demo",
			"objdump -d -M intel --disassemble=decode_record build-O0/assembly_demo",
			"gdb ./build-O0/assembly_demo",
			'cmake -S . -B build-O2 -DCMAKE_BUILD_TYPE=Release -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DCMAKE_C_FLAGS_RELEASE="-O2 -g -DNDEBUG" -DCMAKE_ASM_FLAGS_RELEASE="-O2 -g -DNDEBUG" -DCMAKE_EXPORT_COMPILE_COMMANDS=ON',
			"cmake --build build-O2 --verbose --parallel 1",
			"ctest --test-dir build-O2 --output-on-failure",
			"./build-O2/assembly_demo --changed",
			"Compare actual caller disassembly and compile_commands.json across O0/O2. Record symbols, relocation, executable interpreter and the real GDB address/load-width trace in trace.md.",
			"Read ../README.md for the full memory/ABI contract, predicted byte rows, GCC comparison, object/link/load trail and debugger commands. Passing tests does not complete trace.md; this comparison makes no timing claim.",
			selected.role === "starter"
				? "Complete RECORD_DECODE in routine.S and the required trace.md in this same saved attempt. The untouched program links but exits 78; retain that first result and keep the C driver, tests and ABI checker unchanged."
				: "The reference decodes the records and passes 196,609 contract cases per completed profile. Keep actual compiler/artifact identities and debugger observations beside the reference reasoning."
		];
	}
	if (
		selected?.pack === assemblyCalculatorPack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang",
			"cmake --build build",
			"ctest --test-dir build --output-on-failure",
			"./build/assembly_calculator",
			"./build/assembly_calculator '/' -21 3",
			"Read ../README.md for the exact 64-bit wrapping arithmetic, division restrictions, GCC/Release builds and GDB trace.",
			"Invalid inputs, divisor zero and INT64_MIN / -1 are rejected with exit 2 before assembly evaluation.",
			selected.role === "starter"
				? "Addition, subtraction and multiplication already work. Complete CALC_DIV, CALC_AND and CALC_XOR in calculator.S; the untouched demo exits 78 without successful result rows."
				: "The reference prints six valid result rows, passes 12,589 arithmetic cases and returns result=-7 for the negative division example."
		];
	}
	if (
		selected?.pack === assemblyArrayPack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build",
			"ctest --test-dir build --output-on-failure",
			"./build/assembly_array",
			"Read ../README.md for the exact function contract, GCC/Release builds, bounded memory cases and GDB trace.",
			selected.role === "starter"
				? "Complete ARRAY_SEARCH in array_routines.S; summation already works. The untouched demo exits 78 with no successful rows."
				: "The reference prints sum=48 and first-match indices 0, 3 and -1 and passes 11,280 array cases."
		];
	}
	if (
		selected?.pack === assemblyStringPack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build",
			"ctest --test-dir build --output-on-failure",
			"./build/assembly_strings",
			"Read ../README.md for the exact function contract, GCC/Release builds, bounded memory cases and GDB trace.",
			selected.role === "starter"
				? "Complete COPY_SOURCE_LENGTH in string_routines.S; length and bounded-copy loops are present. The untouched demo exits 78 with no successful rows."
				: "The reference returns source length 8 for full, truncated and zero-capacity copies, stores assem in the six-byte buffer and passes 35,900 string cases."
		];
	}
	if (
		selected?.pack === assemblyHelperPack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build",
			"ctest --test-dir build --output-on-failure",
			"./build/assembly_helper",
			"The C helper receives the scaled sum and both signed bounds. Its entry stack remainder is 8 modulo 16; restore stack adjustments and all preserved registers before returning.",
			"Read ../README.md for the complete contract, worked trace, GCC/Release builds and GDB instructions.",
			selected.role === "starter"
				? "Complete CALL_CLAMP in scale_and_clamp.S; the sum-and-scale loop is present. The untouched demo exits 78 with no successful rows."
				: "The reference calls the actual C clamp helper, prints scaled and clamped=40 and scaled and clamped=25, and passes 11,280 helper cases."
		];
	}
	if (
		selected?.pack === assemblyParserPack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build",
			"ctest --test-dir build --output-on-failure",
			"./build/assembly_parser",
			"./build/assembly_parser sum 12 -4 7",
			"Invalid commands, operand counts, text and out-of-range values are rejected with exit 2 on stderr and no result rows. A failed parse leaves its output unchanged.",
			"Read ../README.md for the complete contract, worked trace, GCC/Release builds and GDB instructions.",
			selected.role === "starter"
				? "Complete PARSE_SIGN and PARSE_BOUND in parser.S; equality and the digit loop are present. The untouched demo exits 78 with no successful rows."
				: "The reference prints sum=15, max=12 and xor=-9, accepts the full signed 64-bit range and passes 9,157 parser/equality cases."
		];
	}
	if (
		selected?.pack === assemblyReversePack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build",
			"ctest --test-dir build --output-on-failure",
			"./build/assembly_reverse",
			"./build/assembly_reverse 13",
			"./build/assembly_reverse -9223372036854775808",
			"Keep C undefined-behavior sanitization enabled. The signed comparison and modular offsets must match the unchanged mystery routine across full-width inputs. Invalid operands are rejected with exit 2 and no result rows.",
			"Read ../README.md for the complete contract, worked trace, GCC/Release builds and GDB instructions.",
			selected.role === "starter"
				? "Complete RECONSTRUCT_THRESHOLD in reconstructed.c and record pseudocode for all three phases; keep mystery.S unchanged. The untouched demo exits 78 with no successful rows."
				: "The reference matches all six demo rows and full-width changed cases, passes 10,033 reconstruction cases and retains C undefined-behavior checks."
		];
	}
	if (
		selected?.pack === assemblyStackPack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build",
			"ctest --test-dir build --output-on-failure",
			"./build/assembly_stack",
			"Call the supplied leaf first for a and then for b. It clears caller-saved registers, so preserve the still-live values and restore the caller frame.",
			"The leaf enters at stack remainder 8 modulo 16. Both call sites require an aligned stack, and all six preserved registers must survive.",
			"Read ../README.md for the complete contract, worked trace, GCC/Release builds and GDB instructions.",
			selected.role === "starter"
				? "Complete STACK_CALLS in routine.S; keep both real leaf calls, live values, aligned call sites and balanced restoration. The untouched demo exits 78 with no successful rows."
				: "The reference returns 30, 38, 10 and 8 in the four demo rows and passes 10,012 full-width pair cases, with actual ordered calls and aligned leaf entries."
		];
	}
	if (
		selected?.pack === assemblyCompilerPack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			'cmake -S . -B build-O0 -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DCMAKE_C_FLAGS_DEBUG="-O0 -g"',
			"cmake --build build-O0",
			"ctest --test-dir build-O0 --output-on-failure",
			"./build-O0/assembly_compiler",
			'cmake -S . -B build-O2 -DCMAKE_BUILD_TYPE=Release -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DCMAKE_C_FLAGS_RELEASE="-O2 -g -DNDEBUG"',
			"cmake --build build-O2",
			"ctest --test-dir build-O2 --output-on-failure",
			"./build-O2/assembly_compiler",
			"mkdir -p observed",
			"clang -std=c17 -O0 -g -S -masm=intel -fverbose-asm model.c -o observed/model-O0.s",
			"clang -std=c17 -O2 -g -S -masm=intel -fverbose-asm model.c -o observed/model-O2.s",
			"objdump -d -M intel build-O0/assembly_compiler > observed/linked-O0.txt",
			"objdump -d -M intel build-O2/assembly_compiler > observed/linked-O2.txt",
			"Both supplied roles work immediately and check 10,013 full-width triplets plus preserved registers. Successful compilation or execution does not complete the analysis worksheet.",
			"Read ../README.md for the exact modular contract, actual generated listings, GCC comparison, changed-case predictions and GDB trace. The commands above run from the selected role folder.",
			selected.role === "starter"
				? "Complete analysis.md with the actual target/flags, four predictions, instruction mapping, optimization comparison, an independent changed case, a debugger trace and a bounded explanation. Keep model.c unchanged for the primary comparison."
				: "The reference analysis.md supplies portable reasoning and a changed-case example; record the current compiler version, real listings and debugger addresses separately."
		];
	}
	if (
		selected?.pack === assemblyDebugPack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build",
			"./build/assembly_debug",
			"ctest --test-dir build --output-on-failure",
			"gdb ./build/assembly_debug",
			"The original branch misinterprets a negative int32_t value using an unsigned condition. Inspect debug_branch_decision, the actual next instruction and SF/OF/ZF/CF before editing.",
			"Read ../README.md for the exact count/memory/ABI contract, unchanged tests, actual debugger steps, GCC/Release builds and independently predicted zero-containing case.",
			selected.role === "starter"
				? "Record the failing trace in analysis.md before repairing DEBUG_SIGNED_BRANCH in routine.S. The untouched demo exits 1 with observed=0 expected=2; retain that evidence, make the minimal signed-branch correction and repeat the same trace."
				: "The reference returns observed=2 expected=2 and passes 10,019 cases. Compare the saved faulty/corrected instruction states; passing code alone does not complete analysis.md."
		];
	}
	if (
		selected?.pack === assemblyPerformancePack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			'cmake -S . -B build-debug -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DCMAKE_C_FLAGS_DEBUG="-O0 -g"',
			"cmake --build build-debug",
			"ctest --test-dir build-debug --output-on-failure",
			"./build-debug/assembly_performance --example",
			'cmake -S . -B build-release -DCMAKE_BUILD_TYPE=Release -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DCMAKE_C_FLAGS_RELEASE="-O2 -g -DNDEBUG"',
			"cmake --build build-release",
			"ctest --test-dir build-release --output-on-failure",
			"./build-release/assembly_performance --benchmark > release-default.csv",
			"./build-release/assembly_performance --benchmark 64 3 2 > release-small.csv",
			"Both roles provide a working baseline. The example returns branch=3 cmov=3 indexed=3 expected=3; CTest checks 11 fixed and guard-page cases.",
			"Native validation additionally exercised 10,015 independent cases, for 10,026 per profile, with six preserved registers.",
			"The default benchmark records 60 rows and the changed-count example records 24. Keep matching checksums, every trial, compiler/flags and machine context; no elapsed-time target or universal winner is supplied.",
			"Compare identity/permuted indexed access on nonnegative values first. Permuting mixed signs also changes branch outcomes, and sequential/indexed comparisons add index-load overhead.",
			"Read ../README.md for the exact modulo/count/index contract, actual debugger steps, monotonic-clock limitations and the complete measurement/interpretation sequence.",
			selected.role === "starter"
				? "Complete analysis.md with predictions, successful correctness evidence, actual repeated measurements, instruction mapping, a changed case and a bounded conclusion."
				: "The reference analysis.md explains invariants and confounders; retain current raw measurements and machine context separately."
		];
	}
	if (
		(selected?.pack === assemblyHardeningPack ||
			selected?.pack === assemblyHardeningTracePack) &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"Both supplied programs are a working baseline. The task is recording and explaining binary evidence.",
			"cmake -S . -B build-baseline -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DLAB_PROFILE=baseline",
			"cmake --build build-baseline",
			"ctest --test-dir build-baseline --output-on-failure",
			"./build-baseline/assembly_hardening",
			"cmake -S . -B build-guard -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DLAB_PROFILE=guard",
			"cmake --build build-guard",
			"ctest --test-dir build-guard --output-on-failure",
			"cmake -S . -B build-guard-pie -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DLAB_PROFILE=guard-pie",
			"cmake --build build-guard-pie",
			"ctest --test-dir build-guard-pie --output-on-failure",
			"./build-guard-pie/assembly_hardening ABC",
			"Each profile passes 69 physical/fixed and 10,010 independent cases, for 10,079 per profile. Repeat both optimization levels and compilers as described in ../README.md.",
			"The profiles isolate C stack guarding and position independence. Handwritten instructions remain unchanged; a guard is not a bounds or pointer-validity check.",
			"Read ../README.md for the exact byte/count contract, all three profiles, function disassembly and GDB commands, including show disable-randomization. Record the observed policy and its limits.",
			selected.pack === assemblyHardeningTracePack
				? "Complete trace.md with actual entry registers, executed instructions, returns, changed inputs and debugger-policy evidence. This saved workspace is separate from the static analysis."
				: "Complete analysis.md with predictions, exact build commands, function-scoped guard evidence, ELF types, unchanged results and bounded conclusions. The separate trace worksheet extends this investigation."
		];
	}
	if (
		selected &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang",
			"cmake --build build",
			"ctest --test-dir build --output-on-failure",
			"./build/assembly_demo",
			"Read ../README.md for the exact 32-bit wrapping contract, GCC/Release builds and GDB trace.",

			selected.role === "starter"
				? "The untouched starter builds, fails its contract test, and exits 78 without a successful total. Complete ASM_TRANSFORM in routine.S."
				: "The reference prints total=100 and passes 10,012 arithmetic cases plus preserved-register checks. Compare with saved learner work."
		];
	}
	return [
		...lines,
		"Follow the project README to choose its source files and entry point. For the supplied single-function example:",

		"cc -std=c17 -Wall -Wextra -Wpedantic main.c routine.S -o project",
		"./project"
	];
}
