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

# Kasteran* — Data Collection Practices
© Lois-Kleinner & 0-1.gg 2026

## Overview

This document details Kasteran* data collection practices, explaining what data is collected, why it is collected, how it is collected, when it is collected, and how to opt in or out. We are committed to minimal, transparent, and consensual data collection.

## What We Collect

### Telemetry Data
When telemetry is enabled (opt-in), we collect:
- Compilation time and success rate
- Language features used
- Error types encountered
- Target architecture
- Compiler version
- Operating system type

### Crash Reports
When crash reporting is enabled (opt-in), we collect:
- Crash type and stack trace (anonymized)
- Compiler version
- Memory usage at crash time
- Operating system type

### Website Data
When you visit the Kasteran* website, we may collect:
- Page views and navigation paths
- Browser type and version
- Referrer information
- Anonymous usage patterns

## Why We Collect Data

### Product Improvement
- Identify most-used features for optimization
- Detect common errors for better error messages
- Track performance to guide optimization efforts
- Understand usage patterns for roadmap planning

### Stability
- Detect and fix crashes
- Identify compatibility issues
- Monitor performance regressions
- Improve cross-platform support

### Security
- Detect potential security issues
- Monitor for abuse patterns
- Improve authentication and access controls

## How We Collect Data

### Compiler Integration
Data collection is built into the compiler:
```
// No data collection code runs unless enabled
if config.telemetry_enabled {
    // Minimal, anonymized data collection
}
```

### Opt-In Mechanism
```
kasteran config set telemetry.enabled true
// Only then does any data collection occur
```

### Anonymization
Before transmission, data is anonymized:
- IP addresses are stripped
- File paths are normalized
- Source code is never collected
- User identifiers are hashed

## When We Collect Data

### Compilation Time
Data is collected during compilation:
```
kasteran build my_app.krn
// If telemetry enabled, data is sent after compilation completes
```

### Crash Time
Crash data is collected immediately after a crash:
```
// Data is sent only with user confirmation
Send crash report? [Y/n]
```

### Website Browsing
Website analytics are collected during browsing:
```
// With cookie consent
Cookies are used for analytics. Accept? [Accept] [Reject]
```

## Opt-In and Opt-Out

### How to Opt In
```
# Enable telemetry
kasteran config set telemetry.enabled true

# Enable crash reporting
kasteran config set telemetry.crash_reports true
```

### How to Opt Out
```
# Disable telemetry
kasteran config set telemetry.enabled false

# Disable crash reporting
kasteran config set telemetry.crash_reports false

# During first run - select "No"
```

### Granular Controls
```
telemetry:
  enabled: true
  crash_reports: true
  usage_stats: true
  performance_data: false
```

## Data Minimization

We follow data minimization principles:
- Collect only what is necessary
- Never collect source code or personal information
- Aggregate where possible
- Delete raw data after processing
- Provide access to collected data on request

## Data Retention

| Data Type | Retention Period |
|---|---|
| Anonymized usage stats | Indefinite (aggregated) |
| Raw telemetry | 90 days |
| Crash reports | 1 year |
| Website analytics | 26 months |
| Individual data | Deleted on request |

## User Access

Users can access their collected data:
```
kasteran telemetry export
```

This exports all data associated with your installation.

## Conclusion

Kasteran* data collection is minimal, transparent, and consent-based. All data collection is opt-in, anonymized, and documented. Users have full control over what data is collected and can access, export, or delete their data at any time.
