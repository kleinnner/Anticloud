                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                

# 02 — Solution Overview

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. [The Kamelot Solution](#the-kamelot-solution)
2. [Semantic Vector Graph Approach](#semantic-vector-graph-approach)
3. [Natural Language as the Primary Interface](#natural-language-as-the-primary-interface)
4. [Zero-Knowledge, Encrypted, Local-First](#zero-knowledge-encrypted-local-first)
5. [Cross-Platform Architecture](#cross-platform-architecture)
6. [The Infinite Canvas](#the-infinite-canvas)
7. [The Immutable Ledger](#the-immutable-ledger)
8. [K-Swarm Mesh Networking](#k-swarm-mesh-networking)
9. [Comparison with Alternatives](#comparison-with-alternatives)
10. [Technical Architecture Overview](#technical-architecture-overview)

---

## The Kamelot Solution

Kamelot is not a file manager. It is not a search tool. It is not a cloud storage service. Kamelot is a **fundamentally new kind of file system** — one built for how humans actually think, remember, and work.

Where traditional file systems ask "where did you put this file?", Kamelot asks "what are you looking for?" This shift — from location-based to meaning-based — is the core insight that drives everything Kamelot does.

### The Six Pillars of Kamelot

1. **Semantic Vector Graph:** Files are organized by meaning, not by path
2. **Natural Language Interface:** You describe what you need in plain language
3. **Zero-Knowledge Encryption:** Your data is encrypted and never leaves your control
4. **Local-First Architecture:** Everything runs on your hardware, no cloud dependency
5. **Spatial Canvas:** Leverage your brain's spatial memory for intuitive organization
6. **Anti-Fragile Ledger:** Immutable, time-travel capable, ransomware-proof

## Semantic Vector Graph Approach

### From Tree to Graph

Traditional file systems use a tree structure:

```
Root
├── Home
│   ├── Documents
│   │   ├── Work
│   │   └── Personal
│   ├── Photos
│   └── Music
└── etc.
```

A tree is simple but rigid. Each node has exactly one parent. A file can be in only one place.

Kamelot uses a vector graph instead:

```
                  ┌──────────────────────────────┐
                  │     "Q4 Budget Report"        │
                  │     (semantic vector)         │
                  └──────────────┬───────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
    ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
    │ budget.xlsx     │  │ report.pdf      │  │ meeting-notes   │
    │ vector: [....]  │  │ vector: [....]  │  │ vector: [....]  │
    └────────┬────────┘  └────────┬────────┘  └────────┬────────┘
             │                    │                    │
             └────────────────────┼────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │     "Marketing Q4"       │
                    │     (semantic vector)    │
                    └─────────────────────────┘
```

In this graph:
- Files are nodes connected by semantic similarity
- Related files cluster together naturally
- A file can have relationships with many other files
- There are no "folders" — just semantic proximity

### How Vectors Create the Graph

Every file in Kamelot is converted to a 384-dimensional vector (embedding) using Qwen 2 VL. Files with similar meanings have similar vectors.

The vector space is continuous:

```
                    "cat photo.jpg"
                    ●
                    │ cos=0.87
                    │
"dog photo.jpeg" ●──┼──● "vacation photo.png"
                    │  cos=0.82
                    │
                    ●
               "tax return.pdf"
                    │ cos=0.12
                    │
                    ●
              "budget.xlsx"
```

When you search, your query is converted to a vector, and Kamelot finds all files whose vectors are nearby.

### Clustering and Discovery

The vector graph enables automatic clustering:

```bash
# Kamelot can identify semantic clusters
kml canvas cluster --auto
```

This might reveal:
```
Cluster 1: "Tax & Finance" (24 files)
  - tax-return-2025.pdf
  - irs-form-1040.pdf
  - budget.xlsx
  - ...

Cluster 2: "Project Alpha" (45 files)
  - proposal.docx
  - meeting-notes.md
  - timeline.xlsx
  - ...
```

These clusters emerge from the data itself — no manual folder creation required.

## Natural Language as the Primary Interface

### The Query Is the Interface

In Kamelot, you find files by describing them:

```bash
kml query "find the budget spreadsheet from the marketing team's Q4 planning meeting"
```

vs. traditional:

```bash
# Step 1: Navigate to Documents/Work/Marketing/Q4/
# Step 2: Look through files
# Step 3: Find the right one
```

### Why Natural Language Works

1. **It's how you think:** Your internal monologue describes files by context, not path
2. **It's how you talk:** When asking a colleague for a file, you describe it
3. **It's how you remember:** Memory is associative, not hierarchical
4. **It's inclusive:** No special syntax, no folder structure to learn

### Beyond Keywords

Traditional keyword search finds files that contain your search terms:

```
Query: "budget marketing Q4"
✓ budget-marketing-q4.xlsx (filename contains all terms)
✗ Q4-financial-report.pdf (doesn't contain "budget" or "marketing")
```

Semantic search finds files that are conceptually related:

```
Query: "budget marketing Q4"
✓ budget-marketing-q4.xlsx (score: 0.94)
✓ Q4-financial-report.pdf (score: 0.82 — semantically related to budget and Q4)
✓ marketing-plan-2025.docx (score: 0.71 — related to marketing)
✗ shopping-list.txt (score: 0.12 — unrelated)
```

### The 80/20 Rule

Natural language search handles 80% of file lookups:

- "Find my tax documents" ✓
- "Show me photos from vacation" ✓
- "Where's the proposal for the Johnson account?" ✓
- "Find the email attachment about the merger" ✓
- "I need that spreadsheet Jane sent" ✓

For the remaining 20%, explicit filters are available:

```bash
kml query "budget" \
  --mime application/vnd.openxmlformats-officedocument.spreadsheetml.sheet \
  --tag "finance" \
  --since "2025-10-01"
```

## Zero-Knowledge, Encrypted, Local-First

### Sovereignty by Design

Kamelot is designed from the ground up to be sovereign — your data belongs to you, and only you.

**Zero-Knowledge Architecture:**

```
Your Device                Kamelot Store
┌─────────────────┐       ┌──────────────────────┐
│  Original File   │       │  Encrypted Ciphertext│
│  "Budget.xlsx"   │──────▶│  XChaCha20-Poly1305  │
│                  │       │  [encrypted bytes]   │
│  Master Passphrase│       │                      │
│  (never stored)  │       │  Argon2id Salt       │
└─────────────────┘       └──────────────────────┘
```

- **Files are encrypted before storage:** The original content never touches disk in plaintext
- **Keys are never stored:** The encryption key is derived from your passphrase each time
- **No telemetry, no tracking:** Kamelot does not phone home
- **No cloud dependency:** Everything runs on your hardware

### What This Means for You

**Privacy:**
- No one can read your files without your passphrase
- No metadata is sent to any server
- No AI company trains on your data

**Security:**
- Ransomware cannot encrypt files you can roll back
- Physical theft of your drive reveals nothing
- File integrity is verified by the ledger

**Availability:**
- No cloud service can shut down or change terms
- No internet connection required
- Your files work offline, always

### Local AI

Unlike cloud-based semantic search (Google Drive search, Notion AI), Kamelot runs AI inference locally:

```bash
# On-device embedding generation
ollama run qwen2-vl:2b

# No API calls
# No data leaving your network
# No per-query costs
# No rate limiting
# Works offline
```

## Cross-Platform Architecture

### Native Performance on Every OS

Kamelot is built with Rust and uses native rendering APIs:

| Platform | Rendering | File System | Install |
|----------|-----------|-------------|---------|
| Linux | Vulkan | ext4, btrfs, XFS, ZFS | .deb, .rpm, AppImage |
| Windows | Vulkan | NTFS, ReFS | MSI, WinGet |
| macOS | Metal (MoltenVK) | APFS, HFS+ | DMG, Homebrew |

### Consistent Experience

The CLI works identically on all platforms:

```bash
# Same commands, same output, same behavior
kml init
kml put
kml query
kml get
kml list
kml rollback
```

### Cross-Device with K-Swarm

K-Swarm creates a peer-to-peer mesh between your devices:

```
Desktop (Linux) ◄────► Laptop (macOS)
      │                      │
      └──────────┬───────────┘
                 │
          Phone (Android)
```

- Search all devices from any device
- Offload binaries to NAS, keep indexes on laptop
- Share files without cloud storage
- Collaborative workspaces in real-time

## The Infinite Canvas

### Beyond File Managers

The infinite canvas is a GPU-accelerated, infinite 2D plane where files appear as interactive tiles. It replaces the traditional file manager window.

**Traditional File Manager:**
```
┌──────────────────────────────────────┐
│  Name          Size   Type   Date    │
│  ───────────────────────────────    │
│  budget.xlsx   12 KB  XLSX  Jun 19  │
│  report.pdf   245 KB  PDF   Jun 18  │
│  photo.jpg    3.2 MB  JPEG  Jun 17  │
│  ...                                 │
└──────────────────────────────────────┘
```

**Kamelot Canvas:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│      ┌──────────┐                  ┌──────────┐            │
│      │ budget   │                  │  report  │            │
│      │ .xlsx    │◄────────────────►│  .pdf    │            │
│      └──────────┘   (bezier link)  └──────────┘            │
│                                                             │
│                     ┌──────────┐                            │
│                     │  notes   │                            │
│                     │  .md     │                            │
│                     └──────────┘                            │
│                                                             │
│  [Full screen] [42 files] [Zoom: 100%] [Position: center]  │
└─────────────────────────────────────────────────────────────┘
```

### Spatial Memory in Action

The canvas leverages your brain's spatial memory — the same cognitive system that lets you remember where things are in your physical environment.

People naturally organize by spatial position:
- "I put the budget spreadsheet in the top-left corner"
- "The project files are clustered in the center"
- "Reference documents are on the right side"

Over time, you develop spatial intuition. You don't need to remember filenames — you remember where things are on the canvas.

## The Immutable Ledger

### Time Travel for Your Files

Every operation is recorded in an immutable append-only ledger:

```
Block #0: Genesis
Block #1: PUT budget.xlsx
Block #2: PUT report.pdf
Block #3: PUT photo.jpg
Block #4: DELETE report.pdf (accidental)
Block #5: PUT new-report.pdf
```

You can roll back to any point:

```bash
kml rollback --to-block 3
# report.pdf is restored, new-report.pdf is removed
```

### Ransomware Protection

Ransomware encrypts files and demands payment. With Kamelot:

1. Ransomware encrypts your files
2. You notice something is wrong
3. You roll back to 10 minutes ago
4. Your files are restored

The rollback works because:
- Ransomware operations are recorded in the ledger
- The ledger cannot be modified (append-only)
- Rollback inverts all operations since the target time
- Encrypted files are removed, originals are restored

### Audit Trail

Every file operation is permanently recorded:

```bash
kml ledger --inode 7f3a5c91...
```

Output:
```
History of file budget.xlsx:
  Block #1:  PUT (2026-06-19 10:00:00)
  Block #5:  UPDATE (2026-06-19 12:00:00) — tags modified
  Block #8:  GET (2026-06-19 14:00:00) — accessed by user
```

This creates a complete, tamper-evident audit trail.

## K-Swarm Mesh Networking

### No Cloud Required

K-Swarm creates a direct encrypted connection between your devices:

```
Instead of:   Your files → Cloud Server → Your devices
K-Swarm:      Your devices ◄────────────► Your devices (encrypted, direct)
```

### Key Benefits

1. **No cloud dependency:** Files never leave your network
2. **End-to-end encryption:** Even your ISP cannot see file contents
3. **Low latency:** Direct connections are faster than cloud round-trips
4. **Offline-first:** Each device works independently
5. **No storage limits:** Use all the storage on all your devices

### Cross-Networking

K-Swarm works across the internet via:
- **NAT hole-punching:** Direct connections through firewalls
- **STUN/TURN relay:** Fallback when direct connection fails
- **mDNS discovery:** Automatic peer discovery on local networks
- **DHT discovery:** Global peer discovery via distributed hash table

## Comparison with Alternatives

### vs. Traditional File Managers

| Feature | File Manager (Nautilus, Finder, Explorer) | Kamelot |
|---------|------------------------------------------|---------|
| Organization | Folders (hierarchical) | Semantic vectors (graph) |
| Search | Keyword-based | Natural language + semantic |
| Encryption | None (unless filesystem-level) | XChaCha20-Poly1305 per file |
| Rollback | None (maybe recycle bin) | Immutable ledger, time-travel |
| Spatial memory | No | Infinite GPU canvas |
| Cross-device | Cloud sync (manual) | K-Swarm mesh (automatic) |
| AI integration | None | Local LLM (Qwen 2 VL) |
| Performance | CPU-based UI | GPU-accelerated canvas |

### vs. Cloud Storage

| Feature | Google Drive, Dropbox, OneDrive | Kamelot |
|---------|--------------------------------|---------|
| Privacy | Provider can access files | Zero-knowledge, encrypted |
| Cost | Monthly subscription | Free (open source) |
| Offline | Limited | Full offline support |
| Search | Limited keyword search | Semantic vector search |
| Storage limit | Yes (pay for more) | Your hardware, your limit |
| Internet required | Yes | No |
| Speed | Limited by bandwidth | Local network speed |

### vs. Desktop Search Tools

| Feature | Spotlight, Everything, DocFetcher | Kamelot |
|---------|----------------------------------|---------|
| Index type | Keyword index | Semantic vector index |
| Understanding | Literal word matching | Conceptual meaning |
| Visual search | No | Yes (Qwen 2 VL) |
| Encryption | No | Yes |
| Storage | Index only | Full file system |
| Rollback | No | Yes |

### vs. AI-Enhanced Note Apps

| Feature | Notion, Obsidian, Roam | Kamelot |
|---------|------------------------|---------|
| Scope | Notes/documents | All file types |
| Storage | Cloud or local DB | Native file system |
| Embedding | Cloud AI (Notion AI) | Local AI (privacy) |
| File types | Text, markdown | Any file type |
| Canvas | Limited | Unlimited, GPU-accelerated |
| Encryption | Optional | Mandatory, per-file |

## Technical Architecture Overview

### Layered Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   User Interface                         │
│  ┌─────────────────┐  ┌──────────────────────────────┐  │
│  │  CLI (kml)      │  │  GPU Canvas (kamelot-ui)     │  │
│  │  Terminal       │  │  Vulkan/Metal GPU Renderer   │  │
│  └────────┬────────┘  └──────────────┬───────────────┘  │
└───────────┼──────────────────────────┼──────────────────┘
            │                          │
┌───────────┼──────────────────────────┼──────────────────┐
│           │      Core Engine         │                  │
│  ┌────────┴──────────────────────────┴──────────────┐  │
│  │              Kamelot Core (Rust)                  │  │
│  │                                                   │  │
│  │  ┌───────────┐  ┌───────────┐  ┌──────────────┐  │  │
│  │  │  Ingest   │  │  Query    │  │  Ledger       │  │  │
│  │  │  Pipeline │  │  Pipeline │  │  Management   │  │  │
│  │  └─────┬─────┘  └─────┬─────┘  └──────┬───────┘  │  │
│  │        │              │                │          │  │
│  │  ┌─────┴─────┐  ┌─────┴─────┐  ┌──────┴───────┐  │  │
│  │  │ Crypto    │  │ Workspace │  │  K-Swarm     │  │  │
│  │  │ Engine    │  │ Manager   │  │  Mesh        │  │  │
│  │  └───────────┘  └───────────┘  └──────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
            │              │              │
┌───────────┼──────────────┼──────────────┼────────────────┐
│           │   Storage & Network Layer   │                │
│  ┌────────┴──────────┐  ┌──────────────┴─────────────┐  │
│  │  Encrypted Object │  │  Qdrant Vector Database    │  │
│  │  Store            │  │  HNSW Index                │  │
│  │  Flat namespace   │  │  Cosine Similarity Search  │  │
│  └───────────────────┘  └────────────────────────────┘  │
│  ┌───────────────────┐  ┌────────────────────────────┐  │
│  │  Ollama (Qwen)    │  │  K-Swarm P2P Network      │  │
│  │  Local LLM        │  │  Noise Protocol Encryption│  │
│  └───────────────────┘  └────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Component Responsibilities

**CLI (`kml`):**
- Command parsing and dispatch
- Terminal UI (color output, tables, progress bars)
- Scripting interface (JSON output, exit codes)
- Shell completion generation

**GPU Canvas (`kamelot-ui`):**
- Vulkan/Metal rendering engine
- SDF text rendering
- GPU-instanced tile rendering
- Bezier curve rendering
- Minimap and overview
- Omnibox overlay integration

**Core Engine (Rust library):**
- File ingestion pipeline (read → extract → embed → encrypt → store)
- Query pipeline (embed query → search Qdrant → decrypt → return)
- Ledger management (append blocks, verify chain, execute rollback)
- Workspace management (create, update, query, delete)
- Crypto operations (Argon2id KDF, XChaCha20 encrypt/decrypt)
- K-Swarm protocol (peer discovery, connection, file transfer)

**Storage Layer:**
- Flat object store (content-addressed, sharded)
- Ledger store (block files, index, HEAD pointer)
- Configuration store (TOML-based)

**External Services:**
- Qdrant: Vector database (embedded storage + HNSW index)
- Ollama: LLM runtime (model management + inference)

### Data Flow: End to End

**Ingestion:**
```
File on disk → Read bytes → Detect MIME type → Extract text/content
  → Send to Ollama → Get embedding vector → Encrypt original bytes
  → Store ciphertext in object store → Index vector in Qdrant
  → Record operation in ledger → Return inode
```

**Search:**
```
Natural language query → Send to Ollama → Get query embedding
  → Search Qdrant (cosine similarity, HNSW) → Get ranked results
  → Look up inodes in ledger → Decrypt metadata → Display results
```

**Rollback:**
```
Rollback command → Verify ledger integrity → Find target block
  → Invert operations (PUT→DELETE, DELETE→RESTORE, UPDATE→REVERT)
  → Execute inversions (decrypt/restore files, update Qdrant)
  → Append rollback block to ledger → Verify final state
```

---

## Detailed Architecture Diagrams

### Module Dependency Graph

```
kamelot-core
├── kamelot-cli (depends on core)
├── kamelot-ui (depends on core)
├── kamelot-daemon (depends on core)
└── kamelot-kswarm (depends on core)

kamelot-core
├── pipeline/         (ingest + query pipelines)
│   ├── ingest.rs     (file reading, MIME detection, text extraction)
│   ├── embed.rs      (embedding generation via Ollama)
│   ├── encrypt.rs    (XChaCha20-Poly1305 encryption)
│   ├── store.rs      (object store read/write)
│   ├── index.rs      (Qdrant vector index operations)
│   └── ledger.rs     (block creation and appending)
├── query/
│   ├── search.rs     (Qdrant search, result ranking)
│   ├── filter.rs     (MIME, tag, date, size filters)
│   └── similar.rs    (similarity search by inode)
├── crypto/
│   ├── kdf.rs        (Argon2id key derivation)
│   ├── cipher.rs     (XChaCha20-Poly1305 implementation)
│   └── key.rs        (key management, session keys)
├── ledger/
│   ├── block.rs      (block structure and serialization)
│   ├── chain.rs      (block chain verification)
│   ├── rollback.rs   (state inversion logic)
│   └── diff.rs       (state comparison)
├── workspace/
│   ├── manager.rs    (CRUD for workspaces)
│   ├── query.rs      (workspace query execution)
│   └── snapshot.rs   (workspace state snapshots)
├── config/
│   ├── settings.rs   (configuration schema)
│   └── store.rs      (config persistence)
├── kswarm/
│   ├── peer.rs       (peer discovery and management)
│   ├── protocol.rs   (Noise protocol implementation)
│   ├── sync.rs       (index and file sync)
│   └── transfer.rs   (file transfer protocol)
└── canvas/
    ├── layout.rs     (node position, zoom, viewport)
    ├── link.rs       (bezier curve links)
    └── cluster.rs    (semantic clustering algorithm)

kamelot-ui
├── renderer/
│   ├── vulkan.rs     (Vulkan rendering backend)
│   ├── metal.rs      (Metal rendering backend)
│   ├── shader/       (GLSL/Metal shader sources)
│   ├── tile.rs       (file tile rendering)
│   ├── bezier.rs     (curve rendering)
│   └── text.rs       (SDF text rendering)
├── ui/
│   ├── canvas.rs     (main canvas widget)
│   ├── toolbar.rs    (toolbar UI)
│   ├── omnibox.rs    (search overlay)
│   ├── minimap.rs    (minimap widget)
│   └── inspector.rs  (file info panel)
└── input/
    ├── hotkey.rs     (global hotkey registration)
    ├── gesture.rs    (pan, zoom, tap gesture handling)
    └── drag.rs       (drag-and-drop handling)

kamelot-cli
├── commands/
│   ├── init.rs       (kml init)
│   ├── put.rs        (kml put)
│   ├── get.rs        (kml get)
│   ├── query.rs      (kml query)
│   ├── list.rs       (kml list)
│   ├── rollback.rs   (kml rollback)
│   ├── status.rs     (kml status)
│   ├── config.rs     (kml config)
│   ├── ledger.rs     (kml ledger)
│   ├── workspace.rs  (kml workspace)
│   ├── kswarm.rs     (kml kswarm)
│   └── ui.rs         (kml ui)
├── output.rs         (table, JSON, CSV, YAML formatting)
└── completion.rs     (shell completion generation)
```

### State Machine Diagrams

**Store Lifecycle:**
```
UNINITIALIZED → INITIALIZING → LOCKED → UNLOCKED → ACTIVE
                    │                              │
                    └── (error) → ERROR            │
                                                   │
                   ACTIVE ←────────── UNLOCKED ←───┘
                     │
                     ├──→ LOCKED (timeout)
                     ├──→ ERROR (fatal)
                     └──→ CLOSED (shutdown)
```

**Ingestion Pipeline State Machine:**
```
READY → READING_FILE → DETECTING_MIME → EXTRACTING_TEXT
                                              │
                                              ▼
                                       GENERATING_EMBEDDING
                                              │
                                              ▼
                                       ENCRYPTING_CONTENT
                                              │
                                              ▼
                                       STORING_OBJECT
                                              │
                                              ▼
                                       INDEXING_VECTOR
                                              │
                                              ▼
                                       RECORDING_LEDGER
                                              │
                                              ▼
                                       COMPLETE → READY
                                              │
                                         (on error)
                                              ▼
                                          ERROR
```

### Sequence Diagrams

**File Search - Complete Flow:**

```
User            CLI            Core           Ollama          Qdrant          Ledger
 │               │              │               │               │               │
 │──query───────▶│              │               │               │               │
 │               │──embed──────▶│               │               │               │
 │               │              │──api_call────▶│               │               │
 │               │              │◀──embedding───│               │               │
 │               │              │               │               │               │
 │               │              │──search──────▶│               │               │
 │               │              │               │──hnsw_query──▶│               │
 │               │              │               │◀──results─────│               │
 │               │              │               │               │               │
 │               │              │──lookup──────▶│               │               │
 │               │              │               │               │──get_block───▶│
 │               │              │◀──metadata────│               │◀──data────────│
 │               │              │               │               │               │
 │               │◀──results────│               │               │               │
 │◀──display─────│              │               │               │               │
 │               │              │               │               │               │
```

## Deployment Scenarios

### Single User, Single Device

The simplest setup. One Kamelot store, one device, local Qdrant and Ollama.

```
┌─────────────────────────────────────┐
│  Laptop                              │
│  ┌──────────┐  ┌──────┐  ┌───────┐ │
│  │ Kamelot  │  │Qdrant│  │Ollama │ │
│  │ CLI + UI │  │Docker│  │Server │ │
│  └──────────┘  └──────┘  └───────┘ │
└─────────────────────────────────────┘
```

**Setup:**
```bash
kml init ./kamelot_store
# Ensure Qdrant and Ollama are running locally
```

### Single User, Multiple Devices

One user with a desktop, laptop, and phone. K-Swarm connects them.

```
┌──────────────┐     K-Swarm      ┌──────────────┐
│  Desktop      │◄───────────────►│  Laptop       │
│  (full store) │                 │  (index only) │
└──────┬───────┘                  └──────────────┘
       │ K-Swarm
       │
┌──────▼───────┐
│  NAS/Server   │
│  (file store) │
└──────────────┘
```

**Setup:**
```bash
# Desktop (full)
kml init ./store
kml kswarm start

# NAS (storage backend)
kml init /mnt/storage/kamelot --headless
kml kswarm start

# Laptop (index only)
kml init ./store
kml config set kswarm.store_mode "index-only"
kml kswarm start
```

### Team Collaboration

Multiple users sharing workspaces and files.

```
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Alice   │  │  Bob     │  │  Carol   │
│  (dev)   │  │(designer)│  │  (pm)    │
└────┬─────┘  └────┬─────┘  └────┬─────┘
     │              │              │
     └──────────────┼──────────────┘
                    │
             ┌──────▼──────┐
             │  K-Swarm     │
             │  Mesh        │
             └─────────────┘
```

**Setup:**
```bash
# Each user:
kml init ./store
kml config set kswarm.node_name "Alice-Dev"
kml kswarm start

# Alice shares a workspace
kml workspace create "Project-Alpha" --tag "team:alpha"
kml kswarm share-workspace "Project-Alpha" --peer Bob --peer Carol
```

### Enterprise Deployment

Organization-wide deployment with compliance and SSO.

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Dept A     │  │  Dept B     │  │  Dept C     │
│  (finance)  │  │  (legal)    │  │  (eng)      │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
                  ┌──────▼──────┐
                  │  Enterprise  │
                  │  LDAP/SSO   │
                  │  Central    │
                  │  Ledger     │
                  └─────────────┘
```

## Frequently Asked Questions

### Is Kamelot a replacement for my existing filesystem?

No. Kamelot sits on top of your existing filesystem. It reads files from your current storage and creates its own encrypted store. Your original files remain untouched. Think of Kamelot as a semantic overlay, not a replacement.

### How does Kamelot handle very large files?

Files larger than 100 MB (configurable) are ingested without embeddings by default. They are still encrypted and stored, but not indexed for semantic search. You can force embedding for large files, but it may be slow.

### Can I use Kamelot without Ollama?

Yes. Use the mock embedding backend: `kml put file.pdf --model mock` or configure mock as default: `kml config set ollama.model mock`. Mock embeddings are deterministic but not semantically meaningful.

### Can I use Kamelot without Qdrant?

Yes, but without vector search. Basic operations (put, get, list, delete) work without Qdrant. Semantic search requires Qdrant.

### How much storage overhead does Kamelot add?

- Encrypted files: ~1.6% overhead (24-byte nonce + 16-byte auth tag)
- Embeddings: 384 floats = 1,536 bytes per file
- Ledger: ~200 bytes per operation
- Total: approximately 2-5% overhead, depending on file sizes

### Can I recover my files if Kamelot is deleted?

Your encrypted files are stored in the Kamelot store directory. As long as you have the store directory and your master passphrase, you can recover files by reinstalling Kamelot and unlocking the store.

### Can I use the same store across different operating systems?

Yes. The store format is platform-independent. You can copy a store directory between Linux, Windows, and macOS.

### Is Kamelot suitable for SSD/NVMe drives?

Yes. Kamelot is optimized for SSD storage. The flat object store and sequential ledger writes are particularly well-suited to SSDs.

### Does Kamelot work with network-attached storage (NAS)?

Yes. You can place the store directory on a NAS mount. For best performance, keep Qdrant on local SSD storage and point the object store to the NAS.

### Can I migrate my files out of Kamelot?

Yes. Use `kml get <inode> --output <path>` to retrieve any file in its original format. Use `kml list --format json` to enumerate all files for bulk export.

---

*Next: [03 — User Personas](03-user-personas.md)*
