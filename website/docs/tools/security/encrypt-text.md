---
sidebar_label: Encrypt Text
description: Instantly encrypt and decrypt text strings using industry-standard algorithms with support for custom keys, salts, and encoding formats.
keywords: [cryptography, security, encrypt text, hash, encryption, verification, penetration testing, Anticloud]
image: /img/anticloud-social.png
---

# Encrypt Text

Encrypt Text provides a lightweight utility for applying cryptographic transformations to text data directly in your browser or CLI. It supports multiple symmetric and asymmetric algorithms for ad-hoc encryption needs.

## Features

- Multi-Algorithm Support: AES-256, ChaCha20, RSA-OAEP, and elliptic curve encryption
- Key Management: Generate, import, or derive encryption keys from passphrases
- Encoding Options: Output as Base64, Hex, or binary with configurable character sets
- Clipboard Integration: One-click copy of encrypted output or decrypted plaintext
- Offline Operation: All encryption happens locally with no data sent to external servers

## Workflow

```mermaid
flowchart LR
    A[Plaintext Input] --> B[Algorithm Selection]
    B --> C[Key/Salt Configuration]
    C --> D[Encryption Engine]
    D --> E[Ciphertext Output]
```

## Usage

View the full documentation on GitHub: [Tool Directory](https://github.com/kleinnner/Anticloud/tree/main/12-api-oss-tools/encrypt-text)

## Related Tools

- [Secure Random](../security/secure-random)
- [Hash Checker](../security/hash-checker)
- [Credential Vault](../security/credential-vault)
