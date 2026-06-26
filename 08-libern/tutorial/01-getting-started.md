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
Document ID: TUT-001
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Getting Started with Libern

## Introduction

Libern is a sovereign, offline-first, LAN-P2P collaborative telecom engine. It provides Discord-like collaboration without any central server, cloud dependency, or external infrastructure. Every message is cryptographically signed, hash-chained into a tamper-evident `.aioss` ledger, and synchronized peer-to-peer via CRDT merge.

This tutorial walks you through downloading Libern, launching it for the first time, creating your identity, and creating or joining a server. By the end of this guide, you will have a fully functional Libern instance running on your local machine with a server ready for collaboration.

### Architecture Overview

Libern's architecture follows a layered design:

```
┌─────────────────────────────────────────────────────┐
│                    UI Layer (React)                  │
│  ┌──────────┐ ┌──────────┐ ┌────────────────────┐  │
│  │ ChatArea │ │ Whiteboard│ │ ComplianceDashboard│  │
│  └──────────┘ └──────────┘ └────────────────────┘  │
├─────────────────────────────────────────────────────┤
│                 Tauri IPC Bridge                     │
├─────────────────────────────────────────────────────┤
│                Rust Backend Layer                    │
│  ┌──────────┐ ┌──────────┐ ┌────────────────────┐  │
│  │ Commands │ │  AI      │ │ .aioss Ledger       │  │
│  └──────────┘ └──────────┘ └────────────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌────────────────────┐  │
│  │  CRDT    │ │  Crypto  │ │  Sync (mDNS/Ws)     │  │
│  └──────────┘ └──────────┘ └────────────────────┘  │
├─────────────────────────────────────────────────────┤
│              SQLite Storage Layer                    │
└─────────────────────────────────────────────────────┘
```

Each layer has a specific responsibility:
- **UI Layer**: React components for chat, whiteboard, marketplace, compliance, and onboarding
- **IPC Bridge**: Tauri's invoke/event system for Rust ↔ TypeScript communication
- **Rust Backend**: All business logic, AI inference, CRDT sync, .aioss ledger management
- **Storage**: SQLite database (`libern.db`) for all persistent data

---

## Prerequisites

- **Windows 10/11**, **macOS 12+**, or **Linux** (glibc 2.28+)
- **1 GB free disk space** (plus ~1.1 GB if downloading the AI model)
- **Network**: LAN connectivity for peer discovery (no internet required for core functionality)

### Detailed Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | Dual-core x86_64 | Quad-core with AVX2 |
| RAM | 512 MB | 4 GB (with AI model) |
| Storage | 500 MB free | 2 GB free (with AI model) |
| Network | Any LAN | Gigabit Ethernet |
| GPU | Any | Dedicated GPU for AI acceleration |

---

## Step 1: Download Libern

Libern is distributed as a single binary installer for each platform.

### Windows
1. Download `Libern-Setup-x.y.z.exe` from the releases page.
2. Double-click the installer.
3. Follow the Windows Installer (WiX) prompts.
4. Libern is installed to `%LOCALAPPDATA%\Programs\libern`.

### macOS
1. Download `Libern-x.y.z.dmg`.
2. Open the DMG and drag Libern to Applications.
3. On first launch, right-click and select Open to bypass Gatekeeper.

### Linux
1. Download `libern-x.y.z.AppImage`.
2. Make it executable: `chmod +x libern-x.y.z.AppImage`
3. Run: `./libern-x.y.z.AppImage`

### Build from Source
```
git clone https://github.com/libern/libern
cd libern
cargo build --release
./target/release/libern-setup
```

### Verify Your Download

Always verify the integrity of your download using SHA-256 checksums:

```
# Windows
certutil -hashfile Libern-Setup-x64.exe SHA256

# macOS/Linux
sha256sum Libern-x.y.z.AppImage
```

Compare the output with the checksum published on the release page. This ensures your download has not been tampered with or corrupted.

### Installation Directory Structure

After installation, the application files are organized as follows:

```
Windows: %LOCALAPPDATA%\Programs\libern\
  libern.exe          — Main executable
  resources/          — Static assets (icons, fonts)
  WebView2Loader.dll  — WebView2 runtime loader

macOS: /Applications/Libern.app/
  Contents/
    MacOS/libern      — Main binary
    Resources/        — Bundled assets

Linux: (AppImage mount or target/release/)
  libern              — Single binary
```

---

## Step 2: First Launch

When you launch Libern for the first time, the **OnboardingFlow** component displays a welcome screen.

1. Click **"Get Started"** on the welcome page.
2. You will see the Libern logo and a brief description: "Sovereign. Private. Offline."

### Onboarding Sequence

The `OnboardingFlow` component (`apps/desktop/src/components/onboarding/OnboardingFlow.tsx`) manages a multi-step wizard:

```
┌──────────────────────────────────────────────────┐
│               Onboarding Flow                     │
├──────────────────────────────────────────────────┤
│   Step 1    │   Step 2    │   Step 3    │  Done  │
│  Welcome    │  Identity   │ Meet Liber  │        │
│             │             │             │        │
│  Fun facts  │  Ed25519    │ AI intro    │ Server │
│  + "Start"  │  key gen    │ + greeting  │  setup │
└─────────────┴─────────────┴─────────────┴────────┘
```

The onboarding process follows this sequence:
1. Welcome screen
2. Identity creation
3. Liber AI introduction
4. Server creation or join
5. Completion

### What Happens During Initialization

When Libern starts, the Tauri backend executes the following initialization sequence:

```rust
// From crates/libern-core/src/db/mod.rs
pub fn init_database(app_data_dir: &Path) -> Result<Database, String> {
    let db_path = app_data_dir.join("libern.db");
    let conn = Connection::open(&db_path).map_err(|e| e.to_string())?;

    // Enable WAL mode for better concurrency
    conn.execute_batch("PRAGMA journal_mode=WAL;").map_err(|e| e.to_string())?;

    // Create all tables if they don't exist
    for statement in CREATE_TABLES {
        conn.execute_batch(statement).map_err(|e| e.to_string())?;
    }

    // Apply any pending migrations
    for migration in MIGRATIONS {
        if let Err(e) = conn.execute_batch(migration) {
            if !e.to_string().contains("duplicate column") {
                return Err(e.to_string());
            }
        }
    }

    // Ensure Liber system user exists
    ensure_liber_user(&conn)?;

    Ok(Database { conn: Mutex::new(conn) })
}
```

The database is initialized before the UI loads, ensuring data is available immediately when the frontend connects.

---

## Step 3: Create Your Identity

Libern uses **Ed25519 cryptographic key pairs** for identity. Your private key never leaves your machine.

1. On the identity step, enter your **Display Name**.
2. The `OnboardingFlow` component calls `createUser(displayName)` via the Tauri command `create_user`.
3. Your identity is stored in the local SQLite database (`libern.db`) in the app data directory.
4. Your public key is stored alongside your profile.

The identity is stored in the `users` table:
```sql
-- Created automatically by create_user command
INSERT INTO users (id, display_name, public_key, is_local, created_at)
VALUES (?1, ?2, ?3, 1, ?4);
```

### The `create_user` Command

The full implementation of `create_user`:

```rust
// From apps/desktop/src-tauri/src/commands/user.rs
#[tauri::command]
pub fn create_user(
    db: State<Database>,
    display_name: String,
) -> Result<User, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let id = Uuid::new_v4().to_string();
    let public_key = vec![0u8; 32]; // Placeholder, real Ed25519 to be implemented
    let now = chrono::Utc::now().timestamp_millis();

    conn.execute(
        "INSERT INTO users (id, display_name, public_key, is_local, created_at)
         VALUES (?1, ?2, ?3, 1, ?4)",
        rusqlite::params![id, display_name, public_key, now],
    ).map_err(|e| e.to_string())?;

    Ok(User {
        id,
        display_name,
        public_key,
        avatar_path: None,
        is_local: 1,
        created_at: now,
    })
}
```

### How Keys Will Work (Future Implementation)

The planned Ed25519 implementation will follow this pattern:

```
┌─────────────────────────────┐
│     Ed25519 Keypair         │
├─────────────────────────────┤
│  Private Key (64 bytes)     │──► Message signing
│  Public Key  (32 bytes)     │──► Identity verification
└─────────────────────────────┘

Signing flow:
  1. Message content + HLC timestamp
  2. SHA3-256 hash of the content
  3. Ed25519 sign(hash, private_key) → 64-byte signature
  4. Store signature alongside message

Verification flow:
  1. Recipient loads sender's public_key
  2. Ed25519 verify(signature, hash, public_key) → true/false
```

After creating your identity, you proceed to meet **Liber**, the built-in AI assistant.

---

## Step 4: Meet Liber AI

The third onboarding step introduces Liber — the local AI assistant.

1. Click **"Say hello to Liber"** to see a greeting message.
2. Liber introduces itself: *"Hi! I'm Liber. I can summarize channels, answer questions, analyze whiteboards, and help with documents. Ask me anything with @Liber."*
3. Click **Continue** to proceed.

The Liber AI runs entirely on your machine. By default it uses `MockEngine` which returns canned responses. For full functionality, you can download the Qwen 2.5 1.5B Q4_K_M GGUF model via the `download_model` command.

### AI Engine Architecture

```
┌──────────────────────────────────────────────────────┐
│                   AiEngine Trait                      │
│  fn infer()   fn embed()   fn is_loaded() fn info()  │
└──────────────────────────────────────────────────────┘
           ▲                    ▲
          /                    \
         /                      \
┌──────────────┐          ┌──────────────┐
│  MockEngine  │          │ CandleEngine │
│  (canned     │          │ (Qwen 2.5B   │
│   responses) │          │  via llama)  │
└──────────────┘          └──────────────┘
```

The engine selection logic:

```rust
// From crates/libern-core/src/ai/engine.rs
pub fn create_engine(app_data_dir: &Path) -> Box<dyn AiEngine + Send> {
    let model_path = app_data_dir.join("models/Qwen2-VL-2B-Instruct-Q4_K_M.gguf");
    let binary_dir = app_data_dir.join("bin");

    if model_path.exists() && binary_dir.join("llama-cli").exists() {
        println!("Liber: Loaded Qwen 2.5 1.5B Instruct");
        Box::new(CandleEngine::new(model_path, binary_dir))
    } else {
        println!("Liber: Using MockEngine");
        Box::new(MockEngine::new())
    }
}
```

---

## Step 5: Create a Server

After onboarding, you can create a server:

1. Click **"Create a Server"** on the server setup step.
2. Alternatively, use the **"+"** button in the ServerListSidebar (left sidebar).
3. The `CreateServerModal` opens.
4. Enter a server name and optional avatar path.
5. Click Create.

The `create_server` Tauri command:
- Generates a UUID for the server ID
- Generates an 8-character invite code (alphanumeric, excluding ambiguous characters)
- Creates default channels: `#general` (text) and `#Voice` (voice)
- Sends a welcome message from Liber to `#general`
- Records everything in the `.aioss` ledger

Server data is stored in the `servers` table:
```sql
INSERT INTO servers (id, name, owner_id, invite_code, created_at, updated_at)
VALUES (?1, ?2, ?3, ?4, ?5, ?6);
```

### Server Creation Flow

```
┌──────────┐    ┌──────────────┐    ┌────────────┐    ┌──────────────┐
│  User    │    │  UI (React)  │    │  Tauri IPC │    │  Rust Backend│
│  clicks  │───►│  CreateServer│───►│  invoke()  │───►│  create_     │
│  "+"     │    │  Modal       │    │            │    │  server()    │
└──────────┘    └──────────────┘    └────────────┘    └──────┬───────┘
                                                             │
                    ┌────────────────────────────────────────┘
                    ▼
          ┌─────────────────────┐
          │ 1. Generate UUID    │
          │ 2. Generate invite  │
          │ 3. INSERT server    │
          │ 4. Create channels  │
          │ 5. Send welcome msg │
          │ 6. Return Server    │
          └─────────────────────┘
```

### Full `create_server` Implementation

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

    // Create default channels
    let general_id = Uuid::new_v4().to_string();
    let voice_id = Uuid::new_v4().to_string();

    conn.execute(
        "INSERT INTO channels (id, server_id, name, kind, position, created_at)
         VALUES (?1, ?2, 'general', 'text', 0, ?3),
                (?4, ?2, 'Voice', 'voice', 1, ?3)",
        rusqlite::params![general_id, id, now, voice_id],
    ).map_err(|e| e.to_string())?;

    // Send welcome message from Liber
    let welcome_content = format!(
        "Welcome to **{}**!\n\nType `/help` to see available commands.",
        name
    );
    // ... send message logic ...

    Ok(Server { id, name, owner_id, avatar_path, invite_code, created_at: now, updated_at: now })
}
```

---

## Step 6: Join a Server with an Invite Code

To join an existing server:

1. Click **"Join with Invite"** during onboarding.
2. Alternatively, use the `joinViaInvite` API function with an invite code.
3. Enter the 12-character invite code.
4. The `join_via_invite` command validates the invite:
   - Checks that `use_count < max_uses` (if max_uses is set)
   - Checks that the invite has not expired
   - Increments the use count
   - Returns the server details

Invite codes are stored in the `invites` table:
```sql
INSERT INTO invites (code, server_id, created_by, max_uses, expires_at, created_at)
VALUES (?1, ?2, ?3, ?4, ?5, ?6);
```

### Invite Code Generation

```rust
// From apps/desktop/src-tauri/src/commands/server.rs
const INVITE_CHARSET: &[u8] = b"ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

fn generate_invite_code(length: usize) -> String {
    use rand::Rng;
    let mut rng = rand::thread_rng();
    (0..length)
        .map(|_| {
            let idx = rng.gen_range(0..INVITE_CHARSET.len());
            INVITE_CHARSET[idx] as char
        })
        .collect()
}
```

Note the charset excludes `0`, `O`, `1`, `l` to avoid visual confusion.

---

## Step 7: Explore the Interface

After completing onboarding, the main interface appears with these components:

```
┌──────────┬──────────────┬──────────────────────────────────────┐
│  Server  │  Channel     │         ChatArea / Content           │
│  List    │  Sidebar     │                                      │
│  (72px)  │  (240px)     │                                      │
│          │              │                                      │
│  🌐 DM   │  # general   │  ┌──────────────────────────────┐   │
│  🏪 Mkt  │  🔊 Voice    │  │ Message 1                    │   │
│  🛡️ Cmpl │  🎨 Board   │  │ Message 2                    │   │
│          │              │  │ Message 3                    │   │
│  🟦 Svr1 │  + Add Ch    │  │ ...                          │   │
│  🟩 Svr2 │              │  └──────────────────────────────┘   │
│  + Create│              │  ┌──────────────────────────────┐   │
│          │              │  │ [Message Input]          ➤   │   │
└──────────┴──────────────┴──────────────────────────────────────┘
```

### ServerListSidebar
The leftmost column (72px wide) contains:
- **Direct Messages** (`@`) — Global chat view
- **Marketplace** (`🏪`) — Browse and publish items
- **Compliance** (`🛡️`) — View .aioss sessions, run health diagnostics
- Your server list — Each server shown as a circular icon with initials
- **+** button — Create a new server

### ChannelSidebar
The second column (240px wide) lists channels for the selected server:
- **Text Channels** section — `#general`, etc.
- Channel icons: `#` for text, `🔊` for voice, `🎨` for whiteboard
- **+** button to create new channels

### ChatArea
The main area displays:
- Channel header with channel name
- Message list with scroll-back loading
- Message input with slash command support
- Liber AI response bubbles

---

## Step 8: App Data Location

Libern stores all data locally. The default locations are:

| Platform | App Data Directory |
|----------|-------------------|
| Windows  | `%APPDATA%\com.libern.app\data` |
| macOS    | `~/Library/Application Support/com.libern.app` |
| Linux    | `~/.local/share/com.libern.app` |

Contents:
```
libern.db                     — SQLite database (servers, channels, messages, etc.)
├── servers, channels, messages, users, roles, invites
├── marketplace_items, casino_balances, user_xp
├── ai_conversations, document_chunks
└── aioss_sessions, health_logs, server_stats

models/                       — AI model GGUF files
└── Qwen2-VL-2B-Instruct-Q4_K_M.gguf  (~1.1 GB)

aioss/                        — Sealed .aioss ledger files
├── chat/
│   ├── {uuid}_{timestamp}.aioss
│   └── {uuid}_{timestamp}.aioss.json
└── game/
    └── ...

bin/                          — llama.cpp CLI binary
└── llama-cli.exe (or llama-cli on macOS/Linux)
```

### Database Schema Overview

The SQLite database contains these tables:

```sql
-- Core entities
users          — User identities (local + remote peers)
servers        — Server definitions
channels       — Text, voice, whiteboard channels
messages       — Chat messages with HLC timestamps and signatures

-- Roles & permissions
roles          — Role definitions with permission bitmask
role_assignments — Many-to-many user-role assignments

-- Invites
invites        — Server invite codes

-- Messaging extras
message_reactions — Emoji reactions on messages
pinned_messages   — Pinned messages per channel

-- AI system
ai_conversations  — AI conversation history
document_chunks   — RAG document chunks and embeddings

-- Gaming
user_xp           — XP and level tracking
casino_balances   — Casino balance tracking
prediction_markets — Prediction market definitions
prediction_bets   — Bets on prediction markets
quiz_scores       — Quiz correct/incorrect tracking

-- Marketplace
marketplace_items  — Published items
marketplace_likes  — Item likes

-- Compliance
aioss_sessions    — .aioss session tracking
health_logs       — Health diagnostics results

-- Spatial/3D
audio_nodes       — 3D spatial audio nodes
world_decals      — 3D whiteboard decals
```

---

## Step 9: Common First-Time Tasks

### Checking Your Identity

```typescript
import { getLocalUser } from "./lib/api";
const user = await getLocalUser();
console.log(`You are: ${user.display_name} (${user.id})`);
```

### Viewing Your Server

```typescript
import { getServers } from "./lib/api";
const servers = await getServers();
servers.forEach(s => console.log(`Server: ${s.name} (${s.id})`));
```

### Sending Your First Message

```typescript
import { sendMessage } from "./lib/api";
await sendMessage(channelId, userId, "Hello, Libern!");
```

### Creating an Invite

```typescript
import { createInvite } from "./lib/api";
const code = await createInvite(serverId, userId);
console.log(`Share this invite: ${code}`);
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| App won't start | Check that you meet system requirements. On Linux, ensure glibc 2.28+ |
| "No server selected" | Create or join a server first using the + button |
| Identity not found | Run through onboarding again, or check `libern.db` for users table |
| Blank screen | Check the developer console for errors. Libern uses Vite + React |
| Installation blocked | Check antivirus/firewall. On macOS, right-click → Open to bypass Gatekeeper |
| Database errors | Run `libern --check-db` from command line to verify integrity |
| No sound during onboarding | Ensure audio devices are properly connected and configured |

### Collecting Diagnostic Information

If you encounter issues:

```bash
# Windows
.\Libern.exe 2>&1 | Out-File -FilePath libern.log

# macOS/Linux
./libern 2>&1 | tee libern.log
```

Include this log output when filing issues on GitHub.

---

## Next Steps

Now that you have Libern running and a server created, proceed to:

- **Tutorial 02**: Creating Server — Explore channels, invite members
- **Tutorial 03**: Sending Messages — Text chat, markdown, file attachments
- **Tutorial 04**: Using AI — /ask, @Liber, slash commands, model download

### Reference

- **FAQ-001**: General FAQ — Overview of Libern features and philosophy
- **FAQ-002**: Installation FAQ — Platform-specific installation guidance
- **HLP-001**: Installation Issues — Troubleshooting installation problems
- **DEV-001**: Architecture Overview — Deep dive into Libern's architecture

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com