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

# Kasteran* — Modules

© Lois-Kleinner & 0-1.gg 2026

## Importing Modules

Use `use` to import a module:

```
use "std/io"
use "std/math"
use "./helpers/utils"
```

## Using Imported Symbols

Access symbols with `::`:

```
use "std/math"

area := math::pi * r * r
result := math::sin(angle)
```

## Standard Library

```
use "std/io"      // print, read_line, file I/O
use "std/math"    // sin, cos, sqrt, pi
use "std/tensor"  // tensor operations
```

## Creating Modules

A file is a module. Export symbols with `pub`:

```
// helpers/strings.kast
pub |+ trim(s: string) -> string { ... }
pub |+ uppercase(s: string) -> string { ... }
```

## Using Custom Modules

```
use "helpers/strings"

result := strings::trim("  hello  ")
```

## Import Resolution

1. Check `kasteran_modules/` directory
2. Check relative to the current file
3. Check absolute paths

## Example

```
// main.kast
use "std/io"
use "std/math"

|+ main() -> i32 {
    x := 3.14159 / 4.0
    result := math::sin(x)
    io::print("sin(pi/4) = " + result.to_string())
    => 0
}
```
</```
