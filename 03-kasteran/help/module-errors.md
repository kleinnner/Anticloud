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

# Kasteran* — Module Errors
© Lois-Kleinner & 0-1.gg 2026

## Overview

Module errors occur during import resolution and module loading. They indicate problems with `use` declarations, module file paths, or circular dependencies.

## Module Error Format

```
error[E080]: Module not found
 --> <file>:<line>:<column>
  |
<line> | use <module_path>;
  |          ^^^^^^^^^^^^^
  |
  = note: searched paths:
           ./src/<module_path>.ka
           ./src/<module_path>/mod.ka
           ./lib/<module_path>.ka
           ./lib/<module_path>/mod.ka
```

## Module Not Found (E080)

```
error[E080]: Module not found
 --> src/main.ka:1:5
  |
1 | use unknown::module;
  |     ^^^^^^^^^^^^^^^^ no module found
```

**Cause:** The module path could not be resolved to any existing file.

**Common causes:**
- Typo in module path
- Module not installed via `kasteran install`
- Module search path not configured

**Fix:**
```ka
// Check the exact module name:
use std::math;     // Standard library
use my_package;    // Local package

// Ensure the file exists:
// src/math.ka or src/math/mod.ka
```

## Circular Import (E081)

```
error[E081]: Circular import
 --> src/main.ka:1:5
  |
1 | use a;
  |     ^ circular dependency detected
  |
  = note: import chain: main -> a -> b -> a
```

**Cause:** Two or more modules import each other directly or indirectly.

**Fix:** Restructure the code to remove the circular dependency:

```ka
// File: a.ka
// Remove the circular import
// use b; // Remove this

// File: b.ka
// Either remove import of a, or move shared types to a third module

// File: types.ka
// Shared types go here
// Both a and b can import from types.ka
```

## Failed to Read Module (E082)

```
error[E082]: Failed to read module
 --> src/main.ka:1:5
  |
1 | use data;
  |     ^^^^ I/O error: Permission denied (os error 13)
```

**Cause:** The module file exists but cannot be read due to permissions or I/O error.

**Fix:** Check file permissions and ensure the file is accessible:

```
chmod +r src/data.ka
```

## Invalid Module Path (E083)

```
error[E083]: Invalid module path
 --> src/main.ka:1:5
  |
1 | use ..//invalid::path!
  |     ^^^^^^^^^^^^^^^^^^ invalid characters
```

**Cause:** Module path contains invalid characters or empty segments.

**Fix:** Use valid identifiers separated by `::`:

```ka
use valid::module;       // OK
use my_module;           // OK
// use invalid::;        // ERROR: empty segment
// use ..path;          // ERROR: relative paths not allowed
```

## Lex Errors in Module (E084)

```
error[E084]: Lex errors in module
 --> src/data.ka:1:1
  |
1 | ── invalid char
  | ^^ lexical error reading module
  |
  = note: module 'data' contains lexical errors
```

**Cause:** The imported module contains lexical errors.

**Fix:** Fix the lexical errors in the module file first, then recompile.

## Parse Errors in Module (E085)

```
error[E085]: Parse errors in module
 --> src/data.ka:1:1
  |
  = note: module 'data' contains parse errors
```

**Cause:** The imported module contains syntax errors.

**Fix:** Fix the syntax errors in the module file.

## Search Path Configuration

The module loader searches in these directories in order:

```
./src/
./lib/
./ (project root)
```

You can add additional search paths via configuration:

```toml
# kasteran.toml
[module]
search_paths = ["vendor", "external/libs"]
```

## Caching

Modules are cached after loading. To force a reload:

```
kasteran build --refresh
```

## Complete Example

```ka
// File: src/main.ka
use math::vector;   // resolves to src/math/vector.ka or src/math/vector/mod.ka
use std::io;        // standard library module

fn main() {
    let v = vector::new(1.0, 2.0, 3.0);
    io::print("Vector loaded");
}
```

```ka
// File: src/math/vector.ka
pub struct Vec3 { x: F32, y: F32, z: F32 }

pub fn new(x: F32, y: F32, z: F32) -> Vec3 {
    Vec3 { x, y, z }
}
```

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
