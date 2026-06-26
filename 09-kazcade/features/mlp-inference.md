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

# MLP Inference Engine

Kazkade's MLP (Multi-Layer Perceptron) inference engine runs forward passes on fully connected neural networks with SIMD-accelerated dot products and configurable activation functions. Models are stored in a custom `.kaz` binary format and can be loaded, inspected, and executed from the CLI or programmatically.

## Layer Structure

A `Layer` stores weights and biases in contiguous memory for cache-friendly SIMD access:

```rust
pub struct Layer {
    pub weights: Vec<f32>,   // [input_size × output_size], row-major
    pub biases: Vec<f32>,    // [output_size]
    pub input_size: usize,
    pub output_size: usize,
    pub activation: Activation,
}

pub enum Activation {
    ReLU,
    GELU,
    Sigmoid,
    Linear, // identity, no transformation
}
```

The `weights` matrix is stored in row-major order: row `i` contains all incoming weights to output neuron `i`. This layout allows the forward pass to compute `output = weights × input + biases` as a series of SIMD dot products.

## Forward Pass with SIMD Dot Product

The forward pass dispatches to the best available SIMD kernel:

```rust
impl Layer {
    pub fn forward(&self, input: &[f32], output: &mut [f32]) {
        assert_eq!(input.len(), self.input_size);
        assert_eq!(output.len(), self.output_size);

        // Dispatch dot product
        for i in 0..self.output_size {
            let w_start = i * self.input_size;
            let w_slice = &self.weights[w_start..w_start + self.input_size];
            output[i] = simd_dot_product(w_slice, input) + self.biases[i];
        }

        // Apply activation
        match self.activation {
            Activation::ReLU => simd_relu(output),
            Activation::GELU => simd_gelu(output),
            Activation::Sigmoid => simd_sigmoid(output),
            Activation::Linear => {},
        }
    }
}
```

The `simd_dot_product` function selects between AVX2 (8× `vfmadd231ps` per loop), AVX-512 (16×), or NEON (4× `vfmaq_f32`), with a scalar fallback.

## Activations

- **ReLU** — `max(0, x)`. SIMD: one `vmax` / `vmaxq` instruction.
- **GELU** — `0.5 × x × (1 + erf(x / v2))`. SIMD: polynomial approximation of `erf` using Horner's method on NEON/vfmadd on AVX.
- **Sigmoid** — `1 / (1 + e^{-x})`. SIMD: `vexpq` or `vmla` based polynomial with 4-5 ULPs of error.

## Binary Save/Load

Models are serialized to `.kaz` files, a zero-deserialization binary format:

```
+-------------------------------+
¦ Magic: "KAZ0"                 ¦  4 bytes
¦ Layer Count (u32)             ¦  4 bytes
¦ +-------------------------+   ¦
¦ ¦ Layer 0:                ¦   ¦
¦ ¦   input_size (u64)      ¦  8 bytes
¦ ¦   output_size (u64)     ¦  8 bytes
¦ ¦   activation (u8)       ¦  1 byte
¦ ¦   weights (f32[])       ¦  input_size × output_size × 4
¦ ¦   biases (f32[])        ¦  output_size × 4
¦ +-------------------------¦   ¦
¦ ¦ Layer 1: ...            ¦   ¦
¦ +-------------------------+   ¦
+-------------------------------+
```

```rust
pub fn save_model(path: &Path, layers: &[Layer]) -> Result<()>;
pub fn load_model(path: &Path) -> Result<Vec<Layer>>;
```

Loading is a single `read` into a `Vec<u8>`, then `from_ne_bytes` casts — no parsing.

## Batch Inference

For batch inference, the engine processes multiple inputs in parallel, dispatching separate GEMM calls for each sample. The batch dimension is exposed via the CLI:

```sh
kazkade neural model.kaz data.acol -b 64
```

Internally, `forward_batch` calls `forward` in a parallel `rayon` iterator:

```rust
pub fn forward_batch(&self, inputs: &[Vec<f32>]) -> Vec<Vec<f32>> {
    inputs
        .par_iter()
        .map(|input| {
            let mut output = vec![0.0f32; self.output_size];
            self.forward(input, &mut output);
            output
        })
        .collect()
}
```

## Example

```rust
use kazcade::mlp::{Layer, Activation, load_model, forward_batch};

let layers = load_model("model.kaz").unwrap();
let input = vec![0.5f32; 128]; // 128-dimensional input
let mut output = vec![0.0f32; 10];

layers[0].forward(&input, &mut output);

// Batch
let batch = vec![input; 64];
let results = forward_batch(&layers, &batch);
```

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ