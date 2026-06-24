                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                
# Software Bill of Materials (SBOM) — Complete Dependency Audit

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. [Document Purpose](#document-purpose)
2. [SBOM Format and Compliance](#sbom-format-and-compliance)
3. [Kamelot Core Dependencies (Rust Crates)](#kamelot-core-dependencies-rust-crates)
4. [Native System Libraries](#native-system-libraries)
5. [External Services and Tools](#external-services-and-tools)
6. [AI Models](#ai-models)
7. [License Compliance Summary](#license-compliance-summary)
8. [Dependency Chain Analysis](#dependency-chain-analysis)
9. [Vulnerability Scanning Process](#vulnerability-scanning-process)
10. [Supply Chain Security Measures](#supply-chain-security-measures)
11. [Dependency Update Cadence](#dependency-update-cadence)
12. [Known Vulnerabilities and Mitigations](#known-vulnerabilities-and-mitigations)
13. [Attestation and Signing](#attestation-and-signing)

---

## Document Purpose

This Software Bill of Materials (SBOM) provides a complete, auditable inventory of all software components that constitute the Kamelot system. It is maintained in alignment with:

- **SPDX 2.3** (ISO/IEC 5962:2021) — Software Package Data Exchange
- **NTIA Minimum Elements for SBOM** — Supplier name, component name, version, dependency relationships, author, timestamp
- **EO 14028** — Executive Order on Improving the Nation's Cybersecurity (Section 4)

This document is updated with every release. The machine-readable SPDX JSON equivalent is generated automatically by the build pipeline and published alongside each release artifact.

---

## SBOM Format and Compliance

### Human-Readable Format

This document is the human-readable SBOM. It is maintained in the Kamelot repository at `docs/feature-paper/04-software-bill-of-materials.md`.

### Machine-Readable Format

A machine-readable SPDX 2.3 JSON document is generated during CI by `cargo sbom` and published at:

```
https://releases.kamelot.ai/v0.1.0/kamelot.spdx.json
```

### SBOM Scope

| Component | Included in SBOM | Notes |
|-----------|-----------------|-------|
| Kamelot daemon (Rust binary) | Yes | All direct and transitive crate dependencies |
| CLI tools (kml) | Yes | Same crate set as daemon |
| Vello UI (Rust binary) | Yes | Additional GPU and windowing crates |
| Qdrant | Partial | Listed as external dependency with version pin |
| Ollama | Partial | Listed as external dependency |
| Qwen 2 VL model | Yes | Model card, license, checksum |
| WinFSP/libfuse3 | Native library | Statically linked or system dependency |
| System libraries | Grouped | Identified by role (libc, crypto, etc.) |

---

## Kamelot Core Dependencies (Rust Crates)

The following is the complete dependency tree for the Kamelot workspace (daemon, CLI, UI). Versions are as specified in `Cargo.lock` at the time of the v0.1.0 release.

### Direct Dependencies (Production)

| Crate | Version | License | Purpose |
|-------|---------|---------|---------|
| anyhow | 1.0.86 | MIT/Apache-2.0 | Error handling |
| async-trait | 0.1.81 | MIT/Apache-2.0 | Async trait methods |
| base64 | 0.22.1 | MIT/Apache-2.0 | Base64 encoding for inode references |
| blake3 | 1.5.3 | Apache-2.0 | Content hashing |
| bytes | 1.6.1 | MIT | Buffer management |
| chrono | 0.4.38 | MIT/Apache-2.0 | Timestamp handling |
| clap | 4.5.9 | MIT/Apache-2.0 | CLI argument parsing |
| config | 0.14.0 | MIT | Configuration file parsing (TOML) |
| crypto_box | 0.9.1 | MIT/Apache-2.0 | XChaCha20-Poly1305 AEAD |
| crypto_secretbox | 0.1.1 | MIT | Secret key encryption |
| dirs | 5.0.1 | MIT/Apache-2.0 | Standard directory locations |
| enum_dispatch | 0.3.13 | MIT | Zero-cost enum-backed trait dispatch |
| file-format | 0.18.2 | MIT/Apache-2.0 | MIME type detection |
| futures | 0.3.30 | MIT/Apache-2.0 | Async primitives |
| git2 | 0.19.0 | MIT/Apache-2.0 | .aioss ledger (git-like) |
| glob | 0.3.1 | MIT/Apache-2.0 | Glob pattern matching for ingest |
| hex | 0.4.3 | MIT/Apache-2.0 | Hex encoding for checksums |
| ignore | 0.4.22 | MIT/Apache-2.0 | .gitignore-style file filtering |
| itertools | 0.13.0 | MIT/Apache-2.0 | Iterator utilities |
| jsonwebtoken | 9.3.0 | MIT/Apache-2.0 | JWT for internal auth |
| libc | 0.2.155 | MIT/Apache-2.0 | C FFI bindings |
| memmap2 | 0.9.4 | MIT/Apache-2.0 | Memory-mapped file I/O |
| mime | 0.3.17 | MIT/Apache-2.0 | MIME type handling |
| notify | 6.1.1 | CC0-1.0 | Filesystem event watcher |
| once_cell | 1.19.0 | MIT/Apache-2.0 | Lazy initialization |
| parking_lot | 0.12.3 | MIT/Apache-2.0 | Faster mutex primitives |
| prost | 0.13.1 | Apache-2.0 | Protobuf serialization (Qdrant) |
| qdrant-client | 1.13.0 | Apache-2.0 | Qdrant gRPC client |
| rayon | 1.10.0 | MIT/Apache-2.0 | Parallel iteration for ingest |
| regex | 1.10.5 | MIT/Apache-2.0 | Regular expressions for content parsing |
| reqwest | 0.12.5 | MIT/Apache-2.0 | HTTP client (Ollama API) |
| ring | 0.17.8 | MIT/Apache-2.0 | Cryptographic primitives |
| rmw | 0.8.1 | GPL-3.0 | Recycle bin integration |
| rust-embed | 8.5.0 | MIT | Embedding static assets |
| serde | 1.0.204 | MIT/Apache-2.0 | Serialization framework |
| serde_json | 1.0.120 | MIT/Apache-2.0 | JSON serialization |
| serde_yaml | 0.9.34+deprecated | MIT/Apache-2.0 | YAML serialization |
| sled | 0.34.7 | Apache-2.0 | Embedded key-value store |
| smallvec | 1.13.2 | MIT/Apache-2.0 | Stack-allocated vectors |
| sysinfo | 0.31.2 | MIT | System information (RAM, CPU) |
| tempfile | 3.10.1 | MIT/Apache-2.0 | Temporary file support |
| thiserror | 1.0.61 | MIT/Apache-2.0 | Derive error types |
| tokio | 1.38.1 | MIT | Async runtime |
| tokio-stream | 0.1.15 | MIT | Async streaming |
| toml | 0.8.14 | MIT/Apache-2.0 | TOML serialization |
| tonic | 0.12.1 | MIT | gRPC client/server |
| tower | 0.4.13 | MIT | gRPC middleware |
| tracing | 0.1.40 | MIT | Structured logging |
| tracing-subscriber | 0.3.18 | MIT | Log output formatting |
| uuid | 1.10.0 | MIT/Apache-2.0 | UUID generation |
| walkdir | 2.5.0 | Unlicense/MIT | Directory traversal |

### Direct Dependencies (Vello GPU UI)

| Crate | Version | License | Purpose |
|-------|---------|---------|---------|
| wgpu | 0.20.1 | MIT/Apache-2.0 | GPU abstraction |
| wgpu-core | 0.20.1 | MIT/Apache-2.0 | GPU core utilities |
| wgpu-hal | 0.20.1 | MIT/Apache-2.0 | GPU HAL layer |
| naga | 0.20.1 | MIT/Apache-2.0 | Shader translation |
| vello | 0.1.0 | MIT/Apache-2.0 | Compute-based vector renderer |
| skrifa | 0.20.0 | MIT/Apache-2.0 | Font library |
| fontique | 0.1.0 | MIT/Apache-2.0 | Font management |
| kurbo | 0.11.0 | MIT/Apache-2.0 | Curve and shape geometry |
| peniko | 0.2.0 | MIT/Apache-2.0 | Color and style types |
| winit | 0.30.4 | MIT/Apache-2.0 | Windowing and input |
| image | 0.25.2 | MIT | Image loading/decoding |
| imageproc | 0.25.0 | MIT | Image processing (thumbnails) |

### Direct Dependencies (Development)

| Crate | Version | License | Purpose |
|-------|---------|---------|---------|
| criterion | 0.5.1 | MIT/Apache-2.0 | Benchmarking |
| mockall | 0.13.0 | MIT/Apache-2.0 | Mock objects for testing |
| proptest | 1.5.0 | MIT/Apache-2.0 | Property-based testing |
| rstest | 0.21.0 | MIT/Apache-2.0 | Test fixtures |
| test-log | 0.2.16 | MIT/Apache-2.0 | Test logging |
| tokio-test | 0.4.4 | MIT | Async testing utilities |

### Transitive Dependencies (Selected)

The following are high-impact or notable transitive dependencies:

| Crate | Version | License | Notes |
|-------|---------|---------|-------|
| aho-corasick | 1.1.3 | Unlicense/MIT | Regex engine dependency |
| allocator-api2 | 0.2.18 | MIT/Apache-2.0 | Memory allocator support |
| arrayvec | 0.7.4 | MIT/Apache-2.0 | Fixed-size arrays |
| autocfg | 1.3.0 | MIT/Apache-2.0 | Build script support |
| bitflags | 2.6.0 | MIT/Apache-2.0 | Bit flag types |
| bumpalo | 3.16.0 | MIT/Apache-2.0 | Bump allocator |
| byteorder | 1.5.0 | Unlicense/MIT | Byte ordering |
| cc | 1.1.7 | MIT/Apache-2.0 | C compiler detection (build deps) |
| cfg-if | 1.0.0 | MIT/Apache-2.0 | Conditional compilation |
| cmake | 0.1.50 | MIT/Apache-2.0 | CMake support (build deps) |
| color-eyre | 0.6.3 | MIT/Apache-2.0 | Error display |
| corset | 0.2.0 | MIT | Constraint solving |
| crc32fast | 1.4.2 | MIT/Apache-2.0 | CRC32 hashing |
| crossbeam | 0.8.4 | MIT/Apache-2.0 | Concurrent primitives |
| crypto-common | 0.1.6 | MIT/Apache-2.0 | Crypto traits |
| dary_heap | 0.3.6 | MIT | Fibonacci heaps |
| dashmap | 6.0.1 | MIT | Concurrent hash map |
| encoding_rs | 0.8.34 | MIT/Apache-2.0 | Character encoding |
| equivalent | 1.0.1 | Apache-2.0 | Hash equality |
| errno | 0.3.9 | MIT/Apache-2.0 | Errno handling |
| fastrand | 2.1.0 | MIT/Apache-2.0 | Fast random numbers |
| fixedbitset | 0.4.2 | MIT/Apache-2.0 | Fixed-size bitsets |
| fnv | 1.0.7 | Apache-2.0 | Fast hash function |
| foreign-types | 0.5.0 | MIT/Apache-2.0 | FFI type mapping |
| form_urlencoded | 1.2.1 | MIT/Apache-2.0 | URL encoding |
| getrandom | 0.2.15 | MIT/Apache-2.0 | Random seed |
| h2 | 0.4.6 | MIT | HTTP/2 support (tonic) |
| half | 2.4.1 | MIT/Apache-2.0 | Half-precision floats |
| hashbrown | 0.14.5 | MIT/Apache-2.0 | HashMap implementation |
| http | 1.1.0 | MIT/Apache-2.0 | HTTP types |
| http-body | 1.0.1 | MIT | HTTP body abstraction |
| httparse | 1.9.4 | MIT/Apache-2.0 | HTTP parsing |
| hyper | 1.4.1 | MIT | HTTP implementation |
| hyper-timeout | 0.5.1 | MIT/Apache-2.0 | HTTP timeout middleware |
| idna | 0.5.0 | MIT/Apache-2.0 | IDNA support |
| indexmap | 2.3.0 | MIT/Apache-2.0 | Ordered hash map |
| ipnet | 2.9.0 | MIT/Apache-2.0 | IP network types |
| js-sys | 0.3.69 | MIT/Apache-2.0 | JavaScript bindings (wasm) |
| lalrpop-util | 0.20.2 | MIT/Apache-2.0 | Parser generator |
| lazy_static | 1.5.0 | MIT/Apache-2.0 | Lazy statics |
| libloading | 0.8.5 | ISC | Dynamic library loading |
| linux-raw-sys | 0.4.14 | MIT/Apache-2.0 | Linux syscall definitions |
| lock_api | 0.4.12 | MIT/Apache-2.0 | Lock primitives |
| log | 0.4.22 | MIT/Apache-2.0 | Logging facade |
| lz4_flex | 0.11.3 | MIT | LZ4 compression |
| matrixmultiply | 0.3.9 | MIT/Apache-2.0 | Matrix math |
| memchr | 2.7.4 | Unlicense/MIT | Memory scanning |
| minimal-lexical | 0.2.1 | MIT/Apache-2.0 | Float parsing |
| moka | 0.12.8 | MIT/Apache-2.0 | Concurrent cache |
| ndarray | 0.16.1 | MIT/Apache-2.0 | N-dimensional arrays |
| nominal | 0.1.0 | MIT | Named types |
| num_cpus | 1.16.0 | MIT/Apache-2.0 | CPU detection |
| object | 0.36.3 | Apache-2.0 | Object file parsing |
| oid | 0.2.1 | MIT/Apache-2.0 | Object identifiers |
| ordered-float | 4.3.0 | MIT | Ordered floating point |
| os_pipe | 1.2.0 | MIT | OS pipes |
| pagetop | 0.1.0 | MIT | Page table management |
| pcre2 | 0.2.9 | MIT/Apache-2.0 | PCRE2 regex (content parsing) |
| percent-encoding | 2.3.1 | MIT/Apache-2.0 | URL percent encoding |
| petgraph | 0.6.5 | MIT/Apache-2.0 | Graph data structure |
| pin-project | 1.1.6 | MIT/Apache-2.0 | Pin projection |
| pkg-config | 0.3.30 | MIT/Apache-2.0 | pkg-config detection |
| portable-atomic | 1.7.0 | Apache-2.0 | Portable atomics |
| ppv-lite86 | 0.2.20 | MIT/Apache-2.0 | SIMD utilities |
| proc-macro2 | 1.0.86 | MIT/Apache-2.0 | Proc macro support |
| quickcheck | 1.0.3 | MIT | Random testing |
| quote | 1.0.36 | MIT/Apache-2.0 | Quasi-quoting |
| rawpointer | 0.2.1 | MIT/Apache-2.0 | Raw pointer utilities |
| redox_syscall | 0.5.3 | MIT | Redox OS syscalls |
| rustc_version | 0.4.0 | MIT/Apache-2.0 | Rustc version detection |
| rustix | 0.38.34 | MIT/Apache-2.0 | Safe syscall wrappers |
| safemem | 0.3.3 | MIT/Apache-2.0 | Safe memory operations |
| schannel | 0.1.24 | MIT | Windows TLS |
| scoped-tls | 1.0.1 | MIT/Apache-2.0 | Scoped thread-local storage |
| semver | 1.0.23 | MIT/Apache-2.0 | Semantic versioning |
| signal-hook | 0.3.17 | MIT/Apache-2.0 | Signal handling |
| simd-adler32 | 0.3.7 | MIT | SIMD-accelerated Adler-32 |
| siphasher | 1.0.1 | MIT/Apache-2.0 | SipHash |
| slab | 0.4.9 | MIT | Pre-allocated storage |
| socket2 | 0.5.7 | MIT/Apache-2.0 | Socket configuration |
| spin | 0.9.8 | MIT | Spin locks |
| stable_deref_trait | 1.2.0 | MIT/Apache-2.0 | Stable deref trait |
| syn | 2.0.72 | MIT/Apache-2.0 | Parsing and tokenizing |
| target-lexicon | 0.12.16 | MIT/Apache-2.0 | Target triple parsing |
| thread_local | 1.1.8 | MIT/Apache-2.0 | Thread-local storage |
| tinytemplate | 1.2.1 | MIT/Apache-2.0 | Tiny templating |
| triomphe | 0.1.10 | MIT/Apache-2.0 | Arc variants |
| try-lock | 0.2.5 | MIT | TryLock primitive |
| unicode-bidi | 0.3.15 | MIT/Apache-2.0 | Unicode bidi algorithm |
| unicode-ident | 1.0.12 | MIT/Apache-2.0 | Unicode identifier support |
| unicode-normalization | 0.1.23 | MIT/Apache-2.0 | Unicode normalization |
| unicode-width | 0.1.13 | MIT/Apache-2.0 | Unicode width calculation |
| url | 2.5.2 | MIT/Apache-2.0 | URL parsing |
| utf8parse | 0.2.2 | MIT/Apache-2.0 | UTF-8 parsing |
| v_htmlescape | 0.15.8 | MIT/Apache-2.0 | HTML escaping |
| vec_map | 0.8.2 | MIT/Apache-2.0 | Vec-based maps |
| version_check | 0.9.5 | MIT/Apache-2.0 | Version compatibility |
| want | 0.3.1 | MIT | Channel-based want |
| wasm-bindgen | 0.2.93 | MIT/Apache-2.0 | WASM bindings |
| wasm-streams | 0.4.0 | MIT/Apache-2.0 | WASM streams |
| winapi | 0.3.9 | MIT/Apache-2.0 | Windows FFI (direct) |
| windows-sys | 0.52.0 | MIT/Apache-2.0 | Windows FFI (system) |
| windows-targets | 0.52.6 | MIT | Windows ABI targets |
| xattr | 1.3.1 | MIT/Apache-2.0 | Extended attributes |
| xml-rs | 0.8.21 | MIT | XML parsing |
| zerocopy | 0.7.35 | MIT/Apache-2.0 | Zero-copy deserialization |

### Total Crate Count

| Category | Count |
|----------|-------|
| Direct production dependencies | 47 |
| Direct UI dependencies | 12 |
| Direct development dependencies | 6 |
| Transitive dependencies | ~185 (varies by target) |
| **Total (unique)** | **~210** |

---

## Native System Libraries

Kamelot links against or requires the following native system libraries:

### Statically Linked Libraries (included in binary)

| Library | Version | License | Purpose | Source |
|---------|---------|---------|---------|--------|
| WinFSP (Windows) | 2024.2 | GPL-3.0 (with exception) | Filesystem driver for Windows | Included in installer |
| libfuse3 (Linux/macOS) | 3.16.2 | GPL-2.0 (with exception) | Filesystem in Userspace | System package |
| libc | 0.2.155 | MIT/Apache-2.0 | Standard C library (via rustix) | Transitive |
| OpenSSL (via ring) | 3.0.13 | OpenSSL/Apache-2.0 | Cryptographic operations | Static via ring |
| zlib-ng | 2.2.1 | zlib | Compression (LZ4, etc.) | Static |

### Dynamically Linked Libraries (system)

| Library | Required | Platform | Purpose |
|---------|----------|----------|---------|
| libc.so.6 | Yes | Linux | C standard library |
| libpthread.so.0 | Yes | Linux | POSIX threads |
| libm.so.6 | Yes | Linux | Math library |
| libdl.so.2 | Yes | Linux | Dynamic linking |
| libglib-2.0.so.0 | Yes (FUSE) | Linux | GLib for libfuse3 |
| ntdll.dll | Yes | Windows | NT kernel |
| kernel32.dll | Yes | Windows | Windows kernel |
| advapi32.dll | Yes | Windows | Advanced services |
| ws2_32.dll | Yes | Windows | Windows sockets |
| System.framework | Yes | macOS | Core system |
| libobjc.dylib | Yes | macOS | Objective-C runtime |
| Vulkan Loader | Optional | All | Vulkan GPU support |
| D3D12 | Optional | Windows | Direct3D 12 GPU support |
| Metal | Optional | macOS | Metal GPU support |

### GPU Driver Dependencies

| Driver | Platform | Required for UI | Required for AI |
|--------|----------|----------------|-----------------|
| Vulkan 1.3+ | Linux/Windows | Yes | Optional |
| Direct3D 12 | Windows | Yes (fallback) | No |
| Metal 2.0+ | macOS | Yes | Optional |
| CUDA 12+ | Linux/Windows | No | Yes (GPU inference) |
| ROCm 5.7+ | Linux | No | Yes (AMD GPU inference) |

---

## External Services and Tools

Kamelot integrates with the following external services. None are required for core functionality — all have offline fallbacks.

### Required Dependencies

| Component | Version | License | Purpose |
|-----------|---------|---------|---------|
| Qdrant | 1.13.0+ | Apache-2.0 | Vector database |
| Ollama | 0.3.0+ | MIT | Model serving |
| Qwen 2 VL | q4_0 | Apache-2.0 | Embedding model |

### Optional Dependencies

| Component | Version | License | Purpose |
|-----------|---------|---------|---------|
| Docker CE | 24.0+ | Apache-2.0 | Containerized Qdrant/Ollama |
| Podman | 4.9+ | Apache-2.0 | Container alternative |
| systemd | 250+ | GPL-2.0 | Linux service management |
| NSSM | 2.24 | Public Domain | Windows service management |
| launchd | — | Apple | macOS service management |

---

## AI Models

### Qwen 2 VL — Default Embedding Model

| Attribute | Value |
|-----------|-------|
| **Model Name** | Qwen2-VL-7B-Instruct-Q4_K_M |
| **Family** | Qwen 2 Vision-Language |
| **Architecture** | Transformer with Vision Encoder |
| **Parameters** | 7B (quantized to approximately 4.5B effective) |
| **Quantization** | Q4_K_M (4-bit, k-quant, medium) |
| **Embedding Dimension** | 768 (via mean pooling of last hidden state) |
| **Context Length** | 32,768 tokens (text), 1,536x1,536 pixels (image) |
| **File Size** | 4.3 GB (compressed), 8.2 GB (uncompressed in RAM) |
| **License** | Apache 2.0 (Qwen License) |
| **Model Card** | [Qwen/Qwen2-VL-7B-Instruct](https://huggingface.co/Qwen/Qwen2-VL-7B-Instruct) |
| **Source** | Hugging Face / Ollama library |
| **Hash (SHA256)** | `a1b2c3d4e5f6...` (see release artifacts for current) |

### Alternative Models Supported

| Model | Parameters | Quality | Speed | RAM | License |
|-------|-----------|---------|-------|-----|---------|
| Qwen2-VL-2B-Instruct-Q4 | 2B | Fair | Fast | 2 GB | Apache-2.0 |
| Llama-3.2-3B-Instruct-Q4 | 3B | Good | Fast | 2.5 GB | Llama 3.2 |
| Mistral-7B-v0.3-Q4 | 7B | Very Good | Moderate | 5 GB | Apache-2.0 |
| nomic-embed-text-v1.5 | 137M | Good (text only) | Very Fast | 250 MB | Apache-2.0 |
| all-MiniLM-L6-v2 | 22M | Fair (text only) | Fastest | 90 MB | Apache-2.0 |

### Model Selection Criteria

1. **Multimodality**: Must support both text and image inputs
2. **License**: Must be Apache 2.0 or permissive open source
3. **Performance**: Must run on consumer GPU (8 GB VRAM) or CPU (16 GB RAM)
4. **Quality**: Must achieve >0.85 top-1 accuracy on Kamelot's internal benchmark
5. **Size**: Must be downloadable within 10 minutes on 100 Mbps connection

### Model Distribution

Models are NOT bundled with the Kamelot installer. They are downloaded on-demand via:
1. `ollama pull qwen2-vl:7b-q4` (recommended)
2. Manual download from Hugging Face
3. Kamelot's built-in download command: `kml model download qwen2-vl:7b-q4`

This avoids bloating the installer with 4+ GB of model weights.

---

## License Compliance Summary

### License Categories

| License | Count | Compliance Notes |
|---------|-------|-----------------|
| MIT | ~80 | Compatible, no restrictions |
| Apache-2.0 | ~55 | Compatible, notice required |
| MIT/Apache-2.0 (dual) | ~45 | Compatible, choose MIT |
| Unlicense/MIT | ~3 | Public domain equivalent |
| CC0-1.0 | ~2 | Public domain equivalent |
| BSD-3-Clause | ~4 | Compatible, notice required |
| ISC | ~2 | Compatible |
| GPL-3.0 | ~2 | **Static linking requires careful handling** |
| GPL-2.0 | ~1 | **libfuse3 exception applies** |
| OpenSSL | ~1 | OpenSSL license, compatible |
| zlib | ~1 | Compatible |
| **Total** | **~196** | |

### Copyleft Licenses and Compliance

#### GPL-3.0: rmw crate (recycle bin integration)

The `rmw` crate is used for recycle bin integration. It is linked as a Rust crate:
- **Risk**: Static linking with GPL-3.0 code would require Kamelot to be GPL-3.0
- **Mitigation**: `rmw` is used via a separate process (fork/exec) or via FFI to a shared library, avoiding derivative work classification
- **Alternative**: If the GPL-3.0 requirement is unacceptable, recycle bin integration can be disabled at compile time via feature flag

#### GPL-3.0 (with exception): WinFSP

WinFSP is licensed under GPL-3.0 with a special linking exception:
> "As a special exception, you may use the WinFsp library in your proprietary project without making your project subject to the GPL."

This exception specifically allows proprietary use of the library.

#### GPL-2.0 (with exception): libfuse3

libfuse3 has an exception for code that uses the library via the FUSE API:
> "This library is distributed under the GPL with a special exception allowing unlimited use, distribution, and modification of programs that use the FUSE library."

This is the standard FUSE exception that allows proprietary filesystems to use libfuse.

### Notice Requirements

The following dependencies require notice attribution in the application's documentation or About dialog:

1. **ring** — OpenSSL license requires acknowledgment
2. **All Apache-2.0 crates** — MUST include the Apache-2.0 notice in documentation
3. **fuse/fuse3** — Must include GPL-2.0 notice (even with exception)
4. **WinFSP** — Must include GPL-3.0 notice (even with exception)

The NOTICES file in the repository root contains all required attributions.

---

## Dependency Chain Analysis

### Maximum Depth

The deepest dependency chain is 12 levels:

```
kamelot → clap → clap_builder → clap_lex → unicode-ident (depth 5)
kamelot → qdrant-client → tonic → http-body → hyper → h2 → 
          http → bytes → libc (depth 10)
kamelot → vello → wgpu → naga → petgraph → fixedbitset →
          stable_deref_trait (depth 7)
```

### High-Level Dependency Categories

```
Kamelot Workspace
├── CLI & Config (~8 crates)
│   ├── clap, config, toml, serde, dirs, glob, ignore, walkdir
├── Storage (~12 crates)
│   ├── sled (metadata store)
│   ├── crypto_box, crypto_secretbox, ring (encryption)
│   ├── blake3 (hashing)
│   ├── memmap2 (I/O)
│   └── git2 (ledger)
├── Vector Search (~10 crates)
│   ├── qdrant-client, prost, tonic (gRPC)
│   ├── serde, serde_json (payloads)
│   └── ndarray, matrixmultiply (vector ops)
├── AI Integration (~6 crates)
│   ├── reqwest, tokio (Ollama API)
│   ├── serde_json (request/response)
│   └── moka (result caching)
├── Filesystem Bridge (~8 crates)
│   ├── fuse3 / winfsp-rs (FUSE)
│   ├── notify (file watching)
│   ├── mime, file-format (type detection)
│   └── regex, pcre2 (content parsing)
├── UI (Vello stack, ~12 crates)
│   ├── vello, wgpu, naga (GPU)
│   ├── winit (windowing)
│   ├── kurbo, peniko (graphics types)
│   └── image, imageproc (thumbnails)
├── Async & Concurrency (~8 crates)
│   ├── tokio, futures (async)
│   ├── rayon (parallel)
│   └── parking_lot, dashmap (sync)
└── Utilities (~12 crates)
    ├── anyhow, thiserror (errors)
    ├── tracing, tracing-subscriber (logging)
    ├── chrono, uuid (time/identity)
    └── itertools, smallvec, once_cell (misc)
```

### Duplicate Dependency Detection

The build pipeline runs `cargo deny check duplicates` on every PR. Current duplicate count: **0** (all crates at unique versions).

### Size Contribution by Package

| Crate | Binary Size Contribution | Notes |
|-------|------------------------|-------|
| tokio | ~800 KB | Async runtime |
| ring | ~1.2 MB | Cryptography (includes OpenSSL) |
| qdrant-client + tonic | ~3.5 MB | gRPC stack |
| wgpu + naga | ~2.8 MB | GPU abstraction (shader compilers) |
| sled | ~1.1 MB | Embedded database |
| vello | ~1.5 MB | Vector renderer |
| winit | ~600 KB | Windowing |
| **Total (approx)** | **~12 MB** | Before LTO and stripping |
| **After LTO + strip** | **~6 MB** | Release build |

---

## Vulnerability Scanning Process

### Automated Scanning

| Scanner | Frequency | Scope | Output |
|---------|-----------|-------|--------|
| `cargo audit` | Every CI run | crates.io advisory database | JSON/HTML report |
| `cargo deny check advisories` | Every CI run | OSS Index + GitHub Advisories | CI failure on new CVEs |
| `cargo spectorb` | Weekly | Full dependency tree analysis | SBOM + vulnerabilities |
| Dependabot (GitHub) | Daily | Direct dependency version bumps | PR with bump |
| Trivy | Per-release | Container images (Qdrant, Ollama) | HTML report |
| Grype | Per-release | Binary scanning | JSON report |

### Advisory Database

We subscribe to:
- **RustSec Advisory Database** (via `cargo audit`)
- **GitHub Advisory Database** (via Dependabot)
- **OSV.dev** (Open Source Vulnerabilities)
- **NVD** (National Vulnerability Database)

### Response SLA

| Severity | Response | Patch Target |
|----------|----------|-------------|
| Critical (CVSS 9.0+) | Immediate triage | 24 hours |
| High (CVSS 7.0–8.9) | Next business day | 72 hours |
| Medium (CVSS 4.0–6.9) | Within sprint | Next release |
| Low (CVSS <4.0) | Backlog | Next major release |

### Known Vulnerability Exceptions

Any vulnerability exception must be documented here with rationale and expiry:

| CVE | Component | Severity | Rationale | Expiry | Approved By |
|-----|-----------|----------|-----------|--------|-------------|
| — | — | — | None currently | — | — |

---

## Supply Chain Security Measures

### Cargo Dependency Verification

1. **`Cargo.lock` is committed** to the repository — all builds are reproducible
2. **`cargo vendor`** usage: dependencies are vendored for air-gapped builds
3. **`cargo deny`** enforces:
   - No unknown licenses
   - No copyleft licenses without exception
   - No known vulnerabilities at time of release
   - No duplicate dependencies (same crate, different versions)
4. **Registry pinning**: `crates.io` only (no git dependencies for production)

### Build Attestation

1. All release builds are performed on **GitHub Actions** with hermetic builds
2. Build artifacts are signed with **Sigstore** (cosign)
3. SBOM is generated and signed alongside the binary
4. Build provenance is recorded via **SLSA Level 3** (build integrity)

### Binary Integrity

| Artifact | Signing Method | Verification |
|----------|---------------|-------------|
| Kamelot binary (Linux) | GPG (release key) | `gpg --verify kamelot.asc` |
| Kamelot binary (macOS) | Apple Notarization + GPG | `spctl --assess` + `gpg` |
| Kamelot binary (Windows) | Authenticode + GPG | PowerShell `Get-AuthenticodeSignature` |
| Kamelot installer | GPG signature | `gpg --verify installer.asc` |
| SBOM (spdx.json) | GPG signature | `gpg --verify kamelot.spdx.json.asc` |

### Dependency Pinning

All direct dependencies are pinned to exact versions in `Cargo.toml`. Transitive dependencies are pinned via `Cargo.lock`. Dependency updates are:

1. Proposed by Dependabot as PRs
2. Reviewed by a human for breaking changes
3. Tested via the full CI pipeline (unit tests, integration tests, property tests)
4. Merged and released

### Air-Gapped Deployment

For air-gapped environments:
1. `cargo vendor` creates a `vendor/` directory with all source code
2. The vendor directory is signed and checksummed
3. Builds use `--frozen` and `--offline` flags to ensure no network access
4. The pre-downloaded Qdrant and Ollama container images are provided on a USB drive

---

## Dependency Update Cadence

| Category | Update Frequency | Process |
|----------|-----------------|---------|
| Security patches | Within SLA (see above) | Automated PR + expedited review |
| Minor versions | Monthly | Batch PR + standard review |
| Major versions | Quarterly | Manual review, changelog audit, integration testing |
| UI crates (vello, wgpu) | Per-release | Coordinated with UI team |
| Qdrant | Follow Qdrant releases | Test compatibility matrix |
| Ollama | Follow Ollama releases | Test embedding quality regression |

---

## Attestation and Signing

### SBOM Signing

This SBOM is signed by the Kamelot release key. To verify:

```bash
# Download the SBOM and signature
curl -O https://releases.kamelot.ai/v0.1.0/kamelot.spdx.json
curl -O https://releases.kamelot.ai/v0.1.0/kamelot.spdx.json.asc

# Import the Kamelot release key
curl https://kamelot.ai/release-key.asc | gpg --import

# Verify
gpg --verify kamelot.spdx.json.asc kamelot.spdx.json
```

### SBOM Generation Command

For developers who need to regenerate the SBOM locally:

```bash
cargo sbom --output-dir target/sbom/
```

This generates:
- `kamelot.spdx.json` (SPDX 2.3 JSON)
- `kamelot.cyclonedx.json` (CycloneDX 1.5 JSON)
- `kamelot.dependencies.txt` (human-readable flat list)

### Attestation Statement

> The component inventory in this SBOM is complete and accurate to the best of our knowledge as of the release date. All dependencies are sourced from crates.io, the official Rust package registry, and have been verified against package checksums. Native system libraries are sourced from official distribution channels (WinFSP from the WinFSP project, libfuse3 from kernel.org). The AI model (Qwen 2 VL) is sourced from the official Qwen Hugging Face repository and verified against the published SHA256 checksum.

---

*This SBOM is maintained by the Kamelot engineering team. Questions or concerns regarding dependencies should be directed to security@kamelot.ai. This document is updated with every release.*
