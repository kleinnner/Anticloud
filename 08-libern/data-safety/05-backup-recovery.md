▄▄                     ██               ▄▄                                    
██                     ▀▀               ██                                    
██            ▄▄▄█   ████     █▄▄▄      ██▄███▄    ▄████▄    ██▄████  ██▄████▄
██        ▄▄█▀▀▀       ██       ▀▀▀█▄▄  ██▀  ▀██  ██▄▄▄▄██   ██▀      ██▀   ██
██        ▀▀█▄▄▄       ██       ▄▄▄█▀▀  ██    ██  ██▀▀▀▀▀▀   ██       ██    ██
██▄▄▄▄▄▄      ▀▀▀█  ▄▄▄██▄▄▄  █▀▀▀      ███▄▄██▀  ▀██▄▄▄▄█   ██       ██    ██
▀▀▀▀▀▀▀▀            ▀▀▀▀▀▀▀▀            ▀▀ ▀▀▀      ▀▀▀▀▀    ▀▀       ▀▀    ▀▀

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

────────────────────────────────────────────────────────────────

# Backup and Recovery

**Category:** Data Safety
**File:** 05-backup-recovery.md
**Revision:** 1.0

---

## Table of Contents

1. [Overview](#overview)
2. [What to Back Up](#what-to-back-up)
3. [Backing Up .aioss Files](#backing-up-aioss-files)
4. [Backing Up the SQLite Database](#backing-up-the-sqlite-database)
5. [Key Export and Recovery](#key-export-and-recovery)
6. [Full Backup Strategy](#full-backup-strategy)
7. [Recovery Procedures](#recovery-procedures)
8. [Automated Backup Configuration](#automated-backup-configuration)
9. [Disaster Scenarios](#disaster-scenarios)
10. [References](#references)

---

## Overview

Libern stores all data locally on the user's machine. This means backup and recovery are entirely under the user's control — there is no cloud provider holding a copy of your data. This document describes how to back up and restore the three critical components of Libern's data: **.aioss ledger files**, the **SQLite database**, and **Ed25519 private keys**.

Because Libern uses standard file formats (SQLite, JSON, binary ledgers, TXT logs), users can use any backup tool they prefer.

---

## What to Back Up

### 1. .aioss Ledger Files

- **Location:** `<app_data>/libern/ledgers/`
- **Content:** Binary (.aioss) + JSON (.aioss.json) audit trails
- **Critical:** Authoritative record of all conversations

### 2. SQLite Database

- **Location:** `<app_data>/libern/data.db`
- **Content:** All relational data (users, servers, messages, etc.)
- **Critical:** Primary data store

### 3. Ed25519 Private Key

- **Location:** Inside SQLite (encrypted) or exported file
- **Content:** 32-byte Ed25519 private seed
- **Critical:** Without it, cannot sign new messages

### 4. AI Model File

- **Location:** `<app_data>/libern/models/`
- **Content:** Qwen GGUF model (~1.1 GB)
- **Replaceable:** Can re-download, backing up saves bandwidth

---

## Backing Up .aioss Files

### Manual Backup

```bash
# Windows (PowerShell)
Copy-Item -Recurse "$env:APPDATA\libern\ledgers" "D:\backups\libern-ledgers-$(Get-Date -Format 'yyyyMMdd')"

# Linux/macOS
cp -r ~/.local/share/libern/ledgers ~/backups/libern-ledgers-$(date +%Y%m%d)
```

### Automated Backup Script

```bash
#!/bin/bash
BACKUP_DIR="$HOME/backups/libern"
DATE=$(date +%Y%m%d-%H%M%S)
mkdir -p "$BACKUP_DIR"
cp -r "$HOME/.local/share/libern/ledgers" "$BACKUP_DIR/ledgers-$DATE"
sqlite3 "$HOME/.local/share/libern/data.db" ".backup '$BACKUP_DIR/data-$DATE.db'"
libern export-key "$BACKUP_DIR/key-$DATE.libern-key"
libern verify-ledger "$BACKUP_DIR/ledgers-$DATE"/*.aioss
echo "Backup complete: $BACKUP_DIR"
```

### Verification

```rust
pub fn verify_any(bytes: &[u8]) -> Result<(bool, usize, usize), String> {
    if bytes.len() >= 5 && &bytes[0..5] == b"AIOSS" {
        verify_binary(&BinaryLedger::from_bytes(bytes)?)
    } else {
        verify_json(&serde_json::from_slice(bytes)?)
    }
}
```

---

## Backing Up the SQLite Database

### Live Backup (Safe)

```bash
sqlite3 "$env:APPDATA/libern/data.db" ".backup 'D:\backups\libern-data.db'"
```

### Cold Backup (Simplest)

```bash
Copy-Item "$env:APPDATA\libern\data.db" "D:\backups\libern-data-$(Get-Date -Format 'yyyyMMdd').db"
```

### Integrity Check

```sql
PRAGMA integrity_check;
PRAGMA quick_check;
```

### Restoring

```bash
Copy-Item "D:\backups\libern-data.db" "$env:APPDATA\libern\data.db"
```

---

## Key Export and Recovery

### Key Export Format

| Field | Size | Description |
|-------|------|-------------|
| Magic | 8 bytes | `"LIERNKEY"` |
| Version | 2 bytes | Format version (1) |
| Argon2id salt | 16 bytes | KDF salt |
| Argon2id params | 9 bytes | Iterations, memory, parallelism |
| Nonce | 12 bytes | AES-256-GCM nonce |
| Ciphertext | 48 bytes | Encrypted seed (32 + 16 padding) |
| Tag | 16 bytes | GCM authentication tag |

**Total:** 111 bytes

### Security Considerations

- Use a strong, unique passphrase (min 12 chars)
- Store key file offline (USB drive, printed QR code)
- Keep at least two copies in different physical locations
- No recovery if both key file and passphrase are lost

---

## Full Backup Strategy

| Frequency | What | How |
|-----------|------|-----|
| Daily | SQLite database | `.backup` command |
| Daily | .aioss ledgers | File copy |
| Weekly | Full backup | DB + ledgers + key, compressed |
| Monthly | Offline backup | External drive or cloud (user choice) |
| On identity creation | Key export | USB drive + QR code |

### Storage Requirements

| Component | Typical Size | Growth Rate |
|-----------|-------------|-------------|
| SQLite database | 10-100 MB | ~1-5 MB per 1000 messages |
| .aioss ledgers | 5-50 MB | ~265 bytes per entry |
| Key export | 111 bytes | Static |
| AI model | ~1.1 GB | Static (optional) |

---

## Recovery Procedures

### Scenario 1: Database Corruption

1. Stop Libern
2. Rename corrupted DB: `mv data.db data.db.corrupted`
3. Restore from latest backup
4. Verify .aioss ledgers against restored DB
5. Restart Libern

### Scenario 2: Full Data Loss

1. Install Libern on new machine
2. Restore SQLite database
3. Restore .aioss ledgers
4. Import Ed25519 private key
5. Launch Libern
6. Verify sessions with `verify_any`

### Scenario 3: Identity Loss Only

1. If key export exists: import the key file
2. If no backup: create new identity (past messages remain verifiable)

### Scenario 4: New Machine Setup

1. Install Libern
2. Copy .aioss ledgers (or sync via P2P)
3. Copy SQLite database (or let P2P rebuild)
4. Import Ed25519 private key

---

## Disaster Scenarios

| Scenario | Data Recoverable? | Identity Recoverable? | Mitigation |
|----------|-------------------|----------------------|-----------|
| Disk failure | Yes (if backed up) | Yes (if key exported) | Regular backups |
| Accidental deletion | Yes (from backup) | Yes (from key export) | Versioned backups |
| Ransomware | Yes (offline backup) | Yes (offline key) | Offline + cloud backup |
| Fire/theft | No (single location) | Yes (if key exported) | Remote backup |
| Forgotten passphrase | Data OK | No (identity lost) | Password manager |

---

## Backup Data Format Summary

| Component | Format | Typical Size | Verification Method |
|-----------|--------|-------------|-------------------|
| SQLite database | SQLite `.db` | 10-100 MB | `PRAGMA integrity_check` |
| .aioss binary | Custom binary | ~265B/entry | `verify_binary()` |
| .aioss JSON | JSON | ~1KB/entry | `verify_json()` |
| Ed25519 key | Encrypted binary | 111 bytes | SHA-256 checksum |
| AI model | GGUF | ~1.1 GB | SHA-256 checksum |
| Config | JSON | ~1 KB | Manual review |

### Backup Strategy Decision Matrix

| Factor | Local USB | Network Share | Cloud (encrypted) |
|--------|-----------|---------------|-------------------|
| Speed | Fast (USB 3.0) | Moderate (GigE) | Slow (upload speed) |
| Security | Physical control | Network auth | Encryption required |
| Disaster recovery | Offline copy | Remote copy | Geographic redundancy |
| Cost | Drive cost | Infrastructure | Storage fees |
| Automation | Script + cron | Script + cron | rclone/rsync |
| Verification | Manual or script | Script | Script |

## Cloud Backup Options (User-Controlled)

While Libern strongly recommends local-only backup for maximum privacy, users who choose to use cloud backup services can do so with the following considerations:

### Encrypted Cloud Backup

```bash
#!/bin/bash
# Encrypted cloud backup using rclone + age encryption
BACKUP_FILE="libern-backup-$(date +%Y%m%d).tar.gz.age"
PASSPHRASE_FILE="$HOME/.libern-backup-passphrase"

# Create temporary archive
tar -czf "/tmp/libern-backup.tar.gz" \
    "$HOME/.local/share/libern/ledgers" \
    "$HOME/.local/share/libern/data.db"

# Encrypt with age (passphrase-based)
age -p -o "/tmp/$BACKUP_FILE" "/tmp/libern-backup.tar.gz"

# Upload to cloud storage
rclone copy "/tmp/$BACKUP_FILE" "mydrive:libern-backups/"

# Securely delete local temporary files
shred -u "/tmp/libern-backup.tar.gz"
shred -u "/tmp/$BACKUP_FILE"

echo "Encrypted backup uploaded to cloud storage"
```

### Cloud Backup Security Checklist

- [ ] Encrypt before upload (age, GPG, or similar)
- [ ] Use strong passphrase (min 20 characters)
- [ ] Store passphrase separately from backup
- [ ] Verify download and decryption works
- [ ] Test restore procedure quarterly
- [ ] Document passphrase recovery process

## Disaster Recovery Plan Template

```markdown
# Libern Disaster Recovery Plan

## 1. Contact Information
- Data Owner: [Name]
- IT Support: [Name/Team]
- Emergency Contact: [Phone/Email]

## 2. Backup Locations
- Primary: [Local path, e.g., /backups/libern]
- Secondary: [Offsite path, e.g., USB drive in safe]
- Cloud (encrypted): [If applicable]

## 3. Recovery Procedures

### Scenario A: Single Machine Failure
1. Provision replacement machine
2. Install Libern from [installer location]
3. Restore database from [backup location]
4. Restore .aioss ledgers from [backup location]
5. Import identity key from [backup location]
6. Verify integrity with verify_any()

### Scenario B: Multiple Machine Failure
1. Prioritize recovery of machines with latest data
2. Restore databases from most recent backups
3. Use P2P sync to reconcile any data differences
4. Verify .aioss chain integrity on all machines

### Scenario C: Complete Data Loss (No Backup)
1. Install Libern on all machines
2. Create new identities (old identities are lost)
3. Rebuild servers and channels from documentation
4. Old .aioss files (if any remain) are still verifiable

## 4. Recovery Verification
After recovery, run:
- `verify_any()` on all .aioss files
- `PRAGMA integrity_check` on SQLite database
- Spot-check message Ed25519 signatures

## 5. Post-Recovery Tasks
- [ ] Document lessons learned
- [ ] Update backup procedures
- [ ] Test recovery again within 30 days
- [ ] Notify users of restored service
```

## Backup Monitoring and Alerts

```bash
#!/bin/bash
# libern-backup-monitor.sh — Monitor backup status
BACKUP_DIR="$HOME/backups/libern"
LATEST=$(ls -t "$BACKUP_DIR" 2>/dev/null | head -1)

if [ -z "$LATEST" ]; then
    echo "CRITICAL: No backups found"
    exit 2
fi

BACKUP_TIME=$(stat -c %Y "$BACKUP_DIR/$LATEST" 2>/dev/null || stat -f %m "$BACKUP_DIR/$LATEST" 2>/dev/null)
NOW=$(date +%s)
AGE=$(( (NOW - BACKUP_TIME) / 3600 ))

if [ $AGE -gt 48 ]; then
    echo "WARNING: Last backup was ${AGE}h ago (over 48h threshold)"
    exit 1
elif [ $AGE -gt 24 ]; then
    echo "OK: Last backup was ${AGE}h ago"
    exit 0
else
    echo "OK: Last backup was ${AGE}h ago"
    exit 0
fi
```

## Backup Encryption Standards

| Algorithm | Key Size | Purpose | Status |
|-----------|----------|---------|--------|
| AES-256-GCM | 256 bits | Key file encryption | ✓ Implemented |
| Argon2id | Variable | Passphrase-based KDF | ✓ Implemented |
| age (X25519 + ChaCha20-Poly1305) | 256 bits | File encryption | Recommended |
| GPG (RSA/AES) | Variable | File encryption | Alternative |

## Backup Verification Script

```bash
#!/bin/bash
# libern-backup-verify.sh — Verify all backed up data
BACKUP_DIR="${1:-$HOME/backups/libern/latest}"

echo "=== Libern Backup Verification ==="
echo "Backup directory: $BACKUP_DIR"
echo ""

# 1. Check SQLite integrity
echo "1. Checking SQLite database..."
DB_FILE="$BACKUP_DIR/data-*.db"
LATEST_DB=$(ls -t $DB_FILE 2>/dev/null | head -1)
if [ -n "$LATEST_DB" ]; then
    RESULT=$(sqlite3 "$LATEST_DB" "PRAGMA integrity_check;")
    if [ "$RESULT" = "ok" ]; then
        echo "   ✓ SQLite integrity: PASS"
    else
        echo "   ✗ SQLite integrity: FAIL ($RESULT)"
    fi
else
    echo "   ✗ No database backup found"
fi

# 2. Verify .aioss files
echo "2. Verifying .aioss ledgers..."
AIOSS_COUNT=0
AIOSS_PASS=0
for f in "$BACKUP_DIR"/ledgers-*/*.aioss; do
    [ -f "$f" ] || continue
    AIOSS_COUNT=$((AIOSS_COUNT + 1))
    if libern-tools verify "$f" --quiet 2>/dev/null; then
        AIOSS_PASS=$((AIOSS_PASS + 1))
    fi
done
echo "   ✓ $AIOSS_PASS/$AIOSS_COSS .aioss files verified"

# 3. Verify key file
echo "3. Checking key file..."
KEY_FILE="$BACKUP_DIR/key-*.libern-key"
LATEST_KEY=$(ls -t $KEY_FILE 2>/dev/null | head -1)
if [ -n "$LATEST_KEY" ]; then
    SIZE=$(stat -c%s "$LATEST_KEY" 2>/dev/null || stat -f%z "$LATEST_KEY" 2>/dev/null)
    if [ "$SIZE" -eq 111 ]; then
        echo "   ✓ Key file size correct (111 bytes)"
    else
        echo "   ⚠ Key file size unexpected ($SIZE bytes, expected 111)"
    fi
else
    echo "   ✗ No key file found"
fi

echo ""
echo "=== Backup Verification Complete ==="
```

## Automated Backup with Systemd Timer

```ini
# /etc/systemd/system/libern-backup.service
[Unit]
Description=Libern daily backup
After=network.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/libern-backup.sh
User=libern
Group=libern

[Install]
WantedBy=multi-user.target
```

```ini
# /etc/systemd/system/libern-backup.timer
[Unit]
Description=Run Libern backup daily at 2 AM

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

## Backup Encryption

For sensitive deployments, encrypt backups:

```bash
#!/bin/bash
# Encrypted backup with age encryption
BACKUP_FILE="libern-backup-$(date +%Y%m%d).tar.gz"
ENCRYPTED_FILE="${BACKUP_FILE}.age"

# Create archive
tar -czf "$BACKUP_FILE" \
    ~/.local/share/libern/ledgers \
    ~/.local/share/libern/data.db \
    ~/backups/libern-key.libern-key

# Encrypt with age (public key encryption)
age -r "age1..." -o "$ENCRYPTED_FILE" "$BACKUP_FILE"

# Securely delete unencrypted archive
shred -u "$BACKUP_FILE"

echo "Encrypted backup: $ENCRYPTED_FILE"
```

## Recovery Time Objectives (RTO)

| Scenario | Recovery Time | Data Loss |
|----------|--------------|-----------|
| Database corruption | < 5 minutes | Up to last backup |
| Full disk failure | < 1 hour (with backup) | Up to last backup |
| Accidental message deletion | < 1 minute (from .aioss) | Message-specific |
| Key loss (with backup) | < 10 minutes | None |
| Key loss (no backup) | N/A | Identity permanently lost |
| New machine setup | < 30 minutes | None (with backup) |

## References

- `crates/libern-aioss/src/verify.rs` — verify_any, verify_json, verify_binary
- `crates/libern-aioss/src/reader.rs` — read_binary, read_json
- `crates/libern-aioss/src/writer.rs` — write_binary, write_json
- `crates/libern-core/src/db/mod.rs` — Database::new, SQLite initialization
- `crates/libern-aioss/src/state_proof.rs` — Ed25519 key generation

────────────────────────────────────────────────────────────────

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
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