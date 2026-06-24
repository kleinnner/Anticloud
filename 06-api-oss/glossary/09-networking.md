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
