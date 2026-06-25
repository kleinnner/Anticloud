                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                

# Virtual Query Directories

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

- [Introduction](#introduction)
- [The Concept](#the-concept)
- [Path Convention](#path-convention)
- [Kernel Module Architecture](#kernel-module-architecture)
- [WinFSP Implementation](#winfsp-implementation)
- [FUSE Implementation](#fuse-implementation)
- [Path Interception Flow](#path-interception-flow)
- [Dynamic Directory Generation](#dynamic-directory-generation)
- [Directory Structure](#directory-structure)
- [File Representation in Virtual Directories](#file-representation-in-virtual-directories)
- [Query Resolution Flow](#query-resolution-flow)
- [Caching Strategy](#caching-strategy)
- [Permission Model](#permission-model)
- [Performance Considerations](#performance-considerations)
- [Edge Cases](#edge-cases)
- [Shell Integration](#shell-integration)
- [Application Compatibility](#application-compatibility)
- [Configuration Options](#configuration-options)
- [Implementation Details](#implementation-details)
- [Advanced Query Syntax](#advanced-query-syntax)
- [Real-World Examples](#real-world-examples)
- [Comparison with Traditional Mounts](#comparison-with-traditional-mounts)
- [Limitations](#limitations)
- [Future Enhancements](#future-enhancements)

---

## Introduction

Virtual query directories are the primary mechanism by which Kamelot presents semantic search results as a navigable file system. By intercepting specially-formatted paths at the kernel level, Kamelot transforms natural language queries into dynamically-generated directories containing symlinks or direct file handles to semantically matching files.

This approach means that any application — from a terminal shell to a file manager to an IDE's file open dialog — can perform semantic search without any modifications. The file system itself becomes the search interface.

---

## The Concept

The core insight behind virtual query directories is simple: if a file system can translate a path like `/kml/q/tax documents 2025` into a directory containing tax-related files from 2025, then every application becomes a semantic search client.

The user never needs to learn a custom query language or use a separate search tool. They simply navigate to the path that describes what they want, and the file system does the rest.

### How It Differs from Traditional Search

Traditional file system search (like `find`, `grep`, or Windows Search) operates as a layer on top of the file system. It indexes content and provides search results, but those results are ephemeral — displayed in a search results window that disappears when dismissed.

Virtual query directories are persistent, navigable, and composable:
- Results persist as long as the directory is open
- Results can be copied, moved, or opened like any other files
- Results can be piped to other commands
- Results update automatically as new files are indexed

---

## Path Convention

Virtual query directories follow the path convention:

```
/kml/q/<natural language query>
```

### Path Structure

| Component | Description | Example |
|-----------|-------------|---------|
| `/kml` | Kamelot root namespace | - |
| `/kml/q` | Query directory indicator | - |
| `<query>` | URL-encoded natural language query | `tax+documents+2025` |

### URL Encoding

Since file system paths have restrictions on certain characters, the query portion is URL-encoded:

| Character | Encoded | Reason |
|-----------|---------|--------|
| Space | `+` or `%20` | Path separator |
| `/` | `%2F` | Directory separator |
| `?` | `%3F` | Wildcard in some shells |
| `*` | `%2A` | Wildcard in some shells |
| `"` | `%22` | Shell quoting issues |
| `'` | `%27` | Shell quoting issues |
| `\` | `%5C` | Escape character |
| `:` | `%3A` | Drive letter separator (Windows) |

### Root Query Directory

Listing `/kml/q/` shows all recent or bookmarked queries:

```
/kml/q/
├── tax documents 2025/
├── machine learning papers/
├── photos from vacation/
├── budget spreadsheets/
└── project plans/
```

Each subdirectory is a previously-executed query whose results are cached and still valid.

### Special Paths

| Path | Description |
|------|-------------|
| `/kml/q/` | List of recent queries |
| `/kml/q/_all` | All indexed files |
| `/kml/q/_recent` | Recently modified files |
| `/kml/q/_bytype/<ext>` | Files by type (e.g., `.pdf`, `.rs`) |
| `/kml/q/_bytag/<tag>` | Files by tag or label |
| `/kml/q/_similar/<inode>` | Files similar to the given inode |

---

## Kernel Module Architecture

The virtual directory system is implemented at two levels: a kernel-mode driver (WinFSP on Windows, FUSE on Linux/macOS) and a user-mode daemon.

```graphify
graph TD
    subgraph "Kernel Mode"
        APP[Application<br/>explorer.exe, ls, etc.]
        VFS[VFS Layer]
        DRV[WinFSP/FUSE<br/>Driver]
    end
    subgraph "User Mode"
        DAEMON[Kamelot VFS<br/>Daemon]
        RESOLVER[Virtual Directory<br/>Resolver]
        QUERY[Query Engine]
        CACHE[Result Cache]
        QDRANT[Qdrant Client]
        EMBED[Qwen Embedder]
    end
    APP --> VFS
    VFS --> DRV
    DRV --> DAEMON
    DAEMON --> RESOLVER
    RESOLVER --> QUERY
    QUERY --> CACHE
    QUERY --> EMBED
    QUERY --> QDRANT
```

### Communication Flow

1. Application issues a path operation (open, stat, readdir)
2. The kernel module intercepts the operation
3. If the path matches `/kml/q/*`, it is forwarded to the user-mode daemon
4. The daemon resolves the virtual path, executes the query, and returns results
5. The kernel module presents results to the application as if they were real files

---

## WinFSP Implementation

On Windows, Kamelot uses WinFSP (Windows File System Proxy) to create a user-mode file system. WinFSP provides a FUSE-like API for Windows, allowing Kamelot to define custom file system behavior.

### WinFSP Architecture

```graphify
graph TD
    subgraph "Windows Kernel"
        NTOS[NTOSKRNL]
        IOMGR[I/O Manager]
        FSD[File System Driver]
        WINFSPSYS[WinFSP.sys]
    end
    subgraph "User Mode"
        WINFSPDLL[WinFSP.dll]
        KAMELOTDLL[Kamelot VFS DLL]
        DAEMON2[Kamelot Daemon]
    end
    NTOS --> IOMGR
    IOMGR --> FSD
    FSD --> WINFSPSYS
    WINFSPSYS --> WINFSPDLL
    WINFSPDLL --> KAMELOTDLL
    KAMELOTDLL --> DAEMON2
```

### WinFSP Operations Implemented

| Operation | Description | Kamelot Behavior |
|-----------|-------------|------------------|
| `GetVolumeInfo` | Volume metadata | Returns "Kamelot Semantic FS" |
| `Open` | Open a file or directory | Resolves path, creates handle |
| `Close` | Close a handle | Cleans up resources |
| `Read` | Read file contents | Decrypts and returns data |
| `Write` | Write file contents | Encrypts and indexes new data |
| `ReadDirectory` | List directory contents | Executes query, returns results |
| `GetSecurityByName` | Get file security | Returns default ACL |
| `SetFileSize` | Truncate file | Creates new version |
| `GetFileInfo` | Get file metadata | Returns query result metadata |
| `Rename` | Rename file | Tags file with new name |
| `Delete` | Delete file | Marks file as deleted in ledger |

---

## FUSE Implementation

On Linux and macOS, Kamelot uses the FUSE (Filesystem in Userspace) API. The implementation patterns are similar, but the APIs differ.

### FUSE Operations Implemented

| Operation | Description | Kamelot Behavior |
|-----------|-------------|------------------|
| `init` | Mount initialization | Connect to daemon socket |
| `destroy` | Unmount cleanup | Flush caches |
| `getattr` | Get file attributes | Returns metadata from query result |
| `readdir` | List directory | Executes query, returns matching filenames |
| `open` | Open a file | Resolves virtual path to real inode |
| `read` | Read file contents | Streams decrypted content |
| `write` | Write file contents | Encrypts and indexes new version |
| `mkdir` | Create directory | Creates a static collection |
| `rmdir` | Remove directory | Removes static collection |
| `unlink` | Delete file | Marks as deleted |
| `rename` | Rename/move | Updates metadata |

### Mount Point

```bash
# Mount Kamelot at a specific path
kml mount /mnt/kamelot

# Verify mount
mount | grep kamelot
# kamelot on /mnt/kamelot type fuse.kamelot (rw,nosuid,nodev)
```

---

## Path Interception Flow

The detailed flow when a path is accessed:

```graphify
sequenceDiagram
    participant App as Application
    participant KM as Kernel Module
    participant VD as Virtual Directory Resolver
    participant QE as Query Engine
    participant Cache as Result Cache

    App->>KM: open("/kml/q/tax documents 2025")
    KM->>KM: Match pattern /kml/q/*
    KM->>VD: Forward path
    VD->>VD: Extract query: "tax documents 2025"
    VD->>Cache: Check cache for query
    Cache-->>VD: Cache miss (or stale)
    VD->>QE: Execute semantic query
    QE->>QE: Embed query text
    QE->>QE: Search Qdrant for nearest neighbors
    QE-->>VD: Return results (inodes + metadata)
    VD->>Cache: Store results with TTL
    VD-->>KM: Return virtual directory listing
    KM-->>App: Directory handle
    App->>KM: readdir(dir)
    KM-->>App: tax_report.pdf, invoice_2025.pdf, ...
    App->>KM: stat("tax_report.pdf")
    KM->>VD: Resolve file
    VD->>Cache: Lookup file in query results
    Cache-->>VD: Found inode 42
    VD-->>KM: File attributes
    KM-->>App: stat result
    App->>KM: read("tax_report.pdf")
    KM->>VD: Stream file
    VD->>VD: Locate blob in flat store
    VD->>VD: Decrypt blob
    VD-->>KM: Decrypted content stream
    KM-->>App: File content
```

---

## Dynamic Directory Generation

When a query directory is accessed, Kamelot generates the directory contents dynamically:

### Step 1: Query Extraction

The query is extracted from the path and URL-decoded:

```
Path: /kml/q/tax+documents+2025
Query: "tax documents 2025"
```

### Step 2: Embedding

The query string is embedded using Qwen 2 VL:

```rust
let query_vector = embedder.embed("tax documents 2025")?;
```

### Step 3: Vector Search

The query vector is searched against Qdrant:

```rust
let results = qdrant.search(SearchRequest {
    collection_name: "kamelot_vectors".into(),
    vector: query_vector,
    limit: 100,
    score_threshold: Some(0.65),
    with_payload: true,
})?;
```

### Step 4: Directory Population

Results are transformed into directory entries:

```rust
let entries: Vec<DirEntry> = results.into_iter().map(|r| {
    let metadata: Metadata = r.payload.into();
    DirEntry {
        name: metadata.filename,
        inode: r.id as u64,
        size: metadata.size,
        modified: metadata.modified_at,
        kind: FileKind::RegularFile,
        similarity: r.score,
    }
}).collect();
```

### Step 5: Caching

The directory listing is cached for a configurable TTL (default: 60 seconds):

```rust
cache.set(query_key, CachedResult {
    entries: entries.clone(),
    expires_at: Instant::now() + Duration::from_secs(60),
    query_vector: query_vector.clone(),
});
```

---

## Directory Structure

A virtual query directory appears as a standard directory to applications:

```
/kml/q/tax documents 2025/
├── tax_report_2024.pdf          (similarity: 0.94)
├── invoice_2025_03.pdf          (similarity: 0.91)
├── budget_2025.xlsx             (similarity: 0.87)
├── tax_notes.txt                (similarity: 0.85)
├── irs_forms_2025.pdf           (similarity: 0.82)
├── accountant_contact.vcf       (similarity: 0.78)
├── deduction_calculator.xlsx    (similarity: 0.76)
├── previous_year_returns.zip    (similarity: 0.73)
├── tax_software_receipt.pdf     (similarity: 0.71)
├── property_tax_assessment.pdf  (similarity: 0.68)
├── estimated_tax_payments.xlsx  (similarity: 0.66)
└── readme.txt                   (similarity: 0.65)
```

### Virtual Metadata

Files in virtual directories expose additional metadata through extended attributes:

```bash
# View similarity score
getfattr -n kamelot.similarity tax_report_2024.pdf
# kamelot.similarity="0.94"

# View query that produced this directory
getfattr -n kamelot.query .
# kamelot.query="tax documents 2025"

# View original path (if file was once in a traditional FS)
getfattr -n kamelot.origin tax_report_2024.pdf
# kamelot.origin="/home/user/Documents/Tax/tax_report_2024.pdf"

# View embedding timestamp
getfattr -n kamelot.embedded_at tax_report_2024.pdf
# kamelot.embedded_at="2025-01-15T14:30:00Z"
```

---

## File Representation in Virtual Directories

Files in virtual directories can be represented in several ways:

### Symlink Mode (Default)

Each file in a virtual directory is a symbolic link to the actual file in the flat store:

```
tax_report.pdf -> /kml/.store/000000000000002a.bin
```

This mode provides maximum compatibility with applications that follow symlinks.

### Direct Handle Mode

Each file is presented as a direct file handle backed by the Kamelot daemon. The file appears in the virtual directory with its original name but its contents are served by Kamelot.

### Passthrough Mode

Files are represented as copies of the originals, giving each file a standalone existence. Changes to a passthrough file do not affect the original.

### Hybrid Mode

Small files (text, code) use direct handle mode. Large files (video, archives) use symlink mode. Configurable by file type and size threshold.

---

## Query Resolution Flow

The complete flow from query to file content:

```graphify
flowchart TD
    A[Natural Language Query] --> B[Qwen 2 VL Embedder]
    B --> C[1536-dim Vector]
    C --> D[Qdrant HNSW Search]
    D --> E[Top-k Inode Results]
    E --> F[Inode → sled Metadata Lookup]
    F --> G[Build Virtual Directory]
    G --> H{Application Action}
    
    H --> I[List Directory]
    I --> J[Return Filenames + Metadata]
    
    H --> K[Open File]
    K --> L[Lookup Inode in Flat Store]
    L --> M[Decrypt Blob with XChaCha20]
    M --> N[Stream Content to Application]
    
    H --> O[Write File]
    O --> P[Encrypt New Content]
    P --> Q[Store in Flat Store]
    Q --> R[Re-embed Content]
    R --> S[Update Qdrant Vector]
    S --> T[Append to .aioss Ledger]
```

---

## Caching Strategy

Query results are cached at multiple levels to ensure responsiveness:

### Level 1: In-Memory Cache

| Parameter | Value |
|-----------|-------|
| Storage | HashMap in daemon process |
| Max entries | 1000 |
| Default TTL | 60 seconds |
| Eviction | LRU |
| Memory per entry | ~1 MB (100 results) |

### Level 2: On-Disk Cache

| Parameter | Value |
|-----------|-------|
| Storage | sled database |
| Max entries | 10,000 |
| Default TTL | 24 hours |
| Eviction | Time-based |
| Disk usage | ~10 GB (1000 entries × 100 results) |

### Cache Invalidation

The cache is invalidated when:
- New files are ingested (partial invalidation of affected queries)
- Files are deleted (results refreshed)
- The embedding model is updated (full cache flush)
- Explicit `kml cache clear` command
- TTL expires

---

## Permission Model

Virtual query directories respect the permissions of the underlying files:

| Scenario | Behavior |
|----------|----------|
| File readable by user | Appears in query results |
| File not readable by user | Filtered out of results |
| Directory not readable | Cannot use as mount point |
| Cross-user queries | Results limited to accessible files |

### Access Control Lists

The Kamelot daemon runs as the current user and inherits their permissions. Files are only accessible through the VFS if the daemon user has permission to read them.

---

## Performance Considerations

### Directory Listing Latency

| Query Type | Cold Cache | Warm Cache |
|-----------|-----------|-----------|
| Simple query (1-2 words) | 150 ms | 2 ms |
| Complex query (full sentence) | 250 ms | 2 ms |
| Broad query (>100 results) | 300 ms | 3 ms |
| Narrow query (<5 results) | 120 ms | 1 ms |

### File Open Latency

| File Size | First Open | Subsequent Opens |
|-----------|-----------|------------------|
| 1 KB | 5 ms | 0.5 ms |
| 100 KB | 8 ms | 0.8 ms |
| 10 MB | 45 ms | 5 ms |
| 100 MB | 350 ms | 30 ms |

### Throughput

| Operation | Max Throughput |
|-----------|---------------|
| Directory listings | 500 / second |
| File opens | 2000 / second |
| File reads (sequential) | 500 MB/s |
| File reads (random 4K) | 50,000 IOPS |

---

## Edge Cases

### Empty Results

When a query returns no results, the directory appears empty:

```bash
ls -la /kml/q/xyznonexistentthing
# total 0
# dr-xr-xr-x 2 user user 0 Jan 1 00:00 .
# dr-xr-xr-x 2 user user 0 Jan 1 00:00 ..
```

### Ambiguous Queries

Ambiguous queries may return unexpected results. Kamelot uses the following heuristics:
- Broad queries are broken into sub-queries
- Results are annotated with similarity scores
- The top-3 semantic interpretations are considered

### Special Characters in Queries

Special file system characters are URL-encoded in the path. Kamelot supports both `+` and `%20` for spaces, and standard URL encoding for other characters.

### Very Long Paths

Windows has a 260-character path limit (or 32,767 with long path support). Kamelot truncates query paths that would exceed limits, warning the user.

### Concurrent Access

Multiple applications can access the same virtual directory simultaneously. Kamelot ensures consistency by:
- Locking the query result cache per-query
- Serializing writes to the flat store
- Using atomic ledger operations

---

## Shell Integration

Virtual query directories integrate naturally with command-line shells:

### Unix Shells (bash, zsh, fish)

```bash
# List files related to a topic
ls /mnt/kamelot/kml/q/machine+learning+papers

# Copy all matching files to a local directory
cp /mnt/kamelot/kml/q/photos+2025/* ~/Photos/

# Open a matching file
xdg-open /mnt/kamelot/kml/q/budget/planning.xlsx

# Use in pipes
cat /mnt/kamelot/kml/q/meeting+notes/* | grep "action item"

# Use with rsync
rsync -av /mnt/kamelot/kml/q/project+backup/ /backup/

# Count files
ls /mnt/kamelot/kml/q/all+pdfs | wc -l
```

### Windows Shell (cmd.exe, PowerShell)

```cmd
:: List files related to a topic
dir \\kamelot\kml\q\tax documents 2025

:: Copy matching files
copy \\kamelot\kml\q\photos+2025\* C:\Photos\

:: Open a file in virtual directory
start \\kamelot\kml\q\budget\planning.xlsx

:: Use in PowerShell pipeline
Get-ChildItem \\kamelot\kml\q\meeting+notes | Select-String "action item"
```

### Tab Completion

Kamelot supports tab completion for query directories by listing known recent queries as completion candidates. Shell integration scripts are provided:

```bash
# Install shell integration
kml shell-integration bash  # or zsh, fish
```

This adds tab completion for `/kml/q/` paths and defines helper functions:

```bash
# Shortcuts
kq "tax documents"     # cd /mnt/kamelot/kml/q/tax+documents
kmls "papers"          # ls -la /mnt/kamelot/kml/q/papers
kcp "photos" /dest     # cp -r /mnt/kamelot/kml/q/photos/* /dest
```

---

## Application Compatibility

### File Managers

| Application | Compatibility | Notes |
|------------|--------------|-------|
| Windows Explorer | Full | Mounted as network drive or drive letter |
| Finder (macOS) | Full | Mounted as FUSE volume |
| Nautilus (Linux) | Full | Mounted as FUSE volume |
| Thunar (Linux) | Full | Mounted as FUSE volume |
| Total Commander | Full | Network drive support |
| Double Commander | Full | FUSE/WinFSP support |

### IDEs and Editors

| Application | Compatibility | Notes |
|------------|--------------|-------|
| VS Code | Full | Open folder in virtual directory |
| IntelliJ IDEA | Full | File open dialogs can browse VFS |
| Vim/Neovim | Full | Direct path access |
| Emacs | Full | Direct path access |
| Sublime Text | Full | File open dialogs work |
| Obsidian | Partial | Vault must be a real directory; can link to VFS files |

### Other Applications

| Application | Compatibility | Notes |
|------------|--------------|-------|
| Office 365 | Full | Save and open through VFS |
| Adobe Acrobat | Full | Read PDFs from virtual directories |
| Media players | Full | Play media files through VFS |
| Image viewers | Full | Browse and view images |
| Compression tools | Full | Zip/unzip through VFS |
| Backup software | Full | Backup tool sees real files |

### Known Incompatibilities

| Application | Issue | Workaround |
|------------|-------|-----------|
| Some antivirus software | May interfere with WinFSP driver | Add Kamelot to exclusion list |
| Windows Search Indexer | Cannot index virtual directories | File-based bridge indexer |
| Older Win32 applications | 260-char path limit | Enable long paths or use subst |
| Sandboxed applications (UWP) | Cannot access VFS | Use file picker bridge |

---

## Configuration Options

Virtual query directories can be configured in `config.toml`:

```toml
[vfs]
# Default query result count
default_top_k = 100

# Maximum query result count
max_top_k = 10000

# Similarity threshold (0.0 - 1.0)
default_threshold = 0.65

# Cache TTL in seconds
cache_ttl = 60

# Maximum cache entries
max_cache_entries = 1000

# Symlink vs direct handle
# Options: "symlink", "direct", "passthrough", "hybrid"
file_representation = "hybrid"

# Enable extended attributes
extended_attributes = true

# Enable sticky queries (queries persist until cleared)
sticky_queries = false

# Show similarity scores in directory listing
show_scores = true

# Virtual directory path prefix
path_prefix = "/kml/q"

# Query path encoding
# Options: "url", "base64", "none"
path_encoding = "url"
```

---

## Implementation Details

### Daemon Architecture

The VFS daemon is implemented as an async event loop using tokio:

```rust
#[tokio::main]
async fn main() {
    // Initialize subsystems
    let store = FlatStore::open(config.store_path).await?;
    let qdrant = QdrantClient::connect(config.qdrant_addr).await?;
    let embedder = QwenEmbedder::load(config.model_path)?;
    let ledger = Ledger::open(config.ledger_path)?;
    let cache = QueryCache::new(config.cache_size);

    // Start the WinFSP/FUSE event loop
    let fs = KamelotFS::new(store, qdrant, embedder, ledger, cache);
    let mount = Mount::new(config.mount_point, fs);
    mount.run().await?;
}
```

### Path Parsing

```rust
struct QueryPath {
    prefix: String,    // "/kml/q"
    query: String,     // "tax documents 2025"
    encoded: String,   // "tax+documents+2025"
}

fn parse_query_path(path: &str) -> Option<QueryPath> {
    let path = path.trim_start_matches('/');
    let parts: Vec<&str> = path.splitn(3, '/').collect();
    
    if parts.len() < 3 || parts[0] != "kml" || parts[1] != "q" {
        return None;
    }
    
    let encoded = parts[2].to_string();
    let query = urlencoding::decode(&encoded).ok()?;
    
    Some(QueryPath {
        prefix: "/kml/q".into(),
        query,
        encoded,
    })
}
```

### Directory Entry Generation

```rust
async fn generate_directory(
    query: &str,
    top_k: usize,
    threshold: f32,
    cache: &QueryCache,
    qdrant: &QdrantClient,
    store: &FlatStore,
) -> Result<Vec<DirEntry>> {
    // Check cache first
    if let Some(cached) = cache.get(query) {
        return Ok(cached);
    }
    
    // Embed the query
    let vector = embedder.embed(query)?;
    
    // Search Qdrant
    let results = qdrant
        .search(SearchRequest {
            vector,
            limit: top_k as u64,
            score_threshold: Some(threshold),
            ..Default::default()
        })
        .await?;
    
    // Build directory entries
    let mut entries = Vec::new();
    for r in results {
        let inode = r.id as u64;
        let metadata = store.get_metadata(inode)?;
        entries.push(DirEntry {
            name: metadata.filename,
            inode,
            size: metadata.size,
            modified: metadata.modified_at,
            similarity: r.score,
        });
    }
    
    // Cache and return
    cache.set(query, entries.clone());
    Ok(entries)
}
```

---

## Advanced Query Syntax

### Boolean Operators

```
/kml/q/tax+AND+2025          # Must contain both concepts
/kml/q/tax+OR+budget         # Either concept
/kml/q/tax+NOT+2024          # Tax documents, excluding 2024
```

### Field Filters

```
/kml/q/tax+type:pdf          # Only PDF files
/kml/q/photos+size:large     # Large files only
/kml/q/project+date:2025     # From 2025
/kml/q/code+lang:rust        # Rust source files
```

### Date Ranges

```
/kml/q/reports+from:2024-01+to:2025-06
/kml/q/photos+before:2025-01-01
/kml/q/documents+after:2024-06
```

### Similarity Controls

```
/kml/q/machine+learning+min:0.8   # Minimum similarity 0.8
/kml/q/budget+top:50              # Return top 50 results
/kml/q/meetings+exact             # Exact match (higher threshold)
/kml/q/explore+max:500            # Broad exploration
```

### Composition

```
/kml/q/tax+AND+business+NOT+personal+type:pdf+from:2024+top:20
```

---

## Real-World Examples

### Example 1: Finding Tax Documents

```bash
# Mount Kamelot
kml mount /mnt/kamelot

# Navigate to tax documents
cd /mnt/kamelot/kml/q/tax+documents+2025

# List all matching files
ls -la
# -rw-r--r-- 1 user user  2.4M Mar 15 2024 tax_report_2024.pdf
# -rw-r--r-- 1 user user  128K Feb 20 2025 invoice_2025_03.pdf
# -rw-r--r-- 1 user user   45K Jan 10 2025 budget_2025.xlsx
# ...

# Copy all PDFs to local folder
cp *.pdf ~/Desktop/tax_pack/

# Open the main tax report
xdg-open tax_report_2024.pdf
```

### Example 2: Project Planning

```bash
# Create a workspace from a query
kml workspace create "Q3 Planning" --query "Q3+goals+planning+roadmap"

# The workspace opens in the canvas UI automatically
# Files are laid out spatially by semantic relationship

# Work in the workspace directory
cd /mnt/kamelot/kml/q/Q3+planning

# Edit a file in VS Code
code planning_doc.md
```

### Example 3: Photo Organization

```bash
# Find all beach photos
cd /mnt/kamelot/kml/q/beach+vacation+photos

# Copy to shared folder
cp -r * /shared/photos/

# Find photos similar to a specific one
cd /mnt/kamelot/kml/q/_similar/0000000000000042
```

### Example 4: Development Workflow

```bash
# Find all files related to a bug fix
cd /mnt/kamelot/kml/q/bugfix+memory+leak

# Search within results for specific content
grep -r "unsafe" .

# Open relevant source files
code src/memory_manager.rs
```

---

## Comparison with Traditional Mounts

| Aspect | Virtual Query Directory | Traditional Directory |
|--------|----------------------|---------------------|
| Content | Dynamic, query-dependent | Static, user-defined |
| Creation | Implicit on access | Explicit (mkdir) |
| Persistence | Cache TTL | Permanent until deleted |
| Structure | Flat list with scores | Arbitrary hierarchy |
| Navigation | By meaning | By path |
| Performance | 150ms first access | Instant |
| Disk usage | Cache only | Full file tree |
| Backup | Not needed (regenerable) | Required |

---

## Limitations

### Query Precision

Natural language queries are inherently imprecise. Two users with the same query may expect different results. Kamelot addresses this through adjustable thresholds and iterative refinement.

### Performance on First Access

Cold query directories require embedding + search, taking 100-300 ms. Subsequent accesses are cached and near-instant.

### Application Compatibility

Some applications that use low-level file system APIs may not handle virtual directories correctly. This affects a small percentage of applications.

### Path Length Limits

On Windows, the 260-character MAX_PATH limit can be reached with complex queries. Long path support (Windows 10 1607+) is recommended.

### No Native Rename/Move

Renaming a file within a virtual directory does not change the underlying file's metadata. Use the flat store operations for permanent changes.

---

## Future Enhancements

### Persistent Query Bookmarks

Users will be able to bookmark queries, giving them stable paths that persist across restarts:

```
/kml/q/@taxes     -> bookmark for "tax documents"
/kml/q/@work      -> bookmark for "work projects"
```

### Query Composition

Combine multiple queries:

```
/kml/q/+taxes+AND+/kml/q/@work
```

### Recursive Queries

Query within query results:

```
/kml/q/taxes/2024
```

### Live Queries

Queries that continuously update as new files are indexed, without requiring cache expiry.

### Federated Queries

Query across multiple Kamelot instances on different devices:

```
/kml/q/@remote:server1/taxes
```

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
