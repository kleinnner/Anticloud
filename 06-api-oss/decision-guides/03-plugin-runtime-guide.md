---
title: "Decision Guide: Plugin Runtime"
sidebar_position: 3
description: "Which plugin runtime should I use?"
tags: [decision-guides]
---

# Decision Guide: Plugin Runtime

## Question

Which plugin runtime should I use?

## Decision Tree

```
Do you need maximum performance?
├── Yes → WASM (Rust, Go, C)
└── No → Do you have existing JS code?
    ├── Yes → JavaScript (legacy)
    └── No → Do you need rapid prototyping?
        ├── Yes → JavaScript
        └── No → WASM (for future-proofing)
```

## Comparison

| Factor | WASM | JavaScript | Lua |
|---|---|---|---|
| Performance | Excellent | Good | Good |
| Memory safety | Yes | No | No |
| Language choice | Rust, Go, C, Zig | JavaScript | Lua |
| Startup time | Fast | Fast | Fast |
| Ecosystem | Growing | Mature | Small |
| Sandboxing | Strong | Limited | Limited |
| Future support | Primary | Deprecated | Stable |

## Recommendation

```yaml
new_plugins:
  recommendation: WASM
  reason: "Future-proof, secure, performant"

existing_js:
  recommendation: JavaScript
  reason: "Quick migration, no rewrite needed"

rapid_prototyping:
  recommendation: JavaScript
  reason: "Fast iteration, then migrate to WASM"

performance_critical:
  recommendation: WASM (Rust)
  reason: "Best performance, zero-cost abstractions"
```

## Next

- [Federation Strategy Guide](04-federation-strategy-guide.md)

## See Also

Related decision guides, architecture, and deployment documentation.

- [Decision Guides Overview](../decision-guides/01-decision-guides-overview.md)
- [Architecture Overview](../architecture/01-system-architecture.md)
- [Deployment Guide](../deployment/01-overview.md)
- [Recipes](../recipes/01-recipes-overview.md)
