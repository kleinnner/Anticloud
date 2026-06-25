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

# Enterprise Upgrade Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Upgrade Planning](#upgrade-planning)
3. [Version Compatibility](#version-compatibility)
4. [Migration Procedures](#migration-procedures)
5. [Rollback Procedures](#rollback-procedures)
6. [Zero-Downtime Updates](#zero-downtime-updates)
7. [Post-Upgrade Verification](#post-upgrade-verification)

## Introduction

This guide covers upgrade procedures for MF+SO Enterprise deployments. Whether you're applying a patch update, performing a major version migration, or updating individual components, this document provides the procedures to ensure safe, reliable upgrades.

## Upgrade Planning

### Upgrade Types

| Type | Version Change | Risk Level | Downtime | Frequency |
|------|---------------|------------|----------|-----------|
| Patch | X.X.1 → X.X.2 | Low | None (rolling) | Monthly |
| Minor | X.1.X → X.2.X | Medium | Minimal | Quarterly |
| Major | 1.X.X → 2.X.X | High | Planned | Annually |
| Security | Emergency patch | High | None (if possible) | As needed |
| Hotfix | Customer-specific | Medium | Minimal | As needed |

### Pre-Upgrade Checklist

- [ ] Review release notes and breaking changes
- [ ] Verify current version and compatibility
- [ ] Check system requirements for new version
- [ ] Take full backup of database and configuration
- [ ] Take .aioss ledger snapshot
- [ ] Notify users of planned maintenance window
- [ ] Schedule upgrade during low-usage period
- [ ] Prepare rollback plan
- [ ] Verify staging environment matches production
- [ ] Test upgrade in staging environment

## Version Compatibility

### Supported Upgrade Paths

| Current Version | Target Version | Direct Upgrade? | Intermediate Steps |
|----------------|---------------|-----------------|-------------------|
| 1.0.x | 1.1.x | Yes | None |
| 1.0.x | 1.2.x | Yes | None |
| 1.0.x | 2.0.x | No | Must upgrade to 1.2.x first |
| 1.1.x | 1.2.x | Yes | None |
| 1.1.x | 2.0.x | No | Must upgrade to 1.2.x first |
| 1.2.x | 2.0.x | Yes | None |

### Component Version Matrix

| MF+SO Version | Database | Cache | HSM Firmware | Kubernetes | Docker |
|---------------|----------|-------|-------------|------------|--------|
| 1.0.x | PostgreSQL 14 | Redis 6.x | 2.0+ | 1.24+ | 20+ |
| 1.1.x | PostgreSQL 14-15 | Redis 6-7 | 2.1+ | 1.25+ | 20+ |
| 1.2.x | PostgreSQL 14-15 | Redis 6-7 | 2.2+ | 1.26+ | 24+ |
| 2.0.x | PostgreSQL 15-16 | Redis 7+ | 3.0+ | 1.28+ | 24+ |

## Migration Procedures

### Patch Upgrade (Rolling)

For patch updates within the same minor version:

#### Kubernetes Deployment

```bash
# 1. Update Helm repository
helm repo update

# 2. Review changes
helm diff upgrade mfso-enterprise mfso-enterprise/mfso -f values.yaml

# 3. Apply upgrade with rolling update
helm upgrade mfso-enterprise mfso-enterprise/mfso \
  -f values.yaml \
  --namespace mfso \
  --set image.tag=x.x.x \
  --atomic \
  --timeout 10m

# 4. Monitor rollout
kubectl rollout status deployment/mfso-api -n mfso
kubectl rollout status deployment/mfso-auth -n mfso
kubectl rollout status deployment/mfso-vault -n mfso
```

#### Docker Compose Deployment

```bash
# 1. Backup current configuration
cp docker-compose.yml docker-compose.yml.backup

# 2. Pull new images
docker-compose pull

# 3. Upgrade with rolling restart
docker-compose up -d --no-deps --build api
sleep 30
docker-compose up -d --no-deps --build auth
sleep 30
docker-compose up -d --no-deps --build vault
sleep 30
docker-compose up -d --no-deps --build sync

# 4. Verify health
curl https://mfso.company.com/health
```

### Minor Version Upgrade

#### Pre-Upgrade Steps

```bash
# 1. Take full database backup
pg_dump -h localhost -U mfso -d mfso -F c -f mfso-backup-$(date +%Y%m%d).dump

# 2. Export configuration
kubectl get configmap mfso-config -n mfso -o yaml > mfso-config-backup.yaml

# 3. Take .aioss ledger snapshot
mfso-cli ledger snapshot --output ledger-snapshot-$(date +%Y%m%d).snap

# 4. Verify backup integrity
pg_restore -l mfso-backup-$(date +%Y%m%d).dump
```

#### Database Migration

```bash
# 1. Run database migrations (read-only mode first)
kubectl exec -n mfso deploy/mfso-migration -- ./migrate --dry-run

# 2. Apply migrations
kubectl exec -n mfso deploy/mfso-migration -- ./migrate up

# 3. Verify migration
kubectl exec -n mfso deploy/mfso-migration -- ./migrate version
```

## Rollback Procedures

### Rollback Triggers

Immediately rollback if:
- Upgrade takes longer than the maintenance window
- Health checks fail after upgrade
- Error rate exceeds 5% after upgrade
- Critical functionality is broken
- Performance degrades beyond acceptable thresholds

### Rollback Steps

#### Helm Rollback

```bash
# 1. List release history
helm history mfso-enterprise -n mfso

# 2. Rollback to previous version
helm rollback mfso-enterprise 1 -n mfso --wait --timeout 10m

# 3. Verify rollback
kubectl rollout status deployment/mfso-api -n mfso
curl https://mfso.company.com/health
```

#### Database Rollback

```bash
# 1. Drop and recreate database
dropdb mfso
createdb mfso

# 2. Restore from backup
pg_restore -h localhost -U mfso -d mfso -F c mfso-backup-$(date +%Y%m%d).dump

# 3. Verify database integrity
kubectl exec -n mfso deploy/mfso-migration -- ./migrate version
```

#### Configuration Rollback

```bash
# 1. Restore configmap
kubectl apply -f mfso-config-backup.yaml -n mfso

# 2. Restart affected services
kubectl rollout restart deployment -n mfso
```

## Zero-Downtime Updates

### Architecture

Zero-downtime updates leverage:
- **Rolling deployments**: Update pods one at a time
- **Blue-green deployment**: Run old and new versions simultaneously
- **Readiness probes**: Only route traffic to healthy instances
- **Session draining**: Existing sessions complete before pod termination

### Blue-Green Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mfso-api-green
spec:
  replicas: 5
  selector:
    matchLabels:
      app: mfso-api
      version: green
  template:
    metadata:
      labels:
        app: mfso-api
        version: green
    spec:
      containers:
      - name: api
        image: mfso/api:2.0.0
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5
---
# Service selects green version first, then switches to blue
apiVersion: v1
kind: Service
metadata:
  name: mfso-api
spec:
  selector:
    app: mfso-api
    version: green  # Switch to "blue" after verification
```

### Migration Process

```bash
# 1. Deploy green environment
kubectl apply -f deployment-green.yaml

# 2. Wait for green to be ready
kubectl rollout status deployment/mfso-api-green -n mfso

# 3. Run verification tests
./verify-green.sh

# 4. Switch traffic to green
kubectl patch service mfso-api -p '{"spec":{"selector":{"version":"green"}}}'

# 5. Keep blue running for rollback
# kubectl scale deployment mfso-api-blue --replicas=2

# 6. After verification period, remove blue
kubectl delete -f deployment-blue.yaml
```

## Post-Upgrade Verification

### Verification Checklist

- [ ] All services return healthy status
- [ ] Authentication flow works (login/logout)
- [ ] Vault operations work (read/write/sync)
- [ ] TOTP codes generate correctly
- [ ] .aioss ledger is operational
- [ ] Admin console accessible
- [ ] SIEM integration still functional
- [ ] API endpoints respond correctly
- [ ] Backup system operational
- [ ] Monitoring and alerting functional

### Verification Script

```bash
#!/bin/bash
# post-upgrade-verify.sh

echo "=== Post-Upgrade Verification ==="

# 1. Service health
echo "Checking service health..."
for service in api auth vault sync admin; do
  status=$(curl -s -o /dev/null -w "%{http_code}" https://mfso.company.com/health/$service)
  if [ "$status" == "200" ]; then
    echo "  ✅ $service healthy"
  else
    echo "  ❌ $service failed (HTTP $status)"
  fi
done

# 2. Authentication test
echo "Testing authentication..."
TOKEN=$(curl -s -X POST https://mfso.company.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test-user","password":"test-password"}' | jq -r '.token')

if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
  echo "  ✅ Authentication working"
else
  echo "  ❌ Authentication failed"
fi

# 3. Database connectivity
echo "Checking database..."
DB_STATUS=$(curl -s https://mfso.company.com/health/db | jq -r '.status')
if [ "$DB_STATUS" == "healthy" ]; then
  echo "  ✅ Database healthy"
else
  echo "  ❌ Database issue: $DB_STATUS"
fi

# 4. Ledger health
echo "Checking ledger..."
LEDGER_STATUS=$(curl -s https://mfso.company.com/health/ledger | jq -r '.status')
if [ "$LEDGER_STATUS" == "healthy" ]; then
  echo "  ✅ Ledger healthy"
else
  echo "  ❌ Ledger issue: $LEDGER_STATUS"
fi

echo "=== Verification Complete ==="
```

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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

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
