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

# Errors & Limitations FAQ

## What does "chain=TAMPERED" mean?
This appears in the output of `kazkade ledger verify` when a hash or signature check fails in an `.aioss` ledger. Walking from block 0, the runtime found a block whose hash doesn't match the `prev_hash` recorded in the next block, or whose Ed25519 signature doesn't validate against the block header. The chain should be considered compromised; do not rely on its contents for auditing. See the [.aioss Ledger FAQ](aioss-ledger.md) for verification details.

## Why does query return no results?
If `kazkade query` returns zero rows, check:
- **Column name case**: SQL column names are case-sensitive. Use `"MyColumn"` (double quotes) to preserve case, or check the schema with `kazkade inspect file.acol`.
- **File existence**: Verify the path is correct. Kazkade does not search relative paths against `$PATH`.
- **Filter too narrow**: Try `SELECT count(*) FROM file.acol` without a WHERE clause to confirm data exists.
- **Compressed stripe filter**: The query engine uses stripe-level min/max statistics to skip irrelevant stripes. If your filter's range falls outside any stripe's min/max, zero stripes will be scanned. This is correct behaviour, not a bug.

## What SQL is NOT supported?
The query engine implements a restricted subset of SQL-92 optimised for analytic workloads. **Not supported:**
- Joins (INNER, LEFT, CROSS, etc.) — single-table queries only
- Subqueries (correlated or uncorrelated), CTEs (WITH clauses)
- Window functions (ROW_NUMBER, RANK, LAG, etc.)
- DDL (CREATE, ALTER, DROP) or DML (INSERT, UPDATE, DELETE)
- Full-text search, LIKE with complex patterns, REGEXP
- Transactions, savepoints, or cursors

If you need joins or subqueries, export to Parquet or CSV and use DuckDB, Polars, or your SQL database of choice.

## Why does matmul give wrong results?
Matrix multiplication (`kazkade bench --gemm` or the programmatic API) should produce bit-exact results matching a reference FP32/FP64 implementation. If you observe discrepancies:
- Ensure matrices are FP32 or FP64. Kazkade does not support FP16 or BF16 GEMM.
- Check for NaN or Inf inputs — Kazkade does not sanitise inputs.
- Verify you are not comparing against a result computed with FMA contractions that differ in rounding (this is expected; Kazkade uses standard FMA, not fast-math).
- On older CPUs without FMA, Kazkade falls back to multiply + add, which may produce slightly different rounding. Run `kazkade self-test` to confirm your CPU's FMA support.

## What are the memory limits?
Kazkade uses memory-mapped files, so the practical limit is your **virtual address space**:
- **x64 Windows**: 8 TB user-space (128 TB with `/LARGEADDRESSAWARE`), but physical RAM limits cache performance.
- **Linux x86-64**: 128 TB user-space.
- **ARM64**: 256 TB (Apple Silicon), 128 TB (Linux ARM).
Because data is memory-mapped, you can open files larger than physical RAM — the OS pages data in and out. However, the **working set** of a query (columns touched by the filter/projection) must fit in virtual address space. For extremely wide tables (10,000+ columns), reduce the number of columns in your SELECT clause.

## Can Kazkade run out of memory?
Yes. Although `.acol` files are memory-mapped, certain operations allocate heap memory:
- Sorting (ORDER BY without LIMIT): the result set is materialised in memory.
- GROUP BY with many distinct keys: the hash table grows proportionally to distinct group count.
- Large result sets: `SELECT *` on a file larger than RAM without a filter will trigger paging, which degrades performance but does not crash.

If you see "out of memory" errors, add a LIMIT clause, add a WHERE filter, or use `--format csv > output.csv` to stream results to disk.

## What does "unsupported column type" mean?
Kazkade supports: `int8`, `int16`, `int32`, `int64`, `uint8`, `uint16`, `uint32`, `uint64`, `float32`, `float64`, `bool`, `utf8` (string), and `binary`. If your `.acol` file contains a type from a newer format version, upgrade your binary. If importing from CSV, check for mixed-type columns (e.g. a column containing both numbers and text) — the importer will fall back to `utf8` for the entire column.

---
*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

