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

# Kasteran* — Technical Requirements Document
© Lois-Kleinner & 0-1.gg 2026

## Introduction

This Technical Requirements Document (TRD) specifies the system architecture, performance targets, platform requirements, and technical constraints for the Kasteran* programming language and its toolchain.

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Kasteran* Compiler (kasteran)                 │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  ┌───────────────┐  │
│  │  Lexer  │→ │  Parser  │→ │ Type      │→ │ Linear Type   │  │
│  │         │  │          │  │ Checker   │  │ Checker       │  │
│  └─────────┘  └──────────┘  └───────────┘  └───────────────┘  │
│                                            ↓                    │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  ┌───────────────┐  │
│  │ Code    │← │ Optimizer│← │ IR Gen    │← │ Lifetime      │  │
│  │ Gen     │  │          │  │           │  │ Inference     │  │
│  └─────────┘  └──────────┘  └───────────┘  └───────────────┘  │
│       ↓                                                         │
│  ┌──────────┐                                                    │
│  │ LLVM IR  │ → Native / WASM / C ABI                          │
│  └──────────┘                                                    │
└─────────────────────────────────────────────────────────────────┘
```

### Runtime Architecture

Kasteran* has minimal runtime. The runtime layer provides:

- Task scheduler (work-stealing thread pool)
- Async runtime (epoll/kqueue/IOCP-based)
- Memory allocator interface
- Signal handler for graceful shutdown
- Observability bus (metrics, tracing, logging)

## Performance Targets

### Compilation Performance

| Metric | Target | Stretch Goal |
|--------|--------|--------------|
| Compile time (1KLOC) | < 200ms | < 100ms |
| Compile time (10KLOC) | < 2s | < 1s |
| Compile time (100KLOC) | < 20s | < 10s |
| Incremental compile (small change) | < 100ms | < 50ms |
| Memory usage during compile (50KLOC) | < 512MB | < 256MB |

### Runtime Performance

| Metric | Target | Stretch Goal |
|--------|--------|--------------|
| HTTP throughput (simple handler) | 50,000 req/s/core | 100,000 req/s/core |
| HTTP P99 latency | < 5ms | < 2ms |
| Memory usage (idle HTTP server) | < 5MB | < 2MB |
| Binary size (minimal HTTP server) | < 2MB | < 1MB |
| Startup time (cold) | < 20ms | < 5ms |
| Context switch cost | < 100ns | < 50ns |
| Allocation throughput | 10M alloc/s/core | 20M alloc/s/core |

### Tooling Performance

| Tool | Performance Target |
|------|-------------------|
| LSP (code completion) | < 50ms response time |
| Formatter (10KLOC file) | < 200ms |
| Linter (10KLOC file) | < 500ms |
| Test runner (warm cache) | < 1s for 1000 tests |
| Package download + build | < 2s for avg dependency |

## Supported Platforms

### Tier 1 (Guaranteed)

| Platform | Architecture | Min Version |
|----------|-------------|-------------|
| Linux (glibc) | x86_64, aarch64 | glibc 2.31+ |
| Linux (musl) | x86_64, aarch64 | musl 1.2+ |
| macOS | x86_64, arm64 | macOS 12+ |
| Windows | x86_64 | Windows 10+ |

### Tier 2 (Best Effort)

| Platform | Architecture | Notes |
|----------|-------------|-------|
| FreeBSD | x86_64, aarch64 | Tier 1 by Q4 2027 |
| WebAssembly | WASI | Browser and server-side |
| Linux (RISC-V) | riscv64 | In progress |
| Android | aarch64 | NDK support |

## System Requirements

### Development Machine

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 cores | 8+ cores |
| RAM | 4 GB | 16 GB |
| Disk | 1 GB free | 10 GB free (SSD) |
| OS | Linux, macOS, Windows | Latest stable |

### Production Runtime

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 1 core | 4+ cores |
| RAM | 64 MB | 512 MB |
| Disk | 10 MB (binary) | 100 MB (logs, caches) |
| Network | Any | 1 Gbps |

## Technical Constraints

### Language Constraints

| Constraint | Rationale |
|------------|-----------|
| No undefined behavior in safe code | Memory safety guarantee |
| No garbage collection by default | Predictable performance |
| Linear types for all resource types | Deterministic resource cleanup |
| Pattern matching must be exhaustive | No runtime match failures |
| No implicit type conversions | Type safety |
| Immutable by default | Concurrency safety |

### Compiler Constraints

| Constraint | Rationale |
|------------|-----------|
| LLVM backend required | No self-hosting initially |
| Incremental compilation support | Developer productivity |
| LSP protocol support | IDE integration |
| Deterministic builds | Reproducible artifacts |

## Interoperability Requirements

### C ABI

```kasteran
#[no_mangle]
pub extern "C" fn kasteran_function(input: i32) -> i32

// C headers generated automatically
kasteran build --generate-headers
```

### Foreign Function Interface

```kasteran
extern "C" {
    fn printf(format: *const u8, ...) -> i32
    fn malloc(size: usize) -> *mut u8
    fn free(ptr: *mut u8)
}
```

## Networking Requirements

| Protocol | Support | Notes |
|----------|---------|-------|
| TCP/UDP | Native | std::net module |
| HTTP/1.1 | Native | std::http module |
| HTTP/2 | Native | h2 crate integration |
| HTTP/3 | Planned | Q4 2027 |
| gRPC | Library | grpc-kasteran crate |
| WebSocket | Native | std::ws module |
| TLS 1.3 | Native | rustls-based |

## Database Requirements

| Database | Support | Driver |
|----------|---------|--------|
| PostgreSQL | Native | kasteran/sql (async) |
| MySQL/MariaDB | Native | kasteran/sql (async) |
| SQLite | Native | kasteran/sql |
| MongoDB | Library | mongo-kasteran |
| Redis | Native | kasteran/cache |
| Kafka | Library | kafka-kasteran |

## Security Requirements

| Requirement | Standard | Verification |
|-------------|----------|--------------|
| Memory safety | No CVEs from memory bugs | Formal verification |
| Cryptography | FIPS 140-3 (via BoringSSL) | Certification in progress |
| Audit trail | Immutable, signed | Compiler-enforced |
| Dependency scanning | CVE matching | kasteran audit |
| SBOM generation | SPDX 2.3 | kasteran sbom |
| Supply chain SLSA | Level 3 | Build pipeline |

## Conclusion

These technical requirements define the engineering targets for Kasteran* development. They are living documents that will be refined as the language matures. The key differentiators are compile-time safety guarantees, near-C performance, sub-second builds, and comprehensive tooling — all delivered with a Python-friendly syntax.
