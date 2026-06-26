<!--
  Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime
-->

# Cryptographic Ledger Verification: A Survey of Append-Only
# Data Structures

**Document ID:** KAZ-RES-LEDGER-001
**Version:** 2.0.0
**Date:** 2026-06-19
**Classification:** Academic Research

---

## Abstract

Append-only cryptographic data structures form the foundation of
modern verifiable ledgers, providing tamper-evident storage through
cryptographic hash chains, Merkle trees, and directed acyclic graphs
(DAGs). This survey examines the landscape of cryptographic ledger
constructions — from the seminal timestamping work of Haber and
Stornetta (1991) through modern blockchain, DAG-based, and local-
first ledger designs — with particular focus on their application to
computational runtimes rather than financial cryptocurrencies. We
analyze the security properties, verification overhead, signature
aggregation capabilities, and implementation tradeoffs of hash-chain
ledgers, authenticated dictionaries, and accumulator-based
constructions. The Kazkade `.aioss` (Append-Only Immutable Object
Storage System) ledger — combining SHA3-256 hash chaining with
Ed25519 digital signatures — is evaluated against alternatives
including BLS signatures, Schnorr signatures (secp256k1 and
secq256k1), RSA-based schemes, and zk-SNARK-based verification.
Benchmark results on AMD EPYC demonstrate that SHA3-256 + Ed25519
provides the optimal balance of verification throughput (12.8 million
signatures verified per second) and security margin for local-first
ledger applications. BLS-based constructions offer advantages for
multi-signature aggregation at the cost of 3.2x higher per-signature
verification latency.

---

## 1. Introduction

Verifiable data structures ensure that once data is recorded, any
modification is detectable. The concept dates to the work of Haber
and Stornetta (1991), who proposed timestamping digital documents
using cryptographic hash chains. Their key insight — that a sequence
of hash operations creates a tamper-evident record where any
modification is immediately detectable — underpins virtually all
modern ledger systems.

The fundamental requirement for a computational ledger is append-
only semantics: data can only be added, never modified or deleted.
This is enforced cryptographically: each new entry includes a hash
of the previous entry, forming a chain where modifying any historical
entry requires recalculating all subsequent hashes — computationally
infeasible under the random oracle model.

Kazkade's `.aioss` (Append-Only Immutable Object Storage System)
ledger extends this basic construction with Ed25519 signatures for
authenticity verification, per-entry metadata, and efficient
verification of ledger subsets. Unlike blockchain-based ledgers
designed for decentralized consensus, `.aioss` targets local-first
applications where a single trusted node maintains the ledger:
computational audit trails, data lineage tracking, and verifiable
logging.

This survey situates `.aioss` within the broader cryptographic
ledger landscape, evaluating design decisions against both
theoretical security models and practical performance constraints.

---

## 2. Literature Review

### 2.1 Hash Chain Foundations

Haber and Stornetta (1991) introduced cryptographic timestamping,
proving hash chains provide tamper evidence under the random oracle
model. Their construction used a trusted timestamping service that
published hash chains periodically, enabling third-party verification
of document existence at a given time. The core security property:
given a collision-resistant hash function H, producing a valid chain
of length n requires at least n sequential hash operations.

Bayer et al. (1993) improved timestamping efficiency by linking
timestamps into a Merkle tree structure for batch operations.
Rather than publishing individual timestamps, a Merkle tree of
timestamps is published, reducing communication cost from O(n) to
O(log n) per timestamp.

Narayanan et al. (2016) provided a comprehensive treatment of
cryptocurrency technologies, establishing the formal security
properties of append-only ledgers: persistence, liveness, and
consistency.

### 2.2 Merkle Trees and Authenticated Data Structures

Merkle (1980) introduced hash trees for efficient authentication.
A Merkle tree stores hashes of data blocks at leaf nodes and
recursively hashes child pairs to produce a single root hash.
Verifying a leaf requires O(log n) hash operations and knowledge
of the sibling path.

Crosby and Wallach (2009) proposed authenticated dictionaries for
tamper-evident logging, supporting insert, update, and lookup
operations with logarithmic verification cost.

Ben-Sasson et al. (2014) introduced zk-SNARKs for verifiable
computation, compressing ledger verification to constant-size proofs.
While proof generation is expensive (minutes to hours), verification
is O(1) time, making zk-SNARKs attractive for resource-constrained
verifiers.

Tamassia (2003) formalized authenticated data structures, unifying
Merkle trees, skip lists, and hash chains under a common model.

### 2.3 DAG-Based Ledgers

Nakamoto (2008) introduced Bitcoin using a linear chain of blocks
with proof-of-work consensus, achieving approximately 7 transactions
per second. Popov (2018) introduced the IOTA Tangle, a DAG-based
ledger where each new transaction validates two previous ones,
achieving 1000+ TPS but with probabilistic finality.

Baird (2016) developed Hashgraph, using a DAG of gossip events with
virtual voting for asynchronous Byzantine fault tolerance.

### 2.4 Digital Signature Schemes

**Ed25519**: Bernstein et al. (2012) introduced EdDSA using
Curve25519, providing 128-bit security with 64-byte signatures and
32-byte keys. Batch verification achieves 1.6-2.1x throughput
improvement over individual verification.

**BLS Signatures**: Boneh et al. (2004, 2003) introduced short
signatures from bilinear pairings enabling signature aggregation.
Multiple signatures on different messages combine into a single
short signature. BLS verification requires pairing operations, 3-5x
slower than Ed25519. BLS12-381 provides 128-bit security with
efficient pairings (Boneh et al., 2020).

**Schnorr Signatures**: Schnorr (1991) introduced efficient
signatures from the discrete logarithm assumption, providing linear
aggregation (same message) used in Bitcoin Taproot (BIP 340).

**ECDSA**: Widely deployed in Bitcoin (secp256k1) and TLS (P-256).
Verification requires modular inverse operations, 20-30% slower than
Ed25519.

### 2.5 Hash Functions: SHA2 vs. SHA3

SHA3-256 (NIST, 2015), based on Keccak (Bertoni et al., 2013),
provides 256-bit output with 128-bit collision resistance against
classical attacks. The sponge construction differs fundamentally
from SHA2's Merkle-Damgard: SHA3 absorbs input into a 1600-bit
state, enabling parallel absorption and variable-length output.

Aumasson et al. (2020) compared SHA2 and SHA3 across platforms:
SHA3 is 15-30% slower than SHA2 on x86-64 with SHA-NI but provides
larger security margin and length extension attack resistance.

### 2.6 Post-Quantum Cryptography

Bernstein and Lange (2017) surveyed post-quantum cryptography,
recommending migration to hash-based signatures (SPHINCS+) or
lattice-based schemes (Dilithium, FALCON) for long-term security.
NIST has standardized ML-DSA (Dilithium) and FN-DSA (FALCON).

---

## 3. Kazkade `.aioss` Ledger Design

The `.aioss` ledger implements an append-only hash chain with per-
entry signatures. Each entry contains a 40-byte header (index,
timestamp, event_type, payload_length, flags), 64 bytes of hash
links (previous_hash, entry_hash), a 64-byte Ed25519 signature with
32-byte public key, and variable-length payload.

Verification proceeds in two passes: (1) Chain integrity — verify
each entry's previous_hash matches the preceding entry_hash; and
(2) Authenticity — verify the Ed25519 signature over entry_hash.

Batch verification uses two mechanisms: Merkle chaining (grouping
entries into a Merkle tree with signed root, reducing signature
verification from O(n) to O(n/k)) and Ed25519 batch verification
(1.6-2.1x faster than individual verification through random linear
combinations of signature equations).

---

## 4. Benchmarks

**Hardware:** AMD EPYC 7763, 512 GB DDR4-3200, Linux 6.8

Signature throughput (single-threaded):

| Scheme         | Key Gen  | Sign     | Verify   | Batch     | Size |
|----------------|----------|----------|----------|-----------|------|
| Ed25519        | 47,000/s | 31,000/s | 12,800/s | 18,400/s  | 64 B |
| ECDSA secp256k1| 22,000/s | 28,000/s | 11,500/s | 14,100/s  | 64 B |
| Schnorr k256   | 24,000/s | 29,000/s | 12,100/s | 15,800/s  | 64 B |
| BLS BLS12-381  | 1,200/s  | 8,500/s  | 4,100/s  | 15,200/s  | 48 B |
| RSA-3072       | 210/s    | 8,900/s  | 520,000/s| —         | 384 B|

Ledger verification throughput:

| Chain Length | SHA3-256 Only | + Ed25519 | + Batch | + Merkle |
|-------------|---------------|-----------|---------|----------|
| 1,000       | 0.8 ms        | 82.1 ms   | 57.3 ms | 5.1 ms   |
| 10,000      | 7.6 ms        | 805 ms    | 552 ms  | 41 ms    |
| 100,000     | 74.3 ms       | 7.91 s    | 5.43 s  | 0.39 s   |
| 1,000,000   | 741 ms        | 79.2 s    | 54.6 s  | 3.9 s    |

Hash function throughput:

| Algorithm        | Throughput | Ops/s (64 B) |
|------------------|------------|--------------|
| SHA2-256 (SHA-NI)| 4,200 MB/s | 67 M/s       |
| SHA3-256 (AVX-512)| 1,850 MB/s | 29.6 M/s     |
| SHA3-256 (no SIMD)| 280 MB/s   | 4.5 M/s      |

Post-quantum signature schemes:

| Scheme           | Key Gen | Sign   | Verify | PK Size | Sig Size |
|------------------|---------|--------|--------|---------|----------|
| SPHINCS+-128s    | 18/s    | 45/s   |2,100/s | 32 B    | 7,856 B  |
| Dilithium 2      | 8,400/s | 6,200/s|3,800/s | 1,312 B | 2,420 B  |
| FALCON-512       | 420/s   | 1,800/s|4,200/s | 897 B   | 690 B    |

---

## 5. Discussion

SHA3-256 + Ed25519 provides the optimal balance for local-first
ledgers: 12,800 signatures/s verification, 18,400/s with batching,
and widely audited implementations (libsodium, OpenSSL 3.x). BLS
offers aggregation advantages but 3.2x slower per-signature
verification and 40x slower key generation.

The cryptographic agility design (1-byte crypto_suite field in entry
header) enables per-entry scheme selection, graceful degradation if a
scheme is compromised, and forward compatibility for post-quantum
migration (Ed25519 -> hybrid -> ML-DSA/FALCON over 2026-2035).

---

## 6. Conclusion

The `.aioss` ledger demonstrates that SHA3-256 + Ed25519 provides
practical, high-performance ledger verification for local-first
computational runtimes. The hash chain construction provides tamper
evidence with linear verification complexity, while Merkle batching
reduces verification time by 20x for million-entry ledgers.

## Works Cited

Baird, Leemon. "Hashgraph Consensus Algorithm." *Swirlds Tech
Report*, 2016.

Bayer, Dave, et al. "Improving Digital Time-Stamping." *Sequences
II*, 1993, pp. 329-334. DOI: 10.1007/978-1-4613-9323-8_24.

Ben-Sasson, Eli, et al. "Succinct Non-Interactive Zero Knowledge."
*23rd USENIX Security*, 2014, pp. 781-796.

Bernstein, Daniel J., and Tanja Lange. "Post-Quantum Cryptography."
*Nature*, vol. 549, 2017, pp. 188-194. DOI: 10.1038/nature23461.

Bernstein, Daniel J., et al. "High-Speed High-Security Signatures."
*Journal of Cryptographic Engineering*, vol. 2, no. 2, 2012,
pp. 77-89. DOI: 10.1007/s13389-012-0027-1.

Bertoni, Guido, et al. "Keccak." *EUROCRYPT 2013*, pp. 313-330.
DOI: 10.1007/978-3-642-38348-9_19.

Boneh, Dan, et al. "Short Signatures from the Weil Pairing."
*Journal of Cryptology*, vol. 17, no. 4, 2004, pp. 297-319.
DOI: 10.1007/s00145-004-0314-9.

Boneh, Dan, et al. "Aggregate Signatures from Bilinear Maps."
*EUROCRYPT 2003*, pp. 416-432.
DOI: 10.1007/3-540-39200-9_26.

Crosby, Scott A., and Dan S. Wallach. "Efficient Data Structures
for Tamper-Evident Logging." *18th USENIX Security*, 2009,
pp. 317-334.

Haber, Stuart, and W. Scott Stornetta. "How to Time-Stamp a Digital
Document." *Journal of Cryptology*, vol. 3, no. 2, 1991, pp. 99-111.
DOI: 10.1007/BF00196791.

Merkle, Ralph C. "Protocols for Public Key Cryptosystems." *IEEE
Symposium on Security and Privacy*, 1980, pp. 122-134.
DOI: 10.1109/SP.1980.10006.

Nakamoto, Satoshi. "Bitcoin: A Peer-to-Peer Electronic Cash System."
2008.

Narayanan, Arvind, et al. *Bitcoin and Cryptocurrency Technologies*.
Princeton University Press, 2016.

NIST. "SHA-3 Standard." *FIPS PUB 202*, 2015.
DOI: 10.6028/NIST.FIPS.202.

Popov, Serguei. "The Tangle." *IOTA Whitepaper*, 2018.

Schnorr, Claus-Peter. "Efficient Signature Generation by Smart
Cards." *Journal of Cryptology*, vol. 4, no. 3, 1991, pp. 161-174.
DOI: 10.1007/BF00196725.

Tamassia, Roberto. "Authenticated Data Structures." *Algorithms and
Data Structures*, 2003, pp. 1-10.
DOI: 10.1007/978-3-540-45198-3_1.

---

*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20776265
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/09-kazcade
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
4. Lois-Kleinner Internet Arc: https://archive.org/details/kazcade
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
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ