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
Document ID: DEV-001
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Setting Up the Development Environment

## Introduction

Libern is a Tauri v2 desktop application with a Rust backend and a React+TypeScript frontend. This guide walks you through setting up a complete development environment, from cloning the repository to running Libern in development mode and building from source.

The project uses a pnpm workspace monorepo structure with a Rust backend (`apps/desktop/src-tauri/`), a shared core library (`crates/libern-core/`), an AI-operating session store library (`crates/libern-aioss/`), and a React+TypeScript frontend (`apps/desktop/src/`).

By the end of this guide, you will have:
- The Libern repository cloned and all dependencies installed
- A working Rust toolchain for compiling the backend
- Node.js and pnpm configured for the frontend
- The ability to run `pnpm tauri dev` and see Libern running locally
- Knowledge of the project structure and build configuration
- Tooling for debugging, linting, and testing

---

## Prerequisites

| Tool | Minimum Version | Purpose |
|------|----------------|---------|
| Rust | 1.80+ | Backend compilation |
| Node.js | 20+ | Frontend tooling |
| pnpm | 9+ | Package management |
| Git | 2.30+ | Version control |

### System-Specific Requirements

**Windows**:
- Visual Studio 2022 Build Tools with "Desktop development with C++" workload
- WiX Toolset v3 (for MSI installer builds)
- Windows SDK (included with VS Build Tools)

**macOS**:
- Xcode Command Line Tools (`xcode-select --install`)
- macOS 12+ (Monterey or later)

**Linux (Ubuntu/Debian)**:
```bash
sudo apt-get update
sudo apt-get install -y \
    build-essential pkg-config libssl-dev \
    libasound2-dev libwebkit2gtk-4.1-dev \
    libgtk-3-dev libayatana-appindicator3-dev \
    librsvg2-dev libopus-dev
```

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/libern/libern.git
cd libern
```

The repository uses a pnpm workspace monorepo structure:

```
libern/
├── package.json                    # pnpm workspace root
├── pnpm-workspace.yaml
├── apps/
│   ├── desktop/                    # Tauri desktop application
│   │   ├── package.json
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── src/                    # React frontend
│   │   └── src-tauri/              # Rust backend
│   └── sandbox/                    # 3D world sandbox (separate binary)
├── crates/
│   ├── libern-core/                # Shared core library
│   └── libern-aioss/               # .aioss ledger format library
├── installer/
│   └── native/                     # Native installer (WiX build script)
└── docs/                           # Documentation
```

---

## Step 2: Install the Rust Toolchain

### Install rustup

If you don't have Rust installed, install `rustup` first:

**Windows**: Download and run `rustup-init.exe` from https://rustup.rs

**macOS/Linux**:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Set the Toolchain

Libern targets the stable Rust toolchain:

```bash
rustup default stable
rustup update
```

### Verify Rust Installation

```bash
rustc --version   # Should show rustc 1.80.0 or later
cargo --version   # Should show cargo 1.80.0 or later
```

### Required Rust Targets

For cross-compilation (building MSI installer on Linux, etc.), add the appropriate targets:

```bash
# Windows MSI builds
rustup target add x86_64-pc-windows-msvc

# macOS ARM builds
rustup target add aarch64-apple-darwin

# Linux builds
rustup target add x86_64-unknown-linux-gnu
```

### System Dependencies

**Windows**: Install Visual Studio 2022 Build Tools with the "Desktop development with C++" workload. The MSVC toolchain is required for `cpal` (audio) and `rusqlite` (SQLite) compilation.

**macOS**: Install Xcode Command Line Tools:
```bash
xcode-select --install
```

**Linux (Ubuntu/Debian)**:
```bash
sudo apt-get update
sudo apt-get install -y \
    build-essential \
    pkg-config \
    libssl-dev \
    libasound2-dev \
    libwebkit2gtk-4.1-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    libopus-dev
```

**Linux (Fedora)**:
```bash
sudo dnf install -y \
    gcc-c++ \
    pkgconfig \
    openssl-devel \
    alsa-lib-devel \
    webkit2gtk4.1-devel \
    gtk3-devel \
    libappindicator-gtk3-devel \
    librsvg2-devel \
    opus-devel
```

---

## Step 3: Install Node.js and pnpm

### Install Node.js

**Windows/macOS**: Download from https://nodejs.org (LTS version 20+).

**Linux**:
```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20
nvm use 20

# Or using package manager
sudo apt-get install -y nodejs npm  # Debian/Ubuntu
```

### Install pnpm

```bash
# Using npm (recommended)
npm install -g pnpm

# Or using corepack (Node.js 20+)
corepack enable
corepack prepare pnpm@latest --activate
```

### Verify

```bash
node --version   # Should show v20.x.x or later
pnpm --version   # Should show 9.x.x or later
```

---

## Step 4: Install npm Dependencies

```bash
cd libern
pnpm install
```

This installs all workspace dependencies, including:

| Package | Purpose |
|---------|---------|
| `@tauri-apps/api` | Tauri IPC bindings |
| `@tauri-apps/cli` | Tauri CLI for building |
| `react`, `react-dom` | UI framework |
| `typescript` | Type checking |
| `vite` | Build tool |
| `tailwindcss` | CSS framework |
| `framer-motion` | Animations |
| `zustand` | State management |
| `@tanstack/react-query` | Server state management |
| `fabric` | Canvas/whiteboard library |

---

## Step 5: Run in Development Mode

```bash
cd apps/desktop
pnpm tauri dev
```

This command:
1. Starts the Vite dev server for the frontend (hot module replacement enabled).
2. Compiles the Rust backend in debug mode.
3. Opens a Libern window connected to the dev server.

### What to Expect

First build will take longer (Rust compilation). Subsequent builds are faster due to incremental compilation and cargo caching.

- **Frontend changes**: Hot-reloaded instantly (Vite HMR).
- **Rust changes**: Require a rebuild (Tauri watches for changes and recompiles automatically).
- **Port**: The Vite dev server runs on port 1420 by default.

### Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `TAURI_DEV_HOST` | Dev server host | `localhost` |
| `TAURI_DEV_PORT` | Dev server port | `1420` |
| `RUST_LOG` | Backend log level | `info` |
| `TAURI_DEVTOOLS` | Enable DevTools | `false` |
| `LIBN_AI_MODEL_PATH` | Custom AI model path | `{app_data}/models/Qwen2-VL-2B-Instruct-Q4_K_M.gguf` |

### DevTools

To enable the browser DevTools in the Tauri window:

1. Set `TAURI_DEVTOOLS=true` in your environment:
   ```bash
   # Windows (PowerShell)
   $env:TAURI_DEVTOOLS="true"
   
   # macOS/Linux
   export TAURI_DEVTOOLS=true
   ```

2. Then press `Ctrl+Shift+I` to open DevTools.

### Vite Configuration

The Vite config is at `apps/desktop/vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    clearScreen: false,
    server: {
        port: 1420,
        strictPort: true,
        watch: {
            ignored: ["**/src-tauri/**"],
        },
    },
});
```

---

## Step 6: Build from Source

### Debug Build

```bash
cd apps/desktop
pnpm tauri build --debug
```

Output: `apps/desktop/src-tauri/target/debug/libern-desktop.exe`

### Release Build

```bash
cd apps/desktop
pnpm tauri build
```

Output: `apps/desktop/src-tauri/target/release/libern-desktop.exe`

The release build:
- Compiles with optimizations (release mode).
- Bundles the frontend into static files.
- Packages into a platform-specific installer (MSI on Windows, DMG on macOS, AppImage on Linux).

### Build Flags

| Flag | Purpose |
|------|---------|
| `--debug` | Debug build (faster compile, slower runtime) |
| `--release` | Release build (slower compile, optimized runtime) |
| `--target` | Cross-compile target (e.g., `x86_64-pc-windows-msvc`) |
| `--bundles` | Bundle format (e.g., `msi`, `dmg`, `appimage`) |

### Build Output Structure

After a successful release build:

```
apps/desktop/src-tauri/target/release/
├── libern-desktop.exe              # Main binary
├── libern-desktop.dSYM/            # Debug symbols (macOS)
├── build/                          # Build artifacts
└── bundle/
    ├── msi/
    │   └── Libern_0.1.0_x64_en-US.msi
    ├── dmg/
    │   └── Libern_0.1.0_x64.dmg
    ├── appimage/
    │   └── libern_0.1.0_amd64.AppImage
    └── deb/
        └── libern_0.1.0_amd64.deb
```

---

## Step 7: Project Structure (Detailed)

### Backend (Rust) — `apps/desktop/src-tauri/`

```
src-tauri/
├── Cargo.toml              # Rust dependencies and metadata
├── tauri.conf.json         # Tauri configuration (window, permissions, bundles)
├── capabilities/           # Tauri v2 capability permissions
├── icons/                  # Application icons (various sizes)
├── binaries/               # Bundled native binaries (llama-cli.exe)
├── build.rs                # Build script (embeds Windows icon)
├── tests/
│   └── integration.rs      # Integration tests
└── src/
    ├── main.rs             # Program entry point
    ├── lib.rs              # App builder, plugin registration, command handler
    └── commands/           # Tauri command modules
        ├── mod.rs          # Module declarations
        ├── server.rs       # Server CRUD commands
        ├── channel.rs      # Channel CRUD commands
        ├── message.rs      # Message CRUD and search commands
        ├── user.rs         # User identity commands
        ├── role.rs         # Role and permission commands
        ├── invite.rs       # Invite code commands
        ├── ai.rs           # AI/LLM commands
        ├── aioss.rs        # .aioss ledger commands
        ├── marketplace.rs  # Marketplace commands
        ├── installer.rs    # Model download commands
        ├── profile.rs      # Profile update commands
        ├── reaction.rs     # Emoji reaction commands
        ├── pins.rs         # Pinned message commands
        ├── stars.rs        # Starred message commands
        ├── xp.rs           # XP and level commands
        ├── games.rs        # Casino game commands
        ├── predictions.rs  # Prediction market commands
        └── stats.rs        # Server statistics commands
```

### Core Library — `crates/libern-core/`

```
libern-core/
├── Cargo.toml
└── src/
    ├── lib.rs              # Module declarations
    ├── ai/                 # AI engine subsystem
    │   ├── mod.rs          # AiEngine trait, TokenEvent, InferenceRequest
    │   ├── engine.rs       # MockEngine implementation
    │   ├── qwen_engine.rs  # CandleEngine (Qwen via llama.cpp)
    │   ├── pipeline.rs     # Prompt construction
    │   ├── conversation.rs # Context management
    │   ├── rag.rs          # RAG document indexing
    │   ├── moderator.rs    # Content moderation
    │   ├── summarizer.rs   # Channel summarization
    │   ├── reward.rs       # RLHF feedback system
    │   └── liber_user.rs   # Liber system user
    ├── crdt/               # CRDT synchronization
    │   ├── mod.rs
    │   ├── hlc.rs          # Hybrid Logical Clock
    │   └── lww_set.rs      # LWW Element Set
    ├── crypto/             # Cryptographic operations
    │   ├── mod.rs
    │   └── keys.rs         # Ed25519 key generation
    └── db/                 # Database layer
        ├── mod.rs
        ├── schema.rs       # Table definitions and migrations
        └── models.rs       # Rust struct definitions
```

### AIOSS Library — `crates/libern-aioss/`

```
libern-aioss/
├── Cargo.toml
└── src/
    ├── lib.rs
    ├── header.rs           # AiossHeader (128 bytes)
    ├── entry.rs            # AiossEntry (256 bytes)
    ├── ledger.rs           # Binary and JSON ledger types
    ├── verify.rs           # Verification logic
    ├── schedule.rs         # AiossScheduler
    └── state_proof.rs      # Ed25519 state proof
```

### Frontend (React + TypeScript) — `apps/desktop/src/`

```
src/
├── main.tsx                # React entry point
├── App.tsx                 # Root component
├── index.css               # Global styles + Tailwind
├── components/
│   ├── ui/                 # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   └── Avatar.tsx
│   ├── layout/             # App shell
│   │   ├── ServerListSidebar.tsx
│   │   ├── ChannelSidebar.tsx
│   │   ├── MainContentArea.tsx
│   │   └── UserPanel.tsx
│   ├── chat/               # Chat functionality
│   │   ├── MessageInput.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageContent.tsx
│   │   └── SlashCommands.tsx
│   ├── server/             # Server management
│   │   ├── CreateServerModal.tsx
│   │   └── ServerSettings.tsx
│   ├── marketplace/        # Marketplace
│   │   ├── MarketplacePage.tsx
│   │   └── PublishDialog.tsx
│   ├── whiteboard/         # Whiteboard canvas
│   │   └── WhiteboardCanvas.tsx
│   ├── compliance/         # Compliance dashboard
│   │   └── ComplianceDashboard.tsx
│   ├── levels/             # XP and leaderboard
│   │   ├── LevelBadge.tsx
│   │   └── Leaderboard.tsx
│   ├── ai/                 # AI components
│   │   └── LiberMessageBubble.tsx
│   ├── onboarding/         # Onboarding flow
│   │   └── OnboardingFlow.tsx
│   └── profile/            # Profile components
│       └── ProfilePanel.tsx
├── hooks/                  # Custom React hooks
│   ├── useLiberStream.ts
│   └── useAiStatus.ts
├── stores/                 # Zustand state stores
│   ├── uiStore.ts
│   ├── serverStore.ts
│   ├── messageStore.ts
│   └── aiStore.ts
├── lib/                    # API layer (Tauri invoke wrappers)
│   ├── api.ts              # All command wrappers
│   └── ai.ts               # AI-specific wrappers
├── types/                  # TypeScript type definitions
│   └── index.ts
└── styles/
    └── liber.css           # Liber-specific styles
```

---

## Step 8: Tauri Configuration

The `tauri.conf.json` file at `apps/desktop/src-tauri/tauri.conf.json` contains:

```json
{
    "productName": "Libern",
    "version": "0.1.0",
    "identifier": "com.libern.app",
    "build": {
        "frontendDist": "../dist",
        "devUrl": "http://localhost:1420",
        "beforeDevCommand": "pnpm dev",
        "beforeBuildCommand": "pnpm build"
    },
    "app": {
        "windows": [
            {
                "title": "Libern",
                "width": 1280,
                "height": 800,
                "minWidth": 900,
                "minHeight": 600,
                "resizable": true,
                "fullscreen": false
            }
        ],
        "security": {
            "csp": null
        }
    },
    "bundle": {
        "active": true,
        "targets": "all",
        "icon": [
            "icons/32x32.png",
            "icons/128x128.png",
            "icons/128x128@2x.png",
            "icons/icon.icns",
            "icons/icon.ico"
        ],
        "windows": {
            "wix": {
                "language": "en-US"
            }
        },
        "macOS": {
            "minimumSystemVersion": "12.0"
        },
        "linux": {
            "deb": {
                "depends": []
            }
        }
    }
}
```

---

## Step 9: Available pnpm Scripts

```bash
# Development
pnpm dev              # Start Vite dev server
pnpm tauri dev        # Run full Tauri dev environment

# Building
pnpm build            # Build frontend only (Vite)
pnpm tauri build      # Build complete application

# Linting and Formatting
pnpm lint             # Run ESLint
pnpm format           # Run Prettier
pnpm typecheck        # Run TypeScript type checking

# Testing
pnpm test             # Run frontend tests (vitest)
pnpm test:e2e         # Run end-to-end tests (Playwright)

# Rust
pnpm cargo:build      # Build Rust backend only
pnpm cargo:test       # Run Rust unit tests
pnpm cargo:clippy     # Run Clippy linter
```

---

## Step 10: Recommended Tools

### Editor: VS Code

Recommended extensions:
- `rust-lang.rust-analyzer` — Rust language support
- `tauri-apps.tauri-vscode` — Tauri integration
- `bradlc.vscode-tailwindcss` — Tailwind CSS intellisense
- `dbaeumer.vscode-eslint` — ESLint
- `esbenp.prettier-vscode` — Prettier formatter
- `github.vscode-github-actions` — GitHub Actions workflow support

### Rust Development Tools

```bash
# Install useful Rust tools
cargo install cargo-watch       # Auto-rebuild on changes
cargo install cargo-edit        # Manage dependencies from CLI
cargo install cargo-tarpaulin   # Code coverage
cargo install cargo-audit       # Security vulnerability scanning
cargo install sccache           # Compilation cache (speeds up rebuilds)
```

### Debugging

- **Rust**: Use `println!` macros or set `RUST_LOG=debug` for verbose logging.
- **Frontend**: Use the browser DevTools (Ctrl+Shift+I in the Libern window).
- **Tauri**: Enable DevTools in environment with `TAURI_DEVTOOLS=true`.

### Using sccache

```bash
# Install sccache
cargo install sccache

# Configure cargo to use it
# In ~/.cargo/config.toml:
# [build]
# rustc-wrapper = "sccache"
```

---

## Step 11: Troubleshooting Development Setup

| Problem | Solution |
|---------|----------|
| `pnpm tauri dev` fails with "rustc not found" | Install Rust toolchain via rustup. Verify with `rustc --version`. |
| "Could not find `Cargo.toml`" | Ensure you are in the `apps/desktop` directory when running `pnpm tauri dev`. |
| "linker not found" | Install Visual Studio Build Tools (Windows), Xcode CLT (macOS), or build-essential (Linux). |
| WebKitGTK not found (Linux) | Install `libwebkit2gtk-4.1-dev` and `libgtk-3-dev`. |
| "permission denied" on binary | Ensure the binary directory has write permissions. On Linux, check that build tools are installed. |
| Frontend not loading (blank screen) | Check the Vite dev server is running on port 1420. Check for errors in the browser console. |
| Rust build takes too long | Use `cargo check` instead of `cargo build` for faster feedback. Consider using `sccache`. |
| "SSL connect error" downloading crates | Ensure your network can access crates.io. Use a mirror if in a restricted network. |
| pnpm install fails with network error | Check your internet connection. Try `pnpm install --no-frozen-lockfile`. |
| Native binary (llama-cli) not found | The AI engine requires llama.cpp. Either download it manually or configure `MockEngine`. |
| "multiple packages found" when building | Ensure you are in the correct directory. The workspace has multiple packages. |
| Vite HMR not working | Check firewall settings. Vite uses WebSocket on port 1420. |
| `pnpm tauri dev` opens blank window | Check the Tauri configuration for `devUrl`. Ensure Vite is running before Tauri opens. |

---

## Next Steps

Now that your development environment is set up, proceed to:

- **How-To Guide 02**: Contributing Code — Code style, PR workflow, review process, testing
- **How-To Guide 03**: Adding Commands — How to add new Tauri commands
- **How-To Guide 04**: Modifying the Frontend — React components, Zustand stores, Tailwind styling

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com