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

# Tutorial 7 — Columnar File Statistics with `kazkade stats`

The `stats` command prints per-column metadata and summary statistics for `.acol` files.

## Step 1 — Generate a Test File

```bash
kazkade gen --rows 1000 test.acol
```

## Step 2 — Run `kazkade stats`

```bash
kazkade stats test.acol
```

Expected output:

```
File: test.acol
Schema: 3 columns, 1000 rows

  [0] id: I32
    Rows:   1000
    Size:   4000 bytes

  [1] value: F32
    Rows:   1000
    Size:   4000 bytes
    Min:    0.0000
    Max:    1498.5000
    Sum:    749250

  [2] category: I32
    Rows:   1000
    Size:   4000 bytes
```

## Step 3 — Understanding the Fields

| Field      | Description |
|------------|-------------|
| **Rows**   | Number of non-null rows in the column. |
| **Size**   | Total uncompressed byte size. For `I32` columns: `rows × 4` bytes. |
| **Min**    | Minimum value (only shown for `F32` columns). |
| **Max**    | Maximum value (only shown for `F32` columns). |
| **Sum**    | Sum of all values (only for `F32` columns). |

## Step 4 — Filter by Column Index

Use `--column` (or `-c`) to examine a specific column:

```bash
kazkade stats test.acol --column 0
```

Output:

```
  [0] id: I32
    Rows:   1000
    Size:   4000 bytes
```

## Step 5 — Large File Statistics

With larger files (millions of rows), `kazkade stats` remains fast because it reads metadata from the column chunk headers without scanning every value.

```bash
kazkade gen --rows 1000000 big.acol
kazkade stats big.acol
```

Output:

```
File: big.acol
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

The `sum` field for the `value` column confirms the data formula: `sum = 1.5 × (0 + 1 + ... + N-1)`.

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

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

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
