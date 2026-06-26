---
title: "Battlespace / Cursor-on-Target"
sidebar_position: 99
description: "Ingests military Cursor-on-Target (CoT) and KML data for real-time"
tags: [features]
---

# Battlespace / Cursor-on-Target

## What It Does
Ingests military Cursor-on-Target (CoT) and KML data for real-time
track
management and battlespace visualization. Provides a Common
Operating
Picture (COP) that works fully offline. Integrates tactical track
data with
the knowledge graph for enriched situational awareness.

## How It Works
The battlespace module in `ai-oss-gateway/src/battlespace.rs`
implements a
full CoT parser compliant with the US military's C2 data standard
(MIL-STD-6040). Incoming CoT messages — containing track position,
speed,
course, classification, and identity — are parsed from XML and
ingested as
graph nodes with geospatial properties. Each track becomes a node in
the
SQLite WAL-backed graph with spatial indexing via R-tree for
efficient
bounding box and nearest-neighbor queries. KML overlay files are
parsed for
geographic features (polygons, paths, waypoints) and merged as
additional
graph entities. The GeoMapView renders the COP using Leaflet.js with
real-time track symbology. Tracks update via WebSocket push from the
gateway
on port 3030, enabling sub-second latency for moving contacts. The
geospatial engine supports CoT event types (start, drop, update) and
maintains full track history in the Timescape for time-travel
replay. The
Qwen2-VL-2B-Instruct-Q4_K_M.gguf model on CUDA can classify and
prioritize
tracks based on behavior patterns. HTTP UI is served on port 8081.
Config is
driven by `opencode.json` at root and gateway levels. All processing
works
entirely offline — critical for tactical deployments where network
connectivity is contested.

## How to Operate
1. Start the gateway: `api-oss start` or binary directly
2. Open the BattlespaceView in the browser at port 8081
3. Configure CoT feed sources in `opencode.json` under the `battlespace`
   section — UDP multicast ports, TCP connections, file watches
4. Ingest CoT data manually via WebSocket message `battlespace_ingest_cot`
   or automatically from configured feeds
5. Import KML overlays via `battlespace_ingest_kml` WS message or file drop
   in the UI
6. Tracks appear in real-time on the Leaflet map with military symbology
7. Click any track to view its full graph context — linked intelligence,
   decision history, sensor provenance
8. Use time scrubber to replay track history from the Timescape store
9. Export the COP as a graph snapshot or KML file to `./data/`

## The Moat
- Implementing Cursor-on-Target — the US military's C2 data standard — in a
  local-first Rust stack is unprecedented
- Most CoT implementations are cloud-dependent or require proprietary
  middleware like Palantir Gotham
- Full offline operation with local spatial indexing (R-tree in SQLite)
  means the COP works in radio-silent, contested environments
- Integration with the knowledge graph means tracks are not just map
  markers — they are graph nodes with provenance, decisions, and
  intelligence links
- Timescape time-travel enables replay of any historical track in full
  context
- The Qwen2-VL-2B-Instruct-Q4_K_M.gguf model on CUDA provides local
  ML-based track classification without cloud dependency

## Why Choose API-OSS
Palantir Gotham offers CoT integration but requires cloud
connectivity and
costs millions per year. Google Maps API requires internet and has
no CoT
support. API-OSS provides a full battlespace COP with
military-standard CoT
ingestion, KML overlay, and real-time track management — entirely
offline
on consumer hardware. Every track is a first-class graph node linked
to
intelligence, decisions, and sensor data. For deployed defense
forces, this
means actionable situational awareness without a network connection.

## Competitive Comparison
- **Palantir**: Gotham offers CoT integration but is cloud-dependent and
  proprietary; $5M+/yr licensing
- **Google**: Google Maps API requires internet; no CoT support;
  usage-based pricing at $200–$2,000/month
- **Nvidia**: No C2/battlespace product
- **Anthropic**: No battlespace product

## Cost-Benefit Analysis
Palantir Gotham's battlespace capabilities cost $5M–$10M/year with
per-user
CALA licensing. Google Maps API for similar track visualization
costs
$200–$2,000/month and requires persistent internet for every user.
API-OSS
provides equivalent or superior CoT track management at zero
software cost
— one-time hardware of ~$3,000. No cloud data exposure of
classified track
data. A defense organization operating a COP for a brigade-level
deployment
saves $4M–$8M/year in software licensing alone. Zero data egress
costs.
Full offline operation eliminates the need for SATCOM bandwidth for
map
tiles and track services.

## Applications
- **Consumer**: Not applicable
- **Government / Defense**: Tactical C2, situational awareness, coalition
  interoperability, blue-force tracking, airspace management,
maritime
  domain awareness
- **Enterprise**: Logistics tracking, asset movement visualization, fleet
  coordination, field service management

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
