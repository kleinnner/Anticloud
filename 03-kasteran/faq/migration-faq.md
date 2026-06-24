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

# Kasteran* — Migration FAQ
© Lois-Kleinner & 0-1.gg 2026

## From Python

### Why migrate from Python to Kasteran*?
- **Performance**: 10-100x speedup for compute-heavy code
- **Type safety**: Catch errors at compile time
- **Concurrency**: Better parallelism with runes
- **Deployment**: Single binary, no interpreter needed

### How do I handle dynamic typing?
Kasteran* is statically typed. Use `Optional<T>` for nullable values and `Any` type for truly dynamic scenarios.

### What about Python libraries?
Kasteran* has FFI to call C libraries and a `#[python]` attribute for Python interop.

### Migration strategy
1. Identify performance-critical Python code
2. Rewrite in Kasteran* with same interface
3. Integrate via FFI or interop
4. Gradually migrate to native Kasteran*

## From Rust

### Why migrate from Rust to Kasteran*?
- **Simpler type system**: Linear types are easier to reason about than borrow checker
- **Faster compile times**: 20-40% faster compilation
- **Built-in concurrency**: Runes instead of async/await or libraries
- **Smaller binaries**: 10-20% smaller

### How do I handle the borrow checker?
Kasteran* linear types provide similar guarantees with a simpler model. Instead of tracking lifetimes, values are consumed and moved.

### What about Rust's ecosystem?
Kasteran* ecosystem is smaller but growing. FFI to Rust libraries is possible.

## From C

### Why migrate from C to Kasteran*?
- **Memory safety**: Eliminate buffer overflows, use-after-free, etc.
- **Productivity**: Modern language features (generics, pattern matching)
- **Portability**: Compile to multiple targets from the same source

### How do I interface with C code?
Kasteran* FFI makes calling C libraries straightforward. You can migrate incrementally.

## From JavaScript

### Why migrate from JavaScript to Kasteran*?
- **Performance**: 10-50x faster for compute workloads
- **Type safety**: Earlier error detection
- **Concurrency**: True parallelism vs event loop
- **Tooling**: Better IDE support with types

### What about npm?
Kasteran* uses its own package manager. WASM output can integrate with JavaScript applications.

## Conclusion
Migration to Kasteran* offers significant performance and safety benefits. Incremental migration is possible through FFI and interop features.
