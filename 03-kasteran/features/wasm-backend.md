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

# Kasteran* — WebAssembly Backend

© Lois-Kleinner & 0-1.gg 2026

## Overview

Kasteran* compiles to WebAssembly (WASM) through a dedicated backend. The WASM backend produces valid `.wasm` modules that can run in any WASM runtime, including browsers, Node.js, and WASI-compliant runtimes.

## Compilation Target

```
kasteran build --target wasm program.kast
```

This produces `program.wasm` and optionally `program.wat` (WAT text format).

## WAT Output

The WASM backend can emit human-readable WAT (WebAssembly Text Format):

```
kasteran build --target wasm --emit-wat program.kast
```

Example generated WAT:

```wat
(module
  (import "wasi_snapshot_preview1" "fd_write" (func $fd_write ...))
  (memory (export "memory") 1)
  (export "main" (func $main))
  (func $main
    i32.const 0
    i32.const 4
    i32.const 1
    call $fd_write
    drop
  )
)
```

## WASI Integration

Kasteran* uses WASI (`wasi_snapshot_preview1`) for system calls:

- `fd_write` — stdout/stderr output
- `fd_read` — stdin input
- `args_sizes_get` / `args_get` — command-line arguments
- `environ_sizes_get` / `environ_get` — environment variables

```
|+ main() -> i32 {
    print("Hello from WASM!")
    => 0
}
```

The `print` function compiles to a WASI `fd_write` call.

## DOM Binding via `<>`

The `<>` anchor rune connects WASM memory with the browser DOM:

```
<> "#counter"    // binds to element with id="counter"
```

Under the hood, the compiler generates JavaScript glue code that:

1. Copies data from WASM linear memory to a JavaScript string
2. Sets `element.innerText` to the string value
3. Sets up bidirectional shared memory for event handling

## Memory Model

The WASM backend uses Kasteran*'s linear type system for memory:

```
|+ create_buffer(size: i64) -> %* [u8] {
    ptr := memory.grow(size)
    => %* ptr
}
```

WASM memory is managed entirely by the linear type checker, with no GC.

## Example: WASM + DOM

```
|+ main() -> i32 {
    count :~ 0
    loop {
        count = count + 1
        <> "#counter"
        <> count.to_string()
    }
    => 0
}
```

## Browser Integration

The compiler emits an HTML wrapper:

```html
<script>
  const go = new Go();
  WebAssembly.instantiateStreaming(
    fetch("program.wasm"), go.importObject
  ).then(mod => {
    go.run(mod.instance);
  });
</script>
```

## Graph

```
graphify {
    KasteranSource -> WASMBackend
    WASMBackend -> {WATGen, WASIBind, DOMBind}
    WATGen -> wasm_module
    WASIBind -> {fd_write, fd_read, args_get}
    DOMBind(<>) -> {JSGlue, SharedMemory, DOMEvents}
}
```

## Supported Features

| Feature | WASM Support |
|---------|-------------|
| Arithmetic | Full |
| Control Flow | Full |
| Pipes | Full |
| Linear Types | Full |
| Tensors | Partial (no SIMD yet) |
| ECS | Full |
| DOM `<>` | Browser only |
| `!@` unsafe | Full |
| Auto-diff | Compile-time only |

## Limitations

- No multithreading (WASM threads proposal not yet required)
- No direct filesystem access outside WASI
- No SIMD by default (enable with `--features simd`)
</```
