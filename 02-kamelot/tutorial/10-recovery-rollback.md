                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                

# 10 — Recovery & Rollback

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. [Overview](#overview)
2. [How Rollback Works](#how-rollback-works)
3. [The Immutable Ledger](#the-immutable-ledger)
4. [Ransomware Scenario Simulation](#ransomware-scenario-simulation)
5. [Basic Rollback](#basic-rollback)
6. [Time-Based Rollback](#time-based-rollback)
7. [Block-Based Rollback](#block-based-rollback)
8. [Selective Rollback](#selective-rollback)
9. [Verifying File Restoration](#verifying-file-restoration)
10. [Comparing Ledger States](#comparing-ledger-states)
11. [Ledger Integrity Verification](#ledger-integrity-verification)
12. [Best Practices for Backups](#best-practices-for-backups)
13. [Disaster Recovery Plan](#disaster-recovery-plan)
14. [Troubleshooting](#troubleshooting)

---

## Overview

Kamelot's immutable ledger is one of its most powerful features. Every operation — every file ingested, every deletion, every metadata change — is recorded in a cryptographically chained, append-only log. This ledger enables a capability that traditional filesystems cannot match: **time-travel**.

You can roll back your entire store to any point in its history. This is not an "undo" feature (though it can be used that way). It is a complete state restoration based on cryptographic evidence. If ransomware encrypts your files, you roll back. If you accidentally delete something, you roll back. If a malicious process corrupts data, you roll back.

This tutorial covers everything from basic rollback to advanced ledger analysis and disaster recovery planning.

## How Rollback Works

### The Rollback Process

```
Ledger:
  Block #0  (genesis)
  Block #1  PUT file_A
  Block #2  PUT file_B
  Block #3  PUT file_C
  Block #4  DELETE file_A   ← Malicious action
  Block #5  PUT file_D

Request: Rollback to before block #4

Process:
  1. Validate ledger integrity (all blocks #0-#5)
  2. Identify blocks to revert (#4-#5)
  3. For each block, invert the operation:
     - DELETE → RESTORE file_A
     - PUT file_D → REMOVE file_D
  4. Create a rollback block:
     Block #6 ROLLBACK to #3
  5. Verify final state matches block #3
```

### What Rollback Affects

| Component | Affected? | Details |
|-----------|-----------|---------|
| File content | Yes | Files added after the target state are removed; files deleted are restored |
| File metadata | Yes | Names, tags, authors reverted |
| Embeddings | Yes | Vectors added/removed from Qdrant |
| Canvas layout | Yes | Node positions and links reverted |
| Workspaces | Yes | Workspace membership recomputed |
| Ledger itself | No (append only) | New rollback block is added |
| Configuration | No | Config stays as-is |
| Master passphrase | No | Unchanged |

### What Rollback Does NOT Affect

- The ledger remains intact (new blocks are appended)
- Encryption keys remain the same
- Qdrant collection structure remains (only points are added/removed)
- External files not in the Kamelot store

## The Immutable Ledger

### Ledger Structure

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Block #0 │────▶│ Block #1 │────▶│ Block #2 │────▶│ Block #3 │
│ Genesis  │     │ PUT      │     │ PUT      │     │ DELETE   │
│ Hash:    │     │ Hash:    │     │ Hash:    │     │ Hash:    │
│ 0000...  │     │ a1b2...  │     │ c3d4...  │     │ e5f6...  │
│ Prev:    │     │ Prev:    │     │ Prev:    │     │ Prev:    │
│ 0000...  │     │ 0000...  │     │ a1b2...  │     │ c3d4...  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                        │
                                                    (After rollback)
                                                        │
                                                        ▼
                                                ┌──────────┐
                                                │ Block #4 │
                                                │ ROLLBACK │
                                                │ to #2    │
                                                │ Hash:    │
                                                │ f7g8...  │
                                                │ Prev:    │
                                                │ e5f6...  │
                                                └──────────┘
```

### Block Contents

Each block contains:

```
Block #42:
  Hash:       a1b2c3d4e5f6...  (BLAKE3 of everything below)
  Previous:   0000abc123def...  (Hash of block #41)
  Timestamp:  2026-06-19T10:00:00Z
  Operation:  PUT              (Type: PUT, DELETE, UPDATE, ROLLBACK)
  Inode:      7f3a5c91-...     (Affected file)
  File Hash:  7a3b5c...        (BLAKE3 of encrypted content)
  Embed Hash: def789...        (BLAKE3 of embedding)
  Size:       245000           (File size)
  MIME:       application/pdf
  Name:       tax-return-2025.pdf
  Metadata:   {...}            (Tags, author, description)
  Signature:  ...              (BLAKE3 signature)
```

### Ledger Verification

Every time a block is added, its hash is computed from all previous fields, ensuring the chain is tamper-evident.

```bash
# Verify entire ledger
kml ledger --verify
```

Output:
```
Ledger integrity verification:
  Blocks:         1,234
  Verified:       1,234 / 1,234 (100%)
  Status:         INTACT
  First invalid:  (none)
  Root hash:      a1b2c3d4e5f6...
```

### Ledger Export

```bash
# Export ledger for backup
kml ledger --format json --output ledger_backup.json

# Export with full block details
kml ledger --verbose --format json --output ledger_detailed.json
```

## Ransomware Scenario Simulation

Let's simulate a ransomware attack and recovery to demonstrate the power of rollback.

### Setup: Create Test Files

```bash
# Create a test store and populate it
kml init ./test_store
echo "Q1 Budget: $50,000" > q1-budget.txt
echo "Q2 Budget: $75,000" > q2-budget.txt
echo "Q3 Budget: $100,000" > q3-budget.txt
echo "Important client list" > clients.txt
echo "Password: admin123" > passwords.txt

# Ingest all files
kml put q1-budget.txt q2-budget.txt q3-budget.txt
kml put clients.txt
kml put passwords.txt
```

### Simulate Ransomware

```bash
# "Ransomware" deletes important files and replaces them with garbage
kml delete clients.txt
kml delete passwords.txt
echo "ALL YOUR FILES ARE ENCRYPTED. PAY 1 BTC TO RECOVER." > ransom-note.txt
kml put ransom-note.txt
```

### Check the Damage

```bash
kml list
```

Output:
```
Inode                                     Name                    Size
────────────────────────────────────────  ──────────────────────  ──────
...                                       q1-budget.txt           22 B
...                                       q2-budget.txt           22 B
...                                       q3-budget.txt           22 B
...                                       ransom-note.txt         59 B
```

Note: `clients.txt` and `passwords.txt` are gone.

### Check Ledger

```bash
kml ledger
```

Output shows the malicious operations:
```
Block #5  PUT  q1-budget.txt
Block #6  PUT  q2-budget.txt
Block #7  PUT  q3-budget.txt
Block #8  PUT  clients.txt
Block #9  PUT  passwords.txt
Block #10 DELETE  clients.txt    ← Ransomware
Block #11 DELETE  passwords.txt  ← Ransomware
Block #12 PUT  ransom-note.txt   ← Ransomware
```

## Basic Rollback

### Roll Back 5 Minutes

```bash
kml rollback --minutes 5
```

This is the most common rollback scenario — recovering from something that just happened.

```
$ kml rollback --minutes 5

Rolling back store to state from 5 minutes ago (2026-06-19 10:05:00 UTC)

Analyzing ledger...
  Blocks to revert: 3 (blocks #10-#12)
  Files affected: 2 DELETE, 1 PUT

Dry run summary:
  clients.txt:     DELETE → RESTORED
  passwords.txt:   DELETE → RESTORED
  ransom-note.txt: PUT → REMOVED

Proceed with rollback? [y/N] y

Rolling back...
  ✓ clients.txt restored
  ✓ passwords.txt restored
  ✓ ransom-note.txt removed

Rollback complete. Store now at block #9.
Ledger integrity: INTACT
```

### Verify Recovery

```bash
kml list
```

Output:
```
Inode                                     Name                    Size
────────────────────────────────────────  ──────────────────────  ──────
...                                       q1-budget.txt           22 B
...                                       q2-budget.txt           22 B
...                                       q3-budget.txt           22 B
...                                       clients.txt             24 B
...                                       passwords.txt           20 B
```

Files are restored!

### Check Ledger After Rollback

```bash
kml ledger
```

The rollback is recorded as a new block:
```
Block #5  PUT  q1-budget.txt
Block #6  PUT  q2-budget.txt
Block #7  PUT  q3-budget.txt
Block #8  PUT  clients.txt
Block #9  PUT  passwords.txt
Block #10 DELETE clients.txt
Block #11 DELETE passwords.txt
Block #12 PUT  ransom-note.txt
Block #13 ROLLBACK to block #9  ← Rollback recorded
```

## Time-Based Rollback

### Roll Back by Hours

```bash
# Roll back 1 hour
kml rollback --hours 1

# Roll back 6 hours
kml rollback --hours 6

# Roll back 24 hours
kml rollback --hours 24
```

### Roll Back by Days

```bash
# Roll back 7 days
kml rollback --days 7

# Roll back 30 days
kml rollback --days 30

# Roll back 1 year
kml rollback --days 365
```

### Roll Back to Specific Time

```bash
# Roll back to a specific timestamp (ISO 8601)
kml rollback --to-time "2026-06-19T09:30:00Z"

# Roll back to a specific date
kml rollback --to-time "2026-06-01T00:00:00Z"
```

### Time-Based Dry Run

Always do a dry run first for time-based rollbacks:

```bash
kml rollback --hours 1 --dry-run
```

Output:
```
Dry run: Rolling back 1 hour to 2026-06-19 09:00:00 UTC
  Blocks to revert: 12 (blocks #13-#24)
  Files to restore: 3
  Files to remove: 7
  Files to update: 2
  Net change: -4 files

This operation is NOT reversible (except by another rollback).
Proceed with --force to execute.
```

## Block-Based Rollback

### Roll Back to Specific Block

```bash
# Roll back to block #42
kml rollback --to-block 42

# Check the block contents first
kml ledger --block 42
```

### Roll Back Before a Specific Operation

```bash
# Find the block where a malicious file was added
kml ledger --inode 7f3a5c91...

# Roll back to before that block
kml rollback --to-block 9  # Block before the malicious PUT
```

### Roll Back Before a Specific File

```bash
# Roll back to before a specific inode existed
kml rollback --to-before-inode 7f3a5c91-b2d4-4f8e-9a1c-3e5f7d8b2a1c

# This automatically finds the block where the file was added
# and rolls back to just before it
```

## Selective Rollback

Sometimes you don't want to roll back the entire store — just specific files.

### Restore a Single File

```bash
# Restore a deleted file
kml restore clients.txt

# Restore from a specific point in time
kml restore clients.txt --from "5 minutes ago"

# Restore to a previous version
kml restore clients.txt --version 2  # Version 2 of the file
```

### Undo a Single Operation

```bash
# Undo the last operation on a specific file
kml undo 7f3a5c91...

# Undo the last N operations
kml undo --count 3
```

### Roll Back Specific Inodes

```bash
# Roll back only specific files
kml rollback --inodes 7f3a5c91...,a1b2c3d4...
```

### Roll Back a Workspace

```bash
# Roll back all files in a workspace
kml workspace rollback "Q4 Financial Documents" --hours 1
```

### Roll Back by File Type

```bash
# Roll back only PDF files
kml rollback --mime application/pdf --minutes 30
```

## Verifying File Restoration

### Verify by Listing

```bash
# List files to verify count
kml list --count

# Compare with expected count
kml ledger --since "1 hour ago" | grep PUT | wc -l
```

### Verify by Content

```bash
# Get a restored file and check its content
kml get clients.txt --output restored_clients.txt
cat restored_clients.txt
# Expected: Important client list
```

### Verify by Hash

```bash
# Check file hash
kml get clients.txt --info
# Look for "Object Hash"

# Compare with ledger hash
kml ledger --inode 7f3a5c91... | grep "File Hash"
```

### Verify Embedding

```bash
# Check that embeddings were restored
kml get clients.txt --info | grep Embedding
# Should say "present (384 dims)"
```

### Automated Verification

```bash
# Full verification after rollback
kml rollback --minutes 5 --verify
```

Output:
```
Post-rollback verification:
  ✓ Ledger integrity: INTACT (14 blocks)
  ✓ File count: 5 (expected: 5)
  ✓ Object store: All 5 files present
  ✓ Qdrant vectors: 5 (expected: 5)
  ✓ Canvas layout: Consistent (no orphaned nodes)
  ✓ Workspaces: All 3 workspaces valid
```

## Comparing Ledger States

### State Diff

```bash
# Compare current state with state 1 hour ago
kml ledger diff --from "1 hour ago"
```

Output:
```
Ledger State Diff: now vs. 1 hour ago

Added files:
  + ransom-note.txt (PUT at block #12)

Removed files:
  - clients.txt (DELETE at block #10)
  - passwords.txt (DELETE at block #11)

Modified files:
  (none)

Summary:
  Files added: 1
  Files removed: 2
  Files modified: 0
  Net change: -1
```

### State at Specific Time

```bash
# Show store state at a specific time
kml ledger state --at "2026-06-19T09:30:00Z"
```

### Snapshot Comparison

```bash
# Take a snapshot (saves current state reference)
kml ledger snapshot "before-upgrade"

# Later, compare
kml ledger snapshot diff "before-upgrade"
```

### File Version History

```bash
# Show version history of a specific file
kml ledger --inode 7f3a5c91...
```

Output:
```
History of file 7f3a5c91... (clients.txt):
  Block #8  PUT    2026-06-19 10:02:00  "Important client list" (24 bytes)
  Block #10 DELETE 2026-06-19 10:04:00  File deleted
  Block #13 ROLLBACK (restored from block #9)
```

## Ledger Integrity Verification

### Full Verification

```bash
kml ledger --verify
```

Output:
```
Ledger integrity verification:
  Blocks:         1,234
  Verified:       1,234 / 1,234 (100%)
  Status:         INTACT
  Root hash:      a1b2c3d4e5f6...

If verification fails:
  Status:         CORRUPT
  First invalid: block #856
  Expected hash: a1b2c3d4...
  Actual hash:   e5f6a7b8...
  Suggested action: Roll back to block #855 and re-verify
```

### Partial Verification

```bash
# Verify recent blocks only
kml ledger --verify --last 100

# Verify a range
kml ledger --verify --range 100-200
```

### Verification with Repair

```bash
# If corruption is found, the ledger can attempt repair
kml ledger --verify --repair
```

Note: Repair can only fix blocks after the last valid one. Tampered blocks in the middle require rollback.

### Export for External Verification

```bash
# Export ledger for offline verification
kml ledger --format json --output ledger.json

# Verify with an external tool
kml ledger verify-external ledger.json
```

## Best Practices for Backups

### Regular Ledger Snapshots

```bash
# Create a snapshot (think of it as a backup marker)
kml ledger snapshot "weekly-2026-W25"

# Schedule automatic snapshots
kml config set ledger.auto_snapshot.enabled true
kml config set ledger.auto_snapshot.interval "weekly"
kml config set ledger.auto_snapshot.keep_last 52  # 1 year of weekly snapshots
```

### Export Ledger Regularly

```bash
# Export ledger to a backup file
kml ledger --format json --output /backup/kamelot/ledger-$(date +%Y%m%d).json

# Automate with cron/systemd timer
# (see the Disaster Recovery Plan section for a full script)
```

### Backup the Object Store

While the ledger is the primary recovery mechanism, backing up the object store provides additional safety:

```bash
# Create a store backup script

#!/bin/bash
# backup_kamelot.sh
BACKUP_DIR="/backup/kamelot"
STORE_DIR="$HOME/kamelot_data"
DATE=$(date +%Y%m%d_%H%M%S)

# 1. Export ledger
kml ledger --format json --output "$BACKUP_DIR/ledger_$DATE.json"

# 2. Export config
cp "$STORE_DIR/config.toml" "$BACKUP_DIR/config_$DATE.toml"

# 3. Backup object store (encrypted files)
tar czf "$BACKUP_DIR/objects_$DATE.tar.gz" -C "$STORE_DIR" objects/

# 4. Backup ledger blocks
tar czf "$BACKUP_DIR/ledger_blocks_$DATE.tar.gz" -C "$STORE_DIR" ledger/

# 5. Backup keys (salt only, NOT the key itself)
cp "$STORE_DIR/keys/salt" "$BACKUP_DIR/salt_$DATE"

# 6. Create manifest
echo "Backup $DATE created" > "$BACKUP_DIR/MANIFEST_$DATE.txt"
kml status --json >> "$BACKUP_DIR/MANIFEST_$DATE.txt"

echo "Backup complete: $BACKUP_DIR"
```

### Backup the Master Passphrase

The master passphrase is the single point of failure. Without it, all backups are useless.

```bash
# Write it down physically and store in a safe
# Use a passphrase manager (Bitwarden, 1Password)
# Consider Shamir's Secret Sharing for multi-person recovery

# Example: Store passphrase hint (NOT the passphrase itself!)
echo "Hint: My favorite song lyrics + year of birth" > passphrase_hint.txt
```

### 3-2-1 Backup Strategy

Follow the 3-2-1 backup rule:

1. **3 copies** of your data (1 primary + 2 backups)
2. **2 different media types** (e.g., local SSD + external HDD)
3. **1 off-site copy** (e.g., backup to a friend's K-Swarm node)

```bash
# Copy 1: Local store (primary)
# Copy 2: External drive (weekly ledger export + object backup)
# Copy 3: Remote K-Swarm node (index sync)

# Configure K-Swarm node as backup target
kml kswarm peer add "backup@nas.local:9120" --name "Backup-NAS"
kml kswarm share --all --with Backup-NAS
```

### Testing Backups

```bash
# Test ledger restoration
kml init ./test_restore
kml ledger import ./backup/ledger_20260619.json

# Test file restoration
kml rollback --to-time "2026-06-18T00:00:00Z" --dry-run

# Full disaster recovery test (see next section)
```

## Disaster Recovery Plan

### Scenario: Complete Data Loss

If your entire Kamelot store is lost (drive failure, theft, etc.), follow this recovery procedure.

#### Prerequisites

You need:
1. Kamelot installed on the new machine
2. Your master passphrase
3. Your backup files (ledger export, object store backup, salt)

#### Step 1: Reinstall Kamelot

```bash
# Install Kamelot on the new machine
curl -fsSL https://kamelot.sh/install.sh | sudo bash
```

#### Step 2: Restore the Salt

```bash
# Copy the salt from backup
cp /backup/kamelot/salt_20260619 /new/kamelot_data/keys/salt
```

#### Step 3: Restore the Ledger

```bash
# Initialize a new store
kml init /new/kamelot_data

# Import the backed-up ledger
kml ledger import /backup/kamelot/ledger_20260619.json --force
```

#### Step 4: Restore Object Store

```bash
# Extract object store backup
tar xzf /backup/kamelot/objects_20260619.tar.gz -C /new/kamelot_data/

# Verify object integrity
kml status
# Should show all files present
```

#### Step 5: Rebuild Qdrant Index

```bash
# Qdrant index must be rebuilt from the restored ledger
kml rebuild --index
```

#### Step 6: Verify

```bash
# Full verification
kml ledger --verify

# List files
kml list

# Test search
kml query "test"
```

### Recovery Script

```bash
#!/bin/bash
# recover_kamelot.sh - Full disaster recovery

set -e

BACKUP_DIR="$1"
RESTORE_DIR="$2"

if [ -z "$BACKUP_DIR" ] || [ -z "$RESTORE_DIR" ]; then
    echo "Usage: $0 <backup_dir> <restore_dir>"
    exit 1
fi

echo "Starting Kamelot recovery from $BACKUP_DIR to $RESTORE_DIR"

# Find latest backup
LATEST_LEDGER=$(ls -t "$BACKUP_DIR"/ledger_*.json | head -1)
LATEST_OBJECTS=$(ls -t "$BACKUP_DIR"/objects_*.tar.gz | head -1)
LATEST_SALT=$(ls -t "$BACKUP_DIR"/salt_* | head -1)

echo "Using ledger: $LATEST_LEDGER"
echo "Using objects: $LATEST_OBJECTS"
echo "Using salt: $LATEST_SALT"

# Step 1: Install Kamelot (if not already)
if ! command -v kml &> /dev/null; then
    echo "Installing Kamelot..."
    curl -fsSL https://kamelot.sh/install.sh | sudo bash
fi

# Step 2: Init store
echo "Initializing store..."
mkdir -p "$RESTORE_DIR"
kml init "$RESTORE_DIR"

# Step 3: Restore salt
echo "Restoring salt..."
cp "$LATEST_SALT" "$RESTORE_DIR/keys/salt"

# Step 4: Import ledger
echo "Importing ledger..."
kml ledger import "$LATEST_LEDGER" --force --store "$RESTORE_DIR"

# Step 5: Restore objects
echo "Restoring objects..."
mkdir -p "$RESTORE_DIR/objects"
tar xzf "$LATEST_OBJECTS" -C "$RESTORE_DIR"

# Step 6: Rebuild index
echo "Rebuilding Qdrant index..."
kml rebuild --index --store "$RESTORE_DIR"

# Step 7: Verify
echo "Verifying recovery..."
kml --store "$RESTORE_DIR" status
kml --store "$RESTORE_DIR" list --count
kml --store "$RESTORE_DIR" ledger --verify

echo "Recovery complete!"
```

### Emergency Rollback Procedure

If you suspect ransomware or data corruption:

```bash
# 1. Isolate the machine (disconnect from network)
# 2. Do NOT run any kml commands that modify data
# 3. Check the ledger
kml ledger --verify

# 4. If ledger is intact, roll back
kml rollback --minutes 30 --dry-run
kml rollback --minutes 30

# 5. If ledger is corrupted, restore from backup (see above)

# 6. Change your master passphrase
kml config set crypto.change_passphrase
```

### Testing Your Disaster Recovery

```bash
# Monthly test procedure
#!/bin/bash
# test_disaster_recovery.sh

TEST_DIR="/tmp/kamelot_dr_test"
BACKUP_DIR="/backup/kamelot"

echo "Testing disaster recovery..."

# Clean up any previous test
rm -rf "$TEST_DIR"

# Run recovery
bash recover_kamelot.sh "$BACKUP_DIR" "$TEST_DIR"

# Verify
kml --store "$TEST_DIR" list --count
kml --store "$TEST_DIR" query "test" --model mock

# Clean up
rm -rf "$TEST_DIR"

echo "Disaster recovery test PASSED"
```

## Troubleshooting

### Rollback Fails

```bash
# Check error message
kml rollback --minutes 5

# Common errors:
# "Ledger integrity check failed" → Verify and repair ledger first
# "Store is locked" → Unlock the store
# "Qdrant connection failed" → Start Qdrant
# "Insufficient permissions" → Check file permissions

# Force rollback (bypass non-critical checks)
kml rollback --minutes 5 --force
```

### Rollback Takes Too Long

```bash
# For large stores, rollback can take time
# Monitor progress with --verbose
kml rollback --minutes 5 --verbose

# Time estimates:
# 1,000 files: ~1 second
# 10,000 files: ~10 seconds
# 100,000 files: ~2 minutes
# 1,000,000 files: ~20 minutes
```

### Partial Rollback Success

If some files fail to restore:

```bash
# Check what failed
kml status

# Retry failed operations
kml rollback --retry-failed

# Manually restore specific files
kml restore <inode>
```

### Ledger Corrupted

If `kml ledger --verify` fails:

```bash
# Find the corruption point
kml ledger --verify --verbose

# Roll back to before corruption
kml rollback --to-block <last_valid_block>

# If rollback also fails, restore from backup
# (see Disaster Recovery Plan)
```

### Rollback Undo

```bash
# A rollback can be undone by rolling forward
kml rollback --to-block <block_before_rollback>

# Example: If rollback was at block #13,
# roll back to block #12 to undo it
kml rollback --to-block 12
```

### Qdrant Inconsistency After Rollback

```bash
# Rebuild Qdrant index from ledger
kml rebuild --index

# Verify Qdrant vectors match ledger
kml status --vectors
```

### Out of Disk Space During Rollback

```bash
# Check available space
df -h

# Rollback requires temporary space for:
# - New block creation
# - Object store modifications

# Free up space or use --compact
kml rollback --minutes 5 --compact
```

---

*Next tutorial: [11 — Migration from NTFS/ext4](11-migration-from-ntfs-ext4.md)*

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

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ