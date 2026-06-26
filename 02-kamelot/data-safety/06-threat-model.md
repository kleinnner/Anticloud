                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 

# 06 — Threat Model

**Kamelot — The Sovereign Semantic Vector File System**

**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. Introduction
2. Adversary Profiles
3. Asset Classification
4. Attack Vectors and Defenses
5. Assumptions and Limitations
6. Responsible Disclosure Policy
7. Conclusion

---

## 1. Introduction

This document presents the comprehensive threat model for the Kamelot system. It identifies potential adversaries, classifies assets, enumerates attack vectors, and describes the defenses implemented for each.

The threat model is intended for:
- **Security researchers**: Understanding the system's security posture
- **Enterprise customers**: Evaluating Kamelot for deployment in sensitive environments
- **Developers**: Identifying areas for security improvement
- **Users**: Understanding what threats Kamelot protects against

---

## 2. Adversary Profiles

### 2.1 Casual Snooper

**Description**: An opportunistic attacker with minimal skills and resources. Examples:
- A family member curious about another user's files
- A thief who steals a laptop for resale value
- A curious system administrator

**Capabilities**:
- Can read unencrypted data on a running, unlocked system
- May attempt to boot a stolen system from USB
- May attempt to read disk contents when attached to another computer
- No cryptographic expertise

**Motivation**: Curiosity, quick financial gain

### 2.2 Targeted Attacker

**Description**: An attacker with moderate skills who specifically targets the Kamelot user. Examples:
- A competitor seeking corporate documents
- A journalist targeting a source
- A private investigator

**Capabilities**:
- Basic cryptographic knowledge
- Can run password cracking tools
- May use social engineering
- Can purchase off-the-shelf forensics tools
- Moderate budget ($1K–$50K)

**Motivation**: Financial gain, competitive advantage, specific information

### 2.3 Advanced Persistent Threat (APT) / Nation-State

**Description**: A sophisticated, well-funded adversary with advanced capabilities. Examples:
- State-sponsored intelligence agencies
- Organized cybercrime groups
- Law enforcement with legal authority

**Capabilities**:
- Zero-day exploits
- Hardware-level attacks (JTAG, cold boot, electron microscopy of chips)
- Access to massive compute resources for cryptanalysis
- Legal authority to compel key disclosure
- Supply chain attacks
- Physical access to facilities

**Motivation**: Intelligence gathering, law enforcement, national security

### 2.4 Ransomware / Malware

**Description**: Automated malware that infects the system to encrypt or exfiltrate data.

**Capabilities**:
- Can execute code with user or root privileges
- Can read process memory
- Can access filesystem
- Can communicate with command and control servers

**Motivation**: Financial ransom, data theft

### 2.5 Insider Threat

**Description**: A person with legitimate access to the system who abuses that access. Examples:
- Disgruntled employee
- Compromised administrator
- User who exceeds authorized access

**Capabilities**:
- Legitimate credentials
- Knowledge of internal systems
- Possibly authorized to access some data

**Motivation**: Revenge, financial gain, espionage

### 2.6 Kamelot Developers (Us)

**Description**: The developers of Kamelot are considered a potential adversary in the threat model.

**Capabilities**:
- Can modify the source code
- Can sign releases
- Can introduce vulnerabilities (accidentally or intentionally)

**Motivation**: N/A (trust-but-verify model)

---

## 3. Asset Classification

### 3.1 Assets by Criticality

| Asset | Classification | Description |
|-------|---------------|-------------|
| File contents | Critical | The actual data stored by the user (documents, photos, code, etc.) |
| Seed phrase | Critical | 24-word mnemonic that derives all encryption keys |
| Encryption keys | Critical | Derived from seed phrase, used to encrypt/decrypt files |
| File names/paths | High | Reveals project names, personal information, organizational structure |
| File metadata | High | File sizes, types, timestamps — can reveal usage patterns |
| Search queries | High | Reveals what the user is looking for |
| Embedding vectors | Medium | Reveals semantic relationships between files (not content) |
| Index structure | Medium | Number of files, distribution of types, relationships |
| Configuration | Low | Kamelot settings, enabled features |
| Version information | Low | Kamelot version, OS version (already transmitted in version ping) |

### 3.2 Asset Protection Goals

| Asset | Confidentiality | Integrity | Availability |
|-------|----------------|-----------|-------------|
| File contents | Required | Required | Required |
| Seed phrase | Required | Required | Required (backup) |
| Encryption keys | Required | Required | Required |
| File names | Required | Required | Desired |
| Metadata | Required | Desired | Desired |
| Search queries | Required | N/A | N/A |
| Embeddings | Desired | Desired | Desired |
| Index structure | Desired | Required | Desired |
| Configuration | Desired | Required | Required |
| Version info | Not needed | Not needed | Not needed |

---

## 4. Attack Vectors and Defenses

### 4.1 Physical Access Attack Vectors

#### AV-01: Drive Removal / Theft

**Description**: Attacker steals the physical drive (SSD, HDD) and attaches it to another computer.

**Assets threatened**: File contents, file names, metadata, index data

**Attack difficulty**: Low (trivial to remove a drive)

**Defenses**:
1. **Encryption at rest**: All files encrypted with XChaCha20-Poly1305 (D1)
2. **No plaintext headers**: No identifying information in the encrypted store (D2)
3. **Hardware binding (optional)**: TPM binding prevents access on unauthorized hardware (D3)
4. **MF+SO binding (optional)**: Without authorized phone, store is noise (D4)

**Residual risk**: Low. Without the seed phrase, files are unreadable.

#### AV-02: Cold Boot Attack

**Description**: Attacker cools DRAM modules and reads memory contents after power-off to extract encryption keys.

**Assets threatened**: Encryption keys (in memory when system was running)

**Attack difficulty**: High (requires physical access at power-off, specialized equipment)

**Defenses**:
1. **Memory zero on shutdown**: Keys are zeroed before deallocation (D1)
2. **mlock()**: Keys are locked in RAM to prevent swapping (D2)
3. **Memory encryption (optional)**: Intel TME / AMD SME encrypts DRAM (D3)
4. **Short memory clear**: On supported systems, memory is cleared in firmware (D4)

**Residual risk**: Low. Cold boot attacks on modern systems are difficult and require the attacker to know exactly when the system will shut down.

#### AV-03: Hardware Implant / Supply Chain

**Description**: Attacker modifies hardware during manufacturing or shipping to include monitoring implants.

**Assets threatened**: All assets

**Attack difficulty**: Very high (requires supply chain access)

**Defenses**:
1. **Open source hardware not required**: Kamelot runs on general-purpose hardware (D1)
2. **TPM measurement**: Trusted boot can verify firmware integrity (D2)
3. **Open source firmware**: Coreboot/Libreboot for verified boot chain (D3)

**Residual risk**: Medium. Hardware supply chain attacks are difficult to defend against at the software level.

### 4.2 Network Attack Vectors

#### AV-04: Network Eavesdropping

**Description**: Attacker monitors network traffic to intercept data.

**Assets threatened**: K-Swarm synced file data

**Attack difficulty**: Low (Wi-Fi eavesdropping is trivial)

**Defenses**:
1. **K-Swarm encryption**: All mesh traffic encrypted with XChaCha20-Poly1305 (D1)
2. **Perfect forward secrecy**: Session keys are ephemeral (D2)
3. **No plaintext metadata**: Encrypted packets reveal no file information (D3)

**Residual risk**: Very low. Encrypted traffic cannot be decrypted without session keys.

#### AV-05: Man-in-the-Middle (MITM)

**Description**: Attacker intercepts and potentially modifies network traffic between K-Swarm peers.

**Assets threatened**: K-Swarm synced file data

**Attack difficulty**: Medium (requires ARP spoofing or compromised network infrastructure)

**Defenses**:
1. **Authenticated encryption**: Poly1305 tag prevents tampering (D1)
2. **Peer authentication**: Peers authenticate using shared secret derived from seed phrase (D2)
3. **Session binding**: Cryptographic binding of session to peer identity (D3)

**Residual risk**: Very low. MITM attacks cannot read or modify encrypted, authenticated traffic without the session key.

#### AV-06: Remote API Access

**Description**: Attacker gains network access to Kamelot's API (if exposed).

**Assets threatened**: File contents, metadata, index (if API access is obtained)

**Attack difficulty**: Medium (requires network access, authentication bypass)

**Defenses**:
1. **API authentication**: API key required for all operations (D4)
2. **Localhost only (default)**: API binds to 127.0.0.1 by default (D5)
3. **Rate limiting**: Configurable rate limits prevent brute force (D6)
4. **Audit logging**: All API access logged in .aioss ledger (D7)

**Residual risk**: Low. API is not exposed by default. If exposed, authentication and rate limiting protect against brute force.

### 4.3 Software Attack Vectors

#### AV-07: Memory Disclosure

**Description**: Attacker exploits a vulnerability to read process memory and extract keys or file contents.

**Assets threatened**: Encryption keys, decrypted file contents (while in use)

**Attack difficulty**: High (requires exploitable memory disclosure vulnerability)

**Defenses**:
1. **Memory safety (Rust)**: Kamelot is written in Rust, which prevents many memory safety vulnerabilities (D1)
2. **mlock()**: Keys locked in RAM (D2)
3. **Guard pages**: Memory regions with keys are guarded (D3)
4. **Core dump prevention**: `PR_SET_DUMPABLE` prevents core dumps (D4)
5. **Memory zeroing**: Keys zeroed before deallocation (D5)

**Residual risk**: Low to medium. Rust eliminates entire classes of memory safety bugs, but vulnerabilities in unsafe code or dependencies could remain.

#### AV-08: Side-Channel Attack

**Description**: Attacker uses timing, power consumption, or electromagnetic emissions to extract cryptographic keys.

**Assets threatened**: Encryption keys (during cryptographic operations)

**Attack difficulty**: Very high (requires specialized equipment and physical proximity)

**Defenses**:
1. **Constant-time operations**: Cryptographic operations use constant-time implementations to prevent timing leaks (D1)
2. **Deterministic execution**: Same inputs always produce same execution path (D2)
3. **No key-dependent branching**: Code paths do not depend on key values (D3)

**Residual risk**: Low. Side-channel attacks on software running on general-purpose CPUs are extremely difficult.

#### AV-09: Supply Chain Attack on Software Dependencies

**Description**: Attacker compromises a dependency of Kamelot (Rust crate) to introduce malicious code.

**Assets threatened**: All assets

**Attack difficulty**: Medium (requires compromise of a popular crate or mirror)

**Defenses**:
1. **Dependency audit**: All dependencies are reviewed and pinned (D1)
2. **Cargo.lock**: Exact dependency versions are locked (D2)
3. **Cargo audit**: Automated vulnerability scanning (D3)
4. **Minimal dependencies**: Kamelot has a deliberately minimal dependency tree (D4)
5. **SBOM**: Software Bill of Materials published with each release (D5)

**Residual risk**: Low to medium. The Rust ecosystem has strong supply chain security practices.

#### AV-10: AI Model Attack

**Description**: Attacker exploits the AI model to extract information about files or cause misclassification.

**Assets threatened**: File contents (if model can reconstruct them), search accuracy

**Attack difficulty**: High (requires ML expertise, model access)

**Defenses**:
1. **Local model**: The AI model runs locally and has no network access (D1)
2. **Fixed, deterministic model**: Same input always produces same output (D2)
3. **No training on user data**: The model never learns from user content (D3)
4. **Model replaceability**: Users can substitute the model with any compatible model (D4)

**Residual risk**: Very low. The model is a fixed function that processes files into embeddings. It cannot extract or store file contents.

### 4.4 Cryptographic Attack Vectors

#### AV-11: Brute Force Seed Phrase

**Description**: Attacker attempts to guess the seed phrase through exhaustive search.

**Assets threatened**: All assets (seed phrase is the root of all keys)

**Attack difficulty**: Extremely high (2^256 entropy)

**Defenses**:
1. **256-bit entropy**: The seed phrase is generated with 256 bits of cryptographic entropy (D1)
2. **Argon2id KDF**: Memory-hard KDF makes each guess expensive (~64 MB per candidate) (D2)
3. **Rate limiting**: No network-accessible interface for brute force (D3)

**Residual risk**: Effectively zero. Brute-forcing a 24-word BIP-39 phrase with Argon2id protection is computationally infeasible by many orders of magnitude.

#### AV-12: Cryptographic Algorithm Weakness

**Description**: A weakness is discovered in XChaCha20, Poly1305, SHA-256, or Argon2id.

**Assets threatened**: File contents, keys

**Attack difficulty**: Variable (depends on the weakness)

**Defenses**:
1. **Conservative algorithm selection**: Algorithms are well-established and widely vetted (D1)
2. **Algorithm agility**: Kamelot's architecture supports algorithm replacement (D2)
3. **Multiple algorithms**: Different operations use different algorithms (XChaCha20, SHA-256, Argon2id, HKDF) (D3)

**Residual risk**: Low. All selected algorithms are conservative choices with years of cryptanalysis.

#### AV-13: Nonce Reuse

**Description**: If two files are encrypted with the same key and nonce, XOR of ciphertexts reveals XOR of plaintexts.

**Assets threatened**: File contents (if collision occurs)

**Attack difficulty**: Effectively impossible (192-bit random nonces)

**Defenses**:
1. **192-bit random nonce**: Extremely low collision probability (D1)
2. **Per-file keys**: Each file uses a unique key derived from master key + file hash (D2)
3. **Key derivation includes file hash**: If two files happen to have same content, they still have different keys (via HKDF domain separation) (D3)

**Residual risk**: Effectively zero. Probability of a nonce collision is less than random hardware failure.

### 4.5 Social Attack Vectors

#### AV-14: Phishing for Seed Phrase

**Description**: Attacker tricks the user into revealing their seed phrase through a fake website, email, or support request.

**Assets threatened**: All assets

**Attack difficulty**: Low to medium (requires convincing social engineering)

**Defenses**:
1. **User education**: Kamelot documentation warns never to share seed phrases (D1)
2. **No support requests**: Kamelot developers never ask for seed phrases (D2)
3. **No recovery service**: There is no Kamelot service that can recover seed phrases (D3)

**Residual risk**: Medium. User education is the primary defense. Kamelot cannot prevent users from voluntarily sharing their seed phrase.

#### AV-15: Shoulder Surfing

**Description**: Attacker visually observes the seed phrase while it is displayed during initialization.

**Assets threatened**: Seed phrase

**Attack difficulty**: Low (requires visual observation)

**Defenses**:
1. **Single display**: Seed phrase is displayed once and cannot be redisplayed (D1)
2. **Clear screen prompt**: User is warned to ensure nobody is watching (D2)
3. **Offline generation**: Seed phrase can be generated on an offline device (D3)

**Residual risk**: Low. User vigilance is required during initialization.

### 4.6 Physical Coercion / Legal

#### AV-16: Rubber Hose Cryptanalysis

**Description**: Attacker physically coerces the user to reveal their seed phrase.

**Assets threatened**: All assets

**Attack difficulty**: Low (requires physical access to the user)

**Defenses**:
1. **No plausible deniability**: Kamelot does not support deniable encryption (D1)
2. **Legal protections**: Kamelot (the project) cannot protect against legal compulsion (D2)

**Residual risk**: High. Kamelot has no defense against physical coercion. The user should consider jurisdiction and risk profile before storing sensitive data.

#### AV-17: Legal Compulsion

**Description**: Law enforcement or court order compels the user to reveal their seed phrase.

**Assets threatened**: All assets

**Attack difficulty**: Low (requires legal authority)

**Defenses**:
1. **No key escrow**: Kamelot does not provide government access (D1)
2. **Jurisdiction-specific**: Protection varies by jurisdiction (D2)

**Residual risk**: High in some jurisdictions. Kamelot is not designed to resist legal compulsion.

---

## 5. Assumptions and Limitations

### 5.1 Assumptions

This threat model assumes:

1. **Operating system security**: The underlying OS (Linux, Windows, macOS) provides adequate process isolation, memory protection, and file system permissions.

2. **Hardware security**: The CPU and chipset implement standard security features (NX bit, ASLR, SMEP/SMAP) correctly.

3. **Cryptographic primitive security**: SHA-256, XChaCha20, Poly1305, Argon2id, and HKDF remain cryptographically secure.

4. **User competence**: The user follows basic security practices (strong seed phrase storage, no sharing, up-to-date OS).

5. **Random number generation**: The OS CSPRNG produces true random numbers (backdoored RNG is not defended against).

6. **Physical security**: The user takes reasonable measures to protect their device from theft when running.

### 5.2 Known Limitations

1. **No deniable encryption**: Kamelot does not support plausible deniability (hidden volumes, steganography).

2. **No post-quantum cryptography**: Current algorithms (XChaCha20, SHA-256) provide reduced security against quantum attackers (256-bit → 128-bit effective).

3. **Running system vulnerability**: If the system is compromised while Kamelot is running (malware, remote access), keys in memory can be extracted.

4. **Metadata leakage**: While file names and metadata are encrypted, the number of files and their sizes (after encryption overhead) are visible.

5. **Timing side channels**: Network traffic analysis of K-Swarm sync can reveal approximate file sizes and sync frequency.

### 5.3 Future Improvements

| Improvement | Priority | Timeline |
|------------|----------|----------|
| Post-quantum cryptography (Kyber/Dilithium) | Medium | 2027 |
| Deniable encryption (hidden volume support) | Low | 2028 |
| Memory encryption for cold boot resistance | Medium | 2027 |
| Formal verification of key components | High | 2026–2027 |
| Side-channel hardened crypto implementations | Medium | 2026 |

---

## 6. Responsible Disclosure Policy

### 6.1 Reporting a Vulnerability

If you discover a security vulnerability in Kamelot, please report it privately:

- **Email**: security@kamelot.dev (PGP key available at https://kamelot.dev/pgp)
- **HackerOne**: https://hackerone.com/kamelot (bug bounty program)
- **GitHub**: Private vulnerability reporting via Security tab

### 6.2 Disclosure Timeline

1. **Report received**: Acknowledged within 24 hours
2. **Triage**: Severity assessment within 72 hours
3. **Fix development**: Timeline depends on severity:
   - Critical: 7 days
   - High: 14 days
   - Medium: 30 days
   - Low: 90 days
4. **Release**: Security advisory published with patch release
5. **Public disclosure**: After patch is available (typically 90 days after report)

### 6.3 Scope

The vulnerability disclosure program covers:

- Kamelot daemon (all components)
- K-Swarm protocol
- Cryptographic implementation
- Key management
- .aioss ledger
- Build and release infrastructure
- Official Kamelot website (kamelot.dev)

### 6.4 Out of Scope

The following are out of scope:

- Third-party dependencies (report to dependency maintainers)
- Operating system vulnerabilities
- Hardware vulnerabilities
- Social engineering of Kamelot team members
- Physical attacks requiring in-person access
- Denial of service attacks

### 6.5 Recognition

We maintain a Security Hall of Fame at https://kamelot.dev/security/hof for researchers who responsibly disclose vulnerabilities.

---

## 7. Additional Attack Vectors

### 7.1 Physical Access Attack Vectors (Continued)

#### AV-18: Forensic Analysis of Decommissioned Hardware

**Description**: Attacker performs forensic analysis on a hard drive that was previously used for a Kamelot store, even after the store has been deleted.

**Assets threatened**: Residual file data, encryption keys (if not properly erased)

**Attack difficulty**: Medium (requires forensics tools and expertise)

**Defenses**:
1. **Cryptographic erasure**: Deleting the seed phrase makes all data permanently unrecoverable (D1)
2. **Full-disk encryption (recommended)**: Combined with LUKS/BitLocker, the entire disk is encrypted (D2)
3. **Secure erase**: Kamelot supports ATA Secure Erase for SSDs and overwrite for HDDs (D3)
4. **No plaintext data on disk**: Kamelot never writes unencrypted data to storage (D4)

```bash
# Securely erase a Kamelot store before decommissioning
kml store secure-erase --method dod
# Performing DoD 5220.22-M 3-pass wipe...
# Pass 1: 0x00 write... 100%
# Pass 2: 0xFF write... 100%
# Pass 3: Random write... 100%
# Verification pass... 100%
# Secure erase complete.
```

**Residual risk**: Low. Cryptographic erasure combined with secure deletion provides strong protection.

#### AV-19: Evil Maid Attack

**Description**: Attacker gains brief physical access to the unattended device, installs a hardware or firmware implant, and returns later to collect data.

**Assets threatened**: All assets (if implant captures seed phrase or keys at next startup)

**Attack difficulty**: High (requires custom hardware and two physical access events)

**Defenses**:
1. **TPM + Secure Boot**: Verifies firmware integrity at boot; tampering detected (D1)
2. **MF+SO binding**: Without the phone, store is inaccessible even with seed phrase (D2)
3. **Tamper-evident seals**: Visual indicators of physical tampering (D3)
4. **Boot from read-only media**: Kamelot configuration on tamper-proof storage (D4)

**Residual risk**: Medium. Evil maid attacks are difficult to fully prevent, but TPM + MF+SO binding significantly increases attack cost.

### 7.2 Network Attack Vectors (Continued)

#### AV-20: K-Swarm Peer Impersonation

**Description**: Attacker creates a fake K-Swarm peer to intercept synced data or inject malicious files.

**Assets threatened**: Synced file contents, integrity of synced data

**Attack difficulty**: High (requires cryptographic key knowledge)

**Defenses**:
1. **Peer authentication**: Each K-Swarm peer authenticates using a key derived from the shared seed phrase (D1)
2. **Session binding**: Cryptographic binding of session to peer identity prevents MITM (D2)
3. **End-to-end encryption**: Even if peer is impersonated, data is encrypted end-to-end (D3)
4. **Peer list verification**: Users can verify and approve peer identities (D4)

```bash
# View authorized K-Swarm peers
kml swarm peers
# Peer ID      | Device        | Last Seen           | Status
# ─────────────┼───────────────┼─────────────────────┼───────
# 0x3a5f...   | Office Laptop | 2026-06-19 14:30    | Online
# 0x7b1d...   | Home Desktop  | 2026-06-19 10:15    | Online
# 0xf2e4...   | Phone         | 2026-06-19 14:32    | Online
# 0x9c8a...   | UNKNOWN       | Never               | ⚠ Not authorized

# Remove unauthorized peer
kml swarm remove-peer 0x9c8a...
```

**Residual risk**: Very low. Cryptographic authentication prevents impersonation without the seed phrase.

#### AV-21: LAN/Wi-Fi Eavesdropping on K-Swarm Traffic

**Description**: Attacker on the same local network captures K-Swarm sync traffic.

**Assets threatened**: Synced file data, sync metadata (file sizes, frequency)

**Attack difficulty**: Low (Wi-Fi traffic capture is trivial)

**Defenses**:
1. **Encrypted transport**: All K-Swarm traffic encrypted with XChaCha20-Poly1305 (D1)
2. **Ephemeral session keys**: Perfect forward secrecy prevents decryption even with seed phrase compromise (D2)
3. **Traffic padding**: Optional padding to obfuscate file sizes (D3)

```bash
# Enable traffic padding for K-Swarm
kml config set swarm.traffic-padding enabled
kml config set swarm.traffic-padding min-block 4096
# All K-Swarm packets will be padded to the nearest 4 KB boundary
# This obfuscates the actual file sizes being synced
```

**Residual risk**: Very low. Encrypted traffic cannot be decrypted. Timing analysis could theoretically reveal sync patterns, but not content.

### 7.3 Software Attack Vectors (Continued)

#### AV-22: Rollback Attack on .aioss Ledger

**Description**: Attacker replaces the current .aioss ledger with an older version, hiding recent file operations.

**Assets threatened**: Integrity of audit trail, detection of unauthorized operations

**Attack difficulty**: Low (if attacker has filesystem write access)

**Defenses**:
1. **Externally published root hash**: Root hash published to blockchain enables detection of rollback (D1)
2. **Monotonic entry numbers**: Ledger detects if a newer entry number existed before (D2)
3. **TPM NVRAM root hash**: Root hash stored in TPM NVRAM prevents rollback without TPM access (D3)
4. **Backup verification**: Integrity verification compares with known-good backups (D4)

```bash
# Detect ledger rollback
kml ledger audit --check-rollback
# Checking for rollback attacks...
# Latest entry: 89,214
# TPM NVRAM root hash: a1b2c3d4...
# Externally published (blockchain): a1b2c3d4...
# 
# ✗ ROLLBACK DETECTED!
# The local ledger has entry 89,214, but the blockchain anchor 
# shows 95,001 entries as of 2026-06-19.
# 5,787 entries have been removed.
# 
# Recommended action: Restore from backup or re-sync from peers.
```

**Residual risk**: Low to medium, depending on root hash publication method. Blockchain-anchored root hashes provide the strongest protection.

#### AV-23: Denial of Service on Encryption Operations

**Description**: Attacker triggers computationally expensive encryption operations (e.g., repeated Argon2id derivation) to exhaust CPU or battery.

**Assets threatened**: System availability, battery life

**Attack difficulty**: Low to medium (varies by attack vector)

**Defenses**:
1. **Rate limiting**: Configurable limits on API requests (D1)
2. **Proof of work gating**: For unauthenticated requests, small PoW may be required (D2)
3. **Argon2id caching**: Derived keys are cached; repeated derivation from same seed uses cache (D3)
4. **Battery-aware throttling**: Kamelot reduces background operations on battery power (D4)

```rust
/// Rate-limited key derivation with caching
fn cached_derive_master_key(seed: &str) -> Result<[u8; 32], Error> {
    use std::collections::HashMap;
    use std::sync::Mutex;
    use lazy_static::lazy_static;
    
    lazy_static! {
        static ref KEY_CACHE: Mutex<HashMap<String, [u8; 32]>> = 
            Mutex::new(HashMap::new());
    }
    
    // Check cache first
    {
        let cache = KEY_CACHE.lock().unwrap();
        if let Some(key) = cache.get(seed) {
            return Ok(*key);
        }
    }
    
    // Rate limit: max 1 derivation per 10 seconds
    let mut last_derivation = LAST_DERIVATION.lock().unwrap();
    let now = std::time::Instant::now();
    if now.duration_since(*last_derivation).as_secs() < 10 {
        return Err(Error::RateLimited("Max 1 key derivation per 10 seconds"));
    }
    *last_derivation = now;
    
    // Perform expensive derivation
    let master_key = derive_master_key(seed)?;
    
    // Cache result
    let mut cache = KEY_CACHE.lock().unwrap();
    cache.insert(seed.to_string(), master_key);
    
    Ok(master_key)
}
```

**Residual risk**: Low. Rate limiting and caching effectively prevent resource exhaustion attacks.

### 7.4 Cryptographic Attack Vectors (Continued)

#### AV-24: Related-Key Attack

**Description**: Attacker exploits the relationship between keys derived from the same master key to compromise one key, then derive others.

**Assets threatened**: All derived keys (if HKDF domain separation fails)

**Attack difficulty**: Very high (requires cryptographic weakness in HKDF)

**Defenses**:
1. **HKDF domain separation**: Each derived key uses a unique "info" string, ensuring independent derivation (D1)
2. **No key relation leakage**: HKDF output is computationally independent for different info strings (D2)
3. **Per-file file keys**: Even within the same domain, file hash ensures per-file uniqueness (D3)

```rust
/// Verify HKDF domain separation
#[test]
fn test_hkdf_domain_separation() {
    let master_key = [0x42u8; 32];
    
    let file_enc_key = derive_child_key(&master_key, b"kam:fe", &[0u8; 32]);
    let index_enc_key = derive_child_key(&master_key, b"kam:ie", &[0u8; 32]);
    let ledger_key = derive_child_key(&master_key, b"kam:la", &[0u8; 32]);
    let mesh_key = derive_child_key(&master_key, b"kam:me", &[0u8; 32]);
    let api_key = derive_child_key(&master_key, b"kam:aa", &[0u8; 32]);
    
    // All keys should be different
    assert_ne!(file_enc_key, index_enc_key);
    assert_ne!(file_enc_key, ledger_key);
    assert_ne!(file_enc_key, mesh_key);
    assert_ne!(file_enc_key, api_key);
    assert_ne!(index_enc_key, ledger_key);
    assert_ne!(index_enc_key, mesh_key);
    
    // Two files should have different keys
    let file1_key = derive_file_key(&master_key, &[0x01u8; 32]);
    let file2_key = derive_file_key(&master_key, &[0x02u8; 32]);
    assert_ne!(file1_key, file2_key);
}
```

**Residual risk**: Effectively zero. HKDF is a well-studied, provably secure KDF with strong domain separation.

#### AV-25: Length-Decryption Attack

**Description**: Attacker uses the observable size of encrypted files to infer information about content.

**Assets threatened**: Privacy of file contents (partial information leakage)

**Attack difficulty**: Low (file sizes are visible in directory listings)

**Defenses**:
1. **Minimal size leakage**: File size rounded to encryption block boundary (64 bytes for XChaCha20) (D1)
2. **Optional padding (planned)**: Configurable padding to fixed block sizes (4K, 16K, 64K, 1M) (D2)

```bash
# Enable size obfuscation
kml config set crypto.size-obfuscation enabled
kml config set crypto.size-obfuscation.block-size 65536
# All encrypted files will be padded to the next 64 KB boundary
# A 1 KB file becomes 64 KB; a 1 MB file becomes 1,024 KB
# Overhead: 0–63 KB per file (configurable)
```

**Residual risk**: Low. Without size obfuscation, approximate file sizes are visible. With obfuscation, only the upper bound is visible.

## 8. Threat Model Updates and Maintenance

### 8.1 Review Schedule

| Review | Date | Scope | Lead |
|--------|------|-------|------|
| Initial publication | 2026-Q1 | Full threat model | Security team |
| Annual review 1 | 2027-Q1 | Update attack vectors, review defenses | Security team |
| Annual review 2 | 2028-Q1 | Update, incorporate new research | Security team |
| Major release review | Each vN.0 | Full re-assessment | External auditor |
| Incident-triggered review | As needed | Review defenses related to incident | Security team |

### 8.2 Change Log

| Date | Change | Rationale |
|------|--------|-----------|
| 2026-06-01 | Initial publication | — |
| 2026-09-15 | Added AV-18 to AV-25 | Expanded coverage of attack vectors |
| 2026-12-01 | Updated quantum security section | New NIST PQ standards released |
| 2027-03-01 | Added post-quantum migration plan | PQ algorithms nearing standardization |

### 8.3 Feedback and Contributions

Security researchers and users are encouraged to contribute to this threat model:

```bash
# Submit a new attack vector
# 1. Open an issue at https://github.com/lois-kleinner/kamelot/issues
# 2. Use the "Threat Model" template
# 3. Describe:
#    - Attack description
#    - Assets threatened
#    - Attack difficulty
#    - Proposed defenses (if any)

# Alternative: Email security@kamelot.dev with PGP encryption
# PGP key: https://kamelot.dev/pgp
```

## 9. Defense-in-Depth Matrix

### 9.1 Attack Vector Coverage by Defense Layer

| Attack Vector | Encryption | Key Mgmt | Hardware Binding | Ledger | Zero-Knowledge | Code Safety | User Education |
|--------------|------------|----------|-----------------|--------|----------------|-------------|----------------|
| Drive theft | ✅ Primary | ✅ Secondary | ✅ Tertiary | — | ✅ Secondary | — | — |
| Cold boot | — | ✅ Primary | ✅ Secondary | — | — | — | — |
| Network eavesdropping | ✅ Primary | — | — | — | ✅ Secondary | — | — |
| MITM | ✅ Primary | — | — | — | ✅ Secondary | — | — |
| Remote API | — | ✅ Primary | — | ✅ Secondary | — | — | — |
| Memory disclosure | — | ✅ Secondary | — | — | — | ✅ Primary | — |
| Side-channel | ✅ Primary | — | — | — | — | ✅ Secondary | — |
| Dependency attack | — | — | — | — | — | ✅ Primary | — |
| AI model attack | — | — | — | — | ✅ Primary | — | — |
| Brute force seed | — | ✅ Primary | — | — | — | — | ✅ Secondary |
| Algorithm weakness | ✅ Primary | ✅ Secondary | — | — | — | — | — |
| Nonce reuse | ✅ Primary | ✅ Secondary | — | — | — | — | — |
| Phishing | — | — | — | — | — | — | ✅ Primary |
| Rubber hose | — | — | — | — | — | — | ✅ Primary |
| Malware | ✅ Secondary | ✅ Secondary | — | ✅ Secondary | ✅ Secondary | ✅ Primary | ✅ Secondary |
| Rollback | — | — | ✅ Primary | ✅ Primary | — | — | — |
| Evil maid | — | — | ✅ Primary | ✅ Secondary | — | ✅ Secondary | — |
| Supply chain (hardware) | — | — | ✅ Primary | — | — | ✅ Secondary | — |

### 9.2 Defense Layer Effectiveness

| Defense Layer | Effectiveness Against | Cost | User Impact | Implementation Status |
|--------------|---------------------|------|-------------|----------------------|
| Encryption (XChaCha20-Poly1305) | Very High (computationally secure) | Computational (negligible) | None | ✅ Implemented |
| Key management (Argon2id + HKDF) | Very High (memory-hard KDF) | ~1 second per startup | Seed phrase entry | ✅ Implemented |
| Hardware binding (TPM) | High (tied to hardware) | TPM required | Cannot change hardware without recovery | ✅ Implemented (v0.1) |
| Hardware binding (MF+SO) | High (phone proximity required) | Phone required | Phone must be in range | ✅ Implemented (v0.1) |
| .aioss integrity ledger | Very High (cryptographic chain) | ~50μs per entry | None (automatic) | ✅ Implemented (v0.1) |
| Zero-knowledge architecture | Very High (no server to attack) | None | None | ✅ Implemented (v0.1) |
| Memory-safe language (Rust) | Very High (prevents memory bugs) | Development cost | None | ✅ Implemented (v0.1) |
| User education | Moderate (depends on user) | Documentation effort | User must read docs | ✅ Implemented (v0.1) |
| Post-quantum cryptography | Future-proofing | Computational overhead | None | 🔄 Planned (2027) |
| Formal verification | Very High (mathematical proof) | Very high development cost | None | 🔄 Planned (2027) |

### 9.3 Defense Depth Scores

Overall defense-in-depth score by asset:

| Asset | Layers of Defense | Weakest Layer | Overall Score |
|-------|------------------|---------------|---------------|
| File contents | 6 | User error (phishing) | Very Strong |
| Seed phrase | 5 | User error (storage) | Strong |
| Encryption keys | 4 | Cold boot (physical) | Strong |
| File names/metadata | 4 | Traffic analysis (size leakage) | Strong |
| Search queries | 3 | Local process compromise | Moderate |
| Embedding vectors | 2 | Local process compromise | Moderate |

## 10. Conclusion

Kamelot's threat model demonstrates a system designed with security as a primary concern. The most critical assets (file contents, seed phrase, encryption keys) are protected by multiple layers of defense:

1. **Strong cryptography**: XChaCha20-Poly1305, SHA-256, Argon2id, HKDF
2. **Defense in depth**: Encryption + hardware binding + zero-knowledge architecture
3. **Memory safety**: Rust eliminates entire classes of vulnerabilities
4. **Transparency**: Open source code enables independent verification
5. **Least privilege**: Each component has access only to what it needs

The residual risks are primarily:
- User error (sharing seed phrase, physical coercion)
- Running system compromise (malware on OS)
- Legal compulsion

These risks are inherent to any software-based encryption system and cannot be eliminated entirely at the software level.

We encourage security researchers to test our claims, report vulnerabilities, and help us improve Kamelot's security posture.

---

*For security inquiries: security@kamelot.dev*

*Last updated: June 2026*

*This document is part of the Data Safety documentation suite. See also:*
- *01-encryption-architecture.md — Encryption architecture*
- *02-key-management.md — Key management*
- *03-hardware-binding.md — Hardware binding*
- *04-aioss-ledger-integrity.md — .aioss integrity ledger*
- *05-zero-knowledge-proof.md — Zero-knowledge architecture*

---

*Kamelot is a project of Lois-Kleinner & 0-1.gg. © 2026. All rights reserved.*

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

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com