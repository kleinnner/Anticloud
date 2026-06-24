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

# Kasteran* — Tauri Desktop App

© Lois-Kleinner & 0-1.gg 2026

## Overview

Kasteran* includes a desktop application built with Tauri. This app provides a graphical interface for editing, running, and debugging Kasteran* programs.

## Launching the App

```
kasteran app
```

This launches the Tauri-compiled desktop application.

## Features

### Editor

- Syntax highlighting for all 16 runes
- Code completion
- Live error highlighting
- Multi-tab editing

### Run Panel

- Run programs with F5
- View stdout/stderr output
- Set breakpoints
- Step through execution

### ECS Inspector

- View all entities and components
- Inspect component values in real-time
- Pause/resume game loop

### Tensor Viewer

- Visualize tensor data
- View tensor shape and values
- Export tensors to CSV

## System Requirements

- Windows 10+, macOS 11+, or Linux (GLIBC 2.28+)
- 500MB RAM minimum
- 200MB disk space

## Command Line vs GUI

```
# CLI mode
kasteran run program.kast

# GUI mode
kasteran app program.kast
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `F5` | Run program |
| `Ctrl+S` | Save file |
| `Ctrl+O` | Open file |
| `Ctrl+Shift+P` | Open project |

## Example

Open the app, create a new file, type your program, and press F5 to run:

```
|+ main() -> i32 {
    print("Hello from Kasteran* desktop!")
    => 0
}
```
</```
