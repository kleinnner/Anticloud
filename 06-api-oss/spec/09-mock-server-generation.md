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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
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
