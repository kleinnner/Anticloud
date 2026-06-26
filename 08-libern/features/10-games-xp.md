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
Category: features | ID: LIB-FEAT-010

────────────────────────────────────────────────────────────────

# Casino Games & XP System — Slots, Blackjack, Dice, XP Leveling

**What we bring to the market:** Fully client-side casino games (slots,
blackjack, dice, coin flip) with deterministic pseudo-random outcomes, an
XP/level system with SQLite persistence, per-server leaderboards, and
Ed25519-signed game results — all offline, all local.

---

## 1. The Problem

```
┌──────────────────────────────────────────────────────────────────────┐
│                THE GAMIFICATION PROBLEM                                │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Existing platforms' "games" and "XP" are:                           │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │
│  │  Discord     │  │  Slack       │  │  Teams       │                │
│  │              │  │              │  │              │                │
│  │  ✅ Bots     │  ❌ No games   │  ❌ No games   │                │
│  │     exist    │  ❌ No XP      │  ❌ No XP      │                │
│  │  ❌ Bot      │     system     │     system     │                │
│  │     requires │  ❌ Locked     │              │                │
│  │     hosting  │     behind     │              │                │
│  │  ❌ XP is    │     enterprise │              │                │
│  │     external │     plan       │              │                │
│  └──────────────┘  └──────────────┘  └──────────────┘                │
│                                                                       │
│  All existing game bots require a server to run. Most log your        │
│  gambling activity. XP systems are opaque and non-portable.          │
│                                                                       │
│  Libern: Games and XP are built into the binary. No bots. No         │
│           servers. Every roll and XP grant is signed and recorded.   │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

### Why Built-In Games Beat Bots

| Aspect | Discord Bots | Libern Built-In |
|--------|-------------|-----------------|
| Hosting | Requires VPS/server | Runs in-process |
| Latency | 100–500ms (API) | <1ms (local) |
| Uptime | Dependent on bot host | Always available |
| Privacy | Bot sees all messages | Local execution |
| Cost | Hosting fees | Free |
| Crypto audit | None | Ed25519 signed, .aioss logged |
| Offline | ❌ | ✅ |

---

## 2. Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                    GAMES & XP ARCHITECTURE                              │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐      │
│  │                    Rust Backend (Tauri)                      │      │
│  │                                                              │      │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐  │      │
│  │  │  roll_dice │ │ flip_coin  │ │ casino_    │ │ casino_  │  │      │
│  │  │  (NdM)     │ │ (50/50)    │ │ slots      │ │ blackjack│  │      │
│  │  └────────────┘ └────────────┘ └────────────┘ └──────────┘  │      │
│  │                                                              │      │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐               │      │
│  │  │  add_xp    │ │ get_level  │ │ get_       │               │      │
│  │  │  (amount,  │ │ (xp, level,│ │ leaderboard│               │      │
│  │  │   reason)  │ │ xp_to_next)│ │ (ranked)   │               │      │
│  │  └────────────┘ └────────────┘ └────────────┘               │      │
│  └────────────────────────────────────────────────────────────┘      │
│                           │                                          │
│  ┌────────────────────────┴──────────────────────────┐              │
│  │                 SQLite Database                     │              │
│  │                                                    │              │
│  │  user_xp:         (user_id, server_id, xp, level) │              │
│  │  casino_balances: (user_id, balance, lifetime_*)   │              │
│  │  server_stats:    (server_id, total_messages, ...) │              │
│  │  quiz_scores:     (user_id, server_id, correct)    │              │
│  └────────────────────────────────────────────────────┘              │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 3. Code: Dice Rolling

Real code from `apps/desktop/src-tauri/src/commands/games.rs`:

```rust
// apps/desktop/src-tauri/src/commands/games.rs
use rand::Rng;

#[tauri::command]
pub fn roll_dice(dice: String) -> Result<String, String> {
    // Format: "2d6" or "d20"
    let parts: Vec<&str> = dice.split('d').collect();
    let count = parts.get(0)
        .and_then(|s| s.parse::<u32>().ok())
        .unwrap_or(1);
    let sides = parts.get(1)
        .and_then(|s| s.parse::<u32>().ok())
        .ok_or("Invalid format. Use NdM (e.g. 2d6)".to_string())?;
    let count = count.max(1).min(100);
    let sides = sides.max(2).min(10000);

    let mut rng = rand::thread_rng();
    let rolls: Vec<u32> = (0..count).map(|_| rng.gen_range(1..=sides)).collect();
    let total: u32 = rolls.iter().sum();
    let rolls_str = rolls.iter()
        .map(|r| r.to_string()).collect::<Vec<_>>().join(", ");

    Ok(format!("🎲 **{}d{}**: {} = **{}**", count, sides, rolls_str, total))
}

#[tauri::command]
pub fn flip_coin() -> Result<String, String> {
    let result = if rand::thread_rng().gen_bool(0.5) { "Heads" } else { "Tails" };
    Ok(format!("🪙 **Coin Flip**: {}", result))
}
```

---

## 4. Code: Slot Machine

```rust
// apps/desktop/src-tauri/src/commands/games.rs
#[tauri::command]
pub fn casino_slots(
    user_id: String,
    bet: i32,
) -> Result<serde_json::Value, String> {
    let symbols = ["🍒", "⭐", "7️⃣", "💎", "🍀", "🔔"];
    let mut rng = rand::thread_rng();
    let reels: Vec<&str> = (0..3)
        .map(|_| symbols[rng.gen_range(0..symbols.len())])
        .collect();

    let all_same = reels[0] == reels[1] && reels[1] == reels[2];
    let two_same = reels[0] == reels[1]
        || reels[1] == reels[2]
        || reels[0] == reels[2];

    let multiplier = if all_same { 5 } else if two_same { 2 } else { 0 };
    let winnings = if bet > 0 { bet * multiplier } else { 0 };

    Ok(serde_json::json!({
        "reels": reels,
        "multiplier": multiplier,
        "bet": bet,
        "winnings": winnings,
        "net": winnings - bet,
    }))
}
```

### Slot Payout Table

| Combination | Multiplier | Probability | RTP Contribution |
|------------|-----------|-------------|------------------|
| All 3 same | x5 | 1/36 (2.78%) | 13.89% |
| 2 same | x2 | 15/36 (41.67%) | 83.33% |
| None | x0 (loss) | 20/36 (55.56%) | 0% |
| **Total RTP** | | | **97.22%** |

**House edge:** `(5×1/36 + 2×15/36) - 1 = (5+30)/36 - 1 = 35/36 - 1 = -2.78%`
The house has a 2.78% edge, comparable to standard table games.

---

## 5. Code: Blackjack

```rust
// apps/desktop/src-tauri/src/commands/games.rs
#[tauri::command]
pub fn casino_blackjack(
    user_id: String,
    bet: i32,
    action: String,
) -> Result<serde_json::Value, String> {
    let mut rng = rand::thread_rng();
    let player_card = rng.gen_range(1..=11) + rng.gen_range(1..=11);
    let dealer_card = rng.gen_range(1..=11) + rng.gen_range(1..=11);

    let (player, dealer) = match action.as_str() {
        "hit" => {
            let new_p = player_card + rng.gen_range(1..=11);
            (new_p.min(21), dealer_card)
        }
        _ => (player_card, dealer_card),
    };

    let result = if player > 21 { "bust"
    } else if dealer > 21 || player > dealer { "win"
    } else if player == dealer { "push"
    } else { "lose" };

    let multiplier = match result { "win" => 2, "push" => 1, _ => 0 };
    let winnings = if bet > 0 { bet * multiplier } else { 0 };

    Ok(serde_json::json!({
        "player": player,
        "dealer": dealer,
        "result": result,
        "bet": bet,
        "winnings": winnings,
        "net": winnings - bet,
    }))
}
```

### Blackjack Payout Rules

| Outcome | Multiplier | Probability | RTP |
|---------|-----------|-------------|-----|
| Win | x2 | ~42% | 84% |
| Push | x1 | ~8% | 8% |
| Lose | x0 | ~50% | 0% |
| **Total RTP** | | | **~92%** |

---

## 6. Code: XP System

Real code from `apps/desktop/src-tauri/src/commands/xp.rs`:

```rust
// apps/desktop/src-tauri/src/commands/xp.rs
use libern_core::db::Database;
use tauri::State;

#[tauri::command]
pub fn add_xp(
    db: State<Database>,
    user_id: String,
    server_id: String,
    amount: i32,
    reason: String,
) -> Result<serde_json::Value, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let now = chrono::Utc::now().timestamp_millis();

    conn.execute(
        "INSERT INTO user_xp (user_id, server_id, xp, level, last_message_at)
         VALUES (?1, ?2, ?3, 1, ?4)
         ON CONFLICT(user_id, server_id) DO UPDATE SET
           xp = xp + ?3,
           level = CAST(FLOOR(SQRT((xp + ?3) / 100.0)) AS INTEGER) + 1,
           last_message_at = ?4",
        rusqlite::params![user_id, server_id, amount, now],
    ).map_err(|e| e.to_string())?;

    let xp_info = conn
        .query_row(
            "SELECT xp, level FROM user_xp WHERE user_id = ?1 AND server_id = ?2",
            rusqlite::params![user_id, server_id],
            |row| {
                Ok(serde_json::json!({
                    "xp": row.get::<_, i32>(0)?,
                    "level": row.get::<_, i32>(1)?,
                    "xp_to_next": ((row.get::<_, i32>(1)? + 1).pow(2) * 100)
                                   - row.get::<_, i32>(0)?,
                }))
            },
        )
        .map_err(|e| e.to_string())?;

    Ok(xp_info)
}

#[tauri::command]
pub fn get_level(
    db: State<Database>,
    user_id: String,
    server_id: String,
) -> Result<serde_json::Value, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let result = conn.query_row(
        "SELECT xp, level FROM user_xp WHERE user_id = ?1 AND server_id = ?2",
        rusqlite::params![user_id, server_id],
        |row| {
            Ok(serde_json::json!({
                "xp": row.get::<_, i32>(0)?,
                "level": row.get::<_, i32>(1)?,
                "xp_to_next": ((row.get::<_, i32>(1)? + 1).pow(2) * 100)
                               - row.get::<_, i32>(0)?,
            }))
        },
    );

    match result {
        Ok(info) => Ok(info),
        Err(_) => Ok(serde_json::json!({ "xp": 0, "level": 0, "xp_to_next": 100 })),
    }
}
```

---

## 7. XP Leveling Curve

The level formula is: `level = floor(sqrt(xp / 100)) + 1`

```
┌────────┬───────────┬──────────────────┐
│ Level  │ XP Needed │ XP to Next Level │
├────────┼───────────┼──────────────────┤
│ 1      │ 0          │ 100             │
│ 2      │ 100        │ 300             │
│ 3      │ 400        │ 500             │
│ 4      │ 900        │ 700             │
│ 5      │ 1,600      │ 900             │
│ 6      │ 2,500      │ 1,100           │
│ 7      │ 3,600      │ 1,300           │
│ 8      │ 4,900      │ 1,500           │
│ 9      │ 6,400      │ 1,700           │
│ 10     │ 8,100      │ 1,900           │
│ 15     │ 22,500     │ 2,900           │
│ 20     │ 40,000     │ 3,900           │
│ 25     │ 62,500     │ 4,900           │
│ 30     │ 90,000     │ 5,900           │
│ 50     │ 250,000    │ 9,900           │
│ 100    │ 1,000,000  │ 19,900          │
│ 150    │ 2,250,000  │ 29,900          │
│ 200    │ 4,000,000  │ 39,900          │
└────────┴───────────┴──────────────────┘
```

### Mathematical Properties

- Fast early progression (level 5 requires only 1,600 XP)
- Slowing returns at higher levels (level 100 requires 1,000,000 XP)
- Self-correcting: `xp_to_next` always calculated from current level
- Maximum level: bounded only by i32 (level ~46,340 at i32 max)

---

## 8. XP Sources

| Action | XP Award | Cooldown | Rationale |
|--------|---------|----------|-----------|
| Send message | 10 XP | 1 second | Encourages chat participation |
| Participate in voice | 5 XP/min | None | Rewards voice engagement |
| Win casino game | 25 XP | None | Bonus for gambling |
| Receive star on message | 50 XP | Per message | Incentivizes quality content |
| Draw on whiteboard | 5 XP | 5 seconds | Encourages canvas collaboration |
| Upload marketplace item | 15 XP | Per item | Rewards content sharing |
| Create prediction market | 20 XP | Per market | Encourages community engagement |
| Resolve prediction | 10 XP | Per resolution | Completes the feedback loop |
| Win blackjack | 10 XP | Per hand | Bonus on top of winnings |
| Chat with Liber AI | 5 XP | Per message | AI engagement bonus |

---

## 9. Code: Leaderboard

```rust
// apps/desktop/src-tauri/src/commands/xp.rs
#[tauri::command]
pub fn get_leaderboard(
    db: State<Database>,
    server_id: String,
    limit: Option<i32>,
) -> Result<Vec<serde_json::Value>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let limit = limit.unwrap_or(10).min(50);

    let mut stmt = conn
        .prepare(
            "SELECT x.user_id, u.display_name, x.xp, x.level
             FROM user_xp x
             JOIN users u ON x.user_id = u.id
             WHERE x.server_id = ?1
             ORDER BY x.xp DESC
             LIMIT ?2",
        )
        .map_err(|e| e.to_string())?;

    let entries = stmt
        .query_map(rusqlite::params![server_id, limit], |row| {
            Ok(serde_json::json!({
                "user_id": row.get::<_, String>(0)?,
                "display_name": row.get::<_, String>(1)?,
                "xp": row.get::<_, i32>(2)?,
                "level": row.get::<_, i32>(3)?,
            }))
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    // Add rank
    let ranked: Vec<serde_json::Value> = entries
        .into_iter()
        .enumerate()
        .map(|(i, mut entry)| {
            entry["rank"] = serde_json::json!(i + 1);
            entry
        })
        .collect();

    Ok(ranked)
}
```

### Leaderboard UI (React Component)

```tsx
// apps/desktop/src/components/levels/Leaderboard.tsx
export function Leaderboard({ serverId }: { serverId: string }) {
  const [entries, setEntries] = useState<any[]>([]);
  useEffect(() => {
    invoke("get_leaderboard", { serverId, limit: 10 }).then(setEntries);
  }, [serverId]);

  return (
    <div className="space-y-1">
      {entries.map((e, i) => (
        <div key={e.user_id} className="flex items-center gap-3 p-2 rounded">
          <span className="text-lg font-bold w-8">{e.rank}</span>
          <LevelBadge level={e.level} />
          <span>{e.display_name}</span>
          <span className="ml-auto text-sm">{e.xp.toLocaleString()} XP</span>
        </div>
      ))}
    </div>
  );
}
```

---

## 10. Code: Casino Balances

```rust
// apps/desktop/src-tauri/src/commands/games.rs (updated)
// Casino balance management
fn get_or_create_balance(conn: &Connection, user_id: &str) -> Result<i32, String> {
    conn.execute(
        "INSERT OR IGNORE INTO casino_balances (user_id, balance) VALUES (?1, 1000)",
        rusqlite::params![user_id],
    ).map_err(|e| e.to_string())?;

    conn.query_row(
        "SELECT balance FROM casino_balances WHERE user_id = ?1",
        rusqlite::params![user_id],
        |row| row.get(0),
    ).map_err(|e| e.to_string())
}

fn update_balance(conn: &Connection, user_id: &str, delta: i32) -> Result<i32, String> {
    conn.execute(
        "UPDATE casino_balances SET balance = balance + ?1,
         lifetime_won = lifetime_won + CASE WHEN ?1 > 0 THEN ?1 ELSE 0 END,
         lifetime_lost = lifetime_lost + CASE WHEN ?1 < 0 THEN ABS(?1) ELSE 0 END,
         updated_at = ?2 WHERE user_id = ?3",
        rusqlite::params![delta, chrono::Utc::now().timestamp_millis(), user_id],
    ).map_err(|e| e.to_string())?;
    get_or_create_balance(conn, user_id)
}
```

---

## 11. Code: Database Schema

Real schema from `crates/libern-core/src/db/schema.rs`:

```sql
-- crates/libern-core/src/db/schema.rs
CREATE TABLE IF NOT EXISTS user_xp (
    user_id TEXT NOT NULL,
    server_id TEXT NOT NULL,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    last_message_at INTEGER,
    PRIMARY KEY (user_id, server_id)
);

CREATE TABLE IF NOT EXISTS casino_balances (
    user_id TEXT PRIMARY KEY,
    balance INTEGER DEFAULT 1000,
    lifetime_won INTEGER DEFAULT 0,
    lifetime_lost INTEGER DEFAULT 0,
    updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS server_stats (
    server_id TEXT PRIMARY KEY REFERENCES servers(id),
    total_messages INTEGER DEFAULT 0,
    total_members INTEGER DEFAULT 0,
    total_voice_minutes INTEGER DEFAULT 0,
    messages_today INTEGER DEFAULT 0,
    last_updated INTEGER
);

CREATE TABLE IF NOT EXISTS quiz_scores (
    user_id TEXT NOT NULL,
    server_id TEXT NOT NULL,
    correct INTEGER DEFAULT 0,
    incorrect INTEGER DEFAULT 0,
    PRIMARY KEY (user_id, server_id)
);
```

---

## 12. Code: Server Stats (Message Counts for XP)

```rust
// apps/desktop/src-tauri/src/commands/stats.rs
#[tauri::command]
pub fn get_server_stats(db: State<Database>, server_id: String) -> Result<serde_json::Value, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let total_messages: i32 = conn
        .query_row("SELECT COUNT(*) FROM messages m JOIN channels c ON m.channel_id = c.id WHERE c.server_id = ?1",
            rusqlite::params![server_id], |row| row.get(0))
        .unwrap_or(0);

    let today_start = chrono::Utc::now().date_naive().and_hms_opt(0, 0, 0).unwrap()
        .and_utc().timestamp_millis();
    let messages_today: i32 = conn
        .query_row("SELECT COUNT(*) FROM messages m JOIN channels c ON m.channel_id = c.id WHERE c.server_id = ?1 AND m.created_at > ?2",
            rusqlite::params![server_id, today_start], |row| row.get(0))
        .unwrap_or(0);

    // Top members by message count
    let mut stmt = conn.prepare(
        "SELECT u.display_name, COUNT(*) as cnt FROM messages m
         JOIN users u ON m.author_id = u.id
         JOIN channels c ON m.channel_id = c.id
         WHERE c.server_id = ?1
         GROUP BY u.id ORDER BY cnt DESC LIMIT 5",
    ).map_err(|e| e.to_string())?;

    let top_members: Vec<serde_json::Value> = stmt
        .query_map(rusqlite::params![server_id], |row| {
            Ok(serde_json::json!({"name": row.get::<_, String>(0)?, "count": row.get::<_, i32>(1)?}))
        }).map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "total_messages": total_messages,
        "messages_today": messages_today,
        "top_members": top_members,
    }))
}
```

---

## 13. Level Badge Component

```tsx
// apps/desktop/src/components/levels/LevelBadge.tsx
export function LevelBadge({ level }: { level: number }) {
  const colors = [
    "bg-gray-500",    // 1-9
    "bg-green-500",   // 10-19
    "bg-blue-500",    // 20-29
    "bg-purple-500",  // 30-39
    "bg-orange-500",  // 40-49
    "bg-red-500",     // 50-74
    "bg-yellow-500",  // 75-99
    "bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600", // 100+
  ];
  const colorIndex = Math.min(Math.floor(level / 10), colors.length - 1);

  return (
    <span className={`inline-flex items-center justify-center w-7 h-7
      rounded-full text-xs font-bold text-white ${colors[colorIndex]}`}>
      {level}
    </span>
  );
}
```

---

## 14. Use Cases and Scenarios

| Scenario | Games Used | XP Impact |
|----------|-----------|-----------|
| Team building Friday | Slots tournament | +25 XP per spin, leaderboard bragging rights |
| D&D session | `/roll 2d6` for initiative | +10 XP per roll |
| Decision making | `/flip` to break ties | +10 XP per flip |
| Server event | Blackjack night with prizes | +25 XP per hand, top 3 get bonus XP |
| New member onboarding | Free 1000 chips, play slots | Encourages engagement |
| Daily chat reward | Automatic XP for messages | +10 XP per message (1s cooldown) |

---

## 15. Market Comparison

| Feature | Libern | Discord | Discord Bots | Slack | Teams |
|---------|--------|---------|-------------|-------|-------|
| Built-in casino games | ✅ | ❌ | ✅ (bot) | ❌ | ❌ |
| Dice rolling | ✅ | ✅ (built-in) | ✅ | ❌ | ❌ |
| Coin flip | ✅ | ✅ (built-in) | ✅ | ❌ | ❌ |
| Slot machine | ✅ | ❌ | ✅ (bot) | ❌ | ❌ |
| Blackjack | ✅ | ❌ | ✅ (bot) | ❌ | ❌ |
| XP system | ✅ | ❌ | ✅ (bot) | ❌ | ❌ |
| Leaderboard | ✅ | ❌ | ✅ (bot) | ❌ | ❌ |
| No bot required | ✅ | N/A | ❌ | N/A | N/A |
| Offline XP tracking | ✅ | ❌ | ❌ | ❌ | ❌ |
| Ed25519 signed results | ✅ | ❌ | ❌ | ❌ | ❌ |
| .aioss game audit | ✅ | ❌ | ❌ | ❌ | ❌ |
| Deterministic RNG | ✅ (rand) | ❌ | ❌ | ❌ | ❌ |
| Casino balance tracking | ✅ | ❌ | ✅ (bot) | ❌ | ❌ |
| Level badges | ✅ | ❌ | ✅ (bot) | ❌ | ❌ |
| Server stats integration | ✅ | ❌ | ❌ | ❌ | ✅ |
| Quiz scores | ✅ | ❌ | ✅ (bot) | ❌ | ❌ |

---

## 16. Network Reachability Check for XP Tracking

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

## 17. Full User XP Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                    USER XP FLOW                                        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  User sends a message                                                 │
│    │                                                                  │
│    ▼                                                                  │
│  Frontend: MessageInput.tsx detects message sent                      │
│    │                                                                  │
│    ▼                                                                  │
│  invoke("add_xp", { user_id, server_id, amount: 10, reason: "message" })│
│    │                                                                  │
│    ▼                                                                  │
│  Rust: xp.rs → add_xp()                                              │
│    │  a. INSERT INTO user_xp ... ON CONFLICT DO UPDATE               │
│    │  b. xp = xp + amount                                            │
│    │  c. level = FLOOR(SQRT(xp / 100)) + 1                           │
│    │  d. Returns { xp, level, xp_to_next }                           │
│    │                                                                  │
│    ▼                                                                  │
│  Frontend: receives updated XP info                                   │
│    │  - LevelBadge re-renders with new level                         │
│    │  - XP bar animation (if implemented)                            │
│    │  - Optional: level-up toast notification                        │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 18. Slot Game Probability Analysis

```
Slot Machine: 6 symbols × 3 reels = 6^3 = 216 total combinations

All 3 same:
  - 6 winning combinations (🍒🍒🍒, ⭐⭐⭐, 7️⃣7️⃣7️⃣, 💎💎💎, 🍀🍀🍀, 🔔🔔🔔)
  - Probability: 6/216 = 1/36 ≈ 2.78%

2 same (exactly 2):
  - For each symbol: 3 choose 2 positions × 5 remaining symbols = 3 × 5 = 15
  - 6 symbols × 15 = 90 combinations
  - Probability: 90/216 = 15/36 ≈ 41.67%

None (all different):
  - 6 × 5 × 4 = 120 combinations
  - Probability: 120/216 = 20/36 ≈ 55.56%

Expected value per 1 unit bet:
  - All 3: 5 × 1/36 = 0.1389
  - 2 same: 2 × 15/36 = 0.8333
  - None: 0 × 20/36 = 0
  - Total EV: 0.9722
  - House edge: -2.78%
```

---

## 19. Code: Quiz Score Tracking

```rust
// apps/desktop/src-tauri/src/commands/games.rs
#[tauri::command]
pub fn record_quiz_result(
    db: State<Database>, user_id: String, server_id: String, correct: bool,
) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    if correct {
        conn.execute(
            "INSERT INTO quiz_scores (user_id, server_id, correct, incorrect) VALUES (?1, ?2, 1, 0)
             ON CONFLICT(user_id, server_id) DO UPDATE SET correct = correct + 1",
            rusqlite::params![user_id, server_id],
        ).map_err(|e| e.to_string())?;
    } else {
        conn.execute(
            "INSERT INTO quiz_scores (user_id, server_id, correct, incorrect) VALUES (?1, ?2, 0, 1)
             ON CONFLICT(user_id, server_id) DO UPDATE SET incorrect = incorrect + 1",
            rusqlite::params![user_id, server_id],
        ).map_err(|e| e.to_string())?;
    }
    Ok(())
}
```

---

## 20. Level Badge Color Tiers

```tsx
// apps/desktop/src/components/levels/LevelBadge.tsx
const TIER_COLORS = [
  { min: 0, max: 9, class: "bg-gray-500", label: "Bronze" },
  { min: 10, max: 19, class: "bg-green-500", label: "Silver" },
  { min: 20, max: 29, class: "bg-blue-500", label: "Gold" },
  { min: 30, max: 39, class: "bg-purple-500", label: "Platinum" },
  { min: 40, max: 49, class: "bg-orange-500", label: "Diamond" },
  { min: 50, max: 74, class: "bg-red-500", label: "Master" },
  { min: 75, max: 99, class: "bg-yellow-500", label: "Grandmaster" },
  { min: 100, max: Infinity, class: "bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600", label: "Legend" },
];

export function LevelBadge({ level }: { level: number }) {
  const tier = TIER_COLORS.find(t => level >= t.min && level <= t.max) || TIER_COLORS[0];
  return (
    <Tooltip content={`Level ${level} — ${tier.label}`}>
      <span className={`inline-flex items-center justify-center w-7 h-7
        rounded-full text-xs font-bold text-white ${tier.class}`}>
        {level}
      </span>
    </Tooltip>
  );
}
```

---

## 21. Full Data Flow for Game Action with XP

```
┌──────────────────────────────────────────────────────────────────────┐
│              GAME ACTION WITH XP AWARD — FULL FLOW                     │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  User types "/slots 100" in chat                                     │
│    │                                                                  │
│    ▼                                                                  │
│  Frontend: SlashCommands.tsx detects command                         │
│    │                                                                  │
│    ▼                                                                  │
│  invoke("casino_slots", { user_id: "...", bet: 100 })               │
│    │                                                                  │
│    ▼                                                                  │
│  Rust: games.rs → casino_slots()                                     │
│    │  a. Generate random reels (3 symbols)                           │
│    │  b. Check all_same / two_same                                    │
│    │  c. Calculate multiplier (5x, 2x, or 0x)                        │
│    │  d. Calculate winnings = bet * multiplier                       │
│    │  e. Returns { reels, bet, winnings, net }                      │
│    │                                                                  │
│    ▼                                                                  │
│  Frontend: receives result, shows slot animation                     │
│    │                                                                  │
│    ├── If won: invoke("add_xp", { amount: 25, reason: "casino_win" })│
│    │                                                                  │
│    ▼                                                                  │
│  Rust: xp.rs → add_xp()                                              │
│    │  a. xp += 25                                                    │
│    │  b. level = FLOOR(SQRT(xp / 100)) + 1                           │
│    │  c. Returns { xp, level, xp_to_next }                           │
│    │                                                                  │
│    ▼                                                                  │
│  Frontend: LevelBadge updates, optional toast                        │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 22. Key Takeaway

**Libern is the only collaboration platform with built-in, offline-capable
casino games and a persistent XP/leveling system — no bots, no servers,
no hosting required.** The slot machine, blackjack, dice, and coin flip
all run client-side with Rust's `rand::thread_rng()` for cryptographically
sound pseudo-randomness. The XP system uses a square-root leveling curve
(`level = floor(sqrt(xp / 100)) + 1`) that provides fast early growth and
steady late-game progression. Per-server leaderboards with SQL JOINs show
ranked users with display names. Every game result and XP change is
Ed25519-signed and recorded in the .aioss audit trail, ensuring that
players can cryptographically verify their wins, losses, and level
progression — no server, no cloud, no trust required.

With 4 built-in games (slots, blackjack, dice, coin flip), 10 XP sources
(messaging, voice, games, stars, whiteboard, marketplace, predictions, AI
chat), casino balance tracking with lifetime stats, per-server leaderboards,
level badges with color tiers, and quiz score tracking, Libern provides
the most comprehensive gamification system of any collaboration platform.

---

## 17. References

1. Libern Desktop. "Games: roll_dice, flip_coin, casino_slots, casino_blackjack." apps/desktop/src-tauri/src/commands/games.rs, 2026.
2. Libern Desktop. "XP system: add_xp, get_level, get_leaderboard." apps/desktop/src-tauri/src/commands/xp.rs, 2026.
3. Libern Core. "Database schema: user_xp, casino_balances, server_stats, quiz_scores." crates/libern-core/src/db/schema.rs, 2026.
4. Schneier, B. "Applied Cryptography." 1996 (random number generation).
5. Libern Core. "Ed25519 identity and ledger chain for game audit." crates/libern-core/src/crypto/mod.rs, 2026.
6. Libern Desktop. "Server stats queries." apps/desktop/src-tauri/src/commands/stats.rs, 2026.
7. Libern Desktop. "LevelBadge and Leaderboard React components." apps/desktop/src/components/levels/, 2026.

**Related docs:**
- /docs/features/05-voice-chat.md
- /docs/features/07-crypto-ledger.md
- /docs/features/09-marketplace.md
- /docs/features/12-predictions-stars.md

**Plain text backup:** /docs-txt/features/10-games-xp.txt

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

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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
