import os
from pathlib import Path
import pwd
import subprocess
import sys
import tempfile
import unittest


class NativeCandidateOwnershipTests(unittest.TestCase):
    def test_root_snapshot_is_independent_and_readable_by_runtime(self):
        self.assertEqual(os.geteuid(), 0, "Run this isolated Linux fixture as root")
        runtime = pwd.getpwnam("nobody")
        helper = Path(__file__).resolve().parents[1] / "scripts/snapshot-native-candidate.py"
        with tempfile.TemporaryDirectory(prefix="classes-ownership-", dir="/root") as temporary:
            base = Path(temporary)
            source = base / "trusted-source"
            releases = base / "releases"
            candidates = releases / ".candidates"
            source.mkdir()
            candidates.mkdir(parents=True)
            name = "v2.8.1-" + "a" * 40
            incoming = candidates / name
            incoming.mkdir()
            payload = incoming / "runtime-fixture.txt"
            payload.write_text("synthetic runtime bytes")
            payload.chmod(0o600)
            for entry in [candidates, incoming, payload]:
                os.chown(entry, runtime.pw_uid, runtime.pw_gid)
            copied = Path(subprocess.check_output([
                sys.executable, "-B", str(helper), "--source", str(source),
                "--releases", str(releases), "--name", name
            ], text=True).strip())
            self.assertEqual(copied.parent.stat().st_mode & 0o777, 0o700)
            self.assertEqual((copied / payload.name).stat().st_uid, 0)
            self.assertNotEqual(
                (copied / payload.name).stat().st_ino,
                (copied.parent / "incoming" / payload.name).stat().st_ino
            )
            with tempfile.TemporaryDirectory(prefix="classes-readable-", dir="/var/tmp") as visible:
                visible_root = Path(visible)
                visible_root.chmod(0o755)
                final = visible_root / name
                copied.rename(final)
                result = subprocess.run([
                    sys.executable, "-I", "-c",
                    "import os, pathlib, sys; "
                    "target = pathlib.Path(sys.argv[1]); "
                    "assert target.read_text() == 'synthetic runtime bytes'; "
                    "assert not os.access(target, os.W_OK); "
                    "assert not os.access(target.parent, os.W_OK)",
                    str(final / payload.name)
                ], user=runtime.pw_uid, group=runtime.pw_gid, extra_groups=[],
                    capture_output=True, text=True, check=False)
                self.assertEqual(result.returncode, 0, result.stderr)


if __name__ == "__main__":
    unittest.main()
