---
title: "REST API (OpenAPI / Swagger)"
sidebar_position: 99
description: "Auto-generated OpenAPI 3.0 specification from Rust code via utoipa derive macros. Swagger UI"
tags: [features]
---

# REST API (OpenAPI / Swagger)

## What It Does
Auto-generated OpenAPI 3.0 specification from Rust code via utoipa derive macros. Swagger UI
served at `/docs` for interactive API exploration. Redoc alternative at `/redoc`. Raw spec at
`/api/openapi.json`. Enables integration with standard API tooling: Postman, curl, HTTP
clients, code generators (openapi-generator), and API gateways. The OpenAPI spec is always
in sync with the implementation — utoipa ensures zero drift between code and docs.

## How It Works
All REST API handler functions in `ai-oss-gateway/src/` are annotated with `#[utoipa::path]`
derive macros specifying: HTTP method, path, request/response types (with full schema),
query parameters, status codes, and descriptions. The `utoipa` crate reads these annotations
at compile time and generates an OpenAPI 3.0 JSON document — not a separate YAML file that
can drift. The `utoipa-swagger-ui` crate serves the Swagger UI at the `/docs` endpoint for
interactive exploration and testing. The raw OpenAPI JSON is available at `/api/openapi.json`
for download and programmatic access. All WebSocket message types (412 ClientMessage, 398
ServerMessage = 810 total) are documented via OpenAPI extensions — the OpenAPI spec includes
a `x-websocket-messages` section listing all WS message types with their request/response
schemas. This means a single OpenAPI document describes both the REST endpoints and the
WebSocket protocol comprehensively. The REST API covers: graph CRUD operations
(`/api/graph/nodes`, `/api/graph/edges`), ledger verification (`/api/ledger/verify`), model
management (`/api/models`), connector management (`/api/connectors`), system status
(`/api/status`), and bridge management (`/api/bridges`). Authentication is documented via
OpenAPI security schemes — Bearer token (Passaporte JWT) and API key. Request/response
examples are auto-generated from the Rust types. Because utoipa generates the spec at
compile time, any change to a handler's parameters or response type is immediately reflected
in the OpenAPI spec — no manual documentation updates, no drift between docs and code.
The interactive Swagger UI at `/docs` allows executing API calls directly from the browser
with the "Try it out" button on each endpoint, showing request/response schemas, example
values, and curl command equivalents. The Redoc alternative at `/redoc` provides a
three-pane responsive layout with search, suitable for embedding in documentation portals
or generating PDF exports via Redoc CLI.

The utoipa derive macros work by implementing `ToSchema` for all request/response types and
registering path entries at compile time through a `#[utoipa::path]` attribute on each
handler function. The macro extracts the handler's function signature — parameter names,
types, HTTP method (from the `axum` route), and response types — and generates a static
OpenAPI entry in the binary's read-only data section. At startup, the gateway collects all
registered paths into a single `openapi::OpenApi` struct, serializes it to JSON, and serves
it at `/api/openapi.json`. The `utoipa-swagger-ui` crate serves the Swagger UI HTML at
`/docs` by injecting the OpenAPI JSON URL into the standard Swagger UI distribution. For the
WebSocket message extensions, a custom `#[utoipa::path]` attribute on a synthetic handler
registers all 810 message types under `x-websocket-messages`, including their JSON schema
derived from the Rust types via serde's serialization attributes — ensuring the WS protocol
documentation stays in sync with the enum definitions in `protocol.rs` automatically at
compile time.

## How to Operate
1. Start the gateway: `api-oss start` — the REST API is available immediately.
2. Open Swagger UI: navigate to `http://localhost:8081/docs` in a browser.
3. Open Redoc: navigate to `http://localhost:8081/redoc` for alternative view.
4. Download the raw spec: `curl http://localhost:8081/api/openapi.json > openapi.json`.
5. Use Swagger UI "Try it out" to execute API calls from the browser.
6. Import into Postman: File > Import > Link > `http://localhost:8081/api/openapi.json`.
7. Generate client: `openapi-generator-cli generate -i openapi.json -g python`.
8. View WS message catalog under `x-websocket-messages` in the spec.
9. Use curl: `curl -H "Authorization: Bearer $(api-oss auth token)" localhost:8081/api/...`.
10. Configure CORS in `opencode.json` under `api.cors` if needed.
11. Programmatic spec consumption: `curl -s http://localhost:8081/api/openapi.json | jq
    '.paths'` to explore all available endpoints from the terminal without reading docs.
12. Validate a client against the spec: generate a TypeScript client with
    `openapi-generator-cli generate -i openapi.json -g typescript-axios` and use it to
    ensure compile-time type safety against the API.
13. For CI/CD pipelines, include `curl -s -o /dev/null -w "%{http_code}" localhost:8081/docs`
    as an availability check and `curl localhost:8081/api/openapi.json | jq '.openapi'` to
    verify the spec version is 3.0.x.
14. Use the Swagger UI's "Try it out" feature to execute `GET /api/status` for a quick
    health check or `GET /api/graph/nodes?type=Person&limit=5` to explore graph data
    directly from the browser without writing any client code.
15. The OpenAPI spec includes the full WebSocket message catalog under
    `x-websocket-messages` — generate a WebSocket client directly:
    `openapi-generator-cli generate -i openapi.json -g python --additional-properties=library=websockets`.

## The Moat
- Competitors keep their API specs closed or behind NDAs — Palantir's API documentation
  requires partner agreements to access.
- Publishing a complete, auto-generated OpenAPI spec means any tool that speaks OpenAPI can
  immediately interoperate with API-OSS — curl, Postman, openapi-generator, API gateways.
- utoipa ensures the spec never drifts from implementation — updates at compile time.
- WebSocket protocol documented alongside REST API in a single OpenAPI document.

## Why Choose API-OSS
A system integrator downloads the OpenAPI spec, generates client libraries in their language
of choice, and builds integrations in hours instead of weeks of reverse-engineering. A
security team feeds the spec into API scanning tools for OWASP Top 10 validation. A
developer explores the full API interactively via Swagger UI without writing code.

## Competitive Comparison
- **Palantir**: Closed API spec, requires partner agreement.
- **OpenAI**: API documented but not auto-generated, not fully OpenAPI compliant.
- **Anthropic**: Documented but closed spec format, no Swagger UI.
- **Google**: OpenAPI available but requires cloud authentication.

## Cost-Benefit Analysis
Manual API documentation: $5k–$20k/year. utoipa eliminates this. API security scanning
requires OpenAPI spec — manual generation costs $2k–$10k. Auto-generated spec is free.
Reverse-engineering a closed API for integration: 2–5 days ($2k–$5k). OpenAPI spec
eliminates this. For 10 integration projects: $20k–$50k saved.
SwaggerHub charges $50–$500/month for hosted API documentation; API-OSS serves Swagger UI
and Redoc built-in at no cost. ngrok charges $20/month for tunnels to expose REST APIs
externally; API-OSS includes a free tunnel with Let's Encrypt TLS. OpenAI charges
$0.01/1K tokens for REST API calls; API-OSS REST API on port 8081 has zero per-call cost.

Cloud alternatives charge per API call: OpenAI REST API at $0.15/M tokens for inference,
$0.03/M for embeddings. A system performing 100k API calls/month at 1k tokens each would
cost $1,500/month in API fees. API-OSS REST API runs locally on port 8081 with zero per-call
costs, serving the same endpoints on a persistent connection with no token metering. Palantir
Foundry REST access requires a Foundry license ($500k+/year) and uses a proprietary format
that cannot be consumed by standard OpenAPI tooling like Postman, curl, or openapi-generator
without custom adapter development ($10k–$30k). Google Vertex AI REST API costs vary by
region but average $0.10–$0.30 per 1k characters processed. The utoipa-based auto-generation
also eliminates the need for dedicated API documentation tooling ($500–$2,000/month for
SwaggerHub or ReadMe.io subscriptions) and the engineering time to keep docs in sync with
implementation across multiple service versions.

## Applications
- **Consumer**: Explore API interactively, generate client code.
- **Government / Defense**: Validate against OpenAPI security tooling. Generate stubs.
- **Enterprise**: Integrate with existing API gateways, monitoring, documentation platforms.

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ