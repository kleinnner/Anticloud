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
Category: FAQ
Document ID: FAQ-008
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Marketplace and Games FAQ

## What is the Marketplace?

The Marketplace is a local item sharing system where users can browse, publish, and share creations across servers. Items can be:

- **Models**: AI models, 3D models, data files
- **Images**: PNG, JPG, or other image formats
- **Audio**: OGG, MP3, or other audio formats
- **Text**: Markdown documents, notes, guides

Items have visibility levels: `public` (all servers), `server` (current server only), or `private` (only you).

### Marketplace Item Types

| Type | Icon | Typical Use |
|------|------|-------------|
| `model` | 🧊 | 3D models, AI models, data files |
| `image` | 🖼️ | Screenshots, diagrams, art |
| `audio` | 🔊 | Sound effects, music, recordings |
| `text` | 📝 | Documentation, notes, guides |

---

## How do I browse the Marketplace?

Click the **🏪 Marketplace** icon in the ServerListSidebar (left sidebar). The `MarketplacePage` component provides:
- Browse tab with search and type filters
- My Creations tab showing items you've published
- Grid layout with thumbnails, type badges, and like counts

### Browse Interface

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

---

## How do I publish an item?

Click **"+ Publish"** in the Marketplace header. The `PublishDialog` modal requires:
- **Type**: model, image, audio, or text
- **Name**: Your item's title
- **Description**: Optional description
- **Visibility**: public, server, or private

```typescript
import { publishMarketplaceItem } from "./lib/api";
await publishMarketplaceItem("model", "My Item", "Description", userId, null, "public", dataBytes, "tags");
```

### Publish Dialog

```
┌──────────────────────────────────────┐
│  Publish Item                        │
├──────────────────────────────────────┤
│  Type:    [▼] [Model] [Image]       │
│          [Audio] [Text]              │
│                                      │
│  Name:    [.....................]    │
│  Description:                        │
│  [................................]  │
│  [................................]  │
│                                      │
│  Visibility: (●) Public  (○) Server │
│              (○) Private             │
│                                      │
│  Tags:    [ai,chat,fun          ]   │
│                                      │
│  [Cancel]             [Publish]     │
└──────────────────────────────────────┘
```

---

## Can I like items?

Yes. Each item has a heart icon showing like count. Click it to like or unlike:

```typescript
import { likeMarketplaceItem, unlikeMarketplaceItem } from "./lib/api";
await likeMarketplaceItem(itemId, userId);
await unlikeMarketplaceItem(itemId, userId);
```

---

## Can I delete my items?

Yes. In the "My Creations" tab, hover over an item and click **Delete**. The `delete_marketplace_item` command removes the item permanently.

---

## Are Marketplace items stored locally?

Yes. All marketplace items are stored in your local SQLite database in the `marketplace_items` table. Item data is stored as BLOBs. When peers connect on the LAN, marketplace items can be shared.

---

## What are casino games?

The casino system lets you bet XP on games of chance. Games are implemented as pure Rust functions:
- **Slots** (`/slots`): 3-reel slot machine
- **Blackjack** (`/blackjack`): Simplified blackjack
- **Dice Roll** (`/roll`): Custom dice rolling
- **Coin Flip** (`/flip`): Heads or tails

### Casino Games Overview

| Game | Command | Min Bet | Max Bet | House Edge |
|------|---------|---------|---------|------------|
| Slots | `/slots <bet>` | 1 | Balance | ~40% |
| Blackjack | `/blackjack <bet>` | 1 | Balance | ~15% |
| Dice | `/roll 2d6` | Free | Free | N/A (fun) |
| Coin | `/flip` | Free | Free | N/A (fun) |

---

## Are the casino games fair?

Yes. All casino games use **cryptographically secure random number generation** via the `rand` crate. There is no server-side manipulation because there is no server — everything runs locally.

### Slots fairness
- 3 symbols, each independently random from 6 possible symbols.
- All 3 match: 5x multiplier (probability: 1/36 ≈ 2.78%)
- 2 match: 2x multiplier (probability: ~30/36 ≈ 83.33%)
- No match: 0 (probability: 5/36 ≈ 13.89%)

### Blackjack fairness
- Cards: random values 1-11 (not a full deck, simplified model).
- Hit: adds another random card (capped at 21).
- Dealer: random hand, no complex strategy.

### RNG Implementation

```rust
// Cryptographically secure RNG
use rand::rngs::StdRng;
use rand::{Rng, SeedableRng};

pub fn fair_random() -> u32 {
    let mut rng = rand::thread_rng();
    rng.gen_range(0..6) // fair 6-sided value
}
```

---

## What is the XP system?

XP (experience points) rewards users for participating in server activities. Each message earns XP. The level system:

```
level = floor(sqrt(xp / 100)) + 1
xp_to_next = (level + 1)^2 * 100 - current_xp
```

### Level Example
| XP | Level | XP to Next |
|----|-------|------------|
| 0 | 1 | 300 |
| 100 | 2 | 500 |
| 400 | 3 | 700 |
| 900 | 4 | 900 |
| 1600 | 5 | 1100 |
| 2500 | 6 | 1300 |
| 3600 | 7 | 1500 |
| 4900 | 8 | 1700 |
| 6400 | 9 | 1900 |
| 8100 | 10 | 2100 |

---

## How do I check my level?

```typescript
import { getLevel } from "./lib/api";
const levelInfo = await getLevel(userId, serverId);
// { xp: 150, level: 2, xp_to_next: 250 }
```

---

## How do I see the leaderboard?

```typescript
import { getLeaderboard } from "./lib/api";
const top10 = await getLeaderboard(serverId, 10);
```

Or use the `/leaderboard` slash command in chat.

---

## Can I bet on prediction markets?

Yes. Create and bet on prediction markets:

```typescript
import { createPrediction, placeBet, resolvePrediction } from "./lib/api";

// Create a market
const market = await createPrediction(
    "Will it rain?", "Yes", "No", userId, channelId, closesAt
);

// Place a bet
await placeBet(market.id, userId, "Yes", 100);

// Resolve
await resolvePrediction(market.id, "Yes");
```

Use the `/predict` slash command to create markets via Liber AI.

---

## What is my starting casino balance?

Each user starts with **1000 XP** balance. This is stored in the `casino_balances` table:
```sql
CREATE TABLE IF NOT EXISTS casino_balances (
    user_id TEXT PRIMARY KEY,
    balance INTEGER DEFAULT 1000,
    lifetime_won INTEGER DEFAULT 0,
    lifetime_lost INTEGER DEFAULT 0,
    updated_at INTEGER
);
```

---

## Can I lose all my XP?

Yes. If your casino balance reaches 0, you cannot place further bets until you earn more XP through messaging.

---

## What is the quiz system?

The `/quiz` slash command generates quiz questions on requested topics and difficulties. Correct/incorrect answers are tracked in the `quiz_scores` table:
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

## Are all commands instant?

No. Commands are categorized as:
- **Rust** (instant): `/roll`, `/flip`, `/slots`, `/blackjack`, `/leaderboard`, `/starboard`
- **Liber** (AI): `/8ball`, `/rps`, `/trivia`, `/joke`, `/wyr`, `/rate`, `/brainrot`, `/wys`, `/choose`, `/assess`, `/quiz`, `/predict`, `/summary`

Rust commands execute instantly in the backend. Liber commands use the AI engine for response generation.

---

## Marketplace API Reference

### Get Marketplace Items

```typescript
import { getMarketplaceItems } from "./lib/api";

// All public items
const all = await getMarketplaceItems();

// Filter by server
const serverItems = await getMarketplaceItems(serverId);

// Filter by type
const models = await getMarketplaceItems(serverId, "model");

// Search
const searchResults = await getMarketplaceItems(serverId, null, "search term");
```

### Publish Item

```typescript
import { publishMarketplaceItem } from "./lib/api";

interface PublishOptions {
  itemType: "model" | "image" | "audio" | "text";
  name: string;
  description?: string;
  authorId: string;
  serverId?: string; // null for global
  visibility: "public" | "server" | "private";
  data: Uint8Array;
  tags?: string;
  thumbnail?: Uint8Array;
}

const item = await publishMarketplaceItem(
  options.itemType,
  options.name,
  options.description,
  options.authorId,
  options.serverId,
  options.visibility,
  options.data,
  options.tags
);
```

### Like/Unlike

```typescript
import { likeMarketplaceItem, unlikeMarketplaceItem } from "./lib/api";

await likeMarketplaceItem(itemId, userId);   // Add like
await unlikeMarketplaceItem(itemId, userId); // Remove like
```

### Get My Items

```typescript
import { getMyItems } from "./lib/api";

const myItems = await getMyItems(userId);
const myModels = await getMyItems(userId, "model");
```

---

## Casino Game Strategies

### Slots Strategy

The slot machine has a house edge of approximately 40%. This means:
- For every 100 XP bet, you can expect to get back ~60 XP
- The best outcome is 3 matching symbols (5x multiplier)
- Slots are high-variance — you might win big or lose quickly

**Tips:**
- Bet small amounts to play longer
- Don't chase losses
- Slots are for entertainment, not profit

### Blackjack Strategy

Blackjack has a lower house edge (~15%):
- "Hit" on 11 or lower
- "Stand" on 17 or higher
- Between 12-16, it's a judgment call

**Tips:**
- Blackjack offers better odds than slots
- Standing is generally safer than hitting
- The dealer draws until 17+

### Balance Management

```
Start: 1000 XP

Conservative approach:
- Bet 10 XP per game (1% of starting balance)
- Play 100+ games before going broke
- Focus on blackjack for better odds

Aggressive approach:
- Bet 100 XP per game (10% of starting balance)
- Higher risk, higher reward
- Slots for big multipliers
```

---

## XP Earning Rates

| Activity | XP Gained | Frequency Limit |
|----------|-----------|-----------------|
| Send a message | 10 XP | Per message |
| Get message starred | 50 XP | Per star |
| Win casino game | Bet × multiplier | Per game |
| Complete quiz | 25 XP (correct) | Per question |
| Daily login bonus | 50 XP | Once per day |
| Upload marketplace item | 100 XP | Per item |
| Get marketplace like | 5 XP | Per like |

### XP per Hour Estimates

| Activity Level | Messages/Hour | XP/Hour |
|----------------|:------------:|:-------:|
| Casual chatting | ~20 | 200 |
| Active discussion | ~60 | 600 |
| Heavy user | ~120 | 1200 |
| With casino wins | + Variable | + More |

---

## Prediction Market Example

```
Market: "Will release v2.0 be ready by Friday?"

Created by: Alice
Options: Yes / No
Closes: Friday 5pm
Resolved: Yes

Bets:
  Bob:     Yes — 200 XP
  Charlie: No  — 100 XP
  Diana:   Yes — 50 XP

Resolution:
  Outcome: Yes (release happened)
  Winners: Bob (200 XP), Diana (50 XP)
  Each winner gets proportional payout from losers' pool
  Charlie's 100 XP distributed to Bob and Diana
```

---

## Marketplace & Games FAQ Summary

## Marketplace Item Data Flow

```
Publisher                          Other Peers
────────                          ───────────
1. User publishes item
2. INSERT into marketplace_items (local DB)
3. Item visible locally immediately
4. CRDT sync item to LAN peers
5. Peers receive item
6. INSERT into their local DB
7. Item visible to peer
```

### Item Permissions

| Visibility | Visible To | Synced To |
|-----------|------------|-----------|
| `public` | All peers | All servers |
| `server` | Server members | Specific server members |
| `private` | Only you | Not synced |

---

## Casino Balance History

The `casino_balances` table tracks:

```sql
SELECT * FROM casino_balances WHERE user_id = '...';
-- user_id | balance | lifetime_won | lifetime_lost | updated_at
-- abc123  | 1500    | 5000         | 4500          | 1718000000000
```

### Win/Loss Tracking

The lifetime tracking helps answer:
- How much XP have I won total?
- How much XP have I lost total?
- What is my net gain/loss?
- Am I generally lucky or unlucky?

---

## Quiz System Details

### Quiz Topics and Difficulties

| Difficulty | Questions | Time Limit |
|------------|-----------|------------|
| Easy | Basic knowledge | 30 seconds |
| Medium | Intermediate | 20 seconds |
| Hard | Expert | 15 seconds |
| Impossible | Very obscure | 10 seconds |

### Score Multipliers

| Difficulty | Correct | Incorrect |
|------------|---------|-----------|
| Easy | 10 XP | 0 XP |
| Medium | 25 XP | 0 XP |
| Hard | 50 XP | -10 XP |
| Impossible | 100 XP | -25 XP |

---

## Marketplace & Games FAQ Summary

| Question | Answer |
|----------|--------|
| What can I publish? | Models, images, audio, text |
| Is Marketplace local? | Yes, all items in local DB |
| Can I like items? | Yes, heart icon |
| Can I delete items? | Yes, from My Creations |
| Are casino games fair? | Yes, cryptographically secure RNG |
| What's my starting balance? | 1000 XP |
| Can I lose all XP? | Yes, earn more by messaging |
| How do I check level? | `/leaderboard` or API |
| What's the best game to play? | Blackjack (lower house edge) |
| Can I create prediction markets? | Yes, via API |
| How do I earn XP? | Messages, stars, games, quizzes |
| Is there a daily bonus? | Yes, 50 XP per day |
| Can I publish to everyone? | Yes, use `public` visibility |
| How are marketplace items synced? | Via CRDT to LAN peers |
| What happens if I lose all XP? | Must earn more via messages |

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

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ