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

# Tutorial 5 — Creating and Verifying a .aioss Ledger

The `.aioss` ledger is Kazkade's tamper-proof audit trail. Every benchmark event is recorded as a SHA3-256 hashed entry, optionally Ed25519-signed.

## Step 1 — Run the Ledger Command

```bash
kazkade ledger
```

This runs a small GEMM benchmark (256×256×256) and writes two files to the temp directory:

```
Running benchmarks for .aioss ledger...
Hash chain: verified=0, tampered=0
  Binary: /tmp/Kazkade_12345.aioss
  JSON:   /tmp/Kazkade_12345.json
  Signed: pk=1a2b3c4d5e6f7890...
  Verify proof: true
```

## Step 2 — Inspect the JSON Output

Open the JSON file:

```json
{
  "schema": "urn:kazkade:aioss:v1",
  "version": "1.0.0",
  "session_id": "Kazkade_12345",
  "entry_count": 1,
  "genesis_hash": "abcdef...",
  "head_hash": "abcdef...",
  "entries": [
    {
      "index": 0,
      "timestamp": "1747593600000",
      "event_type": "gemm",
      "content": { "m": 256, "n": 256, "k": 256, "gflops": 8.0, "ms": 4.2 },
      "hash": "abcdef...",
      "parent_hash": "0000..."
    }
  ]
}
```

## Step 3 — Inspect the Binary Output

The `.aioss` binary format is fixed-size: 160 bytes header + 256 bytes per entry.

```bash
# Hex dump the first 64 bytes
xxd /tmp/Kazkade_12345.aioss | head -4
```

Magic bytes: `41 49 4F 53 53` ("AIOSS").

## Step 4 — Verify the Ledger

```bash
kazkade verify /tmp/Kazkade_12345.aioss
```

Output:

```
File:      /tmp/Kazkade_12345.aioss
Format:    Binary
Entries:   1
Genesis:   abc...
Head:      abc...
Chain:     VERIFIED (0 tampered)
```

## Step 5 — How the Hash Chain Works

1. The first entry's `parent_hash` is all zeros (genesis).
2. Each subsequent entry's `parent_hash` equals the previous entry's computed SHA3-256 hash.
3. `verify()` recomputes every hash and checks every link. If any entry has been modified, the chain reports TAMPERED.
4. The Ed25519 state proof signs the head hash, providing cryptographic attestation.

## Step 6 — Tamper Detection

If you manually edit the JSON file and change a GFLOPS value, re-verification:

```bash
kazkade verify /tmp/Kazkade_12345.json
# → Chain: TAMPERED (1 tampered)
```

The mismatched entry hash breaks the chain.

---
*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*
