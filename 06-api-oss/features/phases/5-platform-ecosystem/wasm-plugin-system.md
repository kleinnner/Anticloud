---
title: "WASM Plugin System"
sidebar_position: 99
description: "Extends API-OSS with WebAssembly plugins running in a sandboxed execution environment using"
tags: [features]
---

# WASM Plugin System

## What It Does
Extends API-OSS with WebAssembly plugins running in a sandboxed execution environment using
the wasmtime runtime. Plugins can provide custom tools, data sources, connector
transformations, component types for the App Builder, and agent behaviors — all with zero
memory safety concerns and strict resource limits (CPU cycles, memory allocation, execution
time). No cloud dependency for plugin execution — everything runs locally in the sandbox.
Marketplace packages are cryptographically signed with developer Passaportes.

## How It Works
The WASM plugin system is implemented in `wasm_sandbox.rs` under `ai-oss-gateway/src/` using
the `wasmtime` Rust crate. The sandbox enforces three resource limits: CPU cycles
(configurable, default 1 million WebAssembly instructions per invocation), memory allocation
(configurable, default 64 MB linear memory), and execution time (configurable, default 5
seconds wall-clock). Plugins are compiled WebAssembly modules (`.wasm` files) that expose
functions through a defined ABI (Application Binary Interface) — the plugin imports
functions from the host (API-OSS gateway) and exports functions for the host to call. The
ABI provides: `graph_query`, `graph_add_node`, `graph_add_edge`, `model_infer`,
`ledger_entry`, `log_message`, `http_request` (limited to allowlisted domains), and
`bridge_send`. Plugins are installed via the marketplace system (WS `plugin_install` or
marketplace install) with cryptographic hash verification — the plugin binary's SHA-256 hash
must match the signature in its marketplace manifest, signed by the developer's Passaporte.
The plugin registry (stored as graph nodes) tracks installed plugins with their hash,
version, permissions, and enabled/disabled state. WASI (WebAssembly System Interface) is
partially supported — plugins can access a virtual filesystem scoped to a per-plugin
directory (`./plugins/<plugin-id>/`) and a virtual clock. Security: plugins cannot access
the network directly (HTTP requests go through the host ABI with domain allowlist
enforcement), cannot execute arbitrary shell commands, and cannot read/write files outside
their virtual directory. The sandbox is designed to run untrusted code safely. The frontend
provides a plugin management UI (install, uninstall, enable/disable, configure) on the HTTP
UI at port 8081. WASM plugins are the recommended extension mechanism for all custom
functionality: custom connector transformations, custom pipeline steps, custom App Builder
components, custom graph analysis algorithms, and custom bridge message handlers.

The plugin ABI (Application Binary Interface) is defined as a set of imported and exported
WASM functions using the `wasmtime::Linker` API. Host-imported functions available to
plugins: `graph_query(query_ptr: i32, query_len: i32) -> i32` (returns a handle to the
result), `graph_add_node(label_ptr: i32, label_len: i32, props_ptr: i32, props_len: i32) ->
i32` (returns node ID), `graph_add_edge(from_ptr: i32, from_len: i32, to_ptr: i32, to_len:
i32, label_ptr: i32, label_len: i32)`, `model_infer(prompt_ptr: i32, prompt_len: i32) ->
i32`, `ledger_entry(key_ptr: i32, key_len: i32, value_ptr: i32, value_len: i32) -> i32`,
`log_message(level: i32, msg_ptr: i32, msg_len: i32)`, and
`http_request(url_ptr: i32, url_len: i32, body_ptr: i32, body_len: i32) -> i32`. The ABI
uses linear memory pointers — the host and plugin share the WASM instance's linear memory,
with the host reading/writing strings and JSON blobs at the addresses the plugin provides.
The plugin exports `allocate(len: i32) -> i32` for the host to request memory (used for
return values) and `process(input_ptr: i32, input_len: i32) -> i32` as the main entry point.
The `process` function receives a JSON string containing the invocation context (plugin
configuration, input data, gateway state snapshot) and returns a JSON string with the
result. When a plugin is installed, `wasm_sandbox.rs` compiles the `.wasm` binary using
`wasmtime::Engine::new(&config)` and stores the compiled module in a
`ModuleCache` (`HashMap<String, (Instant, wasmtime::Module)>`) with LRU eviction (max 50
modules cached). Each invocation creates a fresh `Instance` from the cached module —
ensuring state isolation between calls. Memory is limited via `max_memory_size` in the
`wasmtime::Config`. Fuel-based CPU limiting uses `store.set_fuel(fuel_budget)` before
calling `instance.get_func("process")`, and the `wasmtime::FuelConsumed` trap fires when
fuel runs out, returning a JSON error `{"error": "cpu_limit_exceeded"}`.

## How to Operate
1. Start the gateway: `api-oss start`. The WASM runtime is loaded on demand.
2. Install a plugin from the marketplace: open Marketplace view in web UI at
   `http://localhost:8081/marketplace`, find a plugin, click Install. Or use WS
   `marketplace_install`.
3. Install from local file: WS `plugin_install` with WASM file path, or UI "Install from
   file" option.
4. List installed plugins: `plugin_list` WS message or Plugin Management view in web UI.
5. Enable/disable: `plugin_configure` WS with `{enabled: true/false}` or UI toggle.
6. Invoke a plugin: `plugin_invoke` WS with plugin ID and JSON payload.
7. Develop a plugin: write Rust/WAT/AssemblyScript module that compiles to WASM implementing
   the API-OSS plugin ABI. Build with `wasm-pack build --target web` or
   `cargo build --target wasm32-wasi`.
8. Test locally: place `.wasm` file in `./plugins/test/` and call `plugin_invoke`.
9. Publish to private marketplace: sign WASM with Passaporte, add metadata entry.
10. Configure resource limits in `opencode.json` under `plugins.resource_limits`.

## The Moat
- Competitors like Palantir have closed extension models requiring partner agreements and
  cloud access — you cannot independently extend the platform.
- A fully offline, sandboxed WASM plugin system allows anyone to extend API-OSS with
  arbitrary logic while maintaining safety guarantees — memory safety, resource limits, and
  deterministic execution are guaranteed by the WebAssembly design.
- The wasmtime sandbox provides stronger guarantees than Docker containers (no OS kernel
  surface, no filesystem access without WASI, deterministic CPU limits) and is much lighter
  weight (microsecond startup versus millisecond for containers).
- Cryptographic signing with Passaportes creates a decentralized trust model — plugin trust
  is established by identity, not by a central app store.

## Why Choose API-OSS
A developer writes a custom graph analysis plugin in Rust, compiles to WASM, and loads it
into API-OSS without restarting the gateway, without Docker, and without cloud deployment.
A defense agency develops proprietary plugins for classified analysis algorithms and
distributes them internally via a private marketplace — all execution happens in the WASM
sandbox with no risk to the host system. An enterprise builds custom connector transformers,
pipeline steps, and App Builder components as WASM plugins.

## Competitive Comparison
- **Palantir**: Closed extension model, partner-only, cloud-dependent.
- **OpenAI**: Plugin system (GPTs) exists but cloud-only, no sandboxed local execution.
- **Anthropic**: No plugin system, closed model.
- **Nvidia**: No plugin system for extending the platform.
- **Docker**: General-purpose containers, not for plugin systems. Heavier, slower, wider
  security surface. WASM is purpose-built for sandboxed plugin execution.

## Cost-Benefit Analysis
Building a custom Palantir extension requires Palantir engagement ($200k+/year minimum).
WASM plugin development is a weekend project for a Rust developer. Docker for plugin
isolation: $500–$2,000/month in infrastructure. WASM sandbox runs in-process with
microsecond startup and zero infrastructure. WASM memory safety eliminates entire classes
of CVEs that plague native plugins — each prevented security incident saves $100k–$1M.

## Applications
- **Consumer**: Install community plugins for home automation, custom data analysis.
- **Government / Defense**: Custom analysis plugins for classified workloads. Proprietary
  algorithms via private marketplace. Air-gapped deployment.
- **Enterprise**: Proprietary plugins for internal tools. Custom connector transformers for
  legacy systems. Custom App Builder components.

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

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

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
