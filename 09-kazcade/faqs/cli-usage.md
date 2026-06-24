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

