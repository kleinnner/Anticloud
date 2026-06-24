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

# Installation FAQ

## What platforms are supported?
Kazkade supports **Windows 10+ (x64, ARM64), macOS 12+ (x64, Apple Silicon), and Linux (x64, ARM64)**. Prebuilt binaries are distributed for all three platforms. Linux builds target glibc 2.28+ (Ubuntu 20.04+, Debian 11+, RHEL 8+). ARM64 Linux covers Raspberry Pi 4/5 and common aarch64 server distros.

## How do I install on Windows?
Download the `.zip` archive from the release page, extract it, and add the `bin/` directory to your `PATH`. No installer or reboot required. You can also use `winget install Kazkade` if the package is registered in the Windows Community Repository.

## How do I install on macOS?
Download the `.tar.gz` archive or use Homebrew: `brew install kazkade/tap/kazcade`. For Apple Silicon, the binary is universal (x64 + ARM64 in one bundle). On macOS 13+, gatekeeper may ask for approval — go to **System Settings > Privacy & Security** and click **Open Anyway**.

## How do I install on Linux?
Download the `.tar.gz` archive for your architecture. Extract with `tar -xzf kazcade-*.tar.gz` and move the `kazkade` binary to `/usr/local/bin/` (or any directory on `PATH`). If you use a Debian-based distro, a `.deb` package is also provided — install with `sudo dpkg -i kazcade-*.deb`.

## What are the minimum requirements?
- **CPU**: x86-64 with at least AVX2 (Intel Haswell / AMD Excavator or newer) or ARMv8.2+ with NEON. No GPU required.
- **RAM**: 512 MB minimum; 4 GB+ recommended for large datasets.
- **Disk**: 50 MB for the binary; additional space for columnar files and ledger data.
- **OS**: Windows 10 (or Windows Server 2019), macOS 12+, Linux kernel 5.4+.

## How do I verify installation?
Run `kazkade --version`. You should see output like `kazkade 1.2.3 (x86_64-windows)` followed by the SIMD capabilities detected. You can also run `kazkade self-test` to execute a quick integrity check that exercises the CLI, columnar engine, and ledger hash chain.

## Can I run without admin rights?
**Yes.** Kazkade requires no elevated privileges for normal operation. The binary runs entirely in user space. No system services, kernel drivers, or registry entries are created. On Linux, no `sudo` is needed as long as the binary is placed in a user-writable directory (e.g. `~/.local/bin/`).

## Does Kazkade require a GPU?
No. All compute is CPU-only, using SIMD and zero-copy techniques. A GPU is never required, though some future editions may offer optional GPU offload.

---
*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

