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
