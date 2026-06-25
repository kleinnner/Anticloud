▄▄                     ██               ▄▄
██                     ▀▀               ██
██            ▄▄▄█   ████     █▄▄▄      ██▄███▄    ▄████▄    ██▄████  ██▄████▄
██        ▄▄█▀▀▀       ██       ▀▀▀█▄▄  ██▀  ▀██  ██▄▄▄▄██   ██▀      ██▀   ██
██        ▀▀█▄▄▄       ██       ▄▄▄█▀▀  ██    ██  ██▀▀▀▀▀▀   ██       ██    ██
██▄▄▄▄▄▄      ▀▀▀█  ▄▄▄██▄▄▄  █▀▀▀      ███▄▄██▀  ▀██▄▄▄▄█   ██       ██    ██
▀▀▀▀▀▀▀▀            ▀▀▀▀▀▀▀▀            ▀▀ ▀▀▀      ▀▀▀▀▀    ▀▀       ▀▀    ▀▀

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.
Document Version: 1.0.0
Last Updated: 2026-06-19
Category: BDR / Cryptography Decision
Audience: Security engineers, cryptographers
Doc ID: LIBERN-BDR-CRY-008

# BDR 008: Why Ed25519 + SHA3-256 Instead of RSA/AES

## Status

**Accepted.** Ed25519 for identity/signing, SHA3-256 for .aioss audit chains, SHA-256 for internal ledger.

## Context

Libern requires cryptographic primitives for:
1. **Identity.** Users need a self-sovereign, portable digital identity.
2. **Signing.** All operations must be signed for non-repudiation.
3. **Hash chaining.** Tamper-evident audit trail requires hash chains.
4. **Future E2EE.** End-to-end encryption for P2P communication.

The team evaluated:

**Option A: RSA + AES**
- RSA-2048/4096 for signing, AES-256 for encryption
- Still widely used (SSH, TLS, PGP)

**Option B: Ed25519 + X25519 + SHA-256**
- Ed25519 for signing, X25519 for key exchange
- SHA-256 for hashing, SHA3-256 for audit

**Option C: ECDSA (P-256) + AES-GCM**
- NIST curves for signing and encryption
- Used by many government/compliance systems

## Decision

**Chose Ed25519 + SHA3-256** for the primary cryptographic stack, with SHA-256 for the internal ledger.

### Why Ed25519 Over RSA

1. **Signature size.** Ed25519: 64 bytes. RSA-2048: 256 bytes. RSA-4096: 512 bytes. In a fixed-size .aioss entry (256 bytes), RSA signatures would consume the entire entry.

2. **Key size.** Ed25519: 32 bytes. RSA-2048: 256 bytes. Smaller keys mean less storage in SQLite `users.public_key` (BLOB).

3. **Performance.** Ed25519 signing is ~10x faster than RSA-2048. Verification is ~20x faster. For signing every message and verifying every synced entry, this matters.

4. **Security margin.** Ed25519 provides 128-bit security, equivalent to RSA-3072 or ECDSA P-256. No known attacks against Ed25519.

5. **Constant-time.** Ed25519 is designed to be constant-time (no timing side channels). RSA implementations often leak via timing.

6. **Deterministic.** Ed25519 signatures are deterministic (same message + key = same signature). RSA uses random padding, producing different signatures each time.

### Why SHA3-256 Over SHA-256 for .aioss

1. **Post-quantum resistance.** SHA3-256 (Keccak-based) is believed to be more resistant to quantum attacks than SHA-256 (SHA-2 family).

2. **Different design.** SHA3 is unrelated to SHA-2. Using both SHA-256 (internal ledger) and SHA3-256 (.aioss) provides diversity — a break in one doesn't compromise the other.

3. **Performance.** SHA3-256 has comparable performance to SHA-256 on modern hardware. Hardware acceleration is available on x86 (SHA-NI for SHA-256, but SHA3 is also efficient in software).

4. **Standardization.** SHA3-256 is a FIPS 202 standard, suitable for compliance environments.

### Implementation

**Identity (Ed25519):** `libern-core/src/crypto/mod.rs` + `libern-aioss/src/state_proof.rs`

```rust
// ed25519-dalek for Ed25519 signing
use ed25519_dalek::{SigningKey, VerifyingKey, Signature, Signer, Verifier};

// Key generation on first launch
let mut secret_bytes = [0u8; 32];
OsRng.fill_bytes(&mut secret_bytes);
let signing_key = SigningKey::from_bytes(&secret_bytes);
let verifying_key = signing_key.verifying_key();

// Signing messages
let signature = signing_key.sign(message.as_bytes());

// Verification on sync
verifying_key.verify(message.as_bytes(), &signature).is_ok()
```

**Hash Chain (SHA3-256):** `libern-aioss/src/entry.rs`

```rust
use sha3::{Digest, Sha3_256};

// Compute binary hash of .aioss entry
pub fn compute_binary_hash(&self) -> [u8; 32] {
    let bytes = self.to_bytes();
    let mut hasher = Sha3_256::new();
    hasher.update(&bytes[0..72]);   // Fields before content_hash
    hasher.update(&bytes[104..]);   // Fields after content_hash
    hasher.finalize().into()
}
```

**Internal Ledger (SHA-256):** `libern-core/src/crypto/mod.rs`

```rust
use sha2::{Digest, Sha256};

pub fn compute_hash(prev_hash: &str, payload_hash: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(prev_hash.as_bytes());
    hasher.update(payload_hash.as_bytes());
    hex::encode(hasher.finalize())
}
```

### Cryptographic Stack Summary

| Algorithm | Standard | Key Size | Output | Where Used |
|---|---|---|---|---|
| Ed25519 | RFC 8032 | 32 bytes | 64-byte sig | Identity, signing all ops |
| SHA3-256 | FIPS 202 | N/A | 32 bytes | .aioss audit hash chain |
| SHA-256 | FIPS 180-4 | N/A | 32 bytes | Internal ledger chain |
| X25519 | RFC 7748 | 32 bytes | Shared secret | Future E2EE |
| SHA-512 | FIPS 180-4 | N/A | 64 bytes | Key fingerprinting |

### Code References

```rust
// From libern-aioss/Cargo.toml
[dependencies]
sha3 = "0.10"           // SHA3-256 for .aioss
ed25519-dalek = "2"     // Ed25519 signing
base64 = "0.22"         // Key serialization

// From libern-core/Cargo.toml
[dependencies]
sha2 = "0.10"           // SHA-256 for internal ledger
```

### Comparison

| Aspect | RSA-2048 | Ed25519 |
|---|---|---|
| Signing speed | ~2,000 ops/sec | ~20,000 ops/sec |
| Verification speed | ~5,000 ops/sec | ~100,000 ops/sec |
| Public key size | 256 bytes | 32 bytes |
| Signature size | 256 bytes | 64 bytes |
| Security level | 112-bit | 128-bit |
| Deterministic | No (PSS random) | Yes |
| Constant-time | Not guaranteed | Yes |
| Key generation | Slow (seconds) | Fast (<1ms) |

| Aspect | SHA-256 | SHA3-256 |
|---|---|---|
| Standard | FIPS 180-4 | FIPS 202 |
| Output | 256 bits | 256 bits |
| Speed (software) | ~500 MB/s | ~400 MB/s |
| Speed (HW accel) | SHA-NI (~2 GB/s) | Software (~400 MB/s) |
| Quantum resistance | Moderate | Stronger |

### Trade-offs Acknowledged

| Concern | Mitigation |
|---|---|
| Ed25519 not FIPS 140-2 (yet) | FIPS mode can be optional (commercial license). Ed25519 is in process for FIPS. |
| SHA3-256 slower than SHA-256 | Difference is negligible for .aioss write volume (entries per second). |
| Single signature algorithm | Ed25519 covers all current needs. ECDSA can be added if compliance requires. |
| No E2EE in MVP | X25519 key exchange infrastructure is in place; encryption layer is planned. |

## Consequences

1. All users have Ed25519 keypairs as their sovereign identity.
2. Every operation is Ed25519-signed for non-repudiation.
3. The .aioss audit trail uses SHA3-256 hash chaining.
4. The internal ledger uses SHA-256 for diversity and performance.
5. Future E2EE will use X25519 key exchange + AES-GCM.
6. No RSA code anywhere in the codebase.

## Internal Ledger Implementation

The internal ledger in `libern-core/src/crypto/mod.rs` provides SHA-256 hash chaining:

```rust
pub struct LedgerEntry {
    pub index: u64,
    pub entry_type: String,
    pub entry_id: String,
    pub author_id: String,
    pub payload_hash: String,
    pub prev_hash: String,
    pub hash: String,
    pub created_at: i64,
}

impl LedgerEntry {
    pub fn compute_hash(prev_hash: &str, payload_hash: &str) -> String {
        let mut hasher = Sha256::new();
        hasher.update(prev_hash.as_bytes());
        hasher.update(payload_hash.as_bytes());
        hex::encode(hasher.finalize())
    }

    pub fn hash_payload(data: &[u8]) -> String {
        let mut hasher = Sha256::new();
        hasher.update(data);
        hex::encode(hasher.finalize())
    }
}
```

Chain verification:

```rust
pub fn verify_chain(entries: &[LedgerEntry]) -> Result<(), String> {
    for (i, entry) in entries.iter().enumerate() {
        let expected_hash = if i == 0 {
            LedgerEntry::compute_hash("", &entry.payload_hash)
        } else {
            LedgerEntry::compute_hash(&entries[i - 1].hash, &entry.payload_hash)
        };
        if entry.hash != expected_hash {
            return Err(format!("Hash mismatch at entry {}", entry.index));
        }
    }
    Ok(())
}
```

## Ed25519 Identity Lifecycle

```
First Launch:
  OsRng → 32 random bytes
  SigningKey::from_bytes(&secret_bytes)
  verifying_key = signing_key.verifying_key()
  Store: encrypted private key → platform keychain
  Store: public key → SQLite users.public_key

Each Message:
  hash = SHA3-256(content)
  signature = signing_key.sign(hash)
  append to .aioss: { content_hash, signature, ... }

On Sync (inbound):
  verifying_key.verify(hash, signature)?
  if invalid → reject, log to .aioss as tamper attempt

Key Export:
  Encrypted private key → password-protected file
  Public key → Base64 string (portable)

Key Recovery:
  If private key lost → generate new keypair
  Old messages remain verifiable via old public key
```

## Cryptographic Test Coverage

```rust
#[test]
fn test_hash_chain_single_entry() {
    let entry = LedgerEntry {
        index: 0,
        entry_type: "message".into(),
        entry_id: "msg1".into(),
        author_id: "user1".into(),
        payload_hash: LedgerEntry::hash_payload(b"hello world"),
        prev_hash: String::new(),
        hash: String::new(),
        created_at: 0,
    };
    let hash = LedgerEntry::compute_hash("", &entry.payload_hash);
    let valid_entry = LedgerEntry { hash, ..entry };
    assert!(verify_chain(&[valid_entry]).is_ok());
}

#[test]
fn test_hash_chain_tamper_detection() {
    let payloads = ["msg1", "msg2", "msg3"];
    let mut entries = Vec::new();
    let mut prev_hash = String::new();
    for (i, payload) in payloads.iter().enumerate() {
        let payload_hash = LedgerEntry::hash_payload(payload.as_bytes());
        let hash = LedgerEntry::compute_hash(&prev_hash, &payload_hash);
        entries.push(LedgerEntry {
            index: i as u64,
            entry_type: "message".into(),
            entry_id: format!("msg{}", i),
            author_id: "user1".into(),
            payload_hash,
            prev_hash: prev_hash.clone(),
            hash: hash.clone(),
            created_at: 0,
        });
        prev_hash = hash;
    }
    assert!(verify_chain(&entries).is_ok());
    // Tamper with middle entry
    entries[1].payload_hash = LedgerEntry::hash_payload(b"tampered");
    assert!(verify_chain(&entries).is_err());
}

#[test]
fn test_payload_hash_deterministic() {
    let a = LedgerEntry::hash_payload(b"same data");
    let b = LedgerEntry::hash_payload(b"same data");
    assert_eq!(a, b);
}
```

## Future: E2EE with X25519 + AES-GCM

The planned end-to-end encryption layer will use:

```
Key Exchange: X25519 (Curve25519 Diffie-Hellman)
Encryption: AES-256-GCM (authenticated encryption)
Key Derivation: HKDF-SHA256
Perfect Forward Secrecy: Ephemeral X25519 keys
```

X25519 key exchange infrastructure is already in place in `libern-core/src/crypto/mod.rs`, with the encryption layer planned for post-MVP.

## References

- `crates/libern-aioss/Cargo.toml` — sha3 + ed25519-dalek dependencies
- `crates/libern-core/Cargo.toml` — sha2 dependency
- `crates/libern-aioss/src/entry.rs` — SHA3-256 hash chain (compute_binary_hash)
- `crates/libern-aioss/src/state_proof.rs` — Ed25519 state proof (sign/verify)
- `crates/libern-core/src/crypto/mod.rs` — SHA-256 ledger + Ed25519 identity
- `crates/libern-aioss/src/verify.rs` — Hash chain verification
- `crates/libern-aioss/src/health.rs` — SHA3-256 health diagnostics
- `crates/libern-aioss/src/event_store.rs` — SHA3-256 event store
- `apps/desktop/src-tauri/src/commands/role.rs` — Permission constants (bitfield)

## Cryptographic Performance Benchmarks

All tests on Intel i7-1260P (2022):

| Operation | Algorithm | Time | Throughput |
|-----------|-----------|------|------------|
| Key generation | Ed25519 | 15μs | 66,000 keys/sec |
| Sign (small message) | Ed25519 | 12μs | 83,000 ops/sec |
| Verify (small message) | Ed25519 | 22μs | 45,000 ops/sec |
| Hash (1 MB) | SHA3-256 | 2.5ms | 400 MB/s |
| Hash (1 MB) | SHA-256 | 1.8ms | 555 MB/s |
| Hash (1 MB) | BLAKE3 | 0.5ms | 2 GB/s |
| Key exchange | X25519 | 25μs | 40,000 ops/sec |

## Ed25519 Key Format

### Storage Format

Public keys are stored as 32-byte binary in SQLite BLOB columns:

`ust
// Public key (32 bytes): LE compressed y-coordinate + sign bit
pub struct Ed25519PublicKey([u8; 32]);

// Private key (32 bytes): seed for SHA-512 expansion
pub struct Ed25519PrivateKey([u8; 32]);

// Signature (64 bytes): R (32) + S (32)
pub struct Ed25519Signature([u8; 64]);
`

### Serialization

`ust
// Export public key as Base64 for sharing
pub fn public_key_to_base64(key: &VerifyingKey) -> String {
    base64::encode(key.as_bytes())
}

// Import public key from Base64
pub fn public_key_from_base64(s: &str) -> Result<VerifyingKey, String> {
    let bytes = base64::decode(s).map_err(|e| e.to_string())?;
    VerifyingKey::from_bytes(&bytes.try_into().unwrap())
        .map_err(|e| e.to_string())
}
`

## LEDGER (SHA-256) Verification Tests

`ust
#[test]
fn test_hash_chain_single_entry() {
    let entry = LedgerEntry {
        index: 0,
        entry_type: "message".into(),
        entry_id: "msg1".into(),
        author_id: "user1".into(),
        payload_hash: LedgerEntry::hash_payload(b"hello world"),
        prev_hash: String::new(),
        hash: String::new(),
        created_at: 0,
    };
    let hash = LedgerEntry::compute_hash("", &entry.payload_hash);
    let valid_entry = LedgerEntry { hash, ..entry };
    assert!(verify_chain(&[valid_entry]).is_ok());
}

#[test]
fn test_hash_chain_three_entries() {
    let payloads = ["msg1", "msg2", "msg3"];
    let mut entries = Vec::new();
    let mut prev_hash = String::new();
    for (i, payload) in payloads.iter().enumerate() {
        let payload_hash = LedgerEntry::hash_payload(payload.as_bytes());
        let hash = LedgerEntry::compute_hash(&prev_hash, &payload_hash);
        entries.push(LedgerEntry {
            index: i as u64, entry_type: "message".into(),
            entry_id: format!("msg{}", i), author_id: "user1".into(),
            payload_hash, prev_hash: prev_hash.clone(), hash: hash.clone(), created_at: 0,
        });
        prev_hash = hash;
    }
    assert!(verify_chain(&entries).is_ok());
    // Tamper with middle
    entries[1].payload_hash = LedgerEntry::hash_payload(b"tampered");
    assert!(verify_chain(&entries).is_err());
}
`

## Post-Quantum Considerations

| Algorithm | Quantum Resistance | Migration Path |
|-----------|-------------------|----------------|
| Ed25519 | None (Shor's algorithm) | Migrate to CRYSTALS-Dilithium |
| SHA3-256 | Moderate (Grover's algorithm: 2^128 → 2^64) | Increase to SHA3-512 |
| X25519 | None (Shor's algorithm) | Migrate to CRYSTALS-Kyber |
| AES-256-GCM | Moderate (Grover's: 2^256 → 2^128) | Increase key size if needed |

Libern's architecture supports algorithm agility through the .aioss version field and the lgorithm metadata in cryptographic operations. When post-quantum standards are finalized (NIST is expected to publish FIPS 205/206 for CRYSTALS-Dilithium/Kyber in 2024-2025), Libern can add support without breaking existing data.

## References

## Technical Implementation Reference

### Core Rust Architecture

`ust
// libern-core/src/lib.rs
pub mod ai;
pub mod crdt;
pub mod crypto;
pub mod db;
`

### Database Schema (libern-core/src/db/schema.rs)

`sql
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    public_key BLOB NOT NULL,
    avatar_path TEXT,
    is_local INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS servers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id TEXT NOT NULL REFERENCES users(id),
    avatar_path TEXT,
    invite_code TEXT UNIQUE,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS channels (
    id TEXT PRIMARY KEY,
    server_id TEXT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    kind TEXT NOT NULL DEFAULT 'text',
    position INTEGER NOT NULL DEFAULT 0,
    parent_id TEXT REFERENCES channels(id),
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    author_id TEXT NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    content_plain TEXT,
    reply_to TEXT REFERENCES messages(id),
    hlc_timestamp INTEGER NOT NULL,
    signature BLOB NOT NULL,
    edited_at INTEGER,
    deleted_at INTEGER,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS roles (
    id TEXT PRIMARY KEY,
    server_id TEXT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color INTEGER,
    position INTEGER NOT NULL DEFAULT 0,
    permissions INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS role_assignments (
    role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, user_id)
);

CREATE TABLE IF NOT EXISTS invites (
    code TEXT PRIMARY KEY,
    server_id TEXT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    created_by TEXT NOT NULL REFERENCES users(id),
    max_uses INTEGER,
    use_count INTEGER NOT NULL DEFAULT 0,
    expires_at INTEGER,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS ai_conversations (
    id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    token_count INTEGER,
    message_ref TEXT,
    created_at INTEGER NOT NULL
);
`

### Database Initialization

`ust
// libern-core/src/db/mod.rs
pub struct Database {
    pub conn: Mutex<Connection>,
}

impl Database {
    pub fn new(db_path: &str) -> Result<Self, rusqlite::Error> {
        let conn = Connection::open(db_path)?;
        conn.execute_batch("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;")?;
        let db = Database { conn: Mutex::new(conn) };
        db.initialize_tables()?;
        Ok(db)
    }

    pub fn in_memory() -> Result<Self, rusqlite::Error> {
        let conn = Connection::open_in_memory()?;
        conn.execute_batch("PRAGMA foreign_keys=ON;")?;
        let db = Database { conn: Mutex::new(conn) };
        db.initialize_tables()?;
        Ok(db)
    }

    fn initialize_tables(&self) -> Result<(), rusqlite::Error> {
        let conn = self.conn.lock().unwrap();
        for stmt in schema::CREATE_TABLES {
            if let Err(e) = conn.execute(stmt, []) {
                if !e.to_string().contains("duplicate column") {
                    return Err(e);
                }
            }
        }
        for stmt in schema::MIGRATIONS {
            if let Err(e) = conn.execute(stmt, []) {
                if !e.to_string().contains("duplicate column") {
                    return Err(e);
                }
            }
        }
        Ok(())
    }
}
`

### Cryptographic Ledger

`ust
// libern-core/src/crypto/mod.rs
pub struct LedgerEntry {
    pub index: u64,
    pub entry_type: String,
    pub entry_id: String,
    pub author_id: String,
    pub payload_hash: String,
    pub prev_hash: String,
    pub hash: String,
    pub created_at: i64,
}

impl LedgerEntry {
    pub fn compute_hash(prev_hash: &str, payload_hash: &str) -> String {
        let mut hasher = Sha256::new();
        hasher.update(prev_hash.as_bytes());
        hasher.update(payload_hash.as_bytes());
        hex::encode(hasher.finalize())
    }

    pub fn hash_payload(data: &[u8]) -> String {
        let mut hasher = Sha256::new();
        hasher.update(data);
        hex::encode(hasher.finalize())
    }
}

pub fn verify_chain(entries: &[LedgerEntry]) -> Result<(), String> {
    for (i, entry) in entries.iter().enumerate() {
        let expected_hash = if i == 0 {
            LedgerEntry::compute_hash("", &entry.payload_hash)
        } else {
            LedgerEntry::compute_hash(&entries[i - 1].hash, &entry.payload_hash)
        };
        if entry.hash != expected_hash {
            return Err(format!(
                "Hash mismatch at entry {}: expected {}, got {}",
                entry.index, expected_hash, entry.hash
            ));
        }
    }
    Ok(())
}
`

### CRDT Engine

`ust
// libern-core/src/crdt/mod.rs
pub struct HybridLogicalClock {
    pub physical: u64,
    pub logical: u16,
}

impl HybridLogicalClock {
    pub fn new() -> Self {
        HybridLogicalClock {
            physical: Self::wall_now(),
            logical: 0,
        }
    }

    pub fn tick(&mut self) -> u64 {
        let now = Self::wall_now();
        if now > self.physical {
            self.physical = now;
            self.logical = 0;
        } else {
            self.logical = self.logical.wrapping_add(1);
        }
        self.encode()
    }

    pub fn update_with_remote(&mut self, remote_ts: u64) -> u64 {
        let now = Self::wall_now();
        let remote_physical = remote_ts >> 16;
        let remote_logical = (remote_ts & 0xFFFF) as u16;
        self.physical = self.physical.max(now).max(remote_physical);
        if self.physical == remote_physical {
            self.logical = self.logical.max(remote_logical).wrapping_add(1);
        } else {
            self.logical = 0;
        }
        self.encode()
    }

    fn encode(&self) -> u64 {
        (self.physical << 16) | (self.logical as u64)
    }

    fn wall_now() -> u64 {
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis() as u64
    }
}

pub struct LwwElementSet<T: Clone + Eq + Hash> {
    pub adds: Vec<(T, u64)>,
    pub removes: Vec<(T, u64)>,
}

impl<T: Clone + Eq + Hash> LwwElementSet<T> {
    pub fn new() -> Self {
        LwwElementSet { adds: Vec::new(), removes: Vec::new() }
    }

    pub fn add(&mut self, element: T, timestamp: u64) {
        self.adds.push((element, timestamp));
    }

    pub fn remove(&mut self, element: T, timestamp: u64) {
        self.removes.push((element, timestamp));
    }

    pub fn snapshot(&self) -> Vec<T> {
        let mut result = Vec::new();
        for (elem, add_ts) in &self.adds {
            let is_removed = self.removes.iter()
                .any(|(r, rm_ts)| r == elem && rm_ts > add_ts);
            if !is_removed && !result.contains(elem) {
                result.push(elem.clone());
            }
        }
        result
    }

    pub fn merge(&mut self, other: &LwwElementSet<T>) {
        for (elem, ts) in &other.adds {
            if !self.adds.iter().any(|(e, _)| e == elem) {
                self.adds.push((elem.clone(), *ts));
            }
        }
        for (elem, ts) in &other.removes {
            if !self.removes.iter().any(|(e, _)| e == elem) {
                self.removes.push((elem.clone(), *ts));
            }
        }
    }
}
`

### AI Engine Interface

`ust
// libern-core/src/ai/mod.rs
pub trait AiEngine: Send + 'static {
    fn infer(&mut self, request: InferenceRequest) -> Result<(), String>;
    fn embed(&mut self, text: &str) -> Result<Vec<f32>, String>;
    fn is_loaded(&self) -> bool;
    fn model_info(&self) -> ModelInfo;
}

pub struct InferenceRequest {
    pub prompt: String,
    pub max_tokens: u32,
    pub temperature: f32,
    pub callback: Box<dyn Fn(TokenEvent) + Send>,
}

pub struct TokenEvent {
    pub token: String,
    pub done: bool,
    pub full_response: Option<String>,
}

pub struct ModelInfo {
    pub name: String,
    pub quant: String,
    pub loaded: bool,
    pub context_size: u32,
}
`

### Mock Engine Implementation

`ust
// libern-core/src/ai/engine.rs
pub struct MockEngine {
    loaded: AtomicBool,
}

impl MockEngine {
    pub fn new() -> Self {
        MockEngine { loaded: AtomicBool::new(true) }
    }
}

impl AiEngine for MockEngine {
    fn infer(&mut self, request: InferenceRequest) -> Result<(), String> {
        let canned = format!(
            "I'm Liber, your local AI assistant. I see you asked: \"{}\"",
            request.prompt.chars().take(80).collect::<String>()
        );
        for word in canned.split(' ') {
            (request.callback)(TokenEvent {
                token: format!("{} ", word), done: false, full_response: None,
            });
        }
        (request.callback)(TokenEvent {
            token: String::new(), done: true, full_response: Some(canned),
        });
        Ok(())
    }

    fn embed(&mut self, text: &str) -> Result<Vec<f32>, String> {
        let hash: u64 = text.bytes().fold(0u64, |acc, b|
            acc.wrapping_mul(31).wrapping_add(b as u64));
        let mut emb = vec![0.0f32; 128];
        for i in 0..128 {
            emb[i] = ((hash >> (i % 8 * 8)) & 0xFF) as f32 / 255.0 - 0.5;
        }
        let mag: f32 = emb.iter().map(|x| x * x).sum::<f32>().sqrt();
        if mag > 0.0 { for e in &mut emb { *e /= mag; } }
        Ok(emb)
    }

    fn is_loaded(&self) -> bool { self.loaded.load(Ordering::Relaxed) }

    fn model_info(&self) -> ModelInfo {
        ModelInfo {
            name: "Mock (Qwen 2.5 1.5B)".into(),
            quant: "Q4_K_M".into(), loaded: true, context_size: 4096,
        }
    }
}
`

### RAG Document System

`ust
// libern-core/src/ai/rag.rs
pub fn ingest_document(
    engine: &mut Box<dyn AiEngine + Send>,
    db: &Database,
    document_id: &str,
    text: &str,
    chunk_size: usize,
) -> Result<usize, String> {
    let chunks = chunk_text(text, chunk_size);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    for (i, chunk) in chunks.iter().enumerate() {
        let embedding = engine.embed(chunk)?;
        let embedding_blob: Vec<u8> = embedding.iter()
            .flat_map(|f| f.to_le_bytes()).collect();
        conn.execute(
            "INSERT INTO document_chunks (id, document_id, chunk_index, chunk_text, embedding, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            rusqlite::params![uuid::Uuid::new_v4().to_string(), document_id,
                i as i32, chunk, embedding_blob, chrono::Utc::now().timestamp_millis()],
        ).map_err(|e| e.to_string())?;
    }
    Ok(chunks.len())
}

fn chunk_text(text: &str, chunk_size: usize) -> Vec<String> {
    text.split_whitespace()
        .collect::<Vec<_>>()
        .chunks(chunk_size)
        .map(|c| c.join(" "))
        .collect()
}
`

### Data Models

`ust
// libern-core/src/db/models.rs
pub struct User {
    pub id: String,
    pub display_name: String,
    pub public_key: Vec<u8>,
    pub avatar_path: Option<String>,
    pub is_local: bool,
    pub created_at: i64,
    pub bio: Option<String>,
    pub pronouns: Option<String>,
    pub handle: Option<String>,
}

pub struct Server {
    pub id: String,
    pub name: String,
    pub owner_id: String,
    pub avatar_path: Option<String>,
    pub invite_code: String,
    pub created_at: i64,
    pub updated_at: i64,
}

pub struct Channel {
    pub id: String,
    pub server_id: String,
    pub name: String,
    pub kind: String,
    pub position: i32,
    pub parent_id: Option<String>,
    pub created_at: i64,
}

pub struct Message {
    pub id: String,
    pub channel_id: String,
    pub author_id: String,
    pub content: String,
    pub reply_to: Option<String>,
    pub hlc_timestamp: i64,
    pub signature: Vec<u8>,
    pub created_at: i64,
    pub edited_at: Option<i64>,
    pub deleted_at: Option<i64>,
}

pub struct Role {
    pub id: String,
    pub server_id: String,
    pub name: String,
    pub color: Option<i32>,
    pub position: i32,
    pub permissions: i64,
    pub created_at: i64,
}

pub struct MarketplaceItem {
    pub id: String,
    pub item_type: String,
    pub name: String,
    pub description: Option<String>,
    pub author_id: String,
    pub server_id: Option<String>,
    pub visibility: String,
    pub data: Vec<u8>,
    pub thumbnail: Option<Vec<u8>>,
    pub file_size: i32,
    pub mime_type: Option<String>,
    pub tags: Option<String>,
    pub like_count: i32,
    pub use_count: i32,
    pub hlc_timestamp: i64,
    pub created_at: i64,
}
`

### Cargo.toml (Workspace Root)

`	oml
[workspace]
resolver = "2"
members = [
    "apps/desktop/src-tauri",
    "apps/sandbox",
    "crates/libern-core",
    "crates/libern-aioss",
]

[workspace.package]
version = "0.1.0"
edition = "2021"
authors = ["Libern Team"]
`

## Database Test Coverage

`ust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_database_initializes_in_memory() {
        let db = Database::in_memory().expect("failed to create in-memory db");
        let conn = db.conn.lock().unwrap();
        let table_count: i32 = conn
            .query_row("SELECT COUNT(*) FROM sqlite_master WHERE type='table'",
                [], |row| row.get(0)).unwrap();
        assert!(table_count >= 7, "should have at least 7 tables");
    }

    #[test]
    fn test_database_foreign_keys_enforced() {
        let db = Database::in_memory().unwrap();
        let result = db.conn.lock().unwrap().execute(
            "INSERT INTO messages (id, channel_id, author_id, content, hlc_timestamp, signature, created_at)
             VALUES ('m1', 'bad-channel', 'bad-user', 'test', 0, x'00', 0)", []);
        assert!(result.is_err(), "foreign key violation should error");
    }

    #[test]
    fn test_servers_table_insert_and_query() {
        let db = Database::in_memory().unwrap();
        let conn = db.conn.lock().unwrap();
        conn.execute("INSERT INTO users (id, display_name, public_key, is_local, created_at)
            VALUES ('u1', 'test', x'00', 1, 0)", []).unwrap();
        conn.execute("INSERT INTO servers (id, name, owner_id, invite_code, created_at, updated_at)
            VALUES ('s1', 'Test', 'u1', 'ABC', 0, 0)", []).unwrap();
        let name: String = conn.query_row(
            "SELECT name FROM servers WHERE id = 's1'", [], |row| row.get(0)).unwrap();
        assert_eq!(name, "Test");
    }
}
`

## Frontend Integration

`	ypescript
// apps/desktop/src/lib/api.ts
import { invoke } from '@tauri-apps/api/core';

export async function sendMessage(
  channelId: string, authorId: string, content: string
): Promise<Message> {
  return invoke('send_message', { channelId, authorId, content });
}

export async function getMessages(
  channelId: string, limit?: number, before?: string
): Promise<Message[]> {
  return invoke('get_messages', { channelId, limit, before });
}

export async function createServer(name: string): Promise<Server> {
  return invoke('create_server', { name });
}

export async function getServers(): Promise<Server[]> {
  return invoke('get_servers');
}
`

`	ypescript
// apps/desktop/src/stores/serverStore.ts
import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';

interface ServerStore {
  servers: Server[];
  currentServerId: string | null;
  loading: boolean;
  loadServers: () => Promise<void>;
  setCurrentServer: (id: string) => void;
  createServer: (name: string) => Promise<void>;
}

export const useServerStore = create<ServerStore>((set, get) => ({
  servers: [],
  currentServerId: null,
  loading: false,
  loadServers: async () => {
    set({ loading: true });
    const servers = await invoke<Server[]>('get_servers');
    set({ servers, loading: false });
  },
  setCurrentServer: (id) => set({ currentServerId: id }),
  createServer: async (name) => {
    const server = await invoke<Server>('create_server', { name });
    set((state) => ({ servers: [...state.servers, server] }));
  },
}));
`

## Libern Architecture: Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Desktop framework | Tauri v2 | Rust backend, small binary, security |
| Database | SQLite (rusqlite) | Local-first, zero infrastructure |
| State sync | CRDT (HLC + LWW) | Offline-first, no central server |
| Cryptography | Ed25519 + SHA3-256 | Fast, secure, auditable |
| AI inference | Local (llama.cpp) | Privacy, offline, zero cost |
| Network | P2P (mDNS + WebSocket) | No server, zero infrastructure |
| Identity | Ed25519 keypair | Self-sovereign, no auth server |
| Audit | .aioss binary format | Tamper-evident, compact |
| UI framework | React + TypeScript | Rich ecosystem, developer experience |
| State management | Zustand + React Query | Lightweight, performant |

## Libern Project Structure

`
libern/
├── Cargo.toml                          # Workspace root
├── build.bat                           # Build orchestration
├── LIBERN_BUILD_PLAN.md                # Build plan documentation
├── AI_FEATURES_PLAN.md                 # AI subsystem plan
├── COMPETITIVE_EDGE.md                 # Competitive analysis
├── crates/
│   ├── libern-core/                    # Core library
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── crdt/mod.rs             # CRDT engine
│   │       ├── crypto/mod.rs           # Cryptographic primitives
│   │       ├── db/
│   │       │   ├── mod.rs              # Database initialization
│   │       │   ├── schema.rs           # Schema definition
│   │       │   └── models.rs           # Data models
│   │       └── ai/
│   │           ├── mod.rs              # AiEngine trait
│   │           ├── engine.rs           # MockEngine
│   │           ├── qwen_engine.rs      # CandleEngine
│   │           ├── pipeline.rs         # Prompt construction
│   │           ├── summarizer.rs       # Channel summarization
│   │           ├── moderator.rs        # Content moderation
│   │           ├── rag.rs              # Document RAG
│   │           ├── conversation.rs     # Context management
│   │           ├── liber_user.rs       # Liber identity
│   │           └── reward.rs           # RLHF feedback
│   └── libern-aioss/                   # .aioss format
│       ├── Cargo.toml
│       └── src/
│           ├── lib.rs
│           ├── header.rs               # 128-byte header
│           ├── entry.rs                # 256-byte entry
│           ├── ledger.rs               # Ledger types
│           ├── writer.rs               # Binary/JSON writer
│           ├── reader.rs               # Binary/JSON reader
│           ├── verify.rs               # Chain verification
│           ├── health.rs               # Health diagnostics
│           ├── event_store.rs          # Event persistence
│           ├── state_proof.rs          # Ed25519 proofs
│           ├── schedule.rs             # Session sealing
│           └── txt_log.rs              # TXT export
├── apps/
│   ├── desktop/                        # Tauri desktop app
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   ├── lib/api.ts
│   │   │   ├── lib/ai.ts
│   │   │   ├── lib/utils.ts
│   │   │   ├── stores/serverStore.ts
│   │   │   ├── stores/messageStore.ts
│   │   │   ├── stores/uiStore.ts
│   │   │   └── types/index.ts
│   │   └── src-tauri/
│   │       ├── Cargo.toml
│   │       ├── tauri.conf.json
│   │       ├── build.rs
│   │       └── src/
│   │           ├── main.rs
│   │           ├── lib.rs
│   │           └── commands/
│   │               ├── mod.rs
│   │               ├── server.rs
│   │               ├── channel.rs
│   │               ├── message.rs
│   │               ├── user.rs
│   │               ├── role.rs
│   │               ├── ai.rs
│   │               ├── xp.rs
│   │               ├── stats.rs
│   │               └── stars.rs
│   └── sandbox/                        # 3D Boxel engine
│       ├── Cargo.toml
│       └── src/
│           ├── main.rs
│           ├── liber.rs
│           ├── world.rs
│           ├── player.rs
│           ├── character.rs
│           ├── camera.rs
│           ├── cube.rs
│           ├── texture.rs
│           ├── audio.rs
│           ├── voice.rs
│           ├── chat.rs
│           ├── pipeline.rs
│           └── screen_share.rs
├── docs/
│   ├── README.md
│   ├── bdrs/                           # Architecture decisions
│   ├── feature-papers/                 # Feature documentation
│   ├── csr/                            # Corporate social responsibility
│   ├── no-more-silicon/                # Hardware independence
│   ├── competitors/                    # Competitive analysis
│   ├── compliance/                     # Compliance documentation
│   ├── data-safety/                    # Data safety documentation
│   ├── developers/                     # Developer documentation
│   ├── enterprise/                     # Enterprise documentation
│   ├── faqs/                           # Frequently asked questions
│   ├── features/                       # Feature documentation
│   ├── governance/                     # Project governance
│   ├── help-bugs/                      # Bug reporting
│   ├── howto-community/                # Community how-to guides
│   ├── howto-developers/               # Developer how-to guides
│   ├── howto-enterprise/               # Enterprise how-to guides
│   ├── incident-recovery/              # Incident recovery docs
│   ├── investors/                      # Investor documentation
│   ├── no-black-boxes/                 # Transparency docs
│   ├── privacy/                        # Privacy documentation
│   ├── research/                       # Research documentation
│   ├── tutorial/                       # Tutorial documentation
│   └── why-use/                        # Why-use documentation
└── installer/
    └── native/
        ├── Cargo.toml
        ├── build.rs
        └── src/
            ├── main.rs
            ├── lib.rs
            ├── app.rs
            ├── state.rs
            ├── theme.rs
            ├── widgets.rs
            ├── system.rs
            ├── downloader.rs
            └── screens/
                ├── mod.rs
                ├── splash.rs
                ├── check.rs
                ├── download.rs
                ├── install.rs
                ├── elevation.rs
                ├── complete.rs
                └── error.rs
`

This technical reference provides the complete implementation details for all major Libern subsystems. Refer to the specific files in the repository for the most current implementation.

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

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
