# Backup and Restore

This guide covers backing up your 01s Sovereign system, including data, ledger state, and system configuration.

## Backup Overview

```mermaid
graph TD
    Backup[Backup Strategy] --> Data[User Data]
    Backup --> Config[System Config]
    Backup --> Ledger[Ledger State]
    Backup --> DB[Database/SQLite]
    Data --> Home[/home]
    Data --> Projects[/opt/projects]
    Data --> Docker[/var/lib/docker]
    Config --> Etc[/etc]
    Config --> Custom[/usr/local]
    Ledger --> LedgerDir[~/ledger]
    Ledger --> HealthDir[logs/health]
    DB --> EventStore[~/.local/share/01s/events.db]
```

## Backing Up User Data

### Using tar

```bash
# Backup home directory
tar czf ~/backups/home-backup-$(date +%Y%m%d).tar.gz ~/

# Backup specific directories
tar czf ~/backups/projects-$(date +%Y%m%d).tar.gz \
  ~/projects \
  ~/documents \
  ~/code
```

### Using rsync

```bash
# Local backup
rsync -av --delete ~/ /mnt/backup/

# Remote backup
rsync -avz -e ssh ~/ user@remote:/backup/

# Exclude patterns
rsync -av --exclude='.cache' --exclude='.local/share/Trash' ~/ /mnt/backup/
```

### Using Borg Backup

```bash
# Install borg
sudo pacman -S borg

# Initialize repository
borg init --encryption=repokey /mnt/backup/borg-repo

# Create backup
borg create --stats --progress \
  /mnt/backup/borg-repo::$(date +%Y%m%d-%H%M%S) \
  ~/ \
  --exclude '~/.cache'

# List backups
borg list /mnt/backup/borg-repo

# Restore
borg extract /mnt/backup/borg-repo::20260614-120000
```

## Backing Up the Ledger

```bash
# Backup ledger files
tar czf ~/backups/ledger-$(date +%Y%m%d).tar.gz \
  ~/ledger/ \
  logs/health/ \
  logs/txt/

# Verify ledger integrity before backup
01s-ledger verify
01s-ledger health verify $(date +%Y-%m-%d)

# Export ledger to JSON
01s-ledger export > ~/backups/ledger-export-$(date +%Y%m%d).json

# Create signed state proof
01s-ledger sign > ~/backups/ledger-proof-$(date +%Y%m%d).txt
```

## Backing Up System Configuration

```bash
# Backup /etc
sudo tar czf ~/backups/etc-$(date +%Y%m%d).tar.gz /etc/

# Backup package list
pacman -Q > ~/backups/packages-$(date +%Y%m%d).txt

# Backup explicitly installed packages
pacman -Qe > ~/backups/packages-explicit-$(date +%Y%m%d).txt

# Backup AUR packages
pacman -Qm > ~/backups/packages-aur-$(date +%Y%m%d).txt

# Backup pacman configuration
sudo cp /etc/pacman.conf ~/backups/
sudo cp /etc/pacman.d/mirrorlist ~/backups/
```

## Automated Backup Script

Create `/usr/local/bin/backup-01s.sh`:

```bash
#!/bin/bash
# 01s Sovereign backup script

BACKUP_DIR="/mnt/backup/01s"
DATE=$(date +%Y%m%d-%H%M%S)
LOG="/var/log/backup-01s.log"

echo "[$DATE] Starting backup..." >> "$LOG"

# Create backup directory
mkdir -p "$BACKUP_DIR/$DATE"

# Backup ledger
01s-ledger verify >> "$LOG" 2>&1
tar czf "$BACKUP_DIR/$DATE/ledger.tar.gz" ~/ledger/ logs/ 2>> "$LOG"

# Backup config
tar czf "$BACKUP_DIR/$DATE/etc.tar.gz" /etc/ 2>> "$LOG"

# Backup package list
pacman -Q > "$BACKUP_DIR/$DATE/packages.txt" 2>> "$LOG"

# Backup home (excluding cache)
tar czf "$BACKUP_DIR/$DATE/home.tar.gz" \
  --exclude='.cache' \
  --exclude='.local/share/Trash' \
  --exclude='ledger' \
  ~/ 2>> "$LOG"

echo "[$DATE] Backup complete." >> "$LOG"

# Log to ledger
01s-ledger log backup type="full" size=$(du -sb "$BACKUP_DIR/$DATE" | cut -f1)
```

### Schedule Backup

```bash
# Create systemd service
sudo tee /etc/systemd/system/01s-backup.service << 'EOF'
[Unit]
Description=01s Sovereign Daily Backup
[Service]
Type=oneshot
ExecStart=/usr/local/bin/backup-01s.sh
EOF

# Create timer
sudo tee /etc/systemd/system/01s-backup.timer << 'EOF'
[Unit]
Description=Daily 01s backup
[Timer]
OnCalendar=daily
Persistent=true
[Install]
WantedBy=timers.target
EOF

# Enable
sudo systemctl enable --now 01s-backup.timer
```

## Restore Procedures

### Restore User Data

```bash
# Extract tar backup
tar xzf ~/backups/home-backup-20260614.tar.gz -C /

# Restore with rsync
rsync -av /mnt/backup/home/ ~/
```

### Restore the Ledger

```bash
# Extract ledger backup
tar xzf ~/backups/ledger-20260614.tar.gz -C ~/

# Verify restored ledger
01s-ledger verify
01s-ledger health verify 2026-06-14
```

### Restore System Configuration

```bash
# Extract config backup (as root)
sudo tar xzf ~/backups/etc-20260614.tar.gz -C /

# Reinstall packages
sudo pacman -S --needed - < ~/backups/packages-20260614.txt
```

### Full System Restore

```bash
# 1. Boot from ISO
# 2. Install base system
# 3. Restore configuration
sudo tar xzf /mnt/backup/etc-20260614.tar.gz -C /mnt

# 4. Restore packages
sudo pacman -S --needed - < /mnt/backup/packages-20260614.txt

# 5. Restore user data
sudo tar xzf /mnt/backup/home-20260614.tar.gz -C /mnt

# 6. Restore ledger
sudo tar xzf /mnt/backup/ledger-20260614.tar.gz -C /mnt/home/01s/
```

## Backup Encryption

```bash
# Encrypt backup
gpg --symmetric --cipher-algo AES256 \
  --output backup-20260614.tar.gz.gpg \
  backup-20260614.tar.gz

# Decrypt backup
gpg --decrypt backup-20260614.tar.gz.gpg > backup-20260614.tar.gz

# Encrypt with key file
gpg --symmetric --passphrase-file /path/to/keyfile \
  backup-20260614.tar.gz
```

## Backup Verification

```bash
# Test backup integrity
tar tzf backup-20260614.tar.gz | head -20

# Verify checksums
sha256sum backup-20260614.tar.gz > backup-20260614.tar.gz.sha256
sha256sum -c backup-20260614.tar.gz.sha256

# Test restore to temp location
mkdir /tmp/test-restore
tar xzf backup-20260614.tar.gz -C /tmp/test-restore
```

---


## Backup Strategy Comparison

| Strategy | RPO | RTO | Storage | Cost | Complexity |
|----------|-----|-----|---------|------|------------|
| Simple copy | 24h | 30min | 2x data | Low | Minimal |
| rsync | 1h | 1h | 2x data | Low | Low |
| tar archive | Daily | 2h | 1.5x data | Low | Low |
| rsnapshot | 1h | 30min | 3-4x data | Medium | Medium |
| Cloud sync | 5min | 2h | 2x data | High | High |
| RAID mirror | Real-time | 0 | 2x data | High | High |

## Backup Script Templates

### Full Backup
`ash
#!/bin/bash
BACKUP_DIR="/mnt/backup/01s/"
mkdir -p ""
tar czf "/etc.tar.gz" /etc/
tar czf "/home.tar.gz" --exclude=".cache" /home/
pacman -Qqe > "/packages-list.txt"
cp -r ~/ledger/ "/ledger/"
echo "Backup complete: "
`

### Incremental Backup
`ash
#!/bin/bash
SOURCE_DIRS=("/home" "/etc" "/usr/local/bin")
BACKUP_BASE="/mnt/backup/01s"
TODAY="/"

mkdir -p ""
for dir in ""; do
    target="/"
    rsync -a --delete "/" "/"
done
`

## Recovery Procedures

`ash
# From full backup
sudo tar xzf backup/etc.tar.gz -C /
tar xzf backup/home.tar.gz -C /
sudo pacman -S --needed - < backup/packages-list.txt
cp -r backup/ledger/ ~/
01s-ledger verify
`

## Critical Data Priorities

| Data | Location | Priority | Size |
|------|----------|----------|------|
| Ledger | ~/ledger/ | Critical | ~MB |
| Home configs | ~/.config/ | High | ~MB |
| SSH keys | ~/.ssh/ | Critical | ~KB |
| Firefox profile | ~/.mozilla/ | Medium | ~100MB |
| Toolchain source | /usr/src/toolchain/ | Medium | ~500KB |
| Package list | pacman -Qqe | High | ~KB |
| System config | /etc/ | High | ~MB |

## See Also

- [Disaster Recovery Overview](../incident-reporting/02-disaster-recovery-overview.md)
- [Backup Strategies](../incident-reporting/03-backup-strategies.md)
- [System Restore Procedures](../incident-reporting/04-system-restore-procedures.md)

---



## Reference Information

### Related Commands
| Command | Purpose | Example |
|---------|---------|---------|
| man <topic> | View manual page | man ls |
| <command> --help | Show help | zerocli --help |
| info <topic> | GNU info page | info bash |

### Configuration Files
| File | Purpose | Location |
|------|---------|----------|
| System config | Global settings | /etc/ |
| User config | Per-user settings | ~/.config/ |
| Service config | Service definitions | /etc/systemd/system/ |
| Application data | Persistent data | ~/.local/share/ |

### Log Files Reference
| Log | Command | Location |
|-----|---------|----------|
| System journal | journalctl -xe | /var/log/journal/ |
| Boot log | dmesg | Kernel ring buffer |
| Auth log | journalctl -u sshd | /var/log/ |
| Ledger | 01s-ledger tail | ~/ledger/ |
| Health | 01s-ledger health status | logs/health/ |

### Environment Variables
| Variable | Purpose | Default |
|----------|---------|---------|
| HOME | User home directory | /home/username |
| PATH | Executable search paths | /usr/local/bin:/usr/bin:/bin |
| LANG | System locale | en_US.UTF-8 |
| TERM | Terminal type | xterm-256color |
| EDITOR | Default text editor | nano |
| SHELL | Default shell | /bin/bash |
| USER | Current username | (login name) |

### Service Management Quick Reference
| Action | System Service | User Service |
|--------|---------------|--------------|
| View status | systemctl status <name> | systemctl --user status <name> |
| Start | sudo systemctl start <name> | systemctl --user start <name> |
| Stop | sudo systemctl stop <name> | systemctl --user stop <name> |
| Enable at boot | sudo systemctl enable <name> | systemctl --user enable <name> |
| Disable | sudo systemctl disable <name> | systemctl --user disable <name> |
| View logs | journalctl -u <name> | journalctl --user -u <name> |

### File System Hierarchy
| Directory | Purpose |
|-----------|---------|
| /bin | Essential user binaries |
| /boot | Boot loader files |
| /dev | Device files |
| /etc | System configuration |
| /home | User home directories |
| /proc | Process information |
| /root | Root user home |
| /run | Runtime variable data |
| /tmp | Temporary files |
| /usr | User system resources |
| /var | Variable data (logs, spools) |

### Package File Extensions
| Extension | Type | Install Command |
|-----------|------|----------------|
| .pkg.tar.zst | Standard package | pacman -U |
| .pkg.tar.xz | Legacy package | pacman -U |
| .src.tar.gz | Source package | makepkg -si |
| .flatpak | Flatpak app | flatpak install |
| .AppImage | Portable app | chmod +x && ./ |

## Common Mistakes

| Mistake | Why It Happens | Correct Approach |
|---------|---------------|------------------|
| Backup fails mid-way | Disk full | Check available space with df -h |
| Restore fails | Wrong backup version | Use --list to check archive contents |
| rsync slow | Network bottleneck | Use --compress or --bwlimit |
| Ledger backup missing | Not included in script | Add ~/ledger/ to backup paths |

## Practice Exercises

1. Review the key concepts covered in this guide
2. Try applying each configuration step on your system
3. Document any differences you observe from expected behavior
4. Share your experience in the community forums
5. Write a summary of what you learned

## Verification Checklist

- [ ] You can perform the main task described in this guide
- [ ] You understand the common mistakes and how to avoid them
- [ ] You can troubleshoot basic issues independently
- [ ] You know where to find additional help if needed

### Common Pitfalls (Backup)

| Pitfall | Why It Happens | How to Avoid |
|---------|---------------|--------------|
| Backup incomplete | File changed during backup | Use LVM snapshots for consistent backups |
| Restore failed silently | Wrong permissions in archive | Test restore in a temporary directory first |
| Backup medium failure | Media not verified after write | Verify backup integrity immediately after creation |
| Ledger not included | Backup script excludes ~/ledger | Always include ledger directory in backup paths |
| Encryption key lost | No key escrow | Store backup encryption keys in a password manager |

## Practice Exercises (Advanced)

1. **3-2-1 Backup Strategy**: Implement a complete 3-2-1 backup strategy (3 copies, 2 media, 1 offsite) for your 01s system
2. **Automated Scheduled Backups**: Set up systemd timers for daily, weekly, and monthly backups with verification
3. **Disaster Recovery Drill**: Perform a full restore on a separate machine; document all steps and time required
4. **Ledger-Backed Backup Verification**: Write a script that verifies backup integrity by cross-referencing with ledger hashes
5. **Cloud Backup Integration**: Set up encrypted backups to Backblaze B2 or S3 using rclone; verify encryption

## Further Reading

- [Post-Installation Setup](07-post-installation-setup.md) — Initial setup
- [Using 01s-Ledger](10-using-01s-ledger.md) — Ledger verification
- [Data Safety Overview](../data-safety/01-overview-of-data-safety-in-01s.md) — Data protection
- [Backup Strategies](../incident-reporting/03-backup-strategies.md) — Strategy docs
- [Disaster Recovery](../incident-reporting/02-disaster-recovery-overview.md) — Recovery plans
- [Ledger Recovery](../incident-reporting/05-ledger-recovery.md) — Ledger restoration
- [Boot Troubleshooting](../help/02-boot-troubleshooting.md) — Boot failure
- [Enterprise Backup](../enterprise/06-licensing-and-subscription.md) — Enterprise plans
- [System Restore](../incident-reporting/04-system-restore-procedures.md) — Restore procedures
- [Backup FAQ](../faq/06-security-faq.md) — Common questions

## 3-2-1 Backup Script

```bash
#!/bin/bash
BACKUP_DIR="/mnt/backup/$(hostname)-$(date +%Y%m%d)"
REMOTE="user@remote:/backups"
mkdir -p "$BACKUP_DIR"
rsync -aAXv / --exclude={/dev,/proc,/sys,/tmp,/run,/mnt,/media,/lost+found} "$BACKUP_DIR/system/"
01s-ledger export --format tar.gz -o "$BACKUP_DIR/ledger.tar.gz"
01s-ledger verify > "$BACKUP_DIR/ledger-verify.txt"
tar -czf "$BACKUP_DIR/../backup-$HOSTNAME-$(date +%Y%m%d).tar.gz" "$BACKUP_DIR"
rsync -avz "$BACKUP_DIR/../backup-*.tar.gz" "$REMOTE:backups/"
```

## Automated Backup Timer

```ini
# /etc/systemd/system/backup.service
[Unit]
Description=Daily Backup
[Service]
Type=oneshot
ExecStart=/usr/local/bin/backup.sh

# /etc/systemd/system/backup.timer
[Unit]
Description=Run backup daily
[Timer]
OnCalendar=daily
Persistent=true
RandomizedDelaySec=1800
[Install]
WantedBy=timers.target
```

## Real-World Scenario: Ransomware Recovery

A company suffers a ransomware attack. Recovery plan: (1) Take infected machines offline, (2) Restore from last verified backup on separate hardware, (3) Verify ledger integrity: `01s-ledger verify --full`, (4) Compare pre-attack and post-attack ledger entries to identify all encrypted files, (5) Restore affected files individually from backup, (6) Update firewall rules to block attack vector. Total recovery time: 4 hours. Files restored: 1,247. Data loss: none.

## Backup Strategy Comparison

| Strategy | Recovery Time | Storage Cost | Complexity | Protection Level |
|----------|--------------|--------------|------------|------------------|
| 3-2-1 (full) | 2-4 hours | High | Medium | Maximum |
| Daily + weekly | 4-8 hours | Medium | Low | Good |
| Continuous | Minutes | Very High | High | Best (RPO) |
| Cloud-only | 1-24 hours | Medium | Low | Internet-dependent |
| Ledger + system | 1 hour | Low | Low | System only |

## Selective File Restore

```bash
# List archive contents
tar -tzf backup-20260515.tar.gz | grep "important-file"

# Extract specific file
tar -xzf backup-20260515.tar.gz \
  ./home/alice/documents/important-file.txt

# Extract directory
tar -xzf backup-20260515.tar.gz \
  ./home/alice/.config/

# Restore with permissions
tar -xzf backup-20260515.tar.gz \
  --same-permissions --same-owner \
  ./etc/nginx/
```

## Ledger Recovery After Restore

```bash
# After complete system restore:
# 1. Verify the restored ledger
01s-ledger verify --full

# 2. If chain is valid, resume normal operation
# 3. If chain is broken, repair from backup
01s-ledger repair --from-backup /mnt/backup/ledger.tar.gz

# 4. Record the restore event
01s-ledger record --type SYSTEM_RESTORE \
  --message "Restored from backup 2026-05-15"

# 5. Verify again
01s-ledger verify --full
```

## Cloud Backup Integration

```bash
# Install rclone for cloud storage backups
sudo pacman -S rclone

# Configure cloud provider
rclone config
# Follow prompts to set up Backblaze B2, S3, or Google Drive

# Backup script for cloud
cat > /usr/local/bin/cloud-backup.sh << 'SCRIPT'
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_NAME="01s-backup-$HOSTNAME-$TIMESTAMP"

# Create local backup first
tar -czf "/tmp/$BACKUP_NAME-system.tar.gz" /etc /home --exclude=/home/*/.cache
01s-ledger export --format tar.gz -o "/tmp/$BACKUP_NAME-ledger.tar.gz"

# Upload to cloud
rclone copy "/tmp/$BACKUP_NAME-system.tar.gz" myremote:backups/
rclone copy "/tmp/$BACKUP_NAME-ledger.tar.gz" myremote:backups/

# Cleanup
rm /tmp/$BACKUP_NAME-*.tar.gz
echo "Backup $BACKUP_NAME completed"
SCRIPT
chmod +x /usr/local/bin/cloud-backup.sh
```

## Snapshot Backup with Btrfs

If using Btrfs filesystem, you can use snapshots for instant backups:

```bash
# Create snapshot
sudo btrfs subvolume snapshot / /mnt/backup/snapshots/root-$(date +%Y%m%d)

# Create read-only snapshot for backup
sudo btrfs subvolume snapshot -r / /mnt/backup/snapshots/root-$(date +%Y%m%d)-ro

# List snapshots
sudo btrfs subvolume list /mnt/backup/snapshots/

# Restore from snapshot
sudo btrfs subvolume delete /
sudo btrfs subvolume snapshot /mnt/backup/snapshots/root-20260515 /
```

## Backup Storage Requirements

| Backup Type | System Only | System + Home | With Ledger | Compressed |
|-------------|-------------|---------------|-------------|------------|
| Daily (differential) | 100 MB | 500 MB | 5 MB | 200 MB |
| Weekly (full) | 5 GB | 20 GB | 25 MB | 8 GB |
| Monthly (full) | 6 GB | 25 GB | 100 MB | 10 GB |
| Archive (quarterly) | 7 GB | 30 GB | 300 MB | 12 GB |

## Backup Verification Process

```bash
# After creating any backup, always verify:
# 1. Check backup file exists and has reasonable size
ls -lh /mnt/backup/backup-*.tar.gz

# 2. Verify archive integrity
tar -tzf /mnt/backup/backup-*.tar.gz > /dev/null && echo "Archive OK"

# 3. Compare ledger checksum
01s-ledger verify --quick
01s-ledger export --hash-only > backup-hash.txt
sha256sum /mnt/backup/backup-*.tar.gz >> backup-hash.txt

# 4. Test restore to temporary directory
mkdir /tmp/restore-test
tar -xzf /mnt/backup/backup-*.tar.gz -C /tmp/restore-test --totals
ls /tmp/restore-test/
rm -rf /tmp/restore-test
```

## Recovery Timeline Expectations

| Scenario | Recovery Time | Tools Used | Data Loss |
|----------|---------------|------------|-----------|
| Single file deleted | 1-2 minutes | tar extract | None |
| User home corrupt | 10-15 minutes | rsync restore | None |
| Ledger corrupted | 5-10 minutes | 01s-ledger repair | None |
| OS broken (config) | 15-30 minutes | pacman -Syu | Minimal |
| OS broken (disk) | 1-2 hours | Full reinstall + restore | None (from backup) |
| Complete system failure | 2-4 hours | Recovery ISO + restore | None (from backup) |
| Disaster (no backup) | 4-8 hours | Clean install | All user data |
| Hardware replacement | 3-6 hours | New HW + restore | None (from backup) |

## Backup Strategy by User Type

| User Type | Frequency | Retention | Method | Storage |
|-----------|-----------|-----------|--------|---------|
| Casual | Weekly | 1 month | Manual script | External USB |
| Developer | Daily | 3 months | Automated systemd | External + cloud |
| Enterprise | Hourly | 6 months | Continuous + full | NAS + cloud |
| Server | Daily + snapshot | 1 year | LVM snapshots | Local + offsite |
| Critical infrastructure | Continuous + daily | 7 years | Enterprise backup | Multiple locations |

---

Lois-Kleinner and 0-1.gg 2026 Copyright

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

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
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
