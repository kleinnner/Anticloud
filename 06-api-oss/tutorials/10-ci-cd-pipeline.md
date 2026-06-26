---
title: "Tutorial 10: CI/CD Pipeline"
sidebar_position: 10
description: "Automate API-OSS configuration deployments with GitHub Actions."
tags: [tutorials]
---

# Tutorial 10: CI/CD Pipeline

## Objective

Automate API-OSS configuration deployments with GitHub Actions.

## Prerequisites

- GitHub repository
- API-OSS instance (staging + production)

## Step 1: Create Repository Structure

```
apioss-config/
├── routes/
│   ├── staging.yaml
│   └── production.yaml
├── plugins/
│   └── custom-plugin/
├── .github/
│   └── workflows/
│       └── deploy.yml
└── tests/
    └── smoke.sh
```

## Step 2: Create Route Config

```yaml
# routes/production.yaml
routes:
  - path: /v1/chat
    upstream: http://llm-service:8080
    methods: [POST]
    rate_limit: 1000
    auth_required: true

  - path: /v1/embeddings
    upstream: http://embedding-service:8080
    methods: [POST]
    rate_limit: 5000

  - path: /health
    upstream: internal
    methods: [GET]
    rate_limit: 10000
```

## Step 3: Create Smoke Tests

```bash
#!/bin/bash
# tests/smoke.sh

echo "Running smoke tests..."

# Test health
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $APIOSS_URL/health)
if [ "$STATUS" != "200" ]; then
  echo "FAIL: Health check returned $STATUS"
  exit 1
fi
echo "PASS: Health check"

# Test auth required route
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $APIOSS_URL/v1/chat)
if [ "$STATUS" != "401" ]; then
  echo "FAIL: Auth check returned $STATUS"
  exit 1
fi
echo "PASS: Auth required"

echo "All tests passed!"
```

## Step 4: Create GitHub Action

```yaml
# .github/workflows/deploy.yml
name: Deploy API-OSS Config
on:
  push:
    branches: [main]
    paths:
      - 'routes/**'
      - 'plugins/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate config
        run: |
          curl -s -X POST "${{ secrets.APIOSS_URL_STAGING }}/api/v1/routes/validate" \
            -H "X-Admin-Key: ${{ secrets.APIOSS_ADMIN_KEY }}" \
            -d @routes/staging.yaml

  deploy-staging:
    needs: validate
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to staging
        run: |
          curl -s -X POST "${{ secrets.APIOSS_URL_STAGING }}/api/v1/routes/import" \
            -H "X-Admin-Key: ${{ secrets.APIOSS_ADMIN_KEY }}" \
            -d @routes/staging.yaml

      - name: Smoke test
        run: |
          export APIOSS_URL=${{ secrets.APIOSS_URL_STAGING }}
          bash tests/smoke.sh

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to production
        run: |
          curl -s -X POST "${{ secrets.APIOSS_URL }}/api/v1/routes/import" \
            -H "X-Admin-Key: ${{ secrets.APIOSS_ADMIN_KEY }}" \
            -d @routes/production.yaml

      - name: Smoke test
        run: |
          export APIOSS_URL=${{ secrets.APIOSS_URL }}
          bash tests/smoke.sh
```

## Step 5: Configure GitHub Secrets

```
Settings → Secrets → Actions

APIOSS_URL: https://api.example.com
APIOSS_URL_STAGING: https://staging.example.com
APIOSS_ADMIN_KEY: api_adm_abc123...
```

## Step 6: Test the Pipeline

```bash
# Push a change
git add routes/production.yaml
git commit -m "Update rate limits for chat endpoint"
git push origin main
```

The pipeline will automatically validate, deploy to staging, test, then deploy to production.

## What You Learned

- Route configuration files
- Smoke test scripts
- GitHub Actions workflow
- Multi-environment deployment
- Automated validation and testing

## Next Tutorial

→ [11: Custom Model Provider](11-custom-model.md)

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
!  As seen on:                                                       !
!  Harvard Dataverse ! Zenodo/CERN ! Academia.edu ! HuggingFace      !
!  anticloud.telepedia.net ! anticloud.fandom.com                    !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Bluesky ! Mastodon                           !
!  Internet Archive ! ORCID ! Figshare                               !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com