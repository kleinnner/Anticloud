---
title: "Gossip Protocol"
sidebar_position: 99
description: "Peer discovery and state dissemination using a SWIM-style gossip protocol for self-healing"
tags: [features]
---

# Gossip Protocol

## What It Does
Peer discovery and state dissemination using a SWIM-style gossip protocol for self-healing
network topology. Peers automatically discover each other, exchange membership information,
and propagate state changes without any central coordination server. Includes failure
detection via indirect pings, anti-entropy through periodic full-state exchange, and
configurable tunables: gossip interval, fanout, failure timeout, suspect timeout, cleanup
interval. All operates over encrypted channels via the Noise Protocol framework.

## How It Works
The gossip protocol is implemented in `gossip.rs` under `ai-oss-gateway/src/`. It follows
the SWIM (Scalable Weakly-consistent Infection-style process group Membership) protocol
design with extensions for state dissemination. Each peer maintains a membership list
containing: peer ID (Passaporte public key hash), incarnation number (incremented on each
restart or update), IP:port address, and application-level metadata (sync state, model
version, uptime). In each gossip round (default interval: 1 second), the peer selects a
random target (or up to fanout=3 targets) and sends a gossip message containing a delta
of its membership list — only entries that have changed since last gossip to that target.
The receiving peer merges the delta using incarnation numbers — higher incarnation wins and
becomes authoritative. Failure detection uses indirect pings: if peer A suspects peer B has
failed (no direct response within failure_timeout of 5000ms), peer A asks a random peer C
to ping B. If C confirms B is alive, A updates B's state and propagates the correction.
If C also cannot reach B, A marks B as "suspect" and disseminates the suspicion. After a
suspect timeout (default: 2000ms) without recovery, B is marked "dead" and removed from the
membership list. Anti-entropy runs every cleanup_interval (default: 60 seconds): each peer
performs a full-state exchange with a random peer, ensuring even rarely-changed membership
information eventually converges. The protocol is fully decentralized — any peer can join,
leave, or fail without affecting the rest of the network. The gossip layer feeds into
`sync.rs`, which handles CRDT-based graph synchronization — the gossip protocol ensures
each peer knows which other peers exist and their sync capabilities. TLS encryption protects
all gossip messages between peers using the Noise Protocol framework. The protocol works
over arbitrary network topologies — LAN, mesh VPN, or internet — and includes NAT traversal
via STUN/ICE configured in `opencode.json`. Anti-entropy runs every cleanup_interval
(default 60 seconds) where each peer performs a full-state exchange with a random peer,
guaranteeing convergence even if individual gossip messages are lost. The gossip message
size is capped at 64 KB per round to avoid fragmentation, with multi-round sync for larger
deltas. Each peer maintains a suspicion counter per member — after `suspect_timeout` (2000ms)
without recovery, the peer is marked dead and pruned from the membership list.

## How to Operate
1. Gossip protocol runs automatically when P2P sync is enabled. Configure in
   `opencode.json` under `sync.gossip` at root or gateway level.
2. Tunables: `gossip_interval` (default 1000ms), `fanout` (default 3),
   `failure_timeout` (default 5000ms), `cleanup_interval` (default 60000ms),
   `suspect_timeout` (default 2000ms).
3. For low-bandwidth environments, increase `gossip_interval` to 5000ms and reduce fanout
   to 2 to minimize gossip traffic.
4. For high-churn environments (many peers joining/leaving), reduce `failure_timeout` to
   2000ms for faster detection and convergence.
5. Monitor gossip state: `api-oss sync status` shows membership list size and known peers
    with their states.
6. View Prometheus metrics on port 9000: `gossip_messages_sent_total`,
    `gossip_messages_received_total`, `gossip_membership_size`,
    `gossip_failures_detected_total`.
7. For debugging: enable gossip trace logging with `API_OSS_LOG_LEVEL=gossip=trace` to see
    every gossip round and membership change.
8. NAT traversal: configure STUN server in `opencode.json` under `sync.nat.stun` — default
    is `stun.l.google.com:19302`. For restrictive NATs, configure TURN server credentials.
9. Ad-hoc mesh: peers on same LAN are auto-discovered. For WAN, manually add initial peers
    with `api-oss sync add-peer --address <host>:<port>`.
10. To force an immediate anti-entropy full-state exchange: `api-oss sync now` — triggers a
    gossip-triggered full sync with all known peers regardless of the cleanup_interval timer.
11. Configure per-network gossip tuning in `opencode.json` under `sync.gossip.override` with
    different tunables for LAN vs WAN peers — for example, WAN peers get a higher
    `gossip_interval` (5000ms) and lower `fanout` (2) to conserve bandwidth over satellite
    or metered links.

## The Moat
- Palantir relies on centralized discovery servers, creating a single point of failure and
  a surveillance point — all peer locations are known to Palantir's cloud infrastructure.
- A gossip-based protocol with SWIM-style failure detection provides a truly decentralized,
  self-healing network that operates without any infrastructure at all.
- Indirect pings prevent false positives — a single dropped packet does not cause a peer to
  be marked dead, avoiding unnecessary reconnection storms.
- Anti-entropy guarantees eventual convergence of membership information even if individual
  gossip messages are lost.
- Building and tuning a production gossip protocol is significant distributed systems
  engineering — SWIM with state dissemination is not a weekend project.

## Why Choose API-OSS
A defense team operating across multiple forward bases with intermittent satellite
connectivity needs a peer discovery mechanism that works without any central server. The
gossip protocol automatically builds a mesh network when any two peers can communicate.
An enterprise with offices in 50 countries can deploy API-OSS in each office and the gossip
protocol self-organizes the peer topology without any central configuration. A group of
consumers on the same LAN can run API-OSS instances that automatically discover each other.

## Competitive Comparison
- **Palantir**: Centralized discovery, hub-and-spoke model. All peers connect through
  Palantir's cloud infrastructure for discovery and sync.
- **OpenAI/Anthropic**: Cloud-only, no peer discovery concept or gossip protocol.
- **HashiCorp (Serf)**: General-purpose gossip protocol library, not integrated with an AI
  decision engine or knowledge graph synchronization.
- **IPFS/libp2p**: General-purpose P2P networking, not targeted at knowledge graph sync.

## Cost-Benefit Analysis
A centralized discovery server costs $50–$200/month for a cloud VM with a static IP. The
gossip protocol eliminates this cost entirely. Palantir's hub-and-spoke architecture incurs
egress costs ($0.05–$0.12/GB) for all peer traffic through their cloud. API-OSS P2P gossip
uses direct peer connections eliminating transit costs. No central server means no single
point of failure — a 5-minute discovery server outage costing $10k–$50k in lost
productivity is eliminated entirely. The engineering cost of building a production gossip
protocol from scratch is $200k–$500k. API-OSS includes it for free in the platform.
Ngrok charges $20/month for tunnel-based peer connectivity; the gossip protocol's direct
peer-to-peer connections eliminate the need for tunnel infrastructure entirely. For a 10-node
mesh, that is $2,400/year saved in ngrok subscriptions alone. OpenAI's cloud API charges
$0.01/1K tokens for inference — P2P gossip and sync eliminate per-token costs by keeping
all data exchange and inference local between peers.

## Applications
- **Consumer**: Automatic discovery between home devices (laptop, desktop, home server,
  Raspberry Pi) on the same LAN without any manual configuration.
- **Government / Defense**: Ad-hoc mesh networks with no infrastructure dependency —
  forward bases, field operations, ship-to-ship communication in contested environments.
- **Enterprise**: Self-organizing multi-site deployment. Offices automatically discover each
  other and form a P2P mesh for graph synchronization with automatic failover.

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

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

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