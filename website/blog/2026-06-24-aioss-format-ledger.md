---
title: aioss-format — Tamper-Evident Proof-of-Usefulness Ledger
description: Deep dive into the .aioss format, a cryptographic ledger format that chains SHA3-256 hashes and Ed25519 signatures to create tamper-evident proof-of-usefulness records for AI, compliance, and audit workflows.
authors: [kleinner]
tags: [aioss-format, cryptographic-ledger, tamper-evident, sha3-256, ed25519, proof-of-usefulness, blockchain, audit]
image: /img/anticloud-social.png
---

# aioss-format — Tamper-Evident Proof-of-Usefulness Ledger

The `.aioss` format is the cryptographic backbone of the Anticloud ecosystem. It's a tamper-evident ledger format that chains SHA3-256 hashes and Ed25519 signatures into an immutable sequence — without the energy waste or complexity of conventional blockchains.

{/* truncate */}

## What is a Proof-of-Usefulness Ledger?

Unlike proof-of-work or proof-of-stake, the `.aioss` format implements proof-of-usefulness: each ledger entry contains a cryptographic hash of meaningful work — a build artifact, an audit finding, a model training checkpoint, or a compliance report. The ledger doesn't just prove that work happened; it proves what the work produced and who produced it.

```mermaid
flowchart LR
    subgraph "aioss Chain Structure"
        E1[Entry 1\nHash: ABC\nSig: Key_A] -->|SHA3-256| E2[Entry 2\nHash: DEF\nSig: Key_B]
        E2 -->|SHA3-256| E3[Entry 3\nHash: GHI\nSig: Key_C]
        E3 -->|SHA3-256| E4[Entry 4\nHash: JKL\nSig: Key_D]
    end
    E1 -->|Genesis| AF[.aioss Ledger File]
```

## How It Works

Each `.aioss` entry contains:

- **Previous hash**: SHA3-256 of the preceding entry's full content
- **Timestamp**: Unix epoch in nanoseconds
- **Public key**: Ed25519 public key of the signing entity
- **Signature**: Ed25519 signature over the entry fields
- **Payload hash**: SHA3-256 of the associated work artifact
- **Metadata**: Type tag, version, and optional reference URL

The chain structure ensures that modifying any entry invalidates all subsequent entries. Verification requires only the public keys of the signers — no network consensus, no mining, no global state.

## Applications Across the Ecosystem

### Build Integrity

Every Anticloud project signs build artifacts with `.aioss` entries. Users verify that the binary they downloaded matches the source exactly, with a cryptographic chain back to the original commit.

```
Binary → SHA3-256 → Payload hash → .aioss entry → Git commit
```

### AI Training Verification

Integ11ect logs each model training run to a `.aioss` chain. The ledger records the training data hash, model architecture hash, hyperparameters, and test results. This creates a verifiable, tamper-evident audit trail for AI governance.

### Compliance Audits

Compliance tools like the SSP Generator and Compliance Gap Analyzer output `.aioss`-signed reports. Auditors verify report integrity without needing to trust the tool that generated it.

```mermaid
flowchart LR
    subgraph "Compliance Pipeline"
        CG[Compliance\nGenerator] -->|Generate| RPT[SSP Report\nJSON]
        RPT -->|Hash| H[SHA3-256]
        H -->|Sign| AIOSS[.aioss Entry]
        AIOSS -->|Chain| CHAIN[Ledger File]
    end
    AUDITOR[Auditor] -->|Verify| CHAIN
    AUDITOR -->|Compare| RPT
```

## Why Not a Blockchain?

Conventional blockchains solve the Byzantine Generals Problem — agreeing on state across untrusted parties. The `.aioss` format solves a different problem: proving that a specific piece of work happened at a specific time by a specific identity. Blockchain overhead (consensus, mining, gas fees, forks) is unnecessary when the goal is individual verifiability, not global consensus.

## Format Specification

An `.aioss` file is a sequence of newline-delimited JSON objects:

```json
{"prev":"abc123...","time":1719212345678,"key":"ed25519:...","sig":"sig:...","payload":"sha256:...","type":"build-artifact","ver":"1.0"}
```

Each entry is self-contained: the `prev` field references the previous entry's SHA3-256, the `key` identifies the signer, and the `sig` proves the entry was authorized by that key.

## Getting Started

The `.aioss` format specification and reference implementation are available on GitHub:

```
git clone https://github.com/kleinnner/Anticloud.git
cd Anticloud/05-aioss-format
```

See the [aioss-format documentation](/docs/projects/aioss-format) for the complete specification and integration guide.

## Related Projects

- [Integ11ect](/docs/projects/inte11ect) — AI gateway with .aioss training audit trails
- [Kathon](/docs/projects/kathon) — Anti-enshittification engine logs detections to .aioss
- [SSP Generator](/docs/tools/compliance/ssp-generator) — Compliance reports signed with .aioss
<script type="application/ld+json">
  {JSON.stringify({"@context":"https://schema.org","@type":"Article","headline":"aioss-format — Tamper-Evident Proof-of-Usefulness Ledger","datePublished":"2026-06-24T00:00:00.000Z","author":{"@type":"Person","name":"Lois-Kleinner","url":"https://github.com/kleinnner"},"publisher":{"@type":"Organization","name":"Anticloud","url":"https://0-1.gg/"},"image":"https://0-1.gg/img/anticloud-social.png","url":"https://0-1.gg/blog/2026-06-24/aioss-format-ledger"})}
</script>