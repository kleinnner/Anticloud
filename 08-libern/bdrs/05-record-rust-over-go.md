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
Category: BDR / Language Decision
Audience: Engineering team, technical leads
Doc ID: LIBERN-BDR-LNG-005

# BDR 005: Why Rust Instead of Go/C++/Python

## Status

**Accepted.** Rust is the primary backend language for Libern.

## Context

Libern's backend requires:
1. **Performance.** Audio encoding, CRDT merge, AI inference all require native speed.
2. **Memory safety.** Collaboration app handling untrusted peer data without segfaults or memory corruption.
3. **Cross-platform.** Windows, macOS, Linux — all as first-class targets.
4. **Direct system access.** Audio capture/playback, file I/O, network sockets, GPU compute.
5. **Small binary.** Target <30 MB total.

The team evaluated:

**Option A: Go**
- Garbage collected, goroutines, fast compilation
- Used by Docker, Kubernetes, Mattermost

**Option B: C++**
- Maximum performance, zero-cost abstractions
- Used by Discord, TeamSpeak, most game engines

**Option C: Python**
- Rapid development, large AI ecosystem
- Used by many ML/AI projects

**Option D: Rust**
- Memory safety without GC, zero-cost abstractions
- Used by Figma, Discord (parts), Firefox, Cloudflare

## Decision

**Chose Rust.**

### Why Rust Over Go

1. **Memory control.** Go's garbage collector adds unpredictable latency (GC pauses of 1-10ms). Audio processing, real-time CRDT merge, and AI inference require deterministic performance. Rust has no GC.

2. **Zero-cost abstractions.** Rust's iterators, closures, and generics compile down to the same machine code as hand-written C. Go's goroutines and interfaces have runtime overhead.

3. **ffi.** Rust's C ABIs for `llama.cpp` (C++ library) are seamless via `llama-cpp-2`. Go's cgo adds ~100ns overhead per call and complicates cross-compilation.

4. **Ecosystem for the task.** rusqlite (SQLite), ed25519-dalek, sha2, sha3, opus, cpal (audio), tokio-tungstenite (WebSocket) — these are all idiomatic Rust crates.

### Why Rust Over C++

1. **Memory safety by default.** C++ has 30+ years of accumulated undefined behavior. Rust's borrow checker eliminates use-after-free, double-free, buffer overflow, and data race bugs at compile time.

2. **Package management.** Cargo is the best package manager in any compiled language. C++ still uses a fragmented ecosystem (vcpkg, Conan, CMake FetchContent, submodules).

3. **Build system.** Cargo + Cargo.toml is trivial. C++ requires CMake, Meson, or Bazel — significant configuration overhead.

4. **Cross-compilation.** `cargo build --target x86_64-pc-windows-gnu` or `--target aarch64-apple-darwin` works out of the box. C++ cross-compilation is notoriously painful.

5. **Testing.** `cargo test` is built-in. C++ requires Google Test, Catch2, or Boost.Test.

### Why Rust Over Python

1. **Performance.** Python is 10-100x slower than Rust for CPU-bound tasks. AI inference wrapper, CRDT merge, audio encode/decode — all would be Python bottlenecks.

2. **Binary distribution.** Python requires a runtime and interpreter. Rust compiles to a single native binary.

3. **Concurrency.** Python's GIL prevents true parallel execution. Rust's ownership model enables safe concurrency without a GIL.

4. **Startup time.** Python app startup is 100ms-1s. Rust is <10ms.

### Rust in the Libern Stack

| Crate | Rust | Purpose | Lines of Code |
|---|---|---|---|
| `libern-core` | Yes | CRDT, crypto, DB, AI, audio | ~1,500+ |
| `libern-aioss` | Yes | .aioss binary format | ~800+ |
| `libern-desktop` | Yes | Tauri app, commands | ~500+ |
| `libern-sandbox` | Yes | Boxel 3D engine (wgpu) | ~500+ |
| Frontend | TypeScript | React UI | ~5,000+ |

### Code Example: Memory Safety Guarantee

```rust
// Rust prevents this at compile time:
fn use_after_free() {
    let v = vec![1, 2, 3];
    let ptr = &v[0];
    drop(v);  // Error: cannot move out of v because it's borrowed
    // println!("{}", ptr);  // Would be UB in C++
}
```

### Build Times

| Language | Clean Build | Incremental Build | Binary Size |
|---|---|---|---|
| Go | 2-5 seconds | <1 second | 8-15 MB |
| Rust | 30-120 seconds | 3-10 seconds | ~12 MB |
| C++ | 60-300 seconds | 10-60 seconds | ~8 MB |

Rust's compile times are acknowledged as a trade-off. Mitigations:
- Cargo workspace with incremental compilation
- sccache for build caching
- `cargo check` for quick type-checking (30ms typical)

### Trade-offs Acknowledged

| Concern | Mitigation |
|---|---|
| Rust learning curve | Core team has Rust experience. Async Rust is stable (Tokio). |
| Compile times | Incremental builds are fast. sccache for CI. |
| Fewer AI/ML libraries | llmama-cpp-2 provides inference. Candle for training. |
| GUI not native | Tauri handles UI. Rust handles backend. |

## Consequences

1. All backend logic is in Rust, providing maximum performance and safety.
2. Frontend is TypeScript (React), providing rich UI capabilities.
3. Cargo workspace manages all Rust crates.
4. Build system is `cargo build` + `pnpm tauri build`.
5. Binary size target: <12 MB base, ~30 MB with sandbox bundled.

## Rust Crate Dependencies in Libern

The workspace is defined in the root `Cargo.toml`:

```toml
[workspace]
resolver = "2"
members = [
    "apps/desktop/src-tauri",
    "apps/sandbox",
    "crates/libern-core",
    "crates/libern-aioss",
]
```

### `libern-core` Dependencies (`crates/libern-core/Cargo.toml`)

| Crate | Version | Purpose |
|-------|---------|---------|
| serde | 1.x | Serialization framework |
| serde_json | 1.x | JSON serialization |
| rusqlite | 0.31 | SQLite database |
| sha2 | 0.10 | SHA-256 hashing |
| hex | 0.4 | Hex encoding |
| uuid | 1.x | UUID v4 generation |
| chrono | 0.4 | Timestamps |
| anyhow | 1.x | Error handling |
| thiserror | 1.x | Custom error types |
| log | 0.4 | Logging facade |

### `libern-aioss` Dependencies (`crates/libern-aioss/Cargo.toml`)

| Crate | Version | Purpose |
|-------|---------|---------|
| sha3 | 0.10 | SHA3-256 for audit chains |
| ed25519-dalek | 2 | Ed25519 signing |
| base64 | 0.22 | Key serialization |
| serde | 1.x | Serialization |
| serde_json | 1.x | JSON export |
| chrono | 0.4 | Timestamps |
| hex | 0.4 | Hex formatting |

### `apps/desktop/src-tauri` Dependencies

| Crate | Version | Purpose |
|-------|---------|---------|
| tauri | 2 | Desktop shell |
| tauri-plugin-opener | 2 | File/URL opening |
| libern-core | local | Core library |
| libern-aioss | local | .aioss format |

### `apps/sandbox` Dependencies (`apps/sandbox/Cargo.toml`)

| Crate | Version | Purpose |
|-------|---------|---------|
| wgpu | 0.19 | GPU rendering |
| winit | 0.30 | Window management |
| glam | 0.28 | 3D math |

## Memory Safety Comparison

| Bug class | C++ | Go | Rust |
|-----------|-----|----|------|
| Use-after-free | Runtime crash | Impossible (GC) | Compile-time error |
| Buffer overflow | Runtime vulnerability | Runtime bounds check | Compile-time check |
| Data race | Undefined behavior | Data race possible | Compile-time prevention |
| Null pointer deref | Runtime crash | Impossible | Option<T> pattern |
| Double free | Runtime crash | Impossible (GC) | Compile-time error |
| Memory leak | Manual management | GC | Ownership model |

## Concurrency Model Comparison

| Aspect | Go (goroutines) | Rust (async/await + threads) |
|--------|-----------------|------------------------------|
| Memory per task | ~4 KB goroutine stack | ~0 bytes (zero-cost async state machine) |
| Max tasks | Millions | Millions |
| Data sharing | Channels or mutex | Ownership + channels + mutex |
| Compile-time safety | No | Yes (Send + Sync traits) |
| GC pauses | 1-10ms | None |
| CPU overhead | Context switching | Poll-based, no syscall |

## Build System Comparison

| Feature | Go | Rust | C++ |
|---------|----|------|-----|
| Package manager | go mod | Cargo | vcpkg/Conan |
| Build tool | go build | Cargo | CMake/Meson |
| Test runner | go test | cargo test | GTest/Catch2 |
| Documentation | go doc | cargo doc | Doxygen |
| Formatting | gofmt | cargo fmt | clang-format |
| Linting | go vet | cargo clippy | clang-tidy |
| Benchmarking | go test -bench | cargo bench | Google Benchmark |

## Performance Characteristics

| Operation | Go | Rust | C++ |
|-----------|----|------|-----|
| String parsing | Slow (UTF-8 validation) | Fast (&str/slices) | Fast |
| JSON serialization | ~200 MB/s | ~500 MB/s | ~600 MB/s |
| SHA-256 hashing | ~400 MB/s | ~600 MB/s | ~700 MB/s |
| SQLite operations | via cgo wrapper | Direct rusqlite FFI | via C API |
| Audio encode (Opus) | via cgo | Direct opus crate | Direct |
| Cross-compilation | Easy | Easy | Painful |

## References

- `Cargo.toml` — Workspace configuration (4 Rust crates)
- `crates/libern-core/Cargo.toml` — Core dependencies
- `crates/libern-aioss/Cargo.toml` — .aioss format dependencies
- `apps/desktop/src-tauri/Cargo.toml` — Desktop app dependencies
- `apps/sandbox/Cargo.toml` — 3D sandbox (wgpu, winit)
- `build.bat` — Rust build orchestration
- `LIBERN_BUILD_PLAN.md` — Technology stack documentation

## Rust Code Patterns in Libern

### Pattern: Type-safe Error Handling

`ust
// Using thiserror for domain errors
#[derive(thiserror::Error, Debug)]
pub enum LibernError {
    #[error("Database error: {0}")]
    Database(#[from] rusqlite::Error),
    #[error("Not found: {0}")]
    NotFound(String),
    #[error("Permission denied")]
    PermissionDenied,
    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),
}

// Using anyhow for command handlers
pub type LibernResult<T> = Result<T, LibernError>;
`

### Pattern: Builder for Complex Configs

`ust
pub struct AppConfig {
    pub db_path: String,
    pub ai_model_path: Option<String>,
    pub log_level: String,
    pub p2p_port: u16,
}

impl AppConfig {
    pub fn builder() -> AppConfigBuilder {
        AppConfigBuilder::default()
    }
}

#[derive(Default)]
pub struct AppConfigBuilder {
    db_path: Option<String>,
    ai_model_path: Option<String>,
    log_level: Option<String>,
    p2p_port: Option<u16>,
}

impl AppConfigBuilder {
    pub fn db_path(mut self, path: &str) -> Self {
        self.db_path = Some(path.to_string());
        self
    }
    pub fn build(self) -> AppConfig {
        AppConfig {
            db_path: self.db_path.unwrap_or_else(|| "libern.db".into()),
            ai_model_path: self.ai_model_path,
            log_level: self.log_level.unwrap_or_else(|| "info".into()),
            p2p_port: self.p2p_port.unwrap_or(42068),
        }
    }
}
`

### Pattern: Command Enum for Dispatch

`ust
#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type", content = "payload")]
pub enum SyncCommand {
    Ping { nonce: u64 },
    SyncRequest { hlc_watermark: u64, server_ids: Vec<String> },
    SyncDelta { entries: Vec<SyncEntry> },
    SyncAck { entry_count: u32 },
    Disconnect { reason: String },
}

impl SyncCommand {
    pub fn handle(self, state: &mut SyncState) -> Result<SyncResponse, SyncError> {
        match self {
            SyncCommand::Ping { nonce } => Ok(SyncResponse::Pong { nonce }),
            SyncCommand::SyncRequest { hlc_watermark, server_ids } => {
                state.handle_sync_request(hlc_watermark, server_ids)
            }
            SyncCommand::SyncDelta { entries } => {
                state.handle_sync_delta(entries)
            }
            SyncCommand::SyncAck { entry_count } => {
                state.handle_sync_ack(entry_count)
            }
            SyncCommand::Disconnect { reason } => {
                state.handle_disconnect(reason)
            }
        }
    }
}
`

## Rust Compile-Time Safety Examples

### Memory Safety: No Use-After-Free

`ust
// This code will NOT compile in Rust:
fn use_after_free() {
    let v = vec![1, 2, 3];
    let ptr: &i32 = &v[0];
    drop(v);  // ERROR: cannot move out of  because it is borrowed
    // println!("{}", ptr);  // Would be UB in C/C++
}
`

### Thread Safety: No Data Races

`ust
// Rust prevents data races at compile time:
use std::sync::Mutex;

fn thread_safe_state() {
    let counter = Mutex::new(0u32);
    let data = Arc::new(counter);
    
    let handles: Vec<_> = (0..10).map(|_| {
        let data = Arc::clone(&data);
        std::thread::spawn(move || {
            let mut val = data.lock().unwrap();
            *val += 1;
        })
    }).collect();
    // Mutex ensures exclusive access — guaranteed by type system
}
`

### Ownership: No Memory Leaks

`ust
// RAII guarantees cleanup
pub struct DatabaseConnection {
    conn: rusqlite::Connection,
}

impl Drop for DatabaseConnection {
    fn drop(&mut self) {
        // Automatically called when scope exits
        // SQLite connection is closed, WAL checkpoint runs
    }
}
`

## Rust vs Go: Concurrency Patterns

| Pattern | Go | Rust |
|---------|----|------|
| Async IO | goroutine + channel | async/await + Tokio |
| Mutex | sync.Mutex | std::sync::Mutex |
| RWMutex | sync.RWMutex | std::sync::RwLock |
| Atomic | sync/atomic | std::sync::atomic |
| Channel | chan | tokio::sync::mpsc |
| WaitGroup | sync.WaitGroup | tokio::sync::Barrier |
| Once | sync.Once | std::sync::Once |

## Cargo Workspace Organization

Libern's workspace follows Rust best practices:

`
libern/
├── Cargo.toml              # Workspace root
├── crates/
│   ├── libern-core/        # Core library (CRDT, crypto, DB, AI)
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── crdt/
│   │       ├── crypto/
│   │       ├── db/
│   │       └── ai/
│   └── libern-aioss/       # .aioss binary format
│       ├── Cargo.toml
│       └── src/
├── apps/
│   ├── desktop/            # Tauri desktop app
│   │   └── src-tauri/
│   │       ├── Cargo.toml
│   │       └── src/
│   └── sandbox/            # 3D sandbox (wgpu)
│       ├── Cargo.toml
│       └── src/
└── build.bat               # Build orchestration
`

## Performance Benchmarks (Rust vs Go)

| Operation | Rust | Go | Notes |
|-----------|------|----|-------|
| JSON parse (100KB) | 50μs | 120μs | serde_json vs encoding/json |
| SHA-256 (1MB) | 1.2ms | 1.8ms | sha2 crate vs crypto/sha256 |
| SQLite insert (batch) | 3μs/row | 8μs/row | rusqlite vs database/sql + cgo |
| Ed25519 sign | 15μs | 35μs | ed25519-dalek vs cloudflare/ed25519 |
| Ed25519 verify | 25μs | 55μs | ed25519-dalek vs crypto/ed25519 |
| HTTP request | 2μs | 5μs | reqwest vs net/http |
| Binary size | 12MB | 8MB | Static linking vs Go runtime |

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
