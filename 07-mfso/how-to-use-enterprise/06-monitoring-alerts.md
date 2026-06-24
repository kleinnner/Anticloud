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

# Enterprise Monitoring and Alerts

## Table of Contents

1. [Introduction](#introduction)
2. [Monitoring Architecture](#monitoring-architecture)
3. [Health Checks](#health-checks)
4. [Metrics Collection](#metrics-collection)
5. [Alerting Configuration](#alerting-configuration)
6. [SIEM Integration](#siem-integration)
7. [Dashboards](#dashboards)
8. [Proactive Monitoring](#proactive-monitoring)

## Introduction

MF+SO Enterprise provides comprehensive monitoring and alerting capabilities to ensure service health, security, and compliance. The monitoring system collects metrics from all components, performs health checks, and integrates with enterprise monitoring solutions.

## Monitoring Architecture

### Component Overview

```
┌──────────────────────────────────────────────────────┐
│                   Monitoring Stack                     │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐  │
│  │ Health   │  │ Metrics  │  │ Alerting           │  │
│  │ Checks   │  │ Collector│  │ Engine             │  │
│  └──────────┘  └──────────┘  └────────────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐  │
│  │ Log      │  │ Tracing  │  │ .aioss Ledger      │  │
│  │ Collector│  │ System   │  │ Monitor            │  │
│  └──────────┘  └──────────┘  └────────────────────┘  │
└──────────────────────────────────────────────────────┘
           │              │                │
           ▼              ▼                ▼
┌─────────────┐ ┌─────────────┐ ┌──────────────────┐
│ SIEM        │ │ Dashboard  │ │ PagerDuty/OpsGenie│
│ Integration │ │ (Grafana)  │ │                  │
└─────────────┘ └─────────────┘ └──────────────────┘
```

## Health Checks

### Service Health Endpoints

| Service | Endpoint | Expected Response |
|---------|----------|-------------------|
| API Gateway | /health | 200 OK |
| Authentication Service | /health/ready | {"status": "healthy"} |
| Vault Service | /health/ready | {"status": "healthy"} |
| Metadata Database | /health/db | {"status": "healthy", "lag": "0s"} |
| Cache | /health/cache | {"status": "healthy", "hit_rate": 0.95} |
| .aioss Node | /health/ledger | {"status": "healthy", "height": 12345} |

### Health Check Configuration

```yaml
health_checks:
  interval: 30s
  timeout: 5s
  failure_threshold: 3
  recovery_threshold: 2
  
  services:
    - name: authentication
      endpoint: /health/ready
      expected_status: 200
      expected_body: "healthy"
      critical: true
      
    - name: database
      endpoint: /health/db
      expected_status: 200
      critical: true
      dependencies: [authentication, vault]
```

## Metrics Collection

### Exposed Metrics

Metrics are exposed in Prometheus format at `/metrics` on each service.

### Key Metrics

| Metric | Type | Description |
|--------|------|-------------|
| mfso_requests_total | Counter | Total API requests |
| mfso_request_duration_seconds | Histogram | Request latency |
| mfso_authentication_attempts_total | Counter | Authentication attempts |
| mfso_authentication_success_rate | Gauge | Authentication success rate |
| mfso_vault_operations_total | Counter | Vault operations |
| mfso_active_sessions | Gauge | Current active sessions |
| mfso_database_connections | Gauge | Active database connections |
| mfso_cache_hit_ratio | Gauge | Cache hit ratio |
| mfso_ledger_height | Gauge | Current ledger block height |

## Alerting Configuration

### Built-in Alerts

| Alert | Condition | Severity | Response |
|-------|-----------|----------|----------|
| Service Down | Health check fails > 3 times | Critical | Page on-call engineer |
| High Error Rate | Errors > 5% of requests in 5 min | Critical | Page on-call engineer |
| High Latency | P95 latency > 500ms in 5 min | Warning | Investigate during business hours |
| Database Replication Lag | Lag > 30 seconds | Warning | Investigate |
| Cache Hit Rate Drop | Hit rate < 80% in 5 min | Warning | Investigate |
| Certificate Expiring | Cert expires in < 30 days | Warning | Renew certificate |
| Rate Limit Approach | 80% of rate limit reached | Warning | Review capacity |

### Custom Alert Rules

Create custom alerts in Admin Console → Monitoring → Alerts:

```json
{
  "name": "Suspicious Login Pattern",
  "description": "Alert when a user has >10 failed logins in 5 minutes",
  "condition": {
    "metric": "mfso_authentication_failures_total",
    "aggregation": "sum",
    "window": "5m",
    "threshold": 10,
    "operator": ">",
    "filter": {
      "user": "*"
    }
  },
  "severity": "warning",
  "actions": [
    {
      "type": "webhook",
      "url": "https://hooks.slack.com/services/T...",
      "template": "Suspicious login pattern detected for user {{.user}}"
    }
  ],
  "cooldown": "15m"
}
```

## SIEM Integration

### Supported Integration Formats

| Format | Description | Example Tools |
|--------|-------------|--------------|
| CEF | Common Event Format | ArcSight, QRadar |
| LEEF | Log Event Extended Format | IBM QRadar |
| JSON | Structured JSON | Splunk, ELK, Datadog |
| Syslog | RFC 5424 | All SIEM platforms |

### Splunk Integration

1. Admin Console → Monitoring → SIEM → Add Integration
2. Select Splunk
3. Configure:

```json
{
  "splunk": {
    "hec_url": "https://splunk.company.com:8088/services/collector",
    "hec_token": "YOUR-HEC-TOKEN",
    "index": "mfso_audit",
    "source_type": "mfso:audit:json",
    "ssl_verify": true,
    "batch_size": 100,
    "flush_interval": 5
  }
}
```

## Dashboards

### Built-in Dashboards (Grafana)

MF+SO provides pre-built Grafana dashboards:

| Dashboard | Description |
|-----------|-------------|
| Service Overview | All service health, request rates, error rates |
| Authentication | Auth attempt rates, success rates, latency |
| Vault Operations | Vault read/write rates, storage usage |
| User Activity | Active users, sessions, MFA enrollment |
| Security Events | Failed logins, lockouts, suspicious activity |
| .aioss Ledger | Ledger health, consensus status, entry rates |

### Sample Dashboard Panels

#### Service Health Panel

```json
{
  "title": "Service Health",
  "type": "stat",
  "targets": [
    {
      "expr": "up{job='mfso-authentication'}",
      "legendFormat": "Authentication"
    },
    {
      "expr": "up{job='mfso-vault'}",
      "legendFormat": "Vault"
    }
  ]
}
```

## Proactive Monitoring

### Predictive Alerting

MF+SO uses machine learning to detect anomalies:

| Detection Type | Description | Example |
|---------------|-------------|---------|
| Traffic anomaly | Unusual traffic patterns | Sudden spike in login attempts |
| User behavior | Behavioral deviation | User logging in from new country |
| Capacity prediction | Resource exhaustion forecast | Storage reaching 80% in 7 days |
| Performance regression | Gradual performance decline | Slowly increasing latency |

### Capacity Monitoring

| Metric | Warning Threshold | Critical Threshold | Lead Time |
|--------|-------------------|-------------------|-----------|
| Storage | 70% | 85% | 30 days |
| Memory | 75% | 90% | 14 days |
| CPU | 70% | 85% | 14 days |
| Database connections | 70% | 85% | 7 days |
| API rate limit | 70% | 85% | 30 days |

### Scheduled Health Tests

| Test | Frequency | Description |
|------|-----------|-------------|
| Authentication flow | Every 5 minutes | Automated test login |
| Vault CRUD | Every 15 minutes | Create, read, update, delete test |
| Sync test | Every 30 minutes | Test cross-device sync |
| Ledger consensus | Every hour | Verify ledger node agreement |
| Backup restore test | Daily | Test backup restoration |
| Failover test | Weekly | Test automatic failover |

---

*MF+SO — Multi Factor+ Sign On*
*by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner*
*The Sovereign Identity & Authentication Vault*
