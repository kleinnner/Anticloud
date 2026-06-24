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

# Key Management — BIP39 Seed, Ed25519 Keys, Vault Key & Session Keys

## 1. Executive Summary

Key management is the foundation of any cryptographic system. MF+SO implements a hierarchical key management system that separates concerns, limits exposure, and enables secure recovery. The key hierarchy is rooted in a BIP39 seed phrase from which all other keys are derived.

This document describes the complete key management architecture: the key hierarchy, key generation, storage, usage, rotation, and recovery procedures.

### 1.1 Key Hierarchy Overview

```
BIP39 Seed Phrase (12 or 24 words)
    │
    ├── BIP39 Passphrase (optional)
    │
    ▼
PBKDF2-SHA256 / Argon2id
    │
    ▼
Master Seed (512 bits)
    │
    ├──→ Vault Key (AES-256-GCM)
    │    Encrypts all credential data at rest
    │
    ├──→ .aioss Chain Key (SHA3-256)
    │    Integrity verification of chain
    │
    ├──→ Identity Key (Ed25519)
    │    Device identity and E2E encryption
    │
    └──→ Recovery Key (Ed25519)
         Account recovery authorization
```

## 2. BIP39 Seed Phrase

### 2.1 BIP39 Standard

| Parameter | Specification |
|-----------|--------------|
| Standard | BIP39 (Bitcoin Improvement Proposal 39) |
| Word list | 2048 words, multiple languages |
| Entropy | 128 bits (12 words) or 256 bits (24 words) |
| Checksum | 4 bits (12 words) or 8 bits (24 words) |
| Passphrase | Optional (BIP39 passphrase) |

### 2.2 Seed Generation

```
1. Generate 128/256 bits of cryptographically random entropy
2. Compute SHA-256 checksum
3. Append checksum bits to entropy
4. Split into 11-bit segments
5. Map each segment to BIP39 word list
6. Display as mnemonic phrase
```

### 2.3 Seed Storage

| Storage Method | Security | Convenience |
|---------------|----------|-------------|
| Written on paper | High | Low |
| Stamped on metal | Very high | Low |
| Password manager | Medium | High |
| Memorized | Variable | Variable |

## 3. Ed25519 Keys

### 3.1 Ed25519 Properties

| Property | Value |
|----------|-------|
| Algorithm | Ed25519 (EdDSA on Curve25519) |
| Key size | 32 bytes private, 32 bytes public |
| Signature size | 64 bytes |
| Security level | 128-bit |
| Performance | Very fast (sign, verify, generate) |

### 3.2 Identity Key

| Use | Key Type | Storage |
|-----|----------|---------|
| Device identity | Ed25519 | Platform authenticator |
| E2E encryption (ECDH) | X25519 (converted) | Platform authenticator |
| Authentication | Ed25519 | Platform authenticator |

### 3.3 Key Derivation (Ed25519)

```
Master Seed (512 bits)
    │
    ▼
HMAC-SHA512("Ed25519 identity", master seed)
    │
    ├──→ Private Key (32 bytes)
    └──→ Public Key (32 bytes)
```

## 4. Vault Key

### 4.1 Vault Key Purpose

The vault key is used for AES-256-GCM encryption of all locally stored credential data.

| Property | Value |
|----------|-------|
| Algorithm | AES-256-GCM |
| Key size | 256 bits |
| Usage | Encrypt/decrypt credentials |
| Lifetime | Session (derived on unlock) |

### 4.2 Vault Key Derivation

```
Master Seed (512 bits)
    │
    ▼
HMAC-SHA512("vault key derivation", master seed)
    │
    ▼
Vault Key (32 bytes)
Combined with 64MB Argon2id for unlock speed security
```

## 5. Session Keys

### 5.1 Session Key Purpose

Session keys are ephemeral keys used for:

- Temporary decryption of vault data
- WebRTC peer connections
- Secure channel establishment

### 5.2 Session Key Generation

```
On vault unlock:
  1. User provides seed phrase or biometric
  2. Vault key derived (KDF)
  3. Session key = HKDF-Expand(vault key, "session")
  4. Session stored in memory (not IndexedDB)
  5. Session expires after inactivity timeout
```

## 6. Key Rotation

### 6.1 Rotation Schedule

| Key | Rotation Frequency | Reason |
|-----|-------------------|--------|
| Vault Key | Per unlock (re-derived) | Automatic |
| Session Key | Per session | Automatic |
| Identity Key | User-initiated | Compromise suspicion |
| .aioss Chain Key | Never (deterministic) | Chain integrity |

### 6.2 Rotation Process

When rotating identity keys:

1. New key pair generated
2. Public key shared with paired devices
3. Old key retained temporarily for pending operations
4. .aioss chain updated with rotation entry
5. Old key deprecated and eventually removed

## 7. Key Compromise Scenarios

### 7.1 Seed Phrase Compromise

| Impact | Action |
|--------|--------|
| All keys derivable | Immediately stop using compromised seed |
| Credentials exposed | Rotate all stored credentials |
| Identity compromised | Re-pair all devices |

### 7.2 Device Compromise

| Impact | Action |
|--------|--------|
| Session keys exposed | Lock vault, end all sessions |
| Identity key exposed | Rotate identity key |
| Encrypted data exposed | Data is AES-256-GCM protected |

## 8. Recovery

### 8.1 Seed Phrase Recovery

```
Lost Device
    │
    ├── 1. Obtain backup seed phrase
    │
    ├── 2. Install MF+SO on new device
    │
    ├── 3. Enter seed phrase
    │
    ├── 4. Keys derived from seed
    │
    └── 5. Vault restored (credentials need sync)
```

### 8.2 Social Recovery (Future)

Optional social recovery mechanism:
- Split seed phrase into shares (Shamir's Secret Sharing)
- Distribute shares to trusted contacts
- Recover with threshold of shares

---

*MF+SO — Multi Factor+ Sign On*
*by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner*
*The Sovereign Identity & Authentication Vault*
