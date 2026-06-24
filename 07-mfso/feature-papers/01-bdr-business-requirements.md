<!--
     ▄▄▄   ▄▄▄  ▄▄▄  ▄▄▄▄▄▄▄▄              ▄▄▄▄      ▄▄▄▄     ▄▄▄     
    ██     ███  ███  ██▀▀▀▀▀▀            ▄█▀▀▀▀█    ██▀▀██      ██    
    ██     ████████  ██           ██     ██▄       ██    ██     ██    
    ██     ██ ██ ██  ███████   ▄▄▄██▄▄▄   ▀████▄   ██ ██ ██     ██    
  ▀▀█▄     ██ ▀▀ ██  ██        ▀▀▀██▀▀▀       ▀██  ██    ██     ▄█▀▀  
    ██     ██    ██  ██           ██     █▄▄▄▄▄█▀   ██▄▄██      ██    
    ██     ▀▀    ▀▀  ▀▀                   ▀▀▀▀▀      ▀▀▀▀       ██    
    ▀█▄▄                                                      ▄▄█▀    

MF+SO — Multi Factor+ Sign On
by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner
The Sovereign Identity & Authentication Vault
-->

# Business Requirements Document — Functional and Non-Functional Requirements

## 1. Executive Summary

This Business Requirements Document (BRD) defines the complete set of functional and non-functional requirements for the MF+SO sovereign identity and authentication vault. It serves as the authoritative reference for development, testing, and deployment.

### 1.1 Product Overview

MF+SO is a local-first, zero-knowledge, multi-factor authentication vault that enables users to securely store, manage, and use their authentication credentials across devices without relying on cloud infrastructure.

### 1.2 Business Objectives

| Objective | Success Metric | Target |
|-----------|---------------|--------|
| Eliminate password reuse | Users with unique credentials | 100% |
| Eliminate phishing | Successful phishing attempts | 0 |
| Enable passwordless auth | Users using WebAuthn only | > 50% |
| Zero-knowledge guarantee | Server data breach impact | Zero user data exposed |
| Open source adoption | GitHub stars | 5,000+ |

## 2. Functional Requirements

### 2.1 Vault Management

| FR-ID | Description | Priority |
|-------|-------------|----------|
| FR-001 | User can create a new vault with seed phrase | P0 |
| FR-002 | User can unlock vault using biometric/PIN | P0 |
| FR-003 | User can lock vault manually or by timeout | P0 |
| FR-004 | User can view all stored credentials | P0 |
| FR-005 | User can search/filter credentials | P1 |
| FR-006 | User can organize credentials into folders/tags | P2 |

### 2.2 Credential Management

| FR-ID | Description | Priority |
|-------|-------------|----------|
| FR-010 | User can add a new credential (website, username, password) | P0 |
| FR-011 | User can edit existing credential | P0 |
| FR-012 | User can delete credential | P0 |
| FR-013 | User can generate strong passwords | P0 |
| FR-014 | User can autofill credentials on websites | P0 |
| FR-015 | User can add notes to credentials | P1 |

### 2.3 Authentication

| FR-ID | Description | Priority |
|-------|-------------|----------|
| FR-020 | User can register WebAuthn platform authenticator | P0 |
| FR-021 | User can authenticate with WebAuthn | P0 |
| FR-022 | User can use recovery seed phrase | P0 |
| FR-023 | User can set up additional authenticators | P1 |
| FR-024 | User can view authentication history | P2 |

### 2.4 Multi-Device Sync

| FR-ID | Description | Priority |
|-------|-------------|----------|
| FR-030 | User can pair multiple devices | P0 |
| FR-031 | .aioss chain syncs between paired devices | P0 |
| FR-032 | Sync is E2E encrypted | P0 |
| FR-033 | User can unpair devices remotely | P1 |
| FR-034 | Conflict resolution on concurrent changes | P1 |

### 2.5 Backup and Recovery

| FR-ID | Description | Priority |
|-------|-------------|----------|
| FR-040 | User can export entire vault | P0 |
| FR-041 | User can import vault from export | P0 |
| FR-042 | User receives seed phrase during setup | P0 |
| FR-043 | Seed phrase verification during recovery | P0 |
| FR-044 | Automatic periodic backup reminder | P2 |

## 3. Non-Functional Requirements

### 3.1 Security

| NFR-ID | Description | Target |
|--------|-------------|--------|
| NFR-001 | All local data encrypted with AES-256-GCM | Required |
| NFR-002 | All network traffic encrypted with TLS 1.3 | Required |
| NFR-003 | Zero-knowledge relay (server cannot decrypt) | Required |
| NFR-004 | Authentication via FIDO2/WebAuthn | Required |
| NFR-005 | No plaintext secrets in memory after use | Required |

### 3.2 Performance

| NFR-ID | Description | Target |
|--------|-------------|--------|
| NFR-010 | Vault unlock time | < 2 seconds |
| NFR-011 | Credential retrieval | < 500ms |
| NFR-012 | Sync latency (P2P) | < 1 second |
| NFR-013 | Initial load time (PWA) | < 3 seconds |
| NFR-014 | Chain verification (10K entries) | < 1 second |

### 3.3 Availability

| NFR-ID | Description | Target |
|--------|-------------|--------|
| NFR-020 | Vault availability (offline) | 100% |
| NFR-021 | Relay server uptime | 99.9% |
| NFR-022 | Disaster recovery RTO | < 1 minute |
| NFR-023 | Maximum planned downtime | < 4 hours/month |

### 3.4 Compatibility

| NFR-ID | Description | Target |
|--------|-------------|--------|
| NFR-030 | Browser support | Chrome, Firefox, Safari, Edge |
| NFR-031 | Minimum device RAM | 2 GB |
| NFR-032 | Offline support | All core features |
| NFR-033 | Screen size support | 4.7" to ultrawide |

### 3.5 Compliance

| NFR-ID | Description | Target |
|--------|-------------|--------|
| NFR-040 | SOC 2 Type II certification | Year 2 |
| NFR-041 | GDPR compliance | From launch |
| NFR-042 | CCPA compliance | From launch |
| NFR-043 | WCAG 2.1 AA accessibility | From launch |

## 4. Constraints

| Constraint | Description |
|-----------|-------------|
| Open source | All code must be publicly available |
| No VC funding | Bootstrapped development |
| Minimum infrastructure | Relay servers only |
| No user tracking | No analytics, no telemetry |

## 5. Assumptions

| Assumption | Impact |
|-----------|--------|
| Users have modern browser | PWA capability |
| Users have at least one device | Vault access |
| Users can manage seed phrase | Recovery capability |
| Users understand basic security | Safe usage |

---

*MF+SO — Multi Factor+ Sign On*
*by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner*
*The Sovereign Identity & Authentication Vault*
