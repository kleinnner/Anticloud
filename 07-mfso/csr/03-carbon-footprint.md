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

# Carbon Footprint Analysis — Serverless, PWA vs Native & Efficiency Metrics

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | MFSO-CSR-CARBON-001 |
| **Version** | 1.0 |
| **Classification** | Public |
| **Effective Date** | 2026-01-01 |
| **Owner** | Sustainability Team |
| **Approved By** | Lois-Kleinner |

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Analysis Scope](#2-analysis-scope)
3. [Serverless Architecture Analysis](#3-serverless-architecture-analysis)
4. [PWA vs Native Application](#4-pwa-vs-native-application)
5. [Direct Carbon Comparison](#5-direct-carbon-comparison)
6. [Operational Efficiency Metrics](#6-operational-efficiency-metrics)
7. [Infrastructure Carbon Analysis](#7-infrastructure-carbon-analysis)
8. [User Device Impact](#8-user-device-impact)
9. [Lifecycle Assessment](#9-lifecycle-assessment)
10. [Year-over-Year Projections](#10-year-over-year-projections)
11. [Offset Strategy](#11-offset-strategy)
12. [Appendices](#12-appendices)

## 1. Executive Summary

This document provides a comprehensive carbon footprint analysis of the MF+SO platform, comparing its environmental impact against alternative authentication solutions. The analysis covers serverless architecture benefits, the PWA vs native application comparison, and detailed efficiency metrics.

MF+SO's architectural choices — local-first processing, PWA delivery, minimal server infrastructure, and efficient protocols — result in a significantly lower carbon footprint compared to traditional authentication solutions. Our analysis shows an estimated 90-95% reduction in operational carbon emissions compared to cloud-dependent authentication services.

### 1.1 Key Findings

| Metric | MF+SO | Traditional Auth | Reduction |
|--------|-------|-----------------|-----------|
| Infrastructure energy (kWh/user/year) | < 0.1 | 0.5 - 5.0 | > 90% |
| Device energy overhead (mWh/operation) | < 5 | 10 - 50 | > 75% |
| Data transfer (KB/operation) | < 0.2 | 1 - 10 | > 90% |
| Hardware manufacturing (kg CO2e/user) | 0 | 0.5 - 5.0 | 100% |
| E-waste (g/user/year) | 0 | 5 - 50 | 100% |

## 2. Analysis Scope

### 2.1 System Boundary

The analysis covers the full lifecycle of MF+SO including:

- **Development**: Code compilation, testing, CI/CD
- **Distribution**: PWA delivery via CDN
- **Operation**: Relay server, user device processing
- **End-of-life**: No physical product disposal

Excluded from analysis (identical across scenarios):
- User device base energy consumption
- Network infrastructure overhead (shared)
- Office/workspace energy

### 2.2 Comparison Scenarios

| Scenario | Description | Baseline |
|----------|-------------|----------|
| MF+SO | PWA, local-first, minimal relay | Current |
| Cloud Auth Server | Traditional centralized auth server | Industry baseline |
| Hardware Token | YubiKey + cloud management service | Alternative |
| Native App | Mobile authentication app (App Store) | Alternative |

### 2.3 Methodology

- Software Carbon Intensity (SCI) specification (Green Software Foundation)
- GHG Protocol Scope 1, 2, 3 accounting
- Lifecycle Assessment (LCA) per ISO 14040/14044
- Data from cloud provider sustainability reports
- Device energy data from published research

## 3. Serverless Architecture Analysis

### 3.1 Carbon Comparison: Server Patterns

| Pattern | Idle Energy | Active Energy | Carbon per Request | Scalability |
|---------|-------------|---------------|-------------------|-------------|
| Always-on server | 20-100W continuous | +50% under load | High per request | Limited |
| Auto-scaling | Near-zero idle | Proportional | Low per request | Good |
| Serverless/FaaS | Zero idle | Pay-per-use | Lowest at low volume | Excellent |
| MF+SO Relay | Near-zero (auto-scale) | Minimal (stateless) | Lowest | Excellent |

### 3.2 MF+SO Relay vs Traditional Auth Server

| Aspect | MF+SO Relay | Traditional Auth Server |
|--------|-------------|----------------------|
| Instance count | 2-6 (multi-region) | 10-100+ |
| Instance size | Small (2 vCPU, 4GB) | Medium-Large (8-32 vCPU) |
| Idle utilization | Near-zero (auto-scale) | 10-30% (always on) |
| Storage | None (stateless) | Database (always on) |
| Cache | None needed | Redis/memcached |
| Annual energy (est.) | 1,000 - 5,000 kWh | 50,000 - 500,000 kWh |

### 3.3 Carbon Savings from Stateless Design

- No database servers (eliminates always-on storage energy)
- No cache infrastructure
- No backup storage (user-managed)
- No disaster recovery infrastructure (stateless = auto-recover)
- No staging environment (PWA testing on user devices)

## 4. PWA vs Native Application

### 4.1 Distribution Carbon Impact

| Aspect | PWA | Native App (App Store) |
|--------|-----|----------------------|
| Download size | < 200 KB initial, < 100 KB update | 5-50 MB initial, 5-20 MB update |
| CDN energy per download | < 0.001 kWh | 0.01-0.1 kWh |
| App store distribution | Not required | Store infrastructure energy |
| Update mechanism | Service worker (delta) | Full app download |
| Installation energy | Negligible (browser cache) | Significant (download + install) |
| **Total per user (first year)** | **< 0.01 kWh** | **0.05-0.5 kWh** |

### 4.2 Runtime Energy Comparison

| Operation | PWA (MF+SO) | Native App | Difference |
|-----------|-------------|------------|------------|
| Idle (background) | < 1 mW | 1-5 mW | PWA lower |
| Authentication | 5-15 mW | 10-30 mW | PWA lower |
| Data sync | 10-50 mW | 20-100 mW | PWA lower |
| UI rendering | Browser optimized | App-specific | Comparable |

### 4.3 Memory Comparison

| State | PWA | Native App |
|-------|-----|------------|
| Idle | < 5 MB | 20-50 MB |
| Active | < 30 MB | 50-150 MB |

## 5. Direct Carbon Comparison

### 5.1 Operational Carbon (per user per year)

| Component | MF+SO | Cloud Auth | Hardware Token | Native App |
|-----------|-------|------------|----------------|------------|
| Server infrastructure | 0.005-0.02 | 0.5-5.0 | 0.1-1.0 | 0.1-0.5 |
| CDN/Distribution | 0.001-0.005 | 0.001-0.01 | 0.001-0.01 | 0.01-0.1 |
| User device (additional) | 0.01-0.05 | 0.01-0.05 | 0.01-0.05 | 0.02-0.1 |
| Hardware manufacturing | 0 | 0 | 5-20 (one-time) | 0 |
| Hardware shipping | 0 | 0 | 0.5-2 | 0 |
| E-waste processing | 0 | 0 | 0.1-0.5 | 0 |
| **Total (kg CO2e/user/year)** | **0.02-0.08** | **0.5-5.0** | **5.7-23.5 (yr 1)** | **0.13-0.7** |

### 5.2 Per-Operation Carbon

| Operation | MF+SO (mg CO2e) | Cloud Auth (mg CO2e) |
|-----------|-----------------|---------------------|
| Authentication | 0.1-0.5 | 5-50 |
| Credential retrieval | 0.05-0.2 | 2-20 |
| Vault unlock | 0.01-0.05 | N/A (local) |
| Sync (per credential) | 0.1-0.5 | N/A |

## 6. Operational Efficiency Metrics

### 6.1 Energy Proportionality

| Load (req/s) | MF+SO Energy (W) | Traditional Energy (W) | Efficiency Ratio |
|-------------|------------------|----------------------|-----------------|
| 0 (idle) | < 1% of peak | 30-50% of peak | 50:1 |
| 10 | 5% of peak | 40-60% of peak | 10:1 |
| 100 | 25% of peak | 60-80% of peak | 3:1 |
| 1000 | 80% of peak | 90-100% of peak | 1.2:1 |

### 6.2 Carbon per Transaction

| Transaction Count | MF+SO (g CO2e) | Traditional (g CO2e) |
|------------------|---------------|---------------------|
| 100 | 0.01-0.05 | 1-10 |
| 1,000 | 0.1-0.5 | 10-100 |
| 10,000 | 1-5 | 100-500 |
| 100,000 | 10-50 | 500-2000 |

## 7. Infrastructure Carbon Analysis

### 7.1 Cloud Provider Carbon Data

| Provider | Region | Carbon Intensity | Renewable % | MF+SO Usage |
|----------|--------|-----------------|-------------|-------------|
| Cloud A | US East | 400 gCO2e/kWh | 50% | Primary |
| Cloud B | EU West | 250 gCO2e/kWh | 75% | Primary |
| Cloud A | AP Southeast | 500 gCO2e/kWh | 30% | Secondary |

### 7.2 Infrastructure Optimization Impact

| Optimization | Carbon Reduction | Status |
|-------------|-----------------|--------|
| ARM-based instances | 30% reduction | Implemented |
| Carbon-aware routing | 20% reduction | Planned |
| Spot/preemptible | 40% cost reduction | Planned |
| Right-sizing | 20% reduction | Continuous |

## 8. User Device Impact

### 8.1 Device Type Analysis

| Device | Idle Power | MF+SO Additional | Percentage |
|--------|-----------|-----------------|------------|
| iPhone 15 | 50 mW | 2-10 mW | 4-20% |
| Samsung Galaxy S24 | 45 mW | 2-10 mW | 4-22% |
| MacBook Air M3 | 500 mW | 5-20 mW | 1-4% |
| ThinkPad X1 Carbon | 600 mW | 5-20 mW | 0.8-3.3% |
| Desktop PC | 5000 mW | 10-50 mW | 0.2-1% |

### 8.2 Annual Device Energy Impact

| Frequency of Use | Annual Additional Energy | Annual Additional Carbon |
|-----------------|------------------------|------------------------|
| Light (5 unlocks/day) | 0.01-0.05 kWh | 0.005-0.025 kg CO2e |
| Medium (20 unlocks/day) | 0.05-0.2 kWh | 0.025-0.1 kg CO2e |
| Heavy (50+ unlocks/day) | 0.1-0.5 kWh | 0.05-0.25 kg CO2e |

## 9. Lifecycle Assessment

### 9.1 Cradle-to-Grave Comparison

| Phase | MF+SO | Hardware Token |
|-------|-------|---------------|
| Raw materials | 0 kg CO2e | 0.5-2 kg CO2e |
| Manufacturing | 0 kg CO2e | 3-15 kg CO2e |
| Distribution | < 0.001 kg CO2e | 0.5-2 kg CO2e |
| Use (5 years) | 0.1-0.4 kg CO2e | 0.5-5 kg CO2e |
| End-of-life | 0 kg CO2e | 0.1-0.5 kg CO2e |
| **Total (5 years)** | **0.1-0.4 kg CO2e** | **4.6-24.5 kg CO2e** |

### 9.2 Break-Even Analysis

MF+SO's lower carbon footprint begins immediately — there is no manufacturing carbon debt to repay. In comparison:

- A hardware token requires 1-5 years of use to offset manufacturing emissions
- A native app requires 3-6 months to offset app store distribution

## 10. Year-over-Year Projections

### 10.1 Carbon Footprint Growth

| Year | Users | Total Carbon (tCO2e) | Per-User Carbon (kg CO2e) |
|------|-------|---------------------|--------------------------|
| 2026 | 1,000 | 0.03 | 0.03 |
| 2027 | 10,000 | 0.25 | 0.025 |
| 2028 | 100,000 | 2.0 | 0.02 |
| 2029 | 1,000,000 | 15.0 | 0.015 |

### 10.2 Efficiency Improvements

| Year | Efficiency Gain | Cumulative Improvement |
|------|----------------|----------------------|
| 2026 | 10% | 10% |
| 2027 | 15% | 25% |
| 2028 | 10% | 35% |

## 11. Offset Strategy

### 11.1 Carbon Offset Portfolio

| Offset Type | Percentage | Verification |
|-------------|-----------|--------------|
| Reforestation | 40% | Verified Carbon Standard |
| Renewable energy | 40% | Gold Standard |
| Community projects | 20% | Gold Standard |

### 11.2 Offset Projections

| Year | Carbon to Offset | Offset Cost (est.) |
|------|-----------------|-------------------|
| 2026 | 0.03 tCO2e | $1-3 |
| 2027 | 0.25 tCO2e | $5-15 |
| 2028 | 2.0 tCO2e | $40-120 |

## 12. Appendices

### Appendix A: Calculation Assumptions

| Assumption | Value | Source |
|-----------|-------|--------|
| Grid carbon intensity (avg) | 475 gCO2e/kWh | IEA 2024 |
| Cloud server PUE | 1.2 | Industry average |
| Smartphone battery | 15 Wh | Typical |
| Laptop battery | 50 Wh | Typical |
| Service life (hardware) | 5 years | Manufacturer estimate |
| App store CDN energy | 0.1 kWh/GB | CDN provider data |

### Appendix B: Version History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 0.1 | 2025-10-01 | Sustainability Team | Initial draft |
| 1.0 | 2026-01-01 | Sustainability Team | First approved version |

---

*MF+SO — Multi Factor+ Sign On*
*by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner*
*The Sovereign Identity & Authentication Vault*
