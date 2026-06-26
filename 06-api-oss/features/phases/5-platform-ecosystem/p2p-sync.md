---
title: "P2P Sync"
sidebar_position: 99
description: "Direct peer-to-peer graph synchronization between API-OSS instances over a full mesh"
tags: [features]
---

# P2P Sync

## What It Does
Direct peer-to-peer graph synchronization between API-OSS instances over a full mesh
topology with no central server required. Each instance connects directly to its peers for
bidirectional graph and ledger sync. Uses delta-based sync (sending only changed nodes since
last sync), CRDT-based conflict resolution for automatic merging, and encrypted channels via
Noise Protocol or TLS 1.3. Supports NAT traversal via STUN/ICE for cross-network operation.

## How It Works
P2P sync is implemented in `p2p.rs` and `sync.rs` under `ai-oss-gateway/src/`. The `p2p.rs`
module handles peer connectivity: NAT traversal via STUN/ICE (using the `str0m` crate),
encrypted channels using the Noise Protocol framework (or TLS 1.3), and mesh topology
management with peer list exchange. Each peer accepts incoming connections on a configurable
port (default 3030, same as WebSocket) and initiates outgoing connections to known peers.
The `sync.rs` module handles data synchronization logic. When a peer connects, both peers
exchange their latest sync cursors (per-peer vector clocks tracking which updates each peer
has seen). Each then computes a delta: the set of graph nodes and ledger entries the other
peer does not have. Deltas are sent as batches of CRDT merge operations. The receiving peer
applies each update through the CRDT merge function in `crdt.rs` (LWW registers, mergeable
maps, add-wins edge lists), guaranteeing deterministic convergence without data loss. Sync
operates in two modes: real-time (changes streamed immediately on each local mutation, using
the gossip protocol for notification) and periodic full-sync (complete anti-entropy at
configurable intervals, default 30 minutes). CRDT merge strategies are applied automatically
during sync: LWW (Last-Writer-Wins) registers handle scalar node properties, mergeable
maps/sets handle metadata tags, and add-wins semantics govern edge lists to ensure no
concurrent additions are silently lost. Anti-entropy full-sync ensures convergence even if
real-time gossip messages are dropped, with each peer initiating a delta exchange with all
connected peers every 30 minutes. Real-time mode uses gossip protocol
`gossip.rs` "I have new data" messages triggering delta requests from peers. Periodic full-
sync ensures convergence if real-time messages are lost. Sync status is exposed via WS
messages (`sync_status`, `sync_now`) and CLI commands (`api-oss sync start`, `sync stop`,
`sync status`, `sync add-peer`, `sync remove-peer`) — SyncCmd provides 5 subcommands in the
87-command CLI. Prometheus metrics on port 9000: `sync_bytes_sent_total`,
`sync_bytes_received_total`, `sync_peers_connected`, `sync_errors_total`. All sync traffic
is encrypted end-to-end with no intermediary able to read the data.

The encryption layer in `p2p.rs` uses the Noise Protocol framework with the `Noise_XX_25519_AESGCM_SHA256`
handshake pattern — a two-round-trip authenticated key exchange that provides mutual
authentication (each peer proves knowledge of its private key by signing the handshake
hash with its ed25519 Passaporte key), forward secrecy (ephemeral X25519 keys are generated
per session), and encrypted transport (AES-256-GCM with per-message nonces). If the Noise
handshake is not suitable for the deployment, TLS 1.3 via `rustls` is available as a
fallback with mutual TLS authentication using Passaporte-issued certificates. The NAT
traversal subsystem uses `str0m` for ICE (Interactive Connectivity Establishment): the peer
gathers candidate addresses (host, server-reflexive via STUN at
`stun.l.google.com:19302`, and relayed via TURN if configured), forms ICE agents, and
performs connectivity checks per RFC 8445. The sync delta computation in `sync.rs` uses
per-peer vector clocks — each peer stores a `HashMap<PeerId, u64>` mapping known peer
identities to the highest counter value received from that peer. On sync, peers exchange
these vector clocks and compute the symmetric difference: the set of (peer_id, counter)
pairs where one peer's counter exceeds the other's. These entries are batched (default 1,000
nodes per batch for bandwidth efficiency) and serialized as CRDT merge operations using
bincode for compact binary encoding. The sync engine runs as a tokio task with a
configurable interval-driven loop: real-time sync uses a `tokio::sync::watch` channel that
the local graph mutation handler writes to, triggering immediate delta push; periodic
full-sync uses `tokio::time::interval` set to `sync.interval` (default 30 min) for anti-
entropy against missed real-time messages.

## How to Operate
1. Start the gateway: `api-oss start`. Enable sync in `opencode.json` under `sync.enabled`.
2. Add a peer: `api-oss sync add-peer --address 192.168.1.100:3030`.
3. Start sync: `api-oss sync start` — begins connecting and syncing.
4. Check status: `api-oss sync status` — shows connected peers, sync state, bytes exchanged.
5. Trigger immediate sync: `api-oss sync now` — forces full anti-entropy with all peers.
6. Remove peer: `api-oss sync remove-peer --address 192.168.1.100:3030`.
7. Stop sync: `api-oss sync stop` — disconnects all peers gracefully.
8. Configure in `opencode.json`: `sync.interval` (default 30m), `sync.realtime` (default
    true), `sync.compress` (zstd compression, default true), `sync.port`.
9. NAT traversal: configure STUN server in `sync.stun` (default `stun.l.google.com:19302`).
10. Monitor in web UI on port 8081 — Sync view shows a topology graph of connected peers.
11. View detailed peer state: `api-oss sync status` — shows per-peer vector clock counters,
    last sync timestamp, bytes exchanged, and pending merge operation count.
12. Tune sync performance in `opencode.json` under `sync.batch_size` (default 1000 nodes per
    batch), `sync.max_connections` (default 50), and `sync.compress_level` (default 3 for
    zstd, range 1–22).

## The Moat
- Palantir uses a hub-and-spoke model where all data flows through their cloud — creating a
  single point of failure, a surveillance point, and a source of data egress costs.
- True P2P mesh with no central coordination is architecturally harder: requiring NAT
  traversal (STUN/ICE), peer discovery (gossip protocol), conflict resolution (CRDTs), and
  encrypted channels (Noise Protocol).
- Once built, this topology is far more resilient and sovereign than any hub-and-spoke
  system — any peer can fail without affecting the rest of the mesh.
- Delta-based sync with vector clocks minimizes bandwidth — only changed data is transmitted
  between peers.

## Why Choose API-OSS
A military unit operating across multiple forward bases with intermittent satellite links
can run API-OSS at each base. When connectivity is available, P2P sync automatically
synchronizes the intelligence graph between bases — no central server, no data transit
through a third party. An enterprise with offices in 50 countries can deploy API-OSS at
each site with direct P2P sync, eliminating cloud intermediary costs and latency.

## Competitive Comparison
- **Palantir**: Hub-and-spoke model, all data through Palantir cloud. Egress costs apply for
  data leaving on-premises.
- **OpenAI/Anthropic**: Cloud-only, no sync concept.
- **Snowflake**: Centralized data warehouse, no P2P sync.
- **Syncthing**: File-based P2P sync, no knowledge graph or CRDT conflict resolution.

## Cost-Benefit Analysis
Hub-and-spoke egress costs $0.02–$0.12/GB. For 100 GB of graph data syncing between 10
offices daily: $1,000–$12,000/month. API-OSS P2P eliminates all egress costs. Building P2P
sync with NAT traversal and CRDTs costs $300k–$800k in engineering. API-OSS includes it
free. No central discovery server means no infrastructure costs ($50/month saved).
ngrok charges $20/month for tunnel-based connectivity between peers; P2P direct connections
eliminate this entirely — for 20 nodes, saving $4,800/year in tunnel subscriptions.
OpenAI charges $0.01/1K tokens for API calls — P2P sync processes all graph operations
locally at zero per-operation cost, avoiding the token-metered pricing model entirely.

## Applications
- **Consumer**: Sync between home server, laptop, and phone directly on the local network.
- **Government / Defense**: Mesh network with no central point of failure or surveillance.
- **Enterprise**: Multi-site sync without cloud intermediary. Branch office resilience.

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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com