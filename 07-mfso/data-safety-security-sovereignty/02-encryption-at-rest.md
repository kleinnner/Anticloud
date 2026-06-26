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

# Encryption at Rest — AES-256-GCM, Key Derivation & Storage Architecture

## 1. Executive Summary

Data at rest encryption protects stored data from unauthorized access in case of device theft, loss, or compromise. MF+SO encrypts all locally stored data using AES-256-GCM (Galois/Counter Mode), which provides both confidentiality and authenticity. The encryption keys are derived from the user's BIP39 seed phrase using a key derivation function and never leave the device.

This document describes the encryption-at-rest architecture of MF+SO, including the AES-256-GCM algorithm, key derivation process, storage architecture, and security properties.

### 1.1 Encryption Properties

| Property | Specification |
|----------|--------------|
| Algorithm | AES-256-GCM |
| Key size | 256 bits |
| IV/Nonce size | 96 bits (12 bytes) |
| Tag size | 128 bits (16 bytes) |
| Key derivation | PBKDF2-SHA256 / Argon2id |
| Authentication | GCM provides authenticated encryption |

## 2. AES-256-GCM

### 2.1 Algorithm Overview

AES-256-GCM is an authenticated encryption algorithm that provides:

- **Confidentiality**: Data cannot be read without the key
- **Integrity**: Data cannot be modified without detection
- **Authenticity**: Data comes from a legitimate source

### 2.2 GCM Mode

```
┌─────────────────┐
│    Plaintext     │
└────────┬────────┘
         │
    ┌────▼────┐
    │   AES   │ ← 256-bit key
    │   GCM   │ ← 96-bit nonce
    └────┬────┘
         │
┌────────▼────────┐
│ Ciphertext │ Tag│
└─────────────────┘
```

## 3. Key Derivation

### 3.1 Key Hierarchy

```
BIP39 Seed Phrase (12/24 words)
    │
    ▼
PBKDF2 / Argon2id
    │
    ▼
Master Seed (512 bits)
    │
    ├──→ Vault Key (AES-256) — Encrypts credentials
    ├──→ Chain Key (SHA3-256) — .aioss chain integrity
    └──→ Identity Key (Ed25519) — Device identity
```

### 3.2 Key Derivation Function

| Parameter | PBKDF2 | Argon2id |
|-----------|--------|----------|
| Iterations | 600,000 | 3 (cost) |
| Memory | N/A | 64 MB |
| Parallelism | N/A | 4 |
| Salt | Random 16 bytes | Random 16 bytes |
| Output | 512 bits | 512 bits |

### 3.3 Key Storage

| Key | Storage | Exportable |
|-----|---------|------------|
| Vault Key | Derived, not stored | No |
| Chain Key | Derived, not stored | No |
| Identity Key | Platform authenticator | No |
| Session Key | Memory only | No |

## 4. Storage Architecture

### 4.1 Storage Layers

```
┌─────────────────────────────────┐
│         Application Layer        │
│  ┌───────────────────────────┐  │
│  │ Credential Manager         │  │
│  │ - Read/write credentials   │  │
│  │ - Enumerate credentials    │  │
│  └───────────────────────────┘  │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│      Encryption Layer            │
│  ┌───────────────────────────┐  │
│  │ AES-256-GCM Encrypt/Decrypt│  │
│  │ Key Derivation              │  │
│  │ Nonce Generation           │  │
│  └───────────────────────────┘  │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│        Storage Layer             │
│  ┌───────────────────────────┐  │
│  │ IndexedDB                  │  │
│  │ - Encrypted credentials    │  │
│  │ - .aioss chain metadata    │  │
│  │ - Configuration             │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### 4.2 Database Schema

```typescript
interface EncryptedVault {
  version: number;
  salt: Uint8Array;       // For key derivation
  iterations: number;     // PBKDF2 iterations
  credentials: EncryptedCredential[];
}

interface EncryptedCredential {
  id: string;
  nonce: Uint8Array;      // 96-bit IV
  ciphertext: Uint8Array; // Encrypted credential data
  tag: Uint8Array;        // 128-bit GCM auth tag
  createdAt: number;
  updatedAt: number;
}
```

## 5. Encryption Process

### 5.1 Encryption Flow

```
1. User provides vault password/seed phrase
2. Derive vault key using KDF (100ms+)
3. Generate random 96-bit nonce
4. Encrypt credential data:
   ciphertext = AES-256-GCM(data, key, nonce)
5. Store: { nonce, ciphertext, tag }
```

### 5.2 Decryption Flow

```
1. User provides vault password/seed phrase
2. Derive vault key (same parameters)
3. Retrieve: { nonce, ciphertext, tag }
4. Decrypt (authentication fails if tampered):
   data = AES-256-GCM-decrypt(ciphertext, key, nonce)
```

## 6. Security Properties

### 6.1 Encryption Strength

| Attack | Resistance |
|--------|------------|
| Brute force key | 2^256 (infeasible) |
| Nonce reuse | Negligible (random 96-bit) |
| Ciphertext manipulation | GCM authentication fails |
| Key extraction | Never stored, derived per session |
| Side channel | Constant-time implementation |

### 6.2 Forward Secrecy

- WebAuthn keys provide forward secrecy
- Compromise of current key does not expose past

## 7. Performance

| Operation | Time (modern device) |
|-----------|---------------------|
| Key derivation | 100-500ms |
| Credential encryption | < 1ms |
| Credential decryption | < 1ms |
| Chain encryption | < 5ms |

---

*MF+SO — Multi Factor+ Sign On*
*by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner*
*The Sovereign Identity & Authentication Vault*

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

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
