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
Category: features | ID: LIB-FEAT-009

────────────────────────────────────────────────────────────────

# In-App Marketplace — Publish, Discover, Like, and Share User-Created Items

**What we bring to the market:** A decentralized, offline-first in-app
marketplace where users publish, share, like, and discover AI models,
images, audio clips, text assets, and system configurations — with all
metadata stored locally and synced via CRDT.

---

## 1. The Problem

```
┌──────────────────────────────────────────────────────────────────────┐
│                THE CONTENT SHARING PROBLEM                              │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Existing platforms force centralized content sharing:               │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │
│  │  Discord     │  │  Slack       │  │  Teams       │                │
│  │              │  │              │  │              │                │
│  │  ❌ File     │  │  ❌ 1GB      │  │  ❌ SharePoint│                │
│  │     size     │  │     storage  │  │     dependency│                │
│  │     limits   │  │     cap      │  │  ❌ Cloud     │                │
│  │  ❌ Messages │  │  ❌ No       │  │     sync only │                │
│  │     expire   │  │     browse   │  │              │                │
│  └──────────────┘  └──────────────┘  └──────────────┘                │
│                                                                       │
│  Libern: P2P marketplace — no servers, no size limits, no expiry.    │
│           Items stored locally, shared via CRDT-synced metadata.     │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

### File Size Constraints Comparison

| Platform | Max File Size | Notes |
|----------|-------------|-------|
| Libern | Unlimited (local SSD) | Constrained only by disk space |
| Discord | 25MB (100MB Nitro) | Compresses images, expires links |
| Slack | 1GB total (free) | Overages require paid plan |
| Teams | 250GB (SharePoint) | SharePoint licensing complexity |
| Email | 25MB typical | Impractical for large assets |

---

## 2. Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                    MARKETPLACE ARCHITECTURE                             │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐      │
│  │                    React Frontend                            │      │
│  │                                                              │      │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │      │
│  │  │ Browse Grid │  │ Search/     │  │ Publish Form        │  │      │
│  │  │ (infinite   │  │ Filter      │  │ (type, name, desc,  │  │      │
│  │  │  scroll)    │  │ (type, tag) │  │  file upload, tags) │  │      │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘  │      │
│  │                                                              │      │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │      │
│  │  │ Detail View │  │ Like Button │  │ My Items Panel      │  │      │
│  │  │ (metadata,  │  │ (toggle,    │  │ (user's published   │  │      │
│  │  │  download)  │  │  count)     │  │  content)           │  │      │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘  │      │
│  └────────────────────────────────────────────────────────────┘      │
│                           │ invoke()                                 │
│  ┌────────────────────────┴───────────────┐                          │
│  │            Rust Backend (Tauri)         │                          │
│  │                                         │                          │
│  │  get_marketplace_items()               │                          │
│  │  publish_marketplace_item()            │                          │
│  │  delete_marketplace_item()            │                          │
│  │  like_marketplace_item()              │                          │
│  │  unlike_marketplace_item()            │                          │
│  │  get_my_items()                       │                          │
│  └────────────────────────┬───────────────┘                          │
│                           │                                          │
│  ┌────────────────────────┴───────────────┐                          │
│  │            SQLite Database              │                          │
│  │                                         │                          │
│  │  marketplace_items: items + BLOB data  │                          │
│  │  marketplace_likes: user-item likes    │                          │
│  └────────────────────────────────────────┘                          │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 3. Code: Browse Marketplace Items

Real code from `apps/desktop/src-tauri/src/commands/marketplace.rs`:

```rust
// apps/desktop/src-tauri/src/commands/marketplace.rs
use libern_core::db::Database;
use tauri::State;

#[tauri::command]
pub fn get_marketplace_items(
    db: State<Database>,
    server_id: Option<String>,
    type_filter: Option<String>,
    query: Option<String>,
    sort: Option<String>,
) -> Result<Vec<serde_json::Value>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let mut sql = String::from(
        "SELECT id, item_type, name, description, author_id, server_id,
                visibility, file_size, mime_type, tags, like_count, use_count,
                hlc_timestamp, created_at
         FROM marketplace_items
         WHERE visibility IN ('public', 'server')"
    );
    let mut params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();

    if let Some(ref sid) = server_id {
        sql.push_str(" AND (server_id = ? OR visibility = 'public')");
        params.push(Box::new(sid.clone()));
    }
    if let Some(ref tf) = type_filter {
        sql.push_str(" AND item_type = ?");
        params.push(Box::new(tf.clone()));
    }
    if let Some(ref q) = query {
        sql.push_str(" AND (name LIKE ? OR description LIKE ?)");
        let pat = format!("%{}%", q);
        params.push(Box::new(pat.clone()));
        params.push(Box::new(pat));
    }

    sql.push_str(" ORDER BY created_at DESC LIMIT 50");

    let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;
    let param_refs: Vec<&dyn rusqlite::types::ToSql>
        = params.iter().map(|p| p.as_ref()).collect();

    let items = stmt
        .query_map(param_refs.as_slice(), |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "item_type": row.get::<_, String>(1)?,
                "name": row.get::<_, String>(2)?,
                "description": row.get::<_, Option<String>>(3)?,
                "author_id": row.get::<_, String>(4)?,
                "server_id": row.get::<_, Option<String>>(5)?,
                "visibility": row.get::<_, String>(6)?,
                "file_size": row.get::<_, i32>(7)?,
                "mime_type": row.get::<_, Option<String>>(8)?,
                "tags": row.get::<_, Option<String>>(9)?,
                "like_count": row.get::<_, i32>(10)?,
                "use_count": row.get::<_, i32>(11)?,
                "hlc_timestamp": row.get::<_, i64>(12)?,
                "created_at": row.get::<_, i64>(13)?,
            }))
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(items)
}
```

---

## 4. Code: Publish an Item

```rust
// apps/desktop/src-tauri/src/commands/marketplace.rs
use uuid::Uuid;

#[tauri::command]
pub fn publish_marketplace_item(
    db: State<Database>,
    item_type: String,
    name: String,
    description: Option<String>,
    author_id: String,
    server_id: Option<String>,
    visibility: Option<String>,
    data: Vec<u8>,
    tags: Option<String>,
) -> Result<MarketplaceItem, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp_millis();
    let vis = visibility.unwrap_or_else(|| "public".into());

    let mime = match item_type.as_str() {
        "model" => Some("application/octet-stream".into()),
        "image" => Some("image/png".into()),
        "audio" => Some("audio/ogg".into()),
        "text" => Some("text/markdown".into()),
        _ => None,
    };

    conn.execute(
        "INSERT INTO marketplace_items
         (id, item_type, name, description, author_id, server_id,
          visibility, data, file_size, mime_type, tags, hlc_timestamp, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?12)",
        rusqlite::params![
            id, item_type, name, description, author_id, server_id,
            vis, data, data.len() as i32, mime, tags, now
        ],
    ).map_err(|e| e.to_string())?;

    Ok(MarketplaceItem {
        id, item_type, name, description, author_id, server_id,
        visibility: vis, data, thumbnail: None,
        file_size: data.len() as i32, mime_type: mime, tags,
        like_count: 0, use_count: 0, hlc_timestamp: now, created_at: now,
    })
}
```

---

## 5. Code: Like / Unlike System

```rust
// apps/desktop/src-tauri/src/commands/marketplace.rs
#[tauri::command]
pub fn like_marketplace_item(
    db: State<Database>, item_id: String, user_id: String,
) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let now = chrono::Utc::now().timestamp_millis();
    conn.execute(
        "INSERT OR IGNORE INTO marketplace_likes (user_id, item_id, created_at)
         VALUES (?1, ?2, ?3)",
        rusqlite::params![user_id, item_id, now],
    ).map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE marketplace_items SET like_count =
         (SELECT COUNT(*) FROM marketplace_likes WHERE item_id = ?1) WHERE id = ?1",
        rusqlite::params![item_id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn unlike_marketplace_item(
    db: State<Database>, item_id: String, user_id: String,
) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "DELETE FROM marketplace_likes WHERE user_id = ?1 AND item_id = ?2",
        rusqlite::params![user_id, item_id],
    ).map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE marketplace_items SET like_count =
         (SELECT COUNT(*) FROM marketplace_likes WHERE item_id = ?1) WHERE id = ?1",
        rusqlite::params![item_id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}
```

---

## 6. Code: My Items (User's Published Content)

```rust
// apps/desktop/src-tauri/src/commands/marketplace.rs
#[tauri::command]
pub fn get_my_items(
    db: State<Database>,
    author_id: String,
    item_type: Option<String>,
) -> Result<Vec<serde_json::Value>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let mut sql = String::from(
        "SELECT id, item_type, name, description, author_id, server_id,
                visibility, file_size, mime_type, tags, like_count, use_count,
                hlc_timestamp, created_at
         FROM marketplace_items WHERE author_id = ?1"
    );
    if let Some(ref t) = item_type {
        sql.push_str(" AND item_type = ?2");
    }
    sql.push_str(" ORDER BY created_at DESC");

    let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;

    let items = if let Some(ref t) = item_type {
        stmt.query_map(rusqlite::params![author_id, t], |row| {
            Ok(serde_json::json!({ "id": row.get::<_, String>(0)?, ... }))
        }).map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())?
    } else {
        stmt.query_map(rusqlite::params![author_id], |row| {
            Ok(serde_json::json!({ "id": row.get::<_, String>(0)?, ... }))
        }).map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())?
    };

    Ok(items)
}
```

---

## 7. Item Types and MIME Mapping

| item_type | MIME Type | Use Case | Typical File Size |
|-----------|-----------|----------|------------------|
| `model` | `application/octet-stream` | GGUF AI models (Qwen, Llama) | 500MB–8GB |
| `image` | `image/png` | Pinned images, whiteboard assets | 1KB–50MB |
| `audio` | `audio/ogg` | Voice clips, sound effects | 10KB–10MB |
| `text` | `text/markdown` | Templates, prompts, documentation | 1KB–1MB |
| `config` | `application/json` | Server configs, role templates | 1KB–100KB |

---

## 8. Visibility Model

| Visibility | Visible To | Use Case |
|------------|-----------|----------|
| `public` | All peers on LAN | Shared AI models, templates |
| `server` | Members of specific server | Server-specific assets |
| `private` | Only the author | Drafts, personal assets |

### Visibility SQL Filtering

```sql
-- Public items: visible to all
WHERE visibility = 'public'

-- Server items: visible within server
WHERE visibility = 'server' AND server_id = ?

-- Private items: visible only to author
WHERE visibility = 'private' AND author_id = ?
```

---

## 9. Code: Database Schema

Real schema from `crates/libern-core/src/db/schema.rs`:

```sql
-- crates/libern-core/src/db/schema.rs
CREATE TABLE IF NOT EXISTS marketplace_items (
    id TEXT PRIMARY KEY,
    item_type TEXT NOT NULL,          -- "model", "image", "audio", "text", "config"
    name TEXT NOT NULL,
    description TEXT,
    author_id TEXT NOT NULL REFERENCES users(id),
    server_id TEXT,
    visibility TEXT NOT NULL DEFAULT 'public',
    data BLOB NOT NULL,
    thumbnail BLOB,
    file_size INTEGER NOT NULL DEFAULT 0,
    mime_type TEXT,
    tags TEXT,                        -- Comma-separated tags
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

### MarketplaceItem Model

```rust
// crates/libern-core/src/db/models.rs
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

## 10. Marketplace Frontend (TypeScript)

```tsx
// apps/desktop/src/components/marketplace/MarketplacePage.tsx
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

interface MarketplaceItem {
  id: string;
  item_type: string;
  name: string;
  description?: string;
  author_id: string;
  file_size: number;
  mime_type?: string;
  tags?: string;
  like_count: number;
  created_at: number;
}

export function MarketplacePage({ serverId }: { serverId?: string }) {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    invoke<MarketplaceItem[]>("get_marketplace_items", {
      serverId: serverId || null,
      typeFilter: typeFilter || null,
      query: searchQuery || null,
      sort: "newest",
    }).then(setItems).catch(console.error);
  }, [serverId, typeFilter, searchQuery]);

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <select onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="model">AI Models</option>
          <option value="image">Images</option>
          <option value="audio">Audio</option>
          <option value="text">Text</option>
          <option value="config">Configs</option>
        </select>
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-1 rounded border"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="border rounded-lg p-3">
            <h3 className="font-bold">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.item_type}</p>
            <p className="text-xs">{item.file_size} bytes</p>
            <p className="text-xs">Likes: {item.like_count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 11. Use Cases and Scenarios

| Use Case | Item Type | Scenario |
|----------|-----------|----------|
| Share custom AI model | `model` | Fine-tuned Qwen GGUF shared across team |
| Team logo library | `image` | PNG files for branding, pinned to whiteboard |
| Soundboard clips | `audio` | Team victory sounds, OGG format |
| SOP documents | `text` | Markdown standard operating procedures |
| Server backup config | `config` | JSON export of roles, channels, permissions |
| Whiteboard stamp pack | `image` | Reusable icons for collaborative canvas |
| AI prompt templates | `text` | Pre-written system prompts for Liber AI |

---

## 12. Market Comparison

| Feature | Libern | Discord | Slack Marketplace | Steam Workshop |
|---------|--------|---------|-------------------|----------------|
| Offline-first | ✅ | ❌ | ❌ | ❌ |
| P2P sync | ✅ | ❌ | ❌ | ❌ |
| No file size limit | ✅ | ❌ (25MB) | ❌ | ❌ |
| Like/unlike system | ✅ | ✅ (reactions) | ❌ | ✅ |
| Tags/filtering | ✅ | ❌ | ❌ | ✅ |
| Type filtering | ✅ | ❌ | ❌ | ✅ |
| Private visibility | ✅ | ❌ | ❌ | ✅ |
| Server-scoped items | ✅ | ❌ | ❌ | ❌ |
| CRDT sync | ✅ | ❌ | ❌ | ❌ |
| Ed25519 signed | ✅ | ❌ | ❌ | ❌ |
| .aioss ledger audit | ✅ | ❌ | ❌ | ❌ |
| Local storage | ✅ | ❌ | ❌ | ❌ |
| Search by name/desc | ✅ | ✅ | ❌ | ✅ |
| Use count tracking | ✅ | ❌ | ❌ | ✅ |
| MIME type detection | ✅ | ✅ | ❌ | ❌ |
| Thumbnail support | ✅ | ✅ | ❌ | ✅ |

---

## 13. Code: Server Stats with Marketplace Integration

```rust
// apps/desktop/src-tauri/src/commands/stats.rs
#[tauri::command]
pub fn get_server_stats(db: State<Database>, server_id: String) -> Result<serde_json::Value, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let marketplace_items: i32 = conn
        .query_row("SELECT COUNT(*) FROM marketplace_items WHERE server_id = ?1",
            rusqlite::params![server_id], |row| row.get(0))
        .unwrap_or(0);

    let top_members: Vec<serde_json::Value> = {
        let mut stmt = conn.prepare(
            "SELECT u.display_name, COUNT(*) as cnt FROM messages m
             JOIN users u ON m.author_id = u.id
             JOIN channels c ON m.channel_id = c.id
             WHERE c.server_id = ?1
             GROUP BY u.id ORDER BY cnt DESC LIMIT 5"
        ).map_err(|e| e.to_string())?;
        stmt.query_map(rusqlite::params![server_id], |row| {
            Ok(serde_json::json!({"name": row.get::<_, String>(0)?, "count": row.get::<_, i32>(1)?}))
        }).map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())?
    };

    Ok(serde_json::json!({
        "marketplace_items": marketplace_items,
        "top_members": top_members,
    }))
}
```

---

## 14. Code: Delete Marketplace Item

```rust
// apps/desktop/src-tauri/src/commands/marketplace.rs
#[tauri::command]
pub fn delete_marketplace_item(
    db: State<Database>, id: String,
) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "DELETE FROM marketplace_likes WHERE item_id = ?1",
        rusqlite::params![id],
    ).map_err(|e| e.to_string())?;
    conn.execute(
        "DELETE FROM marketplace_items WHERE id = ?1",
        rusqlite::params![id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}
```

---

## 15. Onboarding Flow Integration

```tsx
// apps/desktop/src/components/onboarding/OnboardingFlow.tsx
export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  const steps = [
    { title: "Welcome to Libern", desc: "Sovereign, offline-first collaboration" },
    { title: "Create Your Profile", component: <ProfileEditor /> },
    { title: "Join or Create a Server", desc: "Use an invite code or start fresh" },
    { title: "Explore the Marketplace", desc: "Share AI models, images, and more" },
    { title: "Ready!", desc: "You're all set. Start collaborating." },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <h1 className="text-2xl font-bold">{steps[step].title}</h1>
      <p className="text-sm text-[var(--fill-secondary)]">{steps[step].desc}</p>
      {steps[step].component}
      <div className="flex gap-2">
        {step > 0 && <Button onClick={() => setStep(step - 1)}>Back</Button>}
        <Button onClick={() => {
          if (step < steps.length - 1) setStep(step + 1);
          else onComplete();
        }}>{step === steps.length - 1 ? "Finish" : "Next"}</Button>
      </div>
    </div>
  );
}
```

---

## 16. UI Components from the Codebase

### Tooltip Component
```tsx
// apps/desktop/src/components/ui/Tooltip.tsx
export function Tooltip({ content, children }: { content: string; children: React.ReactNode }) {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full mb-2 px-2 py-1 rounded bg-black text-white text-xs
        whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {content}
      </div>
    </div>
  );
}
```

### Badge Component
```tsx
// apps/desktop/src/components/ui/Badge.tsx
export function Badge({ variant, children }: { variant?: string; children: React.ReactNode }) {
  const variants: Record<string, string> = {
    default: "bg-[var(--fill-quaternary)] text-[var(--fill-secondary)]",
    success: "bg-green-500/20 text-green-400",
    warning: "bg-yellow-500/20 text-yellow-400",
    error: "bg-red-500/20 text-red-400",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${variants[variant || "default"]}`}>
      {children}
    </span>
  );
}
```

### Dialog Component
```tsx
// apps/desktop/src/components/ui/Dialog.tsx
export function Dialog({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="rounded-2xl bg-[var(--bg-secondary)] shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
```

### Avatar Component
```tsx
// apps/desktop/src/components/ui/Avatar.tsx
export function Avatar({ src, name, size = 32 }: { src?: string; name: string; size?: number }) {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const colors = ["#5865F2", "#ED4245", "#57F287", "#FEE75C", "#EB459E", "#0099FF"];
  const colorIndex = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;

  return (
    <div className="rounded-full flex items-center justify-center text-white font-bold"
      style={{ width: size, height: size, backgroundColor: colors[colorIndex], fontSize: size * 0.4 }}>
      {initials}
    </div>
  );
}
```

---

## 17. App Shell Layout

```tsx
// apps/desktop/src/components/layout/AppShell.tsx
export function AppShell() {
  return (
    <div className="flex h-screen bg-[var(--bg-primary)] text-[var(--fill-primary)]">
      <ServerListSidebar />
      <ChannelSidebar />
      <main className="flex-1 flex flex-col">
        <MainContent />
      </main>
      <RightPanel />
      <UserPanel />
    </div>
  );
}
```

---

## 18. Key Takeaway

**The Libern marketplace is the first fully decentralized, offline-first
content sharing system for collaboration platforms.** Users publish items
(AI models, images, audio, text, configs) with a single Tauri command —
the data is stored locally in SQLite as BLOBs, metadata is CRDT-synced
across peers, and every publish and like action is Ed25519-signed and
recorded in the .aioss audit ledger. There are no file size limits, no
cloud storage bills, and no content moderation gatekeepers.

Items can be public (visible to all peers), server-scoped, or private drafts.
The like system uses a trigger-based COUNT(*) pattern that maintains consistency
even in offline mode. The frontend supports type filtering, search across
name and description, infinite scroll browsing, and per-item detail views.
With 5 supported item types (model, image, audio, text, config), 3 visibility
levels, and full cryptographic audit, the Libern marketplace is the most
capable decentralized content sharing system in any collaboration platform.

---

## 14. References

1. Libern Desktop. "Marketplace commands: get, publish, like, unlike, my_items." apps/desktop/src-tauri/src/commands/marketplace.rs, 2026.
2. Libern Core. "MarketplaceItem model." crates/libern-core/src/db/models.rs, 2026.
3. Libern Core. "Marketplace schema: marketplace_items, marketplace_likes." crates/libern-core/src/db/schema.rs, 2026.
4. Shapiro, M., et al. "Conflict-Free Replicated Data Types." INRIA, 2011.
5. Kleppmann, M. "Designing Data-Intensive Applications." O'Reilly, 2017.
6. Libern Desktop. "MarketplacePage React component." apps/desktop/src/components/marketplace/MarketplacePage.tsx, 2026.

**Related docs:**
- /docs/features/01-libern-overview.md
- /docs/features/06-whiteboard.md
- /docs/features/10-games-xp.md
- /docs/features/08-role-permissions.md

**Plain text backup:** /docs-txt/features/09-marketplace.txt

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ