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

# Kasteran* — Project Scaffold

© Lois-Kleinner & 0-1.gg 2026

## `kasteran new`

Create a new Kasteran* project:

```
kasteran new my-project
cd my-project
```

This creates:

```
my-project/
  src/
    main.kast       # Entry point
  kasteran.toml     # Project configuration
  kasteran_modules/ # Standard library (installed)
```

## `kasteran init`

Initialize an existing directory:

```
mkdir my-project
cd my-project
kasteran init
```

This creates `kasteran.toml` and `src/main.kast`.

## Project Structure

```
my-game/
  src/
    main.kast          # Entry point
    player.kast        # Player module
    enemies.kast       # Enemy module
    systems/
      physics.kast     # Physics system
      render.kast      # Render system
  assets/
    textures/
    audio/
  kasteran.toml
  kasteran_modules/
    std/
      io.kast
      math.kast
```

## `kasteran.toml`

```toml
[project]
name = "my-project"
version = "0.1.0"
authors = ["Your Name"]

[build]
target = "native"       # native, wasm, c
optimization = "O3"     # O0, O1, O2, O3, Os

[dependencies]
"std/io" = "1.0"
"std/math" = "1.0"

[ecs]
archetype_chunk_size = 64

[tensor]
layout = "row-major"   # row-major, column-major
```

## Templates

```
kasteran new --template default my-app     # CLI app
kasteran new --template ecs-game my-game   # ECS game
kasteran new --template library my-lib     # Library
kasteran new --template wasm-app my-web    # WASM app
```

## `kasteran_modules/`

Contains the standard library and installed dependencies:

```
kasteran_modules/
  std/
    io.kast
    math.kast
    tensor.kast
    ecs.kast
```

## Example

```
kasteran new --template ecs-game my-rpg
cd my-rpg
kasteran run src/main.kast
```

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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
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