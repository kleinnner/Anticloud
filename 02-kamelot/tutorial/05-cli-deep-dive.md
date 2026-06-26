                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                

# 05 — CLI Deep Dive

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. [Overview](#overview)
2. [Command Structure](#command-structure)
3. [Global Options](#global-options)
4. [kml init](#kml-init)
5. [kml put](#kml-put)
6. [kml get](#kml-get)
7. [kml query](#kml-query)
8. [kml list](#kml-list)
9. [kml similar](#kml-similar)
10. [kml rollback](#kml-rollback)
11. [kml status](#kml-status)
12. [kml config](#kml-config)
13. [kml ledger](#kml-ledger)
14. [kml unlock](#kml-unlock)
15. [kml resolve](#kml-resolve)
16. [kml ui](#kml-ui)
17. [kml completion](#kml-completion)
18. [Shell Completions](#shell-completions)
19. [Output Formats](#output-formats)
20. [Batch Processing](#batch-processing)
21. [Scripting with Kamelot](#scripting-with-kamelot)
22. [Exit Codes](#exit-codes)
23. [Environment Variables](#environment-variables)

---

## Overview

The `kml` CLI is the primary way to interact with Kamelot from the terminal. It follows a command-subcommand structure similar to `git` or `docker`. Every operation available in the GPU canvas UI is also available through the CLI, making it suitable for both interactive use and scripting.

This reference covers every command, flag, and option. Use it as a comprehensive reference manual.

## Command Structure

```
kml [global options] <COMMAND> [command options] [arguments...]
```

### Top-Level Commands

| Command | Description |
|---------|-------------|
| `init` | Initialize a new Kamelot store |
| `put` | Ingest files into the store |
| `get` | Retrieve files from the store |
| `query` | Search files using natural language |
| `list` | List files in the store |
| `similar` | Find files similar to a given file |
| `rollback` | Roll back store to previous state |
| `status` | Show store status and statistics |
| `config` | View or modify configuration |
| `ledger` | View or verify the ledger |
| `unlock` | Unlock the store |
| `resolve` | Resolve a filename to an inode |
| `ui` | Launch the GPU canvas UI |
| `completion` | Generate shell completion scripts |
| `help` | Print help information |

## Global Options

These options apply to all commands:

| Flag | Description |
|------|-------------|
| `--store <PATH>` | Path to the Kamelot store (default: `./kamelot_data` or `KAMELOT_STORE`) |
| `--verbose` | Enable verbose output |
| `--quiet` | Suppress all non-error output |
| `--json` | Output in JSON format (where applicable) |
| `--color <WHEN>` | Color output: `auto`, `always`, `never` (default: `auto`) |
| `--no-color` | Disable color output (equivalent to `--color never`) |
| `-h`, `--help` | Print help information |
| `-V`, `--version` | Print version information |

### Usage Examples

```bash
# Use a specific store
kml --store ~/work_kamelot put document.pdf

# Verbose mode shows detailed progress
kml --verbose put large_directory/ --recursive

# Quiet mode for scripting
kml --quiet put automated_report.pdf

# JSON output globally
kml --json status
```

## kml init

Initialize a new Kamelot store.

### Synopsis

```
kml init [OPTIONS] [PATH]
```

### Description

Creates a new Kamelot store at the specified path. If no path is given, the current directory is used. The store contains the encrypted object store, ledger, and configuration.

### Options

| Option | Description |
|--------|-------------|
| `--passphrase <PASSPHRASE>` | Provide passphrase non-interactively (insecure for shared terminals) |
| `--passphrase-file <FILE>` | Read passphrase from a file |
| `--force` | Overwrite an existing store |
| `--qdrant-host <HOST>` | Qdrant host (default: `127.0.0.1`) |
| `--qdrant-port <PORT>` | Qdrant REST port (default: `6333`) |
| `--qdrant-grpc-port <PORT>` | Qdrant gRPC port (default: `6334`) |
| `--qdrant-api-key <KEY>` | Qdrant API key |
| `--qdrant-tls` | Use TLS for Qdrant connection |
| `--collection <NAME>` | Qdrant collection name (default: `kamelot`) |
| `--vector-size <N>` | Vector dimensions (default: `384`) |
| `--no-qdrant` | Initialize without Qdrant (no indexing) |
| `--model <MODEL>` | Default embedding model (default: `qwen2-vl:2b`) |

### Examples

```bash
# Basic initialization
kml init ./kamelot_data

# With custom Qdrant settings
kml init ./kamelot_data \
  --qdrant-host qdrant.example.com \
  --qdrant-port 6333 \
  --qdrant-tls

# Initialize with a passphrase file (for automation)
echo "my-secure-passphrase" > /tmp/pass.txt
kml init ./kamelot_data --passphrase-file /tmp/pass.txt
rm /tmp/pass.txt

# Initialize without Qdrant (offline mode)
kml init ./offline_store --no-qdrant

# Force reinitialize
kml init ./kamelot_data --force
```

### Interactive Prompts

If no passphrase is provided via flags, `kml init` prompts interactively:

```
$ kml init ./kamelot_data
Creating new Kamelot store at ./kamelot_data
Enter master passphrase: ********
Confirm master passphrase: ********
Store initialized successfully.
```

## kml put

Ingest files into the Kamelot store.

### Synopsis

```
kml put [OPTIONS] <PATH> [PATH...]
```

### Description

Reads files from disk, generates embeddings, encrypts content, and stores them in the Kamelot store. Multiple files can be specified. Directories can be ingested recursively.

### Options

| Option | Description |
|--------|-------------|
| `--recursive` | Ingest directories recursively |
| `--name <NAME>` | Override the stored filename |
| `--mime <TYPE>` | Override MIME type detection |
| `--tag <TAG>` | Attach tags (repeatable) |
| `--author <NAME>` | Set author metadata |
| `--description <TEXT>` | Set description |
| `--model <MODEL>` | Embedding model for this file |
| `--no-embed` | Skip embedding generation |
| `--force-embed` | Force embedding even for excluded types |
| `--re-embed` | Re-generate embedding for existing file |
| `--dedup` | Skip if content already exists (default: on) |
| `--no-dedup` | Force ingestion even if duplicate |
| `--parallel <N>` | Number of parallel ingestion workers (default: 1) |
| `--progress` | Show progress bar |
| `--skip-existing` | Skip files already in store (by name) |
| `--exclude <PATTERN>` | Exclude files matching glob (repeatable) |
| `--exclude-mime <TYPE>` | Exclude by MIME type (repeatable) |
| `--from-list <FILE>` | Read file paths from a text file |
| `--output <FORMAT>` | Output format: `default`, `json`, `quiet` |
| `--dry-run` | Show what would be ingested without doing it |

### Examples

```bash
# Ingest a single file
kml put document.pdf

# Ingest with metadata
kml put document.pdf \
  --name "Q4 Financial Report" \
  --author "Jane Doe" \
  --tag finance \
  --tag "quarterly report" \
  --description "Q4 2025 financial report for board meeting"

# Ingest multiple files
kml put doc1.pdf doc2.pdf doc3.pdf

# Ingest a directory recursively
kml put ./projects/ --recursive

# Ingest with parallel workers
kml put ./photos/ --recursive --parallel 4 --progress

# Ingest from a list
kml put --from-list files.txt

# Ingest with exclusions
kml put ./src/ --recursive \
  --exclude "*.tmp" \
  --exclude "*node_modules/*" \
  --exclude-mime "image/png"

# Dry run
kml put ./data/ --recursive --dry-run

# Skip embedding (store only, no semantic search)
kml put archive.tar.gz --no-embed

# Re-embed an existing file with a new model
kml put document.pdf --re-embed --model qwen2-vl:7b

# Ingest with stdin
echo "Quick note" | kml put --name "note.txt" --mime text/plain
```

### Progress Output

With `--progress`:

```
Ingesting files from ./photos/
[====================] 150/150 files (100%)
  ✓ 142 files ingested
  ⚠ 5 files skipped (duplicates)
  ✗ 3 files failed
```

### Batch Ingestion Script

```bash
#!/bin/bash
# ingest_project.sh - Ingest a project directory

PROJECT="$1"
STORE="$2"

if [ -z "$PROJECT" ] || [ -z "$STORE" ]; then
    echo "Usage: $0 <project_dir> <store_path>"
    exit 1
fi

kml --store "$STORE" init 2>/dev/null

kml --store "$STORE" put "$PROJECT" \
    --recursive \
    --parallel "$(nproc)" \
    --progress \
    --exclude "*.git/*" \
    --exclude "node_modules/*" \
    --exclude "target/*" \
    --exclude "*.pyc" \
    --exclude ".DS_Store"

echo "Done ingesting $PROJECT"
kml --store "$STORE" list --count
```

## kml get

Retrieve files from the Kamelot store.

### Synopsis

```
kml get [OPTIONS] <INODE_OR_NAME>
```

### Description

Retrieves a file from the store by its inode (UUID) or by filename. If multiple files have the same name, the most recent one is returned. Files are decrypted on retrieval.

### Options

| Option | Description |
|--------|-------------|
| `--output <PATH>` | Write file to a specific path (default: original filename) |
| `--decrypt-only` | Only decrypt, do not verify integrity |
| `--info` | Show file metadata instead of content |
| `--embedding` | Show the embedding vector |
| `--json` | Output metadata as JSON |
| `--verbose` | Show detailed info |

### Examples

```bash
# Get by inode
kml get 7f3a5c91-b2d4-4f8e-9a1c-3e5f7d8b2a1c

# Get by name
kml get "document.pdf"

# Get and save to specific location
kml get 7f3a5c91... --output ./restored/document.pdf

# Show metadata only
kml get document.pdf --info

# Show embedding
kml get document.pdf --embedding

# JSON output
kml get document.pdf --json

# Get multiple files by pattern
kml get "*.pdf" --output ./all_pdfs/
```

### Metadata Output

```bash
$ kml get document.pdf --info
File: document.pdf
  Inode:     7f3a5c91-b2d4-4f8e-9a1c-3e5f7d8b2a1c
  Size:      245 KB
  MIME:      application/pdf
  Created:   2026-06-19 10:00:00 UTC
  Modified:  2026-06-19 10:00:00 UTC (stored)
  Ledger:    block #42
  Tags:      finance, quarterly-report
  Author:    Jane Doe
  Description: Q4 2025 financial report
  Embedding: present (384 dims)
  Encryption:XChaCha20-Poly1305
  Object Hash: a1b2c3d4e5f6...
```

## kml query

Search files using natural language.

### Synopsis

```
kml query [OPTIONS] <QUERY>
```

### Description

The most powerful Kamelot command. Converts your natural language query to an embedding, searches the vector database, and returns ranked results.

### Options

| Option | Description |
|--------|-------------|
| `--model <MODEL>` | Embedding model for this query |
| `--limit <N>` | Maximum results (default: 10, max: 1000) |
| `--min-score <N>` | Minimum similarity score 0-1 |
| `--mime <TYPE>` | Filter by MIME type (repeatable) |
| `--since <DATE>` | Only files ingested after this date |
| `--until <DATE>` | Only files ingested before this date |
| `--tag <TAG>` | Filter by tag (repeatable) |
| `--exclude <TEXT>` | Downrank files related to this text |
| `--author <NAME>` | Filter by author |
| `--format <FORMAT>` | Output format: `table`, `json`, `csv`, `yaml` |
| `--output <FILE>` | Write results to file |
| `--count` | Only show result count |
| `--verbose` | Show detailed results |
| `--timeout <SECONDS>` | Query timeout (default: 60) |
| `--precompute` | Pre-compute and cache query embedding |
| `--use-cached` | Use cached query embedding |

### Examples

```bash
# Basic query
kml query "find my tax documents"

# Advanced query with filters
kml query "Q4 marketing budget spreadsheet" \
  --mime application/vnd.openxmlformats-officedocument.spreadsheetml.sheet \
  --tag "marketing" \
  --since "2025-10-01" \
  --until "2025-12-31" \
  --min-score 0.7 \
  --limit 20 \
  --format json \
  --output results.json

# Query with exclusion
kml query "meeting notes" --exclude "canceled postponed"

# Count only
kml query "photos" --count

# Verbose output
kml query "important documents" --verbose

# Using mock model
kml query "test query" --model mock
```

## kml list

List files in the store.

### Synopsis

```
kml list [OPTIONS]
```

### Description

Lists all files in the store with their metadata. Supports filtering and sorting.

### Options

| Option | Description |
|--------|-------------|
| `--mime <TYPE>` | Filter by MIME type (repeatable) |
| `--tag <TAG>` | Filter by tag (repeatable) |
| `--since <DATE>` | Files ingested after this date |
| `--until <DATE>` | Files ingested before this date |
| `--min-size <BYTES>` | Minimum file size |
| `--max-size <BYTES>` | Maximum file size |
| `--author <NAME>` | Filter by author |
| `--sort <FIELD>` | Sort by: `name`, `size`, `created`, `score` |
| `--order <ORDER>` | Sort order: `asc`, `desc` (default: `asc`) |
| `--limit <N>` | Maximum results |
| `--offset <N>` | Results offset (for pagination) |
| `--count` | Only show count |
| `--format <FORMAT>` | Output format: `table`, `json`, `csv`, `yaml` |
| `--output <FILE>` | Write to file |
| `--verbose` | Show detailed info |

### Examples

```bash
# List all files
kml list

# Filter by type
kml list --mime application/pdf

# Filter by multiple tags
kml list --tag "work" --tag "important"

# Filter by date range
kml list --since "2026-01-01" --until "2026-06-01"

# Filter by size
kml list --min-size 1048576  # Files larger than 1 MB

# Sort and paginate
kml list --sort created --order desc --limit 20 --offset 40

# Count only
kml list --count

# Output as JSON
kml list --format json
```

### Table Output

```
Inode                                     Name                    Size      MIME              Created
────────────────────────────────────────  ──────────────────────  ────────  ────────────────  ───────────────────
7f3a5c91-b2d4-4f8e-9a1c-3e5f7d8b2a1c    tax-return-2025.pdf      245 KB    application/pdf   2026-06-19 10:00:00
a1b2c3d4-e5f6-7890-abcd-ef1234567890      photo-vacation.jpg      3.2 MB    image/jpeg        2026-06-18 15:30:00
```

## kml similar

Find files similar to a given file.

### Synopsis

```
kml similar [OPTIONS] <INODE_OR_NAME>
```

### Description

Uses an existing file's embedding as a query to find semantically similar files. This is useful for discovering related content.

### Options

| Option | Description |
|--------|-------------|
| `--limit <N>` | Maximum results (default: 10) |
| `--min-score <N>` | Minimum similarity score |
| `--exclude-same` | Exclude the file itself from results (default: on) |
| `--include-same` | Include the file itself in results |
| `--format <FORMAT>` | Output format |
| `--output <FILE>` | Write to file |

### Examples

```bash
# Find similar files
kml similar tax-return-2025.pdf

# Find similar, excluding the source file
kml similar 7f3a5c91... --exclude-same

# Limit results
kml similar photo.jpg --limit 5 --min-score 0.8

# JSON output
kml similar document.pdf --format json
```

## kml rollback

Roll back the store to a previous state.

### Synopsis

```
kml rollback [OPTIONS]
```

### Description

Reverts the store to a previous state using the immutable ledger. This is Kamelot's ransomware protection and time-travel feature. You can roll back by minutes, hours, days, blocks, or to a specific timestamp.

### Options

| Option | Description |
|--------|-------------|
| `--minutes <N>` | Roll back N minutes |
| `--hours <N>` | Roll back N hours |
| `--days <N>` | Roll back N days |
| `--to-block <N>` | Roll back to a specific block number |
| `--to-time <TIMESTAMP>` | Roll back to a specific time (ISO 8601) |
| `--to-before-inode <INODE>` | Roll back to before a file was added |
| `--dry-run` | Show what would be rolled back without doing it |
| `--force` | Force rollback even if checks fail |
| `--verify` | Verify the new state after rollback |

### Examples

```bash
# Roll back 5 minutes (ransomware recovery)
kml rollback --minutes 5

# Roll back 1 hour
kml rollback --hours 1

# Roll back to a specific block
kml rollback --to-block 42

# Roll back to a specific time
kml rollback --to-time "2026-06-19T09:30:00Z"

# Dry run to see what would happen
kml rollback --hours 1 --dry-run

# Roll back before a malicious file was added
kml rollback --to-before-inode a1b2c3d4-e5f6-7890-abcd-ef1234567890

# Verify after rollback
kml rollback --minutes 5 --verify
```

### Rollback Output

```
$ kml rollback --minutes 5
Rolling back store to state from 5 minutes ago (2026-06-19 09:55:00 UTC)

Analyzing ledger...
  Blocks to revert: 3 (blocks #43-#45)
  Files affected: 2 PUT, 1 DELETE, 0 UPDATE

Dry run summary:
  File 1 (a1b2c3...): PUT → REMOVED
  File 2 (b2c3d4...): DELETE → RESTORED
  File 3 (c3d4e5...): PUT → REMOVED

Proceed with rollback? [y/N] y

Rolling back...
  ✓ Block #43 reverted (inode a1b2c3... removed)
  ✓ Block #44 reverted (inode b2c3d4... restored)
  ✓ Block #45 reverted (inode c3d4e5... removed)

Rollback complete. Store now at block #42.

Ledger integrity: INTACT
```

## kml status

Show store status and statistics.

### Synopsis

```
kml status [OPTIONS]
```

### Description

Displays comprehensive information about the current Kamelot store, including ledger status, storage statistics, Qdrant health, and Ollama connectivity.

### Options

| Option | Description |
|--------|-------------|
| `--verbose` | Show detailed information |
| `--models` | Check available Ollama models |
| `--vectors` | Show Qdrant vector statistics |
| `--ledger` | Show detailed ledger info |
| `--json` | Output as JSON |

### Examples

```bash
# Basic status
kml status

# Verbose status
kml status --verbose

# Check models
kml status --models

# Check Qdrant vectors
kml status --vectors

# Check ledger
kml status --ledger

# JSON output
kml status --json
```

### Status Output

```
Kamelot Store: /home/user/kamelot_data
  Version:        1
  Status:         Active
  Locked:         No

Ledger:
  Blocks:         1,234
  Genesis:        2026-01-15 08:00:00 UTC
  Latest:         2026-06-19 10:00:00 UTC
  Integrity:      INTACT
  Hash Algorithm: BLAKE3

Objects:
  Count:          847
  Raw Size:       12.4 GB
  Encrypted Size: 12.6 GB (1.6% overhead)
  Dedup Savings:  2.3 GB (18.5%)
  Average Size:   15.0 MB

Qdrant:
  Host:           127.0.0.1:6333
  Status:         Connected
  Collection:     kamelot
  Vectors:        847
  Index:          Ready (HNSW, m=16, ef=100)
  Payload Index:  mime_type, created_at, size, tags

Ollama:
  Host:           http://127.0.0.1:11434
  Status:         Connected
  Model:          qwen2-vl:2b (available, 1.6 GB)
  GPU:            NVIDIA RTX 3060 (12 GB VRAM)

Session:
  Status:         Unlocked
  Timeout:        15 minutes
  Last Activity:  2 minutes ago
```

## kml config

View or modify Kamelot configuration.

### Synopsis

```
kml config <SUBCOMMAND> [OPTIONS]
```

### Subcommands

| Subcommand | Description |
|------------|-------------|
| `show` | Show current configuration |
| `get <KEY>` | Get a specific config value |
| `set <KEY> <VALUE>` | Set a config value |
| `unset <KEY>` | Remove a config value |
| `list` | List all config keys |
| `reset` | Reset config to defaults |
| `import <FILE>` | Import config from file |
| `export <FILE>` | Export config to file |

### Configuration Keys

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `store.path` | String | `./kamelot_data` | Store path |
| `qdrant.host` | String | `127.0.0.1` | Qdrant host |
| `qdrant.port` | Int | `6333` | Qdrant REST port |
| `qdrant.grpc_port` | Int | `6334` | Qdrant gRPC port |
| `qdrant.tls` | Bool | `false` | Use TLS |
| `qdrant.api_key` | String | `` | API key |
| `qdrant.collection` | String | `kamelot` | Collection name |
| `qdrant.vector_size` | Int | `384` | Vector dimensions |
| `qdrant.distance` | String | `Cosine` | Distance metric |
| `qdrant.hnsw.m` | Int | `16` | HNSW links |
| `qdrant.hnsw.ef_construct` | Int | `100` | HNSW construct |
| `qdrant.hnsw.ef_search` | Int | `64` | HNSW search |
| `ollama.host` | String | `http://127.0.0.1:11434` | Ollama host |
| `ollama.model` | String | `qwen2-vl:2b` | Default model |
| `ollama.timeout` | Int | `60` | Timeout seconds |
| `ollama.keep_alive` | String | `5m` | Model keep-alive |
| `ollama.embed_batch_size` | Int | `8` | Batch size |
| `ollama.temperature` | Float | `0.0` | Model temperature |
| `crypto.algorithm` | String | `xchacha20-poly1305` | Encryption |
| `crypto.kdf` | String | `argon2id` | Key derivation |
| `crypto.argon2_time_cost` | Int | `3` | Argon2 time |
| `crypto.argon2_memory_cost` | Int | `65536` | Argon2 memory |
| `crypto.argon2_parallelism` | Int | `4` | Argon2 threads |
| `ledger.hash_algorithm` | String | `blake3` | Hash algorithm |
| `ledger.auto_prune` | Bool | `false` | Auto-prune old blocks |
| `ledger.prune_after_days` | Int | `365` | Prune threshold |
| `session.timeout_minutes` | Int | `15` | Session timeout |
| `session.auto_lock` | Bool | `true` | Auto-lock |
| `embedding.max_size` | Int | `104857600` | Max embed size (100 MB) |
| `embedding.chunking.enabled` | Bool | `true` | Enable chunking |
| `embedding.chunking.max_tokens` | Int | `512` | Chunk size |
| `embedding.chunking.overlap` | Int | `64` | Chunk overlap |
| `embedding.chunking.strategy` | String | `mean` | Pooling strategy |

### Examples

```bash
# Show config
kml config show

# Get a specific value
kml config get ollama.model

# Set a value
kml config set ollama.model qwen2-vl:7b
kml config set qdrant.hnsw.ef_search 128
kml config set session.timeout_minutes 60

# Reset a value to default
kml config unset qdrant.hnsw.ef_search

# List all keys
kml config list

# Export config
kml config export ./backup_config.toml

# Import config
kml config import ./new_config.toml

# Reset everything
kml config reset
```

## kml ledger

View and verify the ledger.

### Synopsis

```
kml ledger [OPTIONS]
```

### Description

Displays the immutable ledger, which records every operation. Can show individual blocks, verify integrity, and filter by inode.

### Options

| Option | Description |
|--------|-------------|
| `--inode <UUID>` | Show entries for a specific file |
| `--block <N>` | Show a specific block |
| `--range <START>-<END>` | Show a range of blocks |
| `--verify` | Verify ledger integrity |
| `--since <DATE>` | Since timestamp |
| `--until <DATE>` | Until timestamp |
| `--format <FORMAT>` | Output format |
| `--limit <N>` | Maximum entries |
| `--output <FILE>` | Write to file |

### Examples

```bash
# Show latest entries
kml ledger

# Show specific block
kml ledger --block 42

# Show entries for a file
kml ledger --inode 7f3a5c91-b2d4-4f8e-9a1c-3e5f7d8b2a1c

# Verify integrity
kml ledger --verify

# Export ledger
kml ledger --format json --output ledger_export.json
```

## kml unlock

Unlock the store.

### Synopsis

```
kml unlock [OPTIONS]
```

### Description

Unlocks the store by deriving the encryption key from the master passphrase. Required after store creation or auto-lock.

### Options

| Option | Description |
|--------|-------------|
| `--passphrase <PASSPHRASE>` | Provide passphrase non-interactively |
| `--passphrase-file <FILE>` | Read passphrase from file |

### Examples

```bash
# Interactive unlock
kml unlock

# Non-interactive
kml unlock --passphrase-file /tmp/pass.txt
```

## kml resolve

Resolve a filename to an inode.

### Synopsis

```
kml resolve <NAME>
```

### Description

Looks up the inode (UUID) for a given filename. Useful for scripting.

### Example

```bash
$ kml resolve document.pdf
7f3a5c91-b2d4-4f8e-9a1c-3e5f7d8b2a1c
```

## kml ui

Launch the GPU canvas UI.

### Synopsis

```
kml ui [OPTIONS]
```

### Options

| Option | Description |
|--------|-------------|
| `--store <PATH>` | Store to open |

### Example

```bash
kml ui
kml ui --store ./work_kamelot
```

## kml completion

Generate shell completion scripts.

### Synopsis

```
kml completion <SHELL>
```

### Supported Shells

- `bash`
- `zsh`
- `fish`
- `powershell`

### Examples

```bash
# Bash
source <(kml completion bash)

# Zsh
source <(kml completion zsh)

# Fish
kml completion fish | source

# PowerShell
kml completion powershell | Out-String | Invoke-Expression
```

## Shell Completions

### Bash

```bash
# Add to ~/.bashrc
source <(kml completion bash)
```

### Zsh

```bash
# Add to ~/.zshrc
source <(kml completion zsh)

# Or install to fpath
kml completion zsh > /usr/local/share/zsh/site-functions/_kml
```

### Fish

```bash
# Install
kml completion fish > ~/.config/fish/completions/kml.fish
```

### PowerShell

```powershell
# Add to profile
kml completion powershell >> $PROFILE
```

## Output Formats

Kamelot supports multiple output formats for most commands.

### Table (default)

```
Inode                                     Name    Size
────────────────────────────────────────  ──────  ──────
7f3a5c91-...    document.pdf    245 KB
```

### JSON

```json
[
  {
    "inode": "7f3a5c91-...",
    "name": "document.pdf",
    "size": 245000
  }
]
```

### CSV

```csv
inode,name,size
7f3a5c91-...,document.pdf,245000
```

### YAML

```yaml
- inode: 7f3a5c91-...
  name: document.pdf
  size: 245000
```

## Batch Processing

### Ingest from a File List

```bash
# Create file list
find /data -name "*.pdf" > pdfs.txt

# Ingest
kml put --from-list pdfs.txt --parallel 4
```

### Process in a Loop

```bash
for file in /data/*.pdf; do
    kml put "$file" --tag "auto-imported"
    echo "Imported: $file"
done
```

### Monitor with Watch

```bash
# Watch store status
watch -n 5 kml status
```

## Scripting with Kamelot

### Bash Script: Auto-Ingest Directory

```bash
#!/bin/bash
WATCH_DIR="/mnt/shared/incoming"
STORE="/home/user/kamelot_data"

inotifywait -m "$WATCH_DIR" -e create -e moved_to |
    while read path action file; do
        echo "New file detected: $file"
        kml --store "$STORE" put "$path/$file" --tag "auto-imported"
    done
```

### PowerShell Script: Export All Files

```powershell
$store = "C:\kamelot_data"
$exportDir = "C:\exports"

$files = kml --store $store list --format json | ConvertFrom-Json

foreach ($file in $files) {
    $inode = $file.inode
    $name = $file.name
    $outputPath = Join-Path $exportDir $name
    
    Write-Host "Exporting $name..."
    kml --store $store get $inode --output $outputPath
}

Write-Host "Exported $($files.Count) files to $exportDir"
```

### Python Script: Query and Process

```python
#!/usr/bin/env python3
import subprocess
import json

def kml_query(query, store=None):
    cmd = ["kml", "query", query, "--format", "json"]
    if store:
        cmd = ["kml", "--store", store, "query", query, "--format", "json"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    return json.loads(result.stdout)

def kml_put(filepath, store=None, tags=None):
    cmd = ["kml", "put", filepath]
    if store:
        cmd = ["kml", "--store", store, "put", filepath]
    if tags:
        for tag in tags:
            cmd.extend(["--tag", tag])
    subprocess.run(cmd)

# Example usage
results = kml_query("find my budget spreadsheets")
for r in results.get("results", []):
    print(f"Found: {r['name']} (score: {r['score']})")
```

### CI/CD Integration

```yaml
# .github/workflows/kamelot-verify.yml
name: Kamelot Verify
on: [push]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Kamelot
        run: |
          curl -LO https://github.com/lois-kleinner/kamelot/releases/latest/download/kamelot-x86_64-unknown-linux-gnu.tar.gz
          tar xzf kamelot-*.tar.gz
          sudo mv kml /usr/local/bin/
      - name: Start Qdrant
        run: |
          docker run -d -p 6333:6333 qdrant/qdrant
      - name: Init Store and Ingest
        run: |
          kml init ./test_store --model mock
          kml put . --recursive --model mock --exclude ".git/*" --exclude "target/*"
      - name: Verify Search
        run: |
          kml query "documentation" --model mock --limit 5 --format json
```

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | General error |
| `2` | Invalid usage |
| `3` | Store not found or corrupted |
| `4` | Passphrase incorrect |
| `5` | Qdrant connection failed |
| `6` | Ollama connection failed |
| `7` | File not found |
| `8` | Permission denied |
| `9` | Store locked |
| `10` | Rollback failed |
| `11` | Ledger integrity violation |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `KAMELOT_STORE` | Default store path | `./kamelot_data` |
| `KAMELOT_PASSPHRASE` | Master passphrase (use with caution) | none |
| `KAMELOT_CONFIG` | Config file path | `~/.config/kamelot/config.toml` |
| `KAMELOT_QDRANT_HOST` | Qdrant host | `127.0.0.1` |
| `KAMELOT_QDRANT_PORT` | Qdrant port | `6333` |
| `KAMELOT_OLLAMA_HOST` | Ollama host | `http://127.0.0.1:11434` |
| `KAMELOT_OLLAMA_MODEL` | Default model | `qwen2-vl:2b` |
| `KAMELOT_LOG_LEVEL` | Log level: error, warn, info, debug, trace | `info` |
| `KAMELOT_NO_COLOR` | Disable color output | `false` |
| `NO_COLOR` | Standard no-color env var (if set) | `false` |

### Usage

```bash
# Set default store
export KAMELOT_STORE=~/work_kamelot
kml put document.pdf  # Uses the env var store

# One-off override
KAMELOT_STORE=~/personal_kamelot kml query "vacation photos"
```

---

*Next tutorial: [06 — Omnibox Usage](06-omnibox-usage.md)*

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

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/YMJKOG
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