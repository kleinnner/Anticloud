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

# Contributing to .aioss

The `.aioss` format is Kazkade's append-only signed state ledger. It converts telemetry `Event`s into a SHA3-256 hash chain that can be serialized to binary or JSON, then Ed25519-signed for cryptographic state proofs.

## File Format Internals (Binary)

### Header Layout (160 bytes)

```
Offset  Size  Field
──────────────────────────────────────────
  0      5    Magic: b"AIOSS"
  5      2    Version: u16 LE (currently 1)
  7      2    Header checksum: first 2 bytes of SHA3-256 of header[0..7] + header[9..160]
  9     36    Session ID: UTF-8, null-padded
 45     32    Created at: ISO 8601 string, null-padded
 77      1    Status: 1 = active
 78      1    Session type: 0
 79      4    Entry count: u32 LE
 83     32    Genesis hash: SHA3-256 of first entry
115     32    Head hash: SHA3-256 of most recent entry
147      8    Reserved (zeros)
──────────────────────────────────────────
Total: 160 bytes
```

### Entry Layout (256 bytes each)

```
Offset  Size  Field
─────────────────────────────────────────
  0      4    Index: u32 LE
  4      8    Timestamp: u64 LE (unix ms)
 12     20    Event type: UTF-8, null-padded
 32     32    Entry hash: SHA3-256
 64     32    Parent hash: SHA3-256 of previous entry
 96    128    Content: JSON string, null-padded (max 128 bytes)
224     32    Reserved (zeros)
─────────────────────────────────────────
Total: 256 bytes
```

### Entry Serialization

Each `AiossEntry` is constructed from a telemetry `Event`:

```rust
pub struct AiossEntry {
    pub index: u32,
    pub timestamp_unix_ms: u64,
    pub event_type: String,
    pub content: serde_json::Value,
    pub hash: [u8; 32],
    pub parent_hash: [u8; 32],
}
```

The `event_type` and `content` are produced by `event_to_content()`:

| `Event` variant | `event_type` | `content` example |
|-----------------|--------------|-------------------|
| Matmul | `"gemm"` | `{"m":256,"n":256,"k":256,"gflops":420.5,"ms":3.0}` |
| Vector | `"vector"` | `{"op":"add","elements":1000,"gbps":12.3}` |
| Filter | `"filter"` | `{"rows":100000,"us":150.0,"rate_m":666.7}` |
| RasterFrame | `"raster_frame"` | `{"pixels":480000,"ms":16.7,"mpps":28.8}` |
| RasterBatch | `"raster_batch"` | `{"frames":100,"ms":1670.0,"fps":59.9}` |
| IoRead | `"io_read"` | `{"bytes":1048576,"ms":2.1}` |
| Alloc | `"alloc"` | `{"label":"weights","bytes":4194304}` |
| Custom | `"diagnostic"` | `{"label":"auto_tune","value":1.23,"unit":"s"}` |

### Hash Chain Verification

Each entry's hash is computed as:

```rust
fn compute_entry_hash(
    index: u32, timestamp: u64,
    event_type: &str, content: &serde_json::Value,
    parent_hash: &[u8; 32],
) -> [u8; 32] {
    let canonical = serde_json::json!({
        "index": index,
        "timestamp": timestamp,
        "event_type": event_type,
        "content": content,
        "parent_hash": hex_encode(parent_hash),
    });
    let bytes = serde_json::to_vec(&canonical).unwrap_or_default();
    Sha3_256::digest(&bytes).into()
}
```

The genesis entry has `parent_hash = [0u8; 32]` (all zeros). `verify()` walks the chain:
1. Check genesis hash matches `entries[0].hash`
2. For each entry, verify `parent_hash` matches previous entry's hash
3. Recompute hash from fields and compare to stored hash
4. Check head hash matches last entry's hash

Returns `(verified: bool, tampered_count: usize)`.

### Ed25519 Key Generation

```rust
pub fn generate_keypair() -> (SigningKey, VerifyingKey) {
    let mut secret = [0u8; SECRET_KEY_LENGTH];
    OsRng.fill_bytes(&mut secret);
    let signing_key = SigningKey::from_bytes(&secret);
    let verifying_key = signing_key.verifying_key();
    (signing_key, verifying_key)
}
```

Signing creates a `StateProof` over the head hash:

```rust
pub fn sign(&self, key: &SigningKey) -> StateProof {
    let head_hex = hex_encode(&self.head_hash);
    let msg = format!("Kazkade:{}:{}:{}", self.session_id, self.entry_count, head_hex);
    let sig = key.sign(msg.as_bytes());
    StateProof { /* ... */ }
}
```

### Binary vs JSON Format

The binary format is fixed-size (160-byte header + N × 256-byte entries). Use it for compact archival. The JSON format uses `serde_json` and is human-readable. Both encode the same data; the `read_binary`/`read_json` and `write_binary`/`write_json` methods are symmetric.

### Adding New Event Types

To add a new event type to the ledger:

1. Add a variant to `Event` in `src/telemetry.rs`
2. Add a mapping in `event_to_content()` in `src/aioss.rs`:

```rust
Event::YourNewEvent { field1, field2 } => {
    ("your_event_type".into(), serde_json::json!({
        "field1": field1, "field2": field2,
    }))
}
```

3. The hash chain automatically incorporates the new content — no additional plumbing needed.
4. Update the binary format if the content JSON exceeds 128 bytes (adjust `max_content` in `write_binary()`).

### Verification Example

```rust
let ledger = AiossLedger::read_binary("session.aioss")?;
let (verified, tampered) = ledger.verify();
println!("Chain: {} ({} tampered)", 
    if verified { "VERIFIED" } else { "TAMPERED" }, tampered);
```

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
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
