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

# Architecture Overview

Kazkade is a single-crate Rust project (no workspace) defined by `Cargo.toml` with `src/lib.rs` as the library root and `src/main.rs` as the binary entrypoint. There is no `[[bin]]` override — Cargo's default convention is used. The library exposes a `lib.rs` with six public modules; the binary imports the library and provides the CLI (`bench`, `gen`, `query`, `dashboard`, `info`, `stats`, `neural`, `ledger`, `verify`).

## Crate Dependency Graph

```
src/lib.rs
  ├── core          → cpu, memory, io_ring, error (platform-dependent I/O ring)
  ├── simd          → matrix, vector, neural, x86_64, aarch64
  ├── columnar      → schema, chunk, layout, scan, pipeline, sql
  ├── raster        → pipeline, shader, framebuffer, tile
  ├── compress      → mod (RLE/Delta/Bitpack/Dictionary), quantize (INT4/INT8)
  ├── telemetry     → Event enum, Telemetry struct, HTML report
  └── aioss         → AiossLedger, hash chain, Ed25519 proofs

src/main.rs
  └── dashboard     → egui-based UI (Dashboard struct, 4 tabs)
```

Modules are shallow — each contains a single `mod.rs` that re-exports key types. No deep nesting.

## Module Responsibilities

**`core`** — Low-level platform abstractions: `CPU` singleton with runtime ISA detection (AVX2, AVX-512, NEON, SVE), NUMA topology detection, `PinnedBuffer` for page-aligned allocations, `IoRing` for async I/O (Linux `io_uring` or fallback), `CoreError`/`CoreResult`.

**`simd`** — Vectorized math kernels with runtime dispatch. `vector.rs` provides element-wise ops (add, mul, fma, dot, relu, softmax, gelu, normalize) that check `CPU.has_avx2` or `CPU.has_neon` at runtime and fall back to scalar. `matrix.rs` exposes `matmul_f32` with cache-tiled GEMM. `neural.rs` provides `Mlp` (multi-layer perceptron) with forward/inference. Platform-specific code lives in `x86_64.rs` (AVX2, AVX-512, packed GEMM with auto-tune) and `aarch64.rs` (NEON 4x4 micro-kernel, AMX if available).

**`columnar`** — Zero-copy columnar storage. `schema.rs` defines `DataType` (13 variants), `CompressionCodec`, `ColumnMeta`, `Schema`, `ColumnStats`. `chunk.rs` defines `ColumnChunk` (raw pointer into mmap'd data) and `OwnedColumnChunk`. `layout.rs` handles the `.acol` file format: magic `b"ACOL"`, header with schema + column offsets, mmap-based `MappedColumnarFile`, `ColumnarFileBuilder`. `scan.rs` provides SIMD-accelerated `filter_column()`, parallel `filter_column_par()`, and aggregates (sum/min/max for f32/i32/f64). `pipeline.rs` chains scan operations. `sql.rs` provides SQL parsing and execution.

**`raster`** — Software rasterization pipeline. `framebuffer.rs` — double-buffered `Framebuffer` with `PinnedBuffer` front/back, depth buffer, tile views, SIMD clear. `shader.rs` — `Vec4`, `Mat4`, `Vertex`, `ScreenTriangle`, barycentric interpolation, `shade_fragment()`, SIMD matrix transform. `pipeline.rs` — `Pipeline` with `render()` that does transform + rasterize + depth test in parallel via rayon. `tile.rs` — `TileRect` grid math.

**`compress`** — `CompressionType` enum (None, Rle, Delta, Bitpack, Dictionary), `CompressedChunk`/`DecompressedChunk`, `compress_column()` dispatch, per-method compress/decompress implementations. `quantize.rs` provides `QuantizedWeights` for INT4/INT8 neural network weight quantization.

**`telemetry`** — `Event` enum with 8 variants (Matmul, Vector, Filter, RasterFrame, RasterBatch, IoRead, Alloc, Custom), `Telemetry` with `record()` and `write_html()`.

**`aioss`** — Append-only signed state format. `AiossLedger` with SHA3-256 hash chain, Ed25519 signing/verification, binary `.aioss` format (160-byte header, 256-byte entries) and JSON format.

## Public API Surface (from `lib.rs`)

```rust
pub mod core;       // CPU, PinnedBuffer, IoRing, CoreError
pub mod simd;       // matmul_f32, add, mul, dot, Mlp, Layer
pub mod columnar;   // Schema, DataType, ColumnChunk, MappedColumnarFile, Predicate, scan::*
pub mod raster;     // Pipeline, PipelineConfig, Framebuffer, Rgba, Mat4, Vec4
pub mod compress;   // CompressedChunk, compress_column, CompressionType
pub mod telemetry;  // Telemetry, Event
pub mod aioss;      // AiossLedger, generate_keypair, StateProof
```

The binary entry point (`main.rs`) depends on `kazkade` as a library and adds the `dashboard` module. Cross-module calls always go through the public API — there is no `pub(crate)` abuse between sub-systems.

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

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
