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

# Kasteran* — Telemetry Disclosure
© Lois-Kleinner & 0-1.gg 2026

## Overview

Telemetry disclosure is the practice of fully informing users about what data is collected, how it is used, and how to control it. Kasteran* maintains a transparent telemetry policy where all data collection is disclosed, opt-in by default, and fully configurable.

## Telemetry Principles

Kasteran* telemetry follows these principles:

1. **Transparency**: All data collection is documented
2. **Opt-in by default**: No data collection without consent
3. **Minimal data**: Only essential data is collected
4. **User control**: Users can view, export, and delete their data
5. **Anonymization**: Aggregated, anonymized data where possible

## What Data Is Collected

### Compiler Telemetry
When enabled, the following data may be collected:

```
compiler_telemetry:
  - compilation_time: total compilation duration
  - source_size: total lines of code compiled
  - target: compilation target (e.g., x86-64, wasm)
  - optimization_level: -O0, -O1, -O2, -O3
  - features_used: list of language features used
  - error_types: types of compilation errors encountered
  - compiler_version: version of the compiler
  - os_type: operating system type (Windows, macOS, Linux)
  - architecture: CPU architecture (x86-64, ARM64)
```

### Crash Reports
```
crash_report:
  - crash_type: type of crash
  - stack_trace: anonymized stack trace
  - compiler_version: version
  - operating_system: OS type only (no version details)
  - memory_usage: approximate memory at crash time
```

### Usage Statistics
```
usage_statistics:
  - command_invoked: which kasteran command was run
  - command_duration: how long the command ran
  - exit_code: success or failure
```

## What Data Is NOT Collected

Kasteran* explicitly does NOT collect:
- Source code content or snippets
- File names or paths
- User names or personal information
- IP addresses (except for server-side request handling)
- System configuration details
- Installed packages or software
- Browsing history or behavior

## Opt-In Mechanism

Telemetry is opt-in by default:

### First Run Prompt
```
On first run:
Kasteran* can collect anonymous usage data to help improve the language.
This is completely optional and you can change this at any time.

[Y] Yes, share anonymous usage data
[N] No, don't collect any data
[?] Learn more about what data is collected
```

### Preference Storage
```
# ~/.kasteran/config.toml
[telemetry]
enabled = false  # or true
```

### Configuration Options
```
# Disable telemetry
kasteran config set telemetry.enabled false

# Enable telemetry
kasteran config set telemetry.enabled true

# View current settings
kasteran config show telemetry

# Export collected data
kasteran telemetry export
```

## Data Usage

Collected data is used for:
- **Improvement**: Identifying common errors and pain points
- **Performance**: Tracking compilation times and optimization effectiveness
- **Planning**: Prioritizing features based on usage patterns
- **Stability**: Identifying crash patterns and fixing bugs

## Data Retention

Telemetry data is retained:
- **Aggregated statistics**: Indefinitely (anonymized)
- **Raw data**: 90 days
- **Crash reports**: 1 year
- **Individual data**: Deleted on request

## Third-Party Sharing

Telemetry data is NOT shared with third parties:
- Data is stored on Kasteran* infrastructure
- No advertising or marketing use
- No sale of data
- No data enrichment services

## Transparency Reports

Kasteran* publishes transparency reports showing:
- Total telemetry submissions (aggregated)
- Errors encountered (anonymized)
- Feature usage (anonymized)
- Performance improvements based on telemetry

## Conclusion

Kasteran* telemetry disclosure ensures that users are fully informed about what data is collected and how it is used. Telemetry is opt-in, minimal, and transparent, with full user control over collection and deletion.

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ