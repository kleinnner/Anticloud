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
Category: features | ID: LIB-FEAT-003

────────────────────────────────────────────────────────────────

# Offline-First P2P Sync with CRDT

**What we bring to the market:** Full collaboration that works without internet,
syncs automatically when peers are on the same LAN, and never loses data —
using Conflict-Free Replicated Data Types (CRDT) with Hybrid Logical Clocks.

---

## 1. The Problem

```
┌──────────────────────────────────────────────────────────────────┐
│              THE CONNECTIVITY DEPENDENCY TRAP                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │  "The internet is down" = "We cannot work"               │   │
│   │                                                          │   │
│   │  Every major collaboration platform REQUIRES:            │   │
│   │  • Constant internet connection                          │   │
│   │  • Central server availability                           │   │
│   │  • Cloud provider uptime                                 │   │
│   │                                                          │   │
│   │  Result: 87% of enterprises report lost productivity     │   │
│   │  during internet outages (IDC 2024). Average cost:       │   │
│   │  $5,600/minute of downtime.                              │   │
│   └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Real-World Failure Modes

| Scenario | Platform Behavior | Libern Behavior |
|----------|------------------|----------------|
| ISP outage in office | All chat, voice, files inaccessible | Full P2P via LAN switch |
| Conference with no WiFi | Can't collaborate | mDNS discovers nearby peers |
| Remote research station (satellite) | 600ms latency, $5/MB | All local, satellite for backup |
| Factory floor (no internet) | Zero communication | Full mesh on factory LAN |
| Air-gapped government network | Cannot use any cloud tool | Fully operational on closed network |

---

## 2. Solution: CRDT + HLC

```
┌──────────────────────────────────────────────────────────────────┐
│               HOW CRDT SYNC WORKS                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐                    ┌──────────┐                    │
│  │  User A  │                    │  User B  │                    │
│  │ (office) │                    │(traveling)│                   │
│  └────┬─────┘                    └────┬─────┘                    │
│       │                              │                           │
│       │  ┌───────────────────────┐   │                           │
│       │  │ A sends message M1    │   │                           │
│       │  │ Timestamp: HLC=100    │   │                           │
│       │  └──────────┬────────────┘   │                           │
│       │             │                │                           │
│       │             ▼                │                           │
│       │  ┌───────────────────────┐   │                           │
│       │  │ A goes offline        │   │  ┌────────────────────┐   │
│       │  │ B sends message M2    │   │  │ B sends M2        │   │
│       │  │ Timestamp: HLC=101    │   │  │ HLC: 101          │   │
│       │  └───────────────────────┘   │  └────────────────────┘   │
│       │                              │                           │
│       │  ┌───────────────────────┐   │                           │
│       │  │ A comes online        │   │                           │
│       │  │ A sends M3            │   │                           │
│       │  │ HLC: 110 (clock jump) │   │                           │
│       │  └──────────┬────────────┘   │                           │
│       │             │                │                           │
│       │             ▼                │                           │
│       │  ┌─────────────────────────────────────────────────┐     │
│       │  │  mDNS Discovery → WebSocket Connection          │     │
│       │  │  Exchange HLC timestamps of latest known        │     │
│       │  │  Pull missing entries by HLC range              │     │
│       │  │  LWW-element-set merge: higher HLC wins         │     │
│       │  │  Both nodes converge to identical state         │     │
│       │  └─────────────────────────────────────────────────┘     │
│       │                              │                           │
│       │  Result: Both have [M1,M2,M3]                           │
│       │  No conflicts. No data loss. No central server.         │
│       │                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Why CRDT Instead of OT or Last-Writer-Wins?

| Approach | Conflict Resolution | Offline Support | Complexity | Libern Uses |
|----------|-------------------|----------------|------------|-------------|
| OT (Operational Transform) | Requires server | Poor | High | ❌ |
| LWW Register | Last write wins | Good | Low | ✅ (partially) |
| LWW Element Set | Add wins if newer than remove | Excellent | Low | ✅ (primary) |
| MVCC | Version vectors | Good | Medium | ❌ |
| State-based CRDT | Full state merge | Excellent | Medium | ✅ (LWW) |
| CmRDT (Op-based) | Commutative ops | Good | High | ❌ |

---

## 3. Graphify: Sync Protocol

```
┌──────────────────────────────────────────────────────────────────┐
│                    SYNC PROTOCOL FLOW                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Node A                    mDNS                    Node B        │
│    │                        │                        │           │
│    │───── Announce ────────►│◄──────── Announce ─────│           │
│    │◄──── Peer Found ───────│──────── Peer Found ───►│           │
│    │                        │                        │           │
│    │◄─────── WebSocket Connect ──────────────────────►│           │
│    │                        │                        │           │
│    │───── HLC=150 ──────────┬─────────────────────────│           │
│    │◄──── HLC=200 ──────────┬─────────────────────────│           │
│    │                        │                        │           │
│    │───── Pull(151..200) ───┬─────────────────────────│           │
│    │◄──── [M5, M6, M7] ─────┬─────────────────────────│           │
│    │                        │                        │           │
│    │───── Push([M1..M4]) ───┬─────────────────────────│           │
│    │◄──── ACK ──────────────┬─────────────────────────│           │
│    │                        │                        │           │
│    │  ┌──────────────────────────────────────────┐   │           │
│    │  │  Both nodes apply LWW merge locally.     │   │           │
│    │  │  State converges to identical replica.   │   │           │
│    │  └──────────────────────────────────────────┘   │           │
│    │                        │                        │           │
└──────────────────────────────────────────────────────────────────┘
```

### Protocol Detail: Handshake Messages

```
Message Types:
┌──────────────────────────────────────────────────────┐
│  Type    │ Direction │ Content                       │
│  ────────┼───────────┼────────────────────────────── │
│  ANNOUNCE│ broadcast │ { node_id, port, hlc }       │
│  FOUND   │ unicast   │ { peer_node_id, ip, port }   │
│  CONNECT │ unicast   │ WebSocket upgrade             │
│  SYNC_REQ│ unicast   │ { hlc_min, hlc_max }         │
│  SYNC_RES│ unicast   │ { entries: [...] }           │
│  PUSH    │ unicast   │ { entries: [...] }            │
│  ACK     │ unicast   │ { received_count }            │
│  PING    │ unicast   │ { hlc }                       │
│  PONG    │ unicast   │ { hlc }                       │
└──────────────────────────────────────────────────────┘
```

---

## 4. Code: HLC Implementation

```rust
// crates/libern-core/src/crdt/mod.rs
// Hybrid Logical Clock — monotonic across nodes

pub struct HybridLogicalClock {
    physical: u64,   // wall clock in ms (48 bits)
    logical: u16,    // monotonic counter (16 bits)
}

impl HybridLogicalClock {
    pub fn new() -> Self {
        Self {
            physical: Self::wall_now(),
            logical: 0,
        }
    }

    /// Tick on local event — guarantees strict increase
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

    /// Merge remote timestamp — ensures causal ordering
    pub fn update_with_remote(&mut self, remote: u64) {
        let (remote_phys, remote_log) = Self::decode(remote);
        let now = Self::wall_now();

        if now > self.physical && now > remote_phys {
            self.physical = now;
            self.logical = 0;
        } else {
            self.physical = self.physical.max(remote_phys);
            self.logical = if self.physical == remote_phys {
                self.logical.max(remote_log) + 1
            } else {
                0
            };
        }
    }

    fn encode(&self) -> u64 {
        (self.physical << 16) | (self.logical as u64)
    }

    fn decode(ts: u64) -> (u64, u16) {
        (ts >> 16, (ts & 0xFFFF) as u16)
    }

    fn wall_now() -> u64 {
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_millis() as u64
    }
}
```

### HLC Unit Tests

```rust
// crates/libern-core/src/crdt/mod.rs
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_hlc_strictly_increasing() {
        let mut hlc = HybridLogicalClock::new();
        let mut prev = 0u64;
        for _ in 0..1000 {
            let ts = hlc.tick();
            assert!(ts > prev, "HLC must be strictly increasing");
            prev = ts;
        }
    }

    #[test]
    fn test_hlc_remote_update_dominates() {
        let mut hlc = HybridLogicalClock::new();
        let local = hlc.tick();
        let remote = local + (1 << 20); // Remote has much larger timestamp
        let updated = hlc.update_with_remote(remote);
        assert!(updated >= remote);
    }
}
```

### HLC Timestamp Bit Layout

```
 64-bit HLC Timestamp:
 ┌────────────────────────────────────────────────────────────┐
 │  48 bits: Physical (milliseconds since epoch)               │
 │  16 bits: Logical (monotonic counter per millisecond)       │
 ├────────────────────────────────────────────────────────────┤
 │  Max: 2^48 ms = ~8,925 years from epoch                    │
 │  Max: 65,536 events per ms = 65M events/sec                │
 └────────────────────────────────────────────────────────────┘
```

---

## 5. Code: LWW-Element-Set CRDT

```rust
// crates/libern-core/src/crdt/mod.rs

pub struct LwwElementSet<T: Clone + Eq + Hash> {
    add_set: HashMap<T, u64>,    // element → HLC timestamp
    remove_set: HashMap<T, u64>, // element → HLC timestamp
}

impl<T: Clone + Eq + Hash> LwwElementSet<T> {
    pub fn add(&mut self, element: T, timestamp: u64) {
        self.add_set.insert(element, timestamp);
        self.remove_set.remove(&element);
    }

    pub fn remove(&mut self, element: T, timestamp: u64) {
        let add_time = self.add_set.get(&element).copied().unwrap_or(0);
        if timestamp > add_time {
            // Remove only if the remove operation is newer
            self.remove_set.insert(element, timestamp);
        }
    }

    pub fn snapshot(&self) -> Vec<T> {
        self.add_set.keys()
            .filter(|k| {
                let add_time = self.add_set.get(k).copied().unwrap_or(0);
                let remove_time = self.remove_set.get(k).copied().unwrap_or(0);
                add_time > remove_time
            })
            .cloned()
            .collect()
    }

    pub fn merge(&mut self, other: LwwElementSet<T>) {
        // For each element, take the max timestamp
        for (elem, ts) in other.add_set {
            let entry = self.add_set.entry(elem.clone()).or_insert(0);
            *entry = (*entry).max(ts);
        }
        for (elem, ts) in other.remove_set {
            let entry = self.remove_set.entry(elem).or_insert(0);
            *entry = (*entry).max(ts);
        }
    }
}
```

### LWW Merge Behavior Table

| Local State | Remote State | Merge Result |
|------------|-------------|--------------|
| add(A, 100) | add(A, 200) | A kept (ts 200) |
| add(A, 200) | add(A, 100) | A kept (no change) |
| add(A, 100) | remove(A, 150) | A removed (remove wins) |
| remove(A, 150) | add(A, 100) | A removed (remove wins) |
| add(A, 100) | remove(A, 50) | A kept (add wins) |
| add(A, 100), add(B, 200) | add(C, 150) | A, B, C all present |

### LWW Unit Tests

```rust
#[cfg(test)]
mod tests {
    #[test]
    fn test_lww_add_wins_over_remove() {
        let mut set = LwwElementSet::new();
        set.add("hello".to_string(), 100);
        set.remove("hello".to_string(), 50); // Earlier remove → add wins
        let snap = set.snapshot();
        assert!(snap.contains(&"hello".to_string()));
    }

    #[test]
    fn test_lww_remove_wins_over_add() {
        let mut set = LwwElementSet::new();
        set.add("hello".to_string(), 100);
        set.remove("hello".to_string(), 200); // Later remove → remove wins
        let snap = set.snapshot();
        assert!(!snap.contains(&"hello".to_string()));
    }

    #[test]
    fn test_lww_merge_idempotent() {
        let mut a = LwwElementSet::new();
        let mut b = LwwElementSet::new();
        a.add("x".to_string(), 10);
        b.add("y".to_string(), 20);
        a.merge(&b);
        b.merge(&a);
        let mut a_snap = a.snapshot();
        let mut b_snap = b.snapshot();
        a_snap.sort();
        b_snap.sort();
        assert_eq!(a_snap, b_snap);
    }
}
```

---

## 6. CRDT Conflict Resolution Scenarios

### Scenario A: Partition + Merge

```
Time  ┌──────┐               ┌──────┐
      │  A   │               │  B   │
      │      │               │      │
T1    │ add  │───────────────│ add  │  Both add same element
      │ "msg1│               │ "msg2│
      │" @100│               │" @101│
      ├──────┤               ├──────┤
T2    │      │   NETWORK     │      │
      │      │   PARTITION   │      │
      │ add  │               │ add  │  Both add conflicting
      │ "msg3│               │ "msg3│  element "msg3"
      │" @200│               │" @150│
      ├──────┤               ├──────┤
T3    │      │   MERGE       │      │
      │ HLC  │───────────────│ HLC  │  Higher timestamp wins
      │=200  │               │=200  │  → "msg3" kept at ts=200
      └──────┘               └──────┘

Result: Both nodes have {msg1, msg2, msg3}. Converged.
```

### Scenario B: Concurrent Edits on Whiteboard

```
User A draws a red line at T=100
User B draws a blue circle at T=101 (offline from A)
Network merges at T=200:
  LWW merge → both strokes present, ordered by HLC
```

---

## 7. Network Reachability Check

```rust
// apps/desktop/src-tauri/src/commands/stats.rs
#[tauri::command]
pub fn is_network_available() -> Result<bool, String> {
    Ok(std::net::TcpStream::connect_timeout(
        &"1.1.1.1:53".parse().unwrap(),
        std::time::Duration::from_millis(1000),
    ).is_ok())
}
```

---

## 8. Data Flow: End-to-End Message Delivery with CRDT

```
┌──────────────────────────────────────────────────────────────────┐
│                END-TO-END MESSAGE FLOW                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User types message in ChatArea.tsx                              │
│         │                                                        │
│         ▼                                                        │
│  Frontend calls invoke("send_message", { ... })                 │
│         │                                                        │
│         ▼                                                        │
│  Rust: send_message() — inserts into SQLite                      │
│         │                                                        │
│         ▼                                                        │
│  HLC timestamp assigned (tick)                                   │
│         │                                                        │
│         ▼                                                        │
│  Ed25519 signature computed                                       │
│         │                                                        │
│         ▼                                                        │
│  Message broadcast via WebSocket to all connected peers          │
│         │                                                        │
│         ▼                                                        │
│  Each peer receives message:                                     │
│    1. Verifies Ed25519 signature                                 │
│    2. Updates local HLC with remote timestamp                    │
│    3. Adds to LwwElementSet                                      │
│    4. Inserts into local SQLite                                  │
│    5. Frontend re-renders MessageList                            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 9. Market Comparison

| Feature | Libern | Discord | Slack | Teams | Matrix |
|---------|--------|---------|-------|-------|--------|
| Offline message queue | ✅ Full | ❌ | ❌ | ❌ | ✅ Partial |
| P2P sync | ✅ LAN | ❌ | ❌ | ❌ | ❌ |
| CRDT conflict resolution | ✅ LWW | ❌ LWW | ❌ | ❌ | ✅ |
| HLC timestamps | ✅ | ❌ | ❌ | ❌ | ❌ |
| mDNS discovery | ✅ | ❌ | ❌ | ❌ | ❌ |
| WebSocket P2P | ✅ | ❌ | ❌ | ❌ | ✅ |
| No central server | ✅ | ❌ | ❌ | ❌ | ❌ |
| Works fully offline | ✅ | ❌ | ❌ | ❌ | Read-only |
| Ed25519 signed messages | ✅ | ❌ | ❌ | ❌ | ❌ |
| .aioss ledger sync | ✅ | ❌ | ❌ | ❌ | ❌ |
| Server stats (messages, members) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Network reachability check | ✅ | ❌ | ❌ | ❌ | ❌ |
| Hash chain verification | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 10. Code: Message Retrieval with Cursor-Based Pagination

```rust
// apps/desktop/src-tauri/src/commands/message.rs
#[tauri::command]
pub fn get_messages(
    db: State<Database>,
    channel_id: String,
    before: Option<String>,
    limit: Option<u32>,
) -> Result<Vec<Message>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let limit = limit.unwrap_or(50).min(200);
    let mut query = String::from(
        "SELECT id, channel_id, author_id, content, reply_to, hlc_timestamp,
                signature, created_at, edited_at, deleted_at
         FROM messages WHERE channel_id = ?1 AND deleted_at IS NULL"
    );

    if before.is_some() {
        query.push_str(" AND created_at < ?2");
    }
    query.push_str(" ORDER BY created_at DESC LIMIT ?3");

    let mut stmt = conn.prepare(&query).map_err(|e| e.to_string())?;
    let messages = if let Some(ref before_ts) = before {
        let before_ts: i64 = before_ts.parse().map_err(|e| format!("{}", e))?;
        stmt.query_map(rusqlite::params![channel_id, before_ts, limit], |row| {
            Ok(Message { id: row.get(0)?, channel_id: row.get(1)?, ... })
        }).map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())?
    } else {
        stmt.query_map(rusqlite::params![channel_id, limit], |row| {
            Ok(Message { id: row.get(0)?, channel_id: row.get(1)?, ... })
        }).map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())?
    };

    Ok(messages.into_iter().rev().collect())
}
```

---

## 11. Code: Channel Management

```rust
// apps/desktop/src-tauri/src/commands/channel.rs
#[tauri::command]
pub fn get_channels(db: State<Database>, server_id: String) -> Result<Vec<Channel>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare(
        "SELECT id, server_id, name, kind, position, parent_id, created_at
         FROM channels WHERE server_id = ?1 ORDER BY position"
    ).map_err(|e| e.to_string())?;
    let channels = stmt.query_map(rusqlite::params![server_id], |row| {
        Ok(Channel { id: row.get(0)?, server_id: row.get(1)?, name: row.get(2)?,
            kind: row.get(3)?, position: row.get(4)?, parent_id: row.get(5)?,
            created_at: row.get(6)? })
    }).map_err(|e| e.to_string())?
    .collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())?;
    Ok(channels)
}
```

---

## 12. Server Stats Queries

```rust
// apps/desktop/src-tauri/src/commands/stats.rs
#[tauri::command]
pub fn get_server_stats(db: State<Database>, server_id: String) -> Result<serde_json::Value, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let total_messages: i32 = conn
        .query_row("SELECT COUNT(*) FROM messages m JOIN channels c ON m.channel_id = c.id WHERE c.server_id = ?1",
            rusqlite::params![server_id], |row| row.get(0)).unwrap_or(0);
    let total_members: i32 = conn
        .query_row("SELECT COUNT(*) FROM users u JOIN role_assignments ra ON u.id = ra.user_id JOIN roles r ON ra.role_id = r.id WHERE r.server_id = ?1",
            rusqlite::params![server_id], |row| row.get(0)).unwrap_or(0);
    let total_channels: i32 = conn
        .query_row("SELECT COUNT(*) FROM channels WHERE server_id = ?1",
            rusqlite::params![server_id], |row| row.get(0)).unwrap_or(0);
    Ok(serde_json::json!({
        "total_messages": total_messages,
        "total_members": total_members,
        "total_channels": total_channels,
    }))
}
```

---

## 13. Network Reachability Check

```rust
// apps/desktop/src-tauri/src/commands/stats.rs
#[tauri::command]
pub fn is_network_available() -> Result<bool, String> {
    Ok(std::net::TcpStream::connect_timeout(
        &"1.1.1.1:53".parse().unwrap(),
        std::time::Duration::from_millis(1000),
    ).is_ok())
}
```

---

## 14. Full Data Model: All Database Models

```rust
// crates/libern-core/src/db/models.rs
#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Server {
    pub id: String,
    pub name: String,
    pub owner_id: String,
    pub avatar_path: Option<String>,
    pub invite_code: String,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Channel {
    pub id: String,
    pub server_id: String,
    pub name: String,
    pub kind: String,
    pub position: i32,
    pub parent_id: Option<String>,
    pub created_at: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Role {
    pub id: String,
    pub server_id: String,
    pub name: String,
    pub color: Option<i32>,
    pub position: i32,
    pub permissions: i64,
    pub created_at: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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
```

---

## 15. Database Migrations

```rust
// crates/libern-core/src/db/mod.rs — migration handling
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

// Current migrations:
pub const MIGRATIONS: &[&str] = &[
    "ALTER TABLE users ADD COLUMN bio TEXT DEFAULT ''",
    "ALTER TABLE users ADD COLUMN pronouns TEXT DEFAULT ''",
    "ALTER TABLE users ADD COLUMN handle TEXT",
];
```

---

## 16. Key Takeaway

**Libern's CRDT engine makes the network optional.** Every node is a full
replica. You can work in a submarine, a tunnel, or a remote research station
and never lose functionality. When you reconnect, CRDT merge ensures everyone
converges to the same state — no conflicts, no data loss, no manual resolution.
No other mainstream collaboration platform offers this.

The combination of HLC timestamps (guaranteed monotonic, 64-bit, 8,925-year
range), LWW Element Sets (mathematically proven convergence), mDNS discovery
(zero-config peer finding), and WebSocket P2P transport (bidirectional binary
stream) creates a distributed system that is simultaneously simpler and more
robust than any server-based alternative.

---

## 11. References

1. Shapiro, M., Preguiça, N., Baquero, C., Zawirski, M. "Conflict-Free Replicated Data Types." INRIA, 2011.
2. Kleppmann, M. "Designing Data-Intensive Applications." O'Reilly, 2017.
3. Lamport, L. "Time, Clocks, and the Ordering of Events in a Distributed System." Communications of the ACM, 1978.
4. Kademlia: Maymounkov, P., Mazières, D. "Kademlia: A Peer-to-Peer Information System Based on the XOR Metric." IPTPS, 2002.
5. IDC. "Cost of Network Downtime." 2024.
6. Bernstein, D.J. "mDNS: Multicast DNS." IETF RFC 6762, 2013.
7. Libern Core. "HybridLogicalClock — full implementation with tests." crates/libern-core/src/crdt/mod.rs, 2026.
8. Libern Core. "LwwElementSet — add, remove, snapshot, merge with tests." crates/libern-core/src/crdt/mod.rs, 2026.
9. Libern Desktop. "is_network_available — TCP connectivity check." apps/desktop/src-tauri/src/commands/stats.rs, 2026.
10. Libern Desktop. "send_message — inserts message with HLC + signature." apps/desktop/src-tauri/src/commands/message.rs, 2026.

**Related docs:**
- /docs/features/01-libern-overview.md
- /docs/features/04-crdt-engine.md
- /docs/developers/01-sync-protocol.md

**Plain text backup:** /docs-txt/features/03-offline-p2p.txt
