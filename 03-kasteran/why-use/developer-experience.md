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

# Kasteran* — Developer Experience
© Lois-Kleinner & 0-1.gg 2026

## Developer Experience as a First-Class Concern

Developer experience (DX) is a critical factor in language adoption. A language can have superior technical characteristics but fail if the developer experience is poor (see: Haskell's limited adoption despite technical excellence). Kasteran* prioritizes DX across five dimensions: learnability, CLI, LSP, module system, and error messages.

## Rune Learnability

Kasteran*'s rune syntax is designed for rapid learning. Runes are intuitive visual symbols:

- `→` for function return types (read as "returns")
- `∀` for generic type parameters (read as "for all")
- `λ` for anonymous functions (read as "lambda")
- `∘` for function composition
- `≡` for type equality constraints

The syntax follows a principle of progressive disclosure: basic Kasteran* looks like a cleaned-up Python/C hybrid, while advanced features (linear types, compile-time execution) introduce specialized runes gradually.

**Learning path:**
- Hour 1: Variables, functions, control flow (familiar syntax)
- Day 1: Types, pattern matching, modules (familiar concepts)
- Week 1: Linear types, memory calculus, ECS (Kasteran*-specific)
- Month 1: Compile-time execution, GPU kernels, advanced type system

**Target:** A Python developer should write useful Kasteran* within a day. Full mastery of the linear type system takes 1–2 weeks — substantially faster than Rust's 3–6 month borrow checker learning curve.

## CLI (kpm)

The Kasteran* command-line tool, `kpm`, provides a unified interface for all development tasks:

| Command | Description |
|---------|-------------|
| `kpm init` | Initialize a new project |
| `kpm build` | Compile project (auto-detect backend) |
| `kpm run` | Build and run |
| `kpm test` | Run tests with coverage |
| `kpm fmt` | Format code |
| `kpm doc` | Generate documentation |
| `kpm publish` | Publish package to registry |
| `kpm add <pkg>` | Add dependency |
| `kpm update` | Update dependencies |
| `kpm bench` | Run benchmarks |

All commands support multiple backends: `kpm build --backend wasm`, `kpm build --backend gpu`.

**Design principles:**
- Zero configuration by default (sensible defaults)
- `kpm build` just works — detects project structure
- Fast feedback — sub-second command startup
- Consistent interface across all commands

## LSP (Language Server Protocol)

Kasteran*'s LSP provides type-aware IDE features:

- **Completions:** Context-aware suggestions including type-appropriate completions
- **Go to definition:** Navigate to any symbol definition
- **Find references:** All usages of a symbol
- **Hover:** Type information, documentation, and linear type status
- **Diagnostics:** Real-time errors and warnings as you type
- **Code actions:** Auto-fixes for common issues (missing pattern match arms, unused variables)
- **Rename:** Cross-file refactoring with type safety
- **Inlay hints:** Display inferred types, linearity requirements, and lifetime information inline
- **Semantic tokens:** Colorization based on type information

**Supported editors:** VS Code (primary), Vim/Neovim (via coc.nvim), Emacs (eglot), JetBrains (via LSP plugin), Helix (native LSP support).

## Module System

Kasteran*'s module system is designed for clarity and organization:

```
project/
├── src/
│   ├── main.ka          # Entry point
│   ├── physics/
│   │   ├── mod.ka        # Module declaration
│   │   ├── collision.ka  # Collision detection
│   │   └── dynamics.ka   # Physics simulation
│   └── ecs/
│       ├── mod.ka
│       ├── entity.ka
│       └── system.ka
└── kpm.toml              # Project manifest
```

**Module features:**
- Hierarchical namespace organization
- Explicit export lists (no accidental public API)
- Module-level visibility control
- Cyclic dependency detection at compile time
- Automatic module documentation generation

## Error Messages

Compiler error messages are designed to be actionable, not cryptic. Kasteran* follows Rust's lead in prioritizing excellent error messages.

**Example: Linear type error**
```
error[KA012]: value moved after use
  --> src/physics/collision.ka:15:12
   |
14 |     let body = PhysicsBody::new(mass, velocity)
   |         ---- value moved here
15 |     process(body)
   |             ^^^^ value used after move
16 |     process(body)  // ← Error: body already moved
   |             ^^^^ value used again
   |
   = note: linear value 'body' was moved in line 15
   = help: clone the value with body.clone() if shared access is intended
   = help: or restructure to use the value exactly once
```

**Error message design principles:**
- **Clearly formatted:** Consistent structure with error code, location, explanation
- **Actionable:** Every error message includes "help" suggestions
- **Educative:** Explains not just what, but why the error occurred
- **Visual:** Pointers and highlighting show exact problem locations
- **No jargon:** Avoids academic type theory terminology in favor of practical language

## Onboarding Experience

The first-time experience is carefully designed:

1. **`kpm init hello_world`** — Creates a working project in one command
2. **`kpm run`** — Compiles and runs with zero configuration
3. **Minimal example:** 5-line hello world in the generated project
4. **Interactive tutorial:** `kpm learn` launches an in-browser tutorial
5. **Recipe system:** Common patterns available via `kpm recipe <name>`

## Community & Support

- **Discord:** Real-time help from community and core team
- **GitHub Discussions:** Q&A, design proposals, show-and-tell
- **Official docs:** Tutorial, language reference, cookbook, migration guides
- **Video series:** "Zero to Kasteran" — 20-episode introduction
- **Office hours:** Weekly live streams with the core team

## DX Comparison

| Aspect | C | Rust | Python | Go | Kasteran* |
|--------|-----|------|--------|-----|-----------|
| First compile | Hours | Days | Minutes | Minutes | Minutes |
| LSP Experience | Basic | Excellent | Good | Good | Excellent |
| Error Messages | Cryptic | Excellent | Clear | Clear | Excellent |
| Package Manager | None | Cargo | pip | go mod | kpm |
| Build System | CMake/Make | Built-in | pip/poetry | Built-in | Built-in |
| Documentation | Doxygen | doc.rs | Sphinx | godoc | Built-in |
| Onboarding | Manual | Tutorial | Tutorial | Tutorial | Interactive |
| Hot Reload | No | No | No | No | Built-in |

Kasteran*'s developer experience is designed to match the best-in-class from each language: Rust's error messages, Go's simplicity, Python's approachability, and modern IDE integration — combined with unique features like hot-reload and the rune-based interactive tutorial.
