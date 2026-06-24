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
