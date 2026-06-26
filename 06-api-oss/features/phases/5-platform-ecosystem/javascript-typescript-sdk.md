---
title: "JavaScript / TypeScript SDK"
sidebar_position: 99
description: "An NPM package (`@your-org/sdk`) providing a full WebSocket protocol wrapper for Node.js"
tags: [features]
---

# JavaScript / TypeScript SDK

## What It Does
An NPM package (`@your-org/sdk`) providing a full WebSocket protocol wrapper for Node.js
and browser environments. Includes TypeScript type definitions for all 810 message types
(412 ClientMessage, 398 ServerMessage), automatic reconnection with jittered exponential
backoff (1s, 2s, 4s, ... 60s max), typed event handlers, and request-response correlation
via message IDs. Zero runtime dependencies beyond the `ws` WebSocket polyfill for Node.js.
Bundle size approximately 15 KB minified, approximately 4 KB gzipped.

## How It Works
The SDK is generated from Rust `protocol.rs` using a code generation pipeline that runs as
part of the build process. The codegen reads the `ClientMessage` and `ServerMessage` enums
with their `#[serde(tag = "type")]` attributes, extracts all 412 + 398 = 810 variant names
and their payload types, and generates TypeScript interfaces, discriminated unions, and
type guards. This ensures the TypeScript types are never out of sync with the Rust
protocol — if a new message type is added in Rust, the SDK types are regenerated
automatically at compile time. The SDK core is a `WebSocketClient` class managing the
connection lifecycle: connect to `ws://hostname:3030`, send typed messages as JSON with
serde-compatible `type` field tagging, receive messages and dispatch to registered handlers
based on the `type` discriminator. Automatic reconnection uses jittered exponential backoff
matching the gateway's retry policy. Request-response correlation: each outgoing message
can include an optional `id` field; the gateway includes this `id` in the corresponding
response, allowing the SDK to match requests to responses via a pending requests map. The
SDK supports both promises (`client.send('graph_query', {...})` returns a Promise that
resolves with the response) and event-based patterns (`client.on('graph_query_result',
handler)`). For Node.js 18+ and modern browsers (Chrome, Firefox, Safari, Edge), the SDK
uses the native WebSocket API in browsers and the `ws` library in Node.js. A higher-level
`GraphClient` API provides convenience methods: `client.graph.query()`,
`client.graph.addNode()`, `client.graph.traverse()`, `client.ledger.verify()`,
`client.model.infer()`. The SDK is published to npm as `@your-org/sdk`.

The code generation pipeline for the TypeScript SDK reads the Rust `protocol.rs` file using
the `syn` and `quote` crates at compile time (inside a `build.rs` script). For the
`ClientMessage` enum (412 variants), the codegen iterates over each variant, extracts the
serde rename attribute value (e.g., `#[serde(rename = "graph_query")]`), the variant's
fields (each field's name, type, serde rename), and generates: a TypeScript `interface` for
each payload struct (e.g., `interface GraphQueryPayload { query: string; limit?: number }`),
a discriminated union type alias (e.g., `type ClientMessage = { type: "graph_query";
payload: GraphQueryPayload } | ...`), a type guard function per variant, and a
`WebSocketClient` class with typed methods. The generated output is written to
`src/generated.ts` and compiled into the npm package. The `WebSocketClient` class
internally wraps a native `WebSocket` (browser) or `ws` (Node.js) instance. The connection
lifecycle is managed as a state machine with states: `DISCONNECTED`, `CONNECTING`,
`CONNECTED`, `RECONNECTING`, and `CLOSED`. Automatic reconnection uses jittered exponential
backoff computed as `min(cap, base * 2^attempt * (1 + random(0, jitter)))` where
base = 1s, cap = 60s, jitter = 0.5. On each successful connection, the backoff resets.
Request-response correlation uses an internal `Map<string, { resolve, reject, timer }>`
keyed by the message UUID `id` — when a response with a matching `id` arrives, the
corresponding promise is resolved and its timeout timer is cleared. Unmatched responses
within the timeout (default 30s) reject with a `TimeoutError`.

## How to Operate
1. Install the SDK: `npm install @your-org/sdk` or `yarn add @your-org/sdk`.
2. Ensure the gateway is running: `api-oss start` — WebSocket server on port 3030.
3. Basic usage in Node.js:
   ```typescript
   import { ApiOssClient } from '@your-org/sdk';
   const client = new ApiOssClient({ host: 'localhost', port: 3030 });
   await client.connect();
   const result = await client.graph.query({ type: 'Person', limit: 10 });
   ```
4. Browser usage: `import { ApiOssClient } from '@your-org/sdk/browser'`.
5. Event-based pattern: `client.on('graph_query_result', (data) => { /* typed data */ })`.
6. Connection management: `client.disconnect()`, `client.reconnect()`.
7. Error handling: `client.on('error', handler)` catches protocol errors and connection
   failures.
8. For React/Vue: use `useApiOss()` hook or `provideApiOss()` composable included in the
   SDK for reactive integration.
9. All 810 message types are fully typed — your IDE provides autocomplete for every message
   type, its payload, and response type.
10. See `docs/dev/js-sdk.md` for full documentation including advanced topics.

## The Moat
- Generating TypeScript definitions for 810 message types from Rust enum definitions — and
  keeping them in sync via automated codegen — is something competitors without an open
  protocol cannot replicate.
- The SDK gives every JS/TS developer first-class access to all 87 CLI commands, graph
  operations, ledger verification, model inference, and sync management through a single
  persistent WebSocket connection.
- Zero runtime dependencies beyond the WS polyfill — no heavy framework required.
- Request-response correlation via message IDs enables promise-based patterns on top of a
  message-based protocol.

## Why Choose API-OSS
A web developer building a custom frontend for an enterprise can use the JS SDK to connect
to the API-OSS graph with full TypeScript type safety — every query, command, and response
is typed and validated at compile time. A browser extension developer can embed the SDK for
local knowledge graph access. A React team building a custom dashboard can use the SDK's
hooks for live-updating graph data.

## Competitive Comparison
- **Palantir**: No official JS SDK, REST-only with manually curated endpoints.
- **OpenAI**: JS SDK exists but is REST-only with SSE streaming, no persistent connection.
- **Anthropic**: JS SDK is REST-only, no real-time protocol.
- **Google**: Vertex AI JS SDK requires cloud authentication, no offline mode.

## Cost-Benefit Analysis
Building a custom WebSocket client for an 810-message protocol costs $20k–$50k. SDK is free.
Typed protocol eliminates runtime debugging (hours per week per developer). OpenAI's REST
SDK requires polling for real-time updates — adding approximately 500ms latency versus
approximately 10ms for persistent WebSocket. For a real-time dashboard application, this
difference in architecture alone saves weeks of development time.

## Applications
- **Consumer**: Build web apps, browser extensions, Electron desktop apps interacting with
  local API-OSS instance.
- **Government / Defense**: Integrate API-OSS into existing JavaScript-based tools and
  portals with full type safety.
- **Enterprise**: Embed in React/Vue dashboards, Node.js backend services, Electron desktop
  apps with full IDE autocomplete for all 810 protocol messages.

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

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
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