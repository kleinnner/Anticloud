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
Category: Community User Guide
Document ID: CMT-006
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Marketplace and Levels

## Introduction

Libern includes a Marketplace for browsing and publishing creations, an XP and Leveling system that rewards participation, and Casino games for fun. This guide covers all three systems — how to browse and publish items, how XP and levels work, how to play casino games, and how the leaderboard ranks users.

The Marketplace is a decentralized content sharing system where you can publish 3D models, images, audio, and documents. XP and levels provide gamification across servers. Casino games let you bet XP for fun with slot machines, blackjack, and more.

By the end of this guide, you will be able to:
- Browse, search, and filter marketplace items
- Publish your own creations to the marketplace
- Earn XP and level up through participation
- Play casino games (slots, blackjack)
- Check the leaderboard and your ranking
- Create and bet on prediction markets

---

## Prerequisites

- Libern installed with a configured identity
- You belong to at least one server

---

## Part 1: The Marketplace

### Accessing the Marketplace

Click the **🏪 Marketplace** icon in the ServerListSidebar (the second icon from the top, next to `@` Direct Messages). The `MarketplacePage` component renders the full marketplace interface.

### Marketplace Interface

The `MarketplacePage` component (`apps/desktop/src/components/marketplace/MarketplacePage.tsx`) provides:

```
┌──────────────────────────────────────────────────────────┐
│  🏪 Marketplace                        [+ Publish]       │
├──────────────┬───────────────────────────────────────────┤
│              │  [All] [🧊 Model] [🖼️ Image] [🔊 Audio]  │
│  Browse      │  [📝 Text]                                │
│  My Creations│  [Search............................]     │
│              │                                           │
│              │  ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│              │  │Thumbnail│ │Thumbnail│ │Thumbnail│     │
│              │  │Name     │ │Name     │ │Name     │     │
│              │  │Author   │ │Author   │ │Author   │     │
│              │  │❤️ 5     │ │❤️ 12    │ │❤️ 3     │     │
│              │  └─────────┘ └─────────┘ └─────────┘     │
└──────────────┴───────────────────────────────────────────┘
```

1. **Header**: Title and "Publish" button
2. **Tabs**: "Browse" (all items) and "My Creations" (your items)
3. **Type filter buttons**: All, Model, Image, Audio, Text
4. **Search bar**: Text search across names and descriptions
5. **Grid view**: Card-based layout showing items with thumbnails

### Browsing Items

```typescript
import { getMarketplaceItems } from "./lib/api";

// Browse all public items
const items = await getMarketplaceItems();

// Filter by server + type
const items = await getMarketplaceItems(serverId, "model", "search query");
```

### Item Types

| Type | Icon | Color | Description |
|------|------|-------|-------------|
| `model` | 🧊 | Blue | 3D models and objects |
| `image` | 🖼️ | Green | Images and artwork |
| `audio` | 🔊 | Purple | Audio files and music |
| `text` | 📝 | Yellow | Documents and text |
| `other` | 📦 | Gray | Other file types |

### Searching Items

1. Click the search bar at the top of the marketplace.
2. Type your search query and press Enter.
3. Results are filtered by name and description.
4. Use the type filter buttons to narrow by item type.
5. Clear the search to reset.

### Item Cards

Each item in the grid displays:
- Thumbnail preview (if available)
- Item name
- Author name
- Item type badge
- Like count (❤️)
- Visibility badge (Public/Server/Private)

### Liking Items

```typescript
import { likeMarketplaceItem, unlikeMarketplaceItem } from "./lib/api";

// Like
await likeMarketplaceItem(itemId, userId);

// Unlike
await unlikeMarketplaceItem(itemId, userId);
```

---

## Part 2: Publishing to the Marketplace

### How to Publish

1. Click the **"+ Publish"** button in the Marketplace header.
2. The `PublishDialog` modal opens.
3. Fill in the details:
   - **Type**: Select the item type (model, image, audio, text)
   - **Name**: Enter a name (required)
   - **Description**: Describe your item (optional)
   - **Tags**: Comma-separated tags for discoverability (e.g., "ai,chat,fun")
   - **File**: Select the file to upload
   - **Visibility**: Choose who can see it
4. Click **"Publish"**.

### Visibility Options

| Visibility | Description |
|------------|-------------|
| `public` | Visible to everyone across all servers |
| `server` | Visible only within your current server |
| `private` | Only visible to you |

### Publishing via API

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

### What Happens Internally

The `publish_marketplace_item` command:
1. Generates a UUID for the item.
2. Determines the MIME type based on `item_type`.
3. Stores the file data as a BLOB in the `marketplace_items` table.
4. Returns the created item object.

### The API Layer

```typescript
// From apps/desktop/src/lib/api.ts
export const publishMarketplaceItem = (
    itemType: string,
    name: string,
    description: string | null,
    authorId: string,
    serverId: string | null,
    visibility: string | null,
    data: number[],
    tags: string | null,
) => invoke<any>("publish_marketplace_item", {
    itemType, name, description, authorId, serverId, visibility, data, tags
});
```

### Managing Your Items

```typescript
import { getMyItems, deleteMarketplaceItem } from "./lib/api";

// List your items
const myItems = await getMyItems(userId);

// Filter by type
const myModels = await getMyItems(userId, "model");

// Delete an item
await deleteMarketplaceItem(itemId);
```

### Marketplace Database Schema

```sql
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
```

---

## Part 3: XP and Leveling System

### How XP Works

The XP system rewards users for participating in server activities.

- **Sending messages** earns XP (10 XP per message).
- **XP accumulates** per user per server.
- **Level** is calculated from total XP: `level = floor(sqrt(xp / 100)) + 1`
- **XP to next level**: `(level + 1)^2 * 100 - current_xp`

### XP Table

| Level | XP Required | Total XP |
|-------|-------------|----------|
| 1 | 0 | 0 |
| 2 | 100 | 100 |
| 3 | 300 | 400 |
| 4 | 500 | 900 |
| 5 | 700 | 1600 |
| 6 | 900 | 2500 |
| 7 | 1100 | 3600 |
| 8 | 1300 | 4900 |
| 9 | 1500 | 6400 |
| 10 | 1900 | 10000 |
| 15 | 2900 | 22500 |
| 20 | 3900 | 40000 |
| 30 | 5900 | 90000 |
| 50 | 9900 | 250000 |

### Check Your Level

```typescript
import { getLevel } from "./lib/api";

const levelInfo = await getLevel(userId, serverId);
// { xp: 150, level: 2, xp_to_next: 250 }
```

### How XP Is Awarded

The `add_xp` command uses `INSERT ... ON CONFLICT DO UPDATE`:

```sql
INSERT INTO user_xp (user_id, server_id, xp, level, last_message_at)
VALUES (?1, ?2, ?3, 1, ?4)
ON CONFLICT(user_id, server_id) DO UPDATE SET
    xp = xp + ?3,
    level = CAST(FLOOR(SQRT((xp + ?3) / 100.0)) AS INTEGER) + 1,
    last_message_at = ?4
```

### Level Badge

Your level is displayed as a badge next to your name in messages and the member list:

```
@Alice        ┌──────┐
Level 7       │  7   │  Member since June 2026
              └──────┘
```

The badge shows your current level number with a color gradient that changes as you level up:
- Levels 1-5: Gray
- Levels 6-10: Green
- Levels 11-20: Blue
- Levels 21-50: Purple
- Levels 51+: Gold

### XP Earning Rate

| Action | XP Gain | Cooldown |
|--------|---------|----------|
| Send a message | 10 XP | None |
| Receive a reaction | 5 XP | Per message |
| Win a casino game | Varies | None |
| Complete a quiz | 25 XP | Per quiz |

---

## Part 4: Casino Games

The casino system lets you bet XP on games of chance. Games are implemented as pure Rust functions in `apps/desktop/src-tauri/src/commands/games.rs`.

### Casino Balance

Each user starts with **1000 XP** casino balance. This is separate from your earned XP.

```typescript
import { getCasinoBalance } from "./lib/api";

const balance = await getCasinoBalance(userId);
// { balance: 1000, lifetime_won: 0, lifetime_lost: 0 }
```

Casino balances are tracked in the `casino_balances` table:
```sql
CREATE TABLE IF NOT EXISTS casino_balances (
    user_id TEXT PRIMARY KEY,
    balance INTEGER DEFAULT 1000,
    lifetime_won INTEGER DEFAULT 0,
    lifetime_lost INTEGER DEFAULT 0,
    updated_at INTEGER
);
```

### /slots — Slot Machine

```
/slots <bet>
```

Bet XP on the slot machine and try to match symbols.

#### Symbols and Payouts

| Combination | Multiplier | Example |
|-------------|------------|---------|
| All 3 match | 5x bet | 🍒 🍒 🍒 → 250 XP on 50 bet |
| 2 match | 2x bet | 🍒 🍒 ⭐ → 100 XP on 50 bet |
| No match | 0 | 🍒 ⭐ 🔔 → 0 XP |

Symbols: 🍒 (cherry), ⭐ (star), 7️⃣ (seven), 💎 (diamond), 🍀 (clover), 🔔 (bell)

#### Example

```
/slots 50

🎰 **Slot Machine**
[ 🍒 | ⭐ | 🍒 ]
2 match! Multiplier: 2x
Bet: 50 XP | Winnings: 100 XP | Net: +50 XP
```

#### Implementation

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

### /blackjack — Blackjack

```
/blackjack <bet> [hit|stand]
```

Play a simplified blackjack game against Liber.

#### How It Works

1. You and the dealer each get two cards (values 1-11).
2. You can **hit** (take another card) or **stand** (keep current total).
3. If your total exceeds 21, you **bust** and lose.
4. If you stand, the dealer reveals their hand and the higher total wins (without busting).

#### Payout Structure

| Result | Payout |
|--------|--------|
| Win | 2x bet |
| Push (tie) | 1x bet (refund) |
| Lose/Bust | 0 |

#### Example

```
/blackjack 50 hit

🃏 **Blackjack**
You: 8 + 7 = 15 (hit → 8 + 7 + 5 = 20)
Dealer: 10 + 6 = 16
Result: **You win!** +100 XP 🎉
```

### /roll — Dice Roll

```
/roll 2d6
```

Roll dice in NdM format (N dice with M sides each). This is a Rust command (instant, no AI needed).

| Format | Example | Result |
|--------|---------|--------|
| `d20` | `/roll d20` | 🎲 Result: **17** |
| `2d6` | `/roll 2d6` | 🎲 (4 + 3) = **7** |
| `3d8` | `/roll 3d8` | 🎲 (6 + 2 + 8) = **16** |

### /flip — Coin Flip

```
/flip
```

Instant heads or tails result:
```
🪙 **Coin Flip**: Heads
```

---

## Part 5: Prediction Markets

Create and bet on prediction markets with other users.

### Create a Market

```typescript
import { createPrediction } from "./lib/api";

const market = await createPrediction(
    "Will it rain tomorrow?",
    "Yes",          // Option A
    "No",           // Option B
    userId,
    channelId,
    Date.now() + 86400000  // Closes in 24 hours
);
```

### Place a Bet

```typescript
import { placeBet } from "./lib/api";

await placeBet(market.id, userId, "Yes", 100);
```

### Resolve a Market

```typescript
import { resolvePrediction } from "./lib/api";

await resolvePrediction(market.id, "Yes");
```

### View Markets

```typescript
import { getMarkets } from "./lib/api";

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
```

---

## Part 6: Leaderboard

### View the Leaderboard

```
/leaderboard
```

Shows the top 10 users by XP in the current server.

### Leaderboard Display

The `Leaderboard` component (`apps/desktop/src/components/levels/Leaderboard.tsx`) displays:
- **Rank medals**: 🥇 (1st), 🥈 (2nd), 🥉 (3rd), #N for others
- **User avatar**: Circular avatar image or initials
- **Display name**: The user's display name
- **Level and XP**: Current level and XP count

```
┌──────────────────────────────────────────────┐
│  🏆 Leaderboard — My Server                   │
├──────────────────────────────────────────────┤
│  🥇  @Alice      Level 23    49,200 XP       │
│  🥈  @Bob        Level 18    32,400 XP       │
│  🥉  @Carol      Level 15    22,500 XP       │
│  #4  @Dave       Level 12    14,400 XP       │
│  #5  @Eve        Level 10    10,000 XP       │
│  #6  @Frank      Level 8     6,400 XP        │
│  #7  @Grace      Level 7     4,900 XP        │
│  #8  @Hank       Level 5     2,500 XP        │
│  #9  @Ivy        Level 4     1,600 XP        │
│  #10 @Jack       Level 3     900 XP          │
└──────────────────────────────────────────────┘
```

### Leaderboard API

```typescript
import { getLeaderboard } from "./lib/api";

// Top 10 for a server
const leaderboard = await getLeaderboard(serverId, 10);
```

### Quiz Scores

Quiz scores track correct/incorrect answers from the `/quiz` command:
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

## Part 7: Step-by-Step Walkthroughs

### Marketplace Walkthrough

1. **Browse**: Click the 🏪 icon to open Marketplace.
2. **Filter**: Use the type buttons to filter by item type.
3. **Search**: Type in the search bar and press Enter.
4. **Like**: Click the heart icon on any item.
5. **Publish**: Click "+ Publish", fill in details, select a file, set visibility, publish.
6. **My creations**: Switch to the "My Creations" tab to manage your items.
7. **Delete**: Hover over your item and click Delete.

### Casino Walkthrough

1. **Check balance**: Your balance starts at 1000 XP. Check with `/slots 0` or the balance command.
2. **Play slots**: Type `/slots 50` to bet 50 XP on the slot machine.
3. **Play blackjack**: Type `/blackjack 50 hit` to bet 50 XP on blackjack.
4. **Roll dice**: Type `/roll 2d6` to roll two six-sided dice.
5. **Flip coin**: Type `/flip` to flip a coin.
6. **Create a prediction**: Type `/predict Will we finish by Friday?` to create a market.

### XP and Leveling Walkthrough

1. **Earn XP**: Send messages in any text channel (10 XP per message).
2. **Check level**: Click your level badge or use `/leaderboard`.
3. **Level up**: As you earn XP, your level automatically increases.
4. **Compete**: Check the leaderboard to see how you rank against other members.
5. **Quiz**: Use `/quiz` to earn quiz score statistics.

---

## Part 8: Gamification Database

### Full Gamification Schema

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

-- Marketplace items
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

-- Marketplace likes
CREATE TABLE IF NOT EXISTS marketplace_likes (
    user_id TEXT NOT NULL,
    item_id TEXT NOT NULL REFERENCES marketplace_items(id),
    created_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, item_id)
);

-- Prediction markets
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

-- Prediction bets
CREATE TABLE IF NOT EXISTS prediction_bets (
    market_id TEXT NOT NULL REFERENCES prediction_markets(id),
    user_id TEXT NOT NULL,
    option TEXT NOT NULL,
    amount INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (market_id, user_id)
);

-- Quiz scores
CREATE TABLE IF NOT EXISTS quiz_scores (
    user_id TEXT NOT NULL,
    server_id TEXT NOT NULL,
    correct INTEGER DEFAULT 0,
    incorrect INTEGER DEFAULT 0,
    PRIMARY KEY (user_id, server_id)
);
```

---

## Part 9: Troubleshooting Marketplace and Levels

| Problem | Solution |
|---------|----------|
| "Cannot publish item" | Check that you have selected a file and entered a name. The item type must be one of: model, image, audio, text. |
| Item not appearing in marketplace | Check the visibility setting. If "server" or "private", it will not appear in the global "Browse" view. |
| "Insufficient balance" for casino | Your casino balance starts at 1000 XP. Earn more by sending messages (10 XP each). |
| XP not increasing | The `add_xp` command is triggered on message send. Ensure messages are being sent successfully. |
| Level not updating | Level is calculated as `floor(sqrt(xp / 100)) + 1`. It updates automatically on each XP addition. |
| "Invalid bet amount" | Bet must be a positive integer and cannot exceed your current casino balance. |
| Leaderboard not showing | Ensure there are users with XP in the server. The leaderboard returns an empty list if no data exists. |
| Canvas item thumbnail not showing | Thumbnails are generated automatically. For non-image items, a placeholder icon is shown. |
| "Market item not found" | The item may have been deleted by the author. Marketplace items are local and could be removed. |
| Casino balance not updating after game | The balance update may have failed. Check the balance with `/slots 0` after a few seconds. |
| "Prediction market closed" | Markets have a `closes_at` timestamp. Once closed, no new bets can be placed. |

### Inspecting Your Data

You can inspect XP and marketplace data directly in the database:

```bash
sqlite3 "$env:APPDATA\com.libern.app\data\libern.db"

-- Check your XP
SELECT * FROM user_xp WHERE user_id = '<your-user-id>';

-- Check marketplace items
SELECT name, item_type, like_count FROM marketplace_items ORDER BY like_count DESC;
```

---

## Next Steps

Now that you understand the marketplace, XP system, and casino games, explore:

- **How-To Guide 01-05** for foundational features
- **Enterprise Guides** for deployment and administration
- **Tutorial Series** for in-depth walkthroughs

────────────────────────────────────────────────────────────────

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

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