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

# Kasteran* — Localization
© Lois-Kleinner & 0-1.gg 2026

## Overview

Localization makes Kasteran* accessible to developers worldwide by translating documentation, error messages, and tooling into multiple languages. This document describes the translation process, internationalization (i18n) support, and locale maintenance.

## Supported Languages

Kasteran* documentation and tooling are available in:

| Language | Code | Status | Maintainer |
|---|---|---|---|
| English | en | Complete | Core team |
| Chinese (Simplified) | zh-CN | Complete | Community |
| Spanish | es | Complete | Community |
| Japanese | ja | Complete | Community |
| French | fr | In progress | Community |
| German | de | In progress | Community |
| Portuguese (Brazil) | pt-BR | In progress | Community |
| Korean | ko | In progress | Community |
| Russian | ru | In progress | Community |
| Arabic | ar | Planned | Seeking maintainer |

## Internationalization (i18n) Architecture

Kasteran* i18n is built into the compiler and tooling:

### Locale Detection
```
// Auto-detect or explicit
kasteran build --locale zh-CN
```

### Translation Files
Translations are stored in locale-specific files:
```
locales/
├── en/
│   ├── errors.toml       # Error messages
│   ├── tooling.toml      # CLI messages
│   └── docs/             # Documentation
├── zh-CN/
│   ├── errors.toml
│   ├── tooling.toml
│   └── docs/
└── ...
```

### Message Format
```toml
# errors.toml (English)
[KRN-E0001]
message = "Type mismatch: expected `{expected}`, found `{actual}`"
hint = "Try converting the type with `{actual}.to_{expected}()`"

# errors.toml (Chinese Simplified)
[KRN-E0001]
message = "类型不匹配：期望 `{expected}`，发现 `{actual}`"
hint = "尝试使用 `{actual}.to_{expected}()` 进行类型转换"
```

## Translation Process

### 1. Identify Content for Translation
- Error messages
- CLI output
- Documentation
- Website content
- Tutorials and guides

### 2. Translation Platform
We use a collaborative translation platform:
- [Crowdin](https://crowdin.com) or similar
- Translation memory for consistency
- Glossary for technical terms
- Version control integration

### 3. Translation Workflow
```
Source (English) → Translation → Review → Approval → Published
                        ↓
                   Glossary check
                   Consistency check
                   Technical accuracy check
```

### 4. Review Process
- Translations require at least 2 reviewers
- One reviewer must be a native speaker
- One reviewer must have technical knowledge
- Review for accuracy, consistency, and readability

## Contributing Translations

### How to Help
1. Join the translation team on Crowdin
2. Claim a language or content area
3. Start translating
4. Submit for review
5. Iterate based on feedback

### Translation Guidelines
- Maintain technical accuracy
- Use consistent terminology (see glossary)
- Keep messages concise (especially error messages)
- Preserve placeholders ({variable})
- Consider cultural context
- Maintain markdown formatting

## Glossary Management

A centralized glossary ensures consistent translations:

```toml
[compiler]
en = "compiler"
zh-CN = "编译器"
es = "compilador"

[type_system]
en = "type system"
zh-CN = "类型系统"
es = "sistema de tipos"
```

## Locale Maintenance

### Keeping Translations Current
- When source strings change, translations are flagged as outdated
- Translators are notified of changes
- Outdated translations fall back to English
- Monthly review of translation coverage

### Quality Metrics
```
locale: zh-CN
coverage: 92%
last_updated: 2026-06-01
outdated_strings: 3
maintainer: @translator_zh
```

## Building with Localization

```
kasteran build --locale fr
# Error messages and output in French
```

## Conclusion

Kasteran* localization makes the language accessible to developers worldwide. Community contributions are essential for expanding language coverage and maintaining translation quality.

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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
