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

# Kasteran* — Runtime Errors
© Lois-Kleinner & 0-1.gg 2026

## Overview

Runtime errors occur during bytecode VM execution. They indicate problems that could not be detected at compile time, such as division by zero, out-of-bounds access, or stack underflow.

## Runtime Error Format

```
runtime error[E0XX]: <message>
  ├ IP: <instruction_pointer>
  ├ Function: <function_name>
  └ Source: <file>:<line>:<column>
```

## Error Types

### E060: Stack Underflow

```
runtime error[E060]: Stack underflow
  ├ IP: 42
  ├ Function: main
  └ Source: src/main.ka:10:5
```

**Cause:** The VM attempted to pop a value from an empty stack. This typically indicates a compiler bug in bytecode generation.

**Fix:** Report the issue with the source code that triggered it.

### E061: Division by Zero

```
runtime error[E061]: Division by zero
  ├ IP: 18
  ├ Function: divide
  └ Source: src/main.ka:5:10
```

**Cause:** The right operand of a division (`/`) or modulo (`%`) operation was zero.

**Fix:** Add a guard check before division:

```ka
fn safe_divide(a: F32, b: F32) -> F32 {
    if b == 0.0 {
        print("Warning: division by zero, returning 0");
        0.0
    } else {
        a / b
    }
}
```

### E062: Out of Bounds Access

```
runtime error[E062]: Out of bounds access
  ├ IP: 35
  ├ Function: get_element
  ├ Index: 5, Length: 3
  └ Source: src/main.ka:12:15
```

**Cause:** Attempted to access an array or tensor element at an index greater than or equal to the length.

**Fix:** Check bounds before access:

```ka
fn safe_get(arr: [F32; 3], i: I32) -> F32 {
    if i >= 0 && i < 3 { arr[i] } else { 0.0 }
}
```

### E063: Null Pointer Dereference

```
runtime error[E063]: Null pointer dereference
  ├ IP: 52
  ├ Function: process
  └ Source: src/main.ka:20:5
```

**Cause:** Attempted to read from or write to a null `Pointer`.

**Fix:** Always check for null before dereferencing:

```ka
fn process(ptr: *F32) -> F32 {
    if ptr != null { *ptr } else { 0.0 }
}
```

### E064: Type Mismatch at Runtime

```
runtime error[E064]: Type mismatch
  ├ IP: 28
  ├ Function: main
  ├ Expected: F32
  ├ Found: String
  └ Source: src/main.ka:8:13
```

**Cause:** A value on the stack has a different type than expected by the current operation. This usually indicates a bug in the compiler's type checker or bytecode generator.

**Fix:** Report the issue. In the meantime, verify your code compiles with `kasteran check` before running.

### E065: Undefined Function Call

```
runtime error[E065]: Undefined function call
  ├ IP: 15
  ├ Function: main
  └ Function index: 99
  └ Source: src/main.ka:3:5
```

**Cause:** The VM tried to call a function that was not defined in the bytecode module.

**Fix:** Ensure the function definition is present and has the correct name.

## Debugging Runtime Errors

### Enabling Debug Output

```
kasteran run --debug myfile.ka
```

This prints the instruction-by-instruction state of the VM:

```
[DEBUG] IP=0  PushF32(2.0)          Stack: []
[DEBUG] IP=2  PushF32(3.0)          Stack: [F32(2.0)]
[DEBUG] IP=4  Add                   Stack: [F32(2.0), F32(3.0)]
[DEBUG] IP=5  Ret                   Stack: [F32(5.0)]
```

### Using the VM Inspector

```rust
pub fn inspect_vm(vm: &VM) {
    println!("=== VM State ===");
    println!("IP: {}", vm.ip);
    println!("Stack: {:?}", vm.stack);
    println!("Call stack depth: {}", vm.call_stack.len());
    for (i, frame) in vm.call_stack.iter().enumerate() {
        println!("  Frame {}: ret={}, locals={:?}", i, frame.return_address, frame.locals);
    }
}
```

### Source Mapping

Errors include source location information via debug metadata embedded in the bytecode:

```rust
pub struct DebugInfo {
    pub source_map: Vec<SourceMapping>,
}

pub struct SourceMapping {
    pub ip: usize,
    pub file: String,
    pub line: u32,
    pub col: u32,
}
```

## Preventing Runtime Errors

1. **Always type-check first**: `kasteran check` catches most issues before runtime
2. **Use defensive programming**: Guard against division by zero and out-of-bounds access
3. **Test with `kasteran test`**: Write tests for edge cases
4. **Use the C backend for production**: `kasteran build` generates native code with proper runtime safety

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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ