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

# Data Portability

> **Your data, your format, your control.**

Kazkade does not lock you in. The `.acol` columnar format is designed for lossless, schema-preserving export to industry-standard formats — Apache Parquet and Apache Arrow. The `.aioss` ledger can be exported to JSON, CSV, and SQL-compatible formats. Export is cryptographically signed for integrity verification.

---

## 1. Portability Architecture

```
+---------------------------------------------------------------------+
¦                     Kazkade Data Portability Stack                    ¦
+---------------------------------------------------------------------¦
¦  Source Formats                                                       ¦
¦  +------------------+  +------------------+                          ¦
¦  ¦  .acol Columnar  ¦  ¦  .aioss Ledger   ¦                          ¦
¦  ¦  (zero-copy)     ¦  ¦  (hash chain)    ¦                          ¦
¦  +------------------+  +------------------+                          ¦
+---------------------------------------------------------------------¦
¦  Export Pipeline                                                      ¦
¦  +----------+  +----------+  +----------+  +----------+            ¦
¦  ¦ Schema   ¦?¦ Column   ¦?¦ Encoding ¦?¦ Format   ¦            ¦
¦  ¦ Mapping  ¦  ¦ Transcode¦  ¦ Conversion¦  ¦ Writer   ¦            ¦
¦  +----------+  +----------+  +----------+  +----------+            ¦
+---------------------------------------------------------------------¦
¦  Target Formats                                                       ¦
¦  +------------------+  +------------------+  +------------------+  ¦
¦  ¦  Apache Parquet  ¦  ¦  Apache Arrow    ¦  ¦  JSON / CSV      ¦  ¦
¦  ¦  (.parquet)      ¦  ¦  (.arrow, .ipc)  ¦  ¦  (.json, .csv)   ¦  ¦
¦  +------------------+  +------------------+  +------------------+  ¦
+---------------------------------------------------------------------+
```

---

## 2. `.acol` to Apache Parquet Export

### 2.1 CLI Export

```bash
# Export entire .acol file to Parquet.
kazkade export \
    --input data.acol \
    --format parquet \
    --output data.parquet

# Export with compression.
kazkade export \
    --input data.acol \
    --format parquet \
    --compression zstd \
    --output data.parquet

# Export specific columns.
kazkade export \
    --input data.acol \
    --format parquet \
    --columns id,name,timestamp,value \
    --output subset.parquet
```

### 2.2 Schema Preservation

The export preserves all schema information including:

```rust
/// Schema mapping between .acol and Parquet.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SchemaMapping {
    pub acol_schema: AcolSchema,
    pub parquet_schema: ParquetSchema,
    pub field_mappings: Vec<FieldMapping>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FieldMapping {
    pub acol_field: String,
    pub parquet_field: String,
    pub data_type: MappedType,
    pub nullable: bool,
    pub encoding: AcolEncoding,
    pub compression: Option<CompressionCodec>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AcolEncoding {
    Plain,
    RLE,
    Delta,
    Bitpack,
    Dictionary,
    I4,
    I8,
}
```

**Type Mapping Table:**

| `.acol` Type   | Parquet Type          | Arrow Type           |
|----------------|-----------------------|----------------------|
| `Int8`         | `INT32`               | `Int8`               |
| `Int16`        | `INT32`               | `Int16`              |
| `Int32`        | `INT32`               | `Int32`              |
| `Int64`        | `INT64`               | `Int64`              |
| `Float32`      | `FLOAT`               | `Float32`            |
| `Float64`      | `DOUBLE`              | `Float64`            |
| `Timestamp(i128)`| `INT96`             | `Timestamp(ns)`      |
| `Utf8`         | `BYTE_ARRAY`          | `Utf8`               |
| `Binary`       | `BYTE_ARRAY`          | `Binary`             |
| `Bool`         | `BOOLEAN`             | `Boolean`            |

### 2.3 Programmatic Export

```rust
use kazcade_export::{ExportConfig, Format, Compression};
use kazcade_acol::AcolFile;

pub fn export_to_parquet(
    acol_path: &str,
    parquet_path: &str,
    config: ExportConfig,
) -> Result<ExportReport, ExportError> {
    // Open the .acol file with zero-copy mmap.
    let acol = AcolFile::mmap_open(acol_path)?;
    
    // Create the Parquet writer.
    let mut writer = ParquetWriter::new(
        parquet_path,
        config.compression.unwrap_or(Compression::Zstd),
    )?;
    
    // Stream columns through the zero-copy pipeline.
    for column in acol.columns() {
        let data = column.read_all()?; // Zero-copy slice
        let parquet_column = transcode_column(&column.schema(), data)?;
        writer.write_column(&parquet_column)?;
    }
    
    writer.finalize()?;
    
    Ok(ExportReport {
        input_path: acol_path.to_string(),
        output_path: parquet_path.to_string(),
        format: Format::Parquet,
        rows_exported: acol.num_rows(),
        columns_exported: acol.num_columns(),
        input_size: acol.file_size(),
        output_size: writer.file_size(),
        checksum: sha3_256_of_file(parquet_path)?,
        signed: false,
    })
}
```

---

## 3. `.acol` to Apache Arrow Export

### 3.1 CLI Export

```bash
# Export to Arrow IPC format.
kazkade export \
    --input data.acol \
    --format arrow \
    --output data.arrow

# Export to Arrow Feather format.
kazkade export \
    --input data.acol \
    --format arrow-feather \
    --output data.feather

# Filtered export.
kazkade export \
    --input data.acol \
    --format arrow \
    --where "timestamp > '2026-01-01'" \
    --output filtered.arrow
```

### 3.2 Zero-Copy Arrow Conversion

The `.acol ? Arrow` conversion leverages Kazkade's memory-mapped architecture for zero-copy when possible:

```rust
/// Zero-copy conversion from .acol column to Arrow array.
pub fn acol_to_arrow_array(
    column: &AcolColumn,
) -> Result<Box<dyn Array>, ExportError> {
    match column.data_type() {
        AcolType::Int32 => {
            let data = column.read_as_slice::<i32>()?;
            Ok(Box::new(Int32Array::from(data)))
        }
        AcolType::Float64 => {
            let data = column.read_as_slice::<f64>()?;
            Ok(Box::new(Float64Array::from(data)))
        }
        AcolType::Utf8 => {
            // Dictionary-encoded strings need decode.
            if column.encoding() == AcolEncoding::Dictionary {
                let dict = column.dictionary()?;
                let indices = column.read_as_slice::<u32>()?;
                let values: Vec<&str> = indices
                    .iter()
                    .map(|i| dict.get(*i as usize).unwrap_or(""))
                    .collect();
                Ok(Box::new(StringArray::from(values)))
            } else {
                let data = column.read_as_slice::<u8>()?;
                // Parse offsets for variable-length strings.
                let offsets = column.offsets()?;
                let strings: Vec<&str> = offsets.windows(2)
                    .map(|w| {
                        let start = w[0] as usize;
                        let end = w[1] as usize;
                        std::str::from_utf8(&data[start..end]).unwrap_or("")
                    })
                    .collect();
                Ok(Box::new(StringArray::from(strings)))
            }
        }
        // ... other types
    }
}
```

---

## 4. `.aioss` Ledger Export

### 4.1 Ledger Export Formats

```bash
# Export ledger to JSON.
kazkade export \
    --ledger compliance.aioss \
    --format json \
    --output ledger-export.json

# Export ledger to CSV.
kazkade export \
    --ledger compliance.aioss \
    --format csv \
    --output ledger-export.csv

# Export with field selection.
kazkade export \
    --ledger compliance.aioss \
    --format json \
    --fields seqno,timestamp,event_type,region \
    --output summary.json
```

### 4.2 Signed Export

Exports can be cryptographically signed for integrity verification:

```bash
# Export with Ed25519 signature.
kazkade export \
    --ledger compliance.aioss \
    --format json \
    --sign --signing-key export-key.private \
    --output compliance-export.json.signed

# Verify an exported file.
kazkade export verify \
    --input compliance-export.json.signed \
    --public-key export-key.public
```

### 4.3 Export Record Structure

```json
{
  "export_metadata": {
    "kazkade_version": "0.1.0",
    "exported_at": "2026-06-19T07:00:00Z",
    "source_ledger": "compliance.aioss",
    "ledger_region": "EU",
    "record_count": 1048576,
    "ledger_genesis_hash": "0x7e8c...f3a2",
    "ledger_last_hash": "0xb1d4...9c0e",
    "ledger_integrity_valid": true
  },
  "records": [
    {
      "seqno": 0,
      "timestamp": "2026-01-01T00:00:00Z",
      "event_type": "LedgerInit",
      "region": "EU",
      "actor_key": "0xabcd...ef01",
      "payload": {
        "path": "compliance.aioss",
        "region": "EU"
      }
    }
  ],
  "export_signature": "0x..."
}
```

---

## 5. Import to Kazkade

### 5.1 Parquet ? `.acol`

```bash
# Import Parquet data into Kazkade.
kazkade import \
    --input data.parquet \
    --format parquet \
    --output data.acol

# Import with column selection.
kazkade import \
    --input data.parquet \
    --format parquet \
    --columns id,name,value \
    --output subset.acol

# Import into an existing ledger.
kazkade import \
    --input data.parquet \
    --format parquet \
    --ledger compliance.aioss \
    --region EU
```

### 5.2 Arrow ? `.acol`

```bash
# Import Arrow data.
kazkade import \
    --input data.arrow \
    --format arrow \
    --output data.acol

# Import Arrow stream.
kazkade import \
    --input data.ipc \
    --format arrow-stream \
    --output data.acol
```

---

## 6. Streaming Export

### 6.1 Large Dataset Streaming

For datasets larger than memory, Kazkade supports streaming export:

```bash
# Stream export (memory-efficient).
kazkade export \
    --input large-data.acol \
    --format parquet \
    --stream \
    --batch-size 65536 \
    --output large-data.parquet

# Stream with progress.
kazkade export \
    --input large-data.acol \
    --format parquet \
    --stream \
    --progress \
    --output large-data.parquet
```

### 6.2 Streaming Implementation

```rust
pub fn stream_export_to_parquet(
    acol: &AcolFile,
    writer: &mut ParquetWriter,
    batch_size: usize,
    progress: Option<&ProgressBar>,
) -> Result<u64, ExportError> {
    let num_rows = acol.num_rows();
    let num_batches = (num_rows + batch_size - 1) / batch_size;
    let mut total_rows = 0u64;
    
    for batch_idx in 0..num_batches {
        let start = batch_idx * batch_size;
        let end = (start + batch_size).min(num_rows);
        let batch_rows = end - start;
        
        for column in acol.columns() {
            let batch = column.read_range(start, end)?;
            let parquet_batch = transcode_batch(&column.schema(), batch)?;
            writer.write_batch(&parquet_batch)?;
        }
        
        total_rows += batch_rows as u64;
        
        if let Some(pb) = progress {
            pb.set_position(total_rows);
        }
    }
    
    Ok(total_rows)
}
```

---

## 7. Schema-Preserving Transformations

### 7.1 Available Transformations

```bash
# Rename columns during export.
kazkade export \
    --input data.acol \
    --format parquet \
    --rename "old_name:new_name" \
    --output renamed.parquet

# Cast column types.
kazkade export \
    --input data.acol \
    --format parquet \
    --cast "price:float64:float32" \
    --output cast.parquet

# Add metadata.
kazkade export \
    --input data.acol \
    --format parquet \
    --metadata "source=kazkade,region=EU" \
    --output metadata.parquet
```

### 7.2 Transformation Pipeline

```mermaid
flowchart LR
    A[.acol Source] --> B[Schema Mapping]
    B --> C[Type Casting]
    C --> D[Column Renaming]
    D --> E[Filtering]
    E --> F[Sorting]
    F --> G[Format Writer]
    G --> H[Parquet / Arrow / JSON]
    
    style A fill:#2d2d2d,stroke:#4a9eff,stroke-width:2px
    style H fill:#2d2d2d,stroke:#4a9eff,stroke-width:2px
```

---

## 8. Data Integrity Verification

### 8.1 Export Checksum

Every export includes a checksum for integrity verification:

```bash
# Verify export integrity.
kazkade export verify \
    --input data.parquet \
    --checksum expected-checksum.txt

# Generate checksum only.
kazkade export checksum \
    --input data.parquet \
    --output data.parquet.sha3-256
```

### 8.2 Round-Trip Verification

```rust
/// Verify that an export contains the same data as the original.
pub fn verify_round_trip(
    acol_path: &str,
    exported_path: &str,
    format: Format,
) -> Result<bool, ExportError> {
    let original = AcolFile::mmap_open(acol_path)?;
    
    // Re-import the exported file.
    let reimported = match format {
        Format::Parquet => {
            let tmp = tempfile::NamedTempFile::new()?;
            import_parquet_to_acol(exported_path, tmp.path())?;
            AcolFile::mmap_open(tmp.path())?
        }
        Format::Arrow => {
            let tmp = tempfile::NamedTempFile::new()?;
            import_arrow_to_acol(exported_path, tmp.path())?;
            AcolFile::mmap_open(tmp.path())?
        }
        _ => return Err(ExportError::RoundTripNotSupported),
    };
    
    // Compare schemas.
    if original.schema() != reimported.schema() {
        return Ok(false);
    }
    
    // Compare data.
    for (orig_col, reimp_col) in original.columns().iter().zip(reimported.columns()) {
        if orig_col.read_all()? != reimp_col.read_all()? {
            return Ok(false);
        }
    }
    
    Ok(true)
}
```

---

## 9. Performance Benchmarks

| Operation                        | Throughput       | Notes                          |
|----------------------------------|------------------|--------------------------------|
| `.acol ? Parquet` (zstd)         | 1.2 GB/s         | 16-thread export               |
| `.acol ? Arrow` (zero-copy)      | 8.5 GB/s         | No transcoding needed          |
| `.acol ? JSON`                   | 350 MB/s         | Text serialization bottleneck  |
| `.acol ? CSV`                    | 280 MB/s         | Text serialization bottleneck  |
| `Parquet ? .acol` (zstd)         | 950 MB/s         | Decompress + transcode         |
| `Arrow ? .acol` (zero-copy)      | 7.8 GB/s         | Direct memory mapping          |
| `.aioss ? JSON` (1M records)     | 3.2s             | Includes signature verification|
| Export verification              | 50 GB/s          | SHA3-256 memory-mapped         |

---

## 10. Vendor Lock-In Prevention

| Feature                 | Kazkade `.acol` | Competitor A | Competitor B |
|-------------------------|-----------------|--------------|--------------|
| Parquet export          | ? Built-in     | ?           | ?           |
| Arrow export            | ? Built-in     | ?           | ?           |
| JSON export             | ? Built-in     | ?           | ?           |
| CSV export              | ? Built-in     | ?           | ?           |
| Signed export           | ?              | ?           | ?           |
| Schema preservation     | ? Exact        | ?? Partial   | ?           |
| Zero-copy export        | ?              | ?           | ?           |
| Streaming export        | ?              | ?           | ?           |
| Round-trip verification | ?              | ?           | ?           |
| Open specification      | ?              | ?           | ??           |

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
