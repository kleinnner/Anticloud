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

# `.aioss` Tamper-Proof Ledger

The `.aioss` ledger is an append-only, cryptographically authenticated record format used by Kazkade for benchmark results, diagnostic history, licensing, and audit trails. Every entry is chained to its predecessor via SHA3‑256, and the entire state is provable with an Ed25519 signature.

## File Structure

An `.aioss` file is a binary sequence of variable-length records. Each record is:

```
┌──────────────────────────────────────┐
│ Magic: 0xA1 0x0S 0x53 0x01          │  4 bytes
│ Record Length (big-endian u64)       │  8 bytes
│ Previous Hash (SHA3-256)             │ 32 bytes
│ Timestamp (unix millis, big-endian)  │  8 bytes
│ Entry Type (u8)                      │  1 byte
│ Payload (JSON or binary)             │  variable
│ Entry Hash (SHA3-256 over all above) │ 32 bytes
│ Ed25519 Signature                    │ 64 bytes
└──────────────────────────────────────┘
```

The very first record (genesis) has `Previous Hash = [0; 32]`.

## Hash Chain Structure

```mermaid
flowchart LR
    G[Genesis<br/>Prev=0...0<br/>Hash=H₀<br/>Sig₀] --> R1[Record 1<br/>Prev=H₀<br/>Hash=H₁<br/>Sig₁]
    R1 --> R2[Record 2<br/>Prev=H₁<br/>Hash=H₂<br/>Sig₂]
    R2 --> R3[Record N<br/>Prev=Hₙ₋₁<br/>Hash=Hₙ<br/>Sigₙ]
    R3 --> V[Verifier]

    subgraph Verify
        V --> C1{Hash(Hₙ) matches?}
        C1 --> C2{Sigₙ verifies?}
        C2 --> C3{Prev chain intact?}
        C3 --> OK[Trusted State]
    end
```

Tempering any byte in a record causes a cascade of hash mismatches that is immediately detectable on `verify()`.

## Serialization: Binary and JSON

Each record payload can be either:

- **Binary** (type `0x01`) — compact, used for benchmark timestamps and counters. Schema is inferred from the reader.
- **JSON** (type `0x02`) — self-describing, used for configuration snapshots and diagnostics. Encoded as UTF-8 without pretty-print.

A record that mixes binary and JSON in the same file is valid; the type byte disambiguates.

## Core API

```rust
impl AiossLedger {
    /// Create a new ledger (genesis record).
    pub fn create(path: &Path, key: &Ed25519Secret) -> Result<Self>;

    /// Open an existing ledger for append.
    pub fn open(path: &Path) -> Result<Self>;

    /// Append a record. Signs the entry hash with `key`.
    pub fn append(&mut self, entry_type: u8, payload: &[u8], key: &Ed25519Secret) -> Result<RecordHash>;

    /// Verify integrity of every record from genesis to tip.
    /// Returns the verified tip hash + timestamp.
    pub fn verify(&self, pubkey: &Ed25519Public) -> Result<VerifiedState>;

    /// Read a range of records: [start, end).
    pub fn read_range(&self, start: u64, end: u64) -> Result<Vec<Record>>;

    /// Read the most recent N records.
    pub fn read_tail(&self, n: u64) -> Result<Vec<Record>>;
}
```

### `verify()` Internals

1. Walk records sequentially from genesis.
2. For each record: recompute `entry_hash` over the record bytes (with signature zeroed). Compare against stored `entry_hash`.
3. Check `previous_hash` matches the previous record's `entry_hash`.
4. Verify the Ed25519 signature over `entry_hash` against the provided public key.
5. Return the tip hash and timestamp if all checks pass.

### `sign()` Internals

Signing is performed inside `append()`:

```
signature = ed25519_sign(entry_hash, secret_key)
```

The `entry_hash` covers every byte from `Magic` through `Payload`, ensuring that no metadata can be altered without detection.

## Use Cases

- **Benchmark history** — each `kazkade bench` run appends a record with mean latency, throughput, and CPU config.
- **Diagnostic snapshots** — the diagnostics dashboard appends periodic state summaries.
- **Licensing and provenance** — signed records certify model origins and training hashes.

---
*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

