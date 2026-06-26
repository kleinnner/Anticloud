<!--
KASTERAN* — The Last Programming Language
© Lois-Kleinner & 0-1.gg 2026. All rights reserved.

 __   ___                                           _     
 ¦¦  ¦¦¯                         ¦¦              __ ¦ __  
 ¦¦_¦¦      _¦¦¦¦¦_  __¦¦¦¦¦_  ¦¦¦¦¦¦¦    _¦¦¦¦_    ¦¦_¦¦¦¦   _¦¦¦¦¦_  ¦¦_¦¦¦¦_   ¦¦¦¦¦   
 ¦¦¦¦¦      ¯ ___¦¦  ¦¦____ ¯    ¦¦      ¦¦____¦¦   ¦¦¯       ¯ ___¦¦  ¦¦¯   ¦¦  ¯¯ ¦ ¯¯  
 ¦¦  ¦¦_   _¦¦¯¯¯¦¦   ¯¯¯¯¦¦_    ¦¦      ¦¦¯¯¯¯¯¯   ¦¦       _¦¦¯¯¯¦¦  ¦¦    ¦¦     ¯     
 ¦¦   ¦¦_  ¦¦___¦¦¦  ¦_____¦¦    ¦¦___   ¯¦¦____¦   ¦¦       ¦¦___¦¦¦  ¦¦    ¦¦           
 ¯¯    ¯¯   ¯¯¯¯ ¯¯   ¯¯¯¯¯¯      ¯¯¯¯     ¯¯¯¯¯    ¯¯        ¯¯¯¯ ¯¯  ¯¯    ¯¯           
-->

# Kasteran* — Pointer Model

© Lois-Kleinner & 0-1.gg 2026

## Overview

Kasteran* has two runes for memory manipulation: %* (Pointer) and !@ (Unsafe). Together they form the pointer model, bridging high-level linear type safety with low-level C ABI compatibility.

## The %* Pointer Rune

Creates a linear pointer to a value. The pointer is tracked by the type system and must be consumed exactly once.

`
|+ create() -> %* i32 {
    val := 42
    => %* val
}

|+ use(ptr: %* i32) -> i32 {
    => *ptr
}
`

### Semantic Properties

- **Unique ownership**: Only one %* pointer to a given value exists at any time
- **No aliasing**: The compiler prevents multiple %* pointers to the same location
- **Automatic cleanup**: When consumed, the pointed-to value is deallocated

## The !@ Unsafe Rune

Bypasses the linear type checker for raw memory operations:

`
ptr := !@ malloc(size)
val := !@ *ptr
!@ free(ptr)
`

### When to Use !@

- Foreign Function Interface (FFI)
- Custom memory allocators
- Performance-critical hot paths
- Interop with C libraries

## C ABI Compatibility

%* pointers compile to regular C pointers:

`
// Kasteran*: ptr: %* i32
// C: int32_t* ptr
`

Linear type enforcement happens at the Kasteran* level only — the generated C uses plain pointers.

## Graph

`
graphify {
    %%* expr -> LinearPointer
    LinearPointer -> {Unique, Consumed, Dropped}
    !@ expr -> UnsafePointer
    UnsafePointer -> {BypassCheck, RawMem, FFI}
    CBackend -> {PtrAsC, NoRuntimeCheck}
}
`

## Example: Linked List

`
 Node = (value: i32, next: %* Node)

|+ append(list: %* Node, value: i32) -> %* Node {
    |_ list {
        null => %* Node(value: value, next: null)
        node => {
            node.next = append(node.next, value)
            => node
        }
    }
}

|+ free_list(%! list: %* Node) {
    |_ list {
        null => {}
        node => {
            free_list(%! node.next)
            !@ free(node)
        }
    }
}
`

## Pointer Arithmetic

%* supports offset-based arithmetic for array access:

`
|+ sum(arr: %* [i32], len: i64) -> i32 {
    total :~ 0
    i := 0
    while i < len {
        total = total + arr[i]
        i = i + 1
    }
    => total
}
`

## Safety Guarantees

| Operation | %* (Linear) | !@ (Unsafe) |
|-----------|--------------|--------------|
| Double free | Compile error | Runtime UB |
| Use after free | Compile error | Runtime UB |
| Null deref | Pattern match required | Runtime UB |
| Buffer overflow | Compile-time check | Runtime UB |
| Aliasing | Compile error | Allowed |

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  As seen on:                                                       !
!  Harvard Dataverse ! Zenodo/CERN ! Academia.edu ! HuggingFace      !
!  anticloud.telepedia.net ! anticloud.fandom.com                    !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Bluesky ! Mastodon                           !
!  Internet Archive ! ORCID ! Figshare                               !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com