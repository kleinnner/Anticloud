---
title: "CRDT Conflict Resolution"
sidebar_position: 99
description: "Conflict-free Replicated Data Types (CRDTs) for automatic conflict resolution in the"
tags: [features]
---

# CRDT Conflict Resolution

## What It Does
Conflict-free Replicated Data Types (CRDTs) for automatic conflict resolution in the
distributed knowledge graph. Uses Last-Writer-Wins (LWW) registers for scalar node
properties and mergeable maps/sets for complex metadata. No central conflict resolution
server required — conflicts resolve deterministically and automatically at each node using
mathematical guarantees provided by the CRDT merge functions.

## How It Works
The CRDT system is implemented in `crdt.rs` under `ai-oss-gateway/src/`. It provides four
CRDT types tailored to the knowledge graph data model. LWW (Last-Writer-Wins) registers
handle scalar node properties such as `name`, `description`, and `timestamp` — when two
peers concurrently update the same property, the update with the later hybrid logical clock
(HLC) timestamp wins deterministically. Mergeable maps and sets handle metadata properties
such as tags, labels, and custom attributes — concurrent additions are unioned, concurrent
removals use add-wins semantics (an add after a remove wins) because metadata represents
cumulative facts. CRDT-based edge lists handle graph edges with add-wins semantics — if
peer A adds edge (n1-n2) and peer B deletes it concurrently, and then A's add propagates
after B's delete, the add wins because edges represent existence facts that should not be
silently lost. The DOT (Dotted Version Vector) approach tracks causality per-node: each
node maintains a vector of (peer_id, counter) pairs, and each update carries the latest
DOT value. When two updates arrive at a node, the CRDT merge function (implemented as a
Rust trait `CrdtMerge`) deterministically combines them without data loss. Hybrid Logical
Clocks (HLC) provide timestamp ordering without requiring clock synchronization — HLC
combines wall clock time with a logical counter, guaranteeing that if event A happens-before
event B, then HLC(A) < HLC(B). The CRDT merge logic is invoked by `sync.rs` when receiving
updates from P2P peers — conflict resolution is completely transparent to the user.
Tombstone cleanup: deleted nodes and edges are marked with tombstones that propagate to all
peers before being pruned after a configurable grace period (default 30 days). The
mathematical guarantee is strong eventual convergence: after all peers have received all
updates, every peer's graph will be identical. CRDT merge strategies include LWW
(Last-Writer-Wins) registers for scalar properties, mergeable maps/sets for metadata tags,
and add-wins edge lists for graph edges — each using HLC timestamps and per-peer vector
clock counters for deterministic ordering. Anti-entropy full-sync at configurable intervals
(default 30 minutes) runs a CRDT merge across all known peers to guarantee convergence even
if real-time gossip messages are dropped.

## How to Operate
1. CRDT conflict resolution is automatic — no operator action is required. Simply use the
   graph normally and conflicts are resolved silently.
2. Configure CRDT parameters in `opencode.json` at root or gateway level under `sync.crdt`:
   tombstone cleanup interval (default `30d`), LWW clock skew tolerance (default `1000ms`),
   and merge strategy overrides for specific node types.
3. To observe conflict resolution: run `api-oss ledger verify` — includes CRDT merge
   correctness verification as part of ledger integrity checks.
4. For debugging: `api-oss sync status` shows per-peer sync state including pending merge
   operations and tombstone counts.
5. To force a full anti-entropy sync triggering CRDT merge: `api-oss sync now`.
6. In the web UI on port 8081, the Graph view shows a "conflicts" indicator — zero under
    normal operation since CRDTs resolve everything automatically.
7. For custom node types needing specific merge strategies, implement the `CrdtMerge` trait
    in a WASM plugin and register via `plugin_configure` WS message.
8. Monitor CRDT performance via Prometheus on port 9000: `crdt_merge_duration_ms`,
    `crdt_conflicts_resolved_total`, `crdt_tombstones_active`.
9. View CRDT state per peer: `api-oss sync status --verbose` — displays per-peer vector
    clock values, pending merge operation count, tombstone count, and last anti-entropy
    timestamp for each connected peer.
10. Tune CRDT parameters in `opencode.json` under `sync.crdt`: `tombstone_cleanup_days`
    (default 30), `lww_clock_skew_tolerance_ms` (default 1000), and `merge_batch_size`
    (default 1000 operations per merge batch) for performance tuning on large graphs.

## The Moat
- Most distributed systems punt conflict resolution to the user (CRDTs in Redis require
  application-level merge logic) or require a central arbitrator (Palantir hub-and-spoke).
- CRDTs provide mathematical guarantees that all nodes converge to the same state without
  any coordination — no consensus protocol, no leader election, no central server needed.
- Implementing CRDTs for a rich knowledge graph with typed nodes, arbitrary metadata, and
  edge semantics requires deep understanding of both distributed systems theory and
  algebraic data types — not a weekend engineering project.
- Hybrid Logical Clocks (HLC) eliminate the need for NTP synchronization while providing
  causally consistent timestamps across all peers.
- The CRDT layer is completely invisible to users — they never see conflicts, never resolve
  merge conflicts manually, and never lose data from concurrent edits.

## Why Choose API-OSS
A field intelligence team operating across multiple disconnected forward bases each runs
API-OSS locally. When they physically return to headquarters and their instances sync via
P2P, CRDTs ensure every analyst's notes, annotations, and connections are automatically
merged without conflicts — no manual reconciliation, no lost data, no analyst time wasted.
A global enterprise with offices in 50 countries can run active-active API-OSS deployments
in each region, and the CRDT system ensures the knowledge graph converges across all sites
without central cloud dependency or expensive WAN links. A consumer syncing between laptop
and home server never sees merge conflict dialogs — CRDTs handle it silently.

## Competitive Comparison
- **Palantir**: Centralized conflict resolution via cloud server using hub-and-spoke model.
  Conflicts must be resolved at the cloud level.
- **OpenAI/Anthropic**: Cloud-only, single source of truth. No conflict resolution needed
  or possible for local state management.
- **Google**: CRDTs used in Google Docs and Firebase but not exposed as a general platform
  feature for knowledge graphs and AI decision data.
- **Redis**: CRDTs available in Redis Enterprise (CRDT-based replication) but limited to
  key-value string data, not knowledge graphs with typed nodes, edges, and metadata.
- **Snowflake**: Centralized data warehouse, no conflict resolution — single source of truth
  by design with no offline capability.

## Cost-Benefit Analysis
Manual conflict resolution in distributed systems costs significant engineering time. A
Palantir deployment requiring custom conflict resolution logic costs $50k–$200k in
development. API-OSS CRDTs cost $0 — built into the platform. Redis Enterprise with CRDT
support costs $60/node/month minimum for the CRDT feature. API-OSS includes CRDTs at no
additional cost. The cost of data loss from unresolved conflicts (lost analysis, corrupted
graphs, compliance violations) is potentially millions in a defense or enterprise context —
CRDTs eliminate this risk entirely. The time savings from automatic conflict resolution vs
manual reconciliation: at least 1 hour/week per user, worth $5k/year per user at $100/hour.
ngrok charges $20/month for tunnels; CRDT-based sync uses direct P2P connections with no
tunnel infrastructure, saving $240/year per peer. OpenAI charges $0.01/1K tokens for API
calls — conflict resolution via CRDTs runs locally at zero cost, avoiding token-metered
pricing for every merge operation across the distributed graph.

## Applications
- **Consumer**: Offline edits on laptop sync with home server — CRDTs auto-merge without
  user intervention. No "conflict detected" dialogs or manual merge decisions.
- **Government / Defense**: Disconnected field operations that converge when connectivity
  returns. Multiple teams edit the same intelligence graph independently — CRDTs merge
  everything correctly without data loss or analyst reconciliation effort.
- **Enterprise**: Multi-region active-active deployment with automatic consistency. Branch
  offices with intermittent connectivity. Merger/acquisition graph consolidation without
  data conflicts or manual merging.
