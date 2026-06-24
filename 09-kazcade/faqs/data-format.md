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

# Data Format FAQ

## What is .acol?
`.acol` is Kazkade's native **columnar storage format**. Data is stored column-by-column rather than row-by-row, enabling fast scans, vectorised predicate evaluation, and efficient compression. The format uses a **striped** layout: each column is divided into 64 KB chunks (stripes), each independently compressed and indexed. This allows querying only the stripes needed for a given filter, minimising I/O.

## Can I open .acol files in other tools?
Not directly — `.acol` is a custom format. However, Kazkade provides export commands (see below) to convert to standard formats. The format specification is open and documented in the Kazkade repository under `docs/spec/acol.md` if you wish to implement a reader in another language.

## What compression is used?
Each stripe within a column can use one of three codecs, selected automatically based on data type and distribution:
- **Zstd** (default for general data): high compression ratio, fast decompression
- **Delta + Zstd** (for integers, timestamps, monotonic sequences): delta-encodes values then compresses
- **RLE (Run-Length Encoding)** (for low-cardinality or categorical columns): very fast decompression with near-zero overhead

The codec per stripe is stored inline in the stripe header, so the file is self-describing. No external codec configuration is needed.

## How is data laid out on disk?
An `.acol` file has four sections:
1. **Magic + Header** (64 bytes): format version, schema (column names and types), row count, stripe count.
2. **Column Index**: one entry per column listing the file offset and length of every stripe in that column, plus min/max statistics for predicate pushdown.
3. **Stripes**: the actual compressed column data, laid out sequentially. Stripes from different columns are interleaved to improve locality for multi-column queries.
4. **Footer**: checksum of the header and index, plus a pointer to the start of the index (enables append-friendly writes).

This layout allows the query engine to determine which stripes to decompress before touching any compressed data.

## Can I convert .acol to CSV/Parquet?
Yes. Use the `query` command with `--format csv` and redirect output:
```
kazkade query "SELECT * FROM data.acol" --format csv > data.csv
```
For Parquet, use the `export` subcommand: `kazkade export data.acol --to parquet`. Conversion to Apache Arrow IPC (`.arrow` / `.feather`) is also supported with `--to arrow`. All conversions are streaming — files larger than available RAM are handled transparently.

## Can I convert CSV to .acol?
Yes. Use `kazkade import data.csv --to data.acol`. The importer auto-detects column types by sampling the first 10,000 rows. You can override types with `--dtype "col1:int32,col2:float32"`. Compression is applied automatically during import.

## Are .acol files appendable?
The format supports append operations via the footer pointer. Use `kazkade append existing.acol newdata.acol` to concatenate row-wise. Appends rewrite only the index and footer — existing stripe data is not moved.

---
*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

