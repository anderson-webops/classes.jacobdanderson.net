"""Verify original and actual browser-edited Cargo ZIPs with the pinned native checks."""
import argparse
import datetime
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import signal
import subprocess
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--exports", type=Path, required=True)
parser.add_argument("--browser", type=Path, required=True)
parser.add_argument("--proof", type=Path, required=True)
args = parser.parse_args()
args.proof = args.proof.resolve()
assert not args.proof.exists()
OUT = args.proof.parent
OUT.mkdir(parents=True, exist_ok=True)
fixture = json.loads((ROOT / "test/fixtures/rust-cargo-contracts.json").read_text())
assert fixture["revision"] == "54e4b74c556375f5f57c8fd52d23878aedca255f"
pack = fixture["pack"]
source = {name: row["content"].encode() for name, row in fixture["files"].items()}
assert len(source) == 16
assert all(hashlib.sha256(raw).hexdigest() == fixture["files"][name]["sha256"] for name, raw in source.items())
browser = json.loads((args.browser / "rust-cargo-course-proof.json").read_text())["profiles"]
assert len(browser) == 4
assert {(row["role"], row["width"]) for row in browser} == {(role, width) for role in ("starter", "solution") for width in (390, 1280)}


def stop(signum, _frame):
    raise SystemExit(128 + signum)


signal.signal(signal.SIGINT, stop)
signal.signal(signal.SIGTERM, stop)


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def selected(role):
    return {name.removeprefix(pack + "/"): raw for name, raw in source.items()
            if name == pack + "/README.md" or name.startswith(pack + "/" + role + "/")}


def exported(path, expected):
    raw = path.read_bytes()
    with zipfile.ZipFile(path) as z:
        names = z.namelist()
        assert len(names) == len(set(names)) == len(expected) == 7
        for name in names:
            parsed = PurePosixPath(name)
            assert not parsed.is_absolute() and ".." not in parsed.parts
        for name, value in expected.items():
            matches = [entry for entry in names if entry.endswith("/" + name)]
            assert len(matches) == 1 and z.read(matches[0]) == value, name
    return digest(raw)


def run(command, cwd, label, env):
    entry = dict(parentTaskId="rust-cargo-site-export", parentPid=os.getpid(), command=command,
                 cwd=str(cwd), startTime=datetime.datetime.now(datetime.UTC).isoformat(), timeoutSeconds=240)
    child = subprocess.Popen(command, cwd=cwd, env=env, stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE, start_new_session=True)
    entry["pid"] = child.pid
    log = OUT / "wrapper-processes.jsonl"
    with log.open("a") as stream:
        stream.write(json.dumps(dict(entry, event="start")) + "\n")
    stdout, stderr = b"", b""
    cleanup = "owned process exited"
    try:
        stdout, stderr = child.communicate(timeout=240)
    except BaseException:
        if child.poll() is None:
            os.killpg(child.pid, signal.SIGTERM)
            try:
                stdout, stderr = child.communicate(timeout=5)
            except subprocess.TimeoutExpired:
                os.killpg(child.pid, signal.SIGKILL)
                stdout, stderr = child.communicate()
        cleanup = "owned process group terminated and reaped"
        raise
    finally:
        with log.open("a") as stream:
            stream.write(json.dumps(dict(entry, event="end", endTime=datetime.datetime.now(datetime.UTC).isoformat(),
                                         exitCode=child.returncode, childProcessGroupCleanup=cleanup)) + "\n")
        (OUT / (label + ".stdout.txt")).write_bytes(stdout)
        (OUT / (label + ".stderr.txt")).write_bytes(stderr)
    assert child.returncode == 0, stderr.decode(errors="replace")


original_zips = {role: exported(args.exports / (role + ".zip"), selected(role)) for role in ("starter", "solution")}
variants = []
with tempfile.TemporaryDirectory(prefix="rust-cargo-site-export-") as temporary:
    work = Path(temporary)
    for width in (None, 390, 1280):
        label = "original" if width is None else "saved-" + str(width)
        files = dict(source)
        browser_archives = []
        for role in ("starter", "solution"):
            expected = selected(role)
            if width is not None:
                row = next(item for item in browser if item["role"] == role and item["width"] == width)
                assert row["revision"] == fixture["revision"]
                assert all(row[key] for key in ("consentBeforeFetch", "primaryStoreRead", "codeAndTraceSaved", "sameAttemptReused", "previousWorkPreserved", "nativeInstructions"))
                assert row["remoteWrites"] == row["additionalSourceRequests"] == 0
                assert len(row["continuationActions"]) == 3
                for name in (role + "/src/main.rs", role + "/observations.md"):
                    note = (f"\n/* Independent cargo observation {width} */\n" if name.endswith(".rs")
                            else f"\n# Independent cargo observation {width}\n")
                    expected[name] += note.encode()
                archive = args.browser / row["editedArchive"]
                assert exported(archive, expected) == row["editedArchiveSha256"]
                assert {name: digest(raw) for name, raw in expected.items()} == {item["name"]: item["sha256"] for item in row["editedFiles"]}
                browser_archives.append(dict(role=role, width=width, archive=archive.name, sha256=digest(archive.read_bytes())))
            for name, raw in expected.items():
                files[pack + "/" + name] = raw
        directory = work / label
        directory.mkdir()
        for name, raw in files.items():
            target = directory / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(raw)
        proof_path = OUT / label / "proof.json"
        env = {**os.environ, "SOURCE_REVISION": fixture["revision"]}
        run(["python3", str(directory / "test/verify_rust_cargo_tooling.py"), "--proof", str(proof_path)], directory, label, env)
        proof = json.loads(proof_path.read_text())
        assert proof["sourceRevision"] == fixture["revision"]
        assert proof["sourceFiles"] == {name: digest(raw) for name, raw in files.items()}
        assert len(proof["commands"]) == 122 and len(proof["roles"]) == 2
        assert proof["allSourceFilesUnchanged"] and proof["temporarySourceCleanup"]
        assert all(row["cases"] == 42 and row["unitTests"] == 3 for row in proof["roles"])
        variants.append(dict(name=label, baseSourceRevision=fixture["revision"], browserArchives=browser_archives,
                             sourceFiles=proof["sourceFiles"], nativeProofSha256=digest(proof_path.read_bytes()),
                             commands=122, independentInputCases=84, worksheetCompletionNotInferred=True))
assert not work.exists()
result = dict(baseSourceRevision=fixture["revision"], originalRoleZIPs=original_zips, nativeVariants=variants,
              actualBrowserProfiles=4, savedContinuationActions=12, selectedFilesPerRole=7,
              exactOriginalAndSavedSources=True, nativeCommands=366, independentInputCases=252,
              noExternalDependencyDownloadsDuringChecks=True, temporarySourceCleanup=True,
              learnerWorksheetCompletionNotInferred=True)
args.proof.write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps(dict(nativeVariants=3, nativeCommands=366, independentInputCases=252, temporarySourceCleanup=True)))
