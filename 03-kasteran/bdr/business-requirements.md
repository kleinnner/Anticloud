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

# Kasteran* — Business Requirements Document
© Lois-Kleinner & 0-1.gg 2026

## Document Purpose

This Business Requirements Document (BRD) defines the business context, goals, stakeholders, and scope for the Kasteran* programming language project. It serves as the foundational reference for all subsequent technical and functional specifications.

## Vision Statement

Kasteran* aims to be the last programming language a developer needs to learn: a single language that combines the safety of Rust, the expressiveness of Python, the performance of C, and the simplicity of Go. It targets the full spectrum of software development from embedded systems to cloud-scale distributed applications.

## Business Goals

### Primary Goals

| ID | Goal | Success Metric | Target | Timeline |
|----|------|----------------|--------|----------|
| BG-1 | Achieve widespread enterprise adoption | Number of organizations using Kasteran* in production | 500+ by end of Year 3 | Q4 2028 |
| BG-2 | Eliminate memory safety vulnerabilities | Percentage of Kasteran* codebases with zero memory safety CVEs | 100% | Ongoing |
| BG-3 | Reduce total cost of software development | TCO comparison against Python, Rust, C | 30% reduction by Year 2 | Q4 2027 |
| BG-4 | Build a self-sustaining open-source community | Active monthly contributors | 1,000+ by Year 3 | Q4 2028 |
| BG-5 | Achieve performance parity with C | Benchmark scores within 5% of equivalent C code | ≤5% overhead | Q2 2027 |

### Secondary Goals

| ID | Goal | Success Metric |
|----|------|----------------|
| BG-6 | Support WebAssembly as a first-class target | WASM binary size < 50KB for typical module |
| BG-7 | Enable formal verification of critical code paths | Compiler-integrated prover for safety properties |
| BG-8 | Provide seamless C ABI interop | Zero-copy FFI with C libraries |
| BG-9 | Achieve sub-second compile times for most projects | Average compile time < 2s for 10KLOC |

## Stakeholders

| Stakeholder | Role | Interests | Influence |
|-------------|------|-----------|-----------|
| Individual Developers | Primary users | Productivity, safety, learning curve | High |
| Enterprise Engineering Teams | Adopting organizations | TCO, maintainability, team velocity | High |
| Open Source Community | Contributors and ecosystem | Governance, transparency, freedom | Medium |
| Lois-Kleinner & 0-1.gg | Stewards and maintainers | Language vision, sustainability | High |
| Academic Researchers | Adopters for teaching and research | Type system, formal methods, PL theory | Low-Medium |
| Investors | Financial backers | Market adoption, revenue, ROI | Medium |
| Partners (Cloud, Tooling) | Ecosystem enablers | Integration, compatibility | Medium |
| Enterprise Security Teams | Compliance and risk assessment | Security guarantees, audit trail | High |

## Scope

### In Scope

- Systems programming with manual memory management via linear types
- Application development for web, CLI, embedded, and cloud
- C ABI compatibility for interop with existing ecosystems
- WebAssembly (WASM) compilation target
- Formal verification of memory safety and termination
- Package management ecosystem
- Built-in observability (metrics, logging, tracing)
- Enterprise-grade tooling (LSP, formatter, debugger)

### Out of Scope (Phase 1)

- GUI framework in standard library
- Mobile platform support (iOS/Android native)
- Data science and ML framework
- Dynamic scripting REPL (interactive mode planned for Phase 2)
- Blockchain/smart contract platform support

## User Personas

### Alex — The Systems Programmer

- Background: 10+ years of C/C++ and Rust
- Pain points: Complex borrow checker, slow compile times, steep learning curve for teams
- Needs: Memory safety without the complexity, fast compile times, C interop

### Priya — The Web Developer

- Background: 5+ years of Python and JavaScript
- Pain points: Runtime errors, performance issues at scale, GIL limitations
- Needs: Type safety, performance, ease of learning, async support

### Carlos — The DevOps Engineer

- Background: Go and shell scripting for infrastructure
- Pain points: Single binary distribution but lacks safety guarantees
- Needs: Safe systems programming, fast builds, minimal runtime

### Dr. Wei — The Academic

- Background: Programming languages researcher
- Pain points: Gap between academic PL theory and practical languages
- Needs: Linear types implementation, formal verification, publishable results

## Constraints

| Constraint | Description |
|------------|-------------|
| Backward compatibility | Minor version releases must not break existing code |
| LLVM dependency | Compiler backend requires LLVM 17+ |
| C ABI stability | C ABI must remain compatible across major versions |
| Memory safety | Zero unsafe escape hatches in safe code |
| Platform support | Tier 1: Linux, macOS, Windows. Tier 2: BSD, WASM |

## Assumptions

- Organizations value safety guarantees enough to accept a steeper initial learning curve than Go
- The market for systems languages will continue to grow
- LLVM will remain a viable compiler backend for the foreseeable future
- Open source governance will attract sufficient community contributions

## Business Case Summary

The global cost of memory safety bugs is estimated at $20+ billion annually (Microsoft, Google, NSA). Existing solutions (Rust) have adoption barriers due to complexity. Garbage-collected languages (Go, Java, Python) cannot serve systems programming needs. Kasteran* addresses this gap with a unique combination of linear types, C-like performance, and Python-like syntax.

## Approval

| Role | Name | Date |
|------|------|------|
| Product Owner | TBD | TBD |
| Technical Lead | TBD | TBD |
| Business Sponsor | TBD | TBD |
