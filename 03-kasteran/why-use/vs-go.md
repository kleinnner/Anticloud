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

# Why Choose Kasteran* Over Go
© Lois-Kleinner & 0-1.gg 2026

## The Case for Kasteran* Over Go

Go is a masterclass in simplicity and productivity. Its fast compiles, goroutines, and excellent standard library make it the default choice for cloud-native infrastructure. But Go's design choices — garbage collection, limited type system, no GPU/WASM support — create constraints for certain workloads.

## No Garbage Collector

Go's GC adds latency unpredictability. GC pauses, while improved, remain a concern for real-time systems, game engines, high-frequency trading, and latency-sensitive microservices. GC tuning adds operational complexity.

Kasteran* uses linear types for deterministic memory management. No GC pauses, no tuning, no unpredictability. Memory is freed exactly when the compiler determines it's safe.

**Kasteran* Advantage:** Predictable latency for real-time and performance-critical workloads.

## Linear Types for Safety

Go's type system catches many errors but cannot prevent data races at compile time. The race detector is a runtime tool — it detects races only when they occur during testing. Production data races are still possible.

Kasteran*'s linear types prevent data races at compile time. Shared-nothing parallelism is enforced by the type system. If it compiles, it's race-free.

**Kasteran* Advantage:** Race freedom is provable, not testable.

## WASM as a First-Class Target

Go compiles to WASM, but the WASM support is an afterthought. Binaries include the Go runtime (2MB+ for "hello world"), WASI support is limited, and goroutines require JS helper code. WASM binaries are too large for many edge computing use cases.

Kasteran* has a native WASM backend. Binaries are small (no runtime included), WASI support is complete, and the language features (no GC, linear types) map naturally to WASM's memory model.

**Kasteran* Advantage:** WASM deployment is lean, fast, and production-ready.

## ECS Native

Go is not designed for game development. No ECS support, no SIMD, no GPU compute. Game developers who choose Go must build everything from scratch.

Kasteran* has ECS built into the language — a complete game development framework without external libraries.

**Kasteran* Advantage:** Game development is a first-class use case, not an afterthought.

## Kasteran* Is the Right Choice When:

- GC latency is unacceptable (real-time, trading, games)
- Compile-time data race prevention is valuable
- WASM deployment (browser, edge) is a requirement
- GPU compute is needed alongside server-side logic
- Game development or real-time simulation is the primary domain

## Go Is Still the Right Choice When:

- You're building standard web services, APIs, or cloud infrastructure
- Simplicity and fast compiles are the top priority
- Your team already has deep Go expertise
- You need the mature Go ecosystem (Kubernetes, Docker, Prometheus)
- Go's goroutine model is ideal for your I/O-bound workloads

## The Verdict

Go owns cloud-native infrastructure for good reason. Kasteran* targets the workloads Go cannot handle well: latency-sensitive, GPU-accelerated, ECS-based, and WASM-targeted. For teams building the next generation of performance-critical systems, Kasteran* offers capabilities Go cannot match.
