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

# Kasteran* — Hello World

© Lois-Kleinner & 0-1.gg 2026

## Your First Program

The canonical "Hello, World!" in Kasteran*:

```
|+ main() -> i32 {
    print("Hi!")
    => 0
}
```

Save this as `hello.kast` and run:

```
kasteran run hello.kast
```

Output:

```
Hi!
```

## Breaking It Down

### `|+ main() -> i32`

- `|+` is the **Definer** rune — it defines a function
- `main` is the entry point (every program needs one)
- `() -> i32` means the function takes no arguments and returns an `i32`

### `print("Hi!")`

`print` is a built-in function from the standard library. It writes to stdout.

### `=> 0`

`=>` is the Arrow rune used as a tail expression. It returns the value `0` from main, indicating successful execution.

## Variations

### With a greeting variable

```
|+ main() -> i32 {
    greeting := "Hi!"
    print(greeting)
    => 0
}
```

### Using pipes

```
|+ main() -> i32 {
    "Hi!" ~> print
    => 0
}
```

### With user input

```
|+ main() -> i32 {
    name := read_line()
    print("Hi, " + name + "!")
    => 0
}
```
</```
