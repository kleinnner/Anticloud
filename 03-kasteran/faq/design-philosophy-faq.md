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

# Kasteran* — Design Philosophy FAQ
© Lois-Kleinner & 0-1.gg 2026

## Why runes?

Runes provide lightweight concurrency with compile-time safety:

- **Lightweight**: Millions of runes on a single machine
- **Safe**: Type system prevents data races
- **Structured**: Hierarchical cancellation and error handling
- **Efficient**: Nanosecond scheduling overhead

Runes combine the simplicity of Go goroutines with the safety of Rust's ownership model.

## Why linear types?

Linear types provide memory safety without garbage collection:

- **Deterministic cleanup**: Resources are freed when they go out of scope
- **Zero overhead**: No GC pauses or reference counting
- **Guaranteed safety**: No use-after-free, double-free, or resource leaks
- **Simpler than borrow checker**: Linear types are easier to reason about

Linear types make Kasteran* memory-safe while maintaining C-level performance.

## Why VM + native?

Kasteran* uses a hybrid approach:

- **Native compilation**: For maximum performance on CPU, GPU, and FPGA
- **VM runtime**: For debugging, hot reloading, and dynamic scenarios
- **WASM backend**: For browser and edge deployment

The VM is not a bytecode interpreter like Java or Python. It is a lightweight runtime for debugging and development, while production builds compile to native code.

## Why "The Last Programming Language"?

Kasteran* aims to be the last language you need to learn because:

- **Efficiency**: Near C performance with memory safety
- **Sustainability**: Efficient code extends hardware lifespan
- **Versatility**: From embedded to cloud to WASM
- **Simplicity**: Clean syntax with powerful features
- **Longevity**: Designed to remain relevant for decades

The name reflects the goal of creating a language that is so capable and efficient that you never need another.

## Why no garbage collector?

Garbage collection introduces:
- Unpredictable pauses
- Memory overhead (20-30%)
- CPU overhead (10-30%)
- Cache pollution

Kasteran* linear types eliminate the need for GC while providing better performance and predictability.

## Why compile-time optimization?

Compile-time optimization shifts energy cost from every execution (runtime) to a one-time cost (compilation). This is better for:

- **Performance**: More aggressive optimization
- **Energy**: Runtime efficiency
- **Predictability**: No JIT warmup
- **Size**: Smaller binaries

## Conclusion

Kasteran* design choices prioritize safety, performance, and sustainability. Runes, linear types, and hybrid VM/native compilation work together to create a language that is both powerful and efficient.
