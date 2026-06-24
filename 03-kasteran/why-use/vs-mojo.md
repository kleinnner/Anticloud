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

# Why Choose Kasteran* Over Mojo
© Lois-Kleinner & 0-1.gg 2026

## The Case for Kasteran* Over Mojo

Mojo (Modular) is Kasteran*'s closest competitor in the "fast Python" space. Both languages target AI/ML performance with native compilation and GPU support. But they diverge fundamentally on openness, syntax design, and domain scope.

## Open Source vs Proprietary

Mojo's compiler is proprietary. Modular controls the language direction behind closed doors. The community cannot audit, modify, or contribute to the compiler. This creates risk: if Modular pivots or fails, Mojo's future is uncertain.

Kasteran* is fully open source (MIT/Apache 2.0). The compiler is available for anyone to inspect, modify, and contribute to. The Kasteran* Foundation ensures governance independence. The language belongs to its community, not a single company.

**Kasteran* Advantage:** Trust, transparency, and community ownership. No vendor lock-in.

## Rune Syntax vs Python Compatibility

Mojo's Python compatibility is its defining feature — and its biggest constraint. Mojo must remain syntactically compatible with Python, limiting the language's design freedom. Innovations that conflict with Python syntax (pattern matching, algebraic types, linear types syntax) are harder to integrate.

Kasteran*'s rune syntax is designed from scratch for the language's feature set. No backward compatibility constraints. The syntax can evolve freely to support new features. Runes are designed for readability and expressiveness.

**Kasteran* Advantage:** Design freedom. Kasteran* can innovate in syntax without Python compatibility constraints.

## Broader Backend Support

Mojo targets MLIR and GPU (CUDA). Kasteran* targets C, WASM, and GPU (CUDA, ROCm, Metal). The C backend provides the widest platform reach of any compilation target. WASM backend enables browser and edge deployment.

**Kasteran* Advantage:** More deployment targets. C backend means Kasteran* runs on every platform with a C compiler — which is every platform.

## Broader Domain Scope

Mojo is focused on AI/ML. It excels at MLIR-level optimization for AI workloads. But it doesn't address game development, systems programming, or ECS architectures.

Kasteran* targets AI/ML plus game development plus systems programming. Built-in ECS, hot-reload, and SOA layout make it a contender in game engine development — a domain Mojo doesn't address.

**Kasteran* Advantage:** Single language for multiple domains. Learn once, use everywhere.

## Kasteran* Is the Right Choice When:

- Open source is a requirement (auditability, community, no vendor lock-in)
- You need WASM deployment alongside GPU compute
- Your use case spans AI/ML plus game development or systems programming
- You want a language designed from scratch (not constrained by Python compatibility)
- Community governance matters for long-term project health

## Mojo Is the Right Choice When:

- Python compatibility is critical (existing codebase, team expertise)
- MLIR optimization is a key requirement
- You're building exclusively for the AI/ML domain
- Modular's enterprise support is valuable to your organization

## The Verdict

Mojo wins for teams that need Python compatibility and deep MLIR optimization for AI/ML workloads. Kasteran* wins for teams that value open source, broader deployment targets, multi-domain capability, and syntactic freedom. The languages are competitive in the AI/ML space but diverge significantly in philosophy and scope.
