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

# Kasteran* — Standard Library

© Lois-Kleinner & 0-1.gg 2026

## Overview

The Kasteran* standard library is located in `kasteran_modules/std/`. It provides essential functions for I/O, mathematics, and tensor operations.

## `std/io` — Input/Output

```
use "std/io"
```

| Function | Description |
|----------|-------------|
| `print(s: string)` | Print to stdout |
| `println(s: string)` | Print with newline |
| `read_line() -> string` | Read a line from stdin |
| `read_file(path: string) -> string` | Read file contents |
| `write_file(path: string, data: string)` | Write to file |

## `std/math` — Mathematics

```
use "std/math"
```

| Function | Description |
|----------|-------------|
| `sin(x: f64) -> f64` | Sine |
| `cos(x: f64) -> f64` | Cosine |
| `sqrt(x: f64) -> f64` | Square root |
| `abs(x: f64) -> f64` | Absolute value |
| `pow(x: f64, n: f64) -> f64` | Power |
| `exp(x: f64) -> f64` | Exponential |
| `log(x: f64) -> f64` | Natural logarithm |

| Constant | Value |
|----------|-------|
| `math::pi` | 3.141592653589793 |
| `math::e` | 2.718281828459045 |

## `std/tensor` — Tensors

```
use "std/tensor"
```

| Function | Description |
|----------|-------------|
| `zeros(shape) -> Tensor` | Create zero-filled tensor |
| `ones(shape) -> Tensor` | Create one-filled tensor |
| `uniform(shape, low, high) -> Tensor` | Random uniform |
| `matmul(a, b) -> Tensor` | Matrix multiplication |

## `std/ecs` — ECS Utilities

```
use "std/ecs"
```

| Function | Description |
|----------|-------------|
| `entity_count() -> i64` | Number of entities |
| `has_component(entity, component) -> bool` | Check component |

## Example

```
use "std/io"
use "std/math"

|+ main() -> i32 {
    io::print("Enter a number: ")
    input := io::read_line()
    n := input.parse_f64()
    result := math::sqrt(n)
    io::print("Square root: " + result.to_string())
    => 0
}
```
</```

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com