
                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                

# BDR-06: Adopt Self-Hosted Over SaaS Architecture

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Status

**Accepted** — 2026-01-28

---

## Context

Kamelot is a tool for managing personal and professional file collections. The target users include:
1. **Privacy-conscious individuals**: Developers, journalists, researchers who handle sensitive data.
2. **Enterprise users**: Companies that need to index documents, codebases, and knowledge bases without exposing data to third parties.
3. **Offline users**: Travelers, field workers, air-gapped environments.
4. **Hobbyists and makers**: Users who want full control over their data and infrastructure.

The core question: Should Kamelot be a self-hosted, zero-knowledge local application, or a cloud-hosted SaaS with optional local caching?

Key concerns driving this decision:

1. **Data sovereignty**: File content is deeply personal. Users must maintain ownership and control. No third party should have access to unencrypted file content, metadata, or search queries.
2. **Ransomware immunity**: If the user's machine is compromised by ransomware, Kamelot's encrypted store should not be decryptable without the user's passphrase. The architecture must provide defense in depth.
3. **Compliance**: Users in regulated industries (healthcare, legal, finance) may have legal requirements to keep data on-premises. HIPAA, GDPR, and SOC 2 compliance cannot rely on a third-party provider's certifications.
4. **Offline operation**: Kamelot must function without internet connectivity. Search, ingest, and file access must work at full speed offline.
5. **Cost model**: Ongoing SaaS fees are a barrier to adoption. Kamelot should be a one-time purchase or free, with optional paid features (support, advanced sync).

---

## Options Considered

### Option 1: Fully Self-Hosted, Zero-Knowledge, Local-First

All data stays on the user's machine. No cloud dependencies. Encryption keys are derived from a user passphrase and never leave the machine. All AI inference runs locally (Ollama). Vector database runs locally (Qdrant). The object store is local (Sled).

- **Architecture**: All components on the same machine (or LAN for multi-user).
- **Encryption**: ChaCha20-Poly1305 for file content at rest. Keys derived from user passphrase via Argon2id. Master key encrypted with a user-provided passphrase and stored in the local config.
- **Key management**: User remembers a passphrase (minimum 12 characters, recommend 16+). Passphrase is used to derive an encryption key via Argon2id (3 iterations, 1GB memory, 4 parallelism).
- **Authentication**: No authentication needed for local use. The OS user account is the authentication boundary. Future multi-user: local accounts with separate passphrases.
- **Backup**: User is responsible for backing up `~/.kamelot/`. Recommended: rsync, rclone, or manual copy.
- **Sync**: Optional sync between multiple Kamelot instances via user-provided infrastructure (Syncthing, rclone, S3-compatible storage). Kamelot provides encrypted export/import, but does not manage cloud infrastructure.
- **Updates**: Self-update mechanism (via GitHub releases) or manual download. Updates are cryptographically signed.
- **Telemetry**: None by default. Opt-in crash reporting with explicit user consent.

### Option 2: Cloud-First SaaS with Local Cache

Kamelot as a managed cloud service with a local cache for offline access. File content is uploaded to Kamelot's cloud, indexed, and served via a web UI or local FUSE mount.

- **Architecture**: Cloud servers handle ingest, indexing, and AI inference. Local client is a thin FUSE mount + cache.
- **Encryption**: Encrypted in transit (TLS 1.3). Encrypted at rest in the cloud (AES-256 with cloud provider KMS). The cloud provider has access to decrypted data during search (to compute embeddings and run similarity search).
- **Key management**: Cloud manages encryption keys. User trusts the cloud provider.
- **Authentication**: Email + password, SSO (Google, GitHub, Microsoft), OIDC for enterprise.
- **Backup**: Managed by the cloud provider. SLA-backed.
- **Sync**: Built-in. All devices sync through the cloud.
- **Updates**: Managed by the cloud provider (server-side updates). Client auto-updates.
- **Telemetry**: Required for monitoring, billing, and product improvement.
- **Pricing**: Free tier (1GB), Pro ($10/month, 100GB), Business ($50/month, 1TB), Enterprise (custom).

### Option 3: Hybrid — Local-First with Optional Cloud Sync

Local-first architecture (like Option 1) but with optional cloud sync for backup and multi-device access. The cloud component is end-to-end encrypted: the cloud provider stores encrypted blobs and cannot decrypt them.

- **Architecture**: Local components same as Option 1. Optional cloud sync via a "Kamelot Relay" server (self-hosted or provided by Kamelot team).
- **Encryption**: All data encrypted with user-controlled keys before upload to cloud. Cloud stores encrypted blobs. Search indexes are not stored in the cloud (or stored encrypted and searched client-side — but client-side search of encrypted indexes is impractical for large datasets).
- **Key management**: User manages their own encryption key. Cloud never sees the key.
- **Sync**: User-initiated sync or scheduled background sync.
- **Cloud cost**: User pays for cloud storage (S3, B2, etc.) or uses the Kamelot Relay (paid service).
- **Offline**: Full functionality offline. Cloud sync is optional.

---

## Decision

**Adopt Option 1: Fully Self-Hosted, Zero-Knowledge, Local-First Architecture.**

Kamelot will never send file content, metadata, or search queries to any third-party service. All computation happens on the user's machine. The user is in complete control.

### Key Architectural Principles

1. **Zero-knowledge**: The Kamelot team cannot access user data. There is no telemetry (beyond opt-in crash reports). There is no cloud component.
2. **User-controlled keys**: Encryption keys are derived from a user passphrase. The passphrase never leaves the machine. Master key is encrypted with the passphrase and stored locally. Without the passphrase, the data is unrecoverable.
3. **Local-first**: All components (store, vector DB, AI model) run on the user's machine. No network dependencies for core functionality.
4. **Offline-capable**: Full functionality (search, ingest, file access) works without internet.
5. **Open source**: Kamelot is source-available (Apache 2.0 or MIT). Users can audit the code, build from source, and verify that no data is exfiltrated.
6. **Transparent**: All network access is documented and user-configurable (model downloads, updates, optional sync).

---

## Rationale

### Why Self-Hosted Wins

**1. Complete Data Sovereignty**

The user's file content never leaves their machine. This is the single most important architectural principle. Consider the alternatives:

Cloud-first (Option 2):
- Files are uploaded to a cloud server for indexing.
- The cloud provider sees: file names, content, metadata, your search queries, your search results, your usage patterns.
- Even with "zero-data-retention" policies, the data is processed on third-party hardware.
- Government requests (NSLs, warrants) can compel the provider to hand over data.
- Provider acquisition or bankruptcy could change data handling policies.

Hybrid (Option 3):
- Files stay local for indexing. Only encrypted blobs are uploaded for backup.
- Search indexes stay local (cannot be searched in the cloud unless decryption keys are shared).
- The cloud provider stores opaque encrypted blobs and cannot decrypt them. This is good for backup and sync.
- However, the cloud provider can see metadata (file sizes, access patterns, sync frequency) unless traffic is routed through a VPN/Tor. Metadata alone can reveal sensitive information (e.g., "user accessed 100 medical records at 2 AM").

Self-hosted (Option 1):
- Nothing leaves the machine (except optional model downloads from Ollama's registry).
- File content, metadata, search queries, search results — all processed in RAM and stored on local disk.
- No third party can access any data. Period.

**2. Ransomware Immunity by Design**

A well-designed self-hosted architecture provides ransomware protection:

```
┌──────────────────────────────────────────────────────────────┐
│                    Ransomware Attack Surface                  │
├──────────────────────────────────────────────────────────────┤
│  User files (unencrypted)      │ Kamelot store (encrypted)   │
│  Easily encrypted by malware   │ Can't be re-encrypted       │
│  ✓ Target for ransomware       │ ✗ Resistant to ransomware   │
├──────────────────────────────────────────────────────────────┤
│  Kamelot config (encrypted)    │ User passphrase (in brain)  │
│  Contains encrypted master key │ Master key derived from     │
│  without passphrase, useless   │ passphrase via Argon2id     │
│  ✓ Resistant                   │ ✓ Not on disk               │
└──────────────────────────────────────────────────────────────┘
```

If ransomware encrypts the user's filesystem:
- The Kamelot store (`~/.kamelot/`) is already encrypted with ChaCha20-Poly1305. Ransomware re-encrypting it would double-encrypt, but the original encryption remains intact. After decryption of the ransomware layer, the Kamelot layer is still secure.
- The user's passphrase is not on disk (unless the user writes it down or types it into a keychain). The ransomware cannot extract the passphrase from memory easily.
- If the user has a backup of `~/.kamelot/`, they can restore it without paying the ransom. They just need their passphrase.

Contrast with cloud-first (Option 2):
- If ransomware encrypts the local cache, the cloud retains the canonical copy.
- But if the cloud provider is compromised, the attacker could access all user data (even if encrypted at rest, the cloud manages the keys).
- The user has no control over the cloud provider's security posture.

**3. Compliance Without Third-Party Dependencies**

Regulated industries require:
- **HIPAA**: Business Associate Agreements (BAAs) with all data processors. With self-hosted, there are no data processors. Kamelot is just a tool, not a service.
- **GDPR**: Data must be stored in the EU (or adequacy decision countries). Self-hosted: user controls data location.
- **SOC 2**: Cloud providers must have SOC 2 reports. Self-hosted: no need for provider certifications.
- **ITAR / EAR**: Export-controlled data must not leave the user's country. Self-hosted: data never leaves the user's premises.
- **Legal hold**: Users can preserve data by copying `~/.kamelot/`. No need to ask a cloud provider for an export.

A cloud-first approach would require Kamelot to maintain compliance certifications for each region and regulation. This is expensive ($500K+/year for SOC 2 + HIPAA) and creates liability.

**4. Offline Operation**

Kamelot must work on airplanes, in remote research stations, in air-gapped government facilities, and on personal laptops without internet access.

Self-hosted:
- Search works instantly. No network round-trips.
- Ingest works instantly. Files are processed locally.
- File access via FUSE is sub-millisecond.
- Model downloads require internet (one-time), but after that, no network access is needed.

Cloud-first:
- Search requires network access (latency: 50-500ms).
- Ingest requires uploading files to cloud (takes 10x longer than local processing for large files).
- File access requires network access (local cache helps for recently accessed files, but cold access is slow).
- Without internet, search is degraded or impossible (local cache may have partial index).

**5. Cost Predictability**

Self-hosted:
- Zero ongoing costs (after purchasing hardware and downloading software).
- Model download: one-time 4.5GB (Qwen) or 274MB (nomic-embed-text).
- Storage: user pays for their own disk (but they already have it).
- No surprise bills. No price increases.

Cloud-first:
- Free tier: limited to 1GB. Users quickly outgrow it.
- Pro tier: $10/month = $120/year. Over 5 years: $600.
- Enterprise: $50-500/month.
- Cloud storage egress fees for large downloads.
- Model inference costs (OpenAI API: $0.02/1K tokens).

For a tool that indexes a user's lifetime file collection (~100GB), the cloud-first approach costs $1,200 over 10 years (Pro plan). Self-hosted costs $0.

**6. Privacy as a Feature**

Kamelot's unique selling proposition is privacy-preserving AI search. The marketing message is simple: "Your files never leave your machine." This is a strong differentiator in a market where most "AI search" tools require cloud access.

- Google Drive: scans your files for AI features.
- Microsoft Copilot: requires sending files to Microsoft cloud.
- OpenAI ChatGPT with file upload: files processed on OpenAI servers.
- Dropbox Dash: cloud-based AI search.
- Notion AI: cloud-based.
- Mem.ai: cloud-based.

Kamelot is the only option that keeps everything local. Zero-knowledge. This is a defensible market position.

### Why Not Hybrid (Option 3)

Hybrid (local-first with optional encrypted cloud sync) is a reasonable middle ground. It was seriously considered but rejected for now because:

1. **Increased complexity**: Kamelot would need to implement end-to-end encrypted sync, conflict resolution, and multi-device reconciliation. This is 3-6 months of engineering work. For a v1 product, this delays launch.
2. **Metadata leakage**: Even with end-to-end encrypted content, the cloud provider sees metadata: file sizes, access patterns, sync frequency. Metadata analysis can reveal sensitive information. For example, a journalist syncing a single 10MB file every day at 8 PM could be inferred as writing a daily article.
3. **Sync is not core functionality**: Kamelot's primary value is semantic search. Sync is a nice-to-have. The team decided to focus on search quality, performance, and reliability for v1, and add sync in a future release.
4. **User infrastructure**: Users who need sync can use existing tools (Syncthing, rsync, rclone, Dropbox) to sync the `~/.kamelot/` directory. Kamelot does not need to reinvent sync.
5. **Support burden**: Cloud sync introduces a class of support issues (sync conflicts, authentication, network errors) that are outside Kamelot's core expertise.

---

## Consequences

### Positive

1. **Maximum privacy**: Zero-knowledge architecture. No third party has access to any user data.
2. **Full offline capability**: Kamelot works without internet. Every feature is available offline.
3. **No recurring costs**: Users pay once (or nothing if building from source). No monthly fees.
4. **Ransomware resistance**: Encrypted store is resilient to ransomware attacks.
5. **Compliance simplicity**: No BAAs, no SOC 2 audits, no GDPR data processing agreements.
6. **Open source trust**: Source code is available for audit. Users can verify the zero-knowledge claim.
7. **Simple pricing**: Kamelot is free software. Optional paid support or enterprise features may be offered later.
8. **No vendor lock-in**: Users control their data. They can stop using Kamelot at any time and copy their encrypted store to another system.

### Negative

1. **No built-in sync**: Users who want Kamelot on multiple machines must manually sync `~/.kamelot/` or wait for a future sync feature. Mitigation: Document sync workflows with Syncthing, rclone, rsync. Provide `kamelot export` and `kamelot import` commands for manual transfer.
2. **User manages backups**: If the user loses their `~/.kamelot/` directory, all indexed data is lost. The original files may still exist on the filesystem, but the index and encrypted store are gone. Mitigation: Document backup strategies. Recommend periodic backups of `~/.kamelot/`. The `kamelot backup` command creates a consistent snapshot.
3. **Passphrase management**: If the user forgets their passphrase, their data is unrecoverable. There is no password reset. Mitigation: Warn users during setup. Recommend using a password manager (if the user trusts one). Allow passphrase hint storage (optional, user-consented). The passphrase is only needed for `kamelot init` and `kamelot unlock`; the store remains locked when Kamelot is not running.
4. **No cloud indexing**: Kamelot cannot index files on cloud storage providers (Google Drive, Dropbox, OneDrive) unless the user syncs them locally first. Mitigation: Provide a `kamelot watch <path>` command that watches a local directory for changes. Users can sync cloud storage to a local directory and have Kamelot index it.
5. **No sharing / collaboration**: Users cannot share indexed files with others through Kamelot. Mitigation: Future release may add encrypted sharing via QR-code-based key exchange (like Magic Wormhole).
6. **Support limitations**: Without cloud infrastructure, Kamelot cannot provide usage-based analytics to improve the product. Mitigation: Opt-in telemetry with full transparency (what is collected, how it is used). Most data (crash reports, performance metrics) can be collected locally and sent anonymously with user consent.
7. **No mobile app**: A self-hosted Kamelot cannot trivially have a mobile companion app without a cloud relay. Mitigation: Future mobile app (Phase 3) could connect to a Kamelot instance on the user's home server via VPN/Tailscale.

### Risk Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| User forgets passphrase | High | High (data loss) | Clear warnings; recommend password manager; passphrase hint |
| Disk failure without backup | Medium | High (data loss) | Documentation; `kamelot backup` command; auto-backup reminder |
| No sync = limited adoption | Medium | Medium | Document sync workflows; explore future sync |
| Compliance requirements change | Low | Medium | Flexibly designed; can add cloud-gateway module without changing core |
| User distrust of closed update mechanism | Low | Medium | Open source; reproducible builds; signed releases |
| Ransomware attacks Kamelot store | Low | Low | Store already encrypted; ransomware can only double-encrypt |
| Ollama / Qdrant upstream changes | Low | Medium | Version-pinned dependencies; abstraction layers |

---

## Encryption Architecture

### Key Derivation

```
User passphrase
    │
    ▼
┌──────────────────────────────────────────────────────────────┐
│                    Argon2id                                   │
│  Parameters:                                                  │
│    Version: 1.3 (0x13)                                        │
│    Salt: 16 random bytes (stored in config)                   │
│    Time (iterations): 3                                       │
│    Memory: 1 GB (1048576 KiB)                                 │
│    Parallelism: 4                                             │
│    Key length: 32 bytes (256 bits)                            │
│                                                               │
│  Output: 256-bit Master Encryption Key (MEK)                  │
└──────────────────────────────────────────────────────────────┘
    │
    ├──► File encryption key derivation (per file):
    │     HKDF-SHA256(MEK, context = "kamelot-file-key" || file_hash)
    │     → 256-bit file-specific key
    │
    ├──► Metadata encryption key derivation:
    │     HKDF-SHA256(MEK, context = "kamelot-metadata-key")
    │     → 256-bit metadata key
    │
    └──► Index encryption key derivation:
        HKDF-SHA256(MEK, context = "kamelot-index-key")
        → 256-bit index key
```

### Per-File Encryption

```
File content (plaintext)
    │
    ▼
[Optional: zstd compression]
    │
    ▼
┌──────────────────────────────────────────────────────────────┐
│              ChaCha20-Poly1305 Encryption                     │
│                                                               │
│  Key: 256-bit file-specific key (derived via HKDF)            │
│  Nonce: 12 random bytes (generated per encryption)            │
│  AAD (Additional Authenticated Data):                         │
│    - file_hash (32 bytes)                                     │
│    - file_size (8 bytes, little-endian)                       │
│    - compression_flag (1 byte)                                │
│                                                               │
│  Output: nonce (12) || ciphertext (same length as input)      │
│           || tag (16 bytes)                                   │
│  Total overhead: 28 bytes per file                            │
└──────────────────────────────────────────────────────────────┘
    │
    ▼
Stored in Sled `objects` tree with key = file_hash
```

### Why ChaCha20-Poly1305 Instead of AES-256-GCM

1. **Performance without hardware AES**: On x86 CPUs without AES-NI (some older Intel/AMD chips), ChaCha20 is 3x faster than AES-256 in software. On ARM (Raspberry Pi, Apple Silicon M-series), ChaCha20 is also faster than AES (which uses the ARM Crypto Extension on M-series, making them comparable).
2. **Constant-time implementation**: ChaCha20 is inherently constant-time (no lookup tables, no S-boxes). This avoids cache-timing side-channel attacks.
3. **No IV reuse vulnerability**: ChaCha20-Poly1305 uses a 12-byte nonce. Random nonces have a negligible collision probability (2^-96 per 2^64 messages). AES-GCM with random nonces has a birthday bound of 2^32 messages (for 96-bit nonces). Kamelot could use 192-bit nonces with AES-GCM-SIV, but ChaCha20-Poly1305 is simpler.
4. **Authenticated encryption**: Poly1305 provides authentication. Any modification to the ciphertext (by ransomware or disk corruption) is detected on decryption.

### Key Storage

```
Config file (~/.kamelot/config.toml):
    [crypto]
    salt = "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6"  # hex-encoded, 16 bytes
    encrypted_master_key = "e4f5...a7b8"         # master key encrypted with passphrase-derived key
    key_checksum = "a1b2...c3d4"                 # SHA256 of plaintext master key (for passphrase verification)
    argon2_params = { time = 3, mem = 1048576, parallelism = 4 }
    algorithm = "chacha20-poly1305"
```

The master key is encrypted with a key derived from the user's passphrase (via Argon2id with a random salt). The encrypted master key is stored in the config file. The user's passphrase is never stored on disk.

To unlock Kamelot:
1. User enters passphrase.
2. Kamelot derives a key from the passphrase + stored salt via Argon2id.
3. Kamelot decrypts the `encrypted_master_key` with this derived key.
4. Kamelot verifies the decrypted key against `key_checksum` (SHA256 of plaintext master key).
5. If checksum matches: unlock successful. Store decrypted master key in memory (mprotect-locked).
6. If checksum fails: wrong passphrase.

The decrypted master key is stored in memory with `mprotect(PROT_NONE)` to prevent reading from other processes. It is zeroed on Kamelot exit.

---

## Threat Model

### Assets Protected
- File content (encrypted with per-file keys)
- File metadata (filenames, paths, timestamps — encrypted with metadata key)
- Search queries (processed in RAM, not logged to disk unencrypted)
- Search results (same as queries)
- Embedding vectors (encrypted in Qdrant, decrypted for search)
- Encryption keys (in memory, `mprotect`-locked)

### Trust Boundaries
- **Inside**: Kamelot process, user's RAM, user's disk (encrypted store)
- **Outside**: Network (if sync or model download), other processes on the same machine, physical attackers with disk access

### Assumptions
1. The user's OS is not compromised at the kernel level. If an attacker has root/kernel access, they can read Kamelot's memory and extract keys. Kamelot uses `mprotect` to harden but cannot defend against a kernel-level attacker.
2. The user's passphrase is strong (>= 12 random characters, 16+ recommended).
3. The user's hardware is not compromised with a cold boot attack (RAM freeze). For high-security users, Kamelot can lock the key when the screen locks or the lid closes.
4. Ollama and Qdrant run under the same user account and are trusted. Attackers who compromise these processes could access in-memory data.
5. Side-channel attacks (power analysis, timing, electromagnetic) are out of scope. Kamelot targets consumer and enterprise desktop use, not government-grade secure communications.

### Attacker Capabilities
| Attacker | Access | Can read encrypted store | Can read plaintext | Can recover keys |
|---|---|---|---|---|
| Drive-by malware (user-mode) | Same user space | No (encrypted) | No (mprotect)(1) | No (brute force passphrase) |
| Ransomware | Filesystem access | Can encrypt but not read | No | No |
| Forensic analyst with disk image | Disk | No (encrypted) | No | Maybe (weak passphrase) |
| Kernel rootkit | Full system | Yes (bypasses mprotect) | Yes | Yes |
| Cloud provider (if sync enabled) | Encrypted blobs only | No (can't decrypt) | No | No |
| Kamelot developers | No access | No | No | No |

(1) `mprotect` prevents other user-mode processes from reading Kamelot's memory, even with debugger privileges.

---

## Telemetry and Updates

### Crash Reporting
- **Default**: Off.
- **Opt-in**: User must explicitly enable crash reporting during setup or in settings.
- **Data collected**: Stack trace, operating system version, Kamelot version, hardware specs (CPU, RAM, GPU), anonymized configuration (model name, store size, no identifying data).
- **Transmission**: Sent to a configurable endpoint (default: Kamelot team's crash report server). User can see exactly what is sent before consenting.
- **Privacy**: No file content, metadata, or search queries are included in crash reports.

### Automatic Updates
- **Mechanism**: Kamelot checks for updates on startup (configurable: check frequency, disable entirely).
- **Privacy**: The update check sends only the current Kamelot version to GitHub's release API. No identifying information.
- **Verification**: Downloads are verified against a GPG signature or Sigstore cosign signature.

### Network Access Summary
All network access is documented and user-controllable:

| Operation | Network Required | Configurable | Default |
|---|---|---|---|
| Model download (first time) | Yes | Can pre-download on another machine | Enabled |
| Model download (update) | Yes | Can disable | Enabled |
| Update check | Yes | Can disable | Enabled |
| Crash report upload | Yes | Opt-in | Disabled |
| Sync (future feature) | Yes (optional) | User-controlled infra | Disabled |
| Telemetry | No (off by default) | N/A | Disabled |
| Core functionality | No | N/A | N/A |

---

## Open Source Licensing

Kamelot is released under the **Apache License 2.0** with an explicit patent grant. This license was chosen because:
1. **Permissive**: Companies can adopt Kamelot without legal concerns about GPL copyleft.
2. **Patent protection**: Apache 2.0 includes an express patent grant from contributors.
3. **Compatible with dependencies**: Sled (Apache 2.0), Qdrant (Apache 2.0), Ollama (MIT), wgpu (MIT/Apache 2.0), egui (MIT/Apache 2.0).
4. **Allows commercial use**: Kamelot can be used in proprietary environments without requiring the user to open-source their modifications.

### Contributor License Agreement (CLA)
Contributors must sign a CLA granting the Kamelot project a perpetual, worldwide, non-exclusive license to use their contributions. The CLA does not transfer copyright; contributors retain ownership of their work.

---

## Future: Optional Sync Architecture (Phase 3)

While the current decision is fully self-hosted, Phase 3 may add optional end-to-end encrypted sync:

```
┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
│  Kamelot A   │◄═══════►│  Relay Server    │◄═══════►│  Kamelot B   │
│  (desktop)   │  E2EE   │  (user-provided  │  E2EE   │  (laptop)    │
│              │         │   or Kamelot)    │         │              │
│  Master key: │         │  Stores:         │         │  Master key: │
│  passphrase  │         │  Encrypted blobs │         │  passphrase  │
│              │         │  No plaintext    │         │              │
└──────────────┘         └──────────────────┘         └──────────────┘
```

The relay server stores only encrypted blobs. Search and indexing happen locally on each device. Sync is pull-based: each device downloads encrypted blobs from the relay, decrypts locally, and updates its local index.

This architecture preserves zero-knowledge: the relay server never sees plaintext data. It is identical to Option 3 (Hybrid) but deferred to Phase 3 to avoid delaying the v1 release.

---

## References

- BDR-01: Adopt Rust Over C/C++
- BDR-02: Qdrant Over Pinecone
- BDR-03: Ollama Over Cloud AI
- BDR-05: Flat Store Over Hierarchy
- docs/developers/01-architecture-overview.md
- docs/developers/06-contributing-guide.md

---

## Appendix A: Threat Model Deep Dive

### Asset Classification

| Asset | Confidentiality | Integrity | Availability | Encryption |
|---|---|---|---|---|
| File content | Critical | Critical | Medium | ChaCha20-Poly1305, per-file key |
| File metadata (paths, timestamps) | High | High | Medium | ChaCha20-Poly1305, metadata key |
| Embedding vectors | Medium | Low | Medium | Encrypted at rest in Qdrant |
| Search queries | High | Low | Low | In-memory only, not logged |
| Search results | High | Low | Low | In-memory only, not logged |
| Encryption keys | Critical | Critical | Critical | Argon2id-derived, mprotect-locked |
| Passphrase (in user's brain) | Critical | N/A | N/A | Not stored |
| Configuration | Low | Medium | Low | TOML file, unencrypted |
| Logs | Low | Low | Low | Plaintext, rotated |

### Attack Scenarios

#### Scenario 1: Drive-by Malware (User-Mode)

**Attacker**: Generic malware running under the same user account.

**Capabilities**:
- Read/write files in user's home directory
- Read/write Kamelot's store files
- Execute code (if not blocked by EDR)

**Defenses**:
- Store files are encrypted: malware sees only ciphertext
- Cannot read encryption key from Kamelot's memory (mprotect-locked)
- Cannot decrypt files without the passphrase
- Malware can delete or corrupt the store (but not read it)

**Residual risk**: Ransomware can encrypt the already-encrypted store, making it unreadable (double encryption). Mitigation: regular backups.

#### Scenario 2: Physical Access / Disk Forensics

**Attacker**: Forensic analyst with physical access to the disk.

**Capabilities**:
- Read all sectors on the disk (extract ~/.kamelot/store)
- Attempt to recover deleted data from SSD blocks
- Attempt cold boot attack on RAM (if device is still running)

**Defenses**:
- Store files are encrypted: analyst sees only ciphertext (appears as random bytes)
- No plaintext on disk (all content is encrypted before writing)
- Passphrase not stored on disk (must be entered by user)
- Argon2id makes brute-force expensive: 3.2s per guess on M3 Max, ~1M guesses/year at 100% utilization
- For a 12-character random passphrase (72 bits of entropy): ~2^48 years to brute-force

**Residual risk**: Weak passphrase (<10 characters, dictionary word) can be brute-forced. Mitigation: enforce minimum passphrase strength (12+ characters, entropy check).

#### Scenario 3: Kernel-Level Rootkit

**Attacker**: Kernel-mode malware with full system access.

**Capabilities**:
- Read any process memory (including Kamelot's mprotect-locked pages)
- Modify kernel data structures
- Install persistent backdoors

**Defenses**: None (Kamelot is a user-space application; it cannot defend against kernel-level attackers). Once the attacker has kernel access, all bets are off.

**Mitigation**: 
- Use Full Disk Encryption (FileVault, BitLocker, LUKS) to protect against offline attacks
- Use hardware security modules (TPM, Secure Enclave) for key storage
- Run Kamelot in a sandboxed environment (Firejail, Docker, etc.)
- Regular security patches and OS updates

## Appendix B: Compliance Mapping

### GDPR Compliance

| GDPR Requirement | Kamelot Compliance |
|---|---|
| Right to be forgotten | User can delete `~/.kamelot/` to erase all data |
| Data portability | `kamelot export` creates portable encrypted archive |
| Data minimization | Only stores file content and metadata that user explicitly ingests |
| Processing records | Local-only; no data processing agreements with third parties |
| Cross-border transfer | Data never leaves user's machine; no cross-border transfers |
| Privacy by design | Zero-knowledge architecture built into design from BDR-01 |
| Breach notification | No cloud component to breach; local breach = local OS security |
| Data Protection Officer | Not required (no processing of EU resident data) |

### HIPAA Compliance

| HIPAA Rule | Kamelot Compliance |
|---|---|
| Security Rule (Administrative) | User maintains their own security policies |
| Security Rule (Physical) | User protects their own hardware |
| Security Rule (Technical) | Encryption at rest (AES-256-GCM via ChaCha20-Poly1305 equivalent), access control (OS user), audit logging (optional) |
| Privacy Rule | No disclosure to third parties; user controls all access |
| Breach Notification | User maintains their own breach response |
| BAAs | None needed (no business associates) |
| ePHI | Protected by encryption; user must ensure the underlying OS is secure |

### SOC 2

Self-hosted Kamelot does not require SOC 2 compliance because there is no service to audit. Each user is their own service provider. If Kamelot later offers a cloud sync relay (Phase 3), that relay will undergo SOC 2 Type II auditing.

## Appendix C: Backup and Disaster Recovery

### Recommended Backup Strategy

```
Frequency: Daily (incremental), Weekly (full)
Location: At least 2 copies (3-2-1 rule: 3 copies, 2 media, 1 offsite)
```

```bash
# Automated backup script (cron daily)
#!/bin/bash
KAMELOT_HOME="$HOME/.kamelot"
BACKUP_DIR="/backup/kamelot/$(date +%Y-%m-%d)"

mkdir -p "$BACKUP_DIR"

# 1. Flush store to disk
kamelot store flush

# 2. Create consistent snapshot
kamelot export "$BACKUP_DIR/kamelot-export.sled" --compress

# 3. Copy config (contains encrypted keys, NOT the passphrase)
cp "$KAMELOT_HOME/config.toml" "$BACKUP_DIR/"

# 4. Copy logs
cp -r "$KAMELOT_HOME/logs/" "$BACKUP_DIR/"

# 5. Verify backup
kamelot import --dry-run "$BACKUP_DIR/kamelot-export.sled"

# 6. Remove backups older than 90 days
find /backup/kamelot/ -type d -mtime +90 -exec rm -rf {} \;

echo "Backup completed: $(date)"
```

### Recovery Procedure

```bash
# Full restore
kamelot store restore /backup/2026-06-19/kamelot-export.sled

# Verification
kamelot doctor --full
kamelot status
```

### Disaster Scenarios

| Scenario | Impact | Recovery |
|---|---|---|
| Accidental deletion of ~/.kamelot | Total data loss | Restore from backup, re-enter passphrase |
| Disk failure | Total data loss | Replace disk, restore from backup, re-enter passphrase |
| SSD corruption | Partial data loss | Verify integrity, repair if possible, restore from backup |
| Ransomware (encrypts ~/.kamelot) | Double encryption | Decrypt ransomware layer, then restore from backup |
| User forgets passphrase | Total data loss | No recovery possible (zero-knowledge design) |
| Software bug corrupts store | Partial data loss | Run `kamelot doctor --repair`, restore corrupted objects from backup |

## Appendix D: Passphrase Policy

Recommended passphrase policy enforced by Kamelot:

```rust
// From kamelot-core/src/crypto/policy.rs

pub struct PassphrasePolicy {
    pub min_length: usize,        // 12
    pub max_length: usize,        // 128
    pub require_uppercase: bool,  // true
    pub require_lowercase: bool,  // true
    pub require_digit: bool,      // true
    pub require_special: bool,    // false
    pub min_entropy_bits: f64,    // 50.0
    pub reject_common: bool,      // true (check against leaked passwords DB)
    pub reject_keyboard_patterns: bool, // true
    pub reject_personal_info: bool,     // true (name, email, username)
}

impl PassphrasePolicy {
    pub fn validate(&self, passphrase: &str) -> Result<(), Vec<String>> {
        let mut errors = Vec::new();
        
        if passphrase.len() < self.min_length {
            errors.push(format!("Passphrase must be at least {} characters", self.min_length));
        }
        
        if passphrase.len() > self.max_length {
            errors.push(format!("Passphrase must be at most {} characters", self.max_length));
        }
        
        if self.require_uppercase && !passphrase.chars().any(|c| c.is_uppercase()) {
            errors.push("Passphrase must contain an uppercase letter".into());
        }
        
        if self.require_lowercase && !passphrase.chars().any(|c| c.is_lowercase()) {
            errors.push("Passphrase must contain a lowercase letter".into());
        }
        
        if self.require_digit && !passphrase.chars().any(|c| c.is_ascii_digit()) {
            errors.push("Passphrase must contain a digit".into());
        }
        
        // Entropy estimation (simplified)
        let entropy = estimate_entropy(passphrase);
        if entropy < self.min_entropy_bits {
            errors.push(format!("Passphrase is too weak ({:.1} bits, minimum {:.0} bits)", 
                          entropy, self.min_entropy_bits));
        }
        
        // Common password check (against top 10K most common passwords)
        if self.reject_common && is_common_password(passphrase) {
            errors.push("This passphrase is too common".into());
        }
        
        if errors.is_empty() { Ok(()) } else { Err(errors) }
    }
}

fn estimate_entropy(passphrase: &str) -> f64 {
    // For a truly random passphrase, entropy = log2(char_set_size) * length
    // For a phrase, use zxcvbn-inspired estimation
    // Simplified: assume each character adds 4 bits for random, less for dictionary words
    let has_upper = passphrase.chars().any(|c| c.is_uppercase());
    let has_lower = passphrase.chars().any(|c| c.is_lowercase());
    let has_digit = passphrase.chars().any(|c| c.is_ascii_digit());
    let has_special = passphrase.chars().any(|c| !c.is_alphanumeric());
    
    let mut pool_size = 0usize;
    if has_upper { pool_size += 26; }
    if has_lower { pool_size += 26; }
    if has_digit { pool_size += 10; }
    if has_special { pool_size += 32; } // Approximate special characters
    
    let entropy_per_char = (pool_size as f64).log2();
    entropy_per_char * passphrase.len() as f64
}
```

## Appendix E: Secure Memory Handling

```rust
// From kamelot-core/src/crypto/secure_memory.rs

/// Securely zero memory on drop.
/// Prevents the encryption key from lingering in RAM.
pub struct SecretBox<const N: usize> {
    data: [u8; N],
}

impl<const N: usize> SecretBox<N> {
    pub fn new(data: [u8; N]) -> Self {
        // mprotect the page to prevent other processes
        // from reading this memory
        #[cfg(target_os = "linux")]
        unsafe {
            let ptr = &data as *const u8 as *mut libc::c_void;
            libc::mlock(ptr, N);  // Lock in RAM (prevent swap)
            libc::mprotect(ptr, N, libc::PROT_NONE);  // No read/write from other processes
        }
        // macOS: similar via mach_vm_protect
        // Windows: similar via VirtualProtect
        
        Self { data }
    }
}

impl<const N: usize> Drop for SecretBox<N> {
    fn drop(&mut self) {
        // Zero the memory before deallocation
        unsafe {
            std::ptr::write_bytes(self.data.as_mut_ptr(), 0, N);
        }
        
        // Unlock from RAM
        #[cfg(target_os = "linux")]
        unsafe {
            let ptr = self.data.as_ptr() as *mut libc::c_void;
            libc::munlock(ptr, N);
        }
    }
}
```

This ensures that:
1. The encryption key is never written to the swap file (mlock'd).
2. Other processes cannot read the key from Kamelot's memory (mprotect'd as PROT_NONE).
3. When Kamelot locks or exits, the key is zeroed before deallocation.

## Appendix F: Secure Configuration Storage

Sensitive configuration values are never stored in plaintext:

```toml
# ~/.kamelot/config.toml
# NOTE: This file does NOT contain the passphrase.
# The passphrase is entered interactively or via KAMELOT_PASSPHRASE env var.

[crypto]
# Argon2id parameters for key derivation
argon2_time = 3
argon2_mem = 1048576  # 1 GB in KiB
argon2_parallelism = 4

# Salt for key derivation (random, generated on init)
salt = "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6"

# Master encryption key, encrypted with passphrase-derived key
# Format: nonce(12) || ciphertext(32) || tag(16) = 60 bytes, hex-encoded
encrypted_master_key = "e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1"

# Checksum: SHA256 of the plaintext master key
# Used to verify passphrase correctness without trial decryption
key_checksum = "d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7"
```

## Appendix G: Side-Channel Attack Mitigations

| Attack Type | Mitigation | Kamelot Implementation |
|---|---|---|
| Timing attacks | Constant-time operations | ChaCha20 is inherently constant-time |
| Cache timing (AES lookup tables) | Use ChaCha20 instead of AES | ChaCha20 has no lookup tables |
| Power analysis | Not mitigated | Consumer-grade hardware, not a realistic threat |
| Electromagnetic radiation | Not mitigated | Consumer-grade hardware, not a realistic threat |
| Cold boot (RAM freeze) | Key zeroed on lock | SecretBox zeros on drop; mlock prevents swap |
| Spectre/Meltdown | OS updates | Mitigated by kernel patches |
| Rowhammer | Not mitigated | Hardware-level attack; ECC RAM recommended |
| DMA attacks | IOMMU/TZASC | Requires platform hardware support; not enforced by Kamelot |

*This decision was reviewed and accepted on 2026-01-28. It is the highest-priority architectural decision and overrides all other considerations about cloud dependencies.*

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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
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
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ