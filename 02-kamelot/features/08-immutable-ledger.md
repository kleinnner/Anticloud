                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                

# Immutable Ledger

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

- [Introduction](#introduction)
- [What Is the .aioss Ledger?](#what-is-the-aioss-ledger)
- [Ledger Architecture](#ledger-architecture)
- [Append-Only Property](#append-only-property)
- [Entry Types](#entry-types)
- [Merkle Tree Structure](#merkle-tree-structure)
- [Cryptographic Primitives](#cryptographic-primitives)
- [Ransomware Immunity](#ransomware-immunity)
- [The rollback Command](#the-rollback-command)
- [State Reconstruction](#state-reconstruction)
- [Integrity Verification](#integrity-verification)
- [Performance Characteristics](#performance-characteristics)
- [Ledger Operations](#ledger-operations)
- [Configuration](#configuration)
- [Security Considerations](#security-considerations)
- [Comparison with Other Approaches](#comparison-with-other-approaches)
- [Implementation Details](#implementation-details)

---

## Introduction

The immutable ledger is the foundation of Kamelot's data integrity and temporal capabilities. It is an append-only, cryptographically-chained log of every operation performed on the file system. Named `.aioss` (Append-Only Immutable Object Storage Segment), the ledger provides natural ransomware immunity, enables time-travel to any previous state, and guarantees the integrity of all stored data.

This document details the ledger's architecture, the Merkle tree structure that chains entries together, the cryptographic primitives used, and the operational commands for verification and recovery.

---

## What Is the .aioss Ledger?

The `.aioss` ledger is a sequence of entries, each cryptographically linked to its predecessor:

```graphify
flowchart LR
    G[Genesis Entry<br/>Hash: H0] --> E1[Entry 1<br/>Prev: H0<br/>Hash: H1]
    E1 --> E2[Entry 2<br/>Prev: H1<br/>Hash: H2]
    E2 --> E3[Entry 3<br/>Prev: H2<br/>Hash: H3]
    E3 --> EN[...]
    EN --> EC[Current Entry<br/>Prev: H{N-1}<br/>Hash: H{N}]
```

Each entry contains:
- A reference to the previous entry's hash (forming a chain)
- A timestamp
- An operation type and payload
- A Merkle root of the file system state after the operation
- The entry's own hash (BLAKE3)

---

## Ledger Architecture

```graphify
graph TD
    subgraph "Application Layer"
        VFS[VFS Daemon]
        ING[Ingestion Pipeline]
        UI[Canvas UI]
    end
    
    subgraph "Ledger Subsystem"
        WR[Ledger Writer]
        RD[Ledger Reader]
        VR[Ledger Verifier]
        RC[State Reconstructor]
    end
    
    subgraph "Storage"
        LF[.aioss File<br/>Append-Only Log]
        LS[sled Index<br/>Entry Number → Offset]
        CS[State Cache<br/>Recent States]
    end
    
    subgraph "Verification"
        HV[Hash Verifier]
        MV[Merkle Verifier]
        TV[Timestamp Verifier]
    end
    
    VFS --> WR
    VFS --> RD
    ING --> WR
    UI --> RD
    UI --> RC
    
    WR --> LF
    WR --> LS
    RD --> LF
    RD --> LS
    RC --> LF
    RC --> LS
    RC --> CS
    
    VR --> HV
    VR --> MV
    VR --> TV
    HV --> LF
    MV --> LF
```

---

## Append-Only Property

The most critical property of the ledger is that it is **append-only**. Once an entry is written, it can never be deleted, modified, or reordered.

### Enforcement

```rust
struct LedgerFile {
    file: std::fs::File,
    path: PathBuf,
    current_offset: u64,
    last_hash: [u8; 32],
}

impl LedgerFile {
    fn append(&mut self, entry: &[u8]) -> Result<u64> {
        // 1. Verify file is opened in append-only mode
        assert!(self.file.is_append_only());
        
        // 2. Write entry atomically
        let offset = self.current_offset;
        self.file.write_all(entry)?;
        self.file.sync_all()?;
        
        // 3. Update offset
        self.current_offset += entry.len() as u64;
        
        Ok(offset)
    }
    
    fn verify_append_only(&self) -> Result<()> {
        // Verify no entries before the last written position have changed
        let metadata = self.file.metadata()?;
        
        // File size should be monotonically increasing
        let file_size = metadata.len();
        assert!(file_size >= self.current_offset);
        
        // Check that file was not truncated
        if file_size < self.current_offset {
            return Err(Error::LedgerTampered("File truncated".into()));
        }
        
        Ok(())
    }
}
```

### File System Level Protection

| Protection | Mechanism |
|-----------|-----------|
| Append-only mode | `O_APPEND` flag on POSIX, `FILE_APPEND_DATA` on Windows |
| Immutable attribute | `chattr +a` on Linux (optional) |
| Write-once media | Compatible with WORM drives |
| Read-only after close | Ledger file made read-only after rotation |
| Signature verification | Every entry is self-verifying |

---

## Entry Types

The ledger records several types of operations:

### Entry Format

```
┌─────────────────────────────────────────────────────┐
│ Magic: 0x41494F53 ("AIOS")                         │ 4 bytes
├─────────────────────────────────────────────────────┤
│ Version: u16 LE                                     │ 2 bytes
├─────────────────────────────────────────────────────┤
│ Entry Type: u16 LE                                  │ 2 bytes
├─────────────────────────────────────────────────────┤
│ Timestamp: i64 LE (Unix nanoseconds)               │ 8 bytes
├─────────────────────────────────────────────────────┤
│ Entry Number: u64 LE                                │ 8 bytes
├─────────────────────────────────────────────────────┤
│ Previous Hash: [u8; 32] (BLAKE3)                   │ 32 bytes
├─────────────────────────────────────────────────────┤
│ Merkle Root: [u8; 32] (BLAKE3)                     │ 32 bytes
├─────────────────────────────────────────────────────┤
│ Payload Length: u64 LE                              │ 8 bytes
├─────────────────────────────────────────────────────┤
│ Payload (variable length)                            │ Variable
├─────────────────────────────────────────────────────┤
│ Entry Hash: [u8; 32] (BLAKE3 of everything above)  │ 32 bytes
└─────────────────────────────────────────────────────┘
```

**Total overhead per entry: 134 bytes + payload**

### Entry Types

| Type | Code | Payload | Description |
|------|------|---------|-------------|
| Genesis | 0x0001 | None | First entry in the ledger |
| FileCreate | 0x0002 | Inode, metadata, content hash | New file created |
| FileUpdate | 0x0003 | Inode, new metadata, new content hash | File modified |
| FileDelete | 0x0004 | Inode | File deleted (logical) |
| MetadataChange | 0x0005 | Inode, changed fields | Tags, permissions changed |
| Rename | 0x0006 | Inode, old path, new path | File renamed |
| TagAdd | 0x0007 | Inode, tag string | Tag added |
| TagRemove | 0x0008 | Inode, tag string | Tag removed |
| WorkspaceCreate | 0x0009 | Workspace metadata | Synthetic workspace created |
| WorkspaceDissolve | 0x000A | Workspace ID | Workspace dissolved |
| SnapCheckpoint | 0x000B | Full state snapshot reference | Periodic state checkpoint |
| ConfigChange | 0x000C | Changed config keys | Configuration modification |
| UserNote | 0x000D | Arbitrary text | User annotation (git-like message) |

---

## Merkle Tree Structure

Each entry in the ledger contains a Merkle root that represents the complete state of the file system at that point in time.

### Merkle Tree Construction

```graphify
graph TD
    subgraph "Merkle Tree"
        ROOT[Root Hash<br/>H(ABC | DEF)]
        N1[Internal Node A<br/>H(F1 | F2 | F3)]
        N2[Internal Node B<br/>H(F4 | F5)]
        N3[Internal Node C<br/>H(F6 | F7 | F8 | F9)]
        F1[Leaf: inode 1<br/>H(blake3 of metadata)]
        F2[Leaf: inode 2<br/>H(blake3 of metadata)]
        F3[Leaf: inode 3<br/>H(blake3 of metadata)]
        F4[Leaf: inode 4<br/>H(blake3 of metadata)]
        F5[Leaf: inode 5<br/>H(blake3 of metadata)]
        F6[Leaf: inode 6<br/>H(blake3 of metadata)]
        F7[Leaf: inode 7<br/>H(blake3 of metadata)]
        F8[Leaf: inode 8<br/>H(blake3 of metadata)]
        F9[Leaf: inode 9<br/>H(blake3 of metadata)]
        
        ROOT --> N1
        ROOT --> N2
        ROOT --> N3
        N1 --> F1
        N1 --> F2
        N1 --> F3
        N2 --> F4
        N2 --> F5
        N3 --> F6
        N3 --> F7
        N3 --> F8
        N3 --> F9
    end
```

### Efficient Updates

The Merkle tree is implemented as a persistent data structure that allows efficient updates:

```rust
struct MerkleTree {
    /// Number of leaves (active inodes)
    leaf_count: u64,
    
    /// Root hash
    root: [u8; 32],
    
    /// Internal nodes organized by level
    levels: Vec<Vec<[u8; 32]>>,
}

impl MerkleTree {
    fn update_leaf(&mut self, inode: Inode, new_hash: [u8; 32]) {
        let leaf_index = inode.merkle_index();
        
        // Update leaf
        self.levels[0][leaf_index] = new_hash;
        
        // Recompute ancestors
        let mut current_index = leaf_index;
        for level in 1..self.levels.len() {
            let sibling = current_index ^ 1;
            let parent_index = current_index / 2;
            
            let combined = if current_index % 2 == 0 {
                // Current is left child
                combine_hashes(&self.levels[level - 1][current_index],
                               &self.levels[level - 1][sibling])
            } else {
                // Current is right child
                combine_hashes(&self.levels[level - 1][sibling],
                               &self.levels[level - 1][current_index])
            };
            
            self.levels[level][parent_index] = combined;
            current_index = parent_index;
        }
        
        // Update root
        self.root = self.levels.last().unwrap()[0];
    }
}
```

---

## Cryptographic Primitives

### Hash Function: BLAKE3

| Property | Value |
|----------|-------|
| Algorithm | BLAKE3 |
| Output size | 256 bits (32 bytes) |
| Speed | ~3 GB/s on modern CPUs |
| Security | 128-bit post-quantum security |
| Parallelism | SIMD-accelerated |

### Key Derivation: BLAKE3 Keyed Hash

Keys for ledger signing are derived using BLAKE3 in keyed mode:

```rust
fn ledger_signing_key(master_key: &[u8; 32], context: &[u8]) -> [u8; 32] {
    let mut hasher = blake3::Hasher::new_keyed(master_key);
    hasher.update(context);
    let result = hasher.finalize();
    *result.as_bytes()
}
```

### Entry Hashing

```rust
fn compute_entry_hash(entry: &LedgerEntry) -> [u8; 32] {
    let mut hasher = blake3::Hasher::new();
    
    // Hash all fields except the entry hash itself
    hasher.update(&entry.magic.to_be_bytes());
    hasher.update(&entry.version.to_le_bytes());
    hasher.update(&entry.entry_type.to_le_bytes());
    hasher.update(&entry.timestamp.to_le_bytes());
    hasher.update(&entry.entry_number.to_le_bytes());
    hasher.update(&entry.previous_hash);
    hasher.update(&entry.merkle_root);
    hasher.update(&entry.payload_length.to_le_bytes());
    hasher.update(&entry.payload);
    
    let result = hasher.finalize();
    *result.as_bytes()
}
```

---

## Ransomware Immunity

The ledger provides natural immunity to ransomware through several mechanisms:

### How Ransomware Is Defeated

```graphify
sequenceDiagram
    participant R as Ransomware
    participant FS as File System
    participant L as Ledger
    participant S as Flat Store
    
    Note over R,S: Ransomware attempts to encrypt files
    R->>FS: Open file for write
    FS->>FS: Copy-on-write: new blob created
    FS->>S: Write encrypted garbage
    FS->>L: Append FileUpdate entry
    Note over L: New entry chained to ledger
    L-->>FS: Append successful
    
    Note over R,S: Original blob still exists in store
    Note over R,S: Previous ledger entry still valid
    Note over R,S: User can rollback to pre-attack state
    
    User->>L: kml rollback --minutes 5
    L->>L: Find entry before attack
    L->>FS: Reconstruct state from Merkle tree
    FS->>S: Point to old (good) blob
    FS-->>User: Files restored
```

### Protection Layers

| Layer | Protection | Bypass Difficulty |
|-------|-----------|------------------|
| Append-only | Cannot delete entries | Requires kernel exploit |
| Copy-on-write | Original data preserved | Requires store deletion |
| Merkle proof | Tampering detected immediately | Requires hash collision |
| Chain integrity | Missing entries detected | Requires full chain recomputation |
| Ledger signing | Entries authenticated | Requires key compromise |

### Attack Resilience

| Attack | Outcome |
|--------|---------|
| Encrypt blob files | Detected by hash verification, restored from COW copies |
| Delete ledger file | Detected on next startup, restored from backup |
| Modify ledger entry | Merkle chain verification fails, tampering detected |
| Fork ledger | Hash mismatch at fork point, both branches detectable |
| Deleted entire data directory | Requires backup restore, but ledger backup is separate |

---

## The rollback Command

The `kml rollback` command is the primary mechanism for time travel and recovery:

### Command Usage

```bash
# Roll back by time
kml rollback --minutes 5
kml rollback --hours 2
kml rollback --days 1

# Roll back to specific timestamp
kml rollback --to "2025-01-15T14:30:00Z"

# Roll back to specific ledger entry
kml rollback --ledger-entry 4096

# Roll back to before a specific file was modified
kml rollback --before-file tax_report.pdf

# Dry run (show what would happen)
kml rollback --minutes 5 --dry-run

# Force rollback (accept data loss)
kml rollback --minutes 5 --force
```

### Rollback Process

```graphify
sequenceDiagram
    participant User as User
    participant Cmd as kml CLI
    participant L as Ledger
    participant FS as File System
    participant S as Flat Store
    
    User->>Cmd: kml rollback --minutes 5
    Cmd->>L: Find entry at (now - 5 min)
    L-->>Cmd: Entry #12450 at 14:25:00
    
    Cmd->>L: Get Merkle root at entry #12450
    L-->>Cmd: MerkleRoot: abcdef...
    
    Cmd->>FS: Reconstruct state from Merkle root
    FS->>L: Read entries up to #12450
    FS->>S: Map inodes to blobs (pre-change)
    FS-->>Cmd: State reconstructed
    
    Cmd->>FS: Create snapshot of current state
    Cmd->>FS: Apply rollback (switch to old state)
    FS-->>Cmd: Rollback complete
    
    Cmd->>L: Append Rollback entry
    Note over Cmd,FS: Current state: pre-rollback state snapshot
    Note over Cmd,FS: Active state: rolled back state
    
    Cmd-->>User: Rolled back to 2025-01-15 14:25:00
```

### Rollback Implementation

```rust
async fn rollback_to_entry(target_entry: u64, force: bool) -> Result<()> {
    // 1. Read target entry
    let entry = ledger.read_entry(target_entry)?;
    
    // 2. Verify integrity of all entries up to target
    ledger.verify_chain(target_entry)?;
    
    // 3. Get the Merkle root from the target entry
    let target_merkle_root = entry.merkle_root;
    
    // 4. Build the state at the target entry
    let target_state = ledger.reconstruct_state(target_entry)?;
    
    // 5. Verify the reconstructed state matches the Merkle root
    let computed_root = target_state.compute_merkle_root();
    ensure!(
        computed_root == target_merkle_root,
        "State mismatch: data may be corrupted"
    );
    
    // 6. Snapshot current state for undo capability
    let current_snapshot = ledger.create_snapshot()?;
    
    // 7. Apply the rollback
    store.apply_state(&target_state)?;
    sled_db.apply_state(&target_state)?;
    
    // 8. Record the rollback in the ledger
    ledger.append_rollback_entry(RollbackEntry {
        rolled_back_to: target_entry,
        previous_state_snapshot: current_snapshot,
        reason: "User requested via kml rollback".into(),
    })?;
    
    Ok(())
}
```

---

## State Reconstruction

The ledger can reconstruct the complete file system state at any point in time:

### Reconstruction Process

```rust
fn reconstruct_state(timestamp: SystemTime) -> Result<FileSystemState> {
    let mut state = FileSystemState::empty();
    
    // 1. Find the ledger position at the timestamp
    let position = ledger.find_position_at(timestamp)?
        .ok_or(Error::NoEntriesAtTimestamp)?;
    
    // 2. Read all entries from genesis to position
    let entries = ledger.read_entries(0, position)?;
    
    // 3. Replay entries to build state
    for entry in entries {
        match entry.entry_type {
            EntryType::FileCreate => {
                let payload: FileCreatePayload = entry.decode_payload()?;
                state.add_file(payload.inode, payload.metadata);
            }
            EntryType::FileUpdate => {
                let payload: FileUpdatePayload = entry.decode_payload()?;
                state.update_file(payload.inode, payload.metadata);
            }
            EntryType::FileDelete => {
                let payload: FileDeletePayload = entry.decode_payload()?;
                state.remove_file(payload.inode);
            }
            EntryType::MetadataChange => {
                let payload: MetadataChangePayload = entry.decode_payload()?;
                state.update_metadata(payload.inode, payload.changes);
            }
            // ... handle other entry types
            _ => {}
        }
    }
    
    // 4. Verify reconstructed state against Merkle root
    let expected_root = entries.last().unwrap().merkle_root;
    let actual_root = state.compute_merkle_root();
    
    ensure!(
        actual_root == expected_root,
        "State reconstruction verification failed"
    );
    
    Ok(state)
}
```

### State Cache

To avoid replaying the entire ledger for frequent reconstructions (e.g., during time scrubbing), Kamelot maintains a state cache:

```rust
struct StateCache {
    /// Checkpoints at regular intervals
    checkpoints: BTreeMap<u64, FileSystemState>,
    
    /// Most recent state (fast access)
    current_state: FileSystemState,
    
    /// Checkpoint interval (number of entries)
    checkpoint_interval: u64,
}

impl StateCache {
    fn reconstruct_state(&mut self, entry_number: u64) -> Result<&FileSystemState> {
        // Find nearest checkpoint before target
        let checkpoint = self.checkpoints
            .range(..=entry_number)
            .last();
        
        if let Some((checkpoint_entry, state)) = checkpoint {
            // Replay from checkpoint to target
            let entries = ledger.read_entries(*checkpoint_entry + 1, entry_number)?;
            let mut state = state.clone();
            for entry in entries {
                state.apply_entry(&entry);
            }
            self.checkpoints.insert(entry_number, state.clone());
            Ok(self.checkpoints.get(&entry_number).unwrap())
        } else {
            // No checkpoint found, full replay needed
            let state = reconstruct_state(entry_number)?;
            self.checkpoints.insert(entry_number, state);
            Ok(self.checkpoints.get(&entry_number).unwrap())
        }
    }
}
```

---

## Integrity Verification

### Full Verification

```bash
# Verify entire ledger chain
kml ledger --verify

# Quick verification (check last N entries)
kml ledger --verify --quick 100

# Deep verification with Merkle tree
kml ledger --verify --deep

# Verify and repair if possible
kml ledger --verify --repair
```

### Verification Algorithm

```rust
fn verify_chain(up_to_entry: u64) -> Result<VerificationResult> {
    let mut previous_hash = [0u8; 32]; // Genesis has no previous
    let mut verified_count = 0u64;
    let mut errors = Vec::new();
    
    let entries = ledger.read_entries(0, up_to_entry)?;
    
    for entry in entries {
        // 1. Verify previous hash
        if entry.entry_number > 0 && entry.previous_hash != previous_hash {
            errors.push(VerificationError::ChainBroken(entry.entry_number));
        }
        
        // 2. Verify entry hash
        let computed_hash = compute_entry_hash(&entry);
        if computed_hash != entry.entry_hash {
            errors.push(VerificationError::HashMismatch(entry.entry_number));
        }
        
        // 3. Verify entry number is sequential
        if entry.entry_number != verified_count {
            errors.push(VerificationError::SequenceGap(
                verified_count, entry.entry_number
            ));
        }
        
        previous_hash = entry.entry_hash;
        verified_count += 1;
    }
    
    Ok(VerificationResult {
        total_entries: verified_count,
        verified_entries: verified_count - errors.len() as u64,
        errors,
        passed: errors.is_empty(),
    })
}
```

### Verification Metrics

| Number of Entries | Quick Verify | Deep Verify |
|------------------|-------------|-------------|
| 1,000 | 0.5 ms | 15 ms |
| 10,000 | 4 ms | 120 ms |
| 100,000 | 35 ms | 1.1 s |
| 1,000,000 | 350 ms | 12 s |
| 10,000,000 | 3.5 s | 2 min |

---

## Performance Characteristics

### Write Throughput

| Entry Size | Throughput | Latency p50 | Latency p99 |
|-----------|-----------|------------|------------|
| 256 B | 420,000/s | 0.01 ms | 0.05 ms |
| 1 KB | 310,000/s | 0.02 ms | 0.08 ms |
| 10 KB | 120,000/s | 0.05 ms | 0.20 ms |
| 100 KB | 25,000/s | 0.30 ms | 1.5 ms |

### Ledger File Growth

| Operations | Entry Size | Total Size |
|-----------|-----------|-----------|
| 10,000 | 256 B avg | 3.5 MB |
| 100,000 | 256 B avg | 35 MB |
| 1,000,000 | 256 B avg | 350 MB |
| 10,000,000 | 256 B avg | 3.5 GB |

### Rotation

To prevent unbounded growth, the ledger supports rotation:

```toml
[ledger.rotation]
# Maximum ledger file size before rotation
max_file_size = "10GB"

# Enable compression for old segments
compress_old_segments = true

# Retention policy for old segments
retain_segments = 10

# Auto-rotate on startup
auto_rotate = true
```

---

## Ledger Operations

### Reading the Ledger

```bash
# Show recent entries
kml ledger --tail 50

# Show entries in range
kml ledger --from 1000 --to 1050

# Show entries for a specific file
kml ledger --inode 000000000000002A

# Show entries in a time range
kml ledger --since "2025-01-01" --until "2025-01-15"

# Show summary statistics
kml ledger --stats
```

### Export

```bash
# Export as JSON
kml ledger --export ledger.json

# Export as CSV
kml ledger --export ledger.csv

# Export as binary (for forensics)
kml ledger --export ledger.raw
```

### Management

```bash
# Compact the ledger (remove redundant entries)
kml ledger compact

# Rotate the ledger
kml ledger rotate

# Create a manual checkpoint
kml ledger checkpoint

# Verify integrity
kml ledger verify
```

### Ledger Explorer

The canvas UI includes a ledger explorer for visual browsing:

```graphify
graph LR
    subgraph "Ledger Explorer"
        TL[Timeline View<br/>Scrollable entry list]
        DT[Detail View<br/>Entry contents]
        GR[Graph View<br/>Merkle tree visualization]
        ST[State View<br/>File system state at entry]
    end
```

---

## Configuration

```toml
[ledger]
# Ledger file path
ledger_path = "/var/lib/kamelot/ledger/ledger.aioss"

# Enable the ledger (disabling is not recommended)
enabled = true

# Entry types to record (all by default)
record_types = [
    "FileCreate", "FileUpdate", "FileDelete",
    "MetadataChange", "Rename",
    "TagAdd", "TagRemove",
    "WorkspaceCreate", "WorkspaceDissolve",
    "ConfigChange",
]

# Maximum entry payload size
max_payload_size = "1MB"

# Flush interval (ms) - how often to sync to disk
flush_interval = 5

# Whether to fsync on every write
fsync_on_write = true

# Cache recent states for fast time scrubbing
state_cache_size = 100
state_cache_interval = 1000

[ledger.rotation]
# Maximum file size before rotation
max_file_size = "10GB"

# Compress old segments
compress_old_segments = true
compression = "zstd"
compression_level = 3

# Number of old segments to retain
retain_segments = 10

[ledger.verification]
# Auto-verify on startup
auto_verify = true

# Verify on every read (slower but safer)
verify_on_read = false

# Verification batch size
batch_size = 10000
```

---

## Security Considerations

### Threat Model

| Threat | Mitigation |
|--------|-----------|
| Disk-level tampering | BLAKE3 hash chain, AEAD encryption of blob store |
| Root-level tampering | File permissions, immutable attributes |
| Physical theft | Encrypted blobs, ledger integrity check |
| Evil maid attack | Boot integrity, key not on disk |
| Supply chain | Reproducible builds, signed releases |

### Best Practices

1. **Store the ledger on a separate physical drive** to prevent simultaneous destruction with the blob store
2. **Enable fsync** to ensure entries are committed before the operation is reported as complete
3. **Create regular checkpoints** to bound state reconstruction time
4. **Export the ledger hash periodically** and store it in a separate secure location
5. **Test rollback procedures** on a schedule to ensure recovery works

---

## Comparison with Other Approaches

| Feature | Kamelot .aioss | Git | Blockchain | Journaling FS |
|---------|---------------|-----|-----------|---------------|
| Append-only | Yes | Amendable | Yes | Circular |
| Time travel | Yes | Yes (via commits) | Yes | No |
| Ransomware immune | Yes | Partial | Yes | No |
| Merkle tree | Yes | Yes | Yes | No |
| Storage overhead | Low (134B/entry) | Full copies | High | Medium |
| Performance | 420K writes/s | Medium | Low (consensus) | High |
| Decentralized | No | No | Yes | No |
| Integrity proof | Yes | Yes | Yes | No |
| Undo capability | Yes | Yes (revert) | No | No |

---

## Implementation Details

### Ledger Writer

```rust
pub struct LedgerWriter {
    file: Mutex<LedgerFile>,
    config: LedgerConfig,
    entry_counter: AtomicU64,
    merkle_tree: RwLock<MerkleTree>,
    state_cache: RwLock<StateCache>,
}

impl LedgerWriter {
    pub fn append(&self, entry: LedgerEntry) -> Result<EntryNumber> {
        let entry_number = self.entry_counter.fetch_add(1, Ordering::SeqCst);
        
        let mut entry = entry;
        entry.entry_number = entry_number;
        
        // Set previous hash
        let mut file = self.file.lock();
        entry.previous_hash = file.last_hash;
        
        // Update Merkle tree
        let mut merkle = self.merkle_tree.write();
        merkle.apply_entry(&entry);
        entry.merkle_root = merkle.root;
        
        // Compute entry hash
        entry.entry_hash = compute_entry_hash(&entry);
        
        // Serialize and write
        let bytes = entry.serialize()?;
        file.append(&bytes)?;
        
        // Update last hash
        file.last_hash = entry.entry_hash;
        
        Ok(entry_number)
    }
    
    pub fn create_checkpoint(&self) -> Result<()> {
        let state = self.reconstruct_state(self.entry_counter.load(Ordering::Acquire))?;
        
        let checkpoint = LedgerEntry::checkpoint(
            state.compute_merkle_root(),
            &state.serialize()?,
        );
        
        self.append(checkpoint)
    }
}
```

### Ledger Reader

```rust
pub struct LedgerReader {
    file: Mutex<LedgerFile>,
    index: Arc<sled::Tree>, // Entry number → file offset
}

impl LedgerReader {
    pub fn read_entry(&self, entry_number: u64) -> Result<LedgerEntry> {
        let offset = self.index.get(&entry_number.to_be_bytes())?
            .ok_or(Error::EntryNotFound)?;
        let offset = u64::from_be_bytes(offset.as_ref().try_into().unwrap());
        
        let file = self.file.lock();
        file.seek(SeekFrom::Start(offset))?;
        
        let entry = LedgerEntry::deserialize(&file)?;
        
        if self.config.verify_on_read {
            self.verify_entry(&entry)?;
        }
        
        Ok(entry)
    }
    
    pub fn read_entries(&self, from: u64, to: u64) -> Result<Vec<LedgerEntry>> {
        let mut entries = Vec::with_capacity((to - from + 1) as usize);
        for i in from..=to {
            entries.push(self.read_entry(i)?);
        }
        Ok(entries)
    }
}
```

### Ledger Entry Serialization

```rust
#[derive(Clone, Debug)]
pub struct LedgerEntry {
    pub magic: [u8; 4],         // "AIOS"
    pub version: u16,
    pub entry_type: EntryType,
    pub timestamp: i64,          // Unix nanoseconds
    pub entry_number: u64,
    pub previous_hash: [u8; 32],
    pub merkle_root: [u8; 32],
    pub payload_length: u64,
    pub payload: Vec<u8>,
    pub entry_hash: [u8; 32],
}

impl LedgerEntry {
    pub fn serialize(&self) -> Result<Vec<u8>> {
        let mut buf = Vec::with_capacity(134 + self.payload.len());
        buf.extend_from_slice(&self.magic);
        buf.extend_from_slice(&self.version.to_le_bytes());
        buf.extend_from_slice(&(self.entry_type as u16).to_le_bytes());
        buf.extend_from_slice(&self.timestamp.to_le_bytes());
        buf.extend_from_slice(&self.entry_number.to_le_bytes());
        buf.extend_from_slice(&self.previous_hash);
        buf.extend_from_slice(&self.merkle_root);
        buf.extend_from_slice(&self.payload_length.to_le_bytes());
        buf.extend_from_slice(&self.payload);
        buf.extend_from_slice(&self.entry_hash);
        Ok(buf)
    }
    
    pub fn deserialize<R: Read>(reader: &mut R) -> Result<Self> {
        let mut magic = [0u8; 4];
        reader.read_exact(&mut magic)?;
        ensure!(&magic == b"AIOS", "Invalid magic bytes");
        
        let mut version_buf = [0u8; 2];
        reader.read_exact(&mut version_buf)?;
        let version = u16::from_le_bytes(version_buf);
        ensure!(version == 1, "Unsupported version");
        
        // ... read remaining fields ...
        
        Ok(LedgerEntry {
            magic,
            version,
            // ... populate all fields ...
        })
    }
}
```
