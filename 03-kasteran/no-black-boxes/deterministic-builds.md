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

# Kasteran* — Deterministic Builds
© Lois-Kleinner & 0-1.gg 2026

## Overview

A deterministic build system ensures that the same source code always produces exactly the same binary, regardless of when, where, or by whom the build is performed. Kasteran* implements deterministic builds as a core requirement, enabling reproducible builds, verifiable deployments, and supply chain security.

## Determinism Guarantee

Kasteran* guarantees that given the same inputs:

- Source code (same hash)
- Compiler version (same build)
- Build configuration (same parameters)
- Dependencies (same versions)

The output binary will be **bit-for-bit identical**.

## Sources of Non-Determinism

Kasteran* eliminates common sources of non-determinism:

### Timestamps
```
// Non-deterministic: embed build time
problem: embedded build_timestamp in binary
solution: zero timestamps, use hash instead // or constant value

// Kasteran* approach
binary.build_timestamp = "0000-00-00T00:00:00Z"  // or omit
```

### File System Ordering
```
problem: readdir returns files in different order
solution: sort file lists deterministically

// Kasteran* approach
let files = fs::read_dir("src/").sorted()
```

### Randomness
```
problem: random seeds for hash maps
solution: use deterministic hash maps with fixed seeds

// Kasteran* approach
let map = HashMap::deterministic()
```

### Parallelism
```
problem: parallel compilation produces different output order
solution: deterministic scheduling of parallel work

// Kasteran* approach
let build_graph = BuildGraph::from_dependencies()
let schedule = build_graph.deterministic_schedule()
```

### Path Embedding
```
problem: absolute paths embedded in debug info
solution: use relative paths or strip paths

// Kasteran* approach
compiler.debug.paths = "relative"
```

## Implementation

### Build Configuration
```
kasteran build --deterministic [other flags]
```

The `--deterministic` flag enables all determinism guarantees:
- Strips non-deterministic metadata
- Normalizes file paths to relative
- Uses fixed random seeds
- Orders output deterministically
- Records all build inputs with hashes

### Verification
```
kasteran build --verify
```

This command:
1. Records hashes of all source files
2. Records compiler version hash
3. Records dependency hashes
4. Produces binary with embedded build manifest
5. Verifies that rebuild produces same binary

## Build Manifest

Every deterministic build produces a manifest:

```json
{
    "build_id": "build_abc123",
    "compiler": {
        "name": "kasteran",
        "version": "1.0.0",
        "source_hash": "sha256:..."
    },
    "sources": {
        "src/main.krn": "sha256:abc...",
        "src/lib.krn": "sha256:def..."
    },
    "dependencies": {
        "kasteran-stdlib": "1.0.0",
        "third-party-lib": "2.1.0"
    },
    "configuration": {
        "target": "x86-64",
        "optimization": "release",
        "features": []
    },
    "output": {
        "binary_hash": "sha256:xyz...",
        "binary_size": 1048576
    }
}
```

## Reproducibility

Third parties can independently verify builds:

### Verification Steps
1. Obtain source code (clone from repository)
2. Verify source hash matches release manifest
3. Build with `--deterministic` flag
4. Compare binary hash with published hash
5. Verify signatures on published artifacts

### CI Verification
```
# CI pipeline verifies reproducibility
kasteran build --deterministic --release
binary_hash = sha256sum kasteran-binary
assert binary_hash == published_hash
```

## Use Cases

### Supply Chain Security
Deterministic builds prevent supply chain attacks:
- Binaries can be verified against source
- Compromise of build infrastructure is detectable
- Multiple parties can independently verify

### Compliance
Auditors can verify that deployed binaries match approved source:
- SOC 2: Change management verification
- ISO 27001: Configuration management
- FedRAMP: Continuous monitoring

### Debugging
Developers can reproduce customer issues exactly:
- Same source + same compiler = same binary
- Build date doesn't affect behavior
- No "works on my machine" issues

## Conclusion

Kasteran* deterministic builds ensure that the same source always produces the same binary. This eliminates an entire class of supply chain risks and provides verifiable integrity for deployments.

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

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

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
