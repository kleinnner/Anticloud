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

# Tutorial 2 — Running Your First Benchmark

Kazkade's `bench` command exercises four hardware subsystems and produces a telemetry report. This tutorial runs a quick benchmark with matrix size 256.

## Step 1 — Run the Benchmark

```bash
kazkade bench --size 256
```

The `--size` flag controls the GEMM matrix dimension (256×256×256). The benchmark runs four workloads.

## Step 2 — Understanding the Output

Expected output (approximately):

```
GEMM 256x256x256...
  4.2 ms (8.0 GFLOPS)
Vector 1M elements...
  add: 280.0 us (42.9 GB/s)
Columnar 100K rows...
  filter: 45.0 us (5000 hits)
Rasterizer 800x600 100 frames...
  142.9 ms (700 FPS)
  Frame: /tmp/Kazkade_cube.ppm
Report: /tmp/Kazkade_telemetry.html
Ledger:  chain=0, tampered=0
  .aioss: /tmp/Kazkade_12345.aioss
  .json:  /tmp/Kazkade_12345.json
```

### GEMM GFLOPS

The matrix multiply uses auto-tuned SIMD tiles. GFLOPS is computed as:

```
GFLOPS = 2 × M × N × K / elapsed_seconds / 1e9
```

### Vector GB/s

A vector `add` on 1M float32 elements. Bandwidth is:

```
GB/s = 3 × elements × 4 bytes / elapsed_seconds / 1e9
```

(3 × because two reads + one write.)

### Columnar Filter

Loads a 100K-row `.acol` file and runs a filter (`value > 50000.0`). Reports matching rows and elapsed time.

### Rasterizer FPS

Renders 100 frames of a rotating cube at 800×600. The last frame is saved as `Kazkade_cube.ppm` and can be viewed in any image viewer.

## Step 3 — Examine the Telemetry Report

```bash
open /tmp/Kazkade_telemetry.html
```

The HTML report contains tables and charts for each event. It uses embedded CSS and is fully self-contained.

## Step 4 — Inspect the Ledger

The benchmark also creates a `.aioss` ledger (see Tutorial 5). Verify it:

```bash
kazkade verify /tmp/Kazkade_12345.aioss
```

---
*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
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
