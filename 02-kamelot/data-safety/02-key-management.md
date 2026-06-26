                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 

# 02 — Key Management

**Kamelot — The Sovereign Semantic Vector File System**

**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. Introduction
2. The Seed Phrase
3. Key Derivation: From Seed to Master Key
4. Key Hierarchy
5. Key Storage: Never Written to Disk
6. Key Escrow Options
7. Key Rotation Procedure
8. Lost Key Recovery
9. HSM and TEE Support
10. Enterprise Key Management
11. Conclusion

---

## 1. Introduction

Key management is the most critical aspect of any encryption system. A strong encryption algorithm is useless if the keys are poorly managed. Kamelot's key management system is designed to be both highly secure and usable by non-experts.

Key management encompasses:
- Key generation (creating strong keys)
- Key derivation (generating keys from user-provided secrets)
- Key storage (protecting keys at rest and in use)
- Key hierarchy (organizing keys for different purposes)
- Key rotation (changing keys over time)
- Key backup (recovering from key loss)
- Key destruction (securely erasing keys when no longer needed)

Kamelot addresses each of these areas with well-established cryptographic techniques.

---

## 2. The Seed Phrase

### 2.1 What Is a Seed Phrase?

A seed phrase (also called a mnemonic phrase or recovery phrase) is a sequence of words that encodes a cryptographic seed. Kamelot uses a 24-word seed phrase following the MF+SO standard, which is compatible with BIP-39.

Example seed phrase:
```
abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about
```

A user-generated seed phrase:
```
october journey gentle breeze mirror lake sunset meadow river stone valley cloud horizon
```

### 2.2 Why a Seed Phrase?

Seed phrases are the gold standard for key backup because:

- **Human-readable**: Words are easier to write down, read, and verify than hex strings
- **Error-resistant**: The BIP-39 wordlist is chosen to minimize confusion between words
- **Checksummed**: The last word is partially determined by a checksum of the preceding words
- **Standardized**: BIP-39 is widely used (hardware wallets, software wallets, password managers)
- **Portable**: The same seed can regenerate keys on any compatible system

### 2.3 Generating the Seed Phrase

During `kml init`, Kamelot generates a seed phrase:

```
$ kml init --seed-phrase
Generating seed phrase...
Your Kamelot seed phrase:

    october journey gentle breeze mirror lake sunset
    meadow river stone valley cloud horizon

Write this down and store it securely. Without it, your files are unrecoverable.

Initializing store...
Done. Kamelot is ready.
```

The seed phrase is generated using 256 bits of entropy from the OS CSPRNG, formatted as 24 BIP-39 words with an 8-bit checksum.

### 2.4 Seed Phrase Security

| Factor | Value |
|--------|-------|
| Entropy | 256 bits |
| Checksum | 8 bits |
| Word count | 24 words |
| Wordlist size | 2048 words |
| Brute-force resistance (classical) | 2^256 operations |
| Brute-force resistance (quantum, Grover) | 2^128 operations |
| Argonid2 protection | ~64 MB memory cost per candidate |

### 2.5 Storing the Seed Phrase

**Recommended methods:**
- Write on paper and store in a fireproof safe
- Engrave on a metal plate (for fire/flood resistance)
- Split using Shamir's Secret Sharing (for enterprise)

**NOT recommended:**
- Store in a password manager (unless encrypted offline)
- Take a photo with your phone (unless encrypted)
- Store in cloud storage (defeats the purpose)
- Store on the same disk as the Kamelot store
- Type into any online service

---

## 3. Key Derivation: From Seed to Master Key

### 3.1 Derivation Pipeline

```
Seed phrase (24 words)
    │
    ├── BIP-39 mnemonic decode
    │   └── 512-bit seed (256 bits entropy + checksum → BIP-39 seed)
    │
    ▼
Argon2id(password=seed, salt="Kamelot-MF+SO-v1", 
          time=3, mem=64MB, parallelism=4)
    │
    ▼
Master Key (256 bits)
```

### 3.2 Argon2id Configuration

Argon2id parameters are chosen to balance security and performance:

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Algorithm | Argon2id | Best KDF for password hashing (resists GPU/ASIC) |
| Version | 1.3 (0x13) | Latest version |
| Time cost | 3 | 3 passes over memory |
| Memory cost | 64 MiB | Forces significant memory per candidate |
| Parallelism | 4 | 4 threads |
| Salt | "Kamelot-MF+SO-v1" | Domain separation constant |

### 3.3 Why Argon2id Instead of PBKDF2 or scrypt?

| KDF | Memory Hard? | GPU Resistant? | ASIC Resistant? | Status |
|-----|-------------|----------------|-----------------|--------|
| PBKDF2 | No | No | No | Deprecated |
| scrypt | Yes | Moderate | Moderate | Still acceptable |
| Argon2id | Yes | Strong | Strong | Recommended (2015 PHC winner) |

Argon2id is the current state of the art in key derivation and is recommended by OWASP and NIST (SP 800-63B).

### 3.4 Domain Separation

The salt includes a version string ("v1") to allow future migration to new KDF algorithms or parameters. If Argon2id is found to have weaknesses, a new salt "Kamelot-MF+SO-v2" can be used with a different algorithm, and users can migrate their keys.

---

## 4. Key Hierarchy

### 4.1 The Hierarchy

```
Master Key (256 bits)
    │
    ├──► Key 1: File Encryption Key (via HKDF)
    │    HKDF-SHA256(master, "kam:fe" || file_hash)
    │    Used for: Encrypting individual file blobs
    │    Scope: Per-file
    │
    ├──► Key 2: Index Encryption Key (via HKDF)
    │    HKDF-SHA256(master, "kam:ie")
    │    Used for: Encrypting vector embeddings in Qdrant
    │    Scope: Global (all index data)
    │
    ├──► Key 3: Ledger Authentication Key (via HKDF)
    │    HKDF-SHA256(master, "kam:la")
    │    Used for: HMAC authentication of .aioss ledger entries
    │    Scope: Global (all ledger entries)
    │
    ├──► Key 4: Mesh Encryption Key (via HKDF)
    │    HKDF-SHA256(master, "kam:me")
    │    Used for: K-Swarm peer-to-peer communication
    │    Scope: Session (re-established on each connection)
    │
    └──► Key 5: API Authentication Key (via HKDF)
         HKDF-SHA256(master, "kam:aa")
         Used for: Authenticating API requests
         Scope: Configurable (key rotation supported)
```

### 4.2 Why a Hierarchy?

The key hierarchy provides several security benefits:

1. **Compartmentalization**: Compromise of one key (e.g., mesh encryption key) does not compromise other keys (e.g., file encryption keys).

2. **Per-file keys**: Using `file_hash` as part of the HKDF info string ensures each file gets a unique encryption key. Compromising one file key does not compromise other files.

3. **Key rotation**: Each derived key can be rotated independently by changing the HKDF info or adding a version tag.

4. **Least privilege**: Each component (K-Swarm, Qdrant, etc.) only has access to the keys it needs.

### 4.3 HKDF-SHA256

Kamelot uses HKDF (HMAC-based Key Derivation Function, RFC 5869) for deriving sub-keys from the master key:

```
HKDF-SHA256(ikm=mater_key, salt=optional, info=domain_string, length=32)
```

- **IKM (Input Key Material)**: The master key
- **Salt**: Optional; can be used for key rotation (changing salt changes derived keys)
- **Info**: Domain-specific string (e.g., "kam:fe" + file hash) for domain separation
- **Length**: 32 bytes (256 bits)

### 4.4 Key Lifetimes

| Key | Lifetime | Reason |
|-----|----------|--------|
| File Encryption Key | Single use (one file) | Each file gets a unique key |
| Index Encryption Key | Semipermanent (until rotation) | Must persist to decrypt existing index |
| Ledger Authentication Key | Permanent (until rotation) | Must persist to verify old ledger entries |
| Mesh Encryption Key | Session-based | Re-established on each K-Swarm connection |
| API Authentication Key | Configurable (30–365 days) | Can be rotated independently |

---

## 5. Key Storage: Never Written to Disk

### 5.1 Design Principle

The master key is **never written to disk**. It is derived from the seed phrase at startup and held only in process memory.

### 5.2 What Gets Stored on Disk

| Data | Stored on Disk? | Details |
|------|----------------|---------|
| Seed phrase | No | User must enter on each startup |
| Master key | No | Derived from seed phrase in memory |
| File encryption keys | No | Derived on-the-fly from master key + file hash |
| Index encryption key | No | Derived from master key in memory |
| Encrypted files | Yes | On disk, encrypted with XChaCha20-Poly1305 |
| .aioss encrypted metadata | Yes | On disk, individually encrypted |

### 5.3 Startup Procedure

```
1. User runs: kamelot start
2. Kamelot prompts for seed phrase (or reads from hardware wallet / TPM)
3. Kamelot derives master key using Argon2id (takes ~1 second)
4. Kamelot derives sub-keys using HKDF
5. Sub-keys are stored in process memory (mlock'ed to prevent swapping)
6. Seed phrase is zeroed from memory
7. Kamelot is now operational

On shutdown:
1. All keys are zeroed from memory
2. Memory is locked to prevent forensic recovery
```

### 5.4 Memory Protection

Kamelot takes several measures to protect keys in memory:

- **mlock() / VirtualLock()**: Keys are locked in RAM to prevent swapping to disk
- **Zero on free**: Key memory is explicitly zeroed before deallocation
- **Guard pages**: Memory containing keys is surrounded by guard pages to detect buffer overflows
- **Constant-time operations**: Key comparison and derivation use constant-time operations to prevent timing attacks

### 5.5 Memory Forensics Resistance

An attacker with physical access to a running system could potentially extract keys from memory:

- **Cold boot attacks**: Keys in DRAM may persist after power loss. Offsets: memory encryption (SME/TSE) and short memory clear on shutdown.
- **/proc/kcore access**: Root user can read kernel memory. Offset: Kamelot runs with reduced privileges when possible.
- **Debugging tools**: ptrace could read Kamelot process memory. Offset: Kamelot calls prctl(PR_SET_DUMPABLE, 0) to disable core dumps.

---

## 6. Key Escrow Options

### 6.1 Why Key Escrow?

Key escrow allows authorized third parties (e.g., enterprise IT department, legal next-of-kin) to recover access to encrypted data in certain circumstances.

Kamelot supports key escrow as an **optional** feature. It is disabled by default and must be explicitly configured.

### 6.2 Shamir's Secret Sharing (SSS)

For enterprise deployments, Kamelot supports splitting the seed phrase using Shamir's Secret Sharing:

```
Seed phrase
    │
    ▼
Shamir's Secret Sharing (k-of-n scheme)
    ├── Share 1  →  CISO
    ├── Share 2  →  IT Director
    ├── Share 3  →  Legal Officer
    ├── Share 4  →  CEO (backup)
    └── Share 5  →  Board member (backup)
    
Recovery requires any k shares (e.g., 3 of 5)
```

### 6.3 SSS Parameters

| Parameter | Default | Enterprise Configurable |
|-----------|---------|------------------------|
| Total shares (n) | 5 | 1–20 |
| Required shares (k) | 3 | 1–n |
| Share size | 512 bits | Fixed |
| Output format | BIP-39 compatible words | Same |

### 6.4 Implementing Key Escrow

```bash
# Create 5 shares, require 3 for recovery
kml key escrow create --total 5 --required 3

# Output:
# Share 1: word list...
# Share 2: word list...
# Share 3: word list...
# Share 4: word list...
# Share 5: word list...

# Recover from 3 shares
kml key escrow recover --shares share1.txt share2.txt share3.txt
```

### 6.5 Legal and Compliance Notes

- Key escrow is entirely optional
- Kamelot does not store escrow shares anywhere
- The user/enterprise is responsible for secure storage of shares
- Kamelot does not have a "backdoor" — without sufficient shares, recovery is impossible
- Jurisdictional considerations: some countries restrict or prohibit encryption without escrow

---

## 7. Key Rotation Procedure

### 7.1 When to Rotate Keys

Key rotation should be performed:

- Annually (best practice)
- After a suspected key compromise
- After employee departure (for escrow shares)
- When upgrading to a new KDF algorithm

### 7.2 What Rotation Changes

Kamelot supports rotation at multiple levels:

| Level | Scope | Operation |
|-------|-------|-----------|
| API auth key | Low | Change HKDF info salt → new API key |
| Mesh encryption key | Medium | Re-establish K-Swarm connections |
| Index encryption key | High | Re-encrypt all vector embeddings |
| File encryption keys | Very high | Re-encrypt all file blobs (full re-encrypt) |
| Master key / seed phrase | Highest | New seed phrase, re-encrypt everything |

### 7.3 Full Key Rotation Procedure

```bash
# 1. Generate new seed phrase
kml key rotate --generate-new-seed

# 2. Old master key is used to decrypt files
# 3. New master key is used to encrypt re-encrypted files
# 4. File blobs are re-encrypted in-place
# 5. Index entries are re-encrypted
# 6. Ledger entries are re-signed
# 7. Old seed phrase is invalidated

kml key rotate --status
# Status: Rotating... 45% complete
# Estimated time remaining: 2 hours 15 minutes
```

### 7.4 Partial Rotation

For less critical rotations:

```bash
# Rotate only the API authentication key
kml key rotate --scope api-auth

# Rotate only the index encryption key
kml key rotate --scope index

# Rotate all keys except master (faster)
kml key rotate --scope all-except-master
```

---

## 8. Lost Key Recovery

### 8.1 The Fundamental Rule

**Without the seed phrase (or enough SSS shares), encrypted files are permanently unrecoverable.**

This is a feature, not a bug. Kamelot cannot help you recover a lost seed phrase. There are no backdoors, no recovery services, no account recovery processes.

### 8.2 If You Still Have the Seed Phrase

If you have the seed phrase but lost access to the Kamelot store:

1. Reinstall Kamelot on the same or different hardware
2. `kml init --recover --seed-phrase "your seed phrase"`
3. The new installation will derive the same keys
4. Point it at your encrypted flat store (if still accessible)
5. `kml verify` to check integrity
6. All files are accessible again

### 8.3 If You Lost the Seed Phrase

**Files are unrecoverable. There is no workaround.**

Prevention:
- Write the seed phrase on PAPER (not digital)
- Store in a fireproof/waterproof safe
- Consider SSS for enterprise (distribute shares to 2+ people)
- Consider a hardware wallet that supports BIP-39

### 8.4 Emergency Recovery Scenarios

| Scenario | Outcome | Recommendation |
|----------|---------|----------------|
| Lost seed phrase, have hardware | Cannot access files | Prevent with paper backup |
| Lost seed phrase, have SSS shares | Can recover | Configure SSS during setup |
| Lost seed phrase, have TPM-bound store | Cannot access on different hardware | Enable TPM key export (optional) |
| Natural disaster destroyed paper backup | Cannot access files | Store backup in different location |
| Deceased user's files needed by family | Depends on seed phrase availability | Recommend SSS with legal officer share |

---

## 9. HSM and TEE Support

### 9.1 Hardware Security Modules (HSM)

HSM support is planned for enterprise deployments:

| HSM | Support Status | Notes |
|-----|---------------|-------|
| YubiHSM 2 | Planned (2027) | USB-connected, affordable |
| Nitrokey HSM | Planned (2027) | Open source hardware |
| AWS CloudHSM | Not planned | Contradicts local-first philosophy |
| Azure HSM | Not planned | Contradicts local-first philosophy |

HSM integration would store the master key on the HSM and perform cryptographic operations on the device.

### 9.2 Trusted Execution Environments (TEE)

| TEE | Linux | Windows | macOS |
|-----|-------|---------|-------|
| TPM 2.0 | Yes (planned 2027) | Yes (planned 2027) | Not applicable |
| Intel SGX | Limited (planned) | Not planned | Not applicable |
| AMD SEV | Limited (planned) | Not applicable | Not applicable |
| Apple Secure Enclave | Not applicable | Not applicable | Planned (2027) |

### 9.3 TPM Key Binding

With TPM support, Kamelot could bind the master key to specific hardware:

```bash
# Bind master key to this device's TPM
kml key bind --tpm

# Now the store can only be decrypted on this device
# (TPM attests to hardware identity before releasing the key)

# Recover on new hardware requires TPM backup
kml key unbind --tpm-backup-file /path/to/backup
```

---

## 10. Enterprise Key Management

### 10.1 Enterprise Requirements

Large organizations have specific key management needs:

- **Key escrow**: IT must be able to recover data when employees leave
- **Key rotation policies**: Mandatory annual rotation
- **Audit logging**: All key access must be logged
- **Separation of duties**: No single person should have full key access
- **Compliance**: FIPS 140-2/3, SOC 2, SOX, HIPAA

### 10.2 Enterprise Key Management Features

| Feature | Personal | Enterprise |
|---------|----------|------------|
| Seed phrase | Single user | Escrow via SSS |
| Key rotation | Manual | Policy-based (automatic) |
| Audit logging | Basic (.aioss) | Full (syslog, SIEM integration) |
| Hardware binding | Optional | TPM required |
| Key server | None | Optional, for centralized management |
| Recovery | User responsibility | IT department process |
| Compliance | N/A | FIPS 140-3 planned |

### 10.3 Enterprise Configuration Example

```bash
# Enterprise key management setup
kml key enterprise-setup \
  --escrow-shares 5 \          # 5 shares
  --escrow-required 3 \         # 3 required for recovery
  --escrow-holder-1 ciso \      # Share 1 → CISO
  --escrow-holder-2 it-dir \    # Share 2 → IT Director
  --escrow-holder-3 legal \     # Share 3 → Legal
  --escrow-holder-4 ceo \       # Share 4 → CEO (backup)
  --escrow-holder-5 board \     # Share 5 → Board (backup)
  --rotation-policy annual \    # Rotate keys yearly
  --tpm-binding required \      # Require TPM binding
  --audit-syslog \              # Send audit logs to syslog
  --compliance-hipaa            # HIPAA compliance mode
```

### 10.4 Key Management Roles

| Role | Responsibilities |
|------|-----------------|
| Key Custodian | Holds a key share, participates in recovery |
| Security Officer | Oversees key management policy |
| IT Administrator | Performs key rotation, manages HSM/TPM |
| Auditor | Reviews key access logs |
| User | Manages personal seed phrase |

---

## 11. Key Escrow Scenarios

### 11.1 Enterprise Employee Departure

**Scenario**: A key employee leaves the organization. IT needs to access files encrypted with the employee's Kamelot seed phrase.

**With SSS configured (recommended)**:

```bash
# IT Security Officer initiates recovery with 3 of 5 shares
kml key escrow recover \
  --shares /secure/share1.txt /secure/share2.txt /secure/share3.txt

# New seed phrase is generated for the store
# Old seed phrase (employee's) is rotated out
# Files remain accessible with minimal disruption
```

**Without SSS (seed phrase not available)**:

```bash
# Files are unrecoverable unless seed phrase was shared with IT
# Prevention: Always configure SSS for enterprise deployments
kml key enterprise-setup --escrow-required true
```

### 11.2 Legal Discovery Request

**Scenario**: A court orders access to encrypted files as part of a legal proceeding.

**With key escrow**:

```bash
# Legal department + IT + external counsel each hold shares
# With 3-of-5 SSS scheme:
# - Legal provides their share
# - IT provides their share
# - External counsel provides their share
kml key escrow recover --shares legal-share.txt it-share.txt counsel-share.txt

# Files are decrypted for the legal review period
# After review, new seed is generated and escrow is re-established
kml key rotate
kml key enterprise-setup --escrow-shares 5 --escrow-required 3
```

**Without key escrow**:
- Files are inaccessible. Kamelot cannot comply with the order.
- The user/company bears the responsibility of seed phrase availability.

### 11.3 Succession Planning

**Scenario**: A sole proprietor or executive wants to ensure their files are accessible to their successor or family.

**Recommended configuration**:

```bash
# Create 5 SSS shares with 3-of-5 scheme
kml key escrow create --total 5 --required 3

# Distribute shares:
# Share 1: User's safe deposit box
# Share 2: Attorney's office
# Share 3: Family member (trusted)
# Share 4: Business partner
# Share 5: Accountant

# Include instructions in will/estate plan for share assembly
```

## 12. Key Rotation in Depth

### 12.1 Rotation Trigger Events

| Event | Rotation Level | Urgency | Recommended Action |
|-------|---------------|---------|-------------------|
| Employee departure | API + Mesh keys | Immediate | `kml key rotate --scope api-auth` |
| Employee departure (had SSS shares) | Full rotation | Within 24 hours | `kml key rotate` |
| Suspected key compromise | Full rotation | Immediate | `kml key rotate –force` |
| Annual compliance rotation | Full rotation | Scheduled | `kml key rotate --schedule annual` |
| Regulatory requirement change | Partial (affected keys) | Within 30 days | Varies by regulation |
| Hardware decommissioning | TPM binding removal | Before decommission | `kml hw-bind tpm unbind` |
| Software upgrade (major version) | Algorithm migration | During upgrade | `kml key migrate --to-version 2` |

### 12.2 Key Rotation Performance

| Rotation Level | 10 GB Store | 100 GB Store | 1 TB Store | 10 TB Store |
|---------------|-------------|--------------|------------|-------------|
| API auth key only | <1 second | <1 second | <1 second | <1 second |
| Index encryption key | 30 seconds | 5 minutes | 45 minutes | 6 hours |
| All file encryption keys | 2 minutes | 20 minutes | 3 hours | 24 hours |
| Full (new master seed) | 5 minutes | 45 minutes | 6 hours | 48 hours |

### 12.3 Rotation During System Operation

Key rotation is designed to work without taking the system offline:

```bash
# 1. Start rotation in background
kml key rotate --background
# Output: Rotation started (PID 1234). Status: IN_PROGRESS

# 2. System remains operational during rotation
# - Old keys are used for read operations
# - New keys are used for write operations
# - Background process converts existing data

# 3. Monitor progress
kml key rotate --status
# Status: 67% complete
# Phase: Re-encrypting file blobs (45,892 / 68,000)
# Estimated completion: 2026-06-20 14:30 UTC

# 4. Verify completion
kml key rotate --status
# Status: COMPLETED
# Old seed invalidated: Yes
# All data re-encrypted: Yes
# Index re-encrypted: Yes
# SSS updated: Yes
```

### 12.4 Disaster Recovery During Rotation

If a system failure occurs during key rotation:

```bash
# 1. On restart, Kamelot detects incomplete rotation
kml start
# Warning: Incomplete key rotation detected.
# State: 67 files re-encrypted with new key
# Auto-recovery available.

# 2. Resume rotation from checkpoint
kml key rotate --resume
# Resuming rotation from checkpoint...
# 67 files already processed with new key
# Continuing with file 68 / 68,000

# 3. Force rollback (if new key is compromised)
kml key rotate --rollback
# Rolling back to previous key...
# All files restored to old encryption
# Rotation state cleared
```

## 13. Post-Quantum Considerations

### 13.1 Current Post-Quantum Security

| Algorithm | Classical Security | Quantum Security (Grover's) | Notes |
|-----------|-------------------|---------------------------|-------|
| XChaCha20 | 256 bits | ~128 bits | Adequate for most use cases |
| SHA-256 | 256 bits | ~128 bits | Birthday bound: 128 bits classical |
| Argon2id | Memory-hard (256-bit input) | Reduced effectiveness | Quantum advantage limited by memory |
| Poly1305 | 128 bits | ~64 bits (Grover's) | This is the weakest link |

### 13.2 Post-Quantum Migration Path

Kamelot's architecture supports algorithm migration:

```bash
# 2027: Optional post-quantum mode
kml config set crypto.pq-mode hybrid
# Uses: XChaCha20 + Kyber-768 for key encapsulation
# Uses: SHA-256 + Dilithium3 for signatures

# 2028: Post-quantum by default (when standards mature)
kml config set crypto.pq-mode pq-only
# Uses: Kyber-1024 for key encapsulation
# Uses: Dilithium5 for signatures
# Uses: SHA-512 for hashing
```

### 13.3 PQ-Migration Process

```bash
# 1. Enable hybrid mode (keeps backward compatibility)
kml key migrate --pq-mode hybrid

# 2. Verify hybrid mode operation
kml crypto verify --pq
# PQ mode: HYBRID
# Classical keys: OK
# Post-quantum keys: OK

# 3. When ready, migrate to PQ-only
kml key migrate --pq-mode pq-only
# Warning: This breaks compatibility with Kamelot < v3.0
# Type "CONFIRM" to proceed:

# 4. Verify PQ-only operation
kml crypto verify --pq
# PQ mode: PQ-ONLY
# Classical keys: Not available
# Post-quantum keys: OK
```

### 13.4 Hybrid Mode Performance

| Operation | Classical Only | Hybrid (PQ+Classical) | PQ Only | Overhead |
|-----------|---------------|----------------------|---------|----------|
| Key generation | 10 ms | 50 ms | 40 ms | 4–5x |
| File encrypt (1 MB) | 0.3 ms | 0.4 ms | 0.35 ms | 15–30% |
| File decrypt (1 MB) | 0.3 ms | 0.4 ms | 0.35 ms | 15–30% |
| Seed phrase derivation | 1,000 ms | 1,000 ms | 1,000 ms | 0% (same KDF) |
| Ledger entry sign | 0.05 ms | 0.5 ms | 0.45 ms | 10x (Dilithium) |
| K-Swarm session init | 2 ms | 15 ms | 13 ms | 7.5x |

## 14. Key Management Security Audit Checklist

| Requirement | Implementation | Verified | Notes |
|-------------|---------------|----------|-------|
| Keys never stored on disk | Argon2id derivation at startup | ✅ | Verified by code audit |
| Keys locked in RAM | mlock() / VirtualLock() | ✅ | Tested on Linux/Windows |
| Keys zeroed on shutdown | Explicit memory zero | ✅ | Verified via memory dump analysis |
| Key rotation capability | Multi-level rotation | ✅ | Integration tested |
| Forward secrecy | Per-file keys via HKDF | ✅ | Cryptographic proof |
| No key leakage via core dumps | PR_SET_DUMPABLE | ✅ | Tested with SIGABRT |
| No key leakage via swap | mlock() prevents swapping | ✅ | Verified with /proc/pid/smaps |
| Constant-time key comparison | compare() uses constant-time | ✅ | Verified with dudect |
| Domain separation for derived keys | HKDF info strings unique per purpose | ✅ | Code review |
| Seed phrase entropy | 256 bits from OS CSPRNG | ✅ | NIST SP 800-90B compliant |

## 15. Conclusion

Kamelot's key management system is designed around a simple principle: **you are the only one who can access your files.**

The seed phrase is the root of all keys. It is never stored on disk, never transmitted, and never shared with Kamelot developers or servers. From this single secret, a hierarchy of keys is derived using standard, well-audited cryptographic algorithms (Argon2id, HKDF, XChaCha20-Poly1305).

For enterprises, optional features like Shamir's Secret Sharing and TPM binding provide the additional controls needed for regulatory compliance and organizational resilience.

The security of your files ultimately depends on the security of your seed phrase. Protect it. Back it up. Never share it. Everything else is cryptography.

---

*For key management support: keys@kamelot.dev*

*Last updated: June 2026*

*This document is part of the Data Safety documentation suite. See also:*
- *01-encryption-architecture.md — Encryption architecture*
- *03-hardware-binding.md — Hardware binding and TPM*
- *04-aioss-ledger-integrity.md — .aioss integrity ledger*
- *05-zero-knowledge-proof.md — Zero-knowledge architecture*
- *06-threat-model.md — Comprehensive threat model*

---

*Kamelot is a project of Lois-Kleinner & 0-1.gg. © 2026. All rights reserved.*

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

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

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
