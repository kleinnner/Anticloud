                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 

# 04 — .aioss Ledger Integrity

**Kamelot — The Sovereign Semantic Vector File System**

**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. Introduction
2. What Is the .aioss Ledger?
3. Append-Only Structure
4. Hash-Chained Entries
5. Merkle Tree Verification
6. Root Hash Storage
7. Verification with `kml verify`
8. Tamper Detection
9. Integration with Immutable Backups
10. Audit Use Cases
11. Implementation Details
12. Conclusion

---

## 1. Introduction

The .aioss (Authentic Integrity and Origin Storage System) ledger is Kamelot's cryptographic integrity layer. It provides an immutable, verifiable record of every file operation performed on the Kamelot store.

The ledger ensures that:
- Every file modification is permanently recorded
- Tampering with files or metadata is detectable
- The complete history of each file is auditable
- The store's integrity can be verified independently

This document describes the architecture, implementation, and use cases of the .aioss ledger.

---

## 2. What Is the .aioss Ledger?

### 2.1 Overview

The .aioss ledger is a directory within the Kamelot store that contains sequentially numbered, append-only entries. Each entry records a file operation:

```
.aioss/
├── 00000000000000000001.entry
├── 00000000000000000002.entry
├── 00000000000000000003.entry
├── ...
└── 00000000000000099999.entry
```

### 2.2 Entry Structure

Each entry contains:

| Field | Size | Description |
|-------|------|-------------|
| Entry number | 8 bytes | Monotonically increasing, 64-bit integer |
| Timestamp | 8 bytes | Unix timestamp (nanoseconds) |
| Operation type | 1 byte | CREATE, MODIFY, DELETE, RENAME, VERIFY |
| Content hash | 32 bytes | SHA-256 hash of file content |
| Previous entry hash | 32 bytes | SHA-256 hash of the previous entry |
| Encrypted metadata | Variable | File name, size, type (XChaCha20 encrypted) |
| HMAC tag | 32 bytes | Keyed-HMAC over the entry |
| **Total** | **~200 bytes + metadata** | |

### 2.3 Entry Contents (Decrypted View)

```
Entry 00000000000000000042
├── Timestamp: 2026-06-15T14:30:00.123456789Z
├── Operation: CREATE
├── Content hash: a1b2c3d4... (SHA-256)
├── Previous hash: e5f6a7b8... (SHA-256 of entry 41)
├── Metadata:
│   ├── File name: "budget-2026-q3.xlsx"
│   ├── File size: 1,234,567 bytes
│   ├── File type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
│   ├── Owner: user@example.com
│   └── Permissions: rw-r--r--
└── HMAC: 9a8b7c6d...
```

---

## 3. Append-Only Structure

### 3.1 Immutable Entries

Once written, an .aioss entry is never modified or deleted. The append-only property ensures:

- **Historical integrity**: Past operations cannot be erased
- **Linear history**: Every operation has exactly one predecessor and one successor
- **Non-repudiation**: Users cannot deny having performed operations
- **Forensic value**: Full history is available for investigation

### 3.2 How Append-Only Is Enforced

The ledger is append-only at multiple levels:

1. **Filesystem level**: Kamelot creates entries with monotonically increasing sequence numbers. Old entries are never opened for writing.

2. **Application level**: The Kamelot daemon refuses to modify existing entries. Attempting to do so causes a panic (which is caught and logged).

3. **Cryptographic level**: Each entry contains the hash of the previous entry. Modifying any entry would break the hash chain, making tampering detectable.

4. **OS level (optional)**: On Linux, the .aioss directory can be set to append-only with `chattr +a`, preventing any file modification or deletion at the filesystem level.

### 3.3 Compaction

The append-only ledger does not grow unboundedly. Kamelot periodically compacts old entries:

```bash
kml ledger compact
# Compacting ledger entries older than 365 days...
# 52,000 entries consolidated into 2,000 summary entries
# Original entry data is verified and checksummed
# Summary entries preserve integrity verification
```

Compact entries preserve the hash chain integrity while reducing storage for old history.

---

## 4. Hash-Chained Entries

### 4.1 The Chain

Each entry contains the SHA-256 hash of the previous entry, forming a hash chain:

```
Entry 1: [data] → [hash of entry 1]
Entry 2: [data] + [hash of entry 1] → [hash of entry 2]
Entry 3: [data] + [hash of entry 2] → [hash of entry 3]
...
Entry N: [data] + [hash of entry N-1] → [hash of entry N]
```

### 4.2 Mathematical Property

Given the root hash (hash of the latest entry), the integrity of the entire chain can be verified:

- `hash(entry_1) = H(data_1, 0)`
- `hash(entry_2) = H(data_2, hash(entry_1))`
- ...
- `hash(entry_N) = H(data_N, hash(entry_{N-1}))`

If any entry in the chain is modified, the hashes of all subsequent entries will not match.

### 4.3 Verification Procedure

To verify the chain given the current root hash:

```
1. Start with the latest entry (N)
2. Compute hash(entry_N) and compare with stored root hash
3. Read previous_hash from entry_N
4. Read entry_{N-1}, compute hash(entry_{N-1}), compare with previous_hash
5. Repeat steps 3-4 until entry_1
6. All hashes match → chain is intact
7. Any mismatch → tampering detected at that point
```

---

## 5. Merkle Tree Verification

### 5.1 Beyond Linear Chains

For efficient verification of large ledgers, Kamelot organizes entries into a Merkle tree structure in addition to the linear hash chain.

```
Root hash
├── Hash(0-32767)
│   ├── Hash(0-127)
│   │   ├── Hash(0-7)
│   │   │   ├── Hash(entry_0)
│   │   │   ├── Hash(entry_1)
│   │   │   ├── ...
│   │   │   └── Hash(entry_7)
│   │   ├── Hash(8-15)
│   │   └── ...
│   ├── Hash(128-255)
│   └── ...
└── Hash(32768-65535)
    └── ...
```

### 5.2 Benefits of Merkle Tree

| Aspect | Linear Chain Only | Linear Chain + Merkle Tree |
|--------|------------------|---------------------------|
| Full verification | O(n) — read all entries | O(log n) — read tree nodes |
| Partial verification | Must verify from root | Can verify any subtree |
| Append cost | O(1) | O(log n) |
| Storage overhead | None (included in entries) | ~5% additional |

### 5.3 Verification with Merkle Tree

```bash
# Verify single entry
kml ledger verify --entry 42
# Verifying entry 42:
# Path: root → ... → entry 42
# ✓ Hash matches

# Verify range
kml ledger verify --range 100-200
# Verifying 101 entries...
# All hashes valid.
```

---

## 6. Root Hash Storage

### 6.1 On-Device Storage

The current root hash is stored in multiple locations:

1. **In memory**: Held by the Kamelot daemon process
2. **In the store**: Written to `.aioss/root.hash` (updated on every new entry)
3. **In TPM (optional)**: Sealed in TPM NVRAM for tamper-proof storage

### 6.2 External Publishing

For maximum integrity assurance, the root hash can be published externally:

```bash
# Publish root hash to a public ledger (e.g., blockchain)
kml ledger publish --method blockchain
# Publishing root hash to Ethereum (Goerli testnet)...
# Transaction: 0x1234...5678
# Root hash: a1b2...c3d4
# Confirmed at block 18,423,567

# Publish to a file (for backup)
kml ledger publish --method file --output /backup/ledger-roots.txt

# Publish via DNS (DNS TXT record)
kml ledger publish --method dns --domain integrity.example.com
```

### 6.3 Periodic Publishing

Automated root hash publishing:

```bash
kml config set ledger.publish.enabled true
kml config set ledger.publish.interval 24h
kml config set ledger.publish.method blockchain
```

### 6.4 Verification Without Local Store

Anyone with the published root hash can verify ledger integrity without access to the Kamelot store:

```bash
# Verify from published root hash
kml ledger verify --root-hash a1b2c3d4... --store-path /mnt/store
```

---

## 7. Verification with `kml verify`

### 7.1 Full Store Verification

The `kml verify` command performs a comprehensive integrity check of the entire Kamelot store:

```bash
kml verify
# Kamelot Store Integrity Verification
# ======================================
# 
# Files: 52,341
# Ledger entries: 89,214
# Store size: 147.3 GB
# 
# Phase 1: Ledger integrity
# ✓ Hash chain intact
# ✓ Merkle tree valid
# ✓ Root hash matches TPM (if available)
# 
# Phase 2: File integrity
# ✓ All content hashes match ledger records
# ✓ All file sizes match ledger records
# ✓ No orphaned blobs
# ✓ No missing blobs
# 
# Phase 3: Index integrity
# ✓ All vector embeddings accessible
# ✓ Index size consistent with file count
# 
# Result: STORE INTEGRITY VERIFIED (100%)
# Duration: 2 minutes 34 seconds
```

### 7.2 Verification Options

```bash
# Quick verification (ledger chain only)
kml verify --quick

# Deep verification (including index re-query)
kml verify --deep

# Verify specific file
kml verify --file "budget-2026-q3.xlsx"

# Verify specific date range
kml verify --since "2026-01-01" --until "2026-06-30"

# Export verification report
kml verify --output report.json

# Automated verification (non-interactive)
kml verify --quiet
```

### 7.3 Scheduled Verification

For automated integrity monitoring:

```bash
kml config set verify.schedule "0 3 * * *"  # Daily at 3 AM
kml config set verify.notify-on-failure true
kml config set verify.alert-email admin@example.com
```

---

## 8. Tamper Detection

### 8.1 Types of Tampering

The .aioss ledger can detect various types of tampering:

| Tampering Type | Detection Method |
|---------------|-----------------|
| File content modified | Content hash doesn't match ledger |
| File deleted without ledger entry | Orphaned content hash in chain with no corresponding blob |
| Blob added without ledger entry | Blob has no corresponding ledger entry |
| Ledger entry modified | Hash chain broken |
| Ledger entry deleted | Hash chain broken (missing link) |
| Ledger entry reordered | Hash chain broken (wrong previous hash) |
| Root hash modified | Doesn't match TPM or external publication |

### 8.2 Tamper Response

When tampering is detected:

```bash
kml verify
# PHASE 1: LEDGER INTEGRITY
# ✗ TAMPER DETECTED
# 
# Details:
#   Entry 42,201: Previous hash does not match entry 42,200
#   Entry 42,200 hash: a1b2c3d4... (expected: e5f6a7b8...)
#   Entry 42,200 content: ... (may have been modified)
# 
# Recommended actions:
#   1. Stop Kamelot daemon immediately
#   2. Investigate the cause of tampering
#   3. Restore from verified backup if available
#   4. Run forensic analysis on affected entries
```

### 8.3 Forensic Analysis

Kamelot provides tools for investigating tampering:

```bash
# Show detailed information about affected entries
kml ledger inspect --entry 42200 --verbose

# Export affected range for external analysis
kml ledger export --range 42100-42300 --output tamper-evidence.json

# Compare with published root hash
kml ledger compare --external-root "https://etherscan.io/tx/0x1234..."
```

---

## 9. Integration with Immutable Backups

### 9.1 Backup Strategies

The .aioss ledger enables several backup strategies:

| Strategy | Description | Ransomware Protection |
|----------|-------------|---------------------|
| Standard backup | Copy flat store to external media | Low |
| Ledger-verified backup | Verify integrity before and after backup | Medium |
| Immutable backup | Write-once-read-many (WORM) storage | High |
| Root-published backup | Publish root hash externally | Very High |

### 9.2 Immutable Backup Setup

```bash
# Create an immutable backup (WORM storage)
kml backup create --destination /mnt/backup/kamelot --immutable
# Creating encrypted backup...
# Ledger root hash: a1b2c3d4...
# Published to blockchain: 0x1234...5678
# Backup stored on WORM media (no modification possible)

# Verify backup against published root hash
kml backup verify --backup /mnt/backup/kamelot --root-hash a1b2c3d4...
```

### 9.3 Ransomware Resilience

The .aioss ledger provides unique protection against ransomware:

1. **Ransomware encrypts files**: The hash chain breaks immediately
2. **Ransomware modifies ledger**: The hash chain breaks
3. **Ransomware deletes ledger entries**: Missing entries break the chain
4. **Ransomware cannot modify externally-published root hash**: Comparison detects tampering

Even if ransomware compromises the entire Kamelot daemon, the externally published root hash provides an independent integrity check.

### 9.4 Recovery from Verified Backup

```bash
# 1. Verify backup integrity
kml backup verify --backup /mnt/backup/kamelot

# 2. Restore from verified backup
kml backup restore --backup /mnt/backup/kamelot

# 3. Verify restored store
kml verify

# 4. Resume operations
kml start
```

---

## 10. Audit Use Cases

### 10.1 File History

The .aioss ledger provides a complete history of each file:

```bash
kml ledger history "budget-2026-q3.xlsx"
# History of: budget-2026-q3.xlsx
# 
# Entry 42,200 | 2026-06-15 14:30:00 | MODIFY
#   Previous version: 1,234,456 bytes
#   New version: 1,234,567 bytes
#   Changed by: user@example.com
# 
# Entry 41,500 | 2026-06-10 09:15:00 | MODIFY
#   Previous version: 1,100,000 bytes
#   New version: 1,234,456 bytes
#   Changed by: user@example.com
# 
# Entry 38,200 | 2026-06-01 11:00:00 | CREATE
#   Initial version: 1,000,000 bytes
#   Created by: user@example.com
```

### 10.2 Compliance Auditing

For regulated industries, the ledger provides tamper-evident audit trails:

```bash
# Audit all file accesses by a specific user
kml ledger audit --user "user@example.com"

# Audit all modifications to sensitive files
kml ledger audit --path "/Legal/*"

# Generate compliance report (HIPAA, SOX, GDPR)
kml ledger report --compliance hipaa --output compliance-report.pdf
```

### 10.3 Chain of Custody

For forensic investigations:

```bash
kgml ledger chain-of-custody "evidence-2026.docx"
# Chain of custody for: evidence-2026.docx
# 
# 2026-06-01 10:00:00 | Created by investigator@agency.gov
# 2026-06-02 14:00:00 | Reviewed by reviewer@agency.gov
# 2026-06-03 09:00:00 | Certified by supervisor@agency.gov
# 2026-06-10 16:00:00 | Exported for court evidence
# 
# Integrity: ✓ Unbroken chain since creation
```

---

## 11. Implementation Details

### 11.1 Entry Serialization

Entries are serialized using a compact binary format (not JSON or text):

```
Offset  | Size  | Field
0       | 8     | Entry number (big-endian uint64)
8       | 8     | Timestamp (big-endian uint64, nanoseconds since Unix epoch)
16      | 1     | Operation type (enum: 0=CREATE, 1=MODIFY, 2=DELETE, ...)
17      | 32    | Content hash (SHA-256)
49      | 32    | Previous entry hash (SHA-256, zero for entry 1)
81      | 2     | Metadata length (big-endian uint16)
83      | N     | Encrypted metadata (XChaCha20-Poly1305)
83+N    | 32    | HMAC-SHA256 over fields 0..83+N-1
```

Total: 115 + N bytes per entry (N = metadata size, typically 50–200 bytes)

### 11.2 Cryptographic Details

- **Hash algorithm**: SHA-256 (FIPS 180-4)
- **HMAC algorithm**: HMAC-SHA256 (RFC 2104)
- **Metadata encryption**: XChaCha20-Poly1305 (same key as file encryption, but with "ledger" domain separation)
- **HMAC key**: Derived from master key via HKDF with info "kam:ledger-hmac"

### 11.3 Merkle Tree Implementation

- **Branching factor**: 128 (binary tree with 7 levels)
- **Leaf nodes**: Individual entry hashes
- **Internal nodes**: Hash of 128 child hashes (or fewer for incomplete branches)
- **Root**: Top-level hash
- **Storage**: Merkle tree stored in `.aioss/merkle/` directory

### 11.4 Entry Numbering

Entry numbers are 64-bit unsigned integers, allowing up to 2^64 − 1 entries. At a rate of 10,000 entries per day, this provides approximately 5 × 10^12 years of operation.

### 11.5 Performance

| Operation | Performance |
|-----------|-------------|
| Write entry | ~50 μs |
| Read entry by number | ~10 μs (direct lookup) |
| Full chain verification (1M entries) | ~30 seconds |
| Merkle tree verification (1M entries) | ~50 ms |
| Entry append | ~100 μs (sequential write) |

---

## 12. Ledger Entry Schema and Wire Format

### 12.1 Binary Entry Format

```rust
/// .aioss ledger entry binary format
#[repr(C, packed)]
struct LedgerEntry {
    /// Entry number (big-endian u64)
    entry_number: [u8; 8],
    /// Timestamp (nanoseconds since Unix epoch, big-endian u64)
    timestamp: [u8; 8],
    /// Operation type enum
    operation_type: OperationType,
    /// Padding for alignment
    _padding: [u8; 7],
    /// SHA-256 hash of file content
    content_hash: [u8; 32],
    /// SHA-256 hash of previous entry
    previous_entry_hash: [u8; 32],
    /// Length of encrypted metadata (big-endian u16)
    metadata_length: [u8; 2],
    /// Encrypted metadata (variable length)
    encrypted_metadata: Vec<u8>,
    /// HMAC-SHA256 over all preceding fields
    hmac_tag: [u8; 32],
}

#[repr(u8)]
enum OperationType {
    Create = 0,
    Modify = 1,
    Delete = 2,
    Rename = 3,
    Verify = 4,
    Access = 5,     // Read access audit entry
    Export = 6,     // File export from store
    Import = 7,     // File import into store
    Backup = 8,     // Backup event marker
    Restore = 9,    // Restore event marker
}
```

### 12.2 Entry Serialization Implementation

```rust
impl LedgerEntry {
    /// Serialize entry to bytes for storage
    fn to_bytes(&self) -> Vec<u8> {
        let mut bytes = Vec::with_capacity(self.size());
        
        bytes.extend_from_slice(&self.entry_number);
        bytes.extend_from_slice(&self.timestamp);
        bytes.push(self.operation_type as u8);
        bytes.extend_from_slice(&self._padding);
        bytes.extend_from_slice(&self.content_hash);
        bytes.extend_from_slice(&self.previous_entry_hash);
        bytes.extend_from_slice(&self.metadata_length);
        bytes.extend_from_slice(&self.encrypted_metadata);
        
        // Compute HMAC over the fields (before HMAC tag)
        let hmac_key = get_ledger_hmac_key();
        let mut mac = Hmac::<Sha256>::new_from_slice(&hmac_key)
            .expect("HMAC key should be 32 bytes");
        mac.update(&bytes);
        let hmac_result = mac.finalize();
        bytes.extend_from_slice(&hmac_result.into_bytes());
        
        bytes
    }

    /// Deserialize entry from bytes
    fn from_bytes(bytes: &[u8]) -> Result<Self, LedgerError> {
        if bytes.len() < 89 {
            return Err(LedgerError::EntryTooShort);
        }
        
        let mut entry = LedgerEntry {
            entry_number: [0u8; 8],
            timestamp: [0u8; 8],
            operation_type: OperationType::Create,
            _padding: [0u8; 7],
            content_hash: [0u8; 32],
            previous_entry_hash: [0u8; 32],
            metadata_length: [0u8; 2],
            encrypted_metadata: Vec::new(),
            hmac_tag: [0u8; 32],
        };
        
        let mut offset = 0;
        entry.entry_number.copy_from_slice(&bytes[offset..offset+8]);
        offset += 8;
        entry.timestamp.copy_from_slice(&bytes[offset..offset+8]);
        offset += 8;
        entry.operation_type = match bytes[offset] {
            0 => OperationType::Create,
            1 => OperationType::Modify,
            2 => OperationType::Delete,
            3 => OperationType::Rename,
            4 => OperationType::Verify,
            5 => OperationType::Access,
            6 => OperationType::Export,
            7 => OperationType::Import,
            8 => OperationType::Backup,
            9 => OperationType::Restore,
            _ => return Err(LedgerError::UnknownOperationType),
        };
        offset += 8; // Skip past op_type (1) + padding (7)
        
        entry.content_hash.copy_from_slice(&bytes[offset..offset+32]);
        offset += 32;
        entry.previous_entry_hash.copy_from_slice(&bytes[offset..offset+32]);
        offset += 32;
        
        let meta_len = u16::from_be_bytes([
            bytes[offset], bytes[offset+1]
        ]);
        offset += 2;
        
        entry.encrypted_metadata = bytes[offset..offset + meta_len as usize].to_vec();
        offset += meta_len as usize;
        
        entry.hmac_tag.copy_from_slice(&bytes[offset..offset+32]);
        
        Ok(entry)
    }
}
```

## 13. Edge Cases and Failure Modes

### 13.1 Hash Chain Anomalies

| Anomaly | Detection | Resolution |
|---------|-----------|------------|
| Entry N's "previous hash" doesn't match entry N-1's hash | Automatic during `kml verify` | Entry N or N-1 was modified; forensic analysis required |
| Entry N references non-existent entry N-1 | `kml verify` reports missing link | Entry N-1 was deleted; attempt recovery from backup |
| Two entries with same sequence number | Duplicate sequence number | Filesystem corruption; restore from backup |
| Gap in sequence (N-1, N+1, missing N) | `kml verify` reports discontinuity | Entry N was deleted; forensic analysis required |
| Entry timestamp is in the future | Clock skew or malicious entry | Investigate; entry may still be valid if future time is plausible |
| Entry timestamp is before last entry | Clock skew or reordering | Investigate; may indicate tampering |

### 13.2 Storage Exhaustion

```rust
/// Monitor ledger storage and trigger compaction
fn check_ledger_storage() -> Result<StorageStatus, LedgerError> {
    let ledger_dir = Path::new("/var/kamelot/store/.aioss");
    let total_entries = count_entries(ledger_dir)?;
    let total_size = dir_size(ledger_dir)?;
    
    let status = StorageStatus {
        entry_count: total_entries,
        total_size_bytes: total_size,
        avg_entry_size: total_size / total_entries.max(1),
        estimated_growth_per_day: estimate_daily_growth()?,
        days_until_full: calculate_days_until_full(total_size, total_entries)?,
    };
    
    if status.days_until_full < Some(30) {
        warn!("Ledger storage will be exhausted in {} days. Consider compaction.", 
              status.days_until_full.unwrap_or(0));
    }
    
    Ok(status)
}
```

### 13.3 Recovery from Data Corruption

```bash
# Scenario: Disk sector corruption affects ledger entry 42,200
kml verify
# ✗ TAMPER DETECTED at entry 42,200

# Option 1: Restore entry from replica/backup
kml ledger restore --entry 42200 --from-backup /mnt/backup/ledger/entry-42200.entry

# Option 2: Reconstruct entry from file state (if backup unavailable)
kml ledger reconstruct --entry 42200
# Reconstructing entry 42,200 from current file state...
# ✓ Content hash matches file blob
# ✓ Timestamp estimated from file modification time
# ✓ Previous hash updated to maintain chain continuity
# Entry reconstructed. Run `kml verify` to confirm integrity.

# Option 3: Accept discontinuity (if reconstruction not possible)
kml ledger repair --break-chain-at 42200
# Warning: This creates a discontinuity in the hash chain.
# Entry 42,200 and all subsequent entries will have a broken link.
# The Merkle tree will need recalculation.
# Type "CONFIRM" to proceed:
```

### 13.4 Concurrent Write Conflicts

Kamelot uses file locking to prevent concurrent ledger writes:

```rust
use fs2::FileExt;

/// Write a ledger entry with exclusive file lock
fn write_entry(entry: &LedgerEntry) -> Result<(), LedgerError> {
    let ledger_lock = File::create("/var/kamelot/store/.aioss/LEDGER.LOCK")?;
    
    // Acquire exclusive lock (blocking, with timeout)
    ledger_lock.lock_exclusive()?;
    
    let result = (|| {
        let entry_bytes = entry.to_bytes();
        
        // Verify we're writing at the correct position
        let current_sequence = read_current_sequence()?;
        let expected = current_sequence + 1;
        let entry_number = u64::from_be_bytes(entry.entry_number);
        
        if entry_number != expected {
            return Err(LedgerError::SequenceMismatch {
                expected,
                actual: entry_number,
            });
        }
        
        // Write entry to file
        let filename = format!("{:020}.entry", entry_number);
        let path = Path::new("/var/kamelot/store/.aioss").join(&filename);
        
        // Atomic write: write to temp file, then rename
        let tmp_path = path.with_extension("tmp");
        std::fs::write(&tmp_path, &entry_bytes)?;
        std::fs::rename(&tmp_path, &path)?;
        
        // Update Merkle tree
        update_merkle_tree(entry_number, entry_bytes)?;
        
        // Update root hash
        update_root_hash(entry_number)?;
        
        Ok(())
    })();
    
    // Release lock
    ledger_lock.unlock()?;
    result
}
```

## 14. Merkle Tree Implementation Details

### 14.1 Tree Construction

```rust
/// Merkle tree node
struct MerkleNode {
    level: u8,
    index: u64,
    hash: [u8; 32],
    children: Option<Box<[MerkleNode; 128]>>,
}

impl MerkleNode {
    /// Compute hash of this node from child hashes
    fn compute_hash(&self) -> [u8; 32] {
        let mut hasher = Sha256::new();
        
        if let Some(ref children) = self.children {
            // Internal node: hash of all child hashes
            for child in children.iter() {
                hasher.update(&child.hash);
            }
        } else {
            // Leaf node: hash of entry number + entry hash
            hasher.update(&self.index.to_be_bytes());
            // Entry hash would be read from the entry file
        }
        
        let result = hasher.finalize();
        let mut hash = [0u8; 32];
        hash.copy_from_slice(&result);
        hash
    }
}

/// Verify a single entry using Merkle proof
fn verify_entry_merkle(
    entry_number: u64,
    expected_root: &[u8; 32],
) -> Result<bool, LedgerError> {
    // Collect sibling hashes along the path to root
    let mut current_hash = compute_entry_hash(entry_number)?;
    let mut current_level = 0u8;
    let mut current_index = entry_number;
    
    while current_level < MAX_MERKLE_LEVELS {
        let sibling_index = current_index ^ 1;
        let sibling_hash = read_merkle_node(current_level, sibling_index)?;
        
        // Compute parent hash
        let mut hasher = Sha256::new();
        if current_index & 1 == 0 {
            hasher.update(&current_hash);
            hasher.update(&sibling_hash);
        } else {
            hasher.update(&sibling_hash);
            hasher.update(&current_hash);
        }
        current_hash = hasher.finalize().into();
        
        current_level += 1;
        current_index >>= 1;
    }
    
    Ok(current_hash == *expected_root)
}
```

### 14.2 Merkle Tree Performance

```rust
#[bench]
fn bench_merkle_verification(b: &mut Bencher) {
    let store = create_test_store(1_000_000); // 1M entries
    let root_hash = store.merkle_root();
    
    b.iter(|| {
        // Verify 100 random entries
        for _ in 0..100 {
            let entry = rand::random::<u64>() % 1_000_000;
            let result = verify_entry_merkle(entry, &root_hash);
            assert!(result.unwrap());
        }
    });
}
// Result: 100 entries verified in ~5ms (20μs per entry)
```

## 15. Integration Guide

### 15.1 Verifying Ledger Integrity Programmatically

```rust
use kamelot::ledger::{Ledger, VerificationResult};

fn verify_store(path: &str) -> Result<(), Box<dyn std::error::Error>> {
    let ledger = Ledger::open(path)?;
    
    match ledger.verify_full()? {
        VerificationResult::Valid { entries, duration } => {
            println!("Store integrity verified:");
            println!("  Entries checked: {}", entries);
            println!("  Duration: {}ms", duration.as_millis());
        }
        VerificationResult::Tampered { entries_failed, details } => {
            eprintln!("TAMPER DETECTED!");
            for detail in details {
                eprintln!("  Entry {}: {}", detail.entry_number, detail.reason);
            }
            return Err("Store integrity check failed".into());
        }
    }
    
    Ok(())
}
```

### 15.2 Exporting Ledger for External Audit

```bash
# Export entire ledger as JSON for external audit tools
kml ledger export --format json --output ledger-export.json

# Export ledger as CSV for spreadsheet analysis
kml ledger export --format csv --output ledger-export.csv

# Export ledger with decrypted metadata (requires seed phrase)
kml ledger export --format json --decrypt-metadata --output ledger-decrypted.json

# Export Merkle tree structure
kml ledger export --format merkle-tree --output merkle-tree.json

# Sample of JSON export:
# {
#   "entries": [
#     {
#       "entry_number": 1,
#       "timestamp": "2026-01-01T00:00:00.000000000Z",
#       "operation": "CREATE",
#       "content_hash": "a1b2c3d4e5f6...",
#       "previous_hash": "000000000000...",
#       "metadata": {
#         "filename": "encrypted",
#         "size": "encrypted"
#       },
#       "hmac_valid": true
#     }
#   ],
#   "merkle_root": "9a8b7c6d5e4f...",
#   "verification": "PASSED"
# }
```

### 15.3 Blockchain Integration

```solidity
// Example: Smart contract for storing Kamelot root hashes
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract KamelotLedgerAnchor {
    struct RootHashRecord {
        bytes32 rootHash;
        uint256 timestamp;
        uint256 blockNumber;
        string nodeId;
    }
    
    mapping(bytes32 => RootHashRecord) public rootHashes;
    bytes32[] public rootHashKeys;
    
    event RootHashAnchored(
        bytes32 indexed rootHash,
        uint256 timestamp,
        string nodeId
    );
    
    function anchorRootHash(
        bytes32 _rootHash,
        string memory _nodeId
    ) public {
        require(rootHashes[_rootHash].timestamp == 0, "Root hash already anchored");
        
        rootHashes[_rootHash] = RootHashRecord({
            rootHash: _rootHash,
            timestamp: block.timestamp,
            blockNumber: block.number,
            nodeId: _nodeId
        });
        
        rootHashKeys.push(_rootHash);
        
        emit RootHashAnchored(_rootHash, block.timestamp, _nodeId);
    }
    
    function verifyRootHash(bytes32 _rootHash) public view returns (bool) {
        return rootHashes[_rootHash].timestamp != 0;
    }
    
    function getRootHashCount() public view returns (uint256) {
        return rootHashKeys.length;
    }
}
```

## 16. Conclusion

The .aioss ledger is a critical component of Kamelot's security architecture. It provides:

- **Immutable history**: Every file operation is permanently recorded
- **Tamper detection**: Any modification to files or metadata is detectable
- **Independent verification**: The root hash can be published externally for independent integrity checks
- **Audit trail**: Complete history of every file for compliance and forensics

The combination of append-only structure, hash-chained entries, Merkle tree verification, and external root hash publishing creates a robust integrity protection system that meets the requirements of even the most demanding security and compliance environments.

---

*For ledger integrity questions: ledger@kamelot.dev*

*Last updated: June 2026*

*This document is part of the Data Safety documentation suite. See also:*
- *01-encryption-architecture.md — Encryption architecture*
- *02-key-management.md — Key management*
- *03-hardware-binding.md — Hardware binding*
- *05-zero-knowledge-proof.md — Zero-knowledge architecture*
- *06-threat-model.md — Comprehensive threat model*

---

*Kamelot is a project of Lois-Kleinner & 0-1.gg. © 2026. All rights reserved.*
