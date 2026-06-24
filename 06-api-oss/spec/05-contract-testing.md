---
title: "Contract Testing"
sidebar_position: 5
description: "Use the OpenAPI spec for contract testing to ensure API compatibility."
tags: [spec]
---

# Contract Testing

## Overview

Use the OpenAPI spec for contract testing to ensure API compatibility.

## Dredd

```bash
# Install Dredd
npm install -g dredd

# Run contract tests
dredd docs/spec/openapi.yaml \
  http://localhost:8080 \
  --hookfiles=./tests/hooks.js \
  --reporter=cli
```

### Hooks

```javascript
// tests/hooks.js
const hooks = require('hooks');

hooks.before('Chat > Create Chat Completion', (transaction) => {
  transaction.request.headers['Authorization'] = 'Bearer ak-test';
  transaction.request.body = JSON.stringify({
    model: 'gpt-4',
    messages: [{ role: 'user', content: 'Hello' }]
  });
});
```

## Pact

```javascript
// Consumer test
const { PactV3 } = require('@pact-foundation/pact');

const provider = new PactV3({
  consumer: 'my-app',
  provider: 'apioss',
});

describe('Chat API', () => {
  it('returns chat completion', async () => {
    provider
      .given('valid request')
      .uponReceiving('chat completion request')
      .withRequest({
        method: 'POST',
        path: '/v1/chat',
        headers: { Authorization: 'Bearer ak-test' },
        body: { model: 'gpt-4', messages: [] }
      })
      .willRespondWith({
        status: 200,
        body: { id: 'chat-123', choices: [] }
      });

    await provider.executeTest(async (mockServer) => {
      const response = await fetch(`${mockServer.url}/v1/chat`, {
        method: 'POST',
        headers: { Authorization: 'Bearer ak-test' },
        body: JSON.stringify({ model: 'gpt-4', messages: [] })
      });
      expect(response.status).toBe(200);
    });
  });
});
```

## Stoplight

```bash
# Spectral rules
npm install -g @stoplight/spectral-cli

# Custom ruleset
cat > .spectral.yml << 'EOF'
extends: spectral:oas
rules:
  my-rule:
    description: All responses must have examples
    given: $.paths.*.*.responses.*.content.*.example
    then:
      field: "@"
      function: truthy
EOF

spectral lint docs/spec/openapi.yaml
```

## CI Integration

```yaml
# .github/workflows/contract-tests.yml
- name: Start API-OSS
  run: docker compose up -d

- name: Run Dredd
  run: dredd docs/spec/openapi.yaml http://localhost:8080

- name: Run Spectral
  run: spectral lint docs/spec/openapi.yaml
```

## Next

- [06 Custom Extensions](06-custom-extensions.md)

## See Also

Related spec, API reference, and code generation documentation.

- [OpenAPI Spec](../spec/openapi.yaml)
- [API Reference](../api-reference/01-overview.md)
- [API Versioning](../spec/02-api-versioning.md)
- [Code Generation](../spec/04-code-generation.md)
