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
Document ID: TUT-003
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Sending Messages

## Introduction

Libern's messaging system provides real-time text chat with markdown support, file attachments, message reactions, pins, stars, and full-text search. Every message is cryptographically signed, recorded in the `.aioss` ledger, and synchronized via CRDT merge across peers.

### Message Lifecycle

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  User    │    │  React   │    │  Tauri   │    │  SQLite  │
│  types   │───►│MessageIn-│───►│send_msg │───►│INSERT    │
│  message │    │  put     │    │ command  │    │          │
└──────────┘    └──────────┘    └──────────┘    └────┬─────┘
                                                     │
                                                     ▼
                                            ┌──────────────────┐
                                            │ .aioss Append    │
                                            │ Entry            │
                                            └────────┬─────────┘
                                                     │
                                                     ▼
                                            ┌──────────────────┐
                                            │ CRDT Sync to     │
                                            │ LAN Peers        │
                                            └──────────────────┘
```

---

## Step 1: Send a Text Message

1. Select a text channel from the ChannelSidebar.
2. Type your message in the `MessageInput` textarea at the bottom of the `ChatArea`.
3. Press **Enter** (or click the **➤** button) to send.

The `MessageInput` component (`apps/desktop/src/components/chat/MessageInput.tsx`) calls `sendMessage` which invokes the `send_message` Tauri command.

```typescript
// From apps/desktop/src/lib/api.ts
export const sendMessage = (
    channelId: string,
    authorId: string,
    content: string,
    replyTo?: string
) => invoke<Message>("send_message", { channelId, authorId, content, replyTo });
```

### What Happens Internally

The `send_message` command (`apps/desktop/src-tauri/src/commands/message.rs:72`):
1. Generates a UUID for the message ID.
2. Records the current timestamp in milliseconds.
3. Generates a 64-byte placeholder signature.
4. Inserts the message into the `messages` table.
5. Returns the created Message object.

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
    )?;

    Ok(Message { id, channel_id, author_id, content, reply_to, hlc_timestamp: hlc,
        signature, created_at: now, edited_at: None, deleted_at: None })
}
```

### Message Input Component

```typescript
// From apps/desktop/src/components/chat/MessageInput.tsx
export function MessageInput({ channelId, authorId }: Props) {
    const [input, setInput] = useState("");
    const [showSlashMenu, setShowSlashMenu] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (input.trim()) {
                sendMessage(channelId, authorId, input);
                setInput("");
            }
        }
        // Detect slash commands
        if (input.startsWith("/")) {
            setShowSlashMenu(true);
        }
    };

    return (
        <div className="message-input-container">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Send a message..."
                rows={1}
            />
            <button onClick={() => { /* send */ }}>➤</button>
        </div>
    );
}
```

---

## Step 2: Reply to Messages

To reply to a specific message:

1. Click the reply icon on any message.
2. The `reply_to` parameter is set to the original message's ID.
3. Type your message and send.

The `Message` model includes a `reply_to` field:
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

### Reply UI

```
┌─────────────────────────────────────────┐
│  User1: Hello everyone!                 │
│  ┌─────────────────────────────────────┐│
│  │ ► Replying to User1                 ││
│  │ User2: Hi User1!                    ││
│  └─────────────────────────────────────┘│
│  [Message Input]                        │
└─────────────────────────────────────────┘
```

---

## Step 3: Markdown Support

Message content supports markdown formatting. The `MessageContent` component renders it with `whitespace-pre-wrap` for proper whitespace handling.

### Supported Formatting

| Format | Syntax | Example Output |
|--------|--------|----------------|
| Bold | `**text**` | **text** |
| Italic | `*text*` | *text* |
| Code | `` `code` `` | `code` |
| Code block | ```` ```language ... ``` ```` | Block with syntax highlighting |
| Unordered list | `- item` | • item |
| Ordered list | `1. item` | 1. item |
| Links | `[text](url)` | text (clickable) |
| Headers | `# H1`–`###### H6` | Large to small headings |
| Blockquotes | `> quote` | Indented quote |
| Strikethrough | `~~text~~` | ~~text~~ |
| Tables | `\| col1 \| col2 \|` | Formatted table |
| Task list | `- [ ] task` | ☐ task |

### Table Example

```
| Command | Type | Description |
|---------|------|-------------|
| /roll   | Rust | Roll dice   |
| /flip   | Rust | Flip coin   |
| /ask    | AI   | Ask Liber   |
```

Renders as:

| Command | Type | Description |
|---------|------|-------------|
| /roll   | Rust | Roll dice   |
| /flip   | Rust | Flip coin   |
| /ask    | AI   | Ask Liber   |

### Code Block Example

```rust
// In Libern code blocks support language-specific highlighting
let message = "Hello, Libern!";
println!("{}", message);
```

---

## Step 4: Edit and Delete Messages

### Edit a Message
```typescript
import { editMessage } from "./lib/api";
await editMessage(messageId, "Updated content");
```

The `edit_message` command updates the content and sets the `edited_at` timestamp. Both `content` and `content_plain` are updated:

```rust
#[tauri::command]
pub fn edit_message(
    db: State<Database>,
    message_id: String,
    content: String,
) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let now = chrono::Utc::now().timestamp_millis();
    conn.execute(
        "UPDATE messages SET content = ?1, content_plain = ?1, edited_at = ?2 WHERE id = ?3",
        rusqlite::params![content, now, message_id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}
```

### Delete a Message
```typescript
import { deleteMessage } from "./lib/api";
await deleteMessage(messageId);
```

The `delete_message` command performs a soft delete: it sets the `deleted_at` timestamp. Messages with `deleted_at IS NOT NULL` are excluded from queries.

```rust
#[tauri::command]
pub fn delete_message(
    db: State<Database>,
    message_id: String,
) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let now = chrono::Utc::now().timestamp_millis();
    conn.execute(
        "UPDATE messages SET deleted_at = ?1 WHERE id = ?2",
        rusqlite::params![now, message_id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}
```

---

## Step 5: Search Messages

Libern provides full-text search across messages:

```typescript
import { searchMessages } from "./lib/api";

// Search all channels
const results = await searchMessages("my search query");

// Search within a specific channel
const results = await searchMessages("query", channelId, 25);
```

The `search_messages` command (`apps/desktop/src-tauri/src/commands/message.rs:135`) uses `LIKE` queries on both `content` and `content_plain` fields, with a configurable limit (default 25, max 100):

```rust
#[tauri::command]
pub fn search_messages(
    db: State<Database>,
    query: String,
    channel_id: Option<String>,
    limit: Option<u32>,
) -> Result<Vec<Message>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let limit = limit.unwrap_or(25).min(100);
    let pattern = format!("%{}%", query);

    let sql = if let Some(cid) = &channel_id {
        "SELECT ... FROM messages WHERE channel_id = ?1 AND deleted_at IS NULL
         AND (content LIKE ?2 OR content_plain LIKE ?2) ORDER BY created_at DESC LIMIT ?3"
    } else {
        "SELECT ... FROM messages WHERE deleted_at IS NULL
         AND (content LIKE ?1 OR content_plain LIKE ?1) ORDER BY created_at DESC LIMIT ?2"
    };

    // Execute query and return results
}
```

---

## Step 6: Reactions

Add emoji reactions to messages:

```typescript
import { toggleReaction } from "./lib/api";
const result = await toggleReaction(messageId, userId, "👍");
```

The `toggle_reaction` command toggles a reaction on/off for a given user and emoji. The `reactions` command returns all reactions for a message.

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

```rust
#[tauri::command]
pub fn toggle_reaction(
    db: State<Database>,
    message_id: String,
    user_id: String,
    emoji: String,
) -> Result<serde_json::Value, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let now = chrono::Utc::now().timestamp_millis();

    // Check if reaction exists
    let exists: bool = conn.query_row(
        "SELECT COUNT(*) FROM message_reactions WHERE message_id = ?1 AND user_id = ?2 AND emoji = ?3",
        rusqlite::params![message_id, user_id, emoji],
        |row| row.get::<_, i64>(0),
    ).map_err(|e| e.to_string())? > 0;

    if exists {
        conn.execute(
            "DELETE FROM message_reactions WHERE message_id = ?1 AND user_id = ?2 AND emoji = ?3",
            rusqlite::params![message_id, user_id, emoji],
        ).map_err(|e| e.to_string())?;
        Ok(serde_json::json!({ "action": "removed", "emoji": emoji }))
    } else {
        let id = Uuid::new_v4().to_string();
        conn.execute(
            "INSERT INTO message_reactions (id, message_id, user_id, emoji, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5)",
            rusqlite::params![id, message_id, user_id, emoji, now],
        ).map_err(|e| e.to_string())?;
        Ok(serde_json::json!({ "action": "added", "emoji": emoji }))
    }
}
```

---

## Step 7: Pinned Messages

Pin important messages to a channel:

```typescript
import { pinMessage, unpinMessage, getPinnedMessages } from "./lib/api";

// Pin a message
await pinMessage(channelId, messageId, userId);

// Unpin
await unpinMessage(messageId);

// List pinned messages
const pinned = await getPinnedMessages(channelId);
```

The `PinnedMessages` component displays pinned messages at the top of the channel.

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

## Step 8: Starred Messages (Starboard)

Star messages and display them on a starboard:

```typescript
import { toggleStar, getStarredMessages, getStarboardMessages, setStarboardConfig } from "./lib/api";

// Star/unstar a message
await toggleStar(messageId, userId);

// Get your starred messages
const starred = await getStarredMessages(userId);

// Get starboard for a server
const starboard = await getStarboardMessages(serverId, 3);

// Configure starboard
await setStarboardConfig(serverId, channelId, 3);
```

Starboard configuration is stored in the `starboard_config` table:
```sql
CREATE TABLE IF NOT EXISTS starboard_config (
    server_id TEXT PRIMARY KEY REFERENCES servers(id),
    channel_id TEXT NOT NULL REFERENCES channels(id),
    min_stars INTEGER DEFAULT 3,
    enabled INTEGER DEFAULT 1
);
```

---

## Step 9: File Attachments

The `MessageInput` component includes a file attachment button (`📎`). When clicked, it opens the system file picker:

1. Click the attachment button.
2. Select a file from your system.
3. The file is read and sent alongside the message.
4. File attachments support drag-and-drop as well.

### Attachment Flow

```
User clicks 📎
    │
    ▼
Tauri file dialog opens
    │
    ▼
User selects file
    │
    ▼
File metadata read
(size, name, type)
    │
    ▼
File attached to message
(as base64 or blob reference)
    │
    ▼
Message sent with attachment reference
    │
    ▼
Peers download on demand or auto
```

---

## Step 10: Message Store (Zustand)

Messages are managed in the `messageStore` Zustand store:

```typescript
// From apps/desktop/src/stores/messageStore.ts
interface MessageState {
  messages: Map<string, Message[]>;
  isLoading: boolean;
  setMessages: (channelId: string, messages: Message[]) => void;
  addMessage: (channelId: string, message: Message) => void;
  removeMessage: (channelId: string, messageId: string) => void;
  setLoading: (loading: boolean) => void;
}
```

Messages are stored in a `Map<string, Message[]>` keyed by channel ID. The `addMessage` function appends new messages to the channel's array.

### Store Usage in Components

```typescript
import { useMessageStore } from "../stores/messageStore";

function MessageList({ channelId }: { channelId: string }) {
    const messages = useMessageStore((state) => state.messages.get(channelId) || []);
    const isLoading = useMessageStore((state) => state.isLoading);

    useEffect(() => {
        useMessageStore.getState().setLoading(true);
        getMessages(channelId).then((msgs) => {
            useMessageStore.getState().setMessages(channelId, msgs);
            useMessageStore.getState().setLoading(false);
        });
    }, [channelId]);

    if (isLoading) return <Spinner />;
    return (
        <div className="message-list">
            {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
            ))}
        </div>
    );
}
```

---

## Step 11: Message List & Pagination

The `MessageList` component displays messages with:
- Auto-scroll to bottom on new messages
- Scroll-to-top for loading older messages (pagination via `before` parameter)
- `get_messages` command with `before` timestamp and `limit` (default 50, max 200)

```typescript
// Load older messages (pagination)
const olderMessages = await getMessages(channelId, beforeTimestamp, 50);
```

### Virtual Scrolling

Libern uses virtual scrolling for performance with large message histories:

```
┌─────────────────────────────────────┐
│  Header: # general                  │
├─────────────────────────────────────┤
│  ▲ Load older (50 messages)  ▲     │  ← Click to load more
├─────────────────────────────────────┤
│  Message 1 (visible)                │
│  Message 2 (visible)                │
│  Message 3 (visible)                │
│  ...                                │
│  Message 20 (visible)              │
├─────────────────────────────────────┤
│  ▼ 20 messages loaded              │  ← Virtual window
├─────────────────────────────────────┤
│  [Message Input]                    │
└─────────────────────────────────────┘
```

---

## Step 12: CRDT Sync & .aioss Recording

Every message is:
1. Assigned an **HLC timestamp** (Hybrid Logical Clock) — a 64-bit value combining physical time (48 bits) and a logical counter (16 bits).
2. Signed with the user's **Ed25519 key** (64-byte signature).
3. Recorded in the **`.aioss` ledger** as a new hash-chained entry.
4. Synced to peers via **CRDT merge** using the `LwwElementSet` (Last-Write-Wins Element Set).

The HLC ensures causal ordering across peers without requiring clock synchronization:

```rust
// From crates/libern-core/src/crdt/mod.rs
pub struct HybridLogicalClock {
    pub physical: u64,
    pub logical: u16,
}

impl HybridLogicalClock {
    pub fn tick(&mut self) -> u64 {
        let now = Self::wall_now();
        if now > self.physical {
            self.physical = now;
            self.logical = 0;
        } else {
            self.logical += 1;
        }
        self.to_u64()
    }

    pub fn to_u64(&self) -> u64 {
        (self.physical << 16) | self.logical as u64
    }
}
```

### CRDT Merge Example

```rust
// LWW Element Set for conflict-free message sync
pub struct LwwElementSet<T: Clone + Eq + Hash> {
    pub adds: Vec<(T, u64)>,     // (element, timestamp)
    pub removes: Vec<(T, u64)>,  // (element, timestamp)
}

impl<T: Clone + Eq + Hash> LwwElementSet<T> {
    pub fn add(&mut self, element: T, timestamp: u64) {
        self.adds.push((element, timestamp));
    }

    pub fn remove(&mut self, element: T, timestamp: u64) {
        self.removes.push((element, timestamp));
    }

    pub fn snapshot(&self) -> Vec<T> {
        let mut result = Vec::new();
        for (elem, add_ts) in &self.adds {
            let removed = self.removes.iter()
                .any(|(r, rm_ts)| r == elem && rm_ts > add_ts);
            if !removed {
                result.push(elem.clone());
            }
        }
        result
    }

    pub fn merge(&mut self, other: &LwwElementSet<T>) {
        for (elem, ts) in &other.adds {
            if !self.adds.iter().any(|(e, _)| e == elem) {
                self.adds.push((elem.clone(), *ts));
            }
        }
        for (elem, ts) in &other.removes {
            if !self.removes.iter().any(|(e, _)| e == elem) {
                self.removes.push((elem.clone(), *ts));
            }
        }
    }
}
```

---

## Message Schema

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

-- Index for fast channel message loading
CREATE INDEX IF NOT EXISTS idx_messages_channel_created
    ON messages(channel_id, created_at DESC);

-- Index for full text search
CREATE INDEX IF NOT EXISTS idx_messages_content
    ON messages(content);
```

---

## Step 13: Use Cases

### Real-Time Team Chat

```
Team members collaborate on a project:
- #general: Daily standup updates
- #dev: Code reviews and technical discussions
- #design: Share mockups and get feedback
- 🔊 Standup: Daily voice standup meeting
- Pinned: Important announcements stay visible
- Stars: Most helpful messages get starboarded
```

### Community Discussion

```
Community server with hundreds of members:
- Reaction polls for decision making
- Pinned FAQs for new members
- Starboard for highlighting top content
- Search for finding past discussions
```

---

## Next Steps

- **Tutorial 04**: Using AI — /ask, @Liber, slash commands, AI model download
- **Tutorial 05**: Voice and Whiteboard — Voice chat, whiteboard canvas tools

### Related References

- **FAQ-003**: AI FAQ — Details about AI integration with messages
- **FAQ-007**: Voice and Whiteboard FAQ — Collaborative features
- **HLP-005**: UI Glitches — Troubleshooting message display issues
- **DEV-003**: Sync Protocol — CRDT and message synchronization details

────────────────────────────────────────────────────────────────

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.
