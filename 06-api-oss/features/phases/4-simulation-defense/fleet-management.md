---
title: "Fleet Management"
sidebar_position: 99
description: "Manages distributed API-OSS instances as a fleet with central policy"
tags: [features]
---

# Fleet Management

## What It Does
Manages distributed API-OSS instances as a fleet with central policy
push,
health monitoring, and audit logging. Enables organizations to
operate many
API-OSS nodes from a single command point. Nodes operate
independently when
disconnected and synchronize when connectivity is available.

## How It Works
The fleet management module in `ai-oss-gateway/src/fleet.rs`
implements a
coordinator-based architecture for managing multiple API-OSS
instances. Each
node in the fleet registers with a fleet identifier, role, and
capability
set via `fleet_register` WebSocket messages. The fleet registry is
stored in
the local SQLite WAL-backed graph. Fleet policies are defined in
`opencode.json` at the fleet level — data sharing rules, sync
schedules,
role assignments, and access controls. The policy engine pushes
updates to
registered nodes via WebSocket on port 3030 or through peer-to-peer
sync
when direct connections are unavailable. Health monitoring polls
each node's
status endpoint, tracking CPU, memory, graph size, and active
operations —
visualized in the FleetView on the HTTP UI at port 8081. Audit
logging
records all fleet-level operations: policy changes, node
additions/removals,
sync events, and config modifications. Federated queries
(`federated_query`) can span fleet nodes for cross-instance
intelligence.
The CLI includes 87 commands with `fleet` subcommands. All fleet
state is
stored in `./data/`. Config is driven by `opencode.json` at root and
gateway levels.

## How to Operate
1. Start the primary gateway: `api-oss start` on the command node
2. Open the FleetView in the browser at port 8081
3. Configure fleet settings in `opencode.json` under the `fleet` section —
   fleet ID, allowed roles, sync schedule
4. Register nodes: on each secondary instance, configure `opencode.json`
   with the primary fleet URL, then start `api-oss start`
5. Nodes appear in the fleet dashboard with health status
6. Push policies to the fleet via `fleet_push_policy` WebSocket message
7. Monitor node health via the FleetView — real-time status indicators and
   metric charts
8. View audit logs for all fleet operations via `fleet_node_audit` WS
   messages
9. Use the CLI: `api-oss fleet list`, `api-oss fleet push-policy`,
   `api-oss fleet node-status`

## The Moat
- Fleet management that works fully offline with peer-to-peer
  synchronization is architecturally harder than cloud-dependent
fleet
  management
- Each node can operate independently in disconnected environments and sync
  when connected — critical for defense deployments
- The integration with federated queries means fleet operations span all
  nodes as a single virtual graph
- No competitor offers a local-first fleet management platform for knowledge
  graph systems
- Policies pushed from the command node are cryptographically verified by
  receiving nodes
- Health monitoring and audit logging at the fleet level provide full
  visibility without cloud dependency

## Why Choose API-OSS
Palantir's fleet management for Gotham deployments requires
persistent cloud
connectivity and costs millions per year. Google has no equivalent
fleet
product for local-first systems. API-OSS provides complete fleet
management
for distributed knowledge graph instances that operate independently
when
disconnected and synchronize when connected. For defense customers
operating
tactical nodes in disparate locations, this means centralized
management
without centralized infrastructure.

## Competitive Comparison
- **Palantir**: Fleet management exists but requires cloud connectivity;
  nodes cannot operate independently; $5M+/yr
- **Google**: No equivalent fleet product for local-first systems
- **Anthropic**: No fleet management product
- **Nvidia**: No fleet management product

## Cost-Benefit Analysis
Managing distributed Palantir deployments requires a dedicated cloud
infrastructure costing $2M–$5M/year plus per-node licensing at
$50K–$200K/node/year. API-OSS fleet management is free —
one-time hardware
cost of ~$3,000 per node. A defense organization operating 50
tactical
nodes saves $10M–$15M/year in licensing and cloud infrastructure.
No network
bandwidth costs for cloud sync — peer-to-peer sync happens
opportunistically.
Nodes operate fully offline, eliminating the need for expensive
SATCOM
bandwidth for fleet management.

## Applications
- **Consumer**: Multi-device personal API-OSS sync, home lab management
- **Government / Defense**: Distributed tactical node management in
  disconnected environments, coalition operations, multi-echelon
command
- **Enterprise**: Multi-site API-OSS deployment management, branch office
  synchronization, global knowledge graph distribution

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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/YMJKOG
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