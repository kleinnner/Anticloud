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

# Kasteran* — Source Transparency
© Lois-Kleinner & 0-1.gg 2026

## Overview

Kasteran* is committed to full source transparency. The entire language — compiler, standard library, runtime, and tooling — is available under the MIT license, hosted in a public repository, and buildable entirely from source. There are no closed-source components, no obfuscated code, and no hidden functionality.

## MIT License

Kasteran* is released under the MIT License, one of the most permissive open source licenses:

```
MIT License

Copyright (c) 2026 Lois-Kleinner & 0-1.gg

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
...
```

## Public Repository

The Kasteran* source code is hosted on GitHub:

```
https://github.com/kasteran/kasteran
```

### Repository Structure
```
kasteran/
├── compiler/       # Compiler source
├── stdlib/         # Standard library
├── runtime/        # Runtime source
├── tooling/        # CLI tools, LSP, formatter
├── docs/           # Documentation
├── tests/          # Test suite
└── examples/       # Example programs
```

### Access
- Publicly accessible (no authentication required)
- Read-only mirrors on GitLab and self-hosted Git
- Downloadable source archives for each release
- Clone, fork, and contribute freely

## Buildable from Source

Kasteran* can be built entirely from source:

```
git clone https://github.com/kasteran/kasteran.git
cd kasteran
cargo build --release
```

### Build Requirements
- Rust toolchain (for bootstrapping)
- No proprietary dependencies
- No binary blobs in the repository
- All build dependencies are open source

### Bootstrap Process
Kasteran* follows a verified bootstrap process:
1. Stage 0: Build with existing compiler (Rust)
2. Stage 1: Build Kasteran* compiler with Stage 0
3. Stage 2: Build Kasteran* compiler with Stage 1
4. Verify: Stage 1 and Stage 2 binaries match

## Transparency Principles

### No Binary Blobs
The repository contains no pre-compiled binaries:
- All code is source code
- No minified or obfuscated files
- No proprietary libraries
- No closed-source dependencies

### No Telemetry in Source
The compiler contains no hidden telemetry:
- All telemetry is explicitly documented
- Telemetry is opt-in by default
- Telemetry code is visible in the source
- Telemetry can be disabled at compile time

### No Backdoors
The code is subject to public review:
- All pull requests are public
- Code changes are reviewed by the community
- Security-sensitive code is audited
- No hidden functionality exists

## Verifiable Releases

### Signed Commits
All commits are signed with GPG keys:
```
git verify-commit <commit-hash>
```

### Signed Releases
Release artifacts are signed:
```
gpg --verify kasteran-1.0.0.tar.gz.asc kasteran-1.0.0.tar.gz
```

### Reproducible Builds
The same source code always produces identical binaries:
```
kasteran build --deterministic
// Same input → same output on any machine
```

## Community Review

Source transparency enables community review:
- Anyone can audit the code
- Security researchers can examine the codebase
- Bug bounties reward vulnerability discovery
- Third-party audits are published

## Conclusion

Kasteran* full source transparency ensures that there are no black boxes in the language. Every line of code is visible, verifiable, and auditable. The MIT license, public repository, and buildable-from-source approach provide the highest level of transparency.
