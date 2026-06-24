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

# North Star Metric — What Drives Growth & Measurement Framework

## 1. Executive Summary

The North Star Metric is the single metric that best captures the core value a product delivers to customers. For MF+SO, the North Star Metric is **Authentications Performed via MF+SO**. This metric directly measures the core value proposition: users securely authenticating without passwords, without hardware tokens, without cloud dependency.

This document defines the North Star Metric, supporting metrics, measurement framework, and how these metrics drive product decisions.

### 1.1 North Star Definition

| Element | Definition |
|---------|-----------|
| **Metric** | Authentications Performed via MF+SO |
| **Why** | Each authentication = delivered value |
| **Granularity** | Per user, per day |
| **Leading indicator** | Active users, devices paired |
| **Lagging indicator** | Retention, credential count |

## 2. Metric Hierarchy

### 2.1 Metric Tree

```
North Star: Authentications Performed via MF+SO
    │
    ├── Adoption Metrics
    │   ├── Vaults created
    │   ├── Credentials stored
    │   └── Devices paired
    │
    ├── Engagement Metrics
    │   ├── Daily Active Users (DAU)
    │   ├── Authentications per user
    │   └── Sync frequency
    │
    ├── Retention Metrics
    │   ├── Day 7 retention
    │   ├── Day 30 retention
    │   └── Day 90 retention
    │
    └── Quality Metrics
        ├── Authentication success rate
        ├── Sync success rate
        └── Error rate
```

### 2.2 Supporting Metrics

| Metric | Definition | Why It Matters |
|--------|-----------|---------------|
| DAU | Unique users authenticating daily | Core engagement |
| WAU | Unique users authenticating weekly | Regular usage |
| MAU | Unique users authenticating monthly | Active base |
| Auths per user | Average daily authentications | Value depth |
| Credential count | Credentials per vault | Stickiness |
| Device count | Paired devices per user | Ecosystem |
| Retention | Users returning after N days | Long-term value |

## 3. Measurement Framework

### 3.1 Data Collection

| Data Point | Collection Method | Privacy |
|-----------|------------------|---------|
| Authentication count | Local event counter | Anonymized |
| Active users | Aggregated, no identity | Anonymized |
| Device count | Local metadata | Anonymized |
| Error rates | Client-side logging | Anonymized |

### 3.2 Privacy-Preserving Analytics

MF+SO collects metrics without compromising privacy:

- No user IDs in analytics
- Aggregated counts only
- Differential privacy techniques
- Opt-out available
- Open source analytics code

## 4. Growth Drivers

### 4.1 Activation

| Action | Definition | Target |
|--------|-----------|--------|
| Install | Visit MF+SO PWA | First visit |
| Create vault | Complete onboarding | Day 0 |
| Store credential | Add first credential | Day 0 |
| Pair device | Connect second device | Week 1 |
| Authenticate | Use MF+SO for login | Day 0 |

### 4.2 Retention

| Period | Target Retention | Key Drivers |
|--------|-----------------|-------------|
| Day 1 | 80% | Successful first auth |
| Day 7 | 60% | Credential usefulness |
| Day 30 | 50% | Habit formation |
| Day 90 | 40% | Multi-device value |

### 4.3 Referral

| Channel | Method | Expected Virality |
|---------|--------|------------------|
| Word of mouth | User recommendation | K-factor > 1.0 |
| Open source | Developer adoption | Organic |
| Enterprise | Organizational deployment | High value |

## 5. Targets

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| MAU | 1,000 | 10,000 | 100,000 |
| DAU/MAU | 30% | 40% | 50% |
| Auths/user/day | 3 | 5 | 8 |
| Credentials/user | 20 | 50 | 100 |
| Device pairs/user | 1.5 | 2 | 2.5 |
| Day 30 retention | 50% | 60% | 70% |

---

*MF+SO — Multi Factor+ Sign On*
*by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner*
*The Sovereign Identity & Authentication Vault*
