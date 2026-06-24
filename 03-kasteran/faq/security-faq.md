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

# Kasteran* — Security FAQ
© Lois-Kleinner & 0-1.gg 2026

## How does Kasteran* ensure memory safety?

Kasteran* ensures memory safety through its linear type system:

- **No use-after-free**: Linear types prevent accessing freed memory
- **No double-free**: Each value is freed exactly once
- **No buffer overflow**: Array bounds are checked (with optional unchecked access)
- **No null pointer dereference**: No null values (use `Optional<T>`)
- **No dangling pointers**: Ownership system prevents dangling references

These guarantees are enforced at compile time with zero runtime overhead.

## Is Kasteran* vulnerable to Spectre or Meltdown?

Kasteran* provides compiler flags for speculative execution mitigations:
- `--mitigate-spectre-v1`: Insert LFENCE after bounds checks
- `--mitigate-spectre-v2`: Retpoline for indirect branches
- `--mitigate-meltdown`: KPTI support

These mitigations can be enabled for security-critical code.

## How is supply chain security handled?

Kasteran* provides:
- **Deterministic builds**: Same source → same binary
- **Signed releases**: All artifacts are GPG-signed
- **Dependency scanning**: Automatic vulnerability scanning
- **SBOM generation**: Software Bill of Materials for every build
- **Provenance**: Build attestation with SLSA compliance

## Can Kasteran* code be reverse-engineered?

Like any compiled language, Kasteran* binaries can be reverse-engineered. However:
- The compiler strips debug symbols by default
- Optimizations can make decompiled code harder to understand
- Code obfuscation tools can be applied
- Custom allocators can frustrate memory analysis

Security should be based on cryptography and access controls, not obfuscation.

## How are vulnerabilities reported?

Security vulnerabilities should be reported privately:
- **Email**: security@kasteran.dev
- **PGP key**: Available on the Kasteran* website
- **Bug bounty**: Rewards for valid security findings

We follow responsible disclosure with a 90-day disclosure timeline.

## Does Kasteran* have constant-time cryptography?

Yes, Kasteran* cryptographic library provides constant-time implementations:
- No secret-dependent branches
- No secret-dependent memory access
- Compiler prevents optimization of constant-time code
- Verification tools detect timing leaks

## Conclusion

Kasteran* prioritizes security through compile-time memory safety, supply chain security measures, and cryptographic best practices.
