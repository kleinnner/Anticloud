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

# Kasteran* — General FAQ
© Lois-Kleinner & 0-1.gg 2026

## What is Kasteran*?

Kasteran* is a general-purpose systems programming language that combines compile-time memory safety with native performance. It features a linear type system, rune-based concurrency, and multiple compilation targets including native code and WebAssembly. Kasteran* is designed to be "The Last Programming Language" — a language that is efficient, safe, and sustainable enough to serve as a universal foundation for software development.

## Who is Kasteran* for?

Kasteran* is for developers who need:
- **Performance**: Near C-level performance with memory safety guarantees
- **Safety**: Compile-time elimination of entire classes of bugs
- **Sustainability**: Efficient code that extends hardware lifespan
- **Portability**: Code that runs anywhere from microcontrollers to cloud servers
- **Productivity**: Modern language features without sacrificing control

It is suitable for systems programming, web development, data processing, machine learning, embedded systems, and cloud-native applications.

## Why runes?

Runes are Kasteran* lightweight concurrent execution units. Unlike OS threads, runes are multiplexed onto a small number of kernel threads, allowing thousands or millions of concurrent tasks with minimal overhead. Runes enable:

- **Lightweight concurrency**: Start millions of runes without exhausting system resources
- **Structured concurrency**: Runes form a hierarchy, making cancellation and error handling natural
- **Safety**: The type system prevents data races at compile time
- **Efficiency**: Rune scheduling overhead is measured in nanoseconds

Runes are similar to goroutines in Go but with stronger type safety guarantees and lighter overhead.

## How does Kasteran* relate to Rust?

Kasteran* and Rust share some goals — both prioritize memory safety and performance. However, Kasteran* differs in several ways:

- **Simplicity**: Kasteran* has a simpler type system and learning curve
- **Linear types**: More explicit ownership model with linear types
- **Runes**: Built-in lightweight concurrency (Rust relies on async/await or libraries)
- **Targets**: Native, WASM, GPU, and FPGA compilation
- **Sustainability**: Designed with energy efficiency as a primary goal
- **No borrow checker complexity**: Linear types provide a simpler mental model

## Is Kasteran* production-ready?

Kasteran* is currently in development. The compiler is functional and can build real applications, but the ecosystem is still maturing. We recommend Kasteran* for:

- Greenfield projects where you can manage dependencies
- Performance-critical components that benefit from optimization
- WASM applications with zero-install deployment
- Educational and experimental projects

For production-critical systems, conduct thorough evaluation and testing.

## What platforms does Kasteran* support?

| Platform | Support | Status |
|---|---|---|
| Windows | x86-64 | Full |
| macOS | x86-64, ARM64 | Full |
| Linux | x86-64, ARM64, ARM32 | Full |
| Web | WASM | Full |
| Embedded | ARM, RISC-V | Beta |

## What license is Kasteran* under?

Kasteran* is released under the MIT License — one of the most permissive open source licenses. You can use it for any purpose, including commercial applications, without paying licensing fees.

## How can I learn Kasteran*?

- **Documentation**: Start with the Getting Started Guide
- **Playground**: Try Kasteran* in your browser
- **Tutorials**: Follow the guided learning paths
- **Community**: Join discussions on GitHub, Discord, and the forum
- **Examples**: Study the examples in the repository

## Conclusion

Kasteran* is a modern systems programming language that prioritizes safety, performance, and sustainability. Whether you are building system software, web applications, or embedded systems, Kasteran* provides the tools you need to write efficient, reliable code.
