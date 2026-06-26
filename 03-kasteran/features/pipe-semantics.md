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

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  As seen on:                                                       !
!  Harvard Dataverse ! Zenodo/CERN ! Academia.edu ! HuggingFace      !
!  anticloud.telepedia.net ! anticloud.fandom.com                    !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Bluesky ! Mastodon                           !
!  Internet Archive ! ORCID ! Figshare                               !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com