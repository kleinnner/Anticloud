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

# Kasteran* — CLI Reference

© Lois-Kleinner & 0-1.gg 2026

## Overview

The `kasteran` CLI provides commands for building, running, and managing Kasteran* projects.

## `kasteran run`

Run a Kasteran* program:

```
kasteran run <file>
kasteran run src/main.kast
```

## `kasteran build`

Compile a program to a target:

```
kasteran build <file>
kasteran build --target c src/main.kast -o output
kasteran build --target wasm src/main.kast
```

## `kasteran check`

Check a program for errors without running:

```
kasteran check <file>
kasteran check src/main.kast
```

## `kasteran new`

Create a new project:

```
kasteran new <name>
kasteran new --template ecs-game my-game
```

## `kasteran init`

Initialize the current directory as a project:

```
kasteran init
```

## `kasteran completions`

Generate shell completions:

```
kasteran completions bash > /etc/bash_completion.d/kasteran
kasteran completions zsh > /usr/local/share/zsh/site-functions/_kasteran
kasteran completions powershell > kasteran.ps1
```

## `kasteran version`

Print version information:

```
kasteran version
```

## `kasteran install`

Install the standard library:

```
kasteran install
kasteran install std
```

## `kasteran algebra`

Run the algebraic theorem prover:

```
kasteran algebra --prove "forall x: i32 { x * 0 == 0 }"
```

## `kasteran app`

Launch the Tauri desktop app:

```
kasteran app
kasteran app program.kast
```

## Summary

| Command | Description |
|---------|-------------|
| `run` | Run a program |
| `build` | Compile to target |
| `check` | Type-check only |
| `new` | Create new project |
| `init` | Init current dir |
| `completions` | Shell completions |
| `version` | Print version |
| `install` | Install std library |
| `algebra` | Theorem prover |
| `app` | Launch desktop GUI |
</```
