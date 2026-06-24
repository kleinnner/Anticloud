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

# Kasteran* — Type Errors
© Lois-Kleinner & 0-1.gg 2026

## Overview

Type errors are reported by the type checker after parsing and HIR lowering. They indicate violations of the type system, including linear type rules.

## Type Error Format

```
error[E030]: <message>
 --> <file>:<line>:<column>
  |
<line> | <source>
  |     <underline>
  |
  = note: expected `<type>`, found `<type>`
```

## Type Mismatch (E030)

```
error[E030]: Type mismatch
 --> src/main.ka:3:13
  |
3 |     let x: I32 = 3.14;
  |                 ^^^^ expected `I32`, found `F32`
```

**Common causes:**
- Assigning a float to an integer variable
- Returning the wrong type from a function
- Passing the wrong type as a function argument

**Fix:**
```ka
// Wrong:
let x: I32 = 3.14;

// Right:
let x: F32 = 3.14;
// Or:
let x: I32 = 3;
```

## Cannot Infer Type (E031)

```
error[E031]: Cannot infer type
 --> src/main.ka:5:9
  |
5 |     let x = unknown_function();
  |         ^ type annotation required
```

**Cause:** The compiler cannot determine the type of a variable or expression without explicit annotation.

**Fix:** Add a type annotation:

```ka
let x: F32 = unknown_function();
```

## Undefined Variable (E032)

```
error[E032]: Undefined variable `z`
 --> src/main.ka:4:13
  |
4 |     let y = x + z;
  |                 ^ not found in this scope
```

**Cause:** The variable has not been declared in the current scope or any parent scope.

**Fix:** Ensure the variable is declared before use:

```ka
let z: F32 = 0.0;
let y = x + z;
```

## Undefined Function (E033)

```
error[E033]: Undefined function `foo`
 --> src/main.ka:2:5
  |
2 |     foo();
  |     ^^^ not defined
```

**Cause:** The function has not been declared or is not in scope.

**Fix:** Define the function or add the appropriate `use` declaration.

## Linear Type Violations (E036—E038)

### E036: Variable Used Multiple Times

```
error[E036]: Linear type violation
 --> src/main.ka:6:9
  |
6 |     let z = x;
  |         ^ variable `x` used twice
  |
  = note: `x` was already consumed at line 5
```

**Cause:** A non-`Copy` type was used more than once.

**Fix:** Clone explicitly or restructure code:

```ka
// Copy types are fine:
let x: I32 = 5;
let y = x;
let z = x; // OK: I32 is Copy

// Non-copy types need explicit handling:
let x: String = "hello";
let y = x;
// let z = x; // ERROR: String is not Copy
```

### E037: Variable Not Used

```
error[E037]: Linear type violation
 --> src/main.ka:4:9
  |
4 |     let x: String = "unused";
  |         ^ variable `x` is never used
  |
  = note: values of type `String` must be used exactly once
```

**Cause:** A non-`Copy` variable was declared but never used.

**Fix:** Use the variable or explicitly drop it:

```ka
let x: String = "temp";
drop(x); // Explicitly drop
```

### E038: Type Used After Move

```
error[E038]: Use after move
 --> src/main.ka:7:9
  |
7 |     let z = x;
  |         ^ variable `x` was moved
  |
  = note: value moved at line 6
```

**Cause:** A variable was used after its ownership was transferred.

**Fix:** Reorder operations or clone:

```ka
let x: String = "hello";
process(x);  // ownership moved to process
// x is no longer valid here
```

## Invalid Binary Operation (E035)

```
error[E035]: Invalid binary operation
 --> src/main.ka:3:9
  |
3 |     let y = true + 5;
  |             ^^^^^^^^ can't add `bool` and `I32`
```

**Cause:** The operator is not defined for the given types.

**Fix:** Ensure operands have compatible types:

```ka
let y = 5 + 3;       // Both I32: OK
let y = 5.0 + 3.0;   // Both F32: OK
// let y = 5 + 3.0;  // ERROR: mixed types
```

## Undefined Struct (E034)

```
error[E034]: Undefined struct `Point3D`
 --> src/main.ka:4:9
  |
4 |     let p = Point3D { x: 1.0, y: 2.0, z: 3.0 };
  |             ^^^^^^^ not defined
```

**Cause:** The struct type has not been defined.

**Fix:** Define the struct:

```ka
struct Point3D {
    x: F32,
    y: F32,
    z: F32,
}
```

## Array Type Mismatch

```
error[E030]: Type mismatch
 --> src/main.ka:3:9
  |
3 |     let arr: [I32; 3] = [1.0, 2.0, 3.0];
  |                         ^^^^^^^^^^^^^^^^ expected `I32`, found `F32`
```

**Cause:** Array element types do not match the declared type.

**Fix:** Ensure all elements have the correct type.
