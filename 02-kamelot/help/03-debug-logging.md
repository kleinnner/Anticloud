                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                
# Debug and Logging Guide

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. [Enabling Verbose Logging](#enabling-verbose-logging)
2. [Log Levels Explained](#log-levels-explained)
3. [Log Output Locations](#log-output-locations)
4. [Reading Qdrant Logs](#reading-qdrant-logs)
5. [Reading WinFSP Debug Output](#reading-winfsp-debug-output)
6. [Reading FUSE Debug Output](#reading-fuse-debug-output)
7. [Common Log Patterns](#common-log-patterns)
8. [Log Filtering and Search](#log-filtering-and-search)
9. [Performance Tracing](#performance-tracing)
10. [Creating Debug Bundles](#creating-debug-bundles)
11. [Submitting Logs with Bug Reports](#submitting-logs-with-bug-reports)

---

## Enabling Verbose Logging

Kamelot uses the `tracing` crate for structured logging, controlled by the `RUST_LOG` environment variable.

### Basic Usage

```bash
# Default log level (info)
kml start

# Debug level — most useful for troubleshooting
RUST_LOG=kamelot=debug kml start

# Trace level — extremely verbose, all components
RUST_LOG=kamelot=trace kml start

# Specific component debug
RUST_LOG=kamelot::ingest=debug,kamelot::qdrant=debug kml start

# All components at debug level
RUST_LOG=debug kml start
```

### Persistent Log Level

Set the log level permanently in configuration:

```toml
[daemon]
log_level = "debug"   # Options: error, warn, info, debug, trace
```

### Log Level for CLI Commands

```bash
# Debug logging for a single command
RUST_LOG=kamelot=debug kml index ~/Documents/
RUST_LOG=kamelot::qdrant=trace kml find "query text"

# Quiet mode (errors only)
RUST_LOG=kamelot=error kml index ~/Documents/
```

---

## Log Levels Explained

| Level | Purpose | When to Use |
|-------|---------|-------------|
| `error` | Irrecoverable problems that prevent operation | Production monitoring, alerting |
| `warn` | Recoverable issues, degraded functionality | Routine operational troubleshooting |
| `info` | Normal operational events (startup, shutdown, indexing progress) | Default level, day-to-day use |
| `debug` | Detailed operational flow, function entry/exit | Troubleshooting specific issues |
| `trace` | Extremely detailed, per-iteration logging | Development, complex bug investigation |

### What Each Level Shows

#### `error`
- Daemon crashes or unrecoverable errors
- Qdrant connection failures
- Encryption/decryption failures
- File I/O errors that prevent operation
- Configuration parse failures

#### `warn`
- Slow queries (>500ms)
- Qdrant optimizer running behind
- Thumbnail generation failures
- File parsing errors (non-critical)
- Deprecated configuration keys

#### `info`
- Daemon start/stop
- Indexing progress (every 1000 files, start/end)
- Model loading/unloading
- FUSE mount/unmount
- Configuration file location
- Version information

#### `debug`
- Each file indexed (path, size, duration)
- Query embedding generation timing
- Qdrant search parameters and results
- FUSE `readdir`/`open`/`read` operations
- Cache hits/misses
- File watcher events (create, modify, delete)
- gRPC connection lifecycle

#### `trace`
- Raw Qdrant request/response payloads
- Per-iteration loop logging
- Memory allocation patterns
- GPU shader compilation details
- Raw file content excerpts
- Network buffer dumps

---

## Log Output Locations

### Console (stdout/stderr)

By default, Kamelot logs to stderr with color output:

```bash
# Default: colored, human-readable format
kml start

# JSON format (for machine parsing)
RUST_LOG_FORMAT=json kml start

# Plain text (no colors)
RUST_LOG_FORMAT=plain kml start
```

### File Logging

Kamelot can write logs to a file for persistent storage:

```toml
[logging]
file_enabled = true
file_path = "~/.kamelot/logs/kamelot.log"
max_files = 5
max_file_size_mb = 50
```

Or via command line:

```bash
# Log to file
kml start --log-file ~/.kamelot/logs/kamelot.log

# With rotation
kml start --log-file ~/.kamelot/logs/kamelot.log --log-rotate 5 --log-rotate-size 50
```

### Viewing Logs

```bash
# Tail the log file
kml logs --tail 50
# Equivalent to: tail -f ~/.kamelot/logs/kamelot.log

# View with timestamps
kml logs --tail 100 --timestamps

# Search for specific terms
kml logs --grep "error"
kml logs --grep "connection refused"

# View logs from a specific date
kml logs --since "2026-06-19" --until "2026-06-20"
```

### Journald (Linux)

On Linux systems with systemd, when Kamelot runs as a service:

```bash
# View Kamelot service logs
journalctl -u kamelot -f

# Last 100 lines
journalctl -u kamelot -n 100

# Since last boot
journalctl -u kamelot -b

# With priority filter
journalctl -u kamelot -p err   # Errors only
```

### Event Viewer (Windows)

When Kamelot runs as a Windows service:

```powershell
# View Kamelot events
Get-WinEvent -LogName "Kamelot"

# Last 50 events
Get-WinEvent -LogName "Kamelot" -MaxEvents 50

# Filter by level
Get-WinEvent -LogName "Kamelot" | Where-Object LevelDisplayName -eq "Error"
```

---

## Reading Qdrant Logs

### Docker

```bash
# Follow Qdrant logs
docker logs -f qdrant

# Last 50 lines
docker logs --tail 50 qdrant

# With timestamps
docker logs -t qdrant
```

### Native

If running Qdrant natively (not Docker), Qdrant logs to stdout by default. Redirect to file:

```bash
qdrant > ~/.kamelot/logs/qdrant.log 2>&1 &
```

### Qdrant Log Levels

Qdrant uses the `RUST_LOG` environment variable similarly to Kamelot:

```bash
# Set Qdrant log level
RUST_LOG=qdrant=debug docker run -e RUST_LOG=qdrant=debug -d --name qdrant qdrant/qdrant
```

### Common Qdrant Log Patterns

| Log Message | Meaning | Action |
|-------------|---------|--------|
| `Segment optimizer started` | Qdrant is reorganizing the index | Normal operation |
| `HNSW index building` | Building approximate nearest neighbor index | Normal, may take time |
| `Too many points for ef_construct` | Index accuracy will be reduced | Increase ef_construct |
| `Connection refused` | Qdrant cannot reach storage | Check storage path permissions |
| `Slow request: ...` | A gRPC request took >1s | Check network/storage latency |

### Qdrant Metrics

```bash
# Prometheus metrics
curl http://localhost:6333/metrics

# Health check
curl http://localhost:6333/health

# Collection info
curl http://localhost:6333/collections/kamelot
```

---

## Reading WinFSP Debug Output

### Enable WinFSP Debug Logging

WinFSP includes a debug viewer called `WinFsp-FUSE-DBG`:

```powershell
# Start WinFSP debug viewer (requires WinFSP installed)
& "C:\Program Files (x86)\WinFsp\bin\winfsp-dbg.exe"

# Or launch from command line
& "C:\Program Files (x86)\WinFsp\bin\winfsp-dbg.exe" --log-file C:\kamelot\winfsp-debug.log
```

### WinFSP Debug Levels

WinFSP debug output includes:

| Level | Prefix | Description |
|-------|--------|-------------|
| FSP_DBG_ERR | `ERR ` | Error conditions |
| FSP_DBG_WARN | `WARN` | Warning conditions |
| FSP_DBG_INFO | `INFO` | Informational messages |
| FSP_DBG_LOG | `LOG ` | Detailed operation logging |
| FSP_DBG_VERBOSE | `VRB ` | Very detailed logging |

### Enabling Verbose WinFSP Logging

```powershell
# Set WinFSP debug flags via environment
$env:WINFSD_DBG_FLAGS = "0x1F"  # Enable all debug output

# Or set registry key (persistent)
New-ItemProperty -Path "HKLM:\SOFTWARE\WinFsp" -Name "DbgFlags" -Value 0x1F -PropertyType DWORD
```

### Common WinFSP Debug Patterns

| Pattern | Meaning | Action |
|---------|---------|--------|
| `FSP_FSCTL_MOUNT_CREATE` | Mount request received | Normal operation |
| `FSP_FSCTL_MOUNT_DELETE` | Unmount request | Normal operation |
| `E_ACCESSDENIED` | Permission error | Run as administrator |
| `STATUS_OBJECT_NAME_NOT_FOUND` | File not found in virtual drive | Check index |
| `IRP_MJ_CREATE` | File open operation | Normal for file access |

---

## Reading FUSE Debug Output

### Linux FUSE Debug

```bash
# Enable FUSE debug by passing -d flag
kml start --fuse-debug

# Or use strace
strace -e trace=write -p $(pgrep kamelot) 2>&1 | grep FUSE

# FUSE kernel debug
echo 1 | sudo tee /sys/module/fuse/parameters/debug
# View kernel messages
dmesg -w | grep FUSE
```

### libfuse3 Debug

```bash
# Run Kamelot with FUSE foreground mode (shows all FUSE operations)
kml start --fuse-foreground 2>&1 | grep FUSE

# Or increase log level for FUSE component
RUST_LOG=kamelot::fuse=trace kml start
```

### Common FUSE Debug Patterns

| Pattern | Meaning |
|---------|---------|
| `FUSE: init` | FUSE connection established |
| `FUSE: lookup` | File/directory lookup |
| `FUSE: open` | File opened for reading |
| `FUSE: read` | File content read |
| `FUSE: readdir` | Directory listing |
| `FUSE: destroy` | FUSE connection closed |

---

## Common Log Patterns

### Startup Sequence

```
INFO  kamelot::daemon: Starting Kamelot daemon v0.1.0
INFO  kamelot::config: Loading configuration from ~/.kamelot/config.toml
INFO  kamelot::qdrant: Connecting to Qdrant at http://localhost:6333
INFO  kamelot::qdrant: Qdrant connected (v1.13.0)
INFO  kamelot::ollama: Connecting to Ollama at http://localhost:11434
INFO  kamelot::ollama: Ollama connected (v0.3.0), model: qwen2-vl:7b-q4
INFO  kamelot::store: Opening encrypted flat store at ~/.kamelot/store
INFO  kamelot::ledger: Opening .aioss ledger at ~/.kamelot/ledger
INFO  kamelot::fuse: Mounting FUSE at /kml
INFO  kamelot::ui: Starting GPU UI on display :0
INFO  kamelot::daemon: Kamelot daemon ready
```

### File Indexing

```
INFO  kamelot::ingest: Starting index of /home/user/Documents
DEBUG kamelot::ingest: Processing file: /home/user/Documents/report.pdf
TRACE kamelot::parse::pdf: Extracting text from PDF (42 pages)
TRACE kamelot::parse::pdf: Text extraction complete: 12,847 characters
DEBUG kamelot::embed: Generating embedding for inode 874291
TRACE kamelot::embed: Model inference: 23ms, vector dim: 768
DEBUG kamelot::qdrant: Upserting point 874291 with payload
INFO  kamelot::ingest: Indexed 1000/47293 files (2.1%)
INFO  kamelot::ingest: Index complete: 47293 files in 22m 14s
```

### Query Execution

```
DEBUG kamelot::query: Received query: "architecture diagram onboarding"
TRACE kamelot::embed: Generating embedding for query text (59ms)
DEBUG kamelot::qdrant: Searching: limit=10, score_threshold=0.5
TRACE kamelot::qdrant: Search results: 8 points returned in 12ms
DEBUG kamelot::query: Top result: "Q2-Onboarding-Architecture-v3.fig" (score: 0.89)
INFO  kamelot::query: Query complete: 8 results in 84ms
```

### Error Patterns

```
ERROR kamelot::qdrant: Failed to connect to Qdrant: transport error
  → Check: Is Qdrant running? Is the URL correct?

WARN  kamelot::embed: Embedding model returned zero vector
  → Check: Is the correct model loaded? Is the model corrupted?

ERROR kamelot::store: File blob integrity check failed
  → Check: Has the flat store been modified externally?

WARN  kamelot::fuse: FUSE readdir for query path is unimplemented
  → Known issue: Query directory listing not yet available
```

---

## Log Filtering and Search

### Using grep

```bash
# Show only errors
kml logs | grep ERROR

# Show Qdrant-related logs
kml logs | grep -i qdrant

# Show timing information
kml logs | grep -E '[0-9]+ms'

# Invert match (exclude debug noise)
kml logs | grep -v TRACE

# Search logs for slow operations
kml logs | grep -E "[0-9]{3,}ms"

# Show logs from a specific component
kml logs | grep "kamelot::ingest"
```

### Using Structured Log Queries

With JSON log format:

```bash
# Output as JSON
RUST_LOG_FORMAT=json kml start > /tmp/kamelot.json 2>&1

# Query with jq
cat /tmp/kamelot.json | jq 'select(.level == "ERROR")'
cat /tmp/kamelot.json | jq 'select(.target == "kamelot::qdrant")'
cat /tmp/kamelot.json | jq 'select(.fields.elapsed_ms > 100)'
```

### Log Filtering by Module

```bash
# Only ingest logs
RUST_LOG=kamelot::ingest=debug kml start

# Only Qdrant logs, and everything else at warn+
RUST_LOG=kamelot::qdrant=debug,warn kml start

# Exclude trace-level from UI module
RUST_LOG=kamelot::ui=info,kamelot::gpu=info,kamelot=debug kml start
```

---

## Performance Tracing

### Request Tracing

Kamelot supports OpenTelemetry-compatible tracing for performance analysis:

```bash
# Enable tracing
kml start --tracing

# Trace a single query
kml find "test query" --trace

# Export trace to Jaeger (if Jaeger is running)
kml config set tracing.endpoint "http://localhost:14268/api/traces"
```

### Flamegraph Generation

```bash
# Generate CPU flamegraph (requires perf)
kml start --flamegraph
# Press Ctrl+C to stop and generate flamegraph.svg

# Or for a specific operation
perf record -g kml find "test query"
perf script | stackcollapse-perf.pl | flamegraph.pl > flamegraph.svg
```

### Critical Path Timing

```
Total query time: 187ms
  ├── Omnibox IPC: 2ms (1%)
  ├── Query parsing: 1ms (0.5%)
  ├── Embedding generation: 59ms (32%)
  │   ├── Model inference: 55ms
  │   └── Postprocessing: 4ms
  ├── Qdrant search: 12ms (6%)
  │   ├── gRPC serialize: 2ms
  │   ├── HNSW search: 8ms
  │   └── gRPC deserialize: 2ms
  ├── Result ranking: 3ms (2%)
  └── UI rendering: 110ms (59%)
      ├── GPU compute: 85ms
      └── Swapchain present: 25ms
```

---

## Creating Debug Bundles

### Automated Debug Bundle

```bash
# Create a debug bundle for support
kml debug-bundle

# Output: ~/.kamelot/debug/kamelot-debug-2026-06-19T120000.tar.gz

# The bundle includes:
# - Kamelot logs (last 1000 lines)
# - Configuration file (secrets redacted)
# - System information (OS, kernel, RAM, CPU, GPU)
# - Qdrant info (version, collection size, health)
# - Ollama info (version, loaded models)
# - FUSE stat
# - Environment variables (non-sensitive)
```

### Manual Debug Collection

```bash
# Collect system information
echo "=== Kamelot Version ===" > /tmp/kamelot-debug.txt
kml --version >> /tmp/kamelot-debug.txt
echo "=== OS Info ===" >> /tmp/kamelot-debug.txt
uname -a >> /tmp/kamelot-debug.txt
echo "=== Disk Space ===" >> /tmp/kamelot-debug.txt
df -h >> /tmp/kamelot-debug.txt
echo "=== Memory ===" >> /tmp/kamelot-debug.txt
free -h >> /tmp/kamelot-debug.txt
echo "=== GPU ===" >> /tmp/kamelot-debug.txt
nvidia-smi --query >> /tmp/kamelot-debug.txt
echo "=== Kamelot Doctor ===" >> /tmp/kamelot-debug.txt
kml doctor --verbose >> /tmp/kamelot-debug.txt
echo "=== Kamelot Logs ===" >> /tmp/kamelot-debug.txt
kml logs --tail 500 >> /tmp/kamelot-debug.txt
echo "=== Config ===" >> /tmp/kamelot-debug.txt
kml config show >> /tmp/kamelot-debug.txt
echo "=== Qdrant Health ===" >> /tmp/kamelot-debug.txt
curl -s http://localhost:6333/health >> /tmp/kamelot-debug.txt
echo "=== Ollama Status ===" >> /tmp/kamelot-debug.txt
curl -s http://localhost:11434/api/tags >> /tmp/kamelot-debug.txt
```

### Sanitizing Debug Output

Before sharing debug information, remove sensitive data:

```bash
# Automatically redact sensitive info
kml debug-bundle --sanitize

# Manual redaction (replace keys with ***)
sed -i 's/encryption_key = ".*"/encryption_key = "***"/' ~/.kamelot/debug/config.txt
```

---

## Submitting Logs with Bug Reports

### Required Information

When submitting a bug report, include:

1. **Kamelot version**: `kml --version`
2. **OS**: `uname -a` (Linux/macOS) or `winver` (Windows)
3. **Hardware**: CPU, RAM, GPU, storage type
4. **Configuration**: `kml config show` (sanitized)
5. **Logs**: Last 500 lines from `kml logs --tail 500` at minimum
6. **Steps to reproduce**: Exact sequence of actions
7. **Expected vs actual behavior**: What should happen vs what happens
8. **Screenshots**: If applicable, especially for UI issues

### Bug Report Template

```
## Bug Report

**Kamelot Version:** [output of `kamelot --version`]
**OS:** [output of `uname -a` or `winver`]
**Hardware:** CPU: [model], RAM: [GB], GPU: [model], Storage: [SSD/HDD]

**Configuration:**
[output of `kamelot config show`, sanitized]

**Logs:**
[output of `kamelot logs --tail 500`]

**Steps to Reproduce:**
1.
2.
3.

**Expected Behavior:**
[what should happen]

**Actual Behavior:**
[what actually happens]

**Additional Context:**
[error messages, screenshots, related issues]
```

### Where to Submit

| Issue Type | Channel |
|-----------|---------|
| Bug reports (public) | [GitHub Issues](https://github.com/kamelot/kamelot/issues) |
| Security vulnerabilities | security@kamelot.ai |
| Enterprise support | Enterprise support portal |
| Community help | [Discord](https://discord.gg/kamelot) |

### Log Retention Policy

| Log Type | Retention | 
|----------|-----------|
| Console logs | Session only |
| File logs | 5 files x 50 MB (configurable) |
| Debug bundles | 30 days |
| Qdrant logs | 5 files x 50 MB |
| WinFSP debug | Session only (manual start) |

---

## Advanced Debugging Techniques

### Heap Profiling

For investigating memory issues:

```bash
# Enable heap profiling (Linux, requires jemalloc)
kml start --heap-profile

# Output: ~/.kamelot/debug/heap-profile-*.heap

# Analyze with jeprof
jeprof /usr/local/bin/kamelot ~/.kamelot/debug/heap-profile-*.heap
```

### Memory Leak Detection

```bash
# Run with Valgrind (Linux)
valgrind --tool=memcheck --leak-check=full kml start --model mock

# Or use Rust's built-in allocator tracking
RUSTFLAGS="-Z sanitizer=address" cargo run -- start --model mock
```

### CPU Profiling

```bash
# perf profiling (Linux)
perf record -g -p $(pgrep kamelot) -- sleep 30
perf report --stdio

# Generate flamegraph
perf script | stackcollapse-perf.pl | flamegraph.pl > kamelot-flame.svg
```

### Network Debugging

Since Kamelot primarily uses local sockets:

```bash
# Monitor Unix domain socket traffic (Linux)
strace -e trace=unix -p $(pgrep kamelot)

# Check Qdrant gRPC traffic
# Enable gRPC debug logging
RUST_LOG=tonic=debug kml start
```

---

## Log Parser Reference

### Kamelot Log Format

Default format (human-readable):
```
2026-06-19T10:30:00.123Z  INFO kamelot::ingest: Indexed 1000/47293 files (2.1%)
                        ▲     ▲                  ▲
                        │     │                  └── Message with structured fields
                        │     └── Component/module path
                        └── Timestamp (ISO 8601)
```

JSON format (machine-parsable):
```json
{
  "timestamp": "2026-06-19T10:30:00.123Z",
  "level": "INFO",
  "target": "kamelot::ingest",
  "fields": {
    "message": "Indexed 47293 files",
    "total": 47293,
    "elapsed_secs": 1334
  }
}
```

### Common Log Patterns and Their Meaning

| Pattern | Meaning | Action Required |
|---------|---------|----------------|
| `HNSW index building` | Qdrant is building the vector index | Normal, may take time |
| `Segment optimizer started` | Qdrant reorganizing segments | Normal |
| `Connection refused` | Service not running | Start the service |
| `Slow request: ...` | Request took >1s | Check resource usage |
| `File blob integrity check failed` | File has been modified externally | Run `kml fsck` |
| `Embedding model returned zero vector` | Model issue | Check model, reload |
| `FUSE readdir for query path is unimplemented` | Known limitation | Use Omnibox instead |
| `Too many open files` | Resource limit reached | Increase ulimit |
| `Watch limit reached` | Inotify limit | Increase max_user_watches |
| `OOM killer invoked` | System out of memory | Increase RAM or reduce index |

---

## Troubleshooting by Symptom

### Symptom: Daemon Won't Start

```bash
# Enable maximum verbosity
RUST_LOG=trace kml start 2>&1 | head -100

# Check configuration for errors
kml doctor
kml config validate
```

**Common causes:**
1. Qdrant not running → Start Qdrant: `docker start qdrant`
2. Ollama not running → Start Ollama: `ollama serve`
3. Configuration syntax error → Validate: `kml config validate`
4. Port already in use → Check: `netstat -an | grep 9010`
5. Data directory permissions → Check: `ls -la ~/.kamelot`

### Symptom: Search Returns No Results

```bash
# Check if files are indexed
kml status

# Force re-index a test directory
kml index ~/Documents/test/

# Run with debug logging
RUST_LOG=kamelot::qdrant=debug,kamelot::query=debug kml find "test"

# Verify Qdrant has data
curl -s http://localhost:6333/collections/kamelot | jq '.result.vectors_count'
```

**Common causes:**
1. Indexing not complete → Check status
2. Wrong index path → Verify index directories in config
3. Qdrant collection empty → Check vectors_count
4. Embedding model not loaded → Check Ollama status
5. Query too specific → Try broader search terms

### Symptom: FUSE Mount Not Working

```bash
# Debug FUSE operations
kml start --fuse-debug

# Check if FUSE kernel module is loaded
lsmod | grep fuse

# Verify mount point exists
ls -la /kml

# Check FUSE mount status
mount | grep kml

# Test with simple operation
stat /kml
ls /kml/
```

**Common causes:**
1. FUSE not installed → Install libfuse3
2. user_allow_other not set → Configure fuse.conf
3. Mount point already in use → Check with `mount`
4. Permission denied → Run with appropriate privileges
5. macOSFUSE not signed → Use fuse-t instead

---

## Debugging Configuration

### Common Debug Scenarios

```bash
# Scenario 1: Investigate slow queries
RUST_LOG=kamelot::query=debug,kamelot::embed=debug kml start
kml find "complex query here"
# Look for: embedding timing, qdrant search timing

# Scenario 2: Debug index issues
RUST_LOG=kamelot::ingest=trace,kamelot::parse=trace kml start
# Watch file parsing and embedding generation

# Scenario 3: Debug FUSE operations
RUST_LOG=kamelot::fuse=trace kml start --fuse-debug
# See all FUSE readdir, open, read calls

# Scenario 4: Debug IPC between UI and daemon
RUST_LOG=kamelot::ipc=debug kml start
RUST_LOG=info kml find "test"  # In another terminal

# Scenario 5: Debug encryption/decryption
RUST_LOG=kamelot::store=debug,kamelot::crypto=debug kml start
```

### Temporary Debug Override

For one-off debugging sessions without modifying config:

```bash
# Override log level for this session only
RUST_LOG=kamelot=debug kml start --log-file ~/debug-session.log
```

The log file captures the full debug session. Share it with support if needed.

---

## Debug Bundle Contents

The `kml debug-bundle` command collects:

```
kamelot-debug-YYYY-MM-DDTHHMMSS/
├── kamelot.log                  # Last 1000 lines of daemon log
├── config.toml                  # Sanitized configuration (keys redacted)
├── system-info.txt              # OS, kernel, RAM, CPU info
├── gpu-info.txt                 # GPU model, VRAM, driver version
├── disK-space.txt               # Available space on all mounts
├── kml-doctor-verbose.txt       # Output of `kml doctor --verbose`
├── qdrant-health.json           # Qdrant health check response
├── qdrant-collections.json      # Qdrant collection info
├── ollama-tags.json             # Ollama loaded models
├── fuse-stat.txt                # FUSE mount statistics
├── env-vars.txt                 # Non-sensitive environment variables
├── installed-packages.txt       # Kamelot-related packages
├── ledger-verify.txt            # Ledger integrity check results
└── error-summary.txt            # Summary of errors found
```

Debug bundles are anonymized by default (file paths are truncated, keys are redacted). Use `--sanitize` for additional privacy.

---

## Telemetry and Diagnostics

### Opt-In Diagnostics

Kamelot can optionally collect diagnostics to improve the product:

```toml
[telemetry]
enabled = true                    # Enable opt-in telemetry
diagnostics = true                # Include diagnostic data
crash_reports = true              # Include crash reports
```

### What Diagnostics Include

- Query timing (not query content)
- Feature usage frequency
- System configuration (OS, RAM, GPU model)
- Error counts and types
- Performance metrics

### What Diagnostics Exclude

- File contents
- File names or paths
- Query text
- Encryption keys
- User identity
- Network information

### Viewing Your Telemetry

```bash
# View your local telemetry data
kml stats --detailed

# Export telemetry
kml stats --export /tmp/kamelot-stats.json
```

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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

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
