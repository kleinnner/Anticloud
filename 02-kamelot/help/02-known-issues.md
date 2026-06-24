                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                
# Known Issues — Current Limitations and Workarounds

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. [Version 0.1.0 Known Issues](#version-010-known-issues)
2. [Version 0.2.0 Known Issues](#version-020-known-issues)
3. [Platform-Specific Known Issues](#platform-specific-known-issues)
4. [Feature Limitations](#feature-limitations)
5. [Scalability Limitations](#scalability-limitations)
6. [Integration Limitations](#integration-limitations)
7. [Planned Fix Versions](#planned-fix-versions)

---

## Version 0.1.0 Known Issues

### KML-KNOWN-001: No Query Directory Listing (FUSE readdir for query paths returns empty)

**Description:** The Kamelot virtual drive at `/kml` correctly lists Synchronous Workspaces and the file hierarchy. However, the "query results" virtual directory (`/kml/_query/<query>/`) exists but returns an empty directory listing via FUSE `readdir`. Files are accessible by direct path navigation but the query-based directory is non-functional.

**Impact:** Low. The Omnibox search works correctly; only the FUSE-based query directory is affected.

**Workaround:** Use the Omnibox (`Ctrl+Space`) for all search operations. Use `kml find` in the terminal for CLI-based search. Direct path access to known files works normally.

**Planned Fix:** v0.2.0

### KML-KNOWN-002: WinFSP Driver Is Minimal (Read-Only, No Write Support)

**Description:** The WinFSP driver on Windows currently supports reading files from the Kamelot virtual drive but does not support write operations. You cannot save files directly to the Kamelot mount (`K:\`).

**Impact:** Medium. Users can open files but must save changes back to the original filesystem location.

**Workaround:** Open files through the Kamelot virtual drive, edit them, and save to the original path. Alternatively, use `kml get <inode>` to copy the file to a writable location, edit, and use `kml put <path>` to re-import.

**Planned Fix:** v0.4.0

### KML-KNOWN-003: .aioss Ledger Integrated but Rollback CLI Not Yet Implemented

**Description:** The .aioss ledger correctly records all file operations as immutable entries. However, the `kml rollback` command is a stub that prints help text but does not actually perform rollbacks.

**Impact:** High. Ransomware recovery via rollback is advertised but not yet functional.

**Workaround:** Manual file recovery is possible by examining the ledger (`kml ledger history <inode>`) and manually restoring previous versions from the encrypted flat store backups. This is a complex process and not recommended for non-technical users.

**Planned Fix:** v0.2.0

### KML-KNOWN-004: K-Swarm Mesh Protocol Designed but Not Yet Connected to FUSE/WinFSP

**Description:** The K-Swarm protocol for distributed mesh networking between Kamelot instances has been designed and prototyped but is not yet integrated with the FUSE/WinFSP virtual filesystem. Multi-machine file sharing is not functional.

**Impact:** Medium. Network file sharing across multiple Kamelot instances is not available.

**Workaround:** Use traditional network file sharing (SMB, NFS) to share files between machines. Each machine must index the shared files independently.

**Planned Fix:** v1.0.0

### KML-KNOWN-005: macOS Support Planned but Not Yet Tested

**Description:** The macOS build compiles but has not undergone formal QA testing. macOSFUSE integration may have undiagnosed issues. Apple Silicon (M1/M2/M3) builds are available but untested.

**Impact:** High for macOS users. The product may have crashes, performance issues, or missing features on macOS.

**Workaround:** Use Linux or Windows for production use. macOS users can try the alpha build but should expect issues. Report bugs via GitHub.

**Planned Fix:** v0.3.0 (beta support), v1.0.0 (stable support)

---

## Version 0.2.0 Known Issues

### KML-KNOWN-006: Memory Usage Higher Than Expected with GPU UI

**Description:** The Vello GPU UI uses approximately 30-50 MB more RAM than the target of 15-30 MB. This is due to unoptimized shader compilation caches and frame buffers.

**Impact:** Low. 30-50 MB is still far less than Electron (200+ MB).

**Workaround:** None required. This is a known optimization target for v0.3.0.

**Planned Fix:** v0.3.0

### KML-KNOWN-007: First Query After Daemon Start Is Slow (500ms-2s)

**Description:** The first query after the Kamelot daemon starts or after a period of inactivity is significantly slower than subsequent queries. This is because the embedding model needs to be loaded into VRAM/RAM.

**Impact:** Low to Medium. Affects user experience if Kamelot is infrequently used.

**Workaround:** Run a dummy query (`kml find "test"`) after starting the daemon to warm the model cache. Configure `ollama.keep_alive = -1` to keep the model loaded indefinitely.

**Planned Fix:** v0.3.0 (model pre-warming)

### KML-KNOWN-008: Content Parsing for Encrypted PDFs Returns Empty Text

**Description:** Password-protected and encrypted PDFs cannot be parsed for content. They are indexed by filename and metadata only, not by content.

**Impact:** Low. Encrypted PDFs are not common for most users.

**Workaround:** Decrypt the PDF before indexing, or use a different file format.

**Planned Fix:** v1.0.0 (prompt for password support)

---

## Platform-Specific Known Issues

### Linux

#### KML-KNOWN-009: FUSE Mount Requires `user_allow_other` for Non-Root Access

**Description:** By default, only root can access the FUSE mount at `/kml`. Non-root users must configure `user_allow_other` in `/etc/fuse.conf`.

**Impact:** Medium. First-time users may get "Permission denied" errors.

**Workaround:**
```bash
echo "user_allow_other" | sudo tee -a /etc/fuse.conf
```

**Planned Fix:** Documentation improvement. The kernel FUSE limitation cannot be changed by Kamelot.

#### KML-KNOWN-010: Inotify Watch Limit May Be Exceeded

**Description:** When indexing very large directory trees, Kamelot may hit the system inotify watch limit (default: 8192 on most distributions).

**Impact:** Medium. File watcher stops working until the limit is raised.

**Workaround:**
```bash
# Increase inotify watch limit
sudo sysctl fs.inotify.max_user_watches=524288
echo "fs.inotify.max_user_watches=524288" | sudo tee /etc/sysctl.d/99-inotify.conf
```

**Planned Fix:** v0.3.0 (graceful fallback to polling-based watching)

### Windows

#### KML-KNOWN-011: Windows Defender May Delay First File Access

**Description:** Windows Defender performs real-time scanning on the WinFSP virtual drive, causing 1-5 second delays on the first file access after mount. Subsequent accesses are fast.

**Impact:** Low. Affects first file open only.

**Workaround:** Add an exclusion for the Kamelot mount point:
```powershell
Add-MpPreference -ExclusionPath "K:\"
```

**Planned Fix:** Documentation improvement. This is a Windows Defender behavior.

#### KML-KNOWN-012: Long Paths (>260 Characters) Not Supported on Windows

**Description:** Windows has a MAX_PATH limitation of 260 characters. Files with paths longer than this cannot be indexed or accessed through Kamelot on Windows.

**Impact:** Medium. Affects users with deep directory structures or long filenames.

**Workaround:** Enable long path support in Windows:
```powershell
# Enable long paths (requires admin)
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" `
  -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

**Planned Fix:** v0.4.0 (automatic long path handling via `\\?\` prefix)

### macOS

#### KML-KNOWN-013: macOSFUSE Not Signed for macOS 15+ (Sequoia)

**Description:** macOS 15 (Sequoia) requires kernel extensions to be signed and notarized. The macOSFUSE kernel extension used by Kamelot may not be fully compatible with the latest macOS security policies.

**Impact:** High. Users on macOS 15+ may be unable to mount the Kamelot virtual drive.

**Workaround:** Use the new FUSE-T (userspace FUSE) which doesn't require a kernel extension:
```bash
brew install fuse-t
kml config set fuse.backend "fuse-t"
```

**Planned Fix:** v0.4.0 (fuse-t support)

---

## Feature Limitations

### KML-KNOWN-100: No Multi-User Support

**Description:** Kamelot is a single-user system. There is no multi-user authentication, permissions, or concurrent access management.

**Impact:** Low for individual users. High for enterprise deployments.

**Planned Fix:** v1.5.0 (basic multi-user via shared daemon), v2.0.0 (full RBAC)

### KML-KNOWN-101: No Automatic Cloud Backup

**Description:** Kamelot does not include built-in cloud backup functionality. Users must configure their own backup strategy.

**Impact:** Medium. Users must manually set up backups of the flat store and ledger.

**Planned Fix:** v1.0.0 (backup CLI commands), v2.0.0 (automated backup scheduling)

### KML-KNOWN-102: No File Versioning UI

**Description:** While the .aioss ledger stores file version history, there is no graphical UI for browsing or comparing file versions.

**Impact:** Low. The CLI command `kml ledger history <inode>` provides version information.

**Planned Fix:** v1.5.0 (version browser in UI)

### KML-KNOWN-103: No File Sharing / Collaboration

**Description:** Kamelot cannot share files or search results with other users. There is no collaboration feature.

**Impact:** Low. Kamelot is designed as a personal file system.

**Planned Fix:** v2.0.0 (K-Swarm mesh sharing)

### KML-KNOWN-104: No Mobile App

**Description:** Kamelot is a desktop-only application. There is no iOS or Android app.

**Impact:** Medium. Users who need mobile file access cannot use Kamelot on their phone.

**Planned Fix:** v2.0.0 (mobile app for search only, not file sync)

---

## Scalability Limitations

### KML-KNOWN-200: Single-Node Qdrant Limit of ~2M Vectors

**Description:** The free self-hosted Qdrant version is limited to single-node deployment with a practical maximum of approximately 2 million vectors (points). Beyond this, performance degrades significantly without sharding.

**Impact:** Low for most users (<2M files). High for enterprise deployments with >2M files.

**Planned Fix:** v1.5.0 (Qdrant sharding support), v2.0.0 (distributed deployment guide)

### KML-KNOWN-201: HNSW Index RAM Requirements

**Description:** The HNSW index requires approximately 8 GB of RAM per 1 million vectors. Users with limited RAM may experience heavy swapping or out-of-memory errors.

**Impact:** Medium. Users with <16 GB RAM should limit index size.

**Workaround:** Use memory-mapped storage (slower but less RAM):
```toml
[qdrant]
hnsw_m = 16              # Reduce from 32, saves ~30% RAM
use_mmap = true          # Use memory-mapped index
```

**Planned Fix:** v0.3.0 (memory-mapped index support)

### KML-KNOWN-202: Initial Indexing of >500K Files Takes Hours

**Description:** Initial indexing of large file collections can take 6+ hours on CPU-only systems. Even with a GPU, 500K+ files require 2-4 hours.

**Impact:** Medium. Users with large collections must plan for extended indexing time.

**Workaround:** Index in batches, start with most important directories. Use progressive indexing (available in v0.2.0+).

**Planned Fix:** v0.2.0 (progressive indexing — searchable within 30 seconds, full index continues in background)

---

## Integration Limitations

### KML-KNOWN-300: No Native IDE Plugin

**Description:** While Kamelot integrates with IDEs via the FUSE mount, there is no native IDE plugin for VS Code, JetBrains, or other editors.

**Impact:** Low. Users can still use Omnibox and FUSE mount for IDE integration.

**Planned Fix:** v1.0.0 (VS Code extension), v1.5.0 (JetBrains plugin)

### KML-KNOWN-301: No REST API for Remote Access

**Description:** Kamelot's daemon exposes a JSON-RPC API on localhost only. There is no authenticated REST API for remote access.

**Impact:** Low. Local-only design is intentional for security.

**Planned Fix:** v1.5.0 (authenticated REST API for LAN access)

### KML-KNOWN-302: No Web Interface

**Description:** Kamelot does not include a web-based UI. All interaction is through the native GPU UI (Omnibox) or CLI.

**Impact:** Low. Web interface would add complexity and security surface.

**Planned Fix:** v2.0.0 (optional web interface for remote access)

### KML-KNOWN-303: No Docker Image for Kamelot Itself

**Description:** Qdrant and Ollama are available as Docker images, but Kamelot itself is not available as a Docker image. All deployments are native.

**Impact:** Low. Kamelot is designed for native deployment.

**Planned Fix:** v0.3.0 (official Docker image)

---

## Planned Fix Versions

| Known Issue | Fix Version | Status |
|-------------|-------------|--------|
| KML-KNOWN-001: No query directory listing | v0.2.0 | In progress |
| KML-KNOWN-002: WinFSP read-only | v0.4.0 | Planned |
| KML-KNOWN-003: Rollback CLI stub | v0.2.0 | In progress |
| KML-KNOWN-004: K-Swarm disconnected | v1.0.0 | Research |
| KML-KNOWN-005: macOS untested | v0.3.0 (beta), v1.0.0 (stable) | In progress |
| KML-KNOWN-006: GPU UI memory | v0.3.0 | Planned |
| KML-KNOWN-007: Cold start latency | v0.3.0 | In progress |
| KML-KNOWN-008: Encrypted PDF parsing | v1.0.0 | Low priority |
| KML-KNOWN-009: FUSE permissions | Documentation | Completed |
| KML-KNOWN-010: Inotify limit | v0.3.0 | In progress |
| KML-KNOWN-011: Windows Defender delay | Documentation | Completed |
| KML-KNOWN-012: Windows long paths | v0.4.0 | Planned |
| KML-KNOWN-013: macOSFUSE signing | v0.4.0 | In progress |
| KML-KNOWN-100: Multi-user | v1.5.0 | Research |
| KML-KNOWN-101: Backup automation | v1.0.0 | Planned |
| KML-KNOWN-102: Version browser UI | v1.5.0 | Planned |
| KML-KNOWN-103: File sharing | v2.0.0 | Research |
| KML-KNOWN-104: Mobile app | v2.0.0 | Research |
| KML-KNOWN-200: Qdrant sharding | v1.5.0 | Planned |
| KML-KNOWN-201: HNSW RAM optimization | v0.3.0 | In progress |
| KML-KNOWN-202: Long initial indexing | v0.2.0 | In progress |
| KML-KNOWN-300: IDE plugins | v1.0.0 | Planned |
| KML-KNOWN-301: REST API | v1.5.0 | Planned |
| KML-KNOWN-302: Web interface | v2.0.0 | Research |
| KML-KNOWN-303: Docker image | v0.3.0 | In progress |
| KML-KNOWN-304: No ARM64 Docker images | v0.4.0 | Planned |
| KML-KNOWN-305: CLI autocomplete incomplete | v0.3.0 | In progress |

---

## Version 0.3.0 Known Issues

### KML-KNOWN-304: ARM64 Docker Images Not Published

**Description:** Docker images for ARM64 architecture (Raspberry Pi, Apple Silicon, ARM servers) are built but not published to Docker Hub. Users on ARM64 must build from source or install natively.

**Impact:** Medium. ARM64 users cannot use Docker Compose for deployment.

**Workaround:** Build from source: `cargo build --release --target aarch64-unknown-linux-gnu`. Or use native installation via package manager.

**Planned Fix:** v0.4.0

### KML-KNOWN-305: CLI Autocomplete Only Supports Bash

**Description:** The `kml` CLI autocomplete (Tab completion) is implemented only for Bash. Zsh and Fish shell completions are placeholders that do not generate correct suggestions.

**Impact:** Low to Medium. Users of Zsh and Fish cannot use Tab completion for subcommands and flags.

**Workaround:** Use Bash for Kamelot CLI operations, or manually type full commands without autocomplete.

**Planned Fix:** v0.3.0

### KML-KNOWN-306: Japanese and CJK Filename Rendering Issues

**Description:** The Vello GPU UI has rendering artifacts with CJK (Chinese, Japanese, Korean) characters in filenames. Characters may appear as boxes, be misaligned, or cause layout issues. This is due to missing CJK glyphs in the bundled font.

**Impact:** Medium. Affects users with CJK filenames or file content.

**Workaround:** Set the UI font to a CJK-compatible font in configuration:
```toml
[ui]
font_path = "/usr/share/fonts/noto-cjk/NotoSansCJK-Regular.ttc"
```

**Planned Fix:** v0.4.0 (bundle Noto Sans CJK subset)

### KML-KNOWN-307: High Memory Usage During Large Batch Imports

**Description:** When importing more than 50,000 files in a single batch, the Kamelot daemon's memory usage spikes to 2-3x normal levels. This is due to buffering file contents and embeddings before batching the Qdrant insert.

**Impact:** Medium. Users with >50K files may experience memory pressure during initial indexing.

**Workaround:** Index in smaller batches:
```bash
kml index ~/Documents/ --batch-size 10000
```

**Planned Fix:** v0.3.0 (streaming batch inserts, reduced buffering)

### KML-KNOWN-308: GPU UI Does Not Support High-DPI Scaling on Windows

**Description:** On Windows systems with high-DPI displays (200%+ scaling), the Kamelot UI (Omnibox) appears blurry or incorrectly sized. This is because the Vello renderer does not query Windows DPI settings at startup.

**Impact:** Medium. Reduces visual quality on 4K+ displays with scaling enabled.

**Workaround:** Set Windows display scaling to 100% for the Kamelot process, or use the CLI (`kml find`) instead of the UI.

**Planned Fix:** v0.4.0 (per-monitor DPI awareness)

### KML-KNOWN-309: File Watcher Does Not Detect Renames

**Description:** The file system watcher detects file creation, modification, and deletion but does not detect renames. When a file is renamed, Kamelot treats it as a deletion of the old path and creation of a new path, losing the link between old and new inode in the search index.

**Impact:** Low. File searchability is not affected, but the ledger shows a delete+create instead of a rename.

**Workaround:** None required. Search works correctly via content embeddings regardless of filename changes.

**Planned Fix:** v0.3.0 (rename event handling)

### KML-KNOWN-310: No Unicode Normalization for Filenames

**Description:** Kamelot does not normalize Unicode filenames (NFC vs NFD). Files with the same visual name but different Unicode normalization forms are treated as different files. This primarily affects macOS (which uses NFD) when sharing files with Linux (NFC).

**Impact:** Low. Rare edge case in mixed-OS environments.

**Workaround:** Ensure all files use the same Unicode normalization form before indexing.

**Planned Fix:** v0.4.0 (NFC normalization on all platforms)

---

## Version 0.4.0 Known Issues

### KML-KNOWN-311: Multi-User Support Is Placeholder

**Description:** Multi-user support in v0.4.0 is limited to running multiple Kamelot instances on the same machine with separate data directories. There is no shared index, no user authentication, and no permission system.

**Impact:** High for teams. Each user must maintain their own index.

**Workaround:** Use a shared server with a single Kamelot instance accessed via CLI over SSH. All users share the same index.

**Planned Fix:** v1.5.0 (multi-user with separate profiles), v2.0.0 (full RBAC)

### KML-KNOWN-312: REST API Limited to Read-Only Operations

**Description:** The experimental REST API (available on port 9010) supports search queries but does not support write operations (index, delete, update). All write operations must use the CLI or direct daemon IPC.

**Impact:** Low. The REST API is documented as experimental.

**Workaround:** Use the CLI (`kml index`, `kml delete`) for write operations.

**Planned Fix:** v1.0.0 (full REST API)

### KML-KNOWN-313: No Native System Tray Icon

**Description:** Kamelot does not provide a system tray icon on any platform. The daemon runs as a background service, and the UI is accessed only via the hotkey. There is no visual indicator that Kamelot is running.

**Impact:** Low. Experienced users know the hotkey; new users may forget Kamelot is installed.

**Workaround:** Set up a desktop notification on daemon start. Configure the hotkey reminder in the onboarding wizard.

**Planned Fix:** v0.4.0 (system tray icon)

---

## Documentation Known Issues

### KML-KNOWN-DOC-001: Command Help Text Incomplete

**Description:** Some `kml help <subcommand>` outputs show placeholder text or incomplete descriptions. The help text generation from clap (Rust CLI library) is functional but the descriptions for less common commands have not been updated from defaults.

**Impact:** Low. The main commands (`find`, `index`, `start`, `init`) have complete help text.

**Planned Fix:** v0.3.0

### KML-KNOWN-DOC-002: Japanese Language Documentation Not Available

**Description:** The Kamelot documentation is available only in English. Japanese, Spanish, Chinese, and other translations are planned but not yet started.

**Impact:** Medium. Non-English speakers must rely on community translations.

**Planned Fix:** v1.0.0 (i18n framework), v1.5.0 (community translations)

### KML-KNOWN-DOC-003: Example Configurations Limited

**Description:** The documentation provides a single example configuration (`config.toml` example). Advanced configurations for specific use cases (high-availability, large-scale deployment, custom model backends) are not documented.

**Impact:** Low to Medium. Advanced users may need to experiment with configuration.

**Planned Fix:** v0.3.0 (configuration recipes in wiki)

### KML-KNOWN-DOC-004: API Reference Not Published

**Description:** The JSON-RPC API documentation for the Kamelot daemon is not published. Developers who want to build custom integrations must read the source code to understand the API.

**Impact:** Medium. Hinders third-party integration development.

**Planned Fix:** v0.4.0 (API reference documentation)

---

## Performance Known Issues

### KML-KNOWN-PERF-001: First Index of Network Drive Is Very Slow

**Description:** Indexing files on a network drive (SMB, NFS) takes 5-10x longer than local indexing. This is because Kamelot reads the full file content over the network for parsing and embedding, and network latency multiplies per-file overhead.

**Impact:** High for users with network drive indexing needs.

**Workaround:** Sync network files to a local directory first, then index locally.

**Planned Fix:** v1.0.0 (network-optimized indexing with caching)

### KML-KNOWN-PERF-002: Concurrent Queries During Indexing Cause Latency Spikes

**Description:** When the ingestion pipeline is actively indexing files, concurrent query latency increases by 200-500ms. This is because embedding generation for indexing competes with query embedding for GPU/CPU resources.

**Impact:** Medium. Users who search while large indexing jobs are running may experience slower search.

**Workaround:** Schedule large indexing jobs during off-hours. Use separate GPU queues for indexing vs query (if supported).

**Planned Fix:** v0.3.0 (priority-based GPU scheduling)

### KML-KNOWN-PERF-003: Memory Fragmentation After Long Uptime

**Description:** After 7+ days of continuous operation, the Kamelot daemon's memory usage may increase by 10-20% due to memory fragmentation in the Rust allocator. This affects long-running server deployments.

**Impact:** Low. Memory usage stabilizes after the initial increase and does not grow unbounded.

**Workaround:** Restart the daemon weekly during low-usage periods: `kml restart`.

**Planned Fix:** v0.4.0 (j emalloc memory allocator for long-running stability)

---

## Security Known Issues

### KML-KNOWN-SEC-001: No Rate Limiting on Daemon API

**Description:** The Kamelot daemon JSON-RPC API does not implement rate limiting. While the API binds to localhost only (not network-exposed), a local process could theoretically flood the daemon with requests.

**Impact:** Low. The API is localhost-only and requires local access.

**Workaround:** None required. Firewall rules prevent external access.

**Planned Fix:** v0.3.0 (configurable rate limiting)

### KML-KNOWN-SEC-002: Log Files May Contain File Paths

**Description:** Debug and trace-level logs may contain full file paths and partial file content excerpts. While logs are stored locally with user-only permissions, users should be aware that enabling verbose logging records sensitive file paths.

**Impact:** Low. Logs are local and permission-protected.

**Workaround:** Only enable debug/trace logging when troubleshooting specific issues. Sanitize logs before sharing.

**Planned Fix:** v0.3.0 (path sanitization options in log output)

### KML-KNOWN-SEC-003: No Audit Log Export Feature

**Description:** The .aioss ledger provides a complete audit trail, but there is no built-in export mechanism for compliance reporting. Organizations that need to export ledger entries for audit review must write custom scripts.

**Impact:** Medium. Required for compliance use cases (SOC 2, HIPAA).

**Workaround:** Export the ledger file directly: `cp -r ~/.kamelot/ledger/ /backup/`. Parse with custom tooling.

**Planned Fix:** v0.4.0 (`kml ledger export --format json`)

---

## Platform Support Roadmap

| Platform | v0.1.0 | v0.2.0 | v0.3.0 | v0.4.0 | v1.0.0 |
|----------|--------|--------|--------|--------|--------|
| Linux x86_64 | ✓ | ✓ | ✓ | ✓ | ✓ |
| Linux aarch64 | Alpha | Beta | ✓ | ✓ | ✓ |
| Windows x86_64 | Beta | Beta | ✓ | ✓ | ✓ |
| Windows aarch64 | — | — | Alpha | Beta | ✓ |
| macOS x86_64 | Alpha | Alpha | Beta | ✓ | ✓ |
| macOS Apple Silicon | — | Alpha | Alpha | Beta | ✓ |
| FreeBSD x86_64 | — | — | — | Alpha | Beta |
| Docker (Linux) | — | ✓ | ✓ | ✓ | ✓ |
| Docker (ARM) | — | — | — | ✓ | ✓ |

---

## How to Report a New Issue

If you encounter a problem not listed here:

1. **Search existing issues**: Check [GitHub Issues](https://github.com/kamelot/kamelot/issues) for duplicates
2. **Check the FAQ**: Your issue may be covered in the [FAQ section](../faqs/)
3. **Gather information**: Run `kml doctor --verbose` and collect logs via `kml debug-bundle`
4. **Create a bug report**: Use the [bug report template](03-debug-logging.md#bug-report-template)
5. **Submit**: Open a new issue on GitHub

### Required Information for Bug Reports

- Kamelot version (`kml --version`)
- Operating system and version
- Hardware details (CPU, RAM, GPU, storage type)
- Configuration (sanitized, remove keys)
- Logs (last 500 lines at minimum)
- Steps to reproduce
- Expected vs actual behavior

### Prioritization

| Label | Meaning | Response Time |
|-------|---------|---------------|
| critical | Data loss, crash, security | 24 hours |
| high | Major feature broken | 72 hours |
| medium | Feature degraded | 1 week |
| low | Cosmetic, enhancement | Next release |

---

## Known Issue Workarounds Index

Quick reference for common workarounds:

| Issue | Quick Fix | Details |
|-------|-----------|---------|
| FUSE permission denied | `echo "user_allow_other" \| sudo tee -a /etc/fuse.conf` | See KML-KNOWN-009 |
| Windows Defender slow first access | `Add-MpPreference -ExclusionPath "K:\"` | See KML-KNOWN-011 |
| Long paths on Windows | Enable LongPathsEnabled registry key | See KML-KNOWN-012 |
| macOS FUSE not working | Switch to fuse-t backend | See KML-KNOWN-013 |
| Slow first query after daemon start | Run `kml find "test"` to warm model cache | See KML-KNOWN-007 |
| High RAM usage for large indexes | Reduce hnsw_m and enable mmap in Qdrant config | See KML-KNOWN-201 |
| Inotify limit exceeded | `sudo sysctl fs.inotify.max_user_watches=524288` | See KML-KNOWN-010 |
| GPU UI high-DPI blurry on Windows | Set scaling to 100% for Kamelot process | See KML-KNOWN-308 |
| CJK characters render as boxes | Set font path to CJK-compatible font | See KML-KNOWN-306 |
| Cannot index network drives | Sync to local, then index locally | See KML-KNOWN-PERF-001 |
| Concurrent queries slow during indexing | Schedule indexing during off-hours | See KML-KNOWN-PERF-002 |
| Memory usage grows over time | Restart daemon weekly: `kml restart` | See KML-KNOWN-PERF-003 |

---

## Unresolved Issues (No Planned Fix)

The following issues are known but have no current plan for resolution:

| Issue | Reason | Mitigation |
|-------|--------|------------|
| No mobile app | Platform resources limited | Use CLI over SSH from mobile |
| No native music/audio search | Model limitations | Search by metadata (artist, album) |
| No video content analysis | Model + performance constraints | Search by filename and metadata |
| No distributed search (single node only) | Architectural complexity | Use Qdrant sharding for larger indexes |
| No real-time collaboration | Single-user focus | Share FUSE mount over network |
| No undo for `kml delete --purge` | Intentional (purge is permanent) | Use `kml delete` (soft) instead |
| No GUI for file version comparison | Priority on core search | Use `kml ledger history <inode>` |
| No integration with cloud AI models | Privacy requirement | Community plugin possible |
| No Windows ARM64 native build | Platform resources limited | Works via x86_64 emulation |
| No 32-bit OS support | Rust + Qdrant require 64-bit | Not planned |

These issues are intentionally deferred to maintain focus on Kamelot's core value proposition: fast, private, semantic file search.

---

## Known Issue Trends

### Most Frequently Reported Issues

Based on support ticket volume (v0.1 beta):

| Rank | Issue | Reports | Status |
|------|-------|---------|--------|
| 1 | WinFSP read-only (KML-KNOWN-002) | 45 | Planned v0.4.0 |
| 2 | macOS support (KML-KNOWN-005) | 38 | Beta v0.3.0 |
| 3 | Rollback CLI stub (KML-KNOWN-003) | 22 | In progress v0.2.0 |
| 4 | Cold start latency (KML-KNOWN-007) | 18 | In progress v0.3.0 |
| 5 | GPU UI memory (KML-KNOWN-006) | 15 | Planned v0.3.0 |

### Resolution Velocity

| Severity | Average Time to Fix | Best | Worst |
|----------|--------------------|------|-------|
| S1 (Critical) | 2.4 days | 6 hours | 5 days |
| S2 (High) | 5.1 days | 1 day | 12 days |
| S3 (Medium) | 12.3 days | 3 days | 30 days |
| S4 (Low) | 30+ days | 7 days | 90+ days |

These metrics include time from bug report to fix release.

---

## Beta Program Known Issues

For users participating in the beta program, these additional issues apply:

### Beta Build KML-BETA-001: Logging May Contain Debug Artifacts

**Description:** Beta builds may include additional debug logging that is stripped from release builds. Log files may reference internal function names, module paths, and development-only identifiers.

**Impact:** Low. Beta users expect additional verbosity.

### Beta Build KML-BETA-002: Configuration Options May Change

**Description:** Configuration keys added during the beta period may be renamed, removed, or have changed behavior in the final release. Beta users should review release notes before upgrading.

**Impact:** Medium. Custom configurations may need updates.

### Beta Build KML-BETA-003: Database Schema May Change

**Description:** The Qdrant collection schema (payload fields, vector dimensions) may change between beta versions. Users may need to re-index when upgrading between beta versions.

**Impact:** High. Re-indexing may be required.

### Beta Build KML-BETA-004: Telemetry Data Format Unstable

**Description:** The telemetry data format may change between beta versions. Historical telemetry data may not be comparable across versions.

**Impact:** Low. Telemetry is for product improvement, not user-critical.

---

## Reporting Feature Requests vs Bugs

### Feature Requests

If your issue is a feature request (not a bug), submit it through GitHub Discussions:

1. Go to [GitHub Discussions](https://github.com/kamelot/kamelot/discussions)
2. Choose the "Feature Requests" category
3. Include:
   - **Problem statement**: What can't you do?
   - **Proposed solution**: How should it work?
   - **Alternatives**: What workarounds have you tried?
   - **Use case**: How would this benefit your workflow?

### Feature Request Acceptance Criteria

| Criterion | Weight | Description |
|-----------|--------|-------------|
| Alignment with product vision | High | Does it serve the North Star Metric? |
| User demand (votes/comments) | High | How many users want this? |
| Implementation complexity | Medium | Can it be built with existing architecture? |
| Maintenance burden | Medium | Will it add ongoing maintenance cost? |
| Scope | Medium | Is it a narrow feature or platform change? |
| Privacy/security impact | High | Does it maintain zero-knowledge architecture? |

### Feature Request Status Labels

| Label | Meaning |
|-------|---------|
| Under Review | Being evaluated by the product team |
| Planned | Scheduled for an upcoming release |
| In Progress | Active development |
| Shipped | Released |
| Declined | Will not be implemented (reason given) |
| Needs Discussion | Requires more community input |

---

## Network and Connectivity Known Issues

### KML-KNOWN-NET-001: No Built-in VPN/Tunnel Support

**Description:** Kamelot does not include built-in VPN or tunnel capabilities for securely accessing a remote Kamelot instance over the internet. Users who want remote access must set up their own VPN (WireGuard, OpenVPN) or SSH tunnel.

**Impact:** Medium. Remote access requires additional infrastructure setup.

**Workaround:** Use SSH port forwarding:
```bash
ssh -L 9010:localhost:9010 user@remote-server
# Then access Kamelot on localhost:9010
```

**Planned Fix:** v2.0.0 (built-in TLS + authentication for remote access)

### KML-KNOWN-NET-002: IPv6 Not Tested

**Description:** Kamelot's IPC and service bindings have not been formally tested on IPv6-only networks. All development and testing has been on IPv4 localhost.

**Impact:** Low. Most systems use IPv4 localhost for IPC.

**Workaround:** Ensure IPv4 localhost is available (default on all major OS).

**Planned Fix:** v1.0.0 (IPv6 testing and compatibility)

### KML-KNOWN-NET-003: Proxy Support Limited

**Description:** Kamelot does not have built-in HTTP/HTTPS proxy support for the model download and update features. If your network requires a proxy for internet access, downloads may fail.

**Impact:** Low. Affects initial setup only (model download).

**Workaround:** Use environment variables:
```bash
# Linux/macOS
export HTTP_PROXY=http://proxy:8080
export HTTPS_PROXY=http://proxy:8080
curl -O https://releases.kamelot.ai/latest/kamelot-linux-x86_64.tar.gz

# Windows PowerShell
$env:HTTP_PROXY = "http://proxy:8080"
$env:HTTPS_PROXY = "http://proxy:8080"
```

**Planned Fix:** v0.3.0 (honor system proxy settings)

---

## Storage and File System Known Issues

### KML-KNOWN-STOR-001: Flat Store Not Compatible with Some Cloud Sync Clients

**Description:** The encrypted flat store files (.blob files) have random binary content. Some cloud sync clients (Dropbox, OneDrive) may attempt to sync these files, causing unnecessary bandwidth usage and potential conflicts.

**Impact:** Low. Users should configure cloud sync to exclude the Kamelot data directory.

**Workaround:** Add exclusion rules in your cloud sync client:
```toml
# Recommended: Store Kamelot data outside cloud sync folders
kml config set storage.flat_store_path "/data/kamelot/store"
```

**Planned Fix:** Documentation (best practices for cloud sync exclusion).

### KML-KNOWN-STOR-002: No Automatic Backup Scheduling

**Description:** Kamelot does not include a built-in backup scheduler. Users must configure their own backup system (cron, Task Scheduler) for the flat store and ledger.

**Impact:** Medium. Users may forget to back up critical data.

**Workaround:** Set up a cron job for backups:
```bash
# Daily backup at 2 AM
0 2 * * * /usr/local/bin/kml backup --output /backup/kamelot/$(date +\%Y-\%m-\%d)
```

**Planned Fix:** v1.0.0 (`kml backup` with scheduling support)

### KML-KNOWN-STOR-003: Large Ledger Files (>10 GB) May Slow Operations

**Description:** The .aioss ledger grows with every file operation. For users with >1M file operations, the ledger file can exceed 10 GB, causing slower append and verification operations.

**Impact:** Low. Most users will not reach this threshold in the first year.

**Workaround:** Archive old ledger entries:
```bash
# Archive ledger entries older than 1 year
kml ledger archive --older-than 365
```

**Planned Fix:** v1.0.0 (automatic ledger archiving)

---

## User Interface Known Issues

### KML-KNOWN-UI-001: Omnibox Does Not Support Drag and Drop

**Description:** The Omnibox search results cannot be dragged and dropped into other applications. Users who want to attach a file found via Kamelot to an email or upload must locate the file in the original filesystem.

**Impact:** Low. Users can use the "Show in Folder" action instead.

**Workaround:** Use the "Copy Path" action in the Omnibox and browse to the file manually, or use the FUSE mount to access files natively.

**Planned Fix:** v0.4.0 (drag-and-drop support via the FUSE mount)

### KML-KNOWN-UI-002: No Multi-Monitor DPI Scaling

**Description:** On systems with multiple monitors at different DPI scaling levels (e.g., 150% laptop + 100% external monitor), the Kamelot UI may render at the wrong DPI when moved between monitors.

**Impact:** Low. Affects users with mixed-DPI multi-monitor setups.

**Workaround:** Keep Kamelot on the primary monitor, or match DPI scaling across all monitors.

**Planned Fix:** v0.4.0 (per-monitor DPI awareness)

### KML-KNOWN-UI-003: Dark Mode Only

**Description:** Kamelot's UI currently only supports dark mode. Light mode is planned but not yet implemented.

**Impact:** Low. Dark mode is preferred by most users for search tools.

**Workaround:** None required. Light mode will be added in a future release.

**Planned Fix:** v0.4.0 (theme support)

---

## Performance and Scalability Known Issues (Detailed)

### KML-KNOWN-PERF-004: Batch Size Impact on GPU Memory

**Description:** When indexing with GPU acceleration, the batch size for embedding generation directly impacts GPU memory usage. Large batches (>200 files) can cause GPU out-of-memory errors on GPUs with 6-8 GB VRAM.

**Impact:** Medium. Users may encounter errors during large indexing jobs.

**Workaround:** Reduce batch size:
```toml
[indexing]
batch_size = 50  # Reduce from default 100 for low-VRAM GPUs
```

**Planned Fix:** v0.3.0 (automatic batch size adjustment based on available VRAM)

### KML-KNOWN-PERF-005: Many Small Files Index Slowly

**Description:** Indexing many small files (<1 KB) is proportionally slower than indexing fewer large files. This is because the per-file overhead (read, parse, embed, store) dominates for very small files.

**Impact:** Low. Small files are quickly processed individually.

| File Count | Total Size | Index Time (GPU) | Effective Throughput |
|-----------|-----------|-----------------|---------------------|
| 100,000 × 100 KB | 10 GB | 1.5 hours | 18 files/sec |
| 100,000 × 1 KB | 100 MB | 1.2 hours | 23 files/sec |
| 100,000 × 10 MB | 1 TB | 4 hours | 7 files/sec |

**Workaround:** None required. This is a fundamental characteristic of per-file processing.

**Planned Fix:** v0.4.0 (batching of small files for embedding)

### KML-KNOWN-PERF-006: SSD Write Endurance for Heavy Indexing

**Description:** Initial indexing of very large collections (>1M files) generates significant write traffic to the flat store (encrypted blobs) and Qdrant storage. On consumer SSDs with limited write endurance, this can accelerate wear.

**Impact:** Low. Typical indexing of 1M files writes approximately 100 GB to the flat store and 8 GB to Qdrant — well within the endurance of modern SSDs (300+ TBW).

**Workaround:** Use an SSD with high write endurance (NVMe with 600+ TBW rating) for the Kamelot data directory.

**Planned Fix:** None required (within normal SSD endurance limits).

---

## Third-Party Integration Known Issues

### KML-KNOWN-INT-001: Ollama Compatibility with Custom Models

**Description:** Kamelot has been tested primarily with Qwen 2 VL and nomic-embed-text models. Compatibility with other Ollama-served models (Llama, Mistral, Gemma embeddings) is not guaranteed and may produce lower-quality search results.

**Impact:** Low. Default models are recommended.

**Workaround:** Use tested models (Qwen 2 VL, nomic-embed-text). Experiment with other models at your own risk.

**Planned Fix:** v1.0.0 (model compatibility testing and matrix)

### KML-KNOWN-INT-002: Qdrant Version Sensitivity

**Description:** Kamelot is tested and compatible with specific Qdrant versions (see release notes). Using an untested Qdrant version may cause gRPC API incompatibilities.

**Impact:** Medium. Users who automatically update Qdrant may experience issues.

**Workaround:** Pin the Qdrant version in Docker Compose or installation:
```yaml
services:
  qdrant:
    image: qdrant/qdrant:v1.13.0  # Pin specific version
```

**Planned Fix:** v0.3.0 (version compatibility check on startup)

### KML-KNOWN-INT-003: Docker Desktop on Windows Performance

**Description:** Running Qdrant and Ollama via Docker Desktop on Windows incurs significant performance overhead compared to native Linux. WSL2-based Docker can reduce this gap but still adds 10-20% overhead.

**Impact:** Medium. Windows users may experience slower indexing.

**Workaround:** Use native Windows binaries for Qdrant and Ollama rather than Docker, or use WSL2 for better performance.

**Planned Fix:** v0.4.0 (native Windows service management for Qdrant and Ollama)

---

## Documentation and Support Known Issues

### KML-KNOWN-DOC-005: Video Tutorials Not Yet Produced

**Description:** Kamelot's documentation is text-only. Video tutorials for installation, first use, and advanced features have not been produced.

**Impact:** Low. Many users prefer text documentation.

**Planned Fix:** v0.4.0 (video tutorials for core workflows)

### KML-KNOWN-DOC-006: No Interactive Tutorial

**Description:** Kamelot does not include an interactive in-app tutorial. New users must rely on documentation and community support.

**Impact:** Medium. Interactive tutorials improve onboarding.

**Planned Fix:** v0.4.0 (in-app onboarding wizard)

### KML-KNOWN-DOC-007: No Searchable Documentation Portal

**Description:** The Kamelot documentation is available as markdown files in the repository and on a basic documentation site. There is no search functionality for the documentation.

**Impact:** Low. Users can search with grep or use GitHub's search.

**Planned Fix:** v0.4.0 (searchable documentation portal with Algolia or similar)
