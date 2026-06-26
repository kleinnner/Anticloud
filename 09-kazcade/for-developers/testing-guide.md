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

# Testing Guide

Kazkade uses Rust's built-in test framework (`#[test]`) exclusively. All tests are inline in `#[cfg(test)]` modules within each source file — there is no separate `tests/` directory. There are currently **15 unit tests** across 6 modules.

## Test Organization

| File | Tests | Lines | What's Covered |
|------|-------|-------|----------------|
| `src/compress/mod.rs` | 4 | 269-316 | RLE round-trip, bitpack pass-through, dictionary round-trip, delta round-trip |
| `src/compress/quantize.rs` | 3 | 157-191 | INT8 quantize/dequantize error, INT4 quantize/dequantize error, INT4 storage size |
| `src/simd/vector.rs` | 2 | 124-146 | Element-wise add correctness, dot product correctness |
| `src/simd/matrix.rs` | 2 | 312-350 | GEMM 4x4 vs known result, GEMM 8x8 vs naive matmul |
| `src/simd/neural.rs` | 3 | 278-312 | MLP forward propagation, MLP save/load round-trip, SIMD vector add |
| `src/aioss.rs` | 1 | 467-490 | Binary + JSON .aioss ledger round-trip with hash chain verification |

## Running Tests

```bash
# Run all tests
cargo test

# Run tests in a specific module
cargo test test_rle_roundtrip

# Run tests with output (useful for debugging)
cargo test -- --nocapture

# Run tests matching a pattern
cargo test simd
```

## Test Fixtures

Tests avoid external files when possible. In-memory test data is constructed directly:

```rust
fn test_rle_roundtrip() {
    let data = bytemuck::cast_slice(&[42i32, 42, 42, 42, 7, 7, 7, 7]).to_vec();
    let chunk = unsafe { ColumnChunk::new(data.as_ptr(), data.len(), 8, DataType::I32) };
    let compressed = compress_rle(&chunk);
    let decompressed = compressed.decompress();
    let result = unsafe { decompressed.chunk.as_slice::<i32>() };
    assert_eq!(result, &[42i32, 42, 42, 42, 7, 7, 7, 7]);
}
```

For tests that do need files (e.g., `.aioss` ledger round-trip), temp files are written and cleaned up:

```rust
fn test_binary_json_roundtrip() {
    // ...
    let json_path = std::env::temp_dir().join("aioss_rt_test.json");
    let bin_path = std::env::temp_dir().join("aioss_rt_test.aioss");
    ledger.write_json(&json_path).unwrap();
    ledger.write_binary(&bin_path).unwrap();
    // ... verify ...
    let _ = std::fs::remove_file(&json_path);
    let _ = std::fs::remove_file(&bin_path);
}
```

For random tests, use `rand::thread_rng()`:

```rust
#[test]
fn test_tanh_random() {
    use rand::Rng;
    let mut rng = rand::thread_rng();
    let n = 1000;
    let x: Vec<f32> = (0..n).map(|_| rng.gen_range(-5.0..5.0)).collect();
    let mut expected = vec![0.0f32; n];
    let mut actual = vec![0.0f32; n];
    scalar_tanh(n, &x, &mut expected);
    tanh(n, &x, &mut actual);
    for i in 0..n {
        assert!((actual[i] - expected[i]).abs() < 1e-4);
    }
}
```

## Adding Tests for New Features

When adding a new feature, follow these rules:

1. **Compression codec**: Write round-trip `compress → decompress → assert_eq` and a compression ratio benchmark.
2. **SIMD kernel**: Write a comparison test that runs both the SIMD path and the scalar fallback on random data.
3. **Column type**: Write a chunk read/write test and a filter test.
4. **Aioss**: Write a binary+JSON round-trip with verify.
5. **Rasterizer**: Write a test that renders a small known scene and checks pixel output.

Pattern for all tests:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_my_feature() {
        // Arrange
        // Act
        // Assert
    }
}
```

## Testing SIMD Paths

SIMD kernels are tested by comparing against their scalar counterpart. The dispatch functions make this easy — just call the public function and it will use SIMD on the host. For cross-validation:

```rust
#[test]
fn test_simd_equals_scalar() {
    let a = vec![1.0f32; 1000];
    let b = vec![2.0f32; 1000];
    let mut simd_result = vec![0.0f32; 1000];
    let mut scalar_result = vec![0.0f32; 1000];

    // SIMD path (via public API)
    super::add(1000, &a, &b, &mut simd_result);

    // Scalar path
    scalar_add(1000, &a, &b, &mut scalar_result);

    assert_eq!(simd_result, scalar_result);
}
```

## Continuous Integration

Since there is no `.github/workflows/ci.yml` file yet, CI can be set up manually. The standard invocation is:

```yaml
- name: Run tests
  run: cargo test --all-features
```

Because Kazkade uses `cfg!(target_arch)` for SIMD, CI runners on x86_64 will test the AVX2 path automatically. aarch64 runners test NEON.

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