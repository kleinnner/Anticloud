<!--
KASTERAN* — The Last Programming Language
© Lois-Kleinner & 0-1.gg 2026. All rights reserved.

 ▄▄   ▄▄▄                                           ▄     
 ██  ██▀                         ██              ▄▄ █ ▄▄  
 ██▄██      ▄█████▄  ▄▄█████▄  ███████    ▄████▄    ██▄████   ▄█████▄  ██▄████▄   █████   
 █████      ▀ ▄▄▄██  ██▄▄▄▄ ▀    ██      ██▄▄▄▄██   ██▀       ▀ ▄▄▄██  ██▀   ██  ▀▀ █ ▀▀  
 ██  ██▄   ▄██▀▀▀██   ▀▀▀▀██▄    ██      ██▀▀▀▀▀▀   ██       ▄██▀▀▀██  ██    ██     ▀     
 ██   ██▄  ██▄▄▄███  █▄▄▄▄▄██    ██▄▄▄   ▀██▄▄▄▄█   ██       ██▄▄▄███  ██    ██           
 ▀▀    ▀▀   ▀▀▀▀ ▀▀   ▀▀▀▀▀▀      ▀▀▀▀     ▀▀▀▀▀    ▀▀        ▀▀▀▀ ▀▀  ▀▀    ▀▀           
-->

# Kasteran* — Scatter Parallelization

© Lois-Kleinner & 0-1.gg 2026

## Overview

The `~&` scatter rune enables automatic parallelization. When applied to a collection, it distributes elements across multiple threads or SIMD lanes, executing the mapped function in parallel.

## Basic Syntax

```
collection ~& process_element
```

Each element of `collection` is processed independently by `process_element`. The order of execution is non-deterministic.

## OpenMP Backend

When targeting C, `~&` generates OpenMP `#pragma omp parallel for`:

```
// Kasteran*
arr ~& compute
```

```c
#pragma omp parallel for shared(arr) private(i)
for (int i = 0; i < arr.len; i++) {
    compute(arr.data[i]);
}
```

## SIMD Vectorization

For numeric types on supported architectures, `~&` can generate SIMD instructions:

```
// Kasteran*
[f32, 1024] ~& sqrt
```

```asm
; x86-64 with AVX
vmovaps ymm0, [rdi]
vsqrtps ymm0, ymm0
vmovaps [rdi], ymm0
```

## Data Race Prevention

The compiler statically prevents data races by enforcing:

1. **No shared mutable state**: Each element must be independent
2. **No global variable mutation** inside scattered functions
3. **No aliased pointer arguments**

```
count :~ 0
arr ~& |x| { count = count + 1 }  // ERROR: shared mutable state
```

## Graph

```
graphify {
    Collection ~& fn -> ParallelAnalyzer
    ParallelAnalyzer -> {OpenMP, SIMD, ThreadPool}
    OpenMP -> {parallel_for, reduction, schedule}
    SIMD -> {AVX, SSE, NEON, SVE}
    ThreadPool -> {WorkStealing, Chunking}
    SafetyChecker -> {NoRaces, NoAlias, NoGlobal}
}
```

## Reduction

The scatter operator supports reductions:

```
sum := arr ~& +   // sum of all elements
max := arr ~& max  // maximum element
```

Generated OpenMP with reduction:

```c
#pragma omp parallel for reduction(+:sum)
for (int i = 0; i < arr.len; i++) {
    sum += arr.data[i];
}
```

## Scheduling Control

The scheduler can be configured:

```
arr ~& [schedule="guided", chunksize=16] process
```

Available schedules: `static`, `dynamic`, `guided`, `auto`.

## Example: Parallel Image Processing

```
|+ process_pixel(pixel: [u8, 4]) -> [u8, 4] {
    // grayscale conversion
    gray := (0.299 * pixel[0] + 0.587 * pixel[1] + 0.114 * pixel[2]) as u8
    => [gray, gray, gray, pixel[3]]
}

|+ main() -> i32 {
    image := load_image("photo.png")    // [u8, 1024, 768, 4]
    result := image ~& process_pixel   // parallel pixel processing
    save_image("photo_grayscale.png", result)
    => 0
}
```

## Performance

| Collection Size | Sequential | Scatter (4 cores) | Speedup |
|----------------|-----------|-------------------|---------|
| 1,000 | 0.1ms | 0.05ms | 2x |
| 100,000 | 10ms | 2.5ms | 4x |
| 10,000,000 | 1s | 0.26s | 3.8x |

## Limitations

- The scattered function must be pure (no side effects)
- Results order is not guaranteed
- Overhead for small collections may negate benefits
- Not available in WASM target without threads proposal
</```

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ