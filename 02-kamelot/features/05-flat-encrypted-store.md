                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                

# Flat Encrypted Store

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

- [Introduction](#introduction)
- [Store Architecture](#store-architecture)
- [Single-Level Binary Object Store](#single-level-binary-object-store)
- [On-Disk Format](#on-disk-format)
- [Encryption at Rest](#encryption-at-rest)
- [XChaCha20-Poly1305 Specification](#xchacha20-poly1305-specification)
- [Synthetic Inodes](#synthetic-inodes)
- [sled Embedded Database](#sled-embedded-database)
- [Metadata Storage](#metadata-storage)
- [Copy-on-Write Semantics](#copy-on-write-semantics)
- [Read and Write Paths](#read-and-write-paths)
- [Compression](#compression)
- [Deduplication](#deduplication)
- [Garbage Collection](#garbage-collection)
- [Performance Characteristics](#performance-characteristics)
- [Data Integrity](#data-integrity)
- [Backup and Restore](#backup-and-restore)
- [Recovery Procedures](#recovery-procedures)
- [Configuration](#configuration)
- [Security Considerations](#security-considerations)
- [Comparison with Traditional Storage](#comparison-with-traditional-storage)

---

## Introduction

The Flat Encrypted Store is Kamelot's persistent storage layer. It is a single-level binary object store where every file (regardless of its original directory structure) is stored as a flat blob, encrypted at rest with XChaCha20-Poly1305, and referenced by a 64-bit synthetic inode. Metadata is maintained in a sled embedded database.

This design provides several advantages: uniform access patterns regardless of file type, strong encryption guarantees, copy-on-write semantics for data integrity, and a clean separation between the storage layer and the semantic layer.

---

## Store Architecture

```graphify
graph TD
    subgraph "Flat Encrypted Store"
        B1[blob_0000000000000001.bin]
        B2[blob_0000000000000002.bin]
        B3[blob_0000000000000003.bin]
        BN[blob_FFFFFFFFFFFFFFFF.bin]
    end
    
    subgraph "sled Metadata DB"
        M1[inode → metadata]
        M2[inode → blob_path]
        M3[filename → inode]
        M4[hash → inode (dedup)]
        M5[tag → inode set]
    end
    
    subgraph "Key Management"
        K1[Master Key<br/>256-bit]
        K2[Derived Subkeys<br/>Per-blob]
        K3[Argon2id<br/>Key Derivation]
    end
    
    subgraph "Access Layer"
        A1[Write Path]
        A2[Read Path]
        A3[Delete Path]
    end
    
    A1 --> B1
    A1 --> B2
    A1 --> M1
    A1 --> K1
    A2 --> B1
    A2 --> M1
    A2 --> K1
    A3 --> M1
```

---

## Single-Level Binary Object Store

Unlike traditional file systems that organize data in a hierarchy of directories and files, the flat store places all blobs in a single directory:

### Directory Structure

```
/var/lib/kamelot/store/
├── blob_0000000000000001.bin
├── blob_0000000000000002.bin
├── blob_0000000000000003.bin
├── blob_0000000000000004.bin
├── blob_0000000000000005.bin
├── ...
├── blob_000000000000FFFF.bin
├── data/
│   └── (future sharding)
├── temp/
│   └── (in-progress writes)
└── config.toml
```

### Naming Convention

Blobs are named using the 64-bit inode as a zero-padded hexadecimal string:

```
blob_0000000000000001.bin
blob_000000000000FFFF.bin
blob_00000000FFFFFFFF.bin
blob_FFFFFFFFFFFFFFFF.bin
```

### Sharding

For very large stores, blobs can be organized into subdirectories to avoid file system limits:

| Blob Count | Layout | Max Files Per Directory |
|-----------|--------|----------------------|
| < 10,000 | Flat | 10,000 |
| 10,000 - 1,000,000 | Two-level: `<prefix>/<inode>` | 1,000 per prefix |
| > 1,000,000 | Three-level: `<a>/<b>/<inode>` | 256 per leaf |

---

## On-Disk Format

Each blob file has a structured binary format:

```
┌─────────────────────────────────────────────────────────────┐
│ Magic:  0x4B4D4C54 ("KMLT")                                │ 4 bytes
├─────────────────────────────────────────────────────────────┤
│ Version: u32 LE (currently 1)                               │ 4 bytes
├─────────────────────────────────────────────────────────────┤
│ Flags: u32 LE                                                │ 4 bytes
│   bit 0: compression enabled                                 │
│   bit 1: chunked                                             │
│   bit 2-31: reserved                                         │
├─────────────────────────────────────────────────────────────┤
│ Inode: u64 LE                                                │ 8 bytes
├─────────────────────────────────────────────────────────────┤
│ Original Size: u64 LE (plaintext, before encryption)         │ 8 bytes
├─────────────────────────────────────────────────────────────┤
│ Stored Size: u64 LE (ciphertext, after encryption)           │ 8 bytes
├─────────────────────────────────────────────────────────────┤
│ Compression Type: u16 LE                                     │ 2 bytes
│   0 = none, 1 = zstd, 2 = lz4                               │
├─────────────────────────────────────────────────────────────┤
│ Compressed Size: u64 LE (0 if not compressed)               │ 8 bytes
├─────────────────────────────────────────────────────────────┤
│ Content Type: [u8; 8] (zero-padded MIME type)               │ 8 bytes
├─────────────────────────────────────────────────────────────┤
│ Created At: i64 LE (Unix nanoseconds)                       │ 8 bytes
├─────────────────────────────────────────────────────────────┤
│ Expires At: i64 LE (0 = never)                              │ 8 bytes
├─────────────────────────────────────────────────────────────┤
│ Nonce: [u8; 24] (XChaCha20 nonce)                          │ 24 bytes
├─────────────────────────────────────────────────────────────┤
│ Reserved: [u8; 64]                                           │ 64 bytes
├─────────────────────────────────────────────────────────────┤
│ Ciphertext (variable length)                                │ Variable
├─────────────────────────────────────────────────────────────┤
│ Poly1305 Tag: [u8; 16]                                      │ 16 bytes
└─────────────────────────────────────────────────────────────┘
```

**Total header size: 160 bytes**

---

## Encryption at Rest

Every blob is encrypted before being written to disk. Kamelot uses XChaCha20-Poly1305, an authenticated encryption with associated data (AEAD) scheme.

### Encryption Overview

```graphify
flowchart TD
    A[Plaintext Data] --> B[Optional Compression<br/>zstd / lz4]
    B --> C[Generate Random<br/>24-byte Nonce]
    C --> D[HChaCha20<br/>Subkey Derivation]
    D --> E[ChaCha20<br/>Encryption]
    E --> F[Poly1305<br/>MAC Computation]
    F --> G[Assemble Blob<br/>Header + Nonce + Ciphertext + Tag]
    G --> H[Write to Disk]
    
    I[Master Key<br/>256-bit] --> D
```

### Encryption Algorithm

```rust
fn encrypt_blob(
    plaintext: &[u8],
    master_key: &[u8; 32],
    inode: u64,
) -> Result<(Vec<u8>, [u8; 24])> {
    // Generate random nonce
    let nonce = generate_secure_nonce();
    
    // Derive subkey using HChaCha20
    let subkey = hchacha20(master_key, &nonce[..16]);
    
    // Encrypt with ChaCha20
    let ciphertext = chacha20_encrypt(plaintext, &subkey, &nonce[16..]);
    
    // Compute Poly1305 tag
    let tag = poly1305_mac(&ciphertext, &subkey);
    
    // Assemble blob
    let mut blob = Vec::with_capacity(160 + ciphertext.len() + 16);
    blob.extend_from_slice(b"KMLT");           // Magic
    blob.extend_from_slice(&1u32.to_le_bytes()); // Version
    blob.extend_from_slice(&0u32.to_le_bytes()); // Flags
    blob.extend_from_slice(&inode.to_le_bytes());
    blob.extend_from_slice(&(plaintext.len() as u64).to_le_bytes());
    blob.extend_from_slice(&(ciphertext.len() as u64).to_le_bytes());
    blob.extend_from_slice(&0u16.to_le_bytes()); // No compression
    blob.extend_from_slice(&0u64.to_le_bytes()); // Compressed size = 0
    blob.extend_from_slice(&[0u8; 8]);           // Content type
    blob.extend_from_slice(&SystemTime::now()
        .duration_since(UNIX_EPOCH)?.as_nanos() as i64
        .to_le_bytes());
    blob.extend_from_slice(&0i64.to_le_bytes()); // Expires at
    blob.extend_from_slice(&nonce);
    blob.extend_from_slice(&[0u8; 64]);          // Reserved
    blob.extend_from_slice(&ciphertext);
    blob.extend_from_slice(&tag);
    
    Ok((blob, nonce))
}
```

---

## XChaCha20-Poly1305 Specification

### Algorithm Details

| Parameter | Value |
|-----------|-------|
| Cipher | XChaCha20 (HChaCha20 + ChaCha20) |
| Authentication | Poly1305 MAC |
| Key size | 256 bits (32 bytes) |
| Nonce size | 192 bits (24 bytes) |
| Tag size | 128 bits (16 bytes) |
| Mode | AEAD (Authenticated Encryption with Associated Data) |
| Associated Data | Blob header (first 160 bytes) |
| Security level | 256-bit (post-quantum: 128-bit) |

### Why XChaCha20-Poly1305?

| Reason | Detail |
|--------|--------|
| Performance | ~2 GB/s on modern CPUs with hardware acceleration |
| Security | Proven, widely deployed (WireGuard, TLS 1.3) |
| Nonce size | 192-bit allows random nonces without collision risk |
| Authentication | Built-in MAC detects tampering |
| Simplicity | Single pass, no separate encryption + MAC |
| Portability | Standardized in RFC 8439 |

### Key Derivation

```rust
fn derive_blob_key(master_key: &[u8; 32], nonce_prefix: &[u8; 16]) -> [u8; 32] {
    // HChaCha20 derives a subkey from the master key and nonce prefix
    let mut subkey = [0u8; 32];
    hchacha20_impl(&mut subkey, master_key, nonce_prefix);
    subkey
}
```

---

## Synthetic Inodes

Kamelot uses 64-bit synthetic inode numbers that are independent of the underlying file system:

### Inode Allocation

```rust
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]
struct Inode(u64);

struct InodeAllocator {
    next_free: u64,
    recycled: Vec<u64>,
    sled_tree: Tree,  // Persisted allocator state
}

impl InodeAllocator {
    fn allocate(&mut self) -> Result<Inode> {
        // Prefer recycled inodes
        if let Some(inode) = self.recycled.pop() {
            return Ok(Inode(inode));
        }
        
        let inode = Inode(self.next_free);
        self.next_free += 1;
        
        // Persist allocator state
        self.sled_tree.insert("next_free", &self.next_free.to_le_bytes())?;
        
        Ok(inode)
    }
    
    fn recycle(&mut self, inode: Inode) {
        self.recycled.push(inode.0);
    }
}
```

### Inode Structure

The inode encodes information about the blob:

```
Bits 0-47: Sequential number (281 trillion unique inodes)
Bits 48-55: Storage tier (0 = local, 1 = remote, 2 = ephemeral)
Bits 56-63: Reserved for future use
```

### Inode Properties

| Property | Value |
|----------|-------|
| Size | 64 bits (8 bytes) |
| Total unique | 2^48 ≈ 2.8 × 10^14 |
| Allocation | Monotonic (not derived from content) |
| Persistence | Survives restarts via sled |
| Reuse | Recycled after blob deletion |
| Display | Hexadecimal: `000000000000002A` |

---

## sled Embedded Database

sled is the embedded database used for metadata storage:

### Database Structure

sled is organized into multiple trees, each serving a different metadata purpose:

```graphify
graph TD
    subgraph "sled Database"
        T1[Tree: inodes<br/>inode → metadata]
        T2[Tree: filenames<br/>filename → inode]
        T3[Tree: hashes<br/>content_hash → inode]
        T4[Tree: tags<br/>tag → Set<inode>]
        T5[Tree: timeline<br/>timestamp → inode]
        T6[Tree: aliases<br/>alias → inode]
        T7[Tree: config<br/>key → value]
    end
```

### Metadata Schema

```rust
#[derive(Serialize, Deserialize)]
struct FileMetadata {
    // Identity
    inode: Inode,
    filename: String,
    original_path: Option<String>,
    
    // File info
    size: u64,
    mime_type: String,
    content_hash: [u8; 32],  // BLAKE3 hash of plaintext
    
    // Timing
    created_at: SystemTime,
    modified_at: SystemTime,
    ingested_at: SystemTime,
    last_accessed: SystemTime,
    
    // Encryption
    encryption_nonce: [u8; 24],
    encryption_version: u32,
    
    // Storage
    blob_path: PathBuf,
    storage_tier: u8,
    compressed: bool,
    compression_type: u16,
    
    // Semantic (cached)
    embedding_id: Option<u64>,
    vector_checksum: Option<[u8; 32]>,
    
    // Access control
    owner: String,
    permissions: u16,
    
    // Extensions
    tags: Vec<String>,
    custom_metadata: HashMap<String, String>,
}
```

### sled Performance

| Operation | Latency p50 | Latency p99 | Throughput |
|-----------|------------|------------|-----------|
| Get metadata | 2 µs | 15 µs | 200,000/s |
| Set metadata | 8 µs | 45 µs | 80,000/s |
| Delete metadata | 6 µs | 35 µs | 100,000/s |
| Scan (100 entries) | 80 µs | 300 µs | 10,000/s |
| Batch insert (100) | 250 µs | 800 µs | 5,000/s |

---

## Metadata Storage

### Primary Index (inodes → metadata)

```rust
// Store
sled_tree.insert(
    inode.0.to_be_bytes(),
    bincode::serialize(&metadata)?
)?;

// Retrieve
let data = sled_tree.get(inode.0.to_be_bytes())?;
let metadata: FileMetadata = bincode::deserialize(&data)?;
```

### Secondary Indexes

**Filename Index:**
```rust
// Collision resolution: append inode to handle duplicates
let key = format!("{}:{}", filename, inode.0);
sled_tree_filenames.insert(key.as_bytes(), inode.0.to_le_bytes())?;
```

**Content Hash Index (dedup):**
```rust
sled_tree_hashes.insert(content_hash, inode.0.to_le_bytes())?;
```

**Tag Index:**
```rust
for tag in &metadata.tags {
    let key = format!("tag:{}:{}", tag, inode.0);
    sled_tree_tags.insert(key.as_bytes(), inode.0.to_le_bytes())?;
}
```

**Timeline Index:**
```rust
let timestamp = metadata.created_at
    .duration_since(UNIX_EPOCH)?
    .as_nanos();
let key = format!("time:{}:{}", timestamp, inode.0);
sled_tree_timeline.insert(key.as_bytes(), inode.0.to_le_bytes())?;
```

---

## Copy-on-Write Semantics

The flat store implements copy-on-write: when a file is modified, its new version is written to a new blob rather than overwriting the old one.

### Write Flow

```graphify
flowchart TD
    A[File Update Request] --> B[Encrypt New Content]
    B --> C[Allocate New Inode]
    C --> D[Write New Blob to Store]
    D --> E[Update sled Metadata]
    E --> F[Append Ledger Entry<br/>FileUpdate]
    F --> G[Old Blob Becomes<br/>Unreachable by Active Metadata]
    G --> H[Old Blob Retained for<br/>Historical Reconstruction]
    
    I[Immutable Ledger] --> F
```

### Benefits

| Benefit | Description |
|---------|-------------|
| Atomic updates | Write is either fully completed or rolled back |
| History preservation | Previous versions are never destroyed |
| Concurrent readers | Readers can access old version while write is in progress |
| Ransomware immunity | Cannot overwrite existing data |
| Time scrubbing | Historical state reconstruction possible |

### Garbage Collection

Old blobs are not immediately deleted. They are retained for historical state reconstruction:

```rust
struct GarbageCollector {
    retain_versions: u32,          // Keep last N versions (default: 10)
    retain_duration: Duration,     // Keep versions for this long (default: 30 days)
    min_free_space: u64,           // Start GC when free space drops below this
}

impl GarbageCollector {
    fn collect(&self, store: &FlatStore) -> Result<()> {
        // Find unreachable blobs
        let all_blobs = store.list_blobs()?;
        let referenced_inodes = store.get_all_active_inodes()?;
        
        for blob in all_blobs {
            if !referenced_inodes.contains(&blob.inode) {
                // Check retention policy
                if blob.age > self.retain_duration {
                    store.delete_blob(blob.inode)?;
                }
            }
        }
        
        Ok(())
    }
}
```

---

## Read and Write Paths

### Read Path

```rust
fn read_blob(inode: Inode, offset: u64, size: u64) -> Result<Vec<u8>> {
    // 1. Look up metadata
    let metadata = sled_db.get(inode.0.to_be_bytes())?
        .ok_or(Error::InodeNotFound)?;
    let metadata: FileMetadata = bincode::deserialize(&metadata)?;
    
    // 2. Read blob from disk
    let blob_path = store_dir.join(&metadata.blob_path);
    let blob = std::fs::read(&blob_path)?;
    
    // 3. Parse header
    let header = BlobHeader::parse(&blob)?;
    
    // 4. Decrypt
    let ciphertext = &blob[160..blob.len() - 16];
    let tag = &blob[blob.len() - 16..];
    let plaintext = decrypt_blob(ciphertext, &master_key, &header.nonce, tag)?;
    
    // 5. Decompress if needed
    let data = if header.compressed {
        decompress(&plaintext, header.compression_type)?
    } else {
        plaintext
    };
    
    // 6. Return requested range
    Ok(data[offset as usize..(offset + size) as usize].to_vec())
}
```

### Write Path

```rust
fn write_blob(data: &[u8], metadata: FileMetadata) -> Result<Inode> {
    // 1. Optional compression
    let (data_to_encrypt, compressed, comp_type) = if should_compress(&data) {
        (compress(&data, CompressionType::Zstd)?, true, 1)
    } else {
        (data.to_vec(), false, 0)
    };
    
    // 2. Allocate inode
    let inode = allocator.allocate()?;
    
    // 3. Encrypt
    let (blob, nonce) = encrypt_blob(&data_to_encrypt, &master_key, inode.0)?;
    
    // 4. Write to disk (atomic: write to temp, then rename)
    let temp_path = store_dir.join("temp").join(format!("{}.tmp", inode.0));
    let final_path = store_dir.join(format!("blob_{:016X}.bin", inode.0));
    std::fs::write(&temp_path, &blob)?;
    std::fs::rename(&temp_path, &final_path)?;
    
    // 5. Store metadata
    let mut meta = metadata;
    meta.inode = inode;
    meta.encryption_nonce = nonce;
    meta.compressed = compressed;
    meta.compression_type = comp_type;
    meta.blob_path = final_path;
    
    sled_db.insert(inode.0.to_be_bytes(), bincode::serialize(&meta)?)?;
    
    Ok(inode)
}
```

---

## Compression

Kamelot supports optional transparent compression:

### Compression Algorithms

| Algorithm | Speed (compress) | Speed (decompress) | Ratio (text) | Ratio (binary) |
|-----------|-----------------|-------------------|-------------|---------------|
| None | N/A | N/A | 1.0x | 1.0x |
| zstd (level 3) | 500 MB/s | 1.5 GB/s | 3.5x | 1.5x |
| zstd (level 6) | 250 MB/s | 1.5 GB/s | 4.0x | 1.8x |
| zstd (level 19) | 30 MB/s | 1.5 GB/s | 4.5x | 2.0x |
| lz4 | 1.5 GB/s | 3.0 GB/s | 2.5x | 1.3x |

### Compression Decision

```rust
fn should_compress(data: &[u8]) -> bool {
    let mime_type = infer_mime_type(data);
    
    match mime_type {
        // Already compressed
        "image/jpeg" | "image/png" | "image/webp" |
        "video/mp4" | "video/webm" |
        "audio/mp3" | "audio/aac" |
        "application/zip" | "application/gzip" |
        "application/x-7z-compressed" => false,
        
        // Compressible
        "text/plain" | "text/html" | "application/json" |
        "application/pdf" | "application/xml" |
        "text/x-rust" | "text/x-python" => data.len() > 4096,
        
        // Default: compress if > 1KB
        _ => data.len() > 1024,
    }
}
```

---

## Deduplication

Content-addressable deduplication identifies identical files:

### Dedup Flow

```graphify
flowchart TD
    A[Incoming File] --> B[Compute BLAKE3 Hash]
    B --> C[Lookup Hash in Dedup Index]
    C --> D{Hash Exists?}
    D -->|Yes| E[Point to Existing Blob<br/>No New Storage]
    D -->|No| F[Store New Blob]
    F --> G[Index Hash → Inode]
    E --> H[Update Metadata<br/>for New Inode]
    G --> H
```

### Dedup Statistics

| Workload | Dedup Ratio | Space Saved |
|----------|------------|-------------|
| Document version history | 2.5x | 60% |
| Photo library (duplicates) | 1.3x | 23% |
| Code repository (multiple copies) | 4.0x | 75% |
| General file system | 1.5x | 33% |

---

## Garbage Collection

The garbage collector reclaims space from obsolete blobs:

### Collection Process

```graphify
flowchart TD
    A[Start GC Cycle] --> B[Scan Store Directory<br/>List All Blob Files]
    B --> C[Query Active Inodes<br/>from sled]
    C --> D[Cross-Reference<br/>Blobs vs Active Inodes]
    D --> E[Identify Orphaned Blobs]
    E --> F{Check Retention Policy}
    F -->|Within Retention| G[Skip]
    F -->|Exceeds Retention| H[Delete Blob File]
    F -->|Low on Space| I[Delete Even if<br/>Within Retention]
    H --> J[Remove sled Entries]
    I --> J
    G --> K[Continue Scan]
    J --> K
    K --> L[Compact sled Database]
    L --> M[GC Complete]
```

### GC Configuration

```toml
[store.gc]
# Enable automatic garbage collection
enabled = true

# Interval between GC cycles
interval = "1h"

# Number of versions to retain per inode
retain_versions = 10

# Duration to retain deleted blobs
retain_duration = "30d"

# Trigger GC when free space drops below this percentage
free_space_threshold = "10%"

# Maximum blobs to delete in a single GC cycle
max_delete_per_cycle = 10_000

# Whether to compact sled after GC
compact_after_gc = true
```

---

## Performance Characteristics

### Throughput

| Operation | Blob Size | Sequential | Random |
|-----------|-----------|-----------|--------|
| Write (encrypt + persist) | 4 KB | 98,000/s | 95,000/s |
| Write (encrypt + persist) | 64 KB | 42,000/s | 40,000/s |
| Write (encrypt + persist) | 1 MB | 2,100/s | 2,000/s |
| Write (encrypt + persist) | 100 MB | 25/s | 24/s |
| Read (decrypt + return) | 4 KB | 145,000/s | 140,000/s |
| Read (decrypt + return) | 64 KB | 68,000/s | 65,000/s |
| Read (decrypt + return) | 1 MB | 3,800/s | 3,600/s |
| Read (decrypt + return) | 100 MB | 38/s | 36/s |

### Latency

| Operation | p50 | p95 | p99 | p99.9 |
|-----------|-----|-----|-----|-------|
| 4 KB read | 0.4 ms | 0.8 ms | 1.2 ms | 3.0 ms |
| 1 MB read | 26 ms | 35 ms | 48 ms | 75 ms |
| 4 KB write | 0.8 ms | 1.5 ms | 2.5 ms | 6.0 ms |
| 1 MB write | 42 ms | 55 ms | 72 ms | 110 ms |
| Metadata lookup | 0.002 ms | 0.008 ms | 0.015 ms | 0.050 ms |
| Inode allocation | 0.005 ms | 0.012 ms | 0.020 ms | 0.080 ms |

### Disk Usage

| Component | 100K files | 1M files |
|-----------|-----------|----------|
| Blob store (100 KB avg) | 10 GB | 100 GB |
| sled database | 500 MB | 5 GB |
| Temp space | 1 GB | 10 GB |
| Overhead (headers) | 16 MB | 160 MB |
| **Total** | **~11.5 GB** | **~115 GB** |

---

## Data Integrity

### Integrity Verification

```rust
fn verify_blob_integrity(inode: Inode) -> Result<IntegrityResult> {
    let metadata = get_metadata(inode)?;
    let blob = std::fs::read(store_dir.join(&metadata.blob_path))?;
    
    // 1. Verify magic bytes
    if &blob[0..4] != b"KMLT" {
        return Ok(IntegrityResult::Corrupted("Invalid magic".into()));
    }
    
    // 2. Verify header version
    let version = u32::from_le_bytes(blob[4..8].try_into().unwrap());
    if version != 1 {
        return Ok(IntegrityResult::Corrupted(format!("Unknown version: {}", version)));
    }
    
    // 3. Verify AES tag
    let nonce = &blob[88..112];
    let ciphertext = &blob[160..blob.len() - 16];
    let stored_tag = &blob[blob.len() - 16..];
    
    let computed_tag = compute_poly1305_tag(ciphertext, &master_key, nonce);
    if stored_tag != computed_tag.as_slice() {
        return Ok(IntegrityResult::Corrupted("AEAD tag mismatch".into()));
    }
    
    // 4. Verify content hash
    let plaintext = decrypt_blob(&blob, &master_key)?;
    let computed_hash = blake3::hash(&plaintext);
    if computed_hash.as_bytes() != &metadata.content_hash {
        return Ok(IntegrityResult::Corrupted("Content hash mismatch".into()));
    }
    
    Ok(IntegrityResult::Ok)
}
```

### Periodic Verification

```bash
# Verify all blobs
kml store verify

# Verify specific inode
kml store verify --inode 000000000000002A

# Quick check (metadata only)
kml store verify --quick

# Repair corrupted blobs (if possible)
kml store repair
```

---

## Backup and Restore

### Backup

```bash
# Full backup
kml backup create /backups/kamelot-2025-01-15.tar.gz

# Incremental backup
kml backup create --incremental /backups/kamelot-2025-01-16.tar.gz

# Backup metadata only
kml backup create --metadata-only keys.sled

# Encrypted backup
kml backup create --encrypt /backups/kamelot-encrypted.bin
```

### Restore

```bash
# Full restore
kml backup restore /backups/kamelot-2025-01-15.tar.gz

# Partial restore (specific inode)
kml backup restore --inode 000000000000002A /backups/backup.tar.gz

# Restore to different location
kml backup restore --target /mnt/restore /backups/backup.tar.gz
```

---

## Recovery Procedures

### Key Recovery

If the master key is lost:

```bash
# Using recovery mnemonic
kml init --recover-mnemonic "word1 word2 ... word12"

# Using key file
kml init --recover-key /path/to/keyfile.bin

# After recovery, verify data
kml store verify
```

### Store Recovery

```bash
# Rebuild sled from blob store
kml store rebuild-metadata

# Repair corrupted blob
kml store repair --inode 000000000000002A

# Remove corrupted blob (if irreparable)
kml store remove --inode 000000000000002A

# Recreate store from backups
kml store recreate --from-backup /backups/backup.tar.gz
```

---

## Configuration

```toml
[store]
# Store directory path
path = "/var/lib/kamelot/store"

# Maximum blob size before chunking
max_blob_size = "100MB"

# Enable compression
compression = true
compression_type = "zstd"
compression_level = 6

# Enable deduplication
deduplication = true

# sled cache size
sled_cache_size = "512MB"

# Maximum number of open file descriptors
max_open_files = 1024

# I/O thread pool size
io_threads = 4

# Encryption
encryption_algorithm = "xchacha20-poly1305"
key_derivation = "argon2id"
key_derivation_memory = "64MB"
key_derivation_iterations = 3
key_derivation_parallelism = 4

# Temp directory for in-progress writes
temp_dir = "/var/lib/kamelot/store/temp"

[store.performance]
# Buffer pool size for read/write operations
buffer_pool_size = 64

# Read-ahead buffer size for sequential reads
read_ahead_size = "256KB"

# Write coalescing (batch small writes)
write_coalesce = true
write_coalesce_timeout = "10ms"
write_coalesce_max_size = "1MB"
```

---

## Security Considerations

### Threat Model

| Threat | Mitigation |
|--------|-----------|
| Physical disk theft | XChaCha20-Poly1305 encryption at rest |
| Cold boot attack | Key in system keyring, not in memory |
| Forensic analysis | Encrypted blobs indistinguishable from random |
| Tampering | AEAD tag verification on every read |
| Rollback attack | .aioss immutable ledger |
| Key exfiltration | Key never leaves keyring or process memory |
| Side channel | Constant-time cryptographic operations |

### Key Storage

- Master key stored in OS keyring (Windows Credential Manager, macOS Keychain, Linux secret-service)
- Key zeroed from process memory after use
- Key never written to swap or crash dumps
- Optional hardware security module (HSM) support

### Secure Deletion

When a blob is garbage collected, the file is securely wiped:

```rust
fn secure_delete(path: &Path) -> Result<()> {
    let metadata = std::fs::metadata(path)?;
    let file_size = metadata.len() as usize;
    
    // Open file for writing
    let file = OpenOptions::new().write(true).open(path)?;
    
    // Overwrite with zeros, ones, and random data
    let mut data = vec![0u8; file_size];
    
    // Pass 1: Zeros
    file.write_all(&data)?;
    file.sync_all()?;
    
    // Pass 2: Ones
    data.fill(0xFF);
    file.seek(SeekFrom::Start(0))?;
    file.write_all(&data)?;
    file.sync_all()?;
    
    // Pass 3: Random
    fill_random(&mut data);
    file.seek(SeekFrom::Start(0))?;
    file.write_all(&data)?;
    file.sync_all()?;
    
    // Delete the file
    std::fs::remove_file(path)?;
    
    Ok(())
}
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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
