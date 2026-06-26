---
title: "SIEM Dashboard"
sidebar_position: 99
description: "Security event monitoring and log aggregation with pre-built SIEM templates compatible"
tags: [features]
---

# SIEM Dashboard

## What It Does
Security event monitoring and log aggregation with pre-built SIEM templates compatible
with existing SOC workflows.
Provides real-time visibility into authentication events, access patterns, system
anomalies, and AI-specific security events — with MITRE ATT&CK mappings and syslog
export to existing SIEM platforms.
## How It Works
The SIEM dashboard is embedded in the Rust engine at `ai-oss-gateway/src/`.
Unlike bolt-on SIEM solutions that require separate log shipping infrastructure, the
API-OSS SIEM pipeline is an integral part of the event system.
Every auth event (login, logout, token generation, token validation success/failure),
graph mutation (create, read, update, delete), WebSocket connection/disconnection,
configuration change, rule evaluation, and system health metric is already captured as a
structured JSON event by the audit streaming pipeline.
The SIEM dashboard provides a dedicated view into this event stream with security-specific
filtering, correlation, and templates.
Pre-built templates cover common security use cases: MITRE ATT&CK technique mappings
(T1078 — Valid Accounts, T1098 — Account Manipulation, T1530 — Data from Information
Repositories), failed login detection (threshold-based alerting on auth failures),
privilege escalation monitoring (detecting role changes, especially unauthorized ones),
anomalous access patterns (access from unusual hours, from unusual IP ranges, to unusual
codices), and data exfiltration detection (large-volume exports, rapid sequential
queries).
Templates are displayed in the `SiemTemplatesView` at
`https://localhost:8081/siem/templates` and can be activated with a single click.
The `SiemDashboardView` at `https://localhost:8081/siem` shows a real-time event stream
(via WebSocket to port 3030) with SOC-friendly formatting — timestamp, event type,
source user, target resource, outcome, and MITRE ATT&CK ID.
Events can be filtered, searched, and exported.
For integration with existing SIEM platforms (Splunk, QRadar, Elastic SIEM, Microsoft
Sentinel), events are forwarded via syslog (RFC 5424) with structured JSON payloads.
Syslog forwarding is configured in `opencode.json` with support for TCP, UDP, and TLS
transport.
CLI commands (`api-oss siem status`, `api-oss siem export`) provide terminal access, one
of 87 CLI commands across 9 subcommand groups (auth, service, sync, backup, etc.).
All events visible in the SIEM dashboard are also recorded in the immutable ledger at
`data/ledger/` in `.aioss` format.
The gateway runs as a single binary via `api-oss start`, fully air-gapped.
## How to Operate
1.
**Open the SiemDashboardView** at `https://localhost:8081/siem` to see the real-time security event stream.
2.
**Activate a template**: Open `https://localhost:8081/siem/templates` and click "Activate" on "Failed Login Detection" — the template configures an alert for >5 failed auth attempts within 5 minutes.
3.
**Apply MITRE ATT&CK mappings**: Each template includes MITRE ATT&CK technique IDs.
Click a mapped technique to see the MITRE ATT&CK documentation for detection and
mitigation guidance.
4.
**Search events**: Use the search bar to filter by user, resource, event type, or time range.
Results are displayed in real time with SOC-compatible formatting.
5.
**Configure syslog forwarding**: In `opencode.json`, add the SIEM target under `audit.syslog.destinations`.
Restart or send `config_reload` over WebSocket.
6.
**Export for analysis**: Click "Export" to download the current filtered event view as CSV or JSON for external analysis.
7.
**Create custom templates**: Define custom alert conditions using the event DSL and save them as templates for reuse.
8.
**Audit**: The immutable ledger at `data/ledger/` provides cryptographic proof of all security events visible in the SIEM dashboard.
## The Moat
- **Embedded SIEM pipeline, not bolted on**: Every security-relevant event is already captured by the audit streaming pipeline.
There is no separate log collection, no agent deployment, no log shipper configuration.
- **Pre-built SOC templates with MITRE ATT&CK mappings**: Templates are ready to activate with SOC-relevant alerts.
No SIEM engineer needed to configure basic detection rules.
- **Real-time by default**: Events appear in the dashboard within milliseconds of occurring.
No batch export, no indexing delay, no search-time processing.
- **Deep AI-system visibility**: The SIEM dashboard captures AI-specific events that generic SIEM platforms cannot see — which model was queried, what council decisions were made, which constitution principles were evaluated.
- **Syslog export to existing SIEM**: Events are forwarded in RFC 5424 format compatible with Splunk, QRadar, Elastic, and Microsoft Sentinel.
No custom integration required.
- **Air-gapped SIEM operation**: All SIEM capabilities work offline.
Syslog forwarding supports one-way data diodes for air-gapped networks.
## Why Choose API-OSS
OpenAI provides no SIEM dashboard — customers must build custom monitoring using API
logs.
Palantir offers SIEM via Gotham as a separate product.
Snowflake provides audit logs but no real-time SIEM dashboard.
API-OSS provides an embedded SIEM dashboard with pre-built templates at zero additional
cost — the SOC team gets immediate visibility into AI system security events without
deploying additional infrastructure.
## Competitive Comparison
- **OpenAI**: No SIEM dashboard — no self-hosted observability.
API logs are accessed via the cloud dashboard with limited query capabilities.
- **Palantir**: SIEM via Gotham, separate product requiring separate deployment and licensing.
Not embedded in the AI platform.
- **Snowflake**: Logging via Snowflake audit views — query-based, not real-time SIEM.
No MITRE ATT&CK mappings.
- **Anthropic**: No SIEM capability.
## Cost-Benefit Analysis
A SIEM platform (Splunk, QRadar, Elastic SIEM) costs $1,200-$2,000+/GB/month of data
ingested.
For an AI system generating security events, this is $5k-$20k/month.
Building custom security monitoring requires 3-6 months of engineering.
API-OSS provides an embedded SIEM dashboard with pre-built templates at zero additional
cost.
Time savings: 3-6 months of SIEM engineering eliminated.
Risk reduction: real-time visibility into AI system security events reduces dwell time for
security incidents — the SOC team detects anomalous access patterns within milliseconds
instead of discovering them in weekly log reviews.
## Applications
- **Consumer**: N/A
- **Government / Defense**: SOC integration for continuous monitoring of classified systems — the SIEM dashboard feeds into the organization's existing SOC infrastructure via syslog, providing real-time visibility into AI system access patterns without any data leaving the classified network.
- **Enterprise**: Security team visibility into AI system access patterns — the SIEM dashboard correlates authentication events, data access, and decisions, enabling the SOC to detect and respond to anomalous behavior in the AI system alongside traditional security monitoring.

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
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
