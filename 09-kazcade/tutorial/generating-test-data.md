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

# Tutorial 8 — Generating Large Test Data Files

The `kazkade gen` command creates synthetic `.acol` files for benchmarking and experimentation.

## Step 1 — Basic Usage

```bash
kazkade gen --rows 1000000 output.acol
```

Output:

```
Generated output.acol with 1000000 rows
```

## Step 2 — Verify with Stats

```bash
kazkade stats output.acol
```

```
File: output.acol
Schema: 3 columns, 1000000 rows

  [0] id: I32
    Rows:   1000000
    Size:   4000000 bytes

  [1] value: F32
    Rows:   1000000
    Size:   4000000 bytes
    Min:    0.0000
    Max:    1499998.5000
    Sum:    749999250000

  [2] category: I32
    Rows:   1000000
    Size:   4000000 bytes
```

## Step 3 — Schema Details

The generated schema is defined in `src/main.rs`:

```rust
let schema = Schema::new(vec![
    ColumnMeta { name: "id".into(),       dtype: DataType::I32, .. },
    ColumnMeta { name: "value".into(),    dtype: DataType::F32, .. },
    ColumnMeta { name: "category".into(), dtype: DataType::I32, .. },
]);
```

| Column   | Type | Generation Rule                        |
|----------|------|----------------------------------------|
| `id`     | i32  | Row index: 0, 1, 2, …, N-1             |
| `value`  | f32  | `id × 1.5` (0.0, 1.5, 3.0, …)          |
| `category`| i32 | `id % 10` (cycles 0–9)                 |

## Step 4 — File Size

Each row is 12 bytes uncompressed (4B id + 4B value + 4B category). For 1M rows:

- Uncompressed data: 12 MB
- File size on disk: ~12 MB + metadata overhead (~1 KB)

## Step 5 — Query the Generated Data

```bash
# Count rows where category = 5
kazkade query output.acol "select count(*) from where category = 5"

# Average value by filtering on id range
kazkade query output.acol "select avg(value) from where id > 500000"
```

## Step 6 — Default Rows

If `--rows` is not specified, the default is 100,000:

```bash
kazkade gen default.acol
```

## Use Cases

- **Benchmarking**: Generate files of varying sizes to measure filter and scan throughput.
- **SQL testing**: Explore the supported SQL subset with predictable data.
- **Stats verification**: Confirm column statistics against the known formulas.

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
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
