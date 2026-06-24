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

# Tutorial 6 — Neural Network Inference with Kazkade

Kazkade includes a SIMD-accelerated multi-layer perceptron (MLP) inference engine. The `neural` command creates a demo model, runs inference, and measures performance.

## Step 1 — Run Neural Inference

```bash
kazkade neural
```

Expected output:

```
Creating MLP (2→16→16→1)...
  Saved: /tmp/Kazkade_mlp.bin
  Loaded: 3 layers
  Forward: 2.5 us each (400000 infer/s)
  Output: 0.2156
```

## Step 2 — Understanding the MLP Architecture

The demo model has three layers:

| Layer | Input → Output | Activation | Weights | Biases |
|-------|----------------|------------|---------|--------|
| 1     | 2 → 16         | ReLU       | 32      | 16     |
| 2     | 16 → 16        | ReLU       | 256     | 16     |
| 3     | 16 → 1         | None       | 16      | 1      |

Weights are initialized with small random-like values centered around zero.

## Step 3 — Forward Pass

The input vector `[0.5, -0.3]` propagates through all three layers:

1. **Layer 1**: `output[j] = sum(input[i] × weights[i][j]) + bias[j]`, then `ReLU` (max with 0).
2. **Layer 2**: Same shape, second ReLU.
3. **Layer 3**: Linear output (no activation).

The entire forward pass runs 1000 times for timing, then reports average latency.

## Step 4 — The Saved Model File

```bash
ls -la /tmp/Kazkade_mlp.bin
xxd /tmp/Kazkade_mlp.bin | head -1
```

Binary format:

| Offset | Content           |
|--------|-------------------|
| 0–3    | Magic `KMLP`      |
| 4–7    | Version (1, u32)  |
| 8–11   | Layer count (3)   |
| 12–15  | Reserved          |
| 16+    | Layer headers + weights + biases |

## Step 5 — Loading and Reusing a Model

The binary file can be loaded back with `Mlp::load()`. The `kazkade neural` command demonstrates this by saving and immediately loading the model, verifying round-trip integrity.

## Step 6 — Performance

SIMD dispatch automatically selects AVX2, AVX-512, or NEON kernels for the dot product. On a typical x86-64 CPU:

- 2→16→16→1: ~2.5 µs per forward pass (single-threaded)
- 400,000+ inferences per second

---
*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*
