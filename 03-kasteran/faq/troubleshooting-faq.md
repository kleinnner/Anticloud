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

# Kasteran* — Troubleshooting FAQ
© Lois-Kleinner & 0-1.gg 2026

## "kasteran" is not recognized

The Kasteran* compiler is not in your PATH.
- **Windows**: Reinstall and check "Add to PATH" option
- **macOS/Linux**: Restart your terminal or add to PATH:
  ```
  export PATH="$HOME/.kasteran/bin:$PATH"
  ```

## Compilation fails with "out of memory"

The compiler requires more memory:
```
# Increase available memory
kasteran build --memory-limit 4096
# Or close other applications
```

Minimum: 2 GB RAM. Recommended: 8 GB RAM.

## "Type mismatch" errors

Common causes:
- Wrong type annotation
- Missing type conversion
- Function returns different type than expected

Check the exact types expected in the error message.

## "Linear value not consumed" error

A linear type value must be used exactly once:
```
let file = File::open("data.txt")  // Linear resource
// Must consume 'file' exactly once
let contents = file.read()  // Consumed by read()
// 'file' cannot be used again
```

## Runtime error: "index out of bounds"

Array access with an invalid index:
```
let arr = [1, 2, 3]
let x = arr[5]  // Error: index 5 out of bounds
```

Use `get()` for safe access:
```
let x = arr.get(5)  // Returns Optional<i32>
```

## VM crash

If the Kasteran* VM crashes:
1. Check for infinite recursion
2. Check for stack overflow
3. Check for out-of-memory
4. Reproduce with minimal code
5. File a bug report with the reproduction

## LSP issues

If the language server (LSP) is not working:
```
# Restart the LSP
kasteran lsp restart

# Check LSP status
kasteran lsp status

# Clear cache
kasteran clean --lsp-cache
```

## "Dependency not found"

The package registry may be unavailable:
```
# Check registry status
kasteran registry status

# Use mirror
kasteran config set registry https://mirror.kasteran.dev

# Build offline
kasteran build --offline
```

## Slow compilation

If compilation is slow:
```
# Use incremental compilation
kasteran build --incremental

# Increase parallel jobs
kasteran build --jobs 8

# Check for large circular dependencies
kasteran deps --tree
```

## Getting help

If you cannot resolve the issue:
- Search GitHub issues: github.com/kasteran/kasteran/issues
- Ask on Discord: discord.gg/kasteran
- Post on forum: forum.kasteran.dev
- File a bug report with reproduction steps

## Conclusion

Most issues can be resolved by checking error messages, increasing resources, or consulting community resources. File bug reports for persistent issues.

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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
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
