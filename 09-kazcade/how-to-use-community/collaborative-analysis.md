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

# Collaborative Analysis

This guide covers multi-user workflows with shared `.acol` files, Git-based versioning, and collaborative SQL query sharing.

## Workflow Overview

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│ Alice    │    │ Bob      │    │ Carol    │
│ .acol    │    │ .acol    │    │ .acol    │
│ queries  │    │ queries  │    │ queries  │
└────┬─────┘    └────┬─────┘    └────┬─────┘
     │               │               │
     └───────────────┼───────────────┘
                     │
                     ▼
           ┌─────────────────┐
           │ Shared Git Repo │
           │ .acol + .aioss  │
           └─────────────────┘
                     │
                     ▼
           ┌─────────────────┐
           │ CI Verification │
           │ (auto-sign)     │
           └─────────────────┘
```

## Sharing `.acol` Files via Git

`.acol` files are binary-columnar but Git-friendly when stored with LFS or as text-backed exports.

### Setup

```bash
# Clone shared data repository
git clone https://github.com/team/data-analysis.git
cd data-analysis

# Initialize Kazkade workspace
kazkade init --workspace .
```

### Adding Data

```bash
# Create a new .acol file from CSV
kazkade ingest data.csv --output shared.acol

# Add metadata
kazkade annotate shared.acol --description "Q2 sales data" --tags "sales,2026"

# Commit to Git
git add shared.acol shared.acol.aioss
git commit -m "Add Q2 sales data [signed]"
git push
```

### Git LFS for Large Files

```bash
# Install Git LFS
git lfs track "*.acol"
git lfs track "*.aioss"

# Push
git add .gitattributes
git commit -m "Track .acol and .aioss with LFS"
```

## Versioning Strategy

### Semantic Versioning for Data

```
v1.0.0  Initial dataset
v1.1.0  Added columns (backward compatible)
v2.0.0  Breaking schema changes
```

```bash
# Tag data versions
git tag data-v1.0.0 -m "Initial sales schema"
git tag data-v1.1.0 -m "Added region column"
```

### Schema Diffing

```bash
kazkade diff shared.acol shared-v2.acol
```

Output:

```
Schema changes:
  + region: utf8 (new)
  ~ amount: f64 → i64 (type change, backward-incompatible)
  - old_flag: u32 (removed)
  
Data changes:
  Rows: 1,048,576 → 2,097,152 (+100%)
  Size: 42.3 MB → 85.1 MB
```

## Collaborative Query Sharing

### Exporting Queries

```bash
# Save a query to a file
kazkade query "SELECT region, SUM(amount) FROM sales GROUP BY region" \
  --save queries/revenue-by-region.sql

# The query is automatically signed
cat queries/revenue-by-region.sql.aioss
```

### Sharing Queries

```bash
# Share with team via Git
git add queries/
git commit -m "Add revenue-by-region analysis query"
git push

# Team member imports
kazkade query --from queries/revenue-by-region.sql
```

### Query Catalog

Build a query catalog in the repo:

```
queries/
├── revenue/
│   ├── by-region.sql
│   ├── by-product.sql
│   └── trend-monthly.sql
├── performance/
│   ├── scan-bench.sql
│   └── agg-bench.sql
└── audit/
    ├── ledger-check.sql
    └── integrity.sql
```

List available queries:

```bash
kazkade query --list
```

## Shared Dashboard Sessions

Collaborators can share dashboard views:

```bash
# Save current dashboard state
kazkade dashboard --save-session analysis.json

# Share the session file
git add analysis.json
git commit -m "Shared analysis session: revenue trends"
git push

# Collaborator loads
kazkade dashboard --load-session analysis.json
```

The session includes:

- Open files
- Query history
- Chart configurations
- Filter state
- Theme preferences

## Conflict Resolution

When two users modify the same dataset:

```bash
# Check for conflicts
kazkade diff --base main.acol --theirs alice.acol --ours bob.acol

# Three-way merge
kazkade merge --base main.acol --theirs alice.acol --ours bob.acol \
  --output merged.acol
```

## Access Control with `.aioss`

Use the ledger for fine-grained access control:

```bash
# Grant read access
kazkade ledger grant --user alice --resource shared.acol --permission read

# Grant write access
kazkade ledger grant --user bob --resource shared.acol --permission write

# Revoke
kazkade ledger revoke --user alice --resource shared.acol

# View permissions
kazkade ledger permissions shared.acol
```

```
Resource: shared.acol
  Owner:    team-lead (ed25519:abcd...)
  Readers:  alice, bob, carol
  Writers:  bob, carol
  Auditors: compliance-bot
```

## Real-Time Collaboration

Kazkade supports WebSocket-based real-time collaboration (experimental):

```bash
# Start collaboration server
kazkade collaborate --port 8744 --workspace /shared/data

# Join from another machine
kazkade collaborate --connect ws://server:8744
```

Features:

- Live cursor positions in query editor
- Shared query execution
- Real-time chart updates
- Chat panel

## CI Verification

Automatically verify shared data integrity:

```yaml
# .github/workflows/verify-data.yml
name: Data Integrity
on: [push]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          kazkade self-test
          for f in *.acol; do
            kazkade inspect "$f" --check-integrity
          done
```

## Best Practices

1. **Always sign** data with `--sign` before sharing
2. **Use Git LFS** for `.acol` files >10 MB
3. **Document schemas** in a `SCHEMA.md` alongside data
4. **Tag releases** with semver for datasets
5. **Run CI verification** on every push
6. **Use workspaces** for multi-project organization:

```bash
kazkade init --workspace . --name "team-analysis"
kazkade workspace list
kazkade workspace switch "team-analysis"
```

## Example Workflow

```bash
# Alice: ingest and share
kazkade ingest source.csv --output sales.acol --sign alice.key
git add sales.acol sales.acol.aioss
git commit -m "ingest: Q2 sales data"
git push

# Bob: analyze
git pull
kazkade query "SELECT region, SUM(revenue) FROM sales GROUP BY region" \
  --save queries/top-regions.sql
git add queries/
git commit -m "analyze: top regions query"
git push

# Carol: review and visualize
git pull
kazkade dashboard --load-session analysis.json
# ... explores data, creates charts ...
kazkade dashboard --save-session analysis-v2.json
git add analysis-v2.json
git commit -m "visualize: added regional trend charts"
git push
```

---

*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

