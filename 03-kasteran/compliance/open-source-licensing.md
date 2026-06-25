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

# Kasteran* — Open Source Licensing Compliance
© Lois-Kleinner & 0-1.gg 2026

## Overview

Open source licensing compliance is critical for any software project. Kasteran* itself is released under the MIT license, and it provides tooling to help users manage license compliance for their own projects. This document covers the Kasteran* license, compatibility with other licenses, and dependency auditing.

## Kasteran* License: MIT

Kasteran* is licensed under the MIT License, one of the most permissive open source licenses. The MIT license grants:

- **Permission to use, copy, modify, merge, publish, distribute, sublicense, and sell** copies of the software
- **Attribution requirement**: The copyright notice and permission notice must be included in all copies or substantial portions
- **No warranty**: The software is provided as-is without warranty of any kind

The MIT license was chosen to maximize adoption and contribution. It allows commercial use, private use, and redistribution with minimal restrictions.

## License Compatibility

Understanding license compatibility is essential when combining Kasteran* with other open source components.

### MIT Compatibility
The MIT license is compatible with virtually all open source licenses. MIT-licensed code can be:
- Combined with GPL-licensed code (though the combined work must comply with GPL terms)
- Combined with Apache 2.0-licensed code
- Used in proprietary software
- Subl licensed under different terms

### Apache 2.0 Compatibility
Apache 2.0 is compatible with the MIT license. Both are permissive licenses with similar requirements. Kasteran* code can be combined with Apache 2.0-licensed dependencies. Note that Apache 2.0 includes a patent grant clause that provides additional protections.

### GPL Compatibility
The GNU General Public License (GPL) has specific compatibility considerations:

- **GPL v2**: MIT-licensed code can be combined with GPL v2 code. The combined work must be distributed under GPL v2 terms.
- **GPL v3**: Similar to v2, with additional requirements regarding patent retaliation and anti-circumvention.
- **LGPL**: The Lesser GPL allows linking from MIT-licensed code without requiring the MIT code to adopt LGPL terms.

### AGPL Compatibility
The Affero GPL requires that users who interact with the software over a network receive the source code. MIT-licensed Kasteran* code can be combined with AGPL code, but the combined work must be distributed under AGPL terms.

## Dependency Auditing

Kasteran* includes a built-in dependency auditing system that tracks the licenses of all dependencies.

### Software Bill of Materials (SBOM)
Every Kasteran* project can generate an SBOM that includes:

- Dependency names and versions
- License information for each dependency
- Dependency relationships (direct vs transitive)
- Vulnerability information from known databases

The SBOM is generated in CycloneDX and SPDX formats for compatibility with industry tooling.

### License Scanner
The license scanner checks all dependencies against a known license database:

```
kasteran audit licenses
```

This command scans the dependency tree and reports:
- License names and URLs
- Compatibility issues between licenses
- Missing license information
- Copyleft license detection
- Patent grant information

### Compliance Reports
The auditing system can generate compliance reports that document:

- License obligations for each dependency
- Attribution requirements and their fulfillment status
- Source code availability requirements
- Modification disclosure requirements

## Obligation Management

Different licenses impose different obligations. Kasteran* helps manage these obligations:

### Attribution
Collecting and reproducing copyright notices. Kasteran* can automatically generate attribution notices for all dependencies.

### Copyleft Disclosure
For copyleft dependencies, Kasteran* can package the required source code alongside the distributed binary.

### Patent Grants
Apache 2.0 and GPL v3 include patent grants. Kasteran* tracks these and can generate patent notices.

### Warranty Disclaimers
The license scanner ensures that warranty disclaimers are included for all dependencies.

## Best Practices

Kasteran* recommends the following license compliance practices:

1. **Maintain an SBOM**: Generate and update the SBOM with every build
2. **Audit before release**: Run the license scanner before any release
3. **Track transitive dependencies**: Licenses of transitive dependencies matter
4. **Document license decisions**: Record the rationale for license choices
5. **Review license compatibility**: Before combining code from different sources
6. **Include notices**: Ensure all required notices are included in distribution

## Third-Party Code Management

When incorporating third-party code, Kasteran* provides:

- License validation during dependency resolution
- Automatic generation of license files
- Compatibility warnings for conflicting licenses
- Legal review workflow integration

## Conclusion

Kasteran* makes open source license compliance manageable through automated tooling and comprehensive SBOM generation. The MIT license provides maximum flexibility for users while the auditing system helps ensure that all obligations are met.

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
