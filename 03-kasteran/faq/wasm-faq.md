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

# Kasteran* — WASM FAQ
© Lois-Kleinner & 0-1.gg 2026

## Does Kasteran* support WebAssembly?

Yes, WASM is a first-class compilation target for Kasteran*. You can compile any Kasteran* program to WebAssembly with `kasteran build --target wasm`.

## What browser support exists?

Kasteran* WASM works in any browser that supports WebAssembly:
- Chrome 57+ (2017)
- Firefox 52+ (2017)
- Safari 11+ (2017)
- Edge 16+ (2017)
- Node.js 8+ (2017)

## Can I access the DOM?

Yes, Kasteran* provides DOM bindings for WebAssembly:
```
let element = document.query_selector("#app")
element.inner_text = "Hello from Kasteran*!"
```

## How large are WASM binaries?

Kasteran* produces small WASM binaries:
- Hello world: ~5 KB
- HTTP client: ~30 KB
- Game engine: ~150 KB
- ML inference: ~300 KB (with model)

## What are the performance characteristics?

WASM performance is close to native:
- CPU-bound: 90-100% of native performance
- DOM access: 30-50% of native (bridge overhead)
- Canvas/WebGL: 80-90% of native
- Startup: Microseconds (no JIT warmup)

## Can I use threads?

WASM threads (Web Workers) are supported:
- Thread creation via runes
- Shared memory via `SharedArrayBuffer`
- Atomic operations for synchronization

## What are the limitations?

- No direct system access (file system, network)
- Limited to browser APIs
- Single-threaded main thread
- DOM access has overhead
- Debugging is less mature

## Conclusion

Kasteran* WASM support enables running high-performance applications in any modern browser with zero installation and near-native performance.
