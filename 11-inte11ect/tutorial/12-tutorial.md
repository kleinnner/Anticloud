<!-- ASCII Art for Tech-11 -->


¦¦¦¦¦¦¦+¦¦+  ¦¦+¦¦¦¦¦¦+  ¦¦¦¦¦¦+ ¦¦¦¦¦¦+ ¦¦¦¦¦¦¦¦+¦¦+¦¦¦+   ¦¦+ ¦¦¦¦¦¦+ 
¦¦+----++¦¦+¦¦++¦¦+--¦¦+¦¦+---¦¦+¦¦+--¦¦++--¦¦+--+¦¦¦¦¦¦¦+  ¦¦¦¦¦+----+ 
¦¦¦¦¦+   +¦¦¦++ ¦¦¦¦¦¦++¦¦¦   ¦¦¦¦¦¦¦¦¦++   ¦¦¦   ¦¦¦¦¦+¦¦+ ¦¦¦¦¦¦  ¦¦¦+
¦¦+--+   ¦¦+¦¦+ ¦¦+---+ ¦¦¦   ¦¦¦¦¦+--¦¦+   ¦¦¦   ¦¦¦¦¦¦+¦¦+¦¦¦¦¦¦   ¦¦¦
¦¦¦¦¦¦¦+¦¦++ ¦¦+¦¦¦     +¦¦¦¦¦¦++¦¦¦  ¦¦¦   ¦¦¦   ¦¦¦¦¦¦ +¦¦¦¦¦+¦¦¦¦¦¦++
+------++-+  +-++-+      +-----+ +-+  +-+   +-+   +-++-+  +---+ +-----+ 

¦¦¦¦¦¦¦+¦¦+  ¦¦+ ¦¦¦¦¦+ ¦¦¦¦¦¦+ ¦¦+¦¦¦+   ¦¦+ ¦¦¦¦¦¦+ 
¦¦+----+¦¦¦  ¦¦¦¦¦+--¦¦+¦¦+--¦¦+¦¦¦¦¦¦¦+  ¦¦¦¦¦+----+ 
¦¦¦¦¦¦¦+¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦++¦¦¦¦¦+¦¦+ ¦¦¦¦¦¦  ¦¦¦+
+----¦¦¦¦¦+--¦¦¦¦¦+--¦¦¦¦¦+--¦¦+¦¦¦¦¦¦+¦¦+¦¦¦¦¦¦   ¦¦¦
¦¦¦¦¦¦¦¦¦¦¦  ¦¦¦¦¦¦  ¦¦¦¦¦¦  ¦¦¦¦¦¦¦¦¦ +¦¦¦¦¦+¦¦¦¦¦¦++
+------++-+  +-++-+  +-++-+  +-++-++-+  +---+ +-----+ 

*Lois-Kleinner and 0-1.gg 2026 - Inte11ect Platform Documentation*
*Confidential - All Rights Reserved*


---

# Exporting and Sharing Logs

> **Associated Module:** Tech-11 — Log Management & Export Pipeline
> **Tutorial 12 of 12** — Estimated reading time: 14 min | Hands-on time: 15 min

## Overview

This final tutorial in the Getting Started series covers how to export, share, and analyze logs from the Inte11ect platform. Logs include inference records, module activity, GOD-11 routing decisions, .aioss ledger entries, system metrics, and crash reports.

Topics covered:

- Log types and locations
- Export formats (JSON, CSV, Parquet, Plain Text)
- Exporting from GUI and CLI
- Sharing logs securely
- Analyzing logs with external tools
- Automating log exports
- Log retention and rotation
- Compliance and audit requirements

---

## Section 1 — Log Types

Inte11ect maintains several distinct log streams:

| Log Type | Location | Contents | Retention |
|----------|----------|----------|-----------|
| Application | `~/.inte11ect/logs/inte11ect.log` | General application events | 30 days |
| Module | `~/.inte11ect/logs/modules/<module>.log` | Per-module activity | 30 days |
| Inference | `~/.inte11ect/logs/inference/` | Per-inference-session logs | 7 days |
| GOD-11 | `~/.inte11ect/logs/god11.log` | Routing decisions | 7 days |
| .aioss Ledger | `~/.inte11ect/ledger/aioss.db` | Immutable audit trail | Permanent |
| Crash | `~/.inte11ect/logs/crash/` | Crash dumps | 90 days |
| Metrics | `~/.inte11ect/logs/metrics/` | Performance metrics | 7 days |
| Security | `~/.inte11ect/logs/security.log` | Auth attempts, policy violations | 90 days |

### Log Rotation

```toml
[logging]
rotation_enabled = true
max_file_size_mb = 100
max_files = 10
compression = "gzip"
```

---

## Section 2 — Exporting from the GUI

1. Open the **System Log** panel (bottom toolbar)
2. Click the **Export** button
3. Select the export scope:

```
Export Logs
+-----------------------------------------------------+
¦ Scope:                                              ¦
¦ ? Current session                                   ¦
¦ ? Last 24 hours                                     ¦
¦ ? Custom range: [2026-06-18] to [2026-06-19]      ¦
¦                                                     ¦
¦ Include:                                            ¦
¦ [?] Inference logs                                  ¦
¦ [?] Module logs                                     ¦
¦ [?] GOD-11 routing                                  ¦
¦ [?] Ledger entries                                  ¦
¦ [?] System metrics                                  ¦
¦ [?] Crash reports                                   ¦
¦                                                     ¦
¦ Format: [JSON ?]                                    ¦
¦                                                     ¦
¦ [ Export ] [ Cancel ]                               ¦
+-----------------------------------------------------+
```

4. Choose a destination and filename
5. Click **Save**

---

## Section 3 — Exporting from the CLI

### Basic Export

```bash
# Export all logs from the last 24 hours
inte11ect logs export --since "24h" --format json --output ./logs_export.json

# Export logs for a specific date range
inte11ect logs export \
  --since "2026-06-01T00:00:00Z" \
  --until "2026-06-19T23:59:59Z" \
  --format json \
  --output ./logs_june.json
```

### Filtered Export

```bash
# Export only inference logs
inte11ect logs export --type inference --format jsonl

# Export only error-level logs
inte11ect logs export --level error --format csv

# Export GOD-11 routing logs
inte11ect logs export --type god11 --format json

# Export logs for a specific module
inte11ect logs export --module cog-reasoning --format json

# Export logs for a specific session
inte11ect logs export --session-id sess_abc123 --format json

# Export logs with ledger entries
inte11ect logs export --include-ledger --format json
```

### Export Formats

```bash
# JSON Lines (one JSON object per line)
inte11ect logs export --format jsonl --output logs.jsonl

# Pretty-printed JSON
inte11ect logs export --format json --output logs.json

# CSV for spreadsheet analysis
inte11ect logs export --format csv --output logs.csv

# Parquet for data analysis (Pandas, Spark)
inte11ect logs export --format parquet --output logs.parquet

# Plain text (readable format)
inte11ect logs export --format text --output logs.txt
```

---

## Section 4 — Export Examples

### Export Inference History

```bash
inte11ect logs export \
  --type inference \
  --since "7d" \
  --format json \
  --output inference_history.json
```

Output:

```json
[
  {
    "session_id": "sess_abc123",
    "timestamp": "2026-06-19T10:30:00Z",
    "model": "Qwen2-VL-2B-Instruct",
    "prompt_preview": "What is eigenvector routing?",
    "tokens_in": 47,
    "tokens_out": 128,
    "latency_ms": 4892,
    "route": ["data-ingest", "cog-reasoning", "gen-text"],
    "confidence": 0.94,
    "user_rating": null
  }
]
```

### Export Module Performance

```bash
inte11ect logs export \
  --type module \
  --since "24h" \
  --format csv \
  --output module_performance.csv
```

```
timestamp,module,invocations,avg_latency_ms,p95_latency_ms,error_rate,cache_hit_rate
2026-06-19T00:00:00Z,cog-reasoning,1284,342,890,0.03,0.72
2026-06-19T00:00:00Z,gen-text,1284,89,210,0.01,0.88
2026-06-19T00:00:00Z,data-ingest,1284,12,45,0.00,0.95
```

### Export System Metrics

```bash
inte11ect logs export \
  --type metrics \
  --since "1h" \
  --format json \
  --output metrics.json
```

```json
{
  "timestamps": ["10:00", "10:05", "10:10", ...],
  "cpu_percent": [45, 52, 38, ...],
  "ram_gb": [4.2, 4.5, 4.1, ...],
  "vram_gb": [2.1, 2.8, 2.1, ...],
  "requests_per_sec": [1.8, 2.1, 1.5, ...],
  "latency_p95_ms": [890, 720, 950, ...]
}
```

---

## Section 5 — Secure Log Sharing

### Redaction

Before sharing logs, sensitive information should be redacted:

```bash
# Export with automatic redaction
inte11ect logs export \
  --redact \
  --redact-fields "prompt,prompt_preview,api_key,user_id,ip_address" \
  --format json \
  --output ./redacted_logs.json

# Default redaction rules
inte11ect logs redact-rules list

# +-------------------------------------------------+
# ¦ Field Pattern        ¦ Replacement              ¦
# +----------------------+--------------------------¦
# ¦ *api_key*            ¦ [REDACTED API KEY]       ¦
# ¦ *token*              ¦ [REDACTED TOKEN]         ¦
# ¦ *password*           ¦ [REDACTED PASSWORD]      ¦
# ¦ *secret*             ¦ [REDACTED SECRET]        ¦
# ¦ email                ¦ [REDACTED EMAIL]         ¦
# ¦ ip_address           ¦ [REDACTED IP]            ¦
# ¦ user_id              ¦ [REDACTED USER ID]       ¦
# ¦ prompt*              ¦ [REDACTED PROMPT]        ¦
# +-------------------------------------------------+
```

### Signed Exports

```bash
# Export with cryptographic signature
inte11ect logs export \
  --sign \
  --signing-key ~/.inte11ect/ledger/signing_key.pem \
  --output ./signed_logs.json

# Verify signed export
inte11ect logs verify-export \
  --input ./signed_logs.json \
  --public-key ~/.inte11ect/ledger/public_key.pem
```

### Encrypted Exports

```bash
# Export with encryption
inte11ect logs export \
  --encrypt \
  --recipient-key ./recipient_public_key.pem \
  --output ./logs.encrypted.json

# Decrypt
inte11ect logs decrypt \
  --input ./logs.encrypted.json \
  --private-key ./recipient_private_key.pem \
  --output ./logs.json
```

---

## Section 6 — Sharing via Secure Links

```bash
# Create a secure share link (hosted on Inte11ect Cloud)
inte11ect logs share \
  --since "24h" \
  --expires "24h" \
  --max-downloads 5 \
  --password "share-password-123"

# Output:
# Share link: https://share.intelleect.dev/s/abc123
# Password: share-password-123
# Expires: 2026-06-20T10:30:00Z
# Max downloads: 5
```

### Self-Hosted Sharing

```toml
[sharing]
enabled = true
host = "0.0.0.0"
port = 8082
data_dir = "~/.inte11ect/shares/"
max_share_size_mb = 500
default_expiry_hours = 24
require_password = true
```

---

## Section 7 — Analyzing Logs with External Tools

### Pandas (Python)

```python
import pandas as pd

# Load exported CSV
df = pd.read_csv('module_performance.csv')

# Summary statistics
print(df.groupby('module').agg({
    'avg_latency_ms': 'mean',
    'error_rate': 'mean',
    'invocations': 'sum'
}))

# Detect anomalies
threshold = df['avg_latency_ms'].quantile(0.95)
anomalies = df[df['avg_latency_ms'] > threshold]
print(f"Anomalies detected: {len(anomalies)}")
```

### Jupyter Notebook

```python
# In a Jupyter notebook
import json
import matplotlib.pyplot as plt

with open('metrics.json') as f:
    data = json.load(f)

plt.figure(figsize=(12, 6))
plt.plot(data['timestamps'], data['vram_gb'], label='VRAM (GB)')
plt.plot(data['timestamps'], data['ram_gb'], label='RAM (GB)')
plt.xlabel('Time')
plt.ylabel('Memory (GB)')
plt.title('Inte11ect Memory Usage')
plt.legend()
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
```

### Elasticsearch / Kibana

```bash
# Export logs in Elasticsearch bulk format
inte11ect logs export \
  --format elasticsearch \
  --output ./logs_for_es.ndjson

# Import into Elasticsearch
curl -X POST "localhost:9200/_bulk" \
  -H "Content-Type: application/x-ndjson" \
  --data-binary @logs_for_es.ndjson
```

### Grafana / Prometheus

```toml
[metrics]
export_enabled = true
export_format = "prometheus"
export_port = 9090
```

```bash
# Or export metrics for Grafana
inte11ect logs export --type metrics --format prometheus --output ./metrics.prom
```

---

## Section 8 — Automated Export Pipeline

### Cron-Based Export

```bash
# Every hour, export inference logs
0 * * * * /usr/bin/inte11ect logs export \
  --since "1h" \
  --type inference \
  --format json \
  --output "/var/log/inte11ect/exports/inference_$(date +\%Y\%m\%d\%H\%M).json"

# Every day at midnight, export all logs and cleanup
0 0 * * * /usr/bin/inte11ect logs export \
  --since "24h" \
  --format parquet \
  --output "/var/log/inte11ect/exports/daily_$(date +\%Y\%m\%d).parquet" \
  && /usr/bin/inte11ect logs prune --older-than 30d
```

### Systemd Timer (Linux)

```ini
# /etc/systemd/system/inte11ect-log-export.service
[Unit]
Description=Inte11ect Log Export
After=inte11ect.service

[Service]
Type=oneshot
ExecStart=/usr/bin/inte11ect logs export \
  --since "24h" \
  --format json \
  --output /var/log/inte11ect/exports/daily.json
User=inte11ect
Group=inte11ect
```

```ini
# /etc/systemd/system/inte11ect-log-export.timer
[Unit]
Description=Daily Inte11ect Log Export

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

### Logstash Pipeline

```ruby
# /etc/logstash/conf.d/inte11ect.conf
input {
  file {
    path => "/home/inte11ect/.inte11ect/logs/inte11ect.log"
    start_position => "beginning"
    sincedb_path => "/var/lib/logstash/inte11ect.sincedb"
  }
}

filter {
  json {
    source => "message"
  }
  date {
    match => ["timestamp", "ISO8601"]
  }
}

output {
  elasticsearch {
    hosts => ["localhost:9200"]
    index => "inte11ect-logs-%{+YYYY.MM.dd}"
  }
}
```

---

## Section 9 — Log Retention and Pruning

### Manual Pruning

```bash
# Delete logs older than 7 days
inte11ect logs prune --older-than 7d

# Prune but keep crash reports
inte11ect logs prune --older-than 7d --preserve crash

# Prune specific log types
inte11ect logs prune --type metrics --older-than 1d

# Vacuum the database after pruning
inte11ect logs vacuum
```

### Automated Retention

```toml
[logging.retention]
application = "30d"
module = "30d"
inference = "7d"
god11 = "7d"
metrics = "7d"
crash = "90d"
security = "90d"

[logging.retention.archive]
enabled = true
archive_path = "~/.inte11ect/logs/archive/"
compression = "zstd"
archive_older_than = "30d"
```

---

## Section 10 — Compliance and Audit Logging

### Export for Auditors

```bash
# Export all security events for the last 90 days
inte11ect logs export \
  --type security \
  --since "90d" \
  --format json \
  --sign \
  --include-ledger-proofs \
  --output ./audit_package.json

# Generate a compliance report
inte11ect logs compliance-report \
  --standard soc2 \
  --since "90d" \
  --output ./soc2_report.pdf
```

### Immutable Audit Trail

The `.aioss` ledger provides the definitive audit trail. Export it separately:

```bash
inte11ect ledger export \
  --since "90d" \
  --format jsonl \
  --sign \
  --include-proofs \
  --output ./ledger_audit_export.jsonl
```

---

## Section 11 — Troubleshooting Log Exports

### "Export file is too large"

```bash
# Split export into chunks
inte11ect logs export \
  --since "90d" \
  --split 100MB \
  --output ./logs_chunk_.json

# Produces: logs_chunk_001.json, logs_chunk_002.json, ...

# Or export in compressed format
inte11ect logs export \
  --since "90d" \
  --compress zstd \
  --output ./logs.json.zst
```

### "Export failed — no logs found"

```bash
# Check if logging is enabled
inte11ect config --get logging.enabled

# Verify log directory exists
ls -la ~/.inte11ect/logs/

# Check log levels
inte11ect config --set logging.level=debug
```

### "Redaction removed too much data"

```bash
# Preview redaction without exporting
inte11ect logs redact-preview --lines 10

# Customize redaction rules
inte11ect logs redact-rules add \
  --field "prompt_content" \
  --pattern "(?<=password=)\w+" \
  --replacement "[REDACTED PASSWORD]"
```

---

## Section 12 — CLI Reference

| Command | Description |
|---------|-------------|
| `inte11ect logs export` | Export logs |
| `inte11ect logs prune` | Delete old logs |
| `inte11ect logs vacuum` | Optimize log storage |
| `inte11ect logs share` | Create secure share link |
| `inte11ect logs redact-preview` | Preview redaction |
| `inte11ect logs redact-rules` | Manage redaction rules |
| `inte11ect logs verify-export` | Verify signed export |
| `inte11ect logs decrypt` | Decrypt encrypted export |
| `inte11ect logs compliance-report` | Generate compliance report |
| `inte11ect ledger export` | Export .aioss ledger entries |
| `inte11ect log tail` | View live logs |
| `inte11ect log level` | Set log verbosity |

---

## Congratulations!

You have completed the 12-tutorial Getting Started series. You should now be comfortable with:

- Installing and launching Inte11ect
- Downloading and verifying models
- Exploring all 72 modules
- Using GOD-11 meta-cognition
- Verifying the .aioss ledger
- Creating Mermaid diagrams
- Integrating with external tools
- Performance tuning
- Building from source
- Troubleshooting common issues
- Security best practices
- Exporting and sharing logs

### Next Steps

- Explore the [Features](../features/01-features.md) section for deep dives
- Read [Developer Docs](../developers/01-developers.md) for SDK and API details
- Check [Enterprise](../enterprise/01-enterprise.md) for deployment strategies

---

*Lois-Kleinner and 0-1.gg 2026 — Confidential*

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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
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
