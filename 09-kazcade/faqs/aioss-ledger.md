<!--
  ▄▄   ▄▄▄                      ▄▄                        ▄▄                     
  ██  ██▀                       ██                        ██                     
  ▄▄▄█  ██▄██      ▄█████▄  ████████  ██ ▄██▀    ▄█████▄   ▄███▄██   ▄████▄   █▄▄▄     
  ▄▄█▀▀▀    █████      ▀ ▄▄▄██      ▄█▀   ██▄██      ▀ ▄▄▄██  ██▀  ▀██  ██▄▄▄▄██    ▀▀▀█▄▄ 
  ▀▀█▄▄▄    ██  ██▄   ▄██▀▀▀██    ▄█▀     ██▀██▄    ▄██▀▀▀██  ██    ██  ██▀▀▀▀▀▀    ▄▄▄█▀▀ 
      ▀▀▀█  ██   ██▄  ██▄▄▄███  ▄██▄▄▄▄▄  ██  ▀█▄   ██▄▄▄███  ▀██▄▄███  ▀██▄▄▄▄█  █▀▀▀     
           ▀▀    ▀▀   ▀▀▀▀ ▀▀  ▀▀▀▀▀▀▀▀  ▀▀   ▀▀▀   ▀▀▀▀ ▀▀    ▀▀▀ ▀▀    ▀▀▀▀▀
  Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime
-->

# .aioss Ledger FAQ

## What is .aioss?
An `.aioss` file is a **tamper-evident ledger** that chains together records using cryptographic hashes. Each record (or "block") contains a timestamp, payload, the hash of the previous block, and an Ed25519 signature. The format is designed for lightweight auditing — no full blockchain, no consensus, no P2P networking. Just a verifiable, append-only chain of facts.

## How does the hash chain work?
Each block stores `prev_hash` (SHA-256 of the preceding block's header), `timestamp`, `payload` (arbitrary bytes), and `signature` (Ed25519 of this block's header). The chain's root hash is the hash of block 0 (which has `prev_hash = 0000...`). To verify the chain, the runtime walks from block 0 to the last block, recomputing every hash and checking every signature. Any mismatch causes the chain to be marked `TAMPERED`.

## What is Ed25519 signing?
Ed25519 is a high-security elliptic-curve digital signature scheme (Curve25519 + SHA-512). Kazkade uses it to sign each ledger block with the ledger creator's private key. The corresponding public key is embedded in the `.aioss` file header. Verification ensures that (a) the block content hasn't changed since signing and (b) the signer held the private key at the time of signing. Ed25519 signatures are compact (64 bytes) and fast to verify (~100k+ verifications/second per core).

## How do I verify a ledger?
```
kazkade ledger verify path/to/ledger.aioss
```
This returns one of three statuses: **OK** (chain intact and all signatures valid), **TAMPERED** (hash mismatch or bad signature found), or **PARTIAL** (some blocks verified but chain terminated early). Use `--verbose` to see which block failed. You can also supply the expected public key with `--expect-pubkey` to verify the identity of the signer.

## What does "TAMPERED" mean?
If `kazkade ledger verify` reports `TAMPERED`, at least one block in the chain has been modified after signing — the hash of a block does not match the `prev_hash` stored in the next block, or a signature fails to verify. This means the ledger's integrity is compromised. A `TAMPERED` ledger should not be trusted for auditing or evidentiary purposes.

## Can I use .aioss for auditing?
Yes. The `.aioss` format was designed specifically for lightweight, non-repudiable audit trails. Common use cases include: log file integrity verification, pipeline artifact provenance, financial transaction logs, and timestamped document chains. Because each block is independently signed, you can selectively verify subsets of the chain. The format is open and self-describing — no external database or blockchain node is required.

## Can I create and sign ledgers programmatically?
Yes. Use `kazkade ledger create` to initialise a new chain and `kazkade ledger append` to add signed records. The keypair can be generated with `kazkade ledger gen-key`. For automated pipelines, pass `--key-file` to sign without interactive prompts.

---
*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

