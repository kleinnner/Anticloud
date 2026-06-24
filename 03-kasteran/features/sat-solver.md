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

# Kasteran* — Algebraic Simplification & Theorem Proving

© Lois-Kleinner & 0-1.gg 2026

## Overview

Kasteran* incorporates a built-in SAT solver and algebraic simplification engine that operates at compile time. This enables the compiler to prove program properties, optimize expressions, and detect unreachable code — all without runtime overhead.

## The 9 Simplification Rules

The algebraic engine applies nine fundamental rewrite rules during compilation:

### Rule 1: Constant Folding

```
|! { 2 + 3 }   =>   5
|! { 4 * 7 }   =>   28
```

### Rule 2: Identity Elimination

```
x + 0   =>   x
x * 1   =>   x
x / 1   =>   x
```

### Rule 3: Zero Annihilation

```
x * 0   =>   0
0 * x   =>   0
```

### Rule 4: Double Negation

```
-(-x)   =>   x
!!x     =>   x
```

### Rule 5: Absorption

```
x + x   =>   2x
x * x   =>   x²
x + x * y   =>   x(1 + y)
```

### Rule 6: Distributive

```
a * (b + c)   =>   (a * b) + (a * c)
(a + b) * c   =>   (a * c) + (b * c)
```

### Rule 7: Boolean Simplification

```
true && x    =>   x
false && x   =>   false
true || x    =>   true
false || x   =>   x
x && x       =>   x
x || x       =>   x
x && !x      =>   false
x || !x      =>   true
```

### Rule 8: Comparison Propagation

```
x == x       =>   true
x != x       =>   false
x < x        =>   false
x >= x       =>   true
```

### Rule 9: Branch Elimination

```
if true  { a } { b }   =>   a
if false { a } { b }   =>   b
```

## Compile-Time Theorem Proving

The SAT solver can prove properties about programs at compile time:

```
|: proven = |! {
    // Prove that (a + b)² == a² + 2ab + b² for all f32
    forall(a: f32, b: f32) {
        (a + b) * (a + b) == a*a + 2.0*a*b + b*b
    }
}
```

When a proof fails, the compiler emits a counterexample:

```
// Error: Counterexample found: a = 1.0, b = 2.0
// Left side:  9.0
// Right side: 13.0
```

## Using `prove` Blocks

The `algebra` subcommand exposes the theorem prover directly:

```
kasteran algebra --prove "forall x: i32 { x * 0 == 0 }"
```

## Graph

```
graphify {
    Expression -> AlgebraicEngine
    AlgebraicEngine -> {Rule1, Rule2, ..., Rule9}
    {Rules} -> SimplifiedExpr
    SimplifiedExpr -> {Constant, EliminatedDeadBranch, ProvedProperty}
}
```

## Example: Optimizing with Simplification

```
|+ clamp(val: f32, min: f32, max: f32) -> f32 {
    result := if val < min { min } { if val > max { max } { val } }
    => result
}

// If val is known at compile time:
|+ clamped_val() -> f32 {
    => clamp(|! { 5.0 }, 0.0, 10.0)   // Simplified to: => 5.0
}
```

The compiler propagates `5.0` through the function, evaluates `5.0 < 0.0` to `false`, evaluates `5.0 > 10.0` to `false`, and reduces the entire expression to `5.0` — zero runtime cost.
</```
