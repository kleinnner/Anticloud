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

# Getting Started

## Overview

This tutorial will guide you through installing ANTIKODE, setting up a model backend, and running your first session. By the end, you'll have a fully functional local AI coding assistant.

## Prerequisites

Before installing ANTIKODE, ensure your system meets these requirements:

- **Operating System:** Linux (x86_64, aarch64), macOS (x86_64, arm64), or Windows (x86_64)
- **Terminal:** Any modern terminal with ANSI 256-color support (we recommend Windows Terminal, iTerm2, Kitty, or Alacritty)
- **RAM:** 8GB minimum (16GB recommended for 7B+ models)
- **Disk Space:** 500MB for ANTIKODE binary, 4-8GB for model files
- **CPU:** Any x86_64 or ARM64 processor (AVX2 support recommended for llamafile)

## Step 1: Download ANTIKODE

ANTIKODE is distributed as a single static binary for each platform. Download the appropriate version for your system:

### Linux
```bash
curl -LO https://github.com/antikode/antikode/releases/latest/download/antikode-linux-x86_64.tar.gz
tar xzf antikode-linux-x86_64.tar.gz
sudo mv antikode /usr/local/bin/
```

### macOS
```bash
curl -LO https://github.com/antikode/antikode/releases/latest/download/antikode-darwin-arm64.tar.gz
tar xzf antikode-darwin-arm64.tar.gz
sudo mv antikode /usr/local/bin/
```

### Windows
```powershell
# Download the executable
Invoke-WebRequest -Uri "https://github.com/antikode/antikode/releases/latest/download/antikode-windows-x86_64.zip" -OutFile "antikode.zip"
Expand-Archive -Path "antikode.zip" -DestinationPath "C:\antikode"
# Add to PATH (run in admin PowerShell)
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\antikode", "User")
```

### Verify Installation
```bash
antikode --version
# Output: ANTIKODE v1.0.0
```

## Step 2: Install a Model Backend

ANTIKODE supports multiple model backends. We recommend **llamafile** for the simplest setup.

### Option A: Install llamafile (Recommended)

llamafile is a single-file executable that runs LLMs without any dependencies.

#### Download llamafile
```bash
# Linux
curl -LO https://github.com/Mozilla-Ocho/llamafile/releases/download/0.8.0/llamafile-0.8.0
chmod +x llamafile-0.8.0
sudo mv llamafile-0.8.0 /usr/local/bin/llamafile

# macOS (Apple Silicon)
curl -LO https://github.com/Mozilla-Ocho/llamafile/releases/download/0.8.0/llamafile-0.8.0
chmod +x llamafile-0.8.0
sudo mv llamafile-0.8.0 /usr/local/bin/llamafile

# Windows
# Download llamafile.exe from the releases page
# Place it in C:\antikode\ or a directory in your PATH
```

#### Create a model directory
```bash
mkdir -p ~/models
```

### Option B: Install Ollama (Alternative)

```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# Download from https://ollama.com/download
```

## Step 3: Download a Model

ANTIKODE works best with code-specialized models. Here are recommended options:

| Model | Size | RAM Needed | Quality |
|-------|------|-----------|---------|
| Qwen2.5-Coder-7B-Instruct | 4.5GB | 8GB | Excellent |
| DeepSeek-Coder-6.7B-Instruct | 4GB | 8GB | Excellent |
| CodeLlama-7B-Instruct | 4GB | 8GB | Good |
| Qwen2.5-Coder-1.5B-Instruct | 1GB | 4GB | Good (lightweight) |
| Phi-3-Mini-4K-Instruct | 2.5GB | 6GB | Good |

### Download a model for llamafile

```bash
# Download Qwen2.5-Coder-7B-Instruct (recommended)
# From Hugging Face
curl -LO https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct-GGUF/resolve/main/qwen2.5-coder-7b-instruct-q4_k_m.gguf
mv qwen2.5-coder-7b-instruct-q4_k_m.gguf ~/models/

# Or download a smaller model for testing
curl -LO https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-1.5b-instruct-q4_k_m.gguf
mv qwen2.5-coder-1.5b-instruct-q4_k_m.gguf ~/models/
```

### Download a model for Ollama

```bash
ollama pull qwen2.5-coder:7b
# Or a smaller model
ollama pull qwen2.5-coder:1.5b
```

## Step 4: Start the Model Backend

### Start llamafile server

```bash
# Start llamafile with your downloaded model
llamafile --server \
  --model ~/models/qwen2.5-coder-7b-instruct-q4_k_m.gguf \
  --host 127.0.0.1 \
  --port 8080 \
  --n-gpu-layers -1 \
  --flash-attn
```

This starts a local API server at http://127.0.0.1:8080. Keep this terminal window open.

**Note:** The `--n-gpu-layers -1` flag enables GPU acceleration. Remove it if you don't have a compatible GPU, or set it to 0 for CPU-only mode.

### Start Ollama server

```bash
# Ollama runs as a service by default
# Just ensure it's running
ollama serve
```

## Step 5: Configure ANTIKODE

Create a configuration file in your project directory:

```bash
cd ~/my-project
antikode --init
```

This creates an `antikode.json` file with default settings. Edit it to point to your model:

### For llamafile

```json
{
  "version": "1.0",
  "provider": "llamafile",
  "model": {
    "path": "/home/yourusername/models/qwen2.5-coder-7b-instruct-q4_k_m.gguf",
    "context_length": 8192,
    "temperature": 0.2,
    "top_p": 0.9,
    "llamafile": {
      "host": "127.0.0.1",
      "port": 8080
    }
  }
}
```

### For Ollama

```json
{
  "version": "1.0",
  "provider": "ollama",
  "model": {
    "name": "qwen2.5-coder:7b",
    "context_length": 8192,
    "temperature": 0.2,
    "top_p": 0.9
  }
}
```

## Step 6: Run ANTIKODE

Now you're ready to start ANTIKODE:

```bash
cd ~/my-project
antikode
```

You should see the startup sequence:

```
$ antikode

  INITIALIZING ANTIKODE...

  [✓] Configuration loaded     (antikode.json)
  [✓] Session created          (default)
  [✓] Agents initialized       (5 agents)
  [✓] Permission system ready  (50 rules)
  [✓] Memory store loaded      (0 memories)
  [✓] AIOSS ledger opened      (entry 0)
  [→] Connecting to model backend... (llamafile)

  [✓] Model backend connected  (qwen2.5-coder-7b, 8K context)

  ▄▄                            ██     ▄▄   ▄▄▄                  ▄▄           
  ████                ██         ▀▀     ██  ██▀                   ██           
  ████    ██▄████▄  ███████    ████     ██▄██      ▄████▄    ▄███▄██   ▄████▄  
  ██  ██   ██▀   ██    ██         ██     █████     ██▀  ▀██  ██▀  ▀██  ██▄▄▄▄██ 
  ██████   ██    ██    ██         ██     ██  ██▄   ██    ██  ██    ██  ██▀▀▀▀▀▀ 
  ▄██  ██▄  ██    ██    ██▄▄▄   ▄▄▄██▄▄▄  ██   ██▄  ▀██▄▄██▀  ▀██▄▄███  ▀██▄▄▄▄█ 
  ▀▀    ▀▀  ▀▀    ▀▀     ▀▀▀▀   ▀▀▀▀▀▀▀▀  ▀▀    ▀▀    ▀▀▀▀      ▀▀▀ ▀▀    ▀▀▀▀▀ 

  ANTIKODE v1.0.0 — Ready for input
  Type /help for commands, or just start coding!
```

## Step 7: Your First Query

Once ANTIKODE is running, type your first query:

```
> Create a hello world program in Go
```

The Build Agent will respond, create a file, and you'll see the full workflow:

```
Build Agent: I'll create a simple Go hello world program for you.

[Used WriteTool — 12ms]
Created: /home/you/my-project/main.go

Let me verify it compiles:

[Used BashTool — go build -o /dev/null ./main.go — 345ms]
Build succeeded!

Here's your Go hello world program:

package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

Congratulations! You've successfully installed ANTIKODE and run your first coding session.

## Step 8: Create a Configuration Alias (Optional)

For convenience, create an alias that starts both the model backend and ANTIKODE:

### Linux/macOS
```bash
# Add to ~/.bashrc or ~/.zshrc
alias antikode-start='llamafile --server --model ~/models/qwen2.5-coder-7b-instruct-q4_k_m.gguf --host 127.0.0.1 --port 8080 --n-gpu-layers -1 & sleep 2 && antikode'
```

### Windows PowerShell
```powershell
# Add to your PowerShell profile
function Start-Antikode {
    $job = Start-Job -ScriptBlock {
        & "C:\path\to\llamafile.exe" --server --model "$env:USERPROFILE\models\qwen2.5-coder-7b-instruct-q4_k_m.gguf" --host 127.0.0.1 --port 8080 --n-gpu-layers -1
    }
    Start-Sleep -Seconds 2
    antikode
}
Set-Alias antikode-start Start-Antikode
```

## Common Issues

### "Connection refused" when connecting to model backend
- Ensure llamafile or Ollama is running
- Check the host and port in antikode.json match your server
- For llamafile, verify it's listening: `curl http://127.0.0.1:8080/v1/models`

### "Model file not found"
- Verify the path in antikode.json is absolute and correct
- Check file permissions: `ls -la ~/models/qwen2.5-coder-7b-instruct-q4_k_m.gguf`

### "Out of memory" error
- Use a smaller model (Qwen2.5-Coder-1.5B instead of 7B)
- Reduce context_length in configuration
- Use CPU-only mode: remove --n-gpu-layers or set to 0

### Slow response times
- Enable GPU acceleration with --n-gpu-layers -1
- Use a smaller model with fewer parameters
- Reduce context_length to 4096 or 2048
- Close other memory-intensive applications

## Next Steps

Now that ANTIKODE is running, continue to the next tutorial:

- [Basic Usage](02-basic-usage.md) — Learn the TUI, one-shot prompts, and commands
- [Agent Modes](03-agent-modes.md) — Switch between Build and Plan agents
- [File Operations](04-file-operations.md) — Read, write, and edit files
- [Task Management](05-task-management.md) — Use the task board

## Additional Resources

- **GitHub Repository:** https://github.com/antikode/antikode
- **Model Downloads:** https://huggingface.co/models?search=GGUF
- **llamafile Documentation:** https://github.com/Mozilla-Ocho/llamafile
- **Ollama Documentation:** https://ollama.com/docs

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