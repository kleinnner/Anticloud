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

# Kasteran* — Variables and Types

© Lois-Kleinner & 0-1.gg 2026

## Constants with `:=`

The `:=` (ConstBind) rune creates an immutable binding:

```
pi := 3.14159
name := "Kasteran"
enabled := true
```

Once bound, the value cannot be changed:

```
pi := 3.14159
pi = 3.0  // ERROR: cannot assign to immutable binding
```

## Mutable Variables with `:~`

The `:~` (VarBind) rune creates a mutable variable:

```
count :~ 0
count = count + 1
count = count * 2
```

## Type Annotations

Types can be explicitly annotated with a colon:

```
age: i32 := 30
pi: f32 := 3.14159
name: string := "Kasteran"
flag: bool := true
```

## Primitive Types

| Type | Description | Size | Example |
|------|-------------|------|---------|
| `i32` | Signed 32-bit int | 4 bytes | `42` |
| `i64` | Signed 64-bit int | 8 bytes | `9999999999` |
| `f32` | 32-bit float | 4 bytes | `3.14` |
| `f64` | 64-bit float | 8 bytes | `3.1415926535` |
| `bool` | Boolean | 1 byte | `true` / `false` |
| `string` | UTF-8 string | 16 bytes (ref) | `"hello"` |
| `char` | Unicode char | 4 bytes | `'A'` |

## Type Inference

Kasteran* infers types:

```
x := 42       // x is i32
y := 3.14     // y is f32
z := "hello"  // z is string
```

## Conversion

Use `as` for explicit conversion:

```
x := 42 as f32    // 42.0
y := 3.14 as i32  // 3 (truncation)
```

## Example

```
|+ main() -> i32 {
    name := "Alice"
    age :~ 30
    age = age + 1
    print(name + " is " + age.to_string() + " years old")
    => 0
}
```
</```
