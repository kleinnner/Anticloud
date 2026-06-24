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

# Kasteran* — Functions

© Lois-Kleinner & 0-1.gg 2026

## Defining Functions

Use `|+` (Definer) to define functions:

```
|+ greet(name: string) {
    print("Hello, " + name)
}
```

## Return Types

Specify return type with `->`:

```
|+ add(a: i32, b: i32) -> i32 {
    => a + b
}
```

## Tail Expressions

Use `=>` to return a value:

```
|+ double(x: i32) -> i32 {
    => x * 2
}
```

A function body can have statements before the tail expression:

```
|+ factorial(n: i64) -> i64 {
    result :~ 1
    i := 2
    while i <= n {
        result = result * i
        i = i + 1
    }
    => result
}
```

## Multiple Parameters

```
|+ distance(x1: f32, y1: f32, x2: f32, y2: f32) -> f32 {
    dx := x2 - x1
    dy := y2 - y1
    => sqrt(dx * dx + dy * dy)
}
```

## Lambda Functions

Use `=>` for anonymous functions:

```
doubled := map(numbers, x => x * 2)
filtered := filter(numbers, x => x > 0)
```

## Higher-Order Functions

Functions are first-class values:

```
|+ apply(f: (i32 -> i32), x: i32) -> i32 {
    => f(x)
}

result := apply(x => x * 3, 5)  // 15
```

## Example

```
|+ greet(name: string) -> string {
    => "Hi, " + name + "!"
}

|+ main() -> i32 {
    msg := greet("Bob")
    print(msg)
    => 0
}
```
</```
