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
