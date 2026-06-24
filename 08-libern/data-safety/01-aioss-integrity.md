▄▄                     ██               ▄▄                                    
██                     ▀▀               ██                                    
██            ▄▄▄█   ████     █▄▄▄      ██▄███▄    ▄████▄    ██▄████  ██▄████▄
██        ▄▄█▀▀▀       ██       ▀▀▀█▄▄  ██▀  ▀██  ██▄▄▄▄██   ██▀      ██▀   ██
██        ▀▀█▄▄▄       ██       ▄▄▄█▀▀  ██    ██  ██▀▀▀▀▀▀   ██       ██    ██
██▄▄▄▄▄▄      ▀▀▀█  ▄▄▄██▄▄▄  █▀▀▀      ███▄▄██▀  ▀██▄▄▄▄█   ██       ██    ██
▀▀▀▀▀▀▀▀            ▀▀▀▀▀▀▀▀            ▀▀ ▀▀▀      ▀▀▀▀▀    ▀▀       ▀▀    ▀▀

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

────────────────────────────────────────────────────────────────

# Data Integrity via .aioss

**Category:** Data Safety
**File:** 01-aioss-integrity.md
**Revision:** 1.0

---

## Table of Contents

1. [Overview](#overview)
2. [The .aioss File Format](#the-aioss-file-format)
3. [Hash Chain Verification](#hash-chain-verification)
4. [Ed25519 Signing & State Proofs](#ed25519-signing--state-proofs)
5. [Binary vs JSON Ledger](#binary-vs-json-ledger)
6. [Tamper-Evident Properties](#tamper-evident-properties)
7. [Chain Verification Walkthrough](#chain-verification-walkthrough)
8. [Health Check Chain](#health-check-chain)
9. [Event Store Chain](#event-store-chain)
10. [Session Sealing](#session-sealing)
11. [Practical Security Guarantees](#practical-security-guarantees)
12. [Comparison with Other Integrity Systems](#comparison-with-other-integrity-systems)
13. [References](#references)

---

## Overview

Libern's data integrity model is built on the **.aioss** (Autonomous Integrity & Off-chain Signed Session) file format. Every action — every message, voice event, whiteboard stroke, AI prompt, and system event — is recorded in a tamper-evident, hash-chained ledger. The chain uses SHA3-256 hashes, Ed25519 digital signatures, and a parent-child linking structure that makes any retrospective tampering immediately detectable.

The `.aioss` system lives in the `libern-aioss` crate at `crates/libern-aioss/`. Its core types are `AiossHeader`, `AiossEntry`, `BinaryLedger`, `LedgerFileJson`, and `StateProof`. The verification logic is in `verify.rs` and the signing logic is in `state_proof.rs`.

---

## The .aioss File Format

Every `.aioss` file begins with a **128-byte binary header** defined in `header.rs`:

| Offset | Size | Field | Description |
|--------|------|-------|-------------|
| 0 | 5 | `magic` | Bytes `b"AIOSS"` |
| 5 | 2 | `version` | Format version (1) |
| 7 | 2 | `header_checksum` | CRC-16 (reserved) |
| 9 | 36 | `session_id` | UUID v4 string |
| 45 | 32 | `created_at` | ISO 8601 timestamp |
| 77 | 1 | `status` | 0=active, 1=sealed |
| 78 | 1 | `session_type` | 0=chat, 1=game, 2=ai, 3=system |
| 79 | 4 | `entry_count` | Little-endian u32 |
| 83 | 32 | `genesis_hash` | SHA3-256 of first entry |
| 115 | 32 | `head_hash` | SHA3-256 of latest entry |
| 147 | 8 | `_reserved` | Future use |

After the header come the entries. Each entry is exactly **256 bytes**:

| Offset | Size | Field | Description |
|--------|------|-------|-------------|
| 0 | 4 | `index` | Entry sequence number |
| 4 | 8 | `timestamp_unix_ms` | Unix ms timestamp |
| 12 | 20 | `entry_type` | Type string (null-padded) |
| 32 | 16 | `actor` | Actor identifier |
| 48 | 24 | `actor_label` | Human-readable name |
| 72 | 32 | `content_hash` | SHA3-256 of JSON content |
| 104 | 32 | `parent_hash` | SHA3-256 of previous entry |
| 136 | 12 | `_reserved` | Future use |

---

## Hash Chain Verification

### Binary Verification

```rust
pub fn verify_binary(ledger: &BinaryLedger) -> (bool, usize, usize) {
    let total = ledger.entries.len();
    let mut tampered = 0;
    for (i, entry) in ledger.entries.iter().enumerate() {
        let expected_parent: [u8; 32] = if i == 0 {
            [0u8; 32]
        } else {
            ledger.entries[i - 1].compute_binary_hash()
        };
        if entry.parent_hash != expected_parent { tampered += 1; continue; }
        let computed = entry.compute_binary_hash();
        if computed != ledger.entries[i].compute_binary_hash() { tampered += 1; }
    }
    (tampered == 0, tampered, total)
}
```

### JSON Verification

```rust
pub fn verify_json(ledger: &LedgerFileJson) -> (bool, usize, usize) {
    let total = ledger.entries.len();
    let mut tampered = 0;
    for (i, entry) in ledger.entries.iter().enumerate() {
        let expected_parent = if i == 0 {
            "0000000000000000000000000000000000000000000000000000000000000000".to_string()
        } else {
            ledger.entries[i - 1].hash.clone()
        };
        if entry.parent_hash != expected_parent { tampered += 1; continue; }
        let computed = entry.compute_hash();
        if computed != entry.hash { tampered += 1; }
    }
    (tampered == 0, tampered, total)
}
```

### Auto-Detection

```rust
pub fn verify_any(bytes: &[u8]) -> Result<(bool, usize, usize), String> {
    if bytes.len() >= 5 && &bytes[0..5] == b"AIOSS" {
        verify_binary(&BinaryLedger::from_bytes(bytes)?)
    } else {
        verify_json(&serde_json::from_slice(bytes)?)
    }
}
```

---

## Ed25519 Signing & State Proofs

### StateProof Structure

```rust
pub struct StateProof {
    pub head_hash: String,
    pub timestamp: String,
    pub entry_count: u64,
    pub session_id: String,
    pub signature: Option<String>,
    pub public_key: String,
    pub verified: bool,
}
```

### Signing

```rust
pub fn sign(mut self) -> (Self, Vec<u8>) {
    let signing_key = SigningKey::from_bytes(&secret_bytes);
    let verifying_key = signing_key.verifying_key();
    let message = format!("{}:{}:{}", self.head_hash, self.entry_count, self.session_id);
    let signature = signing_key.sign(message.as_bytes());
    self.public_key = base64::encode(verifying_key.as_bytes());
    self.signature = Some(base64::encode(signature.to_bytes().as_ref()));
    (self, signing_key.to_bytes().to_vec())
}
```

### Verification

```rust
pub fn verify(&self) -> bool {
    let verifying_key = VerifyingKey::from_bytes(&pub_key_bytes)?;
    let message = format!("{}:{}:{}", self.head_hash, self.entry_count, self.session_id);
    verifying_key.verify(message.as_bytes(), &signature).is_ok()
}
```

---

## Binary vs JSON Ledger

| Property | Binary (.aioss) | JSON (.aioss.json) |
|----------|----------------|-------------------|
| Size per entry | 256 bytes | ~1 KB |
| Human-readable | No | Yes |
| Verification speed | Fast (direct memory) | Slower (JSON parse) |
| Auto-detected | Magic bytes `b"AIOSS"` | JSON bracket `{` |
| Rich metadata | Limited (fixed fields) | Full (optional fields) |

---

## Tamper-Evident Properties

1. **Retroactive Modification:** Entry hash changes, parent link breaks.
2. **Reordering:** Parent hash chain breaks at first reordered pair.
3. **Insertion:** Forged entry's parent_hash doesn't match predecessor.
4. **Deletion:** Entry after deletion has wrong parent_hash.
5. **Truncation:** header.entry_count doesn't match, head_hash doesn't match.

---

## Chain Verification Walkthrough

```
Header: entry_count=3, genesis_hash=hash(A), head_hash=hash(C)

Entry A (index 0): parent=[0;32], content_hash=...,
  computed_hash = SHA3-256(index|ts|type|actor|label|parent_hash|reserved)

Entry B (index 1): parent=hash(A), content_hash=...,
  computed_hash = SHA3-256(index|ts|type|actor|label|parent_hash|reserved)

Entry C (index 2): parent=hash(B), content_hash=...
```

Verification:
1. A.parent == [0;32] ✓ (genesis)
2. B.parent == hash(A)? Compute hash(A) → compare ✓
3. C.parent == hash(B)? Compute hash(B) → compare ✓
4. header.head_hash == hash(C)? ✓
5. Result: (true, 0, 3)

---

## Health Check Chain

```rust
pub struct HealthEntry {
    pub hash: String,
    pub parent_hash: String,
    pub test: String,
    pub category: String,
    pub status: String,
    pub duration_ms: u64,
    pub detail: String,
}

pub fn verify_health_chain(entries: &[HealthEntry]) -> (bool, usize) {
    for (i, entry) in entries.iter().enumerate() {
        if !entry.verify_self() { tampered += 1; continue; }
        let expected_parent = if i == 0 {
            "sha3-256:0000..."
        } else {
            &entries[i - 1].hash
        };
        if entry.parent_hash != expected_parent { tampered += 1; }
    }
    (tampered == 0, tampered)
}
```

---

## Event Store Chain

```rust
pub struct Event {
    pub id: i64,
    pub subsystem: String,
    pub event_type: String,
    pub data: Vec<u8>,
    pub hash: Vec<u8>,
    pub parent_hash: Vec<u8>,
    pub trace_id: Option<String>,
    pub clock_time: Option<i64>,
    pub created_at: String,
}

pub trait StateMachine: Send {
    type State: Clone + Send;
    fn apply(&self, state: &mut Self::State, event: &Event);
    fn initial_state(&self) -> Self::State;
}
```

---

## Session Sealing

| Interval | Seconds | Use Case |
|----------|---------|----------|
| 1 minute | 60 | High-security |
| 10 minutes | 600 | Default |
| 1 hour | 3600 | Reduced overhead |
| 24 hours | 86400 | Archival |

```rust
pub struct AiossScheduler {
    pub interval: AiossInterval,
    pub last_seal: std::time::Instant,
}
```

---

## Practical Security Guarantees

| Threat | Mitigation |
|--------|-----------|
| Malicious admin modifies logs | Hash chain breaks |
| Database corruption | .aioss provides independent audit |
| MITM message tampering | Parent hash links detect changes |
| Repudiation | Ed25519 signatures |
| Silent data loss | Chain exposes missing entries |

---

## Comparison with Other Integrity Systems

| System | Hash | Verification | Format | Open Source |
|--------|------|-------------|--------|-------------|
| .aioss (Libern) | SHA3-256 | O(n) chain walk | Binary + JSON | Yes |
| Syslog | None | None | Text | N/A |
| Blockchain | Various | Full node | Binary | Varied |
| Git | SHA-1 | Tree/commit walk | Binary | Yes |
| Journald | Optional | Hashes | Binary | Partial |

---

## 13. File Format Versioning and Migration

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01 | Initial .aioss format |
| 2.0.0 | 2026-06 | Added JSON format, optional metadata fields |

### Backward Compatibility

The .aioss reader (`reader.rs`) maintains backward compatibility:

```rust
pub fn read_auto(path: &str) -> Result<(String, Vec<u8>), String> {
    let bytes = std::fs::read(path).map_err(|e| e.to_string())?;
    if bytes.len() >= 5 && &bytes[0..5] == b"AIOSS" {
        Ok(("binary".into(), bytes))
    } else {
        Ok(("json".into(), bytes))
    }
}
```

Future versions will maintain the same magic bytes and header structure, only extending the reserved fields or adding optional trailing metadata sections.

---

## 14. Advanced Verification Patterns

### Parallel Verification

For large .aioss files, verification can be parallelized:

```rust
use rayon::prelude::*;

pub fn verify_binary_parallel(ledger: &BinaryLedger) -> (bool, usize, usize) {
    let total = ledger.entries.len();
    let tampered: usize = (0..total).into_par_iter().filter(|&i| {
        let expected_parent: [u8; 32] = if i == 0 {
            [0u8; 32]
        } else {
            ledger.entries[i - 1].compute_binary_hash()
        };
        if ledger.entries[i].parent_hash != expected_parent {
            return true;
        }
        let computed = ledger.entries[i].compute_binary_hash();
        computed != ledger.entries[i].compute_binary_hash()
    }).count();

    (tampered == 0, tampered, total)
}
```

### Incremental Verification

For active (unsealed) sessions, verification can be incremental:

```rust
pub struct IncrementalVerifier {
    last_verified_index: usize,
    last_known_hash: [u8; 32],
}

impl IncrementalVerifier {
    pub fn verify_new_entries(&mut self, ledger: &BinaryLedger) -> Vec<usize> {
        let mut tampered = Vec::new();
        for i in self.last_verified_index..ledger.entries.len() {
            let expected_parent = if i == 0 {
                [0u8; 32]
            } else if i == self.last_verified_index && self.last_verified_index > 0 {
                self.last_known_hash
            } else {
                ledger.entries[i - 1].compute_binary_hash()
            };
            if ledger.entries[i].parent_hash != expected_parent {
                tampered.push(i);
            }
        }
        if let Some(last) = ledger.entries.last() {
            self.last_known_hash = last.compute_binary_hash();
        }
        self.last_verified_index = ledger.entries.len();
        tampered
    }
}
```

### Cross-Node Verification

Multiple peers can verify ledger consistency collaboratively:

```rust
pub fn cross_verify(ledgers: &[&BinaryLedger]) -> bool {
    if ledgers.is_empty() { return true; }
    let head_hash = ledgers[0].header.head_hash;
    let entry_count = ledgers[0].header.entry_count;
    ledgers.iter().all(|l| {
        l.header.head_hash == head_hash && l.header.entry_count == entry_count
    })
}
```

---

## 15. Integration with External Systems

### Exporting to Blockchain

.aioss state proofs can be anchored to blockchain for immutable timestamping:

```rust
pub fn prepare_blockchain_anchor(proof: &StateProof) -> AnchorData {
    AnchorData {
        head_hash: proof.head_hash.clone(),
        entry_count: proof.entry_count,
        session_id: proof.session_id.clone(),
        public_key: proof.public_key.clone(),
        signature: proof.signature.clone().unwrap_or_default(),
        timestamp: proof.timestamp.clone(),
        // This data can be submitted to a blockchain as a transaction
    }
}
```

### Integration with External HSM

For enterprise deployments with Hardware Security Modules (HSM):

```
┌──────────────┐         ┌──────────────┐
│  Libern       │         │  HSM         │
│              │         │              │
│  Session     │ ──────► │  Sign head   │
│  sealed      │         │  hash with   │
│              │ ◄────── │  HSM key     │
│  StateProof  │         │              │
│  stored with │         │  Returns     │
│  HSM sig     │         │  signature   │
└──────────────┘         └──────────────┘
```

---

## 16. Performance Optimization

### Memory-Mapped I/O

For large .aioss files (>100 MB), use memory-mapped I/O:

```rust
pub fn verify_binary_mmap(path: &str) -> Result<(bool, usize, usize), String> {
    let file = std::fs::File::open(path).map_err(|e| e.to_string())?;
    let mmap = unsafe { memmap2::Mmap::map(&file).map_err(|e| e.to_string())? };
    verify_any(&mmap)
}
```

### Caching

```rust
pub struct VerificationCache {
    cache: lru::LruCache<String, (bool, usize, usize)>,
}

impl VerificationCache {
    pub fn verify_cached(&mut self, path: &str) -> Result<(bool, usize, usize), String> {
        if let Some(result) = self.cache.get(path) {
            return Ok(*result);
        }
        let result = verify_any(&std::fs::read(path)?);
        if let Ok(r) = result {
            self.cache.put(path.to_string(), r);
        }
        result
    }
}
```

---

## 17. Security Properties Formal Verification

### Formal Guarantees

The .aioss hash chain provides the following formal guarantees:

1. **Integrity**: If `verify_any(bytes) == (true, 0, N)` then for all i < N, bytes[128+i*256 : 128+(i+1)*256] has not been modified since creation.

2. **Chain soundness**: If an adversary inserts, deletes, or reorders any entry, then `verify_any()` returns `(false, >0, N)`.

3. **Completeness**: If `verify_any()` returns `(true, 0, N)`, then every entry from index 0 to N-1 is present and correctly linked.

4. **Non-repudiation**: If a `StateProof` is present with a valid Ed25519 signature, the signer cannot deny having endorsed the ledger state.

### Verification Independence

The verification process requires only the bytes of the .aioss file. No external state, no database, no network access is needed. This enables:

- **Offline verification**: Any tool can verify without accessing Libern
- **Air-gap verification**: Verify on a machine that has never been online
- **Long-term verification**: Verification works decades later with no dependencies

---

## Summary of Security Properties

```
Property              Guarantee
─────────────────────────────────────────────────
Tamper evidence       ✓ SHA3-256 hash chain
Non-repudiation       ✓ Ed25519 signatures
Completeness          ✓ verify_any() detects gaps
Order integrity       ✓ parent_hash links
Content integrity     ✓ content_hash SHA3-256
Session integrity     ✓ genesis_hash + head_hash
Portability           ✓ Binary + JSON formats
Verifiability         ✓ Standalone (no DB needed)
Forward secrecy       ✓ (planned X25519)
Auditability          ✓ Full timeline reconstruction
```

## Integration with External Auditing Tools

### Prometheus Metrics Export (Planned)

```prometheus
# HELP libern_aioss_total_entries Total .aioss entries across all sessions
# TYPE libern_aioss_total_entries gauge
libern_aioss_total_entries{session_type="chat"} 15234
libern_aioss_total_entries{session_type="ai"} 892
libern_aioss_total_entries{session_type="health"} 1456

# HELP libern_aioss_chain_integrity Whether last verification passed (1=pass, 0=fail)
# TYPE libern_aioss_chain_integrity gauge
libern_aioss_chain_integrity 1

# HELP libern_aioss_verification_duration_ms Time to verify last chain
# TYPE libern_aioss_verification_duration_ms gauge
libern_aioss_verification_duration_ms 42

# HELP libern_aioss_state_proof_valid Whether latest StateProof is valid
# TYPE libern_aioss_state_proof_valid gauge
libern_aioss_state_proof_valid 1
```

### Graylog / ELK Integration

```json
// Elasticsearch index template for .aioss entries
{
  "index_patterns": ["libern-aioss-*"],
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  },
  "mappings": {
    "properties": {
      "@timestamp": { "type": "date" },
      "session_id": { "type": "keyword" },
      "entry_type": { "type": "keyword" },
      "actor": { "type": "keyword" },
      "content_snippet": { "type": "text" },
      "hash": { "type": "keyword" },
      "parent_hash": { "type": "keyword" },
      "verified": { "type": "boolean" },
      "entry_index": { "type": "long" }
    }
  }
}
```

## References

- `crates/libern-aioss/src/verify.rs` — verify_json, verify_binary, verify_any
- `crates/libern-aioss/src/state_proof.rs` — StateProof::sign, StateProof::verify
- `crates/libern-aioss/src/entry.rs` — AiossEntry, compute_binary_hash
- `crates/libern-aioss/src/header.rs` — AiossHeader
- `crates/libern-aioss/src/ledger.rs` — BinaryLedger, LedgerFileJson
- `crates/libern-aioss/src/health.rs` — HealthEntry, verify_health_chain
- `crates/libern-aioss/src/event_store.rs` — Event, StateMachine
- `crates/libern-aioss/src/schedule.rs` — AiossScheduler
- `crates/libern-aioss/src/writer.rs` — write_binary, write_json
- `crates/libern-aioss/src/reader.rs` — read_binary, read_json

────────────────────────────────────────────────────────────────

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.
