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

# Kasteran* — Hardware Abstraction
© Lois-Kleinner & 0-1.gg 2026

## Overview

Kasteran* provides a unified hardware abstraction layer that allows developers to write code that runs efficiently on CPUs, GPUs, TPUs, and FPGAs without requiring new chips. This abstraction is the foundation of the "no more silicon" philosophy — maximizing the value of existing hardware investments.

## The Abstraction Layer

Kasteran* hardware abstraction layer sits between user code and the physical hardware, providing:

- A unified programming model across heterogeneous hardware
- Automatic dispatch to the most appropriate compute unit
- Compile-time specialization for each target architecture
- Runtime optimization based on hardware capabilities

### Architecture Targets

Kasteran* supports compilation to multiple architecture targets:

- **x86-64**: Full support including AVX-512, AVX2, SSE4, and legacy extensions
- **ARM64**: Including NEON, SVE, and Scalable Vector Extensions
- **ARM32**: Legacy ARMv7 support for embedded devices
- **RISC-V**: 64-bit and 32-bit targets
- **WASM**: WebAssembly for browser and edge deployment
- **CUDA**: NVIDIA GPU compute
- **ROCm**: AMD GPU compute
- **OpenCL**: Cross-platform GPU/accelerator compute
- **FPGA**: Via intermediate dataflow representation

## CPU Abstraction

Kasteran* abstracts CPU differences through:

### Instruction Set Abstraction
The compiler generates code that uses the best available instructions for the target CPU:

```
@target(x86-64-v3)  // Requires AVX2, BMI, FMA
fn vector_add(a: [f64], b: [f64]) -> [f64]
```

Multiple code paths can be compiled for different CPU levels, with runtime selection.

### SIMD Abstraction
The compiler automatically vectorizes operations:
- Loop vectorization without explicit intrinsics
- Reduction operations mapped to SIMD
- Gather/scatter optimization
- Masked operations for predicated execution

### Cache Hierarchy Abstraction
The runtime adapts to the cache hierarchy:
- L1, L2, L3 cache sizes detected at startup
- Data layout optimized for cache line size
- Prefetch distance based on cache latency
- NUMA domain awareness

## GPU Abstraction

Kasteran* provides a unified GPU programming model.

### Automatic GPU Dispatch
The compiler can automatically dispatch parallel workloads to the GPU:
- Data-parallel operations on large arrays
- Map, reduce, filter, and scan operations
- Matrix operations and linear algebra
- Image and signal processing

### GPU Memory Management
- Unified memory abstraction with automatic migration
- Explicit control for performance-critical paths
- Zero-copy access where possible
- Stream-based asynchronous execution

### Multi-GPU Support
- Work distribution across multiple GPUs
- Peer-to-peer GPU communication
- Mixed GPU models (NVIDIA + AMD)

## TPU Abstraction

For Tensor Processing Units (TPUs), Kasteran* provides:

- Matrix operation mapping to TPU systolic arrays
- Automatic batching for TPU efficiency
- Mixed precision support (bfloat16, fp16, fp32)
- XLA compilation integration

## FPGA Abstraction

Kasteran* can target FPGAs through:

### Dataflow Graph Mapping
The compiler's intermediate representation (dataflow graph) maps naturally to FPGA fabric:
- Operations map to hardware logic blocks
- Data dependencies determine routing
- Pipeline parallelism maps to FPGA stages
- Memory operations map to block RAM

### High-Level Synthesis
Kasteran* provides high-level synthesis features:
- Algorithmic descriptions compile to hardware
- Pipelining is automatic
- Resource constraints are configurable
- Timing closure is compiler-assisted

## Unified Memory Model

Kasteran* provides a unified memory model across all hardware:

- **Shared virtual memory**: Pointers are valid across CPU, GPU, and accelerators
- **Automatic migration**: Data moves between memory spaces as needed
- **Coherence**: Memory is kept coherent across devices
- **Pinning**: Critical data can be pinned for performance

## Performance Portability

Code written in Kasteran* is performance-portable across hardware:
- The same source code runs efficiently on CPU, GPU, TPU, and FPGA
- The compiler selects the best implementation for each target
- Performance characteristics are predictable across architectures

## Conclusion

Kasteran* hardware abstraction layer enables developers to write once and run efficiently on any existing hardware — CPU, GPU, TPU, or FPGA — without needing new silicon. This abstraction is key to extending the useful life of current hardware and reducing the environmental impact of computing.
