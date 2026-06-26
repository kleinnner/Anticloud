---
title: "World Engine"
sidebar_position: 99
description: "Parallel universe management — fork reality from any point, clone"
tags: [features]
---

# World Engine

## What It Does
Parallel universe management — fork reality from any point, clone
worlds,
inject events, and auto-simulate outcomes. Users can explore
alternate
histories and futures without contaminating their primary reality.
Reality
is just one branch of many.

## How It Works
The World Engine in `ai-oss-gateway/src/world_engine.rs` implements
a
universe registry that manages multiple parallel graph realities on
top of
the SQLite WAL-backed store. Each universe is a zero-copy clone of
the
graph — using copy-on-write semantics, all universes share the
same
underlying storage pages until a mutation occurs. When a user spawns
a new
world (`world_spawn`), the engine creates a new universe context
with a
pointer to the parent graph state. Mutations within a universe
create new
page versions only for changed data — unchanged data continues to
be shared.
The World Engine supports: fork (clone current state as new
universe),
collapse (discard a universe), inject (mutate graph in a universe),
compare
(diff two universes), and auto-simulate (run Monte Carlo simulation
within
a universe). Auto-simulation uses the war game engine (`wargame.rs`)
to
automatically advance universe state through the scenario simulation
engine.
The Qwen2-VL-2B-Instruct-Q4_K_M.gguf model on CUDA can evaluate
universe
states and suggest interesting branches. Universe metadata (creation
time,
parent, tags, status) is stored in the graph itself. Frontend views
connect
via WebSocket to port 3030 for real-time universe navigation. HTTP
UI is
served on port 8081. Config is driven by `opencode.json` under the
`world_engine` section with universe limits and auto-simulation
parameters.
All universe data is stored in `./data/`.

## How to Operate
1. Start the gateway: `api-oss start` or binary directly
2. Open the World Engine view in the browser at port 8081
3. View the universe tree — hierarchical view of all universes and their
   parent relationships
4. Fork a new universe from any point via `world_spawn` WebSocket message
   or UI button
5. Inject events into a universe — modify nodes, add/remove edges, change
   properties
6. Compare universes side-by-side using `world_compare` — graph diff
   visualization
7. Auto-simulate a universe — the engine runs Monte Carlo to advance its
   state
8. Collapse unwanted universes with `world_collapse` — discarded universes
   are garbage collected
9. Promote a universe to primary reality if desired
10. Use the CLI: `api-oss world list`, `api-oss world spawn`,
    `api-oss world compare`

## The Moat
- True parallel universe management with copy-on-write graph cloning, event
  injection, and automated simulation requires an architecture where
reality
  is just one branch of many
- Palantir operates on a single-reality model with no concept of universe
  forking
- Zero-copy clones via CoW pointers mean 1,000 universes cost the storage
  of one — an efficiency no competitor matches
- The combination of CoW forking + Monte Carlo auto-simulation + Timescape
  time-travel is unique
- Offline operation means universe exploration works anywhere
- Each universe has full provenance — creation time, parent, mutation history

## Why Choose API-OSS
Palantir operates on a single-reality model — there is no way to
fork the
graph, inject hypothetical events, and explore alternate outcomes
without
contaminating the primary data. API-OSS provides a full World Engine
where
reality is just one branch. Defense analysts can explore "what if"
scenarios
— alternate orders of battle, different ROEs, alternative
strategic decisions
— in isolated universes without affecting the operational picture.

## Competitive Comparison
- **Palantir**: Single-reality model; no parallel universe capability;
  cloud-dependent
- **Google**: No equivalent product
- **Anthropic**: No universe management product
- **Nvidia**: No universe management product

## Cost-Benefit Analysis
Palantir's single-reality model requires separate deployments for
each
scenario, costing $2M–$5M per additional environment. API-OSS
provides
unlimited parallel universes at zero additional cost — one-time
hardware of
~$3,000. The CoW architecture means 1,000 universes cost the same
storage as
one. A defense organization running 500 scenario simulations per
year saves
$2M–$5M in deployment costs. Time savings: Palantir requires 2–4
weeks to
stand up a parallel environment; API-OSS forks a universe in
milliseconds.

## Applications
- **Consumer**: Personal "alternate life" exploration, decision outcome
  simulation
- **Government / Defense**: Campaign outcome simulation, strategic
  alternatives, ROE comparison, enemy course-of-action analysis
- **Enterprise**: Market scenario planning, M&A outcome simulation,
  competitive response modeling

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
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
