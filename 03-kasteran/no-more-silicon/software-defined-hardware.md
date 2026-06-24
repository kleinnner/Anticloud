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

# Kasteran* — Software-Defined Hardware
© Lois-Kleinner & 0-1.gg 2026

## Overview

Software-defined hardware is the concept that hardware capabilities can be delivered and modified through software rather than through physical changes. Kasteran* embodies this principle by generating optimal machine code for existing instruction set architectures (ISAs), effectively defining the hardware's behavior through software.

## The Software-Defined Approach

In a software-defined hardware paradigm:

- **Hardware is fixed**: The ISA, microarchitecture, and physical capabilities are static
- **Software defines behavior**: The compiler and runtime determine how hardware is used
- **Optimization is continuous**: Software improvements deliver hardware-level gains
- **New features come via software**: Capabilities improve without silicon changes

## Compiler-Generated Machine Code

Kasteran* compiler generates machine code optimized for the specific target ISA.

### Instruction Selection
The compiler selects optimal instructions for each operation:

```
// Source: a + b * c
// x86-64: VFMADD231SD (fused multiply-add)
// ARM64: FMLA (fused multiply-add)
// RISC-V: FMADD (fused multiply-add)
```

### Register Allocation
The compiler performs optimal register allocation:
- Graph coloring for register assignment
- Spill code minimization
- Register renaming for out-of-order execution
- Caller/callee save optimization

### Instruction Scheduling
Instructions are ordered for optimal pipeline utilization:
- Dependency analysis for hazard avoidance
- Software pipelining for loop throughput
- Instruction bundling for VLIW-like targets
- Micro-operation fusion for modern x86

## Machine Code Optimization

Kasteran* applies extensive optimizations to the generated machine code.

### Control Flow Optimization
- Branch prediction hints
- Profile-guided optimization for branch layout
- Hot/cold code splitting
- Jump table optimization for switches

### Memory Access Optimization
- Address generation interlock avoidance
- Store-to-load forwarding optimization
- Memory disambiguation
- Cache line prefetch insertion

### Vectorization
- Automatic SIMD code generation
- Loop vectorization with runtime alignment checks
- Superword-level parallelism extraction
- SIMD register rotation for reduction

## ISA-Level Specialization

The compiler generates code for specific ISA extensions:

### x86-64 Variants
- **baseline**: x86-64-v1 (SSE2, CMPXCHG16B)
- **v2**: x86-64-v2 (SSE4.2, POPCNT)
- **v3**: x86-64-v3 (AVX2, BMI, FMA)
- **v4**: x86-64-v4 (AVX-512)

### ARM Variants
- **ARMv8.0-A**: Baseline AArch64
- **ARMv8.2-A**: Dot product, half-precision
- **ARMv8.6-A**: I8MM, BF16, SVE2
- **ARMv9-A**: SVE2, SME

## Runtime Code Generation (JIT)

For workloads that benefit from runtime adaptation, Kasteran* supports JIT compilation:

- **Profile-guided recompilation**: Hot code is recompiled with runtime profiles
- **Adaptive optimization**: Code adapts to runtime conditions
- **Deoptimization**: Safe rollback when assumptions change

## Hardware Capabilities Discovery

Kasteran* discovers hardware capabilities at runtime:

```
fn detect_capabilities() -> HardwareCapabilities {
    // CPUID (x86), /proc/cpuinfo (Linux), sysctl (macOS)
    // Returns: SIMD level, cache sizes, core count, features
}
```

This information guides code generation and dispatch decisions.

## Security Through Software

Software-defined hardware enables security improvements without hardware changes:

- **Spectre/Meltdown mitigations**: Compiler inserts LFENCE, DSB SYNC
- **Constant-time code**: Cryptographic operations are constant-time
- **Control flow integrity**: Indirect branch targets validated
- **Shadow stack**: Return address protection (where hardware support exists)

## Performance Results

Software-defined hardware delivers substantial gains:

| Optimization | Gain | Source |
|---|---|---|
| SIMD vectorization | 2-8x | Compiler auto-vectorization |
| Instruction scheduling | 10-30% | Better pipeline utilization |
| Register allocation | 5-15% | Reduced spill code |
| Profile-guided optimization | 10-40% | Better branch prediction |
| Cache optimization | 20-50% | Reduced cache misses |

## Conclusion

Kasteran* software-defined hardware approach means that existing silicon can deliver new capabilities and improved performance through software alone. The compiler generates optimal machine code for each target ISA, extracting maximum performance from existing hardware without requiring new chips.
