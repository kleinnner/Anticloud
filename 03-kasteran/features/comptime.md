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

# Kasteran* — Compile-Time Execution

© Lois-Kleinner & 0-1.gg 2026

## Overview

Kasteran* supports compile-time evaluation via the `|!` rune. Any expression within a `|!` block is evaluated during compilation, not at runtime. This enables constant folding, algebraic simplification, and advanced metaprogramming.

## Basic Usage

```
result := |! { 2 + 3 }
// result is the constant 5 at compile time
```

## Constant Folding

Arithmetic on constants is performed entirely at compile time:

```
|+ circle_area(radius: f64) -> f64 {
    pi := |! { 3.1415926535 }
    => pi * radius * radius
}
```

## Compile-Time Functions

Pure functions can be called within `|!` blocks:

```
|+ factorial(n: i64) -> i64 {
    => if n <= 1 { 1 } { n * factorial(n - 1) }
}

table := |! {
    [factorial(0), factorial(1), factorial(2), factorial(3), factorial(4)]
}
// table == [1, 1, 2, 6, 24]
```

## Algebraic Collapse

The compiler applies the 9 simplification rules within `|!` blocks:

```
simplified := |! {
    x := 10
    y := 20
    (x + y) * (x - y) + x * x
}
// Evaluated: (30) * (-10) + 100 = -200
```

## Compile-Time Conditionals

```
|: DEBUG = |! { true }

|+ log(msg: string) {
    if |! { DEBUG } {
        print("[DEBUG] " + msg)
    }
}
// The `if` branch is eliminated at compile time when DEBUG is false
```

## Compile-Time ECS Queries

ECS queries can be validated at compile time:

```
@~ MovementSystem : Position, Velocity {
    |+ run(pos: Position, vel: Velocity, dt: f32) {
        // Compiler verifies Position and Velocity components exist
    }
}
```

## Compile-Time Gradients

Auto-differentiation can be performed at compile time:

```
df := |! { grad(f) }
// df is fully computed at compile time
```

## Performance Benefits

1. **Zero-cost abstractions**: High-level constructs are lowered to efficient runtime code
2. **Dead code elimination**: Branches with compile-time-constant conditions are eliminated
3. **Loop unrolling**: Loops over compile-time ranges are unrolled
4. **Constant propagation**: Constants propagate through the entire program

## Graph

```
graphify {
    |! { expr } -> CompileTimeEval
    CompileTimeEval -> {ConstantFolder, AlgebraSimplifier, DeadBranchElim}
    ConstantFolder -> {ArithFold, FuncEval, TableGen}
    AlgebraSimplifier -> {9Rules, IdentityElim, ZeroAnnihilate}
    DeadBranchElim -> {IfElim, MatchElim}
    Result -> RuntimeCode (smaller, faster)
}
```

## Example: Compile-Time Lookup Table

```
|+ build_sin_table() -> [f32, 360] {
    table :~ [f32, 360].zeros()
    i := 0
    while i < 360 {
        table[i] = sin(i * 3.14159 / 180.0)
        i = i + 1
    }
    => table
}

sin_table := |! { build_sin_table() }
// 360 sin() computations moved to compile time
```

## Restrictions

- Only pure functions can be called in `|!` blocks
- No side effects (I/O, mutable globals, random)
- No `!@` unsafe operations
- No FFI calls
- No dynamic dispatch

## Error Messages

If a `|!` block cannot be evaluated (e.g., calls an impure function), the compiler emits:

```
Error: Cannot evaluate expression at compile time
  --> program.kast:5:17
   |
 5 | result := |! { read_file("data.txt") }
   |            ^^^^^^^^^^^^^^^^^^^^^^^^^^^
   = note: `read_file` is not a pure function
```
</```
