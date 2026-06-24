---
title: "Scenario Simulation"
sidebar_position: 99
description: "Enables what-if analysis by branching from the current graph state"
tags: [features]
---

# Scenario Simulation

## What It Does
Enables what-if analysis by branching from the current graph state
into
parallel universes. Users inject hypothetical events and explore
alternative
outcomes without affecting the primary reality. Each scenario is a
fully
isolated fork of the knowledge graph with copy-on-write semantics.

## How It Works
The scenario engine in `ai-oss-gateway/src/scenario.rs` leverages
the World
Engine's universe management to create parallel graph branches. When
a user
initiates a scenario, the system forks the current graph state using
zero-copy clones — the new universe shares all underlying storage
pages via
CoW pointers until writes occur. The user then injects hypothetical
events as
graph mutations: modifying node properties (e.g., "unit strength =
50%"),
adding edges (e.g., "ally declares war"), or removing entities. The
scenario
engine evaluates these changes through the Monte Carlo simulation
engine,
running turn-based simulations within the forked universe. All
simulation
state is stored in SQLite WAL with the fork's own timeline. The
Timescape
engine enables time-travel queries within the scenario to compare
decision
points. The Qwen2-VL-2B-Instruct-Q4_K_M.gguf model on CUDA
evaluates
intermediate outcomes. Frontend views connect via WebSocket to port
3030,
streaming scenario progress in real time. HTTP UI is served on port
8081.
The CLI offers 87 commands including `scenario` subcommands. Config
is driven
by `opencode.json` at root and gateway levels.

## How to Operate
1. Start the gateway via `api-oss start` or direct binary execution
2. Open the ScenarioSimulationView in the browser at port 8081
3. Click "New Scenario" to fork the current graph state — this triggers a
   zero-copy clone
4. Use the event injector panel to add hypothetical mutations: modify nodes,
   add/remove edges, change properties
5. Configure the simulation parameters in `opencode.json` under the
   `scenario` section
6. Run the simulation — the view streams `scenario_progress` WebSocket
   messages on port 3030
7. Compare outcomes side-by-side with the primary reality using
   `world_compare` WS messages
8. Collapse or promote the scenario universe to primary reality if desired

## The Moat
- Branching a live knowledge graph while maintaining referential integrity
  and temporal consistency is a deep systems challenge
- Zero-copy clones enable branching without storage multiplication — 100
  scenarios cost the storage of one
- No cloud provider offers local-first graph-level branching with full
  provenance tracking
- The combination of CoW forks + Monte Carlo evaluation + Timescape
  time-travel is unique
- Fully offline operation is critical for classified scenario planning in
  deployed defense environments
- Every scenario mutation is tracked with full provenance, enabling complete
  audit trails

## Why Choose API-OSS
Palantir operates on a single-reality model with no concept of
scenario
branching. Google and Anthropic offer no equivalent capability.
API-OSS
allows analysts to fork reality at any point, inject hypothetical
events,
and explore alternative outcomes — all offline, all on consumer
hardware.
The zero-copy architecture means unlimited scenario exploration
without
storage costs. For defense customers, this means testing courses of
action
against a live intelligence graph in a contested environment.

## Competitive Comparison
- **Palantir**: Single-reality model; no scenario branching; cloud-dependent;
  $5M+/yr
- **Google**: No equivalent capability
- **Anthropic**: No graph simulation product
- **Nvidia**: No scenario simulation product

## Cost-Benefit Analysis
Palantir's single-reality model requires separate deployments for
each
scenario, costing $2M–$5M per additional environment. API-OSS
provides
unlimited scenario branching at zero additional cost — just the
one-time
hardware investment of ~$3,000 for a CUDA GPU. Cloud-based scenario
simulation from AWS/Azure costs $500–$5,000 per simulation run in
compute
and data egress. API-OSS is free. A defense organization running 100
scenario simulations per month saves $500K–$5M/year. No cloud data
exposure
of classified scenario data.

## Applications
- **Consumer**: "What if I took that job?" life scenario modeling, financial
  what-if analysis
- **Government / Defense**: Battlefield what-if analysis, course-of-action
  comparison, strategic alternative evaluation, campaign planning
- **Enterprise**: Market disruption simulation, strategic alternative
  evaluation, crisis response planning, M&A scenario analysis
