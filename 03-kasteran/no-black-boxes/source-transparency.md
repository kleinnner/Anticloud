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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
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