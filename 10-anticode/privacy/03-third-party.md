```
▄▄                            ██     ▄▄   ▄▄▄                  ▄▄           
████                ██         ▀▀     ██  ██▀                   ██           
████    ██▄████▄  ███████    ████     ██▄██      ▄████▄    ▄███▄██   ▄████▄  
██  ██   ██▀   ██    ██         ██     █████     ██▀  ▀██  ██▀  ▀██  ██▄▄▄▄██ 
██████   ██    ██    ██         ██     ██  ██▄   ██    ██  ██    ██  ██▀▀▀▀▀▀ 
▄██  ██▄  ██    ██    ██▄▄▄   ▄▄▄██▄▄▄  ██   ██▄  ▀██▄▄██▀  ▀██▄▄███  ▀██▄▄▄▄█ 
▀▀    ▀▀  ▀▀    ▀▀     ▀▀▀▀   ▀▀▀▀▀▀▀▀  ▀▀    ▀▀    ▀▀▀▀      ▀▀▀ ▀▀    ▀▀▀▀▀ 

ANTIKODE — terminal-native AI coding engine
Lois-Kleinner and 0-1.gg 2026 Copyright
```

# Third-Party Dependencies and Privacy Implications

## Overview

ANTIKODE is built on a foundation of open source dependencies. This document provides a transparent accounting of all third-party components, their licenses, and their privacy implications.

## Dependency Classification

ANTIKODE's dependencies fall into three categories:

1. **Core Dependencies**: Libraries required for ANTIKODE's core functionality.
2. **Model Dependencies**: The LLM models that provide code generation capabilities.
3. **Optional Dependencies**: Components that are included but not required for basic operation.

## Core Dependencies

### llama.cpp

- **Purpose**: LLM inference engine
- **License**: MIT
- **Privacy Implication**: Runs entirely locally. No network communication. Processes data only in memory.
- **Repository**: github.com/ggerganov/llama.cpp

### Rust Standard Library

- **Purpose**: Language runtime for ANTIKODE core
- **License**: MIT / Apache 2.0
- **Privacy Implication**: No network or data collection capabilities
- **Source**: rust-lang.org

### Terminal Multiplexer Integration (tmux / zellij / Windows Terminal)

- **Purpose**: Terminal interface management
- **License**: Various (ISC for tmux, MIT for zellij, MIT for Windows Terminal)
- **Privacy Implication**: Operates entirely locally. No network communication.
- **Note**: ANTIKODE integrates with the user's existing terminal multiplexer. It does not modify the multiplexer's behavior or data handling.

## Model Dependencies

ANTIKODE supports multiple model backends. The privacy implications of each model depend solely on where the model runs, not on the model itself. Since all models run locally, there are no privacy implications from model inference.

### Supported Models

| Model | Source | License | Privacy Note |
|-------|--------|---------|--------------|
| CodeLlama | Meta | Custom research | Local inference only |
| DeepSeek-Coder | DeepSeek | MIT | Local inference only |
| StarCoder | Hugging Face | MIT | Local inference only |
| Phi-3 | Microsoft | MIT | Local inference only |
| Qwen2.5-Coder | Alibaba | Apache 2.0 | Local inference only |

Model downloads are performed from the user-specified source over HTTPS. Downloaded model files are stored locally and never transmitted.

## Network Activity Audit

### Verified No Network Activity

The following ANTIKODE components have been verified to perform no network communication:

- Core inference engine (llama.cpp)
- Terminal interface
- .aioss ledger
- Configuration management
- Prompt processing
- Output generation

### User-Initiated Network Activity

The following activities involve network communication and are always user-initiated:

1. **Model Download**: Performed once per model. User specifies the source URL. Uses HTTPS.
2. **Optional Update Check**: Disabled by default. If enabled, makes a single HTTPS request to a user-configured URL.

## Supply Chain Security

ANTIKODE implements the following supply chain security measures:

1. **Dependency Pin**: All dependencies are pinned to specific versions in the build system.
2. **Checksum Verification**: Downloaded artifacts are verified against published checksums.
3. **Source Auditing**: All dependencies are open source and subject to security review.
4. **Minimal Dependency Footprint**: The dependency tree is kept as small as possible to reduce the attack surface.

## Dependency Licenses

| Dependency | License | Copyleft? | Commercial Use? |
|------------|---------|-----------|-----------------|
| llama.cpp | MIT | No | Yes |
| Rust stdlib | MIT/Apache 2.0 | No | Yes |
| serde | MIT/Apache 2.0 | No | Yes |
| tokio | MIT | No | Yes |
| clap | MIT/Apache 2.0 | No | Yes |
| sha2 | MIT/Apache 2.0 | No | Yes |
| hmac | MIT/Apache 2.0 | No | Yes |

## Privacy Compliance of Dependencies

All of ANTIKODE's dependencies have been verified to:

1. Contain no telemetry or analytics code
2. Perform no network communication by default
3. Collect no user data
4. Store no persistent state on behalf of third parties

## Vendor Assessment

For enterprise procurement, the following assessments apply:

**llama.cpp**: Self-contained inference engine. No cloud dependency. No data transmission. Assessed for use in regulated environments including healthcare and financial services.

**Rust Ecosystem**: The Rust standard library and common crates have no network communication capabilities. Assessed for use in high-security environments.

**Models**: Each model is assessed independently. MIT-licensed models (DeepSeek-Coder, StarCoder, Phi-3) present minimal licensing risk. Custom-licensed models (CodeLlama) require individual review.

## Works Cited

Open Source Initiative. "The MIT License." *opensource.org/licenses/MIT*, 2006.

Apache Software Foundation. *Apache License, Version 2.0*. *apache.org/licenses/LICENSE-2.0*, 2004.

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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
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