---
title: "Tutorial 08: Custom Plugin"
sidebar_position: 8
description: "Create and deploy a custom API-OSS plugin."
tags: [tutorials]
---

# Tutorial 08: Custom Plugin

## Objective

Create and deploy a custom API-OSS plugin.

## Prerequisites

- API-OSS running
- Node.js 18+ or Python 3.10+

## Step 1: Create Plugin Directory

```bash
mkdir my-plugin
cd my-plugin
```

## Step 2: Write the Plugin (JavaScript)

```javascript
// plugin.js
module.exports = {
  name: 'my-custom-plugin',
  version: '1.0.0',
  description: 'Adds a custom header to all responses',

  hooks: {
    // Runs before the request is proxied
    async request(req, ctx) {
      console.log(`[MyPlugin] Request: ${req.method} ${req.path}`);
      return req;
    },

    // Runs after the upstream responds
    async response(res, ctx) {
      res.headers['X-My-Plugin'] = 'hello-from-plugin';
      res.headers['X-Request-ID'] = ctx.requestId;

      console.log(`[MyPlugin] Response: ${res.statusCode}`);
      return res;
    }
  }
};
```

## Step 3: Package the Plugin

```bash
# Create package.json
cat > package.json << 'EOF'
{
  "name": "my-custom-plugin",
  "version": "1.0.0",
  "description": "Custom header plugin",
  "main": "plugin.js"
}
EOF

# Create tar.gz
tar czf my-custom-plugin.tar.gz package.json plugin.js
```

## Step 4: Install the Plugin

```bash
curl -X POST http://localhost:8080/api/v1/plugins \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -F "file=@my-custom-plugin.tar.gz"
```

## Step 5: Attach to a Route

```bash
curl -X PUT http://localhost:8080/api/v1/routes/route-abc \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "plugins": ["my-custom-plugin"]
  }'
```

## Step 6: Test

```bash
curl -I http://localhost:8080/v1/hello \
  -H "Authorization: Bearer ak_..."
```

Look for `X-My-Plugin: hello-from-plugin` in the response headers.

## Python Version

```python
# plugin.py
from apioss import Plugin

class MyPlugin(Plugin):
    name = "my-custom-plugin"
    version = "1.0.0"

    async def on_request(self, request, context):
        print(f"[MyPlugin] {request.method} {request.path}")
        return request

    async def on_response(self, response, context):
        response.headers["X-My-Plugin"] = "hello-from-plugin"
        return response
```

## What You Learned

- Plugin structure and hooks
- Packaging plugins
- Installing custom plugins
- Request/response modification

## Next Tutorial

→ [09: Multi-Region Setup](09-multi-region.md)

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
