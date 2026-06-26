---
title: "WebSocket Protocol (810 Messages)"
sidebar_position: 99
description: "A bidirectional real-time communication protocol with 810 message types (412 ClientMessage"
tags: [features]
---

# WebSocket Protocol (810 Messages)

## What It Does
A bidirectional real-time communication protocol with 810 message types (412 ClientMessage
variants sent from client to server, 398 ServerMessage variants sent from server to client)
over a single WebSocket connection on port 3030. JSON-serialized with serde tagged enums
(`#[serde(tag = "type")]`). Includes heartbeat via WebSocket Ping/Pong frames at 30-second
intervals, reconnect with jittered exponential backoff (1s, 2s, 4s, ... 60s max), and
request-response correlation via message IDs. Auto-generated OpenAPI spec at `/docs`.

## How It Works
The protocol is defined in Rust in `protocol.rs` under `ai-oss-gateway/src/`. Two enums —
`ClientMessage` and `ServerMessage` — each with a `#[serde(tag = "type")]` attribute that
serializes the variant name as a `type` field in the JSON payload. For example, a graph
query request is serialized as `{"type": "graph_query", "query": "...", "limit": 10}` and
the response as `{"type": "graph_query_result", "nodes": [...], "total": 100}`. The serde
tagged enum ensures deterministic message routing: the receiver deserializes the JSON, reads
the `type` field, and dispatches to the appropriate handler function. The 412 client messages
cover: graph operations (query, add, delete, traverse, stats, schema — 30+ messages), ledger
operations (verify, export, import, status, prune — 15+ messages), auth operations (login,
logout, status, create-token, revoke, rotate-keys, list-sessions — 20+ messages), model
operations (list, pull, remove, info, benchmark, quantize, serve — 40+ messages), sync
operations (status, now, add-peer, remove-peer, connect, disconnect — 15+ messages), backup
operations (create, restore, list, schedule, verify — 10+ messages), bridge operations
(telegram, discord, whatsapp — 60+ messages covering send, receive, status, connect,
disconnect), pipeline operations (save, load, list, delete, run, stop, status — 20+
messages), workflow operations (create, list, toggle, approve, progress — 15+ messages),
marketplace operations (list, search, install, uninstall — 10+ messages), form operations
(create, list, submit, submissions — 10+ messages), plugin operations (install, uninstall,
list, configure, invoke — 10+ messages), connector operations (list, sync, create, delete,
test — 10+ messages), and system operations (status, doctor, metrics, config — 15+
messages). Each message type has a corresponding request-response pair. Message IDs are
optional UUIDs that correlate requests to responses — the client includes an `id` field in
the request and the server echoes the same `id` in the response. The WebSocket server uses
`tokio-tungstenite` for async WebSocket handling. The protocol supports both text (JSON)
and binary (MessagePack or CBOR — planned) frames. Heartbeat uses WebSocket Ping/Pong
frames at 30-second intervals with a 10-second timeout — if no Pong is received within
10 seconds, the connection is closed and reconnection begins with jittered exponential
backoff (1s, 2s, 4s, ... 60s max, max_retries 20). All messages use JSON serialization
with serde tagged enums (`#[serde(tag = "type")]`) for deterministic routing.

The WebSocket server is implemented using `tokio-tungstenite` in a dedicated `ws.rs` module.
On startup, the gateway creates a `tokio::net::TcpListener` bound to `0.0.0.0:3030` and
spawns an accept loop that, for each incoming TCP connection, performs the WebSocket
handshake (HTTP upgrade request → 101 Switching Protocols), then spawns a new tokio task
to handle the session. Each session task creates two `tokio::sync::mpsc` channels —
`inbound_tx/rx` for messages from the client to the gateway, and `outbound_tx/rx` for
messages from the gateway to the client — connected to a serialization/deserialization
layer. Inbound messages are JSON-deserialized via `serde_json::from_str::<ClientMessage>()`
— if the `type` field does not match any known variant, the server responds with
`{"type": "error", "code": "UNKNOWN_MESSAGE_TYPE", "message": "..."}`. Outbound messages
are serialized via `serde_json::to_string::<ServerMessage>()`. Heartbeats use the WebSocket
protocol's Ping/Pong frames: a tokio timer task sends a Ping frame every 30 seconds; if no
Pong is received within 10 seconds, the connection is considered dead and the session task
exits. Rate limiting is implemented per-connection using a `tokio::sync::Semaphore` with
`permits` set by `websocket.rate_limit` (default 1000 messages/minute) — each inbound
message acquires a permit before processing, and a separate tokio task replenishes permits
at the configured rate. The rate-limited connection is gracefully closed with a 4008
(rate limited) close code if the semaphore wait times out.

## How to Operate
1. Start the gateway: `api-oss start` — the WebSocket server listens on port 3030.
2. Connect with any WebSocket client: `wscat -c ws://localhost:3030`.
3. Send a client message: `{"type": "graph_query", "id": "req-1", "query": {...}}`.
4. Receive response: `{"type": "graph_query_result", "id": "req-1", "nodes": [...]}`.
5. For auth: `{"type": "auth_login", "passaporte_token": "..."}`.
6. Use JS SDK or Python SDK for typed access — handles serialization, correlation,
   reconnection, and heartbeat automatically.
7. Reference OpenAPI spec at `http://localhost:8081/api/openapi.json` under
   `x-websocket-messages` for the full message schema catalog of all 810 messages.
8. Heartbeat is automatic — server sends Ping every 30 seconds.
9. Monitor Prometheus on port 9000: `ws_connections_active`, `ws_messages_sent_total`.
10. Rate limiting: configure in `opencode.json` under `websocket.rate_limit` (default: 1000
    messages/minute per connection).
11. All protocol messages work fully offline.

## The Moat
- Building a unified protocol with 810 message variants covering graph operations, ledger,
  auth, sync, pipeline, workflow, bridge, marketplace, form, plugin, connector, and system
  operations requires comprehensive domain modeling that competitors cannot replicate
  overnight.
- The single-port design (everything over one WebSocket connection on port 3030) eliminates
  multiple REST endpoints, API versioning, and HTTP overhead.
- Serde tagged enums provide deterministic message routing with zero configuration — the
  `type` field is the only routing information needed.
- The protocol is fully documented in a machine-readable format (OpenAPI spec with WS
  extensions) — any client can be auto-generated.

## Why Choose API-OSS
A developer building a custom frontend connects to a single WebSocket port and has access to
the entire platform — graph queries, model inference, sync management, bridge control,
pipeline execution, backup operations — all through one persistent connection. No REST
endpoints to discover, no API versions to track, no HTTP headers to manage.

## Competitive Comparison
- **Palantir**: REST-only API, no real-time bidirectional protocol.
- **OpenAI**: Stateless REST + SSE streaming, no persistent connection.
- **Anthropic**: REST-only with streaming, no bidirectional protocol.
- **Google**: gRPC-based but requires cloud services, complex tooling.

## Cost-Benefit Analysis
Building a custom WebSocket protocol with 810 messages costs $100k–$300k. API-OSS provides
it free. REST API overhead (headers, TLS handshakes) adds ~500ms latency per request vs
~10ms for persistent WebSocket. REST endpoint versioning maintenance costs $20k–$50k/year.
OpenAI charges per API request — with 810 opertations, costs would be significant. API-OSS
has one connection for everything at zero cost.

## Applications
- **Consumer**: Real-time chat with local AI via persistent WebSocket.
- **Government / Defense**: Persistent encrypted channel for real-time intelligence ops.
- **Enterprise**: Real-time dashboards with live graph updates. Live collaboration.

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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/SZJMZA
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