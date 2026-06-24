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

# Kasteran* — Pipe Semantics

© Lois-Kleinner & 0-1.gg 2026

## Overview

Kasteran* has two pipe operators: `~>` (forward pipe) and `=>` (arrow/lambda). Together they provide a flexible, readable way to compose functions and chain operations.

## Forward Pipe `~>`

The `~>` operator passes the left operand as the **last argument** to the function on the right:

```
result := data ~> transform
// Equivalent to: transform(data)
```

### Chaining

Multiple pipes can be chained:

```
data ~> clean ~> transform ~> analyze ~> display
// Equivalent to: display(analyze(transform(clean(data))))
```

### Multi-Argument Functions

When the right-hand side is a multi-argument function, the piped value becomes the last argument:

```
data ~> map(transform_fn, context)
// Equivalent to: map(transform_fn, context, data)
```

This "right(left) dispatch" is intentional — data flows from left to right, and fixed parameters are set before the data arrives.

## Pipe vs Lambda

The pipe `~>` pairs naturally with the arrow `=>`:

```
numbers := [1, 2, 3, 4, 5]
result := numbers ~> filter(x => x > 2) ~> map(x => x * 2)
// [6, 8, 10]
```

## Method-Style Pipes

User-defined types can expose pipe-compatible methods:

```
|+ transform(data: [i32], f: (i32 -> i32)) -> [i32] {
    result := []
    i := 0
    while i < data.len {
        result.push(f(data[i]))
        i = i + 1
    }
    => result
}

data := [1, 2, 3]
data ~> transform(x => x + 1)
```

## Graph

```
graphify {
    Data -> ~> PipeFwd
    PipeFwd -> {SingleArg, MultiArg, Chained}
    SingleArg -> f(data)
    MultiArg -> f(arg1, arg2, data)
    Chained -> f(g(h(data)))
    Combined -> {~> with =>} -> CleanPipeline
}
```

## Arrow `=>`

The arrow serves double duty:

1. **Lambda function delimiter**: `params => body`
2. **Tail expression marker**: `=> expr` (return value)

### Lambda Usage

```
map(numbers, x => x * x)
filter(people, p => p.age >= 18)
```

### Tail Expression

```
|+ double(x: i32) -> i32 {
    => x * 2
}
```

## Pipe with Pattern Matching

Pipes integrate with `|_` matching:

```
status_code ~> |_ response {
    200 => "OK"
    404 => "Not Found"
    _   => "Error"
}
```

## Performance

The compiler inlines pipe chains, producing zero runtime overhead:

```
// Source:
data ~> clean ~> transform

// Generated C:
transform(clean(data))
// No intermediate allocations
```

## Error Handling with Pipes

Result-returning functions can be piped:

```
read_file("config.json")
    ~> parse_json
    ~> validate_schema
    ~> apply_config
```

Error propagation is automatic via the type system.

## Example: Data Processing Pipeline

```
|+ main() -> i32 {
    result :=
        read_csv("data.csv")
        ~> filter(row => row.age > 18)
        ~> map(row => (name: row.name, score: row.score))
        ~> sort((a, b) => b.score - a.score)
        ~> take(10)
        ~> format_output

    print(result)
    => 0
}
```
</```
