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

# Columnar Engine — Zero-Copy `.acol` Storage

The Kazkade columnar engine is a zero-copy, memory-mapped column store purpose-built for analytical workloads on quantized neural and tabular data. It eschews row-oriented layouts entirely in favour of dense, type-homogeneous column segments that map directly from disk into process address space, eliminating deserialisation overhead.

## The `.acol` Format

Every dataset is stored as one or more `.acol` files. An `.acol` file begins with a fixed-size header followed by a repeating sequence of `Schema` records and `ColumnChunk` bodies.

```
┌─────────────────────────────┐
│         Magic: "ACOL"       │  4 bytes
│         Version: 1          │  4 bytes
│         Column Count        │  4 bytes
│         Row Count           │  8 bytes
│         Schema Offset       │  8 bytes
│         Chunk Index Offset  │  8 bytes
├─────────────────────────────┤
│         Schema[]            │  variable
├─────────────────────────────┤
│      Chunk Index Entry[]    │  variable
├─────────────────────────────┤
│      ColumnChunk[0]         │  variable
│      ColumnChunk[1]         │  ...
│      ...                    │
└─────────────────────────────┘
```

### Schema

Each `Schema` entry defines a column: name (UTF‑8, 256 byte limit), logical type (`U8`, `I16`, `I32`, `I64`, `F32`, `F64`, `I4`, `I8`, `BOOL`), physical compression, and nullable flag. The schema section is stored adjacent to the header so that readers can fast-path column lookups.

### ColumnChunk

A chunk is a contiguous byte slab containing:

- **Metadata** — byte width, row count, uncompressed size, compressed size, codec ID.
- **Dictionary** (if codec == Dictionary) — sorted unique values + index array.
- **Bit-width metadata** (if codec == Bitpack) — stored bit-width per value.
- **Compressed body** — the encoded column data.

All offsets are relative to the start of the file, enabling the reader to `mmap` and produce `&[u8]` slices with zero copying.

## Compression Codecs

| Codec      | Use Case                          | Typical Ratio |
|------------|-----------------------------------|---------------|
| RLE         | Repeated categoricals, sparse     | 10:1 – 50:1   |
| Delta       | Monotonic counters, timestamps    | 2:1 – 8:1     |
| Bitpack     | Low-cardinality integers          | 2:1 – 16:1    |
| Dictionary  | High-cardinality strings, enums   | 3:1 – 20:1    |
| I4 / I8     | Quantised neural activations      | 2:1 – 4:1     |

## Quantised Types: I4 and I8

I4 stores two 4-bit integers per byte. I8 stores one signed 8-bit integer. These types are first-class citizens in the type system; the engine never widens them to `i16`/`i32` during scan. A dedicated SIMD path reads I4 data with a single `vpmovzxbw` (AVX‑512) or shift‑mask sequence (AVX2) per 32‑byte chunk.

## Zero-Copy Scan Pipeline

```mermaid
flowchart LR
    A[.acol File on Disk] --> B{mmap}
    B --> C[&[u8] Slice]
    C --> D[Parse Header]
    D --> E[Locate Chunk via Index]
    E --> F[Slice ColumnChunk Bytes]
    F --> G{Codec?}
    G -- RLE/Delta/Bitpack/Dict --> H[Decompress to Temp]
    G -- I4/I8/None --> I[Zero-Copy &[T]]
    H --> J[SIMD Scan]
    I --> J
    J --> K[Filtered / Aggregated Result]
```

Because I4/I8 and uncompressed columns are used directly from the mmap region, the engine can sustain scan bandwidths approaching memory bandwidth — measured at 12–18 GB/s on DDR5‑4800 systems for uncompressed `F32` columns.

## SIMD Integration

The columnar engine delegates vectorised kernels to the `simd_dispatch` module. Predicate evaluation, arithmetic, and aggregation are compiled for AVX2, AVX‑512, and NEON, selected at runtime. Column chunks are padded to 64‑byte alignment so that SIMD loads never split cache lines.

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

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

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
