---
title: "App Builder"
sidebar_position: 99
description: "A no-code / low-code application builder for constructing custom applications on top of the"
tags: [features]
---

# App Builder

## What It Does
A no-code / low-code application builder for constructing custom applications on top of the
API-OSS knowledge graph. Combines dashboards, forms, workflows, and pipeline components
into cohesive, runnable applications. Applications are stored as graph nodes, attested by
the ledger, and shareable via Passaporte identities. The runtime supports up to 50 concurrent
application sessions with configurable resource limits per app and automatic reconnection
using jittered exponential backoff matching the WebSocket protocol's retry policy.

## How It Works
The App Builder lives in the frontend as `AppBuilderView`, a component palette with
drag-and-drop layout editor supporting dashboard, form, workflow, and pipeline components.
Each component binds to graph queries through a property inspector, feeding live data into
UI elements. The application definition is serialized as a graph meta-node: a node whose
properties describe the component tree, layout, and data bindings. When an application is
deployed, the Rust runtime in `app_builder.rs` (under `ai-oss-gateway/src/`) resolves the
meta-node, instantiates the component tree, and opens a WebSocket channel for each
component to stream graph data. Authentication and authorization flow through Passaporte
roles — each application inherits the operator's identity and permission scope. The runtime
components communicate via the same WS protocol (port 3030) that drives all frontend views.
Applications can be published to a local catalog, shared with other Passaporte holders, or
exported as standalone archives. The ledger records every deploy, publish, and share event,
providing a full audit trail. Under the hood, the component data binding uses the same graph
query language exposed by the REST API (auto-generated via utoipa at `/docs`) and the CLI's
`api-oss graph query` command. The application graph meta-nodes support versioning: each
publish creates a new version node linked to the previous one, enabling rollback. Component
libraries can be extended via WASM plugins running in the sandboxed wasmtime runtime — a
plugin can register new component types that appear in the palette. Config drives everything
via `opencode.json` at root and gateway level, controlling app storage paths, role-based
access policies, and default component library paths.

## How to Operate
1. Start the gateway: run `api-oss start` or launch the binary directly. The HTTP UI opens
   on port 8081.
2. Open a browser to `http://localhost:8081` and navigate to the App Builder view.
3. Drag components (dashboard, form, workflow, pipeline) from the palette onto the canvas.
4. Use the property inspector to bind each component to a graph query — these queries use
   the same syntax as `api-oss graph query`.
5. Click "Preview" to test the application locally. The frontend connects via WebSocket to
   port 3030 for live data streaming.
6. Click "Publish" to save the application as a graph meta-node. The CLI command
   `api-oss graph query --type app` lists all published applications.
7. Share with another user: use the share button to generate a Passaporte-scoped share link,
   or run `api-oss share qr --app <id>` to generate a QR code.
8. For headless deployment, use the WS messages `app_save`, `app_load`, `app_list`,
   `app_publish`, and `app_share` — all 412 client messages and 398 server messages are
   available at port 3030.
9. Configure `opencode.json` at the root or gateway level to set default app storage paths
   and role-based access policies.
10. Extend the component palette by installing WASM plugins from the marketplace — new
    component types appear automatically.

## The Moat
- No competitor offers a no-code app builder targeting a local-first, sovereign AI engine.
  Every comparable tool (Palantir Slate, Microsoft Power Apps, Retool) is cloud-only and
  requires ongoing subscription payments.
- Applications are stored as graph nodes inside the knowledge graph, not in a separate
  database — this means every app, its data bindings, and its version history are natively
  queryable, auditable by the ledger, and synchronizable via P2P sync using CRDT conflict
  resolution.
- The entire builder works fully offline with zero internet required — no competitor's app
  builder can make that claim for AI-powered applications.
- WASM plugin extensibility (via wasmtime sandbox) means the component palette can grow
  arbitrarily without compromising memory safety or requiring core engine changes.
- The ledger attestation of every deploy, publish, and share event provides a cryptographic
  audit trail that no competitor's no-code platform offers.

## Why Choose API-OSS
A government agency operating in an air-gapped facility can build custom intelligence
dashboards using the App Builder without writing a single line of code, without sending data
to any cloud, and without purchasing expensive per-seat licenses. An enterprise can deploy
line-of-business applications that share the same graph backend as their AI workflows,
eliminating data silos. A consumer can build personal tools that run entirely on their
laptop, syncing to their phone via the PWA and QR code pairing. No other platform combines
no-code app development with a sovereign, offline-first AI engine running the
Qwen2-VL-2B-Instruct-Q4_K_M.gguf model with CUDA backend.

## Competitive Comparison
- **Palantir**: Foundry Slate app builder exists but is cloud-only, proprietary, and priced
  per-user at enterprise tiers. No offline mode. No graph-native app storage.
- **Microsoft**: Power Apps is cloud-only with per-user licensing ($20/user/month). Requires
  Azure backend. No AI graph engine. No offline sovereignty.
- **OpenAI**: GPTs (custom GPTs) are app-like but cloud-only, restricted to OpenAI's model,
  and cannot run offline or access local data sources.
- **Retool**: Self-hosted option exists but has no AI graph backend, no ledger audit, and no
  offline-first architecture. Priced per user.
- **Google**: AppSheet is cloud-only, requires Google Workspace, no AI decision engine.

## Cost-Benefit Analysis
Retool self-hosted starts at $100/user/month; Palantir Foundry costs $500k+/year minimum.
API-OSS App Builder costs $0 — it ships as part of the single ~81 MB binary. A one-time
hardware purchase (e.g., a $2,000 workstation with CUDA GPU running
Qwen2-VL-2B-Instruct-Q4_K_M.gguf) replaces an entire Retool/Power Apps/Palantir stack
that would cost $50k–$500k/year. ngrok charges $20/month for tunnels to expose apps
externally; API-OSS has built-in public URL tunnel with Let's Encrypt TLS at no cost.
The time savings from no-code app development (days instead of weeks) and the elimination
of cloud dependency risk further improve the ROI. For a team of 10 developers, the annual
savings exceed $200k when factoring in licensing, infrastructure, and tunnel costs.

## Applications
- **Consumer**: Build personal dashboards and tools without coding — budget tracker, home
  inventory, reading list, all running locally and syncing between devices via P2P sync.
- **Government / Defense**: Rapidly deploy custom intelligence applications in air-gapped
  environments. No data exfiltration, full audit trail via ledger attestation.
- **Enterprise**: Line-of-business applications, department tools, operational dashboards
  that share the same graph, ledger, and auth as the enterprise AI platform. Applications
  are versioned, auditable, and deployable across the organization.

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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
