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

# Kasteran* — Rune Reference

© Lois-Kleinner & 0-1.gg 2026

## Overview

Kasteran* is built on exactly **16 runes**. Every construct in the language derives from one or more of these primitive symbols. Runes are the irreducible tokens of the language's grammar.

## Complete Rune Table

| # | Rune | Name | Syntax | Meaning | Example |
|---|------|------|--------|---------|---------|
| 1 | `\|+` | **Definer** | `\|+ name(params) body` | Define a function or entity | `\|+ add(a, b) { a + b }` |
| 2 | `\|:` | **TypeDef** | `\|: TypeName = ...` | Declare a type alias | `\|: Age = i32` |
| 3 | `\|_` | **Matcher** | `\|_ expr { cases }` | Pattern match expression | `\|_ x { 0 => "zero" }` |
| 4 | `\|!` | **CompTime** | `\|! { expr }` | Force compile-time evaluation | `\|! { 2 + 3 }` |
| 5 | `:=` | **ConstBind** | `name := expr` | Immutable constant binding | `pi := 3.14159` |
| 6 | `:~` | **VarBind** | `name :~ expr` | Mutable variable binding | `count :~ 0` |
| 7 | `~>` | **PipeFwd** | `expr ~> fn` | Forward pipe (left-to-right) | `data ~> transform` |
| 8 | `~&` | **Scatter** | `expr ~& fn` | Parallel scatter operation | `arr ~& process` |
| 9 | `=>` | **Arrow** | `params => body` | Lambda / tail expression | `x => x * 2` |
| 10 | `::` | **Access** | `module::name` | Namespace/module access | `std::math::sin` |
| 11 | `$$` | **Struct** | `$$ Name = (field:type)` | Define a struct type | `$$ Point = (x:f32, y:f32)` |
| 12 | `@+` | **Spawn** | `@+ Entity(comp1, comp2)` | Spawn an ECS entity | `@+ Player(Position, Velocity)` |
| 13 | `%*` | **Ptr** | `%* expr` | Pointer creation (linear) | `%* value` |
| 14 | `%!` | **Move** | `%! expr` | Move ownership (consume) | `%! data` |
| 15 | `!@` | **Unsafe** | `!@ expr` | Unsafe memory operation | `!@ deref ptr` |
| 16 | `<>` | **Anchor** | `<> "selector"` | DOM binding anchor | `<> "#app"` |

## Detailed Descriptions

### 1. `|+` — Definer

The foundational rune. Used to define functions, methods, and top-level entities.

```
|+ greet(name: string) -> string {
    "Hello, " + name
}
```

Functions defined with `|+` are first-class values. Tail expressions use `=>` as the body delimiter.

### 2. `|:` — TypeDef

Declares type aliases and named types.

```
|: UserId = i64
|: Matrix = [f32, 128, 128]
```

### 3. `|_` — Matcher

Pattern matching construct. Supports wildcards, literals, and identifier bindings.

```
|_ status {
    200 => "OK"
    404 => "Not Found"
    _   => "Unknown"
}
```

### 4. `|!` — CompTime

Forces compile-time evaluation. Used inside `comptime` blocks for constant folding.

```
result := |! { fibonacci(40) }
```

### 5. `:=` — ConstBind

Binds an immutable name to a value. The value cannot be reassigned.

```
max_size := 1024
```

### 6. `:~` — VarBind

Binds a mutable variable. Can be reassigned with `=`.

```
counter :~ 0
counter = counter + 1
```

### 7. `~>` — PipeFwd

Forward pipe operator. Passes the left operand as the last argument to the right operand.

```
"hello" ~> to_uppercase ~> print
```

Equivalent to `print(to_uppercase("hello"))`.

### 8. `~&` — Scatter

Parallel scatter. Distributes elements across threads/cores.

```
dataset ~& train_model
```

### 9. `=>` — Arrow

Lambda expression separator. Also used for match arms and tail expressions.

```
doubled := arr ~> map(x => x * 2)
```

### 10. `::` — Access

Module path separator. Resolves names through namespaces.

```
use "std/math"
result := math::sin(3.14)
```

### 11. `$$` — Struct

Defines a product type (struct) with named fields.

```
$$ Vec3 = (x: f32, y: f32, z: f32)
origin := Vec3(x: 0.0, y: 0.0, z: 0.0)
```

### 12. `@+` — Spawn

ECS entity creation. Part of the built-in entity component system.

```
@+ Bullet(Position(x: 10, y: 20), Velocity(dx: 5, dy: 0))
```

### 13. `%*` — Ptr

Creates a linear pointer to a value. Subject to linear type consumption rules.

```
ptr := %* value
```

### 14. `%!` — Move

Ownership transfer. Consumes the value at the source location.

```
%! owned_data
```

### 15. `!@` — Unsafe

Unsafe memory access. Bypasses the linear type checker. Use with caution.

```
val := !@ raw_ptr
```

### 16. `<>` — Anchor

DOM anchor for WASM/web bindings. Connects Kasteran* variables to DOM elements.

```
<> "#output"
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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com