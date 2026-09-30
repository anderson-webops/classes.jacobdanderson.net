# Transactional email and public asset metadata

Password-reset and other transactional messages require encrypted SMTP delivery
on both primary and fallback transports. `SMTP_PRIMARY_SECURE=true` and
`SMTP_FALLBACK_SECURE=true` select implicit TLS; otherwise STARTTLS is mandatory.
The legacy `SMTP_SECURE` alias still applies to the primary transport. Certificate
verification, configured server names, custom CA files and the TLS 1.2 minimum
remain enforced. There is no plaintext fallback or TLS opt-out.

Before deployment, confirm the configured primary relay supports STARTTLS with a
certificate matching its configured server name, or use implicit TLS. This also
applies to a loopback relay. If both transports reject delivery, the existing
password-reset workflow removes the undelivered token and returns its generic
response. Do not retry real messages as a source-validation step.

Code IDE asset download URLs remain private build-cache metadata. Neither
`/ide/assets/manifest.json` nor `/python-ide/assets/manifest.json` publishes the
download URL, including on verified-cache reuse and offline recovery. Both
manifests retain asset names, public media paths, dimensions, version and
generation time. Archive size/hash verification remains mandatory.

Deployment must publish the regenerated manifests. Source delivery alone does
not remove old public artifacts. If a previously published manifest contained
an actual credential, the operator must review exposure and rotate that
credential through the existing protected workflow; do not copy it into reports.
