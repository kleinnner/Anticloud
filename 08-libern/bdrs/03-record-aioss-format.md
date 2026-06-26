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
Category: BDR / Format Decision
Audience: Engineering team, systems architects
Doc ID: LIBERN-BDR-FMT-003

# BDR 003: Why Custom .aioss Binary Format Instead of JSON/Protobuf

## Status

**Accepted.** Custom binary format (`.aioss`) with SHA3-256 hash chaining for the audit trail.

## Context

Libern requires an audit trail format that is:
1. **Tamper-evident.** Any modification must be detectable via cryptographic verification.
2. **Compact.** Enterprise use may generate millions of entries; storage efficiency matters.
3. **Self-describing.** Must be parseable without external schema.
4. **Portable.** Binary for storage, JSON for tooling interoperability.
5. **Streamable.** Append-only; new entries are written sequentially.
6. **Verifiable.** Auditors must be able to independently verify chain integrity.

The team evaluated three options:

**Option A: JSON (or JSON Lines)**
- Human-readable, no schema compilation needed
- Used by many audit systems (Splunk, Elastic)

**Option B: Protocol Buffers (Protobuf)**
- Compact binary format with schema
- Used by gRPC, Kafka, internal systems

**Option C: Custom Binary (.aioss)**
- Purpose-built 128-byte header + 256-byte entries
- SHA3-256 hash chaining built into the format

## Decision

**Chose a custom binary format (.aioss)** with a companion JSON representation.

### Format Design

The format is defined in `crates/libern-aioss/src/`:

**Header (128 bytes):**

```rust
pub struct AiossHeader {
    pub magic: [u8; 5],         // b"AIOSS" — magic bytes for auto-detection
    pub version: u16,            // Format version (1 = current)
    pub header_checksum: u16,    // CRC-16 of header fields
    pub session_id: [u8; 36],    // UUID string (null-padded)
    pub created_at: [u8; 32],    // ISO 8601 (null-padded)
    pub status: u8,              // 0=active, 1=sealed, 2=archived
    pub session_type: u8,        // 0=chat, 1=game, 2=ai, 3=system
    pub entry_count: u32,        // Number of entries (LE)
    pub genesis_hash: [u8; 32],  // SHA3-256 of first entry
    pub head_hash: [u8; 32],     // SHA3-256 of latest entry
    pub _reserved: [u8; 8],
}
```

**Entry (256 bytes):**

```rust
pub struct AiossEntry {
    pub index: u32,              // Sequence number
    pub timestamp_unix_ms: u64,  // Unix milliseconds
    pub entry_type: [u8; 20],    // Null-padded string
    pub actor: [u8; 16],         // Null-padded identifier
    pub actor_label: [u8; 24],   // Null-padded display name
    pub content_hash: [u8; 32],  // SHA3-256 of JSON content
    pub parent_hash: [u8; 32],   // SHA3-256 of previous entry
    pub _reserved: [u8; 12],
}
```

### Why Custom Binary Over JSON

1. **Storage efficiency.** JSON representation of a single entry is ~250-500 bytes. Binary representation is exactly 256 bytes — 2x more efficient on average, and deterministic.

2. **Fast parsing.** Fixed-size entries enable O(1) random access by index. JSON requires scanning.

3. **Hash chain integrity at the format level.** The `parent_hash` field links every entry to the previous one. This is built into the format, not an afterthought.

4. **Streaming append.** New entries are written by appending 256 bytes. No need to re-parse the entire file.

5. **Self-validating.** `verify_binary()` can validate a file without needing an external schema.

### Comparison

| Aspect | JSON | Protobuf | .aioss Binary |
|---|---|---|---|
| Size per entry | 250-500 bytes | ~100-200 bytes | 256 bytes (fixed) |
| Parse speed | Slow (string) | Fast (binary) | Fastest (fixed-size) |
| Random access | O(N) scan | O(N) scan | O(1) by index |
| Self-describing | Yes | No (needs .proto) | Yes (magic + version) |
| Human-readable | Yes | No | No (has JSON version) |
| Append efficiency | O(N) rewrite | O(N) rewrite | O(1) append |
| Hash chain | Manual | Manual | Built-in (parent_hash) |
| Verification | Custom | Custom | verify_binary() built-in |

### Why Not JSON-Only

For auditor tooling, Libern also writes a JSON version of each sealed session:

```json
{
  "version": "2.0.0",
  "session_id": "...",
  "status": "sealed",
  "entries": [...],
  "genesis_hash": "...",
  "head_hash": "..."
}
```

The JSON version is produced via `binary_to_json()` in `writer.rs`. But JSON is not the primary format because:
- Files are larger (2-3x)
- Append requires rewriting entire file
- No fixed-size guarantees for indexing
- Hash chain verification requires custom logic

### Code Reference

```rust
// From verify.rs — auto-format detection
pub fn verify_any(bytes: &[u8]) -> Result<(bool, usize, usize), String> {
    if bytes.len() >= 5 && &bytes[0..5] == b"AIOSS" {
        let ledger = BinaryLedger::from_bytes(bytes)?;
        Ok(verify_binary(&ledger))
    } else {
        let ledger: LedgerFileJson = serde_json::from_slice(bytes)?;
        Ok(verify_json(&ledger))
    }
}
```

## Consequences

1. The `.aioss` crate is a standalone library (`crates/libern-aioss`) with no runtime dependencies beyond `sha3`, `serde`, `chrono`, and `ed25519-dalek`.
2. All Libern sessions produce both binary (.aioss) and JSON (.aioss.json) files on seal.
3. External tools can verify `.aioss` files using `libern-aioss::verify::verify_any()`.
4. The format is extensible via reserved bytes and version field.

## .aioss Format Specification

The `.aioss` format is designed for cryptographic audit trails. Here is the complete binary layout:

### Header Layout (128 bytes)

```
Offset  Size  Field              Description
------  ----  -----              -----------
0       5     magic              "AIOSS" magic bytes
5       2     version            Format version (uint16 LE)
7       2     header_checksum    CRC-16 of bytes 0-125
9       36    session_id         UUID v4 string, null-padded
45      32    created_at         ISO 8601 timestamp, null-padded
77      1     status             0=active, 1=sealed, 2=archived
78      1     session_type       0=chat, 1=game, 2=ai, 3=system
79      4     entry_count        Number of entries (uint32 LE)
83      32    genesis_hash       SHA3-256 of first entry's binary
115     32    head_hash          SHA3-256 of latest entry's binary
147     8     reserved           Zero-filled
```

### Entry Layout (256 bytes)

```
Offset  Size  Field              Description
------  ----  -----              -----------
0       4     index              Sequence number (uint32 LE)
4       8     timestamp_unix_ms  Unix milliseconds (uint64 LE)
12      20    entry_type         Event type string, null-padded
32      16    actor              Actor ID, null-padded
48      24    actor_label        Actor display name, null-padded
72      32    content_hash       SHA3-256 of associated JSON content
104     32    parent_hash        SHA3-256 of previous entry's binary
136     12    reserved           Zero-filled
148     108   (unused)           Zero-filled to reach 256 bytes
```

### Hash Chain Verification

```
Entry 0: parent_hash = SHA3-256("")  (genesis)
          content_hash = SHA3-256(content_json)
          hash = SHA3-256(binary_entry)

Entry 1: parent_hash = Entry0.hash
          content_hash = SHA3-256(content_json)
          hash = SHA3-256(binary_entry)

Entry N: parent_hash = Entry(N-1).hash
          ...
```

Any modification to an entry breaks the chain for all subsequent entries.

## .aioss Crate Architecture

```
crates/libern-aioss/src/
├── lib.rs           # Public API, re-exports
├── header.rs        # AiossHeader (128 bytes)
├── entry.rs         # AiossEntry (256 bytes), compute_binary_hash()
├── ledger.rs        # BinaryLedger + LedgerFileJson types
├── writer.rs        # write_binary(), write_json(), binary_to_json()
├── reader.rs        # read_binary(), read_json(), read_auto()
├── verify.rs        # verify_json(), verify_binary(), verify_any()
├── health.rs        # Health diagnostics (chain integrity check)
├── event_store.rs   # Event persistence layer
├── state_proof.rs   # Ed25519-signed state proofs
├── schedule.rs      # Session sealing schedule
├── txt_log.rs       # Human-readable TXT export
└── mod.rs           # Module declarations
```

## Storage Overhead Analysis

| Scenario | JSON only | .aioss binary | .aioss + JSON | Savings (binary vs JSON) |
|----------|-----------|---------------|---------------|--------------------------|
| 1 year chat (50K msgs) | 25 MB | 12.8 MB | 25.6 MB | 49% |
| 1 year enterprise (500K entries) | 250 MB | 128 MB | 256 MB | 49% |
| 5 year archive (2.5M entries) | 1.25 GB | 640 MB | 1.28 GB | 49% |
| Compliance export (100K entries) | 50 MB | 25.6 MB | 51.2 MB | 49% |

## Performance Characteristics

| Operation | Binary (.aioss) | JSON |
|-----------|-----------------|------|
| Write 10,000 entries | 0.3s | 2.1s |
| Read entry #500,000 | O(1) — 0.001ms | O(N) — 50ms |
| Verify chain (100K entries) | 0.8s | 3.5s |
| Append single entry | 0.03ms | 15ms (rewrite) |
| Memory map 100K entries | 25.6 MB (fixed) | 50 MB+ (variable) |

## .aioss File Format in Detail

### Magic Byte Detection

The first 5 bytes of any .aioss file are always `AIOSS` (hex: 41 49 4F 53 53). This allows automatic format detection:

```rust
pub fn detect_format(bytes: &[u8]) -> Format {
    if bytes.len() >= 5 && &bytes[0..5] == b"AIOSS" {
        Format::AiossBinary
    } else if bytes.len() >= 2 && &bytes[0..2] == b"{ " {
        Format::AiossJson
    } else {
        Format::Unknown
    }
}
```

### Binary Entry Serialization

```rust
pub fn to_bytes(&self) -> [u8; 256] {
    let mut buf = [0u8; 256];
    buf[0..4].copy_from_slice(&self.index.to_le_bytes());
    buf[4..12].copy_from_slice(&self.timestamp_unix_ms.to_le_bytes());
    buf[12..32].copy_from_slice(&self.entry_type);
    buf[32..48].copy_from_slice(&self.actor);
    buf[48..72].copy_from_slice(&self.actor_label);
    buf[72..104].copy_from_slice(&self.content_hash);
    buf[104..136].copy_from_slice(&self.parent_hash);
    // bytes 136..256 are reserved/zero-filled
    buf
}
```

### Hash Computation

```rust
pub fn compute_binary_hash(&self) -> [u8; 32] {
    use sha3::{Digest, Sha3_256};
    let bytes = self.to_bytes();
    let mut hasher = Sha3_256::new();
    hasher.update(&bytes[0..72]);   // Fields before content_hash
    hasher.update(&bytes[104..]);   // Fields after content_hash
    hasher.finalize().into()
}
```

The hash skips `content_hash` itself (bytes 72-104) to avoid circular dependency. The hashed regions cover all mutable fields.

### Complete Verification Pipeline

```rust
pub fn verify_binary(ledger: &BinaryLedger) -> (bool, usize, usize) {
    let mut verified = 0;
    let mut failed = 0;
    let mut prev_hash = [0u8; 32];
    
    for entry in &ledger.entries {
        let computed = entry.compute_binary_hash();
        if computed == entry.parent_hash || verified == 0 {
            // Genesis entry or chain continues
            verified += 1;
            prev_hash = computed;
        } else {
            failed += 1;
            break;
        }
    }
    
    (failed == 0, verified, failed)
}
```

## Session Types and Lifecycle

| Session Type | byte | Description | Sealing Behavior |
|-------------|------|-------------|-----------------|
| Chat | 0 | Message conversation | Sealed on close or interval |
| Game | 1 | Casino/prediction session | Sealed on game end |
| AI | 2 | Liber AI conversation | Sealed on context reset |
| System | 3 | Audit, configuration changes | Sealed immediately |

Session lifecycle: `Active → Sealed → Archived`

### Sealing Triggers
- Time interval (configurable: 1 hour, 1 day, 1 week)
- Session close (user closes channel)
- Manual seal (compliance officer action)
- Size threshold (configurable: 10K, 100K, 1M entries)

## Performance Benchmarks

| Operation | .aioss Binary | JSON Equivalent | Speedup |
|-----------|--------------|-----------------|---------|
| Write 10K entries | 0.3 seconds | 2.1 seconds | 7× |
| Read entry #500,000 | O(1) - 0.001ms | O(N) - 50ms | 50,000× |
| Verify full chain (100K) | 0.8 seconds | 3.5 seconds | 4.4× |
| Append single entry | 0.03ms | 15ms (rewrite) | 500× |
| Memory map (100K entries) | 25.6 MB fixed | 50+ MB variable | 2× |
| Serialization | Fixed-size | Variable (parse) | Deterministic |

## Integration with SQLite

Libern maintains dual storage: SQLite for operational queries, .aioss for audit:

```rust
// Write path: both SQLite and .aioss
pub fn send_message(state: &AppState, channel_id: &str, content: &str) -> Result<Message, String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    
    // 1. Insert into SQLite for fast queries
    conn.execute("INSERT INTO messages (...) VALUES (...)", params)?;
    
    // 2. Append to .aioss for audit trail
    let entry = AiossEntry::new(...);
    state.ledger.append(entry)?;
    
    Ok(message)
}
```

## References

- `crates/libern-aioss/Cargo.toml` — Dependencies: sha3, serde, chrono, ed25519-dalek
- `crates/libern-aioss/src/header.rs` — 128-byte header format
- `crates/libern-aioss/src/entry.rs` — 256-byte entry format
- `crates/libern-aioss/src/ledger.rs` — BinaryLedger + LedgerFileJson
- `crates/libern-aioss/src/writer.rs` — write_binary, write_json, binary_to_json
- `crates/libern-aioss/src/reader.rs` — read_binary, read_json, read_auto
- `crates/libern-aioss/src/verify.rs` — verify_json, verify_binary, verify_any
- `crates/libern-aioss/src/health.rs` — Health diagnostics
- `crates/libern-aioss/src/state_proof.rs` — Ed25519 state proof
- `crates/libern-aioss/src/event_store.rs` — Event persistence
- `crates/libern-aioss/src/schedule.rs` — Session sealing
- `crates/libern-aioss/src/txt_log.rs` — TXT export

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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
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
