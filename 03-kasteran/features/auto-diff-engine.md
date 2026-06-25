<!--
KASTERAN* — The Last Programming Language
© Lois-Kleinner & 0-1.gg 2026. All rights reserved.

 ▄▄   ▄▄▄                                           ▄     
 ██  ██▀                         ██              ▄▄ █ ▄▄  
 ██▄██      ▄█████▄  ▄▄█████▄  ███████    ▄████▄    ██▄████   ▄█████▄  ██▄████▄   █████   
 █████      ▀ ▄▄▄██  ██▄▄▄▄ ▀    ██      ██▄▄▄▄██   ██▀       ▀ ▄▄▄██  ██▀   ██  ▀▀ █ ▀▀  
 ██  ██▄   ▄██▀▀▀██   ▀▀▀▀██▄    ██      ██▀▀▀▀▀▀   ██       ▄██▀▀▀██  ██    ██     ▀     
 ██   ██▄  ██▄▄▄███  █▄▄▄▄▄██    ██▄▄▄   ▀██▄▄▄▄█   ██       ██▄▄▄███  ██    ██           
 ▀▀    ▀▀   ▀▀▀▀ ▀▀   ▀▀▀▀▀▀      ▀▀▀▀     ▀▀▀▀▀    ▀▀        ▀▀▀▀ ▀▀  ▀▀    ▀▀           
-->

# Kasteran* — Auto-Differentiation Engine

© Lois-Kleinner & 0-1.gg 2026

## Overview

Kasteran* includes a built-in automatic differentiation engine based on the **Wengert tape** (also known as a trace-based or "forward mode" accumulation). The `grad()` function computes exact derivatives of any scalar expression without symbolic manipulation or finite differences.

## The Wengert Tape

When `grad()` is called on an expression, the compiler records every elementary operation onto a **tape** data structure. Each tape entry stores:

- The operation type (add, mul, sin, etc.)
- The operands (as indices into the tape)
- The partial derivative contribution

```
graphify {
    Input(x) -> TapeEntry[0]
    Input(y) -> TapeEntry[1]
    TapeEntry[0] + TapeEntry[1] -> TapeEntry[2]  // temp = x + y
    TapeEntry[2] * TapeEntry[0] -> TapeEntry[3]  // result = temp * x
    TapeEntry[3] -> grad_output
}
```

## Using `grad()`

The `grad()` function takes a function and returns its derivative function:

```
|+ f(x: f32) -> f32 {
    => x * x + 3.0 * x + 2.0
}

df := grad(f)
// df(2.0) == 2*2 + 3 == 7.0
```

## Higher-Order Derivatives

`grad()` composes naturally:

```
d2f := grad(grad(f))
// d2f(2.0) == 2.0
```

## Partial Derivatives

For multi-variable functions, `grad()` returns partial derivatives:

```
|+ g(x: f32, y: f32) -> f32 {
    => x * y + sin(x)
}

dg := grad(g)
// dg(1.0, 2.0) == (y + cos(x), x) == (2.0 + 0.54, 1.0)
```

## Tape Operations

The following elementary operations are recorded on the tape:

| Operation | Derivative Contribution |
|-----------|------------------------|
| `c + d` | `d(c+d)/dc = 1, d(c+d)/dd = 1` |
| `c * d` | `d(c*d)/dc = d, d(c*d)/dd = c` |
| `c - d` | `d(c-d)/dc = 1, d(c-d)/dd = -1` |
| `c / d` | `d(c/d)/dc = 1/d, d(c/d)/dd = -c/d²` |
| `sin(c)` | `d(sin(c))/dc = cos(c)` |
| `cos(c)` | `d(cos(c))/dc = -sin(c)` |
| `exp(c)` | `d(exp(c))/dc = exp(c)` |
| `log(c)` | `d(log(c))/dc = 1/c` |
| `pow(c, n)` | `d(pow(c,n))/dc = n * pow(c, n-1)` |

## Example: Neural Network Training

```
|+ linear(x: f32, w: f32, b: f32) -> f32 {
    => w * x + b
}

|+ loss(x: f32, y: f32, w: f32, b: f32) -> f32 {
    pred := linear(x, w, b)
    diff := pred - y
    => diff * diff
}

|+ train_step(x: f32, y: f32, w: f32, b: f32, lr: f32) {
    dloss := grad(loss)
    dw := dloss(x, y, w, b).w
    db := dloss(x, y, w, b).b
    w = w - lr * dw
    b = b - lr * db
}
```

## Performance Characteristics

The Wengert tape approach has well-defined complexity:

- **Memory**: O(n) where n is the number of elementary operations
- **Time**: O(n) for forward pass, O(n) for derivative accumulation
- **Space**: Each tape entry is 32 bytes (op code + two operand indices + partial)

## Compile-Time Differentiation

When `grad()` is applied to pure functions, the differentiation is performed at compile time:

```
df_compiled := |! { grad(f) }
// The derivative is computed during compilation
```
</```

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
