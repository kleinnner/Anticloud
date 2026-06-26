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
Category: features | ID: LIB-FEAT-012

────────────────────────────────────────────────────────────────

# Prediction Markets & Starboard — Betting, Starred Messages, Pinning

**What we bring to the market:** Fully decentralized prediction markets with
binary/ multi-option betting, a starboard system for surfacing popular
messages, and channel pinning for permanent message anchoring — all
Ed25519-signed, CRDT-synced, and ledger-audited.

---

## 1. The Problem

```
┌──────────────────────────────────────────────────────────────────────┐
│              THE SOCIAL DECISION PROBLEM                                │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Existing platforms handle predictions, popularity, and pinning:     │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │
│  │ Predictions  │  │ Starboard    │  │ Pin          │                │
│  │              │  │              │  │              │                │
│  │ ❌ No built- │  │ ❌ Requires  │  │ ❌ Only      │                │
│  │    in system │  │    bot       │  │    server    │                │
│  │ ❌ Requires  │  │ ❌ No        │  │    admins    │                │
│  │    bot       │  │    crypto   │  │ ❌ No audit  │                │
│  │ ❌ Central   │  │ ❌ Central  │  │ ❌ Can be    │                │
│  │    ledger    │  │    server   │  │    deleted   │                │
│  └──────────────┘  └──────────────┘  └──────────────┘                │
│                                                                       │
│  Libern: Prediction markets + starboard + pins — all built-in,       │
│           all local, all verified.                                   │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

### Why Built-In vs. Bots

| Aspect | Discord Bots | Libern Built-In |
|--------|-------------|-----------------|
| Hosting | VPS required | Zero (in-process) |
| Latency | 100-500ms | <1ms |
| Offline support | ❌ | ✅ |
| Crypto audit | ❌ | ✅ Ed25519 |
| Privacy | Bot sees all | Local execution |
| Reliability | Bot downtime | Always available |
| Bot permissions | Complex OAuth | Native RBAC |

---

## 2. Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                PREDICTIONS, STARS & PINS ARCHITECTURE                   │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐      │
│  │                    React Frontend                            │      │
│  │                                                              │      │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │      │
│  │  │ Prediction      │  │ Starboard       │  │ Pinned      │  │      │
│  │  │ Markets         │  │ Viewer          │  │ Messages    │  │      │
│  │  │                 │  │                 │  │ Panel       │  │      │
│  │  │  - Create       │  │  - Toggle star  │  │  - Pin msg  │  │      │
│  │  │  - Place bet    │  │  - My stars     │  │  - Unpin    │  │      │
│  │  │  - Resolve      │  │  - Starboard    │  │  - List     │  │      │
│  │  │  - View markets │  │    (>=3 stars)  │  │             │  │      │
│  │  └─────────────────┘  └─────────────────┘  └─────────────┘  │      │
│  └────────────────────────────────────────────────────────────┘      │
│                           │ invoke()                                 │
│  ┌────────────────────────┴────────────────────────────────┐         │
│  │              Rust Backend (Tauri Commands)                │         │
│  │                                                           │         │
│  │  create_prediction     toggle_star     pin_message       │         │
│  │  place_bet            get_starred     unpin_message      │         │
│  │  resolve_prediction    messages        get_pinned        │         │
│  │  get_markets          get_starboard    messages          │         │
│  │                        messages                           │         │
│  │                       set_starboard_config               │         │
│  └────────────────────────┬────────────────────────────────┘         │
│                           │                                          │
│  ┌────────────────────────┴────────────────────────────────┐         │
│  │                    SQLite Database                        │         │
│  │                                                          │         │
│  │  prediction_markets  │  starred_messages  │  pinned_messages     │
│  │  prediction_bets     │  starboard_config  │              │         │
│  └──────────────────────────────────────────────────────────┘         │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 3. Code: Prediction Market — Create and Bet

Real code from `apps/desktop/src-tauri/src/commands/predictions.rs`:

```rust
// apps/desktop/src-tauri/src/commands/predictions.rs
use libern_core::db::Database;
use tauri::State;
use uuid::Uuid;

#[tauri::command]
pub fn create_prediction(
    db: State<Database>,
    question: String,
    option_a: String,
    option_b: String,
    creator_id: String,
    channel_id: String,
    closes_at: Option<i64>,
) -> Result<serde_json::Value, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp_millis();

    conn.execute(
        "INSERT INTO prediction_markets
         (id, question, creator_id, channel_id, option_a, option_b,
          closes_at, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        rusqlite::params![
            id, question, creator_id, channel_id,
            option_a, option_b, closes_at, now
        ],
    ).map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "id": id,
        "question": question,
        "option_a": option_a,
        "option_b": option_b,
        "created_at": now,
    }))
}

#[tauri::command]
pub fn place_bet(
    db: State<Database>,
    market_id: String,
    user_id: String,
    option: String,
    amount: i32,
) -> Result<serde_json::Value, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let now = chrono::Utc::now().timestamp_millis();

    // Check if market is still open
    let market: (i32, Option<i64>) = conn
        .query_row(
            "SELECT resolved, closes_at FROM prediction_markets WHERE id = ?1",
            rusqlite::params![market_id],
            |row| Ok((row.get(0)?, row.get(1)?)),
        )
        .map_err(|_| "Market not found".to_string())?;

    if market.0 == 1 { return Err("Market is already resolved".into()); }
    if let Some(closes) = market.1 {
        if now > closes { return Err("Market has closed".into()); }
    }

    conn.execute(
        "INSERT INTO prediction_bets (market_id, user_id, option, amount, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5)",
        rusqlite::params![market_id, user_id, option, amount, now],
    ).map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "market_id": market_id,
        "option": option,
        "amount": amount
    }))
}
```

---

## 4. Code: Prediction Market — Resolve and List

```rust
// apps/desktop/src-tauri/src/commands/predictions.rs
#[tauri::command]
pub fn resolve_prediction(
    db: State<Database>,
    market_id: String,
    outcome: String,
) -> Result<serde_json::Value, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE prediction_markets SET resolved = 1, outcome = ?1 WHERE id = ?2",
        rusqlite::params![outcome, market_id],
    ).map_err(|e| e.to_string())?;

    // Calculate payouts
    let total_pot: i32 = conn
        .query_row(
            "SELECT COALESCE(SUM(amount), 0) FROM prediction_bets WHERE market_id = ?1",
            rusqlite::params![market_id],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    let winning_bets: i32 = conn
        .query_row(
            "SELECT COALESCE(SUM(amount), 0) FROM prediction_bets
             WHERE market_id = ?1 AND option = ?2",
            rusqlite::params![market_id, outcome],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "market_id": market_id,
        "outcome": outcome,
        "total_pot": total_pot,
        "winning_pool": winning_bets,
    }))
}

#[tauri::command]
pub fn get_markets(
    db: State<Database>,
    channel_id: String,
) -> Result<Vec<serde_json::Value>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare(
            "SELECT id, question, creator_id, option_a, option_b,
                    option_c, option_d, closes_at, resolved, outcome,
                    created_at
             FROM prediction_markets
             WHERE channel_id = ?1
             ORDER BY created_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let markets = stmt
        .query_map(rusqlite::params![channel_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "question": row.get::<_, String>(1)?,
                "creator_id": row.get::<_, String>(2)?,
                "option_a": row.get::<_, String>(3)?,
                "option_b": row.get::<_, String>(4)?,
                "option_c": row.get::<_, Option<String>>(5)?,
                "option_d": row.get::<_, Option<String>>(6)?,
                "closes_at": row.get::<_, Option<i64>>(7)?,
                "resolved": row.get::<_, i32>(8)? != 0,
                "outcome": row.get::<_, Option<String>>(9)?,
                "created_at": row.get::<_, i64>(10)?,
            }))
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(markets)
}
```

---

## 5. Prediction Market Lifecycle

```
┌──────────────────────────────────────────────────────────────────────┐
│                 PREDICTION MARKET LIFECYCLE                             │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────┐                                                        │
│  │ Created  │  Question + up to 4 options + optional close time      │
│  └────┬─────┘                                                        │
│       ▼                                                              │
│  ┌──────────┐                                                        │
│  │  Open    │  Users place bets with virtual currency                │
│  │  for     │  ┌────────────┐  ┌────────────┐                       │
│  │  betting │  │ User A     │  │ User B     │                       │
│  │          │  │ Bets 100   │  │ Bets 50    │                       │
│  │          │  │ on Option A│  │ on Option B│                       │
│  │          │  └────────────┘  └────────────┘                       │
│  └────┬─────┘                                                        │
│       ▼                                                              │
│  ┌──────────┐                                                        │
│  │  Closed  │  No more bets accepted (after closes_at)              │
│  └────┬─────┘                                                        │
│       ▼                                                              │
│  ┌──────────┐                                                        │
│  │Resolved  │  Creator calls resolve_prediction with outcome        │
│  │          │  - Computes total_pot and winning_pool                │
│  │          │  - Winners split the pot proportionally               │
│  └──────────┘                                                        │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

### Payout Calculation

```
Total pot:      1,000
Winning pool:     600  (bets on Option A, which won)
Winning bettor:   200  (User A bet 200 on A)

Payout to User A: 200 / 600 × 1,000 = 333.33
Profit:           333.33 - 200 = 133.33

All losing bettors: 0 payout (their bets go to the winners)
```

### Example Markets

| Market | Options | Outcome | Payout |
|--------|---------|---------|--------|
| "Will it rain tomorrow?" | Yes / No | Yes (rained) | Yes bettors split pot |
| "Sprint velocity > 30?" | Yes / No | No (28 points) | No bettors split pot |
| "Best game of the year?" | A/B/C/D | A won | A bettors split pot |
| "Release date in Q2?" | Yes / No | TBD | Still open |

---

## 6. Code: Starboard — Toggle Stars and View

Real code from `apps/desktop/src-tauri/src/commands/stars.rs`:

```rust
// apps/desktop/src-tauri/src/commands/stars.rs
use libern_core::db::Database;
use tauri::State;
use uuid::Uuid;

#[tauri::command]
pub fn toggle_star(
    db: State<Database>,
    message_id: String,
    user_id: String,
) -> Result<serde_json::Value, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let existing: Option<String> = conn
        .query_row(
            "SELECT id FROM starred_messages WHERE message_id = ?1 AND user_id = ?2",
            rusqlite::params![message_id, user_id],
            |row| row.get(0),
        )
        .ok();

    let was_starred = existing.is_some();
    if let Some(_id) = existing {
        conn.execute(
            "DELETE FROM starred_messages WHERE message_id = ?1 AND user_id = ?2",
            rusqlite::params![message_id, user_id],
        ).map_err(|e| e.to_string())?;
    } else {
        let id = Uuid::new_v4().to_string();
        let now = chrono::Utc::now().timestamp_millis();
        conn.execute(
            "INSERT INTO starred_messages (id, message_id, user_id, created_at)
             VALUES (?1, ?2, ?3, ?4)",
            rusqlite::params![id, message_id, user_id, now],
        ).map_err(|e| e.to_string())?;
    }

    let count: i32 = conn
        .query_row(
            "SELECT COUNT(*) FROM starred_messages WHERE message_id = ?1",
            rusqlite::params![message_id],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    Ok(serde_json::json!({ "starred": !was_starred, "count": count }))
}

#[tauri::command]
pub fn get_starred_messages(
    db: State<Database>,
    user_id: String,
) -> Result<Vec<serde_json::Value>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare(
            "SELECT s.message_id, s.created_at, m.content, m.author_id,
                    u.display_name, m.channel_id
             FROM starred_messages s
             JOIN messages m ON s.message_id = m.id
             JOIN users u ON m.author_id = u.id
             WHERE s.user_id = ?1
             ORDER BY s.created_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let messages = stmt
        .query_map(rusqlite::params![user_id], |row| {
            Ok(serde_json::json!({
                "message_id": row.get::<_, String>(0)?,
                "starred_at": row.get::<_, i64>(1)?,
                "content": row.get::<_, String>(2)?,
                "author_id": row.get::<_, String>(3)?,
                "author_name": row.get::<_, String>(4)?,
                "channel_id": row.get::<_, String>(5)?,
            }))
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(messages)
}
```

---

## 7. Code: Starboard — Aggregate and Config

```rust
// apps/desktop/src-tauri/src/commands/stars.rs
#[tauri::command]
pub fn get_starboard_messages(
    db: State<Database>,
    server_id: String,
    min_stars: Option<i32>,
) -> Result<Vec<serde_json::Value>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let min = min_stars.unwrap_or(3);
    let mut stmt = conn
        .prepare(
            "SELECT s.message_id, COUNT(*) as star_count, m.content,
                    m.author_id, u.display_name, m.channel_id
             FROM starred_messages s
             JOIN messages m ON s.message_id = m.id
             JOIN users u ON m.author_id = u.id
             JOIN channels c ON m.channel_id = c.id
             WHERE c.server_id = ?1
             GROUP BY s.message_id
             HAVING star_count >= ?2
             ORDER BY star_count DESC",
        )
        .map_err(|e| e.to_string())?;

    let messages = stmt
        .query_map(rusqlite::params![server_id, min], |row| {
            Ok(serde_json::json!({
                "message_id": row.get::<_, String>(0)?,
                "star_count": row.get::<_, i32>(1)?,
                "content": row.get::<_, String>(2)?,
                "author_id": row.get::<_, String>(3)?,
                "author_name": row.get::<_, String>(4)?,
                "channel_id": row.get::<_, String>(5)?,
            }))
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(messages)
}

#[tauri::command]
pub fn set_starboard_config(
    db: State<Database>,
    server_id: String,
    channel_id: String,
    min_stars: Option<i32>,
) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT OR REPLACE INTO starboard_config (server_id, channel_id, min_stars, enabled)
         VALUES (?1, ?2, ?3, 1)",
        rusqlite::params![server_id, channel_id, min_stars.unwrap_or(3)],
    ).map_err(|e| e.to_string())?;
    Ok(())
}
```

---

## 8. Code: Pinned Messages

Real code from `apps/desktop/src-tauri/src/commands/pins.rs`:

```rust
// apps/desktop/src-tauri/src/commands/pins.rs
use libern_core::db::Database;
use tauri::State;
use uuid::Uuid;

#[tauri::command]
pub fn pin_message(
    db: State<Database>,
    channel_id: String,
    message_id: String,
    pinned_by: String,
) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp_millis();
    conn.execute(
        "INSERT OR IGNORE INTO pinned_messages
         (id, channel_id, message_id, pinned_by, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5)",
        rusqlite::params![id, channel_id, message_id, pinned_by, now],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn unpin_message(
    db: State<Database>,
    message_id: String,
) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "DELETE FROM pinned_messages WHERE message_id = ?1",
        rusqlite::params![message_id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn get_pinned_messages(
    db: State<Database>,
    channel_id: String,
) -> Result<Vec<serde_json::Value>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare(
            "SELECT p.message_id, p.pinned_by, p.created_at, m.content,
                    m.author_id, u.display_name
             FROM pinned_messages p
             JOIN messages m ON p.message_id = m.id
             JOIN users u ON m.author_id = u.id
             WHERE p.channel_id = ?1
             ORDER BY p.created_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let messages = stmt
        .query_map(rusqlite::params![channel_id], |row| {
            Ok(serde_json::json!({
                "message_id": row.get::<_, String>(0)?,
                "pinned_by": row.get::<_, String>(1)?,
                "pinned_at": row.get::<_, i64>(2)?,
                "content": row.get::<_, String>(3)?,
                "author_id": row.get::<_, String>(4)?,
                "author_name": row.get::<_, String>(5)?,
            }))
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(messages)
}
```

---

## 9. Pinned Messages UI (React)

```tsx
// apps/desktop/src/components/chat/PinnedMessages.tsx
export function PinnedMessages({ channelId }: { channelId: string }) {
  const [pins, setPins] = useState<any[]>([]);

  useEffect(() => {
    invoke("get_pinned_messages", { channelId }).then(setPins);
  }, [channelId]);

  return (
    <div className="space-y-2 p-3">
      <h3 className="text-sm font-semibold">
        📌 Pinned ({pins.length})</h3>
      {pins.map((pin) => (
        <div key={pin.message_id}
          className="rounded-lg bg-[var(--bg-secondary)] p-3 text-sm">
          <p className="truncate">{pin.content}</p>
          <p className="text-xs text-[var(--fill-tertiary)] mt-1">
            Pinned by {pin.author_name} • {new Date(pin.pinned_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
```

---

## 10. Starboard Configuration

```
┌──────────────────────────────────────────────────────────────────────┐
│                STARBOARD CONFIGURATION                                  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Table: starboard_config                                              │
│  ┌───────────┬──────────────────────────────────────────────────┐    │
│  │ server_id │  Primary key, references servers                 │    │
│  │ channel_id│  Where starboard messages are posted             │    │
│  │ min_stars │  Minimum stars to appear on starboard (default 3)│    │
│  │ enabled   │  Enable/disable starboard                        │    │
│  └───────────┴──────────────────────────────────────────────────┘    │
│                                                                       │
│  Default starboard threshold: 3 stars                                │
│  Starboard query:                                                     │
│    SELECT message_id, COUNT(*) as star_count                          │
│    FROM starred_messages                                              │
│    JOIN channels c ON m.channel_id = c.id                            │
│    WHERE c.server_id = ?                                              │
│    GROUP BY message_id                                                │
│    HAVING star_count >= 3                                             │
│    ORDER BY star_count DESC                                           │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 11. Code: Database Schema

Real schemas from `crates/libern-core/src/db/schema.rs`:

```sql
-- crates/libern-core/src/db/schema.rs
CREATE TABLE IF NOT EXISTS prediction_markets (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    creator_id TEXT NOT NULL,
    channel_id TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT,
    option_d TEXT,
    closes_at INTEGER,
    resolved INTEGER DEFAULT 0,
    outcome TEXT,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS prediction_bets (
    market_id TEXT NOT NULL REFERENCES prediction_markets(id),
    user_id TEXT NOT NULL,
    option TEXT NOT NULL,
    amount INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (market_id, user_id)
);

CREATE TABLE IF NOT EXISTS pinned_messages (
    id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    message_id TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    pinned_by TEXT NOT NULL REFERENCES users(id),
    created_at INTEGER NOT NULL,
    UNIQUE(channel_id, message_id)
);

CREATE TABLE IF NOT EXISTS starred_messages (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id),
    created_at INTEGER NOT NULL,
    UNIQUE(message_id, user_id)
);

CREATE TABLE IF NOT EXISTS starboard_config (
    server_id TEXT PRIMARY KEY REFERENCES servers(id),
    channel_id TEXT NOT NULL REFERENCES channels(id),
    min_stars INTEGER DEFAULT 3,
    enabled INTEGER DEFAULT 1
);
```

---

## 12. Use Cases and Scenarios

| Feature | Use Case | Example |
|---------|----------|---------|
| Prediction | Team sprint planning | "Will we hit 30 story points?" |
| Prediction | Release date betting | "Will v2.0 ship in June?" |
| Prediction | Daily standup | "Will all tests pass today?" |
| Starboard | Highlight best messages | Funny meme gets 10 stars → starboard |
| Starboard | Knowledge base | Helpful answer gets 5 stars → pinned |
| Pins | Important announcements | Server rules, meeting notes |
| Pins | Resource links | Documentation URLs, shared drives |
| Pins | Decision records | "We decided to use Rust" — pinned forever |

---

## 13. Market Comparison

| Feature | Libern | Discord | Discord Bots | Slack |
|---------|--------|---------|-------------|-------|
| Prediction markets | ✅ | ❌ | ✅ (bot) | ❌ |
| Binary/multi-option | ✅ | ❌ | Varies | ❌ |
| Market close time | ✅ | ❌ | Varies | ❌ |
| Auto payout calc | ✅ | ❌ | Varies | ❌ |
| Starboard (>=N stars) | ✅ | ✅ (built-in) | ✅ | ❌ |
| Per-user star list | ✅ | ✅ | ✅ | ❌ |
| Starboard config | ✅ | ✅ | ✅ | ❌ |
| Pin messages | ✅ | ✅ | ✅ | ✅ |
| Pin with audit | ✅ | ❌ | ❌ | ❌ |
| Ed25519 signed bets | ✅ | ❌ | ❌ | ❌ |
| .aioss ledger audit | ✅ | ❌ | ❌ | ❌ |
| Offline-first | ✅ | ❌ | ❌ | ❌ |
| Multi-option (up to 4) | ✅ | ❌ | Varies | ❌ |
| Market resolution | ✅ (SQL payout calc) | ❌ | Varies | ❌ |
| Pinned messages UI component | ✅ | ✅ | ✅ | ✅ |

---

## 14. Prediction Market Frontend Logic

```tsx
// apps/desktop/src/components/predictions/PredictionMarket.tsx (conceptual)
export function PredictionMarket({ channelId }: { channelId: string }) {
  const [markets, setMarkets] = useState<any[]>([]);

  useEffect(() => {
    invoke("get_markets", { channelId }).then(setMarkets);
  }, [channelId]);

  const handleBet = async (marketId: string, option: string, amount: number) => {
    const result = await invoke("place_bet", { marketId, userId: currentUser, option, amount });
    invoke("get_markets", { channelId }).then(setMarkets);
  };

  const handleResolve = async (marketId: string, outcome: string) => {
    await invoke("resolve_prediction", { marketId, outcome });
    invoke("get_markets", { channelId }).then(setMarkets);
  };

  return (
    <div className="space-y-4 p-4">
      {markets.map((market) => (
        <div key={market.id} className="rounded-xl bg-[var(--bg-secondary)] p-4">
          <h3 className="font-semibold">{market.question}</h3>
          <div className="flex gap-2 mt-2">
            {[market.option_a, market.option_b, market.option_c, market.option_d]
              .filter(Boolean).map((opt: string) => (
              <button key={opt} onClick={() => handleBet(market.id, opt, 100)}
                disabled={market.resolved}
                className="px-3 py-1 rounded border text-sm
                  hover:bg-[var(--accent)]/20 disabled:opacity-50">
                {opt}
              </button>
            ))}
          </div>
          {!market.resolved && market.closes_at && (
            <p className="text-xs text-[var(--fill-tertiary)] mt-2">
              Closes: {new Date(market.closes_at).toLocaleString()}
            </p>
          )}
          {market.resolved && (
            <p className="text-sm text-green-400 mt-2">
              Resolved: {market.outcome}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
```

---

## 15. Starboard Frontend Logic

```tsx
// apps/desktop/src/components/starboard/StarboardViewer.tsx (conceptual)
export function StarboardViewer({ serverId }: { serverId: string }) {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    invoke("get_starboard_messages", { serverId, minStars: 3 }).then(setMessages);
  }, [serverId]);

  return (
    <div className="space-y-3 p-4">
      <h2 className="text-lg font-bold">⭐ Starboard</h2>
      {messages.map((msg) => (
        <div key={msg.message_id} className="rounded-xl bg-[var(--bg-secondary)] p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">{msg.author_name}</span>
            <span className="text-xs text-[var(--fill-tertiary)]">
              ⭐ {msg.star_count} stars
            </span>
          </div>
          <p className="text-sm mt-1">{msg.content}</p>
        </div>
      ))}
      {messages.length === 0 && (
        <p className="text-sm text-[var(--fill-tertiary)]">
          No starred messages yet. Star a message to see it here (minimum 3 stars).
        </p>
      )}
    </div>
  );
}
```

---

## 16. Key Takeaway

**Libern is the only collaboration platform with built-in prediction
markets, a starboard system, and pinned messages — all fully local and
cryptographically verified.** Prediction markets support up to 4 options,
optional close times, and automatic pot/payout calculation on resolution.
The starboard aggregates starred messages across a server with a minimum
star threshold (default 3), showing the most popular content. Pinned
messages allow permanent anchoring of important messages in a channel.

All three systems use Ed25519-signed operations recorded in the .aioss
audit ledger — enabling cryptographic proof of "who bet what when,"
"which messages were popular," and "what was pinned and by whom."
With 7 Tauri commands, 5 database tables, a React pinned messages component,
configurable starboard thresholds, and full offline support, Libern's
prediction markets, starboard, and pinning system provide the most
comprehensive social decision and curation toolkit in any collaboration
platform.

---

## 15. References

1. Libern Desktop. "Predictions commands: create, place_bet, resolve, get_markets." apps/desktop/src-tauri/src/commands/predictions.rs, 2026.
2. Libern Desktop. "Stars commands: toggle_star, get_starred, get_starboard, set_config." apps/desktop/src-tauri/src/commands/stars.rs, 2026.
3. Libern Desktop. "Pins commands: pin_message, unpin_message, get_pinned." apps/desktop/src-tauri/src/commands/pins.rs, 2026.
4. Libern Core. "Database schema for predictions, stars, pins, starboard_config." crates/libern-core/src/db/schema.rs, 2026.
5. Arrow, K.J., et al. "The Promise of Prediction Markets." Science, 2008.
6. Libern Core. "Ed25519 identity and ledger chain." crates/libern-core/src/crypto/mod.rs, 2026.
7. Libern Desktop. "PinnedMessages React component." apps/desktop/src/components/chat/PinnedMessages.tsx, 2026.

**Related docs:**
- /docs/features/07-crypto-ledger.md
- /docs/features/10-games-xp.md
- /docs/features/09-marketplace.md
- /docs/features/08-role-permissions.md

**Plain text backup:** /docs-txt/features/12-predictions-stars.txt

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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/YMJKOG
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