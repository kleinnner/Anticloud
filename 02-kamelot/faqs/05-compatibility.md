                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                
# FAQ — Compatibility

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. [Does It Work with My Antivirus?](#does-it-work-with-my-antivirus)
2. [Can I Use It with Cloud Sync Services?](#can-i-use-it-with-cloud-sync-services)
3. [Does It Support Network Drives?](#does-it-support-network-drives)
4. [What File Formats Are Supported?](#what-file-formats-are-supported)
5. [Does It Work with My IDE?](#does-it-work-with-my-ide)
6. [Can I Use It with Backup Software?](#can-i-use-it-with-backup-software)
7. [Does It Support Encrypted Drives?](#does-it-support-encrypted-drives)
8. [Can I Run It in a Virtual Machine?](#can-i-run-it-in-a-virtual-machine)
9. [Does It Work with Windows Subsystem for Linux?](#does-it-work-with-windows-subsystem-for-linux)
10. [Can I Use Kamelot with RAID Configurations?](#can-i-use-kamelot-with-raid-configurations)
11. [Does It Work with Apple's FileVault or BitLocker?](#does-it-work-with-apples-filevault-or-bitlocker)
12. [What About Portable Apps and USB Drives?](#what-about-portable-apps-and-usb-drives)

---

## Does It Work with My Antivirus?

Kamelot works with most antivirus software. However, some aggressive real-time scanning configurations may cause issues.

### Known Compatible Antivirus Software

| Antivirus | Status | Notes |
|-----------|--------|-------|
| Windows Defender | **Compatible** | Built-in, no issues |
| Malwarebytes | **Compatible** | Minor scan delay on first file access |
| Bitdefender | **Compatible** | May need exclusion for `~/.kamelot` |
| Kaspersky | **Compatible** | Add exclusion for virtual drive mount point |
| Norton | **Compatible** | May flag WinFSP driver as potentially unwanted |
| ESET | **Compatible** | Add exclusion for Kamelot data directory |
| Sophos | **Compatible** | No known issues |
| CrowdStrike | **Compatible** | Enterprise deployments may need whitelisting |
| McAfee | **Compatible** | May need exclusion for Kamelot process |
| Avast | **Compatible** | No known issues |
| AVG | **Compatible** | No known issues |

### Troubleshooting Antivirus Conflicts

**Symptom**: Kamelot fails to start, or files disappear from the virtual drive.

**Solution**: Add exclusions for:
1. Kamelot daemon binary (`kamelot.exe` / `kamelot`)
2. Kamelot data directory (`~/.kamelot/`)
3. Kamelot virtual drive mount point (`/kml` or `K:\`)
4. Qdrant storage directory (`~/.kamelot/qdrant/`)

```powershell
# Windows: Add Defender exclusion
Add-MpPreference -ExclusionPath "$env:USERPROFILE\.kamelot"
Add-MpPreference -ExclusionPath "K:\"
Add-MpPreference -ExclusionProcess "kamelot.exe"
```

**Why antivirus may interfere**: Kamelot creates a virtual filesystem via WinFSP/FUSE. Some antivirus software performs behavioral analysis on filesystem drivers and may flag the FUSE/WinFSP driver as suspicious. The encrypted flat store files may also trigger heuristic analysis because they appear as random binary data.

---

## Can I Use It with Cloud Sync Services?

Kamelot works alongside cloud sync services with some considerations:

### Supported Cloud Services

| Service | Status | Notes |
|---------|--------|-------|
| Dropbox | **Compatible** | Index sync folder normally; avoid indexing Dropbox cache |
| Google Drive | **Compatible** | Use Google Drive for Desktop; index the local mirror |
| OneDrive | **Compatible** | Index the OneDrive folder; exclude `.one` cache files |
| Sync.com | **Compatible** | Index the local sync folder |
| Box Drive | **Compatible** | Index the Box folder |
| iCloud Drive | **Compatible** | Index `~/Library/Mobile Documents/` on macOS |
| Nextcloud | **Compatible** | Index the local sync folder |
| Syncthing | **Compatible** | Index the synced folder |
| Resilio Sync | **Compatible** | Index the synced folder |

### Best Practices

1. **Index only one copy**: If files are synced to a local folder, you don't need to also index the original location.
2. **Exclude sync metadata**: Most sync services create hidden metadata files that don't need indexing:
   ```toml
   [indexing]
   exclude_patterns = [
       "**/.dropbox.cache/**",
       "**/.com.google.Cloud.**",
       "**/*.one/**",
       "**/desktop.ini",
       "**/.DS_Store"
   ]
   ```
3. **Avoid indexing during active sync**: Large sync operations may cause file locking conflicts. Schedule indexing during idle time.

### What Not to Do

- Do NOT point Kamelot's flat store at a cloud sync folder (the encrypted blobs will be synced unnecessarily)
- Do NOT index both your original files and the cloud sync copy (duplicate results)
- Do NOT expect Kamelot to keep files in sync across devices (use the cloud sync service for that)

---

## Does It Support Network Drives?

### Direct Indexing of Network Drives

Kamelot can index network drives, but performance will be significantly degraded:

| Network Type | Indexing Speed | Query Latency | Recommendation |
|-------------|---------------|---------------|----------------|
| Local NAS (Gigabit Ethernet) | 5-15 files/sec | +50-200ms | Acceptable for moderate use |
| Remote NAS (100 Mbps) | 2-5 files/sec | +200-1000ms | Not recommended |
| SMB/CIFS share | 3-10 files/sec | +100-500ms | Use with caution |
| NFS share | 5-15 files/sec | +50-200ms | Acceptable |
| SSHFS | 1-3 files/sec | +200-500ms | Not recommended |
| WebDAV | 0.5-2 files/sec | +500-2000ms | Not supported |

### Recommended Approach: Sync Then Index

For optimal performance with network storage:
1. Sync the network folder to a local directory (using `rsync`, `robocopy`, or the cloud sync service)
2. Point Kamelot at the local copy
3. Set up periodic re-sync (e.g., hourly cron job)

### Samba/CIFS Configuration for Kamelot

If you must index a Samba share directly:
```toml
[indexing]
# Mount network drive first, then index
network_drives = ["/mnt/nas/documents"]
# Increase timeouts for network latency
connection_timeout_seconds = 30
read_timeout_seconds = 60
```

---

## What File Formats Are Supported?

Kamelot supports parsing and indexing of the following file formats:

### Fully Supported (Full Content Extraction)

| Category | Formats | Extraction |
|----------|---------|------------|
| Office Documents | DOCX, XLSX, PPTX, ODT, ODS, ODP, RTF | Full text + metadata |
| PDF | PDF (1.4-2.0) | Full text + metadata + images |
| Code | .rs, .py, .js, .ts, .go, .java, .c, .cpp, .h, .hpp, .rb, .php, .swift, .kt, .scala, .lua, .r, .m, .mm, .pl, .sh, .bash, .zsh, .fish, .ps1, .bat, .cmd, .sql, .html, .css, .scss, .less, .xml, .json, .yaml, .yml, .toml, .ini, .cfg, .conf, .md, .rst, .tex, .bib, .dockerfile, .makefile, .cmake, .gradle, .sln, .csproj | Syntax parsing + full text |
| Markup | HTML, XML, Markdown, reStructuredText, LaTeX | Full text + metadata |
| Data | JSON, YAML, TOML, CSV, TSV, XML | Full text + structured data |
| Images | JPEG, PNG, GIF, BMP, TIFF, WebP, SVG, ICO, PSD, AI, EPS | Visual embedding + OCR text |
| Email | EML, MSG | Full text + attachments + metadata |
| Archives | ZIP, TAR, GZ, BZ2, XZ, ZST, 7Z, RAR | File listing + metadata |
| Fonts | TTF, OTF, WOFF, WOFF2 | Metadata only |
| Video | MP4, MOV, AVI, MKV, WebM, FLV | Metadata + thumbnail |
| Audio | MP3, WAV, FLAC, OGG, AAC, WMA, M4A | Metadata + waveform embedding |

### Limited Support (Metadata Only)

| Category | Formats | Notes |
|----------|---------|-------|
| CAD | DWG, DXF, STP, STEP, IGES | Metadata + filename |
| 3D | OBJ, STL, FBX, GLTF, BLEND | Metadata + filename |
| Database | SQLite, MDB, ACCDB, FDB | Metadata + schema |
| Virtual Machine | VMDK, VHD, VHDX, QCOW2, OVA | Metadata only |
| Binary | EXE, DLL, SO, DYLIB, WASM | Metadata + strings extraction |
| Encrypted | Any encrypted format | Filename + metadata only |

### Not Supported

| Category | Reason | Future Support |
|----------|--------|---------------|
| Encrypted PDFs (password-protected) | Cannot read content without password | Planned (prompt for password) |
| DRM-protected content | Legal restrictions | Not planned |
| Database binary formats (direct) | Must export to text first | Not planned |

---

## Does It Work with My IDE?

Kamelot works with any IDE that can access files through the filesystem.

### IDE Integration

| IDE | Status | Recommended Approach |
|-----|--------|---------------------|
| VS Code | **Excellent** | Use Kamelot virtual drive as workspace folder |
| JetBrains (IntelliJ, PyCharm, etc.) | **Excellent** | Open files via Omnibox; configure Kamelot as file navigation tool |
| Vim/Neovim | **Excellent** | Use `:e /kml/...` or `kml find --vim` |
| Emacs | **Excellent** | Use `C-x C-f /kml/...` |
| Sublime Text | **Excellent** | Open from Kamelot drive |
| Zed | **Excellent** | Native integration via project panels |
| Helix | **Excellent** | Use `:open /kml/...` |

### VS Code Extension

A community-maintained VS Code extension is available:
- Search files by semantic content from within VS Code
- Open files directly via the Omnibox
- Display file context and relevance scores
- Quick open with `Ctrl+Shift+K`

### Vim/Neovim Integration

```vim
" Map leader-f to search with Kamelot
nnoremap <leader>f :call KamelotSearch()<CR>

function! KamelotSearch()
  let query = input("Search: ")
  let results = systemlist("kml find --json '" . query . "' | jq -r '.[].path'")
  call fzf#run({'source': results, 'sink': 'e'})
endfunction
```

---

## Can I Use It with Backup Software?

### Backup Compatibility

| Backup Software | File Index | Flat Store | Qdrant | Recommendations |
|----------------|------------|------------|--------|----------------|
| rsync / rclone | **Yes** | Yes (as files) | No | Backup flat store regularly |
| Time Machine (macOS) | **Yes** | Yes (via exclude list) | No | Exclude Qdrant storage |
| Windows Backup | **Yes** | Yes | No | Use for file index only |
| Veeam | **Yes** | Yes | No | Snapshot-based |
| Acronis | **Yes** | Yes | No | Use file-level backup |
| Duplicati | **Yes** | Yes | No | Encrypted backup |
| BorgBackup | **Yes** | Yes | No | Deduplication-friendly |
| Restic | **Yes** | Yes | No | Efficient for flat store |

### What to Back Up

| Component | Back Up? | Backup Strategy |
|-----------|----------|-----------------|
| Original files | Yes (already in your backup) | Use your existing backup strategy |
| Encrypted flat store | Yes | rsync/borg/restic of `~/.kamelot/store/` |
| .aioss ledger | **Critical** | Back up `~/.kamelot/ledger/` — this is your history |
| Qdrant index | Optional | Snapshot via Qdrant API; can be rebuilt from ledger |
| Encryption keys | **Critical** | Export and store securely offline |
| Configuration | Recommended | Back up `~/.kamelot/config.toml` |

### Qdrant Backup

```bash
# Create Qdrant snapshot
curl -X POST http://localhost:6333/snapshots

# List snapshots
curl http://localhost:6333/snapshots

# Download snapshot (for offsite backup)
curl -O http://localhost:6333/snapshots/kamelot-2026-06-19.snapshot
```

---

## Does It Support Encrypted Drives?

Yes. Kamelot works transparently with encrypted storage solutions.

### Supported Encryption Layers

| Encryption Layer | Support | Notes |
|-----------------|---------|-------|
| FileVault (macOS) | **Full** | Kamelot runs above FileVault; all I/O is decrypted by OS |
| BitLocker (Windows) | **Full** | Kamelot runs above BitLocker; no additional configuration |
| LUKS (Linux) | **Full** | Kamelot runs above LUKS; no additional configuration |
| VeraCrypt | **Full** | Mount VeraCrypt volume, point Kamelot at mount path |
| gocryptfs | **Full** | Works with encrypted overlay filesystem |
| eCryptfs | **Full** | Works with encrypted directory |
| EncFS | **Compatible** | Works, but EncFS has known security issues |

### How Encryption Layers Interact

```
Application → Kamelot FUSE mount → Original Filesystem
                                         ↑
                              Disk Encryption (FileVault/BitLocker/LUKS)
                                         ↑
                                    Physical Disk
```

Kamelot adds another encryption layer:
```
Application → Kamelot FUSE mount (decrypted)
                  ↓
           Kamelot daemon
                  ↓
     +------+------+------+
     |      |      |      |
  Flat Store  Ledger  Qdrant
  (encrypted) (hash) (vectors)
     |      |      |      |
     +------+------+------+
                  ↓
           Original Filesystem
           (FileVault/ BitLocker/LUKS)
                  ↓
           Physical Disk
```

This means files are encrypted twice: once by Kamelot's per-file encryption, and once by the disk encryption layer. This provides defense in depth.

---

## Can I Run It in a Virtual Machine?

Yes. Kamelot runs well in virtual machines if the VM has sufficient resources.

### VM Requirements

| Hypervisor | GPU Passthrough Required? | Performance |
|-----------|-------------------------|-------------|
| VMware Workstation/Player | No (CPU mode) | Good |
| VirtualBox | No (CPU mode) | Acceptable |
| Hyper-V | No (CPU mode) | Good |
| Proxmox (KVM) | Recommended for GPU | Excellent |
| Parallels Desktop (macOS) | No (CPU mode) | Good |
| QEMU/KVM | Recommended for GPU | Excellent |

### GPU Passthrough for VMs

For GPU-accelerated Kamelot in a VM:

**NVIDIA (vGPU or passthrough):**
```bash
# Enable IOMMU in host kernel
# Pass through NVIDIA GPU to VM
# Install NVIDIA drivers in VM
# Kamelot detects GPU automatically
```

**Proxmox example:**
```bash
# VM configuration
args: -device vfio-pci,host=01:00.0
```

### Vagrant/Dev Environment

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/24.04"
  config.vm.provider "virtualbox" do |vb|
    vb.memory = "8192"
    vb.cpus = 4
  end
  config.vm.provision "shell", inline: <<-SHELL
    curl -fsSL https://ollama.ai/install.sh | sh
    curl -O https://releases.kamelot.ai/latest/kamelot-linux-x86_64.tar.gz
    tar -xzf kamelot-linux-x86_64.tar.gz
    sudo mv kamelot /usr/local/bin/
    kamelot init --mock
  SHELL
end
```

---

## Does It Work with Windows Subsystem for Linux?

### WSL1 vs WSL2

| Feature | WSL1 | WSL2 |
|---------|------|------|
| Kamelot CLI | Yes | Yes |
| FUSE mount | No (WSL1 lacks FUSE) | Yes (WSL2 supports FUSE) |
| WinFSP bridge | No | Limited |
| GPU access | No | Yes (CUDA via WSL2) |
| GUI (Omnibox) | Yes (Windows UI) | Yes (Windows UI) |

### Recommended: WSL2 with GPU

```bash
# Install Kamelot in WSL2
curl -O https://releases.kamelot.ai/latest/kamelot-linux-x86_64.tar.gz
tar -xzf kamelot-linux-x86_64.tar.gz
sudo mv kamelot /usr/local/bin/

# Qdrant and Ollama run in WSL2
kml init
kml start

# Use Kamelot CLI from WSL2
kml find "architecture diagram"
```

### Hybrid Setup: Native Windows Kamelot + WSL2 Access

Better performance can be achieved by running Kamelot natively on Windows (via WinFSP) and accessing the virtual drive from WSL2:

```bash
# On Windows: install and start Kamelot
# On WSL2: access Kamelot virtual drive at /mnt/k
ls /mnt/k/
```

---

## Can I Use Kamelot with RAID Configurations?

Yes. Kamelot operates above the RAID layer and is transparent to RAID configuration.

| RAID Level | Support | Notes |
|-----------|---------|-------|
| RAID 0 | Yes | No redundancy; flat store striping |
| RAID 1 | Yes | Mirroring provides redundancy |
| RAID 5 | Yes | Parity protection for flat store |
| RAID 6 | Yes | Dual parity protection |
| RAID 10 | Yes | Best performance for indexing |
| JBOD/Spanned | Yes | Spans across drives |
| ZFS (any config) | Yes | Kamelot + ZFS = excellent combo |

### Performance Considerations

| Configuration | Indexing | Search | Recovery |
|--------------|----------|--------|----------|
| Single NVMe | 1x baseline | 1x baseline | 1x baseline |
| RAID 0 (2 NVMe) | 1.5-2x | 1.2-1.5x | N/A (no redundancy) |
| RAID 1 (2 NVMe) | 1x | 1.5-2x (read from both) | Fast |
| RAID 10 (4 NVMe) | 1.5-2x | 2-3x | Fast |
| ZFS (mirror) | 0.8-0.9x | 1.5-2x | Very fast |

---

## Does It Work with Apple's FileVault or BitLocker?

Yes. Kamelot works transparently with these full-disk encryption solutions.

- **FileVault (macOS)**: Kamelot runs above FileVault. FileVault encrypts the entire disk at the block level; Kamelot sees decrypted files and applies its own per-file encryption layer.
- **BitLocker (Windows)**: Same as FileVault — Kamelot operates above the BitLocker decryption layer.

### Dual Encryption

Your files are encrypted twice:
1. **Layer 1 (OS-level)**: FileVault/BitLocker — protects against physical theft of the drive
2. **Layer 2 (Kamelot)**: XChaCha20-Poly1305 per-file — protects against local access to the flat store

This provides defense in depth. An attacker would need to bypass or compromise both encryption layers.

---

## What About Portable Apps and USB Drives?

### USB Drives

Kamelot can index files on USB drives:

```bash
# Index a USB drive
kml index /media/usb/projects

# The files appear in search results immediately
kml find "project files from usb"
```

**Note**: If the USB drive is removed, files from that drive remain in the index but cannot be opened until the drive is reconnected. Search results show the files but attempts to open them will fail with a "file not found" error.

### Portable Kamelot

You can run Kamelot from a USB drive (portable mode):

```powershell
# Windows: Run from USB
.\kamelot.exe --portable --data-dir E:\kamelot-data
```

```bash
# Linux: Run from USB
./kamelot --portable --data-dir /mnt/usb/kamelot-data
```

Portable mode:
- Stores all data on the USB drive (config, index, ledger, store)
- Doesn't modify the host system (no services, no registry entries)
- Requires FUSE/WinFSP on the host system (may need admin install)

### Limitations of Portable Mode

- The virtual drive mount may require admin/root on some systems
- Performance is limited by USB throughput (especially USB 2.0)
- The USB drive should be SSD for acceptable performance
- Not recommended for indexing >10,000 files

---

## Does Kamelot Work with Windows Storage Spaces?

Yes. Windows Storage Spaces (storage virtualization in Windows) is compatible with Kamelot:

| Configuration | Support | Notes |
|--------------|---------|-------|
| Simple (no resilience) | Yes | Treats the pool as a single volume |
| Mirror (two-way) | Yes | Kamelot reads from the virtual volume |
| Mirror (three-way) | Yes | No special handling needed |
| Parity | Yes | Read performance may be slower |
| Tiered (SSD + HDD) | Yes | Kamelot benefits from SSD tier for index |

Kamelot operates at the volume level and is transparent to the underlying storage configuration. No special configuration is needed.

---

## Does Kamelot Work with Linux LVM?

Yes. Kamelot is fully compatible with Linux Logical Volume Manager (LVM):

| LVM Feature | Compatibility | Notes |
|-------------|--------------|-------|
| Linear volumes | Yes | Standard configuration |
| Striped volumes | Yes | May improve indexing throughput |
| Mirrored volumes | Yes | Read performance may improve |
| Thin provisioning | Yes | Monitor available space to avoid thin pool exhaustion |
| Snapshots | Yes | Use for consistent Kamelot backups |
| RAID volumes | Yes | Kamelot benefits from RAID performance |

---

## Does Kamelot Work with Docker Volumes?

Yes. Kamelot can index files stored in Docker volumes:

```bash
# Index a Docker volume's data
# First, find the volume mount point
docker volume inspect my-volume
# Output shows Mountpoint, e.g., /var/lib/docker/volumes/my-volume/_data

# Index that path
kml index /var/lib/docker/volumes/my-volume/_data
```

### Considerations

- Docker overlay filesystems may have performance overhead for file watching
- Bind-mounted host directories perform better than named Docker volumes
- Changes made inside containers are visible to Kamelot if the files are on a shared mount

---

## Does Kamelot Work with Linux Namespaces and Containers?

Kamelot can run inside containers and Linux namespaces:

| Environment | Works? | Notes |
|-------------|--------|-------|
| Docker container | Yes | Requires FUSE device access (`--device /dev/fuse`) |
| Podman container | Yes | Requires `--privileged` for FUSE |
| LXC/LXD container | Yes | Requires FUSE kernel module in host |
| systemd-nspawn | Yes | Requires `--capability CAP_SYS_ADMIN` |
| Flatpak | Not tested | May require filesystem access permissions |
| Snap | Yes | Classic confinement recommended |

### Docker Example

```dockerfile
FROM ubuntu:24.04

RUN apt-get update && apt-get install -y fuse3 libfuse3-3
COPY kamelot /usr/local/bin/kamelot

ENTRYPOINT ["kamelot", "start"]
```

```bash
docker run --device /dev/fuse --cap-add SYS_ADMIN kamelot
```

---

## Does Kamelot Work with macOS Time Machine?

Time Machine creates local snapshots that Kamelot can index. However, there are important considerations:

### Compatibility

| Feature | Works? | Notes |
|---------|--------|-------|
| Indexing Time Machine backups | Not recommended | Backup volumes are read-only and may change |
| Indexing files in backup bundle | No | The `.backupbundle` format is proprietary |
| Indexing standard files | Yes | Regular files on APFS volumes |
| File exclusion from Time Machine | Yes | Use Time Machine preferences to exclude `.kamelot` directory |

### Recommendation

Exclude the Kamelot data directory from Time Machine (it has its own backup mechanism):

```bash
# Add to Time Machine exclusion list
sudo tmutil addexclusion ~/.kamelot
```

Back up the Kamelot data directory using `kml backup` (planned feature) or direct file copy instead.

---

## Does Kamelot Work with Samba/CIFS File Sharing?

Kamelot can serve files over Samba/CIFS by sharing the Kamelot FUSE mount:

### Sharing the Kamelot Virtual Drive over Samba

```bash
# Edit /etc/samba/smb.conf
[kamelot]
   path = /kml
   browseable = yes
   read only = yes
   guest ok = no
   valid users = @kamelot-users

# Restart Samba
sudo systemctl restart smbd
```

### Accessing Kamelot from Another Machine

```powershell
# Windows client: mount as network drive
net use K: \\server\kamelot
```

### Limitations

- Remote FUSE access via Samba adds 50-200ms latency per operation
- Samba share of FUSE mount is not officially supported; some operations may fail
- Performance over WAN is not acceptable; use only on LAN

---

## Does Kamelot Work with NFS Export of the Virtual Drive?

Similar to Samba, the Kamelot FUSE mount can be exported via NFS:

```bash
# /etc/exports
/kml    192.168.1.0/24(rw,sync,no_subtree_check,no_root_squash)

# Export the filesystem
sudo exportfs -a
sudo systemctl restart nfs-kernel-server
```

### NFS Considerations

| Factor | Impact |
|--------|--------|
| Latency | +20-50ms per FUSE operation over NFS |
| Caching | NFS client caching may show stale results |
| Locking | NFS file locking may conflict with Kamelot |
| Permissions | `no_root_squash` may be needed for file access |

NFS export of FUSE mounts is known to have issues with some operations and is not recommended for production use.

---

## Does Kamelot Support Filesystem Compression?

Kamelot is transparent to filesystem-level compression:

| Filesystem | Compression | Compatibility |
|------------|-------------|---------------|
| ZFS | zstd, lz4, gzip | Full — Kamelot operates above compression |
| Btrfs | zstd, lzo, zlib | Full — compression is transparent |
| NTFS | Compact LZX | Full — Windows handles decompression |
| APFS | Native compression | Full — macOS handles decompression |
| ext4 | No native compression | N/A |

Kamelot's encrypted flat store does not benefit from filesystem compression (encrypted data is incompressible), but the original files on disk may be compressed by the filesystem. This does not affect Kamelot's operation.

---

## Does Kamelot Support Deduplication Filesystems?

Kamelot is compatible with deduplication at the filesystem level:

| Filesystem | Deduplication | Notes |
|------------|--------------|-------|
| ZFS | Block-level dedup | Compatible — Kamelot sees deduplicated blocks |
| Btrfs | Extent-level dedup | Compatible |
| Windows (Data Deduplication) | File-level dedup | Compatible — Kamelot sees rehydrated files |
| VDO (Linux) | Block-level dedup | Compatible |

Kamelot does not perform its own content-based deduplication across files. Each file is indexed independently regardless of content duplication. Filesystem-level deduplication reduces physical storage usage transparently.

---

## Does Kamelot Work with APFS Features on macOS?

Kamelot works with Apple's APFS filesystem features:

| APFS Feature | Compatibility | Notes |
|-------------|--------------|-------|
| Cloning (copy-on-write) | Yes | File clones are indexed as separate files |
| Snapshots | Yes | Can back up from APFS snapshots |
| Encryption (per-volume) | Yes | Operates above encryption layer |
| Space sharing | Yes | Multiple volumes share space transparently |
| Hard links | Yes | Each hard link is indexed separately |
| Sparse files | Yes | Indexed like regular files |
| TRIM | Not affected | TRIM works normally on the underlying SSD |

---

## Does Kamelot Support Linux Filesystem Features?

| Feature | Compatibility | Notes |
|---------|--------------|-------|
| OverlayFS | Compatible | Index the merged view |
| tmpfs | Compatible | Not recommended for persistent storage |
| ramfs | Compatible | Not recommended |
| FUSE (stacked) | Limited | Running Kamelot on another FUSE FS may cause recursion |
| cifs (mounted) | Compatible | Performance degrades with network latency |
| nfs (mounted) | Compatible | Performance degrades |
| btrfs subvolumes | Compatible | Index each subvolume as needed |
| eCryptfs | Compatible | Files are encrypted twice (by eCryptfs and Kamelot) |
| ext4 encryption | Compatible | Operates above encryption layer |

---

## Can I Use Kamelot with Home Directory Encryption?

Yes. Kamelot works alongside home directory encryption solutions:

| Solution | Platform | Compatibility |
|----------|----------|--------------|
| LUKS (full disk) | Linux | Full — entire disk encrypted |
| ecryptfs | Linux | Full — Kamelot runs above encryption |
| systemd-homed | Linux | Full — compatible with LUKS2 home directories |
| fscrypt | Linux | Full — per-directory encryption |
| Windows EFS | Windows | Full — transparent to Kamelot |
| macOS FileVault | macOS | Full — full disk encryption |

In all cases, Kamelot operates above the encryption layer. The OS decrypts files transparently before Kamelot reads them. Kamelot then applies its own per-file encryption for the flat store.

---

## Can I Run Multiple Instances of Kamelot on the Same Machine?

Yes. Multiple Kamelot instances can run simultaneously on the same machine:

```bash
# Instance 1 (default)
kml start --data-dir ~/.kamelot1 --port 9011

# Instance 2
kml start --data-dir ~/.kamelot2 --port 9012
```

### Configuration Requirements

| Setting | Instance 1 | Instance 2 |
|---------|-----------|-----------|
| Data directory | `~/.kamelot1` | `~/.kamelot2` |
| Daemon port | 9011 | 9012 |
| Qdrant URL | `localhost:6333` | `localhost:6334` |
| FUSE mount | `/kml1` | `/kml2` |
| Ollama URL | `localhost:11434` | Shared (can share) |

### Use Cases

- Separate work and personal file indexes
- Different embedding models for different corpora
- Testing new versions alongside production
- Isolated indexes for different clients/projects

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

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
