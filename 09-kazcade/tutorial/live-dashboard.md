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

# Tutorial 4 — Using the Live Dashboard

Kazkade ships with a real-time `egui` diagnostics dashboard. Launch it with a single command.

## Step 1 — Launch the Dashboard

```bash
kazkade dashboard
```

A 1280×800 window opens showing the Kazkade diagnostics UI with a dark theme.

## Step 2 — The Four Tabs

The tab bar at the top switches between four views:

| Key | Tab       | Content |
|-----|-----------|---------|
| `1` | Dashboard | Performance gauges, FPS chart, 3D viewport, SIMD badges, memory gauge |
| `2` | SQL       | Inline SQL query editor and result panel |
| `3` | History   | Benchmark history bar chart with clear button |
| `4` | Schema    | Columnar schema browser for `.acol` files |

## Step 3 — Dashboard Tab (Default)

- **FPS Chart** — Scrolling line chart showing average frame rate of the 3D viewport.
- **GEMM Bar Chart** — GFLOPS bars from benchmark events.
- **Throughput Gauges** — Vector GB/s and columnar filter speed as progress bars.
- **System Panel** — ISA, cache sizes, NUMA topology, memory usage gauge.
- **3D Viewport** — A rotating cube rendered by the software rasterizer. Drag to orbit; double-click to reset rotation.
- **Optimize Button** — Runs the GEMM auto-tuner and records a tuning event.

## Step 4 — SQL Tab

1. Type a query into the text box (e.g., `value, id FROM test.acol WHERE category > 5 LIMIT 10`).
2. Click **Run**.
3. Results appear as a table in the output panel below.

The SQL tab looks for `.acol` files in the system temp directory. Run `kazkade gen` first to create one.

## Step 5 — Schema Tab

Lists all `.acol` files found in the temp directory. Click a file name to expand its column names and types.

## Step 6 — Take a Screenshot

The Dashboard tab has an **Export Frame** button. It saves the current framebuffer as a PPM image:

```
Saved: /tmp/Kazkade_screenshot.ppm
```

## Navigation Tips

- Press `Esc` to close the dashboard.
- Press `R` to reset the 3D viewport rotation.
- Press `O` to trigger auto-tuning from the keyboard.

---
*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*
