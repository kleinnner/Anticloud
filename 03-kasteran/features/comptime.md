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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
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