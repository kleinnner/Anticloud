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

# Kasteran* — Acceptance Criteria
© Lois-Kleinner & 0-1.gg 2026

## Introduction

This document defines the acceptance criteria for Kasteran* features and releases. Acceptance criteria establish the Definition of Done (DoD) that must be satisfied before a feature is considered complete and ready for release.

## Definition of Done

A feature is considered "Done" when all of the following criteria are met:

1. **Code Complete**: All implementation code is written and merged
2. **Tests Pass**: All unit, integration, and property-based tests pass
3. **Documented**: Public API is documented, user-facing features have documentation
4. **Reviewed**: Code review completed with all blocker issues resolved
5. **Linted**: `kasteran lint` passes with zero warnings
6. **Formatted**: `kasteran format --check` passes
7. **Benchmarked**: Performance benchmarks show no regression
8. **Security Scanned**: `kasteran audit` passes with no critical vulnerabilities
9. **SBOM Generated**: Software Bill of Materials is current
10. **Integration Tested**: Feature works in end-to-end test environment

## Feature-Specific Acceptance Criteria

### AC-F1: Linear Type System

| ID | Criterion | Verification Method |
|----|-----------|-------------------|
| AC-F1.1 | Value must be used exactly once in default mode | Compile-time test suite |
| AC-F1.2 | Explicit `Copy` trait required for duplication | Compile-time check |
| AC-F1.3 | Resources cannot be leaked (file handles, sockets) | Compile-time resource tracking |
| AC-F1.4 | Aliasing tracked and constrained | Type checker validation |
| AC-F1.5 | No runtime cost for linear type enforcement | Benchmark comparison |
| AC-F1.6 | Error messages include fix suggestions | Message quality review |

**Minimum Passing Score**: 6/6 criteria met.

### AC-F2: Pattern Matching

| ID | Criterion | Verification Method |
|----|-----------|-------------------|
| AC-F2.1 | Exhaustiveness is enforced at compile time | Compiler test suite |
| AC-F2.2 | Match arms can destructure nested types | Integration tests |
| AC-F2.3 | Guard clauses supported | Feature tests |
| AC-F2.4 | `if let` syntax for single-arm matching | Feature tests |
| AC-F2.5 | Performance matches C switch for simple matches | Benchmark |

**Minimum Passing Score**: 5/5 criteria met.

### AC-F3: Async/Await

| ID | Criterion | Verification Method |
|----|-----------|-------------------|
| AC-F3.1 | Async functions compile and execute correctly | Integration test suite |
| AC-F3.2 | `await` on non-async functions is a compile error | Compile-time check |
| AC-F3.3 | Async tasks are scheduled fairly | Stress test |
| AC-F3.4 | Cancellation works (cancelled tasks release resources) | Integration tests |
| AC-F3.5 | Concurrent 10,000+ tasks | Stress test |
| AC-F3.6 | No stack overflow for deeply nested async calls | Stack depth test |

**Minimum Passing Score**: 6/6 criteria met.

### AC-F4: C ABI Interop

| ID | Criterion | Verification Method |
|----|-----------|-------------------|
| AC-F4.1 | C functions can be called from Kasteran* | Integration tests |
| AC-F4.2 | Kasteran* functions can be called from C | Integration tests |
| AC-F4.3 | Struct layout matches C ABI | Memory layout test |
| AC-F4.4 | C headers are auto-generated | `kasteran build --generate-headers` |
| AC-F4.5 | No overhead compared to native C calls | Benchmark |

**Minimum Passing Score**: 5/5 criteria met.

### AC-F5: Package Manager

| ID | Criterion | Verification Method |
|----|-----------|-------------------|
| AC-F5.1 | Package can be created and published | End-to-end test |
| AC-F5.2 | Dependencies resolved transitively | Integration tests |
| AC-F5.3 | Version constraints respected | Resolution test suite |
| AC-F5.4 | Lockfile prevents non-reproducible builds | Integrity check |
| AC-F5.5 | Package signing works | Cryptographic verification |
| AC-F5.6 | Private registries supported | Integration test with mock registry |

**Minimum Passing Score**: 6/6 criteria met.

### AC-F6: WASM Target

| ID | Criterion | Verification Method |
|----|-----------|-------------------|
| AC-F6.1 | Kasteran* code compiles to WASM | Build test |
| AC-F6.2 | WASM binary size < 50KB for typical module | Size measurement |
| AC-F6.3 | WASI system calls work | Integration tests |
| AC-F6.4 | Browser execution works | Browser test suite |

**Minimum Passing Score**: 4/4 criteria met.

## Release Acceptance Gates

### Alpha Release Gates

| Gate | Criteria | Verification |
|------|----------|-------------|
| G-ALPHA-1 | Core language compiles and runs | Compiler self-hosting test |
| G-ALPHA-2 | Linear types enforced | Safety test suite |
| G-ALPHA-3 | Package manager can install packages | End-to-end workflow |
| G-ALPHA-4 | LSP provides basic completion | IDE test |

### Beta Release Gates

All Alpha gates, plus:

| Gate | Criteria | Verification |
|------|----------|-------------|
| G-BETA-1 | Async runtime functional | Async test suite |
| G-BETA-2 | HTTP server handles requests | HTTP benchmark |
| G-BETA-3 | Cross-compilation for 3 platforms | Build matrix |
| G-BETA-4 | 100+ community packages available | Registry audit |
| G-BETA-5 | Documentation coverage > 80% | Coverage tool |

### Stable Release Gates (v1.0)

All Beta gates, plus:

| Gate | Criteria | Verification |
|------|----------|-------------|
| G-STABLE-1 | Test coverage > 85% | Coverage report |
| G-STABLE-2 | No critical CVEs | Security audit |
| G-STABLE-3 | Performance within 5% of C baseline | Benchmark suite |
| G-STABLE-4 | 500+ community packages | Registry audit |
| G-STABLE-5 | Platform support: 5 Tier-1 targets | Build matrix |
| G-STABLE-6 | Formal spec published | Review |
| G-STABLE-7 | Backward compatibility policy documented | Review |

## Testing Gates

### Unit Test Gates

| Gate | Requirement |
|------|-------------|
| Coverage | > 85% line coverage |
| Each function | At least one positive and one negative test |
| Edge cases | Tested for each function (empty input, max values, etc.) |
| No flaky tests | 10 consecutive runs without failure |

### Integration Test Gates

| Gate | Requirement |
|------|-------------|
| Critical paths | 100% of documented user journeys |
| Error scenarios | All error handling paths exercised |
| Concurrent scenarios | Multi-threaded scenarios tested |

### Property-Based Test Gates

| Gate | Requirement |
|------|-------------|
| Serialization | Round-trip property for all serializable types |
| Collections | Sort/retrieve consistent for all inputs |
| State machines | Invariant preservation for state machines |

### Performance Test Gates

| Gate | Requirement |
|------|-------------|
| No regression | Performance within 5% of previous release |
| Benchmark suite | All benchmarks pass on reference hardware |
| Memory bounds | No unbounded memory growth |

## Feature Acceptance Workflow

```
Feature Implementation
    ↓
Code Review (pass all blocker items)
    ↓
Test Suite (100% pass, coverage >85%)
    ↓
Documentation Review (all public API documented)
    ↓
Benchmark Validation (no regression)
    ↓
Security Scan (no critical vulnerabilities)
    ↓
Acceptance Sign-off (product owner + tech lead)
    ↓
Feature Complete ✓
```

## Sign-Off Requirements

| Role | Responsibility |
|------|---------------|
| Product Owner | Feature meets business requirements |
| Tech Lead | Implementation meets technical standards |
| QA Lead | All testing gates pass |
| Security Lead | Security criteria met |
| Documentation Lead | Documentation complete |

## Conclusion

The acceptance criteria defined in this document ensure that every feature released meets consistent quality standards. The Definition of Done and testing gates provide objective, measurable criteria that must be satisfied before a feature can be considered complete. This framework reduces ambiguity in feature delivery and ensures that releases maintain the quality expected of an enterprise-grade language.

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  As seen on:                                                       !
!  Harvard Dataverse ! Zenodo/CERN ! Academia.edu ! HuggingFace      !
!  anticloud.telepedia.net ! anticloud.fandom.com                    !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Bluesky ! Mastodon                           !
!  Internet Archive ! ORCID ! Figshare                               !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ