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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
