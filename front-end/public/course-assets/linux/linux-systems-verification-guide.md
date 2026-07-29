# Linux Systems Verification Guide

Compare this guide only after recording an independent command trace or supplied-case diagnosis. Equivalent commands and layouts are valid when the evidence proves the same state and recovery behavior. Never run a listed administrative action on a host, shared machine, public service, or production system.

## Lab Readiness and Scope Key

- The case is Ubuntu 26.04 LTS on x86-64 with systemd as PID 1, an ext4 root filesystem, and an unprivileged `learner` account that is a sudo-group member.
- Group membership does not prove a particular sudo command is authorized; the lab records capability without changing policy.
- `192.0.2.10` is a documentation address and does not establish public connectivity.
- The valid scope is the owned disposable VM with user-mode NAT and workspace under the learner home.
- Reset uses snapshot `linux-systems-ready`; file-level rollback is recorded separately for each later change.

## Shell Pipeline and Exit Status Key

- Restrict discovery to regular `*.log` files and preserve spaces with a null-delimited `find`/consumer route or an equally safe shell array.
- Count ERROR and WARNING separately and make the zero-match case explicit because `grep` can report no matches with a nonzero status.
- Diagnostics belong on standard error or a named diagnostic file; the summary belongs on standard output or its named output file.
- Capture the status immediately after the command whose result matters. A later `printf` cannot stand in for the pipeline's status.
- A valid test set includes no matches, one match, several matches, and the filename `app 1.log`.

## Filesystem Purpose and Path Key

- Server configuration belongs under `/etc`; served content can live under `/srv`; mutable application state belongs under `/var/lib`; logs use the journal or `/var/log`; optional self-contained software can use `/opt`; runtime sockets use `/run`.
- `/proc`, `/sys`, and `/dev` are not ordinary destinations for course content.
- Read access to `index.html` also requires traversal on `/srv`, `/srv/signal-garden`, `/srv/signal-garden/public`, and any parent path.
- With group `signal-web` and directory mode `0750`, `www-data` can traverse only after group membership is active for the service process. File mode `0640` then permits group read.
- Restart or otherwise refresh the service identity after a group-membership change and verify with the process's effective groups rather than assuming the login session is representative.

## Users Groups and Permissions Key

- `deploy` can traverse, read, and write the listed file and can create within the setgid releases directory because it owns that directory.
- `www-data` can traverse and read through group permissions but cannot write the file or create in the directory.
- `observer` cannot traverse `/srv/signal-garden`, so the file mode alone cannot grant effective access.
- Recursive `0777` is rejected. Changing all ownership to the service account broadens service write access and weakens deployment separation.
- The current matrix already supports read-only serving. A correction is only needed if an observed path component or effective group differs from the supplied state.

## Configuration Change and Rollback Key

- The proposed change fails because the working directory does not exist. `status=200/CHDIR` is the expected service symptom if activation is attempted.
- `Restart=always` can amplify a deterministic configuration failure; it is not a repair.
- A valid sequence identifies the active unit plus drop-ins, saves the baseline, prepares the release directory, makes one edit, reviews the diff, verifies the unit, reloads the manager, restarts the service, and checks status, journal, socket, and health.
- Rollback restores the baseline or previous release path, verifies again, reloads the manager, restarts, and retests.
- Environment-file contents are never copied into a course submission.

## Process State and Signal Key

- PID 4120 is a foreground sleeping process attached to `pts/2`; PID 4177 is a stopped shell job; PID 5002 is a session-leading service process parented by PID 1; PID 91 is a kernel worker and outside scope.
- Resume the shell-managed stopped job through job control in its owning shell.
- Confirm PID, owner, and command immediately before signaling PID 4120.
- An ordinary termination signal gives the toy worker a graceful path. Forceful termination is reserved for a supplied failure where graceful shutdown is observed to fail.
- PID 5002 and PID 91 are not course-owned and remain untouched.

## Systemd Service and Failure Key

- `status=200/CHDIR` points to the missing or inaccessible `WorkingDirectory`.
- Relative `ExecStart` depends on working-directory behavior and is less explicit than the absolute script path used by the course solution.
- `daemon-reload` rereads unit definitions; reload asks a running service to reread supported configuration; restart creates a new service process; enablement configures activation relationships and does not prove the service is currently running.
- Verification covers unit syntax, path existence and traversal, service identity, loopback binding, status, main PID, journal, and local health.
- Rollback disables and stops the unit, removes only the course unit or drop-in, reloads the manager, resets the failure state, restores files, and rechecks absence.

## Journal and Observability Key

- The first causal application evidence is inability to read `items.json`; repeated restarts are a consequence.
- The supplied owner and `0600` mode deny the unprivileged `signal` service account.
- A focused diagnosis uses the current boot, exact unit, and narrow time range; it does not require the entire system journal.
- Correct only the required owner/group/mode or service access path, then verify file traversal, start the service, check for a stable active state, and rerun local health.
- A valid incident note distinguishes the user-visible symptom, file-access cause, restart consequence, correction, and clean retest.

## Scheduler and Automation Key

- Cron cannot find the relative `backup_home.sh` through its smaller PATH and lacks `BACKUP_SOURCE`.
- Use an absolute executable/script path and an explicit, protected environment source or arguments.
- Manual testing under `env -i` with the declared minimum environment exposes hidden assumptions.
- A lock prevents overlap; temporary output plus atomic rename preserves the last trusted artifact; logs and exit status expose failure.
- After observation, remove the cron entry or disable the timer and confirm that no future activation remains.

## Package Source and Update Key

- The installed package is older than the candidate from the distribution update repository; the simulation upgrades `nginx` and `nginx-common`.
- The fictional mirror name means the transcript is evidence practice, not a repository configuration to copy.
- Record distribution/release, package source, candidate, architecture, dependencies, download and disk effect, service impact, configuration conffile risk, snapshot, and validation before a real update.
- A distribution package has a clear repository and package-manager owner. A source build or tarball requires a separate install, update, file-ownership, and removal plan.
- Piping an unverified network script into a root shell fails provenance and review gates.

## Network State and Diagnostics Key

- Interface and route exist, the name resolves to the VM documentation address, and a process listens on loopback port 8080.
- TCP and HTTP communication reached the application because the response is HTTP 503.
- The first failing layer is application health, not interface, route, DNS, or listener setup.
- The next evidence comes from application state and logs. Neighbor scans, packet capture outside the lab, or public binding add risk without clarifying the supplied failure.
- A correction passes when local health returns the declared successful status and body while the listener remains scoped as intended.

## Web Server and Reverse Proxy Key

- Nginx syntax is valid and the local front-end listener works; 502 plus no listener on 8080 identifies an unavailable upstream.
- Static serving reads files from a document root. Reverse proxying forwards a request to another process and must handle upstream availability and headers deliberately.
- Start or repair only the course-owned upstream, confirm its identity and loopback listener, request it directly, then request through Nginx and inspect the focused access/error logs.
- Reload is appropriate after a valid configuration change; restart is not required merely to apply a reloadable Nginx change.
- Apache comparison maps server name, document root or proxy rule, process identity, syntax test, reload, logs, and local request without running both public listeners.

## Backup Restore and Capacity Key

- The planned 80 MB working requirement exceeds the 45 MB available, so the run must not begin at that destination.
- Free space is checked before writing. New output uses a distinct temporary name and is renamed only after archive completion and integrity verification.
- Retention never deletes the last trusted archive before the replacement passes.
- Restore into `/home/learner/restore-check`, compare the three included paths with the manifest, confirm excluded transient files remain absent, and inspect restored ownership and modes.
- An interrupted or out-of-space run removes only incomplete temporary output and leaves the prior validated archive unchanged.

## Operations Capstone Incident Key

- The nonexistent working directory causes service failure and restart attempts. Nginx 502 is downstream evidence of the missing upstream.
- The `.partial` archive is not promoted or used for restore; the previous validated backup remains the trusted recovery source.
- Correction restores the intended release path or rolls the unit back, verifies the unit, reloads systemd, starts the service, confirms stable status and journal, checks 8080 directly, and checks 8088 through Nginx.
- Backup retest creates a complete temporary artifact, verifies it, renames it, and restores to a separate path.
- Final evidence includes environment versions, least-privilege ownership, exact local listeners, health response, failure timeline, correction, backup/restore result, disable-stop-remove rollback, snapshot identifier, limitations, and no public exposure.
