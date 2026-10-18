"""Run the Unit 10/11 follow-up instructions on exact browser-exported source."""
import argparse
import csv
import datetime
import hashlib
import io
import json
import os
from pathlib import Path
import re
import shutil
import signal
import subprocess
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--cc", choices=("clang", "gcc"), required=True)
parser.add_argument("--archives", type=Path, required=True)
parser.add_argument("--proof", type=Path, required=True)
args = parser.parse_args()
assert os.uname().sysname == "Linux" and os.uname().machine == "x86_64", "Use native Linux x86-64 for these activities"
args.proof = args.proof.resolve()
assert not args.proof.exists()
output = args.proof.parent
output.mkdir(parents=True, exist_ok=True)
MASK = (1 << 64) - 1
profiles, debugger_runs, benchmark_runs = [], [], []


def cancel(signum, _frame):
    raise SystemExit(128 + signum)


signal.signal(signal.SIGTERM, cancel)
signal.signal(signal.SIGINT, cancel)


def digest(data):
    return hashlib.sha256(data).hexdigest()


def run(command, cwd, label, expected=0):
    started = datetime.datetime.now(datetime.UTC).isoformat()
    child = subprocess.Popen(command, cwd=cwd, stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE, start_new_session=True)
    entry = dict(parentTaskId="assembly-followup-activities", parentPid=os.getpid(),
                 command=command, cwd=str(cwd), pid=child.pid, startTime=started,
                 timeoutSeconds=120)
    with (output / "processes.jsonl").open("a") as stream:
        stream.write(json.dumps(dict(entry, event="start")) + "\n")
    cleanup = "owned process exited"
    stdout, stderr = b"", b""
    try:
        stdout, stderr = child.communicate(timeout=120)
    except BaseException:
        if child.poll() is None:
            os.killpg(child.pid, signal.SIGTERM)
            try:
                stdout, stderr = child.communicate(timeout=3)
            except subprocess.TimeoutExpired:
                os.killpg(child.pid, signal.SIGKILL)
                stdout, stderr = child.communicate()
        cleanup = "owned process group terminated and reaped"
        raise
    finally:
        with (output / "processes.jsonl").open("a") as stream:
            stream.write(json.dumps(dict(entry, event="end",
                endTime=datetime.datetime.now(datetime.UTC).isoformat(), exitCode=child.returncode,
                childProcessGroupCleanup=cleanup)) + "\n")
        (output / (label + ".stdout.txt")).write_bytes(stdout)
        (output / (label + ".stderr.txt")).write_bytes(stderr)
    assert child.returncode == expected, (label, child.returncode, stderr.decode(errors="replace"))
    return stdout, stderr


def original(fixture, role):
    archive = args.archives / (fixture["pack"] + "-" + role + ".zip")
    expected = {name.removeprefix(fixture["pack"] + "/"): row
                for name, row in fixture["files"].items()
                if name.startswith(fixture["pack"] + "/" + role + "/")
                or name == fixture["pack"] + "/README.md"}
    with zipfile.ZipFile(archive) as zipped:
        names = zipped.namelist()
        assert len(names) == len(set(names)) == len(expected)
        for name, row in expected.items():
            matches = [path for path in names if path.endswith("/" + name)]
            assert len(matches) == 1
            raw = zipped.read(matches[0])
            assert raw == row["content"].encode() and digest(raw) == row["sha256"]
    return {name.removeprefix(role + "/"): row["content"]
            for name, row in expected.items() if name.startswith(role + "/")}


def replace_once(source, before, after):
    assert source.count(before) == 1, before
    return source.replace(before, after)


def guide_block(name):
    path = ROOT / "front-end/src/assets/course-guides" / ("assembly-followup-" + name + ".md")
    blocks = re.findall(r"```text\n(.*?)\n```", path.read_text(), flags=re.S)
    assert len(blocks) == 1
    return blocks[0] + "\n"


def build(work, name, files, executable, mode="Debug", contracts=True):
    directory = work / name
    directory.mkdir()
    retained = output / name
    retained.mkdir()
    for filename, content in files.items():
        (directory / filename).write_text(content)
        (retained / filename).write_text(content)
    flags = "-O0 -g" if mode == "Debug" else "-O2 -g -DNDEBUG"
    run(["cmake", "-S", ".", "-B", "build", "-DCMAKE_BUILD_TYPE=" + mode,
         "-DCMAKE_C_COMPILER=" + args.cc, "-DCMAKE_ASM_COMPILER=" + args.cc,
         "-DCMAKE_C_FLAGS_" + mode.upper() + "=" + flags], directory, name + "-configure")
    run(["cmake", "--build", "build", "--parallel", "1"], directory, name + "-build")
    if contracts:
        run(["ctest", "--test-dir", "build", "--output-on-failure"], directory, name + "-contracts")
    binary = directory / "build" / executable
    shutil.copyfile(binary, retained / executable)
    listing, _ = run(["objdump", "-d", "-M", "intel", str(binary)], directory, name + "-disassembly")
    assert executable.encode() in listing
    profiles.append(dict(name=name, mode=mode, flags=flags, unchangedContractsPassed=contracts,
        executable=str((retained / executable).relative_to(output)), executableSha256=digest(binary.read_bytes()),
        files={filename: digest(content.encode()) for filename, content in files.items()}))
    return binary


def debugger(binary, commands, name, symbols, extras=()):
    prelude = '''set pagination off
set confirm off
set width 0
set disassembly-flavor intel
python
import gdb, json
observations = []
def capture(label):
    registers = {name: int(gdb.parse_and_eval("$" + name)) for name in
        ("pc", "rsp", "rax", "rdi", "rsi", "rcx", "r8", "eflags")}
    frame = gdb.selected_frame()
    row = dict(label=label, registers=registers,
        instruction=frame.architecture().disassemble(registers["pc"], count=1)[0]["asm"],
        stackWord=int(gdb.parse_and_eval("*(unsigned long long*)$rsp")),
        symbols={name: int(gdb.parse_and_eval("(unsigned long long)&" + name)) for name in SYMBOL_NAMES},
        extras={name: int(gdb.parse_and_eval("$" + name)) for name in EXTRA_NAMES})
    observations.append(row)
end
'''.replace("SYMBOL_NAMES", repr(list(symbols))).replace("EXTRA_NAMES", repr(list(extras)))
    script = output / (name + ".gdb")
    script.write_text(prelude + commands + '\npython print("FOLLOWUP_JSON=" + json.dumps(observations, sort_keys=True))\n')
    stdout, _ = run(["gdb", "--batch", "--nx", "--quiet", "-x", str(script), str(binary)], binary.parent, name)
    records = [json.loads(line.removeprefix("FOLLOWUP_JSON=")) for line in stdout.decode().splitlines()
               if line.startswith("FOLLOWUP_JSON=")]
    assert len(records) == 1 and records[0]
    row = dict(name=name, executableSha256=digest(binary.read_bytes()), observations=records[0])
    debugger_runs.append(row)
    return {record["label"]: record for record in records[0]}


def checked_return(records, expected):
    entry, before, caller = (records[label] for label in ("entry", "before-ret", "caller"))
    assert before["instruction"].startswith("ret")
    assert before["registers"]["rsp"] == entry["registers"]["rsp"]
    assert before["stackWord"] == entry["stackWord"]
    assert caller["registers"]["pc"] == entry["stackWord"]
    assert caller["registers"]["rsp"] == entry["registers"]["rsp"] + 8
    assert caller["registers"]["rax"] & MASK == expected & MASK


def fixture_sum(pattern):
    state = 0x814FA27065B39C12 + pattern
    total = 0
    for index in range(64):
        state = (state * 6364136223846793005 + 1442695040888963407) & MASK
        positive = state & ((1 << 63) - 1)
        if pattern == 0 or (pattern == 1 and index % 2 == 0):
            total += positive
        elif pattern == 2 and state < (1 << 63):
            total += state
    return total & MASK


def benchmark(binary, name):
    patterns = ("nonnegative", "alternating", "seeded-mixed")
    variants = ("branch-sequential", "cmov-sequential", "indexed-identity", "indexed-permuted")
    for round_index, order in enumerate(((1, 8, 32), (32, 8, 1)), 1):
        for repeats in order:
            label = name + "-round-" + str(round_index) + "-repeats-" + str(repeats)
            load = list(os.getloadavg())
            observed_at = datetime.datetime.now(datetime.UTC).isoformat()
            stdout, stderr = run([str(binary), "--benchmark", "64", str(repeats), "5"], binary.parent, label)
            assert not stderr
            (output / (label + ".csv")).write_bytes(stdout)
            reader = csv.DictReader(io.StringIO(stdout.decode()))
            assert reader.fieldnames == ["pattern", "variant", "trial", "count", "repeats", "elapsed_ns", "checksum", "expected_checksum", "seed"]
            rows = list(reader)
            assert len(rows) == 60
            seen, groups = set(), {}
            for row in rows:
                assert set(row) == set(reader.fieldnames) and all(row.values())
                pattern, variant = row["pattern"], row["variant"]
                assert pattern in patterns and variant in variants
                values = {key: int(row[key]) for key in reader.fieldnames[2:]}
                identity = pattern, variant, values["trial"]
                assert identity not in seen and 0 <= values["trial"] < 5
                seen.add(identity)
                assert values["count"] == 64 and values["repeats"] == repeats
                assert values["elapsed_ns"] >= 0
                index = patterns.index(pattern)
                assert values["seed"] == 0x814FA27065B39C12 + index
                assert values["checksum"] == values["expected_checksum"] == (fixture_sum(index) * repeats) & MASK
                groups.setdefault((pattern, variant), []).append(values["elapsed_ns"])
            summaries = []
            for (pattern, variant), times in sorted(groups.items()):
                assert len(times) == 5
                ordered = sorted(times)
                summaries.append(dict(pattern=pattern, variant=variant, rawElapsedNs=times,
                    medianElapsedNs=ordered[2], rangeElapsedNs=[ordered[0], ordered[-1]],
                    elementVisits=64 * repeats, medianNsPerElementVisit=ordered[2] / (64 * repeats)))
            benchmark_runs.append(dict(name=label, round=round_index, repeats=repeats, rows=60,
                observedAt=observed_at, loadBefore=load, csvSha256=digest(stdout),
                independentlyComputedChecksums=True, summaries=summaries))


debug_fixture = json.loads((ROOT / "test/fixtures/assembly-debug-contracts.json").read_text())
performance_fixture = json.loads((ROOT / "test/fixtures/assembly-performance-contracts.json").read_text())
assert debug_fixture["revision"] == "337648e72f375e30b235936f8deb5cd9ac64cfde"
assert performance_fixture["revision"] == "dfe6d181f0e6e793aebf78270f7c391e3a0225aa"
conditional, returns, counts = (guide_block(name) for name in ("conditional", "returns", "branch-counts"))
debug_symbols = ("debug_first_nonnegative", "debug_branch_decision", "debug_advance", "debug_found")
compiler_version = run([args.cc, "--version"], ROOT, "compiler-version")[0].decode().splitlines()[0]
system = os.uname()
cpu = next((line.partition(":")[2].strip() for line in Path("/proc/cpuinfo").read_text().splitlines() if line.startswith("model name")), "unknown")
with tempfile.TemporaryDirectory(prefix="assembly-followup-activities-") as temporary:
    work = Path(temporary)
    for role in ("starter", "solution"):
        files = original(debug_fixture, role)
        if role == "starter":
            faulty = build(work, "debug-starter-faulty", files, "assembly_debug", contracts=False)
            stdout, _ = run([str(faulty)], faulty.parent, "debug-starter-faulty-demo", expected=1)
            assert stdout == b"observed=0 expected=2\n"
            observations = debugger(faulty, '''break *debug_branch_decision if $rcx == 1
run
python assert gdb.selected_inferior().pid == 0
python observations.append(dict(label="conditional-absence", inferiorPid=0))
delete breakpoints
break *debug_branch_decision
run
python capture("decision")
si
python capture("successor")
finish
python capture("returned")
''', "debug-starter-faulty-reachability", debug_symbols)
            assert observations["decision"]["registers"]["rcx"] == 0
            assert observations["successor"]["registers"]["pc"] == observations["successor"]["symbols"]["debug_found"]
            assert observations["returned"]["registers"]["rax"] == 0
            files = {**files, "routine.S": replace_once(files["routine.S"], "    jae debug_found", "    jge debug_found")}
        default = build(work, "debug-" + role + "-default", files, "assembly_debug")
        assert run([str(default)], default.parent, "debug-" + role + "-default-demo")[0] == b"observed=2 expected=2\n"
        zero_files = {**files, "main.c": replace_once(replace_once(files["main.c"], "{-8, -1, 4}", "{-8, 0, 4}"), "expected = 2", "expected = 1")}
        zero = build(work, "debug-" + role + "-zero", zero_files, "assembly_debug")
        assert run([str(zero)], zero.parent, "debug-" + role + "-zero-demo")[0] == b"observed=1 expected=1\n"
        for case, binary, result, flags, successor in (("default", default, 2, 0x80, "debug_advance"), ("zero", zero, 1, 0x40, "debug_found")):
            commands = replace_once(conditional, "run\n", 'run\npython capture("decision")\n')
            commands = replace_once(commands, "si\n", 'si\npython capture("successor")\n') + 'python capture("returned")\n'
            records = debugger(binary, commands, "debug-" + role + "-" + case + "-conditional", debug_symbols)
            decision = records["decision"]["registers"]
            assert decision["rcx"] == 1 and decision["eflags"] & 0x8C1 == flags
            assert decision["r8"] & 0xFFFFFFFF == (0xFFFFFFFF if case == "default" else 0)
            assert records["successor"]["registers"]["pc"] == records["successor"]["symbols"][successor]
            assert records["returned"]["registers"]["rax"] == result
        commands = returns.replace("x/gx $rsp\n", 'x/gx $rsp\npython capture("entry")\n', 1)
        commands = replace_once(commands, "si\nprint (unsigned long long)$pc", 'python capture("before-ret")\nsi\npython capture("caller")\nprint (unsigned long long)$pc')
        checked_return(debugger(default, commands, "debug-" + role + "-found-return", debug_symbols), 2)
        empty_main = replace_once(files["main.c"], "    const int32_t values[] = {-8, -1, 4};\n", "")
        empty_main = replace_once(empty_main, "expected = 2", "expected = -1")
        empty_main = replace_once(empty_main, "debug_first_nonnegative(values,\n        (int64_t)(sizeof(values) / sizeof(values[0])))", "debug_first_nonnegative(NULL, 0)")
        empty = build(work, "debug-" + role + "-empty", {**files, "main.c": empty_main}, "assembly_debug")
        assert run([str(empty)], empty.parent, "debug-" + role + "-empty-demo")[0] == b"observed=-1 expected=-1\n"
        records = debugger(empty, '''tbreak *debug_first_nonnegative
run
disassemble /r debug_first_nonnegative
python capture("entry")
python
for index in range(12):
    capture("empty-step-" + str(index))
    if observations[-1]["instruction"].startswith("ret"):
        break
    gdb.execute("si")
else:
    raise AssertionError("Empty path did not reach its RET")
end
python capture("before-ret")
si
python capture("caller")
''', "debug-" + role + "-empty-return", debug_symbols)
        checked_return(records, -1)
        assert records["entry"]["registers"]["rdi"] == records["entry"]["registers"]["rsi"] == 0
        steps = [row["instruction"] for label, row in records.items() if label.startswith("empty-step-")]
        assert [step.split()[0] for step in steps] == ["xor", "cmp", "jge", "mov", "ret"]
        assert all("[" not in step for step in steps)
        performance = original(performance_fixture, role)
        changed = replace_once(performance["main.c"], "{-3, 0, 5, INT64_MAX, INT64_MAX}", "{-3, 0, 6, INT64_MAX, INT64_MAX}")
        changed = replace_once(changed, "expected=3\\n", "expected=4\\n")
        changed = replace_once(changed, "branch == 3 && cmov == 3 && indexed == 3", "branch == 4 && cmov == 4 && indexed == 4")
        for case, source, result in (("default", performance, 3), ("changed", {**performance, "main.c": changed}, 4)):
            name = "performance-" + role + "-" + case
            binary = build(work, name, source, "assembly_performance")
            assert run([str(binary), "--example"], binary.parent, name + "-example")[0] == (f"branch={result} cmov={result} indexed={result} expected={result}\n").encode()
            records = debugger(binary, counts + 'python capture("caller")\n', name + "-branch-counts", ("sum_nonnegative_branch", "performance_branch_decision"), extras=("visits", "selected", "caller_pc"))
            caller = records["caller"]
            assert caller["extras"]["visits"] == 5 and caller["extras"]["selected"] == 4
            assert caller["registers"]["rax"] == result and caller["registers"]["pc"] == caller["extras"]["caller_pc"]
        release = build(work, "performance-" + role + "-release", performance, "assembly_performance", mode="Release")
        benchmark(release, "performance-" + role)
assert not work.exists()
assert len(profiles) == len(debugger_runs) == 13
assert len(benchmark_runs) == 12 and sum(row["rows"] for row in benchmark_runs) == 720
receipt = dict(compiler=args.cc, nativeExecuted=True, profiles=profiles, actualDebuggerRuns=debugger_runs,
    benchmarkRuns=benchmark_runs, sourceRevisions=dict(debug=debug_fixture["revision"], performance=performance_fixture["revision"]),
    machineContext=dict(compilerVersion=compiler_version, system=system.sysname,
        release=system.release, architecture=system.machine, cpu=cpu),
    guideSha256={name: digest((ROOT / "front-end/src/assets/course-guides" / ("assembly-followup-" + name + ".md")).read_bytes())
        for name in ("conditional", "returns", "branch-counts", "repeat-scaling")},
    guideCommandBlocksExact=True, unchangedContractTestsPreserved=True,
    independentlyComputedBenchmarkChecksums=True, noTimingThresholds=True, temporarySourceCleanup=True)
args.proof.write_text(json.dumps(receipt, indent=2) + "\n")
print(json.dumps(dict(compiler=args.cc, nativeProfiles=13, actualDebuggerRuns=13, benchmarkRows=720, temporarySourceCleanup=True)))
