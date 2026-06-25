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

# Community Dashboard

The Kazkade local web dashboard provides a rich interface for exploring data, running queries, and visualizing results—all fully offline with zero telemetry.

## Launching

```bash
kazkade dashboard
```

Opens at `http://127.0.0.1:8742`. Customize:

```bash
kazkade dashboard --port 8743 --bind 0.0.0.0 --open false
```

## Dashboard Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Browser (localhost)                    │
│  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌──────────────┐  │
│  │ Files   │ │ Queries  │ │ Charts │ │ Leaderboard  │  │
│  │ Browser │ │ Console  │ │ Viewer │ │ (community)  │  │
│  └────┬────┘ └────┬─────┘ └───┬────┘ └──────┬───────┘  │
│       │           │           │              │          │
└───────┼───────────┼───────────┼──────────────┼──────────┘
        │           │           │              │
        ▼           ▼           ▼              ▼
┌─────────────────────────────────────────────────────────┐
│              Kazkade HTTP Server (port 8742)             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ .acol    │ │ SQL      │ │ Chart    │ │ Ledger   │  │
│  │ Store    │ │ Engine   │ │ Renderer │ │ Verifier │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────┘
```

## File Browser

The left panel shows a file tree of `.acol` files in the current and child directories.

```bash
# Set dashboard root directory
kazkade dashboard --root /path/to/data
```

Features:

- **Thumbnail preview**: column names, types, row counts, sizes
- **Drag and drop**: open files by dragging into the browser
- **Recent files**: shows last 20 accessed files
- **Search**: filter by filename or column name

## Opening `.acol` Files

Click any `.acol` file to open its column inspector:

```
┌─────────────────────────────────────────┐
│ File: transactions.acol                  │
│ Rows: 1,048,576   Size: 42.3 MB         │
│ Codecs: Delta(ts), RLE(status), Dict(cat)│
│─────────────────────────────────────────│
│ #  Column     Type   Codec   Cardinality │
│ 0  ts         i64    Delta   1,048,576   │
│ 1  amount     f64    Bitpack 256,234     │
│ 2  category   utf8   Dict    12          │
│ 3  status     i8     RLE     4           │
│ 4  flags      u32    Bitpack 8           │
│─────────────────────────────────────────│
│ [Preview first 100 rows] [Stats] [Chart] │
└─────────────────────────────────────────┘
```

## SQL Query Console

Write and execute SQL queries interactively:

```sql
-- Aggregation query
SELECT
  category,
  COUNT(*) as cnt,
  AVG(amount) as avg_amount,
  SUM(amount) as total
FROM transactions
GROUP BY category
ORDER BY total DESC
LIMIT 10;
```

Results display as:

- **Table view**: paginated, sortable columns
- **Chart view**: bar, line, scatter, heatmap
- **Export**: download as CSV or JSON

### Query History

All queries are saved locally:

```bash
~/.kazcade/history/
  ├── queries.acol
  └── queries.aioss
```

Browse, re-run, or share query URLs within your local network.

## Visualizing Results

### Chart Types

| Chart | Use Case | Example |
|-------|----------|---------|
| Bar | Comparison by category | Total sales by region |
| Line | Time series | Transaction volume over time |
| Scatter | Correlation | Amount vs frequency |
| Heatmap | Density | 2D histogram |
| Pie | Proportions | Category distribution |
| Table | Raw data | Full result set |

### Creating a Chart

1. Run a SQL query
2. Click "Chart" tab
3. Select chart type
4. Map X/Y/series columns
5. Adjust color, scale, labels
6. Export as SVG or PNG

### Chart Configuration

```json
{
  "type": "bar",
  "x": "category",
  "y": "total",
  "color": "category",
  "title": "Revenue by Category",
  "x_label": "Category",
  "y_label": "Total Revenue ($)",
  "sort": "descending",
  "limit": 20
}
```

## Community Leaderboard Tab

The leaderboard tab shows community benchmark results (requires internet for this tab only):

```
Rank  User        Throughput  Bench          CPU           Signed
1     @vectorix   3.2 GB/s    scan_i64       Ryzen 9 9950X ✓
2     @rustacean  2.8 GB/s    scan_i64       Threadripper  ✓
...
```

Click any entry to see full metadata and verify the `.aioss` signature.

## Ledger Viewer

Inspect the local `.aioss` ledger:

```bash
kazkade ledger
```

Dashboard view:

```
┌──────────────────────────────────────────────┐
│ Ledger: ~/.kazcade/ledger/                   │
│ Entries: 142    Last: 2 min ago              │
│ Integrity: ✓ Verified to genesis             │
├──────────────────────────────────────────────┤
│ #  Type            Timestamp         Size    │
│ 0  Genesis         2026-01-01        256 B   │
│ 1  Benchmark       2026-06-19        1.2 KB  │
│ 2  Query           2026-06-19          512 B │
│ ...                                          │
│ 142 Config         2026-06-19        128 B   │
└──────────────────────────────────────────────┘
```

## No Telemetry

The community dashboard **never** sends data to external servers:

- All analytics data stays on your machine
- The `leaderboard` tab makes optional read-only HTTPS requests
- No crash reporting, no usage tracking, no user IDs
- No cookies or local storage tracking

Verify yourself:

```bash
# Monitor network activity
kazkade dashboard --verbose
```

You'll see only localhost connections.

## Dashboard Configuration

```bash
# Full config
kazkade dashboard \
  --port 8742 \
  --root /mnt/data \
  --theme dark \
  --language en \
  --max-results 10000 \
  --verbose
```

Settings persist in `~/.kazcade/dashboard.toml`:

```toml
[server]
port = 8742
bind = "127.0.0.1"
root = "/mnt/data"

[ui]
theme = "dark"
language = "en"
items_per_page = 50

[query]
max_results = 10000
timeout_secs = 30
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+Enter` | Run query |
| `Ctrl+O` | Open file |
| `Ctrl+S` | Export results |
| `Ctrl+K` | Clear console |
| `Ctrl+/` | Toggle sidebar |
| `Escape` | Cancel query |
| `?` | Show shortcuts |

## Troubleshooting

**Dashboard won't start**: Check port availability. `netstat -ano | findstr :8742`

**Files not showing**: Verify the root directory contains `.acol` files. Run `kazkade inspect` to validate.

**Charts are slow**: Reduce `max-results` or filter data in SQL before visualizing.

**Blank page**: Clear browser cache or try a different browser (Chromium/Firefox recommended).

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
