▄▄                     ██               ▄▄                                    
██                     ▀▀               ██                                    
██            ▄▄▄█   ████     █▄▄▄      ██▄███▄    ▄████▄    ██▄████  ██▄████▄
██        ▄▄█▀▀▀       ██       ▀▀▀█▄▄  ██▀  ▀██  ██▄▄▄▄██   ██▀      ██▀   ██
██        ▀▀█▄▄▄       ██       ▄▄▄█▀▀  ██    ██  ██▀▀▀▀▀▀   ██       ██    ██
██▄▄▄▄▄▄      ▀▀▀█  ▄▄▄██▄▄▄  █▀▀▀      ███▄▄██▀  ▀██▄▄▄▄█   ██       ██    ██
▀▀▀▀▀▀▀▀            ▀▀▀▀▀▀▀▀            ▀▀ ▀▀▀      ▀▀▀▀▀    ▀▀       ▀▀    ▀▀

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

Document Version: 1.0.0
Category: Tutorial
Document ID: TUT-007
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Marketplace and Games

## Introduction

The Libern Marketplace allows you to browse, publish, and share creations across servers. The casino system provides fun games you can play with XP. The XP/Leveling system rewards participation. This tutorial covers all three systems.

### Gamification Architecture

```
┌─────────────────────────────────────────────────────┐
│           Marketplace, Casino & XP System            │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Marketplace              Casino                    │
│  ┌──────────────────┐    ┌──────────────────┐      │
│  │ Browse items      │    │ Slots (3-reel)   │      │
│  │ Publish items     │    │ Blackjack        │      │
│  │ Like/unlike       │    │ Dice Roll        │      │
│  │ Type filtering   │    │ Coin Flip        │      │
│  │ Search            │    │ Prediction Mkts  │      │
│  └────────┬─────────┘    └────────┬─────────┘      │
│           │                      │                 │
│           └──────────┬───────────┘                 │
│                      ▼                             │
│           ┌────────────────────┐                   │
│           │   XP/Leveling      │                   │
│           │  ┌──────────────┐  │                   │
│           │  │ Level formula │  │                   │
│           │  │ XP = sqrt/100│  │                   │
│           │  │ Leaderboard  │  │                   │
│           │  └──────────────┘  │                   │
│           └────────────────────┘                   │
│                                                      │
│  All data stored in local SQLite                    │
│  Synced via CRDT across LAN peers                   │
└─────────────────────────────────────────────────────┘
```

---

## Part 1: Marketplace

The Marketplace is a global and per-server item sharing system. Items can be models, images, audio files, text documents, or custom content.

### Accessing the Marketplace

Click the **🏪 Marketplace** icon in the ServerListSidebar (left sidebar). The `MarketplacePage` component renders the full marketplace interface.

### Marketplace UI

The `MarketplacePage` component (`apps/desktop/src/components/marketplace/MarketplacePage.tsx`) provides:

```
┌─────────────────────────────────────────────────────┐
│  🏪 Marketplace                     [+ Publish]    │
├─────────────────────────────────────────────────────┤
│  [Browse] [My Creations]                            │
│                                                     │
│  Filter: [All] [Model] [Image] [Audio] [Text]      │
│                                                     │
│  Search: [..................................]        │
│                                                     │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐   │
│  │ 🧊     │  │ 🖼️    │  │ 🔊     │  │ 📝    │   │
│  │ Model  │  │ Image  │  │ Audio  │  │ Text  │   │
│  │ "Cool" │  │ "Shot" │  │ "Song" │  │ "Doc" │   │
│  │ ❤️ 12  │  │ ❤️ 8   │  │ ❤️ 3   │  │ ❤️ 5  │   │
│  └────────┘  └────────┘  └────────┘  └────────┘   │
└─────────────────────────────────────────────────────┘
```

- **Header**: Title and "Publish" button
- **Tabs**: "Browse" (all items) and "My Creations" (your items)
- **Type filter**: All, Model, Image, Audio, Text
- **Search**: Text search across names and descriptions
- **Grid**: Card-based layout showing items with thumbnails

### Browsing Items

```typescript
import { getMarketplaceItems } from "./lib/api";

// Browse all public items
const items = await getMarketplaceItems();

// Filter by server + type
const items = await getMarketplaceItems(serverId, "model", "search query");

// Sort options are available via separate parameters
```

### Item Types

| Type | Icon | Color | MIME |
|------|------|-------|------|
| `model` | 🧊 | Blue | `application/octet-stream` |
| `image` | 🖼️ | Green | `image/png` |
| `audio` | 🔊 | Purple | `audio/ogg` |
| `text` | 📝 | Yellow | `text/markdown` |
| (other) | 📦 | Gray | `null` |

### Publishing an Item

1. Click **"+ Publish"** in the Marketplace header.
2. The `PublishDialog` modal opens.
3. Select **Type** (model, image, audio, text).
4. Enter a **Name** (required).
5. Enter a **Description**.
6. Select **Visibility**:
   - `public` — Visible to everyone across all servers
   - `server` — Visible only within your server
   - `private` — Only visible to you
7. Click **Publish**.

```typescript
import { publishMarketplaceItem } from "./lib/api";

const item = await publishMarketplaceItem(
    "model",              // item_type
    "My Cool Model",      // name
    "A description",      // description
    userId,               // author_id
    null,                 // server_id (null for global)
    "public",             // visibility
    dataBytes,            // item data as byte array
    "ai,chat,fun"         // tags (comma-separated)
);
```

Internally, the `publish_marketplace_item` command:
1. Generates a UUID for the item.
2. Determines the MIME type based on `item_type`.
3. Inserts the item into `marketplace_items` table.
4. Returns the created item.

```rust
#[tauri::command]
pub fn publish_marketplace_item(
    db: State<Database>,
    item_type: String,
    name: String,
    description: Option<String>,
    author_id: String,
    server_id: Option<String>,
    visibility: String,
    data: Vec<u8>,
    tags: Option<String>,
) -> Result<MarketplaceItem, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp_millis();
    let hlc = now;
    let file_size = data.len() as i64;

    // Determine MIME type
    let mime_type = match item_type.as_str() {
        "image" => Some("image/png"),
        "audio" => Some("audio/ogg"),
        "text" => Some("text/markdown"),
        "model" => Some("application/octet-stream"),
        _ => None,
    };

    conn.execute(
        "INSERT INTO marketplace_items
         (id, item_type, name, description, author_id, server_id, visibility,
          data, file_size, mime_type, tags, hlc_timestamp, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)",
        rusqlite::params![id, item_type, name, description, author_id, server_id,
            visibility, data, file_size, mime_type, tags, hlc, now],
    ).map_err(|e| e.to_string())?;

    Ok(MarketplaceItem { id, item_type, name, description, author_id,
        server_id, visibility, file_size, mime_type, tags,
        hlc_timestamp: hlc, like_count: 0, use_count: 0, created_at: now })
}
```

### Liking Items

```typescript
import { likeMarketplaceItem, unlikeMarketplaceItem } from "./lib/api";

// Like
await likeMarketplaceItem(itemId, userId);

// Unlike
await unlikeMarketplaceItem(itemId, userId);
```

### My Items

```typescript
import { getMyItems } from "./lib/api";

// All my items
const myItems = await getMyItems(userId);

// Filter by type
const myModels = await getMyItems(userId, "model");
```

### Deleting Items

```typescript
import { deleteMarketplaceItem } from "./lib/api";
await deleteMarketplaceItem(itemId);
```

---

## Part 2: Casino Games

The casino system lets you bet XP on games of chance. Games are implemented as pure Rust functions in `apps/desktop/src-tauri/src/commands/games.rs`.

### Casino Balance

Each user starts with **1000 XP** balance. Balances are tracked in the `casino_balances` table:

```sql
CREATE TABLE IF NOT EXISTS casino_balances (
    user_id TEXT PRIMARY KEY,
    balance INTEGER DEFAULT 1000,
    lifetime_won INTEGER DEFAULT 0,
    lifetime_lost INTEGER DEFAULT 0,
    updated_at INTEGER
);
```

### Slots (/slots)

```
/slots <bet>
```

The `casino_slots` command runs a 3-reel slot machine:

```rust
#[tauri::command]
pub fn casino_slots(user_id: String, bet: i32) -> Result<serde_json::Value, String> {
    let symbols = ["🍒", "⭐", "7️⃣", "💎", "🍀", "🔔"];
    let mut rng = rand::thread_rng();

    let reels: Vec<&str> = (0..3).map(|_| symbols[rng.gen_range(0..symbols.len())]).collect();

    let all_same = reels[0] == reels[1] && reels[1] == reels[2];
    let two_same = reels[0] == reels[1] || reels[1] == reels[2] || reels[0] == reels[2];

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

**Payout structure**:
- All 3 match → 5x multiplier (probability: 1/36 ≈ 2.78%)
- 2 match → 2x multiplier (probability: ~30/36 ≈ 83.33%)
- No match → 0 (probability: 5/36 ≈ 13.89%)

**Expected value**: (1/36 × 5) + (30/36 × 2) + (5/36 × 0) = 65/36 ≈ 1.81x per 1 bet

### Blackjack (/blackjack)

```
/blackjack <bet>
```

The `casino_blackjack` command plays a simplified blackjack:

```rust
#[tauri::command]
pub fn casino_blackjack(
    db: State<Database>,
    user_id: String,
    bet: i32,
    action: String,
) -> Result<serde_json::Value, String> {
    let mut rng = rand::thread_rng();

    // Initial hand: 2 random cards (1-11 each)
    let player_card1 = rng.gen_range(1..=11);
    let player_card2 = rng.gen_range(1..=11);
    let dealer_card1 = rng.gen_range(1..=11);
    let dealer_card2 = rng.gen_range(1..=11);

    let mut player = player_card1 + player_card2;
    let mut dealer = dealer_card1 + dealer_card2;

    // Player action
    match action.as_str() {
        "hit" => {
            let new_card = rng.gen_range(1..=11);
            player += new_card;
            if player > 21 { player = 21.min(player); }
        }
        "stand" => { /* keep current */ }
        _ => {}
    }

    // Dealer draws until 17+
    while dealer < 17 {
        dealer += rng.gen_range(1..=11);
    }

    // Determine result
    let result = if player > 21 { "bust" }
        else if dealer > 21 || player > dealer { "win" }
        else if player == dealer { "push" }
        else { "lose" };

    let multiplier = match result {
        "win" => 2,
        "push" => 1,
        _ => 0,
    };

    Ok(serde_json::json!({
        "player_hand": player,
        "dealer_hand": dealer,
        "result": result,
        "bet": bet,
        "winnings": bet * multiplier,
        "net": (bet * multiplier) - bet,
    }))
}
```

**Payout structure**:
- Win → 2x bet
- Push → 1x bet (refund)
- Lose/Bust → 0

### Dice Roll (/roll)

```
/roll 2d6
```

Customizable dice rolling with NdM format (e.g., `2d6`, `d20`, `3d8`).

```rust
#[tauri::command]
pub fn roll_dice(dice: String) -> Result<String, String> {
    let parts: Vec<&str> = dice.split('d').collect();
    let count: u32 = parts[0].parse().unwrap_or(1);
    let sides: u32 = parts.get(1).and_then(|s| s.parse().ok()).unwrap_or(6);
    let mut rng = rand::thread_rng();

    let rolls: Vec<u32> = (0..count).map(|_| rng.gen_range(1..=sides)).collect();
    let total: u32 = rolls.iter().sum();
    let rolls_str = rolls.iter().map(|r| r.to_string()).collect::<Vec<_>>().join(", ");

    Ok(format!("🎲 **{}d{}**: {} = **{}**", count, sides, rolls_str, total))
}
```

### Coin Flip (/flip)

```
/flip
```

Random heads or tails.

```rust
#[tauri::command]
pub fn flip_coin() -> Result<String, String> {
    let result = if rand::thread_rng().gen_bool(0.5) { "Heads" } else { "Tails" };
    Ok(format!("🪙 **Coin Flip**: {}", result))
}
```

### Prediction Markets

Create and bet on prediction markets:

```typescript
import { createPrediction, placeBet, resolvePrediction, getMarkets } from "./lib/api";

// Create a market
const market = await createPrediction(
    "Will it rain tomorrow?",
    "Yes",
    "No",
    userId,
    channelId,
    Date.now() + 86400000  // closes in 24h
);

// Place a bet
await placeBet(market.id, userId, "Yes", 100);

// Resolve the market
await resolvePrediction(market.id, "Yes");

// Get markets
const markets = await getMarkets(channelId);
```

### Prediction Market Schema

```sql
CREATE TABLE IF NOT EXISTS prediction_markets (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    creator_id TEXT NOT NULL,
    channel_id TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT, option_d TEXT,
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
```

---

## Part 3: XP and Leveling System

The XP system rewards users for participating in server activities.

### How XP Works

- Each message sent earns XP via the `add_xp` command.
- XP accumulates per user per server in the `user_xp` table.
- Level is calculated as: `level = floor(sqrt(xp / 100)) + 1`
- XP to next level: `(level + 1)^2 * 100 - current_xp`

### Level Progression Table

| XP | Level | XP to Next | Messages to Level Up |
|----|-------|------------|---------------------|
| 0 | 1 | 300 | 30 |
| 100 | 2 | 500 | 50 |
| 400 | 3 | 700 | 70 |
| 900 | 4 | 900 | 90 |
| 1,600 | 5 | 1,100 | 110 |
| 2,500 | 6 | 1,300 | 130 |
| 3,600 | 7 | 1,500 | 150 |
| 4,900 | 8 | 1,700 | 170 |
| 6,400 | 9 | 1,900 | 190 |
| 8,100 | 10 | 2,100 | 210 |

### Add XP

```typescript
import { addXp } from "./lib/api";
const result = await addXp(userId, serverId, 10, "message");
// { xp: 150, level: 2, xp_to_next: 250 }
```

The `add_xp` command uses `INSERT ... ON CONFLICT DO UPDATE`:
```sql
INSERT INTO user_xp (user_id, server_id, xp, level, last_message_at)
VALUES (?1, ?2, ?3, 1, ?4)
ON CONFLICT(user_id, server_id) DO UPDATE SET
    xp = xp + ?3,
    level = CAST(FLOOR(SQRT((xp + ?3) / 100.0)) AS INTEGER) + 1,
    last_message_at = ?4
```

### Check Level

```typescript
import { getLevel } from "./lib/api";
const levelInfo = await getLevel(userId, serverId);
// { xp: 150, level: 2, xp_to_next: 250 }
```

### Leaderboard

```typescript
import { getLeaderboard } from "./lib/api";

// Top 10 for a server
const leaderboard = await getLeaderboard(serverId, 10);
```

The `Leaderboard` component (`apps/desktop/src/components/levels/Leaderboard.tsx`) displays:
- Rank medals (🥇, 🥈, 🥉, #N)
- User avatar
- Display name
- Level and XP

```
┌──────────────────────────────────────────┐
│  Leaderboard — Server Name               │
├──────────────────────────────────────────┤
│  🥇 Alice       Level 12    14,400 XP   │
│  🥈 Bob         Level 10    10,000 XP   │
│  🥉 Charlie     Level 8     6,400 XP    │
│  #4  Diana      Level 7     4,900 XP    │
│  #5  Eve        Level 5     2,500 XP    │
│  ...                                     │
└──────────────────────────────────────────┘
```

### Level Badge

The `LevelBadge` component shows a user's level next to their name:

```
Alice  [12]  — Level badge next to display name
Bob    [10]
```

### Quiz Scores

The `quiz_scores` table tracks correct/incorrect answers:
```sql
CREATE TABLE IF NOT EXISTS quiz_scores (
    user_id TEXT NOT NULL,
    server_id TEXT NOT NULL,
    correct INTEGER DEFAULT 0,
    incorrect INTEGER DEFAULT 0,
    PRIMARY KEY (user_id, server_id)
);
```

---

## Part 4: Gamification Architecture

The complete gamification system includes:

### Database Tables (crates/libern-core/src/db/schema.rs)

```sql
-- XP and levels
CREATE TABLE IF NOT EXISTS user_xp (
    user_id TEXT NOT NULL,
    server_id TEXT NOT NULL,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    last_message_at INTEGER,
    PRIMARY KEY (user_id, server_id)
);

-- Casino balances
CREATE TABLE IF NOT EXISTS casino_balances (
    user_id TEXT PRIMARY KEY,
    balance INTEGER DEFAULT 1000,
    lifetime_won INTEGER DEFAULT 0,
    lifetime_lost INTEGER DEFAULT 0,
    updated_at INTEGER
);

-- Prediction markets
CREATE TABLE IF NOT EXISTS prediction_markets (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    creator_id TEXT NOT NULL,
    channel_id TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT, option_d TEXT,
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

-- Marketplace
CREATE TABLE IF NOT EXISTS marketplace_items (
    id TEXT PRIMARY KEY,
    item_type TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    author_id TEXT NOT NULL REFERENCES users(id),
    server_id TEXT,
    visibility TEXT NOT NULL DEFAULT 'public',
    data BLOB NOT NULL,
    thumbnail BLOB,
    file_size INTEGER NOT NULL DEFAULT 0,
    mime_type TEXT,
    tags TEXT,
    like_count INTEGER DEFAULT 0,
    use_count INTEGER DEFAULT 0,
    hlc_timestamp INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS marketplace_likes (
    user_id TEXT NOT NULL,
    item_id TEXT NOT NULL REFERENCES marketplace_items(id),
    created_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, item_id)
);

-- Quiz scores
CREATE TABLE IF NOT EXISTS quiz_scores (
    user_id TEXT NOT NULL,
    server_id TEXT NOT NULL,
    correct INTEGER DEFAULT 0,
    incorrect INTEGER DEFAULT 0,
    PRIMARY KEY (user_id, server_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_marketplace_author ON marketplace_items(author_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_server ON marketplace_items(server_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_type ON marketplace_items(item_type);
CREATE INDEX IF NOT EXISTS idx_marketplace_visibility ON marketplace_items(visibility);
CREATE INDEX IF NOT EXISTS idx_xp_server ON user_xp(server_id, xp DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_channel ON prediction_markets(channel_id);
```

---

## Step-by-Step: Casino Walkthrough

1. **Check balance**: Your balance starts at 1000 XP.
2. **Play slots**: Type `/slots 50` to bet 50 XP on the slot machine.
3. **Play blackjack**: Type `/blackjack 50` to bet 50 XP on blackjack.
4. **Roll dice**: Type `/roll 2d6` to roll two six-sided dice.
5. **Flip coin**: Type `/flip` to flip a coin.

---

## Step-by-Step: Marketplace Walkthrough

1. **Browse**: Click the 🏪 icon to open Marketplace.
2. **Filter**: Use the type buttons to filter by item type.
3. **Search**: Type in the search bar and press Enter.
4. **Like**: Click the heart icon on any item.
5. **Publish**: Click "+ Publish", fill in details, publish.
6. **My creations**: Switch to the "My Creations" tab.
7. **Delete**: Hover over your item and click Delete.

---

## Use Cases

### Community Content Sharing

```
Design team shares assets:
- 🖼️ UI mockups published as image items
- 🧊 3D models for the team to use
- 📝 Design guidelines as text items
- Team members like and collect best resources
```

### Server Casino Night

```
Community hosts a casino night:
- /slots 10 — Small bets for fun
- /blackjack 50 — Higher stakes
- /predict "Will Alice win?" — Prediction markets
- Leaderboard shows biggest winners
```

---

## Next Steps

- **Tutorial 08**: Compliance and .aioss — View sessions, verify integrity, export, sign

### Related References

- **FAQ-008**: Marketplace and Games FAQ — Common questions answered
- **FAQ-003**: AI FAQ — Slash commands and AI integration
- **DEV-001**: Architecture Overview — System design

────────────────────────────────────────────────────────────────

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.
