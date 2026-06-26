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

# Cross-Platform FAQ

## Does Kazkade run on ARM macOS?
Yes. Kazkade fully supports Apple Silicon (M1, M2, M3, M4) via the ARM64 build. The macOS binary is a universal ("fat") binary containing both x86-64 and ARM64 slices, so the same download works on Intel and Apple Silicon Macs. On Apple Silicon, Kazkade uses NEON SIMD and is tuned for the Firestorm performance cores. Performance is comparable to an equivalent x86-64 AVX2 implementation.

## Does it work on Linux ARM (Raspberry Pi)?
Yes. An ARM64 Linux build is provided for aarch64 targets, including Raspberry Pi 4 and 5 (running 64-bit OS). NEON SIMD is fully utilised. On a Raspberry Pi 5 (Cortex-A76), GEMM benchmarks reach approximately 8–10 GFLOPS — sufficient for moderate data analysis and ledger verification. Note that Raspberry Pi 3 and earlier are not supported (ARMv8.0 is the minimum).

## What about Windows ARM?
Windows ARM64 (Snapdragon X Elite, etc.) is supported. The ARM64 Windows binary uses NEON SIMD and is functionally identical to the x64 build. The same `.zip` archive includes both x64 and ARM64 binaries, or you can download the architecture-specific package. Performance on Snapdragon X Elite is competitive with mid-range x86 laptops for columnar queries and ledger operations.

## How is the binary different per platform?
Binaries differ in three ways:
1. **SIMD dispatch**: x86 builds ship with SSE4.2 + AVX2 + AVX-512 code paths selected at runtime. ARM builds ship with NEON + optional SVE paths. Each binary only contains paths relevant to its architecture, keeping size small (~15 MB compressed).
2. **Memory-mapping semantics**: Windows uses `CreateFileMapping` with `MapViewOfFile`; Linux and macOS use `mmap` with `MAP_POPULATE`. The binary abstracts this behind a portable I/O layer, but platform-specific tuning flags differ.
3. **Executable format**: PE (Windows), Mach-O (macOS), ELF (Linux). The `.aioss` and `.acol` file formats are platform-independent and byte-order-agnostic (little-endian).

## Are .acol files cross-platform?
Yes. `.acol` files use a fixed little-endian layout and are fully portable across x64 Windows, ARM macOS, and Linux ARM. You can create a columnar file on a Raspberry Pi and query it on a Windows workstation with identical results.

## Can I cross-compile Kazkade?
Kazkade is distributed as prebuilt binaries. If you need to build from source, the recommended approach is native compilation. Cross-compilation is possible with Zig or LLVM toolchains but not officially supported. The build system uses a single Rust codebase with `#[cfg(target_arch)]` guards for platform-specific SIMD intrinsics.

## Are there any platform-specific limitations?
On macOS, the default `ulimit -n` (open file limit) is 256, which may be hit when memory-mapping many large `.acol` files simultaneously. Increase it with `ulimit -n 4096` in your shell profile. On Windows, ensure long path support is enabled (`fsutil behavior set disable8dot3 1`) if you store columnar files in deeply nested directories.

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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/YMJKOG
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
