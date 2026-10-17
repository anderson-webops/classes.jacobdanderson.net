"""Verify exact browser exports and execute their saved compiler observation worksheets."""
import argparse
import datetime
import hashlib
import json
import os
import signal
import subprocess
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--cc", choices=("clang", "gcc"), required=True)
parser.add_argument("--archives", type=Path, required=True)
parser.add_argument("--proof", type=Path, required=True)
args = parser.parse_args()
args.proof = args.proof.resolve()
args.proof.parent.mkdir(parents=True, exist_ok=True)
fixtures = json.loads((ROOT / "test/fixtures/assembly-compiler-optional-contracts.json").read_text())
verifier = json.loads((ROOT / "test/fixtures/assembly-compiler-optional-source-verifier.json").read_text())
assert hashlib.sha256(verifier["content"].encode()).hexdigest() == verifier["sha256"]


def run(command, cwd, expected=0):
    started = datetime.datetime.now(datetime.UTC).isoformat()
    child = subprocess.Popen(command, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, start_new_session=True)
    cleanup = "process exited"
    try:
        out, err = child.communicate(timeout=240)
    except BaseException:
        try:
            os.killpg(child.pid, signal.SIGTERM)
        except ProcessLookupError:
            pass
        try:
            child.communicate(timeout=3)
        except subprocess.TimeoutExpired:
            os.killpg(child.pid, signal.SIGKILL)
            child.communicate()
        cleanup = "owned process group terminated and reaped"
        raise
    finally:
        with args.proof.with_suffix(".wrapper-processes.jsonl").open("a") as stream:
            stream.write(json.dumps({"parentTaskId": "assembly-compiler-optional-site-export", "command": command, "cwd": str(cwd), "pid": child.pid, "startTime": started, "endTime": datetime.datetime.now(datetime.UTC).isoformat(), "exitCode": child.returncode, "timeoutSeconds": 240, "childProcessGroupCleanup": cleanup}) + "\n")
    prefix = args.proof.parent / (args.cc + "-wrapper-" + str(child.pid))
    prefix.with_suffix(".stdout.txt").write_bytes(out)
    prefix.with_suffix(".stderr.txt").write_bytes(err)
    accepted = child.returncode == expected if expected in (0, 78) else child.returncode != 0
    assert accepted, (command, child.returncode, err.decode(errors="replace"))
    return out, err


def entries(path, expected):
    with zipfile.ZipFile(path) as archive:
        assert len(archive.namelist()) == len(expected) == 10
        result = {}
        for name in expected:
            matches = [path for path in archive.namelist() if path.endswith("/" + name)]
            assert len(matches) == 1
            result[name] = archive.read(matches[0])
        return result


export_hashes = {}
edited_profiles = []
with tempfile.TemporaryDirectory(prefix="assembly-compiler-optional-export-") as temporary:
    root = Path(temporary)
    for fixture in fixtures:
        assert fixture["revision"] == verifier["revision"]
        pack = fixture["pack"]
        for role in ("starter", "solution"):
            expected = {path.removeprefix(pack + "/"): file for path, file in fixture["files"].items() if path.startswith(pack + "/" + role + "/") or path == pack + "/README.md"}
            original = entries(args.archives / (pack + "-" + role + ".zip"), expected)
            for name, raw in original.items():
                assert raw.decode() == expected[name]["content"] and hashlib.sha256(raw).hexdigest() == expected[name]["sha256"]
                path = root / pack / name
                path.parent.mkdir(parents=True, exist_ok=True)
                if path.exists(): assert path.read_bytes() == raw
                path.write_bytes(raw)
                export_hashes[pack + "/" + name] = expected[name]["sha256"]
            changed = dict(original)
            task = role + "/analysis.md"
            changed[task] += b"\nSaved compiler observation: record the actual instructions and input types.\n"
            assert changed[task] != original[task]
            for width in (1280, 360):
                for theme in ("light", "dark"):
                    assert entries(args.archives / (pack + "-" + role + "-edited-" + str(width) + "-" + theme + ".zip"), expected) == changed
            directory = root / (fixture["mode"] + "-saved-" + role)
            directory.mkdir()
            for name, raw in changed.items():
                if name.startswith(role + "/"): (directory / name.removeprefix(role + "/")).write_bytes(raw)
            run(["cmake", "-S", ".", "-B", "build", "-DCMAKE_BUILD_TYPE=Debug", "-DCMAKE_C_COMPILER=" + args.cc, "-DCMAKE_ASM_COMPILER=" + args.cc], directory)
            run(["cmake", "--build", "build", "--verbose", "--parallel", "1"], directory)
            run(["ctest", "--test-dir", "build", "--output-on-failure"], directory, expected=0)
            retained = args.proof.parent / (args.cc + "-saved") / directory.name
            retained.mkdir(parents=True)
            for local in list(directory.iterdir()) + [directory / "build/app", directory / "build/contracts", directory / "build/CMakeFiles/app.dir/baseline.c.o"]:
                if local.is_file(): (retained / local.name).write_bytes(local.read_bytes())
            for variant in ("default", "changed"):
                # Worksheet edits leave both working programs unchanged.
                succeeds = True
                stdout, stderr = run([str(directory / "build/app"), *(["--changed"] if variant == "changed" else [])], directory, expected=0 if succeeds else 78)
                (retained / (variant + ".stdout.txt")).write_bytes(stdout)
                (retained / (variant + ".stderr.txt")).write_bytes(stderr)
                if succeeds: assert stdout.startswith(b"initial=")
                else: assert stdout == b""
            edited_profiles.append({"mode": fixture["mode"], "role": role, "browserWidths": 2, "browserThemes": 2, "savedWorksheet": True, "retainedDirectory": str(retained.relative_to(args.proof.parent))})
    path = root / verifier["path"]
    path.parent.mkdir()
    path.write_text(verifier["content"])
    run(["python3", str(path), "--cc", args.cc, "--proof", str(args.proof)], root)
    receipt = json.loads(args.proof.read_text())
    assert receipt["sourceFiles"] == export_hashes and receipt["nativeExecuted"] and receipt["exactSourceFilesUnchanged"]
    assert len(receipt["profiles"]) == 12
    assert sum(row["kind"] in ("O0", "O2") for row in receipt["profiles"]) == 8
    assert sum(row["kind"] == "sanitized" for row in receipt["profiles"]) == 2
    assert sum(row["kind"] == "wrong-contract" for row in receipt["profiles"]) == 2
    assert receipt["everyRestrictedCallUsesDistinctModifiedObjects"] and receipt["undefinedAliasCallsNeverExecuted"]
    assert len(export_hashes) == 38
    receipt.update(sourceRevision=verifier["revision"], exactBrowserSourceFiles=len(export_hashes), actualSavedEditProfiles=edited_profiles, editedArchivesCompared=16, temporarySourceCleanup=True)
assert not root.exists()
args.proof.write_text(json.dumps(receipt, indent=2) + "\n")
print(json.dumps({"compiler": args.cc, "exactBrowserSourceFiles": receipt["exactBrowserSourceFiles"], "editedArchivesCompared": 16, "actualSavedEditProfiles": 4, "nativeOrdinaryProfiles": 8, "controlledContractRegressions": 2}))
