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

# Kasteran* — Export Control Compliance
© Lois-Kleinner & 0-1.gg 2026

## Overview

Export control regulations govern the transfer of certain technologies, software, and information across international borders. Kasteran* is designed with export compliance in mind, helping users navigate the complex landscape of the Export Administration Regulations (EAR), International Traffic in Arms Regulations (ITAR), and encryption regulations.

## Export Administration Regulations (EAR)

The EAR, administered by the U.S. Bureau of Industry and Security (BIS), controls the export of dual-use items — goods and technologies that have both commercial and military applications.

### Classification
Kasteran* has undergone self-classification under the EAR. The language and its standard library are classified as EAR99, which covers items not specifically controlled by the EAR. This means:

- No license is required for most export destinations
- Certain destinations (embargoed countries, sanctioned parties) require licenses
- Re-export controls apply to the underlying encryption functionality

### Commerce Control List (CCL)
Items on the CCL require export licenses. Kasteran* does not incorporate any CCL-listed technologies. The language's core functionality - general-purpose programming - falls outside CCL control categories.

## International Traffic in Arms Regulations (ITAR)

ITAR controls the export of defense-related articles and services listed on the United States Munitions List (USML). Kasteran* is not subject to ITAR because:

- The language is not specifically designed for military applications
- It does not incorporate ITAR-controlled technical data
- It is a general-purpose programming language
- Specific applications built with Kasteran* may be ITAR-subject, but the language itself is not

Users developing ITAR-subject applications should consult with export control counsel.

## Encryption Regulations

Encryption software is subject to specific regulatory requirements under the EAR.

### Encryption Item Classification
Kasteran* includes encryption functionality (AES-256, TLS 1.3). These features are classified under ECCN 5A002 / 5D002. However, the Kasteran* encryption implementations qualify for the encryption license exception ENC:

- **Mass market classification**: The encryption is a built-in feature of a general-purpose language, qualifying as mass market
- **Review process**: Kasteran* has submitted the required encryption registration to BIS
- **Notification**: Annual encryption reports are filed as required

### Key Length
All Kasteran* encryption implementations use key lengths that meet or exceed the thresholds for encryption license exceptions:

- AES: 256-bit keys (exceeds 56-bit threshold)
- RSA: 2048-bit and above (exceeds 512-bit threshold)
- ECC: 256-bit and above (exceeds 80-bit threshold)
- TLS: 1.3 with strong cipher suites

### Public Domain Exception
The Kasteran* source code is publicly available under the MIT license. Encryption source code that is publicly available may qualify for the public domain exception to encryption controls, provided that:

- The source code is publicly available without restriction
- The encryption functionality is not being developed or customized for specific government end users
- The public availability is not the result of a knowing export violation

## Sanctioned Parties Screening

Kasteran* does not provide direct sanctioned party screening, but the project recommends:

1. Regular screening of contributors against:
   - Specially Designated Nationals (SDN) List
   - Denied Persons List (DPL)
   - Entity List
   - Unverified List
   - Consolidated Screening List

2. Automated screening in the CI/CD pipeline for third-party dependencies

3. Geographic restrictions on build infrastructure access

## End-Use and End-User Controls

Export controls prohibit exports to certain end users and for certain end uses. Kasteran* users should ensure:

- No use in nuclear weapons activities
- No use in missile technology
- No use in chemical or biological weapons
- No use by sanctioned entities or individuals

## Deemed Exports

The concept of deemed exports applies when controlled technology is released to foreign nationals within the United States. Kasteran* open source development model means:

- Contributions from foreign nationals may be deemed exports
- The EAR99 classification generally resolves this concern for Kasteran*
- Encryption review ensures compliance with deemed export rules for cryptographic features

## Re-Export Controls

Kasteran* re-export is subject to the same controls as direct export. Users re-exporting Kasteran* (e.g., as part of a larger product) should:

- Verify the destination is not embargoed
- Screen the end user against sanctions lists
- Ensure the end use is not prohibited
- Maintain records of re-export transactions

## Record-Keeping

Export regulations require maintaining records of export transactions. Kasteran* supports this through:

- Download tracking for release artifacts
- Contributor origin tracking
- License and classification documentation
- Encryption registration records

## Best Practices

Kasteran* recommends the following export compliance practices:

1. **Classify your product**: Determine the ECCN and EAR classification
2. **Screen all parties**: Check end users and end uses
3. **Maintain records**: Keep export records for at least 5 years
4. **Train personnel**: Ensure export compliance training for developers
5. **Review encryption**: Verify encryption compliance for all cryptographic features
6. **Consult counsel**: Work with export control counsel for specific questions

## Conclusion

Kasteran* is designed to minimize export control burdens while maintaining full compliance with EAR, ITAR, and encryption regulations. The language's EAR99 classification and mass market encryption exception simplify compliance for most users.

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
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
