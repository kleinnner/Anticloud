---
title: "SBOM Generation + Vulnerability Scanning"
sidebar_position: 99
description: "Generates CycloneDX-format Software Bill of Materials (SBOM) for the"
tags: [features]
---

# SBOM Generation + Vulnerability Scanning

## What It Does
Generates CycloneDX-format Software Bill of Materials (SBOM) for the
deployment from
actual loaded libraries.
Scans all dependencies for known vulnerabilities against a local
database and produces
diff reports between versions — meeting US federal procurement
requirements under
Executive Order 14028.
## How It Works
SBOM generation is implemented in the Rust module
`ai-oss-gateway/src/sbom.rs`.
Unlike tools that generate SBOMs from lockfile parsing (which can drift
from what is
actually deployed), the API-OSS SBOM generator enumerates dependencies
by inspecting the
actual loaded modules at runtime.
The generator walks the ELF/Mach-O binary's dynamic library linkage,
reads the embedded
dependency metadata from the Rust compilation, and cross-references
against the Rust crate
dependency tree that was compiled into the binary.
Each dependency is recorded with its name, version, license, download
URL, and SHA-256
checksum.
The output is formatted as CycloneDX JSON/XML — the format mandated by
Executive Order
14028 for US federal software procurement.
The vulnerability scanner matches each dependency against a local
vulnerability database
stored in `data/graph.db` (SQLite WAL), imported from OSV (Open Source
Vulnerabilities)
and NVD feeds.
For air-gapped deployments, the vulnerability database is updated via
signed update
packages on portable media.
The scanner reports: vulnerable dependencies with CVE identifiers,
severity scores (CVSS
3.1), affected version ranges, and fixed version recommendations.
SBOM diffs (`sbom_diff` over WebSocket to port 3030) compare two
versions and report:
added dependencies, removed dependencies, version changes, and new
vulnerabilities
introduced.
The HTTP UI on port 8081 renders SBOM reports through the compliance
dashboard views.
The CLI (`api-oss sbom generate`, `api-oss sbom diff`, `api-oss sbom
vuln-scan`) provides
terminal access as part of 87 CLI commands across 9 subcommand groups
(auth, service,
sync, backup, etc.).
The gateway is configured via `opencode.json` and started by `api-oss
start` or the binary
directly.
All SBOM and vulnerability data is local — the feature works fully
air-gapped with no
internet access required after initial vulnerability database import.
## How to Operate
1.
**Generate an SBOM**: `api-oss sbom generate --format cyclonedx-json` outputs an SBOM file.
Alternatively, use `https://localhost:8081/compliance/sbom` in the HTTP
UI.
2.
**Run a vulnerability scan**: `api-oss sbom vuln-scan` checks all dependencies against the local vulnerability database.
Results are displayed in the terminal and stored in `data/graph.db`.
3.
**Compare versions**: `api-oss sbom diff --v1 v1.0.0 --v2 v2.0.0` shows what changed between releases — useful for release review and supply chain audit.
4.
**Schedule scans**: Configure `opencode.json` with `sbom.scan_interval: "24h"` for automatic daily vulnerability scans.
Results appear in the compliance dashboard.
5.
**Import vulnerability data**: On air-gapped systems, place signed update packages in `data/vuln-updates/` and run `api-oss sbom vuln-update`.
6.
**Export for compliance**: The UI provides one-click export of SBOM and scan results for federal procurement documentation.
7.
**Audit**: All SBOM generations and vulnerability findings are recorded in `data/ledger/` in `.aioss` format with cryptographic chaining.
## The Moat
- **Runtime-accurate SBOM, not lockfile-based**: The SBOM is generated from actually loaded libraries in the running binary, not from a lockfile that may be out of date.
This eliminates SBOM drift — a critical issue for compliance in
regulated environments.
- **Air-gapped vulnerability scanning**: The local vulnerability database supports offline scanning.
For classified deployments where internet is never available,
vulnerability updates arrive
on signed portable media.
- **Built into the single binary**: No separate dependency scanning tool, no integration with Snyk or GitHub Dependabot.
The SBOM generator and vulnerability scanner are compiled into the
`api-oss` binary.
- **CycloneDX standard**: Full compliance with US federal Executive Order 14028 and NTIA minimum elements for SBOMs.
- **Immutable audit trail of software composition**: Every SBOM generation and vulnerability scan is recorded in `data/ledger/` with cryptographic proof.
Auditors can verify the software composition at any point in time.
## Why Choose API-OSS
OpenAI provides no SBOM — users cannot determine what dependencies
their AI interactions
depend on.
Palantir Foundry offers SBOM generation but as a bolt-on feature
requiring separate
tooling.
Snowflake has no SBOM capability.
For US federal deployments where Executive Order 14028 mandates SBOM
submission, and for
any regulated industry that requires supply chain visibility, API-OSS
provides built-in,
runtime-accurate SBOM generation at zero additional cost.
No competitor offers this level of software supply chain transparency
for an AI platform.
## Competitive Comparison
- **OpenAI**: No SBOM generation — users cannot determine what libraries or versions power the AI service.
- **Palantir**: SBOM via Foundry but requires separate tooling integration.
SBOM is generated from build artifacts, not runtime state — prone to
drift.
- **Snowflake**: No SBOM capability.
Snowflake provides no visibility into its software supply chain.
- **Anthropic**: No SBOM generation.
## Cost-Benefit Analysis
Commercial SBOM tooling costs $50k-$150k/year (Snyk, Dependency-Track
with enterprise
support).
Building SBOM generation in-house requires 3-6 months of engineering.
Vulnerability database subscriptions (NVD feeds, OSV) require ongoing
maintenance.
API-OSS provides runtime-accurate SBOM generation and air-gapped
vulnerability scanning at
zero additional cost.
Time savings: 3-6 months of development eliminated.
Risk reduction: for federal contractors, inability to produce an SBOM
can disqualify bids
under EO 14028 — API-OSS ensures compliance out of the box.
## Applications
- **Consumer**: N/A
- **Government / Defense**: Mandatory for US federal deployments under Executive Order 14028 — every software system procured by the federal government must include a machine-readable SBOM with vulnerability disclosure.
- **Enterprise**: Supply chain security for regulated industry deployments — financial services firms must demonstrate that all AI system dependencies are scanned for vulnerabilities before production deployment.

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  As seen on:                                                       !
!  Harvard Dataverse ! Zenodo/CERN ! Academia.edu ! HuggingFace      !
!  anticloud.telepedia.net ! anticloud.fandom.com                    !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Bluesky ! Mastodon                           !
!  Internet Archive ! ORCID ! Figshare                               !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com