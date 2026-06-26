---
title: "Compliance Dashboard"
sidebar_position: 99
description: "Real-time compliance posture monitoring with SOC 2, ISO 27001, GDPR, and SOX control"
tags: [features]
---

# Compliance Dashboard

## What It Does
Real-time compliance posture monitoring with SOC 2, ISO 27001, GDPR, and SOX control
mappings.
Provides snapshot-based compliance evidence generation for auditors — auto-generated SOC
2 Type II evidence packages, ISO 27001 Statement of Applicability mappings, and GDPR
compliance reports.
## How It Works
The compliance dashboard is implemented in the Rust engine at `ai-oss-gateway/src/`.
Compliance controls are mapped to specific Rust code paths and configuration assertions
— each control is verified by introspecting the live system, not by self-reported
questionnaires.
For example, the SOC 2 control "CC6.1 — Logical and physical access controls" is
verified by checking: TLS 1.3 is enabled and configured (reads `rustls` configuration),
bearer token auth is enforced (checks token store is non-empty or checks that auth is
configured), the immutable ledger at `data/ledger/` is active (reads the `.aioss` genesis
entry), encryption is at rest is AES-256-GCM (checks `opencode.json` crypto settings), and
access logs are streaming (verifies the audit streaming pipeline is operational).
The compliance verifiers run as Rust functions that read live system state directly — no
external tools, no manual evidence collection.
Control verifiers are organized by framework (SOC 2, ISO 27001, GDPR, SOX) and displayed
in a control tree with pass/fail/warning status.
An operator can trigger a compliance snapshot via `get_compliance_snapshot` over WebSocket
to port 3030 — this runs all applicable verifiers and produces a time-stamped, signed
compliance report stored in `data/ledger/` in `.aioss` format.
The HTTP UI on port 8081 renders the `ComplianceDashboardView` with the control tree,
evidence export, and snapshot history.
CLI commands (`api-oss compliance status`, `api-oss compliance snapshot --framework soc2`)
provide terminal access, one of 87 CLI commands across 9 subcommand groups (auth, service,
sync, backup, etc.).
Configuration for which frameworks to monitor and control mappings is driven by
`opencode.json`.
The gateway runs as a single binary via `api-oss start`, fully air-gapped.
All compliance snapshots are recorded in the immutable ledger with cryptographic chaining
— auditors can verify the snapshot was generated at a specific time and has not been
tampered with.
## How to Operate
1.
**Open the ComplianceDashboardView** at `https://localhost:8081/compliance` to see the control tree with live pass/fail status.
2.
**Filter by framework**: Select SOC 2, ISO 27001, GDPR, or SOX from the dropdown to see controls specific to that framework.
3.
**View control details**: Click a control to see the specific verification logic — which system component was checked, what value was read, and what the expected value was.
4.
**Generate a snapshot**: Click "Generate Snapshot" or send `{"type": "generate_compliance_snapshot", "framework": "soc2"}` over WebSocket.
The snapshot is created, signed, and stored in `data/ledger/`.
5.
**Export evidence**: Click "Export" to download the snapshot as a PDF evidence package suitable for auditor review.
6.
**Schedule snapshots**: Configure `opencode.json` with `compliance.snapshot_interval: "7d"` for automatic weekly compliance snapshots.
7.
**Remediate failures**: For failed controls, the dashboard shows the specific configuration change needed.
Apply the change and re-run the verification.
8.
**Audit**: Check `data/ledger/` for the complete history of compliance snapshots with cryptographic signatures.
## The Moat
- **Live system introspection, not self-reporting**: Each control is verified by reading live system state — TLS configuration, crypto settings, auth status, log integrity.
This eliminates the gap between what is documented and what is actually deployed.
- **Control-to-code-path mapping**: Every SOC 2 or ISO 27001 control is mapped to specific Rust code paths.
When the code changes, the control verification updates automatically — no manual
control mapping updates.
- **Cryptographically signed evidence**: Compliance snapshots are signed with the instance's Ed25519 key and recorded in `data/ledger/`.
Auditors can verify the snapshot's authenticity and integrity.
- **Multi-framework support**: SOC 2 Type II, ISO 27001, GDPR, and SOX controls are all covered.
Custom frameworks can be added via `opencode.json` control definitions.
- **Automated scheduling**: Weekly snapshots with automatic evidence package generation — the compliance team does not need to manually trigger evidence collection.
- **Air-gapped compliance**: All compliance verification runs locally.
Evidence never needs to leave the deployment for auditor review — the auditor can verify
on-site.
## Why Choose API-OSS
Cloud AI vendors provide SOC 2 reports but they cover the vendor's infrastructure, not the
customer's deployment.
When you deploy OpenAI or Anthropic in your environment, you must separately demonstrate
compliance for your AI usage — the vendor's SOC 2 report does not cover your
configuration, your data handling, or your access controls.
API-OSS provides compliance verification for your actual deployment — proving that your
specific instance is configured correctly with encryption, access controls, logging, and
governance.
For regulated enterprises that need SOC 2 or ISO 27001 certification for their AI system,
API-OSS provides the compliance evidence infrastructure that cloud vendors cannot.
## Competitive Comparison
- **OpenAI**: SOC 2 reports available for OpenAI's infrastructure — does not cover customer deployments.
No compliance dashboard for customer configuration.
- **Palantir**: Compliance via Palantir Federal, a separate offering.
Requires cloud deployment and separate compliance consulting engagement.
- **Snowflake**: Compliance reports via cloud console — covers Snowflake infrastructure, not customer configuration.
- **Anthropic**: SOC 2 reports for Anthropic infrastructure only.
## Cost-Benefit Analysis
SOC 2 compliance automation tools (Vanta, Drata, Secureframe) cost $12k-$60k/year and
require manual evidence collection for AI-specific controls.
External SOC 2 audits cost $30k-$80k per year.
API-OSS provides automated compliance evidence generation for AI-specific controls at zero
additional cost.
Time savings: evidence collection that takes a compliance team 4-8 hours per week is
automated to zero.
Risk reduction: continuous compliance monitoring catches configuration drift immediately
— a misconfigured TLS setting is detected within minutes, not discovered during the next
quarterly audit.
## Applications
- **Consumer**: N/A
- **Government / Defense**: Continuous compliance for classified deployments — an agency running API-OSS in a SCIF can generate SOC 2 equivalent evidence packages for inspector general review without any data leaving the classified network.
- **Enterprise**: SOC 2 readiness with continuous compliance monitoring — the compliance team receives automated alerts when any control fails, enabling remediation before the annual audit.

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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/YMJKOG
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
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ