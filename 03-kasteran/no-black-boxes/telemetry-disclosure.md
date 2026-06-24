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
