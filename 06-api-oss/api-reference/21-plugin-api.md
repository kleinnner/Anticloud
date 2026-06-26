---
title: "API Reference 21: Plugin API"
sidebar_position: 21
description: "curl http://localhost:8080/v1/plugins"
tags: [api]
---

# API Reference 21: Plugin API

## REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/plugins` | List installed plugins |
| POST | `/v1/plugins` | Install a plugin |
| GET | `/v1/plugins/{id}` | Get plugin details |
| PUT | `/v1/plugins/{id}/config` | Update plugin config |
| DELETE | `/v1/plugins/{id}` | Uninstall plugin |
| POST | `/v1/plugins/{id}/enable` | Enable plugin |
| POST | `/v1/plugins/{id}/disable` | Disable plugin |
| POST | `/v1/plugins/validate` | Validate plugin manifest |
| POST | `/v1/plugins/scaffold` | Generate plugin scaffold |

## List Plugins

```bash
curl http://localhost:8080/v1/plugins \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "data": [
    {
      "id": "web-scraper",
      "name": "Web Scraper",
      "version": "1.2.0",
      "author": "AI-OSS Team",
      "description": "Scrape and extract content from web pages",
      "type": "tool",
      "status": "enabled",
      "permissions": ["network:http"],
      "installed_at": "2026-05-15T10:00:00Z",
      "size_kb": 256
    }
  ]
}
```

## Plugin Types

| Type | Description | Sandbox | Example |
|------|-------------|---------|---------|
| `tool` | WASM tool for AI to call | WASM | calculator, web scraper |
| `connector` | External data connector | WASM | Salesforce, SAP |
| `bridge` | Platform bridge | WASM | Signal, SMS |
| `dashboard` | Custom frontend view | Iframe | Charts, analytics |
| `data_source` | Data for RAG | WASM | Custom DB connector |
| `model_loader` | Custom model format | Native | GGUF, ONNX |

## Install Plugin

```bash
# From file
curl -X POST http://localhost:8080/v1/plugins \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -F "plugin=@my-plugin.wasm" \
  -F "manifest=@manifest.toml"

# From marketplace
curl -X POST http://localhost:8080/v1/plugins \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "marketplace",
    "marketplace_id": "web-scraper",
    "version": "1.2.0"
  }'

# From URL
curl -X POST http://localhost:8080/v1/plugins \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "url",
    "url": "https://plugins.api-oss.local/web-scraper/1.2.0/plugin.wasm",
    "manifest_url": "https://plugins.api-oss.local/web-scraper/1.2.0/manifest.toml"
  }'
```

## Plugin Manifest

```toml
[plugin]
id = "my-plugin"
name = "My Plugin"
version = "1.0.0"
author = "Developer Name"
description = "Description of what this plugin does"
license = "MIT"
homepage = "https://github.com/user/my-plugin"
api_oss_version = ">=0.1.0"

[permissions]
network = ["https://api.example.com"]
filesystem = ["read:/data", "write:/tmp"]
models = ["qwen2.5-7b-q4"]

[config]
default_timeout = 30
max_results = 100

[entrypoint]
wasm = "target/wasm32-wasi/release/my-plugin.wasm"
handler = "handle_tool_call"
```

## Plugin Scaffold (Generate)

```bash
curl -X POST http://localhost:8080/v1/plugins/scaffold \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-plugin",
    "type": "tool",
    "language": "rust",
    "output_dir": "./plugins/my-plugin"
  }'
```

Returns a zip file containing plugin template with:
- `Cargo.toml` with WASI target
- `src/lib.rs` with handler skeleton
- `manifest.toml` with basic config
- `README.md` with build instructions

## Plugin Permissions Schema

| Permission | Description | Risk |
|------------|-------------|------|
| `network:http` | Outbound HTTP requests | Medium |
| `network:ws` | Outbound WebSocket | Medium |
| `filesystem:read` | Read files from allowed paths | Medium |
| `filesystem:write` | Write files to allowed paths | High |
| `process:spawn` | Execute subprocesses | Critical |
| `process:env` | Read environment variables | High |
| `graph:read` | Read knowledge graph | Low |
| `graph:write` | Write to knowledge graph | Medium |
| `model:infer` | Run model inference | Medium |
| `ledger:read` | Read audit ledger | Low |
| `ledger:write` | Write to audit ledger | High |

## WebSocket Plugin Messages

| Type | Direction | Description |
|------|-----------|-------------|
| `plugin.status` | Server → Client | Plugin status change |
| `plugin.tool_call` | Client → Server | Execute plugin tool |
| `plugin.tool_result` | Server → Client | Tool execution result |
| `plugin.config` | Client → Server | Update plugin config |
| `plugin.error` | Server → Client | Plugin error |

## See Also

Related API, CLI, and SDK reference documentation.

- [OpenAPI Spec](../spec/openapi.yaml)
- [CLI Reference](../cli/01-getting-started.md)
- [SDK Documentation](../dev/01-getting-started.md)
- [Reference Guide](../reference/01-reference-overview.md)

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com