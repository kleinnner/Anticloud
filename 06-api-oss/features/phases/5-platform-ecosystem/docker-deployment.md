---
title: "Docker Deployment"
sidebar_position: 99
description: "Single-container Docker deployment with docker-compose orchestration for the entire API-OSS"
tags: [features]
---

# Docker Deployment

## What It Does
Single-container Docker deployment with docker-compose orchestration for the entire API-OSS
platform. Volume mounts for persistent storage of graph (graph.db), ledger, models, and
configuration. Environment variable configuration for all gateway settings. Runs on any
Docker host (Linux, Windows, macOS) with no additional dependencies — includes the engine,
CLI (87 commands), WebSocket server (port 3030), REST API (port 8081), bridge agents
(Telegram, Discord, WhatsApp), and tunnel in one container. docker-compose.yml included.

## How It Works
The Dockerfile uses a multi-stage build. Stage 1 (builder) starts from `rust:alpine`,
installs build dependencies (musl, OpenSSL, SQLite development headers), compiles the
entire workspace with `cargo build --release`, producing a statically-linked binary (~81 MB)
with zero runtime dependencies. Stage 2 (runtime) uses `scratch` or `alpine:latest` — the
smallest possible base with just ca-certificates and timezone data. The binary is copied
from the builder stage. The container exposes ports: 3030 (WebSocket), 8081 (HTTP UI), 443
(REST/WSS with TLS), 80 (redirect to 443), and 9000 (Prometheus metrics). Volume mounts:
`./data:/data` stores graph.db, ledger, models, and backups; `./config:/config` stores
`opencode.json` and gateway-level configuration. Environment variables: `API_OSS_PORT`,
`API_OSS_TLS_ENABLED`, `API_OSS_TUNNEL_ENABLED`, `API_OSS_LOG_LEVEL`, `API_OSS_MODEL_PATH`.
Any config key can be overridden with the `API_OSS_` prefix. The docker-compose.yml defines
a single `api-oss` service with healthcheck (curl to port 8081), restart policy
(`unless-stopped`), resource limits, and logging driver configuration. The CLI generates
docker-compose.yml via `api-oss docker init`. The image is published to Docker Hub
(`apioss/api-oss`) and GitHub Container Registry (`ghcr.io/api-oss/api-oss`). Security: the
container runs as a non-root user (`api-oss:api-oss`), supports read-only root filesystem,
and drops all capabilities except `net_bind_service`. The image includes the model download
script — on first start without a model, it downloads Qwen2-VL-2B-Instruct-Q4_K_M.gguf.

The multi-stage Docker build is defined in a `Dockerfile` at the workspace root. Stage 1
uses `rust:1.75-alpine3.19` as the builder, installing `musl-dev`, `openssl-dev`,
`sqlite-dev`, `protoc` (for protobuf), and `clang` (for bindgen). The build runs
`cargo build --release --target x86_64-unknown-linux-musl` with features split into
`default` (core engine + CLI), `bridges` (Telegram/Discord/WhatsApp), `tunnel` (TLS +
ACME), and `wasm` (wasmtime runtime) — configurable via Docker build arg
`--build-arg FEATURES=default,bridges,tunnel,wasm`. Stage 2 starts from `scratch` (or
`alpine:3.19` if shell access is needed for debugging), copies `ca-certificates.crt` and
`/etc/ssl/certs/` for TLS verification, sets timezone via `tzdata`, creates the non-root
user `api-oss:api-oss` with UID 1000, copies the binary to `/usr/local/bin/api-oss`, and
sets the entrypoint to `["api-oss"]` with `CMD ["start"]`. The health check uses
`curl --fail http://localhost:8081/api/status || exit 1` every 30 seconds with a 10-second
timeout and 3 retries. The docker-compose.yml includes a `healthcheck:` section matching
these parameters plus `depends_on:` ordering for volumes. The image is built with
`docker buildx` for multi-architecture support (linux/amd64, linux/arm64) and published to
both Docker Hub and GHCR via GitHub Actions CI with signed attestations using Docker
Content Trust. The image reproducibility is ensured by pinning the builder image digest.

## How to Operate
1. Generate docker-compose.yml: `api-oss docker init` — produces `docker-compose.yml` in
   the current directory with sensible defaults.
2. Create config and data directories: `mkdir -p ./config ./data` and place `opencode.json`
   in `./config/`.
3. Pull the image: `docker pull api-oss/api-oss:latest`.
4. Start the container: `docker-compose up -d`.
5. Check logs: `docker-compose logs -f api-oss`.
6. Access the UI at `http://localhost:8081` or WebSocket at `ws://localhost:3030`.
7. Execute CLI commands: `docker-compose exec api-oss api-oss graph query --limit 10`.
8. Configure TLS: set `API_OSS_TLS_ENABLED=true` and mount certificates at `/config/tls/`.
9. Enable the tunnel: set `API_OSS_TUNNEL_ENABLED=true`.
10. Back up data: `docker-compose exec api-oss api-oss backup create`.
11. For production, set resource limits: `deploy.resources.limits.memory: 8G` in compose.
12. Upgrade: `docker-compose pull && docker-compose up -d` — data persists in `./data`.
13. For K8s, see `docs/KUBERNETES/DEPLOYMENT.md` for Helm chart deployment guide.

## The Moat
- Palantir's deployment is notoriously complex — multiple services, proprietary orchestration,
  cloud dependencies, requires a dedicated Foundry operations team.
- A single-container Docker deployment that includes the entire platform (engine, CLI, WS
  server, REST API, bridge agents, tunnel) is dramatically simpler to operate.
- The image is approximately 81 MB (compared to Nvidia NIM containers at 2–10 GB each) and
  based on scratch/alpine for minimal attack surface.
- Volume mounts for all persistent data means backup and disaster recovery are trivial —
  copy the `./data` directory.
- Works fully offline — no pulling models from the internet on startup if models are
  pre-loaded in the data volume.
- The docker-compose.yml defines port mappings: 3030:3030 (WebSocket), 8081:8081 (HTTP UI),
  443:443 (TLS/WSS), 9000:9000 (Prometheus metrics). Volume mounts: `./data:/data` (graph.db,
  ledger, models, backups) and `./config:/config` (opencode.json). Environment variables
  include `API_OSS_PORT`, `API_OSS_TLS_ENABLED`, `API_OSS_TUNNEL_ENABLED`, `API_OSS_LOG_LEVEL`,
  and `API_OSS_MODEL_PATH` — every config key is overridable with the `API_OSS_` prefix.

## Why Choose API-OSS
An enterprise DevOps team can deploy API-OSS in production with a single
`docker-compose up -d` command — no multi-service orchestration, no cloud dependencies, no
complex configuration. A defense contractor can pull the image into an air-gapped registry,
pre-load models into the data volume, and deploy on classified infrastructure. A consumer
can run API-OSS on a $5/month VPS or home NAS with one command — including the full AI
engine, bridges, and tunnel.

## Competitive Comparison
- **Palantir**: Complex multi-service deployment, cloud-dependent, requires Foundry
  operations team. Cannot be deployed via single docker-compose.
- **OpenAI/Anthropic**: Cloud-only APIs, no Docker deployment option at all.
- **Nvidia**: NIM containers but inference only, each 2–10 GB, no graph/ledger/automation.
- **Ollama**: Simple Docker but inference-only, no graph/ledger/sync/bridges/automation.
  Image is approximately 500 MB.
- **Hugging Face TGI**: Inference-only container, no platform features.

## Cost-Benefit Analysis
A Palantir deployment requires dedicated operations staff ($200k+/year salary) and cloud
infrastructure ($50k+/year). An API-OSS Docker deployment is managed by existing DevOps
staff part-time. Deploying Palantir takes 3–6 months; deploying API-OSS via docker-compose
takes 5 minutes. At $150/hour, that is approximately $50k–$150k saved. The ~81 MB image
versus 2–10 GB NIM images means faster pulls, less storage, and lower registry costs.

## Applications
- **Consumer**: Run on home server, NAS, or cheapest VPS with one command. Access via PWA
  on phone through the built-in tunnel.
- **Government / Defense**: Deploy in classified environments with minimal footprint. The
  container can be manually transferred via USB and loaded into air-gapped registry.
- **Enterprise**: Standard Docker deployment across dev, staging, and production. CI/CD
  pipeline builds custom images. Easy rollback using tagged image versions.

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com