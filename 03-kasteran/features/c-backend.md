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

# Kasteran* — C Backend

© Lois-Kleinner & 0-1.gg 2026

## Overview

The C backend transpiles Kasteran* programs to C17, enabling compilation with any standard C compiler (GCC, Clang, MSVC). The generated C code is human-readable and preserves the original structure.

## Compilation

```
kasteran build --target c program.kast -o output.c
gcc -O3 -fopenmp output.c -o program
```

## Struct Layout

Kasteran* structs are translated to C structs with the same field ordering:

```
// Kasteran*
$$ Point = (x: f32, y: f32)
```

```c
// Generated C
typedef struct {
    float x;
    float y;
} Point;
```

Linear type fields are represented with pointer semantics:

```
// Kasteran*
$$ Buffer = (data: %* [u8], len: i64)
```

```c
typedef struct {
    uint8_t* data;
    int64_t len;
} Buffer;
```

## OpenMP Parallelization

The `~&` scatter rune maps to OpenMP `#pragma omp parallel for`:

```
// Kasteran*
arr ~& process_element
```

```c
#pragma omp parallel for
for (int i = 0; i < arr_length; i++) {
    process_element(arr[i]);
}
```

The compiler infers data dependencies and adds appropriate `shared`/`private` clauses.

## `main` Generation

The entry point is translated to a standard C `main`:

```
// Kasteran*
|+ main() -> i32 {
    print("Hello")
    => 0
}
```

```c
int main(int argc, char** argv) {
    kast_init(argc, argv);
    print(string_literal("Hello"));
    return 0;
}
```

## Memory Management

Linear type consumption becomes explicit C memory management:

```
// Kasteran*: free(%! buf)
// Generated C:
void free_buffer(Buffer buf) {
    free(buf.data);
}
```

The compiler verifies at the Kasteran* level that every allocation has a corresponding free.

## Graph

```
graphify {
    KasteranSource -> CBackend
    CBackend -> {TypeTranslate, OpenMPGen, MemManage}
    TypeTranslate -> {StructDef, Typedef, FunctionSig}
    OpenMPGen -> {ParallelFor, Reduction, SIMD}
    MemManage -> {Malloc, Free, MoveSemantics}
}
```

## Function Translation

```
// Kasteran*
|+ add(a: i32, b: i32) -> i32 {
    => a + b
}
```

```c
int32_t add(int32_t a, int32_t b) {
    return a + b;
}
```

## Tail Expression Optimization

Tail expressions (`=>`) become direct `return` statements. The compiler performs tail-call optimization where possible.

## Switch/Match Translation

Pattern matching generates C switch statements:

```c
switch (status) {
    case 200: result = string_literal("OK"); break;
    case 404: result = string_literal("Not Found"); break;
    default:  result = string_literal("Unknown"); break;
}
```

## Example: Complete Translation

```
// Kasteran* source
$$ Vec2 = (x: f32, y: f32)

|+ length(v: Vec2) -> f32 {
    => sqrt(v.x * v.x + v.y * v.y)
}

|+ main() -> i32 {
    v := Vec2(x: 3.0, y: 4.0)
    l := length(v)
    print(l.to_string())
    => 0
}
```

```c
#include "kasteran_runtime.h"

typedef struct {
    float x;
    float y;
} Vec2;

float length(Vec2 v) {
    return sqrtf(v.x * v.x + v.y * v.y);
}

int main(int argc, char** argv) {
    kast_init(argc, argv);
    Vec2 v = { .x = 3.0f, .y = 4.0f };
    float l = length(v);
    print(float_to_string(l));
    return 0;
}
```
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

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
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