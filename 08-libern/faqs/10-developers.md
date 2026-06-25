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
Document ID: FAQ-010
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Developers FAQ

## How do I build Libern from source?

### Prerequisites

1. **Rust** (install via rustup.rs):
   ```bash
   rustup install stable
   ```

2. **Node.js** 18+ and pnpm:
   ```bash
   npm install -g pnpm
   ```

3. **Tauri prerequisites**:
   - **Windows**: Microsoft Visual Studio Build Tools with C++ workload
   - **macOS**: Xcode Command Line Tools (`xcode-select --install`)
   - **Linux**: WebKit2GTK and friends:
     ```bash
     sudo apt install libwebkit2gtk-4.1-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
     ```

### Build Steps

```bash
git clone https://github.com/libern/libern
cd libern

# Install frontend dependencies
cd apps/desktop
pnpm install

# Build in development mode
pnpm tauri dev

# Build for production
pnpm tauri build
```

### Build Configuration

The build process is configured by:
- `Cargo.toml` — Rust workspace root
- `apps/desktop/vite.config.ts` — Frontend bundling
- `apps/desktop/tsconfig.json` — TypeScript configuration
- `apps/desktop/src-tauri/Cargo.toml` — Tauri backend configuration
- `build.bat` — Windows automated build script

---

## What is the project structure?

```
libern/
├── apps/
│   ├── desktop/              # Tauri desktop application
│   │   ├── src/              # React frontend (TypeScript)
│   │   │   ├── components/   # UI components
│   │   │   │   ├── ai/       # AI-related UI (LiberMessageBubble, etc.)
│   │   │   │   ├── chat/     # Chat UI (MessageInput, MessageList, etc.)
│   │   │   │   ├── compliance/ # Compliance dashboard
│   │   │   │   ├── layout/   # App layout (Sidebar, etc.)
│   │   │   │   ├── levels/   # XP/Level UI (Leaderboard, LevelBadge)
│   │   │   │   ├── marketplace/ # Marketplace UI
│   │   │   │   └── profile/  # User profile components
│   │   │   ├── stores/       # Zustand stores
│   │   │   ├── lib/          # API client, AI helpers
│   │   │   └── types/        # TypeScript interfaces
│   │   └── src-tauri/        # Rust backend
│   │       └── src/
│   │           └── commands/ # Tauri commands (19 modules)
│   └── sandbox/              # Sandbox testing
├── crates/
│   ├── libern-core/          # Core library
│   │   └── src/
│   │       ├── ai/           # AI engine, pipeline, RAG, moderator, reward
│   │       ├── crdt/         # HLC, LWW Element Set
│   │       ├── crypto/       # Cryptographic primitives
│   │       ├── db/           # SQLite schema, models, migrations
│   │       └── sync/         # Network sync (mDNS, WebSocket)
│   └── libern-aioss/         # .aioss binary format
│       └── src/
│           ├── header.rs     # 128-byte header
│           ├── entry.rs      # 256-byte entry
│           ├── ledger.rs     # Binary + JSON ledger
│           ├── verify.rs     # Hash chain verification
│           ├── writer.rs     # File writing
│           ├── reader.rs     # File reading
│           ├── state_proof.rs# Ed25519 state proofs
│           └── health.rs     # Health diagnostics
├── Cargo.toml                # Rust workspace root
├── Cargo.lock                # Dependency lock file
└── build.bat                 # Windows build script
```

### Module Dependency Graph

```
apps/desktop (Tauri App)
    │
    ├──► crates/libern-core
    │       ├── ai/
    │       ├── crdt/
    │       ├── crypto/
    │       ├── db/
    │       └── sync/
    │
    └──► crates/libern-aioss
            ├── header.rs
            ├── entry.rs
            ├── ledger.rs
            ├── verify.rs
            ├── writer.rs
            ├── reader.rs
            ├── state_proof.rs
            └── health.rs
```

---

## How do I add a Tauri command?

1. Create a new file in `apps/desktop/src-tauri/src/commands/` (or add to an existing file).
2. Define a function with the `#[tauri::command]` attribute.
3. Register the command in `apps/desktop/src-tauri/src/lib.rs` in the `invoke_handler`.
4. Add the API call in `apps/desktop/src/lib/api.ts`.

### Example

```rust
// apps/desktop/src-tauri/src/commands/my_command.rs
#[tauri::command]
pub fn my_command(db: State<Database>, param: String) -> Result<String, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    // ... do something ...
    Ok("result".to_string())
}
```

```rust
// apps/desktop/src-tauri/src/lib.rs — add to invoke_handler
.invoke_handler(tauri::generate_handler![
    // ... existing commands ...
    commands::my_command::my_command,
])
```

```typescript
// apps/desktop/src/lib/api.ts
export const myCommand = (param: string) => invoke<string>("my_command", { param });
```

### Tauri Command Architecture

```
Frontend (TypeScript)           Backend (Rust)
┌─────────────────────┐      ┌──────────────────────┐
│ invoke("my_command",│─────►│ #[tauri::command]    │
│   { param: "val" }) │      │ pub fn my_command(   │
└─────────────────────┘      │   db: State<Database>,│
                             │   param: String,     │
Result<string> ◄─────────────│ ) -> Result<String,  │
                             │         String> {    │
                             │   // ...             │
                             │ }                    │
                             └──────────────────────┘
```

---

## How do commands access the database?

Commands access the database via Tauri's state management:
```rust
#[tauri::command]
pub fn get_servers(db: State<Database>) -> Result<Vec<Server>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    // Query the database
    let mut stmt = conn.prepare("SELECT ...")?;
    // ...
}
```

The database is initialized in `lib.rs::run()` and managed via `app.manage(database)`.

---

## How does error handling work?

All Tauri commands return `Result<T, String>`. Errors are converted to strings and propagated to the frontend:

```rust
#[tauri::command]
pub fn delete_server(db: State<Database>, id: String) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM servers WHERE id = ?1", rusqlite::params![id])
        .map_err(|e| e.to_string())?; // SQL errors → String
    Ok(())
}
```

On the frontend, errors are caught in try/catch:
```typescript
try {
    await deleteServer(id);
} catch (e) {
    console.error("Failed to delete server:", e);
}
```

---

## How do I add a new database table?

1. Add the `CREATE TABLE` statement to `CREATE_TABLES` array in `crates/libern-core/src/db/schema.rs`.
2. Add any migration statements to the `MIGRATIONS` array.
3. Define a Rust struct in `crates/libern-core/src/db/models.rs` with serde derives.
4. Define the TypeScript interface in `apps/desktop/src/types/index.ts`.
5. Create Tauri commands for CRUD operations.

---

## How do AI engines work?

Implement the `AiEngine` trait:
```rust
pub trait AiEngine: Send + 'static {
    fn infer(&mut self, request: InferenceRequest) -> Result<(), String>;
    fn embed(&mut self, text: &str) -> Result<Vec<f32>, String>;
    fn is_loaded(&self) -> bool;
    fn model_info(&self) -> ModelInfo;
}
```

The `InferenceRequest` includes:
- `prompt`: The input text
- `max_tokens`: Maximum tokens to generate
- `temperature`: Sampling temperature
- `callback`: Closure for streaming token events

The engine is managed as Tauri state in `AiState`:
```rust
pub struct AiState {
    pub engine: Mutex<Box<dyn AiEngine + Send>>,
}
```

---

## How do I add a frontend component?

1. Create the component in the appropriate subdirectory of `apps/desktop/src/components/`.
2. If it needs state, use Zustand stores in `apps/desktop/src/stores/`.
3. Add API calls in `apps/desktop/src/lib/api.ts` or `apps/desktop/src/lib/ai.ts`.
4. Wire it into the app via one of the layout components (`AppShell`, `MainContent`).

### Component structure examples:
- `components/chat/` — ChatArea, MessageInput, MessageList, SlashCommands
- `components/layout/` — AppShell, ChannelSidebar, ServerListSidebar
- `components/ai/` — LiberMessageBubble, ModelDownloadModal
- `components/marketplace/` — MarketplacePage
- `components/compliance/` — ComplianceDashboard
- `components/levels/` — Leaderboard, LevelBadge

---

## How does the Zustand store work?

Example from `messageStore.ts`:
```typescript
import { create } from "zustand";
import type { Message } from "../types";

interface MessageState {
  messages: Map<string, Message[]>;
  isLoading: boolean;
  setMessages: (channelId: string, messages: Message[]) => void;
  addMessage: (channelId: string, message: Message) => void;
  removeMessage: (channelId: string, messageId: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  messages: new Map(),
  isLoading: false,
  setMessages: (channelId, messages) =>
    set((state) => {
      const m = new Map(state.messages);
      m.set(channelId, messages);
      return { messages: m };
    }),
  // ...
}));
```

---

## How do I run tests?

### Rust tests (unit tests)
```bash
cargo test --workspace
```

Specific crate tests:
```bash
cargo test -p libern-core
cargo test -p libern-aioss
```

### Integration tests
```bash
cd apps/desktop
pnpm test
```

Tests exist in:
- `crates/libern-core/src/crdt/mod.rs` — HLC and LWW tests
- `crates/libern-core/src/ai/engine.rs` — MockEngine tests
- `crates/libern-core/src/ai/qwen_engine.rs` — CandleEngine parser tests
- `crates/libern-core/src/ai/moderator.rs` — Moderation tests
- `crates/libern-core/src/ai/reward.rs` — Reward model tests
- `crates/libern-core/src/db/mod.rs` — Database initialization and query tests
- `crates/libern-aioss/src/verify.rs` — Chain verification tests
- `crates/libern-aioss/src/state_proof.rs` — Ed25519 sign/verify tests

### AI engine test (requires model)
```bash
LIBERN_TEST_MODEL=/path/to/model.gguf LIBERN_TEST_BIN_DIR=/path/to/bin cargo test -p libern-core -- --test-threads=1
```

---

## How do I add a new AI command?

1. Add the system prompt in `get_system_prompt()` in `ai.rs`.
2. Add the command name to `ALL_COMMANDS` in `SlashCommands.tsx`.
3. Add the command to the Liber-powered commands list in `MessageInput.tsx`.
4. If it's a Rust command, implement the logic in `games.rs` (or a new commands file).

---

## How do I write migrations?

Add SQL statements to the `MIGRATIONS` array in `schema.rs`:
```rust
pub const MIGRATIONS: &[&str] = &[
    "ALTER TABLE users ADD COLUMN bio TEXT DEFAULT ''",
    "ALTER TABLE users ADD COLUMN pronouns TEXT DEFAULT ''",
    "ALTER TABLE users ADD COLUMN handle TEXT",
];
```

Migrations are applied on every database initialization — they use `IF NOT EXISTS` semantics via error suppression:
```rust
if !e.to_string().contains("duplicate column") {
    return Err(e);
}
```

---

## Can I contribute?

Yes. Contributions are welcome:
1. Fork the repository.
2. Create a feature branch.
3. Make changes following the code style.
4. Add tests for new functionality.
5. Submit a pull request.

The codebase follows:
- Rust: Standard Rust 2021 idioms, serde for serialization.
- TypeScript: Strict TypeScript with explicit interfaces.
- React: Functional components with hooks, Zustand for state.
- Styling: CSS custom properties via `index.css` theme variables.

---

## Development Workflow

```
1. Fork & Clone
   git clone https://github.com/YOUR_USERNAME/libern

2. Create Branch
   git checkout -b feature/my-feature

3. Develop
   # Frontend
   cd apps/desktop && pnpm tauri dev

   # Backend tests
   cargo test -p libern-core

4. Commit
   git add .
   git commit -m "feat: add my new feature"

5. Push & PR
   git push origin feature/my-feature
   # Open pull request on GitHub
```

---

## Code Style Guidelines

### Rust
- Use Rust 2021 edition
- Follow `rustfmt` formatting
- Use `cargo clippy` for linting
- Use `serde` for serialization
- Prefer `Result<T, String>` for Tauri commands

### TypeScript/React
- Strict TypeScript mode
- Functional components with hooks
- Zustand for state management
- CSS custom properties for theming
- Avoid class components

### Commits
- Follow conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
- Keep commits focused and atomic

---

## Tauri Command Reference

### State Management

| State Type | Purpose | Mutex Used |
|-----------|---------|------------|
| `Database` | SQLite connection | `Mutex<Connection>` |
| `AiState` | AI engine | `Mutex<Box<dyn AiEngine>>` |
| `AppHandle` | Tauri app handle | Direct access |

### Database State Pattern

```rust
// Define state
pub struct Database {
    pub conn: Mutex<Connection>,
}

// Register state in main
fn main() {
    tauri::Builder::default()
        .manage(database)
        .invoke_handler(tauri::generate_handler![...])
        .run(tauri::generate_context!())
}

// Access in commands
#[tauri::command]
fn my_command(db: State<Database>) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    // ... use conn ...
}
```

### Available Tauri Commands

| Module | Commands |
|--------|----------|
| `user.rs` | `create_user`, `get_local_user`, `update_profile`, `update_display_name`, `check_handle` |
| `server.rs` | `create_server`, `update_server`, `delete_server`, `get_server_stats`, `get_servers`, `create_invite`, `join_via_invite`, `get_invites`, `delete_invite` |
| `channel.rs` | `create_channel`, `delete_channel`, `get_channels` |
| `message.rs` | `send_message`, `edit_message`, `delete_message`, `get_messages`, `search_messages`, `pin_message`, `unpin_message`, `get_pinned_messages`, `toggle_star`, `get_starred_messages`, `get_starboard_messages`, `set_starboard_config`, `toggle_reaction`, `get_reactions` |
| `role.rs` | `create_role`, `update_role`, `delete_role`, `get_roles`, `assign_role`, `remove_role`, `check_permission` |
| `ai.rs` | `ask_libern`, `ask_whiteboard`, `summarize_channel`, `moderate_message`, `get_ai_status`, `get_conversation_history`, `clear_conversation_history`, `rate_response`, `get_user_preferences`, `upload_document`, `query_documents` |
| `games.rs` | `roll_dice`, `flip_coin`, `casino_slots`, `casino_blackjack`, `add_xp`, `get_level`, `get_leaderboard`, `create_prediction`, `place_bet`, `resolve_prediction`, `get_markets` |
| `marketplace.rs` | `get_marketplace_items`, `publish_marketplace_item`, `delete_marketplace_item`, `like_marketplace_item`, `unlike_marketplace_item`, `get_my_items` |
| `aioss.rs` | `create_aioss_session`, `append_aioss_entry`, `seal_aioss_session`, `verify_aioss_file`, `sign_aioss_session`, `get_aioss_ledger_json`, `set_aioss_interval`, `run_health_diagnostics`, `list_aioss_sessions` |

---

## Rust Code Patterns

### Error Handling

```rust
// Tauri commands return Result<T, String>
#[tauri::command]
pub fn example(db: State<Database>, id: String) -> Result<SomeType, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    // Use ? for error propagation
    let result = conn.query_row(
        "SELECT ... FROM table WHERE id = ?1",
        rusqlite::params![id],
        |row| { Ok(SomeType { ... }) },
    ).map_err(|e| e.to_string())?;

    Ok(result)
}
```

### UUID Generation

```rust
use uuid::Uuid;

fn generate_id() -> String {
    Uuid::new_v4().to_string()
}
```

### Timestamp Handling

```rust
use chrono;

fn now_ms() -> i64 {
    chrono::Utc::now().timestamp_millis()
}
```

### JSON Response Building

```rust
use serde_json;

fn json_response(key: &str, value: &str) -> serde_json::Value {
    serde_json::json!({ key: value })
}
```

---

## React Component Patterns

### Functional Component with State

```typescript
import { useState, useEffect } from 'react';
import { useStore } from '../stores/myStore';

interface Props {
  id: string;
}

export function MyComponent({ id }: Props) {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(true);
  const store = useStore();

  useEffect(() => {
    setLoading(true);
    fetchData(id).then(result => {
      setData(result);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <Spinner />;
  if (!data) return <ErrorState />;
  return <div>{/* render data */}</div>;
}
```

### Zustand Store Pattern

```typescript
import { create } from 'zustand';

interface MyState {
  items: MyItem[];
  isLoading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  addItem: (item: MyItem) => void;
  removeItem: (id: string) => void;
}

export const useMyStore = create<MyState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await getItems();
      set({ items, isLoading: false });
    } catch (e) {
      set({ error: e.toString(), isLoading: false });
    }
  },

  addItem: (item) => set((state) => ({
    items: [...state.items, item],
  })),

  removeItem: (id) => set((state) => ({
    items: state.items.filter(i => i.id !== id),
  })),
}));
```

---

## API Client Pattern

```typescript
// From apps/desktop/src/lib/api.ts
import { invoke } from '@tauri-apps/api/core';

// Type-safe invoke wrapper
export async function sendMessage(
  channelId: string,
  authorId: string,
  content: string,
  replyTo?: string,
): Promise<Message> {
  return invoke<Message>('send_message', {
    channelId,
    authorId,
    content,
    replyTo: replyTo ?? null,
  });
}

// Error handling wrapper
export async function safeInvoke<T>(
  command: string,
  args?: Record<string, unknown>,
): Promise<T> {
  try {
    return await invoke<T>(command, args);
  } catch (error) {
    console.error(`Command '${command}' failed:`, error);
    throw error;
  }
}
```

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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/SZJMZA
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
