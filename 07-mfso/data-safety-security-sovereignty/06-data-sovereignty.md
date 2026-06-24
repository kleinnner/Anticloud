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

# Data Sovereignty — Local-First, No Cloud Dependency & User Controls Keys

## 1. Executive Summary

Data sovereignty is the concept that data is subject to the laws and governance structures of the jurisdiction where it is collected or held. In the digital context, it means users retain control over their data — who can access it, where it resides, and how it is used.

MF+SO is built on data sovereignty principles. User data resides on the user's device, under their physical and legal control. The relay infrastructure is intentionally blind and ephemeral. This document explains how MF+SO achieves true data sovereignty.

### 1.1 Sovereignty Principles

| Principle | Description |
|-----------|-------------|
| Local storage | Data stays on user's device |
| User key control | Only user holds encryption keys |
| No cloud copy | No server-side data storage |
| User-directed sharing | Data leaves device on user command |
| Open standard | .aioss chain is portable |
| Transparent code | Source code is publicly auditable |

## 2. Local-First Architecture

### 2.1 Data Location

| Data Type | Default Location | Secondary Location |
|-----------|-----------------|-------------------|
| .aioss chain | User device | User-managed backup |
| Credentials | User device | User-managed backup |
| Private keys | Platform authenticator | Never exported |
| Configuration | User device | User-managed export |

### 2.2 No Cloud Storage

MF+SO does not store user data on any server:

- No user database
- No credential storage
- No key escrow
- No account profiles
- No activity logs

## 3. User Key Control

### 3.1 Key Ownership

| Key | Owner | Location | Server Access |
|-----|-------|----------|---------------|
| Seed phrase | User | User-managed | None |
| Vault key | User | Derived locally | None |
| Identity key | User | Platform authenticator | None |
| Session keys | User | Memory only | None |

### 3.2 No Key Escrow

MF+SO has no mechanism to recover user keys:

- No password reset
- No account recovery by support
- No backdoor keys
- No government access

## 4. Cloud Independence

### 4.1 No Mandatory Cloud Services

| Service | Cloud Required | MF+SO Alternative |
|---------|---------------|-------------------|
| Authentication | No | Local device |
| Credential storage | No | Local IndexedDB |
| Device sync | Optional (relay) | P2P direct |
| Backup | No | Local file export |
| Updates | No | Optional PWA update |

### 4.2 Relay Server Optionality

The relay server is:

- **Optional**: Devices can sync directly via LAN or QR code
- **Replaceable**: Can be self-hosted
- **Transparent**: Open source, auditable
- **Stateless**: No persistent storage

## 5. Jurisdictional Independence

### 5.1 Legal Jurisdiction

- User data is subject to the jurisdiction of the device's location
- MF+SO relays do not determine data jurisdiction
- Users can choose relay regions
- On-premises relay for full jurisdictional control

### 5.2 Regulatory Implications

| Regulation | MF+SO Impact |
|-----------|-------------|
| GDPR | Data stays with user (controller) |
| CCPA | User controls their data |
| Data localization laws | Local storage, local control |
| Cross-border restrictions | E2E encrypted relay |

## 6. Portability and Interoperability

### 6.1 .aioss Chain Portability

The .aioss chain is a standard-format, exportable data structure:

- Exportable to JSON, CBOR, CSV
- Importable by other compatible systems
- Self-verifying (hash chain integrity)
- Human-readable (JSON export)

### 6.2 Vendor Independence

- No proprietary formats
- No vendor lock-in
- Open protocol specification
- Multiple implementation possibilities

## 7. Sovereignty Verification

Users can verify data sovereignty:

1. Inspect local .aioss chain
2. Monitor network traffic
3. Audit relay server code
4. Verify no server-side data
5. Confirm key control

---

*MF+SO — Multi Factor+ Sign On*
*by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner*
*The Sovereign Identity & Authentication Vault*
