---
title: "Monte Carlo War Game"
sidebar_position: 99
description: "Runs thousands of randomized simulation runs of strategic"
tags: [features]
---

# Monte Carlo War Game

## What It Does
Runs thousands of randomized simulation runs of strategic
scenarios to produce outcome distributions and probabilistic
assessments. Decision-makers understand risk, variance, and
likely outcomes under uncertainty. Each simulation is grounded
in real-world graph data rather than abstract models.

## How It Works
The war game engine lives in `ai-oss-gateway/src/wargame.rs`
and implements a full Monte Carlo simulation loop over the
knowledge graph. On each iteration it samples randomized
variables — force strength, terrain modifiers, supply chain
latency, weather impact, ROE variations, and logistics
constraints — from the graph's current state. Each sample
drives a turn-based simulation where graph nodes (units,
assets, locations, formations) interact through edge-defined
relationships (command hierarchy, supply lines, engagement
ranges). The engine spawns parallel universes via the World
Engine's copy-on-write clone semantics so 10,000 runs share
underlying storage with zero duplication, using CoW pointers.
Results are aggregated into probability distributions,
percentile outcomes, and sensitivity analyses. The
Qwen2-VL-2B-Instruct-Q4_K_M.gguf model evaluates
intermediate tactical decisions via CUDA, scoring each branch
for expected utility. All simulation state, including
intermediate board positions, is stored in the SQLite
WAL-backed graph for full replay. The CLI `wargame` command
triggers runs with configurable iterations, convergence
thresholds, and parallel batch sizes. The frontend connects
via WebSocket to port 3030 to stream real-time progress with
per-run status. HTTP UI is served on port 8081 for interactive
monitoring. Config is driven entirely by `opencode.json` at
the root and gateway level.

## How to Operate
1. Start the gateway: `api-oss start` or run the binary
   directly
2. Open a browser to the HTTP UI on port 8081, navigate to
   War Game view
3. Alternatively, use the CLI: `api-oss wargame --runs
   10000 --config ./scenario.json`
4. Define scenario parameters in `opencode.json` under the
   `wargame` section — target variables, iteration count,
   convergence threshold
5. Monitor progress via WebSocket on port 3030; the view
   streams `wargame_progress` messages with completion
   percentage and ETA
6. Review results as histograms, CDF curves, sensitivity
   tornado charts, and scenario comparison tables in the
   WarGameView
7. Export aggregate results or drill into individual
   simulation traces stored in `./data/` as graph snapshots
   with full provenance

## The Moat
- Combining Monte Carlo methods with a live knowledge graph
  grounds every simulation in real-world data, not abstract
  models
- The compute required to run thousands of war game
  iterations locally — with graph-aware state transitions
  — is architecturally difficult to replicate
- Parallel universe forking via CoW clones means 10,000 runs
  cost the storage of one, an efficiency no competitor
  matches
- Offline operation is critical for deployed defense
  scenarios; no competitor offers a local-first wargaming
  engine
- The Qwen2-VL-2B-Instruct-Q4_K_M.gguf model on CUDA
  provides tactical reasoning at the edge without cloud
  dependency
- SQLite WAL with graph-based simulation state ensures full
  replay and audit of every simulation run
- Every run is a first-class graph node with provenance
  linking inputs, decisions, and outcomes

## Why Choose API-OSS
Palantir's wargaming platform is closed-source, cloud-
dependent, and costs millions per year. Google has no
equivalent standalone wargame offering. API-OSS delivers a
Monte Carlo wargame engine that runs entirely offline on
consumer hardware, grounded in your actual intelligence
graph. Every simulation is fully auditable, forkable, and
repeatable — no black-box models, no cloud dependency, no
per-seat licensing. For defense customers, this means
strategic analysis in disconnected, contested environments
where cloud access is not possible.

## Competitive Comparison
- **Palantir**: Closed wargaming platform with opaque models;
  no local-first simulation capability; $5M+/yr for Gotham
  war games
- **Google**: No equivalent standalone wargame offering
- **Anthropic**: No wargame product
- **Nvidia**: Simulation platforms (Isaac Sim, Modulus) exist
  but are not decision-graph integrated and require cloud or
  expensive GPU clusters

## Cost-Benefit Analysis
Palantir Gotham's wargaming capabilities cost $5M–$10M/year
in licensing plus cloud infrastructure. API-OSS is free, with
a one-time hardware cost of approximately $2,000–$4,000 for a
CUDA-capable GPU running the qwen2-vl-2b-q4-Instruct-
Q4_K_M.gguf model. No per-simulation costs, no data egress
fees, no cloud exposure of classified scenario data. A
defense organization running 10,000 Monte Carlo runs per day
would save $3M–$8M annually in operational costs. Time
savings: Palantir requires 2–4 weeks to configure a new war
game scenario; API-OSS does it in minutes via `opencode.json`
configuration.

## Applications
- **Consumer**: Personal risk assessment for major life
  decisions — job changes, investments, relocations
- **Government / Defense**: Strategic military wargaming,
  campaign outcome analysis, force structure planning,
  readiness assessment
- **Enterprise**: Competitive strategy simulation, market
  scenario planning, M&A outcome analysis, supply chain
  disruption modeling
