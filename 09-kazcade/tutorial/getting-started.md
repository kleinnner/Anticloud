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

# Tutorial 1 — Getting Started with Kazkade

This tutorial walks you through downloading/extracting Kazkade and verifying that the binary works on your system.

## Step 1 — Download the Binary

Visit the [Kazkade releases page](https://github.com/Lois-Kleinner/kazkade/releases) and download the archive for your platform:

| Platform   | Archive                     |
|------------|-----------------------------|
| Windows x64| `kazkade-x86_64-windows.zip`|
| Linux x64  | `kazkade-x86_64-linux.tar.gz`|
| macOS ARM  | `kazkade-aarch64-macos.tar.gz`|

Extract it:

```bash
# Linux / macOS
tar xzf kazkade-x86_64-linux.tar.gz
cd kazkade

# Windows (PowerShell)
Expand-Archive -Path kazkade-x86_64-windows.zip -DestinationPath .
cd kazkade
```

## Step 2 — Run `kazkade info`

The `kazkade info` command prints CPU and system information detected at runtime:

```bash
./kazkade info
```

Expected output (will vary by hardware):

```
ISA:     AVX2
Cores:   8
L1:      32K
L2:      1280K
L3:      12M
NUMA:    1
  Node 0: 8 cores
Page:    4K
Huge:    2M
AVX2:    yes
AVX512:  no
GEMM tile: MR=16 NR=64 KR=256
```

## Step 3 — Understanding the Output

| Field       | Meaning |
|-------------|---------|
| **ISA**     | Highest instruction set detected: `AVX2`, `AVX-512`, `NEON`, or `scalar`. |
| **Cores**   | Number of logical CPU cores available to the process. |
| **L1/L2/L3**| Size of each cache level (per-core for L1/L2, shared for L3). |
| **NUMA**    | Number of NUMA nodes. UMA systems show 1 node. |
| **AVX2/AVX512**| Whether the CPU supports the AVX2 and AVX-512F instruction sets. |
| **GEMM tile**| Auto-tuned matrix multiplication tile dimensions (MR×NR×KR). |

## Step 4 — Verify the Binary Works

Run the built-in help:

```bash
./kazkade --help
```

You should see the available subcommands: `bench`, `gen`, `query`, `dashboard`, `info`, `stats`, `neural`, `ledger`, `verify`.

## Troubleshooting

- **"Failed to detect CPU features"** — Ensure your CPU supports at least SSE4.2 (x86) or NEON (ARM).
- **"Binary not found"** — Make sure the extracted `kazkade` (or `kazkade.exe`) is in your current directory or `$PATH`.
- **Permission denied (Linux/macOS)** — Run `chmod +x kazkade`.

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
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ