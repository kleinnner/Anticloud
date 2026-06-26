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

# Data Format FAQ

## What is .acol?
`.acol` is Kazkade's native **columnar storage format**. Data is stored column-by-column rather than row-by-row, enabling fast scans, vectorised predicate evaluation, and efficient compression. The format uses a **striped** layout: each column is divided into 64 KB chunks (stripes), each independently compressed and indexed. This allows querying only the stripes needed for a given filter, minimising I/O.

## Can I open .acol files in other tools?
Not directly — `.acol` is a custom format. However, Kazkade provides export commands (see below) to convert to standard formats. The format specification is open and documented in the Kazkade repository under `docs/spec/acol.md` if you wish to implement a reader in another language.

## What compression is used?
Each stripe within a column can use one of three codecs, selected automatically based on data type and distribution:
- **Zstd** (default for general data): high compression ratio, fast decompression
- **Delta + Zstd** (for integers, timestamps, monotonic sequences): delta-encodes values then compresses
- **RLE (Run-Length Encoding)** (for low-cardinality or categorical columns): very fast decompression with near-zero overhead

The codec per stripe is stored inline in the stripe header, so the file is self-describing. No external codec configuration is needed.

## How is data laid out on disk?
An `.acol` file has four sections:
1. **Magic + Header** (64 bytes): format version, schema (column names and types), row count, stripe count.
2. **Column Index**: one entry per column listing the file offset and length of every stripe in that column, plus min/max statistics for predicate pushdown.
3. **Stripes**: the actual compressed column data, laid out sequentially. Stripes from different columns are interleaved to improve locality for multi-column queries.
4. **Footer**: checksum of the header and index, plus a pointer to the start of the index (enables append-friendly writes).

This layout allows the query engine to determine which stripes to decompress before touching any compressed data.

## Can I convert .acol to CSV/Parquet?
Yes. Use the `query` command with `--format csv` and redirect output:
```
kazkade query "SELECT * FROM data.acol" --format csv > data.csv
```
For Parquet, use the `export` subcommand: `kazkade export data.acol --to parquet`. Conversion to Apache Arrow IPC (`.arrow` / `.feather`) is also supported with `--to arrow`. All conversions are streaming — files larger than available RAM are handled transparently.

## Can I convert CSV to .acol?
Yes. Use `kazkade import data.csv --to data.acol`. The importer auto-detects column types by sampling the first 10,000 rows. You can override types with `--dtype "col1:int32,col2:float32"`. Compression is applied automatically during import.

## Are .acol files appendable?
The format supports append operations via the footer pointer. Use `kazkade append existing.acol newdata.acol` to concatenate row-wise. Appends rewrite only the index and footer — existing stripe data is not moved.

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com