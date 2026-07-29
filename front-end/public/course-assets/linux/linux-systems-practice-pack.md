# Linux Systems Practice Pack

These supplied cases provide deterministic evidence when a compatible VM, WSL2, sudo access, systemd, isolated networking, or permission to change system state is unavailable. All names, addresses, logs, and service data are fictional. Replace a supplied observation with live evidence only inside an owned disposable lab.

## Lab Readiness and Scope Case

```text
$ cat /etc/os-release
PRETTY_NAME="Ubuntu 26.04 LTS"
VERSION_ID="26.04"

$ uname -srm
Linux 6.20.0-lab-generic x86_64

$ id
uid=1000(learner) gid=1000(learner) groups=1000(learner),27(sudo)

$ ps -p 1 -o comm=
systemd

$ findmnt -no SOURCE,FSTYPE,TARGET /
/dev/vda2 ext4 /

$ ip -brief address
lo       UNKNOWN 127.0.0.1/8 ::1/128
ens3     UP      192.0.2.10/24
```

Scope record: owned disposable VM, user-mode NAT, snapshot `linux-systems-ready`, course workspace `/home/learner/linux-systems`, no production data, no public listener, and no host operating-system changes.

Identify the distribution, release, architecture, init system, active identity, filesystem, network boundary, workspace, missing readiness evidence, and exact reset route.

## Shell Pipeline and Exit Status Case

Directory fixture:

```text
reports/
├── app 1.log
├── app-2.log
├── empty.log
└── notes.txt
```

Log lines:

```text
2026-07-28T12:00:01Z INFO boot complete
2026-07-28T12:00:03Z WARNING retry scheduled
2026-07-28T12:00:08Z ERROR database unavailable
2026-07-28T12:00:09Z ERROR request rejected
```

Build a pipeline that searches only `*.log`, preserves filenames containing spaces, reports ERROR and WARNING counts, writes the summary separately from diagnostics, and records the exit status that determines whether the summary succeeded. Test zero, one, and multiple matches without deleting or rewriting the fixture.

## Filesystem Purpose and Path Case

Place each fictional artifact and explain owner, mutability, persistence, backup need, and consumer.

| Artifact                            | Candidate paths                                             |
| ----------------------------------- | ----------------------------------------------------------- |
| Nginx server block                  | `/etc/nginx/sites-available`, `/tmp`, home directory        |
| Served static content               | `/srv/signal-garden`, `/proc/signal-garden`, `/var/log`     |
| Application state database          | `/var/lib/signal-garden`, `/usr/bin`, `/dev`                |
| Application log                     | journal, `/var/log/signal-garden`, `/opt/signal-garden/bin` |
| Self-contained optional application | `/opt/signal-garden`, `/etc`, `/sys`                        |
| Runtime socket                      | `/run/signal-garden`, `/srv`, `/usr/share`                  |

For `/srv/signal-garden/public/index.html`, the service identity is `www-data`, the directory owner is `root:signal-web`, and proposed modes are `0750` on directories and `0640` on files. Determine whether `www-data` can traverse and read the complete path and identify the smallest correction if it cannot.

## Users Groups and Permissions Case

```text
drwxr-x--- root signal-web /srv/signal-garden
drwxr-s--- deploy signal-web /srv/signal-garden/releases
-rw-r----- deploy signal-web /srv/signal-garden/releases/index.html
```

Identity matrix:

| Identity   | Supplementary groups |
| ---------- | -------------------- |
| `deploy`   | `signal-web`         |
| `www-data` | `signal-web`         |
| `observer` | none                 |

Predict read, write, create, delete, and traverse outcomes for each identity. Then evaluate these proposed “fixes”: add `www-data` to the shared group, change the file to `0644`, recursively set everything to `0777`, change ownership to the service account, or adjust only one directory mode. Select the least-privilege correction and record original plus final state.

## Configuration Change and Rollback Case

Baseline unit excerpt:

```ini
[Service]
User=signal
WorkingDirectory=/srv/signal-garden/current
ExecStart=/usr/bin/python3 /srv/signal-garden/current/app.py
EnvironmentFile=/etc/signal-garden/env
Restart=on-failure
```

Proposed edit:

```diff
-WorkingDirectory=/srv/signal-garden/current
+WorkingDirectory=/srv/signal-garden/releases/2026-07-28
-Restart=on-failure
+Restart=always
```

The new release directory is absent and the change was made directly in the active file without a baseline copy. Write the safe change sequence: active-file and precedence check, baseline, targeted edit, diff, unit verification, directory check, daemon reload, service action, behavior check, and rollback. Keep environment values out of the submitted record.

## Process State and Signal Case

```text
USER      PID  PPID STAT TTY      TIME COMMAND
learner  4120  4011 S+   pts/2 00:00:00 python3 toy_worker.py
learner  4177  4011 T    pts/2 00:00:00 bash task.sh
signal   5002     1 Ssl  ?     00:00:02 python3 /srv/signal/app.py
root       91     2 I<   ?     00:00:00 [kworker/0:1H]
```

The lab owns PIDs 4120 and 4177 only. Explain PID, PPID, owner, state, terminal relationship, and likely supervisor for each row. Resume the stopped shell job, move one toy process between foreground and background, and choose a graceful signal for the toy worker. Explain why name-wide or forceful termination is not the first action.

## Systemd Service and Failure Case

```ini
[Unit]
Description=Signal Garden toy service
After=network.target

[Service]
Type=simple
User=signal
WorkingDirectory=/srv/signal-garden/current
ExecStart=/usr/bin/python3 app.py
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```text
$ systemctl status signal-garden.service
Loaded: loaded (/etc/systemd/system/signal-garden.service; disabled)
Active: failed (Result: exit-code)
Process: 2311 ExecStart=/usr/bin/python3 app.py (code=exited, status=200/CHDIR)
```

Diagnose the first failure, identify a second risk in the relative `ExecStart`, distinguish `daemon-reload`, reload, restart, and enablement, and write a disable-stop-remove-reset rollback. The repaired service runs as `signal`, binds only to loopback, and logs to the journal.

## Journal and Observability Case

```text
12:02:01 systemd[1]: Started signal-garden.service.
12:02:01 signal-garden[2410]: version=1.3 port=8080
12:02:04 signal-garden[2410]: ERROR cannot read /srv/signal-garden/data/items.json
12:02:04 systemd[1]: signal-garden.service: Main process exited, status=1/FAILURE
12:02:04 systemd[1]: signal-garden.service: Scheduled restart job, restart counter is at 1.
12:02:05 signal-garden[2414]: ERROR cannot read /srv/signal-garden/data/items.json
```

Build a bounded incident timeline using unit and time filters. Separate symptom, first relevant event, likely cause, rejected hypotheses, correction, and retest. The supplied file is owned by `root:root` with mode `0600`; the service runs as `signal`. Include only the minimum redacted lines needed to support the diagnosis.

## Scheduler and Automation Case

Manual shell environment:

```text
PATH=/home/learner/bin:/usr/local/bin:/usr/bin:/bin
BACKUP_SOURCE=/home/learner/linux-systems/data
```

Scheduled environment:

```text
PATH=/usr/bin:/bin
BACKUP_SOURCE is unset
```

Cron entry:

```cron
*/2 * * * * backup_home.sh >> backup.log 2>&1
```

Timer excerpt:

```ini
[Timer]
OnCalendar=*:0/2
Persistent=true
```

Identify why the manual run succeeds while cron fails. Specify absolute paths, explicit environment handling, output destination, exit behavior, overlap lock, retention, manual reduced-environment test, temporary schedule observation, and cleanup. Compare what cron and a systemd timer expose for run state and logs.

## Package Source and Update Case

```text
$ apt-cache policy nginx
Installed: 1.28.0-1ubuntu2
Candidate: 1.28.0-1ubuntu2.1
Version table:
 *** 1.28.0-1ubuntu2 100
        100 /var/lib/dpkg/status
     1.28.0-1ubuntu2.1 500
        500 http://archive.ubuntu.example/ubuntu resolute-updates/main amd64 Packages

$ apt-get -s install nginx
The following packages will be upgraded:
  nginx nginx-common
2 upgraded, 0 newly installed, 0 to remove.
```

The hostname is intentionally fictional. Record distribution, repository class, installed and candidate versions, architecture, dependencies, affected files or services, simulation result, free-space check, snapshot, validation, and rollback. Reject an alternative instruction that pipes an unverified internet script into a root shell.

## Network State and Diagnostics Case

```text
$ ip -brief address
lo   UNKNOWN 127.0.0.1/8 ::1/128
ens3 UP      192.0.2.10/24

$ ip route
default via 192.0.2.1 dev ens3
192.0.2.0/24 dev ens3 proto kernel scope link src 192.0.2.10

$ ss -ltnp
LISTEN 0 128 127.0.0.1:8080 0.0.0.0:* users:(("python3",pid=2410,fd=3))

$ dig +short app.lab.example
192.0.2.10

$ curl -i http://127.0.0.1:8080/health
HTTP/1.1 503 Service Unavailable
```

The VM address and name use documentation ranges. Diagnose interface, route, resolution, listener, process, transport, and application layers in order. Identify the first failing layer and explain why scanning neighboring addresses or opening the listener publicly would not clarify the 503 response.

## Web Server and Reverse Proxy Case

```nginx
server {
	listen 127.0.0.1:8088;
	server_name app.lab.example;

	location / {
		proxy_pass http://127.0.0.1:8080;
	}
}
```

```text
$ nginx -t
syntax is ok
test is successful

$ curl -i -H 'Host: app.lab.example' http://127.0.0.1:8088/health
HTTP/1.1 502 Bad Gateway

$ ss -ltnp | grep 8080
<no output>
```

Explain the difference between static serving and reverse proxying, identify the 502 cause, name the expected server and upstream process identities, and specify validation, reload, request, log, and rollback checks. Compare the same site boundary with an Apache virtual host without exposing either server publicly.

## Backup Restore and Capacity Case

Source manifest:

```text
config/app.ini         182 bytes  sha256:aaa...
data/items.json       4096 bytes  sha256:bbb...
public/index.html      734 bytes  sha256:ccc...
tmp/session.lock        12 bytes  excluded
logs/current.log     12000 bytes  excluded
```

Capacity:

```text
Filesystem      Size  Used Avail Use% Mounted on
/dev/vdb1       2.0G  1.9G   45M  98% /mnt/backup
```

The planned archive plus temporary output needs 80 MB. Decide whether the run may start, specify failure-safe temporary naming, retention, manifest and integrity evidence, and restore into `/home/learner/restore-check` without overwriting the source. Explain how the last trusted archive survives an interrupted or out-of-space run.

## Operations Capstone Incident Case

Target state:

- `signal-garden.service` runs as `signal`.
- Application code is read-only to the service under `/srv/signal-garden/current`.
- Health is available at `127.0.0.1:8080/health`.
- Nginx proxies locally from `127.0.0.1:8088`.
- `signal-garden-backup.timer` creates validated archives under the course workspace.
- The runbook includes exact versions, scope, verification, rollback, and limitations.

Injected incident:

1. A deployment changes the service working directory to a nonexistent release.
2. systemd restarts the service three times.
3. Nginx returns 502.
4. The most recent backup file ends in `.partial`.
5. The previous validated backup remains present.

Produce a diagnosis from service status, journal timeline, listening sockets, local requests, backup manifest, and restore check. Correct the working directory, preserve the trusted backup, remove the partial output, retest the full path, and demonstrate disable-stop-remove plus snapshot rollback.
