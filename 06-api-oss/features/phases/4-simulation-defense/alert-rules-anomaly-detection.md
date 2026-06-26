---
title: "Alert Rules + Anomaly Detection"
sidebar_position: 99
description: "Combines user-defined rule-based alerting with ML-driven anomaly"
tags: [features]
---

# Alert Rules + Anomaly Detection

## What It Does
Combines user-defined rule-based alerting with ML-driven anomaly
detection.
Monitors graph state, sensor data, and decision patterns for
suspicious or
notable events. Integrates with SIEM systems and cascades alerts
into
operations center threads.

## How It Works
The alert rules and anomaly detection module in
`ai-oss-gateway/src/alert.rs`
implements a dual-layer detection system. The rule engine evaluates
user-defined conditions against live graph state — threshold rules
("temperature > 50"), pattern rules ("entity X connected to entity Y
while Z
is active"), rate rules ("more than 5 events per minute"), and
composite
rules combining multiple conditions. Rules are defined via
`alert_rule_create`
WebSocket messages or in `opencode.json` under the `alert_rules`
section.
The ML anomaly detector runs two complementary models: isolation
forest for
unsupervised anomaly detection on numerical graph properties (quick,
interpretable) and autoencoder neural networks for multi-variate
anomaly
detection on complex patterns (sensitive, captures interactions).
Both
models are trained locally on historical graph data using the
Qwen2-VL-2B-Instruct-Q4_K_M.gguf model on CUDA for feature
extraction.
The alert manager evaluates alerts through a council of detectors
— the rule
engine and each ML model vote independently, with configurable
voting
thresholds for alert firing. Alerts are graph events with full
provenance —
linked to the triggering conditions, affected entities, and
detection method.
Alerts can cascade into operations center threads, trigger World
Engine
simulations, or forward to external SIEM systems via the SIEM
bridge. The
AlertListView on the HTTP UI at port 8081 provides real-time alert
monitoring. Frontend connects via WebSocket to port 3030 for push
alerts.
All state is stored in SQLite WAL in `./data/`. Config is driven by
`opencode.json`.

## How to Operate
1. Start the gateway: `api-oss start` or binary directly
2. Open the Alert Rules view in the browser at port 8081
3. Create alert rules via `alert_rule_create` WS message or UI form
4. Configure ML anomaly detection parameters in `opencode.json` under
   `anomaly_detection`
5. View live alerts in the dashboard — each alert shows trigger, severity,
   and context
6. Acknowledge alerts via `alert_acknowledge` WS message
7. Configure alert escalation — cascade to operations threads, trigger
   simulations
8. Train ML models on historical data via `detect_anomalies` with training
   flag
9. Configure SIEM bridge output in `opencode.json` under `siem`
10. Use the CLI: `api-oss alert list`, `api-oss alert create`,
    `api-oss alert acknowledge`

## The Moat
- Graph-native anomaly detection — where anomalies are defined not just by
  value thresholds but by structural graph patterns — requires a
  fundamentally different approach
- The council-based alert evaluation (rules + isolation forest + autoencoder)
  provides robustness through multiple detection perspectives
- Both ML models run locally on CUDA — no cloud dependency for anomaly
  detection
- Alerts are first-class graph nodes linked to full context: triggering
  entities, affected decisions, sensor data
- Integration with operations center means alerts can automatically create
  operational threads
- No competitor offers graph-native anomaly detection with council-based
  evaluation

## Why Choose API-OSS
Palantir's alerting exists but is rule-only — no graph-native
anomaly
detection. Google, Anthropic, and Nvidia have no equivalent
integrated
alerting product. API-OSS provides a dual-layer alerting system
combining
user-defined rules with ML-driven anomaly detection, all operating
on the
live knowledge graph. For defense and enterprise customers, this
means
comprehensive monitoring that catches both known and unknown threat
patterns.

## Competitive Comparison
- **Palantir**: Alerting exists but is rule-only; no graph-native anomaly
  detection; cloud-dependent
- **Google**: No equivalent integrated product
- **Anthropic**: No alerting product
- **Nvidia**: No alerting product

## Cost-Benefit Analysis
Enterprise SIEM platforms (Splunk, Elastic) cost $50K–$500K/year
for
equivalent alerting and anomaly detection capabilities. Cloud ML
services
for anomaly detection cost $1K–$10K/month in compute and API fees.
API-OSS
provides dual-layer (rule + ML) alerting at zero software cost —
one-time
hardware of ~$3,000. No per-event fees, no cloud ML API costs. A
defense
organization monitoring 10K+ graph entities saves
$200K–$500K/year. Time
savings: manual rule creation and tuning takes days; API-OSS ML
models
auto-detect anomalies without manual rule definition.

## Applications
- **Consumer**: Personal anomaly alerts, financial monitoring, home
  automation alerts
- **Government / Defense**: Threat detection, pattern-of-life anomalies,
  network intrusion detection, operational security monitoring
- **Enterprise**: Security monitoring, operational anomaly detection, fraud
  detection, quality control monitoring

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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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