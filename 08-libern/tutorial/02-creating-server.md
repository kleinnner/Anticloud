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
Document ID: TUT-002
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Creating and Managing a Server

## Introduction

Servers are the core organizational unit in Libern. Each server contains channels, members, roles, and its own `.aioss` session ledger. This tutorial covers creating servers, managing channels, and inviting members.

### Server Architecture

Each server in Libern is an isolated container with its own:

```
┌─────────────────────────────────────────────────────┐
│                   Server                             │
│  ┌───────────────────────────────────────────────┐  │
│  │  Channels                                      │  │
│  │  ┌───────┐  ┌───────┐  ┌──────────┐          │  │
│  │  │ Text  │  │ Voice │  │ Whiteboard│          │  │
│  │  └───────┘  └───────┘  └──────────┘          │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │  Members + Roles (with permission bitmask)     │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │  .aioss Session (tamper-evident hash chain)   │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │  Invite Codes (join management)               │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## Step 1: Create a Server

### Using the UI

1. Click the **"+"** button at the bottom of the ServerListSidebar.
2. The `CreateServerModal` component opens.
3. Enter a **Server Name** (required).
4. Optionally provide an **Avatar Path** (local file path).
5. Click **Create**.

### What Happens Internally

The `create_server` Tauri command (`apps/desktop/src-tauri/src/commands/server.rs:78`) performs these steps:

1. Generate a new UUID for the server ID.
2. Generate an 8-character invite code using characters from `ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789`.
3. Insert the server into the `servers` table.
4. Create two default channels:
   - `#general` (type: `text`, position 0)
   - `#Voice` (type: `voice`, position 1)
5. Send a welcome message from Liber to `#general`.

```rust
// From apps/desktop/src-tauri/src/commands/server.rs
#[tauri::command]
pub fn create_server(
    db: State<Database>,
    name: String,
    owner_id: String,
    avatar_path: Option<String>,
) -> Result<Server, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp_millis();
    let invite_code = generate_invite_code(8);

    conn.execute(
        "INSERT INTO servers (id, name, owner_id, invite_code, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        rusqlite::params![id, name, owner_id, invite_code, now, now],
    ).map_err(|e| e.to_string())?;

    let general_id = Uuid::new_v4().to_string();
    let voice_id = Uuid::new_v4().to_string();

    conn.execute(
        "INSERT INTO channels (id, server_id, name, kind, position, created_at)
         VALUES (?1, ?2, 'general', 'text', 0, ?3),
                (?4, ?2, 'Voice', 'voice', 1, ?3)",
        rusqlite::params![general_id, id, now, voice_id],
    ).map_err(|e| e.to_string())?;

    // Send welcome message
    let msg_id = Uuid::new_v4().to_string();
    let liber_id = "00000000-0000-0000-0000-000000000001";
    let content = format!("Welcome to **{}**!\nThis server's session is recorded in the .aioss ledger.", name);
    conn.execute(
        "INSERT INTO messages (id, channel_id, author_id, content, hlc_timestamp, signature, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?5)",
        rusqlite::params![msg_id, general_id, liber_id, content, now, vec![0u8; 64]],
    ).map_err(|e| e.to_string())?;

    Ok(Server { id, name, owner_id, avatar_path, invite_code, created_at: now, updated_at: now })
}
```

### Welcome Message

When a server is created, Liber posts a welcome message to `#general`:

```
▄▄                     ██               ▄▄
... (Libern ASCII art logo)

Welcome to Libern! This server's session is recorded in the .aioss ledger
(AI Operated Session Store) — a tamper-evident binary file format with
SHA3-256 hash chaining. Every message is cryptographically sealed.

─── Useful Tools ───
/help       – Show available commands
/ask        – Ask Liber AI anything
/roll       – Roll dice (e.g. /roll 2d6)
/flip       – Flip a coin
/market     – Browse the marketplace
/whiteboard – Open collaborative canvas
/voice      – Join voice chat
```

---

## Step 2: Manage Channels

Channels are displayed in the ChannelSidebar. The `ChannelSidebar` component renders channels grouped by type.

### Channel Types

| Kind | Icon | Description |
|------|------|-------------|
| `text` | `#` | Text-based chat with markdown support |
| `voice` | `🔊` | Voice chat channel |
| `whiteboard` | `🎨` | Collaborative whiteboard canvas |
| `world` | `🌍` | 3D spatial world |

### Channel Display Hierarchy

```
┌─────────────────────────────────────────────┐
│  ChannelSidebar                             │
│                                             │
│  Text Channels                              │
│  ┌──────────────────────────────────────┐   │
│  │ # general                     🔔    │   │
│  │ # random                      🔔    │   │
│  │ # dev-log                     🔔    │   │
│  │ + Add Channel                       │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  Voice Channels                             │
│  ┌──────────────────────────────────────┐   │
│  │ 🔊 Voice                             │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  Whiteboard                                 │
│  ┌──────────────────────────────────────┐   │
│  │ 🎨 Canvas                            │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Create a Channel

1. In the ChannelSidebar, click the **"+"** button next to "Text Channels".
2. The `CreateChannelModal` component opens.
3. Enter a channel name.
4. Select the channel kind (text, voice, whiteboard).
5. Optionally select a parent channel.
6. Click Create.

Internally, the `create_channel` command inserts the channel and sends a welcome message for text channels:

```rust
// From apps/desktop/src-tauri/src/commands/channel.rs
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

    // Calculate next position
    let max_pos: i32 = conn.query_row(
        "SELECT COALESCE(MAX(position), -1) + 1 FROM channels WHERE server_id = ?1 AND kind = ?2",
        rusqlite::params![server_id, kind],
        |row| row.get(0),
    ).map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO channels (id, server_id, name, kind, position, parent_id, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        rusqlite::params![id, server_id, name, kind, max_pos, parent_id, now],
    ).map_err(|e| e.to_string())?;

    // Send welcome message for text channels
    if kind == "text" {
        let msg_id = Uuid::new_v4().to_string();
        let liber_id = "00000000-0000-0000-0000-000000000001";
        conn.execute(
            "INSERT INTO messages (id, channel_id, author_id, content, hlc_timestamp, signature, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?5)",
            rusqlite::params![msg_id, id, liber_id,
                format!("Welcome to #{}! Start collaborating.", name), now, vec![0u8; 64]],
        ).map_err(|e| e.to_string())?;
    }

    Ok(Channel { id, server_id, name, kind, position: max_pos, parent_id, created_at: now })
}
```

### Delete a Channel

1. Right-click a channel (context menu).
2. Select Delete Channel.

The `delete_channel` command deletes the channel and cascades to delete all messages:

```rust
#[tauri::command]
pub fn delete_channel(db: State<Database>, id: String) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    // ON DELETE CASCADE handles messages, reactions, pins
    conn.execute("DELETE FROM channels WHERE id = ?1", rusqlite::params![id])
        .map_err(|e| e.to_string())?;
    Ok(())
}
```

---

## Step 3: Invite Members

Libern supports invite codes for adding members to a server.

### Create an Invite

1. Navigate to server settings or use the API:
```typescript
import { createInvite } from "./lib/api";
const code = await createInvite(
    serverId,       // The server UUID
    userId,         // Your user UUID
    maxUses,        // Optional: limit uses (e.g., 10)
    expiresAt       // Optional: expiry timestamp (ms)
);
```

The `create_invite` command generates a 12-character code using a cryptographically random selection from a charset of 52 alphanumeric characters (excluding ambiguous ones like `0`, `O`, `1`, `l`).

```rust
// From apps/desktop/src-tauri/src/commands/server.rs
const CHARSET: &[u8] = b"ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

pub fn generate_invite_code(length: usize) -> String {
    let mut rng = rand::thread_rng();
    (0..length)
        .map(|_| {
            let idx = rng.gen_range(0..CHARSET.len());
            CHARSET[idx] as char
        })
        .collect()
}
```

### Join via Invite

1. Click **"Join with Invite"**.
2. Enter the 12-character invite code.
3. The `join_via_invite` command validates:
   - Invite exists in the database
   - Hasn't exceeded `max_uses` (if set)
   - Hasn't expired (if `expires_at` is set)
4. If valid, increments `use_count` and returns the server details.

```typescript
import { joinViaInvite } from "./lib/api";
const server = await joinViaInvite("AbCdEfGhIjKl");
```

### Invite Validation Flow

```
┌──────────┐    ┌──────────────┐    ┌───────────────────┐
│  User    │    │  joinViaInvite│   │  join_via_invite  │
│  enters  │───►│  ("code")    │───►│  (Rust command)   │
│  code    │    └──────────────┘    └─────────┬─────────┘
└──────────┘                                  │
                                              ▼
                                    ┌─────────────────────┐
                                    │ 1. SELECT FROM      │
                                    │    invites WHERE    │
                                    │    code = ?1        │
                                    ├─────────────────────┤
                                    │ 2. Check use_count <│
                                    │    max_uses         │
                                    ├─────────────────────┤
                                    │ 3. Check expires_at │
                                    │    > now            │
                                    ├─────────────────────┤
                                    │ 4. UPDATE use_count │
                                    │    += 1             │
                                    ├─────────────────────┤
                                    │ 5. RETURN server    │
                                    │    details          │
                                    └─────────────────────┘
```

### Rust Implementation

```rust
#[tauri::command]
pub fn join_via_invite(
    db: State<Database>,
    code: String,
) -> Result<Server, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    // Look up invite
    let invite = conn.query_row(
        "SELECT server_id, use_count, max_uses, expires_at FROM invites WHERE code = ?1",
        rusqlite::params![code],
        |row| {
            Ok(InviteLookup {
                server_id: row.get(0)?,
                use_count: row.get(1)?,
                max_uses: row.get(2)?,
                expires_at: row.get(3)?,
            })
        },
    ).map_err(|_| "Invalid invite code".to_string())?;

    // Validate
    if let Some(max) = invite.max_uses {
        if invite.use_count >= max {
            return Err("Invite has reached maximum uses".to_string());
        }
    }
    if let Some(exp) = invite.expires_at {
        if chrono::Utc::now().timestamp_millis() > exp {
            return Err("Invite has expired".to_string());
        }
    }

    // Increment use count
    conn.execute(
        "UPDATE invites SET use_count = use_count + 1 WHERE code = ?1",
        rusqlite::params![code],
    ).map_err(|e| e.to_string())?;

    // Return server details
    conn.query_row(
        "SELECT id, name, owner_id, avatar_path, invite_code, created_at, updated_at
         FROM servers WHERE id = ?1",
        rusqlite::params![invite.server_id],
        |row| {
            Ok(Server {
                id: row.get(0)?,
                name: row.get(1)?,
                owner_id: row.get(2)?,
                avatar_path: row.get(3)?,
                invite_code: row.get(4)?,
                created_at: row.get(5)?,
                updated_at: row.get(6)?,
            })
        },
    ).map_err(|_| "Server not found".to_string())
}
```

### List, Delete Invites

```typescript
import { getInvites, deleteInvite } from "./lib/api";

// List all invites for a server
const invites = await getInvites(serverId);

// Delete an invite
await deleteInvite("AbCdEfGhIjKl");
```

---

## Step 4: Server Settings

### Update Server

You can update the server name and avatar:

```typescript
import { updateServer } from "./lib/api";
await updateServer(serverId, "New Name", "/path/to/avatar.png");
```

### Delete Server

```typescript
import { deleteServer } from "./lib/api";
await deleteServer(serverId);
```

This deletes the server and cascades through all channels, messages, roles, and invites. The `ON DELETE CASCADE` foreign key constraints in SQLite handle all dependent records:

```
Server Deletion Cascade:
  servers ──► channels ──► messages ──► reactions
                          ──► pins
          ──► roles ──► role_assignments
          ──► invites
          ──► user_xp
          ──► server_stats
```

### Server Statistics

The `get_server_stats` command aggregates:
- Total messages
- Total members
- Total voice minutes
- Messages today

```typescript
import { getServerStats } from "./lib/api";
const stats = await getServerStats(serverId);
```

```rust
#[tauri::command]
pub fn get_server_stats(
    db: State<Database>,
    server_id: String,
) -> Result<ServerStats, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let total_messages: i64 = conn.query_row(
        "SELECT COUNT(*) FROM messages m
         INNER JOIN channels c ON m.channel_id = c.id
         WHERE c.server_id = ?1",
        rusqlite::params![server_id], |row| row.get(0),
    ).map_err(|e| e.to_string())?;

    let total_members: i64 = conn.query_row(
        "SELECT COUNT(DISTINCT ra.user_id) FROM role_assignments ra
         INNER JOIN roles r ON ra.role_id = r.id WHERE r.server_id = ?1",
        rusqlite::params![server_id], |row| row.get(0),
    ).map_err(|e| e.to_string())?;

    let messages_today: i64 = conn.query_row(
        "SELECT COUNT(*) FROM messages m
         INNER JOIN channels c ON m.channel_id = c.id
         WHERE c.server_id = ?1 AND m.created_at > ?2",
        rusqlite::params![server_id, chrono::Utc::now().timestamp_millis() - 86400000],
        |row| row.get(0),
    ).map_err(|e| e.to_string())?;

    Ok(ServerStats { total_messages, total_members, total_voice_minutes: 0, messages_today })
}
```

---

## Step 5: Server Navigation (Zustand Store)

The UI state for server and channel selection is managed by `uiStore.ts`:

```typescript
// From apps/desktop/src/stores/uiStore.ts
interface UiState {
  view: ViewType;              // "chat" | "marketplace" | "compliance"
  selectedServerId: string | null;
  selectedChannelId: string | null;
  rightPanel: "members" | "search" | "thread" | null;
}

export type ViewType = "chat" | "marketplace" | "compliance";
```

When you switch away from chat view (to marketplace or compliance), the store saves the previous server/channel selection so it can be restored when you return.

The `serverStore.ts` manages the server and channel data:

```typescript
// From apps/desktop/src/stores/serverStore.ts
interface ServerState {
  servers: Server[];
  channels: Map<string, Channel[]>;
  isLoading: boolean;
  setServers: (servers: Server[]) => void;
  setChannels: (serverId: string, channels: Channel[]) => void;
  addServer: (server: Server) => void;
  addChannel: (serverId: string, channel: Channel) => void;
  removeServer: (id: string) => void;
}
```

### Store Initialization Flow

```
App startup
    │
    ▼
uiStore initializes
    │  view: "chat"
    │  selectedServerId: null
    │  selectedChannelId: null
    ▼
serverStore.loadServers()
    │
    ▼
getServers() API call
    │
    ▼
Servers loaded into store
    │
    ▼
For selected server:
  getChannels(serverId)
    │
    ▼
Channels loaded into store
    │
    ▼
First channel auto-selected
```

---

## Step 6: Database Schema for Servers

The SQLite schema for servers and channels is defined in `crates/libern-core/src/db/schema.rs`:

```sql
-- Servers table
CREATE TABLE IF NOT EXISTS servers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id TEXT NOT NULL REFERENCES users(id),
    avatar_path TEXT,
    invite_code TEXT UNIQUE,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- Channels table
CREATE TABLE IF NOT EXISTS channels (
    id TEXT PRIMARY KEY,
    server_id TEXT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    kind TEXT NOT NULL DEFAULT 'text',
    position INTEGER NOT NULL DEFAULT 0,
    parent_id TEXT REFERENCES channels(id),
    created_at INTEGER NOT NULL
);

-- Invites table
CREATE TABLE IF NOT EXISTS invites (
    code TEXT PRIMARY KEY,
    server_id TEXT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    created_by TEXT NOT NULL REFERENCES users(id),
    max_uses INTEGER,
    use_count INTEGER NOT NULL DEFAULT 0,
    expires_at INTEGER,
    created_at INTEGER NOT NULL
);

-- Server statistics
CREATE TABLE IF NOT EXISTS server_stats (
    server_id TEXT PRIMARY KEY REFERENCES servers(id),
    total_messages INTEGER DEFAULT 0,
    total_members INTEGER DEFAULT 0,
    total_voice_minutes INTEGER DEFAULT 0,
    messages_today INTEGER DEFAULT 0,
    last_updated INTEGER
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_channels_server ON channels(server_id);
CREATE INDEX IF NOT EXISTS idx_invites_server ON invites(server_id);
CREATE INDEX IF NOT EXISTS idx_server_owner ON servers(owner_id);
```

### Relationship Diagram

```
users ──1:N──► servers (owner_id)
servers ──1:N──► channels (server_id)
servers ──1:N──► roles (server_id)
servers ──1:N──► invites (server_id)
servers ──1:1──► server_stats (server_id)
channels ──1:N──► messages (channel_id)
channels ──1:N──► pinned_messages (channel_id)
```

---

## Step 7: .aioss Session Recording

Each server's activity is recorded in an `.aioss` (AI Operated Session Store) ledger. When the server is created, a new session is started automatically. Every message and action is appended as an entry in the hash chain.

The `AiossScheduler` automatically seals sessions at a configurable interval (default: 10 minutes), writing them to `aioss/chat/` in the app data directory.

### Session Lifecycle

```
Server Created
    │
    ▼
.aioss Session Created
(session_id, session_type=chat)
    │
    ▼
Actions Recorded as Entries
┌──────┐  ┌──────┐  ┌──────┐
│Entry0│─►│Entry1│─►│Entry2│──► ...
└──────┘  └──────┘  └──────┘
  │          │          │
  ▼          ▼          ▼
parent=0  parent=    parent=
[0;32]    hash(E0)  hash(E1)
    │
    ▼
Session Sealed (every 10 min)
    │
    ▼
Written to disk:
  aioss/chat/{uuid}_{ts}.aioss
  aioss/chat/{uuid}_{ts}.aioss.json
```

### Starting a Session

```typescript
import { createAiossSession } from "./lib/api";
const session = await createAiossSession(0); // 0 = chat session
```

---

## Step 8: Use Cases

### Team Collaboration Server

```
Use Case: Development Team
────────────────────────
Channels:
  # general         — Team announcements
  # dev-log         — Development updates
  # bug-reports     — Bug tracking
  🔊 Standup        — Daily voice standup
  🎨 Architecture   — Whiteboard for diagrams

Roles:
  @admin            — Full permissions
  @developer        — Send messages, attach files
  @viewer           — Read-only access

Invites:
  dev-invite        — Max 10 uses, no expiry
  guest-invite      — Max 5 uses, 7-day expiry
```

### Education Server

```
Use Case: Online Classroom
────────────────────────
Channels:
  # announcements   — Course updates
  # lectures        — Class discussions
  # homework        — Assignment submissions
  🔊 Office Hours   — Voice Q&A sessions
  🎨 Whiteboard     — Collaborative problem solving

Roles:
  @instructor       — Manage channels, messages
  @ta               — Moderate, manage messages
  @student          — Send messages, attach files
```

---

## Next Steps

- **Tutorial 03**: Sending Messages — Learn about text chat, markdown, and attachments
- **Tutorial 06**: Managing Roles — Create roles and assign permissions

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

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

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