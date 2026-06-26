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

# Kasteran* — Compiler Errors
© Lois-Kleinner & 0-1.gg 2026

## Understanding Compiler Error Output

Kasteran* errors follow a consistent format designed for readability and quick diagnosis.

## Error Format

```
error[EXXX]: <message>
 --> <file>:<line>:<column>
  |
<line> | <source line>
  |     <underline> <expected/actual>
  |
  = note: <additional context>
```

### Components

1. **Error code** (`E001`, `E002`, ...) — unique identifier for the error type
2. **Message** — human-readable description of the problem
3. **Location** — file path, line number, and column number
4. **Source context** — the relevant source line with an underline pointing to the error
5. **Note** — additional hints or suggestions

## Error Codes Reference

### Lexical Errors (E001—E009)

| Code | Description |
|------|-------------|
| E001 | Invalid character in source |
| E002 | Unterminated string literal |
| E003 | Invalid numeric literal |
| E004 | Unexpected token |

### Parse Errors (E010—E029)

| Code | Description |
|------|-------------|
| E010 | Expected identifier |
| E011 | Expected type annotation |
| E012 | Expected expression |
| E013 | Expected `{` after function declaration |
| E014 | Expected `(` after function name |
| E015 | Expected `)` after parameters |
| E016 | Unclosed delimiter |
| E017 | Invalid statement |
| E018 | Expected `;` after statement |

### Type Errors (E030—E059)

| Code | Description |
|------|-------------|
| E030 | Type mismatch |
| E031 | Cannot infer type |
| E032 | Undefined variable |
| E033 | Undefined function |
| E034 | Undefined struct |
| E035 | Invalid binary operation |
| E036 | Linear type violation |
| E037 | Variable used multiple times (linear) |
| E038 | Variable not used (linear) |
| E039 | Type annotation required |
| E040 | Invalid array access |

### Runtime Errors (E060—E079)

| Code | Description |
|------|-------------|
| E060 | Stack underflow |
| E061 | Division by zero |
| E062 | Out of bounds access |
| E063 | Null pointer dereference |
| E064 | Type mismatch at runtime |
| E065 | Undefined function call |

### Module Errors (E080—E099)

| Code | Description |
|------|-------------|
| E080 | Module not found |
| E081 | Circular import |
| E082 | Failed to read module |
| E083 | Invalid module path |
| E084 | Lex errors in module |
| E085 | Parse errors in module |

## fmt_error Function

The compiler formats errors using the `fmt_error` function:

```rust
pub fn fmt_error(error: &CompileError, source: &str, file_name: &str) -> String {
    match error {
        CompileError::TypeError(err) => fmt_type_error(err, source, file_name),
        CompileError::ParseError(err) => fmt_parse_error(err, source, file_name),
        CompileError::LexError(err) => fmt_lex_error(err, source, file_name),
        CompileError::ModuleError(err) => fmt_module_error(err, source, file_name),
        CompileError::RuntimeError(err) => fmt_runtime_error(err, source, file_name),
    }
}

fn fmt_type_error(err: &TypeError, source: &str, file_name: &str) -> String {
    let (line, col) = line_col(source, err.span());
    let line_content = source.lines().nth(line - 1).unwrap_or("");
    let underline = " ".repeat(col - 1) + "^" + &"~".repeat(err.span().len().saturating_sub(1));

    format!(
        "error[E030]: {}\n\
         --> {}:{}:{}\n\
         {} |\n\
         {} | {}\n\
         {} | {}\n\
         {} |\n\
         {} = note: expected `{}`, found `{}`",
        err.message(),
        file_name, line, col,
        line, line, line_content,
        line, underline,
        line,
        err.expected(), err.found()
    )
}
```

## Example Error Output

```
error[E030]: Type mismatch
 --> src/main.ka:5:13
  |
5 |     let x: I32 = 3.14;
  |                 ^^^^ expected `I32`, found `F32`
  |
  = note: try: `let x: F32 = 3.14;`
```

```
error[E036]: Linear type violation
 --> src/main.ka:7:9
  |
7 |     let z = x;
  |         ^ variable `x` used twice
  |
  = note: `x` was already consumed at line 6
```

```
error[E080]: Module not found
 --> src/main.ka:1:5
  |
1 | use unknown::module;
  |     ^^^^^^^^^^^^^^^^
  |
  = note: searched paths:
           ./src/unknown/module.ka
           ./lib/unknown/module.ka
           ./unknown/module.ka
```

## Error Suppression

Errors can be suppressed with `#[allow(error_code)]`:

```ka
#[allow(E036)]
fn main() {
    let x = 5;
    let y = x;
    let z = x; // No error due to #[allow(E036)]
}
```

## Common Fixes

| Error | Common Fix |
|-------|------------|
| E001 | Remove or escape invalid characters |
| E002 | Add closing `"` to string literal |
| E010 | Add identifier after `fn`, `let`, or `struct` |
| E030 | Ensure types match assignment or expression |
| E036 | Ensure each variable is used exactly once |
| E080 | Check module path and search directories |
| E081 | Restructure code to remove circular dependency |

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

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
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
