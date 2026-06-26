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

# Custom Codec Development

This guide covers writing custom compression codecs for the Kazkade columnar storage format.

## Codec Architecture

```
+---------------------------------------------------------+
¦                    Column Data Flow                      ¦
¦                                                         ¦
¦  Raw Data --> Encode --> Compressed --> Decode --> Raw ¦
¦  (in mem)     Codec      (.acol)       Codec     (SIMD) ¦
¦                                                         ¦
¦  +--------------+    +--------------+                  ¦
¦  ¦ Codec Trait  ¦    ¦ CodecRegistry ¦                  ¦
¦  ¦ + encode()   ¦    ¦ lookup(name) ¦                  ¦
¦  ¦ + decode()   ¦    ¦ register()   ¦                  ¦
¦  ¦ + name()     ¦    ¦ list()       ¦                  ¦
¦  ¦ + metadata() ¦    +--------------+                  ¦
¦  +--------------+                                       ¦
+---------------------------------------------------------+
```

## Built-in Codecs

| Codec | Type | Compression Ratio | Speed | Use Case |
|-------|------|-------------------|-------|----------|
| RLE | Run-length | 2-10x | Very fast | Low-cardinality, sorted |
| Delta | Delta encoding | 1.5-4x | Very fast | Sequential integers (timestamps) |
| Bitpack | Bit packing | 1.5-5x | Fast | Small-range integers |
| Dict | Dictionary | 3-20x | Medium | Low-cardinality strings |
| I4 | 4-bit integer | 2x | Very fast | Small ints (0-15) |
| I8 | 8-bit integer | 1.5x | Very fast | Small ints (0-255) |

## Codec Trait

```rust
use kazcade::codec::{Codec, CodecMetadata, EncodeContext, DecodeContext};

#[derive(Default)]
pub struct MyCustomCodec {
    // Codec state
    block_size: usize,
}

impl Codec for MyCustomCodec {
    fn name(&self) -> &'static str {
        "my_custom"
    }

    fn metadata(&self) -> CodecMetadata {
        CodecMetadata {
            version: 1,
            description: "Custom XOR-based delta codec",
            suitable_types: &["i64", "u64", "i32", "u32"],
            block_alignment: 64, // SIMD-friendly blocks
        }
    }

    fn encode(&self, ctx: EncodeContext) -> Result<Vec<u8>, CodecError> {
        let data = ctx.data();
        let output = self.compress(data);
        Ok(output)
    }

    fn decode(&self, ctx: DecodeContext) -> Result<Vec<u8>, CodecError> {
        let compressed = ctx.compressed();
        let output = self.decompress(compressed);
        Ok(output)
    }
}
```

## Step-by-Step: Custom Codec

Let's build a simple XOR-delta codec optimized for integer columns.

### Step 1: Project Setup

```bash
cargo new --lib my-codec
cd my-codec
```

```toml
[package]
name = "my-codec"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]

[dependencies]
kazcade-codec-sdk = "0.6"

[profile.release]
lto = true
opt-level = 3
```

### Step 2: Implement the Codec

```rust
// src/lib.rs
use kazcade_codec_sdk::*;
use std::mem;

const BLOCK_SIZE: usize = 1024;

pub struct XorDeltaCodec;

impl Codec for XorDeltaCodec {
    fn name(&self) -> &'static str {
        "xor_delta"
    }

    fn metadata(&self) -> CodecMetadata {
        CodecMetadata {
            version: 1,
            description: "XOR-based delta encoding for integers",
            suitable_types: &["i64", "u64", "i32", "u32", "i16", "u16"],
            block_alignment: 64,
        }
    }

    fn estimate_compression(&self, data: &[u8]) -> f64 {
        let num_elements = data.len() / mem::size_of::<i64>();
        if num_elements < 2 {
            return 1.0;
        }
        let values: &[i64] = unsafe { mem::transmute(data) };
        let mut xor_sum = 0u64;
        for i in 1..values.len() {
            xor_sum |= (values[i] ^ values[i - 1]) as u64;
        }
        // Estimate: if XOR deltas are small, compression is good
        if xor_sum < (1u64 << 32) {
            2.5
        } else {
            1.2
        }
    }

    fn encode(&self, input: &[u8], output: &mut Vec<u8>) -> Result<(), CodecError> {
        let num_elements = input.len() / mem::size_of::<i64>();
        if num_elements == 0 {
            return Ok(());
        }

        let values: &[i64] = unsafe { mem::transmute(input) };

        // Header: number of elements, base value
        output.extend_from_slice(&(num_elements as u64).to_le_bytes());
        output.extend_from_slice(&values[0].to_le_bytes());

        // XOR deltas
        for chunk in values[1..].chunks(BLOCK_SIZE) {
            for &v in chunk {
                let delta = (v ^ values[0]) as u64;
                // Variable-length encoding
                if delta < (1 << 7) {
                    output.push((delta as u8) | 0x80);
                } else if delta < (1 << 14) {
                    output.push((delta as u8) | 0x40);
                    output.push((delta >> 7) as u8);
                } else if delta < (1 << 21) {
                    output.push((delta as u8) | 0x20);
                    output.push((delta >> 7) as u8);
                    output.push((delta >> 14) as u8);
                } else {
                    output.push(0x00);
                    output.extend_from_slice(&delta.to_le_bytes());
                }
            }
        }

        Ok(())
    }

    fn decode(&self, input: &[u8], output: &mut Vec<u8>) -> Result<(), CodecError> {
        if input.len() < 16 {
            return Err(CodecError::InvalidData("Input too short".into()));
        }

        let mut pos = 0;

        // Read header
        let num_elements = u64::from_le_bytes(input[pos..pos + 8].try_into().unwrap()) as usize;
        pos += 8;
        let base = i64::from_le_bytes(input[pos..pos + 8].try_into().unwrap());
        pos += 8;

        let mut values = Vec::with_capacity(num_elements);
        values.push(base);

        while values.len() < num_elements && pos < input.len() {
            let first_byte = input[pos];
            pos += 1;

            let delta = if first_byte & 0x80 != 0 {
                (first_byte & 0x7f) as u64
            } else if first_byte & 0x40 != 0 {
                let b0 = (first_byte & 0x3f) as u64;
                let b1 = input[pos] as u64;
                pos += 1;
                b0 | (b1 << 7)
            } else if first_byte & 0x20 != 0 {
                let b0 = (first_byte & 0x1f) as u64;
                let b1 = input[pos] as u64;
                let b2 = input[pos + 1] as u64;
                pos += 2;
                b0 | (b1 << 7) | (b2 << 14)
            } else {
                let b0 = input[pos..pos + 8].try_into().unwrap();
                pos += 8;
                u64::from_le_bytes(b0)
            };

            values.push(base ^ (delta as i64));
        }

        let bytes: &[u8] = unsafe {
            std::slice::from_raw_parts(
                values.as_ptr() as *const u8,
                values.len() * mem::size_of::<i64>(),
            )
        };
        output.extend_from_slice(bytes);

        Ok(())
    }
}

// Register codec
kazcade_register_codec!(XorDeltaCodec);
```

### Step 3: Build

```bash
cargo build --release
```

### Step 4: Register the Codec

```bash
# Copy to plugins directory
cp target/release/libmy_codec.so ~/.kazcade/codecs/

# Verify registration
kazkade codec list
```

Output:

```
Available codecs:
  rle          (built-in)
  delta        (built-in)
  bitpack      (built-in)
  dict         (built-in)
  i4           (built-in)
  i8           (built-in)
  xor_delta    (my-codec v0.1.0)  ? custom codec
```

### Step 5: Use the Codec

```bash
# Ingest using custom codec
kazkade ingest data.csv --output compressed.acol --codec xor_delta

# Or for a specific column
kazkade ingest data.csv --output compressed.acol \
  --codec column1:xor_delta --codec column2:rle
```

## Benchmarking Against Built-in Codecs

```rust
use kazcade::bench::{BenchConfig, bench_codec};

fn benchmark_codecs() -> Result<()> {
    let config = BenchConfig {
        dataset_size: 1_000_000,
        value_type: "i64",
        codecs: vec!["xor_delta", "delta", "rle", "bitpack"],
    };

    let results = bench_codec(config)?;

    for r in &results {
        println!("{:10} | Encode: {:8.2} MB/s | Decode: {:8.2} MB/s | Ratio: {:.2}x",
            r.codec, r.encode_throughput, r.decode_throughput, r.compression_ratio);
    }

    Ok(())
}
```

Output:

```
xor_delta   | Encode: 1250.34 MB/s | Decode: 1100.21 MB/s | Ratio: 2.34x
delta       | Encode: 2100.12 MB/s | Decode: 1900.45 MB/s | Ratio: 2.10x
rle         | Encode: 3200.00 MB/s | Decode: 2900.00 MB/s | Ratio: 3.50x
bitpack     | Encode: 1800.56 MB/s | Decode: 1600.78 MB/s | Ratio: 2.80x
```

## SIMD-Optimized Codec

```rust
use std::arch::x86_64::*;

impl Codec for SimdXorCodec {
    fn encode_simd(&self, input: &[i64], output: &mut Vec<u8>) -> Result<()> {
        if is_x86_feature_detected!("avx2") {
            unsafe { self.encode_avx2(input, output) }
        } else {
            self.encode_scalar(input, output)
        }
    }

    #[target_feature(enable = "avx2")]
    unsafe fn encode_avx2(&self, input: &[i64], output: &mut Vec<u8>) -> Result<()> {
        let base = _mm256_set1_epi64x(input[0] as i64);
        for chunk in input[1..].chunks(4) {
            let mut vec = _mm256_loadu_si256(chunk.as_ptr() as *const __m256i);
            vec = _mm256_xor_si256(vec, base);
            // Store XOR deltas
            _mm256_storeu_si256(output.as_mut_ptr() as *mut __m256i, vec);
            // advance output...
        }
        Ok(())
    }
}
```

## Testing Your Codec

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_roundtrip() {
        let codec = XorDeltaCodec;
        let input = vec![
            100i64, 105, 110, 115, 120, 125, 130, 135,
            200, 205, 210, 215, 220,
        ];
        let bytes: &[u8] = unsafe {
            std::slice::from_raw_parts(
                input.as_ptr() as *const u8,
                input.len() * 8,
            )
        };

        let mut encoded = Vec::new();
        codec.encode(bytes, &mut encoded).unwrap();

        let mut decoded = Vec::new();
        codec.decode(&encoded, &mut decoded).unwrap();

        let decoded_values: &[i64] = unsafe { std::mem::transmute(&decoded[..]) };
        assert_eq!(&input, decoded_values);
    }

    #[test]
    fn test_compression_ratio() {
        let codec = XorDeltaCodec;
        // Sequential values should compress well
        let input: Vec<i64> = (0..10000).collect();
        let bytes: &[u8] = unsafe { std::mem::transmute(&input[..]) };
        let mut encoded = Vec::new();
        codec.encode(bytes, &mut encoded).unwrap();
        let ratio = bytes.len() as f64 / encoded.len() as f64;
        assert!(ratio > 2.0, "Compression ratio too low: {ratio}");
    }
}
```

## Publishing

```bash
# Package codec for distribution
kazkade codec package --output xor_delta.kcodec

# Publish to registry
kazkade codec publish xor_delta.kcodec
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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/YMJKOG
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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com