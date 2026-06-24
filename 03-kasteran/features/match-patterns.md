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

## Overview

Pattern matching in Kasteran* uses the `|_` (Matcher) rune. It provides a concise, expressive way to destructure values and branch on shape, not just value.

## Syntax

```
|_ expr {
    pattern1 => body1
    pattern2 => body2
    _       => default_body
}
```

## Pattern Types

### Wildcard Pattern

The underscore `_` matches any value and discards it:

```
|_ x {
    _ => "anything"
}
```

### Literal Pattern

Match against specific literal values:

```
|_ status_code {
    200 => "OK"
    404 => "Not Found"
    500 => "Server Error"
    _   => "Unknown"
}
```

### Identifier Pattern

Bind a matched value to a name:

```
|_ value {
    zero if zero == 0 => "zero"
    n => "non-zero: " + n.to_string()
}
```

### Struct Destructuring

Match and destructure struct fields:

```
$$ Point = (x: f32, y: f32)

|_ point {
    Point(x: 0.0, y: 0.0) => "origin"
    Point(x: _, y: 0.0)   => "on x-axis"
    Point(x: 0.0, y: _)   => "on y-axis"
    _                     => "somewhere"
}
```

### Tuple Matching

```
pair := (1, "hello")
|_ pair {
    (1, msg) => "got: " + msg
    (_, _)   => "unknown pair"
}
```

## Graph

```
graphify {
    |_ expr -> PatternMatcher
    PatternMatcher -> {Wildcard, Literal, Identifier, Struct, Tuple}
    Wildcard -> _ (discard)
    Literal -> {200, 404, "text", true}
    Identifier -> {binding, guard}
    Struct -> {FieldMatch, NestedPattern}
    Compiled -> SwitchTable (fast)
}
```

## Guards

Patterns can have guard conditions:

```
|_ value {
    n if n > 0 => "positive"
    n if n < 0 => "negative"
    0          => "zero"
}
```

## Exhaustiveness Checking

The compiler verifies that all cases are covered:

```
|: Color = Red | Green | Blue

|_ color {
    Red   => "#FF0000"
    Green => "#00FF00"
    // ERROR: missing case: Blue
}
```

## Match as Expression

Pattern matching returns a value:

```
description := |_ status {
    200 => "OK"
    404 => "Not Found"
    _   => "Error"
}
```

## Compilation

Pattern matching compiles to efficient decision trees:

```
// Source:
|_ code {
    200 => "OK"
    404 => "Not Found"
    _   => "Unknown"
}

// Generated C:
const char* result;
switch (code) {
    case 200: result = "OK"; break;
    case 404: result = "Not Found"; break;
    default:  result = "Unknown"; break;
}
```

## Example: State Machine

```
|: State = Idle | Loading | Ready | Error(string)

|+ handle_state(state: State) -> string {
    => |_ state {
        Idle           => "Waiting for input"
        Loading         => "Loading..."
        Ready           => "Ready"
        Error(msg)      => "Error: " + msg
    }
}
```

## Example: Expression Evaluator

```
|: Expr = 
    | Number(f32) 
    | Add(Expr, Expr) 
    | Mul(Expr, Expr)

|+ eval(expr: Expr) -> f32 {
    => |_ expr {
        Number(n)      => n
        Add(l, r)      => eval(l) + eval(r)
        Mul(l, r)      => eval(l) * eval(r)
    }
}
```
</```
