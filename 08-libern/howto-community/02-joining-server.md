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
Document ID: CMT-002
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Joining a Server

## Introduction

Servers are the core organizational unit in Libern. Each server contains channels (text, voice, whiteboard, 3D world), members, roles with permissions, and its own `.aioss` session ledger. This guide covers how to join a server via invite code, create your own server, and navigate the Libern interface.

Think of a server as a private community space. Within each server, you can have multiple channels for different topics, voice chats, collaborative whiteboards, and even 3D worlds. Every server has its own session recorded in the tamper-evident `.aioss` ledger.

By the end of this guide, you will be able to:
- Join a server using an invite code
- Create your own server
- Create and manage channels
- Navigate between servers and channels
- Understand the main interface layout
- Manage roles and permissions

---

## Prerequisites

- You have completed **How-To Guide 01** (Creating Your Account)
- Libern is installed and you have an identity
- You have either an invite code from a friend or want to create your own server

---

## Part 1: The Libern Interface Layout

Before diving into server operations, familiarizing yourself with the interface will make everything easier.

### Interface Anatomy

The Libern main window is divided into these areas:

```
┌──────────┬──────────────┬──────────────────────────────────────┬──────────┐
│ Server   │ Channel      │ Main Content Area                    │ Right    │
│ List     │ Sidebar      │                                      │ Panel    │
│ (72px)   │ (240px)      │    (flexible width)                  │ (0-300px)│
├──────────┼──────────────┤                                      ├──────────┤
│ 🏠 DM    │ # general    │                                      │ Member   │
│ 🏪 Mkt   │ # random     │  Chat messages, whiteboard canvas,   │ List     │
│ 🛡️ Comp  │ 🔊 Voice     │  or voice panel goes here            │          │
│          │ 🎨 Whiteboard│                                      │          │
│ [Sv A]   │              │                                      │          │
│ [Sv B]   │              │                                      │          │
│ [+]      │              │                                      │          │
├──────────┴──────────────┴──────────────────────────────────────┴──────────┤
│ UserPanel (avatar, name, status, mute, settings)                           │
└───────────────────────────────────────────────────────────────────────────┘
```

### Sidebar Dimensions

The sidebar widths are defined in the Tailwind configuration and component styles:

| Element | Width | CSS Class |
|---------|-------|-----------|
| Server List | 72px | `w-[72px]` |
| Channel Sidebar | 240px | `w-60` |
| Right Panel | 0-300px | Collapsible (`max-w-[300px]`) |

### Server List Sidebar

The leftmost column (72 pixels wide) contains:
- **Direct Messages** (`@`) — Access your global DM conversations
- **Marketplace** (`🏪`) — Browse and publish marketplace items
- **Compliance** (`🛡️`) — View .aioss sessions, run health diagnostics, export ledgers
- **Server icons** — Circular icons for each server you belong to, displaying either an avatar image or the server's initials
- **"+" button** — Create a new server

The server icons are rendered by the `ServerIcon` component:

```typescript
// apps/desktop/src/components/layout/ServerListSidebar.tsx
export function ServerIcon({ server, isSelected, onClick }: ServerIconProps) {
    return (
        <div
            onClick={onClick}
            className={`
                w-12 h-12 rounded-full flex items-center justify-center
                text-white font-bold text-lg cursor-pointer
                transition-all duration-200
                ${isSelected
                    ? "bg-discord-accent rounded-2xl"
                    : "bg-gray-700 hover:bg-discord-hover hover:rounded-2xl"
                }
            `}
            title={server.name}
        >
            {server.avatar_path
                ? <img src={server.avatar_path} className="w-full h-full rounded-full object-cover" />
                : server.name.charAt(0).toUpperCase()
            }
        </div>
    );
}
```

### Channel Sidebar

The second column (240 pixels wide) lists channels for the currently selected server:
- **Text Channels** section — Channels prefixed with `#`
- **Voice Channels** section — Channels prefixed with `🔊`
- **Whiteboard Channels** section — Channels prefixed with `🎨`
- **World Channels** section — Channels prefixed with `🌍`
- **"+" buttons** — Create new channels within each section

### Main Content Area

The center area changes based on the selected channel:
- **ChatView** — Messages, message input, Liber AI responses
- **WhiteboardView** — Fabric.js infinite canvas with drawing tools
- **VoiceView** — Voice chat controls and user list

### Right Panel

The right panel (collapsible) shows depending on context:
- **MemberList** — All members in the current server
- **SearchResults** — Message search results
- **ThreadPanel** — Message thread replies

### User Panel

The bottom-left panel shows:
- Your avatar and display name
- Online status indicator
- Mute/deafen buttons
- Settings button

### UI State Management

The `uiStore` Zustand store manages the entire interface state:

```typescript
// apps/desktop/src/stores/uiStore.ts
export type ViewType = "chat" | "marketplace" | "compliance";
export type RightPanelType = "members" | "search" | "thread" | null;

interface UiState {
    view: ViewType;
    selectedServerId: string | null;
    selectedChannelId: string | null;
    rightPanel: RightPanelType;
    setView: (view: ViewType) => void;
    setSelectedServer: (serverId: string | null) => void;
    setSelectedChannel: (channelId: string | null) => void;
    setRightPanel: (panel: RightPanelType) => void;
}

export const useUiStore = create<UiState>()((set) => ({
    view: "chat",
    selectedServerId: null,
    selectedChannelId: null,
    rightPanel: null,
    setView: (view) => set({ view }),
    setSelectedServer: (selectedServerId) => set({ selectedServerId }),
    setSelectedChannel: (selectedChannelId) => set({ selectedChannelId }),
    setRightPanel: (rightPanel) => set({ rightPanel }),
}));
```

---

## Part 2: Join a Server with an Invite Code

Joining a server requires a 12-character invite code. These codes are generated by server creators and can optionally have usage limits and expiration dates.

### During Onboarding

If you just completed onboarding and chose "Join with Invite":

1. You are presented with a text input field.
2. Enter the 12-character invite code exactly as provided (case-sensitive).
3. Click **"Join"** or press Enter.
4. The server appears in your server list immediately.

### From the Main Interface

1. Click the **"Join with Invite"** button (or use the "Join" option from the server list dropdown).
2. A modal dialog opens.
3. Enter the invite code.
4. Click **"Join"**.

### Using the API

For programmatic access:
```typescript
import { joinViaInvite } from "./lib/api";

const server = await joinViaInvite("AbCdEfGhIjKl");
// Returns: { id: "uuid...", name: "My Server", owner_id: "uuid...", ... }
```

### What Happens Internally

The `join_via_invite` Tauri command performs the following validation:

```rust
// From apps/desktop/src-tauri/src/commands/invite.rs
#[tauri::command]
pub fn join_via_invite(
    db: State<Database>,
    code: String,
) -> Result<Server, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    // Check invite validity
    let invite: (String, Option<i32>, i32, Option<i64>) = conn
        .query_row(
            "SELECT server_id, max_uses, use_count, expires_at
             FROM invites WHERE code = ?1",
            rusqlite::params![code],
            |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?)),
        )
        .map_err(|_| "Invalid invite code".to_string())?;

    let (server_id, max_uses, use_count, expires_at) = invite;

    if let Some(max) = max_uses {
        if use_count >= max {
            return Err("Invite has reached max uses".to_string());
        }
    }

    if let Some(expires) = expires_at {
        let now = chrono::Utc::now().timestamp_millis();
        if now > expires {
            return Err("Invite has expired".to_string());
        }
    }

    // Increment use count
    conn.execute(
        "UPDATE invites SET use_count = use_count + 1 WHERE code = ?1",
        rusqlite::params![code],
    ).map_err(|e| e.to_string())?;

    // Return server
    let server = conn.query_row(
        "SELECT id, name, owner_id, avatar_path, invite_code, created_at, updated_at
         FROM servers WHERE id = ?1",
        rusqlite::params![server_id],
        |row| Ok(Server {
            id: row.get(0)?,
            name: row.get(1)?,
            owner_id: row.get(2)?,
            avatar_path: row.get(3)?,
            invite_code: row.get(4)?,
            created_at: row.get(5)?,
            updated_at: row.get(6)?,
        }),
    ).map_err(|_| "Server not found".to_string())?;

    Ok(server)
}
```

The validation checks:
1. **Invite exists** in the `invites` table.
2. **Usage limit** — If `max_uses` is set, `use_count` must be less than `max_uses`.
3. **Expiration** — If `expires_at` is set, the current time must be before the expiration.
4. If all checks pass, `use_count` is incremented and the server object is returned.

### Getting an Invite Code

To create an invite code for others to join your server:

```typescript
import { createInvite } from "./lib/api";

// Unlimited uses, no expiry
const code = await createInvite(serverId, userId);

// Limited uses with 24-hour expiry
const code = await createInvite(serverId, userId, 10, Date.now() + 86400000);
```

Share this code with friends through any channel (in-person, email, another messaging app). The code is 12 characters long, using a charset that excludes ambiguous characters like `0`, `O`, `1`, and `l`:

```
Charset: ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789
```

The code generation function in Rust:

```rust
fn generate_code() -> String {
    use rand::Rng;
    const CHARSET: &[u8] = b"ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let mut rng = rand::thread_rng();
    (0..12)
        .map(|_| {
            let idx = rng.gen_range(0..CHARSET.len());
            CHARSET[idx] as char
        })
        .collect()
}
```

### Managing Invite Codes

As a server owner, you can view, create, and delete invite codes:

```typescript
import { getInvites, createInvite, deleteInvite } from "./lib/api";

// List all invites for your server
const invites = await getInvites(serverId);

// Delete an expired invite
await deleteInvite("expiredCode123");

// Create a fresh invite
const newCode = await createInvite(serverId, userId, 50, Date.now() + 604800000); // 50 uses, 7 days
```

---

## Part 3: Create a Server

Creating a server makes you the owner with full administrative control.

### During Onboarding

1. Click **"Create a Server"** on the server setup step.
2. The `CreateServerModal` component opens.
3. Enter a **Server Name** (required, e.g., "My Gaming Server").
4. Optionally provide an **Avatar** by clicking the avatar area and selecting an image.
5. Click **"Create"**.

### From the Main Interface

1. Click the **"+"** button at the bottom of the ServerListSidebar.
2. The `CreateServerModal` opens.
3. Enter the server name and optional avatar.
4. Click **Create**.

### What Happens Internally

The `create_server` Tauri command performs these steps:

```rust
// From apps/desktop/src-tauri/src/commands/server.rs
#[tauri::command]
pub fn create_server(
    db: State<Database>,
    name: String,
    owner_id: String,
    avatar_path: Option<String>,
) -> Result<Server, String> {
    let id: String;
    let general_id: String;
    let invite_code: String;
    let now: i64;
    let server_name: String;

    // Scope for DB lock — drop before calling liber_send_message to avoid deadlock
    {
        let conn = db.conn.lock().map_err(|e| e.to_string())?;
        id = Uuid::new_v4().to_string();
        invite_code = generate_invite_code();
        now = chrono::Utc::now().timestamp_millis();
        server_name = name.clone();

        conn.execute(
            "INSERT INTO servers (id, name, owner_id, avatar_path, invite_code, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
            rusqlite::params![id, name, owner_id, avatar_path, invite_code, now, now],
        ).map_err(|e| e.to_string())?;

        // Create default channels
        general_id = Uuid::new_v4().to_string();
        let voice_id = Uuid::new_v4().to_string();
        conn.execute(
            "INSERT INTO channels (id, server_id, name, kind, position, created_at)
             VALUES (?1, ?2, 'general', 'text', 0, ?3)",
            rusqlite::params![general_id, id, now],
        ).map_err(|e| e.to_string())?;
        conn.execute(
            "INSERT INTO channels (id, server_id, name, kind, position, created_at)
             VALUES (?1, ?2, 'Voice', 'voice', 1, ?3)",
            rusqlite::params![voice_id, id, now],
        ).map_err(|e| e.to_string())?;
    } // conn lock released

    // Send welcome message to #general
    let welcome = libern_core::ai::liber_user::server_welcome_message(&server_name);
    libern_core::ai::liber_user::liber_send_message(&db, &general_id, &welcome)?;

    Ok(Server {
        id,
        name: server_name,
        owner_id,
        avatar_path,
        invite_code,
        created_at: now,
        updated_at: now,
    })
}
```

Specifically:
1. A UUID v4 is generated as the server ID.
2. An 8-character invite code is generated (using the same charset as user-created invites).
3. The server is inserted into the `servers` table.
4. Two default channels are created:
   - `#general` (type: `text`, position 0)
   - `#Voice` (type: `voice`, position 1)
5. A welcome message from Liber is posted to `#general`:
   ```
   Welcome to Libern!

   This server's session is recorded in the .aioss ledger
   (AI Operated Session Store) — a tamper-evident binary file format
   with SHA3-256 hash chaining. Every message is cryptographically sealed.

   --- Useful Tools ---
   /help       – Show available commands
   /ask        – Ask Liber AI anything
   /roll       – Roll dice (e.g. /roll 2d6)
   /flip       – Flip a coin
   /market     – Browse the marketplace
   /whiteboard – Open collaborative canvas
   /voice      – Join voice chat
   ```

### The Welcome Message Function

```rust
// crates/libern-core/src/ai/liber_user.rs
pub fn server_welcome_message(server_name: &str) -> String {
    format!(
        "🏠 Welcome to **{server_name}**!\n\n\
         This server's session is recorded in the .aioss ledger \
         (AI Operated Session Store) — a tamper-evident binary file format \
         with SHA3-256 hash chaining. Every message is cryptographically sealed.\n\n\
         --- Useful Tools ---\n\
         /help       – Show available commands\n\
         /ask        – Ask Liber AI anything\n\
         /roll       – Roll dice (e.g. /roll 2d6)\n\
         /flip       – Flip a coin\n\
         /market     – Browse the marketplace\n\
         /whiteboard – Open collaborative canvas\n\
         /voice      – Join voice chat\n"
    )
}
```

### Server Creation Flow

```
User clicks [+]
      │
      ▼
┌──────────────────────┐
│ CreateServerModal     │
│ ┌──────────────────┐ │
│ │ Server Name: ____ │ │
│ │ Avatar: [Browse]  │ │
│ │ [Create] [Cancel] │ │
│ └──────────────────┘ │
└──────────────────────┘
      │
      ▼
┌──────────────────────────────┐
│ create_server() command       │
│  • Generate UUID + invite     │
│  • Insert into servers table  │
│  • Create #general channel    │
│  • Create #Voice channel      │
│  • Send Liber welcome message │
└──────────────────────────────┘
      │
      ▼
┌──────────────────────┐
│ Server added to list  │
│ #general is selected  │
└──────────────────────┘
```

---

## Part 4: Manage Channels

Channels are the sub-areas within a server where conversations happen.

### Channel Types

| Kind | Icon | Description |
|------|------|-------------|
| `text` | `#` | Text-based chat with markdown support |
| `voice` | `🔊` | Voice chat channel with mute/deafen controls |
| `whiteboard` | `🎨` | Collaborative drawing canvas with Fabric.js |
| `world` | `🌍` | 3D spatial world (sandbox mode) |

### Create a Channel

1. In the ChannelSidebar, locate the section for the type of channel you want to create.
2. Click the **"+"** button next to the section header (e.g., next to "Text Channels").
3. The `CreateChannelModal` opens.
4. Enter a **Channel Name** (lowercase, no spaces recommended).
5. Select the **Channel Kind** (text, voice, whiteboard).
6. Optionally select a **Parent Channel** to create nested channels.
7. Click **Create**.

### What Happens Internally

The `create_channel` command inserts the channel and, for text channels, sends an introductory message:

```rust
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

    // Calculate position
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

    // Send welcome for text channels
    if kind == "text" {
        let liber_id = "00000000-0000-0000-0000-000000000001";
        let msg_id = Uuid::new_v4().to_string();
        conn.execute(
            "INSERT INTO messages (id, channel_id, author_id, content, hlc_timestamp, signature, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?5)",
            rusqlite::params![msg_id, id, liber_id,
                format!("Welcome to #{}! This channel is recorded in the .aioss ledger.", name),
                now, vec![0u8; 64]],
        ).map_err(|e| e.to_string())?;
    }

    Ok(Channel { id, server_id, name, kind, position: max_pos, parent_id, created_at: now })
}
```

### Delete a Channel

1. Right-click a channel name in the ChannelSidebar.
2. Select **"Delete Channel"** from the context menu.
3. Confirm the deletion in the dialog.

Channel deletion cascades to all messages, pinned messages, and reactions within that channel.

### Rename a Channel

1. Right-click a channel name.
2. Select **"Rename Channel"**.
3. Enter the new name.
4. Press Enter to confirm.

### Channel Nesting

Channels can be nested under parent channels for hierarchical organization:

```
# Text Channels
├── # general
├── # random
├── 📁 Development
│   ├── # frontend
│   ├── # backend
│   └── # devops
└── # announcements
```

To create a nested channel, select a **Parent Channel** in the `CreateChannelModal`.

---

## Part 5: Server Navigation

### Switch Between Servers

Click any server icon in the ServerListSidebar. The ChannelSidebar updates to show that server's channels.

### Switch Between Views

The three global icons at the top of the ServerListSidebar switch the entire interface context:

| Icon | View | Description |
|------|------|-------------|
| `@` | Chat | Your direct messages and all servers |
| `🏪` | Marketplace | Browse and publish items |
| `🛡️` | Compliance | View .aioss sessions and diagnostics |

When you switch away from chat view, the store saves your previous server/channel selection.

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+K` | Quick switcher (search servers and channels) |
| `Ctrl+,` | Open settings |
| `Escape` | Close modal or deselect |
| `Alt+Up` | Previous server |
| `Alt+Down` | Next server |
| `Ctrl+Shift+I` | Toggle developer tools |
| `Ctrl+F` | Search current channel |

### Quick Switcher

The quick switcher (`Ctrl+K`) allows you to quickly navigate to any server or channel by typing its name:

1. Press `Ctrl+K` to open the quick switcher modal.
2. Start typing the server or channel name.
3. Use arrow keys to navigate results.
4. Press Enter to jump to the selected item.

---

## Part 6: Server Settings

Server owners can configure server-wide settings.

### Accessing Server Settings

1. Click the server name at the top of the ChannelSidebar.
2. Select **"Server Settings"** from the dropdown.
3. The settings page opens in the main content area.

### Update Server Name and Avatar

```typescript
import { updateServer } from "./lib/api";

await updateServer(serverId, "New Server Name", "/path/to/new/avatar.png");
```

### View Server Statistics

```typescript
import { getServerStats } from "./lib/api";

const stats = await getServerStats(serverId);
// { total_messages: 1520, total_members: 12, total_voice_minutes: 345, messages_today: 47 }
```

### Delete a Server

1. In Server Settings, scroll to the bottom.
2. Click **"Delete Server"**.
3. Type the server name to confirm.
4. Click **"Delete"**.

Deleting a server cascades to delete all channels, messages, roles, assignments, invites, and statistics.

### Server Settings Interface

The server settings page is organized into tabs:

```
┌─────────────────────────────────────────────┐
│ Server Settings — My Server                  │
├──────────┬──────────────────────────────────┤
│ Overview │ Server Name: [____________]       │
│ AI       │ Avatar: [Browse...]               │
│ Roles    │ Owner: @username                  │
│ Invites  │ Created: June 19, 2026            │
│ Delete   │ Server ID: uuid...                │
│          │                                    │
│          │ [Save Changes]                    │
├──────────┴──────────────────────────────────┤
│ Danger Zone                                   │
│ [Delete Server — type name to confirm]       │
└──────────────────────────────────────────────┘
```

---

## Part 7: Managing Your Server List

### Reorder Servers

Drag and drop server icons in the ServerListSidebar to reorder them. The custom order is saved in the UI store.

### Leave a Server

1. Right-click the server icon in the ServerListSidebar.
2. Select **"Leave Server"**.
3. Confirm.

Leaving a server does not delete your messages (they remain as authored by your public key), but you lose access to the server's channels.

### Folders (Future Feature)

Server folders are planned for a future release, allowing you to group related servers into collapsible categories.

---

## Part 8: Multi-Server Workflows

### Cross-Server Messaging

Libern supports cross-server mentions and references. You can link to messages in other servers using their message ID if you have access to that server.

### Server-Specific Liber AI

Liber is present in every server and can be configured per-server:
- Custom personality prompt
- Moderation level (Off, FlagOnly, FlagAndBlock)
- Enabled channels
- Document RAG permissions

Configure per-server AI settings in Server Settings under the **"AI"** tab.

### Roles and Permissions

Server roles control what members can do:

```typescript
import { createRole, assignRole, checkPermission } from "./lib/api";

// Create a moderator role
const role = await createRole(serverId, "Moderator", 0x00ff00, PERM_MANAGE_MESSAGES | PERM_KICK_MEMBERS);

// Assign role to a user
await assignRole(userId, role.id);

// Check permission
const canKick = await checkPermission(userId, serverId, PERM_KICK_MEMBERS);
```

### Available Permissions

| Permission | Value | Description |
|------------|-------|-------------|
| `PERM_CREATE_INVITE` | 1 | Create invite codes |
| `PERM_KICK_MEMBERS` | 2 | Remove members |
| `PERM_MANAGE_ROLES` | 4 | Create/edit/delete roles |
| `PERM_MANAGE_CHANNELS` | 8 | Create/edit/delete channels |
| `PERM_MANAGE_SERVER` | 16 | Edit server settings |
| `PERM_SEND_MESSAGES` | 32 | Send text messages |
| `PERM_MANAGE_MESSAGES` | 64 | Delete/edit any message |
| `PERM_MUTE_MEMBERS` | 128 | Mute members in voice |
| `PERM_DEAFEN_MEMBERS` | 256 | Deafen members in voice |
| `PERM_CREATE_WHITEBOARD` | 512 | Create whiteboard strokes |

---

## Part 9: Understanding Servers in the Database

Servers are stored in the `servers` table:

```sql
CREATE TABLE IF NOT EXISTS servers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id TEXT NOT NULL REFERENCES users(id),
    avatar_path TEXT,
    invite_code TEXT UNIQUE,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
```

Channels are stored in the `channels` table:

```sql
CREATE TABLE IF NOT EXISTS channels (
    id TEXT PRIMARY KEY,
    server_id TEXT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    kind TEXT NOT NULL DEFAULT 'text',
    position INTEGER NOT NULL DEFAULT 0,
    parent_id TEXT REFERENCES channels(id),
    created_at INTEGER NOT NULL
);
```

Invites are stored in the `invites` table:

```sql
CREATE TABLE IF NOT EXISTS invites (
    code TEXT PRIMARY KEY,
    server_id TEXT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    created_by TEXT NOT NULL REFERENCES users(id),
    max_uses INTEGER,
    use_count INTEGER NOT NULL DEFAULT 0,
    expires_at INTEGER,
    created_at INTEGER NOT NULL
);
```

Server statistics are stored in the `server_stats` table:

```sql
CREATE TABLE IF NOT EXISTS server_stats (
    server_id TEXT PRIMARY KEY REFERENCES servers(id),
    total_messages INTEGER DEFAULT 0,
    total_members INTEGER DEFAULT 0,
    total_voice_minutes INTEGER DEFAULT 0,
    messages_today INTEGER DEFAULT 0,
    last_updated INTEGER
);
```

Roles are stored in the `roles` table:

```sql
CREATE TABLE IF NOT EXISTS roles (
    id TEXT PRIMARY KEY,
    server_id TEXT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color INTEGER,
    permissions INTEGER NOT NULL DEFAULT 0,
    position INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS role_assignments (
    user_id TEXT NOT NULL REFERENCES users(id),
    role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);
```

---

## Part 10: Troubleshooting Server Issues

| Problem | Solution |
|---------|----------|
| "Invalid invite code" | Check the code for typos. Codes are case-sensitive. Ensure the code has not expired or reached its usage limit. |
| "Server not found" after joining | This may indicate a database issue. Restart Libern and check the server list. |
| Cannot see channels | You may not have the required role permissions. Contact the server owner. |
| "Create server" button does nothing | Check the developer console (Ctrl+Shift+I) for errors. This may indicate a database write issue. |
| Server list is empty | Ensure you have created or joined a server. The list only shows servers you are a member of. |
| "Failed to create channel" | Channel names must be unique within a server and cannot contain special characters. Try a simpler name. |
| Invite code not working | Codes are 12 characters. Ensure you have not included extra spaces. If the code was created with `max_uses`, it may have expired. |
| "Cannot delete server" | Only the server owner can delete a server. Check that you are the owner (compare your user ID with `owner_id`). |
| Server icon not updating | After changing the avatar, try restarting Libern. The cache may need to refresh. |
| "Role not found" | The role may have been deleted. Check the roles list in Server Settings. |
| "Permission denied" unexpectedly | The permission system uses bitmasks. Ensure the role has the correct bits set. |

### Debugging Server Issues

You can inspect the database directly for debugging:

```bash
# Open the database with SQLite CLI
sqlite3 "$env:APPDATA\com.libern.app\data\libern.db"

# Check your servers
SELECT id, name, owner_id FROM servers;

# Check channels for a server
SELECT id, name, kind FROM channels WHERE server_id = '<server-id>';

# Check invites
SELECT code, server_id, use_count, max_uses, expires_at FROM invites;
```

---

## Next Steps

Now that you can navigate servers and channels, proceed to:

- **How-To Guide 03**: Sending Messages — Learn about text chat, markdown, file attachments, and emoji reactions
- **How-To Guide 04**: Using AI Commands — Master /ask, @Liber, and all slash commands

────────────────────────────────────────────────────────────────

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

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
