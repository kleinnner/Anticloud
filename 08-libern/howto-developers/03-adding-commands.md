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
Category: Developer Guide
Document ID: DEV-003
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Adding Tauri Commands

## Introduction

Tauri commands are the bridge between Libern's Rust backend and its React frontend. They are `#[tauri::command]` annotated functions that can be invoked from TypeScript via the Tauri IPC bridge. This guide covers the complete process of adding a new Tauri command, from writing the Rust function to registering it in `lib.rs` and creating the frontend API wrapper.

The command system supports synchronous and asynchronous functions, database access via managed state, streaming responses via Tauri Channels, and complex error handling with custom error types.

By the end of this guide, you will be able to:
- Write a new Tauri command in Rust
- Register the command in the invoke handler
- Call the command from TypeScript
- Handle parameters, return types, and errors
- Use Tauri channels for streaming responses
- Write unit and integration tests for commands
- Follow project conventions for command naming and structure

---

## Part 1: Tauri Command Architecture

### How Commands Work

```
┌──────────────────┐         ┌──────────────────┐
│   React Frontend  │         │   Rust Backend    │
│                  │  invoke  │                  │
│  invoke("name",  │ ──────► │  #[tauri::command]│
│    {params})     │         │  fn name(params)  │
│                  │ ◄────── │  -> Result<T, E>  │
│  await result    │  return  │                  │
└──────────────────┘         └──────────────────┘
```

### Command Requirements

Every Tauri command must:
1. Be a public function annotated with `#[tauri::command]`.
2. Return `Result<T, String>` where `T` implements `Serialize`.
3. Be registered in the `invoke_handler!` macro in `lib.rs`.
4. Have a corresponding TypeScript wrapper in `lib/api.ts`.

### Module Structure

Commands are organized by entity in `apps/desktop/src-tauri/src/commands/`:

```
commands/
├── mod.rs              # Module declarations
├── server.rs           # Server CRUD commands
├── channel.rs          # Channel CRUD commands
├── message.rs          # Message CRUD + search
├── user.rs             # User identity commands
├── role.rs             # Role + permission commands
├── invite.rs           # Invite code commands
├── ai.rs               # AI/LLM commands (streaming)
├── aioss.rs            # .aioss ledger commands
├── marketplace.rs      # Marketplace commands
├── installer.rs        # Model download commands
├── profile.rs          # Profile update commands
├── reaction.rs         # Emoji reaction commands
├── pins.rs             # Pinned message commands
├── stars.rs            # Starred message commands
├── xp.rs               # XP + level commands
├── games.rs            # Casino games (instant Rust)
├── predictions.rs      # Prediction market commands
└── stats.rs            # Server statistics commands
```

---

## Part 2: Writing a Basic Command

### Step 1: Create the Rust Function

Create a new file in `apps/desktop/src-tauri/src/commands/` or add to an existing module.

```rust
// apps/desktop/src-tauri/src/commands/greeting.rs
use tauri::State;
use crate::database::Database;

#[derive(Serialize)]
pub struct Greeting {
    pub message: String,
    pub timestamp: i64,
}

#[tauri::command]
pub fn greet(
    db: State<Database>,
    name: String,
) -> Result<Greeting, String> {
    if name.trim().is_empty() {
        return Err("Name cannot be empty".to_string());
    }

    let now = chrono::Utc::now().timestamp_millis();
    let message = format!("Hello, {}! Welcome to Libern.", name);

    Ok(Greeting {
        message,
        timestamp: now,
    })
}
```

### Parameter Types

Commands can accept these parameter types:
- **Primitives**: `String`, `i32`, `u64`, `f64`, `bool`
- **Optionals**: `Option<String>`, `Option<i32>`
- **Collections**: `Vec<T>`, `HashMap<String, T>`
- **Structs**: Any `Serialize` + `Deserialize` struct
- **State**: `State<T>` for managed state
- **AppHandle**: For app-level operations
- **Channel**: For streaming responses

### Return Types

Commands must return `Result<T, String>`:
- **Success**: `Ok(T)` where `T: Serialize`
- **Error**: `Err(String)` — the error message is sent to the frontend

### Step 2: Register the Module

Add the module declaration in `commands/mod.rs`:

```rust
// apps/desktop/src-tauri/src/commands/mod.rs
pub mod greeting;
```

### Step 3: Register the Command

Add the command to the `invoke_handler!` macro in `lib.rs`:

```rust
// apps/desktop/src-tauri/src/lib.rs
.invoke_handler(tauri::generate_handler![
    // ... existing commands ...
    commands::greeting::greet,
])
```

### Step 4: Create the TypeScript Wrapper

Add the frontend API function in `apps/desktop/src/lib/api.ts`:

```typescript
// apps/desktop/src/lib/api.ts
import { invoke } from "@tauri-apps/api/core";

export interface Greeting {
    message: string;
    timestamp: number;
}

export async function greet(name: string): Promise<Greeting> {
    return invoke<Greeting>("greet", { name });
}
```

### Step 5: Call from a Component

```typescript
// apps/desktop/src/components/example.tsx
import { greet } from "../lib/api";

async function handleGreet() {
    try {
        const result = await greet("World");
        console.log(result.message); // "Hello, World! Welcome to Libern."
    } catch (error) {
        console.error("Greeting failed:", error);
    }
}
```

---

## Part 3: Working with Database State

Most commands need access to the SQLite database. The database is managed as Tauri state.

### Accessing the Database

```rust
#[tauri::command]
pub fn get_channel_messages(
    db: State<Database>,
    channel_id: String,
    limit: Option<u32>,
) -> Result<Vec<Message>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let limit = limit.unwrap_or(50).min(200);

    let mut stmt = conn.prepare(
        "SELECT id, channel_id, author_id, content, reply_to, hlc_timestamp, signature, created_at
         FROM messages WHERE channel_id = ?1 AND deleted_at IS NULL
         ORDER BY created_at DESC LIMIT ?2"
    ).map_err(|e| e.to_string())?;

    let messages = stmt.query_map(
        rusqlite::params![channel_id, limit],
        |row| {
            Ok(Message {
                id: row.get(0)?,
                channel_id: row.get(1)?,
                author_id: row.get(2)?,
                content: row.get(3)?,
                reply_to: row.get(4)?,
                hlc_timestamp: row.get(5)?,
                signature: row.get(6)?,
                created_at: row.get(7)?,
                edited_at: None,
                deleted_at: None,
            })
        },
    ).map_err(|e| e.to_string())?;

    messages.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}
```

### Writing to the Database

```rust
#[tauri::command]
pub fn create_custom_channel(
    db: State<Database>,
    server_id: String,
    name: String,
    kind: String,
) -> Result<Channel, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp_millis();

    conn.execute(
        "INSERT INTO channels (id, server_id, name, kind, position, created_at)
         VALUES (?1, ?2, ?3, ?4, (SELECT COALESCE(MAX(position), -1) + 1 FROM channels WHERE server_id = ?2), ?5)",
        rusqlite::params![id, server_id, name, kind, now],
    ).map_err(|e| e.to_string())?;

    Ok(Channel { id, server_id, name, kind, position: 0, parent_id: None, created_at: now })
}
```

### Avoiding Deadlocks

When you need to release the database lock before calling another function, use a scoped block:

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
    let now: i64;
    let server_name: String;

    // Scope for DB lock — drop before calling liber_send_message to avoid deadlock
    {
        let conn = db.conn.lock().map_err(|e| e.to_string())?;
        id = Uuid::new_v4().to_string();
        // ... insert server and channels ...
    } // conn lock released here

    // Send welcome message (acquires lock again)
    let welcome = libern_core::ai::liber_user::server_welcome_message(&server_name);
    libern_core::ai::liber_user::liber_send_message(&db, &general_id, &welcome)?;

    Ok(Server { id, /* ... */ })
}
```

---

## Part 4: Streaming Commands with Tauri Channels

For AI inference or long-running operations, use Tauri Channels for streaming responses.

### Rust Side

```rust
use tauri::ipc::Channel;

#[derive(Clone, Serialize)]
#[serde(tag = "event", content = "data")]
pub enum StreamEvent {
    Token { token: String },
    Done { full_response: String },
    Error { message: String },
}

#[tauri::command]
pub async fn stream_greeting(
    name: String,
    on_event: Channel<StreamEvent>,
) -> Result<(), String> {
    let greeting = format!("Hello, {}!", name);

    // Stream tokens
    for ch in greeting.chars() {
        on_event.send(StreamEvent::Token { token: ch.to_string() })
            .map_err(|e| e.to_string())?;
        tokio::time::sleep(std::time::Duration::from_millis(50)).await;
    }

    on_event.send(StreamEvent::Done { full_response: greeting })
        .map_err(|e| e.to_string())?;

    Ok(())
}
```

### TypeScript Side

```typescript
import { invoke, Channel } from "@tauri-apps/api/core";

interface StreamEvent {
    event: "Token" | "Done" | "Error";
    data: { token?: string; full_response?: string; message?: string };
}

export async function streamGreeting(
    name: string,
    onToken: (token: string) => void,
    onDone: (full: string) => void,
): Promise<void> {
    const channel = new Channel<StreamEvent>();
    channel.onmessage = (event) => {
        if (event.event === "Token" && event.data.token) {
            onToken(event.data.token);
        } else if (event.event === "Done" && event.data.full_response) {
            onDone(event.data.full_response);
        }
    };

    await invoke("stream_greeting", { name, onEvent: channel });
}
```

### Real-World Example: AI Streaming

The actual Liber AI streaming command in `apps/desktop/src-tauri/src/commands/ai.rs`:

```rust
#[tauri::command]
pub fn ask_libern(
    ai: State<AiState>,
    db: State<Database>,
    channel_id: String,
    query: String,
    on_event: tauri::ipc::Channel<TokenEvent>,
) -> Result<(), String> {
    let mut engine = ai.engine.lock().map_err(|e| e.to_string())?;

    let history = libern_core::ai::conversation::get_recent(&db, &channel_id, 20)?;
    let context: Vec<(String, String)> = history
        .iter()
        .map(|(role, content, _)| (role.clone(), content.clone()))
        .collect();

    let packed = libern_core::ai::pipeline::pack_context(&context, 2048, 4);
    let is_slash = query.starts_with('/');
    let prompt = if is_slash {
        build_liber_prompt(&query)
    } else {
        libern_core::ai::pipeline::build_chat_prompt(SYSTEM_PROMPT, &packed, &query)
    };

    let callback = Box::new(move |event: TokenEvent| {
        on_event.send(event).ok();
    });

    let engine_ref: &mut Box<dyn AiEngine + Send> = &mut *engine;
    engine_ref.infer(InferenceRequest {
        prompt,
        max_tokens: 1024,
        temperature: 0.7,
        callback,
    })
}
```

---

## Part 5: Async Commands

Tauri commands can be `async`, allowing them to perform non-blocking operations:

```rust
#[tauri::command]
pub async fn download_file(
    app: AppHandle,
    url: String,
    on_progress: Channel<DownloadProgress>,
) -> Result<String, String> {
    let client = reqwest::Client::new();
    let response = client.get(&url).send().await.map_err(|e| e.to_string())?;
    let total = response.content_length().unwrap_or(0);
    let mut downloaded: u64 = 0;

    let app_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let file_path = app_dir.join("downloads").join("file.bin");
    let mut file = std::fs::File::create(&file_path).map_err(|e| e.to_string())?;

    let mut stream = response.bytes_stream();
    while let Some(chunk) = stream.next().await {
        let chunk = chunk.map_err(|e| e.to_string())?;
        file.write_all(&chunk).map_err(|e| e.to_string())?;
        downloaded += chunk.len() as u64;
        on_progress.send(DownloadProgress {
            downloaded,
            total: total as u64,
            percent: (downloaded as f64 / total as f64) * 100.0,
        }).map_err(|e| e.to_string())?;
    }

    Ok(file_path.to_str().unwrap().to_string())
}
```

---

## Part 6: Error Handling Patterns

### Returning Errors

```rust
// Simple string error
#[tauri::command]
pub fn validate_name(name: String) -> Result<String, String> {
    if name.len() < 3 {
        return Err("Name must be at least 3 characters".to_string());
    }
    if name.len() > 32 {
        return Err("Name must be at most 32 characters".to_string());
    }
    Ok(name)
}
```

### Custom Error Types

For complex error handling, define custom error types that implement `Serialize`:

```rust
#[derive(Debug, Serialize)]
pub enum CommandError {
    NotFound(String),
    PermissionDenied(String),
    ValidationError(String),
    DatabaseError(String),
    InternalError(String),
}

impl From<rusqlite::Error> for CommandError {
    fn from(e: rusqlite::Error) -> Self {
        CommandError::DatabaseError(e.to_string())
    }
}

#[tauri::command]
pub fn get_server_detail(
    db: State<Database>,
    server_id: String,
    user_id: String,
) -> Result<Server, CommandError> {
    let conn = db.conn.lock().map_err(|e| CommandError::InternalError(e.to_string()))?;

    let has_perm = check_permission_internal(&conn, &user_id, &server_id, PERM_READ_MESSAGES)?;
    if !has_perm {
        return Err(CommandError::PermissionDenied(
            "You do not have permission to view this server".to_string()
        ));
    }

    let server = conn.query_row(
        "SELECT * FROM servers WHERE id = ?1",
        rusqlite::params![server_id],
        |row| Ok(Server { /* ... */ }),
    ).map_err(|_| CommandError::NotFound("Server not found".to_string()))?;

    Ok(server)
}
```

### TypeScript Error Handling

```typescript
try {
    const server = await getServerDetail("invalid-id", userId);
} catch (error) {
    if (typeof error === "string") {
        console.error("Command failed:", error);
    } else if (error && typeof error === "object" && "PermissionDenied" in error) {
        console.error("Permission denied:", error.PermissionDenied);
    }
}
```

---

## Part 7: Command Conventions

### Naming Conventions

- Use `snake_case` for command names.
- Prefix with the entity name for CRUD commands: `create_server`, `get_messages`, `delete_channel`.
- Use verbs for actions: `send_message`, `toggle_reaction`, `verify_aioss_file`.
- Parameters should match the snake_case Rust naming and be converted to camelCase in TypeScript automatically by Tauri.

### Parameter Conventions

- Use `Option<T>` for optional parameters.
- Provide sensible defaults for optional parameters.
- Use `String` for UUIDs and IDs (not custom UUID types).
- Use `i64` for timestamps (Unix milliseconds).

### Return Value Conventions

- Return the created/updated entity for mutation commands (e.g., `create_server` returns `Server`).
- Return `Vec<T>` for list commands.
- Return `bool` for check commands (e.g., `check_permission`).
- Return `()` for deletion commands (or `Result<(), String>`).

---

## Part 8: Testing Commands

### Unit Testing

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use crate::db::Database;

    fn setup_test_db() -> Database {
        Database::new(":memory:").unwrap()
    }

    #[test]
    fn test_greet_with_valid_name() {
        let db = setup_test_db();
        let result = greet(db.state(), "Alice".to_string());
        assert!(result.is_ok());
        let greeting = result.unwrap();
        assert!(greeting.message.contains("Alice"));
    }

    #[test]
    fn test_greet_with_empty_name() {
        let db = setup_test_db();
        let result = greet(db.state(), "".to_string());
        assert!(result.is_err());
    }
}
```

### Integration Testing

```rust
#[cfg(test)]
mod integration_tests {
    use tauri::test::mock_builder;

    #[test]
    fn test_greet_command_integration() {
        let app = mock_builder()
            .invoke_handler(tauri::generate_handler![greet])
            .build();

        let result = tauri::test::invoke(&app, "greet", serde_json::json!({
            "name": "Alice"
        }));

        assert!(result.is_ok());
    }
}
```

### Test Helpers in the Codebase

The actual server.rs file includes test helpers:

```rust
// apps/desktop/src-tauri/src/commands/server.rs
#[cfg(test)]
pub fn create_test_server(db: &Database, name: &str, owner_id: &str) -> Server {
    let conn = db.conn.lock().unwrap();
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp_millis();
    conn.execute(
        "INSERT INTO servers (id, name, owner_id, invite_code, created_at, updated_at)
         VALUES (?1, ?2, ?3, 'TESTCODE', ?4, ?4)",
        rusqlite::params![id, name, owner_id, now],
    ).unwrap();
    Server {
        id, name: name.to_string(), owner_id: owner_id.to_string(),
        avatar_path: None, invite_code: "TESTCODE".to_string(),
        created_at: now, updated_at: now,
    }
}

#[cfg(test)]
pub fn create_test_user(db: &Database) -> String {
    let conn = db.conn.lock().unwrap();
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp_millis();
    conn.execute(
        "INSERT INTO users (id, display_name, public_key, is_local, created_at)
         VALUES (?1, 'testuser', x'00', 1, ?2)",
        rusqlite::params![id, now],
    ).unwrap();
    id
}
```

---

## Part 9: Complete Example — Adding a "Polls" Feature

### Rust Command

```rust
// apps/desktop/src-tauri/src/commands/poll.rs
use serde::{Deserialize, Serialize};
use tauri::State;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Poll {
    pub id: String,
    pub channel_id: String,
    pub question: String,
    pub options: Vec<String>,
    pub created_by: String,
    pub created_at: i64,
    pub is_closed: bool,
}

#[tauri::command]
pub fn create_poll(
    db: State<Database>,
    channel_id: String,
    question: String,
    options: Vec<String>,
    created_by: String,
) -> Result<Poll, String> {
    if options.len() < 2 {
        return Err("A poll must have at least 2 options".to_string());
    }
    if options.len() > 10 {
        return Err("A poll can have at most 10 options".to_string());
    }

    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp_millis();
    let options_json = serde_json::to_string(&options).map_err(|e| e.to_string())?;

    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO polls (id, channel_id, question, options, created_by, created_at, is_closed)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, 0)",
        rusqlite::params![id, channel_id, question, options_json, created_by, now],
    ).map_err(|e| e.to_string())?;

    Ok(Poll { id, channel_id, question, options, created_by, created_at: now, is_closed: false })
}

#[tauri::command]
pub fn vote_poll(
    db: State<Database>,
    poll_id: String,
    user_id: String,
    option_index: usize,
) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let poll: (String, bool) = conn.query_row(
        "SELECT question, is_closed FROM polls WHERE id = ?1",
        rusqlite::params![poll_id],
        |row| Ok((row.get(0)?, row.get(1)?)),
    ).map_err(|_| "Poll not found".to_string())?;

    if poll.1 {
        return Err("Poll is closed".to_string());
    }

    let existing: Result<String, _> = conn.query_row(
        "SELECT id FROM poll_votes WHERE poll_id = ?1 AND user_id = ?2",
        rusqlite::params![poll_id, user_id],
        |row| row.get(0),
    );

    if existing.is_ok() {
        return Err("You have already voted on this poll".to_string());
    }

    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp_millis();
    conn.execute(
        "INSERT INTO poll_votes (id, poll_id, user_id, option_index, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5)",
        rusqlite::params![id, poll_id, user_id, option_index as i32, now],
    ).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn get_poll_results(
    db: State<Database>,
    poll_id: String,
) -> Result<serde_json::Value, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let poll = conn.query_row(
        "SELECT id, question, options, is_closed FROM polls WHERE id = ?1",
        rusqlite::params![poll_id],
        |row| {
            let options_str: String = row.get(2)?;
            let options: Vec<String> = serde_json::from_str(&options_str).unwrap_or_default();
            Ok((row.get::<_, String>(0)?, row.get::<_, String>(1)?, options, row.get::<_, bool>(3)?))
        },
    ).map_err(|_| "Poll not found".to_string())?;

    let mut results: Vec<serde_json::Value> = poll.2.iter().enumerate().map(|(i, opt)| {
        let count: i32 = conn.query_row(
            "SELECT COUNT(*) FROM poll_votes WHERE poll_id = ?1 AND option_index = ?2",
            rusqlite::params![poll_id, i as i32],
            |row| row.get(0),
        ).unwrap_or(0);

        serde_json::json!({ "option": opt, "votes": count })
    }).collect();

    Ok(serde_json::json!({
        "question": poll.1,
        "is_closed": poll.3,
        "results": results,
    }))
}
```

### Frontend API

```typescript
export interface Poll {
    id: string;
    channel_id: string;
    question: string;
    options: string[];
    created_by: string;
    created_at: number;
    is_closed: boolean;
}

export async function createPoll(
    channelId: string,
    question: string,
    options: string[],
    createdBy: string,
): Promise<Poll> {
    return invoke<Poll>("create_poll", { channelId, question, options, createdBy });
}

export async function votePoll(
    pollId: string,
    userId: string,
    optionIndex: number,
): Promise<void> {
    return invoke("vote_poll", { pollId, userId, optionIndex });
}

export async function getPollResults(pollId: string): Promise<PollResults> {
    return invoke("get_poll_results", { pollId });
}
```

### Database Migration

```sql
CREATE TABLE IF NOT EXISTS polls (
    id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options TEXT NOT NULL,  -- JSON array of strings
    created_by TEXT NOT NULL REFERENCES users(id),
    created_at INTEGER NOT NULL,
    is_closed INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS poll_votes (
    id TEXT PRIMARY KEY,
    poll_id TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id),
    option_index INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    UNIQUE(poll_id, user_id)
);
```

---

## Part 10: Command Registration Checklist

Use this checklist when adding a new command:

- [ ] Rust function written with `#[tauri::command]`
- [ ] Module declared in `commands/mod.rs`
- [ ] Command registered in `lib.rs` `invoke_handler!`
- [ ] TypeScript wrapper function in `lib/api.ts`
- [ ] TypeScript types defined for parameters and return values
- [ ] Rust unit tests added
- [ ] Frontend component tested
- [ ] Documentation updated (API reference, relevant guides)
- [ ] Database schema updated (if applicable)
- [ ] Permission check added (if applicable)

### Quick Reference: Files to Modify

| File | Action |
|------|--------|
| `apps/desktop/src-tauri/src/commands/<name>.rs` | Create new command file |
| `apps/desktop/src-tauri/src/commands/mod.rs` | Add `pub mod <name>;` |
| `apps/desktop/src-tauri/src/lib.rs` | Add `commands::<name>::<fn>` to `invoke_handler!` |
| `apps/desktop/src/lib/api.ts` | Add TypeScript wrapper function |
| `apps/desktop/src/types/index.ts` | Add TypeScript interfaces (if new types) |
| `crates/libern-core/src/db/schema.rs` | Add table creation SQL (if new tables) |
| `crates/libern-core/src/db/models.rs` | Add Rust struct (if new models) |
| `docs/` | Update relevant documentation |

---

## Next Steps

Now that you can add Tauri commands, proceed to:

- **How-To Guide 04**: Modifying the Frontend — React components, Zustand stores, Tailwind styling
- **How-To Guide 05**: Testing — Writing unit tests and integration tests
- **How-To Guide 06**: Building an Installer — MSI, native installer, cross-platform packaging

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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
