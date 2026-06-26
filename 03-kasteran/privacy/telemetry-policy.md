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

# Kasteran* — Telemetry Policy
© Lois-Kleinner & 0-1.gg 2026

## Overview

This telemetry policy describes Kasteran* approach to collecting usage data, crash reports, and performance data. Telemetry helps us improve the language while respecting user privacy and providing full transparency and control.

## Telemetry Categories

### Crash Reports
Crash reports are automatically generated when the compiler encounters a fatal error.

**What is collected:**
- Crash type and error code
- Anonymized stack trace (symbols only, no addresses)
- Compiler version and build hash
- Operating system type (Windows, macOS, Linux)
- Architecture (x86-64, ARM64)
- Memory usage at crash time

**What is NOT collected:**
- Source code or snippets
- File names or paths
- User identity or personal information
- System configuration details

### Usage Statistics
Usage statistics track how the compiler is used.

**What is collected:**
- Command invoked (build, test, run)
- Compilation duration
- Number of source files
- Target architecture
- Optimization level
- Features used
- Error types encountered

**What is NOT collected:**
- Variable names, function names
- Comments or documentation
- Project structure or dependencies
- User behavior outside the compiler

### Performance Data
Performance data helps identify optimization opportunities.

**What is collected:**
- Compilation time by phase
- Memory usage during compilation
- Number of threads used
- Cache hit rates
- I/O wait times

**What is NOT collected:**
- Profiling data from user applications
- Runtime performance of user code
- Detailed timing of user functions

## Telemetry Configuration

### Opt-In Default
Telemetry is disabled by default. Users must explicitly enable it:

```
# Enable all telemetry
kasteran config set telemetry.enabled true

# Enable only crash reports
kasteran config set telemetry.crash_reports true

# Enable only usage statistics
kasteran config set telemetry.usage_stats true
```

### Configuration File
Settings are stored in `~/.kasteran/config.toml`:
```toml
[telemetry]
enabled = false
crash_reports = false
usage_stats = false
performance_data = false
```

### Environment Variables
Telemetry can be controlled via environment variables:
```
KASTERAN_TELEMETRY_DISABLE=1  # Disables all telemetry
KASTERAN_CRASH_REPORT_DISABLE=1  # Disables crash reporting only
```

## Data Transmission

### Protocol
Telemetry data is transmitted over HTTPS to `telemetry.kasteran.dev`.

### Frequency
- Crash reports: Immediately after crash (with user confirmation)
- Usage statistics: Batched and sent daily
- Performance data: Batched and sent weekly

### No Third Parties
Telemetry data is sent directly to Kasteran* infrastructure. No third-party analytics services are used.

## Data Processing

### Aggregation
Raw data is aggregated to produce anonymized statistics:
- Total compilations per day
- Error rate per compiler version
- Average compilation time per optimization level
- Feature usage percentages

### Anonymization
Before aggregation:
- IP addresses are discarded
- Timestamps are rounded to the day
- Unique identifiers are one-way hashed
- Continuous values are bucketed

## User Rights

Users can:
- **View** collected data: `kasteran telemetry export`
- **Delete** collected data: Submit deletion request
- **Opt out** at any time: `kasteran config set telemetry.enabled false`
- **Export** their data: `kasteran telemetry export --format json`

## Transparency

We publish:
- Aggregated telemetry statistics on the Kasteran* website
- Changes to telemetry in release notes
- Source code for telemetry collection (fully open source)

## Conclusion

Kasteran* telemetry is opt-in, minimal, and transparent. Crash reports, usage statistics, and performance data are collected only with explicit user consent and are used solely to improve the language.

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
