import importlib.util
import os
from pathlib import Path
import tempfile
import unittest


MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts/snapshot-native-candidate.py"
SPECIFICATION = importlib.util.spec_from_file_location("native_snapshot", MODULE_PATH)
snapshot = importlib.util.module_from_spec(SPECIFICATION)
SPECIFICATION.loader.exec_module(snapshot)


class NativeCandidateSnapshotTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.source = self.root / "incoming"
        self.destination = self.root / "snapshot"
        self.source.mkdir()
        self.destination.mkdir()

    def copy(self):
        source = os.open(self.source, snapshot.DIRECTORY_FLAGS)
        destination = os.open(self.destination, snapshot.DIRECTORY_FLAGS)
        try:
            snapshot.copy_tree(source, destination)
        finally:
            os.close(destination)
            os.close(source)

    def test_snapshot_has_independent_bytes_and_permissions(self):
        (self.source / "nested").mkdir()
        payload = self.source / "nested" / "payload"
        payload.write_bytes(b"approved synthetic bytes")
        payload.chmod(0o600)
        with payload.open("r+b") as old_handle:
            self.copy()
            old_handle.write(b"later fixture revision")
        copied = self.destination / "nested" / "payload"
        self.assertEqual(copied.read_bytes(), b"approved synthetic bytes")
        self.assertNotEqual(copied.stat().st_ino, payload.stat().st_ino)
        self.assertEqual(copied.stat().st_mode & 0o777, 0o644)
        self.assertEqual((self.destination / "nested").stat().st_mode & 0o777, 0o755)

    def test_executable_files_remain_readable_and_executable(self):
        executable = self.source / "synthetic-tool"
        executable.write_bytes(b"fixture")
        executable.chmod(0o700)
        self.copy()
        self.assertEqual((self.destination / executable.name).stat().st_mode & 0o777, 0o755)

    def test_symlinks_are_not_copied(self):
        (self.source / "link").symlink_to("missing-fixture")
        with self.assertRaisesRegex(ValueError, "symlink"):
            self.copy()
        self.assertEqual(list(self.destination.iterdir()), [])

    def test_hardlinks_are_rejected(self):
        original = self.root / "original"
        original.write_bytes(b"synthetic bytes")
        os.link(original, self.source / "linked")
        with self.assertRaisesRegex(ValueError, "hard link"):
            self.copy()
        self.assertEqual(list(self.destination.iterdir()), [])

    def test_special_files_are_rejected_without_opening_them(self):
        os.mkfifo(self.source / "pipe")
        with self.assertRaisesRegex(ValueError, "unsupported"):
            self.copy()

    def test_existing_destination_is_never_overwritten(self):
        (self.source / "payload").write_bytes(b"new")
        (self.destination / "payload").write_bytes(b"retained")
        with self.assertRaises(FileExistsError):
            self.copy()
        self.assertEqual((self.destination / "payload").read_bytes(), b"retained")

    def test_writable_or_linked_source_checkout_is_not_trusted(self):
        payload = self.source / "tool"
        payload.write_bytes(b"fixture")
        descriptor = os.open(self.source, snapshot.DIRECTORY_FLAGS)
        try:
            payload.chmod(0o644)
            snapshot.verify_trusted_tree(descriptor, owner=os.getuid())
            payload.chmod(0o664)
            with self.assertRaisesRegex(ValueError, "protected"):
                snapshot.verify_trusted_tree(descriptor, owner=os.getuid())
            payload.chmod(0o644)
            (self.source / "linked-tool").symlink_to("tool")
            with self.assertRaises(ValueError):
                snapshot.verify_trusted_tree(descriptor, owner=os.getuid())
        finally:
            os.close(descriptor)


if __name__ == "__main__":
    unittest.main()
