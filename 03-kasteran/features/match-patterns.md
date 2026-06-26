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

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
