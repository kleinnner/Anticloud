__                     ¦¦               __                                    
¦¦                     ¯¯               ¦¦                                    
¦¦            ___¦   ¦¦¦¦     ¦___      ¦¦_¦¦¦_    _¦¦¦¦_    ¦¦_¦¦¦¦  ¦¦_¦¦¦¦_
¦¦        __¦¯¯¯       ¦¦       ¯¯¯¦__  ¦¦¯  ¯¦¦  ¦¦____¦¦   ¦¦¯      ¦¦¯   ¦¦
¦¦        ¯¯¦___       ¦¦       ___¦¯¯  ¦¦    ¦¦  ¦¦¯¯¯¯¯¯   ¦¦       ¦¦    ¦¦
¦¦______      ¯¯¯¦  ___¦¦___  ¦¯¯¯      ¦¦¦__¦¦¯  ¯¦¦____¦   ¦¦       ¦¦    ¦¦
¯¯¯¯¯¯¯¯            ¯¯¯¯¯¯¯¯            ¯¯ ¯¯¯      ¯¯¯¯¯    ¯¯       ¯¯    ¯¯

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

Document Version: 1.0.0
Category: Feature Paper
Document ID: PAP-005
Last Updated: 2026-06-19

----------------------------------------------------------------

# Architecture Decision Log (ADL)

## Document Meta

| Field | Value |
|-------|-------|
| Paper ID | PAP-005 |
| Title | Architecture Decision Log |
| Status | Active |
| Author | Libern Architecture Team |
| Date | 2026-06-19 |

---

## ADL-001: CRDT Selection

| Field | Value |
|-------|-------|
| ID | ADL-001 |
| Title | Conflict-Free Replicated Data Type Selection |
| Status | Accepted |
| Date | 2026-03-20 |

### Context
Libern needs a mechanism to synchronize data between offline peers that may have diverged. The mechanism must guarantee eventual consistency without a central coordinator.

### Options
1. **LWW Element Set**: Last-write-wins set CRDT. Simple, proven, converges.
2. **OT (Operational Transformation)**: Used by Google Docs. Complex to implement correctly.
3. **Git-like DAG Merge**: Full version history with manual merge. Overkill for chat.
4. **Custom Protocol**: Build from scratch. High risk.

### Decision
Choose LWW Element Set CRDT with HLC timestamps.

### Rationale
- Simplest CRDT that guarantees convergence.
- HLC timestamps provide causal ordering without clock sync.
- No central coordinator needed.
- Proven in distributed systems research.

### Consequences
- Positive: Simple, provably correct merge.
- Positive: Easy to implement and test.
- Negative: Last-write-wins means concurrent edits may lose data (acceptable for chat).
- Negative: Not suitable for fine-grained collaborative editing without extension.

---

## ADL-002: Cryptographic Primitives

| Field | Value |
|-------|-------|
| ID | ADL-002 |
| Title | Cryptographic Primitive Selection |
| Status | Accepted |
| Date | 2026-03-15 |

### Context
Libern needs cryptographic primitives for identity (signing), data integrity (hashing), and future encryption.

### Options

**Signing**: Ed25519 vs RSA vs ECDSA vs BLS
**Hashing**: SHA-256 vs SHA3-256 vs BLAKE2

### Decision
- Signing: Ed25519 (ed25519-dalek)
- Hashing: SHA3-256

### Rationale
Ed25519 offers smaller keys (32 bytes vs 256+ for RSA), faster signing/verification, and constant-time execution. SHA3-256 is immune to length extension attacks and is NIST-standardized.

### Consequences
- Positive: Fast, secure, well-audited implementations.
- Positive: Small key sizes reduce storage.
- Negative: Ed25519 is not post-quantum resistant (future migration path needed).

---

## ADL-003: Storage Architecture

| Field | Value |
|-------|-------|
| ID | ADL-003 |
| Title | Dual Storage: SQLite + .aioss Ledger |
| Status | Accepted |
| Date | 2026-03-15 |

### Context
Libern needs both fast operational data access and an immutable audit trail.

### Options
1. **SQLite only**: Fast queries, but no immutable audit trail.
2. **.aioss only**: Immutable audit trail, but slow queries.
3. **Both**: SQLite for operations, .aioss for audit.

### Decision
Use both: SQLite (rusqlite) for operational data and .aioss binary ledger for audit.

### Rationale
- SQLite provides fast, flexible querying with FTS5 search.
- .aioss provides tamper-evident, cryptographically verifiable audit trail.
- Separation of concerns: operational data can be mutated; audit data is immutable.

### Consequences
- Positive: Best of both worlds.
- Positive: .aioss can be verified independently (by auditors, regulators).
- Negative: Data duplication between stores.
- Negative: Extra complexity in write path (must write to both stores).

---

## ADL-004: Network Protocol

| Field | Value |
|-------|-------|
| ID | ADL-004 |
| Title | P2P Network Protocol Selection |
| Status | Accepted |
| Date | 2026-03-25 |

### Context
Libern needs to synchronize data between peers on the same LAN.

### Options
1. **WebSocket (tokio-tungstenite)**: Standard protocol, good library support.
2. **gRPC**: HTTP/2 based, complex setup.
3. **Custom UDP**: Custom protocol, maximum performance, maximum complexity.
4. **libp2p**: Full P2P stack, heavy dependency.

### Decision
Use WebSocket (tokio-tungstenite) for P2P data sync and mDNS (mdns crate) for peer discovery.

### Rationale
- WebSocket is standard, well-supported, and easy to debug.
- mDNS is zero-configuration discovery.
- LAN-only for MVP avoids NAT traversal complexity.

### Consequences
- Positive: Simple implementation with excellent library support.
- Negative: WAN peers not supported until NAT traversal is added.
- Negative: WebSocket overhead vs raw TCP/UDP.

---

## ADL-005: AI Engine Architecture

| Field | Value |
|-------|-------|
| ID | ADL-005 |
| Title | AI Engine Architecture and Provider Selection |
| Status | Accepted |
| Date | 2026-04-01 |

### Context
Libern needs a local AI assistant for summarization, Q&A, content moderation, and games.

### Options
1. **Cloud AI API (OpenAI, etc.)**: Most capable, but requires internet and costs money.
2. **Local LLM (llama.cpp)**: Fully private, offline, but requires model download.
3. **Hybrid**: Local for basic, cloud for complex. Adds complexity.

### Decision
Local LLM via llama.cpp with a pluggable AiEngine trait (MockEngine for fallback).

### Rationale
- Complete privacy: no data leaves the machine.
- Offline operation: AI works without internet.
- No recurring API costs.
- Pluggable architecture allows graceful degradation.

### Consequences
- Positive: Privacy-preserving, offline-capable, cost-free.
- Positive: Easy to test with MockEngine.
- Negative: ~1.1 GB model download on first use.
- Negative: Slower than cloud APIs on CPU-only hardware.

---

## ADL-006: Permission System

| Field | Value |
|-------|-------|
| ID | ADL-006 |
| Title | Permission Model Selection |
| Status | Accepted |
| Date | 2026-04-05 |

### Context
Libern needs granular access control within servers.

### Options
1. **Bitmask**: Compact, fast, extensible.
2. **RBAC (Role-Based Access Control)**: Standard, well-understood.
3. **ACL (Access Control Lists)**: Granular but complex.
4. **Capability-based**: Modern but unconventional.

### Decision
64-bit integer bitmask stored on roles. Effective permissions = bitwise OR of all assigned role masks.

### Rationale
- Compact storage (single i64 column per role).
- Fast computation (bitwise operations).
- Extensible (50 unused bits).
- Simple to combine multiple roles.
- Frontend can easily check individual bits.

### Consequences
- Positive: Simple, fast, compact.
- Positive: Easy to implement and test.
- Negative: Channel-specific permissions require additional bits or a different mechanism.

---

## ADL-007: ID Generation

| Field | Value |
|-------|-------|
| ID | ADL-007 |
| Title | Identifier Generation Strategy |
| Status | Accepted |
| Date | 2026-03-15 |

### Context
Libern needs unique identifiers for all entities without a central server.

### Options
1. **UUID v4**: Random, 122 bits of entropy.
2. **ULID**: Sortable, 26-character, time-based.
3. **Snowflake**: Twitter-style, requires worker ID coordination.
4. **Auto-increment**: Requires central database.

### Decision
UUID v4 for all entity identifiers.

### Rationale
- No central coordination needed (offline-generated).
- Extremely low collision probability.
- Standard format supported everywhere.
- No information leakage about creation order.

### Consequences
- Positive: Truly offline-capable ID generation.
- Positive: No collision risk for practical deployments.
- Negative: Not sortable (unlike ULID).
- Negative: Larger than integer IDs (36-character string).

---

## ADL-008: HLC Timestamps

| Field | Value |
|-------|-------|
| ID | ADL-008 |
| Title | Hybrid Logical Clock for Event Ordering |
| Status | Accepted |
| Date | 2026-03-20 |

### Context
Libern needs to order events across peers without synchronized clocks.

### Options
1. **Wall clock**: Simple but unreliable (clock skew).
2. **Lamport clock**: Logical only, no real-time component.
3. **Vector clock**: Tracks all peers, O(n) storage.
4. **HLC**: Hybrid, bounded error, O(1) storage.

### Decision
64-bit HLC: 48-bit physical (ms) + 16-bit logical counter.

### Rationale
- Physical component allows human-readable timestamps.
- Logical component resolves concurrent events.
- Monotonic: always increasing.
- O(1) storage per event.

### Consequences
- Positive: Causal ordering without NTP.
- Positive: Bounded clock drift tolerance.
- Negative: Extra 2 bytes vs wall clock only.

---

## ADL-009: Whiteboard Engine

| Field | Value |
|-------|-------|
| ID | ADL-009 |
| Title | Whiteboard Rendering Engine |
| Status | Accepted |
| Date | 2026-04-01 |

### Context
Libern needs a collaborative whiteboard with drawing tools and real-time sync.

### Options
1. **Fabric.js**: Mature canvas library with event system.
2. **Excalidraw**: Purpose-built whiteboard, harder to customize.
3. **Custom Canvas API**: Full control, massive effort.
4. **SVG.js**: SVG-based, good for some use cases.

### Decision
Fabric.js for the whiteboard canvas.

### Rationale
- Mature library with comprehensive drawing tools.
- Built-in event handling for stroke capture.
- Export to SVG/PNG built-in.
- Infinite canvas support.
- Easy CRDT integration via serialization.

### Consequences
- Positive: Feature-rich, well-documented.
- Positive: Easy stroke serialization for CRDT sync.
- Negative: Large library bundle size.
- Negative: Performance with thousands of strokes needs optimization.

---

## ADL-010: Audio Codec

| Field | Value |
|-------|-------|
| ID | ADL-010 |
| Title | Voice Chat Audio Codec |
| Status | Accepted |
| Date | 2026-04-10 |

### Context
Libern needs real-time voice chat with low latency over LAN.

### Options
1. **Opus**: Standard for VoIP, excellent quality at low bitrate.
2. **Speex**: Older, lower quality.
3. **AAC**: Good quality, higher latency.
4. **Raw PCM**: No compression, high bandwidth.

### Decision
Opus codec via the `opus` Rust crate.

### Rationale
- Industry standard for VoIP (used by Discord, WhatsApp, Zoom).
- Excellent quality at low bitrates (16-32 kbps).
- Low latency (26.5ms frame size).
- Wide platform support.

### Consequences
- Positive: High quality, low latency.
- Positive: Standard codec with good library support.
- Negative: Requires native library compilation.

---

## ADL-011: Tauri v2 Plugin Architecture

| Field | Value |
|-------|-------|
| ID | ADL-011 |
| Title | Plugin and Extension Strategy |
| Status | Draft |
| Date | 2026-06-01 |

### Context
Libern needs a way for community members to extend functionality.

### Options
1. **Tauri plugins**: Native Rust plugins, complex.
2. **WASM plugins**: WebAssembly sandbox, portable.
3. **JavaScript plugins**: Run in WebView, security concerns.
4. **Custom scripting (Lua/Rhai)**: Embedded scripting language.

### Decision
Tauri plugins for MVP. WASM plugins planned for future.

### Rationale
- Tauri plugin system is mature and well-documented.
- WASM provides sandboxed execution for community contributions.
- JavaScript plugins are too risky for a security-focused app.

### Consequences
- Positive: Extensible architecture.
- Positive: Community contributions possible.
- Negative: Plugin development requires Rust knowledge.

---

## ADL-012: Error Handling Strategy

| Field | Value |
|-------|-------|
| ID | ADL-012 |
| Title | Error Handling and Reporting |
| Status | Accepted |
| Date | 2026-04-15 |

### Context
Libern needs consistent error handling across the backend.

### Options
1. **String errors**: Simple but lacks structure.
2. **Custom error types**: Structured but verbose.
3. **anyhow/thiserror**: Balanced approach.
4. **Result<T, E> with mapped errors**: Standard Rust approach.

### Decision
- Tauri commands: `Result<T, String>` (Tauri serialization requirement).
- Internal code: `anyhow::Result<T>` for complex operations.
- Library code: Custom error types with `thiserror`.

### Consequences
- Positive: Consistent error patterns.
- Positive: Good developer experience with anyhow/thiserror.
- Negative: Some error information loss when converting to String for Tauri.

---

## ADL-013: Database Migration Strategy

| Field | Value |
|-------|-------|
| ID | ADL-013 |
| Title | Database Schema Migration |
| Status | Accepted |
| Date | 2026-04-15 |

### Context
Libern needs to evolve the database schema without breaking existing installations.

### Options
1. **Manual migrations**: Simple but error-prone.
2. **Embedded migration scripts**: Versioned, automated.
3. **ORM-based migrations**: Heavyweight.
4. **Schema-less (JSON in SQLite)**: Flexible but no type safety.

### Decision
Embedded migration scripts in schema.rs with version tracking. Each migration is a SQL string in the MIGRATIONS array. Applied sequentially on app startup.

### Consequences
- Positive: Simple, self-contained, no external tooling.
- Positive: Applied automatically on app update.
- Negative: Manual rollback procedure required.
- Negative: No down migrations (forward-only).

---

## ADL-014: Configuration Management

| Field | Value |
|-------|-------|
| ID | ADL-014 |
| Title | Application Configuration |
| Status | Accepted |
| Date | 2026-05-01 |

### Context
Libern needs configurable settings for different deployment scenarios.

### Options
1. **JSON config file**: Simple, human-readable.
2. **Environment variables**: Standard 12-factor.
3. **SQLite config table**: Dynamic but requires DB access.
4. **All of the above**: Flexible but complex.

### Decision
JSON config file as primary, with environment variable overrides for sensitive values.

### Consequences
- Positive: Simple configuration format.
- Positive: Environment variables for secrets.
- Negative: Config file must be distributed with the app.

---

## ADL-015: Build and Distribution

| Field | Value |
|-------|-------|
| ID | ADL-015 |
| Title | Build System and Distribution |
| Status | Accepted |
| Date | 2026-05-01 |

### Context
Libern needs to be built and distributed across Windows, macOS, and Linux.

### Options
1. **Tauri bundler**: MSI/DMG/AppImage built-in.
2. **electron-builder-style**: Custom bundling.
3. **Platform-specific installers**: Manual per-platform.

### Decision
Tauri bundler for all platforms. Platform-specific installers (MSI, DMG, AppImage, deb).

### Consequences
- Positive: Single build command for all platforms.
- Positive: Standard installer formats.
- Negative: Cross-compilation requires platform-specific toolchains.

---

## ADL-016: Frontend State Management

| Field | Value |
|-------|-------|
| ID | ADL-016 |
| Title | Frontend State Management Pattern |
| Status | Accepted |
| Date | 2026-05-15 |

### Context
The Libern frontend needs to manage complex state including server list, channel list, messages, user presence, and UI state (sidebar open, modals, etc.). The state management solution must handle async Tauri command results efficiently.

### Options
1. **Zustand**: Lightweight, hook-based, selectors for re-render optimization.
2. **Redux Toolkit**: Full-featured, middleware ecosystem, more boilerplate.
3. **React Context**: Built-in, but causes unnecessary re-renders.
4. **Jotai/Recoil**: Atomic state, fine-grained updates.

### Decision
Zustand for global state + `@tanstack/react-query` for server state (Tauri command caching).

### Rationale
- Zustand is lightweight (~1 KB) with minimal boilerplate.
- Selectors prevent unnecessary re-renders.
- react-query provides automatic caching and background refetching for Tauri commands.
- No middleware needed — Tauri commands are the "API" layer.

### Consequences
- Positive: Simple, performant state management.
- Positive: Separates server state (react-query) from UI state (Zustand).
- Negative: Two state management libraries to learn.

---

## ADL-017: File Attachment Strategy

| Field | Value |
|-------|-------|
| ID | ADL-017 |
| Title | File Attachment Storage Strategy |
| Status | Accepted |
| Date | 2026-05-20 |

### Context
Libern needs to handle file attachments (images, documents, audio clips) with offline-first semantics.

### Options
1. **Local filesystem only**: Store files in app data directory.
2. **P2P file sync**: Sync files between peers.
3. **External cloud storage**: S3-compatible, requires internet.

### Decision
Store files on local filesystem. Reference by path in SQLite. No P2P file sync for MVP.

### Rationale
- Local filesystem is always available (offline-first).
- File sync over P2P is complex (bandwidth, partial transfers).
- Files are user-owned — not synced unless explicitly shared.
- Future: P2P file sync post-MVP using BitTorrent-style chunking.

### Consequences
- Positive: Simple, reliable, offline-capable.
- Positive: No bandwidth costs for file storage.
- Negative: Multi-device file access requires explicit transfer.

---

## ADL-018: Logging and Diagnostics

| Field | Value |
|-------|-------|
| ID | ADL-018 |
| Title | Application Logging Strategy |
| Status | Accepted |
| Date | 2026-06-01 |

### Context
Libern needs diagnostic logging for debugging, user support, and compliance. Logging must respect privacy (no telemetry).

### Options
1. **log crate + file output**: Standard Rust logging facade.
2. **tracing crate**: Structured, async-aware logging.
3. **Custom log format**: .aioss-compatible log format.

### Decision
Use `log` crate with `env_logger` for development, file-based logging with rotation for production, health diagnostics via .aioss for compliance.

### Consequences
- Positive: Simple, standard logging approach.
- Positive: Health diagnostics provide structured data.
- Negative: No centralized log aggregation (by design — privacy).

---

## ADL Index

| ID | Title | Status | Date |
|----|-------|--------|------|
| ADL-001 | CRDT Selection | Accepted | 2026-03-20 |
| ADL-002 | Cryptographic Primitives | Accepted | 2026-03-15 |
| ADL-003 | Storage Architecture | Accepted | 2026-03-15 |
| ADL-004 | Network Protocol | Accepted | 2026-03-25 |
| ADL-005 | AI Engine Architecture | Accepted | 2026-04-01 |
| ADL-006 | Permission System | Accepted | 2026-04-05 |
| ADL-007 | ID Generation | Accepted | 2026-03-15 |
| ADL-008 | HLC Timestamps | Accepted | 2026-03-20 |
| ADL-009 | Whiteboard Engine | Accepted | 2026-04-01 |
| ADL-010 | Audio Codec | Accepted | 2026-04-10 |
| ADL-011 | Plugin Architecture | Draft | 2026-06-01 |
| ADL-012 | Error Handling | Accepted | 2026-04-15 |
| ADL-013 | Database Migration | Accepted | 2026-04-15 |
| ADL-014 | Configuration Management | Accepted | 2026-05-01 |
| ADL-015 | Build and Distribution | Accepted | 2026-05-01 |
| ADL-016 | Frontend State Management | Accepted | 2026-05-15 |
| ADL-017 | File Attachment Strategy | Accepted | 2026-05-20 |
| ADL-018 | Logging and Diagnostics | Accepted | 2026-06-01 |

## ADL Code References

### ADL-001: CRDT Implementation
```rust
// libern-core/src/crdt/mod.rs
pub struct HybridLogicalClock {
    pub physical: u64,
    pub logical: u16,
}

impl HybridLogicalClock {
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
}
```

### ADL-003: Database Schema (SQLite + .aioss)
```sql
-- libern-core/src/db/schema.rs
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL REFERENCES channels(id),
    content TEXT NOT NULL,
    hlc_timestamp INTEGER NOT NULL,
    signature BLOB NOT NULL,
    created_at INTEGER NOT NULL
);
```

### ADL-005: AiEngine Trait
```rust
// libern-core/src/ai/mod.rs
pub trait AiEngine: Send + 'static {
    fn infer(&mut self, request: InferenceRequest) -> Result<(), String>;
    fn embed(&mut self, text: &str) -> Result<Vec<f32>, String>;
    fn is_loaded(&self) -> bool;
    fn model_info(&self) -> ModelInfo;
}
```

## ADL Decision Process

Each ADL follows a consistent review process:
1. **Proposal**: Architecture issue filed on GitHub with ADL template
2. **Review**: Minimum 7-day review period for community feedback
3. **Decision**: Core contributors reach consensus; documented as Accepted, Deprecated, or Superseded
4. **Implementation**: Code changes linked to ADL in commit messages
5. **Validation**: Tests and benchmarks confirm decision meets requirements

----------------------------------------------------------------

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

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
+-- Cargo.toml                          # Workspace root
+-- build.bat                           # Build orchestration
+-- LIBERN_BUILD_PLAN.md                # Build plan documentation
+-- AI_FEATURES_PLAN.md                 # AI subsystem plan
+-- COMPETITIVE_EDGE.md                 # Competitive analysis
+-- crates/
¦   +-- libern-core/                    # Core library
¦   ¦   +-- Cargo.toml
¦   ¦   +-- src/
¦   ¦       +-- lib.rs
¦   ¦       +-- crdt/mod.rs             # CRDT engine
¦   ¦       +-- crypto/mod.rs           # Cryptographic primitives
¦   ¦       +-- db/
¦   ¦       ¦   +-- mod.rs              # Database initialization
¦   ¦       ¦   +-- schema.rs           # Schema definition
¦   ¦       ¦   +-- models.rs           # Data models
¦   ¦       +-- ai/
¦   ¦           +-- mod.rs              # AiEngine trait
¦   ¦           +-- engine.rs           # MockEngine
¦   ¦           +-- qwen_engine.rs      # CandleEngine
¦   ¦           +-- pipeline.rs         # Prompt construction
¦   ¦           +-- summarizer.rs       # Channel summarization
¦   ¦           +-- moderator.rs        # Content moderation
¦   ¦           +-- rag.rs              # Document RAG
¦   ¦           +-- conversation.rs     # Context management
¦   ¦           +-- liber_user.rs       # Liber identity
¦   ¦           +-- reward.rs           # RLHF feedback
¦   +-- libern-aioss/                   # .aioss format
¦       +-- Cargo.toml
¦       +-- src/
¦           +-- lib.rs
¦           +-- header.rs               # 128-byte header
¦           +-- entry.rs                # 256-byte entry
¦           +-- ledger.rs               # Ledger types
¦           +-- writer.rs               # Binary/JSON writer
¦           +-- reader.rs               # Binary/JSON reader
¦           +-- verify.rs               # Chain verification
¦           +-- health.rs               # Health diagnostics
¦           +-- event_store.rs          # Event persistence
¦           +-- state_proof.rs          # Ed25519 proofs
¦           +-- schedule.rs             # Session sealing
¦           +-- txt_log.rs              # TXT export
+-- apps/
¦   +-- desktop/                        # Tauri desktop app
¦   ¦   +-- src/
¦   ¦   ¦   +-- App.tsx
¦   ¦   ¦   +-- main.tsx
¦   ¦   ¦   +-- lib/api.ts
¦   ¦   ¦   +-- lib/ai.ts
¦   ¦   ¦   +-- lib/utils.ts
¦   ¦   ¦   +-- stores/serverStore.ts
¦   ¦   ¦   +-- stores/messageStore.ts
¦   ¦   ¦   +-- stores/uiStore.ts
¦   ¦   ¦   +-- types/index.ts
¦   ¦   +-- src-tauri/
¦   ¦       +-- Cargo.toml
¦   ¦       +-- tauri.conf.json
¦   ¦       +-- build.rs
¦   ¦       +-- src/
¦   ¦           +-- main.rs
¦   ¦           +-- lib.rs
¦   ¦           +-- commands/
¦   ¦               +-- mod.rs
¦   ¦               +-- server.rs
¦   ¦               +-- channel.rs
¦   ¦               +-- message.rs
¦   ¦               +-- user.rs
¦   ¦               +-- role.rs
¦   ¦               +-- ai.rs
¦   ¦               +-- xp.rs
¦   ¦               +-- stats.rs
¦   ¦               +-- stars.rs
¦   +-- sandbox/                        # 3D Boxel engine
¦       +-- Cargo.toml
¦       +-- src/
¦           +-- main.rs
¦           +-- liber.rs
¦           +-- world.rs
¦           +-- player.rs
¦           +-- character.rs
¦           +-- camera.rs
¦           +-- cube.rs
¦           +-- texture.rs
¦           +-- audio.rs
¦           +-- voice.rs
¦           +-- chat.rs
¦           +-- pipeline.rs
¦           +-- screen_share.rs
+-- docs/
¦   +-- README.md
¦   +-- bdrs/                           # Architecture decisions
¦   +-- feature-papers/                 # Feature documentation
¦   +-- csr/                            # Corporate social responsibility
¦   +-- no-more-silicon/                # Hardware independence
¦   +-- competitors/                    # Competitive analysis
¦   +-- compliance/                     # Compliance documentation
¦   +-- data-safety/                    # Data safety documentation
¦   +-- developers/                     # Developer documentation
¦   +-- enterprise/                     # Enterprise documentation
¦   +-- faqs/                           # Frequently asked questions
¦   +-- features/                       # Feature documentation
¦   +-- governance/                     # Project governance
¦   +-- help-bugs/                      # Bug reporting
¦   +-- howto-community/                # Community how-to guides
¦   +-- howto-developers/               # Developer how-to guides
¦   +-- howto-enterprise/               # Enterprise how-to guides
¦   +-- incident-recovery/              # Incident recovery docs
¦   +-- investors/                      # Investor documentation
¦   +-- no-black-boxes/                 # Transparency docs
¦   +-- privacy/                        # Privacy documentation
¦   +-- research/                       # Research documentation
¦   +-- tutorial/                       # Tutorial documentation
¦   +-- why-use/                        # Why-use documentation
+-- installer/
    +-- native/
        +-- Cargo.toml
        +-- build.rs
        +-- src/
            +-- main.rs
            +-- lib.rs
            +-- app.rs
            +-- state.rs
            +-- theme.rs
            +-- widgets.rs
            +-- system.rs
            +-- downloader.rs
            +-- screens/
                +-- mod.rs
                +-- splash.rs
                +-- check.rs
                +-- download.rs
                +-- install.rs
                +-- elevation.rs
                +-- complete.rs
                +-- error.rs
`

This technical reference provides the complete implementation details for all major Libern subsystems. Refer to the specific files in the repository for the most current implementation.

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com