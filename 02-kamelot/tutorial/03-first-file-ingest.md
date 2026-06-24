                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                

# 03 — First File Ingest

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Initializing a Store](#initializing-a-store)
4. [Starting Qdrant](#starting-qdrant)
5. [Ingesting Your First File](#ingesting-your-first-file)
6. [The Ingestion Pipeline Explained](#the-ingestion-pipeline-explained)
7. [Ingesting Different File Types](#ingesting-different-file-types)
8. [Batch Ingestion](#batch-ingestion)
9. [Verifying Ingestion](#verifying-ingestion)
10. [Viewing File Metadata](#viewing-file-metadata)
11. [Common Ingestion Issues](#common-ingestion-issues)
12. [Advanced: Custom Embedding Configurations](#advanced-custom-embedding-configurations)

---

## Overview

Ingesting a file into Kamelot is the foundational operation. When you ingest a file, Kamelot:

1. Reads the file and extracts text or visual features
2. Generates a semantic embedding using the Qwen 2 VL model
3. Encrypts the file contents using XChaCha20-Poly1305
4. Stores the encrypted ciphertext in the object store
5. Indexes the embedding in Qdrant for future search
6. Records the operation in the immutable ledger

In this tutorial, you will ingest your first file, understand each step of the pipeline, and learn how to ingest various file types.

By the end of this tutorial, you should be able to confidently ingest any file into Kamelot and verify its presence.

## Prerequisites

Before proceeding, ensure you have:

1. **Kamelot installed** (see [01 — Getting Started](01-getting-started.md) or [02 — Installation](02-installation.md))
2. **Docker installed** (for running Qdrant)
3. **Ollama installed** (for embedding generation)
4. **Qwen 2 VL model pulled**:

```bash
ollama pull qwen2-vl:2b
```

5. **A test file ready**:

```bash
echo "Hello, Kamelot World!" > mydocument.txt
```

### Verify Tools

```bash
# Check Kamelot
kml --version

# Check Docker
docker --version

# Check Ollama
ollama --version
ollama list  # Should show qwen2-vl:2b
```

[screenshot: terminal-checking-tools.png]
*Terminal output showing all prerequisite tools verified.*

## Initializing a Store

A store is a directory where Kamelot keeps all its data: encrypted files, the ledger, configuration, and metadata. You can have multiple stores for different purposes (e.g., one for work, one for personal).

### Creating a Store

```bash
kml init ./kamelot_data
```

You will be prompted to create a master passphrase:

```
Creating new Kamelot store at ./kamelot_data

Enter master passphrase: ********
Confirm master passphrase: ********

Generating encryption key (Argon2id)... done
Creating ledger (genesis block)... done
Creating Qdrant collection 'kamelot'... done
Writing configuration... done

Store initialized successfully!

Store Summary:
  Path:     ./kamelot_data
  Version:  1
  Ledger:   block #0 (genesis)
  Qdrant:   connected (collection: kamelot, 0 vectors)
  Storage:  0 bytes used
```

### What Happens During Init

When you run `kml init`, Kamelot performs these steps:

1. **Creates the directory structure:**

```
kamelot_data/
├── config.toml          # Store configuration
├── objects/             # Encrypted file storage
│   └── xx/              # Sharded by first 2 chars of hash
├── ledger/
│   ├── blocks/          # Individual block files
│   │   └── 00000000.block  # Genesis block
│   ├── index            # Block index for fast lookup
│   └── HEAD             # Pointer to latest block
├── keys/
│   └── salt             # Argon2id salt (NOT the key!)
├── tmp/                 # Temporary files during operations
└── VERSION              # Store format version
```

2. **Derives the encryption key:** Your passphrase is combined with a random salt using Argon2id to produce the 256-bit XChaCha20 key. The salt is stored in `keys/salt`. The key itself is never stored.

3. **Creates the genesis block:** Block #0 is created with metadata about the store:
   - Store format version
   - Creation timestamp
   - Qdrant connection info
   - Hash of the empty state

4. **Connects to Qdrant:** Verifies the Qdrant instance is reachable and creates the `kamelot` collection with 384-dimensional vectors and cosine distance metric.

5. **Writes configuration:** Default configuration is written to `config.toml`.

### Store Configuration

After initialization, you can view and modify the configuration:

```bash
kml config show
```

Default configuration:

```toml
[store]
path = "./kamelot_data"

[qdrant]
host = "127.0.0.1"
port = 6333
grpc_port = 6334
tls = false
api_key = ""
collection = "kamelot"
vector_size = 384
distance = "Cosine"

[ollama]
host = "http://127.0.0.1:11434"
model = "qwen2-vl:2b"
timeout = 60
embed_batch_size = 8

[crypto]
algorithm = "xchacha20-poly1305"
kdf = "argon2id"
argon2_time_cost = 3
argon2_memory_cost = 65536
argon2_parallelism = 4

[ledger]
hash_algorithm = "blake3"
auto_prune = false
prune_after_days = 365

[session]
timeout_minutes = 15
auto_lock = true
```

### Multiple Stores

You can create multiple stores:

```bash
kml init ./work_data
kml init ./personal_data

# Switch between stores with --store
kml --store ./work_data put work_doc.pdf
kml --store ./personal_data put photo.jpg
```

### Store Passphrase Security

The master passphrase is the single most important secret in Kamelot. Follow these guidelines:

1. **Use a strong passphrase:** At least 8 words, or 16+ random characters
2. **Never reuse passphrases:** Each store should have a unique passphrase
3. **Write it down physically:** Store it in a safe or safety deposit box
4. **Consider a passphrase manager:** Use Bitwarden, 1Password, or similar
5. **Test your recovery:** Before storing important files, verify you can unlock the store

Example strong passphrase:
```
correct-horse-battery-staple-glacier-umbrella-piano-rocket
```

If you lose your passphrase, there is NO recovery mechanism. This is by design — Kamelot uses zero-knowledge encryption.

## Starting Qdrant

Qdrant must be running before you can ingest files. Kamelot connects to Qdrant via its REST or gRPC API.

### Using Docker (Recommended)

```bash
docker run -d \
  --name qdrant \
  -p 6333:6333 \
  -p 6334:6334 \
  -v qdrant_storage:/qdrant/storage \
  --restart unless-stopped \
  qdrant/qdrant:latest
```

Let's break down this command:

- `-d`: Run in detached mode (background)
- `--name qdrant`: Name the container "qdrant"
- `-p 6333:6333`: Map REST API port (HTTP)
- `-p 6334:6334`: Map gRPC API port
- `-v qdrant_storage:/qdrant/storage`: Persist data to a Docker volume
- `--restart unless-stopped`: Auto-start on boot
- `qdrant/qdrant:latest`: The image

### Verify Qdrant is Running

```bash
curl http://localhost:6333/health
```

Expected response:
```json
{"ok":true}
```

You can also check the Qdrant dashboard:

```bash
# Open in browser (if running locally)
# http://localhost:6333/dashboard
```

[screenshot: qdrant-dashboard.png]
*Qdrant web dashboard showing cluster status and collection info.*

### Using Docker Compose

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
    environment:
      QDRANT__SERVICE__GRPC_PORT: "6334"
      QDRANT__SERVICE__HTTP_PORT: "6333"
volumes:
  qdrant_storage:
```

Then run:

```bash
docker-compose up -d
```

### Qdrant Configuration Notes

- Kamelot creates a collection named `kamelot` in Qdrant
- The collection uses 384-dimensional vectors (matching Qwen 2 VL output)
- Distance metric is Cosine similarity
- HNSW index is built with default parameters (m=16, ef_construct=100)
- Kamelot uses the gRPC API for high-performance operations

### Persistent vs Ephemeral Storage

The `-v qdrant_storage:/qdrant/storage` mount is critical. Without it, all your indexes would be destroyed when the container stops.

If you want to store data in a specific directory:

```bash
# Linux/macOS
docker run -d \
  --name qdrant \
  -p 6333:6333 \
  -p 6334:6334 \
  -v /absolute/path/to/qdrant_data:/qdrant/storage \
  qdrant/qdrant:latest

# Windows
docker run -d \
  --name qdrant \
  -p 6333:6333 \
  -p 6334:6334 \
  -v C:\Users\You\qdrant_data:/qdrant/storage \
  qdrant/qdrant:latest
```

### Troubleshooting Qdrant

**Port already in use:**
```bash
# Check what's using the port
netstat -ano | findstr :6333  # Windows
lsof -i :6333                 # Linux/macOS

# Kill the process or change the port
docker run -d -p 6335:6333 qdrant/qdrant:latest
```

**Container keeps restarting:**
```bash
# Check logs
docker logs qdrant

# Check if storage is corrupted
docker stop qdrant
docker rm qdrant
# Remove the volume
docker volume rm qdrant_storage
# Recreate
```

## Ingesting Your First File

### The Basic Ingest Command

```bash
kml put mydocument.txt
```

Expected output:

```
Ingesting: mydocument.txt
  Reading file... done (22 bytes)
  Detecting MIME type... text/plain
  Extracting text content... done (22 chars)
  Generating embedding... done (384 dims, 12.4ms)
  Encrypting content... done (XChaCha20-Poly1305)
  Storing object... done (hash: 7a3b5c...)
  Indexing vector in Qdrant... done
  Recording ledger entry... done (block #1)

Ingested: mydocument.txt
  Inode:     7f3a5c91-b2d4-4f8e-9a1c-3e5f7d8b2a1c
  Size:      22 bytes
  MIME:      text/plain
  Embedding: 384 dims (cosine)
  Encrypted: XChaCha20-Poly1305
  Ledger:    block #1
  Timestamp: 2026-06-19T10:00:00Z
```

Congratulations! You have ingested your first file into Kamelot.

### Ingesting with a Custom Name

You can override the file's name in the store:

```bash
kml put mydocument.txt --name "My First Kamelot Document"
```

### Ingesting with Tags

Tags help organize files beyond semantic search:

```bash
kml put mydocument.txt --tag tutorial --tag example --tag "getting started"
```

You can later search by tags:

```bash
kml query --tag tutorial
```

### Ingesting with Metadata

Additional metadata can be attached:

```bash
kml put mydocument.txt \
  --author "John Doe" \
  --project "Kamelot Docs" \
  --description "A test file for the ingest tutorial"
```

### Ingesting from Stdin

```bash
echo "Quick note" | kml put --name "note.txt" --mime text/plain
```

### Ingesting with Different Embedding Models

```bash
# Using a different Ollama model
kml put mydocument.txt --model llama3.2:3b

# Using mock embeddings (no Ollama needed, for testing)
kml put mydocument.txt --model mock
```

### Understanding the Output

Let's break down each field:

| Field | Value | Description |
|-------|-------|-------------|
| **Inode** | `7f3a5c91-...` | UUID v4 unique identifier for the file |
| **Size** | 22 bytes | Original file size (before encryption) |
| **MIME** | text/plain | Detected file type |
| **Embedding** | 384 dims (cosine) | Vector dimensionality and distance metric |
| **Encrypted** | XChaCha20-Poly1305 | Encryption algorithm used |
| **Ledger** | block #1 | The ledger block recording this operation |
| **Timestamp** | 2026-06-19T10:00:00Z | When the file was ingested |

## The Ingestion Pipeline Explained

The ingestion pipeline is the heart of Kamelot. Understanding it helps you optimize performance and troubleshoot issues.

### Step 1: File Reading

```mermaid
┌──────────┐
│  File    │
│  on Disk │────► Read bytes into memory
└──────────┘
```

Kamelot reads the entire file into memory. For very large files (>100 MB), consider chunking them before ingestion.

### Step 2: MIME Detection

```mermaid
┌──────────┐
│  Bytes   │────► Inspect magic bytes ────► MIME type
└──────────┘
```

Kamelot uses content-based (magic bytes) detection rather than relying on file extensions. This is more reliable:

```bash
# Both of these will be correctly detected as JPEG
kml put photo.jpg
kml put photo_jpeg  # No extension, still detected correctly
```

Supported MIME types:

| Category | Types |
|----------|-------|
| Documents | text/plain, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| Spreadsheets | application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet |
| Presentations | application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation |
| Images | image/jpeg, image/png, image/gif, image/webp, image/svg+xml |
| Audio | audio/mpeg, audio/ogg, audio/wav, audio/flac |
| Video | video/mp4, video/webm, video/ogg |
| Code | text/x-rust, text/x-python, text/javascript, text/html, text/css |
| Archives | application/zip, application/gzip, application/x-tar |
| Data | application/json, application/xml, application/yaml |

### Step 3: Text Extraction

```mermaid
┌──────────┐    ┌──────────────┐    ┌──────────┐
│ Raw File │────►│ Text         │────►│ Cleaned  │
│ Bytes    │    │ Extractor    │    │ Text     │
└──────────┘    └──────────────┘    └──────────┘
```

For different file types, Kamelot extracts text differently:

**Plain text files (.txt, .md, .csv):**
The file content is used directly as the text for embedding.

**PDF files (.pdf):**
Kamelot uses `pdf-extract` to extract text from PDFs. For scanned PDFs (images without text), OCR is not yet supported — you need to pre-process these.

**Office documents (.docx, .xlsx, .pptx):**
These are ZIP-based formats. Kamelot extracts the XML content and parses it to get human-readable text.

**Code files (.rs, .py, .js, etc.):**
The raw source code is used as text. You can choose to include or exclude comments via configuration:

```toml
[embedding.code]
strip_comments = false  # Set to true to exclude comments
```

**Images (.jpg, .png, etc.):**
Images are processed by Qwen 2 VL's visual encoder. The model generates a description of the image, which is used for the text embedding. This is a key differentiator from text-only embedding models.

```bash
kml put screenshot.png
# Qwen 2 VL generates: "A screenshot of a terminal window showing the output of the kml put command"
```

**Audio and Video:**
Currently, audio and video files are embedded using filename and metadata only. Full audio transcription is planned for a future release.

### Step 4: Chunking (Large Files)

For files longer than the model's context window, Kamelot chunks the text:

```mermaid
┌────────────────────────────────────────────┐
│           Long Document Text               │
├──────────┬──────────┬──────────┬──────────┤
│ Chunk 1  │ Chunk 2  │ Chunk 3  │ Chunk 4  │
├──────────┼──────────┼──────────┼──────────┤
│Embedding │Embedding │Embedding │Embedding │
│   1      │   2      │   3      │   4      │
└──────────┴──────────┴──────────┴──────────┘
         │         │         │         │
         └─────────┴────┬────┴─────────┘
                        ▼
               ┌──────────────────┐
               │  Mean Pooling    │
               │  (or Max Pool)   │
               └────────┬─────────┘
                        ▼
               ┌──────────────────┐
               │  Single Vector   │
               │  for the File    │
               └──────────────────┘
```

Configuration options for chunking:

```toml
[embedding.chunking]
enabled = true
max_tokens = 512
overlap = 64
strategy = "mean"  # or "max", "first", "last"
```

### Step 5: Embedding Generation

```mermaid
┌──────────┐    ┌──────────┐    ┌──────────┐
│  Text    │────►│  Ollama  │────►│  384-dim │
│  Chunk   │    │  Qwen    │    │  Vector  │
└──────────┘    │  2 VL    │    └──────────┘
                └──────────┘
```

The extracted text is sent to Ollama, which runs the Qwen 2 VL Q4 model to generate an embedding.

**The Embedding Request:**

```json
{
  "model": "qwen2-vl:2b",
  "prompt": "Hello, Kamelot World!",
  "options": {
    "num_ctx": 512,
    "embeddings_only": true
  }
}
```

**The Embedding Response:**

```json
{
  "embedding": [0.0123, -0.0456, 0.0789, ...],
  "model": "qwen2-vl:2b",
  "prompt": "Hello, Kamelot World!"
}
```

The embedding is a 384-dimensional vector where each dimension captures some semantic aspect of the text.

**Performance:**

| Model | Dimensions | Time per File | RAM Usage |
|-------|-----------|---------------|-----------|
| qwen2-vl:2b (Q4) | 384 | ~10-50ms | ~1.5 GB |
| qwen2-vl:7b (Q4) | 512 | ~30-100ms | ~4 GB |
| mock | 384 | ~0.1ms | 0 MB |

**Batch Processing:**

For multiple files, Kamelot batches embedding requests for efficiency:

```toml
[ollama]
embed_batch_size = 8
```

With batch size 8, eight files are sent to Ollama in a single request, improving throughput by 3-5x.

### Step 6: Encryption

```mermaid
┌──────────┐    ┌──────────────┐    ┌──────────┐
│ Original │    │ XChaCha20-   │    │Ciphertext│
│ File     │────►│ Poly1305    │────►│          │
│ Bytes    │    │ + Random    │    │  (stored)│
└──────────┘    │ Nonce       │    └──────────┘
                └──────────────┘
```

Each file is encrypted individually using XChaCha20-Poly1305:

1. **Generate nonce:** A 192-bit random nonce (number-used-once) is generated
2. **Derive file key:** The master key is mixed with the nonce to produce a per-file key
3. **Encrypt:** XChaCha20 stream cipher encrypts the plaintext
4. **Authenticate:** Poly1305 produces a 128-bit authentication tag

**Encrypted file format:**

```
┌────────────────────────────────────────────────────────────────┐
│ Nonce (24 bytes) │ Ciphertext (variable) │ Auth Tag (16 bytes)│
└────────────────────────────────────────────────────────────────┘
```

The encrypted file is 40 bytes larger than the original (24 + 16 overhead).

### Step 7: Object Storage

The encrypted ciphertext is stored in the flat object store:

```mermaid
┌────────────┐    ┌────────────────────┐
│ Ciphertext │    │  kamelot_data/     │
│ + Nonce    │───►│  objects/          │
│ + Tag      │    │  └── 7a/           │
└────────────┘    │     └── 7a3b5c...  │
                  └────────────────────┘
```

The object's filename is the BLAKE3 hash of the ciphertext, used for content-addressed storage. The first two characters of the hash form a shard directory.

### Step 8: Vector Indexing

```mermaid
┌──────────┐    ┌──────────┐    ┌──────────┐
│ Embedding│────►│  Qdrant  │────►│  HNSW   │
│ Vector   │    │  Point   │    │  Index  │
└──────────┘    │ Insert   │    └──────────┘
                └──────────┘
```

The embedding vector is sent to Qdrant as a point with:

- **ID:** The file's inode (UUID)
- **Vector:** The 384-dimensional embedding
- **Payload:** Metadata (name, MIME type, size, timestamp, tags)

The Qdrant insert request:

```json
{
  "id": "7f3a5c91-b2d4-4f8e-9a1c-3e5f7d8b2a1c",
  "vector": [0.0123, -0.0456, 0.0789, ...],
  "payload": {
    "name": "mydocument.txt",
    "mime_type": "text/plain",
    "size": 22,
    "created_at": "2026-06-19T10:00:00Z",
    "tags": []
  }
}
```

Qdrant inserts this into its HNSW graph, connecting it to nearby vectors.

### Step 9: Ledger Recording

```mermaid
┌──────────┐    ┌────────────────────┐    ┌──────────┐
│ Operation│    │ Immutable Ledger   │    │ Block N  │
│ PUT      │───►│ Append-only List   │───►│ Prev: N-1│
└──────────┘    │ of Cryptographically│    │ Hash: ...│
                │ Signed Blocks      │    └──────────┘
                └────────────────────┘
```

The final step records the operation in the ledger:

```
Block #1:
  Hash:       0000abc123def456...
  Previous:   0000000000000000...  (genesis block)
  Timestamp:  2026-06-19T10:00:00Z
  Operation:  PUT
  Inode:      7f3a5c91-b2d4-4f8e-9a1c-3e5f7d8b2a1c
  File Hash:  7a3b5c... (BLAKE3 of ciphertext)
  Embed Hash: def789... (BLAKE3 of embedding)
  Size:       22
  MIME:       text/plain
  Name:       mydocument.txt
```

This is the complete record. Every field is hashed into the block's hash, making the ledger tamper-evident.

## Ingesting Different File Types

### Text Files

```bash
# Plain text
kml put README.md

# Multiple text files
kml put notes.txt journal.md todo.txt
```

### PDF Documents

```bash
kml put report.pdf
```

Kamelot extracts text from PDFs. For scanned PDFs, consider using OCR before ingestion.

```bash
# If you have OCR'd text already
kml put scanned_with_ocr.pdf
```

### Images

```bash
kml put photo.jpg
kml put screenshot.png

# Qwen 2 VL generates visual embeddings
# So "a photo of a sunset" will match "sunset" queries
```

### Office Documents

```bash
# Word documents
kml put proposal.docx

# Excel spreadsheets
kml put budget.xlsx

# PowerPoint presentations
kml put slides.pptx
```

### Code Files

```bash
kml put main.rs
kml put app.py
kml put components.jsx

# Entire source directories (batch ingestion)
kml put src/ --recursive
```

### Archives

Archives are ingested as-is. Kamelot does not unpack them:

```bash
kml put project.tar.gz
kml put backup.zip
```

To ingest the contents of an archive, unpack it first:

```bash
tar xzf project.tar.gz
kml put project/ --recursive
```

## Batch Ingestion

### Ingest a Directory

```bash
kml put ./documents/ --recursive
```

This ingests all files in `./documents/` and its subdirectories.

### Ingest with Glob Pattern

```bash
# Ingest all PDFs
kml put "*.pdf"

# Ingest all markdown files in a directory
kml put "docs/**/*.md"

# Ingest all Rust source files except tests
kml put "src/**/*.rs" --exclude "*_test.rs" --exclude "*/tests/*"
```

### Ingest from a List

```bash
# Create a file list
find ./data -name "*.pdf" > filelist.txt

# Ingest from the list
kml put --from-list filelist.txt
```

### Parallel Ingestion

```bash
# Ingest up to 4 files in parallel
kml put ./data/ --recursive --parallel 4
```

### Ingest with Progress

```bash
# Show a progress bar
kml put ./data/ --recursive --progress

# Output:
# [====================] 100/100 files (100%)
# 45 files ingested, 3 skipped, 2 errors
```

### Batch Ingestion Script

Here's a script to ingest files with deduplication:

```bash
#!/bin/bash
# ingest_all.sh - Batch ingest files into Kamelot

STORE_DIR="./kamelot_data"
INPUT_DIR="$1"

if [ -z "$INPUT_DIR" ]; then
    echo "Usage: $0 <input_directory>"
    exit 1
fi

echo "Ingesting files from $INPUT_DIR"

# Count files
FILE_COUNT=$(find "$INPUT_DIR" -type f | wc -l)
echo "Found $FILE_COUNT files"

# Ingest with progress
kml init "$STORE_DIR" 2>/dev/null || true

kml put "$INPUT_DIR" \
    --recursive \
    --parallel 4 \
    --progress \
    --skip-existing \
    --verbose

echo "Done! Ingested files from $INPUT_DIR"

# Show summary
kml list --count
```

## Verifying Ingestion

### List All Files

```bash
kml list
```

Expected output:

```
Inode                                     Name                    Size    MIME            Created
────────────────────────────────────────  ──────────────────────  ──────  ──────────────  ───────────────────
7f3a5c91-b2d4-4f8e-9a1c-3e5f7d8b2a1c    mydocument.txt          22 B    text/plain      2026-06-19 10:00:00
```

### List with Filters

```bash
# Filter by type
kml list --mime text/plain

# Filter by date
kml list --since "2026-06-01" --until "2026-06-30"

# Filter by size
kml list --min-size 1000 --max-size 1048576  # 1 KB to 1 MB

# Filter by tags
kml list --tag tutorial
```

### Count Files

```bash
kml list --count
# Total files: 1
```

### Show Storage Usage

```bash
kml status
```

Expected output:

```
Kamelot Store: ./kamelot_data
  Version: 1
  Status: Active

Ledger:
  Blocks: 2 (genesis + 1 operation)
  Integrity: INTACT
  Last Modified: 2026-06-19 10:00:00

Objects:
  Count: 1
  Raw Size: 22 bytes
  Encrypted Size: 62 bytes
  Dedup Savings: 0%

Qdrant:
  Host: 127.0.0.1:6333
  Status: Connected
  Collection: kamelot
  Vectors: 1
  Index: Ready

Ollama:
  Host: http://127.0.0.1:11434
  Status: Connected
  Model: qwen2-vl:2b (available)
```

### Get Detailed File Info

```bash
kml get mydocument.txt --info
```

Output:

```
File: mydocument.txt
  Inode:     7f3a5c91-b2d4-4f8e-9a1c-3e5f7d8b2a1c
  Size:      22 bytes
  MIME:      text/plain
  Created:   2026-06-19 10:00:00 UTC
  Ledger:    block #1
  Tags:      (none)
  Embedding: present (384 dims)
  Encryption:XChaCha20-Poly1305
```

## Viewing File Metadata

### Get Inode by Name

```bash
kml resolve mydocument.txt
# 7f3a5c91-b2d4-4f8e-9a1c-3e5f7d8b2a1c
```

### Get Embedding Vector

```bash
kml get 7f3a5c91-b2d4-4f8e-9a1c-3e5f7d8b2a1c --embedding
```

Output:

```
Embedding for 7f3a5c91-b2d4-4f8e-9a1c-3e5f7d8b2a1c:
  [0.0123, -0.0456, 0.0789, -0.0234, 0.0567, ...]
  (384 dimensions)
```

### Get Full Metadata as JSON

```bash
kml get mydocument.txt --json
```

Output:

```json
{
  "inode": "7f3a5c91-b2d4-4f8e-9a1c-3e5f7d8b2a1c",
  "name": "mydocument.txt",
  "size": 22,
  "mime_type": "text/plain",
  "created_at": "2026-06-19T10:00:00Z",
  "ledger_block": 1,
  "tags": [],
  "embedding_present": true,
  "embedding_dimensions": 384,
  "encryption": "XChaCha20-Poly1305",
  "object_hash": "7a3b5c..."
}
```

### Ledger History of a File

```bash
kml ledger --inode 7f3a5c91-b2d4-4f8e-9a1c-3e5f7d8b2a1c
```

Output:

```
Ledger entries for 7f3a5c91-b2d4-4f8e-9a1c-3e5f7d8b2a1c:
  Block #1  PUT   2026-06-19 10:00:00Z
```

## Common Ingestion Issues

### File Not Found

```bash
kml put nonexistent.txt
# Error: File not found: nonexistent.txt
```

Solution: Check the path and file permissions.

### Permission Denied

```bash
kml put /etc/shadow
# Error: Permission denied: /etc/shadow
```

Solution: Ensure you have read permissions for the file.

### Ollama Not Running

```bash
kml put test.txt
# Error: Failed to connect to Ollama at http://127.0.0.1:11434
# Is Ollama running? Start with: ollama serve
```

Solution: Start Ollama:
```bash
ollama serve
```

### Model Not Found

```bash
kml put test.txt
# Error: Model 'qwen2-vl:2b' not found in Ollama
# Pull it with: ollama pull qwen2-vl:2b
```

Solution: Pull the model:
```bash
ollama pull qwen2-vl:2b
```

### Qdrant Not Connected

```bash
kml put test.txt
# Error: Qdrant connection refused at 127.0.0.1:6333
```

Solution: Start Qdrant:
```bash
docker start qdrant
```

Or re-create the container:
```bash
docker run -d --name qdrant -p 6333:6333 qdrant/qdrant:latest
```

### Store Locked

```bash
kml put test.txt
# Error: Store is locked. Unlock with: kml unlock
```

Solution: Unlock the store:
```bash
kml unlock
```

### File Exceeds Size Limit

```bash
kml put large_video.mp4
# Warning: File is 4 GB. Large files are not embedded by default.
# Use --force to ingest without embedding, or --embed to force embedding.
```

Solution: Large files can be ingested without embedding:
```bash
kml put large_video.mp4 --no-embed
```

Or increase the limit:
```bash
kml config set max_embed_size 4294967296  # 4 GB
```

### Encoding Issues

For files with unusual encodings:
```bash
kml put weird_encoding.txt
# Warning: Could not determine encoding. Defaulting to UTF-8.
```

Solution: Convert the file to UTF-8 first:
```bash
iconv -f ISO-8859-1 -t UTF-8 weird_encoding.txt > fixed.txt
kml put fixed.txt
```

### Duplicate Detection

```bash
kml put mydocument.txt --dedup
# Info: Duplicate content detected. Skipping.
# Existing inode: 7f3a5c91-b2d4-4f8e-9a1c-3e5f7d8b2a1c
```

Kamelot detects duplicates by BLAKE3 hash. Use `--no-dedup` to force re-ingestion:
```bash
kml put mydocument.txt --no-dedup
```

## Advanced: Custom Embedding Configurations

### Using Different Models

You can configure Kamelot to use any Ollama-compatible model:

```toml
[ollama]
model = "nomic-embed-text:v1.5"
# Note: Different models have different vector dimensions
# You must match the vector_size in Qdrant configuration
```

Set custom vector dimensions:

```toml
[qdrant.collection]
vector_size = 768  # For nomic-embed-text
```

### Using GPU Acceleration

```toml
[ollama]
gpu_layers = 35  # Offload 35 layers to GPU
```

Check GPU availability:
```bash
ollama ps
# Shows which models are loaded and on which device
```

### Embedding Caching

```toml
[embedding.cache]
enabled = true
size = 1000  # Cache up to 1000 embeddings
ttl_seconds = 3600  # Expire after 1 hour
```

### Custom Prompt Templates

```toml
[embedding.prompts]
document = "Represent this document for search: {text}"
query = "Represent this query for search: {text}"
```

### Excluding Files from Embedding

```toml
[embedding.exclude]
patterns = ["*.tmp", "*.log", "*.bak"]
max_size = 10485760  # 10 MB
```

### Per-File Embedding Override

```bash
# Skip embedding for specific files
kml put temp.log --no-embed

# Force embedding for a file type that is normally skipped
kml put model.weights --force-embed
```

---

*Next tutorial: [04 — Searching with NL](04-searching-with-nl.md)*
