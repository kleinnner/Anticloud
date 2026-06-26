---
title: "Deployment Architecture"
sidebar_position: 2
description: "This document describes deployment architectures for API-OSS across different environments: single-node, multi-node HA, multi-region, air-gapped, and hybrid cloud/on-prem."
tags: [architecture]
---

# Deployment Architecture

## Overview

This document describes deployment architectures for API-OSS across different environments: single-node, multi-node HA, multi-region, air-gapped, and hybrid cloud/on-prem.

## Deployment Models

### Single-Node (Development / Small Production)

```mermaid
graph LR
    subgraph "Single Host"
        GW["API-OSS Gateway<br/>:8080"]
        PG[("PostgreSQL")]
        RD[("Redis")]
        GW --- PG
        GW --- RD
    end
    C["Client"] --> GW
```
│  ┌────────────────┐  │
│  │   api-oss      │  │
│  │   binary       │  │
│  ├────────────────┤  │
│  │   PostgreSQL   │  │
│  ├────────────────┤  │
│  │   Redis        │  │
│  ├────────────────┤  │
│  │   LLM Runtime  │  │
│  └────────────────┘  │
└──────────────────────┘
```

- All services on one machine
- Docker Compose or bare-metal
- Good for: dev, staging, low-traffic production (<1K RPS)

### Multi-Node HA (Production)

```
                    ┌──────────────┐
                    │  LB / Proxy  │
                    │  (haproxy)   │
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
    │  api-oss  │   │  api-oss  │   │  api-oss  │
    │  node 1   │   │  node 2   │   │  node N   │
    └───────────┘   └───────────┘   └───────────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Redis     │
                    │   Cluster   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  PostgreSQL │
                    │  Primary    │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  PostgreSQL │
                    │  Replica    │
                    └─────────────┘
```

- Stateless API nodes behind load balancer
- Redis cluster for rate limiting, sessions, cache
- PostgreSQL primary-replica for read scalability
- Good for: production, 1K-50K RPS

### Multi-Region (Global)

```
    US-East                  EU-West                  AP-Southeast
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  LB → Nodes  │      │  LB → Nodes  │      │  LB → Nodes  │
│  Redis       │◄────►│  Redis       │◄────►│  Redis       │
│  PG Primary  │      │  PG Replica  │      │  PG Replica  │
└──────────────┘      └──────────────┘      └──────────────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
                        ┌──────▼──────┐
                        │  Global DNS │
                        │  (Geo-route)│
                        └─────────────┘
```

- Geo-DNS routes users to nearest region
- Cross-region Redis replication for rate limits
- PostgreSQL streaming replication
- Good for: global SaaS, <5ms latency requirements

### Air-Gapped (Isolated)

```
┌─────────────────────────────────────────┐
│  Physical / Air-Gapped Network          │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ api-oss  │  │ Local    │  │ Local  │ │
│  │ gateway  │  │ Registry │  │ Models │ │
│  └──────────┘  └──────────┘  └────────┘ │
│                                         │
│  No outbound internet access            │
│  All artifacts bundled / pre-loaded     │
└─────────────────────────────────────────┘
```

- Fully isolated network
- On-prem Docker registry with all images
- Pre-downloaded model weights
- Good for: defense, government, regulated industries

## Component Sizing

### API Gateway Nodes

| Profile | vCPU | RAM | Disk | Est. RPS |
|---|---|---|---|---|
| Small | 2 | 4 GB | 20 GB | 2,500 |
| Medium | 4 | 8 GB | 40 GB | 10,000 |
| Large | 8 | 16 GB | 80 GB | 25,000 |
| XL | 16 | 32 GB | 160 GB | 50,000+ |

### Database Sizing

| Connections | RAM | CPU | Storage |
|---|---|---|---|
| <100 | 4 GB | 2 | 50 GB |
| 100-500 | 8 GB | 4 | 200 GB |
| 500-2000 | 16 GB | 8 | 500 GB |
| 2000+ | 32 GB | 16 | 1 TB+ |

### Redis Sizing

| Cache Size | Memory | Connections |
|---|---|---|
| Small (<5K keys) | 1 GB | 100 |
| Medium (5K-50K) | 4 GB | 500 |
| Large (50K-500K) | 16 GB | 2000 |

## Network Requirements

### Ports

| Port | Service | Protocol | Access |
|---|---|---|---|
| 8080 | API Gateway (HTTP) | TCP | Public |
| 8443 | API Gateway (HTTPS) | TCP | Public |
| 3030 | WebSocket | TCP | Public |
| 5432 | PostgreSQL | TCP | Internal only |
| 6379 | Redis | TCP | Internal only |

### Firewall Rules

```
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -p tcp --dport 8443 -j ACCEPT
iptables -A INPUT -p tcp --dport 3030 -j ACCEPT
iptables -A INPUT -p tcp --dport 5432 -s 10.0.0.0/8 -j ACCEPT
iptables -A INPUT -p tcp --dport 6379 -s 10.0.0.0/8 -j ACCEPT
```

## High Availability

### API Nodes

- Minimum 3 nodes for HA
- Deploy across availability zones
- Session affinity not required (stateless)

### Database

- Primary + 2 replicas minimum
- Automatic failover (Patroni, pg_auto_failover)
- Read replicas for reporting workloads

### Redis

- Redis Sentinel or Cluster mode
- Persistence enabled (AOF + RDB)
- At least 3 Sentinel nodes

## Next Steps

- [03 Security Architecture](03-security-architecture.md)
- [04 Data Flow Architecture](04-data-flow-architecture.md)
- [Deployment Guide](../deployment/01-deployment-overview.md)

## See Also

Related architecture, deployment, and operations documentation.

- [Deployment Guide](../deployment/01-overview.md)
- [Security Overview](../security/01-security-overview.md)
- [Operations Guide](../operations/01-operations-overview.md)
- [Self-Hosting Guide](../self-hosting/01-overview.md)

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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
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
