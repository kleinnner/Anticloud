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
