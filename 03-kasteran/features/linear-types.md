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

# Kasteran* — Memory Calculus: Linear Type System

© Lois-Kleinner & 0-1.gg 2026

## Overview

Kasteran* uses **linear types** to manage memory. Every value is tracked by the compiler and must be consumed exactly once. This eliminates garbage collection, use-after-free errors, and data races at compile time.

## Core Principle: Every Value Must Be Consumed

Unlike conventional languages where values can be ignored or duplicated arbitrarily, Kasteran* enforces:

- **Every value must be used exactly once**
- **No implicit copying**
- **No implicit dropping**

## Copy vs Move

Types fall into two categories:

### `Copy` Types

Primitive types implement `Copy`. They can be duplicated freely:

```
x := 42
y := x      // x is copied
z := x      // still valid: x is Copy
```

Copy types include: `i32`, `i64`, `f32`, `f64`, `bool`, `string` (immutable references).

### `Move` Types

Linear types must be moved. After a move, the source is consumed:

```
$$ Buffer = (data: [u8], size: i64)

|+ process(buf: Buffer) { ... }

buf := Buffer(data: ..., size: 1024)
process(%! buf)     // buf is moved into process
// buf is no longer valid here
```

The `%!` rune explicitly marks a move operation.

## The `%*` Pointer Rune

Linear pointers are created with `%*`:

```
ptr := %* value
// ptr has type &linear T
// Only one reference exists at any time
```

## Consumption Tracking

The compiler tracks consumption at the expression level:

```
x := allocate(size)
y := x          // ERROR: x used twice
```

The compiler reports the exact line where the double-use occurs.

## Graph

```
graphify {
    Value -> TypeChecker
    TypeChecker -> {IsCopy, IsLinear}
    IsCopy -> {CopyAllowed, DuplicationOK}
    IsLinear -> {TrackConsumption, OnceOnly}
    OnceOnly -> {Move(%!), Consumed, Invalidated}
}
```

## Practical Implications

### Resource Management

Linear types make resource management explicit:

```
|+ read_file(path: string) -> FileHandle {
    // returns a linear file handle
}

|+ close(%! file: FileHandle) {
    // consumes the handle
}

fh := read_file("data.txt")
process(fh)
close(%! fh)     // must consume fh exactly once
```

### No GC Overhead

Because every allocation is paired with exactly one consumption, the compiler can insert deterministic deallocation:

```
// The compiler inserts: free(buf.data) at consumption point
```

### Unsafe Escape Hatch

The `!@` rune bypasses linearity checks:

```
ptr := !@ raw_memory  // unsafe: no consumption tracking
```

Use `!@` only in FFI or performance-critical inner loops.

## Example: Linear Buffer

```
$$ Buffer = (
    data: %* [u8],
    len: i64,
    cap: i64
)

|+ new_buffer(cap: i64) -> Buffer {
    data := allocate(cap)
    => Buffer(data: %* data, len: 0, cap: cap)
}

|+ write_byte(buf: Buffer, byte: u8) -> Buffer {
    // Consumes old buf, returns new buf
    buf.data[buf.len] = byte
    => Buffer(data: buf.data, len: buf.len + 1, cap: buf.cap)
}

|+ free(%! buf: Buffer) {
    deallocate(buf.data)
}

|+ main() {
    buf := new_buffer(1024)
    buf = write_byte(buf, 65)
    buf = write_byte(buf, 66)
    free(%! buf)
    => 0
}
```
</```

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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20776182
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/03-kasteran
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
4. Lois-Kleinner Internet Arc: https://archive.org/details/kasteran
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