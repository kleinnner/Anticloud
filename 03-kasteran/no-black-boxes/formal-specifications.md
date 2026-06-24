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

# Kasteran* — Formal Specifications
© Lois-Kleinner & 0-1.gg 2026

## Overview

Formal specifications provide an unambiguous, mathematically precise definition of a programming language's syntax and semantics. Kasteran* has a complete formal specification covering its type system, operational semantics, and rune grammar. This enables verification of compiler correctness, program properties, and language safety.

## Language Semantics

### Operational Semantics
Kasteran* semantics are defined using a small-step operational semantics:

```
Expression → Value

e1 → e1'
----------
e1 op e2 → e1' op e2

e2 → e2'
----------
v1 op e2 → v1 op e2'

--------------
v1 op v2 → δ(op, v1, v2)
```

The semantics cover:
- Expression evaluation
- Statement execution
- Function calls and returns
- Rune creation and scheduling
- Type operations

### Type System
The Kasteran* type system is formally specified:

```
Types: τ ::= i32 | i64 | f32 | f64 | bool | String
           | [τ]            (array)
           | τ → τ          (function)
           | linear τ       (linear type)
           | PHI<τ>        (protected health information)
           | Encrypted<τ>  (encrypted data)

Typing Rules:
    Γ ⊢ e1 : τ      Γ ⊢ e2 : τ
    --------------------------- (addition)
    Γ ⊢ e1 + e2 : τ

    Γ ⊢ e : linear τ
    ------------------- (linear use)
    Γ ⊢ use(e) : τ     (e consumed exactly once)
```

### Subtyping
```
τ <: τ                       (reflexive)
τ1 <: τ2, τ2 <: τ3 ⇒ τ1 <: τ3  (transitive)
[τ] <: [Object]              (covariant arrays, where appropriate)
```

## Rune Grammar

Runes are Kasteran* lightweight concurrent units, specified as:

```
Rune ::= rune name(params) [state] { body }

State ::= var ident : type = initial_value
         | state ident = initial_value

Schedule ::= spawn rune_expr
           | yield
           | await rune_expr
           | select { cases }
```

### Rune Semantics
```
spawn e ⇒ create a new rune executing e
yield ⇒ suspend current rune, schedule another
await e ⇒ wait for rune e to complete
select ⇒ wait for any of multiple runes to complete
```

## Formal Properties

### Safety Properties
Kasteran* formal specification proves:

- **Progress**: Well-typed programs do not get stuck
- **Preservation**: Evaluation preserves types
- **Memory safety**: No use-after-free, buffer overflow, null dereference
- **Linear type safety**: Linear values are used exactly once
- **Data race freedom**: No concurrent data races

### Liveness Properties
- **Termination**: Programs eventually produce a result or diverge intentionally
- **Fairness**: Runes make progress if not blocked

### Security Properties
- **Information flow**: Data with confidentiality labels cannot flow to unauthorized outputs
- **Non-interference**: Public outputs do not depend on private inputs

## Denotational Semantics

For certain language features, denotational semantics are provided:

```
⟦τ⟧ : Type → Domain
⟦i32⟧ = Z_{32} (set of 32-bit integers)
⟦τ1 → τ2⟧ = ⟦τ1⟧ → ⟦τ2⟧
⟦linear τ⟧ = ⟦τ⟧ with linearity constraint

⟦e⟧ : Expr → Env → Domain
⟦n⟧(ρ) = n
⟦x⟧(ρ) = ρ(x)
⟧e1 + e2⟧(ρ) = ⟦e1⟧(ρ) + ⟦e2⟧(ρ)
```

## Proof Assistants

Kasteran* formal specification is mechanized in proof assistants:

### Coq
The core type system is defined in Coq:
```
Inductive type : Set :=
| TInt : type
| TBool : type
| TFun : type -> type -> type
| TLinear : type -> type.
```

### Agda
Properties are proved in Agda:
```
progress : ∀ {e τ} → ∅ ⊢ e ∶ τ → Value e ∨ ∃ e' → e ⟶ e'
preservation : ∀ {e e' τ} → ∅ ⊢ e ∶ τ → e ⟶ e' → ∅ ⊢ e' ∶ τ
```

## Specification Documents

The full formal specification is published:

- **Kasteran* Language Specification**: Complete language definition
- **Kasteran* Type System**: Formal type rules and proofs
- **Kasteran* Rune Specification**: Concurrency model formalization
- **Kasteran* Memory Model**: Memory ordering and consistency

## Conclusion

Kasteran* formal specifications provide an unambiguous, mathematically precise definition of the language. The type system, operational semantics, and rune grammar are fully specified and mechanized in proof assistants, enabling verification of correctness and safety properties.
