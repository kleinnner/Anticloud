---
title: "Glossary 20: Monitoring Glossary"
sidebar_position: 20
description: "Documentation for Glossary 20: Monitoring Glossary"
tags: [glossary]
---

# Glossary 20: Monitoring Glossary

## Terms

### Metrics
- Numerical measurements of system performance
- API-OSS exports Prometheus-compatible metrics

### Prometheus
- Open-source monitoring and alerting toolkit
- API-OSS exposes metrics at `/metrics` endpoint

### Grafana
- Metrics visualization and dashboard platform
- API-OSS provides pre-built Grafana dashboard

### Logs
- Time-stamped records of system events
- API-OSS supports: file, syslog, stdout, JSON format

### Log Level
- Severity threshold for log output
- Levels: error, warn, info, debug, trace

### Health Check Endpoint
- HTTP endpoint checking service status
- `GET /health` returns 200 if healthy

### Readiness Probe
- Checks if service is ready to accept traffic
- Used by orchestrators (K8s) for rolling updates

### Liveness Probe
- Checks if service is still running
- Restarts service if probe fails

### Alert
- Notification triggered by metric threshold breach
- API-OSS supports: email, webhook, Slack, PagerDuty

### Alert Rule
- Condition that triggers an alert
- Example: `cpu_usage > 90% for 5 minutes` → alert

### Dashboard
- Visual display of key metrics
- API-OSS provides dashboards for: system, models, users, search

### Latency
- Time to process a request
- API-OSS monitors: p50, p95, p99 latency per endpoint

### Throughput
- Requests processed per unit time
- Measured in: queries per second (QPS), requests per minute (RPM)

### Error Rate
- Percentage of requests resulting in errors
- Target: <0.1% for production

### Resource Usage
- Consumption of system resources
- Tracked: CPU, RAM, GPU, disk, network

### Telemetry
- Automated data collection from running instances
- API-OSS supports opt-in telemetry for improvement

## See Also

Related glossary and reference documentation.

- [Glossary Index](../glossary/01-index.md)
- [Terminology](../glossary/02-core-concepts.md)
- [API Reference](../api-reference/01-overview.md)
- [Reference Guide](../reference/01-reference-overview.md)
