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

# Why Choose Kasteran* Over Zig
© Lois-Kleinner & 0-1.gg 2026

## The Case for Kasteran* Over Zig

Zig is a pragmatic systems language with excellent C interop, comptime, and a minimal runtime. It shares Kasteran*'s contempt for hidden control flow and C++ complexity. The key difference: Zig trusts the programmer with manual memory management; Kasteran* provides automatic memory safety through linear types.

## Memory Calculus vs Manual Allocators

Zig requires manual memory management. Every allocation takes an explicit allocator parameter. `defer` provides RAII-like cleanup, but the programmer is ultimately responsible for correct memory handling. Memory bugs — use-after-free, double-free, leaks — are possible at runtime.

Kasteran* implements memory calculus: the compiler automatically determines lifetimes through linear type analysis. No manual allocators, no `defer`, no risk of memory bugs. The compiler handles what Zig leaves to the programmer.

**Kasteran* Advantage:** Memory safety without manual management. The compiler ensures correctness in Kasteran*; Zig depends on programmer vigilance.

## Auto-Free

Zig's `defer` is cleaner than C's manual cleanup, but it's still manual: every allocation must be paired with a `defer` deallocation. This is error-prone in complex code paths (early returns, error handling, conditional allocation).

Kasteran* automatically frees values when they go out of scope, as determined by the linear type system. No explicit deallocation code is needed. The compiler inserts free operations at the correct points.

**Kasteran* Advantage:** Less code, fewer bugs. Automatic memory management without GC overhead.

## Built-in ECS

Zig has no ECS support. Game development in Zig requires building ECS infrastructure from scratch or using the limited C ecosystem.

Kasteran* has ECS built-in: component declarations, system queries, automatic SOA layout. Game engine development is a first-class use case, not an afterthought.

**Kasteran* Advantage:** Game developers can use Kasteran* out of the box for ECS-based projects. Zig requires significant custom infrastructure.

## Broader Backend Support

Zig targets native code (via LLVM) and WASM (via LLVM). No GPU backend.

Kasteran* targets C, WASM, and GPU (CUDA, ROCm, Metal). The multi-backend architecture includes a dedicated GPU backend for compute workloads.

**Kasteran* Advantage:** GPU compute is a first-class compilation target, not an afterthought.

## Kasteran* Is the Right Choice When:

- Memory safety is a priority (compliance, security-critical systems)
- You want automatic memory management without GC
- Game development (ECS) is part of your project
- GPU compute is needed alongside systems code
- You prefer compile-time guarantees over runtime checks

## Zig Is the Right Choice When:

- You need maximum control over memory allocation behavior
- C interop is the primary use case (Zig's C import is excellent)
- Manual memory management is acceptable for your domain
- You're building on Linux/embedded (Zig's cross-compilation is best-in-class)
- Comptime metaprogramming is the primary feature you need

## The Verdict

Zig is C++ done right — a better C that doesn't add safety overhead. Kasteran* is a step beyond, adding automatic memory safety and broader domain support. For projects where memory safety is critical (government, finance, autonomous systems), Kasteran* is the clear choice. For projects where allocator control and C interop are paramount, Zig remains strong.
