<!--
  __   ___                      __                        __                     
  ¦¦  ¦¦¯                       ¦¦                        ¦¦                     
  ___¦  ¦¦_¦¦      _¦¦¦¦¦_  ¦¦¦¦¦¦¦¦  ¦¦ _¦¦¯    _¦¦¦¦¦_   _¦¦¦_¦¦   _¦¦¦¦_   ¦___     
  __¦¯¯¯    ¦¦¦¦¦      ¯ ___¦¦      _¦¯   ¦¦_¦¦      ¯ ___¦¦  ¦¦¯  ¯¦¦  ¦¦____¦¦    ¯¯¯¦__ 
  ¯¯¦___    ¦¦  ¦¦_   _¦¦¯¯¯¦¦    _¦¯     ¦¦¯¦¦_    _¦¦¯¯¯¦¦  ¦¦    ¦¦  ¦¦¯¯¯¯¯¯    ___¦¯¯ 
      ¯¯¯¦  ¦¦   ¦¦_  ¦¦___¦¦¦  _¦¦_____  ¦¦  ¯¦_   ¦¦___¦¦¦  ¯¦¦__¦¦¦  ¯¦¦____¦  ¦¯¯¯     
           ¯¯    ¯¯   ¯¯¯¯ ¯¯  ¯¯¯¯¯¯¯¯  ¯¯   ¯¯¯   ¯¯¯¯ ¯¯    ¯¯¯ ¯¯    ¯¯¯¯¯
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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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
