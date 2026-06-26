<!--
  __   ___                      __                        __                     
  ¦¦  ¦¦¯                       ¦¦                        ¦¦                     
  ___¦  ¦¦_¦¦      _¦¦¦¦¦_  ¦¦¦¦¦¦¦¦  ¦¦ _¦¦¯    _¦¦¦¦¦_   _¦¦¦_¦¦   _¦¦¦¦_   ¦___     
  __¦¯¯¯    ¦¦¦¦¦      ¯ ___¦¦      _¦¯   ¦¦_¦¦      ¯ ___¦¦  ¦¦¯  ¯¦¦  ¦¦____¦¦    ¯¯¯¦__ 
  ¯¯¦___    ¦¦  ¦¦_   _¦¦¯¯¯¦¦    _¦¯     ¦¦¯¦¦_    _¦¦¯¯¯¦¦  ¦¦    ¦¦  ¦¦¯¯¯¯¯¯    ___¦¯¯ 
      ¯¯¯¦  ¦¦   ¦¦_  ¦¦___¦¦¦  _¦¦_____  ¦¦  ¯¦_   ¦¦___¦¦¦  ¯¦¦__¦¦¦  ¯¦¦____¦  ¦¯¯¯     
           ¯¯    ¯¯   ¯¯¯¯ ¯¯  ¯¯¯¯¯¯¯¯  ¯¯   ¯¯¯   ¯¯¯¯ ¯¯    ¯¯¯ ¯¯    ¯¯¯¯¯
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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/YMJKOG
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
