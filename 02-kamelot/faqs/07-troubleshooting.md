                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                
# FAQ — Troubleshooting

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. [Kamelot Won't Start](#kamelot-wont-start)
2. [Qdrant Connection Refused](#qdrant-connection-refused)
3. [Model Not Found Errors](#model-not-found-errors)
4. [Permission Denied](#permission-denied)
5. [Not Enough Space Errors](#not-enough-space-errors)
6. [WinFSP Mount Fails](#winfsp-mount-fails)
7. [FUSE Mount Fails with Device or Resource Busy](#fuse-mount-fails-with-device-or-resource-busy)
8. [Ollama Not Responding](#ollama-not-responding)
9. [Search Returns No Results](#search-returns-no-results)
10. [Search Returns Irrelevant Results](#search-returns-irrelevant-results)
11. [Indexing Is Too Slow](#indexing-is-too-slow)
12. [Kamelot Uses Too Much RAM](#kamelot-uses-too-much-ram)
13. [Can't Open Files from Kamelot Drive](#cant-open-files-from-kamelot-drive)
14. [Rollback Fails or Does Nothing](#rollback-fails-or-does-nothing)
15. [Configuration Changes Not Applied](#configuration-changes-not-applied)
16. [General Debugging Checklist](#general-debugging-checklist)

---

## Kamelot Won't Start

### Symptom

Running `kml start` returns immediately or shows an error with no further output.

### Possible Causes and Fixes

#### Cause 1: Missing or Corrupted Configuration

```bash
# Check if config exists
ls -la ~/.kamelot/config.toml

# Re-initialize configuration
kml init --force

# Try starting with mock mode (no external dependencies)
kml start --model mock
```

#### Cause 2: Port Already in Use

```bash
# Check if ports are already occupied
# Linux/macOS
lsof -i :9010
lsof -i :6333
lsof -i :11434

# Windows
netstat -ano | findstr :9010
netstat -ano | findstr :6333
netstat -ano | findstr :11434

# Kill conflicting process or change ports in config.toml
```

#### Cause 3: Previous Instance Not Cleanly Shut Down

```bash
# Check for lock files
ls -la ~/.kamelot/*.lock

# Remove lock files (only if no Kamelot process is running)
rm ~/.kamelot/*.lock
```

#### Cause 4: Incompatible System Libraries

```bash
# Linux: Check FUSE library
ldconfig -p | grep fuse
# Expected: libfuse3.so.3

# Windows: Check WinFSP
# Look for WinFsp in Add/Remove Programs

# macOS: Check FUSE
kextstat | grep fuse
```

#### Cause 5: Logs Point to the Issue

```bash
# Check Kamelot logs
kml logs --tail 50

# Increase log verbosity
RUST_LOG=kamelot=debug kml start
```

---

## Qdrant Connection Refused

### Symptom

```
Error: Qdrant connection refused at http://localhost:6333
Error: Connection refused (os error 111)
[ERROR] qdrant_client::grpc: Failed to connect to Qdrant: transport error
```

### Possible Causes and Fixes

#### Cause 1: Qdrant Not Running

```bash
# Check if Qdrant process exists
# Linux/macOS
pgrep -a qdrant

# Windows
Get-Process qdrant -ErrorAction SilentlyContinue

# Start Qdrant
# Docker
docker start qdrant
# or
docker run -d --name qdrant -p 6333:6333 -p 6334:6334 qdrant/qdrant

# Native
qdrant &
```

#### Cause 2: Wrong Qdrant URL in Configuration

```toml
# Check ~/.kamelot/config.toml
[qdrant]
url = "http://localhost:6333"    # Should match Qdrant's listening address

# Test connection
curl http://localhost:6333/health
# Expected response: {"ok":true}
```

#### Cause 3: Qdrant Listening on Different Interface

```bash
# Check Qdrant binding
# If Qdrant is in a Docker container, it may be on a different network
# Check Docker network configuration

# Solution: Use host network mode
docker run -d --name qdrant --network host qdrant/qdrant
```

#### Cause 4: Port Conflict

```bash
# Check if port 6333 is already in use
# Linux/macOS
lsof -i :6333

# Windows
netstat -ano | findstr :6333

# If another process is using 6333, change Qdrant port
# In config.toml:
[qdrant]
url = "http://localhost:6334"

# Start Qdrant on alternate port
docker run -d --name qdrant -p 6334:6333 -p 6335:6334 qdrant/qdrant
```

---

## Model Not Found Errors

### Symptom

```
Error: Ollama model "qwen2-vl:7b-q4" not found
Error: pull model manifest: file does not exist
```

### Possible Causes and Fixes

#### Cause 1: Model Not Downloaded

```bash
# List available models
ollama list

# Pull the recommended model
ollama pull qwen2-vl:7b-q4

# Or use a smaller model if resources are limited
ollama pull nomic-embed-text
kml config set ollama.model "nomic-embed-text"
```

#### Cause 2: Wrong Model Name

```bash
# Check available models in Ollama
ollama list

# Verify model name in config
kml config show | grep model

# Common model names:
# - qwen2-vl:7b-q4 (recommended, 7B params, 4-bit quantized)
# - qwen2-vl:2b-q4 (smaller, faster, less accurate)
# - nomic-embed-text (text-only, very fast, 137M params)
```

#### Cause 3: Ollama Not Running

```bash
# Check Ollama status
curl http://localhost:11434/api/tags

# If connection refused, start Ollama
# Linux/macOS
ollama serve &

# Windows (if installed natively)
ollama serve

# Docker
docker start ollama
```

#### Cause 4: Network Issue for Model Download

```bash
# If behind a proxy, configure Ollama proxy
export HTTP_PROXY=http://proxy:8080
export HTTPS_PROXY=http://proxy:8080
ollama pull qwen2-vl:7b-q4
```

#### Fallback: Use Mock Mode

If no model is available, use mock embeddings for testing:

```bash
kml start --model mock
```

---

## Permission Denied

### Symptom

```
Error: Permission denied (os error 13)
Error: Access is denied. (os error 5)
```

### Possible Causes and Fixes

#### Cause 1: FUSE Mount Requires Permissions

```bash
# Linux: Add user to fuse group
sudo usermod -a -G fuse $USER
# Then log out and back in

# Or use allow_other in /etc/fuse.conf
echo "user_allow_other" | sudo tee -a /etc/fuse.conf
```

#### Cause 2: WinFSP Requires Administrator

```powershell
# Windows: Kamelot FUSE mount requires admin
# Run terminal as Administrator
# Or configure WinFSP for non-admin mounts
```

#### Cause 3: Cannot Read Source Files

```bash
# Check permissions on files to index
ls -la ~/Documents/

# Ensure Kamelot has read access
# If files are owned by root, run Kamelot with appropriate privileges
```

#### Cause 4: Cannot Write to Kamelot Data Directory

```bash
# Check permissions
ls -la ~/.kamelot/

# Fix permissions
chmod -R 700 ~/.kamelot
chown -R $USER:$USER ~/.kamelot
```

---

## Not Enough Space Errors

### Symptom

```
Error: Not enough space to write file
Error: Storage quota exceeded
Error: No space left on device (os error 28)
```

### Possible Causes and Fixes

#### Cause 1: Disk Full

```bash
# Check disk usage
df -h

# Check Kamelot data directory size
du -sh ~/.kamelot/

# Free up space
# - Remove old Qdrant snapshots
# - Clear query cache
# - Run garbage collection on flat store
kml store gc
```

#### Cause 2: Qdrant Index Too Large

```bash
# Check Qdrant storage size
du -sh ~/.kamelot/qdrant/

# Reduce HNSW parameters (uses less RAM/disk but slower search)
kml config set qdrant.hnsw_ef_construct 128
kml config set qdrant.hnsw_m 16

# Rebuild index with new parameters
kml reindex
```

#### Cause 3: Ledger Growth

```bash
# Check ledger size
du -sh ~/.kamelot/ledger/

# Compact ledger (removes old entries beyond retention period)
kml ledger compact --retention-days 365
```

#### Cause 4: Thumbnail Cache Too Large

```bash
# Clear thumbnail cache
kml cache clear --thumbnails

# Limit cache size in config
[thumbnail_cache]
max_size_mb = 500
```

---

## WinFSP Mount Fails

### Symptom

```
Error: WinFSP mount failed: error 0x80070005 (E_ACCESSDENIED)
Error: WinFSP mount failed: error 0x80070057 (E_INVALIDARG)
```

### Possible Causes and Fixes

#### Cause 1: Not Running as Administrator

```powershell
# Close and reopen terminal as Administrator
# Right-click on terminal -> Run as Administrator
kml start
```

#### Cause 2: WinFSP Not Installed

```powershell
# Check if WinFSP is installed
Get-WmiObject -Class Win32_Product | Where-Object {$_.Name -like "WinFsp*"}

# Install WinFSP
choco install winfsp
# Or download from https://winfsp.dev/rel/
```

#### Cause 3: Drive Letter Conflict

```powershell
# Check if K: is already in use
Get-PSDrive -PSProvider FileSystem

# Use a different drive letter
kml config set fuse.mount_point_windows "L:"
kml start
```

#### Cause 4: Antivirus Blocking WinFSP

```powershell
# Add exclusion for WinFSP driver
Add-MpPreference -ExclusionProcess "kamelot.exe"
Add-MpPreference -ExclusionPath "K:\"
```

---

## FUSE Mount Fails with Device or Resource Busy

### Symptom

```
Error: fuse_mount: device or resource busy
Error: fuse: mount failed: Device or resource busy
```

### Possible Causes and Fixes

#### Cause 1: Mount Point Already in Use

```bash
# Check if something is already mounted at /kml
mount | grep /kml

# Unmount existing mount
fusermount -u /kml    # Linux
umount /kml           # Linux/macOS

# Try alternate mount point
kml config set fuse.mount_point "/kml2"
kml start
```

#### Cause 2: Previous Kamelot Instance Not Cleaned Up

```bash
# Force unmount
sudo fusermount -uz /kml    # Linux
sudo umount -l /kml         # Linux (lazy unmount)

# macOS
sudo umount /kml

# Kill remaining Kamelot processes
pkill -9 kamelot
```

#### Cause 3: Filesystem Check Needed

```bash
# Check filesystem for issues
sudo fsck /dev/sda1   # Adjust device as needed

# Reboot and try again
sudo reboot
```

---

## Ollama Not Responding

### Symptom

```
Error: Ollama request failed: timeout after 60s
Error: Connection refused: 127.0.0.1:11434
```

### Possible Causes and Fixes

#### Cause 1: Ollama Not Running

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If connection refused, start Ollama
ollama serve &

# Docker
docker start ollama

# Check Docker logs
docker logs ollama
```

#### Cause 2: Ollama Not Accessible

```bash
# Check Ollama binding
# By default, Ollama listens on 127.0.0.1:11434
# Verify with:
ss -tlnp | grep 11434

# If bound to different address, update config
kml config set ollama.url "http://127.0.0.1:11434"
```

#### Cause 3: Model Loading Failed

```bash
# Check Ollama logs
# Native: Ollama logs to stdout
# Docker: docker logs ollama

# Pull fresh copy of model
ollama rm qwen2-vl:7b-q4
ollama pull qwen2-vl:7b-q4
```

#### Cause 4: GPU Issues

```bash
# Check if GPU is detected
ollama run qwen2-vl:7b-q4 --verbose

# If GPU not working, force CPU
# Linux: export OLLAMA_INTEL_GPU=0 (for Intel)
# Or set num_gpu_layers to 0
kml config set ollama.num_gpu_layers 0
```

---

## Search Returns No Results

### Symptom

Query returns zero results, or "No files found."

### Possible Causes and Fixes

#### Cause 1: No Files Indexed

```bash
# Check index status
kml status
# Expected: "Files indexed: 12345"

# Index files
kml index ~/Documents/

# Check indexing progress
kml status --watch
```

#### Cause 2: Search Query Too Specific

```bash
# Try simpler query
"budget spreadsheet" vs "Q3 2026 budget spreadsheet with marketing projections"

# Check if query terms exist in any file
kml find "budget"

# Use wildcards
kml find "budget*"
```

#### Cause 3: Using Mock Mode

```bash
# Mock mode returns random results
# Switch to real model
kml start --model ollama
```

#### Cause 4: Qdrant Index Empty

```bash
# Check Qdrant collection
curl http://localhost:6333/collections/kamelot
# Check "points_count"

# Rebuild index
kml reindex
```

#### Cause 5: Indexing Excluded the Files

```bash
# Check exclude patterns
kml config show | grep exclude_patterns

# Temporarily disable exclusions
kml index ~/Documents/ --no-exclude
```

---

## Search Returns Irrelevant Results

### Symptom

Results appear but don't match the query's intent.

### Possible Causes and Fixes

#### Cause 1: Poor Embedding Quality

```bash
# Switch to a better model
ollama pull nomic-embed-text
kml config set ollama.model "nomic-embed-text"

# Or use the full recommended model
ollama pull qwen2-vl:7b-q4
kml config set ollama.model "qwen2-vl:7b-q4"
```

#### Cause 2: Query Too Short

Single-word queries often produce poor results. Try describing the file more completely.

#### Cause 3: Index Needs Refresh

```bash
# Re-index with better parsing
kml reindex --force

# Check for parsing errors
kml logs | grep -i "parse error"
```

#### Cause 4: HNSW Parameters Not Optimal

```toml
# In config.toml, increase search depth for better accuracy
[qdrant]
hnsw_ef_search = 512    # Higher = more accurate, slower
hnsw_ef_construct = 512 # Higher = better index quality
```

---

## Indexing Is Too Slow

### Symptom

Indexing takes hours, or files per second is very low.

### Possible Causes and Fixes

#### Cause 1: CPU-Only Embedding

```bash
# Check if GPU is being used
kml doctor | grep GPU

# If no GPU, use mock mode for testing
# Or use smaller, faster model
kml config set ollama.model "nomic-embed-text"
```

#### Cause 2: Large Binary Files

```bash
# Exclude large files from indexing
kml config set indexing.max_file_size_mb 50

# Exclude non-text files
kml config set indexing.exclude_patterns ["**/*.iso", "**/*.dmg", "**/*.exe"]

# Re-index without large files
kml reindex --exclude-large
```

#### Cause 3: Too Many Small Files

```bash
# Increase batch size for GPU processing
kml config set indexing.batch_size 256

# Increase parallelism
kml config set indexing.parse_threads 8
```

#### Cause 4: Slow Storage

```bash
# Move Kamelot data to SSD
# Symlink ~/.kamelot to SSD location
mv ~/.kamelot /ssd/kamelot
ln -s /ssd/kamelot ~/.kamelot
```

---

## Kamelot Uses Too Much RAM

### Symptom

System feels slow, swap is being used, or RAM usage exceeds expectations.

### Possible Causes and Fixes

#### Cause 1: Qdrant HNSW Index in RAM

```bash
# Reduce HNSW memory usage
kml config set qdrant.hnsw_m 16        # Default: 32, reduces RAM by ~30%
kml config set qdrant.hnsw_ef_construct 128  # Default: 256, reduces RAM by ~15%

# Rebuild index
kml reindex
```

#### Cause 2: Embedding Model in RAM (CPU Mode)

```bash
# Use smaller model
kml config set ollama.model "nomic-embed-text"

# Or unload model when idle
kml config set ollama.keep_alive 0     # Unload after each query
```

#### Cause 3: Thumbnail Cache Too Large

```bash
# Clear or limit thumbnail cache
kml cache clear --thumbnails
kml config set thumbnail_cache.max_size_mb 200
```

#### Cause 4: Too Many Vectors in Qdrant

```bash
# Check vector count
curl http://localhost:6333/collections/kamelot

# Prune old or unused files from index
kml index prune --older-than 365
```

---

## Can't Open Files from Kamelot Drive

### Symptom

Files appear in search results but cannot be opened, or open as empty/corrupt.

### Possible Causes and Fixes

#### Cause 1: Original File Was Deleted

```bash
# Check if original file still exists
kml file info <inode>

# If file was deleted, it can still be recovered from flat store
kml rollback --inode <inode> --state-at "2026-06-01T00:00:00Z"
```

#### Cause 2: FUSE/WinFSP Mount Not Working

```bash
# Test FUSE mount
ls -la /kml

# If empty or error, remount
kml stop
kml start
```

#### Cause 3: Permission Issue on Virtual Drive

```bash
# Check permissions
ls -la /kml

# Fix by running Kamelot with appropriate permissions
```

#### Cause 4: Application Cannot Read Virtual File

Some applications may have issues reading files from FUSE/WinFSP mounts. Try:
- Copying the file to a local directory first: `kml get <inode> --output ~/Desktop/file.ext`
- Opening the file via its original path (use `kml file info <inode>` to find original path)

---

## Rollback Fails or Does Nothing

### Symptom

`kml rollback` completes without error but files are unchanged.

### Possible Causes and Fixes

#### Cause 1: No Changes in Specified Time Range

```bash
# Check ledger history for the inode
kml ledger history <inode>

# Verify timestamps
# Rollback only affects entries within the time range
```

#### Cause 2: Rollback to Same State

```bash
# If no file changes occurred in the specified window, rollback is a no-op
# Try a larger time window
kml rollback --inode <inode> --minutes 120
```

#### Cause 3: Ledger Corruption

```bash
# Verify ledger integrity
kml ledger verify

# Repair if needed
kml ledger repair
```

---

## Configuration Changes Not Applied

### Symptom

Changed config.toml but Kamelot behavior hasn't changed.

### Possible Causes and Fixes

#### Cause 1: Daemon Needs Restart

```bash
# Most configuration changes require restart
kml restart

# Or:
kml stop
kml start
```

#### Cause 2: Config File in Wrong Location

```bash
# Verify config location
kml config show | grep config_path

# Expected: ~/.kamelot/config.toml
```

#### Cause 3: Typo in Config Key

```bash
# Validate config
kml config validate

# Check for typos
kml config show
```

---

## General Debugging Checklist

1. **Check version**: `kml --version` — are you on the latest?
2. **Run doctor**: `kml doctor` — automated diagnostics
3. **Check logs**: `kml logs --tail 100` — look for errors
4. **Verify dependencies**: 
   - `curl http://localhost:6333/health` (Qdrant)
   - `curl http://localhost:11434/api/tags` (Ollama)
5. **Try mock mode**: `kml start --model mock` — isolates model issues
6. **Check disk space**: `df -h` — ensure enough free space
7. **Check RAM**: `free -h` (Linux/macOS) or task manager (Windows)
8. **Check processes:**
   - `pgrep -a kamelot` (Linux/macOS)
   - `Get-Process kamelot` (Windows)
9. **Search known issues**: [github.com/kamelot/kamelot/issues](https://github.com/kamelot/kamelot/issues)
10. **Ask for help**: [discord.gg/kamelot](https://discord.gg/kamelot)

### Still Stuck?

If the troubleshooting steps above don't resolve your issue:

1. Collect debug information:
   ```bash
   kml doctor --verbose > kamelot-debug.txt
   kml logs --tail 200 >> kamelot-debug.txt
   ```
2. Open an issue on GitHub with the debug output
3. Include: OS, Kamelot version, hardware specs, config (redact secrets)
4. Join the Discord for real-time community support

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com