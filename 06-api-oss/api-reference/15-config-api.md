---
title: "API Reference 15: Configuration API"
sidebar_position: 15
description: "curl http://localhost:8080/v1/config"
tags: [api]
---

# API Reference 15: Configuration API

## REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/config` | Get full configuration |
| GET | `/v1/config/{key}` | Get specific config value |
| PUT | `/v1/config/{key}` | Update config value |
| POST | `/v1/config/validate` | Validate config without applying |
| GET | `/v1/config/schema` | Get config JSON schema |
| POST | `/v1/config/reload` | Reload config from file |

## Get Configuration

```bash
curl http://localhost:8080/v1/config \
  -H "Authorization: Bearer sk-aioss-admin-xxxxxxxxxxxx"
```

```json
{
  "gateway": {
    "host": "127.0.0.1",
    "port": 3030,
    "ui_port": 8080,
    "log_level": "info"
  },
  "model": {
    "llamafile_path": "~/.ai-oss/llamafile",
    "model_path": "~/.ai-oss/models/qwen2.5-7b-instruct-q4_k_m.gguf",
    "backend": "cpu",
    "context_length": 8192,
    "threads": 4,
    "n_gpu_layers": 0
  },
  "ledger": {
    "enabled": true,
    "directory": "./data/ledger",
    "auto_flush": true,
    "max_entries_per_file": 10000,
    "compress_after_days": 30
  },
  "tools": {
    "sandboxed": true,
    "allowed_paths": ["~/.ai-oss/", "/tmp/ai-oss/"],
    "blocked_commands": ["rm -rf /", "dd if=", ":(){:|:&};"]
  },
  "contradiction_engine": {
    "enabled": true,
    "scan_interval_ms": 60000
  }
}
```

## Get Specific Key

```bash
curl http://localhost:8080/v1/config/gateway.port \
  -H "Authorization: Bearer sk-aioss-admin-xxxxxxxxxxxx"
```

```json
{
  "key": "gateway.port",
  "value": 3030,
  "type": "integer",
  "description": "WebSocket server port",
  "default": 3030,
  "writable": true,
  "requires_restart": false
}
```

## Update Config

```bash
curl -X PUT http://localhost:8080/v1/config/gateway.log_level \
  -H "Authorization: Bearer sk-aioss-admin-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '"debug"'
```

```json
{
  "key": "gateway.log_level",
  "old_value": "info",
  "new_value": "debug",
  "requires_restart": false,
  "applied": true
}
```

## Config Schema

```bash
curl http://localhost:8080/v1/config/schema \
  -H "Authorization: Bearer sk-aioss-admin-xxxxxxxxxxxx"
```

Returns JSON Schema for the entire configuration object. Use this for:
- IDE autocomplete in config files
- Programmatic config generation
- Validation before applying

## Config Keys Reference

### Gateway

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `gateway.host` | string | `127.0.0.1` | Bind address |
| `gateway.port` | int | `3030` | WebSocket port |
| `gateway.ui_port` | int | `8080` | HTTP UI port |
| `gateway.log_level` | string | `info` | Log level (trace/debug/info/warn/error) |
| `gateway.log_format` | string | `text` | Log format (text/json) |
| `gateway.max_connections` | int | `1000` | Max WebSocket connections |
| `gateway.request_timeout_ms` | int | `60000` | Request timeout |

### Model

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `model.llamafile_path` | string | `~/.ai-oss/llamafile` | LlamaFile binary path |
| `model.model_path` | string | — | GGUF model file path |
| `model.backend` | string | `cpu` | Inference backend |
| `model.context_length` | int | `8192` | Context window size |
| `model.threads` | int | `4` | CPU threads for inference |
| `model.n_gpu_layers` | int | `0` | GPU layers (-1 = all) |
| `model.temperature` | float | `0.7` | Default temperature |

### Ledger

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `ledger.enabled` | bool | `true` | Enable audit ledger |
| `ledger.directory` | string | `./data/ledger` | Ledger storage path |
| `ledger.auto_flush` | bool | `true` | Flush after every entry |
| `ledger.max_entries_per_file` | int | `10000` | Max entries per file |
| `ledger.compress_after_days` | int | `30` | Compress old files |

### Network

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `network.tls.enabled` | bool | `false` | Enable TLS |
| `network.tls.cert_file` | string | — | TLS certificate path |
| `network.tls.key_file` | string | — | TLS key path |
| `network.tls.ca_file` | string | — | CA certificate (mTLS) |
| `network.rate_limit.enabled` | bool | `true` | Enable rate limiting |
| `network.rate_limit.requests_per_minute` | int | `500` | Max requests/min |

### Contradiction Engine

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `contradiction_engine.enabled` | bool | `true` | Enable contradiction detection |
| `contradiction_engine.scan_interval_ms` | int | `60000` | Scan interval |
| `contradiction_engine.inferred_depth` | int | `3` | BFS depth |
| `contradiction_engine.max_candidates_per_scan` | int | `100` | Performance cap |

## Config via Environment Variables

All config keys can be set via environment variables:

```bash
# Pattern: AIOSS__{SECTION}__{KEY}
export AIOSS__GATEWAY__PORT=9090
export AIOSS__MODEL__CONTEXT_LENGTH=16384
export AIOSS__LEDGER__ENABLED=true
```

## Config Priority

1. Environment variables (highest)
2. CLI flags
3. Config file (opencode.json)
4. Defaults (lowest)

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