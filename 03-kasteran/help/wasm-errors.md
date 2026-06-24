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

# Kasteran* — WASM Errors
© Lois-Kleinner & 0-1.gg 2026

## Overview

WASM-related errors occur during WebAssembly code generation or WAT validation. These typically involve type mapping issues, memory management, or WASI integration.

## WASM Error Format

```
error[W001]: WASM emission error
  --> <file>:<line>:<column>
  |
  = note: <error details>
```

## WAT Validation Errors (W001)

```
error[W001]: WAT validation error
  |
  = note: expected f32, got i32 at position 42:15
```

**Cause:** The generated WAT text did not pass validation. This is typically a compiler backend bug where type mappings are incorrect.

**Fix:** Report the issue with the source code. As a workaround, use a different backend:

```
kasteran build --backend c
```

## Unsupported Type (W002)

```
error[W002]: Unsupported type for WASM
  --> src/main.ka:5:9
  |
5 |     let x: I128 = 42;
  |         ^ type I128 is not supported in WASM target
```

**Cause:** Kasteran* types that have no WebAssembly equivalent cannot be compiled to WASM. `I128`, `F64` (on some targets), and complex struct types may be unsupported.

**Fix:** Use types that map to WASM primitives:

```ka
let x: I64 = 42;   // I128 -> I64
let y: F32 = 3.14; // F64 -> F32 (if F64 unavailable)
```

## Memory Exhaustion (W003)

```
error[W003]: WASM memory page limit exceeded
  |
  = note: required 1234 pages, maximum is 65536
```

**Cause:** The generated WASM module requires more memory pages than the WebAssembly specification allows.

**Fix:** Reduce static data size, use dynamic allocation, or split the module.

## WASI Initialization Failure (W004)

```
error[W004]: WASI initialization failed
  |
  = note: fd_write not imported
```

**Cause:** The WASM runtime does not provide the required WASI imports.

**Fix:** Use a WASI-compatible runtime:

```
# Node.js with WASI support
node --experimental-wasi-unstable-preview1 output.wasm

# wasmtime
wasmtime output.wasm

# wasmer
wasmer run output.wasm
```

## Export Conflict (W005)

```
error[W005]: Duplicate WASM export
  |
  = note: function 'main' exported twice
```

**Cause:** Two functions with the same name are both marked `pub`, causing duplicate WASM exports.

**Fix:** Rename or deduplicate exports:

```ka
// Only export distinct names
pub fn main() { ... }
// pub fn main() { ... } // Remove or rename
```

## Function Table Overflow (W006)

```
error[W006]: WASM function table overflow
  |
  = note: maximum 1000000 function entries exceeded
```

**Cause:** Too many functions in a single WASM module.

**Fix:** Split the module into smaller parts or inline small functions.

## Debugging WASM Output

### Step 1: Inspect the WAT

```
kasteran build --backend wasm --emit-wat
```

This outputs the `.wat` file alongside the `.wasm` binary.

### Step 2: Validate Manually

```
wat2wasm output.wat --verbose
```

### Step 3: Check with wasm-validate

```
wasm-validate output.wasm
```

## Type Mapping Reference

| Kasteran* | WebAssembly |
|-----------|-------------|
| F32       | f32         |
| F64       | f64         |
| I32, U32  | i32         |
| I64, U64  | i64         |
| Bool      | i32 (0 or 1)|
| String    | i32 (pointer) + i32 (length) |
| Pointer   | i32         |
| Array     | i32 (pointer) |
| Struct    | i32 (pointer) |

## WASI Imports Required

For I/O operations, the WASM module requires these WASI imports:

```wat
(import "wasi_unstable" "fd_write" (func $fd_write (param i32 i32 i32 i32) (result i32)))
(import "wasi_unstable" "fd_close" (func $fd_close (param i32) (result i32)))
(import "wasi_unstable" "fd_read" (func $fd_read (param i32 i32 i32 i32) (result i32)))
```
