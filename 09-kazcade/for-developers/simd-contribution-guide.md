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

# SIMD Contribution Guide

Kazkade's SIMD layer provides runtime-dispatched vector and matrix kernels for x86_64 (AVX2/AVX-512) and aarch64 (NEON). This guide explains how to add a new SIMD kernel following the established pattern.

## Architecture Overview

The dispatch flow is:

1. **Public API** in `src/simd/vector.rs` (or `matrix.rs`, `neural.rs`)
2. **Platform backends** in `src/simd/x86_64.rs` (AVX2), `src/simd/aarch64.rs` (NEON)
3. **Runtime detection** via `kazkade::core::CPU.has_avx2` / `has_neon`
4. **Scalar fallback** defined in the same file for unsupported hardware

## Step-by-Step: Adding a New Vector Kernel

Let's add `tanh` (hyperbolic tangent) activation as an example.

### 1. Write the x86_64 AVX2 Version

In `src/simd/x86_64.rs`, inside the `avx2` module:

```rust
/// Tanh activation: tanh(x) = (e^x - e^-x) / (e^x + e^-x)
#[target_feature(enable = "avx2")]
pub unsafe fn tanh(n: usize, x: &[f32], out: &mut [f32]) {
    let mut i = 0;
    while i + 8 <= n {
        let v = _mm256_loadu_ps(x.as_ptr().add(i));
        // tanh(x) ≈ x * (27 + x^2) / (27 + 9*x^2)  (pade approximation)
        let x2 = _mm256_mul_ps(v, v);
        let numer = _mm256_add_ps(_mm256_mul_ps(v, _mm256_set1_ps(27.0 + x2)), v);
        let denom = _mm256_add_ps(_mm256_set1_ps(27.0), _mm256_mul_ps(_mm256_set1_ps(9.0), x2));
        _mm256_storeu_ps(out.as_mut_ptr().add(i), _mm256_div_ps(numer, denom));
        i += 8;
    }
    for j in i..n {
        let e2x = (2.0 * x[j]).exp();
        out[j] = (e2x - 1.0) / (e2x + 1.0);
    }
}
```

### 2. Write the aarch64 NEON Version

In `src/simd/aarch64.rs`, inside the `neon_vector` module:

```rust
#[target_feature(enable = "neon")]
pub unsafe fn tanh(n: usize, x: &[f32], out: &mut [f32]) {
    let mut i = 0;
    while i + 4 <= n {
        let v = vld1q_f32(x.as_ptr().add(i));
        let x2 = vmulq_f32(v, v);
        let numer = vmulq_f32(v, vaddq_f32(vdupq_n_f32(27.0), x2));
        let denom = vaddq_f32(vdupq_n_f32(27.0), vmulq_f32(vdupq_n_f32(9.0), x2));
        vst1q_f32(out.as_mut_ptr().add(i), vdivq_f32(numer, denom));
        i += 4;
    }
    for j in i..n {
        let e2x = (2.0 * x[j]).exp();
        out[j] = (e2x - 1.0) / (e2x + 1.0);
    }
}
```

### 3. Add the Public Dispatch Function

In `src/simd/vector.rs`:

```rust
/// Tanh activation: tanh(x)
pub fn tanh(n: usize, x: &[f32], out: &mut [f32]) {
    #[cfg(target_arch = "x86_64")]
    if crate::core::CPU.has_avx2 {
        return unsafe { avx2::tanh(n, x, out); }
    }
    #[cfg(target_arch = "aarch64")]
    if crate::core::CPU.has_neon {
        return unsafe { neon_vector::tanh(n, x, out); }
    }
    scalar_tanh(n, x, out);
}
```

### 4. Add the Scalar Fallback

In the scalar section at the bottom of `vector.rs`:

```rust
fn scalar_tanh(n: usize, x: &[f32], out: &mut [f32]) {
    for i in 0..n {
        let e2x = (2.0 * x[i]).exp();
        out[i] = (e2x - 1.0) / (e2x + 1.0);
    }
}
```

### 5. Add a `test_*_random` Verification Test

Randomized testing compares all three paths. Add this in `vector.rs`:

```rust
#[test]
fn test_tanh_random() {
    use rand::Rng;
    let mut rng = rand::thread_rng();
    let n = 1000;
    let x: Vec<f32> = (0..n).map(|_| rng.gen_range(-5.0..5.0)).collect();
    let mut expected = vec![0.0f32; n];
    let mut actual = vec![0.0f32; n];

    // Scalar reference
    scalar_tanh(n, &x, &mut expected);

    // SIMD path (via dispatch)
    tanh(n, &x, &mut actual);

    for i in 0..n {
        let err = (actual[i] - expected[i]).abs();
        assert!(err < 1e-4, "Mismatch at {}: got {} vs expected {}",
                i, actual[i], expected[i]);
    }
}
```

## CPU Feature Detection

Feature flags are detected once at startup via `CpuFeatures::detect()` in `src/core/cpu.rs`. The `CPU` static is a `LazyLock`:

```rust
pub static CPU: std::sync::LazyLock<CpuFeatures> =
    std::sync::LazyLock::new(CpuFeatures::detect);
```

On x86_64, it uses `is_x86_feature_detected!("avx2")` and friends. On aarch64, it checks `/proc/cpuinfo` for `neon`/`asimd`. Always gate dispatch with `#[cfg(target_arch = "...")]` so the platform-specific code compiles only on the right target.

## Pattern Summary

| Component | File | What to Add |
|-----------|------|-------------|
| AVX2 kernel | `src/simd/x86_64.rs` + `pub mod avx2` | `#[target_feature(enable = "avx2")]` function |
| NEON kernel | `src/simd/aarch64.rs` + `pub mod neon_vector` | `#[target_feature(enable = "neon")]` function |
| Dispatch | `src/simd/vector.rs` | `pub fn` checking `CPU.has_avx2` / `CPU.has_neon` |
| Fallback | `src/simd/vector.rs` (scalar section) | `fn scalar_*` |
| Test | `src/simd/vector.rs` `#[cfg(test)]` | Randomized comparison test |

To add a GEMM micro-kernel variant (e.g., fused activation), follow the pattern of `micro_kernel_relu_8x8` and `matmul_relu_f32` in `x86_64.rs`.

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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
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
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ