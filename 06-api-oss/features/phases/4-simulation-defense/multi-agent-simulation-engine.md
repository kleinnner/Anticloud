---
title: "Multi-Agent Simulation Engine"
sidebar_position: 99
description: "Spawns autonomous agent societies that interact, communicate, and"
tags: [features]
---

# Multi-Agent Simulation Engine

## What It Does
Spawns autonomous agent societies that interact, communicate, and
make
decisions within the knowledge graph. Each agent has graph-native
awareness,
can call tools, and exhibits emergent behaviors from agent-to-agent
and
agent-to-graph interactions. Users observe how decentralized
decision-making
unfolds without direct intervention.

## How It Works
The simulation runtime in `ai-oss-gateway/src/simulation.rs`
implements a
turn-based multi-agent framework. Agents are graph nodes with
attached
behavior scripts — they perceive their environment by querying the
graph,
reason using the Qwen2-VL-2B-Instruct-Q4_K_M.gguf model on CUDA,
and act
by mutating graph state (creating nodes, edges, or invoking tools).
Each
turn advances all agents atomically: perception phase, deliberation
phase
(model inference), action phase (graph writes). The World Engine
forks child
universes for each simulation run via copy-on-write clones, allowing
hundreds of parallel agent societies without storage multiplication.
Agent-to-agent communication is modeled as graph edges with message
payloads, fully recorded in the provenance graph. The SQLite WAL
stores all
simulation state. The Timescape engine enables time-travel queries
to replay
agent decision sequences. Frontend views (SimulationView,
SimulationPanelView) connect via WebSocket to port 3030 for live
agent
observation. HTTP UI is served on port 8081. Config is driven by
`opencode.json` with agent definitions, population counts, and turn
limits.

## How to Operate
1. Start the gateway: `api-oss start` or binary directly
2. Navigate to the SimulationView in the browser at port 8081
3. Define agent populations in `opencode.json` under the `simulation`
   section — agent types, behavior scripts, initial graph state
4. Click "Start Simulation" — this sends a `simulation_start` WebSocket
   message on port 3030
5. Observe agents in real-time: the view streams
   `simulation_agent_message` and `simulation_turn_complete`
messages
6. Advance turns manually or let the engine auto-advance with configurable
   tick rate
7. Pause, inspect individual agent state, and modify agent parameters
   mid-simulation
8. Export simulation results as graph snapshots to `./data/` for post-hoc
   analysis

## The Moat
- Building a simulation engine where agents have graph-native awareness
  requires bridging agent frameworks with graph databases — a
novel
  integration
- The turn-based atomic advancement with perception-deliberation-action
  cycles at graph scale is architecturally demanding
- Parallel universe forking via CoW semantics allows mass parallel agent
  societies at zero storage cost
- Each agent decision is recorded with full provenance in the graph,
  enabling complete replay and audit
- Offline operation with local LLM inference on CUDA means agent simulations
  work in disconnected environments
- Emergent behavior observation at the graph level is not available from
  any competitor

## Why Choose API-OSS
Palantir has no multi-agent simulation capability. Google's DeepMind
research focuses on RL environments, not graph-integrated agent
societies.
Anthropic researches agent behavior but has no graph-integrated
product.
Nvidia's Isaac Sim targets robotics, not autonomous agent societies.
API-OSS
provides a full multi-agent simulation platform native to the
knowledge
graph, enabling defense analysts to model adversary behavior, social
dynamics, and decentralized decision-making — all offline on local
hardware.

## Competitive Comparison
- **Palantir**: No multi-agent simulation capability; cloud-dependent
- **Google**: DeepMind's agent research but no integrated product; requires
  cloud
- **Anthropic**: Research into agent behavior but no graph-integrated
  simulation
- **Nvidia**: Isaac Sim for robotics, not autonomous agent societies;
  requires expensive GPU hardware

## Cost-Benefit Analysis
Dedicated multi-agent simulation platforms (NetLogo, Mesa) provide
no graph
integration and require separate infrastructure. Building a custom
solution
costs $500K–$2M in development. Palantir integration for agent
behavior
modeling adds $1M–$3M/year. API-OSS provides a built-in
multi-agent engine
at zero additional cost — one-time hardware of ~$3,000 for CUDA
inference.
No cloud compute costs for agent model inference — the
Qwen2-VL-2B-Instruct-Q4_K_M.gguf model runs locally. A defense
organization running agent-based simulations for adversary modeling
saves
$500K–$2M/year.

## Applications
- **Consumer**: Simulating social dynamics, personal decision ecosystems,
  household resource allocation
- **Government / Defense**: Adversary behavior modeling, population
  dynamics, information warfare simulation, decentralized command
analysis
- **Enterprise**: Market competition simulation, organizational behavior
  modeling, supply chain disruption scenarios
