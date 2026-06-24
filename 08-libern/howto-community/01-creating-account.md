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
Document ID: CMT-001
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Creating Your Libern Account

## Introduction

Libern is a sovereign, offline-first, LAN-P2P collaborative telecom engine. Unlike traditional platforms, Libern has no central servers, no cloud dependency, and no account registration on a remote service. Your "account" is a cryptographic identity — an Ed25519 keypair generated entirely on your local machine. Your private key never leaves your device. This guide walks you through downloading Libern, launching it for the first time, creating your identity, and setting up your profile.

Libern uses a local SQLite database to store all your data. There is no "sign up" form, no email verification, and no password to remember. Your identity is purely cryptographic — you are your keypair.

### What Makes Libern Different?

```
Traditional Platform          Libern
─────────────────          ──────────
Central server             No server
Cloud storage              Local SQLite + .aioss
Email/password login       Ed25519 keypair
Username unique globally   Display name not unique
Data owned by platform     Data owned by you
Requires internet          Works offline
```

By the end of this guide, you will have:
- Libern installed on your machine
- A cryptographic identity (Ed25519 keypair) uniquely yours
- A profile with your display name and optional avatar
- A basic understanding of how Libern stores your data locally

---

## Prerequisites

Before you begin, ensure your system meets these requirements:

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Operating System | Windows 10, macOS 12+, Linux (glibc 2.28+) | Windows 11, macOS 14+, Ubuntu 24.04 |
| RAM | 512 MB | 4 GB (16 GB with AI model) |
| Disk Space | 200 MB free | 2 GB free (1.1 GB for AI model) |
| Network | None required for core features | LAN for peer discovery |
| Display | 1280x720 | 1920x1080 |

Libern is a single-binary application. You do not need to install any runtime, framework, or dependency. Everything is bundled.

### Checking Your System

**Windows**: Open a PowerShell terminal and run:
```powershell
# Check Windows version
[System.Environment]::OSVersion.Version

# Check available disk space
Get-PSDrive -Name C | Select-Object Used,Free
```

**macOS**: Open Terminal and run:
```bash
sw_vers
df -h ~
```

**Linux**: Open a terminal and run:
```bash
uname -a
df -h ~
```

---

## Step 1: Download Libern

Libern is distributed as a native installer for each platform. Visit the official releases page at `https://github.com/libern/libern/releases` to download the latest version.

### Windows

1. Download `Libern-Setup-x.y.z.exe` from the releases page.
2. The installer uses Windows Installer (WiX) technology for a standard installation experience.
3. Double-click the installer and follow the on-screen prompts.
4. Accept the default installation directory (`%LOCALAPPDATA%\Programs\libern`) or choose a custom path.
5. Once installed, Libern will appear in your Start Menu. Launch it from there.

The installer places the following files:
```
%LOCALAPPDATA%\Programs\libern\
├── Libern.exe                    # Main application binary
├── resources/                    # Bundled assets (icons, default configs)
└── binaries/                     # Supporting binaries
    └── llama-cli.exe             # llama.cpp CLI for AI (if bundled)
```

### macOS

1. Download `Libern-x.y.z.dmg` from the releases page.
2. Open the DMG file by double-clicking it.
3. Drag the Libern application icon into your `Applications` folder.
4. On first launch, macOS may block the app because it is not notarized. Right-click (or Ctrl+click) Libern in Applications and select **Open** from the context menu, then click **Open** in the dialog.
5. You can add Libern to your Dock for quick access.

### Linux

1. Download `libern-x.y.z.AppImage` from the releases page.
2. Open a terminal in the download directory.
3. Make the AppImage executable: `chmod +x libern-x.y.z.AppImage`
4. Run the AppImage: `./libern-x.y.z.AppImage`
5. Optionally, move the AppImage to `~/.local/bin/` for system-wide access.

For Debian/Ubuntu-based systems, you may also install the `.deb` package if available:
```bash
sudo dpkg -i libern-x.y.z.deb
```

For Arch-based systems, an AUR package may be available:
```bash
yay -S libern
```

### Build from Source (Advanced)

If you prefer to build from source, you need the Rust toolchain and Node.js:
```bash
git clone https://github.com/libern/libern.git
cd libern
pnpm install
cd apps/desktop
pnpm tauri build
```

The built binary will be at `apps/desktop/src-tauri/target/release/libern-desktop.exe` (or the platform equivalent).

### Verifying the Download

It is good practice to verify the integrity of your download using SHA-256 checksums:

```bash
# Windows (PowerShell)
Get-FileHash -Algorithm SHA256 .\Libern-Setup-x.y.z.exe

# macOS / Linux
sha256sum ./Libern-x.y.z.dmg
```

Compare the output with the checksum provided on the releases page. This ensures the file has not been tampered with during download.

---

## Step 2: First Launch

When you launch Libern for the first time, you are greeted by the **OnboardingFlow** component. This is a step-by-step wizard that guides you through setting up your identity and creating or joining your first server.

### Welcome Screen

The welcome screen displays:
- The Libern logo (the ASCII art Libern symbol)
- The tagline: "Sovereign Collaborative Telecom Engine"
- Three key principles: **Sovereign**, **Offline-first**, **Tamper-evident**
- A **"Get Started"** button to begin

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│                     ██▄███▄                          │
│                     ██▀  ▀██                         │
│                     ██    ██                         │
│                     ███▄▄██▀                         │
│                     ▀▀ ▀▀▀                           │
│                                                      │
│     Libern — Sovereign Collaborative Telecom Engine   │
│                                                      │
│     ✓ Sovereign    ✓ Offline-first    ✓ Tamper-evident│
│                                                      │
│              [ Get Started ]                         │
│                                                      │
└──────────────────────────────────────────────────────┘
```

Click **"Get Started"** to proceed.

### What Happens Behind the Scenes

When you click "Get Started," the following occurs automatically:

1. The Rust backend initializes the SQLite database at the platform-specific app data directory:
   - Windows: `%APPDATA%\com.libern.app\data\libern.db`
   - macOS: `~/Library/Application Support/com.libern.app/libern.db`
   - Linux: `~/.local/share/com.libern.app/libern.db`

2. The database schema is created (all tables for users, servers, channels, messages, roles, etc.).

3. A check is performed to see if a local user already exists. Since this is first launch, none is found, so the onboarding flow is shown.

4. The Liber system AI user is created in the database (reserved UUID `00000000-0000-0000-0000-000000000001`).

5. The onboarding sequence is initiated:
   - Welcome screen
   - Identity creation
   - Liber AI introduction
   - Server creation or join
   - Completion

### The Database Initialization Code

The database schema is defined in `crates/libern-core/src/db/schema.rs`:

```rust
pub fn initialize_schema(conn: &Connection) -> Result<(), String> {
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            display_name TEXT NOT NULL,
            public_key BLOB NOT NULL,
            avatar_path TEXT,
            is_local INTEGER NOT NULL DEFAULT 0,
            bio TEXT,
            pronouns TEXT,
            handle TEXT,
            created_at INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS servers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            owner_id TEXT NOT NULL REFERENCES users(id),
            avatar_path TEXT,
            invite_code TEXT UNIQUE,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS channels (
            id TEXT PRIMARY KEY,
            server_id TEXT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            kind TEXT NOT NULL DEFAULT 'text',
            position INTEGER NOT NULL DEFAULT 0,
            parent_id TEXT REFERENCES channels(id),
            created_at INTEGER NOT NULL
        );
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
        );"
    ).map_err(|e| e.to_string())
}
```

---

## Step 3: Create Your Identity

Libern uses **Ed25519 cryptographic key pairs** for identity. This is the same elliptic curve cryptography used by modern secure systems like SSH, OpenPGP, and the Tor network. Your private key is generated on your machine and never transmitted anywhere.

### The Identity Creation Screen

1. You are prompted to enter a **Display Name**. This is the name other users will see in chat.
2. Optionally, you can also set your **Pronouns** and a short **Bio** during onboarding.
3. Click **"Create Identity"** or press Enter.

### What Happens Internally

When you click "Create Identity," the `create_user` Tauri command is invoked:

```rust
// From apps/desktop/src-tauri/src/commands/user.rs
#[tauri::command]
pub fn create_user(
    db: State<Database>,
    display_name: String,
) -> Result<User, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let id = Uuid::new_v4().to_string();
    let public_key = vec![0u8; 32]; // placeholder, real Ed25519 later
    let now = chrono::Utc::now().timestamp_millis();

    conn.execute(
        "INSERT INTO users (id, display_name, public_key, is_local, created_at)
         VALUES (?1, ?2, ?3, 1, ?4)",
        rusqlite::params![id, display_name, public_key, now],
    )
    .map_err(|e| e.to_string())?;

    Ok(User {
        id,
        display_name,
        public_key,
        avatar_path: None,
        is_local: true,
        created_at: now,
        bio: None,
        pronouns: None,
        handle: None,
    })
}
```

Specifically:
1. A UUID v4 is generated as your user ID.
2. A placeholder 32-byte public key is stored (full Ed25519 generation is a planned enhancement).
3. The user record is inserted into the `users` table with `is_local = 1` (indicating this is the local machine's owner).
4. The user object is returned to the frontend, which navigates to the next onboarding step.

### The Local User Check

Before showing the onboarding flow, the app checks if a local user exists:

```rust
// From apps/desktop/src-tauri/src/commands/user.rs
#[tauri::command]
pub fn get_local_user(db: State<Database>) -> Result<Option<User>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    conn.query_row(
        "SELECT id, display_name, public_key, avatar_path, is_local,
                created_at, bio, pronouns, handle
         FROM users WHERE is_local = 1 LIMIT 1",
        [],
        |row| {
            Ok(User {
                id: row.get(0)?,
                display_name: row.get(1)?,
                public_key: row.get(2)?,
                avatar_path: row.get(3)?,
                is_local: row.get::<_, i32>(4)? != 0,
                created_at: row.get(5)?,
                bio: row.get(6)?,
                pronouns: row.get(7)?,
                handle: row.get(8)?,
            })
        },
    )
    .map(Some)
    .or_else(|e| {
        if e == rusqlite::Error::QueryReturnedNoRows {
            Ok(None) // No local user — show onboarding
        } else {
            Err(e.to_string())
        }
    })
}
```

### Security Properties

Your Ed25519 keypair provides:
- **Authentication**: Messages signed with your private key can be verified by anyone with your public key.
- **Non-repudiation**: You cannot deny having sent a signed message (the signature is unique to your key).
- **Integrity**: Any tampering with a signed message invalidates the signature.
- **Portability**: Your keypair can be exported and imported on another machine (see backup section).

### Key Management Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Generate     │────►│  Store Public │────►│  Store Private│
│  Ed25519      │     │  Key in DB    │     │  Key Secure   │
│  Keypair      │     │  (plaintext)  │     │  (encrypted)  │
└──────────────┘     └──────────────┘     └──────────────┘
                                                    │
                          ┌─────────────────────────┤
                          │              ┌──────────┘
                          ▼              ▼
                    ┌──────────┐  ┌──────────┐
                    │ Windows  │  │  macOS   │
                    │  DPAPI   │  │ Keychain │
                    └──────────┘  └──────────┘
```

---

## Step 4: Meet Liber AI

After identity creation, the onboarding introduces **Liber**, the built-in AI assistant.

### Liber Introduction Screen

1. A chat bubble appears showing a greeting from Liber: *"Hi! I'm Liber. I can summarize channels, answer questions, analyze whiteboards, and help with documents. Ask me anything with @Liber."*
2. You can click **"Say hello to Liber"** to see a personalized greeting.
3. Click **Continue** to proceed.

### How Liber Works

Liber runs entirely on your local machine. By default, Liber uses `MockEngine`, which provides canned responses without requiring a model file. For full AI capabilities, you can download the Qwen 2.5 1.5B Instruct GGUF model (~1.1 GB).

The AI engine architecture is pluggable:
- `MockEngine` — Default. No model file needed. Returns pre-written responses.
- `CandleEngine` — Full AI. Runs Qwen via llama.cpp CLI. Requires model download.

### MockEngine Implementation

```rust
// crates/libern-core/src/ai/engine.rs
impl AiEngine for MockEngine {
    fn infer(&mut self, request: InferenceRequest) -> Result<(), String> {
        let canned = format!(
            "I'm Liber, your local AI assistant. I see you asked: \"{}\"\n\n\
             Here's a mock response for development. In production, \
             I'll run on Qwen 2.5 1.5B Q4_K_M GGUF.",
            request.prompt.chars().take(80).collect::<String>()
        );

        // Simulate streaming by sending word-by-word
        for word in canned.split(' ') {
            (request.callback)(TokenEvent {
                token: format!("{} ", word),
                done: false,
                full_response: None,
            });
        }
        (request.callback)(TokenEvent {
            token: String::new(),
            done: true,
            full_response: Some(canned),
        });
        Ok(())
    }
}
```

You can skip the model download during onboarding and download it later from the Settings page.

---

## Step 5: Complete Onboarding

The final step of onboarding offers you two paths:
1. **Create a Server** — Start your own server from scratch.
2. **Join with Invite** — Join an existing server using an invite code.

Choose one based on your needs. If you are unsure, click **"Create a Server"** to create a personal server where you can explore the interface.

Click **"Finish"** to complete onboarding.

### Onboarding Flow Diagram

```
┌─────────────┐
│  Welcome    │
│  Screen     │─────► [Get Started]
└─────────────┘
       │
       ▼
┌─────────────┐
│  Identity   │─────► [Enter Display Name]
│  Creation   │
└─────────────┘
       │
       ▼
┌─────────────┐
│  Liber AI   │─────► [Say Hello / Continue]
│  Intro      │
└─────────────┘
       │
       ▼
┌─────────────────────┐
│  Create or Join     │─────► [Create Server] or [Join with Invite]
│  Server             │
└─────────────────────┘
       │
       ▼
┌─────────────┐
│  Complete!  │─────► [Finish] → Main Interface
└─────────────┘
```

---

## Step 6: Profile Setup

After completing onboarding, you can further customize your profile.

### Access Profile Settings

1. Click your avatar or name in the **UserPanel** at the bottom-left of the main interface.
2. Select **"Profile"** from the context menu.
3. The profile settings panel opens.

```
┌──────────────────────────────────────────────────────┐
│ UserPanel                                             │
│ ┌──────┐                                              │
│ │Avatar│  DisplayName                                 │
│ │      │  ● Online                                    │
│ └──────┘  [🎤] [🔊] [⚙️]                            │
└──────────────────────────────────────────────────────┘
```

### Update Display Name

```typescript
import { updateProfile } from "./lib/api";

await updateProfile({
    display_name: "New Name",
    bio: "Your bio here",
    pronouns: "they/them",
});
```

The `update_profile` Tauri command updates your user record in the `users` table:

```typescript
// From apps/desktop/src/lib/api.ts
export const updateProfile = (
    userId: string,
    bio?: string,
    pronouns?: string,
    handle?: string,
    displayName?: string,
) => invoke<void>("update_profile", { userId, bio, pronouns, handle, displayName });
```

### Set an Avatar

1. In the profile settings, click the avatar area.
2. Select an image file from your system (PNG, JPEG, or GIF recommended).
3. The image is stored locally in the app data directory's `avatars/` folder.
4. The path is saved in the `users` table's `avatar_path` field.

### Set a Handle

Handles are unique identifiers within a server (like `@username`):

```typescript
import { checkHandle, updateProfile } from "./lib/api";

// Check if a handle is available
const available = await checkHandle("myhandle", serverId);

// Set your handle
await updateProfile({ handle: "myhandle" });
```

The `check_handle` command verifies uniqueness within a server. If the handle is already taken, you will receive an error message and can choose a different one.

### Bio and Pronouns

Your bio and pronouns are displayed in your profile card that other users can see by clicking your name or avatar.

---

## Step 7: Understanding Your Data

All your data is stored locally. Here is where everything lives:

### App Data Directory

| Platform | Path |
|----------|------|
| Windows | `%APPDATA%\com.libern.app\data` |
| macOS | `~/Library/Application Support/com.libern.app` |
| Linux | `~/.local/share/com.libern.app` |

### Directory Contents

```
{app_data}/
├── libern.db              # SQLite database (all structured data)
├── keys/                  # Encrypted private keys
│   └── {user_id}.key     # Your Ed25519 private key (encrypted)
├── avatars/               # User avatar images
├── attachments/           # Message file attachments
├── models/                # AI model files
│   └── Qwen2-VL-2B-Instruct-Q4_K_M.gguf  # ~1.1 GB
├── bin/                   # Supporting binaries
│   └── llama-cli.exe      # llama.cpp CLI (Windows)
├── aioss/                 # Sealed .aioss ledger files
│   ├── chat/              # Chat session ledgers
│   ├── system/            # System session ledgers
│   └── ai/                # AI session ledgers
└── cache/                 # Temporary cache files
```

### The SQLite Database

The `libern.db` file contains all your structured data:

| Table | Purpose |
|-------|---------|
| `users` | User identities (yours and known peers) |
| `servers` | Server definitions |
| `channels` | Channel definitions within servers |
| `messages` | All chat messages |
| `roles` | Server roles with permission bitmasks |
| `role_assignments` | User-to-role mappings |
| `invites` | Invite codes for joining servers |
| `message_reactions` | Emoji reactions on messages |
| `pinned_messages` | Pinned messages in channels |
| `starred_messages` | Starred messages by users |
| `starboard_config` | Starboard configuration per server |
| `user_xp` | XP and levels per user per server |
| `casino_balances` | Casino game balances |
| `prediction_markets` | Prediction market definitions |
| `prediction_bets` | Bets placed on prediction markets |
| `marketplace_items` | Marketplace published items |
| `marketplace_likes` | Item likes |
| `ai_conversations` | AI conversation history |
| `ai_feedback` | RLHF rating feedback |
| `server_stats` | Per-server statistics |
| `attachments` | File attachment metadata |
| `whiteboard_strokes` | Whiteboard canvas strokes |
| `world_decals` | 3D world decals |
| `audio_nodes` | 3D world audio nodes |
| `documents` | RAG document metadata |
| `aioss_sessions` | .aioss ledger session entries |
| `polls` | Poll definitions |
| `poll_votes` | Poll votes |
| `quiz_scores` | Quiz command scores |
| `voice_sessions` | Voice chat session records |

---

## Step 8: Export and Backup Your Identity

Your identity is the most important thing to back up. Without your private key, you cannot prove ownership of your messages or servers.

### Export Your Keypair

```typescript
import { exportIdentity } from "./lib/api";

// Export your keypair as an encrypted JSON file
const exportData = await exportIdentity(password);
// saveAs(exportData, "libern-identity.json");
```

The exported file contains:
- Your user ID
- Your encrypted private key (encrypted with the provided password using AES-256-GCM)
- Your public key
- Your display name

### Import Your Keypair on Another Machine

1. Install Libern on the new machine.
2. During onboarding, look for the **"Import Identity"** option.
3. Select your exported JSON file.
4. Enter the password you used during export.
5. Your identity is restored, including your display name and keypair.

### Backup the Full App Data

For a complete backup, copy the entire app data directory:

```bash
# Windows (PowerShell)
Copy-Item -Recurse "$env:APPDATA\com.libern.app\data" "D:\backups\libern-backup"

# macOS / Linux
cp -r ~/Library/Application\ Support/com.libern.app ~/backups/libern-backup
```

Your `.aioss` ledger files and all messages are included in this backup.

### Per-Platform Backup Commands

**Windows (PowerShell script)**:
```powershell
$backupDir = "D:\backups\libern-$(Get-Date -Format 'yyyyMMdd')"
New-Item -ItemType Directory -Path $backupDir -Force
Copy-Item -Recurse "$env:APPDATA\com.libern.app\data\*" $backupDir
Write-Output "Backup saved to: $backupDir"
```

**macOS / Linux (cron-ready)**:
```bash
#!/bin/bash
BACKUP_DIR="$HOME/backups/libern"
mkdir -p "$BACKUP_DIR"
cp -r "$HOME/Library/Application Support/com.libern.app" "$BACKUP_DIR/libern-$(date +%Y%m%d)"
echo "Backup complete: $BACKUP_DIR"
```

---

## Step 9: Security Best Practices

1. **Never share your private key.** Libern never asks for it. Anyone with your private key can impersonate you.
2. **Use a strong password** for key export. The exported file is encrypted with AES-256-GCM, but a weak password undermines this protection.
3. **Keep backups.** If your database becomes corrupted and you have no backup, your identity and server data could be lost.
4. **Verify peer identities.** In Libern, a user's identity is their Ed25519 public key. Always verify public keys out-of-band (e.g., read the fingerprint to each other over voice) if trust is required.
5. **Lock your screen.** Since Libern stores your private key in an accessible location (encrypted), physical access to your machine could allow someone to attempt decryption.
6. **Verify checksums.** Always verify the SHA-256 checksum of downloaded installers to ensure they haven't been tampered with.
7. **Keep Libern updated.** New releases include security patches and improvements. Check for updates regularly.

### Security Threat Model

```
┌─────────────────────────────────────────┐
│           Threat Model                   │
├─────────────────────────────────────────┤
│                                          │
│  Assumptions:                            │
│  • User's OS is trusted                  │
│  • Physical access = full compromise     │
│  • LAN is trusted (P2P sync in plaintext)│
│  • No cloud intermediaries               │
│                                          │
│  Mitigations:                            │
│  • Private keys encrypted at rest        │
│  • .aioss provides tamper evidence       │
│  • Ed25519 signatures for authenticity   │
│  • No network attack surface (offline)   │
│                                          │
└─────────────────────────────────────────┘
```

---

## Step 10: Troubleshooting Identity Issues

| Problem | Solution |
|---------|----------|
| "No local user found" | Run through onboarding again. The `create_user` command will generate a new keypair. |
| "Cannot find my old identity" | If you reinstalled Libern without backing up, your old identity is lost. Always export your keypair before reinstalling. |
| "Forgot export password" | The exported identity file cannot be decrypted without the correct password. There is no recovery mechanism by design. |
| "Keypair file corrupted" | Restore from backup. If no backup exists, create a new identity — you will lose access to your previous servers and messages. |
| "Cannot import identity" | Ensure the exported file is valid JSON and the password is correct. Check that the file was not truncated during transfer. |
| "Another user has my display name" | Display names are not unique. Libern identifies users by their Ed25519 public key, not their display name. |
| "Database locked" | Close other Libern instances. Only one instance can access the database at a time. |
| "Installation fails on Windows" | Ensure you have administrator privileges. Check that no previous version is running. |
| "AppImage fails to run on Linux" | Ensure FUSE is installed: `sudo apt-get install fuse`. Try adding `--no-sandbox` flag. |
| "macOS says app is damaged" | Remove the quarantine attribute: `xattr -cr /Applications/Libern.app` |

### Common Onboarding Errors

If you encounter issues during the onboarding flow, check the developer console:
- **Windows/Linux**: Press `Ctrl+Shift+I` to open DevTools
- **macOS**: Press `Cmd+Option+I` to open DevTools

Look for errors in the console tab. Common issues include:
- Database permission errors (run as administrator if on Windows)
- Missing `data` directory (check app data path exists)
- Port conflicts (if another instance is running)

---

## Step 11: Advanced Identity Management

### Multiple Identities on One Machine

Libern supports only one local identity per machine by default. If you need multiple identities (e.g., for testing), you can:
1. Back up your current identity using the export feature.
2. Delete the local user record from the database (advanced).
3. Restart Libern and go through onboarding again.

### Viewing Your Public Key Fingerprint

```typescript
import { getLocalUser } from "./lib/api";

const user = await getLocalUser();
if (user) {
    const fingerprint = user.public_key
        .slice(0, 8)
        .map(b => b.toString(16).padStart(2, "0"))
        .join(":");
    console.log(`Public key fingerprint: ${fingerprint}`);
}
```

### Identity File Location (Advanced)

The local user record is stored in the SQLite database. You can inspect it with any SQLite browser:
```bash
sqlite3 "$env:APPDATA\com.libern.app\data\libern.db" "SELECT id, display_name, is_local FROM users;"
```

---

## Next Steps

Now that you have created your identity and completed onboarding, proceed to:

- **How-To Guide 02**: Joining a Server — Join via invite code, create a server, explore the interface
- **How-To Guide 03**: Sending Messages — Text chat, markdown formatting, file attachments, emoji

────────────────────────────────────────────────────────────────

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.
