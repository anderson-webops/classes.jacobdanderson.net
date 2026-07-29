# Network Systems Verification Guide

Compare this guide only after recording an independent diagnosis. Equivalent commands and layouts are valid when they prove the same network state, scope, and cleanup behavior. Never run an administrative or capture action on a shared, public, school, employer, ISP, cloud, production, or otherwise unauthorized network.

## Lab Boundary and Readiness Key

- The supplied baseline is Ubuntu 26.04 LTS on x86-64 with loopback plus one documentation-only dual-stack interface.
- `192.0.2.0/24` and `2001:db8::/32` are documentation ranges; they do not establish internet reachability.
- The only listener is the course-owned loopback service on TCP 8080, and UFW is inactive at baseline.
- The live-lab boundary requires an owned disposable VM, user-mode NAT or a more isolated route, no bridge, no public listener, and no real credentials or traffic.
- Reset uses snapshot `network-systems-ready`; each namespace, firewall, listener, or name change also needs an itemized cleanup route.

## Request Path and Transport Key

- `curl` owns the client socket and the toy service owns the listening socket.
- The tuple includes both addresses and both ports; the client source port is not the server's service identity.
- The SYN sequence establishes TCP state before application bytes move; PSH/ACK packets carry the request and response; FIN begins orderly closure.
- Loopback still uses IP and transport processing even though no physical frame leaves the host.
- UDP removes TCP connection and retransmission state from this trace; any delivery confirmation or retry behavior belongs to the application.

## Address Name and Scope Key

- The MAC-style value is link-layer identity; IP values and prefixes belong to the network layer; the hostname is a label; the record maps that label to an address; the URL adds scheme, authority, port, and path.
- `127.0.0.1` and `::1` remain on the local host.
- `fe80::10%ens3` is link-local and needs interface context; `2001:db8::/32` is reserved documentation space.
- An address identifies an interface under the relevant scope, not every service on the host.
- DNS success supplies an address candidate only. Route, host policy, listener, transport, and application checks remain independent.

## Subnet Route and NAT Key

- `clientns` sends off-prefix traffic to `192.0.2.1`; `serverns` returns off-prefix traffic through `198.51.100.1`.
- `routerns` has connected routes for both prefixes and is the forwarding point.
- Routing chooses a next hop; NAT rewrites a tuple and maintains translation state. They are related but not interchangeable.
- A complete explanation includes the return path and reverse translation.
- Cleanup removes the three named namespaces and confirms their virtual interfaces and any namespace-local policy are gone.

## Listener and Reachability Key

- TCP 8080 is loopback-only and cannot accept a connection addressed to `192.0.2.10`.
- TCP 8088 is bound to the lab interface. Its listener still does not prove that a client route or firewall permits access.
- UDP 53 belongs to the local resolver stub and is not equivalent to an authoritative DNS server exposed to the lab.
- The two curl responses prove local application behavior for their exact destinations.
- A remote claim requires one approved client test plus route and policy evidence; it never requires a scan.

## DNS Resolution and Cache Key

- Resolver `192.0.2.53` returns both A and AAAA with a 60-second TTL; `192.0.2.54` returns NXDOMAIN.
- `getent` follows the system name-service order and reveals a local override to loopback.
- A stale cache can retain an older positive or negative answer until its policy allows refresh.
- Record resolver identity and query type when comparing results; “DNS works” is too broad.
- After resolution, test each address family through route, listener, policy, transport, and application evidence.

## Diagnostic Evidence Ladder Key

- The process is active and local HTTP succeeds, so the application runs.
- The service binds only to `127.0.0.1`; a client request to `192.0.2.10:8080` receives refusal.
- Name resolution and route selection are present, so they are not the first failing gate.
- The first failure is listener scope for the requested destination.
- A valid correction binds the toy service to the intended private lab interface or places the local proxy in front of it, then repeats listener, local, route, policy, transport, and application checks.

## Interface Route and Neighbor Key

- The selected route to `198.51.100.20` uses `ens3`, source `192.0.2.10`, and next hop `192.0.2.1`.
- `lab0` is down, so its failed neighbor entry cannot carry traffic.
- Flushing the route table or disabling `ens3` risks the management path and changes more state than the question requires.
- A safe live variant creates a namespace-local link and route, verifies it, then deletes only that namespace.
- The final record compares the post-cleanup interface and route state with the baseline.

## IPv6 Dual Stack Key

- `::1` is loopback, `fe80::10` is link-local, and `2001:db8:10::10` is documentation-only global-unicast-shaped evidence.
- The route table contains the local IPv6 prefix, but the listener output contains only an IPv4 wildcard.
- IPv4 application success does not verify IPv6.
- The first failing IPv6 gate is listener family, before host policy or application content.
- A link-local request needs a zone identifier because the same prefix can exist on multiple interfaces.

## Firewall Policy and Rollback Key

- Rule 3 permits TCP 8080 from every source and exceeds the intended policy.
- The administration and HTTP allowances use distinct approved sources.
- Preview the numbered deletion and preserve console or second-session recovery before changing a remote-access policy.
- Verification includes allowed SSH and HTTP sources, denied alternate sources, unrelated closed ports, logs, and both address families where rules exist.
- Rollback records numbered deletion, full lab reset if needed, snapshot restore, and comparison with the baseline.

## Bounded Packet Capture Key

- SYN, SYN/ACK, and ACK complete the TCP handshake.
- PSH/ACK in both directions indicates application bytes moved.
- No RST appears, and FIN begins an orderly close; the supplied flow completed rather than being reset.
- The excerpt cannot prove application semantics beyond the visible fields and declared generated flow.
- A valid record includes authority, interface, exact filter, packet or time limit, stop condition, generated traffic, minimal fields, redaction, conclusion, and uncertainty.

## Protocol and TLS Visibility Key

- HTTP returns a redirect that identifies the next URL.
- The TLS evidence reports TLS 1.3, the expected peer name, and successful verification.
- The trace exposes transport setup and TLS handshake metadata, then labels application data as encrypted.
- Port 8443 is a convention chosen by this lab, not proof of TLS or application identity.
- The packet summary cannot reveal encrypted request content, credentials, or response body.

## Least Exposure Service Key

- The toy application remains on loopback 8080 and the proxy is the only lab-interface listener.
- The proxy request succeeds with the fictional Host header, while direct access to 8080 through the lab address is refused.
- The intended policy permits only `192.0.2.20` to the proxy port and preserves denial for `192.0.2.30`.
- Verification covers process, listener, route, policy, direct upstream health, proxied response, logs, and blocked alternatives.
- Cleanup removes the proxy listener and lab policy while leaving the application baseline known and local.

## Routed Operations Capstone Key

- Incident 1 resolves both families but lacks the intended IPv6 listener. IPv4 success cannot close the IPv6 evidence gate.
- Incident 2 reaches the correct route and listener but fails at host policy because the allowed source prefix does not include `clientns`.
- Corrections are independent: add or deliberately remove the IPv6 exposure contract, then fix only the source policy.
- Each incident repeats the original evidence ladder and confirms intentionally closed alternatives remain closed.
- Final evidence includes topology, versions, scope, baseline, routes, resolver answers, listeners, policy, application results, packet interpretation, two diagnoses, corrected retests, cleanup proof, known limitations, and no public exposure.
