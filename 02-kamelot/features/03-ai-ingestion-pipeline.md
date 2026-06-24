                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                

# AI Ingestion Pipeline

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

- [Introduction](#introduction)
- [Pipeline Overview](#pipeline-overview)
- [Ingestion Architecture](#ingestion-architecture)
- [Pipeline Stages](#pipeline-stages)
- [File Type Detection](#file-type-detection)
- [Cognitive Scraping by File Type](#cognitive-scraping-by-file-type)
- [Encryption Stage](#encryption-stage)
- [Embedding Stage](#embedding-stage)
- [Indexing Stage](#indexing-stage)
- [Ledger Stage](#ledger-stage)
- [IPC Mechanism](#ipc-mechanism)
- [File Watcher](#file-watcher)
- [Batch Processing](#batch-processing)
- [Error Handling](#error-handling)
- [Performance Characteristics](#performance-characteristics)
- [Configuration](#configuration)
- [Extending for New File Types](#extending-for-new-file-types)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)

---

## Introduction

The AI ingestion pipeline is the process by which files enter the Kamelot semantic file system. It transforms raw files — PDFs, images, code, text, Office documents, and more — into encrypted, indexed, searchable semantic objects. The pipeline is fully automated, runs locally, and processes files as soon as they land in a watched directory or are explicitly ingested.

This document provides a comprehensive overview of the pipeline architecture, each processing stage, the cognitive scraping strategies for different file types, and the IPC mechanisms that connect the components.

---

## Pipeline Overview

The ingestion pipeline consists of five sequential stages:

```graphify
flowchart LR
    A[Raw File] --> B[File Detection]
    B --> C[Type Identification]
    C --> D[Cognitive Scraping]
    D --> E[Encryption]
    E --> F[Storage]
    F --> G[Embedding]
    G --> H[Indexing]
    H --> I[Ledger Append]
    I --> J[Indexed File]
    
    subgraph "Pre-processing"
        B
        C
    end
    
    subgraph "Extraction"
        D
    end
    
    subgraph "Persistence"
        E
        F
    end
    
    subgraph "Semantic"
        G
        H
    end
    
    subgraph "Compliance"
        I
    end
```

### Stage Summary

| Stage | Component | Description | Latency |
|-------|-----------|-------------|---------|
| File Detection | Watchdog (file watcher) | Detects new/modified files | Event-driven |
| Type Identification | Magic bytes + extension | Identifies file type | < 1 ms |
| Cognitive Scraping | Per-type extractor | Extracts meaningful text/content | 10 ms - 5 s |
| Encryption | XChaCha20-Poly1305 | Encrypts file contents | 1 ms - 100 ms |
| Storage | Flat Encrypted Store | Writes encrypted blob | 1 ms - 50 ms |
| Embedding | Qwen 2 VL Q4 | Generates 1536-dim vector | 50 ms - 800 ms |
| Indexing | Qdrant | Inserts vector into HNSW index | 2 ms - 10 ms |
| Ledger | .aioss Append-Only Log | Records ingestion event | 1 ms |

---

## Ingestion Architecture

```graphify
graph TD
    subgraph "User Space"
        W[File Watcher<br/>inotify / ReadDirectoryChanges]
        M[Manual Ingest<br/>kml ingest path]
        I[IPC Server<br/>Unix Socket / Named Pipe]
    end
    
    subgraph "Pipeline Daemon"
        Q[Ingestion Queue<br/>tokio mpsc channel]
        P1[Pre-processor]
        P2[Cognitive Scraper]
        P3[Encryptor]
        P4[Embedder<br/>Qwen 2 VL]
        P5[Indexer<br/>Qdrant Client]
        P6[Ledger Writer]
    end
    
    subgraph "Storage Layer"
        FS[Flat Encrypted Store]
        QD[Qdrant Vector DB]
        SL[sled Metadata DB]
        LG[.aioss Ledger]
    end
    
    W --> I
    M --> I
    I --> Q
    Q --> P1
    P1 --> P2
    P2 --> P3
    P3 --> P4
    P4 --> P5
    P5 --> P6
    P3 --> FS
    P3 --> SL
    P5 --> QD
    P6 --> LG
```

---

## Pipeline Stages

### Stage 1: File Detection

Files enter the pipeline through one of three mechanisms:

**1. File Watcher** — The `kml watch` command monitors directories for changes using platform-specific APIs:

| Platform | API | Events |
|----------|-----|--------|
| Linux | inotify | IN_CREATE, IN_MODIFY, IN_MOVED_TO |
| macOS | FSEvents | kFSEventStreamEventFlagItemCreated, etc. |
| Windows | ReadDirectoryChangesW | FILE_NOTIFY_CHANGE_LAST_WRITE, etc. |

The watcher implements a debounce mechanism to handle atomic saves and rapid write sequences:

```rust
struct FileEvent {
    path: PathBuf,
    event_type: EventType,
    timestamp: Instant,
}

// Debounce: wait 500ms after last write before processing
let debounced = stream
    .debounce(Duration::from_millis(500))
    .filter(|e| {
        // Ignore temporary files and hidden files
        !e.path.is_hidden() && !e.path.is_temp()
    });
```

**2. Manual Ingest** — The `kml ingest` command explicitly adds files:

```bash
kml ingest report.pdf
kml ingest --recursive ~/Documents/
kml ingest --priority high urgent.docx
```

**3. API Ingestion** — External applications can push files through the gRPC API:

```bash
curl -X POST http://localhost:9000/api/v1/ingest \
  -F "file=@report.pdf" \
  -F "priority=high"
```

### Stage 2: Type Identification

Before processing, the file type must be identified to select the appropriate cognitive scraper:

```rust
fn identify_file_type(path: &Path, content: &[u8]) -> FileType {
    // Check magic bytes first (most reliable)
    if let Some(magic) = detect_magic_bytes(content) {
        return magic;
    }
    
    // Fall back to extension
    match path.extension().and_then(|e| e.to_str()) {
        Some("pdf") => FileType::Pdf,
        Some("jpg") | Some("jpeg") => FileType::Image,
        Some("png") => FileType::Image,
        Some("rs") | Some("py") | Some("ts") => FileType::Code,
        Some("txt") | Some("md") => FileType::Text,
        Some("docx") => FileType::Office,
        Some("xlsx") => FileType::Spreadsheet,
        _ => FileType::Binary,
    }
}
```

### Stage 3: Cognitive Scraping

Cognitive scraping is the process of extracting meaningful semantic content from a file. The strategy varies by file type and is detailed in the next section.

### Stage 4: Encryption

The raw file content (or the scraped text, depending on configuration) is encrypted at this stage:

```rust
fn encrypt_blob(plaintext: &[u8], key: &[u8; 32]) -> Result<(Vec<u8>, [u8; 24])> {
    let nonce = generate_random_nonce();
    let ciphertext = xchacha20_poly1305_encrypt(plaintext, key, &nonce);
    
    // Prepend metadata header
    let mut blob = Vec::new();
    blob.extend_from_slice(b"KMLT");    // Magic
    blob.extend_from_slice(&nonce);      // 24-byte nonce
    blob.extend_from_slice(&ciphertext); // Encrypted content + tag
    
    Ok((blob, nonce))
}
```

### Stage 5: Storage

The encrypted blob is written to the flat encrypted store:

```rust
let inode = store.allocate_inode();
store.write_blob(inode, &encrypted_blob)?;
store.set_metadata(Metadata {
    inode,
    filename: path.file_name().unwrap().to_string_lossy().to_string(),
    original_path: path.to_string_lossy().to_string(),
    size: plaintext.len() as u64,
    mime_type: identified_mime,
    created_at: SystemTime::now(),
    file_type: identified_file_type,
})?;
```

### Stage 6: Embedding

The scraped text (or file content for text-based files) is embedded using Qwen 2 VL:

```rust
fn embed_content(text: &str, model: &QwenModel) -> Result<Vec<f32>> {
    // Normalize and truncate to context length
    let text = preprocess(text);
    let text = truncate_to_tokens(&text, model.context_length());
    
    // Generate embedding
    let embedding = model.embed(text)?;
    
    // L2 normalize
    let norm: f32 = embedding.iter().map(|x| x * x).sum::<f32>().sqrt();
    let normalized: Vec<f32> = embedding.into_iter()
        .map(|x| x / norm)
        .collect();
    
    Ok(normalized)
}
```

### Stage 7: Indexing

The normalized embedding vector is indexed into Qdrant:

```rust
qdrant_client.upsert(PointStruct {
    id: inode.into(),
    vector: normalized_embedding,
    payload: payload_map! {
        "filename" => metadata.filename,
        "mime_type" => metadata.mime_type,
        "size" => metadata.size as u64,
        "file_type" => format!("{:?}", metadata.file_type),
        "created_at" => metadata.created_at.duration_since(UNIX_EPOCH)?.as_secs(),
    },
})?;
```

### Stage 8: Ledger Append

A permanent record of the ingestion is appended to the .aioss ledger:

```rust
let entry = LedgerEntry {
    entry_type: EntryType::FileCreate,
    timestamp: SystemTime::now(),
    inode,
    previous_hash: ledger.last_hash(),
    payload: ledger_payload,
};

let entry_bytes = entry.serialize()?;
let entry_hash = blake3::hash(&entry_bytes);
ledger.append(&entry_bytes)?;
```

---

## File Type Detection

Kamelot uses a two-level file type detection system:

### Level 1: Magic Bytes

The first bytes of a file are compared against known signatures:

| Magic Bytes | File Type | Offset |
|-------------|-----------|--------|
| `%PDF` | PDF | 0 |
| `\x89PNG` | PNG | 0 |
| `\xFF\xD8\xFF` | JPEG | 0 |
| `PK\x03\x04` | ZIP/DOCX/XLSX | 0 |
| `\x1F\x8B` | GZIP | 0 |
| `\x42\x4D` | BMP | 0 |
| `\x00\x01\x00\x00` | TTF | 0 |
| `\x1A\x45\xDF\xA3` | WebM/MKV | 0 |
| `{\rtf` | RTF | 0 |
| `\x00\x00\x00\x20ftyp` | MP4/M4A | 4 |

### Level 2: Extension Analysis

If magic bytes do not match, the file extension is used as a fallback:

```rust
fn type_from_extension(ext: &str) -> Option<FileType> {
    match ext.to_lowercase().as_str() {
        "rs" | "py" | "ts" | "js" | "go" | "c" | "cpp" | "h" |
        "java" | "rb" | "php" | "swift" | "kt" | "scala" => Some(FileType::Code),
        
        "txt" | "md" | "rst" | "asciidoc" | "log" | "cfg" |
        "ini" | "toml" | "yaml" | "yml" | "json" | "xml" => Some(FileType::Text),
        
        "doc" | "docx" | "odt" | "rtf" => Some(FileType::Office),
        "xls" | "xlsx" | "ods" | "csv" => Some(FileType::Spreadsheet),
        "ppt" | "pptx" | "odp" => Some(FileType::Presentation),
        
        "pdf" => Some(FileType::Pdf),
        "jpg" | "jpeg" | "png" | "gif" | "bmp" | "webp" | "svg" |
        "tiff" | "tif" | "ico" | "heic" | "heif" => Some(FileType::Image),
        
        "mp4" | "mkv" | "avi" | "mov" | "webm" | "wmv" |
        "flv" | "m4v" => Some(FileType::Video),
        
        "mp3" | "wav" | "flac" | "ogg" | "aac" | "wma" |
        "m4a" | "opus" => Some(FileType::Audio),
        
        _ => Some(FileType::Binary),
    }
}
```

---

## Cognitive Scraping by File Type

Cognitive scraping is the most critical stage of the pipeline. The quality of the extracted text directly determines the quality of the embedding and therefore the quality of search results.

### PDF Files

PDF files are among the most common and most challenging to scrape:

```rust
fn scrape_pdf(content: &[u8]) -> Result<String> {
    let doc = pdf_extract::extract_text(content)?;
    let mut text = String::new();
    
    // Extract text layer
    for page in doc.pages() {
        text.push_str(&page.text());
        text.push('\n');
    }
    
    // If text layer is empty or too sparse, use OCR
    if text.trim().len() < 100 {
        text = ocr_pdf(content)?;
    }
    
    // Extract metadata
    if let Ok(meta) = pdf_metadata(content) {
        text.push_str(&format!("\n--- Metadata ---\n"));
        text.push_str(&format!("Title: {}\n", meta.title));
        text.push_str(&format!("Author: {}\n", meta.author));
        text.push_str(&format!("Subject: {}\n", meta.subject));
    }
    
    Ok(text)
}
```

**Strategies:**

| Strategy | Used When | Quality |
|----------|-----------|---------|
| Direct text extraction | Text-based PDFs, digitally created | High |
| PDF OCR (Tesseract) | Scanned documents, image-only PDFs | Medium |
| Metadata extraction | Always | Supplementary |
| Table extraction | Tables present | Medium |
| Header/footer/watermark removal | Always | Improves quality |

### Image Files

Images require vision-language understanding:

```rust
fn scrape_image(content: &[u8]) -> Result<String> {
    // Use Qwen 2 VL's vision capabilities
    let caption = qwen_model.caption(content, "Describe this image in detail")?;
    
    // Extract EXIF metadata
    let exif = read_exif(content)?;
    let mut text = caption;
    
    if let Some(exif) = exif {
        text.push_str(&format!("\n--- EXIF ---\n"));
        text.push_str(&format!("Date: {}\n", exif.date_time));
        text.push_str(&format!("Camera: {} {}\n", exif.make, exif.model));
        text.push_str(&format!("GPS: {:?}\n", exif.gps_coordinates));
    }
    
    // For documents and screenshots, also extract embedded text
    if has_embedded_text(content) {
        text.push_str(&format!("\n--- OCR ---\n"));
        text.push_str(&ocr_image(content)?);
    }
    
    Ok(text)
}
```

**Strategies:**

| Strategy | Used When | Quality |
|----------|-----------|---------|
| Vision captioning | Most images | Good (general description) |
| OCR | Text-heavy images | Good |
| EXIF extraction | Photos | Supplementary |
| Object detection | Complex scenes | Medium |
| Face recognition | Portrait photos | Privacy-sensitive |

### Code Files

Code files require structure-aware extraction:

```rust
fn scrape_code(content: &[u8], language: &str) -> Result<String> {
    let source = String::from_utf8_lossy(content);
    let mut text = String::new();
    
    // Extract comments
    let comments = extract_comments(&source, language);
    text.push_str("--- Comments ---\n");
    text.push_str(&comments.join("\n"));
    
    // Extract function signatures
    let functions = extract_function_signatures(&source, language);
    text.push_str("\n--- Functions ---\n");
    text.push_str(&functions.join("\n"));
    
    // Extract identifiers and symbols
    let symbols = extract_symbols(&source, language);
    text.push_str("\n--- Symbols ---\n");
    text.push_str(&symbols.join(", "));
    
    // Include language name and key dependencies
    let deps = extract_imports(&source, language);
    text.push_str("\n--- Dependencies ---\n");
    text.push_str(&deps.join("\n"));
    
    Ok(text)
}
```

**Strategies:**

| Strategy | Used When | Quality |
|----------|-----------|---------|
| Comment extraction | All code | High (most semantic) |
| Function/class signatures | All code | High |
| Import/require statements | All code | Medium |
| Variable names | All code | Medium |
| Documentation strings | Present | Very high |
| Symbol frequency analysis | Large codebases | Supplementary |

### Text Files

Plain text, Markdown, and other text formats:

```rust
fn scrape_text(content: &[u8], file_type: &str) -> Result<String> {
    let text = String::from_utf8_lossy(content).to_string();
    
    match file_type {
        "md" => {
            // Strip Markdown formatting
            let plain = strip_markdown(&text);
            // But keep headers and emphasis as semantic cues
            format!("--- Headers ---\n{}\n\n--- Content ---\n{}",
                extract_headers(&text), plain)
        }
        "json" | "yaml" | "toml" => {
            // Parse and extract keys and values
            let parsed = parse_structured_data(&text, file_type)?;
            format_keys_and_values(&parsed)
        }
        _ => text,
    }
}
```

### Office Documents

DOCX, XLSX, PPTX files (ZIP-based formats):

```rust
fn scrape_office(content: &[u8]) -> Result<String> {
    let archive = zip::ZipArchive::new(std::io::Cursor::new(content))?;
    let mut text = String::new();
    
    // DOCX: Extract document.xml
    if let Ok(doc_xml) = archive.by_name("word/document.xml") {
        text.push_str(&extract_text_from_xml(doc_xml));
    }
    
    // XLSX: Extract shared strings and sheet data
    if let Ok(strings) = archive.by_name("xl/sharedStrings.xml") {
        text.push_str("\n--- Sheet data ---\n");
        text.push_str(&extract_text_from_xml(strings));
    }
    
    // Extract metadata
    if let Ok(core) = archive.by_name("docProps/core.xml") {
        text.push_str("\n--- Metadata ---\n");
        text.push_str(&extract_text_from_xml(core));
    }
    
    Ok(text)
}
```

### Spreadsheets

Spreadsheets require special handling to extract meaningful semantic content:

```rust
fn scrape_spreadsheet(content: &[u8]) -> Result<String> {
    let mut workbook = calamine::open_workbook_from_auto(content)?;
    let mut text = String::new();
    
    for sheet_name in workbook.sheet_names() {
        // Use sheet name as context
        text.push_str(&format!("\n=== Sheet: {} ===\n", sheet_name));
        
        if let Ok(range) = workbook.worksheet_range(&sheet_name) {
            // Extract headers (first row) as context
            if let Some(first_row) = range.rows().next() {
                text.push_str(&format!("Headers: {}\n",
                    first_row.iter()
                        .filter_map(|c| c.get_string())
                        .collect::<Vec<_>>()
                        .join(", ")));
            }
            
            // Extract data rows (up to 100)
            for row in range.rows().skip(1).take(100) {
                let cells: Vec<String> = row.iter()
                    .map(|c| c.to_string())
                    .collect();
                text.push_str(&format!("Row: {}\n", cells.join(" | ")));
            }
        }
    }
    
    Ok(text)
}
```

### Audio Files

Audio files are transcribed using speech-to-text:

```rust
fn scrape_audio(content: &[u8]) -> Result<String> {
    // Extract metadata
    let tag = audiotags::Tag::new().read_from(content)?;
    let mut text = format!(
        "Title: {}\nArtist: {}\nAlbum: {}\nGenre: {}\n",
        tag.title().unwrap_or(""),
        tag.artist().unwrap_or(""),
        tag.album().unwrap_or(""),
        tag.genre().unwrap_or(""),
    );
    
    // If it's a speech recording, transcribe
    if is_speech_audio(content) {
        let transcription = whisper_transcribe(content)?;
        text.push_str(&format!("\n--- Transcription ---\n{}", transcription));
    }
    
    Ok(text)
}
```

### Video Files

Videos extract key frames and audio:

```rust
fn scrape_video(content: &[u8]) -> Result<String> {
    // Extract metadata
    let metadata = ffprobe::get_metadata(content)?;
    let mut text = format!(
        "Duration: {}s\nCodec: {}\nResolution: {}x{}\n",
        metadata.duration, metadata.codec, metadata.width, metadata.height
    );
    
    // Extract key frames at intervals
    let frames = extract_key_frames(content, 5)?; // 5 key frames
    for (i, frame) in frames.iter().enumerate() {
        let caption = qwen_model.caption(frame, "Describe this video frame")?;
        text.push_str(&format!("\nFrame {}: {}", i, caption));
    }
    
    // Extract audio transcription if available
    if let Ok(audio) = extract_audio_track(content) {
        if let Ok(transcript) = whisper_transcribe(&audio) {
            text.push_str(&format!("\n--- Audio Transcript ---\n{}", transcript));
        }
    }
    
    Ok(text)
}
```

### Binary Files

For unrecognized binary files, the system falls back to available metadata:

```rust
fn scrape_binary(path: &Path, content: &[u8]) -> Result<String> {
    let metadata = std::fs::metadata(path)?;
    let mut text = format!(
        "Filename: {}\nSize: {} bytes\nCreated: {}\nModified: {}\n",
        path.file_name().unwrap().to_string_lossy(),
        metadata.len(),
        format_time(metadata.created()?),
        format_time(metadata.modified()?),
    );
    
    // Try to extract strings from binary
    if let Ok(strings) = extract_readable_strings(content, 4) {
        text.push_str("\n--- Embedded text ---\n");
        text.push_str(&strings.join("\n"));
    }
    
    Ok(text)
}
```

---

## Encryption Stage

The encryption stage uses XChaCha20-Poly1305 to encrypt file contents before storage:

### Encryption Flow

```graphify
flowchart TD
    A[Plaintext Content] --> B[Generate 24-byte Nonce]
    B --> C[Derive Subkey with HChaCha20]
    C --> D[Encrypt with ChaCha20]
    D --> E[Compute Poly1305 MAC]
    E --> F[Prepend KMLT Header]
    F --> G[Encrypted Blob]
    
    H[Master Key<br/>256-bit] --> C
    I[Nonce Counter] --> B
```

### Key Derivation

The master encryption key is derived from a BIP-39 mnemonic using Argon2id:

```rust
fn derive_key(mnemonic: &str, salt: &[u8]) -> [u8; 32] {
    let seed = bip39::mnemonic_to_seed(mnemonic, "");
    argon2id::hash(seed.as_bytes(), salt, &Params {
        mem_cost: 65536,     // 64 MB
        time_cost: 3,        // 3 iterations
        parallelism: 4,      // 4 threads
    })
}
```

---

## Embedding Stage

The embedding stage converts scraped text into a 1536-dimensional vector using Qwen 2 VL Q4.

### Text Preprocessing

Before embedding, text is preprocessed:

1. **Normalization**: Unicode normalization (NFC), whitespace normalization
2. **Truncation**: Truncate to model's context length (8192 tokens)
3. **Chunking**: Documents longer than context length are chunked with overlap
4. **Weighting**: Different sections (headers, body, metadata) can be weighted differently

### Multi-Vector Strategy

For complex documents, Kamelot can generate multiple vectors:

- One vector for the full document
- One vector for the title and headers
- One vector for key sections

These are combined during search using a weighted average or max-pooling.

---

## Indexing Stage

The indexing stage inserts the vector and metadata into Qdrant.

### Payload Structure

```json
{
    "inode": "000000000000002a",
    "filename": "tax_report_2024.pdf",
    "original_path": "/home/user/Documents/tax_report_2024.pdf",
    "mime_type": "application/pdf",
    "size": 2456789,
    "file_type": "Pdf",
    "created_at": 1736897400,
    "modified_at": 1736897400,
    "indexed_at": 1736954400,
    "embedding_model": "qwen2-vl-q4",
    "content_hash": "sha256:abcd1234...",
    "tags": ["tax", "finance", "2024"]
}
```

---

## Ledger Stage

Each ingestion creates a permanent ledger entry:

| Field | Value |
|-------|-------|
| Entry Type | `FileCreate` or `FileUpdate` |
| Timestamp | Unix nanoseconds |
| Inode | 64-bit identifier |
| Previous Hash | BLAKE3 hash of previous entry |
| Content Hash | SHA-256 of file content |
| Metadata Hash | SHA-256 of metadata |
| Entry Hash | BLAKE3 of this entry |

---

## IPC Mechanism

Kamelot uses inter-process communication to coordinate the pipeline components:

### Unix Sockets (Linux/macOS)

```rust
// Server (pipeline daemon)
let listener = UnixListener::bind("/var/run/kamelot/ingest.sock")?;
loop {
    let (stream, _) = listener.accept().await?;
    tokio::spawn(handle_connection(stream));
}

// Client (file watcher)
let stream = UnixStream::connect("/var/run/kamelot/ingest.sock").await?;
stream.write_all(&ingest_request.encode_to_vec()).await?;
```

### Named Pipes (Windows)

```rust
// Server
let pipe = NamedPipeServer::new(r"\\.\pipe\kamelot_ingest")?;
loop {
    pipe.connect().await?;
    tokio::spawn(handle_pipe(pipe));
}

// Client
let pipe = NamedPipeClient::new(r"\\.\pipe\kamelot_ingest")?;
pipe.connect().await?;
pipe.write_all(&ingest_request).await?;
```

### Protocol

Messages are length-prefixed protobuf:

```protobuf
message IngestRequest {
    string path = 1;
    bytes content = 2;
    Priority priority = 3;
    map<string, string> metadata = 4;
}

message IngestResponse {
    uint64 inode = 1;
    Status status = 2;
    string error = 3;
}

enum Priority {
    LOW = 0;
    NORMAL = 1;
    HIGH = 2;
}

enum Status {
    OK = 0;
    ERROR = 1;
    DUPLICATE = 2;
}
```

---

## File Watcher

The file watcher monitors directories for changes:

```bash
kml watch ~/Documents
kml watch ~/Downloads --recursive
kml watch --exclude "*.tmp" --include "*.pdf,*.rs,*.md"
```

### Watcher Configuration

```toml
[watcher]
# Directories to watch
directories = ["~/Documents", "~/Downloads"]

# Recursive watch
recursive = true

# File patterns to include
include = ["*.pdf", "*.rs", "*.md", "*.jpg", "*.png"]

# File patterns to exclude
exclude = ["*.tmp", "*.swp", "*.lock", ".git/*"]

# Debounce interval (ms)
debounce_ms = 500

# Priority of watched files
priority = "normal"

# Whether to process hidden files
include_hidden = false

# Maximum file size (bytes)
max_file_size = "500MB"
```

---

## Batch Processing

For large ingestion operations, Kamelot supports batch processing:

```bash
kml ingest --batch ~/Documents/ --workers 4
```

### Batch Architecture

```graphify
flowchart TD
    A[File Scanner] --> B[Batch Queue<br/>10,000 files]
    B --> C[Worker 1]
    B --> D[Worker 2]
    B --> E[Worker 3]
    B --> F[Worker 4]
    C --> G[Shared Embedder<br/>Pool of 2 GPU contexts]
    D --> G
    E --> G
    F --> G
    G --> H[Qdrant Batch<br/>Insert 100 at a time]
    H --> I[Ledger Batch<br/>Append 1000 at a time]
```

### Batch Performance

| Files | Workers | Time | Throughput |
|-------|---------|------|-----------|
| 100 | 1 | 45 s | 2.2 files/s |
| 100 | 4 | 15 s | 6.7 files/s |
| 1000 | 4 | 185 s | 5.4 files/s |
| 10000 | 4 | 28 min | 6.0 files/s |
| 10000 | 8 | 19 min | 8.8 files/s |

---

## Error Handling

### Retry Strategy

| Error Type | Retries | Backoff | Action |
|-----------|---------|---------|--------|
| Storage write failure | 3 | Exponential (100ms, 500ms, 2s) | Mark file as pending |
| Embedding failure | 2 | Linear (1s, 5s) | Queue for reprocessing |
| Qdrant timeout | 3 | Exponential (100ms, 500ms, 1s) | Skip and log |
| Ledger write failure | 3 | Exponential (100ms, 500ms, 2s) | Block pipeline |
| Transient read error | 2 | Immediate | Re-read file |

### Dead Letter Queue

Files that fail processing after all retries are moved to a dead letter queue:

```bash
kml ingestion failures
# Lists files that failed ingestion with error details

kml ingestion retry /path/to/failed/file.pdf
# Retry a specific failed file

kml ingestion retry-all
# Retry all failed files
```

---

## Performance Characteristics

### Per-File Latency (GPU)

| File Type | Average Size | Scrape | Encrypt | Embed | Index | Total |
|-----------|-------------|--------|---------|-------|-------|-------|
| Text | 10 KB | 2 ms | 1 ms | 50 ms | 2 ms | 55 ms |
| PDF | 2 MB | 180 ms | 8 ms | 180 ms | 3 ms | 371 ms |
| Image | 5 MB | 350 ms | 15 ms | 300 ms | 3 ms | 668 ms |
| Code | 50 KB | 15 ms | 2 ms | 65 ms | 2 ms | 84 ms |
| Office | 500 KB | 85 ms | 5 ms | 120 ms | 2 ms | 212 ms |
| Audio | 10 MB | 120 ms | 25 ms | 500 ms | 3 ms | 648 ms |
| Video | 100 MB | 2.5 s | 150 ms | 1.2 s | 5 ms | 3.85 s |

### Resource Usage

| Component | CPU | Memory | GPU VRAM | Disk I/O |
|-----------|-----|--------|----------|----------|
| File Watcher | <1% | 50 MB | 0 | Low |
| Cognitive Scraper | 20-50% | 200 MB | 0 | Medium |
| Encryptor | 5-10% | 10 MB | 0 | Low |
| Embedder | 30-80% | 2 GB | 4 GB | Low |
| Indexer | 2-5% | 100 MB | 0 | Medium |
| Ledger Writer | <1% | 10 MB | 0 | Low |

---

## Configuration

### Full Ingestion Configuration

```toml
[ingestion]
# Default priority for ingested files
default_priority = "normal"

# Maximum file size to process (larger files are skipped)
max_file_size = "500MB"

# Whether to process files in-place or copy to store
mode = "copy"  # or "reference"

# Text extraction configuration
[ingestion.extraction]
# Enable OCR for PDFs and images
ocr_enabled = true
ocr_language = "eng"

# Enable audio transcription
transcription_enabled = true
transcription_language = "en"

# Maximum tokens to extract per file
max_extraction_tokens = 16384

# Chunk overlap for long documents
chunk_overlap_tokens = 256

[ingestion.embedding]
# Model to use
model = "qwen2-vl-q4"

# Context length
context_length = 8192

# Batch size for batch embedding
batch_size = 8

# Number of GPU layers
gpu_layers = 33

[ingestion.storage]
# Compression before encryption
compress_before_encrypt = true
compression_level = 6  # 0-9 (zstd)

# Whether to deduplicate content
deduplicate = true
dedup_hash = "blake3"
```

---

## Extending for New File Types

The ingestion pipeline is designed to be extensible. New file types can be added by implementing the `CognitiveScraper` trait:

```rust
pub trait CognitiveScraper: Send + Sync {
    /// The MIME types this scraper handles
    fn supported_types(&self) -> Vec<&'static str>;
    
    /// Extract semantic text from file content
    fn scrape(&self, content: &[u8], metadata: &FileMetadata) -> Result<String>;
    
    /// Priority (higher = preferred when multiple scrapers match)
    fn priority(&self) -> u32 { 0 }
}
```

### Example: Adding EPUB Support

```rust
struct EpubScraper;

impl CognitiveScraper for EpubScraper {
    fn supported_types(&self) -> Vec<&'static str> {
        vec!["application/epub+zip"]
    }
    
    fn scrape(&self, content: &[u8], _metadata: &FileMetadata) -> Result<String> {
        let epub = epub::doc::EpubDoc::from_reader(content)?;
        let mut text = String::new();
        
        // Extract metadata
        if let Some(title) = epub.metadata("title").first() {
            text.push_str(&format!("Title: {}\n", title));
        }
        if let Some(author) = epub.metadata("creator").first() {
            text.push_str(&format!("Author: {}\n", author));
        }
        
        // Extract chapter text
        for resource_id in epub.spine {
            if let Some(content) = epub.get_resource(&resource_id)? {
                let chapter_text = extract_html_text(&content);
                text.push_str(&format!("\n--- Chapter ---\n{}", chapter_text));
            }
        }
        
        Ok(text)
    }
}

// Register the scraper
pipeline.register_scraper(Box::new(EpubScraper));
```

---

## Security Considerations

### Data Handling

- Scraped text is held in memory only during embedding, then discarded
- File contents are encrypted before being written to disk
- The encryption key is never stored with the data
- Temporary files are zeroed and deleted after processing

### Sandboxing

Each cognitive scraper runs in a sandboxed environment:
- Limited file system access (only the file being processed)
- No network access
- Memory limits (configurable per scraper)
- Timeout per file type

### Privacy

- No data is sent to external services
- OCR and transcription run locally
- The embedding model is fully local
- No telemetry or analytics

---

## Troubleshooting

### Common Issues

**Issue: File watcher not detecting new files**
- Check if the directory exists and is readable
- Verify the platform-specific watch limit: `cat /proc/sys/fs/inotify/max_user_watches`
- Restart the watcher: `kml watch --restart`

**Issue: Cognitive scraping fails**
- Check file integrity: the file may be corrupted
- Verify the scraper supports the file type
- Check OCR language pack availability
- Review pipeline logs: `kml logs --pipeline`

**Issue: Embedding is slow**
- Verify GPU acceleration is active
- Reduce batch size for lower latency
- Increase GPU layers for better throughput
- Check for thermal throttling

**Issue: Ingestion queue is backing up**
- Increase worker count: `kml ingest --workers 8`
- Check for stuck workers in logs
- Verify Qdrant is responsive
- Consider increasing batch sizes

### Logs

```bash
# View pipeline logs
kml logs --pipeline

# View real-time ingestion
kml watch --verbose

# Check ingestion statistics
kml stats

# Verify file was indexed
kml query "filename:report.pdf"
```
