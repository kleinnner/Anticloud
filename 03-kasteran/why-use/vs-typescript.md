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

# Why Choose Kasteran* Over TypeScript
© Lois-Kleinner & 0-1.gg 2026

## The Case for Kasteran* Over TypeScript

TypeScript is the language of the web — it runs everywhere JavaScript runs, has the largest package ecosystem (npm), and provides excellent tooling. Kasteran* does not compete with TypeScript in the web UI domain. But for backend services, WASM modules, GPU compute, and systems-level code that currently uses TypeScript (via Node.js/Deno/Bun), Kasteran* offers significant advantages.

## Performance

TypeScript runs on JavaScript engines. Even with V8's excellent JIT, JS performance is limited: no true parallelism (workers help but are limited), garbage collection pauses, and no direct hardware access. TypeScript applications scale by adding more servers.

Kasteran* compiles to native code. A single Kasteran* binary can handle 10–100x the throughput of an equivalent TypeScript service. For compute-intensive workloads, the difference is even larger.

**Kasteran* Advantage:** Native performance without JavaScript engine overhead.

## Type System

TypeScript's type system is structurally typed and intentionally unsound. The `any` type bypasses checking entirely. Complex type definitions produce cryptic error messages. No memory safety guarantees.

Kasteran*'s type system is nominally typed and fully sound. If it compiles, it's correct. Linear types provide memory safety without GC. Pattern matching with exhaustiveness checking eliminates edge-case bugs.

**Kasteran* Advantage:** Stronger type guarantees. Sound type system that catches more errors at compile time.

## Native Code, No Runtime

TypeScript requires a JavaScript runtime (Node.js, Deno, Bun) to execute. Container images include the runtime plus node_modules (often 200MB+). Serverless cold starts are slow due to module loading.

Kasteran* compiles to a standalone binary. No runtime dependency means smaller containers (2MB vs 200MB), instant cold starts, and simpler deployment.

**Kasteran* Advantage:** Smaller, faster, simpler deployment. Single-binary distribution.

## WASM as a Compile Target

TypeScript does not compile to WASM. WASM modules can be used from TypeScript, but the business logic remains in JS/TS. For performance-critical WASM work, TypeScript adds an unnecessary layer.

Kasteran* compiles directly to WASM. WASM modules are pure Kasteran* output with no runtime overhead. Perfect for edge computing and in-browser compute.

**Kasteran* Advantage:** Direct WASM compilation without intermediate JavaScript.

## Kasteran* Is the Right Choice When:

- Backend performance matters (high-throughput APIs, compute services)
- You're building WASM modules for web or edge deployment
- GPU compute is part of your architecture
- Memory safety and a sound type system are requirements
- Deployment simplicity (single binary) is valuable

## TypeScript Is Still the Right Choice When:

- Web UI development (React, Vue, Angular, Svelte)
- Full-stack JavaScript/TypeScript teams
- npm ecosystem access is critical
- Rapid prototyping with dynamic typing flexibility
- DOM manipulation and browser API access

## The Verdict

TypeScript will remain dominant for web application development. Kasteran* is the right choice for the backend and infrastructure layers where TypeScript currently runs through Node.js. For teams building performance-critical services that currently use TypeScript, Kasteran* offers 10–100x performance improvements, stronger type safety, and simpler deployment — without the JavaScript runtime tax.
