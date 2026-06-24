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

# No Vendor Lock-In — Your Data, Your Format, Your Hardware

## The Lock-In Landscape

Every major data platform today ties you to its ecosystem. Snowflake owns your query history and charges egress fees for every byte you extract. Databricks wraps Spark in a proprietary layer with non-portable UDF APIs. Google BigQuery requires you to use Google Cloud storage. Even ostensibly open-source tools like Elasticsearch use proprietary licensing (SSPL) that restricts how you can offer the software as a service. You are not just adopting a tool — you are entering a long-term relationship with a vendor.

Kazkade is different by design.

## Fully Open Source — No Proprietary Anything

Kazkade is released under the Apache 2.0 license. There is no dual license, no community edition vs enterprise edition, no hidden proprietary kernel, no "source-available" trickery. Every line of code — runtime, CLI, cryptographic primitives, SIMD kernels, file format implementation — is open source. You can audit it, fork it, patch it, and redistribute it without asking permission.

## No Cloud Dependency

Kazkade has no cloud. There is no Kazkade Cloud, no Kazkade SaaS, no mandatory telemetry endpoint. The binary does not phone home. You never need an API key to use it:

```
# No signup, no API key, no account
./kazkade query "SELECT * FROM trades.kzc LIMIT 10"
```

If you want to use Kazkade on a laptop in a cabin with no internet, it works identically to a deployment in a 1000-node cluster. The network is optional.

## No SaaS, No Subscription

Kazkade costs nothing to use. There is no per-core licensing fee, no storage tier pricing, no credit system, no consumption-based billing. The binary is free. The source is free. The format is documented and free. Your total cost of ownership is the hardware you choose to run it on.

Compare to typical enterprise data platform TCO:

| Cost Component | Snowflake / Databricks | Kazkade |
|---|---|---|
| Software license | $2–4 per compute credit-hour | $0 |
| Cloud storage | $23/TB/month + egress $0.12/GB | $0 (bring your own) |
| API access | Metered | $0 |
| Audit/security add-ons | Extra $ | $0 (built-in) |
| Vendor training/cert | $200–$5,000/person | $0 (CLI is self-documenting) |
| Annual TCO (100 TB, 10 users) | ~$250,000+ | Hardware cost only |

## Your Data Stays on Your Hardware, in Your Format

Kazkade columns are regular files. They live on your SSD, your NFS mount, your S3 bucket (if you choose), or your tape archive. There is no proprietary storage engine that only Kazkade can read. The `.kzc` column format and the `.aioss` ledger format are fully documented with reference parsers in the repository.

You can:
- **Copy columns with `cp`** — they are regular files
- **Back up with `rsync`** — they are regular files
- **Version with Git LFS** — they are regular files
- **Mount via NFS/SMB** and access from any machine
- **Read with custom scripts** using the open format specification

## Migration Paths to and from Other Formats

Lock-in is not just about reading your data — it's about getting it out. Kazkade provides built-in two-way converters:

```
kazkade import trades.csv --output trades.kzc      # CSV → Kazkade
kazkade export trades.kzc --format parquet          # Kazkade → Parquet
kazkade export trades.kzc --format arrow            # Kazkade → Arrow IPC
kazkade export trades.kzc --format numpy            # Kazkade → .npy
kazkade export trades.kzc --format jsonl            # Kazkade → JSON Lines
```

Import from any columnar or tabular format. Export to any industry-standard format. There is no data gravity lock. If you decide Kazkade is not right for your next project, you leave with every byte — no export tool that mysteriously breaks, no "we'll email you a CSV" support ticket.

## Forever Access

The Kazkade CLI is a single binary. You can keep the version from 2026 and it will still read columns created in 2030, and vice versa. The file format uses forward-compatible page types: unknown page types are skipped with a warning, not rejected. Your data will never become unreadable because a vendor discontinued a product line.

This is not just good citizenship — it's a practical necessity for long-lived data. Regulated retention periods of 7–10 years mean the tool you choose today must either survive or let your data leave cleanly. Kazkade guarantees both.

---
*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*