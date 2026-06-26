---
title: "Spec Documentation"
sidebar_position: 1
description: "Technical specifications for the API-OSS platform."
---

# API-OSS Swagger UI

## Overview

Interactive API documentation powered by Swagger UI.

## Quick Start

```bash
docker run -p 8080:8080 \
  -v $(pwd)/docs/spec:/spec \
  swaggerapi/swagger-ui
```

Open http://localhost:8080 to explore the API.

## Docker Compose

```yaml
version: "3.8"
services:
  swagger-ui:
    image: swaggerapi/swagger-ui
    ports:
      - "8080:8080"
    environment:
      SWAGGER_JSON: /spec/openapi.yaml
    volumes:
      - ./docs/spec:/spec
```

## Running Alongside API-OSS

```yaml
version: "3.8"
services:
  apioss:
    image: api-oss:latest
    ports:
      - "8081:8080"  # API endpoints
    volumes:
      - ./config.yml:/etc/apioss/config.yml

  swagger:
    image: swaggerapi/swagger-ui
    ports:
      - "8080:8080"  # Swagger UI
    environment:
      SWAGGER_JSON: /spec/openapi.yaml
      API_URL: http://localhost:8081  # API-OSS base URL
    volumes:
      - ./docs/spec:/spec
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `SWAGGER_JSON` | — | Path to OpenAPI spec inside container |
| `SWAGGER_JSON_URL` | — | URL to OpenAPI spec |
| `API_URL` | — | Override API base URL |
| `PORT` | `8080` | Swagger UI port |
| `VALIDATOR_URL` | `online.swagger.io` | Spec validator |

## Next Steps

- Browse the API at http://localhost:8080
- Generate client SDKs: `npx openapi-generator-cli generate -i docs/spec/openapi.yaml -g python`
- Test endpoints directly from the UI

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

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com