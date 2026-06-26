---
title: "Single Binary Deployment"
sidebar_position: 99
description: "The entire API-OSS platform ships as a single approximately 81 MB statically-linked binary"
tags: [features]
---

# Single Binary Deployment

## What It Does
The entire API-OSS platform ships as a single approximately 81 MB statically-linked binary
with zero runtime dependencies. Runs on Windows, Linux, and macOS without any package
manager, runtime, or library installation. The binary includes the engine, CLI (87 commands),
WebSocket server (port 3030), REST API (port 8081), bridge agents (Telegram, Discord,
WhatsApp), tunnel, and all protocol handlers. Cross-compiled for x86_64 Windows, x86_64
Linux (musl), aarch64 macOS, and x86_64 macOS.

## How It Works
The workspace structure in `main.rs` + `lib.rs` compiles all crates into a single binary
using Cargo features. Static linking of all C dependencies (OpenSSL, SQLite, libsodium, etc.)
is achieved using `musl` on Linux (`x86_64-unknown-linux-musl` target — fully static, runs
on any Linux distro regardless of glibc version) and MSVC on Windows. Cross-compilation
targets: `x86_64-pc-windows-msvc` (Windows 7+), `x86_64-unknown-linux-musl` (Linux on any
distro including Alpine), `aarch64-apple-darwin` (Apple Silicon Macs), and
`x86_64-apple-darwin` (Intel Macs). Size breakdown: core engine approximately 15 MB (graph
database, ledger, CRDT, sync), protocol handlers approximately 8 MB (all 810 WS message
types, serialization), model runtime approximately 25 MB (GGUF loader, CUDA backend for
Qwen2-VL-2B-Instruct-Q4_K_M.gguf, inference engine), bridge agents approximately 10 MB
(Telegram, Discord, WhatsApp protocol implementations), CLI approximately 5 MB (clap derive
parser for 87 commands with 9 subcommand enums), tunnel approximately 5 MB (TLS termination
via rustls, Let's Encrypt ACME client, QR code generation), other approximately 13 MB
(auth, backup, migration, marketplace, WASM runtime via wasmtime). The binary includes the
WASM runtime for sandboxed plugin execution. The model file is downloaded separately on
first `api-oss model pull` — not bundled. Zero-config startup.

The clap derive argument parser is defined in `main.rs` with `#[derive(clap::Parser)]` on
the top-level `Cli` struct, containing 9 nested subcommand enums each annotated with
`#[derive(clap::Subcommand)]`. The protocol message types in `protocol.rs` use
`#[serde(tag = "type")]` on the `ClientMessage` and `ServerMessage` enums (412 + 398 = 810
variants), each variant annotated with `#[serde(rename = "snake_case_name")]` for JSON
wire format alignment. The tokio runtime starts asynchronously, spawning a fixed thread pool
(default: 4 worker threads on x86_64, 8 on aarch64 with more than 4 cores) that handles all
concurrent WebSocket connections, bridge agent polling, tunnel relay, and gossip protocol
rounds. Each bridge agent (Telegram, Discord, WhatsApp) runs as a dedicated tokio task with
its own bidirectional channel to the gateway — the bridge architecture decouples protocol
handling from the main event loop, allowing each bridge to independently reconnect, process
incoming messages, and manage rate limits without blocking the gateway or other bridges.
The binary supports feature flags at build time: `--features=bridges` includes Telegram,
Discord, and WhatsApp bridge agents; `--features=tunnel` includes the TLS tunnel with Let's
Encrypt ACME; `--features=wasm` includes wasmtime plugin runtime. Default build includes all
features. Cross-compilation uses `cross` or `cargo-zigbuild` for musl targets with a single
`cargo build --release --target x86_64-unknown-linux-musl` command producing the fully
static binary ready for any Linux distribution including Alpine-based Docker images.

## How to Operate
1. Download the binary for your platform from releases or build with `cargo build --release`.
2. Place in PATH: `sudo cp api-oss /usr/local/bin/` on Linux/macOS, or add to PATH on
   Windows.
3. Start the gateway: `api-oss start` — starts WebSocket (3030), HTTP UI (8081), metrics
   (9000).
4. Pull a model: `api-oss model pull` — downloads Qwen2-VL-2B-Instruct-Q4_K_M.gguf.
5. Use CLI: `api-oss graph query --limit 5`, `api-oss status`, `api-oss doctor`.
6. Access web UI: `http://localhost:8081`.
7. Install as service: `api-oss service install` for auto-start on boot.
8. Enable tunnel: set `tunnel.enabled: true` in `opencode.json`.
9. For Docker, the binary is the container entrypoint — same binary, same behavior.
10. For air-gapped: transfer binary via USB — no dependencies to install.
11. Verify binary integrity: `sha256sum api-oss` and compare against release checksums.
12. Cross-compile locally: `cargo build --release --target x86_64-unknown-linux-musl` for
    Linux, `--target x86_64-pc-windows-msvc` for Windows, `--target aarch64-apple-darwin`
    for Apple Silicon.
13. Embed custom configuration: build with `--features=embed-config` to bake `opencode.json`
    directly into the binary for zero-config fleet deployment scenarios.
14. Verify binary integrity after download: `sha256sum api-oss` (Linux/macOS) or
    `Get-FileHash api-oss.exe -Algorithm SHA256` (PowerShell) — match the hash against the
    release checksums published on the GitHub releases page for supply chain security.
15. For minimal builds: `cargo build --release --no-default-features --features=core` produces
    a stripped binary of approximately 35 MB containing only the engine, CLI, and WebSocket
    server without bridges, tunnel, or WASM runtime — suitable for embedded or resource-
    constrained environments like Raspberry Pi with limited storage.

## The Moat
- Competitors distribute as multi-service deployments, Docker containers, or cloud APIs —
  none offer a single binary containing the full platform.
- A single binary with the graph engine, ledger, model runtime, protocol handlers, bridge
  agents, and CLI is only possible because of Rust's zero-cost abstractions, static linking,
  and the architectural decision to build everything as a monorepo.
- The approximately 81 MB size is remarkable for the breadth of functionality — Nvidia NIM
  containers are 2–10 GB each.
- Zero runtime dependencies means it runs on any machine, any Linux distro (including musl-
  based Alpine), any Windows version back to 7, any macOS back to 10.15.

## Why Choose API-OSS
An IT administrator can deploy API-OSS across 10,000 enterprise workstations using SCCM,
Ansible, or Jamf by pushing a single binary — no dependency chain to manage. A defense
operator transfers the binary to an air-gapped system on a USB drive and has the full
platform running in seconds. A consumer downloads one file and runs it.

## Competitive Comparison
- **Palantir**: Multi-service Java deployment, requires JVM, extensive dependencies.
- **OpenAI/Anthropic**: Cloud API, no binary distribution.
- **Nvidia**: NIM containers, Docker-required, 2–10 GB images.
- **Ollama**: Single binary but inference-only (~500 MB+). No graph/ledger/bridges.

## Cost-Benefit Analysis
Java deployments require JVM management ($200–$500/year per server). Python deployments
require runtime and pip packages (hours per deployment). API-OSS single binary eliminates
this. The ~81 MB binary downloads in ~10 seconds on 100 Mbps vs 2–10 GB NIM images taking
3–15 minutes. Cross-platform build eliminates platform-specific packaging ($50k–$100k/year).
ngrok charges $20/month for tunnels; the built-in tunnel is included in the single binary
at no extra cost. OpenAI charges $0.01/1K tokens for API calls; all 87 CLI commands and
810 protocol messages execute locally at zero per-command cost.

Comparing to cloud alternatives: OpenAI charges $0.15/M tokens for GPT-4 inference — a
team processing 10M tokens/month pays $1,500/month or $18,000/year in API fees alone.
API-OSS runs the free Qwen2-VL-2B-Instruct-Q4_K_M.gguf model locally on a one-time $2,000
GPU workstation. Anthropic Claude API at $0.015/M input + $0.075/M output tokens for similar
volume costs $900/month. Palantir Foundry requires a minimum $500k/year contract plus
dedicated infrastructure. The single binary eliminates dependency management across 10,000
machines: no JRE installation ($37.50/machine = $375k for 10k at 30 min each), no Python
virtualenv setup ($25/machine = $250k for 10k at 20 min each), no Docker daemon installation
($50/machine = $500k for 10k). Zero runtime dependencies also eliminates the need for
vulnerability scanning across multiple runtime layers — reducing security operations overhead
by approximately 60% compared to a typical Java or Python deployment stack.

## Applications
- **Consumer**: Download one file and run — no installation, no dependencies.
- **Government / Defense**: Deploy in air-gapped environments with a single USB transfer.
- **Enterprise**: Fleet deployment via SCCM, Ansible, or Jamf — one binary, no dependency
  chain across Windows, Linux, and macOS.

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

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
