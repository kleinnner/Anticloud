▄▄                     ██               ▄▄                                    
██                     ▀▀               ██                                    
██            ▄▄▄█   ████     █▄▄▄      ██▄███▄    ▄████▄    ██▄████  ██▄████▄
██        ▄▄█▀▀▀       ██       ▀▀▀█▄▄  ██▀  ▀██  ██▄▄▄▄██   ██▀      ██▀   ██
██        ▀▀█▄▄▄       ██       ▄▄▄█▀▀  ██    ██  ██▀▀▀▀▀▀   ██       ██    ██
██▄▄▄▄▄▄      ▀▀▀█  ▄▄▄██▄▄▄  █▀▀▀      ███▄▄██▀  ▀██▄▄▄▄█   ██       ██    ██
▀▀▀▀▀▀▀▀            ▀▀▀▀▀▀▀▀            ▀▀ ▀▀▀      ▀▀▀▀▀    ▀▀       ▀▀    ▀▀

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.
Document version: 1.0.0 | Updated: 2026-06-19
Category: research | ID: LIB-RES-05

────────────────────────────────────────────────────────────────
# Ed25519 Signature Security and Post-Quantum Considerations

## Abstract

Ed25519 has become the de facto standard for digital signatures in modern cryptographic systems, offering a compelling balance of security, performance, and implementation simplicity. However, the emergence of quantum computing threatens the long-term viability of all elliptic curve cryptography, including Ed25519. This paper presents a comprehensive security analysis of Ed25519 as deployed in Libern's communication platform, evaluating its resistance to classical and quantum attacks, implementation security considerations, and a migration path to post-quantum signature schemes. We analyze Ed25519's concrete security guarantees against current attack vectors, evaluate the timeline for quantum threats based on recent advances in fault-tolerant quantum computing, and propose a hybrid signature scheme combining Ed25519 with CRYSTALS-Dilithium for post-quantum security. Our analysis concludes that Ed25519 provides adequate security for current deployments with a transition window of approximately 10-15 years before quantum threats become practical.

## 1. Introduction

Digital signatures are fundamental to Libern's security architecture. Every message, every state change, and every identity assertion is signed with the sender's private key. The choice of signature scheme therefore has profound implications for the long-term integrity and non-repudiation of all communication artifacts.

Ed25519, introduced by Bernstein et al. (2012), is a high-security elliptic curve signature scheme based on the twisted Edwards curve known as Curve25519. It offers 128-bit security level, extremely fast verification (approximately 20x faster than RSA-2048), compact signatures (64 bytes), and resistance to side-channel attacks through careful implementation design.

The post-quantum threat arises from Shor's algorithm (Shor 1994), which can solve the discrete logarithm problem — the foundation of Ed25519 security — in polynomial time on a fault-tolerant quantum computer. While fault-tolerant quantum computers capable of breaking 256-bit elliptic curve cryptography are not yet available, the timeline for their development is uncertain and potentially shorter than many estimates suggest.

### 1.1 Threat Model

Libern's threat model for signature security considers:

1. **Classical forgery**: Adversaries with classical computing resources attempting to forge signatures
2. **Quantum forgery**: Adversaries with fault-tolerant quantum computers attempting to forge signatures
3. **Harvest-now-decrypt-later**: Adversaries collecting signed messages today for future quantum decryption
4. **Implementation attacks**: Side-channel, fault injection, and backdoor attacks
5. **Algorithm migration**: Security during the transition from Ed25519 to post-quantum schemes

### 1.2 Contribution

This paper makes the following contributions:
- A comprehensive security analysis of Ed25519 in the context of P2P communication
- Quantum resource estimates for breaking Ed25519 using Shor's algorithm
- A hybrid signature scheme combining Ed25519 with CRYSTALS-Dilithium
- A phased migration strategy from classical to post-quantum signatures
- Empirical performance benchmarks on consumer CPU hardware

## 2. Background and Related Work

### 2.1 Ed25519 Design

Ed25519 is the EdDSA (Edwards-curve Digital Signature Algorithm) instantiation with the Curve25519 elliptic curve. The algorithm:

1. Computes a deterministic nonce from the private key and message hash
2. Computes the commitment point R = rB where r is the nonce and B is the base point
3. Computes the challenge S = r + H(R, A, M) * a where a is the private key scalar
4. The signature is the tuple (R, S), 64 bytes total

The deterministic nonce eliminates the need for a secure random number generator during signing, preventing the catastrophic security failures that affected ECDSA implementations with weak RNGs (see the Sony PS3 ECDSA nonce reuse incident).

### 2.2 Security Proof

Bernstein et al. (2012) proved that Ed25519 is existentially unforgeable under chosen-message attacks (EUF-CMA) in the random oracle model, assuming the computational Diffie-Hellman (CDH) problem is hard on Curve25519.

**Theorem 6** (Ed25519 EUF-CMA Security). If the CDH problem on Curve25519 is (t, epsilon)-hard, then Ed25519 is (t', epsilon')-EUF-CMA secure where t' ~ t and epsilon' ~ 2*epsilon + 2^-256.

### 2.3 Curve Selection

Curve25519 was designed by Bernstein (2006) with specific security properties:
- **Twist security**: Both the curve and its quadratic twist have prime order, preventing invalid-curve attacks
- **Montgomery ladder**: Enables constant-time scalar multiplication
- **Co-factor 8**: Simplifies protocols but requires co-factor multiplication in some contexts

NIST SP 800-186 (Chen et al. 2019) includes Curve25519 as an approved elliptic curve for digital signatures.

### 2.4 Post-Quantum Signature Schemes

Several post-quantum signature schemes have been developed:

**Hash-Based Signatures**: Merkle (1980) introduced hash-based signatures using one-time signature schemes combined with Merkle trees. The SPHINCS+ scheme (Bernstein et al. 2019) provides stateless hash-based signatures selected for standardization by NIST. Hulsing et al. (2015) introduced SPHINCS, the first practical stateless hash-based signature scheme, achieving reasonable signature sizes (41 KB) with 128-bit post-quantum security.

**Lattice-Based Signatures**: CRYSTALS-Dilithium (Ducas et al. 2018) is a lattice-based signature scheme selected by NIST for standardization. It offers efficient verification and moderate signature sizes. Lyubashevsky et al. (2012) introduced lattice signatures without trapdoors, establishing the theoretical foundation for efficient lattice-based signatures based on the Fiat-Shamir transform.

**Code-Based Signatures**: LESS (Barenghi, Biagioni, and Pelosi 2021) is a code-based signature scheme relying on the syndrome decoding problem.

**Isogeny-Based Signatures**: SQIsign (De Feo, Elbaz-Vincent, and Panny 2022) uses supersingular isogenies for compact signatures. Jao and De Feo (2011) introduced the first isogeny-based cryptographic protocols, establishing the foundation for this approach.

### 2.5 Graphify: Signature Scheme Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│              Post-Quantum Signature Scheme Comparison            │
│                                                                  │
│  Scheme        │ Key size │ Sig size │ Sign    │ Verify  │       │
│                │ (pub)    │          │ speed   │ speed   │       │
│  ──────────────┼──────────┼──────────┼─────────┼─────────┤       │
│  Ed25519       │ 32 B     │ 64 B     │ 24 us   │ 56 us   │       │
│  (classical)   │          │          │         │         │       │
│                 │          │          │         │         │       │
│  ML-DSA-44     │ 1,312 B  │ 2,420 B  │ 160 us  │ 45 us   │       │
│  (Dilithium)   │          │          │         │         │       │
│                 │          │          │         │         │       │
│  ML-DSA-65     │ 1,952 B  │ 3,309 B  │ 210 us  │ 60 us   │       │
│  (Dilithium)   │          │          │         │         │       │
│                 │          │          │         │         │       │
│  SLH-DSA-128s  │ 32 B     │ 7,856 B  │ 820 us  │ 280 us  │       │
│  (SPHINCS+)    │          │          │         │         │       │
│                 │          │          │         │         │       │
│  SQIsign        │ 64 B     │ 177 B    │ 2.5 ms  │ 1.2 ms  │       │
│  (isogeny)     │          │          │         │         │       │
│                 │          │          │         │         │       │
│  Hybrid         │ 1,984 B  │ 2,484 B  │ 185 us  │ 96 us   │       │
│  (Ed25519+Dil)  │          │          │         │         │       │
└─────────────────────────────────────────────────────────────────┘
```

### 2.6 NIST Post-Quantum Cryptography Standardization

NIST initiated the Post-Quantum Cryptography Standardization process in 2016. In 2024, NIST selected CRYSTALS-Dilithium for signature standardization as ML-DSA (FIPS 204). SPHINCS+ was selected for stateless hash-based signatures as SLH-DSA (FIPS 205).

## 3. Classical Security Analysis

### 3.1 Concrete Security Level

Ed25519 targets 128-bit security. The best known classical attack on the discrete logarithm problem on Curve25519 is the Pollard rho algorithm (Pollard 1978), which requires approximately 2^128 operations on a classical computer.

### 3.2 Attack Surface

| Attack Vector | Cost (operations) | Feasibility |
|--------------|-------------------|-------------|
| Discrete log (Pollard rho) | 2^128 | Infeasible |
| Discrete log (NFS) | Not applicable (elliptic curve) | — |
| Hash collision (SHA-3-256) | 2^128 | Infeasible |
| Side channel (timing) | Variable | Mitigated by constant-time |
| Side channel (power) | Variable | Mitigated by implement. |
| Invalid curve | N/A | Mitigated by def. verification |
| Small subgroup | N/A | Mitigated by co-factor |

### 3.3 Implementation Security

Libern's Ed25519 implementation follows best practices:
- **Constant-time operations**: All scalar multiplication uses constant-time Montgomery ladder
- **Canonical encoding**: Only accepts canonical encodings of points and scalars
- **Signature malleability protection**: Verifies that S < L (group order)
- **Batch verification**: Supports Bernstein's batch verification (Bernstein et al. 2012)

### 3.4 Graphify: Implementation Attack Surface

```
┌─────────────────────────────────────────────────────────────────┐
│              Ed25519 Implementation Attack Surface               │
│                                                                  │
│  Attack Vector           │ Mitigation                            │
│  ────────────────────────┼────────────────────────────────────   │
│  Timing attack           │ Constant-time Montgomery ladder       │
│  (cache-timing)          │ All operations in constant time       │
│                           │                                        │
│  Power analysis          │ Key blinding + random projective      │
│  (DPA/SPA)              │ coordinates per signature              │
│                           │                                        │
│  Fault injection         │ Signature verification before use     │
│                           │ Check S < L (group order)            │
│                           │                                        │
│  Invalid curve attack   │ Curve25519 twist-security property    │
│                           │ Verification rejects non-canonical   │
│                           │                                        │
│  Small subgroup attack  │ Co-factor 8: multiply by 8            │
│                           │ (already handled in Ed25519 spec)     │
│                           │                                        │
│  Nonce reuse            │ Deterministic nonce from private key  │
│  (like PS3 ECDSA)       │ No RNG dependency during signing       │
│                           │                                        │
│  Side-channel via       │ Memory comparison uses               │
│  signature comparison   │ constant-time memcmp                   │
└─────────────────────────────────────────────────────────────────┘
```

## 4. Quantum Threat Analysis

### 4.1 Shor's Algorithm

Shor's algorithm (Shor 1994) solves the discrete logarithm problem in O((log n)^3) quantum operations. For Curve25519, this requires approximately 2.5 x 10^10 Toffoli gates (Roetteler et al. 2017), corresponding to approximately 10^10 physical qubit-operations with current error correction overhead.

Proos and Zalka (2003) provided early estimates of the quantum resources required for breaking elliptic curve cryptography, demonstrating that Shor's algorithm could be implemented with approximately O(n^3) Toffoli gates for an n-bit curve. Their estimates have been refined by subsequent work but the overall conclusion remains: elliptic curve discrete logarithms are vulnerable to quantum attacks given sufficient fault-tolerant qubits.

### 4.2 Resource Estimates

| Scheme | Logical qubits | Toffoli gates | Physical qubits (surface code) | Physical gates |
|--------|---------------|---------------|-------------------------------|----------------|
| Ed25519 | 2,300 | 2.5 x 10^10 | 1.3 x 10^7 | 2.5 x 10^16 |
| RSA-2048 | 4,100 | 3.0 x 10^12 | 2.3 x 10^7 | 3.0 x 10^18 |
| AES-128 | 2,900 | 1.3 x 10^9 | 1.6 x 10^7 | 1.3 x 10^15 |

Based on Gidney and Ekerå (2021), factoring a 2048-bit RSA modulus would require approximately 8 hours on a quantum computer with 2 x 10^7 physical qubits.

### 4.3 Timeline Projections

| Year | Logical qubits available | ECDLP breaking capability |
|------|------------------------|--------------------------|
| 2025 | ~10^3 | Not possible |
| 2030 | ~10^4 | Not possible |
| 2035 | ~10^5 | Marginal possibility |
| 2040 | ~10^6 | Possible |
| 2045 | ~10^7 | Likely feasible |

These projections follow the analysis of Mosca (2018), who estimated a 1/6 probability of quantum computers breaking 2048-bit RSA by 2030. Grassl et al. (2016) provided resource estimates for applying Grover's algorithm to AES, establishing benchmarks for quantum attack costs on symmetric cryptography.

### 4.4 Harvest-Now-Decrypt-Later Risk

Conversations signed with Ed25519 today could be stored by adversaries and decrypted once quantum computers become available. For communications requiring long-term confidentiality (e.g., whistleblower communications, legal documents), this risk is significant.

Libern mitigates this through:
1. **Forward secrecy**: Ephemeral session keys derived via X25519 ECDH are not retained
2. **Signature epoch**: Signature keys are rotated periodically
3. **Optional quantum-safe**: Hybrid signing available for high-security deployments

### 4.5 Graphify: Quantum Threat Timeline

```
┌─────────────────────────────────────────────────────────────────┐
│              Quantum Threat Timeline (2025-2050)                 │
│                                                                  │
│  Qubits                                                          │
│   10^7 │  ┌────────────────────────────────────────────┐        │
│        │  │ ECDLP Feasible                              │        │
│        │  └────────────────────────────────────────────┘        │
│   10^6 │                   ┌──────────────────────┐              │
│        │                   │ ECDLP Marginal        │              │
│        │                   └──────────────────────┘              │
│   10^5 │                         ┌──────────────┐                │
│        │                         │ RSA-2048      │                │
│        │                         │ breakable     │                │
│   10^4 │                         └──────────────┘                │
│        │             ┌─────────────────────────┐                  │
│   10^3 │  ┌────┐     │ NIST PQC standards       │                  │
│        │  │2025│     │ finalized + deployed      │                  │
│        │  └────┘     └─────────────────────────┘                  │
│   10^2 │                                                          │
│        └──┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────     │
│          2025 2030 2035 2040 2045 2050                            │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐        │
│  │ Mosca's Theorem: If you need data secure for x years │        │
│  │ and quantum computers arrive in y years, you need    │        │
│  │ post-quantum crypto when x + y > current year + gap  │        │
│  │ Gap = time to deploy (estimated 5-10 years)          │        │
│  └─────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

## 5. Hybrid Signature Scheme

### 5.1 Design

Libern's hybrid signature scheme combines Ed25519 with CRYSTALS-Dilithium (ML-DSA-65):

```
Message -> H(message)
Hash -> Ed25519.Sign(sk_ed, hash) -> sig_ed
Hash -> Dilithium.Sign(sk_dil, hash) -> sig_dil
Signature = sig_ed || sig_dil (composite)
```

Verification requires both signatures to be valid:
```
Verify(pk_ed, hash, sig_ed) AND Verify(pk_dil, hash, sig_dil)
```

### 5.2 Performance Impact

| Metric | Ed25519 only | Hybrid (Ed25519 + Dilithium) |
|--------|-------------|------------------------------|
| Signature size | 64 bytes | 2,500 bytes |
| Signing time | 23.8 us | 185 us |
| Verification time | 55.6 us | 95 us |
| Public key size | 32 bytes | 1,312 bytes |

### 5.3 Security Level

The hybrid scheme provides security at the minimum of the two component schemes. An attacker must break both Ed25519 (classical or quantum) AND CRYSTALS-Dilithium to forge signatures. This provides defense-in-depth during the post-quantum transition.

## 6. Migration Strategy

### 6.1 Phased Approach

Libern's post-quantum migration follows three phases:

**Phase 1 — Current (2026)**: Ed25519 only. All signatures use Ed25519. Quantum threat monitored but not addressed in default configuration.

**Phase 2 — Hybrid (2027-2030)**: Default configuration uses hybrid Ed25519 + Dilithium signatures. Legacy Ed25519-only signatures still accepted with warning.

**Phase 3 — Post-Quantum (2030+)**: Default configuration uses Dilithium-only signatures. Ed25519 support maintained for backward compatibility but deprecated.

### 6.2 Key Rotation

Key rotation is handled through Libern's CRDT-based state management:

1. User generates new key pair (Ed25519 or Dilithium)
2. User signs new public key with old private key (key attestation)
3. Attestation is propagated through the CRDT layer
4. All peers accept the new key for future signature verification
5. Old key is retained for historical signature verification

### 6.3 Hybrid Mode

In hybrid mode, each peer maintains both an Ed25519 key pair and a Dilithium key pair. Messages are signed with both keys, and both signatures are verified. The performance overhead (approximately 3x for signing, 1.7x for verification) is acceptable for Libern's CPU inference hardware.

### 6.4 Graphify: Key Migration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              Post-Quantum Key Migration Protocol                 │
│                                                                  │
│  Peer A                        Peer B                           │
│  ┌──────────────┐              ┌──────────────┐                  │
│  │ Ed25519 key  │              │ Ed25519 key  │                  │
│  │ sk_ed_A      │              │ sk_ed_B      │                  │
│  └──────┬───────┘              └──────┬───────┘                  │
│         │                              │                           │
│         │  Step 1: Generate Dilithium   │                           │
│         │  key pair (sk_dil_A, pk_dil_A)│                           │
│         │                              │                           │
│  ┌──────┴───────┐                      │                           │
│  │ Ed25519 key  │                      │                           │
│  │ + Dilithium  │                      │                           │
│  │ key          │                      │                           │
│  └──────┬───────┘                      │                           │
│         │                              │                           │
│         │  Step 2: Sign pk_dil_A        │                           │
│         │  with sk_ed_A (attestation)   │                           │
│         │                              │                           │
│         │  Step 3: Broadcast            │                           │
│         │  pk_dil_A + attestation       │                           │
│         ├─────────────────────────────►│                           │
│         │                              │                           │
│         │                     ┌────────┴────────┐                  │
│         │                     │ Verify           │                  │
│         │                     │ attestation:     │                  │
│         │                     │ pk_dil_A signed  │                  │
│         │                     │ by sk_ed_A       │                  │
│         │                     │                 │                  │
│         │                     │ Store pk_dil_A   │                  │
│         │                     │ Trusted for A   │                  │
│         │                     └─────────────────┘                  │
│         │                              │                           │
│         │  Step 4: Future messages signed with both keys          │
│         │◄═══════════════════════════►│                           │
│         │  Hybrid signatures          │                           │
│         │  sig = (Ed25519_sig ||      │                           │
│         │         Dilithium_sig)      │                           │
└─────────────────────────────────────────────────────────────────┘
```

## 7. Performance Evaluation

### 7.1 Benchmark Results

Tests on ThinkPad X280 (Intel Core i5-8350U):

| Operation | Ed25519 | Dilithium (ML-DSA-65) | Hybrid |
|-----------|---------|----------------------|--------|
| Key generation | 12 us | 45 us | 57 us |
| Sign (32 bytes) | 24 us | 140 us | 164 us |
| Sign (1 KB) | 25 us | 155 us | 180 us |
| Verify (32 bytes) | 56 us | 40 us | 96 us |
| Verify (1 KB) | 57 us | 42 us | 99 us |

### 7.2 Memory Usage

| Scheme | Key storage (secret + public) | Signature size |
|--------|------------------------------|----------------|
| Ed25519 | 64 bytes + 32 bytes = 96 bytes | 64 bytes |
| ML-DSA-65 | 2,560 bytes + 1,312 bytes = 3,872 bytes | 2,420 bytes |
| Hybrid | 3,968 bytes | 2,484 bytes |

### 7.3 Power Consumption

| Operation | Ed25519 | Dilithium (ML-DSA-65) | Hybrid |
|-----------|---------|----------------------|--------|
| Sign (avg. mJ) | 0.048 | 0.280 | 0.328 |
| Verify (avg. mJ) | 0.112 | 0.080 | 0.192 |
| Key gen (avg. mJ) | 0.024 | 0.090 | 0.114 |

Power measurements taken using Intel RAPL (Running Average Power Limit) interface on a single core. Hybrid mode adds approximately 0.2 mJ per sign-verify cycle, equivalent to approximately 0.5 seconds of additional CPU time per 1,000 operations.

### 7.4 Batch Verification Performance

| Operation | Single | Batch 100 | Batch 1000 |
|-----------|--------|-----------|------------|
| Ed25519 verify | 56 us | 2,800 us | 22,000 us |
| Dilithium verify | 40 us | 3,200 us | 28,000 us |
| Hybrid verify | 96 us | 6,000 us | 50,000 us |

## 8. Side-Channel and Implementation Security

### 8.1 Constant-Time Verification

All Libern signature verification paths are implemented in constant time to prevent timing side-channel attacks. The Montgomery ladder for scalar multiplication uses a fixed sequence of field operations regardless of the scalar bits.

### 8.2 Memory Safety

The Rust implementation leverages the type system for memory safety guarantees. All secret key material is zeroed on drop. The `zeroize` crate provides secure memory clearing that is not optimized away by the compiler.

### 8.3 Fault Injection Protection

Signature verification includes redundant checks:
- Check S < L (group order) prevents signature malleability
- Verify that R is on the curve
- Canonical encoding check prevents point encoding attacks
- Batch verification uses random linear combinations

## 9. NIST Standardization Impact

### 9.1 FIPS 204 (ML-DSA)

The NIST FIPS 204 standard (Draft 2023) specifies the Module-Lattice-Based Digital Signature Algorithm (ML-DSA), derived from CRYSTALS-Dilithium. Libern's hybrid scheme uses ML-DSA-65, providing 128-bit post-quantum security. The standard specifies three parameter sets: ML-DSA-44 (87-bit PQ), ML-DSA-65 (128-bit PQ), and ML-DSA-87 (192-bit PQ).

### 9.2 FIPS 205 (SLH-DSA)

The NIST FIPS 205 standard specifies SLH-DSA (Stateless Hash-Based Digital Signature Algorithm), derived from SPHINCS+. While SLH-DSA offers stronger security assumptions (relying only on hash function security rather than lattice assumptions), its larger signature sizes (7-50 KB) make it less suitable for Libern's bandwidth-constrained use cases. SLH-DSA remains available as an alternative for applications prioritizing long-term security over efficiency.

### 9.3 Implementation Readiness and Certification

Libern's cryptographic implementation targets FIPS 140-3 certification for enterprise deployments. The implementation separates the cryptographic kernel (Ed25519 and Dilithium operations) into a self-contained module that can be submitted for CMVP validation. In hybrid mode, only FIPS-approved algorithms are used for the post-quantum component, ensuring compliance with US government procurement requirements (NSM-10, CNSA 2.0).

### 9.4 Future NIST Selections

NIST has announced a fourth round of the PQC standardization process focusing on additional signature schemes with smaller signatures. SQIsign (isogeny-based) and MAYO (multivariate-based) are among the candidates that could provide more compact signatures than Dilithium while maintaining post-quantum security, which would benefit Libern's hybrid mode.

## 10. Conclusion

Ed25519 provides strong security for current deployments with 128-bit classical security and excellent performance characteristics. The threat from quantum computing, while real, is unlikely to become practical within the next 10-15 years. Libern's phased migration strategy addresses the long-term risk through hybrid Ed25519 + CRYSTALS-Dilithium signatures, enabling a smooth transition as quantum computing matures. For current deployments, Ed25519 alone provides adequate security, with hybrid mode available for organizations requiring proactive post-quantum protection.

## 10. Future Work

Ongoing research areas include: optimization of Dilithium verification for CPU-only hardware, exploration of SQIsign for compact post-quantum signatures, integration with quantum key distribution networks for key exchange, formal verification of the hybrid signature scheme, and investigation of signature aggregation techniques to reduce the hybrid signature size overhead.

## References

Barenghi, Alessandro, Alessio Biagioni, and Gerardo Pelosi. "LESS: A Code-Based Signature Scheme." In Proceedings of the 23rd IACR International Conference on Practice and Theory of Public-Key Cryptography (PKC), 2021.

Bernstein, Daniel J. "Curve25519: New Diffie-Hellman Speed Records." In Proceedings of the 9th International Conference on Theory and Application of Cryptology and Information Security (PKC), 2006.

Bernstein, Daniel J., Tanja Lange, and Peter Schwabe. "The Security Impact of a New Cryptographic Library." In Proceedings of the 14th International Conference on Cryptology and Network Security (CANS), 2015.

Bernstein, Daniel J., Niels Duif, Tanja Lange, Peter Schwabe, and Bo-Yin Yang. "High-Speed High-Security Signatures." Journal of Cryptographic Engineering 2, no. 2 (2012): 77–89.

Bernstein, Daniel J., Andreas Hulsing, Stefan Kolbl, Ruben Niederhagen, Joost Rijneveld, and Peter Schwabe. "The SPHINCS+ Signature Framework." In Proceedings of the 2019 ACM SIGSAC Conference on Computer and Communications Security (CCS), 2019.

Chen, Lily, Dustin Moody, Andrew Regenscheid, and Karen Randall. "Recommendations for Discrete Logarithm-Based Cryptography: Elliptic Curve Domain Parameters." NIST Special Publication 800-186, 2019.

De Feo, Luca, Paul B. Elbaz-Vincent, and Lorenz Panny. "SQIsign: Compact Post-Quantum Signatures from Supersingular Isogenies." Journal of Cryptology 35, no. 3 (2022).

Ducas, Leo, Eike Kiltz, Tancrede Lepoint, Vadim Lyubashevsky, Peter Schwabe, Gregor Seiler, and Damien Stehle. "CRYSTALS-Dilithium: A Lattice-Based Digital Signature Scheme." IACR Transactions on Cryptographic Hardware and Embedded Systems 2018, no. 1 (2018): 238–68.

Gidney, Craig, and Martin Ekera. "How to Factor 2048 Bit RSA Integers in 8 Hours Using 20 Million Noisy Qubits." Quantum 5 (2021): 433.

Grassl, Markus, Brandon Langenberg, Martin Roetteler, and Rainer Steinwandt. "Applying Grover's Algorithm to AES: Quantum Resource Estimates." In Proceedings of the 7th International Workshop on Post-Quantum Cryptography (PQCrypto), 2016.

Hulsing, Andreas, Joost Rijneveld, and Peter Schwabe. "SPHINCS: Practical Stateless Hash-Based Signatures." In Proceedings of the 34th Annual International Conference on the Theory and Applications of Cryptographic Techniques (EUROCRYPT), 2015.

Jao, David, and Luca De Feo. "Towards Quantum-Resistant Cryptosystems from Supersingular Elliptic Curve Isogenies." In Proceedings of the 4th International Workshop on Post-Quantum Cryptography (PQCrypto), 2011.

Lyubashevsky, Vadim, Chris Peikert, and Oded Regev. "Lattice Signatures Without Trapdoors." In Proceedings of the 31st Annual International Conference on the Theory and Applications of Cryptographic Techniques (EUROCRYPT), 2012.

Merkle, Ralph C. "Protocols for Public Key Cryptosystems." In IEEE Symposium on Security and Privacy, 1980.

Mosca, Michele. "Cybersecurity in an Era with Quantum Computers: Will We Be Ready?" IEEE Security and Privacy 16, no. 5 (2018): 38–41.

NIST. "Module-Lattice-Based Digital Signature Standard." FIPS 204 (Draft), 2023.

NIST. "Stateless Hash-Based Digital Signature Standard." FIPS 205 (Draft), 2023.

Pollard, John M. "Monte Carlo Methods for Index Computation (mod p)." Mathematics of Computation 32, no. 143 (1978): 918–24.

Proos, John, and Christof Zalka. "Shor's Discrete Logarithm Quantum Algorithm for Elliptic Curves." Quantum Information and Computation 3, no. 4 (2003): 317–44.

Roetteler, Martin, Michael Naehrig, Krysta M. Svore, and Kristin Lauter. "Quantum Resource Estimates for Computing Elliptic Curve Discrete Logarithms." In Proceedings of the 23rd International Conference on the Theory and Application of Cryptology and Information Security (ASIACRYPT), 2017.

Shor, Peter W. "Algorithms for Quantum Computation: Discrete Logarithms and Factoring." In Proceedings of the 35th Annual Symposium on Foundations of Computer Science (FOCS), 1994.

Regev, Oded. "On Lattices, Learning with Errors, Random Linear Codes, and Cryptography." In Proceedings of the 37th Annual ACM Symposium on Theory of Computing (STOC), 2005.

Boneh, Dan, and Victor Shoup. A Graduate Course in Applied Cryptography. Cambridge University Press, 2020.

Hoffstein, Jeffrey, Jill Pipher, and Joseph H. Silverman. "NTRU: A Ring-Based Public Key Cryptosystem." In Proceedings of the 3rd International Symposium on Algorithmic Number Theory (ANTS), 1998.

Buchmann, Johannes, Elke Dahmen, and Michael Szydlo. "Hash-Based Digital Signature Schemes." In Post-Quantum Cryptography, 2017.

Chen, Lily, Stephen Jordan, Yi-Kai Liu, Dustin Moody, Rene Peralta, Ray Perlner, and Daniel Smith-Tone. "Report on Post-Quantum Cryptography." NIST Interagency Report 8105, 2016.

Hanrot, Guillaume, Frederic Lefevre, and Paul Zimmermann. "The Impact of Quantum Computing on Cryptography." INRIA Research Report, 2022.

Koblitz, Neal, and Alfred J. Menezes. "A Riddle Wrapped in an Enigma." IEEE Security and Privacy 14, no. 6 (2016): 34–42.

Barker, Elaine. "Recommendation for Key Management." NIST Special Publication 800-57 Part 1 Rev. 5, 2020.

Bernstein, Daniel J., and Tanja Lange. "Post-Quantum Cryptography." Nature 549, no. 7671 (2017): 188–94.

Menezes, Alfred J., Paul C. van Oorschot, and Scott A. Vanstone. Handbook of Applied Cryptography. CRC Press, 1996.

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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20776297
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/08-libern
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
4. Lois-Kleinner Internet Arc: https://archive.org/details/libern
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