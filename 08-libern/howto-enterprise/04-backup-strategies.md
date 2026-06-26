__                     ¦¦               __                                    
¦¦                     ¯¯               ¦¦                                    
¦¦            ___¦   ¦¦¦¦     ¦___      ¦¦_¦¦¦_    _¦¦¦¦_    ¦¦_¦¦¦¦  ¦¦_¦¦¦¦_
¦¦        __¦¯¯¯       ¦¦       ¯¯¯¦__  ¦¦¯  ¯¦¦  ¦¦____¦¦   ¦¦¯      ¦¦¯   ¦¦
¦¦        ¯¯¦___       ¦¦       ___¦¯¯  ¦¦    ¦¦  ¦¦¯¯¯¯¯¯   ¦¦       ¦¦    ¦¦
¦¦______      ¯¯¯¦  ___¦¦___  ¦¯¯¯      ¦¦¦__¦¦¯  ¯¦¦____¦   ¦¦       ¦¦    ¦¦
¯¯¯¯¯¯¯¯            ¯¯¯¯¯¯¯¯            ¯¯ ¯¯¯      ¯¯¯¯¯    ¯¯       ¯¯    ¯¯

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

Document Version: 1.0.0
Category: Enterprise Administration Guide
Document ID: ENT-004
Last Updated: 2026-06-19

----------------------------------------------------------------

# Backup Strategies

## Introduction

Backing up Libern data is critical for enterprise deployments. Unlike cloud-based platforms where the vendor manages data redundancy, Libern stores all data locally on each user's machine. This guide covers comprehensive backup strategies for Libern's three data stores: .aioss session ledgers (tamper-evident audit trail), the SQLite database (messages, users, servers, roles), and user Ed25519 keypairs (identity).

By the end of this guide, you will be able to:
- Back up .aioss session files for compliance and audit
- Back up the SQLite database for full data recovery
- Implement user key backup and recovery procedures
- Automate backup processes for enterprise deployment
- Restore from backup in case of data loss

---

## Part 1: Understanding Libern's Data Stores

### Three Independent Data Stores

Libern maintains three separate data stores, each with different backup requirements:

| Data Store | Location | Contents | Criticality |
|------------|----------|----------|-------------|
| .aioss ledgers | {app_data}/aioss/ | Tamper-evident hash chain of all actions | High (compliance) |
| SQLite database | {app_data}/libern.db | Messages, users, servers, channels, roles, XP, marketplace | High (operations) |
| User keys | {app_data}/keys/{user_id}.key | Encrypted Ed25519 private key | Critical (identity) |

### Backup Priority

1. **Critical**: User keys (without these, identity is lost forever).
2. **High**: .aioss ledgers (compliance and audit requirements).
3. **High**: SQLite database (full operational data recovery).
4. **Medium**: AI model file (can be re-downloaded).
5. **Low**: Cache and temporary files (can be regenerated).

---

## Part 2: Backing Up .aioss Sessions

### What to Back Up

`
{app_data}/aioss/
+-- chat/{session_id}_{timestamp}.aioss          # Binary format
+-- chat/{session_id}_{timestamp}.aioss.json     # JSON format (when sealed)
+-- system/{session_id}_{timestamp}.aioss
+-- ai/{session_id}_{timestamp}.aioss
+-- games/{session_id}_{timestamp}.aioss
`

### Backup Frequency

| Environment | Frequency | Retention |
|-------------|-----------|-----------|
| Development | Weekly | 30 days |
| Standard | Daily | 90 days |
| Compliance-heavy | Every seal (per-minute) | 7 years |
| Regulated (HIPAA/SOX) | Real-time continuous | Indefinite |

### Manual Backup

`ash
# Copy all .aioss files to backup directory
robocopy "%APPDATA%\com.libern.app\data\aioss" "D:\backups\libern\aioss" /E /COPY:DAT

# Or using tar (PowerShell)
tar -czf "libern-aioss-backup-20260619.tar.gz" 
    -C "C:\Users\firha\AppData\Roaming\com.libern.app\data" aioss
`

### Automated Backup Script (PowerShell)

`powershell
# backup-libern-aioss.ps1
param(
    [string] = "D:\backups\libern",
    [int] = 90
)

 = Get-Date -Format "yyyyMMdd-HHmmss"
 = "C:\Users\firha\AppData\Roaming\com.libern.app\data\aioss"

if (-not (Test-Path )) {
    Write-Warning "Libern app data not found at "
    exit 0
}

 = Join-Path -Path  -ChildPath "aioss"
New-Item -ItemType Directory -Path  -Force | Out-Null

# Create backup
 = Join-Path -Path  -ChildPath "aioss-.tar.gz"
tar -czf  -C "C:\Users\firha\AppData\Roaming\com.libern.app\data" aioss

Write-Host "Backup created: "

# Generate checksum
 = Get-FileHash -Path  -Algorithm SHA256
 | Export-Csv -Path ".sha256" -NoTypeInformation

# Verify integrity
 = Get-FileHash -Path  -Algorithm SHA256
if (.Hash -eq .Hash) {
    Write-Host "Checksum verified: "
} else {
    Write-Error "Checksum mismatch!"
}

# Cleanup old backups
 = Get-ChildItem -Path  -Filter "*.tar.gz" |
    Where-Object { .LastWriteTime -lt (Get-Date).AddDays(-) }

foreach ( in ) {
    Remove-Item -Path .FullName -Force
    Remove-Item -Path ".sha256" -Force -ErrorAction SilentlyContinue
    Write-Host "Removed old backup: "
}

Write-Host "Backup complete. Retention:  days."
`

### Verifying .aioss Backup Integrity

`	ypescript
// Verify all .aioss files in a backup
import { verifyAiossFile } from "./lib/api";
import * as fs from "fs";
import * as path from "path";

function verifyBackupIntegrity(backupPath: string) {
    const files = fs.readdirSync(backupPath, { recursive: true })
        .filter((f: string) => f.endsWith(".aioss"));

    for (const file of files) {
        const fullPath = path.join(backupPath, file);
        const result = verifyAiossFile(fullPath);
        console.log(${file}: verified=, entries=);
    }
}
`

---

## Part 3: Backing Up the SQLite Database

### Database File Location

| Platform | Path |
|----------|------|
| Windows | %APPDATA%\com.libern.app\data\libern.db |
| macOS | ~/Library/Application Support/com.libern.app/libern.db |
| Linux | ~/.local/share/com.libern.app/libern.db |

### Backup Considerations

- SQLite uses WAL (Write-Ahead Logging) mode for performance.
- Simply copying the file while the app is running may result in a corrupted backup.
- The libern.db-wal and libern.db-shm files accompany the main database during active use.

### Safe Backup Procedure

`powershell
# Safe SQLite backup using checkpoint
function Backup-LibernDatabase {
    param(
        [string] = "D:\backups\libern\db"
    )

     = "C:\Users\firha\AppData\Roaming\com.libern.app\data\libern.db"
     = Get-Date -Format "yyyyMMdd-HHmmss"

    New-Item -ItemType Directory -Path  -Force | Out-Null

    # Method 1: Checkpoint WAL and copy (safe if app is not writing)
    # First, ensure WAL is checkpointed
    & sqlite3.exe "" "PRAGMA wal_checkpoint(TRUNCATE);"

    # Copy the database file
     = Join-Path -Path  -ChildPath "libern-.db"
    Copy-Item -Path  -Destination  -Force

    Write-Host "Database backup: "

    # Method 2: Use .backup command (safer, works while app is running)
     = Join-Path -Path  -ChildPath "libern--online.db"
    & sqlite3.exe "" ".backup ''"

    Write-Host "Online backup: "

    # Verify backup
    & sqlite3.exe "" "PRAGMA integrity_check;"
    if ( -eq 0) {
        Write-Host "Database integrity verified."
    }
}
`

### Automated Backup with Verification

`powershell
# Schedule this with Task Scheduler for daily backups
 = New-ScheduledTaskAction -Execute "PowerShell.exe" 
    -Argument "-File C:\scripts\backup-libern-db.ps1"
 = New-ScheduledTaskTrigger -Daily -At 2:00AM
 = New-ScheduledTaskPrincipal -UserId "SYSTEM" -RunLevel Highest
Register-ScheduledTask -TaskName "Libern Database Backup" 
    -Action  -Trigger  -Principal 
`

### Exporting Specific Data

`ash
# Export messages for a specific channel
sqlite3 libern.db "SELECT content, created_at FROM messages WHERE channel_id = 'ch-uuid';" > channel-export.csv

# Export user list
sqlite3 libern.db "SELECT id, display_name, created_at FROM users;" > users-export.csv

# Export server statistics
sqlite3 libern.db "SELECT * FROM server_stats;" > server-stats-export.csv
`

---

## Part 4: Backing Up User Keys

### Why Key Backup is Critical

The user's Ed25519 private key is their identity in Libern. Without it:
- They cannot prove ownership of their messages.
- They cannot access servers they created.
- Their identity is permanently lost.

### User-Initiated Key Export

`	ypescript
// Export identity from the application
const exportData = await exportIdentity("strong-password");
// Save exportData to a file

// The exported JSON contains:
// {
//   "user_id": "uuid",
//   "display_name": "Alice",
//   "public_key": "hex...",
//   "encrypted_private_key": "base64...",
//   "created_at": "2026-06-19T12:00:00Z"
// }
`

### Enterprise Key Backup Script

`powershell
# backup-libern-keys.ps1
param(
    [string] = "D:\backups\libern\keys",
    [string]
)

if (-not ) {
    Write-Error "Encryption password is required."
    exit 1
}

 = "C:\Users\firha\AppData\Roaming\com.libern.app\data\keys"
if (-not (Test-Path )) {
    Write-Warning "No keys directory found."
    exit 0
}

 = Get-Date -Format "yyyyMMdd-HHmmss"
New-Item -ItemType Directory -Path  -Force | Out-Null

# Encrypt and backup each key file
 = Get-ChildItem -Path  -Filter "*.key"
foreach ( in ) {
     = Join-Path -Path  -ChildPath "-.key.enc"

    # Encrypt with AES-256-CBC using OpenSSL
    & openssl enc -aes-256-cbc -salt -in .FullName -out  
        -pass pass: -pbkdf2

    Write-Host "Backed up:  -> "
}

# Generate checksums
Get-ChildItem -Path  -Filter "*.enc" | ForEach-Object {
     = Get-FileHash -Path .FullName -Algorithm SHA256
    Write-Host ": "
}
`

### Key Export Policy Recommendations

1. **Require key export on first launch**: Configure Libern to prompt users to export their key during onboarding.
2. **Store backups securely**: Key backups should be encrypted and stored in a secure location (HSM, encrypted network share, physical safe).
3. **Test restoration**: Periodically verify that key backups can be restored.
4. **Document the password**: The export password must be documented and stored securely (password manager, sealed envelope).
5. **Multi-party recovery**: For enterprise escrow, require M-of-N authorization for key recovery.

---

## Part 5: Full System Backup

### Comprehensive Backup Script

`powershell
# full-backup-libern.ps1
param(
    [string] = "D:\backups\libern",
    [string],
    [switch]
)

 = Get-Date -Format "yyyyMMdd-HHmmss"
 = "C:\Users\firha\AppData\Roaming\com.libern.app\data"
 = Join-Path -Path  -ChildPath 

Write-Host "Starting full Libern backup to ..."

# Create backup directory structure
New-Item -ItemType Directory -Path "\aioss" -Force | Out-Null
New-Item -ItemType Directory -Path "\db" -Force | Out-Null
New-Item -ItemType Directory -Path "\keys" -Force | Out-Null

# 1. Backup .aioss sessions
Write-Host "Backing up .aioss sessions..."
if (Test-Path "\aioss") {
    Copy-Item -Path "\aioss\*" -Destination "\aioss\" -Recurse -Force
}

# 2. Backup SQLite database
Write-Host "Backing up database..."
 = "\libern.db"
if (Test-Path ) {
    & sqlite3.exe "" ".backup '\db\libern.db'"
    & sqlite3.exe "\db\libern.db" "PRAGMA integrity_check;"
}

# 3. Backup user keys
Write-Host "Backing up keys..."
if ((Test-Path "\keys") -and ) {
    Get-ChildItem -Path "\keys" -Filter "*.key" | ForEach-Object {
         = Join-Path -Path "\keys" -ChildPath ".enc"
        & openssl enc -aes-256-cbc -salt -pbkdf2 -in .FullName -out  -pass pass:
    }
}

# 4. Optionally backup AI model
if () {
    Write-Host "Backing up AI model..."
     = "\models"
    if (Test-Path ) {
        Copy-Item -Path "\*" -Destination "\models\" -Recurse -Force
    }
}

# 5. Create manifest
 = @{
    backup_timestamp = 
    libern_version = "0.1.0"
    includes_aioss = True
    includes_db = True
    includes_keys = ( -ne )
    includes_ai_model = 
    machine_name = 01-ALEPH
    user_name = firha
} | ConvertTo-Json
 | Out-File -FilePath "\manifest.json" -Encoding UTF8

# 6. Create full archive and checksum
Write-Host "Creating archive..."
 = Join-Path -Path  -ChildPath "libern-full-.tar.gz"
tar -czf  -C  

 = Get-FileHash -Path  -Algorithm SHA256
.Hash | Out-File -FilePath ".sha256" -Encoding UTF8

# 7. Clean up temporary directory
Remove-Item -Path  -Recurse -Force

Write-Host "Backup complete: "
Write-Host "Checksum: "
`

---

## Part 6: Restoring from Backup

### Restoring .aioss Sessions

`ash
# Extract .aioss files from backup
tar -xzf "libern-full-20260619-020000.tar.gz"
# Copy the aioss directory back to app data
Copy-Item -Path ".\20260619-020000\aioss\*" -Destination "C:\Users\firha\AppData\Roaming\com.libern.app\data\aioss\" -Recurse -Force

# Verify restored sessions
# Open Compliance dashboard and click "Verify" on each session
`

### Restoring the SQLite Database

`ash
# Stop Libern first
# Replace the database file
Copy-Item -Path ".\20260619-020000\db\libern.db" -Destination "C:\Users\firha\AppData\Roaming\com.libern.app\data\libern.db" -Force

# Verify integrity
& sqlite3.exe "C:\Users\firha\AppData\Roaming\com.libern.app\data\libern.db" "PRAGMA integrity_check;"
`

### Restoring a User Key

`ash
# Decrypt the key backup
openssl enc -d -aes-256-cbc -pbkdf2 -in user-key.key.enc -out user.key -pass pass:THE_PASSWORD

# Copy to keys directory
Copy-Item -Path "user.key" -Destination "C:\Users\firha\AppData\Roaming\com.libern.app\data\keys\"
`

### Restoring Identity from Exported File

1. Launch Libern on a fresh installation.
2. During onboarding, select "Import Identity".
3. Select the exported JSON file.
4. Enter the export password.
5. Your identity is restored.

---

## Part 7: Backup Best Practices

### Schedule Recommendations

| Data | Frequency | Retention | Method |
|------|-----------|-----------|--------|
| .aioss sessions | Every seal event | 7 years | Auto-backup script |
| SQLite database | Daily | 90 days | .backup command |
| User keys | Weekly | Indefinite | Encrypted export |
| Full system | Weekly | 90 days | Comprehensive script |

### The 3-2-1 Rule

Follow the 3-2-1 backup strategy:
- **3** copies of your data
- **2** different storage media
- **1** offsite copy

### Testing Backups

- **Weekly**: Verify .aioss file integrity with erifyAiossFile().
- **Monthly**: Test database restoration on a non-production machine.
- **Quarterly**: Full disaster recovery drill (complete restoration from backup).

---

## Part 8: Troubleshooting Backup Issues

| Problem | Solution |
|---------|----------|
| Database backup fails with "database is locked" | Use .backup command instead of file copy. Ensure Libern is not in the middle of a write operation. |
| .aioss file verification fails after restore | The file may have been corrupted during backup. Restore from an earlier backup of the same session. |
| Key decryption fails | The password may be incorrect. Ensure the correct encryption algorithm was used (AES-256-CBC with PBKDF2). |
| Backup script fails with permission denied | Run as Administrator or SYSTEM. Check that the backup directory is writable. |
| Integrity check fails after restore | The database may have been backed up while corrupted. Try restoring from a different backup point. |
| "MANIFEST" file not found | Older backup format. Check the backup directory for manifest.json directly. |
| AI model file too large for backup | Exclude the AI model from regular backups. It can be re-downloaded from Hugging Face. |
| Backup takes too long | Exclude the AI model. Consider differential backups instead of full backups. |

---

## Next Steps

Now that backup strategies are in place, proceed to:

- **Enterprise Guide 05**: Monitoring — Health diagnostics, .aioss verification, network status
- **Enterprise Guide 06**: Compliance Reporting — Generate compliance reports, export audit logs

----------------------------------------------------------------

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

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