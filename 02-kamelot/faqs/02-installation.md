                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                
# FAQ — Installation

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. [What Are the System Requirements?](#what-are-the-system-requirements)
2. [How Do I Install Kamelot?](#how-do-i-install-kamelot)
3. [Do I Need Docker?](#do-i-need-docker)
4. [Do I Need Ollama?](#do-i-need-ollama)
5. [Why Do I Need WinFSP on Windows?](#why-do-i-need-winfsp-on-windows)
6. [Can I Install Without Root/Admin Access?](#can-i-install-without-rootadmin-access)
7. [How Long Does Installation Take?](#how-long-does-installation-take)
8. [Do I Need a GPU?](#do-i-need-a-gpu)
9. [What About AMD GPUs?](#what-about-amd-gpus)
10. [How Do I Install on a Headless Server?](#how-do-i-install-on-a-headless-server)
11. [Can I Run Kamelot in a Container?](#can-i-run-kamelot-in-a-container)
12. [How Do I Verify the Installation?](#how-do-i-verify-the-installation)
13. [What Ports Does Kamelot Use?](#what-ports-does-kamelot-use)
14. [How Do I Configure Kamelot After Installation?](#how-do-i-configure-kamelot-after-installation)

---

## What Are the System Requirements?

### Minimum Requirements (CPU-Only, Mock Embeddings)

| Component | Linux | Windows | macOS |
|-----------|-------|---------|-------|
| OS Version | Ubuntu 22.04+, Fedora 38+, Debian 12+ | Windows 10 21H2+, Windows 11 | macOS 13+ (Ventura) |
| Architecture | x86_64 | x86_64 | x86_64 + Apple Silicon |
| RAM | 4 GB | 4 GB | 4 GB |
| Storage | 500 MB free (Kamelot) + file storage | 500 MB free + file storage | 500 MB free + file storage |
| FUSE Driver | libfuse3 3.10+ | WinFSP 2024.2+ | macOSFUSE 4.5+ |

### Recommended Requirements (Real Embeddings, GPU)

| Component | Linux | Windows | macOS |
|-----------|-------|---------|-------|
| RAM | 16 GB | 16 GB | 16 GB |
| GPU | NVIDIA GTX 1660+ / AMD RX 6600+ | NVIDIA GTX 1660+ | Apple Silicon (M1+) |
| VRAM | 6 GB+ | 6 GB+ | Unified memory (16 GB+) |
| Storage | 10 GB free (includes model + Qdrant) | 10 GB free | 10 GB free |
| Qdrant | Docker or local binary | Docker or WSL + local binary | Docker or local binary |
| Ollama | Docker or local binary | Docker or WSL + local binary | Docker or local binary |

### Optimal Requirements (1M+ Files, Full Features)

| Component | Specification |
|-----------|--------------|
| CPU | 8+ cores (AMD Ryzen 7 / Intel Core i7 or better) |
| RAM | 32 GB+ |
| GPU | NVIDIA RTX 3060+ (12 GB VRAM) or Apple M2 Max+ |
| Storage | NVMe SSD, 2 TB+ |
| Network | Any (works fully offline) |

---

## How Do I Install Kamelot?

### Linux

```bash
# Option 1: Homebrew (recommended)
brew install kamelot

# Option 2: APT (Debian/Ubuntu)
echo "deb https://apt.kamelot.ai/stable /" | sudo tee /etc/apt/sources.list.d/kamelot.list
curl -fsSL https://apt.kamelot.ai/key.asc | sudo apt-key add -
sudo apt update
sudo apt install kamelot

# Option 3: Direct download
curl -O https://releases.kamelot.ai/latest/kamelot-linux-x86_64.tar.gz
tar -xzf kamelot-linux-x86_64.tar.gz
sudo mv kamelot /usr/local/bin/

# Initialize
kml init
kml start
```

### Windows

```powershell
# Option 1: Chocolatey (recommended)
choco install kamelot

# Option 2: Direct download
Invoke-WebRequest -Uri "https://releases.kamelot.ai/latest/kamelot-windows-x86_64.zip" -OutFile "kamelot.zip"
Expand-Archive -Path "kamelot.zip" -DestinationPath "$env:LOCALAPPDATA\Kamelot"
$env:Path += ";$env:LOCALAPPDATA\Kamelot"

# Initialize
kml init
kml start
```

### macOS

```bash
# Option 1: Homebrew (recommended)
brew install kamelot

# Option 2: Direct download
curl -O https://releases.kamelot.ai/latest/kamelot-macos-x86_64.tar.gz
tar -xzf kamelot-macos-x86_64.tar.gz
sudo mv kamelot /usr/local/bin/

# Initialize
kml init
kml start
```

---

## Do I Need Docker?

Docker is **optional**. Kamelot can run with Qdrant and Ollama as native binaries or Docker containers.

### Without Docker (Native)
```bash
# Install Qdrant natively
curl -O https://github.com/qdrant/qdrant/releases/latest/download/qdrant-x86_64-unknown-linux-gnu.tar.gz
tar -xzf qdrant-x86_64-unknown-linux-gnu.tar.gz
sudo mv qdrant /usr/local/bin/

# Install Ollama natively
curl -fsSL https://ollama.ai/install.sh | sh
```

### With Docker
```bash
# Qdrant
docker run -d --name qdrant -p 6333:6333 -p 6334:6334 qdrant/qdrant

# Ollama
docker run -d --name ollama -p 11434:11434 ollama/ollama
```

### Docker Compose (Kamelot Stack)
```yaml
version: "3.8"
services:
  qdrant:
    image: qdrant/qdrant:v1.13.0
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - ./qdrant_storage:/qdrant/storage
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ./ollama:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
```

---

## Do I Need Ollama?

Ollama is **optional** for basic testing but **recommended** for production use.

### Without Ollama (Mock Mode)
Kamelot includes a mock embedding backend that generates deterministic random vectors. This allows you to:
- Test the Kamelot pipeline without downloading any AI model
- Run integration tests in CI environments without GPU
- Evaluate the search interface and FUSE mount
- Develop and debug other components

```bash
kml start --model mock
```

With mock mode, all queries return results based on random similarity. The search interface works, but search quality is meaningless. Mock mode is for development and testing only.

### With Ollama (Production)
For real semantic search, you need an embedding model served by Ollama:

```bash
# Pull the recommended model
ollama pull qwen2-vl:7b-q4

# Start Kamelot with Ollama backend
kml start --model ollama
```

Ollama handles:
- Model download and caching
- GPU-accelerated inference
- Model quantization (Q4, Q8, etc.)
- API serving on localhost:11434

---

## Why Do I Need WinFSP on Windows?

WinFSP (Windows File System Proxy) is a kernel-mode driver that allows user-space applications to create filesystem mounts on Windows. It is the Windows equivalent of FUSE (Filesystem in Userspace) on Linux.

Kamelot uses WinFSP to:
1. **Mount the virtual Kamelot drive** (default: `K:\`) as a browsable directory
2. **Synthesize virtual directory structures** (Synthetic Workspaces, organized views)
3. **Provide transparent file access** so existing applications can open files through Kamelot
4. **Implement file watching** for automatic re-indexing of changed files

### Installation
WinFSP is installed automatically by the Kamelot installer (MSI) on Windows. You can also install it manually:

```powershell
# Chocolatey
choco install winfsp

# Manual download
# Download from https://winfsp.dev/rel/
```

### WinFSP Requirements
- Windows 10 21H2 or later (64-bit)
- Windows 11 (all versions)
- Administrator privileges for installation
- Reboot after installation (required by Windows driver loading)

---

## Can I Install Without Root/Admin Access?

Yes, with limitations.

### Without Root (Linux)
```bash
# Install Kamelot binary to ~/.local/bin
mkdir -p ~/.local/bin
curl -O https://releases.kamelot.ai/latest/kamelot-linux-x86_64.tar.gz
tar -xzf kamelot-linux-x86_64.tar.gz
mv kamelot ~/.local/bin/
export PATH="$HOME/.local/bin:$PATH"

# Run Qdrant and Ollama via user-mode Docker (if available)
# Or use the mock model backend
kml start --model mock

# Note: FUSE mount requires either root or user_allow_other in /etc/fuse.conf
```

### Without Admin (Windows)
```powershell
# Download portable ZIP
Invoke-WebRequest -Uri "https://releases.kamelot.ai/latest/kamelot-windows-x86_64-portable.zip" -OutFile "kamelot.zip"
Expand-Archive -Path "kamelot.zip" -DestinationPath "$env:USERPROFILE\kamelot"
$env:Path += ";$env:USERPROFILE\kamelot"

# Note: WinFSP requires admin install. Without it, the virtual drive mount is unavailable.
# Search via Omnibox still works without the drive.
```

### Limitations Without Root/Admin
- FUSE/WinFSP virtual drive mount is unavailable
- You can still use the CLI (`kml find`) and Omnibox for search
- File watching may be limited
- Qdrant and Ollama must run as user-mode processes

---

## How Long Does Installation Take?

### Quick Install (No Model, Mock Mode)
| Step | Time |
|------|------|
| Download Kamelot binary | 5-30 seconds |
| Install dependencies (WinFSP/libfuse3) | 30-60 seconds |
| Run `kml init` | 5 seconds |
| Run `kml start --model mock` | 3 seconds |
| **Total** | **<2 minutes** |

### Full Install (With Model)
| Step | Time |
|------|------|
| Kamelot binary download | 5-30 seconds |
| Qdrant setup (Docker pull or binary) | 30-120 seconds |
| Ollama setup (Docker pull or binary) | 30-120 seconds |
| Model download (4+ GB) | 2-10 minutes* |
| Model loading into memory | 10-30 seconds |
| `kml init` and configuration | 10 seconds |
| First index (100 files) | 5-10 seconds |
| **Total** | **4-15 minutes** |

*Model download time depends on internet speed. 4GB at 100 Mbps = ~5 minutes.

---

## Do I Need a GPU?

**No**, Kamelot works without a GPU. However, a GPU significantly improves performance:

### CPU-Only Operation
- Embedding generation: 100-500ms per file (vs 10-50ms with GPU)
- File indexing: ~3 files/second (vs ~20 files/second with GPU)
- Query latency: 200-600ms (vs 50-150ms with GPU)
- RAM usage: Higher (model lives in system RAM instead of VRAM)
- Minimum RAM: 16 GB for Qwen 2 VL Q4 on CPU

### GPU Operation
- NVIDIA: CUDA 12+ support. Works with GTX 1660+ (6GB VRAM minimum, 12GB recommended)
- AMD: ROCm 5.7+ support. Works with RX 6600+ (8GB VRAM minimum)
- Apple Silicon: Native Metal support via Ollama. Works with M1+ (16GB unified memory minimum)
- Intel: Arc GPU support via OpenVINO (experimental)

### GPU Detection
```bash
kml doctor    # Shows detected GPU and recommended configuration
kml info      # Shows hardware configuration
```

---

## What About AMD GPUs?

AMD GPUs are supported on Linux via ROCm. Windows AMD GPU support is experimental (via DirectML in Ollama).

### Linux (ROCm)
```bash
# Install ROCm (Ubuntu)
sudo apt install rocm-dev

# Verify
rocm-smi

# Ollama with ROCm
docker run -d --name ollama --device=/dev/kfd --device=/dev/dri ollama/ollama:rocm

# Start Kamelot
kml start --model ollama
```

### Windows (DirectML, Experimental)
```powershell
# Ollama with DirectML on Windows
# Download Ollama Windows with DirectML support
# https://ollama.ai/download/windows

kml start --model ollama
```

### Performance Note
AMD GPU performance with Ollama is approximately 70-80% of NVIDIA performance for the same GPU tier. This is due to ROCm maturity and software optimization differences.

---

## How Do I Install on a Headless Server?

Kamelot can be installed on a headless server (no display, SSH-only). The CLI tools work without the GPU UI.

```bash
# Install Kamelot
curl -O https://releases.kamelot.ai/latest/kamelot-linux-x86_64.tar.gz
tar -xzf kamelot-linux-x86_64.tar.gz
sudo mv kamelot /usr/local/bin/

# Create configuration
mkdir -p ~/.kamelot
cat > ~/.kamelot/config.toml << 'EOF'
[daemon]
bind_address = "0.0.0.0:9010"

[qdrant]
url = "http://localhost:6333"

[ollama]
url = "http://localhost:11434"
model = "qwen2-vl:7b-q4"
EOF

# Start services
kml start --daemon

# Use CLI to search
kml find "architecture diagram onboarding"
```

The Kamelot daemon exposes a JSON-RPC API on port 9010 for remote querying. You can build custom integrations or use the CLI from any machine on the network.

---

## Can I Run Kamelot in a Container?

Yes. Kamelot is available as a Docker image for containerized deployments.

```bash
# Pull Kamelot image
docker pull kamelot/kamelot:latest

# Run with Docker Compose (recommended)
# See docker-compose.yml example above

# Run standalone
docker run -d \
  --name kamelot \
  -v /path/to/files:/data/files:ro \
  -v kamelot-data:/data/kamelot \
  -p 9010:9010 \
  kamelot/kamelot:latest

# Use with Qdrant and Ollama containers
docker network create kamelot-net
docker run -d --network kamelot-net --name qdrant qdrant/qdrant
docker run -d --network kamelot-net --name ollama ollama/ollama
docker run -d --network kamelot-net \
  -v /path/to/files:/data/files:ro \
  -v kamelot-data:/data/kamelot \
  -p 9010:9010 \
  kamelot/kamelot:latest
```

---

## How Do I Verify the Installation?

```bash
# Check version
kml --version

# Run diagnostic
kml doctor

# Expected output:
# ✓ Kamelot binary: v0.1.0
# ✓ Qdrant: connected (v1.13.0)
# ✓ Ollama: connected (v0.3.0)
# ✓ Model: qwen2-vl:7b-q4 (loaded)
# ✓ FUSE: /kml mounted
# ✓ Config: valid
# ✓ Disk space: OK

# Index a test directory
kml index ~/Documents/test/

# Search
kml find "test file"

# Check mount
ls /kml/     # Linux/macOS
dir K:\      # Windows
```

---

## What Ports Does Kamelot Use?

| Port | Service | Configurable | Purpose |
|------|---------|-------------|---------|
| 6333 | Qdrant | Yes | Qdrant gRPC + HTTP API |
| 6334 | Qdrant | Yes | Qdrant gRPC (internal) |
| 11434 | Ollama | Yes | Ollama API |
| 9010 | Kamelot daemon | Yes | Kamelot JSON-RPC API |
| 9011 | Kamelot UI | Yes | WebSocket for UI (local only) |

All ports default to localhost binding (127.0.0.1) for security. To expose Kamelot's API to the network, change `bind_address` in config.

---

## How Do I Configure Kamelot After Installation?

Kamelot configuration is stored in `~/.kamelot/config.toml`. You can edit this file directly or use the `kml config` command.

```bash
# Open config in editor
kml config edit

# Set a config value
kml config set daemon.bind_address "0.0.0.0:9010"

# View current config
kml config show

# Reset to defaults
kml config reset
```

### Configuration File Example

```toml
[daemon]
bind_address = "127.0.0.1:9010"
log_level = "info"
data_dir = "~/.kamelot"

[qdrant]
url = "http://localhost:6333"
timeout_seconds = 30
prefer_grpc = true

[ollama]
url = "http://localhost:11434"
model = "qwen2-vl:7b-q4"
timeout_seconds = 60

[storage]
flat_store_path = "~/.kamelot/store"
max_blob_size_mb = 1024

[fuse]
mount_point = "/kml"       # Linux/macOS
mount_point_windows = "K:" # Windows
allow_other = false

[indexing]
include_patterns = ["**/*"]
exclude_patterns = ["**/node_modules/**", "**/.git/**", "**/__pycache__/**"]
watch_enabled = true
watch_delay_seconds = 30

[ui]
omnibox_hotkey = "Ctrl+Space"
theme = "dark"
language = "en"
```

---

## Can I Install Kamelot Alongside Other Search Tools?

Yes. Kamelot coexists peacefully with other desktop search tools:

| Tool | Compatibility | Notes |
|------|-------------|-------|
| Everything (voidtools) | Full | Different search scope (Everything=filename, Kamelot=semantic) |
| Alfred | Full | Can be used together; Kamelot doesn't interfere |
| macOS Spotlight | Full | Spotlight indexes separately; both work simultaneously |
| Windows Search | Full | Kamelot doesn't modify Windows Search index |
| Google Drive for Desktop | Full | Can index the Google Drive sync folder |
| Dropbox | Full | Can index the Dropbox folder |
| DocFetcher | Full | Both can index the same files without conflict |

Kamelot does not modify system files, registry entries (on Windows), or system services of other search tools.

---

## How Do I Install Kamelot on SteamOS or Other Linux Gaming Distributions?

Kamelot can run on SteamOS (Steam Deck) and other gaming-oriented Linux distributions:

### SteamOS Installation

```bash
# Switch to desktop mode
# Open Konsole and disable read-only filesystem
sudo steamos-readonly disable

# Install FUSE
sudo pacman -S fuse3

# Download Kamelot
curl -O https://releases.kamelot.ai/latest/kamelot-linux-x86_64.tar.gz
tar -xzf kamelot-linux-x86_64.tar.gz
sudo mv kamelot /usr/local/bin/

# Initialize
kml init
kml start --model mock  # Steam Deck GPU is AMD, use CPU mode
```

### Considerations for Steam Deck

| Factor | Note |
|--------|------|
| Storage | Steam Deck internal storage is limited; use SD card for files |
| RAM | 16 GB is sufficient for moderate indexes (<50K files) |
| GPU | AMD APU works with ROCm (experimental) or CPU mode |
| FUSE | Works in desktop mode; not tested in gaming mode |
| Power | Kamelot is efficient; minimal impact on battery life |
| Startup | Add `kml start` to startup applications in desktop mode |

---

## How Do I Install Kamelot on a Chromebook (Linux Container)?

ChromeOS supports Linux containers (Crostini) that can run Kamelot:

```bash
# Enable Linux container in ChromeOS settings
# Open the Linux terminal

# Install FUSE
sudo apt update
sudo apt install fuse3 libfuse3-3

# Download Kamelot
curl -O https://releases.kamelot.ai/latest/kamelot-linux-x86_64.tar.gz
tar -xzf kamelot-linux-x86_64.tar.gz
sudo mv kamelot /usr/local/bin/

# Initialize and start
kml init
kml start --model mock  # Chromebook may not have GPU support
```

### Limitations on ChromeOS

- **GPU acceleration**: Chromebook GPU access from Linux container is limited. Use CPU mode or mock mode.
- **FUSE passthrough**: The `--device /dev/fuse` flag may be needed. ChromeOS allows FUSE in Crostini.
- **File access**: Files in your Google Drive or Downloads folder must be shared with the Linux container.
- **Persistence**: The Linux container persists across reboots; Kamelot can auto-start.

---

## How Do I Set Up Kamelot to Start Automatically on Boot?

### Linux (systemd)

```bash
# Install Kamelot as a systemd service
sudo kml install-service

# Or manually create the service file
sudo cat > /etc/systemd/system/kamelot.service << 'EOF'
[Unit]
Description=Kamelot Semantic Vector File System
After=network.target local-fs.target

[Service]
Type=simple
User=%i
ExecStart=/usr/local/bin/kamelot start
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable kamelot
sudo systemctl start kamelot
```

### Windows

```powershell
# Install as Windows service
# Kamelot installer usually sets this up automatically

# Manual service installation
New-Service -Name "Kamelot" `
  -BinaryPathName "$env:LOCALAPPDATA\Kamelot\kamelot.exe start" `
  -Description "Kamelot Semantic Vector File System" `
  -StartupType Automatic

Start-Service -Name "Kamelot"
```

### macOS

```bash
# Create a LaunchAgent for user-level auto-start
cat > ~/Library/LaunchAgents/ai.kamelot.daemon.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>ai.kamelot.daemon</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/kamelot</string>
        <string>start</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
EOF

launchctl load ~/Library/LaunchAgents/ai.kamelot.daemon.plist
```

---

## How Do I Install a Specific Version of Kamelot?

### Via Package Manager

```bash
# Homebrew: Install specific version
brew install kamelot@0.1.0

# APT: List available versions
apt list -a kamelot

# Install specific version
sudo apt install kamelot=0.1.0-1
```

### Via Direct Download

```bash
# Download specific version
curl -O https://releases.kamelot.ai/v0.1.0/kamelot-linux-x86_64.tar.gz

# Verify checksum
curl -O https://releases.kamelot.ai/v0.1.0/kamelot-linux-x86_64.tar.gz.sha256
sha256sum -c kamelot-linux-x86_64.tar.gz.sha256

# Install
tar -xzf kamelot-linux-x86_64.tar.gz
sudo mv kamelot /usr/local/bin/kamelot-v0.1.0

# Run specific version
/usr/local/bin/kamelot-v0.1.0 start
```

### Version Compatibility

| Kamelot Version | Qdrant Version | Ollama Version | Model Version |
|----------------|----------------|----------------|---------------|
| v0.1.0 | 1.13.x | 0.3.x | Qwen 2 VL 7B Q4 |
| v0.2.0 | 1.14.x | 0.4.x | Qwen 2 VL 7B Q4 |
| v0.3.0 | 1.15.x | 0.5.x | Qwen 2 VL 7B Q4 |
| v1.0.0 | 1.18.x | 0.8.x | Qwen 2 VL 7B Q4 |

Check the release notes for compatibility details when upgrading.

---

## Can I Install Kamelot on a Dual-Boot System?

Yes. Kamelot can be installed on each OS in a dual-boot configuration.

### Sharing the Index Across Operating Systems

For users who dual-boot Linux and Windows and want to share the same index:

```bash
# On Linux: create the index on a shared partition (e.g., NTFS)
kml init --data-dir /mnt/shared/kamelot

# On Windows: point to the same shared partition
kml init --data-dir "D:\kamelot"
```

### Important Considerations

- The index format and embeddings are platform-independent
- The ledger and flat store formats are identical across platforms
- The embedding model (if downloaded) must be present on both OS installations
- FUSE/Linux and WinFSP/Windows mount points differ but the underlying data is the same
- Performance may vary between the two operating systems (Linux is generally faster)

**Caution**: Do not run both OS instances simultaneously with the same data directory. Shut down Kamelot completely before booting into the other OS.

---

## How Do I Install Kamelot with Ansible or Configuration Management?

### Ansible Role

```yaml
- name: Install Kamelot
  hosts: all
  tasks:
    - name: Download Kamelot
      get_url:
        url: "https://releases.kamelot.ai/latest/kamelot-linux-x86_64.tar.gz"
        dest: /tmp/kamelot.tar.gz

    - name: Extract Kamelot
      unarchive:
        src: /tmp/kamelot.tar.gz
        dest: /usr/local/bin/
        remote_src: yes

    - name: Initialize Kamelot
      command: /usr/local/bin/kamelot init --data-dir /opt/kamelot
      args:
        creates: /opt/kamelot/config.toml

    - name: Enable Kamelot service
      systemd:
        name: kamelot
        enabled: yes
        state: started
```

### Terraform / Pulumi

For cloud deployments, Kamelot can be provisioned as part of infrastructure-as-code:

```hcl
resource "null_resource" "kamelot_install" {
  provisioner "remote-exec" {
    inline = [
      "curl -O https://releases.kamelot.ai/latest/kamelot-linux-x86_64.tar.gz",
      "tar -xzf kamelot-linux-x86_64.tar.gz",
      "sudo mv kamelot /usr/local/bin/",
      "kml init --data-dir /opt/kamelot",
      "sudo kml install-service",
      "kml start"
    ]
  }
}
```

---

## How Do I Roll Back an Installation to a Previous Version?

### Manual Rollback

```bash
# Stop Kamelot
kml stop

# Back up current data directory (just in case)
cp -r ~/.kamelot ~/.kamelot.backup

# Download the previous version
curl -O https://releases.kamelot.ai/v0.0.9/kamelot-linux-x86_64.tar.gz
tar -xzf kamelot-linux-x86_64.tar.gz
sudo mv kamelot /usr/local/bin/kamelot-v0.0.9

# Replace current binary
sudo cp /usr/local/bin/kamelot-v0.0.9 /usr/local/bin/kamelot

# Restart
kml start
```

### Using Package Manager Version Pinning

```bash
# APT: Hold version
sudo apt-mark hold kamelot

# Homebrew: Pin version
brew pin kamelot

# Snap: Revert to previous
sudo snap revert kamelot
```

### Data Compatibility

| Rollback Type | Data Compatible? | Notes |
|--------------|-----------------|-------|
| Patch version (0.1.0 → 0.1.1) | Yes | Forward and backward compatible |
| Minor version (0.1.x → 0.2.x) | Usually | Ledger format may require migration |
| Major version (0.x → 1.x) | Review release notes | May require re-indexing |

Always read the release notes before rolling back across minor or major versions.

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