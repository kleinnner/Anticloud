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

# Kasteran* — Known Limitations
© Lois-Kleinner & 0-1.gg 2026

## Current Limitations

This document lists known limitations in the current version of Kasteran* (v0.5.0). These are actively being addressed in future releases.

## No LLVM Backend

Kasteran* does not yet have an LLVM-based backend. The available backends are:

| Backend | Status | Maturity |
|---------|--------|----------|
| Bytecode VM | ✅ Complete | Stable |
| C Backend | ✅ Complete | Stable |
| WASM Backend | ✅ Complete | Stable |
| Cranelift JIT | ✅ Complete | Beta |
| LLVM | ❌ Not implemented | — |

**Impact:** Programs compiled with the C backend depend on an external C compiler. Cranelift JIT is fast but does not match LLVM's optimization pipeline.

**Workaround:** Use the C backend with `-O2` for production builds. The Cranelift JIT is suitable for most interactive use cases.

## No Self-Hosting

Kasteran* cannot compile itself. The compiler is written in Rust, not Kasteran*.

**Impact:** Bootstrapping is not possible. New Kasteran* features require Rust changes to the compiler.

**Workaround:** The Rust codebase is designed to be approachable. See the [Developer Guide](../developers/architecture.md) for contributing.

## Single-Threaded Bytecode VM

The bytecode VM executes all code on a single thread. Parallelism is only available through the C backend with OpenMP.

**Impact:** Bytecode VM performance does not scale with CPU cores.

**Workaround:** Use the C backend with `--openmp` for parallel workloads. The JIT backend also executes single-threaded but benefits from native code generation.

## Limited String Manipulation

String operations are limited to concatenation, comparison, and length checks. There is no regex support or advanced string formatting built-in.

**Impact:** Text processing requires C interop or manual character-level operations.

**Workaround:** Use the C backend and include C string libraries via FFI. See [Workarounds](./workarounds.md).

## No Garbage Collector

Memory management is entirely linear/affine. There is no garbage collector or reference counting.

**Impact:** Cyclic data structures (graphs, doubly-linked lists) are difficult to express without explicit `unsafe` pointer handling.

**Workaround:** Use arena allocation patterns or `Pointer` types with manual lifetime tracking.

## No Dynamic Dispatch

Kasteran* does not support trait objects, virtual methods, or dynamic dispatch. All function calls are statically resolved.

**Impact:** Polymorphic code requires compile-time generics or function pointers.

**Workaround:** Use `match` expressions on enum types for type-based dispatch, or use function pointers for callbacks.

## Limited FFI

Foreign Function Interface supports only C ABI functions. There is no direct support for C++ or Rust ABI.

**Impact:** Interop with non-C libraries requires wrapper code.

**Workaround:** Write C-compatible wrapper functions around the target library.

## No Debugger

Kasteran* has no debugger integration. The only debugging tools are:
- `kasteran run --debug` for VM instruction tracing
- `print()` statements
- The LSP diagnostics

**Impact:** Debugging complex programs requires manual instrumentation.

**Workaround:** Use the LSP for static analysis and `print()` debugging for dynamic issues.

## No Package Registry

There is no central package registry for Kasteran*. Packages are shared via Git URLs or local paths.

**Impact:** Discovering and sharing packages requires manual coordination.

**Workaround:** Use GitHub/GitLab for package hosting. Add packages via `kasteran add --git <url>`.

## No Incremental Compilation

The compiler always processes all files from scratch. There is no incremental compilation cache.

**Impact:** Compilation time scales linearly with project size.

**Workaround:** For large projects, use the C backend which delegates optimization to the C compiler's incremental build system (Make/CMake).

## Platform-Specific Limitations

### Windows
- Long path support requires registry change
- MSVC build tools required for C backend
- Cranelift JIT has limited SEH support

### macOS
- Cranelift JIT requires hardened runtime exception entitlement
- C backend links against system libraries (may cause compatibility issues)

### Linux
- glibc version must be >= 2.31 for Cranelift
- musl targets may need statically linked binaries

## Future Roadmap

| Feature | Target Version | Status |
|---------|---------------|--------|
| LLVM Backend | 0.6.0 | Planning |
| Incremental Compilation | 0.6.0 | Design |
| Package Registry | 0.7.0 | Planning |
| Debugger | 0.8.0 | Research |
| Self-Hosting | 1.0.0 | Long-term |
