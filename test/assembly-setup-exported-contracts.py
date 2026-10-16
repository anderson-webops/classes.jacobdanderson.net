"""Verify exact browser exports and execute their saved setup build edits."""
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
fixtures = json.loads((ROOT / "test/fixtures/assembly-setup-contracts.json").read_text())
verifier = json.loads((ROOT / "test/fixtures/assembly-setup-source-verifier.json").read_text())
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
            stream.write(json.dumps({"parentTaskId": "assembly-setup-site-export", "command": command, "cwd": str(cwd), "pid": child.pid, "startTime": started, "endTime": datetime.datetime.now(datetime.UTC).isoformat(), "exitCode": child.returncode, "timeoutSeconds": 240, "childProcessGroupCleanup": cleanup}) + "\n")
    prefix = args.proof.parent / (args.cc + "-wrapper-" + str(child.pid))
    prefix.with_suffix(".stdout.txt").write_bytes(out)
    prefix.with_suffix(".stderr.txt").write_bytes(err)
    assert child.returncode == 0 if expected == 0 else child.returncode != 0, (command, child.returncode, err.decode(errors="replace"))
    return out, err


def entries(path, expected):
    with zipfile.ZipFile(path) as archive:
        assert len(archive.namelist()) == len(expected) == 7
        result = {}
        for name in expected:
            matches = [path for path in archive.namelist() if path.endswith("/" + name)]
            assert len(matches) == 1
            result[name] = archive.read(matches[0])
        return result


export_hashes = {}
edited_profiles = []
with tempfile.TemporaryDirectory(prefix="assembly-setup-export-") as temporary:
    root = Path(temporary)
    for fixture in fixtures:
        assert fixture["revision"] == verifier["revision"]
        pack = fixture["pack"]
        for role in ("starter", "solution"):
            expected = {path.removeprefix(pack + "/"): file for path, file in fixture["files"].items() if path.startswith(pack + "/" + role + "/") or path == pack + "/README.md"}
            original = entries(args.archives / (pack + "-" + role + ".zip"), expected)
            for name, data in original.items():
                assert data.decode() == expected[name]["content"]
                assert hashlib.sha256(data).hexdigest() == expected[name]["sha256"]
                path = root / pack / name
                path.parent.mkdir(parents=True, exist_ok=True)
                if path.exists():
                    assert path.read_bytes() == data
                path.write_bytes(data)
                export_hashes[pack + "/" + name] = expected[name]["sha256"]
            task = role + ("/routine.S" if fixture["mode"] == "symbols" else "/CMakeLists.txt")
            before, after = (("# TODO: export lab_answer to the separately compiled C caller", ".globl lab_answer") if role == "starter" else (".globl lab_answer", "# saved local-symbol regression")) if fixture["mode"] == "symbols" else (('set(LAB_ASM_LANGUAGE "assembler"', 'set(LAB_ASM_LANGUAGE "assembler-with-cpp"') if role == "starter" else ('set(LAB_ASM_LANGUAGE "assembler-with-cpp"', 'set(LAB_ASM_LANGUAGE "assembler"'))
            assert original[task].decode().count(before) == 1
            changed = dict(original)
            changed[task] = original[task].decode().replace(before, after, 1).encode()
            for width in (1280, 360):
                for theme in ("light", "dark"):
                    actual = entries(args.archives / (pack + "-" + role + "-edited-" + str(width) + "-" + theme + ".zip"), expected)
                    assert actual == changed
            directory = root / (fixture["mode"] + "-saved-" + role)
            directory.mkdir()
            for name, data in changed.items():
                if name.startswith(role + "/"):
                    (directory / name.removeprefix(role + "/")).write_bytes(data)
            run(["cmake", "-S", ".", "-B", "build", "-DCMAKE_BUILD_TYPE=Debug", "-DCMAKE_C_COMPILER=" + args.cc, "-DCMAKE_ASM_COMPILER=" + args.cc], directory)
            run(["cmake", "--build", "build", "--verbose", "--parallel", "1"], directory, expected=0 if role == "starter" else 1)
            if role == "starter":
                run(["ctest", "--test-dir", "build", "--output-on-failure"], directory)
                stdout, _ = run([str(directory / "build/app")], directory)
                assert stdout == ("answer=" + str(42 if fixture["mode"] == "symbols" else 41) + "\n").encode()
            else:
                assert not (directory / "build/app").exists()
            edited_profiles.append({"mode": fixture["mode"], "role": role, "browserWidths": 2, "browserThemes": 2, "completedLearner": role == "starter", "referenceRegressionRefused": role == "solution"})
    path = root / verifier["path"]
    path.parent.mkdir()
    path.write_text(verifier["content"])
    run(["python3", str(path), "--cc", args.cc, "--proof", str(args.proof)], root)
    receipt = json.loads(args.proof.read_text())
    assert receipt["sourceFiles"] == export_hashes
    assert receipt["nativeExecuted"] and receipt["sourceUnchanged"]
    assert receipt["nativeSuccessfulProfiles"] == 6 and receipt["actualLinkFailures"] == 4 and receipt["configurationRefusals"] == 2
    receipt.update(sourceRevision=verifier["revision"], exactBrowserSourceFiles=26, actualSavedEditProfiles=edited_profiles, editedArchivesCompared=16, temporarySourceCleanup=True)
assert not root.exists()
args.proof.write_text(json.dumps(receipt, indent=2) + "\n")
print(json.dumps({"compiler": args.cc, "exactBrowserSourceFiles": 26, "editedArchivesCompared": 16, "actualSavedEditProfiles": 4, "nativeSuccessfulProfiles": 6, "actualLinkFailures": 4, "configurationRefusals": 2}))
