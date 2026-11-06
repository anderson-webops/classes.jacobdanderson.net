"""Authenticate and inspect an unchanged tagged CI native release."""
from pathlib import Path, PurePosixPath
from datetime import datetime, timezone
import argparse
import hashlib
import json
import os
import re
import signal
import subprocess
import tarfile
import tempfile
import zipfile

REPOSITORIES = {"anderson-webops/classes.jacobdanderson.net", "instruction-material/classes.jacobdanderson.net"}


def now():
    return datetime.now(timezone.utc).isoformat()


def digest(path):
    result = hashlib.sha256()
    with Path(path).open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            result.update(block)
    return result.hexdigest()


def command(argv, output, cwd=None, timeout=180, destination=None):
    output.mkdir(parents=True, exist_ok=True)
    started = now()
    stream = Path(destination).open("xb") if destination else None
    child = subprocess.Popen(argv, cwd=cwd, stdout=stream or subprocess.PIPE, stderr=subprocess.PIPE, start_new_session=True)
    event = dict(parentTask="native-release-evidence-" + os.environ.get("GITHUB_RUN_ID", "local"),
                 parentPid=os.getpid(), cwd=str(cwd or Path.cwd()), command=argv,
                 pid=child.pid, startTime=started, timeoutSeconds=timeout)
    log = output / "processes.jsonl"
    with log.open("a") as target:
        target.write(json.dumps(dict(event, event="start")) + "\n")
    cleanup = "process exited"
    try:
        result, error = child.communicate(timeout=timeout)
    except BaseException:
        cleanup = "process group terminated and reaped"
        if child.poll() is None:
            os.killpg(child.pid, signal.SIGTERM)
            try:
                child.communicate(timeout=3)
            except subprocess.TimeoutExpired:
                os.killpg(child.pid, signal.SIGKILL)
                child.communicate()
        raise
    finally:
        if stream:
            stream.close()
        with log.open("a") as target:
            target.write(json.dumps(dict(event, event="end", endTime=now(),
                                         exitCode=child.returncode,
                                         childProcessGroupCleanup=cleanup)) + "\n")
    assert child.returncode == 0, error.decode(errors="replace")
    return result or b""


def validate_producer(repo, run, artifact, expected, run_id, artifact_id, ref, annotated):
    assert repo in REPOSITORIES
    assert run["id"] == run_id and artifact["id"] == artifact_id
    assert run["repository"]["full_name"] == repo
    assert run["path"] == ".github/workflows/native-release.yml"
    assert run["status"] == "completed" and run["conclusion"] == "success" and run["event"] == "push"
    tag, head = run["head_branch"], run["head_sha"]
    assert re.fullmatch(r"v2\.\d+\.\d+", tag) and re.fullmatch(r"[0-9a-f]{40}", head)
    assert artifact["name"] == "attested-native-release" and not artifact["expired"]
    assert artifact["digest"] == "sha256:" + expected and 0 < artifact["size_in_bytes"] < 2_147_483_648
    producer = artifact["workflow_run"]
    assert producer["id"] == run_id and producer["head_sha"] == head
    assert producer["repository_id"] == producer["head_repository_id"] == run["repository"]["id"]
    assert ref["ref"] == "refs/tags/" + tag and ref["object"]["type"] == "tag"
    assert annotated["tag"] == tag and annotated["sha"] == ref["object"]["sha"]
    assert annotated["object"]["type"] == "commit" and annotated["object"]["sha"] == head
    return dict(repository=repo, tag=tag, head=head, run=run_id, artifact=artifact_id,
                artifactSize=artifact["size_in_bytes"], artifactDigest=artifact["digest"],
                tagObject=ref["object"]["sha"])


def describe(args, output):
    repo = os.environ.get("GITHUB_REPOSITORY", "")
    assert repo in REPOSITORIES and re.fullmatch(r"[0-9a-f]{64}", args.sha256)
    api = lambda route: json.loads(command(["gh", "api", route, "-H", "Cache-Control: no-cache"], output))
    run = api(f"repos/{repo}/actions/runs/{args.run_id}")
    artifact = api(f"repos/{repo}/actions/artifacts/{args.artifact_id}")
    tag = run["head_branch"]
    assert re.fullmatch(r"v2\.\d+\.\d+", tag)
    ref = api(f"repos/{repo}/git/ref/tags/{tag}")
    assert ref["object"]["type"] == "tag"
    annotated = api(f"repos/{repo}/git/tags/{ref['object']['sha']}")
    meta = validate_producer(repo, run, artifact, args.sha256, args.run_id, args.artifact_id, ref, annotated)
    (output / "producer.json").write_text(json.dumps(meta, indent=2) + "\n")
    if os.environ.get("GITHUB_OUTPUT"):
        with Path(os.environ["GITHUB_OUTPUT"]).open("a") as target:
            target.write("tag=" + meta["tag"] + "\ncommit=" + meta["head"] + "\n")
    return meta


def download(meta, work, output):
    archive = work / "native.zip"
    command(["gh", "api", f"repos/{meta['repository']}/actions/artifacts/{meta['artifact']}/zip"],
            output, timeout=240, destination=archive)
    assert archive.stat().st_size == meta["artifactSize"]
    assert "sha256:" + digest(archive) == meta["artifactDigest"]
    expected = {"classes-native-linux-arm64.tar.gz", "classes-native-linux-arm64.manifest.json",
                "classes-native-linux-arm64.sigstore.json"}
    assets = {}
    with zipfile.ZipFile(archive) as zipped:
        assert len(zipped.infolist()) == 3 and set(zipped.namelist()) == expected
        for entry in zipped.infolist():
            assert not entry.is_dir()
            maximum = 2_147_483_648 if entry.filename.endswith(".tar.gz") else 33_554_432
            assert 0 < entry.file_size < maximum
            path = work / entry.filename
            with zipped.open(entry) as source, path.open("xb") as target:
                while block := source.read(1024 * 1024):
                    target.write(block)
            assert path.stat().st_size == entry.file_size
            assets[entry.filename] = dict(path=str(path), size=entry.file_size, sha256=digest(path))
    return dict(meta, sha256=digest(archive), assets=assets)


def verify(meta, trusted, work, output):
    P, R = output.resolve(), trusted.resolve()
    call = lambda argv, cwd=None, timeout=180: command(argv, P, cwd=cwd, timeout=timeout)
    git = lambda cwd, *argv: call(["git", "--no-optional-locks", "-c", "core.fsmonitor=false", *argv], cwd=cwd)
    assert git(R, "rev-parse", "HEAD").decode().strip() == meta["head"]
    assert git(R, "rev-parse", "refs/tags/" + meta["tag"]).decode().strip() == meta["tagObject"]
    assert git(R, "cat-file", "-t", "refs/tags/" + meta["tag"]).decode().strip() == "tag"
    assert not git(R, "status", "--porcelain")
    ns = dict(command=call, git=git, now=now)
    m = download(meta, work, P)
    tag = m["tag"]
    label = "canonical" if m["repository"].startswith("anderson-webops/") else "downstream"
    tag_record = dict(commit=meta["head"], repository=meta["repository"])

    assert m['tag'] == tag and m['head'] == tag_record['commit'] and m['repository'] == tag_record['repository']
    repo = m['repository']
    assets = m['assets']
    for name, item in assets.items():
        digest = hashlib.sha256()
        with Path(item['path']).open('rb') as source:
            for block in iter(lambda: source.read(1024 * 1024), b''):
                digest.update(block)
        assert digest.hexdigest() == item['sha256'] and Path(item['path']).stat().st_size == item['size']
    archive = Path(assets['classes-native-linux-arm64.tar.gz']['path'])
    manifest_bytes = Path(assets['classes-native-linux-arm64.manifest.json']['path']).read_bytes()
    manifest = json.loads(manifest_bytes)
    site_source = ns['git'](R, 'show', m['head']+':scripts/verify-native-release.mjs').decode()
    expected_site = re.search(r'const siteName = \"([^\"]+)\";', site_source).group(1)
    assert manifest['schemaVersion'] == 1 and manifest['site'] == expected_site
    assert manifest['tag'] == m['tag'] and manifest['revision'] == m['head']
    assert manifest['releaseId'] == m['tag'] + '-' + m['head']
    expected = manifest['files']
    assert isinstance(expected, dict) and len(expected) > 1000
    actual = {}
    links = {}
    seen = set()
    html = {}
    with tarfile.open(archive, mode='r|gz') as tar:
        for entry in tar:
            name = entry.name
            while name.startswith('./'):
                name = name[2:]
            if name == '.':
                assert entry.isdir()
                continue
            assert name and not name.startswith('/') and '..' not in PurePosixPath(name).parts
            assert name not in seen
            seen.add(name)
            assert entry.isdir() or entry.isreg() or entry.islnk(), ('Unsupported archive entry', name)
            if entry.isdir():
                continue
            if entry.islnk():
                target = entry.linkname
                while target.startswith('./'):
                    target = target[2:]
                assert name.startswith('back-end/node_modules/') and target.startswith('back-end/node_modules/')
                assert '..' not in PurePosixPath(target).parts and not target.startswith('/')
                assert expected[name] == expected[target]
                links[name] = target
                continue
            stream = tar.extractfile(entry)
            digest = hashlib.sha256()
            chunks = [] if name in ['.classes-native-release.json', 'front-end/dist/index.html', 'front-end/dist/404.html', 'front-end/dist/release.json'] else None
            for block in iter(lambda: stream.read(1024 * 1024), b''):
                digest.update(block)
                if chunks is not None:
                    chunks.append(block)
            if name == '.classes-native-release.json':
                assert b''.join(chunks) == manifest_bytes
            else:
                actual[name] = digest.hexdigest()
                if name == 'front-end/dist/release.json':
                    assert json.loads(b''.join(chunks)) == dict(version=m['tag'][1:], tag=m['tag'], commit=m['head'])
                if chunks is not None:
                    html[name] = b''.join(chunks)
    for name, target in links.items():
        visited = {name}
        while target in links:
            assert target not in visited
            visited.add(target)
            target = links[target]
        assert target in actual and actual[target] == expected[name]
        actual[name] = actual[target]
    assert actual == expected
    assert not links, 'Current native archives must contain no hard links'
    assert 'front-end/dist/release.json' in actual
    for forbidden in ['front-end/dist/.vite', 'front-end/dist/api/release', 'front-end/dist/api/release.html', 'front-end/dist/api/release/index.html']:
        assert not any(name == forbidden or name.startswith(forbidden + '/') for name in seen)
    assert b'Page not found' in html['front-end/dist/404.html'] and b'href="/"' in html['front-end/dist/404.html']
    assert actual['front-end/dist/404.html'] != actual['front-end/dist/index.html']
    for name in actual:
        if name.startswith('front-end/dist/') and name.endswith('.html') and name not in ['front-end/dist/index.html', 'front-end/dist/404.html']:
            assert name[:-5] + '/index.html' not in actual
    required = ['package.json', 'package-lock.json', 'front-end/package.json', 'back-end/package.json', 'back-end/package-lock.json', 'scripts/verify-native-source.sh', 'scripts/verify-native-release.mjs']
    trusted = required + sorted(name for name in actual if name.startswith('deploy/native/'))
    for name in trusted:
        blob = ns['git'](R, 'show', m['head'] + ':' + name)
        assert hashlib.sha256(blob).hexdigest() == actual[name], name
    maps = ns['git'](R, 'show', m['head'] + ':deploy/native/classes-http-maps.conf').decode()
    assert '/release.json "no-store";' in maps
    proofs = []
    bundle = Path(assets['classes-native-linux-arm64.sigstore.json']['path'])
    for name in ['classes-native-linux-arm64.tar.gz', 'classes-native-linux-arm64.manifest.json']:
        result = ns['command'](['gh', 'attestation', 'verify', assets[name]['path'], '--hostname', 'github.com', '--bundle', str(bundle), '--repo', repo, '--signer-workflow', repo+'/.github/workflows/native-release.yml', '--source-digest', m['head'], '--signer-digest', m['head'], '--source-ref', 'refs/tags/' + m['tag'], '--deny-self-hosted-runners', '--format', 'json'], cwd=R, timeout=180)
        assert json.loads(result)
        path = P / (label+'-'+tag+'-' + ('archive' if name.endswith('.tar.gz') else 'manifest') + '-attestation-verification-20261021.json')
        path.write_bytes(result)
        proofs.append(dict(subject=name, result=str(path), sha256=hashlib.sha256(result).hexdigest(), verified=True))
    record = dict(at=ns['now'](), repository=repo, tag=m['tag'], head=m['head'], artifact=m['artifact'], run=m['run'], downloadSha256=m['sha256'], assets=assets, payloadFiles=len(actual), intraPayloadHardlinksVerified=links, allPayloadDigestsMatch=True, embeddedManifestExact=True, trustedSourceFiles=len(trusted), branded404AndStaticRouteBoundary=True, provenanceVerified=True, proofs=proofs, accepted=True)
    (P / f'{label}-{tag}-independent-acceptance-20261021.json').write_text(json.dumps(record, indent=2) + '\n')
    print(json.dumps({key: value for key, value in record.items() if key not in ['assets', 'proofs']}, indent=2))

    record.update(inspectorCommit=os.environ.get("GITHUB_SHA"),
                  inspectorScriptSHA256=digest(Path(__file__)),
                  tagObject=meta["tagObject"], trustedCheckoutClean=True,
                  applicationBuildOrExecutionPerformed=False,
                  sourceVerificationPolicy="Full existing payload,route,source and signed-subject checks.")
    (P / f"{label}-{tag}-independent-acceptance-20261021.json").write_text(json.dumps(record, indent=2) + "\n")
    return record


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--run-id", type=int, required=True)
    parser.add_argument("--artifact-id", type=int, required=True)
    parser.add_argument("--sha256", required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--describe", action="store_true")
    parser.add_argument("--trusted", type=Path)
    args = parser.parse_args()
    assert args.run_id > 0 and args.artifact_id > 0
    output = args.output.resolve()
    output.mkdir(parents=True, exist_ok=True)
    meta = describe(args, output)
    if args.describe:
        print(json.dumps(meta))
        return
    assert args.trusted and args.trusted.is_dir()
    with tempfile.TemporaryDirectory(prefix="native-release-evidence-") as directory:
        record = verify(meta, args.trusted, Path(directory), output)
    print(json.dumps({key: record[key] for key in
                      ["repository", "tag", "head", "payloadFiles", "trustedSourceFiles", "accepted"]}))


if __name__ == "__main__":
    main()
