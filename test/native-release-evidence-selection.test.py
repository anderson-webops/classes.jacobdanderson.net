"""Verify the native evidence reader rejects unrelated or unauthenticated producers."""
from pathlib import Path
import copy
import importlib.util
import unittest

spec = importlib.util.spec_from_file_location("native_release_evidence", Path(__file__).parents[1] / "scripts/verify-native-release-evidence.py")
reader = importlib.util.module_from_spec(spec)
spec.loader.exec_module(reader)


class ProducerSelection(unittest.TestCase):
    def setUp(self):
        self.repo = "anderson-webops/classes.jacobdanderson.net"
        self.sha = "1" * 64
        self.run = dict(id=123, repository=dict(full_name=self.repo, id=9),
                        path=".github/workflows/native-release.yml", status="completed",
                        conclusion="success", event="push", head_branch="v2.8.185", head_sha="a" * 40)
        self.artifact = dict(id=456, name="attested-native-release", expired=False,
                             digest="sha256:" + self.sha, size_in_bytes=1000,
                             workflow_run=dict(id=123, head_sha="a" * 40, repository_id=9, head_repository_id=9))
        self.ref = dict(ref="refs/tags/v2.8.185", object=dict(type="tag", sha="b" * 40))
        self.annotated = dict(tag="v2.8.185", sha="b" * 40, object=dict(type="commit", sha="a" * 40))

    def select(self):
        return reader.validate_producer(self.repo, self.run, self.artifact, self.sha, 123, 456, self.ref, self.annotated)

    def test_exact_successful_annotated_producer(self):
        self.assertEqual(self.select()["head"], "a" * 40)

    def test_rejects_wrong_or_incomplete_producers(self):
        cases = [
            ("run", ("path",), ".github/workflows/ci.yml"),
            ("run", ("status",), "in_progress"),
            ("run", ("conclusion",), "failure"),
            ("run", ("event",), "pull_request"),
            ("run", ("head_branch",), "main"),
            ("run", ("repository", "full_name"), "other/repository"),
            ("artifact", ("name",), "native-release"),
            ("artifact", ("expired",), True),
            ("artifact", ("digest",), "sha256:" + "2" * 64),
            ("artifact", ("workflow_run", "id"), 999),
            ("artifact", ("workflow_run", "head_repository_id"), 10),
            ("artifact", ("workflow_run", "head_sha"), "c" * 40),
            ("ref", ("object", "type"), "commit"),
            ("annotated", ("object", "sha"), "d" * 40),
            ("annotated", ("tag",), "v2.8.184"),
        ]
        for item, path, value in cases:
            with self.subTest(item=item, path=path):
                self.setUp()
                target = getattr(self, item)
                for key in path[:-1]:
                    target = target[key]
                target[path[-1]] = value
                with self.assertRaises(AssertionError):
                    self.select()


if __name__ == "__main__":
    unittest.main()

