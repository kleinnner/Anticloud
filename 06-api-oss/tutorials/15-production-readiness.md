---
title: "Tutorial 15: Production Readiness"
sidebar_position: 15
description: "Apply production hardening to your API-OSS deployment."
tags: [tutorials]
---

# Tutorial 15: Production Readiness

## Objective

Apply production hardening to your API-OSS deployment.

## Prerequisites

- API-OSS running from previous tutorials
- All previous tutorials completed (recommended)

## Step 1: Security Audit

Run a comprehensive security check:

```bash
# TLS check
curl https://www.ssllabs.com/ssltest/analyze.html?d=api.example.com

# Security headers
curl -I https://api.example.com | grep -i "strict-transport\|x-content\|x-frame"
```

## Step 2: Apply Security Headers

```bash
curl -X PUT http://localhost:8080/api/v1/config \
  -H "X-Admin-Key: pass" \
  -H "Content-Type: application/json" \
  -d '{
    "security": {
      "headers": {
        "strict_transport_security": "max-age=63072000; includeSubDomains; preload",
        "content_security_policy": "default-src '\''self'\''",
        "x_content_type_options": "nosniff",
        "x_frame_options": "DENY",
        "x_xss_protection": "1; mode=block",
        "referrer_policy": "strict-origin-when-cross-origin"
      }
    }
  }'
```

## Step 3: Enable Audit Logging

```bash
curl -X PUT http://localhost:8080/api/v1/config \
  -H "X-Admin-Key: pass" \
  -H "Content-Type: application/json" \
  -d '{
    "audit": {
      "enabled": true,
      "include_reads": false,
      "retention_days": 365,
      "integrity": {
        "enabled": true,
        "chain_hashes": true
      }
    }
  }'
```

## Step 4: Configure Backups

```bash
# Schedule daily backup
curl -X POST http://localhost:8080/api/v1/backups/schedule \
  -H "X-Admin-Key: pass" \
  -H "Content-Type: application/json" \
  -d '{
    "schedule": "0 2 * * *",
    "retention_days": 30,
    "include_config": true,
    "include_routes": true
  }'
```

## Step 5: Set Up Resource Limits

```bash
curl -X PUT http://localhost:8080/api/v1/config \
  -H "X-Admin-Key: pass" \
  -H "Content-Type: application/json" \
  -d '{
    "rate_limit": {
      "default": 1000,
      "per_ip": {
        "enabled": true,
        "default": 200
      },
      "per_key": {
        "enabled": true,
        "default": 100
      }
    },
    "gateway": {
      "max_connections": 10000,
      "per_ip_connections": 50,
      "max_request_size": "10MB"
    }
  }'
```

## Step 6: Configure Monitoring Stack

```bash
# Deploy Prometheus + Grafana (see deployment guide)
docker compose -f docker-compose.monitoring.yml up -d

# Verify metrics endpoint
curl http://localhost:9090/api/v1/query?query=up{job="apioss"}
```

## Step 7: Run Load Test

```bash
# Install k6
# Create test script
cat > load-test.js << 'SCRIPT'
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 0 },
  ],
};

export default function () {
  let res = http.get('https://api.example.com/health');
  check(res, { 'status is 200': (r) => r.status === 200 });
}
SCRIPT

k6 run load-test.js
```

## Step 8: Review Production Checklist

```markdown
- [x] Admin password changed from default
- [x] MFA enabled for admin accounts
- [x] TLS configured (Let's Encrypt or internal CA)
- [x] Security headers configured
- [x] Rate limiting enabled globally
- [x] Audit logging enabled with integrity
- [x] Backups configured and tested
- [x] Monitoring stack deployed
- [x] Load testing completed
- [ ] Incident response plan documented
- [ ] Disaster recovery plan tested
- [ ] Runbook for common scenarios
```

## What You Learned

- Security hardening
- Audit logging with integrity
- Backup scheduling
- Resource limits and rate limiting
- Monitoring stack setup
- Load testing
- Production readiness checklist

## Course Complete!

You've completed the API-OSS tutorial series. You now know how to:

1. Deploy and configure API-OSS
2. Secure it with auth and rate limiting
3. Connect databases and LLMs
4. Build workflows and plugins
5. Set up monitoring and alerts
6. Deploy across regions
7. Implement CI/CD
8. Harden for production

Refer to the full documentation for deeper dives into each topic.

## See Also

Related tutorials, cookbooks, and API reference documentation.

- [User Manual](../user-manual/01-getting-started.md)
- [Code Cookbooks](../code-cookbooks/01-getting-started.md)
- [Developer Guides](../developer-guides/01-why-build-on-apioss.md)
- [API Reference](../api-reference/01-overview.md)

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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
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
