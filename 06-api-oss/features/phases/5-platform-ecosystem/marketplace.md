---
title: "Marketplace"
sidebar_position: 99
description: "A discover-and-install system for plugins, datasets, and models with a community-driven"
tags: [features]
---

# Marketplace

## What It Does
A discover-and-install system for plugins, datasets, and models with a community-driven
extension ecosystem. Marketplace content is cached and curated locally with offline-by-
default design. Install via WebSocket commands (port 3030) or CLI with cryptographic hash
verification (SHA-256). All packages are signed with developer Passaportes using ed25519
signatures and sandboxed during execution via the wasmtime runtime with resource limits.

## How It Works
The marketplace system uses WS messages (`marketplace_list`, `marketplace_search`,
`marketplace_install`, `marketplace_uninstall`) and CLI commands (`api-oss model pull`,
`api-oss model search`, etc. under ModelCmd with 15 subcommands). The marketplace metadata
is a curated git repository — content is defined in a community-maintained YAML index file,
syncable via optional connection to `marketplace.api-oss.local`. The offline-by-default design
means all marketplace data (package listings, metadata, dependencies) is cached locally in
the graph after first sync — searches come from local cache with no network request. The
optional remote store (`marketplace.api-oss.local`) provides updates, but the system works
fully without it. Security architecture: all packages are cryptographically signed with the
developer's Passaporte identity. The signature covers the package content hash (SHA-256),
name, version, and dependency tree. Before installation, the system verifies: the
developer's Passaporte is valid and not revoked, the package signature matches the content
hash, and all dependencies are available with verified hashes. Plugins execute in the WASM
sandbox (wasmtime runtime) with strict resource limits — CPU cycles (default 1 million
instructions), memory (default 64 MB), execution time (default 5 seconds). Version pinning
prevents unexpected upgrades; rollback restores previous cached versions. The marketplace
supports three content types: plugins (WASM binaries extending the engine), datasets
(structured data packages for the graph), and models (GGUF model files with hash manifests).
Community submissions use a PR process to the metadata git repo. The marketplace operator
can curate private marketplaces for organizational use with approved-only package policies.

The marketplace metadata is stored as a curated Git repository whose index is a
`marketplace.yaml` file with entries containing: `name`, `version`, `description`,
`content_type` (`plugin` | `dataset` | `model`), `author_passaporte` (ed25519 public key
hash), `sha256_hash` of the package artifact, `signature` (ed25519 signature over the hash
+ name + version), `dependencies` (list of `{name, version_constraint}`), and
`wasm_resource_limits` (optional overrides for CPU/memory/time for plugins). The CLI
commands for marketplace operations are defined via clap derive: `ModelCmd` includes
`Pull`, `List`, `Search`, `Verify`, and `Remove` subcommands, each with arguments for
package name, version constraint (`--version ^1.0`), and output format. The WASM sandbox
in `wasm_sandbox.rs` uses `wasmtime::Engine` with a `wasmtime::Config` that sets
`consume_fuel(true)` with a fuel budget (default 1M units translates to ~1M WASM
instructions), `max_memory_size(64 * 1024 * 1024)` (64 MB), and `epoch_interruption` for
wall-clock deadlines (default 5 seconds). Each plugin invocation creates a new
`wasmtime::Store` wrapping a `WasmPluginData` struct that holds the plugin's virtual
filesystem (an in-memory `HashMap<String, Vec<u8>>` scoped to
`./plugins/<plugin-id>/`), the configured HTTP domain allowlist, and the
`opencode.json` config snapshot relevant to the plugin. The store is dropped after the
invocation completes, ensuring memory is fully reclaimed and no state leaks between calls.

## How to Operate
1. Start the gateway: `api-oss start`. WebSocket on port 3030, HTTP UI on port 8081.
2. Browse the marketplace: open the Marketplace view in the web UI or use
   `api-oss model search --query "topic"`.
3. Install a model: `api-oss model pull qwen2-vl-2b-q4` — downloads and verifies.
4. Install a plugin: WS `marketplace_install` with the package name or UI Install button.
5. List installed items: `api-oss model list` or WS `marketplace_list --installed`.
6. Verify package integrity: `api-oss model verify <name>` — checks signature and hash.
7. Uninstall: WS `marketplace_uninstall` or UI Uninstall button.
8. For air-gapped: pre-download marketplace metadata, transfer via USB, load with
   `marketplace_install --offline --file ./package.wasm`.
9. Private marketplace: set `marketplace.remote` in `opencode.json` to private git repo.
10. Curate packages: use the Web UI or WS messages to approve/block packages.
11. Configure default resource limits for plugins in `opencode.json` under
    `plugins.resource_limits`: `max_cpu_instructions` (default 1M), `max_memory_mb` (default
    64), `max_execution_seconds` (default 5) — overrides per-package limits in marketplace
    metadata.
12. For automated deployments, use the CLI: `api-oss marketplace install --package my-plugin
    --version ^1.0 --offline --file ./plugin.wasm` for air-gapped environments, or
    `api-oss marketplace install --package my-plugin` for online installations with
    automatic dependency resolution and hash verification.

## The Moat
- Palantir's extension ecosystem is closed, curated by Palantir, and cloud-dependent —
  you cannot independently develop and install plugins without Palantir engagement.
- An open marketplace with offline-first design, cryptographic verification, and a community
  contribution model creates a self-sustaining ecosystem that no proprietary competitor can
  match.
- All packages cryptographically signed with developer Passaportes — trust established by
  decentralized identity, not a central authority.
- Sandboxed execution via wasmtime ensures memory safety and resource isolation — plugins
  cannot crash or compromise the host system.

## Why Choose API-OSS
A government agency runs a private marketplace with only vetted, approved plugins —
maintaining security while benefiting from community-developed extensions. An enterprise
contributes proprietary plugins to their internal marketplace sharing across the
organization without security risk. A consumer browses and installs community plugins for
home automation and custom tools — all cryptographically verified and sandboxed.

## Competitive Comparison
- **Palantir**: Closed ecosystem, partner-only extensions, cloud-dependent.
- **OpenAI**: GPT Store but cloud-only, OpenAI-controlled, no offline mode.
- **Nvidia**: NGC catalog but enterprise-focused, cloud-dependent, model containers only.
- **VS Code Extensions**: Excellent model but not applicable to AI decision platforms.

## Cost-Benefit Analysis
Building an in-house plugin system costs $100k–$500k. API-OSS marketplace is built-in and
free. OpenAI's GPT Store takes 30% of revenue — API-OSS marketplace has zero commission.
Private marketplace avoids vendor lock-in ($10k–$50k/year for enterprise marketplace
platforms). wasmtime sandbox prevents plugin-related security incidents ($100k–$1M each).
Installing community plugins versus building from scratch saves days to months.

Palantir's closed ecosystem means any integration requires Palantir engineering engagement
at $300–$500/hour with minimum contracts of $50k. A single custom Palantir plugin costs
$50k–$200k to develop through their partner program. API-OSS WASM plugins can be developed
by any Rust developer in a weekend — no partner program, no engagement contract, no minimum
fees. Nvidia NGC offers model containers but charges enterprise subscription fees
($5k–$20k/year per node) and does not support community-developed plugins. OpenAI GPT Store
charges 30% revenue share on all GPT interactions — for a popular GPT earning $10k/month,
that is $36k/year in commissions. API-OSS marketplace charges zero commission and supports
fully offline operation on air-gapped systems, which no competitor's marketplace offers.

## Applications
- **Consumer**: Install community plugins for home automation, custom data sources.
- **Government / Defense**: Curated internal marketplace with approved plugins only.
- **Enterprise**: Private marketplace for proprietary extensions vetted by security team.

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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
