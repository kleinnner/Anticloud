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

# Diagnostics Dashboard — Live `egui` Monitoring

The Kazkade diagnostics dashboard is an `egui`-based real-time monitoring UI that displays internal performance metrics, history, SQL query profiles, and schema information. It is built with `eframe` (native window) and can optionally be embedded into the installer's rasterizer view.

## Tab Layout

```mermaid
flowchart TD
    subgraph Dashboard
        direction LR
        T1[Performance] --> T2[History]
        T2 --> T3[SQL]
        T3 --> T4[Schema]
    end

    T1 --> P1[FPS Chart]
    T1 --> P2[GEMM Bar Chart]
    T1 --> P3[Auto-Tuner Panel]
    T1 --> P4[CPU / Memory Gauges]

    T2 --> H1[.aioss Timeline]
    T2 --> H2[Benchmark Table]

    T3 --> Q1[Query Log]
    T3 --> Q2[Explain Plan Viewer]

    T4 --> S1[Column List]
    T4 --> S2[Type / Codec Summary]
```

## 1. Performance Tab

The default view shows four panels:

- **FPS Chart** — a sparkline plotting framerate over the last 10 seconds. Sampled every frame via `std::time::Instant`.
- **GEMM Bar Chart** — throughput in GFLOPS for each GEMM tile size tested by the auto-tuner. Updated whenever `kazkade bench --neural` runs.
- **Auto-Tuner Panel** — lists the current tile configuration (AVX2 8×8, AVX-512 16×16, etc.) and the last benchmark latency.
- **CPU / Memory Gauges** — real-time utilisation via `sysinfo` crate; updated at 1 Hz.

```rust
// Each gauge is a simple egui `ProgressBar` styled as a gauge.
ui.add(
    egui::widgets::ProgressBar::new(cpu_usage / 100.0)
        .animate(true)
        .text(format!("CPU {:.1}%", cpu_usage)),
);
```

## 2. History Tab

The History tab reads the `.aioss` ledger (see `aioss-ledger.md`) and renders:

- A timeline view (vertical scroll, left-to-right) showing each record as a dot coloured by entry type. Clicking expands the record JSON.
- A benchmark summary table: columns for timestamp, GEMM GFLOPS, scan bandwidth, rasterizer FPS. Sorted by time descending.

History is persisted across sessions by appending a new record every 60 seconds or on explicit snapshot (triggered by the "Snapshot Now" button).

## 3. SQL Tab

Displays recent SQL queries executed through the `kazkade query` CLI or programmatic API. Each row shows:

- Query text (truncated to 120 chars)
- Duration (µs)
- Rows scanned
- Scan method (SIMD/scalar)

A second panel shows the `EXPLAIN` plan for the selected query, decoded from the columnar engine's query planner.

## 4. Schema Tab

Lists every column across all loaded `.acol` datasets. For each column:

- **Name** and **logical type**
- **Physical codec** and compression ratio
- **Nullable** flag
- **Cardinality** estimate (hyperloglog sketch)

## Data Flow

```mermaid
sequenceDiagram
    participant Engine as Kazkade Engine
    participant Ledger as .aioss Ledger
    participant UI as egui Dashboard

    loop every 16 ms
        Engine->>Engine: record FPS, query metrics
        Engine->>UI: push to ring buffer
        UI->>UI: render charts
    end

    loop every 60 s
        Engine->>Ledger: append snapshot record
        Ledger->>Ledger: sign with Ed25519
    end

    opt on user click "Snapshot Now"
        Engine->>Ledger: append snapshot record
    end
```

## Integration with .aioss

The dashboard's History tab depends on the `.aioss` ledger. When the dashboard starts, it calls `AiossLedger::open()` on the default ledger path (`~/.kazcade/ledger.aioss`). New snapshots are appended via `ledger.append(0x02, snapshot_json, &key)`. The user can export the ledger at any time as proof of benchmark integrity.

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

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
