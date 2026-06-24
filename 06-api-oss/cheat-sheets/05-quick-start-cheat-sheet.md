---
title: "Quick Start Cheat Sheet"
sidebar_position: 5
description: "docker run -p 8080:8080 api-oss:latest"
tags: [cheat-sheets]
---

# Quick Start Cheat Sheet

## Deploy in 5 Minutes

```bash
# 1. Start API-OSS
docker run -p 8080:8080 api-oss:latest

# 2. Check health
curl http://localhost:8080/v1/health

# 3. Create a route
curl -X POST http://localhost:9090/v2/admin/routes \
  -H "Authorization: Bearer ak-admin" \
  -d '{"path":"/v1/chat","upstream":"https://api.openai.com"}'

# 4. Create API key
curl -X POST http://localhost:9090/v2/admin/keys \
  -H "Authorization: Bearer ak-admin" \
  -d '{"name":"my-key","role":"user"}'

# 5. Make API call
curl http://localhost:8080/v1/chat \
  -H "Authorization: Bearer ak-..." \
  -d '{"model":"gpt-4","messages":[{"role":"user","content":"Hello"}]}'
```

## Next Steps

```text
- Add rate limiting: config file
- Set up monitoring: /metrics endpoint
- Configure plugins: plugins section in config
- Enable auth: RBAC, SSO
- Deploy on K8s: Helm chart
```

## Next

- [Cheat Sheets Index](05-cheat-sheets-index.md)

## See Also

Related cheat sheets and reference documentation.

- [Cheat Sheets](../cheat-sheets/01-cheat-sheets-overview.md)
- [CLI Reference](../cli/01-getting-started.md)
- [Config Reference](../reference/03-configuration-schema.md)
- [Error Codes](../reference/04-error-codes.md)
