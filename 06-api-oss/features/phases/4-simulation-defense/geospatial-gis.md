---
title: "Geospatial / GIS"
sidebar_position: 99
description: "Provides spatial indexing, bounding box queries, GeoJSON import, and"
tags: [features]
---

# Geospatial / GIS

## What It Does
Provides spatial indexing, bounding box queries, GeoJSON import, and
map
visualization using Leaflet.js. Integrates with Cursor-on-Target for
full
geospatial intelligence capability — all offline. Every geospatial
entity is
a first-class graph node with full provenance.

## How It Works
The geospatial module in `ai-oss-gateway/src/geospatial.rs`
implements a
complete offline GIS stack. Spatial indexing uses an R-tree stored
in SQLite
WAL for efficient bounding box and nearest-neighbor queries. Each
geospatial entity (point, line, polygon, multi-polygon) is a graph
node with
GeoJSON-compatible properties stored as node attributes. The GeoJSON
parser
handles import and export of standard geospatial data. The
Leaflet.js-based
GeoMapView renders map layers with custom markers, heatmaps, and
tile
overlays — tile caching ensures offline operation. The spatial
query engine
supports bbox queries (`geo_bbox`), nearest-neighbor search
(`geo_nearest`),
and spatial joins. Integration with the battlespace module enables
CoT track
overlay on the same map. The Timescape engine supports time-travel
queries
on geospatial entities — viewing asset positions at any historical
point.
The Qwen2-VL-2B-Instruct-Q4_K_M.gguf model on CUDA can analyze
spatial
patterns and suggest geospatial correlations. Frontend views connect
via
WebSocket to port 3030 for real-time map updates. HTTP UI is served
on port
8081. Config is driven by `opencode.json` with map settings, tile
sources,
and spatial index parameters. All data is stored locally in
`./data/`. The
CLI includes 87 commands with `geo` subcommands.

## How to Operate
1. Start the gateway: `api-oss start` or binary directly
2. Open the GeoMapView in the browser at port 8081
3. Import geospatial data via GeoJSON file drop or `geo_import_geojson`
   WebSocket message
4. Index a graph node with a location via `geo_index_node` WS message
5. Perform spatial queries — bounding box, nearest neighbor — through the
   UI or WS messages
6. View entities on the Leaflet map with full graph context on click
7. Use the time scrubber for historical position replay via Timescape
8. Export map views as GeoJSON or image captures to `./data/`
9. Configure map settings in `opencode.json` under the `geospatial` section
   — default center, zoom, tile source

## The Moat
- A fully offline GIS stack with spatial indexing, nearest-neighbor queries,
  and military standard integration (CoT) without any internet
connectivity
- Google Maps API and similar services are useless without a network;
  API-OSS works anywhere
- Spatial indexing in SQLite with R-tree provides sub-millisecond queries
  on millions of points
- Integration with the knowledge graph means every location is linked to
  intelligence, decisions, and sensors
- Timescape time-travel on geospatial data enables full historical track
  replay
- Leaflet.js with offline tile caching means no cloud map tile dependency

## Why Choose API-OSS
Palantir Gotham has GIS capabilities but requires cloud connectivity
and
costs millions per year in licensing. Google Maps API requires
persistent
internet and has usage-based pricing. API-OSS provides a complete
offline
GIS stack with spatial indexing, military-standard CoT integration,
and full
knowledge graph linkage — all on consumer hardware. For defense
customers,
this means geospatial intelligence in environments where no network
exists.

## Competitive Comparison
- **Palantir**: Gotham has GIS but requires cloud and proprietary licensing;
  $5M+/yr
- **Google**: Google Maps API requires internet; no offline spatial indexing;
  $200–$2,000/month usage-based
- **Nvidia**: No GIS product
- **Anthropic**: No GIS product

## Cost-Benefit Analysis
Palantir Gotham GIS capabilities cost $5M–$10M/year for a
division-level
deployment. Google Maps API for equivalent geospatial query volume
costs
$200–$2,000/month plus $500–$5,000/month for premium features
— and
requires internet connectivity for every user. API-OSS provides a
complete
offline GIS at zero software cost — one-time hardware of ~$3,000.
No
per-query costs, no data egress fees. A defense organization running
geospatial analysis for a deployed brigade saves $4M–$8M/year. All
sensitive
location data remains local — no cloud exposure of troop positions
or target
coordinates.

## Applications
- **Consumer**: Offline mapping, personal geospatial data management, hiking
  and expedition planning
- **Government / Defense**: Tactical mapping, terrain analysis, target
  geolocation, route planning, battlespace management
- **Enterprise**: Logistics routing, asset location tracking, field service
  optimization, store network planning

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

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

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
