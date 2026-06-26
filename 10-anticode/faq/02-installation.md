```
▄▄                            ██     ▄▄   ▄▄▄                  ▄▄           
████                ██         ▀▀     ██  ██▀                   ██           
████    ██▄████▄  ███████    ████     ██▄██      ▄████▄    ▄███▄██   ▄████▄  
██  ██   ██▀   ██    ██         ██     █████     ██▀  ▀██  ██▀  ▀██  ██▄▄▄▄██ 
██████   ██    ██    ██         ██     ██  ██▄   ██    ██  ██    ██  ██▀▀▀▀▀▀ 
▄██  ██▄  ██    ██    ██▄▄▄   ▄▄▄██▄▄▄  ██   ██▄  ▀██▄▄██▀  ▀██▄▄███  ▀██▄▄▄▄█ 
▀▀    ▀▀  ▀▀    ▀▀     ▀▀▀▀   ▀▀▀▀▀▀▀▀  ▀▀    ▀▀    ▀▀▀▀      ▀▀▀ ▀▀    ▀▀▀▀▀ 

ANTIKODE — terminal-native AI coding engine
Lois-Kleinner and 0-1.gg 2026 Copyright
```

# FAQ: Installation

## How do I install ANTIKODE?

ANTIKODE is distributed as a single static binary for each platform. Choose your platform below.

### Linux (x86_64)
```bash
curl -LO https://github.com/antikode/antikode/releases/latest/download/antikode-linux-x86_64.tar.gz
tar xzf antikode-linux-x86_64.tar.gz
sudo mv antikode /usr/local/bin/
```

### Linux (ARM64/aarch64)
```bash
curl -LO https://github.com/antikode/antikode/releases/latest/download/antikode-linux-aarch64.tar.gz
tar xzf antikode-linux-aarch64.tar.gz
sudo mv antikode /usr/local/bin/
```

### macOS (Intel)
```bash
curl -LO https://github.com/antikode/antikode/releases/latest/download/antikode-darwin-x86_64.tar.gz
tar xzf antikode-darwin-x86_64.tar.gz
sudo mv antikode /usr/local/bin/
```

### macOS (Apple Silicon)
```bash
curl -LO https://github.com/antikode/antikode/releases/latest/download/antikode-darwin-arm64.tar.gz
tar xzf antikode-darwin-arm64.tar.gz
sudo mv antikode /usr/local/bin/
```

### Windows (x86_64)
```powershell
# Download and extract
Invoke-WebRequest -Uri "https://github.com/antikode/antikode/releases/latest/download/antikode-windows-x86_64.zip" -OutFile "antikode.zip"
Expand-Archive -Path "antikode.zip" -DestinationPath "C:\antikode"

# Add to PATH (run as Administrator)
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\antikode", "User")
```

### Verify Installation
```bash
antikode --version
# Output: ANTIKODE v1.0.0
```

## How do I install using a package manager?

### Homebrew (macOS/Linux)
```bash
brew tap antikode/tap
brew install antikode
```

### Scoop (Windows)
```powershell
scoop bucket add antikode https://github.com/antikode/scoop-bucket
scoop install antikode
```

### Docker
```bash
docker pull ghcr.io/antikode/antikode:latest
docker run -it --rm -v $(pwd):/workspace ghcr.io/antikode/antikode:latest
```

## What are the system requirements?

### Minimum Requirements
- **CPU:** Any x86_64 or ARM64 processor (2015 or newer)
- **RAM:** 4GB (8GB recommended)
- **Disk:** 500MB for ANTIKODE binary
- **OS:** Linux kernel 4.15+, macOS 12+, Windows 10 20H2+
- **Terminal:** ANSI 256-color capable terminal

### Recommended Requirements (for 7B models)
- **CPU:** x86_64 with AVX2 support, or Apple Silicon
- **RAM:** 16GB
- **GPU:** NVIDIA with 6GB+ VRAM, or Apple Silicon unified memory
- **Disk:** 4.5GB for model file
- **Terminal:** Windows Terminal, iTerm2, Kitty, or Alacritty

## Do I need to install a model?

Yes, you need both ANTIKODE and a model backend. ANTIKODE is the interface; the model provides the AI capabilities.

The easiest way is to:

1. Install ANTIKODE (instructions above)
2. Install llamafile (single executable, no dependencies)
3. Download a model (GGUF format for llamafile)
4. Start the model backend
5. Run ANTIKODE

Detailed instructions in the [Getting Started tutorial](../tutorial/01-getting-started.md).

## How do I install llamafile?

### Linux
```bash
curl -LO https://github.com/Mozilla-Ocho/llamafile/releases/download/0.8.0/llamafile-0.8.0
chmod +x llamafile-0.8.0
sudo mv llamafile-0.8.0 /usr/local/bin/llamafile
```

### macOS
```bash
curl -LO https://github.com/Mozilla-Ocho/llamafile/releases/download/0.8.0/llamafile-0.8.0
chmod +x llamafile-0.8.0
sudo mv llamafile-0.8.0 /usr/local/bin/llamafile
```

### Windows
1. Download llamafile.exe from https://github.com/Mozilla-Ocho/llamafile/releases
2. Place it in a directory in your PATH (e.g., C:\antikode\)

## How do I install Ollama?

### macOS
```bash
brew install ollama
```

### Linux
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Windows
Download the installer from https://ollama.com/download

## How do I download a model?

### For llamafile (GGUF format)

Download a GGUF file from Hugging Face:

```bash
# Qwen2.5-Coder-7B-Instruct (recommended)
curl -LO https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct-GGUF/resolve/main/qwen2.5-coder-7b-instruct-q4_k_m.gguf

# Smaller option for testing
curl -LO https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-1.5b-instruct-q4_k_m.gguf
```

### For Ollama

```bash
ollama pull qwen2.5-coder:7b
ollama pull deepseek-coder:6.7b
ollama pull codellama:7b
```

## What if I don't have a GPU?

ANTIKODE works entirely on CPU. You won't need to change any configuration — just remove or don't set GPU-related flags when starting the model backend.

CPU-only inference is slower than GPU-accelerated inference, but it works. For acceptable performance:

- **1.5B models:** Good on any modern CPU
- **7B models:** Usable on modern CPUs (expect 5-15 tokens/second)
- **13B+ models:** Slow on CPU (consider using smaller models)

## What if I get a "Permission denied" error on Linux/macOS?

```bash
# Make the binary executable
chmod +x antikode

# If moving to /usr/local/bin, you may need sudo
sudo mv antikode /usr/local/bin/
```

## What if I get a "Command not found" error?

The ANTIKODE binary is not in your PATH. Either:

1. Move it to a directory in your PATH:
   ```bash
   sudo mv antikode /usr/local/bin/
   ```

2. Or add the current directory to your PATH:
   ```bash
   export PATH=$PATH:$(pwd)
   ./antikode
   ```

## What if Windows Defender blocks ANTIKODE?

ANTIKODE is a legitimate open-source tool. If Windows Defender flags it, it's a false positive. You can:

1. Submit the file to Microsoft for analysis
2. Add an exclusion in Windows Security:
   - Open Windows Security
   - Go to "Virus & threat protection"
   - Click "Manage settings" under "Virus & threat protection settings"
   - Scroll to "Exclusions" and click "Add or remove exclusions"
   - Add the ANTIKODE binary or installation directory

3. Or build from source to verify the binary's integrity

## Can I install ANTIKODE without admin/root access?

Yes. Download the binary and place it in a directory you have write access to:

```bash
# Linux/macOS
mkdir -p ~/.local/bin
curl -LO https://github.com/antikode/antikode/releases/latest/download/antikode-...-x86_64.tar.gz
tar xzf antikode-*.tar.gz -C ~/.local/bin/
export PATH=$PATH:~/.local/bin/

# Add to ~/.bashrc or ~/.zshrc
echo 'export PATH=$PATH:~/.local/bin/' >> ~/.bashrc
```

## Can I install ANTIKODE in a Docker container?

Yes. ANTIKODE runs inside Docker containers. You can use the official Docker image or install it manually.

### Using Docker image
```bash
docker pull ghcr.io/antikode/antikode:latest
docker run -it --rm -v $(pwd):/workspace antikode:latest
```

### Installing in your Dockerfile
```dockerfile
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y curl
RUN curl -LO https://github.com/antikode/antikode/releases/latest/download/antikode-linux-x86_64.tar.gz \
    && tar xzf antikode-linux-x86_64.tar.gz \
    && mv antikode /usr/local/bin/
```

## How do I build ANTIKODE from source?

```bash
# Prerequisites: Go 1.22+
git clone https://github.com/antikode/antikode.git
cd antikode
make build
# Binary is in ./bin/antikode
```

## What dependencies does ANTIKODE have?

ANTIKODE itself has zero runtime dependencies beyond the operating system. It's a statically linked Go binary.

The model backend (llamafile, Ollama, etc.) has its own dependencies:
- **llamafile:** No dependencies (single executable)
- **Ollama:** No dependencies (single executable)
- **OpenAI-compatible:** No local dependencies (network access to API)

## How do I uninstall ANTIKODE?

```bash
# Linux/macOS
sudo rm /usr/local/bin/antikode

# Remove configuration and data
rm -rf ~/.antikode

# Windows (PowerShell as Administrator)
Remove-Item "C:\antikode" -Recurse -Force
Remove-Item "$env:USERPROFILE\.antikode" -Recurse -Force
```

## How do I update ANTIKODE?

Download the latest binary and replace the old one:

```bash
# Download and extract
curl -LO https://github.com/antikode/antikode/releases/latest/download/antikode-...-x86_64.tar.gz
tar xzf antikode-*.tar.gz

# Replace old binary
sudo mv antikode /usr/local/bin/

# Verify
antikode --version
```

## Can I install multiple versions of ANTIKODE?

Yes. Keep different binaries with different names:

```bash
mv antikode antikode-1.0
mv antikode antikode-1.1
./antikode-1.0 --version
./antikode-1.1 --version
```

## What if I get "Failed to initialize terminal" error?

This usually means your terminal doesn't support the features ANTIKODE requires. Try:

1. Use Windows Terminal instead of the legacy console (Windows)
2. Install a modern terminal emulator (iTerm2, Kitty, Alacritty)
3. Set the TERM environment variable: `export TERM=xterm-256color`
4. Try running in minimal mode: `antikode --minimal`

## Can I install ANTIKODE on a server and use it over SSH?

Yes. Install ANTIKODE and a model backend on your server, then SSH in and run:

```bash
ssh myserver
antikode
```

For GPU-accelerated inference on remote servers, you may need to ensure the GPU drivers are installed and accessible.

## Do I need to install Python or Node.js?

No. ANTIKODE is a Go binary with no runtime scripting language dependencies. You do not need Python, Node.js, or any other runtime installed.

However, some MCP servers may require Node.js or Python. Check the specific MCP server documentation for requirements.

## Can I install ANTIKODE on a Raspberry Pi?

Yes. ARM64 builds are available for Linux. However, model performance on a Raspberry Pi will be limited:

- 1.5B models run at usable speeds
- 7B models will be slow (1-3 tokens/second)
- Consider using the smallest possible model

## How do I install the development version (nightly)?

Nightly builds may be available from the GitHub releases page. Alternatively, build from the main branch:

```bash
git clone https://github.com/antikode/antikode.git
cd antikode
make build
./bin/antikode --version
```

Nightly builds include the latest features but may be less stable than releases.

## What should I do if the installation fails?

1. Check that you downloaded the correct binary for your OS and architecture
2. Verify the binary downloaded completely (check file size)
3. Ensure the binary has execute permissions (Linux/macOS)
4. Try building from source
5. File an issue on GitHub with details about your system and the error

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com