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

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20776273
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/09-kazcade
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
4. Lois-Kleinner Internet Arc: https://archive.org/details/kazcade
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
