<!--
     ▄▄▄   ▄▄▄  ▄▄▄  ▄▄▄▄▄▄▄▄              ▄▄▄▄      ▄▄▄▄     ▄▄▄     
    ██     ███  ███  ██▀▀▀▀▀▀            ▄█▀▀▀▀█    ██▀▀██      ██    
    ██     ████████  ██           ██     ██▄       ██    ██     ██    
    ██     ██ ██ ██  ███████   ▄▄▄██▄▄▄   ▀████▄   ██ ██ ██     ██    
  ▀▀█▄     ██ ▀▀ ██  ██        ▀▀▀██▀▀▀       ▀██  ██    ██     ▄█▀▀  
    ██     ██    ██  ██           ██     █▄▄▄▄▄█▀   ██▄▄██      ██    
    ██     ▀▀    ▀▀  ▀▀                   ▀▀▀▀▀      ▀▀▀▀       ██    
    ▀█▄▄                                                      ▄▄█▀    

MF+SO — Multi Factor+ Sign On
by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner
The Sovereign Identity & Authentication Vault
-->

# Performance Optimization Guide

> **Last Updated:** 2026-06-19
> **Category:** Optimization

## Overview

This guide covers performance optimization for MF+SO across all platforms. Whether you have a large vault, an older device, or specific performance requirements, these tips will help you get the best experience.

## Performance at a Glance

| Factor | Impact | Difficulty |
|---|---|---|
| Vault size | High | Easy |
| Device storage | Medium | Easy |
| Browser choice | Medium | Easy |
| Cache management | Medium | Easy |
| Sync frequency | Low-Medium | Easy |
| Animation settings | Low | Easy |
| Background processes | Medium | Medium |
| Network latency | Medium | Hard |
| Device age | High | Hard |

## Vault Size Optimization

### How Vault Size Affects Performance

| Entries | App Launch | Search | Sync | Backup | Memory Usage |
|---|---|---|---|---|---|
| < 100 | < 1s | < 10ms | < 1s | < 1s | ~50 MB |
| 1,000 | ~1s | < 20ms | ~3s | ~2s | ~100 MB |
| 10,000 | ~2-3s | ~50ms | ~10s | ~5s | ~200 MB |
| 50,000 | ~5-8s | ~150ms | ~30s | ~20s | ~500 MB |
| 100,000 | ~10-15s | ~300ms | ~60s | ~40s | ~1 GB |

### Tips for Large Vaults

**1. Archive or delete unused accounts**

Accounts you haven't used in a year are unlikely to become active again. Consider:
```yaml
# Criteria for deletion:
- No authentication in last 12 months
- Service is no longer used
- Duplicate or test accounts
```

How to identify unused accounts:
- Sort by "Last Used" (available in v2.6+)
- Check accounts without login in 90+ days
- Export list of all accounts and review periodically

**2. Use tags/groups (v2.6+)**

Organize accounts into folders to reduce cognitive load:
- Work accounts: Keep in main vault
- Legacy accounts: Archive
- One-time use: Delete after use

**3. Reduce account metadata**

Each account stores:
- Name, issuer, icon
- Notes, custom fields
- Usage history

Remove unnecessary notes and custom fields to reduce vault size.

**4. Periodic vault cleanup**

Schedule a quarterly cleanup:
1. Export all accounts
2. Review and remove unused entries
3. Compact the database (Settings > Advanced > Compact)

## Storage Optimization

### Free Up Storage

MF+SO requires:
- **Minimum:** 500 MB free (all platforms)
- **Recommended:** 2 GB free for smooth operation
- **Large vaults (10K+):** 5 GB free recommended

### Storage Usage Breakdown

| Data Type | Typical Size | Notes |
|---|---|---|
| Vault database | 10 KB per 100 entries | Primary data |
| Cache | 10-50 MB | Temporary files, images |
| Logs | 1-10 MB | Debug information |
| Backups | 1-5 MB per backup | Can accumulate if not cleaned |

### Cleaning Up Storage

**Desktop:**
```bash
# Clear app cache
rm -rf ~/.cache/mfso/       # macOS/Linux
rm -rf %APPDATA%\MF+SO\cache # Windows

# Remove old backup files
rm -rf ~/.config/mfso/backups/*.bak

# Clear logs (if not needed for debugging)
rm -rf ~/.config/mfso/logs/*.log
```

**Mobile:**
- Settings > Advanced > Clear Cache
- Settings > Backup > Delete Old Backups
- Reinstall app to fully clear storage (backup first!)

**Enterprise:**
```bash
# Clear old audit logs (verify retention policy first)
mfso-admin audit purge --before "2025-06-19"

# Compact database
mfso-admin database vacuum

# Clear old backups
mfso-admin backup list --older-than 30d --delete
```

## Browser Choice for Browser Extension

### MF+SO Extension Performance by Browser

| Browser | Memory Usage | CPU Usage | Feature Support | Recommendation |
|---|---|---|---|---|
| **Chrome** | Higher | Medium | Full | Good, but memory-hungry |
| **Firefox** | Medium | Lower | Full | Best for performance |
| **Edge** | Medium | Lower | Full | Good, Chromium + efficiency |
| **Brave** | Higher | Medium | Full | Good, built-in ad blocking |
| **Safari** | Lower | Lowest | Partial | Best for battery life |
| **Opera** | Higher | Medium | Full | Good with built-in VPN |
| **Vivaldi** | Higher | Medium | Full | Feature-rich but heavy |

### Extension Performance Tips

**1. Use Firefox for best balance**
- Lower memory usage than Chromium-based browsers
- Full MF+SO extension support
- Better privacy protections

**2. Limit extensions**
Each additional extension increases memory usage. Recommended:
- MF+SO (essential)
- Password manager (if not using MF+SO passwords)
- Ad blocker (uBlock Origin — efficient)
- Remove unused extensions

**3. Disable unused extension features**
In the MF+SO extension settings:
- Disable auto-fill on pages you don't need
- Limit active domains
- Disable icon badge (shows count of available credentials)

**4. Browser settings for performance**
```
Chrome: Settings > Performance > Memory Saver → ON
Firefox: Settings > Performance > Use recommended performance settings → ON
Edge: Settings > System and Performance > Startup boost → OFF
```

## Sync Performance

### Sync Frequency

| Setting | Battery Impact | Data Freshness | Recommended For |
|---|---|---|---|
| Real-time (push) | Low | Instant | All users |
| Every 5 minutes | Low | Near real-time | Heavy cross-device users |
| Every 15 minutes | Low | Good | Most users |
| Every 30 minutes | Very Low | Adequate | Battery-conscious |
| Manual only | None | Stale | Rarely used devices |

### Optimizing Sync for Large Vaults

**1. Reduce sync payload**
- Avoid editing many accounts at once between devices
- Large batch edits create large sync payloads

**2. Use Wi-Fi for sync**
- Sync uses less data over Wi-Fi
- Cellular data can be slower and more expensive
- Settings > Sync > Wi-Fi Only → ON

**3. Schedule sync during idle times**
- Avoid syncing during active authentication
- Sync happens in the background automatically

**4. If sync seems slow:**
```bash
# Check sync queue depth
mfso-admin sync status

# Force sync to clear pending changes
mfso-admin sync --force

# Reset sync state (last resort — forces full re-sync)
mfso-admin sync --reset
```

## Device-Specific Optimizations

### iOS

**Enable low-power mode for extended use:**
- Settings > Battery > Low Power Mode
- Reduces background sync frequency
- Does not affect TOTP generation

**Disable background refresh for unused apps:**
- Settings > General > Background App Refresh
- Keep MF+SO enabled
- Disable for apps you don't need

**Storage optimization:**
- Settings > General > iPhone Storage
- Offload unused apps
- Clear MF+SO cache: Settings > Advanced > Clear Cache

### Android

**Disable battery optimization for MF+SO:**
- Settings > Apps > MF+SO > Battery > Unrestricted
- Ensures push notifications arrive on time
- Does not significantly impact battery life

**Reduce animation scale (Developer Options):**
- Settings > About Phone > Tap Build Number 7 times
- Settings > Developer Options > Window Animation Scale → 0.5x
- Transition Animation Scale → 0.5x
- Makes app feel snappier

**Storage optimization:**
- Settings > Storage > Free Up Space
- Clear MF+SO cache: Settings > Apps > MF+SO > Storage > Clear Cache

### Desktop (macOS / Windows / Linux)

**Enable GPU acceleration:**
```yaml
# ~/.config/mfso/config.yaml
performance:
  gpu_acceleration: true  # Default: true
  renderer: auto          # auto, opengl, vulkan, software
```

**Reduce CPU usage:**
```yaml
performance:
  background_refresh_interval: 300  # seconds
  animation_quality: medium         # low, medium, high
  blur_effects: false                # Disable for performance
```

**Windows-specific:**
- Game Mode: Settings > Gaming > Game Mode > ON
- Enable Hardware-accelerated GPU scheduling
- Disable transparency effects: Settings > Personalization > Colors > Transparency effects > OFF

**macOS-specific:**
- Enable Low Power Mode on MacBook: Battery settings
- Reduce motion: System Settings > Accessibility > Display > Reduce motion > ON
- Use native resolution (not scaled)

**Linux-specific:**
```bash
# Use software rendering if GPU drivers cause issues
MFSO_RENDERER=software mfso

# Or use Vulkan for better performance
MFSO_RENDERER=vulkan mfso

# Disable compositor for fullscreen
export MFSO_FULLSCREEN_DIRECT=true
```

## Network Optimization

### Reducing Network Usage

| Setting | Data Saved | Impact |
|---|---|---|
| Wi-Fi only sync | Significant | Delays sync on cellular |
| Manual sync | Maximum | Data may be stale |
| Reduced sync frequency | Moderate | Slight delay |

### Proxy Configuration

If behind a corporate proxy:
```yaml
network:
  proxy:
    http: "http://proxy.company.com:8080"
    https: "http://proxy.company.com:8080"
    no_proxy:
      - "localhost"
      - "127.0.0.1"
      - ".local"
```

### CDN Configuration (Enterprise)

```yaml
# Place IdP behind CDN for global performance
network:
  cdn:
    enabled: true
    provider: "cloudflare"  # or "fastly", "akamai"
    cache_static_assets: true
    cache_ttl: 3600  # seconds
```

## Performance Monitoring

### Built-in Performance Metrics

Enable performance display:
```yaml
performance:
  show_fps: true       # UI frame rate
  show_memory: true    # Memory usage
  show_latency: true   # Sync/API latency
  show_vault_size: true # Vault entry count
```

### Interpreting Performance Metrics

| Metric | Good | Warning | Critical |
|---|---|---|---|
| FPS (frames per second) | 60 | 30-59 | < 30 |
| Memory usage | < 200 MB | 200-500 MB | > 500 MB |
| Sync latency | < 1s | 1-5s | > 5s |
| App launch time | < 2s | 2-5s | > 5s |
| Search time | < 100ms | 100-500ms | > 500ms |

## Benchmarking

### Running Performance Tests

```bash
# Desktop: Benchmark app launch
time mfso --benchmark-launch

# Mobile: Benchmark vault load
Settings > Advanced > Run Benchmark

# Enterprise: Benchmark IdP
mfso-admin benchmark idp --sessions 1000 --duration 60

# Benchmark ZTNA tunnel
mfso-admin ztna benchmark --duration 30 --size 100MB
```

### Comparing Performance

| Scenario | v2.4 (ms) | v2.5 (ms) | Improvement |
|---|---|---|---|
| App launch (100 entries) | 1,200 | 850 | 29% |
| App launch (10,000 entries) | 4,500 | 2,800 | 38% |
| Search (100 entries) | 15 | 8 | 47% |
| Search (10,000 entries) | 120 | 45 | 63% |
| Sync (100 changes) | 3,200 | 1,800 | 44% |
| TOTP code display | 5 | 3 | 40% |

## Recommended Configurations

### By Device Type

| Device | Recommended Settings |
|---|---|
| Low-end (4 GB RAM, older CPU) | Disable animations, reduce sync, software rendering |
| Mid-range (8 GB RAM, 2-3 year old) | Default settings, moderate sync |
| High-end (16+ GB RAM, current gen) | All features enabled, high quality animations |

### By Use Case

| Use Case | Settings |
|---|---|
| Personal (100-500 entries) | Default settings |
| Power user (1K-5K entries) | Enable GPU, archive old accounts, sync every 15min |
| Enterprise admin (10K+ entries) | Disable animations, manual sync, cache cleanup weekly |
| Battery-conscious mobile user | Reduce sync to 30min, disable background refresh, enable power saving |

## Future Performance Improvements

Our performance engineering roadmap:

| Version | Improvement | Expected Gain |
|---|---|---|
| v2.6.0 | Lazy database loading | 40% faster launch for 10K+ vaults |
| v2.6.0 | Compressed sync payloads | 50% smaller sync data |
| v2.6.0 | Incremental search index | 30% faster search |
| v2.7.0 | WASM crypto module | 2x faster key derivation |
| v2.7.0 | Memory-mapped database | 60% less memory for large vaults |
| v2.8.0 | Multi-threaded sync | 3x faster sync for large vaults |

---

*MF+SO — Multi Factor+ Sign On*
*by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner*
*The Sovereign Identity & Authentication Vault*

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
