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

# Kasteran* — Performance Guide
© Lois-Kleinner & 0-1.gg 2026

## Overview

This guide provides optimization tips for getting the best performance from Kasteran* programs. The key insight is that different backends offer vastly different performance characteristics.

## Backend Performance Comparison

| Backend | Relative Speed | Startup Time | Use Case |
|---------|---------------|-------------|----------|
| Bytecode VM | 1x (baseline) | Instant | Development, debugging |
| C (no opt) | 5x - 10x | Slow | First production build |
| C (-O2) | 20x - 50x | Slow | Production |
| Cranelift JIT | 15x - 30x | Fast | Performance + interactivity |
| WASM | 10x - 20x | Medium | Web deployment |

## Use the C Backend for Production

The bytecode VM is designed for development speed, not execution speed. For production, always use the C backend:

```bash
# Development (fast compile, slow execution)
kasteran run myapp.ka

# Production (slow compile, fast execution)
kasteran build --release myapp.ka
./myapp
```

The C backend with `-O2` optimization typically produces code 20-50x faster than the bytecode VM.

## Use the Cranelift JIT for Interactive Work

For applications where startup time matters and you need good performance:

```bash
kasteran build --backend jit myapp.ka
```

The JIT backend compiles quickly (no C compiler invocation) but produces code that is faster than the bytecode VM.

## Comptime Evaluation

Use `comptime` to evaluate expressions at compile time:

```ka
// This is computed at compile time
const TABLE_SIZE: I32 = comptime {
    let base = 256;
    base * 2
};

// Runtime lookup table (slow)
fn slow_lookup(i: I32) -> F32 {
    let table: [F32; 512] = [/* ... */];
    table[i]
}

// Comptime-generated table (fast)
const TABLE: [F32; 512] = comptime {
    let mut t: [F32; 512] = [0.0; 512];
    for i in 0..512 {
        t[i] = sin(cast_to_f32(i) * 0.01);
    }
    t
};

fn fast_lookup(i: I32) -> F32 {
    TABLE[i] // No runtime computation
}
```

## Avoid the Bytecode VM for Tight Loops

The bytecode VM interprets each instruction individually. Tight loops with many iterations should be compiled with the C backend:

```ka
// Slow in bytecode VM:
fn sum(n: I32) -> F32 {
    let mut s: F32 = 0.0;
    let mut i: I32 = 0;
    while i < n {
        s = s + cast_to_f32(i);
        i = i + 1;
    }
    s
}

// Compile with:
// kasteran build --release sum.ka
```

## Inline Small Functions

The C backend inlines small functions automatically. You can also use the `#[inline]` attribute:

```ka
#[inline]
fn square(x: F32) -> F32 {
    x * x
}
```

## Use Local Variables Instead of Struct Fields

Accessing local variables is faster than accessing struct fields (especially in the bytecode VM):

```ka
// Faster:
fn process_local(x: F32, y: F32) -> F32 {
    x + y
}

// Slower (struct field access):
struct Point { x: F32, y: F32 }
fn process_struct(p: Point) -> F32 {
    p.x + p.y
}
```

## Avoid Recursion in the Bytecode VM

Recursive functions have high overhead in the bytecode VM due to call stack management. Convert recursion to iteration where possible:

```ka
// Recursive (slow in VM):
fn fact_rec(n: I32) -> I32 {
    if n <= 1 { 1 } else { n * fact_rec(n - 1) }
}

// Iterative (fast in VM):
fn fact_iter(n: I32) -> I32 {
    let mut result: I32 = 1;
    let mut i: I32 = 1;
    while i <= n {
        result = result * i;
        i = i + 1;
    }
    result
}
```

## Use Arrays Instead of Structs for Hot Paths

Array access is faster than struct field access in most backends:

```ka
// Fast path:
let data: [F32; 3] = [1.0, 2.0, 3.0];
let sum = data[0] + data[1] + data[2];

// Alternative with struct:
struct Data { a: F32, b: F32, c: F32 }
let d = Data { a: 1.0, b: 2.0, c: 3.0 };
let sum = d.a + d.b + d.c; // Slightly slower
```

## Enable OpenMP

For CPU-intensive parallel workloads, use the OpenMP backend:

```bash
kasteran build --release --openmp myapp.ka
```

This emits `#pragma omp parallel for` for parallelizable loops in the C backend.

## Measure Before Optimizing

Use the built-in timing utilities:

```ka
fn main() {
    let start = time();
    // ... your code ...
    let elapsed = time() - start;
    print("Elapsed: " + to_string(elapsed) + "ms");
}
```

Or use external profiling:

```bash
# Time with the bytecode VM
time kasteran run myapp.ka

# Time with C backend
time kasteran build --release myapp.ka && time ./myapp

# Profile with perf (Linux)
kasteran build --release myapp.ka
perf stat ./myapp
```

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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

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
