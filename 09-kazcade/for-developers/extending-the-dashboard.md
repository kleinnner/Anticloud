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

# Extending the Dashboard

The dashboard is an `egui`-based live diagnostics window defined in `src/dashboard.rs`. It has 4 tabs: Dashboard (viewport + perf metrics), SQL, History, and Schema. This guide explains how to add a new tab or panel.

## Dashboard Struct

The main state is the `Dashboard` struct:

```rust
pub struct Dashboard {
    pipeline: kazkade::raster::Pipeline,
    angle: f32, rot_x: f32, rot_y: f32,
    telemetry: Telemetry,
    frame_times: Vec<f32>,
    last_frame: Instant,
    optimizing: bool,
    tab: usize,               // ← selected tab index
    sql_input: String,
    sql_output: String,
    history: Vec<(String, String, f64)>,
    export_msg: String,
    auto_rotate: bool,
    close_requested: bool,
}
```

A new tab needs: (a) a variant in the tab switching, (b) a dedicated `fn tab_*` method, (c) any new state fields.

## Step 1: Add State Fields

Add your tab's data to the `Dashboard` struct:

```rust
pub struct Dashboard {
    // ... existing fields ...
    pub tab: usize,
    // New state for "Benchmarks" tab
    bench_results: Vec<(String, f64, f64)>,  // (label, gflops, time_ms)
    bench_running: bool,
}
```

Initialize in `Default::default()`:

```rust
Self {
    // ... existing ...
    bench_results: Vec::new(),
    bench_running: false,
}
```

## Step 2: Add a Tab Variant

The tab bar is rendered as a horizontal strip of `selectable_value` buttons in the `ui()` method. Add your tab:

```rust
egui::Panel::top("tabs").show_inside(ui, |ui| {
    ui.horizontal(|ui| {
        ui.selectable_value(&mut self.tab, 0, "\u{2B21} Dashboard");
        ui.selectable_value(&mut self.tab, 1, "SQL");
        ui.selectable_value(&mut self.tab, 2, "History");
        ui.selectable_value(&mut self.tab, 3, "Schema");
        ui.selectable_value(&mut self.tab, 4, "Benchmarks");  // ← new
    });
});
```

Update the match statement:

```rust
match self.tab {
    0 => self.tab_dashboard(ui, &ctx),
    1 => self.tab_sql(ui),
    2 => self.tab_history(ui),
    3 => self.tab_schema(ui),
    4 => self.tab_benchmarks(ui),  // ← new
    _ => {}
}
```

Add a keyboard shortcut in the `ui.input()` block:

```rust
egui::Key::Num5 => self.tab = 4,
```

## Step 3: Implement the `paint` Function

Write your tab method following the existing pattern:

```rust
impl Dashboard {
    fn tab_benchmarks(&mut self, ui: &mut egui::Ui) {
        let (g, w, o) = (c32(0,255,136), c32(220,220,220), c32(255,170,0));
        ui.heading(RichText::new("Benchmarks").color(g));
        ui.separator();

        if self.bench_running {
            ui.add(egui::Spinner::new());
            ui.label("Running benchmarks...");
        } else if ui.button("Run All Benchmarks").clicked() {
            self.bench_running = true;
            // Run benchmarks (would call kazkade::simd::matrix::matmul_f32 etc.)
            // Record results into self.bench_results
        }

        ui.separator();
        for (label, gflops, ms) in &self.bench_results {
            ui.horizontal(|ui| {
                ui.label(RichText::new(label).color(w));
                ui.label(RichText::new(format!("{:.1} GFLOPS", gflops)).color(g));
                ui.label(RichText::new(format!("({:.2} ms)", ms)).color(o));
            });
        }
    }
}
```

## Step 4: Add History Persistence

If you want the tab's state to persist across sessions, add save/load logic in `record_history()` / `save_history()` / `load_history()`:

```rust
fn save_history(&self) {
    let path = std::env::temp_dir().join("Kazkade_history.json");
    let mut data: Vec<String> = self.history.iter()
        .map(|(l, v, _)| format!("{}:{}", l, v)).collect();
    // Add benchmark results
    for (label, gflops, ms) in &self.bench_results {
        data.push(format!("bench:{}:{}:{}", label, gflops, ms));
    }
    if let Ok(s) = serde_json::to_string(&data) { let _ = std::fs::write(&path, &s); }
}
```

## Step 5: Add a Telemetry Event Type (Optional)

If the tab generates measurable events, add a variant to `Event` in `src/telemetry.rs`:

```rust
pub enum Event {
    // ... existing ...
    Bench { label: String, gflops: f64, elapsed: Duration },
}
```

Then record it:

```rust
self.telemetry.record(Event::Bench {
    label: "GEMM 512".into(),
    gflops: 420.5,
    elapsed: start.elapsed(),
});
```

## Step 6: Update the .aioss Mapping

If the event is to be recorded in the ledger, add a mapping in `src/aioss.rs`'s `event_to_content()`:

```rust
Event::Bench { label, gflops, elapsed } => {
    ("bench".into(), serde_json::json!({
        "label": label, "gflops": gflops,
        "ms": elapsed.as_secs_f64() * 1000.0
    }))
}
```

## Pattern Summary

| Component | File | Change |
|-----------|------|--------|
| State fields | `src/dashboard.rs:8-22` | Add fields to `Dashboard` struct |
| Initialization | `src/dashboard.rs:24-38` | `Default::default()` init |
| Tab bar | `src/dashboard.rs:103-110` | Add `selectable_value` call |
| Tab dispatch | `src/dashboard.rs:112-118` | Add `match` arm |
| Paint function | new `fn tab_*` | Implement UI rendering |
| Keyboard shortcut | `src/dashboard.rs:76-97` | Add `Key::NumN` binding |
| Persistence | `save_history`/`load_history` | Extend JSON save/load |
| Telemetry | `src/telemetry.rs` | Optional: new `Event` variant |
| Aioss | `src/aioss.rs` | Optional: new `event_to_content` mapping |

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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ