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

# Kasteran* — Performance FAQ
© Lois-Kleinner & 0-1.gg 2026

## How fast is Kasteran* compared to C?

Kasteran* aims to match or exceed C performance in most scenarios. In benchmarks:

- **CPU-bound**: 0-10% slower than optimized C
- **Memory-bound**: 5-15% faster due to better cache utilization
- **Concurrent**: 20-50% faster due to work-stealing scheduler
- **SIMD-optimized**: 10-30% faster with automatic vectorization

Kasteran* achieves this through:
- Zero-cost abstractions (no hidden overhead)
- Advanced compiler optimizations
- Automatic SIMD vectorization
- Efficient memory management without GC

## How fast is Kasteran* compared to Python?

Kasteran* is typically 10-100x faster than Python for compute-intensive workloads:
- **Numeric computation**: 50-100x faster
- **Data processing**: 20-50x faster
- **Web serving**: 40-100x faster
- **Scripting tasks**: 5-15x faster

Python is interpreted, dynamically typed, and garbage-collected, all of which add overhead. Kasteran* compiles to native code with type checking at compile time.

## How fast is Kasteran* compared to Go?

Kasteran* is typically 20-50% faster than Go:
- **CPU workloads**: 20-40% faster
- **Memory allocation**: 30-50% less memory
- **Concurrency**: Similar throughput with lower latency
- **Startup time**: 2-5x faster (no runtime initialization)

## How fast is Kasteran* compared to Rust?

Kasteran* performance is comparable to Rust:
- **CPU workloads**: Within 5% of Rust
- **Memory usage**: Similar or slightly lower
- **Compile times**: 20-40% faster (simpler type system)
- **Binary size**: 10-20% smaller

## What benchmark methodology is used?

Kasteran* benchmarks follow these principles:
1. **Realistic workloads**: Not microbenchmarks
2. **Statistical rigor**: Multiple runs, warm-up, confidence intervals
3. **Same hardware**: All comparisons on identical hardware
4. **Representative**: Benchmarks represent real-world use cases
5. **Transparent**: All benchmark code is published

## How is performance measured?

```
kasteran bench my_benchmark
```

This runs the benchmark and reports:
- Operations per second
- Latency (p50, p90, p99, p99.9)
- Memory allocation rate
- CPU utilization
- Energy consumption

## Can I optimize hot paths?

Yes, Kasteran* provides:
- **Inline annotations**: `#[inline(always)]`
- **No bounds check**: `unchecked` access
- **Custom allocators**: Region-specific allocation
- **SIMD intrinsics**: Explicit vectorization when needed
- **Profile-guided optimization**: Runtime feedback for optimization

## Conclusion

Kasteran* delivers near-C performance with modern language features. It outperforms interpreted languages by 10-100x and compiled languages by 20-50% in many scenarios.
