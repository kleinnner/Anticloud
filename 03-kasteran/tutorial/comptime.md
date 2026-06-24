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

## What is Compile-Time Execution?

The `|!` rune evaluates code during compilation, not at runtime. This eliminates runtime computation for constant expressions.

## Basic Example

```
result := |! { 2 + 3 }
// result is the constant 5
// No addition happens at runtime
```

## Performance Optimization

Move expensive computations to compile time:

```
// Without comptime — runs every time
|+ slow_calc() -> i32 {
    => fibonacci(40)
}

// With comptime — computed once at compile time
|+ fast_calc() -> i32 {
    => |! { fibonacci(40) }
}
```

## Constant Propagation

Constants propagate through the program:

```
size := |! { 1024 * 1024 }  // 1048576
buffer := [u8, size].zeros()
// Compiler knows exact size at compile time
```

## Compile-Time Conditions

```
|: DEBUG = |! { false }

|+ log(msg: string) {
    if |! { DEBUG } {
        print("[DEBUG] " + msg)
    }
}
// The if branch is eliminated — zero runtime overhead
```

## Restrictions

- Only pure functions allowed in `|!` blocks
- No I/O, no random, no FFI
- No mutable globals

## Example

```
|+ factorial(n: i64) -> i64 {
    => if n <= 1 { 1 } { n * factorial(n - 1) }
}

|+ main() -> i32 {
    // 10! computed at compile time
    fact := |! { factorial(10) }
    print("10! = " + fact.to_string())
    => 0
}
```
</```
