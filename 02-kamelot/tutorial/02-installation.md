                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                

# 02 — Installation

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. [Overview](#overview)
2. [Linux Installation](#linux-installation)
3. [Windows Installation](#windows-installation)
4. [macOS Installation](#macos-installation)
5. [Building from Source](#building-from-source)
6. [Installing Dependencies](#installing-dependencies)
7. [Post-Installation Verification](#post-installation-verification)
8. [Troubleshooting Installations](#troubleshooting-installations)
9. [Uninstalling Kamelot](#uninstalling-kamelot)
10. [Upgrading](#upgrading)

---

## Overview

Kamelot is distributed as a single statically-linked binary called `kml`. The binary bundles the core engine, CLI, and all necessary Rust runtime components. The GPU canvas UI (`kamelot-ui`) is a separate binary that can be installed alongside the CLI.

### What Gets Installed

| Component | Binary | Size | Notes |
|-----------|--------|------|-------|
| CLI | `kml` | ~12 MB | Core command-line tool |
| GPU Canvas | `kamelot-ui` | ~8 MB | Native GPU-rendered UI (optional) |
| Shell Completions | `kml.{bash,zsh,fish}` | ~50 KB | Tab-completion files |
| Man Pages | `kml.1` | ~15 KB | Manual pages |

### External Dependencies

Kamelot depends on two external services that are NOT bundled:

1. **Qdrant** — Vector database for embedding storage and search
2. **Ollama** — Local LLM runtime for embedding generation

Both are installed separately. Detailed instructions for each are provided below.

### Network Access During Installation

- Kamelot binary: ~12 MB download
- Qdrant Docker image: ~180 MB download
- Ollama installer: ~300 MB
- Qwen 2 VL model: ~1.6 GB (downloaded on first use, not during installation)
- Total first-time download: ~500 MB (excluding model)

## Linux Installation

### Prerequisites

#### Distribution Support

| Distribution | Min Version | Package Format | Notes |
|-------------|-------------|----------------|-------|
| Ubuntu | 22.04 LTS | .deb | Also works on Pop!_OS, Mint, elementary |
| Debian | 12 | .deb | |
| Fedora | 38 | .rpm | Also RHEL 9+, Rocky Linux 9+ |
| Arch Linux | Rolling | PKGBUILD/Pacman | Via AUR |
| openSUSE | Leap 15.5 | .rpm | |
| Alpine | 3.19 | None | Build from source |

#### System Libraries

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y curl ca-certificates gnupg lsb-release

# Fedora/RHEL
sudo dnf install -y curl ca-certificates gnupg

# Arch
sudo pacman -S curl ca-certificates gnupg
```

#### Vulkan Support (for GPU Canvas)

```bash
# Ubuntu/Debian
sudo apt install -y mesa-vulkan-drivers vulkan-tools

# Fedora
sudo dnf install -y mesa-vulkan-drivers vulkan-tools

# Arch
sudo pacman -S vulkan-radeon vulkan-tools  # AMD
sudo pacman -S vulkan-intel vulkan-tools    # Intel
sudo pacman -S nvidia-utils vulkan-tools    # NVIDIA

# Verify Vulkan
vulkaninfo --summary
```

### Method 1: APT Repository (Ubuntu/Debian)

```bash
# Add Kamelot repository
curl -fsSL https://kamelot.sh/gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/kamelot-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/kamelot-archive-keyring.gpg] https://apt.kamelot.sh stable main" | sudo tee /etc/apt/sources.list.d/kamelot.list

# Install
sudo apt update
sudo apt install kamelot

# Optional: GPU canvas
sudo apt install kamelot-ui
```

### Method 2: Direct .deb Download

```bash
# Download the latest .deb
curl -LO https://github.com/lois-kleinner/kamelot/releases/latest/download/kamelot_1.0.0_amd64.deb

# Install
sudo dpkg -i kamelot_1.0.0_amd64.deb

# Fix any dependency issues
sudo apt install -f
```

### Method 3: Direct .rpm Download (Fedora/RHEL)

```bash
# Download the latest .rpm
curl -LO https://github.com/lois-kleinner/kamelot/releases/latest/download/kamelot-1.0.0-1.x86_64.rpm

# Install
sudo rpm -ivh kamelot-1.0.0-1.x86_64.rpm

# Or using DNF
sudo dnf install ./kamelot-1.0.0-1.x86_64.rpm
```

### Method 4: Arch Linux (AUR)

```bash
# Using yay
yay -S kamelot

# Using paru
paru -S kamelot

# Or manual PKGBUILD
git clone https://aur.archlinux.org/kamelot.git
cd kamelot
makepkg -si
```

### Method 5: AppImage (Any Distribution)

```bash
# Download the AppImage
curl -LO https://github.com/lois-kleinner/kamelot/releases/latest/download/Kamelot-x86_64.AppImage

# Make executable
chmod +x Kamelot-x86_64.AppImage

# Run (no installation needed)
./Kamelot-x86_64.AppImage
```

For desktop integration:

```bash
# Extract and install
./Kamelot-x86_64.AppImage --appimage-extract
sudo mv squashfs-root /opt/kamelot
sudo ln -s /opt/kamelot/usr/bin/kml /usr/local/bin/kml
```

### Method 6: Homebrew (Linux)

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Kamelot
brew install lois-kleinner/tap/kamelot
```

### Method 7: Static Binary

```bash
# Download the static binary
curl -LO https://github.com/lois-kleinner/kamelot/releases/latest/download/kamelot-x86_64-unknown-linux-gnu.tar.gz

# Extract
tar xzf kamelot-x86_64-unknown-linux-gnu.tar.gz

# Move to PATH
sudo mv kml /usr/local/bin/
sudo mv kamelot-ui /usr/local/bin/  # optional

# Verify
kml --version
```

## Windows Installation

### Prerequisites

#### Windows Version

- Windows 10 22H2 or later
- Windows 11 23H2 or later (recommended)

#### WinFSP (Windows File System Proxy)

Kamelot requires WinFSP for filesystem integration features. This is optional but recommended.

```bash
# Download WinFSP
curl -LO https://github.com/winfsp/winfsp/releases/latest/download/winfsp-2.0.23075.msi

# Install (requires administrator)
msiexec /i winfsp-2.0.23075.msi /qn
```

#### Visual C++ Redistributable

```bash
# Download VC++ Redist
curl -LO https://aka.ms/vs/17/release/vc_redist.x64.exe

# Install (requires administrator)
.\vc_redist.x64.exe /install /quiet /norestart
```

#### Vulkan Support

Most modern Windows systems already have Vulkan drivers installed. Verify:

```bash
vulkaninfo
```

If the command is not found, install the Vulkan SDK from https://vulkan.lunarg.com/.

### Method 1: WiX MSI Installer (Recommended)

```bash
# Download the MSI
curl -LO https://github.com/lois-kleinner/kamelot/releases/latest/download/kamelot-1.0.0-x86_64.msi

# Install (requires administrator)
msiexec /i kamelot-1.0.0-x86_64.msi /qn
```

This installs:

- `kml.exe` in `C:\Program Files\Kamelot\bin\`
- `kamelot-ui.exe` in `C:\Program Files\Kamelot\bin\`
- Adds both to system PATH
- Creates Start Menu shortcuts
- Registers file associations (`.kml` files)
- Installs shell completions for PowerShell

### Method 2: WinGet

```bash
# Install via Windows Package Manager
winget install Kamelot.Kamelot
```

### Method 3: Scoop

```bash
# Add the bucket
scoop bucket add kamelot https://github.com/lois-kleinner/scoop-kamelot

# Install
scoop install kamelot
```

### Method 4: Chocolatey

```bash
# Install via Chocolatey
choco install kamelot
```

### Method 5: Portable Binary

```bash
# Download the ZIP
curl -LO https://github.com/lois-kleinner/kamelot/releases/latest/download/kamelot-x86_64-pc-windows-msvc.zip

# Extract
Expand-Archive -Path kamelot-x86_64-pc-windows-msvc.zip -DestinationPath C:\Kamelot

# Add to PATH (PowerShell as Administrator)
[Environment]::SetEnvironmentVariable("Path", "$env:Path;C:\Kamelot", "Machine")

# Verify
kml --version
```

### Windows Firewall

Kamelot itself does not listen on network ports. However, Qdrant (run via Docker) does. If you use Docker Desktop, it typically configures firewall rules automatically.

## macOS Installation

### Prerequisites

#### macOS Version

- macOS 14 Sonoma or later (recommended)
- macOS 13 Ventura (limited support)

#### Xcode Command Line Tools

```bash
xcode-select --install
```

#### Vulkan Support (via MoltenVK)

macOS does not natively support Vulkan. Kamelot uses MoltenVK, which translates Vulkan API calls to Metal.

```bash
# Install MoltenVK via Homebrew
brew install molten-vk
```

### Method 1: DMG Installer (Recommended)

```bash
# Download the DMG
curl -LO https://github.com/lois-kleinner/kamelot/releases/latest/download/Kamelot-1.0.0-arm64.dmg

# Mount and install
hdiutil attach Kamelot-1.0.0-arm64.dmg
cp -R /Volumes/Kamelot/Kamelot.app /Applications/
hdiutil detach /Volumes/Kamelot
```

This installs:

- `/Applications/Kamelot.app` (GPU Canvas UI)
- `/Applications/Kamelot.app/Contents/MacOS/kml` (CLI binary)
- The installer optionally creates a symlink: `sudo ln -s /Applications/Kamelot.app/Contents/MacOS/kml /usr/local/bin/kml`

### Method 2: Homebrew

```bash
# Tap the repository
brew tap lois-kleinner/tap

# Install
brew install kamelot

# Or install with UI
brew install kamelot --with-ui
```

### Method 3: Static Binary

```bash
# Download for Apple Silicon
curl -LO https://github.com/lois-kleinner/kamelot/releases/latest/download/kamelot-aarch64-apple-darwin.tar.gz

# Or for Intel Macs
curl -LO https://github.com/lois-kleinner/kamelot/releases/latest/download/kamelot-x86_64-apple-darwin.tar.gz

# Extract
tar xzf kamelot-*.tar.gz

# Move to PATH
sudo mv kml /usr/local/bin/
sudo mv kamelot-ui /usr/local/bin/  # optional
```

### macOS Code Signing

The DMG and binaries are signed with an Apple Developer ID. On first launch, you may need to:

1. Open `System Settings → Privacy & Security`
2. Scroll down to "Security"
3. Click "Open Anyway" next to "Kamelot was blocked from opening"

Alternatively, run from Terminal:

```bash
# Remove quarantine attribute
xattr -dr com.apple.quarantine /Applications/Kamelot.app
```

## Building from Source

Building from source is useful for:

- Customizing the build
- Running on unsupported architectures
- Contributing to development

### Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install build dependencies
# Ubuntu/Debian
sudo apt install -y build-essential pkg-config libssl-dev libvulkan-dev

# Fedora
sudo dnf install -y gcc-c++ pkg-config openssl-devel vulkan-devel

# macOS
brew install pkg-config openssl molten-vk

# Windows
# Install Visual Studio 2022 Build Tools with C++ workload
# Install Vulkan SDK from https://vulkan.lunarg.com/
```

### Clone and Build

```bash
# Clone the repository
git clone https://github.com/lois-kleinner/kamelot.git
cd kamelot

# Build the CLI
cargo build --release -p kamelot-cli

# Build the GPU canvas (optional)
cargo build --release -p kamelot-ui

# Build everything
cargo build --release --all
```

### Install from Source

```bash
# Install CLI only
cargo install --path crates/kamelot-cli

# Install with UI
cargo install --path crates/kamelot-cli --features ui
```

### Build Features

| Feature | Default | Description |
|---------|---------|-------------|
| `ui` | No | Build GPU canvas UI |
| `mock-embeddings` | No | Use mock embeddings for testing |
| `telemetry` | No | Optional anonymous usage stats |
| `openssl` | Yes | Use OpenSSL for TLS |
| `rustls` | No | Use Rustls for TLS (static linking) |

```bash
# Minimal build
cargo build --release --no-default-features

# Build with mock embeddings (for testing without Ollama)
cargo build --release --features mock-embeddings

# Fully static build
cargo build --release --features rustls --target x86_64-unknown-linux-musl
```

## Installing Dependencies

### Installing Qdrant

Qdrant is a vector database written in Rust. It stores and indexes embeddings.

#### Via Docker (Recommended)

```bash
# Pull the latest image
docker pull qdrant/qdrant:latest

# Run with persistent storage
docker run -d \
  --name qdrant \
  -p 6333:6333 \
  -p 6334:6334 \
  -v qdrant_storage:/qdrant/storage \
  -v qdrant_snapshots:/qdrant/snapshots \
  --restart unless-stopped \
  qdrant/qdrant:latest

# Verify
curl http://localhost:6333/health
# {"ok":true}
```

#### Via Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  qdrant:
    image: qdrant/qdrant:latest
    restart: unless-stopped
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - qdrant_storage:/qdrant/storage
      - qdrant_snapshots:/qdrant/snapshots
    environment:
      - QDRANT__SERVICE__GRPC_PORT=6334
      - QDRANT__SERVICE__HTTP_PORT=6333

volumes:
  qdrant_storage:
  qdrant_snapshots:
```

```bash
docker-compose up -d
```

#### Native Installation (Linux)

```bash
# Download Qdrant binary
curl -LO https://github.com/qdrant/qdrant/releases/latest/download/qdrant-x86_64-unknown-linux-gnu.tar.gz
tar xzf qdrant-x86_64-unknown-linux-gnu.tar.gz
sudo mv qdrant /usr/local/bin/

# Create config directory
mkdir -p ~/.config/qdrant

# Run
qdrant --config-path ~/.config/qdrant/config.yaml
```

#### Configuration for Kamelot

Create `~/.config/kamelot/config.toml`:

```toml
[qdrant]
host = "127.0.0.1"
port = 6333
tls = false
api_key = ""

[qdrant.collection]
name = "kamelot"
vector_size = 384
distance = "Cosine"
```

### Installing Ollama

Ollama manages the Qwen 2 VL model used for embedding generation and query processing.

#### Linux

```bash
# Automatic install script
curl -fsSL https://ollama.com/install.sh | sh

# Or via Homebrew
brew install ollama
```

#### macOS

```bash
# Download DMG from https://ollama.com/download
# Or via Homebrew
brew install ollama
```

#### Windows

```bash
# Download installer from https://ollama.com/download
# Run the installer
```

#### Starting Ollama

```bash
# Start Ollama service
ollama serve

# In another terminal, pull the model
ollama pull qwen2-vl:2b

# Verify
ollama list
# NAME            ID              SIZE    MODIFIED
# qwen2-vl:2b     abc123...       1.6 GB  1 minute ago
```

#### Running Ollama as a Service (Linux)

```bash
# Systemd service
sudo systemctl enable ollama
sudo systemctl start ollama
sudo systemctl status ollama
```

#### Configuration for Kamelot

```toml
[ollama]
host = "http://127.0.0.1:11434"
model = "qwen2-vl:2b"
timeout = 60
```

### Installing Docker (if needed)

If you don't have Docker installed:

#### Linux

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker run hello-world
```

#### Windows

Download and install Docker Desktop from https://www.docker.com/products/docker-desktop/

#### macOS

```bash
brew install --cask docker
# Or download from https://www.docker.com/products/docker-desktop/
```

## Post-Installation Verification

### Step 1: Check Kamelot Version

```bash
kml --version
```

Expected output:
```
kamelot 1.0.0 (rev abcdef1, 2026-06-19)
```

### Step 2: Check All Commands

```bash
kml --help
```

Verify you see all subcommands: `init`, `put`, `get`, `query`, `list`, `rollback`, `status`, `config`.

### Step 3: Check Shell Completions

```bash
# Bash
source <(kml completion bash)
kml [TAB][TAB]

# Zsh
source <(kml completion zsh)
kml [TAB][TAB]

# Fish
kml completion fish | source
kml [TAB][TAB]

# PowerShell
kml completion powershell | Out-String | Invoke-Expression
kml [TAB][TAB]
```

### Step 4: Verify External Dependencies

```bash
# Check Qdrant
kml status
# Expected: "Qdrant: connected" or "Qdrant: not connected"

# Check Ollama
kml status --models
# Expected: "Ollama: connected | Model: qwen2-vl:2b (available)" or "not available"
```

### Step 5: Test Basic Functionality

```bash
# Create a test store
kml init ./test_store

# Ingest a test file
echo "Kamelot installation test" > test.txt
kml put test.txt

# Query
kml query "test" --model mock

# Clean up
kml rollback --all
rm -rf ./test_store test.txt
```

### Step 6: Verify GPU Canvas (Optional)

```bash
# Launch the UI
kamelot-ui

# Or launch through CLI
kml ui
```

You should see a window with an empty infinite canvas (black/dark background).

### Step 7: Verify Man Pages (Linux/macOS)

```bash
man kml
```

### Step 8: Check Installation Directories

```bash
# Linux
which kml
# /usr/local/bin/kml or /usr/bin/kml

# Check installation files
dpkg -L kamelot  # Debian/Ubuntu
rpm -ql kamelot  # Fedora/RHEL

# macOS
ls -la /Applications/Kamelot.app
which kml
# /usr/local/bin/kml

# Windows
where.exe kml
# C:\Program Files\Kamelot\bin\kml.exe
```

## Troubleshooting Installations

### Linux

#### Permission Denied

```bash
# Fix binary permissions
sudo chmod +x /usr/local/bin/kml
```

#### Missing Dependencies

```bash
# Check for missing shared libraries
ldd $(which kml)
# Look for "not found" entries
```

#### AppImage Won't Run

```bash
# Install FUSE
sudo apt install fuse  # Ubuntu/Debian
sudo dnf install fuse  # Fedora

# Or run without FUSE
./Kamelot-x86_64.AppImage --appimage-extract-and-run
```

#### GPG Key Error

```bash
# Re-import the key
curl -fsSL https://kamelot.sh/gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/kamelot-archive-keyring.gpg
sudo apt update
```

### Windows

#### MSI Installation Fails

```bash
# Check Windows Installer service
Get-Service msiserver

# Run installer with logging
msiexec /i kamelot-1.0.0-x86_64.msi /L*V install.log
```

#### PATH Not Updated

```bash
# Refresh PATH in current session
$env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")

# Or restart the terminal
```

#### Antivirus Blocking Kamelot

Add an exclusion for `C:\Program Files\Kamelot\` in your antivirus software.

#### WinFSP Not Installed

```bash
# Install WinFSP separately
curl -LO https://github.com/winfsp/winfsp/releases/latest/download/winfsp-2.0.23075.msi
msiexec /i winfsp-2.0.23075.msi /qn
```

### macOS

#### "App is damaged" or "Cannot be opened"

```bash
# Remove quarantine attribute
xattr -dr com.apple.quarantine /Applications/Kamelot.app

# Check Gatekeeper
spctl --master-disable  # Temporarily disable Gatekeeper (not recommended)
```

#### "kml: command not found" after DMG install

```bash
# Create symlink manually
sudo ln -s /Applications/Kamelot.app/Contents/MacOS/kml /usr/local/bin/kml
```

#### Homebrew Installation Fails

```bash
# Check for conflicts
brew doctor

# Force reinstall
brew reinstall kamelot
```

#### MoltenVK Not Found

```bash
# Set environment variable
export VK_ICD_FILENAMES=/usr/local/share/vulkan/icd.d/MoltenVK_icd.json
# Add to shell profile
echo 'export VK_ICD_FILENAMES=/usr/local/share/vulkan/icd.d/MoltenVK_icd.json' >> ~/.zshrc
```

### All Platforms

#### Cargo Build Fails

```bash
# Update Rust
rustup update

# Check for linker errors
cargo build --release 2>&1 | head -50

# Try with different features
cargo build --release --no-default-features
```

#### Binary Corruption

```bash
# Verify checksum
# Compare with the SHA256SUMS file from the release
sha256sum kml
# Windows
certutil -hashfile kml.exe SHA256
```

## Uninstalling Kamelot

### Linux (APT)

```bash
sudo apt remove kamelot kamelot-ui
sudo apt purge kamelot kamelot-ui  # Remove config files
```

### Linux (RPM)

```bash
sudo dnf remove kamelot kamelot-ui
```

### Linux (AppImage)

```bash
rm -f /opt/kamelot/squashfs-root/usr/bin/kml
rm -rf /opt/kamelot
```

### Linux (Homebrew)

```bash
brew uninstall kamelot
brew untap lois-kleinner/tap
```

### Windows (MSI)

```bash
# Via Control Panel
# Or via command line
msiexec /x kamelot-1.0.0-x86_64.msi /qn

# Via WinGet
winget uninstall Kamelot.Kamelot

# Via Scoop
scoop uninstall kamelot
```

### Windows (Portable)

```bash
# Remove the directory
Remove-Item -Recurse -Force C:\Kamelot

# Remove from PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
$newPath = ($currentPath.Split(';') | Where-Object { $_ -ne 'C:\Kamelot' }) -join ';'
[Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
```

### macOS (DMG)

```bash
# Remove the app
sudo rm -rf /Applications/Kamelot.app

# Remove symlink
sudo rm /usr/local/bin/kml
```

### macOS (Homebrew)

```bash
brew uninstall kamelot
brew untap lois-kleinner/tap
```

### Remove User Data

Uninstalling Kamelot does NOT remove your store data. To remove all data:

```bash
# Back up your passphrase first!
kml export --ledger ./backup_ledger

# Then remove the store directory
rm -rf ./kamelot_store  # Replace with your store path
```

### Remove Configuration

```bash
# Linux/macOS
rm -rf ~/.config/kamelot

# Windows
Remove-Item -Recurse -Force "$env:APPDATA\Kamelot"
```

## Upgrading

### Check for Updates

```bash
kml --version
# Compare with latest version at https://github.com/lois-kleinner/kamelot/releases
```

### Linux (APT)

```bash
sudo apt update
sudo apt upgrade kamelot
```

### Linux (RPM)

```bash
sudo dnf upgrade kamelot
```

### Windows (MSI)

Download and run the new MSI. It will upgrade the existing installation.

### Windows (WinGet)

```bash
winget upgrade Kamelot.Kamelot
```

### macOS (DMG)

Download and mount the new DMG. Replace the app:

```bash
cp -R /Volumes/Kamelot/Kamelot.app /Applications/
```

### macOS (Homebrew)

```bash
brew upgrade kamelot
```

### All Platforms (Cargo)

```bash
cargo install kamelot --force
```

### Upgrading Dependencies

```bash
# Qdrant
docker pull qdrant/qdrant:latest
docker stop qdrant
docker rm qdrant
# Re-run with the same volume mounts

# Ollama
# Auto-updates on most platforms
# Or re-run the installer

# Qwen model
ollama pull qwen2-vl:2b  # Get the latest version
```

### Migrating Store Data

Kamelot stores are forward-compatible within the same major version. When upgrading:

```bash
# Before upgrading, check store version
kml status

# After upgrade, the store is automatically migrated on first use
# You can also manually migrate:
kml init --migrate ./kamelot_store
```

### Rollback an Upgrade

If an upgrade causes issues:

```bash
# Downgrade package
# Linux (APT)
sudo apt install kamelot=0.9.0

# The store ledger can be rolled back if needed
kml rollback --hours 1
```

---

*Next tutorial: [03 — First File Ingest](03-first-file-ingest.md)*

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
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
