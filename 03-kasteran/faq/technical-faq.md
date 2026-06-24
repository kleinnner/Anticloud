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

# Kasteran* — Technical FAQ
© Lois-Kleinner & 0-1.gg 2026

## How does the compiler work?

The Kasteran* compiler uses a multi-stage pipeline:

1. **Lexing**: Source code is tokenized
2. **Parsing**: Tokens are parsed into an Abstract Syntax Tree (AST)
3. **HIR (High-Level IR)**: AST is lowered to HIR with type information
4. **Type checking**: The type system verifies types, linearity, and ownership
5. **MIR (Mid-Level IR)**: HIR is lowered to MIR with optimizations
6. **LIR (Low-Level IR)**: MIR is lowered to LIR close to machine code
7. **Code generation**: LIR is compiled to native code, WASM, or other targets

The compiler is self-hosting — the Kasteran* compiler is written in Kasteran* (initially bootstrapped from Rust).

## What backends exist?

Kasteran* supports multiple backends:

| Backend | Target | Maturity |
|---|---|---|
| Native x86-64 | x86-64 machine code | Stable |
| Native ARM64 | ARM64 machine code | Stable |
| Native ARM32 | ARM32 machine code | Beta |
| WASM | WebAssembly | Stable |
| CUDA | NVIDIA GPU | Alpha |
| ROCm | AMD GPU | Alpha |
| FPGA | FPGA bitstream | Research |

## What are linear types?

Linear types ensure that every value is used exactly once. This eliminates common bugs:

- **Use-after-free**: A linear value cannot be used after it is moved
- **Double-free**: A linear value cannot be freed twice
- **Resource leaks**: A linear value must be consumed or explicitly discarded

Linear types enable deterministic memory management without garbage collection, providing memory safety with zero runtime overhead.

Example:
```
let file = File::open("data.txt")
// file is a linear resource
let contents = file.read()
// file is consumed by read()
// file cannot be used after this point
```

## How does rune-based concurrency work?

Runes are lightweight concurrent execution units scheduled by the Kasteran* runtime.

```
fn main() {
    let rune1 = rune process_data(data1)
    let rune2 = rune process_data(data2)
    let results = await(rune1, rune2)
}
```

Runes are multiplexed onto OS threads using a work-stealing scheduler. Communication between runes uses channels with compile-time type checking.

## What is the memory model?

Kasteran* uses a region-based memory model:

- **Stack**: Local variables are allocated on the stack
- **Heap**: Dynamic allocations use linear types for safety
- **Regions**: Related allocations are grouped for efficient deallocation

There is no garbage collector. Memory is freed deterministically when values go out of scope.

## How are errors handled?

Kasteran* uses a result type for recoverable errors:
```
let result = fallible_function()
match result {
    Ok(value) => process(value),
    Err(error) => handle_error(error)
}
```

Panics are used for unrecoverable errors and abort the program.

## Does Kasteran* have FFI?

Yes, Kasteran* supports Foreign Function Interface (FFI) to call C libraries:

```
#[foreign(c)]
fn printf(format: *const u8) -> i32
```

## Conclusion

Kasteran* technical design combines a multi-stage compiler, multiple backends, linear types, and rune-based concurrency to deliver safety and performance.
