---
title: "Timescape Temporal Analysis"
sidebar_position: 99
description: "Enables temporal graph analysis — querying the graph as it existed"
tags: [features]
---

# Timescape Temporal Analysis

## What It Does
Enables temporal graph analysis — querying the graph as it existed
at any
historical point, branching from historical states, and
time-traveling
through graph evolution. Users can ask "what did the graph know on
this
date?" and explore the full timeline of knowledge.

## How It Works
The Timescape module in `ai-oss-gateway/src/timescape.rs` implements
a
temporal indexing system over the graph mutation log. Every mutation
to the
SQLite WAL-backed knowledge graph is recorded with a monotonically
increasing timestamp and a cryptographic hash of the previous state.
The
temporal index maps timestamps to graph state roots, enabling O(log
n)
reconstruction of the graph at any historical point. State
reconstruction
does not require snapshots — it replays mutations from the nearest
root
state using the WAL, applying only the relevant changes. The
Timescape
engine supports branching from historical states — forking the
graph as it
existed at time T, which triggers a zero-copy clone via the World
Engine.
Time-travel queries use the standard graph query interface with an
added
timestamp parameter, returning results as they would have appeared
at that
time. The TimescapeView on the HTTP UI at port 8081 provides a
temporal
navigation interface with a timeline scrubber, date picker, and
animation
controls for stepping through graph evolution. The
Qwen2-VL-2B-Instruct-Q4_K_M.gguf model on CUDA can analyze
temporal
patterns — emergence of relationships, entity evolution, knowledge
gaps over
time. Frontend connects via WebSocket to port 3030. Config is driven
by
`opencode.json` under the `timescape` section with retention policy
and
index parameters. All temporal data is stored in `./data/`.

## How to Operate
1. Start the gateway: `api-oss start` or binary directly
2. Open the TimescapeView in the browser at port 8081
3. Use the timeline scrubber to navigate through graph history
4. Click "Branch from Here" to fork the graph at any historical point —
   creates a World Engine universe
5. Run standard graph queries with timestamp parameter to see historical
   state
6. Use the animation controls to step through graph evolution over time
7. Compare two historical states using graph diff
8. Export historical graph snapshots to `./data/`
9. Configure retention policy in `opencode.json` under
   `timescape.retention`

## The Moat
- Temporal graph databases are extremely hard to implement efficiently at
  scale
- API-OSS tracks every mutation with timestamped provenance, enabling full
  time-travel without snapshot storage overhead
- O(log n) state reconstruction from the mutation log means even
  billion-node graphs can be queried historically
- Branching from historical states via the World Engine enables "what if"
  analysis on past knowledge
- Timescape beats Palantir's time navigation which is limited to recent
  history and cloud-based
- The combination of temporal indexing + CoW branching + graph diff is
  unique in the industry

## Why Choose API-OSS
Palantir's time navigation exists but is limited to recent history
and
requires cloud infrastructure. Google and Anthropic offer no
temporal
analysis product. API-OSS provides full time-travel capability on
the
knowledge graph — query any historical state, branch from any
point, and
animate graph evolution — all offline on consumer hardware. For
intelligence
analysts, this means reconstructing exactly what was known at any
moment in
an operation.

## Competitive Comparison
- **Palantir**: Time navigation exists but is limited to recent history,
  cloud-dependent; $5M+/yr
- **Google**: No equivalent product
- **Anthropic**: No temporal analysis product
- **Nvidia**: No temporal analysis product

## Cost-Benefit Analysis
Building temporal graph capabilities with snapshot-free time-travel
typically
costs $1M–$5M in R&D. Enterprise graph databases (Neo4j, ArangoDB)
provide
limited temporal features with significant storage overhead —
snapshots
double storage per point-in-time. API-OSS provides full temporal
analysis at
zero software cost — one-time hardware of ~$3,000. Zero snapshot
storage
overhead — historical queries reconstruct from mutation logs. A
defense
organization performing timeline analysis across 5 years of
intelligence
operations saves $1M–$5M in custom development. Time savings:
manual
timeline reconstruction takes days; API-OSS provides instant
historical
queries.

## Applications
- **Consumer**: Personal history exploration, life timeline, knowledge
  progression tracking
- **Government / Defense**: Historical intelligence analysis, timeline
  reconstruction, pattern-of-life analysis, operational chronology
- **Enterprise**: Regulatory timeline reconstruction, audit history,
  knowledge base evolution tracking, compliance documentation
