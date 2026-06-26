---
title: "Incident Orchestration"
sidebar_position: 99
description: "Automated incident response with playbooks — SOAR-like capabilities built"
tags: [features]
---

# Incident Orchestration

## What It Does
Automated incident response with playbooks — SOAR-like capabilities built
into the AI
decision engine.
Detects security events from rules, CEP patterns, and system monitors,
assigns playbooks
for automated response, tracks resolution, and integrates with external
ticketing systems.
## How It Works
Incident orchestration runs in the Rust event pipeline at
`ai-oss-gateway/src/`.
When a rule violation fires, a CEP pattern (like "failed login →
privilege escalation
→ data export within 1 hour") completes, or a system health check fails,
the incident
engine receives an event.
It evaluates the event against configured playbooks — YAML-defined
sequences of
conditional steps, approval gates, and automated actions.
Playbooks can execute mitigation actions directly in the Rust engine:
revoke a user's
access tokens (via the auth module), block a specific graph mutation type,
alert
administrators via WebSocket broadcast, trigger a webhook to an external
SOAR platform, or
log the incident to the SIEM dashboard.
Each playbook step can require approval from specific roles before
proceeding — the
approval request is sent over WebSocket to port 3030, and frontend views at
`https://localhost:8081/incidents` display pending approvals.
The incident state machine tracks each incident through detection,
investigation,
containment, eradication, recovery, and post-incident phases.
Phase transitions can trigger additional playbook steps.
The HTTP UI served on port 8081 renders an incident timeline with playbook
execution
status and resolution reports.
All incident events are recorded in the immutable ledger at `data/ledger/`
in `.aioss`
format with cryptographic chaining.
The CLI (`api-oss incident list`, `api-oss incident resolve`, `api-oss
incident playbook
run`) provides terminal-based management as part of 87 CLI commands across
9 subcommand
groups (auth, service, sync, backup, etc.).
The gateway is configured via `opencode.json` and started by `api-oss
start` or the binary
directly.
The Qwen2-VL-2B-Instruct-Q4_K_M.gguf model running on CUDA can optionally
classify
incidents and recommend playbooks based on historical resolution patterns.
All incident management operates fully air-gapped with no internet.
## How to Operate
1.
**Open the Incident Dashboard** at `https://localhost:8081/incidents` to see active incidents, playbook status, and the incident timeline.
2.
**Define a playbook**: Create a YAML file defining trigger conditions, steps, approval gates, and automated actions.
Load it via the UI or place it in the playbooks directory referenced by
`opencode.json`.
3.
**Configure detection rules**: In the rules engine, set rule actions to "trigger incident" instead of just logging.
CEP patterns can also trigger incidents automatically.
4.
**Respond to incidents**: When an incident fires, the assigned playbook begins executing automatically.
Step through approval gates in the UI.
5.
**Manually report an incident**: Send `{"type": "incident_report", "title": "...", "severity": "high", "description": "..."}` over WebSocket.
6.
**Assign playbooks**: `api-oss incident assign-playbook --incident INC-001 --playbook data_breach_response` manually assigns a playbook to an existing incident.
7.
**Resolve**: When containment and recovery are complete, click "Resolve" in the UI or send `{"type": "incident_resolve", "incident_id": "INC-001"}`.
8.
**Audit**: Check `data/ledger/` for complete incident lifecycle records with cryptographic proof.
## The Moat
- **Sub-second incident response**: Playbook execution runs in the Rust event pipeline.
From event detection to automated mitigation action — revoking access,
blocking a
mutation, or alerting administrators — takes milliseconds, not minutes.
- **Embedded SOAR, not bolted on**: The incident engine is part of the same binary that handles auth, rules, and data.
No separate SOAR platform to deploy, configure, or maintain.
- **Approval gates with cryptographic audit**: Approval actions are recorded in `data/ledger/` with full provenance — who approved what, when, and from which session.
- **AI-assisted playbook recommendation**: The local Qwen2.5-VL model can classify incidents and suggest playbooks based on similarity to past incidents — all running on local CUDA hardware with no data leaving the instance.
- **Complete air-gap**: All incident detection, playbook execution, and response actions work offline.
No cloud SOAR platform dependency.
## Why Choose API-OSS
No AI platform competitor provides built-in incident orchestration.
OpenAI has no incident response capabilities.
Palantir offers SOAR via its Apollo platform as a separate product with
separate
licensing.
Splunk SOAR costs $1,200+/month per analyst.
API-OSS provides a complete SOAR-like incident orchestration engine as a
built-in feature
of the single binary at zero additional cost.
For security teams that need automated response to AI system incidents —
data leakage,
policy violations, unauthorized access attempts — API-OSS provides the
automation
infrastructure out of the box.
## Competitive Comparison
- **OpenAI**: No incident orchestration.
Users must build custom monitoring and response tooling.
- **Palantir**: SOAR via Apollo, a separate product requiring separate deployment and licensing.
Integration with Foundry requires cloud connectivity.
- **Snowflake**: No incident orchestration.
Security events must be exported to external SOAR tools.
- **Splunk**: ES/SOAR at $1,200+/analyst/month — separate product, separate infrastructure, no AI system integration.
## Cost-Benefit Analysis
A standalone SOAR platform costs $50k-$200k/year for licensing (Splunk
SOAR, Palo Alto
XSOAR) plus infrastructure and engineering to integrate with AI systems.
Building incident response automation in-house requires 4-8 months of
development.
Palantir's Apollo SOAR requires a separate contract tier with additional
$100k-$500k/year.
API-OSS provides a complete incident orchestration engine at zero
additional cost.
Time savings: 4-8 months of development eliminated.
Risk reduction: automated incident response reduces mean-time-to-contain
(MTTC) from hours
to seconds — critical for data breach scenarios where every minute of
exposure costs
$5,000-$10,000 on average.
## Applications
- **Consumer**: N/A
- **Government / Defense**: Automated response to classified data handling incidents — if a user attempts to export classified data without authorization, the incident engine automatically revokes their access, alerts the security officer, and locks down the affected codex.
- **Enterprise**: Security operations integration with existing SOC workflows — incidents detected by the AI system are automatically enriched and forwarded to the SIEM for correlation with other security events.

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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
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