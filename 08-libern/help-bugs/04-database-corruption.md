▄▄                     ██               ▄▄                                    
██                     ▀▀               ██                                    
██            ▄▄▄█   ████     █▄▄▄      ██▄███▄    ▄████▄    ██▄████  ██▄████▄
██        ▄▄█▀▀▀       ██       ▀▀▀█▄▄  ██▀  ▀██  ██▄▄▄▄██   ██▀      ██▀   ██
██        ▀▀█▄▄▄       ██       ▄▄▄█▀▀  ██    ██  ██▀▀▀▀▀▀   ██       ██    ██
██▄▄▄▄▄▄      ▀▀▀█  ▄▄▄██▄▄▄  █▀▀▀      ███▄▄██▀  ▀██▄▄▄▄█   ██       ██    ██
▀▀▀▀▀▀▀▀            ▀▀▀▀▀▀▀▀            ▀▀ ▀▀▀      ▀▀▀▀▀    ▀▀       ▀▀    ▀▀

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.
Document version: 1.0.0 | Updated: 2026-06-19
Category: help-bugs | ID: LIB-HLP-004

────────────────────────────────────────────────────────────────

# Database Corruption

## 1. Overview

Libern uses SQLite as its local database engine for storing messages, server configuration, user identities, and metadata. The .aioss ledger provides an additional layer of cryptographic integrity verification. SQLite is known for its robustness, but corruption can still occur due to hardware failures, power loss, file system issues, or software bugs.

This guide covers:
1. Detecting database corruption
2. Understanding WAL (Write-Ahead Log) issues
3. Recovering from corruption
4. Prevention strategies
5. .aioss ledger integrity verification

### Database Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Libern Storage Architecture                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  SQLite Database (libern.db)                            │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Tables: users, servers, channels, messages,      │   │
│  │         roles, invites, xp, marketplace, etc.     │   │
│  │ Journal Mode: WAL (Write-Ahead Log)              │   │
│  │ Files: libern.db, libern.db-wal, libern.db-shm   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  .aioss Ledger Files                                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Binary format with SHA3-256 hash chain           │   │
│  │ Provides tamper-evident audit trail              │   │
│  │ Can be used for recovery                         │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  CRDT State                                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Peer-to-peer sync state                           │   │
│  │ Can restore data from healthy peers              │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Detecting Database Corruption

### Common Symptoms

- Libern fails to start or crashes on launch
- Messages appear garbled, truncated, or contain unexpected characters
- Error messages: "database disk image is malformed"
- Missing messages, channels, or servers
- Application freezes when accessing certain data
- "SQL logic error" or "database or disk is full" errors

### Automatic Detection

Libern performs automatic integrity checks:
- On startup: Quick integrity check of the SQLite database
- Periodic checks: Configurable interval for full integrity verification
- On sync: CRDT validation ensures data consistency across peers

### Manual Integrity Check

You can manually check database integrity:

**Using Libern CLI:**
```
libern --check-db
```

**Using SQLite CLI:**
```
sqlite3 ~/.local/share/libern/libern.db "PRAGMA integrity_check;"
sqlite3 ~/.local/share/libern/libern.db "PRAGMA quick_check;"
```

**Expected output:**
```
ok
```

Any other output indicates corruption.

---

## 3. WAL (Write-Ahead Log) Issues

### How Libern Uses WAL

Libern configures SQLite in WAL (Write-Ahead Log) mode for better concurrent read/write performance. The WAL file (`libern.db-wal`) and shared memory file (`libern.db-shm`) are auxiliary files that work with the main database.

### WAL File Corruption

**Symptoms:**
- Database opens but data is inconsistent
- "malformed database" errors that appear/disappear
- Application can read but not write data

**Solutions:**

**Checkpoint the WAL:**
```
sqlite3 libern.db "PRAGMA wal_checkpoint(TRUNCATE);"
```
This writes the WAL contents to the main database and truncates the WAL file.

**If checkpoint fails:**
1. Stop Libern
2. Backup all three files: `libern.db`, `libern.db-wal`, `libern.db-shm`
3. Delete the WAL and SHM files: `rm libern.db-wal libern.db-shm`
4. Run integrity check: `sqlite3 libern.db "PRAGMA integrity_check;"`
5. If integrity passes, restart Libern

---

## 4. Recovering from Corruption

### Manual Recovery Steps

**Step 1: Stop Libern**
Ensure Libern is completely closed.

**Step 2: Backup the database**
```
cp libern.db libern.db.corrupted-backup
cp libern.db-wal libern.db-wal.corrupted-backup
```

**Step 3: Attempt SQLite recovery**
```
sqlite3 libern.db ".recover" | sqlite3 libern-recovered.db
```
This uses SQLite's built-in recovery to extract as much data as possible.

**Step 4: Verify the recovered database**
```
sqlite3 libern-recovered.db "PRAGMA integrity_check;"
```

**Step 5: Compare data counts**
```
sqlite3 libern.db.corrupted-backup "SELECT count(*) FROM messages;" 2>/dev/null
sqlite3 libern-recovered.db "SELECT count(*) FROM messages;"
```

**Step 6: Replace the database**
If recovery succeeded:
```
mv libern.db libern.db.original
mv libern-recovered.db libern.db
```

### Using .aioss Ledger for Recovery

The .aioss ledger can be used to reconstruct the database:

1. Export the latest .aioss ledger (if accessible)
2. Reconstruct the database from the ledger:
   ```
   libern --recover-from-ledger /path/to/export.aioss
   ```

---

## 5. Prevention Strategies

### Regular Backups

Configure automatic backups:
```json
{
  "database": {
    "backup_enabled": true,
    "backup_interval_hours": 24,
    "backup_count": 7,
    "backup_directory": "/path/to/backups"
  }
}
```

### Hardware Considerations

- Use reliable storage (SSD over HDD for better random write performance)
- Ensure stable power supply (use UPS for critical deployments)
- Monitor disk health (SMART status, bad sectors)

---

## 6. Error Messages Reference

| Error | Meaning | Action |
|-------|---------|--------|
| "database disk image is malformed" | Database corruption detected | Run integrity check and recovery |
| "database or disk is full" | No space for writes | Free disk space |
| "unable to open database file" | File permissions or path issue | Check file permissions |
| "SQL logic error" | Query error (may indicate corruption) | Check database integrity |
| "no such table" | Schema missing or corrupted | Try recovery from .aioss |
| "disk I/O error" | Physical disk problem | Check disk health |
| "file is not a database" | Not a valid SQLite file | Check file path, try recovery |

---

## 7. Recovery Decision Tree

```
Database problem detected
    │
    ├── "malformed" error?
    │   ├── Run PRAGMA integrity_check
    │   ├── Backup DB
    │   ├── Try ".recover" command
    │   └── If fails → recover from .aioss
    │
    ├── "disk full" error?
    │   ├── Free disk space
    │   └── Run checkpoint
    │
    ├── WAL issues?
    │   ├── Try checkpoint
    │   ├── Delete WAL/SHM files
    │   └── Restart Libern
    │
    └── No backup available?
        ├── Recover from peer via CRDT sync
        └── Last resort: delete DB and start fresh
```

---

## 8. SQLite Diagnostic Commands

### Quick Health Check

```bash
# Run all basic checks
sqlite3 libern.db "PRAGMA integrity_check;"
sqlite3 libern.db "PRAGMA quick_check;"
sqlite3 libern.db "PRAGMA foreign_key_check;"
```

### Database Statistics

```bash
# Get database size info
sqlite3 libern.db "PRAGMA page_count;"
sqlite3 libern.db "PRAGMA page_size;"
sqlite3 libern.db "PRAGMA freelist_count;"

# Calculate actual database size in bytes
sqlite3 libern.db "SELECT page_count * page_size / 1024 || ' KB' FROM pragma_page_count, pragma_page_size;"

# Table row counts
sqlite3 libern.db "SELECT 'messages', COUNT(*) FROM messages
  UNION ALL SELECT 'servers', COUNT(*) FROM servers
  UNION ALL SELECT 'channels', COUNT(*) FROM channels
  UNION ALL SELECT 'users', COUNT(*) FROM users
  UNION ALL SELECT 'roles', COUNT(*) FROM roles;"
```

### WAL Status

```bash
# Check WAL mode
sqlite3 libern.db "PRAGMA journal_mode;"

# Check checkpoint status
sqlite3 libern.db "PRAGMA wal_checkpoint;"

# Force checkpoint
sqlite3 libern.db "PRAGMA wal_checkpoint(TRUNCATE);"
```

---

## 9. Automatic Backup Configuration

### Libern Configuration

```json
{
  "database": {
    "backup_enabled": true,
    "backup_interval_hours": 24,
    "backup_count": 7,
    "backup_directory": "C:/Users/YourName/LibernBackups",
    "backup_compress": true,
    "backup_on_shutdown": true
  }
}
```

### Manual Backup Scripts

**Windows (PowerShell):**
```powershell
$date = Get-Date -Format "yyyyMMdd_HHmmss"
$source = "$env:APPDATA\com.libern.app\data\libern.db"
$dest = "D:\Backups\libern_$date.db"
Copy-Item $source $dest
Write-Output "Backup saved to $dest"
```

**macOS/Linux:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
SOURCE="$HOME/.local/share/com.libern.app/libern.db"
DEST="$HOME/Backups/libern_$DATE.db"
cp "$SOURCE" "$DEST"
echo "Backup saved to $DEST"
```

### Backup Rotation

It's recommended to keep:
- **Last 24 hours**: Hourly backups
- **Last 7 days**: Daily backups
- **Last 4 weeks**: Weekly backups
- **Older**: Monthly backups

The `backup_count` setting controls automatic rotation (oldest deleted first).

---

## 10. .aioss Export as Backup Strategy

The .aioss ledger provides an additional backup layer:

```
Backup Strategy Hierarchy:
┌──────────────────────────────────────────┐
│  Level 1: Live SQLite database          │
│  (primary, always available)            │
├──────────────────────────────────────────┤
│  Level 2: SQLite backup (hourly/daily)  │
│  (point-in-time snapshots)              │
├──────────────────────────────────────────┤
│  Level 3: .aioss sealed sessions        │
│  (cryptographic audit trail, compact)   │
├──────────────────────────────────────────┤
│  Level 4: CRDT peer state               │
│  (distributed across LAN peers)         │
└──────────────────────────────────────────┘
```

### Recovering from .aioss Alone

If your SQLite database is completely lost but you have .aioss files:

```bash
# 1. Export the ledger
libern --recover-from-ledger /path/to/export.aioss

# 2. This creates a new SQLite database
#    with all captured data

# 3. Data not yet sealed in .aioss is lost
#    (unsealed session data)
```

---

## 11. Database Corruption Prevention Checklist

### Routine Maintenance

```
Daily:
☐ Check disk space (libern --db-stats)
☐ Verify last backup was successful

Weekly:
☐ Run integrity check (libern --check-db)
☐ Verify .aioss sessions are sealing properly
☐ Clean old .aioss exports (> 90 days)

Monthly:
☐ Vacuum database (libern --vacuum-db)
☐ Review backup rotation
☐ Check storage health (SMART status on SSD/HDD)
```

### Best Practices

1. **Use SSD** for better random write performance
2. **Ensure stable power** (UPS for critical deployments)
3. **Close Libern properly** — use the quit command, don't force-kill
4. **Keep backups** in a separate location from the live database
5. **Monitor disk space** — low disk space can cause corruption
6. **Update regularly** — newer versions may have bug fixes
7. **Keep .aioss exports** as secondary backup

---

## 12. Database Schema Verification

### Checking Table Structure

```bash
# List all tables
sqlite3 libern.db ".tables"

# Show schema for a table
sqlite3 libern.db ".schema messages"

# Show all schemas
sqlite3 libern.db ".schema"

# Check table row counts
sqlite3 libern.db "SELECT name FROM sqlite_master WHERE type='table';"
```

### Expected Tables

The health database should contain these tables (created by `CREATE_TABLES` in `schema.rs`):

- `users`
- `servers`
- `channels`
- `messages`
- `message_reactions`
- `pinned_messages`
- `roles`
- `role_assignments`
- `invites`
- `user_xp`
- `casino_balances`
- `prediction_markets`
- `prediction_bets`
- `marketplace_items`
- `marketplace_likes`
- `quiz_scores`
- `ai_conversations`
- `document_chunks`
- `aioss_sessions`
- `health_logs`
- `server_stats`
- `starboard_config`
- `audio_nodes`
- `world_decals`

If any table is missing, the database schema is corrupted.

---

## 13. Database Maintenance Script

### Windows Maintenance Script

```powershell
# libern-db-maintenance.ps1
$DB_PATH = "$env:APPDATA\com.libern.app\data\libern.db"
$BACKUP_DIR = "$env:USERPROFILE\LibernBackups"
$DATE = Get-Date -Format "yyyyMMdd_HHmmss"

Write-Host "=== Libern Database Maintenance ==="

# Ensure Libern is closed
$proc = Get-Process libern -ErrorAction SilentlyContinue
if ($proc) {
    Write-Host "⚠️ Please close Libern before running maintenance."
    exit 1
}

# Step 1: Backup
Write-Host "`n1. Creating backup..."
New-Item -ItemType Directory -Force -Path $BACKUP_DIR | Out-Null
Copy-Item $DB_PATH "$BACKUP_DIR\libern_$DATE.db" -Force
Write-Host "   ✅ Backup: $BACKUP_DIR\libern_$DATE.db"

# Step 2: Integrity Check
Write-Host "`n2. Running integrity check..."
$result = & sqlite3 $DB_PATH "PRAGMA integrity_check;"
if ($result -eq "ok") {
    Write-Host "   ✅ Integrity check passed"
} else {
    Write-Host "   ❌ Corruption detected: $result"
    Write-Host "   Attempting recovery..."
    & sqlite3 $DB_PATH ".recover" | & sqlite3 "$DB_PATH.recovered"
    Write-Host "   Recovery complete. Check: $DB_PATH.recovered"
}

# Step 3: Vacuum (Compact)
Write-Host "`n3. Vacuuming database..."
& sqlite3 $DB_PATH "VACUUM;"
Write-Host "   ✅ Database compacted"

# Step 4: Reindex
Write-Host "`n4. Reindexing..."
& sqlite3 $DB_PATH "REINDEX;"
Write-Host "   ✅ Indexes rebuilt"

# Step 5: Statistics
Write-Host "`n5. Database statistics..."
$size = (Get-Item $DB_PATH).Length / 1MB
$tables = & sqlite3 $DB_PATH "SELECT COUNT(*) FROM sqlite_master WHERE type='table';"
Write-Host "   Size: $([math]::Round($size, 2)) MB"
Write-Host "   Tables: $tables"

Write-Host "`n=== Maintenance Complete ==="
```

### macOS/Linux Maintenance Script

```bash
#!/bin/bash
# libern-db-maintenance.sh
DB_PATH="$HOME/.local/share/com.libern.app/libern.db"
BACKUP_DIR="$HOME/LibernBackups"
DATE=$(date +%Y%m%d_%H%M%S)

echo "=== Libern Database Maintenance ==="

# Check Libern is closed
if pgrep libern > /dev/null; then
    echo "⚠️ Please close Libern before running maintenance."
    exit 1
fi

# Step 1: Backup
echo -e "\n1. Creating backup..."
mkdir -p "$BACKUP_DIR"
cp "$DB_PATH" "$BACKUP_DIR/libern_$DATE.db"
echo "   ✅ Backup: $BACKUP_DIR/libern_$DATE.db"

# Step 2: Integrity Check
echo -e "\n2. Running integrity check..."
RESULT=$(sqlite3 "$DB_PATH" "PRAGMA integrity_check;")
if [ "$RESULT" = "ok" ]; then
    echo "   ✅ Integrity check passed"
else
    echo "   ❌ Corruption detected: $RESULT"
    echo "   Attempting recovery..."
    sqlite3 "$DB_PATH" ".recover" | sqlite3 "${DB_PATH}.recovered"
    echo "   Recovery complete. Check: ${DB_PATH}.recovered"
fi

# Step 3: Vacuum
echo -e "\n3. Vacuuming database..."
sqlite3 "$DB_PATH" "VACUUM;"
echo "   ✅ Database compacted"

# Step 4: Reindex
echo -e "\n4. Reindexing..."
sqlite3 "$DB_PATH" "REINDEX;"
echo "   ✅ Indexes rebuilt"

# Step 5: Statistics
echo -e "\n5. Database statistics..."
SIZE=$(du -h "$DB_PATH" | cut -f1)
TABLES=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM sqlite_master WHERE type='table';")
echo "   Size: $SIZE"
echo "   Tables: $TABLES"

echo -e "\n=== Maintenance Complete ==="
```

────────────────────────────────────────────────────────────────

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

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
