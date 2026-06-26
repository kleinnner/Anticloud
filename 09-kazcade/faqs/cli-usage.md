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

# CLI Usage FAQ

## What commands are available?
The Kazkade CLI exposes six primary subcommands:

| Command | Purpose |
|---------|---------|
| `bench` | Run performance benchmarks (GEMM, rasterizer, hash-chain) |
| `query` | Execute SQL on `.acol` columnar files |
| `inspect` | Show metadata about a columnar file or ledger |
| `dashboard` | Launch the local web dashboard |
| `self-test` | Run a full system integrity check |
| `ledger` | Create, sign, and verify `.aioss` ledger files |

Run `kazkade --help` for a full list of flags and `kazkade <subcommand> --help` for per-command options.

## How do I run a benchmark?
Use `kazkade bench` with one or more benchmark names:
```
kazkade bench --gemm --raster --hash
```
You can specify matrix dimensions: `kazkade bench --gemm --m=2048 --n=2048 --k=2048`. Output includes GFLOPS, FPS, and hash throughput. Append `--csv` for machine-readable output.

## How do I query a columnar file?
Run SQL on an `.acol` file with:
```
kazkade query "SELECT avg(price) FROM sales.acol WHERE region = 'EU'"
```
Results are printed to stdout as a table. Use `--format csv` or `--format json` for structured output. The query engine supports projection, filtering, aggregation, GROUP BY, ORDER BY, and LIMIT.

## How do I launch the dashboard?
```
kazkade dashboard --port 8080
```
This starts a local web server serving the Kazkade dashboard, available at `http://localhost:8080`. The dashboard provides a GUI for opening `.acol` files, running queries, visualising results, and inspecting ledgers. Press `Ctrl+C` to stop it. Use `--open` to auto-launch your default browser.

## What does each command flag mean?
Flags are documented in `kazkade <subcommand> --help`. Common flags across commands:

| Flag | Meaning |
|------|---------|
| `-v`, `--verbose` | Increase log verbosity (repeat for more: `-vvv`) |
| `--format` | Output format: `table` (default), `csv`, `json`, `quiet` |
| `--timeout` | Max execution time in seconds (default: no limit) |
| `--threads` | Number of worker threads (default: auto-detect) |
| `--csv` | Shortcut for `--format csv` |

Run `kazkade --version` to see the installed version and detected SIMD features.

## Can I pipe data in and out?
Yes. The `query` command accepts `.acol` data on stdin via `--stdin`, and all output commands respect stdout redirection. Combine with tools like `jq`, `csvtk`, or `grep` for complex pipelines.

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
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