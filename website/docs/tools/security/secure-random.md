---
sidebar_label: Secure Random
description: Generate cryptographically secure random numbers, strings, UUIDs, and byte sequences suitable for keys, tokens, salts, and nonces.
keywords: [cryptography, security, secure random, hash, encryption, verification, penetration testing, Anticloud]
image: /img/anticloud-social.png
---

# Secure Random

Secure Random provides a cryptographically strong random value generator for security-critical applications. It draws entropy from operating system sources to produce unpredictable output resistant to statistical and cryptographic attacks.

## Features

- Multiple Output Types: Generate integers, byte arrays, hex strings, Base64 tokens, and UUIDv4 values
- Configurable Length: Specify exact output size with support for arbitrary byte lengths
- Entropy Sources: Uses OS-level CSPRNG (/dev/urandom, CryptGenRandom, getrandom)
- Character Sets: Customize allowed characters for password and token generation
- Batch Generation: Produce multiple random values in a single operation with collision statistics

## Workflow

```mermaid
flowchart LR
    A[Generate Request] --> B[Entropy Collection]
    B --> C[CSPRNG Seed]
    C --> D[Output Formatting]
    D --> E[Random Value]
```

## Usage

View the full documentation on GitHub: [Tool Directory](https://github.com/kleinnner/Anticloud/tree/main/12-api-oss-tools/secure-random)

## Related Tools

- [Encrypt Text](../security/encrypt-text)
- [TOTP Generator](../security/totp-generator)
- [Passphrase Generator](../utilities/passphrase-generator)
