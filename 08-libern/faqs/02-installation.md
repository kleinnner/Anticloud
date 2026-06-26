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
Document ID: FAQ-002
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Installation FAQ

## How do I install Libern?

### Windows

1. Download `Libern-Setup-x.y.z.exe` from the releases page.
2. Double-click the installer.
3. Follow the Windows Installer (WiX) prompts.
4. Libern is installed to `%LOCALAPPDATA%\Programs\libern`.
5. Launch from the Start Menu or desktop shortcut.

The WiX installer configuration is in `apps/desktop/src-tauri/wix/`.

### macOS

1. Download `Libern-x.y.z.dmg`.
2. Open the DMG and drag Libern to Applications.
3. On first launch, right-click and select **Open** to bypass Gatekeeper.
4. Subsequent launches can be from the Applications folder or Spotlight.

### Linux

1. Download `libern-x.y.z.AppImage`.
2. Make it executable: `chmod +x libern-x.y.z.AppImage`
3. Run: `./libern-x.y.z.AppImage`

Alternatively, build from source:
```bash
git clone https://github.com/libern/libern
cd libern
cargo build --release
./target/release/libern-setup
```

### Installation Decision Tree

```
Which platform?
├── Windows ──► Download .exe installer
│   ├── Run as admin if needed
│   └── Unblock if SmartScreen blocks
├── macOS ──► Download .dmg
│   ├── Drag to Applications
│   └── Right-click → Open (first time)
└── Linux ──► Download .AppImage
    ├── chmod +x
    └── Or build from source
```

---

## What are the system requirements?

### Minimum Requirements
- **OS**: Windows 10, macOS 12, or Linux (glibc 2.28+)
- **CPU**: 64-bit dual-core processor
- **RAM**: 512 MB (without AI model)
- **Storage**: 500 MB free space (without AI model)
- **Network**: Ethernet or Wi-Fi (LAN connectivity)

### Recommended Requirements
- **OS**: Windows 11, macOS 14, or Linux (glibc 2.35+)
- **CPU**: 64-bit quad-core processor (AVX2 support for AI)
- **RAM**: 4 GB (with AI model loaded)
- **Storage**: 2 GB free space (with AI model)
- **Network**: Gigabit LAN for voice chat

### AI Model Requirements
- **Model**: Qwen 2.5 1.5B Q4_K_M GGUF (~1.1 GB)
- **Runtime**: llama.cpp CLI binary
- **RAM**: ~3 GB additional during inference
- **CPU**: AVX2 support recommended for reasonable performance

### Detailed Hardware Requirements

| Component | Without AI | With AI |
|-----------|-----------|---------|
| CPU | Any x86_64 | AVX2 supported |
| RAM | 512 MB | 4 GB |
| Storage | 500 MB | 2.5 GB |
| GPU | Not required | Optional (CPU works) |
| Network | Any LAN | Gigabit recommended |

---

## What platforms are supported?

| Platform | Architecture | Support |
|----------|-------------|---------|
| Windows 10 | x86_64 | Full |
| Windows 11 | x86_64 | Full |
| macOS 12+ | x86_64 | Full |
| macOS 14+ (Apple Silicon) | ARM64 | Full |
| Ubuntu 20.04+ | x86_64 | Full |
| Debian 11+ | x86_64 | Full |
| Fedora 36+ | x86_64 | Full |
| Arch Linux | x86_64 | Community |

### Unsupported Platforms

| Platform | Reason | Workaround |
|----------|--------|------------|
| Windows ARM | Missing WebView2 support | Emulation (may be slow) |
| 32-bit OS | Tauri requires 64-bit | Use 64-bit OS |
| Android | Not supported | Use remote desktop |
| iOS | Not supported | Use remote desktop |
| Web browser | Desktop-only | No web version planned |

---

## How do I build from source?

### Prerequisites
1. **Rust toolchain** (install via rustup.rs):
   ```bash
   rustup install stable
   ```
2. **Node.js** 18+ and pnpm:
   ```bash
   npm install -g pnpm
   ```
3. **Tauri dependencies**:
   - Windows: Microsoft Visual Studio Build Tools
   - macOS: Xcode Command Line Tools
   - Linux: `libwebkit2gtk-4.1-dev`, `libappindicator3-dev`, etc.

### Build Steps
```bash
git clone https://github.com/libern/libern
cd libern

# Install frontend dependencies
cd apps/desktop
pnpm install

# Build the full application
pnpm tauri build
```

The output binary will be in:
- Windows: `apps/desktop/src-tauri/target/release/libern.exe`
- macOS: `apps/desktop/src-tauri/target/release/Libern`
- Linux: `apps/desktop/src-tauri/target/release/libern`

### Build Troubleshooting

| Issue | Solution |
|-------|----------|
| `cargo build` fails | Update Rust: `rustup update` |
| Missing C linker | Install MSVC Build Tools (Windows) or build-essential (Linux) |
| `libwebkit2gtk` not found | `sudo apt install libwebkit2gtk-4.1-dev` (Debian/Ubuntu) |
| Out of memory | `RUSTFLAGS="-C link-args=-Wl,--no-keep-memory"` or increase swap |
| pnpm not found | `npm install -g pnpm` |
| Node.js too old | Install Node.js 18+ from https://nodejs.org |

---

## Where is Libern installed?

### Application Files
| Platform | Location |
|----------|----------|
| Windows | `%LOCALAPPDATA%\Programs\libern` |
| macOS | `/Applications/Libern.app` |
| Linux (AppImage) | User-selected location |
| Linux (source) | `./target/release/` |

### User Data
| Platform | Location |
|----------|----------|
| Windows | `%APPDATA%\com.libern.app\data` |
| macOS | `~/Library/Application Support/com.libern.app` |
| Linux | `~/.local/share/com.libern.app` |

Contents of user data directory:
```
libern.db           — SQLite database (servers, channels, messages, etc.)
models/             — AI model GGUF files
  Qwen2-VL-2B-Instruct-Q4_K_M.gguf
aioss/              — Sealed .aioss ledger files
  chat/
    {session}_{ts}.aioss
    {session}_{ts}.aioss.json
bin/                — llama.cpp CLI binary
  llama-cli.exe     (or llama-cli on macOS/Linux)
logs/               — Diagnostic logs (if enabled)
cache/              — Temporary caches
```

---

## How do I uninstall Libern?

### Windows
1. Open Settings → Apps → Installed apps.
2. Find "Libern" and click Uninstall.
3. Optionally delete `%APPDATA%\com.libern.app\data` to remove all data.

### macOS
1. Drag `Libern.app` from Applications to Trash.
2. Optionally delete `~/Library/Application Support/com.libern.app`.

### Linux (AppImage)
1. Delete the AppImage file.
2. Optionally delete `~/.local/share/com.libern.app`.

---

## Can I install Libern on a USB drive?

Yes. Libern is a single binary and can be run from a USB drive. However, the app data directory will still be in the user's home directory by default. To use a portable setup, you can symlink the app data directory to the USB drive.

### Portable Setup Steps

```bash
# 1. Copy Libern binary to USB drive
# 2. Create a portable data directory on USB
mkdir /path/to/usb/libern-data

# 3. Symlink the app data directory
# Windows (PowerShell as Admin):
New-Item -ItemType SymbolicLink -Path "$env:APPDATA\com.libern.app" -Target "D:\libern-data"

# macOS:
ln -s /Volumes/USB/libern-data ~/Library/Application\ Support/com.libern.app

# Linux:
ln -s /mnt/usb/libern-data ~/.local/share/com.libern.app
```

---

## Does Libern require administrator privileges?

No. Libern runs entirely in user space and does not require admin/root privileges.

---

## How do I update Libern?

Currently, updates are manual:
1. Download the new installer/AppImage.
2. Run the installer (replaces the old version).
3. User data is preserved in the app data directory.

Automatic update support via Tauri updater is planned.

### Version Check

```bash
# Check installed version
libern --version

# Check for updates (manual)
# Visit github.com/libern/libern/releases
```

---

## What if my antivirus flags Libern?

Libern is a Tauri application. Some aggressive antivirus software may flag it because:
- It uses Tauri's webview (like many modern apps).
- The AI model downloader makes HTTP requests.
- The llama.cpp binary executes as a child process.

If this happens:
1. Verify the checksum of your download against the published SHA256.
2. Add Libern to your antivirus exclusions.
3. Report the false positive to your antivirus vendor.

### Checksum Verification

```bash
# Windows
certutil -hashfile Libern-Setup-x64.exe SHA256

# macOS/Linux
sha256sum Libern-x.y.z.AppImage
```

---

## Does Libern work without a Tauri backend?

No. The Tauri backend is essential — it handles all database operations, AI inference, CRDT sync, and .aioss ledger management. The frontend is a React SPA that communicates with the Rust backend via Tauri's IPC.

---

## Troubleshooting Installation

| Issue | Solution |
|-------|----------|
| Installer fails on Windows | Run as administrator. Check for blocked installer in Windows Defender. |
| App won't launch macOS | Right-click → Open. Gatekeeper blocks unsigned apps on first launch. |
| "libwebkit2gtk-4.1 not found" (Linux) | Install webkit2gtk: `sudo apt install libwebkit2gtk-4.1-dev` |
| Blank white screen | Check for GPU driver issues. Try launching with `--disable-gpu` flag. |
| App data not found | Check the app data directory exists. Run the app once to create it. |
| "MSI package not found" | Try direct download instead of package manager |
| Permission denied | Check file permissions, run installer as admin |
| Download corrupted | Verify SHA-256 checksum, re-download |

### Post-Installation Verification

```bash
# Verify installation
libern --version

# Check database
libern --check-db

# Run diagnostics
libern --diagnose
```

---

## Network Configuration for Installation

### Proxy Configuration

If behind a corporate proxy, the AI model download may be blocked. Configure proxy settings:

```bash
# Windows (PowerShell)
$env:HTTP_PROXY="http://proxy.company.com:8080"
$env:HTTPS_PROXY="http://proxy.company.com:8080"
$env:NO_PROXY="localhost,127.0.0.1"
./Libern.exe

# macOS/Linux
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
export NO_PROXY=localhost,127.0.0.1
./libern
```

### Offline Installation

For air-gapped environments:
1. Download installer on connected machine
2. Download AI model separately (if needed)
3. Transfer both via USB to air-gapped machine
4. Install and run without internet

---

## Installation Methods Comparison

| Method | Ease | Portable | Auto-update | Best For |
|--------|------|----------|-------------|----------|
| Windows MSI | ★★★★★ | No | Planned | Most Windows users |
| macOS DMG | ★★★★★ | No | Planned | Most Mac users |
| Linux AppImage | ★★★★☆ | Yes | No | Linux users |
| Build from source | ★★☆☆☆ | Yes | No | Developers |
| Package manager | ★★★★☆ | No | Via manager | Linux users |
| Portable ZIP | ★★★★☆ | Yes | No | USB drive users |

---

## Per-Platform Installation Scripts

### Windows (PowerShell)

```powershell
# Automated installation script
$version = "1.0.0"
$url = "https://github.com/libern/libern/releases/download/v$version/Libern-Setup-x64.exe"
$output = "$env:TEMP\Libern-Setup-x64.exe"

# Download
Invoke-WebRequest -Uri $url -OutFile $output

# Verify checksum (replace with actual hash)
$hash = Get-FileHash -Path $output -Algorithm SHA256
Write-Output "SHA256: $($hash.Hash)"

# Install silently
Start-Process -FilePath $output -ArgumentList "/quiet /norestart" -Wait

# Cleanup
Remove-Item $output
```

### macOS

```bash
#!/bin/bash
# Automated installation script
VERSION="1.0.0"
URL="https://github.com/libern/libern/releases/download/v$VERSION/Libern-$VERSION.dmg"
TEMP=$(mktemp -d)

# Download
curl -L -o "$TEMP/Libern.dmg" "$URL"

# Mount and install
hdiutil attach "$TEMP/Libern.dmg"
cp -R "/Volumes/Libern/Libern.app" /Applications/
hdiutil detach "/Volumes/Libern"

# Remove quarantine
xattr -d com.apple.quarantine /Applications/Libern.app 2>/dev/null

# Cleanup
rm -rf "$TEMP"
echo "Libern installed to /Applications"
```

### Linux

```bash
#!/bin/bash
# Automated installation script
VERSION="1.0.0"
URL="https://github.com/libern/libern/releases/download/v$VERSION/libern-$VERSION-x86_64.AppImage"
DEST="$HOME/.local/bin/libern"

# Download
curl -L -o "$DEST" "$URL"
chmod +x "$DEST"

# Add to PATH if not already
if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.bashrc"
    echo "Added ~/.local/bin to PATH in .bashrc"
fi

echo "Libern installed to $DEST"
echo "Run with: libern"
```

---

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `LIBERN_DATA_DIR` | Override app data directory | `LIBERN_DATA_DIR=/custom/path` |
| `LIBERN_DISABLE_GPU` | Disable GPU acceleration | `LIBERN_DISABLE_GPU=1` |
| `LIBERN_LOG_LEVEL` | Set log verbosity | `LIBERN_LOG_LEVEL=debug` |
| `LIBERN_PORT` | Override default port | `LIBERN_PORT=43000` |
| `LIBERN_MODEL_PATH` | Override AI model path | `LIBERN_MODEL_PATH=/path/to/model.gguf` |
| `HTTP_PROXY` | Proxy for model download | `HTTP_PROXY=http://proxy:8080` |

---

## Installation FAQ

| Question | Answer |
|----------|--------|
| Can I install on multiple machines? | Yes, each install is independent |
| Can I transfer my data? | Copy `libern.db` and `aioss/` directory |
| Is there a silent install option? | Windows: `/quiet`, macOS: script above |
| Do I need to uninstall old versions? | No, installer replaces automatically |
| Can I install without admin rights? | Yes, use portable ZIP version |
| Where are crash logs? | stdout/stderr, capture with `2>&1` |
| Can I install on an external drive? | Yes, symlink the data directory |
| What about portable mode? | Use portable ZIP or symlink data dir |
| Can I install AI model separately? | Yes, download and place in models/ |
| Is there a Docker image? | Not yet (planned) |
| Can I install on a server? | Libern is desktop-only P2P |
| What about Windows ARM? | Limited support, use x64 emulation |

---

## Cross-Platform Feature Comparison

| Feature | Windows | macOS | Linux |
|---------|---------|-------|-------|
| MSI installer | ✅ | ❌ | ❌ |
| DMG package | ❌ | ✅ | ❌ |
| AppImage | ❌ | ❌ | ✅ |
| Build from source | ✅ | ✅ | ✅ |
| Auto-update | Planned | Planned | Planned |
| Portable mode | ✅ (ZIP) | ✅ (binary) | ✅ (AppImage) |
| System tray | ✅ | ✅ | ✅ |
| Start menu shortcut | ✅ | ❌ (macOS default) | ❌ |
| Desktop shortcut | ✅ | ✅ (drag to Dock) | ✅ (.desktop file) |
| File associations | Planned | Planned | Planned |

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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

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