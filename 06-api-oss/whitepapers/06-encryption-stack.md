---
title: "Encryption Stack"
sidebar_position: 6
description: "Comprehensive encryption architecture for API-OSS, covering data at rest, in transit, and in use."
tags: [whitepapers]
---

# Encryption Stack

## Abstract

Comprehensive encryption architecture for API-OSS, covering data at rest, in transit, and in use.

## Introduction

API-OSS implements defense-in-depth encryption across all data states, ensuring confidentiality and integrity throughout the system.

## Encryption Layers

```
Layer 1: Transport (TLS 1.3)
  ├── All external traffic
  ├── mTLS for peer-to-peer
  └── HTTP/3 (QUIC) support

Layer 2: Application
  ├── API key hashing (bcrypt)
  ├── Token encryption (AES-256-GCM)
  └── Session encryption (XChaCha20-Poly1305)

Layer 3: Data at Rest
  ├── Database encryption (TDE)
  ├── Config file encryption
  ├── Audit log encryption
  └── Backup encryption

Layer 4: Key Management
  ├── Hardware-backed keys (TPM)
  ├── Vault integration
  ├── Automatic key rotation
  └── Key escrow (HSM)
```

## TLS Configuration

```yaml
tls:
  min_version: 1.3
  ciphers:
    - TLS_AES_256_GCM_SHA384
    - TLS_CHACHA20_POLY1305_SHA256
  certificates:
    - cert_path: /etc/apioss/certs/tls.crt
      key_path: /etc/apioss/certs/tls.key
  mtls:
    enabled: true
    ca_path: /etc/apioss/certs/ca.crt
```

## Data Encryption at Rest

### Database

```yaml
database:
  encryption:
    algorithm: AES-256-GCM
    key_provider: vault
    key_name: apioss-db-key
    rotation_interval: 90d
```

### Audit Logs

```yaml
audit:
  encryption:
    enabled: true
    algorithm: AES-256-CBC
    key_derivation: HKDF-SHA256
    integrity: HMAC-SHA256
```

### Backups

```bash
apioss backup create --encrypt
apioss backup create --encrypt-key /path/to/key.pem
```

## Key Rotation

```bash
# Manual rotation
apioss key rotate --service database

# Automatic
apioss key schedule --interval 90d --service all
```

## HSM Integration

```yaml
hsm:
  provider: aws-cloudhsm
  cluster_id: cluster-abc123
  user: apioss
  partition: apioss-partition
```

## Next

- [07 Audit Ledger Integrity](07-audit-ledger-integrity.md)

## See Also

- [Whitepapers](../whitepapers/01-sovereign-ai-architecture.md)
- [Architecture Overview](../architecture/01-system-architecture.md)
