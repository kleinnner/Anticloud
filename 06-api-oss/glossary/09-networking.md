---
title: "Glossary 9: Networking Glossary"
sidebar_position: 9
description: "Documentation for Glossary 9: Networking Glossary"
tags: [glossary]
---

# Glossary 9: Networking Glossary

## Terms

### WebSocket
- Full-duplex communication over single TCP connection
- API-OSS primary API protocol (port 3030 by default)

### HTTP/HTTPS
- Hypertext Transfer Protocol (Secure)
- API-OSS REST API and UI served over HTTP/HTTPS

### TCP (Transmission Control Protocol)
- Reliable, connection-oriented transport protocol
- Foundation for HTTP, WebSocket, and gRPC in API-OSS

### TLS (Transport Layer Security)
- Encryption protocol for secure communication
- API-OSS uses TLS 1.3 by default

### mTLS (Mutual TLS)
- Two-way TLS authentication
- Both client and server present certificates

### P2P (Peer-to-Peer)
- Direct communication between nodes without central server
- API-OSS P2P network for sync and collaboration

### Mesh Network
- Network topology where each node connects to multiple others
- API-OSS supports mesh for P2P resilience

### Relay Server
- Server that forwards traffic between nodes that can't connect directly
- Used in P2P when NAT/firewall prevents direct connection

### NAT (Network Address Translation)
- Maps private IPs to public IPs for internet access
- Can prevent direct P2P connections, requiring relay

### STUN/TURN
- NAT traversal protocols for P2P
- STUN: discovers public IP, TURN: relays traffic

### Port
- Virtual endpoint for network communication
- API-OSS default: 3030 (WebSocket API), 8080 (UI)

### Proxy
- Intermediate server that forwards requests
- API-OSS can run behind reverse proxies (nginx, Caddy, HAProxy)

### Load Balancer
- Distributes traffic across multiple instances
- API-OSS supports horizontal scaling behind load balancers

### DNS (Domain Name System)
- Maps domain names to IP addresses
- API-OSS supports custom domain configuration

### Certificate
- Digital document verifying identity for TLS
- API-OSS supports Let's Encrypt auto-provisioning

## See Also

Related glossary and reference documentation.

- [Glossary Index](../glossary/01-index.md)
- [Terminology](../glossary/02-core-concepts.md)
- [API Reference](../api-reference/01-overview.md)
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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com