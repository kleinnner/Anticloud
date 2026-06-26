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

# Tutorial 3 — SQL Querying with Kazkade

Kazkade includes a lightweight SQL engine that runs `SELECT`, `WHERE`, `GROUP BY` (via aggregates), and limit/offset queries against `.acol` columnar files.

## Step 1 — Generate a Test Data File

```bash
kazkade gen --rows 1000 test.acol
```

Output:

```
Generated test.acol with 1000 rows
```

The schema has three columns:
- `id` (i32) — sequential row number (0…999)
- `value` (f32) — row number × 1.5
- `category` (i32) — row number modulo 10

## Step 2 — SELECT with WHERE

```bash
kazkade query test.acol "select id, value from where value > 100.0"
```

Expected output:

```
id | value
--- | ---
67 | 100.5000
68 | 102.0000
...
999 | 1498.5000
933 rows in 45.0 us
```

## Step 3 — Aggregates

```bash
kazkade query test.acol "select count(*), sum(value), avg(value), min(value), max(value)"
```

Output:

```
count: 1000
sum(value): 749250.00
avg(value): 749.25
min(value): 0.00
max(value): 1498.50
Filtered: 1000 / 1000 rows in 30.0 us
```

## Step 4 — WHERE with Multiple Aggregates

```bash
kazkade query test.acol "select count(*), avg(value) from where category = 3"
```

Output:

```
count: 100
avg(value): 748.50
Filtered: 100 / 1000 rows in 25.0 us
```

## Step 5 — LIMIT and OFFSET

```bash
kazkade query test.acol "select id, value from where category >= 5 limit 3 offset 5"
```

## Supported SQL Subset

| Feature | Syntax | Example |
|---------|--------|---------|
| Column projection | `SELECT col1, col2` | `select id, value` |
| All columns | `SELECT *` | `select *` |
| Row count | `COUNT(*)` / `COUNT(col)` | `select count(*)` |
| Sum | `SUM(col)` | `select sum(value)` |
| Average | `AVG(col)` | `select avg(value)` |
| Minimum | `MIN(col)` | `select min(value)` |
| Maximum | `MAX(col)` | `select max(value)` |
| Filter | `WHERE col OP val` | `where value > 100` |
| Operators | `>`, `<`, `>=`, `<=`, `=`, `!=` | `where category = 5` |
| And | `WHERE cond AND cond` | `where category = 3 and value > 100` |
| Limit | `LIMIT n` | `limit 10` |
| Offset | `OFFSET n` | `offset 5` |

**Not supported**: `JOIN`, `ORDER BY`, subqueries, `LIKE`, string functions, `NULL` handling, `HAVING`.

All comparisons are against `f64` values. Columns are referenced by name. The `FROM` clause is optional for aggregate-only queries.

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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com