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

# CLI Interface — `kazkade`

The `kazkade` binary exposes a unified command-line interface built on the `clap` v4 derive API. Every subcommand supports `--help` for detailed flag documentation, `--json` for machine-readable output, and `--ledger` for `.aioss` audit logging.

## Global Flags

```
kazkade [OPTIONS] <COMMAND>

Options:
  -j, --json          Output as JSON (where supported)
  -l, --ledger PATH   Append results to .aioss ledger (default: ~/.kazcade/ledger.aioss)
  -k, --key PATH      Ed25519 secret key for ledger signing (default: ~/.kazcade/key.pem)
      --quiet         Suppress non-essential output
  -v, --verbose       Increase log verbosity
```

## Subcommands

### `bench`

Run micro-benchmarks for GEMM, scan, rasterizer, and full‑pipeline throughput.

```
kazkade bench [OPTIONS]
  -p, --pipeline     Benchmark full pipeline (default)
  -g, --gemm         Benchmark GEMM only (matrix multiply)
  -s, --scan         Benchmark column scan only
  -r, --raster       Benchmark software rasterizer only
  -n, --neural       Benchmark neural inference (MLP forward)
  -i, --iterations N Number of iterations [default: 1000]
  -o, --output PATH  Write results to file (JSON)
```

### `info`

Display system information and Kazkade build metadata.

```
kazkade info
  Shows: CPU features (AVX2, AVX-512, NEON), OS, memory, Kazkade version,
         commit hash, build profile, available codecs, registered SIMD kernels.
```

### `neural`

Run neural network (MLP) forward pass on a dataset.

```
kazkade neural [OPTIONS] <MODEL> [INPUT]
  <MODEL>            Path to .kaz binary model file
  [INPUT]            Path to .acol input data (stdin if omitted)
  -b, --batch N      Batch size [default: 1]
  -l, --layers N     Override layer count from model
  --list-activations List available activation functions
  -o, --output PATH  Write output activations to .acol
```

### `query`

Execute a SQL query against one or more `.acol` files.

```
kazkade query [OPTIONS] [SQL]
  [SQL]              SQL string (or pipe SQL from stdin)
  -f, --file PATH    Read SQL from file
  -t, --table NAME   Table name for the loaded .acol files
  --explain          Show query plan instead of executing
  -o, --output PATH  Write result set to .acol
```

### `stats`

Show column statistics (row count, cardinality, null ratio, min/max, compression ratio).

```
kazkade stats [OPTIONS] <FILE>
  <FILE>             Path to .acol file
  -c, --column NAME  Specific column(s) (repeatable, show all if omitted)
  --histogram        Show value histogram for first 1000 values
```

### `ledger`

Inspect and manage the `.aioss` tamper-proof ledger.

```
kazkade ledger <SUBCOMMAND>
  verify             Verify ledger integrity
  list               List all records (short form)
  show <ID>          Show full record by index
  append <TYPE> <PAYLOAD>  Append a raw record
  export             Export ledger as JSONL
```

### `verify`

Shortcut for `ledger verify` — convenience for quick integrity checks.

```
kazkade verify [PATH]
  [PATH]             Path to .aioss ledger file (default: ~/.kazcade/ledger.aioss)
```

### `dashboard`

Launch the `egui` diagnostics dashboard window.

```
kazkade dashboard [OPTIONS]
  -w, --width N      Window width [default: 1280]
  -h, --height N     Window height [default: 720]
  --embed            Embed into installer rasterizer view
```

### `gen`

Generate a synthetic `.acol` dataset for testing.

```
kazkade gen [OPTIONS] <ROWS> <COLUMNS>
  <ROWS>             Number of rows
  <COLUMNS>          Number of columns
  -t, --type TYPE    Column type (f32, i32, i4, bool) [default: f32]
  -c, --codec NAME   Compression codec (rle, delta, bitpack, none) [default: none]
  -o, --output PATH  Output path [default: generated.acol]
```

## Typical Usage Examples

```sh
# Run full pipeline benchmark and log to ledger
kazkade bench -p -i 500 --ledger

# Query an .acol file with SQL
kazkade query "SELECT avg(price) FROM sales WHERE region = 'EMEA'" -f sales.acol

# Verify ledger integrity
kazkade verify

# Start live dashboard
kazkade dashboard

# Generate a test dataset and run neural inference
kazkade gen 10000 128 -t f32 -o data.acol
kazkade neural model.kaz data.acol -b 64
```

---
*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

