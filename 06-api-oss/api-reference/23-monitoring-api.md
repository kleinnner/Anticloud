---
title: "API Reference 23: Monitoring API"
sidebar_position: 23
description: "curl http://localhost:8080/v1/monitoring/health"
tags: [api]
---

# API Reference 23: Monitoring API

## REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/monitoring/health` | Basic health check |
| GET | `/v1/monitoring/metrics` | Prometheus metrics |
| GET | `/v1/monitoring/status` | Detailed system status |
| GET | `/v1/monitoring/status/model` | Model inference stats |
| GET | `/v1/monitoring/status/graph` | Graph statistics |
| GET | `/v1/monitoring/status/system` | System resource usage |
| GET | `/v1/monitoring/alerts` | Active alerts |
| GET | `/v1/monitoring/events` | Recent system events |

## Health Check

```bash
curl http://localhost:8080/v1/monitoring/health
```

```json
{
  "status": "healthy",
  "version": "0.1.0",
  "uptime_seconds": 86400,
  "model_loaded": true,
  "graph_available": true,
  "disk_space_ok": true,
  "last_check": "2026-05-31T12:00:00Z",
  "checks": {
    "llamafile": { "status": "ok", "latency_ms": 5 },
    "sqlite": { "status": "ok", "latency_ms": 2 },
    "websocket": { "status": "ok", "connections": 12 },
    "disk": { "status": "ok", "free_gb": 45 },
    "memory": { "status": "ok", "available_mb": 4096 }
  }
}
```

## Prometheus Metrics

```bash
curl http://localhost:8080/v1/monitoring/metrics
```

```text
# HELP aioss_queries_total Total number of AI queries processed
# TYPE aioss_queries_total counter
aioss_queries_total{model="qwen2.5-7b-q4"} 15230

# HELP aioss_query_duration_ms Query duration in milliseconds
# TYPE aioss_query_duration_ms histogram
aioss_query_duration_ms_bucket{le="100"} 5000
aioss_query_duration_ms_bucket{le="500"} 12000
aioss_query_duration_ms_bucket{le="1000"} 14800
aioss_query_duration_ms_bucket{le="+Inf"} 15230
aioss_query_duration_ms_sum 2893700
aioss_query_duration_ms_count 15230

# HELP aioss_graph_nodes_total Number of nodes in the knowledge graph
# TYPE aioss_graph_nodes_total gauge
aioss_graph_nodes_total{codex_id="project-alpha"} 1420

# HELP aioss_connections_active Active WebSocket connections
# TYPE aioss_connections_active gauge
aioss_connections_active 12

# HELP aioss_model_memory_bytes Model memory usage
# TYPE aioss_model_memory_bytes gauge
aioss_model_memory_bytes{model="qwen2.5-7b-q4"} 4294967296

# HELP aioss_errors_total Total number of errors
# TYPE aioss_errors_total counter
aioss_errors_total{type="model_inference"} 23
aioss_errors_total{type="rate_limited"} 156
aioss_errors_total{type="auth_failed"} 5
```

## System Status

```bash
curl http://localhost:8080/v1/monitoring/status/system \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "cpu": {
    "usage_percent": 45.2,
    "cores": 8,
    "load_average": [3.2, 2.8, 2.5]
  },
  "memory": {
    "total_mb": 16384,
    "used_mb": 8192,
    "available_mb": 8192,
    "usage_percent": 50.0
  },
  "disk": {
    "total_gb": 256,
    "used_gb": 120,
    "free_gb": 136,
    "data_directory": "/data",
    "data_usage_gb": 45
  },
  "network": {
    "bytes_sent": 2147483648,
    "bytes_received": 1073741824,
    "active_connections": 12
  },
  "gpu": {
    "available": true,
    "name": "NVIDIA GeForce RTX 4070",
    "memory_total_mb": 12288,
    "memory_used_mb": 4096,
    "utilization_percent": 65.0,
    "temperature_celsius": 72
  }
}
```

## Active Alerts

```bash
curl http://localhost:8080/v1/monitoring/alerts \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "alerts": [
    {
      "id": "alert_001",
      "severity": "warning",
      "title": "Disk space below 20%",
      "message": "Data partition has 15% free space (18GB / 120GB)",
      "metric": "disk.free_percent",
      "threshold": 20,
      "current_value": 15,
      "triggered_at": "2026-05-31T10:00:00Z",
      "acknowledged": false
    }
  ]
}
```

## WebSocket Monitoring Messages

| Type | Description |
|------|-------------|
| `monitor.health` | Health status push |
| `monitor.metric` | Metric value push |
| `monitor.alert` | Alert triggered |
| `monitor.alert_resolved` | Alert cleared |

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

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