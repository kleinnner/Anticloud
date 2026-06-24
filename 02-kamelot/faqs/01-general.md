                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                
# FAQ — General Questions

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. [What Is Kamelot?](#what-is-kamelot)
2. [How Is Kamelot Different from Regular File Search?](#how-is-kamelot-different-from-regular-file-search)
3. [Do I Need to Learn New Commands?](#do-i-need-to-learn-new-commands)
4. [Is It a Replacement for My Current Filesystem?](#is-it-a-replacement-for-my-current-filesystem)
5. [Do I Need Internet Access to Use Kamelot?](#do-i-need-internet-access-to-use-kamelot)
6. [Can I Still Use My Existing Applications?](#can-i-still-use-my-existing-applications)
7. [Is Kamelot Free?](#is-kamelot-free)
8. [What File Types Does Kamelot Support?](#what-file-types-does-kamelot-support)
9. [How Does Kamelot Protect My Privacy?](#how-does-kamelot-protect-my-privacy)
10. [Can Kamelot Index Files on Network Drives?](#can-kamelot-index-files-on-network-drives)
11. [Does Kamelot Work with Cloud Sync Services?](#does-kamelot-work-with-cloud-sync-services)
12. [How Many Files Can Kamelot Handle?](#how-many-files-can-kamelot-handle)
13. [What Is the .aioss Ledger?](#what-is-the-aioss-ledger)
14. [What Is a Synthetic Workspace?](#what-is-a-synthetic-workspace)
15. [What Is the Omnibox?](#what-is-the-omnibox)
16. [What Platforms Does Kamelot Support?](#what-platforms-does-kamelot-support)
17. [How Do I Update Kamelot?](#how-do-i-update-kamelot)
18. [How Do I Uninstall Kamelot?](#how-do-i-uninstall-kamelot)
19. [Where Can I Get Help?](#where-can-i-get-help)
20. [How Is Kamelot Licensed?](how-is-kamelot-licensed)

---

## What Is Kamelot?

Kamelot is a semantic vector file system that sits on top of your existing filesystem and lets you find any file by describing what it contains, in natural language. Instead of browsing through folders or searching by filename, you type a description of the file you're looking for — "the architecture diagram from Q2 planning" or "the email about the server migration" — and Kamelot finds it instantly.

Under the hood, Kamelot uses AI to generate vector embeddings of your file contents, stores them in the Qdrant vector database, and performs similarity search to find the most relevant files. It presents these files through a virtual filesystem mount (using FUSE on Linux/macOS or WinFSP on Windows) and through a graphical Omnibox search interface.

Kamelot is fully self-hosted, fully offline-capable, and end-to-end encrypted. Your files never leave your machine.

---

## How Is Kamelot Different from Regular File Search?

Traditional file search tools (Windows Search, macOS Spotlight, Everything, Alfred) search by **filename** and sometimes by **file metadata** (date modified, file size, file type). They do not understand file **content** in any meaningful semantic way.

Kamelot searches by **semantic content**. It reads the actual content of your files, converts them into vector embeddings (mathematical representations of meaning), and searches for files whose meaning matches your query. This means:

- You can find files without knowing their filename
- You can use vague, natural language queries
- You can find files by describing what they contain, not what they're called
- You can find files that don't have any of your query words in them (e.g., "budget spreadsheet" finds a file called "Q3_Financial_Overview.xlsx")
- You can find images by describing what they depict

---

## Do I Need to Learn New Commands?

No. Kamelot is designed to be used without learning any new commands or workflows.

If you prefer the command line, you can use the `kml` CLI tool with intuitive subcommands like `kml find`, `kml put`, `kml get`, and `kml rollback`. But the primary interface is the **Omnibox** — a global hotkey (configurable, default `Ctrl+Space`) that opens a search bar from anywhere in your system.

You can also access your files through the Kamelot virtual drive (mounted at `/kml` on Linux/macOS or `K:\` on Windows), which works like any regular folder in your file manager.

If you prefer to keep using your current workflow entirely, you can: Kamelot indexes your files silently in the background and you only interact with it when you need to find something.

---

## Is It a Replacement for My Current Filesystem?

No. Kamelot **sits on top of** your existing filesystem. Your actual files remain where they are, in your existing folders. Kamelot does not move, rename, or modify your original files.

The Kamelot virtual drive (mounted at `/kml` or `K:\`) provides an **additional** way to access your files. All your original files are still accessible through their original paths. Kamelot does not replace your filesystem; it augments it with semantic search capabilities.

Think of Kamelot as a search index for your brain — it remembers what your files contain so you don't have to remember where you put them. Your files stay exactly where you left them.

---

## Do I Need Internet Access to Use Kamelot?

No. Kamelot is fully offline-capable.

- Core functionality: Fully offline
- AI embedding generation: Fully offline (local model via Ollama)
- Vector search: Fully offline (local Qdrant)
- UI: Fully offline (native GPU application)
- File access: Fully offline (local flat store)

The only features that require internet access are:
- Initial download of the AI model (4+ GB, one-time)
- Software updates
- Community support forum access

Kamelot works on airplanes, in remote field locations, in bunkers, and on air-gapped networks. You do not need any internet connectivity for day-to-day operation.

---

## Can I Still Use My Existing Applications?

Yes. Kamelot is designed to be transparent to your existing applications.

When you open a file through the Kamelot virtual drive (`/kml` or `K:\`), it appears as a regular file to your operating system and all applications. You can open it in any application — Word, Excel, Photoshop, VS Code, your browser — without any special configuration.

Kamelot provides a POSIX-compatible FUSE filesystem (on Linux/macOS) or a WinFSP filesystem (on Windows) that presents your indexed files in a virtual directory structure. Any application that can read files from your filesystem can read files through Kamelot.

---

## Is Kamelot Free?

Kamelot is free for individual use. You can download, install, and use Kamelot indefinitely without paying anything.

There are no subscriptions, no usage limits, no data caps, and no "pro" features locked behind a paywall. The core functionality — semantic search, file indexing, Omnibox, virtual filesystem mount, encryption — is completely free.

Optional paid services include:
- **Community License**: A supporter tier with priority community support ($50-$100 one-time)
- **Enterprise Support**: Professional support with SLAs, custom development, and deployment assistance ($5,000-$150,000/year)
- **Consulting and Training**: Custom integration and training services ($200-$500/hour)

---

## What File Types Does Kamelot Support?

Kamelot supports a wide range of file types for content indexing:

### Text-Based Formats (Full Content Parsing)
- Documents: PDF, DOCX, XLSX, PPTX, ODT, ODS, ODP, RTF
- Code: .rs, .py, .js, .ts, .go, .java, .c, .cpp, .h, .rb, .php, .swift, .kt, .scala, .lua, .r, .m, .mm, .pl, .sh, .bash, .zsh, .fish, .ps1, .bat, .sql, .html, .css, .scss, .less, .xml, .json, .yaml, .yml, .toml, .ini, .cfg, .conf, .md, .rst, .tex, .bib
- Email: .eml, .msg (MIME parsing)

### Image-Based Formats (Visual + Text Extraction)
- .jpg, .jpeg, .png, .gif, .bmp, .tiff, .tif, .webp, .svg, .ico, .psd, .ai, .eps
- Text extraction via OCR (when running multimodal model)
- Visual embedding via Qwen 2 VL

### Audio/Video (Metadata + Transcription)
- .mp3, .wav, .flac, .ogg, .aac, .wma, .m4a (metadata + optional transcription)
- .mp4, .mov, .avi, .mkv, .webm (metadata + optional transcription)

### Archive Formats (Content Listing)
- .zip, .tar, .gz, .bz2, .xz, .7z, .rar (indexes filenames and metadata of contents)

### Other Formats
- Binary file detection with metadata extraction
- Unknown file types indexed by metadata (filename, size, dates, MIME type)

---

## How Does Kamelot Protect My Privacy?

Kamelot uses a comprehensive zero-knowledge architecture:

1. **All processing is local**: File contents are processed on your machine. They never leave your computer.
2. **All storage is encrypted**: Files in the flat store are encrypted with XChaCha20-Poly1305 AEAD, per-file, with keys derived from your master key.
3. **No telemetry by default**: Kamelot does not phone home. Opt-in telemetry is anonymous and stores data locally.
4. **No cloud dependency**: No data is sent to any third-party server for any purpose, including AI inference and vector search.
5. **Optional offline mode**: For maximum privacy, you can run Kamelot on a machine that has never been connected to the internet.
6. **Open source**: The core components are open source under permissive licenses, allowing independent security audit.
7. **Auditable**: The .aioss ledger provides a complete, immutable audit trail of all file operations.

---

## Can Kamelot Index Files on Network Drives?

Kamelot indexes local filesystems only. Support for network drives and NAS devices is limited:

1. **Direct indexing of network paths**: Not recommended for performance reasons. Network latency significantly slows down embedding generation and file reads.
2. **Syncing approach**: The recommended approach is to sync the network drive content to a local directory and index that directory. Kamelot can watch for changes.
3. **FUSE forward**: The Kamelot virtual drive can be shared over the network via SMB/NFS, making indexed files available to other machines on the network.

---

## Does Kamelot Work with Cloud Sync Services?

Kamelot works alongside cloud sync services (Dropbox, Google Drive, OneDrive, Sync, etc.) but with some considerations:

1. **Indexing synced folders**: You can point Kamelot to index your cloud sync folders (e.g., `~/Dropbox`). Kamelot will index the local copies of your synced files.
2. **Conflict handling**: If Kamelot is indexing a file while it's being synced, file locking may cause temporary issues. The ingestion pipeline handles this gracefully.
3. **No deduplication**: Kamelot sees local and cloud copies as separate files (which they are, on disk). You may want to exclude the cloud sync folder if it duplicates local content.
4. **Bandwidth considerations**: Kamelot reads files from disk, not from the network. It does not generate additional cloud sync traffic.

---

## How Many Files Can Kamelot Handle?

Kamelot's architecture is designed to scale from hundreds to millions of files:

| File Count | RAM Required | Storage Overhead | Search Latency |
|-----------|-------------|-----------------|----------------|
| <10,000 | 2-4 GB | ~100 MB | <50ms |
| 10,000-100,000 | 4-8 GB | ~1 GB | <100ms |
| 100,000-500,000 | 8-16 GB | ~5 GB | <200ms |
| 500,000-1,000,000 | 16-32 GB | ~10 GB | <500ms |
| >1,000,000 | 32+ GB (or sharded) | ~10 GB + | <2s (sharded) |

The main bottleneck is Qdrant's HNSW index, which lives in RAM for fast search. With sufficient RAM, Kamelot can index and search millions of files efficiently.

---

## What Is the .aioss Ledger?

The .aioss ledger (Advanced Immutable Open Storage System) is the append-only metadata journal at the heart of Kamelot's data model. Every file operation — create, read, update, delete, rename, rollback — is recorded as an immutable entry in the ledger.

Key properties:
- **Append-only**: Entries are never modified or deleted, only appended
- **Immutable**: Past entries cannot be altered without breaking cryptographic chain
- **Auditable**: Complete history of all file operations
- **Rollback-capable**: Any previous state can be reconstructed
- **Backup-friendly**: Sequential export is simple and fast

The .aioss ledger is stored in the Kamelot data directory and replicated for redundancy.

---

## What Is a Synthetic Workspace?

A Synthetic Workspace is a virtual directory in the Kamelot FUSE mount that presents files based on semantic criteria rather than physical location. Think of it as a "smart folder" that automatically includes files matching certain criteria.

For example, you can create a Workspace called "Q2 2026 Projects" that shows all files related to your Q2 projects, regardless of where they're physically stored on disk. The Workspace is populated automatically based on content similarity, file type, date range, or custom tags.

Workspaces are:
- **Dynamic**: They update automatically as new files are indexed
- **Non-destructive**: They don't move or copy files
- **Shareable**: Workspace definitions can be exported and shared
- **Composable**: Files can appear in multiple workspaces

---

## What Is the Omnibox?

The Omnibox is Kamelot's primary search interface — a global search bar that you can open from anywhere with a configurable hotkey (default: `Ctrl+Space`).

Features:
- **Real-time results**: Results appear as you type, updating every 100ms
- **Vague queries**: "that thing from last month" works as well as "Q3 budget"
- **Result previews**: Thumbnails, file metadata, and content snippets
- **Quick actions**: Open, copy path, show in folder, share
- **Keyboard-first**: Full keyboard navigation for power users
- **Cross-platform**: Same experience on Linux, Windows, macOS

---

## What Platforms Does Kamelot Support?

| Platform | Status | Notes |
|----------|--------|-------|
| Linux (x86_64) | **Supported** | Primary development platform |
| Linux (aarch64) | **Beta** | Raspberry Pi, ARM servers |
| Windows (x86_64) | **Beta** | WinFSP-based filesystem bridge |
| Windows (aarch64) | **Planned** | ARM Windows support |
| macOS (x86_64) | **Alpha** | macOSFUSE-based bridge |
| macOS (Apple Silicon) | **Planned** | Native ARM64 build |
| FreeBSD | **Planned** | Community-driven |

---

## How Do I Update Kamelot?

### Linux (Package Managers)
```bash
# Homebrew
brew upgrade kamelot

# APT (Debian/Ubuntu)
sudo apt update && sudo apt upgrade kamelot

# Snap
sudo snap refresh kamelot
```

### Windows
```bash
# Chocolatey
choco upgrade kamelot

# Or download latest MSI from kamelot.ai
```

### macOS
```bash
# Homebrew
brew upgrade kamelot
```

### Manual Update
```bash
# Check current version
kml --version

# Download latest
curl -O https://releases.kamelot.ai/latest/kamelot-{platform}.tar.gz

# Verify signature
gpg --verify kamelot-{platform}.tar.gz.asc

# Install
tar -xzf kamelot-{platform}.tar.gz
sudo mv kamelot /usr/local/bin/
```

Updates preserve your index, configuration, and ledger. Always back up before major version upgrades.

---

## How Do I Uninstall Kamelot?

### Linux
```bash
# Package manager
sudo apt remove kamelot    # Debian/Ubuntu
brew uninstall kamelot     # Homebrew
sudo snap remove kamelot   # Snap

# Remove data directory (includes all indexed data)
rm -rf ~/.kamelot
```

### Windows
```bash
# Chocolatey
choco uninstall kamelot

# Or use "Add or Remove Programs" in Settings

# Remove data directory
Remove-Item -Recurse -Force "$env:USERPROFILE\.kamelot"
```

### macOS
```bash
brew uninstall kamelot
rm -rf ~/.kamelot
```

**Important:** Uninstalling Kamelot does not affect your original files. Your original files remain exactly as they were. Only the Kamelot index, ledger, and configuration are removed.

---

## Where Can I Get Help?

- **Documentation**: [docs.kamelot.ai](https://docs.kamelot.ai)
- **GitHub Discussions**: [github.com/kamelot/kamelot/discussions](https://github.com/kamelot/kamelot/discussions)
- **Discord Server**: [discord.gg/kamelot](https://discord.gg/kamelot)
- **Matrix Space**: [#kamelot:matrix.org](https://matrix.to/#/#kamelot:matrix.org)
- **Community Wiki**: [wiki.kamelot.ai](https://wiki.kamelot.ai)
- **Enterprise Support**: [enterprise@kamelot.ai](mailto:enterprise@kamelot.ai)

---

## How Is Kamelot Licensed?

Kamelot's core components are dual-licensed under MIT and Apache 2.0. Specific components have different licenses:

| Component | License |
|-----------|---------|
| Kamelot daemon (core) | MIT / Apache-2.0 |
| Kamelot CLI (kml) | MIT / Apache-2.0 |
| Vello UI | MIT / Apache-2.0 |
| WinFSP driver | GPL-3.0 with linking exception |
| libfuse3 driver | GPL-2.0 with FUSE exception |
| Qdrant (downloaded separately) | Apache-2.0 |
| Ollama (downloaded separately) | MIT |
| Qwen 2 VL model (downloaded separately) | Apache-2.0 |

See the [Software Bill of Materials](docs/feature-paper/04-software-bill-of-materials.md) for full license details.

---

## What Is Kamelot's Relationship with Ollama and Qdrant?

Kamelot uses Ollama and Qdrant as optional dependencies, but is not affiliated with either project. Kamelot is an independent open-source project developed by Lois-Kleinner & 0-1.gg.

- **Ollama**: Provides local AI model serving. Kamelot is one of many applications that use Ollama.
- **Qdrant**: Provides vector database functionality. Kamelot uses Qdrant's open-source self-hosted version.

You can use Kamelot without these dependencies in mock mode (development, testing) or with alternative backends.

---

## How Does Kamelot Handle Symbolic Links?

Kamelot follows symbolic links by default during indexing. If a symlink points to a file, Kamelot indexes the target file's content. If a symlink points to a directory, Kamelot indexes the directory's contents.

### Configuration

```toml
[indexing]
follow_symlinks = false    # Don't follow symlinks
follow_symlinks = true     # Follow symlinks (default)
```

When `follow_symlinks = false`, Kamelot indexes the symlink itself (by filename and metadata), not the target. This prevents duplicate indexing when symlinks create multiple paths to the same file.

---

## Does Kamelot Support Case-Sensitive Search?

Kamelot's semantic search is inherently case-insensitive because the embedding model represents meaning, not exact text. However, the keyword search component (BM25) is case-sensitive by default for exact-match queries.

| Search Mode | Case Sensitivity | Notes |
|-------------|-----------------|-------|
| Semantic (vector) | Case-insensitive | Matches by meaning |
| Keyword (BM25) | Case-sensitive | Exact text match |
| Hybrid (both) | Mixed | Combines both approaches |

You can configure keyword search behavior:

```toml
[search]
keyword_case_sensitive = false   # Case-insensitive keyword matching
```

---

## Can I Search Inside Compressed Archives?

Kamelot indexes the filenames and metadata of files inside archives (.zip, .tar, .gz, .7z, .rar). It does not extract and index the full content of files within archives by default.

### Archive Content Indexing

```toml
[indexing]
extract_archives = true                  # Extract and index archive contents
archive_max_size_mb = 100                # Maximum archive size to extract
archive_max_files = 1000                 # Maximum files per archive
```

Enabling archive extraction will index the full content of files within archives but increases indexing time and storage usage significantly.

---

## Does Kamelot Support Regular Expression Search?

Kamelot does not natively support regular expression search. However, the hybrid search mode can be configured for advanced pattern matching through the keyword search component:

```bash
# Use keyword search with glob patterns (limited)
kml find "*.pdf" --mode keyword

# For true regex, pipe results through grep
kml find "budget report" --json | jq '.[].path' | grep -E 'Q[0-9]'
```

Full regex support is planned for a future version.

---

## What Happens When I Delete a File Through Kamelot?

When you delete a file through the Kamelot virtual drive (FUSE mount), the behavior depends on the FUSE driver implementation:

- **Linux (FUSE)**: Delete operations are passed through to the original filesystem. The original file is deleted.
- **Windows (WinFSP)**: Currently read-only. Delete is not supported. A warning is shown.
- **CLI delete**: `kml delete <inode>` removes the file from the index and marks it as deleted in the ledger, but does not delete the original file.

### Safe Delete via CLI

```bash
# Remove from index only (original file preserved)
kml delete --index-only <inode>

# Remove from index and mark as deleted in ledger
kml delete <inode>

# Permanently remove (cannot be recovered)
kml delete --purge <inode>
```

---

## Can I Use Kamelot on a Server with Multiple Users?

Kamelot is designed as a single-user system. Multi-user configurations are possible but require workarounds:

### Option 1: Shared Daemon (Advanced)

Run a single Kamelot daemon on a server and share access via SSH:
- Each user connects via SSH to run `kml find` commands
- All users share the same index
- No user isolation or access control

### Option 2: Separate Instances

Each user runs their own Kamelot instance with separate data directories:
- Complete data isolation
- Each user must index their own files
- Resource duplication (multiple Qdrant, Ollama processes)

### Option 3: Enterprise (Planned)

Multi-user with RBAC, SSO, and shared index is planned for v1.5+ with Enterprise Support.

---

## How Does Kamelot Handle Temporary Files?

Kamelot automatically excludes common temporary file patterns:

| Pattern | Example | Excluded By Default |
|---------|---------|-------------------|
| `*.tmp` | `document.tmp` | Yes |
| `*.swp` | `file.rs.swp` | Yes |
| `*.swo` | `file.rs.swo` | Yes |
| `~$*` | `~$doc.docx` | Yes |
| `*~` | `file.txt~` | Yes |
| `*.bak` | `config.bak` | Yes |
| `thumbs.db` | Windows thumbnail cache | Yes |
| `.DS_Store` | macOS metadata | Yes |

You can configure additional exclusions:

```toml
[indexing]
exclude_patterns = [
    "**/.git/**",
    "**/node_modules/**",
    "**/__pycache__/**",
    "**/*.log",
    "**/tmp/**"
]
```

---

## Does Kamelot Index Hidden Files and Directories?

By default, Kamelot does index hidden files and directories (files starting with `.` on Linux/macOS, or files with the Hidden attribute on Windows). However, common hidden directories like `.git`, `.svn`, and `node_modules` are excluded by default.

To explicitly include or exclude hidden files:

```toml
[indexing]
exclude_hidden = true    # Exclude all hidden files and directories
```

When `exclude_hidden = true`, Kamelot ignores any file or directory starting with `.` (Unix) or with the Hidden attribute set (Windows). Use this for privacy if you have sensitive dotfile content.

---

## Can I Use Kamelot Without the GPU UI?

Yes. Kamelot functions fully without the GPU UI:

- **CLI only**: All search and management operations are available via `kml` commands
- **Daemon mode**: Start the daemon without the UI: `kml start --no-ui`
- **Headless server**: Install on a server without a display (SSH access only)
- **Mock mode**: `kml start --model mock` for development without AI model

The GPU UI (Omnibox) provides the best experience for most users, but the CLI is equally capable for power users.

---

## What Is the Difference Between `kml` and `kamelot`?

`kml` is the CLI tool. `kamelot` is the daemon process. They are separate binaries:

| Command | Binary | Purpose |
|---------|--------|---------|
| `kml find "query"` | `kml` | CLI for search and management |
| `kml start` | `kml` | Starts the daemon process |
| `kamelot` (daemon) | `kamelot` | Background service (managed by `kml`) |
| `kml doctor` | `kml` | Diagnostic tool |

For everyday use, you only interact with `kml`. The daemon (`kamelot`) runs in the background and is managed by `kml start`, `kml stop`, and `kml restart`.

---

## How Do I Migrate Kamelot to a New Computer?

### Migration Steps

1. **On the old computer**, back up essential data:
   ```bash
   # Export encryption keys
   kml keys export --output /backup/kamelot-keys.enc
   
   # Back up the ledger (critical for history)
   cp -r ~/.kamelot/ledger /backup/
   
   # Back up the flat store (encrypted files)
   cp -r ~/.kamelot/store /backup/
   
   # Back up configuration
   cp ~/.kamelot/config.toml /backup/
   
   # Optional: Export Qdrant snapshot
   curl -X POST http://localhost:6333/snapshots
   curl -o /backup/qdrant-snapshot.snapshot http://localhost:6333/snapshots/<id>
   ```

2. **On the new computer**, install Kamelot:
   ```bash
   # Install Kamelot
   # Stop the daemon if running
   kml stop
   
   # Restore data
   cp -r /backup/ledger ~/.kamelot/
   cp -r /backup/store ~/.kamelot/
   cp /backup/config.toml ~/.kamelot/
   
   # Import encryption keys
   kml keys import --input /backup/kamelot-keys.enc
   
   # Restart
   kml start
   ```

3. **Verify**:
   ```bash
   kml doctor
   kml find "test migration"
   ```

The migration preserves your full search history, file versions, and encryption configuration. The original files must be present on the new computer for the flat store to serve decrypted content.

---

## How Does Kamelot Handle Race Conditions During File Operations?

Kamelot uses several mechanisms to handle concurrent file operations:

1. **Atomic ledger writes**: Each ledger entry is written atomically. Partial writes are impossible due to the append-only design with integrity checks.

2. **File locking**: The ingestion pipeline uses advisory file locks to prevent two instances from indexing the same file simultaneously.

3. **Idempotent indexing**: If a file is indexed twice, the second index updates the existing entry rather than creating a duplicate.

4. **Conflict resolution**: If a file is modified during indexing, Kamelot detects the content hash change and re-indexes the latest version.

5. **Graceful degradation**: If Qdrant or the flat store is temporarily unavailable, the daemon queues operations and retries.

These mechanisms ensure data consistency even under concurrent file operations from external applications.

---

## How Does Kamelot Handle Very Long File Paths?

Kamelot indexes files regardless of path length. However, the FUSE/WinFSP virtual drive may have platform-specific path length limitations:

| Platform | Maximum Path Length | Notes |
|----------|-------------------|-------|
| Linux | 4096 characters | FUSE inherits OS limit |
| macOS | 1024 characters | APFS limit |
| Windows | 260 characters (default) | Can be extended to 32,767 |

For Windows, Kamelot recommends enabling long path support:

```powershell
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" `
  -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

Within the flat store, file paths are stored as metadata and have no practical length limit. The path length only matters when accessing files through the FUSE/WinFSP virtual drive.

---

## Does Kamelot Support File Tags or Labels?

Kamelot does not have a built-in tagging system, but it provides several ways to organize files semantically:

### Built-in Organization

1. **Synthetic Workspaces**: Virtual folders that automatically include files matching semantic criteria
2. **Content-based grouping**: Files are grouped by content similarity in the Canvas view
3. **Date-based filtering**: Files can be filtered by creation/modification date
4. **Type-based filtering**: Filter by file extension or MIME type
5. **Custom tags via metadata**: File metadata (from the original filesystem) can include tags

### Third-Party Tag Integration

If your OS or application adds tags to files:
- **macOS**: Finder tags are indexed as part of file metadata
- **Windows**: File property tags are indexed
- **Linux**: Extended attributes (xattr) tags can be indexed

```toml
[indexing]
index_extended_attributes = true  # Index Linux xattr tags
```

---

## How Do I Know If Kamelot Is Indexing My Files?

Kamelot provides several indicators of indexing activity:

### Visual Indicators

- **Omnibox**: Shows indexing progress when opened during active indexing
- **CLI**: `kml status` shows indexing progress, files indexed, and any errors
- **System tray**: Planned for v0.4 (icon shows active indexing)

### CLI Commands

```bash
# Check indexing status
kml status

# Output:
# Daemon: running
# Index: 47,293 files indexed
# Indexing: active (12 files/s)
# Estimated completion: 3 minutes
# Errors: 2 (see `kml doctor`)

# View recent indexing activity
kml logs --grep "Indexed" --tail 20

# Check index freshness
kml stats --index
```

### Log Monitoring

```bash
# Watch indexing progress in real-time
kml logs --tail --grep "ingest"
```

The daemon logs show each batch of indexed files with timing information, allowing you to monitor progress and identify slow files.

---

## Can I Exclude Specific File Types from Indexing?

Yes. Kamelot's configuration allows fine-grained control over which file types are indexed:

### Excluding by Extension

```toml
[indexing]
exclude_patterns = [
    "**/*.exe",
    "**/*.dll",
    "**/*.so",
    "**/*.dylib",
    "**/*.iso",
    "**/*.vhd",
    "**/*.vmdk",
    "**/*.zip",     # Archives indexed by metadata only
    "**/*.tar.gz",
    "**/*.7z",
]
```

### Including Only Specific Types

```toml
[indexing]
include_patterns = [
    "**/*.md",
    "**/*.rs",
    "**/*.py",
    "**/*.js",
    "**/*.ts",
    "**/*.pdf",
    "**/*.docx",
    "**/*.xlsx",
]
```

When `include_patterns` is set, only matching files are indexed. Files matching `exclude_patterns` are always excluded.

### MIME Type Filtering

```toml
[indexing]
include_mime_types = ["text/*", "application/pdf", "image/*"]
exclude_mime_types = ["video/*", "audio/*"]
```

MIME type filtering uses the file's detected MIME type, which is more reliable than extension-based filtering for files with incorrect extensions.

---

## What Is the Difference Between Indexing and Syncing?

Kamelot performs **indexing**, not **syncing**:

| Feature | Indexing (Kamelot) | Syncing (Dropbox, etc.) |
|---------|-------------------|------------------------|
| What it does | Creates a searchable catalog of files | Copies files between locations |
| File modification | Never touches original files | Creates copies on all synced devices |
| Storage usage | Small index (~1% of file size) | Full copies on each device |
| Network usage | None (local) | Significant (cloud transfer) |
| Goal | Find files quickly | Keep files in sync across devices |

Kamelot indexes your files where they are. It does not create copies, move files, or sync them anywhere. This makes it complementary to cloud sync services — use Dropbox/Google Drive for sync, and Kamelot for search.

---

## Can Kamelot Search Inside Encrypted Files?

Kamelot cannot search inside encrypted files because it cannot read their content. However, it does index them by:

- **Filename** and extension
- **File size** and modification date
- **MIME type** (detected from header bytes when possible)
- **Tags** and metadata (where available)

### Types of Encrypted Files

| Encryption Type | Content Indexed? | Metadata Indexed? |
|----------------|-----------------|-------------------|
| Password-protected PDF | No | Yes |
| PGP-encrypted file | No | Yes |
| VeraCrypt volume | No | No (appears as single file) |
| eCryptfs (filesystem-level) | Yes (OS decrypts transparently) | Yes |
| BitLocker/LUKS (disk-level) | Yes (OS decrypts transparently) | Yes |

### Best Practice

If you need to search encrypted file contents, decrypt the files before indexing or use filesystem-level encryption (eCryptfs, LUKS, BitLocker) that Kamelot can read through the OS decryption layer.

---

## Does Kamelot Index Files on Removable Media Automatically?

Kamelot does not automatically index files on removable media (USB drives, SD cards, external hard drives). You must explicitly index them:

```bash
# Index a USB drive
kml index /media/usb/projects

# Index an external drive
kml index /mnt/external/documents
```

### Automatic Detection (Planned)

Automatic detection of removable media is planned for a future version. When implemented, Kamelot will:
- Detect newly connected USB drives
- Prompt to index (user must confirm)
- Remove from index when drive is disconnected
- Show files as "available when drive connected" in search results

Until then, manually index removable drives when connected.

---

## How Does Kamelot Handle Filename Encoding Differences?

Kamelot handles files with various filename encodings:

| Encoding | Support | Notes |
|----------|---------|-------|
| UTF-8 | Full | All platforms |
| UTF-16 | Windows | Converted to UTF-8 internally |
| Latin-1 | Limited | Not recommended for filenames |
| Shift-JIS | Limited | Japanese filenames on Windows |

### Normalization

Kamelot does not normalize Unicode filenames by default. This means:
- A file named `café.txt` (NFC) and `café.txt` (NFD) are treated as different files
- This primarily affects macOS (which uses NFD) when sharing with Linux (NFC)

To enable normalization:

```toml
[indexing]
unicode_normalization = "NFC"  # Normalize all filenames to NFC
```

This ensures consistent behavior across platforms but may cause duplicate entries if files with different normalization forms exist.

---

## What Is the `kml doctor` Command?

`kml doctor` is Kamelot's diagnostic tool that performs comprehensive system checks:

### What It Checks

| Check | What It Verifies |
|-------|-----------------|
| Kamelot version | Binary version vs expected |
| Daemon status | Is the daemon running? |
| Qdrant connection | Can Kamelot reach Qdrant? |
| Ollama connection | Can Kamelot reach Ollama? |
| Model status | Is the embedding model loaded? |
| FUSE mount | Is the virtual drive mounted? |
| Configuration | Is config.toml valid? |
| Encryption keys | Are keys present and valid? |
| Ledger integrity | Is the .aioss ledger intact? |
| Disk space | Is there enough free space? |
| Memory usage | Is memory usage within limits? |

### Usage

```bash
# Quick check
kml doctor

# Verbose output (recommended for troubleshooting)
kml doctor --verbose

# Check specific component
kml doctor --component qdrant
kml doctor --component ollama
kml doctor --component fuse

# Generate report for support
kml doctor --report > kamelot-diagnostic.txt
```

Run `kml doctor` before reporting issues to ensure you have complete diagnostic information.
