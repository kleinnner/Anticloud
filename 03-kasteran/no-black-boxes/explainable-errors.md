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

# Kasteran* — Explainable Errors
© Lois-Kleinner & 0-1.gg 2026

## Overview

Explainable errors provide developers with clear, actionable information when something goes wrong. Kasteran* error system is designed to eliminate cryptic error messages, providing source snippets, error codes, suggestions, and contextual information for every error.

## Error Message Structure

Every Kasteran* error message follows a structured format:

```
error[KRN-E0001]: Type mismatch
  ┌─ src/main.krn:10:5
  │
9 │   let x: i32 = "hello"
  │       -      expected type `i32`
10│   let y = x + 1
  │           ^ type mismatch
  │           │
  │           `x` is `String`, not `i32`
  │
  = hint: Change the type annotation to `String` or change the value to a number
  = see: https://docs.kasteran.dev/errors/KRN-E0001
```

## Error Components

### Error Code
Every error has a unique code:
- **KRN-E0001**: Type mismatch
- **KRN-E0002**: Undefined variable
- **KRN-E0003**: Linear type violation
- **KRN-E0004**: Borrow checker error
- **KRN-E0005**: Lifetime error

### Source Snippet
The error shows the relevant source code:
```
  ┌─ src/main.krn:10:5
  │
9 │   let x: i32 = "hello"
10│   let y = x + 1
  │           ^
```

### Error Description
A clear explanation of what went wrong:
```
Type mismatch: expected `i32`, found `String`
```

### Context
Additional context about the error:
```
`x` is `String` because it was assigned the value `"hello"`
Only `i32` values can be used with the `+` operator
```

### Hints and Suggestions
Actionable suggestions:
```
hint: Change the type annotation to `String` or change the value to a number
hint: Consider using string concatenation instead: `x + "1"`
```

## Error Categories

### Compile-Time Errors
Errors detected during compilation:
```
- KRN-E0001: Type mismatch
- KRN-E0002: Undefined variable
- KRN-E0003: Linear type violation
- KRN-E0004: Borrow checker error
- KRN-E0005: Lifetime error
- KRN-E0006: Missing semicolon
- KRN-E0007: Unreachable code
- KRN-E0008: Unused variable
- KRN-E0009: Uninitialized variable
- KRN-E0010: Division by zero (constant)
```

### Runtime Errors
Errors detected during execution:
```
- KRN-R0001: Index out of bounds
- KRN-R0002: Division by zero
- KRN-R0003: Null reference
- KRN-R0004: Stack overflow
- KRN-R0005: Out of memory
- KRN-R0006: Assertion failed
- KRN-R0007: Pattern not exhaustive
- KRN-R0008: Rune panic
```

### LSP Errors
Errors from the language server:
```
- KRN-L0001: Import resolution failed
- KRN-L0002: Cyclic dependency detected
- KRN-L0003: Macro expansion failed
```

## Suggestions

Kasteran* provides intelligent suggestions:

### Type Mismatch
```
error[KRN-E0001]: Type mismatch
  = suggestion: Did you mean to use `parse::<i32>()`?
  = suggestion: Or use `to_string()` to convert `i32` to `String`
```

### Undefined Variable
```
error[KRN-E0002]: Undefined variable `count`
  = suggestion: Did you mean `counter`?
  = suggestion: Or define `count` before using it
```

### Missing Import
```
error[KRN-L0001]: `HashMap` is not in scope
  = suggestion: Add `use std::collections::HashMap` at the top of the file
```

## Error Documentation

Every error has detailed documentation:

```
kasteran explain KRN-E0001
```

Output:
```
KRN-E0001: Type mismatch
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A type mismatch occurs when a value of one type is used
in a context that expects a different type.

Example:
    let x: i32 = "hello"  // Error: expected i32, found String

Common causes:
    - Assigning a string to a numeric variable
    - Using the wrong operator for the type
    - Missing type conversion

Solutions:
    - Change the value to match the expected type
    - Use an explicit type conversion (parse, to_string, as)
    - Change the type annotation

See also:
    - KRN-E0005: Lifetime error
    - KRN-E0006: Implicit type conversion
```

## No Cryptic Messages

Kasteran* avoids cryptic messages:
- No hexadecimal memory addresses (unless debugging)
- No raw compiler internals
- No internal symbol names
- No confusing abbreviations

## Error Configuration

Errors can be configured:
```
# Suppress specific warnings
#![allow(KRN-E0008)]  // Allow unused variables

# Treat warnings as errors
#![deny(KRN-E0008)]   // Unused variables are errors
#![warn(KRN-E0008)]   // Unused variables are warnings
```

## Conclusion

Kasteran* explainable errors provide clear, actionable information for every error. Source snippets, error codes, suggestions, and comprehensive documentation ensure that developers can quickly understand and fix issues.
