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

# Kasteran* — Error Handling

© Lois-Kleinner & 0-1.gg 2026

## Type Errors

The compiler catches type mismatches:

```
x := "hello"
y := x + 42  // Error: cannot add string and i32
```

Example output:

```
Error: Type mismatch
  --> main.kast:3:13
   |
 3 | y := x + 42
   |         ^^ expected string, found i32
```

## Parse Errors

Invalid syntax is caught during parsing:

```
|+ main() -> i32 {
    print("Hello")
    0 =>    // Error: unexpected token
}
```

## Linear Type Errors

Consumption errors are reported:

```
buf := create_buffer(1024)
process(buf)
process(buf)  // Error: buf has already been consumed
```

## Runtime Errors

Runtime errors produce a backtrace:

```
Error: Division by zero
  --> main.kast:5:13
   |
 5 | result := x / 0
   |         ^^^^^^^
```

## Understanding Compiler Output

The compiler uses a consistent format:

```
Error: <error type>
  --> <file>:<line>:<column>
   |
 <line> | <code>
   |     ^ <highlight>
   = note: <additional info>
```

## Common Errors

| Error | Cause |
|-------|-------|
| `Type mismatch` | Wrong type used |
| `Cannot reassign` | Tried to modify `:=` binding |
| `Value consumed` | Linear value used twice |
| `Unexpected token` | Syntax error |
| `Module not found` | Import path is wrong |
| `Missing case in match` | Non-exhaustive pattern |

## Example

Try compiling with `--check` to see errors without running:

```
kasteran check program.kast
```
</```
