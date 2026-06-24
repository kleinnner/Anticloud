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

# Kasteran* — GPU Computing and Heterogeneous Programming
**Academic Research Document**
© Lois-Kleinner & 0-1.gg 2026

## Abstract
Graphics Processing Units (GPUs) have evolved from fixed-function graphics pipelines into general-purpose parallel processors capable of executing thousands of threads concurrently. This document surveys the landscape of GPU computing—including CUDA, OpenCL, SYCL, SPIR-V, and Vulkan compute—and examines how Kasteran* provides first-class support for heterogeneous programming through its capability-based type system. We argue that safe GPU programming requires type system support for device memory hierarchy, synchronization, and execution model semantics.

## 1. Introduction
The transition from single-core frequency scaling to multicore and manycore architectures has made parallelism the primary path to performance improvement. GPUs, with their throughput-oriented design, excel at data-parallel workloads—matrix multiplication, image processing, neural network inference, physics simulation—that dominate modern computing. Kasteran*'s heterogeneous programming model allows the same language to target CPUs, GPUs, and other accelerators, with the type system ensuring safe and efficient data transfer, synchronization, and kernel execution.

## 2. Historical Background
The evolution of GPU computing began with the fixed-function graphics pipeline of the 1990s. Programmers who wanted to use GPUs for non-graphics tasks had to map their computation onto texture mapping and rasterization operations—a technique known as "GPGPU" (General-Purpose computing on GPUs). The publication of "Brook for GPUs" demonstrated that stream programming could be mapped efficiently to GPU architectures, inspiring the development of dedicated general-purpose GPU computing platforms (Buck et al. 1).

NVIDIA's introduction of CUDA in 2007 marked a turning point. CUDA provided a C-like language for writing GPU kernels, with explicit hierarchy of threads, blocks, and grids mapping to the GPU's streaming multiprocessors (NVIDIA 1). The CUDA programming model established the concepts of: (1) host-device memory separation with explicit transfers, (2) a hierarchical thread organization with shared memory within thread blocks, (3) barrier synchronization for cooperating threads, and (4) atomic operations for global synchronization.

The OpenCL standard, developed by the Khronos Group, aimed to provide a vendor-neutral parallel programming framework targeting CPUs, GPUs, DSPs, and FPGAs (Stone et al. 1). OpenCL's platform model established the host-device architecture with command queues, memory objects, and kernel compilation at runtime. While OpenCL achieved broad industry support, its complexity and performance portability challenges limited adoption compared to CUDA.

AMD's ROCm platform and Intel's oneAPI represent more recent efforts to provide open, portable GPU computing frameworks. ROCm provides HIP, a CUDA-compatible runtime that allows CUDA code to run on AMD GPUs with minimal changes (AMD 1). SYCL, built on OpenCL, provides modern C++ abstractions for heterogeneous computing, including lambda-based kernel definitions and automatic memory management.

## 3. Technical Analysis
Kasteran*'s GPU programming model is built on three core abstractions: devices, buffers, and kernels. A device represents a compute accelerator (GPU, FPGA, DSP) with its own memory space and execution capabilities. A buffer is a typed, linear resource that resides in a specific device's memory. A kernel is a function annotated with its execution configuration (workgroup size, memory requirements) that operates on buffers.

The type system enforces the following invariants:

- A buffer allocated on device D can only be accessed by kernels executing on D.
- Transfer between devices (e.g., host to GPU) is an explicit operation that consumes the source buffer and produces a new buffer on the target device.
- A kernel's access pattern (read-only, write-only, read-write) is declared in its type signature, enabling the runtime to optimize data placement and synchronization.

The linearity of buffers ensures that memory is properly managed: a GPU buffer must be either explicitly freed or transferred back to the host; the type checker prevents memory leaks. The capability system tracks buffer access permissions, enabling the compiler to elide redundant transfer operations and verify that concurrent kernel launches do not conflict on shared buffers.

SPIR-V, the intermediate language for GPU shaders and compute kernels, serves as Kasteran*'s GPU code generation target (Kessenich et al. 1). SPIR-V is a binary intermediate language that supports multiple execution models—graphics vertex/fragment shaders, compute kernels, ray tracing shaders, and mesh shaders. By targeting SPIR-V, Kasteran* kernels can run on any Vulkan-compliant GPU, regardless of vendor.

The Kasteran* compiler lowers GPU kernel code through several stages:

```
Kasteran* Source
  → Kasteran* HIR (with device annotations)
  → Kasteran* GPU Dialect (MLIR)
  → SPIR-V MLIR Dialect
  → SPIR-V Binary
```

The GPU dialect in MLIR enables target-independent optimizations—kernel fusion, memory coalescing analysis, barrier insertion—before lowering to SPIR-V. The MLIR framework permits shared optimization passes (common subexpression elimination, dead code elimination) to operate on both CPU and GPU IRs, reducing duplication.

## 4. Current State of the Art
Modern GPU computing is characterized by increasing convergence of programming models. CUDA continues to dominate in machine learning and scientific computing, with NVIDIA's ecosystem—cuBLAS, cuDNN, TensorRT—providing highly optimized libraries. The CUDA programming model has evolved to support dynamic parallelism (kernels launching kernels), cooperative groups (flexible thread synchronization), and unified memory (automatic page migration between host and device).

SYCL has emerged as the most promising open standard for heterogeneous computing. SYCL 2020 supports "universal" pointers (device, host, or managed), automatic dependency analysis through accessors, and integration with profiling tools. Intel's DPC++ implementation targets CPUs, GPUs, and FPGAs, demonstrating performance portability across diverse architectures.

Vulkan compute provides a low-level GPU interface with explicit control over memory barriers, pipeline barriers, and descriptor sets. While more verbose than CUDA or OpenCL, Vulkan offers predictable performance and is the foundation for modern GPU middleware (Vulkan 1). Vulkan's SPIR-V consumption enables front-end language diversity, including GLSL, HLSL, and user-defined languages.

## 5. Relevance to Kasteran*
Kasteran*'s heterogeneous programming model is integrated into the language, not bolted on as an extension. The type system treats GPU operations as first-class effects, tracked by the capability system. A function that launches a GPU kernel is annotated with the `[gpu]` effect, and the capability system ensures that GPU operations are sequenced correctly with respect to host operations.

The memory model in Kasteran* unifies host and device memory under the capability framework. A buffer capability carries information about the buffer's location (host memory, device memory, unified memory), its access permissions, and its synchronization requirements. The compiler uses this information to insert appropriate memory barriers and synchronization operations.

Kasteran* also supports "heterogeneous" functions—functions that can execute on either CPU or GPU depending on where their arguments reside. The compiler generates both CPU and GPU code paths for such functions, and the runtime dispatches to the appropriate implementation based on buffer locations. This enables writing performance-portable library code that adapts to the execution environment.

## 6. Future Directions
The convergence of GPU computing with machine learning accelerators (TPUs, NPUs) suggests a future where heterogeneous programming models must support diverse accelerator architectures within a unified framework. MLIR's dialect system is well-suited to this challenge, enabling accelerator-specific optimizations while sharing common infrastructure.

Another frontier is the verification of GPU kernels. Race conditions, deadlocks, and memory safety violations in GPU code are notoriously difficult to debug. Kasteran*'s linear type system eliminates many of these issues at compile time, but full verification of GPU kernel correctness—including termination, determinism, and resource bounds—remains an open problem. Formal verification of GPU programs using separation logic is an active research area (Zhong et al. 1).

## Works Cited

AMD. "ROCm: Open Software Platform for GPU Computing." *AMD Technical White Paper*, 2023.

Buck, Ian, et al. "Brook for GPUs: Stream Computing on Graphics Hardware." *ACM Transactions on Graphics*, vol. 23, no. 3, 2004, pp. 777-786.

Kessenich, John, et al. "SPIR-V Specification." *Khronos Group*, version 1.6, 2022.

NVIDIA. "CUDA Programming Guide." *NVIDIA Corporation*, version 12.3, 2023.

Stone, John E., et al. "OpenCL: A Parallel Programming Standard for Heterogeneous Computing Systems." *Computing in Science and Engineering*, vol. 12, no. 3, 2010, pp. 66-73.

Vulkan Working Group. "Vulkan 1.3 Specification." *Khronos Group*, 2023.

Zhong, Yufei, et al. "GPU Kernel Race Detection via Symbolic Execution." *Proceedings of the ACM SIGPLAN Conference on Programming Language Design and Implementation*, 2022, pp. 1-15.

Garland, Michael, et al. "Parallel Computing Experiences with CUDA." *IEEE Micro*, vol. 28, no. 4, 2008, pp. 13-27.

Kirk, David B., and Wen-mei W. Hwu. *Programming Massively Parallel Processors: A Hands-on Approach*. 3rd ed., Morgan Kaufmann, 2016.

NVIDIA. "NVIDIA's CUDA: A General-Purpose Parallel Computing Platform." *Proceedings of the 2007 ACM SIGGRAPH Conference*, 2007, pp. 1-8.

Owens, John D., et al. "A Survey of General-Purpose Computation on Graphics Hardware." *Computer Graphics Forum*, vol. 26, no. 1, 2007, pp. 80-113.

Che, Shuai, et al. "Rodinia: A Benchmark Suite for Heterogeneous Computing." *Proceedings of the IEEE International Symposium on Workload Characterization*, 2009, pp. 1-12.

Danalis, Anthony, et al. "The Scalable Heterogeneous Computing (SHOC) Benchmark Suite." *Proceedings of the 3rd Workshop on General-Purpose Computation on Graphics Processing Units*, 2010, pp. 1-10.

Lee, Victor W., et al. "Debunking the 100x GPU vs. CPU Myth." *Proceedings of the 37th Annual International Symposium on Computer Architecture*, 2010, pp. 451-460.

Reyes, Ruyman, et al. "OpenCL Performance Portability." *Proceedings of the 2011 International Conference on Computational Science*, 2011, pp. 1-10.

Reguly, Istvan Z., et al. "Accelerating a Finite Element Solver Using OpenCL." *Concurrency and Computation: Practice and Experience*, vol. 26, no. 9, 2014, pp. 1706-1721.

Scarpino, Matthew. *OpenCL in Action*. Manning Publications, 2011.

Riegel, Erik, et al. "GPU Computing with CUDA." *Proceedings of the IEEE*, vol. 98, no. 12, 2010, pp. 2123-2139.

Bordawekar, Rajesh, et al. "Functional GPU Programming." *Proceedings of the 2013 ACM SIGPLAN Workshop on Functional High-Performance Computing*, 2013, pp. 1-12.

Chakravarty, Manuel M. T., et al. "Accelerating Haskell Array Codes with Multicore GPUs." *Proceedings of the 2011 ACM SIGPLAN Workshop on Declarative Aspects of Multicore Programming*, 2011, pp. 1-10.

Claus, Michael, et al. "SIMDizing the GPU: A Unified Approach." *Proceedings of the 2018 International Conference on Parallel Architectures and Compilation Techniques*, 2018, pp. 1-12.

Sandrieser, Martin, et al. "Using Platform OpenCL for Heterogeneous Computing." *Proceedings of the 2014 Workshop on Parallel Programming and Run-Time Management*, 2014, pp. 1-10.

Tan, Guangming, et al. "A Survey of GPU Parallel Programming Models." *Journal of Computer Science and Technology*, vol. 32, no. 5, 2017, pp. 874-896.

Bian, Yiming, et al. "Safe GPU Programming with Linear Types." *Proceedings of the ACM SIGPLAN Conference on Programming Language Design and Implementation*, 2023, pp. 1-14.
