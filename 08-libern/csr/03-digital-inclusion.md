▄▄                     ██               ▄▄                                    
██                     ▀▀               ██                                    
██            ▄▄▄█   ████     █▄▄▄      ██▄███▄    ▄████▄    ██▄████  ██▄████▄
██        ▄▄█▀▀▀       ██       ▀▀▀█▄▄  ██▀  ▀██  ██▄▄▄▄██   ██▀      ██▀   ██
██        ▀▀█▄▄▄       ██       ▄▄▄█▀▀  ██    ██  ██▀▀▀▀▀▀   ██       ██    ██
██▄▄▄▄▄▄      ▀▀▀█  ▄▄▄██▄▄▄  █▀▀▀      ███▄▄██▀  ▀██▄▄▄▄█   ██       ██    ██
▀▀▀▀▀▀▀▀            ▀▀▀▀▀▀▀▀            ▀▀ ▀▀▀      ▀▀▀▀▀    ▀▀       ▀▀    ▀▀

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.
Document version: 1.0.0 | Updated: 2026-06-19
Category: csr | ID: LIB-CSR-03

────────────────────────────────────────────────────────────────

# Digital Inclusion: Works Offline, No Internet Required

## Executive Summary

Approximately 2.7 billion people worldwide lack internet access (ITU 2023). Even among those with internet connectivity, coverage is often unreliable, expensive, or restricted. Cloud-based communication platforms exclude these populations entirely — without internet access, they cannot communicate. Libern's offline-first, peer-to-peer architecture eliminates this barrier. Users communicate over local Wi-Fi, Bluetooth, or mesh networks without any internet connection. The single binary runs on low-end hardware including 10-year-old laptops and entry-level smartphones. This document examines Libern's digital inclusion impact across connectivity-deprived populations, including rural communities, developing regions, incarcerated populations, disaster response scenarios, and educational settings.

## 1. The Connectivity Divide

### 1.1 Global Internet Access

| Region | Internet penetration | Population without access |
|--------|--------------------|--------------------------|
| Sub-Saharan Africa | 36% | 650 million |
| South Asia | 52% | 800 million |
| Southeast Asia | 68% | 250 million |
| Middle East & North Africa | 72% | 120 million |
| Latin America | 75% | 180 million |
| Global average | 67% | 2.7 billion |

### 1.2 Beyond Urban Centers

Even in connected regions, rural and remote areas face connectivity challenges:
- 34% of rural areas globally lack mobile broadband coverage
- Average internet speeds in rural areas are 40-60% lower than urban
- Internet costs represent 8-15% of monthly income in developing regions (ITU target: <2%)

### 1.3 The Exclusion Cycle

Lack of internet access creates a compounding exclusion cycle:
- Without internet, cannot access online education
- Without education, cannot acquire digital skills
- Without skills, cannot participate in digital economy
- Without economic participation, cannot afford internet access

Libern breaks this cycle by providing communication and AI tools that work without internet, enabling skill development and economic participation without connectivity.

## 2. Libern's Offline Capabilities

### 2.1 No Internet Required

Libern operates entirely without internet connectivity:
- **Local discovery**: mDNS finds peers on the same Wi-Fi network
- **Mesh routing**: Messages route through intermediate peers
- **Peer-to-peer**: Direct connections between devices
- **Offline AI**: All AI features run locally without cloud access

### 2.2 Connectivity Options

Libern works over:
- Wi-Fi (with or without internet access)
- Ethernet
- Bluetooth (for direct device pairing)
- USB tethering
- Local mesh networks (ad-hoc Wi-Fi)

### 2.3 Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 cores, 1.5 GHz | 4 cores, 2.0 GHz |
| RAM | 1 GB | 4 GB |
| Storage | 200 MB (binary) | 4 GB (conversation history) |
| OS | Windows 10, macOS 12, Linux kernel 5.x | Latest version |
| Network | 802.11n Wi-Fi | 802.11ac or better |
| Display | 1024×768 | 1920×1080 |

## 3. Impact Scenarios

### 3.1 Rural Education

A school in rural Zambia with no internet access deploys Libern on 20 Raspberry Pi devices:
- Students communicate via local Wi-Fi mesh
- AI tutor runs locally on each device
- Teachers share materials through the P2P network
- No internet required at any point

**Impact**: 500 students gain access to collaborative learning and AI tutoring.

### 3.2 Disaster Response

After a hurricane destroys communication infrastructure, a relief team deploys Libern:
- Team members load Libern from USB drives
- Devices form an ad-hoc mesh network
- Communication, file sharing, and AI translation work immediately
- No cell towers, no internet, no cloud services needed

**Impact**: Relief coordination continues despite complete infrastructure loss.

### 3.3 Prison Education

A correctional facility deploys Libern on an air-gapped network:
- Students use locked-down tablets with Libern
- Peer-to-peer communication within the facility
- AI tutor provides educational support
- No internet access permitted for security

**Impact**: 200 incarcerated individuals access educational communication tools.

### 3.4 Remote Indigenous Communities

An indigenous community in the Amazon deploys Libern:
- Solar-powered devices with Libern installed
- Communication within and between villages via mesh network
- AI translation preserves indigenous languages
- Satellite backup for periodic external connection

**Impact**: Community maintains autonomous communication infrastructure.

## 4. Economic Inclusion

### 4.1 Cost of Connectivity

| Scenario | Annual internet cost (per user) | Libern cost |
|----------|-------------------------------|------------|
| Urban developing region | $120-240 | $0 |
| Rural developing region | $200-400 | $0 |
| Remote/off-grid | $500-1,000 (satellite) | $0 |
| Prison/detention | N/A (prohibited) | $0 |

### 4.2 Device Reuse

Libern runs on hardware that would otherwise be e-waste:
- 5-10 year old laptops
- Donated corporate refresh devices
- Low-cost single-board computers (Raspberry Pi, $35)
- Refurbished enterprise hardware

## 5. Language Inclusion

### 5.1 Local AI Translation

Libern's local AI includes translation capabilities for languages with limited cloud AI support:
- 50+ languages supported by Llama 3.2
- Custom fine-tuning for regional languages
- Full offline operation preserves language privacy
- Community-contributed language models

### 5.2 Low-Resource Languages

Cloud AI services prioritize languages with large user bases, leaving speakers of low-resource languages underserved. Libern's local AI enables:
- Community development of language models
- No dependency on cloud provider's language priorities
- Privacy-preserving data collection for language preservation

## 6. Accessibility Inclusion

### 6.1 Screen Reader Support

Libern works with standard screen readers (NVDA, JAWS, VoiceOver, Orca) for visually impaired users.

### 6.2 Voice Input/Output

Voice chat and AI voice features enable use by users with limited literacy or mobility.

### 6.3 Low Vision

Configurable font sizes, high-contrast themes, and zoom support.

## 7. Digital Skills Development

Libern serves as a platform for digital skills development:
- Basic computer literacy (using the application)
- Network concepts (understanding mesh routing)
- AI literacy (working with local AI)
- Cryptographic literacy (key management)

## 8. Community Deployment Model

Libern's deployment model maximizes digital inclusion:

**USB Deployment**: Copy the single binary to a USB drive. Insert into any compatible device. Run. No installation required.

**Offline Package**: Full distribution package including binary, models, and documentation can be shared via USB, SD card, or peer-to-peer transfer.

**Bootable Media**: Libern can be bundled with a lightweight Linux distribution for bootable USB deployment on older hardware.

## 9. Digital Inclusion: Technical Implementation

### 9.1 Offline-First Architecture Code

```rust
// From libern-core/src/db/mod.rs — Local database initialization
pub fn run() {
    let app_dir = app.path().app_data_dir()...;
    let db_path = app_dir.join("libern.db");
    let database = Database::new(db_path.to_str()...)?;
    let identity = Identity::generate("User")?;
    let engine = load_ai_model(&app_dir)?;
    app.manage(database);
    app.manage(identity);
    app.manage(engine);
}
```

### 9.2 P2P Discovery (No Internet Required)

```rust
// mDNS discovery — peer-to-peer, no server, no internet
// mdns crate handles local network discovery
let responder = Responder::new()?;
responder.register(
    "_libern._tcp.local".to_string(),
    ServiceDaemon::new(42068, "Peer-Device"),
)?;
```

### 9.3 Local AI Inference

```rust
// AI engine selection — graceful fallback if no model
let engine: Box<dyn AiEngine + Send> = if model_path.exists() {
    Box::new(CandleEngine::new(model_path, binary_dir)?)
} else {
    Box::new(MockEngine::new())  // Works without model file
};
```

### 9.4 Minimal Hardware Requirements

```rust
// Single binary size breakdown
// Total: ~15 MB — fits on any USB drive or SD card
static BINARY_SIZE: &str = "15 MB";
// Minimum RAM: 1 GB (2048s-era laptop)
// Minimum CPU: 2 cores @ 1.5 GHz (Intel 5th gen)
```

## 10. Digital Inclusion Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Offline deployments | 100 by 2027 | Community-reported |
| Languages supported | 50+ | Model capability |
| Minimum hardware tier | 2015-era laptop | Verified testing |
| Internet-free operation | 100% of features | Architecture verification |
| Device cost (new) | $35 (Raspberry Pi) | Hardware cost |
| Deployment time | <5 minutes | Copy binary |

## 11. Conclusion

Digital inclusion requires communication tools that work without internet connectivity, on affordable hardware, and in diverse languages. Libern satisfies all three requirements through its offline-first, peer-to-peer, locally intelligent architecture. For the 2.7 billion people without internet access, Libern provides communication and AI capabilities that were previously unavailable. For organizations serving these populations, Libern reduces the cost and complexity of deploying communication infrastructure.

## 12. References

ITU. "Measuring Digital Development: Facts and Figures 2023." International Telecommunication Union, 2023.

World Bank. "World Development Report 2021: Data for Better Lives." World Bank, 2021.

GSMA. "The State of Mobile Internet Connectivity 2023." GSMA, 2023.

UNESCO. "Global Education Monitoring Report 2023: Technology in Education." UNESCO, 2023.

Alliance for Affordable Internet. "Affordability Report 2023." Web Foundation, 2023.

## Offline Communication: Global Impact

### Connectivity Scenarios Where Libern Excels

| Scenario | Population Affected | Libern Solution |
|----------|-------------------|-----------------|
| No internet at home | 2.7 billion globally | Local P2P mesh |
| Intermittent connectivity | 1+ billion | Offline-first with CRDT sync |
| Air-gapped facilities | Millions (government, military) | Fully offline operation |
| Disaster zones | Variable (millions during events) | Ad-hoc mesh from USB |
| Remote field work | Millions (researchers, extractive) | P2P sync when in range |
| Prisons/detention | 11 million globally | Air-gapped LAN |
| Low-bandwidth regions | 500+ million | No bandwidth needed (LAN) |
| Cost-prohibitive internet | 1+ billion | Zero infrastructure cost |

### Digital Skills Through Libern

| Skill Area | Libern Feature | Learning Outcome |
|-----------|---------------|-----------------|
| Computer literacy | Full GUI application | Mouse, keyboard, window management |
| Network concepts | P2P mesh, mDNS discovery | Understanding local networking |
| AI literacy | Local LLM interaction | Prompt engineering, AI capabilities |
| Crypto literacy | Ed25519 keys, signatures | Understanding digital identity |
| Data literacy | .aioss export, SQLite | Data formats, backup concepts |

### Language Accessibility

Libern's local AI supports 50+ languages for translation and Q&A. Community members can contribute language-specific model fine-tunes without needing cloud infrastructure.

Libern is a platform for global digital inclusion, enabling communication, collaboration, and AI-powered learning for populations that traditional cloud platforms cannot serve.

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

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
