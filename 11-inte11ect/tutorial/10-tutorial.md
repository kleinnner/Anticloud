<!-- ASCII Art for His-11 -->


¦¦¦+   ¦¦+¦¦¦¦¦¦¦¦+¦¦¦¦¦¦¦+¦¦+     ¦¦¦¦¦¦¦+ ¦¦¦¦¦¦+ ¦¦¦¦¦+ ¦¦¦¦¦¦¦+¦¦+  ¦¦+¦¦¦¦¦¦+ ¦¦+   ¦¦+¦¦¦¦¦¦¦¦+
¦¦¦¦+  ¦¦¦+--¦¦+--+¦¦+----+¦¦¦     ¦¦+----+¦¦+----+¦¦+--¦¦+¦¦+----+¦¦¦  ¦¦¦¦¦+--¦¦+¦¦¦   ¦¦¦+--¦¦+--+
¦¦+¦¦+ ¦¦¦   ¦¦¦   ¦¦¦¦¦+  ¦¦¦     ¦¦¦¦¦+  ¦¦¦     ¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦+¦¦¦¦¦¦¦¦¦¦¦¦¦¦++¦¦¦   ¦¦¦   ¦¦¦   
¦¦¦+¦¦+¦¦¦   ¦¦¦   ¦¦+--+  ¦¦¦     ¦¦+--+  ¦¦¦     ¦¦+--¦¦¦+----¦¦¦¦¦+--¦¦¦¦¦+--¦¦+¦¦¦   ¦¦¦   ¦¦¦   
¦¦¦ +¦¦¦¦¦   ¦¦¦   ¦¦¦¦¦¦¦+¦¦¦¦¦¦¦+¦¦¦¦¦¦¦++¦¦¦¦¦¦+¦¦¦  ¦¦¦¦¦¦¦¦¦¦¦¦¦¦  ¦¦¦¦¦¦  ¦¦¦+¦¦¦¦¦¦++   ¦¦¦   
+-+  +---+   +-+   +------++------++------+ +-----++-+  +-++------++-+  +-++-+  +-+ +-----+    +-+   

¦¦¦¦¦¦¦¦+¦¦¦¦¦¦+  ¦¦¦¦¦¦+ ¦¦+   ¦¦+¦¦¦¦¦¦+ ¦¦+     ¦¦¦¦¦¦¦+¦¦¦¦¦¦¦+¦¦+  ¦¦+ ¦¦¦¦¦¦+  ¦¦¦¦¦¦+ ¦¦¦¦¦¦¦+
+--¦¦+--+¦¦+--¦¦+¦¦+---¦¦+¦¦¦   ¦¦¦¦¦+--¦¦+¦¦¦     ¦¦+----+¦¦+----+¦¦¦  ¦¦¦¦¦+---¦¦+¦¦+----+ ¦¦+----+
   ¦¦¦   ¦¦¦¦¦¦++¦¦¦   ¦¦¦¦¦¦   ¦¦¦¦¦¦¦¦¦++¦¦¦     ¦¦¦¦¦+  ¦¦¦¦¦¦¦+¦¦¦¦¦¦¦¦¦¦¦   ¦¦¦¦¦¦  ¦¦¦+¦¦¦¦¦¦¦+
   ¦¦¦   ¦¦+--¦¦+¦¦¦   ¦¦¦¦¦¦   ¦¦¦¦¦+--¦¦+¦¦¦     ¦¦+--+  +----¦¦¦¦¦+--¦¦¦¦¦¦   ¦¦¦¦¦¦   ¦¦¦+----¦¦¦
   ¦¦¦   ¦¦¦  ¦¦¦+¦¦¦¦¦¦+++¦¦¦¦¦¦++¦¦¦  ¦¦¦¦¦¦¦¦¦¦+¦¦¦¦¦¦¦+¦¦¦¦¦¦¦¦¦¦¦  ¦¦¦+¦¦¦¦¦¦+++¦¦¦¦¦¦++¦¦¦¦¦¦¦¦
   +-+   +-+  +-+ +-----+  +-----+ +-+  +-++------++------++------++-+  +-+ +-----+  +-----+ +------+

*Lois-Kleinner and 0-1.gg 2026 - Inte11ect Platform Documentation*
*Confidential - All Rights Reserved*


---

# Troubleshooting

> **Associated Module:** His-11 — Diagnostics & Error Resolution
> **Tutorial 10 of 12** — Estimated reading time: 18 min | Hands-on time: 20 min

## Overview

This comprehensive troubleshooting guide covers the most common issues encountered when using Inte11ect, organized by subsystem. Each issue includes symptoms, diagnosis steps, and resolution procedures.

Topics covered:

- Installation and launch failures
- Model loading errors
- Inference issues
- GOD-11 routing problems
- Module failures
- .aioss ledger issues
- Performance problems
- Network and API errors
- Build and compilation errors

---

## Section 1 — The Diagnostic Toolkit

### Built-in Diagnostics

```bash
# Comprehensive health check
inte11ect doctor

# System information
inte11ect doctor --all
```

### Doctor Output Explained

```bash
inte11ect doctor

# +------------------------------------------------------+
# ¦  Inte11ect Diagnostic Report                         ¦
# ¦------------------------------------------------------¦
# ¦  System                                               ¦
# ¦  +- OS: Windows 11 Pro (build 22631)                 ¦
# ¦  +- CPU: Intel Core i9-14900K (24 cores, 32 threads) ¦
# ¦  +- RAM: 63.8 GB (42.1 GB available)                 ¦
# ¦  +- Disk: 142 GB free (NVMe)                         ¦
# ¦  +- GPU: NVIDIA RTX 4090 (24 GB, driver 551.86)      ¦
# ¦  Inte11ect                                            ¦
# ¦  +- Version: 1.2.3 (build 20260619)                  ¦
# ¦  +- Data dir: ~/.inte11ect (valid)                   ¦
# ¦  +- Config: ~/.inte11ect/config.toml (valid)         ¦
# ¦  +- Models: 2 installed (Qwen2-VL-2B, Mistral-7B)   ¦
# ¦  +- Modules: 47/72 active                            ¦
# ¦  +- GOD-11: Running (eigenvector router)             ¦
# ¦  +- Ledger: ? Integrity verified (12,847 entries)    ¦
# ¦  +- API: Listening on 0.0.0.0:8080 ?                ¦
# +------------------------------------------------------+
```

### Log Files

```bash
# Main log
~/.inte11ect/logs/inte11ect.log

# Module-specific logs
~/.inte11ect/logs/modules/cog-reasoning.log

# Last crash log
~/.inte11ect/logs/crash/last_crash.txt

# View live logs
inte11ect log tail --follow

# Filter logs by severity
inte11ect log tail --level error --lines 50
```

---

## Section 2 — Installation Issues

### "Application won't launch"

**Symptoms:**
- Double-clicking the icon does nothing
- No window appears
- Process exits immediately

**Diagnosis:**
```bash
inte11ect doctor
```

**Common Causes and Fixes:**

| Cause | Check | Solution |
|-------|-------|----------|
| Missing dependencies | `inte11ect doctor` shows red | Install missing libraries |
| GPU driver too old | `inte11ect doctor --gpu` | Update GPU driver |
| Corrupted installation | Reinstall needed | `inte11ect doctor --repair` |
| Antivirus blocking | Check AV logs | Add exception for Inte11ect |
| Port conflict | `netstat -an \| findstr :8080` | Change port in config |

**Resolution:**
```powershell
# Windows: Clean reinstall
& "$env:LOCALAPPDATA\Programs\Inte11ect\uninstall.exe"
rm -r "$env:LOCALAPPDATA\Programs\Inte11ect"
rm -r "$env:USERPROFILE\.inte11ect\data"
# Re-download and install
```

### "Tauri runtime error"

**Symptoms:**
- Error dialog: "WebView2 runtime not found" (Windows)
- Error: "GTK initialization failed" (Linux)

**Resolution:**
```bash
# Windows: Install WebView2
# https://developer.microsoft.com/en-us/microsoft-edge/webview2/

# Linux: Install WebKit2GTK
sudo apt-get install libwebkit2gtk-4.1-dev
```

### "Permission denied on data directory"

**Resolution:**
```bash
# Linux/macOS
chmod -R 755 ~/.inte11ect

# Or set a different data directory
export INTELLECT_DATA_DIR=/path/to/writable/dir
```

---

## Section 3 — Model Issues

### "Model download fails"

**Diagnosis:**
```bash
inte11ect models download Qwen/Qwen2-VL-2B-Instruct --verbose
```

**Common Issues:**

| Problem | Indicator | Solution |
|---------|-----------|----------|
| No internet | `curl: (6) Could not resolve host` | Check connection |
| HuggingFace blocked | 403 error | Set `HF_TOKEN` or use mirror |
| Disk full | `Error: No space left on device` | Free space or change model dir |
| Rate limited | 429 error | Wait 1 hour or use token |
| Corrupted download | SHA-256 mismatch | `inte11ect models download --repair` |

### "Out of memory when loading model"

**Symptoms:**
- `cudaErrorMemoryAllocation` in logs
- Application freezes or crashes
- `inte11ect doctor --gpu` shows < 1 GB VRAM free

**Resolution:**
```bash
# Use INT4 quantization
inte11ect models use Qwen2-VL-2B-Instruct --quantization int4

# Or use CPU with memory limits
inte11ect models use Qwen2-VL-2B-Instruct --device cpu --cpu-threads 8

# Or offload layers to system RAM
inte11ect models use Qwen2-VL-2B-Instruct --offload-layers 1-12
```

### "Model produces gibberish"

**Symptoms:**
- Output is random characters
- Output is repetitive loops
- Output is blank

**Diagnosis:**
```bash
inte11ect models verify Qwen2-VL-2B-Instruct
inte11ect infer --model Qwen2-VL-2B-Instruct --prompt "Hello" --temperature 0.1
```

**Solutions:**

1. **Corrupted weights**: Re-download the model
2. **Wrong tokenizer**: `inte11ect models tokenizer reset`
3. **Temperature too high**: Reduce to 0.1-0.7
4. **Prompt format wrong**: Ensure correct chat template
5. **Quantization too aggressive**: Use FP16

### "Vision input not working"

**Symptoms:**
- Error: "Image processing failed"
- Model ignores the image
- "Unsupported media type"

**Solutions:**
```bash
# Check vision processor
inte11ect models verify Qwen2-VL-2B-Instruct --component vision

# Reinstall vision components
inte11ect models download Qwen/Qwen2-VL-2B-Instruct --components vision

# Supported image formats: PNG, JPEG, WebP, BMP
# Max resolution: 2048×2048
# Max file size: 20 MB
```

---

## Section 4 — GOD-11 Issues

### "Router returning suboptimal paths"

**Symptoms:**
- High latency on simple queries
- Modules being selected that don't improve quality
- Low confidence scores

**Diagnosis:**
```bash
inte11ect god metrics --filter router
inte11ect god trace --query-id <id>
```

**Solutions:**
```bash
# Reset the affinity matrix
inte11ect god reset --affinity

# Increase exploration rate
inte11ect god config --set learner.exploration_rate=0.2

# Increase power iterations
inte11ect god config --set router.eigenvector_iterations=100
```

### "GOD-11 stuck in infinite loop"

**Symptoms:**
- Query never completes
- CPU at 100%
- Log shows repeated routing decisions

**Resolution:**
```bash
# Cancel stuck query
inte11ect infer cancel --query-id <id>

# Reset GOD-11
inte11ect god reset --all

# Set max path length
inte11ect god config --set constraints.max_modules_per_path=8
```

### "Module not being routed to"

**Symptoms:**
- A module is enabled but never invoked
- Specific capability not available

**Diagnosis:**
```bash
# Check module metrics
inte11ect module metrics <module_id>

# Check GOD-11 routing preferences
inte11ect god trace --prompt "test"
```

**Solutions:**
```bash
# Force-include module in routing
inte11ect god config --set router.force_include=<module_id>

# Increase the module's affinity weight
inte11ect god config --set affinity.<module_id>=0.9
```

---

## Section 5 — Module Issues

### "Module fails to enable"

**Symptoms:**
- Error: "Dependency not satisfied"
- Error: "Module not found"
- Error: "Version conflict"

**Diagnosis:**
```bash
inte11ect module enable <module_id> --verbose
inte11ect module describe <module_id>
```

**Solutions:**
```bash
# Install missing dependencies
inte11ect module install <dependency_id>

# Check version compatibility
inte11ect module list --versions

# Force enable (bypass dependency check)
inte11ect module enable <module_id> --force
```

### "Module crashes repeatedly"

**Symptoms:**
- Module appears in crash loop
- Log shows repeated "panic" or "error"
- CPU usage spikes then drops

**Diagnosis:**
```bash
inte11ect module logs <module_id> --tail 100
inte11ect module metrics <module_id>
```

**Solutions:**
```bash
# Restart the module
inte11ect module restart <module_id>

# Reset module state
inte11ect module reset <module_id>

# Increase module timeout
inte11ect module config <module_id> --set timeout_secs=60

# Disable and report bug
inte11ect module disable <module_id>
inte11ect module report <module_id>
```

### "Module resource exhaustion"

**Symptoms:**
- System becomes sluggish
- Other modules slow down
- OOM errors

**Diagnosis:**
```bash
inte11ect module top
```

**Solutions:**
```bash
# Limit module resources
inte11ect module config <module_id> --set max_cpu=30
inte11ect module config <module_id> --set max_memory_mb=1024

# Kill the module process
inte11ect module kill <module_id>
```

---

## Section 6 — Ledger Issues

### "Integrity check failed"

**Symptoms:**
- `inte11ect ledger verify` reports mismatch
- Entries appear modified
- Merkle root changed unexpectedly

**Diagnosis:**
```bash
inte11ect ledger verify --full --verbose
inte11ect ledger tail --json --lines 10
```

**Resolution:**
```bash
# Find the tampered entry
inte11ect ledger verify --find-first-failure

# Restore from backup
inte11ect ledger restore --latest-backup

# If no backup, rebuild from journal
inte11ect ledger rebuild --from-journal

# Investigate security incident
inte11ect ledger audit --investigate
```

### "Ledger database locked"

**Symptoms:**
- `inte11ect ledger status` returns "database is locked"
- Operations hang

**Resolution:**
```bash
# Find the locking process
# Windows: Handle.exe or Process Explorer
# Linux: lsof ~/.inte11ect/ledger/aioss.db

# Wait for the lock to release, or restart Inte11ect
# If locked permanently:
inte11ect ledger repair
```

### "Ledger growing too large"

**Symptoms:**
- aioss.db > 10 GB
- Slow queries
- Disk space concerns

**Solutions:**
```bash
# Archive old entries
inte11ect ledger archive --older-than 90d

# Prune archived entries
inte11ect ledger prune --older-than 365d

# Or disable auto-archiving and prune manually
inte11ect ledger --config "auto_prune_days=90"
```

---

## Section 7 — Performance Issues

### "Slow inference"

**Symptoms:**
- TTFT > 2 seconds
- Tokens/second < 10

**Diagnosis:**
```bash
inte11ect benchmark --model Qwen2-VL-2B-Instruct
inte11ect profile start --duration 30
inte11ect profile hotspots
```

**Quick Wins:**
```bash
# 1. Switch quantization
inte11ect models use --quantization int8

# 2. Enable flash attention
inte11ect config --set model.use_flash_attn=true

# 3. Enable CUDA graphs
inte11ect config --set cuda.cuda_graphs_enabled=true

# 4. Reduce max tokens
inte11ect config --set model.max_tokens=512
```

### "High memory usage"

**Symptoms:**
- VRAM at 95%+
- System RAM at 80%+
- OOM errors

**Solutions:**
```bash
# Enable memory swapping
inte11ect config --set memory.swap_enabled=true

# Reduce KV-cache size
inte11ect config --set model.kv_cache_max_tokens=2048

# Use INT4 quantization
inte11ect models use --quantization int4
```

### "Module pipeline slow"

**Symptoms:**
- Inference latency high even though model is fast
- GOD-11 routing adds significant overhead

**Solutions:**
```bash
# Enable parallel execution
inte11ect config --set modules.parallel_execution=true

# Cache routes
inte11ect config --set router.route_cache_size=5000

# Reduce routing iterations
inte11ect config --set router.eigenvector_iterations=20
```

---

## Section 8 — Network and API Issues

### "Cannot connect to API"

**Symptoms:**
- `curl: (7) Failed to connect`
- WebSocket connection refused

**Diagnosis:**
```bash
# Check if API is running
inte11ect api status

# Check port
netstat -an | findstr :8080

# Check firewall
# Windows: Check Windows Defender Firewall
```

**Solutions:**
```bash
# Ensure API is enabled
inte11ect config --set api.enabled=true

# Restart API
inte11ect api restart

# Change port if conflicted
inte11ect config --set api.port=8081
```

### "CORS errors"

**Symptoms:**
- Browser console: "Cross-Origin Request Blocked"

**Solutions:**
```bash
# Allow all origins (development)
inte11ect config --set api.cors_origins=["*"]

# Allow specific origins
inte11ect config --set api.cors_origins=["https://myapp.com"]
```

### "TLS/SSL errors"

**Symptoms:**
- `Error: self-signed certificate`
- `Error: certificate expired`

**Solutions:**
```bash
# Disable TLS for local development
inte11ect config --set api.tls_enabled=false

# Or provide valid certificates
inte11ect config --set api.tls_cert=/path/to/cert.pem
inte11ect config --set api.tls_key=/path/to/key.pem
```

---

## Section 9 — Build Issues

### "Rust compilation error"

**Symptoms:**
- `error[E0277]: the trait bound ...`
- `error: linking with cc failed`

**Solutions:**
```bash
# Update Rust
rustup update stable

# Check minimum version
rustc --version  # Must be 1.75+

# Clean build artifacts
cargo clean
cargo build
```

### "Cargo dependency conflict"

**Symptoms:**
- `error: failed to select a version for ...`
- `conflicting requirements`

**Solutions:**
```bash
# Update Cargo.lock
cargo update

# Or manually specify versions in Cargo.toml
# [dependencies]
# inte11ect-sdk = "=0.1.0"
```

### "npm build fails"

**Symptoms:**
- `Error: Module not found`
- `SyntaxError: Unexpected token`

**Solutions:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run build
```

---

## Section 10 — Crash Recovery

### Application Crash

```bash
# View crash report
cat ~/.inte11ect/logs/crash/last_crash.txt

# The crash report includes:
# - Crash timestamp
# - Stack trace
# - System state at crash
# - Last log entries

# Submit crash report
inte11ect crash submit
```

### Data Recovery

```bash
# Backup locations
~/.inte11ect/ledger/backups/
~/.inte11ect/config.toml.bak

# Restore from backup
inte11ect restore --backup ~/.inte11ect/backups/inte11ect_2026-06-18.tar.gz
```

### Safe Mode

```bash
# Start in safe mode (disables all non-essential modules)
inte11ect --safe-mode

# In safe mode:
# - Only core modules are loaded
# - No external connections
# - Diagnostics mode
# - Default configuration
```

---

## Section 11 — Error Code Reference

| Code | Meaning | Common Cause |
|------|---------|--------------|
| E001 | Model not found | Model ID does not match installed models |
| E002 | Out of memory | VRAM/RAM exhausted |
| E003 | Module dependency error | Required module not enabled |
| E004 | Ledger integrity failure | Data corruption detected |
| E005 | API authentication failed | Invalid or expired API key |
| E006 | Network timeout | Connection to external service failed |
| E007 | Configuration parse error | Invalid TOML syntax in config |
| E008 | Quantization error | Unsupported quantization format |
| E009 | Vision processor error | Image decoding failed |
| E010 | Router convergence failure | Eigenvector computation did not converge |
| E011 | Module crash | Module encountered an unrecoverable error |
| E012 | Database locked | Concurrent ledger access |
| E013 | License expired | Commercial license needs renewal |
| E014 | File system error | Permission denied or disk full |
| E015 | Build tool missing | Required build dependency not found |

---

## Section 12 — Getting Help

```bash
# Built-in help
inte11ect help
inte11ect <command> --help

# Online resources
# Documentation: https://docs.intelleect.dev
# GitHub Issues: https://github.com/inte11ect/inte11ect/issues
# Discord: https://discord.gg/inte11ect

# Submit a bug report
inte11ect bug report --description "..." --logs

# Check version for known issues
inte11ect version
# Then check: https://github.com/inte11ect/inte11ect/releases
```

---

## Next Steps

- [11-tutorial.md](./11-tutorial.md) — Security best practices
- [12-tutorial.md](./12-tutorial.md) — Exporting and sharing logs
- [01-tutorial.md](./01-tutorial.md) — Getting started in 10 minutes
- [08-tutorial.md](./08-tutorial.md) — Performance tuning

---

*Lois-Kleinner and 0-1.gg 2026 — Confidential*

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

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

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