                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                

# 01 — Getting Started with Kamelot

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. [What is Kamelot?](#what-is-kamelot)
2. [Core Philosophy](#core-philosophy)
3. [System Requirements](#system-requirements)
4. [Quick Installation](#quick-installation)
5. [Verify Your Installation](#verify-your-installation)
6. [First Run](#first-run)
7. [Understanding the Architecture](#understanding-the-architecture)
8. [Key Concepts](#key-concepts)
9. [The Vector Pipeline](#the-vector-pipeline)
10. [Security Model](#security-model)
11. [Next Steps](#next-steps)
12. [Troubleshooting](#troubleshooting)
13. [Glossary](#glossary)

---

## What is Kamelot?

Kamelot is a sovereign semantic vector file system that replaces the traditional hierarchical directory tree with AI-powered natural language retrieval. Instead of navigating folders like `/home/user/documents/work/proposals/Q3/final_v2_actually_final.docx`, you simply ask Kamelot: *"find my Q3 proposal doc I edited last week"* — and it returns the file instantly.

Under the hood, Kamelot combines four key technologies into a cohesive whole: a local Large Language Model (LLM) — specifically Qwen 2 VL Q4 — that generates dense vector embeddings for every file you store; Qdrant, a high-performance vector database that indexes and searches those embeddings; an encrypted flat object store that holds the actual file contents; and a native Rust GPU canvas UI that renders your filespace as an infinite, zoomable, spatial canvas. There is no browser, no Electron wrapper, no JavaScript runtime. Kamelot is a native application built for speed, privacy, and sovereignty.

Unlike cloud-based semantic search tools, Kamelot runs entirely on your hardware. Embeddings are generated locally, vectors are stored locally, and files are encrypted at rest with keys that never leave your device. Kamelot is zero-knowledge by design: even if someone gains physical access to your storage, they cannot read a single byte without your master key.

## Core Philosophy

Kamelot was designed around five core principles:

1. **Semantics over Syntax.** Human memory is associative and contextual, not path-based. You remember what a file is about, not where you put it. Kamelot mirrors how your brain actually works.

2. **Local-First Sovereignty.** Your data belongs to you. Embedding, indexing, encryption, and retrieval all happen on your hardware. No data ever touches a third-party server.

3. **Encryption by Default.** Every file ingested into Kamelot is encrypted using XChaCha20-Poly1305 before it touches disk. The encryption key is derived from your master passphrase using Argon2id.

4. **Spatial Memory.** The infinite canvas is not a gimmick. Human spatial memory is extraordinarily powerful — you remember where things are in physical space. Kamelot's canvas leverages this by letting you place files anywhere on an infinite 2D plane.

5. **Anti-Fragility.** Kamelot's immutable append-only ledger protects against ransomware, accidental deletion, and malicious tampering. You can roll back to any point in time.

## System Requirements

### Minimum Requirements

| Component | Linux | Windows | macOS |
|-----------|-------|---------|-------|
| CPU | x86-64 v3, 4+ cores | x86-64 v3, 4+ cores | Apple Silicon (M1+) or Intel |
| RAM | 8 GB | 8 GB | 8 GB |
| Storage | 2 GB free + file data | 2 GB free + file data | 2 GB free + file data |
| GPU | Any Vulkan 1.2+ GPU | Any Vulkan 1.2+ GPU | Metal-compatible GPU |
| OS | Ubuntu 22.04+, Fedora 38+, Arch 2024+ | Windows 10 22H2+, Windows 11 | macOS 14 Sonoma+ |
| Docker | Docker Engine 24+ | Docker Desktop 4.25+ | Docker Desktop 4.25+ |

### Recommended Requirements

| Component | Linux | Windows | macOS |
|-----------|-------|---------|-------|
| CPU | 8+ cores | 8+ cores | M2 Pro / Ultra |
| RAM | 32 GB | 32 GB | 32 GB |
| GPU | NVIDIA RTX 3060+ / AMD RX 6700+ | NVIDIA RTX 3060+ | M-series GPU |
| Storage | 512 GB NVMe SSD | 512 GB NVMe SSD | 512 GB SSD |

### Software Dependencies

Kamelot itself is a single statically-linked binary, but it depends on two external services:

1. **Qdrant** — Vector database. Runs as a Docker container or natively.
2. **Ollama** — LLM runtime for generating embeddings and processing queries. Optional if you use the mock backend for testing.

### Supported File Systems

Kamelot reads from any mounted filesystem but stores its internal data on:

- **Linux:** ext4, btrfs, XFS (recommended), ZFS
- **Windows:** NTFS, ReFS
- **macOS:** APFS, HFS+

Kamelot creates its own internal storage format inside a directory of your choosing. It does not replace or modify your existing filesystem — it sits *on top* of it.

## Quick Installation

### Install via Cargo (All Platforms)

If you have Rust installed, you can build Kamelot from source:

```bash
cargo install kamelot
```

This compiles the `kml` CLI binary. Compilation takes approximately 3-5 minutes on a modern machine.

To also install the GPU canvas UI:

```bash
cargo install kamelot --features ui
```

### Install via Package Manager

**Linux (Homebrew):**

```bash
brew install lois-kleinner/tap/kamelot
```

**Linux (Debian/Ubuntu):**

```bash
curl -fsSL https://kamelot.sh/install.sh | sudo bash
# or manually:
sudo dpkg -i kamelot_1.0.0_amd64.deb
```

**macOS (Homebrew):**

```bash
brew install lois-kleinner/tap/kamelot
```

**Windows (WinGet):**

```bash
winget install Kamelot.Kamelot
```

### Install via Binary Download

Pre-compiled binaries are available for each release:

```bash
# Linux x86-64
curl -LO https://github.com/lois-kleinner/kamelot/releases/latest/download/kamelot-x86_64-unknown-linux-gnu.tar.gz
tar xzf kamelot-x86_64-unknown-linux-gnu.tar.gz
sudo mv kml /usr/local/bin/

# macOS Apple Silicon
curl -LO https://github.com/lois-kleinner/kamelot/releases/latest/download/kamelot-aarch64-apple-darwin.tar.gz
tar xzf kamelot-aarch64-apple-darwin.tar.gz
sudo mv kml /usr/local/bin/

# Windows x86-64
# Download kamelot-x86_64-pc-windows-msvc.zip
# Extract and add to PATH
```

### Install via Docker (Experimental)

```bash
docker pull ghcr.io/lois-kleinner/kamelot:latest
docker run --rm ghcr.io/lois-kleinner/kamelot:latest kml --version
```

Note: The Docker image is primarily for CI/CD and server deployments. For desktop usage, install natively.

## Verify Your Installation

Once installed, verify that Kamelot is available on your PATH:

```bash
kml --version
```

Expected output:

```
kamelot 1.0.0 (rev abcdef1, 2026-06-19)
```

You should also see the ASCII art logo:

```
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                

Kamelot 1.0.0 — The Sovereign Semantic Vector File System
Lois-Kleinner & 0-1.gg © 2026
```

If you see this output, your installation is successful. If you encounter an error, see the [Troubleshooting](#troubleshooting) section.

### Checking Subcommands

Kamelot provides several subcommands. Verify they are all available:

```bash
kml --help
```

Expected output (abbreviated):

```
Kamelot — The Sovereign Semantic Vector File System

Usage: kml <COMMAND>

Commands:
  init      Initialize a new Kamelot store
  put       Ingest a file into the store
  get       Retrieve a file by inode or name
  query     Search files using natural language
  list      List all files in the store
  rollback  Roll back the store to a previous state
  status    Show store status and statistics
  config    View or modify configuration
  help      Print this message or the help of a subcommand

Options:
  -h, --help     Print help
  -V, --version  Print version
```

## First Run

Before you can store files, you need to initialize a Kamelot store and start the vector database.

### 1. Start Qdrant

Qdrant is the vector database that powers Kamelot's semantic search. The easiest way to run it is via Docker:

```bash
docker run -d \
  --name qdrant \
  -p 6333:6333 \
  -p 6334:6334 \
  -v $(pwd)/qdrant_storage:/qdrant/storage \
  qdrant/qdrant:latest
```

Verify Qdrant is running:

```bash
curl http://localhost:6333/health
```

Expected response: `{"ok":true}`

### 2. Initialize the Store

```bash
kml init ./kamelot_store
```

You will be prompted to create a master passphrase. This passphrase is used to derive your encryption key. **Store this passphrase securely** — if you lose it, your files are unrecoverable.

```
Creating new Kamelot store at ./kamelot_store
Enter master passphrase: [hidden]
Confirm master passphrase: [hidden]
Store initialized successfully.
```

### 3. Pull the Embedding Model

Kamelot uses Ollama to manage local LLMs. Pull the Qwen 2 VL model:

```bash
ollama pull qwen2-vl:2b
```

This downloads approximately 1.6 GB of model data. On a typical broadband connection, this takes 2-5 minutes.

### 4. Ingest Your First File

```bash
echo "Hello, Kamelot World!" > hello.txt
kml put hello.txt
```

Expected output:

```
Ingested: hello.txt
  Inode:     7f3a5c91-b2d4-4f8e-9a1c-3e5f7d8b2a1c
  Size:      22 bytes
  MIME:      text/plain
  Embedding: generated (384 dims, 12.4ms)
  Encrypted: XChaCha20-Poly1305
  Ledger:    block #1
```

### 5. Search with Natural Language

```bash
kml query "greeting file" --model qwen2-vl:2b
```

Expected output:

```
Top 3 results for "greeting file":
  Score  Inode                                    Name           MIME
  ─────  ─────                                    ────           ────
  0.942  7f3a5c91-b2d4-4f8e-9a1c-3e5f7d8b2a1c    hello.txt      text/plain
  0.312  (no more results)
```

Congratulations! You have successfully ingested and retrieved a file using semantic search.

## Understanding the Architecture

Kamelot's architecture is composed of four layers:

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface Layer                      │
│  ┌──────────────────┐  ┌──────────────────────────────────┐  │
│  │   CLI (kml)      │  │   GPU Canvas (kamelot-ui)        │  │
│  │   Terminal-based │  │   Infinite 2D spatial canvas     │  │
│  └────────┬─────────┘  └───────────────┬──────────────────┘  │
└───────────┼────────────────────────────┼──────────────────────┘
            │                            │
┌───────────┼────────────────────────────┼──────────────────────┐
│           │        Core Engine         │                      │
│  ┌────────┴────────────────────────────┴──────────────────┐  │
│  │                   Kamelot Core (Rust)                   │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │  │
│  │  │ Ingest   │  │ Query    │  │ Ledger / Rollback    │  │  │
│  │  │ Pipeline │  │ Pipeline │  │ Immutable Append-    │  │  │
│  │  │          │  │          │  │ Only Log             │  │  │
│  │  └────┬─────┘  └────┬─────┘  └──────────────────────┘  │  │
│  └───────┼──────────────┼──────────────────────────────────┘  │
└──────────┼──────────────┼──────────────────────────────────────┘
           │              │
┌──────────┼──────────────┼──────────────────────────────────────┐
│          │    Storage & Index Layer                            │
│  ┌───────┴──────────────────┐  ┌───────────────────────────┐  │
│  │  Encrypted Object Store  │  │  Qdrant Vector Database   │  │
│  │  Flat file storage       │  │  HNSW index of embeddings │  │
│  │  XChaCha20-Poly1305     │  │  Cosine similarity search  │  │
│  └──────────────────────────┘  └───────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Ollama (Qwen 2 VL Q4)                                  │  │
│  │  Local LLM for embedding generation & query processing  │  │
│  └─────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### Layer 1: User Interface

Kamelot provides two interfaces:

- **CLI (`kml`):** A full-featured command-line interface for power users, scripting, and automation. All operations available in the canvas UI are also available via CLI.
- **GPU Canvas (`kamelot-ui`):** A native Rust application using Vulkan/Metal for rendering an infinite 2D canvas. Files appear as tiles that can be dragged, linked, and arranged spatially.

### Layer 2: Core Engine

Written entirely in Rust, the core engine handles:

- **Ingestion pipeline:** Reading files, generating embeddings, encrypting content, writing to storage, and recording transactions in the ledger.
- **Query pipeline:** Accepting natural language queries, generating query embeddings via Ollama, searching Qdrant, and returning ranked results.
- **Ledger management:** Maintaining an immutable, append-only cryptographic ledger of all operations for rollback and audit.

### Layer 3: Storage & Index

- **Encrypted Object Store:** Files are stored in a flat namespace (no directories) under content-addressed hashes. Each file is encrypted individually using XChaCha20-Poly1305 with a key derived from your master passphrase.
- **Qdrant:** An open-source vector database that stores embeddings using HNSW (Hierarchical Navigable Small World) graphs for fast approximate nearest neighbor search.
- **Ollama:** Manages the local LLM lifecycle — downloading models, running inference for embeddings, and processing natural language queries.

## Key Concepts

### Inodes

Every file in Kamelot is assigned a unique inode — a UUID v4 identifier. Unlike traditional filesystems where an inode is tied to a physical location on disk, a Kamelot inode is purely logical and content-addressed.

```bash
kml put document.pdf
# Output: Inode: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

You can reference files by their inode for all operations:

```bash
kml get a1b2c3d4-e5f6-7890-abcd-ef1234567890
kml get document.pdf  # name resolution also works
```

### Embeddings

An embedding is a dense vector of floating-point numbers that captures the semantic meaning of a file. Kamelot uses the Qwen 2 VL Q4 model to generate 384-dimensional embeddings.

Two files with similar meanings will have similar embeddings. For example:

- "tax return 2025.pdf" → [0.12, -0.34, 0.78, ..., 0.01] (384 values)
- "IRS filing.pdf" → [0.11, -0.33, 0.76, ..., 0.02] (cosine similarity: 0.97)

Files with unrelated content produce dissimilar embeddings:

- "tax return 2025.pdf" → [0.12, -0.34, 0.78, ..., 0.01]
- "cat photo.jpg" → [0.89, 0.45, -0.12, ..., 0.67] (cosine similarity: 0.23)

### The Ledger

Every operation in Kamelot is recorded in an immutable append-only ledger. The ledger is a chain of cryptographically signed blocks, similar to a blockchain but with no proof-of-work or consensus mechanism (it is a local ledger, not a distributed one).

```
Block #1:
  Timestamp: 2026-06-19T10:00:00Z
  Operation: PUT
  Inode: a1b2c3d4-...
  Hash: 0000abc...
  Previous: 0000000... (genesis)

Block #2:
  Timestamp: 2026-06-19T10:05:00Z
  Operation: PUT
  Inode: b2c3d4e5-...
  Hash: 0000def...
  Previous: 0000abc...

Block #3:
  Timestamp: 2026-06-19T10:10:00Z
  Operation: DELETE
  Inode: a1b2c3d4-...
  Hash: 0000ghi...
  Previous: 0000def...
```

The ledger enables time-travel: you can roll back the store to any previous state by replaying the ledger up to a specific block.

### Workspaces

A workspace is a saved semantic query plus its results. For example, "all tax documents from 2025" creates a workspace that dynamically shows matching files. Unlike folders, workspaces are synthetic — they don't own files, they just reference them.

### Spatial Memory (Canvas)

The GPU canvas is an infinite 2D plane where files appear as visual tiles. You can:

- Drag files anywhere on the canvas
- Group related files by proximity
- Draw bezier curve links between files
- Pan and zoom infinitely

This leverages your brain's spatial memory — you remember that the budget spreadsheet is "in the top-left corner, near the Q4 reports."

## The Vector Pipeline

Understanding how a file moves through Kamelot helps you use it effectively.

### Ingestion Pipeline

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  File on │    │  Chunk & │    │ Generate │    │ Encrypt  │    │ Store &  │
│   Disk   │───▶│  Analyze │───▶│Embedding │───▶│ Content  │───▶│ Index    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                                    │
                                                                    ▼
                                                              ┌──────────┐
                                                              │  Record  │
                                                              │ in Ledger│
                                                              └──────────┘
```

**Step 1: Chunk & Analyze**
The file is read and analyzed. Kamelot detects the MIME type, extracts text from PDFs and documents, and generates metadata (file size, creation date, hash).

**Step 2: Generate Embedding**
The extracted text (or image data, for visual files) is sent to Ollama, which runs the Qwen 2 VL model to produce a 384-dimensional embedding vector.

**Step 3: Encrypt Content**
The original file bytes are encrypted using XChaCha20-Poly1305 with a key derived from your master passphrase. Only the encrypted ciphertext is stored.

**Step 4: Store & Index**
The encrypted ciphertext is written to the flat object store. The embedding is sent to Qdrant for indexing via HNSW.

**Step 5: Record in Ledger**
A new block is appended to the ledger recording the PUT operation, including timestamp, inode, file hash, and embedding hash.

### Query Pipeline

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Natural  │    │ Generate │    │ Search   │    │ Decrypt &│
│ Language │───▶│ Embedding│───▶│ Qdrant   │───▶│ Return   │
│ Query    │    │ (Ollama) │    │ (HNSW)   │    │ Results  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

**Step 1:** You type a natural language query: "budget spreadsheet from last quarter"

**Step 2:** Kamelot sends this query to Ollama, which generates an embedding of your query text.

**Step 3:** The query embedding is sent to Qdrant, which performs approximate nearest neighbor search against all stored embeddings using cosine similarity.

**Step 4:** Results are ranked by similarity score, decrypted (only metadata; actual file content is decrypted only on `kml get`), and displayed.

## Security Model

Kamelot uses a defense-in-depth approach to security.

### Encryption at Rest

Every file is encrypted individually using XChaCha20-Poly1305, an authenticated encryption scheme that provides both confidentiality and integrity.

- **Algorithm:** XChaCha20-Poly1305 (IETF variant)
- **Key Derivation:** Argon2id (memory-hard, time-hard KDF)
- **Nonce:** Random 192-bit nonce per file
- **Authentication Tag:** 128-bit Poly1305 tag

The master passphrase is never stored. The encryption key is derived each time you run `kml init` or `kml unlock`.

### Ledger Integrity

The ledger uses BLAKE3 hashing in a Merkle chain. Each block includes the hash of the previous block, making it computationally infeasible to tamper with historical records without detection.

```bash
kml status
# Displays ledger integrity check result
# Ledger: INTACT (42 blocks, verified through block #42)
```

### Authentication

Kamelot authenticates the user through the master passphrase. There is no multi-user support in the current version.

```bash
kml unlock
# Unlocks the store for the current session
```

After 15 minutes of inactivity, the store auto-locks and must be unlocked again. This timeout is configurable:

```bash
kml config set session_timeout 60  # 60 minutes
```

### Network Security

- Kamelot does not expose any network services by default
- Qdrant communication is over localhost (127.0.0.1) by default
- Optional TLS can be configured for remote Qdrant instances
- The K-Swarm mesh uses Noise Protocol Framework for peer-to-peer encryption

## Next Steps

You've completed the Getting Started guide. Here's where to go next:

| Topic | Description | Tutorial |
|-------|-------------|----------|
| Detailed Installation | OS-specific install guides | [02 — Installation](02-installation.md) |
| Your First File Ingest | Step-by-step ingest walkthrough | [03 — First File Ingest](03-first-file-ingest.md) |
| Searching with NL | Advanced query techniques | [04 — Searching with NL](04-searching-with-nl.md) |
| CLI Deep Dive | All commands and flags | [05 — CLI Deep Dive](05-cli-deep-dive.md) |
| Omnibox Usage | Desktop search bar | [06 — Omnibox Usage](06-omnibox-usage.md) |
| Infinite Canvas | GPU canvas UI | [07 — Infinite Canvas](07-infinite-canvas.md) |
| Workspaces | Synthetic workspaces | [08 — Workspace Management](08-workspace-management.md) |
| K-Swarm | Multi-device mesh | [09 — K-Swarm Setup](09-k-swarm-setup.md) |
| Recovery & Rollback | Time-travel and disaster recovery | [10 — Recovery & Rollback](10-recovery-rollback.md) |
| Migration | Migrating from NTFS/ext4 | [11 — Migration](11-migration-from-ntfs-ext4.md) |

## Troubleshooting

### `kml: command not found`

The binary is not on your PATH.

```bash
# Linux/macOS
export PATH=$PATH:/usr/local/bin
echo 'export PATH=$PATH:/usr/local/bin' >> ~/.bashrc

# Windows (PowerShell)
$env:Path += ";C:\Program Files\Kamelot"
[Environment]::SetEnvironmentVariable("Path", $env:Path, "User")
```

### `Failed to connect to Qdrant`

Qdrant is not running or not accessible.

```bash
# Check if container is running
docker ps | findstr qdrant  # Windows
docker ps | grep qdrant     # Linux/macOS

# Check if Qdrant is listening
curl http://localhost:6333/health

# Restart Qdrant
docker restart qdrant
```

### `Model not found`

The Qwen model has not been pulled yet.

```bash
ollama pull qwen2-vl:2b
```

### `Cannot connect to Ollama`

Ollama is not running.

```bash
# Linux/macOS
ollama serve

# Windows
# Start Ollama from the Start Menu or run:
& "C:\Program Files\Ollama\ollama.exe" serve
```

### `Store locked`

The store was auto-locked due to inactivity.

```bash
kml unlock
# Enter your master passphrase
```

### `Ledger integrity check failed`

The ledger has been tampered with. This is a critical error.

```bash
kml status --verbose
# Check which block failed validation
# Contact support with the output
```

### Performance Issues

If queries are slow:

```bash
# Check Qdrant collection status
kml status --vectors

# Rebuild the HNSW index with different parameters
kml config set hnsw.m 32        # Higher = more accuracy, more memory
kml config set hnsw.ef_construct 200  # Higher = better index quality
```

## Glossary

| Term | Definition |
|------|------------|
| **Argon2id** | Memory-hard key derivation function used to derive encryption keys from passphrases |
| **BLAKE3** | Cryptographic hash function used for ledger chaining and content addressing |
| **Block** | A cryptographic record in the ledger containing one or more operations |
| **Canvas** | The infinite 2D GPU-rendered workspace for spatial file arrangement |
| **CLI** | Command-Line Interface — the `kml` terminal program |
| **Cosine Similarity** | A measure of similarity between two vectors (-1 to 1) |
| **Embedding** | A dense vector of floating-point numbers representing semantic meaning |
| **HNSW** | Hierarchical Navigable Small World — the algorithm Qdrant uses for vector search |
| **Inode** | A UUID v4 identifier assigned to each file in Kamelot |
| **K-Swarm** | Kamelot's peer-to-peer multi-device mesh networking protocol |
| **Ledger** | An append-only, cryptographically chained log of all operations |
| **MIME** | Multipurpose Internet Mail Extensions — file type identifier |
| **Object Store** | The flat, encrypted storage backend for file contents |
| **Ollama** | Local LLM runtime for managing and running AI models |
| **Qdrant** | Open-source vector database for embedding storage and search |
| **Qwen 2 VL** | The visual-language model used for generating embeddings |
| **Rollback** | The ability to revert the store to a previous state via the ledger |
| **Semantic Search** | Search based on meaning, not keywords |
| **Spatial Memory** | The cognitive ability to remember spatial locations of objects |
| **Vector** | An array of numbers representing data in high-dimensional space |
| **Workspace** | A synthetic, query-based collection of file references |
| **XChaCha20-Poly1305** | Authenticated encryption algorithm used for file encryption |
| **Zero-Knowledge** | A system design where the service provider cannot access user data |

## Quick Reference Card

### Most Common Commands

```bash
# Initialize a store
kml init ./store

# Ingest a file
kml put document.pdf

# Search
kml query "find my tax documents"

# Get a file
kml get document.pdf --output ./restored/

# List files
kml list

# Undo mistakes
kml rollback --minutes 5

# Check status
kml status
```

### Key Shortcuts (Omnibox)

| Shortcut | Action |
|----------|--------|
| Super+Space | Open omnibox |
| Escape | Close omnibox |
| ↓/↑ | Navigate results |
| Enter | Open file |
| Ctrl+Enter | Show in folder |

### Key Shortcuts (Canvas)

| Shortcut | Action |
|----------|--------|
| Middle mouse drag | Pan |
| Scroll wheel | Zoom |
| Ctrl+0 | Reset zoom |
| Ctrl+9 | Fit all |
| L | Link mode |
| N | New note |
| Delete | Remove selected |

### Architecture Quick Reference

```
User → CLI/Canvas → Core Engine → Ollama (embeddings)
                                  → Qdrant (vector index)
                                  → Object Store (encrypted files)
                                  → Ledger (immutable history)
```

### Data Flow

```
Ingestion:  File → Read → Extract Text → Ollama Embed → Encrypt → Store → Ledger
Query:      Text → Ollama Embed → Qdrant Search → Decrypt Metadata → Display Results
Rollback:   Command → Verify Ledger → Invert Operations → Append Rollback Block
```

---

*Next tutorial: [02 — Installation](02-installation.md)*
