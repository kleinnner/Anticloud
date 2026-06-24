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

# Kasteran* — Standard Library

© Lois-Kleinner & 0-1.gg 2026

## Overview

The Kasteran* standard library is located in `kasteran_modules/std/`. It provides essential functions for I/O, mathematics, and tensor operations.

## `std/io` — Input/Output

```
use "std/io"
```

| Function | Description |
|----------|-------------|
| `print(s: string)` | Print to stdout |
| `println(s: string)` | Print with newline |
| `read_line() -> string` | Read a line from stdin |
| `read_file(path: string) -> string` | Read file contents |
| `write_file(path: string, data: string)` | Write to file |

## `std/math` — Mathematics

```
use "std/math"
```

| Function | Description |
|----------|-------------|
| `sin(x: f64) -> f64` | Sine |
| `cos(x: f64) -> f64` | Cosine |
| `sqrt(x: f64) -> f64` | Square root |
| `abs(x: f64) -> f64` | Absolute value |
| `pow(x: f64, n: f64) -> f64` | Power |
| `exp(x: f64) -> f64` | Exponential |
| `log(x: f64) -> f64` | Natural logarithm |

| Constant | Value |
|----------|-------|
| `math::pi` | 3.141592653589793 |
| `math::e` | 2.718281828459045 |

## `std/tensor` — Tensors

```
use "std/tensor"
```

| Function | Description |
|----------|-------------|
| `zeros(shape) -> Tensor` | Create zero-filled tensor |
| `ones(shape) -> Tensor` | Create one-filled tensor |
| `uniform(shape, low, high) -> Tensor` | Random uniform |
| `matmul(a, b) -> Tensor` | Matrix multiplication |

## `std/ecs` — ECS Utilities

```
use "std/ecs"
```

| Function | Description |
|----------|-------------|
| `entity_count() -> i64` | Number of entities |
| `has_component(entity, component) -> bool` | Check component |

## Example

```
use "std/io"
use "std/math"

|+ main() -> i32 {
    io::print("Enter a number: ")
    input := io::read_line()
    n := input.parse_f64()
    result := math::sqrt(n)
    io::print("Square root: " + result.to_string())
    => 0
}
```
</```
