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

# Data Minimization

## Collect-Only-What's-Needed Design

Data minimization is a core Kazkade design principle. The system collects the absolute minimum data required for operation, discards it when no longer needed, and gives users complete control over retention.

> "The best data to protect is the data you never collected." — Kazkade Data Minimization Philosophy

---

## What Kazkade Stores Locally

| Data Type | Stored? | Purpose | Retention |
|-----------|---------|---------|-----------|
| .acol database files | ✓ User data | User's data | User-controlled |
| .aioss ledger | ✓ Local copy | Audit trail | User-controlled |
| Crash dumps | ✓ Local (if crash) | Debugging | 30 days (auto-deleted) |
| Logs | ✓ Local | Debugging | 7 days (auto-rotated) |
| Configuration | ✓ Local | User preferences | Permanent |
| Cache files | ✓ Local (if caching) | Performance | Configurable |
| Telemetry | ✗ Never | — | N/A |
| Usage statistics | ✗ Never | — | N/A |
| User profiles | ✗ Never | — | N/A |
| Behavioral data | ✗ Never | — | N/A |

---

## Column-Level Data Access

Kazkade reads only the columns actually needed for a query:

```rust
// Bad: loading all columns
fn bad_query(dataset: &AcolDataset) -> Result<DataFrame> {
    // Loads ALL columns into memory
    dataset.load_all()
}

// Good: loading only needed columns
fn good_query(dataset: &AcolDataset) -> Result<DataFrame> {
    // Only loads 'sales' and 'date' columns
    // 'customer_name', 'email', 'phone' are NOT loaded
    dataset.columns(&["sales", "date"])
}
```

```bash
$ kazkade query "SELECT sales, date FROM transactions WHERE sales > 1000"

Query Execution:
  Columns requested: sales, date (2 of 12)
  Columns loaded: sales, date (minimized)
  Columns not loaded: customer_name, email, phone, address, ssn, ...
  Data skipped: 82% of file not accessed
```

---

## Minimal Logging by Default

```bash
$ kazkade config list logging.*

logging.level: warn          # Default: warnings and errors only
logging.queries: false       # Do NOT log SQL query text
logging.results: false       # Do NOT log query results
logging.retention_days: 7    # Auto-rotate after 7 days
logging.max_size: 100 MB     # Max log file size
```

### What Logs Contain

```log
# Default log level (warn)
[2026-06-19T12:00:00Z WARN] Query execution took 2.3s (no query text)
[2026-06-19T12:01:00Z WARN] Low memory: 85% used (no details)
[2026-06-19T12:02:00Z ERROR] Storage error on /data/transactions.acol: I/O error

# What is NOT in logs (default)
# No query text
# No query results
# No user names
# No file paths (relative only)
# No environment variables
# No system configuration
```

---

## Configurable Retention

```bash
# Set data retention policies
$ kazkade config set data.retention_days=90
$ kazkade config set logging.retention_days=7
$ kazkade config set crash.retention_days=30

# Apply retention policies immediately
$ kazkade data clean --apply-retention
  Cleaning data...
  Deleted 1,234 log entries (older than 7 days)
  Deleted 5 crash dumps (older than 30 days)
  Deleted 12 cache files (older than 90 days)
  Done. 3.2 GB reclaimed.
```

---

## User-Controlled Data Deletion

```bash
# Delete specific data
$ kazkade data delete --older-than 90
$ kazkade data delete --dataset transactions_2025
$ kazkade data delete --logs --before 2026-01-01

# Full data wipe
$ kazkade data delete --all --confirm
WARNING: This will delete ALL local data including:
  - All .acol databases
  - .aioss ledger (local copy)
  - Logs
  - Crash dumps
  - Cache files
  - Configuration (not deleted, can be kept)

  This operation CANNOT BE UNDONE.
  Export your data first: kazkade data export --all

  Continue? [y/N]: y

  Deleting...
  ✓ All local data deleted
  ✓ Cryptographic verification: deletion confirmed
```

---

## Storage Usage Dashboard

```bash
$ kazkade dashboard --storage
```

```
┌────────────────────────────────────────────────────────────┐
│  Storage Usage                                              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Data by Category:                                         │
│  ┌──────────────────┬──────────┬──────────┬──────────────┐ │
│  │ Category         │ Size     │ Retention│ Auto-Deletion│ │
│  ├──────────────────┼──────────┼──────────┼──────────────┤ │
│  │ .acol databases  │ 42.3 GB  │ Forever  │ Manual       │ │
│  │ .aioss ledger    │ 2.1 GB   │ Forever  │ Manual       │ │
│  │ Logs             │ 156 MB   │ 7 days   │ Auto         │ │
│  │ Crash dumps      │ 89 MB    │ 30 days  │ Auto         │ │
│  │ Cache            │ 234 MB   │ 7 days   │ Auto         │ │
│  │ Configuration    │ 12 KB    │ Forever  │ Manual       │ │
│  ├──────────────────┼──────────┼──────────┼──────────────┤ │
│  │ Total            │ 44.9 GB  │ —        │ —            │ │
│  └──────────────────┴──────────┴──────────┴──────────────┘ │
│                                                            │
│  [Clean Now] [Set Retention] [Export All] [Delete All]     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Automatic Cleanup

```bash
# Kazkade automatically cleans up old data
$ kazkade daemon status

Background Tasks:
┌──────────────────┬──────────┬──────────┬──────────┐
│ Task             │ Schedule │ Last Run │ Next Run │
├──────────────────┼──────────┼──────────┼──────────┤
│ Log rotation     │ Hourly   │ 12:00    │ 13:00    │
│ Cache cleanup    │ Daily    │ 02:00    │ 02:00 (+1)│
│ Crash dump purge │ Daily    │ 02:00    │ 02:00 (+1)│
│ Retention check  │ Weekly   │ Sun 03:00│ Sun 03:00│
└──────────────────┴──────────┴──────────┴──────────┘
```

---

## Data Minimization Verification

```bash
$ kazkade self-test --data-minimization

Data Minimization Verification:
================================

Logging:
  [PASS] Default log level: warn (not debug/info)
  [PASS] Query text NOT logged by default
  [PASS] Query results NOT logged by default
  [PASS] Log retention: 7 days (configurable)

Storage:
  [PASS] Column-level loading: ENABLED
  [PASS] Full table scans: AVOIDED (projected only)
  [PASS] Temporary data: DELETED after query

Retention:
  [PASS] Configurable retention: YES
  [PASS] Automatic cleanup: ENABLED
  [PASS] Manual deletion: SUPPORTED

Data Control:
  [PASS] Export all data: kazkade data export
  [PASS] Delete all data: kazkade data delete --all
  [PASS] View storage usage: kazkade dashboard --storage

Result: PASS - Data minimization principles satisfied
```

---

## The Cost of Data Minimization

| Metric | Without Minimization | With Minimization | Difference |
|--------|---------------------|-------------------|------------|
| Storage per TB data | 1.2 TB (with indexes) | 1.05 TB | 12.5% less |
| Query latency | 42ms (full table scan) | 12ms (column projection) | 71% faster |
| Memory per query | 512 MB (all columns) | 64 MB (projected) | 87.5% less |
| I/O per query | 256 MB | 32 MB | 87.5% less |

---

## Related Documentation

- [Data Collection Policy](./data-collection-policy.md) — What is collected
- [Privacy by Design](./privacy-by-design.md) — Architecture principles
- [Local-First Architecture](./local-first-architecture.md) — Processing locus
- [Privacy Compliance](./privacy-compliance.md) — Regulatory requirements

---

## Quick Reference

```bash
# View storage usage
kazkade dashboard --storage

# Set retention
kazkade config set data.retention_days=90

# Apply retention policies
kazkade data clean --apply-retention

# Export data
kazkade data export --all --format parquet

# Delete data
kazkade data delete --older-than 90
kazkade data delete --all --confirm

# Verify data minimization
kazkade self-test --data-minimization
```

---

*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*
