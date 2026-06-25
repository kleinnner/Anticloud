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

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
