---
title: "Security Architecture"
sidebar_position: 3
description: "This document describes the security architecture of API-OSS, including trust boundaries, authentication flows, authorization model, encryption layers, and audit infrastructure."
tags: [architecture]
---

# Security Architecture

## Overview

This document describes the security architecture of API-OSS, including trust boundaries, authentication flows, authorization model, encryption layers, and audit infrastructure.

## Security Layers

```
┌──────────────────────────────────────────────────┐
│                Layer 5: Audit & Monitoring        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │  Audit   │ │  SIEM    │ │  Alerts  │         │
│  │  Logs    │ │  Export  │ │          │         │
│  └──────────┘ └──────────┘ └──────────┘         │
├──────────────────────────────────────────────────┤
│                Layer 4: Application Security       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │  Input   │ │  Rate    │ │  Plugin  │         │
│  │  Validation│ │  Limiting│ │  Sandbox │         │
│  └──────────┘ └──────────┘ └──────────┘         │
├──────────────────────────────────────────────────┤
│                Layer 3: Access Control             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │   AuthN  │ │   AuthZ  │ │  Session │         │
│  │  (MFA/SSO)│ │  (RBAC)  │ │ Mgmt    │         │
│  └──────────┘ └──────────┘ └──────────┘         │
├──────────────────────────────────────────────────┤
│                Layer 2: Data Security              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │  TLS 1.3 │ │  Encrypt │ │  Secrets │         │
│  │          │ │  at Rest │ │  Vault   │         │
│  └──────────┘ └──────────┘ └──────────┘         │
├──────────────────────────────────────────────────┤
│                Layer 1: Network Security            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │   WAF    │ │  DDoS    │ │  Network │         │
│  │          │ │  Protect │ │  Segments│         │
│  └──────────┘ └──────────┘ └──────────┘         │
└──────────────────────────────────────────────────┘
```

## Trust Boundaries

```
Public Internet  ──TLS 1.3──►  DMZ / WAF
                                    │
                              Trust Boundary 1
                                    │
                                    ▼
                              API Gateway
                                    │
                              Trust Boundary 2
                                    │
                                    ▼
                              Auth Service
                                    │
                         ┌──────────┼──────────┐
                         │          │          │
                    Trust B3    Trust B3    Trust B3
                         │          │          │
                         ▼          ▼          ▼
                    Upstream    Database     Cache
```

## Authentication Flow

```
Client ──Request + Key──► Gateway ──Validate Key──► Auth Service
                              │                          │
                              ◄─────── Key Valid ────────│
                              │
                         Response ◄─── Client
```

### MFA Flow

```
User → Login Form → Password Check → MFA Challenge (TOTP/WebAuthn)
                                          │
                                     Verify → Issue Session JWT
```

## Authorization Model

### Policy Decision Point

```
Request → PEP (Gateway) → PDP (Auth Service) → PIP (Policy Store)
                │                                      │
                ▼                                      ▼
           Allow/Deny ←────────── Decision ────────────
```

### Permission Evaluation

1. Extract user roles from JWT/session
2. Load role-to-permission mappings
3. Evaluate ABAC conditions (time, IP, resource attributes)
4. Check deny rules first (priority)
5. Check allow rules
6. Default: deny

## Encryption Architecture

### In Transit

```
Client → Gateway:  TLS 1.3 (mandatory)
Gateway → Upstream: mTLS (optional, recommended)
Gateway → DB:       TLS 1.2+ (mandatory)
Gateway → Redis:    TLS (optional, recommended)
```

### At Rest

```
Database:    Transparent Data Encryption (AES-256)
Config:      Encrypted with KMS-backed master key
Backups:     AES-256-CBC with separate key
Logs:        File-level encryption or encrypted volume
Secrets:     Vault-backed with auto-rotation
```

## Audit Architecture

```
Application Events → Audit Logger (JSON, SHA-256 chain)
                          │
                          ▼
                    Audit Store (append-only, immutable)
                          │
                     ┌────┴────┐
                     ▼         ▼
                 Query API   Export to SIEM
```

### Integrity Chain

```
Entry N-1: hash(N-1) = h1
Entry N:   hash(data_N + h1) = h2
Entry N+1: hash(data_N+1 + h2) = h3
```

## Secrets Architecture

```
KMS (master key, HSM-backed) → Vault (encrypted with master key)
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
              DB Password      API Keys        Plugin Secrets
```

## Next Steps

- [04 Data Flow Architecture](04-data-flow-architecture.md)
- [05 Network Architecture](05-network-architecture.md)
- [Security Hardening Guide](../security/01-security-overview.md)

## See Also

Related architecture, deployment, and operations documentation.

- [Deployment Guide](../deployment/01-overview.md)
- [Security Overview](../security/01-security-overview.md)
- [Operations Guide](../operations/01-operations-overview.md)
- [Self-Hosting Guide](../self-hosting/01-overview.md)
