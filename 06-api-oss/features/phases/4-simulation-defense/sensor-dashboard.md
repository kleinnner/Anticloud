---
title: "Sensor Dashboard"
sidebar_position: 99
description: "Ingests real-time sensor data, visualizes time-series streams, and"
tags: [features]
---

# Sensor Dashboard

## What It Does
Ingests real-time sensor data, visualizes time-series streams, and
triggers
alerts when values cross defined thresholds. Supports multiple
sensor types
and data formats. Every sensor event becomes a graph node that can
trigger
decisions, feed simulations, and link to other entities.

## How It Works
The sensor dashboard module in `ai-oss-gateway/src/sensor.rs`
implements a
real-time sensor data ingestion pipeline. Sensors are defined as
graph nodes
in the SQLite WAL-backed knowledge graph with metadata — type,
units,
location, sampling rate, calibration data. The ingestion pipeline
receives
sensor data via WebSocket on port 3030 (`sensor_data` messages),
REST
endpoints on port 8081, or file ingestion from configured
directories. Raw
time-series data is stored in a columnar format optimized for range
queries,
linked to the sensor's graph node. The threshold engine evaluates
incoming
data against user-defined alert rules — simple thresholds,
rate-of-change
limits, or composite conditions. Alerts are graph events that can
trigger
operations center threads, cascade into World Engine simulations, or
feed
the alert rules module for ML-based anomaly detection. The
SensorDashboardView renders real-time charts (line, bar, gauge)
using
streaming WebSocket data. The Qwen2-VL-2B-Instruct-Q4_K_M.gguf
model on
CUDA can detect complex anomaly patterns in multi-variate sensor
streams.
All sensor data is stored locally in `./data/` with Timescape
temporal
indexing for historical replay. Config is driven by `opencode.json`
under
the `sensors` section. The CLI includes 87 commands with `sensor`
subcommands.

## How to Operate
1. Start the gateway: `api-oss start` or binary directly
2. Open the SensorDashboardView in the browser at port 8081
3. Register sensors in `opencode.json` under the `sensors` section — ID,
   type, units, location
4. Ingest sensor data via `sensor_data` WebSocket messages, REST POST, or
   file drops
5. Configure alert thresholds per sensor via `alert_rule_create` WS message
6. View real-time streaming charts in the dashboard
7. Monitor historical trends with Timescape temporal navigation
8. Review alerts and correlate with other graph events — decisions,
   intelligence, simulations
9. Use the CLI: `api-oss sensor list`, `api-oss sensor data`,
   `api-oss sensor stats`

## The Moat
- A sensor dashboard that operates entirely offline while integrating with a
  knowledge graph means sensor events are not just displayed —
they become
  graph nodes that trigger decisions, feed simulations, and link to
other
  entities
- The threshold engine is just the first line of detection; ML-based anomaly
  detection adds a second layer
- Every sensor event is recorded with full Timescape provenance for temporal
  analysis
- Sensor data can feed directly into Monte Carlo war games and scenario
  simulations
- No competitor offers a local-first, graph-integrated sensor dashboard that
  works in disconnected environments

## Why Choose API-OSS
Palantir has no standalone sensor dashboard product. Google's IoT
Core and
monitoring tools require cloud connectivity. Nvidia has no sensor
dashboard
product. API-OSS provides a complete real-time sensor dashboard that
operates entirely offline, with every sensor event becoming a graph
node
linked to intelligence, decisions, and simulations. For defense
customers,
this means field sensor monitoring in environments with no network
connectivity.

## Competitive Comparison
- **Palantir**: No standalone sensor dashboard product; cloud-dependent
- **Google**: Cloud IoT Core requires internet; per-message pricing; no
  offline operation
- **Nvidia**: No sensor dashboard product
- **Anthropic**: No sensor dashboard product

## Cost-Benefit Analysis
Google Cloud IoT Core charges $0.0045/message — a field deployment
of 1,000
sensors reporting every minute costs ~$2.4M/year in message fees
alone.
Custom SCADA systems cost $100K–$500K for setup plus $50K/year
maintenance.
API-OSS provides unlimited sensor ingestion at zero software cost
— one-time
hardware of ~$3,000. No per-message fees, no cloud infrastructure. A
defense
organization operating 5,000 field sensors saves $3M–$10M/year.
All sensor
data remains local — no cloud exposure of sensitive telemetry or
sensor
locations.

## Applications
- **Consumer**: Home sensor monitoring, IoT dashboard, weather station data
- **Government / Defense**: Field sensor monitoring, perimeter security,
  acoustic/seismic sensor fusion, environmental monitoring in
theater
- **Enterprise**: Industrial IoT monitoring, environmental sensing, facility
  management, process control monitoring

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

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/SZJMZA
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