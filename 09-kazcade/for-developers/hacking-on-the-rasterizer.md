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

# Hacking on the Rasterizer

The software rasterizer in `src/raster/` implements a tile-based forward rendering pipeline with SIMD-accelerated vertex transform, parallel rasterization via rayon, and a programmable fragment shader.

## Pipeline Internals

The `Pipeline::render()` method executes these stages in order:

### 1. Vertex Transform

```rust
let mvp = self.mvp_matrix();  // P * V * M
let clip_vertices: Vec<Vec4> = self.vertex_buffer
    .par_iter()
    .map(|v| mvp.transform_simd(&v.position))
    .collect();
```

`transform_simd()` uses AVX2 on x86_64 (via `transform_avx2` which broadcasts each Vec4 component and uses `_mm256_fmadd_ps`) or NEON on aarch64. The `mat4.transform()` scalar path is the fallback.

### 2. Perspective Divide + Viewport Transform

```rust
let screen_vertices: Vec<Vec4> = clip_vertices
    .par_iter()
    .map(|v| {
        let inv_w = 1.0 / v.3.max(1e-10);
        Vec4::new(
            (v.0 * inv_w + 1.0) * half_w,
            (1.0 - v.1 * inv_w) * half_h,
            v.2 * inv_w * 0.5 + 0.5,  // depth mapped to [0,1]
            inv_w,
        )
    })
    .collect();
```

### 3. Tile Iteration

The framebuffer is divided into tiles (default 16×16 pixels). `tile_indices` is a flat list `(tx, ty)` processed in parallel via `par_iter()`:

```rust
let tile_indices: Vec<(usize, usize)> = (0..tiles_y)
    .flat_map(|ty| (0..tiles_x).map(move |tx| (tx, ty)))
    .collect();

tile_indices.par_iter().for_each(|&(tx, ty)| {
    let tile_x = tx * tile_size;
    // ... iterate triangles, cull per-tile AABB, scan pixels ...
});
```

### 4. Fragment Shader

The default `shade_fragment()` in `shader.rs` does perspective-correct barycentric interpolation of vertex colors:

```rust
pub fn shade_fragment(bary: Vec4, tri: &ScreenTriangle) -> Rgba {
    let color = interpolate_v4(tri.c0, tri.c1, tri.c2, bary);
    Rgba::from_f32x4([
        color.0.min(1.0).max(0.0),
        color.1.min(1.0).max(0.0),
        color.2.min(1.0).max(0.0),
        1.0,
    ])
}
```

### 5. Depth Testing

Depth is interpolated from the triangle's vertex depths (NDC z mapped to [0,1]) and compared against the depth buffer. The depth buffer is a flat `Vec<f32>` cleared to `1.0` (far plane):

```rust
let depth = tri.v0.2 * bary.0 + tri.v1.2 * bary.1 + tri.v2.2 * bary.2;
let d_idx = y * fb_width + x;
if depth < *depth_base.add(d_idx) {
    *depth_base.add(d_idx) = depth;
    // write pixel
}
```

### 6. Framebuffer Ops

The `Framebuffer` in `framebuffer.rs` uses double buffering with `PinnedBuffer` for cache-aligned allocation. Clearing is SIMD-accelerated using `_mm256_stream_si256` (non-temporal stores) on AVX2:

```rust
pub fn clear(&mut self, color: Rgba) {
    #[cfg(target_arch = "x86_64")]
    if crate::core::CPU.has_avx2 {
        unsafe { clear_avx2(self.back.as_mut_ptr(), len, r, g, b, a); }
        return;
    }
    // scalar fallback
}
```

## Adding a New Shader Effect

To add a new fragment shader, modify `shade_fragment()` or add a parameterized version:

```rust
#[derive(Clone, Copy)]
pub enum ShaderMode {
    Flat,
    Gouraud,
    Checkerboard,
    Wireframe,
}

pub fn shade_fragment_ex(bary: Vec4, tri: &ScreenTriangle, mode: ShaderMode) -> Rgba {
    match mode {
        ShaderMode::Flat => {
            // Use first vertex color for entire triangle
            Rgba::from_f32x4([tri.c0.0, tri.c0.1, tri.c0.2, 1.0])
        }
        ShaderMode::Checkerboard => {
            let color = interpolate_v4(tri.c0, tri.c1, tri.c2, bary);
            let checker = ((bary.0 * 20.0).floor() as i32
                + (bary.1 * 20.0).floor() as i32) % 2 == 0;
            if checker {
                Rgba::from_f32x4([color.0, color.1, color.2, 1.0])
            } else {
                Rgba::BLACK
            }
        }
        ShaderMode::Wireframe => {
            // Highlight edge pixels based on barycentric proximity to zero
            let eps = 0.02;
            if bary.0 < eps || bary.1 < eps || bary.2 < eps {
                Rgba::WHITE
            } else {
                Rgba::from_f32x4([bary.0, bary.1, bary.2, 1.0])
            }
        }
        _ => shade_fragment(bary, tri),
    }
}
```

Add a `shader_mode` field to `Pipeline` and pass it down to the fragment shader call in `render()`.

## SIMD Transform Path

The `transform_simd` method in `shader.rs` uses AVX2 for 4×4 matrix-vector multiplication. It broadcasts each component of `v` into a 256-bit register and uses FMA:

```rust
unsafe fn transform_avx2(&self, v: &Vec4) -> Vec4 {
    let vx = _mm256_set1_ps(v.0);
    let vy = _mm256_set1_ps(v.1);
    let vz = _mm256_set1_ps(v.2);
    let vw = _mm256_set1_ps(v.3);
    let col0 = _mm256_loadu_ps(self.0.as_ptr().add(0));
    // ... 3 more columns ...
    let mut result = _mm256_mul_ps(vx, col0);
    result = _mm256_fmadd_ps(vy, col1, result);
    result = _mm256_fmadd_ps(vz, col2, result);
    result = _mm256_fmadd_ps(vw, col3, result);
    // Extract first 4 floats
}
```

## Performance Profiling

Profile the rasterizer using:

```bash
# On x86_64 with perf (Linux)
cargo build --release
perf stat -e cycles,instructions,cache-misses ./target/release/kazkade bench

# On macOS with Instruments
cargo instruments -t "CPU Profiler"

# Simple timing via RUST_LOG
RUST_LOG=debug cargo run -- bench

# Manual timing (already in bench_raster):
# Times 100 frames and reports FPS + MP/s
```

Key optimization targets (by cost):
1. **Fragment shader** — most-executed code (one call per visible pixel)
2. **Depth test** — simple float compare, but high volume
3. **Barycentric computation** — per-pixel division
4. **Tile AABB culling** — cheap but worth keeping tight

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

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

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
