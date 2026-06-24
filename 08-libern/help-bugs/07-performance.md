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
Category: help-bugs | ID: LIB-HLP-007

────────────────────────────────────────────────────────────────

# Performance Issues

## 1. Overview

Libern is designed to be lightweight and efficient, but performance can be affected by hardware limitations, configuration issues, database size, network conditions, or software conflicts. This guide covers common performance problems and their solutions.

Performance issues generally fall into these categories:
1. High CPU usage
2. Memory leaks or excessive memory consumption
3. Slow startup
4. UI sluggishness
5. Network performance degradation
6. Disk I/O bottlenecks

### Performance Bottleneck Flow

```
┌─────────────────────────────────────────────────────────┐
│              Performance Analysis Flow                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Performance Issue?                                      │
│         │                                                 │
│         ▼                                                 │
│  Identify symptom:                                        │
│  ├── High CPU → Check AI, rendering, background tasks    │
│  ├── High RAM → Check cache, webview, undo history       │
│  ├── Slow startup → Check DB size, AI model load         │
│  ├── UI lag → Check FPS, GPU, message count              │
│  ├── Network slow → Check bandwidth, sync queue          │
│  └── Disk high → Check DB journal, logs, cache           │
│                                                          │
│  Apply optimization:                                      │
│  1. Quick wins (restart, disable AI, compact DB)         │
│  2. Configuration tuning (cache limits, intervals)       │
│  3. Hardware upgrade (RAM, SSD, GPU)                     │
│                                                          │
│  Verify improvement with:                                 │
│  `libern --performance-report`                           │
└─────────────────────────────────────────────────────────┘
```

---

## 2. High CPU Usage

### Normal CPU Usage Patterns

| Feature | CPU Impact | Duration |
|---------|-----------|----------|
| Idle (no activity) | 0-2% | Continuous |
| Message rendering | 5-15% | While scrolling |
| AI inference | 20-100% | 1-30 seconds per query |
| Voice encoding/decoding | 5-10% | During voice chat |
| Database backup | 10-30% | During backup |
| Initial sync | 10-40% | During sync |
| Whiteboard rendering | 5-20% | While using whiteboard |

CPU usage above these levels for extended periods indicates a problem.

### Causes and Solutions

**AI inference consuming CPU:**
The local AI model can use significant CPU resources, especially on systems without GPU acceleration.

**Solutions:**
- Enable GPU acceleration if available
- Reduce AI model size
- Disable AI features you do not need
- Limit concurrent AI operations to 1

**Background tasks consuming CPU:**
Database maintenance, .aioss export, and peer synchronization can use CPU.

**Solutions:**
- Check what tasks are running: `libern --tasks`
- Postpone heavy tasks to scheduled times
- Reduce sync frequency

**Rendering performance:**
Large message histories or complex UI elements can cause high CPU usage.

**Solutions:**
- Reduce visible message count (compact mode)
- Disable animations
- Disable message formatting (markdown rendering)

---

## 3. Memory Leaks

### Normal Memory Usage

| Configuration | Baseline Memory | With AI Model |
|---------------|----------------|---------------|
| Minimal (no AI, few servers) | 150-300 MB | N/A |
| Standard (AI, several servers) | 400-800 MB | +500 MB to 2 GB |
| Heavy (AI, many servers, large history) | 800 MB - 2 GB | +500 MB to 2 GB |

### Common Causes

**Unbounded message cache:**
The UI may keep all loaded messages in memory.

**Solutions:**
- Reduce loaded message limit
- Set cache limit in settings
- Restart Libern periodically

**Webview memory growth:**
The embedded webview may accumulate memory over time.

**Solutions:**
- Restart Libern daily for heavy usage
- Clear webview cache
- Disable unused UI features

**Large file previews:**
Previewing large images, videos, or documents consumes memory.

**Solutions:**
- Set file preview size limit
- Disable auto-preview for large files

### Detecting Memory Leaks

**Windows:**
```
for /l %i in (1,1,10) do (
  tasklist /fi "imagename eq libern.exe" /fo csv /nh
  timeout /t 60
)
```

**macOS/Linux:**
```
while true; do
  ps -o rss= -p $(pgrep libern) | awk '{print $1/1024 " MB"}'
  sleep 60
done
```

A steady increase in memory usage over hours without plateauing indicates a memory leak.

---

## 4. Slow Startup

### Normal Startup Time

| System | Startup Time |
|--------|-------------|
| SSD, fast CPU | 2-5 seconds |
| HDD, fast CPU | 5-10 seconds |
| SSD, slow CPU | 5-15 seconds |
| HDD, slow CPU | 10-30 seconds |

### Causes and Solutions

**Large database:**
A large SQLite database takes longer to load and verify.

**Solutions:**
- Archive old data to .aioss and prune
- Run database maintenance: `libern --vacuum-db`
- Exclude Libern data from antivirus scanning

**AI model loading:**
Loading the AI model into memory is a significant part of startup.

**Solutions:**
- Disable AI auto-load on startup
- Use a smaller AI model
- The AI model loads in the background; the UI should appear quickly

---

## 5. Performance Optimization Checklist

### Quick Wins

1. Restart Libern (clears memory and caches)
2. Disable AI features (reduces CPU and memory)
3. Leave unnecessary servers (reduces sync and memory)
4. Compact database (`libern --vacuum-db`)
5. Clear cache (Settings > Advanced > Clear Cache)
6. Reduce loaded history (Settings > Chat > Load History)
7. Use compact mode (Settings > Appearance > Compact)

### Advanced Tuning

```json
{
  "performance": {
    "message_cache_limit": 500,
    "gpu_acceleration": true,
    "animations_enabled": false,
    "virtual_scrolling_buffer": 10,
    "sync_interval_ms": 5000,
    "ai_max_concurrent": 1,
    "log_level": "error",
    "cache_size_mb": 200,
    "max_peer_connections": 20
  }
}
```

### Hardware Recommendations

| Usage Level | CPU | RAM | Storage | GPU |
|-------------|-----|-----|---------|-----|
| Light (chat only) | Any dual-core | 4 GB | 500 MB | Any |
| Moderate (+ AI) | Quad-core 2.5 GHz | 8 GB | 10 GB | Integrated |
| Heavy (+ voice, whiteboard) | Hexa-core 3 GHz | 16 GB | 50 GB | Dedicated GPU |
| Enterprise (many servers) | Octa-core 3.5 GHz | 32 GB | 100 GB | Dedicated GPU |

---

## 6. Diagnostic Commands

```
# Performance report
libern --performance-report

# Database statistics
libern --db-stats

# Memory usage details
libern --memory-stats

# Network performance
libern --network-stats

# AI performance benchmark
libern --ai-benchmark

# Full system check
libern --diagnose
```

---

## 7. Performance Troubleshooting Reference

| Issue | Diagnostic | Quick Fix | Long-term Fix |
|-------|-----------|-----------|---------------|
| High CPU | Task Manager | Restart, disable AI | Upgrade CPU |
| High RAM | Memory monitor | Clear cache, restart | Add RAM |
| Slow startup | --profile-startup | Disable AI auto-load | Switch to SSD |
| UI lag | Check FPS | Compact mode, disable animations | Upgrade GPU |
| Network slow | --network-stats | Reduce sync, limit peers | Upgrade network |
| Disk high | --db-stats | Vacuum DB, clear cache | Move to SSD |
| AI slow | --ai-benchmark | Reduce max_tokens | Use GPU, upgrade CPU |

---

## 8. Reporting Performance Issues

When reporting a performance issue, include:

1. Libern version
2. Operating system and version
3. Hardware specifications (CPU, RAM, GPU, storage type)
4. What you were doing when the performance issue occurred
5. How long the issue has been happening
6. Libern's performance report: `libern --performance-report`
7. System resource usage at the time of the issue (screenshot or log)

This information helps the development team identify and fix performance regressions and bottlenecks.

---

## 11. Performance Benchmarking

### Running Benchmarks

```bash
# Full performance benchmark
libern --performance-benchmark

# AI-specific benchmark
libern --ai-benchmark

# Database performance
libern --db-benchmark

# Network throughput
libern --network-benchmark
```

### Benchmark Results Interpretation

**AI Benchmark:**
```
Inference speed: 12.5 tokens/sec
First token latency: 850ms
Memory usage: 2.3 GB
GPU utilization: 0% (CPU mode)
```
- 12.5 tokens/sec is moderate (expected for CPU)
- 850ms first token latency is normal
- If GPU utilization is 0%, GPU acceleration is not active

**Database Benchmark:**
```
Read throughput: 50,000 rows/sec
Write throughput: 10,000 rows/sec
Query latency (simple): 2ms
Query latency (complex): 15ms
```
- Values > 10,000 rows/sec are healthy
- If < 1,000 rows/sec, check disk health

---

## 12. Performance Comparison Table

### Libern vs Discord Performance

| Metric | Discord | Libern |
|--------|---------|--------|
| RAM (idle) | 200-500 MB | 150-300 MB |
| RAM (active) | 500 MB - 2 GB | 400 MB - 2 GB |
| CPU (idle) | 1-5% | 0-2% |
| CPU (active) | 10-30% | 5-40% |
| Startup time | 3-10s | 2-15s |
| Message load (10k) | 1-2s | 0.5-1s |
| Disk usage | Various | 500 MB - 2 GB |

### Memory Over Time

| Duration | Discord (typical) | Libern (typical) |
|----------|-------------------|------------------|
| At startup | 200 MB | 180 MB |
| After 1 hour | 350 MB | 250 MB |
| After 4 hours | 500 MB | 320 MB |
| After 8 hours | 700 MB | 400 MB |
| After 24 hours | 900 MB | 500 MB |

Libern typically uses less memory because:
- No web-based chat history (local SQLite)
- No cloud sync buffers
- Minimal telemetry/analytics code
- No service worker overhead

---

## 13. System Monitoring Scripts

### Windows Performance Monitor

```powershell
# Monitor Libern performance over time
$logFile = "libern_perf.csv"
"Timestamp,CPU%,MemoryMB" | Out-File $logFile

while ($true) {
    $proc = Get-Process libern -ErrorAction SilentlyContinue
    if ($proc) {
        $cpu = $proc.CPU
        $mem = [math]::Round($proc.WorkingSet64 / 1MB)
        "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss'),$cpu,$mem" | Out-File $logFile -Append
    }
    Start-Sleep -Seconds 10
}
```

### macOS/Linux Performance Monitor

```bash
#!/bin/bash
# libern-perf-monitor.sh

LOG_FILE="libern_perf.csv"
echo "Timestamp,CPU%,RSS_KB" > "$LOG_FILE"

while true; do
    PID=$(pgrep libern)
    if [ -n "$PID" ]; then
        STATS=$(ps -p "$PID" -o %cpu,rss --no-headers 2>/dev/null)
        if [ -n "$STATS" ]; then
            echo "$(date '+%Y-%m-%d %H:%M:%S'),$STATS" >> "$LOG_FILE"
        fi
    fi
    sleep 10
done
```

### Visualizing Performance Data

Import the CSV into Excel or use any charting tool to visualize:
- Memory usage trend (increasing = possible leak)
- CPU usage spikes (correlate with specific actions)
- Baseline vs peak usage

---

## 14. Common Performance Myths

| Myth | Reality |
|------|---------|
| "More RAM always helps" | Libern uses RAM efficiently. Excess RAM won't speed up AI significantly. |
| "SSD isn't necessary" | Database operations benefit significantly from SSD random I/O. |
| "Disabling AI saves no resources" | AI is the largest resource consumer. Disabling it can reduce CPU by 90%. |
| "More peers = better performance" | Each peer adds CPU/memory for connection management. Limit to necessary peers. |
| "Background tasks don't matter" | Database backup, .aioss export, and sync all consume resources. Schedule them. |

---

## 15. Performance Optimization Case Studies

### Case Study 1: High CPU from AI

**Problem:** User with 4 GB RAM, CPU-only, experiencing 100% CPU for 30 seconds per AI query.

**Analysis:**
- Model: Qwen 2.5 1.5B (default)
- CPU: i5-8250U (no AVX2)
- RAM: 4 GB (2 GB free)

**Solution:**
1. Reduced `max_tokens` from 512 to 128
2. Reduced `context_messages` from 20 to 5
3. AI response time dropped from 30s to 8s
4. CPU usage dropped from 100% to 60%

### Case Study 2: Slow Startup

**Problem:** Libern takes 45 seconds to start.

**Analysis:**
- Database: 500 MB (large message history)
- AI model: Loading on startup
- OS: Windows 10, HDD

**Solution:**
1. Set `ai.load_on_startup: false`
2. Ran `libern --vacuum-db` (reduced DB to 300 MB)
3. Excluded Libern directory from Windows Defender
4. Startup time dropped from 45s to 8s

### Case Study 3: Memory Growth Over Time

**Problem:** Libern memory grows from 200 MB to 2 GB over 8 hours.

**Analysis:**
- User had 50 servers with active channels
- Large file previews accumulating
- Undo history growing unbounded

**Solution:**
1. Left unnecessary servers (reduced to 10)
2. Set `message_cache_limit: 200`
3. Reduced `undo_history_size: 25`
4. Enabled automatic cache clearing every 4 hours
5. Memory stabilized at ~400 MB

---

## 16. Performance Configuration Reference

### All Performance Settings

```json
{
  "performance": {
    "message_cache_limit": 500,
    "gpu_acceleration": true,
    "animations_enabled": true,
    "virtual_scrolling_buffer": 10,
    "sync_interval_ms": 5000,
    "ai_max_concurrent": 1,
    "log_level": "warn",
    "cache_size_mb": 200,
    "max_peer_connections": 20,
    "file_preview_max_size_mb": 10,
    "auto_backup": false,
    "backup_interval_hours": 24,
    "message_preview_mode": "compact",
    "emoji_rendering": "native"
  }
}
```

### Recommended Settings by Use Case

**Minimal resource usage:**
```json
{
  "message_cache_limit": 100,
  "animations_enabled": false,
  "ai_max_concurrent": 0,
  "log_level": "error",
  "cache_size_mb": 50,
  "message_preview_mode": "compact"
}
```

**Balanced (default):**
```json
{
  "message_cache_limit": 500,
  "animations_enabled": true,
  "ai_max_concurrent": 1,
  "log_level": "warn",
  "cache_size_mb": 200,
  "message_preview_mode": "normal"
}
```

**Maximum performance:**
```json
{
  "message_cache_limit": 2000,
  "gpu_acceleration": true,
  "animations_enabled": true,
  "ai_max_concurrent": 2,
  "virtual_scrolling_buffer": 20,
  "cache_size_mb": 500,
  "message_preview_mode": "rich"
}
```

────────────────────────────────────────────────────────────────

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.
