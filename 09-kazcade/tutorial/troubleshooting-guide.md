<!--
  ▄▄   ▄▄▄                      ▄▄                        ▄▄                     
  ██  ██▀                       ██                        ██                     
  ▄▄▄█  ██▄██      ▄█████▄  ████████  ██ ▄██▀    ▄█████▄   ▄███▄██   ▄████▄   █▄▄▄     
  ▄▄█▀▀▀    █████      ▀ ▄▄▄██      ▄█▀   ██▄██      ▀ ▄▄▄██  ██▀  ▀██  ██▄▄▄▄██    ▀▀▀█▄▄ 
  ▀▀█▄▄▄    ██  ██▄   ▄██▀▀▀██    ▄█▀     ██▀██▄    ▄██▀▀▀██  ██    ██  ██▀▀▀▀▀▀    ▄▄▄█▀▀ 
      ▀▀▀█  ██   ██▄  ██▄▄▄███  ▄██▄▄▄▄▄  ██  ▀█▄   ██▄▄▄███  ▀██▄▄███  ▀██▄▄▄▄█  █▀▀▀     
           ▀▀    ▀▀   ▀▀▀▀ ▀▀  ▀▀▀▀▀▀▀▀  ▀▀   ▀▀▀   ▀▀▀▀ ▀▀    ▀▀▀ ▀▀    ▀▀▀▀▀
  Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime
-->

# Tutorial 10 — Troubleshooting Guide

Common issues when using Kazkade, with solutions.

## Issue 1 — Binary Won't Start

**Symptom**: `kazkade` exits immediately or shows "Illegal instruction".

**Cause**: Kazkade requires at least SSE4.2 on x86-64 or NEON on AArch64. Older CPUs or emulated environments (QEMU without `-cpu host`) may lack these features.

**Solution**:

```bash
# Check CPU capabilities
kazkade info | findstr ISA
```

If ISA shows `scalar`, your CPU lacks SIMD support. Kazkade falls back to scalar loops but performance will be poor. On QEMU, add `-cpu host`.

On x86-64, AVX2 is strongly recommended. Without it, GEMM and columnar filter performance drops 5–20×.

## Issue 2 — High Memory Usage

**Symptom**: Kazkade uses more RAM than expected, especially with large `.acol` files.

**Cause**: `.acol` files are memory-mapped (`mmap` / `MapViewOfFile`). The OS may cache the entire file in RAM.

**Solution**:

- Memory-mapped files appear in "Cached" memory, not "Used". Check with `free -m` (Linux) or Task Manager (Windows).
- For very large files (10 GB+), the columnar engine lazily decompresses chunks. Memory usage scales with chunk count, not file size.
- Reduce the number of simultaneous `.acol` files open in the dashboard.

## Issue 3 — .aioss Verify Shows "TAMPERED"

**Symptom**:

```
Chain: TAMPERED (1 tampered)
```

**Cause**: The ledger file was modified after creation, or the file is truncated.

**Solution**:

1. Identify the offending entry by re-running with verbose output (not available directly; check the JSON file for hash mismatches).
2. If the ledger was manually edited, restore from backup or regenerate.
3. If the file is truncated, re-run `kazkade ledger` to create a fresh ledger.
4. Only the `.aioss` binary format and `.json` representation are interchangeable. Do not mix formats for the same session.

## Issue 4 — Dashboard Won't Launch

**Symptom**: `kazkade dashboard` exits with an error or the window doesn't appear.

**Causes and solutions**:

| Error | Likely Cause | Fix |
|-------|-------------|-----|
| `No available GPU or renderer` | Missing OpenGL/Vulkan drivers | Install GPU drivers. The software rasterizer doesn't need GPU, but `egui`/`winit` requires a window system. |
| `Connection refused` on remote port | Port 8765 already in use | Use `--port` to specify a different port. |
| Blank window on headless server | No display available | Use `--remote` to access via browser, or set `DISPLAY` on Linux. |
| `eframe` error on Windows | Missing DirectX or OpenGL DLLs | Install [Microsoft Visual C++ Redistributable](https://aka.ms/vs/17/release/vc_redist.x64.exe). |

## Issue 5 — Build Errors

**Symptom**: `cargo build` fails with compilation errors.

**Common fixes**:

```
# Outdated Rust toolchain
rustup update stable

# Missing linker (Windows)
# Install Visual Studio Build Tools or LLVM/clang

# Missing dependencies (Linux)
sudo apt install build-essential libglib2.0-dev libgtk-3-dev \
  libx11-dev libxrandr-dev libxcursor-dev libxi-dev

# macOS: missing xcode tools
xcode-select --install
```

## Issue 6 — `kazkade gen` Creates Empty File

**Symptom**: Generated `.acol` file is 0 bytes.

**Cause**: Disk full or permission error.

**Solution**: Check available space and write permissions. The file is written atomically; a partial write will be incomplete.

## Issue 7 — Slow Query Performance

**Symptom**: `kazkade query` takes > 1 second on a 1M-row file.

**Cause**: The columnar engine uses sequential scan (no indexes). Performance depends on SIMD throughput.

**Check**: Run `kazkade bench --size 256` and verify your GFLOPS are reasonable for your CPU.

## Getting Help

- GitHub Issues: https://github.com/Lois-Kleinner/kazkade/issues
- Documentation: https://kazkade.dev/docs

---
*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

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

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com