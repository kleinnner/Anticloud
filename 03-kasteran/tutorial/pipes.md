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

# Kasteran* — Pipes

© Lois-Kleinner & 0-1.gg 2026

## Forward Pipe `~>`

The `~>` operator passes a value to a function:

```
"hello" ~> print
// Equivalent to: print("hello")
```

## Chaining

Chain multiple operations:

```
data ~> clean ~> transform ~> display
```

This is equivalent to:

```
display(transform(clean(data)))
```

## Pipe with Lambda

Combine `~>` with `=>`:

```
numbers := [1, 2, 3, 4, 5]
result := numbers ~> filter(x => x > 2) ~> map(x => x * 2)
// [6, 8, 10]
```

## Tail Expression `=>`

The arrow is also used for tail returns:

```
|+ double(x: i32) -> i32 {
    => x * 2
}
```

## Pipe in Practice

Without pipes:

```
|+ main() -> i32 {
    data := read_file("input.txt")
    cleaned := clean(data)
    transformed := transform(cleaned)
    display(transformed)
    => 0
}
```

With pipes:

```
|+ main() -> i32 {
    read_file("input.txt") ~> clean ~> transform ~> display
    => 0
}
```

## Example

```
|+ process(data: string) -> string {
    => data ~> trim ~> to_uppercase ~> reverse
}

|+ main() -> i32 {
    result := process("  hello  ")
    print(result)  // "OLLEH"
    => 0
}
```
</```
