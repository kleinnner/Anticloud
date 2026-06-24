---
title: "SECURITY & LEDGER — FREQUENTLY ASKED QUESTIONS"
sidebar_position: 6
description: "Each ledger entry contains the SHA-256 hash of the previous entry, forming a chain. Tampering with any entry changes its hash and breaks the chain. Verification is built in: `api-oss ledger verify`."
tags: [faq]
---

# SECURITY & LEDGER — FREQUENTLY ASKED QUESTIONS

## Is the .aioss ledger truly tamper-proof?

Each ledger entry contains the SHA-256 hash of the previous entry, forming a chain. Tampering with any entry changes its hash and breaks the chain. Verification is built in: `api-oss ledger verify`.

## Does API-SOS send my data anywhere?

Never. API-SOS has no telemetry, analytics, or cloud dependency. All data stays on your hardware.

## What happens if the ledger is tampered with?

The ledger verify command (`api-oss ledger verify`) will report the exact entry where the chain breaks. You can trace back to the last valid entry and identify which entry was altered.

## Can the ledger be encrypted?

The ledger files themselves are plain JSON (for portability). If you require encryption at rest, place the `data/ledger` directory on an encrypted filesystem (BitLocker, LUKS, FileVault).

## What is TPM attestation?

Trusted Platform Module attestation verifies that the system hardware and firmware have not been tampered with. API-SOS can integrate with TPM 2.0 to provide hardware-rooted trust for the ledger and decision outputs.

## How does model signing work?

Models can be signed with an Ed25519 keypair. The signature is verified at load time. If the model binary or signature is invalid, the gateway refuses to load it. See the ModelSigning view in the frontend.

## Are WebSocket connections encrypted?

Yes, if TLS is enabled in the config (`tls.enabled: true`). Without TLS, WebSocket connections are unencrypted (ws://) and should only be used on localhost or trusted networks.

## How do I rotate the ledger's time source?

Set `ledger.time_source` to `system` (default), `ntp`, or `custom`. If using `custom`, provide the offset via `ledger.time_offset_secs`. This is useful when the system clock is unreliable or deliberately skewed.

## What is the contradiction engine?

The contradiction engine is a three-layer system that scans decisions and outputs for logical inconsistencies, factual contradictions, and policy violations. It runs on a configurable interval (`contradiction_engine.scan_interval_ms`, default 60 seconds).

## See Also

Related FAQ, support, and troubleshooting documentation.

- [FAQ Index](../faq/01-general.md)
- [Support Guide](../support/01-getting-help.md)
- [Troubleshooting](../troubleshooting/01-app-wont-start.md)
- [User Manual](../user-manual/01-getting-started.md)
