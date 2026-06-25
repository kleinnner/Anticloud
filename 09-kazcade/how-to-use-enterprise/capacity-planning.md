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

# Capacity Planning

This guide covers sizing guides for CPU cores, RAM, and storage per workload type, plus scaling recommendations for columnar analytics.

## Workload Profiles

| Workload | CPU | RAM | Storage | IOPS | Network |
|----------|-----|-----|---------|------|---------|
| Columnar Analytics | High (SIMD) | Moderate | High | Seq. read | Low |
| Real-time Ingestion | Low | Moderate | High | Seq. write | Moderate |
| SQL Querying | Moderate | High | Moderate | Random read | Low |
| ML Inference | High (SIMD) | High | Low | Low | Low |
| Ledger Operations | Low | Low | Moderate | Low | Low |
| Dashboard Hosting | Low | Moderate | Low | Low | Low |

## General Sizing Formula

### Memory

`
Memory = (DataSize × WorkingSetFactor) + Overhead
  where:
    WorkingSetFactor = 0.3 (analytics) / 0.5 (queries) / 0.1 (ingestion)
    Overhead = 2 GB (base) + 1 GB per 100 MB/s throughput
`

Example: 100 GB analytics dataset:
`
Memory = (100 GB × 0.3) + 2 GB + 1 GB = 33 GB
Recommended: 32-48 GB
`

### CPU Cores

`
Cores = max(ThroughputGBps / 0.3, ConcurrentQueries × 0.5)
  where:
    0.3 GB/s per core for analytics
    0.5 core per concurrent query
`

Example: 2 GB/s throughput, 20 concurrent queries:
`
Cores = max(2 / 0.3, 20 × 0.5) = max(6.7, 10) = 10
Recommended: 12-16 cores
`

### Storage

`
Storage = DataSize × (1 + CompressionRatio) × ReplicationFactor + LogSpace
  where:
    CompressionRatio = 0.3 (typical with Kazkade codecs)
    ReplicationFactor = 1 (no replication) / 3 (HA cluster)
    LogSpace = 100 GB (minimum)
`

Example: 500 GB raw data, 3x replication:
`
Storage = 500 × 1.3 × 3 + 100 = 2050 GB
Recommended: 2 TB + 20% headroom = 2.4 TB
`

## Sizing Tables

### By Data Volume

| Data Volume | CPU Cores | RAM | Storage | Nodes |
|-------------|-----------|-----|---------|-------|
| < 100 GB | 4-8 | 16 GB | 500 GB | 1 |
| 100 GB - 1 TB | 8-16 | 32 GB | 2 TB | 2-3 |
| 1 TB - 10 TB | 16-32 | 64 GB | 10 TB | 3-5 |
| 10 TB - 100 TB | 32-64 | 128 GB | 50 TB | 5-10 |
| 100 TB+ | 64+ | 256 GB+ | Custom | 10+ |

### By Query Load

| QPS | CPU Cores | RAM | Notes |
|-----|-----------|-----|-------|
| < 100 | 4-8 | 16 GB | Light usage |
| 100 - 1,000 | 8-16 | 32 GB | Moderate |
| 1,000 - 10,000 | 16-32 | 64 GB | Heavy |
| 10,000+ | 32-64+ | 128 GB+ | Extreme (scale out) |

### By Ingestion Rate

| Rate | CPU Cores | RAM | Storage IOPS |
|------|-----------|-----|--------------|
| < 100 MB/s | 4 | 16 GB | 10K |
| 100 - 500 MB/s | 8 | 32 GB | 50K |
| 500 MB/s - 2 GB/s | 16 | 64 GB | 100K |
| 2 GB/s+ | 32+ | 128 GB+ | 200K+ |

## Reference Deployments

### Small Deployment (< 100 GB)

`yaml
# small.yml
version: "0.6"
nodes: 1
resources:
  cpu: 8 cores
  ram: 16 GB
  storage: 500 GB NVMe
workload:
  type: mixed_analytics
  dataset: ~50 GB
  qps: ~50
throughput:
  scan: 500 MB/s
  query: 200 QPS
`

### Medium Deployment (1-10 TB)

`yaml
# medium.yml
version: "0.6"
nodes: 3
resources:
  cpu: 16 cores
  ram: 64 GB
  storage: 4 TB NVMe (per node)
network: 25 GbE
workload:
  type: analytics + ingestion
  dataset: ~5 TB
  qps: ~500
  ingestion: 200 MB/s
throughput:
  scan: 2 GB/s
  query: 1,000 QPS
`

### Large Deployment (10-100 TB)

`yaml
# large.yml
version: "0.6"
nodes: 8
resources:
  cpu: 32 cores
  ram: 128 GB
  storage: 10 TB NVMe (per node)
network: 100 GbE
workload:
  type: heavy_analytics
  dataset: ~50 TB
  qps: ~5,000
  ingestion: 1 GB/s
throughput:
  scan: 10 GB/s
  query: 5,000 QPS
`

## Storage Recommendations

### Filesystem

| Filesystem | Recommendation | Notes |
|------------|---------------|-------|
| ext4 | Good | General purpose |
| xfs | Best | Large files, parallel IO |
| NTFS | Good (Windows) | Enterprise Windows |
| ZFS | Good | Compression + snapshots |
| btrfs | Experimental | Not recommended for production |

### Disk Types

| Type | Use Case | Recommended |
|------|----------|-------------|
| NVMe | Primary data | Yes |
| SSD (SATA) | Warm data | Acceptable |
| HDD | Cold/archive | Not for active data |
| Cloud EBS | Cloud deployments | gp3 or io2 |

### RAID Configuration

| RAID | Read | Write | Redundancy | Recommended |
|------|------|-------|------------|-------------|
| RAID 0 | ✓✓✓ | ✓✓✓ | None | Temp/scratch |
| RAID 1 | ✓✓ | ✓✓ | ✓✓✓ | OS + ledger |
| RAID 10 | ✓✓✓ | ✓✓✓ | ✓✓✓ | Primary data |
| RAID 5 | ✓✓ | ✓ | ✓ | Not recommended |
| RAID 6 | ✓✓ | ✓ | ✓✓✓ | Cold storage |

## Scaling Patterns

### Vertical Scaling (Scale Up)

`ash
# Add more resources to existing node
kazcade-ctl node update node1 \
  --cpu 32 \
  --memory 128GB \
  --rolling-restart
`

### Horizontal Scaling (Scale Out)

`ash
# Add node to cluster
kazcade-ctl node add \
  --host node4.internal \
  --data-dir /data/kazcade \
  --join node1:8742

# Rebalance data
kazcade-ctl rebalance \
  --strategy capacity \
  --target-usage 0.8
`

### Auto-Scaling (Cloud)

`yaml
# auto-scale.yml
auto_scaling:
  enabled: true
  min_nodes: 3
  max_nodes: 20

  scale_up:
    metrics:
      - cpu_utilization > 80% for 5m
      - query_queue_depth > 100 for 2m
    cooldown: 120s
    increment: 2

  scale_down:
    metrics:
      - cpu_utilization < 30% for 15m
      - query_queue_depth < 10 for 10m
    cooldown: 300s
    decrement: 1
`

## Benchmarking for Sizing

`ash
# Run capacity planning benchmark
kazkade bench --capacity \
  --rows 1000000000 \
  --cols 20 \
  --simulated-concurrency 50

# Output:
# Capacity Planning Report
# ┌──────────────────────┬──────────┬──────────┐
# │ Metric               │ Single   │ Cluster  │
# ├──────────────────────┼──────────┼──────────┤
# │ Scan throughput      │ 1.2 GB/s │ 8.5 GB/s │
# │ Query throughput     │ 450 QPS  │ 3200 QPS │
# │ Ingestion rate       │ 300 MB/s │ 2.1 GB/s │
# │ P99 latency (query) │ 45 ms    │ 38 ms     │
# │ Memory usage         │ 28 GB    │ 32 GB     │
# │ CPU utilization       │ 65%      │ 72%       │
# └──────────────────────┴──────────┴──────────┘
`

## Cost Estimation

`python
# cost_estimate.py
def estimate_cost(config):
    instance = {
        'small': {'cpu': 8, 'ram': 16, 'cost_per_hour': 0.50},
        'medium': {'cpu': 16, 'ram': 64, 'cost_per_hour': 1.20},
        'large': {'cpu': 32, 'ram': 128, 'cost_per_hour': 2.50},
    }
    
    storage_cost_per_gb_month = 0.08  # NVMe
    network_cost_per_gb = 0.01
    
    i = instance[config['size']]
    compute = i['cost_per_hour'] * 730 * config['nodes']
    storage = config['storage_tb'] * 1024 * storage_cost_per_gb_month
    network = config['data_transfer_tb'] * 1024 * network_cost_per_gb
    
    return {
        'compute_monthly': compute,
        'storage_monthly': storage,
        'network_monthly': network,
        'total_monthly': compute + storage + network,
    }

print(estimate_cost({'size': 'medium', 'nodes': 3, 'storage_tb': 5, 'data_transfer_tb': 10}))
# {'compute_monthly': 2628, 'storage_monthly': 409.6, 'network_monthly': 102.4, 'total_monthly': 3140}
`

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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
