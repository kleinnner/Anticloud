                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                
# Common Bugs — Known Issues and Fixes

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. [Bug: Qdrant Connection Timeout During Ingest](#bug-qdrant-connection-timeout-during-ingest)
2. [Bug: Model Backend Returns Gibberish Embeddings](#bug-model-backend-returns-gibberish-embeddings)
3. [Bug: WinFSP Mount Fails with Error 0x80070005](#bug-winfsp-mount-fails-with-error-0x80070005)
4. [Bug: FUSE Mount Fails "Device or Resource Busy"](#bug-fuse-mount-fails-device-or-resource-busy)
5. [Bug: sled Database Corruption](#bug-sled-database-corruption)
6. [Bug: Query Results Include Deleted Files](#bug-query-results-include-deleted-files)
7. [Bug: Indexing Stalls Midway](#bug-indexing-stalls-midway)
8. [Bug: Omnibox Hotkey Not Working](#bug-omnibox-hotkey-not-working)
9. [Bug: File Previews Not Displaying](#bug-file-previews-not-displaying)
10. [Bug: Kamelot Daemon Crashes on Startup](#bug-kamelot-daemon-crashes-on-startup)
11. [Bug: GPU Memory Leak During Extended Use](#bug-gpu-memory-leak-during-extended-use)
12. [Bug: Encrypted Flat Store Verification Fails](#bug-encrypted-flat-store-verification-fails)
13. [Bug: Query Caching Returning Stale Results](#bug-query-caching-returning-stale-results)
14. [Bug: Rollback Leaves Orphaned Blobs](#bug-rollback-leaves-orphaned-blobs)
15. [Bug: Cross-Platform Path Separator Issues](#bug-cross-platform-path-separator-issues)
16. [Bug: Configuration File Not Parsing Correctly](#bug-configuration-file-not-parsing-correctly)

---

## Bug: Qdrant Connection Timeout During Ingest

### Bug ID
KML-BUG-001

### Affected Versions
All versions (v0.1.0+)

### Severity
High

### Symptom

```
[ERROR] qdrant_client::grpc: Failed to upsert points: transport error
[ERROR] kamelot::ingest: Batch upsert failed after 3 retries
Error: Qdrant ingest timeout — collection "kamelot" not responding
```

### Root Cause

The gRPC connection between Kamelot and Qdrant times out during bulk upsert operations. This typically occurs when:
1. Qdrant is under load (optimizer running, snapshot in progress)
2. Network latency between Kamelot and Qdrant (if on different hosts)
3. Qdrant storage is on slow I/O (HDD instead of SSD)
4. Batch size is too large for Qdrant's current configuration

### Fix

#### Immediate Workaround

```bash
# Reduce batch size for Qdrant upserts
kml config set indexing.batch_size 32    # Default: 100

# Increase Qdrant timeout
kml config set qdrant.timeout_seconds 120    # Default: 30

# Retry the failed ingest
kml index --resume
```

#### Permanent Fix

1. **Check Qdrant optimizer activity:**
   ```bash
   curl http://localhost:6333/collections/kamelot/points/search?limit=1
   # If slow, optimizer may be running
   ```

2. **Tune Qdrant for bulk ingest:**
   ```bash
   # Pause optimization during ingest
   curl -X PATCH http://localhost:6333/collections/kamelot \
     -H "Content-Type: application/json" \
     -d '{"optimizers_config": {"indexing_threshold": 1000000}}'
   ```

3. **Ensure Qdrant storage is on SSD.**

4. **Upgrade Qdrant to v1.13.0+** (improved bulk insert performance).

### Prevention

- Schedule large indexing jobs during low-usage periods
- Monitor Qdrant metrics: `curl http://localhost:6333/metrics`
- Keep Qdrant updated to latest version

---

## Bug: Model Backend Returns Gibberish Embeddings

### Bug ID
KML-BUG-002

### Affected Versions
v0.1.0 - v0.1.2

### Severity
Critical

### Symptom

```
[WARN] kamelot::embed: Embedding vector has near-zero variance — all dimensions ~0.5
[WARN] kamelot::embed: Cosine similarity distribution is uniform — search results are random
```

All search results appear random, the same file appears for different queries, or similarity scores are all identical.

### Root Cause

1. **Wrong model name**: Kamelot is configured to use a model that doesn't exist or isn't designed for embeddings (e.g., a text generation model used without appropriate prompt formatting).
2. **Ollama API issue**: Ollama returns a default/garbage response when the model isn't loaded correctly.
3. **Quantization corruption**: The model file was corrupted during download or storage.
4. **Incorrect embedding extraction**: The embedding extraction code reads the wrong layer or tensor.

### Fix

#### Immediate Workaround

```bash
# Step 1: Verify model is correct for embeddings
ollama list
# Ensure you're using qwen2-vl:7b-q4 or nomic-embed-text

# Step 2: Switch to a known-good model
kml config set ollama.model "nomic-embed-text"

# Step 3: Test with a single file
kml index ~/Documents/test.txt --verbose

# Step 4: If using mock mode works but real model doesn't, reinstall the model
ollama rm qwen2-vl:7b-q4
ollama pull qwen2-vl:7b-q4
```

#### Verify Embedding Quality

```bash
# Generate embeddings for two similar files
kml embed ~/Documents/doc1.txt > /tmp/emb1.json
kml embed ~/Documents/doc2.txt > /tmp/emb2.json

# Compare cosine similarity (should be >0.5 for similar content)
python3 -c "
import json
import math
e1 = json.load(open('/tmp/emb1.json'))['embedding']
e2 = json.load(open('/tmp/emb2.json'))['embedding']
dot = sum(a*b for a,b in zip(e1,e2))
n1 = math.sqrt(sum(a*a for a in e1))
n2 = math.sqrt(sum(a*a for a in e2))
print(f'Cosine similarity: {dot/(n1*n2):.4f}')
"
```

### Prevention

- Run `kml doctor --model` after changing models to verify embedding quality
- Pin model version in configuration:
  ```toml
  [ollama]
  model = "qwen2-vl:7b-q4@sha256:a1b2c3d4..."
  ```

---

## Bug: WinFSP Mount Fails with Error 0x80070005

### Bug ID
KML-BUG-003

### Affected Versions
All versions (Windows)

### Severity
High

### Symptom

```
Error: WinFSP mount failed: error 0x80070005 (E_ACCESSDENIED)
Error: Failed to create WinFsp file system
```

### Root Cause

The WinFSP driver requires elevated privileges to create a filesystem mount point. Error 0x80070005 (E_ACCESSDENIED) indicates the process does not have sufficient permissions.

### Fix

#### Immediate Workaround

```powershell
# Run terminal as Administrator
# Right-click PowerShell/CMD -> Run as Administrator
kml start

# Or run Kamelot directly with elevated privileges
Start-Process -FilePath "kamelot.exe" -ArgumentList "start" -Verb RunAs
```

#### Configure Non-Admin Mount (Alternative)

If running as admin is not feasible, configure WinFSP to allow non-admin mounts:

```powershell
# Edit WinFSP configuration
# C:\Program Files (x86)\WinFsp\opt\winfsp.conf
# Add:
[Global]
AllowedUsers = *
# Or specify specific users:
# AllowedUsers = DOMAIN\username
```

#### Use a Different Drive Letter

```powershell
# Try a different (non-system) drive letter
kml config set fuse.mount_point_windows "L:"
kml start
```

### Prevention

- Install Kamelot as a Windows service that runs under SYSTEM account (avoids admin prompts):
  ```powershell
  kml service install
  kml service start
  ```

---

## Bug: FUSE Mount Fails "Device or Resource Busy"

### Bug ID
KML-BUG-004

### Affected Versions
All versions (Linux/macOS)

### Severity
Medium

### Symptom

```
Error: fuse_mount: device or resource busy
Error: fusermount: mount failed: Device or resource busy
```

### Root Cause

1. The mount point (`/kml`) already has something mounted on it.
2. A previous Kamelot instance crashed without properly unmounting.
3. Another FUSE filesystem is mounted at the same location.

### Fix

#### Immediate Workaround

```bash
# Check what's mounted
mount | grep /kml

# Force unmount
fusermount -uz /kml    # Linux (safe unmount, wait for processes)
sudo umount -l /kml    # Linux (lazy unmount, immediate)

# On macOS
sudo umount /kml

# Verify unmount
ls /kml   # Should show empty directory or error

# Remount
kml start
```

#### Use Alternate Mount Point

```bash
# If /kml is persistently in use, use a different path
kml config set fuse.mount_point "/mnt/kamelot"
kml start
```

#### Clean Up Stale FUSE Processes

```bash
# Find and kill stale FUSE processes
ps aux | grep fuse | grep -v grep
kill -9 <pid_of_stale_process>

# Or kill all Kamelot processes
pkill -9 kamelot
sleep 2
kml start
```

### Prevention

- Always use `kml stop` instead of killing the process
- Add to systemd service: `ExecStop=kml stop`
- Monitor mount status: `kml doctor` includes mount check

---

## Bug: sled Database Corruption

### Bug ID
KML-BUG-005

### Affected Versions
All versions

### Severity
Critical

### Symptom

```
[ERROR] sled: database or log is corrupted
[ERROR] kamelot::metadata: Failed to read metadata store: Corruption
Error: sled::Error: Corruption
```

### Root Cause

The sled embedded database stores file metadata (mappings between inodes, file paths, and Qdrant point IDs). Corruption can occur if:
1. The system crashes or loses power during a write operation
2. The database file is modified by an external process
3. Disk I/O errors cause partial writes
4. Two Kamelot instances access the same data directory simultaneously

### Fix

#### Recovery

```bash
# Step 1: Stop Kamelot if running
kml stop

# Step 2: Attempt automatic repair
kml metadata repair

# Step 3: If repair fails, rebuild metadata from ledger
kml metadata rebuild

# Step 4: If rebuilding fails, restore from backup
# Restore ~/.kamelot/metadata/ from backup
# Or restore entire ~/.kamelot/ from backup
```

#### If No Backup Exists

```bash
# Rebuild metadata from .aioss ledger and flat store
# This re-reads all file metadata from the ledger
# and re-constructs the sled database
kml metadata rebuild --force

# Then re-index to restore Qdrant points
# (if Qdrant was also corrupted)
kml reindex
```

#### Full Recovery (Worst Case)

```bash
# If all else fails, start fresh
# (your original files are unaffected)
kml stop
mv ~/.kamelot ~/.kamelot.corrupted
kml init
kml index ~/Documents/
# Note: This will re-index all files from scratch
# Ledger history from .aioss is preserved if copied
```

### Prevention

1. **Always use `kml stop`** to ensure clean shutdown
2. **Enable write-ahead logging** in sled:
   ```toml
   [metadata]
   flush_every_ms = 100  # More frequent flushes reduce corruption risk
   ```
3. **Regular backups** of `~/.kamelot/metadata/`
4. **UPS** for desktop systems to prevent power-loss corruption

---

## Bug: Query Results Include Deleted Files

### Bug ID
KML-BUG-006

### Affected Versions
v0.1.0 - v0.1.3

### Severity
Medium

### Symptom

Files that were deleted from the original filesystem still appear in Kamelot search results. Opening these files results in a "file not found" error.

### Root Cause

Kamelot's file watcher may miss deletion events when:
1. Files are deleted rapidly in batch operations
2. Files are deleted via a different filesystem path (e.g., symlink)
3. The file watcher's event queue overflows
4. Kamelot was not running when the files were deleted

### Fix

#### Immediate Workaround

```bash
# Manually prune deleted files from index
kml index prune

# Verify pruned files
kml find "deleted_file"  # Should no longer appear

# Or prune with confirmation
kml index prune --dry-run  # Preview what will be removed
kml index prune --apply    # Actually remove
```

#### Permanent Clean

```bash
# Force full re-sync of filesystem state
kml index sync

# This compares the index against the actual filesystem
# and removes entries for files that no longer exist
```

### Prevention

1. **Ensure file watcher is enabled**:
   ```toml
   [indexing]
   watch_enabled = true
   watch_delay_seconds = 5   # Lower = more responsive
   ```

2. **Run periodic cleanup**:
   ```bash
   # Add to crontab / Task Scheduler
   kml index prune  # Weekly cleanup
   ```

---

## Bug: Indexing Stalls Midway

### Bug ID
KML-BUG-007

### Affected Versions
v0.1.0 - v0.1.2

### Severity
High

### Symptom

`kml index` starts processing files but stops after a certain number with no error message. Progress bar freezes or disappears.

### Root Cause

1. A file with an unreadable or corrupt structure causes the parser to hang
2. The file watcher detects changes during initial indexing, causing re-scan loops
3. Memory pressure causes the indexing thread to be paused by the OS
4. A network filesystem becomes temporarily unreachable

### Fix

#### Immediate Workaround

```bash
# Resume indexing from where it left off
kml index --resume

# With increased verbosity to see which file is causing the stall
kml index --resume --verbose

# If a specific file is causing issues, add it to exclude list
kml config set indexing.exclude_patterns ["**/corrupt_file.pdf"]
```

#### Identify the Culprit File

```bash
# Increase logging to debug level
RUST_LOG=kamelot=debug kml index --resume 2>&1 | tee /tmp/index.log

# Look for the last file processed before the stall
tail -f /tmp/index.log | grep "Processing file"

# Add that file to exclusion list and retry
kml config set indexing.exclude_patterns ["**/corrupt_file.pdf"]
```

### Prevention

1. **Set parsing timeouts** to prevent hangs on corrupt files:
   ```toml
   [indexing]
   parse_timeout_seconds = 30  # Skip files that take >30s to parse
   ```

2. **Exclude problematic directories upfront**:
   ```toml
   exclude_patterns = [
       "**/node_modules/**", "**/.git/**", "**/__pycache__/**",
       "**/*.iso", "**/*.bin", "**/corrupt/**"
   ]
   ```

---

## Bug: Omnibox Hotkey Not Working

### Bug ID
KML-BUG-008

### Affected Versions
All versions

### Severity
Medium

### Symptom

Pressing the configured hotkey (default `Ctrl+Space`) does not open the Omnibox.

### Root Cause

1. Hotkey conflict with another application (most common)
2. Kamelot UI process not running
3. Window manager / compositor intercepting the shortcut
4. Keyboard layout sending different key codes

### Fix

#### Immediate Workaround

```bash
# Check if Kamelot UI is running
kml status | grep ui
# Expected: "UI: running"

# If UI is not running, start it
kml ui start

# Test web interface (if UI won't start)
# Open http://localhost:9011 in browser
```

#### Change Hotkey

```bash
# Try a different hotkey combination
kml config set ui.omnibox_hotkey "Alt+Space"

# Other common alternatives:
# Ctrl+Shift+Space
# Alt+Shift+F
# Win+F (Windows)
# Ctrl+Shift+P
```

#### Debug Hotkey Conflicts

```bash
# Check if another app is using the hotkey
# On Windows, check running tray applications
# On Linux, check window manager keybindings

# Temporarily disable other apps to isolate conflict
```

### Prevention

- Configure Kamelot to use an uncommon hotkey combination during installation
- Check for conflicts during `kml doctor`

---

## Bug: File Previews Not Displaying

### Bug ID
KML-BUG-009

### Affected Versions
All versions

### Severity
Low

### Symptom

Search results show file names and metadata but no thumbnail or content preview.

### Root Cause

1. Thumbnail cache not populated (newly indexed files)
2. File type doesn't support preview (binary, encrypted, unknown)
3. Preview generation failed (large file, corrupt file, timeout)
4. GPU UI rendering issue

### Fix

#### Immediate Workaround

```bash
# Clear and regenerate thumbnails
kml cache clear --thumbnails
kml cache generate --thumbnails

# Force preview generation for specific file
kml file preview <inode> --force
```

#### Check Preview Generation

```bash
# Test preview generation
kml file preview <inode> --output /tmp/preview.png

# Check logs for preview errors
kml logs | grep -i preview
```

#### Disable GPU UI Fallback

If the GPU UI is having rendering issues, use the text-only mode:

```bash
kml start --no-gpu
# Uses fallback UI without GPU-accelerated previews
```

### Prevention

- Ensure enough disk space for thumbnail cache
- Set appropriate cache limits:
  ```toml
  [thumbnail_cache]
  max_size_mb = 1000
  quality = 85
  ```

---

## Bug: Kamelot Daemon Crashes on Startup

### Bug ID
KML-BUG-010

### Affected Versions
v0.1.0 - v0.1.1

### Severity
Critical

### Symptom

`kml start` returns immediately with a crash/segfault, or the daemon process exits shortly after starting.

### Root Cause

1. Corrupted configuration file with invalid values
2. Mismatched Rust `ring` library version at link time
3. GPU driver incompatibility triggering a crash in wgpu initialization
4. Insufficient system resources (RAM < minimum requirement)
5. Signal handler conflict with existing FUSE implementations

### Fix

#### Immediate Workaround

```bash
# Step 1: Reset configuration to defaults
mv ~/.kamelot/config.toml ~/.kamelot/config.toml.bak
kml init --force

# Step 2: Start with minimal configuration
kml start --model mock --no-gpu

# Step 3: If this works, gradually re-enable features
kml start --model mock  # Enable GPU UI
kml start  # Enable full stack
```

#### Debug Startup Crash

```bash
# Increase log level
RUST_LOG=kamelot=trace kml start 2>&1 | tee /tmp/crash.log

# Check for segfault in system logs
# Linux:
dmesg | grep -i kamelot

# macOS:
log show --predicate 'process == "kamelot"' --last 1m

# Windows:
# Check Event Viewer -> Windows Logs -> Application
```

#### Platform-Specific Fixes

**Linux:**
```bash
# Check FUSE version compatibility
fusermount3 --version  # Needs v3.10+

# Install missing dependencies
sudo apt install fuse3 libfuse3-dev
```

**Windows:**
```powershell
# Reinstall WinFSP
choco uninstall winfsp
choco install winfsp

# Check for conflicting drivers
driverquery | findstr /i winfsp
```

**macOS:**
```bash
# Check FUSE extension
kextstat | grep fuse

# Reinstall macFUSE
brew uninstall macfuse
brew install macfuse
```

### Prevention

- Always use `kml doctor` before and after configuration changes
- Keep Kamelot and all dependencies updated

---

## Bug: GPU Memory Leak During Extended Use

### Bug ID
KML-BUG-011

### Affected Versions
v0.1.0 - v0.1.3

### Severity
High

### Symptom

VRAM usage increases over time without bound, eventually causing GPU driver crashes or out-of-memory errors. Visible in `nvidia-smi` (NVIDIA) or `rocm-smi` (AMD) as steadily increasing memory usage.

### Root Cause

1. Vello GPU UI shader cache not being freed after frames are rendered
2. Image decode buffers not being released after thumbnail generation
3. Wgpu swap chain frames accumulating in flight without synchronization
4. Embedding inference tensors not being deallocated

### Fix

#### Immediate Workaround

```bash
# Restart the daemon to free GPU memory
kml restart

# Or if only the UI is affected:
kml ui restart

# Disable GPU UI and use CLI/text mode only
kml start --no-gpu
```

#### Monitor and Mitigate

```bash
# Watch GPU memory usage
watch -n 5 nvidia-smi

# Set GPU memory limit (if available)
# NVIDIA:
export CUDA_VISIBLE_DEVICES=0
export GPU_MAX_ALLOC_PERCENT=80

# Set texture cache limit in config
[ui]
max_gpu_memory_mb = 2048
```

### Prevention

- Restart Kamelot periodically (e.g., weekly cron job)
- Monitor GPU memory in `kml doctor` output
- Update GPU drivers regularly

---

## Bug: Encrypted Flat Store Verification Fails

### Bug ID
KML-BUG-012

### Affected Versions
All versions

### Severity
Critical

### Symptom

```
[ERROR] kamelot::store: AEAD decryption failed — authentication tag mismatch
Error: File <inode> integrity check failed: corrupt or tampered blob
```

### Root Cause

1. File blob was modified outside of Kamelot (direct filesystem access)
2. Storage media corruption (bad sectors, bit rot)
3. Encryption key changed or rotated without updating file keys
4. Partial write due to system crash during blob storage

### Fix

#### Recovery

```bash
# Step 1: Identify affected files
kml store verify
# Lists all files with integrity failures

# Step 2: Attempt to restore from .aioss ledger history
kml rollback --inode <affected_inode> --minutes 60

# Step 3: If rollback fails, restore from backup
# Restore ~/.kamelot/store/ from backup

# Step 4: As last resort, re-index the original file
# (The encrypted blob is unrecoverable, but the original file may still exist)
kml file info <inode>   # Shows original file path
# Copy original file and re-index
kml index /path/to/original/file.ext
```

#### Mitigation

```bash
# Run periodic integrity checks
kml store verify --repair  # Attempts automatic repair

# Schedule weekly verification
# Add to crontab:
0 2 * * 0 kml store verify --report > ~/.kamelot/integrity-report.txt
```

### Prevention

1. **Enable integrity monitoring**:
   ```toml
   [storage]
   verify_on_read = true       # Check integrity on every file access
   background_verify = true    # Periodic background verification
   ```
2. **Store on reliable media** (ECC RAM, ZFS, enterprise SSD)
3. **Regular backups** of the flat store

---

## Bug: Query Caching Returning Stale Results

### Bug ID
KML-BUG-013

### Affected Versions
v0.1.0 - v0.1.2

### Severity
Medium

### Symptom

After indexing new files, query results don't include the new files for some time. Search results appear "stale."

### Root Cause

The query cache doesn't invalidate entries when new files are indexed. Cache entries have a TTL (default 1 hour) but are not proactively invalidated.

### Fix

#### Immediate Workaround

```bash
# Clear query cache
kml cache clear --queries

# Verify new files appear
kml find "newly indexed file"
```

#### Reduce Cache TTL

```toml
[query_cache]
enabled = true
ttl_seconds = 300    # 5 minutes instead of 3600
max_entries = 500
```

### Prevention

- Cache invalidation on file index events will be implemented in v0.2
- For now, manually clear cache after large indexing operations

---

## Bug: Rollback Leaves Orphaned Blobs

### Bug ID
KML-BUG-014

### Affected Versions
All versions

### Severity
Low

### Symptom

Disk usage increases over time as rollback operations leave previous file versions in the flat store without cleaning them up.

### Root Cause

The rollback mechanism restores previous file versions by referencing older blobs in the flat store. When a new file version is created after rollback, the "skipped" versions are not immediately garbage collected.

### Fix

```bash
# Run garbage collection to remove orphaned blobs
kml store gc

# Dry run first to see what will be removed
kml store gc --dry-run

# Set retention policy
kml store gc --keep-versions 3    # Keep last 3 versions of each file
kml store gc --keep-days 90       # Keep all versions within 90 days
```

### Prevention

- Schedule regular garbage collection:
  ```bash
  # Weekly GC
  0 3 * * 0 kml store gc
  ```

---

## Bug: Cross-Platform Path Separator Issues

### Bug ID
KML-BUG-015

### Affected Versions
All versions

### Severity
Medium

### Symptom

Files indexed on one platform show incorrect paths when accessed from another platform (e.g., Linux files show Windows-style backslashes or vice versa).

### Root Cause

Kamelot stores file paths using the platform's native path separator during indexing:
- Linux/macOS: `/` (forward slash)
- Windows: `\` (backslash)

When a FUSE/WinFSP mount presents these paths on a different platform, the separators may be wrong.

### Fix

```bash
# Normalize paths in the index
kml index normalize-paths

# This converts all stored paths to POSIX convention (/)
# and lets WinFSP handle conversion to backslashes on Windows
```

### Prevention

- Always normalize paths after cross-platform operations:
  ```bash
  kml config set indexing.normalize_paths true
  ```

---

## Bug: Configuration File Not Parsing Correctly

### Bug ID
KML-BUG-016

### Affected Versions
All versions

### Severity
Medium

### Symptom

Changes to `config.toml` have no effect, or Kamelot crashes with a configuration parse error.

### Root Cause

1. TOML syntax error (missing quotes, extra commas, incorrect nesting)
2. Configuration value type mismatch (string vs integer vs array)
3. Unknown configuration key (typo or deprecated key)
4. File encoding issue (BOM, non-UTF-8 characters)
5. File permissions prevent reading

### Fix

```bash
# Validate configuration
kml config validate

# If validation fails, check for:
# - Typographical errors in key names
# - Incorrect value types
# - Missing closing brackets or quotes

# View the effective configuration (validated)
kml config show

# Reset to defaults
kml config reset

# Edit with validation
kml config edit  # Opens in $EDITOR with validation check on save
```

### Prevention

- Use `kml config edit` instead of manually editing the file
- Run `kml config validate` after any manual edits
- Back up config before making changes:
  ```bash
  cp ~/.kamelot/config.toml ~/.kamelot/config.toml.bak
  ```
