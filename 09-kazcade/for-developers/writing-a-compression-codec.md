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

# Writing a Compression Codec

Kazkade's compression layer in `src/compress/mod.rs` supports five methods: `None`, `Rle`, `Delta`, `Bitpack`, and `Dictionary`. This guide shows how to add a new codec — using a simple "Zero-Run Length Encoding" (ZRLE) as an example.

## Architecture

The core types are:

```rust
pub enum CompressionType {
    None, Rle, Delta, Bitpack, Dictionary,  // ← add your variant
}

pub struct CompressedChunk {
    pub compression: CompressionType,
    pub original_count: usize,
    pub original_dtype: DataType,
    pub data: Vec<u8>,
}

pub fn compress_column(chunk: &ColumnChunk, method: CompressionType) -> CompressedChunk { ... }
```

`compress_column()` dispatches to method-specific functions. `CompressedChunk::decompress()` dispatches via `match self.compression`.

## Step 1: Add the Variant

In `src/compress/mod.rs`, add your variant to `CompressionType`:

```rust
pub enum CompressionType {
    None, Rle, Delta, Bitpack, Dictionary,
    Zrle,  // Zero-run length encoding
}
```

## Step 2: Define Compressed/Decompressed Types

(Already provided by `CompressedChunk` and `DecompressedChunk` — you only need the methods.)

## Step 3: Implement `compress_zrle()`

Write the compression function. ZRLE skips zero values and stores only non-zero positions and values:

```rust
fn compress_zrle(chunk: &ColumnChunk) -> CompressedChunk {
    let elem_size = chunk.dtype.byte_size();
    assert!(chunk.dtype.is_fixed_width(), "ZRLE requires fixed-width");
    let data = unsafe { std::slice::from_raw_parts(chunk.data, chunk.len) };
    let mut out = Vec::new();

    // Format: [count: u32][run: (pos: u32, value: bytes)]...
    out.extend_from_slice(&(chunk.count as u32).to_le_bytes());

    let mut i = 0;
    while i < chunk.count {
        let val = &data[i * elem_size..(i + 1) * elem_size];
        if val.iter().all(|&b| b == 0) {
            // Count consecutive zeros
            let mut zero_run = 1u32;
            while i + zero_run as usize < chunk.count {
                let next = &data[(i + zero_run as usize) * elem_size..][..elem_size];
                if next.iter().all(|&b| b == 0) {
                    zero_run += 1;
                } else { break; }
            }
            out.extend_from_slice(&zero_run.to_le_bytes());
            i += zero_run as usize;
        } else {
            // Non-zero: store 0-run-length = 0 followed by the value
            out.extend_from_slice(&0u32.to_le_bytes());
            out.extend_from_slice(val);
            i += 1;
        }
    }

    CompressedChunk {
        compression: CompressionType::Zrle,
        original_count: chunk.count,
        original_dtype: chunk.dtype,
        data: out,
    }
}
```

## Step 4: Implement `decompress_zrle()`

Add a method on `CompressedChunk`:

```rust
fn decompress_zrle(&self) -> DecompressedChunk {
    let elem_size = self.original_dtype.byte_size();
    let pos = &self.data;
    let mut out = Vec::with_capacity(self.original_count * elem_size);
    let mut i = 4; // skip count

    while i < self.data.len() && out.len() < self.original_count * elem_size {
        let run_or_val = u32::from_le_bytes(
            self.data[i..i + 4].try_into().unwrap()
        );
        i += 4;

        if run_or_val == 0 {
            // Non-zero value follows
            out.extend_from_slice(&self.data[i..i + elem_size]);
            i += elem_size;
        } else {
            // Zero run
            let zero_bytes = vec![0u8; run_or_val as usize * elem_size];
            out.extend_from_slice(&zero_bytes);
        }
    }

    let chunk = unsafe {
        ColumnChunk::new(out.as_ptr(), out.len(),
            self.original_count, self.original_dtype)
    };
    DecompressedChunk { data: out, chunk }
}
```

## Step 5: Register in the Dispatch Tables

In `compress_column()`:

```rust
pub fn compress_column(chunk: &ColumnChunk, method: CompressionType) -> CompressedChunk {
    match method {
        CompressionType::None => { /* ... */ },
        CompressionType::Rle => compress_rle(chunk),
        CompressionType::Delta => compress_delta(chunk),
        CompressionType::Bitpack => compress_bitpack(chunk),
        CompressionType::Dictionary => compress_dictionary(chunk),
        CompressionType::Zrle => compress_zrle(chunk),  // ← new
    }
}
```

In `CompressedChunk::decompress()`:

```rust
pub fn decompress(&self) -> DecompressedChunk {
    match self.compression {
        CompressionType::None => { /* ... */ },
        CompressionType::Rle => self.decompress_rle(),
        CompressionType::Delta => self.decompress_delta(),
        CompressionType::Bitpack => self.decompress_bitpack(),
        CompressionType::Dictionary => self.decompress_dictionary(),
        CompressionType::Zrle => self.decompress_zrle(),  // ← new
    }
}
```

## Step 6: Add a Round-Trip Test

```rust
#[test]
fn test_zrle_roundtrip() {
    // Mix of zeros and non-zeros
    let data = bytemuck::cast_slice(&[0i32, 0, 0, 42, 0, 0, 0, 7]).to_vec();
    let chunk = unsafe { ColumnChunk::new(data.as_ptr(), data.len(), 8, DataType::I32) };
    let compressed = compress_zrle(&chunk);
    let decompressed = compressed.decompress();
    let result = unsafe { decompressed.chunk.as_slice::<i32>() };
    assert_eq!(result, &[0i32, 0, 0, 42, 0, 0, 0, 7]);
}
```

## Step 7: Benchmark Compression Ratio

Add a benchmark (run with `cargo bench` or in the existing bench pipeline):

```rust
#[test]
fn test_zrle_compression_ratio() {
    let vals: Vec<i32> = (0..1000).map(|i| if i % 10 == 0 { i } else { 0 }).collect();
    let data = bytemuck::cast_slice(&vals).to_vec();
    let chunk = unsafe { ColumnChunk::new(data.as_ptr(), data.len(), vals.len(), DataType::I32) };
    let compressed = compress_zrle(&chunk);

    let ratio = data.len() as f64 / compressed.data.len() as f64;
    println!("ZRLE ratio for 90%-sparse i32 data: {:.2}x", ratio);
    assert!(ratio > 1.0, "ZRLE should compress sparse data");
}
```

## Existing Codec Reference

| Codec | File | Strategy |
|-------|------|----------|
| RLE | `compress/mod.rs:183-201` | Run-length encode repeated identical values |
| Delta | `compress/mod.rs:204-233` | Store first value, then deltas for I32/I64/F32 |
| Bitpack | `compress/mod.rs:235-241` | Minimal bit-width packing (pass-through currently) |
| Dictionary | `compress/mod.rs:243-267` | Build dictionary, store indices |

Follow the same `compress_*` / `decompress_*` / dispatch / test pattern for any new codec.

---
*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*