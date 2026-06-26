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
Document ID: CMT-003
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Sending Messages

## Introduction

Libern's messaging system is the core of the platform. Every message you send is cryptographically signed with your Ed25519 key, recorded in the `.aioss` tamper-evident ledger, and synchronized with peers via CRDT merge. This guide covers everything from basic text chat to advanced features like markdown formatting, file attachments, and emoji reactions.

Messages in Libern are stored in a local SQLite database and optionally synced to peers over LAN. There are no central servers, no message length limits (other than database constraints), and no content filtering by default.

By the end of this guide, you will be able to:
- Send and receive text messages in real-time
- Format messages using markdown syntax
- Attach files, images, and embeds
- Reply to, edit, and delete messages
- Use emoji reactions, pins, and stars
- Search messages across channels
- Understand message signing, CRDT sync, and .aioss ledger recording

---

## Prerequisites

- You have completed **How-To Guide 01** (Creating Your Account) and **How-To Guide 02** (Joining a Server)
- You have at least one server and one text channel selected

---

## Part 1: Sending a Text Message

### Basic Message Sending

1. Select a text channel from the ChannelSidebar (channels with `#` icon).
2. Locate the **MessageInput** area at the bottom of the ChatArea.
3. Type your message in the text input field.
4. Press **Enter** (or click the **➤** send button) to send your message.

### Using the Message Input

The `MessageInput` component (`apps/desktop/src/components/chat/MessageInput.tsx`) provides:
- A multi-line textarea with auto-resize
- Markdown toolbar buttons (bold, italic, code, link, list)
- File attachment button (📎)
- Emoji picker button (😊)
- Send button (➤)
- Slash command auto-complete popup

```
┌──────────────────────────────────────────────┐
│  [B] [I] [Code] [Link] [List] [📎] [😊]     │
├──────────────────────────────────────────────┤
│                                              │
│  Type a message... (textarea auto-resize)     │
│                                              │
├──────────────────────────────────────┬───────┤
│  /ask /roll /flip /joke /8ball ...   │  [➤]  │
└──────────────────────────────────────┴───────┘
```

### What Happens When You Send

When you send a message, the `send_message` Tauri command is invoked:

```rust
// From apps/desktop/src-tauri/src/commands/message.rs
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
    let signature = vec![0u8; 64];

    conn.execute(
        "INSERT INTO messages (id, channel_id, author_id, content, content_plain, reply_to, hlc_timestamp, signature, created_at)
         VALUES (?1, ?2, ?3, ?4, ?4, ?5, ?6, ?7, ?6)",
        rusqlite::params![id, channel_id, author_id, content, reply_to, hlc, signature],
    )
    .map_err(|e| e.to_string())?;

    Ok(Message {
        id,
        channel_id,
        author_id,
        content,
        reply_to,
        hlc_timestamp: hlc,
        signature,
        created_at: now,
        edited_at: None,
        deleted_at: None,
    })
}
```

The process involves:
1. A UUID v4 is generated as the message ID.
2. The current timestamp is recorded in milliseconds (serves as the HLC timestamp).
3. A 64-byte Ed25519 signature placeholder is generated (full signing is a future enhancement).
4. The message is inserted into the `messages` table.
5. The message object is returned to the frontend, which appends it to the message list.
6. The message is also recorded in the `.aioss` ledger (tamper-evident hash chain).
7. The message is broadcast to connected peers via CRDT sync.

### Frontend Invocation

```typescript
// From apps/desktop/src/lib/api.ts
export const sendMessage = (
    channelId: string,
    authorId: string,
    content: string,
    replyTo?: string,
) => invoke<Message>("send_message", { channelId, authorId, content, replyTo });
```

### Message Schema

```sql
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
```

---

## Part 2: Markdown Formatting

Libern supports Markdown formatting for rich message content.

### Basic Formatting

| Style | Syntax | Example |
|-------|--------|---------|
| **Bold** | `**text**` | **bold text** |
| *Italic* | `*text*` | *italic text* |
| ~~Strikethrough~~ | `~~text~~` | ~~strikethrough~~ |
| `Inline code` | `` `code` `` | `inline code` |
| Block code | ` ```lang ... ``` ` | Multi-line code block |
| Link | `[text](url)` | [Link text](https://example.com) |
| Image | `![alt](url)` | Embedded image |

### Headers

```
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

### Lists

Unordered:
```
- Item 1
- Item 2
  - Nested item
- Item 3
```

Ordered:
```
1. First item
2. Second item
3. Third item
```

### Blockquotes

```
> This is a blockquote.
> It can span multiple lines.
>
> > Nested blockquotes are supported.
```

### Tables

```
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell A1  | Cell B1  | Cell C1  |
| Cell A2  | Cell B2  | Cell C2  |
```

### Code Blocks with Syntax Highlighting

````
```rust
fn main() {
    println!("Hello, Libern!");
}
```
````

Supported languages for syntax highlighting include: `rust`, `typescript`, `javascript`, `python`, `html`, `css`, `json`, `sql`, `bash`, `yaml`, `markdown`, and many more.

### Mentions

- **User mention**: `@username` — Notifies the user and highlights the mention.
- **Liber AI mention**: `@Liber` — Triggers an AI response.
- **Channel mention**: `#channel-name` — Creates a clickable channel link.
- **Role mention**: `@role` — Mentions all users with that role (if you have permission).

### Emoji

Inline emoji can be typed using:
- Unicode emoji: `😊`, `👍`, `🎉`
- Custom emoji shortcodes: `:thumbsup:`, `:wave:`, `:liber:` (if custom emoji are configured)

### Advanced Markdown Example

```
# Meeting Notes — June 19

## Attendees
- @alice, @bob, @carol

## Agenda
1. Review Q2 metrics
2. Plan Q3 roadmap
3. **Action items**

### Q2 Metrics
| Metric | Value | Change |
|--------|-------|--------|
| Users  | 1,024 | +12%   |
| Messages | 45K | +8%  |

> *"Great progress this quarter!"* — @alice

See the full report at [docs/q2-summary](./q2-summary.md)

`git log --oneline -5`

```rust
let x = vec![1, 2, 3];
println!("Sum: {}", x.iter().sum::<i32>());
```
```

---

## Part 3: Reply to Messages

Replying to a message adds context by linking your response to the original message.

1. Hover over any message to reveal action buttons.
2. Click the **Reply** button (↩️ or "💬").
3. The MessageInput shows a reply indicator with the original author's name and a preview of their message.
4. Type your response and send.
5. The reply appears in the chat as a connected thread.

The `reply_to` field in the message stores the original message's ID:
```typescript
interface Message {
    id: string;
    channel_id: string;
    author_id: string;
    content: string;
    reply_to: string | null;
    hlc_timestamp: number;
    signature: number[];
    created_at: number;
    edited_at: number | null;
    deleted_at: number | null;
}
```

### Reply Flow

```
┌─────────────────────────────────────┐
│ @Alice: How does CRDT merge work?   │
│                           [↩️] [⭐] │
├─────────────────────────────────────┤
│ Replying to @Alice                  │
│ ┌─────────────────────────────┐     │
│ │ It uses LWW Element Sets... │➤    │
│ └─────────────────────────────┘     │
└─────────────────────────────────────┘
```

---

## Part 4: Edit and Delete Messages

### Edit a Message

1. Hover over your own message.
2. Click the **Edit** button (✏️) or press the `Up` arrow key when the message is selected.
3. The message content becomes editable in-place.
4. Modify the text and press **Enter** to save, or **Escape** to cancel.
5. The message displays an "(edited)" indicator.

```typescript
import { editMessage } from "./lib/api";
await editMessage(messageId, "Updated content");
```

The `edit_message` command updates the `content` and `content_plain` fields, and sets the `edited_at` timestamp:

```rust
// From apps/desktop/src-tauri/src/commands/message.rs
#[tauri::command]
pub fn edit_message(
    db: State<Database>,
    id: String,
    content: String,
) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let now = chrono::Utc::now().timestamp_millis();
    conn.execute(
        "UPDATE messages SET content = ?1, content_plain = ?1, edited_at = ?2 WHERE id = ?3",
        rusqlite::params![content, now, id],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}
```

### Delete a Message

1. Hover over your own message.
2. Click the **Delete** button (🗑️).
3. Confirm the deletion.

```typescript
import { deleteMessage } from "./lib/api";
await deleteMessage(messageId);
```

The `delete_message` command performs a **soft delete** — it sets the `deleted_at` timestamp rather than removing the row:

```rust
#[tauri::command]
pub fn delete_message(db: State<Database>, id: String) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let now = chrono::Utc::now().timestamp_millis();
    conn.execute(
        "UPDATE messages SET deleted_at = ?1 WHERE id = ?2",
        rusqlite::params![now, id],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}
```

Messages with `deleted_at IS NOT NULL` are filtered out from queries. The `.aioss` ledger retains the original entry for audit purposes.

### Delete a Message (Moderator)

If you have the `MANAGE_MESSAGES` permission, you can delete other users' messages:
1. Hover over any message.
2. Click the **Delete** button (🗑️).
3. Confirm.

---

## Part 5: File Attachments

### Attaching Files

1. Click the **📎** attachment button in the MessageInput.
2. Select one or more files from your system file picker.
3. The files appear as attachment previews above the input.
4. Add text and send.

Alternatively, drag and drop files directly onto the MessageInput area.

### Supported File Types

| Type | Extensions | Preview |
|------|------------|---------|
| Images | `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg` | Inline thumbnail |
| Videos | `.mp4`, `.webm`, `.mov` | Video player |
| Audio | `.mp3`, `.wav`, `.ogg`, `.flac` | Audio player |
| Documents | `.pdf`, `.txt`, `.md`, `.csv`, `.json` | Icon with filename |
| Archives | `.zip`, `.tar.gz`, `.7z` | Icon with filename |
| Code | `.rs`, `.ts`, `.js`, `.py`, `.html`, `.css` | Syntax highlighted preview |

### File Storage

Attachments are stored locally in the app data directory:
```
{app_data}/attachments/{message_id}/{filename}
```

Each attachment is hashed with SHA-256 for integrity verification:
```sql
CREATE TABLE IF NOT EXISTS attachments (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    sha256_hash TEXT NOT NULL,
    local_path TEXT,
    asset_url TEXT,
    width INTEGER,
    height INTEGER,
    created_at INTEGER NOT NULL
);
```

### File Size Limits

There are no hard file size limits in Libern. Since all data is stored locally, the practical limit is your available disk space. However, large files will consume more space and take longer to sync with peers.

---

## Part 6: Emoji Reactions

### Adding Reactions

1. Hover over any message.
2. Click the **Add Reaction** button (😊).
3. Select an emoji from the picker, or start typing to search.
4. The emoji appears below the message with a count.

### Toggling Reactions

Clicking an existing reaction adds or removes your reaction. The `toggle_reaction` command handles this:

```typescript
import { toggleReaction } from "./lib/api";
const result = await toggleReaction(messageId, userId, "👍");
```

The `message_reactions` table uses a unique constraint to prevent duplicate reactions:
```sql
CREATE TABLE IF NOT EXISTS message_reactions (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id),
    emoji TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    UNIQUE(message_id, user_id, emoji)
);
```

### Viewing Reactions

Reactions are displayed below the message content as emoji badges showing the count and a tooltip of who reacted.

```
┌─────────────────────────────────────┐
│ @Alice: Great idea!                 │
│                                     │
│ 👍 3  🎉 2  ❤️ 1                   │
│ (hover to see who reacted)          │
└─────────────────────────────────────┘
```

---

## Part 7: Pinned Messages

Pinning a message makes it appear at the top of the channel for quick reference.

### Pin a Message

1. Hover over a message.
2. Click the **Pin** button (📌).
3. The message appears in the pinned messages section at the top of the channel.

```typescript
import { pinMessage, unpinMessage, getPinnedMessages } from "./lib/api";

await pinMessage(channelId, messageId, userId);
```

### Unpin a Message

1. Click the **Unpin** button on the pinned message banner.
2. Or use the API: `await unpinMessage(messageId);`

### Pinned Messages Display

The `PinnedMessages` component renders at the top of each channel, showing:
- Pinned message preview (truncated)
- Author name and avatar
- Pin count
- Jump to message button

### Schema

```sql
CREATE TABLE IF NOT EXISTS pinned_messages (
    id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    message_id TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    pinned_by TEXT NOT NULL REFERENCES users(id),
    created_at INTEGER NOT NULL,
    UNIQUE(channel_id, message_id)
);
```

---

## Part 8: Starred Messages (Starboard)

Starring a message adds it to your personal star list. The Starboard collects highly-starred messages for a server.

### Star a Message

1. Hover over a message.
2. Click the **Star** button (⭐).
3. The star is toggled on/off.

```typescript
import { toggleStar, getStarredMessages, getStarboardMessages, setStarboardConfig } from "./lib/api";

await toggleStar(messageId, userId);
```

### Starboard

The Starboard is a configurable channel that displays messages with a minimum number of stars:

```typescript
await setStarboardConfig(serverId, channelId, 3); // 3 minimum stars
```

The `starboard_config` table:
```sql
CREATE TABLE IF NOT EXISTS starboard_config (
    server_id TEXT PRIMARY KEY REFERENCES servers(id),
    channel_id TEXT NOT NULL REFERENCES channels(id),
    min_stars INTEGER DEFAULT 3,
    enabled INTEGER DEFAULT 1
);
```

---

## Part 9: Searching Messages

Libern provides full-text search across your messages.

### Search from the Interface

1. Click the **Search** button (🔍) in the channel header or press `Ctrl+F`.
2. Type your search query.
3. Results appear in the right panel, filtered by the current channel by default.
4. Click a result to jump to that message.

### Search API

```typescript
import { searchMessages } from "./lib/api";

// Search all channels
const results = await searchMessages("search query");

// Search within a specific channel
const results = await searchMessages("query", channelId, 25);
```

The `search_messages` command uses `LIKE` queries on both `content` and `content_plain` fields:

```rust
// From apps/desktop/src-tauri/src/commands/message.rs
#[tauri::command]
pub fn search_messages(
    db: State<Database>,
    query: String,
    channel_id: Option<String>,
    limit: Option<u32>,
) -> Result<Vec<Message>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let limit = limit.unwrap_or(25).min(100);
    let mut sql = String::from(
        "SELECT m.id, m.channel_id, m.author_id, m.content, m.reply_to, m.hlc_timestamp,
                m.signature, m.created_at, m.edited_at, m.deleted_at
         FROM messages m WHERE m.deleted_at IS NULL"
    );
    let mut params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();

    if let Some(ref ch) = channel_id {
        sql.push_str(" AND m.channel_id = ?");
        params.push(Box::new(ch.clone()));
    }

    sql.push_str(" AND (m.content LIKE ? OR m.content_plain LIKE ?)");
    let pattern = format!("%{}%", query);
    params.push(Box::new(pattern.clone()));
    params.push(Box::new(pattern));

    sql.push_str(" ORDER BY m.created_at DESC LIMIT ?");
    params.push(Box::new(limit));

    let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;
    let param_refs: Vec<&dyn rusqlite::types::ToSql> =
        params.iter().map(|p| p.as_ref()).collect();

    let messages = stmt
        .query_map(param_refs.as_slice(), |row| {
            Ok(Message {
                id: row.get(0)?,
                channel_id: row.get(1)?,
                author_id: row.get(2)?,
                content: row.get(3)?,
                reply_to: row.get(4)?,
                hlc_timestamp: row.get(5)?,
                signature: row.get(6)?,
                created_at: row.get(7)?,
                edited_at: row.get(8)?,
                deleted_at: row.get(9)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(messages)
}
```

### Search Tips

- Search is case-insensitive.
- Results are ordered by recency (newest first).
- Maximum 100 results per query.
- Each result shows a preview of the message content with the search term highlighted.

---

## Part 10: Message Pagination and Scrolling

### Loading Older Messages

The MessageList component automatically loads older messages when you scroll to the top of the chat:

```typescript
import { getMessages } from "./lib/api";

// Load older messages before a timestamp
const olderMessages = await getMessages(channelId, beforeTimestamp, 50);
```

Parameters:
- `channel_id` — The channel to load messages from
- `before` — HLC timestamp to load messages before (for pagination)
- `limit` — Number of messages to load (default 50, max 200)

### Auto-Scroll

- New messages automatically scroll the view to the bottom.
- If you have scrolled up to read history, a **"New Messages"** button appears at the bottom.
- Click it to jump to the latest messages.

### Message Retrieval Internals

```rust
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

    let messages = if let Some(before_ts) = before {
        // ... with before timestamp
    } else {
        stmt.query_map(rusqlite::params![channel_id, limit], |row| { /* ... */ })
    };

    Ok(messages.into_iter().rev().collect())
}
```

---

## Part 11: Message CRDT Sync

Every message you send participates in the CRDT (Conflict-Free Replicated Data Type) synchronization system.

### Hybrid Logical Clock (HLC)

Each message is assigned an HLC timestamp — a 64-bit value combining:
- **Physical time** (48 bits): Wall clock in milliseconds
- **Logical counter** (16 bits): Incremented when multiple events occur at the same physical time

```rust
// From crates/libern-core/src/crdt/hlc.rs
pub struct HybridLogicalClock {
    pub physical: u64,
    pub logical: u16,
}

impl HybridLogicalClock {
    pub fn new(now: u64) -> Self {
        HybridLogicalClock { physical: now, logical: 0 }
    }

    pub fn now(&mut self) -> u64 {
        let physical = std::cmp::max(self.physical, get_current_time());
        if physical == self.physical {
            self.logical += 1;
        } else {
            self.logical = 0;
        }
        self.physical = physical;
        (self.physical << 16) | self.logical as u64
    }
}
```

The HLC ensures causal ordering across peers without requiring clock synchronization.

### LWW Element Set

Messages are merged using a Last-Write-Wins Element Set:
- Elements tracked in two sets: `adds` and `removes`
- On merge, the higher timestamp wins
- Supports `add`, `remove`, `snapshot`, and `merge` operations

```rust
pub struct LwwElementSet<T: Clone + Eq + Hash> {
    pub adds: Vec<(T, u64)>,
    pub removes: Vec<(T, u64)>,
}
```

### .aioss Ledger Recording

Every message is also recorded in the `.aioss` ledger as a hash-chained entry. The ledger provides:
- Tamper-evident audit trail
- Cryptographic verification of message history
- Compliance and regulatory support

---

## Part 12: Message Privacy and Security

### End-to-End Properties

While Libern does not currently implement E2EE (end-to-end encryption) for message content, all messages are:
- **Signed** with your Ed25519 key (authenticity and non-repudiation)
- **Hash-chained** in the `.aioss` ledger (tamper evidence)
- **Stored locally** on your machine only (not on any cloud server)

### Security Considerations

- Messages are visible to anyone with access to your local database.
- P2P sync sends messages in plaintext over the local network (future E2EE planned).
- Your Ed25519 private key is stored encrypted on disk.
- If you delete a message, the `.aioss` ledger retains the original entry (soft delete for audit).

### Data Flow Diagram

```
┌─────────┐    ┌───────────┐    ┌──────────┐
│ You type │───►│ Rust      │───►│ Local    │
│ message  │    │ send_msg  │    │ SQLite   │
└─────────┘    └───────────┘    └──────────┘
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
    ┌─────────┐ ┌─────────┐ ┌─────────┐
    │ .aioss  │ │ CRDT    │ │ UI      │
    │ Ledger  │ │ Sync    │ │ Display │
    └─────────┘ └─────────┘ └─────────┘
```

---

## Part 13: Troubleshooting Messages

| Problem | Solution |
|---------|----------|
| Message not appearing | Check that you have selected a valid channel. The message should appear immediately in the local database. |
| "Failed to send message" | Check your permission (you need `SEND_MESSAGES`). Also check disk space and database integrity. |
| Attachments not uploading | File may be too large or the path may be invalid. Check disk space in the app data directory. |
| Search returns no results | Ensure messages exist in the channel. Search is local-only and indexes `content` and `content_plain` fields. |
| Edited message not showing changes | The `edit_message` command may have failed. Try again with different content. |
| Reactions not appearing | Check that the reaction toggle succeeded. The `message_reactions` table has a unique constraint per (user, message, emoji). |
| Pinned messages not showing | Check that the pin was created successfully. Only messages in the current channel are shown. |
| Message order is wrong | HLC timestamps may be out of sync. Restart Libern to reset the clock. |
| "Cannot edit message" | You can only edit your own messages. Moderators with `MANAGE_MESSAGES` can delete any message. |
| Markdown not rendering | Check that the markdown syntax is correct. Some edge cases may not render properly. |
| "Channel not found" | The channel may have been deleted. Check that your server still has the channel. |

---

## Next Steps

Now that you can send and manage messages, proceed to:

- **How-To Guide 04**: Using AI Commands — Master /ask, @Liber, /8ball, /joke, /trivia, and more
- **How-To Guide 05**: Voice and Whiteboard — Join voice channels, mute/deafen, use the collaborative whiteboard

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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
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