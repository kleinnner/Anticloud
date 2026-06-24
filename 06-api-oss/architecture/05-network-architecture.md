---
title: "Network Architecture"
sidebar_position: 5
description: "This document describes the network topology, connectivity model, DNS routing, load balancing, and network security groups for API-OSS deployments."
tags: [architecture]
---

# Network Architecture

## Overview

This document describes the network topology, connectivity model, DNS routing, load balancing, and network security groups for API-OSS deployments.

## Network Topology

### Production Network

```mermaid
graph LR
    I((Internet))
    CDN["CDN / WAF<br/>Cloudflare / AWS"]
    PUB["Public Subnet"]
    LB["NLB / ALB"]
    subgraph "Private Subnet"
        GW1["Gateway Node 1"]
        GW2["Gateway Node 2"]
        GW3["Gateway Node N"]
    end
    subgraph "Data Subnet"
        PG[("PostgreSQL<br/>Primary")]
        PR[("PostgreSQL<br/>Replica")]
        RD[("Redis<br/>Cluster")]
    end

    I --> CDN --> PUB --> LB
    LB --> GW1
    LB --> GW2
    LB --> GW3
    GW1 --> PG
    GW2 --> PG
    GW3 --> PG
    GW1 --> PR
    GW2 --> RD
```
                                    Private Subnet
                                    ┌───────────────┐
                                    │  api-oss nodes │
                                    └───────┬───────┘
                                            │
                                      Data Subnet
                                    ┌────┬────┬──┐
                                    │ PG │RDS │… │
                                    └────┴────┴──┘
```

### Multi-Region Network

```
Route53 Geo-DNS
     │
     ├── us-east-1: NLB → api-oss nodes → PG Primary
     ├── eu-west-1: NLB → api-oss nodes → PG Replica
     └── ap-southeast-1: NLB → api-oss nodes → PG Replica
```

### Air-Gapped Network

```
┌─────────────────────────────────────────┐
│  Physical Security Perimeter             │
│                                          │
│  DMZ Zone          Internal Zone         │
│  ┌────────┐        ┌────────────────┐    │
│  │Reverse │        │ api-oss nodes  │    │
│  │ Proxy  │        │ Database       │    │
│  └────────┘        │ Models (local) │    │
│                    └────────────────┘    │
│  No outbound internet                    │
└──────────────────────────────────────────┘
```

## DNS Architecture

| Record | Type | Target |
|---|---|---|
| api.example.com | A | NLB IP (round-robin) |
| admin.api.example.com | A | NLB IP (internal) |
| ws.api.example.com | A | NLB IP (WebSocket) |

### Geo-Routing

```
us-east-1.api.example.com → us-east NLB
eu-west-1.api.example.com → eu-west NLB
api.example.com           → Route53 latency-based routing
```

## Load Balancing

### Layer 4 (TCP)

| Port | Service | Algorithm |
|---|---|---|
| 443 | HTTPS | least-connections |
| 3030 | WebSocket | least-connections |
| 8443 | Admin HTTPS | round-robin |

### Layer 7 (HTTP)

| Path | Target |
|---|---|
| /api/v1/* | Admin nodes |
| /v1/* | Proxy nodes |
| /ws | WebSocket nodes |

## Network Security Groups

```
sg-apioss-public:
  Inbound:  443, 3030/tcp from 0.0.0.0/0; 8443/tcp from admin CIDRs
  Outbound: 0.0.0.0/0 (for updates)

sg-apioss-private:
  Inbound:  8080, 3030/tcp from sg-apioss-public
  Outbound: 5432/tcp to sg-postgres; 6379/tcp to sg-redis

sg-postgres:
  Inbound:  5432/tcp from sg-apioss-private
```

## VPC Peering

```
VPC A (api-oss) ── VPC Peering ── VPC B (upstream services)
```

Cross-region: Transit Gateway with private IP routing.

## Bandwidth Planning

| Traffic Type | Est. Bandwidth |
|---|---|
| API requests | 100 KB/req avg |
| Streaming responses | 1-10 MB/stream |
| Embedding | 50 KB/req |
| WebSocket | 1-5 KB/msg |
| Database | 10-100 KB/query |
| Redis | 1-10 KB/op |

## Next Steps

- [06 Scaling Architecture](06-scaling-architecture.md)
- [07 Storage Architecture](07-storage-architecture.md)
- [Deployment Guide](../deployment/01-deployment-overview.md)

## See Also

Related architecture, deployment, and operations documentation.

- [Deployment Guide](../deployment/01-overview.md)
- [Security Overview](../security/01-security-overview.md)
- [Operations Guide](../operations/01-operations-overview.md)
- [Self-Hosting Guide](../self-hosting/01-overview.md)
