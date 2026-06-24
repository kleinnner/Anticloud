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

# Kasteran* — Browser-Based Execution
© Lois-Kleinner & 0-1.gg 2026

## Overview

Kasteran* WebAssembly (WASM) backend enables applications to run in any modern web browser with zero installation. This makes Kasteran* applications accessible to anyone with a browser, on any device, without requiring native software installation or new hardware.

## WASM Backend

Kasteran* compiles to WASM as a first-class target:

```
kasteran build --target wasm my_app.krn
```

The output is a `.wasm` file that runs in any WASM-compatible environment.

### WASM Features Used
Kasteran* leverages WASM features:
- **WASI**: System interface for file and network access
- **SIMD**: Vector operations for performance
- **Reference types**: Efficient reference handling
- **Bulk memory**: Fast memory operations
- **Tail calls**: Efficient recursive patterns
- **Multi-value**: Multiple return values

### Binary Size
Kasteran* WASM binaries are compact:
- Hello world: ~5 KB
- HTTP client: ~30 KB
- Data processing: ~40 KB
- Game engine: ~150 KB
- ML inference: ~300 KB (with model)

## Zero Installation

Users can run Kasteran* applications without installing anything:

### Web Deployment
```
<script src="my_app.wasm"></script>
```

Applications are served as static files:
- No server-side processing required
- No native dependencies
- No platform-specific builds
- Instant loading and execution

### Progressive Web Apps
Kasteran* supports PWA features:
- Offline execution via service workers
- Installable on home screen
- Background synchronization
- Push notifications

## Browser APIs

Kasteran* provides access to browser APIs:

### DOM Manipulation
```
let element = document.query_selector("#app")
element.inner_text = "Hello from Kasteran*!"
```

### Canvas and WebGL
```
let canvas = document.query_selector("#canvas")
let context = canvas.get_context_2d()
context.fill_rect(10, 10, 100, 100)
```

### Web APIs
- **WebSockets**: Real-time communication
- **Web Workers**: Background computation
- **WebRTC**: Peer-to-peer connections
- **File API**: Local file access
- **IndexedDB**: Client-side storage
- **Service Workers**: Offline capabilities

## Performance

Kasteran* WASM performance approaches native:

| Operation | Native | WASM | Ratio |
|---|---|---|---|
| CPU-bound | 1x | 0.9-1.1x | ~95% |
| Memory-bound | 1x | 0.8-1.0x | ~90% |
| DOM manipulation | 1x | 0.3-0.5x | ~40% |
| Canvas rendering | 1x | 0.8-1.0x | ~90% |

CPU-bound computations achieve near-native performance. DOM access is slower due to the bridge overhead, but optimized bindings minimize this.

## Capabilities

Browser-based Kasteran* can:

### Compute
- Scientific computing and simulation
- Data processing and analysis
- Machine learning inference
- Cryptography and security
- Game physics and rendering

### Applications
- Interactive data visualization
- Code editors and IDEs
- Image and audio processing
- Document editing and conversion
- Communication tools

### Limitations
- No direct hardware access (GPU compute via WebGL)
- Limited file system access (sandboxed)
- No arbitrary network access (CORS)
- Single-threaded main thread

## Development Workflow

```
# Development
kasteran watch --target wasm src/ --serve

# Production build
kasteran build --target wasm --release src/
# Output: dist/my_app.wasm, dist/index.html
```

## Security

WASM execution in browsers is secure:
- Memory isolation from other tabs
- No access to host system
- Same-origin policy enforced
- Content Security Policy compatible
- No unsafe eval or inline code

## Conclusion

Kasteran* WASM backend enables browser-based execution of applications with zero installation, making the language accessible on any device with a modern web browser. Performance approaches native for compute-intensive workloads while maintaining the security and portability of the web platform.
