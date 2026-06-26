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

# Kasteran* — Module System

© Lois-Kleinner & 0-1.gg 2026

## Overview

Kasteran* has a module system based on explicit file paths, namespace isolation, and a standard library installed in `kasteran_modules/`. Modules are the unit of code organization, encapsulation, and reuse.

## Importing Modules

The `use` keyword loads a module from a file path:

```
use "std/io"
use "std/math"
use "./helpers/utils"
```

Paths are resolved relative to the `kasteran_modules/` directory first, then relative to the current file.

## Namespace Access

Exported symbols are accessed via the `::` (Access) rune:

```
use "std/math"

result := math::sin(3.14)
area   := math::pi * r * r
```

## Module Resolution Order

1. Check `kasteran_modules/` (standard library and installed packages)
2. Check relative to the importing file's directory
3. Check absolute paths

## Exporting Symbols

By default, everything is private. The `pub` keyword makes a symbol public:

```
// math/vector.kast
pub $$ Vec2 = (x: f32, y: f32)

pub |+ length(v: Vec2) -> f32 {
    => sqrt(v.x * v.x + v.y * v.y)
}

// Helper function — not exported
|+ square(x: f32) -> f32 {
    => x * x
}
```

## `kasteran_modules/` Directory

The standard library is installed in `kasteran_modules/`:

```
kasteran_modules/
  std/
    io.kast
    math.kast
    tensor.kast
    ecs.kast
  web/
    dom.kast
    wasm.kast
```

## Graph

```
graphify {
    use "path" -> ModuleResolver
    ModuleResolver -> {CheckKasteranModules, CheckRelative, CheckAbsolute}
    Resolved -> Parser -> TypeChecker
    TypeChecker -> {PubCheck, NamespaceValidation}
    NamespaceValidation -> {SymbolTable, ::Access}
}
```

## Example: Multi-File Project

```
// main.kast
use "std/io"
use "math/vector"
use "game/player"

|+ main() -> i32 {
    p := player::create("Alice")
    io::print(player::greet(p))
    => 0
}
```

```
// math/vector.kast
pub $$ Vec3 = (x: f32, y: f32, z: f32)

pub |+ add(a: Vec3, b: Vec3) -> Vec3 {
    => Vec3(x: a.x + b.x, y: a.y + b.y, z: a.z + b.z)
}
```

```
// game/player.kast
use "std/io"
use "math/vector"

pub $$ Player = (name: string, pos: vector::Vec3)

pub |+ create(name: string) -> Player {
    => Player(name: name, pos: vector::Vec3(x: 0.0, y: 0.0, z: 0.0))
}

pub |+ greet(p: Player) -> string {
    => "Hello, " + p.name
}
```

## Module Configuration

The `kasteran.toml` file specifies module metadata:

```toml
[project]
name = "my-game"
version = "0.1.0"

[dependencies]
"std/io" = "1.0"
"std/math" = "1.0"
```

## Cyclic Dependency Detection

The compiler detects and rejects cyclic dependencies:

```
Error: Cyclic module dependency detected
  a.kast -> b.kast -> c.kast -> a.kast
```

## Namespace Nesting

Namespaces can be nested arbitrarily:

```
use "org/company/project/utils"
result := utils::string::trim("  hello  ")
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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/SZJMZA
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