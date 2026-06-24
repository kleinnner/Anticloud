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
Category: BDR / Network Architecture
Audience: Engineering team, network architects
Doc ID: LIBERN-BDR-P2P-006

# BDR 006: Why P2P Instead of Client-Server

## Status

**Accepted.** Peer-to-peer mesh architecture for Libern's network layer.

## Context

Libern's network requirements:
1. **Zero infrastructure.** No servers to provision, maintain, or pay for.
2. **Offline operation.** Fully functional without any network.
3. **LAN collaboration.** Direct communication between peers on local network.
4. **No single point of failure.** Any peer can go offline without affecting others.
5. **CRDT-native.** Network model must match data model (CRDT merge).

The team evaluated:

**Option A: Client-Server**
- Central server handles all message routing, storage, and sync
- Used by Slack, Discord, Teams, Mattermost

**Option B: P2P Mesh**
- Peers communicate directly
- No central coordination
- Each peer is autonomous

**Option C: Federated**
- Multiple servers that talk to each other (like Matrix)
- Decentralized but still requires servers

## Decision

**Chose P2P mesh** with mDNS discovery + WebSocket transport + UDP audio.

### Implementation

The P2P subsystem spans two crates and the Tauri app:

**Discovery (mDNS):**
- Peers broadcast presence on LAN
- No configuration needed — zero-touch discovery

**Data Transport (WebSocket):**
- `tokio-tungstenite` for bidirectional data sync
- CRDT deltas exchanged between peers

**Audio Transport (UDP):**
- Opus-encoded PCM streamed via UDP broadcast
- Low latency (<20ms on LAN)

### Why P2P Over Client-Server

1. **Zero servers.** Client-server requires at least one server. P2P requires zero. This is non-negotiable for Libern's value proposition.

2. **No single point of failure.** In client-server, server outage = no communication. In P2P, any peer can go offline and others continue unaffected.

3. **Offline compatibility.** P2P works without any network. Client-server requires server connectivity.

4. **No bandwidth costs.** Server bandwidth for 1,000 users at $0.10/GB adds up. P2P uses local network, zero bandwidth cost.

5. **Natural scaling.** Client-server requires server upgrades for more users. P2P scale is linear: more peers = more nodes, no server bottleneck.

6. **Privacy.** In client-server, all data passes through the server. In P2P, data stays between peers.

### P2P Synchronization Protocol

```
1. mDNS: "Hi, I'm Peer A at 192.168.1.2:42068"
2. Peer B: "I heard you. My last HLC timestamp is T_B."
3. Peer A: "I have entries up to T_A. You need entries [T_B, T_A]."
4. WebSocket established between Peer A ↔ Peer B
5. Peer A sends CRDT deltas for entries [T_B+1, T_A]
6. Peer B: verifies Ed25519 signatures → verifies SHA-256 hashes → merges CRDT
7. Peer B sends CRDT deltas for entries it has that Peer A doesn't
8. Both peers converge to same state
```

### Sync Protocol Design (from LIBERN_BUILD_PLAN.md)

```rust
// Simplified sync flow
1. On LAN peer discovery, establish WebSocket connection
2. Exchange HLC timestamps of latest known entries
3. Pull missing entries from peer (by HLC range)
4. Apply LWW-element-set merge (higher HLC timestamp wins)
5. Reconcile conflicts locally
6. Emit changes to UI via Tauri events
```

### Network Topologies Supported

**Fully Offline:** No networking at all. Single user.

```
[Peer A] ←--- Local SQLite ---→ (no network)
```

**LAN Party:** Direct P2P on local network.

```
[Peer A] ←--- mDNS + WebSocket ---→ [Peer B]
    ↑                                      ↑
    │         WebSocket                    │
    └────────────────── [Peer C] ──────────┘
```

**Multi-Site:** Via VPN or relay.

```
[Site A] ←--- WAN WebSocket ---→ [Relay Node] ←--- WAN WebSocket ---→ [Site B]
```

**Air-Gapped:** Physical transport of data (sneakernet).

```
[Peer A] → USB Export → [Peer B]
```

### Trade-offs Acknowledged

| Concern | Mitigation |
|---|---|
| NAT traversal | MVP targets LAN only. NAT hole-punching planned for post-MVP. |
| Peer discovery across subnets | mDNS is link-local only. Configure static peers for multi-subnet. |
| Message delivery not guaranteed | CRDT ensures eventual consistency. No at-least-once guarantee. |
| Peer churn | HLC timestamps handle ordering. Disconnected peers sync on reconnect. |
| Bandwidth for large files | Files are not synced via P2P. Each peer stores locally. |

### Alternatives Considered

**Federated (Matrix model).** Rejected because:
- Requires running a homeserver (contradicts zero-infrastructure)
- Federation protocol adds significant complexity
- Matrix homeserver is a centralized point per organization

**Client-Server (traditional).** Rejected because:
- Requires servers (contradicts zero-infrastructure)
- Single point of failure
- No offline operation
- Bandwidth/storage costs

## Consequences

1. Libern has no server infrastructure — every node is equal.
2. mDNS enables zero-configuration LAN discovery.
3. WebSocket provides reliable data transport for CRDT deltas.
4. UDP provides low-latency audio streaming.
5. P2P sync is best-effort; CRDT guarantees eventual consistency.

## P2P Network Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                    Peer A                            │
│  ┌─────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ mDNS    │  │ WebSocket│  │ CRDT Engine       │  │
│  │ Service │──│ Server   │──│ HLC + LWW Set     │  │
│  └─────────┘  └──────────┘  └───────────────────┘  │
│       │             │               │               │
│       │        ┌────┘               │               │
│       ▼        ▼                    ▼               │
│  ┌─────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ UDP     │  │ Sync    │  │ SQLite + .aioss   │  │
│  │ Audio   │  │ Protocol│  │ Local persistence │  │
│  └─────────┘  └──────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────┘
         │                │                │
    mDNS │          WS    │           UDP  │
         ▼                ▼                ▼
┌─────────────────────────────────────────────────────┐
│                    Peer B                            │
│  (same components as Peer A)                        │
└─────────────────────────────────────────────────────┘
```

## Discovery Protocol Details

mDNS (Multicast DNS) enables zero-configuration discovery:

```
Query: _libern._tcp.local.  (PTR record)
Response: Peer-A._libern._tcp.local.  →  192.168.1.2:42068
Additional: txtvers=1, proto=tokio-tungstenite, hlc=T_A
```

The `mdns` crate handles all mDNS communication:

```rust
// Pseudo-code for mDNS discovery
use mdns::{RecordKind, Responder, ServiceDaemon};

let responder = Responder::new()?;
responder.register(
    "_libern._tcp.local".to_string(),
    ServiceDaemon::new(42068, "Peer-A"),
)?;
```

## Sync Protocol Message Format

Messages exchanged over WebSocket use a simple JSON structure:

```json
{
  "type": "sync_request",
  "peer_id": "uuid-a",
  "hlc_watermark": 1234567890000,
  "server_ids": ["srv-1", "srv-2"]
}
```

Response:

```json
{
  "type": "sync_delta",
  "peer_id": "uuid-b",
  "entries": [
    {"type": "message", "id": "msg-1", "hlc": 1234567890005, "data": {...}},
    {"type": "message", "id": "msg-2", "hlc": 1234567890010, "data": {...}}
  ],
  "signature": "base64-sig"
}
```

## Bandwidth Analysis

| Sync scenario | Messages | Data size | Time (LAN 1 Gbps) |
|---------------|----------|-----------|-------------------|
| Initial sync (first connection) | 10,000 | ~5 MB | <50ms |
| Daily delta (100 new messages) | 100 | ~50 KB | <1ms |
| Offline reconnection (1 day) | 500 | ~250 KB | <3ms |
| Offline reconnection (1 week) | 3,500 | ~1.7 MB | <15ms |

## References

- `libern-core/src/sync/` — P2P sync module (discovery, transport, protocol)
- `libern-core/src/crdt/mod.rs` — CRDT engine (data layer for P2P)
- `LIBERN_BUILD_PLAN.md` — Sync protocol design in build plan
- `apps/desktop/src-tauri/src/lib.rs` — P2P initialization in app setup

## P2P Transport Protocol Specification

### Message Framing

All P2P messages use a simple length-prefixed JSON frame:

`
4 bytes: message length (uint32 big-endian)
N bytes: JSON payload (UTF-8)
`

### Message Types

| Type | Direction | Payload | Description |
|------|-----------|---------|-------------|
| sync_request | Bidirectional | { hlc_watermark, server_ids } | Request missing entries |
| sync_delta | Bidirectional | { entries: [...] } | Batch of CRDT entries |
| sync_ack | Bidirectional | { entry_count } | Acknowledge receipt |
| ping | Bidirectional | { nonce } | Keep-alive |
| pong | Bidirectional | { nonce } | Keep-alive response |
| disconnect | Either | { reason } | Graceful disconnect |

### Sync Flow State Machine

`
IDLE → DISCOVERING (mDNS query sent)
     → CONNECTING (WebSocket handshake)
     → SYNCING (exchanging deltas)
     → CONNECTED (real-time updates)
     → DISCONNECTED (peer left)
`

## Network Resiliency Testing

| Test | Scenario | Expected Behavior |
|------|----------|------------------|
| Peer goes offline mid-sync | Network disconnect during delta transfer | Partial sync discarded, retry on reconnect |
| Multiple peers sync simultaneously | 5 peers reconnect after network restoration | Exponential backoff with jitter prevents congestion |
| Duplicate peer discovery | Same peer discovered via mDNS and manual | Deduplication by peer ID |
| Large offline backlog | 10,000 messages generated while offline | Batched sync (100 msg/batch) with progress |
| Clock skew between peers | System clocks differ by hours | HLC logical counter absorbs drift |
| Packet loss (audio) | 10% UDP packet loss | Opus FEC (Forward Error Correction) |
| Corrupted sync data | Malformed JSON received | Validation before CRDT merge, reject invalid |

## P2P Security Considerations

| Threat | Mitigation |
|--------|------------|
| Impersonation | All messages Ed25519 signed |
| Replay attack | HLC timestamps prevent replayed messages |
| Man-in-the-middle (LAN) | Future: TLS+wss:// transport |
| Eavesdropping | Future: E2EE with X25519+ AES-GCM |
| Denial of service | Rate limiting per peer connection |
| Unauthorized peer | Server invite codes limit membership |

## LAN Discovery Performance

| Network Type | Discovery Time | Success Rate |
|-------------|---------------|--------------|
| Single switch (1 Gbps) | <100ms | 99.9% |
| Multi-switch (office) | <500ms | 98% |
| Wi-Fi 5 (802.11ac) | <200ms | 99% |
| Wi-Fi 4 (802.11n) | <500ms | 95% |
| VLAN/subnet boundary | Not discovered | 0% (design limitation) |

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
