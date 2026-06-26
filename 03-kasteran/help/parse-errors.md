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

# Kasteran* — Parse Errors
© Lois-Kleinner & 0-1.gg 2026

## Overview

Parse errors occur when the parser encounters unexpected tokens or malformed syntax. The parser employs error recovery, so multiple errors can be reported in a single pass.

## Parse Error Format

```
error[E010]: Expected identifier
 --> <file>:<line>:<column>
  |
<line> | <source>
  |     <underline>
  |
  = note: expected `identifier`, found `<actual_token>`
```

## Expected Identifier (E010)

```
error[E010]: Expected identifier
 --> src/main.ka:1:4
  |
1 | fn 123() {}
  |    ^^^ expected identifier, found `Number`
```

**Common causes:**
- Using a number as a function name
- Missing variable name after `let`
- Missing struct name after `struct`

```ka
// Wrong:
fn 123() {}

// Right:
fn my_function() {}
```

## Expected Type Annotation (E011)

```
error[E011]: Expected type annotation
 --> src/main.ka:2:9
  |
2 |     let x: = 5;
  |          ^ expected type after `:`
```

**Cause:** The type annotation after `:` is missing or malformed.

**Fix:** Provide a valid type:

```ka
let x: I32 = 5;
```

## Expected Expression (E012)

```
error[E012]: Expected expression
 --> src/main.ka:3:13
  |
3 |     let y = ;
  |             ^ expected expression after `=`
```

**Cause:** No expression is provided after `=`.

**Fix:** Provide an expression or use `()` for unit:

```ka
let y = 5;   // With expression
let y: I32;  // Or declare without initializer
```

## Expected `{` (E013)

```
error[E013]: Expected `{` after function declaration
 --> src/main.ka:1:11
  |
1 | fn main()
  |           ^ expected `{`
```

**Cause:** Function body is missing the opening brace.

**Fix:** Add `{` and the function body:

```ka
fn main() {
    // body
}
```

## Expected `(` (E014)

```
error[E014]: Expected `(` after function name
 --> src/main.ka:1:8
  |
1 | fn main {}
  |        ^ expected `(`
```

**Cause:** Missing opening parenthesis after function name.

**Fix:** Add parameters (even if empty):

```ka
fn main() {
    // body
}
```

## Expected `)` (E015)

```
error[E015]: Expected `)` after parameters
 --> src/main.ka:1:14
  |
1 | fn main(a: I32, b: F32 {
  |                    ^^^ expected `)`
```

**Cause:** Missing closing parenthesis after parameter list.

**Fix:** Close the parameter list:

```ka
fn main(a: I32, b: F32) {
    // body
}
```

## Unclosed Delimiter (E016)

```
error[E016]: Unclosed delimiter
 --> src/main.ka:5:1
  |
5 | }
  | ^ expected `}` to close `{` at line 1
```

**Cause:** A `(`, `{`, or `[` has no matching closing delimiter.

**Fix:** Ensure all delimiters are properly closed.

## Invalid Statement (E017)

```
error[E017]: Invalid statement
 --> src/main.ka:4:5
  |
4 |     +;
  |     ^ this token cannot start a statement
```

**Cause:** A statement starts with an operator or other invalid token.

**Fix:** Ensure each statement starts with a valid keyword or expression.

## Missing Semicolon (E018)

```
error[E018]: Expected `;` after statement
 --> src/main.ka:3:10
  |
3 |     let x = 5
  |               ^ expected `;`
```

**Cause:** The statement is not terminated with `;`.

**Fix:** Add `;` at the end of the statement:

```ka
let x = 5;
```

## Error Recovery

The parser uses panic-mode error recovery. When an error is encountered:

1. The error is recorded with location and expected tokens
2. The parser skips tokens until it finds a synchronisation point
3. Parsing resumes from the synchronisation point

```ka
// The parser recovers after the first error:
fn main() {
    let x = ;     // Error: expected expression
    let y = 5;    // This is still parsed correctly
    y + 1;        // And this too
}
```

This means that fixing the first error may resolve subsequent errors. Always start by fixing the earliest reported error.

## Common Patterns

### Missing `fn` keyword

```
  --> src/main.ka:1:1
  |
1 | main() {}
  | ^^^^ expected `fn` at start of function
```

**Fix:** Add `fn`:

```ka
fn main() {}
```

### Trailing comma in struct literal

```ka
let p = Point { x: 1.0, y: 2.0, }; // Trailing comma is allowed
```

### Wrong bracket type

```
error[E016]: Unclosed delimiter
  |
1 | fn main() {
  |            ^ expected `}`, found `)`
```

**Fix:** Use matching brackets:

```ka
fn main() {  // Open with {
    // body
}             // Close with }
```

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

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/YMJKOG
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