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

# Adding a Column Type

Adding a new column `DataType` in Kazkade requires touching every layer of the columnar subsystem: schema representation, in-memory chunk structure, on-disk serialization, compression support, and scan predicates. This guide walks through adding `DataType::U64` as an example (already present, but illustrative of the pattern).

## Step 1: Add the Variant in `schema.rs`

Open `src/columnar/schema.rs`. The `DataType` enum is the single source of truth:

```rust
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum DataType {
    Bool,
    U8, U16, U32, U64,   // ← add your variant here
    I8, I16, I32, I64,
    F16, F32, F64,
    String,
    Binary,
}
```

Then implement `byte_size()`, `is_fixed_width()`, and `name()`:

```rust
impl DataType {
    pub fn byte_size(&self) -> usize {
        match self {
            DataType::U64 => 8,
            // ... existing arms ...
        }
    }

    pub fn name(&self) -> &'static str {
        match self {
            DataType::U64 => "u64",
            // ...
        }
    }
}
```

## Step 2: Add Accessor Methods in `chunk.rs`

`ColumnChunk` in `src/columnar/chunk.rs` has typed getters. Add one for your new type:

```rust
impl ColumnChunk {
    pub fn get_u64(&self, row: usize) -> Option<u64> {
        if self.is_null(row) { return None; }
        assert_eq!(self.dtype, DataType::U64);
        unsafe {
            Some(*(self.data.add(row * 8) as *const u64))
        }
    }

    pub fn get_f64(&self, row: usize) -> Option<f64> { /* existing */ }
    pub fn get_f32(&self, row: usize) -> Option<f32> { /* existing */ }
    pub fn get_i32(&self, row: usize) -> Option<i32> { /* existing */ }
    pub fn get_i64(&self, row: usize) -> Option<i64> { /* existing */ }
}
```

Also update `as_slice::<T: Pod>()` — it works generically via `bytemuck` for any fixed-width type.

## Step 3: Handle Read/Write in `layout.rs`

### Writing

In `write_full_header()` and `parse_header()`, the type is serialized as a `u8` discriminant. Add your variant's discriminant:

```rust
// In write_full_header:
buf[pos] = match col.dtype {
    DataType::U64 => 4,
    // ...
};
pos += 1;

// In parse_header:
let dtype = match dtype_val {
    4 => DataType::U64,
    // ...
};
```

### Builder convenience

In `ColumnarFileBuilder`, if you want a convenience method:

```rust
impl ColumnarFileBuilder {
    pub fn add_u64_column(&mut self, idx: usize, values: &[u64]) {
        let bytes = bytemuck::cast_slice(values);
        self.columns[idx].extend_from_slice(bytes);
        self.row_count = self.row_count.max(values.len());
    }
}
```

## Step 4: Add Compression Support in `compress/mod.rs`

The compression codec implementations (RLE, Delta, Bitpack, Dictionary) must handle the new type. The delta codec is the most type-sensitive:

```rust
fn decompress_delta(&self) -> DecompressedChunk {
    // ...
    let mut current_i64 = match self.original_dtype {
        DataType::U64 => u64::from_le_bytes(base.try_into().unwrap()) as i64,
        // ...
    };
    for _ in 1..self.original_count {
        let delta = match self.original_dtype {
            DataType::U64 => {
                if pos + 8 > self.data.len() { break; }
                let d = u64::from_le_bytes(self.data[pos..pos + 8].try_into().unwrap());
                pos += 8;
                d as i64
            }
            // ...
        };
        current_i64 += delta;
        match self.original_dtype {
            DataType::U64 => out.extend_from_slice(&(current_i64 as u64).to_le_bytes()),
            // ...
        }
    }
}
```

RLE and dictionary handle types generically by byte comparison, so they work automatically. Bitpack currently stores raw bytes as a pass-through.

## Step 5: Update Scan Predicates in `scan.rs`

The `filter_column()` dispatch in `scan.rs` must add a branch for the new type:

```rust
pub fn filter_column(chunk: &ColumnChunk, pred: &Predicate) -> Vec<u64> {
    match chunk.dtype {
        DataType::F32 => unsafe { filter_f32(chunk, pred, &mut bitmask); },
        DataType::I32 => unsafe { filter_i32(chunk, pred, &mut bitmask); },
        DataType::I64 => unsafe { filter_i64(chunk, pred, &mut bitmask); },
        DataType::U64 => unsafe { filter_u64(chunk, pred, &mut bitmask); },  // ← new
        DataType::F64 => unsafe { filter_f64(chunk, pred, &mut bitmask); },
        _ => filter_scalar(chunk, pred, &mut bitmask),
    }
}
```

Write `filter_u64()` following the pattern from `filter_i64` (scalar, since AVX2 lacks 64-bit integer SIMD compare).

Add aggregate functions if needed:

```rust
pub fn sum_u64(chunk: &ColumnChunk) -> u128 { /* ... */ }
pub fn min_u64(chunk: &ColumnChunk) -> u64 { /* ... */ }
pub fn max_u64(chunk: &ColumnChunk) -> u64 { /* ... */ }
```

## Step 6: Add Tests

Write round-trip tests in `chunk.rs` or at the module level:

```rust
#[test]
fn test_u64_chunk_read_write() {
    let data: Vec<u64> = vec![1, 2, 3, u64::MAX, 0];
    let chunk = unsafe { ColumnChunk::new(
        data.as_ptr() as *const u8, data.len() * 8, data.len(), DataType::U64,
    )};
    for i in 0..data.len() {
        assert_eq!(chunk.get_u64(i).unwrap(), data[i]);
    }
}
```

## Summary Checklist

| File | Change |
|------|--------|
| `src/columnar/schema.rs` | Add `DataType` variant, `byte_size()`, `name()` |
| `src/columnar/chunk.rs` | Add `get_*()` accessor, verify `as_slice` works |
| `src/columnar/layout.rs` | Add discriminant in `write_full_header` and `parse_header` |
| `src/columnar/layout.rs` | Optional: add `add_*_column()` builder convenience |
| `src/compress/mod.rs` | Add cases in `compress_delta`/`decompress_delta` |
| `src/columnar/scan.rs` | Add dispatch in `filter_column`, add filter/aggregate funcs |
| `tests/` or `#[cfg(test)]` | Add round-trip tests |

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

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/SZJMZA
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
