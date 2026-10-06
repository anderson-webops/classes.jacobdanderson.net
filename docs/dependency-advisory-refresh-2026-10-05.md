# Dependency advisory refresh, 2026-10-05

The grid catalog candidate's root and standalone-backend security gates found
newly indexed advisories after the prior release passed its checks. Refresh the
affected packages before integrating the catalog candidate. This is a dependency
correction; it does not establish that the application was exploited.

| Package | Reviewed correction | Advisory |
| --- | --- | --- |
| Vue and its matching compiler/runtime/SSR packages | 3.5.43, with the front-end minimum raised | [Unsafe SSR attribute names](https://github.com/advisories/GHSA-g2v6-rqmx-r4w6) |
| proxy-addr | 2.0.8 in both installation paths | [Mapped IPv6 trust subnet](https://github.com/advisories/GHSA-jqcg-44mw-7w3h) |
| source-map-js | 1.2.2 in both installation paths | [Indexed-map offsets](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) |
| postcss-selector-parser | 7.1.6 | [Flat selector parsing](https://github.com/advisories/GHSA-rj75-hqrm-r3gf) |
| tinypool | 2.1.2 override for the existing formatter | [Worker options](https://github.com/advisories/GHSA-5gmw-xhrv-c9v3), [run options](https://github.com/advisories/GHSA-85c8-ppgw-ccpr) |
| KaTeX | 0.18.2 scoped to micromark-extension-math | [Inherited renderer options](https://github.com/advisories/GHSA-238p-pmpm-9mq7) |

The math extension's upstream range still selects the affected 0.16 line.
Its scoped override keeps the existing Markdown/linter versions while selecting
the fixed renderer. A direct inline/display math contract checks that integration.
The SSR regression checks that a carriage return cannot introduce an attribute.
The worker-pool override is a patch within its existing 2.1 line. Vue's required
compiler update also refreshes Babel parser/types and PostCSS to their compatible
patch versions. Unrelated dependency migrations are outside this correction.

Review covered production and development manifests in the root and both
workspaces, using the pinned npm 12.0.1 toolchain. Both lockfiles were regenerated
with scripts disabled, and the root clean installation succeeded. Local
verification passed dependency-tree/provenance checks, standalone installation
policy, lint, typecheck, build and API tests; the installed root audit reported
zero advisories. Local browser binary downloads and hook installation were
skipped to reuse the existing environment and preserve hook configuration;
hosted checks retain the ordinary installation and full browser gates.

The exact updated candidate's hosted checks and the standalone-backend audit
remain required before integration and release. Preserve published release
artifacts; this correction needs a new validated deployment candidate.
