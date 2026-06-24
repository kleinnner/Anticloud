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

# Kasteran* — Pattern Matching

© Lois-Kleinner & 0-1.gg 2026

## Basic Match

Use `|_` (Matcher) for pattern matching:

```
|_ status_code {
    200 => "OK"
    404 => "Not Found"
    500 => "Server Error"
    _   => "Unknown"
}
```

## Wildcard

The `_` wildcard matches anything:

```
|_ value {
    _ => "got something"
}
```

## Literal Matching

Match against specific values:

```
|_ day {
    1 => "Monday"
    2 => "Tuesday"
    3 => "Wednesday"
    4 => "Thursday"
    5 => "Friday"
    _ => "Weekend"
}
```

## Match as Expression

Match returns a value:

```
description := |_ code {
    200 => "success"
    404 => "not found"
    _   => "error"
}
```

## Guards

Add conditions to patterns:

```
|_ value {
    n if n > 0 => "positive"
    n if n < 0 => "negative"
    0          => "zero"
}
```

## Example

```
|+ classify(age: i32) -> string {
    => |_ age {
        n if n < 13  => "child"
        n if n < 20  => "teenager"
        n if n < 65  => "adult"
        _            => "senior"
    }
}

|+ main() -> i32 {
    print(classify(25))  // "adult"
    => 0
}
```
</```
