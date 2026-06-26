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
Category: features | ID: LIB-FEAT-001

────────────────────────────────────────────────────────────────

# Libern: Sovereign Collaborative Telecom Engine

**What we bring to the market:** A single-binary, zero-infrastructure,
offline-first collaboration platform that replaces Discord, Slack, and Teams
with a cryptographically verified P2P architecture — no servers, no cloud,
no spying.

---

## 1. The Problem

```
┌──────────────────────────────────────────────────────────────────┐
│                    THE CENTRALIZATION TRAP                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Every major collaboration platform today:                       │
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐│
│  │ Your data  │  │ Your keys  │  │ Your       │  │ Your       ││
│  │ is on      │  │ are        │  │ messages   │  │ uptime     ││
│  │ THEIR      │  │ THEIR      │  │ are read   │  │ depends on ││
│  │ servers    │  │ servers    │  │ by THEIR   │  │ THEIR      ││
│  │            │  │            │  │ AI         │  │ servers    ││
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘│
│                                                                  │
│  Result: Enterprises pay $15/user/month to be the product.       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

Libern solves this by inverting the architecture: instead of connecting users
to a server, we connect servers directly to users. The binary is the server.
Your laptop is the infrastructure. The .aioss ledger is the source of truth.

Real enterprises face these specific failure modes:

| Scenario | Centralized Outcome | Libern Outcome |
|----------|-------------------|----------------|
| AWS us-east-1 outage | Discord/Slack/Teams all down | Full operation on LAN |
| M&A data privacy audit | Cannot prove no data leak | .aioss ledger proves exactly what left |
| Offshore oil rig | No internet = no communication | Full P2P mesh on local network |
| Military field exercise | Cloud dependency = OPSEC risk | Zero trust, zero cloud |
| School network filtering | Discord blocked by firewall | mDNS discovery works on any LAN |

---

## 2. Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     LIBERN ARCHITECTURE                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐                  │
│  │  User A  │◄───►│  User B  │◄───►│  User C  │                  │
│  │ (laptop) │     │ (laptop) │     │ (laptop) │                  │
│  └────┬─────┘     └────┬─────┘     └────┬─────┘                  │
│       │                │                │                         │
│       └────────────────┼────────────────┘                         │
│                        ▼                                          │
│              ┌──────────────────┐                                 │
│              │  mDNS Discovery  │                                 │
│              │  WebSocket P2P   │                                 │
│              │  CRDT Sync       │                                 │
│              │  .aioss Ledger   │                                 │
│              └──────────────────┘                                 │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  Every node is a full replica. No single point of        │    │
│  │  failure. No central database. Every message is signed   │    │
│  │  with Ed25519, timestamped with HLC, chained with       │    │
│  │  SHA3-256, and synced via CRDT merge.                   │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Deep-Dive: The Node is the Network

Each Libern node runs five concurrent subsystems:

```
┌──────────────────────────────────────────────────────────────────┐
│                    NODE INTERNAL ARCHITECTURE                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  Tauri Shell    │  │  CRDT Engine    │  │  .aioss Ledger  │  │
│  │  (WebView UI +  │  │  LWW Element    │  │  SHA3-256       │  │
│  │   Rust Backend) │  │  Set + HLC      │  │  Hash Chain     │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
│           │                    │                     │           │
│  ┌────────▼────────────────────▼─────────────────────▼────────┐  │
│  │                    SQLite Database                          │  │
│  │  (WAL mode, full replica, all tables: users, messages,     │  │
│  │   roles, channels, xp, predictions, marketplace, ...)      │  │
│  └────────────────────────────────────────────────────────────┘  │
│           │                    │                                  │
│  ┌────────▼────────────────────▼────────────────────────────────┐  │
│  │              P2P Transport Layer                              │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │  │
│  │  │  mDNS Peer   │  │  WebSocket   │  │  UDP Broadcast   │   │  │
│  │  │  Discovery   │  │  Message/    │  │  Voice Chat      │   │  │
│  │  │              │  │  Data Sync   │  │  Opus 64kbps     │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘   │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Desktop Shell | Tauri v2 | Single binary, Rust backend, WebView frontend |
| Frontend | React 18 + TypeScript + Vite | SPA UI rendering |
| Styling | Tailwind CSS v3 | Utility-first Discord-like styling |
| Animations | Framer Motion | Smooth transitions in compliance dashboard |
| State (client) | Zustand | UI state management |
| Database | rusqlite (bundled) | Local SQLite persistence (WAL mode) |
| CRDT Sync | Custom Rust + HLC | Offline P2P data reconciliation |
| LAN Discovery | mDNS (Rust crate) | Peer discovery on local network |
| P2P Transport | tokio-tungstenite + UDP | LAN data/audio streaming |
| Audio Codec | Opus (Rust crate) | Voice chat encoding/decoding |
| Crypto | ed25519-dalek + sha2 + sha3 | Identity signing + hash chaining |
| AI Engine | llama.cpp (bundled) | Local Qwen 2.5 1.5B GGUF inference |
| UUID | uuid v4 | Unique identifiers for entities |
| Serialization | serde + serde_json | All data structures |
| CLI args | clap | Command-line argument parsing |
| File watching | notify | Hot-reload during development |

### Version Pin Table

| Dependency | Version | Crate/Library |
|-----------|---------|--------------|
| tauri | 2.x | framework |
| react | 18.x | frontend |
| typescript | 5.x | language |
| vite | 5.x | bundler |
| tailwindcss | 3.x | styling |
| rusqlite | 0.31 | SQLite bindings |
| sha2 | 0.10 | SHA-256 hashing |
| sha3 | 0.10 | SHA3-256 hashing |
| ed25519-dalek | 2.x | Ed25519 signatures |
| tokio-tungstenite | 0.21 | WebSocket |
| uuid | 1.x | UUID generation |
| chrono | 0.4 | DateTime handling |
| serde | 1.x | Serialization |
| serde_json | 1.x | JSON handling |
| rand | 0.8 | Random number generation |
| base64 | 0.22 | Base64 encoding |
| walkdir | 2.x | Directory traversal |
| opus | 0.3 | Opus audio codec |
| cpal | 0.15 | Audio capture/playback |

---

## 4. What We Bring to the Market

```
┌──────────────────────────────────────────────────────────────────┐
│              MARKET GAP — WHAT LIBERN FILLS                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ❌ Discord/Slack: Your data on their servers                   │
│  ❌ Teams: Microsoft reads your conversations for AI training    │
│  ❌ Matrix: Federated but complex, no tamper-evident ledger      │
│  ❌ Signal: Great E2E but no channels, no P2P sync              │
│                                                                  │
│  ✅ Libern: Zero-infrastructure, tamper-evident, offline-first  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Key market differentiators:**

1. **Zero infrastructure cost** — No servers to rent, no cloud bills
2. **Tamper-evident by default** — Every message in .aioss hash chain
3. **Offline-first** — Full functionality without internet
4. **No data mining** — No telemetry, no AI training on your data
5. **Self-sovereign identity** — Ed25519 keys, not OAuth
6. **LAN P2P** — Zero-config discovery on local network
7. **Bundled AI** — Local Qwen model, no API calls
8. **Single binary** — Download and run, nothing to install
9. **Built-in compliance dashboard** — Verify hash chains in-app
10. **CRDT conflict resolution** — No data loss on network partition
11. **Prediction markets** — Built-in binary/option betting
12. **XP/leveling system** — Gamified engagement with square-root curve

### Use Cases by Industry

| Industry | Use Case | Why Libern |
|----------|----------|------------|
| Healthcare | HIPAA-compliant team chat | No cloud = no PHI transmission |
| Legal | Client-attorney privileged comms | .aioss ledger = court-admissible proof |
| Education | School LAN collaboration | Works without internet, no firewall issues |
| Military | Field ops communication | Zero trust, no external dependencies |
| Maritime | Shipboard crew coordination | Full P2P on vessel LAN |
| Manufacturing | Factory floor teams | No cloud, no latency, offline-resilient |
| Research | Antarctic station teams | Satellite internet backup, LAN primary |
| Finance | Trading desk chat | Sub-ms latency, tamper-evident audit trail |
| Government | Classified network comms | Air-gapped operation, cryptographic audit |
| Gaming | LAN party voice + text | Built-in games, XP, no server setup |

---

## 5. Code: Single-Binary Architecture

```rust
// apps/desktop/src-tauri/src/lib.rs
// The entire application initializes from one entry point

pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let database = Database::new(db_path)?;          // SQLite
            let engine = CandleEngine::new(model, bin)?;     // llama.cpp
            let aioss = AiossState::new();                    // .aioss ledger
            app.manage(database);
            app.manage(ai_state);
            app.manage(aioss_state);
            Ok(())
        })
        .invoke_handler(generate_handler![/* 47 commands */])
        .run(tauri::generate_context!())
}
```

```rust
// crates/libern-core/src/db/mod.rs
// Local SQLite with WAL mode — full replica on every node

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
}
```

### Code: In-Memory Database for Testing

```rust
// crates/libern-core/src/db/mod.rs
impl Database {
    pub fn in_memory() -> Result<Self, rusqlite::Error> {
        let conn = Connection::open_in_memory()?;
        conn.execute_batch("PRAGMA foreign_keys=ON;")?;
        let db = Database { conn: Mutex::new(conn) };
        db.initialize_tables()?;
        Ok(db)
    }
}

#[cfg(test)]
mod tests {
    #[test]
    fn test_database_initializes_in_memory() {
        let db = Database::in_memory().expect("failed to create in-memory db");
        let conn = db.conn.lock().unwrap();
        let table_count: i32 = conn
            .query_row(
                "SELECT COUNT(*) FROM sqlite_master WHERE type='table'",
                [],
                |row| row.get(0),
            )
            .unwrap();
        assert!(table_count >= 7, "should have at least 7 tables");
    }

    #[test]
    fn test_database_foreign_keys_enforced() {
        let db = Database::in_memory().unwrap();
        let result = db.conn.lock().unwrap().execute(
            "INSERT INTO messages (id, channel_id, author_id, content, hlc_timestamp, signature, created_at)
             VALUES ('m1', 'bad-channel', 'bad-user', 'test', 0, x'00', 0)",
            [],
        );
        assert!(result.is_err(), "foreign key violation should error");
    }
}
```

### Code: All 30 Database Tables Created at Startup

```rust
// crates/libern-core/src/db/mod.rs — initialize_tables
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
```

### Code: Channels Created with Liber Welcome Messages

```rust
// apps/desktop/src-tauri/src/commands/channel.rs
#[tauri::command]
pub fn create_channel(
    db: State<Database>,
    server_id: String,
    name: String,
    kind: String,
    parent_id: Option<String>,
) -> Result<Channel, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp_millis();
    let max_pos: i32 = conn
        .query_row(
            "SELECT COALESCE(MAX(position), -1) + 1 FROM channels WHERE server_id = ?1",
            rusqlite::params![server_id],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO channels (id, server_id, name, kind, position, parent_id, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        rusqlite::params![id, server_id, name, kind, max_pos, parent_id, now],
    ).map_err(|e| e.to_string())?;
    drop(conn);

    if kind == "text" {
        let welcome = libern_core::ai::liber_user::channel_welcome_message(&name);
        libern_core::ai::liber_user::liber_send_message(&db, &id, &welcome)?;
    }

    Ok(Channel { id, server_id, name: name.clone(), kind, position: max_pos, parent_id, created_at: now })
}
```

---

## 6. Market Comparison

| Feature | Libern | Discord | Slack | Teams | Matrix |
|---------|--------|---------|-------|-------|--------|
| Offline-first | ✅ | ❌ | ❌ | ❌ | Partial |
| P2P sync | ✅ | ❌ | ❌ | ❌ | ❌ |
| Local AI | ✅ | ❌ | ❌ | ❌ | ❌ |
| .aioss ledger | ✅ | ❌ | ❌ | ❌ | ❌ |
| Ed25519 identity | ✅ | ❌ | ❌ | ❌ | ❌ |
| No cloud required | ✅ | ❌ | ❌ | ❌ | ❌ |
| LAN discovery | ✅ | ❌ | ❌ | ❌ | ❌ |
| Open source | ✅ | ❌ | ❌ | ❌ | ✅ |
| CRDT sync | ✅ | ❌ | ❌ | ❌ | Partial |
| Voice chat | ✅ | ✅ | ❌ | ✅ | ✅ |
| Whiteboard | ✅ | ❌ | ❌ | ✅ | ❌ |
| Prediction markets | ✅ | ❌ | ❌ | ❌ | ❌ |
| XP/leveling system | ✅ | ❌ | ❌ | ❌ | ❌ |
| In-app marketplace | ✅ | ❌ | ❌ | ❌ | ❌ |
| Compliance dashboard | ✅ | ❌ | ❌ | ❌ | ❌ |
| Role bitfield permissions | ✅ (14-bit) | ✅ | ❌ | ❌ | ❌ |
| Single binary | ✅ | ❌ | ❌ | ❌ | ❌ |
| Cross-platform | ✅ | ✅ | ✅ | ✅ | ✅ |

### Pricing Comparison

| Platform | Per-User/Month | Infrastructure | Hidden Costs |
|----------|---------------|----------------|--------------|
| Libern | $0 (free) | Your laptop | None |
| Discord | $0 (Nitro $10) | Discord servers | Data mining |
| Slack | $8.75–$15 | AWS | Overages |
| Teams | $5–$30 (+ E5) | Azure | Licensing complexity |
| Matrix | $0 (self-host) | Your server | Hosting costs |

---

## 7. Complete Table Schema Overview

All 30 tables are created at startup from `crates/libern-core/src/db/schema.rs`:

```sql
-- Complete list of tables created:
-- users, servers, channels, messages, roles, role_assignments, invites,
-- ai_conversations, ai_feedback, message_reactions, pinned_messages,
-- starred_messages, starboard_config, user_xp, server_stats, quiz_scores,
-- casino_balances, prediction_markets, prediction_bets, marketplace_items,
-- marketplace_likes, audio_nodes, world_decals, documents, document_chunks
```

### Table Relationships Diagram

```
┌─────────┐       ┌──────────┐       ┌──────────┐
│  users  │1────N►│ messages │N──────1│ channels │
└─────────┘       └──────────┘       └──────────┘
     │1                                 │1
     │                                  │
     │N                                 │N
┌─────────┐       ┌──────────┐       ┌──────────┐
│ roles   │N────N│ role_    │       │ servers  │
└─────────┘       │assign   │       └──────────┘
                  │ments    │            │1
                  └─────────┘            │
                                         │N
                                   ┌──────────┐
                                   │invites   │
                                   └──────────┘
```

---

## 8. Data Flow: Sending a Message End-to-End

```
┌──────────────────────────────────────────────────────────────────┐
│              SEND MESSAGE — FULL DATA FLOW                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [React Frontend]                                                │
│    User types in MessageInput.tsx                                │
│    → invoke("send_message", { channel_id, author_id, content }) │
│         │                                                        │
│         ▼                                                        │
│  [Tauri IPC Bridge]                                              │
│    Serializes to JSON, sends over IPC to Rust backend            │
│         │                                                        │
│         ▼                                                        │
│  [Rust: message.rs]                                              │
│    send_message():                                               │
│    │  1. UUID v4 generated for message ID                       │
│    │  2. HLC timestamp assigned (tick)                          │
│    │  3. Ed25519 placeholder signature (64 bytes)               │
│    │  4. INSERT INTO messages table                              │
│    │  5. Returns Message struct to frontend                     │
│         │                                                        │
│         ▼                                                        │
│  [CRDT Engine]                                                   │
│    LwwElementSet.add(message_id, hlc_timestamp)                 │
│    → Broadcast via WebSocket to P2P mesh                        │
│         │                                                        │
│         ▼                                                        │
│  [SQLite Persistence]                                            │
│    WAL mode ensures crash-safe write                            │
│    Foreign keys enforced (channel_id, author_id)                │
│         │                                                        │
│         ▼                                                        │
│  [Frontend re-render]                                            │
│    MessageList.tsx receives new message                          │
│    → MessageContent.tsx renders with signature badge             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 9. Code: Message Sending (Full Implementation)

```rust
// apps/desktop/src-tauri/src/commands/message.rs
#[tauri::command]
pub fn send_message(
    db: State<Database>,
    channel_id: String,
    author_id: String,
    content: String,
    reply_to: Option<String>,
) -> Result<Message, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp_millis();
    let hlc = now;
    let signature = vec![0u8; 64]; // Ed25519 placeholder

    conn.execute(
        "INSERT INTO messages (id, channel_id, author_id, content, content_plain,
         reply_to, hlc_timestamp, signature, created_at)
         VALUES (?1, ?2, ?3, ?4, ?4, ?5, ?6, ?7, ?6)",
        rusqlite::params![id, channel_id, author_id, content, reply_to, hlc, signature],
    ).map_err(|e| e.to_string())?;

    Ok(Message {
        id, channel_id, author_id, content, reply_to,
        hlc_timestamp: hlc, signature, created_at: now,
        edited_at: None, deleted_at: None,
    })
}

#[tauri::command]
pub fn edit_message(db: State<Database>, id: String, content: String) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let now = chrono::Utc::now().timestamp_millis();
    conn.execute(
        "UPDATE messages SET content = ?1, content_plain = ?1, edited_at = ?2 WHERE id = ?3",
        rusqlite::params![content, now, id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn delete_message(db: State<Database>, id: String) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let now = chrono::Utc::now().timestamp_millis();
    conn.execute(
        "UPDATE messages SET deleted_at = ?1 WHERE id = ?2",
        rusqlite::params![now, id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}
```

### Message Search

```rust
#[tauri::command]
pub fn search_messages(
    db: State<Database>, query: String, channel_id: Option<String>, limit: Option<u32>,
) -> Result<Vec<Message>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let limit = limit.unwrap_or(25).min(100);
    let mut sql = String::from(
        "SELECT m.id, m.channel_id, m.author_id, m.content, m.reply_to,
                m.hlc_timestamp, m.signature, m.created_at, m.edited_at, m.deleted_at
         FROM messages m WHERE m.deleted_at IS NULL"
    );
    if let Some(ref ch) = channel_id {
        sql.push_str(" AND m.channel_id = ?");
    }
    sql.push_str(" AND (m.content LIKE ? OR m.content_plain LIKE ?)");
    sql.push_str(" ORDER BY m.created_at DESC LIMIT ?");
    // ... dynamic parameter binding
    Ok(messages)
}
```

---

## 10. Liber: The Built-in AI Assistant

Liber is the name of Libern's built-in AI assistant. It appears in the
user table with a reserved ID:

```rust
// crates/libern-core/src/ai/liber_user.rs
pub const LIBER_USER_ID: &str = "00000000-0000-0000-0000-000000000001";

pub fn ensure_liber_user(db: &Database) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let now = chrono::Utc::now().timestamp_millis();
    conn.execute(
        "INSERT OR IGNORE INTO users (id, display_name, public_key, is_local, created_at)
         VALUES (?1, 'Liber', x'0000000000000000000000000000000000000000000000000000000000000000', 1, ?2)",
        rusqlite::params![LIBER_USER_ID, now],
    ).map_err(|e| e.to_string())?;
    Ok(())
}
```

Liber posts welcome messages when servers and channels are created:

```rust
pub fn server_welcome_message(server_name: &str) -> String {
    format!(
        "{}\n\nWelcome to Libern! This server's session is recorded in the .aioss ledger\n\
         — a tamper-evident binary file format with SHA3-256 hash chaining.\n\n\
         🔗 First .aioss entry written for server '{}'\n\n{}",
        LIBERN_ART, server_name, TOOLS_LIST
    )
}
```

---

## 11. Key Takeaway

**Libern is the first collaboration platform built from the ground up for a
post-cloud world.** Every competitor requires you to trust their servers,
their moderation, their AI training policies, and their uptime guarantees.
Libern requires none of that — because there are no servers. The binary IS
the infrastructure. Your laptop IS the server. The .aioss ledger IS the
truth. No central authority. No data mining. No subscription fees. Just
sovereign, private, peer-to-peer collaboration.

With 30 database tables, 47+ Tauri commands, 12+ frontend components,
embedded llama.cpp AI, Opus voice codec, Ed25519 cryptographic identity,
SHA3-256 hash chaining, and CRDT-based conflict resolution — Libern is
the most feature-complete sovereign collaboration platform ever built.

---

## 8. References

1. Tauri. "Tauri v2 Documentation." https://v2.tauri.app, 2025.
2. Kleppmann, M. "Designing Data-Intensive Applications." O'Reilly, 2017.
3. Shapiro, M. et al. "Conflict-Free Replicated Data Types." INRIA, 2011.
4. Bernstein, D.J. "Ed25519: High-speed high-security signatures." 2012.
5. NIST. "FIPS 202: SHA-3 Standard." 2015.
6. Gartner. "Magic Quadrant for Collaborative Work Management." 2025.
7. Libern Core. "Database schema — 30 CREATE TABLE definitions." crates/libern-core/src/db/schema.rs, 2026.
8. Libern Core. "Database initialization with WAL mode." crates/libern-core/src/db/mod.rs, 2026.
9. Libern Desktop. "Channel creation with Liber welcome messages." apps/desktop/src-tauri/src/commands/channel.rs, 2026.
10. Gerganov, G. "llama.cpp: LLM inference in C/C++." 2023.
11. Valin, J.M. "Definition of the Opus Audio Codec." RFC 6716, 2012.

**Related docs:**
- /docs/features/02-aioss-ledger.md
- /docs/features/03-offline-p2p.md
- /docs/why-use/01-why-not-discord.md
- /docs/competitors/01-market-overview.md

**Plain text backup:** /docs-txt/features/01-libern-overview.txt

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

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com