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

# Kasteran* — Getting Started

© Lois-Kleinner & 0-1.gg 2026

## Installation

Download the latest Kasteran* binary from the official repository:

```
# Windows (PowerShell)
iwr -Uri https://kasteran.dev/dl/kasteran-x64.msi -OutFile kasteran.msi
.\kasteran.msi

# Linux
curl -fsSL https://kasteran.dev/dl/install.sh | sh

# macOS
brew install kasteran/tap/kasteran
```

## Verify Installation

```
kasteran version
```

You should see output similar to:

```
Kasteran* v1.0.0 — The Last Programming Language
```

## Creating a New Project

Use `kasteran new` to scaffold a new project:

```
kasteran new my-first-project
cd my-first-project
```

## Project Structure

```
my-first-project/
  src/
    main.kast
  kasteran.toml
  kasteran_modules/
```

## Running Hello World

Create `src/main.kast`:

```
|+ main() -> i32 {
    print("Hi!")
    => 0
}
```

Run it:

```
kasteran run src/main.kast
```

## `kasteran init`

Initialize an existing directory as a Kasteran* project:

```
mkdir my-project
cd my-project
kasteran init
```

## `kasteran new`

Create a new project with a template:

```
kasteran new --template ecs-game my-game
kasteran new --template library my-lib
kasteran new --template wasm-app my-web-app
```

## Available Templates

| Template | Description |
|----------|-------------|
| `default` | Basic CLI application |
| `ecs-game` | Game with ECS setup |
| `library` | Library project |
| `wasm-app` | WebAssembly browser app |

## Next Steps

- Read `hello-world.md` for your first program
- Read `variables-and-types.md` to learn about bindings
- Read `functions.md` to learn about functions
</```
