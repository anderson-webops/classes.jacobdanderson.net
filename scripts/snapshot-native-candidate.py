import argparse
import os
from pathlib import Path
import re
import stat
import sys
import tempfile


DIRECTORY_FLAGS = os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW
FILE_FLAGS = os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK


def open_trusted_directory(path, owner=0):
    if not os.path.isabs(path):
        raise ValueError("Trusted directories must be absolute")
    descriptor = os.open("/", DIRECTORY_FLAGS)
    try:
        for component in Path(path).parts[1:]:
            next_descriptor = os.open(component, DIRECTORY_FLAGS, dir_fd=descriptor)
            os.close(descriptor)
            descriptor = next_descriptor
            metadata = os.fstat(descriptor)
            if metadata.st_uid != owner or metadata.st_mode & 0o022:
                raise ValueError("Trusted directory is not root-owned and protected")
        return descriptor
    except BaseException:
        os.close(descriptor)
        raise


def verify_trusted_tree(descriptor, owner=0):
    for name in os.listdir(descriptor):
        metadata = os.stat(name, dir_fd=descriptor, follow_symlinks=False)
        if metadata.st_uid != owner or metadata.st_mode & 0o022:
            raise ValueError("Source checkout is not root-owned and protected")
        if stat.S_ISDIR(metadata.st_mode):
            child = os.open(name, DIRECTORY_FLAGS, dir_fd=descriptor)
            try:
                verify_trusted_tree(child, owner)
            finally:
                os.close(child)
        elif not stat.S_ISREG(metadata.st_mode) or metadata.st_nlink != 1:
            raise ValueError("Trusted source contains a link or unsupported entry")


def copy_tree(source, destination):
    for name in os.listdir(source):
        metadata = os.stat(name, dir_fd=source, follow_symlinks=False)
        if stat.S_ISDIR(metadata.st_mode):
            child_source = os.open(name, DIRECTORY_FLAGS, dir_fd=source)
            try:
                os.mkdir(name, mode=0o755, dir_fd=destination)
                child_destination = os.open(name, DIRECTORY_FLAGS, dir_fd=destination)
                try:
                    copy_tree(child_source, child_destination)
                    os.fchmod(child_destination, 0o755)
                finally:
                    os.close(child_destination)
            finally:
                os.close(child_source)
        elif stat.S_ISREG(metadata.st_mode):
            file_source = os.open(name, FILE_FLAGS, dir_fd=source)
            try:
                opened = os.fstat(file_source)
                if not stat.S_ISREG(opened.st_mode):
                    raise ValueError("Candidate entry is not a regular file")
                if (metadata.st_dev, metadata.st_ino) != (opened.st_dev, opened.st_ino):
                    raise ValueError("Candidate entry changed during snapshot")
                if opened.st_nlink != 1:
                    raise ValueError("Candidate contains a hard link")
                mode = 0o755 if opened.st_mode & 0o111 else 0o644
                file_destination = os.open(
                    name, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW,
                    mode, dir_fd=destination
                )
                try:
                    while chunk := os.read(file_source, 1024 * 1024):
                        remaining = memoryview(chunk)
                        while remaining:
                            written = os.write(file_destination, remaining)
                            remaining = remaining[written:]
                    os.fchmod(file_destination, mode)
                finally:
                    os.close(file_destination)
            finally:
                os.close(file_source)
        else:
            raise ValueError("Candidate contains a symlink or unsupported entry")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--releases", required=True)
    parser.add_argument("--name", required=True)
    arguments = parser.parse_args()
    if os.geteuid() != 0:
        raise ValueError("Snapshot native candidates as root")
    if not re.fullmatch(r"v2\.\d+\.\d+-[a-f0-9]{40}", arguments.name):
        raise ValueError("Invalid candidate release name")
    trusted_source = open_trusted_directory(arguments.source)
    try:
        verify_trusted_tree(trusted_source)
    finally:
        os.close(trusted_source)
    releases = open_trusted_directory(arguments.releases)
    try:
        candidates = os.open(".candidates", DIRECTORY_FLAGS, dir_fd=releases)
        try:
            quarantine = tempfile.mkdtemp(prefix=".quarantine-", dir=arguments.releases)
            print(f"Protected candidate evidence: {quarantine}", file=sys.stderr)
            quarantine_descriptor = os.open(quarantine, DIRECTORY_FLAGS)
            try:
                os.rename(arguments.name, "incoming", src_dir_fd=candidates,
                          dst_dir_fd=quarantine_descriptor)
                source = os.open("incoming", DIRECTORY_FLAGS, dir_fd=quarantine_descriptor)
                try:
                    os.mkdir(arguments.name, mode=0o755, dir_fd=quarantine_descriptor)
                    destination = os.open(arguments.name, DIRECTORY_FLAGS,
                                          dir_fd=quarantine_descriptor)
                    try:
                        copy_tree(source, destination)
                        os.fchmod(destination, 0o755)
                    finally:
                        os.close(destination)
                finally:
                    os.close(source)
            finally:
                os.close(quarantine_descriptor)
        finally:
            os.close(candidates)
    finally:
        os.close(releases)
    print(os.path.join(quarantine, arguments.name))


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError):
        sys.exit("Native candidate snapshot rejected; no live configuration was changed.")
