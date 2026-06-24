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
