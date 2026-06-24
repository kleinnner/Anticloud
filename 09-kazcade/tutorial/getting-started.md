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
