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