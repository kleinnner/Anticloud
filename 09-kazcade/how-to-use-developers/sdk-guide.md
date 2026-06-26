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

# SDK Guide

This guide covers using the Kazkade SDK in Rust, Python, and C.

## SDK Overview

```
+----------------------------------------------------------+
¦                     Your Application                      ¦
¦  +------------+  +------------+  +------------------+  ¦
¦  ¦ Rust crate ¦  ¦ Python pkg ¦  ¦ C bindings       ¦  ¦
¦  ¦ kazkade    ¦  ¦ kazkade    ¦  ¦ libkazcade.h     ¦  ¦
¦  +------------+  +------------+  +------------------+  ¦
¦         ¦               ¦                  ¦            ¦
+---------+---------------+------------------+------------+
          ¦               ¦                  ¦
          ?               ?                  ?
+----------------------------------------------------------+
¦                Kazkade Runtime (Core)                     ¦
¦  .acol · SQL Engine · SIMD · Ledger · Compression        ¦
+----------------------------------------------------------+
```

## Rust SDK

### Installation

```toml
[dependencies]
kazkade = "0.6.0"
```

Features:

```toml
[dependencies]
kazkade = { version = "0.6.0", features = ["simd-avx2", "python-bridge"] }
```

Available features:

| Feature | Description |
|---------|-------------|
| `simd-sse42` | SSE4.2 SIMD backend |
| `simd-avx2` | AVX2 SIMD backend |
| `simd-avx512` | AVX-512 SIMD backend |
| `simd-neon` | NEON SIMD backend (aarch64) |
| `simd-sve` | SVE SIMD backend (aarch64) |
| `python-bridge` | PyO3 integration |
| `dashboard` | Web dashboard embedding |
| `ledger` | `.aioss` ledger support |
| `all-codecs` | All compression codecs |

### Basic Usage

```rust
use kazcade::prelude::*;

fn main() -> Result<()> {
    // Initialize runtime
    let rt = Runtime::new("/path/to/data")?;

    // Query data
    let result = rt.query("SELECT * FROM sales WHERE amount > 100 LIMIT 10")?;

    // Access columns
    for row in result.rows() {
        let amount: f64 = row.get("amount")?;
        let category: &str = row.get("category")?;
        println!("{category}: ${amount:.2}");
    }

    // Inspect file
    let meta = rt.inspect("sales.acol")?;
    println!("Columns: {}, Rows: {}", meta.num_columns(), meta.num_rows());

    // Run benchmark
    let bench = rt.bench("scan")?;
    println!("Throughput: {:.2} GB/s", bench.throughput_gbps());

    Ok(())
}
```

### Columnar Operations

```rust
use kazcade::columnar::*;

// Load a column
let col: Column<f64> = store.load_column("sales.acol", "amount")?;

// SIMD operations
let filtered: Column<f64> = col.filter(|v| *v > 100.0)?;
let doubled: Column<f64> = col.map(|v| v * 2.0)?;
let sum: f64 = col.sum()?;
let mean: f64 = col.mean()?;

// Zero-copy slice
let slice: &[f64] = col.as_slice();
println!("First 10 values: {:?}", &slice[..10]);
```

### Ledger Integration

```rust
use kazcade::ledger::*;

// Create ledger entry
let mut ledger = Ledger::open("~/.kazcade/ledger")?;
let entry = ledger.create_entry(EntryType::BenchmarkResult, &data)?;
let signature = entry.sign(&keypair)?;
println!("Entry #{} signed", entry.index());

// Verify
let status = ledger.verify_entry(entry.index())?;
assert!(status.is_valid());
```

### Streaming

```rust
use kazcade::stream::*;
use tokio_stream::StreamExt;

#[tokio::main]
async fn main() -> Result<()> {
    let mut stream = rt.query_stream("SELECT * FROM large_dataset")?;

    while let Some(row) = stream.next().await {
        let row = row?;
        process_row(row);
    }
    Ok(())
}
```

## Python SDK

### Installation

```bash
pip install kazkade
```

Verify:

```bash
python -c "import kazkade; print(kazkade.__version__)"
```

### Quick Start

```python
import kazkade

# Initialize runtime
rt = kazkade.Runtime("/path/to/data")

# Query
result = rt.query("SELECT category, COUNT(*) as cnt FROM sales GROUP BY category")

# Access as pandas DataFrame
df = result.to_pandas()
print(df.head())

# Iterate
for row in result:
    print(row["category"], row["cnt"])

# NumPy arrays
amounts = result.column("amount")  # returns numpy array
print(f"Mean amount: {amounts.mean():.2f}")
```

### Column Operations

```python
import kazkade
import numpy as np

rt = kazkade.Runtime("/path/to/data")

# Load column directly
col = rt.load_column("sales.acol", "amount")
print(f"Type: {col.dtype}, Length: {len(col)}")

# Vectorized operations
filtered = col[col > 100]
doubled = col * 2.0
mask = col.between(10, 100)

# Statistics
print(f"Sum: {col.sum():.2f}")
print(f"Mean: {col.mean():.2f}")
print(f"Std: {col.std():.2f}")
print(f"Min: {col.min():.2f}, Max: {col.max():.2f}")
```

### Working with Parquet

```python
# Read Parquet into .acol
rt.ingest("input.parquet", "output.acol")

# Export .acol to Parquet
rt.export("data.acol", "data.parquet")
```

### Async API

```python
import asyncio
import kazkade

async def main():
    rt = kazkade.AsyncRuntime("/path/to/data")
    
    async for row in rt.query_stream("SELECT * FROM large_table"):
        process_row(row)
    
    await rt.close()

asyncio.run(main())
```

### Context Manager

```python
with kazkade.Runtime("/path/to/data") as rt:
    result = rt.query("SELECT * FROM data LIMIT 100")
    print(result.to_pandas())
```

## C SDK

### Installation

```bash
# Download C headers and library
curl -LO https://releases.kazcade.io/v0.6.0/kazcade-dev-windows-x64.zip
# or on Linux:
curl -LO https://releases.kazcade.io/v0.6.0/kazcade-dev-linux-x86_64.tar.gz
```

### Compilation

```bash
gcc -o myapp myapp.c -lkazcade -lm
```

### Example

```c
#include <kazcade.h>
#include <stdio.h>

int main() {
    // Initialize
    kazcade_handle_t* rt = kazcade_init("/path/to/data", NULL);
    if (!rt) {
        fprintf(stderr, "Failed to initialize Kazkade\n");
        return 1;
    }

    // Query
    kazcade_result_t* res = kazcade_query(rt, "SELECT * FROM sales LIMIT 5");
    if (!res) {
        fprintf(stderr, "Query failed\n");
        kazcade_free(rt);
        return 1;
    }

    // Print results
    int64_t rows = kazcade_result_num_rows(res);
    int cols = kazcade_result_num_columns(res);
    
    printf("Rows: %lld, Cols: %d\n", (long long)rows, cols);
    
    for (int c = 0; c < cols; c++) {
        printf("%s\t", kazcade_result_column_name(res, c));
    }
    printf("\n");

    for (int64_t r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            const char* type = kazcade_result_column_type(res, c);
            if (strcmp(type, "i64") == 0) {
                const int64_t* col = kazcade_result_column_i64(res, c);
                printf("%lld\t", (long long)col[r]);
            } else if (strcmp(type, "f64") == 0) {
                const double* col = kazcade_result_column_f64(res, c);
                printf("%.2f\t", col[r]);
            } else {
                printf("%s\t", kazcade_result_column_utf8(res, c)[r]);
            }
        }
        printf("\n");
    }

    kazcade_result_free(res);
    kazcade_free(rt);
    return 0;
}
```

### Memory Management

```c
// All results must be freed
kazcade_result_free(result);

// String arrays are valid until result is freed
const char** names = kazcade_result_column_names(result);
// use names...
// names becomes invalid after kazcade_result_free
```

## Build Configuration

### Rust

```bash
cargo add kazkade
cargo add kazkade --features "simd-avx512 ledger"
```

### Python

```bash
pip install kazkade
pip install kazkade[full]  # All features
```

### C

```bash
pkg-config --cflags --libs kazkade
# Output: -I/usr/include/kazcade -lkazcade
```

## Versioning

The SDK follows semver:

| Version | Status |
|---------|--------|
| 0.x.y | Development (breaking changes possible) |
| 1.y.z | Stable API |

Check compatibility:

```python
import kazkade
print(kazkade.__version__)
# Runtime version must match SDK major version
```

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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com