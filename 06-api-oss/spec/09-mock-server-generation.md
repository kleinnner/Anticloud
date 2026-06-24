---
title: "Mock Server Generation"
sidebar_position: 9
description: "Generate mock API servers from the OpenAPI spec for development and testing."
tags: [spec]
---

# Mock Server Generation

## Overview

Generate mock API servers from the OpenAPI spec for development and testing.

## Prism (Stoplight)

```bash
# Install
npm install -g @stoplight/prism-cli

# Start mock server
prism mock docs/spec/openapi.yaml -p 4010

# Test
curl http://localhost:4010/v1/chat \
  -H "Authorization: Bearer ak-test" \
  -d '{"model":"gpt-4","messages":[{"role":"user","content":"Hello"}]}'
```

### Dynamic Responses

```yaml
responses:
  '200':
    content:
      application/json:
        example:
          id: "chat-{faker.string.uuid()}"
          choices:
            - message:
                content: "{faker.lorem.sentence()}"
```

## OpenAPI Mock Server

```bash
# Install
npm install -g openapi-mock-server

# Start
openapi-mock-server \
  --spec docs/spec/openapi.yaml \
  --port 4010

# Custom responses file
openapi-mock-server \
  --spec docs/spec/openapi.yaml \
  --responses mock-responses.yaml \
  --port 4010
```

## Docker Mock

```bash
docker run -p 4010:4010 \
  -v $(pwd)/docs/spec:/spec \
  stoplight/prism:5 \
  mock /spec/openapi.yaml \
  -h 0.0.0.0
```

## Docker Compose

```yaml
version: "3.8"
services:
  apioss-mock:
    image: stoplight/prism:5
    command: mock /spec/openapi.yaml -h 0.0.0.0 -p 4010
    ports:
      - "4010:4010"
    volumes:
      - ./docs/spec:/spec

  app:
    build: .
    environment:
      APIOSS_URL: http://apioss-mock:4010
    depends_on:
      - apioss-mock
```

## Integration Testing

```javascript
// jest.setup.js
const { exec } = require('child_process');

beforeAll(() => {
  exec('prism mock docs/spec/openapi.yaml -p 4010 &');
  await new Promise(r => setTimeout(r, 3000));
});

afterAll(() => {
  exec('kill $(lsof -t -i:4010)');
});
```

## Next

- [10 Best Practices](10-best-practices.md)

## See Also

Related spec, API reference, and code generation documentation.

- [OpenAPI Spec](../spec/openapi.yaml)
- [API Reference](../api-reference/01-overview.md)
- [API Versioning](../spec/02-api-versioning.md)
- [Code Generation](../spec/04-code-generation.md)
