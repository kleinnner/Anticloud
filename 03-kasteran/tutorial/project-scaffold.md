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
