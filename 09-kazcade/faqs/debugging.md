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

# Debugging FAQ

## How do I get more verbose output?
Use the `--verbose` flag (short: `-v`). Repeat it to increase verbosity:
- `-v`: info-level messages
- `-vv`: debug-level messages including SQL query plans and memory-mapping details
- `-vvv`: trace-level messages with per-row SIMD dispatch logs (very noisy; use sparingly)

For the dashboard, set the environment variable `KAZ_LOG=debug` before starting the process.

## What if the dashboard won't start?
Most dashboard failures are caused by port conflicts. Try a different port: `kazkade dashboard --port 9090`. If it still fails, check that `localhost` resolves in your hosts file (should map to `127.0.0.1`). On Linux, verify that the `ip6tables` rules aren't blocking loopback IPv6. Run `kazkade dashboard --verbose` — if you see `bind: permission denied`, you likely need a port above 1024 (or admin rights for lower ports).

## How do I report a crash?
If Kazkade crashes:
1. Reproduce with `-vvv` and capture the terminal output.
2. Check the crash log at the location printed in the final error message (typically `~/.kazcade/crash.log` or `%USERPROFILE%\.kazcade\crash.log` on Windows).
3. Open an issue at the Kazkade GitHub repository including:
   - The full terminal output (redact sensitive data)
   - The crash log file
   - Your OS and CPU model (`kazkade --version` output)
   - Steps to reproduce

## Where are log files?
By default, Kazkade logs to stderr. To write logs to a file, redirect stderr: `kazkade query "..." 2> kaz.log`. The dashboard writes access logs to `~/.kazcade/dashboard/access.log`. Crash dumps are saved to `~/.kazcade/crash/` with a timestamp prefix.

## How do I test if my CPU supports AVX2/NEON?
Run `kazkade self-test`. The first line of output shows the detected SIMD capabilities:
```
[INFO] SIMD: AVX2+FMA (x86_64)   # or NEON (aarch64), or SSE4.2 (fallback)
```
You can also run `kazkade bench --gemm` — if it proceeds without a "SIMD feature not available" warning, your CPU is supported. On Linux, check `/proc/cpuinfo` for `avx2` (look for `flags`) or `neon` (look for `Features`).

## Why is the query slow on my machine?
Slow queries usually indicate one of: (a) the `.acol` file is not memory-mapped efficiently — ensure the file resides on a local SSD, not a network share; (b) the query lacks a filter and scans the full column — add a WHERE clause; (c) your CPU lacks AVX2, causing the scalar fallback path to be used. Run with `-vv` and look for "scan path: scalar" vs "scan path: simd".

## What should I include in a bug report?
Always include the output of `kazkade --version`, your OS/CPU details, the exact command that triggered the issue, and any error messages. If the bug involves a specific `.acol` or `.aioss` file, include a minimal reproduction file if possible. For crashes, attach the crash log from `~/.kazcade/crash/`.

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
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
