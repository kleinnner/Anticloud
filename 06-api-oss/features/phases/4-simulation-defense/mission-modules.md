---
title: "Mission Modules"
sidebar_position: 99
description: "Pre-built capability modules for defense and intelligence missions."
tags: [features]
---

# Mission Modules

## What It Does
Pre-built capability modules for defense and intelligence missions.
Each
module packages domain-specific views, graph schemas, alert rules,
and
simulation templates for a specific mission type. Modules are
self-contained,
composable, and conflict-free.

## How It Works
The mission modules system in
`ai-oss-gateway/src/module_registry.rs`
implements a modular capability framework. Each mission module is a
self-contained package containing: a graph schema extension (nodes,
edges,
properties specific to the mission domain), frontend views
(domain-specific
UI components for the HTTP UI on port 8081), WebSocket message
handlers
(misson-specific operations on port 3030), alert rule templates,
simulation
templates for the World Engine, and configuration defaults for
`opencode.json`. The module registry maintains an index of installed
modules,
their dependencies, and compatibility. When a module is loaded, the
schema
merger integrates its graph schema with the existing knowledge graph
—
detecting and resolving conflicts (naming collisions, property type
mismatches)
through a dependency resolver. Each module operates in a sandbox —
its views,
handlers, and schemas are isolated from other modules, preventing
side
effects. The dependency resolver handles inter-module dependencies
— module
A requiring module B's schema or services. The
Qwen2-VL-2B-Instruct-Q4_K_M.gguf model on CUDA can suggest
relevant
modules based on the current graph state and mission profile. Module
state
is stored in SQLite WAL in `./data/`. Config is driven by
`opencode.json`
under the `mission_modules` section with module enable/disable and
configuration parameters. The CLI includes 87 commands with `module`
subcommands.

## How to Operate
1. Start the gateway: `api-oss start` or binary directly
2. Open the Mission Modules view in the browser at port 8081
3. Browse available modules — each shows description, version, dependencies,
   and compatibility
4. Install a module via `install_mission_module` WebSocket message or UI
5. The schema merger integrates the module's graph schema with existing
   schemas
6. Enable/disable modules individually — disabled modules are unloaded
   without data loss
7. Configure module-specific settings in `opencode.json` under that module's
   name
8. View module status — enabled, schema version, active views, registered
   handlers
9. Use module-specific views that appear in the UI after installation
10. Use the CLI: `api-oss module list`, `api-oss module install`,
    `api-oss module enable`, `api-oss module configure`

## The Moat
- Designing modular, composable mission capabilities that plug into the same
  knowledge graph — without conflicts or schema drift — requires
careful
  interface design and module isolation
- Each module is a self-contained set of graph schemas, views, and behaviors
  that compose safely
- The schema merger with conflict detection ensures modules work together
  without data corruption
- Sandboxed execution prevents modules from interfering with each other
- Dependency resolution enables complex module chains — SIGINT depends on
  geospatial, targeting depends on entity resolution
- No competitor offers a modular, composable mission module system for graph
  intelligence

## Why Choose API-OSS
Palantir's capabilities are monolithic — there is no module system
for
composing mission-specific capabilities. Google and Anthropic have
no
mission module product. API-OSS provides a modular capability
framework
where defense organizations can compose exactly the mission module
stack
they need — SIGINT, HUMINT, targeting, logistics — each as a
pluggable
module that works offline on local hardware.

## Competitive Comparison
- **Palantir**: No modular mission module system; capabilities are monolithic
  and cloud-dependent
- **Google**: No equivalent product
- **Anthropic**: No mission module product
- **Nvidia**: No mission module product

## Cost-Benefit Analysis
Palantir requires full-stack licensing ($5M+/yr) even if only a
subset of
capabilities is needed — no modularity. Custom mission-specific
tool
development costs $500K–$3M per module. API-OSS provides modular
mission
capabilities at zero software cost — organizations install only
the modules
they need. One-time hardware of ~$3,000. A defense intelligence
organization
needing 3 of 10 possible mission modules saves $3M–$7M/year
compared to
Palantir full-stack licensing. Module development cost is eliminated
—
pre-built modules cover SIGINT, HUMINT, targeting, logistics, and
more.

## Applications
- **Consumer**: Not applicable
- **Government / Defense**: Mission-specific capability packages (SIGINT,
  HUMINT, targeting, logistics, cyber, intelligence preparation of
the
  battlespace)
- **Enterprise**: Industry-specific module packs (finance compliance,
  healthcare analytics, logistics optimization, supply chain risk)

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

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
