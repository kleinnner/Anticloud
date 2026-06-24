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

# Backup Integrity — Hash-Verified Backups, Seed Verification & Export Validation

## 1. Executive Summary

Backup integrity ensures that backup data has not been corrupted, tampered with, or otherwise compromised. MF+SO implements multiple layers of backup integrity verification: cryptographic hash verification, seed phrase validation, and export format validation.

This document describes the backup integrity mechanisms of MF+SO, including how users can verify their backups, how seed phrases are validated, and how exports are cryptographically verified.

### 1.1 Integrity Layers

| Layer | Mechanism | Purpose |
|-------|-----------|---------|
| Hash verification | SHA3-256 of backup | Detect corruption |
| Chain integrity | .aioss hash linkage | Detect tampering |
| Seed validation | BIP39 checksum | Detect transcription errors |
| Export validation | Structure + schema | Detect format issues |

## 2. Hash-Verified Backups

### 2.1 Backup Hashing

Each backup includes:

- SHA3-256 hash of backup contents
- Hash of individual .aioss chain
- Hash chain of backup versions

### 2.2 Verification Process

```
Backup File
    │
    ├── 1. Verify file hash
    │    computed_hash = SHA3-256(file_data)
    │    assert computed_hash == backup.hash
    │
    ├── 2. Verify chain entries
    │    for each entry: verify hash chain
    │
    ├── 3. Verify structure
    │    schema validation, data types
    │
    └── 4. Display results
         "Backup INTACT" or errors detected
```

## 3. Seed Phrase Verification

### 3.1 BIP39 Checksum

BIP39 includes a built-in checksum:

| Word Count | Entropy Bits | Checksum Bits | Total |
|-----------|-------------|---------------|-------|
| 12 | 128 | 4 | 132 |
| 15 | 160 | 5 | 165 |
| 18 | 192 | 6 | 198 |
| 21 | 224 | 7 | 231 |
| 24 | 256 | 8 | 264 |

### 3.2 MF+SO Seed Verification

```
User enters seed phrase
    │
    ├── 1. Normalize input (lowercase, trim)
    │
    ├── 2. Lookup each word in BIP39 wordlist
    │    (fail on unknown word)
    │
    ├── 3. Reconstruct entropy from word indices
    │
    ├── 4. Compute checksum
    │    expected = SHA256(entropy)[:checksum_bits]
    │
    ├── 5. Verify checksum matches
    │    (fail on mismatch → transcription error)
    │
    └── 6. Display result
         "Seed phrase VALID" or "Error at word N"
```

## 4. Export Validation

### 4.1 Export Structure Validation

```
Export Schema v1.0:
├── version: string (required)
├── exportedAt: ISO8601 (required)
├── chain: object (required)
│   ├── entries: array (required)
│   └── integrity: object (required)
├── credentials: array (optional)
└── settings: object (optional)
```

### 4.2 Validation Process

1. JSON parsing (structure validity)
2. Schema validation (required fields)
3. Data type validation (types correct)
4. Range validation (values in bounds)
5. Chain hash verification
6. Timestamp ordering

## 5. Automated Verification

### 5.1 Periodic Verification

| Frequency | Verification Type | User Notification |
|-----------|-----------------|-------------------|
| Daily | Chain integrity | Silent (pass), alert (fail) |
| Weekly | Backup hash check | Silent (pass), alert (fail) |
| Monthly | Full backup verification | Summary report |

### 5.2 On-Demand Verification

Users can verify at any time:

```bash
# CLI verification tool (future)
mfso-cli verify-backup backup.json

# In-app verification
Settings → Security → Verify Backup
```

## 6. Recovery Verification

### 6.1 Recovery Process

```
1. User provides seed phrase
2. Seed phrase validated (BIP39 checksum)
3. Keys derived from seed
4. .aioss chain imported
5. Chain hash verified
6. Credentials decrypted
7. Backup integrity confirmed
8. Recovery complete
```

### 6.2 Failure Handling

| Failure | Action |
|---------|--------|
| Invalid seed checksum | Suggest transcription correction |
| Chain hash mismatch | Attempt partial recovery |
| Corrupted entry | Isolate and skip |
| Decryption failure | Indicate data corruption |

## 7. Security Properties

| Property | Implementation |
|----------|---------------|
| Tamper evidence | Any modification changes hash |
| Corruption detection | SHA3-256 hash mismatch |
| Error correction | BIP39 checksum catches ~99.6% of errors |
| Version tracking | Sequential backup versions |
| Cryptographic binding | Hash chain links entries |

---

*MF+SO — Multi Factor+ Sign On*
*by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner*
*The Sovereign Identity & Authentication Vault*
